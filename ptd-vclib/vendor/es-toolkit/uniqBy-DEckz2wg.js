function u(e, i) {
  const n = new Map();
  for (let t = 0; t < e.length; t++) {
    const o = e[t],
      s = i(o, t, e);
    n.has(s) || n.set(s, o);
  }
  return Array.from(n.values());
}
export { u };
