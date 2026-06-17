import { aN as d, aV as p, aW as A } from "../packages/site/index-COeZNva1.js";
import { i as y } from "./isPlainObject-3NY8ex7Q.js";
function u(e) {
  if (d(e)) return e;
  if (
    Array.isArray(e) ||
    p(e) ||
    e instanceof ArrayBuffer ||
    (typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer)
  )
    return e.slice(0);
  const i = Object.getPrototypeOf(e);
  if (i == null) return Object.assign(Object.create(i), e);
  const r = i.constructor;
  if (e instanceof Date || e instanceof Map || e instanceof Set) return new r(e);
  if (e instanceof RegExp) {
    const n = new r(e);
    return ((n.lastIndex = e.lastIndex), n);
  }
  if (e instanceof DataView) return new r(e.buffer.slice(0));
  if (e instanceof Error) {
    let n;
    return (
      e instanceof AggregateError
        ? (n = new r(e.errors, e.message, { cause: e.cause }))
        : (n = new r(e.message, { cause: e.cause })),
      (n.stack = e.stack),
      Object.assign(n, e),
      n
    );
  }
  return typeof File < "u" && e instanceof File
    ? new r([e], e.name, { type: e.type, lastModified: e.lastModified })
    : typeof e == "object"
      ? Object.assign(Object.create(i), e)
      : e;
}
function a(e, i, r) {
  const n = Object.keys(i);
  for (let s = 0; s < n.length; s++) {
    const t = n[s];
    if (A(t)) continue;
    const f = i[t],
      c = e[t],
      l = r(c, f, t, e, i);
    l !== void 0
      ? (e[t] = l)
      : Array.isArray(f)
        ? Array.isArray(c)
          ? (e[t] = a(c, f, r))
          : (e[t] = a([], f, r))
        : y(f)
          ? y(c)
            ? (e[t] = a(c, f, r))
            : (e[t] = a({}, f, r))
          : (c === void 0 || f !== void 0) && (e[t] = f);
  }
  return e;
}
function O(e, i) {
  return a(u(e), i, function r(n, s) {
    if (Array.isArray(s)) return Array.isArray(n) ? a(u(n), s, r) : a([], s, r);
    if (y(s)) return y(n) ? a(u(n), s, r) : a({}, s, r);
  });
}
export { u as c, a as m, O as t };
