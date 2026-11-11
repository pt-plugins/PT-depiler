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
 *   - **搜索**：选择器 / 参数照抄 Jackett c411.yml（该定义有实际用户群），字段路径与其一致；
 *     `size`、`seeders`、`leechers` 等是否为纯数字由 torznab 规范约定，这里一律再过一遍 parseNumber。
 *
 * ✅ 2026-11-05 按 #1666 的反馈修正（keyword 搜索已被用户实测可用）：
 *   - **IMDb / TMDB 检索报 Parse Error**：Newznab 的 `t` 只接受 `search` / `tvsearch` / `movie` /
 *     `music` / `book`，caps 里的 `movie-search` 只是能力名。此前误传 `t=movie-search`，站点返回的
 *     不是 feed，解析抛错；现按 Jackett（`t: {{ .Query.Type }}`）改为 `t=movie`。
 *   - **用户信息（「我的数据」里没有该站点）**：原实现有两个问题——一是 `userInfo: {}` 会被
 *     `checkSiteMetadataAllow` 当成「未配置」（utils/helper.ts:17-22），`hasUserInfo` /
 *     `allowQueryUserInfo` 均为 false，站点根本不会进入「我的数据」；二是 `/api/auth/me` 依赖
 *     浏览器 Cookie，插件的 XHR 默认不带 Cookie。
 *     现改为 `GET /api/user/profile` + `Authorization: Bearer <API Key>`（口径参考
 *     jordanlambrecht/tracker-tracker 的 c411 适配器及其 2026-10-20 的真机响应样本）：
 *     上传 / 下载取 `transfer.{uploaded,downloaded}.total`（已含 credit，与站点分享率口径一致），
 *     真实量取同级的 `.actual`，魔力值取 `zen.balance`，入站时间取 `memberSince`，
 *     等级取 `class.progress.grade`（bronze / argent / or 各 4 级，`or` 的第 4 级即 Gold 411，
 *     与站点 wiki 一致）。分享率不在此处计算，统一交给 utils/level.ts 的 `fixRatio` 托底。
 *   - **API Key**：搜索与用户信息都需要用户自行到 https://c411.org/user/integrations 生成，
 *     但权限分开——搜索用 **Torznab**，用户信息用 **Profile (reading)**；建议建一把同时勾选两者的
 *     Key。未填写时搜索 401、用户信息状态为「需要输入」；只有 Torznab 权限时用户信息会 401。
 */

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
// noinspection ES6PreferShortImport
import { torznabCategoryName } from "../schemas/Torznab.ts";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import {
  CFBlockedError,
  EResultParseStatus,
  NeedLoginError,
  type IElementQuery,
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

// 与 schemas/Torznab.ts 的引擎默认行为一致：feed 里子类在前、父类在后，取第一个 attr；
// 未收录的 value 原样透出。c411 本身不走 TorznabSite 类（userInfo 是 Bearer + JSON），
// 但 category 映射闭包与其它 torznab 站共用一份实现。
const categoryName = torznabCategoryName(CATEGORIES);

/** `/api/user/profile` 的响应结构，字段名取自 tracker-tracker 的 c411 适配器（其 2026-10-20 真机样本） */
interface IC411Grade {
  tier?: string;
  level?: number;
}

interface IC411ProfileResponse {
  id?: number | string;
  username?: string;
  avatarUrl?: string | null;
  memberSince?: string;
  class?: {
    progress?: {
      grade?: IC411Grade | null;
    } | null;
  } | null;
  zen?: { balance?: number } | null;
  transfer?: {
    uploaded?: { actual?: number; credit?: number; total?: number };
    downloaded?: { actual?: number; credit?: number; total?: number };
  };
  download?: { allowed?: boolean } | null;
}

/**
 * 站点把等级称作 grade：bronze / argent / or 各 4 级；`or` 的第 4 级直接叫 Gold 411，
 * 不叫 Gold IV（站点 wiki 的写法）。未知 tier 原样透出，未选 class 时没有等级。
 */
const GRADE_TIERS: Record<string, string> = { bronze: "Bronze", argent: "Silver", or: "Gold" };
const GRADE_NUMERALS = ["I", "II", "III", "IV"];

const gradeName = (grade: IC411Grade | null | undefined): string | undefined => {
  const tier = typeof grade?.tier === "string" ? grade.tier.trim().toLowerCase() : "";
  const level = grade?.level;
  if (!tier || typeof level !== "number" || !Number.isFinite(level)) {
    return undefined;
  }
  if (tier === "or" && level === 4) {
    return "Gold 411";
  }
  return `${GRADE_TIERS[tier] ?? tier} ${GRADE_NUMERALS[level - 1] ?? `${level}`}`;
};

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
      hint: "必填。登录 C411 后在 https://c411.org/user/integrations 生成：搜索需要 Torznab 权限，用户信息需要 Profile (reading) 权限（建议同一把 Key 同时勾选；权限不全时用户信息会 401）",
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
      // Newznab 的 t 只接受 search / tvsearch / movie / music / book，caps 里的 "movie-search"
      // 是能力名而不是取值（Jackett 直接传 Query.Type，即 "movie"）；传 movie-search 时站点返回的
      // 不是 feed，前端会报 Parse Error（#1666 反馈）。搜索词里没有片种信息，统一按电影查；
      // 剧集类 imdb 号可能查不到，需改用标题搜索。
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          requestConfig!.params ??= {};
          requestConfig!.params.t = "movie";
          requestConfig!.params.imdbid = keywords;
          delete requestConfig!.params.q;
          return requestConfig!;
        },
      },
      tmdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          requestConfig!.params ??= {};
          requestConfig!.params.t = "movie";
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
      // id 即 infohash，同步显式落到 torrent.infoHash
      infoHash: { selector: "[name=infohash]", attr: "value" },
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

  // 用户信息由下面的 getUserInfoResult 覆写解析，这里的 selectors 就是它使用的字段路径。
  // 注意：本对象**必须非空**——checkSiteMetadataAllow 会把 `{}` 视为「未配置」（utils/helper.ts:17-22），
  // 空对象会让 hasUserInfo / allowQueryUserInfo 为 false，站点根本不会出现在「我的数据」里（#1666）。
  userInfo: {
    selectors: {
      // 字段来自 GET /api/user/profile（tracker-tracker 2026-10-20 的真机样本）
      id: { selector: "id" },
      name: { selector: "username" },
      uploaded: { selector: "transfer.uploaded.total" },
      downloaded: { selector: "transfer.downloaded.total" },
      trueUploaded: { selector: "transfer.uploaded.actual" },
      trueDownloaded: { selector: "transfer.downloaded.actual" },
      bonus: { selector: "zen.balance" },
      joinTime: { selector: "memberSince", filters: [{ name: "parseTime" }] },
      avatar: { selector: "avatarUrl" },
    },
  },
};

