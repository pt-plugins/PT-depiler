/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/hdarea.yml
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/hdarea.co/config.json
 *
 * 站点架构仍是 **NexusPHP**（用户信息 / 详情页 / 等级体系全部走网页），搜索改走站方 2026-11-11 上线的
 * 统一 API 网关的 **Torznab** 端点（#1706：站方公告要求第三方工具切换到专属 API Key 模式，并明确
 * 「严禁使用多线程高频网页爬虫扫描本站页面」）。
 *
 * ✅ 2026-11-13 匿名实测（以下两处不需要账号即可取证）：
 *   - `GET https://hdarea.club/torznab.php?t=caps` → 200：`<server version="1.3" title="HDArea">`、
 *     `<limits max="100" default="50"/>`、`<search supportedParams="q,imdbid,doubanid"/>`；
 *     分类表同时声明了 Newznab 大类 / 子类（2000 / 2040 / 2045 / 2050 / 5000 / 5040 / 5045 / 5070 /
 *     5080 / 3000 / 8000）与本站原生分类 ID（300 / 401 / 415 / …），原生 ID 另有一份 `+100000`
 *     的同名别名。下面的分类展示名映射即照此声明编写。
 *   - `GET https://hdarea.club/torznab.php?t=search&q=dune`（不带 Key）→ **HTTP 200 + 根级
 *     `<error code="100" description="Missing or malformed API Key…"/>`**：与 Newznab 规范一致，
 *     错误同样是 200，只看状态码会把「Key 无效」显示成「没有搜索结果」，所以本文件在
 *     `loggedCheck` 里用 `parseTorznabApiError` 做翻译（1xx → 提示去填 API Key）。
 *
 * 用户信息同样改走 REST API v1：`GET /api/v1/user/profile`（别名 `/api/member/profile`，
 * 需 `read` 权限，鉴权同搜索——`X-API-Key` 请求头）。
 *
 * ✅ 2026-11-13 匿名实测（续）：`GET /api/v1/status` 与 `/api.php?route=v1/status` 在无 Key 时
 *   都返回 **HTTP 401 + `{"success":false,"code":401,"message":"Missing or malformed API Key…",
 *   "data":null}`**——REST 侧用 JSON 信封表达错误（而不是 torznab 的 `<error>`），
 *   故 `loggedCheck` 里两条错误通道分别翻译。
 *
 * ✅ 2026-11-13 用户反馈的 `/api/v1/user/profile` 真实响应（#1706）：`data` 是**扁平结构**，不是
 *   M-Team 的 `memberCount` 嵌套——`uploaded` / `downloaded`（纯字节）、`share_ratio`、`seedbonus`、
 *   `hourly_bonus`（时魔总量，另有 `hourly_bonus_detail` 拆解）、`seeding_count` / `seeding_size`、
 *   `unread_messages_count`、`invites`、`uploaded_torrents_count`（发种数）、
 *   `completed_torrents_count`、`leeching_count`、`added` / `last_access`（站点墙上时间）、
 *   `class_name`（等级名）、`donor`。下面的 `userInfo` 选择器即按这份样本编写。
 *
 * ⚠️ 仍未能真机验证（本机没有该站账号）：feed 中 `<item>` 的具体形态——详情页写在 `<comments>`
 *   还是 `<guid>`、下载地址是否在 `<enclosure url>`、是否携带 `infohash` / `coverurl` /
 *   `downloadvolumefactor` 等扩展属性。选择器按 torznab 规范（Newznab Web API「Important fields
 *   of the returned data (RSS)」）与仓库内其它 Torznab 站（c411 / pandacd）的实测口径编写，
 *   并做了多候选兜底。
 *
 * 相对旧的纯网页抓取，本次变更：
 *   1. `search` 指向 `/torznab.php`（`t=search`，关键词走 `q`，`imdb|` / `douban|` 高级搜索词走
 *      `imdbid` / `doubanid`），并新增必填的 `apikey`（控制面板 → 安全设定 → API Key 存取令牌管理，
 *      需要 `read` 权限；站点读取配额 60 次/分）；
 *   2. `category` 只保留 Torznab 参数表里声明过的两项：`cat`（原生分类 ID，逗号分隔）与 `spstate`
 *      （促销）。旧定义中的二级属性筛选（medium / codec / audiocodec / standard / team）与
 *      incldead / inclbookmarked 不在 torznab 参数表内——传过去要么被网关忽略（界面有筛选器但
 *      结果没过滤，属于静默失效），要么被判为非法参数，故一并移除；确需这些维度只能改用
 *      REST API v1（`GET /api/v1/torrents`）；
 *   3. 原来的网页列表选择器（rows / title / subTitle / tags）整体移入 `list`，继续服务
 *      content-script 的列表页解析；搜索已不走网页，故 `mergeSearchSelectors: false`，
 *      免得把 XML 的选择器混进来；
 *   4. `userInfo` 由「/index.php + /userdetails.php + /mybonus.php 网页抓取」改为 REST API v1
 *      一次取全（字段见上方真实响应样本），**并移除了原有的网页兼容兜底**：不再请求
 *      `/mybonus.php` 取做种总积，也不再把做种数 / 发种数回落到 `getusertorrentlistajax.php`
 *      的 AJAX 解析——这两项现在都直接来自 API（`seeding_count` / `uploaded_torrents_count`）。
 *      接口没有的数据（真实上下传量、H&R 计数、做种积分）保持「未知」；
 *   5. `version` 由 1 提升到 2（用户要求；types/site.ts 对 NexusPHP 的建议值是 0，仓库现状约定俗成写 1）。
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  ILevelRequirement,
  ISearchCategoryOptions,
  ISearchInput,
  ISiteMetadata,
  ITorrent,
  ITorrentTag,
  IUserInfo,
} from "../types";
import { NoUserInputError } from "../types";
import NexusPHP, { SchemaMetadata } from "../schemas/NexusPHP.ts";
import { parseTorznabApiError, parseTorznabSize, torznabCategoryName } from "../schemas/Torznab.ts";
import { parseTimeWithZone } from "../utils/datetime";

