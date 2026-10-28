/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/torrentsome.yml
 */
import { type ISiteMetadata } from "../types";

/**
 * 站点时间：以详情页「틈만나면,.E61.261013.720p-NEXT」为例，页面上写 `26.10.13 23:26`，
 * 而同一时刻 UTC 只有 14:26 —— 说明列表/详情页输出的是 KST（+0900）的墙上时间。
 * 同一颗种子在 torrenttip 上显示 `2026/10/13 14:32`（该站是 UTC），两者相差约 9 小时，可交叉印证。
 */
const SITE_TZ_HOURS = 9;

/**
 * 列表页的日期只有 `MM.dd`（没有年份），用站点时区的「今年」补年份；
 * 补出来的时间若比现在晚一天以上，说明是去年 12 月遗留的条目，回退一年。
 * 注意不能用 `parseTime`：它按运行主机时区解析，会让非 UTC 站点的结果整体偏移。
 */
function parseListTime(text: string): number {
  const match = /(\d{2})\.(\d{2})/.exec(String(text));
  if (!match) {
    return 0;
  }
  const nowSite = new Date(Date.now() + SITE_TZ_HOURS * 3600e3);
  const year = nowSite.getUTCFullYear();
  const build = (y: number) => Date.UTC(y, +match[1] - 1, +match[2]) - SITE_TZ_HOURS * 3600e3;
  const timestamp = build(year);
  return timestamp > Date.now() + 24 * 3600e3 ? build(year - 1) : timestamp;
}

/** 详情页的 `26.05.02 15:26`（yy.MM.dd HH:mm），按站点时区（+0900）换算成 UTC 毫秒 */
function parseDetailTime(text: string): number {
  const match = /(\d{2})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})/.exec(String(text));
  return match ? Date.UTC(2000 + +match[1], +match[2] - 1, +match[3], +match[4] - SITE_TZ_HOURS, +match[5]) : 0;
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "torrentsome",
  name: "Torrentsome",
  description: "Torrentsome（토렌트썸）是韩国公共 BT 索引站，收录韩国影视、综艺、音乐、动画等资源",
  tags: ["综合"],

  type: "public",
  urls: ["https://torrentsome270.com/"],
  legacyUrls: [
    "https://torrentsome252.com/",
    "https://torrentsome253.com/",
    "https://torrentsome254.com/",
    "https://torrentsome255.com/",
    "https://torrentsome256.com/",
    "https://torrentsome257.com/",
    "https://torrentsome258.com/",
    "https://torrentsome259.com/",
    "https://torrentsome260.com/",
    "https://torrentsome261.com/",
    "https://torrentsome262.com/",
    "https://torrentsome263.com/",
    "https://torrentsome264.com/",
    "https://torrentsome265.com/",
    "https://torrentsome266.com/",
    "https://torrentsome267.com/",
    "https://torrentsome268.com/",
    "https://torrentsome269.com/",
  ],

  timezoneOffset: "+0900",

  // 站点自己的搜索页把结果分成 8 个 `search_type` 板块，并有 2 种排序，值取自页面上的分栏链接
  category: [
    {
      name: "搜索分类",
      key: "search_type",
      options: [
        { name: "全部", value: 0 },
        { name: "电影", value: 1 },
        { name: "电视剧", value: 2 },
        { name: "Netflix", value: 3 },
        { name: "影视·音乐", value: 4 },
        { name: "动画·漫画", value: 5 },
        { name: "游戏·工具", value: 6 },
        { name: "在线电影", value: 152 },
      ],
    },
    {
      name: "排序",
      key: "order",
      options: [
        { name: "发布时间", value: "time" },
        { name: "相关度", value: "score" },
      ],
    },
  ],

  search: {
    keywordPath: "params.keywords",
    requestConfig: {
      url: "/search/index",
      responseType: "document",
      params: { search_type: 0, order: "time" },
    },
    selectors: {
      // 第 3 列是本条目的体积；体积为 "-" 的条目是站上已失效的种子（详情页既无 magnet 也无 Total Size），
      // 因此沿用 Jackett 的过滤条件把它们排除掉
      rows: { selector: 'div.topic-item:not(:has(div:nth-child(3):contains("-")))' },
      id: {
        selector: 'a[href^="/v/"]',
        attr: "href",
        filters: [(href: string) => href.match(/\/v\/(\d+)/)?.[1]],
      },
      // 元素文本里含有 <em> 高亮，完整标题只存在于 title 属性中
      title: { selector: 'a[href^="/v/"]', attr: "title" },
      url: { selector: 'a[href^="/v/"]', attr: "href" },
      category: { selector: 'a[href^="/v/"] > span' },
      time: { selector: "div:last-child", filters: [parseListTime] },
      size: { selector: "div:nth-last-child(2)", filters: [{ name: "parseSize" }] },
      // 站点不公开做种/下载/完成人数，留空
    },
  },

  list: [
    {
      urlPattern: ["/search/index"],
      selectors: {
        keywords: { selector: 'input[name="keywords"]', attr: "value" },
      },
    },
  ],

  // 详情页 /v/<id>：列表页给不出 magnet，真正的下载链接只在这一页上
  detail: {
    urlPattern: ["/v/\\d+"],
    selectors: {
      // 「관련 정보」区的第一张卡片总是当前条目自身的链接（已抽查 4 个详情页一致），
      // 用它保证详情页解析出的 id 与列表页 `/v/<id>` 完全一致
      id: {
        selector: 'div.card-body a[href^="/v/"]',
        attr: "href",
        filters: [(href: string) => href.match(/\/v\/(\d+)/)?.[1]],
      },
      title: { selector: "h1.text-base" },
      link: { selector: 'a[href^="magnet:?xt="]', attr: "href" },
      time: { selector: "div.py-2.px-2.border-b.border-dashed.text-gray-400", filters: [parseDetailTime] },
      // 同一行是「分类 · 浏览量 · 发布时间」，分类名里不含数字，故取第一个数字之前的部分
      category: {
        selector: "div.py-2.px-2.border-b.border-dashed.text-gray-400",
        filters: [(text: string) => String(text).split(/\d/)[0].trim()],
      },
      size: {
        selector: 'div.p-2.border-b.border-dashed:contains("Total Size")',
        filters: [{ name: "parseSize" }],
      },
    },
  },
};
