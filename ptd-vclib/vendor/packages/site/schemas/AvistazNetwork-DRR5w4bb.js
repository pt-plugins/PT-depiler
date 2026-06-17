import { u as d } from "../../../url-join/url-join-Cu798wIg.js";
import { S as h, aB as u, k as f } from "../index-COeZNva1.js";
import w from "./AbstractPrivateSite-kkMcHSoo.js";
import { E as c, C as m, a as b } from "../types/base-Dy_28wGT.js";
import { E as g } from "../types/torrent-BvvY2NbA.js";
import { p as y } from "../utils/filesize-D_1hx4u8.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "./AbstractBittorrentSite-YCyl9e_L.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
function v(e) {
  return (
    !!e &&
    typeof e == "object" &&
    "token" in e &&
    typeof e.token == "string" &&
    e.token.trim().length > 0 &&
    "expiry" in e &&
    typeof e.expiry == "number" &&
    Number.isFinite(e.expiry) &&
    e.expiry > 0
  );
}
function k(e) {
  return !!e && typeof e == "object" && "message" in e && typeof e.message == "string";
}
const p = {
    subTitle: { text: "" },
    comments: { text: "N/A" },
    category: { selector: "i[data-original-title]", attr: "data-original-title" },
  },
  K = { 1: "Free-Download", 2: "Half-Download", 3: "Double Upload" },
  S = {
    urlPattern: ["/torrents"],
    mergeSearchSelectors: !1,
    selectors: {
      ...p,
      rows: { selector: "#content-area > div.block > div > table:nth-child(3) > tbody > tr" },
      id: {
        selector: "div.torrent-file a[href*='/torrent/']",
        attr: "href",
        filters: [
          (e) => {
            const t = e.match(/\/torrent\/(\d)/);
            if (t && t[1]) return t[1];
          },
        ],
      },
      title: { selector: "div.torrent-file a[href*='/torrent/']" },
      url: { selector: "div.torrent-file a[href*='/torrent/']", attr: "href" },
      link: { selector: "td:nth-child(3) a[href*='/download/torrent/']", attr: "href" },
      size: { selector: "td:nth-child(6)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:nth-child(7)" },
      leechers: { selector: "td:nth-child(8)" },
      completed: { selector: "td:nth-child(9)" },
    },
  },
  T = {
    urlPattern: ["/profile/(.+)/history"],
    mergeSearchSelectors: !1,
    selectors: {
      ...p,
      rows: { selector: "div.block > div.table-responsive > table > tbody > tr" },
      id: {
        selector: "a.torrent-filename",
        attr: "href",
        filters: [
          (e) => {
            const t = e.match(/\/torrent\/(\d+)/);
            return t ? t[1] : void 0;
          },
        ],
      },
      title: { selector: "a.torrent-filename", attr: "data-original-title" },
      category: { selector: "td:first-child i", attr: "data-original-title" },
      url: { selector: "a.torrent-filename", attr: "href" },
      link: { selector: "a.torrent-download-icon", attr: "href" },
      size: { selector: "span.badge-extra.fa-database", filters: [{ name: "parseSize" }] },
      seeders: { selector: "span.badge-extra.fa-arrow-up" },
      leechers: { selector: "span.badge-extra.fa-arrow-down" },
      completed: { selector: "span.badge-extra.fa-check" },
    },
  },
  Z = {
    version: 0,
    schema: "AvistazNetwork",
    type: "private",
    timezoneOffset: "-0400",
    search: {
      keywordPath: "params.search",
      requestConfig: { url: "/api/v1/jackett/torrents", responseType: "json", params: { in: 1, limit: 50 } },
      advanceKeywordParams: {
        imdb: {
          requestConfigTransformer: ({ requestConfig: e }) => (
            e?.params?.search && ((e.params.imdb = e.params.search), delete e.params.search),
            e
          ),
        },
        tvdb: {
          requestConfigTransformer: ({ requestConfig: e }) => (
            e?.params?.search && ((e.params.tvdb = e.params.search), delete e.params.search),
            e
          ),
        },
        tmdb: {
          requestConfigTransformer: ({ requestConfig: e }) => (
            e?.params?.search && ((e.params.tmdb = e.params.search), delete e.params.search),
            e
          ),
        },
      },
      selectors: {
        rows: { selector: "data" },
        id: { selector: "id" },
        title: { selector: "file_name" },
        subTitle: { text: "" },
        url: { selector: "url" },
        link: { selector: "download" },
        category: {
          selector: "category",
          filters: [
            (e) => {
              if (!e) return "";
              const t = Object.values(e);
              return t.length > 0 ? t[0] : "";
            },
          ],
        },
        time: { selector: "created_at", filters: [{ name: "parseTime" }] },
        size: { selector: "file_size" },
        author: { text: "" },
        seeders: { selector: "seed" },
        leechers: { selector: "leech" },
        completed: { selector: "completed" },
        comments: { text: "N/A" },
        progress: { text: 0 },
        status: { text: g.unknown },
        ext_imdb: { selector: "movie_tv.imdb", filters: [{ name: "extImdbId" }] },
      },
    },
    list: [S, T],
    detail: {
      urlPattern: ["/torrent/"],
      selectors: {
        id: {
          selector: ":self",
          elementProcess: (e) => {
            const t = e.URL,
              r = t.match(/\/detail\/(\d+)/);
            return r ? r[1] : t;
          },
        },
        title: { selector: "table.table tr:contains('Title') td:nth-child(2)" },
        link: { selector: "a.btn-primary[href$='.torrent']", attr: "href" },
      },
    },
    userInfo: {
      pickLast: ["name"],
      selectors: {
        name: { selector: ["span.user-group.group-member"] },
        levelName: { selector: ["body > header > div.ratio-bar.mb-1.pt-2.pl-2.pb-1 > div > div:nth-child(2)"] },
        uploaded: {
          selector: ["body > header > div.ratio-bar.mb-1.pt-2.pl-2.pb-1 > div > div:nth-child(3)"],
          filters: [{ name: "parseSize" }],
        },
        downloaded: {
          selector: ["body > header > div.ratio-bar.mb-1.pt-2.pl-2.pb-1 > div > div:nth-child(4)"],
          filters: [{ name: "parseSize" }],
        },
        ratio: {
          selector: ["body > header > div.ratio-bar.mb-1.pt-2.pl-2.pb-1 > div > div:nth-child(5)"],
          filters: [{ name: "parseNumber" }],
        },
        bonus: {
          selector: ["body > header > div.ratio-bar.mb-1.pt-2.pl-2.pb-1 > div > div:nth-child(9)"],
          filters: [{ name: "parseNumber" }],
        },
        joinTime: {
          selector: ["table.table-striped tr:contains('Joined') td:last-child"],
          filters: [{ name: "parseTime", args: ["dd MMMM yyyy hh:mm a"] }],
        },
        uploads: { selector: [".card .tag-green"], filters: [{ name: "parseNumber" }] },
        snatches: { selector: [".card .tag-yellow"], filters: [{ name: "parseNumber" }] },
        seeding: { selector: [".card .tag-indigo"], filters: [{ name: "parseNumber" }] },
        hnrUnsatisfied: { selector: [".card .tag-red"], filters: [{ name: "parseNumber" }] },
      },
    },
    userInputSettingMeta: [
      {
        name: "username",
        label: "Username",
        hint: "Fill with your username.Please Make Sure your RANK >= Member",
        required: !0,
      },
      {
        name: "password",
        label: "Password",
        hint: "Fill with your passwordPlease confirm enable ‘Enable RSS Feed’ in account settings",
        required: !0,
      },
      {
        name: "pid",
        label: "PID",
        hint: "Find in Profile Site, reset in Account Setting Site if you want to reset.PID is like your password, you must keep it safe!",
        required: !0,
      },
    ],
  };
