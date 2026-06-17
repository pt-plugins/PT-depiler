import { S as p, bD as i } from "../index-COeZNva1.js";
import { E as n } from "../types/torrent-BvvY2NbA.js";
import c, {
  SchemaMetadata as r,
  CategoryIncldead as u,
  CategorySpstate as m,
  CategoryInclbookmarked as h,
} from "../schemas/NexusPHP-BNC4SlPA.js";
import { p as d } from "../utils/filesize-D_1hx4u8.js";
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
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const x = {
  ...r,
  version: 3,
  id: "pter",
  name: "PTer",
  aka: ["PTerClub", "猫站"],
  description: "ＰＴ之友俱乐部",
  tags: ["影视", "综合"],
  type: "private",
  schema: "NexusPHP",
  urls: ["https://pterclub.net/"],
  legacyUrls: ["https://pter.club/", "https://pterclub.com/"],
  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "电影 (Movie)", value: 401 },
        { name: "电视剧 (TV Series)", value: 404 },
        { name: "动画 (Animation)", value: 403 },
        { name: "综艺 (TV Show)", value: 405 },
        { name: "音乐短片 (MV)", value: 413 },
        { name: "音乐 (Music)", value: 406 },
        { name: "舞台演出 (Stage Performance)", value: 418 },
        { name: "纪录片 (Documentary)", value: 402 },
        { name: "体育 (Sport)", value: 407 },
        { name: "电子书 (E-Book)", value: 408 },
        { name: "游戏 (Game)", value: 409 },
        { name: "软件 (Software)", value: 410 },
        { name: "学习 (Study)", value: 411 },
        { name: "其它 (Other)", value: 412 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "质量",
      key: "source",
      options: [
        { name: "UHD Discs", value: 1 },
        { name: "BD Discs", value: 2 },
        { name: "Remux", value: 3 },
        { name: "HDTV", value: 4 },
        { name: "WEB-DL", value: 5 },
        { name: "Encode", value: 6 },
        { name: "DVD Discs", value: 7 },
        { name: "FLAC", value: 8 },
        { name: "WAV", value: 9 },
        { name: "ISO", value: 10 },
        { name: "PDF", value: 11 },
        { name: "PUB", value: 12 },
        { name: "AZW", value: 13 },
        { name: "MOBI", value: 14 },
        { name: "Other", value: 15 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "地区",
      key: "team",
      options: [
        { name: "大陆 (Mainland,CHN)", value: 1 },
        { name: "香港 (HKG,CHN)", value: 2 },
        { name: "台湾 (TWN,CHN)", value: 3 },
        { name: "欧美 (Western)", value: 4 },
        { name: "韩国 (KOR)", value: 5 },
        { name: "日本 (JPN)", value: 6 },
        { name: "印度 (IND)", value: 7 },
        { name: "其它 (Other)", value: 8 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "标签",
      key: "tag",
      options: [
        { name: "禁转", value: "exclusive" },
        { name: "官方", value: "internal" },
        { name: "国语", value: "mandarin" },
        { name: "粤语", value: "cantonese" },
        { name: "DIY原盘", value: "doityourself" },
        { name: "MV母盘", value: "master" },
        { name: "中字", value: "chinesesub" },
        { name: "英字", value: "englishsub" },
        { name: "应求", value: "fillrequest" },
        { name: "自购", value: "buyitmyself" },
        { name: "原创", value: "personalrip" },
        { name: "GAL", value: "gg" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (e) => {
        const a = { requestConfig: { params: {} } };
        return (
          e.forEach((t) => {
            i(a, `requestConfig.params.tag_${t}`, "yes");
          }),
          a
        );
      },
    },
    u,
    m,
    h,
    {
      name: "审核状态？",
      key: "check",
      options: [
        { name: "全部", value: "" },
        { name: "未处理", value: "unchecked" },
        { name: "已初审", value: "prechecked" },
        { name: "已审核", value: "checked" },
        { name: "待修改", value: "need_edit" },
      ],
      cross: !1,
    },
  ],
  officialGroupPattern: [/-(Pter|.*Pter)/i],
  search: {
    ...r.search,
    advanceKeywordParams: {
      ...r.search?.advanceKeywordParams,
      douban: { requestConfigTransformer: ({ requestConfig: e }) => (i(e, "params.search_area", 5), e) },
    },
    selectors: {
      ...r.search.selectors,
      title: {
        selector: [
          "a[href*='details.php?id='][title]:first",
          "a[href*='detailsgame.php?id='][title]:first",
          'a[href^="details.php?id="]',
          'a[href^="detailsgame.php?"]',
        ],
      },
      subTitle: { selector: ["div > span:eq(0)"] },
      ext_imdb: { selector: ["a span[data-imdbid]:first"], data: "imdbid", filters: [{ name: "extImdbId" }] },
      ext_douban: { selector: ["a span[data-doubanid]:first"], data: "doubanid" },
      progress: {
        selector: ['img[class^="progbar"][style*="width"]:first'],
        elementProcess: (e) => {
          if (e.classList.contains("progbargreen")) return 100;
          if (e.classList.contains("progbarred") || e.classList.contains("progbarrest")) {
            const t = (e.getAttribute("style") || "").match(/width:([ \d.]+)%/),
              s = t && t.length >= 2 ? (parseFloat(t[1]) / 98) * 100 : 0;
            return e.classList.contains("progbarred") ? s : 100 - s;
          } else return 0;
        },
      },
      status: {
        selector: ['img[class^="progbar"][style*="width"]:first'],
        elementProcess: (e) => {
          if (e.classList.contains("progbargreen")) return n.seeding;
          if (e.classList.contains("progbarred") || e.classList.contains("progbarrest")) {
            const a = (e.getAttribute("style") || "").match(/width:([ \d.]+)%/),
              t = a && a.length >= 2 ? (parseFloat(a[1]) / 98) * 100 : 0;
            return (e.classList.contains("progbarred") ? t : 100 - t) >= 100 ? n.completed : n.inactive;
          } else return n.unknown;
        },
      },
      tags: [
        ...r.search.selectors.tags,
        { name: "Excl.", selector: "a[href*='torrents.php?tag_exclusive=yes']", color: "red" },
        { name: "官方", selector: "a[href*='torrents.php?tag_internal=yes']", color: "blue" },
        { name: "国语", selector: "a[href*='torrents.php?tag_mandarin=yes']", color: "green" },
        { name: "粤语", selector: "a[href*='torrents.php?tag_cantonese=yes']", color: "pink" },
        { name: "中字", selector: "a[href*='torrents.php?tag_chinesesub=yes']", color: "orange" },
        { name: "英字", selector: "a[href*='torrents.php?tag_englishsub=yes']", color: "teal" },
        { name: "应求", selector: "a[href*='torrents.php?tag_fillrequest=yes']", color: "deep-purple" },
        { name: "DIY原盘", selector: "a[href*='torrents.php?tag_doityourself=yes']", color: "cyan" },
        { name: "原创", selector: "a[href*='torrents.php?tag_personalrip=yes']", color: "brown" },
        { name: "自购", selector: "a[href*='torrents.php?tag_buyitmyself=yes']", color: "purple" },
        { name: "MV母盘", selector: "a[href*='torrents.php?tag_master=yes']", color: "indigo" },
      ],
    },
  },
  list: [
    { urlPattern: ["/torrents.php", "/music.php", "/officialgroup.php", "/reseed.php"] },
    {
      urlPattern: ["/detailsgame.php"],
      mergeSearchSelectors: !1,
      selectors: {
        rows: {
          selector: ".rowfollow",
          filter: (e) =>
            Array.isArray(e) ? Array.from(e).filter((a) => !!a.querySelector("a[title='点击查看此种子详细资料']")) : e,
        },
        url: {
          selector: "a[href*='download.php?id=']",
          elementProcess: (e) => {
            const a = URL.parse(e.href);
            return a ? ((a.pathname = "detailsgame.php"), a.toString()) : "";
          },
        },
        link: { selector: "a[href*='download.php?id=']", attr: "href" },
        title: { selector: "a[title=点击查看此种子详细资料]" },
        size: { selector: "div > span" },
        author: { text: "匿名", selector: "div[id^='ktorrent'] > span > a[href^='userdetails.php'] > b" },
        seeders: { selector: "div > span + span" },
        leechers: { selector: "div > span + span + span" },
        completed: { selector: "div > span + span + span + span" },
        time: {
          text: 0,
          selector: ["div[id^='ktorrent'] > #hidefl ~ span[title]", "div[id^='ktorrent'] > span > span[title]"],
          attr: "title",
        },
      },
    },
  ],
  userInfo: {
    ...r.userInfo,
    selectors: {
      ...r.userInfo.selectors,
      bonus: {
        selector: [
          "td.rowhead:contains('猫粮') + td, td.rowhead:contains('Karma Points') + td, td.rowhead:contains('貓糧') + td",
        ],
        filters: [{ name: "parseNumber" }],
      },
      trueUploaded: {
        ...r.userInfo.selectors.trueUploaded,
        filters: [
          (e) => {
            const a = e
              .replace(/,/g, "")
              .match(/((?:实际|真实)上传|(?:實際|真實)上傳|(?:Real|Actual) Uploaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return a && a.length === 3 ? d(a[2]) : 0;
          },
        ],
      },
      trueDownloaded: {
        ...r.userInfo.selectors.trueDownloaded,
        filters: [
          (e) => {
            const a = e
              .replace(/,/g, "")
              .match(/((?:实际|真实)下载|(?:實際|真實)下載|(?:Real|Actual) Downloaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return a && a.length === 3 ? d(a[2]) : 0;
          },
        ],
      },
      seeding: {
        selector: ["#info_block a[href*='getusertorrentlist.php'][href*='type=seeding']"],
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        selector: [
          "td.rowhead:contains('做种大小') + td, td.rowhead:contains('Seeding Size') + td, td.rowhead:contains('做種大小') + td",
        ],
        filters: [{ name: "parseSize" }],
      },
      messageCount: {
        ...r.userInfo.selectors.messageCount,
        selector: ["div[style*='background: red'] a[href*='messages.php']"],
      },
    },
    process: [
      ...r.userInfo.process.map((e) => ({
        ...e,
        requestConfig: {
          ...e.requestConfig,
          headers: {
            ...(e.requestConfig?.headers || {}),
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      })),
    ],
    donorConfig: { ...r.userInfo?.donorConfig, isAccountKept: !0 },
  },
  levelRequirements: [
    { id: 1, name: "伯曼猫 User", privilege: "新用户的默认级别。" },
    {
      id: 2,
      name: "加菲猫 POWER USER",
      interval: "P5W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 1e4,
      uploads: 10,
      privilege: "可以直接发布种子；可以查看邀请区；可以上传字幕和删除自己上传的字幕",
    },
    {
      id: 3,
      name: "布偶猫 ELITE USER",
      interval: "P10W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 3e4,
      uploads: 20,
      privilege: "可以请求续种",
    },
    {
      id: 4,
      name: "雪鞋猫 CRAZY USER",
      interval: "P24W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 8e4,
      uploads: 30,
      privilege: "可以查看排行榜",
    },
    {
      id: 5,
      name: "暹罗猫 INSANE USER",
      interval: "P32W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 15e4,
      uploads: 40,
      privilege: "可以查看普通日志",
    },
    {
      id: 6,
      name: "安哥拉猫 VETERAN USER",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      alternative: [
        { seedingBonus: 3e5, uploads: 50 },
        { seedingBonus: 9e5, uploads: 10 },
      ],
      privilege: "可以查看其它用户的评论、帖子历史；封存账号后，不会因不活跃原因被临时封禁",
    },
    {
      id: 7,
      name: "孟加拉猫 EXTREME USER",
      interval: "P48W",
      downloaded: "1024GB",
      ratio: 3.55,
      alternative: [
        { seedingBonus: 6e5, uploads: 60 },
        { seedingBonus: 18e5, uploads: 10 },
      ],
      privilege: "可2次无条件不活跃解封，可以查看邀请树统计，初次升级赠送1枚永久邀请码",
    },
    {
      id: 8,
      name: "山东狮子猫 ULTIMATE USER",
      interval: "P56W",
      downloaded: "1536GB",
      ratio: 4.05,
      alternative: [
        { seedingBonus: 12e5, uploads: 70 },
        { seedingBonus: 36e5, uploads: 10 },
      ],
      privilege: "追加1次无条件不活跃解封，可以查看邀请树图，初次升级赠送2枚永久邀请码",
    },
    {
      id: 9,
      name: "四川简州猫 NEXUS MASTER",
      interval: "P112W",
      downloaded: "3072GB",
      ratio: 4.55,
      alternative: [
        { seedingBonus: 24e5, uploads: 100 },
        { seedingBonus: 96e5, uploads: 10 },
      ],
      isKept: !0,
      privilege: "用户不会因不活跃原因被临时封禁，初次升级赠送3枚永久邀请码",
    },
  ],
};
class G extends c {
  async parseUserInfoForUploads(a) {
    return (
      (a.uploads = 0),
      a.name &&
        ((a.uploads += await this.getUserUploads(a.name, "prechecked")),
        (a.uploads += await this.getUserUploads(a.name, "checked"))),
      a
    );
  }
  async getUserUploads(a, t) {
    const { data: s } = await this.request({
      url: "/torrents.php",
      params: { incldead: 1, spstate: 0, inclbookmarked: 0, check: t, search: a, search_area: 3, search_mode: 3 },
      responseType: "document",
    });
    if (s) {
      const o = p("p.np-pager:first b:last", s);
      if (o.length > 0) {
        const l = o[0].innerHTML.trim().match(/\d+$/);
        return l ? parseInt(l[0], 10) : 0;
      }
    }
    return 0;
  }
}
export { G as default, x as siteMetadata };
