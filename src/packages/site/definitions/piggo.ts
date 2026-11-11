/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/piggo.me/config.json
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/piggo.json
 * @PTMDefinitions https://github.com/JustLookAtNow/pt_mate/blob/master/assets/sites/piggo.json
 */

/**
 * 猪猪（Piggo）改版成 Vue SPA 后旧 NexusPHP 页面全部 404，站点另有一套给第三方用的「实验室」接口
 * （站内「使用说明」页，也是本定义唯一使用的接口）：
 *
 * - 根地址在**独立的接口域名**上（rot13 见 `API_BASE`，不是站点前台域名），除 `/ping` 外全部
 *   POST + JSON，没有参数也要发 `{}`；响应是统一信封 `{ code, data, msg, time }`，成功时外层 code 为 0。
 * - 鉴权用「个人中心 → 存取令牌」签发的 32 位小写十六进制令牌（等同账号密码），请求头
 *   `Authorization: Bearer <token>`。站点一旦关闭存取令牌，实验室接口整体不可用 ——
 *   所以这里**不**碰前台的登录态 / JWT / HMAC（站点文档也明确要求不要用）。
 * - 只返回当前账号默认可看的种子；看不见与不存在都回 404，不区分。
 * - 有未读的必读公告时，除 `/ping` 外一律 HTTP 403 —— 此时外层 code 仍是 0，业务码在
 *   `data.code`（`notice_unread`）；实验室既不能标已读也不能绕开，只能等用户去前台读完。
 *
 * 限额（每分钟）：`/catalog` 60、`/torrents` 30、`/torrents/{id}` 60、`/torrents/{id}/download-link` 20；
 * `/ping`、`/me` 不限。下面的 `search.requestDelay` 与 `download.interval` 就是按这两个限额配的。
 *
 * 接口没给的东西（不是解析问题，别去猜选择器）：简介、passkey、权限列表、促销（free / 2x）、
 * 评论数、发布人、做种体积都不返回；搜索条目也不带下载链接，要按种子调 `/download-link` 现签
 * （约 24 小时有效，成功 announce 后作废）。
 *
 * 种子标签同理：站点前台在列表上打的「完结 / 中字 / 官方 / 禁转 / 中英双语」这类标记接口不返回，
 * `/catalog` 的 taxonomies 里也没有对应的分组（只有官组、来源、介质、编码、音轨、分辨率、HDR、
 * 地区）。所以在接口补齐标签之前，这里不自己生成任何标签（连 taxonomy 推的「官方」也不做），
 * 等站点把标签放进接口后直接取。
 *
 * 时魔（bonusPerHour）取的是接口 `/me` 的 `seedbonus_per_hour`，即**基础**每小时积分；
 * 站点「我的时魔」页展示的是含官种 / 勋章 / 后宫 / 捐赠加成的合计值（旧 /v1/web 的
 * `hour_table.total`），实验室接口没有这个口径，因此两者可能相差一个加成系数。
 *
 * 页面适配（content script）：`list`（`/torrents`、`/torrents/{分区}`）与 `detail`（`/detail/{id}`）都按前台
 * DOM 声明，让注入的脚本在这两类页面提供批量下载 / 复制链接 / 远程推送；字段只从 URL / DOM 取。
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";

import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import { NoUserInputError, type ISearchInput, type ISiteMetadata, type ITorrent } from "../types";
import {
  buildCategoryOptionsFromDict,
  parseTimeToLiveToDate,
  parseTimeToLiveToSeconds,
  parseTimeWithZone,
  restoreSecureLink,
} from "../utils";

/** 实验室接口根地址：独立域名按仓库惯例 rot13 存放，运行时还原（不出现明文网址） */
const API_BASE = `${restoreSecureLink("uggcf://ncv.cvttb.zr/")}v1/api`;

/** 站点时间统一是 UTC+8 的墙上时间（接口返回的时间字符串不带时区） */
const TIMEZONE = "+0800";

