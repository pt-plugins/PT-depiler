import { n as l } from "./normalizeInterval-DC3nt56b.js";
import { c as i } from "./format-b1gG6cM7.js";
function p(n, c) {
  const s = {},
    r = Object.keys(n);
  for (let e = 0; e < r.length; e++) {
    const a = r[e],
      t = n[a];
    s[a] = c(t, a, n);
  }
  return s;
}
function d(n, c) {
  const { start: s, end: r } = l(c?.in, n);
  let e = +s > +r;
  const a = e ? +s : +r,
    t = e ? r : s;
  t.setHours(0, 0, 0, 0);
  let o = c?.step ?? 1;
  if (!o) return [];
  o < 0 && ((o = -o), (e = !e));
  const u = [];
  for (; +t <= a; ) (u.push(i(s, t)), t.setDate(t.getDate() + o), t.setHours(0, 0, 0, 0));
  return e ? u.reverse() : u;
}
export { d as e, p as m };
