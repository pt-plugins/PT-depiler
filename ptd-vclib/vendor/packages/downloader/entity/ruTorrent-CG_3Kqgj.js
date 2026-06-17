import { a as S, A as b, C as i } from "../types-bvm8eB57.js";
import { j as C } from "../../site/index-COeZNva1.js";
import { g as P } from "../utils-Qej-F1x7.js";
import "../index-BATa0ddy.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
const T = {
    type: "ruTorrent",
    name: "ruTorrent",
    address: "https://myrut.com/rutorrent",
    username: "admin",
    password: "",
    timeout: 60 * 1e3,
  },
  A = {
    description: "rTorrent 的一款基于PHP的Web前端面板",
    feature: { CustomPath: { allowed: !0, description: S }, DefaultAutoStart: { allowed: !0 } },
  };
function s(n) {
  const t = n == null ? 0 : parseInt(n + "");
  return isNaN(t) ? 0 : t;
}
function g(n) {
  let t = '<?xml version="1.0" encoding="UTF-8"?>';
  t += "<methodCall><methodName>system.multicall</methodName><params><param><value><array><data>";
  for (const [a, r = []] of n)
    ((t += "<value><struct>"),
      (t += `<member><name>methodName</name><value><string>${a}</string></value></member>`),
      (t +=
        "<member><name>params</name><value><array><data>" +
        r.map((e) => `<value><string>${String(e)}</string></value>`).join("") +
        "</data></array></value></member>"),
      (t += "</struct></value>"));
  return ((t += "</data></array></value></param></params></methodCall>"), t);
}
function D(n) {
  const a = new DOMParser()
    .parseFromString(n, "text/xml")
    .querySelectorAll("params > param > value > array > data > value > array > data > value");
  return Array.from(a).map((r) => r.textContent);
}
class x extends b {
  version = "v0.0.1";
  constructor(t = {}) {
    super({ ...T, ...t });
  }
  async request(t = {}) {
    return await C.request({
      baseURL: this.config.address,
      auth: { username: this.config.username, password: this.config.password },
      timeout: this.config.timeout,
      ...t,
    });
  }
  async requestHttpRpc(t = {}) {
    return this.request({ method: "post", url: "/plugins/httprpc/action.php", data: t });
  }
  async ping() {
    try {
      await this.request({ url: "/php/getsettings.php", responseType: "json" });
    } catch {
      return !1;
    }
    return !0;
  }
  async getClientVersionFromRemote() {
    const t = g([["system.client_version"], ["system.api_version"]]),
      { data: a } = await this.requestHttpRpc(t);
    return D(a).join("/");
  }
  async getClientStatus() {
    const t = new URLSearchParams({ mode: "ttl" }),
      { data: a } = await this.requestHttpRpc(t),
      [r, e, c, o] = a.map(s);
    return { upData: r, dlData: e, upSpeed: c, dlSpeed: o };
  }
  async getClientFreeSpace() {
    const {
      data: { free: t },
    } = await this.request({ url: "/rutorrent/plugins/diskspace/action.php" });
    return t;
  }
  async addTorrent(t, a = {}) {
    const r = { success: !1 };
    let e;
    if (t.startsWith("magnet:") || !a.localDownload) ((e = new URLSearchParams()), e.append("url", t));
    else {
      e = new FormData();
      const o = await P({ url: t, ...(a.localDownloadOption || {}) });
      e.append("torrent_file", o.metadata.blob(), o.name);
    }
    (e.append("json", "1"),
      a.savePath && e.append("dir_edit", a.savePath),
      a.addAtPaused && e.append("torrents_start_stopped", "1"),
      a.label && e.append("label", a.label));
    const { data: c } = await this.request({ method: "post", url: "/php/addtorrent.php", data: e });
    return ((r.success = c.result === "Success"), r.success || (r.message = c), r);
  }
  async getAllTorrents() {
    const t = new URLSearchParams({ mode: "list" }),
      { data: a } = await this.requestHttpRpc(t);
    return Object.keys(a.t).map((r) => {
      const e = a.t[r],
        c = s(e[0]),
        o = s(e[1]),
        f = s(e[3]),
        w = s(e[23]),
        y = s(e[28]),
        d = e[30],
        v = s(o === 0 ? e[6] : e[24]),
        l = Math.floor((v / s(e[7])) * 1e3),
        m = l >= 1e3,
        u = e[25],
        h = u.lastIndexOf("/"),
        R = u.substring(h + 1) === e[4] ? u.substring(0, h) : u;
      let p = i.unknown;
      return (
        c !== 0
          ? f === 0 || y === 0
            ? (p = i.paused)
            : (p = m ? i.seeding : i.downloading)
          : w !== 0
            ? (p = i.queued)
            : o !== 0
              ? (p = i.checking)
              : d.length && d !== "Tracker: [Tried all trackers.]" && (p = i.error),
        {
          id: r.toLowerCase(),
          infoHash: r,
          name: e[4],
          state: p,
          dateAdded: parseInt(e[21]),
          isCompleted: m,
          progress: l / 10,
          label: decodeURIComponent(e[15]),
          savePath: R,
          totalSize: s(e[5]),
          ratio: s(e[10]),
          uploadSpeed: s(e[11]),
          downloadSpeed: s(e[12]),
          totalUploaded: s(e[9]),
          totalDownloaded: s(e[8]),
          raw: e,
          clientId: this.config.id,
        }
      );
    });
  }
  async pauseTorrent(t) {
    const a = new URLSearchParams({ mode: "pause", hash: t.toUpperCase() });
    return (await this.requestHttpRpc(a), !0);
  }
  async removeTorrent(t, a = !1) {
    const r = t.toUpperCase();
    let e;
    return (
      a
        ? (e = g([
            ["d.custom5.set", [r, 1]],
            ["d.delete_tied", [r]],
            ["d.erase", [r]],
          ]))
        : (e = new URLSearchParams({ mode: "remove", hash: r })),
      await this.requestHttpRpc(e),
      !0
    );
  }
  async resumeTorrent(t) {
    const a = new URLSearchParams({ mode: "post", hash: t.toUpperCase() });
    return (await this.requestHttpRpc(a), !0);
  }
  async getTorrentTrackers(t) {
    return [];
  }
}
export { T as clientConfig, A as clientMetaData, x as default };
