import {
  ax as b,
  bY as y,
  X as d,
  bp as v,
  bf as $,
  bX as O,
  au as h,
  z as p,
  av as x,
  a as m,
  bm as V,
  b3 as F,
  bc as N,
  A as U,
  Y as D,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import { U as t, b0 as i, c9 as X, D as Y, br as w, H as z, F as B } from "../packages/site/index-COeZNva1.js";
const H = v({ ...$({ falseIcon: "$radioOff", trueIcon: "$radioOn" }) }, "VRadio"),
  j = b()({
    name: "VRadio",
    props: H(),
    setup(e, l) {
      let { slots: s } = l;
      return (
        y(() => {
          const a = d.filterProps(e);
          return t(d, i(a, { class: ["v-radio", e.class], style: e.style, type: "radio" }), s);
        }),
        {}
      );
    },
  }),
  L = v(
    {
      height: { type: [Number, String], default: "auto" },
      ...V(N(), ["direction"]),
      ...V(F(), ["multiple"]),
      trueIcon: { type: m, default: "$radioOn" },
      falseIcon: { type: m, default: "$radioOff" },
      type: { type: String, default: "radio" },
    },
    "VRadioGroup",
  ),
  q = b()({
    name: "VRadioGroup",
    inheritAttrs: !1,
    props: L(),
    emits: { "update:modelValue": (e) => !0 },
    setup(e, l) {
      let { attrs: s, slots: a } = l;
      const I = X(),
        c = Y(() => e.id || `radio-group-${I}`),
        o = O(e, "modelValue"),
        f = w();
      return (
        y(() => {
          const [P, R] = h(s),
            g = p.filterProps(e),
            G = d.filterProps(e),
            r = a.label ? a.label({ label: e.label, props: { for: c.value } }) : e.label;
          return t(
            p,
            i({ ref: f, class: ["v-radio-group", e.class], style: e.style }, P, g, {
              modelValue: o.value,
              "onUpdate:modelValue": (u) => (o.value = u),
              id: c.value,
            }),
            {
              ...a,
              default: (u) => {
                let { id: n, messagesId: S, isDisabled: k, isReadonly: A } = u;
                return z(B, null, [
                  r && t(U, { id: n.value }, { default: () => [r] }),
                  t(
                    D,
                    i(
                      G,
                      {
                        id: n.value,
                        "aria-describedby": S.value,
                        defaultsTarget: "VRadio",
                        trueIcon: e.trueIcon,
                        falseIcon: e.falseIcon,
                        type: e.type,
                        disabled: k.value,
                        readonly: A.value,
                        "aria-labelledby": r ? n.value : void 0,
                        multiple: !1,
                      },
                      R,
                      { modelValue: o.value, "onUpdate:modelValue": (C) => (o.value = C) },
                    ),
                    a,
                  ),
                ]);
              },
            },
          );
        }),
        x({}, f)
      );
    },
  });
export { j as V, q as a };