/** 统一响应信封 */
interface IApiEnvelope<T> {
  code: number;
  data: T;
  msg: string;
  time: number;
}

/** 分区（`/catalog` 的 sections）：section_id → 名称；搜索的「分区」筛选与结果展示都用它 */
const SECTIONS: Record<number, string> = {
  1: "电影",
  2: "电视剧",
  3: "综艺",
  5: "少儿",
  6: "纪录片",
  7: "动漫",
  8: "音乐",
  9: "图文",
  10: "有声",
  11: "体育",
  12: "其他",
};

/**
 * 分类（`/catalog` 的 categories）：category_id → 名称。
 *
 * 分类是分区下的二级选项，同一个 id 在不同分区下同名（如 15=冒险 同属电影 / 电视剧 / 少儿），
 * 而搜索的 `category_id` 是「命中任一即可」的平铺数组，所以这里按 id 摊平、只留一份。
 *
 * 这两张表按 `/catalog` 的真实返回抄下来（搜索面板的选项必须是静态的，没法运行时拉）：
 * 站点增删分区 / 分类后，照 `/catalog` 的返回同步这里即可。
 */
const CATEGORIES: Record<number, string> = {
  1: "剧情",
  2: "喜剧",
  3: "动作",
  4: "爱情",
  5: "奇幻科幻",
  6: "动画",
  7: "惊悚",
  8: "悬疑",
  9: "战争",
  10: "历史",
  11: "其他",
  12: "儿歌",
  13: "真人",
  14: "益智启蒙",
  15: "冒险",
  16: "科普",
  17: "玩具交通",
  18: "儿童音频",
  19: "动画电影",
  20: "有声书",
  21: "播客",
  22: "广播剧",
  23: "相声曲艺",
  24: "讲座课程",
  25: "音乐口白",
  26: "绘本",
  27: "漫画",
  28: "真人秀",
  29: "脱口秀",
  30: "访谈",
  31: "晚会",
  32: "选秀偶像",
  33: "生活美食",
  34: "文化",
  35: "热血",
  36: "日常",
  37: "恋爱",
  38: "搞笑",
  39: "治愈",
  40: "竞技",
  41: "自然",
  42: "社会",
  43: "人物",
  44: "科学",
  45: "旅行",
  46: "足球",
  47: "篮球",
  48: "网球",
  49: "乒羽",
  50: "赛车",
  51: "格斗",
  52: "排球",
  53: "冰雪极限",
  54: "台球棋牌",
  55: "演唱会",
  56: "MV",
  57: "音频",
};

/**
 * 解析站点时间：接口给的是 UTC+8 的墙上时间（`2026-11-10 15:35:58`），
 * 用仓库的 `parseTimeWithZone` 按站点时区换算（`parseTime` / `parseFuzzyTime` 是按运行主机时区解析的，
 * 用户时区不是 +0800 时会整体偏移）。
 * `last_access` 还会带一段相对时间补注（`2026-11-11 11:13:06 (2分钟前)`），先剥掉再用绝对时间。
 */
const parseSiteTime = (value: unknown): number => {
  const timestamp = parseTimeWithZone(
    String(value ?? "")
      .replace(/\s*[（(][^）)]*[）)]\s*$/, "")
      .trim(),
    TIMEZONE,
  );
  return Number.isFinite(timestamp) ? timestamp : 0;
};

/**
 * 解析做种 / 下载时长：`70304天03:56:03` → 秒。
 * 只把 `hh:mm:ss` 归一成仓库 `parseTimeToLiveToSeconds` 认识的中文单位，换算交给它算；
 * 接口偶尔也可能直接给秒数。
 */
const parseSiteDuration = (value: unknown): number => {
  const text = String(value ?? "").trim();
  const parsed = parseTimeToLiveToSeconds(text.replace(/(\d{1,2}):(\d{2}):(\d{2})/, "$1时$2分$3秒"));
  return typeof parsed === "number" ? parsed : Number(text) || 0;
};

