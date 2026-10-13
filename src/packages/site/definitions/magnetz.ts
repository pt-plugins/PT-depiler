/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/magnetz.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * 详情页里有一段站点自述的 JSON-LD（`<script type="application/ld+json">`），
 * 形如 {"@type":"Dataset","identifier":"<infohash>","datePublished":"2025-10-18T23:50:17+00:00",
 *      "contentSize":"1.86 GB","url":"https://magnetz.eu/Zfuh"}
 * 这是详情页上唯一的「发布时间」来源（列表页完全不渲染时间），故从这里取值。
 * elementProcess 的返回值仍会继续走 filters，所以 id 用同一个 elementProcess + 不同的 filter 提取。
 */
const jsonLd = (el: Element): any => {
  try {
    return JSON.parse(el.textContent ?? "{}");
  } catch {
    return {};
  }
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "magnetz",
  name: "Magnetz",
  description: "Magnetz 是一个公开的 BT 元搜索引擎，聚合影视、音乐、游戏、软件、电子书等资源（无需登录）",

  type: "public",
  urls: ["https://magnetz.eu/"],

  search: {
    keywordPath: "params.query",
    requestConfig: {
      url: "/search",
      responseType: "document",
      params: { query: "" },
    },
    selectors: {
      rows: { selector: "article.result-card" },
      // 详情页 URL 就是根路径下的 sqid（如 /Zfuh、/2okv7）
      id: {
        selector: ".result-card__name > a",
        attr: "href",
        filters: [(q: string) => q.split("/").filter(Boolean).pop() ?? ""],
      },
      title: { selector: ".result-card__name > a" },
      url: { selector: ".result-card__name > a", attr: "href" },
      // 卡片里有两个指向 magnet 的链接（复制按钮的 data-magnet 与「用客户端打开」的 a），
      // 这里取后者；前者是 <button data-magnet>，不是 a[href^="magnet:"]
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
      size: { selector: "span.meta-chip--size", filters: [{ name: "parseSize" }] },
      seeders: { selector: "span.meta-chip--seeders", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "span.meta-chip--leechers", filters: [{ name: "parseNumber" }] },
      // 站点自己的分类 id 就是 chip 的修饰类名后缀（movie / tv / xxx / app ...），
      // 与 Jackett categorymappings 的 id 完全一致；用文本（"Movie"）反而要另外建映射表
      category: {
        selector: "span.meta-chip--type",
        attr: "class",
        filters: [(q: string) => q.match(/meta-chip--type-([a-z0-9]+)/)?.[1] ?? ""],
      },
      // 列表页不渲染发布时间（Jackett 的 `date: text: now` 是占位值），也拿不到 completed / author，一律留空
    },
  },

  // 详情页 /<sqid>，与 /browse、/login 等静态路由同形，只能靠负向先行断言排除已知路由
  // （匹配时会加 "i" 标志，无法靠大小写区分）
  detail: {
    urlPattern: [
      "^https?://magnetz\\.eu/(?!browse$|lists$|login$|register$|search$|about$|apis$|rss$|wiki$|terms$|privacy$|contact$|how$|download-anonymously$|mcp-server$)[A-Za-z0-9]+$",
    ],
    selectors: {
      title: { selector: "h1.detail__title" },
      id: {
        selector: 'script[type="application/ld+json"]',
        elementProcess: (el: Element) => jsonLd(el).url,
        filters: [(q: string) => q.split("/").filter(Boolean).pop() ?? ""],
      },
      url: {
        selector: 'script[type="application/ld+json"]',
        elementProcess: (el: Element) => jsonLd(el).url,
      },
      link: { selector: "a#link-button", attr: "href" },
      // "2025-10-18T23:50:17+00:00" 已带偏移，Date.parse 得到的就是绝对时间戳（不依赖运行主机时区）
      time: {
        selector: 'script[type="application/ld+json"]',
        elementProcess: (el: Element) => jsonLd(el).datePublished,
        filters: [(q: string) => Date.parse(q) || 0],
      },
      size: {
        selector: 'script[type="application/ld+json"]',
        elementProcess: (el: Element) => jsonLd(el).contentSize,
        filters: [{ name: "parseSize" }],
      },
      seeders: {
        selector: '.meta-grid__item:has(.meta-grid__label:contains("Seeders")) .meta-grid__value',
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: '.meta-grid__item:has(.meta-grid__label:contains("Leechers")) .meta-grid__value',
        filters: [{ name: "parseNumber" }],
      },
      category: {
        selector: "span.meta-chip--type",
        attr: "class",
        filters: [(q: string) => q.match(/meta-chip--type-([a-z0-9]+)/)?.[1] ?? ""],
      },
      author: {
        selector: '.detail__tags .tag:contains("Group:")',
        filters: [(q: string) => q.replace(/^Group:\s*/i, "").trim()],
      },
      // 站点不提供 completed，留空
    },
  },
};
