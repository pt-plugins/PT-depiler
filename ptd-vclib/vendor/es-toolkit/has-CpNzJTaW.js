import { aD as i, bW as a, ax as f, aH as u } from "../packages/site/index-COeZNva1.js";
function y(t, e) {
  let s;
  if (
    (Array.isArray(e) ? (s = e) : typeof e == "string" && i(e) && t?.[e] == null ? (s = a(e)) : (s = [e]),
    s.length === 0)
  )
    return !1;
  let r = t;
  for (let l = 0; l < s.length; l++) {
    const n = s[l];
    if ((r == null || !Object.hasOwn(r, n)) && !((Array.isArray(r) || f(r)) && u(n) && n < r.length)) return !1;
    r = r[n];
  }
  return !0;
}
export { y as h };
