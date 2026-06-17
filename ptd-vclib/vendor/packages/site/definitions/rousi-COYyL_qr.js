import {
  CategoryIncldead as e,
  CategorySpstate as a,
  CategoryInclbookmarked as r,
  SchemaMetadata as o,
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
  ...o,
  version: 1,
  id: "rousi",
  name: "Rousi",
  aka: ["肉丝"],
  description: "你也喜欢 Rousi 对吧？",
  tags: ["影视", "综合", "成人"],
  collaborator: ["CarlJia"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://ebhfv.mvc/"],
  favicon: "./rousi.ico",
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 401, name: "Movies(电影)" },
        { value: 402, name: "TV Series(电视剧)" },
        { value: 403, name: "TV Shows(综艺)" },
        { value: 407, name: "Sports(体育、竞技、武术及相关)" },
        { value: 404, name: "Documentaries(纪录片)" },
        { value: 410, name: "Games(游戏及相关)" },
        { value: 406, name: "Music(音乐、专辑、MV、演唱会)" },
        { value: 419, name: "Art(舞蹈、歌剧、戏曲、相声、评书等)" },
        { value: 411, name: "Science(科学、知识、技能)" },
        { value: 412, name: "School(应试、考级、初中以上教育)" },
        { value: 413, name: "Book(书籍、杂志、报刊、有声书)" },
        { value: 414, name: "Code(IT技术、建模、编程、信息技术、大数据、人工智能)" },
        { value: 405, name: "Animations(3D动画、2.5次元)" },
        { value: 415, name: "ACGN(二次元、漫画、动漫)" },
        { value: 416, name: "Baby(婴幼、儿童、早教、小学及相关)" },
        { value: 417, name: "Resource(图片、文档、素材、模板)" },
        { value: 418, name: "Software(软件、系统、程序、APP等)" },
        { value: 409, name: "Other(其它，确认上边无分类)" },
      ],
      cross: { mode: "append" },
    },
    e,
    a,
    r,
    {
      name: "审核状态：",
      key: "audit",
      options: [
        { value: "", name: "全部" },
        { value: 0, name: "未审" },
        { value: 1, name: "通过" },
        { value: 2, name: "拒绝" },
      ],
      cross: !1,
    },
  ],
  searchEntry: {
    area_torrents: { name: "综合", requestConfig: { url: "/torrents.php" } },
    area_special: { name: "9kg", enabled: !1, requestConfig: { url: "/special.php" } },
  },
  levelRequirements: [
    { id: 1, name: "User", privilege: "新用户的默认级别" },
    {
      id: 2,
      groupType: "user",
      name: "Power User",
      privilege: "首次升级至此等级的用户没有任何邀请名额",
      seedingBonus: 4e4,
      ratio: 1.05,
      interval: "P4W",
      downloaded: "50GB",
    },
    {
      id: 3,
      groupType: "user",
      name: "Elite User",
      privilege: "首次升级至此等级的用户将获得1个邀请名额",
      seedingBonus: 8e4,
      ratio: 1.55,
      interval: "P8W",
      downloaded: "120GB",
    },
    {
      id: 4,
      groupType: "user",
      name: "Crazy User",
      privilege: "首次升级至此等级的用户将获得2个邀请名额",
      seedingBonus: 1e6,
      ratio: 2.05,
      interval: "P15W",
      downloaded: "1024GB",
    },
    {
      id: 5,
      groupType: "user",
      name: "Insane User",
      privilege: "首次升级至此等级的用户将获得5个邀请名额",
      seedingBonus: 2e6,
      ratio: 2.55,
      interval: "P25W",
      downloaded: "2048GB",
    },
    {
      id: 6,
      groupType: "user",
      name: "Veteran User",
      privilege: "首次升级至此等级的用户将获得10个邀请名额",
      seedingBonus: 3e6,
      ratio: 3.05,
      interval: "P40W",
      downloaded: "5120GB",
    },
    {
      id: 7,
      groupType: "user",
      name: "Extreme User",
      privilege: "首次升级至此等级的用户将获得10个邀请名额",
      seedingBonus: 5e6,
      ratio: 3.55,
      interval: "P60W",
      downloaded: "10240GB",
    },
    {
      id: 8,
      groupType: "user",
      name: "Ultimate User",
      privilege: "首次升级至此等级的用户将获得10个邀请名额",
      seedingBonus: 8e6,
      ratio: 4.05,
      interval: "P80W",
      downloaded: "20480GB",
    },
    {
      id: 9,
      groupType: "user",
      name: "Nexus Master",
      privilege: "首次升级至此等级的用户将获得10个邀请名额",
      seedingBonus: 1e7,
      ratio: 4.55,
      interval: "P100W",
      downloaded: "30720GB",
    },
  ],
};
export { S as siteMetadata };
