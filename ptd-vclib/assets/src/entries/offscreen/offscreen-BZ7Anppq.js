import {
  cd as wt,
  be as l,
  b1 as gt,
  bC as d,
  ac as J,
  aE as k,
  v as j,
  ad as mt,
  c3 as yt,
  N as St,
  af as pt,
  bN as ht,
  b6 as It,
  j as Z,
  P,
  c5 as Dt,
  ah as Tt,
  ag as Et,
} from "../../../../vendor/packages/site/index-COeZNva1.js";
import { u as kt } from "../../../../vendor/es-toolkit/uniqBy-DEckz2wg.js";
import { g as bt } from "../../../../vendor/packages/mediaServer/index-Cmj48V-l.js";
import { g as X, s as vt } from "../../../../vendor/packages/downloader/utils-Qej-F1x7.js";
import { t as tt } from "../../../../vendor/es-toolkit/toMerged-Be-qf92q.js";
import { g as Ct } from "../../../../vendor/packages/downloader/index-BATa0ddy.js";
import { E as M } from "../../../../vendor/packages/site/types/base-Dy_28wGT.js";
import { g as A } from "../../../../vendor/date-fns/format-b1gG6cM7.js";
import { i as Rt } from "../../../../vendor/es-toolkit/intersection-CiePrUGh.js";
import { g as xt } from "../../../../vendor/packages/backupServer/index-D5lXNMXT.js";
import { b as Mt } from "../../../../vendor/packages/backupServer/utils-BmKctBTI.js";
import "../../../../vendor/es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../../../../vendor/jszip/jszip.min-DP3ssR4z.js";
import "../../../_commonjs-dynamic-modules-TDtrdbi3.js";
import "../../../../vendor/crypto-js/index-B0NDMIdm.js";
import "../../../../vendor/es-toolkit/omit-BqXgNNTz.js";
const U = (t, e) => e.some((a) => t instanceof a);
let N, V;
function Ut() {
  return N || (N = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
}
function Lt() {
  return V || (V = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]);
}
const L = new WeakMap(),
  R = new WeakMap(),
  v = new WeakMap();
function _t(t) {
  const e = new Promise((a, n) => {
    const o = () => {
        (t.removeEventListener("success", i), t.removeEventListener("error", r));
      },
      i = () => {
        (a(p(t.result)), o());
      },
      r = () => {
        (n(t.error), o());
      };
    (t.addEventListener("success", i), t.addEventListener("error", r));
  });
  return (v.set(e, t), e);
}
function Bt(t) {
  if (L.has(t)) return;
  const e = new Promise((a, n) => {
    const o = () => {
        (t.removeEventListener("complete", i), t.removeEventListener("error", r), t.removeEventListener("abort", r));
      },
      i = () => {
        (a(), o());
      },
      r = () => {
        (n(t.error || new DOMException("AbortError", "AbortError")), o());
      };
    (t.addEventListener("complete", i), t.addEventListener("error", r), t.addEventListener("abort", r));
  });
  L.set(t, e);
}
let _ = {
  get(t, e, a) {
    if (t instanceof IDBTransaction) {
      if (e === "done") return L.get(t);
      if (e === "store") return a.objectStoreNames[1] ? void 0 : a.objectStore(a.objectStoreNames[0]);
    }
    return p(t[e]);
  },
  set(t, e, a) {
    return ((t[e] = a), !0);
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in t;
  },
};
function et(t) {
  _ = t(_);
}
function Ft(t) {
  return Lt().includes(t)
    ? function (...e) {
        return (t.apply(B(this), e), p(this.request));
      }
    : function (...e) {
        return p(t.apply(B(this), e));
      };
}
function Pt(t) {
  return typeof t == "function" ? Ft(t) : (t instanceof IDBTransaction && Bt(t), U(t, Ut()) ? new Proxy(t, _) : t);
}
function p(t) {
  if (t instanceof IDBRequest) return _t(t);
  if (R.has(t)) return R.get(t);
  const e = Pt(t);
  return (e !== t && (R.set(t, e), v.set(e, t)), e);
}
const B = (t) => v.get(t);
function At(t, e, { blocked: a, upgrade: n, blocking: o, terminated: i } = {}) {
  const r = indexedDB.open(t, e),
    c = p(r);
  return (
    n &&
      r.addEventListener("upgradeneeded", (s) => {
        n(p(r.result), s.oldVersion, s.newVersion, p(r.transaction), s);
      }),
    a && r.addEventListener("blocked", (s) => a(s.oldVersion, s.newVersion, s)),
    c
      .then((s) => {
        (i && s.addEventListener("close", () => i()),
          o && s.addEventListener("versionchange", (u) => o(u.oldVersion, u.newVersion, u)));
      })
      .catch(() => {}),
    c
  );
}
const Ot = ["get", "getKey", "getAll", "getAllKeys", "count"],
  Ht = ["put", "add", "delete", "clear"],
  x = new Map();
