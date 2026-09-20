/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/polishtorrent.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "polishtorrent",
  name: "PolishTorrent",
  aka: ["PTT"],
  description: "PolishTorrent（PTT）是一个波兰私有站点，提供电影/剧集资源。",
  tags: ["影视", "综合"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://polishtorrent.top/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movies", value: 1 },
        { name: "TV", value: 2 },
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
        // 站点新版 Unit3D 列表使用 data-table 样式（参考 PDS polishtorrent.json）
        // 保留 SchemaMetadata 默认的 filter（只保留含 /torrents/{id} 链接的行）
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr",
      },
    },
  },
};
