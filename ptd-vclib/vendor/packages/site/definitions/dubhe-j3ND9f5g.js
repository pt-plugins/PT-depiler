import { SchemaMetadata as e } from "../schemas/NexusPHP-BNC4SlPA.js";
import { userInfoWithInvitesInUserDetailsPage as a } from "./kunlun-CkdsklM5.js";
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
const y = {
  ...e,
  version: 1,
  id: "dubhe",
  name: "天枢",
  aka: ["Dubhe"],
  description: "七星图，始于天枢",
  tags: ["综合", "影视"],
  timezoneOffset: "+0800",
  favicon: "./dubhe.ico",
  type: "private",
  schema: "NexusPHP",
  urls: ["https://dubhe.site/"],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影", value: 401 },
        { name: "电视剧", value: 402 },
        { name: "综艺", value: 403 },
        { name: "动漫", value: 404 },
        { name: "纪录片", value: 405 },
        { name: "体育", value: 406 },
        { name: "MV", value: 407 },
        { name: "音轨", value: 408 },
        { name: "其他", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "视频类",
      key: "medium",
      options: [
        { name: "UHD Blu-ray", value: 11 },
        { name: "Blu-ray", value: 1 },
        { name: "Remux", value: 3 },
        { name: "WEB-DL", value: 10 },
        { name: "Encode", value: 6 },
        { name: "HDTV", value: 5 },
        { name: "MiniBD", value: 4 },
        { name: "HD DVD", value: 7 },
        { name: "DVD", value: 8 },
        { name: "Other", value: 12 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "4320P/8K/FUHD", value: 7 },
        { name: "2160P/4K/UHD", value: 8 },
        { name: "1080p/1080i/FHD", value: 1 },
        { name: "720p/720i/HD", value: 6 },
        { name: "360p/360i/SD", value: 5 },
        { name: "Other", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频类",
      key: "audiocodec",
      options: [
        { name: "DTS-HD MA", value: 1 },
        { name: "TrueHD Atmos", value: 2 },
        { name: "DTS-HD", value: 3 },
        { name: "TrueHD", value: 4 },
        { name: "DTS", value: 5 },
        { name: "AC-3", value: 6 },
        { name: "AAC", value: 7 },
        { name: "FLAC", value: 8 },
        { name: "APE", value: 9 },
        { name: "Other", value: 10 },
      ],
      cross: { mode: "append" },
    },
  ],
  userInfo: a,
  levelRequirements: [
    { id: 0, name: "User", privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。" },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 4e4,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以发送邀请；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "300GB",
      ratio: 2.55,
      seedingBonus: 8e4,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 3.55,
      seedingBonus: 2e5,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "750GB",
      ratio: 5,
      seedingBonus: 4e5,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "1TB",
      ratio: 6,
      seedingBonus: 7e5,
      isKept: !0,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1.5TB",
      ratio: 7,
      seedingBonus: 1e6,
      isKept: !0,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "3TB",
      ratio: 8,
      seedingBonus: 12e5,
      isKept: !0,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "4TB",
      ratio: 9,
      seedingBonus: 15e5,
      isKept: !0,
      privilege: "得到十个邀请名额。",
    },
  ],
};
export { y as siteMetadata };
