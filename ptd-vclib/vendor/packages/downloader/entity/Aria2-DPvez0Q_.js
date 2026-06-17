import { a as l, A as c, C as i } from "../types-bvm8eB57.js";
import { g as m } from "../utils-Qej-F1x7.js";
import { u } from "../../../url-join/url-join-Cu798wIg.js";
import "../../site/index-COeZNva1.js";
import "../index-BATa0ddy.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
const p = { type: "Aria2", name: "Aria2", address: "http://localhost:6800/jsonrpc", password: "", timeout: 60 * 1e3 },
  v = {
    description: "Aria2是一款自由、跨平台命令行界面的下载管理器",
    warning: [
      "使用 WebSocket + `rpc-secret` 形式连接，请设置好 `rpc-secret` 配置项",
      "不支持使用用户名+密码的认证方式",
    ],
    feature: { CustomPath: { allowed: !0, description: l }, DefaultAutoStart: { allowed: !0 } },
  };
class C extends c {
  version = "v0.1.0";
  _wsClient;
  _msgId = 0;
  get msgId() {
    return this._msgId++;
  }
  constructor(e) {
    super({ ...p, ...e });
    let t = this.config.address;
    (t.indexOf("jsonrpc") === -1 && (t = u(t, "/jsonrpc")),
      (this.config.address = t),
      (this._wsClient = new WebSocket(t.replace(/^http/, "ws"))));
  }
  async methodSend(e, t = []) {
    return new Promise((a, r) => {
      let o;
      e === "system.multicall"
        ? (t.forEach((s) => {
            s.params = [`token:${this.config.password}`, ...s.params];
          }),
          (o = [t]))
        : (o = [`token:${this.config.password}`, ...t]);
      const n = String(this.msgId);
      (this._wsClient.addEventListener("message", (s) => {
        const d = JSON.parse(s.data);
        d.id === n ? a(d) : d.error && r(new Error(d.error?.message || "WS ERROR"));
      }),
        this._wsClient.send(JSON.stringify({ method: e, id: n, params: o })));
    });
  }
  async ping() {
    try {
      const { result: e } = await this.methodSend("aria2.getVersion");
      return e.version.includes(".");
    } catch {
      return !1;
    }
  }
  async getClientVersionFromRemote() {
    const { result: e } = await this.methodSend("aria2.getVersion");
    return e.version;
  }
  async getClientStatus() {
    const { result: e } = await this.methodSend("aria2.getGlobalStat");
    return { dlSpeed: Number(e.downloadSpeed), upSpeed: Number(e.uploadSpeed) };
  }
  async addTorrent(e, t = {}) {
    const a = { success: !1 },
      r = { pause: t.addAtPaused ?? !1 };
    t.savePath && (r.dir = t.savePath);
    let o, n;
    e.startsWith("magnet:") || !t.localDownload
      ? ((o = "aria2.addUri"), (n = [[e], r]))
      : ((o = "aria2.addTorrent"),
        (n = [(await m({ url: e, ...(t.localDownloadOption ?? {}) })).metadata.base64(), [], r]));
    try {
      const s = await this.methodSend(o, n);
      if (t.uploadSpeedLimit && t.uploadSpeedLimit > 0)
        try {
          await this.methodSend("aria2.changeOption", [s, { "max-upload-limit": `${t.uploadSpeedLimit * 1024}K` }]);
        } catch {}
      a.success = !0;
    } catch {}
    return a;
  }
  async getAllTorrents() {
    const e = [],
      { result: t } = await this.methodSend("system.multicall", [
        { methodName: "aria2.tellActive", params: [] },
        { methodName: "aria2.tellWaiting", params: [0, 1e3] },
        { methodName: "aria2.tellStopped", params: [0, 1e3] },
      ]);
    return (
      t.forEach((a) => {
        a[0].forEach((r) => {
          r.bittorrent && e.push(this.parseRawTorrent(r));
        });
      }),
      e
    );
  }
  async getTorrent(e) {
    const { result: t } = await this.methodSend("aria2.tellStatus", [e]);
    return this.parseRawTorrent(t);
  }
  async pauseTorrent(e) {
    return (await this.methodSend("aria2.pause", [e]), !0);
  }
  async removeTorrent(e, t) {
    return (await this.methodSend("aria2.remove", [e]), await this.methodSend("aria2.removeDownloadResult", [e]), !0);
  }
  async resumeTorrent(e) {
    return (await this.methodSend("aria2.unpause", [e]), !0);
  }
  async getTorrentTrackers(e) {
    return [];
  }
  parseRawTorrent(e) {
    const t = e.completedLength / e.totalLength || 0;
    let a = i.unknown;
    switch (e.status) {
      case "active":
        a = t >= 100 ? i.seeding : i.downloading;
        break;
      case "error":
      case "removed":
        a = i.error;
        break;
      case "complete":
      case "paused":
        a = i.paused;
        break;
      case "waiting":
        a = i.queued;
        break;
    }
    return {
      id: e.gid,
      infoHash: e.infoHash,
      name: e.bittorrent.info.name,
      progress: t,
      isCompleted: t >= 100,
      ratio: e.uploadLength / e.totalLength || 0,
      dateAdded: 0,
      savePath: e.dir,
      state: a,
      totalSize: Number(e.totalLength),
      totalUploaded: Number(e.uploadLength),
      totalDownloaded: Number(e.completedLength),
      uploadSpeed: Number(e.uploadSpeed),
      downloadSpeed: Number(e.downloadSpeed),
      raw: e,
      clientId: this.config.id,
    };
  }
}
export { p as clientConfig, v as clientMetaData, C as default };
