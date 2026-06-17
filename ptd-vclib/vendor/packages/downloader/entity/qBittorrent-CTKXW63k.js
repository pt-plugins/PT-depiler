import { A as h, C as n, a as m } from "../types-bvm8eB57.js";
import { j as l } from "../../site/index-COeZNva1.js";
import { u as p } from "../../../url-join/url-join-Cu798wIg.js";
import { g } from "../utils-Qej-F1x7.js";
import { m as f } from "../../../es-toolkit/merge-DO-l8DcJ.js";
import "../index-BATa0ddy.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
const d = "category:",
  y = {
    type: "qBittorrent",
    name: "qBittorrent",
    address: "http://localhost:9091/",
    username: "",
    password: "",
    timeout: 60 * 1e3,
  },
  w = {
    description: "qBittorrent是一个跨平台的自由BitTorrent客户端，其图形用户界面是由Qt所写成的。",
    warning: [
      "当前仅支持 qBittorrent v4.1+",
      "如果你使用的 qBittorrent 版本大于 5.2.0，可以使用 API Key 形式连接，此时请直接留空用户名，在密码栏输入 API key。",
      "由于浏览器限制，需要禁用 qBittorrent 的『启用跨站请求伪造(CSRF)保护』功能才能正常使用",
      "注意：由于 qBittorrent 验证机制限制，第一次测试连接成功后，后续测试无论密码正确与否都会提示成功。",
    ],
    feature: {
      CustomPath: {
        allowed: !0,
        description:
          m +
          `（ qBittorrent 额外支持以 "${d}" 前缀的分类作为下载目录，当使用该前缀时，请在 qBittorrent 中预设分类信息。）`,
      },
      DefaultAutoStart: { allowed: !0 },
    },
    advanceAddTorrentOptions: [
      {
        name: "自动管理模式",
        key: "autoTMM",
        type: "boolean",
        defaultValue: !1,
        description: `当使用 "${d}" 前缀的分类作为下载目录，会自动启用`,
      },
      { name: "跳过哈希校验", key: "skip_checking", type: "boolean", defaultValue: !1 },
      { name: "顺序下载", key: "sequentialDownload", type: "boolean", defaultValue: !1 },
      { name: "先下载首尾文件块", key: "firstLastPiecePrio", type: "boolean", defaultValue: !1 },
    ],
  },
  D = w.advanceAddTorrentOptions.filter((o) => o.type === "boolean").map((o) => o.key),
  _ = [
    ["dl_info_data", "dlData"],
    ["dl_info_speed", "dlSpeed"],
    ["up_info_data", "upData"],
    ["up_info_speed", "upSpeed"],
  ];
