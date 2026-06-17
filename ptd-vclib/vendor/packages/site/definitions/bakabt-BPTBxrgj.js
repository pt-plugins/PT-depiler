import i from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../index-COeZNva1.js";
import { d as n } from "../utils/filter-Dko2hrfF.js";
import { b as l } from "../utils/helper-OCngMtkv.js";
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
import "../utils/filesize-D_1hx4u8.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const c = {
    1: "Anime Series",
    2: "OVA",
    3: "Soundtrack",
    4: "Manga",
    5: "Anime Movie",
    6: "Live Action",
    7: "Artbook",
    8: "Music Video",
    9: "Light Novel",
  },
  L = {
    version: 1,
    id: "bakabt",
    name: "BakaBT",
    aka: ["BBT"],
    description: "BakaBT is a Private site for the Anime Community",
    tags: ["动漫"],
    timezoneOffset: "+0000",
    type: "private",
    schema: "AbstractPrivateSite",
    urls: ["uggcf://onxnog.zr/"],
    category: [
      { name: "类别", key: "category", options: l(c), cross: { mode: "append", key: "c" } },
      {
        name: "成人内容",
        key: "hentai",
        notes: "请先在站点设置中启用 Browse -> Show adult content",
        options: [
          { name: "显示", value: 1 },
          { name: "不显示", value: 0 },
        ],
      },
    ],
    search: {
      keywordPath: "params.q",
      requestConfig: {
        url: "/browse.php",
        responseType: "document",
        params: { only: 0, incomplete: 1, lossless: 1, hd: 1, multiaudio: 1, bonus: 1, reorder: 1 },
      },
      advanceKeywordParams: { imdb: !1 },
      selectors: {
        rows: {
          selector: ".torrents tr.torrent, .torrents tr.torrent_alt",
          filter: (e) =>
            Array.isArray(e)
              ? e.filter((t) => !(t.classList.contains("torrent_alt") && t.textContent === "Alternative versions: "))
              : e,
        },
        id: { selector: ["a.title", "a.alt_title"], attr: "href", filters: [{ name: "split", args: ["/", 2] }] },
        title: { selector: ["a.title", "a.alt_title"], filters: [{ name: "trim" }] },
        subTitle: { selector: "span.tags" },
        url: { selector: ".peers a", attr: "href" },
        category: { text: "stub", selector: "span.torrent_icon", attr: "title" },
        time: {
          selector: ":self",
          elementProcess: (e) => {
            if (e.dataset.timestamp) return parseInt(e.dataset.timestamp);
            const t = e.querySelector(".added"),
              r = t.querySelector("span.datetime");
            if (r) return parseInt(r.dataset.timestamp);
            const s = new Date();
            return (t.textContent === "yesterday" && s.setDate(s.getDate() - 1), s.getTime());
          },
        },
        size: { selector: ".size", filters: [{ name: "parseSize" }] },
        completed: { selector: ".peers:first", filters: [{ name: "split", args: ["/", 0] }, { name: "trim" }] },
        seeders: { selector: ".peers a:nth-child(1)" },
        leechers: { selector: ".peers a:nth-child(2)" },
        tags: [
          { name: "Free", selector: "span.freeleech" },
          { name: "Bonus", selector: "span.bonus", color: "yellow" },
          { name: "Incomplete", selector: "span.incomplete", color: "black" },
          { name: "Hentai", selector: "span.hentai", color: "pink" },
        ],
      },
    },
    detail: {
      urlPattern: [/\/torrent\/(\d+)\/([^/]+)$/],
      selectors: { title: { selector: "div.title" }, link: { selector: ".download_link", attr: "href" } },
    },
    userInfo: {
      pickLast: ["id"],
      process: [
        {
          requestConfig: { url: "/", responseType: "document" },
          selectors: { id: { selector: "a.username", attr: "href", filters: [{ name: "split", args: ["/", 2] }] } },
        },
        {
          requestConfig: { url: "/bonus.php", responseType: "document" },
          selectors: { bonusPerHour: { selector: "b.success", filters: [{ name: "parseNumber" }] } },
        },
        {
          requestConfig: { url: "/user/$id$/", responseType: "document" },
          assertion: { id: "url" },
          selectors: {
            name: { selector: "a.username" },
            levelName: { selector: "h2 > span", filters: [(e) => e.match(/^\((.+?) - (.+?)\)$/)[2]] },
            messageCount: { selector: "a[href='/inbox.php'] > strong", filters: [{ name: "parseNumber" }] },
            joinTime: {
              selector: "td:contains('Join date') + td > span.datetime",
              data: "timestamp",
              filters: [(e) => parseInt(e) * 1e3],
            },
            lastAccessAt: {
              selector: "td:contains('Last seen') + td > span.datetime",
              data: "timestamp",
              filters: [(e) => parseInt(e) * 1e3],
            },
            uploaded: {
              selector: "td:contains('Uploaded') + td",
              filters: [{ name: "split", args: ["-", 0] }, { name: "parseSize" }],
            },
            downloaded: {
              selector: "td:contains('Downloaded') + td",
              filters: [{ name: "split", args: ["-", 0] }, { name: "parseSize" }],
            },
            ratio: {
              selector: "td:contains('Share ratio') + td > span",
              filters: [
                (e) => {
                  if (e === "∞") return -1;
                  const t = e.replace(/,/g, "");
                  return n.parseNumber(t);
                },
              ],
            },
            bonus: { selector: "td:contains('Bonus Points') + td", filters: [{ name: "parseNumber" }] },
            uploads: { selector: "li#uploaded_tab > a", filters: [{ name: "parseNumber" }] },
            seeding: { selector: "li#active_tab > a", filters: [{ name: "parseNumber" }] },
            seedingSize: {
              selector: "div#tab_content > div#active table.torrents > tbody",
              elementProcess: (e) => {
                const t = e.querySelectorAll("tr");
                let r = 0;
                return (
                  t.forEach((s) => {
                    const a = s.querySelector("td.size");
                    a && (r += n.parseSize(a.innerText));
                  }),
                  r
                );
              },
            },
          },
        },
      ],
    },
    levelRequirements: [
      { id: 1, name: "User" },
      {
        id: 2,
        name: "Power User",
        seedingSize: "25GB",
        downloaded: "25GB",
        ratio: 0.5,
        privilege: "View peer lists & report torrents; Access to RSS; Can make up to 5 torrent offers simultaneously.",
      },
    ],
  };
class _ extends i {
  async transformSearchPage(t, r) {
    const s = await super.transformSearchPage(t, r);
    let a = null;
    return s.map((o) => (o.category === "stub" ? ((o.category = a ?? ""), o) : ((a = o.category), o)));
  }
  async getTorrentDownloadLink(t) {
    const r = await super.getTorrentDownloadLink(t),
      s = t.url?.startsWith("http") ? { url: t.url } : { baseURL: this.url };
    return this.fixLink(r, s);
  }
}
export { _ as default, L as siteMetadata };
