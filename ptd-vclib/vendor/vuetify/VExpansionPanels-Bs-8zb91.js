import {
  ax as b,
  bQ as $,
  bY as m,
  u as j,
  bp as P,
  aZ as F,
  aO as E,
  cd as N,
  R as S,
  by as h,
  r as w,
  bD as O,
  a as k,
  aR as q,
  x as H,
  bM as M,
  b_ as Q,
  b6 as B,
  b1 as U,
  aX as X,
  aT as Z,
  bF as J,
  bL as K,
  br as W,
  bq as ee,
  b7 as ae,
  bn as ne,
  aY as le,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import {
  as as _,
  U as i,
  cl as A,
  H as u,
  b5 as y,
  b3 as v,
  D as f,
  bY as l,
  bo as te,
} from "../packages/site/index-COeZNva1.js";
const x = Symbol.for("vuetify:v-expansion-panel"),
  D = P({ ...E(), ...F() }, "VExpansionPanelText"),
  C = b()({
    name: "VExpansionPanelText",
    props: D(),
    setup(e, c) {
      let { slots: n } = c;
      const a = _(x);
      if (!a) throw new Error("[Vuetify] v-expansion-panel-text needs to be placed inside v-expansion-panel");
      const { hasContent: s, onAfterLeave: d } = $(e, a.isSelected);
      return (
        m(() =>
          i(
            j,
            { onAfterLeave: d },
            {
              default: () => [
                A(
                  u("div", { class: v(["v-expansion-panel-text", e.class]), style: y(e.style) }, [
                    n.default && s.value && u("div", { class: "v-expansion-panel-text__wrapper" }, [n.default?.()]),
                  ]),
                  [[N, a.isSelected.value]],
                ),
              ],
            },
          ),
        ),
        {}
      );
    },
  }),
  R = P(
    {
      color: String,
      expandIcon: { type: k, default: "$expand" },
      collapseIcon: { type: k, default: "$collapse" },
      hideActions: Boolean,
      focusable: Boolean,
      static: Boolean,
      ripple: { type: [Boolean, Object], default: !1 },
      readonly: Boolean,
      ...E(),
      ...q(),
    },
    "VExpansionPanelTitle",
  ),
  T = b()({
    name: "VExpansionPanelTitle",
    directives: { vRipple: S },
    props: R(),
    setup(e, c) {
      let { slots: n } = c;
      const a = _(x);
      if (!a) throw new Error("[Vuetify] v-expansion-panel-title needs to be placed inside v-expansion-panel");
      const { backgroundColorClasses: s, backgroundColorStyles: d } = h(() => e.color),
        { dimensionStyles: r } = O(e),
        p = f(() => ({
          collapseIcon: e.collapseIcon,
          disabled: a.disabled.value,
          expanded: a.isSelected.value,
          expandIcon: e.expandIcon,
          readonly: e.readonly,
        })),
        V = l(() => (a.isSelected.value ? e.collapseIcon : e.expandIcon));
      return (
        m(() =>
          A(
            u(
              "button",
              {
                class: v([
                  "v-expansion-panel-title",
                  {
                    "v-expansion-panel-title--active": a.isSelected.value,
                    "v-expansion-panel-title--focusable": e.focusable,
                    "v-expansion-panel-title--static": e.static,
                  },
                  s.value,
                  e.class,
                ]),
                style: y([d.value, r.value, e.style]),
                type: "button",
                tabindex: a.disabled.value ? -1 : void 0,
                disabled: a.disabled.value,
                "aria-expanded": a.isSelected.value,
                onClick: e.readonly ? void 0 : a.toggle,
              },
              [
                u("span", { class: "v-expansion-panel-title__overlay" }, null),
                n.default?.(p.value),
                !e.hideActions &&
                  i(
                    w,
                    { defaults: { VIcon: { icon: V.value } } },
                    {
                      default: () => [
                        u("span", { class: "v-expansion-panel-title__icon" }, [
                          n.actions?.(p.value) ?? i(H, null, null),
                        ]),
                      ],
                    },
                  ),
              ],
            ),
            [[S, e.ripple]],
          ),
        ),
        {}
      );
    },
  }),
  L = P(
    { title: String, text: String, bgColor: String, ...Z(), ...X(), ...U(), ...B(), ...R(), ...D() },
    "VExpansionPanel",
  ),
  de = b()({
    name: "VExpansionPanel",
    props: L(),
    emits: { "group:selected": (e) => !0 },
    setup(e, c) {
      let { slots: n } = c;
      const a = M(e, x),
        { backgroundColorClasses: s, backgroundColorStyles: d } = h(() => e.bgColor),
        { elevationClasses: r } = J(e),
        { roundedClasses: p } = Q(e),
        V = l(() => a?.disabled.value || e.disabled),
        I = f(() =>
          a.group.items.value.reduce((o, t, g) => (a.group.selected.value.includes(t.id) && o.push(g), o), []),
        ),
        z = f(() => {
          const o = a.group.items.value.findIndex((t) => t.id === a.id);
          return !a.isSelected.value && I.value.some((t) => t - o === 1);
        }),
        G = f(() => {
          const o = a.group.items.value.findIndex((t) => t.id === a.id);
          return !a.isSelected.value && I.value.some((t) => t - o === -1);
        });
      return (
        te(x, a),
        m(() => {
          const o = !!(n.text || e.text),
            t = !!(n.title || e.title),
            g = T.filterProps(e),
            Y = C.filterProps(e);
          return i(
            e.tag,
            {
              class: v([
                "v-expansion-panel",
                {
                  "v-expansion-panel--active": a.isSelected.value,
                  "v-expansion-panel--before-active": z.value,
                  "v-expansion-panel--after-active": G.value,
                  "v-expansion-panel--disabled": V.value,
                },
                p.value,
                s.value,
                e.class,
              ]),
              style: y([d.value, e.style]),
            },
            {
              default: () => [
                u("div", { class: v(["v-expansion-panel__shadow", ...r.value]) }, null),
                i(
                  w,
                  { defaults: { VExpansionPanelTitle: { ...g }, VExpansionPanelText: { ...Y } } },
                  {
                    default: () => [
                      t && i(T, { key: "title" }, { default: () => [n.title ? n.title() : e.title] }),
                      o && i(C, { key: "text" }, { default: () => [n.text ? n.text() : e.text] }),
                      n.default?.(),
                    ],
                  },
                ),
              ],
            },
          );
        }),
        { groupItem: a }
      );
    },
  }),
  se = ["default", "accordion", "inset", "popout"],
  oe = P(
    {
      flat: Boolean,
      ...le(),
      ...ne(L(), [
        "bgColor",
        "collapseIcon",
        "color",
        "eager",
        "elevation",
        "expandIcon",
        "focusable",
        "hideActions",
        "readonly",
        "ripple",
        "rounded",
        "tile",
        "static",
      ]),
      ...ae(),
      ...E(),
      ...B(),
      variant: { type: String, default: "default", validator: (e) => se.includes(e) },
    },
    "VExpansionPanels",
  ),
  ue = b()({
    name: "VExpansionPanels",
    props: oe(),
    emits: { "update:modelValue": (e) => !0 },
    setup(e, c) {
      let { slots: n } = c;
      const { next: a, prev: s } = K(e, x),
        { themeClasses: d } = W(e),
        r = l(() => e.variant && `v-expansion-panels--variant-${e.variant}`);
      return (
        ee({
          VExpansionPanel: {
            bgColor: l(() => e.bgColor),
            collapseIcon: l(() => e.collapseIcon),
            color: l(() => e.color),
            eager: l(() => e.eager),
            elevation: l(() => e.elevation),
            expandIcon: l(() => e.expandIcon),
            focusable: l(() => e.focusable),
            hideActions: l(() => e.hideActions),
            readonly: l(() => e.readonly),
            ripple: l(() => e.ripple),
            rounded: l(() => e.rounded),
            static: l(() => e.static),
          },
        }),
        m(() =>
          i(
            e.tag,
            {
              class: v([
                "v-expansion-panels",
                { "v-expansion-panels--flat": e.flat, "v-expansion-panels--tile": e.tile },
                d.value,
                r.value,
                e.class,
              ]),
              style: y(e.style),
            },
            { default: () => [n.default?.({ prev: s, next: a })] },
          ),
        ),
        { next: a, prev: s }
      );
    },
  });
export { de as V, C as a, T as b, ue as c };
