import { S as p, bl as g, c3 as L, a7 as C, bD as h } from "../index-COeZNva1.js";
import { i as k } from "../../../es-toolkit/intersection-CiePrUGh.js";
import { t as d } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { p as y } from "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import { h as m } from "../../../es-toolkit/has-CpNzJTaW.js";
import I from "./AbstractBittorrentSite-YCyl9e_L.js";
import { b as P } from "../utils/level-ChrMpKO_.js";
import { E as c, C as U, N as q } from "../types/base-Dy_28wGT.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const X = { version: -1, search: {}, userInfo: {} };
class _ extends I {
  get allowQueryUserInfo() {
    return this.isOnline && !!this.metadata.userInfo && this.userConfig.allowQueryUserInfo !== !1;
  }
  get noLoginCheckHttpStatusCodes() {
    return this.metadata.noLoginAssert?.httpStatusCodes ?? [401, 403, 502, 504];
  }
  get noLoginCheckUrlPatterns() {
    return this.metadata.noLoginAssert?.urlPatterns ?? [/doLogin|login|verify|checkpoint|returnto/gi];
  }
  get noLoginCheckRefreshHeaderPattern() {
    return this.metadata.noLoginAssert?.refreshHeaderPattern ?? this.noLoginCheckUrlPatterns;
  }
  loggedCheck(o) {
    const e = o.request;
    try {
      if (this.noLoginCheckHttpStatusCodes && this.noLoginCheckHttpStatusCodes.includes(o.status)) return !1;
      if (this.noLoginCheckUrlPatterns) {
        for (const s of this.noLoginCheckUrlPatterns) if (new RegExp(s).test(e.responseURL)) return !1;
      }
      if (o.headers.refresh && this.noLoginCheckRefreshHeaderPattern) {
        const s = /[,;]\s*url\s*=\s*([^,\s;]+)/i,
          f = o.headers.refresh.match(s);
        if (f) {
          let r = f[1].trim();
          for (const l of this.noLoginCheckRefreshHeaderPattern) if (new RegExp(l).test(r)) return !1;
        }
      }
      const t = this.metadata.noLoginAssert?.matchSelectors ?? [];
      if (t.length > 0) {
        const s = o.data instanceof Document ? (f, r) => p(r, f).length > 0 : m;
        for (const f of t) if (s(o.data, f)) return !1;
      }
      if (this.metadata.noLoginAssert?.checkResponseContent === !0) {
        const s = e.responseType === "document" ? e.responseXML?.documentElement.outerHTML : e.responseText;
        if (typeof s > "u") return !1;
        if (s.length < 800 && /login|auth_form|not authorized/.test(s)) return !1;
      }
    } catch (t) {
      console.debug(t);
    }
    return !0;
  }
  async getUserInfoResult(o = {}) {
    let e = { status: c.unknownError, updateAt: +new Date(), site: this.metadata.id };
    if (!this.allowQueryUserInfo || !this.metadata.userInfo?.process) return ((e.status = c.passParse), e);
    this.metadata.userInfo.pickLast && (e = d(e, g(o, this.metadata.userInfo.pickLast)));
    try {
      for (const t of this.metadata.userInfo.process) {
        const s = L([...(t.fields ?? []), ...Object.keys(t.selectors ?? {})]);
        if (k(s, Object.keys(e)).length === s.length) continue;
        let r = d({ url: "/", params: {}, data: {}, responseType: "document" }, t.requestConfig);
        if (t.assertion)
          for (const [n, a] of Object.entries(t.assertion))
            if (e[n])
              if (m(r, a)) {
                let i = C(r, a);
                i && typeof i == "string" && ((i = i.replace(`$${n}$`, e[n])), h(r, a, i));
              } else h(r, a, e[n]);
            else throw new Error(`断言字段 ${n} 缺失`);
        typeof t.requestConfigTransformer == "function" && (r = t.requestConfigTransformer(r, e, this));
        const l = t.requestDelay ?? this.metadata.userInfo?.requestDelay ?? 0;
        await this.sleepAction(l);
        const { data: u } = await this.request(r);
        for (const n of s) {
          const a = `parseUserInfoFor${y(n)}`;
          if (a in this && typeof this[a] == "function") e = await this[a](e, u, r);
          else {
            let i = t.selectors?.[n] ?? this.metadata.userInfo?.selectors?.[n];
            i && (e[n] = this.getFieldData(u, i));
          }
        }
      }
      (this.metadata.levelRequirements &&
        e.levelName &&
        typeof e.levelId > "u" &&
        (e.levelId = this.guessUserLevelId(e)),
        (e.status = c.success));
    } catch (t) {
      ((e.status = c.parseError),
        t instanceof U ? (e.status = c.CFBlocked) : t instanceof q && (e.status = c.needLogin));
    }
    return e;
  }
  guessUserLevelId(o) {
    return P(o, this.metadata.levelRequirements ?? []);
  }
}
export { X as SchemaMetadata, _ as default };
