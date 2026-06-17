import {
  CategoryIncldead as e,
  CategorySpstate as a,
  CategoryInclbookmarked as n,
  SchemaMetadata as m,
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
const S = {
  ...m,
  version: 1,
  id: "ptcafe",
  name: "咖啡",
  aka: ["PTCafe", "咖啡PT"],
  description: "热爱生活·享受咖啡",
  timezoneOffset: "+0800",
  favicon: "./ptcafe.ico",
  collaborator: ["yanleichang"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://cgpnsr.pyho/"],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影", value: 401 },
        { name: "剧集", value: 402 },
        { name: "综艺", value: 403 },
        { name: "纪录", value: 404 },
        { name: "动漫", value: 405 },
        { name: "演唱", value: 406 },
        { name: "体育", value: 407 },
        { name: "音乐", value: 408 },
        { name: "其他", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "视频类",
      key: "medium",
      options: [
        { name: "UHD Blu-ray 原盘", value: 1 },
        { name: "UHD Blu-ray DIY", value: 2 },
        { name: "UHD Remux", value: 3 },
        { name: "Blu-ray 原盘", value: 4 },
        { name: "Blu-ray DIY", value: 5 },
        { name: "Remux", value: 6 },
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
        { name: "DTS-HDMA:X 7.1", value: 1 },
        { name: "DTS-HDMA", value: 2 },
        { name: "DTS-HDHR", value: 3 },
        { name: "DTS-HD", value: 4 },
        { name: "DTS-X", value: 5 },
        { name: "LPCM", value: 6 },
        { name: "AC3", value: 7 },
        { name: "Atmos", value: 8 },
        { name: "AAC", value: 9 },
        { name: "TrueHD", value: 10 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "ADE", value: 1 },
        { name: "ADWeb", value: 2 },
        { name: "Audies", value: 3 },
        { name: "beAst", value: 4 },
        { name: "BeiTai", value: 5 },
        { name: "BeyondHD", value: 6 },
        { name: "BtsTV", value: 7 },
        { name: "CafeTV", value: 8 },
        { name: "CafeWEB", value: 9 },
        { name: "CHDBits", value: 10 },
        { name: "CHDWEB", value: 11 },
        { name: "CMCT", value: 12 },
        { name: "DJWEB", value: 13 },
        { name: "FRDS", value: 14 },
        { name: "HDCTV", value: 15 },
        { name: "HDH", value: 16 },
        { name: "HDHome", value: 17 },
        { name: "HDSky", value: 18 },
        { name: "HDSWEB", value: 19 },
        { name: "HHWEB", value: 20 },
        { name: "MTeam", value: 21 },
        { name: "MWeb", value: 22 },
        { name: "OurBits", value: 23 },
        { name: "OurTV", value: 24 },
        { name: "PTCafe", value: 25 },
        { name: "PTerWEB", value: 26 },
        { name: "QHstudIo", value: 27 },
        { name: "TTG", value: 28 },
        { name: "WiKi", value: 29 },
        { name: "Other", value: 30 },
      ],
      cross: { mode: "append" },
    },
    e,
    a,
    n,
  ],
  officialGroupPattern: [/CafeWEB|CafeTV|DIY@PTCafe/i],
  levelRequirements: [
    { id: 1, name: "User 咖啡新人", privilege: "新用户的默认级别。不能直接发布种子，需要在候选区发布。" },
    {
      id: 2,
      name: "Power User 速溶小白",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 4e4,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 3,
      name: "Elite User 风味达人",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 8e4,
      privilege: "此级别及以上用户封存账号后不会被删除。",
    },
    {
      id: 4,
      name: "Crazy User 资深玩家",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 15e4,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 5,
      name: "Insane User 专业老饕",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 25e4,
      privilege: "可以查看普通日志。",
    },
    {
      id: 6,
      name: "Veteran User 烘焙高手",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 4e5,
      isKept: !0,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。此级别及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Extreme User 精英玩家",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingBonus: 6e5,
      isKept: !0,
      privilege: "可以更新过期的外部信息。",
    },
    {
      id: 8,
      name: "Ultimate User 咖啡巨星",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingBonus: 8e5,
      isKept: !0,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 9,
      name: "Nexus Master 咖啡王者",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingBonus: 1e6,
      isKept: !0,
      privilege: "得到十个邀请名额。",
    },
  ],
};
export { S as siteMetadata };
