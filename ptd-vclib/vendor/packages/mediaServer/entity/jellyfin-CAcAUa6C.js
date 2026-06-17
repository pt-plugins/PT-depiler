import "../index-Cmj48V-l.js";
import { j as c } from "../../site/index-COeZNva1.js";
import { t as I } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { u } from "../../../url-join/url-join-Cu798wIg.js";
import { A as h } from "../types-DXvgLac7.js";
import { E as o } from "../../site/types/base-Dy_28wGT.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
const b = {
    description: "Jellyfin 是一个由志愿者开发的开源媒体系统，可让用户自由管理和流式传输个人媒体内容，支持多平台多语言",
    warning: [
      'apikey, userId 可通过在console面板中执行 var c = JSON.parse(localStorage.getItem("jellyfin_credentials")).Servers[0]; console.log({AccessToken: c.AccessToken, UserId: c.UserId}); 来获取',
      "apikey 也可以在 `API 密钥` 中设置，或网络请求等其他地方中获取， userId 也可以在 url 等其他地方获取。（ 请参见 Wiki ）",
    ],
    auth_field: ["apikey", { name: "userId", required: !1, message: "可以额外获取用户喜欢、观看情况" }],
  },
  w = { type: "jellyfin", name: "Jellyfin", address: "", auth: { apikey: "", userId: "" }, timeout: 5e3 };
class M extends h {
  get baseUrl() {
    let s = this.config.address;
    return ((s = s.replace(/web\/(#\/home.html.+)?/, "")), s);
  }
  async request(s, r = {}) {
    return (
      (r.baseURL = this.baseUrl),
      (r.timeout ??= this.config.timeout),
      (r.headers = { ...(r.headers ?? {}), Authorization: `MediaBrowser Token="${this.config.auth.apikey}"` }),
      (r.url = s),
      c.request(r)
    );
  }
  async ping() {
    try {
      const s = await this.request("/System/Info", { responseType: "json" });
      if (s.status === 200 && s.data?.Id) return !0;
    } catch {
      return !1;
    }
    return !1;
  }
  async getSearchResult(s = "", r = {}) {
    const i = { status: o.unknownError, items: [] },
      d = this.config.auth.userId && this.config.auth.userId != "";
    let l = "/Items",
      t = { params: {} };
    (d && (t.params.userId = this.config.auth.userId),
      s != "" ? (t.params.searchTerm = s) : (t.params.sortBy = (d ? "IsFavoriteOrLiked," : "") + "Random"),
      (t.params.includeItemTypes = "Movie,Series"),
      (t.params.recursive = !0),
      (r.startIndex = t.params.startIndex = r.startIndex ?? 0),
      (r.limit = t.params.limit = r.limit ?? 50),
      (t.params.fields =
        "Path,Status,ExternalUrls,CommunityRating,MediaSources,DisplayPreferences,Genres,DateCreated,Overview,ExtraIds"),
      (t = I(t, this.config.defaultSearchExtraRequestConfig ?? {})));
    try {
      const n = await this.request(l, t);
      if (n.status === 200) {
        const {
          data: { Items: m = [] },
        } = n;
        for (const e of m) {
          const p = {
            server: this.config.id,
            name: e.Name,
            url: u(this.baseUrl, `/web/#/details?id=${e.Id}&serverId=${e.ServerId}`),
            type: e.MediaType,
            description: e.Overview ?? "",
            format: e.Container,
            size: e.MediaSources?.[0]?.Size,
            duration: e.RunTimeTicks / 1e7,
            poster: u(this.baseUrl, `/Items/${e.Id}/Images/Primary`),
            tags: e.GenreItems?.map((a) => ({
              name: a.Name,
              url: u(this.baseUrl, `/web/#/list.html?genreId=${a.Id}&serverId=${e.ServerId}`),
            })),
            rating: e.CommunityRating ?? "-",
            streams: e.MediaSources?.[0]?.MediaStreams?.map((a) => ({
              title: a.Title ?? a.DisplayTitle,
              type: a.Type,
              format: a.Codec,
            })),
            user: { IsFavorite: e.UserData?.IsFavorite ?? !1, IsPlayed: e.UserData?.Played ?? !1 },
            raw: e,
          };
          i.items.push(p);
        }
        ((i.options = r), (i.status = o.success));
      } else i.status = o.needLogin;
    } catch {
      i.status = o.parseError;
    }
    return i;
  }
}
export { M as default, w as mediaServerConfig, b as mediaServerMetaData };
