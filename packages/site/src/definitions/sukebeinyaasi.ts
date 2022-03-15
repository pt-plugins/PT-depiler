import type { ISiteMetadata } from "../types";
import { NyaaSelectors } from "./nyaasi";

export const siteMetadata: ISiteMetadata = {
  name: "Nyaa Torrents (Sukebei)",
  type: "public",
  description:
    "一个侧重于东亚（中国、日本及韩国）多媒体资源的BitTorrent站点，是世界上最大的动漫专用种子索引站。",
  url: "https://sukebei.nyaa.si/",
  category: {
    key: "c",
    options: [
      { name: "All categories", value: "0_0" },
      { name: "Art", value: "1_0" },
      { name: "Art - Anime", value: "1_1" },
      { name: "Art - Doujinshi", value: "1_2" },
      { name: "Art - Games", value: "1_3" },
      { name: "Art - Manga", value: "1_4" },
      { name: "Art - Pictures", value: "1_5" },
      { name: "Real Life", value: "2_0" },
      { name: "Real Life - Pictures", value: "2_1" },
      { name: "Real Life - Videos", value: "2_2" },
    ],
  },
  search: {
    keywordsParam: "q",
    requestConfig: { params: { c: "0_0" } },
    categories: [
      {
        name: "Filter",
        key: "f",
        options: [
          { name: "No filter", value: 0 },
          { name: "No remakes", value: 1 },
          { name: "Trusted only", value: 2 },
        ],
      },
      {
        name: "Sort",
        key: "s",
        options: [
          { name: "Created", value: "id" },
          { name: "Size", value: "size" },
          { name: "Seeders", value: "seeders" },
          { name: "Leechers", value: "leechers" },
          { name: "Downloaders", value: "downloads" },
          { name: "Comments", value: "comments" },
        ],
      },
      {
        name: "Order",
        key: "o",
        options: [
          { name: "Descending", value: "desc" },
          { name: "Ascending", value: "asc" },
        ],
      }
    ],
    selectors: NyaaSelectors,
  }
};
