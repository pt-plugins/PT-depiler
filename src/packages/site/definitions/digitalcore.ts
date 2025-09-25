import type { ISiteMetadata } from "../types";
import { get } from "es-toolkit/compat";
import { GB } from "../utils";

const commonDocumentSelectors = {
  rows: { selector: "torrents-table[torrents] > table > tbody > tr" },
  id: {
    selector: "a[title]",
    attr: "href",
    filters: [{ name: "split", args: ["/", 2] }],
  },
  url: { selector: "a[title]", attr: "href" },
  title: { selector: "a[title]", attr: "title" },
};

const levelIdMap: Record<number, string> = {
  0: "Rogue",
  10: "Sentinel",
  20: "Viceroy",
  30: "Sentry",
  31: "Guardian",
  32: "Vanguard",
  50: "Uploader",
  51: "Titan",
  60: "Developer",
  70: "VIP",
  75: "FLS",
  80: "Moderator",
  90: "Administrator",
};

const categoryMap: Record<number, string> = {
  2: "Movies/SD",
  1: "Movies/DVDR",
  5: "Movies/720p",
  6: "Movies/1080p",
  4: "Movies/2160p",
  3: "Movies/BluRay",
  38: "Movies/Bluray/UHD",
  7: "Movies/PACKS",
  10: "Tv/SD",
  11: "Tv/DVDR",
  8: "Tv/720p",
  9: "Tv/1080p",
  13: "Tv/2160p",
  14: "Tv/BluRay",
  12: "Tv/PACKS",
  15: "Tv/SPORTS",
  17: "Unknown",
  18: "Apps/0DAY",
  20: "Apps/PC",
  21: "Apps/Mac",
  33: "Apps/Tutorials",
  22: "Music/MP3",
  23: "Music/FLAC",
  24: "Music/MTV",
  29: "Music/PACKS",
  39: "Music/DVD",
  40: "Music/Bluray",
  25: "Games/PC",
  27: "Games/Mac",
  26: "Games/Consoles",
  43: "Games/ROMS",
  42: "Games/XXX",
  44: "Audiobooks",
  28: "Ebooks",
  30: "XXX/SD",
  31: "XXX/HD",
  32: "XXX/4K",
  35: "XXX/Movies/SD",
  36: "XXX/Movies/HD",
  37: "XXX/Movies/4K",
  34: "XXX/Imagesets",
  41: "XXX/PACKS",
};

interface IDigitalCoreBonusLogRespItem {
  id: number;
  datum: string;
  msg: string;
}

type IDigitalCoreBonusLogResp = IDigitalCoreBonusLogRespItem[];

