function i(n, r) {
  const s = {},
    c = Object.keys(n);
  for (let t = 0; t < c.length; t++) {
    const e = c[t],
      o = n[e];
    r(o, e) && (s[e] = o);
  }
  return s;
}
export { i as p };
