import { u as s } from "../../../url-join/url-join-Cu798wIg.js";
import { j as d } from "../../site/index-COeZNva1.js";
import { A as p } from "../AbstractBackupServer-0VMguH3S.js";
import "../utils-BmKctBTI.js";
import "../../../jszip/jszip.min-DP3ssR4z.js";
import "../../../../assets/_commonjs-dynamic-modules-TDtrdbi3.js";
import "../../../crypto-js/index-B0NDMIdm.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
const w = { name: "OWSS", type: "OWSS", config: { address: "http://127.0.0.1:8088/storage", authCode: "" } },
  q = {
    description: "Open Web Simple Storage（OWSS），一个基于 nodejs 简单的 Web 存储微服务，可用于私人配置文件集中存储。",
    requiredField: [
      { name: "地址", key: "address", type: "string" },
      { name: "授权码", key: "authCode", type: "string", description: "OWSS首次部署时生成的授权码" },
    ],
  };
class O extends p {
  version = "1.0.0";
  get address() {
    let { address: t, authCode: a } = this.userConfig;
    return (t.indexOf("storage") === -1 && (t = s(t, "storage")), (t = s(t, a)), t);
  }
  async request(t) {
    return await d.request({ baseURL: this.address, timeout: 45e3, ...t });
  }
  async ping() {
    try {
      const { data: t } = await this.request({ url: "/list" });
      return Array.isArray(t.data);
    } catch {}
    return !1;
  }
  async list(t = {}) {
    const { data: a } = await this.request({ url: "/list", params: t }),
      e = [];
    return (
      a.data &&
        a.data.forEach((r) => {
          const { name: i, time: o, size: n } = r;
          e.push({ filename: i, time: o, size: n, path: i });
        }),
      e
    );
  }
  async addFile(t, a) {
    const e = new FormData();
    (e.append("name", t), e.append("data", await this.backupDataToJSZipBlob(a), t));
    const { data: r } = await this.request({ method: "post", url: "/add", data: e });
    return !!r.data;
  }
  async deleteFile(t) {
    const { data: a } = await this.request({ method: "post", url: s("/delete", t) });
    return !!a.data;
  }
  async getFile(t) {
    const { data: a } = await this.request({ url: s("/get", t), responseType: "blob" });
    return await this.jsZipBlobToBackupData(a);
  }
}
export { O as default, w as serverConfig, q as serverMetaData };
