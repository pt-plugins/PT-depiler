function u(e, o, r = 1) {
  if ((o == null && ((o = e), (e = 0)), !Number.isInteger(r) || r === 0))
    throw new Error("The step value must be a non-zero integer.");
  const i = Math.max(Math.ceil((o - e) / r), 0),
    l = new Array(i);
  for (let n = 0; n < i; n++) l[n] = e + n * r;
  return l;
}
export { u as r };