function G(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string")) return;
  if (x.get(e)) return x.get(e);
  const a = e.replace(/FromIndex$/, ""),
    n = e !== a,
    o = Ht.includes(a);
  if (!(a in (n ? IDBIndex : IDBObjectStore).prototype) || !(o || Ot.includes(a))) return;
  const i = async function (r, ...c) {
    const s = this.transaction(r, o ? "readwrite" : "readonly");
    let u = s.store;
    return (n && (u = u.index(c.shift())), (await Promise.all([u[a](...c), o && s.done]))[0]);
  };
  return (x.set(e, i), i);
}
et((t) => ({ ...t, get: (e, a, n) => G(e, a) || t.get(e, a, n), has: (e, a) => !!G(e, a) || t.has(e, a) }));
const $t = ["continue", "continuePrimaryKey", "advance"],
  q = {},
  F = new WeakMap(),
  at = new WeakMap(),
  Kt = {
    get(t, e) {
      if (!$t.includes(e)) return t[e];
      let a = q[e];
      return (
        a ||
          (a = q[e] =
            function (...n) {
              F.set(this, at.get(this)[e](...n));
            }),
        a
      );
    },
  };
async function* jt(...t) {
  let e = this;
  if ((e instanceof IDBCursor || (e = await e.openCursor(...t)), !e)) return;
  e = e;
  const a = new Proxy(e, Kt);
  for (at.set(a, e), v.set(a, B(e)); e; ) (yield a, (e = await (F.get(a) || e.continue())), F.delete(a));
}
function W(t, e) {
  return (
    (e === Symbol.asyncIterator && U(t, [IDBIndex, IDBObjectStore, IDBCursor])) ||
    (e === "iterate" && U(t, [IDBIndex, IDBObjectStore]))
  );
}
et((t) => ({
  ...t,
  get(e, a, n) {
    return W(e, a) ? jt : t.get(e, a, n);
  },
  has(e, a) {
    return W(e, a) || t.has(e, a);
  },
}));
const g = At("ptd", 3, {
    upgrade(t, e) {
      (e < 1 && t.createObjectStore("social_information"),
        e < 2 && t.createObjectStore("download_history", { keyPath: "id", autoIncrement: !0 }),
        e < 3 && t.createObjectStore("favicon"));
    },
  }),
  Nt = 500,
  b = wt("logger", []);
