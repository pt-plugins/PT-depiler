import {
  AbstractMediaServer,
  IMediaServerBaseConfig,
  IMediaServerItem,
  IMediaServerMetadata,
  IMediaServerSearchOptions,
  IMediaServerSearchResult,
} from "../types.ts";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import urlJoin from "url-join";
import { toMerged } from "es-toolkit";
import { EResultParseStatus } from "@ptd/site";
import { getPlayedPercentage, getResolutionLabel } from "../utils.ts";

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
    return (item as Partial<IEmbyQueryItem>).Size;
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
                  resolution: getResolutionLabel(videoStream.Width, videoStream.Height),
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
                language: s.Language,
                channels: s.Channels,
                channelLayout: s.ChannelLayout,
                isDefault: s.IsDefault,
              })),
            subtitle: mediaStreams
              .filter((s) => s.Type === "Subtitle")
              .map((s) => ({
                title: streamTitle(s),
                codec: s.Codec,
                language: s.Language,
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
      "BasicSyncInfo,Path,Status,ExternalUrls,CommunityRating,MediaSources,DisplayPreferences,Genres,DateCreated,Overview,ExtraIds";

    // 处理额外的请求配置
    requestConfig = toMerged(requestConfig, this.config.defaultSearchExtraRequestConfig ?? {});

    return { url, requestConfig };
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
