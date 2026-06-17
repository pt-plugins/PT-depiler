import { a3 as n, S as o, c5 as u, bD as f } from "../index-COeZNva1.js";
import { e as h } from "../utils/datetime-DQxMK7bP.js";
import { d as m } from "../utils/filter-Dko2hrfF.js";
import { a as g } from "../utils/helper-OCngMtkv.js";
import v, { SchemaMetadata as s } from "../schemas/GazelleJSONAPI-1mDVuO-b.js";
import S from "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../schemas/Gazelle-C72SbirH.js";
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
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
const c = ["SD", "720p", "1080p", "2160p", "4k", "DVD-R", "BDMV"],
  l = ["CD", "DVD", "WEB", "Vinyl"],
  y = { Movies: new Set(c), Music: new Set(l) },
  q = {
    ...s,
    version: 2,
    id: "secretcinema",
    name: "Secret Cinema",
    aka: ["SC"],
    description: "Secret Cinema is a Private ratioless site for rare MOVIES.",
    tags: ["电影", "电子书", "音乐"],
    timezoneOffset: "+0100",
    type: "private",
    schema: "GazelleJSONAPI",
    urls: ["uggcf://frperg-pvarzn.cj/"],
    category: [
      {
        name: "Category",
        key: "filter_cat",
        options: [
          { name: "Movies", value: 1 },
          { name: "Music", value: 2 },
          { name: "E-Books", value: 3 },
        ],
        cross: { mode: "appendQuote" },
      },
      { name: "Source", key: "media", options: g([c, l]) },
    ],
    search: {
      ...s.search,
      advanceKeywordParams: {
        imdb: {
          requestConfigTransformer: ({ keywords: r, requestConfig: t }) => (
            r && (u(t, s.search.keywordPath), f(t, "params.cataloguenumber", r)),
            t
          ),
        },
      },
    },
    list: [
      {
        urlPattern: ["/torrents.php"],
        excludeUrlPattern: [/\/torrents\.php\?(?:.*&)?(id|torrentid)=\d+/],
        mergeSearchSelectors: !1,
        selectors: {
          rows: { selector: "div.torrent_card > div.torrent_info" },
          title: { selector: "a[href*='torrents.php?id=']:first > b" },
          url: { selector: "a[href*='torrents.php?id=']:first", attr: "href" },
          link: { selector: "a[href^='torrents.php?action=download']", attr: "href" },
          size: { selector: "div.activity_info > div:nth-child(2)", filters: [{ name: "parseSize" }] },
          seeders: { selector: "div.torrent_seed", filters: [{ name: "parseNumber" }] },
          leechers: { selector: "div.torrent_peers", filters: [{ name: "parseNumber" }] },
          completed: { selector: "div.torrent_snatched", filters: [{ name: "parseNumber" }] },
          time: {
            selector: "span.time",
            filters: [
              { name: "parseTTL" },
              (r) => {
                const e = new Date().getTimezoneOffset() * 60 * 1e3;
                return r + 1 * 36e5 + e;
              },
            ],
          },
        },
      },
    ],
    userInfo: { ...s.userInfo, selectors: { ...s.userInfo.selectors, ratio: { text: "N/A" } } },
    levelRequirements: [
      { id: 0, name: "Actor", privilege: "The default class for all members." },
      {
        id: 1,
        name: "Cinematographer",
        interval: "P2M",
        percentile: 50,
        privilege:
          "Can access the Secret Pharmacy forum and create 1 personal collage. Can also invite new members upon having enough Seeding Points.",
      },
      {
        id: 2,
        name: "Director",
        interval: "P4M",
        percentile: 70,
        privilege:
          "Can access the Secret Pharmacy forum, create 3 personal collages and is awarded an invite occasionally",
      },
      {
        id: 3,
        name: "Cinephile",
        interval: "P6M",
        percentile: 90,
        privilege:
          "Can access the Secret Pharmacy and Ilium Cinephilium forums, create 10 personal collages and is awarded an invite occasionally.",
      },
      {
        id: 4,
        name: "Legend",
        groupType: "vip",
        privilege: "Past staff member. Same perks as Cinephiles, plus a few more.",
      },
    ],
  };
class J extends v {
  async transformUnGroupTorrent(t) {
    const e = await super.transformUnGroupTorrent(t);
    return ((e.tags = []), e);
  }
  async transformGroupTorrent(t, e) {
    const { authkey: a, passkey: i } = await this.getAuthKey(),
      p = t.artist ? `${t.artist} - ` : "";
    return {
      site: this.metadata.id,
      id: e.torrentId,
      title: `${p}${n(t.groupName)} [${t.groupYear}]`,
      subTitle:
        `${e.media}` +
        (e.hasLog ? " / Log" : "") +
        (e.hasCue ? " / Cue" : "") +
        (e.remastered ? ` / ${e.remasterYear}` : "") +
        (e.remasterTitle ? ` / ${n(e.remasterTitle)}` : "") +
        (e.scene ? " / Scene" : ""),
      url: `${this.url}torrents.php?id=${t.groupId}&torrentid=${e.torrentId}`,
      link: `${this.url}torrents.php?action=download&id=${e.torrentId}&authkey=${a}&torrent_pass=${i}`,
      time: h(e.time, this.metadata.timezoneOffset),
      size: e.size,
      seeders: e.seeders,
      leechers: e.leechers,
      completed: e.snatches,
      category:
        t.releaseType === "Music"
          ? t.releaseType
          : (Object.entries(y).find(([C, d]) => d.has(e.media))?.[0] ?? "E-Books"),
    };
  }
  async transformSearchPage(t, e) {
    return t instanceof Document ? S.prototype.transformSearchPage.call(this, t, e) : super.transformSearchPage(t, e);
  }
  async getSeedingSize(t, e = 0) {
    const a = await super.getSeedingSize(t, e);
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: i } = await this.request({ url: "/user.php", params: { id: t }, responseType: "document" });
    return (
      (a.seedingBonus = m.parseNumber(o("li:contains('Seeding Points: ')", i)[0].textContent)),
      (a.percentile = m.parseNumber(o("li:contains('Overall rank: ')", i)[0].textContent)),
      a
    );
  }
}
export { J as default, q as siteMetadata };
