import {
  AbstractMediaServer,
  IMediaServerBaseConfig,
  IMediaServerItem,
  IMediaServerMetadata,
  IMediaServerOverview,
  IMediaServerOverviewOptions,
  IMediaServerSearchOptions,
  IMediaServerSearchResult,
} from "../types";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { EResultParseStatus } from "@ptd/site";
import { createOverviewAccumulator, getPlayedPercentage, getResolutionLabel, getRootPath } from "../utils.ts";
import { toMerged } from "es-toolkit";
import urlJoin from "url-join";

export const mediaServerMetaData: IMediaServerMetadata = {
  description: "飞牛影视 / FNOS 媒体服务器，使用 FNOS 的 Emby-compatible API 搜索媒体库",
  warning: [
    "使用飞牛影视用户名和密码登录，扩展会调用 FNOS 登录接口自动获取访问 token。",
    "parentId 可选；如果不填，扩展会自动读取媒体库视图并在视图下搜索。",
  ],
  auth_field: [
    "username",
    "password",
    { name: "parentId", required: false, message: "可选：指定要搜索的媒体库/视图 ID" },
  ],
} as const;

interface IFnOSConfig extends IMediaServerBaseConfig {
  type: "fnos";
  auth: {
    username: string;
    password: string;
    parentId?: string;
    apikey?: string;
    userId?: string;
    sessionId?: string;
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
    apikey: "",
    userId: "",
    sessionId: "",
  },
  timeout: 5000,
};

interface IFnOSSystemInfo {
  ServerName: string;
  Version: string;
  ProductName: string;
  Id: string;
}

interface IFnOSLoginResponse {
  User: {
    Id: string;
    Name: string;
  };
  SessionInfo?: {
    Id?: string;
  };
  AccessToken: string;
  ServerId: string;
}

interface IFnOSViewItem {
  Name: string;
  Id: string;
  Type: string;
  CollectionType?: string;
}

interface IFnOSQueryResult<T = IFnOSQueryItem> {
  Items: T[];
  TotalRecordCount: number;
  StartIndex: number;
}

interface IFnOSMediaStream {
  Codec?: string;
  Title?: string;
  DisplayTitle?: string;
  Type: "Video" | "Audio" | "Subtitle" | string;
  IsDefault?: boolean;
  Language?: string;
  Width?: number;
  Height?: number;
  BitRate?: number;
  AverageFrameRate?: number;
  Profile?: string;
  VideoRange?: string;
  VideoRangeType?: string;
  Channels?: number;
  ChannelLayout?: string;
  /** 是否外挂字幕 */
  IsExternal?: boolean;
}

interface IFnOSMediaSource {
  Id?: string;
  Container?: string;
  Size?: number;
  /** 文件路径（调研 A3） */
  Path?: string;
  /** 该媒体源总码率（bps） */
  Bitrate?: number;
  MediaStreams?: IFnOSMediaStream[];
}

interface IFnOSQueryItem {
  Id: string;
  Name: string;
  Type: "Movie" | "Series" | string;
  MediaType?: string;
  Overview?: string;
  Container?: string;
  Size?: number;
  MediaSources?: IFnOSMediaSource[];
  RunTimeTicks?: number;
  CommunityRating?: number;
  ImageTags?: {
    Primary?: string;
    Backdrop?: string;
  };
  GenreItems?: Array<{
    Id: string;
    Name: string;
  }>;
  UserData?: {
    IsFavorite?: boolean;
    Played?: boolean;
    /** 调研 A6：播放次数 / 已观看 ticks / 最近观看 */
    PlayCount?: number;
    PlaybackPositionTicks?: number;
    LastPlayedDate?: string;
  };

