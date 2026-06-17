import c from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../index-COeZNva1.js";
import { f as d } from "../utils/datetime-DQxMK7bP.js";
import { p } from "../utils/filesize-D_1hx4u8.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const m = [
  { value: 1, name: "Movie" },
  { value: 2, name: "Music" },
  { value: 3, name: "Literature" },
];
function u(t) {
  const e = t
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    r = e.match(/^([A-Za-z]{3})\s+(\d{1,2})\s+'(\d{2})/);
  return r ? d(`${r[2]} ${r[1]} ${r[3]}`, ["d MMM yy"]) : e;
}
function n(t, e) {
  return t.querySelector(`td:nth-child(${e})`)?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}
function i(t) {
  return t?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}
function h(t) {
  const r = t.querySelector("td:nth-child(2)")?.querySelector("span")?.textContent?.replace(/\s+/g, " ").trim() ?? "",
    a = n(t, 3),
    s = n(t, 4),
    o = n(t, 5),
    l = t.querySelector("a[href^='browse.php?country='] img")?.getAttribute("title") ?? "";
  return [a, s, l, o, r].filter(Boolean).join(" / ");
}
function f(t, e) {
  const r = Array.from(t.querySelectorAll("tr")).find((s) => Array.from(s.children).some((o) => i(o) === e));
  if (!r) return;
  let a = 0;
  for (const s of Array.from(r.children)) {
    if (i(s) === e) return a;
    a += s.colSpan || 1;
  }
}
function g(t, e) {
  let r = 0;
  for (const a of Array.from(t.children)) {
    const s = a.colSpan || 1;
    if (e >= r && e < r + s) return a;
    r += s;
  }
}
function y(t) {
  const e = f(t, "Size") ?? 10;
  return Array.from(t.querySelectorAll("tr"))
    .filter((r) => r.querySelector("a[href^='details.php?id=']"))
    .reduce((r, a) => r + p(i(g(a, e))), 0);
}
function b(t) {
  const e = t
      .replace(/,/g, "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    r = e.match(/\((\d+)\s*(?:uploads?|torrents?)?\)/i),
    a = e.match(/(?:uploads?|torrents?)\D+(\d+)/i) ?? e.match(/(\d+)\s*(?:uploads?|torrents?)/i),
    s = r ?? a;
  return s ? parseInt(s[1], 10) : 0;
}
const D = {
  version: 1,
  id: "karagarga",
  name: "KaraGarga",
  aka: ["KG"],
  description: "KaraGarga is a private tracker for non-mainstream movies, music and literature.",
  tags: ["电影", "音乐", "文学"],
  timezoneOffset: "+0000",
  collaborator: ["luckiestone"],
  type: "private",
  schema: "AbstractPrivateSite",
  urls: ["https://karagarga.in/"],
  favicon: "https://karagarga.in/favicon.ico",
  noLoginAssert: { urlPatterns: [/login\.php|takelogin\.php/], matchSelectors: ["form[action='takelogin.php']"] },
  category: [
    { name: "Category", key: "cat", options: m },
    { name: "Freeleech", key: "fl", options: [{ value: 1, name: "Freeleech" }] },
  ],
  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/browse.php",
      responseType: "document",
      params: {
        search_type: "torrent",
        cat: 0,
        genre: "",
        subgenre: "",
        country: 0,
        hdrip: "",
        incldead: "",
        source: "",
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfig: { params: { search_type: "imdb" } },
        requestConfigTransformer: ({ keywords: t, requestConfig: e }) => (
          (e.params.search = t?.replace(/^tt/i, "") ?? ""),
          e
        ),
      },
    },
    selectors: {
      rows: { selector: 'table#browse > tbody > tr:has(a[href^="details.php?id="])' },
      id: { selector: 'a[href^="details.php?id="]', attr: "href", filters: [{ name: "querystring", args: ["id"] }] },
      title: { selector: 'a[href^="details.php?id="] > b' },
      subTitle: { selector: ":self", elementProcess: h },
      url: { selector: 'a[href^="details.php?id="]', attr: "href" },
      link: { selector: 'a[href^="/down.php/"]', attr: "href" },
      time: { selector: "td:nth-child(9)", filters: [u] },
      size: { selector: "td:nth-child(11)", filters: [{ name: "parseSize" }] },
      seeders: { selector: "td:nth-child(13)", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td:nth-child(14)", filters: [{ name: "parseNumber" }] },
      completed: { selector: "td:nth-child(12)", filters: [{ name: "parseNumber" }] },
      comments: { selector: "td:nth-child(7)", filters: [{ name: "parseNumber" }] },
      author: { selector: "td:nth-child(8)" },
      category: { selector: 'a[href^="browse.php?genre="] img', attr: "title", filters: [(t) => t.split(":")[0]] },
      ext_imdb: { selector: 'a[href*="imdb.com/title/tt"]', attr: "href", filters: [{ name: "extImdbId" }] },
      tags: [
        { selector: "span:contains('Freeleech')", name: "Free", color: "blue" },
        { selector: "span:contains('Featured')", name: "Featured", color: "purple" },
        { selector: "font:contains('[NEW!]')", name: "New", color: "green" },
        { selector: "span[title*='dead torrent back to life']", name: "Bumped", color: "green" },
        { selector: "img[title^='CURRENT']", name: "MoM", color: "orange" },
      ],
    },
  },
  list: [
    {
      urlPattern: ["/browse\\.php", "/current\\.php\\?id=\\d+", "/history\\.php\\?id=\\d+"],
      selectors: { keywords: { selector: 'input[name="search"]', elementProcess: (t) => t.value } },
    },
  ],
  detail: {
    urlPattern: ["/details\\.php\\?id=\\d+"],
    selectors: {
      title: { selector: "table.main h1:first" },
      link: { selector: ["a.index[href*='down.php']", 'a[href^="/down.php/"]'], attr: "href" },
      size: {
        selector: "td.heading:contains('Size') + td",
        filters: [{ name: "split", args: ["(", 0] }, { name: "parseSize" }],
      },
    },
  },
  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        selectors: {
          id: {
            selector: "a[title='click to see your details page']:last",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "a[title='click to see your details page']:last" },
          messageCount: {
            selector: "td[style*='background: #DF0101'] a[href*='messages.php']",
            filters: [{ name: "parseNumber" }],
          },
          bonus: { text: "N/A" },
          bonusPerHour: { text: "N/A" },
        },
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        selectors: {
          uploaded: { selector: "td.rowhead:contains('Uploaded') + td", filters: [{ name: "parseSize" }] },
          uploads: { selector: "td.rowhead:contains('Uploaded') + td", filters: [b] },
          downloaded: { selector: "td.rowhead:contains('Downloaded') + td", filters: [{ name: "parseSize" }] },
          ratio: {
            selector: "td.rowhead:contains('Share ratio') + td > table > tbody > tr > td:nth-child(1) > font",
            filters: [{ name: "parseNumber" }],
          },
          levelName: { selector: "td.rowhead:contains('Class') + td" },
          joinTime: {
            selector: "td.rowhead:contains('Join'):contains('date') + td",
            filters: [{ name: "split", args: [" (", 0] }, { name: "parseTime" }],
          },
        },
      },
      {
        requestConfig: { url: "/current.php", responseType: "document" },
        assertion: { id: "params.id" },
        selectors: {
          seeding: {
            selector: "table#browse",
            elementProcess: (t) =>
              Array.from(t.querySelectorAll("tr")).filter((e) => e.querySelector("a[href^='details.php?id=']")).length,
          },
          seedingSize: { selector: "table#browse", elementProcess: y },
        },
      },
    ],
  },
  levelRequirements: [{ id: 1, name: "Power User", interval: "P13W", uploaded: "50GB", ratio: 1.05 }],
};
class E extends c {
  async getUserInfoResult(e = {}) {
    const r = await super.getUserInfoResult(e),
      a = r;
    return ((a.bonus = "N/A"), (a.bonusPerHour = "N/A"), r);
  }
  parseTorrentRowForTags(e, r, a) {
    if (((e = super.parseTorrentRowForTags(e, r, a)), r instanceof Element)) {
      const s = e.tags ?? [];
      (r.classList.contains("freeleechrow") &&
        !s.some((o) => o.name === "Free") &&
        s.push({ name: "Free", color: "blue" }),
        r.classList.contains("featuredrow") &&
          !s.some((o) => o.name === "Featured") &&
          s.push({ name: "Featured", color: "purple" }),
        (e.tags = s));
    }
    return e;
  }
}
export { E as default, D as siteMetadata };
