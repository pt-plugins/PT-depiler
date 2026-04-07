/**
 * Rartracker 架构基类
 * 适用于基于 rartracker (https://github.com/swetorrentking/rartracker) 的站点
 * 站点使用 AngularJS SPA，数据通过 JSON API（/api/v1/）获取
 */
import type { AxiosRequestConfig } from "axios";
import type { ISiteMetadata, ITorrent } from "../types";
import PrivateSite from "./AbstractPrivateSite";
import { GB } from "../utils";

export const statusRequestConfig: AxiosRequestConfig = {
  url: "/api/v1/status",
  responseType: "json",
};

export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: 0,
  schema: "Rartracker",
  type: "private",

  search: {
    keywordPath: "params.searchText",
    requestConfig: {
      url: "/api/v1/torrents",
      responseType: "json",
      params: {
        limit: 100,
        index: 0,
        section: "all",
        extendedSearch: false,
        watchview: false,
      },
    },
    advanceKeywordParams: {
      imdb: { enabled: true },
    },
    selectors: {
      rows: { selector: ":self" },
      id: { selector: "id" },
      title: { selector: "name" },
      url: { selector: "id", filters: [(id: number) => `/torrent/${id}/`] },
      time: { selector: "added" },
      size: { selector: "size" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      comments: { selector: "comments" },
      category: { selector: "category" },
    },
  },

  userInfo: {
    pickLast: ["id", "joinTime"],
    process: [
      {
        // 第一步：从 /api/v1/status 获取当前用户基本信息
        requestConfig: statusRequestConfig,
        selectors: {
          id: { selector: "user.id" },
          name: { selector: "user.username" },
          uploaded: { selector: "user.uploaded" },
          downloaded: { selector: "user.downloaded" },
          messageCount: { selector: "user.newMessages" },
          bonus: { selector: "user.bonuspoang" },
          seedingSize: {
            selector: "user.currentGbSeed",
            filters: [(query: number) => query * GB],
          },
        },
      },
      {
        // 第二步：从 /api/v1/users/{id} 获取详细信息
        requestConfig: {
          url: "/api/v1/users/$id$",
          responseType: "json",
        },
        assertion: { id: "url" },
        selectors: {
          joinTime: { selector: "added", filters: [{ name: "parseTime" }] },
          lastAccessAt: { selector: "last_access", filters: [{ name: "parseTime" }] },
          uploaded: { selector: "uploaded" },
          downloaded: { selector: "downloaded" },
          trueDownloaded: { selector: "downloaded_real" },
          bonus: { selector: "bonuspoang" },
        },
      },
    ],
  },
};

export default class Rartracker extends PrivateSite {
  private _passKey?: string;

  // 从 /api/v1/status 获取 passkey，用于构建种子下载链接
  private async getPassKey(): Promise<string> {
    if (!this._passKey) {
      const { data: statResp } = await this.request<{ user: { passkey: string } }>(statusRequestConfig);
      this._passKey = statResp.user.passkey;
    }
    return this._passKey;
  }

  protected async parseTorrentRowForLink(torrent: Partial<ITorrent>): Promise<Partial<ITorrent>> {
    const passkey = await this.getPassKey();
    torrent.link = `/api/v1/torrents/download/${torrent.id}/${passkey}`;
    return torrent;
  }
}
