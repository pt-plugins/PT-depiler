import {
  ax as $,
  c9 as le,
  by as O,
  bY as W,
  c as z,
  av as ie,
  aa as re,
  bu as ue,
  bp as R,
  bm as Q,
  b9 as de,
  bX as J,
  bC as ce,
  c3 as be,
  bq as me,
  _ as A,
  ag as E,
  b6 as ve,
  aQ as fe,
  bg as ge,
  bn as ye,
  aH as Ve,
  bN as we,
  bz as Ce,
  c2 as Te,
  bt as Se,
  f as H,
  c0 as ke,
  b$ as he,
  x as xe,
  i as _e,
  t as Be,
  g as Pe,
  T as Ie,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  U as o,
  b0 as x,
  br as j,
  D as _,
  H as U,
  b5 as $e,
  b3 as We,
  F as X,
  as as Re,
  bY as y,
  X as De,
  I as P,
  ck as f,
  ce as Ee,
  bw as Ne,
  bj as h,
  L as ze,
  bu as Ue,
  c4 as N,
  Q as F,
  bS as p,
  bx as Me,
  J as q,
} from "../vendor/packages/site/index-COeZNva1.js";
import { V as M, b as Xe, a as L, m as Ye } from "../vendor/vuetify/VWindowItem-CGCDkWEG.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
const Y = Symbol.for("vuetify:v-tabs"),
  K = R(
    {
      fixed: Boolean,
      sliderColor: String,
      sliderTransition: String,
      sliderTransitionDuration: [String, Number],
      hideSlider: Boolean,
      inset: Boolean,
      direction: { type: String, default: "horizontal" },
      ...Q(de({ selectedClass: "v-tab--selected", variant: "text" }), [
        "active",
        "block",
        "flat",
        "location",
        "position",
        "symbol",
      ]),
    },
    "VTab",
  ),
  Z = $()({
    name: "VTab",
    props: K(),
    setup(e, s) {
      let { slots: d, attrs: a } = s;
      const { textColorClasses: l, textColorStyles: g } = le(() => e.sliderColor),
        { backgroundColorClasses: r, backgroundColorStyles: c } = O(() => e.sliderColor),
        u = j(),
        V = j(),
        b = _(() => e.direction === "horizontal"),
        n = _(() => u.value?.group?.isSelected.value ?? !1);
      function t(w, B) {
        return { opacity: [0, 1] };
      }
      function D(w, B) {
        return e.direction === "vertical"
          ? { transform: ["scaleY(0)", "scaleY(1)"] }
          : { transform: ["scaleX(0)", "scaleX(1)"] };
      }
      function i(w, B) {
        const m = B.getBoundingClientRect(),
          v = w.getBoundingClientRect(),
          C = b.value ? "x" : "y",
          T = b.value ? "X" : "Y",
          I = b.value ? "right" : "bottom",
          S = b.value ? "width" : "height",
          te = m[C],
          ae = v[C],
          k = te > ae ? m[I] - v[I] : m[C] - v[C],
          se =
            Math.sign(k) > 0
              ? b.value
                ? "right"
                : "bottom"
              : Math.sign(k) < 0
                ? b.value
                  ? "left"
                  : "top"
                : "center",
          ne = (Math.abs(k) + (Math.sign(k) < 0 ? m[S] : v[S])) / Math.max(m[S], v[S]) || 0,
          oe = m[S] / v[S] || 0,
          G = 1.5;
        return {
          transform: [
            `translate${T}(${k}px) scale${T}(${oe})`,
            `translate${T}(${k / G}px) scale${T}(${(ne - 1) / G + 1})`,
            "none",
          ],
          transformOrigin: Array(3).fill(se),
        };
      }
      function ee(w) {
        let { value: B } = w;
        if (B) {
          const m = u.value?.$el.parentElement?.querySelector(".v-tab--selected .v-tab__slider"),
            v = V.value;
          if (!m || !v) return;
          const C = getComputedStyle(m).backgroundColor,
            T = { fade: t, grow: D, shift: i }[e.sliderTransition ?? "shift"] ?? i,
            I =
              Number(e.sliderTransitionDuration) ||
              ({ fade: 400, grow: 350, shift: 225 }[e.sliderTransition ?? "shift"] ?? 225);
          re(v, { backgroundColor: [C, C], ...T(v, m) }, { duration: I, easing: ue });
        }
      }
      return (
        W(() => {
          const w = z.filterProps(e);
          return o(
            z,
            x(
              {
                symbol: Y,
                ref: u,
                class: ["v-tab", e.class, n.value && e.inset ? r.value : []],
                style: [
                  e.style,
                  n.value && e.inset ? c.value : [],
                  { backgroundColor: n.value && e.inset ? "transparent !important" : void 0 },
                ],
                tabindex: n.value ? 0 : -1,
                role: "tab",
                "aria-selected": String(n.value),
                active: !1,
              },
              w,
              a,
              { block: e.fixed, maxWidth: e.fixed ? 300 : void 0, "onGroup:selected": ee },
            ),
            {
              ...d,
              default: () =>
                U(X, null, [
                  d.default?.() ?? e.text,
                  !e.hideSlider &&
                    U(
                      "div",
                      {
                        ref: V,
                        class: We(["v-tab__slider", e.inset ? r.value : l.value]),
                        style: $e([g.value, e.inset ? c.value : l.value]),
                      },
                      null,
                    ),
                ]),
            },
          );
        }),
        ie({}, u)
      );
    },
  }),
  Ge = R({ ...Q(Xe(), ["continuous", "nextIcon", "prevIcon", "showArrows", "touch", "mandatory"]) }, "VTabsWindow"),
  Ae = $()({
    name: "VTabsWindow",
    props: Ge(),
    emits: { "update:modelValue": (e) => !0 },
    setup(e, s) {
      let { slots: d } = s;
      const a = Re(Y, null),
        l = J(e, "modelValue"),
        g = _({
          get() {
            return l.value != null || !a ? l.value : a.items.value.find((r) => a.selected.value.includes(r.id))?.value;
          },
          set(r) {
            l.value = r;
          },
        });
      return (
        W(() => {
          const r = M.filterProps(e);
          return o(
            M,
            x({ _as: "VTabsWindow" }, r, {
              modelValue: g.value,
              "onUpdate:modelValue": (c) => (g.value = c),
              class: ["v-tabs-window", e.class],
              style: e.style,
              mandatory: !1,
              touch: !1,
            }),
            d,
          );
        }),
        {}
      );
    },
  }),
  He = R({ ...Ye() }, "VTabsWindowItem"),
  je = $()({
    name: "VTabsWindowItem",
    props: He(),
    setup(e, s) {
      let { slots: d } = s;
      return (
        W(() => {
          const a = L.filterProps(e);
          return o(L, x({ _as: "VTabsWindowItem" }, a, { class: ["v-tabs-window-item", e.class], style: e.style }), d);
        }),
        {}
      );
    },
  });
