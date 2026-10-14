/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/damagnet.yml
 *
 * ⚠️ 截至 2026-10-13 该站被 Cloudflare 拦截：3 次根域 + `/?q=2026&wanted=100` 全部 403
 * （响应约 5.5KB，标题 "Just a moment..."，CF JS 挑战页）。**未取得任何真机样本**，
 * 以下选择器与参数依据 Jackett 定义，**未经真机验证**（Jackett 也为该站配了
 * `info_flaresolverr` 提示，说明那边同样需要 FlareSolverr 才能过 CF）。
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "damagnet",
  name: "DaMagNet",
  description: "DaMagNet is a Public DHT Crawler",
  tags: ["综合"],

  type: "public",
  urls: ["https://damag.net/"],

  search: {
    keywordPath: "params.q",
    // Jackett: 无关键词时以当年年份搜索
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      requestConfig!.params.q = keywords || String(new Date().getFullYear());
      return requestConfig!;
    },
    requestConfig: {
      url: "/",
      responseType: "document",
      params: { q: "", wanted: 100 }, // wanted: 20 / 50 / 100
    },
    selectors: {
      rows: { selector: "table.table-striped > tbody > tr:has(a)" },
      // 该站是 DHT 爬虫，列表页给出的就是 magnet 本体，用它做 id/link（与 url 同源）
      id: { selector: "a[href^='magnet:?xt']", attr: "href" },
      title: { selector: "a" },
      url: { selector: "a", attr: "href" },
      link: { selector: "a", attr: "href" },
      size: { selector: "span[id^='size']", filters: [{ name: "parseSize" }] },
      // Jackett caps 里只有一个 Other 分类，且列表页没有分类信息
      category: { text: "Other" },
      // Jackett 的 date 是硬编码 text: now、seeders/leechers 是硬编码占位值（1/1），
      // 都不是站点真实数据；本仓库不照抄占位值，这几个字段留空。
    },
  },

  // 未声明 detail：被 CF 拦截拿不到详情页样本，且 Jackett 定义里没有 details 段可依据。
};
