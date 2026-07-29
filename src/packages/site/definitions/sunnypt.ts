import { type AxiosRequestConfig, type AxiosResponse } from "axios";

import { ISearchInput, type ISiteMetadata, type ITorrent } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";

interface ISunnyPtResponse<T> {
  code: number;
  data: T;
  msg?: string;
}

interface ISunnyPtTorrent {
  id: number;
  title: string;
  subtitle: string;
  media_type: "movie" | "tv";
  category: { id: number; name: string };
  size: number;
  created_at: string;
  seeders: number;
  leechers: number;
  completed: number;
  imdb_id?: string;
  tmdb_id?: string;
  tags: string[];
  hit_and_run: boolean;
  promotion: { is_active: boolean; up_multiplier: number; down_multiplier: number; until: string };
  details_url: string;
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
      id: { selector: "id" },
      title: { selector: "title" },
      subTitle: { selector: "subtitle" },
      category: { selector: "category.name" },
      url: { selector: "details_url" },
      time: { selector: "created_at", filters: [{ name: "parseTime" }] },
      size: { selector: "size" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "completed" },
      ext_imdb: { selector: "imdb_id" },
      ext_tmdb: {
        selector: ":self",
        filters: [(raw: ISunnyPtTorrent) => (raw.tmdb_id ? `${raw.media_type}/${raw.tmdb_id}` : "")],
      },
    },
  },

  download: {
    requestConfig: {
      headers: {
        Accept: "application/x-bittorrent",
      },
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
          id: { selector: "data.id" },
          name: { selector: "data.username" },
          joinTime: { selector: "data.registered_at" },
          uploaded: { selector: "data.uploaded" },
          downloaded: { selector: "data.downloaded" },
          ratio: { selector: "data.ratio" },
          bonus: { selector: "data.bonus" },
          seeding: { selector: "data.seeding_count" },
          seedingSize: { selector: "data.seeding_size" },
          leeching: { selector: "data.leeching_count" },
          messageCount: { selector: "data.unread_messages" },
          levelName: { selector: "data.level" },
          levelId: { selector: "data.class" },
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

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: ISunnyPtTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    let torrentTags = torrent.tags ?? [];

    // 解析 promotion
    if (row.promotion?.is_active) {
      const { up_multiplier, down_multiplier } = row.promotion;
      if (up_multiplier == 1 && down_multiplier == 0) {
        torrentTags.push({ name: "Free" });
      } else if (up_multiplier == 2 && down_multiplier == 1) {
        torrentTags.push({ name: "2x" });
      } else if (up_multiplier == 2 && down_multiplier == 0) {
        torrentTags.push({ name: "2xFree" });
      } else if (up_multiplier == 1 && down_multiplier == 0.5) {
        torrentTags.push({ name: "50%" });
      } else if (up_multiplier == 2 && down_multiplier == 0.5) {
        torrentTags.push({ name: "2x50%" });
      } else if (up_multiplier == 1 && down_multiplier == 0.3) {
        torrentTags.push({ name: "30%" });
      }
    }

    if (row.hit_and_run) {
      torrentTags.push({ name: "H&R" });
    }

    if (row.tags && row.tags.length > 0) {
      torrentTags.push(...row.tags.map((tagName) => ({ name: tagName })));
    }

    torrent.tags = torrentTags;
    return torrent;
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

    let downloadUrl = response.data?.data?.download_url ?? "";

    // 260729 api 返回的url并不能直接请求，需要做一层替换？是他们写的bug吗？先做一层兼容吧，也反馈给官方了。
    downloadUrl = downloadUrl.replace("https://sunnypt.top/", "https://api.sunnypt.top/");
    return downloadUrl;
  }
}
