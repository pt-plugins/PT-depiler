import {
  SchemaMetadata as e,
  CategoryIncldead as a,
  CategorySpstate as o,
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
const I = {
  ...e,
  version: 1,
  id: "azusa",
  name: "梓喵",
  aka: ["Azusa"],
  description: [
    "主打二次元（非视频类）相关内容，包括漫画、轻小说、GalGame、同人、CG以及二次元音乐",
    "2025.7.12应站点公告要求取消用户信息获取",
  ],
  tags: ["漫画", "轻小说", "Galgame", "画集"],
  timezoneOffset: "+0800",
  collaborator: ["zhuweitung"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://nmhfn.jvxv/"],
  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "游戏", value: 404 },
        { name: "漫画", value: 402 },
        { name: "轻小说", value: 403 },
        { name: "CG", value: 407 },
        { name: "音乐", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "地区",
      key: "source",
      options: [
        { name: "欧美", value: 1 },
        { name: "韩国", value: 2 },
        { name: "大陆", value: 3 },
        { name: "香港", value: 4 },
        { name: "台湾", value: 5 },
        { name: "日本", value: 6 },
        { name: "其他", value: 7 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "来源",
      key: "medium",
      options: [
        { name: "东立电子", value: 16 },
        { name: "BW", value: 17 },
        { name: "TX", value: 18 },
        { name: "bili境外", value: 19 },
        { name: "bili", value: 20 },
        { name: "扫图", value: 21 },
        { name: "汉化", value: 22 },
        { name: "kobo", value: 23 },
        { name: "pubu", value: 24 },
        { name: "steam", value: 26 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分类",
      key: "codec",
      options: [
        { name: "杂志", value: 1 },
        { name: "耽美", value: 2 },
        { name: "百合", value: 3 },
        { name: "少女", value: 4 },
        { name: "少年", value: 5 },
        { name: "青年", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "状态",
      key: "standard",
      options: [
        { name: "未完", value: 3 },
        { name: "完结", value: 4 },
      ],
      cross: { mode: "append" },
    },
    a,
    o,
    n,
  ],
  search: {
    ...e.search,
    selectors: {
      ...e.search.selectors,
      seeders: { selector: "a[href*='seeders']" },
      leechers: { selector: "a[href*='leechers']" },
      completed: { selector: "a[href*='viewsnatches']" },
      comments: { selector: "a[href*='comments']" },
      tags: [
        ...e.search.selectors.tags,
        { name: "条漫", selector: "span:contains('条漫')", color: "#1892EC" },
        { name: "自购", selector: "span:contains('自购')", color: "#9400D3" },
        { name: "电子版", selector: "span:contains('电子版')", color: "#732E67" },
        { name: "官方中字", selector: "span:contains('官方中字')", color: "#22DDE3" },
        { name: "画集", selector: "span:contains('画集')", color: "#16EA19" },
        { name: "生肉", selector: "span:contains('生肉')", color: "#051535" },
        { name: "禁转", selector: "span:contains('禁转')", color: "#ff0000" },
        { name: "VOCALOID", selector: "span:contains('VOCALOID')", color: "#09E8F0" },
        { name: "全存档", selector: "span:contains('全存档')", color: "#0000ff" },
        { name: "日常", selector: "span:contains('日常')", color: "#46d5ff" },
        { name: "杂志", selector: "span:contains('杂志')", color: "#ECEC18" },
        { name: "应求", selector: "span:contains('应求')", color: "#E716EA" },
        { name: "校园", selector: "span:contains('校园')", color: "#38b03f" },
      ],
    },
  },
  userInfo: void 0,
};
export { I as siteMetadata };
