import l, {
  SchemaMetadata as a,
  CategoryIncldead as d,
  CategorySpstate as u,
  CategoryInclbookmarked as p,
} from "../schemas/NexusPHP-BNC4SlPA.js";
import { p as v } from "../utils/filesize-D_1hx4u8.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
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
const I = {
  ...a,
  version: 1,
  id: "hdarea",
  name: "HDArea",
  aka: ["高清视界", "好大"],
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",
  collaborator: ["lzl20110", "zhuweitung"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://uqnern.pyho/"],
  legacyUrls: ["https://www.hdarea.co/"],
  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "Movie UHD-4K", value: 300 },
        { name: "Movies Blu-ray", value: 401 },
        { name: "Movies REMUX", value: 415 },
        { name: "Movies 3D", value: 416 },
        { name: "Movies 1080p", value: 410 },
        { name: "Movies 720p", value: 411 },
        { name: "Movies DVD", value: 414 },
        { name: "Movies WEB-DL", value: 412 },
        { name: "Movies HDTV", value: 413 },
        { name: "Movies iPad", value: 417 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Blu-ray", value: 1 },
        { name: "REMUX", value: 3 },
        { name: "Encode", value: 7 },
        { name: "WEB-DL", value: 9 },
        { name: "MiniBD", value: 4 },
        { name: "HDTV", value: 5 },
        { name: "HD DVD", value: 2 },
        { name: "DVDR", value: 6 },
        { name: "CD", value: 8 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "x264", value: 7 },
        { name: "MPEG-4", value: 1 },
        { name: "x265", value: 6 },
        { name: "MPEG-2", value: 4 },
        { name: "Xvid", value: 3 },
        { name: "VC-1", value: 2 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "AAC", value: 6 },
        { name: "DD5.1/AC3", value: 5 },
        { name: "TrueHD", value: 7 },
        { name: "DTS", value: 3 },
        { name: "DTS-HD MA", value: 4 },
        { name: "LPCM", value: 8 },
        { name: "WAV", value: 9 },
        { name: "APE", value: 2 },
        { name: "FLAC", value: 1 },
        { name: "TrueHD Atmos", value: 10 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "720p", value: 3 },
        { name: "1080p", value: 1 },
        { name: "SD", value: 4 },
        { name: "1080i", value: 2 },
        { name: "4K", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "EPiC", value: 1 },
        { name: "HDArea", value: 2 },
        { name: "HDWING", value: 3 },
        { name: "WiKi", value: 4 },
        { name: "TTG", value: 5 },
        { name: "other", value: 6 },
        { name: "MTeam", value: 7 },
        { name: "HDApad", value: 8 },
        { name: "CHD", value: 9 },
        { name: "HDAccess", value: 10 },
      ],
      cross: { mode: "append" },
    },
    d,
    u,
    p,
  ],
  search: {
    ...a.search,
    requestConfig: {
      ...a.search.requestConfig,
      params: { ...a.search.requestConfig.params, search_area: 0, search_mode: 0 },
    },
    advanceKeywordParams: { imdb: {}, douban: {} },
    selectors: {
      ...a.search.selectors,
      rows: { selector: "table.torrents > tbody > tr:has(table.torrentname)" },
      tags: [
        ...a.search.selectors.tags,
        { name: "首发", selector: "img.first_publish", color: "#3887D7" },
        { name: "禁转", selector: "img.transfer_forbidden", color: "#5E14DA" },
      ],
    },
  },
  detail: {
    ...a.detail,
    selectors: {
      ...a.detail.selectors,
      link: {
        selector: 'td:contains("下载链接") + td',
        elementProcess: (n) => n?.childNodes[0]?.textContent?.trim() ?? "",
      },
    },
  },
  userInfo: {
    ...a.userInfo,
    selectors: { ...a.userInfo.selectors },
    process: a.userInfo.process.map((n) =>
      n.requestConfig?.url === "/mybonus.php" ? { ...n, fields: [...(n.fields ?? []), "seedingSize"] } : n,
    ),
  },
  levelRequirements: [
    { id: 0, name: "User", privilege: "新用户的默认级别" },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        '得到1个邀请名额；可以直接发布种子；可以查看NFO文档；；可以请求续种； 可以发送邀请（开放邀请权限时）； 可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    { id: 2, name: "Elite User", interval: "P8W", downloaded: "120GB", ratio: 3, privilege: "权限同上。" },
    {
      id: 3,
      name: "Crazy User",
      interval: "P10W",
      downloaded: "300GB",
      ratio: 3.5,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P12W",
      downloaded: "750GB",
      ratio: 4,
      privilege: "可以查看普通日志。Insane User及以上用户封存账号后不会被删除。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P20W",
      downloaded: "1024GB",
      ratio: 4.5,
      isKept: !0,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P25W",
      downloaded: "2TB",
      ratio: 5,
      isKept: !0,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P30W",
      downloaded: "5TB",
      ratio: 5.5,
      isKept: !0,
      privilege: "得到1个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P40W",
      downloaded: "10TB",
      ratio: 6,
      isKept: !0,
      privilege: "得到2个邀请名额。",
    },
  ],
};
class z extends l {
  async getDataCountFromSeedingPage(e, t) {
    const o = await this.requestUserSeedingPage(e, t);
    if (!o) return null;
    const r = o.match(/data-count=['"](\d+)['"]/);
    return r ? parseInt(r[1], 10) : null;
  }
  async parseUserInfoForSeedingSize(e, t) {
    const r = (t.documentElement?.innerHTML ?? "").match(/做种总积\s*<b>([\d.]+)\s*([ZEPTGMK]?i?B)/);
    return (r && (e.seedingSize = v(`${r[1]} ${r[2]}`)), e);
  }
  async parseUserInfoForSeedingStatus(e) {
    const t = await this.getDataCountFromSeedingPage(e.id);
    return { ...e, seeding: t ?? 0 };
  }
  async parseUserInfoForUploads(e) {
    const t = e.id;
    return ((e.uploads = (await this.getDataCountFromSeedingPage(t, "uploaded")) ?? 0), e);
  }
  parseTorrentRowForTags(e, t, o) {
    super.parseTorrentRowForTags(e, t, o);
    const r = t.querySelectorAll("font[class]");
    if (r.length > 0) {
      const s = e.tags || [];
      (r.forEach((m) => {
        const i = m.textContent?.replace(/\s/g, "").replace("免费", "Free");
        i && s.push({ name: i });
      }),
        (e.tags = s));
    }
    return e;
  }
}
export { z as default, I as siteMetadata };
