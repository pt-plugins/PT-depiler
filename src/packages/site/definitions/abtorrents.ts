/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/abtorrents.me/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/abtorrents.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 */
import type { ISiteMetadata, ITorrent } from "../types";
import { ETorrentStatus } from "../types";
import { buildCategoryOptionsFromDict, parseSizeString } from "../utils";
import PrivateSite from "../schemas/AbstractPrivateSite";

// U-232 V4.5 分类，取自 Jackett 定义（PTPP 未提供分类表）
const categoryMap: Record<number, string> = {
  10: "有声书-动作与冒险",
  20: "有声书-传记与回忆录",
  30: "有声书-商业",
  40: "有声书-儿童",
  50: "有声书-幽默",
  70: "有声书-计算机",
  80: "有声书-成人情色",
  90: "有声书-奇幻（一般）",
  100: "有声书-奇幻（青少年）",
  130: "有声书-一般小说",
  140: "有声书-历史小说",
  150: "有声书-历史",
  160: "有声书-恐怖",
  170: "有声书-文学",
  175: "有声书-LitRPG",
  180: "有声书-悬疑",
  190: "有声书-非虚构",
  200: "有声书-广播剧",
  205: "有声书-参考与教育",
  207: "有声书-宗教与灵性",
  210: "有声书-言情",
  215: "有声书-超自然言情",
  220: "有声书-科学",
  230: "有声书-科幻",
  240: "有声书-科幻末世",
  250: "有声书-自我提升",
  260: "有声书-犯罪与惊悚",
  265: "有声书-体育与健身",
  270: "有声书-悬念",
  280: "有声书-脱口秀",
  285: "有声书-旅行",
  290: "有声书-都市奇幻与超自然",
  300: "有声书-西部",
  310: "有声书-青少年",
  400: "电子书-动作与冒险",
  410: "电子书-成人情色",
  420: "电子书-艺术与工艺",
  430: "电子书-传记与回忆录",
  435: "电子书-商业",
  450: "电子书-计算机学习",
  460: "电子书-烹饪",
  470: "电子书-犯罪与惊悚",
  480: "电子书-奇幻",
  490: "电子书-奇幻（青少年）",
  500: "电子书-一般小说",
  510: "电子书-历史小说",
  520: "电子书-历史与纪实",
  530: "电子书-恐怖",
  540: "电子书-幽默",
  560: "电子书-文学小说",
  565: "电子书-LitRPG",
  570: "电子书-悬疑",
  580: "电子书-非虚构",
  590: "电子书-超自然言情",
  600: "电子书-参考与教育",
  610: "电子书-宗教与灵性",
  620: "电子书-言情",
  630: "电子书-科幻",
  640: "电子书-科幻与末世",
  645: "电子书-科学",
  650: "电子书-自助",
  660: "电子书-体育与健身",
  665: "电子书-悬念",
  670: "电子书-旅行",
  690: "电子书-都市奇幻与超自然",
  700: "电子书-西部",
  710: "电子书-青少年",
  720: "电子书-儿童",
};

