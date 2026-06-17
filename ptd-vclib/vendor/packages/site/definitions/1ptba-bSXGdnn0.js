import {
  CategoryIncldead as e,
  CategorySpstate as a,
  CategoryInclbookmarked as i,
  SchemaMetadata as r,
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
const M = {
  ...r,
  version: 1,
  id: "1ptba",
  name: "1PTBar",
  aka: ["壹PT"],
  description: "分享互联，收获快乐",
  tags: ["综合", "影视"],
  timezoneOffset: "+0800",
  collaborator: ["zhuweitung"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://1cgon.pbz/"],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影 (Movie)", value: 401 },
        { name: "电视影剧 (TV Series)", value: 402 },
        { name: "电视综艺 (TV Shows)", value: 403 },
        { name: "记录教育 (Discovery)", value: 404 },
        { name: "卡通动漫 (Cartoon)", value: 405 },
        { name: "音乐短片/演唱会 (Music Videos)", value: 406 },
        { name: "体育赛事 (Sports)", value: 407 },
        { name: "高品质音频 (HQ Audio)", value: 408 },
        { name: "软件 (Software)", value: 410 },
        { name: "电子游戏 (Games)", value: 411 },
        { name: "电子书 (eBook)", value: 412 },
        { name: "其他 (Misc)", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Track", value: 9 },
        { name: "CD", value: 8 },
        { name: "DVDR", value: 6 },
        { name: "HDTV", value: 5 },
        { name: "MiniBD", value: 4 },
        { name: "Encode", value: 7 },
        { name: "Remux", value: 3 },
        { name: "HD DVD", value: 2 },
        { name: "Blu-ray(原盘)", value: 1 },
        { name: "UHD Blu-ray", value: 16 },
        { name: "UHD Blu-ray/DIY", value: 17 },
        { name: "Blu-ray/DIY", value: 19 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "HDS", value: 1 },
        { name: "CHD", value: 2 },
        { name: "MySiLU", value: 3 },
        { name: "WiKi", value: 4 },
        { name: "Other", value: 5 },
        { name: "1PTBA", value: 20 },
      ],
      cross: { mode: "append" },
    },
    e,
    a,
    i,
  ],
  levelRequirements: [
    { id: 0, name: "User", privilege: "新用户的默认级别；只能在每周六中午12点至每周日晚上11点59分发布种子" },
    {
      id: 1,
      name: "Power User",
      interval: "P5W",
      downloaded: "50GB",
      seedingBonus: 4e4,
      ratio: 1.3,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      seedingBonus: 8e4,
      ratio: 1.9,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      seedingBonus: 15e4,
      ratio: 2.3,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P30W",
      downloaded: "500GB",
      seedingBonus: 25e4,
      ratio: 2.7,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P60W",
      downloaded: "1024GB",
      seedingBonus: 4e5,
      ratio: 3.2,
      isKept: !0,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P90W",
      downloaded: "2048GB",
      seedingBonus: 6e5,
      ratio: 3.7,
      isKept: !0,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P120W",
      downloaded: "4096GB",
      seedingBonus: 8e5,
      ratio: 4.2,
      isKept: !0,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P150W",
      downloaded: "10240GB",
      seedingBonus: 1e6,
      ratio: 5.2,
      isKept: !0,
      privilege: "得到十个邀请名额。",
    },
  ],
};
export { M as siteMetadata };