/**
 * 本站原生分类：id / 名称取自站点规则与 `t=caps`（torznab 的 `cat` 参数同时接受 Newznab 大类号与
 * 这些原生 ID，见 #1706 提供的《HDArea 官方 API 接入说明》）。
 */
const siteCategories: ISearchCategoryOptions[] = [
  { name: "Movie UHD-4K", value: 300 },
  { name: "Movies Blu-ray", value: 401 },
  { name: "Movies REMUX", value: 415 },
  { name: "Movies 3D", value: 416 },
  { name: "Movies 1080p", value: 410 },
  { name: "Movies 720p", value: 411 },
  { name: "Movies DVD", value: 414 },
  { name: "Movies WEB-DL", value: 412 },
  { name: "Movies HDTV", value: 413 },
  { name: "Movies iPad", value: 417 },
  { name: "Documentaries", value: 404 },
  { name: "Animations", value: 405 },
  { name: "TV Series", value: 402 },
  { name: "TV Shows", value: 403 },
  { name: "Music Videos", value: 406 },
  { name: "Sports", value: 407 },
  { name: "Misc", value: 409 },
  { name: "HQ Audio", value: 408 },
];

/**
 * feed 里 `<torznab:attr name="category" value="…"/>` 的 value → 展示名。
 * 取值可能落在两套命名空间里（`t=caps` 两套都声明了），故一并收录：
 *  - Newznab 大类 / 子类（2000 / 2040 / …）；
 *  - 本站原生分类 ID，以及 caps 里与之一一对应的 `原生ID + 100000` 别名。
 */
const categoryName = torznabCategoryName([
  { name: "Movies", value: 2000 },
  { name: "Movies/HD", value: 2040 },
  { name: "Movies/UHD", value: 2045 },
  { name: "Movies/BluRay", value: 2050 },
  { name: "TV", value: 5000 },
  { name: "TV/HD", value: 5040 },
  { name: "TV/UHD", value: 5045 },
  { name: "TV/Anime", value: 5070 },
  { name: "TV/Documentary", value: 5080 },
  { name: "Audio", value: 3000 },
  { name: "Other", value: 8000 },
  ...siteCategories.flatMap((item) => [item, { ...item, value: Number(item.value) + 100000 }]),
]);