function f(t) {
  ((t.id ??= gt()),
    (t.time ??= new Date().getTime()),
    (t.msg = t.msg?.trim()),
    b.value.push(t),
    b.value.length > Nt && b.value.shift());
}
l("logger", ({ data: t }) => f(t));
l("getLogger", async () => b.value);
l("clearLogger", async () => {
  b.value = [];
});
async function nt(t, e = !1) {
  const n = (await d("getExtStorage", "metadata"))?.sites?.[t] ?? {},
    o = await J(t);
  if (e || k(n)) {
    const i = o.isDead ?? !1;
    ((n.isOffline ??= i),
      (n.sortIndex ??= 100),
      (n.allowSearch ??= !i && j(o, "search")),
      (n.allowQueryUserInfo ??= !i && j(o, "userInfo")),
      (n.timeout ??= 3e4));
    const r = {};
    if (o.userInputSettingMeta) for (const c of o.userInputSettingMeta) r[c.name] = "";
    ((n.inputSetting ??= r),
      (n.groups ??= o.tags ?? []),
      (n.downloadInterval ??= o?.download?.interval ?? 0),
      (n.uploadSpeedLimit ??= 0),
      (n.allowContentScript ??= !0),
      (n.downloadLinkAppendix ??= ""),
      (n.merge ??= {}));
  }
  return (f({ msg: `getSiteUserConfig for ${t}`, data: n }), n);
}
l("getSiteUserConfig", async ({ data: { siteId: t, flush: e } }) => await nt(t, e));
l("getSiteList", async () => {
  const t = await d("getExtStorage", "metadata"),
    e = t?.sites ?? {},
    a = t?.siteNameMap ?? {};
  return Promise.all(
    Object.entries(e).map(async ([n, o]) => {
      const r = (await J(n)).isDead ?? !1;
      return { id: n, name: a[n] ?? o.merge?.name ?? n, url: o.url ?? "", offline: (r || o.isOffline) ?? !1 };
    }),
  );
});
async function D(t, e = {}) {
  const { mergeUserConfig: a = !0 } = e;
  let n = {};
  return (a && (n = await nt(t)), f({ msg: `getSiteInstance for ${t}`, data: n }), await pt(t, n));
}
async function Vt(t, e = !1) {
  const a = typeof t == "string" ? t : t.id;
  let n = (await (await g).get("favicon", a)) ?? !1;
  if (e || !n) {
    const o = await D(a);
    o &&
      ((n = await mt({ id: a, urls: yt([o.url, ...o.metadata.urls].filter(Boolean)), favicon: o.metadata.favicon })),
      await (await g).put("favicon", n, a));
  }
  return (n || ((n = St), f({ msg: `getSiteFavicon for ${a} failed, use default NO_IMAGE.`, level: "warn" })), n);
}
l("getSiteFavicon", async ({ data: { site: t, flush: e } }) => await Vt(t, e));
async function Gt() {
  return (f({ msg: "clearSiteFaviconCache" }), await (await g).clear("favicon"));
}
l("clearSiteFaviconCache", async () => await Gt());
l("getSiteSearchResult", async ({ data: { siteId: t, keyword: e = "", searchEntry: a = {} } }) => {
  const n = await d("getExtStorage", "config");
  f({ msg: `getSiteSearchResult For site: ${t} with keyword: ${e}`, data: { siteId: t, keyword: e, searchEntry: a } });
  const o = await D(t);
  let i = await o.getSearchResult(e, a);
  if (i.data.length > 0) {
    let r;
    (n?.searchEntity?.autoDetectOfficialGroupFromTitle &&
      o.metadata.officialGroupPattern?.length &&
      (r = o.metadata.officialGroupPattern),
      (i.data = i.data.map(
        (c) => (
          (c.tags ??= []),
          r &&
            r.length > 0 &&
            c.title &&
            r.some((s) => new RegExp(s, "i").test(c.title)) &&
            c.tags.push({ name: "官方" }),
          (c.tags = ht(
            kt(
              c.tags.map((s) => {
                for (const u of It) if (u.from.test(s.name)) return u.to;
                return s;
              }),
              (s) => s.name,
            ),
          )),
          c
        ),
      )));
  }
  return i;
});
l("getMediaServerSearchResult", async ({ data: { mediaServerId: t, keywords: e = "", options: a = {} } }) => {
  f({
    msg: `getMediaServerSearchResult For mediaServer: ${t} with: ${e}`,
    data: { mediaServerId: t, keywords: e, options: a },
  });
  const o = (await d("getExtStorage", "metadata")).mediaServers[t];
  return await (await bt(o)).getSearchResult(e ?? "", a);
});
async function O() {
  return (await d("getExtStorage", "searchResultSnapshot")) ?? {};
}
l("getSearchResultSnapshotData", async ({ data: t }) => (await O())?.[t]);
l("saveSearchResultSnapshotData", async ({ data: { snapshotId: t, data: e } }) => {
  const a = await O();
  ((a[t] = e),
    f({ msg: `A new SearchResult Snapshot will be add at: ${t}`, data: e }),
    await d("setExtStorage", { key: "searchResultSnapshot", value: a }));
});
l("removeSearchResultSnapshotData", async ({ data: t }) => {
  const e = await O();
  (delete e[t],
    await d("setExtStorage", { key: "searchResultSnapshot", value: e }),
    f({ msg: `SearchResult Snapshot ${t} is removed.` }));
});
async function H(t) {
  return (await d("getExtStorage", "metadata"))?.downloaders?.[t] ?? {};
}
const Y = new Map();
function qt(t) {
  const { id: e, type: a, address: n, username: o, password: i, timeout: r } = t;
  return JSON.stringify({ id: e, type: a, address: n, username: o, password: i, timeout: r });
}
async function h(t) {
  const e = await H(t);
  if (!e.id) return null;
  const a = qt(e),
    n = Y.get(t);
  if (n && n.configKey === a) return n.instance;
  const o = await Ct(e);
  return (Y.set(t, { configKey: a, instance: o }), o);
}
l("getDownloaderConfig", async ({ data: t }) => await H(t));
l("getDownloaderList", async () => {
  const e = (await d("getExtStorage", "metadata"))?.downloaders ?? {};
  return Object.entries(e).map(([a, n]) => ({
    id: a,
    name: n.name ?? "",
    type: n.type ?? "",
    enabled: n.enabled ?? !1,
    address: n.address ?? "",
  }));
});
l("getDownloaderVersion", async ({ data: t }) => {
  let e = "unknown";
  const a = await h(t);
  return (a && (e = await a.getClientVersion()), e);
});
l("getDownloaderStatus", async ({ data: t }) => {
  let e = { dlSpeed: 0, upSpeed: 0, dlData: 0, upData: 0 };
  const a = await h(t);
  return (a && (e = await a.getClientStatus()), e);
});
async function ot(t) {
  return await (await D(t.site)).getTorrentDownloadLink(t);
}
l("getTorrentDownloadLink", async ({ data: t }) => await ot(t));
async function Wt(t) {
  const e = await ot(t),
    n = await (await D(t.site)).getTorrentDownloadRequestConfig(t);
  ((n.url = e), (n.responseType = "arraybuffer"));
  const o = await X(n);
  return {
    infoHash: o.infoHash ?? "",
    name: o.info.name ?? "unknown",
    length: o.info.length ?? 0,
    files: (o.info.files || []).map((i) => ({ path: i.path, length: i.length })),
  };
}
l("getTorrentInfoForVerification", async ({ data: t }) => await Wt(t));
l("getClientTorrents", async ({ data: t }) => {
  let e = [];
  const a = await h(t);
  return (a && (e = await a.getAllTorrents()), e);
});
l("deleteClientTorrent", async ({ data: { downloaderId: t, id: e, removeData: a } }) => {
  let n = !1;
  const o = await h(t);
  return (o && (n = await o.removeTorrent(e, a ?? !1)), n);
});
l("pauseClientTorrent", async ({ data: { downloaderId: t, id: e } }) => {
  let a = !1;
  const n = await h(t);
  return (n && (a = await n.pauseTorrent(e)), a);
});
l("resumeClientTorrent", async ({ data: { downloaderId: t, id: e } }) => {
  let a = !1;
  const n = await h(t);
  return (n && (a = await n.resumeTorrent(e)), a);
});
function Yt(t) {
  const { torrent: e = {}, downloaderId: a = "local" } = t;
  return {
    ...t,
    siteId: e.site ?? "unknown",
    torrentId: e.id ?? "unknown",
    downloaderId: a,
    title: e.title ?? "unknown",
    subTitle: e.subTitle,
    url: e.url,
    link: e.link,
    downloadAt: +Date.now(),
    downloadStatus: "pending",
  };
}
const z = new Map();
async function rt() {
  return (await d("getExtStorage", "config"))?.download?.saveDownloadHistory ?? !0;
}
async function zt(t) {
  const e = await d("getExtStorage", "config"),
    { torrent: a, downloaderId: n = "local", addTorrentOptions: o = {} } = t,
    i = n === "local";
  let r = t.downloadId;
  if (typeof t.downloadId > "u") {
    const w = Yt(t);
    t.downloadId = r = await it(w);
  }
  f({ msg: `generate download torrent task #${t.downloadId}`, data: t });
  let c = await S(r, "pending"),
    s = { url: a.link, method: "GET", timeout: 3e4 },
    u = null;
  if (a.site) {
    if (
      ((u = await D(a.site)),
      u.downloadInterval > 0 && !(i && e?.download?.ignoreSiteDownloadIntervalWhenLocalDownload))
    ) {
      const w = u.downloadInterval * 1e3 - (new Date().getTime() - (z.get(a.site) ?? 0));
      if (w > 0)
        return (
          f({ msg: `Site ${a.site} download interval not reached, waiting...` }),
          d("reDownloadTorrent", { ...t, downloadId: r, leftInterval: w }).catch(),
          { downloadId: r, downloadStatus: await S(r, "pending") }
        );
      z.set(a.site, new Date().getTime());
    }
    (!i && (u.userConfig?.uploadSpeedLimit ?? 0) > 0 && (o.uploadSpeedLimit = u.userConfig.uploadSpeedLimit),
      (s = tt(s, await u.getTorrentDownloadRequestConfig(a))));
  }
  await $(r, { downloadRequestConfig: s }).catch();
  try {
    ((c = await S(r, "downloading")),
      i
        ? ((t.localDownloadMethod ??= e?.download?.localDownloadMethod ?? "web"), (c = await Qt(t, s)))
        : ((o.localDownload ??= !0),
          (e?.download?.allowDirectSendToClient ?? !1) || (o.localDownload = !0),
          (t.addTorrentOptions = o),
          (c = await Jt(t, s))));
  } catch {
    c = "failed";
  }
  return (await S(r, c), { downloadId: r, downloadStatus: c });
}
l("downloadTorrent", async ({ data: t }) => await zt(t));
async function Qt(t, e) {
  let { torrent: a, localDownloadMethod: n = "web", downloadId: o } = t,
    i = "downloading";
  const r = Z.getUri(e),
    { method: c = "GET", data: s = {}, headers: u = {} } = e;
  if (n === "web") {
    if (c.toUpperCase() === "GET" && k(u))
      return (
        f({ msg: `Download torrent file with web method: ${r}` }),
        window.open(r, "_blank"),
        await S(o, "completed")
      );
    n = "extension";
  }
  if (n === "browser" && ["GET", "POST"].includes(c.toUpperCase()))
    try {
      const w = { url: r, conflictAction: "uniquify", method: c.toUpperCase() };
      return (
        c.toUpperCase() === "POST" && !k(s ?? {}) && (w.body = vt(s)),
        k(u) || (w.headers = Object.entries(u).map(([m, T]) => ({ name: m, value: T }))),
        f({ msg: `Download torrent file with browser method: ${r}`, data: w }),
        await d("downloadFile", w),
        await S(o, "completed")
      );
    } catch {
      n = "extension";
    }
  else n = "extension";
  if (n === "extension")
    try {
      f({ msg: `Download torrent file with extension method: ${r}`, data: e });
      const w = await X(e),
        m = URL.createObjectURL(w.metadata.blob());
      let T = w.name;
      (T === "1.torrent" && (T = `[${a.site}] ${a.title}.torrent`),
        await d("downloadFile", { url: m, filename: T, conflictAction: "uniquify" }),
        (i = await S(o, "completed")),
        URL.revokeObjectURL(m));
    } catch {
      i = await S(o, "failed");
    }
  return i;
}
async function Jt(t, e) {
  const { torrent: a, downloaderId: n, addTorrentOptions: o, downloadId: i } = t;
  let r = "failed";
  const c = await H(n);
  if (c.id && c.enabled) {
    const s = await h(n);
    if (!s) return r;
    o.localDownload && (o.localDownloadOption = e);
    const u = { torrent: a, downloaderId: n, downloadRequestConfig: e, addTorrentOptions: o };
    try {
      f({ msg: "downloadTorrentToDownloader", data: u });
      const w = await s.addTorrent(e.url, o);
      ((u.addTorrentResult = w),
        w?.success === !0
          ? (f({ msg: "Successfully added torrent to downloader", data: u }), (r = "completed"))
          : f({ msg: "Failed to add torrent to downloader", data: u }),
        $(i, { addTorrentResult: w }).catch());
    } catch {
      f({ msg: "Error adding torrent to downloader", data: u });
    }
  }
  return r;
}
async function Zt() {
  return await (await g).getAll("download_history");
}
l("getDownloadHistory", Zt);
async function st(t) {
  return await (await g).get("download_history", t);
}
l("getDownloadHistoryById", async ({ data: t }) => await st(t));
async function it(t) {
  return (await rt()) ? await (await g).put("download_history", t) : 0;
}
async function $(t, e) {
  const a = await rt(),
    n = await st(t);
  a && n && (await it({ ...n, ...e }));
}
async function S(t, e) {
  return (await $(t, { downloadStatus: e }).catch(), e);
}
async function Xt(t) {
  return await (await g).delete("download_history", t);
}
l("deleteDownloadHistoryById", async ({ data: t }) => await Xt(t));
async function te() {
  return await (await g).clear("download_history");
}
l("clearDownloadHistory", te);
const I = new P({ concurrency: 1 }),
  ee = new P({ concurrency: 1 });
