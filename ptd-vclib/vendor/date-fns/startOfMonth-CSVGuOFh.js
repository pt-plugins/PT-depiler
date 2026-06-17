import { f as a } from "../es-toolkit/flatten-CRv0zNMl.js";
import { W as r } from "./format-b1gG6cM7.js";
function i(n) {
  return a(n, 1 / 0);
}
function c(n, o) {
  const t = r(n, o?.in),
    e = t.getMonth(),
    s = e - (e % 3);
  return (t.setMonth(s, 1), t.setHours(0, 0, 0, 0), t);
}
function h(n, o) {
  const t = r(n, o?.in);
  return (t.setDate(1), t.setHours(0, 0, 0, 0), t);
}
export { c as a, i as f, h as s };