/** torznab 参数表里的 `spstate` 取值（1 普通 ~ 9 所有免费；不选即不过滤） */
const spstateOptions: ISearchCategoryOptions[] = [
  { name: "普通", value: 1 },
  { name: "免费", value: 2 },
  { name: "2X", value: 3 },
  { name: "2X免费", value: 4 },
  { name: "50%", value: 5 },
  { name: "2X 50%", value: 6 },
  { name: "30%", value: 7 },
  { name: "任意促销", value: 8 },
  { name: "所有免费", value: 9 },
];

/** 旧的网页列表页选择器（仅 content-script 使用，搜索已改走 torznab feed） */
const listSelectors = {
  ...SchemaMetadata.search.selectors!,
  rows: {
    selector: "table.torrents > tbody > tr:has(table.torrentname)",
  },
  title: {
    ...SchemaMetadata.search.selectors!.title!,
    // 站点设置「种子标题上悬浮提示类型」选为简单/中型 IMDb 信息时，标题锚点渲染为
    // onmouseover="get_ext_info_ajax(...)"（悬停浮窗），无 title 属性、href 不带 hit，
    // 模板默认选择器全部落空导致标题丢失（#1417），此处追加该形态的兜底
    selector: [
      "a[href^='details.php?id='][title]:has(b)",
      "a[href*='details.php?id='][href*='hit']",
      "a[href*='hit'][title]",
      "a[href*='hit']:has(b)",
      "a[onmouseover*='get_ext_info_ajax']",
    ],
  },
  subTitle: {
    text: "",
    selector: [
      "a[href^='details.php?id='][title]:has(b)",
      "a[href*='details.php?id='][href*='hit']",
      "a[href*='hit'][title]",
      "a[href*='hit']:has(b)",
      "a[onmouseover*='get_ext_info_ajax']",
    ],
    // HDArea places the subtitle in a sibling div of the title div,
    // rather than after a <br> tag, so we look at the next sibling element.
    elementProcess: (element: HTMLElement) => {
      const titleDiv = element.closest("td > div");
      const subtitleEl = titleDiv?.nextElementSibling;
      if (subtitleEl instanceof HTMLElement && subtitleEl.tagName === "DIV") {
        return subtitleEl.textContent?.trim() ?? "";
      }
      return "";
    },
  },
  tags: [
    ...SchemaMetadata.search.selectors!.tags!,
    { name: "首发", selector: "img.first_publish", color: "#3887D7" },
    { name: "禁转", selector: "img.transfer_forbidden", color: "#5E14DA" },
  ],
};

/** HDArea 等级体系（API 的 `data.class_name` 需要按它把等级名归一，基类随后用 name 反查 levelId） */
const levelRequirements: ILevelRequirement[] = [
  {
    id: 0,
    name: "User",
    privilege: "新用户的默认级别",
  },
  {
    id: 1,
    name: "Power User",
    interval: "P4W",
    downloaded: "50GB",
    ratio: 1.05,
    privilege:
      '得到1个邀请名额；可以直接发布种子；可以查看NFO文档；；可以请求续种； 可以发送邀请（开放邀请权限时）； 可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
  },
  { id: 2, name: "Elite User", interval: "P8W", downloaded: "120GB", ratio: 3.0, privilege: "权限同上。" },
  {
    id: 3,
    name: "Crazy User",
    interval: "P10W",
    downloaded: "300GB",
    ratio: 3.5,
    privilege: "可以在做种/下载/发布的时候选择匿名模式。",
  },
  {
    id: 4,
    name: "Insane User",
    interval: "P12W",
    downloaded: "750GB",
    ratio: 4.0,
    privilege: "可以查看普通日志。Insane User及以上用户封存账号后不会被删除。",
  },
  {
    id: 5,
    name: "Veteran User",
    interval: "P20W",
    downloaded: "1024GB",
    ratio: 4.5,
    isKept: true,
    privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
  },
  {
    id: 6,
    name: "Extreme User",
    interval: "P25W",
    downloaded: "2TB",
    ratio: 5.0,
    isKept: true,
    privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
  },
  {
    id: 7,
    name: "Ultimate User",
    interval: "P30W",
    downloaded: "5TB",
    ratio: 5.5,
    isKept: true,
    privilege: "得到1个邀请名额。",
  },
  {
    id: 8,
    name: "Nexus Master",
    interval: "P40W",
    downloaded: "10TB",
    ratio: 6.0,
    isKept: true,
    privilege: "得到2个邀请名额。",
  },
];

