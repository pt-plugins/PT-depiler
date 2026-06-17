import { u as p } from "../../../url-join/url-join-Cu798wIg.js";
import { o as h } from "../../../es-toolkit/omit-BqXgNNTz.js";
import { t as g } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import _ from "./AbstractPrivateSite-kkMcHSoo.js";
import { E as l, N as b } from "../types/base-Dy_28wGT.js";
import { E as d } from "../types/torrent-BvvY2NbA.js";
import "../index-COeZNva1.js";
import { f as m, p as w } from "../utils/datetime-DQxMK7bP.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "./AbstractBittorrentSite-YCyl9e_L.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const s = {
    id: ["User ID", "用户 ID", "用ID", "用户ID"],
    seedingSize: ["Seeding Size", "Seeding size", "做种体积", "做種體積"],
    joinTime: ["Registration date", "注册日期", "註冊日期"],
    averageSeedingTime: ["Average Seedtime", "Average seedtime", "平均做种时间", "平均做種時間"],
    invites: ["Invites", "邀请", "邀請"],
    ratio: ["Ratio", "分享率", "比率"],
    trueRatio: ["Real Ratio", "真实分享率", "真實比率"],
    lastAccessAt: ["Last login", "Last Login", "上次登录时间", "上次登入"],
  },
  B = {
    name: "Buff",
    key: "free",
    options: [
      { name: "0% Freeleech", value: 0 },
      { name: "25% Free", value: 25 },
      { name: "50% Free", value: 50 },
      { name: "75% Free", value: 75 },
      { name: "100% Free", value: 100 },
      { name: "双倍上传", value: "doubleup" },
      { name: "精选", value: "featured" },
      { name: "Refundable", value: "refundable" },
    ],
    cross: { mode: "custom" },
    generateRequestConfig: (e) => {
      const t = { free: [] };
      return (
        e.forEach((r) => {
          r === "doubleup" || r === "featured" || r === "refundable" ? (t[r] = 1) : t.free.push(r);
        }),
        { requestConfig: { params: t } }
      );
    },
  },
  V = {
    version: 0,
    timezoneOffset: "+0000",
    search: {
      keywordPath: "params.name",
      requestConfig: { url: "/torrents/", responseType: "document", params: { perPage: 100 } },
      advanceKeywordParams: {
        imdb: {
          requestConfigTransformer: ({ requestConfig: e }) => (
            e?.params?.name && ((e.params.imdbId = e.params.name), delete e.params.name),
            e
          ),
        },
        tmdb: {
          requestConfigTransformer: ({ requestConfig: e }) => (
            e?.params?.name && ((e.params.tmdbId = e.params.name), delete e.params.name),
            e
          ),
        },
      },
      selectors: {
        rows: {
          selector: [
            "div.torrent-search--list__results > table:first > tbody > tr",
            "div.table-responsive table > tbody > tr",
          ],
          filter: (e) =>
            Array.isArray(e)
              ? e.filter((t) =>
                  Array.from(t.querySelectorAll("a[href*='/torrents/']")).some((r) => {
                    const a = r.getAttribute("href") || "";
                    return /\/torrents\/\d+/.test(a) && !a.includes("/download");
                  }),
                )
              : e,
        },
        id: {
          selector: ["a.view-torrent", "a.torrent-search--list__name"],
          attr: "href",
          filters: [(e) => e.match(/\/torrents\/(\d+)/)[1]],
        },
        title: { selector: ["a.view-torrent", "a.torrent-search--list__name"] },
        subTitle: { text: "" },
        url: { selector: ["a.view-torrent", "a.torrent-search--list__name"], attr: "href" },
        link: {
          selector: ["a[href*='/download/']", "a[href*='/download_check/']"],
          attr: "href",
          filters: [(e) => e.replace("/download_check/", "/download/")],
        },
        time: {
          selector: ["time"],
          elementProcess: (e) => {
            if (e) {
              if (e.title) return m(e.title);
              {
                const t = e.textContent || e.innerText || "";
                return w(t);
              }
            }
          },
        },
        size: { selector: ['td>span.text-blue:contains("B")', "td.torrent-search--list__size"] },
        author: {
          selector: ["span:has( > i.fa-upload)", "span.torrent-search--list__uploader"],
          filters: [(e) => e.replace(/ +\(/, " (")],
        },
        category: {
          selector: [
            'a[href*="/categories/"] > div > img[data-original-title]',
            'a[href*="/categories/"] > div > i[data-original-title]',
            "div.torrent-search--list__category img",
          ],
          elementProcess: (e) =>
            e
              ? e.dataset && e.dataset.originalTitle
                ? e.dataset.originalTitle.split(" ").slice(0, -1).join(" ")
                : e.getAttribute && e.getAttribute("alt")
                  ? e.getAttribute("alt")
                  : ""
              : "",
        },
        seeders: { selector: ['a[href*="/peers"] > span.text-green', "td.torrent-search--list__seeders"] },
        leechers: { selector: ['a[href*="/peers"] > span.text-red', "td.torrent-search--list__leechers"] },
        completed: { selector: ['a[href*="/history"] > span.text-orange', "td.torrent-search--list__completed"] },
        comments: {
          selector: ['a[href*="#comments"]', "i.torrent-icons__comments"],
          filters: [{ name: "parseNumber" }],
        },
        status: {
          selector: ["span.torrent-icons > i.torrent-icons"],
          text: d.unknown,
          case: {
            "i.fa-arrow-circle-up": d.seeding,
            "i.fa-arrow-circle-down": d.downloading,
            "i.fa-do-not-enter": d.inactive,
            "i.fa-thumbs-down": d.completed,
          },
        },
        progress: {
          selector: ["span.torrent-icons > i.torrent-icons"],
          text: 0,
          case: { "i.fa-arrow-circle-up, i.fa-thumbs-down": 100 },
        },
        tags: [
          {
            name: "Free",
            selector:
              "i.fa-star.text-gold, i.fa-globe, i.torrent-icons__freeleech.fa-star, i.torrent-icons__freeleech.fa-calendar-star, i[title*='100%'], span[title*='100%'], i.torrent-icons__featured, i[title*='Featured'], span[title*='feature'], i[data-original-title*='Featured'], i[data-original-title*='Free']",
            color: "blue",
          },
          {
            name: "2xUp",
            selector:
              "i.fa-gem.text-green, i.fa-chevron-double-up, i.torrent-icons__double-upload, i.torrent-icons__featured, i[title*='Double Upload'], i[title*='Featured'], span[title*='feature'], i[data-original-title*='Double Upload'], i[data-original-title*='Featured']",
            color: "lime",
          },
          { name: "75%", selector: "i[title*='75%'], span[title*='75%']", color: "lime-darken-3" },
          { name: "50%", selector: "i[title*='50%'], span[title*='50%']", color: "deep-orange-darken-1" },
          { name: "25%", selector: "i[title*='25%'], span[title*='25%']", color: "blue" },
          { name: "置顶", selector: "i.fa-thumbtack", color: "red" },
          { name: "可退款", selector: "i.fa-percentage, i[title*='Refundable']", color: "gray" },
          { name: "Internal", selector: "i.torrent-icons__internal", color: "purple" },
          { name: "个人发布", selector: "i.torrent-icons__personal-release", color: "purple" },
          { name: "Highspeed", selector: "i.torrent-icons__highspeed", color: "red" },
          { name: "Trump", selector: "i.torrent-icons__torrent-trump", color: "red" },
        ],
      },
    },
    list: [
      {
        urlPattern: ["/torrents(?:/?$|\\?[^/]*$)"],
        excludeUrlPattern: ["/torrents?view=card", "/torrents?view=grouped", "/torrents?view=poster"],
      },
      {
        urlPattern: ["/torrents/similar/"],
        mergeSearchSelectors: !1,
        selectors: {
          rows: {
            selector: [
              "table.similar-torrents__torrents > tbody > tr",
              "table > tbody > tr:has(td a[href*='/torrents/download/'])",
            ],
          },
          id: {
            selector: ["a[href*='/torrents/']:not([href*='/download'])"],
            attr: "href",
            filters: [(e) => e.match(/\/torrents\/(\d+)/)[1]],
          },
          title: { selector: ["a[href*='/torrents/']:not([href*='/download'])"] },
          url: { selector: ["a[href*='/torrents/']:not([href*='/download'])"], attr: "href" },
          link: {
            selector: ["a[href*='/download/']", "a[href*='/download_check/']"],
            attr: "href",
            filters: [(e) => e.replace("/download_check/", "/download/")],
          },
        },
      },
    ],
    detail: {
      urlPattern: ["/torrents/\\d+"],
      selectors: {
        id: {
          selector: ":self",
          elementProcess: (e) => {
            const r = e.URL.match(/\/torrents\/(\d+)/);
            if (r && r.length >= 2) return r[1];
            const a = e.querySelector("a[href*='/torrents/']");
            if (a) {
              const i = a.getAttribute("href")?.match(/\/torrents\/(\d+)/);
              if (i && i.length >= 2) return i[1];
            }
          },
        },
        title: {
          selector: ["h1.torrent__name", "html > body > title"],
          switchFilters: {
            "html > body > title": [
              (e) => {
                const t = e.match(/^(.*) - .* - .+$/);
                return t && t.length >= 2 ? t[1] : e;
              },
            ],
          },
        },
        link: { selector: ["a[href*='/download/']", "a[href*='/download_check/']"], attr: "href" },
      },
    },
    userInfo: {
      pickLast: ["name"],
      selectors: {
        name: {
          selector: ["a[href*='/users/'][href*='settings']:first"],
          attr: "href",
          filters: [
            (e) => {
              const t = e.match(/users\/([^\/]+)(?:\/|$)/);
              return t && t.length >= 2 ? t[1] : "";
            },
          ],
        },
        id: {
          selector: [...s.id.map((e) => `dt:contains('${e}') + dd`), ...s.id.map((e) => `td:contains('${e}') + td`)],
          filters: [(e) => parseInt(e || "0")],
        },
        uploaded: {
          selector: ["li.ratio-bar__uploaded a:has( > i.fa-arrow-up)", "span:has( > i.fa-arrow-up)"],
          filters: [{ name: "parseSize" }],
        },
        downloaded: {
          selector: ["li.ratio-bar__downloaded a:has( > i.fa-arrow-down)", "span:has( > i.fa-arrow-down)"],
          filters: [{ name: "parseSize" }],
        },
        ratio: {
          selector: [
            ...s.ratio.map((e) => `dt:contains('${e}') + dd`),
            ...s.ratio.map((e) => `td:contains('${e}') + td`),
            "li.ratio-bar__ratio a:has( > i.fa-sync-alt)",
            "span:has( > i.fa-sync-alt)",
          ],
          filters: [{ name: "parseNumber" }],
        },
        trueRatio: {
          selector: [
            ...s.trueRatio.map((e) => `dt:contains('${e}') + dd`),
            ...s.trueRatio.map((e) => `td:contains('${e}') + td`),
          ],
          filters: [{ name: "parseNumber" }],
        },
        bonus: {
          selector: ["li.ratio-bar__points a:has( > i.fa-coins)", "span:has( > i.fa-coins)"],
          filters: [{ name: "parseNumber" }],
        },
        seeding: {
          selector: ["li.ratio-bar__seeding a:has( > i.fa-upload)", "span:has( > i.fa-upload)"],
          filters: [{ name: "parseNumber" }],
        },
        leeching: {
          selector: ["li.ratio-bar__leeching a:has( > i.fa-download)", "span:has( > i.fa-download)"],
          filters: [{ name: "parseNumber" }],
        },
        seedingSize: {
          selector: [
            ...s.seedingSize.map((e) => `dt:contains('${e}') + dd`),
            ...s.seedingSize.map((e) => `td:contains('${e}') + td`),
          ],
          filters: [{ name: "parseSize" }],
        },
        averageSeedingTime: {
          selector: [
            ...s.averageSeedingTime.map((e) => `dt:contains('${e}') + dd`),
            ...s.averageSeedingTime.map((e) => `td:contains('${e}') + dd span.badge-user`),
          ],
          filters: [{ name: "parseDuration" }],
        },
        levelName: {
          selector: ["div.content span.badge-user", "a.user-tag__link[title]"],
          elementProcess: (e) => e.getAttribute("title") || e.textContent,
        },
        messageCount: {
          text: 0,
          selector: [
            'a[href*="/mail"] .point, a[href*="/notifications"] .point, ul.top-nav__icon-bar circle, a.top-nav--right__icon-link[href*="/conversations"] span.notification-dot',
          ],
          elementProcess: () => 11,
        },
        uploads: {
          selector: ["dl.key-value:has(a[href*='/uploads'])", ".badge-user .fa-upload + span"],
          elementProcess: (e) => {
            if (!e.querySelector("a[href*='/uploads']")) return;
            let t = 0;
            return (
              e.querySelectorAll("dt:has(a[href*='/uploads']) + dd").forEach((r) => {
                t += Number(r.textContent.trim());
              }),
              t
            );
          },
          switchFilters: { ".badge-user .fa-upload + span": [{ name: "parseNumber" }] },
        },
        joinTime: {
          selector: ["time.profile__registration", ...s.joinTime.map((e) => `div.content h4:contains('${e}')`)],
          filters: [
            (e) => (
              (e = e.replace(RegExp(s.joinTime.join("|")), "")),
              (e = e.replace(/^:+/g, "").trim()),
              m(e, ["MMM dd yyyy, HH:mm:ss", "MMM dd yyyy", "yyyy-MM-dd"])
            ),
          ],
        },
        lastAccessAt: {
          selector: [
            ...s.lastAccessAt.map((e) => `dt:contains('${e}') + dd time`),
            ...s.lastAccessAt.map((e) => `td:contains('${e}') + td`),
          ],
          elementProcess: (e) => {
            const t = e.getAttribute("title") ?? e.getAttribute("datetime");
            return m(t || e.textContent.split("(")[0]);
          },
        },
        invites: {
          selector: [
            ...s.invites.map((e) => `dt:contains('${e}'):last + dd`),
            ...s.invites.map((e) => `td:contains('${e}'):last + td`),
          ],
          filters: [{ name: "parseNumber" }],
        },
        bonusPerHour: { selector: [".panelV2 dl.key-value dd:nth(2)"], filters: [{ name: "parseNumber" }] },
      },
    },
  };
class O extends _ {
  parseTorrentRowForTags(t, r, a) {
    const o = super.parseTorrentRowForTags(t, r, a),
      i = { Free: 100, "75%": 75, "50%": 50, "25%": 25 };
    if (Array.isArray(o.tags)) {
      let u,
        f = -1;
      for (const n of o.tags) {
        const c = i[n.name];
        c !== void 0 && c > f && ((f = c), (u = n));
      }
      u && (o.tags = o.tags.filter((n) => !(n.name in i) || n.name === u.name));
    }
    return o;
  }
  async getUserInfoResult(t = {}) {
    let r = { status: l.unknownError, updateAt: +new Date(), site: this.metadata.id };
    if (!this.allowQueryUserInfo) return ((r.status = l.passParse), r);
    if (Array.isArray(this.metadata.userInfo?.process)) return await super.getUserInfoResult(t);
    try {
      let a;
      (t !== null && t.name ? (a = t.name) : (a = await this.getUserNameFromSite()),
        (r.name = a),
        (r = g(r, await this.getUserInfoFromDetailsPage(a))),
        this.metadata.levelRequirements &&
          r.levelName &&
          typeof r.levelId > "u" &&
          (r.levelId = this.guessUserLevelId(r)),
        (r.bonusPerHour = await this.getUserBonusPerHour(a)),
        (r.status = l.success));
    } catch (a) {
      ((r.status = l.parseError), a instanceof b && (r.status = l.needLogin));
    }
    return r;
  }
  async getUserNameFromSite() {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: t } = await this.request({ url: "/", responseType: "document" }, !0);
    return this.getFieldData(t, this.metadata.userInfo?.selectors?.name);
  }
  async getUserInfoFromDetailsPage(t) {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: r } = await this.request({ url: p("/users", t), responseType: "document" });
    return this.getFieldsData(
      r,
      this.metadata.userInfo?.selectors,
      Object.keys(h(this.metadata.userInfo?.selectors, ["name"])),
    );
  }
  async getUserBonusPerHour(t) {
    const { data: r } = await this.request({ url: `/users/${t}/earnings`, responseType: "document" }, !0);
    return this.getFieldData(r, this.metadata.userInfo?.selectors?.bonusPerHour);
  }
  async getTorrentDownloadLink(t) {
    const r = await super.getTorrentDownloadLink(t);
    if (r && !r.includes("/download/") && r.includes("/torrents/")) {
      const a = t.url?.startsWith("http") ? { url: t.url } : { baseURL: this.url };
      return this.fixLink(`/torrents/download/${t.id}`, a);
    }
    return r;
  }
}
export { B as CategoryFree, V as SchemaMetadata, O as default, s as userInfoTrans };
