import {
  CategoryIncldead as e,
  CategorySpstate as a,
  CategoryInclbookmarked as i,
  SchemaMetadata as n,
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
const D = {
  ...n,
  version: 1,
  id: "novahd",
  name: "NovaHD",
  aka: ["星云"],
  tags: ["综合"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://cg.abinuq.gbc/"],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "Movies/电影", value: 401 },
        { name: "TV Series/电视剧", value: 402 },
        { name: "TV Shows/综艺", value: 403 },
        { name: "Documentaries/记录片", value: 404 },
        { name: "Animations/动漫、动画", value: 405 },
        { name: "MV/演唱会", value: 406 },
        { name: "Sports/体育", value: 407 },
        { name: "Music/音乐", value: 409 },
        { name: "Othes/其他", value: 410 },
      ],
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "HDSky", value: 1 },
        { name: "CHD", value: 2 },
        { name: "MySiLU", value: 3 },
        { name: "WiKi", value: 4 },
        { name: "Other", value: 5 },
        { name: "FRDS", value: 6 },
        { name: "beAst", value: 4 },
        { name: "CMCT", value: 8 },
        { name: "TLF", value: 9 },
        { name: "M-Team", value: 10 },
        { name: "BeiTai", value: 11 },
        { name: "AGSV", value: 12 },
        { name: "HDHome", value: 13 },
        { name: "TTG", value: 14 },
        { name: "NHDWeb", value: 15 },
      ],
      cross: { mode: "append" },
    },
    e,
    a,
    i,
  ],
  levelRequirements: [
    { id: 0, name: "User", privilege: "" },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 3e4,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 6e4,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 8e4,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 12e4,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      isKept: !0,
      seedingBonus: 16e4,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      isKept: !0,
      seedingBonus: 2e5,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      isKept: !0,
      seedingBonus: 25e4,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      isKept: !0,
      seedingBonus: 3e5,
      privilege: "得到十个邀请名额。",
    },
  ],
};
export { D as siteMetadata };