/** `data.class_name` 一般是等级名（"Power User"）；万一给的是数字等级 ID，也一并归一成 levelRequirements 的 name */
const levelNameFromRole = (role: unknown): string => {
  if (typeof role !== "string" && typeof role !== "number") {
    return "";
  }
  const text = `${role}`.trim();
  const matched = levelRequirements.find(
    (item) => `${item.id}` === text || item.name.toLowerCase() === text.toLowerCase(),
  );
  return matched?.name ?? text;
};

/**
 * API 的时间字段是**站点本地墙上时间**（`"2026-09-24 13:15:58"`，无时区后缀），
 * 按站点时区 +0800 换算成时间戳；不这么做会跟着浏览器所在时区漂移。
 */
const parseSiteTime = (value: string | number): number => parseTimeWithZone(value, "+0800");

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 2,
  id: "hdarea",
  name: "HDArea",
  aka: ["高清视界", "好大"],
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",

  collaborator: ["lzl20110", "zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://uqnern.pyho/"],
  legacyUrls: ["https://www.hdarea.co/"],

  userInputSettingMeta: [
    {
      name: "apikey",
      label: "API Key",
      hint: "搜索与「我的数据」都走该站 2026-11-11 上线的专属 API：控制面板 → 安全设定 → API Key 存取令牌管理里新建（需勾选 read 权限，32 位）。站方限制读取 60 次/分，并已明确禁止第三方工具高频爬取网页。",
      required: true,
    },
  ],

  category: [
    {
      name: "类型",
      key: "cat",
      options: siteCategories,
      cross: { mode: "comma" }, // torznab: cat=401,415（亦接受 Newznab 大类号 2000,5000）
    },
    {
      name: "促销种子？",
      key: "spstate",
      options: spstateOptions,
      cross: false,
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/torznab.php",
      // feed 是 application/xml，axios 解析为 Document，选择器按 XML 结构写
      responseType: "document",
      // caps: limits max=100 default=50；本仓库一次只取一页
      params: { t: "search", limit: 100 },
    },
    advanceKeywordParams: {
      // caps: search supportedParams = q,imdbid,doubanid；imdbid 同时接受 tt 前缀与纯数字
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          requestConfig!.params ??= {};
          requestConfig!.params.imdbid = keywords;
          delete requestConfig!.params.q;
          return requestConfig!;
        },
      },
      douban: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          requestConfig!.params ??= {};
          requestConfig!.params.doubanid = keywords;
          delete requestConfig!.params.q;
          return requestConfig!;
        },
      },
    },
    selectors: {
      rows: { selector: "rss > channel > item" },
      // 本站架构仍是 NexusPHP：详情页是 details.php?id=…，<comments>（规范里的详情页）优先，
      // <guid> 兜底；guid 若是 infohash 形态则原样当 id 用（至少保证唯一）
      id: {
        selector: ["comments", "guid"],
        elementProcess: (el: Element) => {
          const raw = (el.textContent ?? "").trim();
          return /[?&#]id=(\d+)/i.exec(raw)?.[1] ?? raw;
        },
      },
      url: { selector: ["comments", "guid"] },
      title: { selector: "title" },
      // <enclosure url> 是规范指定的下载入口，<link> 兜底（个别实现把种子地址放在 <link> 文本里）
      link: {
        selector: ["enclosure", "link"],
        elementProcess: (el: Element) => el.getAttribute("url") || el.textContent || "",
      },
      // <pubDate> 形如 "Sun, 18 Jan 2026 04:05:41 +0000"（RFC 2822），parseTime 最终由原生 Date 解析
      time: { selector: "pubDate", filters: [{ name: "parseTime" }] },
      // 规范要求纯字节数，parseTorznabSize 同时兼容带单位字符串
      size: { selector: "[name=size]", attr: "value", filters: [parseTorznabSize] },
      seeders: { selector: "[name=seeders]", attr: "value" },
      leechers: { selector: ["[name=leechers]", "[name=peers]"], attr: "value" },
      // grabs = 被索引器取走的次数，对应 ITorrent.completed
      completed: { selector: "[name=grabs]", attr: "value" },
      comments: { selector: "[name=comments]", attr: "value" },
      author: { selector: "[name=poster]", attr: "value" },
      cover: { selector: "[name=coverurl]", attr: "value" },
      // 规范要求小写十六进制；个别实现给大写，这里统一归一（缺失时保持 undefined，magnet 可另行拼装）
      infoHash: {
        selector: "[name=infohash]",
        attr: "value",
        filters: [(value: string) => value.trim().toLowerCase()],
      },
      category: {
        selector: ["[name=category]", "category"],
        elementProcess: (el: Element) => (el.getAttribute("value") ?? el.textContent ?? "").trim(),
        filters: [categoryName],
      },
      // 优惠系数（规范 1.2）：0 = 免费；选择器未命中时 filters 不执行，保持「未知」
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
      // <torznab:attr name="imdbid|imdb"> 与 "doubanid|douban" 两种写法都接受
      ext_imdb: {
        selector: ["[name=imdbid]", "[name=imdb]"],
        attr: "value",
        filters: [{ name: "extImdbId" }],
      },
      ext_douban: {
        selector: ["[name=doubanid]", "[name=douban]"],
        attr: "value",
        filters: [{ name: "extDoubanId" }],
      },
    },
  },

  /**
   * 前台种子列表页（/torrents.php，含 `?search=` 等筛选参数；/special.php 与 NexusPHP 模板口径一致，
   * 仍是同一张 torrents 表）。
   * 只服务 content script 的 DOM 解析：搜索本身走 torznab feed，所以 `mergeSearchSelectors: false`，
   * 否则会把 `rss > channel > item` 这类 XML 选择器混进来。
   */
  list: [
    {
      urlPattern: ["/torrents.php", "/special.php"],
      mergeSearchSelectors: false,
      selectors: listSelectors,
    },
  ],

  detail: {
    ...SchemaMetadata.detail,
    selectors: {
      ...SchemaMetadata.detail.selectors,
      link: {
        selector: `td:contains("下载链接") + td`,
        elementProcess: (element: HTMLElement) => {
          const textNode = element?.childNodes[0];
          return textNode?.textContent?.trim() ?? "";
        },
      },
    },
  },

  userInfo: {
    // 走官方 REST API v1 一次取全；字段路径按 #1706 用户反馈的真实响应（data 为扁平结构）编写。
    // 接口没有的字段（trueUploaded / trueDownloaded / hnr* / seedingBonus / avatar）就不声明，保持「未知」。
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/api/v1/user/profile", responseType: "json" }, // 兼容别名：/api/member/profile
        selectors: {
          id: { selector: "data.id", filters: [{ name: "parseNumber" }] },
          name: { selector: "data.username" },
          // 站点自己算好的分享率（真实样本 33.884），比用 uploaded / downloaded 现算更贴合站点口径
          ratio: { selector: "data.share_ratio", filters: [{ name: "parseNumber" }] },
          uploaded: { selector: "data.uploaded", filters: [{ name: "parseNumber" }] },
          downloaded: { selector: "data.downloaded", filters: [{ name: "parseNumber" }] },
          // 魔力值 seedbonus / 时魔 hourly_bonus（hourly_bonus_detail 是拆解明细，这里只取总量）
          bonus: { selector: "data.seedbonus", filters: [{ name: "parseNumber" }] },
          bonusPerHour: { selector: "data.hourly_bonus", filters: [{ name: "parseNumber" }] },
          invites: { selector: "data.invites", filters: [{ name: "parseNumber" }] },
          seeding: { selector: "data.seeding_count", filters: [{ name: "parseNumber" }] },
          seedingSize: { selector: "data.seeding_size", filters: [{ name: "parseNumber" }] },
          uploads: { selector: "data.uploaded_torrents_count", filters: [{ name: "parseNumber" }] },
          leeching: { selector: "data.leeching_count", filters: [{ name: "parseNumber" }] },
          snatches: { selector: "data.completed_torrents_count", filters: [{ name: "parseNumber" }] },
          messageCount: { selector: "data.unread_messages_count", filters: [{ name: "parseNumber" }] },
          isDonor: { selector: "data.donor" },
          joinTime: { selector: "data.added", filters: [parseSiteTime] },
          lastAccessAt: { selector: "data.last_access", filters: [parseSiteTime] },
          // class_name 是等级名（"User"）；数字 class 是站点的 1 基序号，与 levelRequirements 的 0 基 id 不同，故不用
          levelName: { selector: "data.class_name", filters: [levelNameFromRole] },
        },
      },
    ],
  },

  levelRequirements,
};

