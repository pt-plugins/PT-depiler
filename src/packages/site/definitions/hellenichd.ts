/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/hellenic-hd-api.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/hellenic_hd.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hellenichd",
  name: "HELLENIC-HD",
  description:
    "HELLENIC-HD 是一个希腊私有站点，提供电影/剧集/音乐/游戏/软件/书籍/体育资源。支持 Unit3D 官方 JSON API（api/torrents/filter）。",
  tags: ["影视", "综合"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://hellenic-hd.cc/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movies", value: 1 },
        { name: "Series", value: 2 },
        { name: "Music", value: 10 },
        { name: "Games", value: 11 },
        { name: "Apps", value: 12 },
        { name: "Books", value: 13 },
        { name: "Sports", value: 14 },
        { name: "Movies (No Greek Subs)", value: 20 },
        { name: "Series (No Greek Subs)", value: 21 },
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
        // 站点新版 Unit3D 列表使用 data-table 样式（参考 PDS hellenic_hd.json）
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr[data-torrent-id]",
      },
    },
  },
};
