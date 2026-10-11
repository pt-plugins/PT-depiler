/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/pandacd.yml
 */
import { type ISearchCategoryOptions, type ISiteMetadata } from "../types";

// https://pandacd.io/api/torznab?t=caps （实测该接口无需 apikey）
const categories: ISearchCategoryOptions[] = [
  { name: "Audio", value: 3000 },
  { name: "Audio/MP3", value: 3010 },
  { name: "Audio/Lossless", value: 3040 },
];

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "pandacd",
  name: "PandaCD",
  description: "PandaCD is a Public Tracker for MUSIC (Creative Commons and artist-permitted content)",
  tags: ["音乐"],

  type: "public",
  urls: ["https://pandacd.io/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: categories,
      cross: { mode: "comma" }, // Jackett: cat = join({{ .Categories }}, ",")
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/api/torznab",
      responseType: "document", // 返回 application/xml 的 torznab feed
      params: { t: "search", limit: 100 }, // t=caps 声明 limits max=100 default=50
    },
    selectors: {
      rows: { selector: "rss > channel > item" },
      id: {
        // guid 形如 https://pandacd.io/release/17230-happinesslove-and-princess/#t51049
        selector: "guid",
        filters: [(query: string) => query.match(/#t(\d+)$/)?.[1] ?? query],
      },
      title: { selector: "title" },
      url: { selector: "guid" },
      link: { selector: "enclosure", attr: "url" },
      time: { selector: "pubDate", filters: [{ name: "parseTime" }] },
      size: { selector: "[name=size]", attr: "value" }, // 精确字节数
      seeders: { selector: "[name=seeders]", attr: "value" },
      leechers: { selector: "[name=leechers]", attr: "value" },
      completed: { selector: "[name=grabs]", attr: "value" },
      category: {
        // 同一 item 里有多个 <torznab:attr name="category">（先具体子类、后父类），取第一个
        selector: "[name=category]",
        attr: "value",
        filters: [(query: string) => categories.find((item) => `${item.value}` === `${query}`)?.name ?? `${query}`],
      },
    },
  },
};
