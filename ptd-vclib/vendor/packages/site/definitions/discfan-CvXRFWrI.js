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
const W = {
  ...e,
  version: 1,
  id: "discfan",
  name: "DiscFan",
  aka: ["碟粉"],
  description: "碟粉",
  tags: ["影视", "综合"],
  collaborator: ["zxb0303"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://qvfpsna.arg/"],
  legacyUrls: ["https://pt.gztown.net/"],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 401, name: "电影 - 中国大陆" },
        { value: 404, name: "电影 - 中国香港特别行政区" },
        { value: 405, name: "电影 - 中国台湾省" },
        { value: 402, name: "电影 - 泰国" },
        { value: 403, name: "电影 - 日本" },
        { value: 406, name: "电影 - 韩国" },
        { value: 410, name: "电影 - 世界" },
        { value: 411, name: "剧集" },
        { value: 414, name: "音乐" },
        { value: 413, name: "纪录" },
        { value: 416, name: "综艺" },
        { value: 417, name: "体育" },
        { value: 419, name: "动漫" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "来源",
      key: "source",
      options: [
        { value: 1, name: "HDTV" },
        { value: 2, name: "4K UltraHD" },
        { value: 3, name: "Blu-ray Disc" },
        { value: 4, name: "DVD" },
        { value: 5, name: "SDTV" },
        { value: 6, name: "VCD" },
        { value: 7, name: "LD" },
        { value: 8, name: "VHS" },
        { value: 9, name: "Web-DL" },
        { value: 10, name: "Rip" },
        { value: 11, name: "Book" },
        { value: 131, name: "Remux" },
      ],
      cross: { mode: "append" },
    },
  ],
  levelRequirements: [
    {
      id: 1,
      name: "凡人",
      nameAka: ["User"],
      privilege:
        "新用户的默认级别，拥有下载权限。不能直接发布资源，但可添加候选区。可以上传字幕但不能删除自己上传的字幕。可在部分论坛板块发帖和留言。可以在求种区求种。可以更新外部信息如IMDb信息。",
    },
    {
      id: 2,
      name: "炼气",
      nameAka: ["Power User"],
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 4e4,
      privilege:
        "首次升级获得1个永久邀请名额。可以直接发布种子资源。可以删除自己上传的字幕。允许使用个性条。可以请求续种。可以查看和搜索用户列表。可以查看NFO文件。可以查看排行榜。可以查看他人种子历史（未设为强隐私时）。",
    },
    {
      id: 3,
      name: "筑基",
      nameAka: ["Elite User"],
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 8e4,
      privilege:
        "首次升级获得2个永久邀请名额。允许在魔力值中心购买邀请。允许查看邀请。筑基(Elite User)及以上等级用户在封存账号后不会被删除帐号。",
    },
    {
      id: 4,
      name: "结丹",
      nameAka: ["Crazy User"],
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 15e4,
      privilege: "首次升级获得3个永久邀请名额。可以查看特别区种子。",
    },
    {
      id: 5,
      name: "元婴",
      nameAka: ["Insane User"],
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 25e4,
      privilege: "首次升级获得4个永久邀请名额。可以查看一般日志，不能查看机密日志。",
    },
    {
      id: 6,
      name: "化神",
      nameAka: ["Veteran User"],
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 4e5,
      isKept: !0,
      privilege:
        "首次升级获得6个永久邀请名额。可以查看他人的评论和帖子历史记录。化神(Veteran User)及以上等级用户会永远保留帐号。",
    },
    {
      id: 7,
      name: "炼虚",
      nameAka: ["Extreme User"],
      interval: "P60W",
      downloaded: "1024GB",
      ratio: 3.55,
      seedingBonus: 6e5,
      isKept: !0,
      privilege: "首次升级获得8个永久邀请名额。",
    },
    {
      id: 8,
      name: "合体",
      nameAka: ["Ultimate User"],
      interval: "P80W",
      downloaded: "1536GB",
      ratio: 4.05,
      seedingBonus: 8e5,
      isKept: !0,
      privilege: "首次升级获得10个永久邀请名额。可以查看种子文件结构。",
    },
    {
      id: 9,
      name: "大乘",
      nameAka: ["Nexus Master"],
      interval: "P100W",
      downloaded: "3072GB",
      ratio: 4.55,
      seedingBonus: 1e6,
      isKept: !0,
      privilege: "首次升级获得20个永久邀请名额。普通用户可以达到的最高级别。",
    },
  ],
};
export { W as siteMetadata };
