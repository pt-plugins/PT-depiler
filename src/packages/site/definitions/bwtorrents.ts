/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/bwtorrents.tv/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/bwtorrents.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 */
import type { ISiteMetadata } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite";

// 站点分类非常多（U-232/AEON 系），此处只列出常用的影视主分类；其余分类可由用户在站点内筛选
const categoryMap: Record<number, string> = {
  113: "宝莱坞-抢鲜版",
  114: "宝莱坞-4K Ultra HD",
  115: "宝莱坞-原盘 BluRay",
  116: "宝莱坞-1080p BluRay",
  117: "宝莱坞-720p BluRay",
  118: "宝莱坞-Remux",
  119: "宝莱坞-WEB-DL 原盘",
  120: "宝莱坞-1080p WEB",
  121: "宝莱坞-DVD 原盘",
  122: "宝莱坞-DVDRip",
  123: "宝莱坞-SDRip",
  124: "宝莱坞-3D",
  125: "宝莱坞-网络剧",
  126: "好莱坞-4K Ultra HD",
  127: "好莱坞-原盘 BluRay",
  128: "好莱坞-1080p BluRay",
  129: "好莱坞-720p BluRay",
  130: "好莱坞-BluRay Remux",
  131: "好莱坞-WEB-DL 原盘",
  132: "好莱坞-1080p WEB",
  133: "好莱坞-DVD 原盘",
  134: "好莱坞-DVDRip",
  135: "好莱坞-3D",
  136: "好莱坞-抢鲜版",
  137: "马拉雅拉姆语电影",
  140: "旁遮普语电影",
  141: "卡纳达语电影",
  142: "拉莱坞电影",
  143: "博杰普尔语电影",
  144: "马拉地语电影",
  145: "孟加拉语电影",
  146: "电视剧-Colors",
  147: "电视剧-综合",
  148: "电视剧-Life OK",
  149: "电视剧-巴基斯坦剧",
  150: "电视剧-Sab TV",
  151: "电视剧-Sony",
  152: "电视剧-Star Bharat",
  153: "电视剧-Star Plus",
  154: "电视剧-Zee TV",
  155: "电视剧-体育",
  156: "电视剧-纪录片",
  157: "电视剧-好莱坞剧集",
  158: "电视剧-其他剧集",
  175: "电子书",
  176: "游戏-PC",
  177: "游戏-主机",
  178: "动漫",
  179: "软件",
  180: "移动端资源",
  187: "成人",
  190: "宝莱坞-合集",
  194: "好莱坞-合集",
  195: "电视剧-合集",
};

export const siteMetadata: ISiteMetadata = {
  id: "bwtorrents",
  version: 1,
  name: "BWT",
  aka: ["BwTorrents"],
  description: "BwTorrents (BWT) is an INDIAN Private Torrent Tracker for MOVIES / TV",
  tags: ["综合", "印度"],
  timezoneOffset: "+0530",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://bwtorrents.tv/"],
  legacyUrls: ["https://bwtorrents.cc/", "https://bwtorrents.xyz/", "https://bwtorrents.us/"],

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
        { name: "全部", value: 1 },
        { name: "仅死种", value: 2 },
        { name: "仅免费", value: 3 },
      ],
    },
    {
      name: "搜索范围",
      key: "blah",
      options: [
        { name: "仅标题", value: 0 },
        { name: "仅描述", value: 1 },
        { name: "标题+描述", value: 2 },
      ],
    },
  ],

  search: {
    requestConfig: {
      url: "/index.php",
      params: {
        blah: 0,
        incldead: 1,
      },
    },
    keywordPath: "params.search",
    skipNonLatinCharacters: true,
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "table[width='1200'] > tbody > tr:has(a[href^='download.php/'])" },
      id: {
        selector: "a[href^='details.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: "a[href^='details.php?id='] b" },
      url: { selector: "a[href^='details.php?id=']", attr: "href" },
      link: { selector: "a[href^='download.php/']", attr: "href" },
      category: {
        selector: "a[href^='index.php?cat=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["cat"] }, (catId: string) => categoryMap[+catId] ?? catId],
      },
      time: {
        selector: "td:nth-child(5)",
        filters: [{ name: "parseTime", args: ["dd-MM-yyyyHH:mm:ss"] }],
      },
      size: { selector: "td:nth-child(6)" },
      seeders: { selector: "td:nth-child(8)" },
      leechers: { selector: "td:nth-child(9)" },
      completed: { selector: "td:nth-child(9)" },
      tags: [
        {
          name: "Free",
          selector: "font[color='red']:contains('[FreeLeech]')",
          color: "blue",
        },
      ],
    },
  },

  detail: {
    urlPattern: ["/details\\.php\\?id="],
    selectors: {
      link: { selector: "a[href^='download.php/']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/index.php" },
        selectors: {
          id: {
            selector: "a[href*='userdetails.php']",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "a[href*='userdetails.php']" },
        },
      },
      {
        requestConfig: { url: "/userdetailsmore.php" },
        assertion: { id: "params.id" },
        selectors: {
          uploaded: {
            selector: "td.rowhead:contains('Uploaded') + td",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "td.rowhead:contains('Downloaded') + td",
            filters: [{ name: "parseSize" }],
          },
          levelName: { selector: "td.rowhead:contains('Class') + td" },
          joinTime: {
            selector: "td.rowhead:contains('Join') + td",
            elementProcess: (element: HTMLElement) => (element.textContent ?? "").split(" (")[0].trim() || undefined,
            filters: [{ name: "parseTime" }],
          },
          seeding: { selector: "img[title='Torrents seeding'] + font span" },
          bonus: { selector: "a[title='Bonus Points'] font", filters: [{ name: "parseNumber" }] },
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
