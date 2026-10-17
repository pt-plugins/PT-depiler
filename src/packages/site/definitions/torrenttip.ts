/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/torrenttip.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * 站点时间：详情页里「틈만나면,.E61.261013.720p-NEXT」显示 `2026/10/13 14:32`，
 * 抓取时 UTC 为 14:42 —— 页面上写的就是 UTC 墙上时间（这颗种子在 torrentsome 上显示 `26.10.13 23:26`，
 * 该站是 KST(+0900)，两者相差 9 小时，可交叉印证）。因此这里显式声明 +0000。
 */
const SITE_TZ_HOURS = 0;

/** 列表页只给 `yy/MM/dd`（站点时区 UTC），没有时分秒，按当天 00:00 UTC 处理 */
function parseListTime(text: string): number {
  const match = /(\d{2})\/(\d{2})\/(\d{2})/.exec(String(text));
  return match ? Date.UTC(2000 + +match[1], +match[2] - 1, +match[3]) - SITE_TZ_HOURS * 3600e3 : 0;
}

/** 详情页的 `2026/05/02 06:32` */
function parseDetailTime(text: string): number {
  const match = /(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})/.exec(String(text));
  return match ? Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4] - SITE_TZ_HOURS, +match[5]) : 0;
}

/** /t/<6 位短码>.html —— 列表页与详情页都从链接里取同一个短码，保证 id 一致 */
const shortId = (href: string) => /\/t\/([^/.]+)\.html/.exec(String(href))?.[1];

/**
 * 详情页给出的 magnet 是 `magnet:?xt=urn:<40 位 hash>`（站点漏了 `btih:`，任何客户端都认不出来），
 * 这里按页面上的 hash 补成标准的 `urn:btih:`。
 */
function fixMagnet(href: string): string {
  const hash = /^magnet:\?xt=urn:([0-9a-fA-F]{40})$/.exec(String(href).trim())?.[1];
  return hash ? `magnet:?xt=urn:btih:${hash}` : href;
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torrenttip",
  name: "Torrenttip",
  description: "Torrenttip（토렌트팁）是韩国公共 BT 索引站，收录韩国影视、综艺、音乐等资源",
  tags: ["综合"],

  type: "public",
  urls: ["https://torrenttip248.top/"],
  legacyUrls: [
    "https://torrenttip232.top/",
    "https://torrenttip233.top/",
    "https://torrenttip234.top/",
    "https://torrenttip235.top/",
    "https://torrenttip236.top/",
    "https://torrenttip237.top/",
    "https://torrenttip238.top/",
    "https://torrenttip239.top/",
    "https://torrenttip240.top/",
    "https://torrenttip241.top/",
    "https://torrenttip242.top/",
    "https://torrenttip243.top/",
    "https://torrenttip244.top/",
    "https://torrenttip245.top/",
    "https://torrenttip246.top/",
    "https://torrenttip247.top/",
  ],

  timezoneOffset: "+0000",

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/search",
      responseType: "document",
      params: { sort: "time" },
    },
    selectors: {
      // `li` 的内容是 `[ 分类 ] 标题`；`[  ]`（两个空格）表示该条目在站上已失效，
      // 沿用 Jackett 的条件排除掉
      rows: { selector: 'ul.page-list > li:has(a[href$=".html"][title]):not(:contains("[  ]"))' },
      id: { selector: 'a[href$=".html"][title]', attr: "href", filters: [shortId] },
      // 元素文本里含有 <em> 高亮，完整标题只存在于 title 属性中
      title: { selector: 'a[href$=".html"][title]', attr: "title" },
      url: { selector: 'a[href$=".html"][title]', attr: "href" },
      category: {
        selector: "div:nth-child(2)",
        filters: [(text: string) => /\[\s*(.+?)\s*\]/.exec(String(text))?.[1] ?? ""],
      },
      time: { selector: "div:nth-child(3)", filters: [parseListTime] },
      // 列表页不显示体积，做种/下载/完成人数站点也不提供，留空
    },
  },

  list: [
    {
      urlPattern: ["/search"],
      selectors: {
        keywords: { selector: 'input[name="q"]', attr: "value" },
      },
    },
  ],

  // 详情页 /t/<短码>.html：列表页给不出 magnet，它只出现在这一页上
  detail: {
    urlPattern: ["/t/[^/]+\\.html"],
    selectors: {
      // 「관련 정보」区的第一条总是当前条目自身的链接（已抽查 5 个详情页一致），
      // 用它保证详情页解析出的 id 与列表页的短码一致
      id: { selector: 'div.p-2.border-b.border-dashed > a[href*="/t/"]', attr: "href", filters: [shortId] },
      title: { selector: "h1.title" },
      link: { selector: 'a[href^="magnet:"]', attr: "href", filters: [fixMagnet] },
      time: {
        selector: "div.border-b.text-xs.p-2.text-gray-400",
        filters: [parseDetailTime],
      },
      size: { selector: "div.p-2:not(:has(div)):has(i.fa-hdd)", filters: [{ name: "parseSize" }] },
    },
  },
};
