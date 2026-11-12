/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/pandacd.yml
 *
 * 2026-11-10 起走 `schemas/Torznab.ts` 引擎（schema: "Torznab"）：requestConfig / rows / title /
 * link / pubDate / seeders 等选择器骨架全部来自引擎默认值，本文件只保留与默认不同的部分。
 * 该站无需 apikey（不声明 userInputSettingMeta 即可，引擎不会注入也不会拦截）。
 */
import { type ISearchCategoryOptions, type ISiteMetadata } from "../types";
import { SchemaMetadata, torznabCategoryName } from "../schemas/Torznab.ts";

// https://pandacd.io/api/torznab?t=caps （实测该接口无需 apikey）
const categories: ISearchCategoryOptions[] = [
  { name: "Audio", value: 3000 },
  { name: "Audio/MP3", value: 3010 },
  { name: "Audio/Lossless", value: 3040 },
];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "pandacd",
  name: "PandaCD",
  description: "PandaCD is a Public Tracker for MUSIC (Creative Commons and artist-permitted content)",
  tags: ["音乐"],

  type: "public",
  schema: "Torznab",
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
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search.selectors,
      // guid 形如 https://pandacd.io/release/17230-happinesslove-and-princess/#t51049
      id: {
        selector: "guid",
        filters: [(query: string) => query.match(/#t(\d+)$/)?.[1] ?? query],
      },
      url: { selector: "guid" },
      // size 不再覆写：站点给的是纯字节数，引擎默认的 parseTorznabSize 已同时兼容纯字节与带单位字符串。
      category: {
        // 同一 item 里有多个 <torznab:attr name="category">（先具体子类、后父类），取第一个
        selector: "[name=category]",
        attr: "value",
        filters: [torznabCategoryName(categories)],
      },
    },
  },
};
