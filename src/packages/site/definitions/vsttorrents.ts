/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/vsttorrents.yml
 */
import { type ISiteMetadata } from "../types";

/** 详情页/搜索页的 URL 都形如 <host>/<slug>/，两处共用同一套 id 规则 */
const slugFromUrl = (q: string) => q.replace(/\/+$/, "").split("/").pop() ?? "";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "vsttorrents",
  name: "VST Torrentz",
  description: "VST Torrentz is a Public site for AUDIO apps, plugins and samples",
  tags: ["Audio", "Software"],

  type: "public",
  urls: ["https://vsttorrentz.net/"],
  legacyUrls: ["https://vsttorrents.net/", "https://looptorrent.net/"],

  search: {
    // Jackett inputs: s={{ .Keywords }}，站点是 WordPress 首页搜索
    keywordPath: "params.s",
    requestConfig: { url: "/", responseType: "document" },
    selectors: {
      // 列表页 12 条 <article class="hitmag-post post-NNN post type-post ... hentry category-xxx ...">
      rows: { selector: "article:has(.entry-title)" },
      id: { selector: ".entry-title > a", attr: "href", filters: [slugFromUrl] },
      title: { selector: ".entry-title" },
      url: { selector: ".entry-title > a", attr: "href" },
      // <time class="entry-date published" datetime="2026-10-11T09:15:15+05:30">，ISO 串自带偏移，
      // parseTime 默认格式即可直接吃下（无需 parseTimeWithZone）
      time: { selector: "time[datetime]", attr: "datetime", filters: [{ name: "parseTime" }] },
      // 站点列表页不给体积/做种数/分类，留空（Jackett 的 "512 MB"/1/1/PC 是硬编码占位）
    },
  },

  detail: {
    // 详情页形如 https://vsttorrentz.net/<slug>/
    urlPattern: ["^https?://(?:vsttorrentz\\.net|vsttorrents\\.net|looptorrent\\.net)/[\\w%-]+/?$"],
    requestConfig: { responseType: "document" },
    selectors: {
      title: { selector: "h1.entry-title" },
      // 与搜索页共用同一套 slug 规则，保证两处进入详情时 id 一致
      id: { selector: ":self", elementProcess: (el: any) => el.URL || "", filters: [slugFromUrl] },
      // 详情页没有裸 magnet：<a class="wp-block-button__link download-intercepted"
      //   href="https://freemusicplugins.com/...?file=magnet%3A%3Fxt%3Durn%3Abtih%3A...">
      // 用 querystring 取 file 参数，URLSearchParams 会自动 percent-decode 回 magnet 串
      link: {
        selector: "a.wp-block-button__link",
        attr: "href",
        filters: [{ name: "querystring", args: ["file"] }],
      },
      time: { selector: "time[datetime]", attr: "datetime", filters: [{ name: "parseTime" }] },
      // size / seeders / leechers / category 详情页同样没有，留空
    },
  },
};
