import { type ISiteMetadata } from "../types";
import { GB, TB } from "../utils";

const categoryMap: Record<number, string> = {
  1000: "电影",
  1010: "电影-原盘",
  1015: "电影-无损提取",
  1020: "电影-重编码",
  1025: "电影-WEB",
  1030: "电影-TV",
  1033: "电影-DVD",
  1035: "电影-其他",
  1200: "剧集",
  1210: "剧集-亚洲合集",
  1215: "剧集-欧美合集",
  1220: "剧集-其他合集",
  1225: "剧集-亚洲剧",
  1230: "剧集-欧美剧",
  1235: "剧集-其他",
  1400: "音乐",
  1401: "音乐-欧美",
  1402: "音乐-华语",
  1403: "音乐-日韩",
  1404: "音乐-MV",
  1405: "音乐-古典",
  1406: "音乐-原声",
  1600: "动漫",
  1610: "动漫-连载",
  1615: "动漫-完结",
  1620: "动漫-剧场",
  1625: "动漫-OVA/OAD",
  1630: "动漫-演唱会",
  1635: "动漫-漫画",
  1640: "动漫-轻小说",
  1645: "动漫-周边",
  1800: "游戏",
  1801: "游戏-PC",
  1802: "游戏-主机",
  1803: "游戏-周边",
  1804: "游戏-视频",
  2000: "节目",
  2001: "节目-体育",
  2002: "节目-综艺",
  2003: "节目-专题",
  2010: "节目-纪录片",
  2200: "书籍",
  2400: "软件",
  2600: "学习",
  2601: "学习-计算机",
  2602: "学习-外语",
  2603: "学习-考研",
  2604: "学习-课件",
  2605: "学习-视频",
  2800: "其他",
  2801: "其他-视频",
  2802: "其他-音频",
  2803: "其他-图片",
  2804: "其他-文档",
  2805: "其他-播种机",
};

