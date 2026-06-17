function l(n, e) {
  const o = { ...n };
  for (let t = 0; t < e.length; t++) {
    const r = e[t];
    delete o[r];
  }
  return o;
}
export { l as o };
