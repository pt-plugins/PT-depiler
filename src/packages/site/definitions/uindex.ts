/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/uindex.yml
 */
import { type ISiteMetadata } from "../types";

const categoryMap: Record<string, string> = {
  "0": "Other",
  "1": "Movies",
  "2": "TV",
  "3": "Games",
  "4": "Music",
  "5": "Apps",
  "6": "XXX",
  "7": "Anime",
  "8": "Other",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "uindex",
  name: "UIndex",
  description: "UIndex is a Public Torrent Tracker for MOVIES / TV / MUSIC / GENERAL",
  tags: ["综合"],

  type: "public",
  urls: ["https://uindex.org/"],

  category: [
    {
      name: "分类",
      key: "c",
      options: [
        { name: "Movies", value: 1 },
        { name: "TV", value: 2 },
        { name: "Games", value: 3 },
        { name: "Music", value: 4 },
        { name: "Apps", value: 5 },
        { name: "XXX", value: 6 },
        { name: "Anime", value: 7 },
        { name: "Other", value: 8 },
      ],
      cross: false,
    },
  ],

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/search.php",
      responseType: "document",
      params: { c: 0 },
    },
    selectors: {
      rows: { selector: "table.sr-table > tbody > tr:has(a[href^='magnet:?xt='])" },
      id: {
        selector: "a[href^='/details.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: "a[href^='/details.php?id=']" },
      url: { selector: "a[href^='/details.php?id=']", attr: "href" },
      link: { selector: "a[href^='magnet:?xt=']", attr: "href" },
      size: { selector: "td.sr-col-size", filters: [{ name: "parseSize" }] },
      // 列表页只给出相对时间（如 "6.1 days ago"，绝对时间在详情页）
      time: { selector: "td.sr-col-uploaded", filters: [{ name: "parseFuzzyTime" }] },
      seeders: { selector: "td.sr-col-seeders", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td.sr-col-leechers", filters: [{ name: "parseNumber" }] },
      category: {
        selector: ["a[href*='search.php?c=']", "a.sr-cat-badge"],
        filters: [
          (query: string) => {
            const matched = String(query).match(/[?&]c=(\d+)/);
            return matched ? categoryMap[matched[1]] : String(query).trim();
          },
        ],
      },
    },
  },

  detail: {
    urlPattern: ["/details\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: "h1.dt-title" },
      link: { selector: "a.dt-download-btn", attr: "href" },
      size: { selector: ".dt-info-row:contains('Size') .dt-info-value", filters: [{ name: "parseSize" }] },
      // 详情页给出绝对时间 "(2025-03-10 23:37:21)"，站点时区为 UTC（已与 "N minutes ago" 对照确认）
      time: {
        selector: ".dt-info-row:contains('Added') .dt-info-dim",
        filters: [
          (query: string) => {
            const matched = String(query).match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
            return matched
              ? Date.UTC(+matched[1], +matched[2] - 1, +matched[3], +matched[4], +matched[5], +matched[6])
              : query;
          },
        ],
      },
      seeders: { selector: ".dt-seed", filters: [{ name: "parseNumber" }] },
      leechers: { selector: ".dt-leech", filters: [{ name: "parseNumber" }] },
      category: { selector: "a.sr-cat-badge" },
    },
  },
};
