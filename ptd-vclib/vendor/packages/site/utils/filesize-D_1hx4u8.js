const r = /^(\d*\.?\d+)([\s\-_]{0,3})([ZEPTGMK](B|iB))s?$/i,
  n = Math.pow(2, 10),
  c = Math.pow(2, 20),
  i = Math.pow(2, 30),
  o = Math.pow(2, 40),
  B = Math.pow(2, 50),
  p = Math.pow(2, 60),
  u = Math.pow(2, 70);
function M(e) {
  e = e.replace(/,/g, "");
  const a = e.match(r);
  if (a) {
    const t = parseFloat(a[1]),
      s = a[3];
    switch (!0) {
      case /Zi?B/i.test(s):
        return t * u;
      case /Ei?B/i.test(s):
        return t * p;
      case /Pi?B/i.test(s):
        return t * B;
      case /Ti?B/i.test(s):
        return t * o;
      case /Gi?B/i.test(s):
        return t * i;
      case /Mi?B/i.test(s):
        return t * c;
      case /Ki?B/i.test(s):
        return t * n;
      default:
        return t;
    }
  }
  return 0;
}
export { i as G, o as T, M as p, r as s };
