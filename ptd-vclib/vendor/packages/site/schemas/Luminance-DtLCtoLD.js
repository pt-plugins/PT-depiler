import { t as d } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { E as o } from "../types/torrent-BvvY2NbA.js";
import { GazelleBase as w } from "./Gazelle-C72SbirH.js";
import { S as n } from "../index-COeZNva1.js";
import { p as c } from "../utils/filesize-D_1hx4u8.js";
import { d as p } from "../utils/filter-Dko2hrfF.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "./AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "./AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const J = {
  version: 0,
  search: {
    requestConfig: { url: "/torrents.php", responseType: "document", params: { action: "advanced" } },
    keywordPath: "params.title",
    selectors: {
      rows: { selector: "table#torrent_table:last tr:gt(0)" },
      id: {
        selector: ["a[href*='torrents.php?id=']"],
        attr: "href",
        filters: [(e) => e.match(/torrents\.php\?id=(\d+)/)[1]],
      },
      title: { selector: ["a[href*='torrents.php?id=']"] },
      subTitle: {
        selector: ["div.tags"],
        elementProcess: (e) => {
          if (!e) return 0;
          const t = e.querySelectorAll("a[href]");
          return Array.from(t)
            .map((s) => (s.textContent || s.innerText || "").trim())
            .filter((s) => s.length > 0)
            .join(", ");
        },
      },
      url: { selector: ["a[href*='torrents.php?id=']"], attr: "href" },
      link: { selector: ["a[href*='torrents.php?action=download']"], attr: "href" },
      time: { selector: ["span.time[title]"], attr: "title", filters: [{ name: "parseTime" }] },
      status: {
        selector: ["a[href*='torrents.php?action=download'] span"],
        text: o.unknown,
        case: {
          "span.icon_disk_seed": o.seeding,
          "span.icon_disk_leech": o.downloading,
          "span.icon_disk_grabbed": o.inactive,
        },
      },
      progress: {
        selector: ["a[href*='torrents.php?action=download'] span"],
        text: 0,
        case: { "span.icon_disk_seed": 100 },
      },
      tags: [
        {
          name: "Free",
          selector:
            "span.icon[title*='Freeleech'], img[alt='Freeleech'], img[src*='freedownload.gif'], i.unlimited_leech",
          color: "blue",
        },
        {
          name: "2xUp",
          selector: "span.icon[title*='DoubleSeed'], img[alt='DoubleSeed'], img[src*='doubleseed.gif']",
          color: "lime",
        },
      ],
    },
  },
  userInfo: {
    pickLast: ["id"],
    process: [
      { requestConfig: { url: "/", responseType: "document" }, fields: ["id"] },
      {
        requestConfig: { url: "/user.php", params: {}, responseType: "document" },
        assertion: { id: "params.id" },
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
      id: { selector: ["a.username"], attr: "href", filters: [{ name: "querystring", args: ["id"] }] },
      name: { selector: ["a.username"] },
      joinTime: {
        selector: ["ul.stats > li:contains('Joined:') > span.time"],
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      lastAccessAt: {
        selector: ["ul.stats > li:contains('Last Seen:') > span"],
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      uploaded: {
        selector: ["ul.stats > li:contains('Uploaded:')"],
        filters: [(e) => c(e.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      downloaded: {
        selector: ["ul.stats > li:contains('Downloaded:')"],
        filters: [(e) => c(e.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      levelName: {
        selector: ["span.rank", "ul.stats > li:contains('Class:')"],
        switchFilters: { "ul.stats > li:contains('Class:')": [{ name: "split", args: [":", 1] }] },
      },
      bonus: {
        selector: ["div[id='bonusdiv'] > h4", "h4:contains('Credits:')"],
        filters: [(e) => parseFloat(e.split(":")[1].trim().replace(/,/g, "") || "0")],
      },
      ratio: {
        selector: ["ul.stats > li:contains('Ratio:') > span"],
        filters: [
          (e) => {
            if (e === "∞") return -1;
            const t = e.replace(/,/g, "");
            return p.parseNumber(t);
          },
        ],
      },
      uploads: {
        selector: ["ul.stats > li[title]:contains('Uploaded:')"],
        filters: [{ name: "split", args: ["[", 0] }, { name: "parseNumber" }],
      },
      bonusPerHour: {
        selector: ["div[id='bonuslog']"],
        elementProcess: (e) => {
          if (!e) return 0;
          const r = e.innerHTML
            .split("<br/>")
            .find((a) => a.includes("hrs"))
            ?.match(/\|\s*[+-]?([\d.,]+)\s*credits\s*\|/);
          return (r ? parseFloat(r?.[1].replace(/,/g, "")) : 0) / 24;
        },
      },
      seeding: {
        selector: ["a[id='nav_seeding'] span[id='nav_seeding_r']", "ul.stats > li:contains('Seeding:')"],
        switchFilters: {
          "a[id='nav_seeding'] span[id='nav_seeding_r']": [(e) => parseInt(e.trim().replace(/,/g, "") || "0")],
          "ul.stats > li:contains('Seeding:')": [{ name: "split", args: ["(", 0] }, { name: "parseNumber" }],
        },
      },
      seedingSize: { selector: "ul.stats > li:contains('Seeding Size:')", filters: [{ name: "parseSize" }] },
      messageCount: {
        selector: ":self",
        elementProcess: (e) =>
          n("a[onmousedown*='inbox'], a[onmousedown*='staffpm']", e).reduce(
            (r, s) => r + p.parseNumber(s.textContent),
            0,
          ),
      },
      posts: { selector: "ul.stats > li:contains('Forum Posts:')", filters: [{ name: "parseNumber" }] },
    },
  },
  list: [{ urlPattern: ["/torrents\\.php(?!\\?id=\\d+$)"] }],
  detail: {
    urlPattern: ["/torrents\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: ["#content > .details > h2", "table.torrent_table tr[id] strong"] },
      id: {
        selector: ["a[href*='/torrents.php?action=download']"],
        attr: "href",
        filters: [(e) => e.match(/id=(\d+)/)[1]],
      },
      link: { selector: ["a[href*='/torrents.php?action=download']"], attr: "href" },
    },
  },
};
class O extends w {
  guessSearchFieldIndexConfig() {
    return {
      size: ["td:has(a[href*='order_by=size'])", "td:contains('Size')"],
      seeders: ["td:has(a[href*='order_by=seeders'])"],
      leechers: ["td:has(a[href*='order_by=leechers'])"],
      completed: ["td:has(a[href*='order_by=snatched'])"],
      comments: ["td:contains('Comm')", "td:has(i.fa-comment)"],
      author: ["td:contains('Uploader')"],
    };
  }
  async transformSearchPage(t, r) {
    const { keywords: s, searchEntry: a, requestConfig: m } = r;
    if (t instanceof Document) {
      const l = "table#torrent_table:last";
      a.selectors?.rows || (a.selectors.rows = { selector: `${l} tr:gt(0)` });
      const u = `${l} tr:first > td`;
      n(u, t).forEach((f, h) => {
        let i;
        for (const [g, S] of Object.entries(this.guessSearchFieldIndexConfig()))
          for (const b of S)
            if (n.matchesSelector(f, b)) {
              i = g;
              break;
            }
        i && (a.selectors[i] = d({ selector: [`> td:eq(${h})`] }, a.selectors[i] || {}));
      });
    }
    return await super.transformSearchPage(t, { keywords: s, searchEntry: a, requestConfig: m });
  }
  async getTorrentDownloadLink(t) {
    return this.getTorrentDownloadLinkFactory("id")(t);
  }
  async parseUserInfoForSeedingSize(t, r) {
    let s =
      this.metadata.userInfo?.selectors?.seedingSize &&
      this.getFieldData(r, this.metadata.userInfo.selectors.seedingSize);
    return ((t.seedingSize = s), s || (t = d(t, await this.getSeedingSize(t.id))), t);
  }
}
export { J as SchemaMetadata, O as default };