  // —— 调研 A3–A6 / B7–B12：fnOS 是 Emby 兼容 API，字段名与 Emby 同名 ——
  Path?: string;
  DateCreated?: string;
  ExternalUrls?: Array<{ Name: string; Url: string }>;
  ProviderIds?: Record<string, string>;
  ProductionYear?: number;
  PremiereDate?: string;
  OfficialRating?: string;
  CustomRating?: string;
  CriticRating?: number;
  Studios?: Array<{ Name: string; Id?: string }>;
  MediaSourceCount?: number;
  ChildCount?: number;
  RecursiveItemCount?: number;
  SeriesName?: string;
  IndexNumber?: number;
  ParentIndexNumber?: number;
  IsHd?: boolean;
  Width?: number;
  Height?: number;
  Tags?: string[];
  Taglines?: string[];
  /** 演职人员（只在详情接口要，列表不要） */
  People?: Array<{ Name: string; Role?: string; Type?: string; Id?: string }>;
}

interface IFnOSSession {
  apikey: string;
  userId: string;
  sessionId?: string;
}

const FNOS_SEARCH_FIELDS = [
  "Path",
  "Status",
  "ExternalUrls",
  "CommunityRating",
  "MediaSources",
  "DisplayPreferences",
  "Genres",
  "DateCreated",
  "Overview",
  "ExtraIds",
  "ImageTags",
  "PremiereDate",
  "ProductionYear",
  "ChildCount",
  "CanDownload",
  "Chapters",
  "PrimaryImageAspectRatio",
  "UserData",
  "ProviderIds",
  "Tags",
  "Taglines",
  "OfficialRating",
  "CustomRating",
  "CriticRating",
  "Studios",
  "MediaSourceCount",
  "RecursiveItemCount",
  "SeriesName",
  "IndexNumber",
  "ParentIndexNumber",
  "IsHd",
  "Width",
  "Height",
  "Size",
].join(",");

export default class FnOS extends AbstractMediaServer<IFnOSConfig> {
  private static sessionCache = new Map<string, IFnOSSession>();
  private static posterUrlCache = new Map<string, string>();

  /**
   * 修正为 FNOS 服务根路径。FNOS 的 JSON API 使用 /emby，/v 和 /jellyfin 都是 Web 前端路径。
   */
  get baseUrl() {
    let serverAddress = this.config.address.trim();
    serverAddress = serverAddress.replace(/\/+$/, "");
    serverAddress = serverAddress.replace(/\/(?:web|v)(?:\/.*)?$/i, "");
    serverAddress = serverAddress.replace(/\/(?:emby|jellyfin)(?:\/.*)?$/i, "");

    return serverAddress;
  }

  get apiBaseUrl() {
    return urlJoin(this.baseUrl, "/emby/");
  }

  get webBaseUrl() {
    return urlJoin(this.baseUrl, "/v");
  }

  private get cacheKey() {
    return [this.baseUrl, this.config.auth.username].join("|");
  }

