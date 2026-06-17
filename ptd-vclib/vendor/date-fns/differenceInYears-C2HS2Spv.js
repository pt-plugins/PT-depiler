import { W as u, G as f, e as h, w as D, x as _ } from "./format-b1gG6cM7.js";
function l(n, t) {
  const e = +u(n) - +u(t);
  return e < 0 ? -1 : e > 0 ? 1 : e;
}
function F(n, t, e) {
  const [s, r] = f(e?.in, n, t),
    o = s.getFullYear() - r.getFullYear(),
    i = s.getMonth() - r.getMonth();
  return o * 12 + i;
}
function Y(n, t, e) {
  const [s, r] = f(e?.in, n, t);
  return s.getFullYear() - r.getFullYear();
}
function L(n, t, e) {
  const [s, r] = f(e?.in, n, t),
    o = g(s, r),
    i = Math.abs(h(s, r));
  s.setDate(s.getDate() - o * i);
  const a = +(g(s, r) === -o),
    c = o * (i - a);
  return c === 0 ? 0 : c;
}
function g(n, t) {
  const e =
    n.getFullYear() - t.getFullYear() ||
    n.getMonth() - t.getMonth() ||
    n.getDate() - t.getDate() ||
    n.getHours() - t.getHours() ||
    n.getMinutes() - t.getMinutes() ||
    n.getSeconds() - t.getSeconds() ||
    n.getMilliseconds() - t.getMilliseconds();
  return e < 0 ? -1 : e > 0 ? 1 : e;
}
function M(n) {
  return (t) => {
    const s = (n ? Math[n] : Math.trunc)(t);
    return s === 0 ? 0 : s;
  };
}
function C(n, t, e) {
  const [s, r] = f(e?.in, n, t),
    o = (+s - +r) / D;
  return M(e?.roundingMethod)(o);
}
function I(n, t) {
  return +u(n) - +u(t);
}
function N(n, t, e) {
  const s = I(n, t) / _;
  return M(e?.roundingMethod)(s);
}
function m(n, t) {
  const e = u(n, t?.in);
  return (e.setHours(23, 59, 59, 999), e);
}
function y(n, t) {
  const e = u(n, t?.in),
    s = e.getMonth();
  return (e.setFullYear(e.getFullYear(), s + 1, 0), e.setHours(23, 59, 59, 999), e);
}
function H(n, t) {
  const e = u(n, t?.in);
  return +m(e, t) == +y(e, t);
}
function O(n, t, e) {
  const [s, r, o] = f(e?.in, n, n, t),
    i = l(r, o),
    a = Math.abs(F(r, o));
  if (a < 1) return 0;
  (r.getMonth() === 1 && r.getDate() > 27 && r.setDate(30), r.setMonth(r.getMonth() - i * a));
  let c = l(r, o) === -i;
  H(s) && a === 1 && l(s, o) === 1 && (c = !1);
  const d = i * (a - +c);
  return d === 0 ? 0 : d;
}
function k(n, t, e) {
  const [s, r] = f(e?.in, n, t),
    o = l(s, r),
    i = Math.abs(Y(s, r));
  (s.setFullYear(1584), r.setFullYear(1584));
  const a = l(s, r) === -o,
    c = o * (i - +a);
  return c === 0 ? 0 : c;
}
export { Y as a, L as b, l as c, F as d, C as e, I as f, N as g, O as h, k as i, m as j, y as k, M as l, H as m };
