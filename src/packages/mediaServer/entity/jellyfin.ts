import { IMediaServerMetadata, IMediaServerSearchOptions } from "../types";
import { AxiosRequestConfig } from "axios";
import { IEmbyQueryItem, IMediaBrowserConfig, MediaBrowser } from "./emby.ts";
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

interface IJellyfinConfig extends IMediaBrowserConfig {
  type: "jellyfin";
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
 * Jellyfin 的多数 API 和 Emby 相同（Jellyfin 是 Emby 3.5.2 的分支）—— 共同流程
 * （`request` / `ping` / `getSearchResult` 骨架、条目映射、状态与错误处理）都在 `./emby.ts`
 * 的 [`MediaBrowser`](./emby.ts) 基类里，这里只保留两家的差异：鉴权头、参数命名、Web UI 链接形状与体积字段。
 */
export default class Jellyfin extends MediaBrowser<IJellyfinConfig, IJellyfinQueryItem> {
  /**
   * 修正baseUrl，如果用户传入的地址为 http://127.0.0.1:8096/web/#/home.html 或者 https://127.0.0.1:8096/
   * 则将其修正为入口 https://127.0.0.1:8096/
   */
  public get baseUrl() {
    let serverAddress = this.config.address;
    serverAddress = serverAddress.replace(/web\/(#\/home.html.+)?/, "");

    return serverAddress;
  }

  /** Jellyfin 的 JSON API 与 Web UI 在同一个根地址下 */
  public override get apiBaseUrl() {
    return this.baseUrl;
  }

  protected override get authHeaders(): Record<string, string> {
    /**
     * 这里我们混用 Authorize with API key 和 Authorize with access token （因为实测对 access token 来说，不一定需要传 Client 等 params）
     * docs: https://gist.github.com/nielsvanvelzen/ea047d9028f676185832e51ffaf12a6f
     */
    return {
      Authorization: `MediaBrowser Token="${this.config.auth.apikey}"`,
    };
  }

  protected override buildSearchRequest(
    keywords: string,
    config: IMediaServerSearchOptions,
  ): { url: string; requestConfig: AxiosRequestConfig } {
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
      "Path,Status,ExternalUrls,CommunityRating,MediaSources,DisplayPreferences,Genres,DateCreated,Overview,ExtraIds," +
      this.listExtraFields.join(",");

    // 处理额外的请求配置
    requestConfig = toMerged(requestConfig, this.config.defaultSearchExtraRequestConfig ?? {});

    return { url, requestConfig };
  }

  protected override getItemWebUrl(item: IJellyfinQueryItem): string {
    return urlJoin(this.baseUrl, `/web/#/details?id=${item.Id}&serverId=${item.ServerId}`);
  }

  protected override getTagWebUrl(tag: IEmbyQueryItem["GenreItems"][number], item: IJellyfinQueryItem): string {
    return urlJoin(this.baseUrl, `/web/#/list.html?genreId=${tag.Id}&serverId=${item.ServerId}`);
  }

  protected override getPosterUrl(item: IJellyfinQueryItem): string {
    return urlJoin(this.baseUrl, `/Items/${item.Id}/Images/Primary`);
  }

  protected override getItemSize(item: IJellyfinQueryItem): number | undefined {
    return item.MediaSources?.[0]?.Size;
  }
}
