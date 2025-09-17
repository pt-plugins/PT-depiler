/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/hdtorrents.yml
 * @JackettIssue https://github.com/Jackett/Jackett/issues/16002
 */
import { tryToNumber } from "../utils.ts";
import type { ISiteMetadata } from "../types.ts";
import { definedFilters } from "../utils.ts";
import urlJoin from "url-join";

const categoryMap: Record<number, string> = {
  70: "Movie/UHD/Blu-Ray",
  1: "Movie/Blu-Ray",
  71: "Movie/UHD/Remux",
  2: "Movie/Remux",
  5: "Movie/1080p/i",
  3: "Movie/720p",
  64: "Movie/2160p",
  63: "Movie/Audio Track",
  72: "TV Show/UHD/Blu-ray",
  59: "TV Show/Blu-ray",
  73: "TV Show/UHD/Remux",
  60: "TV Show/Remux",
  30: "TV Show/1080p/i",
  38: "TV Show/720p",
  65: "TV Show/2160p",
  44: "Music/Album",
  61: "Music/Blu-Ray",
  62: "Music/Remux",
  57: "Music/1080p/i",
  45: "Music/720p",
  66: "Music/2160p",
  58: "XXX/Blu-ray",
  78: "XXX/Remux",
  74: "XXX/UHD/Blu-ray",
  48: "XXX/1080p/i",
  47: "XXX/720p",
  67: "XXX/2160p",
};

const statsFilter = (query?: string) => {
  if (!query || query.startsWith("--")) return 0;
  return Number(query);
};

