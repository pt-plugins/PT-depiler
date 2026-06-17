import { a as c, A as p, C as d } from "../types-bvm8eB57.js";
import { u as h } from "../../../url-join/url-join-Cu798wIg.js";
import { j as m } from "../../site/index-COeZNva1.js";
import { g as f } from "../utils-Qej-F1x7.js";
import "../index-BATa0ddy.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
const g = { type: "Deluge", name: "Deluge", address: "http://localhost:8112/", password: "", timeout: 60 * 1e3 },
  _ = {
    description: "Deluge 是一个通过PyGTK建立图形界面的BitTorrent客户端",
    warning: [
      "仅支持Deluge Web，非Deluge Daemon的直接支持，具体原因请见 issue #207",
      "注意：由于 Deluge 验证机制限制，第一次测试连接成功后，后续测试无论密码正确与否都会提示成功。",
    ],
    feature: { CustomPath: { allowed: !0, description: c }, DefaultAutoStart: { allowed: !0 } },
    advanceAddTorrentOptions: [
      {
        name: "自动管理",
        key: "auto_managed",
        type: "boolean",
        defaultValue: !1,
        description: "Set torrent to auto managed mode, i.e. will be started or queued automatically.",
      },
      {
        name: "完成后自动移动",
        key: "move_completed",
        type: "boolean",
        defaultValue: !1,
        description: "Move the torrent when downloading has finished.",
      },
      {
        name: "预分配存储",
        key: "pre_allocate_storage",
        type: "boolean",
        defaultValue: !1,
        description: "When adding the torrent should all files be pre-allocated.",
      },
      {
        name: "先下载首尾文件块",
        key: "prioritize_first_last_pieces",
        type: "boolean",
        defaultValue: !1,
        description: "Prioritize the first and last pieces of the torrent.",
      },
      {
        name: "达到分享率时自动删除",
        key: "remove_at_ratio",
        type: "boolean",
        defaultValue: !1,
        description: "Remove torrent when ratio is reached.",
      },
      {
        name: "发种模式",
        key: "seed_mode",
        type: "boolean",
        defaultValue: !1,
        description: "Assume that all files are present for this torrent (Only used when adding a torent).",
      },
      {
        name: "顺序下载",
        key: "sequential_download",
        type: "boolean",
        defaultValue: !1,
        description: "Download the pieces of the torrent in order.",
      },
      {
        name: "超级做种模式",
        key: "super_seeding",
        type: "boolean",
        defaultValue: !1,
        description: "Enable super seeding/initial seeding.",
      },
    ],
  },
  y = _.advanceAddTorrentOptions.filter((o) => o.type === "boolean").map((o) => o.key);
class q extends p {
  version = "v0.1.0";
  address;
  _msgId;
  isLogin = !1;
  torrentRequestField = [
    "hash",
    "name",
    "progress",
    "ratio",
    "time_added",
    "save_path",
    "label",
    "state",
    "total_size",
    "trackers",
  ];
  constructor(t) {
    (super({ ...g, ...t }), (this._msgId = 0));
    let e = this.config.address;
    (e.indexOf("json") === -1 && (e = h(e, "/json")), (this.address = e));
  }
  async ping() {
    return await this.login();
  }
  async getClientVersionFromRemote() {
    const t = await this.request("daemon.info"),
      e = await this.request("core.get_libtorrent_version");
    return `${t} (lt ${e})`;
  }
  async getClientStatus() {
    const t = ["download_rate", "upload_rate", "total_download", "total_upload"],
      e = await this.request("core.get_session_status", [t]);
    return { upSpeed: e.upload_rate, dlSpeed: e.download_rate, upData: e.total_upload, dlData: e.total_download };
  }
  async getClientFreeSpace() {
    return await this.request("core.get_free_space");
  }
  async addTorrent(t, e = {}) {
    const a = { success: !1 },
      s = { add_paused: e.addAtPaused ?? !1 },
      n = e.advanceAddTorrentOptions ?? {};
    (e.savePath && (s.download_location = e.savePath),
      e.uploadSpeedLimit && e.uploadSpeedLimit > 0 && (s.max_upload_speed = e.uploadSpeedLimit * 1024));
    for (const r of y) n[r] === !0 && (s[r] = n[r]);
    let i, l;
    t.startsWith("magnet:") || !e.localDownload
      ? ((i = "core.add_torrent_url"), (l = [t, s]))
      : ((i = "core.add_torrent_file"),
        (l = ["", (await f({ url: t, ...(e.localDownloadOption || {}) })).metadata.base64(), s]));
    try {
      const r = await this.request(i, l);
      if (r !== null && e.label)
        try {
          const u = r[0][1];
          await this.request("label.set_torrent", [u, e.label]);
        } catch {}
      ((a.success = r !== null), a.success || (a.message = r));
    } catch {}
    return a;
  }
  async getAllTorrents() {
    return await this.getTorrentsBy({});
  }
  async getTorrentsBy(t) {
    (t.ids && ((t.hash = t.ids), delete t.ids), t.complete && ((t.state = "Seeding"), delete t.complete));
    const e = await this.request("core.get_torrents_status", [t, this.torrentRequestField]);
    return Object.values(e).map((a) => {
      let s = d.unknown;
      return (
        Object.keys(d).includes(a.state.toLowerCase()) && (s = d[a.state.toLowerCase()]),
        {
          id: a.hash,
          infoHash: a.hash,
          isCompleted: a.progress >= 100,
          dateAdded: a.time_added,
          name: a.name,
          progress: a.progress,
          ratio: a.ratio,
          savePath: a.save_path,
          state: s,
          totalSize: a.total_size,
          uploadSpeed: a.upload_payload_rate,
          downloadSpeed: a.download_payload_rate,
          totalUploaded: a.total_uploaded,
          totalDownloaded: a.total_done,
          raw: a,
          clientId: this.config.id,
        }
      );
    });
  }
  async pauseTorrent(t) {
    try {
      return await this.request("core.pause_torrent", [t]);
    } catch {
      return !1;
    }
  }
  async removeTorrent(t, e = !1) {
    try {
      return await this.request("core.remove_torrent", [t, e]);
    } catch {
      return !1;
    }
  }
  async resumeTorrent(t) {
    try {
      return await this.request("core.resume_torrent", [t]);
    } catch {
      return !1;
    }
  }
  async getTorrentTrackers(t) {
    let e;
    if (typeof t == "object" && Array.isArray(t.raw?.trackers)) e = t.raw.trackers;
    else {
      const a = t.infoHash || t.id,
        s = await this.request("core.get_torrents_status", [{ hash: a }, ["trackers"]]);
      e = Object.values(s)[0]?.trackers;
    }
    return e ? e.map((a) => a.url) : [];
  }
  async login() {
    try {
      return ((this.isLogin = await this.request("auth.login", [this.config.password])), this.isLogin);
    } catch {
      return !1;
    }
  }
  async request(t, e = []) {
    !this.isLogin && t !== "auth.login" && (await this.login());
    const {
      data: { result: a },
    } = await m.post(this.address, { id: this._msgId++, method: t, params: e }, { responseType: "json" });
    return a;
  }
}
export { g as clientConfig, _ as clientMetaData, q as default };
