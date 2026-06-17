import { p as n } from "../utils/filesize-D_1hx4u8.js";
import o from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
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
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const B = {
  id: "gtru",
  version: 2,
  name: "GayTorrent.ru",
  tags: ["成人"],
  type: "private",
  timezoneOffset: "+0800",
  urls: ["uggcf://jjj.tnlgbe.erag/"],
  legacyUrls: ["https://www.gaytorrent.ru/"],
  category: [
    {
      name: "Status",
      key: "incldead",
      options: [
        { name: "Active", value: 0 },
        { name: "Including dead", value: 1 },
        { name: "Only dead", value: 2 },
      ],
    },
    {
      name: "Category",
      key: "cat",
      options: [
        { name: "AI", value: 69 },
        { name: "Amateur", value: 62 },
        { name: "Anal", value: 29 },
        { name: "Anime Games", value: 46 },
        { name: "Asian", value: 30 },
        { name: "Bareback", value: 43 },
        { name: "BDSM", value: 19 },
        { name: "Bears", value: 17 },
        { name: "Bisexual", value: 59 },
        { name: "Black", value: 44 },
        { name: "Books & Magazines", value: 50 },
        { name: "Chubbies", value: 9 },
        { name: "Clips", value: 7 },
        { name: "Comic & Yaoi", value: 48 },
        { name: "Daddies / Sons", value: 5 },
        { name: "Dildos", value: 67 },
        { name: "Fan Sites", value: 66 },
        { name: "Fetish", value: 34 },
        { name: "Fisting", value: 68 },
        { name: "Grey / Older", value: 27 },
        { name: "Group-Sex", value: 32 },
        { name: "Homemade", value: 63 },
        { name: "Hunks", value: 12 },
        { name: "Images", value: 33 },
        { name: "Interracial", value: 53 },
        { name: "Jocks", value: 57 },
        { name: "Latino", value: 35 },
        { name: "Mature", value: 36 },
        { name: "Media Programs", value: 58 },
        { name: "Member", value: 37 },
        { name: "Middle Eastern", value: 54 },
        { name: "Military", value: 38 },
        { name: "Oral-Sex", value: 39 },
        { name: "Softcore", value: 56 },
        { name: "Solo", value: 40 },
        { name: "Straight older", value: 61 },
        { name: "Straight younger", value: 60 },
        { name: "Themed Movie", value: 45 },
        { name: "Trans", value: 47 },
        { name: "Trans/FTM", value: 70 },
        { name: "TV / Episodes", value: 1 },
        { name: "Twinks", value: 41 },
        { name: "Vintage", value: 42 },
        { name: "Voyeur", value: 51 },
        { name: "Wrestling and Sports", value: 65 },
        { name: "Youngblood", value: 28 },
      ],
      cross: { mode: "append", key: "c" },
    },
    {
      name: "Sort by",
      key: "orderby",
      options: [
        { name: "Upload-Date", value: "added" },
        { name: "Torrent-Name", value: "name" },
        { name: "Category", value: "type" },
        { name: "Size", value: "size" },
        { name: "Times Snatched", value: "snatched" },
        { name: "Seeders", value: "seeds" },
        { name: "Leechers", value: "leeches" },
      ],
    },
    {
      name: "Order",
      key: "sort",
      options: [
        { name: "Descending", value: "desc" },
        { name: "Ascending", value: "asc" },
      ],
    },
  ],
  search: {
    requestConfig: { url: "/search.php", params: { incldead: 1, search: "" } },
    keywordPath: "params.search",
    selectors: {
      rows: { selector: "div.dc-search-grid article.dc-grid-card" },
      id: { selector: "a.dc-grid-card-title", attr: "href", filters: [(e) => e.match(/id=([\w-]+)/)?.[1] ?? e] },
      title: { selector: "a.dc-grid-card-title", attr: "title" },
      url: { selector: "a.dc-grid-card-title", attr: "href" },
      time: {
        selector: "span.dc-grid-card-age",
        attr: "title",
        filters: [(e) => e.replace(/^[^:]*:\s*/, "").trim(), { name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] }],
      },
      size: { selector: "span.dc-grid-card-size", filters: [{ name: "parseSize" }] },
      completed: { selector: "span.dc-grid-card-snat", filters: [{ name: "parseNumber" }] },
      seeders: { selector: "span.dc-grid-card-seeders", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "span.dc-grid-card-leechers", filters: [{ name: "parseNumber" }] },
      category: { selector: "span.dc-grid-main-cat", attr: "title" },
      comments: { selector: "span.dc-grid-card-comments", filters: [{ name: "parseNumber" }] },
    },
  },
  list: [
    {
      urlPattern: ["/search\\.php", "/browse\\.php"],
      selectors: { keywords: { selector: "input[name='search']", attr: "value" } },
    },
  ],
  detail: {
    urlPattern: ["/details\\.php\\?id=[\\w-]+"],
    selectors: { link: { selector: "a[href^='download.php/']", attr: "href" } },
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: "/userdetails.php" },
        selectors: {
          seeding: { selector: "#activeseed", filters: [{ name: "parseNumber" }] },
          bonus: {
            selector: ".ud-stat-row:contains('Total Seed Bonus') .ud-stat-value",
            filters: [{ name: "parseNumber" }],
          },
          name: {
            selector: ".ud-profile-name",
            elementProcess: (e) => (e.textContent || "").replace(/\s+/g, " ").trim(),
          },
          uploaded: {
            selector: ".ud-stat-row:contains('Uploaded') .ud-stat-value",
            filters: [(e) => e.split(/\s*\[/)[0].trim(), { name: "parseSize" }],
          },
          downloaded: {
            selector: ".ud-stat-row:contains('Downloaded') .ud-stat-value",
            filters: [(e) => e.split(/\s*\[/)[0].trim(), { name: "parseSize" }],
          },
          ratio: {
            selector: ".ud-stat-row:contains('Share ratio') .ud-stat-value",
            filters: [{ name: "parseNumber" }],
          },
          levelName: {
            selector: ".ud-profile-meta img[src*='/classes/']",
            attr: "src",
            filters: [
              (e) => {
                const a = e.match(/\/([^/]+)\.\w+$/),
                  r = a ? a[1].toLowerCase() : "";
                return (
                  { user: "User", power: "PowerUser", vip: "VIP", mod: "Moderator", sysop: "SysOp", admin: "Admin" }[
                    r
                  ] || r
                );
              },
            ],
          },
          joinTime: {
            selector: ".ud-profile-meta span:has(i.fa-calendar-o)",
            filters: [
              (e) => e.replace(/\s*\(.*\)\s*$/, "").trim(),
              { name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] },
            ],
          },
          lastAccessAt: {
            selector: ".ud-profile-meta span:has(i.fa-clock-o)",
            filters: [
              (e) => e.replace(/\s*\(.*\)\s*$/, "").trim(),
              { name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] },
            ],
          },
          uploads: {
            selector: "#uploaded table.dc-torrent-table",
            elementProcess: (e) => e.querySelectorAll("tbody tr").length,
          },
          seedingSize: {
            selector: "#seeding table.dc-torrent-table",
            elementProcess: (e) => {
              let a = 0;
              return (
                e.querySelectorAll("tbody tr").forEach((t) => {
                  const s = t.querySelectorAll("td")[2];
                  if (s) {
                    const l = (s.textContent || "")
                      .replace(/\s+/g, " ")
                      .replace(/([\d.]+)\s*([KMGTP]?i?B)/i, "$1 $2")
                      .trim();
                    a += n(l);
                  }
                }),
                a
              );
            },
          },
        },
      },
    ],
  },
  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "PowerUser", interval: "P28D", uploaded: "40GB", ratio: 1.05 },
  ],
};
class N extends o {
  async getTorrentDownloadLink(a) {
    const r = encodeURIComponent((a.title || a.id || "") + ".torrent");
    return `${this.url}download.php?id=${a.id}&rss=1&n=${r}`;
  }
}
export { N as default, B as siteMetadata };
