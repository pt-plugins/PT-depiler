import o, { SchemaMetadata as i } from "../schemas/GazelleJSONAPI-1mDVuO-b.js";
import { GazelleUtils as l, SchemaMetadata as a } from "../schemas/Gazelle-C72SbirH.js";
import n from "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../index-COeZNva1.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../types/base-Dy_28wGT.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
import "../utils/filesize-D_1hx4u8.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
const s = [
    { name: "MacOS Apps", class: "macosapps", value: 1 },
    { name: "MacOS Games", class: "macosgames", value: 2 },
    { name: "iOS Apps", class: "iosapps", value: 3 },
    { name: "iOS Games", class: "iosgames", value: 4 },
    { name: "Graphics", class: "graphics", value: 5 },
    { name: "Audio", class: "audio", value: 6 },
    { name: "Tutorials", class: "tutorials", value: 7 },
    { name: "Other", class: "other", value: 8 },
  ],
  m = s.reduce((t, e) => ((t[e.class] = e.name), t), {}),
  c = s.map(({ name: t, value: e }) => ({ name: t, value: e })),
  N = {
    ...i,
    version: 1,
    id: "brokenstones",
    name: "BrokenStones",
    aka: ["BRKs"],
    description: "Broken Stones is a Private site for MacOS and iOS APPS / GAMES",
    tags: ["软件", "游戏"],
    timezoneOffset: "-0100",
    type: "private",
    schema: "GazelleJSONAPI",
    urls: ["uggcf://oebxrafgbarf.vf/"],
    category: [
      { name: "Category", key: "filter_cat", options: c, cross: { mode: "appendQuote" } },
      {
        name: "Leech Status",
        key: "freetorrent",
        options: [
          { value: 0, name: "Normal" },
          { value: 1, name: "Free" },
          { value: 2, name: "Neutral" },
          { value: 3, name: "Either" },
        ],
      },
    ],
    search: {
      ...a.search,
      requestConfig: {
        url: "/torrents.php",
        responseType: "document",
        params: { group_results: 0, order_way: "desc", searchsubmit: 1 },
      },
      advanceKeywordParams: { imdb: !1 },
      selectors: {
        ...a.search.selectors,
        subTitle: { selector: "div.torrent_info:first", filters: [l.extractTags] },
        category: {
          text: "Other",
          selector: "div[class^='tooltip cats_']",
          attr: "class",
          filters: [
            (t) => {
              const e = t.match(/cats_(\w+)/);
              return e ? m[e[1]] : "";
            },
          ],
        },
        time: {
          selector: "span.time[title]",
          attr: "title",
          filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm"] }],
        },
        link: { selector: "a[href*='torrents.php?action=download']:first", attr: "href" },
        size: { selector: "td:nth-child(5)", filters: [{ name: "parseSize" }] },
        comments: { selector: "td:nth-child(6) > a" },
        seeders: { selector: "td:nth-child(8)" },
        leechers: { selector: "td:nth-child(9)" },
        completed: { selector: "td:nth-child(7)" },
        tags: [
          { name: "Free", selector: "strong.tl_free:not(.tl_neutral)" },
          { name: "Neutral", selector: "strong.tl_neutral", color: "cyan" },
        ],
      },
    },
    list: [
      {
        urlPattern: ["/torrents.php"],
        excludeUrlPattern: [/\/torrents\.php\?(?:.*&)?(id|torrentid)=\d+/, /searchstr=(?:tt)?\d+/],
        selectors: {
          time: {
            selector: "span.time",
            filters: [
              { name: "parseTTL" },
              (t) => {
                const r = new Date().getTimezoneOffset() * 60 * 1e3;
                return t - 1 * 36e5 + r;
              },
            ],
          },
        },
      },
    ],
    levelRequirements: [
      { id: 1, name: "User" },
      {
        id: 2,
        name: "Member",
        interval: "P1W",
        uploaded: "10GB",
        ratio: 0.7,
        privilege: "Live searching/suggestions, Can edit collages, make requests",
      },
      {
        id: 3,
        name: "Power User",
        interval: "P4W",
        uploaded: "50GB",
        uploads: 1,
        ratio: 1.05,
        isKept: !0,
        privilege: "Receives invites, create new collages, immune from inactivity disabling",
      },
      {
        id: 4,
        name: "Extreme User",
        interval: "P4W",
        uploaded: "75GB",
        uploads: 10,
        ratio: 1.05,
        isKept: !0,
        privilege: "Can upload freeware (set to Neutral Leech)",
      },
      {
        id: 5,
        name: "Elite",
        interval: "P4W",
        uploaded: "100GB",
        uploads: 50,
        ratio: 1.05,
        isKept: !0,
        privilege: "Top 10 filters & Can edit any torrent and any torrent group.",
      },
      { id: 6, name: "VIP", groupType: "vip", privilege: "Custom title & Unlimited Invites" },
    ],
  };
class U extends o {
  async transformSearchPage(e, r) {
    return n.prototype.transformSearchPage.call(this, e, r);
  }
}
export { U as default, N as siteMetadata };
