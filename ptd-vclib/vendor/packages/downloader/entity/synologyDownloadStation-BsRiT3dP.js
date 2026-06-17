import { A as u, C as o } from "../types-bvm8eB57.js";
import { u as p } from "../../../url-join/url-join-Cu798wIg.js";
import { j as m } from "../../site/index-COeZNva1.js";
import { g as h } from "../utils-Qej-F1x7.js";
import "../index-BATa0ddy.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
const f = {
    type: "synologyDownloadStation",
    name: "Synology Download Station",
    address: "http://mysd.com:5000/",
    username: "",
    password: "",
    timeout: 60 * 1e3,
  },
  _ = {
    description: "Download Station是由Synology NAS提供的一款网页式下载应用程序",
    warning: ["DSM 4.2以及之后版本请勿开启二步验证选项"],
    feature: {
      CustomPath: {
        allowed: !0,
        description:
          "因 Synology Download Station API 接口限制，保存目录依赖于“暂存位置”，并且只允许使用相对路径；<br/>如暂存位置为 /volume1/，期望存储目的地位置为 /volume1/music/，那么请在“目录列表”中填写：music",
      },
      DefaultAutoStart: { allowed: !0 },
    },
  };
function l(c, e = !1) {
  const a = e ? new FormData() : new URLSearchParams();
  return (
    Object.entries(c).forEach(([s, t]) => {
      t !== void 0 && (Array.isArray(t) && (t = JSON.stringify(t)), a.append(s, t));
    }),
    a
  );
}
class q extends u {
  version = "v0.2.2";
  _sessionId;
  _apiInfo;
  constructor(e = {}) {
    super({ ...f, ...e });
  }
  async getSessionId() {
    return (this._sessionId || (await this.login()), this._sessionId);
  }
  async getApiInfo() {
    if (!this._apiInfo) {
      const e = await this.request("query.cgi", {
        params: { api: "SYNO.API.Info", method: "query", query: "all", version: 1 },
      });
      e.success && (this._apiInfo = e.data);
    }
    return this._apiInfo;
  }
  async request(e, a) {
    return (
      await m.request({
        baseURL: this.config.address,
        url: p("webapi", e),
        timeout: this.config.timeout,
        withCredentials: !1,
        ...a,
      })
    ).data;
  }
  async requestEntryCGI(e) {
    const a = await this.getSessionId();
    let s;
    return (
      e instanceof FormData ? ((s = e), s.set("_sid", a)) : ((e._sid = a), (s = l(e))),
      await this.request("entry.cgi", { method: "post", data: s })
    );
  }
  async login() {
    const a = ((await this.getApiInfo())["SYNO.API.Auth"]?.maxVersion || 6) >= 7 ? 3 : 2;
    try {
      const s = await this.request("auth.cgi", {
        params: {
          api: "SYNO.API.Auth",
          version: a,
          method: "login",
          account: this.config.username,
          passwd: this.config.password,
          session: "DownloadStation",
          format: "sid",
        },
      });
      return (s.success && (this._sessionId = s.data.sid), s.success);
    } catch {
      return !1;
    }
  }
  async ping() {
    return this.login();
  }
  async getClientStatus() {
    const e = { dlSpeed: 0, upSpeed: 0 },
      a = await this.requestEntryCGI({ api: "SYNO.DownloadStation2.Task.Statistic", method: "get", version: 1 });
    return (a.success && ((e.upSpeed = a.data.upload_rate), (e.dlSpeed = a.data.download_rate)), e);
  }
  async getClientVersionFromRemote() {
    const e = await this.requestEntryCGI({ api: "SYNO.Core.Package", method: "list", version: 2 });
    let a = "";
    return (e.success && (a = e.data.packages.find((t) => t.id === "DownloadStation")?.version ?? ""), a);
  }
  async addTorrent(e, a = {}) {
    const s = { success: !1 },
      t = { api: "SYNO.DownloadStation2.Task", method: "create", version: 2, create_list: !1 };
    t.destination = `"${a.savePath || ""}"`;
    let i;
    if (e.startsWith("magnet:") || !a.localDownload) ((t.type = '"url"'), (t.url = [e]), (i = t));
    else {
      ((t.type = '"file"'), (t.file = ["torrent"]), (i = l(t, !0)));
      const r = await h({ url: e, ...(a.localDownloadOption || {}) });
      i.append("torrent", r.metadata.blob(), r.name);
    }
    const n = await this.requestEntryCGI(i);
    return (
      n.success && a.addAtPaused && n.data.task_id.length > 0 && (await this.pauseTorrent(n.data.task_id[0])),
      (s.success = n.success ?? !1),
      s.success || (s.message = n),
      s
    );
  }
  async getAllTorrents() {
    return await this.getTorrentsBy({});
  }
  async getTorrentsBy(e) {
    const a = { api: "SYNO.DownloadStation2.Task", method: "list", version: 2, additional: ["detail", "transfer"] };
    return (
      e.ids && ((a.method = "get"), (a.id = e.ids)),
      (await this.requestEntryCGI(a)).data.task
        .filter((t) => t.type === "bt")
        .map((t) => {
          let i = o.unknown;
          if (typeof t.status == "string")
            switch (t.status) {
              case "downloading":
              case "extracting":
                i = o.downloading;
                break;
              case "seeding":
              case "finished":
              case "finishing":
                i = o.seeding;
                break;
              case "paused":
                i = o.paused;
                break;
              case "filehosting_waiting":
              case "waiting":
                i = o.queued;
                break;
              case "hash_checking":
                i = o.checking;
                break;
              case "error":
                i = o.error;
                break;
            }
          else if (t.status >= 101) i = o.error;
          else
            switch (t.status) {
              case 1:
              case 11:
              case 12:
              case 15:
              case 9:
                i = o.queued;
                break;
              case 2:
              case 10:
                i = o.downloading;
                break;
              case 3:
              case 4:
              case 13:
              case 14:
              case 5:
                i = o.paused;
                break;
              case 6:
                i = o.checking;
                break;
              case 7:
              case 8:
                i = o.seeding;
                break;
            }
          const n = t.additional.detail.completed_time > 0,
            r = t.additional.transfer.size_uploaded,
            d = t.additional.transfer.size_downloaded;
          return {
            id: t.id,
            infoHash: t.id,
            name: t.title,
            state: i,
            dateAdded: t.additional.detail.created_time,
            isCompleted: n,
            progress: d / t.size,
            savePath: t.additional.detail.destination,
            totalSize: t.size,
            ratio: r / d,
            uploadSpeed: t.additional.transfer.speed_upload,
            downloadSpeed: t.additional.transfer.speed_download,
            totalUploaded: r,
            totalDownloaded: d,
            raw: t,
            clientId: this.config.id,
          };
        })
    );
  }
  async pauseTorrent(e) {
    return (await this.requestEntryCGI({ id: e, api: "SYNO.DownloadStation2.Task", method: "pause", version: 2 }))
      .success;
  }
  async resumeTorrent(e) {
    return (await this.requestEntryCGI({ id: e, api: "SYNO.DownloadStation2.Task", method: "resume", version: 2 }))
      .success;
  }
  async removeTorrent(e, a) {
    return (
      await this.requestEntryCGI({
        id: e,
        api: "SYNO.DownloadStation2.Task",
        method: "delete",
        version: 2,
        force_complete: !1,
      })
    ).success;
  }
  async getTorrentTrackers(e) {
    return [];
  }
}
export { f as clientConfig, _ as clientMetaData, q as default };
