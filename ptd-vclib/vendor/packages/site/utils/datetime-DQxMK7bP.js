import { i as T, p as D, a as M } from "../../../date-fns/sub-D9RLuzs0.js";
import { s as p, g as l } from "../../../date-fns/format-b1gG6cM7.js";
const w = ["years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds"],
  I = {
    years: ["年", "year", "yr", "Y"],
    quarters: ["季度", "quarter", "qtr"],
    months: ["個月", "月", "month", "mo", "M"],
    weeks: ["周", "week", "wk", "W"],
    days: ["天", "day", "D"],
    hours: ["小時", "时", "hour", "hr", "h"],
    minutes: ["分鐘", "分", "minute", "min", "m"],
    seconds: ["秒", "second", "sec", "s"],
  },
  y = {
    years: 31536e3,
    quarters: 7776e3,
    months: 2592e3,
    weeks: 604800,
    days: 86400,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };
function h(s) {
  let t = !1,
    e = s;
  for (const [r, a] of Object.entries(I)) {
    const i = a.map((n) => (/^[A-Za-z]$/.test(n) ? `${n}(?=\\s|$)` : n)),
      c = new RegExp(`(\\d+)\\s*(${i.join("|")})`, "g");
    e = e.replace(c, `$1 ${r}`);
  }
  let o = 0;
  return (
    w.forEach((r) => {
      const a = e.match(new RegExp(`([.\\d]+) ?(${r}s?)`));
      if (a) {
        t = !0;
        const i = parseFloat(a[1]);
        o += i * y[r];
      }
    }),
    t ? o : s
  );
}
function k(s) {
  return h(s);
}
function S(s) {
  const t = h(s);
  return typeof t == "string" ? t : +T(new Date(), { seconds: t });
}
function H(s, t = []) {
  for (const o of [...t, "yyyy-MM-dd'T'HH:mm:ssXXX", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm:ss.SSS"]) {
    let r = D(s, o, new Date());
    if (p(r)) return +r;
  }
  let e = new Date(s);
  return p(e) ? +e : s;
}
function v(s, t = "+0000") {
  let e = s;
  /^(\d){10}$/.test(e + "") && (e = parseInt(e + "") * 1e3);
  const o = l(new Date(e), "yyyy-MM-dd'T'HH:mm:ss");
  return +new Date(`${o}${t}`);
}
function x(s, t) {
  let e = new Date(t);
  const o = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/,
    r = s.match(o);
  if (r) {
    const [, a, i, c, n, d, m, u] = r,
      f = {
        years: a ? parseInt(a, 10) : 0,
        months: i ? parseInt(i, 10) : 0,
        weeks: c ? parseInt(c, 10) : 0,
        days: n ? parseInt(n, 10) : 0,
        hours: d ? parseInt(d, 10) : 0,
        minutes: m ? parseInt(m, 10) : 0,
        seconds: u ? parseInt(u, 10) : 0,
      };
    e = M(e, f);
  }
  return e.getTime();
}
function P(s) {
  const t = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/,
    e = s.toUpperCase().match(t);
  if (!e) return 0;
  const [, o, r, a, i, c, n, d] = e,
    m = {
      years: o ? parseInt(o, 10) : 0,
      months: r ? parseInt(r, 10) : 0,
      weeks: a ? parseInt(a, 10) : 0,
      days: i ? parseInt(i, 10) : 0,
      hours: c ? parseInt(c, 10) : 0,
      minutes: n ? parseInt(n, 10) : 0,
      seconds: d ? parseInt(d, 10) : 0,
    };
  return Object.keys(m).reduce((u, f) => u + m[f] * y[f], 0);
}
function W(s) {
  if (s <= 0) return "P0D";
  const t = Math.floor(s / (365 * 24 * 3600)),
    e = s % (365 * 24 * 3600),
    o = Math.floor(e / (720 * 3600)),
    r = e % (720 * 3600),
    a = Math.floor(r / (168 * 3600)),
    i = r % (168 * 3600),
    c = Math.floor(i / (24 * 3600));
  let n = "P";
  return (
    t > 0 && (n += `${t}Y`),
    o > 0 && (n += `${o}M`),
    a > 0 && (n += `${a}W`),
    c > 0 && (n += `${c}D`),
    n === "P" && (n = "P0D"),
    n
  );
}
export { P as a, W as b, x as c, k as d, v as e, H as f, S as p };
