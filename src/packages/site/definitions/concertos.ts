/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/concertos.live/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/concertos.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 站点为 UNIT3D 9.1.7，Jackett 侧已由 HTML 抓取改用 API（api/torrents/filter）。
 * 与 huno 一类走 JSON API 的 UNIT3D 站点同样处理：保留 Unit3D 引擎（用户信息、详情页、
 * 标签等逻辑仍然适用），只覆写与 JSON 响应相关的搜索配置。
 */
import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "concertos",
  name: "Concertos",
  description: "Concertos is a Private Torrent Tracker for Live Concerts with Strict Quality Control",
  tags: ["音乐", "MV"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://concertos.live/"],

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
      ...SchemaMetadata.search!.selectors,
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

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "Power User" },
  ],
};
