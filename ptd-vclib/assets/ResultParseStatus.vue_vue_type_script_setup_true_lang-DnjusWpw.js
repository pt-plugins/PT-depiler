import { bN as o } from "./src/entries/options/index-DmNe5UVo.js";
import { X as c, c4 as s, bj as e, L as a, bS as n } from "../vendor/packages/site/index-COeZNva1.js";
import { E as u } from "../vendor/packages/site/types/base-Dy_28wGT.js";
const l = { key: 0, class: "text-red" },
  i = { key: 1, class: "text-indigo" },
  d = { key: 2, class: "text-indigo" },
  k = { key: 3, class: "text-green" },
  P = { key: 4, class: "text-red" },
  S = { key: 5, class: "text-yellow-darken-2" },
  y = ["title"],
  g = { key: 7, class: "text-red" },
  h = { key: 8, class: "text-red" },
  x = { key: 9, class: "text-blue-grey" },
  f = c({
    __name: "ResultParseStatus",
    props: { status: {} },
    setup(r) {
      const { t } = o();
      return (_, m) =>
        r.status === s(u).unknownError
          ? (e(), a("span", l, n(s(t)("resultParseStatus.unknownError")), 1))
          : r.status === s(u).waiting
            ? (e(), a("span", i, n(s(t)("resultParseStatus.waiting")), 1))
            : r.status === s(u).working
              ? (e(), a("span", d, n(s(t)("resultParseStatus.working")), 1))
              : r.status === s(u).success
                ? (e(), a("span", k, n(s(t)("resultParseStatus.success")), 1))
                : r.status === s(u).parseError
                  ? (e(), a("span", P, n(s(t)("resultParseStatus.parseError")), 1))
                  : r.status === s(u).passParse
                    ? (e(), a("span", S, n(s(t)("resultParseStatus.passParse")), 1))
                    : r.status === s(u).CFBlocked
                      ? (e(),
                        a(
                          "span",
                          { key: 6, title: s(t)("resultParseStatus.CFBlockedNotes") },
                          n(s(t)("resultParseStatus.CFBlocked")),
                          9,
                          y,
                        ))
                      : r.status === s(u).needLogin
                        ? (e(), a("span", g, n(s(t)("resultParseStatus.needLogin")), 1))
                        : r.status === s(u).noResults
                          ? (e(), a("span", h, n(s(t)("resultParseStatus.noResults")), 1))
                          : (e(), a("span", x, n(s(t)("resultParseStatus.unknown")), 1));
    },
  });
export { f as _ };
