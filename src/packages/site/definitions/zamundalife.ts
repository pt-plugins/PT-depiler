/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/zamundalife.yml
 *
 * ⚠️ 截至 2026-10-11 该站的 JSON API 无法访问：
 *    - https://zamunda.life/api/torrents 一律返回 Cloudflare 522（源站连接超时）
 *    - legacy 域 https://zamunda.rip 返回 521，且整站不可用
 *    站点首页 https://zamunda.life/ 正常（200）。
 *    下面的接口契约取自 Jackett 定义 + 站点自身前端 /static/script.js（二者一致），**未经真机验证**。
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "zamundalife",
  name: "Zamunda LIFE",
  aka: ["Zamunda.RIP"],
  description: "Zamunda LIFE is a BULGARIAN Public Torrent Archive for MOVIES / TV / GENERAL",
  tags: ["综合", "影视"],

  type: "public",
  urls: ["https://zamunda.life/"],
  legacyUrls: ["https://zamunda.rip/"],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/api/torrents",
      responseType: "json",
      params: { limit: 50 }, // Jackett: https://zamunda.life/api/torrents?q=&limit=50
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      if (keywords) {
        // Jackett 的 keywordsfilters: replace "." " "（该站对 "." 的检索有问题，故把点换成空格）
        requestConfig!.params.q = keywords.replace(/\./g, " ");
      }
      return requestConfig!;
    },
    selectors: {
      // 接口直接返回 JSON 数组（Jackett 写作 rows: $），本框架里用 :self 表示根数组
      rows: { selector: ":self" },
      id: { selector: "external_id" },
      title: { selector: "title" },
      // 站点是纯 magnet 聚合页，没有单种子详情页（Jackett 的 details 用站点首页占位），故不定义 url
      link: { selector: "link" }, // magnet:?xt=urn:btih:...
      size: { selector: "size" },
      category: { selector: "category" }, // 站点原文（保加利亚语），如 "Филми/HD"
      // 接口不返回发布时间与做种/下载数（Jackett 里 date 用 now、seeders/leechers 硬编码 1），留空
    },
  },
};
