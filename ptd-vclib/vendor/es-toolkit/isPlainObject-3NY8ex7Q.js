function o(t) {
  if (!t || typeof t != "object") return !1;
  const e = Object.getPrototypeOf(t);
  return e === null || e === Object.prototype || Object.getPrototypeOf(e) === null
    ? Object.prototype.toString.call(t) === "[object Object]"
    : !1;
}
export { o as i };
