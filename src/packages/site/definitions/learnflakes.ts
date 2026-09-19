/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/learnflakes.net/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/learnflakes.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 站点为 TSUE 2.2 系模板。Jackett 注释说明其登录页带 Cloudflare Turnstile，
 * 故 Jackett 采用 Cookie 方式登录；PTD 沿用浏览器 cookie 会话，无需额外处理。
 */
import type { ISiteMetadata } from "../types";

const categoryMap: Record<number, string> = {
  1: "LearnFlakes",
  14: "EMC",
  16: "SANS",
  17: "MOC",
  31: "CareerAcademy",
  32: "CBTNuggets",
  33: "INE",
  34: "Symantec",
  35: "Infiniteskills",
  36: "IPExpert",
  37: "Tuts+",
  38: "Pluralsight",
  39: "电子书",
  40: "CBT 视频",
  41: "Linux-CBT",
  42: "VTC",
  43: "Lynda",
  44: "TrainSignal",
  45: "其他",
  46: "LF VIP",
  47: "健康",
  48: "杂志",
  49: "课件",
  50: "LiveLessons",
  51: "编程",
  52: "图形与设计",
  53: "Udemy",
  54: "SAP",
  55: "独家",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "learnflakes",
  name: "LearnFlakes",
  description:
    "LearnFlakes is a Private Torrent Tracker for CERTIFICATE / TRAINING E-LEARNING（IT 认证与在线培训课程）",
  tags: ["学习"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://learnflakes.net/"],

  category: [
    {
      name: "类别",
      key: "cid",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "brackets" },
    },
    {
      name: "仅免费",
      key: "freeleech",
      options: [{ name: "仅免费种子", value: 1 }],
      cross: { mode: "append", key: "" },
    },
  ],

  search: {
    requestConfig: {
      url: "/",
      params: {
        p: "torrents",
        pid: 10,
        search_type: "name",
      },
    },
    keywordPath: "params.keywords",
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "div.torrent-box[id^='torrent_']" },
      id: {
        selector: "a[href*='action=details&tid=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["tid"] }],
      },
      title: { selector: "a[href*='action=details&tid=']" },
      url: { selector: "a[href*='action=details&tid=']", attr: "href" },
      link: { selector: "a[href*='action=download&tid=']", attr: "href" },
      category: {
        selector: "a[href*='cid=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["cid"] }, (cid: string) => categoryMap[+cid] ?? cid],
      },
      size: { selector: "a[rel='torrent_size']" },
      seeders: { selector: "a[rel='torrent_seeders']", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "a[rel='torrent_leechers']", filters: [{ name: "parseNumber" }] },
      completed: { selector: "a[rel='times_completed']", filters: [{ name: "parseNumber" }] },
      time: {
        selector: ".torrentOwner",
        elementProcess: (element: HTMLElement) => {
          const match = (element.textContent ?? "").match(/Uploaded\s+(.+?)\s+by/);
          return match ? match[1] : undefined;
        },
        filters: [{ name: "parseFuzzyTime", args: ["DD-MM-YYYY HH:mm"] }],
      },
      tags: [{ name: "Free", selector: "img[src$='/torrent_free.png']", color: "blue" }],
    },
  },

  detail: {
    urlPattern: ["/\\?p=torrents&pid=10&action=details&tid="],
    selectors: {
      link: { selector: "a[href*='action=download&tid=']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/?p=home&pid=1" },
        selectors: {
          id: {
            selector: "#sidebar a[href*='profile']",
            attr: "href",
            filters: [{ name: "querystring", args: ["memberid"] }],
          },
          name: { selector: "#sidebar a[href*='profile']" },
          messageCount: {
            selector: "a.a.showmenu.new",
            filters: [{ name: "parseNumber" }],
          },
          bonus: { selector: ".showStats a[href*='p=market']", filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/" },
        assertion: { id: "params.memberid" },
        requestConfigTransformer: (config, lastUserInfo: any) => {
          config.params = { ...(config.params ?? {}), p: "profile", pid: 18, memberid: lastUserInfo.id };
          return config;
        },
        selectors: {
          levelName: { selector: ".memberCardDetails > span" },
          uploaded: {
            selector: "#memberinfoUpDownStats",
            elementProcess: (element: HTMLElement) => (element.textContent ?? "").split("\n")[0]?.trim() || undefined,
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "#memberinfoUpDownStats",
            elementProcess: (element: HTMLElement) => (element.textContent ?? "").split("\n")[1]?.trim() || undefined,
            filters: [{ name: "parseSize" }],
          },
          joinTime: {
            selector: "div.memberCardDetails",
            elementProcess: (element: HTMLElement) => {
              const lines = (element.textContent ?? "")
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean);
              return lines[0] || undefined;
            },
            filters: [{ name: "parseTime", args: ["DD-MM-YYYY HH:mm"] }],
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
