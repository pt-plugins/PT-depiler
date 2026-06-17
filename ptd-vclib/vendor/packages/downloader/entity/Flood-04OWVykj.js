import { a as h, A as y, C as o } from "../types-bvm8eB57.js";
import { j as l } from "../../site/index-COeZNva1.js";
import { u as T } from "../../../url-join/url-join-Cu798wIg.js";
import { g } from "../utils-Qej-F1x7.js";
import "../index-BATa0ddy.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
const m = {
    type: "Flood",
    name: "Flood",
    address: "http://172.0.0.1:3000",
    username: "",
    password: "",
    timeout: 60 * 1e3,
  },
  b = {
    description: "Flood 是 ruTorrent 的另一款基于Node的Web前端面板，界面美观，加载速度快",
    warning: [
      "同时兼容 Flood 原版以及 jesec修改版",
      "如果当前已登录Flood面板，请退出登陆后再做连接性测试",
      "目前无法准确获得Flood的种子操作（添加、启动、暂停、删除）是否成功。",
    ],
    feature: { CustomPath: { allowed: !0, description: h }, DefaultAutoStart: { allowed: !0 } },
  },
  u = {
    jesec: {
      verify: "/api/auth/verify",
      authenticate: "/api/auth/authenticate",
      "connection-test": "/api/client/connection-test",
      getTorrents: "/api/torrents",
      addTorrentByUrl: "/api/torrents/add-urls",
      addTorrentByFile: "/api/torrents/add-files",
      startTorrent: "/api/torrents/start",
      stopTorrent: "/api/torrents/stop",
      deleteTorrent: "/api/torrents/delete",
    },
    legacy: {
      verify: "/auth/verify",
      authenticate: "/auth/authenticate",
      "connection-test": "/api/client/connection-test",
      getTorrents: "",
      addTorrentByUrl: "/api/client/add",
      addTorrentByFile: "/api/client/add-files",
      startTorrent: "/api/client/start",
      stopTorrent: "/api/client/stop",
      deleteTorrent: "/api/client/torrents/delete",
    },
  };
function w(c, e) {
  return new Promise((a) => {
    const r = new EventSource(c);
    r.addEventListener(e, (t) => {
      (a(t.data), r.close());
    });
  });
}
class C extends y {
  version = "v0.0.1";
  apiType;
  constructor(e = {}) {
    super({ ...m, ...e });
  }
  async getEndPointType() {
    if (this.apiType == null)
      try {
        (await l.get(u.legacy.verify, { baseURL: this.config.address, timeout: this.config.timeout }),
          (this.apiType = "legacy"));
      } catch {
        this.apiType = "jesec";
      }
    return this.apiType;
  }
  async getEndPointUrl(e) {
    const a = await this.getEndPointType();
    return u[a][e];
  }
  async request(e, a = {}) {
    const r = await this.getEndPointUrl(e);
    try {
      return await l.request({ baseURL: this.config.address, url: r, timeout: this.config.timeout, ...a });
    } catch (t) {
      if (t.response?.status === 401 && e !== "authenticate" && (await this.login())) return await this.request(e, a);
      throw t;
    }
  }
  async login() {
    try {
      return (
        await this.request("authenticate", {
          method: "post",
          data: { username: this.config.username, password: this.config.password },
        })
      ).data.success;
    } catch {
      return !1;
    }
  }
  async ping() {
    try {
      return (await this.request("connection-test")).data.isConnect;
    } catch {
      return !1;
    }
  }
  async getClientVersionFromRemote() {
    return "";
  }
  async addTorrent(e, a = {}) {
    const r = { success: !1 };
    let t = { destination: "", tags: [] };
    (a.savePath && (t.destination = a.savePath),
      a.addAtPaused && (t.start = !a.addAtPaused),
      a.label && (t.tags = [a.label]));
    try {
      if (e.startsWith("magnet:") || !a.localDownload)
        ((t.urls = [e]), await this.request("addTorrentByUrl", { method: "post", data: t }));
      else {
        const s = await this.getEndPointType(),
          n = await g({ url: e, ...(a.localDownloadOption || {}) });
        if (s === "jesec") t.files = [n.metadata.base64()];
        else {
          const i = new FormData();
          (Object.keys(t).forEach((d) => {
            const p = t[d];
            i.append(d, p);
          }),
            i.append("torrents", n.metadata.blob(), n.name),
            (t = i));
        }
        await this.request("addTorrentByFile", { method: "post", data: t });
      }
      r.success = !0;
    } catch {}
    return r;
  }
  async getAllTorrents() {
    const e = await this.getEndPointType();
    let a;
    if (e === "legacy") {
      await this.ping();
      const r = await w(T(this.config.address, "/api/activity-stream"), "TORRENT_LIST_FULL_UPDATE");
      a = JSON.parse(r);
    } else a = (await this.request("getTorrents")).data.torrents;
    return Object.keys(a).map((r) => {
      const t = a[r],
        s = (i) => i.some((d) => t.status.includes(d));
      let n = o.unknown;
      return (
        s(["downloading", "d", "ad"])
          ? (n = o.downloading)
          : s(["seeding", "sd", "au"])
            ? (n = o.seeding)
            : s(["stopped", "p", "s"])
              ? (n = o.paused)
              : s(["checking", "ch"])
                ? (n = o.checking)
                : s(["error", "e"]) && (n = o.error),
        {
          id: r.toLowerCase(),
          infoHash: r,
          name: t.name,
          dateAdded: t.dateAdded,
          state: n,
          isCompleted: t.isComplete,
          progress: t.percentComplete,
          label: t.tags && t.tags.length > 1 ? t.tags[0] : void 0,
          savePath: t.directory,
          totalSize: t.sizeBytes,
          ratio: t.ratio,
          uploadSpeed: t.upRate,
          downloadSpeed: t.downRate,
          totalUploaded: t.upTotal,
          totalDownloaded: t.downTotal,
          raw: t,
          clientId: this.config.id,
        }
      );
    });
  }
  async pauseTorrent(e) {
    return (await this.request("stopTorrent", { method: "post", data: { hashes: [e] } }), !0);
  }
  async resumeTorrent(e) {
    return (await this.request("startTorrent", { method: "post", data: { hashes: [e] } }), !0);
  }
  async removeTorrent(e, a = !1) {
    const t = (await this.getEndPointType()) === "jesec" ? "hashes" : "hash",
      s = { deleteData: a };
    return ((s[t] = [e]), await this.request("deleteTorrent", { method: "post", data: s }), !0);
  }
  async getTorrentTrackers(e) {
    return [];
  }
}
export { m as clientConfig, b as clientMetaData, C as default };
