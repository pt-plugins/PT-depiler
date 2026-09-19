/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/extremlymtorrents.ws/config.json
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 站点为 TSUE 系模板（torrents-search.php / ttable_col2 / account-details.php），
 * Jackett 无对应定义，此处依据 PTPP 配置迁移。
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "xtr",
  name: "XTR",
  aka: ["ExtremlyMTorrents"],
  description: "ExtremlyMTorrents (XTR) is a Private Torrent Tracker for GENERAL",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://extremlymtorrents.ws/"],

  category: [
    {
      name: "排序",
      key: "sort",
      options: [
        { name: "按 ID", value: "id" },
        { name: "按标题", value: "title" },
        { name: "按大小", value: "size" },
        { name: "按做种", value: "seeders" },
      ],
    },
    {
      name: "排序方向",
      key: "order",
      options: [
        { name: "降序", value: "desc" },
        { name: "升序", value: "asc" },
      ],
    },
  ],

  search: {
    requestConfig: {
      url: "/torrents-search.php",
      params: {
        cat: 0,
        lang: 0,
        sort: "id",
        order: "desc",
      },
    },
    keywordPath: "params.search",
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "table.xtrz > tbody > tr:has(a[href*='download.php'])" },
      id: {
        selector: "a[href*='details.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: "a:first-child > b" },
      url: { selector: "a:first-child", attr: "href" },
      link: { selector: "a[href*='download.php']", attr: "href" },
      category: { selector: "img:first", attr: "alt" },
      size: { selector: "td:nth-child(6)" },
      seeders: { selector: "td:nth-child(7)", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td:nth-child(8)", filters: [{ name: "parseNumber" }] },
      author: { selector: "td:nth-child(4)" },
      time: {
        selector: "td:nth-child(9)",
        filters: [
          (value: string) => value.replace(/(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1"),
          { name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] },
        ],
      },
      tags: [
        { name: "Free", selector: "img[title='Free Torrents']", color: "blue" },
        { name: "VIP", selector: "img[alt='Only VIP']", color: "amber" },
      ],
    },
  },

  detail: {
    urlPattern: ["/details\\.php\\?id="],
    selectors: {
      link: { selector: "a[href*='download.php']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/" },
        selectors: {
          id: {
            selector: "a[href*='account-details.php']",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "a[href*='account-details.php']" },
        },
      },
      {
        requestConfig: { url: "/account-details.php" },
        assertion: { id: "params.id" },
        selectors: {
          uploaded: {
            selector: "td.ttable_col2:contains('Uploaded:') + td",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "td.ttable_col2:contains('Downloaded:') + td",
            filters: [{ name: "parseSize" }],
          },
          levelName: { selector: "td.ttable_col2:contains('User Class:') + td" },
          joinTime: {
            selector: "td.ttable_col2:contains('Joined:') + td",
            filters: [{ name: "parseTime" }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "Power User" },
    { id: 3, name: "VIP" },
  ],
};
