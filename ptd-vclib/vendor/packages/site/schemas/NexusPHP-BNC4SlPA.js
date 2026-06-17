import { S as d, K as S, a3 as C, bD as E } from "../index-COeZNva1.js";
import { t as M, m as I } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import F from "./AbstractPrivateSite-kkMcHSoo.js";
import { E as b } from "../types/base-Dy_28wGT.js";
import { E as p } from "../types/torrent-BvvY2NbA.js";
import { f as x, p as D } from "../utils/datetime-DQxMK7bP.js";
import { s as H, p as g } from "../utils/filesize-D_1hx4u8.js";
import { d as w } from "../utils/filter-Dko2hrfF.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "./AbstractBittorrentSite-YCyl9e_L.js";
import "../utils/helper-OCngMtkv.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const se = {
    name: "显示断种/活种？",
    key: "incldead",
    options: [
      { name: "全部", value: 0 },
      { name: "仅活种", value: 1 },
      { name: "仅断种", value: 2 },
    ],
    cross: !1,
  },
  ne = {
    name: "促销种子？",
    key: "spstate",
    options: [
      { name: "全部", value: 0 },
      { name: "普通", value: 1 },
      { name: "免费", value: 2 },
      { name: "2X", value: 3 },
      { name: "2X免费", value: 4 },
      { name: "50%", value: 5 },
      { name: "2X 50%", value: 6 },
      { name: "30%", value: 7 },
    ],
    cross: !1,
  },
  ae = {
    name: "显示收藏？",
    key: "inclbookmarked",
    options: [
      { name: "全部", value: 0 },
      { name: "仅收藏", value: 1 },
      { name: "仅未收藏", value: 2 },
    ],
    cross: !1,
  },
  T = [
    "#info_block a[href*='userdetails.php'][href*='id=']:first",
    "a[href*='userdetails.php'][class*='Name']:first",
    "a[href*='userdetails.php']:first",
  ],
  f = {
    selector: [
      "a[href^='details.php?id='][title]:has(b)",
      "a[href*='details.php?id='][href*='hit']",
      "a[href*='hit'][title]",
      "a[href*='hit']:has(b)",
    ],
  },
  y = { selector: ['a[href*="download.php?id="]:has(> img[alt="download"])'], attr: "href" };
