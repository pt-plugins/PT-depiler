import { E as m } from "../types/base-Dy_28wGT.js";
import { bA as p } from "../index-COeZNva1.js";
import u from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
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
const i = { 501: "电影", 502: "剧集", 503: "动画", 504: "节目", 599: "其它" },
  g = {
    301: "UHD Blu-ray",
    302: "UHD Blu-ray DIY",
    303: "Blu-ray",
    304: "Blu-ray DIY",
    305: "Remux",
    306: "Encode",
    307: "UHDTV",
    308: "HDTV",
    309: "WEB-DL",
    399: "Other",
  },
  f = { 401: "720p", 402: "1080i", 403: "1080p", 404: "2160p", 499: "Other" },
  h = { 101: "H264", 102: "H265", 103: "x264", 104: "x265", 199: "Other" },
  n = {
    601: "官方",
    602: "禁转",
    603: "国语",
    604: "中字",
    611: "杜比视界",
    613: "HDR10",
    614: "特效字幕",
    621: "完结",
    622: "分集",
  },
  G = {
    version: 1,
    id: "zhuque",
    name: "朱雀",
    aka: ["Zhuque"],
    description: "新架构的影视站点",
    tags: ["影视", "综合"],
    timezoneOffset: "+0800",
    type: "private",
    schema: "TNode",
    urls: ["uggcf://muhdhr.va/"],
    collaborator: ["hui-shao"],
    category: [
      {
        name: "分类",
        key: "category",
        keyPath: "data",
        options: Object.entries(i).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "brackets" },
      },
      {
        name: "媒介",
        key: "medium",
        keyPath: "data",
        options: Object.entries(g).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "brackets" },
      },
      {
        name: "分辨率",
        key: "resolution",
        keyPath: "data",
        options: Object.entries(f).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "brackets" },
      },
      {
        name: "视频编码",
        key: "videoCoding",
        keyPath: "data",
        options: Object.entries(h).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "brackets" },
      },
      {
        name: "标签",
        key: "tags",
        keyPath: "data",
        options: Object.entries(n).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "brackets" },
      },
    ],
    search: {
      keywordPath: "data.keyword",
      requestConfig: {
        url: "/api/torrent/advancedSearch",
        method: "POST",
        data: { page: 1, size: 100, type: "title" },
        responseType: "json",
      },
      selectors: {
        rows: { selector: "data.torrents" },
        id: { selector: "id" },
        title: { selector: "title" },
        subTitle: { selector: "subtitle" },
        url: { selector: "id", filters: [{ name: "prepend", args: ["/torrent/info/"] }] },
        link: { selector: "id", filters: [{ name: "prepend", args: ["/api/torrent/download/"] }] },
        time: { selector: "upload_time", filters: [(t) => t * 1e3] },
        size: { selector: "size" },
        category: { selector: "category", filters: [(t) => i[t] ?? String(t)] },
        seeders: { selector: "seeding" },
        leechers: { selector: "leeching" },
        completed: { selector: "complete" },
        comments: { selector: "review" },
        progress: { selector: "progress" },
        ext_imdb: { selector: ["imdb_id"], filters: [{ name: "extImdbId" }] },
      },
    },
    searchEntry: { area_all: { name: "全部", enabled: !0 } },
    userInfo: {
      pickLast: ["id", "joinTime"],
      process: [
        {
          requestConfig: { url: "/api/plugins/ptppUserInfo", responseType: "json" },
          selectors: {
            id: { selector: "data.id" },
            name: { selector: "data.name" },
            levelName: { selector: "data.levelName" },
            joinTime: { selector: "data.joinTime", filters: [(t) => Number(t) * 1e3] },
            uploaded: { selector: "data.uploaded" },
            downloaded: { selector: "data.downloaded" },
            trueDownloaded: { selector: "data.trueDownloaded" },
            bonus: { selector: "data.bonus" },
            seedingBonus: { selector: "data.seedingPoints" },
            bonusPerHour: { selector: "data.bonusPerHour" },
            uploads: { selector: "data.uploadCount" },
            seeding: { selector: "data.seeding" },
            seedingSize: { selector: "data.seedingSize" },
            messageCount: { selector: "data.messageCount" },
            csrfToken: { selector: "data.csrfToken" },
            lastAccessAt: { selector: "data.lastUpdateTime", filters: [(t) => Number(t) * 1e3] },
            invites: { selector: "data.invites" },
          },
        },
      ],
    },
    levelRequirements: [
      { id: 1, name: "筑基", privilege: "入站初始等级" },
      { id: 2, name: "结丹", interval: "P5W", downloaded: "10GB", ratio: 2, privilege: "无" },
      { id: 3, name: "元婴", interval: "P10W", downloaded: "25GB", ratio: 2, privilege: "无" },
      { id: 4, name: "出窍", interval: "P15W", downloaded: "50GB", ratio: 2, privilege: "无" },
      { id: 5, name: "炼虚", interval: "P20W", downloaded: "100GB", ratio: 2, privilege: "无" },
      { id: 6, name: "合体", interval: "P25W", downloaded: "200GB", ratio: 4, privilege: "无" },
      { id: 7, name: "大乘", interval: "P30W", downloaded: "300GB", ratio: 6, privilege: "无" },
      { id: 8, name: "真仙", interval: "P35W", downloaded: "400GB", ratio: 8, privilege: "无" },
    ],
  };
class M extends u {
  async request(e, r = !0) {
    return (
      (e.headers = { ...(e.headers ?? {}), "x-csrf-token": (await this.getCsrfToken()) ?? "" }),
      super.request(e, r)
    );
  }
  parseTorrentRowForTags(e, r, k) {
    const a = [],
      { uploadRate: d, downloadRate: l } = r;
    switch (d) {
      case 2:
        a.push({ name: "2xUp", color: "green" });
        break;
    }
    switch (l) {
      case 0:
        a.push({ name: "Free", color: "blue" });
        break;
    }
    const s = r.tags ?? [];
    if (s.length > 0)
      for (const c of s) {
        const o = n[c];
        o && a.push({ name: o });
      }
    return ((e.tags = a), e);
  }
  async getUserInfoResult(e = {}) {
    const r = await super.getUserInfoResult(e);
    return (
      r.status === m.success &&
        typeof r.csrfToken < "u" &&
        (await this.storeRuntimeSettings("csrfToken", r.csrfToken), delete r.csrfToken),
      r
    );
  }
  async getCsrfToken() {
    let e = await this.retrieveRuntimeSettings("csrfToken");
    if (e) return e;
    {
      const r = p("metadata", `lastUserInfo.${this.metadata.id}.csrfToken`);
      if (r) return (await this.storeRuntimeSettings("csrfToken", r), r);
    }
    return "";
  }
}
export { M as default, G as siteMetadata };
