import { SchemaMetadata as e } from "../schemas/NexusPHP-BNC4SlPA.js";
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
const T = {
  ...e,
  version: 1,
  id: "hdtime",
  name: "HDTime",
  aka: ["时间", "时光"],
  description: "HDTime, time to forever!",
  tags: ["影视", "综合"],
  type: "private",
  schema: "NexusPHP",
  urls: ["https://hdtime.org/"],
  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 401, name: "电影" },
        { value: 424, name: "Blu-Ray原盘" },
        { value: 402, name: "剧集" },
        { value: 403, name: "综艺" },
        { value: 405, name: "动漫" },
        { value: 414, name: "软件" },
        { value: 407, name: "体育" },
        { value: 404, name: "纪录片" },
        { value: 406, name: "MV" },
        { value: 408, name: "音乐" },
        { value: 410, name: "游戏" },
        { value: 411, name: "文档" },
        { value: 409, name: "其他" },
      ],
      cross: { mode: "append" },
    },
  ],
  levelRequirements: [
    { id: 1, name: "User", nameAka: ["未烧"], privilege: "新用户的默认级别。" },
    {
      id: 2,
      name: "Power User",
      nameAka: ["感冒"],
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 4e4,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 3,
      name: "Elite User",
      nameAka: ["发热"],
      interval: "P8W",
      downloaded: "150GB",
      ratio: 1.55,
      seedingBonus: 8e4,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 4,
      name: "Crazy User",
      nameAka: ["低烧"],
      interval: "P15W",
      downloaded: "500GB",
      ratio: 2.05,
      seedingBonus: 15e4,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 5,
      name: "Insane User",
      nameAka: ["中烧"],
      interval: "P25W",
      downloaded: "750GB",
      ratio: 2.55,
      seedingBonus: 25e4,
      privilege: "可以查看普通日志。",
    },
    {
      id: 6,
      name: "Veteran User",
      nameAka: ["高烧"],
      interval: "P40W",
      downloaded: "1.5TB",
      ratio: 3.05,
      seedingBonus: 4e5,
      isKept: !0,
      privilege:
        "免除增量考核；得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Extreme User",
      nameAka: ["烧糊涂"],
      interval: "P60W",
      downloaded: "3TB",
      ratio: 3.55,
      seedingBonus: 6e5,
      isKept: !0,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 8,
      name: "Ultimate User",
      nameAka: ["走火入魔"],
      interval: "P80W",
      downloaded: "5TB",
      ratio: 4.05,
      seedingBonus: 8e5,
      isKept: !0,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 9,
      name: "HDtime Master",
      nameAka: ["骨灰"],
      interval: "P100W",
      downloaded: "10TB",
      ratio: 4.55,
      seedingBonus: 1e6,
      isKept: !0,
      privilege: "得到十个邀请名额。",
    },
  ],
};
export { T as siteMetadata };
