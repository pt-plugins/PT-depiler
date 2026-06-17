import { bN as u, c as f, x as m } from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as d,
  I as k,
  ck as v,
  U as h,
  Q as p,
  bS as C,
  c4 as b,
  br as n,
  bj as x,
} from "../vendor/packages/site/index-COeZNva1.js";
const g = d({
  __name: "ConnectCheckButton",
  props: { checkFn: { type: Function }, resetTimeout: {} },
  emits: ["after:checkConnect"],
  setup(t, { emit: a }) {
    const s = a,
      { t: r } = u(),
      o = {
        default: { icon: "mdi-access-point", color: "info" },
        success: { icon: "mdi-access-point-check", color: "success" },
        error: { icon: "mdi-access-point-remove", color: "error" },
      },
      c = n(!1),
      e = n("default");
    async function i() {
      c.value = !0;
      try {
        e.value = (await t.checkFn()) ? "success" : "error";
      } catch {
        ((e.value = "error"), t.resetTimeout && setTimeout(() => (e.value = "default"), t.resetTimeout));
      } finally {
        ((c.value = !1), s("after:checkConnect"));
      }
    }
    return (l, T) => (
      x(),
      k(
        f,
        { color: o[e.value].color, disabled: c.value, loading: c.value, block: "", variant: "text", onClick: i },
        {
          default: v(() => [
            h(m, { icon: o[e.value].icon }, null, 8, ["icon"]),
            p(" " + C(b(r)("connectCheck." + e.value)), 1),
          ]),
          _: 1,
        },
        8,
        ["color", "disabled", "loading"],
      )
    );
  },
});
export { g as _ };
