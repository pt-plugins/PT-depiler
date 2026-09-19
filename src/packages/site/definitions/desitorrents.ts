/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/torrent.desi/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/desitorrents-api.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 站点为 UNIT3D 9.2.0 (custom)，Jackett 侧已改走 API v1（api/v1/torrents/filter）。
 * 保留 Unit3D 引擎，只覆写与 JSON 响应相关的搜索配置；注意 API v1 的响应带 data 包装，
 * 故 rows 等字段沿用多候选路径以兼容两种结构。
 */
import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

const categoryMap: Record<number, string> = {
  1: "电影",
  2: "剧集",
  3: "音乐",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "desitorrents",
  name: "DesiTorrents",
  aka: ["Desitorrents"],
  description: "DesiTorrents is an INDIAN Private Torrent Tracker for MOVIES / TV",
  tags: ["影视", "综合", "印度"],
  timezoneOffset: "+0530",

  type: "private",
  schema: "Unit3D",

  urls: ["https://torrent.desi/"],
  legacyUrls: ["https://desitorrents.tv/", "https://desitorrents.rocks/"],

  category: [
    {
      name: "类别",
      key: "categories",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "brackets" },
    },
    {
      name: "仅免费",
      key: "free",
      options: [{ name: "仅免费种子", value: 100 }],
      cross: { mode: "brackets" },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    keywordPath: "params.name",
    requestConfig: {
      url: "/api/v1/torrents/filter",
      responseType: "json",
      params: {
        perPage: 100,
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      // API v1 响应带 data 包装，沿用多候选路径
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
      category: {
        selector: ["category_id", "attributes.category_id"],
        filters: [(catId: number) => categoryMap[+catId] ?? String(catId)],
      },
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

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "PowerUser", interval: "P4W", uploaded: "1TB" },
    { id: 3, name: "SuperUser", interval: "P8W", uploaded: "5TB" },
    { id: 4, name: "ExtremeUser", interval: "P13W", uploaded: "20TB" },
    { id: 5, name: "InsaneUser", interval: "P26W", uploaded: "50TB" },
    { id: 6, name: "Veteran", interval: "P52W", uploaded: "100TB" },
  ],
};
