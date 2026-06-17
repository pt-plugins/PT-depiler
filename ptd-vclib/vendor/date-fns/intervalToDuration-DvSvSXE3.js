import { aU as M } from "../packages/site/index-COeZNva1.js";
import { n as b } from "./normalizeInterval-DC3nt56b.js";
import { a as o } from "./sub-D9RLuzs0.js";
import { f as p, l as N, i as D, h as S, b as A, e as H, g as U } from "./differenceInYears-C2HS2Spv.js";
function x(n) {
  return M(n) ? NaN : Number(n);
}
function z(n) {
  return n
    ? ((n = x(n)), n === 1 / 0 || n === -1 / 0 ? (n < 0 ? -1 : 1) * Number.MAX_VALUE : n === n ? n : 0)
    : n === 0
      ? n
      : 0;
}
function V(n) {
  const i = z(n),
    r = i % 1;
  return r ? i - r : i;
}
function E(n, i, r) {
  const t = p(n, i) / 1e3;
  return N(r?.roundingMethod)(t);
}
function X(n, i) {
  const { start: r, end: t } = b(i?.in, n),
    s = {},
    e = D(t, r);
  e && (s.years = e);
  const f = o(r, { years: s.years }),
    c = S(t, f);
  c && (s.months = c);
  const a = o(f, { months: s.months }),
    d = A(t, a);
  d && (s.days = d);
  const m = o(a, { days: s.days }),
    u = H(t, m);
  u && (s.hours = u);
  const h = o(m, { hours: s.hours }),
    y = U(t, h);
  y && (s.minutes = y);
  const g = o(h, { minutes: s.minutes }),
    I = E(t, g);
  return (I && (s.seconds = I), s);
}
export { E as d, X as i, V as t };
