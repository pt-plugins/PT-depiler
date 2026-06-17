function e(t) {
  return t.flat(1 / 0).map((n) => ({ name: n, value: n }));
}
function o(t) {
  return Object.entries(t).map(([n, a]) => ({ name: a, value: n }));
}
function r(t) {
  try {
    return !/^[\p{Script_Extensions=Latin}\p{Script_Extensions=Common}]*$/u.test(t);
  } catch (n) {
    return (console.warn("Character detection failed, defaulting to Latin-only detection:", n), !1);
  }
}
export { e as a, o as b, r as h };
