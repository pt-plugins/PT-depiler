import o from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const r = { 1: "Movies", 2: "TV", 3: "Music", 4: "Games", 5: "Ebook", 6: "Apps", 7: "Adult" },
  S = {
    id: "milkie",
    version: 1,
    name: "Milkie",
    aka: ["ME", "奶昔"],
    description: "Milkie.cc (ME) is Private Torrent Tracker for 0DAY / GENERAL",
    tags: ["综合"],
    timezoneOffset: "+0200",
    type: "private",
    schema: "AbstractPrivateSite",
    urls: ["https://milkie.cc/"],
    category: [
      {
        name: "类别",
        key: "categories",
        options: Object.entries(r).map(([t, e]) => ({ name: e, value: t })),
        cross: { mode: "comma" },
      },
    ],
    search: {
      keywordPath: "params.query",
      requestConfig: { url: "/api/v1/torrents", params: { ps: 50 } },
      advanceKeywordParams: { imdb: !1 },
      selectors: {
        rows: { selector: "torrents" },
        id: { selector: "id" },
        title: { selector: "releaseName" },
        url: { selector: "id", filters: [{ name: "prepend", args: ["/browse/"] }] },
        category: { selector: "category", filters: [(t) => r[t]] },
        time: { selector: "createdAt", filters: [{ name: "split", args: ["+", 0] }] },
        size: { selector: "size" },
        leechers: { selector: "leechers" },
        seeders: { selector: "seeders" },
        completed: { selector: "downloaded" },
        ext_imdb: { selector: "externals.imdb" },
      },
    },
    list: [
      {
        urlPattern: [/\/browse(\?.*)?$/],
        mergeSearchSelectors: !1,
        selectors: {
          rows: { selector: "tor-browse-list > div > tor-torrent-release" },
          id: { selector: "a.mat-caption", attr: "href", filters: [{ name: "split", args: ["/", 2] }] },
          title: { selector: "a.mat-caption", attr: "title" },
          url: { selector: "a.mat-caption", attr: "href" },
          link: { selector: "a.mat-icon-button", attr: "href" },
          time: { selector: "span.date", attr: "title", filters: [{ name: "parseTime" }] },
          size: { selector: "div.size > span" },
          completed: { selector: "div.nos > span:nth-child(1)" },
          seeders: { selector: "div.nos > span:nth-child(2)" },
          leechers: { selector: "div.nos > span:nth-child(3)" },
        },
      },
    ],
    detail: {
      urlPattern: ["/browse/"],
      selectors: {
        title: { selector: "tor-details-page h1" },
        link: { selector: "tor-torrent-details a.download", attr: "href" },
      },
    },
    userInfo: {
      pickLast: ["name", "joinTime"],
      process: [
        {
          requestConfig: { url: "/api/v1/auth" },
          selectors: {
            name: { selector: "user.displayName" },
            uploaded: { selector: "user.uploaded" },
            downloaded: { selector: "user.downloaded" },
            joinTime: { selector: "user.createdAt", filters: [{ name: "parseTime" }] },
            levelName: { text: "Early bird" },
          },
        },
      ],
    },
    userInputSettingMeta: [
      { name: "token", label: "Token", hint: "在 https://milkie.cc/settings/security 获取 API key", required: !0 },
    ],
  };
class q extends o {
  async request(e, s = !0) {
    return (
      (e.responseType = "json"),
      (e.headers = { ...(e.headers ?? {}), "x-milkie-auth": this.userConfig.inputSetting.token ?? "" }),
      super.request(e, s)
    );
  }
  parseTorrentRowForLink(e) {
    return (
      (e.link = `/api/v1/torrents/${e.id}/torrent?key=${encodeURIComponent(this.userConfig.inputSetting.token)}`),
      e
    );
  }
}
export { q as default, S as siteMetadata };