I.on("active", async () => {
  const e = (await d("getExtStorage", "config"))?.userInfo?.queueConcurrency ?? 1;
  I.concurrency != e &&
    ((I.concurrency = e),
    f({ msg: `The concurrency of the user information refresh queue has been updated to ${I.concurrency}` }));
});
l("cancelUserInfoQueue", () => {
  I.clear();
});
async function ae(t) {
  return await I.add(async () => {
    f({ msg: `getSiteUserInfoResult for ${t}` });
    const e = await D(t);
    try {
      await d("checkAndExtendCookies", e.url);
    } catch {
      f({ msg: `Failed to extend cookies for site ${t}`, level: "debug" });
    }
    const a = await d("getExtStorage", "metadata"),
      n = await d("getExtStorage", "config");
    let o = a?.lastUserInfo?.[t] ?? {};
    (!(n.userInfo.alwaysPickLastUserInfo ?? !0) || o.status !== M.success) && (o = {});
    let i = o;
    if (e.allowQueryUserInfo) i = await e.getUserInfoResult(i);
    else if (e.metadata.type === "private" && !e.isOnline && k(o)) {
      const c = ((await d("getExtStorage", "userInfo")) ?? {})?.[t] ?? {};
      let s = null;
      for (const u in c) c[u].status === M.success && (!s || new Date(u) > new Date(s)) && (s = u);
      s && (i = c[s]);
    }
    return (await ct(i), i);
  });
}
l("getSiteUserInfoResult", async ({ data: t }) => await ae(t));
async function ct(t) {
  return ee.add(async () => {
    f({ msg: `setSiteLastUserInfo for ${t.site}`, data: t });
    const e = t.site,
      a = (await d("getExtStorage", "metadata")) ?? {};
    if (
      ((a.lastUserInfo ??= {}),
      (a.lastUserInfo[e] = t),
      await d("setExtStorage", { key: "metadata", value: a }),
      t.status === M.success)
    ) {
      const n = (await d("getExtStorage", "userInfo")) ?? {};
      n[e] ??= {};
      const o = A(t.updateAt, "yyyy-MM-dd");
      ((n[e][o] = t), await d("setExtStorage", { key: "userInfo", value: n }));
    }
  });
}
l("setSiteLastUserInfo", async ({ data: t }) => await ct(t));
l("getSiteUserInfo", async ({ data: t }) => ((await d("getExtStorage", "userInfo")) ?? {})?.[t] ?? {});
l("removeSiteUserInfo", async ({ data: { siteId: t, date: e } }) => {
  const a = (await d("getExtStorage", "userInfo")) ?? {};
  for (const n of e) Dt(a, `${t}.${n}`);
  await d("setExtStorage", { key: "userInfo", value: a });
});
const dt = ["config", "metadata", "userInfo", "searchResultSnapshot"];
async function ne(t = []) {
  const e = await d("getExtStorage", "metadata"),
    a = {};
  if (t.includes("cookies")) {
    const n = {};
    for (const o in e.siteHostMap) {
      const i = await d("getAllCookies", { domain: o });
      i.length > 0 && (n[o] = i);
    }
    a.cookies = n;
  }
  for (const n of dt) t.includes(n) && (a[n] = await d("getExtStorage", n));
  return (
    t.includes("downloadHistory") && (a.downloadHistory = await (await g).getAll("download_history")),
    (a.manifest = { time: new Date().getTime(), version: "PT-Depiler (v0.0.6.1740+c969e7b)" }),
    f({ msg: `A Backup data created at ${A(a.manifest.time, "yyyy-MM-dd HH:mm:ss")}`, data: Object.keys(a) }),
    a
  );
}
async function C(t) {
  f({ msg: `Get backup server instance for ID: ${t}` });
  const a = (await d("getExtStorage", "metadata")).backupServers[t];
  return await xt(a);
}
async function oe(t, e = []) {
  const a = await ne(e),
    n = `PTD_backup_${A(new Date(), "yyyyMMdd'T'HHmm")}.zip`,
    i = (await d("getExtStorage", "config"))?.backup?.encryptionKey ?? "";
  if ((f({ msg: `Exporting backup data to ${t}`, data: { backupFields: e, backupFilename: n } }), t === "local")) {
    const r = await Mt(a, i),
      c = URL.createObjectURL(r);
    return (await d("downloadFile", { url: c, filename: n, conflictAction: "uniquify" }), !0);
  } else {
    const r = await C(t);
    r.setEncryptionKey(i);
    const c = await r.addFile(n, a);
    if (c) {
      const s = await d("getExtStorage", "metadata");
      ((s.backupServers[t].lastBackupAt = new Date().getTime()),
        await d("setExtStorage", { key: "metadata", value: s }));
    }
    return c;
  }
}
l("exportBackupData", async ({ data: { backupServerId: t, backupFields: e } }) => await oe(t, e));
async function re(t, e = {}) {
  const { fields: a = [], expandCookieMinutes: n = -1, keepExistUserInfo: o = !0 } = e,
    i = Object.keys(t.manifest?.files ?? {}),
    r = Rt(a, i);
  if (r.includes("downloadHistory")) {
    const c = await g;
    await c.clear("download_history");
    for (const s of t.downloadHistory) await c.put("download_history", s);
  }
  for (const c of dt.toReversed())
    if (r.includes(c)) {
      let s = t[c];
      if (s) {
        if (c === "userInfo" && o) {
          const u = (await d("getExtStorage", "userInfo")) ?? {};
          s = tt(s, u);
        }
        await d("setExtStorage", { key: c, value: s });
      }
    }
  if (r.includes("cookies")) {
    const c = new Date().getTime() / 1e3;
    for (const s of Object.values(t.cookies))
      for (const u of s)
        (n > 0 && (u.expirationDate = Math.max(u.expirationDate ?? 0, c) + n * 60), await d("setCookie", u));
  }
  return !0;
}
l("restoreBackupData", async ({ data: { restoreData: t, restoreOptions: e = {} } }) => await re(t, e));
async function se(t) {
  return await (await C(t)).list();
}
l("getBackupHistory", async ({ data: t }) => await se(t));
async function ie(t, e) {
  return await (await C(t)).deleteFile(e);
}
l("deleteBackupHistory", async ({ data: { backupServerId: t, path: e } }) => await ie(t, e));
async function ce(t, e, a = "") {
  const n = await C(t);
  return (n.setEncryptionKey(a), await n.getFile(e));
}
l("getRemoteBackupData", async ({ data: { backupServerId: t, path: e, decryptKey: a = "" } }) => await ce(t, e, a));
const Q = new Set();
async function lt(t, e, a = {}) {
  const o = (await d("getExtStorage", "config")).socialSiteInformation ?? {},
    i = `${t}:${e}`;
  let r = await (await g).get("social_information", i);
  const c = r && r.createAt < Date.now() - 864e5 * (o.cacheDay ?? 3),
    s = !Q.has(i),
    u = s && a.requireSummary && r && !r.summary,
    w = s && a.requireMetadata && r && (!r.releaseYear || !r.region || !r.genres?.length),
    m = u || w;
  return (
    (a.force || !r || c || m) &&
      ((r = await Tt(t, e, o)),
      m && Q.add(i),
      r && (r.title !== "" || r.poster !== "") && (await de(t, e, r)),
      f({ msg: `getSocialInformation for ${t} with sid: ${e}`, data: r })),
    r
  );
}
l("getSocialInformation", async ({ data: { site: t, sid: e } }) => await lt(t, e));
async function de(t, e, a) {
  const n = `${t}:${e}`;
  return await (await g).put("social_information", a, n);
}
async function le() {
  return await (await g).clear("social_information");
}
l("clearSocialInformationCache", async () => {
  await le();
});
const ue = 8,
  fe = 5,
  ut = 8,
  we = 2,
  ge = 100,
  me = 3e3,
  ye = 800,
  E = new Map();