function Fe(e) {
  return e ? e.map((s) => (Ve(s) ? s : { text: s, value: s })) : [];
}
const pe = R(
    {
      alignTabs: { type: String, default: "start" },
      color: String,
      fixedTabs: Boolean,
      items: { type: Array, default: () => [] },
      stacked: Boolean,
      bgColor: String,
      grow: Boolean,
      height: { type: [Number, String], default: void 0 },
      hideSlider: Boolean,
      inset: Boolean,
      insetPadding: [String, Number],
      insetRadius: [String, Number],
      sliderColor: String,
      ...ye(K(), ["spaced", "sliderTransition", "sliderTransitionDuration"]),
      ...ge({ mandatory: "force", selectedClass: "v-tab-item--selected" }),
      ...fe(),
      ...ve(),
    },
    "VTabs",
  ),
  qe = $()({
    name: "VTabs",
    props: pe(),
    emits: { "update:modelValue": (e) => !0 },
    setup(e, s) {
      let { attrs: d, slots: a } = s;
      const l = J(e, "modelValue"),
        g = _(() => Fe(e.items)),
        { densityClasses: r } = ce(e),
        { backgroundColorClasses: c, backgroundColorStyles: u } = O(() => e.bgColor),
        { scopeId: V } = be();
      return (
        me({
          VTab: {
            color: y(e, "color"),
            direction: y(e, "direction"),
            stacked: y(e, "stacked"),
            fixed: y(e, "fixedTabs"),
            inset: y(e, "inset"),
            sliderColor: y(e, "sliderColor"),
            sliderTransition: y(e, "sliderTransition"),
            sliderTransitionDuration: y(e, "sliderTransitionDuration"),
            hideSlider: y(e, "hideSlider"),
          },
        }),
        W(() => {
          const b = A.filterProps(e),
            n = !!(a.window || e.items.length > 0);
          return U(X, null, [
            o(
              A,
              x(
                b,
                {
                  modelValue: l.value,
                  "onUpdate:modelValue": (t) => (l.value = t),
                  class: [
                    "v-tabs",
                    `v-tabs--${e.direction}`,
                    `v-tabs--align-tabs-${e.alignTabs}`,
                    {
                      "v-tabs--fixed-tabs": e.fixedTabs,
                      "v-tabs--grow": e.grow,
                      "v-tabs--inset": e.inset,
                      "v-tabs--stacked": e.stacked,
                    },
                    r.value,
                    c.value,
                    e.class,
                  ],
                  style: [
                    {
                      "--v-tabs-height": E(e.height),
                      "--v-tabs-inset-padding": e.inset ? E(e.insetPadding) : void 0,
                      "--v-tabs-inset-radius": e.inset ? E(e.insetRadius) : void 0,
                    },
                    u.value,
                    e.style,
                  ],
                  role: "tablist",
                  symbol: Y,
                },
                V,
                d,
              ),
              {
                default:
                  a.default ??
                  (() =>
                    g.value.map(
                      (t) =>
                        a.tab?.({ item: t }) ??
                        o(Z, x(t, { key: t.text, value: t.value, spaced: e.spaced }), {
                          default: a[`tab.${t.value}`] ? () => a[`tab.${t.value}`]?.({ item: t }) : void 0,
                        }),
                    )),
                prev: a.prev,
                next: a.next,
              },
            ),
            n &&
              o(Ae, x({ modelValue: l.value, "onUpdate:modelValue": (t) => (l.value = t), key: "tabs-window" }, V), {
                default: () => [
                  g.value.map(
                    (t) =>
                      a.item?.({ item: t }) ??
                      o(je, { value: t.value }, { default: () => a[`item.${t.value}`]?.({ item: t }) }),
                  ),
                  a.window?.(),
                ],
              }),
          ]);
        }),
        {}
      );
    },
  }),
  Ze = De({
    __name: "Index",
    setup(e) {
      const { t: s } = we(),
        d = ke(),
        a = he(),
        l = Ce(),
        g = Te(),
        r = Se.map((n) => ({ key: n.alias ?? n.path, route: n.name, icon: n.meta.icon })),
        c = Ee("setTabRef"),
        u = _({
          get() {
            return a.name;
          },
          set(n) {
            d.push({ name: n });
          },
        }),
        V = _(() => a.meta?.usesGlobalSave !== !1);
      async function b() {
        (await c.value?.beforeSave?.(),
          await l.$save(),
          g.showSnakebar(s("common.saveSuccess"), { color: "success" }),
          await c.value?.afterSave?.());
      }
      return (n, t) => {
        const D = Ne("router-view");
        return (
          h(),
          P(H, null, {
            default: f(() => [
              o(
                qe,
                {
                  modelValue: u.value,
                  "onUpdate:modelValue": t[0] || (t[0] = (i) => (u.value = i)),
                  "align-tabs": "center",
                  "bg-color": "primary",
                  "show-arrows": "",
                  stacked: "",
                },
                {
                  default: f(() => [
                    (h(!0),
                    ze(
                      X,
                      null,
                      Ue(
                        N(r),
                        (i) => (
                          h(),
                          P(
                            Z,
                            { key: i.key, value: i.route },
                            {
                              default: f(() => [
                                o(xe, { icon: i.icon }, null, 8, ["icon"]),
                                F(" " + p(N(s)(`SetBase.tab.${i.key}`)), 1),
                              ]),
                              _: 2,
                            },
                            1032,
                            ["value"],
                          )
                        ),
                      ),
                      128,
                    )),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue"],
              ),
              o(
                M,
                { modelValue: u.value, "onUpdate:modelValue": t[1] || (t[1] = (i) => (u.value = i)) },
                {
                  default: f(() => [
                    o(H, null, {
                      default: f(() => [
                        o(_e, null, {
                          default: f(() => [
                            o(D, null, {
                              default: f(({ Component: i }) => [
                                (h(), P(Me(i), { ref_key: "setTabRef", ref: c }, null, 512)),
                              ]),
                              _: 1,
                            }),
                          ]),
                          _: 1,
                        }),
                        V.value ? (h(), P(Be, { key: 0 })) : q("", !0),
                        V.value
                          ? (h(),
                            P(
                              Pe,
                              { key: 1 },
                              {
                                default: f(() => [
                                  o(
                                    Ie,
                                    { class: "ml-2 my-1" },
                                    {
                                      default: f(() => [
                                        o(
                                          z,
                                          {
                                            color: "green",
                                            "prepend-icon": "mdi-check-circle-outline",
                                            variant: "elevated",
                                            onClick: b,
                                          },
                                          { default: f(() => [F(p(N(s)("common.save")), 1)]), _: 1 },
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                ]),
                                _: 1,
                              },
                            ))
                          : q("", !0),
                      ]),
                      _: 1,
                    }),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue"],
              ),
            ]),
            _: 1,
          })
        );
      };
    },
  });
export { Ze as default };
