/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/hqmusic.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/hqmusic.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "hqmusic",
  name: "HQMusic",
  description: "HQMusic 是一个越南音乐私有站点。",
  tags: ["音乐"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://tracker.hqmusic.info/"],

  // 注：Jackett hqmusic.yml 分类为 id=1（Audio/Music），PDS 写 401（疑为套用标准模板），以 Jackett 为准
  category: [
    {
      name: "类别",
      key: "cat",
      options: [{ name: "Music", value: 1 }],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      // 站点列表为嵌套结构：table.main > td.embedded 内含 table.torrents（参考 Jackett hqmusic.yml）
      rows: {
        selector:
          "table.main > tbody > tr > td.embedded > table.torrents > tbody > tr:has(a[href^='download.php?id='])",
      },
    },
  },
};
