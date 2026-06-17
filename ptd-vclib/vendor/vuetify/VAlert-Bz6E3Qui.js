import {
  ak as L,
  bp as f,
  ax as w,
  bX as F,
  br as R,
  cb as M,
  bC as N,
  bT as O,
  bW as E,
  b_ as j,
  c9 as p,
  bS as H,
  bD as Q,
  bF as U,
  a as W,
  bi as X,
  b7 as Y,
  b6 as q,
  b1 as G,
  b0 as J,
  a$ as K,
  aT as Z,
  aR as ee,
  aQ as ae,
  aO as te,
  aw as le,
  x as se,
  r as d,
  c as ne,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import { D as oe, U as l, b5 as v, b3 as m, bY as b, H as s, b0 as y } from "../packages/site/index-COeZNva1.js";
const ie = L("v-alert-title"),
  re = f(
    {
      iconSize: [Number, String],
      iconSizes: {
        type: Array,
        default: () => [
          ["x-small", 10],
          ["small", 16],
          ["default", 24],
          ["large", 28],
          ["x-large", 32],
        ],
      },
    },
    "iconSize",
  );
function ce(e, n) {
  return {
    iconSize: oe(() => {
      const a = new Map(e.iconSizes),
        t = e.iconSize ?? n() ?? "default";
      return a.has(t) ? a.get(t) : t;
    }),
  };
}
const ue = ["success", "info", "warning", "error"],
  de = f(
    {
      border: {
        type: [Boolean, String],
        validator: (e) => typeof e == "boolean" || ["top", "end", "bottom", "start"].includes(e),
      },
      borderColor: String,
      closable: Boolean,
      closeIcon: { type: W, default: "$close" },
      closeLabel: { type: String, default: "$vuetify.close" },
      icon: { type: [Boolean, String, Function, Object], default: null },
      modelValue: { type: Boolean, default: !0 },
      prominent: Boolean,
      title: String,
      text: String,
      type: { type: String, validator: (e) => ue.includes(e) },
      ...te(),
      ...ae(),
      ...ee(),
      ...Z(),
      ...re(),
      ...K(),
      ...J(),
      ...G(),
      ...q(),
      ...Y(),
      ...X({ variant: "flat" }),
    },
    "VAlert",
  ),
  be = w()({
    name: "VAlert",
    props: de(),
    emits: { "click:close": (e) => !0, "update:modelValue": (e) => !0 },
    setup(e, n) {
      let { emit: r, slots: a } = n;
      const t = F(e, "modelValue"),
        o = b(() => {
          if (e.icon !== !1) return e.type ? (e.icon ?? `$${e.type}`) : e.icon;
        }),
        { iconSize: S } = ce(e, () => (e.prominent ? 44 : void 0)),
        { themeClasses: k } = R(e),
        {
          colorClasses: P,
          colorStyles: C,
          variantClasses: V,
        } = M(() => ({ color: e.color ?? e.type, variant: e.variant })),
        { densityClasses: z } = N(e),
        { dimensionStyles: g } = Q(e),
        { elevationClasses: x } = U(e),
        { locationStyles: _ } = O(e),
        { positionClasses: T } = E(e),
        { roundedClasses: B } = j(e),
        { textColorClasses: I, textColorStyles: h } = p(() => e.borderColor),
        { t: A } = H(),
        c = b(() => ({
          "aria-label": A(e.closeLabel),
          onClick(i) {
            ((t.value = !1), r("click:close", i));
          },
        }));
      return () => {
        const i = !!(a.prepend || o.value),
          D = !!(a.title || e.title),
          $ = !!(a.close || e.closable),
          u = { density: e.density, icon: o.value, size: e.iconSize || e.prominent ? S.value : void 0 };
        return (
          t.value &&
          l(
            e.tag,
            {
              class: m([
                "v-alert",
                e.border && {
                  "v-alert--border": !!e.border,
                  [`v-alert--border-${e.border === !0 ? "start" : e.border}`]: !0,
                },
                { "v-alert--prominent": e.prominent },
                k.value,
                P.value,
                z.value,
                x.value,
                T.value,
                B.value,
                V.value,
                e.class,
              ]),
              style: v([C.value, g.value, _.value, e.style]),
              role: "alert",
            },
            {
              default: () => [
                le(!1, "v-alert"),
                e.border &&
                  s("div", { key: "border", class: m(["v-alert__border", I.value]), style: v(h.value) }, null),
                i &&
                  s("div", { key: "prepend", class: "v-alert__prepend" }, [
                    a.prepend
                      ? l(d, { key: "prepend-defaults", disabled: !o.value, defaults: { VIcon: { ...u } } }, a.prepend)
                      : l(se, y({ key: "prepend-icon" }, u), null),
                  ]),
                s("div", { class: "v-alert__content" }, [
                  D && l(ie, { key: "title" }, { default: () => [a.title?.() ?? e.title] }),
                  a.text?.() ?? e.text,
                  a.default?.(),
                ]),
                a.append && s("div", { key: "append", class: "v-alert__append" }, [a.append()]),
                $ &&
                  s("div", { key: "close", class: "v-alert__close" }, [
                    a.close
                      ? l(
                          d,
                          {
                            key: "close-defaults",
                            defaults: { VBtn: { icon: e.closeIcon, size: "x-small", variant: "text" } },
                          },
                          { default: () => [a.close?.({ props: c.value })] },
                        )
                      : l(
                          ne,
                          y({ key: "close-btn", icon: e.closeIcon, size: "x-small", variant: "text" }, c.value),
                          null,
                        ),
                  ]),
              ],
            },
          )
        );
      };
    },
  });
export { be as V, ie as a };
