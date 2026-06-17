function c(f, l = 1) {
  const o = [],
    i = Math.floor(l),
    s = (r, n) => {
      for (let t = 0; t < r.length; t++) {
        const e = r[t];
        Array.isArray(e) && n < i ? s(e, n + 1) : o.push(e);
      }
    };
  return (s(f, 0), o);
}
export { c as f };