/** 官方 API 网关下的请求（torznab 搜索 / REST v1 用户信息）：都要带 X-API-Key */
const isApiRequestUrl = (url: string): boolean => /\/(?:torznab\.php|api\/v1\/|api\.php)/.test(url);

export default class HDArea extends NexusPHP {
  /** 站点设置里填写的 API Key（torznab 搜索与 REST v1 用户信息共用；其它网页请求仍走 Cookie） */
  protected get apikey(): string | undefined {
    return this.userConfig.inputSetting?.apikey?.trim() || undefined;
  }

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 只给官方 API 请求（torznab 搜索 / REST v1 用户信息）带上 Key，网页请求继续沿用浏览器 Cookie。
    // 站方推荐的 Header 形式优先：Key 不进 URL，免得泄漏到日志 / Referer。
    if (isApiRequestUrl(`${axiosConfig.url ?? ""}`)) {
      const apikey = this.apikey;
      if (!apikey) {
        throw new NoUserInputError("API Key");
      }
      axiosConfig.headers = { ...(axiosConfig.headers ?? {}), "X-API-Key": apikey };
    }

    return super.request<T>(axiosConfig, checkLogin);
  }

  protected override loggedCheck(raw: AxiosResponse): boolean {
    if (isApiRequestUrl(`${raw.config?.url ?? ""}`)) {
      // ① torznab 通道（Newznab 规范）：错误同样是 HTTP 200 + 根级 <error code="…" description="…"/>。
      //    不在这里翻译，「Key 无效 / 无 read 权限」会被当成「没有搜索结果」（NoTorrentsError）。
      const torznabError = parseTorznabApiError(raw.data);
      if (torznabError) {
        const detail = torznabError.description
          ? `${torznabError.code} ${torznabError.description}`
          : `${torznabError.code}`;
        if (torznabError.code >= 100 && torznabError.code < 200) {
          throw new NoUserInputError(`API Key (${detail})`);
        }
        throw Error(`Torznab API error: ${detail}`);
      }

      // ② REST v1 通道：错误走 JSON 信封（实测无 Key 时 401 +
      //    {"success":false,"code":401,"message":"Missing or malformed API Key…","data":null}）。
      //    401/403 归为「Key 需要输入 / 权限不足」，交给界面提示，而不是笼统的「需要登录」。
      const envelope = raw.data as { success?: boolean; code?: number; message?: string } | null | undefined;
      if (envelope && typeof envelope === "object" && envelope.success === false) {
        const detail = `${envelope.message ?? ""}`.trim() || `${envelope.code ?? raw.status}`;
        if (raw.status === 401 || raw.status === 403 || envelope.code === 401 || envelope.code === 403) {
          throw new NoUserInputError(`API Key (${detail})`);
        }
        throw Error(`HDArea API error: ${detail}`);
      }
    }

    return super.loggedCheck(raw);
  }

  /**
   * `NexusPHP.getUserInfoResult` 在 seeding / seedingSize / uploads 缺失时，会回落到
   * `getusertorrentlistajax.php`（做种页 / 发种页）的网页 AJAX 解析。本站用户信息已全部改走
   * REST API v1，这里把这两个钩子置空：字段没拿到就保持「未知」，不再回头打网页
   * （#1706 的站方公告也明确禁止第三方工具高频爬取本站页面）。
   */
  protected override async parseUserInfoForSeedingStatus(
    flushUserInfo: Partial<IUserInfo>,
  ): Promise<Partial<IUserInfo>> {
    return flushUserInfo;
  }

  protected override async parseUserInfoForUploads(flushUserInfo: Partial<IUserInfo>): Promise<Partial<IUserInfo>> {
    return flushUserInfo;
  }

  // 获取种子标签（网页列表页用：HDArea 把「免费 / 首发 / 禁转」等写在 font 标签上）
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    super.parseTorrentRowForTags(torrent, row, searchConfig);

    const customTags = row.querySelectorAll("font[class]");
    if (customTags.length > 0) {
      const tags: ITorrentTag[] = torrent.tags || [];
      customTags.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const tagName = htmlElement.textContent?.replace(/\s/g, "").replace("免费", "Free");
        if (tagName) {
          tags.push({ name: tagName });
        }
      });

      torrent.tags = tags;
    }

    return torrent;
  }
}
