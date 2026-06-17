import {
  ax as r,
  br as d,
  bC as i,
  bY as n,
  bp as b,
  b7 as m,
  b6 as v,
  aQ as h,
  aO as f,
  ag as u,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import { U as c, b5 as g, b3 as x, H as t } from "../packages/site/index-COeZNva1.js";
const y = b(
    {
      fixedHeader: Boolean,
      fixedFooter: Boolean,
      height: [Number, String],
      hover: Boolean,
      striped: { type: String, default: null, validator: (e) => ["even", "odd"].includes(e) },
      ...f(),
      ...h(),
      ...v(),
      ...m(),
    },
    "VTable",
  ),
  C = r()({
    name: "VTable",
    props: y(),
    setup(e, s) {
      let { slots: a, emit: p } = s;
      const { themeClasses: o } = d(e),
        { densityClasses: l } = i(e);
      return (
        n(() =>
          c(
            e.tag,
            {
              class: x([
                "v-table",
                {
                  "v-table--fixed-height": !!e.height,
                  "v-table--fixed-header": e.fixedHeader,
                  "v-table--fixed-footer": e.fixedFooter,
                  "v-table--has-top": !!a.top,
                  "v-table--has-bottom": !!a.bottom,
                  "v-table--hover": e.hover,
                  "v-table--striped-even": e.striped === "even",
                  "v-table--striped-odd": e.striped === "odd",
                },
                o.value,
                l.value,
                e.class,
              ]),
              style: g(e.style),
            },
            {
              default: () => [
                a.top?.(),
                a.default
                  ? t("div", { class: "v-table__wrapper", style: { height: u(e.height) } }, [
                      t("table", null, [a.default()]),
                    ])
                  : a.wrapper?.(),
                a.bottom?.(),
              ],
            },
          ),
        ),
        {}
      );
    },
  });
export { C as V, y as m };
