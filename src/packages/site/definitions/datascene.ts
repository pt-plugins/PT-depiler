/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/datascene-api.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/datascene.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "datascene",
  name: "DataScene",
  aka: ["DS"],
  description:
    "DataScene（DS）是一个罗马尼亚私有站点，提供电影/剧集/综合资源。支持 Unit3D 官方 JSON API（api/torrents/filter）。",
  tags: ["影视", "综合"],
  timezoneOffset: "+0200", // EET，参考 Jackett datascene-api.yml 对 created_at 追加的 +02:00

  type: "private",
  schema: "Unit3D",

  urls: ["https://datascene.xyz/"],
  legacyUrls: ["https://datascene.net/"],

  category: [
    {
      name: "电影",
      key: "categoryIds_movie",
      options: [
        { name: "Movie HD", value: 1 },
        { name: "Movie HD Ro", value: 23 },
        { name: "Movie 4K", value: 11 },
        { name: "Movie 4K Ro", value: 12 },
        { name: "Movie Bluray", value: 14 },
        { name: "Movie Bluray Ro", value: 15 },
        { name: "Movie DVD", value: 27 },
        { name: "Movie DVD Ro", value: 28 },
        { name: "Movie SD", value: 19 },
        { name: "Movie SD Ro", value: 20 },
      ],
      cross: { mode: "brackets", key: "categoryIds" },
    },
    {
      name: "剧集",
      key: "categoryIds_tv",
      options: [
        { name: "TV HD", value: 2 },
        { name: "TV HD Ro", value: 18 },
        { name: "TV SD", value: 26 },
        { name: "TV SD Ro", value: 10 },
        { name: "TV DVD", value: 31 },
        { name: "TV DVD Ro", value: 32 },
        { name: "TV 4K", value: 29 },
        { name: "TV 4K Ro", value: 30 },
        { name: "TV Pack", value: 22 },
        { name: "TV Pack Ro", value: 33 },
      ],
      cross: { mode: "brackets", key: "categoryIds" },
    },
    {
      name: "其它",
      key: "categoryIds_other",
      options: [
        { name: "Game", value: 4 },
        { name: "Music", value: 3 },
        { name: "Music Video", value: 21 },
        { name: "Mobile", value: 7 },
        { name: "Linux", value: 24 },
        { name: "E-Book", value: 8 },
        { name: "Sport", value: 25 },
        { name: "Application", value: 5 },
        { name: "Anime", value: 13 },
        { name: "XXX", value: 6 },
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
        // 站点新版 Unit3D 列表使用 data-table 样式（参考 PDS datascene.json）
        // 保留 SchemaMetadata 默认的 filter（只保留含 /torrents/{id} 链接的行）
        ...SchemaMetadata.search!.selectors!.rows,
        selector: "table.data-table > tbody > tr",
      },
    },
  },
};
