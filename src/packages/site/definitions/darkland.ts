/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/darkland.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "darkland",
  name: "Darkland",
  tags: ["影视", "综合"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://darkland.top/"],

  category: [
    {
      name: "电影",
      key: "categoryIds_movie",
      options: [
        { name: "戈尔 Gore", value: 1 },
        { name: "动作 Action", value: 2 },
        { name: "惊悚 Thriller", value: 4 },
        { name: "文艺 Literary", value: 7 },
        { name: "悬疑 Suspense", value: 8 },
        { name: "犯罪 Crime", value: 13 },
        { name: "剧情 Drama", value: 16 },
        { name: "恐怖 Horror", value: 18 },
        { name: "情色 Erotic", value: 21 },
        { name: "科幻 Sci-Fi", value: 24 },
      ],
      cross: { mode: "brackets", key: "categoryIds" },
    },
    {
      name: "剧集",
      key: "categoryIds_tv",
      options: [{ name: "剧集 TV", value: 30 }],
      cross: { mode: "brackets", key: "categoryIds" },
    },
    {
      name: "动画",
      key: "categoryIds_anime",
      options: [{ name: "动画 Animation", value: 12 }],
      cross: { mode: "brackets", key: "categoryIds" },
    },
    {
      name: "其它",
      key: "categoryIds_other",
      options: [
        { name: "纪录 Documentary", value: 15 },
        { name: "短片 Short", value: 20 },
        { name: "其它 Other", value: 29 },
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
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr[data-torrent-id]",
      },
    },
  },
};
