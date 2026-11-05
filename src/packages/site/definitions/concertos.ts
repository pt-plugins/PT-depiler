/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/concertos.live/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/concertos.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 站点为 UNIT3D 9.1.7，Jackett 侧已由 HTML 抓取改用 API（api/torrents/filter）。
 * 与 huno 一类走 JSON API 的 UNIT3D 站点同样处理：保留 Unit3D 引擎（详情页、
 * 标签等逻辑仍然适用），只覆写与 JSON 响应相关的搜索配置。
 * 另写用户信息及列表选择器。
 */
import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

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

  userInfo: {
    // 新版首页的账号菜单已有完整基础统计；旧版 Unit3D 的用户详情页选择器不再适用。
    pickLast: ["id"],
    selectors: {
      name: {
        selector: "#c-account-popover a.c-account__name",
        attr: "href",
        filters: [(href: string) => href.match(/\/users\/([^/?#]+)/)?.[1] ?? ""],
      },
      levelName: { selector: "#c-account-popover .c-group-dot[aria-label]", attr: "aria-label" },
      uploaded: {
        selector: ".c-account__stats .c-account__stat:has(.c-account__stat-label:contains('Uploaded')) .c-account__stat-value",
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ".c-account__stats .c-account__stat:has(.c-account__stat-label:contains('Downloaded')) .c-account__stat-value",
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: ".c-account__stats .c-account__stat:has(.c-account__stat-label:contains('Ratio')) .c-account__stat-value",
        filters: [{ name: "parseNumber" }],
      },
      bonus: {
        selector: ".c-account__stats .c-account__stat:has(.c-account__stat-label:contains('Bonus points')) .c-account__stat-value",
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: ".c-account__stats .c-account__stat:has(.c-account__stat-label:contains('Seeding')) .c-account__stat-value",
        filters: [{ name: "parseNumber" }],
      },
      leeching: {
        selector: ".c-account__stats .c-account__stat:has(.c-account__stat-label:contains('Leeching')) .c-account__stat-value",
        filters: [{ name: "parseNumber" }],
      },
      uploads: {
        selector: ".c-account__links .c-account__link:has(.c-account__label:contains('My Uploads')) .c-account__count",
        filters: [{ name: "parseNumber" }],
      },
    },
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        fields: ["name", "levelName", "uploaded", "downloaded", "ratio", "bonus", "seeding", "leeching", "uploads"],
      },
    ],
  },

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "PowerUser" },
  ],
};
