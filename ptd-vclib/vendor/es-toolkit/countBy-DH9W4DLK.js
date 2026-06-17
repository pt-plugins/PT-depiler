function u(n, c) {
  const e = {};
  for (let t = 0; t < n.length; t++) {
    const s = n[t],
      o = c(s, t, n);
    e[o] = (e[o] ?? 0) + 1;
  }
  return e;
}
export { u as c };
