import "../vendor/packages/site/index-COeZNva1.js";
import { d as m } from "./utils-DF6YUpNn.js";
import { f as t } from "../vendor/packages/site/utils/level-ChrMpKO_.js";
import { s as n } from "../vendor/date-fns/format-b1gG6cM7.js";
function T(i) {
  return (
    (i = m(i)),
    (i.ratio = t(i)),
    (i.trueRatio = t(i, "trueRatio")),
    (i.messageCount ??= 0),
    typeof i.joinTime != "number" && n(new Date(i.joinTime)) && (i.joinTime = new Date(i.joinTime).getTime()),
    i
  );
}
function o(i) {
  return i > 1e4 || i === -1 || i === 1 / 0 || i === null ? "∞" : isNaN(i) || i === -1 / 0 ? "-" : i.toFixed(2);
}
function l(i, e = "ratio") {
  let a = Number(i[e] ?? -1);
  return o(a);
}
export { l as a, T as f, o as r };
