import { S as m } from "../index-COeZNva1.js";
import V, { SchemaMetadata as o } from "../schemas/Gazelle-C72SbirH.js";
import { f as T } from "../utils/datetime-DQxMK7bP.js";
import { p as _ } from "../utils/filesize-D_1hx4u8.js";
import { a as u } from "../utils/helper-OCngMtkv.js";
import { a as G } from "../types/base-Dy_28wGT.js";
import { E as h } from "../types/torrent-BvvY2NbA.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../utils/filter-Dko2hrfF.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const se = {
  ...o,
  version: 1,
  id: "passthepopcorn",
  name: "PassThePopcorn",
  aka: ["PTP"],
  description: "PassThePopcorn (PTP) is a Private site for MOVIES",
  tags: ["电影"],
  timezoneOffset: "+0000",
  collaborator: ["lengmianxia", "birdplane", "enigmaz"],
  type: "private",
  schema: "Gazelle",
  urls: ["https://passthepopcorn.me/"],
  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: [
        { value: 1, name: "Feature Film" },
        { value: 2, name: "Short Film" },
        { value: 3, name: "Miniseries" },
        { value: 4, name: "Stand-up Comedy" },
        { value: 5, name: "Live Performance" },
        { value: 6, name: "Movie Collection" },
      ],
      cross: { mode: "appendQuote" },
    },
    { name: "Container", key: "encoding", options: u(["AVI", "MPG", "MKV", "MP4", "VOB IFO", "ISO", "m2ts"]) },
    {
      name: "Codec",
      key: "format",
      options: u([
        ["XviD", "DivX", "H.264", "x264", "H.265", "x265"],
        ["DVD5", "DVD9", "BD25", "BD50", "BD66", "BD100"],
      ]),
    },
    {
      name: "Source",
      key: "media",
      options: u([
        ["CAM", "TS", "R5", "DVD-Screener", "VHS", "WEB"],
        ["DVD", "TV", "HDTV", "HD-DVD", "Blu-ray"],
      ]),
    },
    {
      name: "Resolution",
      key: "resolution",
      options: [
        { value: "anysd", name: "Any SD" },
        { value: "anyhd", name: "Any HD" },
        { value: "anyhdplus", name: "Any HD+" },
        { value: "anyuhd", name: "Any UHD" },
        ...u(["NTSC", "PAL", "480p", "576p", "720p", "1080i", "1080p", "2160p"]),
      ],
    },
    {
      name: "Release type",
      key: "scene",
      options: [
        { value: "2", name: "Golden Popcorn" },
        { value: "3", name: "Personal" },
        { value: "4", name: "Personal GP" },
        { value: "0", name: "Non-Scene" },
        { value: "1", name: "Scene" },
      ],
    },
    {
      name: "Leech type",
      key: "freetorrent",
      options: [
        { value: "0", name: "Normal" },
        { value: "1", name: "Free" },
        { value: "2", name: "Half" },
        { value: "3", name: "Neutral" },
        { value: "4", name: "Any X-Leech" },
      ],
    },
  ],
  search: {
    ...o.search,
    requestConfig: { url: "/torrents.php", responseType: "document", params: { noredirect: 1, grouping: 0 } },
    selectors: {},
  },
  userInfo: {
    ...o.userInfo,
    process: [
      { requestConfig: { url: "/index.php", responseType: "document" }, fields: ["id", "name", "messageCount"] },
      {
        requestConfig: { url: "/user.php", params: {}, responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "uploaded",
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "bonusPerHour",
          "joinTime",
          "seeding",
          "seedingSize",
          "uploads",
        ],
      },
    ],
    selectors: {
      ...o.userInfo.selectors,
      id: { ...o.userInfo.selectors.id, selector: ["a[href*='user.php?id=']:first"] },
      name: { selector: ["a[href*='user.php?id=']:first"] },
      uploaded: {
        ...o.userInfo.selectors.uploaded,
        selector: "div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Uploaded:')",
      },
      downloaded: {
        ...o.userInfo.selectors.downloaded,
        selector: "div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Downloaded:')",
      },
      ratio: {
        ...o.userInfo.selectors.ratio,
        selector: "div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Ratio:')",
      },
      levelName: {
        ...o.userInfo.selectors.levelName,
        selector: "div.panel__heading:contains('Personal') + div.panel__body > ul.list > li:contains('Class:')",
      },
      bonus: {
        selector: "div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Points:')",
        filters: [
          (t) => {
            t = t.replace(/,/g, "");
            const e = t.match(/Points.+?([\d.]+)/);
            return e && e.length >= 2 ? parseFloat(e[1]) : 0;
          },
        ],
      },
      bonusPerHour: {
        selector: "div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Points per hour:')",
        filters: [
          (t) => {
            t = t.replace(/,/g, "");
            const e = t.match(/Points per hour.+?([\d.]+)/);
            return e && e.length >= 2 ? parseFloat(e[1]) : 0;
          },
        ],
      },
      joinTime: {
        selector: ["div.panel__heading:contains('Stats') + div.panel__body > ul.list > li:contains('Joined:') > span"],
        elementProcess: (t) => {
          const e = (t.getAttribute("title") || t.innerText).trim();
          return T(e, ["MMM dd yyyy, HH:mm"]);
        },
      },
      seeding: {
        selector: ["div.panel__heading:contains('Community') + div.panel__body > ul.list > li:contains('Seeding:')"],
        filters: [
          (t) => {
            t = t.replace(/,/g, "");
            const e = t.match(/Seeding.+?([\d.]+)/);
            return e && e.length >= 2 ? parseFloat(e[1]) : 0;
          },
        ],
      },
      seedingSize: {
        selector: [
          "div.panel__heading:contains('Community') + div.panel__body > ul.list > li:contains('Seeding size:')",
        ],
        filters: [
          (t) => {
            const e = t.replace(/,/g, "").match(/Seeding size.+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return e && e.length >= 2 ? _(e[1]) : 0;
          },
        ],
      },
      uploads: {
        selector: ["div.panel__heading:contains('Community') + div.panel__body > ul.list > li:contains('Uploaded:')"],
        filters: [
          (t) => {
            const e = t.replace(/,/g, "").match(/Uploaded:.+?([\d]+)/);
            return e && e.length >= 2 ? parseFloat(e[1]) : 0;
          },
        ],
      },
    },
  },
  levelRequirements: [
    { id: 1, name: "User", privilege: "Upload torrents. Download torrents" },
    {
      id: 2,
      name: "Member",
      interval: "P1W",
      uploaded: "40GB",
      ratio: 1.05,
      privilege: "Create requests. Hide username from peerlists. Download a .zip file of snatches on their profile",
    },
    {
      id: 3,
      name: "Power User",
      nameAka: ["PU"],
      interval: "P4W",
      uploaded: "80GB",
      ratio: 1.05,
      uploads: 1,
      isKept: !0,
      privilege:
        "Immunity to inactivity pruning. Access to PU forums. Access to invite forums. Freeleech access in advanced search. Can send bonus points to other users. Can edit movie group information. Access to on-site notifications. Access to the IRC announce channels. Create collections and edit existing ones",
    },
    {
      id: 4,
      name: "Elite",
      interval: "P10W",
      uploaded: "500GB",
      ratio: 1.05,
      uploads: 50,
      isKept: !0,
      privilege: "Access to Elite forums. Can purchase invites from the bonus point store",
    },
    {
      id: 5,
      name: "Torrent Master",
      nameAka: ["TM"],
      interval: "P16W",
      uploaded: "1TB",
      ratio: 1.05,
      uploads: 200,
      isKept: !0,
      privilege: "Access to TM forums. Receive 2 invites per month",
    },
    {
      id: 6,
      name: "Torrent King",
      nameAka: ["TK"],
      interval: "P24W",
      uploaded: "5TB",
      ratio: 1.05,
      uploads: 500,
      isKept: !0,
      privilege:
        "Can create personal collections to feature on their profile. Granted ability to double post in forums. Unlimited search and log results. Immunity from ratio-based demotion",
    },
    {
      id: 7,
      name: "Custom Class",
      nameAka: ["CC"],
      interval: "P36W",
      uploaded: "10TB",
      ratio: 1.05,
      uploads: 1e3,
      isKept: !0,
      privilege: "Can chose their own class title. Immunity from ratio-based demotion",
    },
  ],
};
class ie extends V {
  createTempDiv(e) {
    const r = document.createElement("div");
    return ((r.innerHTML = e), r);
  }
  parsePageData(e, r, l) {
    const a = e.GroupingQualities?.[0]?.Torrents?.[0],
      d = e.GroupId || "",
      i = e.Title || "",
      n = e.Year || "",
      p = e.ImdbId ? `tt${e.ImdbId}` : "",
      v = e.CategoryName || "";
    if (a) {
      const s = a.TorrentId,
        f = this.createTempDiv(a.Title),
        y = m("a", f)[0]?.getAttribute("title") || "",
        P = y.split(`
`),
        D = P.length > 1 ? P[1].trim() : y.trim(),
        S = m("a", f)[0]?.textContent?.trim() || "",
        b = `${i} ${n} ${p} ${S}`.trim(),
        C = `${this.url}torrents.php?id=${d}&torrentid=${s}`,
        M = `${this.url}torrents.php?action=download&id=${s}&authkey=${r}&torrent_pass=${l}`,
        I = this.createTempDiv(a.Time),
        A = m("span", I)[0]?.getAttribute("title") || "",
        k = T(A, ["MMM dd yyyy, HH:mm"]),
        H = _(a.Size),
        w = parseFloat(a.Seeders),
        z = parseFloat(a.Leechers),
        B = parseFloat(a.Snatched),
        F = a.ColorType;
      let c = h.unknown,
        g = 0;
      switch (F) {
        case "seeding":
          ((c = h.seeding), (g = 100));
          break;
        case "snatched":
          ((c = h.completed), (g = 100));
          break;
        case "downloaded":
          c = h.inactive;
          break;
      }
      return {
        site: this.metadata.id,
        id: s,
        category: v,
        title: D,
        subTitle: b,
        url: C,
        link: M,
        time: k,
        size: H,
        seeders: w,
        leechers: z,
        completed: B,
        status: c,
        progress: g,
      };
    }
    return {};
  }
  async transformSearchPage(e, r) {
    const l = [],
      a = m("script", e);
    let d = "";
    for (const n of a)
      if (n.textContent?.includes("var PageData")) {
        d = n.textContent;
        break;
      }
    let i = {};
    if (d) {
      const n = d.match(/var PageData\s*=\s*({.*?});/s);
      if (n && n[1])
        try {
          i = JSON.parse(n[1]);
        } catch (p) {
          console.error("[Site] PassThePopcorn Error parsing PageData:", p);
        }
    }
    if (Array.isArray(i?.Movies)) {
      const n = i.AuthKey,
        p = i.TorrentPass;
      i.Movies.forEach((v) => {
        const s = this.parsePageData(v, n, p);
        s.id && s.title && s.link && l.push(s);
      });
    }
    if (l.length === 0) throw new G();
    return l;
  }
}
export { ie as default, se as siteMetadata };
