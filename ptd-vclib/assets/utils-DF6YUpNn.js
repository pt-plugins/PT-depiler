import { aF as u } from "./src/entries/options/index-DmNe5UVo.js";
import { g as q } from "../vendor/date-fns/format-b1gG6cM7.js";
import { d as J } from "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import { i as X, h as Q, b as tt, e as et, g as it } from "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import { aQ as nt, aP as ot, aO as rt, bX as st } from "../vendor/packages/site/index-COeZNva1.js";
/**
 * filesize
 *
 * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 11.0.17
 */ const Y = "Invalid number",
  at = "Invalid rounding method",
  x = "iec",
  p = "jedec",
  ct = "si",
  G = "bit",
  ft = "bits",
  C = "byte",
  lt = "bytes",
  mt = "kbit",
  ut = "kB",
  L = "array",
  dt = "function",
  Z = "object",
  bt = "string",
  K = "exponent",
  $t = "round",
  ht = "e",
  E = "",
  j = ".",
  gt = "s",
  z = " ",
  Nt = "0",
  B = {
    symbol: {
      iec: {
        bits: ["bit", "Kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
        bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
      },
      jedec: {
        bits: ["bit", "Kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
        bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      },
    },
    fullform: {
      iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
      jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"],
    },
  },
  Et = [
    1, 1024, 1048576, 1073741824, 1099511627776, 0x4000000000000, 1152921504606847e3, 11805916207174113e5,
    12089258196146292e8,
  ],
  yt = [1, 1e3, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24],
  Bt = Math.log(1024),
  It = Math.log(1e3),
  k = {
    [ct]: { isDecimal: !0, ceil: 1e3, actualStandard: p },
    [x]: { isDecimal: !1, ceil: 1024, actualStandard: x },
    [p]: { isDecimal: !1, ceil: 1024, actualStandard: p },
  };
function pt(t, e) {
  return k[t]
    ? k[t]
    : e === 2
      ? { isDecimal: !1, ceil: 1024, actualStandard: x }
      : { isDecimal: !0, ceil: 1e3, actualStandard: p };
}
function St(t, e, i, r, n, s, o, c, a) {
  let f;
  return (
    t > 0 ? (f = (0).toPrecision(t)) : (f = 0),
    o === K
      ? 0
      : (a || (a = i ? B.symbol[e].bits[0] : B.symbol[e].bytes[0]),
        r[a] && (a = r[a]),
        n && (s[0] ? (a = s[0]) : ((a = B.fullform[e][0]), i ? (a += G) : (a += C))),
        o === L ? [f, a] : o === Z ? { value: f, symbol: a, exponent: 0, unit: a } : f + c + a)
  );
}
function U(t, e, i, r, n, s = !0) {
  let o;
  i ? (o = yt[e]) : (o = Et[e]);
  let c = t / o;
  return (r && ((c *= 8), s && c >= n && e < 8 && ((c /= n), e++)), { result: c, e });
}
function Tt(t, e, i, r, n, s, o, c, a, f) {
  typeof t == "string" && (t = parseFloat(t));
  let l = t.toPrecision(e);
  const m = f === -1 || isNaN(f);
  if (l.includes(ht) && i < 8 && m) {
    i++;
    const { result: g } = U(r, i, n, s, o);
    let b;
    a > 0 ? (b = Math.pow(10, a)) : (b = 1);
    let d;
    (b === 1 ? (d = c(g)) : (d = c(g * b) / b), (l = d.toPrecision(e)));
  }
  return { value: l, e: i };
}
function Rt(t, e, i, r, n, s) {
  let o = t;
  if (
    (e === !0
      ? (o = o.toLocaleString())
      : e.length > 0
        ? (o = o.toLocaleString(e, i))
        : r.length > 0 && (o = o.toString().replace(j, r)),
    n && s > 0)
  ) {
    const c = o.toString(),
      a = r || (c.slice(1).match(/[.,]/g) || []).pop() || j,
      f = c.split(a),
      l = f[1] || E,
      m = l.length,
      g = s - m;
    o = `${f[0]}${a}${l.padEnd(m + g, Nt)}`;
  }
  return o;
}
function Mt(t, e, i, r, n) {
  return (
    (e === -1 || isNaN(e)) &&
      (r ? (e = Math.floor(Math.log(t) / It)) : (e = Math.floor(Math.log(t) / Bt)), e < 0 && (e = 0)),
    e > 8 ? (n > 0 && (n += 8 - e), { e: 8, precision: n }) : { e, precision: n }
  );
}
function xt(t, e, i, r, n, s) {
  let o;
  i > 0 && r > 0 ? (o = Math.pow(10, r)) : (o = 1);
  let c;
  return (o === 1 ? (c = n(t)) : (c = n(t * o) / o), c === e && i < 8 && s && ((c = 1), i++), { value: c, e: i });
}
function Ot(t, e, i, r) {
  const n = B.symbol[t][e ? ft : lt];
  let s;
  return (r && i === 1 ? (e ? (s = mt) : (s = ut)) : (s = n[i]), s);
}
function At(t, e, i, r, n, s, o, c, a, f, l, m, g) {
  if ((e && (t[0] = -t[0]), i[t[1]] && (t[1] = i[t[1]]), (t[0] = Rt(t[0], r, n, s, o, c)), a)) {
    let b;
    g ? (b = G) : (b = C);
    let d;
    typeof t[0] == "string" ? (d = parseFloat(t[0])) : (d = t[0]);
    let y;
    (d === 1 ? (y = E) : (y = gt), f[m] ? (t[1] = f[m]) : (t[1] = B.fullform[l][m] + b + y));
  }
}
function Dt(t, e, i, r, n) {
  if (r === L) return t;
  if (r === Z) return { value: t[0], symbol: t[1], exponent: e, unit: i };
  let s;
  return (n === z ? (s = `${t[0]} ${t[1]}`) : (s = t.join(n)), s);
}
function Pt(
  t,
  {
    bits: e = !1,
    pad: i = !1,
    base: r = -1,
    round: n = 2,
    locale: s = E,
    localeOptions: o = {},
    separator: c = E,
    spacer: a = z,
    symbols: f = {},
    standard: l = E,
    output: m = bt,
    fullform: g = !1,
    fullforms: b = [],
    exponent: d = -1,
    roundingMethod: y = $t,
    precision: O = 0,
  } = {},
) {
  let $ = d,
    h,
    N = [],
    A = 0,
    S = E;
  if (typeof t == "bigint") h = Number(t);
  else {
    if (((h = Number(t)), isNaN(t))) throw new TypeError(Y);
    if (!isFinite(h)) throw new TypeError(Y);
  }
  const { isDecimal: I, ceil: T, actualStandard: R } = pt(l, r),
    D = g === !0,
    P = h < 0,
    M = Math[y];
  if (typeof M !== dt) throw new TypeError(at);
  if ((P && (h = -h), h === 0)) return St(O, R, e, f, D, b, m, a);
  const { e: V, precision: w } = Mt(h, $, d, I, O);
  $ = V;
  const v = d === -1 || isNaN(d);
  if (m === K) return $;
  const { result: H, e: W } = U(h, $, I, e, T, v);
  ((A = H), ($ = W));
  const _ = xt(A, T, $, n, M, v);
  if (((N[0] = _.value), ($ = _.e), w > 0)) {
    const F = Tt(N[0], w, $, h, I, e, T, M, n, d);
    ((N[0] = F.value), ($ = F.e));
  }
  return ((S = Ot(R, e, $, I)), (N[1] = S), At(N, P, f, s, o, c, i, n, D, b, R, $, e), Dt(N, $, S, m, a));
}
function kt(t) {
  const e = (i) =>
    Array.isArray(i)
      ? i.map((r) => e(r))
      : nt(i) || ot(i) || rt(i)
        ? e(st(i))
        : i && typeof i == "object"
          ? Object.keys(i).reduce((r, n) => ((r[n] = e(i[n])), r), {})
          : i;
  return e(t);
}
const Gt = {
    require:
      (t = "Item is required") =>
      (e) =>
        !!e || t,
    url:
      (t = "Not url") =>
      (e) =>
        /^(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;[\]]+[-A-Za-z0-9+&@#/%=~_|]$/.test(e) || t,
  },
  Ct = (t, e) => {
    try {
      return Pt(t, { base: 2, round: 2, pad: !0, ...(e ?? {}) });
    } catch {
      return t;
    }
  },
  Lt = (t, e = "yyyy-MM-dd HH:mm:ss") => {
    try {
      return q(t, e);
    } catch {
      return t;
    }
  },
  Zt = (t, e = {}) => {
    const i = new Date(),
      { weekOnly: r = !1, spacer: n = " " } = e;
    if (r) {
      const m = J(i, t);
      return m < 1 ? u.t("common.time.lessThanAWeek") : `${m}${n}${u.t("common.time.week")}` + u.t("common.time.ago");
    }
    const s = X(i, t),
      o = Q(i, t) % 12,
      c = tt(i, t) % 30,
      a = et(i, t) % 24,
      f = it(i, t) % 60;
    let l;
    return (
      s > 0
        ? (l = `${s}${n}${u.t("common.time.year")}${n}${o}${n}${u.t("common.time.month")}`)
        : o > 0
          ? (l = `${o}${n}${u.t("common.time.month")}${n}${c}${n}${u.t("common.time.day")}`)
          : c > 0
            ? (l = `${c}${n}${u.t("common.time.day")}${n}${a}${n}${u.t("common.time.hour")}`)
            : a > 0
              ? (l = `${a}${n}${u.t("common.time.hour")}${n}${f}${n}${u.t("common.time.minute")}`)
              : f > 0
                ? (l = `${f}${n}${u.t("common.time.minute")}`)
                : (l = `< 1${n}${u.t("common.time.minute")}`),
      l + u.t("common.time.ago")
    );
  },
  Kt = (t, e = {}) => Number(t).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2, ...e }),
  wt = [
    { threshold: 1e12, suffix: "T" },
    { threshold: 1e9, suffix: "B" },
    { threshold: 1e6, suffix: "M" },
    { threshold: 1e3, suffix: "K" },
  ],
  zt = (t, e = "") => {
    const i = typeof t == "string" ? parseFloat(t) : t;
    if (isNaN(i)) return "-";
    const r = Math.abs(i);
    for (const { threshold: n, suffix: s } of wt) if (r >= n) return (i / n).toFixed(2) + e + s;
    return i.toFixed(2);
  };
export { Gt as a, Lt as b, Kt as c, kt as d, Ct as e, Pt as f, Zt as g, zt as s };
