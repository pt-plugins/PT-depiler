import {
  SchemaMetadata as r,
  CategorySpstate as s,
  CategoryIncldead as n,
  CategoryInclbookmarked as l,
} from "../schemas/NexusPHP-BNC4SlPA.js";
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
const o = { selector: ['a[href*="download.php?id="]'], attr: "href" };
function i(e, t) {
  return !e || e.classList.contains(t) ? e : i(e.parentNode, t);
}
const V = {
  ...r,
  version: 1,
  id: "haidan",
  name: "海胆",
  aka: ["海胆之家", "HaiDan"],
  tags: ["电影", "电视剧", "影视", "综合"],
  timezoneOffset: "+0800",
  collaborator: ["rsj", "zhuweitung"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://jjj.unvqna.pp/"],
  legacyUrls: ["uggcf://jjj.unvqna.ivqrb/"],
  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "Documentaries(纪录片)", value: 404 },
        { name: "Movies(电影)", value: 401 },
        { name: "Animations(动画片)", value: 405 },
        { name: "TV Series(电视剧)", value: 402 },
        { name: "TV Shows(综艺)", value: 403 },
        { name: "Music Videos(MV)", value: 406 },
        { name: "Sports(体育)", value: 407 },
        { name: "Misc(其他)", value: 409 },
        { name: "HQ Audio(音乐)", value: 408 },
      ],
      cross: { mode: "comma" },
    },
    { ...s, cross: { mode: "comma" } },
    n,
    l,
  ],
  search: {
    ...r.search,
    selectors: {
      ...r.search.selectors,
      rows: { selector: ".torrent_item" },
      link: o,
      url: {
        ...o,
        filters: [
          { name: "querystring", args: ["id"] },
          { name: "prepend", args: ["/details.php?id="] },
        ],
      },
      id: { ...o, filters: [{ name: "querystring", args: ["id"] }] },
      title: {
        selector: ":self",
        elementProcess: (e) =>
          i(e, "group_content").querySelector(".name_col > .name > .video_name")?.textContent?.trim() || "",
      },
      subTitle: { selector: [".torrent_name_col a[href*='details.php']"] },
      time: { selector: [".time_col span[title]"], attr: "title", filters: [{ name: "parseValidTimeString" }] },
      size: { selector: ".video_size", filters: [{ name: "parseSize" }] },
      author: { selector: [".time_col>i, .time_col>.username-center"] },
      seeders: { selector: ".seeder_col" },
      leechers: { selector: ".leecher_col" },
      completed: { selector: ".snatched_col" },
      tags: [
        ...r.search.selectors.tags,
        { name: "官方", selector: "label:contains('官方')", color: "#ff0000" },
        { name: "中字", selector: "label:contains('中字')", color: "#0000ff" },
        { name: "外语", selector: "label:contains('外语')", color: "#004040" },
        { name: "禁转", selector: "label:contains('禁转')", color: "#800040" },
        { name: "DIY", selector: "label:contains('DIY')", color: "#0080ff" },
        { name: "国语", selector: "label:contains('国语')", color: "#8000ff" },
        { name: "原盘", selector: "label:contains('原盘')", color: "#0080c0" },
        { name: "粤语", selector: "label:contains('粤语')", color: "#00ff00" },
        { name: "HDR", selector: "label:contains('HDR')", color: "#d4ff00" },
        { name: "杜比视界", selector: "label:contains('杜比视界')", color: "#e20ae6" },
      ],
    },
  },
  userInfo: {
    ...a,
    selectors: {
      ...a.selectors,
      levelId: {
        selector: ["td.rowhead:contains('等级') + td > img"],
        attr: "src",
        filters: [
          (e) => {
            const t = e.match(/\/class\/(\d+)\.gif/);
            return t ? parseInt(t[1]) - 1 : 0;
          },
        ],
      },
      levelName: {
        selector: ["td.rowhead:contains('等级') + td > img"],
        attr: "title",
        filters: [(e) => (e && e.includes(")") ? e.split(")")[1].trim() : e || "")],
      },
      seedingBonus: {
        selector: ["td.rowhead:contains('等级积分') + td"],
        filters: [(e) => ((e = e.replace(/[,\s]/g, "")), parseFloat(e.split("[")[0]))],
      },
    },
  },
  levelRequirements: [
    { id: 0, name: "User", privilege: "新用户的默认级别，仅能下载免费种子，可以直接发布种子" },
    {
      id: 1,
      name: "Power User",
      interval: "P2W",
      downloaded: "50GB",
      ratio: 1,
      seedingBonus: 100,
      privilege: "允许购买邀请码，可以直接发布种子，可以删除自己上传的字幕。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1,
      seedingBonus: 200,
      privilege: "Elite User允许发送邀请码，并拥有低于该等级以下权限。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P8W",
      downloaded: "50GB",
      ratio: 1,
      seedingBonus: 500,
      privilege: "查看种子结构，并拥有低于该等级以下权限。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P16W",
      downloaded: "50GB",
      ratio: 1,
      seedingBonus: 1e3,
      privilege: "发布趣味盒，并拥有低于该等级以下权限。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P28W",
      downloaded: "50GB",
      ratio: 1,
      seedingBonus: 2e3,
      isKept: !0,
      privilege: "Veteran User永远保留账号，并拥有低于该等级以下权限。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P32W",
      downloaded: "50GB",
      ratio: 1,
      seedingBonus: 5e3,
      isKept: !0,
      privilege: "查看日志权限，并拥有低于该等级以下权限。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P40W",
      downloaded: "50GB",
      ratio: 1,
      seedingBonus: 8e3,
      isKept: !0,
      privilege: "查看排行榜，并拥有低于该等级以下权限",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P52W",
      downloaded: "50GB",
      ratio: 1,
      seedingBonus: 1e4,
      isKept: !0,
      privilege: "允许匿名，拥有发布主题推荐权限，并拥有低于该等级以下权限",
    },
  ],
};
export { V as siteMetadata };
