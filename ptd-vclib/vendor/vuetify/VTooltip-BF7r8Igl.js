import {
  ax as S,
  bX as h,
  c3 as x,
  bY as O,
  J as c,
  av as F,
  bp as I,
  bm as T,
  bd as p,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import { c9 as R, U as k, b0 as u, D as i, bY as d, br as w } from "../packages/site/index-COeZNva1.js";
const A = I(
    {
      id: String,
      interactive: Boolean,
      text: String,
      ...T(
        p({
          closeOnBack: !1,
          location: "end",
          locationStrategy: "connected",
          eager: !0,
          minWidth: 0,
          offset: 10,
          openOnClick: !1,
          openOnHover: !0,
          origin: "auto",
          scrim: !1,
          scrollStrategy: "reposition",
          transition: null,
        }),
        ["absolute", "retainFocus", "captureFocus", "disableInitialFocus"],
      ),
    },
    "VTooltip",
  ),
  U = S()({
    name: "VTooltip",
    props: A(),
    emits: { "update:modelValue": (t) => !0 },
    setup(t, v) {
      let { slots: n } = v;
      const a = h(t, "modelValue"),
        { scopeId: m } = x(),
        g = R(),
        r = d(() => t.id || `v-tooltip-${g}`),
        l = w(),
        f = i(() => (t.location.split(" ").length > 1 ? t.location : t.location + " center")),
        b = i(() =>
          t.origin === "auto" ||
          t.origin === "overlap" ||
          t.origin.split(" ").length > 1 ||
          t.location.split(" ").length > 1
            ? t.origin
            : t.origin + " center",
        ),
        V = d(() => (t.transition != null ? t.transition : a.value ? "scale-transition" : "fade-transition")),
        P = i(() => u({ "aria-describedby": r.value }, t.activatorProps));
      return (
        O(() => {
          const y = c.filterProps(t);
          return k(
            c,
            u(
              {
                ref: l,
                class: ["v-tooltip", { "v-tooltip--interactive": t.interactive }, t.class],
                style: t.style,
                id: r.value,
              },
              y,
              {
                modelValue: a.value,
                "onUpdate:modelValue": (e) => (a.value = e),
                transition: V.value,
                absolute: !0,
                location: f.value,
                origin: b.value,
                role: "tooltip",
                activatorProps: P.value,
                _disableGlobalStack: !0,
              },
              m,
            ),
            {
              activator: n.activator,
              default: function () {
                for (var e = arguments.length, s = new Array(e), o = 0; o < e; o++) s[o] = arguments[o];
                return n.default?.(...s) ?? t.text;
              },
            },
          );
        }),
        F({}, l)
      );
    },
  });
export { U as V };
