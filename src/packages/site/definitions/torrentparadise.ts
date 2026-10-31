import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torrentparadise",
  name: "Torrent Paradise",
  description:
    "Torrent Paradise 是一个公开的 BT 元搜索引擎，索引 DHT 网络中的种子，无需登录；列表页不直接给出 magnet，需要进详情页取",
  type: "public",
  tags: ["综合"],
  urls: ["https://torrentparadise.cl/"],
  legacyUrls: [
    "https://torrentparadise.org/",
    "https://torrentparadise.to/",
    "https://torrentparadise.cc/",
    "https://torrentparadise.la/",
  ],
  timezoneOffset: "+0000",

  search: {
    // 站点搜索表单是 GET /search.php?f=<关键词>，翻页用 &p=<页码>
    keywordPath: "params.f",
    requestConfig: {
      url: "/search.php",
      responseType: "document",
    },
    selectors: {
      rows: { selector: "table.table-bordered > tbody > tr.table-default" },
      id: {
        selector: 'a[href^="/torrent/"]',
        attr: "href",
        filters: [(href: string) => String(href).match(/^\/torrent\/(\d+)/)?.[1] ?? ""],
      },
      title: { selector: "td:nth-child(2) a" },
      url: { selector: "td:nth-child(2) a", attr: "href" },
      // 第一列是分类名，链到 /searchA.php?f=<分类名>
      category: { selector: "td:nth-child(1) a" },
      size: { selector: "td:nth-child(3)", filters: [{ name: "parseSize" }] },
      // 第四列是「1 year」「3 days」这类相对时间（data-timestamp 属性在列表页恒为空）
      time: { selector: "td:nth-child(4)", filters: [{ name: "parseTTL" }] },
      seeders: { selector: "td:nth-child(5)", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td:nth-child(6)", filters: [{ name: "parseNumber" }] },
      // 列表页没有 magnet，下载链接由 detail.selectors.link 在需要时补取
    },
  },

  // 详情页 /torrent/<id>/<slug>，静态 HTML，页内有「Magnet link」按钮
  detail: {
    urlPattern: ["/torrent/\\d+"],
    selectors: {
      title: { selector: "h1" },
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
    },
  },
};
