import { a7 as i } from "../index-COeZNva1.js";
import { b as d } from "../utils/helper-OCngMtkv.js";
import p, { SchemaMetadata as e } from "../schemas/Rartracker-Hen9WwNJ.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const l = {
    rows: { selector: "torrents-table[torrents] > table > tbody > tr" },
    id: { selector: "a[title]", attr: "href", filters: [{ name: "split", args: ["/", 2] }] },
    url: { selector: "a[title]", attr: "href" },
    title: { selector: "a[title]", attr: "title" },
  },
  t = {
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
  },
  n = {
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
  },
  B = {
    ...e,
    id: "digitalcore",
    version: 1,
    name: "DigitalCore",
    aka: ["DC", "DCC"],
    description: "In a world of sharing, people make the difference.",
    tags: ["综合"],
    timezoneOffset: "+0200",
    type: "private",
    schema: "Rartracker",
    urls: ["uggcf://qvtvgnypber.pyho/"],
    category: [
      { name: "类别", key: "categories", options: d(n), cross: { mode: "brackets" } },
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
      ...e.search,
      requestConfig: {
        ...e.search.requestConfig,
        params: { ...e.search.requestConfig.params, dead: !0, extendedDead: !0, page: "search", sort: "created" },
      },
      selectors: {
        ...e.search.selectors,
        subTitle: { selector: "tagline" },
        completed: { selector: "times_completed" },
        category: { selector: "category", filters: [(r) => n[r]] },
        tags: [
          { name: "Free", selector: "frileech", color: "blue" },
          { name: "Pack", selector: "pack", color: "blue" },
          { name: "P2P", selector: "p2p", color: "red" },
          { name: "UNRAR", selector: "unrar", color: "red" },
          { name: "3D", selector: "3d", color: "red" },
          { name: "H&R", selector: "locked", color: "red" },
        ],
        ext_imdb: { selector: "imdbid2" },
      },
    },
    list: [
      {
        urlPattern: [/\/(alltorrents|movies|tvseries|games|music|apps|xxx|other|search)(\?.*)?$/],
        mergeSearchSelectors: !1,
        selectors: {
          time: { selector: "td:nth-child(6)", filters: [{ name: "parseTime" }] },
          size: { selector: "td:nth-child(7)", filters: [{ name: "parseSize" }] },
          completed: { selector: "td:nth-child(8)", filters: [{ name: "parseNumber" }] },
          seeders: { selector: "td:nth-child(9)" },
          leechers: { selector: "td:nth-child(10)" },
          ...l,
        },
      },
      {
        urlPattern: ["/toplists/torrents"],
        mergeSearchSelectors: !1,
        selectors: {
          completed: { selector: "td:nth-child(4)", filters: [{ name: "parseNumber" }] },
          seeders: { selector: "td:nth-child(5)" },
          leechers: { selector: "td:nth-child(6)" },
          ...l,
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
          ...e.userInfo.process[0],
          selectors: {
            ...e.userInfo.process[0].selectors,
            uploads: { selector: "user.mytorrents" },
            seeding: { selector: "user.myseeds" },
          },
        },
        {
          ...e.userInfo.process[1],
          selectors: {
            ...e.userInfo.process[1].selectors,
            trueUploaded: { selector: "uploaded_real" },
            levelId: { selector: "class" },
            levelName: { selector: "class", filters: [(r) => t[r]] },
          },
        },
        {
          requestConfig: { url: "/api/v1/users/$id$/bonuslog", responseType: "json" },
          assertion: { id: "url" },
          selectors: {
            bonusPerHour: {
              selector: ":self",
              filters: [
                (r) => {
                  const s = r.find((c) => i(c, "msg")?.includes("hourly"));
                  if (!s) return 0;
                  const o = i(s, "msg")?.match(/\[b\](\d+(\.\d+)?)p\[\/b\]/),
                    a = o ? parseFloat(o[1]) : null;
                  return a !== null ? a / 24 : 0;
                },
              ],
            },
          },
        },
      ],
    },
    levelRequirements: [
      { id: 0, name: t[0] },
      {
        id: 10,
        name: t[10],
        interval: "P14D",
        uploaded: "50GB",
        ratio: 1.05,
        privilege: "Get access to the request system and the bonus system. Can upload (moderated) torrents",
      },
      {
        id: 20,
        name: t[20],
        interval: "P105D",
        uploaded: "300GB",
        ratio: 1.1,
        privilege: "See all 'top' lists. See extended statistics. IP logging disabled. All IP logs are now cleared",
      },
      {
        id: 30,
        name: t[30],
        interval: "P210D",
        uploaded: "1200GB",
        ratio: 1.1,
        privilege: "Get 3 request slots, 2 invites and above perks",
      },
      {
        id: 31,
        name: t[31],
        interval: "P500D",
        uploaded: "5TB",
        ratio: 20,
        privilege: "Get 5 extra invites and 6 additional request slots. Can upload unmoderated torrents.",
      },
      {
        id: 32,
        name: t[32],
        interval: "P730D",
        uploaded: "20TB",
        ratio: 20,
        privilege: "Get 10 more extra invites and 10 additional request slots. Can upload unmoderated torrents.",
      },
      { id: 70, name: t[70], groupType: "vip" },
    ],
  };
class V extends p {}
export { V as default, B as siteMetadata };
