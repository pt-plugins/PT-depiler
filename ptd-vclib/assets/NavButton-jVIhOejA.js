import { bE as d, c, x as i, a7 as r } from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as u,
  M as p,
  I as o,
  b0 as m,
  c4 as a,
  ck as v,
  L as f,
  bS as b,
  bj as s,
} from "../vendor/packages/site/index-COeZNva1.js";
const _ = { key: 1 },
  x = u({
    __name: "NavButton",
    props: { icon: {}, text: {}, disabled: { type: Boolean, default: !1 } },
    setup(t) {
      const e = d(),
        n = p(t, ["disabled"]);
      return (l, D) => (
        s(),
        o(
          c,
          m(l.$attrs, {
            class: { "nav-button-full": !a(e).smAndDown.value },
            icon: a(e).smAndDown.value,
            "prepend-icon": a(e).smAndDown.value ? void 0 : n.icon,
            rounded: a(e).smAndDown.value ? 0 : 4,
            size: a(e).smAndDown.value ? "small" : "default",
            disabled: t.disabled,
            title: n.text,
            variant: a(e).smAndDown.value ? "text" : "elevated",
          }),
          {
            default: v(() => [
              a(e).smAndDown.value
                ? (s(), o(i, { key: 0, icon: n.icon }, null, 8, ["icon"]))
                : (s(), f("span", _, b(n.text), 1)),
            ]),
            _: 1,
          },
          16,
          ["class", "icon", "prepend-icon", "rounded", "size", "disabled", "title", "variant"],
        )
      );
    },
  }),
  A = r(x, [["__scopeId", "data-v-48484870"]]);
export { A as N };