export const siteMetadata: ISiteMetadata = {
  id: "bitpt",
  version: 1,

  name: "极速之星",
  description: "极速之星IPV6资源交流平台",
  tags: ["教育网", "综合", "影视"],
  timezoneOffset: "+0800",

  collaborator: ["RogerYong"],

  type: "private",

  urls: ["uggcf://ovgcg.pa/"],

  favicon: "./bitpt.ico",

  category: [
    {
      name: "分类",
      key: "c",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "append" },
    },
    {
      name: "筛选",
      key: "t",
      options: [
        { name: "全部", value: "" },
        { name: "免费", value: "free" },
        { name: "置顶", value: "top" },
        { name: "推荐", value: "recommend" },
        { name: "官方", value: "BiTV" },
        { name: "保种", value: "conservation" },
        { name: "热门", value: "week" },
        { name: "收藏", value: "myfav" },
        { name: "禁转", value: "reproduction" },
      ],
      cross: false,
    },
    {
      name: "种子状态",
      key: "st",
      options: [
        { name: "全部", value: 2 },
        { name: "活动种子", value: 1 },
        { name: "死种", value: 0 },
      ],
      cross: false,
    },
  ],

  search: {
    keywordPath: "params.s",
    requestConfig: {
      url: "/browse.php",
      params: { st: 2 },
    },
    selectors: {
      rows: { selector: "table.torrenttable > tbody > tr:has(a[href^='details.php?tid='])" },
      category: {
        selector: "a[href*='browse.php?c=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["c"] }, (v: string) => categoryMap[Number(v)] ?? v],
      },
      title: {
        selector: "a[href^='details.php?tid=']",
        elementProcess: (element) => {
          // bitpt 的标题区有 3 种结构：
          // 1. 未启用副标题：标题完全是 a 的纯文本
          // 2. 启用副标题，中英同行：中英标题都在 span.t_t，说明在 span.t_t_d_n
          // 3. 启用副标题，中英双行：英文在 span.t_t，中文在 span.t_t_c / span.t_t_c_c，说明在 span.t_t_d
          const container = element.parentElement ?? element;
          const titleNodes = Array.from(element.querySelectorAll("span.t_t"))
            .map((node) => (node as HTMLElement).innerText.trim())
            .filter(Boolean);
          const chineseTitle = Array.from(container.querySelectorAll("span.t_t_c, span.t_t_c_c"))
            .map((node) => (node as HTMLElement).innerText.trim())
            .filter(Boolean)
            .join(" ");
          const hasInlineSubTitle = !!container.querySelector("span.t_t_d_n");
          const hasSplitSubTitle = !!container.querySelector("span.t_t_d");

          // 情况 1：启用副标题，中英同行
          // 两段标题都在 span.t_t 中，且通常已经自带 []
          if (hasInlineSubTitle) {
            return titleNodes.join("");
          }

          // 情况 2：启用副标题，中英双行
          // 英文标题在 span.t_t，中文标题在 span.t_t_c / span.t_t_c_c
          if (hasSplitSubTitle) {
            const englishTitle = titleNodes.join(" ");
            // 个别条目可能只有英文标题，此时直接回退为英文，不强行补出 [英文]
            if (!chineseTitle) {
              return englishTitle || (element.innerText ?? element.textContent ?? "").trim();
            }

            return [chineseTitle, englishTitle]
              .filter(Boolean)
              .map((text) => (/^\[.*\]$/.test(text) ? text : `[${text}]`))
              .join("");
          }

          // 情况 3：未启用副标题，标题完全是 a 的纯文本
          return (element.innerText ?? element.textContent ?? "").trim();
        },
      },
      subTitle: {
        selector: "> td:nth-child(2)",
        elementProcess: (element) => {
          return Array.from(element.querySelectorAll("span.t_t_d, span.t_t_d_n"))
            .map((node) => (node as HTMLElement).innerText.trim())
            .filter(Boolean)
            .join(" ");
        },
        filters: [
          (q: string) =>
            q
              .replace(/\*\*/g, "")
              .replace(/^\s*\*\s*|\s*\*\s*$/g, "")
              .trim(),
        ],
      },
      url: {
        selector: "a[href^='details.php?tid=']",
        attr: "href",
      },
      id: {
        selector: "a[href^='details.php?tid=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["tid"] }],
      },
      link: {
        selector: "a[href^='download.php?tid=']:not([href*='ssl'])",
        attr: "href",
      },
      size: {
        selector: "> td:nth-child(4)",
        filters: [(q: string) => q.trim().replace(/([KMGTPEZ])$/i, "$1B"), { name: "parseSize" }],
      },
      seeders: {
        selector: "> td:nth-child(5)",
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: "> td:nth-child(6)",
        filters: [{ name: "parseNumber" }],
      },
      completed: {
        selector: "> td:nth-child(7)",
        filters: [{ name: "parseNumber" }],
      },
      comments: {
        selector: "> td:nth-child(3)",
        filters: [{ name: "parseNumber" }],
      },
      author: {
        selector: "> td:nth-child(8) span.o_n a",
      },
      time: {
        selector: "> td:nth-child(8) p.add_t",
        filters: [{ name: "parseTime", args: ["yyyy-MM-dd HH:mm"] }],
      },
      tags: [
        { name: "Free", selector: "img[src*='tags/free']", color: "#00a2e8" },
        { name: "50%", selector: "img[src*='tags/50p']", color: "#b58900" },
        { name: "30%", selector: "img[src*='tags/30p']", color: "#b58900" },
        { name: "1.3x上传", selector: "img[src*='tags/u1.3']", color: "#c08400" },
        { name: "1.4x上传", selector: "img[src*='tags/u1.4']", color: "#c08400" },
        { name: "1.5x上传", selector: "img[src*='tags/u1.5']", color: "#c08400" },
        { name: "1.6x上传", selector: "img[src*='tags/u1.6']", color: "#c08400" },
        { name: "1.7x上传", selector: "img[src*='tags/u1.7']", color: "#c08400" },
        { name: "置顶", selector: "img[src*='tags/top']", color: "#d35400" },
        { name: "保种", selector: "img[src*='tags/conservation']", color: "#299b00" },
        { name: "禁转", selector: "img[src*='tags/reproduction']", color: "#d40000" },
        { name: "官方", selector: "img[src*='tags/bitv']", color: "#a7238c" },
        { name: "推荐", selector: "img[src*='tags/recommend']", color: "#0891b2" },
      ],
    },
  },

  detail: {
    urlPattern: ["/forum\\.php\\?mod=viewthread&tid=(\\d+)"],
    selectors: {
      title: { selector: "h1.ts span#thread_subject" },
      link: {
        selector: "a[href*='download.php?tid=']:not([href*='ssl'])",
        attr: "href",
      },
      id: {
        selector: "a[href*='download.php?tid=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["tid"] }],
      },
    },
  },

  noLoginAssert: {
    matchSelectors: ['a[href*="login_pt.php"]'],
  },

  userInfo: {
    pickLast: ["id", "joinTime"],
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        selectors: {
          id: {
            selector: ["#userinfotop a[href*='userdetails.php?uid=']:first", "a[href*='userdetails.php?uid=']:first"],
            attr: "href",
            filters: [{ name: "querystring", args: ["uid"] }],
          },
          name: {
            selector: ["#userinfotop a[href*='userdetails.php?uid=']:first", "a[href*='userdetails.php?uid=']:first"],
          },
        },
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.uid" },
        selectors: {
          uploaded: {
            selector: "td.lefttdud:contains('上传流量') + td",
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: "td.lefttdud:contains('下载流量') + td",
            filters: [{ name: "parseSize" }],
          },
          ratio: {
            selector: "td.lefttdud:contains('共享率') + td",
            filters: [{ name: "parseNumber" }],
          },
          bonus: {
            selector: "td.lefttdud:contains('星辰') + td",
            filters: [
              (query: string) => {
                const match = query.match(/累计([\d.]+)/);
                return match ? parseFloat(match[1]) : 0;
              },
            ],
          },
          levelName: {
            selector: "td.lefttdud:contains('用户级别') + td",
          },
          joinTime: {
            selector: "td.lefttdud:contains('注册时间') + td",
            filters: [{ name: "parseTime" }],
          },
          lastAccessAt: {
            selector: "td.lefttdud:contains('最后访问时间(IPv4)') + td",
            filters: [{ name: "parseTime" }],
          },
          invites: {
            selector: "td.lefttdud:contains('邀请数目') + td",
            filters: [{ name: "parseNumber" }],
          },
          uploads: {
            selector: "td.lefttdud:contains('发种次数') + td",
            filters: [{ name: "parseNumber" }],
          },
          seeding: {
            selector: "a[href*='seedtype=seeding']",
            filters: [
              (query: string) => {
                const match = query.match(/(\d+)个/);
                return match ? parseInt(match[1]) : 0;
              },
            ],
          },
          seedingSize: {
            selector: "a[href*='seedtype=seeding']",
            filters: [
              (query: string) => {
                const match = query.match(/共([\d.]+ ?[TGMKZEP]?i?B)/);
                return match ? match[1] : "0";
              },
              { name: "parseSize" },
            ],
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 0,
      groupType: "user",
      name: "Lv0. 村里没网",
      privilege: "被封禁用户，该等级只能下载免费种子，不能下载普通种子",
    },
    {
      id: 1,
      groupType: "user",
      name: "Lv1. 拨号上网",
      privilege: "新注册用户的默认等级",
    },
    {
      id: 2,
      groupType: "user",
      name: "Lv2. 十兆宽带",
      uploaded: 23 * GB,
      downloaded: 10 * GB,
      ratio: 1.3,
    },
    {
      id: 3,
      groupType: "user",
      name: "Lv3. 百兆宽带",
      uploaded: 111 * GB,
      downloaded: 10 * GB,
      ratio: 1.55,
    },
    {
      id: 4,
      groupType: "user",
      name: "Lv4. 千兆宽带",
      uploaded: 520 * GB,
      downloaded: 15 * GB,
      ratio: 2.05,
    },
    {
      id: 5,
      groupType: "user",
      name: "Lv5. 校园核心网",
      uploaded: 1314 * GB,
      downloaded: 15 * GB,
      ratio: 2.3,
    },
    {
      id: 6,
      groupType: "user",
      name: "Lv6. 城域骨干网",
      uploaded: 2333 * GB,
      downloaded: 20 * GB,
      ratio: 2.55,
    },
    {
      id: 7,
      groupType: "user",
      name: "Lv7. 国际互联网",
      uploaded: 6666 * GB,
      downloaded: 20 * GB,
      ratio: 3.05,
    },
    {
      id: 8,
      groupType: "user",
      name: "Lv8. 万物互通网",
      uploaded: 10 * TB,
      downloaded: 30 * GB,
      ratio: 3.55,
      privilege: "本级最大容纳150人，日均上传排名全站TOP250；附加条件：日均上传流量>=10GB且一年内有登录",
    },
    {
      id: 9,
      groupType: "user",
      name: "Lv9. 星际量子网",
      uploaded: 20 * TB,
      downloaded: 40 * GB,
      ratio: 4.05,
      privilege: "本级最大容纳70人，日均上传排名全站TOP100；附加条件：日均上传流量>=15GB且一年内有登录",
    },
    {
      id: 10,
      groupType: "user",
      name: "Lv10. 极速之网",
      uploaded: 30 * TB,
      downloaded: 50 * GB,
      ratio: 4.55,
      privilege: "本级最大容纳30人，日均上传排名全站TOP30；附加条件：日均上传流量>=20GB且一年内有登录",
    },
  ],
};
