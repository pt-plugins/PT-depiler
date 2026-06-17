import {
  bN as E,
  f as N,
  p as oe,
  T as I,
  n as T,
  a3 as x,
  A as ne,
  $ as de,
  c as k,
  bV as F,
  j as P,
  a4 as J,
  a5 as O,
  t as B,
  i as Q,
  C as H,
  g as X,
  a2 as K,
  s as Y,
  bz as re,
  d as ue,
  x as ie,
  V as se,
} from "./src/entries/options/index-DmNe5UVo.js";
import { g as me, c as Z, b as L, a as ce, e as ve } from "../vendor/packages/mediaServer/index-Cmj48V-l.js";
import {
  X as q,
  cb as j,
  E as h,
  bj as p,
  I as g,
  ck as l,
  U as e,
  c4 as a,
  Q as w,
  bS as y,
  L as A,
  F as z,
  bu as R,
  H as ee,
  J as U,
  a$ as le,
  br as S,
  b0 as pe,
  b1 as fe,
} from "../vendor/packages/site/index-COeZNva1.js";
import { a as _, b as Ve } from "./utils-DF6YUpNn.js";
import { _ as be } from "./ConnectCheckButton.vue_vue_type_script_setup_true_lang-B58MRE7r.js";
import { V as ge } from "../vendor/vuetify/VForm-CJoKT4R8.js";
import { V as ae } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as Se, a as W } from "../vendor/vuetify/VWindowItem-CGCDkWEG.js";
import { V as ye } from "../vendor/vuetify/VAutocomplete-DUqyo09O.js";
import { N as G } from "./NavButton-jVIhOejA.js";
import { _ as ke } from "./DeleteDialog.vue_vue_type_script_setup_true_lang-CkaHuNvW.js";
import { V as we } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import { V as Ce } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
const te = q({
    __name: "Editor",
    props: { modelValue: {}, modelModifiers: {} },
    emits: le(["update:configValid"], ["update:modelValue"]),
    setup(C, { emit: i }) {
      const { t: r } = E(),
        t = j(C, "modelValue"),
        c = i,
        f = h(async () => await Z(t.value.type), {}),
        m = S(!1);
      async function D() {
        return m ? await (await me(t.value)).ping() : !1;
      }
      return (v, o) => (
        p(),
        g(
          N,
          { class: "mb-5" },
          {
            default: l(() => [
              t.value
                ? (p(),
                  g(
                    ge,
                    {
                      key: 0,
                      modelValue: m.value,
                      "onUpdate:modelValue": o[7] || (o[7] = (n) => (m.value = n)),
                      "fast-fail": "",
                    },
                    {
                      default: l(() => [
                        e(
                          oe,
                          { class: "pa-0" },
                          {
                            default: l(() => [
                              e(I, null, {
                                default: l(() => [
                                  e(
                                    T,
                                    { cols: "12", md: "4" },
                                    {
                                      default: l(() => [
                                        e(
                                          x,
                                          {
                                            modelValue: t.value.type,
                                            "onUpdate:modelValue": o[0] || (o[0] = (n) => (t.value.type = n)),
                                            label: a(r)("common.type"),
                                            disabled: "",
                                          },
                                          null,
                                          8,
                                          ["modelValue", "label"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                  e(
                                    T,
                                    { cols: "12", md: "4" },
                                    {
                                      default: l(() => [
                                        e(
                                          x,
                                          {
                                            modelValue: t.value.name,
                                            "onUpdate:modelValue": o[1] || (o[1] = (n) => (t.value.name = n)),
                                            label: a(r)("SetDownloader.common.name"),
                                            placeholder: a(r)("SetDownloader.common.name"),
                                            rules: [a(_).require(a(r)("SetDownloader.editor.nameTip"))],
                                            required: "",
                                          },
                                          null,
                                          8,
                                          ["modelValue", "label", "placeholder", "rules"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                  e(
                                    T,
                                    { cols: "12", md: "4" },
                                    {
                                      default: l(() => [
                                        e(
                                          x,
                                          {
                                            modelValue: t.value.id,
                                            "onUpdate:modelValue": o[2] || (o[2] = (n) => (t.value.id = n)),
                                            label:
                                              a(r)("SetDownloader.common.uid") +
                                              a(r)("SetDownloader.editor.uidPlaceholder"),
                                            disabled: "",
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
                              e(I, null, {
                                default: l(() => [
                                  e(
                                    x,
                                    {
                                      modelValue: t.value.address,
                                      "onUpdate:modelValue": o[3] || (o[3] = (n) => (t.value.address = n)),
                                      label: a(r)("SetDownloader.common.address"),
                                      rules: [a(_).url(a(r)("SetDownloader.editor.addressTip"))],
                                      required: "",
                                    },
                                    null,
                                    8,
                                    ["modelValue", "label", "rules"],
                                  ),
                                ]),
                                _: 1,
                              }),
                              e(I, null, {
                                default: l(() => [
                                  e(
                                    T,
                                    { class: "py-0" },
                                    {
                                      default: l(() => [
                                        e(ne, null, {
                                          default: l(() => [w(y(a(r)("SetMediaServer.Editor.authInfo")), 1)]),
                                          _: 1,
                                        }),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                  (p(!0),
                                  A(
                                    z,
                                    null,
                                    R(
                                      a(f).auth_field,
                                      (n, M) => (
                                        p(),
                                        g(
                                          T,
                                          { key: M, cols: "12" },
                                          {
                                            default: l(() => [
                                              typeof n == "string"
                                                ? (p(),
                                                  g(
                                                    x,
                                                    {
                                                      key: 0,
                                                      modelValue: t.value.auth[n],
                                                      "onUpdate:modelValue": (b) => (t.value.auth[n] = b),
                                                      label: n,
                                                      rules: [a(_).require()],
                                                      "hide-details": "",
                                                      required: "",
                                                    },
                                                    null,
                                                    8,
                                                    ["modelValue", "onUpdate:modelValue", "label", "rules"],
                                                  ))
                                                : (p(),
                                                  g(
                                                    x,
                                                    {
                                                      key: 1,
                                                      modelValue: t.value.auth[n.name],
                                                      "onUpdate:modelValue": (b) => (t.value.auth[n.name] = b),
                                                      label: n.name,
                                                      messages: n.message ?? "",
                                                      rules: n.required ? [a(_).require()] : [],
                                                      required: "",
                                                    },
                                                    null,
                                                    8,
                                                    ["modelValue", "onUpdate:modelValue", "label", "messages", "rules"],
                                                  )),
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
                              }),
                              e(I, null, {
                                default: l(() => [
                                  e(
                                    de,
                                    {
                                      modelValue: t.value.timeout,
                                      "onUpdate:modelValue": o[5] || (o[5] = (n) => (t.value.timeout = n)),
                                      color:
                                        t.value.timeout > 8 * 6e4
                                          ? "red"
                                          : t.value.timeout > 5 * 6e4
                                            ? "amber"
                                            : "green",
                                      label: a(r)("SetDownloader.editor.timeout"),
                                      max: 10 * 6e4,
                                      min: 0,
                                      step: 1e3,
                                      class: "px-2",
                                    },
                                    {
                                      append: l(() => [
                                        e(
                                          k,
                                          { variant: "flat", onClick: o[4] || (o[4] = (n) => (t.value.timeout = 6e4)) },
                                          { default: l(() => [w(y(a(Ve)(t.value.timeout, "mm:ss")), 1)]), _: 1 },
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["modelValue", "color", "label"],
                                  ),
                                ]),
                                _: 1,
                              }),
                              e(be, {
                                "check-fn": D,
                                "reset-timeout": 3e3,
                                "onAfter:checkConnect": o[6] || (o[6] = () => c("update:configValid", m.value && !0)),
                              }),
                              a(f)?.warning
                                ? (p(),
                                  g(
                                    ae,
                                    { key: 0, color: "warning" },
                                    {
                                      default: l(() => [
                                        ee("ul", null, [
                                          (p(!0),
                                          A(
                                            z,
                                            null,
                                            R(a(f).warning, (n, M) => (p(), A("li", { key: M }, "● " + y(n), 1))),
                                            128,
                                          )),
                                        ]),
                                      ]),
                                      _: 1,
                                    },
                                  ))
                                : U("", !0),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["modelValue"],
                  ))
                : U("", !0),
            ]),
            _: 1,
          },
        )
      );
    },
  }),
  De = q({
    __name: "AddDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(C) {
      const i = j(C, "modelValue"),
        { t: r } = E(),
        t = F(),
        c = S(0),
        f = S(null),
        m = S({}),
        D = S(!1);
      function v() {
        ((c.value = 0), (f.value = null), (m.value = {}), (D.value = !1));
      }
      const o = h(async () => {
        const b = {};
        for (const u of ve) b[u] = { type: u, ...(await Z(u)) };
        return b;
      }, {});
      async function n(b) {
        ((m.value = { ...(await ce(b)), enabled: !0, id: fe() }), console.log("storedDownloaderConfig", m.value));
      }
      async function M() {
        (await t.addMediaServer(m.value), (i.value = !1));
      }
      return (b, u) => (
        p(),
        g(
          Y,
          {
            modelValue: i.value,
            "onUpdate:modelValue": u[9] || (u[9] = (d) => (i.value = d)),
            "max-width": "800",
            scrollable: "",
            onAfterLeave: v,
          },
          {
            default: l(() => [
              e(N, null, {
                default: l(() => [
                  e(
                    P,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          J,
                          { color: "blue-grey-darken-2" },
                          {
                            append: l(() => [
                              e(
                                k,
                                {
                                  icon: "mdi-close",
                                  title: a(r)("common.dialog.close"),
                                  onClick: u[0] || (u[0] = (d) => (i.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: l(() => [
                              e(O, null, { default: l(() => [w(y(a(r)("SetMediaServer.add.title")), 1)]), _: 1 }),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  e(B),
                  e(Q, null, {
                    default: l(() => [
                      e(
                        Se,
                        { modelValue: c.value, "onUpdate:modelValue": u[5] || (u[5] = (d) => (c.value = d)) },
                        {
                          default: l(() => [
                            e(
                              W,
                              { value: 0 },
                              {
                                default: l(() => [
                                  e(
                                    ye,
                                    {
                                      modelValue: f.value,
                                      "onUpdate:modelValue": [
                                        u[1] || (u[1] = (d) => (f.value = d)),
                                        u[2] || (u[2] = (d) => n(d)),
                                      ],
                                      "filter-keys": ["raw.type"],
                                      hint: a(o)[f.value]?.description ?? a(r)("SetDownloader.add.NoneSelectNotice"),
                                      items: Object.values(a(o)),
                                      multiple: !1,
                                      placeholder: a(r)("SetDownloader.add.selectPlaceholder"),
                                      "item-title": "type",
                                      "item-value": "type",
                                      "persistent-hint": "",
                                    },
                                    {
                                      selection: l(({ item: { raw: d } }) => [
                                        e(H, { "prepend-avatar": a(L)(d.type), title: d.type }, null, 8, [
                                          "prepend-avatar",
                                          "title",
                                        ]),
                                      ]),
                                      item: l(({ props: d, item: { raw: V } }) => [
                                        e(H, pe(d, { "prepend-avatar": a(L)(V.type), title: V.type }), null, 16, [
                                          "prepend-avatar",
                                          "title",
                                        ]),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["modelValue", "hint", "items", "placeholder"],
                                  ),
                                ]),
                                _: 1,
                              },
                            ),
                            e(
                              W,
                              { value: 1 },
                              {
                                default: l(() => [
                                  m.value.type
                                    ? (p(),
                                      g(
                                        te,
                                        {
                                          key: 0,
                                          modelValue: m.value,
                                          "onUpdate:modelValue": u[3] || (u[3] = (d) => (m.value = d)),
                                          "onUpdate:configValid": u[4] || (u[4] = (d) => (D.value = d)),
                                        },
                                        null,
                                        8,
                                        ["modelValue"],
                                      ))
                                    : U("", !0),
                                ]),
                                _: 1,
                              },
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
                  e(B),
                  e(X, null, {
                    default: l(() => [
                      e(K),
                      e(
                        k,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: u[6] || (u[6] = (d) => (i.value = !1)),
                        },
                        { default: l(() => [w(y(a(r)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      c.value === 1
                        ? (p(),
                          g(
                            k,
                            {
                              key: 0,
                              color: "blue-darken-1",
                              "prepend-icon": "mdi-chevron-left",
                              variant: "text",
                              onClick: u[7] || (u[7] = (d) => c.value--),
                            },
                            { default: l(() => [w(y(a(r)("common.dialog.prev")), 1)]), _: 1 },
                          ))
                        : U("", !0),
                      c.value === 0
                        ? (p(),
                          g(
                            k,
                            {
                              key: 1,
                              disabled: f.value == null,
                              "append-icon": "mdi-chevron-right",
                              color: "blue-darken-1",
                              variant: "text",
                              onClick: u[8] || (u[8] = (d) => c.value++),
                            },
                            { default: l(() => [w(y(a(r)("common.dialog.next")), 1)]), _: 1 },
                            8,
                            ["disabled"],
                          ))
                        : U("", !0),
                      c.value === 1
                        ? (p(),
                          g(
                            k,
                            {
                              key: 2,
                              disabled: !D.value,
                              color: "success",
                              "prepend-icon": "mdi-check-circle-outline",
                              variant: "text",
                              onClick: M,
                            },
                            { default: l(() => [w(y(a(r)("common.dialog.ok")), 1)]), _: 1 },
                            8,
                            ["disabled"],
                          ))
                        : U("", !0),
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
  Me = q({
    __name: "EditDialog",
    props: le({ clientId: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(C) {
      const i = j(C, "modelValue"),
        r = S(),
        { t } = E(),
        c = F();
      function f() {
        C.clientId && (r.value = { ...c.mediaServers[C.clientId] });
      }
      function m() {
        (c.addMediaServer(r.value), (i.value = !1));
      }
      return (D, v) => (
        p(),
        g(
          Y,
          {
            modelValue: i.value,
            "onUpdate:modelValue": v[3] || (v[3] = (o) => (i.value = o)),
            "max-width": "800",
            scrollable: "",
            onAfterEnter: f,
          },
          {
            default: l(() => [
              e(N, null, {
                default: l(() => [
                  e(
                    P,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          J,
                          { color: "blue-grey-darken-2" },
                          {
                            append: l(() => [
                              e(
                                k,
                                {
                                  icon: "mdi-close",
                                  title: a(t)("common.dialog.close"),
                                  onClick: v[0] || (v[0] = (o) => (i.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: l(() => [
                              e(O, null, { default: l(() => [w(y(a(t)("SetDownloader.edit.title")), 1)]), _: 1 }),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  e(B),
                  e(Q, null, {
                    default: l(() => [
                      e(
                        te,
                        { modelValue: r.value, "onUpdate:modelValue": v[1] || (v[1] = (o) => (r.value = o)) },
                        null,
                        8,
                        ["modelValue"],
                      ),
                    ]),
                    _: 1,
                  }),
                  e(B),
                  e(X, null, {
                    default: l(() => [
                      e(K),
                      e(
                        k,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: v[2] || (v[2] = (o) => (i.value = !1)),
                        },
                        { default: l(() => [w(y(a(t)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      e(
                        k,
                        { color: "success", "prepend-icon": "mdi-check-circle-outline", variant: "text", onClick: m },
                        { default: l(() => [w(y(a(t)("common.dialog.ok")), 1)]), _: 1 },
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
  xe = ["href"],
  Ge = q({
    __name: "Index",
    setup(C) {
      const { t: i } = E(),
        r = re(),
        t = F(),
        c = S(!1),
        f = S(!1),
        m = S(!1),
        D = [
          { title: i("common.type"), key: "type", align: "center" },
          { title: i("SetDownloader.common.name"), key: "name", align: "start" },
          { title: i("SetDownloader.common.address"), key: "address", align: "start" },
          { title: i("SetDownloader.index.table.enabled"), key: "enabled", align: "center" },
          { title: i("common.action"), key: "action", sortable: !1 },
        ],
        v = S([]),
        o = S(null);
      function n(d) {
        ((o.value = d), (f.value = !0));
      }
      const M = S([]);
      function b(d) {
        ((M.value = d), (m.value = !0));
      }
      async function u(d) {
        return await t.removeMediaServer(d);
      }
      return (d, V) => (
        p(),
        A(
          z,
          null,
          [
            e(ae, { title: a(i)("route.Settings.SetMediaServer"), type: "info" }, null, 8, ["title"]),
            e(
              N,
              { class: "set-media-server" },
              {
                default: l(() => [
                  e(P, null, {
                    default: l(() => [
                      e(
                        I,
                        { class: "ma-0" },
                        {
                          default: l(() => [
                            e(
                              G,
                              {
                                text: a(i)("common.btn.add"),
                                color: "success",
                                icon: "mdi-plus",
                                onClick: V[0] || (V[0] = (s) => (c.value = !0)),
                              },
                              null,
                              8,
                              ["text"],
                            ),
                            e(
                              G,
                              {
                                disabled: v.value.length === 0,
                                text: a(i)("common.remove"),
                                color: "error",
                                icon: "mdi-minus",
                                onClick: V[1] || (V[1] = (s) => b(v.value)),
                              },
                              null,
                              8,
                              ["disabled", "text"],
                            ),
                          ]),
                          _: 1,
                        },
                      ),
                    ]),
                    _: 1,
                  }),
                  e(
                    we,
                    {
                      modelValue: v.value,
                      "onUpdate:modelValue": V[2] || (V[2] = (s) => (v.value = s)),
                      headers: D,
                      items: a(t).getMediaServers,
                      class: "table-stripe table-header-no-wrap",
                      hover: "",
                      "item-value": "id",
                      "multi-sort": a(r).enableTableMultiSort,
                      "show-select": "",
                    },
                    {
                      "item.type": l(({ item: s }) => [
                        e(se, { image: a(L)(s.type), alt: s.type }, null, 8, ["image", "alt"]),
                      ]),
                      "item.address": l(({ item: s }) => [
                        ee(
                          "a",
                          {
                            href: s.address,
                            class: "text-primary font-weight-medium text-decoration-underline",
                            rel: "noopener noreferrer nofollow",
                            target: "_blank",
                          },
                          [w(y(s.address) + " ", 1), e(ie, { icon: "mdi-open-in-new", size: "x-small" })],
                          8,
                          xe,
                        ),
                      ]),
                      "item.enabled": l(({ item: s }) => [
                        e(
                          Ce,
                          {
                            modelValue: s.enabled,
                            "onUpdate:modelValue": [
                              ($) => (s.enabled = $),
                              ($) => a(t).simplePatch("mediaServers", s.id, "enabled", $),
                            ],
                            class: "table-switch-btn",
                            color: "success",
                            "hide-details": "",
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue"],
                        ),
                      ]),
                      "item.action": l(({ item: s }) => [
                        e(
                          ue,
                          { class: "table-action", density: "compact", variant: "plain" },
                          {
                            default: l(() => [
                              e(
                                k,
                                {
                                  title: a(i)("common.edit"),
                                  color: "info",
                                  icon: "mdi-pencil",
                                  size: "small",
                                  onClick: ($) => n(s.id),
                                },
                                null,
                                8,
                                ["title", "onClick"],
                              ),
                              e(
                                k,
                                {
                                  title: a(i)("common.remove"),
                                  color: "error",
                                  icon: "mdi-delete",
                                  size: "small",
                                  onClick: ($) => b([s.id]),
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
                    ["modelValue", "items", "multi-sort"],
                  ),
                  e(
                    De,
                    { modelValue: c.value, "onUpdate:modelValue": V[3] || (V[3] = (s) => (c.value = s)) },
                    null,
                    8,
                    ["modelValue"],
                  ),
                  e(
                    Me,
                    {
                      modelValue: f.value,
                      "onUpdate:modelValue": V[4] || (V[4] = (s) => (f.value = s)),
                      "client-id": o.value,
                    },
                    null,
                    8,
                    ["modelValue", "client-id"],
                  ),
                  e(
                    ke,
                    {
                      modelValue: m.value,
                      "onUpdate:modelValue": V[5] || (V[5] = (s) => (m.value = s)),
                      "to-delete-ids": M.value,
                      "confirm-delete": u,
                    },
                    null,
                    8,
                    ["modelValue", "to-delete-ids"],
                  ),
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
export { Ge as default };
