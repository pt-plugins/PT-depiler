/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/TorrentsCSV.cs
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torrentscsv",
  name: "Torrents-CSV",
  tags: ["综合"],
  aka: ["TorrentsCSV"],
  description: "Torrents.csv is a self-hostable, open source torrent search engine and database",

  type: "public",
  urls: ["https://torrents-csv.com/"],
  legacyUrls: ["https://torrents-csv.ml/"],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/service/search",
      responseType: "json",
      params: { size: 100 },
    },
    skipWhiteSpacePlaceholder: true,
    selectors: {
      rows: { selector: "torrents" },
      id: { selector: "id" },
      title: { selector: "name" },
      url: { text: "https://torrents-csv.com/" }, // 该站种子不存在独立介绍页
      link: {
        selector: "infohash",
        filters: [{ name: "infoHashToMagnet" }],
      },
      infoHash: { selector: "infohash" },
      time: { selector: "created_unix" },
      size: { selector: "size_bytes" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "completed" },
    },
  },

  list: [
    {
      urlPattern: ["/search"],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "main.container div.card" },
        id: { selector: "a[href^='magnet']", attr: "href" },
        // 列表页 id 即整条 magnet，把其中的 infohash 显式落到 torrent.infoHash
        infoHash: { selector: "a[href^='magnet']", attr: "href", filters: [{ name: "magnetToInfoHash" }] },
        title: { selector: "a[href^='magnet']" },
        url: { text: "https://torrents-csv.com/" }, // 该站种子不存在独立介绍页
        link: { selector: "a[href^='magnet']", attr: "href" },
        leechers: { selector: "div.card-body > div.flex > div:nth-child(1) > span:nth-child(2)" },
        size: {
          selector: "div.card-body > div.flex > div:nth-child(2) > span:nth-child(2)",
          filters: [{ name: "parseSize" }],
        },
        time: {
          selector: "div.card-body > div.flex > div:nth-child(3) > span:nth-child(2)",
          filters: [{ name: "parseTime", args: ["yyyy-MM-dd"] }],
        },
      },
    },
  ],
};
