import {
  ax as $,
  bX as k,
  bR as j,
  bH as q,
  S as G,
  bY as J,
  au as K,
  z as V,
  X as g,
  av as Q,
  bp as W,
  bf as Z,
  bc as ee,
  r as ae,
  U as te,
  x as le,
  L as se,
  O as oe,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import {
  c9 as ne,
  U as l,
  b0 as w,
  bY as C,
  br as y,
  H as n,
  b5 as S,
  b3 as P,
  F as ie,
} from "../packages/site/index-COeZNva1.js";
const re = W(
    {
      indeterminate: Boolean,
      inset: Boolean,
      flat: Boolean,
      loading: { type: [Boolean, String], default: !1 },
      ...ee(),
      ...Z(),
    },
    "VSwitch",
  ),
  de = $()({
    name: "VSwitch",
    inheritAttrs: !1,
    props: re(),
    emits: { "update:focused": (e) => !0, "update:modelValue": (e) => !0, "update:indeterminate": (e) => !0 },
    setup(e, _) {
      let { attrs: x, slots: a } = _;
      const i = k(e, "indeterminate"),
        s = k(e, "modelValue"),
        { loaderClasses: A } = j(e),
        { isFocused: I, focus: F, blur: R } = q(e),
        v = y(),
        m = y(),
        b = G && window.matchMedia("(forced-colors: active)").matches,
        z = C(() => (typeof e.loading == "string" && e.loading !== "" ? e.loading : e.color)),
        B = ne(),
        M = C(() => e.id || `switch-${B}`);
      function U() {
        i.value && (i.value = !1);
      }
      function p(r) {
        (r.stopPropagation(), r.preventDefault(), v.value?.input?.click());
      }
      return (
        J(() => {
          const [r, D] = K(x),
            T = V.filterProps(e),
            H = g.filterProps(e);
          return l(
            V,
            w(
              {
                ref: m,
                class: [
                  "v-switch",
                  { "v-switch--flat": e.flat },
                  { "v-switch--inset": e.inset },
                  { "v-switch--indeterminate": i.value },
                  A.value,
                  e.class,
                ],
              },
              r,
              T,
              {
                modelValue: s.value,
                "onUpdate:modelValue": (u) => (s.value = u),
                id: M.value,
                focused: I.value,
                style: e.style,
              },
            ),
            {
              ...a,
              default: (u) => {
                let { id: L, messagesId: N, isDisabled: O, isReadonly: X, isValid: h } = u;
                const c = { model: s, isValid: h };
                return l(
                  g,
                  w(
                    { ref: v },
                    H,
                    {
                      modelValue: s.value,
                      "onUpdate:modelValue": [(o) => (s.value = o), U],
                      id: L.value,
                      "aria-describedby": N.value,
                      type: "checkbox",
                      "aria-checked": i.value ? "mixed" : void 0,
                      disabled: O.value,
                      readonly: X.value,
                      onFocus: F,
                      onBlur: R,
                    },
                    D,
                  ),
                  {
                    ...a,
                    default: (o) => {
                      let { backgroundColorClasses: d, backgroundColorStyles: t } = o;
                      return n(
                        "div",
                        { class: P(["v-switch__track", b ? void 0 : d.value]), style: S(t.value), onClick: p },
                        [
                          a["track-true"] &&
                            n("div", { key: "prepend", class: "v-switch__track-true" }, [a["track-true"](c)]),
                          a["track-false"] &&
                            n("div", { key: "append", class: "v-switch__track-false" }, [a["track-false"](c)]),
                        ],
                      );
                    },
                    input: (o) => {
                      let { inputNode: d, icon: t, backgroundColorClasses: Y, backgroundColorStyles: E } = o;
                      return n(ie, null, [
                        d,
                        n(
                          "div",
                          {
                            class: P([
                              "v-switch__thumb",
                              { "v-switch__thumb--filled": t || e.loading },
                              e.inset || b ? void 0 : Y.value,
                            ]),
                            style: S(e.inset ? void 0 : E.value),
                          },
                          [
                            a.thumb
                              ? l(
                                  ae,
                                  { defaults: { VIcon: { icon: t, size: "x-small" } } },
                                  { default: () => [a.thumb({ ...c, icon: t })] },
                                )
                              : l(te, null, {
                                  default: () => [
                                    e.loading
                                      ? l(
                                          se,
                                          { name: "v-switch", active: !0, color: h.value === !1 ? void 0 : z.value },
                                          {
                                            default: (f) =>
                                              a.loader
                                                ? a.loader(f)
                                                : l(
                                                    oe,
                                                    {
                                                      active: f.isActive,
                                                      color: f.color,
                                                      indeterminate: !0,
                                                      size: "16",
                                                      width: "2",
                                                    },
                                                    null,
                                                  ),
                                          },
                                        )
                                      : t && l(le, { key: String(t), icon: t, size: "x-small" }, null),
                                  ],
                                }),
                          ],
                        ),
                      ]);
                    },
                  },
                );
              },
            },
          );
        }),
        Q({}, m)
      );
    },
  });
export { de as V };
