import { m as i } from "../../../es-toolkit/merge-DO-l8DcJ.js";
import { j as n } from "../../site/index-COeZNva1.js";
import { A as c } from "../AbstractBackupServer-0VMguH3S.js";
import { l as p } from "../utils-BmKctBTI.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../jszip/jszip.min-DP3ssR4z.js";
import "../../../../assets/_commonjs-dynamic-modules-TDtrdbi3.js";
import "../../../crypto-js/index-B0NDMIdm.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
const w = { name: "DropBox", type: "DropBox", config: { access_token: "" } },
  k = {
    description: "DropBox 是一个云存储服务，提供文件存储和共享功能。",
    requiredField: [{ name: "access_token", key: "access_token", type: "string" }],
  };
class D extends c {
  version = "1.0.0";
  get accessToken() {
    return this.userConfig.access_token;
  }
  async request(e) {
    return n.request(
      i({ method: "POST", headers: { Authorization: `Bearer ${this.accessToken}` }, responseType: "json" }, e),
    );
  }
  async ping() {
    try {
      const { data: e } = await this.request({ url: "https://api.dropboxapi.com/2/users/get_current_account" });
      return !!e.account_id;
    } catch {
      return !1;
    }
  }
  async addFile(e, t) {
    try {
      const { data: r } = await this.request({
        url: "https://content.dropboxapi.com/2/files/upload",
        headers: { "Dropbox-API-Arg": JSON.stringify({ path: `/${e}`, mode: "overwrite" }) },
        data: await this.backupDataToJSZipBlob(t),
      });
      return !!r.is_downloadable;
    } catch {
      return !1;
    }
  }
  async getFile(e) {
    const { data: t } = await this.request({
      url: "https://content.dropboxapi.com/2/files/download",
      headers: { "Dropbox-API-Arg": JSON.stringify({ path: e }) },
      responseType: "blob",
    });
    return await this.jsZipBlobToBackupData(t);
  }
  async deleteFile(e) {
    try {
      const { data: t } = await this.request({
        url: "https://api.dropboxapi.com/2/files/delete_v2",
        data: { path: e },
      });
      return !t.error_summary;
    } catch {
      return !1;
    }
  }
  async list(e = {}) {
    const t = [];
    let r,
      s = !0;
    for (; s; ) {
      const { data: o } = await this.request({
        url: `https://api.dropboxapi.com/2/files/list_folder${r ? "/continue" : ""}`,
        data: r ? { cursor: r } : { path: "" },
      });
      for (const a of o.entries)
        a[".tag"] === "file" &&
          t.push({
            filename: a.name,
            path: a.path_display,
            time: +new Date(a.client_modified || a.server_modified),
            size: a.size,
          });
      ((s = o.has_more), (r = o.cursor));
    }
    return p(t, e);
  }
}
export { D as default, w as serverConfig, k as serverMetaData };
