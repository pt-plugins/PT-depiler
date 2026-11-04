/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/c411.yml
 *
 * C411 (Community 411) —— 法国私有综合站，影视 / 剧集 / 音乐 / 电子书 / 游戏 / 3X 均有。
 *
 * 引擎判定：**自研引擎**（Nuxt 3 SPA + 私有 JSON API `/api/*`），同时对外提供 Torznab 接口
 * `/api/torznab`——Jackett / Prowlarr 都走这条接口，本文件也照此实现搜索。站点结构与本仓库
 * 现有 schema（NexusPHP / Unit3D / Gazelle / AvistazNetwork …）均不匹配，故按仓库惯例
 * （见 myspleen / anthelion）落到 AbstractPrivateSite 上自行实现。
 *
 * ✅ 2026-11-04 匿名实测（无需登录即可访问的端点）：
 *   - `GET /api/torznab?t=caps` → 200 + torznab caps：`<limits max="100" default="25"/>`；
 *     search 仅支持 `q`，tv-search 支持 `q,season,ep,tmdbid,imdbid`，movie-search 支持
 *     `q,imdbid,tmdbid`，且声明了 `freeleech` tag。
 *   - `GET /api/auth/me` → 200 `{"authenticated":false,"user":null}`；其余 `/api/*` 与页面
 *     在未登录时 401 / 重定向到 `/login`（`/api/settings/public` 返回 `siteLocked: true`）。
 *   - 站点在 Cloudflare 之后（`cf-cache-status: DYNAMIC`），但上述 API 没有 CF 挑战页。
 *
 * ⚠️ 未能真机验证的部分（站点 siteLocked，注册需 Turnstile，本次没有测试账号）：
 *   - **搜索**：选择器 / 参数全部照抄 Jackett c411.yml（该定义有实际用户群），字段路径与其一致；
 *     `size`、`seeders`、`leechers` 等是否为纯数字由 torznab 规范约定，这里一律再过一遍 parseNumber。
 *   - **用户信息**：走 `/api/auth/me` 的 `user` 对象。字段名（`username`/`uploaded`/`downloaded`/
 *     `uploadCredit`/`downloadCredit`/`ratio`）取自站点前端 auth store
 *     （站点前端 chunk `B_Bvi1AB.js`：初始化即 GET `/api/auth/me`，WebSocket `stats:update`
 *     里用 `uploaded + uploadCredit` 与 `downloaded - downloadCredit` 重算展示值），
 *     **但没有拿到登录态的响应样本**，等级（roles 是权限 slug，不是站内 Class 名）、做种数、
 *     入站时间等未做编造，留待有账号后再补。
 *   - **API Key**：搜索（Torznab）需要用户自行到 https://c411.org/user/integrations 生成的
 *     API Key（Jackett 也用它做登录校验），未填写时搜索会得到 401；用户信息走浏览器 Cookie，
 *     与 API Key 无关。
 */

import type { AxiosRequestConfig, AxiosResponse } from "axios";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import {
  CFBlockedError,
  EResultParseStatus,
  NeedLoginError,
  type ISearchCategoryOptions,
  type ISiteMetadata,
  type IUserInfo,
} from "../types";

/**
 * torznab `cat` 的取值 → 展示名。
 * id 与名称取自 Jackett `c411.yml` 的 categorymappings（该表注明来自 `torznab?t=caps`），
 * 共 38 条，id 与展示名均唯一。这里用站点自己的法文分类名（caps 里对应 category 的
 * `description`），因为 torznab 侧的 `Movies/Other`、`PC` 之类的名字在同一站点内会重复多次。
 */
