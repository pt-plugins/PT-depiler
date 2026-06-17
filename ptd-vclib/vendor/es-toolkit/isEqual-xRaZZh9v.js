import {
  aj as h,
  a6 as v,
  bt as j,
  bR as w,
  W as S,
  n as U,
  b7 as x,
  aF as z,
  bP as L,
  b8 as A,
  ai as d,
  a1 as P,
  V as I,
  h as K,
  a5 as W,
  aA as p,
  a4 as B,
  l as Z,
  au as C,
  at as F,
  av as M,
  m as R,
  c0 as $,
  b$ as D,
  c2 as G,
  c1 as H,
  i as J,
  bE as N,
  aZ as Q,
} from "../packages/site/index-COeZNva1.js";
import { i as O } from "./isPlainObject-3NY8ex7Q.js";
function X() {}
function Y(r, e, t) {
  return g(r, e, void 0, void 0, void 0, void 0, t);
}
function g(r, e, t, s, a, i, u) {
  const y = u(r, e, t, s, a, i);
  if (y !== void 0) return y;
  if (typeof r == typeof e)
    switch (typeof r) {
      case "bigint":
      case "string":
      case "boolean":
      case "symbol":
      case "undefined":
        return r === e;
      case "number":
        return r === e || Object.is(r, e);
      case "function":
        return r === e;
      case "object":
        return l(r, e, i, u);
    }
  return l(r, e, i, u);
}
function l(r, e, t, s) {
  if (Object.is(r, e)) return !0;
  let a = h(r),
    i = h(e);
  if ((a === "[object Arguments]" && (a = A), i === "[object Arguments]" && (i = A), a !== i)) return !1;
  switch (a) {
    case L:
      return r.toString() === e.toString();
    case x:
      return z(r.valueOf(), e.valueOf());
    case U:
    case S:
    case w:
      return Object.is(r.valueOf(), e.valueOf());
    case j:
      return r.source === e.source && r.flags === e.flags;
    case v:
      return r === e;
  }
  t = t ?? new Map();
  const u = t.get(r),
    y = t.get(e);
  if (u != null && y != null) return u === e;
  (t.set(r, e), t.set(e, r));
  try {
    switch (a) {
      case Q:
        if (r.size !== e.size) return !1;
        for (const [n, o] of r.entries()) if (!e.has(n) || !g(o, e.get(n), n, r, e, t, s)) return !1;
        return !0;
      case N: {
        if (r.size !== e.size) return !1;
        const n = Array.from(r.values()),
          o = Array.from(e.values());
        for (let f = 0; f < n.length; f++) {
          const c = n[f],
            T = o.findIndex((m) => g(c, m, void 0, r, e, t, s));
          if (T === -1) return !1;
          o.splice(T, 1);
        }
        return !0;
      }
      case J:
      case H:
      case G:
      case D:
      case $:
      case R:
      case M:
      case F:
      case C:
      case Z:
      case B:
      case W:
        if (p(r) !== p(e) || r.length !== e.length) return !1;
        for (let n = 0; n < r.length; n++) if (!g(r[n], e[n], n, r, e, t, s)) return !1;
        return !0;
      case K:
        return r.byteLength !== e.byteLength ? !1 : l(new Uint8Array(r), new Uint8Array(e), t, s);
      case I:
        return r.byteLength !== e.byteLength || r.byteOffset !== e.byteOffset
          ? !1
          : l(new Uint8Array(r), new Uint8Array(e), t, s);
      case P:
        return r.name === e.name && r.message === e.message;
      case A: {
        if (!(l(r.constructor, e.constructor, t, s) || (O(r) && O(e)))) return !1;
        const n = [...Object.keys(r), ...d(r)],
          o = [...Object.keys(e), ...d(e)];
        if (n.length !== o.length) return !1;
        for (let f = 0; f < n.length; f++) {
          const c = n[f],
            T = r[c];
          if (!Object.hasOwn(e, c)) return !1;
          const m = e[c];
          if (!g(T, m, c, r, e, t, s)) return !1;
        }
        return !0;
      }
      default:
        return !1;
    }
  } finally {
    (t.delete(r), t.delete(e));
  }
}
function V(r, e) {
  return Y(r, e, X);
}
export { Y as a, V as i, X as n };
