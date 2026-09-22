/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/hd_united.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hdunited",
  name: "HD-UNiT3D",
  tags: ["影视", "综合"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://hd-united.vn/"],

  // 注：PDS 提供的完整分类（music/game/app/xxx/book/edu/fanres）疑为通用模板，
  // 与 datascene 同款模板已被 Jackett 证伪，故仅保留有把握的 movie/tv
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
        // 站点新版 Unit3D 列表使用 data-table 样式（参考 PDS hd_united.json）
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr",
      },
    },
  },
};
