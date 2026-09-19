/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/teamhd.org/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/teamhd.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 俄语影视站，自研模板（browse / details / bprate.php）。Jackett 注释说明其登录页带
 * Google reCAPTCHA，故采用 Cookie 方式登录；PTD 沿用浏览器 cookie 会话，无需额外处理。
 */
import type { ISiteMetadata } from "../types";

const categoryMap: Record<number, string> = {
  25: "动画片",
  26: "Hi-Res 音频",
  27: "演示",
  28: "纪录片",
  29: "电影",
  30: "音乐视频",
  31: "体育",
  32: "电视节目",
  33: "剧集",
  34: "其他",
  35: "无字幕内容",
};

// 俄语月份 → 英语，供 parseTime 解析
const ruMonths: Record<string, string> = {
  января: "January",
  февраля: "February",
  марта: "March",
  апреля: "April",
  мая: "May",
  июня: "June",
  июля: "July",
  августа: "August",
  сентября: "September",
  октября: "October",
  ноября: "November",
  декабря: "December",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "teamhd",
  name: "TeamHD",
  description: "TeamHD is a RUSSIAN Private Torrent Tracker for HD MOVIES / TV",
  tags: ["影视"],
  timezoneOffset: "+0300",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://teamhd.org/"],

  category: [
    {
      name: "类别",
      key: "c",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "append" },
    },
    {
      name: "状态",
      key: "incldead",
      options: [
        { name: "仅活种", value: 0 },
        { name: "包含死种", value: 1 },
        { name: "仅死种", value: 2 },
        { name: "无做种", value: 3 },
      ],
    },
    {
      name: "优惠",
      key: "free",
      options: [
        { name: "全部", value: 0 },
        { name: "金种", value: 1 },
        { name: "银种", value: 2 },
        { name: "普通", value: 3 },
      ],
    },
  ],

  search: {
    requestConfig: {
      url: "/browse",
      params: {
        incldead: 1,
        free: 0,
      },
    },
    keywordPath: "params.search",
    // 站点默认搜索为精确匹配，Jackett 用 % 通配空格；同时站点对年份敏感
    requestConfigTransformer: ({ requestConfig }) => {
      const raw = requestConfig?.params?.search as string | undefined;
      if (raw) {
        requestConfig!.params!.search = raw
          .replace(/\s+/g, "%")
          .replace(/ +(?:19|20)\d{2} *$/, "")
          .replace(/(\S)%?$/, "$1");
      }
      return requestConfig!;
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "table.browse > tbody > tr:has(a[href^='download.php?id='])" },
      id: {
        selector: "a[href^='/details/id']",
        attr: "href",
        filters: [{ name: "parseNumber" }],
      },
      title: { selector: "a[href^='/details/id']" },
      url: { selector: "a[href^='/details/id']", attr: "href" },
      link: { selector: "a[href^='download.php?id=']", attr: "href" },
      category: {
        selector: "a[href*='/browse/cat']",
        attr: "href",
        filters: [{ name: "parseNumber" }, (catId: number) => categoryMap[+catId] ?? String(catId)],
      },
      time: { selector: "td > div > small", filters: [{ name: "parseTime", args: ["dd-MM-yyyy HH:mm"] }] },
      size: {
        selector: "td:nth-child(5)",
        elementProcess: (element: HTMLElement) => {
          const clone = element.cloneNode(true) as HTMLElement;
          clone.querySelectorAll("strong").forEach((strong) => strong.remove());
          return (clone.textContent ?? "").trim() || undefined;
        },
        filters: [{ name: "parseSize" }],
      },
      seeders: {
        selector: "td:nth-child(4)",
        elementProcess: (element: HTMLElement) => (element.textContent ?? "").split("|")[0]?.trim() || undefined,
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: "td:nth-child(4)",
        elementProcess: (element: HTMLElement) => (element.textContent ?? "").split("|")[1]?.trim() || undefined,
        filters: [{ name: "parseNumber" }],
      },
      completed: { selector: "td:nth-child(5) strong", filters: [{ name: "parseNumber" }] },
      tags: [{ name: "Free", selector: "a[href^='/details/id'][style='color:#f2b101']", color: "blue" }],
    },
  },

  detail: {
    urlPattern: ["/details/"],
    selectors: {
      link: { selector: "a[href*='download.php?']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/index.php" },
        selectors: {
          id: {
            selector: "a[href*='/user/']",
            attr: "href",
            filters: [(href: string) => href.split("/")[4] ?? ""],
          },
          name: { selector: "a[href*='/user/']" },
          messageCount: { selector: "#message_box > a > font", filters: [{ name: "parseNumber" }] },
          uploaded: {
            selector: "div.col-8.mb-4 > font[color='green']",
            elementProcess: (element: HTMLElement) => {
              const next = element.nextSibling;
              const text = next?.textContent ?? element.parentElement?.textContent ?? "";
              return text.trim() || undefined;
            },
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "div.col-8.mb-4 > font[color='darkred']",
            elementProcess: (element: HTMLElement) => {
              const next = element.nextSibling;
              const text = next?.textContent ?? element.parentElement?.textContent ?? "";
              return text.trim() || undefined;
            },
            filters: [{ name: "parseSize" }],
          },
          ratio: {
            selector: "div.col-8.mb-4 > font[color='#1900D1']",
            elementProcess: (element: HTMLElement) => {
              const next = element.nextSibling;
              const text = next?.textContent ?? "";
              return text.trim() || undefined;
            },
            filters: [{ name: "parseNumber" }],
          },
          bonus: { selector: "a.online[href='/mybonus.php']", filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/user/" },
        assertion: { id: "url" },
        selectors: {
          joinTime: {
            selector: "#profile_right > table.inlay > tbody > tr:nth-child(1) > td:nth-child(2)",
            elementProcess: (element: HTMLElement) => {
              let text = (element.textContent ?? "").split("(")[0].trim();
              for (const [ru, en] of Object.entries(ruMonths)) {
                text = text.replace(ru, en);
              }
              return text || undefined;
            },
            filters: [{ name: "parseTime", args: ["D MMMM YYYY"] }],
          },
          levelName: {
            selector: "#profile_left > table > tbody > tr > td:nth-child(2) > p:nth-child(1) > u > span",
          },
        },
      },
      {
        requestConfig: { url: "/bprate.php" },
        selectors: {
          seeding: { selector: "table.table:first > tbody > tr > td:nth-child(1)", filters: [{ name: "parseNumber" }] },
          seedingSize: {
            selector: "table.table:first > tbody > tr > td:nth-child(2)",
            filters: [{ name: "parseSize" }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "Power User" },
    { id: 3, name: "VIP" },
  ],
};
