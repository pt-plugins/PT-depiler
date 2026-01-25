import urlJoin from "url-join";
import { toMerged } from "es-toolkit";

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { EResultParseStatus } from "@ptd/site";
import {
  AbstractMediaServer,
  IMediaServerBaseConfig,
  IMediaServerItem,
  IMediaServerMetadata,
  IMediaServerSearchOptions,
  IMediaServerSearchResult,
} from "@ptd/mediaServer";

export const mediaServerMetaData: IMediaServerMetadata = {
  description: "Plex 是一款流行的媒体服务器软件，支持多种设备和平台，提供丰富的媒体管理和播放功能",
  warning: ["apikey 可通过在console面板中查看 localStorage 中的 myPlexAccessToken 值"],
  auth_field: ["apikey"],
} as const;

interface IPlexConfig extends IMediaServerBaseConfig {
  type: "plex";
  auth: {
    apikey: string;
  };
}

export const mediaServerConfig: IPlexConfig = {
  type: "plex",
  name: "Plex",
  address: "",
  auth: {
    apikey: "",
  },
  timeout: 5000,
};

interface IPlexJsonResponse<T = any> {
  MediaContainer: T;
  error?: string;
  code?: number;
  message?: string;
}

interface IPlexIdentityData {
  apiVersion: string;
  claimed: boolean;
  machineIdentifier: string;
  size: number;
  version: string;
}

interface IPlexSearchItem {
  addedAt: number;
  allowSync: boolean;
  type: "movie" | "show";

  key: string;
  title: string;
  summary: string;
  thumb: string;

  librarySectionID: number;
  librarySectionTitle: string;
  librarySectionUUID: string;

  Genre: Array<{ tag: string }>;

  Media?: Array<{
    Part: Array<{
      container: string;
      duration: number;
      file: string;
      hasThumbnail: boolean;
      id: number;
      key: string;
      size: number;
    }>;
    aspectRatio: number;
    audioChannels: number;
    audioCodec: string;
    bitrate: number;
    container: string;
    duration: number;
    height: number;
    id: number;
    videoCodec: string;
    videoFrameRate: string;
    videoProfile: string;
    videoResolution: string;
    width: number;
  }>;

  audienceRating: number;
  duration: number;

  year: number;

  updatedAt: number;
}

interface IPlexRecentlyAddedItem extends Omit<IPlexSearchItem, "Media"> {
  parentTitle?: string; // 父标题，可能是系列名称
}

interface IPlexSearchData<T = IPlexSearchItem> {
  Metadata: T[];
  identifier: string;
  mediaTagPrefix: string;
  offset?: number;
  size: number;
  totalSize?: number;
}

export default class Plex extends AbstractMediaServer<IPlexConfig> {
  get apiBaseUrl(): string {
    let serverAddress = this.config.address;
    if (serverAddress.includes("/web/index.html")) {
      serverAddress = serverAddress.replace(/\/web\/index.html#.+/, "");
    }
    return serverAddress;
  }

  get webBaseUrl(): string {
    let serverAddress = this.config.address;
    if (serverAddress.includes("/web/index.html")) {
      serverAddress = serverAddress.replace(/\/web\/index.html#.+/, "");
    }
    return serverAddress.replace(/\/$/, "") + "/web/index.html";
  }

  protected async request<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config: AxiosRequestConfig<D> = {},
  ): Promise<R> {
    config.baseURL = this.apiBaseUrl;
    config.url = url;
    config.timeout ??= this.config.timeout; // 未额外传入 timeout 时，使用默认的 timeout
    config.method ??= "GET"; // 默认使用 GET 方法

    // 处理认证方式
    config.params ??= {};
    config.params["X-Plex-Token"] = this.config.auth.apikey;

    config.responseType = "json";
    return axios.request(config);
  }

  private async getServerIdentity(): Promise<string | undefined> {
    const response = await this.request<IPlexJsonResponse<IPlexIdentityData>>("/identity");
    return response.data?.MediaContainer?.machineIdentifier;
  }

  public override async ping(): Promise<boolean> {
    const serverIdentity = await this.getServerIdentity();
    return !!serverIdentity;
  }

  public override async getSearchResult(
    keywords: string = "",
    config: IMediaServerSearchOptions = {},
  ): Promise<IMediaServerSearchResult> {
    // 预定义搜索结果
    const result: IMediaServerSearchResult<IPlexSearchItem> = {
      status: EResultParseStatus.unknownError,
      items: [],
    };

    const serverIdentity = await this.getServerIdentity();

    // 生成基本请求参数
    let requestConfig: AxiosRequestConfig = { params: {} };
    config.startIndex = requestConfig.params["X-Plex-Container-Start"] = config.startIndex ?? 0;
    config.limit = requestConfig.params["X-Plex-Container-Size"] = config.limit ?? 50;
    requestConfig = toMerged(requestConfig, this.config.defaultSearchExtraRequestConfig ?? {});

    try {
      // 从服务器获取最新数据 /library/recentlyAdded
      let url = "/library/recentlyAdded";

      // 如果有 keywords 则进行搜索 /search?query=string   注意两个接口返回略有不同
      if (keywords !== "") {
        url = "/search";
        requestConfig.params.query = keywords;
      }

      const resp = await this.request<IPlexJsonResponse<IPlexSearchData>>(url, requestConfig);

      const items = resp?.data?.MediaContainer?.Metadata ?? [];
      for (const item of items) {
        const mediaItem: IMediaServerItem<IPlexSearchItem | IPlexRecentlyAddedItem> = {
          server: this.config.id!,
          // @ts-ignore
          name: item.parentTitle ? `${item.parentTitle} (${item.title})` : item.title,
          url: `${this.webBaseUrl}#!/server/${serverIdentity}/details?key=${item.key.replace(/\/children$/, "")}`,
          type: item.type === "movie" ? "Movie" : item.type,
          description: item.summary,
          // @ts-ignore
          format: item.Media?.[0]?.container ?? "",
          // @ts-ignore
          size: item.Media?.[0]?.Part?.[0].size ?? 0,
          duration: item.duration ?? 0,
          poster: item.thumb ? urlJoin(this.apiBaseUrl, `${item.thumb}?X-Plex-Token=${this.config.auth.apikey}`) : "",
          tags: item.Genre?.map((tag) => ({ name: tag.tag, url: "" })) ?? [],
          rating: item.audienceRating ?? "-", // Plex may not provide rating in search results
          streams: [], // Plex does not provide streams in search results
          user: { IsFavorite: false, IsPlayed: false }, // Plex does not provide user favorite status in search results
          raw: item, // Store the raw data for reference
        };
        result.items.push(mediaItem);
      }
      result.options = config;
      result.status = EResultParseStatus.success;
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 401) {
        result.status = EResultParseStatus.needLogin;
      }
    }

    return result;
  }
}
