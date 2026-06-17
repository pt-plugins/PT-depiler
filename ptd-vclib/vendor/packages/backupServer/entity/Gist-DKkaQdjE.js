import { j as u } from "../../site/index-COeZNva1.js";
import { C as f } from "../../../crypto-js/index-B0NDMIdm.js";
import { A as d } from "../AbstractBackupServer-0VMguH3S.js";
import { l as h, e as y, d as m } from "../utils-BmKctBTI.js";
import "../../../../assets/_commonjs-dynamic-modules-TDtrdbi3.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../../../jszip/jszip.min-DP3ssR4z.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
const b = { name: "Gist", type: "Gist", config: { gist_id: "", access_token: "" } },
  G = {
    description: "Gist 是 GitHub 提供的一个代码片段分享平台，支持文件存储和共享功能。",
    requiredField: [
      {
        name: "Gist ID",
        key: "gist_id",
        type: "string",
        description:
          "填入 https://gist.github.com/<userName>/<gist_id> 的地址中 gist_id 部分，创建一个 secret gist 即可",
      },
      {
        name: "Access Token",
        key: "access_token",
        type: "string",
        description:
          "创建一个 Fine-grained personal access tokens ， Repository access 为 Public repositories 并在下方 Permissions - Account permissions 中找到 Gists 并将其设置为 Read And Write",
      },
    ],
  };
class A extends d {
  version = "0.0.1";
  async request(e, t = {}) {
    const s = {
      ...(t.headers ?? {}),
      Authorization: `Bearer ${this.userConfig.access_token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    return u.request({ ...t, baseURL: `https://api.github.com/gists/${this.userConfig.gist_id}`, url: e, headers: s });
  }
  async ping() {
    try {
      return typeof (await this.request("")).data?.url == "string";
    } catch (e) {
      console?.warn(e);
    }
    return !1;
  }
  async list(e = {}) {
    const t = [],
      s = await this.request("/commits", { params: { per_page: 100 } });
    for (const i of s.data)
      i.change_status?.deletions > 0 &&
        t.push({ filename: i.version, path: i.version, time: new Date(i.committed_at).getTime(), size: "N/A" });
    return h(t, e);
  }
  async addFile(e, t) {
    let s = {};
    const i = {
        version: `${this.config.type} (${this.version})`,
        time: new Date().getTime(),
        ...(t.manifest ?? {}),
        encryption: !0,
        fileName: e,
        files: {},
      },
      o = {};
    for (const [r, c] of Object.entries(t)) {
      const n = `${r}.${i.encryption ? "txt" : "json"}`,
        a = this.encryptData(c);
      ((i.files[r] = { name: n, hash: f.MD5(a).toString() }), (o[n] = { content: a }));
    }
    ((s["_manifest.json"] = { content: JSON.stringify(i, null, 2) }), (s = { ...s, ...o }));
    try {
      const r = await this.request(""),
        c = Object.keys(r.data?.files ?? {});
      for (const n of c) typeof s[n] > "u" && !n.includes(".keep.") && (s[n] = null);
      return (await this.request("", { method: "PATCH", data: { description: e, files: s } }), !0);
    } catch {
      return !1;
    }
  }
  async getFile(e) {
    const {
        data: { files: t = {} },
      } = await this.request(`/${e}`),
      s = t?.["_manifest.json"]?.content;
    if (!s) throw new Error("This file is not valid.");
    const i = {},
      o = JSON.parse(s);
    for (const [r, c] of Object.entries(o.files)) {
      const { hash: n, name: a } = c;
      let p = t[a]?.content;
      if (p) {
        if ((t[a].truncated && (p = (await this.request(t[a].raw_url)).data), f.MD5(p).toString() !== n))
          throw new Error(`File hash mismatch for ${a}.`);
        try {
          i[r] = this.decryptData(p);
        } catch {
          throw new Error("Failed to decrypt file.");
        }
      }
    }
    return ((i.manifest = o), i);
  }
  async deleteFile(e) {
    return !1;
  }
  encryptData(e) {
    const t = `${this.encryptionKey ?? ""}|${this.userConfig.gist_id}`;
    return y(e, t);
  }
  decryptData(e) {
    const t = [`${this.encryptionKey ?? ""}|${this.userConfig.gist_id}`, this.encryptionKey];
    for (const s of t)
      try {
        return m(e, s);
      } catch {}
    throw new Error("Failed to decrypt data with provided keys.");
  }
}
export { A as default, b as serverConfig, G as serverMetaData };
