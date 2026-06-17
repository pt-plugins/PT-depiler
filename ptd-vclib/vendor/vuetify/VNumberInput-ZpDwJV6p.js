import {
  ax as me,
  bK as fe,
  bS as pe,
  bX as ge,
  ad as R,
  bY as be,
  a3 as q,
  t as A,
  c as Q,
  r as ee,
  av as Ne,
  at as he,
  as as we,
  bp as xe,
  bm as Pe,
  bh as De,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import {
  bg as ne,
  bJ as O,
  ch as K,
  bf as Ve,
  H as w,
  U as g,
  F as B,
  b0 as Ie,
  D as x,
  br as Se,
  b2 as L,
  bY as M,
} from "../packages/site/index-COeZNva1.js";
const Fe = 50,
  ye = 500;
function Ee(n) {
  let { toggleUpDown: $ } = n,
    r = -1,
    h = -1;
  ne(s);
  function y(l) {
    (s(),
      V(l),
      window.addEventListener("pointerup", s),
      document.addEventListener("blur", s),
      (r = window.setTimeout(() => {
        h = window.setInterval(() => V(l), Fe);
      }, ye)));
  }
  function s() {
    (window.clearTimeout(r),
      window.clearInterval(h),
      window.removeEventListener("pointerup", s),
      document.removeEventListener("blur", s));
  }
  ne(s);
  function V(l) {
    $(l === "up");
  }
  return { holdStart: y, holdStop: s };
}
const Te = xe(
    {
      controlVariant: { type: String, default: "default" },
      inset: Boolean,
      hideInput: Boolean,
      modelValue: { type: Number, default: null },
      min: { type: Number, default: Number.MIN_SAFE_INTEGER },
      max: { type: Number, default: Number.MAX_SAFE_INTEGER },
      step: { type: Number, default: 1 },
      precision: { type: Number, default: 0 },
      minFractionDigits: { type: Number, default: null },
      decimalSeparator: { type: String, validator: (n) => !n || n.length === 1 },
      ...Pe(De(), ["modelValue", "validationValue"]),
    },
    "VNumberInput",
  ),
  Re = me()({
    name: "VNumberInput",
    props: { ...Te() },
    emits: { "update:focused": (n) => !0, "update:modelValue": (n) => !0 },
    setup(n, $) {
      let { slots: r } = $;
      const h = Se(),
        { holdStart: y, holdStop: s } = Ee({ toggleUpDown: z }),
        V = fe(n),
        l = x(() => V.isDisabled.value || V.isReadonly.value),
        E = O(n.focused),
        { decimalSeparator: te } = pe(),
        u = x(() => n.decimalSeparator?.[0] || te.value);
      function P(e) {
        let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : n.precision,
          d = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
        const v = t == null ? String(e) : e.toFixed(t);
        if (E.value && d) return Number(v).toString().replace(".", u.value);
        if (n.minFractionDigits === null || (t !== null && t < n.minFractionDigits)) return v.replace(".", u.value);
        let [D, c] = v.split(".");
        return (
          (c = (c ?? "")
            .padEnd(n.minFractionDigits, "0")
            .replace(new RegExp(`(?<=\\d{${n.minFractionDigits}})0+$`, "g"), "")),
          [D, c].filter(Boolean).join(u.value)
        );
      }
      const a = ge(
          n,
          "modelValue",
          null,
          (e) => e ?? null,
          (e) => (e == null ? (e ?? null) : R(Number(e), n.min, n.max)),
        ),
        b = O(null),
        I = O(null);
      K(
        a,
        (e) => {
          (E.value && !l.value && Number(b.value?.replace(u.value, ".")) === e) ||
            (e == null
              ? ((b.value = null), (I.value = null))
              : isNaN(e) || ((b.value = P(e)), (I.value = Number(b.value.replace(u.value, ".")))));
        },
        { immediate: !0 },
      );
      const i = x({
          get: () => b.value,
          set(e) {
            if (e === null || e === "") {
              ((a.value = null), (b.value = null), (I.value = null));
              return;
            }
            const t = Number(e.replace(u.value, "."));
            isNaN(t) || ((b.value = e), (I.value = t), t <= n.max && t >= n.min && (a.value = t));
          },
        }),
        ae = x(() => {
          if (I.value === null) return !1;
          const e = Number(b.value?.replace(u.value, "."));
          return e !== R(e, n.min, n.max);
        }),
        U = x(() => (l.value ? !1 : (a.value ?? 0) + n.step <= n.max)),
        _ = x(() => (l.value ? !1 : (a.value ?? 0) - n.step >= n.min)),
        o = x(() => (n.hideInput ? "stacked" : n.controlVariant)),
        Y = M(() => (o.value === "split" ? "$plus" : "$collapse")),
        G = M(() => (o.value === "split" ? "$minus" : "$expand")),
        T = M(() => (o.value === "split" ? "default" : "small")),
        C = M(() => (o.value === "stacked" ? "auto" : "100%")),
        le = { props: { onClick: k, onPointerup: N, onPointerdown: j, onPointercancel: N } },
        ue = { props: { onClick: k, onPointerup: N, onPointerdown: J, onPointercancel: N } };
      (K(
        () => n.precision,
        () => W(),
      ),
        K(
          () => n.minFractionDigits,
          () => W(),
        ),
        Ve(() => {
          H();
        }));
      function X(e) {
        if (e == null) return 0;
        const t = e.toString(),
          d = t.indexOf(".");
        return ~d ? t.length - d : 0;
      }
      function z() {
        let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
        if (l.value) return;
        if (a.value == null) {
          i.value = P(R(0, n.min, n.max));
          return;
        }
        let t = Math.max(X(a.value), X(n.step));
        (n.precision != null && (t = Math.max(t, n.precision)),
          e ? U.value && (i.value = P(a.value + n.step, t)) : _.value && (i.value = P(a.value - n.step, t)));
      }
      function ie(e) {
        if (l.value || !e.data) return;
        const t = e.target,
          { value: d, selectionStart: v, selectionEnd: D } = t ?? {},
          c = d ? d.slice(0, v) + e.data + d.slice(D) : e.data,
          m = he(c, n.precision, u.value);
        if (
          (new RegExp(`^-?\\d*${we(u.value)}?\\d*$`).test(c) ||
            (e.preventDefault(), (t.value = m), L(() => (i.value = m))),
          n.precision != null)
        ) {
          if (c.split(u.value)[1]?.length > n.precision) {
            (e.preventDefault(), (t.value = m), L(() => (i.value = m)));
            const S = (v ?? 0) + e.data.length;
            t.setSelectionRange(S, S);
          }
          n.precision === 0 && c.endsWith(u.value) && (e.preventDefault(), (t.value = m), L(() => (i.value = m)));
        }
      }
      async function re(e) {
        ["Enter", "ArrowLeft", "ArrowRight", "Backspace", "Delete", "Tab"].includes(e.key) ||
          e.ctrlKey ||
          (["ArrowDown", "ArrowUp"].includes(e.key) &&
            (e.preventDefault(), e.stopPropagation(), H(), await L(), e.key === "ArrowDown" ? z(!1) : z()));
      }
      function k(e) {
        e.stopPropagation();
      }
      function N(e) {
        (e.currentTarget?.releasePointerCapture(e.pointerId), e.preventDefault(), s());
      }
      function j(e) {
        (e.currentTarget?.setPointerCapture(e.pointerId), e.preventDefault(), e.stopPropagation(), y("up"));
      }
      function J(e) {
        (e.currentTarget?.setPointerCapture(e.pointerId), e.preventDefault(), e.stopPropagation(), y("down"));
      }
      function H() {
        if (l.value || !h.value) return;
        const e = h.value.value,
          t = Number(e.replace(u.value, "."));
        e && !isNaN(t) ? (i.value = P(R(t, n.min, n.max))) : (i.value = null);
      }
      function W() {
        l.value || (i.value = a.value !== null && !isNaN(a.value) ? P(a.value, n.precision, !1) : null);
      }
      function oe() {
        if (!l.value) {
          if (a.value === null || isNaN(a.value)) {
            i.value = null;
            return;
          }
          i.value = a.value.toString().replace(".", u.value);
        }
      }
      function ce() {
        oe();
      }
      function se() {
        H();
      }
      return (
        be(() => {
          const { modelValue: e, type: t, ...d } = q.filterProps(n);
          function v() {
            return r.increment
              ? g(
                  ee,
                  {
                    key: "increment-defaults",
                    defaults: {
                      VBtn: { disabled: !U.value, height: C.value, size: T.value, icon: Y.value, variant: "text" },
                    },
                  },
                  { default: () => [r.increment(le)] },
                )
              : g(
                  Q,
                  {
                    "aria-hidden": "true",
                    "data-testid": "increment",
                    disabled: !U.value,
                    height: C.value,
                    icon: Y.value,
                    key: "increment-btn",
                    onClick: k,
                    onPointerdown: j,
                    onPointerup: N,
                    onPointercancel: N,
                    size: T.value,
                    variant: "text",
                    tabindex: "-1",
                  },
                  null,
                );
          }
          function D() {
            return r.decrement
              ? g(
                  ee,
                  {
                    key: "decrement-defaults",
                    defaults: {
                      VBtn: { disabled: !_.value, height: C.value, size: T.value, icon: G.value, variant: "text" },
                    },
                  },
                  { default: () => [r.decrement(ue)] },
                )
              : g(
                  Q,
                  {
                    "aria-hidden": "true",
                    "data-testid": "decrement",
                    disabled: !_.value,
                    height: C.value,
                    icon: G.value,
                    key: "decrement-btn",
                    onClick: k,
                    onPointerdown: J,
                    onPointerup: N,
                    onPointercancel: N,
                    size: T.value,
                    variant: "text",
                    tabindex: "-1",
                  },
                  null,
                );
          }
          function c() {
            return w("div", { class: "v-number-input__control" }, [
              D(),
              g(A, { vertical: o.value !== "stacked" }, null),
              v(),
            ]);
          }
          function m() {
            return !n.hideInput && !n.inset ? g(A, { vertical: !0 }, null) : void 0;
          }
          const S =
              o.value === "split"
                ? w("div", { class: "v-number-input__control" }, [g(A, { vertical: !0 }, null), v()])
                : n.reverse || o.value === "hidden"
                  ? void 0
                  : w(B, null, [m(), c()]),
            de = r["append-inner"] || S,
            Z =
              o.value === "split"
                ? w("div", { class: "v-number-input__control" }, [D(), g(A, { vertical: !0 }, null)])
                : n.reverse && o.value !== "hidden"
                  ? w(B, null, [c(), m()])
                  : void 0,
            ve = r["prepend-inner"] || Z;
          return g(
            q,
            Ie({ ref: h }, d, {
              modelValue: i.value,
              "onUpdate:modelValue": (f) => (i.value = f),
              focused: E.value,
              "onUpdate:focused": (f) => (E.value = f),
              validationValue: a.value,
              error: n.error || ae.value || void 0,
              onBeforeinput: ie,
              onFocus: ce,
              onBlur: se,
              onKeydown: re,
              class: [
                "v-number-input",
                {
                  "v-number-input--default": o.value === "default",
                  "v-number-input--hide-input": n.hideInput,
                  "v-number-input--inset": n.inset,
                  "v-number-input--reverse": n.reverse,
                  "v-number-input--split": o.value === "split",
                  "v-number-input--stacked": o.value === "stacked",
                },
                n.class,
              ],
              style: n.style,
              inputmode: "decimal",
            }),
            {
              ...r,
              "append-inner": de
                ? function () {
                    for (var f = arguments.length, F = new Array(f), p = 0; p < f; p++) F[p] = arguments[p];
                    return w(B, null, [r["append-inner"]?.(...F), S]);
                  }
                : void 0,
              "prepend-inner": ve
                ? function () {
                    for (var f = arguments.length, F = new Array(f), p = 0; p < f; p++) F[p] = arguments[p];
                    return w(B, null, [Z, r["prepend-inner"]?.(...F)]);
                  }
                : void 0,
            },
          );
        }),
        Ne({}, h)
      );
    },
  });
export { Re as V };
