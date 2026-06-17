import { bD as i } from "../index-COeZNva1.js";
function l(t) {
  let e = t.match(/\bS(\d{1,4})E(\d{1,4}[A-Za-z]?)$/);
  return e
    ? { title: t.slice(0, e.index).trim(), season: parseInt(e[1], 10), episode: e[2].replace(/^0+/, "") }
    : ((e = t.match(/\bE(\d{1,4}[A-Za-z]?)$/)),
      e
        ? { title: t.slice(0, e.index).trim(), episode: e[1].replace(/^0+/, "") }
        : ((e = t.match(/\bS(\d{1,4})$/)),
          e ? { title: t.slice(0, e.index).trim(), season: parseInt(e[1], 10) } : { title: t.trim() }));
}
const o = {
  version: 1,
  id: "rutracker",
  name: "RuTracker.org",
  aka: ["RUT"],
  description: "RuTracker.org is a RUSSIAN Semi-Private site with a thriving file-sharing community",
  tags: ["综合"],
  timezoneOffset: "+0000",
  type: "private",
  schema: "AbstractPrivateSite",
  urls: ["https://rutracker.org/", "https://rutracker.net/"],
  legacyUrls: ["https://rutracker.nl/"],
  search: {
    requestConfig: { url: "/forum/tracker.php", responseType: "document" },
    advanceKeywordParams: { imdb: !1 },
    requestConfigTransformer: ({ keywords: t, requestConfig: e }) => {
      if (t) {
        delete e.params?.keywords;
        let { title: r, season: a, episode: s } = l(t.replace("-", ""));
        (a && (r += ` ТВ | Сезон: ${a}`), s && (r += ` Серии: ${s}`), i(e, "params.nm", r));
      }
      return e;
    },
    selectors: {
      rows: { selector: "table#tor-tbl > tbody > tr" },
      link: { selector: "td.tor-size > a.tr-dl", attr: "href" },
      url: { selector: "td.t-title-col > div.t-title > a.tLink", attr: "href" },
      title: { selector: "td.t-title-col > div.t-title > a.tLink", filters: [{ name: "trim" }] },
      category: { selector: "td.f-name-col > div.f-name > a" },
      size: { selector: "td.tor-size", data: "ts_text" },
      seeders: { selector: "td:nth-child(7)", data: "ts_text" },
      leechers: { selector: "td.leechmed:nth-child(8)" },
      completed: { selector: "td:nth-child(9)" },
      time: { selector: "td:nth-child(10)", data: "ts_text" },
      author: { selector: "td.u-name-col" },
    },
  },
};
export { o as siteMetadata };
