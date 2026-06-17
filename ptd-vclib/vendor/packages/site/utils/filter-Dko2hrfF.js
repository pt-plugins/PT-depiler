import { d as p, p as n, f as o } from "./datetime-DQxMK7bP.js";
import { p as m } from "./filesize-D_1hx4u8.js";
import { bM as r } from "../index-COeZNva1.js";
function f(t) {
  return (
    typeof t == "string" &&
      ((t = t.replace(/[, ]/gi, "")), /^-?\d+$/.test(t) && (t = isNaN(parseInt(t)) ? 0 : parseInt(t))),
    t
  );
}
const c = {
    querystring: (t, e) => {
      const s = /^https?:/.test(t) ? void 0 : "http://localhost/",
        a = new URL(t, s).searchParams;
      for (const i of e) if (a.has(i)) return a.get(i);
      return "";
    },
    append: (t, e) => t + (e[0] || ""),
    prepend: (t, e) => (e[0] || "") + t,
    toLower: (t) => String(t).toLowerCase(),
    toUpper: (t) => String(t).toUpperCase(),
    replace: (t, e) => String(t).replace(e[0], e[1]),
    split: (t, e) => String(t).split(e[0])[e[1] ?? 0],
    trim: (t) => String(t).trim(),
    parseNumber: (t) => {
      const e = t
        .trim()
        .replace(/[\s,\n]/g, "")
        .match(/(-?[\d.]+)/);
      return e && e.length >= 2 ? parseFloat(e[1]) : 0;
    },
    parseSize: (t) => {
      const e = t
        .trim()
        .replace(/[ ,\n]/g, "")
        .match(/([\d.]+(.*[^ZEPTGMK])?[ZEPTGMK]?i?B)/);
      return e && e.length >= 2 ? m(e[1]) : 0;
    },
    parseTime: o,
    parseTTL: n,
    parseDuration: p,
    parseFuzzyTime: (t, e) => {
      const s = o(t, e);
      return s === t ? n(t) : s;
    },
    extAnidbId: r.anidb,
    extBangumiId: r.bangumi,
    extDoubanId: r.douban,
    extImdbId: r.imdb,
    extTvmazeId: r.tvmaze,
    dump: (t) => (console?.log(t), t),
  },
  l = Object.keys(c);
export { c as d, l as f, f as t };
