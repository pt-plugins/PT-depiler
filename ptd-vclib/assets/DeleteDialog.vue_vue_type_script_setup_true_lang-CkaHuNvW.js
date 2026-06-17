import {
  bN as x,
  s as b,
  j as C,
  i as k,
  t as _,
  g as y,
  a2 as h,
  c as m,
  f as B,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as I,
  cb as S,
  I as w,
  ck as a,
  a$ as u,
  br as N,
  U as e,
  Q as f,
  bS as i,
  c4 as d,
  bv as T,
  H as p,
  bj as A,
} from "../vendor/packages/site/index-COeZNva1.js";
const M = { class: "ml-1" },
  $ = { class: "ml-1" },
  U = I({
    __name: "DeleteDialog",
    props: u(
      { toDeleteIds: {}, confirmDelete: { type: Function } },
      { modelValue: { type: Boolean }, modelModifiers: {} },
    ),
    emits: u(["allDelete"], ["update:modelValue"]),
    setup(l, { emit: g }) {
      const o = S(l, "modelValue"),
        V = g,
        { t: s } = x(),
        t = N(!1);
      async function D() {
        ((t.value = !0),
          await Promise.allSettled(l.toDeleteIds.map((r) => l.confirmDelete(r))),
          (t.value = !1),
          (o.value = !1),
          V("allDelete"));
      }
      async function v() {
        t.value = !1;
      }
      return (r, n) => (
        A(),
        w(
          b,
          {
            modelValue: o.value,
            "onUpdate:modelValue": n[1] || (n[1] = (c) => (o.value = c)),
            persistent: t.value,
            width: "300",
            onAfterEnter: v,
          },
          {
            default: a(() => [
              e(B, null, {
                default: a(() => [
                  e(
                    C,
                    { class: "bg-red-lighten-2" },
                    { default: a(() => [f(i(d(s)("common.dialog.title.confirmAction")), 1)]), _: 1 },
                  ),
                  e(
                    k,
                    { class: "text-body-1" },
                    {
                      default: a(() => [
                        f(i(d(s)("common.dialog.deleteText", [l.toDeleteIds.length])) + " ", 1),
                        T(r.$slots, "append-text"),
                      ]),
                      _: 3,
                    },
                  ),
                  e(_),
                  e(y, null, {
                    default: a(() => [
                      e(h),
                      e(
                        m,
                        {
                          color: "info",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: n[0] || (n[0] = (c) => (o.value = !1)),
                        },
                        { default: a(() => [p("span", M, i(d(s)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      e(
                        m,
                        {
                          loading: t.value,
                          color: "error",
                          "prepend-icon": "mdi-check-circle-outline",
                          variant: "text",
                          onClick: D,
                        },
                        { default: a(() => [p("span", $, i(d(s)("common.dialog.ok")), 1)]), _: 1 },
                        8,
                        ["loading"],
                      ),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 3,
              }),
            ]),
            _: 3,
          },
          8,
          ["modelValue", "persistent"],
        )
      );
    },
  });
export { U as _ };
