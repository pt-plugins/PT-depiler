import { E as n } from "../types/torrent-BvvY2NbA.js";
import p from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import { bD as u } from "../index-COeZNva1.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
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
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const d = {
    1: "Movies",
    2: "TV",
    3: "Documentaries",
    4: "Music",
    5: "Sport",
    6: "Audio Track",
    7: "XXX",
    8: "Misc/Demo",
  },
  h = { 1: "H.264", 2: "MPEG-2", 3: "VC-1", 4: "XviD", 5: "HEVC" },
  f = { 1: "Blu-ray/HD DVD", 3: "Encode", 4: "Capture", 5: "Remux", 6: "WEB-DL" },
  g = { 0: "Undefined", 1: "Internal" },
  b = { 0: "Non-exclusive", 1: "Exclusive" };
function a(e, t) {
  return {
    name: e.charAt(0).toUpperCase() + e.slice(1),
    key: e,
    keyPath: "data",
    options: Object.entries(t).map(([r, i]) => ({ name: i, value: Number(r) })),
    cross: { mode: "brackets" },
  };
}
const O = {
  id: "hdbits",
  version: 1,
  name: "HDBits",
  aka: ["HDB"],
  description: "HDBits is a Private site for the HighDefinition Bittorrent Community",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",
  type: "private",
  urls: ["https://hdbits.org/"],
  category: [a("category", d), a("codec", h), a("medium", f), a("origin", g), a("exclusivity", b)],
  search: {
    requestConfig: { url: "/api/torrents", method: "POST", data: { limit: 100 } },
    keywordPath: "data.search",
    requestDelay: 2e3,
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: e, keywords: t }) => {
          e?.data?.search && delete e.data.search;
          const r = (t ?? "").replace(/^tt/, "");
          return (u(e, "data.imdb", { id: Number(r) }), e);
        },
      },
    },
    selectors: {
      rows: { selector: "data" },
      id: { selector: "id" },
      title: {
        selector: ":self",
        filters: [
          (e) => {
            const { filename: t, name: r, type_category: i, type_medium: s } = e;
            return i != 7 && s != 1 && t ? t.replace(".torrent", "") : r;
          },
        ],
      },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/details.php?id="] }] },
      time: { selector: "utadded", filters: [(e) => Number(e) * 1e3] },
      size: { selector: "size" },
      author: { text: "-" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "times_completed" },
      comments: { selector: "comments" },
      category: { selector: "type_category", filters: [(e) => d[Number(e)] ?? "Unknown"] },
      progress: {
        text: 0,
        selector: "torrent_status",
        filters: [(e) => (e == "seeding" || e == "completed" ? 100 : 0)],
      },
      status: {
        selector: "torrent_status",
        filters: [
          (e) =>
            e == "seeding" ? n.seeding : e == "leeching" ? n.downloading : e == "completed" ? n.completed : n.unknown,
        ],
      },
      ext_imdb: { selector: "imdb.id", filters: [{ name: "extImdbId" }] },
    },
  },
  detail: {
    urlPattern: ["/details.php"],
    selectors: {
      title: {
        selector: ["h1", "html > body > title"],
        switchFilters: {
          h1: [
            (e) => {
              let t = e.match(/^(.+?) +.+$/);
              return t && t.length >= 2 ? t[1].trim() : e;
            },
          ],
          "html > body > title": [
            (e) => {
              let t = e.match(/(.+) :: HDBits$/);
              return t && t.length >= 3 ? t[1].trim() : e;
            },
          ],
        },
      },
      link: { selector: ['a[href*="download.php"][href*="&passkey="]'], attr: "href" },
    },
  },
  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/index.php" },
        selectors: {
          id: {
            selector: "a[href*='userdetails.php']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "a[href*='userdetails.php']:first" },
          messageCount: {
            selector: ["a.alert-box--pm, span.js-notifications-count"],
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "params.id" },
        selectors: {
          uploaded: {
            selector: ["td.rowhead:contains('Uploaded') + td"],
            filters: [(e) => (e.includes("(") ? e.split("(")[0] : e), { name: "parseSize" }],
          },
          downloaded: {
            selector: ["td.rowhead:contains('Downloaded') + td"],
            filters: [(e) => (e.includes("(") ? e.split("(")[0] : e), { name: "parseSize" }],
          },
          ratio: { selector: "td.rowhead:contains('Share ratio') + td", filters: [{ name: "parseNumber" }] },
          levelName: { selector: ["td.rowhead:contains('Class') + td"] },
          bonus: { selector: ["td.rowhead:contains('Bonus') + td"], filters: [{ name: "parseNumber" }] },
          joinTime: {
            selector: ["td.rowhead:contains('JOIN'):contains('date') + td"],
            filters: [{ name: "split", args: [" (", 0] }, { name: "parseTime" }],
          },
          seeding: {
            selector: ["td.heading:contains('Currently'):contains('seeding') + td"],
            filters: [{ name: "replace", args: ["-", ""] }, { name: "parseNumber" }],
          },
          seedingSize: {
            selector: ["td.rowhead:contains('Seeding size') + td"],
            filters: [(e) => (e.includes("(") ? e.split("(")[0] : e), { name: "parseSize" }],
          },
          uploads: {
            selector: ["td.heading:contains('Uploaded'):contains('torrents') + td"],
            filters: [{ name: "replace", args: ["-", ""] }, { name: "parseNumber" }],
          },
          bonusPerHour: {
            selector: ["td.heading:contains('Bonus per hour') + td"],
            filters: [{ name: "parseNumber" }],
          },
          lastAccessAt: {
            selector: ["td.rowhead:contains('seen') + td"],
            filters: [{ name: "replace", args: ["\\s*\\(.*\\)", ""] }, { name: "parseTime" }],
          },
        },
      },
    ],
  },
  levelRequirements: [
    {
      id: 1,
      name: "1080i",
      interval: "P4W",
      downloaded: "30GB",
      ratio: 0.95,
      privilege: "You can view NFOs and request reseeds on poorly seeded torrents.",
    },
    { id: 2, name: "1080p", interval: "P4W", downloaded: "500GB", ratio: 1.4, privilege: "As 1080i" },
    { id: 3, name: "UHD", interval: "P4W", downloaded: "500GB", ratio: 2.5, privilege: "As 1080i" },
  ],
  userInputSettingMeta: [
    { name: "username", label: "Username", hint: "Your HDBits username", required: !0 },
    { name: "passkey", label: "Passkey", hint: "Your HDBits passkey", required: !0 },
  ],
};
class j extends p {
  async request(t, r = !0) {
    return (
      t.url &&
        t.url.includes("/api/") &&
        ((t.method = "POST"),
        (t.responseType = "json"),
        (t.data ??= {}),
        (t.data.username = this.userConfig.inputSetting.username),
        (t.data.passkey = this.userConfig.inputSetting.passkey)),
      super.request(t, r)
    );
  }
  loggedCheck(t) {
    const r = super.loggedCheck(t);
    if (r) {
      const { config: i, data: s = { status: -1 } } = t;
      if (i.url?.includes("/api/") && s.status !== 0) return !1;
    }
    return r;
  }
  parseTorrentRowForLink(t, r, i) {
    return ((t.link = `/download.php/${r.filename}?id=${r.id}&passkey=${this.userConfig.inputSetting.passkey}`), t);
  }
  parseTorrentRowForTags(t, r, i) {
    const s = [],
      { type_category: o = -1, type_medium: l = -1, type_origin: c = -1, freeleech: m = "no" } = r;
    return (
      o == 7 && s.push({ name: "NL." }),
      m == "yes" && s.push({ name: "Free" }),
      ([1, 5, 4].includes(l) || c == 1 || o == 2 || o == 3) && s.push({ name: "50%" }),
      (t.tags = s),
      t
    );
  }
}
export { j as default, O as siteMetadata };