function Se(t, e) {
  if (E.size >= ge) {
    const a = E.keys().next().value;
    a && E.delete(a);
  }
  E.set(t, e);
}
function pe(t) {
  return [
    t,
    t.replace("/l_ratio_poster/", "/s_ratio_poster/"),
    t.replace("/l_ratio_poster/", "/m_ratio_poster/"),
    t.replace("/s_ratio_poster/", "/m_ratio_poster/"),
    t.replace("/s_ratio_poster/", "/l_ratio_poster/"),
  ];
}
function he(...t) {
  const e = t.flatMap((a) =>
    !a || !/doubanio\.com/.test(a)
      ? a
        ? [a]
        : []
      : pe(a).flatMap((n) => ["img1", "img2", "img3", "img9"].map((o) => n.replace(/img\d(?=\.doubanio\.com)/, o))),
  );
  return Array.from(new Set(e)).slice(0, ut);
}
function Ie(t) {
  return t === "visible" ? { candidateLimit: we, timeout: ye } : { candidateLimit: ut, timeout: me };
}
async function De(t) {
  try {
    return await lt(t.site, t.id, {
      requireMetadata: !t.releaseYear || !t.region || !t.genres?.length,
      requireSummary: !t.summary,
    });
  } catch (e) {
    console.warn("Failed to enrich social recommendation", t, e);
    return;
  }
}
function Te(t) {
  return new Promise((e, a) => {
    const n = new FileReader();
    (n.addEventListener("loadend", () => {
      typeof n.result == "string" ? e(n.result) : a(new Error("Error when parse recommendation poster Blob"));
    }),
      n.readAsDataURL(t));
  });
}
async function Ee(t, ...e) {
  const a = Ie(t),
    n = e.find((c) => !!c?.startsWith("data:image/"));
  if (n) return n;
  const o = he(...e).slice(0, a.candidateLimit),
    i = o.join(`
`),
    r = E.get(i);
  if (r) return r;
  for (const c of o)
    try {
      const s = await Z.get(c, { responseType: "blob", timeout: a.timeout }),
        u = s.headers["content-type"];
      if (
        (typeof u == "string" ? u.split(";")[0] : s.data.type || void 0)?.startsWith("image/") &&
        s.data.size > 1024
      ) {
        const m = await Te(s.data);
        return (Se(i, m), m);
      }
    } catch (s) {
      console.warn("Failed to fetch recommendation poster", c, s);
    }
}
async function ft(t, e) {
  const n =
      !t.poster || !t.summary || !t.releaseYear || !t.region || !t.genres?.length || !t.ratingScore
        ? await De(t)
        : void 0,
    o = await Ee(e, t.poster, n?.poster);
  return {
    ...t,
    poster: o || t.poster,
    summary: n?.summary || t.summary,
    releaseYear: n?.releaseYear || t.releaseYear,
    region: n?.region || t.region,
    genres: n?.genres?.length ? n.genres : t.genres,
    ratingScore: n?.ratingScore || t.ratingScore,
    ratingCount: n?.ratingCount || t.ratingCount,
  };
}
function K(t) {
  return `${t.category}:${t.site}:${t.id}`;
}
function ke(t) {
  const e = new Map(),
    a = new Set();
  for (const n of t) {
    const o = e.get(n.category) ?? 0;
    (e.set(n.category, o + 1), o < fe && a.add(K(n)));
  }
  return a;
}
function be(t, e, a) {
  return e !== "visible" || a.has(K(t));
}
async function ve(t, e) {
  const a = ke(t),
    n = new P({ concurrency: ue });
  return Promise.all(t.map((o) => (be(o, e, a) ? n.add(() => ft(o, e)) : o)));
}
l("getSocialRecommendations", async ({ data: t }) => {
  const e = t ?? {},
    a = await Et(e);
  if (e.enrichment === "none")
    return (
      f({
        msg: "getSocialRecommendations",
        data: { count: a.items.length, flush: e.flush ?? !1, hasFailedSources: a.hasFailedSources, enrichment: "none" },
      }),
      a
    );
  const n = e.enrichment ?? "all",
    o = await ve(a.items, n);
  return (
    f({
      msg: "getSocialRecommendations",
      data: { count: o.length, flush: e.flush ?? !1, hasFailedSources: a.hasFailedSources, enrichment: n },
    }),
    { ...a, items: o }
  );
});
l("getSocialRecommendationItem", async ({ data: t }) => {
  const e = t.enrichment ?? "all",
    a = await ft(t.item, e);
  return (f({ msg: "getSocialRecommendationItem", data: { item: K(a), enrichment: e } }), { item: a });
});
const y = "keepUploadTask";
async function Ce() {
  const t = await d("getExtStorage", y);
  return t ? Object.values(t) : [];
}
l("getKeepUploadTasks", Ce);
async function Re(t) {
  return (await d("getExtStorage", y))?.[t];
}
l("getKeepUploadTaskById", async ({ data: t }) => await Re(t));
async function xe(t) {
  const e = (await d("getExtStorage", y)) || {};
  ((e[t.id] = t), await d("setExtStorage", { key: y, value: e }));
}
l("createKeepUploadTask", async ({ data: t }) => {
  await xe(t);
});
async function Me(t) {
  const e = (await d("getExtStorage", y)) || {};
  e[t.id] && ((e[t.id] = t), await d("setExtStorage", { key: y, value: e }));
}
l("updateKeepUploadTask", async ({ data: t }) => {
  await Me(t);
});
async function Ue(t) {
  const e = (await d("getExtStorage", y)) || {};
  (delete e[t], await d("setExtStorage", { key: y, value: e }));
}
l("deleteKeepUploadTask", async ({ data: t }) => {
  await Ue(t);
});
async function Le() {
  await d("setExtStorage", { key: y, value: {} });
}
l("clearKeepUploadTasks", Le);
