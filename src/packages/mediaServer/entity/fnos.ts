import {
  AbstractMediaServer,
  IMediaServerBaseConfig,
  IMediaServerItem,
  IMediaServerMetadata,
  IMediaServerSearchOptions,
  IMediaServerSearchResult,
} from "@ptd/mediaServer";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { EResultParseStatus } from "@ptd/site";
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
}

interface IFnOSMediaSource {
  Id?: string;
  Container?: string;
  Size?: number;
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
  };
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
  "People",
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

  protected async request<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config: AxiosRequestConfig<D> = {},
    retried = false,
  ): Promise<R> {
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
      return await axios.request(config);
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
    return {
      server: this.config.id!,
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
      streams: primaryMediaSource?.MediaStreams?.map((stream) => ({
        title: stream.Title || stream.DisplayTitle || stream.Codec || stream.Type,
        type: stream.Type,
        format: stream.Codec ?? "",
      })),
      user: {
        IsFavorite: item.UserData?.IsFavorite ?? false,
        IsPlayed: item.UserData?.Played ?? false,
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
