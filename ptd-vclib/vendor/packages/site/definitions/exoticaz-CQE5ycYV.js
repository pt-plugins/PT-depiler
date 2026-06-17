import g, { SchemaMetadata as n, avzNetDiscountMap as v } from "../schemas/AvistazNetwork-DRR5w4bb.js";
import "../../../url-join/url-join-Cu798wIg.js";
import "../index-COeZNva1.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
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
const f = {
    1: "Video Clips",
    2: "Video Pack",
    3: "Siterip Pack",
    4: "Pornstar Pack",
    5: "DVD",
    6: "BluRay",
    7: "Photo Pack",
    8: "Books & Magazines",
  },
  h = { 1: "240p", 2: "360p", 3: "480p", 4: "720p", 5: "1080p", 6: "2160p", 7: "4320p", 8: "VR 180°", 9: "VR 360°" },
  F = {
    ...n,
    version: 1,
    id: "exoticaz",
    name: "ExoticaZ",
    aka: ["Exo", "YourExotic"],
    description: "ExoticaZ (YourExotic) is a Private Torrent Tracker of AvistaZ Network for porn",
    tags: ["成人"],
    timezoneOffset: "+0100",
    type: "private",
    schema: "AvistazNetwork",
    urls: ["uggcf://rkbgvpnm.gb/"],
    legacyUrls: ["https://torrents.yourexotic.com/"],
    collaborator: [""],
    category: [
      {
        name: "搜索入口",
        key: "entry",
        notes: "请选中成人以开启搜索",
        options: [{ name: "成人", value: "adult" }],
        cross: !1,
        generateRequestConfig: (t) => ({ params: {} }),
      },
      {
        name: "分类",
        key: "category",
        keyPath: "params",
        options: Object.entries(f).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "分辨率",
        key: "res",
        keyPath: "params",
        options: Object.entries(h).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "促销",
        key: "discount",
        keyPath: "params",
        options: Object.entries(v).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "类型",
        key: "type",
        keyPath: "params",
        options: [
          { name: "Popular", value: "popular" },
          { name: "Asian", value: "asian" },
          { name: "Non-asian", value: "non_asian" },
          { name: "Softcore", value: "softcore" },
          { name: "Uncensored", value: "uncensored" },
          { name: "Censored", value: "censored" },
          { name: "Transexual", value: "transexual" },
        ],
        cross: { mode: "append", key: "" },
      },
    ],
    search: {
      ...n.search,
      advanceKeywordParams: { imdb: { enabled: !1 }, tvdb: { enabled: !1 }, tmdb: { enabled: !1 } },
    },
    searchEntry: { area_adult: { name: "成人", enabled: !1 } },
    list: [
      {
        urlPattern: ["/torrents"],
        mergeSearchSelectors: !1,
        selectors: {
          rows: {
            selector: "#content-area > div.card.mt-2 > div.card-body.p-2 > div.table-responsive > table > tbody > tr",
          },
          id: {
            selector: "div.mb-1 a[href*='/torrent/']",
            attr: "href",
            filters: [
              (t) => {
                const e = t.match(/\/torrent\/(\d+)/);
                if (e && e[1]) return e[1];
              },
            ],
          },
          title: { selector: "div.mb-1 a[href*='/torrent/']" },
          category: { selector: ".category-icon[data-original-title]", attr: "data-original-title" },
          url: { selector: "div.mb-1 a[href*='/torrent/']", attr: "href" },
          link: { selector: "div.align-top a[href*='/download/torrent/']", attr: "href" },
          size: { selector: "td:nth-child(5)", filters: [{ name: "parseSize" }] },
          seeders: { selector: "td:nth-child(6)" },
          leechers: { selector: "td:nth-child(7)" },
          completed: { selector: "td:nth-child(8)" },
        },
      },
      {
        urlPattern: ["/profile/(.+)/history"],
        mergeSearchSelectors: !1,
        selectors: {
          subTitle: { text: "" },
          comments: { text: "N/A" },
          rows: { selector: "div.card-body.p-2 > div.table-responsive > table > tbody > tr" },
          id: {
            selector: "div.mb-1 a[href*='/torrent/']",
            attr: "href",
            filters: [
              (t) => {
                const e = t.match(/\/torrent\/(\d+)/);
                if (e && e[1]) return e[1];
              },
            ],
          },
          title: { selector: "div.mb-1 a[href*='/torrent/']", attr: "title" },
          category: { selector: "i.category-icon", attr: "data-original-title" },
          url: { selector: "div.mb-1 a[href*='/torrent/']", attr: "href" },
          link: { selector: "div.float-right a[href*='/download/torrent/']", attr: "href" },
          size: { selector: "div.d-block span.text-yellow", filters: [{ name: "parseSize" }] },
          seeders: { selector: "div.d-block span.text-green.mr-2" },
          leechers: { selector: "div.d-block span.text-red.mr-2" },
          completed: { selector: "div.d-block span.text-blue.mr-2" },
        },
      },
    ],
    detail: {
      urlPattern: ["/torrent/"],
      selectors: {
        ...n.detail.selectors,
        title: {
          selector: "table.table tr:contains('Title') td:nth-child(2)",
          elementProcess: (t) => {
            const e = t.textContent.trim(),
              r = e.match(/\[([^\]]+)\]/);
            return r ? r[1] : e;
          },
        },
      },
    },
    levelRequirements: [
      {
        id: 1,
        name: "Leech",
        privilege: "Can download 1 torrent a day. Limited to download torrents uploaded 1 week ago. Cannot upload.",
      },
      { id: 2, name: "Newbie", privilege: "Can download 5 torrents a day. Cannot upload. Cannot use RSS." },
      {
        id: 3,
        name: "Member",
        alternative: [{ ratio: 1 }, { interval: "P1W" }],
        privilege: "Can download 100 torrents a day. Can upload. Can use RSS (must enable it in My Account settings).",
      },
      { id: 100, name: "V.I.P.", groupType: "vip", privilege: "Can download 200 torrents a day. Can upload." },
      { id: 200, name: "Uploader", groupType: "manager", privilege: "Can upload." },
      { id: 201, name: "Editor", groupType: "manager", privilege: "Can upload." },
      { id: 203, name: "Moderator", groupType: "manager" },
      { id: 204, name: "Admin", groupType: "manager" },
      { id: 205, name: "Super Admin", groupType: "manager" },
    ],
    userInputSettingMeta: [...n.userInputSettingMeta],
  };
class L extends g {
  parseTorrentRowForTags(e, r, d) {
    const o = super.parseTorrentRowForTags(e, r, d),
      s = o.tags || [],
      i = r.performers,
      m = (i ? Object.values(i) : []).join(" / "),
      l = r.tags,
      p = (l ? Object.values(l) : []).map((a) => `#${a}`).join(" "),
      u = [m, p].filter(Boolean).join(" | ");
    o.subTitle = u;
    const c = {
      asian: { name: "亚洲" },
      softcore: { name: "擦边" },
      censored: { name: "有码" },
      gay: { name: "gay" },
      transexual: { name: "trans" },
    };
    for (const a of Object.keys(c)) a in r && r[a] === !0 && s.push(c[a]);
    return ((o.tags = s), o);
  }
}
export { L as default, F as siteMetadata };
