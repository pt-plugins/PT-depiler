import { bD as m, o as b, p as T } from "../index-COeZNva1.js";
import { E as i } from "../types/torrent-BvvY2NbA.js";
import P from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
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
const c = [
    { value: "401", name: "電影/SD", type: "normal" },
    { value: "419", name: "電影/HD", type: "normal" },
    { value: "420", name: "電影/DVDiSo", type: "normal" },
    { value: "421", name: "電影/Blu-Ray", type: "normal" },
    { value: "439", name: "電影/Remux", type: "normal" },
    { value: "403", name: "影劇/綜藝/SD", type: "normal" },
    { value: "402", name: "影劇/綜藝/HD", type: "normal" },
    { value: "438", name: "影劇/綜藝/BD", type: "normal" },
    { value: "435", name: "影劇/綜藝/DVDiSo", type: "normal" },
    { value: "404", name: "紀錄", type: "normal" },
    { value: "434", name: "Music(無損)", type: "normal" },
    { value: "406", name: "演唱", type: "normal" },
    { value: "423", name: "PC遊戲", type: "normal" },
    { value: "448", name: "TV遊戲", type: "normal" },
    { value: "405", name: "動畫", type: "normal" },
    { value: "407", name: "運動", type: "normal" },
    { value: "427", name: "電子書", type: "normal" },
    { value: "422", name: "軟體", type: "normal" },
    { value: "442", name: "有聲書", type: "normal" },
    { value: "451", name: "教育影片", type: "normal" },
    { value: "409", name: "Misc(其他)", type: "normal" },
    { value: "410", name: "AV(有碼)/HD Censored", type: "adult" },
    { value: "424", name: "AV(有碼)/SD Censored", type: "adult" },
    { value: "437", name: "AV(有碼)/DVDiSo Censored", type: "adult" },
    { value: "431", name: "AV(有碼)/Blu-Ray Censored", type: "adult" },
    { value: "429", name: "AV(無碼)/HD Uncensored", type: "adult" },
    { value: "430", name: "AV(無碼)/SD Uncensored", type: "adult" },
    { value: "426", name: "AV(無碼)/DVDiSo Uncensored", type: "adult" },
    { value: "432", name: "AV(無碼)/Blu-Ray Uncensored", type: "adult" },
    { value: "436", name: "AV(網站)/0Day", type: "adult" },
    { value: "440", name: "AV(Gay)/HD", type: "adult" },
    { value: "425", name: "IV(寫真影集)", type: "adult" },
    { value: "433", name: "IV(寫真圖集)", type: "adult" },
    { value: "411", name: "H-遊戲", type: "adult" },
    { value: "412", name: "H-動畫", type: "adult" },
    { value: "413", name: "H-漫畫", type: "adult" },
  ],
  v = {
    id: { selector: "a[href*='/detail/']", attr: "href", filters: [{ name: "parseNumber" }] },
    title: { selector: "a[href*='/detail/'] strong > span:nth-last-child(1)" },
    url: { selector: "a[href*='/detail/']", attr: "href" },
    completed: { text: "-" },
    keywords: { selector: "input#keyword", elementProcess: (t) => t.value },
  },
  y = [
    { id: 1, name: "User" },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      downloaded: "200GB",
      ratio: 2,
      privilege: "魔力值加成：+1%；可以使用匿名發表候選種子；可以上傳字幕",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: "400GB",
      ratio: 3,
      privilege:
        "魔力值加成：+2%；可以發送邀請；可以管理自己上傳的字幕；可以檢視別人的下載紀錄（當對方的隱私權設定不為強才會生效）；可以使用個性條",
    },
    { id: 4, name: "Crazy User", interval: "P12W", downloaded: "500GB", ratio: 4, privilege: "魔力值加成：+3%" },
    {
      id: 5,
      name: "Insane User",
      interval: "P16W",
      downloaded: "800GB",
      ratio: 5,
      privilege: "魔力值加成：+4%；可以檢視排行榜",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P20W",
      downloaded: "1000GB",
      ratio: 6,
      privilege: "魔力值加成：+5%；封存帳號（在控制面板）後不會被刪除帳號",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P24W",
      downloaded: "2000GB",
      ratio: 7,
      isKept: !0,
      privilege: "魔力值加成：+6%；永遠保留",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P28W",
      downloaded: "2500GB",
      ratio: 8,
      isKept: !0,
      privilege: "魔力值加成：+7%",
    },
    {
      id: 9,
      name: "mTorrent Master",
      interval: "P32W",
      downloaded: "3000GB",
      ratio: 9,
      isKept: !0,
      privilege: "魔力值加成：+8%",
    },
    { id: 100, name: "VIP", levelId: "10", groupType: "vip" },
  ];
