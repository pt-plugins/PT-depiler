import {
  ax as F,
  bX as R,
  bH as g,
  bY as B,
  au as U,
  z as r,
  k as l,
  av as w,
  bp as z,
  bm as u,
  ba as D,
  bc as H,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import { c9 as M, U as c, b0 as d, br as N } from "../packages/site/index-COeZNva1.js";
const X = z({ ...u(H(), ["direction"]), ...u(D(), ["inline"]) }, "VCheckbox"),
  j = F()({
    name: "VCheckbox",
    inheritAttrs: !1,
    props: X(),
    emits: { "update:modelValue": (e) => !0, "update:focused": (e) => !0 },
    setup(e, n) {
      let { attrs: i, slots: o } = n;
      const s = R(e, "modelValue"),
        { isFocused: b, focus: m, blur: f } = g(e),
        t = N(),
        V = M();
      return (
        B(() => {
          const [p, k] = U(i),
            v = r.filterProps(e),
            x = l.filterProps(e);
          return c(
            r,
            d({ ref: t, class: ["v-checkbox", e.class] }, p, v, {
              modelValue: s.value,
              "onUpdate:modelValue": (a) => (s.value = a),
              id: e.id || `checkbox-${V}`,
              focused: b.value,
              style: e.style,
            }),
            {
              ...o,
              default: (a) => {
                let { id: h, messagesId: P, isDisabled: C, isReadonly: y, isValid: I } = a;
                return c(
                  l,
                  d(x, { id: h.value, "aria-describedby": P.value, disabled: C.value, readonly: y.value }, k, {
                    error: I.value === !1,
                    modelValue: s.value,
                    "onUpdate:modelValue": (A) => (s.value = A),
                    onFocus: m,
                    onBlur: f,
                  }),
                  o,
                );
              },
            },
          );
        }),
        w({}, t)
      );
    },
  });
export { j as V };
