/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/kickasstorrents-to.yml
 *
 * 注：本仓库的 `id` 只允许 /^[0-9a-z]+$/，因此 Jackett 的 `kickasstorrents-to`
 * 在本仓库里写作 `kickasstorrentsto`（仅去掉连字符）。
 */
import { type ISiteMetadata } from "../types";

/**
 * KAT 家族（kickasstorrents.to 系）的镜像，与 kickasstorrentsws 是两套代码，搜索路径为 `search/?q=`。
 *
 * 实测（2026-10）：Jackett `links` 里的 4 个镜像全部不可用 ——
 * `kickass.torrentbay.st` / `kickass.torrentsbay.org` / `kickasstorrents.proxyninja.org`
 * 均返回 Cloudflare 的 "Just a moment..." 挑战页（HTTP 403），
 * `kickasstorrents.ninjaproxy1.com` 直接连不上。
 * 因此本定义**未通过真机验证**，选择器全部照抄 Jackett YAML。
 */
export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "kickasstorrentsto",
  name: "kickasstorrents.to",
  description: "kickasstorrents.to 是 KickassTorrents 的公共镜像，提供 MOVIES / TV / GENERAL 资源。",
  tags: ["影视", "综合"],

  type: "public",

  urls: [
    "https://kickass.torrentbay.st/",
    "https://kickass.torrentsbay.org/",
    "https://kickasstorrents.proxyninja.org/",
    "https://kickasstorrents.ninjaproxy1.com/",
  ],

  legacyUrls: [
    "https://kat.root.yt/",
    "https://kickasstorrents.abcproxy.org/",
    "https://kickasstorrents.to/",
    "https://kickasstorrent.cr/",
    "https://katcr.to/",
    "https://www.kickasstorrents.do/",
    "https://kickasstorrents.unblockninja.com/",
    "https://kickasstorrents.proxyninja.net/",
  ],

  search: {
    requestConfig: { url: "/search/", responseType: "document", params: { q: "" } },
    keywordPath: "params.q",
    selectors: {
      rows: { selector: 'table.data > tbody > tr:has(a[href^="magnet:?xt="])' },
      category: { selector: "span > strong", filters: [{ name: "replace", args: ["[>| ]+", ""] }] },
      title: { selector: "a.cellMainLink" },
      url: { selector: "a.cellMainLink", attr: "href" },
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
      time: { selector: "td.timeago", filters: [{ name: "parseFuzzyTime" }] },
      size: { selector: "td:nth-child(2)" },
      seeders: { selector: "td:nth-child(5)" },
      leechers: { selector: "td:nth-child(6)" },
    },
  },

  list: [{ urlPattern: ["/search/", "/\\d+/All/"] }],
};
