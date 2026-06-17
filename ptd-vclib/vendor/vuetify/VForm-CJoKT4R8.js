import {
  ax as d,
  ai as b,
  bY as p,
  av as v,
  bp as y,
  aW as F,
  aO as V,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import { H as h, b5 as R, b3 as P, br as k } from "../packages/site/index-COeZNva1.js";
const C = y({ ...V(), ...F() }, "VForm"),
  z = d()({
    name: "VForm",
    props: C(),
    emits: { "update:modelValue": (a) => !0, submit: (a) => !0 },
    setup(a, n) {
      let { slots: m, emit: l } = n;
      const o = b(a),
        s = k();
      function i(r) {
        (r.preventDefault(), o.reset());
      }
      function f(r) {
        const t = r,
          e = o.validate();
        ((t.then = e.then.bind(e)),
          (t.catch = e.catch.bind(e)),
          (t.finally = e.finally.bind(e)),
          l("submit", t),
          t.defaultPrevented ||
            e.then((u) => {
              let { valid: c } = u;
              c && s.value?.submit();
            }),
          t.preventDefault());
      }
      return (
        p(() =>
          h(
            "form",
            { ref: s, class: P(["v-form", a.class]), style: R(a.style), novalidate: !0, onReset: i, onSubmit: f },
            [m.default?.(o)],
          ),
        ),
        v(o, s)
      );
    },
  });
export { z as V };
