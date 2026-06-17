import d, {
  detailPageList as i,
  SchemaMetadata as a,
  commonPagesList as n,
  GazelleUtils as c,
} from "../schemas/Gazelle-C72SbirH.js";
import { E as o } from "../types/torrent-BvvY2NbA.js";
import "../index-COeZNva1.js";
import { a as r } from "../utils/helper-OCngMtkv.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
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
const u = ["Internal", "Pollen"],
  l = (e) => c.extractTags(e, u),
  p = [
    { name: "Feature Film", class: "featurefilm", value: 1 },
    { name: "Short Film", class: "shortfilm", value: 2 },
    { name: "Miniseries", class: "miniseries", value: 3 },
    { name: "Other", class: "other", value: 4 },
  ],
  g = p.reduce((e, t) => ((e[t.class] = t.name), e), {}),
  f = p.map(({ name: e, value: t }) => ({ name: e, value: t })),
  m = {
    ...i.selectors,
    category: { text: "N/A" },
    time: {
      ...i.selectors.time,
      selector: ["+ tr span.time[title]", "+ tr span.time"],
      switchFilters: {
        "+ tr span.time": [
          (e) => {
            const s = new Date().getTimezoneOffset() * 60 * 1e3;
            return (e ?? 0) + s;
          },
        ],
      },
    },
  },
  H = {
    ...a,
    version: 2,
    id: "anthelion",
    name: "Anthelion",
    aka: ["ANT"],
    description: "Anthelion (ANT) is a Private site for MOVIES",
    tags: ["电影"],
    timezoneOffset: "+0000",
    type: "private",
    schema: "Gazelle",
    urls: ["uggcf://naguryvba.zr/"],
    category: [
      { name: "Category", key: "filter_cat", options: f, cross: { mode: "appendQuote" } },
      {
        name: "Container",
        key: "container",
        options: r(["AVI", "MPG", "MKV", "MP4", "VOB IFO", "ISO", "m2ts", "Other"]),
      },
      { name: "Codec", key: "codec", options: r(["MPEG1", "MPEG2", "Xvid", "DivX", "H264", "H265", "VC-1"]) },
      {
        name: "Source",
        key: "media",
        options: r(["Blu-ray", "DVD", "WEB", "LaserDisc", "HD-DVD", "HDTV", "TV", "VHS", "Unknown"]),
      },
      { name: "Resolution", key: "resolution", options: r(["SD", "720p", "1080i", "1080p", "2160p"]) },
      {
        name: "Leech Status",
        key: "freetorrent",
        options: [
          { value: "0", name: "Normal" },
          { value: "1", name: "Free" },
          { value: "2", name: "Neutral" },
          { value: "3", name: "Either" },
        ],
      },
    ],
    search: {
      ...a.search,
      requestConfig: {
        url: "/torrents.php",
        responseType: "document",
        params: { group_results: 0, order_way: "desc", searchsubmit: 1 },
      },
      advanceKeywordParams: { imdb: { enabled: !0 }, tmdb: { enabled: !0 } },
      selectors: {
        ...a.search.selectors,
        title: { ...a.search.selectors.title, elementProcess: c.genTitleElementProcess({ extractTagsFunc: l }) },
        subTitle: {
          selector: [".tags", "> td:has(a[href*='torrents.php']) a:not(span a):last"],
          switchFilters: { ".tags": [], "> td:has(a[href*='torrents.php']) a:not(span a):last": [l] },
        },
        category: {
          text: "Other",
          selector: "div[class^='tooltip cats_']",
          attr: "class",
          filters: [
            (e) => {
              const t = e.match(/cats_(\w+)/);
              return t ? g[t[1]] : "";
            },
          ],
        },
        tags: [
          { name: "Free", selector: "strong:contains('Freeleech')" },
          { name: "Internal", selector: "strong:contains('Internal')" },
        ],
        progress: {
          selector: ["div.torrent_info:first", "a[data-toggle-target*='torrent']"],
          filters: [(e) => (e.includes("Seeding") ? 100 : 0)],
        },
        status: {
          selector: ["div.torrent_info:first", "a[data-toggle-target*='torrent']"],
          filters: [(e) => (e.includes("Seeding") ? o.seeding : e.includes("Snatched") ? o.inactive : o.unknown)],
        },
        ext_imdb: { selector: "a[href*='imdb.com/title/tt']", attr: "href", filters: [{ name: "extImdbId" }] },
      },
    },
    list: [
      {
        ...n,
        urlPattern: [...n.urlPattern, "/artist\\.php\\?tmdb=\\d+"],
        selectors: {
          time: {
            text: 0,
            selector: "span.time",
            filters: [
              { name: "parseTTL" },
              (e) => {
                const s = new Date().getTimezoneOffset() * 60 * 1e3;
                return e + s;
              },
            ],
          },
        },
      },
      { ...i, selectors: m },
    ],
    userInfo: {
      pickLast: ["id", "name", "joinTime"],
      process: [
        {
          requestConfig: { url: "/store.php", responseType: "document" },
          fields: ["id", "name", "messageCount", "bonusPerHour"],
        },
        {
          requestConfig: { url: "/user.php", responseType: "document" },
          assertion: { id: "params.id" },
          fields: [
            "uploaded",
            "uploads",
            "downloaded",
            "adoptions",
            "ratio",
            "joinTime",
            "lastAccessAt",
            "seedingSize",
            "bonus",
            "levelName",
          ],
        },
        {
          requestConfig: { url: "/ajax.php", params: { action: "community_stats" }, responseType: "json" },
          assertion: { id: "params.userid" },
          fields: ["seeding"],
        },
      ],
      selectors: {
        ...a.userInfo.selectors,
        bonusPerHour: {
          selector: "h3.float_right",
          filters: [
            (e) => {
              const t = e.replace(",", "").match(/making ([\d]+) Orbs/);
              return t && t.length > 1 ? parseFloat(t[1]) : 0;
            },
          ],
        },
        adoptions: { selector: "li:contains('Adopted: ') span" },
        joinTime: {
          selector: "ul.stats li:contains('Joined:') span",
          attr: "title",
          filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm 'UTC'"] }],
        },
        seedingSize: { selector: "li:contains('Seeding Size: ') span", filters: [{ name: "parseSize" }] },
        bonus: { selector: "a[href*='store.php']", filters: [{ name: "replace", args: [/,/g, ""] }] },
        seeding: { selector: "response.seeding", filters: [{ name: "parseNumber" }] },
      },
    },
    levelRequirements: [
      {
        id: 1,
        name: "User",
        privilege: "Can download, upload, vote on requests, use advanced search, access top 10, and bookmark content.",
      },
      {
        id: 2,
        name: "Member",
        interval: "P2W",
        uploaded: "0.5TiB",
        ratio: 0.8,
        bonus: 5e3,
        privilege: "Create & manage collections; Send invites",
      },
      {
        id: 3,
        name: "Power User",
        interval: "P1M",
        uploaded: "1TiB",
        ratio: 1,
        alternative: [{ uploads: 5 }, { adoptions: 10 }],
        bonus: 25e3,
        privilege: "Upload images; Access Top 10; Purchase Invites; Invite forums",
      },
      {
        id: 4,
        name: "Fanatic",
        interval: "P3M",
        uploaded: "1TiB",
        ratio: 1,
        uploads: 5,
        alternative: [{ uploads: 25 }, { adoptions: 50 }],
        bonus: 25e3,
        privilege: "Can have 1 personal collage; Receives periodic invites (max 1)",
      },
      {
        id: 5,
        name: "Elite",
        interval: "P6M",
        uploaded: "5TiB",
        ratio: 2.5,
        uploads: 10,
        alternative: [{ uploads: 100 }, { adoptions: 200 }],
        bonus: 25e4,
        privilege:
          "Can have a up to 2 personal collages; Can edit film descriptions/trailers; Receives periodic invites (max 2)",
      },
      {
        id: 6,
        name: "Guru",
        interval: "P1Y",
        uploaded: "5TiB",
        ratio: 3,
        uploads: 25,
        alternative: [{ uploads: 250 }, { adoptions: 500 }],
        bonus: 5e5,
        privilege: "Immune from being put on ratio watch; Receives periodic invites (max 4)",
      },
      {
        id: 7,
        name: "Torrent Master",
        interval: "P2Y",
        uploaded: "10TiB",
        ratio: 3.5,
        uploads: 50,
        alternative: [{ uploads: 500 }, { adoptions: 1e3 }],
        bonus: 1e6,
        privilege: "Can have a up to 3 personal collages; Can edit torrents",
      },
    ],
  };
class G extends d {
  transformSearchPage(t, s) {
    return (
      t.querySelector("div#covers") &&
        (s = { ...s, searchEntry: { ...s.searchEntry, selectors: { ...s.searchEntry.selectors, ...m } } }),
      super.transformSearchPage(t, s)
    );
  }
  getTorrentGroupInfo(t, s) {
    return this.getFieldsData(t, s.searchEntry.selectors, ["title", "category", "ext_imdb"]);
  }
}
export { G as default, H as siteMetadata };