export const siteMetadata: ISiteMetadata = {
  id: "abtorrents",
  version: 1,
  name: "ABTorrents",
  aka: ["ABT"],
  description: "ABTorrents (ABT) is a Private Torrent Tracker for AUDIOBOOKS and EBOOKS",
  tags: ["电子书", "有声书"],
  timezoneOffset: "-0500",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["https://usefultrash.net/"],
  legacyUrls: ["https://abtorrents.me/", "https://abtorrents.xyz/"],

  category: [
    {
      name: "类别",
      key: "c",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "append" },
    },
    {
      name: "状态",
      key: "incldead",
      options: [
        { name: "仅活种", value: 0 },
        { name: "包含死种", value: 1 },
        { name: "仅死种", value: 2 },
      ],
    },
    {
      name: "仅免费",
      key: "only_free",
      options: [{ name: "仅免费种子", value: 1 }],
    },
  ],

  search: {
    requestConfig: {
      url: "/browse.php",
      params: {
        searchin: "title",
        incldead: 1,
        only_free: 0,
      },
    },
    keywordPath: "params.search",
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      rows: { selector: "table.browse.table.striped > tbody > tr:has(a[href^='download.php?torrent='])" },
      id: {
        selector: "a[href^='details.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: {
        selector: "a[href^='details.php?id=']",
        elementProcess: (element: HTMLElement) => {
          // 行内可能带 span.has-text-red 等标记，需要剔除
          const clone = element.cloneNode(true) as HTMLElement;
          clone.querySelectorAll("span").forEach((span) => span.remove());
          return (clone.textContent ?? "").trim() || undefined;
        },
      },
      url: { selector: "a[href^='details.php?id=']", attr: "href" },
      link: { selector: "a[href^='download.php?torrent=']", attr: "href" },
      category: {
        selector: "a[href^='browse.php?cat=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["cat"] }, (catId: string) => categoryMap[+catId] ?? catId],
      },
      size: { selector: "td:nth-last-child(4) div[title^='Size']" },
      seeders: { selector: "a[title$='Seeders']", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "a[title$='Leechers']", filters: [{ name: "parseNumber" }] },
      completed: { selector: "a[href^='snatches.php?id=']", filters: [{ name: "parseNumber" }] },
      time: {
        selector: ["td:nth-last-child(2) > div"],
        filters: [{ name: "parseFuzzyTime" }],
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: "td:nth-last-child(2) > div",
      },
      tags: [
        {
          name: "Free",
          selector: "tr.freeleech_color",
          color: "blue",
        },
      ],
    },
  },

  detail: {
    urlPattern: ["/details\\.php\\?id="],
    selectors: {
      link: { selector: "a[href^='download.php?torrent=']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/mybonus.php" },
        selectors: {
          id: {
            selector: "a[class*='user']",
            attr: "class",
            filters: [(value: string) => (value.match(/\d+/) ?? [""])[0]],
          },
          name: { selector: ".user" },
          levelName: { selector: "#slidingDiv > div:nth-child(2) > span.slide_b > b" },
          bonus: {
            selector: "thead > tr:first-child",
            elementProcess: (element: HTMLElement) => {
              const text = element.textContent ?? "";
              const match = text.match(/current (.*) ]/);
              return (match ? match[1] : text).trim() || undefined;
            },
          },
          uploaded: {
            selector: "#slidingDiv > div:nth-child(9) > span:nth-child(2)",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "#slidingDiv > div:nth-child(10) > span:nth-child(2)",
            filters: [{ name: "parseSize" }],
          },
          seeding: {
            selector: "#slidingDiv > div:nth-child(11) > span:nth-child(2)",
            filters: [{ name: "parseNumber" }],
          },
          leeching: {
            selector: "#slidingDiv > div:nth-child(12) > span:nth-child(2)",
            filters: [{ name: "parseNumber" }],
          },
          bonusPerHour: { selector: "tbody:nth-of-type(2) > tr:first-child > td:nth-child(2)" },
        },
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "params.id" },
        selectors: {
          joinTime: {
            selector: "#general > table > tbody > tr:nth-child(1) > td:nth-child(2)",
            filters: [{ name: "parseTime" }],
          },
          seedingSize: {
            selector: "div[id*='seeding'] > span",
            elementProcess: (element: HTMLElement) => {
              const match = (element.textContent ?? "").match(/:\s*(.*)/);
              return match ? parseSizeString(match[1]) : undefined;
            },
          },
        },
      },
    ],
  },

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "Power User", interval: "P4W", uploaded: "50GB", ratio: 1.2 },
    { id: 3, name: "Elite User", interval: "P12W", uploaded: "500GB", ratio: 1.5 },
  ],
};

export default class ABTorrents extends PrivateSite {
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    if (torrent.link) {
      return torrent.link;
    }

    const id = torrent.id ?? (torrent.url ?? "").match(/[?&]id=(\d+)/)?.[1];
    return id ? `${this.url}download.php?torrent=${id}` : super.getTorrentDownloadLink(torrent);
  }
}
