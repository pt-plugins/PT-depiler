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
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import urlJoin from "url-join";
import { toMerged } from "es-toolkit";
import { EResultParseStatus } from "@ptd/site";
import {
  createOverviewAccumulator,
  getPlayedPercentage,
  getResolutionLabel,
  normalizeLanguage,
  normalizeProviderIds,
  parseResolutionFromTitle,
} from "../utils.ts";

export const mediaServerMetaData: IMediaServerMetadata = {
  description: "Emby 是一款家庭媒体库管理软件，能整理服务器上的音视频并流式传输到客户端设备，提供良好的影音体验",
  warning: [
    'apikey, userId 可通过在console面板中执行 var c = JSON.parse(localStorage.getItem("servercredentials3")).Servers[0]; c.Users.filter(u => u.UserId == c.UserId)[0] 来获取',
    "apikey 也可以在 `API 密钥` 中设置，或网络请求等其他地方中获取， userId 也可以在 url 等其他地方获取。（ 请参见 Wiki ）",
  ],
  auth_field: ["apikey", { name: "userId", required: false, message: "可以额外获取用户喜欢、观看情况" }],
} as const;

export interface IEmbyConfig extends IMediaBrowserConfig {
  type: "emby";
}

export const mediaServerConfig: IEmbyConfig = {
  type: "emby",
  name: "Emby",
  address: "",
  auth: {
    apikey: "",
    userId: "",
  },
  timeout: 5000,
};

export interface IEmbySystemInfo {
  ServerName: string;
  Version: string;
  Id: string;
}

export interface IEmbyQueryItem {
  Name: string;
  ServerId: string;
  Id: string;
  Overview: string;
  Container: string;
  MediaSources: Array<{
    Path: string;
    Container: string;
    Size: number;
    Name: string;
    /** 该媒体源的总体码率（bps） */
    Bitrate?: number;
    MediaStreams: Array<
      {
        Codec: string;
        Title: string;
        DisplayTitle: string;
        IsDefault?: boolean;
        /** 语言（ISO 639-2/3，如 chi / eng / jpn） */
        Language?: string;
        // 视频流
        Width?: number;
        Height?: number;
        BitRate?: number;
        AverageFrameRate?: number;
        Profile?: string;
        /** SDR / HDR10 / HLG … */
        VideoRange?: string;
        /** 更细的色域类型，如 DolbyVision */
        VideoRangeType?: string;
        // 音频流
        Channels?: number;
        ChannelLayout?: string;
        // 字幕
        /** 是否外挂字幕 */
        IsExternal?: boolean;
      } & ({ Type: "Video" } | { Type: "Audio" } | { Type: "Subtitle" })
    >;
  }>;
  Path: string;
  CommunityRating?: number;
  RunTimeTicks: number;
  Size: number;
  ImageTags: {
    Primary?: string;
    Logo?: string;
    Thumb?: string;
  };
  GenreItems: Array<{
    Name: string;
    Id: number;
  }>;
  MediaType: string;
  /** 入库时间 */
  DateCreated?: string;
  /** 外部链接（IMDb / TMDb …） */
  ExternalUrls?: Array<{
    Name: string;
    Url: string;
  }>;
  // —— 调研 B8–B12 需要的字段 ——
  ProductionYear?: number;
  PremiereDate?: string;
  OfficialRating?: string;
  CustomRating?: string;
  CriticRating?: number;
  Studios?: Array<{ Name: string; Id?: number }>;
  MediaSourceCount?: number;
  ChildCount?: number;
  RecursiveItemCount?: number;
  SeriesName?: string;
  IndexNumber?: number;
  ParentIndexNumber?: number;
  IsHd?: boolean;
  Width?: number;
  Height?: number;
  /** 自定义标签：Emby 实际放在 `TagItems` 里（`Tags` 通常是字符串数组，可能不返回） */
  TagItems?: Array<{ Name: string; Id?: number }>;
  Tags?: string[];
  Taglines?: string[];
  /** 外部标识：imdb / tmdb / tvdb … */
  ProviderIds?: Record<string, string>;
  /** 演职人员（**只在详情接口要**，列表不要） */
  People?: Array<{ Name: string; Role?: string; Type?: string; Id?: string }>;
  UserData: {
    IsFavorite: boolean;
    PlayCount: number;
    PlaybackPositionTicks: number;
    Played: boolean;
    /** 最近观看时间 */
    LastPlayedDate?: string;
  };
}