  private get deviceId() {
    return `pt-depiler-${this.config.id ?? this.cacheKey}`.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 96);
  }

  private getAuthorizationHeader(userId?: string) {
    const userIdPart = userId ? `UserId="${userId}", ` : "";
    return `Emby ${userIdPart}Client="PT-depiler", Device="Chrome", DeviceId="${this.deviceId}", Version="${__EXT_VERSION__}"`;
  }

  private get session(): IFnOSSession | undefined {
    const cachedSession = FnOS.sessionCache.get(this.cacheKey);
    if (cachedSession) {
      return cachedSession;
    }

    if (this.config.auth.apikey && this.config.auth.userId) {
      return {
        apikey: this.config.auth.apikey,
        userId: this.config.auth.userId,
        sessionId: this.config.auth.sessionId,
      };
    }

    return undefined;
  }

  private setSession(session: IFnOSSession) {
    this.config.auth.apikey = session.apikey;
    this.config.auth.userId = session.userId;
    this.config.auth.sessionId = session.sessionId ?? "";
    FnOS.sessionCache.set(this.cacheKey, session);
  }

  private async login(force = false): Promise<IFnOSSession> {
    const existingSession = this.session;
    if (!force && existingSession) {
      return existingSession;
    }

    const response = await axios.request<IFnOSLoginResponse>({
      baseURL: this.apiBaseUrl,
      url: "/Users/AuthenticateByName",
      method: "POST",
      timeout: this.config.timeout,
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        "X-Emby-Authorization": this.getAuthorizationHeader(),
      },
      data: {
        Username: this.config.auth.username,
        Pw: this.config.auth.password,
      },
    });

    const session = {
      apikey: response.data.AccessToken,
      userId: response.data.User.Id,
      sessionId: response.data.SessionInfo?.Id,
    };
    this.setSession(session);
    return session;
  }

  protected async request<T = any, D = any>(
    url: string,
    config: AxiosRequestConfig<D> = {},
    retried = false,
  ): Promise<AxiosResponse<T, D>> {
    const session = await this.login();

    config.baseURL = this.apiBaseUrl;
    config.url = url;
    config.timeout ??= this.config.timeout;
    config.responseType ??= "json";
    config.headers = {
      ...(config.headers ?? {}),
      "X-Emby-Token": session.apikey,
      "X-Emby-Authorization": this.getAuthorizationHeader(session.userId),
    };

    try {
      return await axios.request<T>(config);
    } catch (e) {
      if (!retried && e instanceof AxiosError && e.response?.status === 401) {
        await this.login(true);
        return await this.request(url, config, true);
      }

      throw e;
    }
  }

  public override async ping(): Promise<boolean> {
    try {
      const response = await this.request<IFnOSSystemInfo>("/System/Info");
      if (response.status === 200 && response.data?.Id) {
        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  }

  private async getViewIds(): Promise<string[]> {
    const parentId = this.config.auth.parentId?.trim();
    if (parentId) {
      return [parentId];
    }

    const session = await this.login();
    const response = await this.request<IFnOSQueryResult<IFnOSViewItem>>(`/Users/${session.userId}/Views`, {
      params: {
        IncludeExternalContent: false,
      },
    });

    return response.data.Items?.map((item) => item.Id).filter(Boolean) ?? [];
  }

  private async queryItems(
    parentId: string,
    keywords: string,
    options: IMediaServerSearchOptions,
    multiViewMode: boolean,
  ): Promise<IFnOSQueryItem[]> {
    const session = await this.login();
    const requestConfig: AxiosRequestConfig = {
      params: {
        ParentId: parentId,
        Recursive: true,
        StartIndex: multiViewMode ? 0 : options.startIndex,
        Limit: multiViewMode ? (options.startIndex ?? 0) + (options.limit ?? 50) : options.limit,
        Fields: FNOS_SEARCH_FIELDS,
      },
    };

    if (keywords !== "") {
      requestConfig.params.SearchTerm = keywords;
      requestConfig.params.IncludeItemTypes = "Movie,Series";
    }

    const mergedConfig = toMerged(requestConfig, this.config.defaultSearchExtraRequestConfig ?? {});
    const response = await this.request<IFnOSQueryResult>(`/Users/${session.userId}/Items`, mergedConfig);

    return response.data.Items ?? [];
  }

  private async getPoster(item: IFnOSQueryItem): Promise<string> {
    const primaryTag = item.ImageTags?.Primary;
    if (!primaryTag) {
      return "";
    }

    const cacheKey = [this.cacheKey, item.Id, primaryTag].join("|");
    const cachedPosterUrl = FnOS.posterUrlCache.get(cacheKey);
    if (cachedPosterUrl) {
      return cachedPosterUrl;
    }

    try {
      const response = await this.request<Blob>(`/Items/${item.Id}/Images/Primary`, {
        params: { tag: primaryTag },
        responseType: "blob",
      });
      const posterUrl = URL.createObjectURL(response.data);
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

  private async buildMediaItem(item: IFnOSQueryItem): Promise<IMediaServerItem<IFnOSQueryItem>> {
    const itemType = item.Type || item.MediaType || "";
    const primaryMediaSource = item.MediaSources?.[0];
    const mediaStreams = primaryMediaSource?.MediaStreams ?? [];
    const videoStream = mediaStreams.find((stream) => stream.Type === "Video");
    const streamTitle = (stream: IFnOSMediaStream) =>
      stream.Title || stream.DisplayTitle || stream.Codec || stream.Type;
    const userData = item.UserData;

    return {
      server: this.config.id!,
      id: item.Id,
      name: item.Name,
      url: this.getItemUrl(item),
      type: itemType,
      description: item.Overview ?? "",
      format: item.Container ?? primaryMediaSource?.Container ?? "",
      size: primaryMediaSource?.Size ?? item.Size,
      duration: item.RunTimeTicks ? item.RunTimeTicks / 10000000 : undefined,
      poster: await this.getPoster(item),
      tags: item.GenreItems?.map((tag) => ({
        name: tag.Name,
        url: "",
      })),
      rating: item.CommunityRating ?? "-",
      streams: mediaStreams.map((stream) => ({
        title: streamTitle(stream),
        type: stream.Type,
        format: stream.Codec ?? "",
      })),
      // 调研 A2：媒体详情结构化透出
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
                  bitrate: videoStream.BitRate ?? primaryMediaSource?.Bitrate,
                  frameRate: videoStream.AverageFrameRate,
                }
              : undefined,
            audio: mediaStreams
              .filter((stream) => stream.Type === "Audio")
              .map((stream) => ({
                title: streamTitle(stream),
                codec: stream.Codec,
                language: stream.Language,
                channels: stream.Channels,
                channelLayout: stream.ChannelLayout,
                isDefault: stream.IsDefault,
              })),
            subtitle: mediaStreams
              .filter((stream) => stream.Type === "Subtitle")
              .map((stream) => ({
                title: streamTitle(stream),
                codec: stream.Codec,
                language: stream.Language,
                isExternal: stream.IsExternal,
                isDefault: stream.IsDefault,
              })),
          }
        : undefined,
      // 调研 A3 / A4 / A5
      path: primaryMediaSource?.Path ?? item.Path,
      dateCreated: item.DateCreated,
      externalUrls: item.ExternalUrls?.map((externalUrl) => ({ name: externalUrl.Name, url: externalUrl.Url })),
      // 调研 B7–B12
      providerIds: item.ProviderIds,
      productionYear: item.ProductionYear,
      premiereDate: item.PremiereDate,
      officialRating: item.OfficialRating,
      criticRating: item.CriticRating,
      studios: item.Studios?.map((studio) => studio.Name),
      mediaSourceCount: item.MediaSourceCount ?? item.MediaSources?.length,
      childCount: item.ChildCount,
      recursiveItemCount: item.RecursiveItemCount,
      seriesName: item.SeriesName,
      indexNumber: item.IndexNumber,
      parentIndexNumber: item.ParentIndexNumber,
      isHd: item.IsHd,
      width: item.Width,
      height: item.Height,
      labels: item.Tags,
      taglines: item.Taglines,
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

  private getItemUrl(item: IFnOSQueryItem) {
    if (item.Type === "Movie") {
      const movieGuid = item.ImageTags?.Primary ?? item.MediaSources?.[0]?.Id ?? item.Id;
      return urlJoin(this.webBaseUrl, `/movie/${movieGuid}`);
    }

    if (item.Type === "Series") {
      return urlJoin(this.webBaseUrl, `/tv/${item.Id}`);
    }

    return this.webBaseUrl;
  }

  /** 详情接口额外要的重字段（列表刻意不含，调研 B12） */
  private static readonly DETAIL_FIELDS = [...FNOS_SEARCH_FIELDS, "People", "MediaStreams", "MediaSources"];

  /**
   * 调研 B12：详情弹窗按需拉取单条目（Emby 兼容的 `/Items/{id}`），复用同一套映射。
   * 不支持的服务器（或 404）返回 undefined，UI 静默降级。
   */
  public override async getItemDetail(itemId: string): Promise<IMediaServerItem<IFnOSQueryItem> | undefined> {
    try {
      const response = await this.request<IFnOSQueryItem>(`/Items/${itemId}`, {
        params: { Fields: FnOS.DETAIL_FIELDS.join(",") },
      });
      const item = response.data;
      if (response.status === 200 && item?.Id) {
        return await this.buildMediaItem(item);
      }
    } catch (e) {
      // 忽略：详情拿不到就只展示列表已有的信息
    }
    return undefined;
  }

  /**
   * 调研 C14 / C20：**按需**生成媒体库概览。
   * 复用本类已有的「按媒体库视图分页」机制（{@link getViewIds} + {@link queryItems}），
   * 就地聚合后只返回 {@link IMediaServerOverview} 统计结果。
   */
  public override async getLibraryOverview(
    options: IMediaServerOverviewOptions = {},
  ): Promise<IMediaServerOverview | undefined> {
    const pageSize = Math.max(1, Math.min(options.pageSize ?? 200, 500));
    const maxItems = Math.max(pageSize, options.maxItems ?? 20000);
    const accumulator = createOverviewAccumulator();

    const viewIds = await this.getViewIds();
    const multiViewMode = viewIds.length > 1;
    const dedupedItems = new Map<string, IFnOSQueryItem>();

    let truncated = false;
    const collect = (items: IFnOSQueryItem[]) => {
      for (const item of items) {
        if (dedupedItems.size >= maxItems) {
          truncated = true;
          return;
        }
        if ((item.Type === "Movie" || item.Type === "Series") && !dedupedItems.has(item.Id)) {
          dedupedItems.set(item.Id, item);
        }
      }
    };

    for (const viewId of viewIds) {
      if (multiViewMode) {
        // 多视图模式：queryItems 会返回「0 → startIndex+limit」的窗口，这里一次要满即可
        collect(await this.queryItems(viewId, "", { startIndex: 0, limit: maxItems }, true));
      } else {
        // 单视图模式：后端正常分页，按页拉取
        let startIndex = 0;
        while (dedupedItems.size < maxItems) {
          const limit = Math.min(pageSize, maxItems - dedupedItems.size);
          const items = await this.queryItems(viewId, "", { startIndex, limit }, false);
          if (items.length === 0) break;

          collect(items);
          startIndex += items.length;
          if (items.length < limit) break;
        }
      }

      if (truncated) break;
    }

    for (const item of dedupedItems.values()) {
      accumulator.add(await this.buildMediaItem(item));
    }

    return accumulator.build(this.config.id!, truncated);
  }

  public override async getSearchResult(
    keywords: string = "",
    config: IMediaServerSearchOptions = {},
  ): Promise<IMediaServerSearchResult> {
    const result: IMediaServerSearchResult<IFnOSQueryItem> = {
      status: EResultParseStatus.unknownError,
      items: [],
    };

    config.startIndex = config.startIndex ?? 0;
    config.limit = config.limit ?? 50;

    try {
      const viewIds = await this.getViewIds();
      const multiViewMode = viewIds.length > 1;
      const queryResults = await Promise.all(
        viewIds.map((viewId) => this.queryItems(viewId, keywords, config, multiViewMode)),
      );
      const dedupedItems = new Map<string, IFnOSQueryItem>();
      for (const item of queryResults.flat()) {
        if ((item.Type === "Movie" || item.Type === "Series") && !dedupedItems.has(item.Id)) {
          dedupedItems.set(item.Id, item);
        }
      }

      const items = Array.from(dedupedItems.values());
      const pagedItems = multiViewMode ? items.slice(config.startIndex, config.startIndex + config.limit) : items;
      result.items = await Promise.all(pagedItems.map((item) => this.buildMediaItem(item)));
      result.options = config;
      result.status = EResultParseStatus.success;
    } catch (e) {
      if (e instanceof AxiosError && [400, 401, 403].includes(e.response?.status ?? 0)) {
        result.status = EResultParseStatus.needLogin;
      } else {
        result.status = EResultParseStatus.parseError;
      }
    }

    return result;
  }
}
