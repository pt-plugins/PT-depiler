/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/magnetz.yml
 *
 * Magnetz —— BT 元搜索引擎（聚合影视 / 音乐 / 游戏 / 软件 / 电子书等）。
 *
 * 2026-11-08 Jackett [d3ff5237](https://github.com/Jackett/Jackett/commit/d3ff52379e)（resolves [#16277](https://github.com/Jackett/Jackett/issues/16277)）
 * 把该站整份重写为 **Torznab API**：HTML 抓取退役。实测印证：`/`、`/search?query=…` 均返回
 * 「Log in to Magnetz」登录表单（无任何 result-card），`/api/torznab?t=search` 无 key → 401 XML
 * `<error code="100" description="A valid API key is required...">`；key 可走 `?apikey=` 或
 * `Authorization: Bearer`（本站按 Jackett 口径走 query）。feed 为 application/xml，
 * `responseType: "document"` 下即 Document，选择器照 RSS/torznab 结构写（同 c411 / pandacd）。
 *
 * 2026-11-10 起走 `schemas/Torznab.ts` 引擎（schema: "Torznab"）：默认的 requestConfig /
 * 选择器骨架、apikey 未填写拦截与注入、401/403 XML error → NoUserInputError 翻译都在引擎层
 * 完成，本文件只保留与默认不同的部分（id/url/link/size 覆写、分类表、infoHash、详情页）。
 *
 * type 维持 "public" 口径（站点内容不区分用户组、半公开语义归 public——见仓库约定），
 * 但访问 API 需要会员 Key：注册仍开放（/login 页有 signup/register），
 * Key 在 https://magnetz.eu/account/apps#api-key 生成，每次搜索消耗一次每日配额。
 */
import { type ISearchCategoryOptions, type ISiteMetadata } from "../types";
import { SchemaMetadata, torznabCategoryName } from "../schemas/Torznab.ts";

// 取自 https://magnetz.eu/api/torznab?t=caps （经 apikey，与 Jackett d3ff5237 的 categorymappings 一致）
const categories: ISearchCategoryOptions[] = [
  { name: "Movies", value: 2000 },
  { name: "Movies/SD", value: 2030 },
  { name: "Movies/HD", value: 2040 },
  { name: "Movies/UHD", value: 2045 },
  { name: "TV", value: 5000 },
  { name: "TV/SD", value: 5030 },
  { name: "TV/HD", value: 5040 },
  { name: "TV/UHD", value: 5045 },
  { name: "TV/Sport", value: 5060 },
  { name: "TV/Anime", value: 5070 },
  { name: "Audio", value: 3000 },
  { name: "Audio/Audiobook", value: 3030 },
  { name: "Audio/Lossless", value: 3040 },
  { name: "PC", value: 4000 },
  { name: "PC/Games", value: 4050 },
  { name: "Books", value: 7000 },
  { name: "Books/EBook", value: 7020 },
  { name: "XXX", value: 6000 },
  { name: "Other", value: 8000 },
];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "magnetz",
  name: "Magnetz",
  description: "Magnetz 是一个公开的 BT 元搜索引擎，聚合影视、音乐、游戏、软件、电子书等资源（API 搜索需会员 Key）",

  type: "public",
  schema: "Torznab",
  urls: ["https://magnetz.eu/"],

  userInputSettingMeta: [
    {
      name: "apikey",
      label: "API Key",
      hint: "必填。注册后在 https://magnetz.eu/account/apps#api-key 生成（mgz_ 前缀）；每次搜索消耗一次每日配额",
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
    selectors: {
      ...SchemaMetadata.search.selectors,
      // guid 即详情页 URL（形如 https://magnetz.eu/Zfuh），取末段 sqid 作 id
      id: {
        selector: "guid",
        filters: [(query: string) => query.split("/").filter(Boolean).pop() ?? ""],
      },
      url: { selector: "comments" }, // details = comments（详情页 URL）
      link: { selector: "[name=magneturl]", attr: "value" },
      // Jackett 口径：size attr 是带单位的字符串，走 parseSize（站点不提供纯字节）
      size: { selector: "[name=size]", attr: "value", filters: [{ name: "parseSize" }] },
      // infohash 直接落到 torrent.infoHash（原先走 ext_infohash，2026-11-11 起 ITorrent 已有该可选字段）
      infoHash: { selector: "[name=infohash]", attr: "value" },
      category: {
        // 同一 item 里可能有多个 <torznab:attr name="category">（先子类后父类），取第一个
        selector: "[name=category]",
        attr: "value",
        filters: [torznabCategoryName(categories)],
      },
      // 列表 feed 的 downloadvolumefactor/uploadvolumefactor 由引擎默认选择器解析：
      // feed 携带 attr 时取真实值，未携带时落回基类缺省（Jackett 对本站写死 0/1，未经 key 实测）
      // author 无来源，留空
    },
  },

  // content-script 浏览详情页时的解析（搜索结果自带 magneturl，正常下载不会走 detail.link 补全路径）。
  // 详情页 /<sqid> 与 /browse、/login 等静态路由同形，只能靠负向先行断言排除已知路由。
  detail: {
    urlPattern: [
      "^https?://magnetz\\.eu/(?!browse$|lists$|login$|register$|search$|about$|apis$|rss$|wiki$|terms$|privacy$|contact$|how$|download-anonymously$|mcp-server$|account$)[A-Za-z0-9]+$",
    ],
    selectors: {
      title: { selector: "h1.detail__title" },
      link: { selector: "a#link-button", attr: "href" },
    },
  },
};
