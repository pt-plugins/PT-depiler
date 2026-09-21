/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/hhd-api.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/homiehelpdesk.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "homiehelpdesk",
  name: "HomieHelpdesk",
  aka: ["HHD"],
  description:
    "HomieHelpdesk（HHD）是一个私有站点，提供电影/剧集/动漫/音乐/游戏/软件/书籍资源。支持 Unit3D 官方 JSON API（api/torrents/filter）。",
  tags: ["影视", "综合"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://ubzvrurycqrfx.arg/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movies", value: 1 },
        { name: "TV", value: 2 },
        { name: "Anime", value: 3 },
        { name: "Music", value: 4 },
        { name: "Games", value: 5 },
        { name: "Apps", value: 6 },
        { name: "Books", value: 7 },
        { name: "Audiobook", value: 8 },
        { name: "Manga", value: 9 },
        { name: "XXX", value: 10 },
        { name: "Comics", value: 11 },
        { name: "Magazine", value: 12 },
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
        // 站点新版 Unit3D 列表使用 data-table 样式（参考 PDS homiehelpdesk.json）
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr",
      },
    },
  },
};
