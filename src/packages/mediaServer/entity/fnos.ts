import {
  AbstractMediaServer,
  IMediaServerBaseConfig,
  IMediaServerItem,
  IMediaServerMetadata,
  IMediaServerOverview,
  IMediaServerOverviewOptions,
  IMediaServerSearchOptions,
  IMediaServerSearchResult,
} from "../types.ts";
import axios, { AxiosError, AxiosResponse } from "axios";
import { EResultParseStatus } from "@ptd/site";
import { createOverviewAccumulator } from "../utils.ts";
import { md5 } from "@noble/hashes/legacy.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";

export const mediaServerMetaData: IMediaServerMetadata = {
  description: "飞牛影视（fnOS trim.media）媒体服务器，直接使用影视应用的原生接口搜索媒体库",
  warning: [
    "地址填写飞牛 NAS 的访问地址即可（如 http://192.168.1.2:5666 或影视应用的 http://192.168.1.2:5666/v），无须追加 /emby。",
    "使用「飞牛影视」应用内的账号登录（与 NAS 账号是两套用户体系），请先在影视应用中完成初始化并创建用户。",
    "如果 NAS 开启了「访问码」，请一并填写；扩展会先通过网关校验访问码再登录。",
    "parentId 可选；填写媒体库/目录的 GUID 后，未输入关键词时的浏览范围会限制在该库/目录内。",
  ],
  auth_field: [
    "username",
    "password",
    { name: "accessCode", required: false, message: "可选：NAS 访问码（网关开启访问码保护时填写）" },
    { name: "parentId", required: false, message: "可选：媒体库/目录 GUID，留空则搜索全部媒体库" },
  ],
} as const;

interface IFnOSConfig extends IMediaServerBaseConfig {
  type: "fnos";
  auth: {
    username: string;
    password: string;
    accessCode?: string;
    parentId?: string;
  };
}

export const mediaServerConfig: IFnOSConfig = {
  type: "fnos",
  name: "飞牛影视",
  address: "",
  auth: {
    username: "",
    password: "",
    accessCode: "",
    parentId: "",
  },
  timeout: 5000,
};

/** 飞牛影视接口前缀：v1 为业务接口，v2 为登录接口 */
const FNOS_API_PATH = "/v/api/v1";
const FNOS_AUTH_PATH = "/v/api/v2";
/** 客户端签名常量：影视 Web 端内置的签名前缀与客户端密钥 */
const FNOS_SIGN_SALT = "NDzZTVxnRKP8Z0jXg1VAMonaG8akvh";
const FNOS_CLIENT_KEY = "16CCEB3D-AB42-077D-36A1-F355324E4237";
/** 访问码网关校验：0.9.x 走 header 契约，旧版回退 /c/{code} */
const FNOS_ACCESS_CODE_VERIFY_PATH = "/access_code_verify";
/** 会话失效（-2 Auth Failed / -15 Password Incorrect）后强制重新登录一次 */
const FNOS_AUTH_ERROR_CODES = new Set([-2, -15]);

interface IFnOSApiResponse<T = unknown> {
  code: number;
  msg?: string;
  data: T | null;
}

interface IFnOSSession {
  token: string;
}

interface IFnOSUserInfo {
  guid: string;
}

interface IFnOSMediaStream {
  /** 分辨率标签，如 ["720p"] */
  resolutions?: string[] | null;
  /** 音轨声道，如 ["Stereo"] */
  audio_type?: string[] | null;
  /** 色域，如 ["SDR"] */
  color_range_type?: string[] | null;
}

interface IFnOSNativeItem {
  guid: string;
  ancestor_guid?: string;
  ancestor_name?: string;
  ancestor_category?: string;
  type?: string;
  tv_title?: string;
  parent_title?: string;
  title?: string;
  original_title?: string;
  overview?: string;
  poster?: string;
  posters?: string;
  backdrops?: string;
  poster_width?: number;
  poster_height?: number;
  imdb_id?: string;
  douban_id?: number | string;
  /** 飞牛媒体身份：tt/tm 前缀 + 数字，前缀后的数字为 TMDB 标识 */
  trim_id?: string;
  release_date?: string;
  air_date?: string;
  vote_average?: string | number;
  season_number?: number;
  episode_number?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  duration?: number;
  /** 时长（分钟），部分接口用它代替 duration */
  runtime?: number;
  /** 已播放秒数 */
  ts?: number;
  /** 列表接口字段：是否已看完（0/1） */
  watched?: number;
  /** 详情接口字段：是否已看完（0/1） */
  is_watched?: number;
  /** 已播放秒数（详情接口兜底） */
  watched_ts?: number;
  is_favorite?: number;
  status?: string;
  media_stream?: IFnOSMediaStream;
}