export const siteMetadata: ISiteMetadata = {
  id: "digitalcore",
  version: 1,
  name: "DigitalCore.Club",
  aka: ["DC", "DCC"],
  description: "In a world of sharing, people make the difference.",
  tags: ["综合"],
  timezoneOffset: "+0200",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["uggcf://qvtvgnypber.pyho/"],

  category: [
    {
      name: "类别",
      key: "categories",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
      cross: { mode: "brackets" },
    },
    {
      name: "促销状态",
      key: "freeleech",
      options: [
        { name: "免费", value: "true" },
        { name: "非免费", value: "false" },
      ],
    },
  ],

  search: {
    keywordPath: "params.searchText",
    requestConfig: {
      responseType: "json",
      url: "/api/v1/torrents",
      params: {
        dead: true,
        extendedDead: true,
        extendedSearch: false,
        index: 0,
        limit: 100,
        page: "search",
        section: "all",
        watchview: false,
        sort: "created",
      },
    },
    advanceKeywordParams: {
      imdb: { enabled: true },
    },
    selectors: {
      rows: { selector: ":self" },
      id: { selector: "id" },
      title: { selector: "name" },
      subTitle: { selector: "tagline" },
      url: { selector: "id", filters: [(id: number) => `/torrent/${id}/`] },
      link: { selector: "id", filters: [(id: number) => `/api/v1/torrents/download/${id}`] },
      time: { selector: "added" },
      size: { selector: "size" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "times_completed" },
      comments: { selector: "comments" },
      category: {
        selector: "category",
        filters: [(catId: number) => categoryMap[catId]],
      },
      tags: [
        {
          name: "Free",
          selector: "frileech",
          color: "blue",
        },
        {
          name: "Pack",
          selector: "pack",
          color: "blue",
        },
        {
          name: "P2P",
          selector: "p2p",
          color: "red",
        },
        {
          name: "UNRAR",
          selector: "unrar",
          color: "red",
        },
        {
          name: "3D",
          selector: "3d",
          color: "red",
        },
        {
          name: "H&R",
          selector: "locked", // 一个一定会出现的字段，这里用于添加 HR tag
          color: "red",
        },
      ],

      ext_imdb: { selector: "imdbid2" },
    },
  },

  list: [
    {
      urlPattern: [/\/(alltorrents|movies|tvseries|games|music|apps|xxx|other)(\?.*)?$/],
      mergeSearchSelectors: false,
      selectors: {
        link: { selector: "a[href*='/api/v1/torrents/download/']", attr: "href" },
        ...commonDocumentSelectors,
      },
    },
    {
      // Toplists 匹配，同一个种子可能会在多个分类里出现
      urlPattern: ["/toplists/torrents"],
      mergeSearchSelectors: false,
      selectors: {
        link: {
          selector: "a[title]",
          attr: "href",
          filters: [
            { name: "split", args: ["/", 2] },
            { name: "prepend", args: ["/api/v1/torrents/download/"] },
          ],
        },
        ...commonDocumentSelectors,
      },
    },
  ],

  detail: {
    urlPattern: [/\/torrent\/\d+\/.*$/],
    selectors: {
      id: { selector: "torrent[viewing-torrent]", attr: "viewing-torrent" },
      title: { selector: "div.ellipsis > span" },
      link: { selector: "div[ng-hide*='vm.torrent'] > a:nth-child(1)", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: {
          url: "/api/v1/status",
          responseType: "json",
        },
        selectors: {
          id: { selector: "user.id" },
          name: { selector: "user.username" },
          messageCount: { selector: "user.newMessages" },
          uploads: { selector: "user.mytorrents" },
          seeding: { selector: "user.myseeds" },

          // 最简便的做种体积获取方式，但最多精确到 GiB
          seedingSize: {
            selector: "user.currentGbSeed",
            filters: [(query: number) => query * GB],
          },
        },
      },
      {
        requestConfig: {
          url: "/api/v1/users/$id$",
          responseType: "json",
        },
        assertion: { id: "url" },
        selectors: {
          joinTime: { selector: "added" },
          downloaded: { selector: "downloaded" },
          trueDownloaded: { selector: "downloaded_real" },
          uploaded: { selector: "uploaded" },
          trueUploaded: { selector: "uploaded_real" },
          bonus: { selector: "bonuspoang" },
          levelId: { selector: "class" },
          levelName: {
            selector: "class",
            filters: [(levelId: number) => levelIdMap[levelId]],
          },
        },
      },
      {
        requestConfig: {
          url: "/api/v1/users/$id$/bonuslog",
          responseType: "json",
        },
        assertion: { id: "url" },
        selectors: {
          bonusPerHour: {
            selector: ":self",
            filters: [
              (bonusLog: IDigitalCoreBonusLogResp) => {
                const item = bonusLog.find((entry) => get(entry, "msg")?.includes("hourly"));
                if (!item) return 0;

                const match = get(item, "msg")?.match(/\[b\](\d+(\.\d+)?)p\[\/b\]/);
                const dailyBonus = match ? parseFloat(match[1]) : null;

                // 返回的是一天总魔力值
                return dailyBonus !== null ? dailyBonus / 24 : 0;
              },
            ],
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 0,
      name: levelIdMap[0], // Rogue
    },
    {
      id: 10,
      name: levelIdMap[10], // Sentinel
      interval: "P14D",
      uploaded: "50GB",
      ratio: 1.05,
      privilege: "Get access to the request system and the bonus system. Can upload (moderated) torrents",
    },
    {
      id: 20,
      name: levelIdMap[20], // Viceroy
      interval: "P105D",
      uploaded: "300GB",
      ratio: 1.1,
      privilege: "See all 'top' lists. See extended statistics. IP logging disabled. All IP logs are now cleared",
    },
    {
      id: 30,
      name: levelIdMap[30], // Sentry
      interval: "P210D",
      uploaded: "1200GB",
      ratio: 1.1,
      privilege: "Get 3 request slots, 2 invites and above perks",
    },
    {
      id: 31,
      name: levelIdMap[31], // Guardian
      interval: "P500D",
      uploaded: "5TB",
      ratio: 20,
      privilege: "Get 5 extra invites and 6 additional request slots. Can upload unmoderated torrents.",
    },
    {
      id: 32,
      name: levelIdMap[32], // Vanguard
      interval: "P730D",
      uploaded: "20TB",
      ratio: 20,
      privilege: "Get 10 more extra invites and 10 additional request slots. Can upload unmoderated torrents.",
    },
    {
      id: 70,
      name: levelIdMap[70], // VIP
    },
  ],
};
