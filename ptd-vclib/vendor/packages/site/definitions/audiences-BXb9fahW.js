import { bB as g, K as f, S as h, bD as v } from "../index-COeZNva1.js";
import { m as b } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { E as o } from "../types/torrent-BvvY2NbA.js";
import y, {
  SchemaMetadata as r,
  CategoryIncldead as w,
  CategorySpstate as A,
  CategoryInclbookmarked as B,
} from "../schemas/NexusPHP-BNC4SlPA.js";
import { f as p } from "../utils/datetime-DQxMK7bP.js";
import { p as m } from "../utils/filesize-D_1hx4u8.js";
import { t as u } from "../utils/filter-Dko2hrfF.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../utils/helper-OCngMtkv.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const c = {
    selector: [
      "a.torrent-row-action-link--download[href*='download.php?id=']",
      "a[href*='download.php?id=']:has(i.fa-download)",
      "a[href*='download.php?id='][title*='下载']",
      "a[href*='download.php?id='][title*='Download']",
    ],
    attr: "href",
  },
  O = {
    ...r,
    version: 1,
    id: "audiences",
    name: "Audiences",
    aka: ["观众", "人人人"],
    description: "观众",
    tags: ["综合", "影视", "音乐", "电子书", "有声书", "体育", "游戏"],
    timezoneOffset: "+0800",
    collaborator: ["hui-shao"],
    type: "private",
    schema: "NexusPHP",
    urls: ["uggcf://nhqvraprf.zr/"],
    category: [
      {
        name: "类型",
        key: "cat",
        options: [
          { name: "电影 (Movie)", value: 401 },
          { name: "剧集 (TV Series)", value: 402 },
          { name: "综艺 (TV Show)", value: 403 },
          { name: "纪录片 (Documentary)", value: 406 },
          { name: "有声书 (Audiobook)", value: 404 },
          { name: "电子书 (E-Book)", value: 405 },
          { name: "音乐 (Music)", value: 408 },
          { name: "体育 (Sport)", value: 407 },
          { name: "游戏 (Game)", value: 410 },
          { name: "教学 (Study)", value: 412 },
          { name: "其它 (Other)", value: 409 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "媒介",
        key: "medium",
        options: [
          { name: "UHD Blu-ray 原盘", value: 12 },
          { name: "UHD Blu-ray DIY", value: 13 },
          { name: "Blu-ray 原盘", value: 1 },
          { name: "Blu-ray DIY", value: 14 },
          { name: "REMUX", value: 3 },
          { name: "Encode", value: 15 },
          { name: "HDTV", value: 5 },
          { name: "WEB-DL", value: 10 },
          { name: "DVD 原盘", value: 2 },
          { name: "CD", value: 8 },
          { name: "Track", value: 9 },
          { name: "Other", value: 11 },
        ],
        cross: { mode: "append" },
      },
      {
        name: "制作组",
        key: "team",
        options: [
          { name: "Audies", value: 19 },
          { name: "ADE", value: 21 },
          { name: "ADWeb", value: 20 },
          { name: "ADAudio", value: 23 },
          { name: "ADeBook", value: 24 },
          { name: "ADMusic", value: 25 },
          { name: "Other", value: 5 },
        ],
        cross: { mode: "append" },
      },
      w,
      A,
      B,
    ],
    officialGroupPattern: [/(-Audies|.*@Audies|-ADE|-ADWeb|.*@ADWeb)/i],
    search: {
      ...r.search,
      advanceKeywordParams: {
        ...r.search?.advanceKeywordParams,
        douban: { requestConfigTransformer: ({ requestConfig: e }) => (v(e, "params.search_area", 5), e) },
      },
      selectors: {
        ...r.search.selectors,
        rows: { selector: ["table.torrents-table > tbody > tr[data-torrent-id]"] },
        link: c,
        url: {
          ...c,
          filters: [
            { name: "querystring", args: ["id"] },
            { name: "prepend", args: ["/details.php?id="] },
          ],
        },
        id: { ...c, filters: [{ name: "querystring", args: ["id"] }] },
        subTitle: { selector: ["td.embedded:first > span:last"] },
        author: { selector: ["td.torrent-uploader-col"] },
        comments: { text: 0, selector: ["> td a[href*='comment']"], filters: [{ name: "parseNumber" }] },
        completed: { text: 0, selector: ["> td:nth-of-type(8)"], filters: [{ name: "parseNumber" }] },
        leechers: { text: 0, selector: ["> td:nth-of-type(7)"], filters: [{ name: "parseNumber" }] },
        seeders: { text: 0, selector: ["> td:nth-of-type(6)"], filters: [{ name: "parseNumber" }] },
        size: { text: 0, selector: ["> td:nth-of-type(5)"], filters: [{ name: "parseSize" }] },
        time: { ...r.search.selectors.time, selector: ["> td:nth-of-type(4)"] },
        progress: {
          selector: ["td.torrent-progress-cell span.torrent-progress-value"],
          filters: [{ name: "replace", args: ["%", ""] }, { name: "parseNumber" }],
        },
        status: {
          text: o.unknown,
          selector: ["td.torrent-progress-cell > span.torrent-progress-badge"],
          case: {
            ".torrent-progress-badge--seeding": o.seeding,
            ".torrent-progress-badge--completed": o.completed,
            ".torrent-progress-badge--incomplete": o.inactive,
            ".torrent-progress-badge--downloading": o.downloading,
          },
        },
        tags: [
          ...r.search.selectors.tags,
          { name: "官方", selector: "span.tags.tgf", color: "#06c" },
          { name: "原创", selector: "span.tags.tyc", color: "#085" },
          { name: "国语", selector: "span.tags.tgy", color: "#f96" },
          { name: "粤语", selector: "span.tags.tyc", color: "#f66" },
          { name: "中字", selector: "span.tags.tzz", color: "#9c0" },
          { name: "官字组", selector: "span.tags.tgz", color: "#530" },
          { name: "DIY", selector: "span.tags.tdiy", color: "#993" },
          { name: "动画", selector: "span.tags.tdh", color: "#f596aa" },
          { name: "完结", selector: "span.tags.twj", color: "#4382ff" },
          { name: "Dolby Vision", selector: "span.tags.tdb", color: "#358" },
          { name: "HDR10", selector: "span.tags.thdr10", color: "#9a3" },
          { name: "HDR10+", selector: "span.tags.thdrm", color: "#9b5" },
          { name: "禁转", selector: "span.tags.tjz", color: "#903" },
          { name: "限转", selector: "span.tags.txz", color: "#c03" },
          { name: "首发", selector: "span.tags.tsf", color: "#339" },
          { name: "应求", selector: "span.tags.tyq", color: "#f90" },
          { name: "零魔", selector: "span.tags.tm0", color: "#096" },
          { name: "MV", selector: "span.tags.tmv", color: "turquoise" },
          { name: "卡拉OK", selector: "span.tags.tok", color: "#ff3f33" },
          { name: "LIVE现场", selector: "span.tags.tlive", color: "#ff46ed" },
          { name: "演唱会", selector: "span.tags.tconcert", color: "#3b64ff" },
          { name: "音乐专辑", selector: "span.tags.tyzj", color: "#87007e" },
        ],
      },
    },
    userInfo: {
      ...r.userInfo,
      selectors: {
        ...r.userInfo.selectors,
        messageCount: {
          text: 0,
          selector: [
            ".site-userbar__compact-tool--has-unread .site-userbar__compact-tool-badge--unread",
            "td[style*='background: red'] a[href*='messages.php']",
          ],
          filters: [{ name: "parseNumber" }],
        },
        uploaded: {
          text: 0,
          selector: [".site-userbar__compact-metric--uploaded", ...[].concat(r.userInfo.selectors.uploaded.selector)],
          filters: [
            (e) => {
              e = e.replace(/,/g, "");
              const t = e.match(/(上[传傳]量|Uploaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
              return m(t?.[2] ?? e);
            },
          ],
        },
        downloaded: {
          text: 0,
          selector: [
            ".site-userbar__compact-metric--downloaded",
            ...[].concat(r.userInfo.selectors.downloaded.selector),
          ],
          filters: [
            (e) => {
              e = e.replace(/,/g, "");
              const t = e.match(/(下[载載]量|Downloaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
              return m(t?.[2] ?? e);
            },
          ],
        },
        ratio: { text: 0, selector: [".site-userbar__compact-metric--ratio"], filters: [{ name: "parseNumber" }] },
        levelName: {
          selector: ["td.embedded:has(a[href*='userdetails.php'][href*='id='])"],
          elementProcess: (e) =>
            (e.textContent?.replace(/\s+/g, "") ?? "")
              .match(
                /(NexusMaster|UltimateUser|ExtremeUser|VeteranUser|InsaneUser|CrazyUser|EliteUser|PowerUser|Rainbow|User)(?:加入日期|Join|$)/,
              )?.[1]
              ?.replace(/([a-z])([A-Z])/g, "$1 $2") ?? "",
        },
        bonus: {
          selector: [
            ".site-userbar__compact-metric--bonus",
            "td.rowhead:contains('爆米花') + td",
            "td.rowhead:contains('Karma Points') + td",
          ],
          filters: [{ name: "parseNumber" }],
        },
        bonusPerHour: {
          selector: [".mybonus-side__rate", ...[].concat(r.userInfo.selectors.bonusPerHour.selector)],
          filters: [
            (e) => {
              const t = e.match(/(?:你当前每小时能获取|你當前每小時能獲取|You are currently getting)\s*([\d.,]+)/);
              return u(t?.[1] ?? e);
            },
          ],
        },
        seedingBonus: {
          selector: [
            ".site-userbar__compact-metric--seeding-bonus",
            ...[].concat(r.userInfo.selectors.seedingBonus.selector),
          ],
          filters: [{ name: "parseNumber" }],
        },
        joinTime: {
          selector: [
            ...[].concat(r.userInfo.selectors.joinTime.selector),
            "td:contains('加入日期：')",
            "div:contains('加入日期：')",
          ],
          filters: [
            (e) => ((e = e.match(/加入日期[：:]\s*([^(]+?)(?:\s*\(|最近[动動]向|$)/)?.[1] ?? e.split(" (")[0]), p(e)),
          ],
        },
        lastAccessAt: {
          selector: [
            ...[].concat(r.userInfo.selectors.lastAccessAt.selector),
            "td:contains('最近动向：')",
            "td:contains('最近動向：')",
            "div:contains('最近动向：')",
            "div:contains('最近動向：')",
          ],
          filters: [(e) => ((e = e.match(/最近[动動]向[：:]\s*([^(]+?)(?:\s*\(|$)/)?.[1] ?? e.split("(")[0]), p(e))],
        },
        seeding: {
          selector: [".site-userbar__compact-metric-inline-link--seeding"],
          filters: [{ name: "parseNumber" }],
        },
        leeching: {
          selector: [".site-userbar__compact-metric-inline-link--leeching"],
          filters: [{ name: "parseNumber" }],
        },
        hnrPreWarning: {
          text: 0,
          selector: [".site-userbar__compact-metric--hr", "#info_block a[href*='myhr.php']:last"],
          filters: [
            (e) => {
              const t = String(e || "").match(/\d+/);
              return t && t.length >= 1 ? parseInt(t[0]) : 0;
            },
          ],
        },
        hnrUnsatisfied: {
          text: 0,
          selector: [".site-userbar__compact-metric--hr", "#info_block a[href*='myhr.php']:last"],
          filters: [
            (e) => {
              const t = String(e || "").match(/\d+\s*\/\s*(\d+)/);
              return t && t.length >= 2 ? parseInt(t[1]) : 0;
            },
          ],
        },
      },
    },
    levelRequirements: [
      { id: 0, name: "User", nameAka: ["小鬼当家"], privilege: "新用户的默认级别；可以请求续种。" },
      {
        id: 1,
        name: "Power User",
        nameAka: ["年轻气盛"],
        interval: "P5W",
        downloaded: "120GB",
        ratio: 2,
        seedingBonus: 1e5,
        privilege:
          '可以查看NFO文档；可以查看用户列表； 可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕；发布10种通过候选后可直接发布种子。',
      },
      {
        id: 2,
        name: "Elite User",
        nameAka: ["江湖儿女"],
        interval: "P15W",
        downloaded: "240GB",
        ratio: 2.5,
        seedingBonus: 2e5,
        privilege: "同年轻气盛(Power User)",
      },
      {
        id: 3,
        name: "Crazy User",
        nameAka: ["街头霸王"],
        interval: "P24W",
        downloaded: "400GB",
        ratio: 3,
        seedingBonus: 4e5,
        privilege: "可以查看排行榜。",
      },
      {
        id: 4,
        name: "Insane User",
        nameAka: ["步履不停"],
        interval: "P40W",
        downloaded: "600GB",
        ratio: 3.5,
        seedingBonus: 64e4,
        privilege: "同街头霸王(Crazy User)",
      },
      {
        id: 5,
        name: "Veteran User",
        nameAka: ["杰出公民"],
        interval: "P60W",
        downloaded: "1024GB",
        ratio: 4,
        seedingBonus: 88e4,
        privilege: "可以查看其它用户的评论、帖子历史。",
      },
      {
        id: 6,
        name: "Extreme User",
        nameAka: ["头号玩家"],
        interval: "P80W",
        downloaded: "2048GB",
        ratio: 4.5,
        seedingBonus: 12e5,
        isKept: !0,
        privilege: "可以更新过期的外部信息。头号玩家(Extreme User)及以上用户会永远保留账号。",
      },
      {
        id: 7,
        name: "Ultimate User",
        nameAka: ["一代宗师"],
        interval: "P100W",
        downloaded: "4096GB",
        ratio: 5,
        seedingBonus: 15e5,
        isKept: !0,
        privilege: "同头号玩家(Extreme User)",
      },
      {
        id: 8,
        name: "Nexus Master",
        nameAka: ["教父"],
        interval: "P112W",
        downloaded: "8192GB",
        ratio: 6,
        seedingBonus: 18e5,
        isKept: !0,
        privilege: "同一代宗师(Ultimate User)",
      },
      {
        id: 9,
        name: "Rainbow",
        nameAka: ["彩虹照耀"],
        interval: "P128W",
        downloaded: "10240GB",
        ratio: 8,
        seedingBonus: 24e5,
        isKept: !0,
        privilege:
          "保持等级期间会显示彩虹ID，做种积分要求逐年增加（具体数值以通知为准），彩虹照耀(Rainbow)用户未到更新后的要求会被降级",
      },
    ],
  };
class $ extends y {
  async requestUserSeedingPage(t, a = "seeding") {
    const { data: n } = await this.request({
      url: "/getusertorrentlistajax.php",
      params: { userid: t, type: a },
      headers: { Referer: g("uggcf://nhqvraprf.zr/hfreqrgnvyf.cuc") },
    });
    return n || null;
  }
  async parseUserInfoForSeedingStatus(t) {
    let a = {};
    const n = t.id;
    if (!n) return t;
    const i = await this.requestUserSeedingPage(n, "seeding");
    if (i && i?.includes("<table")) {
      const l = f(i),
        s = h("table:first tr:contains('Total')", l);
      if (s.length > 0) {
        const d = s[0].getElementsByTagName("td");
        ((a.seeding = u(d[1].innerText.trim())), (a.seedingSize = m(d[2].innerText.trim())));
      }
    }
    return ((t = b(t, a, (l, s) => (typeof s > "u" ? l : s))), t);
  }
}
export { $ as default, O as siteMetadata };
