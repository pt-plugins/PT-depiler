import { S as w } from "../index-COeZNva1.js";
import { t as P } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import F from "./AbstractPrivateSite-kkMcHSoo.js";
import { f as C, p as z } from "../utils/datetime-DQxMK7bP.js";
import { p as k } from "../utils/filesize-D_1hx4u8.js";
import { a as D } from "../types/base-Dy_28wGT.js";
import { E as U } from "../types/torrent-BvvY2NbA.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "./AbstractBittorrentSite-YCyl9e_L.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const b = {
    extractTags(n, e = [], t = " / ") {
      const s = n.split(t);
      return s.length < 1 ? "" : b.filterTags(s, e).join(t);
    },
    filterTags(n, e = []) {
      const t = ["Freeleech", "Neutral", "Seeding", "Snatched", "Reported", "Trumpable"],
        s = [];
      return (
        n.forEach((r) => {
          [...e, ...t].some((o) => r.toLowerCase().includes(o.toLowerCase())) || s.push(r.trim());
        }),
        s
      );
    },
    genTitleElementProcess({
      tdSelector: n = "td:has(a[href*='torrents.php?id=']):has(.tags)",
      extractTagsFunc: e,
    } = {}) {
      const t = e ?? b.extractTags;
      return (s) => {
        const o = s.querySelector(n).cloneNode(!0),
          i = o.querySelector("a[href*='torrents.php?id=']");
        if (!i) return "";
        const a = i.textContent;
        let l = i.previousSibling;
        for (; l; ) {
          const u = l.previousSibling;
          (l.remove(), (l = u));
        }
        (i.remove(), o.querySelectorAll("span").forEach((u) => u.remove()));
        let f = "";
        const h = Array.from(o.textContent.trim().matchAll(/\[([^\]]+)\]/g));
        h.length > 0 &&
          (f = h
            .map((u) => {
              const p = t(u[1]);
              return p ? `[${p}]` : "";
            })
            .filter(Boolean)
            .join(" "));
        const T = Array.from(s.querySelectorAll("a[href*='artist.php']"))
          .map((u) => u.textContent.trim())
          .filter(Boolean)
          .join(" & ");
        return [T && `${T} -`, a, f].filter(Boolean).join(" ");
      };
    },
  },
  L = { selector: "table.torrent_table tr:gt(0)" },
  E = {
    text: 0,
    elementProcess: (n) => {
      let e = 0;
      try {
        const t = n.querySelector("span[title], time[title]");
        t
          ? (e = C(t.getAttribute("title")))
          : n.getAttribute("title")
            ? (e = C(n.getAttribute("title")))
            : ((e = n.innerText.trim()), e.toLowerCase().includes("just now") && (e = "0 seconds"), (e = z(e)));
      } catch {}
      return e;
    },
  },
  q = "isDetailPage",
  v = {
    urlPattern: [/\/torrents\.php(?!.*(?:\bid=|torrentid=))/, "/collages\\.php\\?id=\\d+", "/artist\\.php\\?id=\\d+"],
  },
  R = {
    urlPattern: [/\/torrents\.php\?(?:.*&)?(\bid|torrentid)=\d+/],
    selectors: {
      keywords: { selector: ["span[dir='ltr']"] },
      title: { selector: ["div > h2"] },
      rows: { ...L, filter: (n) => (Array.isArray(n) && n.length > 0 && (n[0].dataset[q] = "1"), n) },
      time: { ...E, selector: "+tr span.time" },
    },
  },
  G = {
    urlPattern: ["/top10\\.php"],
    excludeUrlPattern: [/\/top10\.php\?type=(?!torrents\b).*/],
    selectors: {
      rows: {
        ...L,
        filter: (n) => (
          Array.isArray(n) &&
            n.forEach((e) => {
              e.className = "torrent";
            }),
          n
        ),
      },
    },
  },
  m = { stats: ["Stats", "Statistics"], personal: ["Personal"], community: ["Community"] };
