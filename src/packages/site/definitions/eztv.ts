/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/eztv.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "eztv",
  name: "EZTV",
  description: "EZTV 是一个专注于美剧的公共 BT 站点",
  tags: ["电视剧"],

  type: "public",

  urls: ["https://eztvx.to/", "https://eztv.wf/", "https://eztv.tf/", "https://eztv.yt/", "https://eztv1.xyz/"],
  legacyUrls: [
    "https://eztv.ag/",
    "https://eztv.it/",
    "https://eztv.ch/",
    "https://eztv.io/",
    "https://eztv.re/",
    "https://eztv.li/",
    "https://eztv.nocensor.cloud/",
    "https://eztv.ninjaproxy1.com/",
    "https://eztv.proxyninja.org/",
    "https://eztv.abcproxy.org/",
    "https://eztv.unblockit.download/",
  ],

  search: {
    keywordPath: "q", // 关键词放在路径中，实际由 requestConfigTransformer 拼装
    requestConfig: {
      url: "/home",
      responseType: "document",
      // 站点默认把下载链接折叠成 “Show links” 按钮，带上该 cookie 才会在列表页直接渲染磁力链接
      // （浏览器中 Cookie 是禁用头，由 extends/axios/replaceUnsafeHeader.ts 经 declarativeNetRequest 注入）
      headers: {
        cookie: "sort_no=100; q_filter=all; q_filter_web=on; q_filter_reality=on; q_filter_x265=on; layout=def_wlinks",
      },
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      // Jackett 的 keywordsfilters：去掉单独的季标记、去掉 "-"、空格转 "-"、去掉 "&"
      const keyword = String(keywords ?? "")
        .replace(/\bS\d{2,3}\b/g, "")
        .trim()
        .replace(/-/g, "")
        .replace(/ /g, "-")
        .replace(/&/g, "");

      requestConfig!.url = keyword ? `/search/${keyword}` : "/home";
      return requestConfig!;
    },
    selectors: {
      // 只保留带磁力链接的行；无关键词时用 Latest / Releases 表避免重复
      rows: {
        selector:
          "table.forum_header_border:contains('Latest') tr[name='hover'].forum_header_border:has(a.magnet), " +
          "table.forum_header_border:contains('Releases') tr[name='hover'].forum_header_border:has(a.magnet)",
      },
      id: {
        selector: "td:nth-child(2) a",
        attr: "href",
        filters: [(href: string) => href.match(/\/ep\/(\d+)/)?.[1] ?? href],
      },
      // 站点只有 TV 一类资源（Jackett caps: 1: TV）
      category: { text: "TV" },
      title: {
        // title 形如 "Show S07E04 ... [eztv] (835.09 MB)"
        selector: "td:nth-child(2) a",
        attr: "title",
        filters: [
          (title: string) => title.replace(/\[eztv\]/g, ""),
          (title: string) => title.replace(/\(.*\)$/, ""),
          { name: "trim" },
        ],
      },
      url: { selector: "td:nth-child(2) a", attr: "href" },
      link: { selector: ["td:nth-child(3) a.magnet", "td:nth-child(3) a"], attr: "href" },
      // 部分行没有体积，Jackett 中回落到 512 MB
      size: { selector: "td:nth-child(4)", text: "512 MB", filters: [{ name: "parseSize" }] },
      time: {
        selector: "td:nth-child(5)",
        // 站点给出的是 "now" / "8m" / "4h 12m" / "5d 8h" / "1 mo" / "3 weeks" / "1 year" 这类短单位
        // （d=天、h=小时、m=分钟，月份写作 mo），先展开成可解析的单位再解析
        filters: [
          { name: "replace", args: [/^now$/i, "0 minutes"] },
          { name: "replace", args: [/(\d+)\s*d\b/g, "$1 days"] },
          { name: "replace", args: [/(\d+)\s*h\b/g, "$1 hours"] },
          { name: "replace", args: [/(\d+)\s*m\b/g, "$1 minutes"] },
          { name: "append", args: [" ago"] },
          { name: "parseFuzzyTime" },
          // 该列文案未能真机验证（搜索路径被 CF 拦截），解析不出来时置空，避免整页搜索因此报错
          (time: number | string) => (typeof time === "string" ? undefined : time),
        ],
      },
      seeders: { selector: "td:nth-child(6)" },
      leechers: { text: 0 },
    },
  },

  list: [
    {
      urlPattern: ["/search/", "/home"],
      selectors: {
        keywords: { selector: 'input[name="q1"]', attr: "value" },
      },
    },
  ],
};
