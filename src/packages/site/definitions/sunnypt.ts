import { type AxiosRequestConfig, type AxiosResponse } from "axios";

import { type ISiteMetadata, type ITorrent } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";

// ---------------------------------------------------------------------------
// SunnyPT API response wrapper
// ---------------------------------------------------------------------------
interface ISunnyPtResponse<T> {
  code: number;
  data: T;
  msg?: string;
}

export const siteMetadata: ISiteMetadata = {
  version: 2,
  id: "sunnypt",
  name: "Sunny",
  aka: ["SunnyPT", "阳光"],
  description: "The Ultimate File Sharing Experience",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",
  favicon: "./sunnypt.ico",

  collaborator: ["yanleichang"],

  type: "private",
  schema: "SunnyPT",

  urls: ["uggcf://fhaalcg.gbc/"],

  userInputSettingMeta: [
    {
      name: "apiKey",
      label: "API Key",
      hint: "从站点设置页面获取 API Key",
      required: true,
    },
  ],

  // -----------------------------------------------------------------------
  // Torrent search — GET /api/v1/mp/torrents
  // -----------------------------------------------------------------------
  search: {
    keywordPath: "params.keyword",
    requestConfig: {
      method: "GET",
      url: "/torrents",
      responseType: "json",
      params: { page: 1, page_size: 100, sort: "created_at", order: "desc" },
    },
    selectors: {
      rows: { selector: "data.items" },
      id: { selector: "id", filters: [{ name: "parseNumber" }] },
      title: { selector: "title" },
      subTitle: { selector: "subtitle" },
      url: { selector: "details_url" },
      time: { selector: "created_at", filters: [{ name: "parseTime" }] },
      size: { selector: "size", filters: [{ name: "parseSize" }] },
      seeders: { selector: "seeders", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "leechers", filters: [{ name: "parseNumber" }] },
      completed: { selector: "completed", filters: [{ name: "parseNumber" }] },
    },
  },

  // -----------------------------------------------------------------------
  // User info — GET /api/v1/mp/profile
  // -----------------------------------------------------------------------
  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: {
          method: "GET",
          url: "/profile",
          responseType: "json",
        },
        selectors: {
          id: { selector: "data.id", filters: [{ name: "parseNumber" }] },
          name: { selector: "data.username" },
          joinTime: { selector: "data.registered_at", filters: [{ name: "parseTime" }] },
          uploaded: { selector: "data.uploaded", filters: [{ name: "parseSize" }] },
          downloaded: { selector: "data.downloaded", filters: [{ name: "parseSize" }] },
          ratio: { selector: "data.ratio", filters: [{ name: "parseNumber" }] },
          bonus: { selector: "data.bonus", filters: [{ name: "parseNumber" }] },
          seeding: { selector: "data.seeding_count", filters: [{ name: "parseNumber" }] },
          seedingSize: { selector: "data.seeding_size", filters: [{ name: "parseSize" }] },
          leeching: { selector: "data.leeching_count", filters: [{ name: "parseNumber" }] },
          messageCount: { selector: "data.unread_messages", filters: [{ name: "parseNumber" }] },
          levelName: { selector: "data.level" },
        },
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// SunnyPT site class — API-based site using X-API-Key authentication
// ---------------------------------------------------------------------------

export default class SunnyPT extends PrivateSite {
  /** SunnyPT 公开集成 API 的地址 */
  get apiBaseUrl(): string {
    return "https://api.sunnypt.top/api/v1/mp/";
  }

  /**
   * 覆写 request 方法，将所有请求指向 SunnyPT API：
   *   - baseURL 设为 https://api.sunnypt.top/api/v1/mp/
   *   - 统一添加 X-API-Key 认证头
   *   - 默认 responseType 为 json
   */
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    axiosConfig.baseURL ??= this.apiBaseUrl;
    axiosConfig.responseType ??= "json";
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      "X-API-Key": this.userConfig.inputSetting?.apiKey ?? "",
    };
    return super.request<T>(axiosConfig, checkLogin);
  }

  /**
   * SunnyPT API 正常响应为 { code: 0, data: ... }。
   * HTTP 200 + code === 0 视为已登录 / 请求成功。
   */
  protected override loggedCheck(raw: AxiosResponse<ISunnyPtResponse<unknown>>): boolean {
    return raw.status >= 200 && raw.status < 300 && raw.data?.code === 0;
  }

  /**
   * fixLink 应使用站点主页 URL 作为基址，而非 API 地址。
   * 这样 API 返回的相对详情页路径会被正确拼接为 https://sunnypt.top/...。
   */
  protected override fixLink(uri: string, requestConfig: AxiosRequestConfig): string {
    return super.fixLink(uri, { ...requestConfig, baseURL: this.url });
  }

  /**
   * SunnyPT 下载需要先通过 POST /torrents/{id}/download-token
   * 获取临时下载链接。
   */
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const response = await this.request<ISunnyPtResponse<{ download_url?: string }>>(
      {
        method: "POST",
        url: `/torrents/${encodeURIComponent(String(torrent.id))}/download-token`,
        responseType: "json",
      },
      false, // 不检查登录状态（token 端点即使未登录也有合理返回）
    );
    return response.data?.data?.download_url ?? "";
  }
}
