import { A as c } from "../types-DXvgLac7.js";
import { j as I } from "../../site/index-COeZNva1.js";
import { u as d } from "../../../url-join/url-join-Cu798wIg.js";
import { t as h } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { E as m } from "../../site/types/base-Dy_28wGT.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
const x = {
    description: "Emby 是一款家庭媒体库管理软件，能整理服务器上的音视频并流式传输到客户端设备，提供良好的影音体验",
    warning: [
      'apikey, userId 可通过在console面板中执行 var c = JSON.parse(localStorage.getItem("servercredentials3")).Servers[0]; c.Users.filter(u => u.UserId == c.UserId)[0] 来获取',
      "apikey 也可以在 `API 密钥` 中设置，或网络请求等其他地方中获取， userId 也可以在 url 等其他地方获取。（ 请参见 Wiki ）",
    ],
    auth_field: ["apikey", { name: "userId", required: !1, message: "可以额外获取用户喜欢、观看情况" }],
  },
  E = { type: "emby", name: "Emby", address: "", auth: { apikey: "", userId: "" }, timeout: 5e3 };
class w extends c {
  get apiBaseUrl() {
    let e = this.config.address;
    return (e.includes("/emby/") || ((e = e.replace(/\/web\/index.html#.+/, "")), (e = d(e, "/emby/"))), e);
  }
  get webBaseUrl() {
    let e = this.config.address;
    return ((e = e.replace(/\/web\/index.html#.+/, "")), d(e, "/web/index.html"));
  }
  async request(e, t = {}) {
    return (
      (t.baseURL = this.apiBaseUrl),
      (t.timeout ??= this.config.timeout),
      (t.headers = { ...(t.headers ?? {}), "X-Emby-Token": this.config.auth.apikey }),
      (t.url = e),
      I.request(t)
    );
  }
  async ping() {
    try {
      const e = await this.request("/System/Info", { responseType: "json" });
      if (e.status === 200 && e.data?.Id) return !0;
    } catch {
      return !1;
    }
    return !1;
  }
  async getSearchResult(e = "", t = {}) {
    const i = { status: m.unknownError, items: [] };
    let u = "/Items";
    const o = this.config.auth.userId && this.config.auth.userId != "";
    o && (u = `/Users/${this.config.auth.userId}/Items`);
    let r = { params: {} };
    (e != ""
      ? e.startsWith("imdb|")
        ? (r.params.AnyProviderIdEquals = "imdb." + e.split("|")[1])
        : (r.params.SearchTerm = e)
      : (r.params.SortBy = (o ? "IsFavoriteOrLiked," : "") + "Random"),
      (r.params.IncludeItemTypes = "Movie,Series"),
      (r.params.Recursive = !0),
      (t.startIndex = r.params.startIndex = t.startIndex ?? 0),
      (t.limit = r.params.Limit = t.limit ?? 50),
      (r.params.Fields =
        "BasicSyncInfo,Path,Status,ExternalUrls,CommunityRating,MediaSources,DisplayPreferences,Genres,DateCreated,Overview,ExtraIds"),
      (r = h(r, this.config.defaultSearchExtraRequestConfig ?? {})));
    try {
      const n = await this.request(u, r);
      if (n.status === 200) {
        const {
          data: { Items: l = [] },
        } = n;
        for (const s of l) {
          const p = {
            server: this.config.id,
            name: s.Name,
            url: this.webBaseUrl + `#!/item?id=${s.Id}&serverId=${s.ServerId}`,
            type: s.MediaType,
            description: s.Overview ?? "",
            format: s.Container,
            size: s.Size,
            duration: s.RunTimeTicks / 1e7,
            poster: d(this.apiBaseUrl, `/Items/${s.Id}/Images/Primary`),
            tags: s.GenreItems?.map((a) => ({
              name: a.Name,
              url: this.webBaseUrl + `#!/list/list.html?genreId=${a.Id}&serverId=${s.ServerId}`,
            })),
            rating: s.CommunityRating ?? "-",
            streams: s.MediaSources?.[0]?.MediaStreams?.map((a) => ({
              title: a.Title ?? a.DisplayTitle,
              type: a.Type,
              format: a.Codec,
            })),
            user: { IsFavorite: s.UserData?.IsFavorite ?? !1, IsPlayed: s.UserData?.Played ?? !1 },
            raw: s,
          };
          i.items.push(p);
        }
        ((i.options = t), (i.status = m.success));
      } else i.status = m.needLogin;
    } catch {
      i.status = m.parseError;
    }
    return i;
  }
}
export { w as default, E as mediaServerConfig, x as mediaServerMetaData };
