import { c3 as u } from "../packages/site/index-COeZNva1.js";
function l(n, t) {
  if (!Number.isInteger(t) || t <= 0) throw new Error("Size must be an integer greater than zero.");
  const e = Math.ceil(n.length / t),
    o = Array(e);
  for (let r = 0; r < e; r++) {
    const a = r * t,
      c = a + t;
    o[r] = n.slice(a, c);
  }
  return o;
}
function i(n) {
  return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
}
const s = /\p{Lu}?\p{Ll}+|[0-9]+|\p{Lu}+(?!\p{Ll})|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{L}+/gu;
function p(n) {
  return Array.from(n.match(s) ?? []);
}
function f(n, t) {
  return u(n.concat(t));
}
function m(n) {
  return p(n)
    .map((t) => i(t))
    .join("");
}
export { l as a, i as c, m as p, f as u, p as w };
