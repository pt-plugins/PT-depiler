/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/www.trancetraffic.com/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/trancetraffic.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 */
import type { ISiteMetadata } from "../types";

const categoryMap: Record<number, string> = {
  5: "DVD/视频/短片",
  6: "TranceTraffic 合辑",
  10: "业余",
  12: "现场-迷幻 Trance",
  14: "现场-Techno",
  16: "现场-House",
  17: "现场-Hardstyle",
  18: "现场-其他",
  19: "单曲-Trance",
  20: "单曲-Techno",
  21: "单曲-House",
  22: "单曲-Hardstyle",
  23: "单曲-其他",
  24: "专辑-Trance",
  25: "单曲-迷幻 Trance",
  26: "专辑-Hardstyle",
  27: "专辑-Techno",
  28: "专辑-迷幻 Trance",
  29: "专辑-Hardcore",
  32: "单曲-Hardcore",
  35: "专辑-Dance",
  36: "单曲-Dance",
  37: "现场-迷幻 Trance",
  38: "专辑-House",
  39: "专辑-其他",
  40: "氛围/Chill/Lo-Fi",
  41: "Drum & Bass/Jungle",
  42: "Beat/Breaks",
  43: "电子",
  45: "音乐插件/应用/杂项",
  46: "非 scene 发布",
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "trancetraffic",
  name: "TranceTraffic",
  description: "TranceTraffic is a Private Torrent Tracker for MUSIC（Trance 电子音乐）",
  tags: ["音乐"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://www.trancetraffic.com/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "brackets" },
    },
    {
      name: "仅免费",
      key: "includeFL",
      options: [{ name: "仅免费种子", value: "on" }],
    },
  ],

  search: {
    requestConfig: {
      url: "/browse.php",
    },
    keywordPath: "params.search",
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "table.mainouter table > tbody > tr:has(a[href^='details.php?id='])" },
      id: {
        selector: "a[href^='details.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: { selector: "a[href^='details.php?id=']" },
      url: { selector: "a[href^='details.php?id=']", attr: "href" },
      link: { selector: "a[href^='download.php/']", attr: "href" },
      category: { selector: "img", attr: "alt" },
      size: { selector: "td:nth-child(7)" },
      seeders: { selector: "td:nth-child(9)", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td:nth-child(10)", filters: [{ name: "parseNumber" }] },
      completed: {
        selector: "td:nth-child(8)",
        elementProcess: (element: HTMLElement) => (element.textContent ?? "").replace(/times/i, "").trim() || undefined,
        filters: [{ name: "parseNumber" }],
      },
      author: { selector: "td:nth-child(11)" },
      time: {
        selector: "td:nth-child(6)",
        filters: [{ name: "parseTime", args: ["yyyy-MM-ddHH:mm:ss"] }],
      },
      tags: [{ name: "Free", selector: "span:contains('FREELEECH')", color: "blue" }],
    },
  },

  detail: {
    urlPattern: ["/details\\.php\\?id="],
    selectors: {
      link: { selector: "td.heading:contains('Download') + td > a", attr: "href" },
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
          uploaded: {
            selector: "span:contains('Uploaded:') + span",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "span:contains('Downloaded:') + span",
            filters: [{ name: "parseSize" }],
          },
          ratio: { selector: "span:contains('Ratio:') + span", filters: [{ name: "parseNumber" }] },
          seeding: { selector: "img[alt='Torrents seeding'] + span", filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/userdetails.php", params: { sdlist: 1 } },
        assertion: { id: "params.id" },
        selectors: {
          levelName: { selector: "td.rowhead:contains('Class') + td" },
          joinTime: {
            selector: "td.rowhead:contains('Join date') + td",
            elementProcess: (element: HTMLElement) => (element.textContent ?? "").split(" (")[0].trim() || undefined,
            filters: [{ name: "parseTime" }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    { id: 1, name: "User" },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      uploaded: "25GB",
      ratio: 1.05,
      privilege: "可查看 ReadMe 文件。",
    },
  ],
};