/**
 * 从 `/detail/{id}` 形式的地址里取种子 id：列表页取标题链接的 href，详情页取当前页地址，两处共用。
 *
 * 不写成 `parseNumber`（取字符串里第一个数字）：站点要是把 href 换成绝对地址、域名里又带数字（镜像站），
 * 就会取到域名里的数字；也不值得为它串 replace + parseNumber 两个 filter。
 */
const detailIdFromUrl = (value: unknown): string => String(value ?? "").match(/\/detail\/(\d+)/)?.[1] ?? "";

/**
 * 列表页 / 详情页给的是相对时间（`1天2小时前`、`2月12天前`），用仓库的 `parseTimeToLiveToDate` 折算成时间戳。
 *
 * 不能把它直接交给基类的 `parseTimeWithZone`：那个函数对解析不出的字符串会走 `format(new Date(值), ...)`，
 * 抛 `RangeError: Invalid time value` 带崩整页解析（基类只挡了空串）。所以这里解析不出来就返回空串，
 * 让基类按「时间未知」丢掉这个字段。详情页不跑时区换算，返回值即最终值。
 */
const parseListedTime = (value: unknown): number | string => {
  const text = String(value ?? "").trim();
  if (!text) return "";

  const timestamp = parseTimeToLiveToDate(text);
  return typeof timestamp === "number" && Number.isFinite(timestamp) ? timestamp : "";
};

/**
 * 高级搜索词改写：`douban|1291546` / `imdb|tt0111161` 要放进接口对应的 id 字段。
 * 接口的 `q` 是标题 / 副标题模糊搜，拿 id 去搜什么也搜不到，所以要把它删掉。
 */
