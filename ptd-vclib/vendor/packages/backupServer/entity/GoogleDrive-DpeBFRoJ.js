import { u as n } from "../../../url-join/url-join-Cu798wIg.js";
import { j as c, bK as p } from "../../site/index-COeZNva1.js";
import { A as d } from "../AbstractBackupServer-0VMguH3S.js";
import { E as o, a as l } from "../utils-BmKctBTI.js";
import "../../../jszip/jszip.min-DP3ssR4z.js";
import "../../../../assets/_commonjs-dynamic-modules-TDtrdbi3.js";
import "../../../crypto-js/index-B0NDMIdm.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
const v = { name: "GoogleDrive", type: "GoogleDrive", config: { client_id: "", client_secret: "", refresh_token: "" } },
  D = {
    description: "Google Drive 是 Google 提供的云存储服务，支持文件存储和共享功能。",
    requiredField: [
      { name: "client_id", key: "client_id", type: "string" },
      { name: "client_secret", key: "client_secret", type: "string" },
      { name: "refresh_token", key: "refresh_token", type: "string" },
    ],
  };
class q extends d {
  version = "1.0.0";
  accessInformation;
  rootFolderName = "PTD Backup";
  ApiEndpoint = "https://www.googleapis.com/drive/v3/files";
  async fetchAccessToken() {
    if (this.accessInformation === void 0 || this.accessInformation.expired_at < Date.now()) {
      const { data: e } = await c.post(
        "https://www.googleapis.com/oauth2/v4/token",
        new URLSearchParams({
          client_id: this.userConfig.client_id,
          client_secret: this.userConfig.client_secret,
          refresh_token: this.userConfig.refresh_token,
          grant_type: "refresh_token",
        }),
      );
      this.accessInformation = { ...e, expired_at: Date.now() + 3500 * 1e3 };
    }
    return this.accessInformation;
  }
  async request(e = {}, a = 3) {
    const s = await this.fetchAccessToken();
    e.headers = { ...e.headers, authorization: "Bearer " + s.access_token };
    try {
      return c.request(e);
    } catch (r) {
      const t = r.response;
      if (t.data && t.data?.error?.message === "Rate Limit Exceeded" && a > 0)
        return (await p(2e3), await this.request(e, a - 1));
      throw Error(`Network Error: ${t.status} ${t.statusText || ""}`.trim());
    }
  }
  async getScope() {
    return (await this.fetchAccessToken()).scope === "https://www.googleapis.com/auth/drive.appdata"
      ? "appDataFolder"
      : "drive";
  }
  async getParentId() {
    if ((await this.getScope()) === "appDataFolder") return "appDataFolder";
    {
      const a = await this.request({
        url: this.ApiEndpoint,
        params: {
          q: `'root' in parents and mimeType='application/vnd.google-apps.folder' and name='${this.rootFolderName}'`,
        },
      });
      if (a.data.files.length === 0) {
        const { data: s } = await this.request({
          method: "post",
          url: this.ApiEndpoint,
          data: { name: this.rootFolderName, mimeType: "application/vnd.google-apps.folder" },
        });
        return s.id;
      } else return a.data.files[0].id;
    }
  }
  async addFile(e, a) {
    const s = { name: e, parents: [await this.getParentId()] },
      r = new FormData();
    (r.append("metadata", new Blob([JSON.stringify(s)], { type: "application/json" })),
      r.append("file", await this.backupDataToJSZipBlob(a)));
    const { data: t } = await this.request({
      method: "post",
      url: "https://www.googleapis.com/upload/drive/v3/files",
      params: { uploadType: "multipart" },
      data: r,
    });
    return !!t.id;
  }
  async getFile(e) {
    const { data: a } = await this.request({
      url: n(this.ApiEndpoint, e),
      params: { alt: "media" },
      responseType: "blob",
    });
    return await this.jsZipBlobToBackupData(a);
  }
  async deleteFile(e) {
    try {
      return (await this.request({ method: "delete", url: n(this.ApiEndpoint, e) }), !0);
    } catch (a) {
      if (a.response.data?.error?.message?.startsWith("File not found: ")) return !0;
    }
    return !1;
  }
  async list(e = {}) {
    const a = [],
      s = {
        spaces: await this.getScope(),
        q: `'${await this.getParentId()}' in parents and trashed = false`,
        fields: "nextPageToken, files(kind, id, name, mimeType, size, createdTime)",
        pageSize: 1e3,
      };
    if (e) {
      let t = "";
      switch (e.orderBy) {
        case o.name:
          t += "name";
          break;
        case o.size:
          t += "quotaBytesUsed";
          break;
        case o.time:
        default:
          t += "modifiedTime";
      }
      (e.orderMode !== l.asc && (t += " desc"), (s.orderBy = t));
    }
    let r;
    do {
      r && (s.pageToken = r);
      const { data: t } = await this.request({ url: this.ApiEndpoint, params: s });
      (t.files.length > 0 &&
        t.files.forEach((i) => {
          a.push({ filename: i.name, path: i.id, time: +new Date(i.createdTime), size: parseInt(i.size) });
        }),
        t.nextPageToken && (r = t.nextPageToken));
    } while (r);
    return a;
  }
  async ping() {
    try {
      return typeof (await this.fetchAccessToken())?.access_token < "u";
    } catch {}
    return !1;
  }
}
export { q as default, v as serverConfig, D as serverMetaData };
