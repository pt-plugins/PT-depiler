import "../index-Cmj48V-l.js";
import { j as p, A as l } from "../../site/index-COeZNva1.js";
import { t as I } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { u as c } from "../../../url-join/url-join-Cu798wIg.js";
import { A as y } from "../types-DXvgLac7.js";
import { E as d } from "../../site/types/base-Dy_28wGT.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
const P = {
    description: "飞牛影视 / FNOS 媒体服务器，使用 FNOS 的 Emby-compatible API 搜索媒体库",
    warning: [
      "使用飞牛影视用户名和密码登录，扩展会调用 FNOS 登录接口自动获取访问 token。",
      "parentId 可选；如果不填，扩展会自动读取媒体库视图并在视图下搜索。",
    ],
    auth_field: [
      "username",
      "password",
      { name: "parentId", required: !1, message: "可选：指定要搜索的媒体库/视图 ID" },
    ],
  },
  S = {
    type: "fnos",
    name: "飞牛影视",
    address: "",
    auth: { username: "", password: "", parentId: "", apikey: "", userId: "", sessionId: "" },
    timeout: 5e3,
  },
  g = [
    "Path",
    "Status",
    "ExternalUrls",
    "CommunityRating",
    "MediaSources",
    "DisplayPreferences",
    "Genres",
    "DateCreated",
    "Overview",
    "ExtraIds",
    "ImageTags",
    "PremiereDate",
    "ProductionYear",
    "ChildCount",
    "CanDownload",
    "Chapters",
    "PrimaryImageAspectRatio",
    "UserData",
    "ProviderIds",
    "People",
    "Size",
  ].join(",");
