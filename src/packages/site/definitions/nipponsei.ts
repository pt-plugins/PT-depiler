/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/nipponsei.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "nipponsei",
  name: "Nipponsei",
  description: "Nipponsei 是一个公开的日本动漫音乐 BT 站，提供 OST / OP / ED Single 等资源",
  tags: ["音乐", "动漫"],

  type: "public",
  urls: ["https://nipponsei.minglong.org/"],

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/index.php",
      responseType: "document",
      params: { section: "Tracker", search: "" },
    },
    selectors: {
      rows: { selector: "tr.odd, tr.even" },
      // 站点没有种子详情页，也没有数字 id，用 .torrent 文件名做 id
      id: { selector: "a", attr: "href", filters: [(q: string) => q.split("/").pop() ?? q] },
      title: { selector: "a", filters: [{ name: "replace", args: ["[Nipponsei] ", ""] }] },
      // Jackett 的 details 也是 text: "/"，这里指向站点的 Tracker 列表页
      url: { text: "https://nipponsei.minglong.org/index.php?section=Tracker" },
      link: { selector: "a", attr: "href" },
      // 带关键词的搜索页只有 4 列（Torrent / Seeds / Leech / Downloads），没有日期与体积列，
      // 仅在无关键词的浏览页提供；Jackett 用 now / 128MB 兜底，此处留空不编造。
      // seeders 在搜索页是 number_yellow、浏览页是 number_green，用数组依次尝试。
      seeders: { selector: ["td.number_yellow", "td.number_green"] },
      leechers: { selector: "td.number_red" },
      completed: { selector: "td.number" },
      category: { text: "Music" },
    },
  },

  list: [
    {
      urlPattern: ["index\\.php\\?section=Tracker"],
      selectors: {
        keywords: { selector: 'input[name="search"]', attr: "value" },
      },
    },
  ],
};