export interface IEmbyQueryResult<T extends any> {
  Items: T[];
  TotalRecordCount: number;
}

/** MediaBrowser 家族的配置形状：apikey 必填，userId 可选（有的话能拿到「喜欢 / 已看」状态） */
export interface IMediaBrowserConfig extends IMediaServerBaseConfig {
  auth: {
    apikey: string;
    userId: string;
  };
}

/**
 * Emby 与 Jellyfin 共用的基类（审计 §3.5：两者 76% 逐字相同）。
 *
 * Jellyfin 是 Emby 3.5.2 的分支，`/System/Info`、`/Items` 的请求与条目映射几乎逐字一致，
 * 真正的差异只有四类，全部做成下面的挂点，其余流程（`ping` / `request` / `getSearchResult` 的
 * 骨架、条目映射、错误与状态处理）都在基类里共享：
 *
 * 1. **鉴权头** `authHeaders`：Emby 用 `X-Emby-Token`，Jellyfin 用 `Authorization: MediaBrowser Token="…"`；
 * 2. **查询参数命名** `buildSearchRequest`：Emby 用 PascalCase，Jellyfin 用 camelCase；
 * 3. **Web UI 链接形状** `getItemWebUrl` / `getTagWebUrl` / `getPosterUrl`；
 * 4. **条目体积位置** `getItemSize`：Emby 在顶层 `Size`，Jellyfin 在 `MediaSources[0].Size`。
 *
 * 基类只描述接口、不注册为媒体服务器实体 —— `mediaServer/index.ts` 是按名字取
 * `default` / `mediaServerConfig` / `mediaServerMetaData` 的，多导出这个类不影响注册。
 */
export abstract class MediaBrowser<
  TConfig extends IMediaBrowserConfig = IMediaBrowserConfig,
  TQueryItem extends Omit<IEmbyQueryItem, "Size"> = IEmbyQueryItem,
