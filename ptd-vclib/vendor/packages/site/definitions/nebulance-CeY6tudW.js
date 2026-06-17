import { E as i } from "../types/torrent-BvvY2NbA.js";
import { S as a, K as C } from "../index-COeZNva1.js";
import k, { SchemaMetadata as s, top10PageList as h } from "../schemas/Gazelle-C72SbirH.js";
import { f as x } from "../utils/datetime-DQxMK7bP.js";
import { a as N } from "../utils/helper-OCngMtkv.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const l = -11,
  f = /\/torrents\.php\?(?:.*&)?showid=\d+/;
function g(e) {
  const t = e.textContent.match(/"(.*)"/s)[1];
  return C(JSON.parse(`"${t}"`));
}
const ee = {
    ...s,
    version: 1,
    id: "nebulance",
    name: "Nebulance",
    aka: ["NBL"],
    description: "Nebulance is a Private site. At Nebulance we will change the way you think about TV.",
    tags: ["电视剧"],
    timezoneOffset: `${l}00`,
    type: "private",
    schema: "Gazelle",
    urls: ["uggcf://arohynapr.vb/"],
    category: [
      {
        name: "Category",
        key: "filter_cat",
        options: [
          { name: "Episode", value: 1 },
          { name: "Season", value: 3 },
        ],
        cross: { mode: "appendQuote" },
      },
      {
        name: "Tags",
        key: "taglist",
        options: N([
          ["1080p", "2160p", "4k", "720p", "h264", "h265", "hdr", "dovi", "atmos"],
          ["action", "adventure", "comedy", "crime", "drama", "episode", "family", "fantasy"],
          ["history", "horror", "music", "mystery", "sci.fi", "thriller", "children"],
          ["amzn.sourced", "apple.tv", "atvp.sourced", "bbc.one", "disney+"],
          ["dsnp.sourced", "nf.sourced", "paramount+", "prime.video"],
          ["nogrp.release", "p2p", "remux", "scene", "sdtv", "season", "subtitles", "webdl", "webrip"],
        ]),
        cross: { mode: "comma" },
      },
    ],
    search: {
      ...s.search,
      keywordPath: "params.searchtext",
      requestConfig: {
        url: "/torrents.php",
        responseType: "document",
        params: { order_by: "time", order_way: "desc", tags_type: 1 },
      },
      advanceKeywordParams: {
        imdb: !1,
        tvmaze: {
          requestConfigTransformer: ({ keywords: e, requestConfig: t }) => ({
            ...t,
            params: { action: "show", showid: e },
          }),
        },
      },
      selectors: {
        ...s.search.selectors,
        id: { selector: "a[href*='torrents.php?id=']", data: "browseId" },
        title: { selector: "a[href*='torrents.php?id=']", data: "src" },
        size: { selector: "a[href*='torrents.php?id=']", data: "filesize" },
        url: { selector: "a[href*='torrents.php?id=']", attr: "href" },
        link: { selector: "a[href*='torrents.php?action=download']", attr: "href" },
        subTitle: { selector: "div.tags" },
        category: {
          selector: "div.tags",
          elementProcess: (e) =>
            e.querySelector("a[href*='taglist=season']")
              ? "Season"
              : e.querySelector("a[href*='taglist=episode']")
                ? "Episode"
                : "Other",
        },
        progress: { selector: ".Seeding", filters: [(e) => (e ? 100 : 0)] },
        status: {
          selector: "a[href*='torrents.php?id=']",
          attr: "class",
          filters: [(e) => (e.includes("Seeding") ? i.seeding : e.includes("Snatched") ? i.inactive : i.unknown)],
        },
        tags: [{ name: "H&R", selector: "*", color: "red" }],
        ext_tvmaze: {
          selector: "a[href*='showid=']",
          attr: "href",
          filters: [{ name: "querystring", args: ["showid"] }],
        },
      },
    },
    list: [
      {
        urlPattern: [/\/torrents\.php(?!.*(?:\bid=|torrentid=|showid=))/],
        selectors: {
          time: {
            text: 0,
            selector: "span.time",
            filters: [
              { name: "parseTTL" },
              (e) => {
                const r = new Date().getTimezoneOffset() * 60 * 1e3;
                return e + r + l * 36e5;
              },
            ],
          },
        },
      },
      { urlPattern: [f], selectors: { keywords: { selector: "div#showinfobox span.size4" } } },
      {
        ...h,
        selectors: {
          ...h.selectors,
          title: {
            selector: "> td > script",
            elementProcess: (e) => {
              const t = g(e);
              return a("td:last", t)[0].textContent.trim();
            },
          },
          size: {},
        },
      },
    ],
    detail: {
      urlPattern: ["/torrents\\.php\\?id=\\d+"],
      selectors: {
        title: { selector: ["div:has(.mediainfo) > a:first"], filters: [{ name: "split", args: [" ", 0] }] },
        link: { selector: ["a:contains('Download')"], attr: "href" },
      },
    },
    userInfo: {
      pickLast: ["id", "name", "joinTime"],
      process: [
        {
          requestConfig: { url: "/ajax.php", params: { action: "index" }, responseType: "json" },
          fields: ["id", "name"],
        },
        {
          requestConfig: { url: "/user.php", responseType: "document" },
          assertion: { id: "params.id" },
          fields: [
            "joinTime",
            "messageCount",
            "levelName",
            "lastAccessAt",
            "hnrUnsatisfied",
            "downloaded",
            "uploaded",
            "ratio",
            "uploads",
            "snatches",
            "bonus",
            "bonusPerHour",
            "seeding",
            "seedingSize",
          ],
        },
      ],
      selectors: {
        ...s.userInfo.selectors,
        id: { selector: "response.id" },
        name: { selector: "response.username" },
        joinTime: {
          selector: "li:contains('Joined') > span.time",
          attr: "title",
          filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm"] }],
        },
        levelName: { ...s.userInfo.selectors.levelName, selector: "li:contains('Class:')" },
        lastAccessAt: {
          selector: "li:contains('Last Seen') > span.time",
          attr: "title",
          filters: [{ name: "parseTime", args: ["MMM d yyyy, HH:mm"] }],
        },
        hnrUnsatisfied: {
          selector: "li:contains('HnRs')",
          filters: [{ name: "split", args: ["[", 0] }, { name: "parseNumber" }],
        },
        downloaded: { selector: "li:contains('Downloaded: ')", filters: [{ name: "parseSize" }] },
        uploaded: { selector: "li:contains('Uploaded: ')", filters: [{ name: "parseSize" }] },
        ratio: { text: "N/A" },
        uploads: { selector: "li:contains('Uploaded') > span:nth-child(2)", filters: [{ name: "parseNumber" }] },
        snatches: { selector: "li:contains('Snatched') > span:nth-child(2)", filters: [{ name: "parseNumber" }] },
        bonus: { selector: "a[href='bonus.php']:first", filters: [{ name: "parseNumber" }] },
        bonusPerHour: { selector: "li:contains('Cubits per hour')", filters: [{ name: "parseNumber" }] },
        seeding: { selector: "li:contains('Seeding') > span", filters: [{ name: "parseNumber" }] },
        seedingSize: { selector: "li:contains('Seeding Size')", filters: [{ name: "parseSize" }] },
      },
    },
    levelRequirements: [
      { id: 1, name: "Colonial" },
      {
        id: 2,
        name: "Ensign",
        interval: "P4W",
        uploaded: "100GB",
        snatches: 100,
        bonus: 1e5,
        privilege: "Access to recruitment forum",
      },
      {
        id: 3,
        name: "Flattop",
        interval: "P8W",
        uploaded: "250GB",
        snatches: 250,
        bonus: 25e4,
        privilege: "Can add tags",
      },
      {
        id: 4,
        name: "Nugget",
        interval: "P16W",
        uploaded: "500GB",
        snatches: 500,
        bonus: 5e5,
        privilege: "Can view uploaders; Can edit own torrents after edit timelock",
      },
      { id: 5, name: "Raptor", interval: "P32W", uploaded: "1TB", snatches: 1e3, bonus: 85e4 },
      {
        id: 6,
        name: "Viper",
        interval: "P64W",
        uploaded: "2.5TB",
        uploads: 50,
        snatches: 2500,
        bonus: 25e5,
        privilege: "Can download multiple torrents at once aka (DownThemAll)",
      },
      {
        id: 7,
        name: "Orion",
        interval: "P100W",
        uploaded: "8.5TB",
        uploads: 150,
        snatches: 8500,
        bonus: 3e6,
        privilege: "Can view ratio; Can view downloaded",
      },
      {
        id: 8,
        name: "Valkyrie",
        interval: "P150W",
        uploaded: "100TB",
        uploads: 300,
        snatches: 35e3,
        bonus: 25e7,
        privilege: "Can view the site stats page; Can use advanced bbcode tags",
      },
    ],
  },
  u = {
    rows: { selector: "table.torrent_table tr.torrent" },
    subTitle: { selector: "a.codecs[href*='torrents.php?id=']" },
    size: { selector: "> td:nth-child(2)", filters: [{ name: "parseSize" }] },
    url: { selector: "a[href*='torrents.php?id=']", attr: "href" },
    link: { selector: "a[href*='torrents.php?action=download']", attr: "href" },
    seeders: { selector: "> td:nth-child(4)" },
    leechers: { selector: "> td:nth-child(5)" },
    completed: { selector: "> td:nth-child(3)" },
  },
  D = { selector: "div.showname", filters: [(e) => (e ? (e.match(/E\d{2}/) ? "Episode" : "Season") : "")] };
