import t, {
  SchemaMetadata as a,
  CategoryIncldead as o,
  CategoryInclbookmarked as l,
  subTitleRemoveExtraElement as m,
} from "../schemas/NexusPHP-BNC4SlPA.js";
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
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const V = {
  ...a,
  version: 1,
  id: "keepfrds",
  name: "PT@KEEPFRDS",
  aka: ["FRDS", "朋友"],
  description: "KEEP FRIENDS 专注于小而美的分享，给大家带来更多更优的视听体验。 Let us keep friends forever!",
  tags: ["影视", "综合"],
  type: "private",
  schema: "NexusPHP",
  urls: ["https://pt.keepfrds.com/"],
  favicon: "https://pt.keepfrds.com/static/favicon-64x64.png",
  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { name: "电影", value: 401 },
        { name: "纪录片-传记", value: 404 },
        { name: "动画", value: 405 },
        { name: "剧集", value: 402 },
        { name: "综艺", value: 403 },
        { name: "舞台", value: 421 },
        { name: "演唱会-音乐剧", value: 420 },
        { name: "音乐短片(MV)", value: 406 },
        { name: "偶像", value: 424 },
        { name: "音乐", value: 408 },
        { name: "体育", value: 407 },
        { name: "有声读物", value: 415 },
        { name: "电子书", value: 414 },
        { name: "游戏", value: 423 },
        { name: "软件", value: 422 },
        { name: "🍆", value: 419 },
        { name: "其他", value: 409 },
        { name: "鲨鱼", value: 425 },
        { name: "回收站", value: 300 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "来源",
      key: "source",
      options: [
        { name: "UHD Blu-ray", value: 10 },
        { name: "Blu-ray", value: 1 },
        { name: "HD DVD", value: 2 },
        { name: "HDTV", value: 4 },
        { name: "Web-DL", value: 7 },
        { name: "Web-Rip", value: 8 },
        { name: "DVD", value: 3 },
        { name: "TV", value: 5 },
        { name: "OST-Soundtrack", value: 11 },
        { name: "M(Album-EP)", value: 13 },
        { name: "M(Single)", value: 14 },
        { name: "Other", value: 6 },
        { name: "UNK1", value: 0 },
        { name: "UNK2", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "HEVC Dolby Vision", value: 14 },
        { name: "HEVC HDR10+", value: 13 },
        { name: "HEVC HDR10", value: 12 },
        { name: "HEVC 10bit", value: 11 },
        { name: "HEVC", value: 10 },
        { name: "AV1", value: 15 },
        { name: "VP9", value: 16 },
        { name: "VC-1", value: 2 },
        { name: "AVC", value: 3 },
        { name: "MPEG-2", value: 4 },
        { name: "AVS", value: 17 },
        { name: "Other", value: 5 },
        { name: "M(FLAC)", value: 19 },
        { name: "M(DDPJOC)", value: 20 },
        { name: "UNK0", value: 0 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "2160p(4k)", value: 7 },
        { name: "1080p", value: 1 },
        { name: "1080i", value: 2 },
        { name: "720p", value: 3 },
        { name: "480p", value: 5 },
        { name: "8K", value: 8 },
        { name: "UNK0", value: 0 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "FRDS", value: 6 },
        { name: "cXcY@FRDS", value: 3 },
        { name: "Yumi@FRDS", value: 10 },
        { name: "Lonely@FRDS", value: 14 },
        { name: "AJ@FRDS", value: 12 },
        { name: "DalekW@FRDS", value: 8 },
        { name: "greenotea@FRDS", value: 9 },
        { name: "FRDSBypassCD", value: 17 },
        { name: "cfandora", value: 15 },
        { name: "搬运", value: 11 },
        { name: "UNK0", value: 0 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    o,
    {
      name: "促销种子？",
      key: "spstate",
      options: [
        { name: "全部", value: 0 },
        { name: "普通", value: 1 },
        { name: "免费", value: 2 },
        { name: "2X", value: 3 },
        { name: "2X免费", value: 4 },
        { name: "50%", value: 5 },
        { name: "2X 50%", value: 6 },
        { name: "30%", value: 7 },
        { name: "中性种子(NL)", value: 8 },
      ],
      cross: !1,
    },
    l,
    {
      name: "下载状态",
      key: "option-torrents",
      options: [
        { name: "全部", value: 0 },
        { name: "我下载过的", value: 1 },
        { name: "正在做种的", value: 3 },
        { name: "正在下载的", value: 5 },
        { name: "未下载过的", value: 6 },
        { name: "未完成的", value: 7 },
        { name: "已完成的", value: 9 },
        { name: "我发布的", value: 10 },
      ],
      cross: !1,
    },
  ],
  officialGroupPattern: [/-FRDS|@FRDS/i],
  search: {
    ...a.search,
    selectors: {
      ...a.search.selectors,
      subTitle: { selector: ["a[href*='hit'][title]", "a[href*='hit']:has(b)"], elementProcess: m(["b"], !0) },
      tags: [
        ...a.search.selectors.tags,
        { selector: "td.embedded b > font.recommended:contains('禁转')", name: "Excl.", color: "red" },
      ],
    },
  },
  detail: {
    ...a.detail,
    selectors: { ...a.detail.selectors, link: { selector: "input#download_link", attr: "value" } },
  },
  userInfo: {
    ...a.userInfo,
    selectors: {
      ...a.userInfo.selectors,
      messageCount: { selector: ["a[href*='messages.php'] b span[style*='color: red']"] },
      bonus: {
        selector: ["td.rowhead:contains('魔力') + td", "td.rowhead:contains('Karma'):contains('Points') + td"],
        filters: [
          (e) => (
            (e = e.replace(/,/g, "")),
            /(魔力值):.+?([\d.]+)/.test(e)
              ? ((e = e.match(/(魔力值):.+?([\d.]+)/)[2]), parseFloat(e))
              : /[\d.]+/.test(e)
                ? parseFloat(e.match(/[\d.]+/)[0])
                : e
          ),
        ],
      },
      seeding: { selector: ["a[href='/torrents.php?option-torrents=3']"], filters: [{ name: "parseNumber" }] },
      seedingSize: {
        selector: [
          "td.rowhead:contains('当前做种') + td, td.rowhead:contains('Current Seeding') + td, td.rowhead:contains('目前做種') + td",
        ],
        filters: [{ name: "parseSize" }],
      },
      bonusPerHour: {
        selector: ["tbody:has(>tr>td.embedded>i.fab.fa-btc)"],
        filters: [
          (e) => {
            const n = String(e || "")
              .replace(/,/g, "")
              .match(/[\d.]+/g);
            if (!n) return 0;
            let r = 0;
            return (
              n.length === 5 ? (r = parseFloat(n[2]) + parseFloat(n[4])) : n.length >= 3 && (r = parseFloat(n[2])),
              r
            );
          },
        ],
      },
    },
    process: [
      { requestConfig: { url: "/index.php", responseType: "document" }, fields: ["id", "name"] },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "messageCount",
          "uploaded",
          "trueUploaded",
          "downloaded",
          "trueDownloaded",
          "levelName",
          "bonus",
          "seedingBonus",
          "joinTime",
          "seeding",
          "seedingSize",
          "hnrUnsatisfied",
          "hnrPreWarning",
          "bonusPerHour",
          "lastAccessAt",
        ],
      },
    ],
  },
  levelRequirements: [
    { id: 1, name: "User", privilege: "新用户的默认级别。可以查看NFO文档；" },
    {
      id: 2,
      name: "Power User",
      interval: "P5W",
      downloaded: "50GB",
      ratio: 1,
      bonus: 3200,
      privilege: "请求续种；查看排行榜；查看其它用户的种子历史；查看IMDB/Douban信息；使用魔力值",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P10W",
      downloaded: "150GB",
      ratio: 1.5,
      bonus: 19200,
      privilege: "封存账号后不会被删除；查看排行榜，IMDB/Douban Top榜单和论坛的邀请区",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2,
      bonus: 76800,
      privilege: "在做种/下载的时候选择匿名模式；使用自动合集功能",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P30W",
      downloaded: "500GB",
      ratio: 2.5,
      bonus: 256e3,
      privilege: "查看普通日志",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.5,
      bonus: 64e4,
      isKept: !0,
      privilege: "查看其它用户的评论、帖子历史；永远保留账号",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P90W",
      downloaded: "2TB",
      ratio: 4,
      bonus: 128e4,
      isKept: !0,
      privilege: "上传量按照等级对应的限速计算",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P120W",
      downloaded: "3TB",
      ratio: 4.5,
      bonus: 192e4,
      isKept: !0,
      privilege: "上传速度限制提升为普通用户的二倍",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P150W",
      downloaded: "4TB",
      ratio: 5,
      bonus: 256e4,
      isKept: !0,
      privilege: "除了数据考核要求，其他权利等同于VIP，包括没有上传速度的限制",
    },
    { id: 100, name: "贵宾", groupType: "vip", privilege: "为 FRDS 做出过卓越贡献的精英成员。免除自动降级。" },
    { id: 200, name: "养老族", groupType: "manager", privilege: "退休后的管理组成员。" },
    { id: 201, name: "发布员", groupType: "manager", privilege: "专注的发布者。可以查看匿名用户的真实身份。" },
    {
      id: 202,
      name: "总版主",
      groupType: "manager",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息。不能管理友情链接、最近消息、论坛版块；不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    { id: 203, name: "管理员", groupType: "manager", privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。" },
    {
      id: 204,
      name: "维护开发员",
      groupType: "manager",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    { id: 205, name: "主管", groupType: "manager", privilege: "网站主管，可以做任何事。" },
  ],
};
class U extends t {
  guessSearchFieldIndexConfig() {
    return {
      author: ['a[href*="sort=9"]'],
      comments: ["div.famfamfam-silk.comments"],
      completed: ["div.famfamfam-silk.tick"],
      leechers: ["div.famfamfam-silk.arrow_down"],
      seeders: ["div.famfamfam-silk.arrow_up"],
      size: ["div.famfamfam-silk.cd"],
      time: ["div.famfamfam-silk.date"],
    };
  }
}
export { U as default, V as siteMetadata };
