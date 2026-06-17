import {
  ax as re,
  b as $,
  bX as se,
  bH as ce,
  bE as de,
  bw as fe,
  bY as ve,
  au as me,
  z as p,
  w as O,
  ag as A,
  av as xe,
  ad as ge,
  bp as he,
  bb as be,
  bm as we,
  bc as ye,
  aM as Ve,
  q as Fe,
  cc as Ce,
  ab as Pe,
  bx as He,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import {
  br as x,
  cj as Ie,
  bf as ke,
  ch as c,
  bb as Ne,
  U as M,
  b0 as z,
  b2 as V,
  D as F,
  bJ as Re,
  H as u,
  F as B,
  cl as W,
  b3 as Se,
} from "../packages/site/index-COeZNva1.js";
const Ae = he(
    {
      autoGrow: Boolean,
      autofocus: Boolean,
      counter: [Boolean, Number, String],
      counterValue: Function,
      prefix: String,
      placeholder: String,
      persistentPlaceholder: Boolean,
      persistentCounter: Boolean,
      noResize: Boolean,
      rows: { type: [Number, String], default: 5, validator: (e) => !isNaN(parseFloat(e)) },
      maxHeight: { type: [Number, String], validator: (e) => !isNaN(parseFloat(e)) },
      maxRows: { type: [Number, String], validator: (e) => !isNaN(parseFloat(e)) },
      suffix: String,
      modelModifiers: Object,
      ...Ve(),
      ...we(ye(), ["direction"]),
      ...be(),
    },
    "VTextarea",
  ),
  Be = re()({
    name: "VTextarea",
    directives: { vIntersect: $ },
    inheritAttrs: !1,
    props: Ae(),
    emits: {
      "click:control": (e) => !0,
      "mousedown:control": (e) => !0,
      "update:focused": (e) => !0,
      "update:modelValue": (e) => !0,
      "update:rows": (e) => !0,
    },
    setup(e, j) {
      let { attrs: C, emit: P, slots: d } = j;
      const l = se(e, "modelValue"),
        { isFocused: g, focus: q, blur: J } = ce(e),
        { onIntersect: X } = He(e),
        Y = F(() =>
          typeof e.counterValue == "function" ? e.counterValue(l.value) : (l.value || "").toString().length,
        ),
        K = F(() => {
          if (C.maxlength) return C.maxlength;
          if (!(!e.counter || (typeof e.counter != "number" && typeof e.counter != "string"))) return e.counter;
        }),
        D = x(),
        b = x(),
        T = Re(""),
        f = x(),
        H = x(0),
        { platform: L } = de(),
        w = fe(e),
        Q = F(() => e.persistentPlaceholder || g.value || e.active);
      function I() {
        (w.isSuppressing.value && w.update(), f.value !== document.activeElement && f.value?.focus(), g.value || q());
      }
      function Z(t) {
        (I(), P("click:control", t));
      }
      function ee(t) {
        P("mousedown:control", t);
      }
      function te(t) {
        (t.stopPropagation(),
          I(),
          V(() => {
            ((l.value = ""), Pe(e["onClick:clear"], t));
          }));
      }
      function ae(t) {
        const a = t.target;
        if (!e.modelModifiers?.trim) {
          l.value = a.value;
          return;
        }
        const n = a.value,
          m = a.selectionStart,
          r = a.selectionEnd;
        ((l.value = n),
          V(() => {
            let s = 0;
            (n.trimStart().length === a.value.length && (s = n.length - a.value.length),
              m != null && (a.selectionStart = m - s),
              r != null && (a.selectionEnd = r - s));
          }));
      }
      const v = x(),
        h = x(Number(e.rows)),
        k = F(() => ["plain", "underlined"].includes(e.variant));
      Ie(() => {
        e.autoGrow || (h.value = Number(e.rows));
      });
      function i() {
        (V(() => {
          if (!f.value) return;
          if (L.value.firefox) {
            H.value = 12;
            return;
          }
          const { offsetWidth: t, clientWidth: a } = f.value;
          H.value = Math.max(0, t - a);
        }),
          e.autoGrow &&
            V(() => {
              if (!v.value || !b.value) return;
              const t = getComputedStyle(v.value),
                a = getComputedStyle(b.value.$el),
                n =
                  parseFloat(t.getPropertyValue("--v-field-padding-top")) +
                  parseFloat(t.getPropertyValue("--v-input-padding-top")) +
                  parseFloat(t.getPropertyValue("--v-field-padding-bottom")),
                m = v.value.scrollHeight,
                r = parseFloat(t.lineHeight),
                s = Math.max(parseFloat(e.rows) * r + n, parseFloat(a.getPropertyValue("--v-input-control-height"))),
                N = e.maxHeight ? parseFloat(e.maxHeight) : parseFloat(e.maxRows) * r + n || 1 / 0,
                o = ge(m ?? 0, s, N);
              ((h.value = Math.floor((o - n) / r)), (T.value = A(o)));
            }));
      }
      (ke(i),
        c(l, i),
        c(() => e.rows, i),
        c(() => e.maxHeight, i),
        c(() => e.maxRows, i),
        c(() => e.density, i),
        c(h, (t) => {
          P("update:rows", t);
        }));
      let y;
      return (
        c(v, (t) => {
          t ? ((y = new ResizeObserver(i)), y.observe(v.value)) : y?.disconnect();
        }),
        Ne(() => {
          y?.disconnect();
        }),
        ve(() => {
          const t = !!(d.counter || e.counter || e.counterValue),
            a = !!(t || d.details),
            [n, m] = me(C),
            { modelValue: r, ...s } = p.filterProps(e),
            N = { ...O.filterProps(e), "onClick:clear": te };
          return M(
            p,
            z(
              {
                ref: D,
                modelValue: l.value,
                "onUpdate:modelValue": (o) => (l.value = o),
                class: [
                  "v-textarea v-text-field",
                  {
                    "v-textarea--prefixed": e.prefix,
                    "v-textarea--suffixed": e.suffix,
                    "v-text-field--prefixed": e.prefix,
                    "v-text-field--suffixed": e.suffix,
                    "v-textarea--auto-grow": e.autoGrow,
                    "v-textarea--no-resize": e.noResize || e.autoGrow,
                    "v-input--plain-underlined": k.value,
                  },
                  e.class,
                ],
                style: [
                  {
                    "--v-textarea-max-height": e.maxHeight ? A(e.maxHeight) : void 0,
                    "--v-textarea-scroll-bar-width": A(H.value),
                  },
                  e.style,
                ],
              },
              n,
              s,
              { centerAffix: h.value === 1 && !k.value, focused: g.value },
            ),
            {
              ...d,
              default: (o) => {
                let { id: R, isDisabled: _, isDirty: E, isReadonly: le, isValid: ne, hasDetails: oe } = o;
                return M(
                  O,
                  z(
                    {
                      ref: b,
                      style: { "--v-textarea-control-height": T.value },
                      onClick: Z,
                      onMousedown: ee,
                      "onClick:prependInner": e["onClick:prependInner"],
                      "onClick:appendInner": e["onClick:appendInner"],
                    },
                    N,
                    {
                      id: R.value,
                      active: Q.value || E.value,
                      labelId: `${R.value}-label`,
                      centerAffix: h.value === 1 && !k.value,
                      dirty: E.value || e.dirty,
                      disabled: _.value,
                      focused: g.value,
                      details: oe.value,
                      error: ne.value === !1,
                    },
                  ),
                  {
                    ...d,
                    default: (ue) => {
                      let {
                        props: { class: G, ...U },
                        controlRef: ie,
                      } = ue;
                      return u(B, null, [
                        e.prefix && u("span", { class: "v-text-field__prefix" }, [e.prefix]),
                        W(
                          u(
                            "textarea",
                            z(
                              {
                                ref: (S) => (f.value = ie.value = S),
                                class: G,
                                value: l.value,
                                onInput: ae,
                                autofocus: e.autofocus,
                                readonly: le.value,
                                disabled: _.value,
                                placeholder: e.placeholder,
                                rows: e.rows,
                                name: w.fieldName.value,
                                autocomplete: w.fieldAutocomplete.value,
                                onFocus: I,
                                onBlur: J,
                                "aria-labelledby": `${R.value}-label`,
                              },
                              U,
                              m,
                            ),
                            null,
                          ),
                          [[$, { handler: X }, null, { once: !0 }]],
                        ),
                        e.autoGrow &&
                          W(
                            u(
                              "textarea",
                              {
                                class: Se([G, "v-textarea__sizer"]),
                                id: `${U.id}-sizer`,
                                "onUpdate:modelValue": (S) => (l.value = S),
                                ref: v,
                                readonly: !0,
                                "aria-hidden": "true",
                              },
                              null,
                            ),
                            [[Ce, l.value]],
                          ),
                        e.suffix && u("span", { class: "v-text-field__suffix" }, [e.suffix]),
                      ]);
                    },
                  },
                );
              },
              details: a
                ? (o) =>
                    u(B, null, [
                      d.details?.(o),
                      t &&
                        u(B, null, [
                          u("span", null, null),
                          M(
                            Fe,
                            {
                              active: e.persistentCounter || g.value,
                              value: Y.value,
                              max: K.value,
                              disabled: e.disabled,
                            },
                            d.counter,
                          ),
                        ]),
                    ])
                : void 0,
            },
          );
        }),
        xe({}, D, b, f)
      );
    },
  });
export { Be as V };