class te extends k {
  async transformSearchPage(t, r) {
    const v = t.URL || location.href;
    if (!f.test(v)) return super.transformSearchPage(t, r);
    const c = [],
      y = a(u.rows.selector, t),
      w = { ...r, searchEntry: { ...r.searchEntry, selectors: u } },
      b = this.getFieldData(t, {
        selector: "a[href*='www.tvmaze.com/shows/']",
        attr: "href",
        filters: [{ name: "extTvmazeId" }],
      });
    let d = "";
    for (const o of y)
      try {
        const n = a("div.tagssh > script", o)[0],
          p = g(n),
          T = a("table.overlay tr:nth-child(3) > td", p)[0].textContent,
          S = a("td.rightOverlay", p)[0].textContent.match(/Uploaded:\s*([0-9-]+\s+[0-9:]+)/)[1],
          z = x(S) + l * 36e5,
          m = this.getFieldData(o, D);
        m && (d = m);
        const P = await this.parseWholeTorrentFromRow(
          { title: T, time: z, tags: [{ name: "H&R", color: "red" }], category: d, ext_tvmaze: b },
          o,
          w,
        );
        c.push(P);
      } catch (n) {
        console.debug(`[PTD] site '${this.name}' parseWholeTorrentFromRow Error:`, n, o);
      }
    return c;
  }
  async getTorrentDownloadLink(t) {
    return this.getTorrentDownloadLinkFactory("id")(t);
  }
}
export { te as default, ee as siteMetadata };
