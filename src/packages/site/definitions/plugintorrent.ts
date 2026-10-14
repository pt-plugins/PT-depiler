/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/plugintorrent.yml
 */
import { type ISiteMetadata } from "../types";

/** 详情页/搜索页的 URL 都形如 <host>/<slug>/，两处共用同一套 id 规则 */
const slugFromUrl = (q: string) => q.replace(/\/+$/, "").split("/").pop() ?? "";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "plugintorrent",
  name: "PluginTorrent",
  description: "plugintorrent is a Public site for AUDIO apps, plugins and samples",
  tags: ["Audio", "Software"],

  type: "public",
  urls: ["https://plugintorrent.com/"],

  search: {
    // Jackett inputs: s={{ .Keywords }}&orderby=date&order=DESC&post_type=post，站点是 WordPress 首页搜索
    keywordPath: "params.s",
    requestConfig: { url: "/", responseType: "document", params: { post_type: "post" } },
    selectors: {
      // 列表页 30 条 <article class="post-NNN post type-post ... hentry category-xxx ...">
      rows: { selector: "article:has(.entry-title)" },
      id: { selector: "header.entry-header > h2.entry-title > a", attr: "href", filters: [slugFromUrl] },
      title: { selector: "header.entry-header > h2.entry-title" },
      url: { selector: "header.entry-header > h2.entry-title > a", attr: "href" },
      // 首页/搜索页没有 magnet，只写 url；magnet 交给 detail.selectors.link 在需要时补取
      time: {
        selector: "header.entry-header span.date",
        filters: [{ name: "parseTime", args: ["MMMM d, yyyy"] }],
      },
      // 站点列表页与详情页都不给体积/做种数/分类，留空（Jackett 的 "512 MB"/1/1/PC 是硬编码占位）
    },
  },

  detail: {
    // 详情页形如 https://plugintorrent.com/<slug>/（slug 里含 percent-encoded 的西里尔字母）
    urlPattern: ["^https?://plugintorrent\\.com/[^/]+/?$"],
    requestConfig: { responseType: "document" },
    selectors: {
      title: { selector: "h1.entry-title" },
      // 与搜索页共用同一套 slug 规则，保证两处进入详情时 id 一致
      id: { selector: ":self", elementProcess: (el: any) => el.URL || "", filters: [slugFromUrl] },
      // 详情页正文里的 <a href="magnet:?xt=urn:btih:...">
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
      time: {
        selector: "span.date.updated",
        filters: [{ name: "parseTime", args: ["MMMM d, yyyy"] }],
      },
      // size / seeders / leechers / category 详情页同样没有，留空
    },
  },
};
