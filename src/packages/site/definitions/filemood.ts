/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/filemood.yml
 *
 * 真机验证（2026-10-13）：列表页 https://filemood.com/result?q=2026 返回 200 / 80KB，
 * `table > tbody > tr:has(a.btn-success)` 命中 20 行；用 harness/verify.mjs 跑完整搜索链路通过。
 * 详情页（/xxx-<40位hash>.html）没有 magnet、也没有承载 magnet 的 data 属性，
 * 即「列表页就是全部信息」，故不提供 detail。
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "filemood",
  name: "FileMood",
  description: "FileMood is a Public BitTorrent DHT search engine.",
  tags: ["综合"],

  type: "public",
  urls: ["https://filemood.com/"],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/result",
      responseType: "document",
      params: { q: "" },
    },
    // Jackett: q = "<keywords>" + " in:title"（有关键词时强制只搜标题），关键词统一小写
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      const lower = (keywords ?? "").toLowerCase();
      requestConfig!.params.q = lower ? `${lower} in:title` : "";
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "table > tbody > tr:has(a.btn-success)" },
      // 详情页链接形如 /<slug>-<40 位 infohash>.html，列表页与详情页用的是同一个地址
      id: { selector: "a.btn-success", attr: "href" },
      // 不能用 a 的 title 属性：站点的 title 属性被过滤过（"v15.2.5.17803 (x64)" 变成 "v15 17803 x64"），
      // 链接文本才是完整种子名
      title: { selector: "a" },
      url: { selector: "a", attr: "href" },
      // 该站是 DHT 搜索引擎，下载链接由种子名 + 40 位 infohash 拼出；列表页与详情页都没有现成的 magnet
      link: {
        selector: "a.btn-success",
        attr: "href",
        filters: [
          (query: string) => {
            const infohash = /([a-f0-9]{40})/i.exec(String(query))?.[1];
            return infohash ? `magnet:?xt=urn:btih:${infohash}` : "";
          },
        ],
      },
      size: { selector: "td.dn-size", filters: [{ name: "parseSize" }] },
      // td.dn-status 里形如 "<b>59671/39770</b>"，依次是 seeders/leechers
      seeders: { selector: "td.dn-status", filters: [{ name: "split", args: ["/", 0] }, { name: "parseNumber" }] },
      leechers: { selector: "td.dn-status", filters: [{ name: "split", args: ["/", 1] }, { name: "parseNumber" }] },
      // 列表页只有相对时间（形如 "Last Seen 2 minutes ago"）且时间列在详情页，列表页不提供发布时间；
      // 不写 time，交给框架的默认值，避免用 parseTime 在主机时区上瞎猜
      category: { text: "Other" },
    },
  },

  list: [
    {
      urlPattern: ["/result"],
      selectors: { keywords: { selector: "input#search-input", attr: "value" } },
    },
  ],
};
