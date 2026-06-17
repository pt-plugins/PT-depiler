import D, { GazelleUtils as b, SchemaMetadata as l, detailPageList as h } from "../schemas/Gazelle-C72SbirH.js";
import k from "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import { a3 as y, bk as T } from "../index-COeZNva1.js";
import { f as P } from "../utils/datetime-DQxMK7bP.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
import "../utils/filesize-D_1hx4u8.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
const S = ["Episode", "Season"],
  m = {
    id: {
      selector: "a[href^='/torrent/'][title='Download torrent']",
      attr: "href",
      filters: [(e) => e.match(/\/torrent\/(\d+)/)?.[1]],
    },
    link: { selector: "a[href^='/torrent/'][title='Download torrent']", attr: "href" },
    url: {
      selector: ["a[href^='torrents'][class]", "a[href*='torrents.php?id=']", "a[href*='torrents2.php?id=']"],
      attr: "href",
    },
    tags: [{ name: "Free", selector: "img[alt='Freeleech!']", color: "blue" }],
  },
  v = u("a[href*='torrents'][class]", (e) => e.replaceAll("»", "").trim()),
  g = (e) => (Array.isArray(e) && e.length > 0 ? _(e) : e);
function u(e, t) {
  const r = ["|", "/"];
  return {
    selector: ":self",
    elementProcess: (s) => {
      const a = s.dataset.episode,
        i = s.querySelector(e);
      if (!i) return "";
      const p = i.innerText || i.textContent || "",
        c = r.find((d) => p.includes(d)) || "|",
        n = p
          .split(c)
          .map(t || ((d) => d.trim()))
          .filter(Boolean),
        f = b.filterTags(n, S).join(` ${c} `);
      return `${a ? `Episode ${a} ${c} ` : ""}${f}`;
    },
  };
}
function _(e) {
  let t = "";
  for (const r of e) {
    if (r.classList.contains("edition_info")) {
      const a = (r.querySelector("td > strong")?.textContent || "").match(/Episode\s*(\d+)/i);
      t = a ? a[1].trim() : "";
      continue;
    }
    t && (r.dataset.episode = t);
  }
  return e;
}
const Q = {
  ...l,
  version: 1,
  id: "animebytes",
  name: "AnimeBytes",
  aka: ["AB"],
  description: "AnimeBytes is a Private site. Powered by Tentacles",
  tags: ["动漫", "音乐", "游戏"],
  timezoneOffset: "+0000",
  collaborator: ["MewX", "sabersalv"],
  type: "private",
  schema: "Gazelle",
  urls: ["uggcf://navzrolgrf.gi/"],
  category: [
    {
      name: "搜索入口",
      key: "search_type",
      options: [
        { name: "动漫", value: "anime" },
        { name: "音乐", value: "music" },
      ],
      generateRequestConfig: (e) => ({ requestConfig: { params: { type: e.toString() } } }),
    },
    {
      name: "Categories (Anime)",
      key: "categories_anime",
      notes: "请先设置分类入口为“动漫”！",
      options: [
        { name: "TV Series", value: "tv_series" },
        { name: "TV Special", value: "tv_special" },
        { name: "OVA", value: "ova" },
        { name: "ONA", value: "ona" },
        { name: "DVD Special", value: "dvd_special" },
        { name: "BD Special", value: "bd_special" },
        { name: "Movie", value: "movie" },
      ],
      cross: { key: "anime", mode: "appendQuote" },
    },
    {
      name: "Categories (Game)",
      key: "categories_game",
      notes: "请先设置分类入口为“动漫”！",
      options: [
        { name: "Game", value: "game" },
        { name: "Game Visual Novel", value: "visual_novel" },
      ],
      cross: { key: "gamec", mode: "appendQuote" },
    },
    {
      name: "Categories (Printed Media)",
      key: "categories_printed",
      notes: "请先设置分类入口为“动漫”！",
      options: [
        { name: "Manga", value: "manga" },
        { name: "Oneshot", value: "oneshot" },
        { name: "Anthology", value: "anthology" },
        { name: "Manhwa", value: "manhwa" },
        { name: "Light Novel", value: "light_novel" },
        { name: "Artbook", value: "artbook" },
      ],
      cross: { key: "printedtype", mode: "appendQuote" },
    },
  ],
  search: {
    ...l.search,
    requestConfig: {
      url: "/scrape.php",
      responseType: "json",
      params: { sort: "grouptime", way: "desc", type: "anime", limit: 50 },
    },
    requestConfigTransformer: ({ keywords: e, requestConfig: t }) => (
      (!e || e.trim().length == 0) && (t.params.limit = 15),
      t
    ),
  },
  searchEntry: {
    area_anime: { name: "动漫", requestConfig: { params: { type: "anime" } } },
    area_music: { name: "音乐", enabled: !1, requestConfig: { params: { type: "music" } } },
  },
  list: [
    {
      urlPattern: [/\/torrents2?\.php(?!.*(?:\bid=|torrentid=))/],
      mergeSearchSelectors: !1,
      selectors: {
        ...l.search.selectors,
        rows: {
          selector: "div.group_cont",
          filter: (e) => {
            if (Array.isArray(e) && e.length > 0) {
              const t = [];
              for (const r of e) {
                const s = r.querySelector("div.group_main");
                if (!s) continue;
                const a = r.querySelector("span.cat");
                a && (s.dataset.cat = a.textContent);
                const i = r.querySelector("div.group_statbox a[href*='anidb.net/anime/']");
                i && (s.dataset.anidb = T(i.getAttribute("href")));
                const p = Array.from(r.querySelectorAll("table.torrent_group > tbody > tr")),
                  c = _(p).map((n) => ((n.className = "group_torrent"), n));
                t.push(s, ...c);
              }
              return t;
            }
            return e;
          },
        },
        title: { selector: "span.group_title > strong" },
        category: { selector: ":self", data: "cat" },
        ext_anidb: { selector: ":self", data: "anidb" },
        id: { selector: ":self", attr: "id", filters: [{ name: "parseNumber" }] },
        url: { selector: "td.torrent_properties > a[href^='torrents']", attr: "href" },
        link: { selector: "span.download_link > a[href^='/torrent/']", attr: "href" },
        subTitle: u("a[href^='torrents']"),
        time: { text: 0 },
        size: { selector: "td.torrent_size > span", filters: [{ name: "parseSize" }] },
        completed: { selector: "td.torrent_snatched > span" },
        seeders: { selector: "td.torrent_seeders > span" },
        leechers: { selector: "td.torrent_leechers > span" },
        tags: [{ name: "Free", selector: "td.torrent_properties img[alt='Freeleech!']", color: "blue" }],
      },
    },
    {
      ...h,
      urlPattern: [/\/torrents2?\.php\?(?:.*&)?(\bid|torrentid)=\d+/],
      mergeSearchSelectors: !1,
      selectors: {
        ...l.search.selectors,
        ...m,
        keywords: { selector: ["div.thin > h2 > a[href^='/series.php']", "div.thin > h2"] },
        title: { selector: "div.thin > h2" },
        rows: {
          ...h.selectors.rows,
          filter: (e) => {
            const t = h.selectors.rows.filter(e);
            return g(t);
          },
        },
        subTitle: u("a[href^='/torrents']", (e) => e.replaceAll("»", "").trim()),
        time: {
          selector: "+tr span[style][class][title]:first",
          filters: [{ name: "parseTime", args: ["MMM dd yyyy, HH:mm 'UTC'"] }],
        },
      },
    },
    {
      urlPattern: [
        "/collage\\.php.*?[&?]id=\\d+",
        "/company\\.php.*?[&?]id=\\d+",
        "/seiyuu\\.php.*?[&?]id=\\d+",
        "/characters\\.php.*?[&?]id=\\d+",
      ],
      mergeSearchSelectors: !1,
      selectors: {
        ...l.search.selectors,
        ...m,
        title: { selector: "td > strong:has(a[title='View Torrent'])" },
        category: { selector: "img[src^='/static/common/caticons/']", attr: "title" },
        rows: { ...l.search.selectors.rows, filter: g },
        subTitle: v,
      },
    },
    {
      urlPattern: ["/series\\.php.*?[&?]id=\\d+", "/artist\\.php.*?[&?]id=\\d+"],
      mergeSearchSelectors: !1,
      selectors: {
        ...l.search.selectors,
        ...m,
        rows: { ...l.search.selectors.rows, filter: g },
        title: { selector: "td > h3" },
        subTitle: v,
      },
    },
    {
      urlPattern: ["/alltorrents\\.php"],
      mergeSearchSelectors: !1,
      selectors: {
        ...l.search.selectors,
        ...m,
        time: { text: 0 },
        category: { selector: "img[src^='/static/common/caticons/']", attr: "title" },
        title: {
          selector: "td:has(a[href^='/torrent/'][title='Download torrent'])",
          elementProcess: (e) =>
            (e.innerText || e.textContent)
              .split(
                `
`,
              )[0]
              ?.replaceAll("[DL]", ""),
        },
        subTitle: u("td:has(a[href^='/torrent/'][title='Download torrent'])", (e) =>
          e.includes("[DL]") ? "" : e.trim(),
        ),
      },
    },
  ],
  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        selectors: {
          id: { selector: "#stats_menu > a:first", attr: "href", filters: [{ name: "querystring", args: ["userid"] }] },
          name: { selector: "a.username:first" },
        },
      },
      {
        requestConfig: { url: "/user.php", responseType: "document" },
        assertion: { id: "params.id" },
        selectors: {
          messageCount: { text: 0, selector: ".alertbar.notice span.new_count", filters: [{ name: "parseNumber" }] },
          uploads: { selector: "dt:contains('Torrents Uploaded:') + dd", filters: [{ name: "parseNumber" }] },
          uploaded: {
            selector: "dt:contains('Uploaded:') + dd > span",
            attr: "title",
            filters: [{ name: "parseNumber" }],
          },
          downloaded: {
            selector: "dt:contains('Downloaded:') + dd > span",
            attr: "title",
            filters: [{ name: "parseNumber" }],
          },
          ratio: { text: -1, selector: ["dt:contains('Ratio:') + dd > span"], filters: [{ name: "parseNumber" }] },
          seeding: { selector: "dt:contains('Seeding:') + dd", filters: [{ name: "parseNumber" }] },
          seedingSize: {
            selector: "dt:contains('Total seed size:') + dd > span",
            attr: "title",
            filters: [{ name: "parseNumber" }],
          },
          levelName: { selector: "dt:contains('Class:') + dd" },
          bonus: { selector: "#yen_count > a", filters: [{ name: "parseNumber" }] },
          bonusPerHour: {
            selector: "dt:contains('Yen per day:') + dd",
            filters: [(e) => e.replace(/,/g, "").match(/[\d.]+/), (e) => (e ? parseFloat(e[0]) / 24 : 0)],
          },
          joinTime: {
            selector: "dt:contains('Joined:') + dd > span",
            attr: "title",
            filters: [{ name: "parseTime", args: ["MMM dd yyyy, HH:mm 'UTC'"] }],
          },
          lastAccessAt: {
            selector: "dt:contains('Last Seen') + dd >span",
            attr: "title",
            filters: [{ name: "parseTime", args: ["MMM dd yyyy, HH:mm 'UTC'"] }],
          },
          hnrUnsatisfied: {
            selector: "ul.stats li:contains('H&Rs:')",
            attr: "title",
            filters: [
              (e) => {
                const t = e.match(/\d+/g);
                return t && t.length >= 1 ? parseInt(t[0]) : 0;
              },
            ],
          },
          hnrPreWarning: {
            selector: "ul.stats li:contains('H&Rs:')",
            attr: "title",
            filters: [
              (e) => {
                const t = e.match(/\d+/g);
                return t && t.length >= 2 ? parseInt(t[1]) : 0;
              },
            ],
          },
        },
      },
    ],
  },
  levelRequirements: [
    { id: 0, name: "Aka-chan", privilege: "新用户的默认级别" },
    { id: 1, name: "User", interval: "P1W", uploaded: "10.5GB", ratio: 0.5, privilege: "发送邀请" },
    {
      id: 2,
      name: "Power User",
      interval: "P2W",
      uploads: 10,
      uploaded: "25GB",
      ratio: 0.7,
      isKept: !0,
      privilege: "访问邀请区，每月固定邀请名额，免于非活动修剪",
    },
    { id: 3, name: "Elite", interval: "P30D", uploads: 50, uploaded: "100GB", ratio: 0.8, isKept: !0, privilege: "" },
    {
      id: 4,
      name: "Torrent Master",
      interval: "P90D",
      uploads: 100,
      uploaded: "500GB",
      ratio: 0.9,
      isKept: !0,
      privilege: "超出用户限制也可以发送邀请",
    },
    { id: 5, name: "Legend", interval: "P180D", uploads: 500, uploaded: "1TB", ratio: 1, isKept: !0, privilege: "" },
  ],
};
class J extends D {
  _baseUserInfo;
  async getBaseUserInfo() {
    let t = this._baseUserInfo?.username,
      r = this._baseUserInfo?.passkey;
    if (!t || !r) {
      const { data: s } = await this.request({ url: "/", responseType: "document" }),
        a = s.documentElement;
      (t || (t = this.getFieldData(a, { selector: "a.username:first" })),
        r ||
          (r = this.getFieldData(a, {
            selector: "link[href^='/feed/rss_torrents_all/']",
            attr: "href",
            filters: [{ name: "split", args: ["/", 3] }],
          })),
        (this._baseUserInfo = { username: t, passkey: r }));
    }
    return { username: t, passkey: r };
  }
  async request(t, r = !0) {
    if (t.url?.includes("/scrape.php")) {
      const s = await this.getBaseUserInfo();
      t.params = { ...t.params, torrent_pass: s.passkey, username: s.username };
    }
    return super.request(t, r);
  }
  get torrentClasses() {
    return { ...super.torrentClasses, group: ["group_main", ...super.torrentClasses.group] };
  }
  guessSearchFieldIndexConfig() {
    return { ...super.guessSearchFieldIndexConfig(), time: [] };
  }
  async transformSearchPage(t, r) {
    if (t instanceof Node) return super.transformSearchPage(t, r);
    const s = [],
      a = r.requestConfig?.params?.type,
      i = a === "music" ? " / " : " | ",
      p = a === "music" ? "torrents2.php" : "torrents.php",
      c = t.Groups;
    for (const n of c) {
      const f = y(n.FullName);
      for (const o of n.Torrents) {
        const d = [];
        o.RawDownMultiplier === 0 && d.push({ name: "Free", color: "blue" });
        try {
          s.push({
            site: this.metadata.id,
            id: o.ID,
            title: f,
            subTitle: `${o.EditionData.EditionTitle ? `${y(o.EditionData.EditionTitle).trim()} ${i.trim()}` : ""} ${b.extractTags(o.Property, S, i)}`,
            url: `${this.url}${p}?id=${n.ID}&torrentid=${o.ID}`,
            link: o.Link,
            time: P(o.UploadTime),
            size: o.Size,
            seeders: o.Seeders,
            leechers: o.Leechers,
            completed: o.Snatched,
            comments: n.Comments,
            category: n.CategoryName,
            tags: d,
            ext_anidb: n.Links?.AniDB ? T(n.Links.AniDB) : null,
          });
        } catch (w) {
          console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, w, o);
        }
      }
    }
    return s;
  }
  async getTorrentDownloadLink(t) {
    return k.prototype.getTorrentDownloadLink.call(this, t);
  }
  getTorrentGroupInfo(t, r) {
    return this.getFieldsData(t, r.searchEntry.selectors, ["title", "category", "ext_anidb"]);
  }
}
export { J as default, Q as siteMetadata };
