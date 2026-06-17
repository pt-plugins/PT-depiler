import { E as e } from "../types/torrent-BvvY2NbA.js";
import {
  SchemaMetadata as r,
  CategoryIncldead as o,
  CategorySpstate as i,
  CategoryInclbookmarked as n,
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
  id: "tlfbits",
  name: "TLFBits",
  aka: ["TLF Bits", "The Last Fantasy", "TLF", "吐鲁番"],
  description: "水管虽小，坚持则大！宛如TLF，虽弱却奢华",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",
  collaborator: ["waldens", "zxb0303"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://cg.rnfgtnzr.bet/"],
  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 438, name: "电影 (Movie)" },
        { value: 440, name: "电视剧(TV series)" },
        { value: 441, name: "综艺 (TV Show)" },
        { value: 442, name: "动漫 (Anime)" },
        { value: 443, name: "纪录片 (Documentary)" },
        { value: 444, name: "体育 (Sport)" },
        { value: 445, name: "音乐视频 (Music Video)" },
        { value: 446, name: "音乐(Music)" },
      ],
      cross: { mode: "append" },
    },
    o,
    i,
    n,
  ],
  officialGroupPattern: [/-tlf/i],
  search: {
    ...r.search,
    selectors: {
      ...r.search.selectors,
      status: {
        text: e.unknown,
        selector: ["td[bgcolor='#bce672']", "td[bgcolor='#44cef6']", "td[bgcolor='#d0d0d0']"],
        case: {
          "td[bgcolor='#bce672']": e.seeding,
          "td[bgcolor='#44cef6']": e.downloading,
          "td[bgcolor='#d0d0d0']": e.completed,
        },
      },
      progress: {
        selector: ["td[bgcolor]"],
        filters: [
          (a) => {
            const t = a.split("%")[0];
            return t ? parseFloat(t) : 0;
          },
        ],
      },
    },
  },
  levelRequirements: [
    {
      id: 0,
      name: "Peasant",
      privilege:
        "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能发表趣味盒内容；不能申请友情链接；不能上传字幕。",
    },
    { id: 1, name: "User", privilege: "新用户的默认级别。" },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.5,
      privilege: "可以查看NFO文档；可以请求续种； 查看种子结构; 可以删除自己上传的字幕。",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 2.55,
      privilege:
        "可以查看用户的种子历史记录，如下载种子的历史记录（只有用户的隐私等级没有设为’强‘时才生效）; 可以查看高级会员区 . Elite User +论坛。",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 3.05,
      privilege: "可以查看排行榜；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 4.55,
      privilege: "可以发送邀请；查看一般日志，不能查看机密日志; Insane User及以上等级的账号如果在封存后将永远保留。",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 5.05,
      isKept: !0,
      privilege:
        '得到一个邀请名额；可以查看其它用户的评论、帖子历史(如果用户隐私等级未设置为"强"); Veteran User及以上等级的账号将永远保留。',
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P45W",
      downloaded: "1TB",
      ratio: 6.55,
      isKept: !0,
      privilege: "得到三个邀请名额；可以更新过期的外部信息。",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P50W",
      downloaded: "1.5TB",
      ratio: 7.05,
      isKept: !0,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P55W",
      downloaded: "3TB",
      ratio: 8.55,
      isKept: !0,
      privilege: "得到十个邀请名额。",
    },
  ],
};
export { M as siteMetadata };
