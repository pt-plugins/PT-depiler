import { C as n } from "../../../crypto-js/index-B0NDMIdm.js";
import { j as c } from "../../site/index-COeZNva1.js";
import { A as u } from "../AbstractBackupServer-0VMguH3S.js";
import "../../../../assets/_commonjs-dynamic-modules-TDtrdbi3.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../utils-BmKctBTI.js";
import "../../../jszip/jszip.min-DP3ssR4z.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
const S = {
    name: "CookieCloud",
    type: "CookieCloud",
    config: { address: "https://cookiecloud.example.com/", uuid: "", password: "", headers: "" },
  },
  x = {
    description:
      "CookieCloud是一个和自架服务器同步Cookie的小工具，可以将浏览器的Cookie同步到手机和云端，它内置端对端加密。",
    requiredField: [
      { name: "地址", key: "address", type: "string" },
      {
        name: "UUID",
        key: "uuid",
        type: "string",
        description: "CookieCloud 的身份识别信息，建议不与其他已使用的UUID相同",
      },
      {
        name: "密码",
        key: "password",
        type: "string",
        description: "CookieCloud 后端强制加密，且不使用全局加密的密钥",
      },
      {
        name: "Headers",
        key: "headers",
        type: "strings",
        description: "CookieCloud 的鉴权 Headers，如果没有，请留空。如果有，则一行一个，格式为 key: value",
      },
    ],
  };
class A extends u {
  version = "0.0.1";
  get encryptionKey() {
    return this.userConfig.password;
  }
  async request(s, e = {}) {
    const t = { ...(e.headers ?? {}), "Content-Type": "application/json" };
    return (
      this.userConfig.headers?.trim().length > 0 &&
        this.userConfig.headers
          ?.trim()
          .split(
            `
`,
          )
          .forEach((o, i) => {
            let a = String(o).split(":");
            a?.length > 1 && (t[a[0]] = a[1]);
          }),
      c.request({ baseURL: this.userConfig.address, url: s, ...e, headers: t })
    );
  }
  async ping() {
    try {
      return (await this.request("", { responseType: "text" })).data?.includes("Hello World!API ROOT =") || !1;
    } catch (s) {
      console?.warn(s);
    }
    return !1;
  }
  async addFile(s, e) {
    const t = { ...(e.manifest ?? {}), encryption: !0, fileName: s, path: "", size: "N/A", files: {} },
      r = { cookie_data: {}, local_storage_data: {}, ptd_data: {}, manifest: t };
    (e.cookies && ((r.cookie_data = e.cookies), delete e.cookies), delete e.manifest, (r.ptd_data = e));
    const o = n.MD5(`${this.userConfig.uuid}-${this.userConfig.password}`).toString().substring(0, 16),
      i = n.AES.encrypt(JSON.stringify(r), o).toString();
    try {
      return (
        (await this.request("/update", { method: "POST", data: { uuid: this.userConfig.uuid, encrypted: i } })).data
          .action === "done"
      );
    } catch {}
    return !1;
  }
  async deleteFile(s) {
    return await this.addFile("", { cookie: {} });
  }
  async getFile(s) {
    const e = await this.request(`/get/${this.userConfig.uuid}`);
    if (e.data?.encrypted) {
      const t = n.MD5(`${this.userConfig.uuid}-${this.userConfig.password}`).toString().substring(0, 16),
        r = n.AES.decrypt(e.data.encrypted, t).toString(n.enc.Utf8),
        o = JSON.parse(r),
        i = o.ptd_data;
      i.cookies = o.cookie_data;
      const a = {};
      for (const [d, p] of Object.entries(i)) typeof p == "object" && (a[d] = !0);
      return (
        (i.manifest = o.manifest),
        (i.manifest.files = a),
        (i.manifest.size = parseInt(e.headers?.["content-length"] ?? "0") || "N/A"),
        i
      );
    }
    throw new Error("No data found");
  }
  async list(s = {}) {
    const e = [],
      t = await this.getFile("");
    return (
      t.manifest &&
        e.push({ filename: t.manifest.fileName, path: "", time: t.manifest.time, size: t.manifest.size ?? "N/A" }),
      e
    );
  }
}
export { A as default, S as serverConfig, x as serverMetaData };
