import {
  SchemaMetadata as e,
  CategoryIncldead as a,
  CategorySpstate as n,
  CategoryInclbookmarked as i,
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
const E = {
  ...e,
  version: 1,
  id: "52movie",
  name: "52movie",
  description: "The Ultimate File Sharing Experience",
  tags: ["综合"],
  timezoneOffset: "+0800",
  collaborator: ["bfjy"],
  type: "private",
  schema: "NexusPHP",
  favicon: "./_default_nexusphp.png",
  urls: ["uggcf://jjj.52zbivr.gbc/"],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 401, name: "电影" },
        { value: 402, name: "电视剧" },
        { value: 403, name: "综艺" },
        { value: 404, name: "纪录片" },
        { value: 405, name: "动漫" },
        { value: 406, name: "Music Videos" },
        { value: 410, name: "体育" },
        { value: 409, name: "音乐" },
        { value: 411, name: "其它" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { value: 10, name: "Web-DL" },
        { value: 1, name: "Blu-ray" },
        { value: 3, name: "Remux" },
        { value: 7, name: "Encode" },
        { value: 5, name: "HDTV/TV" },
        { value: 6, name: "DVD" },
        { value: 8, name: "CD" },
        { value: 11, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 1, name: "H.265(x265/HEVC)" },
        { value: 2, name: "H.264(x264/AVC)" },
        { value: 3, name: "VC-1" },
        { value: 5, name: "Xvid" },
        { value: 6, name: "AV1" },
        { value: 7, name: "VP8/9" },
        { value: 8, name: "AVS" },
        { value: 4, name: "MPEG-2" },
        { value: 9, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 1, name: "1080p" },
        { value: 2, name: "1080i" },
        { value: 3, name: "720p" },
        { value: 4, name: "SD" },
        { value: 5, name: "4K" },
        { value: 6, name: "8K" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 1, name: "AAC" },
        { value: 2, name: "AC3(DD)" },
        { value: 3, name: "DTS" },
        { value: 4, name: "DTS-HD MA" },
        { value: 5, name: "E-AC3(DDP)" },
        { value: 6, name: "E-AC3 Atoms(DDP Atoms)" },
        { value: 7, name: "TrueHD" },
        { value: 8, name: "TrueHD Atmos" },
        { value: 9, name: "LPCM/PCM" },
        { value: 10, name: "WAV" },
        { value: 11, name: "FLAC" },
        { value: 12, name: "APE" },
        { value: 13, name: "MP2/3" },
        { value: 14, name: "OGG" },
        { value: 15, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    a,
    n,
    i,
  ],
  userInfo: {
    ...e.userInfo,
    selectors: {
      ...e.userInfo.selectors,
      bonus: {
        selector: ["td.rowhead:contains('魔力值') + td", "td.rowhead:contains('Karma'):contains('Points') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
    donorConfig: { ...e.userInfo.donorConfig, bonusPerHourMultiplier: 1 },
  },
  levelRequirements: [
    {
      id: 1,
      name: "Peasant",
      privilege: "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能申请友情链接；不能上传字幕。",
    },
    { id: 2, name: "User", privilege: "新用户的默认级别。可以发送邀请；可匿名发布; 可对候选投反对票; 可购买邀请。" },
    {
      id: 3,
      name: "Power User",
      interval: "P4W",
      downloaded: "200GB",
      seedingBonus: 4e4,
      ratio: 1.05,
      privilege: "可以请求续种；可使用个性条。分享率低于0.95，你将自动降级。",
    },
    {
      id: 4,
      name: "Elite User",
      interval: "P8W",
      downloaded: "400GB",
      seedingBonus: 8e4,
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。分享率低于1.45，你将自动降级。",
    },
    {
      id: 5,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "800GB",
      seedingBonus: 15e4,
      ratio: 2.05,
      privilege:
        "可以查看用户列表；可以查看其它用户的种子历史(如果用户隐私等级未设置为强)。分享率低于1.95，你将自动降级。",
    },
    {
      id: 6,
      name: "Insane User",
      interval: "P25W",
      downloaded: "1600GB",
      seedingBonus: 25e4,
      ratio: 2.55,
      privilege: "可以查看普通日志。分享率低于2.45，你将自动降级。",
    },
    {
      id: 7,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "3200GB",
      seedingBonus: 4e5,
      ratio: 3.05,
      privilege:
        "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。分享率低于2.95，你将自动降级。",
    },
    {
      id: 8,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "6400GB",
      seedingBonus: 6e5,
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。分享率低于3.45，你将自动降级。",
    },
    {
      id: 9,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "12800GB",
      seedingBonus: 8e5,
      ratio: 4.05,
      privilege: "同上。分享率低于3.95，你将自动降级。",
    },
    {
      id: 10,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "16000GB",
      seedingBonus: 1e6,
      ratio: 4.55,
      privilege: "同上。分享率低于4.45，你将自动降级。",
    },
    {
      id: 100,
      groupType: "vip",
      name: "贵宾(VIP)",
      privilege: "和Nexus Master拥有相同权限并被认为是精英成员。免除自动降级。",
    },
    { id: 200, groupType: "manager", name: "养老族(Retiree)", privilege: "退休后的管理组成员。" },
    {
      id: 201,
      groupType: "manager",
      name: "发布员(Uploader)",
      privilege: "专注的发布者。免除自动降级；可以查看匿名用户的真实身份。",
    },
    {
      id: 202,
      groupType: "manager",
      name: "总版主(Moderator)",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息。不能管理友情链接、最近消息、论坛版块；不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 203,
      groupType: "manager",
      name: "管理员(Administrator)",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 204,
      groupType: "manager",
      name: "维护开发员(Sysop)",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    { id: 205, groupType: "manager", name: "主管(Staff Leader)", privilege: "网站主管，可以做任何事。" },
  ],
};
export { E as siteMetadata };