export default class C411 extends PrivateSite {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    const url = `${axiosConfig.url ?? ""}`;
    const apikey = this.userConfig.inputSetting?.apikey?.trim();

    if (apikey) {
      if (url.includes("/api/torznab")) {
        // Torznab 用 query 里的 apikey（与 Jackett 的 login/search 一致）
        axiosConfig.params = { ...(axiosConfig.params ?? {}), apikey };
      } else if (url.includes("/api/user/profile")) {
        // 用户信息用 Bearer（站点文档约定的 API Key 用法，token 不进 URL）
        axiosConfig.headers = { ...(axiosConfig.headers ?? {}), Authorization: `Bearer ${apikey}` };
      }
    }

    return super.request<T>(axiosConfig, checkLogin);
  }

  /**
   * 用户信息取自 `GET /api/user/profile`，`Authorization: Bearer <API Key>`。
   *
   * 该端点需要 Key 带 **Profile (reading)** 权限（搜索用的 Torznab 权限不覆盖它），
   * 因此这里自行处理 401：对用户来说「Key 权限不够 / 已失效」与「需要登录」是两回事。
   * 未填 Key 时直接返回「需要输入」，不必发请求。
   */
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    const flushUserInfo: IUserInfo = {
      status: EResultParseStatus.unknownError,
      updateAt: +new Date(),
      site: this.metadata.id,
      id: lastUserInfo.id,
      name: lastUserInfo.name,
    };

    const apikey = this.userConfig.inputSetting?.apikey?.trim();
    if (!apikey) {
      flushUserInfo.status = EResultParseStatus.noUserInput;
      return flushUserInfo;
    }

    try {
      // checkLogin = false：401 在这里表示 Key 权限不足/失效，交给下面单独判定，
      // 不让 base class 直接抛 NeedLoginError（那是 Cookie 会话的口径）。
      const { data } = await this.request<IC411ProfileResponse>(
        { url: "/api/user/profile", responseType: "json" },
        false,
      );

      for (const [key, selector] of Object.entries(this.metadata.userInfo?.selectors ?? {})) {
        const value = this.getFieldData(data, selector as IElementQuery);
        if (value !== undefined && value !== null && value !== "") {
          flushUserInfo[key] = value;
        }
      }

      // 头像给的是站内相对路径（如 /avatars/123456.webp）
      if (typeof data.avatarUrl === "string" && data.avatarUrl) {
        flushUserInfo.avatar = new URL(data.avatarUrl, this.metadata.urls[0]).toString();
      }

      const levelName = gradeName(data.class?.progress?.grade);
      if (levelName) {
        flushUserInfo.levelName = levelName;
      }

      // 分享率不在这里算：交给 level.ts 的 fixRatio 用 uploaded/downloaded 托底，
      // 这样口径与其它站点一致（无下载且有上传 → Infinity，两边都为 0 → -Infinity）

      // 分享率不足或账号受限时站点会直接禁止下载，挂到扩展字段留给界面提示
      if (typeof data.download?.allowed === "boolean") {
        flushUserInfo.canDownload = data.download.allowed;
      }

      flushUserInfo.status = EResultParseStatus.success;
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);

      flushUserInfo.status = EResultParseStatus.parseError;

      const status = (error as AxiosError)?.response?.status;
      if (error instanceof CFBlockedError) {
        flushUserInfo.status = EResultParseStatus.CFBlocked;
      } else if (error instanceof NeedLoginError) {
        flushUserInfo.status = EResultParseStatus.needLogin;
      } else if (status === 401 || status === 403) {
        // Key 没有 Profile (reading) 权限或已失效
        flushUserInfo.status = EResultParseStatus.noUserInput;
      }
    }

    return flushUserInfo;
  }
}
