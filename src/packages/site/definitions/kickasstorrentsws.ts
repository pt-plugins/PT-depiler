/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/kickasstorrents-ws.yml
 *
 * 注：本仓库的 `id` 只允许 /^[0-9a-z]+$/，因此 Jackett 的 `kickasstorrents-ws`
 * 在本仓库里写作 `kickasstorrentsws`（仅去掉连字符）。
 */
import { type ISearchInput, type ISiteMetadata } from "../types";

/**
 * KAT 家族（kickass.ws 系）的镜像全部是同一份代码，搜索路径为 `/usearch/<关键词>/`。
 * 注意结尾的斜杠是必需的：写成 `/usearch/<关键词>` 时站点会把 `?field=…&sorder=…`
 * 当成关键词的一部分（返回 0 条），实测确认。
 */
export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "kickasstorrentsws",
  name: "kickasstorrents.ws",
  description: "kickasstorrents.ws 是 KickassTorrents 的公共镜像，提供 MOVIES / TV / GENERAL 资源。",
  tags: ["影视", "综合"],

  type: "public",

  urls: [
    "https://kickasstorrents.bz/",
    "https://kkickass.com/",
    "https://kkat.net/",
    "https://kick4ss.com/",
    "https://kickasst.net/",
    "https://kickasstorrents.id/",
    "https://thekat.cc/",
    "https://kattracker.com/",
  ],

  legacyUrls: [
    "https://kickass.ws/", // 首页可达（200），但搜索接口恒 403
    "https://kickass.gg/",
    "https://katcr.io/",
    "https://thekat.nz/",
    "https://thekat.se/",
    "https://kat.how/",
    "https://kat.li/",
    "https://kickass-kat.com/",
    "https://kickass.sh/",
    "https://kickasshydra.dev/",
  ],

  search: {
    // 关键词在 URL 路径里（见 requestConfigTransformer），不能让它再进 params，
    // 否则会多出一个站点不认的 `keywords=` 参数；写到未使用的 data 上即可。
    keywordPath: "data.__keywords",
    requestConfig: {
      url: "/usearch",
      responseType: "document",
      params: { field: "time_add", sorder: "desc" },
    },
    requestConfigTransformer: (input: ISearchInput) => {
      input.requestConfig!.url = `/usearch/${encodeURIComponent(input.keywords ?? "")}/`;
      return input.requestConfig!;
    },
    selectors: {
      rows: { selector: "table.data tr[id]:has(a[data-download])" },
      title: { selector: "a.cellMainLink" },
      url: { selector: "a.cellMainLink", attr: "href" },
      link: {
        selector: "a[data-download]",
        attr: "href",
        // 站点给的是 `https://mylink.cloud/?url=<urlencoded magnet>`，取回真正的 magnet
        filters: [{ name: "querystring", args: ["url"] }],
      },
      time: { selector: "td:nth-child(3)", filters: [{ name: "parseFuzzyTime" }] },
      size: { selector: "td:nth-child(2)" },
      seeders: { selector: "td:nth-child(4)" },
      leechers: { selector: "td:nth-child(5)" },
      completed: { selector: "a.icommentjs" },
    },
  },

  list: [{ urlPattern: ["/usearch", "/new", "/top100"] }],
};
