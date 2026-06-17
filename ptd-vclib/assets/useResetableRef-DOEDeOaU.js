import { b_ as r, bJ as l, br as n } from "../vendor/packages/site/index-COeZNva1.js";
function b(e, t = {}) {
  const { shallow: a = !1 } = t,
    s = r(e),
    o = a ? l(s) : n(s);
  return {
    ref: o,
    reset: (f = e) => {
      o.value = r(f);
    },
  };
}
export { b as u };