class o extends y {
  static sessionCache = new Map();
  static posterUrlCache = new Map();
  get baseUrl() {
    let e = this.config.address.trim();
    return (
      (e = e.replace(/\/+$/, "")),
      (e = e.replace(/\/(?:web|v)(?:\/.*)?$/i, "")),
      (e = e.replace(/\/(?:emby|jellyfin)(?:\/.*)?$/i, "")),
      e
    );
  }
  get apiBaseUrl() {
    return c(this.baseUrl, "/emby/");
  }
  get webBaseUrl() {
    return c(this.baseUrl, "/v");
  }
  get cacheKey() {
    return [this.baseUrl, this.config.auth.username].join("|");
  }
  get deviceId() {
    return `pt-depiler-${this.config.id ?? this.cacheKey}`.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 96);
  }
  getAuthorizationHeader(e) {
    return `Emby ${e ? `UserId="${e}", ` : ""}Client="PT-depiler", Device="Chrome", DeviceId="${this.deviceId}", Version="v0.0.6.1740+c969e7b"`;
  }
  get session() {
    const e = o.sessionCache.get(this.cacheKey);
    if (e) return e;
    if (this.config.auth.apikey && this.config.auth.userId)
      return {
        apikey: this.config.auth.apikey,
        userId: this.config.auth.userId,
        sessionId: this.config.auth.sessionId,
      };
  }
  setSession(e) {
    ((this.config.auth.apikey = e.apikey),
      (this.config.auth.userId = e.userId),
      (this.config.auth.sessionId = e.sessionId ?? ""),
      o.sessionCache.set(this.cacheKey, e));
  }
  async login(e = !1) {
    const s = this.session;
    if (!e && s) return s;
    const t = await p.request({
        baseURL: this.apiBaseUrl,
        url: "/Users/AuthenticateByName",
        method: "POST",
        timeout: this.config.timeout,
        responseType: "json",
        headers: { "Content-Type": "application/json", "X-Emby-Authorization": this.getAuthorizationHeader() },
        data: { Username: this.config.auth.username, Pw: this.config.auth.password },
      }),
      r = { apikey: t.data.AccessToken, userId: t.data.User.Id, sessionId: t.data.SessionInfo?.Id };
    return (this.setSession(r), r);
  }
  async request(e, s = {}, t = !1) {
    const r = await this.login();
    ((s.baseURL = this.apiBaseUrl),
      (s.url = e),
      (s.timeout ??= this.config.timeout),
      (s.responseType ??= "json"),
      (s.headers = {
        ...(s.headers ?? {}),
        "X-Emby-Token": r.apikey,
        "X-Emby-Authorization": this.getAuthorizationHeader(r.userId),
      }));
    try {
      return await p.request(s);
    } catch (a) {
      if (!t && a instanceof l && a.response?.status === 401)
        return (await this.login(!0), await this.request(e, s, !0));
      throw a;
    }
  }
  async ping() {
    try {
      const e = await this.request("/System/Info");
      if (e.status === 200 && e.data?.Id) return !0;
    } catch {
      return !1;
    }
    return !1;
  }
  async getViewIds() {
    const e = this.config.auth.parentId?.trim();
    if (e) return [e];
    const s = await this.login();
    return (
      (await this.request(`/Users/${s.userId}/Views`, { params: { IncludeExternalContent: !1 } })).data.Items?.map(
        (r) => r.Id,
      ).filter(Boolean) ?? []
    );
  }
  async queryItems(e, s, t, r) {
    const a = await this.login(),
      n = {
        params: {
          ParentId: e,
          Recursive: !0,
          StartIndex: r ? 0 : t.startIndex,
          Limit: r ? (t.startIndex ?? 0) + (t.limit ?? 50) : t.limit,
          Fields: g,
        },
      };
    s !== "" && ((n.params.SearchTerm = s), (n.params.IncludeItemTypes = "Movie,Series"));
    const u = I(n, this.config.defaultSearchExtraRequestConfig ?? {});
    return (await this.request(`/Users/${a.userId}/Items`, u)).data.Items ?? [];
  }
  async getPoster(e) {
    const s = e.ImageTags?.Primary;
    if (!s) return "";
    const t = [this.cacheKey, e.Id, s].join("|"),
      r = o.posterUrlCache.get(t);
    if (r) return r;
    try {
      const a = await this.request(`/Items/${e.Id}/Images/Primary`, { params: { tag: s }, responseType: "blob" }),
        n = URL.createObjectURL(a.data);
      return (this.setPosterCache(t, n), n);
    } catch {
      return "";
    }
  }
  setPosterCache(e, s) {
    if ((o.posterUrlCache.set(e, s), o.posterUrlCache.size <= 300)) return;
    const t = o.posterUrlCache.entries().next().value;
    t && (o.posterUrlCache.delete(t[0]), URL.revokeObjectURL(t[1]));
  }
  async buildMediaItem(e) {
    const s = e.Type || e.MediaType || "",
      t = e.MediaSources?.[0];
    return {
      server: this.config.id,
      name: e.Name,
      url: this.getItemUrl(e),
      type: s,
      description: e.Overview ?? "",
      format: e.Container ?? t?.Container ?? "",
      size: t?.Size ?? e.Size,
      duration: e.RunTimeTicks ? e.RunTimeTicks / 1e7 : void 0,
      poster: await this.getPoster(e),
      tags: e.GenreItems?.map((r) => ({ name: r.Name, url: "" })),
      rating: e.CommunityRating ?? "-",
      streams: t?.MediaStreams?.map((r) => ({
        title: r.Title || r.DisplayTitle || r.Codec || r.Type,
        type: r.Type,
        format: r.Codec ?? "",
      })),
      user: { IsFavorite: e.UserData?.IsFavorite ?? !1, IsPlayed: e.UserData?.Played ?? !1 },
      raw: e,
    };
  }
  getItemUrl(e) {
    if (e.Type === "Movie") {
      const s = e.ImageTags?.Primary ?? e.MediaSources?.[0]?.Id ?? e.Id;
      return c(this.webBaseUrl, `/movie/${s}`);
    }
    return e.Type === "Series" ? c(this.webBaseUrl, `/tv/${e.Id}`) : this.webBaseUrl;
  }
  async getSearchResult(e = "", s = {}) {
    const t = { status: d.unknownError, items: [] };
    ((s.startIndex = s.startIndex ?? 0), (s.limit = s.limit ?? 50));
    try {
      const r = await this.getViewIds(),
        a = r.length > 1,
        n = await Promise.all(r.map((i) => this.queryItems(i, e, s, a))),
        u = new Map();
      for (const i of n.flat()) (i.Type === "Movie" || i.Type === "Series") && !u.has(i.Id) && u.set(i.Id, i);
      const h = Array.from(u.values()),
        m = a ? h.slice(s.startIndex, s.startIndex + s.limit) : h;
      ((t.items = await Promise.all(m.map((i) => this.buildMediaItem(i)))), (t.options = s), (t.status = d.success));
    } catch (r) {
      r instanceof l && [400, 401, 403].includes(r.response?.status ?? 0)
        ? (t.status = d.needLogin)
        : (t.status = d.parseError);
    }
    return t;
  }
}
export { o as default, S as mediaServerConfig, P as mediaServerMetaData };