function p(t) {
  return t.match(/(?:\/detail\/|#\/torrent\/)(\d+)/)?.[1];
}
const G = {
  version: 1,
  id: "mteam",
  name: "M-Team - TP",
  aka: ["MTeam", "馒头"],
  description: "综合性网站，有分享率要求",
  tags: ["影视", "综合", "成人"],
  timezoneOffset: "+0800",
  collaborator: ["Rhilip"],
  type: "private",
  schema: "mTorrent",
  urls: ["uggcf://xc.z-grnz.pp/", "uggcf://mc.z-grnz.vb/", "uggcf://bo.z-grnz.pp/"],
  legacyUrls: [
    "https://h5.m-team.cc/",
    "https://xp.m-team.io/",
    "https://pt.m-team.cc/",
    "https://tp.m-team.cc/",
    "https://xp.m-team.cc/",
    "https://ap.m-team.cc/",
    "https://next.m-team.cc/",
  ],
  category: [
    {
      name: "分类入口",
      key: "mode",
      keyPath: "data",
      options: [
        { name: "综合", value: "normal" },
        { name: "成人", value: "adult" },
      ],
    },
    {
      name: "類別（综合）",
      key: "categories_normal",
      keyPath: "data",
      notes: "请先设置分类入口为“综合”！请勿与 成人 区类别同时选择！",
      options: c.filter((t) => t.type === "normal"),
      cross: { mode: "brackets", key: "categories" },
    },
    {
      name: "類別（成人）",
      key: "categories_adult",
      keyPath: "data",
      notes: "请先设置分类入口为“成人”！请勿与 综合 区类别同时选择！",
      options: c.filter((t) => t.type === "adult"),
      cross: { mode: "brackets", key: "categories" },
    },
    {
      name: "視頻編碼",
      key: "videoCodecs",
      keyPath: "data",
      options: [
        { name: "H.264(x264/AVC)", value: "1" },
        { name: "VC-1", value: "2" },
        { name: "Xvid", value: "3" },
        { name: "MPEG-2", value: "4" },
        { name: "H.265(x265/HEVC)", value: "16" },
        { name: "AV1", value: "19" },
        { name: "VP8/9", value: "21" },
        { name: "AVS", value: "22" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "音頻編碼",
      key: "audioCodecs",
      keyPath: "data",
      options: [
        { name: "FLAC", value: "1" },
        { name: "APE", value: "2" },
        { name: "DTS", value: "3" },
        { name: "MP2/3", value: "4" },
        { name: "OGG", value: "5" },
        { name: "AAC", value: "6" },
        { name: "Other", value: "7" },
        { name: "AC3(DD)", value: "8" },
        { name: "TrueHD", value: "9" },
        { name: "TrueHD Atmos", value: "10" },
        { name: "DTS-HD MA", value: "11" },
        { name: "E-AC3(DDP)", value: "12" },
        { name: "E-AC3 Atoms(DDP Atoms)", value: "13" },
        { name: "LPCM/PCM", value: "14" },
        { name: "WAV", value: "15" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "解析度",
      key: "standards",
      keyPath: "data",
      options: [
        { name: "1080p", value: "1" },
        { name: "1080i", value: "2" },
        { name: "720p", value: "3" },
        { name: "SD", value: "5" },
        { name: "4K", value: "6" },
        { name: "8K", value: "7" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "標記",
      key: "labelsNew",
      keyPath: "data",
      options: [
        { name: "4k", value: "4k" },
        { name: "8k", value: "8k" },
        { name: "hdr", value: "hdr" },
        { name: "hdr10", value: "hdr10" },
        { name: "hdr10+", value: "hdr10+" },
        { name: "hlg", value: "hlg" },
        { name: "DoVi", value: "DoVi" },
        { name: "HDRVi", value: "HDRVi" },
        { name: "中字", value: "中字" },
        { name: "中配", value: "中配" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "促銷",
      key: "discount",
      keyPath: "data",
      options: [
        { name: "普通", value: "NORMAL" },
        { name: "30%", value: "PERCENT_70" },
        { name: "50%", value: "PERCENT_50" },
        { name: "免費", value: "FREE" },
      ],
      cross: !1,
    },
    {
      name: "活/死种",
      key: "visible",
      keyPath: "data",
      options: [
        { name: "僅活躍", value: 1 },
        { name: "僅死種", value: 2 },
      ],
    },
  ],
  officialGroupPattern: [/-(.*mteam|mpad|tnp|BMDru|MWEB)/i],
  search: {
    keywordPath: "data.keyword",
    requestConfig: {
      method: "POST",
      url: "/api/torrent/search",
      responseType: "json",
      data: { pageNumber: 1, pageSize: 100 },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ keywords: t, requestConfig: e }) => (
          m(e, "data.mode", "normal"),
          m(e, "data.keyword", T(t)),
          e
        ),
      },
      douban: {
        requestConfigTransformer: ({ keywords: t, requestConfig: e }) => (
          m(e, "data.mode", "normal"),
          m(e, "data.keyword", b(t)),
          e
        ),
      },
    },
    selectors: {
      rows: { selector: "data.data" },
      id: { selector: "id" },
      title: { selector: "name" },
      subTitle: { selector: "smallDescr" },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/detail/"] }] },
      time: { selector: "createdDate", filters: [{ name: "parseTime" }] },
      size: { selector: "size", filters: [{ name: "parseNumber" }] },
      author: { selector: "author", filters: [(t) => (typeof t == "string" ? `u:${t}` : "Anonymous")] },
      seeders: { selector: "status.seeders", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "status.leechers", filters: [{ name: "parseNumber" }] },
      completed: { selector: "status.timesCompleted", filters: [{ name: "parseNumber" }] },
      comments: { selector: "status.comments", filters: [{ name: "parseNumber" }] },
      category: { selector: "category", filters: [(t) => c.find((e) => e.value == t)?.name ?? "Unknown"] },
      ext_douban: { selector: "douban", filters: [{ name: "extDoubanId" }] },
      ext_imdb: { selector: "imdb", filters: [{ name: "extImdbId" }] },
    },
  },
  searchEntry: {
    area_normal: { name: "综合", requestConfig: { data: { mode: "normal" } } },
    area_adult: { name: "成人", requestConfig: { data: { mode: "adult" } }, enabled: !1 },
  },
  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/api/member/profile", method: "POST", responseType: "json" },
        selectors: {
          id: { selector: "data.id", filters: [{ name: "parseNumber" }] },
          name: { selector: "data.username" },
          joinTime: { selector: "data.createdDate", filters: [{ name: "parseTime" }] },
          uploaded: { selector: "data.memberCount.uploaded", filters: [{ name: "parseNumber" }] },
          downloaded: { selector: "data.memberCount.downloaded", filters: [{ name: "parseNumber" }] },
          levelName: {
            selector: "data.role",
            filters: [(t) => y.find((e) => t == (e.levelId ?? String(e.id)))?.name ?? t],
          },
          levelId: { selector: "data.role", filters: [{ name: "parseNumber" }] },
          bonus: { selector: "data.memberCount.bonus", filters: [{ name: "parseNumber" }] },
          lastAccessAt: { selector: "data.memberStatus.lastBrowse", filters: [{ name: "parseTime" }] },
        },
      },
      {
        requestConfig: { url: "/api/tracker/myPeerStatistics", method: "POST", responseType: "json" },
        selectors: {
          seeding: { selector: "data.seederCount", filters: [{ name: "parseNumber" }] },
          seedingSize: { selector: "data.seederSize", filters: [{ name: "parseNumber" }] },
          uploads: { selector: "data.uploadCount", filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/api/tracker/mybonus", method: "POST", responseType: "json" },
        selectors: { bonusPerHour: { selector: "data.formulaParams.finalBs", filters: [{ name: "parseNumber" }] } },
      },
      {
        requestConfig: { url: "/api/msg/notify/statistic", method: "POST", responseType: "json" },
        selectors: { messageCount: { selector: "data.unMake", filters: [{ name: "parseNumber" }] } },
      },
    ],
  },
  list: [
    {
      urlPattern: [/\/\/ob\..+\/browse/],
      mergeSearchSelectors: !1,
      selectors: {
        ...v,
        rows: { selector: "tbody.bg-\\[\\#bccad6\\] > tr" },
        subTitle: { selector: "a[href*='/detail/'] + br + div > span" },
        time: {
          selector: "td:nth-last-child(4) > span[title]",
          elementProcess: (t) => t.getAttribute("title") || t.textContent,
          filters: [{ name: "parseTime" }],
        },
        size: { selector: "td:nth-last-child(3)", filters: [{ name: "parseSize" }] },
        seeders: { selector: 'span[aria-label="arrow-up"] + span' },
        leechers: { selector: 'span[aria-label="arrow-down"] + span' },
        comments: { selector: "td:nth-last-child(5)" },
        category: { selector: "img[src*='/static/cate'][alt]", attr: "alt" },
        ext_douban: { selector: "a[href^='https://movie.douban.com/subject/']", filters: [{ name: "extDoubanId" }] },
        ext_imdb: { selector: "a[href^='https://www.imdb.com/title/']", filters: [{ name: "extImdbId" }] },
      },
    },
    {
      urlPattern: ["/browse"],
      mergeSearchSelectors: !1,
      selectors: {
        ...v,
        rows: { selector: "div.app-content__inner table.w-full > tbody > tr" },
        title: { selector: "a[href*='/detail/'] strong" },
        subTitle: { selector: "a[href*='/detail/'] + br + div > span:nth-last-child(1)" },
        time: {
          selector: "td:nth-last-child(5) > span[title]",
          elementProcess: (t) => t.getAttribute("title") || t.textContent,
          filters: [{ name: "parseTime" }],
        },
        size: { selector: "td:nth-last-child(4)", filters: [{ name: "parseSize" }] },
        seeders: { selector: "td:nth-last-child(3) span.align-middle:nth-last-child(1)" },
        leechers: { selector: "td:nth-last-child(2) span.align-middle:nth-last-child(1)" },
        comments: { selector: "td:nth-last-child(6)" },
        category: { selector: "a[href^='/browse?cat='] > span" },
        ext_douban: {
          selector: "a[href^='/mdb/title'][href*='douban=']",
          filters: [{ name: "querystring", args: ["douban"] }, { name: "extDoubanId" }],
        },
        ext_imdb: {
          selector: "a[href^='/mdb/title'][href*='imdb=']",
          filters: [{ name: "querystring", args: ["imdb"] }, { name: "extImdbId" }],
        },
      },
    },
  ],
  detail: {
    urlPattern: ["/detail/", "#/torrent/\\d+"],
    selectors: {
      id: { selector: ":self", elementProcess: (t) => p(t.URL) ?? t.URL },
      title: {
        selector: ["h2 > span.align-middle", "title"],
        filters: [
          { name: "replace", args: ['M-Team - TP :: 種子詳情 "', ""] },
          { name: "replace", args: ['" - Powered by mTorrent', ""] },
        ],
      },
      link: { text: "" },
    },
  },
  levelRequirements: y,
  userInputSettingMeta: [
    { name: "token", label: "Token", hint: "在控制台-实验室获取存取令牌并填入此处", required: !0 },
  ],
};
class j extends P {
  get normalizedSiteUrl() {
    try {
      const e = new URL(this.url);
      return ((e.hash = ""), (e.search = ""), (e.pathname = "/"), e.toString());
    } catch {
      return this.url;
    }
  }
  get apiBaseUrl() {
    try {
      const e = new URL(this.normalizedSiteUrl),
        a = e.hostname.split(".");
      return (a.length > 0 && (a[0] = "api"), (e.hostname = a.join(".")), e.toString());
    } catch {
      return this.normalizedSiteUrl.replace(/(.+?)\./, "https://api.");
    }
  }
  buildConfiguredDetailUrl(e) {
    return new URL(`/detail/${e}`, this.normalizedSiteUrl).toString();
  }
  async request(e, a = !0) {
    return (
      (e.baseURL = this.apiBaseUrl),
      (e.method = "POST"),
      (e.responseType = "json"),
      (e.headers = {
        ...(e.headers ?? {}),
        "x-api-key": this.userConfig.inputSetting.token ?? "",
        origin: this.normalizedSiteUrl,
      }),
      super.request(e, a)
    );
  }
  loggedCheck(e) {
    return e.data?.message === "SUCCESS";
  }
  fixLink(e, a) {
    return super.fixLink(e, { ...a, baseURL: this.normalizedSiteUrl });
  }
  async transformDetailPage(e) {
    const a = await super.transformDetailPage(e),
      r = a.id || p(e.URL);
    return (r && ((a.id = String(r)), (a.url = this.buildConfiguredDetailUrl(a.id)), (a.link ||= a.url)), a);
  }
  mapDiscountToTag(e) {
    switch (e) {
      case "FREE":
        return { name: "Free", color: "blue" };
      case "PERCENT_70":
        return { name: "30%", color: "indigo" };
      case "PERCENT_50":
        return { name: "50%", color: "orange" };
      default:
        return;
    }
  }
  parseTorrentRowForTags(e, a, r) {
    const n = [];
    if (a.status?.promotionRule) {
      const s = a.status.promotionRule.discount ?? "NORMAL",
        l = this.mapDiscountToTag(s);
      l && n.push(l);
    } else if (a.status?.mallSingleFree) n.push({ name: "Free", color: "blue" });
    else {
      const s = a.status?.discount ?? "NORMAL",
        l = this.mapDiscountToTag(s);
      l && n.push(l);
    }
    if (a.labelsNew && a.labelsNew.length > 0) {
      const s = Array.from(new Set(a.labelsNew));
      n.push(...s.map((l) => ({ name: l })));
    }
    return ((e.tags = n), e);
  }
  async queryTorrentHistory(e) {
    const { data: a } = await this.request({
      method: "POST",
      url: "/api/tracker/queryHistory",
      data: { tids: e },
      headers: { "Content-Type": "application/json" },
    });
    return a;
  }
  async transformSearchPage(e, a) {
    const r = await super.transformSearchPage(e, a);
    if (r.length === 0) return r;
    const n = r.map((s) => String(s.id)).filter(Boolean);
    if (n.length === 0) return r;
    try {
      const s = await this.queryTorrentHistory(n);
      if (s.code === "0" && s.data) {
        const { historyMap: l, peerMap: f } = s.data;
        r.forEach((o) => {
          const h = String(o.id),
            d = l[h],
            u = f[h];
          d || u
            ? u
              ? parseInt(u.left || "0") === 0
                ? ((o.progress = 100), (o.status = i.seeding))
                : (o.status = i.downloading)
              : d &&
                (parseInt(d.timesCompleted || "0") > 0
                  ? ((o.progress = 100), (o.status = i.completed))
                  : (o.status = i.inactive))
            : (o.status = i.unknown);
        });
      }
    } catch (s) {
      console.warn("[MTeam] Failed to query torrent history:", s);
    }
    return r;
  }
  async getTorrentDownloadLink(e) {
    if (!e.id) {
      const r = [e.link, e.url].map((n) => (n ? p(n) : void 0)).find(Boolean);
      r && (e.id = r);
    }
    if (!e.id) throw new Error("Unable to resolve M-Team torrent ID");
    const { data: a } = await this.request({
      method: "POST",
      url: "/api/torrent/genDlToken",
      data: { id: e.id },
      headers: { "Content-Type": "multipart/form-data" },
    });
    return a.data;
  }
}
export { j as default, G as siteMetadata };
