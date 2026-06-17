import { i as l } from "./isPlainObject-3NY8ex7Q.js";
import { aW as t } from "../packages/site/index-COeZNva1.js";
function n(e, f) {
  const c = Object.keys(f);
  for (let s = 0; s < c.length; s++) {
    const r = c[s];
    if (t(r)) continue;
    const i = f[r],
      o = e[r];
    a(i) && a(o)
      ? (e[r] = n(o, i))
      : Array.isArray(i)
        ? (e[r] = n([], i))
        : l(i)
          ? (e[r] = n({}, i))
          : (o === void 0 || i !== void 0) && (e[r] = i);
  }
  return e;
}
function a(e) {
  return l(e) || Array.isArray(e);
}
export { n as m };
