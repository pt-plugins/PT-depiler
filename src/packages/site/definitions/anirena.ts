/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/anirena.yml
 */
import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "anirena",
  name: "AniRena",
  description: "AniRena is a Public torrent tracker for the latest anime and Japanese related torrents",
  tags: ["Anime"],

  type: "public",
  urls: ["https://www.anirena.com/"],
  formerHosts: ["anirena.com"],

  category: [
    {
      name: "Category",
      key: "t",
      options: [
        { name: "Raw Animes", value: 1 },
        { name: "Anime", value: 2 },
        { name: "Hentai", value: 3 },
        { name: "Drama", value: 4 },
        { name: "DVD/ISO", value: 5 },
        { name: "Hentai-Game", value: 6 },
        { name: "Manga", value: 7 },
        { name: "Audio", value: 8 },
        { name: "Anime Music Videos", value: 9 },
        { name: "Non-English", value: 10 },
        { name: "Other", value: 11 },
      ],
      cross: false,
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: { url: "/" },
    selectors: {
      rows: { selector: "div.full2:not([id]) table tr" },
      id: {
        selector: "div.torrents_small_info_data1 a[nohref]",
        attr: "onClick",
        filters: [(q: string) => q.match(/details(\d+)/)?.[1]],
      },
      title: {
        selector: "div.torrents_small_info_data1 a[nohref]",
        attr: "title",
      },
      url: { text: "https://www.anirena.com/" }, // 这个站没有种子详情页面，都是直接加载到列表中的
      link: {
        selector: 'div.torrents_small_info_data2b a[title!="Report a torrent"]',
        attr: "href",
      },
      // 发布时间 动态加载，不做获取
      size: { selector: "td.torrents_small_size_data1" },
      seeders: { selector: "td.torrents_small_seeders_data1" },
      leechers: { selector: "td.torrents_small_leechers_data1" },
      completed: { selector: "td.torrents_small_downloads_data1" },
      category: { selector: "td.torrents_small_type_data1 img", attr: "title" },
    },
  },
};