const CATEGORIES: ISearchCategoryOptions[] = [
  { name: "Jeux Vidéo & Emulation & VR", value: 1000 },
  { name: "Nintendo", value: 1030 },
  { name: "Microsoft", value: 1040 },
  { name: "Sony", value: 1080 },
  { name: "Jeux Autre & ROM/ISO", value: 1090 },
  { name: "Films & Vidéos", value: 2000 },
  { name: "Films Collection", value: 2010 },
  { name: "Films Foreign", value: 2030 },
  { name: "Vidéo-clips", value: 2050 },
  { name: "Films Animation", value: 2060 },
  { name: "Films Documentaire", value: 2070 },
  { name: "Films Spectacle", value: 2080 },
  { name: "Films Concert", value: 2090 },
  { name: "Audio", value: 3000 },
  { name: "Musique", value: 3010 },
  { name: "Audiobooks", value: 3030 },
  { name: "Karaoké & Podcast Radio & Samples", value: 3050 },
  { name: "Applications & Windows & Nulled", value: 4000 },
  { name: "Linux & MacOS", value: 4030 },
  { name: "Formation", value: 4040 },
  {
    name: "Games-Linux & Games-MacOS & Games-Divers & Autre & Émulateur & GPS & Scripts PHP & CMS & Wordpress",
    value: 4050,
  },
  { name: "Android Mobile & Smartphone & Tablette & Applications & Cartes", value: 4060 },
  { name: "iOS Smartphone & Tablette", value: 4070 },
  { name: "Série TV", value: 5000 },
  { name: "Sport", value: 5060 },
  { name: "Animation Série", value: 5070 },
  { name: "Emission TV", value: 5080 },
  { name: "3X & 3X VR", value: 6000 },
  { name: "3X Films", value: 6010 },
  { name: "3X Ebooks", value: 6050 },
  { name: "3X Images", value: 6060 },
  { name: "Hentai", value: 6070 },
  { name: "3X Jeux", value: 6080 },
  { name: "Ebook", value: 7000 },
  { name: "Presse", value: 7010 },
  { name: "Livres", value: 7020 },
  { name: "BDs & Comics & Manga", value: 7030 },
  { name: "Imprimante 3D & Objets & Pack & Personnages", value: 8010 },
];

const categoryName = (value: string | number): string =>
  CATEGORIES.find((item) => `${item.value}` === `${value}`)?.name ?? `${value}`;

/** `/api/auth/me` 的响应结构，字段名见文件头「用户信息」段落 */
interface IC411AuthMeResponse {
  authenticated?: boolean;
  user?: {
    id?: number | string;
    username?: string;
    uploaded?: number;
    downloaded?: number;
    uploadCredit?: number;
    downloadCredit?: number;
    ratio?: number | null;
  } | null;
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "c411",
  name: "C411",
  aka: ["Community 411"],
  description: "C411 (Community 411) is a FRENCH Private Torrent Tracker for MOVIES / TV / GENERAL",
  tags: ["综合", "影视", "游戏", "音乐", "电子书"],

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://c411.org/"],
  // Jackett 的 legacylinks：站点迁移前的 staging 域名
  legacyUrls: ["https://staging-68d548c5bd4.c411.org/"],

  userInputSettingMeta: [
    {
      name: "apikey",
      label: "API Key",
      hint: "必填。登录 C411 后在 https://c411.org/user/integrations 生成，搜索走站点的 Torznab 接口，未填写会返回 401",
      required: true,
    },
  ],

  category: [
    {
      name: "分类",
      key: "cat",
      options: CATEGORIES,
      cross: { mode: "comma" }, // Jackett: cat = join(Categories, ",")
    },
  ],

  search: {
    keywordPath: "params.q",
    // Jackett requestDelay: 4.1（秒），站点限速 15 req/min；这里换算成毫秒
    requestDelay: 4100,
    requestConfig: {
      url: "/api/torznab",
      responseType: "document", // 返回 torznab feed（XML）
      params: { t: "search", limit: 100 }, // caps: limits max=100
    },
    advanceKeywordParams: {
      // 站点的 imdb/tmdb 检索只挂在 movie-search / tv-search 两个入口（t=search 只支持 q）。
      // 搜索词里没有片种信息，统一走 movie-search；剧集类 imdb 号可能查不到，需改用标题搜索。
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          requestConfig!.params ??= {};
          requestConfig!.params.t = "movie-search";
          requestConfig!.params.imdbid = keywords;
          delete requestConfig!.params.q;
          return requestConfig!;
        },
      },
      tmdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          requestConfig!.params ??= {};
          requestConfig!.params.t = "movie-search";
          requestConfig!.params.tmdbid = keywords;
          delete requestConfig!.params.q;
          return requestConfig!;
        },
      },
    },
    selectors: {
      rows: { selector: "rss > channel > item" },
      // Jackett: infohash / imdbid / tmdbid 都取自 <torznab:attr name="...">
      id: { selector: "[name=infohash]", attr: "value" },
      title: { selector: "title" },
      // Jackett 的 details = <link>（详情页），download = <enclosure url>
      url: { selector: "link" },
      link: { selector: "enclosure", attr: "url" },
      // pubDate 形如 "Sun, 18 Jan 2026 04:05:41 +0000"（RFC 2822），parseTime 最终由原生 Date 解析
      time: { selector: "pubDate", filters: [{ name: "parseTime" }] },
      size: { selector: "size", filters: [{ name: "parseNumber" }] },
      seeders: { selector: "[name=seeders]", attr: "value", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "[name=peers]", attr: "value", filters: [{ name: "parseNumber" }] },
      completed: { selector: "[name=grabs]", attr: "value", filters: [{ name: "parseNumber" }] },
      category: {
        // feed 里子类在前、父类在后，取第一个即可（与 pandacd 的处理一致）
        selector: "[name=category]",
        attr: "value",
        filters: [categoryName],
      },
      downloadVolumeFactor: {
        selector: "[name=downloadvolumefactor]",
        attr: "value",
        filters: [{ name: "parseNumber" }],
      },
      uploadVolumeFactor: {
        selector: "[name=uploadvolumefactor]",
        attr: "value",
        filters: [{ name: "parseNumber" }],
      },
      ext_imdb: { selector: "[name=imdbid]", attr: "value" },
      ext_tmdb: { selector: "[name=tmdbid]", attr: "value" },
    },
  },

  // 覆写 getUserInfoResult 自行解析（原因见下方注释），metadata.userInfo 只需存在，
  // 让 AbstractPrivateSite.allowQueryUserInfo 为 true 即可。
  userInfo: {},
};

