import { bV as w, bN as E } from "./src/entries/options/index-DmNe5UVo.js";
import {
  b1 as D,
  w as N,
  bD as u,
  aE as h,
  X as j,
  bf as q,
  bj as l,
  L as f,
  F as g,
  Q as y,
  bS as p,
  c4 as d,
  bu as x,
  H as A,
  bJ as v,
} from "../vendor/packages/site/index-COeZNva1.js";
import { t as B } from "../vendor/es-toolkit/toMerged-Be-qf92q.js";
const R = w(),
  V = Symbol("default");
async function S(e) {
  return await R.getSiteMergedMetadata(e, "category", []);
}
function F(e) {
  return Array.isArray(e) ? e.length === 0 : e === V;
}
async function I(e, n) {
  let t = D();
  const i = { id: t, siteId: e, selectedCategories: {}, searchEntries: {} },
    r = await S(e);
  let a = {};
  for (const o of r) {
    const s = N(n[o.key]);
    if (!F(s))
      if (((i.selectedCategories[o.key] = s), o.generateRequestConfig)) a = B(a, o.generateRequestConfig(s));
      else {
        let c = o.key;
        if (c === "#url") u(a, "requestConfig.url", s);
        else {
          const m = `requestConfig.${o.keyPath ?? "params"}`;
          if (o.cross)
            if ((typeof o.cross.key < "u" && (c = o.cross.key), o.cross.mode === "append"))
              for (const C of s) u(a, `${m}.${c}${C}`, 1);
            else if (o.cross.mode === "appendQuote") {
              const C = Object.fromEntries(s.map((M) => [M, 1]));
              u(a, `${m}.${c}`, C);
            } else o.cross.mode === "comma" ? u(a, `${m}.${c}`, s.join(",")) : u(a, `${m}.${c}`, s);
          else u(a, `${m}.${c}`, s);
        }
      }
  }
  return (h(a) ? ((i.id = "default"), (i.searchEntries = {})) : (i.searchEntries[t] = a), i);
}
function $(e, n) {
  return e.find((t) => t.key === n) ?? { key: n, name: n, options: [] };
}
function b(e, n) {
  return $(e, n)?.name ?? n;
}
function k(e, n, t) {
  const i = $(e, n)?.options ?? [];
  return Array.isArray(t)
    ? t.map((r) => i.find((a) => a.value === r)?.name ?? r).join(", ")
    : (i.find((r) => r.value === t)?.name ?? t);
}
const L = { key: 0, class: "text-wrap" },
  O = ["title"],
  J = j({
    __name: "SolutionDetail",
    props: { solution: {} },
    setup(e) {
      const n = e,
        t = v([]),
        { t: i } = E();
      return (
        q(async () => {
          t.value = await S(n.solution.siteId);
        }),
        (r, a) =>
          e.solution
            ? (l(),
              f("div", L, [
                e.solution.name
                  ? (l(), f(g, { key: 0 }, [y(p(e.solution.name), 1)], 64))
                  : d(h)(e.solution.selectedCategories)
                    ? (l(), f(g, { key: 1 }, [y(p(d(i)("common.default")), 1)], 64))
                    : (l(!0),
                      f(
                        g,
                        { key: 2 },
                        x(
                          e.solution.selectedCategories,
                          (o, s) => (
                            l(),
                            f(
                              "span",
                              { key: s, title: d(b)(t.value, s) + ": " + d(k)(t.value, s, o) },
                              [A("b", null, p(d(b)(t.value, s)), 1), y(" : " + p(d(k)(t.value, s, o)) + ";  ", 1)],
                              8,
                              O,
                            )
                          ),
                        ),
                        128,
                      )),
              ]))
            : (l(), f(g, { key: 1 }, [y("Unknown")], 64))
      );
    },
  });
export { J as _, b as a, k as b, S as c, I as g, F as i, V as r };
