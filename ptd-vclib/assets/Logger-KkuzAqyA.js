import { bN as b, s as v, d as h, c as _, f as V, i as w } from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as D,
  bf as x,
  L,
  U as t,
  c4 as i,
  ck as a,
  F as C,
  bJ as k,
  br as c,
  bC as y,
  bj as B,
  H as n,
  bS as r,
} from "../vendor/packages/site/index-COeZNva1.js";
import { b as H } from "./utils-DF6YUpNn.js";
import { V as I } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as M } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
const N = { class: "text-no-wrap" },
  T = { class: "text-no-wrap" },
  q = D({
    __name: "Logger",
    setup(A) {
      const { t: l } = b(),
        d = k([]),
        p = [
          { title: "ID", value: "id", width: 150 },
          { title: "Time", value: "time", width: 100 },
          { title: "Message", value: "msg" },
          { title: l("common.action"), value: "action", width: 150 },
        ],
        s = c(!1),
        m = c(null);
      function f(o) {
        ((m.value = o), (s.value = !0));
      }
      function g() {
        y("getLogger", void 0).then((o) => {
          d.value = o;
        });
      }
      return (
        x(() => {
          setInterval(() => g(), 1e3);
        }),
        (o, u) => (
          B(),
          L(
            C,
            null,
            [
              t(I, { title: i(l)("route.About.Logger"), type: "info" }, null, 8, ["title"]),
              t(
                M,
                {
                  headers: p,
                  items: d.value,
                  "sort-by": [{ key: "time", order: "desc" }],
                  class: "table-stripe table-header-no-wrap",
                  hover: "",
                  "must-sort": "",
                },
                {
                  "item.id": a(({ item: e }) => [n("code", N, r(e.id), 1)]),
                  "item.time": a(({ item: e }) => [n("span", T, r(i(H)(e.time)), 1)]),
                  "item.action": a(({ item: e }) => [
                    t(
                      h,
                      { class: "table-action", density: "compact", variant: "plain" },
                      {
                        default: a(() => [
                          t(
                            _,
                            {
                              title: i(l)("Logger.action.details"),
                              disabled: typeof e.data > "u",
                              color: "info",
                              size: "small",
                              icon: "mdi-archive-search",
                              onClick: (F) => f(e.data),
                            },
                            null,
                            8,
                            ["title", "disabled", "onClick"],
                          ),
                        ]),
                        _: 2,
                      },
                      1024,
                    ),
                  ]),
                  _: 1,
                },
                8,
                ["items"],
              ),
              t(
                v,
                {
                  modelValue: s.value,
                  "onUpdate:modelValue": u[0] || (u[0] = (e) => (s.value = e)),
                  "max-width": "800px",
                },
                {
                  default: a(() => [
                    t(V, null, {
                      default: a(() => [t(w, null, { default: a(() => [n("pre", null, r(m.value), 1)]), _: 1 })]),
                      _: 1,
                    }),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue"],
              ),
            ],
            64,
          )
        )
      );
    },
  });
export { q as default };
