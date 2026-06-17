import { W as e, c as n } from "./format-b1gG6cM7.js";
function i(r, t, a) {
  const s = e(r, a?.in);
  return isNaN(t) ? n(a?.in || r, NaN) : (t && s.setDate(s.getDate() + t), s);
}
function u(r, t, a) {
  return i(r, -t, a);
}
export { i as a, u as s };
