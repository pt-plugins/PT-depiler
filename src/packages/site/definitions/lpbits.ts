/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/lp-bits.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/lpbits.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "lpbits",
  name: "LP-Bits",
  aka: ["LP-Bits 2.0"],
  description: "LP-Bits 是专注于 Linkin Park 音乐发布的私有站点。",
  tags: ["音乐"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://lp-bits.com/"],

  // 注：以 Jackett lp-bits.yml 的分类为准；PDS 写 401/403/402（Movies/Music Videos/DOC）与本站实际（Linkin Park 音乐站）不符
  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { name: "Video Audience Shot", value: 409 },
        { name: "Documentaries \\ Misc", value: 404 },
        { name: "Music Videos", value: 406 },
        { name: "Audio Professional", value: 407 },
        { name: "Pro Shot Video", value: 408 },
        { name: "Audio Audience Shot", value: 410 },
      ],
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
      rows: { selector: "table.torrents > tbody > tr:has(a[href^='download.php?id='])" },
    },
  },
};
