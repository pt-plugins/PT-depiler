import {
  bK as p,
  bO as b,
  bz as T,
  k as g,
  S as u,
  u as D,
  aB as L,
  aE as F,
  bD as q,
  bl as R,
  a7 as h,
  bQ as $,
} from "../index-COeZNva1.js";
import { u as w, a as v, p as E } from "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import { t as c } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { C as k, N as y, E as l, a as S } from "../types/base-Dy_28wGT.js";
import { E as N } from "../types/torrent-BvvY2NbA.js";
import { e as U } from "../utils/datetime-DQxMK7bP.js";
import { p as z } from "../utils/filesize-D_1hx4u8.js";
import { f as O, d as x, t as d } from "../utils/filter-Dko2hrfF.js";
import { h as M } from "../utils/helper-OCngMtkv.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
const ee = { version: -1, search: {} },
  _ = [
    "id",
    "title",
    "subTitle",
    "url",
    "link",
    "time",
    "size",
    "author",
    "seeders",
    "leechers",
    "completed",
    "comments",
    "category",
    "tags",
    "progress",
    "status",
  ];
class te {
  metadata;
  userConfig;
  constructor(e, t = {}) {
    ((this.metadata = c(e, t.merge ?? {})),
      (this.userConfig = t),
      console?.log(`[Site] ${this.name} Initialized with Metadata: `, this.metadata, "UserConfig: ", this.userConfig));
  }
  get name() {
    return this.userConfig.merge?.name ?? this.metadata.name;
  }
  get url() {
    return this.userConfig.url ?? this.metadata.urls[0];
  }
  get isOnline() {
    return !this.metadata.isDead && !this.userConfig.isOffline;
  }
  get allowSearch() {
    return this.isOnline && !!this.metadata.search && this.userConfig.allowSearch !== !1;
  }
  get downloadInterval() {
    return this.userConfig.downloadInterval ?? this.metadata.download?.interval ?? 0;
  }
  loggedCheck(e) {
    return !0;
  }
  async sleepAction(e) {
    e && e > 0 && (await p(e));
  }
  async storeRuntimeSettings(e, t) {
    return (
      (this.userConfig.runtimeSettings ??= {}),
      (this.userConfig.runtimeSettings[e] = t),
      await b(this.metadata.id, e, t),
      t
    );
  }
  async retrieveRuntimeSettings(e) {
    return this.userConfig.runtimeSettings?.[e] ?? (await T(this.metadata.id, e));
  }
  async request(e, t = !0) {
    ((e.baseURL ??= this.url),
      (e.url ??= "/"),
      (e.timeout ??= this.userConfig.timeout ?? 3e4),
      await this.sleepAction(this.metadata.requestDelay ?? 0));
    let s;
    try {
      if (((s = await g.request(e)), e.responseType === "document")) {
        const a = s.data;
        (a instanceof Document &&
          a.documentElement.outerHTML.search("__cf_email__") &&
          u(".__cf_email__", a).forEach((r) => {
            r.replaceWith(D(r.dataset.cfemail));
          }),
          (s.data = a));
      }
    } catch (a) {
      s = a.response;
    }
    if (L(s)) throw new k();
    if (t && !this.loggedCheck(s)) throw new y();
    if (s.status >= 400) throw Error(`Network Error: ${s.status} ${s.statusText || ""}`.trim());
    return s;
  }
  async getSearchResult(e, t = {}) {
    console?.log(`[Site] ${this.name} start search with keywords:`, e, "input searchEntry:", t);
    const s = { data: [], status: l.unknownError };
    if (!this.allowSearch) return ((s.status = l.passParse), (s.statusMsg = "i18n.siteNotEnabled"), s);
    if (
      (t.id && (t = c(this.metadata.searchEntry?.[t.id] ?? {}, t)),
      (F(t) || t.merge !== !1) && (t = c(this.metadata.search, t)),
      t.enabled === !1)
    )
      return ((s.status = l.passParse), (s.statusMsg = "i18n.searchEntityNotEnabled"), s);
    if (
      (console?.log(`[Site] ${this.name} start search with merged searchEntry:`, t),
      t.skipWhiteSpacePlaceholder === !0 && !e)
    )
      return (
        console?.log(`[Site] ${this.name} skipped due to empty keywords`),
        (s.status = l.passParse),
        (s.statusMsg = "i18n.noEmptyKeywords"),
        s
      );
    if (t.skipNonLatinCharacters === !0 && e && M(e))
      return (
        console?.log(`[Site] ${this.name} skipped due to non-Latin characters in query:`, e),
        (s.status = l.passParse),
        (s.statusMsg = "i18n.noNonLatin"),
        s
      );
    let a = c({ url: "/", responseType: "document", params: {}, data: {} }, t.requestConfig || {}),
      i = !1;
    if (e) {
      const r = Object.keys(t.advanceKeywordParams ?? {});
      for (const o of w(r, $))
        if (e.startsWith(`${o}|`)) {
          e = e?.replace(`${o}|`, "");
          let n = t?.advanceKeywordParams?.[o];
          if ((typeof n > "u" && (o == "imdb" ? (n = { enabled: !0 }) : (n = !1)), n === !1 || n.enabled === !1))
            return ((s.status = l.passParse), (s.statusMsg = "i18n.noAdvanceParams"), s);
          i = n;
          break;
        }
    }
    (e && q(a, t.keywordPath || "params.keywords", e || ""),
      i &&
        (i.requestConfig && (a = c(a, i.requestConfig || {})),
        typeof i.requestConfigTransformer == "function" &&
          (a = i.requestConfigTransformer({ keywords: e, searchEntry: t, requestConfig: a }))),
      typeof t.requestConfigTransformer == "function" &&
        (a = t.requestConfigTransformer({ keywords: e, searchEntry: t, requestConfig: a })),
      (t.requestDelay ?? 0) > 0 && (await p(t.requestDelay)),
      console?.log(`[Site] ${this.name} start search with requestConfig:`, a));
    try {
      const r = await this.request(a);
      ((s.data = await this.transformSearchPage(r.data, { keywords: e, searchEntry: t, requestConfig: a })),
        (s.status = l.success));
    } catch (r) {
      ((s.status = l.parseError),
        r instanceof k
          ? (s.status = l.CFBlocked)
          : r instanceof y
            ? (s.status = l.needLogin)
            : r instanceof S && (s.status = l.noResults));
    }
    return s;
  }
  fixLink(e, t) {
    let s = e;
    if (e.length > 0 && !e.startsWith("magnet:")) {
      if (e.startsWith("//")) s = `${new URL(t.baseURL || this.url).protocol}:${e}`;
      else if (e.slice(0, 4) !== "http") {
        const a = g.getUri(t);
        s = new URL(e, a).toString();
      }
    }
    return s;
  }
  getFieldsData(e, t, s) {
    const a = {};
    s || (s = Object.keys(t));
    for (const [i, r] of Object.entries(R(t, s))) a[i] = this.getFieldData(e, r);
    return a;
  }
  getFieldData(e, t) {
    let s;
    if (t.selector) {
      let a;
      const i = [].concat(t.selector);
      for (a of i) {
        if (((s = void 0), e instanceof Node)) {
          const r = a === ":self" ? e : u(a, e)[0];
          if (r)
            if (t.elementProcess) s = this.runQueryFilters(r, t.elementProcess);
            else if (t.case) {
              for (const [o, n] of Object.entries(t.case))
                if (u.matchesSelector(r, o)) {
                  s = n ?? s;
                  break;
                }
            } else
              t.data
                ? (s = r.dataset[t.data] ?? s)
                : t.attr
                  ? (s = r.getAttribute(t.attr) ?? s)
                  : (s = (r.innerText ?? r.textContent).replace(/\n/gi, " ") || s);
        } else s = a === ":self" ? e : h(e, a);
        if (typeof s < "u") break;
        a = void 0;
      }
      typeof a < "u" &&
        (typeof s == "string" && (s = s.trim()),
        i.length > 0 && t.switchFilters?.[a]
          ? (s = this.runQueryFilters(s, t.switchFilters[a]))
          : t.filters && t.filters?.length > 0 && (s = this.runQueryFilters(s, t.filters)));
    }
    return (
      (s ??= t.text ?? ""),
      typeof s == "string"
        ? ((s = s.trim()), /^-?\d+$/.test(s) && (s = isNaN(parseInt(s)) ? 0 : parseInt(s)))
        : typeof s == "number" && (s = isNaN(s) ? 0 : s),
      s
    );
  }
  runQueryFilters(e, t) {
    const s = [].concat(t);
    for (const a of s)
      if (typeof a == "function") e = a(e);
      else if (a?.name) {
        const { name: i, args: r = [] } = a;
        O.includes(i) && (e = x[i](e, r));
      }
    return e;
  }
  findElementsBySelectors(e, t, s = {}) {
    const a = [].concat(e);
    let i = [];
    for (const r of a)
      if (
        (s.isJson || !(t instanceof Document) ? (r === ":self" ? (i = t) : (i = h(t, r))) : (i = u(r, t)),
        i && i.length > 0)
      )
        break;
    return i || [];
  }
  async transformSearchPage(e, t) {
    const { searchEntry: s, requestConfig: a } = t;
    if (!s.selectors?.rows) throw Error("列表选择器未定义");
    const i = s.selectors.rows,
      r = [];
    let o = this.findElementsBySelectors(i.selector, e, { isJson: !(e instanceof Document) });
    if (e instanceof Document)
      if (i.filter) o = i.filter(o);
      else {
        const n = i.merge || 1;
        if (o.length > 0 && n > 1) {
          const f = [];
          (v(o, n).forEach((P) => {
            const m = e.createElement("div");
            (P.forEach((C) => {
              m.appendChild(C);
            }),
              f.push(m));
          }),
            (o = f));
        }
      }
    else i.filter && (o = i.filter(o));
    if (o.length === 0) throw new S();
    for (const n of o)
      try {
        r.push(await this.parseWholeTorrentFromRow({}, n, t));
      } catch (f) {
        throw (console.error(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, f, n), f);
      }
    return r;
  }
  async parseWholeTorrentFromRow(e = {}, t, s) {
    const { searchEntry: a, requestConfig: i } = s,
      r = Object.keys(a.selectors).filter((o) => o !== "rows");
    for (const o of w(r, _)) {
      if (Object.hasOwn(e, o)) continue;
      const n = `parseTorrentRowFor${E(o)}`;
      n in this && typeof this[n] == "function"
        ? (e = await this[n](e, t, s))
        : a.selectors[o] && (e[o] = this.getFieldData(t, a.selectors[o]));
    }
    return (
      (e.site ??= this.metadata.id),
      (e.id ??= d(e.url || e.link)),
      typeof e.url < "u" && (e.url = this.fixLink(e.url, i)),
      typeof e.link < "u" && (e.link = this.fixLink(e.link, i)),
      typeof e.size == "string" && (e.size = z(e.size)),
      typeof e.size < "u" && (e.size = d(e.size)),
      typeof e.seeders < "u" && (e.seeders = d(e.seeders)),
      typeof e.leechers < "u" && (e.leechers = d(e.leechers)),
      typeof e.completed < "u" && (e.completed = d(e.completed)),
      typeof e.comments < "u" && (e.comments = d(e.comments)),
      typeof e.category < "u" && (e.category = d(e.category)),
      typeof e.status > "u" && (e.status = N.unknown),
      this.metadata.timezoneOffset && typeof e.time < "u" && (e.time = U(e.time, this.metadata.timezoneOffset)),
      (e = this.fixParsedTorrent(e, t, s)),
      e
    );
  }
  parseTorrentRowForTags(e, t, s) {
    if (s?.searchEntry?.selectors?.tags) {
      const a = [];
      (s.searchEntry.selectors.tags.forEach(({ name: i, color: r, selector: o }) => {
        t instanceof Element
          ? u(o, t).length > 0 && a.push({ name: i, color: r })
          : h(t, o) && a.push({ name: i, color: r });
      }),
        (e.tags = a));
    }
    return e;
  }
  fixParsedTorrent(e, t, s) {
    return e;
  }
  async transformListPage(e) {
    const t = { keywords: "", torrents: [] },
      s = e.URL || location.href,
      a = { selectors: {}, ...(this.metadata.search ?? {}) };
    for (const i of this.metadata.list ?? []) {
      const { urlPattern: r = [], selectors: o = {}, mergeSearchSelectors: n = !0 } = i;
      if (r.some((f) => new RegExp(f, "i").test(s))) {
        a.selectors = { ...(n ? a.selectors : {}), ...o };
        break;
      }
    }
    if (a.selectors.keywords) ((t.keywords = this.getFieldData(e, a.selectors.keywords)), delete a.selectors.keywords);
    else {
      const i = a.keywordPath || "params.keywords",
        [r, o] = i.split(".");
      if (
        ((t.keywords = this.getFieldData(e, {
          selector: [
            r === "params" ? `input[name="${o}"]` : !1,
            r === "data" ? `form[method="post" i] input[name="${r}"]` : !1,
          ].filter(Boolean),
          elementProcess: (n) => n.value,
          text: "",
        })),
        t.keywords === "")
      ) {
        const n = new URLSearchParams(s.split("?")[1] ?? "");
        for (const f of [o, "search", "keywords", "keyword", "q"].filter(Boolean))
          if (n.has(f)) {
            t.keywords = n.get(f) || "";
            break;
          }
      }
    }
    try {
      t.torrents = await this.transformSearchPage(e, { searchEntry: a, requestConfig: { url: s } });
    } catch (i) {
      console.error(`[PTD] site '${this.name}' transformListPage Error:`, i);
    }
    return t;
  }
  async transformDetailPage(e) {
    let t = { site: this.metadata.id };
    const s = e.cloneNode(!0),
      a = this.metadata.detail?.selectors || {};
    if (((t = c(t, this.getFieldsData(s, a))), t.url || (t.url = s.URL || location.href), !t.id)) {
      const i = new URLSearchParams(t.url.split("?")[1] ?? "");
      for (const r of ["tid", "id"])
        if (i.has(r)) {
          t.id = i.get(r) || "";
          break;
        }
      t.id || (t.id = t.url);
    }
    return (
      t.title || (t.title = this.getFieldData(s, { text: "", selector: ["html > body > title"] })),
      t.link && (t.link = this.fixLink(t.link, { baseURL: s.URL })),
      t
    );
  }
  async getTorrentDownloadLink(e) {
    if (!e.link && this.metadata?.detail?.selectors?.link) {
      const { data: t } = await this.request(
        c({ responseType: "document", url: e.url }, this.metadata.detail?.requestConfig ?? {}),
      );
      e.link = this.getFieldData(t, this.metadata.detail.selectors.link);
    }
    return (
      this.userConfig.downloadLinkAppendix && (e.link = `${e.link}${this.userConfig.downloadLinkAppendix}`),
      e.link
    );
  }
  async getTorrentDownloadRequestConfig(e) {
    const t = await this.getTorrentDownloadLink(e);
    return c(
      { baseURL: this.url, url: t, method: "GET", timeout: this.userConfig.timeout ?? 3e4 },
      this.metadata.download?.requestConfig ?? {},
    );
  }
}
export { ee as SchemaMetadata, te as default };