function g(n, e, t) {
  const s = [].concat(n),
    r = [].concat(e);
  return s.flatMap((o) => r.map((i) => `div:contains('${o}') + ul.stats > li:contains('${i}')${t ? ` ${t}` : ""}`));
}
const ae = {
  version: 0,
  search: {
    keywordPath: "params.searchstr",
    requestConfig: { url: "/torrents.php", responseType: "document", params: { searchsubmit: 1 } },
    selectors: {
      rows: L,
      id: {
        selector: ["a[href*='torrents.php?action=download']:first", "a[href*='torrents.php?id=']"],
        attr: "href",
        filters: [{ name: "querystring", args: ["torrentid", "id"] }],
      },
      title: { selector: ":self", elementProcess: b.genTitleElementProcess() },
      subTitle: {
        selector: [".tags", "> td:has(a[href*='torrents.php']) a:not(span a):last"],
        switchFilters: { ".tags": [], "> td:has(a[href*='torrents.php']) a:not(span a):last": [b.extractTags] },
      },
      url: { selector: ["a[href*='torrents.php?id=']", "a[href*='torrents.php?torrentid=']"], attr: "href" },
      link: { selector: "a[href*='torrents.php?action=download']:first", attr: "href" },
      time: E,
      progress: { text: 0 },
      status: { text: U.unknown },
      tags: [{ selector: "strong:contains('Freeleech!')", name: "Free", color: "blue" }],
    },
  },
  list: [{ ...v }, { ...R }, { ...G }],
  userInfo: {
    pickLast: ["id"],
    process: [
      { requestConfig: { url: "/index.php", responseType: "document" }, fields: ["id"] },
      {
        requestConfig: { url: "/user.php", params: {}, responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "name",
          "messageCount",
          "uploaded",
          "downloaded",
          "ratio",
          "levelName",
          "bonus",
          "joinTime",
          "lastAccessAt",
          "seeding",
          "seedingSize",
          "uploads",
        ],
      },
    ],
    selectors: {
      id: {
        selector: ["a.username[href*='user.php']:first"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: { selector: ["a.username[href*='user.php']:first"] },
      messageCount: {
        selector: ":self",
        elementProcess: (n) => {
          const e = /have (\d+|a) new/;
          let t = 0;
          const s = (o) => {
              const i = o.textContent.match(e);
              t += i ? (i[1] === "a" ? 1 : parseInt(i[1])) : 0;
            },
            r = n.querySelector("#alerts");
          return (
            r && r.querySelectorAll("a[href*='inbox.php'], a[href*='staffpm.php']").forEach(s),
            (!r || !t) &&
              n
                .querySelectorAll(
                  ".noty-notification[data-noty-url*='inbox.php'], .noty-notification[data-noty-url*='staffpm.php']",
                )
                .forEach(s),
            t
          );
        },
      },
      uploaded: { selector: g(m.stats, "Uploaded"), filters: [{ name: "parseSize" }] },
      downloaded: { selector: g(m.stats, "Downloaded"), filters: [{ name: "parseSize" }] },
      ratio: { selector: g(m.stats, "Ratio:"), filters: [{ name: "parseNumber" }] },
      levelName: { selector: g(m.personal, "Class:"), filters: [{ name: "split", args: [":", 1] }] },
      bonus: { selector: g(m.stats, "Bonus Points:"), filters: [{ name: "parseNumber" }] },
      joinTime: { selector: g(m.stats, "Joined:", "> span"), attr: "title", filters: [{ name: "parseTime" }] },
      lastAccessAt: {
        selector: g(m.stats, ["Last seen", "Last Seen"], "> span"),
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      uploads: { selector: g(m.community, "Uploaded"), filters: [{ name: "parseNumber" }] },
    },
  },
};
class N extends F {
  async getSeedingSize(e, t = 0) {
    const s = { seedingSize: 0 },
      r = { count: 1, current: 1 };
    for (; r.current <= r.count; r.current++) {
      await this.sleepAction(this.metadata.userInfo?.requestDelay);
      const o = await this.getUserTorrentList(e, r.current);
      if (
        (r.current === 1 &&
          (r.count = this.getFieldData(o, {
            selector: ["a[href*='torrents.php?page=']:contains('Last'):first"],
            attr: "href",
            filters: [{ name: "querystring", args: ["page"] }, (a) => (a ? parseInt(a) : -1)],
          })),
        t === 0)
      ) {
        const a = this.getFieldData(o, {
          selector: [
            "tr.colhead > td > a:contains('Size')",
            "tr.colhead > td > a[href*='Size']",
            "tr.colhead > td > a[href*='size']",
            "tr.colhead > td > a[href*='s4']",
          ],
          elementProcess: (l) => l.parentNode,
        });
        if (a && a.parentNode) t = Array.from(a.parentNode.children).indexOf(a);
        else return s;
      }
      w("tr.torrent", o).forEach((a) => {
        const l = w(`td:nth-child(${t + 1})`, a);
        l && l.length >= 0 && (s.seedingSize += k(l[0].innerText.trim().replace(/,/g, "")));
      });
    }
    return s;
  }
  async getUserTorrentList(e, t = 1, s = "seeding") {
    const { data: r } = await this.request({
      url: "/torrents.php",
      params: { userid: e, page: t, type: s },
      responseType: "document",
    });
    return r;
  }
  getTorrentDownloadLinkFactory(e) {
    return async (t) => {
      const s = await super.getTorrentDownloadLink(t),
        r = URL.parse(s);
      if (!r) return s;
      const o = r.searchParams;
      if (o.get("action") === "download") return s;
      const i = o.get(e);
      if (!i) return s;
      const a = new URL(r.pathname, this.url);
      return (a.searchParams.set("action", "download"), a.searchParams.set("id", i), a.toString());
    };
  }
}
class ie extends N {
  get torrentClasses() {
    return { group: ["group", "group_redline"], unGroupTorrent: ["torrent", "torrent_redline"] };
  }
  guessSearchFieldIndexConfig() {
    return {
      time: ["a[href*='order_by=time']"],
      size: ["a[href*='order_by=size']", "td:contains('Size')"],
      seeders: ["a[href*='order_by=seeders']", "[alt='Seeders']", "img[src*='seeders']"],
      leechers: ["a[href*='order_by=leechers']", "[alt='Leechers']", "img[src*='leechers']"],
      completed: ["a[href*='order_by=snatched']", "[alt='Snatches']", "img[src*='snatched']"],
    };
  }
  async transformSearchPage(e, t) {
    const { keywords: s, searchEntry: r, requestConfig: o } = t,
      i = "table.torrent_table:last";
    r.selectors?.rows || (r.selectors.rows = { selector: `${i} tr:gt(0)` });
    const a = `${i} tr:first > td`,
      l = w(a, e);
    let f = 0;
    l.forEach((p, y) => {
      let S;
      f += Math.max(0, p.colSpan - 1);
      for (const [d, A] of Object.entries(this.guessSearchFieldIndexConfig()))
        for (const x of A)
          if (w(x, p).length > 0 || w.matchesSelector(p, x)) {
            S = d;
            break;
          }
      S && (r.selectors[S] = P({ selector: [`> td:eq(${y + f})`] }, r.selectors[S] ?? {}));
    });
    const h = r.selectors.rows;
    let c = this.findElementsBySelectors(h.selector, e);
    if ((h.filter && (c = h.filter(c)), c.length === 0)) throw new D();
    if (c[0].dataset[q] === "1")
      return this.transformGroupTorrents(e.documentElement, c, { keywords: s, searchEntry: r, requestConfig: o });
    const T = [],
      u = [...this.torrentClasses.group, ...this.torrentClasses.unGroupTorrent];
    for (let p = 0; p < c.length; p++) {
      const y = c[p],
        S = c[p + 1];
      if (
        this.torrentClasses.group.some((d) => y.classList.contains(d)) &&
        !(S && u.some((d) => S.classList.contains(d)))
      ) {
        const d = $(c, p, u);
        p += d.length - 1;
        const A = await this.transformGroupTorrents(y, d, { keywords: s, searchEntry: r, requestConfig: o });
        T.push(...A);
        continue;
      }
      if (this.torrentClasses.unGroupTorrent.some((d) => y.classList.contains(d))) {
        const d = await this.transformUnGroupTorrent(y, { keywords: s, searchEntry: r, requestConfig: o });
        d && T.push(d);
      }
    }
    return T;
  }
  getTorrentGroupInfo(e, t) {
    return this.getFieldsData(e, t.searchEntry.selectors, ["title", "category"]);
  }
  async transformGroupTorrents(e, t, s) {
    const r = this.getTorrentGroupInfo(e, s);
    let o = 0;
    e instanceof HTMLTableRowElement &&
      (o = Array.from(e.querySelectorAll("td[rowspan]")).reduce((a, l) => a + (l.rowSpan > 1 ? 1 : 0), 0));
    const i = [];
    for (const a of t) {
      const l = this.getFieldData(a, s.searchEntry.selectors.link);
      if (!l) continue;
      let f = o;
      const h = a.querySelector("td[colspan]");
      h && (f += Math.max(0, h.colSpan - 1));
      for (let c = 0; c < f; c++) a.insertCell(0);
      try {
        const c = await this.parseWholeTorrentFromRow({ ...r, link: l }, a, s);
        i.push(c);
      } catch (c) {
        console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, c, a);
      }
    }
    return i;
  }
  async transformUnGroupTorrent(e, t) {
    const s = this.getFieldData(e, t.searchEntry.selectors.link);
    if (!s) return null;
    const r = e.querySelector("td[colspan]");
    if (r) for (let o = 0; o < r.colSpan - 1; o++) e.insertCell(0);
    try {
      return await this.parseWholeTorrentFromRow({ link: s }, e, t);
    } catch (o) {
      console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, o, e);
    }
    return null;
  }
  async getTorrentDownloadLink(e) {
    return this.getTorrentDownloadLinkFactory("torrentid")(e);
  }
  async getUserInfoResult(e = {}) {
    let t = await super.getUserInfoResult(e);
    return (t.id && !t.seedingSize && (t = P(t, await this.getSeedingSize(t.id))), t);
  }
}
function $(n, e, t) {
  const s = [];
  for (let r = e; r < n.length; r++) {
    const o = n[r];
    s.push(o);
    const i = n[r + 1];
    if (i && t.some((a) => i.classList.contains(a))) break;
  }
  return s;
}
export {
  N as GazelleBase,
  b as GazelleUtils,
  ae as SchemaMetadata,
  v as commonPagesList,
  ie as default,
  R as detailPageList,
  G as top10PageList,
};
