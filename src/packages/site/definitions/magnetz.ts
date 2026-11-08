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
 * type 维持 "public" 口径（站点内容不区分用户组、半公开语义归 public——见仓库约定），
 * 但访问 API 需要会员 Key：注册仍开放（/login 页有 signup/register），
 * Key 在 https://magnetz.eu/account/apps#api-key 生成，每次搜索消耗一次每日配额。
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { NoUserInputError, type ISearchCategoryOptions, type ISiteMetadata } from "../types";

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
  version: 1,
  id: "magnetz",
  name: "Magnetz",
  description: "Magnetz 是一个公开的 BT 元搜索引擎，聚合影视、音乐、游戏、软件、电子书等资源（API 搜索需会员 Key）",

  type: "public",
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
    keywordPath: "params.q",
    requestConfig: {
      url: "/api/torznab",
      responseType: "document", // torznab feed（application/xml）
      params: { t: "search", limit: 100 }, // caps: limits max=100
    },
    selectors: {
      rows: { selector: "rss > channel > item" },
      // guid 即详情页 URL（形如 https://magnetz.eu/Zfuh），取末段 sqid 作 id
      id: {
        selector: "guid",
        filters: [(query: string) => query.split("/").filter(Boolean).pop() ?? ""],
      },
      title: { selector: "title" },
      url: { selector: "comments" }, // details = comments（详情页 URL）
      link: { selector: "[name=magneturl]", attr: "value" },
      // "Sat, 08 Nov 2025 03:49:12 +0000"（RFC 822，带偏移），parseTime 可直接解析
      time: { selector: "pubDate", filters: [{ name: "parseTime" }] },
      size: { selector: "[name=size]", attr: "value", filters: [{ name: "parseSize" }] },
      seeders: { selector: "[name=seeders]", attr: "value", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "[name=leechers]", attr: "value", filters: [{ name: "parseNumber" }] },
      completed: { selector: "[name=grabs]", attr: "value", filters: [{ name: "parseNumber" }] },
      // ITorrent 无 infoHash 字段，外部资源 id 走 ext_ 命名空间（imdbid/tvdbid/tmdbid 同理，可按需再补）
      ext_infohash: { selector: "[name=infohash]", attr: "value" },
      category: {
        // 同一 item 里可能有多个 <torznab:attr name="category">（先子类后父类），取第一个
        selector: "[name=category]",
        attr: "value",
        filters: [(query: string) => categories.find((item) => `${item.value}` === `${query}`)?.name ?? `${query}`],
      },
      // 列表 feed 全站固定 downloadvolumefactor 0 / uploadvolumefactor 1（Jackett 同款写死值），
      // 由定义层写不进 ITorrent，交由基类缺省处理；author 无来源，留空
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

export default class SiteMagnetz extends BittorrentSite {
  /**
   * Torznab 要求 apikey（query 参数，与 Jackett 一致）；未填时不发请求，
   * 直接抛 NoUserInputError——public 站的 loggedCheck 恒真，基类不会替我们拦 401。
   * （同 beyondhd / infinityhd / huno 的 key 拦截写法。）
   */
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    const apikey = this.userConfig.inputSetting?.apikey?.trim();
    if (!apikey) {
      throw new NoUserInputError("API Key"); // 未填写 API Key 时直接拦截，避免请求被误判为解析错误
    }
    axiosConfig.params = { ...(axiosConfig.params ?? {}), apikey };
    return super.request<T>(axiosConfig, checkLogin);
  }
}
