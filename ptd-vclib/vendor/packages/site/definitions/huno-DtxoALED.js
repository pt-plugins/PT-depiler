import { E as v } from "../types/torrent-BvvY2NbA.js";
import q, { SchemaMetadata as c } from "../schemas/Unit3D-ChxolkI5.js";
import { a7 as S, bD as k } from "../index-COeZNva1.js";
import "../../../url-join/url-join-Cu798wIg.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
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
const A = { 1: "Movie", 2: "TV" },
  E = { 1: "DISC", 2: "REMUX", 3: "WEB", 15: "ENCODE" },
  M = {
    1: "4320p",
    2: "2160p",
    3: "1080p",
    4: "1080i",
    5: "720p",
    6: "576p",
    7: "576i",
    11: "540p",
    8: "480p",
    9: "480i",
    10: "Other",
  };
function o(e, t, s = "") {
  for (const a of t) {
    const i = S(e, a);
    if (i && typeof i != "object") return i;
  }
  return s;
}
function x(e) {
  return [
    o(e, ["release_year", "attributes.release_year"]),
    o(e, ["resolution.name", "resolution", "attributes.resolution.name", "attributes.resolution"]),
    o(e, ["type.name", "type", "attributes.type.name", "attributes.type"]),
    o(e, ["video_codec.name", "video_codec", "attributes.video_codec.name", "attributes.video_codec"]),
    o(e, ["source_type.name", "source_type", "attributes.source_type.name", "attributes.source_type"]),
  ]
    .filter(Boolean)
    .map(String)
    .join(" / ");
}
function l(e, t) {
  return t
    .map((a) => S(e, a))
    .filter((a) => a != null)
    .flatMap((a) =>
      Array.isArray(a)
        ? a.map((i) => (typeof i == "object" ? JSON.stringify(i) : String(i)))
        : typeof a == "object"
          ? JSON.stringify(a)
          : String(a),
    )
    .join(" ");
}
function h(e, t = "") {
  return e == null
    ? []
    : Array.isArray(e)
      ? e.flatMap((s, a) => h(s, `${t}.${a}`))
      : typeof e == "object"
        ? Object.entries(e).flatMap(([s, a]) => h(a, t ? `${t}.${s}` : s))
        : [{ path: t, value: String(e) }];
}
function D(e) {
  const t = e.trim().toLowerCase();
  return !t || ["false", "0", "no", "none", "null", "undefined", "n/a"].includes(t)
    ? !1
    : /^(true|1|yes|free|freeleech|100|100\.0|100%)$/.test(t) || /100%\s*free|freeleech/.test(t);
}
const ae = {
  ...c,
  version: 2,
  id: "huno",
  name: "HUNO",
  description: "HAWKE-UNO IS A HAWKE-ONE SERVICE POWERED BY UNIT3D.",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",
  type: "private",
  schema: "Unit3D",
  urls: ["uggcf://unjxr.hab/"],
  legacyUrls: ["uggcf://unjxr.habm/"],
  collaborator: ["fzlins", "hui-shao"],
  userInputSettingMeta: [
    {
      name: "token",
      label: "Token",
      hint: "在 /users/用户名/hub/settings/security 获取 API Token 并填入此处",
      required: !0,
    },
  ],
  category: [
    {
      name: "分类",
      key: "categories",
      keyPath: "params",
      options: Object.entries(A).map(([e, t]) => ({ name: t, value: Number(e) })),
      cross: { mode: "brackets" },
    },
    {
      name: "编码",
      key: "types",
      keyPath: "params",
      options: Object.entries(E).map(([e, t]) => ({ name: t, value: Number(e) })),
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutions",
      keyPath: "params",
      options: Object.entries(M).map(([e, t]) => ({ name: t, value: Number(e) })),
      cross: { mode: "brackets" },
    },
    {
      name: "促销状态",
      key: "free",
      keyPath: "params",
      options: [
        { name: "免费", value: 1 },
        { name: "非免费", value: 2 },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (e) => {
        const t = { requestConfig: { params: {} } };
        return (
          e.forEach((s) => {
            s == 1 ? k(t.requestConfig.params, "free", !0) : s == 2 && k(t.requestConfig.params, "notFree", !0);
          }),
          t
        );
      },
    },
  ],
  search: {
    ...c.search,
    keywordPath: "params.name",
    requestConfig: { url: "/api/torrents/filter", responseType: "json", params: { perPage: 100 } },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: e }) => (
          e?.params?.name && ((e.params.imdbId = e.params.name), delete e.params.name),
          e
        ),
      },
    },
    skipNonLatinCharacters: !0,
    selectors: {
      rows: { selector: ["data.data", "data", "torrents.data", "torrents"] },
      id: { selector: ["id", "attributes.id"] },
      title: { selector: ["name", "attributes.name"] },
      subTitle: { selector: ":self", filters: [x] },
      url: { selector: ":self", filters: [(e) => `/torrents/${o(e, ["id", "attributes.id"])}`] },
      link: { selector: ["download_link", "attributes.download_link"] },
      category: { selector: ":self", filters: [(e) => o(e, ["category.name", "attributes.category.name"], "All")] },
      size: { selector: ["size", "attributes.size"] },
      time: { selector: ["created_at", "attributes.created_at", "bumped_at", "attributes.bumped_at"] },
      author: {
        selector: ["uploader.username", "uploader.name", "attributes.uploader.username", "attributes.uploader.name"],
      },
      seeders: { selector: ["seeders", "attributes.seeders"] },
      leechers: { selector: ["leechers", "attributes.leechers"] },
      completed: { selector: ["times_completed", "attributes.times_completed", "completed", "attributes.completed"] },
      comments: { text: 0 },
      status: {
        text: v.unknown,
        selector: ["div.ds-macro-row__name-content[style*='font-variant-numeric']"],
        case: { "a[href*='peers'][title*='Seeding'][style*='--ds-success']": v.seeding },
      },
      progress: {
        text: 0,
        selector: ["div.ds-macro-row__name-content[style*='font-variant-numeric']"],
        case: {
          "a[href*='peers'][title*='Seeding'][style*='--ds-success']": 100,
          "a[href*='peers'][title*='seeders'][style*='inherit']": 0,
        },
      },
    },
  },
  noLoginAssert: { ...c.noLoginAssert, urlPatterns: [/doLogin|login|verify|checkpoint|returnto|twofactor/gi] },
  userInfo: {
    pickLast: ["name", "id"],
    selectors: {
      ...c.userInfo.selectors,
      name: { selector: "data.username" },
      levelName: { selector: "data.group" },
      joinTime: { selector: "data.member_since", filters: [{ name: "parseTime" }] },
      uploaded: { selector: "data.uploaded" },
      downloaded: { selector: "data.downloaded" },
      bonus: { selector: "data.hunos" },
      seeding: { selector: "data.active_seeds" },
      leeching: { selector: "data.active_leeches" },
      hnrUnsatisfied: { selector: "data.hit_and_runs" },
      id: {
        selector: ["span.deep-space-user-card__user-id"],
        filters: [
          (e) => {
            const t = e.match(/\d+/);
            return t ? parseInt(t[0], 10) : 0;
          },
        ],
      },
      uploads: {
        selector: ["div.ds-user-stats span[title*='Uploads']"],
        filters: [{ name: "split", args: ["/", 0] }, { name: "trim" }, { name: "parseNumber" }],
      },
      seedingSize: { selector: ["div.ds-user-stats span[title*='Seeding Size']"], filters: [{ name: "parseSize" }] },
      messageCount: {
        text: 0,
        selector: ["div.ds-user-stats a[href*='/hub/messages'] > span.ds-count"],
        elementProcess: (e) => {
          const t = e.querySelector("i");
          if (!t) return 0;
          const s = Array.from(t.classList).find((a) => /^fa-square-\d+$/.test(a));
          return (s && parseInt(s.replace("fa-square-", ""), 10)) || 11;
        },
      },
      bonusPerHour: {
        selector: ["table.deep-space-similar-table > tfoot td.tw-font-bold[style*=color]"],
        filters: [{ name: "parseNumber" }],
      },
    },
    process: [
      {
        requestConfig: { url: "/api/profile", method: "GET", responseType: "json" },
        fields: [
          "name",
          "levelName",
          "joinTime",
          "uploaded",
          "downloaded",
          "bonus",
          "seeding",
          "leeching",
          "hnrUnsatisfied",
        ],
      },
      {
        requestConfig: { url: "/", method: "GET", responseType: "document" },
        fields: ["id", "uploads", "seedingSize", "messageCount"],
      },
      {
        requestConfig: { url: "/users/$name$/hub/hunos", responseType: "document" },
        assertion: { name: "url" },
        fields: ["bonusPerHour"],
      },
    ],
  },
  levelRequirements: [
    { id: 1, name: "Silent Sisters", privilege: "Can download" },
    { id: 2, name: "Iron Fleet", privilege: "Can upload; Can request" },
    {
      id: 3,
      name: "White Walkers",
      privilege: "RSS; IRC Server; IRC Announce; Upload API; Can apply for hawke-one Discord access",
    },
    { id: 4, name: "Dothraki", privilege: "Listed uploads; HnR immunity" },
    {
      id: 5,
      name: "Unsullied",
      privilege:
        "Can invite; Can see peers; Trusted uploader; Worthy; hawke-one Discord invite; Unsullied on hawke-one Discord with added perks",
    },
    {
      id: 6,
      name: "Targaryen",
      privilege: "Internal; Custom branding; Targaryen on hawke-one Discord with added perks",
    },
  ],
};
class re extends q {
  parseTorrentRowForTags(t, s, a) {
    const i = super.parseTorrentRowForTags(t, s, a),
      p = i.tags || [],
      n = (r) => {
        p.some((b) => b.name === r.name) || p.push(r);
      },
      g = l(s, ["name", "attributes.name"]),
      d = h(s),
      u = d.map(({ path: r, value: b }) => `${r}:${b}`).join(" "),
      f = l(s, [
        "release_tag",
        "release_tag.name",
        "release_tag.abbreviation",
        "attributes.release_tag",
        "attributes.release_tag.name",
        "attributes.release_tag.abbreviation",
      ]),
      y = l(s, [
        "media_language",
        "media_language.name",
        "media_language.abbreviation",
        "attributes.media_language",
        "attributes.media_language.name",
        "attributes.media_language.abbreviation",
      ]),
      _ = l(s, [
        "audio",
        "audios",
        "audio_language",
        "audio_languages",
        "attributes.audio",
        "attributes.audios",
        "attributes.audio_language",
        "attributes.audio_languages",
      ]),
      j = l(s, [
        "subtitle",
        "subtitles",
        "subtitle_language",
        "subtitle_languages",
        "attributes.subtitle",
        "attributes.subtitles",
        "attributes.subtitle_language",
        "attributes.subtitle_languages",
      ]),
      C = d
        .filter(({ path: r }) => /sub(title)?|caption/i.test(r))
        .map(({ value: r }) => r)
        .join(" "),
      T = d
        .filter(({ path: r }) => /audio|dub|language|media_language/i.test(r))
        .map(({ value: r }) => r)
        .join(" "),
      m = /Chinese|Mandarin|Cantonese|中文|中字|简体|繁体|国语|国配|粤语|粤配/i;
    return (
      (m.test(j) ||
        m.test(C) ||
        /中字|中文|简体|繁体|CHS|CHT|CHN|Chinese\s*Sub/i.test(g) ||
        (/SUBBED/i.test(f) && m.test(u)) ||
        (/sub(title)?|caption/i.test(u) && m.test(u))) &&
        n({ name: "中字" }),
      /Mandarin|Chinese|国语|国配|普通话|中配/i.test([y, _, g].join(" ")) && n({ name: "国语" }),
      /Cantonese|粤语|粤配/i.test([y, _, g].join(" ")) && n({ name: "粤语" }),
      (/Chinese|Mandarin|Cantonese|中文|中字|简体|繁体/i.test(C) ||
        (/SUBBED/i.test(f) && /Chinese|Mandarin|Cantonese|中文|中字|简体|繁体/i.test(u))) &&
        n({ name: "中字" }),
      (/Mandarin|Chinese|国语|国配|普通话|中配/i.test(T) ||
        (/DUBBED/i.test(f) && /Mandarin|Chinese|国语|国配|普通话|中配/i.test(u))) &&
        n({ name: "国语" }),
      /Cantonese|粤语|粤配/i.test(T) && n({ name: "粤语" }),
      d.filter(({ path: r }) => /free|freeleech|discount|promo|promotion/i.test(r)).some(({ value: r }) => D(r)) &&
        n({ name: "Free" }),
      (i.tags = p),
      i
    );
  }
  async request(t, s = !0) {
    return (
      (t.headers = { ...(t.headers ?? {}), "X-Api-Token": this.userConfig.inputSetting.token ?? "", origin: this.url }),
      super.request(t, s)
    );
  }
}
export { re as default, ae as siteMetadata };
