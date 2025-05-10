import {
  AbstractMediaServer,
  IMediaServerBaseConfig,
  IMediaServerItem,
  IMediaServerMetadata,
  IMediaServerSearchOptions,
  IMediaServerSearchResult,
} from "../types.ts";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import urlJoin from "url-join";
import { toMerged } from "es-toolkit";
import { EResultParseStatus } from "@ptd/site";

export const mediaServerMetaData: IMediaServerMetadata = {
  description: "Emby 是一款开源的媒体服务器软件，支持多种平台和设备",
  warning: [
    "apikey 可通过在console面板中执行 `JSON.parse(localStorage.getItem('servercredentials3')).Servers[0].AccessToken` 来获取",
    "userId 可通过在console面板执行 `JSON.parse(localStorage.getItem('servercredentials3')).Servers[0].UserId` 获取",
  ],
  auth_field: ["apikey", "userId"],
} as const;

interface IEmbyConfig extends IMediaServerBaseConfig {
  auth: {
    apikey: string;
    userId: string;
  };
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

interface ISystemInfo {
  ServerName: string;
  Version: string;
  Id: string;
}

interface IQueryResultItem {
  Name: string;
  ServerId: string;
  Id: string;
  Container: string;
  MediaSources: Array<{
    Path: string;
    Container: string;
    Size: string;
    Name: string;
    MediaStreams: Array<
      {
        Codec: string;
        Title: string;
        DisplayTitle: string;
        IsDefault?: boolean;
      } & ({ Type: "Video" } | { Type: "Audio" } | { Type: "Subtitle" })
    >;
  }>;
  Path: string;
  CommunityRating: number;
  RunTimeTicks: number;
  Size: number;
  ProviderIds: Record<string, string>;
  ImageTags: {
    Primary?: string;
    Logo?: string;
    Thumb?: string;
  };
  MediaType: string;
}

interface IQueryResult {
  Items: IQueryResultItem[];
  TotalRecordCount: number;
}

export default class Emby extends AbstractMediaServer<IEmbyConfig> {
  protected async request<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config: AxiosRequestConfig<D> = {},
  ): Promise<R> {
    // 修正baseUrl，如果用户传入的地址为 https://127.0.0.1:8096 则将其修正为 https://127.0.0.1:8096/emby/
    let serverAddress = this.config.address;
    if (!serverAddress.includes("/emby/")) {
      serverAddress = urlJoin(serverAddress, "/emby/");
    }
    config.baseURL = serverAddress;

    // 未额外传入 timeout 时，使用默认的 timeout
    config.timeout ??= this.config.timeout;

    // 处理认证方式
    config.headers = {
      ...(config.headers ?? {}),
      "X-Emby-Token": this.config.auth.apikey,
    };

    // 处理请求url
    config.url = url;

    return axios.request(config);
  }

  public override async ping(): Promise<boolean> {
    try {
      const response = await this.request<ISystemInfo>("/System/Info", { responseType: "json" });
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
    const result: IMediaServerSearchResult<IQueryResultItem> = {
      status: EResultParseStatus.unknownError,
      items: [],
    };

    // 处理搜索参数
    let url = "/Items";
    if (this.config.auth.userId) {
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
      requestConfig.params["SortBy"] = "IsFavoriteOrLiked,Random";
    }
    requestConfig.params["IncludeItemTypes"] = "Movie,Series,Episode";
    requestConfig.params["Recursive"] = true;
    requestConfig.params["Limit"] = config.limit ?? 20;
    requestConfig.params["Fields"] =
      "BasicSyncInfo,Path,Status,ProviderIds,CommunityRating,MediaSources,DisplayPreferences,Genres,DateCreated,Overview";

    // 处理额外的请求配置
    if (config.extraRequestConfig) {
      requestConfig = toMerged(requestConfig, config.extraRequestConfig);
    }

    try {
      const response = await this.request<IQueryResult>(url, requestConfig);
      if (response.status === 200) {
        const {
          data: { Items = [] },
        } = response;
        for (const item of Items) {
          // 处理搜索结果
          const mediaItem: IMediaServerItem<IQueryResultItem> = {
            server: this.config.id!,
            name: item.Name,
            url: urlJoin(this.config.address, `/web/index.html#!/item?id=${item.Id}&serverId=${item.ServerId}`),
            type: item.MediaType,
            format: item.Container,
            size: item.Size,
            duration: item.RunTimeTicks / 10000000, // 10000 ticks = 1 ms, 10000 ms = 1 s
            poster: urlJoin(this.config.address, `/emby/Items/${item.Id}/Images/Primary`),
            streams: item.MediaSources?.[0]?.MediaStreams?.map((stream) => ({
              title: stream.DisplayTitle,
              type: stream.Type,
              format: stream.Codec,
            })),
            raw: item,
          };
          result.items.push(mediaItem);
        }
      }
      result.status = EResultParseStatus.success;
    } catch (e) {
      result.status = EResultParseStatus.parseError;
    }

    return result;
  }
}