const byId =
  (field: "douban_id" | "imdb_id") =>
  ({ keywords, requestConfig }: ISearchInput): AxiosRequestConfig => ({
    ...requestConfig!,
    data: { ...(requestConfig?.data ?? {}), q: undefined, [field]: keywords },
  });

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "piggo",
  name: "Piggo",
  aka: ["猪猪"],
  description: "猪猪网",
  tags: ["影视", "综合", "少儿"],
  collaborator: ["zxb0303"],

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["uggcf://cvttb.zr/"],
  // 种子里的 announce 走独立域名（与前台不同），声明出来方便按 tracker 反查站点
  trackerUrls: ["uggcf://genpxre.cvttb.zr/"],
  timezoneOffset: TIMEZONE,

  officialGroupPattern: [/Pigo(?:HD|Web|NF|AD)/i],

  userInputSettingMeta: [
    {
      name: "token",
      label: "存取令牌",
      hint: "站点「个人中心 → 存取令牌」里新建，明文为 32 位小写十六进制，可随时复制，等同账号密码，请勿泄露。站点关闭存取令牌后实验室接口即不可用。",
      required: true,
    },
  ],

  category: [
    // 接口对 id 的字符串 / 数字都收，直接用仓库的 buildCategoryOptionsFromDict 生成选项
    { name: "分区", key: "section_id", keyPath: "data", options: buildCategoryOptionsFromDict(SECTIONS) },
    {
      name: "分类",
      key: "category_id",
      keyPath: "data",
      // 接口接受数组（`[3, 5]` 或 `3,5` 都行）：分类命中任一即可
      cross: { mode: "brackets" },
      options: buildCategoryOptionsFromDict(CATEGORIES),
    },
  ],

  search: {
    keywordPath: "data.q",
    requestConfig: {
      url: `${API_BASE}/torrents`,
      method: "POST",
      responseType: "json",
      // 每页 1~100（默认 50）；单次搜索只取第一页，取满一页拿到最多结果
      data: { page: 1, per_page: 100 },
    },
    // /torrents 限 30 次/分
    requestDelay: 2e3,
    advanceKeywordParams: {
      douban: { requestConfigTransformer: byId("douban_id") },
      imdb: { requestConfigTransformer: byId("imdb_id") },
      // tmdb 必须 tmdb_id + tmdb_kind（movie / tv）同时给，而高级搜索词里没有 kind，单给 id 会 422
      tmdb: false,
    },
    selectors: {
      rows: { selector: "data.items" },
      id: { selector: "id" },
      title: { selector: "name" },
      subTitle: { selector: "small_descr" },
      url: { selector: "page_url" },
      // 发布时间：接口给的是站点墙上时间，由 parseWholeTorrentFromRow 按 timezoneOffset 换算
      time: { selector: "added_at" },
      size: { selector: "size" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "times_completed" },
      category: { selector: "section_id", filters: [(sectionId: number) => SECTIONS[sectionId] ?? ""] },
      // 下载链接要按种子现签，见 getTorrentDownloadLink
      ext_douban: { selector: "media.douban", filters: [{ name: "extDoubanId" }] },
      ext_imdb: { selector: "media.imdb", filters: [{ name: "extImdbId" }] },
    },
  },

  /**
   * 前台种子列表页：`/torrents`、`/torrents/{分区}`（movie / tv / children …）以及带筛选参数的 `/torrents?xxx`。
   *
   * 只服务于 content script 的 DOM 解析 —— 搜索本身走实验室接口，所以 `mergeSearchSelectors: false`，
   * 免得把接口的 JSON 选择器（`data.items` 之类）混进来。
   *
   * 统计列（评论 / 时间 / 大小 / 做种 / 下载 / 完成）里做种、下载、完成共用 `torrent-col-n` 这一个 class，
   * 只有 `data-label` 能区分，所以统一按 `data-label` 取。按 `tag=` 之类的筛选页也走这套选择器。
   */
  list: [
    {
      urlPattern: ["/torrents(?:[/?#]|$)"],
      mergeSearchSelectors: false,
      selectors: {
        // 列表页顶部的搜索框，点「在插件中搜索」时带上当前关键词（该 input 没有 name，只能按 id 取）
        keywords: { selector: "input#torrent-q", elementProcess: (el: HTMLInputElement) => el.value },
        rows: { selector: "table.torrent-list > tbody > tr" },
        // 种子名那格里有两条链接：分区 chip 与标题，只有标题链到 /detail/{id}
        id: { selector: "td.torrent-name a[href*='/detail/']", attr: "href", filters: [detailIdFromUrl] },
        title: { selector: "td.torrent-name a[href*='/detail/']" },
        subTitle: { selector: "td.torrent-name span.muted" },
        // 站内是根相对地址（`/detail/57233`），由 transformListPage 按当前页地址补全
        url: { selector: "td.torrent-name a[href*='/detail/']", attr: "href" },
        // 分区：与接口 section_id 的展示口径一致（标题右侧的分类 chip「动画 / 冒险」不取）
        category: { selector: "td.torrent-name a.torrent-sec-chip" },
        comments: { selector: 'td[data-label="评论"]' },
        time: { selector: 'td[data-label="时间"]', filters: [parseListedTime] },
        size: { selector: 'td[data-label="大小"]', filters: [{ name: "parseSize" }] },
        seeders: { selector: 'td[data-label="做种"]' },
        leechers: { selector: 'td[data-label="下载"]' },
        completed: { selector: 'td[data-label="完成"]' },
        author: { selector: 'td[data-label="发布人"]' },
      },
    },
  ],

  /**
   * 详情页：`/detail/{id}`（接口条目里的 `page_url` 就是这个形状）。
   *
   * 字段全部用通用选择器取：
   * - 标题在 `h1` 里，混着「收费」标记和右侧的分类 / 促销 chip，用 `elementProcess` 摘掉再取文本；
   * - 分区 / 大小等来自 `dl.meta-grid`，按 `dt` 文案取相邻的 `dd`；
   * - 下载地址页面里没有（见下面 `link` 的说明），复制 / 推送时才由 `getTorrentDownloadLink` 现签。
   */
  detail: {
    urlPattern: ["/detail/\\d+"],
    selectors: {
      // 路由里的数字就是种子 id；transformDetailPage 会 clone 文档，优先用当前页地址，别赌 clone 保留了 URL
      id: {
        selector: ":self",
        elementProcess: (element: Document) => (typeof location !== "undefined" ? location.href : element?.URL) ?? "",
        filters: [detailIdFromUrl],
      },
      title: {
        selector: "header.torrent-head h1",
        elementProcess: (el: HTMLElement) => {
          const clone = el.cloneNode(true) as HTMLElement;
          clone.querySelectorAll(".torrent-paid-icon, .torrent-type-chip").forEach((node) => node.remove());
          return clone.textContent ?? "";
        },
      },
      subTitle: { selector: "header.torrent-head p.torrent-sub span.muted" },
      // `dl.meta-grid` 是「标签 → 值」的单元格列表（分区 / 来源 / 编码 / 分辨率 / 制作组 / 大小 …），缺项时会
      // 少一个单元格，所以按 `dt` 文案取相邻的 `dd`（`:contains` 是仓库里既有的写法，见 0dayfiles / 0magnet）
      category: { selector: "dl.meta-grid dt:contains('分区') + dd" },
      size: { selector: "dl.meta-grid dt:contains('大小') + dd", filters: [{ name: "parseSize" }] },
      // 「由 匿名 发布于 1天2小时前」：作者与时间在同一行，按这两个固定字样切开
      author: {
        selector: "header.torrent-head p.torrent-by",
        elementProcess: (el: HTMLElement) => el.textContent?.match(/由\s*([^\s]+)\s*发布于/)?.[1] ?? "",
      },
      time: {
        selector: "header.torrent-head p.torrent-by",
        elementProcess: (el: HTMLElement) => el.textContent?.split("发布于").pop() ?? "",
        filters: [parseListedTime],
      },
      seeders: { selector: 'button.head-stat[data-tip="做种"]' },
      leechers: { selector: 'button.head-stat[data-tip="下载"]' },
      completed: { selector: 'button.head-stat[data-tip="完成"]' },
      // 前台没有能直接解析出来的下载地址（下载按钮是 <button>，没有 href，地址是站点现调接口签的），
      // 所以这里只能给空串占位：content script 用 `typeof link !== "undefined"` 判断「这页解析成功」，
      // 真正的地址在复制 / 推送时由 getTorrentDownloadLink 调实验室接口现签。
      link: { text: "" },
    },
  },

  userInfo: {
    process: [
      {
        requestConfig: { url: `${API_BASE}/me`, method: "POST", responseType: "json" },
        // 一个 /me 就够：资料、统计、等级、积分三项、做种 / 下载数都在里面。
        // 注意选择器是在**整个响应信封**上取值（AbstractPrivateSite 传进来的是 res.data），所以要带 data. 前缀。
        selectors: {
          id: { selector: "data.user.id" },
          name: { selector: "data.user.username" },
          // 等级按名字匹配 levelRequirements（站点 class.id 与等级表的编号并不一致）
          levelName: { selector: "data.user.class.name", text: "" },
          joinTime: { selector: "data.user.created_at", filters: [parseSiteTime] },
          lastAccessAt: { selector: "data.user.last_access", filters: [parseSiteTime] },
          messageCount: { selector: "data.user.mail_unread.total", text: 0 },
          invites: { selector: "data.user.stats.invites", text: 0 },
          isDonor: { selector: "data.user.donor", text: false },
          uploaded: { selector: "data.user.stats.uploaded", filters: [{ name: "parseSize" }] },
          downloaded: { selector: "data.user.stats.downloaded", filters: [{ name: "parseSize" }] },
          trueUploaded: { selector: "data.user.stats.true_uploaded", filters: [{ name: "parseSize" }] },
          trueDownloaded: { selector: "data.user.stats.true_downloaded", filters: [{ name: "parseSize" }] },
          ratio: { selector: "data.user.stats.ratio", filters: [{ name: "parseNumber" }] },
          trueRatio: { selector: "data.user.stats.true_ratio", filters: [{ name: "parseNumber" }] },
          seeding: { selector: "data.user.stats.seeding", text: 0 },
          leeching: { selector: "data.user.stats.leeching", text: 0 },
          seedingTime: { selector: "data.user.stats.seed_time", filters: [parseSiteDuration], text: 0 },
          // 积分三项：🥫饲料（bonus）/ 做种积分（seed_points）/ 时魔（seedbonus_per_hour，基础值，见文件头说明）
          bonus: { selector: "data.user.stats.bonus", text: 0 },
          seedingBonus: { selector: "data.user.stats.seed_points", text: 0 },
          seedingBonusPerHour: { selector: "data.user.stats.seed_points_per_hour", text: 0 },
          bonusPerHour: { selector: "data.user.stats.seedbonus_per_hour", text: 0 },
        },
      },
    ],
  },

  // /download-link 限 20 次/分：批量推送时每个种子签一次链接，按 3 秒一个排
  download: { interval: 3 },

  /**
   * 等级要求沿用站点规则页（NexusPHP 时期）的口径 —— 新站暂时没有等级说明页，
   * 数值来自本文件头部列出的上游定义，未经新站核对。
   */
  levelRequirements: [
    {
      id: 1,
      name: "乳猪",
      privilege: "新用户的默认级别。无法直接发布种子，需添加候选后等待审核。",
    },
    {
      id: 2,
      name: "烤乳猪",
      downgrade:
        "下载≥20GB且分享率≤0.4，下载≥100GB且分享率≤0.5，下载≥200GB且分享率≤0.6，下载≥400GB且分享率≤0.7，下载≥800GB且分享率≤0.8时自动降级本级。",
      privilege: "限制功能，如发表、申请链接、上传字幕等。",
    },
    {
      id: 3,
      name: "猪仔",
      interval: "P4W",
      downloaded: "100GB",
      ratio: 2,
      seedingBonus: 40000,
      privilege:
        "可直接发布种子，可查看NFO文档、用户列表，请求续种，查看排行榜，查看他人种子历史（未设强隐私时），可删除自己上传的字幕。",
    },
    {
      id: 4,
      name: "香猪",
      interval: "P8W",
      downloaded: "300GB",
      ratio: 2.5,
      seedingBonus: 80000,
      privilege: "香猪及以上封存账号后不会被删除。",
    },
    {
      id: 5,
      name: "野猪",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 3,
      seedingBonus: 150000,
      privilege: "得到一个永久邀请名额；可做种/下载/发布时选择匿名模式。",
    },
    {
      id: 6,
      name: "猪王",
      interval: "P25W",
      downloaded: "1TB",
      ratio: 3.5,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 7,
      name: "猪妖",
      interval: "P40W",
      downloaded: "2TB",
      ratio: 4,
      seedingBonus: 400000,
      privilege: "得到两个永久邀请名额；可以查看其他用户评论、帖子历史。",
    },
    {
      id: 8,
      name: "二师兄",
      interval: "P60W",
      downloaded: "3TB",
      ratio: 4.5,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息，可以查看二师兄论坛。",
    },
    {
      id: 9,
      name: "净坛使者",
      interval: "P80W",
      downloaded: "4TB",
      ratio: 5,
      seedingBonus: 800000,
      privilege: "得到三个邀请名额。",
    },
    {
      id: 10,
      name: "天蓬元帅",
      interval: "P100W",
      downloaded: "6TB",
      ratio: 6,
      seedingBonus: 1000000,
      isKept: true,
      privilege: "得到五个邀请名额，天蓬元帅及以上账号永久保留。",
    },
  ],
};

