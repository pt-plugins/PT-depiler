import { u } from "../../../url-join/url-join-Cu798wIg.js";
import { t as p } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { j as c, A as h } from "../../site/index-COeZNva1.js";
import "../index-Cmj48V-l.js";
import { A as y } from "../types-DXvgLac7.js";
import { E as n } from "../../site/types/base-Dy_28wGT.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
const k = {
    description: "Plex 是一款流行的媒体服务器软件，支持多种设备和平台，提供丰富的媒体管理和播放功能",
    warning: ["apikey 可通过在console面板中查看 localStorage 中的 myPlexAccessToken 值"],
    auth_field: ["apikey"],
  },
  M = { type: "plex", name: "Plex", address: "", auth: { apikey: "" }, timeout: 5e3 };
class $ extends y {
  get apiBaseUrl() {
    let e = this.config.address;
    return (e.includes("/web/index.html") && (e = e.replace(/\/web\/index.html#.+/, "")), e);
  }
  get webBaseUrl() {
    let e = this.config.address;
    return (
      e.includes("/web/index.html") && (e = e.replace(/\/web\/index.html#.+/, "")),
      e.replace(/\/$/, "") + "/web/index.html"
    );
  }
  async request(e, r = {}) {
    return (
      (r.baseURL = this.apiBaseUrl),
      (r.url = e),
      (r.timeout ??= this.config.timeout),
      (r.method ??= "GET"),
      (r.params ??= {}),
      (r.params["X-Plex-Token"] = this.config.auth.apikey),
      (r.responseType = "json"),
      c.request(r)
    );
  }
  async getServerIdentity() {
    return (await this.request("/identity")).data?.MediaContainer?.machineIdentifier;
  }
  async ping() {
    return !!(await this.getServerIdentity());
  }
  async getSearchResult(e = "", r = {}) {
    const a = { status: n.unknownError, items: [] },
      o = await this.getServerIdentity();
    let s = { params: {} };
    ((r.startIndex = s.params["X-Plex-Container-Start"] = r.startIndex ?? 0),
      (r.limit = s.params["X-Plex-Container-Size"] = r.limit ?? 50),
      (s = p(s, this.config.defaultSearchExtraRequestConfig ?? {})));
    try {
      let i = "/library/recentlyAdded";
      e !== "" && ((i = "/search"), (s.params.query = e));
      const l = (await this.request(i, s))?.data?.MediaContainer?.Metadata ?? [];
      for (const t of l) {
        const d = {
          server: this.config.id,
          name: t.parentTitle ? `${t.parentTitle} (${t.title})` : t.title,
          url: `${this.webBaseUrl}#!/server/${o}/details?key=${t.key.replace(/\/children$/, "")}`,
          type: t.type === "movie" ? "Movie" : t.type,
          description: t.summary,
          format: t.Media?.[0]?.container ?? "",
          size: t.Media?.[0]?.Part?.[0].size ?? 0,
          duration: t.duration ?? 0,
          poster: t.thumb ? u(this.apiBaseUrl, `${t.thumb}?X-Plex-Token=${this.config.auth.apikey}`) : "",
          tags: t.Genre?.map((m) => ({ name: m.tag, url: "" })) ?? [],
          rating: t.audienceRating ?? "-",
          streams: [],
          user: { IsFavorite: !1, IsPlayed: !1 },
          raw: t,
        };
        a.items.push(d);
      }
      ((a.options = r), (a.status = n.success));
    } catch (i) {
      i instanceof h && i.response?.status === 401 && (a.status = n.needLogin);
    }
    return a;
  }
}
export { $ as default, M as mediaServerConfig, k as mediaServerMetaData };
