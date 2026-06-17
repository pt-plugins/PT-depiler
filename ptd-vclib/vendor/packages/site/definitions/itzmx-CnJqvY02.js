import {
  CategoryIncldead as e,
  CategorySpstate as r,
  CategoryInclbookmarked as i,
  SchemaMetadata as t,
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
  ...t,
  version: 1,
  id: "itzmx",
  name: "PT分享站",
  description: "PT分享",
  tags: ["综合"],
  timezoneOffset: "+0800",
  type: "private",
  schema: "NexusPHP",
  collaborator: ["AllenPu"],
  urls: ["https://pt.itzmx.com/"],
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
        { value: 406, name: "MV" },
        { value: 407, name: "体育" },
        { value: 408, name: "音轨" },
        { value: 409, name: "其它" },
      ],
      cross: { mode: "append" },
    },
    e,
    r,
    i,
  ],
  levelRequirements: [
    { id: 0, name: "User", privilege: "" },
    {
      id: 1,
      name: "Power User",
      interval: "P5W",
      downloaded: "100GB",
      ratio: 2,
      privilege:
        '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "200GB",
      ratio: 2.5,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P10W",
      downloaded: "400GB",
      ratio: 3,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P10W",
      downloaded: "800GB",
      ratio: 3.5,
      privilege: "得到1个邀请名额；可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P10W",
      downloaded: "2000GB",
      ratio: 4,
      isKept: !0,
      privilege: "得到1个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P52W",
      downloaded: "8000GB",
      ratio: 5,
      isKept: !0,
      privilege: "得到1个邀请名额；可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P104W",
      downloaded: "1.2TB",
      ratio: 5.5,
      isKept: !0,
      privilege: "得到1个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P156W",
      downloaded: "1.6TB",
      ratio: 6,
      isKept: !0,
      privilege: "得到1个邀请名额。",
    },
  ],
};
export { E as siteMetadata };
