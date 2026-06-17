import {
  ax as y,
  by as S,
  b_ as k,
  bS as N,
  c9 as B,
  ca as V,
  bT as x,
  bY as P,
  bo as h,
  bp as T,
  a as R,
  aR as _,
  b8 as D,
  b7 as w,
  b6 as L,
  b1 as Y,
  a$ as $,
  aO as A,
  M as I,
  cd as M,
  x as X,
  bD as F,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import { U as o, b0 as s, H as l, cl as H } from "../packages/site/index-COeZNva1.js";
const O = T(
    {
      bordered: Boolean,
      color: String,
      content: [Number, String],
      dot: Boolean,
      floating: Boolean,
      icon: R,
      inline: Boolean,
      label: { type: String, default: "$vuetify.badge" },
      max: [Number, String],
      modelValue: { type: Boolean, default: !0 },
      offsetX: [Number, String],
      offsetY: [Number, String],
      textColor: String,
      ...A(),
      ...$({ location: "top end" }),
      ...Y(),
      ...L(),
      ...w(),
      ...D({ transition: "scale-rotate-transition" }),
      ..._(),
    },
    "VBadge",
  ),
  j = y()({
    name: "VBadge",
    inheritAttrs: !1,
    props: O(),
    setup(e, t) {
      const { backgroundColorClasses: i, backgroundColorStyles: r } = S(() => e.color),
        { roundedClasses: d } = k(e),
        { t: u } = N(),
        { textColorClasses: c, textColorStyles: b } = B(() => e.textColor),
        { themeClasses: m } = V(),
        { locationStyles: g } = x(
          e,
          !0,
          (a) =>
            (e.floating ? (e.dot ? 2 : 4) : e.dot ? 8 : 12) +
            (["top", "bottom"].includes(a)
              ? Number(e.offsetY ?? 0)
              : ["left", "right"].includes(a)
                ? Number(e.offsetX ?? 0)
                : 0),
        ),
        { dimensionStyles: f } = F(e);
      return (
        P(() => {
          const a = Number(e.content),
            n = !e.max || isNaN(a) ? e.content : a <= Number(e.max) ? a : `${e.max}+`,
            [v, C] = h(t.attrs, ["aria-atomic", "aria-label", "aria-live", "role", "title"]);
          return o(
            e.tag,
            s(
              {
                class: [
                  "v-badge",
                  {
                    "v-badge--bordered": e.bordered,
                    "v-badge--dot": e.dot,
                    "v-badge--floating": e.floating,
                    "v-badge--inline": e.inline,
                  },
                  e.class,
                ],
              },
              C,
              { style: e.style },
            ),
            {
              default: () => [
                l("div", { class: "v-badge__wrapper" }, [
                  t.slots.default?.(),
                  o(
                    I,
                    { transition: e.transition },
                    {
                      default: () => [
                        H(
                          l(
                            "span",
                            s(
                              {
                                class: ["v-badge__badge", m.value, i.value, d.value, c.value],
                                style: [r.value, b.value, f.value, e.inline ? {} : g.value],
                                "aria-atomic": "true",
                                "aria-label": u(e.label, a),
                                "aria-live": "polite",
                                role: "status",
                              },
                              v,
                            ),
                            [
                              e.dot
                                ? void 0
                                : t.slots.badge
                                  ? t.slots.badge?.()
                                  : e.icon
                                    ? o(X, { icon: e.icon }, null)
                                    : n,
                            ],
                          ),
                          [[M, e.modelValue]],
                        ),
                      ],
                    },
                  ),
                ]),
              ],
            },
          );
        }),
        {}
      );
    },
  });
export { j as V };
