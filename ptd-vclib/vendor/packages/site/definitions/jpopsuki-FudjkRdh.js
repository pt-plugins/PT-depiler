import d, {
  SchemaMetadata as o,
  commonPagesList as p,
  detailPageList as l,
  top10PageList as n,
  GazelleUtils as u,
} from "../schemas/Gazelle-C72SbirH.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
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
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const c = {
  en: {
    stats: "Stats",
    community: "Community",
    personal: "Personal",
    uploaded: "Uploaded",
    downloaded: "Downloaded",
    seeding: "Seeding:",
    bonus: "Bonus Points:",
    levelName: "Class:",
    joinTime: "Joined:",
    lastAccessAt: "Last Seen:",
  },
  ja: {
    stats: "統計情報",
    community: "コミュニティ",
    personal: "個人情報",
    uploaded: "アップロード数",
    seeding: "シード中",
    bonus: "ボーナスポイント",
    levelName: "階級:",
    lastAccessAt: "最後にアクセスした時:",
  },
};
function r(t, e) {
  const s = c.en[e];
  return Object.values(c).map((a) => `div:contains('${a[t]}') + ul.stats > li:contains('${a[e] || s}')`);
}
const K = {
  ...o,
  version: 3,
  id: "jpopsuki",
  name: "JPopSuki",
  aka: ["JPS", "JPOP"],
  description: "JPopSuki是一个专注于日本音乐的音乐PT站点",
  tags: ["音乐", "日韩"],
  timezoneOffset: "+0000",
  collaborator: ["ronggang", "ted423", "luckiestone", "amorphobia"],
  type: "private",
  schema: "Gazelle",
  urls: ["https://jpopsuki.eu/"],
  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: [
        { value: 1, name: "Album" },
        { value: 2, name: "Single" },
        { value: 3, name: "PV" },
        { value: 4, name: "DVD" },
        { value: 5, name: "TV-Music" },
        { value: 6, name: "TV-Variety" },
        { value: 7, name: "TV-Drama" },
        { value: 8, name: "Fansubs" },
        { value: 9, name: "Pictures" },
        { value: 10, name: "Misc" },
      ],
      cross: { mode: "appendQuote" },
    },
  ],
  search: {
    ...o.search,
    keywordPath: "params.torrentname",
    requestConfig: { url: "/ajax.php", params: { section: "torrents", action: "advanced", disablegrouping: 1 } },
    advanceKeywordParams: { imdb: !1 },
    selectors: {
      ...o.search.selectors,
      title: {
        ...o.search.selectors.title,
        elementProcess: u.genTitleElementProcess({ tdSelector: "td:has(a[href*='torrents.php?id='][title])" }),
      },
      comments: { text: 0, selector: 'a[href*="#comments"][title="View Comments"]' },
      category: { selector: "a[href*='filter_cat']" },
      link: { selector: "a[href*='torrents.php?action=download'][title='Download']", attr: "href" },
      tags: [{ selector: "strong:contains('Freeleech!')", name: "Free", color: "blue" }],
    },
  },
  list: [
    { ...p },
    {
      ...l,
      selectors: {
        ...l.selectors,
        keywords: {
          selector: "div > h2",
          elementProcess: (t) => {
            const e = t.cloneNode(!0);
            e.querySelectorAll("a[href*='artist.php']").forEach((m) => m.remove());
            const s = e.innerText ?? e.textContent,
              a = s.indexOf("]"),
              i = s.indexOf("-", a);
            return s.slice(i + 1).trim();
          },
        },
        title: { selector: "div > h2", filters: [(t) => t.slice(t.indexOf("]") + 1)] },
        category: { selector: "div > h2", filters: [(t) => t.match(/\[([^\]]+)\]/)?.[1] || ""] },
        time: { selector: "+tr span[title]", filters: [{ name: "parseTime" }] },
      },
    },
    {
      ...n,
      selectors: {
        ...n.selectors,
        rows: { ...n.selectors.rows, selector: "table.border tr:gt(0)" },
        size: { selector: ">td:eq(3)", filters: [{ name: "parseSize" }] },
        completed: { selector: ">td:eq(4)", filters: [{ name: "parseNumber" }] },
        seeders: { selector: ">td:eq(5)", filters: [{ name: "parseNumber" }] },
        leechers: { selector: ">td:eq(6)", filters: [{ name: "parseNumber" }] },
      },
    },
  ],
  noLoginAssert: { matchSelectors: ["a[href='login.php']"] },
  userInfo: {
    ...o.userInfo,
    selectors: {
      ...o.userInfo.selectors,
      uploaded: { selector: r("stats", "uploaded"), filters: [{ name: "parseSize" }] },
      downloaded: { selector: r("stats", "downloaded"), filters: [{ name: "parseSize" }] },
      seeding: { selector: r("community", "seeding"), filters: [{ name: "parseNumber" }] },
      levelName: {
        selector: r("personal", "levelName"),
        filters: [
          (t) => {
            const e = t.match(/(Class:|階級:).+?(.+)/);
            return e && e.length >= 3 ? e[2] : "";
          },
        ],
      },
      joinTime: {
        selector: r("stats", "joinTime").map((t) => `${t} > span`),
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMM dd yyyy, HH:mm"] }],
      },
      lastAccessAt: {
        selector: r("stats", "lastAccessAt").map((t) => `${t} > span`),
        attr: "title",
        filters: [{ name: "parseTime", args: ["MMMM dd yyyy, HH:mm"] }],
      },
      uploads: { selector: r("community", "uploaded"), filters: [{ name: "parseNumber" }] },
    },
  },
  levelRequirements: [
    { id: 1, name: "User", isKept: !0, privilege: "Can download/upload." },
    {
      id: 2,
      name: "Member",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.7,
      downloaded: "1KB",
      isKept: !0,
      privilege:
        "Can use invites, notifications, set a forum signature, access the Top 10 and edit the Knowledge base.",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P2W",
      uploaded: "25GB",
      ratio: 1.05,
      downloaded: "1KB",
      uploads: 5,
      isKept: !0,
      privilege:
        "advanced Top 10, can view torrent snatched list, edit torrent's description, original title and release date and access the advanced user search. Receives a new invite once per month (up to a maximum of 10 available invites).",
    },
  ],
};
class L extends d {
  guessSearchFieldIndexConfig() {
    const e = super.guessSearchFieldIndexConfig();
    return {
      time: ["a[href*='order_by=s3']", ...e.time],
      size: ["a[href*='order_by=s4']", "strong:contains('サイズ')", ...e.size],
      seeders: ["a[href*='order_by=s6']", ...e.seeders],
      leechers: ["a[href*='order_by=s7']", ...e.leechers],
      completed: ["a[href*='order_by=s5']", ...e.completed],
    };
  }
  getTorrentGroupInfo(e, s) {
    return this.getFieldsData(e, s.searchEntry.selectors, ["title", "comments", "category"]);
  }
  async getUserTorrentList(e, s = 1, a = "seeding") {
    const { data: i } = await this.request({
      url: "/ajax.php",
      params: { section: "torrents", userid: e, page: s, type: a },
      responseType: "document",
    });
    return i;
  }
}
export { L as default, K as siteMetadata };
