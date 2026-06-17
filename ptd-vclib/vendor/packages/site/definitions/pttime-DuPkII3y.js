import m, { SchemaMetadata as t, CategoryIncldead as d, CategorySpstate as c } from "../schemas/NexusPHP-BNC4SlPA.js";
import { K as p } from "../index-COeZNva1.js";
import { p as g } from "../utils/filesize-D_1hx4u8.js";
import { m as u } from "../../../es-toolkit/toMerged-Be-qf92q.js";
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
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const i = { selector: ['a[href*="download.php?id="]'], attr: "href" },
  M = {
    ...t,
    version: 1,
    id: "pttime",
    name: "PTTime",
    aka: ["PT时间"],
    description: "PT时间",
    tags: ["影视", "综合", "成人"],
    timezoneOffset: "+0800",
    collaborator: ["zxb0303"],
    type: "private",
    schema: "NexusPHP",
    urls: ["uggcf://jjj.cggvzr.bet/"],
    category: [
      {
        name: "搜索入口",
        key: "#url",
        options: [
          { name: "综合", value: "/torrents.php" },
          { name: "9kg", value: "/adults.php" },
        ],
      },
      {
        name: "类别",
        key: "cat",
        options: [
          { value: 401, name: "Movies(电影)" },
          { value: 402, name: "TV Series(电视剧)" },
          { value: 403, name: "TV Shows(综艺)" },
          { value: 404, name: "Documentaries(纪录片)" },
          { value: 405, name: "Sport(体育)" },
          { value: 406, name: "Games(游戏及相关)" },
          { value: 408, name: "Music(音乐、专辑、MV、演唱会)" },
          { value: 409, name: "Art(曲艺、相声、小品、戏曲、舞蹈、歌剧、评书等)" },
          { value: 411, name: "Knowledge(社科、文学、知识、技能、书刊、有声书等)" },
          { value: 412, name: "School(应试、考级、职称、初中以上)" },
          { value: 420, name: "IT(软硬件技术&教程、大数据、人工智能）" },
          { value: 430, name: "Animate(动漫、卡通、二次元、漫画)" },
          { value: 432, name: "Baby(婴幼、儿童、早教、小学以下)" },
          { value: 440, name: "9kg-步兵(步兵/无码)" },
          { value: 441, name: "9kg-骑兵(骑兵/有码)" },
          { value: 442, name: "9kg-III(三级片、限制级电影)" },
          { value: 443, name: "9kg-H漫(动漫、漫画)" },
          { value: 444, name: "9kg-H游(游戏及相关)" },
          { value: 445, name: "9kg-H书(书籍、有声书)" },
          { value: 446, name: "9kg-H图(写真、图片、私拍、短视频）" },
          { value: 447, name: "9kg-H音(ASMR、音频、音乐)" },
          { value: 448, name: "9kg-H综(综艺、综合、剪辑、其他等)" },
          { value: 449, name: "9kg-H同(男同、女同、人妖)" },
          { value: 450, name: "Resource(素材、数据、图片、文档、模板)" },
          { value: 451, name: "Software(软件、系统、 程序、APP等)" },
          { value: 490, name: "Other(其它，确认上边分类无)" },
          { value: 500, name: "AD(广告)" },
        ],
        cross: { mode: "append" },
      },
      d,
      c,
    ],
    search: {
      ...t.search,
      selectors: {
        ...t.search.selectors,
        rows: { selector: "table.torrents:last > tbody > tr:gt(0)" },
        category: { text: "DEFAULT", selector: ["span.category"], attr: "title" },
        id: { selector: [":self"], attr: "data" },
        link: i,
        url: {
          ...i,
          filters: [
            { name: "querystring", args: ["id"] },
            { name: "prepend", args: ["/details.php?id="] },
          ],
        },
        tags: [
          { name: "Free", selector: "font.promotion.free", color: "blue" },
          { name: "2xFree", selector: "font.promotion.twoupfree", color: "green" },
          { name: "2xUp", selector: "font.promotion.twoup", color: "lime" },
          { name: "2x50%", selector: "font.promotion.twouphalfdown", color: "light-green" },
          { name: "30%", selector: "font.promotion.thirtypercent", color: "indigo" },
          { name: "50%", selector: "font.promotion.halfdown", color: "deep-orange-darken-1" },
          { name: "0流量%", selector: "font.promotion.zeroupzerodown", color: "cblue" },
          { name: "应求", selector: "span.tags.yq", color: "#065279" },
          { name: "禁转", selector: "span.tags.jz", color: "#8f0202" },
          { name: "国语", selector: "span.tags.gy", color: "#da9447" },
          { name: "粤语", selector: "span.tags.yue", color: "#af5d3e" },
          { name: "英语", selector: "span.tags.yy", color: "#6e4a3f" },
          { name: "中字", selector: "span.tags.zz", color: "#393d66" },
          { name: "DIY", selector: "span.tags.diy", color: "#81c784" },
          { name: "4K(+)", selector: "span.tags.sk", color: "#64b5f6" },
          { name: "杜比视界", selector: "span.tags.dbsj", color: "#1a237e" },
          { name: "HDR(10+)", selector: "span.tags.hdr", color: "#2196f3" },
          { name: "原盘", selector: "span.tags.dwj", color: "#1976d2" },
          { name: "其它音轨", selector: "span.tags.wy", color: "#5b0087" },
          { name: "连载", selector: "span.tags.lz", color: "#388e3c" },
          { name: "合集", selector: "span.tags.hj", color: "#1b5e20" },
          { name: "破解", selector: "span.tags.pj", color: "#455a64" },
          { name: "欧美", selector: "span.tags.oumei", color: "#1a237e" },
          { name: "全景VR", selector: "span.tags.qjvr", color: "#1976d2" },
        ],
      },
    },
    searchEntry: {
      area_torrents: { name: "综合", requestConfig: { url: "/torrents.php" } },
      area_special: { name: "9kg", enabled: !1, requestConfig: { url: "/adults.php" } },
    },
    userInfo: {
      ...t.userInfo,
      selectors: {
        ...t.userInfo.selectors,
        levelName: {
          selector: [
            "td.rowhead:contains('等级') + td > b",
            "td.rowhead:contains('等級')  + td > b",
            "td.rowhead:contains('Class')  + td > b",
          ],
          attr: "title",
        },
      },
    },
    levelRequirements: [
      { id: 0, name: "Peasant", nameAka: ["婴儿"] },
      { id: 1, name: "User", nameAka: ["幼儿园"], privilege: "新用户的默认级别。" },
      {
        id: 2,
        name: "Power User",
        nameAka: ["小学"],
        interval: "P4W",
        downloaded: "512GB",
        ratio: 1.05,
        privilege: "首次升级至此等级的用户将获得2个邀请名额。",
      },
      {
        id: 3,
        name: "Elite User",
        nameAka: ["初中"],
        interval: "P8W",
        downloaded: "2048GB",
        ratio: 1.55,
        privilege: "首次升级至此等级的用户将获得2个邀请名额。",
      },
      {
        id: 4,
        name: "Crazy User",
        nameAka: ["高中"],
        interval: "P15W",
        downloaded: "4096GB",
        ratio: 2.05,
        privilege: "首次升级至此等级的用户将获得2个邀请名额。",
      },
      {
        id: 5,
        name: "Insane User",
        nameAka: ["专科"],
        interval: "P25W",
        downloaded: "8192GB",
        ratio: 2.55,
        privilege: "首次升级至此等级的用户将获得2个邀请名额。",
      },
      {
        id: 6,
        name: "Veteran User",
        nameAka: ["本科"],
        interval: "P52W",
        downloaded: "16384GB",
        ratio: 3.05,
        privilege: "首次升级至此等级的用户将获得2个邀请名额。",
      },
      {
        id: 7,
        name: "Extreme User",
        nameAka: ["研究生"],
        interval: "P80W",
        downloaded: "25000GB",
        ratio: 3.55,
        privilege: "该级别及以上将不再有账户必须180-360天内登录一次要求。首次升级至此等级的用户将获得2个邀请名额。",
      },
      {
        id: 8,
        name: "Ultimate User",
        nameAka: ["博士生"],
        interval: "P104W",
        downloaded: "45000GB",
        ratio: 4.05,
        privilege: "首次升级至此等级的用户将获得5个邀请名额。",
      },
      {
        id: 9,
        name: "Nexus Master",
        nameAka: ["博士后"],
        interval: "P130W",
        downloaded: "90000GB",
        ratio: 4.55,
        privilege: "首次升级至此等级的用户将获得10个邀请名额。",
      },
    ],
  };
class F extends m {
  async requestUserSeedingPage(e, n = "seeding") {
    const { data: a } = await this.request({ url: "/getusertorrentlist.php", params: { userid: e, type: n } });
    return a || null;
  }
  async parseUserInfoForSeedingStatus(e) {
    const n = e.id,
      a = await this.requestUserSeedingPage(n);
    let s = { seeding: 0, seedingSize: 0 };
    if (a && a.includes("<table")) {
      const r = p(a);
      ((s.seeding =
        this.getFieldData(r, { selector: "#outer > span:nth-child(3) > b", filters: [{ name: "parseNumber" }] }) ?? 0),
        (s.seedingSize =
          this.getFieldData(r, {
            selector: "#outer > span:nth-child(4)",
            elementProcess: (o) => {
              const l = o.lastChild?.textContent?.trim() ?? "";
              return l ? g(l) : 0;
            },
          }) ?? 0));
    }
    return ((e = u(e, s, (r, o) => (typeof o > "u" ? r : o))), e);
  }
}
export { F as default, M as siteMetadata };
