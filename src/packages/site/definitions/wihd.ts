/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/world-in-hd.net/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/wihd.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 站点为自有 WiHD 引擎（非 NexusPHP / UNIT3D）：搜索走 AJAX 片段
 * `/torrent/ajaxfiltertorrent/<关键词>`，返回 HTML 片段而非完整页面。
 */
import type { ISiteMetadata } from "../types";

const categoryMap: Record<number, string> = {
  1: "电影-1080p",
  2: "电影-720p",
  3: "电影-HDTV",
  4: "电影-原盘",
  5: "电影-原盘 Remux",
  6: "电影-3D 原盘",
  7: "剧集-1080p",
  8: "剧集-720p",
  9: "剧集-HDTV",
  10: "剧集-原盘",
  11: "剧集-原盘 Remux",
  12: "剧集-3D 原盘",
  13: "动漫-1080p",
  14: "动漫-720p",
  15: "动漫-HDTV",
  16: "动漫-原盘",
  17: "动漫-原盘 Remux",
  18: "动漫-3D 原盘",
  19: "软件",
  20: "音乐短片",
  21: "音轨",
  22: "纪录片",
  23: "电影-4K 原盘",
  24: "电影-4K Remux",
  25: "电影-WEB-DL",
  26: "电影-2160p",
};

// 法语相对时间 → 英文，交给 parseTTL 解析
function normalizeFrenchRelativeTime(text: string): string {
  return text
    .replace(/Il y a/i, "")
    .replace(/(\d+)\s*Années?/gi, "$1 years")
    .replace(/(\d+)\s*Mois/gi, "$1 months")
    .replace(/(\d+)\s*Jours?/gi, "$1 days")
    .replace(/(\d+)\s*Heures?/gi, "$1 hours")
    .replace(/(\d+)\s*Minutes?/gi, "$1 minutes")
    .trim();
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "wihd",
  name: "WiHD",
  aka: ["World-In-HD"],
  description: "World-In-HD is a French Private Torrent Tracker for HD内容",
  tags: ["影视"],
  timezoneOffset: "+0200",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://world-in-hd.net/"],

  category: [
    {
      name: "类别",
      key: "subcat",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "brackets" },
    },
    {
      name: "仅免费",
      key: "freeleech",
      options: [{ name: "仅免费种子", value: 1 }],
    },
  ],

  search: {
    requestConfig: {
      url: "/torrent/ajaxfiltertorrent/",
      params: {
        exclu: 0,
        freeleech: 0,
        reseed: 0,
      },
    },
    // 关键词直接拼进 URL 路径，而非查询参数
    requestConfigTransformer: ({ requestConfig, keywords }) => {
      requestConfig!.url = `${requestConfig!.url ?? ""}${keywords ? encodeURIComponent(keywords) : "null"}`;
      delete requestConfig!.params?.keywords;
      return requestConfig!;
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "div.torrent-item, div.torrent-body" },
      id: {
        selector: "a.torrentlink",
        attr: "href",
        filters: [{ name: "parseNumber" }],
      },
      title: { selector: "a.torrentlink", attr: "title" },
      url: { selector: "a.torrentlink", attr: "href" },
      link: { selector: "div.download-item > a", attr: "href" },
      category: { selector: "div.category img", attr: "title" },
      seeders: { selector: "div.seeders", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "div.leechers", filters: [{ name: "parseNumber" }] },
      completed: { selector: "div.completed", filters: [{ name: "parseNumber" }] },
      time: {
        selector: ["div.torrent-h3 > span", "span.torrent-h3__meta"],
        elementProcess: (element: HTMLElement) => {
          const text = (element.textContent ?? "").split("-")[0];
          return normalizeFrenchRelativeTime(text) || undefined;
        },
        filters: [{ name: "parseTTL" }],
      },
      tags: [{ name: "Free", selector: "div.fl-item", color: "blue" }],
    },
  },

  userInfo: {
    pickLast: ["name"],
    process: [
      {
        requestConfig: { url: "/" },
        selectors: {
          name: { selector: "span.username" },
          seeding: { selector: "i.fa-upload + strong", filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/profils/user/" },
        assertion: { name: "url" },
        selectors: {
          uploaded: {
            selector: "div.stats a.btn:contains('Upload')",
            elementProcess: (element: HTMLElement) => (element.textContent ?? "").replace(/o/i, "B") || undefined,
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "div.stats a.btn:contains('Download')",
            elementProcess: (element: HTMLElement) => (element.textContent ?? "").replace(/o/i, "B") || undefined,
            filters: [{ name: "parseSize" }],
          },
          levelName: { selector: "span.class" },
          joinTime: {
            selector: "div.user-block-content:first",
            filters: [{ name: "parseTime", args: ["DD/MM/YYYY"] }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    { id: 1, name: "720p", interval: "P5W", uploaded: "250GB", ratio: 2 },
    { id: 2, name: "1080i", interval: "P15W", uploaded: "400GB", ratio: 3 },
    { id: 3, name: "1080p", interval: "P25W", uploaded: "1.2TB", ratio: 4.5 },
  ],
};
