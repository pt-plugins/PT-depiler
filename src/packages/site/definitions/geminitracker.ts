/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/gemini_tracker.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "geminitracker",
  name: "GeminiTracker",
  aka: ["G3MINI"],
  tags: ["影视", "综合"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://gemini-tracker.org/"],

  // 注：PDS 只提供 movie/tv 两个分类，未提供更多分类信息
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
        // 站点新版 Unit3D 列表使用 data-table 样式（参考 PDS gemini_tracker.json）
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr",
      },
    },
  },
};
