/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/concertos.live/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/concertos.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 站点为 UNIT3D 9.1.7，Jackett 侧已由 HTML 抓取改用 API（api/torrents/filter）。
 * 与 huno 一类走 JSON API 的 UNIT3D 站点同样处理：保留 Unit3D 引擎（用户信息、详情页、
 * 标签等逻辑仍然适用），只覆写与 JSON 响应相关的搜索配置。
 * 另写首页列表选择器；搜索接口使用 API Token。
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { NoUserInputError, type ISiteMetadata } from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 2,
  id: "concertos",
  name: "Concertos",
  description: "Concertos is a Private Torrent Tracker for Live Concerts with Strict Quality Control",
  tags: ["音乐", "MV"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://concertos.live/"],

  userInputSettingMeta: [
    {
      name: "apikey",
      label: "API Token",
      hint: "在 Concertos 的 My Settings → API Key 页面获取 API Token；搜索时以 Authorization: Bearer 发送",
      required: true,
    },
  ],

  search: {
    ...SchemaMetadata.search,
    keywordPath: "params.name",
    requestConfig: {
      url: "/api/torrents/filter",
      responseType: "json",
      params: {
        perPage: 100,
      },
    },
    selectors: {
      ...SchemaMetadata.search.selectors,
      // JSON 响应可能带 data 包装，沿用多候选路径
      rows: { selector: ["data.data", "data", "torrents.data", "torrents"] },
      id: { selector: ["id", "attributes.id"] },
      title: { selector: ["name", "attributes.name"] },
      url: {
        selector: ":self",
        filters: [
          (row: any) => {
            const id = row?.id ?? row?.attributes?.id;
            return id ? `/torrents/${id}` : "";
          },
        ],
      },
      link: { selector: ["download_link", "attributes.download_link"] },
      category: { selector: ["category.name", "attributes.category.name"] },
      size: { selector: ["size", "attributes.size"] },
      time: { selector: ["created_at", "attributes.created_at"], filters: [{ name: "parseTime" }] },
      author: {
        selector: ["uploader.username", "uploader.name", "attributes.uploader.username", "attributes.uploader.name"],
      },
      seeders: { selector: ["seeders", "attributes.seeders"] },
      leechers: { selector: ["leechers", "attributes.leechers"] },
      completed: { selector: ["times_completed", "attributes.times_completed", "completed", "attributes.completed"] },
      comments: { text: 0 }, // 列表接口不返回评论数
    },
  },

  list: [
    // 首页「New Torrents」列表是 HTML；搜索仍使用上面的 JSON API。
    {
      urlPattern: [/^https?:\/\/concertos\.live\/?(?:\?.*)?$/],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "#c-home-torrents-panel tr.c-torrent-row[data-torrent-id]" },
        id: { selector: ":self", attr: "data-torrent-id" },
        title: { selector: "a.c-torrent-row__name" },
        url: { selector: "a.c-torrent-row__name", attr: "href" },
        link: { selector: "a.c-torrent-row__action--download[href]", attr: "href" },
        category: { selector: ".c-format-cell__category" },
        size: { selector: "td.c-torrent-row__size" },
        time: SchemaMetadata.search.selectors!.time,
        author: { selector: ".c-torrent-row__uploader" },
        seeders: { selector: ".c-stat-triple__item--seeders .c-stat-triple__value" },
        leechers: { selector: ".c-stat-triple__item--leechers .c-stat-triple__value" },
        completed: { selector: ".c-stat-triple__item--completed .c-stat-triple__value" },
        comments: { text: 0 },
        tags: SchemaMetadata.search.selectors!.tags,
      },
    },
    ...SchemaMetadata.list,
  ],

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "PowerUser" },
  ],
};

export default class Concertos extends Unit3D {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 只向站点 API 搜索请求发送 Token，不将凭据附在用户页面或种子下载请求上。
    if (axiosConfig.url === "/api/torrents/filter") {
      const token = this.userConfig.inputSetting?.apikey?.trim();
      if (!token) {
        throw new NoUserInputError("API Token");
      }
      axiosConfig.headers = {
        ...(axiosConfig.headers ?? {}),
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };
    }

    return super.request<T>(axiosConfig, checkLogin);
  }
}
