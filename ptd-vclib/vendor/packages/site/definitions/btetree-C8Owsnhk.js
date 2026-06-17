import d from "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import { f as c } from "../utils/datetime-DQxMK7bP.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
const n = [
    [2004, 2204],
    [2005, 10368],
    [2006, 21306],
    [2007, 502958],
    [2008, 512029],
    [2009, 521346],
    [2010, 531218],
    [2011, 541379],
    [2012, 551321],
    [2013, 561096],
    [2014, 569309],
    [2015, 577205],
    [2016, 584158],
    [2017, 590609],
    [2018, 597003],
    [2019, 603585],
    [2020, 608148],
    [2021, 611609],
    [2022, 614780],
    [2023, 617776],
    [2024, 621061],
    [2025, 623102],
    [2026, 625197],
  ],
  w = {
    version: 1,
    id: "btetree",
    name: "BT.etree",
    description: "BT.etree is a Public Tracker dedicated to Bootleg FLAC MUSIC",
    tags: ["音乐"],
    timezoneOffset: "-0500",
    type: "public",
    urls: ["https://bt.etree.org/"],
    search: {
      keywordPath: "params.searchzzzz",
      requestConfig: { params: { cat: 0 } },
      advanceKeywordParams: { imdb: !1 },
      selectors: {
        rows: { selector: 'table[bgcolor="#CCCCCC"] tbody tr:gt(0)' },
        id: {
          selector: "td:nth-child(2) a.details_link",
          attr: "href",
          filters: [{ name: "querystring", args: ["torrentId"] }],
        },
        title: { selector: "td:nth-child(2) a.details_link b" },
        url: { selector: "td:nth-child(2) a.details_link", attr: "href" },
        link: { selector: "td:nth-child(3) a", attr: "href" },
        time: { selector: "td:nth-child(5)" },
        size: { selector: "td:nth-child(6)", filters: [{ name: "parseSize" }] },
        author: { selector: "td:nth-child(1)" },
        seeders: { selector: "td:nth-child(8)" },
        leechers: { selector: "td:nth-child(9)" },
        completed: { selector: "td:nth-child(7)", filters: [{ name: "parseNumber" }] },
        category: { text: "Music" },
      },
    },
    list: [{ urlPattern: [/\/$/, "/index.php"], mergeSearchSelectors: !0 }],
    detail: {
      urlPattern: ["/details.php"],
      selectors: {
        title: { selector: "td.heading:contains('Show') + td" },
        link: { selector: "a.index[href^='download.php/']", attr: "href" },
      },
    },
  };
class x extends d {
  parseTorrentRowForTime(t = {}, e, r) {
    t.id || (t.id = this.getFieldData(e, r.searchEntry.selectors.id));
    const s = t.id ? parseInt(t.id) : 0;
    let i = 2003;
    for (const [o, l] of n) {
      if (s < l) break;
      i = o;
    }
    const a = this.getFieldData(e, r.searchEntry.selectors.time);
    return ((t.time = c(`${i}/${a}`, ["yyyy/MM/dd HH:mm"])), t);
  }
}
export { x as default, w as siteMetadata };
