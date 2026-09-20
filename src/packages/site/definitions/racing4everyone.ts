/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/racing4everyone.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "racing4everyone",
  name: "Racing4Everyone",
  aka: ["R4E"],
  description: "Racing4Everyone（R4E）是一个专注于赛车运动的私有站点，提供赛事/影视资源。",
  tags: ["体育", "影视"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://racing4everyone.eu/"],

  // 注：PDS 提供的完整分类疑为通用模板（同款模板在 datascene 上已被 Jackett 证伪），仅保留 movie/tv
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
        // 站点新版 Unit3D 列表使用 data-table 样式（参考 PDS racing4everyone.json）
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr",
      },
    },
  },
};
