import { ax as a, bY as o, bp as n, b6 as i, aO as m } from "../../assets/src/entries/options/index-DmNe5UVo.js";
import { U as r, b5 as l, b3 as c } from "../packages/site/index-COeZNva1.js";
const p = n({ start: Boolean, end: Boolean, ...m(), ...i() }, "VListItemAction"),
  d = a()({
    name: "VListItemAction",
    props: p(),
    setup(t, e) {
      let { slots: s } = e;
      return (
        o(() =>
          r(
            t.tag,
            {
              class: c([
                "v-list-item-action",
                { "v-list-item-action--start": t.start, "v-list-item-action--end": t.end },
                t.class,
              ]),
              style: l(t.style),
            },
            s,
          ),
        ),
        {}
      );
    },
  });
export { d as V };