export default class C411 extends PrivateSite {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // Torznab 用 apikey 鉴权（与 Jackett 的 login/search 一致），apikey 由用户在站点生成后填入本插件设置。
    // 其余请求（如 /api/auth/me）走浏览器 Cookie，不注入 apikey。
    if (`${axiosConfig.url ?? ""}`.includes("/api/torznab")) {
      const apikey = this.userConfig.inputSetting?.apikey?.trim();
      if (apikey) {
        axiosConfig.params = { ...(axiosConfig.params ?? {}), apikey };
      }
    }

    return super.request<T>(axiosConfig, checkLogin);
  }

  /**
   * 用户信息取自 `/api/auth/me`。
   *
   * 该端点是站点唯一在未登录时也返回 200 的账号相关接口（其余 `/api/*` 一律 401），
   * 未登录时响应为 `{ authenticated: false, user: null }`——状态码正常，base class 的
   * `loggedCheck` 无法据此判定「需要登录」，因此这里自行判断并抛出 NeedLoginError。
   */
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    const flushUserInfo: IUserInfo = {
      status: EResultParseStatus.unknownError,
      updateAt: +new Date(),
      site: this.metadata.id,
      id: lastUserInfo.id,
      name: lastUserInfo.name,
    };

    try {
      const { data } = await this.request<IC411AuthMeResponse>({
        url: "/api/auth/me",
        responseType: "json",
      });

      if (!data?.authenticated || !data.user) {
        throw new NeedLoginError();
      }

      const user = data.user;
      if (typeof user.id === "number" || typeof user.id === "string") {
        flushUserInfo.id = user.id;
      }
      if (typeof user.username === "string" && user.username.trim()) {
        flushUserInfo.name = user.username.trim();
      }

      // 站点的展示口径会把 uploadCredit / downloadCredit 折算进去（见前端 auth store 的 updateStats），
      // 但 /api/auth/me 里的 uploaded / downloaded 是否已经折算无法匿名确认，这里原样使用，
      // ratio 优先取站点自己算好的值，缺省时按原始上传/下载量估算。
      const uploaded = typeof user.uploaded === "number" ? user.uploaded : undefined;
      const downloaded = typeof user.downloaded === "number" ? user.downloaded : undefined;
      if (uploaded !== undefined) flushUserInfo.uploaded = uploaded;
      if (downloaded !== undefined) flushUserInfo.downloaded = downloaded;

      if (typeof user.ratio === "number" && Number.isFinite(user.ratio)) {
        flushUserInfo.ratio = user.ratio;
      } else if (uploaded !== undefined && downloaded !== undefined) {
        flushUserInfo.ratio = downloaded > 0 ? uploaded / downloaded : uploaded > 0 ? Number.POSITIVE_INFINITY : 0;
      }

      // 等级 / 做种数 / 入站时间：/api/auth/me 的 user 上只有 roles 等权限 slug，
      // 没有站内 Class 名称（前端 class 信息来自 /api/classes/progression），本次无账号实测，暂不编造。

      flushUserInfo.status = EResultParseStatus.success;
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);

      flushUserInfo.status = EResultParseStatus.parseError;

      if (error instanceof CFBlockedError) {
        flushUserInfo.status = EResultParseStatus.CFBlocked;
      } else if (error instanceof NeedLoginError) {
        flushUserInfo.status = EResultParseStatus.needLogin;
      }
    }

    return flushUserInfo;
  }
}
