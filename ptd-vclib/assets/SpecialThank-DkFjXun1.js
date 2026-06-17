import { bN as S, f as m, j as h, aq as g, V as y, x as C } from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as N,
  L as s,
  U as r,
  ck as a,
  F as c,
  bj as u,
  bu as b,
  c4 as e,
  Q as d,
  bS as l,
  H as t,
  e as p,
} from "../vendor/packages/site/index-COeZNva1.js";
import { V as x } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as k } from "../vendor/vuetify/VTable-7Q8JlSj6.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
const v = ["href"],
  A = ["href"],
  F = N({
    __name: "SpecialThank",
    setup(B) {
      const { rt: _, tm: V, t: o } = S(),
        T = [
          "Rhilip (R酱)",
          "ted423",
          "luckiestone",
          "sabersalv",
          "bimzcy (白鸽男孩)",
          "DXV5 (贝壳)",
          "An",
          "Abel袁",
          "Мало",
          "tongyifan (杯杯杯杯具)",
          "the chosen one (三哥)",
          "橙子",
          "frank777777777 (杀死那个异教徒)",
        ].sort();
      return (L, i) => (
        u(),
        s(
          c,
          null,
          [
            r(
              x,
              { border: "start", "border-color": "deep-purple-accent-4", class: "mb-2", elevation: "2" },
              {
                default: a(() => [
                  (u(!0),
                  s(
                    c,
                    null,
                    b(
                      e(V)("SpecialThank.thankNote"),
                      (n) => (
                        u(),
                        s(c, { key: n }, [d(l(e(_)(n)) + " ", 1), i[0] || (i[0] = t("br", null, null, -1))], 64)
                      ),
                    ),
                    128,
                  )),
                  d(" " + l(e(o)("SpecialThank.contributor")) + ": ", 1),
                  t(
                    "a",
                    { href: `${e(p)}/graphs/contributors`, rel: "noopener noreferrer nofollow", target: "_blank" },
                    l(e(p)) + "/graphs/contributors ",
                    9,
                    v,
                  ),
                  i[1] || (i[1] = t("br", null, null, -1)),
                  d(" " + l(e(o)("SpecialThank.issue")) + ": ", 1),
                  t(
                    "a",
                    { href: `${e(p)}/issues`, rel: "noopener noreferrer nofollow", target: "_blank" },
                    l(e(p)) + "/issues",
                    9,
                    A,
                  ),
                ]),
                _: 1,
              },
            ),
            r(
              m,
              { class: "mb-2" },
              {
                default: a(() => [
                  r(h, null, { default: a(() => [d(l(e(o)("SpecialThank.langContributor")), 1)]), _: 1 }),
                  r(k, null, {
                    default: a(() => [
                      t("thead", null, [
                        t("tr", null, [
                          i[2] || (i[2] = t("th", null, "Code", -1)),
                          t("th", null, l(e(o)("common.language")), 1),
                          t("th", null, l(e(o)("SpecialThank.contributor")), 1),
                        ]),
                      ]),
                      t("tbody", null, [
                        (u(!0),
                        s(
                          c,
                          null,
                          b(
                            e(g),
                            (n, f) => (
                              u(),
                              s("tr", { key: f }, [
                                t("td", null, l(n.value), 1),
                                t("td", null, l(n.title), 1),
                                t("td", null, l(n.authors.join(", ")), 1),
                              ])
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 1,
              },
            ),
            r(
              m,
              { class: "mb-2" },
              {
                default: a(() => [
                  r(h, null, {
                    default: a(() => [
                      d(
                        l(e(o)("SpecialThank.preWorkContributor")) + " (" + l(e(o)("SpecialThank.sortByName")) + ")",
                        1,
                      ),
                    ]),
                    _: 1,
                  }),
                  r(k, null, {
                    default: a(() => [
                      t("tbody", null, [
                        (u(!0),
                        s(
                          c,
                          null,
                          b(
                            e(T),
                            (n, f) => (
                              u(),
                              s("tr", { key: f }, [
                                t("td", null, [
                                  r(y, null, { default: a(() => [r(C, { icon: "mdi-account-circle" })]), _: 1 }),
                                  d(" " + l(n), 1),
                                ]),
                              ])
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 1,
              },
            ),
          ],
          64,
        )
      );
    },
  });
export { F as default };
