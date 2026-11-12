/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/IPTorrents.cs
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/iptorrents.com/config.json
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/ipt.json
 */
import {
  type IAdvancedSearchRequestConfig,
  type ISearchCategories,
  type ISiteMetadata,
  type TSelectSearchCategoryValue,
} from "../types";
import { parseTimeToLiveToDate } from "../utils";
import { set } from "es-toolkit/compat";

const categoryPart: Pick<ISearchCategories, "cross" | "generateRequestConfig"> = {
  cross: { mode: "custom" },
  generateRequestConfig: (value: TSelectSearchCategoryValue): IAdvancedSearchRequestConfig => {
    const ret = { requestConfig: { params: {} } };
    (value as string[]).forEach((v) => {
      set(ret, `requestConfig.params.${v}`, "");
    });
    return ret as IAdvancedSearchRequestConfig;
  },
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "iptorrents",
  name: "IPTorrents",
  aka: ["IPT"],
  description: "IPTorrents - #1 Private Tracker",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["uggcf://vcgbeeragf.pbz/"],

  category: [
    {
      name: "Category/Main",
      key: "category_main",
      notes: "For Movies, TV, Games, Music, Miscellaneous, XXX , you dont need to select subcategories.",
      options: [
        { name: "Movies", value: 72 },
        { name: "TV", value: 73 },
        { name: "Games", value: 74 },
        { name: "Music", value: 75 },
        { name: "Miscellaneous", value: 76 },
        { name: "XXX", value: 88 },
        { name: "Bookmarks", value: "bookmarks" },
        { name: "Subscriptions", value: "subscriptions" },
        { name: "Freeleech", value: "free" },
        { name: "New", value: "new" },
        { name: "Staff Picks", value: "pinned" },
        { name: "Top of the Day", value: "top-of-the-day" },
        { name: "Top of the Week", value: "top" },
        { name: "Top of the Month", value: "top-of-the-month" },
        { name: "Top of the Quarter", value: "top-of-the-quarter" },
        { name: "Top of the Year", value: "top-of-the-year" },
        { name: "720p", value: "720p" },
        { name: "1080p", value: "1080p" },
        { name: "2160p", value: "2160p" },
      ],
      ...categoryPart,
    },
    {
      name: "Category/Movies",
      key: "category_movies",
      options: [
        { name: "Movie/3D", value: 87 },
        { name: "Movie/480p", value: 77 },
        { name: "Movie/4K", value: 101 },
        { name: "Movie/BD-R", value: 89 },
        { name: "Movie/BD-Rip", value: 90 },
        { name: "Movie/Cam", value: 96 },
        { name: "Movie/DVD-R", value: 6 },
        { name: "Movie/HD/Bluray", value: 48 },
        { name: "Movie/Kids", value: 54 },
        { name: "Movie/MP4", value: 62 },
        { name: "Movie/Non-English", value: 38 },
        { name: "Movie/Packs", value: 68 },
        { name: "Movie/Web-DL", value: 20 },
        { name: "Movie/x265", value: 100 },
        { name: "Movie/Xvid", value: 7 },
      ],
      ...categoryPart,
    },
    {
      name: "Category/TV",
      key: "category_tv",
      options: [
        { name: "Documentaries", value: 26 },
        { name: "Sports", value: 55 },
        { name: "TV/480p", value: 78 },
        { name: "TV/BD", value: 23 },
        { name: "TV/DVD-R", value: 24 },
        { name: "TV/DVD-Rip", value: 25 },
        { name: "TV/Mobile", value: 66 },
        { name: "TV/Non-English", value: 82 },
        { name: "TV/Packs", value: 65 },
        { name: "TV/Packs/Non-English", value: 83 },
        { name: "TV/SD/x264", value: 79 },
        { name: "TV/Web-DL", value: 22 },
        { name: "TV/x264", value: 5 },
        { name: "TV/x265", value: 99 },
        { name: "TV/Xvid", value: 4 },
      ],
      ...categoryPart,
    },
    {
      name: "Category/Games",
      key: "category_games",
      options: [
        { name: "Games/Mixed", value: 2 },
        { name: "Games/Nintendo", value: 47 },
        { name: "Games/PC-ISO", value: 43 },
        { name: "Games/PC-Rip", value: 45 },
        { name: "Games/Playstation", value: 71 },
        { name: "Games/Wii", value: 50 },
        { name: "Games/Xbox", value: 44 },
      ],
      ...categoryPart,
    },
    {
      name: "Category/Music",
      key: "category_music",
      options: [
        { name: "Music/Audio", value: 3 },
        { name: "Music/Flac", value: 80 },
        { name: "Music/Packs", value: 93 },
        { name: "Music/Video", value: 37 },
        { name: "Podcast", value: 21 },
      ],
      ...categoryPart,
    },
    {
      name: "Category/Miscellaneous",
      key: "category_miscellaneous",
      options: [
        { name: "Anime", value: 60 },
        { name: "Appz", value: 1 },
        { name: "Appz/Non-English", value: 86 },
        { name: "AudioBook", value: 64 },
        { name: "Books", value: 35 },
        { name: "Books/Non-English", value: 102 },
        { name: "Comics", value: 94 },
        { name: "Educational", value: 95 },
        { name: "Fonts", value: 98 },
        { name: "Mac", value: 69 },
        { name: "Magazines / Newspapers", value: 92 },
        { name: "Mobile", value: 58 },
        { name: "Pics/Wallpapers", value: 36 },
      ],
      ...categoryPart,
    },
    {
      name: "Category/XXX",
      key: "category_xxx",
      options: [
        { name: "XXX/Magazines", value: 85 },
        { name: "XXX/Movie", value: 8 },
        { name: "XXX/Movie/0Day", value: 81 },
        { name: "XXX/Packs", value: 91 },
        { name: "XXX/Pics/Wallpapers", value: 84 },
      ],
      ...categoryPart,
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: { url: "/t" },
    requestDelay: 1000,
    selectors: {
      rows: {
        selector: ["table#torrents > tbody > tr:has(td.al)"],
      },
      id: {
        selector: " > td.al > a",
        attr: "href",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/\/t\/(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : "";
          },
        ],
      },
      title: { selector: " > td.al > a" },
      subTitle: {
        selector: "div.sub",
        filters: [
          (query: string) => {
            if (/ \| /.test(query)) {
              return query.split(" | ")[0];
            }
            return "";
          },
        ],
      },
      url: { selector: " > td.al > a", attr: "href" },
      link: { selector: 'a[href*="/download.php"]', attr: "href" },
      time: {
        selector: "div.sub",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(?:\| )?([\d.]+ .+? ago)/);
            return queryMatch && queryMatch.length >= 2 ? parseTimeToLiveToDate(queryMatch[1]) : "";
          },
        ],
      },
      size: {
        selector: ["> td:nth-child(6)", "td:contains('MB')", "td:contains('GB')", "td:contains('TB')"],
        filters: [{ name: "parseSize" }],
      },
      author: {
        selector: "div.sub",
        filters: [
          (query: string) => {
            if (query.includes(" by ")) {
              const queryMatch = query.match(/by (.+)$/);
              return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : "";
            }
            return "";
          },
        ],
      },
      category: { selector: ["td:eq(0) img", "td:first-child img"], attr: "alt" },
      seeders: {
        selector: ["td:nth-last-child(2)", "td:contains('seeders')", "td.seeders"],
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: ["td:nth-last-child(1)", "td:contains('leechers')", "td.leechers"],
        filters: [{ name: "parseNumber" }],
      },
      completed: {
        selector: ["td:nth-last-child(3)", "td:contains('snatched')", "td.completed"],
        filters: [{ name: "parseNumber" }],
      },
      comments: {
        selector: "> td:nth-child(5)",
        filters: [(q: string) => q.replace(/Go ?to ?comments/, "")],
      },
      tags: [{ name: "Free", selector: "span.free, span.t_tag_free_leech" }],
    },
  },

  list: [
    {
      urlPattern: ["/t"],
      excludeUrlPattern: ["/t/\\d+", "/torrent\\.php\\?id=\\d+"],
      selectors: {
        title: {
          selector: " > td.al > a",
          elementProcess: (el: HTMLElement) => {
            el.querySelectorAll("div.tTip").forEach((e) => e.remove());
            return el.innerText || el.textContent;
          },
        },
      },
    },
    {
      urlPattern: ["/indexipt\\.php"],
      selectors: {
        size: {
          selector: "div.ar.c3",
          filters: [{ name: "split", args: ["|", 0] }, { name: "trim" }, { name: "parseSize" }],
        },
        time: {
          selector: "span.elapsedDate",
          attr: "title",
          filters: [{ name: "parseTime", args: ["EEEE, MMMM d, yyyy 'at' h:mmaa"] }],
        },
        seeders: { selector: "> td:nth-child(5)" },
        leechers: { selector: "> td:nth-child(6)" },
        completed: { selector: "> td:nth-child(7)" },
        comments: { selector: "> td:nth-child(8)" },
        // TODO category 需要映射类型编号
      },
    },
  ],

  detail: {
    urlPattern: ["/t/\\d+", "/torrent\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: "div.dBox > h2" },
      link: { selector: "div.info a[href*='download.php']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/" },
        selectors: {
          id: {
            selector: ["a[href*='/u/']:first", "a[href*='userdetails.php']:first"],
            attr: "href",
            switchFilters: {
              "a[href*='/u/']:first": [
                (query: string) => {
                  const queryMatch = query.match(/u\/(.+)/);
                  return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : "";
                },
              ],
              "a[href*='userdetails.php']:first": [{ name: "querystring", args: ["id"] }],
            },
          },
        },
      },
      {
        requestConfig: { url: "/user.php" },
        assertion: { id: "params.u" },
        // 2026-11 站点资料页改版（upf-* 布局，ipt-profile.css?v=6），旧 up-* 选择器全部失效
        selectors: {
          messageCount: {
            text: 0,
            // 站内信入口由 /messages.php 迁移到 /inbox，未读提示在悬浮 tip 文案里
            selector: "a[href='/inbox'] .tTip",
            filters: [
              (query: string) => {
                if (/no new/i.test(query)) return 0;
                const queryMatch = query.match(/(\d+)/);
                return queryMatch ? parseInt(queryMatch[1]) : 1; // 有新消息但无计数时按 1 处理（站点未给出 >0 时的确切文案）
              },
            ],
          },
          name: { selector: "h1.upf-name" },
          uploaded: {
            selector: "div.upf-stat--up span.ipx-stat__sub",
            filters: [{ name: "parseNumber" }],
          },
          downloaded: {
            selector: "div.upf-stat--down span.ipx-stat__sub",
            filters: [{ name: "parseNumber" }],
          },
          ratio: {
            selector: "div.upf-stat--ratio span.ipx-stat__value",
            filters: [{ name: "parseNumber" }],
          },
          levelName: { selector: "span.ipx-pill.upf-class" },
          bonus: {
            selector: "a[href='/mybonus.php']",
            filters: [{ name: "parseNumber" }],
          },
          joinTime: {
            selector: "p.upf-meta > span:first time",
            attr: "datetime", // ISO 8601（站点时区 +0000），parseTime 默认格式可直接解析
            filters: [{ name: "parseTime" }],
          },
          lastAccessAt: {
            selector: "p.upf-meta > span:eq(1) time",
            attr: "datetime",
            filters: [{ name: "parseTime" }],
          },
          seeding: {
            selector: "dd.upf-peers a[href^='/peers']:first b",
            filters: [{ name: "parseNumber" }],
          },
          uploads: {
            selector: "a[href^='/t?u='] b",
            filters: [{ name: "parseNumber" }],
          },
          invites: {
            text: 0,
            // Account 区 Invites："4 sent · 5 left to send"，取剩余可邀请数（left to send）
            selector: "dl.ipx-kv > dt:contains('Invites') + dd > span.ipx-muted",
            filters: [{ name: "parseNumber" }],
          },
          isDonor: {
            text: false,
            // 站点样式注释：VIP status pill (replaces the donor heart when VIP is active)
            selector: "a.hdr-vip",
            elementProcess: () => true,
          },
        },
      },
      {
        requestConfig: { url: "/peers" },
        assertion: { id: "params.u" },
        // /peers?u=<id> 顶部统计区：Seeding 数量与做种体积；"To seed"（未满足 1:1 或 14 天）记为未完成 H&R
        selectors: {
          seedingSize: {
            text: "N/A",
            selector: "dl.pr-stats > div:first-child dd.pr-stats__sub", // 0 B
            filters: [{ name: "parseSize" }],
          },
          hnrUnsatisfied: {
            text: 0,
            selector: "dl.pr-stats > div:has(dt:contains('To seed')) > dd:first-of-type",
            filters: [{ name: "parseNumber" }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 0,
      name: "Peasant",
    },
    {
      id: 1,
      name: "User",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      uploaded: "50GB",
      downloaded: "5GB", // 官网未列出
      ratio: 1.05,
      privilege: "Are able to make requests for torrents, view the Top 10, and apply for Uploader status.",
    },
    {
      id: 3,
      name: "VIP",
      groupType: "vip",
      privilege: "Immune from H&R.",
    },
  ],
};
