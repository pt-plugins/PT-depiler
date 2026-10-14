/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/torrent9.yml
 */
import { type ISiteMetadata } from "../types";

/** 列表页第 1 列的分类是图标（无文字），按 Jackett 的 case 映射成分类名 */
const categoryMap: Record<string, string> = {
  "fa fa-video-camera": "Films",
  "fa fa-tv": "Séries",
  "fa fa-desktop": "Séries", // 无关键词的首页里剧集用 desktop 图标
  "fa fa-music": "Musique",
  "fa fa-gamepad": "Jeux PC",
  "fa fa-laptop": "Logiciels",
  "fa fa-book": "Ebook",
};

const categoryFilter = (query: string) => categoryMap[String(query)] ?? "Other";

/** 站点体积用「Go / Mo」表示，先转成常见单位再交给 parseSize */
const frenchSizeFilter = (query: string) => String(query).replace(/(\w)o\b/g, "$1B");

/**
 * 站点只显示日期（如 "30/08/2018"），`new Date()` 解析不了这种格式，
 * 且站点时区无法从页面确认，这里显式按 UTC 零点换算（最多差一天）。
 */
const frenchDateFilter = (query: string) => {
  const matched = String(query).match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return matched ? Date.UTC(+matched[3], +matched[2] - 1, +matched[1]) : query;
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torrent9",
  name: "Torrent9",
  description: "Torrent9 is a FRENCH Public site for MOVIES / TV / GENERAL",
  tags: ["综合"],

  type: "public",
  urls: ["https://www7.torrent9.to/"],
  legacyUrls: [
    "https://www.torrent9.to/",
    "https://torrent9.to/",
    "https://ww2.torrent9.to/",
    "https://www5.torrent9.to/",
    "https://www6.torrent9.to/",
    "https://www8.torrent9.site/",
    "https://torrent9.li/",
    "https://torrent9.se/",
    "https://www.torrent9.gg/",
    "https://www.torrent9.fm/",
  ],

  search: {
    // 关键词走路径而不是查询串，实际 URL 在 requestConfigTransformer 里拼
    keywordPath: "params.keywords",
    requestConfig: { url: "/search_torrent/", responseType: "document" },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      requestConfig!.url = keywords ? `/search_torrent/${encodeURIComponent(keywords)}` : "/home/";
      delete requestConfig!.params!.keywords;
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "table.table-striped > tbody > tr" },
      id: {
        selector: "td:nth-child(1) a",
        attr: "href",
        filters: [(query: string) => query.match(/\/torrent\/(\d+)/)?.[1] ?? query],
      },
      // 标题链接的 textContent 里有关键词高亮 span，title 属性才是干净标题
      title: { selector: "td:nth-child(1) a", attr: "title" },
      url: { selector: "td:nth-child(1) a", attr: "href" },
      size: { selector: "td:nth-child(3)", filters: [frenchSizeFilter, { name: "parseSize" }] },
      time: { selector: "td:nth-child(2)", filters: [frenchDateFilter] },
      seeders: { selector: "td:nth-child(4)" },
      leechers: { selector: "td:nth-child(5)" },
      category: { selector: "td:nth-child(1) i", attr: "class", filters: [categoryFilter] },
    },
  },

  list: [
    {
      urlPattern: ["/search_torrent/", "/home/"],
      selectors: {
        keywords: { selector: "input[name='keywords']", attr: "value" },
      },
    },
  ],

  detail: {
    urlPattern: ["/torrent/\\d+"],
    selectors: {
      title: { selector: "div.movie-section h1" },
      // 与列表页共用同一套 id 规则（地址里的 /torrent/<id>），
      // 否则详情页会回落到整条 URL，同一颗种子会有两个 id
      id: {
        selector: ":self",
        elementProcess: (el: any) => el.URL || "",
        filters: [(query: string) => query.match(/\/torrent\/(\d+)/)?.[1] ?? query],
      },
      link: { selector: "a[href^='magnet:']", attr: "href" },
      category: { selector: "div.movie-section i", attr: "class", filters: [categoryFilter] },
      // "Seed : 3" 与 "Leech : 3" 在同一个 ul 里，只能按相邻兄弟节点取值
      seeders: { selector: "div.movie-information li:contains('Seed') + li + li" },
      leechers: { selector: "div.movie-information li:contains('Leech') + li + li" },
      size: {
        selector: "div.movie-information ul:contains('Poids') li:last-child",
        filters: [frenchSizeFilter, { name: "parseSize" }],
      },
      time: {
        selector: "div.movie-information ul:contains('Date') li:last-child",
        filters: [frenchDateFilter],
      },
    },
  },
};
