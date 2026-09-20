/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/danishbytes.json
 * @note Prowlarr 历史 C# 定义记录过 danishbytes2.org 域名（见 Prowlarr commit 09bd813）
 */
import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "danishbytes",
  name: "DanishBytes",
  aka: ["DBy"],
  description: "DanishBytes（DBy）是一个丹麦私有站点，提供电影/剧集/音乐/软件/书籍/播客资源。",
  tags: ["影视", "音乐", "综合"],

  type: "private",
  schema: "Unit3D",

  // 注意：danishbits.me（DanishBits）是另一个独立站点，不是本站的域名
  urls: ["https://danishbytes.club/"],
  legacyUrls: ["https://danishbytes2.org/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movies", value: 1 },
        { name: "TV Show", value: 2 },
        { name: "Music", value: 3 },
        { name: "Apps", value: 5 },
        { name: "Books", value: 8 },
        { name: "AudioBooks", value: 17 },
        { name: "Podcasts", value: 19 },
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
        // 站点列表使用 data-table / torrents_results 样式（参考 PDS danishbytes.json）
        ...SchemaMetadata.search!.selectors!.rows,
        selector: ["table.table tbody#torrents_results tr", "table.data-table tbody tr", "table.table tbody tr"],
      },
    },
  },
};
