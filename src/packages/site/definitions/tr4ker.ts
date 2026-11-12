/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/tr4ker.yml
 *
 * TR4KER —— 法国半私有综合站（MOVIES / TV / GENERAL / PC / XXX / BOOKS）。
 *
 * 站点对外提供 **torznab XML** 接口（Jackett 尾注 `# torznab xml`），搜索路径为
 * `/api/torznab/all`（注意与常见的 `/api/torznab` 不同，多了 `/all` 段），参数
 * `apikey` + `t=search` + `q` + `cat`（逗号连接）+ `limit=100`，返回
 * `<rss><channel><item>` 结构，字段走 `<torznab:attr name="...">`。
 * 因该站没有 HTML 列表可抓，本定义直接落到 `schemas/Torznab.ts`（通用 API 协议基类）上。
 *
 * type 按仓库口径取 `public`：Jackett 标 semi-private，只表示「有账号体系但内容半公开」，
 * 与我们 `private`（需要 tracker 记录/审计公告数据）不是同一维度；apikey 的必填约束由
 * `userInputSettingMeta` + TorznabSite 的拦截逻辑承载。
 *
 * 2026-11-11 实测：https://tr4ker.net/ 返回 200（标题 TR4KER，页面为 JS 壳，约 790 字节），站点在线；
 * ⚠️ 无账号与 API Key，选择器与参数取自 Jackett 定义，**未经真机搜索验证**。
 */
import { type ISearchCategoryOptions, type ISiteMetadata } from "../types";
import { SchemaMetadata, torznabCategoryName } from "../schemas/Torznab.ts";

// 取自 Jackett tr4ker.yml 的 categorymappings（该表注明来自 https://tr4ker.net/api/torznab?t=caps）
const categories: ISearchCategoryOptions[] = [
  { name: "PC Games", value: 1000 },
  { name: "Xbox", value: 1010 },
  { name: "Nintendo", value: 1020 },
  { name: "PlayStation", value: 1030 },
  { name: "Movies", value: 2000 },
  { name: "Films Foreign", value: 2010 },
  { name: "Movies/HD", value: 2040 },
  { name: "Audio", value: 3000 },
  { name: "Audio/MP3", value: 3010 },
  { name: "Audiobook", value: 3030 },
  { name: "Audio/Lossless", value: 3040 },
  { name: "PC", value: 4000 },
  { name: "PC/Mac", value: 4030 },
  { name: "PC/Android", value: 4070 },
  { name: "TV", value: 5000 },
  { name: "TV/HD", value: 5040 },
  { name: "TV/Sport", value: 5060 },
  { name: "TV/Anime", value: 5070 },
  { name: "XXX", value: 6000 },
  { name: "Books", value: 7000 },
  { name: "Books/Mags", value: 7010 },
  { name: "Books/eBook", value: 7020 },
  { name: "Books/Comics", value: 7030 },
  { name: "Other", value: 8000 },
  { name: "Other/Misc", value: 8010 },
];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "tr4ker",
  name: "TR4KER",
  description: "TR4KER is a FRENCH Semi-Private Torrent Tracker for MOVIES / TV / GENERAL",
  tags: ["影视", "综合"],

  type: "public",
  schema: "Torznab",

  urls: ["https://tr4ker.net/"],

  // Jackett requestDelay: 1（秒），换算成毫秒
  requestDelay: 1000,

  userInputSettingMeta: [
    {
      name: "apikey",
      label: "API Key",
      hint: "必填。登录 TR4KER 后在「Paramètres」页面向下找到「Clé API」生成；无效 key 会返回 401 Unauthorized",
      required: true,
    },
  ],

  category: [
    {
      name: "分类",
      key: "cat",
      options: categories,
      cross: { mode: "comma" }, // Jackett: cat = join(Categories, ",")
    },
  ],

  search: {
    ...SchemaMetadata.search,
    requestConfig: {
      ...SchemaMetadata.search.requestConfig,
      // 该站的 torznab 入口是 /api/torznab/all，与默认的 /api/torznab 不同
      url: "/api/torznab/all",
    },
    selectors: {
      ...SchemaMetadata.search.selectors,
      // Jackett: details = comments，download = enclosure[url]，date = pubDate
      url: { selector: "comments" },
      // Jackett 把 leechers 映射到 `[name=peers]`（不是 name=leechers），需覆写引擎默认
      leechers: { selector: "[name=peers]", attr: "value" },
      category: {
        selector: "[name=category]",
        attr: "value",
        filters: [torznabCategoryName(categories)],
      },
      ext_imdb: { selector: "[name=imdbid]", attr: "value" },
      ext_tmdb: { selector: "[name=tmdbid]", attr: "value" },
      ext_tvdb: { selector: "[name=tvdbid]", attr: "value" },
    },
  },
};
