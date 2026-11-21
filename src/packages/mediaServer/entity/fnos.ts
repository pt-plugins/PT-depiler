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
import axios, { AxiosError } from "axios";
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
    "parentId 可选；填写媒体库/目录的 GUID 后，未输入关键词时的浏览范围会限制在该库/目录内。",
  ],
  auth_field: [
    "username",
    "password",
    { name: "parentId", required: false, message: "可选：媒体库/目录 GUID，留空则搜索全部媒体库" },
  ],
} as const;

interface IFnOSConfig extends IMediaServerBaseConfig {
  type: "fnos";
  auth: {
    username: string;
    password: string;
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

export default class FnOS extends AbstractMediaServer<IFnOSConfig> {
  private static sessionCache = new Map<string, IFnOSSession>();
  private static posterUrlCache = new Map<string, string>();

  /** 服务根地址（协议 + 主机 + 端口） */
  get origin(): string {
    return normalizeAddress(this.config.address);
  }

  /** 影视应用的 Web 根地址（飞牛的影视前端固定挂在 /v 下） */
  get webBaseUrl(): string {
    return this.origin ? `${this.origin}/v` : "";
  }

  private get cacheKey(): string {
    return [this.origin, this.config.auth.username, this.config.auth.password].join("|");
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
    const nonce = String(Math.floor(Math.random() * 900000) + 100000);
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
    retried = false,
  ): Promise<IFnOSApiResponse<T>> {
    const method = options.method ?? (options.data === undefined ? "GET" : "POST");
    const path = `${options.basePath ?? FNOS_API_PATH}${options.path}`;

    const queryEntries = Object.entries(options.query ?? {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    );
    const rawQuery = queryEntries.map(([key, value]) => `${key}=${value}`).join("&");
    const encodedQuery = queryEntries.map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`).join("&");

    const body = method !== "GET" && options.data !== undefined ? JSON.stringify(options.data) : "";
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
      });

      const data = response.data as unknown;
      if (!data || typeof data !== "object" || typeof (data as IFnOSApiResponse<T>).code !== "number") {
        // 地址指向了非影视服务（或被反向代理成前端页面）时，返回的会是 HTML 而不是业务 JSON
        throw new FnOSApiError(-1, "飞牛影视接口返回格式异常，请检查地址是否为飞牛影视服务");
      }
      return data as IFnOSApiResponse<T>;
    } catch (e) {
      // 令牌过期时飞牛可能直接回 HTTP 401：强制重新登录后重试一次
      if (!retried && !options.skipAuth && e instanceof AxiosError && e.response?.status === 401) {
        FnOS.sessionCache.delete(this.cacheKey);
        await this.login(true);
        return await this.send<T>({ ...options, token: this.session?.token }, true);
      }
      throw e;
    }
  }

  private async login(force = false): Promise<IFnOSSession> {
    const cachedSession = this.session;
    if (!force && cachedSession) {
      return cachedSession;
    }

    const username = this.config.auth.username?.trim();
    const password = this.config.auth.password ?? "";
    if (!username || !password) {
      throw new FnOSApiError(-2, "请先填写飞牛影视的用户名与密码");
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
    const duration = item.duration && item.duration > 0 ? item.duration : undefined;
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
