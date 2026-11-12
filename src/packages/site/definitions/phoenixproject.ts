/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/phoenixproject.yml
 *
 * Phoenix Project —— 私有站，主打 macOS / iOS 软件与游戏（Jackett 描述：Private MacOS software tracker）。
 *
 * 引擎判定为 **Gazelle**，三处独立证据一致：
 *   1) Jackett yml 尾注 `# Gazelle`，搜索页 `torrents.php`、行 `table.torrent_table tr.torrent`、
 *      分类参数 `filter_cat[N]=1` 均为 Gazelle 口径；
 *   2) 2026-11-11 实测 https://phoenixproject.app/ 返回 200，页面标题「This is a mirage :: Phoenix Project」——
 *      这是未登录时的门面页，HTML 引用了 `static/functions/script_start.js`、`static/functions/ajax.class.js`、
 *      `static/functions/global.js`，正是 Gazelle 的招牌静态文件；
 *   3) tracker-tracker 的 registry 也把该站 platform 记为 gazelle（非 defunct、非 draft）。
 *
 * ⚠️ 无账号：登录后的列表结构未能实测，搜索选择器与参数取自 Jackett 定义（该 yml 有实际用户群）。
 */
import { type ISearchCategoryOptions, type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Gazelle.ts";

// 取自 Jackett phoenixproject.yml 的 categorymappings
const categories: ISearchCategoryOptions[] = [
  { name: "Applications", value: 1 },
  { name: "Games", value: 2 },
  { name: "iOS Applications", value: 3 },
  { name: "iOS Games", value: 4 },
  { name: "Graphics", value: 5 },
  { name: "Audio", value: 6 },
  { name: "Tutorials", value: 7 },
  { name: "Other", value: 8 },
];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "phoenixproject",
  name: "Phoenix Project",
  description: "Phoenix Project is a Private MacOS software tracker",
  tags: ["软件", "游戏"],

  type: "private",
  schema: "Gazelle",

  urls: ["https://phoenixproject.app/"],

  category: [
    {
      name: "分类",
      key: "filter_cat",
      options: categories,
      // Gazelle 口径：多选时生成 filter_cat[N]=1（Jackett: filter_cat[{{.}}]=1）
      cross: { mode: "appendQuote" },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    requestConfig: {
      ...SchemaMetadata.search.requestConfig,
      params: {
        searchsubmit: 1,
        // Jackett 的固定参数：按「高级搜索 + 不合并种子组」查询
        action: "advanced",
        group_results: 0,
      },
    },
    selectors: {
      ...SchemaMetadata.search.selectors,
      // Jackett 的行选择器更严格：只保留带 Download 按钮的种子行
      rows: { selector: 'table.torrent_table tr.torrent:has(a[title="Download"])' },
    },
  },
};