class G extends w {
  async getUserInfoResult(t = {}) {
    let r = { status: c.unknownError, updateAt: +new Date(), site: this.metadata.id };
    return (
      (r = {
        ...r,
        status: c.passParse,
        name: this.userConfig.inputSetting?.username,
        levelName: "应站点要求，不启用用户数据获取",
      }),
      r
    );
  }
  async getBaseInfoFromSite() {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: t } = await this.request({ url: "/", responseType: "document" });
    return this.getFieldsData(t, this.metadata.userInfo?.selectors, [
      "name",
      "levelName",
      "uploaded",
      "downloaded",
      "ratio",
      "bonus",
    ]);
  }
  async getExtendInfoFromProfile(t) {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: r } = await this.request({ url: d("/profile", t), responseType: "document" });
    return this.getFieldsData(r, this.metadata.userInfo?.selectors, [
      "joinTime",
      "uploads",
      "snatches",
      "seeding",
      "hnrUnsatisfied",
    ]);
  }
  async getUserSeedingTorrents(t) {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const r = { seedingSize: 0 },
      { data: o } = await this.request({ url: d("/profile", t) + "/active", responseType: "document" });
    return (
      h("table .text-yellow", o).forEach((a) => {
        r.seedingSize += y(a.innerText.trim());
      }),
      r
    );
  }
  async request(t, r = !0) {
    const o = t.url === "/api/v1/jackett/auth",
      i = t.url?.startsWith("/api/v1/jackett/torrents");
    if (
      (o &&
        ((t.method = "POST"),
        (t.data = {
          ...t.data,
          username: this.userConfig.inputSetting?.username ?? "",
          password: this.userConfig.inputSetting?.password ?? "",
          pid: this.userConfig.inputSetting?.pid ?? "",
        }),
        (t.headers = { ...(t.headers ?? {}), "Content-Type": "application/x-www-form-urlencoded" })),
      i)
    ) {
      t.method = "GET";
      const n = await this.getAuthToken();
      t.headers = { ...(t.headers ?? {}), Authorization: `Bearer ${n}` };
    }
    if (!o && !i) return super.request(t, r);
    ((t.baseURL ??= this.url),
      (t.timeout ??= this.userConfig.timeout ?? 3e4),
      await this.sleepAction(this.metadata.requestDelay ?? 0));
    const a = async () => {
      try {
        return await f.request(t);
      } catch (n) {
        const l = n.response;
        if (!l) throw n;
        return l;
      }
    };
    let s = await a();
    if (u(s)) throw new m();
    if (
      i &&
      [401, 403].includes(s.status) &&
      (await this.storeRuntimeSettings("authToken", ""),
      await this.storeRuntimeSettings("authExpiry", 0),
      (t.headers = { ...(t.headers ?? {}), Authorization: `Bearer ${await this.getAuthToken()}` }),
      (s = await a()),
      u(s))
    )
      throw new m();
    if (s.status >= 400)
      throw i && [400, 404, 422].includes(s.status)
        ? new b()
        : Error(`Network Error: ${s.status} ${s.statusText || ""}`.trim());
    return s;
  }
  async getAuthToken(t = {}) {
    const r = Math.floor(Date.now() / 1e3),
      o = await this.retrieveRuntimeSettings("authToken"),
      i = await this.retrieveRuntimeSettings("authExpiry");
    if (typeof o == "string" && o.trim().length > 0 && typeof i == "number" && Number.isFinite(i) && i > r)
      return (console.log("Found valid token in runtimeSettings. Returning existing token."), o.trim());
    console.log("Token expired or not found. Requesting new token...");
    try {
      const { data: a } = await this.request({ url: "/api/v1/jackett/auth", responseType: "json" });
      if (v(a)) {
        const s = r + a.expiry,
          n = a.token.trim();
        return (
          await this.storeRuntimeSettings("authToken", n),
          await this.storeRuntimeSettings("authExpiry", s),
          console.log("Successfully obtained and stored new token."),
          n
        );
      } else if (k(a)) {
        const s = a.message.trim() || "Authorization failed";
        throw (console.error(`Failed to get new token: ${s}`), new Error(`AvistaZ authorization failed: ${s}`));
      } else
        throw (
          console.error("Failed to get new token: Unexpected response format or missing required properties."),
          new Error("AvistaZ authorization failed: Unexpected response format or missing required properties.")
        );
    } catch (a) {
      throw new Error(`Error during authorization request: ${a.message}`);
    }
  }
  parseTorrentRowForTags(t, r, o) {
    const i = [],
      { upload_multiply: a, download_multiply: s } = r;
    switch ((a === 2 && i.push({ name: `${a}xUp`, color: "lime" }), s)) {
      case 0:
        i.push({ name: "Free", color: "blue" });
        break;
      case 0.5:
        i.push({ name: "50%", color: "deep-orange-darken-1" });
        break;
    }
    return ((t.tags = i), t);
  }
}
export {
  Z as SchemaMetadata,
  K as avzNetDiscountMap,
  G as default,
  T as listHistoryPageMetadata,
  S as listTorrentPageMetadata,
};
