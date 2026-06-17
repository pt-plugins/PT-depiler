import { A as l, C as r } from "../types-bvm8eB57.js";
import { u as c } from "../../../url-join/url-join-Cu798wIg.js";
import { j as u } from "../../site/index-COeZNva1.js";
import { e as h, g as m } from "../utils-Qej-F1x7.js";
import "../index-BATa0ddy.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
const f = {
    type: "uTorrent",
    name: "µTorrent",
    address: "http://127.0.0.1:8080/gui/",
    username: "admin",
    password: "",
    timeout: 60 * 1e3,
  },
  x = {
    description:
      "μTorrent 是一个小巧强劲，全功能，用C++编写，支持Windows、Mac OS X和GNU/Linux平台的免费BitTorrent客户端。",
    warning: [
      "由于 µTorrent Web API 接口不统一，当前仅支持 µTorrent Windows 版本，Mac 版本测试不可用，其他系统未知。",
      "使用前请确认 WebUI 已安装并开启",
    ],
    feature: {
      CustomPath: {
        allowed: !0,
        description:
          "仅支持 µTorrent 3.x.x 及以上版本；<br /><br />1. 在 µTorrent 的 设置 -> 高级 -> 网页界面 添加一个下载目录，如：D:\\download\\ <br />2. 在助手里添加目录列表（仅支持相对路径），如：music\\ <br />3. 最终数据的保存目录为：D:\\download\\music\\",
      },
      DefaultAutoStart: { allowed: !0 },
    },
  },
  p = 1,
  g = 2,
  w = 16,
  T = 32,
  S = 64;
class C extends l {
  version = "v0.0.1";
  address;
  _sid = null;
  constructor(t) {
    (super({ ...f, ...t }),
      (this.address = this.config.address),
      this.address.indexOf("gui") === -1
        ? (this.address = c(this.address, "/gui/"))
        : /\/gui\/$/.exec(this.address) || (this.address = this.address + "/"));
  }
  async getSessionId() {
    return (this._sid === null && (await this.login()), this._sid);
  }
  async login() {
    const t = await u.get("/token.html", {
        baseURL: this.address,
        params: { t: Date.now().toString() },
        auth: { username: this.config.username, password: this.config.password },
        timeout: this.config.timeout,
      }),
      e = />([^<]+)</.exec(t.data);
    return e ? ((this._sid = e[e.length - 1]), !0) : !1;
  }
  async ping() {
    return await this.login();
  }
  async getClientVersionFromRemote() {
    let t = "";
    try {
      const { version: e } = await this.request("getversion");
      t = `${e.major_version}.${e.minor_version}.${e.tiny_version}(${e.engine_version})`;
    } catch {
      const { build: a } = await this.request("getsettings");
      t = `2.x(${a})`;
    }
    return t;
  }
  async request(t, e = {}) {
    const a = await this.getSessionId();
    return (
      t && (e.action = t),
      (
        await u.get(this.address, {
          params: { token: a, t: Date.now().toString(), ...e },
          responseType: "json",
          timeout: this.config.timeout,
        })
      ).data
    );
  }
  async addTorrent(t, e = {}) {
    const a = { success: !1 },
      o = await this.getSessionId();
    let i = new FormData();
    const n = { token: o, action: "", download_dir: 0, path: e.savePath ? e.savePath : "" };
    let s;
    if (t.startsWith("magnet:") || !e.localDownload) ((i = null), (n.action = "add-url"), (n.s = t), (s = h(t)));
    else {
      n.action = "add-file";
      const d = await m({ url: t, ...(e.localDownloadOption || {}) });
      ((s = d.info?.infoHash), i.append("torrent_file", d.metadata.blob(), d.name));
    }
    return (
      await u.post(this.address, i, {
        params: n,
        auth: { username: this.config.username, password: this.config.password },
        timeout: this.config.timeout,
      }),
      s &&
        (e.addAtPaused && (await this.pauseTorrent(s)),
        e.label && (await this.setTorrentProp(s, { s: "label", v: e.label })),
        e.uploadSpeedLimit &&
          e.uploadSpeedLimit > 0 &&
          (await this.setTorrentProp(s, { s: "ulrate", v: e.uploadSpeedLimit * 1024 * 1024 }))),
      (a.success = !0),
      a
    );
  }
  async getAllTorrents() {
    return (await this.request("", { list: 1 })).torrents.map((e) => {
      const a = e[1],
        o = e[4] / 100,
        i = o >= 100,
        n = o >= 100;
      let s = r.unknown;
      return (
        a & T
          ? (s = r.paused)
          : a & p
            ? i
              ? (s = r.seeding)
              : (s = r.downloading)
            : a & g
              ? (s = r.checking)
              : a & w
                ? (s = r.error)
                : a & S
                  ? (s = r.queued)
                  : i
                    ? (s = r.paused)
                    : (s = r.paused),
        {
          id: e[0].toLowerCase(),
          infoHash: e[0],
          name: e[2],
          state: s,
          dateAdded: e[23],
          isCompleted: n,
          progress: o,
          label: e[11],
          savePath: e[26],
          totalSize: e[3],
          ratio: e[7] / 1e3,
          uploadSpeed: e[8],
          downloadSpeed: e[9],
          totalUploaded: e[6],
          totalDownloaded: e[5],
          raw: e,
          clientId: this.config.id,
        }
      );
    });
  }
  async setTorrentProp(t, e) {
    return (await this.request("setprops", { hash: t, ...e }), !0);
  }
  async pauseTorrent(t) {
    return (await this.request("pause", { hash: t }), !0);
  }
  async resumeTorrent(t) {
    return (await this.request("start", { hash: t }), !0);
  }
  async removeTorrent(t, e = !0) {
    const a = e ? "removedatatorrent" : "removetorrent";
    return (await this.request(a, { hash: t }), !0);
  }
  async getTorrentTrackers(t) {
    return [];
  }
}
export { f as clientConfig, x as clientMetaData, C as default };
