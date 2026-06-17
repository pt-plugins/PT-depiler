function r(t) {
  return t;
}
function e(t) {
  if (typeof t != "string") return !1;
  try {
    return (JSON.parse(t), !0);
  } catch {
    return !1;
  }
}
export { e as a, r as i };
