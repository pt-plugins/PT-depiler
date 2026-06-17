import C, { SchemaMetadata as c } from "../schemas/Gazelle-C72SbirH.js";
import { E as h } from "../types/base-Dy_28wGT.js";
import { E as x } from "../types/torrent-BvvY2NbA.js";
import "../index-COeZNva1.js";
import { p as B } from "../utils/filesize-D_1hx4u8.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const F = {
  ...c,
  version: 1,
  id: "broadcasthenet",
  name: "BroadcastTheNet",
  aka: ["BTN"],
  description: "BroadcastTheNet is a private tracker for TV shows.",
  tags: ["电视剧"],
  timezoneOffset: "+0000",
  collaborator: ["Sunhelter"],
  type: "private",
  schema: "Gazelle",
  urls: ["uggcf://oebnqpnfgur.arg/"],
  search: {
    ...c.search,
    skipNonLatinCharacters: !0,
    keywordPath: "params.artistname",
    requestConfig: { url: "/torrents.php", responseType: "document", params: { action: "advanced" } },
    advanceKeywordParams: { imdb: { enabled: !0 } },
    selectors: {
      ...c.search.selectors,
      url: { selector: "a[href*='torrents.php?id='][href*='torrentid=']", attr: "href" },
      title: { selector: "span[style='float:none;']", attr: "title" },
      category: { selector: "a[href*='filter_cat'] img", attr: "title" },
      time: {
        selector: "div.nobr:contains('Added:')",
        filters: [
          (a) => {
            const e = a.match(/Added:\s*(.+)/);
            return e ? e[1].trim() : a.trim();
          },
          { name: "parseTTL" },
        ],
      },
      tags: [{ name: "H&R", selector: "*", color: "red" }],
    },
  },
  userInfo: {
    ...c.userInfo,
    process: [
      { requestConfig: { url: "/index.php", responseType: "document" }, fields: ["id", "name", "messageCount"] },
      {
        requestConfig: { url: "/user.php", params: {}, responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "uploaded",
          "uploads",
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "bonusPerHour",
          "joinTime",
          "seeding",
          "seedingSize",
          "seedingTime",
          "totalTraffic",
          "snatches",
          "hnrUnsatisfied",
          "lastAccessAt",
        ],
      },
      {
        requestConfig: {
          url: "/snatchlist.php",
          params: { type: "ajax", sort: "seedtimeleft", page: 1 },
          responseType: "document",
        },
        assertion: { id: "params.id" },
        fields: ["hnrPreWarning"],
      },
    ],
    selectors: {
      ...c.userInfo.selectors,
      uploaded: { selector: "ul.nobullet > li:contains('Upload:')", filters: [{ name: "parseSize" }] },
      uploads: { selector: "ul.nobullet > li:contains('Uploaded:')", filters: [{ name: "parseNumber" }] },
      downloaded: { selector: "ul.nobullet > li:contains('Downloaded:')", filters: [{ name: "parseSize" }] },
      levelName: {
        selector: "ul.nobullet > li:contains('User Class:')",
        filters: [(a) => a.replace("User Class:", "").trim()],
      },
      bonus: { selector: "ul.nobullet > li:contains('Bonus Points:') > a", filters: [{ name: "parseNumber" }] },
      bonusPerHour: {
        selector: "ul.nobullet > li:contains('Per Day:')",
        filters: [{ name: "parseNumber" }, { name: "divide", args: [24] }],
      },
      ratio: void 0,
      joinTime: { selector: "ul.nobullet > li:contains('Joined:') > span", filters: [{ name: "parseTTL" }] },
      lastAccessAt: {
        selector: "ul.nobullet > li:contains('Last Seen:') > span",
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm"] }],
      },
      seeding: { selector: "ul.nobullet > li:contains('Seeding:')", filters: [{ name: "parseNumber" }] },
      seedingSize: { selector: "ul.nobullet > li:contains('Seeding Size:')", filters: [{ name: "parseSize" }] },
      totalTraffic: { selector: "ul.nobullet > li:contains('Total Traffic:')", filters: [{ name: "parseSize" }] },
      snatches: {
        selector: "ul.nobullet:has( > li:contains('Snatched:'))",
        elementProcess: (a) => {
          const e = Array.from(a.querySelectorAll("li"));
          let r = 0;
          return (
            e.forEach((n) => {
              const t = n.textContent || "";
              if (t.includes("Snatched:")) {
                const o = t.match(/Snatched:\s*(\d+)/);
                o && (r += parseInt(o[1]));
              }
            }),
            r
          );
        },
      },
      hnrUnsatisfied: { selector: "ul.nobullet > li:contains('HnRs:') > a", filters: [{ name: "parseNumber" }] },
      hnrPreWarning: {
        selector: ["table:has(tr.colhead_dark)"],
        elementProcess: (a) => {
          const e = Array.from(a.querySelectorAll("tr[id^='snatch']"));
          let r = 0;
          return (
            e.forEach((n) => {
              const t = n.querySelector("td:nth-child(5)");
              t && t.textContent && !t.textContent.includes("Complete") && r++;
            }),
            r
          );
        },
      },
      seedingTime: {
        selector: "ul.nobullet > li:contains('Total Time Seeded:')",
        filters: [
          (a) => {
            const e = a.match(/Total Time Seeded:\s*([\d,]+)\s*Days/i);
            return e ? parseInt(e[1].replace(/,/g, "")) * 24 * 3600 : 0;
          },
        ],
      },
    },
  },
  levelRequirements: [
    {
      id: 1,
      name: "Member",
      totalTraffic: "100GB",
      bonus: 1e5,
      snatches: 100,
      interval: "P2W",
      privilege: "Can access the XXX forum.",
    },
    {
      id: 2,
      name: "Power User",
      totalTraffic: "250GB",
      bonus: 25e4,
      snatches: 250,
      interval: "P1M",
      privilege:
        "Has access to the Power User forum, Official and Unofficial Invites forums, Top 10 filters, and can access notifications.",
    },
    {
      id: 3,
      name: "Extreme User",
      totalTraffic: "500GB",
      bonus: 5e5,
      snatches: 500,
      interval: "P3M",
      privilege: "Has access to the Extreme User forum.",
    },
    {
      id: 4,
      name: "Elite",
      totalTraffic: "1TB",
      bonus: 85e4,
      snatches: 1e3,
      interval: "P6M",
      privilege:
        "Has access to the Elite forum and can set own Custom Title, and the ability to send invites purchased from the Lumens Store.",
    },
    {
      id: 5,
      name: "Guru",
      totalTraffic: "2.5TB",
      bonus: 15e5,
      snatches: 1500,
      interval: "P9M",
      privilege: "Has access to the Guru forum.",
    },
    {
      id: 6,
      name: "Master",
      totalTraffic: "7.5TB",
      bonus: 3e6,
      snatches: 3e3,
      interval: "P1Y",
      privilege: "Has access to the Master forum.",
    },
    {
      id: 7,
      name: "Overlord",
      totalTraffic: "100TB",
      bonus: 25e7,
      snatches: 3e3,
      uploads: 500,
      interval: "P3Y",
      seedingTime: "P250000D",
      isKept: !0,
      privilege:
        "Has access to the Overlord forum, Custom Title, Unlimited Invites, and immunity from Inactivity Pruning.",
    },
  ],
};
class K extends C {
  async getSeriesPageFromIMDB(e) {
    try {
      const r = await this.request({ url: `/torrents.php?imdb=${e}`, responseType: "document" }),
        n = r.data,
        t = r.request?.responseURL || n.URL || "";
      return t.includes("series.php")
        ? { document: n, pageUrl: t }
        : (console.log(`[BroadcastTheNet] IMDB search for ${e} did not redirect to series.php, no results found`),
          null);
    } catch (r) {
      return (console.log(`[BroadcastTheNet] IMDB search failed for IMDB ID: ${e}. Error:`, r), null);
    }
  }
  parseSeriesPageTorrents(e, r) {
    const n =
        e.querySelector("div.sidebar > .box > .head > strong")?.textContent?.trim() ||
        e.querySelector("h2")?.textContent?.trim() ||
        "",
      t = [];
    let o = "",
      m = "";
    const i = (s) => (s || "").replace(/\s+/g, " ").trim(),
      g = (s) => {
        if (s) return new URL(s, r || "https://broadcasthe.net/series.php").toString();
      },
      p = (s) => {
        const l = Number.parseInt(i(s?.textContent).replace(/,/g, ""), 10);
        return Number.isNaN(l) ? void 0 : l;
      };
    return (
      e.querySelectorAll("table.torrent_table tr").forEach((s) => {
        if (s.classList.contains("colhead_dark")) {
          ((o = i(s.querySelector("strong")?.textContent)), (m = ""));
          return;
        }
        if (!s.classList.contains("group_torrent")) return;
        const l = s.querySelector("a[href*='torrents.php?id='][href*='torrentid=']"),
          b = s.querySelector("a[href*='torrents.php?action=download']");
        if (!l || !b) return;
        const T = s.querySelector("a.season"),
          S = i(s.querySelector(".year")?.textContent);
        (T && (o = i(T.textContent)), S && (m = S));
        const u = Array.from(s.children),
          y = i(u.at(-4)?.textContent),
          v = i(l.textContent),
          P = [n, m, o, v].filter(Boolean).join(" "),
          d = g(l.getAttribute("href")),
          f = g(b.getAttribute("href"));
        !d ||
          !f ||
          t.push({
            site: this.metadata.id,
            id: new URL(f).searchParams.get("id") || new URL(d).searchParams.get("torrentid") || d,
            title: P,
            subTitle: v,
            url: d,
            link: f,
            size: y ? B(y) : void 0,
            completed: p(u.at(-3)),
            seeders: p(u.at(-2)),
            leechers: p(u.at(-1)),
            progress: 0,
            status: x.unknown,
            tags: [{ name: "H&R", color: "red" }],
          });
      }),
      t
    );
  }
  async getSearchResult(e, r = {}) {
    if (e?.startsWith("imdb|")) {
      const n = e.replace("imdb|", ""),
        t = await this.getSeriesPageFromIMDB(n);
      if (!t) return { data: [], status: h.noResults };
      const o = this.parseSeriesPageTorrents(t.document, t.pageUrl);
      return { data: o, status: o.length > 0 ? h.success : h.noResults };
    }
    return await super.getSearchResult(e, r);
  }
}
export { K as default, F as siteMetadata };
