import {
  bN as k,
  bV as C,
  s as P,
  j as B,
  a4 as _,
  a5 as $,
  c as f,
  t as F,
  i as M,
  a3 as R,
  g as z,
  a2 as N,
  f as T,
  bz as L,
  c0 as W,
  T as j,
  d as H,
} from "./src/entries/options/index-DmNe5UVo.js";
import { b as q } from "./utils-DF6YUpNn.js";
import { _ as G } from "./DeleteDialog.vue_vue_type_script_setup_true_lang-CkaHuNvW.js";
import { N as O } from "./NavButton-jVIhOejA.js";
import {
  X as x,
  cb as Q,
  I as X,
  ck as o,
  a$ as J,
  br as u,
  U as e,
  Q as D,
  bS as V,
  c4 as a,
  bj as E,
  bs as K,
  L as Y,
  F as Z,
  H as ee,
} from "../vendor/packages/site/index-COeZNva1.js";
import { V as te } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as ae } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
const le = x({
    __name: "EditNameDialog",
    props: J({ editId: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(v) {
      const { t: l } = k(),
        m = Q(v, "modelValue"),
        i = v,
        p = C(),
        r = u("");
      function h() {
        (p.editSearchSnapshotDataName(i.editId, r.value), (m.value = !1));
      }
      function b() {
        r.value = p.snapshots[i.editId].name;
      }
      return (S, s) => (
        E(),
        X(
          P,
          {
            modelValue: m.value,
            "onUpdate:modelValue": s[2] || (s[2] = (c) => (m.value = c)),
            width: "500",
            onAfterEnter: s[3] || (s[3] = () => i.editId && b()),
            onAfterLeave: s[4] || (s[4] = () => (r.value = "")),
          },
          {
            default: o(() => [
              e(T, null, {
                default: o(() => [
                  e(
                    B,
                    { class: "pa-0" },
                    {
                      default: o(() => [
                        e(
                          _,
                          { color: "cyan-darken-2" },
                          {
                            append: o(() => [
                              e(
                                f,
                                {
                                  icon: "mdi-close",
                                  title: a(l)("common.dialog.close"),
                                  onClick: s[0] || (s[0] = (c) => (m.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: o(() => [
                              e($, null, {
                                default: o(() => [D(V(a(l)("SearchResultSnapshot.EditNameDialog.title")), 1)]),
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
                  e(F),
                  e(M, null, {
                    default: o(() => [
                      e(
                        R,
                        {
                          modelValue: r.value,
                          "onUpdate:modelValue": s[1] || (s[1] = (c) => (r.value = c)),
                          dense: "",
                          "hide-details": "",
                          label: a(l)("SearchResultSnapshot.EditNameDialog.snapshotName"),
                          outlined: "",
                        },
                        null,
                        8,
                        ["modelValue", "label"],
                      ),
                    ]),
                    _: 1,
                  }),
                  e(z, null, {
                    default: o(() => [
                      e(N),
                      e(
                        f,
                        { color: "primary", onClick: h },
                        { default: o(() => [D(V(a(l)("common.save")), 1)]), _: 1 },
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
  oe = { class: "text-no-wrap" },
  be = x({
    __name: "Index",
    setup(v) {
      const { t: l } = k(),
        m = W(),
        i = L(),
        p = C(),
        r = u(!1),
        h = u(!1),
        b = [
          { title: l("SearchResultSnapshot.table.header.name"), key: "name", align: "start" },
          { title: l("SearchResultSnapshot.table.header.recordCount"), key: "recordCount", align: "end", width: 100 },
          {
            title: l("SearchResultSnapshot.table.header.createdAt"),
            key: "createdAt",
            align: "center",
            width: 150,
            minWidth: 150,
          },
          {
            title: l("common.action"),
            key: "action",
            align: "center",
            width: 125,
            minWidth: 125,
            sortable: !1,
            alwaysShow: !0,
          },
        ],
        S = u([]),
        s = u(""),
        c = K(s, 500);
      function I(d) {
        m.push({ name: "SearchEntity", query: { snapshot: d } });
      }
      const g = u(null);
      function U(d) {
        ((g.value = d), (r.value = !0));
      }
      const y = u([]);
      function w(d) {
        ((y.value = d), (h.value = !0));
      }
      async function A(d) {
        return await p.removeSearchSnapshotData(d);
      }
      return (d, n) => (
        E(),
        Y(
          Z,
          null,
          [
            e(te, { type: "info", title: a(l)("route.Overview.SearchResultSnapshot") }, null, 8, ["title"]),
            e(T, null, {
              default: o(() => [
                e(B, null, {
                  default: o(() => [
                    e(
                      j,
                      { class: "ma-0" },
                      {
                        default: o(() => [
                          e(
                            O,
                            {
                              disabled: S.value.length === 0,
                              color: "error",
                              icon: "mdi-minus",
                              text: a(l)("common.remove"),
                              onClick: n[0] || (n[0] = (t) => w(S.value)),
                            },
                            null,
                            8,
                            ["disabled", "text"],
                          ),
                          e(N),
                          e(
                            R,
                            {
                              modelValue: s.value,
                              "onUpdate:modelValue": n[1] || (n[1] = (t) => (s.value = t)),
                              "append-icon": "mdi-magnify",
                              clearable: "",
                              density: "compact",
                              "hide-details": "",
                              label: a(l)("SearchResultSnapshot.table.filterLabel"),
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
                  ae,
                  {
                    modelValue: S.value,
                    "onUpdate:modelValue": n[2] || (n[2] = (t) => (S.value = t)),
                    headers: b,
                    items: a(p).getSearchSnapshotList,
                    "items-per-page": a(i).tableBehavior.SearchResultSnapshot.itemsPerPage,
                    search: a(c),
                    "sort-by": a(i).tableBehavior.SearchResultSnapshot.sortBy,
                    class: "table-stripe table-header-no-wrap",
                    hover: "",
                    "item-value": "id",
                    "multi-sort": a(i).enableTableMultiSort,
                    "show-select": "",
                    "onUpdate:itemsPerPage":
                      n[3] || (n[3] = (t) => a(i).updateTableBehavior("SearchResultSnapshot", "itemsPerPage", t)),
                    "onUpdate:sortBy":
                      n[4] || (n[4] = (t) => a(i).updateTableBehavior("SearchResultSnapshot", "sortBy", t)),
                  },
                  {
                    "item.createdAt": o(({ item: t }) => [ee("span", oe, V(a(q)(t.createdAt)), 1)]),
                    "item.action": o(({ item: t }) => [
                      e(
                        H,
                        { class: "table-action", density: "compact", variant: "plain" },
                        {
                          default: o(() => [
                            e(
                              f,
                              {
                                color: "green",
                                icon: "mdi-archive-search",
                                size: "small",
                                title: a(l)("SearchResultSnapshot.table.action.view"),
                                onClick: () => I(t.id),
                              },
                              null,
                              8,
                              ["title", "onClick"],
                            ),
                            e(
                              f,
                              {
                                color: "blue",
                                icon: "mdi-archive-edit",
                                size: "small",
                                title: a(l)("SearchResultSnapshot.table.action.editTitle"),
                                onClick: () => U(t.id),
                              },
                              null,
                              8,
                              ["title", "onClick"],
                            ),
                            e(
                              f,
                              {
                                title: a(l)("common.remove"),
                                color: "error",
                                icon: "mdi-delete",
                                size: "small",
                                onClick: (se) => w([t.id]),
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
                  ["modelValue", "items", "items-per-page", "search", "sort-by", "multi-sort"],
                ),
              ]),
              _: 1,
            }),
            e(
              le,
              { modelValue: r.value, "onUpdate:modelValue": n[5] || (n[5] = (t) => (r.value = t)), "edit-id": g.value },
              null,
              8,
              ["modelValue", "edit-id"],
            ),
            e(
              G,
              {
                modelValue: h.value,
                "onUpdate:modelValue": n[6] || (n[6] = (t) => (h.value = t)),
                "to-delete-ids": y.value,
                "confirm-delete": A,
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
export { be as default };
