import { f as re, b as ae } from "./utils-DF6YUpNn.js";
import { i as se } from "../vendor/es-toolkit/isEqual-xRaZZh9v.js";
import {
  ab as ne,
  bs as fe,
  aQ as ie,
  ch as X,
  br as C,
  c4 as oe,
  c3 as H,
  a7 as K,
  D as le,
} from "../vendor/packages/site/index-COeZNva1.js";
import { f as ue } from "../vendor/es-toolkit/flatten-CRv0zNMl.js";
import { f as P, a as ce, s as de } from "../vendor/date-fns/startOfMonth-CSVGuOFh.js";
import { u as pe } from "../vendor/es-toolkit/uniqBy-DEckz2wg.js";
import { V as ge, T as he, Q as me } from "../vendor/date-fns/format-b1gG6cM7.js";
import { p as xe } from "../vendor/packages/site/utils/filesize-D_1hx4u8.js";
import { f as ye } from "../vendor/packages/site/utils/datetime-DQxMK7bP.js";
var L = {};
/*!
 * search-query-parser.js
 * Copyright(c) 2014-2019
 * MIT Licensed
 */ var Z;
function ve() {
  return (
    Z ||
      ((Z = 1),
      (function (t) {
        ((t.parse = function (e, r) {
          if (
            (r ? (r.offsets = typeof r.offsets > "u" ? !0 : r.offsets) : (r = { offsets: !0 }),
            e || (e = ""),
            e.indexOf(":") === -1 && !r.tokenize)
          )
            return e;
          if (!r.keywords && !r.ranges && !r.tokenize) return e;
          var s = { text: [] };
          r.offsets && (s.offsets = []);
          for (
            var n = {},
              o = [],
              m =
                /(\S+:'(?:[^'\\]|\\.)*')|(\S+:"(?:[^"\\]|\\.)*")|(-?"(?:[^"\\]|\\.)*")|(-?'(?:[^'\\]|\\.)*')|\S+|\S+:\S+/g,
              c;
            (c = m.exec(e)) !== null;
          ) {
            var f = c[0],
              i = f.indexOf(":");
            if (i !== -1) {
              f.split(":");
              var a = f.slice(0, i),
                x = f.slice(i + 1);
              ((x = x.replace(/^\"|\"$|^\'|\'$/g, "")),
                (x = (x + "").replace(/\\(.?)/g, function (F, d) {
                  switch (d) {
                    case "\\":
                      return "\\";
                    case "0":
                      return "\0";
                    case "":
                      return "";
                    default:
                      return d;
                  }
                })),
                o.push({ keyword: a, value: x, offsetStart: c.index, offsetEnd: c.index + f.length }));
            } else {
              var T = !1;
              (f[0] === "-" && ((T = !0), (f = f.slice(1))),
                (f = f.replace(/^\"|\"$|^\'|\'$/g, "")),
                (f = (f + "").replace(/\\(.?)/g, function (F, d) {
                  switch (d) {
                    case "\\":
                      return "\\";
                    case "0":
                      return "\0";
                    case "":
                      return "";
                    default:
                      return d;
                  }
                })),
                T
                  ? n.text
                    ? (n.text instanceof Array || (n.text = [n.text]), n.text.push(f))
                    : (n.text = f)
                  : o.push({ text: f, offsetStart: c.index, offsetEnd: c.index + f.length }));
            }
          }
          o.reverse();
          for (var f; (f = o.pop()); )
            if (f.text) (s.text.push(f.text), r.offsets && s.offsets.push(f));
            else {
              var a = f.keyword;
              r.keywords = r.keywords || [];
              var M = !1,
                w = !1;
              if (!/^-/.test(a)) M = r.keywords.indexOf(a) !== -1;
              else if (a[0] === "-") {
                var Q = a.slice(1);
                ((M = r.keywords.indexOf(Q) !== -1), M && ((a = Q), (w = !0)));
              }
              r.ranges = r.ranges || [];
              var b = r.ranges.indexOf(a) !== -1;
              if (M) {
                r.offsets &&
                  s.offsets.push({
                    keyword: a,
                    value: f.value,
                    offsetStart: w ? f.offsetStart + 1 : f.offsetStart,
                    offsetEnd: f.offsetEnd,
                  });
                var g = f.value;
                if (g.length) {
                  var S = g.split(",");
                  w
                    ? n[a]
                      ? n[a] instanceof Array
                        ? S.length > 1
                          ? (n[a] = n[a].concat(S))
                          : n[a].push(g)
                        : ((n[a] = [n[a]]), n[a].push(g))
                      : S.length > 1
                        ? (n[a] = S)
                        : r.alwaysArray
                          ? (n[a] = [g])
                          : (n[a] = g)
                    : s[a]
                      ? s[a] instanceof Array
                        ? S.length > 1
                          ? (s[a] = s[a].concat(S))
                          : s[a].push(g)
                        : ((s[a] = [s[a]]), s[a].push(g))
                      : S.length > 1
                        ? (s[a] = S)
                        : r.alwaysArray
                          ? (s[a] = [g])
                          : (s[a] = g);
                }
              } else if (b) {
                r.offsets && s.offsets.push(f);
                var g = f.value,
                  V = g.split("-");
                ((s[a] = {}),
                  V.length === 2 ? ((s[a].from = V[0]), (s[a].to = V[1])) : !V.length % 2 || (s[a].from = g));
              } else {
                var z = f.keyword + ":" + f.value;
                (s.text.push(z),
                  r.offsets && s.offsets.push({ text: z, offsetStart: f.offsetStart, offsetEnd: f.offsetEnd }));
              }
            }
          return (s.text.length ? r.tokenize || (s.text = s.text.join(" ").trim()) : delete s.text, (s.exclude = n), s);
        }),
          (t.stringify = function (e, r, s) {
            if ((r || (r = { offsets: !0 }), !e)) return "";
            if (typeof e == "string") return e;
            if (Array.isArray(e)) return e.join(" ");
            if (!Object.keys(e).length) return "";
            if (Object.keys(e).length === 3 && e.text && e.offsets && e.exclude && typeof e.text == "string")
              return e.text;
            s || (s = "");
            var n = function (i) {
                return i.indexOf(" ") > -1 ? JSON.stringify(i) : i;
              },
              o = function (i) {
                return s + i;
              },
              m = [];
            if (e.text) {
              var c = [];
              (typeof e.text == "string" ? c.push(e.text) : c.push.apply(c, e.text),
                c.length > 0 && m.push(c.map(n).map(o).join(" ")));
            }
            return (
              r.keywords &&
                r.keywords.forEach(function (i) {
                  if (e[i]) {
                    var a = [];
                    (typeof e[i] == "string" ? a.push(e[i]) : a.push.apply(a, e[i]),
                      a.length > 0 && m.push(o(i + ":" + a.map(n).join(","))));
                  }
                }),
              r.ranges &&
                r.ranges.forEach(function (i) {
                  if (e[i]) {
                    var a = e[i].from,
                      x = e[i].to;
                    (x && (a = a + "-" + x), a && m.push(o(i + ":" + a)));
                  }
                }),
              e.exclude && Object.keys(e.exclude).length > 0 && m.push(t.stringify(e.exclude, r, "-")),
              m.join(" ")
            );
          }));
      })(L)),
    L
  );
}
var N, _;
function Fe() {
  return (_ || ((_ = 1), (N = ve())), N);
}
var we = Fe();
const U = ne(we),
  Se = ["T", "yyyyMMdd'T'HHmmss", "yyyyMMdd'T'HHmm", "yyyyMMdd'T'HH", "yyyyMMdd", "yyyyMM", "yyyy"],
  O = {
    date: { parse: (t) => (typeof t == "number" ? t : ye(t, Se)), build: (t) => ae(t, "yyyyMMdd'T'HHmmss") },
    size: { parse: (t) => (typeof t == "number" ? t : xe(t)), build: (t) => re(t, { spacer: "" }) },
    number: { parse: (t) => t.toString(), build: (t) => t.toString() },
    boolean: { parse: (t) => (t ? "1" : "0"), build: (t) => (t ? "1" : "0") },
  },
  Y = { "\\": "\\u005c", " ": "\\u0020", ",": "\\u002c", ":": "\\u003a" },
  Me = Object.fromEntries(Object.entries(Y).map(([t, e]) => [e.toLowerCase(), t])),
  Re = Object.values(Y).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  Ae = new RegExp(`(?:${Re.join("|")})`, "gi"),
  Ee = /[\\ ,:]/g,
  Te = /^\/((?:\\.|[^\\/])*)\/([gimsuy]*)$/,
  $ = new Map();
function j(t) {
  return typeof t != "string" ? t : t.replace(Ee, (e) => Y[e]);
}
function W(t) {
  return typeof t != "string" ? t : t.replace(Ae, (e) => Me[e.toLowerCase()] ?? e);
}
function B(t) {
  if (typeof t == "string") return W(t);
}
function J(t) {
  const e = B(t);
  if (typeof e != "string") return null;
  if ($.has(e)) return $.get(e) ?? null;
  const r = Te.exec(e);
  if (!r) return ($.set(e, null), null);
  const [, s, n] = r;
  try {
    const o = new RegExp(s, n);
    return ($.set(e, o), o);
  } catch {
    return ($.set(e, null), null);
  }
}
function k(t, e) {
  const r = B(e);
  if (typeof r != "string") return !1;
  const s = J(r);
  return s ? s.test(t) : t === r;
}
const q = (t) => t;
function D(t, e = {}) {
  let r = {};
  if (e[t])
    if (typeof e[t] == "string" && O[e[t]]) r = O[e[t]];
    else {
      const { parse: s, build: n } = e[t];
      ((r.parse ??= s), (r.build ??= n));
    }
  return ((r.parse ??= q), (r.build ??= q), r);
}
function Le(t, e) {
  const [r, s] = e,
    n = new Date(),
    o = { day: me(n), week: he(n), month: de(n), quarter: ce(n), year: ge(n) }[t];
  return [Math.max(r, o.getTime()), Math.min(s, n.getTime())];
}
function De(t) {
  const e = t.filter((r) => !isNaN(r));
  return { range: e.length > 0 ? [Math.min(...e), Math.max(...e)] : [-1 / 0, 1 / 0], ticks: Array.from(new Set(t)) };
}
function Ne(t) {
  const e = t;
  return [e[0].getTime(), e[e.length - 1].getTime()];
}
function ee(t, e, r, s = {}, n = !1) {
  const o = K(e, r);
  if (t[r]) {
    if (typeof o > "u") return !1;
    const m = D(r, s);
    if (Array.isArray(o)) {
      const c = o.map((a) => m.parse(a)),
        i = t[r];
      return n ? i.some((a) => c.some((x) => k(x, a))) : i.every((a) => c.some((x) => k(x, a)));
    } else {
      const c = m.parse(o);
      return t[r].some((i) => k(c, i));
    }
  }
}
function Qe(t, e, r, s = {}) {
  const n = K(e, r);
  if (t[r] && typeof n < "u") {
    const o = D(r, s),
      m = o.parse(n),
      c = o.parse(t[r].from || -1 / 0),
      i = o.parse(t[r].to || 1 / 0);
    return !!(c && m >= c && i && m <= i);
  }
}
function Ue(t) {
  const {
    parseOptions: e,
    titleFields: r = ["title"],
    format: s = {},
    initialSearchValue: n = "",
    initialItems: o = [],
    debouncedMs: m = 500,
    watchItems: c = !1,
    autoUpdateFilter: i = !1,
  } = t;
  ((e.tokenize = !0), (e.offsets = !1), (e.alwaysArray = !0));
  const a = C(n),
    x = fe(a, m),
    T = le(() => U.parse(x.value, e)),
    f = C({});
  function M() {
    const F = oe(o);
    (e.keywords?.forEach((d) => {
      const p = D(d, s);
      f.value[d] = pe(ue(F.map((l) => l[d]).filter(Boolean)), (l) => p.parse(l));
    }),
      e.ranges?.forEach((d) => {
        f.value[d] = De(F.map((p) => p[d]));
      }));
  }
  (M(), c && ie(o) && X(o, () => M(), { deep: !0 }));
  const w = C({});
  function Q(F = "") {
    const { keywords: d = [], ranges: p = [] } = e,
      l = U.parse(F ?? "", e);
    (["text", ...d].forEach((u) => {
      const y = D(u, s);
      let h = [],
        R = [];
      const v = l[u];
      Array.isArray(v) && v.length > 0 && (h = H(P(v.map((A) => y.parse(W(A))))));
      const E = l.exclude?.[u];
      (Array.isArray(E) && E.length > 0 && (R = H(P(E.map((A) => y.parse(W(A)))))),
        (w.value[u] = { required: h, exclude: R }));
    }),
      p.forEach((u) => {
        const y = D(u, s);
        w.value[u] = [l[u]?.from ? y.parse(l[u].from) : -1 / 0, l[u]?.to ? y.parse(l[u].to) : 1 / 0];
      }));
  }
  Q(n);
  function b() {
    const { keywords: F = [], ranges: d = [] } = e,
      p = { exclude: {} };
    return (
      ["text", ...F].forEach((l) => {
        const u = D(l, s),
          { required: y, exclude: h } = w.value[l];
        (y?.length > 0 && (p[l] = H(P(y.map((R) => j(u.build(R)))))),
          h?.length > 0 && (p.exclude[l] = H(P(h.map((R) => j(u.build(R)))))));
      }),
      d.forEach((l) => {
        const u = D(l, s),
          y = f.value[l].range,
          h = w.value[l].map(u.parse);
        ((h[0] && h[0] !== -1 / 0) || (h[1] && h[1] !== 1 / 0)) &&
          (p[l] = { from: u.build(Math.max(y[0], h[0], -1 / 0)), to: u.build(Math.min(y[1], h[1], 1 / 0)) });
      }),
      U.stringify(p, e)
    );
  }
  function g() {
    a.value = b();
  }
  i &&
    X(
      w,
      () => {
        g();
      },
      { deep: !0 },
    );
  const S = C(0);
  function V(F = !1) {
    (S.value++, F && M(), Q(""));
  }
  function z(F, d) {
    const p = w.value[F];
    p.required.includes(d) ? p.exclude.push(d) : (p.exclude = p.exclude.filter((u) => !se(u, d)));
  }
  function te(F, d, p) {
    const l = p.raw,
      { text: u, exclude: y } = T.value,
      h = P(r.map((v) => K(l, v)))
        .filter(Boolean)
        .join("|$|")
        .toString(),
      R = h.toLowerCase();
    if (
      u &&
      !(Array.isArray(u) ? u : [u]).every((E) => {
        const A = B(E);
        if (typeof A != "string") return !1;
        const I = J(A);
        return I ? I.test(h) : R.includes(A.toLowerCase());
      })
    )
      return !1;
    if (e.keywords) {
      for (const v of e.keywords) if (ee(T.value, l, v, s) === !1) return !1;
    }
    if (e.ranges) {
      for (const v of e.ranges) if (Qe(T.value, l, v, s) === !1) return !1;
    }
    if (y) {
      const { text: v } = y;
      if (
        v &&
        (Array.isArray(v) ? v : [v]).some((A) => {
          const I = B(A);
          if (typeof I != "string") return !1;
          const G = J(I);
          return G ? G.test(h) : R.includes(I.toLowerCase());
        })
      )
        return !1;
      if (e.keywords) {
        for (const E of e.keywords) if (ee(y, l, E, s, !0) === !0) return !1;
      }
    }
    return !0;
  }
  return {
    tableWaitFilterRef: a,
    tableFilterRef: x,
    tableParsedFilterRef: T,
    advanceItemPropsRef: f,
    buildAdvanceItemPropsFn: M,
    advanceFilterDictRef: w,
    buildFilterDictFn: Q,
    stringifyFilterDictFn: b,
    tableFilterFn: te,
    reBuildFilterCountRef: S,
    reBuildAdvanceFilter: V,
    updateTableFilterValueFn: g,
    toggleKeywordStateFn: z,
  };
}
export { Le as g, Ne as s, Ue as u };