> extends AbstractMediaServer<TConfig> {
  /** JSON API 的入口地址（Emby 需要补 `/emby/`，Jellyfin 就是用户填的根地址） */
  public abstract get apiBaseUrl(): string;

  /** 鉴权头：两家取值不同，Emby 还会混用 `X-Emby-Token` */
  protected abstract get authHeaders(): Record<string, string>;

  /** 组装搜索请求：路径（`/Items` 还是 `/Users/{id}/Items`）与参数命名的差异都在子类里 */
  protected abstract buildSearchRequest(
    keywords: string,
    options: IMediaServerSearchOptions,
  ): { url: string; requestConfig: AxiosRequestConfig };

  /** 条目在各自 Web UI 里的详情页地址 */
  protected abstract getItemWebUrl(item: TQueryItem): string;

  /** 条目标签（流派）在 Web UI 里的筛选地址 */
  protected abstract getTagWebUrl(tag: IEmbyQueryItem["GenreItems"][number], item: TQueryItem): string;

  /** 海报地址 */
  protected abstract getPosterUrl(item: TQueryItem): string;

  /**
   * 条目体积。Emby 的 `/Items` 在顶层返回 `Size`，Jellyfin 只在 `MediaSources[0].Size` 里给，
   * 所以默认取顶层、Jellyfin 覆写。
   */
  protected getItemSize(item: TQueryItem): number | undefined {
    // 列表接口给顶层 Size；详情接口（/Items/{id}）不一定给，回退到首个媒体源
    const typed = item as Partial<IEmbyQueryItem>;
    return typed.Size ?? typed.MediaSources?.[0]?.Size;
  }

  /**
   * 列表接口额外请求的**轻量**字段（调研 B8–B12）。
   * `People` 这类会让响应明显变大的字段不在这里 —— 见 {@link detailExtraFields}。
   */
  protected readonly listExtraFields: string[] = [
    "ProviderIds",
    "ProductionYear",
    "PremiereDate",
    "OfficialRating",
    "CustomRating",
    "CriticRating",
    "Studios",
    "MediaSourceCount",
    "ChildCount",
    "RecursiveItemCount",
    "SeriesName",
    "IndexNumber",
    "ParentIndexNumber",
    "IsHd",
    "Width",
    "Height",
    "Tags",
    "Taglines",
  ];

  /** 只在详情弹窗按需拉取时才要的字段（含列表里刻意不要的重字段） */
  protected readonly detailExtraFields: string[] = [...this.listExtraFields, "People", "MediaStreams", "MediaSources"];

  /**
   * 调研 B12：详情弹窗打开时按需拉取完整条目。
   * 列表接口只带轻量字段，这里再要一次 `People` 等重字段，并复用同一套映射。
   */
  /** 子类按各自 API 组装「取单条目」的请求（Emby 没有 /Items/{id} 这个路由） */
  protected abstract buildItemDetailRequest(
    itemId: string,
    fields: string[],
  ): { url: string; requestConfig: AxiosRequestConfig };

  /**
   * 调研 B12：详情弹窗打开时按需拉取完整条目。
   *
   * ⚠️ 不能直接请求 `/Items/{id}` —— Emby 没有这个路由（实测返回「找不到文件」）。
   * 各子类在 {@link buildItemDetailRequest} 里选择可用路由，这里统一兼容两种响应形状：
   * 单条目对象，或集合接口的 `{ Items: [...] }`。
   */
  public override async getItemDetail(itemId: string): Promise<IMediaServerItem | undefined> {
    const { url, requestConfig } = this.buildItemDetailRequest(itemId, this.detailExtraFields);
    const response = await this.request<IEmbyQueryItem & IEmbyQueryResult<TQueryItem>>(url, requestConfig);
    if (response.status !== 200) return undefined;

    const data = response.data as IEmbyQueryItem & IEmbyQueryResult<TQueryItem>;
    const item = Array.isArray(data?.Items) ? data.Items[0] : data;
    return item?.Id ? this.mapQueryItem(item as TQueryItem) : undefined;
  }

  /** 概览遍历每页要的字段：比列表多要 MediaStreams/MediaSources，用于统计分辨率与码率 */
  protected readonly overviewFields: string[] = [
    "MediaSources",
    "MediaStreams",
    "DateCreated",
    "ProductionYear",
    "ProviderIds",
  ];

  /** 子类用自己的参数命名（Emby PascalCase / Jellyfin camelCase）拼一个「遍历整库」请求 */
  protected abstract buildOverviewRequest(
    startIndex: number,
    limit: number,
    fields: string[],
  ): { url: string; requestConfig: AxiosRequestConfig };

  /**
   * 调研 C14 / C20：分页遍历整库并**就地聚合**，只返回统计结果（不把条目搬给 UI）。
   * 达到 `maxItems` 提前结束并标记 `truncated`；一条都拿不到（未认证/不支持）返回 undefined。
   */
  public override async getLibraryOverview(
    options: IMediaServerOverviewOptions = {},
  ): Promise<IMediaServerOverview | undefined> {
    const pageSize = Math.max(1, Math.min(options.pageSize ?? 200, 500));
    const maxItems = Math.max(pageSize, options.maxItems ?? 20000);
    const accumulator = createOverviewAccumulator();

    let scanned = 0;
    let truncated = false;

    while (scanned < maxItems) {
      const { url, requestConfig } = this.buildOverviewRequest(
        scanned,
        Math.min(pageSize, maxItems - scanned),
        this.overviewFields,
      );
      const response = await this.request<IEmbyQueryResult<TQueryItem>>(url, requestConfig);
      if (response.status !== 200) break;

      const items = response.data?.Items ?? [];
      if (items.length === 0) break;

      for (const rawItem of items) {
        accumulator.add(this.mapQueryItem(rawItem));
      }
      scanned += items.length;

      if (items.length < pageSize) break;
      if (scanned >= maxItems) {
        truncated = true;
      }
    }

    return accumulator.build(this.config.id!, truncated);
  }

  protected async request<T = any, D = any>(
    url: string,
    config: AxiosRequestConfig<D> = {},
  ): Promise<AxiosResponse<T, D>> {
    config.baseURL = this.apiBaseUrl;
    config.timeout ??= this.config.timeout; // 未额外传入 timeout 时，使用默认的 timeout

    // 处理认证方式
    config.headers = {
      ...(config.headers ?? {}),
      ...this.authHeaders,
    };

    // 处理请求url
    config.url = url;

    return axios.request<T>(config);
  }

  public override async ping(): Promise<boolean> {
    try {
      const response = await this.request<IEmbySystemInfo>("/System/Info", { responseType: "json" });
      if (response.status === 200 && response.data?.Id) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  public override async getSearchResult(
    keywords: string = "",
    config: IMediaServerSearchOptions = {},
  ): Promise<IMediaServerSearchResult> {
    // 预定义搜索结果
    const result: IMediaServerSearchResult<TQueryItem> = {
      status: EResultParseStatus.unknownError,
      items: [],
    };

    const { url, requestConfig } = this.buildSearchRequest(keywords, config);

    try {
      const response = await this.request<IEmbyQueryResult<TQueryItem>>(url, requestConfig);
      if (response.status === 200) {
        const {
          data: { Items = [] },
        } = response;
        for (const item of Items) {
          // 处理搜索结果
          result.items.push(this.mapQueryItem(item));
        }
        result.options = config;
        result.status = EResultParseStatus.success;
      } else {
        result.status = EResultParseStatus.needLogin;
      }
    } catch (e) {
      // 401 是认证问题（needLogin），其余（超时、网络不可达、解析异常等）不是认证问题，
      // 需要把真实错误带回去，避免 UI 统一提示「请检查认证信息」误导排障（#1396）
      if (e instanceof AxiosError && e.response?.status === 401) {
        result.status = EResultParseStatus.needLogin;
      } else {
        result.status = EResultParseStatus.parseError;
      }
      result.errorMessage = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    }

    return result;
  }

  /** 把各家的查询条目映射成统一的 `IMediaServerItem`，差异通过上面的挂点注入 */
  protected mapQueryItem(item: TQueryItem): IMediaServerItem<TQueryItem> {
    const mediaSource = item.MediaSources?.[0];
    const mediaStreams = mediaSource?.MediaStreams ?? [];
    const videoStream = mediaStreams.find((s) => s.Type === "Video");
    const userData = item.UserData;

    const streamTitle = (s: (typeof mediaStreams)[number]) => s.Title ?? s.DisplayTitle;

    return {
      server: this.config.id!,
      id: item.Id,
      name: item.Name,
      url: this.getItemWebUrl(item),
      type: item.MediaType,
      description: item.Overview ?? "",
      format: item.Container,
      size: this.getItemSize(item),
      duration: item.RunTimeTicks / 10000000, // 10000 ticks = 1 ms, 10000 ms = 1 s
      poster: this.getPosterUrl(item),
      tags: item.GenreItems?.map((tag) => ({
        name: tag.Name,
        url: this.getTagWebUrl(tag, item),
      })),
      rating: item.CommunityRating ?? "-",
      streams: mediaStreams.map((stream) => ({
        title: streamTitle(stream),
        type: stream.Type,
        format: stream.Codec,
      })),
      // 调研 A2：把媒体详情结构化透出，页面不必再读 raw
      mediaInfo: mediaStreams.length
        ? {
            video: videoStream
              ? {
                  width: videoStream.Width,
                  height: videoStream.Height,
                  resolution:
                    parseResolutionFromTitle(videoStream.DisplayTitle) ??
                    getResolutionLabel(videoStream.Width, videoStream.Height),
                  codec: videoStream.Codec,
                  profile: videoStream.Profile,
                  videoRange: videoStream.VideoRangeType ?? videoStream.VideoRange,
                  bitrate: videoStream.BitRate ?? mediaSource?.Bitrate,
                  frameRate: videoStream.AverageFrameRate,
                }
              : undefined,
            audio: mediaStreams
              .filter((s) => s.Type === "Audio")
              .map((s) => ({
                title: streamTitle(s),
                codec: s.Codec,
                language: normalizeLanguage(s.Language),
                channels: s.Channels,
                channelLayout: s.ChannelLayout,
                isDefault: s.IsDefault,
              })),
            subtitle: mediaStreams
              .filter((s) => s.Type === "Subtitle")
              .map((s) => ({
                title: streamTitle(s),
                codec: s.Codec,
                language: normalizeLanguage(s.Language),
                isExternal: s.IsExternal,
                isDefault: s.IsDefault,
              })),
          }
        : undefined,
      // 调研 A3 / A4 / A5
      path: mediaSource?.Path ?? item.Path,
      dateCreated: item.DateCreated,
      externalUrls: item.ExternalUrls?.map((externalUrl) => ({
        name: externalUrl.Name,
        url: externalUrl.Url,
      })),
      // 调研 B7–B12
      providerIds: normalizeProviderIds(item.ProviderIds),
      productionYear: item.ProductionYear,
      premiereDate: item.PremiereDate,
      officialRating: item.OfficialRating,
      criticRating: item.CriticRating,
      studios: item.Studios?.map((studio) => studio.Name),
      // Emby 不返回 MediaSourceCount，用 MediaSources 数量兜底
      mediaSourceCount: item.MediaSourceCount ?? item.MediaSources?.length,
      childCount: item.ChildCount,
      recursiveItemCount: item.RecursiveItemCount,
      seriesName: item.SeriesName,
      indexNumber: item.IndexNumber,
      parentIndexNumber: item.ParentIndexNumber,
      isHd: item.IsHd,
      width: item.Width,
      height: item.Height,
      // Emby 把自定义标签放在 TagItems；Tags 常常不返回
      labels: item.TagItems?.length ? item.TagItems.map((tag) => tag.Name) : item.Tags,
      taglines: item.Taglines,
      // People 只在详情接口出现，这里限制条数避免 UI 过长
      people: item.People?.slice(0, 12).map((person) => ({
        name: person.Name,
        role: person.Role,
        type: person.Type,
      })),
      user: {
        IsFavorite: userData?.IsFavorite ?? false,
        IsPlayed: userData?.Played ?? false,
        // 调研 A6：观看深度
        playCount: userData?.PlayCount,
        playbackPosition: userData?.PlaybackPositionTicks ? userData.PlaybackPositionTicks / 10000000 : undefined,
        playedPercentage: getPlayedPercentage(userData?.PlaybackPositionTicks, item.RunTimeTicks, userData?.Played),
        lastPlayedDate: userData?.LastPlayedDate,
      },
      raw: item,
    };
  }
}

export default class Emby extends MediaBrowser<IEmbyConfig, IEmbyQueryItem> {
  /**
   * 修正baseUrl，如果用户传入的地址为 https://127.0.0.1:8096/web/index.html 或者 https://127.0.0.1:8096/
   * 则将其修正为 JSON API 入口 https://127.0.0.1:8096/emby/
   */
  public override get apiBaseUrl() {
    let serverAddress = this.config.address;
    if (!serverAddress.includes("/emby/")) {
      serverAddress = serverAddress.replace(/\/web\/index.html#.+/, "");
      serverAddress = urlJoin(serverAddress, "/emby/");
    }

    return serverAddress;
  }

  public get webBaseUrl() {
    let serverAddress = this.config.address;
    serverAddress = serverAddress.replace(/\/web\/index.html#.+/, "");
    return urlJoin(serverAddress, "/web/index.html");
  }

  protected override get authHeaders(): Record<string, string> {
    return {
      "X-Emby-Token": this.config.auth.apikey,
    };
  }

  protected override buildSearchRequest(
    keywords: string,
    config: IMediaServerSearchOptions,
  ): { url: string; requestConfig: AxiosRequestConfig } {
    // 处理搜索参数
    let url = "/Items";
    const hasUserId = this.config.auth.userId && this.config.auth.userId != "";
    if (hasUserId) {
      // 如果有 userId，则使用 userId 进行搜索
      url = `/Users/${this.config.auth.userId}/Items`;
    }

    let requestConfig: AxiosRequestConfig = { params: {} };
    if (keywords != "") {
      // 首先检查是否是高级关键词
      if (keywords.startsWith("imdb|")) {
        requestConfig.params["AnyProviderIdEquals"] = "imdb." + keywords.split("|")[1];
      } else {
        // 如果不是，则直接扔入 SearchTerm
        requestConfig.params["SearchTerm"] = keywords;
      }
    } else {
      // 如果没有关键词，则展示推荐？
      requestConfig.params["SortBy"] = (hasUserId ? "IsFavoriteOrLiked," : "") + "Random";
    }
    requestConfig.params["IncludeItemTypes"] = "Movie,Series";
    requestConfig.params["Recursive"] = true;
    config.startIndex = requestConfig.params["startIndex"] = config.startIndex ?? 0;
    config.limit = requestConfig.params["Limit"] = config.limit ?? 50;
    requestConfig.params["Fields"] =
      "BasicSyncInfo,Path,Status,ExternalUrls,CommunityRating,MediaSources,DisplayPreferences,Genres,DateCreated,Overview,ExtraIds," +
      this.listExtraFields.join(",");

    // 处理额外的请求配置
    requestConfig = toMerged(requestConfig, this.config.defaultSearchExtraRequestConfig ?? {});

    return { url, requestConfig };
  }

  protected override buildItemDetailRequest(
    itemId: string,
    fields: string[],
  ): { url: string; requestConfig: AxiosRequestConfig } {
    const params: Record<string, unknown> = { Fields: fields.join(",") };

    // Emby 的单条目接口在用户维度下：GET /Users/{UserId}/Items/{ItemId}
    if (this.config.auth.userId) {
      return { url: `/Users/${this.config.auth.userId}/Items/${itemId}`, requestConfig: { params } };
    }

    // 没配 userId 时退回集合接口：GET /Items?Ids={id}（与搜索同一条已被验证可用的路由）
    return { url: "/Items", requestConfig: { params: { ...params, Ids: itemId, Recursive: true } } };
  }

  protected override buildOverviewRequest(
    startIndex: number,
    limit: number,
    fields: string[],
  ): { url: string; requestConfig: AxiosRequestConfig } {
    const hasUserId = this.config.auth.userId && this.config.auth.userId != "";
    const requestConfig: AxiosRequestConfig = {
      params: {
        IncludeItemTypes: "Movie,Series",
        Recursive: true,
        SortBy: "DateCreated",
        SortOrder: "Descending",
        startIndex,
        Limit: limit,
        Fields: fields.join(","),
      },
    };

    return {
      url: hasUserId ? `/Users/${this.config.auth.userId}/Items` : "/Items",
      requestConfig: toMerged(requestConfig, this.config.defaultSearchExtraRequestConfig ?? {}),
    };
  }

  protected override getItemWebUrl(item: IEmbyQueryItem): string {
    return this.webBaseUrl + `#!/item?id=${item.Id}&serverId=${item.ServerId}`;
  }

  protected override getTagWebUrl(tag: IEmbyQueryItem["GenreItems"][number], item: IEmbyQueryItem): string {
    return this.webBaseUrl + `#!/list/list.html?genreId=${tag.Id}&serverId=${item.ServerId}`;
  }

  protected override getPosterUrl(item: IEmbyQueryItem): string {
    return urlJoin(this.apiBaseUrl, `/Items/${item.Id}/Images/Primary`);
  }
}