function u(o, e = "|") {
  return Array.isArray(o) ? o.join(e) : o;
}
class L extends h {
  version = "v0.1.0";
  isLogin = null;
  syncData = { rid: 0 };
  lastSyncTimestamp = 0;
  webApiVersion = null;
  constructor(e = {}) {
    super({ ...y, ...e });
  }
  get isApiKeyAuth() {
    return !this.config.username && this.config.password.startsWith("qbt_");
  }
  async ping() {
    try {
      if (this.isApiKeyAuth) {
        const e = await this.getClientVersion();
        this.isLogin = !!e;
      } else {
        const e = await this.login();
        this.isLogin = e.data === "Ok." || e.status === 204;
      }
      return this.isLogin;
    } catch {
      return !1;
    }
  }
  async getClientVersionFromRemote() {
    const { data: e } = await this.request("/app/version"),
      { data: a } = await this.request("/app/webapiVersion");
    return ((this.webApiVersion = a), `${e} (${a})`);
  }
  async isApiVersionAtLeast(e, a) {
    if (this.webApiVersion === null) {
      const { data: c } = await this.request("/app/webapiVersion");
      this.webApiVersion = c;
    }
    const t = this.webApiVersion.split("."),
      s = parseInt(t[0] ?? "0", 10),
      i = parseInt(t[1] ?? "0", 10);
    return isNaN(s) || isNaN(i) ? !1 : s > e || (s === e && i >= a);
  }
  async getClientStatus() {
    const e = await super.getClientStatus(),
      { server_state: a } = await this.getSyncData();
    for (const [t, s] of _) a?.[t] && (e[s] = Number(a[t]));
    return e;
  }
  async getClientFreeSpace() {
    return (await this.getSyncData()).server_state?.free_space_on_disk;
  }
  async login() {
    const e = new FormData();
    return (
      e.append("username", this.config.username),
      e.append("password", this.config.password),
      await l.post(p(this.config.address, "/api/v2", "/auth/login"), e, {
        timeout: this.config.timeout,
        withCredentials: !0,
      })
    );
  }
  async request(e, a = {}) {
    return (
      this.isLogin === null && !this.isApiKeyAuth && (await this.ping()),
      a.method?.toLowerCase() === "post" &&
        (a.headers = { ...(a.headers ?? {}), "content-type": "application/x-www-form-urlencoded" }),
      this.isApiKeyAuth && (a.headers = { ...(a.headers ?? {}), Authorization: `Bearer ${this.config.password}` }),
      await l.request({ baseURL: this.config.address, url: p("/api/v2", e), timeout: this.config.timeout, ...a })
    );
  }
  async getSyncData(e = !1) {
    if (Date.now() > this.lastSyncTimestamp + 15e3) {
      const { data: a } = await this.request("/sync/maindata", { params: { rid: e ? 0 : this.syncData.rid } });
      ((this.lastSyncTimestamp = Date.now()),
        (this.syncData = a.full_update ? a : f(this.syncData, a)),
        this.syncData.torrents &&
          this.syncData.torrents_removed &&
          (this.syncData.torrents_removed.forEach((t) => delete this.syncData.torrents[t]),
          delete this.syncData.torrents_removed),
        this.syncData.categories &&
          this.syncData.categories_removed &&
          (this.syncData.categories_removed.forEach((t) => delete this.syncData.categories[t]),
          delete this.syncData.categories_removed),
        this.syncData.tags &&
          this.syncData.tags_removed &&
          (this.syncData.tags_removed.forEach((t) => {
            const s = this.syncData.tags.findIndex((i) => i === t);
            s !== -1 && this.syncData.tags.splice(s, 1);
          }),
          delete this.syncData.tags_removed));
    }
    return this.syncData;
  }
  async addTorrent(e, a = {}) {
    const t = { success: !1 },
      s = new FormData(),
      i = a.advanceAddTorrentOptions ?? {};
    if (e.startsWith("magnet:") || !a.localDownload) s.append("urls", e);
    else {
      const r = await g({ url: e, ...(a.localDownloadOption || {}) });
      s.append("torrents", r.metadata.blob(), r.name);
    }
    (a.savePath &&
      (a.savePath.startsWith(d)
        ? ((i.autoTMM = !0), s.append("category", a.savePath.replace(d, "")))
        : s.append("savepath", a.savePath)),
      a.label && s.append("tags", a.label),
      a.addAtPaused &&
        (s.append("paused", a.addAtPaused ? "true" : "false"), s.append("stopped", a.addAtPaused ? "true" : "false")),
      a.uploadSpeedLimit &&
        a.uploadSpeedLimit > 0 &&
        s.append("upLimit", (a.uploadSpeedLimit * 1024 * 1024).toString()));
    for (const r of D) i[r] === !0 && s.append(r, "true");
    const c = await this.request("/torrents/add", { method: "post", data: s });
    if (typeof c.data == "object" && c.data !== null) {
      const r = c.data;
      if (
        ((t.success = (r.success_count ?? 0) > 0 && (r.failure_count ?? 0) === 0),
        t.success && r.added_torrent_ids?.length && (t.id = r.added_torrent_ids[0]),
        !t.success)
      )
        return (
          (t.message = {
            success_count: r.success_count ?? 0,
            failure_count: r.failure_count ?? 0,
            pending_count: r.pending_count ?? 0,
            added_torrent_ids: r.added_torrent_ids ?? [],
          }),
          t
        );
    } else if (((t.success = c.data === "Ok."), !t.success)) return ((t.message = c.data), t);
    return t;
  }
  async getAllTorrents() {
    const { torrents: e } = await this.getSyncData();
    return Object.entries(e).map(([a, t]) => {
      let s = n.unknown;
      switch (t.state) {
        case "forcedDL":
        case "downloading":
        case "metaDL":
        case "stalledDL":
          s = n.downloading;
          break;
        case "allocating":
          s = n.queued;
          break;
        case "forcedUP":
        case "uploading":
        case "stalledUP":
          s = n.seeding;
          break;
        case "pausedDL":
          s = n.paused;
          break;
        case "pausedUP":
          s = n.paused;
          break;
        case "queuedDL":
        case "queuedUP":
          s = n.queued;
          break;
        case "checkingDL":
        case "checkingUP":
        case "queuedForChecking":
        case "checkingResumeData":
        case "moving":
          s = n.checking;
          break;
        case "error":
        case "unknown":
        case "missingFiles":
          s = n.error;
          break;
      }
      const i = t.progress === 1;
      return {
        id: a,
        infoHash: a,
        name: t.name,
        state: s,
        dateAdded: t.added_on,
        isCompleted: i,
        progress: t.progress * 100,
        label: t.category,
        savePath: t.save_path,
        totalSize: t.total_size,
        ratio: t.ratio,
        uploadSpeed: t.upspeed,
        downloadSpeed: t.dlspeed,
        totalUploaded: t.uploaded,
        totalDownloaded: t.downloaded,
        raw: t,
        clientId: this.config.id,
      };
    });
  }
  async pauseTorrent(e) {
    const a = { hashes: e === "all" ? "all" : u(e) },
      t = (await this.isApiVersionAtLeast(2, 11)) ? "/torrents/stop" : "/torrents/pause";
    return (await this.request(t, { method: "post", data: a }), !0);
  }
  async removeTorrent(e, a = !1) {
    const t = { hashes: e === "all" ? "all" : u(e), deleteFiles: a };
    return (await this.request("/torrents/delete", { method: "post", data: t }), !0);
  }
  async resumeTorrent(e) {
    const a = { hashes: e === "all" ? "all" : u(e) },
      t = (await this.isApiVersionAtLeast(2, 11)) ? "/torrents/start" : "/torrents/resume";
    return (await this.request(t, { method: "post", data: a }), !0);
  }
  async getClientCategories() {
    const { data: e } = await this.request("/torrents/categories");
    return e;
  }
  async getClientPaths() {
    const e = await super.getClientPaths(),
      a = await this.getClientCategories();
    return [...Object.keys(a).map((t) => d + t), ...e].filter(Boolean);
  }
  async getClientLabels() {
    const { data: e } = await this.request("/torrents/tags");
    return e;
  }
  async getTorrentTrackers(e) {
    if (typeof e == "object" && typeof e?.raw?.magnet_uri == "string") {
      const s = e.raw.magnet_uri.split("?")[1] || "";
      return new URLSearchParams(s).getAll("tr");
    }
    const a = e.infoHash || e.id,
      { data: t } = await this.request("/torrents/trackers", { params: { hash: a } });
    return t.map((s) => s.url);
  }
}
export { y as clientConfig, w as clientMetaData, L as default };
