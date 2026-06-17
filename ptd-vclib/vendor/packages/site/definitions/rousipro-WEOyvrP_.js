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
const r = /\/torrent\/([0-9a-z-]+)\/?/,
  q = {
    version: 1,
    id: "rousipro",
    name: "Rousi Pro",
    aka: ["Rousi", "肉丝"],
    type: "private",
    schema: "Rousi",
    urls: ["uggcf://ebhfv.ceb/"],
    favicon: "./rousipro.ico",
    category: [
      {
        name: "分类",
        key: "category",
        options: [
          { name: "电影", value: "movie" },
          { name: "电视剧", value: "tv" },
          { name: "纪录片", value: "documentary" },
          { name: "动漫", value: "animation" },
          { name: "音乐", value: "music" },
          { name: "综艺", value: "variety" },
          { name: "9KG", value: "9kg" },
          { name: "体育", value: "sports" },
          { name: "软件", value: "software" },
          { name: "电子书", value: "ebook" },
          { name: "其它", value: "other" },
        ],
      },
    ],
    search: {
      requestConfig: { url: "/api/v1/search", params: { page_size: 100 } },
      keywordPath: "params.keyword",
      advanceKeywordParams: { imdb: !1, douban: !1 },
      selectors: {
        rows: { selector: "data.torrents" },
        id: { selector: "uuid" },
        title: { selector: "title" },
        subTitle: { selector: "subtitle" },
        url: { selector: "uuid", filters: [{ name: "prepend", args: ["/torrent/"] }] },
        time: { selector: "created_at", filters: [{ name: "parseTime" }] },
        size: { selector: "size" },
        author: { selector: "uploader" },
        seeders: { selector: "seeders" },
        leechers: { selector: "leechers" },
        completed: { selector: "downloads" },
        category: { selector: "category_name" },
      },
    },
    list: [
      {
        urlPattern: ["/categories", "/search"],
        mergeSearchSelectors: !1,
        selectors: {
          keywords: { selector: "input[placeholder*='搜索种子']" },
          rows: { selector: 'div.border > a[href^="/torrent/"]' },
          id: { selector: ":self", attr: "href", filters: [{ name: "replace", args: ["/torrent/", ""] }] },
          title: { selector: "span.truncate[title]", attr: "title" },
          subTitle: { selector: "span.text-muted-foreground.truncate" },
          url: { selector: ":self", attr: "href" },
          time: {
            selector: "div:nth-child(6)[title]",
            attr: "title",
            filters: [{ name: "parseTime", args: ["yyyy/MM/dd HH:mm:ss"] }],
          },
          size: { selector: "div:nth-child(4)", filters: [{ name: "parseSize" }] },
          seeders: { selector: "div:nth-child(5)", filters: [{ name: "split", args: ["/", 0] }] },
          leechers: { selector: "div:nth-child(5)", filters: [{ name: "split", args: ["/", 1] }] },
          completed: { selector: "div:nth-child(5)", filters: [{ name: "split", args: ["/", 2] }] },
          category: { selector: "div:nth-child(3)" },
        },
      },
    ],
    detail: {
      urlPattern: ["/torrent/"],
      selectors: {
        id: {
          selector: ":self",
          elementProcess: (s) => {
            const e = s.URL,
              t = e.match(r);
            return t ? t[1] : e;
          },
        },
        title: { selector: "h1" },
        link: { text: "" },
      },
    },
    userInfo: {
      process: [
        {
          requestConfig: { url: "/api/v1/profile", params: { "include_fields[user]": "seeding_leeching_data" } },
          selectors: {
            id: { selector: "data.id" },
            name: { selector: "data.username" },
            levelId: { selector: "data.level" },
            levelName: { selector: "data.level_text" },
            joinTime: { selector: "data.registered_at", filters: [{ name: "parseTime" }] },
            lastAccessAt: { selector: "data.last_active_at", filters: [{ name: "parseTime" }] },
            messageCount: { text: 0 },
            downloaded: { selector: "data.downloaded" },
            uploaded: { selector: "data.uploaded" },
            ratio: { selector: "data.ratio" },
            seeding: { selector: "data.seeding_leeching_data.seeding_count" },
            seedingSize: { selector: "data.seeding_leeching_data.seeding_size" },
            seedingTime: { selector: "data.seeding_time" },
            bonus: { selector: "data.karma" },
          },
        },
        {
          requestConfig: { url: "/api/v1/seeding-reward" },
          selectors: { bonusPerHour: { selector: "data.total_reward" } },
        },
      ],
    },
    userInputSettingMeta: [
      { name: "passkey", label: "Passkey", hint: "用户的Passkey，可以在 账户设置-Passkey 中复制", required: !0 },
    ],
  },
  l = { 1: "", 2: "Free", 3: "2xUp", 4: "2xFree", 5: "50%", 6: "2x50%", 7: "30%" };
class M extends o {
  get userPasskey() {
    return this.userConfig.inputSetting.passkey ?? "";
  }
  async request(e, t = !0) {
    return (
      (e.responseType = "json"),
      (e.headers = { ...(e.headers ?? {}), Authorization: `Bearer ${this.userPasskey}` }),
      super.request(e, t)
    );
  }
  parseTorrentRowForTags(e, t, i) {
    if (((e = super.parseTorrentRowForTags(e, t, i)), t.promotion?.is_active)) {
      let a = l[t.promotion.type] ?? "";
      a && ((e.tags = e.tags || []), e.tags.push({ name: a }));
    }
    return e;
  }
  async getTorrentDownloadLink(e) {
    if (!e.id && (e.url || e.link)) {
      let t;
      (e.url?.includes("/torrent/") ? (t = e.url.match(r)) : e.link?.includes("/torrent/") && (t = e.link.match(r)),
        t && (e.id = t[1]));
    }
    return `${this.url}api/torrent/${e.id}/download/${this.userPasskey}`;
  }
}
export { M as default, q as siteMetadata };
