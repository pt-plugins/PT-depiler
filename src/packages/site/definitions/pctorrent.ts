/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/pctorrent.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "pctorrent",
  name: "PC-torrent",
  description: "PC-torrent 是一个俄语公开 PC 游戏 BT 站（DataLife Engine），无需登录",

  type: "public",
  urls: ["https://pc-torrents.games/"],
  legacyUrls: ["https://pc-torrent.org/", "https://pc-torrent.pro/"],

  // 站点时间：RSS（/rss.xml）的 pubDate 带 `+03` 偏移，确认是 MSK（+0300）
  timezoneOffset: "+0300",

  search: {
    keywordPath: "params.story",
    requestConfig: {
      url: "/",
      responseType: "document",
      params: { do: "search", subaction: "search", search_start: 0, full_search: 1, result_from: 1 },
    },
    // Jackett 在没有关键词时把 path 缩成 `/`（站点首页 = 「Новое на трекере」最新 24 条，
    // 用的是同一套 div.dshort 卡片），否则 DLE 的空 story 只会回一张没有结果的搜索表单
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      if (!keywords) {
        requestConfig!.params = {};
      }
      return requestConfig!;
    },
    selectors: {
      // Jackett 原样：`:has(div.d3-raz)` 排除没有体积的条目（体积在第三方网盘上的「Анонс!」），
      // `andmatch` 在 CSS 里等价于直接写进选择器
      rows: {
        selector: 'div.dshort:has(div.d3-raz):not(:has(div.d3-raz:contains("Анонс!")))',
      },
      id: {
        selector: "a",
        attr: "href",
        filters: [(q: string) => q.match(/(\d+)-[^/]*\.html$/)?.[1] ?? ""],
      },
      title: { selector: "div.d3-title" },
      url: { selector: "a", attr: "href" },
      size: { selector: "div.d3-raz", filters: [{ name: "parseSize" }] },
      // 站点只有「PC 游戏」一个大类（Jackett categorymappings 也只有 id:1 → PC/Games），
      // 列表卡片上没有任何分类信息，这里按站点实际归属给出常量
      category: { text: "PC/Games" },
      // 列表页不显示发布时间与做种数（Jackett 的 date/seeders/leechers 都是占位值），一律留空
      // 下载链接也不在列表页，交给 detail.selectors.link 在需要下载时补取
    },
  },

  // 详情页 /<id>-<slug>.html，静态 HTML
  detail: {
    urlPattern: ["/\\d+-[^/]+\\.html$"],
    selectors: {
      title: { selector: "h1.dh1" },
      // 详情页与列表页同源，用文档自身的 URL 取同一个 id（linkedom 的 cloneNode 已由 harness 补齐 URL）
      id: {
        selector: ":self",
        elementProcess: (el: Document) => el.URL ?? "",
        filters: [(q: string) => q.match(/(\d+)-[^/]*\.html$/)?.[1] ?? ""],
      },
      // 站内没有 magnet，下载走 DLE 的 /engine/download.php?id=<发布 id>
      link: { selector: 'a[href*="/engine/download.php?id="]', attr: "href" },
      // 「19-09-2026」= 文章的发布日期（不是游戏发行日期），无时分秒，按站点时区（MSK，+0300）当天零点换算
      time: {
        selector: "div.d7-1 > span.ddate",
        filters: [
          (q: string) => {
            const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(q.trim());
            return m ? Date.UTC(+m[3], +m[2] - 1, +m[1], -3) : 0;
          },
        ],
      },
      size: { selector: "div.d7-1 > span.dnrazmer", filters: [{ name: "parseSize" }] },
      // 站点只有 PC 游戏一个大类，与列表页保持一致
      category: { text: "PC/Games" },
      // 详情页也看不到做种数 / 完成数，留空
    },
  },
};
