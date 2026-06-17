import { S as d } from "../index-COeZNva1.js";
import { t as u } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import h from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import { E as f } from "../types/base-Dy_28wGT.js";
import { E as o } from "../types/torrent-BvvY2NbA.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
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
const x = {
  id: "skyeysnow",
  version: 1,
  name: "SkyeySnow",
  aka: ["天雪"],
  description: "这是一个高清动漫的完全非盈利论坛，高清动漫是一个很小的圈子 论坛方向为DVD/BDRip和BDMV&BDMV用字幕相关。",
  tags: ["动漫"],
  timezoneOffset: "+0800",
  collaborator: ["栽培者", "MewX", "fzlins", "zhuweitung", "Rhilip"],
  type: "private",
  schema: "Discuz",
  urls: ["uggcf://jjj.fxlrl2.pbz/", "uggcf://fxlrlfabj.pbz/"],
  category: [
    {
      name: "分类",
      key: "category",
      options: [
        { name: "Source:BDMV", value: "11_8" },
        { name: "Source:DVDISO", value: "11_9" },
        { name: "Source:Others", value: "11_10" },
        { name: "Source:Live/演唱会", value: "11_11" },
        { name: "Source:真人周边", value: "11_12" },
        { name: "Rip:BDRip", value: "10_6" },
        { name: "Rip:DVDRip", value: "10_7" },
        { name: "Rip:Others", value: "10_2" },
        { name: "Rip:Live/演唱会", value: "10_3" },
        { name: "Rip:真人周边", value: "10_4" },
        { name: "字幕:BDMV用字幕", value: "16_19" },
        { name: "字幕:BD用简易字幕", value: "16_130" },
        { name: "字幕:BD用链接字幕", value: "16_20" },
        { name: "音乐:Lossless", value: "15_18" },
        { name: "音乐:Lossy", value: "15_17" },
        { name: "音乐:cd付mv", value: "15_59_47" },
        { name: "音乐:cd付mvrip", value: "15_59_48" },
        { name: "演唱会:RAW", value: "2_11" },
        { name: "演唱会:RAW-RIP", value: "2_3" },
        { name: "演唱会:RAW(真人周边", value: "3_12" },
        { name: "演唱会:RAW-RIP(真人周边)", value: "3_4" },
        { name: "演唱会:RAW(其他)", value: "3_10" },
        { name: "演唱会:RAW-RIP(其他)", value: "3_2" },
      ],
      cross: { mode: "append", key: "cat_" },
    },
  ],
  search: {
    requestConfig: { url: "/forum.php", params: { mod: "torrents" } },
    keywordPath: "params.search",
    advanceKeywordParams: {
      imdb: !1,
      douban: !1,
      anidb: {
        requestConfigTransformer: ({ requestConfig: e }) => (
          e?.params?.search && (e.params.search = "$" + e.params.search),
          e
        ),
      },
    },
    selectors: {
      rows: { selector: "table.torrents > tbody > tr:gt(0)" },
      id: {
        selector: 'a[href^="/forum.php?mod=viewthread"]',
        attr: "href",
        filters: [{ name: "querystring", args: ["tid"] }],
      },
      title: { selector: "td.torrent_title > a[title]", attr: "title" },
      url: { selector: 'a[href^="/forum.php?mod=viewthread"]', attr: "href" },
      link: { selector: 'a[href^="/download.php?id="]', attr: "href" },
      time: {
        selector: " > td:nth-child(3)",
        filters: [
          {
            name: "parseTime",
            args: [
              "yyyy-MM-dd HH:mm:ss",
              `yyyy-MM-dd
HH:mm:ss`,
            ],
          },
        ],
      },
      size: { selector: "> td:nth-child(4)", filters: [{ name: "parseSize" }] },
      author: { selector: "> td:nth-last-child(1)" },
      category: { selector: "> td:nth-child(1)" },
      seeders: { selector: " > td:nth-child(5)" },
      leechers: { selector: " > td:nth-child(6)" },
      completed: { selector: " > td:nth-child(7)" },
      comments: { text: "N/A" },
      ext_anidb: {
        selector: 'span[style="float:right;font-style:italic"] > a[href*="torrents&search=%24"]:nth-child(1)',
      },
      progress: {
        selector: ["div.tline1, div.tline2"],
        attr: "style",
        filters: [
          (e) => {
            const t = e.match(/width:([ \d.]+)%/);
            return t && t.length >= 2 ? parseFloat(t[1]) : null;
          },
        ],
      },
      status: {
        selector: ":self",
        elementProcess: (e) => {
          const r = d("> td:eq(4), > td:eq(5), > td:eq(6)", e).map((a) => a.getAttribute("style"));
          return r[0] ? o.seeding : r[2] ? o.completed : r[1] ? o.downloading : o.unknown;
        },
      },
    },
  },
  list: [{ urlPattern: [/\/forum\.php\?mod=torrents/] }],
  detail: {
    urlPattern: [/\/forum\.php\?mod=viewthread/],
    selectors: {
      title: { selector: ["span#thread_subject"] },
      id: {
        selector: ['div.pi a[href*="download.php?id="]'],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      link: {
        selector: ['div.pi a[href*="download.php?id="][href*="&passkey="]', 'div.pi a[href*="download.php?id="]'],
        attr: "href",
      },
    },
  },
  userInfo: {
    pickLast: ["id", "name"],
    process: [
      {
        requestConfig: { url: "/" },
        selectors: {
          id: { selector: ".vwmy a", attr: "href", filters: [{ name: "querystring", args: ["uid"] }] },
          name: { selector: ".vwmy a" },
          messageCount: { selector: ["a.a.showmenu.new"], filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/home.php", params: { mod: "space" } },
        assertion: { id: "params.uid" },
        selectors: {
          uploaded: {
            selector: "#psts li:contains('上传量')",
            filters: [
              (e) => {
                const t = e.replace(/[\s,]/g, "").match(/上传量.+\/\s*([\d.]+[ZEPTGMK]?i?B)/i);
                return t && t.length >= 2 ? t[1] : e;
              },
              { name: "parseSize" },
            ],
          },
          downloaded: {
            selector: "#psts li:contains('下载量')",
            filters: [
              (e) => {
                const t = e.replace(/[\s,]/g, "").match(/下载量.+\/\s*([\d.]+[ZEPTGMK]?i?B)/i);
                return t && t.length >= 2 ? t[1] : e;
              },
              { name: "parseSize" },
            ],
          },
          trueUploaded: {
            selector: '#psts li:contains("实际上传")',
            filters: [
              (e) => {
                const t = e.replace(/[\s,]/g, "").match(/实际上传.+?([\d.]+[ZEPTGMK]?i?B)/i);
                return t && t.length >= 2 ? t[1] : e;
              },
              { name: "parseSize" },
            ],
          },
          trueDownloaded: {
            selector: '#psts li:contains("实际下载")',
            filters: [
              (e) => {
                const t = e.replace(/[\s,]/g, "").match(/实际下载.+\/\s*([\d.]+[ZEPTGMK]?i?B)/i);
                return t && t.length >= 2 ? t[1] : e;
              },
              { name: "parseSize" },
            ],
          },
          levelName: {
            selector: "a[href='home.php?mod=spacecp&ac=usergroup']",
            filters: [(e) => e.replace("用户组: ", "").trim()],
          },
          ratio: {
            selector: "ul.bbda",
            filters: [
              (e) => {
                const t = e.match(/分享率\s*([\d.]+)/);
                return t && t.length >= 2 ? parseFloat(t[1]) : 0;
              },
            ],
          },
          bonus: { selector: "#ratio", filters: [{ name: "parseNumber" }] },
          joinTime: {
            selector: "#pbbs > li:contains('注册时间')",
            filters: [(e) => e.replace("注册时间", "").trim(), { name: "parseTime", args: ["yyyy-MM-dd HH:mm"] }],
          },
          lastAccessAt: {
            selector: "#pbbs > li:contains('最后访问')",
            filters: [(e) => e.replace("最后访问", "").trim(), { name: "parseTime", args: ["yyyy-MM-dd HH:mm"] }],
          },
        },
      },
    ],
  },
  levelRequirements: [
    {
      id: 1,
      name: "Lv.1 白露",
      bonus: 1e3,
      privilege: "自定义头衔；允许发短消息；允许加好友；允许设置回帖奖励；允许参与点评；",
    },
    { id: 2, name: "Lv.2 秋分", bonus: 3e3, privilege: "" },
    { id: 3, name: "Lv.3 霜降", bonus: 5e3, privilege: "" },
    { id: 4, name: "Lv.4 小雪", bonus: 1e4, privilege: "" },
    { id: 5, name: "Lv.5 大雪", bonus: 3e4, privilege: "" },
    { id: 6, name: "Lv.6 小寒", bonus: 1e5, privilege: "" },
    { id: 7, name: "Lv.7 大寒", bonus: 3e5, privilege: "" },
    { id: 8, name: "Lv.8 立春", bonus: 1e6, privilege: "" },
  ],
};
class V extends h {
  async getUserInfoResult(t = {}) {
    let r = await super.getUserInfoResult(t);
    if (r.status == f.success) {
      let a = { seeding: 0, seedingSize: 0, uploads: 0 };
      for (const s = { count: 0, current: 0 }; s.current <= s.count; s.current++) {
        const n = {
            url: "/forum.php",
            params: { mod: "torrents", cat_5up: "on", page: s.current },
            responseType: "document",
          },
          { data: l } = await this.request(n);
        s.count === 0 &&
          (s.count = this.getFieldData(l, {
            selector: ["a[onclick*='page=']:contains('-'):last"],
            attr: "onclick",
            filters: [(i) => i.match(/page=(\d+)/)?.[1] ?? 0],
          }));
        try {
          const i = await this.transformSearchPage(l, {
            searchEntry: this.metadata.search,
            requestConfig: n,
            keywords: "",
          });
          ((a.seeding += i.length), (a.seedingSize += i.reduce((m, p) => m + (p.size ?? 0), 0)));
        } catch {
          break;
        }
      }
      const { data: c } = await this.request({
        url: "/forum.php",
        params: { mod: "torrents", search: `#${r.id}` },
        responseType: "document",
      });
      ((a.uploads = this.getFieldData(c, {
        text: 0,
        selector: ["a[onclick*='page=']:contains('-'):last"],
        filters: [(s) => parseInt(s.split("-")?.[1] ?? "0")],
      })),
        (r = u(r, a)));
    }
    return r;
  }
}
export { V as default, x as siteMetadata };
