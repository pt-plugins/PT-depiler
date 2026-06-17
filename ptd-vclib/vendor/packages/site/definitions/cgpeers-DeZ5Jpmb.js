import { E as r } from "../types/torrent-BvvY2NbA.js";
import { SchemaMetadata as e } from "../schemas/Luminance-DtLCtoLD.js";
import "../index-COeZNva1.js";
import { b as n } from "../utils/helper-OCngMtkv.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/Gazelle-C72SbirH.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
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
const s = {
    17: "3D Printing",
    1: "Applications",
    8: "Audio",
    7: "Game Development",
    5: "Materials",
    6: "Miscellaneous",
    4: "Models",
    2: "Plugins",
    3: "Tutorials",
    9: "Web Development",
  },
  t = { selector: "a[href*='torrent/download/']", attr: "href" },
  a = {
    ...t,
    filters: [{ name: "split", args: ["/", 3] }, { name: "split", args: ["?", 0] }, { name: "parseNumber" }],
  },
  x = {
    ...e,
    version: 2,
    id: "cgpeers",
    name: "CGPeers",
    aka: ["CGP"],
    description: "CGPeers 是一个专注于计算机图形资源的私有站点",
    tags: ["设计", "教育", "软件", "学习", "素材"],
    timezoneOffset: "+0000",
    type: "private",
    schema: "Luminance",
    urls: ["https://cgpeers.to/"],
    legacyUrls: ["https://www.cgpeers.com/"],
    category: [
      { name: "类别", key: "filter_cat", options: n(s), cross: { mode: "appendQuote" } },
      { name: "优惠", key: "filter_freeleech", options: [{ name: "Free", value: 1 }] },
    ],
    search: {
      ...e.search,
      requestConfig: { ...e.search.requestConfig, url: "/torrent/browse" },
      advanceKeywordParams: { imdb: !1 },
      selectors: {
        ...e.search.selectors,
        id: a,
        title: { selector: "span + a[href*='torrent/']" },
        url: { selector: "span + a[href*='torrent/']", attr: "href" },
        link: t,
        category: {
          selector: "td.cats_col > div[title] > a",
          attr: "href",
          filters: [
            (i) => {
              const o = i.match(/filter_cat\[(\d+)\]=/);
              return o ? s[Number(o[1])] : "";
            },
          ],
        },
        author: { text: "N/A" },
        status: {
          selector: ["a[href*='torrents.php?action=download'] > i"],
          text: r.unknown,
          case: {
            "i.seeding-torrent": r.seeding,
            "i.leeching-torrent": r.downloading,
            "i.grabbed-torrent": r.inactive,
          },
        },
        progress: {
          selector: ["a[href*='torrents.php?action=download'] > i"],
          text: 0,
          case: { "i.seeding-torrent": 100 },
        },
      },
    },
    userInfo: {
      ...e.userInfo,
      process: [
        { requestConfig: { url: "/", responseType: "document" }, fields: ["id"] },
        {
          requestConfig: { url: "/user/$id$", responseType: "document" },
          assertion: { id: "url" },
          fields: [
            "name",
            "joinTime",
            "lastAccessAt",
            "uploaded",
            "downloaded",
            "levelName",
            "bonus",
            "ratio",
            "uploads",
            "bonusPerHour",
            "seeding",
            "seedingSize",
            "messageCount",
            "posts",
          ],
        },
      ],
      selectors: {
        ...e.userInfo.selectors,
        id: {
          selector: ["div.user-dropdown-section a[href^='/user/']"],
          attr: "href",
          filters: [{ name: "split", args: ["/", 2] }],
        },
        name: {
          selector: ["a#userDropdownTrigger", "span.user_name"],
          switchFilters: {
            "span.user_name": [
              {
                name: "split",
                args: [
                  `
`,
                  0,
                ],
              },
            ],
          },
        },
        messageCount: {
          text: 0,
          selector: "a#userDropdownTrigger .user-notification-badge",
          filters: [{ name: "parseNumber" }],
        },
      },
    },
    detail: {
      ...e.detail,
      selectors: { ...e.detail.selectors, title: { selector: "div.page-header h2" }, id: a, link: t },
    },
    levelRequirements: [
      { id: 1, name: "User" },
      {
        id: 2,
        name: "Member",
        interval: "P4W",
        uploaded: "100GiB",
        ratio: 1,
        privilege: "Access Top 10; Can (anonymously) upload torrents; Can make requests",
      },
      {
        id: 3,
        name: "Power User",
        interval: "P20W",
        uploaded: "500GiB",
        ratio: 2,
        uploads: 5,
        privilege: "Can view advanced site stats.",
      },
      {
        id: 4,
        name: "Elite",
        interval: "P52W",
        uploaded: "2TiB",
        ratio: 4,
        uploads: 50,
        privilege: "Can download multiple torrents at once. Can delete tags. Can view torrent peerlists.",
      },
      {
        id: 5,
        name: "Legend",
        interval: "P260W",
        uploaded: "100TiB",
        ratio: 4,
        uploads: 100,
        privilege: "Can have a personal collage. Can create collages.",
      },
    ],
  };
export { x as siteMetadata };
