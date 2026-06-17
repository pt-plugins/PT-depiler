import {
  ax as h,
  by as f,
  br as k,
  bS as x,
  bY as y,
  bD as S,
  bF as C,
  bp as L,
  b7 as w,
  aT as B,
  aR as P,
  cg as T,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import { H as i, b0 as V, F as A, D, b3 as F } from "../packages/site/index-COeZNva1.js";
const _ = {
  actions: "button@2",
  article: "heading, paragraph",
  avatar: "avatar",
  button: "button",
  card: "image, heading",
  "card-avatar": "image, list-item-avatar",
  chip: "chip",
  "date-picker": "list-item, heading, divider, date-picker-options, date-picker-days, actions",
  "date-picker-options": "text, avatar@2",
  "date-picker-days": "avatar@28",
  divider: "divider",
  heading: "heading",
  image: "image",
  "list-item": "text",
  "list-item-avatar": "avatar, text",
  "list-item-two-line": "sentences",
  "list-item-avatar-two-line": "avatar, sentences",
  "list-item-three-line": "paragraph",
  "list-item-avatar-three-line": "avatar, paragraph",
  ossein: "ossein",
  paragraph: "text@3",
  sentences: "text@2",
  subtitle: "text",
  table: "table-heading, table-thead, table-tbody, table-tfoot",
  "table-heading": "chip, text",
  "table-thead": "heading@6",
  "table-tbody": "table-row-divider@6",
  "table-row-divider": "table-row, divider",
  "table-row": "text@6",
  "table-tfoot": "text@2, avatar@2",
  text: "text",
};
function E(e) {
  let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  return i("div", { class: F(["v-skeleton-loader__bone", `v-skeleton-loader__${e}`]) }, [a]);
}
function s(e) {
  const [a, t] = e.split("@");
  return Array.from({ length: t }).map(() => n(a));
}
function n(e) {
  let a = [];
  if (!e) return a;
  const t = _[e];
  if (e !== t) {
    if (e.includes(",")) return l(e);
    if (e.includes("@")) return s(e);
    t.includes(",") ? (a = l(t)) : t.includes("@") ? (a = s(t)) : t && a.push(n(t));
  }
  return [E(e, a)];
}
function l(e) {
  return e.replace(/\s/g, "").split(",").map(n);
}
const R = L(
    {
      boilerplate: Boolean,
      color: String,
      loading: Boolean,
      loadingText: { type: String, default: "$vuetify.loading" },
      type: { type: [String, Array], default: "ossein" },
      ...P(),
      ...B(),
      ...w(),
    },
    "VSkeletonLoader",
  ),
  z = h()({
    name: "VSkeletonLoader",
    inheritAttrs: !1,
    props: R(),
    setup(e, a) {
      let { attrs: t, slots: r } = a;
      const { backgroundColorClasses: d, backgroundColorStyles: c } = f(() => e.color),
        { dimensionStyles: u } = S(e),
        { elevationClasses: g } = C(e),
        { themeClasses: m } = k(e),
        { t: b } = x(),
        v = D(() => n(T(e.type).join(",")));
      return (
        y(() => {
          const o = !r.default || e.loading,
            p = e.boilerplate || !o ? {} : { ariaLive: "polite", ariaLabel: b(e.loadingText), role: "alert" };
          return o
            ? i(
                "div",
                V(
                  {
                    class: [
                      "v-skeleton-loader",
                      { "v-skeleton-loader--boilerplate": e.boilerplate },
                      m.value,
                      d.value,
                      g.value,
                    ],
                    style: [c.value, u.value],
                  },
                  p,
                  t,
                ),
                [v.value],
              )
            : i(A, null, [r.default?.()]);
        }),
        {}
      );
    },
  });
export { z as V };