interface IFnOSItemList {
  total?: number;
  list?: IFnOSNativeItem[];
}

/** 飞牛接口的业务错误（HTTP 200 但 code != 0） */
class FnOSApiError extends Error {
  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(message);
    this.name = "FnOSApiError";
  }
}

function normalizeAddress(address?: string): string {
  let raw = (address ?? "").trim();
  if (!raw) return "";
  if (!/^https?:\/\//i.test(raw)) {
    raw = `http://${raw}`;
  }
  try {
    // 统一去掉用户可能带上的 /v、/v/xxx、/web/...、/emby/... 等路径，只保留服务根地址
    return new URL(raw).origin;
  } catch (e) {
    return raw.replace(/\/+$/, "").replace(/\/(?:web|v|emby|jellyfin)(?:\/.*)?$/i, "");
  }
}

function getYear(date?: string): number | undefined {
  const matched = date?.match(/^(\d{4})/);
  return matched ? Number(matched[1]) : undefined;
}

/** 六位随机数：同时用于 authx 的 nonce 与 POST 请求体的防重放字段 */
function randomNonce(): string {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 访问码需要按 UTF-8 编码后再做 Base64（影视 Electron 客户端的契约） */
function toBase64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export default class FnOS extends AbstractMediaServer<IFnOSConfig> {
  private static sessionCache = new Map<string, IFnOSSession>();
  private static posterUrlCache = new Map<string, string>();
  /** 已通过访问码校验的 origin + 访问码，避免每次请求都重新走网关 */
  private static accessCodeGrants = new Set<string>();

  /** 服务根地址（协议 + 主机 + 端口） */
  get origin(): string {
    return normalizeAddress(this.config.address);
  }

  /** 影视应用的 Web 根地址（飞牛的影视前端固定挂在 /v 下） */
  get webBaseUrl(): string {
    return this.origin ? `${this.origin}/v` : "";
  }

  private get cacheKey(): string {
    return [this.origin, this.config.auth.username, this.config.auth.password, this.config.auth.accessCode ?? ""].join(
      "|",
    );
  }

  private get session(): IFnOSSession | undefined {
    return FnOS.sessionCache.get(this.cacheKey);
  }

  /**
   * 计算单次请求的 authx 签名。
   *
   * 飞牛影视 Web 端的算法：`md5(签名前缀_接口路径_nonce_时间戳_md5(签名数据)_客户端密钥)`，
   * 其中 GET 的签名数据是**未 URL 编码**的查询串，POST 的签名数据是实际发送的 JSON 字符串。
   */
  private sign(path: string, data: string): string {
    const nonce = randomNonce();
    const timestamp = String(Date.now());
    const dataHash = bytesToHex(md5(utf8ToBytes(data)));
    const sign = bytesToHex(
      md5(utf8ToBytes([FNOS_SIGN_SALT, path, nonce, timestamp, dataHash, FNOS_CLIENT_KEY].join("_"))),
    );
    return `nonce=${nonce}&timestamp=${timestamp}&sign=${sign}`;
  }

  private async send<T>(
    options: {
      path: string;
      basePath?: string;
      method?: "GET" | "POST" | "DELETE";
      data?: unknown;
      query?: Record<string, string | number | undefined>;
      token?: string;
      skipAuth?: boolean;
    },
    attempt = 0,
  ): Promise<IFnOSApiResponse<T>> {
    // 任何接口（包括不登录的 /sys/version）都可能被访问码网关拦截，先确保网关已放行
    await this.verifyAccessCode();

    const method = options.method ?? (options.data === undefined ? "GET" : "POST");
    const path = `${options.basePath ?? FNOS_API_PATH}${options.path}`;

    const queryEntries = Object.entries(options.query ?? {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    );
    const rawQuery = queryEntries.map(([key, value]) => `${key}=${value}`).join("&");
    const encodedQuery = queryEntries.map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`).join("&");

    // 飞牛客户端会给 POST/PUT 的请求体加一个随机数字段做防重放；服务端会忽略未知字段
    let payload = options.data;
    if (
      method !== "GET" &&
      payload !== undefined &&
      payload !== null &&
      typeof payload === "object" &&
      !Array.isArray(payload)
    ) {
      payload = { ...(payload as Record<string, unknown>), nonce: randomNonce() };
    }
    const body = method !== "GET" && payload !== undefined ? JSON.stringify(payload) : "";
    const token = options.token ?? (options.skipAuth ? undefined : this.session?.token);

    const headers: Record<string, string> = {
      "X-Trim-Client": "web",
      "X-Trim-Client-Version": "631",
      authx: this.sign(path, method === "GET" ? rawQuery : body),
    };
    if (token) {
      headers["Authorization"] = token;
    }
    if (body) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await axios.request<IFnOSApiResponse<T>>({
        baseURL: this.origin,
        url: `${path}${encodedQuery ? `?${encodedQuery}` : ""}`,
        method,
        data: body || undefined,
        headers,
        timeout: this.config.timeout,
        // 访问码网关的会话在 Cookie 里，带凭据才能自动携带（没有访问码时无副作用）
        withCredentials: true,
      });

      const data = response.data as unknown;
      if (!data || typeof data !== "object" || typeof (data as IFnOSApiResponse<T>).code !== "number") {
        // 地址指向了非影视服务（或被反向代理成前端页面）时，返回的会是 HTML 而不是业务 JSON
        throw new FnOSApiError(-1, "飞牛影视接口返回格式异常，请检查地址是否为飞牛影视服务");
      }

      // 签名可能因设备与服务端时钟偏差、网关多节点时钟漂移而偶发失效，换一组 nonce/时间戳重试
      const apiResponse = data as IFnOSApiResponse<T>;
      if (apiResponse.code === 5000 && /invalid sign/i.test(apiResponse.msg ?? "") && attempt < 2) {
        await sleep(100);
        return await this.send<T>(options, attempt + 1);
      }

      return apiResponse;
    } catch (e) {
      // 令牌过期时飞牛可能直接回 HTTP 401：强制重新登录后重试
      if (attempt < 2 && !options.skipAuth && e instanceof AxiosError && e.response?.status === 401) {
        FnOS.sessionCache.delete(this.cacheKey);
        await this.login(true);
        return await this.send<T>({ ...options, token: this.session?.token }, attempt + 1);
      }
      throw e;
    }
  }

  /**
   * 访问码网关校验。
   *
   * 0.9.x 使用 header 契约（`x-access-code` 为 UTF-8 访问码的 Base64、`x-access-source: web`），
   * 校验通过后网关在浏览器 Cookie 罐里种下会话，后续 API/图片请求会自动携带；
   * 旧版没有该接口时退回 `/c/{code}`。
   */
  private async verifyAccessCode(): Promise<void> {
    const accessCode = this.config.auth.accessCode?.trim();
    if (!accessCode) {
      return;
    }

    const grantKey = `${this.origin}|${accessCode}`;
    if (FnOS.accessCodeGrants.has(grantKey)) {
      return;
    }

    const requestConfig = {
      baseURL: this.origin,
      method: "GET" as const,
      timeout: this.config.timeout,
      withCredentials: true,
      validateStatus: () => true,
    };

    let response: AxiosResponse;
    try {
      response = await axios.request({
        ...requestConfig,
        url: FNOS_ACCESS_CODE_VERIFY_PATH,
        headers: {
          "x-access-code": toBase64Utf8(accessCode),
          "x-access-source": "web",
        },
      });
    } catch (e) {
      throw new FnOSApiError(-2, `飞牛访问码校验失败：${e instanceof Error ? e.message : String(e)}`);
    }

    if ([401, 403, 429].includes(response.status)) {
      throw new FnOSApiError(-2, "飞牛访问码错误或已失效");
    }

    // 旧版网关没有 header 校验接口，退回访问码路径
    if (response.status === 404 || response.status === 405) {
      try {
        response = await axios.request({ ...requestConfig, url: `/c/${encodeURIComponent(accessCode)}` });
      } catch (e) {
        throw new FnOSApiError(-2, `飞牛访问码校验失败：${e instanceof Error ? e.message : String(e)}`);
      }
      if (response.status === 404) {
        throw new FnOSApiError(-2, "飞牛访问码错误或已失效");
      }
    }

    if (response.status < 200 || response.status >= 300) {
      throw new FnOSApiError(-2, `飞牛访问码校验失败（HTTP ${response.status}）`);
    }

    FnOS.accessCodeGrants.add(grantKey);
  }

  private async login(force = false): Promise<IFnOSSession> {
    const username = this.config.auth.username?.trim();
    const password = this.config.auth.password ?? "";
    if (!username || !password) {
      throw new FnOSApiError(-2, "请先填写飞牛影视的用户名与密码");
    }

    const cachedSession = this.session;
    if (!force && cachedSession) {
      return cachedSession;
    }

    // v2 登录接口要求密码为 SHA-256 十六进制摘要
    const passwordHash = bytesToHex(sha256(utf8ToBytes(password)));
    let response: IFnOSApiResponse<{ token?: string }>;
    try {
      response = await this.send<{ token?: string }>({
        path: "/user/loginByPassword",
        basePath: FNOS_AUTH_PATH,
        method: "POST",
        data: { username, password: passwordHash, app_name: "trimemedia-web" },
        skipAuth: true,
      });
    } catch (e) {
      // 访问码/配置类错误不是「v2 接口不存在」，直接抛出，避免无意义地回退到 v1
      if (e instanceof FnOSApiError) {
        throw e;
      }
      // 旧版服务端没有 v2 登录接口时才回退到 v1 明文登录；v2 已返回业务失败则不回退
      response = await this.send<{ token?: string }>({
        path: "/login",
        method: "POST",
        data: { username, password, app_name: "trimemedia-web" },
        skipAuth: true,
      });
    }

    const token = response.data?.token;
    if (response.code !== 0 || !token) {
      throw new FnOSApiError(response.code || -15, response.msg || "飞牛影视登录失败，请检查用户名与密码");
    }

    const userResponse = await this.send<IFnOSUserInfo>({ path: "/user/info", token });
    if (userResponse.code !== 0 || !userResponse.data?.guid) {
      throw new FnOSApiError(userResponse.code || -2, userResponse.msg || "飞牛影视登录状态校验失败");
    }

    const session: IFnOSSession = { token };
    FnOS.sessionCache.set(this.cacheKey, session);
    return session;
  }

  private async request<T>(
    path: string,
    options: {
      method?: "GET" | "POST" | "DELETE";
      data?: unknown;
      query?: Record<string, string | number | undefined>;
    } = {},
    retried = false,
  ): Promise<T> {
    const session = await this.login();
    const response = await this.send<T>({ path, ...options, token: session.token });

    if (response.code === 0) {
      return response.data as T;
    }

    if (!retried && FNOS_AUTH_ERROR_CODES.has(response.code)) {
      FnOS.sessionCache.delete(this.cacheKey);
      await this.login(true);
      return await this.request<T>(path, options, true);
    }

    throw new FnOSApiError(response.code, response.msg || "飞牛影视接口请求失败");
  }

  public override async ping(): Promise<boolean> {
    try {
      const version = await this.send<{ version?: string; mediasrvVersion?: string }>({
        path: "/sys/version",
        skipAuth: true,
      });
      if (version.code !== 0) {
        return false;
      }
      const userInfo = await this.request<IFnOSUserInfo>("/user/info");
      return !!userInfo?.guid;
    } catch (e) {
      return false;
    }
  }

  /** 按关键词搜索（飞牛的搜索接口不分页，取全量后由调用方切页） */
  private async searchByKeyword(keywords: string): Promise<IFnOSNativeItem[]> {
    // 兼容 `imdb|tt1234567` 这类高级搜索写法：飞牛搜索接口只认关键词，取竖线后的部分
    const query = keywords.includes("|") ? keywords.split("|").pop()!.trim() : keywords;
    const items = await this.request<IFnOSNativeItem[]>("/search/list", { query: { q: query } });
    return Array.isArray(items) ? items : [];
  }

  /** 按创建时间倒序分页浏览媒体库（无关键词时的默认行为） */
  private async listItems(startIndex: number, limit: number): Promise<IFnOSNativeItem[]> {
    const pageSize = Math.max(1, limit);
    const page = Math.floor(startIndex / pageSize) + 1;
    const offset = startIndex % pageSize;
    const body: Record<string, unknown> = {
      tags: { type: ["Movie", "TV", "Video"] },
      sort_type: "DESC",
      sort_column: "create_time",
      page,
      page_size: pageSize,
      exclude_grouped_video: 1,
    };

    const parentId = this.config.auth.parentId?.trim();
    if (parentId) {
      body.ancestor_guid = parentId;
    }

    const data = await this.request<IFnOSItemList>("/item/list", { method: "POST", data: body });
    // startIndex 不一定是 pageSize 的整数倍时，从本页里裁掉已经展示过的条目
    return (data?.list ?? []).slice(offset);
  }

  private getItemWebUrl(item: IFnOSNativeItem): string {
    if (!this.webBaseUrl) return "";
    switch (item.type) {
      case "Movie":
        return `${this.webBaseUrl}/movie/${item.guid}`;
      case "TV":
        return `${this.webBaseUrl}/tv/${item.guid}`;
      case "Season":
        return `${this.webBaseUrl}/tv/season/${item.guid}`;
      case "Episode":
        return `${this.webBaseUrl}/tv/episode/${item.guid}`;
      default:
        return `${this.webBaseUrl}/other/${item.guid}`;
    }
  }

  private async getPoster(item: IFnOSNativeItem): Promise<string> {
    const posterPath = item.poster || item.posters;
    if (!posterPath) {
      return "";
    }

    const cacheKey = [this.cacheKey, posterPath].join("|");
    const cachedPosterUrl = FnOS.posterUrlCache.get(cacheKey);
    if (cachedPosterUrl) {
      return cachedPosterUrl;
    }

    try {
      const session = await this.login();
      const imagePath = `${FNOS_API_PATH}/sys/img${posterPath}`;
      const response = await axios.request<ArrayBuffer>({
        baseURL: this.origin,
        url: `${imagePath}?w=256`,
        method: "GET",
        responseType: "arraybuffer",
        timeout: this.config.timeout,
        withCredentials: true,
        headers: {
          Authorization: session.token,
          authx: this.sign(imagePath, ""),
          "X-Trim-Client": "web",
          "X-Trim-Client-Version": "631",
        },
      });
      const contentType = (response.headers["content-type"] as string | undefined) ?? "image/webp";
      const posterUrl = URL.createObjectURL(new Blob([response.data], { type: contentType }));
      this.setPosterCache(cacheKey, posterUrl);
      return posterUrl;
    } catch (e) {
      return "";
    }
  }

  private setPosterCache(cacheKey: string, posterUrl: string) {
    FnOS.posterUrlCache.set(cacheKey, posterUrl);
    if (FnOS.posterUrlCache.size <= 300) {
      return;
    }

    const firstCached = FnOS.posterUrlCache.entries().next().value as [string, string] | undefined;
    if (!firstCached) {
      return;
    }

    FnOS.posterUrlCache.delete(firstCached[0]);
    URL.revokeObjectURL(firstCached[1]);
  }

  private isPlayed(item: IFnOSNativeItem): boolean {
    return item.watched === 1 || item.is_watched === 1 || (item.ts ?? 0) > 0 || (item.watched_ts ?? 0) > 0;
  }

  private async buildMediaItem(
    item: IFnOSNativeItem,
    options: { withPoster?: boolean } = {},
  ): Promise<IMediaServerItem<IFnOSNativeItem>> {
    const duration =
      item.duration && item.duration > 0
        ? item.duration
        : item.runtime && item.runtime > 0
          ? item.runtime * 60
          : undefined;
    const position = item.ts || item.watched_ts || undefined;
    const rating = Number(item.vote_average);
    const year = getYear(item.release_date) ?? getYear(item.air_date);
    const resolutions = item.media_stream?.resolutions ?? [];
    const videoRange = item.media_stream?.color_range_type?.[0];

    // 飞牛的 trim_id 形如 tt123 / tm456：前缀区分电影/剧集，前缀后的数字是 TMDB 标识
    const tmdbId = item.trim_id?.match(/^(?:tt|tm)(\d+)$/)?.[1];

    const providerIds: Record<string, string> = {};
    if (item.imdb_id) providerIds.imdb = item.imdb_id;
    if (tmdbId) providerIds.tmdb = tmdbId;
    if (item.douban_id) providerIds.douban = String(item.douban_id);

    return {
      server: this.config.id!,
      id: item.guid,
      name: item.title || item.original_title || item.guid,
      url: this.getItemWebUrl(item),
      type: item.type ?? "Video",
      description: item.overview ?? "",
      duration,
      poster: options.withPoster === false ? "" : await this.getPoster(item),
      rating: Number.isFinite(rating) && rating > 0 ? rating : "-",
      mediaInfo:
        resolutions.length || videoRange
          ? {
              video: {
                resolution: resolutions[0],
                videoRange,
              },
            }
          : undefined,
      // 调研 A4–A6 / B7–B12：飞牛原生接口能提供的字段
      dateCreated: undefined,
      externalUrls: undefined,
      providerIds: Object.keys(providerIds).length > 0 ? providerIds : undefined,
      productionYear: year,
      premiereDate: item.release_date || item.air_date,
      childCount: item.number_of_seasons,
      recursiveItemCount: item.number_of_episodes,
      seriesName: item.tv_title || undefined,
      // 剧集条目：season_number 是季号，episode_number 是集号
      indexNumber: item.episode_number || undefined,
      parentIndexNumber: item.season_number || undefined,
      user: {
        IsFavorite: item.is_favorite === 1,
        IsPlayed: this.isPlayed(item),
        playbackPosition: position,
        playedPercentage:
          duration && position ? Math.min(100, Math.max(0, Math.round((position / duration) * 100))) : undefined,
      },
      raw: item,
    };
  }

  public override async getItemDetail(itemId: string): Promise<IMediaServerItem<IFnOSNativeItem> | undefined> {
    try {
      const item = await this.request<IFnOSNativeItem>(`/item/${itemId}`);
      if (item?.guid) {
        return await this.buildMediaItem(item);
      }
    } catch (e) {
      // 详情拿不到就只展示列表已有的信息
    }
    return undefined;
  }

  /**
   * 调研 C14 / C20：**按需**生成媒体库概览。
   * 通过 `/item/list` 分页遍历媒体库就地聚合，只为统计数字服务，因此不拉取海报。
   */
  public override async getLibraryOverview(
    options: IMediaServerOverviewOptions = {},
  ): Promise<IMediaServerOverview | undefined> {
    const pageSize = Math.max(1, Math.min(options.pageSize ?? 200, 500));
    const maxItems = Math.max(pageSize, options.maxItems ?? 20000);
    const accumulator = createOverviewAccumulator();

    let scanned = 0;
    let truncated = false;
    let page = 1;

    while (scanned < maxItems) {
      const size = Math.min(pageSize, maxItems - scanned);
      const parentId = this.config.auth.parentId?.trim();
      const body: Record<string, unknown> = {
        tags: { type: ["Movie", "TV", "Video"] },
        sort_type: "DESC",
        sort_column: "create_time",
        page,
        page_size: size,
        exclude_grouped_video: 1,
      };
      if (parentId) {
        body.ancestor_guid = parentId;
      }

      const data = await this.request<IFnOSItemList>("/item/list", { method: "POST", data: body });
      const items = data?.list ?? [];
      if (items.length === 0) break;

      for (const rawItem of items) {
        accumulator.add(await this.buildMediaItem(rawItem, { withPoster: false }));
      }
      scanned += items.length;
      if (data?.total && scanned >= data.total) break;
      if (items.length < size) break;

      page += 1;
      if (scanned >= maxItems) {
        truncated = true;
      }
    }

    return accumulator.build(this.config.id!, truncated);
  }

  public override async getSearchResult(
    keywords: string = "",
    config: IMediaServerSearchOptions = {},
  ): Promise<IMediaServerSearchResult> {
    const result: IMediaServerSearchResult<IFnOSNativeItem> = {
      status: EResultParseStatus.unknownError,
      items: [],
    };

    config.startIndex = config.startIndex ?? 0;
    config.limit = config.limit ?? 50;

    try {
      let items: IFnOSNativeItem[];
      if (keywords.trim() !== "") {
        // 搜索接口一次返回全部结果，这里按 startIndex/limit 切页
        items = await this.searchByKeyword(keywords.trim());
        items = items.slice(config.startIndex, config.startIndex + config.limit);
      } else {
        items = await this.listItems(config.startIndex, config.limit);
      }

      const dedupedItems = new Map<string, IFnOSNativeItem>();
      for (const item of items) {
        if (["Movie", "TV", "Video"].includes(item.type ?? "") && !dedupedItems.has(item.guid)) {
          dedupedItems.set(item.guid, item);
        }
      }

      result.items = await Promise.all(Array.from(dedupedItems.values()).map((item) => this.buildMediaItem(item)));
      result.options = config;
      result.status = EResultParseStatus.success;
    } catch (e) {
      if (e instanceof FnOSApiError && FNOS_AUTH_ERROR_CODES.has(e.code)) {
        result.status = EResultParseStatus.needLogin;
      } else if (e instanceof AxiosError && e.response?.status === 401) {
        result.status = EResultParseStatus.needLogin;
      } else {
        result.status = EResultParseStatus.parseError;
      }
      result.errorMessage = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    }

    return result;
  }
}
