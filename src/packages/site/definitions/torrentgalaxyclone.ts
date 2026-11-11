/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/torrentgalaxyclone.yml
 */
import { type ISiteMetadata } from "../types";
import { parseTimeToLiveToDate } from "../utils";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torrentgalaxyclone",
  name: "TorrentGalaxyClone",
  aka: ["TGx", "TorrentGalaxy"],
  description: "TorrentGalaxyClone（TGx）是一个公共 BT 站点，主要提供 MOVIES / TV / GENERAL 资源",
  tags: ["综合"],

  type: "public",

  // 2026-10-29 Jackett 更新域名（https://github.com/Jackett/Jackett/commit/1670eb79b41e664226d52d69710abac162e7a124 ，
  // resolves https://github.com/Jackett/Jackett/issues/15992 ）：主域迁到 torrentgalaxy.online。
  // 旧域按域名迁移规则留在 legacyUrls（.one 已被 Jackett 从 links 移除且实测无响应，.space 证书早已过期）。
  urls: ["https://torrentgalaxy.online/", "https://torrentgalaxy.info/"],
  legacyUrls: ["https://torrentgalaxy.one/", "https://torrentgalaxy.space/"],

  search: {
    keywordPath: "q", // 关键词放在路径中，实际由 requestConfigTransformer 拼装
    requestConfig: {
      url: "/get-posts/",
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      requestConfig!.url = `/get-posts/${keywords ? `keywords:${encodeURIComponent(keywords)}` : ""}`;
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "div.tgxtablerow" },
      title: { selector: ['a[href^="/post-detail/"]'], attr: "title" },
      url: { selector: ['a[href^="/post-detail/"]'], attr: "href" },
      size: { selector: "div.tgxtablecell:nth-last-child(5)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "div.tgxtablecell:nth-last-child(2) span font", filters: [{ name: "parseNumber" }] },
      leechers: {
        selector: "div.tgxtablecell:nth-last-child(2) span font:nth-of-type(2)",
        filters: [{ name: "parseNumber" }],
      },
      comments: { selector: "div.tgxtablecell:nth-last-child(4) font a", filters: [{ name: "parseNumber" }] },
      // 时间有两种形态，实测于 /get-posts/ 列表页（2026-11-11）：
      //   - 新种子：`<small class="added-date">4 Mins ago</small>`（相对时间，单位首字母大写）
      //   - 旧种子：`<small class="added-date">07/11/26 14:03</small>`（dd/mm/yy，站点本地时间）
      // 站点既有的 TTL 解析器只认小写单位（`minute|min|m`，正则无 i 标志），`4 Mins ago` 会解析失败、
      // 时间为空；而 dd/mm/yy 交给原生 Date 会被当成 mm/dd（`new Date("07/11/26")` → 7 月 11 日），
      // 偏差数月。因此这里统一收口：绝对时间重排成 yyyy-MM-dd HH:mm:ss 字符串（由基类按 timezoneOffset
      // 换算，避免在解析层丢失站点时区），相对时间转小写后交给 TTL 解析。
      // 参考 Jackett 2026-11-10 https://github.com/Jackett/Jackett/commit/1383b41378fdb422b56ea1a0d58ddbb23e30cb5a
      // （同样把 small.added-date 拆成 date_ago / date_year 两种取值）。
      time: {
        selector: "small.added-date",
        filters: [
          (raw: string): string | number | undefined => {
            const text = String(raw ?? "").trim();
            if (!text) {
              return undefined;
            }

            const absolute = /^(\d{2})\/(\d{2})\/(\d{2})(?:\s+(\d{2}):(\d{2}))?$/.exec(text);
            if (absolute) {
              const [, dd, mm, yy, hh = "00", mi = "00"] = absolute;
              return `20${yy}-${mm}-${dd} ${hh}:${mi}:00`;
            }

            const ttl = parseTimeToLiveToDate(text.toLowerCase());
            return typeof ttl === "number" ? ttl : undefined;
          },
        ],
      },
      category: { selector: 'a[href^="/get-posts/category:"]' },
      ext_imdb: {
        selector: 'a[href^="/get-posts/keywords:tt"]',
        attr: "href",
        filters: [(href: string) => href.match(/tt\d+/)?.[0] ?? ""],
      },
    },
  },

  // 列表页没有 magnet（只有一个跳到详情页的磁力图标），磁力链接在详情页
  detail: {
    urlPattern: ["/post-detail/"],
    selectors: {
      // 页面头是 `Torrent details for "标题" …`（还夹着收藏按钮），og:title 才是干净的标题
      title: { selector: 'meta[property="og:title"]', attr: "content" },
      link: { selector: ['a[href^="magnet:?xt="]'], attr: "href" },
      // 详情页正文里只有「相似种子」列表（每行各有各的体积），没有单独给出本种子的体积；
      // 只有 meta 里带了它：`<title> torrent, 2.5 GB, 10408 seeders, 8993 leechers. Category: TV.`
      // 注意 transformDetailPage 不做类型转换，取出 "2.5 GB" 后还要接一个 parseSize
      size: {
        selector: 'meta[property="og:description"]',
        attr: "content",
        filters: [(q: string) => q.match(/torrent,\s*([\d.]+\s*[KMGT]?B)/i)?.[1] ?? "", { name: "parseSize" }],
      },
      // 这三个统计按钮各只有一个，数值与搜索页对同一颗种子给出的 S/L 一致（已核对 10408/8993）
      seeders: { selector: ["button.btn-success"], filters: [(q: string) => q.replace(/\D+/g, "")] },
      leechers: { selector: ["button.btn-danger"], filters: [(q: string) => q.replace(/\D+/g, "")] },
      completed: { selector: ["button.btn-info"], filters: [(q: string) => q.replace(/\D+/g, "")] },
      category: {
        selector: [".tprow:contains('Category:')"],
        filters: [(q: string) => q.replace(/^.*Category:\s*/, "").trim()],
      },
      // 站点没有在详情页给出本种子的发布时间（只列了相似种子的 Added），故不设 time；
      // id 也不设 —— 框架会用 doc.URL 兜底，正好与搜索页由 url 推出的 id 保持一致
    },
  },

  list: [
    {
      urlPattern: ["/get-posts/"],
      selectors: {
        keywords: { selector: "input#topsearch", attr: "value" },
      },
    },
  ],
};