function P(t) {
  const e = new RegExp(`(${t.join("|")}).+?([\\d.]+)`);
  return {
    selector: [
      ...t.map(
        (r) =>
          "td.rowhead" +
          r
            .split(" ")
            .map((s) => `:contains('${s}')`)
            .join("") +
          " + td",
      ),
      ...t.map((r) => `td.rowfollow:contains('${r}')`),
    ],
    filters: [
      (r) => (
        (r = r.replace(/,/g, "")),
        e.test(r) ? ((r = r.match(e)[2]), parseFloat(r)) : /[\d.]+/.test(r) ? parseFloat(r.match(/[\d.]+/)[0]) : r
      ),
    ],
  };
}
const k = (t) => {
    const e = t.parentElement?.querySelector("div");
    if (!e) return null;
    const s = e.getAttribute("title")?.split(" ");
    if (!s || s.length != 2) return null;
    const a = s[0],
      n = s[1];
    return { status: a, progress: n };
  },
  oe = (t) => {
    const r = [...(t.textContent || "").matchAll(/\s(\d+)\//g)]
        .map((n) => parseInt(n[1] || "0", 10))
        .filter(Number.isFinite)
        .reduce((n, o) => n + o, 0),
      s = t.querySelectorAll("font[color*='red']") ?? [],
      a = Array.from(s)
        .map((n) => parseInt(n.textContent?.trim() || "0", 10))
        .filter(Number.isFinite)
        .reduce((n, o) => n + o, 0);
    return { hnrPreWarning: r || 0, hnrUnsatisfied: a || 0 };
  },
  L =
    (t = [], e = !0) =>
    (r) => {
      const s = r.parentElement.innerHTML.split("<br>");
      if (s && s.length > 1) {
        const a = s[s.length - 1],
          n = document.createElement("div");
        n.innerHTML = a;
        for (const o of t) n.querySelectorAll(o).forEach((i) => (e ? i : i.parentElement).remove());
        return C(n.innerHTML).trim();
      }
      return "";
    },
  ie = {
    version: 0,
    schema: "NexusPHP",
    type: "private",
    timezoneOffset: "+0800",
    search: {
      keywordPath: "params.search",
      requestConfig: { url: "/torrents.php", params: { notnewword: 1 } },
      advanceKeywordParams: {
        imdb: { requestConfigTransformer: ({ requestConfig: t }) => (E(t, "params.search_area", 4), t) },
      },
      selectors: {
        link: y,
        url: {
          ...y,
          filters: [
            { name: "querystring", args: ["id"] },
            { name: "prepend", args: ["/details.php?id="] },
          ],
        },
        id: { ...y, filters: [{ name: "querystring", args: ["id"] }] },
        title: { ...f, text: "", elementProcess: (t) => (t.getAttribute("title") || t.textContent || "").trim() },
        subTitle: { ...f, text: "", elementProcess: L(["a, span, img"], !0) },
        progress: {
          ...f,
          elementProcess: (t) => {
            const e = k(t);
            return e ? parseFloat(e.progress) : "0";
          },
        },
        status: {
          ...f,
          text: p.unknown,
          elementProcess: (t) => {
            const e = k(t);
            if (!e) return p.unknown;
            switch (e.status) {
              case "leeching":
                return p.downloading;
              case "seeding":
                return p.seeding;
              case "inactivity":
                return e.progress == "100%" ? p.completed : p.inactive;
            }
            return p.unknown;
          },
        },
        category: {
          text: "Other",
          selector: ["a:first"],
          elementProcess: (t) => {
            let e = "Other";
            const r = t.querySelector("img:nth-child(1)");
            if (r) e = r.getAttribute("title") || r.getAttribute("alt") || e;
            else return t.textContent || e;
            return e.trim();
          },
        },
        time: {
          text: 0,
          elementProcess: (t) => {
            let e = 0;
            try {
              const r = t.querySelector("span[title], time[title]");
              (r ? (e = r.getAttribute("title")) : (e = C(t.innerHTML.replace("<br>", " "))),
                e.match(/\d+[分时天月年]/g) ? (e = D(e)) : (e = x(e)));
            } catch {}
            return e;
          },
        },
        ext_douban: {
          selector: ["span[data-doubanid]", "a[href*='douban.com']"],
          elementProcess: (t) =>
            t.tagName.toLowerCase() === "span"
              ? t.dataset.doubanid || ""
              : (t.tagName.toLowerCase() === "a" && t.getAttribute("href")) || "",
          filters: [{ name: "extDoubanId" }],
        },
        ext_imdb: {
          selector: ["span[data-imdbid]", "a[href*='imdb.com']"],
          elementProcess: (t) =>
            t.tagName.toLowerCase() === "span"
              ? t.dataset.imdbid || ""
              : (t.tagName.toLowerCase() === "a" && t.getAttribute("href")) || "",
          filters: [{ name: "extImdbId" }],
        },
        tags: [
          { name: "H&R", selector: "img.hitandrun", color: "black" },
          { name: "Free", selector: "img.pro_free", color: "blue" },
          { name: "2xFree", selector: "img.pro_free2up", color: "green" },
          { name: "2xUp", selector: "img.pro_2up", color: "lime" },
          { name: "2x50%", selector: "img.pro_50pctdown2up", color: "light-green" },
          { name: "30%", selector: "img.pro_30pctdown", color: "indigo" },
          { name: "50%", selector: "img.pro_50pctdown", color: "deep-orange-darken-1" },
        ],
      },
    },
    list: [{ urlPattern: ["/torrents.php", "/special.php"] }],
    detail: {
      urlPattern: ["/details.php"],
      selectors: {
        title: {
          selector: ["h1#top", "html > body > title"],
          switchFilters: {
            "h1#top": [
              (t) => {
                let e = t.match(/^(.+?) +.+$/);
                return e && e.length >= 2 ? e[1].trim() : t;
              },
            ],
            "html > body > title": [
              (t) => {
                let e = t.match(/"(.+)" - Powered by NexusPHP$/);
                return e && e.length >= 3 ? e[2].trim() : t;
              },
            ],
          },
        },
        link: {
          selector: [
            'a[href*="download.php?id="][href*="&downhash="]',
            'a[href*="download.php?id="][href*="&passkey="]',
            'a[href*="download.php?downhash="]',
            'a[href*="download.php?id="]',
          ],
          attr: "href",
        },
      },
    },
    userInfo: {
      pickLast: ["id"],
      selectors: {
        id: { selector: T, attr: "href", filters: [{ name: "querystring", args: ["id"] }] },
        name: { selector: T },
        messageCount: {
          text: 0,
          selector: "td[style*='background: red'] a[href*='messages.php']",
          filters: [
            (t) => {
              const e = String(t || "").match(/(\d+)/);
              return e && e.length >= 2 ? parseInt(e[1]) : 0;
            },
          ],
        },
        uploaded: {
          text: 0,
          selector: [
            "td.rowhead:contains('传输') + td",
            "td.rowhead:contains('傳送') + td",
            "td.rowhead:contains('Transfers') + td",
            "td.rowfollow:contains('分享率')",
          ],
          filters: [
            (t) => {
              const e = t.replace(/,/g, "").match(/(上[传傳]量|Uploaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
              return e && e.length === 3 ? g(e[2]) : 0;
            },
          ],
        },
        trueUploaded: {
          text: 0,
          selector: [
            "td.rowhead:contains('传输') + td",
            "td.rowhead:contains('傳送') + td",
            "td.rowhead:contains('Transfers') + td",
            "td.rowfollow:contains('分享率')",
          ],
          filters: [
            (t) => {
              const e = t
                .replace(/,/g, "")
                .match(/((?:实际|真实)上传量|(?:實際|真實)上傳量|(?:Real|Actual) Uploaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
              return e && e.length === 3 ? g(e[2]) : 0;
            },
          ],
        },
        downloaded: {
          text: 0,
          selector: [
            "td.rowhead:contains('传输') + td",
            "td.rowhead:contains('傳送') + td",
            "td.rowhead:contains('Transfers') + td",
            "td.rowfollow:contains('分享率')",
          ],
          filters: [
            (t) => {
              const e = t.replace(/,/g, "").match(/(下[载載]量|Downloaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/);
              return e && e.length === 3 ? g(e[2]) : 0;
            },
          ],
        },
        trueDownloaded: {
          text: 0,
          selector: [
            "td.rowhead:contains('传输') + td",
            "td.rowhead:contains('傳送') + td",
            "td.rowhead:contains('Transfers') + td",
            "td.rowfollow:contains('分享率')",
          ],
          filters: [
            (t) => {
              const e = t
                .replace(/,/g, "")
                .match(
                  /((?:实际|真实)下载量|(?:實際|真實)下載量|(?:Real|Actual) Downloaded).+?([\d.]+ ?[ZEPTGMK]?i?B)/,
                );
              return e && e.length === 3 ? g(e[2]) : 0;
            },
          ],
        },
        levelName: {
          selector: [
            "td.rowhead:contains('等级') + td > img",
            "td.rowhead:contains('等級')  + td > img",
            "td.rowhead:contains('Class')  + td > img",
          ],
          attr: "title",
        },
        isDonor: { text: !1, selector: ["h1:has(img[src^='pic/flag']) img[alt='Donor']"], elementProcess: () => !0 },
        bonus: P(["魔力值", "Karma Points", "星焱", "魅力值", "沙粒", "魔力"]),
        seedingBonus: P(["做种积分", "Seeding Points", "做種積分", "保种积分"]),
        joinTime: {
          selector: ["td.rowhead:contains('加入日期') + td", "td.rowhead:contains('Join'):contains('date') + td"],
          filters: [(t) => ((t = t.split(" (")[0]), x(t))],
        },
        hnrPreWarning: {
          text: 0,
          selector: ["#info_block a[href*='myhr.php']:last"],
          filters: [
            (t) => {
              const e = String(t || "").match(/\d+/);
              return e && e.length >= 1 ? parseInt(e[0]) : 0;
            },
          ],
        },
        hnrUnsatisfied: {
          text: 0,
          selector: ["#info_block a[href*='myhr.php']:last"],
          filters: [
            (t) => {
              const e = String(t || "").match(/\d+\s*\/\s*(\d+)/);
              return e && e.length >= 2 ? parseInt(e[1]) : 0;
            },
          ],
        },
        bonusPerHour: {
          selector: [
            "#outer td[rowspan]",
            "div:contains('你当前每小时能获取'):last",
            "div:contains('You are currently getting'):last",
            "div:contains('你當前每小時能獲取'):last",
          ],
          filters: [{ name: "parseNumber" }],
        },
        lastAccessAt: {
          selector: [
            "td.rowhead:contains('最近动向') + td",
            "td.rowhead:contains('最近動向') + td",
            "td.rowhead:contains('Last Action') + td",
          ],
          filters: [{ name: "split", args: ["(", 0] }, { name: "parseTime" }],
        },
      },
      process: [
        { requestConfig: { url: "/index.php", responseType: "document" }, fields: ["id"] },
        {
          requestConfig: { url: "/userdetails.php", responseType: "document" },
          assertion: { id: "params.id" },
          fields: [
            "name",
            "messageCount",
            "uploaded",
            "trueUploaded",
            "downloaded",
            "trueDownloaded",
            "levelName",
            "bonus",
            "seedingBonus",
            "joinTime",
            "seeding",
            "seedingSize",
            "hnrUnsatisfied",
            "hnrPreWarning",
            "lastAccessAt",
            "isDonor",
          ],
        },
        {
          requestConfig: { url: "/mybonus.php", responseType: "document" },
          fields: ["bonusPerHour", "seedingBonusPerHour"],
        },
      ],
      donorConfig: { isAccountKept: !1, bonusPerHourMultiplier: 2 },
    },
  };
class le extends F {
  guessSearchFieldIndexConfig() {
    return {
      author: ['a[href*="sort=9"]'],
      comments: ["img.comments"],
      completed: ["img.snatched"],
      leechers: ["img.leechers"],
      seeders: ["img.seeders"],
      size: ["img.size"],
      time: ["img.time"],
    };
  }
  get customTagsLocaterSelector() {
    return "table.torrentname";
  }
  async transformSearchPage(e, r) {
    const { keywords: s, searchEntry: a, requestConfig: n } = r;
    if (e instanceof Document) {
      const o = "table.torrents:last",
        i = d(`${o} > thead > tr`, e).length > 0;
      a.selectors.rows || (a.selectors.rows = { selector: `${o} > tbody > tr` + (i ? "" : ":gt(0)") });
      const u = o + (i ? " > thead > tr > th" : " > tbody > tr:eq(0) > td");
      d(u, e).forEach((l, m) => {
        let h;
        if (/(cat|类型|類型|分类|分類|Тип)/gi.test(l.innerText)) h = "category";
        else
          for (const [v, A] of Object.entries(this.guessSearchFieldIndexConfig()))
            for (const q of A)
              if (d(q, l).length > 0) {
                h = v;
                break;
              }
        h && (a.selectors[h] = M({ selector: [`> td:eq(${m})`] }, a.selectors[h] || {}));
      });
    }
    return await super.transformSearchPage(e, { keywords: s, searchEntry: a, requestConfig: n });
  }
  async getUserInfoResult(e = {}) {
    let r = await super.getUserInfoResult(e);
    if (
      (r.status === b.success &&
        (typeof r.seeding > "u" || typeof r.seedingSize > "u") &&
        (await this.sleepAction(this.metadata.userInfo?.requestDelay),
        (r = await this.parseUserInfoForSeedingStatus(r))),
      r.status === b.success &&
        typeof r.uploads > "u" &&
        (await this.sleepAction(this.metadata.userInfo?.requestDelay), (r = await this.parseUserInfoForUploads(r))),
      r.status === b.success)
    ) {
      const s = this.metadata.userInfo?.donorConfig;
      if (r.isDonor === !0 && typeof r.bonusPerHour == "number") {
        const a = s?.bonusPerHourMultiplier ?? 1;
        r.bonusPerHour *= a;
      }
    }
    return r;
  }
  async requestUserSeedingPage(e, r = "seeding") {
    const { data: s } = await this.request({ url: "/getusertorrentlistajax.php", params: { userid: e, type: r } });
    return s || null;
  }
  async parseUserInfoForSeedingStatus(e) {
    const r = e.id,
      s = await this.requestUserSeedingPage(r);
    let a = { seeding: 0, seedingSize: 0 };
    if (s && s?.includes("<table")) {
      const n = S(s),
        o = d("div:has( ~ table) > div:contains(' | ')", n);
      if (o.length > 0 && o[0].textContent) {
        const i = o[0].textContent.split("|");
        ((a.seeding = w.parseNumber(i[0])), (a.seedingSize = w.parseSize(i[1])));
      } else {
        const i = d("table:last tr:not(:eq(0))", n);
        if (i.length > 0) {
          a.seeding = i.length;
          let u = 2;
          const c = d("> td", i[0]);
          for (let l = 0; l < c.length; l++)
            if (H.test(c[l].innerText)) {
              u = l;
              break;
            }
          i.forEach((l) => {
            const m = d(`td:eq(${u})`, l)[0];
            a.seedingSize += g(m.innerText.trim());
          });
        }
      }
    }
    return ((e = I(e, a, (n, o) => (typeof o > "u" ? n : o))), e);
  }
  async parseUserInfoForUploads(e) {
    const r = e.id,
      s = await this.requestUserSeedingPage(r, "uploaded");
    if (((e.uploads = 0), s && /<b>\d+<\/b>(条记录| records|條記錄)|No record.|没有记录|沒有記錄/.test(s)))
      e.uploads = Number(s.match(/<b>(\d+)<\/b>(条记录| records|條記錄)/)?.[1] ?? 0);
    else if (s && s?.includes("<table")) {
      const a = S(s),
        n = d("div:has( ~ table) > div:contains(' | ')", a);
      if (n.length > 0 && n[0].textContent) {
        const o = n[0].textContent.split("|");
        e.uploads = w.parseNumber(o[0]);
      } else {
        const o = d("table:last tr:not(:eq(0))", a);
        e.uploads = o.length;
      }
    }
    return e;
  }
  parseTorrentRowForTags(e, r, s) {
    super.parseTorrentRowForTags(e, r, s);
    const a = r.querySelectorAll(
      `${this.customTagsLocaterSelector} span[style*='background-color'][style*='color'][title]`,
    );
    if (a.length > 0) {
      const n = e.tags || [];
      (a.forEach((o) => {
        const i = o,
          u = i.textContent;
        let c = i.style.backgroundColor;
        if (c === "" && i.style.backgroundImage?.startsWith("linear-gradient")) {
          const l = i.style.backgroundImage.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g);
          if (l && l.length > 0) {
            for (const m of l)
              if (m.trim() !== "rgb(255, 255, 255)") {
                c = m.trim();
                break;
              }
          }
        }
        u && c && n.push({ name: u, color: c });
      }),
        (e.tags = n));
    }
    return e;
  }
  async getTorrentDownloadLink(e) {
    if (!e.link) {
      if (!e.id && e.url) {
        const r = e.url.match(/[?&]id=(\d+)/);
        r && r.length >= 2 && (e.id ??= r[1]);
      }
      if (e.id) {
        const r = e.url?.startsWith("http") ? { url: e.url } : { baseURL: this.url };
        e.link = this.fixLink(`/download.php?id=${e.id}`, r);
      }
    }
    return (
      e.link &&
        e.link.includes("/details.php") &&
        (e.link = e.link.replace(/details\.php\?id=(\d+)/, "download.php?id=$1").replace(/&hit=1/, "")),
      super.getTorrentDownloadLink(e)
    );
  }
}
export {
  ae as CategoryInclbookmarked,
  se as CategoryIncldead,
  ne as CategorySpstate,
  ie as SchemaMetadata,
  y as baseLinkQuery,
  f as baseTitleQuery,
  T as baseUserIdSelector,
  P as createUserBonusSelectorFn,
  le as default,
  oe as parseSectionedHitAndRunElement,
  L as subTitleRemoveExtraElement,
};
