import { a as c, A as p, C as d } from "../types-bvm8eB57.js";
import { u as m } from "../../../url-join/url-join-Cu798wIg.js";
import { j as h, az as g } from "../../site/index-COeZNva1.js";
import { g as w } from "../utils-Qej-F1x7.js";
import "../index-BATa0ddy.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
const f = {
    type: "Transmission",
    name: "Transmission",
    address: "http://localhost:9091/",
    username: "",
    password: "",
    timeout: 60 * 1e3,
  },
  v = {
    description: "Transmission 是一个跨平台的BitTorrent客户端，特点是硬件资源消耗极少，界面极度精简",
    warning: [
      "默认情况下，系统会请求 http://ip:port/transmission/rpc 这个路径，如果无法连接，请确认 `settings.json` 文件的 `rpc-url` 值；详情可参考：https://github.com/ronggang/PT-Plugin-Plus/issues/32",
    ],
    feature: { CustomPath: { allowed: !0, description: c }, DefaultAutoStart: { allowed: !0 } },
  };
class A extends p {
  version = "v0.1.0";
  torrentRequestFields = [
    "addedDate",
    "id",
    "hashString",
    "isFinished",
    "name",
    "percentDone",
    "uploadRatio",
    "downloadDir",
    "status",
    "totalSize",
    "leftUntilDone",
    "labels",
    "trackers",
  ];
  address;
  sessionId = "";
  constructor(e = {}) {
    super({ ...f, ...e });
    let s = this.config.address;
    (s.indexOf("rpc") === -1 && (s = m(s, "/transmission/rpc")), (this.address = s));
  }
  async ping() {
    try {
      const { data: e } = await this.request("session-get");
      return e.result === "success";
    } catch {
      return !1;
    }
  }
  async getClientVersionFromRemote() {
    const {
      data: { arguments: e },
    } = await this.request("session-get");
    return `${e.version}, RPC ${e["rpc-version"]}`;
  }
  async getClientStatus() {
    const e = await super.getClientStatus(),
      s = this.request("session-stats"),
      {
        data: { arguments: a },
      } = await s;
    return (
      (e.dlSpeed = a.downloadSpeed),
      (e.upSpeed = a.uploadSpeed),
      (e.dlData = a["current-stats"].downloadedBytes),
      (e.upData = a["current-stats"].uploadedBytes),
      e
    );
  }
  async getClientFreeSpace() {
    const {
      data: { arguments: e },
    } = await this.request("session-get");
    if (e["download-dir-free-space"]) return e["download-dir-free-space"];
    {
      const { data: s } = await this.request("free-space", { path: e["download-dir"] });
      return s.arguments["size-bytes"];
    }
  }
  async addTorrent(e, s = {}) {
    const a = { success: !1 },
      r = { paused: s.addAtPaused ?? !1 },
      t = await this.getClientVersion();
    let i = parseInt(t.match(/RPC (\d+)/)?.[1] || "0", 10) >= 17;
    if (e.startsWith("magnet:") || !s.localDownload) r.filename = e;
    else {
      const n = await w({ url: e, ...(s.localDownloadOption || {}) });
      r.metainfo = n.metadata.base64();
    }
    s.savePath && (r["download-dir"] = s.savePath);
    let o;
    (s.label && (o = s.label.split(",").map((n) => n.trim())), o && i && (r.labels = o));
    try {
      const { data: n } = await this.request("torrent-add", r),
        l = n.arguments["torrent-added"].id;
      if (!i && o)
        try {
          await this.request("torrent-set", { ids: l, labels: o });
        } catch {}
      if (s.uploadSpeedLimit && s.uploadSpeedLimit > 0)
        try {
          await this.request("torrent-set", { ids: l, uploadLimit: s.uploadSpeedLimit * 1024, uploadLimited: !0 });
        } catch {}
      ((a.success = n.result === "success"), a.success || (a.message = n));
    } catch {}
    return a;
  }
  async getAllTorrents() {
    return await this.getTorrentsBy({});
  }
  async getTorrentsBy(e) {
    const s = { fields: this.torrentRequestFields };
    e.ids && (s.ids = e.ids);
    const { data: a } = await this.request("torrent-get", s);
    let r = a.arguments.torrents.map((t) => {
      let i = d.unknown;
      return (
        t.status === 6
          ? (i = d.seeding)
          : t.status === 4
            ? (i = d.downloading)
            : t.status === 0
              ? (i = d.paused)
              : t.status === 2
                ? (i = d.checking)
                : (t.status === 3 || t.status === 5) && (i = d.queued),
        {
          id: t.id,
          infoHash: t.hashString,
          name: t.name,
          progress: t.percentDone * 100,
          isCompleted: t.leftUntilDone < 1,
          ratio: t.uploadRatio,
          dateAdded: t.addedDate,
          savePath: t.downloadDir,
          label: t.labels && t.labels.length ? t.labels[0] : void 0,
          state: i,
          totalSize: t.totalSize,
          uploadSpeed: t.rateUpload,
          downloadSpeed: t.rateDownload,
          totalUploaded: t.uploadedEver,
          totalDownloaded: t.downloadedEver,
          raw: t,
          clientId: this.config.id,
        }
      );
    });
    return (e.complete && (r = r.filter((t) => t.isCompleted)), r);
  }
  async pauseTorrent(e) {
    const s = { ids: e };
    return (await this.request("torrent-stop", s), !0);
  }
  async removeTorrent(e, s) {
    const a = { ids: e, "delete-local-data": s };
    return (await this.request("torrent-remove", a), !0);
  }
  async resumeTorrent(e) {
    const s = { ids: e };
    return (await this.request("torrent-start", s), !0);
  }
  async getTorrentTrackers(e) {
    let s;
    if (Array.isArray(e.raw.trackers)) s = e.raw.trackers;
    else {
      const {
        data: { arguments: a },
      } = await this.request("torrent-get", { ids: [e.id], fields: ["trackers"] });
      s = a.torrents[0]?.trackers;
    }
    return (s ?? []).map((a) => a.announce);
  }
  async request(e, s = {}) {
    try {
      return await h.post(
        this.address,
        { method: e, arguments: s },
        {
          auth: { username: this.config.username, password: this.config.password },
          headers: { "X-Transmission-Session-Id": this.sessionId },
          timeout: this.config.timeout,
        },
      );
    } catch (a) {
      if (g(a) && a?.response?.status === 409)
        return ((this.sessionId = a.response.headers["x-transmission-session-id"]), await this.request(e, s));
      throw a;
    }
  }
}
export { f as clientConfig, v as clientMetaData, A as default };
