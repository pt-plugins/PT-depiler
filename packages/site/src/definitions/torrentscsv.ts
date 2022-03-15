import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "Torrents.csv",
  type: "public",
  description:
    "Torrents.csv is a self-hostable, open source torrent search engine and database",
  url: "https://torrents-csv.ml/",
  search: {
    requestConfig: {
      url: "/service/search",
      responseType: "json",
      params: {
        page: 1,
        type_: "torrent",
      },
    },
    keywordsParam: "q",
    selectors: {
      rows: { selector: ":self" },
      id: { selector: "infohash" },
      title: { selector: "name" },
      url: { text: "https://torrents-csv.ml/" }, // 该站种子不存在独立介绍页
      link: {
        selector: "infohash",
        filters: [(q: string) => `magnet:?xt=urn:btih:${q}`],
      },
      time: { selector: "created_unix" },
      size: { selector: "size_bytes" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "completed" },
    },
  },
};
