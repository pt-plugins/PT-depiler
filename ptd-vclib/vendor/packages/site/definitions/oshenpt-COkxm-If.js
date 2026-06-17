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
  id: "oshenpt",
  name: "OshenPT",
  aka: ["奥申"],
  description: "我为人人，人人为我，只为分享不为盈利",
  tags: ["综合", "音乐"],
  timezoneOffset: "+0800",
  type: "private",
  schema: "NexusPHP",
  collaborator: ["AllenPu"],
  urls: ["https://www.oshen.win/"],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "Movies/电影", value: 401 },
        { name: "Documentary/纪录片", value: 404 },
        { name: "Anime/动漫", value: 405 },
        { name: "TV Series/剧集", value: 402 },
        { name: "TV Shows/综艺", value: 403 },
        { name: "MusicVideo/音乐MV", value: 406 },
        { name: "Sport/运体", value: 407 },
        { name: "Misc/音乐", value: 409 },
        { name: "HQ Audio/无损音乐", value: 408 },
        { name: "Games/游戏", value: 410 },
      ],
      cross: { mode: "append" },
    },
    e,
    a,
    i,
  ],
  levelRequirements: [
    { id: 0, name: "User", nameAka: ["士兵"], privilege: "" },
    {
      id: 1,
      name: "Power User",
      nameAka: ["班长"],
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 4e4,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      nameAka: ["排长"],
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 8e4,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      nameAka: ["连长"],
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 15e4,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      nameAka: ["营长"],
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 25e4,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      nameAka: ["团长"],
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 4e5,
      isKept: !0,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      nameAka: ["旅长"],
      interval: "P60W",
      downloaded: "1024GB",
      ratio: 3.55,
      seedingBonus: 6e5,
      isKept: !0,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      nameAka: ["师长"],
      interval: "P80W",
      downloaded: "1536GB",
      ratio: 4.05,
      seedingBonus: 8e5,
      isKept: !0,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      nameAka: ["军长"],
      interval: "P100W",
      downloaded: "3072GB",
      ratio: 4.55,
      seedingBonus: 1e6,
      isKept: !0,
      privilege: "得到十个邀请名额。",
    },
  ],
};
export { M as siteMetadata };
