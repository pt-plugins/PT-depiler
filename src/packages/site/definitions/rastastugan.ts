/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/rastastugan.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "rastastugan",
  name: "Rastastugan",
  tags: ["影视", "音乐", "综合"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://enfgnfghtna.bet/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movies", value: 1 },
        { name: "TV", value: 2 },
        { name: "Music", value: 3 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "其它",
      key: "categoryIds_other",
      options: [
        { name: "App", value: 4 },
        { name: "Game", value: 5 },
        { name: "XXX", value: 6 },
        { name: "Audiobook", value: 7 },
        { name: "Book", value: 8 },
        { name: "Podcast", value: 9 },
        { name: "Sport", value: 10 },
        { name: "3D Printable", value: 11 },
      ],
      cross: { mode: "brackets", key: "categoryIds" },
    },
    CategoryFree,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      rows: {
        // 站点新版 Unit3D 列表使用 data-table 样式（参考 PDS rastastugan.json）
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr",
      },
    },
  },
};
