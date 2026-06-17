import {
  m as Fe,
  l as Q,
  a9 as ie,
  x as je,
  bN as X,
  s as be,
  f as J,
  j as se,
  a4 as he,
  a5 as qe,
  c as I,
  i as te,
  a3 as j,
  g as ye,
  a2 as Z,
  T as P,
  n as $,
  p as de,
  a7 as ze,
  bV as ge,
  c2 as Ve,
  t as K,
  a8 as Re,
  bz as Je,
  d as ce,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  a7 as ke,
  aL as Le,
  aF as fe,
  aN as me,
  w as ue,
  x as Ge,
  aj as He,
  G as ee,
  g as We,
  n as Ke,
  bP as Qe,
  b7 as Xe,
  bU as Ze,
  X as H,
  L as E,
  U as e,
  b4 as Ye,
  an as et,
  ck as o,
  F as B,
  bu as L,
  bj as y,
  I as U,
  Q as M,
  J as le,
  cb as oe,
  bS as _,
  c4 as s,
  a$ as tt,
  br as x,
  b1 as G,
  bf as lt,
  H as A,
  bJ as Ce,
  bs as ot,
  D as we,
  b3 as at,
  aE as nt,
  ce as it,
} from "../vendor/packages/site/index-COeZNva1.js";
import { o as st } from "../vendor/es-toolkit/omit-BqXgNNTz.js";
import { F as ut } from "../vendor/file-saver/FileSaver.min-BKZqLcYj.js";
import { a as ae, b as rt } from "./utils-DF6YUpNn.js";
import { i as dt } from "../vendor/es-toolkit/isEqual-xRaZZh9v.js";
import { i as _e, a as ct } from "../vendor/es-toolkit/isJSON-CBK-U_yy.js";
import { h as ft } from "../vendor/es-toolkit/has-CpNzJTaW.js";
import {
  _ as mt,
  g as xe,
  c as De,
  a as pt,
  b as vt,
  i as St,
  r as pe,
} from "./SolutionDetail.vue_vue_type_script_setup_true_lang-PBS9W7DL.js";
import { V as Ie } from "../vendor/vuetify/VForm-CJoKT4R8.js";
import { V as bt } from "../vendor/vuetify/VTextarea-hZu3Ftop.js";
import { c as Ue, V as Me, b as Ne, a as $e } from "../vendor/vuetify/VExpansionPanels-Bs-8zb91.js";
import { V as ve } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import { a as ht, V as Se } from "../vendor/vuetify/VRadioGroup-jSvmgi9c.js";
import { V as Ae, a as Ee } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { _ as yt } from "./DeleteDialog.vue_vue_type_script_setup_true_lang-CkaHuNvW.js";
import { N as R } from "./NavButton-jVIhOejA.js";
import { V as gt } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import { V as W } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../vendor/es-toolkit/toMerged-Be-qf92q.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
function Vt(t) {
  return function (l) {
    return ke(l, t);
  };
}
function Pe(t, l, r) {
  return typeof r != "function"
    ? Pe(t, l, () => {})
    : ne(
        t,
        l,
        function n(a, i, d, m, S, p) {
          const b = r(a, i, d, m, S, p);
          return b !== void 0 ? !!b : ne(a, i, n, p);
        },
        new Map(),
      );
}
function ne(t, l, r, n) {
  if (l === t) return !0;
  switch (typeof l) {
    case "object":
      return kt(t, l, r, n);
    case "function":
      return Object.keys(l).length > 0 ? ne(t, { ...l }, r, n) : fe(t, l);
    default:
      return Le(t) ? (typeof l == "string" ? l === "" : !0) : fe(t, l);
  }
}
function kt(t, l, r, n) {
  if (l == null) return !0;
  if (Array.isArray(l)) return Te(t, l, r, n);
  if (l instanceof Map) return Ct(t, l, r, n);
  if (l instanceof Set) return wt(t, l, r, n);
  const a = Object.keys(l);
  if (t == null || me(t)) return a.length === 0;
  if (a.length === 0) return !0;
  if (n?.has(l)) return n.get(l) === t;
  n?.set(l, t);
  try {
    for (let i = 0; i < a.length; i++) {
      const d = a[i];
      if (
        (!me(t) && !(d in t)) ||
        (l[d] === void 0 && t[d] !== void 0) ||
        (l[d] === null && t[d] !== null) ||
        !r(t[d], l[d], d, t, l, n)
      )
        return !1;
    }
    return !0;
  } finally {
    n?.delete(l);
  }
}
function Ct(t, l, r, n) {
  if (l.size === 0) return !0;
  if (!(t instanceof Map)) return !1;
  for (const [a, i] of l.entries()) if (r(t.get(a), i, a, t, l, n) === !1) return !1;
  return !0;
}
function Te(t, l, r, n) {
  if (l.length === 0) return !0;
  if (!Array.isArray(t)) return !1;
  const a = new Set();
  for (let i = 0; i < l.length; i++) {
    const d = l[i];
    let m = !1;
    for (let S = 0; S < t.length; S++) {
      if (a.has(S)) continue;
      const p = t[S];
      let b = !1;
      if ((r(p, d, i, t, l, n) && (b = !0), b)) {
        (a.add(S), (m = !0));
        break;
      }
    }
    if (!m) return !1;
  }
  return !0;
}
function wt(t, l, r, n) {
  return l.size === 0 ? !0 : t instanceof Set ? Te([...t], [...l], r, n) : !1;
}
function Oe(t, l) {
  return Pe(t, l, () => {});
}
function _t(t) {
  return ((t = ue(t)), (l) => Oe(l, t));
}
function xt(t, l) {
  return Ge(t, (r, n, a, i) => {
    if (typeof t == "object") {
      if (He(t) === "[object Object]" && typeof t.constructor != "function") {
        const d = {};
        return (i.set(t, d), ee(d, t, a, i), d);
      }
      switch (Object.prototype.toString.call(t)) {
        case Xe:
        case Qe:
        case Ke: {
          const d = new t.constructor(t?.valueOf());
          return (ee(d, t), d);
        }
        case We: {
          const d = {};
          return (ee(d, t), (d.length = t.length), (d[Symbol.iterator] = t[Symbol.iterator]), d);
        }
        default:
          return;
      }
    }
  });
}
function Dt(t) {
  return xt(t);
}
function It(t, l) {
  switch (typeof t) {
    case "object":
      Object.is(t?.valueOf(), -0) && (t = "-0");
      break;
    case "number":
      t = Ze(t);
      break;
  }
  return (
    (l = Dt(l)),
    function (r) {
      const n = ke(r, t);
      return n === void 0 ? ft(r, t) : l === void 0 ? n === void 0 : Oe(n, l);
    }
  );
}
function Ut(t) {
  if (t == null) return _e;
  switch (typeof t) {
    case "function":
      return t;
    case "object":
      return Array.isArray(t) && t.length === 2 ? It(t[0], t[1]) : _t(t);
    case "string":
    case "symbol":
    case "number":
      return Vt(t);
  }
}
function Mt(t, l = _e, r = 0) {
  if (!t) return;
  r < 0 && (r = Math.max(t.length + r, 0));
  const n = Ut(l);
  if (!Array.isArray(t)) {
    const a = Object.keys(t);
    for (let i = r; i < a.length; i++) {
      const d = a[i],
        m = t[d];
      if (n(m, d, t)) return m;
    }
    return;
  }
  return t.slice(r).find(n);
}
const Nt = { class: "pt-1" },
  Be = H({
    __name: "SolutionLabel",
    props: { solutions: {}, closable: { type: Boolean, default: !0 }, groupProps: { default: () => ({}) } },
    emits: ["remove:solution"],
    setup(t, { emit: l }) {
      const r = l;
      function n(a) {
        r("remove:solution", a);
      }
      return (a, i) => (
        y(),
        E("div", Nt, [
          e(
            Fe,
            Ye(et(t.groupProps)),
            {
              default: o(() => [
                (y(!0),
                E(
                  B,
                  null,
                  L(
                    t.solutions,
                    (d) => (
                      y(),
                      U(
                        Q,
                        { key: d.id, class: "mb-1 mr-1 h-auto py-1", label: "", size: "small" },
                        {
                          prepend: o(() => [
                            t.closable
                              ? (y(),
                                U(je, { key: 0, class: "mr-1", icon: "$delete", onClick: () => n(d) }, null, 8, [
                                  "onClick",
                                ]))
                              : le("", !0),
                          ]),
                          default: o(() => [
                            e(ie, { class: "", "site-id": d.siteId, tag: "span" }, null, 8, ["site-id"]),
                            i[0] || (i[0] = M(" ->  ", -1)),
                            e(mt, { solution: d }, null, 8, ["solution"]),
                          ]),
                          _: 2,
                        },
                        1024,
                      )
                    ),
                  ),
                  128,
                )),
              ]),
              _: 1,
            },
            16,
          ),
        ])
      );
    },
  }),
  $t = H({
    __name: "CustomSolutionDialog",
    props: tt(
      { siteId: {}, selectCategory: {}, saveGeneratedSolution: { type: Function } },
      { modelValue: { type: Boolean }, modelModifiers: {} },
    ),
    emits: ["update:modelValue"],
    setup(t) {
      const l = oe(t, "modelValue"),
        { t: r } = X(),
        n = x(!1),
        a = x({}),
        i = x("");
      async function d() {
        if (((a.value = await xe(t.siteId, t.selectCategory)), a.value.id === "default"))
          ((a.value.id = G()), (a.value.name = ""));
        else {
          const S = await De(t.siteId);
          ((a.value.name = Object.entries(a.value.selectedCategories)
            .map(([p, b]) => pt(S, p) + ": " + vt(S, p, b))
            .join(";")),
            delete a.value.selectedCategories);
        }
        i.value = JSON.stringify(
          a.value.searchEntries?.[a.value.id]?.requestConfig ?? { params: {}, data: {} },
          null,
          2,
        );
      }
      function m() {
        if (n.value) {
          try {
            const S = JSON.parse(i.value);
            a.value.searchEntries &&
              a.value.id &&
              ((a.value.searchEntries[a.value.id] ??= {}), (a.value.searchEntries[a.value.id].requestConfig = S));
          } catch (S) {
            console.error("请求配置 JSON 解析失败", S);
            return;
          }
          (t.saveGeneratedSolution(a.value), (l.value = !1));
        }
      }
      return (S, p) => (
        y(),
        U(
          be,
          {
            modelValue: l.value,
            "onUpdate:modelValue": p[5] || (p[5] = (b) => (l.value = b)),
            "max-width": "800",
            onAfterEnter: d,
          },
          {
            default: o(() => [
              e(J, null, {
                default: o(() => [
                  e(
                    se,
                    { class: "pa-0" },
                    {
                      default: o(() => [
                        e(
                          he,
                          { color: "primary" },
                          {
                            append: o(() => [
                              e(
                                I,
                                {
                                  icon: "mdi-close",
                                  title: s(r)("common.dialog.close"),
                                  onClick: p[0] || (p[0] = (b) => (l.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: o(() => [
                              e(qe, null, {
                                default: o(() => [
                                  M(_(s(r)("SetSearchSolution.CustomSolutionDialog.title")) + " [ ", 1),
                                  e(ie, { "site-id": t.siteId, tag: "span", class: "" }, null, 8, ["site-id"]),
                                  p[6] || (p[6] = M(" ] ", -1)),
                                ]),
                                _: 1,
                              }),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  e(te, null, {
                    default: o(() => [
                      e(
                        Ie,
                        {
                          modelValue: n.value,
                          "onUpdate:modelValue": p[3] || (p[3] = (b) => (n.value = b)),
                          "fast-fail": "",
                          "validate-on": "eager input",
                        },
                        {
                          default: o(() => [
                            e(
                              j,
                              {
                                modelValue: a.value.name,
                                "onUpdate:modelValue": p[1] || (p[1] = (b) => (a.value.name = b)),
                                rules: [s(ae).require()],
                                label: s(r)("SetSearchSolution.CustomSolutionDialog.solutionName"),
                              },
                              null,
                              8,
                              ["modelValue", "rules", "label"],
                            ),
                            e(
                              bt,
                              {
                                label: s(r)("SetSearchSolution.CustomSolutionDialog.requestConfig"),
                                modelValue: i.value,
                                "onUpdate:modelValue": p[2] || (p[2] = (b) => (i.value = b)),
                                hint: s(r)("SetSearchSolution.CustomSolutionDialog.requestConfigHint"),
                                rules: [
                                  s(ae).require(),
                                  (b) =>
                                    s(ct)(b) || s(r)("SetSearchSolution.CustomSolutionDialog.requestConfigJsonError"),
                                ],
                                "persistent-hint": "",
                                "auto-grow": "",
                              },
                              null,
                              8,
                              ["label", "modelValue", "hint", "rules"],
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["modelValue"],
                      ),
                    ]),
                    _: 1,
                  }),
                  e(ye, null, {
                    default: o(() => [
                      e(Z),
                      e(
                        I,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: p[4] || (p[4] = (b) => (l.value = !1)),
                        },
                        { default: o(() => [M(_(s(r)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      e(
                        I,
                        {
                          disabled: !n.value,
                          color: "success",
                          "prepend-icon": "mdi-check-circle-outline",
                          variant: "text",
                          onClick: m,
                        },
                        { default: o(() => [M(_(s(r)("common.dialog.ok")), 1)]), _: 1 },
                        8,
                        ["disabled"],
                      ),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 1,
              }),
            ]),
            _: 1,
          },
          8,
          ["modelValue"],
        )
      );
    },
  }),
  At = { class: "ml-1 text-grey-darken-1" },
  Et = { class: "font-weight-bold" },
  Pt = { key: 0, class: "text-red-lighten-1" },
  Tt = { key: 1 },
  Ot = H({
    __name: "SiteCategoryPanel",
    props: { siteId: {} },
    emits: ["update:solution"],
    setup(t, { emit: l }) {
      const r = l,
        { t: n } = X(),
        a = x(!1),
        i = x({}),
        d = Ce([]);
      function m() {
        for (const w of d.value) i.value[w.key] = w.cross ? [] : pe;
      }
      const S = x([]);
      function p(w) {
        const g = i.value[w.key];
        return Array.isArray(g) ? g.length !== w.options.length : !1;
      }
      function b(w, g) {
        let v = [];
        (g && (v = g ? w.options.map((k) => k.value) : []), (i.value[w.key] = v));
      }
      async function F() {
        a.value = !0;
      }
      function O(w) {
        (r("update:solution", w), m());
      }
      async function q() {
        const w = await xe(t.siteId, i.value);
        O(w);
      }
      return (
        lt(async () => {
          ((d.value = await De(t.siteId)), m());
        }),
        (w, g) => (
          y(),
          E(
            B,
            null,
            [
              e(
                de,
                { class: "pa-0" },
                {
                  default: o(() => [
                    e(
                      P,
                      { "no-gutters": "" },
                      {
                        default: o(() => [
                          e(
                            $,
                            { class: "v-col-category-select" },
                            {
                              default: o(() => [
                                d.value.length > 0
                                  ? (y(),
                                    U(
                                      Ue,
                                      {
                                        key: 0,
                                        modelValue: S.value,
                                        "onUpdate:modelValue": g[0] || (g[0] = (v) => (S.value = v)),
                                        multiple: "",
                                      },
                                      {
                                        default: o(() => [
                                          (y(!0),
                                          E(
                                            B,
                                            null,
                                            L(
                                              d.value,
                                              (v) => (
                                                y(),
                                                U(
                                                  Me,
                                                  { key: v.key },
                                                  {
                                                    default: o(() => [
                                                      e(
                                                        Ne,
                                                        null,
                                                        {
                                                          default: o(() => [
                                                            M(_(v.name) + " ", 1),
                                                            A("span", At, _(v.notes ?? ""), 1),
                                                            e(Z),
                                                            e(
                                                              Q,
                                                              { color: s(St)(i.value[v.key]) ? "" : "info", label: "" },
                                                              { default: o(() => [M(_(v.key), 1)]), _: 2 },
                                                              1032,
                                                              ["color"],
                                                            ),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1024,
                                                      ),
                                                      e(
                                                        $e,
                                                        null,
                                                        {
                                                          default: o(() => [
                                                            e(
                                                              de,
                                                              { class: "pa-0" },
                                                              {
                                                                default: o(() => [
                                                                  v.cross && v.cross.mode
                                                                    ? (y(),
                                                                      U(
                                                                        P,
                                                                        { key: 0, "no-gutters": "" },
                                                                        {
                                                                          default: o(() => [
                                                                            e(
                                                                              $,
                                                                              { cols: "12" },
                                                                              {
                                                                                default: o(() => [
                                                                                  e(
                                                                                    ve,
                                                                                    {
                                                                                      indeterminate:
                                                                                        i.value[v.key]?.length > 0 &&
                                                                                        p(v),
                                                                                      "model-value": !p(v),
                                                                                      "hide-details": "",
                                                                                      "onUpdate:modelValue": (k) =>
                                                                                        b(v, k),
                                                                                    },
                                                                                    {
                                                                                      label: o(() => [
                                                                                        A(
                                                                                          "p",
                                                                                          Et,
                                                                                          _(
                                                                                            s(n)("common.checkbox.all"),
                                                                                          ),
                                                                                          1,
                                                                                        ),
                                                                                        p(v)
                                                                                          ? le("", !0)
                                                                                          : (y(),
                                                                                            E(
                                                                                              "p",
                                                                                              Pt,
                                                                                              "  " +
                                                                                                _(
                                                                                                  s(n)(
                                                                                                    "SetSearchSolution.spDialog.selectAllNotice",
                                                                                                  ),
                                                                                                ),
                                                                                              1,
                                                                                            )),
                                                                                      ]),
                                                                                      _: 2,
                                                                                    },
                                                                                    1032,
                                                                                    [
                                                                                      "indeterminate",
                                                                                      "model-value",
                                                                                      "onUpdate:modelValue",
                                                                                    ],
                                                                                  ),
                                                                                ]),
                                                                                _: 2,
                                                                              },
                                                                              1024,
                                                                            ),
                                                                          ]),
                                                                          _: 2,
                                                                        },
                                                                        1024,
                                                                      ))
                                                                    : le("", !0),
                                                                  e(
                                                                    P,
                                                                    { "no-gutters": "" },
                                                                    {
                                                                      default: o(() => [
                                                                        v.cross && v.cross.mode
                                                                          ? (y(!0),
                                                                            E(
                                                                              B,
                                                                              { key: 0 },
                                                                              L(
                                                                                v.options,
                                                                                (k) => (
                                                                                  y(),
                                                                                  U(
                                                                                    $,
                                                                                    {
                                                                                      key: k.value,
                                                                                      class: "py-0",
                                                                                      cols: "12",
                                                                                      lg: "2",
                                                                                      md: "4",
                                                                                      sm: "6",
                                                                                    },
                                                                                    {
                                                                                      default: o(() => [
                                                                                        e(
                                                                                          ve,
                                                                                          {
                                                                                            modelValue: i.value[v.key],
                                                                                            "onUpdate:modelValue": (
                                                                                              C,
                                                                                            ) => (i.value[v.key] = C),
                                                                                            label: k.name,
                                                                                            value: k.value,
                                                                                            "hide-details": "",
                                                                                          },
                                                                                          null,
                                                                                          8,
                                                                                          [
                                                                                            "modelValue",
                                                                                            "onUpdate:modelValue",
                                                                                            "label",
                                                                                            "value",
                                                                                          ],
                                                                                        ),
                                                                                      ]),
                                                                                      _: 2,
                                                                                    },
                                                                                    1024,
                                                                                  )
                                                                                ),
                                                                              ),
                                                                              128,
                                                                            ))
                                                                          : (y(),
                                                                            U(
                                                                              ht,
                                                                              {
                                                                                key: 1,
                                                                                modelValue: i.value[v.key],
                                                                                "onUpdate:modelValue": (k) =>
                                                                                  (i.value[v.key] = k),
                                                                                class: "justify-space-between",
                                                                                "hide-details": "",
                                                                                inline: "",
                                                                              },
                                                                              {
                                                                                default: o(() => [
                                                                                  e(
                                                                                    $,
                                                                                    {
                                                                                      class: "py-0",
                                                                                      cols: "12",
                                                                                      lg: "2",
                                                                                      md: "4",
                                                                                      sm: "6",
                                                                                    },
                                                                                    {
                                                                                      default: o(() => [
                                                                                        e(
                                                                                          Se,
                                                                                          {
                                                                                            label: s(n)(
                                                                                              "SetSite.SiteCategoryPanel.siteDefault",
                                                                                            ),
                                                                                            value: s(pe),
                                                                                          },
                                                                                          null,
                                                                                          8,
                                                                                          ["label", "value"],
                                                                                        ),
                                                                                      ]),
                                                                                      _: 1,
                                                                                    },
                                                                                  ),
                                                                                  (y(!0),
                                                                                  E(
                                                                                    B,
                                                                                    null,
                                                                                    L(
                                                                                      v.options,
                                                                                      (k) => (
                                                                                        y(),
                                                                                        U(
                                                                                          $,
                                                                                          {
                                                                                            class: "py-0",
                                                                                            cols: "12",
                                                                                            lg: "2",
                                                                                            md: "4",
                                                                                            sm: "6",
                                                                                          },
                                                                                          {
                                                                                            default: o(() => [
                                                                                              (y(),
                                                                                              U(
                                                                                                Se,
                                                                                                {
                                                                                                  key: k.value,
                                                                                                  label: k.name,
                                                                                                  value: k.value,
                                                                                                },
                                                                                                null,
                                                                                                8,
                                                                                                ["label", "value"],
                                                                                              )),
                                                                                            ]),
                                                                                            _: 2,
                                                                                          },
                                                                                          1024,
                                                                                        )
                                                                                      ),
                                                                                    ),
                                                                                    256,
                                                                                  )),
                                                                                ]),
                                                                                _: 2,
                                                                              },
                                                                              1032,
                                                                              ["modelValue", "onUpdate:modelValue"],
                                                                            )),
                                                                      ]),
                                                                      _: 2,
                                                                    },
                                                                    1024,
                                                                  ),
                                                                ]),
                                                                _: 2,
                                                              },
                                                              1024,
                                                            ),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1024,
                                                      ),
                                                    ]),
                                                    _: 2,
                                                  },
                                                  1024,
                                                )
                                              ),
                                            ),
                                            128,
                                          )),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["modelValue"],
                                    ))
                                  : (y(), E("div", Tt, _(s(n)("SetSearchSolution.spDialog.noDefNotice")), 1)),
                              ]),
                              _: 1,
                            },
                          ),
                          e(
                            $,
                            { "align-self": "center" },
                            {
                              default: o(() => [
                                e(
                                  P,
                                  { justify: "end" },
                                  {
                                    default: o(() => [
                                      e(
                                        I,
                                        {
                                          title: s(n)("SetSearchSolution.spDialog.action.reset"),
                                          color: "red",
                                          icon: "mdi-cached",
                                          variant: "text",
                                          onClick: g[1] || (g[1] = () => m()),
                                        },
                                        null,
                                        8,
                                        ["title"],
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                ),
                                e(
                                  P,
                                  { justify: "end" },
                                  {
                                    default: o(() => [
                                      e(
                                        I,
                                        {
                                          title: s(n)("SetSearchSolution.spDialog.action.create"),
                                          color: "indigo",
                                          icon: "mdi-pencil-plus",
                                          variant: "text",
                                          onClick: g[2] || (g[2] = () => F()),
                                        },
                                        null,
                                        8,
                                        ["title"],
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                ),
                                e(
                                  P,
                                  { justify: "end" },
                                  {
                                    default: o(() => [
                                      e(
                                        I,
                                        {
                                          title: s(n)("SetSearchSolution.spDialog.action.add"),
                                          color: "blue",
                                          icon: "mdi-arrow-right-bold",
                                          variant: "text",
                                          onClick: g[3] || (g[3] = () => q()),
                                        },
                                        null,
                                        8,
                                        ["title"],
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                  ]),
                  _: 1,
                },
              ),
              e(
                $t,
                {
                  modelValue: a.value,
                  "onUpdate:modelValue": g[4] || (g[4] = (v) => (a.value = v)),
                  "save-generated-solution": O,
                  "select-category": i.value,
                  "site-id": t.siteId,
                },
                null,
                8,
                ["modelValue", "select-category", "site-id"],
              ),
            ],
            64,
          )
        )
      );
    },
  }),
  Bt = ze(Ot, [["__scopeId", "data-v-3ad7ccb5"]]),
  Ft = H({
    __name: "EditDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {}, solutionId: {}, solutionIdModifiers: {} },
    emits: ["update:modelValue", "update:solutionId"],
    setup(t) {
      const l = oe(t, "modelValue"),
        r = oe(t, "solutionId"),
        { t: n } = X(),
        a = () => ({ id: G(), name: "", sort: 1, enabled: !0, isDefault: !1, createdAt: Date.now(), solutions: [] }),
        i = ge(),
        d = Ve(),
        m = x(a()),
        S = x(!1),
        p = x(""),
        b = ot(p, 500),
        F = Ce([]),
        O = we(() => {
          const C = (b.value ?? "").toLowerCase();
          return F.value
            .filter((c) =>
              [c.siteId, c.siteName, c.siteUrl]
                .filter(Boolean)
                .map((Y) => Y.toLowerCase())
                .join("|")
                .includes(C),
            )
            .map((c) => c.siteId);
        });
      function q(C) {
        if (
          Mt(
            m.value.solutions,
            (c) =>
              c.siteId === C.siteId &&
              ((!nt(c.selectedCategories) && dt(c.selectedCategories, C.selectedCategories)) ||
                (typeof c.name < "u" && c.name === C.name)),
          )
        ) {
          d.showSnakebar(n("SetSearchSolution.edit.cantAddByDuplicateNote"), { color: "error" });
          return;
        }
        m.value.solutions.push(C);
      }
      function w(C) {
        m.value.solutions = m.value.solutions.filter((c) => !(c.id == C.id && c.siteId == C.siteId));
      }
      function g() {
        (i.addSearchSolution(m.value), (l.value = !1));
      }
      function v() {
        Promise.all(
          i.getAddedSiteIds
            .sort((c, h) => Number(i.sites[h].allowSearch) - Number(i.sites[c].allowSearch))
            .map(async (c) => ({
              siteId: c,
              isDead: (await i.getSiteMergedMetadata(c, "isDead")) ?? !1,
              siteName: await i.getSiteName(c),
              siteUrl: await i.getSiteUrl(c),
            })),
        ).then((c) => {
          F.value = c.filter((h) => !h.isDead);
        });
        let C = i.solutions[r.value];
        (C || (C = a()), (m.value = ue(C)));
      }
      function k() {
        m.value = a();
      }
      return (C, c) => (
        y(),
        U(
          be,
          {
            modelValue: l.value,
            "onUpdate:modelValue": c[7] || (c[7] = (h) => (l.value = h)),
            fullscreen: "",
            onAfterEnter: v,
            onAfterLeave: k,
          },
          {
            default: o(() => [
              e(
                J,
                { class: "overflow-y-auto" },
                {
                  default: o(() => [
                    e(
                      se,
                      { class: "pa-0" },
                      {
                        default: o(() => [
                          e(
                            he,
                            { title: s(n)("SetSearchSolution.edit.title"), color: "blue-grey-darken-2" },
                            {
                              append: o(() => [
                                e(
                                  I,
                                  {
                                    icon: "mdi-close",
                                    title: s(n)("common.dialog.close"),
                                    onClick: c[0] || (c[0] = (h) => (l.value = !1)),
                                  },
                                  null,
                                  8,
                                  ["title"],
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["title"],
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    e(K),
                    e(te, null, {
                      default: o(() => [
                        e(
                          Ie,
                          { modelValue: S.value, "onUpdate:modelValue": c[5] || (c[5] = (h) => (S.value = h)) },
                          {
                            default: o(() => [
                              e(P, null, {
                                default: o(() => [
                                  e($, null, {
                                    default: o(() => [
                                      e(
                                        j,
                                        {
                                          modelValue: m.value.name,
                                          "onUpdate:modelValue": c[1] || (c[1] = (h) => (m.value.name = h)),
                                          label: s(n)("common.name"),
                                          rules: [s(ae).require()],
                                          autofocus: "",
                                          required: "",
                                        },
                                        null,
                                        8,
                                        ["modelValue", "label", "rules"],
                                      ),
                                    ]),
                                    _: 1,
                                  }),
                                  e(
                                    $,
                                    { cols: "3" },
                                    {
                                      default: o(() => [
                                        e(
                                          j,
                                          {
                                            modelValue: m.value.id,
                                            "onUpdate:modelValue": c[2] || (c[2] = (h) => (m.value.id = h)),
                                            disabled: "",
                                            label: "ID",
                                          },
                                          null,
                                          8,
                                          ["modelValue"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                  e(
                                    $,
                                    { cols: "2" },
                                    {
                                      default: o(() => [
                                        e(
                                          j,
                                          {
                                            modelValue: m.value.sort,
                                            "onUpdate:modelValue": c[3] || (c[3] = (h) => (m.value.sort = h)),
                                            label: s(n)("common.sortIndex"),
                                            max: "100",
                                            min: "0",
                                            type: "number",
                                          },
                                          null,
                                          8,
                                          ["modelValue", "label"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                ]),
                                _: 1,
                              }),
                              e(P, null, {
                                default: o(() => [
                                  e(
                                    $,
                                    { cols: "12", md: "8" },
                                    {
                                      default: o(() => [
                                        e(
                                          j,
                                          {
                                            modelValue: p.value,
                                            "onUpdate:modelValue": c[4] || (c[4] = (h) => (p.value = h)),
                                            placeholder: s(n)("SetSearchSolution.edit.filterPlaceholder"),
                                            "append-inner-icon": "mdi-magnify",
                                            clearable: "",
                                            "prepend-icon": "mdi-sitemap",
                                          },
                                          null,
                                          8,
                                          ["modelValue", "placeholder"],
                                        ),
                                        e(
                                          J,
                                          { class: "overflow-y-auto", height: "calc(100vh - 340px)" },
                                          {
                                            default: o(() => [
                                              e(Ue, null, {
                                                default: o(() => [
                                                  (y(!0),
                                                  E(
                                                    B,
                                                    null,
                                                    L(
                                                      O.value,
                                                      (h) => (
                                                        y(),
                                                        U(
                                                          Me,
                                                          { key: h, disabled: !!s(i).sites[h].isOffline },
                                                          {
                                                            default: o(() => [
                                                              e(
                                                                Ne,
                                                                null,
                                                                {
                                                                  default: o(() => [
                                                                    e(
                                                                      Re,
                                                                      { "site-id": h, class: "mr-2", inline: "" },
                                                                      null,
                                                                      8,
                                                                      ["site-id"],
                                                                    ),
                                                                    e(
                                                                      Q,
                                                                      { color: "green", label: "" },
                                                                      {
                                                                        default: o(() => [
                                                                          e(
                                                                            ie,
                                                                            {
                                                                              class: at(["text-no-wrap"]),
                                                                              "site-id": h,
                                                                            },
                                                                            null,
                                                                            8,
                                                                            ["site-id"],
                                                                          ),
                                                                        ]),
                                                                        _: 2,
                                                                      },
                                                                      1024,
                                                                    ),
                                                                  ]),
                                                                  _: 2,
                                                                },
                                                                1024,
                                                              ),
                                                              e(
                                                                $e,
                                                                null,
                                                                {
                                                                  default: o(() => [
                                                                    e(
                                                                      Bt,
                                                                      { "site-id": h, "onUpdate:solution": q },
                                                                      null,
                                                                      8,
                                                                      ["site-id"],
                                                                    ),
                                                                  ]),
                                                                  _: 2,
                                                                },
                                                                1024,
                                                              ),
                                                            ]),
                                                            _: 2,
                                                          },
                                                          1032,
                                                          ["disabled"],
                                                        )
                                                      ),
                                                    ),
                                                    128,
                                                  )),
                                                ]),
                                                _: 1,
                                              }),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                  e(
                                    $,
                                    { cols: "12", md: "4" },
                                    {
                                      default: o(() => [
                                        e(
                                          Ae,
                                          { class: "mb-2", type: "success" },
                                          {
                                            default: o(() => [
                                              e(Ee, null, {
                                                default: o(() => [
                                                  M(
                                                    _(
                                                      s(n)("SetSearchSolution.edit.addCount", [
                                                        m.value.solutions.length,
                                                      ]),
                                                    ),
                                                    1,
                                                  ),
                                                ]),
                                                _: 1,
                                              }),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                        e(
                                          J,
                                          { class: "overflow-y-auto", height: "calc(100vh - 330px)" },
                                          {
                                            default: o(() => [
                                              e(
                                                te,
                                                { class: "pl-3 py-0 pr-1" },
                                                {
                                                  default: o(() => [
                                                    e(
                                                      Be,
                                                      {
                                                        "group-props": { column: !0 },
                                                        solutions: m.value.solutions,
                                                        closable: "",
                                                        "onRemove:solution": w,
                                                      },
                                                      null,
                                                      8,
                                                      ["solutions"],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                              ),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                ]),
                                _: 1,
                              }),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modelValue"],
                        ),
                      ]),
                      _: 1,
                    }),
                    e(K),
                    e(ye, null, {
                      default: o(() => [
                        e(Z),
                        e(
                          I,
                          {
                            color: "error",
                            "prepend-icon": "mdi-close-circle",
                            variant: "text",
                            onClick: c[6] || (c[6] = (h) => (l.value = !1)),
                          },
                          { default: o(() => [M(_(s(n)("common.dialog.cancel")), 1)]), _: 1 },
                        ),
                        e(
                          I,
                          {
                            disabled: !S.value || m.value.solutions.length === 0,
                            color: "success",
                            "prepend-icon": "mdi-check-circle-outline",
                            variant: "text",
                            onClick: g,
                          },
                          { default: o(() => [M(_(s(n)("common.dialog.ok")), 1)]), _: 1 },
                          8,
                          ["disabled"],
                        ),
                      ]),
                      _: 1,
                    }),
                  ]),
                  _: 1,
                },
              ),
            ]),
            _: 1,
          },
          8,
          ["modelValue"],
        )
      );
    },
  }),
  jt = { class: "v-data-table__tr" },
  qt = { class: "v-data-table__td" },
  zt = { class: "v-data-table__td" },
  Rt = { class: "v-data-table__td v-data-table-column--align-center" },
  Jt = { class: "v-data-table__td v-data-table-column--align-center" },
  Lt = { class: "v-data-table__td" },
  bl = H({
    __name: "Index",
    setup(t) {
      const { t: l } = X(),
        r = Je(),
        n = Ve(),
        a = ge(),
        i = x(!1),
        d = x(!1),
        m = x(""),
        S = x([]),
        p = [
          { title: "№", key: "sort", align: "center", width: 150 },
          { title: l("common.name"), key: "name", align: "start", width: 150 },
          { title: l("SetSearchSolution.solution"), key: "solution", align: "start", minWidth: 400, sortable: !1 },
          { title: l("SetSearchSolution.table.enable"), key: "enabled", align: "center", width: 120 },
          { title: l("SetSearchSolution.table.default"), key: "isDefault", align: "center", width: 120, sortable: !1 },
          { title: l("common.action"), key: "action", sortable: !1, width: 200 },
        ],
        b = x("");
      function F() {
        O("");
      }
      function O(V) {
        ((m.value = V), (i.value = !0));
      }
      const q = it("importFile");
      function w(V) {
        if (V.target instanceof HTMLInputElement && V.target.files && V.target.files.length > 0)
          for (const f of V.target.files) {
            const u = new FileReader();
            ((u.onload = (D) => {
              try {
                const T = JSON.parse(D.target.result);
                for (const z of T) {
                  let N = z;
                  N.solutions &&
                    N.solutions.length > 0 &&
                    ((N.id = G()),
                    (N.enabled = !1),
                    (N.createdAt = +new Date()),
                    (N.isDefault = !1),
                    (N.sort = 1),
                    a.addSearchSolution(N));
                }
              } catch {
                n.showSnakebar("Invalid JSON format when import search solution", { color: "error" });
              }
            }),
              (u.onerror = () => {
                n.showSnakebar("Invalid JSON format when load import file", { color: "error" });
              }),
              u.readAsText(f));
          }
      }
      function g(V) {
        const f = [];
        for (const u of V) f.push(st(a.solutions[u], ["id", "enabled", "createdAt", "isDefault", "sort"]));
        if (f.length > 0) {
          const u = new Blob([JSON.stringify(f)], { type: "application/json" });
          ut.saveAs(u, `search-solutions-export-${rt(new Date(), "yyyyMMdd'T'HHmm")}.json`);
        } else n.showSnakebar("No solutions to export", { color: "error" });
      }
      const v = x([]);
      function k(V) {
        ((v.value = V), (d.value = !0));
      }
      async function C(V) {
        return await a.removeSearchSolution(V);
      }
      function c(V, f) {
        ((a.solutions[V].enabled = f), a.$save());
      }
      function h(V, f) {
        if ((console.log(V, f), V)) {
          a.defaultSolutionId = f;
          for (const u of Object.keys(a.solutions)) a.solutions[u].isDefault = u === f;
        } else ((a.defaultSolutionId = "default"), (a.solutions[f].isDefault = !1));
        a.$save();
      }
      const Y = we(() => a.defaultSolutionId === "default");
      async function re(V) {
        const f = await a.getSearchSolution(V);
        if (!f) return;
        const u = ue(f);
        ((u.id = G()), (u.createdAt = Date.now()), (u.isDefault = !1));
        for (const T of u.solutions) {
          const z = T.id;
          if (z !== "default") {
            const N = G();
            ((T.id = N), (T.searchEntries[N] = T.searchEntries[z]), delete T.searchEntries[z]);
          }
        }
        const D = prompt(l("SetSearchSolution.newSolutionNamePrompt"), `Copy of ${u.name ?? u.id}`);
        D && ((u.name = D), await a.addSearchSolution(u));
      }
      return (V, f) => (
        y(),
        E(
          B,
          null,
          [
            e(
              Ae,
              { type: "info" },
              {
                default: o(() => [
                  e(Ee, null, { default: o(() => [M(_(s(l)("route.Settings.SetSearchSolution")), 1)]), _: 1 }),
                ]),
                _: 1,
              },
            ),
            e(J, null, {
              default: o(() => [
                e(se, null, {
                  default: o(() => [
                    e(
                      P,
                      { class: "ma-0" },
                      {
                        default: o(() => [
                          e(
                            R,
                            { text: s(l)("common.btn.add"), color: "success", icon: "mdi-plus", onClick: F },
                            null,
                            8,
                            ["text"],
                          ),
                          e(
                            R,
                            {
                              disabled: S.value.length === 0,
                              text: s(l)("common.remove"),
                              color: "error",
                              icon: "mdi-minus",
                              onClick: f[0] || (f[0] = (u) => k(S.value)),
                            },
                            null,
                            8,
                            ["disabled", "text"],
                          ),
                          e(K, { class: "mx-2", inset: "", vertical: "" }),
                          A(
                            "input",
                            {
                              ref: "importFile",
                              accept: "application/json",
                              multiple: "",
                              style: { display: "none" },
                              type: "file",
                              onChange: w,
                            },
                            null,
                            544,
                          ),
                          e(
                            R,
                            {
                              color: "info",
                              icon: "mdi-import",
                              text: s(l)("common.import"),
                              onClick: f[1] || (f[1] = () => q.value?.click()),
                            },
                            null,
                            8,
                            ["text"],
                          ),
                          e(
                            R,
                            {
                              disabled: S.value.length === 0,
                              color: "info",
                              icon: "mdi-export",
                              text: s(l)("common.export"),
                              onClick: f[2] || (f[2] = () => g(S.value)),
                            },
                            null,
                            8,
                            ["disabled", "text"],
                          ),
                          e(K, { class: "mx-2", inset: "", vertical: "" }),
                          e(
                            R,
                            {
                              text: s(l)("common.howToUse"),
                              color: "light-blue",
                              disabled: "",
                              icon: "mdi-help-circle",
                            },
                            null,
                            8,
                            ["text"],
                          ),
                          e(Z),
                          e(
                            j,
                            {
                              modelValue: b.value,
                              "onUpdate:modelValue": f[3] || (f[3] = (u) => (b.value = u)),
                              "append-icon": "mdi-magnify",
                              clearable: "",
                              density: "compact",
                              "hide-details": "",
                              label: s(l)("common.search"),
                              "max-width": "500",
                              "single-line": "",
                            },
                            null,
                            8,
                            ["modelValue", "label"],
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                  ]),
                  _: 1,
                }),
                e(
                  gt,
                  {
                    modelValue: S.value,
                    "onUpdate:modelValue": f[5] || (f[5] = (u) => (S.value = u)),
                    "filter-keys": ["name"],
                    headers: p,
                    items: s(a).getSearchSolutions,
                    "items-per-page": s(r).tableBehavior.SetSearchSolution.itemsPerPage,
                    search: b.value,
                    "sort-by": [
                      { key: "enabled", order: "desc" },
                      { key: "sort", order: "desc" },
                    ],
                    class: "table-stripe table-header-no-wrap",
                    hover: "",
                    "item-value": "id",
                    "multi-sort": s(r).enableTableMultiSort,
                    "show-select": "",
                    "onUpdate:itemsPerPage":
                      f[6] || (f[6] = (u) => s(r).updateTableBehavior("SetSearchSolution", "itemsPerPage", u)),
                  },
                  {
                    "body.prepend": o(() => [
                      A("tr", jt, [
                        f[9] || (f[9] = A("td", { class: "v-data-table__td", colspan: "2" }, null, -1)),
                        A("td", qt, _(s(l)("layout.header.searchPlan.all")), 1),
                        A("td", zt, [
                          e(
                            Q,
                            {
                              class: "mb-1 mr-1 h-auto py-1",
                              color: "light-blue",
                              label: "",
                              "prepend-icon": "mdi-refresh-auto",
                              size: "small",
                            },
                            { default: o(() => [M(_(s(l)("SetSearchSolution.table.autoGenerate")), 1)]), _: 1 },
                          ),
                        ]),
                        A("td", Rt, [e(W, { class: "table-switch-btn", disabled: "", "hide-details": "" })]),
                        A("td", Jt, [
                          e(
                            W,
                            {
                              "model-value": Y.value,
                              class: "table-switch-btn",
                              color: "success",
                              "hide-details": "",
                              readonly: "",
                            },
                            null,
                            8,
                            ["model-value"],
                          ),
                        ]),
                        A("td", Lt, [
                          e(
                            ce,
                            { class: "table-action", density: "compact", variant: "plain" },
                            {
                              default: o(() => [
                                e(
                                  I,
                                  {
                                    title: s(l)("SetSearchSolution.copy"),
                                    color: "success",
                                    icon: "mdi-content-copy",
                                    size: "small",
                                    onClick: f[4] || (f[4] = (u) => re("default")),
                                  },
                                  null,
                                  8,
                                  ["title"],
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                      ]),
                    ]),
                    "item.solution": o(({ item: u }) => [
                      e(Be, { closable: !1, "group-props": { column: !0 }, solutions: u.solutions }, null, 8, [
                        "solutions",
                      ]),
                    ]),
                    "item.enabled": o(({ item: u }) => [
                      e(
                        W,
                        {
                          modelValue: u.enabled,
                          "onUpdate:modelValue": [(D) => (u.enabled = D), (D) => c(u.id, D)],
                          class: "table-switch-btn",
                          color: "success",
                          "hide-details": "",
                        },
                        null,
                        8,
                        ["modelValue", "onUpdate:modelValue"],
                      ),
                    ]),
                    "item.isDefault": o(({ item: u }) => [
                      e(
                        W,
                        {
                          modelValue: u.isDefault,
                          "onUpdate:modelValue": [(D) => (u.isDefault = D), (D) => h(D, u.id)],
                          class: "table-switch-btn",
                          color: "success",
                          "hide-details": "",
                        },
                        null,
                        8,
                        ["modelValue", "onUpdate:modelValue"],
                      ),
                    ]),
                    "item.action": o(({ item: u }) => [
                      e(
                        ce,
                        { class: "table-action", density: "compact", variant: "plain" },
                        {
                          default: o(() => [
                            e(
                              I,
                              {
                                title: s(l)("SetSearchSolution.copy"),
                                size: "small",
                                color: "success",
                                icon: "mdi-content-copy",
                                onClick: (D) => re(u.id),
                              },
                              null,
                              8,
                              ["title", "onClick"],
                            ),
                            e(
                              I,
                              {
                                title: s(l)("common.edit"),
                                color: "info",
                                icon: "mdi-pencil",
                                size: "small",
                                onClick: () => O(u.id),
                              },
                              null,
                              8,
                              ["title", "onClick"],
                            ),
                            e(
                              I,
                              {
                                title: s(l)("common.export"),
                                size: "small",
                                color: "info",
                                icon: "mdi-export",
                                onClick: (D) => g([u.id]),
                              },
                              null,
                              8,
                              ["title", "onClick"],
                            ),
                            e(
                              I,
                              {
                                title: s(l)("common.remove"),
                                color: "error",
                                icon: "mdi-delete",
                                size: "small",
                                onClick: () => k([u.id]),
                              },
                              null,
                              8,
                              ["title", "onClick"],
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
                  ["modelValue", "items", "items-per-page", "search", "multi-sort"],
                ),
              ]),
              _: 1,
            }),
            e(
              Ft,
              {
                modelValue: i.value,
                "onUpdate:modelValue": f[7] || (f[7] = (u) => (i.value = u)),
                "solution-id": m.value,
              },
              null,
              8,
              ["modelValue", "solution-id"],
            ),
            e(
              yt,
              {
                modelValue: d.value,
                "onUpdate:modelValue": f[8] || (f[8] = (u) => (d.value = u)),
                "to-delete-ids": v.value,
                "confirm-delete": C,
              },
              null,
              8,
              ["modelValue", "to-delete-ids"],
            ),
          ],
          64,
        )
      );
    },
  });
export { bl as default };