const removeInvalidDataUnit = (query: string) => {
  // HDT 特色，当你的上传/下载量为 0 时会显示为 0.00 BiT
  const match = query.match(/^([\d.]+)\s+(BiT)$/);
  return match && match.length > 1 ? match[0] : query;
};

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "hdtorrents",
  name: "HD-Torrents",
  aka: ["HDT"],
  description: "HD-Torrents is a private tracker for HD content.",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "XBTIT",

  urls: ["uggcf://uq-gbeeragf.bet/", "uggcf://uq-gbeeragf.arg/", "uggcf://uq-gbeeragf.zr/", "uggcf://uqgf.eh/"],

  category: [
    {
      name: "类别",
      key: "category",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "brackets" },
    },
    {
      name: "种子状态",
      key: "active",
      options: [
        { name: "活种", value: 1 },
        { name: "死种", value: 2 },
        { name: "Free", value: 5 },
        { name: "25%", value: 8 },
        { name: "50%", value: 6 },
        { name: "75%", value: 7 },
      ],
    },
  ],

  search: {
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: {
        options: 0,
        active: 0,
        order: "created",
        by: "desc",
      },
    },
    advanceKeywordParams: {
      imdb: { enabled: true },
    },
    requestConfigTransformer: ({ keywords, requestConfig }) => {
      const baseUrl = requestConfig!.url || "";
      if (keywords) {
        delete requestConfig!.params?.keywords; // 移除 AbstractBittorrentSite 自动添加的 keywords 参数

        // manually url encode parenthesis to prevent "hacking" detection, remove . as not used in titles
        keywords = keywords.replace(/\./g, " ");
        keywords = keywords.replace(/\(/g, "%28");
        keywords = keywords.replace(/\)/g, "%29");
        requestConfig!.url = urlJoin(baseUrl, `?search=${keywords}`);
      }
      return requestConfig!;
    },
    selectors: {
      rows: { selector: "table.mainblockcontenttt > tbody > tr:has(td.mainblockcontent):not(:first-of-type)" },
      title: { selector: "a[href^='details.php?id=']" },
      subTitle: { selector: "td:nth-child(3) span" },
      url: { selector: "a[href^='details.php?id=']", attr: "href" },
      link: { selector: "a[href^='download.php?id=']", attr: "href" },
      category: {
        selector: "a[href^='torrents.php?category=']",
        attr: "href",
        filters: [
          (query: string) => {
            const catId = parseInt(definedFilters.querystring(query, ["category"]) as string) || 0;
            return categoryMap[catId];
          },
        ],
      },
      comments: {
        selector: "td:nth-child(4) > a",
        // 评论数如果为 0 会显示 "--"
        filters: [statsFilter],
      },
      time: {
        // auto adjusted by site account profile
        selector: "td:nth-child(7)",
        filters: [{ name: "parseTime", args: ["HH:mm:sss  dd/MM/yyyy"] }],
      },
      size: { selector: "td:nth-child(8)" },
      seeders: { selector: "td:nth-last-child(3)" },
      leechers: { selector: "td:nth-last-child(2)" },
      completed: {
        selector: "td:nth-last-child(1)",
        // 完成量如果为 0 会显示 "---"
        filters: [statsFilter],
      },
      tags: [
        {
          name: "Free",
          selector: "img[src*='free.png']",
        },
        {
          name: "75%",
          selector: "img[src*='25.png']",
        },
        {
          name: "50%",
          selector: "img[src*='50.png']",
        },
        {
          name: "25%",
          selector: "img[src*='75.png']",
        },
        {
          name: "Internal",
          selector: "img[src*='internal.png']",
          color: "green",
        },
      ],

      ext_imdb: { selector: "a[href*='imdb.com/title/tt']", attr: "href", filters: [{ name: "extImdbId" }] },
    },
  },

  detail: {
    urlPattern: ["/details.php"],
    selectors: {
      title: { selector: "a[href*='download.php']:first" },
      link: { selector: "a[href*='download.php']:first", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        selectors: {
          id: {
            selector: "a[href*='usercp.php?uid=']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["uid"] }],
          },
          messageCount: {
            selector: ".new-pm.warning",
            filters: [
              (query: string) => {
                const match = query.match(/(\d+)/);
                return match && match.length > 1 ? parseInt(match[1]) : 0;
              },
            ],
          },
        },
      },
      {
        requestConfig: { url: "/usercp.php", responseType: "document" },
        assertion: { id: "params.uid" },
        selectors: {
          name: { selector: "tr#CurrentDetailsHideShowTR td.header:contains('User') + td" },
          uploaded: {
            selector: "td.header:contains('Uploaded') + td",
            filters: [{ name: "replace", args: [/,/g, ""] }, removeInvalidDataUnit, { name: "parseSize" }],
          },
          downloaded: {
            selector: "td.header:contains('Downloaded') + td",
            filters: [{ name: "replace", args: [/,/g, ""] }, removeInvalidDataUnit, { name: "parseSize" }],
          },
          ratio: {
            selector: "td.header:contains('Ratio') + td",
            filters: [tryToNumber],
          },
          levelName: { selector: "td.header:contains('Rank') + td" },
          bonus: {
            selector: "td.header:contains('Seed Bonus Points') + td",
            filters: [tryToNumber],
          },
          joinTime: {
            selector: "td.header:contains('Joined on') + td",
            filters: [{ name: "parseTime", args: ["dd/MM/yyyy HH:mm:ss"] }],
          },
          seeding: { selector: "td.nav[title='Active-Torrents'] > a[href*='#actives'] > span" },
          seedingSize: {
            selector: "td.header:contains('Total Size of torrents') + td",
            filters: [{ name: "replace", args: [/,/g, ""] }, removeInvalidDataUnit, { name: "parseSize" }],
          },
          // FIXME 暂未实现 uploads
        },
      },
      {
        requestConfig: { url: "/seedbonus.php", responseType: "document" },
        selectors: {
          bonusPerHour: {
            selector: "#BonusPointsHideShowTR .blockcontent center:eq(0) h1 font[color='blue']:eq(2)",
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "HD Newbie",
      privilege: 'Can access "Index", "Torrents", "Donate", "Requests", "Subtitles", "Forum"',
    },
    {
      id: 2,
      name: "HD Maniac",
      uploaded: "50GB",
      ratio: 1.05,
      privilege: 'Gain access to "Top 10"',
    },
    {
      id: 3,
      name: "HD Monster",
      uploaded: "250GB",
      ratio: 2,
      privilege: 'Gain access to "Tracker Info", "Invites" section of the forums',
    },
    {
      id: 4,
      name: "HD Daemon",
      uploaded: "1TB",
      ratio: 4,
      privilege: 'Gain access to "Users"',
    },
  ],
};
