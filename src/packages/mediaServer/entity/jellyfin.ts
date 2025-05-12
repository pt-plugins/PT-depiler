import {
  AbstractMediaServer,
  IMediaServerBaseConfig,
  IMediaServerItem,
  IMediaServerMetadata,
  IMediaServerSearchOptions,
  IMediaServerSearchResult,
} from "@ptd/mediaServer";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  IEmbyQueryItem,
  IEmbyQueryResult,
  IEmbySystemInfo as IJellyfinSystemInfo,
} from "@ptd/mediaServer/entity/emby.ts";
import { EResultParseStatus } from "@ptd/site";
import { toMerged } from "es-toolkit";
import urlJoin from "url-join";

export const mediaServerMetaData: IMediaServerMetadata = {
  description: "Jellyfin 是一个由志愿者开发的开源媒体系统，可让用户自由管理和流式传输个人媒体内容，支持多平台多语言",
  warning: [
    'apikey, userId 可通过在console面板中执行 var c = JSON.parse(localStorage.getItem("jellyfin_credentials")).Servers[0]; console.log({AccessToken: c.AccessToken, UserId: c.UserId}); 来获取',
    "apikey 也可以在 `API 密钥` 中设置，或网络请求等其他地方中获取， userId 也可以在 url 等其他地方获取。（ 请参见 Wiki ）",
  ],
  auth_field: ["apikey", { name: "userId", required: false, message: "可以额外获取用户喜欢、观看情况" }],
} as const;

interface IJellyfinConfig extends IMediaServerBaseConfig {
  type: "jellyfin";
  auth: {
    apikey: string;
    userId: string;
  };
}

export const mediaServerConfig: IJellyfinConfig = {
  type: "jellyfin",
  name: "Jellyfin",
  address: "",
  auth: {
    apikey: "",
    userId: "",
  },
  timeout: 5000,
};

interface IJellyfinQueryItem extends Omit<IEmbyQueryItem, "Size"> {}

/**
 * Jellyfin 的多数 API 和 Emby 相同
 */
export default class Jellyfin extends AbstractMediaServer<IJellyfinConfig> {
  /**
   * 修正baseUrl，如果用户传入的地址为 http://127.0.0.1:8096/web/#/home.html 或者 https://127.0.0.1:8096/
   * 则将其修正为入口 https://127.0.0.1:8096/
   */
  get baseUrl() {
    let serverAddress = this.config.address;
    serverAddress = serverAddress.replace(/web\/(#\/home.html.+)?/, "");

    return serverAddress;
  }

  protected async request<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config: AxiosRequestConfig<D> = {},
  ): Promise<R> {
    config.baseURL = this.baseUrl;
    config.timeout ??= this.config.timeout; // 未额外传入 timeout 时，使用默认的 timeout

    config.headers = {
      ...(config.headers ?? {}),
      /**
       * 这里我们混用 Authorize with API key 和 Authorize with access token （因为实测对 access token 来说，不一定需要传 Client 等 params）
       * docs: https://gist.github.com/nielsvanvelzen/ea047d9028f676185832e51ffaf12a6f
       */
      Authorization: `MediaBrowser Token="${this.config.auth.apikey}"`,
    };

    // 处理请求url
    config.url = url;

    return axios.request(config);
  }

  public async ping(): Promise<boolean> {
    try {
      const response = await this.request<IJellyfinSystemInfo>("/System/Info", { responseType: "json" });
      if (response.status === 200 && response.data?.Id) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  public async getSearchResult(
    keywords: string = "",
    config: IMediaServerSearchOptions = {},
  ): Promise<IMediaServerSearchResult> {
    // 预定义搜索结果
    const result: IMediaServerSearchResult<{}> = {
      status: EResultParseStatus.unknownError,
      items: [],
    };

    const hasUserId = this.config.auth.userId && this.config.auth.userId != "";

    let url = "/Items";
    let requestConfig: AxiosRequestConfig = { params: {} };

    if (hasUserId) {
      requestConfig.params["userId"] = this.config.auth.userId;
    }
    if (keywords != "") {
      // Jellyfin 不支持 AnyProviderIdEquals 搜索词，直接将 keywords 扔入 SearchTerm
      requestConfig.params["searchTerm"] = keywords;
    } else {
      // 如果没有关键词，则展示推荐？
      requestConfig.params["sortBy"] = (hasUserId ? "IsFavoriteOrLiked," : "") + "Random";
    }

    requestConfig.params["includeItemTypes"] = "Movie,Series";
    requestConfig.params["recursive"] = true;
    config.startIndex = requestConfig.params["startIndex"] = config.startIndex ?? 0;
    config.limit = requestConfig.params["limit"] = config.limit ?? 50;
    requestConfig.params["fields"] =
      "Path,Status,ExternalUrls,CommunityRating,MediaSources,DisplayPreferences,Genres,DateCreated,Overview,ExtraIds";

    // 处理额外的请求配置
    requestConfig = toMerged(requestConfig, this.config.defaultSearchExtraRequestConfig ?? {});

    try {
      const response = await this.request<IEmbyQueryResult<IJellyfinQueryItem>>(url, requestConfig);
      if (response.status === 200) {
        const {
          data: { Items = [] },
        } = response;
        for (const item of Items) {
          // 处理搜索结果

          const mediaItem: IMediaServerItem<IJellyfinQueryItem> = {
            server: this.config.id!,
            name: item.Name,
            url: urlJoin(this.baseUrl, `/web/#/details?id=${item.Id}&serverId=${item.ServerId}`),
            type: item.MediaType,
            description: item.Overview ?? "",
            format: item.Container,
            size: item.MediaSources?.[0]?.Size,
            duration: item.RunTimeTicks / 10000000, // 10000 ticks = 1 ms, 10000 ms = 1 s
            poster: urlJoin(this.baseUrl, `/Items/${item.Id}/Images/Primary`),
            tags: item.GenreItems?.map((tag) => ({
              name: tag.Name,
              url: urlJoin(this.baseUrl, `/web/#/list.html?genreId=${tag.Id}&serverId=${item.ServerId}`),
            })),
            rating: item.CommunityRating ?? "-",
            streams: item.MediaSources?.[0]?.MediaStreams?.map((stream) => ({
              title: stream.Title ?? stream.DisplayTitle,
              type: stream.Type,
              format: stream.Codec,
            })),
            user: {
              IsFavorite: item.UserData?.IsFavorite ?? false,
              IsPlayed: item.UserData?.Played ?? false,
            },
            raw: item,
          };
          result.items.push(mediaItem);
        }
        result.options = config;
        result.status = EResultParseStatus.success;
      } else {
        result.status = EResultParseStatus.needLogin;
      }
    } catch (e) {
      result.status = EResultParseStatus.parseError;
    }

    return result;
  }
}
