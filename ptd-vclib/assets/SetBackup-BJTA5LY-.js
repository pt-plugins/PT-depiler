import {
  bN as O,
  f as K,
  p as Pe,
  A as me,
  T as W,
  n as F,
  a3 as _,
  bV as ve,
  s as se,
  j as X,
  a4 as re,
  a5 as ie,
  a2 as q,
  c as D,
  t as H,
  i as de,
  C as be,
  g as fe,
  cd as Fe,
  x as _e,
  bz as Oe,
  c2 as ge,
  c0 as Ke,
  l as Be,
  d as we,
  m as je,
  V as We,
} from "./src/entries/options/index-DmNe5UVo.js";
import { g as qe, c as De, b as Ve, a as Ye, e as Ge } from "../vendor/packages/backupServer/index-D5lXNMXT.js";
import { a as Je, b as xe, e as Qe } from "./utils-DF6YUpNn.js";
import {
  X as j,
  cb as Z,
  E as Ce,
  I as x,
  ck as l,
  U as e,
  Q as w,
  bS as V,
  c4 as a,
  L as A,
  bu as Y,
  F as T,
  J as E,
  a$ as ke,
  br as k,
  bj as f,
  e as Se,
  b0 as Xe,
  cl as Ze,
  H as pe,
  b1 as el,
  bC as G,
  aE as ll,
  bJ as ye,
} from "../vendor/packages/site/index-COeZNva1.js";
import { N as ne } from "./NavButton-jVIhOejA.js";
import { _ as Ue } from "./DeleteDialog.vue_vue_type_script_setup_true_lang-CkaHuNvW.js";
import { _ as al } from "./ConnectCheckButton.vue_vue_type_script_setup_true_lang-B58MRE7r.js";
import { V as tl } from "../vendor/vuetify/VForm-CJoKT4R8.js";
import { V as ol } from "../vendor/vuetify/VTextarea-hZu3Ftop.js";
import { V as J } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { V as Me, a as ue } from "../vendor/vuetify/VWindowItem-CGCDkWEG.js";
import { V as nl } from "../vendor/vuetify/VAutocomplete-DUqyo09O.js";
import { j as ul } from "../vendor/packages/backupServer/utils-BmKctBTI.js";
import { V as Ie } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as sl } from "../vendor/vuetify/VFileInput-rB5Lk1yB.js";
import { V as rl } from "../vendor/vuetify/VNumberInput-ZpDwJV6p.js";
import { V as Re } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/jszip/jszip.min-DP3ssR4z.js";
import "./_commonjs-dynamic-modules-TDtrdbi3.js";
import "../vendor/crypto-js/index-B0NDMIdm.js";
import "./___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../vendor/es-toolkit/omit-BqXgNNTz.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
const Q = ["cookies", "config", "metadata", "userInfo", "searchResultSnapshot", "downloadHistory"],
  $e = j({
    __name: "Editor",
    props: { modelValue: {}, modelModifiers: {} },
    emits: ke(["update:configValid"], ["update:modelValue"]),
    setup(b, { emit: s }) {
      const { t } = O(),
        i = Z(b, "modelValue"),
        v = s,
        S = Ce(
          async () => {
            const u = i.value?.type;
            return u ? await De(u) : { requiredField: [] };
          },
          { requiredField: [] },
        ),
        p = k(!1);
      async function g() {
        const u = i.value?.type;
        return p.value && i.value && u ? await (await qe(i.value)).ping() : !1;
      }
      return (u, r) => (
        f(),
        x(
          K,
          { class: "mb-5" },
          {
            default: l(() => [
              i.value
                ? (f(),
                  x(
                    tl,
                    {
                      key: 0,
                      modelValue: p.value,
                      "onUpdate:modelValue": r[5] || (r[5] = (d) => (p.value = d)),
                      "fast-fail": "",
                    },
                    {
                      default: l(() => [
                        e(
                          Pe,
                          { class: "pa-0" },
                          {
                            default: l(() => [
                              e(me, { class: "my-2" }, { default: l(() => [w(V(a(t)("common.basicInfo")), 1)]), _: 1 }),
                              e(W, null, {
                                default: l(() => [
                                  e(
                                    F,
                                    { cols: "12", md: "4" },
                                    {
                                      default: l(() => [
                                        e(
                                          _,
                                          {
                                            modelValue: i.value.type,
                                            "onUpdate:modelValue": r[0] || (r[0] = (d) => (i.value.type = d)),
                                            label: a(t)("common.type"),
                                            disabled: "",
                                            "hide-details": "",
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
                                    F,
                                    { cols: "12", md: "4" },
                                    {
                                      default: l(() => [
                                        e(
                                          _,
                                          {
                                            modelValue: i.value.name,
                                            "onUpdate:modelValue": r[1] || (r[1] = (d) => (i.value.name = d)),
                                            label: a(t)("SetDownloader.common.name"),
                                            placeholder: a(t)("SetDownloader.common.name"),
                                            rules: [a(Je).require(a(t)("SetDownloader.editor.nameTip"))],
                                            "hide-details": "",
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
                                    F,
                                    { cols: "12", md: "4" },
                                    {
                                      default: l(() => [
                                        e(
                                          _,
                                          {
                                            modelValue: i.value.id,
                                            "onUpdate:modelValue": r[2] || (r[2] = (d) => (i.value.id = d)),
                                            label:
                                              a(t)("SetDownloader.common.uid") +
                                              a(t)("SetDownloader.editor.uidPlaceholder"),
                                            disabled: "",
                                            "hide-details": "",
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
                                me,
                                { class: "my-2" },
                                { default: l(() => [w(V(a(t)("SetBackup.Editor.serverConfig")), 1)]), _: 1 },
                              ),
                              e(
                                W,
                                { "no-gutters": "" },
                                {
                                  default: l(() => [
                                    (f(!0),
                                    A(
                                      T,
                                      null,
                                      Y(
                                        a(S).requiredField,
                                        (d) => (
                                          f(),
                                          x(
                                            F,
                                            { key: d.key, class: "my-1", cols: "12" },
                                            {
                                              default: l(() => [
                                                d.type === "strings"
                                                  ? (f(),
                                                    x(
                                                      ol,
                                                      {
                                                        key: 0,
                                                        modelValue: i.value.config[d.key],
                                                        "onUpdate:modelValue": (M) => (i.value.config[d.key] = M),
                                                        "hide-details": !1,
                                                        label: d.name,
                                                        messages: d.description ?? void 0,
                                                      },
                                                      null,
                                                      8,
                                                      ["modelValue", "onUpdate:modelValue", "label", "messages"],
                                                    ))
                                                  : d.type === "string"
                                                    ? (f(),
                                                      x(
                                                        _,
                                                        {
                                                          key: 1,
                                                          modelValue: i.value.config[d.key],
                                                          "onUpdate:modelValue": (M) => (i.value.config[d.key] = M),
                                                          "hide-details": !1,
                                                          label: d.name,
                                                          messages: d.description ?? void 0,
                                                        },
                                                        null,
                                                        8,
                                                        ["modelValue", "onUpdate:modelValue", "label", "messages"],
                                                      ))
                                                    : d.type === "boolean"
                                                      ? (f(),
                                                        x(
                                                          J,
                                                          {
                                                            key: 2,
                                                            modelValue: i.value.config[d.key],
                                                            "onUpdate:modelValue": (M) => (i.value.config[d.key] = M),
                                                            "hide-details": !1,
                                                            label: d.name,
                                                            messages: d.description ?? void 0,
                                                            color: "success",
                                                          },
                                                          null,
                                                          8,
                                                          ["modelValue", "onUpdate:modelValue", "label", "messages"],
                                                        ))
                                                      : E("", !0),
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
                              ),
                              e(
                                me,
                                { class: "my-2" },
                                { default: l(() => [w(V(a(t)("SetBackup.Editor.backupConfig")), 1)]), _: 1 },
                              ),
                              e(
                                W,
                                { "no-gutters": "" },
                                {
                                  default: l(() => [
                                    (f(!0),
                                    A(
                                      T,
                                      null,
                                      Y(
                                        a(Q),
                                        (d) => (
                                          f(),
                                          x(
                                            F,
                                            { key: d, cols: "12", md: "4" },
                                            {
                                              default: l(() => [
                                                e(
                                                  J,
                                                  {
                                                    modelValue: i.value.backupFields,
                                                    "onUpdate:modelValue":
                                                      r[3] || (r[3] = (M) => (i.value.backupFields = M)),
                                                    label: d,
                                                    value: d,
                                                    color: "success",
                                                    "hide-details": "",
                                                  },
                                                  null,
                                                  8,
                                                  ["modelValue", "label", "value"],
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
                              ),
                              e(al, {
                                "check-fn": g,
                                "reset-timeout": 3e3,
                                "onAfter:checkConnect": r[4] || (r[4] = () => v("update:configValid", p.value && !0)),
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
                  ))
                : E("", !0),
            ]),
            _: 1,
          },
        )
      );
    },
  }),
  il = { class: "ml-1" },
  dl = j({
    __name: "AddDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(b) {
      const s = Z(b, "modelValue"),
        { t } = O(),
        i = ve(),
        v = k(0),
        S = k(null),
        p = k({}),
        g = k(!1),
        u = Ce(async () => {
          const $ = {};
          for (const c of Ge) $[c] = { type: c, ...(await De(c)) };
          return $;
        }, {});
      async function r($) {
        ((p.value = { ...(await Ye($)), enabled: !0, id: el(), backupFields: [...Q] }),
          console.log("storedBackupServerConfig", p.value));
      }
      async function d() {
        (await i.addBackupServer(p.value), (s.value = !1));
      }
      function M() {
        ((v.value = 0), (S.value = null), (p.value = {}), (g.value = !1));
      }
      return ($, c) => (
        f(),
        x(
          se,
          {
            modelValue: s.value,
            "onUpdate:modelValue": c[8] || (c[8] = (y) => (s.value = y)),
            "max-width": "800",
            scrollable: "",
            onAfterLeave: M,
          },
          {
            default: l(() => [
              e(K, null, {
                default: l(() => [
                  e(
                    X,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          re,
                          { color: "blue-grey-darken-2" },
                          {
                            default: l(() => [
                              e(ie, null, { default: l(() => [w(V(a(t)("SetBackup.AddDialog.title")), 1)]), _: 1 }),
                              e(q),
                              e(
                                D,
                                {
                                  title: a(t)("layout.header.wiki"),
                                  href: `${a(Se)}/wiki/config-backup-server`,
                                  color: "success",
                                  icon: "mdi-help-circle",
                                  rel: "noopener noreferrer nofollow",
                                  target: "_blank",
                                },
                                null,
                                8,
                                ["title", "href"],
                              ),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  e(H),
                  e(de, null, {
                    default: l(() => [
                      e(
                        Me,
                        { modelValue: v.value, "onUpdate:modelValue": c[4] || (c[4] = (y) => (v.value = y)) },
                        {
                          default: l(() => [
                            e(
                              ue,
                              { value: 0 },
                              {
                                default: l(() => [
                                  e(
                                    nl,
                                    {
                                      modelValue: S.value,
                                      "onUpdate:modelValue": [
                                        c[0] || (c[0] = (y) => (S.value = y)),
                                        c[1] || (c[1] = (y) => r(y)),
                                      ],
                                      items: Object.values(a(u)),
                                      "item-value": "type",
                                      "item-title": "type",
                                      multiple: !1,
                                      "persistent-hint": "",
                                      hint: a(u)[S.value]?.description ?? a(t)("SetDownloader.add.NoneSelectNotice"),
                                    },
                                    {
                                      selection: l(({ item: { raw: y } }) => [
                                        e(be, { "prepend-avatar": a(Ve)(y.type), title: y.type }, null, 8, [
                                          "prepend-avatar",
                                          "title",
                                        ]),
                                      ]),
                                      item: l(({ props: y, item: { raw: h } }) => [
                                        e(be, Xe(y, { "prepend-avatar": a(Ve)(h.type), title: h.type }), null, 16, [
                                          "prepend-avatar",
                                          "title",
                                        ]),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["modelValue", "items", "hint"],
                                  ),
                                ]),
                                _: 1,
                              },
                            ),
                            e(
                              ue,
                              { value: 1 },
                              {
                                default: l(() => [
                                  p.value.type
                                    ? (f(),
                                      x(
                                        $e,
                                        {
                                          key: 0,
                                          modelValue: p.value,
                                          "onUpdate:modelValue": c[2] || (c[2] = (y) => (p.value = y)),
                                          "onUpdate:configValid": c[3] || (c[3] = (y) => (g.value = y)),
                                        },
                                        null,
                                        8,
                                        ["modelValue"],
                                      ))
                                    : E("", !0),
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
                  e(H),
                  e(fe, null, {
                    default: l(() => [
                      Ze(
                        e(
                          D,
                          {
                            href: `${a(Se)}/tree/master/src/packages/backupServer`,
                            color: "grey-darken-1",
                            flat: "",
                            rel: "noopener noreferrer nofollow",
                            target: "_blank",
                          },
                          {
                            default: l(() => [
                              e(_e, { icon: "mdi-help-circle" }),
                              pe("span", il, V(a(t)("SetDownloader.add.newType")), 1),
                            ]),
                            _: 1,
                          },
                          8,
                          ["href"],
                        ),
                        [[Fe, v.value === 0]],
                      ),
                      e(q),
                      e(
                        D,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: c[5] || (c[5] = (y) => (s.value = !1)),
                        },
                        { default: l(() => [w(V(a(t)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      v.value === 1
                        ? (f(),
                          x(
                            D,
                            {
                              key: 0,
                              color: "blue-darken-1",
                              "prepend-icon": "mdi-chevron-left",
                              variant: "text",
                              onClick: c[6] || (c[6] = (y) => v.value--),
                            },
                            { default: l(() => [w(V(a(t)("common.dialog.prev")), 1)]), _: 1 },
                          ))
                        : E("", !0),
                      v.value === 0
                        ? (f(),
                          x(
                            D,
                            {
                              key: 1,
                              disabled: S.value == null,
                              "append-icon": "mdi-chevron-right",
                              color: "blue-darken-1",
                              variant: "text",
                              onClick: c[7] || (c[7] = (y) => v.value++),
                            },
                            { default: l(() => [w(V(a(t)("common.dialog.next")), 1)]), _: 1 },
                            8,
                            ["disabled"],
                          ))
                        : E("", !0),
                      v.value === 1
                        ? (f(),
                          x(
                            D,
                            {
                              key: 2,
                              disabled: !g.value,
                              color: "success",
                              "prepend-icon": "mdi-check-circle-outline",
                              variant: "text",
                              onClick: d,
                            },
                            { default: l(() => [w(V(a(t)("common.dialog.ok")), 1)]), _: 1 },
                            8,
                            ["disabled"],
                          ))
                        : E("", !0),
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
  cl = j({
    __name: "EditDialog",
    props: ke({ clientId: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(b) {
      const s = Z(b, "modelValue"),
        t = k(),
        { t: i } = O(),
        v = ve();
      function S() {
        b.clientId && (t.value = { ...v.backupServers[b.clientId] });
      }
      function p() {
        (v.addBackupServer(t.value), (s.value = !1));
      }
      return (g, u) => (
        f(),
        x(
          se,
          {
            modelValue: s.value,
            "onUpdate:modelValue": u[3] || (u[3] = (r) => (s.value = r)),
            "max-width": "800",
            scrollable: "",
            onAfterEnter: S,
          },
          {
            default: l(() => [
              e(K, null, {
                default: l(() => [
                  e(
                    X,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          re,
                          { color: "blue-grey-darken-2" },
                          {
                            append: l(() => [
                              e(
                                D,
                                {
                                  icon: "mdi-close",
                                  title: a(i)("common.dialog.close"),
                                  onClick: u[0] || (u[0] = (r) => (s.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: l(() => [
                              e(ie, null, { default: l(() => [w(V(a(i)("SetDownloader.edit.title")), 1)]), _: 1 }),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  e(H),
                  e(de, null, {
                    default: l(() => [
                      t.value
                        ? (f(),
                          x(
                            $e,
                            {
                              key: 0,
                              modelValue: t.value,
                              "onUpdate:modelValue": u[1] || (u[1] = (r) => (t.value = r)),
                            },
                            null,
                            8,
                            ["modelValue"],
                          ))
                        : E("", !0),
                    ]),
                    _: 1,
                  }),
                  e(H),
                  e(fe, null, {
                    default: l(() => [
                      e(q),
                      e(
                        D,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: u[2] || (u[2] = (r) => (s.value = !1)),
                        },
                        { default: l(() => [w(V(a(i)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      e(
                        D,
                        { color: "success", "prepend-icon": "mdi-check-circle-outline", variant: "text", onClick: p },
                        { default: l(() => [w(V(a(i)("common.dialog.ok")), 1)]), _: 1 },
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
  ml = j({
    __name: "LocalExportConfirmDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(b) {
      const s = Z(b, "modelValue"),
        { t } = O(),
        i = k([]);
      async function v() {
        await G("exportBackupData", { backupFields: i.value, backupServerId: "local" });
      }
      function S() {
        i.value = [...Q];
      }
      return (p, g) => (
        f(),
        x(
          se,
          {
            modelValue: s.value,
            "onUpdate:modelValue": g[3] || (g[3] = (u) => (s.value = u)),
            "max-width": "600",
            onAfterEnter: S,
          },
          {
            default: l(() => [
              e(K, null, {
                default: l(() => [
                  e(
                    X,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          re,
                          { color: "blue-grey-darken-2" },
                          {
                            default: l(() => [
                              e(ie, null, {
                                default: l(() => [w(V(a(t)("SetBackup.LocalExportConfirmDialog.title")), 1)]),
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
                  e(H),
                  e(de, null, {
                    default: l(() => [
                      e(
                        W,
                        { "no-gutters": "" },
                        {
                          default: l(() => [
                            (f(!0),
                            A(
                              T,
                              null,
                              Y(
                                a(Q),
                                (u) => (
                                  f(),
                                  x(
                                    F,
                                    { key: u, cols: "12", md: "6" },
                                    {
                                      default: l(() => [
                                        e(
                                          J,
                                          {
                                            modelValue: i.value,
                                            "onUpdate:modelValue": g[0] || (g[0] = (r) => (i.value = r)),
                                            label: u,
                                            value: u,
                                            color: "success",
                                            "hide-details": "",
                                          },
                                          null,
                                          8,
                                          ["modelValue", "label", "value"],
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
                      ),
                    ]),
                    _: 1,
                  }),
                  e(H),
                  e(fe, null, {
                    default: l(() => [
                      e(q),
                      e(
                        D,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: g[1] || (g[1] = (u) => (s.value = !1)),
                        },
                        { default: l(() => [w(V(a(t)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      e(
                        D,
                        {
                          color: "success",
                          "prepend-icon": "mdi-export",
                          variant: "text",
                          onClick: g[2] || (g[2] = () => v()),
                        },
                        { default: l(() => [w(V(a(t)("common.export")), 1)]), _: 1 },
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
  Ee = j({
    __name: "RestoreDialog",
    props: ke(
      { restoreMetadata: { default: () => ({ type: "file" }) } },
      { modelValue: { type: Boolean }, modelModifiers: {} },
    ),
    emits: ["update:modelValue"],
    setup(b) {
      const s = Z(b, "modelValue"),
        { t } = O(),
        i = Ke(),
        v = k("file"),
        S = k(""),
        p = k(!1),
        g = k(!0),
        u = ye(),
        r = k({ fields: [], expandCookieMinutes: 0, keepExistUserInfo: !0 }),
        d = Oe(),
        M = ge();
      function $() {
        ((r.value = {
          fields: [...Object.keys(u.value?.manifest?.files ?? {})],
          expandCookieMinutes: 0,
          keepExistUserInfo: !0,
        }),
          (v.value = "restore"));
      }
      const c = ye();
      function y() {
        ul(c.value, S.value)
          .then((o) => {
            ((u.value = o), (g.value = !0), $());
          })
          .catch((o) => {
            (console.error(o),
              (u.value = void 0),
              (g.value = !1),
              M.showSnakebar(t("SetBackup.RestoreDialog.loadFailure", { error: o }), { color: "error" }));
          });
      }
      const h = k(!1);
      function z() {
        b.restoreMetadata.type === "remote" &&
          ((h.value = !0),
          G("getRemoteBackupData", {
            backupServerId: b.restoreMetadata.server,
            path: b.restoreMetadata.path,
            decryptKey: S.value,
          })
            .then((o) => {
              ((u.value = o), $());
            })
            .catch((o) => {
              (M.showSnakebar(t("SetBackup.RestoreDialog.loadFailure", { error: o }), { color: "error" }),
                console.error(o),
                (g.value = !1));
            })
            .finally(() => {
              h.value = !1;
            }));
      }
      function L(o = "") {
        const n = /v(\d+\.\d+\.\d+\.\d+)/,
          m = o.match(n);
        return m ? m[1] : null;
      }
      function ee(o, n) {
        const m = L(o),
          N = L(n);
        if (!m || !N) return null;
        const le = m.split(".").map(Number),
          ae = N.split(".").map(Number),
          ce = Math.max(le.length, ae.length);
        for (let P = 0; P < ce; P++) {
          const te = le[P] || 0,
            oe = ae[P] || 0;
          if (te > oe) return 1;
          if (te < oe) return -1;
        }
        return 0;
      }
      const I = k(!1);
      function R() {
        if (((I.value = !0), !u.value?.manifest?.version)) {
          (M.showSnakebar(t("SetBackup.RestoreDialog.missingVersion"), { color: "error" }), (I.value = !1));
          return;
        }
        (!(ee(u.value.manifest.version, "v0.0.6.1740+c969e7b") == 1) ||
          confirm(t("SetBackup.RestoreDialog.versionWarning"))) &&
          G("restoreBackupData", { restoreData: u.value, restoreOptions: r.value })
            .then(() => {
              (M.showSnakebar(t("SetBackup.RestoreDialog.success"), { color: "success" }), (s.value = !1));
            })
            .catch((n) => {
              (M.showSnakebar(t("SetBackup.RestoreDialog.failure", { error: n }), { color: "error" }),
                console.error(n));
            })
            .finally(() => {
              I.value = !1;
            });
      }
      function C(o) {
        const n = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/,
          m = o.match(n);
        if (!m) throw new Error(`Invalid ISO 8601 duration format: ${o}`);
        const [, N, le, ae, ce, P, te, oe] = m,
          he = N ? parseInt(N, 10) * 365 * 24 * 60 : 0,
          He = le ? parseInt(le, 10) * 30 * 24 * 60 : 0,
          Ae = ae ? parseInt(ae, 10) * 7 * 24 * 60 : 0,
          Te = ce ? parseInt(ce, 10) * 24 * 60 : 0,
          ze = P ? parseInt(P, 10) * 60 : 0,
          Le = te ? parseInt(te, 10) : 0,
          Ne = oe ? parseInt(oe, 10) / 60 : 0;
        return he + He + Ae + Te + ze + Le + Ne;
      }
      function U() {
        ((v.value = b.restoreMetadata.type),
          (S.value = d.backup.encryptionKey ?? ""),
          (u.value = void 0),
          b.restoreMetadata.type === "file" ? (c.value = void 0) : b.restoreMetadata.type == "remote" && z());
      }
      function B() {
        (i.push({ name: "SetBaseBackup" }), (s.value = !1));
      }
      return (o, n) => (
        f(),
        x(
          se,
          {
            modelValue: s.value,
            "onUpdate:modelValue": n[12] || (n[12] = (m) => (s.value = m)),
            persistent: I.value,
            "max-width": "800",
            scrollable: "",
            onAfterEnter: U,
          },
          {
            default: l(() => [
              e(K, null, {
                default: l(() => [
                  e(
                    X,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          re,
                          { color: "blue-grey-darken-2" },
                          {
                            default: l(() => [
                              e(ie, null, { default: l(() => [w(V(a(t)("SetBackup.RestoreDialog.title")), 1)]), _: 1 }),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  e(H),
                  e(de, null, {
                    default: l(() => [
                      e(
                        Ie,
                        { class: "mb-3", type: "info", variant: "tonal" },
                        {
                          append: l(() => [
                            e(
                              D,
                              {
                                color: "primary",
                                size: "small",
                                variant: "outlined",
                                "prepend-icon": "mdi-import",
                                onClick: B,
                              },
                              { default: l(() => [w(V(a(t)("SetBackup.RestoreDialog.ptppImport")), 1)]), _: 1 },
                            ),
                          ]),
                          default: l(() => [pe("span", null, V(a(t)("SetBackup.RestoreDialog.ptppPrompt")), 1)]),
                          _: 1,
                        },
                      ),
                      e(
                        Me,
                        { modelValue: v.value, "onUpdate:modelValue": n[8] || (n[8] = (m) => (v.value = m)) },
                        {
                          default: l(() => [
                            e(
                              ue,
                              { value: "file", eager: "" },
                              {
                                default: l(() => [
                                  e(
                                    sl,
                                    {
                                      modelValue: c.value,
                                      "onUpdate:modelValue": [n[0] || (n[0] = (m) => (c.value = m)), y],
                                      accept: "application/zip",
                                      label: a(t)("SetBackup.RestoreDialog.selectFile"),
                                      placeholder: a(t)("SetBackup.RestoreDialog.selectFile"),
                                      "show-size": "",
                                    },
                                    null,
                                    8,
                                    ["modelValue", "label", "placeholder"],
                                  ),
                                  e(
                                    _,
                                    {
                                      modelValue: S.value,
                                      "onUpdate:modelValue": n[1] || (n[1] = (m) => (S.value = m)),
                                      "append-icon": p.value ? "mdi-eye" : "mdi-eye-off",
                                      type: p.value ? "text" : "password",
                                      label: a(t)("SetBackup.RestoreDialog.decryptKey"),
                                      "onClick:append": n[2] || (n[2] = (m) => (p.value = !p.value)),
                                    },
                                    null,
                                    8,
                                    ["modelValue", "append-icon", "type", "label"],
                                  ),
                                  g.value
                                    ? E("", !0)
                                    : (f(),
                                      x(
                                        D,
                                        {
                                          key: 0,
                                          disabled: !c.value,
                                          "prepend-icon": "mdi-cached",
                                          block: "",
                                          color: "warning",
                                          text: a(t)("SetBackup.RestoreDialog.retry"),
                                          onClick: y,
                                        },
                                        null,
                                        8,
                                        ["disabled", "text"],
                                      )),
                                ]),
                                _: 1,
                              },
                            ),
                            e(
                              ue,
                              { value: "remote", eager: "" },
                              {
                                default: l(() => [
                                  e(
                                    _,
                                    {
                                      modelValue: S.value,
                                      "onUpdate:modelValue": n[3] || (n[3] = (m) => (S.value = m)),
                                      "append-icon": p.value ? "mdi-eye" : "mdi-eye-off",
                                      type: p.value ? "text" : "password",
                                      label: a(t)("SetBackup.RestoreDialog.decryptKey"),
                                      "onClick:append": n[4] || (n[4] = (m) => (p.value = !p.value)),
                                    },
                                    null,
                                    8,
                                    ["modelValue", "append-icon", "type", "label"],
                                  ),
                                  g.value
                                    ? E("", !0)
                                    : (f(),
                                      x(
                                        D,
                                        {
                                          key: 0,
                                          loading: h.value,
                                          "prepend-icon": "mdi-cached",
                                          block: "",
                                          color: "warning",
                                          text: a(t)("SetBackup.RestoreDialog.retry"),
                                          onClick: z,
                                        },
                                        null,
                                        8,
                                        ["loading", "text"],
                                      )),
                                ]),
                                _: 1,
                              },
                            ),
                            e(
                              ue,
                              { value: "restore" },
                              {
                                default: l(() => [
                                  e(me, null, {
                                    default: l(() => [w(V(a(t)("SetBackup.RestoreDialog.restoreOptions")), 1)]),
                                    _: 1,
                                  }),
                                  e(
                                    W,
                                    { "no-gutters": "" },
                                    {
                                      default: l(() => [
                                        (f(!0),
                                        A(
                                          T,
                                          null,
                                          Y(
                                            a(Q),
                                            (m) => (
                                              f(),
                                              x(
                                                F,
                                                { key: m, cols: "12", md: "4" },
                                                {
                                                  default: l(() => [
                                                    e(
                                                      J,
                                                      {
                                                        modelValue: r.value.fields,
                                                        "onUpdate:modelValue":
                                                          n[5] || (n[5] = (N) => (r.value.fields = N)),
                                                        label: m,
                                                        value: m,
                                                        color: "success",
                                                        disabled: !u.value?.manifest?.files?.[m],
                                                        "hide-details": "",
                                                      },
                                                      null,
                                                      8,
                                                      ["modelValue", "label", "value", "disabled"],
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
                                  ),
                                  e(
                                    rl,
                                    {
                                      modelValue: r.value.expandCookieMinutes,
                                      "onUpdate:modelValue": n[6] || (n[6] = (m) => (r.value.expandCookieMinutes = m)),
                                      label: a(t)("SetBackup.RestoreDialog.expandCookieMinutes"),
                                      disabled: !r.value.fields?.includes("cookies"),
                                      "persistent-hint": "",
                                      min: 0,
                                      step: 1,
                                    },
                                    {
                                      details: l(() => [
                                        (f(),
                                        A(
                                          T,
                                          null,
                                          Y(["PT30M", "PT1H", "PT12H", "P1D", "P1W", "P1M", "P6M", "P1Y"], (m) =>
                                            e(
                                              Be,
                                              {
                                                key: m,
                                                class: "mr-1",
                                                size: "small",
                                                onClick: () => (r.value.expandCookieMinutes = C(m)),
                                              },
                                              { default: l(() => [w(V(m), 1)]), _: 2 },
                                              1032,
                                              ["onClick"],
                                            ),
                                          ),
                                          64,
                                        )),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["modelValue", "label", "disabled"],
                                  ),
                                  e(
                                    J,
                                    {
                                      modelValue: r.value.keepExistUserInfo,
                                      "onUpdate:modelValue": n[7] || (n[7] = (m) => (r.value.keepExistUserInfo = m)),
                                      color: "success",
                                      label: a(t)("SetBackup.RestoreDialog.keepExistUserInfo"),
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
                        },
                        8,
                        ["modelValue"],
                      ),
                    ]),
                    _: 1,
                  }),
                  e(H),
                  e(fe, null, {
                    default: l(() => [
                      e(q),
                      e(
                        D,
                        {
                          disabled: I.value,
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: n[9] || (n[9] = (m) => (s.value = !1)),
                        },
                        { default: l(() => [w(V(a(t)("common.dialog.cancel")), 1)]), _: 1 },
                        8,
                        ["disabled"],
                      ),
                      v.value == "restore"
                        ? (f(),
                          x(
                            D,
                            {
                              key: 0,
                              color: "blue-darken-1",
                              "prepend-icon": "mdi-chevron-left",
                              variant: "text",
                              onClick: n[10] || (n[10] = (m) => (v.value = b.restoreMetadata.type)),
                            },
                            { default: l(() => [w(V(a(t)("common.dialog.prev")), 1)]), _: 1 },
                          ))
                        : E("", !0),
                      v.value != "restore"
                        ? (f(),
                          x(
                            D,
                            {
                              key: 1,
                              disabled: a(ll)(u.value),
                              "append-icon": "mdi-chevron-right",
                              color: "blue-darken-1",
                              variant: "text",
                              onClick: n[11] || (n[11] = (m) => (v.value = "restore")),
                            },
                            { default: l(() => [w(V(a(t)("common.dialog.next")), 1)]), _: 1 },
                            8,
                            ["disabled"],
                          ))
                        : E("", !0),
                      v.value == "restore"
                        ? (f(),
                          x(
                            D,
                            {
                              key: 2,
                              loading: I.value,
                              color: "success",
                              "prepend-icon": "mdi-import",
                              variant: "text",
                              onClick: R,
                            },
                            { default: l(() => [w(V(a(t)("common.dialog.ok")), 1)]), _: 1 },
                            8,
                            ["loading"],
                          ))
                        : E("", !0),
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
          ["modelValue", "persistent"],
        )
      );
    },
  }),
  pl = { class: "text-no-wrap" },
  vl = { class: "text-no-wrap" },
  fl = j({
    __name: "HistoryDialog",
    props: ke({ backupServerId: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(b) {
      const s = Z(b, "modelValue"),
        { t } = O(),
        i = ve(),
        v = ge(),
        S = k(!1),
        p = ye([]),
        g = [
          { title: t("SetBackup.HistoryDialog.table.filename"), key: "filename", align: "start" },
          { title: t("SetBackup.HistoryDialog.table.size"), key: "size", align: "end" },
          { title: t("SetBackup.HistoryDialog.table.time"), key: "time", align: "start" },
          { title: t("common.action"), key: "action", sortable: !1 },
        ],
        u = k([]),
        r = k(!1),
        d = k({ type: "remote", server: "", path: "" });
      function M(I) {
        ((d.value = { type: "remote", server: b.backupServerId, path: I }), (r.value = !0));
      }
      const $ = k(!1),
        c = k([]);
      async function y(I) {
        (($.value = !0), (c.value = I));
      }
      async function h(I) {
        const R = p.value.find((U) => U.path === I)?.filename ?? I;
        (await G("deleteBackupHistory", { path: I, backupServerId: b.backupServerId }))
          ? (v.showSnakebar(t("SetBackup.HistoryDialog.deleteSuccess", { name: R }), { color: "success" }),
            (p.value = p.value.filter((U) => U.path !== I)))
          : v.showSnakebar(t("SetBackup.HistoryDialog.deleteFailure", { name: R }), { color: "error" });
      }
      async function z() {
        S.value = !0;
        try {
          p.value = await G("getBackupHistory", b.backupServerId);
        } catch (I) {
          console.error("获取备份历史失败", I);
        } finally {
          S.value = !1;
        }
      }
      async function L() {
        z();
      }
      async function ee() {
        ((p.value = []), (u.value = []));
      }
      return (I, R) => (
        f(),
        A(
          T,
          null,
          [
            e(
              se,
              {
                modelValue: s.value,
                "onUpdate:modelValue": R[3] || (R[3] = (C) => (s.value = C)),
                "max-width": "1000",
                onAfterEnter: L,
                onAfterLeave: ee,
              },
              {
                default: l(() => [
                  e(K, null, {
                    default: l(() => [
                      e(
                        X,
                        { class: "pa-0" },
                        {
                          default: l(() => [
                            e(
                              re,
                              { color: "blue-grey-darken-2" },
                              {
                                append: l(() => [
                                  e(
                                    D,
                                    {
                                      icon: "mdi-close",
                                      title: a(t)("common.dialog.close"),
                                      onClick: R[0] || (R[0] = (C) => (s.value = !1)),
                                    },
                                    null,
                                    8,
                                    ["title"],
                                  ),
                                ]),
                                default: l(() => [
                                  e(ie, null, {
                                    default: l(() => [
                                      w(
                                        V(
                                          a(t)("SetBackup.HistoryDialog.title", {
                                            name: a(i).backupServers[b.backupServerId].name ?? b.backupServerId,
                                          }),
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
                          ]),
                          _: 1,
                        },
                      ),
                      e(H),
                      e(de, null, {
                        default: l(() => [
                          e(
                            ne,
                            {
                              disabled: u.value.length === 0,
                              text: a(t)("common.remove"),
                              color: "error",
                              icon: "mdi-delete",
                              onClick: R[1] || (R[1] = (C) => y(u.value)),
                            },
                            null,
                            8,
                            ["disabled", "text"],
                          ),
                          e(
                            Re,
                            {
                              modelValue: u.value,
                              "onUpdate:modelValue": R[2] || (R[2] = (C) => (u.value = C)),
                              headers: g,
                              items: p.value,
                              "sort-by": [{ key: "time", order: "desc" }],
                              class: "table-header-no-wrap table-stripe",
                              "item-value": "path",
                              "must-sort": "",
                              "show-select": "",
                            },
                            {
                              "item.size": l(({ item: C }) => [
                                pe("span", pl, V(C.size !== "N/A" ? a(Qe)(C.size) : C.size), 1),
                              ]),
                              "item.time": l(({ item: C }) => [pe("span", vl, V(a(xe)(C.time)), 1)]),
                              "item.action": l(({ item: C }) => [
                                e(
                                  we,
                                  { class: "table-action", density: "compact", variant: "plain" },
                                  {
                                    default: l(() => [
                                      e(
                                        D,
                                        {
                                          title: a(t)("SetBackup.HistoryDialog.restore"),
                                          color: "blue",
                                          icon: "mdi-cloud-download",
                                          size: "small",
                                          onClick: (U) => M(C.path),
                                        },
                                        null,
                                        8,
                                        ["title", "onClick"],
                                      ),
                                      e(
                                        D,
                                        {
                                          title: a(t)("common.remove"),
                                          color: "error",
                                          icon: "mdi-delete",
                                          size: "small",
                                          onClick: (U) => y([C.path]),
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
                            ["modelValue", "items"],
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
            ),
            e(
              Ee,
              {
                modelValue: r.value,
                "onUpdate:modelValue": R[4] || (R[4] = (C) => (r.value = C)),
                "restore-metadata": d.value,
              },
              null,
              8,
              ["modelValue", "restore-metadata"],
            ),
            e(
              Ue,
              {
                modelValue: $.value,
                "onUpdate:modelValue": R[5] || (R[5] = (C) => ($.value = C)),
                "confirm-delete": h,
                "to-delete-ids": c.value,
                onAllDelete: z,
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
  }),
  Ol = j({
    __name: "Index",
    setup(b) {
      const { t: s } = O(),
        t = ge(),
        i = ve(),
        v = k(!1),
        S = k(!1),
        p = k(!1),
        g = k(!1),
        u = k(!1),
        r = k(!1),
        d = [
          { title: s("common.type"), key: "type", align: "center" },
          { title: s("common.name"), key: "name", align: "start" },
          { title: s("SetBackup.table.backupFields"), key: "backupFields", align: "start", sortable: !1 },
          { title: s("SetBackup.table.lastBackupAt"), key: "lastBackupAt", align: "end" },
          { title: s("common.enable"), key: "enabled", align: "center" },
          { title: s("common.action"), key: "action", sortable: !1 },
        ],
        M = k([]),
        $ = Symbol("localBackup"),
        c = k({});
      async function y(U) {
        if (((c.value[U] = !0), typeof U == "string")) {
          const B = i.backupServers[U].backupFields ?? [...Q];
          (await G("exportBackupData", { backupFields: B, backupServerId: U }))
            ? t.showSnakebar(s("SetBackup.snackbar.success"), { color: "success" })
            : t.showSnakebar(s("SetBackup.snackbar.failure"), { color: "error" });
        } else U == $ ? (S.value = !0) : console.log('"doBackup" without valid backupServerId');
        c.value[U] = !1;
      }
      const h = k(null);
      function z(U) {
        ((h.value = U), (g.value = !0));
      }
      const L = k(null);
      function ee(U) {
        ((L.value = U), (p.value = !0));
      }
      const I = k([]);
      function R(U) {
        ((I.value = U), (r.value = !0));
      }
      async function C(U) {
        return await i.removeBackupServer(U);
      }
      return (U, B) => (
        f(),
        A(
          T,
          null,
          [
            e(Ie, { title: a(s)("route.Settings.SetBackup"), type: "info" }, null, 8, ["title"]),
            e(
              K,
              { class: "set-backup" },
              {
                default: l(() => [
                  e(X, null, {
                    default: l(() => [
                      e(
                        W,
                        { class: "ma-0" },
                        {
                          default: l(() => [
                            e(
                              ne,
                              {
                                text: a(s)("common.btn.add"),
                                color: "success",
                                icon: "mdi-plus",
                                onClick: B[0] || (B[0] = (o) => (v.value = !0)),
                              },
                              null,
                              8,
                              ["text"],
                            ),
                            e(
                              ne,
                              {
                                disabled: M.value.length === 0,
                                text: a(s)("common.remove"),
                                color: "error",
                                icon: "mdi-minus",
                                onClick: B[1] || (B[1] = (o) => R(M.value)),
                              },
                              null,
                              8,
                              ["disabled", "text"],
                            ),
                            e(H, { class: "mx-2", inset: "", vertical: "" }),
                            e(
                              ne,
                              {
                                loading: c.value[a($)],
                                color: "success",
                                icon: "mdi-database-export",
                                text: a(s)("SetBackup.localExport"),
                                onClick: B[2] || (B[2] = (o) => y(a($))),
                              },
                              null,
                              8,
                              ["loading", "text"],
                            ),
                            e(
                              ne,
                              {
                                color: "blue",
                                icon: "mdi-database-import",
                                text: a(s)("SetBackup.localImport"),
                                onClick: B[3] || (B[3] = () => (u.value = !0)),
                              },
                              null,
                              8,
                              ["text"],
                            ),
                            e(q),
                            e(_, {
                              clearable: "",
                              density: "compact",
                              "hide-details": "",
                              label: "Search",
                              "max-width": "500",
                              "single-line": "",
                            }),
                          ]),
                          _: 1,
                        },
                      ),
                    ]),
                    _: 1,
                  }),
                  e(
                    Re,
                    {
                      modelValue: M.value,
                      "onUpdate:modelValue": B[4] || (B[4] = (o) => (M.value = o)),
                      headers: d,
                      "filter-keys": ["id"],
                      items: a(i).getBackupServers,
                      "item-value": "id",
                      class: "table-stripe table-header-no-wrap",
                      "show-select": "",
                    },
                    {
                      "item.type": l(({ item: o }) => [
                        e(We, { image: a(Ve)(o.type), alt: o.type, title: o.type }, null, 8, ["image", "alt", "title"]),
                      ]),
                      "item.backupFields": l(({ item: o }) => [
                        e(
                          je,
                          { "show-arrows": "" },
                          {
                            default: l(() => [
                              (f(!0),
                              A(
                                T,
                                null,
                                Y(
                                  o.backupFields,
                                  (n) => (
                                    f(),
                                    x(Be, { label: "", key: n }, { default: l(() => [w(V(n), 1)]), _: 2 }, 1024)
                                  ),
                                ),
                                128,
                              )),
                            ]),
                            _: 2,
                          },
                          1024,
                        ),
                      ]),
                      "item.lastBackupAt": l(({ item: o }) => [
                        w(V(o.lastBackupAt ? a(xe)(o.lastBackupAt) : "notBackup"), 1),
                      ]),
                      "item.enabled": l(({ item: o }) => [
                        e(
                          J,
                          {
                            modelValue: o.enabled,
                            "onUpdate:modelValue": [
                              (n) => (o.enabled = n),
                              (n) => a(i).simplePatch("backupServers", o.id, "enabled", n),
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
                      "item.action": l(({ item: o }) => [
                        e(
                          we,
                          { class: "table-action", density: "compact", variant: "plain" },
                          {
                            default: l(() => [
                              e(
                                D,
                                {
                                  title: a(s)("SetBackup.table.action.backupNow"),
                                  loading: c.value[o.id],
                                  color: "green",
                                  icon: "mdi-cloud-upload",
                                  size: "small",
                                  onClick: (n) => y(o.id),
                                },
                                null,
                                8,
                                ["title", "loading", "onClick"],
                              ),
                              e(
                                D,
                                {
                                  title: a(s)("SetBackup.table.action.viewHistoryBackup"),
                                  icon: "mdi-view-list",
                                  size: "small",
                                  onClick: (n) => ee(o.id),
                                },
                                null,
                                8,
                                ["title", "onClick"],
                              ),
                              e(
                                D,
                                {
                                  title: a(s)("common.edit"),
                                  color: "info",
                                  icon: "mdi-pencil",
                                  size: "small",
                                  onClick: (n) => z(o.id),
                                },
                                null,
                                8,
                                ["title", "onClick"],
                              ),
                              e(
                                D,
                                {
                                  title: a(s)("common.remove"),
                                  color: "error",
                                  icon: "mdi-delete",
                                  size: "small",
                                  onClick: (n) => R([o.id]),
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
                    ["modelValue", "items"],
                  ),
                ]),
                _: 1,
              },
            ),
            e(dl, { modelValue: v.value, "onUpdate:modelValue": B[5] || (B[5] = (o) => (v.value = o)) }, null, 8, [
              "modelValue",
            ]),
            e(
              cl,
              {
                modelValue: g.value,
                "onUpdate:modelValue": B[6] || (B[6] = (o) => (g.value = o)),
                "client-id": h.value,
              },
              null,
              8,
              ["modelValue", "client-id"],
            ),
            e(
              Ue,
              {
                modelValue: r.value,
                "onUpdate:modelValue": B[7] || (B[7] = (o) => (r.value = o)),
                "to-delete-ids": I.value,
                "confirm-delete": C,
              },
              null,
              8,
              ["modelValue", "to-delete-ids"],
            ),
            e(
              fl,
              {
                modelValue: p.value,
                "onUpdate:modelValue": B[8] || (B[8] = (o) => (p.value = o)),
                "backup-server-id": L.value,
              },
              null,
              8,
              ["modelValue", "backup-server-id"],
            ),
            e(ml, { modelValue: S.value, "onUpdate:modelValue": B[9] || (B[9] = (o) => (S.value = o)) }, null, 8, [
              "modelValue",
            ]),
            e(
              Ee,
              {
                modelValue: u.value,
                "onUpdate:modelValue": B[10] || (B[10] = (o) => (u.value = o)),
                "restore-metadata": { type: "file" },
              },
              null,
              8,
              ["modelValue"],
            ),
          ],
          64,
        )
      );
    },
  });
export { Ol as default };
