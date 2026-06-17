import { K as i, bD as l } from "../index-COeZNva1.js";
import { E as o } from "../types/torrent-BvvY2NbA.js";
import p, { SchemaMetadata as r, CategoryIncldead as u, CategorySpstate as c } from "../schemas/NexusPHP-BNC4SlPA.js";
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
const A = {
  ...r,
  version: 1,
  id: "springsunday",
  name: "SpringSunday",
  aka: ["CMCT", "SSD", "春天"],
  description: "Classic Movie Compression Team",
  tags: ["影视", "音乐", "综合"],
  collaborator: ["Rhilip"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://fcevatfhaqnl.arg/"],
  legacyUrls: ["https://hdcmct.org/"],
  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { value: 501, name: "Movies(电影)" },
        { value: 502, name: "TV Series(剧集)" },
        { value: 503, name: "Docs(纪录)" },
        { value: 504, name: "Animations(动画)" },
        { value: 505, name: "TV Shows(综艺)" },
        { value: 506, name: "Sports(体育)" },
        { value: 507, name: "MV(音乐视频)" },
        { value: 508, name: "Music(音乐)" },
        { value: 509, name: "Others(其他)" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "地区",
      key: "source",
      options: [
        { value: 1, name: "Mainland(大陆)" },
        { value: 2, name: "Hongkong(香港)" },
        { value: 3, name: "Taiwan(台湾)" },
        { value: 4, name: "West(欧美)" },
        { value: 5, name: "Japan(日本)" },
        { value: 6, name: "Korea(韩国)" },
        { value: 7, name: "India(印度)" },
        { value: 8, name: "Russia(俄国)" },
        { value: 9, name: "Thailand(泰国)" },
        { value: 99, name: "Other(其他地区)" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "格式",
      key: "medium",
      options: [
        { value: 1, name: "Blu-ray" },
        { value: 4, name: "Remux" },
        { value: 2, name: "MiniBD" },
        { value: 6, name: "BDRip" },
        { value: 7, name: "WEB-DL" },
        { value: 8, name: "WEBRip" },
        { value: 5, name: "HDTV" },
        { value: 9, name: "TVRip" },
        { value: 3, name: "DVD" },
        { value: 10, name: "DVDRip" },
        { value: 11, name: "CD" },
        { value: 99, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 1, name: "2160p" },
        { value: 2, name: "1080p" },
        { value: 3, name: "1080i" },
        { value: 4, name: "720p" },
        { value: 5, name: "SD" },
        { value: 99, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "视频编码",
      key: "codec",
      options: [
        { value: 1, name: "H.265/HEVC" },
        { value: 2, name: "H.264/AVC" },
        { value: 3, name: "VC-1" },
        { value: 4, name: "MPEG-2" },
        { value: 99, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 1, name: "DTS-HD" },
        { value: 2, name: "TrueHD" },
        { value: 6, name: "LPCM" },
        { value: 3, name: "DTS" },
        { value: 11, name: "E-AC-3" },
        { value: 4, name: "AC-3" },
        { value: 5, name: "AAC" },
        { value: 7, name: "FLAC" },
        { value: 8, name: "APE" },
        { value: 9, name: "WAV" },
        { value: 10, name: "MP3" },
        { value: 99, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 1, name: "CMCT" },
        { value: 8, name: "CMCTA" },
        { value: 9, name: "CMCTV" },
        { value: 2, name: "Oldboys" },
        { value: 12, name: "GTR" },
        { value: 13, name: "CatEDU" },
        { value: 14, name: "Telesto" },
        { value: 15, name: "iFree" },
        { value: 16, name: "RO" },
        { value: 17, name: "XY" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "标签",
      key: "tag",
      options: [
        { value: "internal", name: "官方" },
        { value: "selfrelease", name: "驻站" },
        { value: "animation", name: "动画" },
        { value: "exclusive", name: "禁转" },
        { value: "pack", name: "合集" },
        { value: "untouched", name: "原生" },
        { value: "selfpurchase", name: "自购" },
        { value: "mandarin", name: "国配" },
        { value: "subtitlezh", name: "中字" },
        { value: "subtitlesp", name: "特效" },
        { value: "selfcompile", name: "自译" },
        { value: "dovi", name: "DoVi" },
        { value: "hdr10", name: "HDR10" },
        { value: "hdr10plus", name: "HDR10+" },
        { value: "hdrvivid", name: "菁彩HDR" },
        { value: "hlg", name: "HLG" },
        { value: "cc", name: "CC" },
        { value: "3d", name: "3D" },
        { value: "request", name: "应求" },
        { value: "contest", name: "活动" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (e) => {
        const a = { requestConfig: { params: {} } };
        return (
          e.forEach((n) => {
            l(a, `requestConfig.params.${n}`, 1);
          }),
          a
        );
      },
    },
    u,
    c,
    {
      name: "显示推荐种子？",
      key: "pick",
      options: [
        { value: 0, name: "全部" },
        { value: 1, name: "热门" },
        { value: 2, name: "经典" },
        { value: 3, name: "推荐" },
        { value: 4, name: "经典/推荐" },
        { value: 5, name: "未审核" },
      ],
      cross: !1,
    },
    {
      name: "显示标记种子？",
      key: "inclbookmarked",
      options: [
        { name: "全部", value: 0 },
        { name: "仅收藏", value: 1 },
        { name: "仅预订", value: 3 },
      ],
      cross: !1,
    },
    {
      name: "显示我的种子？",
      key: "my",
      options: [
        { name: "全部", value: "" },
        { name: "做种中", value: "seeding" },
        { name: "下载中", value: "leeching" },
        { name: "未活动", value: "notactive" },
        { name: "下载过", value: "snatched" },
        { name: "未下载", value: "notsnatched" },
        { name: "已完成", value: "completed" },
        { name: "未完成", value: "incomplete" },
        { name: "已发布", value: "uploaded" },
      ],
      cross: !1,
    },
  ],
  officialGroupPattern: [/-(CMCT|cmctv)/i],
  search: {
    ...r.search,
    advanceKeywordParams: {
      ...r.search?.advanceKeywordParams,
      douban: { requestConfigTransformer: ({ requestConfig: e }) => (l(e, "params.search_area", 5), e) },
    },
    selectors: {
      ...r.search.selectors,
      id: {
        selector: ["a[href*='download.php?id=']:has(span.bi-download)"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      link: { selector: ["a[href*='download.php?id=']:has(span.bi-download)"], attr: "href" },
      url: { selector: ["a[href*='details.php?id='][title]"], attr: "href" },
      subTitle: { selector: ["div.torrent-smalldescr:first > span:not(.torrent-icon-fast)"] },
      progress: {
        selector: [".p_seeding", ".p_downloading", ".p_completed", ".p_inactive"],
        elementProcess: (e) => {
          if (e.classList.contains("p_seeding") || e.classList.contains("p_completed")) return 100;
          if (e.classList.contains("p_downloading")) {
            const n = (e.previousElementSibling?.getAttribute("style") || "").match(/(\d.+)%/);
            return n && n.length >= 2 ? parseFloat(n[1]) : 0;
          } else return 0;
        },
      },
      status: {
        selector: [".p_seeding", ".p_downloading", ".p_completed", ".p_inactive"],
        case: {
          ".p_seeding": o.seeding,
          ".p_downloading": o.downloading,
          ".p_completed": o.completed,
          ".p_inactive": o.inactive,
        },
      },
      tags: [
        { name: "Free", selector: "span.torrent-pro-icon.torrent-pro-free", color: "blue" },
        { name: "2xFree", selector: "span.torrent-pro-icon.torrent-pro-twoupfree", color: "green" },
        { name: "2xUp", selector: "span.torrent-pro-icon.torrent-pro-twoup", color: "green" },
        { name: "2x50%", selector: "span.torrent-pro-icon.torrent-pro-twouphalfdown", color: "red" },
        { name: "50%", selector: "span.torrent-pro-icon.torrent-pro-halfdown", color: "red" },
        { name: "30%", selector: "span.torrent-pro-icon.torrent-pro-thirtypercent", color: "purple" },
        { selector: "span.torrent-internal", name: "官方", color: "teal" },
        { selector: "span.torrent-selfrelease", name: "驻站", color: "green" },
        { selector: "span.torrent-animation", name: "动画", color: "blue" },
        { selector: "span.torrent-exclusive", name: "禁转", color: "red" },
        { selector: "span.torrent-pack", name: "合集", color: "orange" },
        { selector: "span.torrent-untouched", name: "原生", color: "purple" },
        { selector: "span.torrent-selfpurchase", name: "自购", color: "pink" },
        { selector: "span.torrent-mandarin", name: "国配", color: "cyan" },
        { selector: "span.torrent-subtitlezh", name: "中字", color: "lime" },
        { selector: "span.torrent-subtitlesp", name: "特效", color: "gold" },
        { selector: "span.torrent-selfcompile", name: "自译", color: "brown" },
        { selector: "span.torrent-dovi", name: "DoVi", color: "indigo" },
        { selector: "span.torrent-hdr10", name: "HDR10", color: "red" },
        { selector: "span.torrent-hdr10plus", name: "HDR10+", color: "red" },
        { selector: "span.torrent-hdrvivid", name: "菁彩HDR", color: "red" },
        { selector: "span.torrent-hlg", name: "HLG", color: "red" },
        { selector: "span.torrent-cc", name: "CC", color: "red" },
        { selector: "span.torrent-3d", name: "3D", color: "red" },
        { selector: "span.torrent-request", name: "应求", color: "red" },
        { selector: "span.torrent-contest", name: "活动", color: "red" },
      ],
    },
  },
  userInfo: {
    ...r.userInfo,
    selectors: {
      ...r.userInfo.selectors,
      bonus: {
        selector: ["td.rowhead:contains('积分') + td"],
        filters: [
          (e) => (
            (e = e.replace(/,/g, "")),
            /(茉莉).+?([\d.]+)/.test(e)
              ? ((e = e.match(/(茉莉).+?([\d.]+)/)[2]), parseFloat(e))
              : /[\d.]+/.test(e)
                ? parseFloat(e.match(/[\d.]+/)[0])
                : e
          ),
        ],
      },
      bonusPerHour: { selector: ["tbody tr.nowrap:first td:last"], filters: [{ name: "parseNumber" }] },
      seedingBonusPerHour: {
        selector: ["tbody tr.nowrap:first > td:nth-child(9)"],
        filters: [{ name: "parseNumber" }],
      },
      messageCount: {
        ...r.userInfo.selectors.messageCount,
        selector: ["a[href*='messages.php'] > b[style*='background: darkorange']"],
      },
    },
  },
  levelRequirements: [
    {
      id: 1,
      name: "新人(User)",
      privilege:
        "新用户的默认级别。可以发种，可以请求续种；可以在做种/下载/发布的时候选择匿名模式；可以上传字幕或删除自己上传的字幕；可以更新过期的外部信息。",
    },
    {
      id: 2,
      name: "精英(Elite)",
      downloaded: "500GB",
      ratio: 1.2,
      alternative: [{ seedingBonus: 1e5, uploads: 1 }, { seedingBonus: 15e4 }],
      privilege:
        "可以在做种/下载/发布的时候选择匿名模式；可以查看用户列表；可以查看排行榜；可以浏览论坛邀请区；自助申请保种员；等级加成 0.05。",
    },
    {
      id: 3,
      name: "大师(Master)",
      downloaded: "1TB",
      ratio: 1.2,
      alternative: [{ seedingBonus: 5e5, uploads: 100 }, { seedingBonus: 1e6 }],
      privilege: "可以访问高级用户论坛，等级加成 0.15。",
    },
    {
      id: 4,
      name: "神仙(God)",
      downloaded: "3TB",
      ratio: 2,
      alternative: [{ seedingBonus: 12e5, uploads: 300 }, { seedingBonus: 24e5 }],
      privilege: "彩色 ID 特权；可以查看普通日志；等级加成 0.25。",
    },
    {
      id: 5,
      name: "神王(Immortal)",
      privilege:
        "成为当月神王时奖励当时邀请茉莉价格的一半茉莉，最酷炫的动态彩色 ID 特权；常规时期可以购买及发送邀请；等级加成0.35。",
    },
    {
      id: 100,
      name: "贵宾(VIP)",
      groupType: "vip",
      privilege: "贵宾(VIP)的权限和神王(Immortal)相同。贵宾(VIP)及其以上等级免除自动降级。",
    },
  ],
};
class F extends p {
  async parseUserInfoForSeedingStatus(a) {
    const n = a.id,
      t = await this.requestUserSeedingPage(n);
    if (t && /<b>\d+<\/b>(条记录| records|條記錄)/.test(t)) {
      const s = i(t);
      ((a.seeding = this.getFieldData(s, { selector: "b:eq(0)", filters: [(m) => parseInt(m)] })),
        (a.seedingSize = this.getFieldData(s, { selector: "b:eq(1)", filters: [{ name: "parseSize" }] })));
    } else return super.parseUserInfoForSeedingStatus(a);
    return a;
  }
}
export { F as default, A as siteMetadata };