export default class Piggo extends PrivateSite {
  /** 存取令牌：个人中心签发，等同账号密码；粘贴时顺手兼容 `Bearer ` 前缀 */
  private get token(): string {
    return String(this.userConfig.inputSetting?.token ?? "")
      .trim()
      .replace(/^Bearer\s+/i, "")
      .trim();
  }

  /**
   * 实验室接口全是 POST + JSON、且必须带令牌，这里统一补上，业务代码只管给 url 与正文。
   */
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    const token = this.token;
    if (!token) {
      // 没填令牌就不必发请求：让上层显示「请填写 Token/Key」，而不是一个莫名其妙的 401
      throw new NoUserInputError("token");
    }

    return super.request<T>(
      {
        method: "POST",
        responseType: "json",
        ...axiosConfig,
        headers: { ...(axiosConfig.headers ?? {}), Authorization: `Bearer ${token}` },
        data: axiosConfig.data ?? {}, // 无参数时也要发 {}（接口要求 JSON 正文）
      },
      checkLogin,
    );
  }

  /** 调一次实验室接口，取出信封里的 data */
  private async api<T>(path: string, payload: Record<string, unknown> = {}, checkLogin: boolean = true): Promise<T> {
    const { data } = await this.request<IApiEnvelope<T>>({ url: `${API_BASE}${path}`, data: payload }, checkLogin);
    return data?.data;
  }

  /**
   * 站点错误口径（据站点文档）：401 = 没带令牌 / 令牌无效；403 = 无权，或必读公告未读；
   * 404 = 不存在或无权当不存在；422 = 参数无效；429 = 超限；500 = 服务端错误。
   * 除公告拦截外，信封 code 与 HTTP 状态相同，原因在 msg。
   */
  protected override loggedCheck(raw: AxiosResponse): boolean {
    const body = raw.data as Partial<IApiEnvelope<any>> | undefined;
    const envelopeCode = Number(body?.code);

    if (raw.status === 401 || envelopeCode === 401) {
      // 令牌无效也是 401；这里没法靠前台登录态兜底，直接让用户去填 / 换令牌
      throw new NoUserInputError("token");
    }

    if (body?.data?.code === "notice_unread") {
      const gate = body.data.notice_gate ?? {};
      throw new Error(
        `猪猪有未读的必读公告《${gate.title ?? "未命名"}》，请先到网站前台读完（须停留约 ${gate.read_wait ?? 0} 秒）后再试`,
      );
    }

    if (raw.status === 403) throw new Error(String(body?.msg || "无权访问该接口"));
    if (raw.status === 404) throw new Error("接口返回 404：种子不存在，或当前账号无权查看");
    if (raw.status === 429) throw new Error("触发猪猪接口的速率限制，请稍后再试");
    if (raw.status >= 400) {
      throw new Error(`猪猪接口返回 HTTP ${raw.status}${body?.msg ? `：${body.msg}` : ""}`);
    }
    if (Number.isFinite(envelopeCode) && envelopeCode !== 0) {
      throw new Error(String(body?.msg || `猪猪接口返回 code ${envelopeCode}`));
    }

    return true;
  }

  /**
   * 下载链接：搜索结果与详情页 DOM 都没有现成地址，按种子调 `/torrents/{id}/download-link` 现签一个。
   * 签出来的是普通 GET 地址（约 24 小时有效，成功 announce 后作废），**不能带令牌**，
   * 所以这里只把 URL 交回去，由下载器自己 GET。
   */
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const id = Number(torrent.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`猪猪：种子 ${String(torrent.id)} 没有可用的 id，无法签发下载链接`);
    }

    const { url } = await this.api<{ url: string }>(`/torrents/${id}/download-link`);
    return url;
  }
}
