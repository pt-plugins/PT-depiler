/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/skipthecommercials.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "skipthecommercials",
  name: "SkipTheCommercials",
  aka: ["STC"],
  description: "SkipTheCommercials（STC）是一个专注于去除广告的影视资源私有站点（主要收录 TV 节目）。",
  tags: ["影视"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://skipthecommercials.xyz/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movies", value: 1 },
        { name: "TV Show", value: 2 },
      ],
      cross: { mode: "brackets" },
    },
    CategoryFree,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      rows: {
        // 站点新版 Unit3D 列表使用 data-table 样式（参考 PDS skipthecommercials.json）
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr[data-torrent-id]",
      },
    },
  },
};
