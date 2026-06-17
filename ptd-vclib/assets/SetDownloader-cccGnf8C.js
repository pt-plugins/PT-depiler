import {
  bN as Y,
  f as j,
  p as Oe,
  T as B,
  n as R,
  a3 as N,
  $ as Ye,
  c as D,
  bV as W,
  s as le,
  j as G,
  a4 as te,
  a5 as Pe,
  a2 as M,
  t as h,
  i as ae,
  C as O,
  g as oe,
  cd as je,
  x as ne,
  c2 as qe,
  l as X,
  m as ye,
  bz as Ue,
  B as Ie,
  F as He,
  a8 as Re,
  A as We,
  o as Se,
  H as Ge,
  cf as ke,
  D as Qe,
  d as Je,
  V as Xe,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as q,
  cb as Q,
  E as ve,
  I as x,
  ck as l,
  U as e,
  c4 as t,
  J as _,
  Q as S,
  bS as v,
  L as F,
  bu as z,
  F as E,
  H as P,
  a$ as re,
  br as C,
  bj as V,
  e as Ce,
  b0 as ge,
  cl as Ke,
  b1 as Ze,
  ch as el,
  D as K,
  aQ as ll,
  b3 as tl,
} from "../vendor/packages/site/index-COeZNva1.js";
import { c as al } from "../vendor/es-toolkit/countBy-DH9W4DLK.js";
import { g as fe, j as se, i as Z, h as ol, f as nl } from "../vendor/packages/downloader/index-BATa0ddy.js";
import { u as dl } from "./useAdvanceFilter-CaHJJm2I.js";
import { a as me, b as ul } from "./utils-DF6YUpNn.js";
import { _ as il } from "./ConnectCheckButton.vue_vue_type_script_setup_true_lang-B58MRE7r.js";
import { V as _e } from "../vendor/vuetify/VForm-CJoKT4R8.js";
import { V as ie } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { c as he, V as de, a as ue, b as xe } from "../vendor/vuetify/VExpansionPanels-Bs-8zb91.js";
import { V as ee } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as rl, a as $e } from "../vendor/vuetify/VWindowItem-CGCDkWEG.js";
import { V as Fe } from "../vendor/vuetify/VAutocomplete-DUqyo09O.js";
import { V as Te } from "../vendor/vuetify/VTextarea-hZu3Ftop.js";
import { V as sl } from "../vendor/vuetify/VTable-7Q8JlSj6.js";
import { _ as ml } from "./CheckSwitchButton.vue_vue_type_script_setup_true_lang-B5aVIv06.js";
import { V as cl } from "../vendor/vuetify/VSkeletonLoader-YwNzPI56.js";
import { V as fl } from "../vendor/vuetify/VListItemAction-CeTFHb3m.js";
import { V as pe } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import { u as Ae } from "./useResetableRef-DOEDeOaU.js";
import { _ as pl } from "./DeleteDialog.vue_vue_type_script_setup_true_lang-CkaHuNvW.js";
import { N as ce } from "./NavButton-jVIhOejA.js";
import { V as vl } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "./___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../vendor/es-toolkit/isEqual-xRaZZh9v.js";
import "../vendor/es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../vendor/es-toolkit/flatten-CRv0zNMl.js";
import "../vendor/date-fns/startOfMonth-CSVGuOFh.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/es-toolkit/uniqBy-DEckz2wg.js";
import "../vendor/packages/site/utils/filesize-D_1hx4u8.js";
import "../vendor/packages/site/utils/datetime-DQxMK7bP.js";
import "../vendor/date-fns/sub-D9RLuzs0.js";
import "../vendor/date-fns/subDays-DlPNbvmn.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
const Be = q({
    __name: "Editor",
    props: { modelValue: {}, modelModifiers: {} },
    emits: re(["update:configValid"], ["update:modelValue"]),
    setup(A, { emit: i }) {
      const { t: a } = Y(),
        o = Q(A, "modelValue"),
        g = i,
        s = ve(async () => await se(o.value.type), {}),
        f = C(!1),
        $ = C(!1);
      async function y() {
        return $ ? await (await fe(o.value)).ping() : !1;
      }
      return (k, m) => (
        V(),
        x(
          j,
          { class: "mb-5" },
          {
            default: l(() => [
              o.value
                ? (V(),
                  x(
                    _e,
                    {
                      key: 0,
                      modelValue: $.value,
                      "onUpdate:modelValue": m[12] || (m[12] = (u) => ($.value = u)),
                      "fast-fail": "",
                    },
                    {
                      default: l(() => [
                        e(
                          Oe,
                          { class: "pa-0" },
                          {
                            default: l(() => [
                              e(B, null, {
                                default: l(() => [
                                  e(
                                    R,
                                    { cols: "12", md: "2" },
                                    {
                                      default: l(() => [
                                        e(
                                          N,
                                          {
                                            modelValue: o.value.type,
                                            "onUpdate:modelValue": m[0] || (m[0] = (u) => (o.value.type = u)),
                                            label: t(a)("common.type"),
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
                                    R,
                                    { cols: "12", md: "4" },
                                    {
                                      default: l(() => [
                                        e(
                                          N,
                                          {
                                            modelValue: o.value.name,
                                            "onUpdate:modelValue": m[1] || (m[1] = (u) => (o.value.name = u)),
                                            label: t(a)("SetDownloader.common.name"),
                                            placeholder: t(a)("SetDownloader.common.name"),
                                            rules: [t(me).require(t(a)("SetDownloader.editor.nameTip"))],
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
                                    R,
                                    { cols: "12", md: "4" },
                                    {
                                      default: l(() => [
                                        e(
                                          N,
                                          {
                                            modelValue: o.value.id,
                                            "onUpdate:modelValue": m[2] || (m[2] = (u) => (o.value.id = u)),
                                            label:
                                              t(a)("SetDownloader.common.uid") +
                                              t(a)("SetDownloader.editor.uidPlaceholder"),
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
                                    R,
                                    { cols: "12", md: "2" },
                                    {
                                      default: l(() => [
                                        e(
                                          N,
                                          {
                                            modelValue: o.value.sortIndex,
                                            "onUpdate:modelValue": m[3] || (m[3] = (u) => (o.value.sortIndex = u)),
                                            label: t(a)("common.sortIndex"),
                                            rules: [t(me).require()],
                                            "hide-details": "",
                                            type: "number",
                                          },
                                          null,
                                          8,
                                          ["modelValue", "label", "rules"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                ]),
                                _: 1,
                              }),
                              e(B, null, {
                                default: l(() => [
                                  e(
                                    N,
                                    {
                                      modelValue: o.value.address,
                                      "onUpdate:modelValue": m[4] || (m[4] = (u) => (o.value.address = u)),
                                      label: t(a)("SetDownloader.common.address"),
                                      rules: [t(me).url(t(a)("SetDownloader.editor.addressTip"))],
                                      required: "",
                                    },
                                    null,
                                    8,
                                    ["modelValue", "label", "rules"],
                                  ),
                                ]),
                                _: 1,
                              }),
                              e(B, null, {
                                default: l(() => [
                                  typeof o.value.username < "u"
                                    ? (V(),
                                      x(
                                        N,
                                        {
                                          key: 0,
                                          modelValue: o.value.username,
                                          "onUpdate:modelValue": m[5] || (m[5] = (u) => (o.value.username = u)),
                                          label: t(a)("common.username"),
                                        },
                                        null,
                                        8,
                                        ["modelValue", "label"],
                                      ))
                                    : _("", !0),
                                ]),
                                _: 1,
                              }),
                              e(B, null, {
                                default: l(() => [
                                  e(
                                    N,
                                    {
                                      modelValue: o.value.password,
                                      "onUpdate:modelValue": m[6] || (m[6] = (u) => (o.value.password = u)),
                                      "append-icon": f.value ? "mdi-eye" : "mdi-eye-off",
                                      label: t(a)("SetDownloader.editor.password"),
                                      type: f.value ? "text" : "password",
                                      class: "pr-5",
                                      "onClick:append": m[7] || (m[7] = (u) => (f.value = !f.value)),
                                    },
                                    null,
                                    8,
                                    ["modelValue", "append-icon", "label", "type"],
                                  ),
                                ]),
                                _: 1,
                              }),
                              e(B, null, {
                                default: l(() => [
                                  e(
                                    Ye,
                                    {
                                      modelValue: o.value.timeout,
                                      "onUpdate:modelValue": m[9] || (m[9] = (u) => (o.value.timeout = u)),
                                      color:
                                        o.value.timeout > 8 * 6e4
                                          ? "red"
                                          : o.value.timeout > 5 * 6e4
                                            ? "amber"
                                            : "green",
                                      label: t(a)("SetDownloader.editor.timeout"),
                                      max: 10 * 6e4,
                                      min: 0,
                                      step: 1e3,
                                      class: "px-2",
                                      "hide-details": "",
                                    },
                                    {
                                      append: l(() => [
                                        e(
                                          D,
                                          { variant: "flat", onClick: m[8] || (m[8] = (u) => (o.value.timeout = 6e4)) },
                                          { default: l(() => [S(v(t(ul)(o.value.timeout, "mm:ss")), 1)]), _: 1 },
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
                              e(B, null, {
                                default: l(() => [
                                  t(s)?.feature?.DefaultAutoStart?.allowed
                                    ? (V(),
                                      x(
                                        ie,
                                        {
                                          key: 0,
                                          modelValue: o.value.feature.DefaultAutoStart,
                                          "onUpdate:modelValue":
                                            m[10] || (m[10] = (u) => (o.value.feature.DefaultAutoStart = u)),
                                          label: t(a)("SetDownloader.editor.autoStart"),
                                          class: "ml-4",
                                          color: "success",
                                          "hide-details": "",
                                        },
                                        null,
                                        8,
                                        ["modelValue", "label"],
                                      ))
                                    : _("", !0),
                                ]),
                                _: 1,
                              }),
                              t(s).advanceAddTorrentOptions
                                ? (V(),
                                  x(
                                    B,
                                    { key: 0 },
                                    {
                                      default: l(() => [
                                        e(R, null, {
                                          default: l(() => [
                                            e(he, null, {
                                              default: l(() => [
                                                e(
                                                  de,
                                                  { title: t(a)("common.advancedSettings") },
                                                  {
                                                    default: l(() => [
                                                      e(ue, null, {
                                                        default: l(() => [
                                                          (V(!0),
                                                          F(
                                                            E,
                                                            null,
                                                            z(
                                                              t(s).advanceAddTorrentOptions,
                                                              (u) => (
                                                                V(),
                                                                x(
                                                                  ie,
                                                                  {
                                                                    key: u.key,
                                                                    modelValue: o.value.advanceAddTorrentOptions[u.key],
                                                                    "onUpdate:modelValue": (r) =>
                                                                      (o.value.advanceAddTorrentOptions[u.key] = r),
                                                                    color: "success",
                                                                    label: u.name,
                                                                    messages: u.description,
                                                                    "hide-details": !u.description,
                                                                  },
                                                                  null,
                                                                  8,
                                                                  [
                                                                    "modelValue",
                                                                    "onUpdate:modelValue",
                                                                    "label",
                                                                    "messages",
                                                                    "hide-details",
                                                                  ],
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
                                                  8,
                                                  ["title"],
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
                                  ))
                                : _("", !0),
                            ]),
                            _: 1,
                          },
                        ),
                        e(il, {
                          "check-fn": y,
                          "reset-timeout": 3e3,
                          "onAfter:checkConnect": m[11] || (m[11] = () => g("update:configValid", $.value && !0)),
                        }),
                        t(s)?.warning
                          ? (V(),
                            x(
                              ee,
                              { key: 0, color: "warning" },
                              {
                                default: l(() => [
                                  P("ul", null, [
                                    (V(!0),
                                    F(
                                      E,
                                      null,
                                      z(t(s).warning, (u, r) => (V(), F("li", { key: r }, "● " + v(u), 1))),
                                      128,
                                    )),
                                  ]),
                                ]),
                                _: 1,
                              },
                            ))
                          : _("", !0),
                      ]),
                      _: 1,
                    },
                    8,
                    ["modelValue"],
                  ))
                : _("", !0),
            ]),
            _: 1,
          },
        )
      );
    },
  }),
  gl = { class: "ml-1" },
  Vl = q({
    __name: "AddDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(A) {
      const i = Q(A, "modelValue"),
        { t: a } = Y(),
        o = W(),
        g = C(0),
        s = C(null),
        f = C({}),
        $ = C(!1);
      function y() {
        ((g.value = 0), (s.value = null), (f.value = {}), ($.value = !1));
      }
      const k = ve(async () => {
        const r = {};
        for (const n of nl) r[n] = { type: n, ...(await se(n)) };
        return r;
      }, {});
      async function m(r) {
        ((f.value = {
          valid: !1,
          ...(await ol(r)),
          enabled: !0,
          id: Ze(),
          advanceAddTorrentOptions: {},
          sortIndex: 100,
        }),
          console.log("storedDownloaderConfig", f.value));
      }
      async function u() {
        (await o.addDownloader(f.value),
          o.getDownloaders.length === 1 &&
            ((o.defaultDownloader = { id: f.value.id, folder: "", tags: "" }), o.$save()),
          (i.value = !1));
      }
      return (r, n) => (
        V(),
        x(
          le,
          {
            modelValue: i.value,
            "onUpdate:modelValue": n[8] || (n[8] = (w) => (i.value = w)),
            "max-width": "800",
            scrollable: "",
            onAfterLeave: y,
          },
          {
            default: l(() => [
              e(j, null, {
                default: l(() => [
                  e(
                    G,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          te,
                          { color: "blue-grey-darken-2" },
                          {
                            default: l(() => [
                              e(Pe, null, { default: l(() => [S(v(t(a)("SetDownloader.add.title")), 1)]), _: 1 }),
                              e(M),
                              e(
                                D,
                                {
                                  title: t(a)("layout.header.wiki"),
                                  href: `${t(Ce)}/wiki/config-download-client`,
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
                  e(h),
                  e(ae, null, {
                    default: l(() => [
                      e(
                        rl,
                        { modelValue: g.value, "onUpdate:modelValue": n[4] || (n[4] = (w) => (g.value = w)) },
                        {
                          default: l(() => [
                            e(
                              $e,
                              { value: 0 },
                              {
                                default: l(() => [
                                  e(
                                    Fe,
                                    {
                                      modelValue: s.value,
                                      "onUpdate:modelValue": [
                                        n[0] || (n[0] = (w) => (s.value = w)),
                                        n[1] || (n[1] = (w) => m(w)),
                                      ],
                                      "filter-keys": ["raw.type"],
                                      hint: t(k)[s.value]?.description ?? t(a)("SetDownloader.add.NoneSelectNotice"),
                                      items: Object.values(t(k)),
                                      multiple: !1,
                                      placeholder: t(a)("SetDownloader.add.selectPlaceholder"),
                                      "item-title": "type",
                                      "item-value": "type",
                                      "persistent-hint": "",
                                    },
                                    {
                                      selection: l(({ item: { raw: w } }) => [
                                        e(O, { "prepend-avatar": t(Z)(w.type), title: w.type }, null, 8, [
                                          "prepend-avatar",
                                          "title",
                                        ]),
                                      ]),
                                      item: l(({ props: w, item: { raw: L } }) => [
                                        e(O, ge(w, { "prepend-avatar": t(Z)(L.type), title: L.type }), null, 16, [
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
                              $e,
                              { value: 1 },
                              {
                                default: l(() => [
                                  f.value.type
                                    ? (V(),
                                      x(
                                        Be,
                                        {
                                          key: 0,
                                          modelValue: f.value,
                                          "onUpdate:modelValue": n[2] || (n[2] = (w) => (f.value = w)),
                                          "onUpdate:configValid": n[3] || (n[3] = (w) => ($.value = w)),
                                        },
                                        null,
                                        8,
                                        ["modelValue"],
                                      ))
                                    : _("", !0),
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
                  e(h),
                  e(oe, null, {
                    default: l(() => [
                      Ke(
                        e(
                          D,
                          {
                            href: `${t(Ce)}/tree/master/src/packages/downloader`,
                            color: "grey-darken-1",
                            flat: "",
                            rel: "noopener noreferrer nofollow",
                            target: "_blank",
                          },
                          {
                            default: l(() => [
                              e(ne, { icon: "mdi-help-circle" }),
                              P("span", gl, v(t(a)("SetDownloader.add.newType")), 1),
                            ]),
                            _: 1,
                          },
                          8,
                          ["href"],
                        ),
                        [[je, g.value === 0]],
                      ),
                      e(M),
                      e(
                        D,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: n[5] || (n[5] = (w) => (i.value = !1)),
                        },
                        { default: l(() => [S(v(t(a)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      g.value === 1
                        ? (V(),
                          x(
                            D,
                            {
                              key: 0,
                              color: "blue-darken-1",
                              "prepend-icon": "mdi-chevron-left",
                              variant: "text",
                              onClick: n[6] || (n[6] = (w) => g.value--),
                            },
                            { default: l(() => [S(v(t(a)("common.dialog.prev")), 1)]), _: 1 },
                          ))
                        : _("", !0),
                      g.value === 0
                        ? (V(),
                          x(
                            D,
                            {
                              key: 1,
                              disabled: s.value == null,
                              "append-icon": "mdi-chevron-right",
                              color: "blue-darken-1",
                              variant: "text",
                              onClick: n[7] || (n[7] = (w) => g.value++),
                            },
                            { default: l(() => [S(v(t(a)("common.dialog.next")), 1)]), _: 1 },
                            8,
                            ["disabled"],
                          ))
                        : _("", !0),
                      g.value === 1
                        ? (V(),
                          x(
                            D,
                            {
                              key: 2,
                              disabled: !$.value,
                              color: "success",
                              "prepend-icon": "mdi-check-circle-outline",
                              variant: "text",
                              onClick: u,
                            },
                            { default: l(() => [S(v(t(a)("common.dialog.ok")), 1)]), _: 1 },
                            8,
                            ["disabled"],
                          ))
                        : _("", !0),
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
  wl = q({
    __name: "EditDialog",
    props: re({ clientId: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(A) {
      const i = Q(A, "modelValue"),
        a = C(),
        { t: o } = Y(),
        g = W();
      function s() {
        A.clientId && (a.value = { sortIndex: 100, advanceAddTorrentOptions: {}, ...g.downloaders[A.clientId] });
      }
      function f() {
        (g.addDownloader(a.value), (i.value = !1));
      }
      return ($, y) => (
        V(),
        x(
          le,
          {
            modelValue: i.value,
            "onUpdate:modelValue": y[3] || (y[3] = (k) => (i.value = k)),
            "max-width": "800",
            scrollable: "",
            onAfterEnter: s,
          },
          {
            default: l(() => [
              e(j, null, {
                default: l(() => [
                  e(
                    G,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          te,
                          { color: "blue-grey-darken-2" },
                          {
                            append: l(() => [
                              e(
                                D,
                                {
                                  icon: "mdi-close",
                                  title: t(o)("common.dialog.close"),
                                  onClick: y[0] || (y[0] = (k) => (i.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: l(() => [
                              e(Pe, null, { default: l(() => [S(v(t(o)("SetDownloader.edit.title")), 1)]), _: 1 }),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  e(h),
                  e(ae, null, {
                    default: l(() => [
                      e(
                        Be,
                        { modelValue: a.value, "onUpdate:modelValue": y[1] || (y[1] = (k) => (a.value = k)) },
                        null,
                        8,
                        ["modelValue"],
                      ),
                    ]),
                    _: 1,
                  }),
                  e(h),
                  e(oe, null, {
                    default: l(() => [
                      e(M),
                      e(
                        D,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: y[2] || (y[2] = (k) => (i.value = !1)),
                        },
                        { default: l(() => [S(v(t(o)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      e(
                        D,
                        { color: "success", "prepend-icon": "mdi-check-circle-outline", variant: "text", onClick: f },
                        { default: l(() => [S(v(t(o)("common.dialog.ok")), 1)]), _: 1 },
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
  bl = { class: "d-flex flex-column" },
  Dl = { class: "d-flex flex-column" },
  yl = q({
    __name: "PathAndTagSuggestDialog",
    props: re({ clientId: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(A) {
      const i = Q(A, "modelValue"),
        { t: a } = Y(),
        o = qe(),
        g = W(),
        s = C(),
        f = C(),
        $ = C("note"),
        y = [
          ["torrentTitle", "$torrent.title$", "/volume1/$torrent.title$ -> /volume1/TorrentTitle"],
          ["torrentSubTitle", "$torrent.subTitle$", "/volume1/$torrent.subTitle$ -> /volume1/TorrentSubTitle"],
          ["torrentSite", "$torrent.site$", "/volume1/$torrent.site$/music -> /volume1/opencd/music"],
          ["torrentSiteName", "$torrent.siteName$", "/volume1/$torrent.siteName$/music -> /volume1/OpenCD/music"],
          ["searchKeyword", "$search:keyword$", "/volume1/$search:keyword$/music -> /volume1/keyword/music"],
          ["searchPlan", "$search:plan$", "/volume1/$search:plan$/music -> /volume1/all/music"],
          ["dateYear", "$date:YYYY$", "/volume1/$date:YYYY$/music -> /volume1/2019/music"],
          ["dateMonth", "$date:MM$", "/volume1/$date:MM$/music -> /volume1/10/music"],
          ["dateDay", "$date:DD$", "/volume1/$date:DD$/music -> /volume1/01/music"],
          ["custom", "<...>", "/volume1/<...>/music -> prompt for input 'test' -> /volume1/test/music"],
        ];
      el(
        () => A.clientId,
        async (I) => {
          (console.log("Edit clientId:", I),
            I &&
              ((s.value = { suggestFolders: [], suggestTags: [], ...g.downloaders[I] }),
              (f.value = await se(s.value.type))));
        },
        { immediate: !0 },
      );
      const k = K({
          get: () =>
            (s.value?.suggestFolders ?? []).join(`
`),
          set: (I) => {
            s.value.suggestFolders = I.split(
              `
`,
            )
              .map((b) => b.trim())
              .filter(Boolean);
          },
        }),
        m = C(!1);
      async function u() {
        m.value = !0;
        const I = await fe(s.value);
        try {
          const b = await I.getClientPaths();
          for (const p of b)
            (s.value?.suggestFolders ?? []).includes(p) ||
              (k.value +=
                `
` + p);
        } catch {
          o.showSnakebar(a("SetDownloader.PathAndTag.downloadPath.autoImportFail"), { color: "error" });
        }
        m.value = !1;
      }
      const r = K({
          get: () =>
            (s.value?.suggestTags ?? []).join(`
`),
          set: (I) => {
            s.value.suggestTags = I.split(
              `
`,
            )
              .map((b) => b.trim())
              .filter(Boolean);
          },
        }),
        n = C(!1);
      async function w() {
        n.value = !0;
        const I = await fe(s.value);
        try {
          const b = await I.getClientLabels();
          for (const p of b)
            (s.value?.suggestTags ?? []).includes(p) ||
              (r.value +=
                `
` + p);
        } catch {
          o.showSnakebar(a("SetDownloader.PathAndTag.tags.autoImportFail"), { color: "error" });
        }
        n.value = !1;
      }
      function L() {
        (g.addDownloader(s.value), (i.value = !1));
      }
      return (I, b) => (
        V(),
        x(
          le,
          {
            modelValue: i.value,
            "onUpdate:modelValue": b[6] || (b[6] = (p) => (i.value = p)),
            scrollable: "",
            width: "1000",
          },
          {
            default: l(() => [
              e(j, null, {
                default: l(() => [
                  e(
                    G,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          te,
                          {
                            title: t(a)("SetDownloader.PathAndTag.title", [s.value?.name ?? A.clientId]),
                            color: "blue-grey-darken-2",
                          },
                          {
                            append: l(() => [
                              e(
                                D,
                                {
                                  icon: "mdi-close",
                                  title: t(a)("common.dialog.close"),
                                  onClick: b[0] || (b[0] = (p) => (i.value = !1)),
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
                  e(h),
                  e(ae, null, {
                    default: l(() => [
                      e(
                        he,
                        { modelValue: $.value, "onUpdate:modelValue": b[5] || (b[5] = (p) => ($.value = p)) },
                        {
                          default: l(() => [
                            e(
                              de,
                              { disabled: f.value?.feature?.CustomPath?.allowed === !1, value: "path" },
                              {
                                default: l(() => [
                                  e(xe, null, {
                                    default: l(() => [
                                      S(v(t(a)("SetDownloader.PathAndTag.downloadPath.title")) + " ", 1),
                                      e(M),
                                      e(
                                        X,
                                        { color: s.value.suggestFolders.length > 0 ? "info" : "", size: "small" },
                                        { default: l(() => [S(" +" + v(s.value.suggestFolders.length), 1)]), _: 1 },
                                        8,
                                        ["color"],
                                      ),
                                    ]),
                                    _: 1,
                                  }),
                                  e(ue, null, {
                                    default: l(() => [
                                      f.value?.feature?.CustomPath.description
                                        ? (V(),
                                          x(
                                            ee,
                                            { key: 0, closable: "", type: "info", variant: "outlined" },
                                            {
                                              default: l(() => [S(v(f.value?.feature?.CustomPath.description), 1)]),
                                              _: 1,
                                            },
                                          ))
                                        : _("", !0),
                                      e(
                                        Te,
                                        {
                                          modelValue: k.value,
                                          "onUpdate:modelValue": b[2] || (b[2] = (p) => (k.value = p)),
                                          label: t(a)("SetDownloader.PathAndTag.downloadPath.addInputLabel"),
                                          class: "mt-2",
                                        },
                                        {
                                          append: l(() => [
                                            P("div", bl, [
                                              e(
                                                D,
                                                {
                                                  loading: m.value,
                                                  title: t(a)("SetDownloader.PathAndTag.downloadPath.autoImport"),
                                                  color: "primary",
                                                  icon: "mdi-import",
                                                  variant: "text",
                                                  onClick: u,
                                                },
                                                null,
                                                8,
                                                ["loading", "title"],
                                              ),
                                              e(
                                                D,
                                                {
                                                  title: t(a)("SetDownloader.PathAndTag.downloadPath.clear"),
                                                  color: "red",
                                                  icon: "$clear",
                                                  variant: "text",
                                                  onClick: b[1] || (b[1] = (p) => (k.value = "")),
                                                },
                                                null,
                                                8,
                                                ["title"],
                                              ),
                                            ]),
                                          ]),
                                          details: l(() => [
                                            e(ye, null, {
                                              default: l(() => [
                                                (V(),
                                                F(
                                                  E,
                                                  null,
                                                  z(y, (p) =>
                                                    e(
                                                      X,
                                                      {
                                                        key: p[1],
                                                        title: p[2],
                                                        class: "mr-1",
                                                        size: "small",
                                                        onClick: () => (k.value += "/" + p[1]),
                                                      },
                                                      { default: l(() => [S(v(p[1]), 1)]), _: 2 },
                                                      1032,
                                                      ["title", "onClick"],
                                                    ),
                                                  ),
                                                  64,
                                                )),
                                              ]),
                                              _: 1,
                                            }),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["modelValue", "label"],
                                      ),
                                    ]),
                                    _: 1,
                                  }),
                                ]),
                                _: 1,
                              },
                              8,
                              ["disabled"],
                            ),
                            e(
                              de,
                              { value: "tag" },
                              {
                                default: l(() => [
                                  e(xe, null, {
                                    default: l(() => [
                                      S(v(t(a)("SetDownloader.PathAndTag.tags.title")) + " ", 1),
                                      e(M),
                                      e(
                                        X,
                                        { color: s.value.suggestTags.length > 0 ? "info" : "", size: "small" },
                                        { default: l(() => [S(" +" + v(s.value.suggestTags.length), 1)]), _: 1 },
                                        8,
                                        ["color"],
                                      ),
                                    ]),
                                    _: 1,
                                  }),
                                  e(ue, null, {
                                    default: l(() => [
                                      e(
                                        Te,
                                        {
                                          modelValue: r.value,
                                          "onUpdate:modelValue": b[4] || (b[4] = (p) => (r.value = p)),
                                          label: t(a)("SetDownloader.PathAndTag.tags.addInputLabel"),
                                        },
                                        {
                                          append: l(() => [
                                            P("div", Dl, [
                                              e(
                                                D,
                                                {
                                                  loading: n.value,
                                                  title: t(a)("SetDownloader.PathAndTag.tags.autoImport"),
                                                  color: "primary",
                                                  icon: "mdi-import",
                                                  variant: "text",
                                                  onClick: w,
                                                },
                                                null,
                                                8,
                                                ["loading", "title"],
                                              ),
                                              e(
                                                D,
                                                {
                                                  title: t(a)("SetDownloader.PathAndTag.tags.clear"),
                                                  color: "red",
                                                  icon: "$clear",
                                                  variant: "text",
                                                  onClick: b[3] || (b[3] = (p) => (r.value = "")),
                                                },
                                                null,
                                                8,
                                                ["title"],
                                              ),
                                            ]),
                                          ]),
                                          details: l(() => [
                                            e(ye, null, {
                                              default: l(() => [
                                                (V(),
                                                F(
                                                  E,
                                                  null,
                                                  z(y, (p) =>
                                                    e(
                                                      X,
                                                      {
                                                        key: p[1],
                                                        title: p[2],
                                                        class: "mr-1",
                                                        size: "small",
                                                        onClick: () => (r.value += p[1]),
                                                      },
                                                      { default: l(() => [S(v(p[1]), 1)]), _: 2 },
                                                      1032,
                                                      ["title", "onClick"],
                                                    ),
                                                  ),
                                                  64,
                                                )),
                                              ]),
                                              _: 1,
                                            }),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["modelValue", "label"],
                                      ),
                                    ]),
                                    _: 1,
                                  }),
                                ]),
                                _: 1,
                              },
                            ),
                            e(
                              de,
                              { title: t(a)("SetDownloader.PathAndTag.note.title"), value: "note" },
                              {
                                default: l(() => [
                                  e(ue, null, {
                                    default: l(() => [
                                      e(
                                        ee,
                                        { class: "mt-2", color: "info", variant: "outlined" },
                                        {
                                          default: l(() => [
                                            P("span", null, v(t(a)("SetDownloader.PathAndTag.note.index")), 1),
                                            e(
                                              sl,
                                              { density: "compact" },
                                              {
                                                default: l(() => [
                                                  P("thead", null, [
                                                    P("tr", null, [
                                                      P(
                                                        "th",
                                                        null,
                                                        v(t(a)("SetDownloader.PathAndTag.note.table.keywords")),
                                                        1,
                                                      ),
                                                      P(
                                                        "th",
                                                        null,
                                                        v(t(a)("SetDownloader.PathAndTag.note.table.note")),
                                                        1,
                                                      ),
                                                      P(
                                                        "th",
                                                        null,
                                                        v(t(a)("SetDownloader.PathAndTag.note.table.example")),
                                                        1,
                                                      ),
                                                    ]),
                                                  ]),
                                                  P("tbody", null, [
                                                    (V(),
                                                    F(
                                                      E,
                                                      null,
                                                      z(y, (p) =>
                                                        P("tr", { key: p[1] }, [
                                                          P("td", null, v(p[1]), 1),
                                                          P(
                                                            "td",
                                                            null,
                                                            v(
                                                              t(a)(`SetDownloader.PathAndTag.note.replaceNote.${p[0]}`),
                                                            ),
                                                            1,
                                                          ),
                                                          P("td", null, [P("pre", null, v(p[2]), 1)]),
                                                        ]),
                                                      ),
                                                      64,
                                                    )),
                                                  ]),
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
                              ["title"],
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
                  e(h),
                  e(oe, null, {
                    default: l(() => [
                      e(M),
                      e(
                        D,
                        { color: "success", "prepend-icon": "mdi-check-circle-outline", variant: "text", onClick: L },
                        { default: l(() => [S(v(t(a)("common.dialog.ok")), 1)]), _: 1 },
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
  Sl = q({
    __name: "SiteFilterDialog",
    props: re({ clientId: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(A) {
      const i = Q(A, "modelValue"),
        { t: a } = Y(),
        o = W(),
        g = Ue(),
        s = C(),
        f = C([]),
        $ = K(() =>
          Object.entries(o.sites)
            .filter(([u, r]) => (g.contentScript.allowExceptionSites ? (r.allowContentScript ?? !0) : !0))
            .map(([u]) => ({ id: u, name: o.siteNameMap[u] ?? u }))
            .sort((u, r) => u.name.localeCompare(r.name)),
        ),
        y = K(() => $.value.map((u) => u.id));
      function k() {
        A.clientId &&
          ((s.value = { excludedSites: [], ...o.downloaders[A.clientId] }),
          (f.value = [...(s.value.excludedSites ?? [])]));
      }
      function m() {
        (o.simplePatch("downloaders", A.clientId, "excludedSites", f.value), (i.value = !1));
      }
      return (u, r) => (
        V(),
        x(
          le,
          {
            modelValue: i.value,
            "onUpdate:modelValue": r[4] || (r[4] = (n) => (i.value = n)),
            scrollable: "",
            "max-width": "1000",
            onAfterEnter: k,
          },
          {
            default: l(() => [
              e(j, null, {
                default: l(() => [
                  e(
                    G,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          te,
                          {
                            title: t(a)("SetDownloader.siteFilter.title", [s.value?.name ?? A.clientId]),
                            color: "blue-grey-darken-2",
                          },
                          {
                            append: l(() => [
                              e(
                                D,
                                {
                                  icon: "mdi-close",
                                  title: t(a)("common.dialog.close"),
                                  onClick: r[0] || (r[0] = (n) => (i.value = !1)),
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
                  e(h),
                  e(ae, null, {
                    default: l(() => [
                      e(
                        ee,
                        { class: "mb-3 py-2", color: "info", variant: "tonal" },
                        {
                          text: l(() => [S(v(t(a)("SetDownloader.siteFilter.excludedSitesHint")), 1)]),
                          append: l(() => [
                            e(
                              ml,
                              {
                                modelValue: f.value,
                                "onUpdate:modelValue": r[1] || (r[1] = (n) => (f.value = n)),
                                all: y.value,
                                color: "blue-lighten-1",
                                variant: "tonal",
                              },
                              null,
                              8,
                              ["modelValue", "all"],
                            ),
                          ]),
                          _: 1,
                        },
                      ),
                      $.value.length === 0
                        ? (V(), x(cl, { key: 0, type: "image" }))
                        : (V(),
                          x(
                            Ie,
                            { key: 1, class: "overflow-x-hidden overflow-y-hidden px-3 pt-3" },
                            {
                              default: l(() => [
                                e(B, null, {
                                  default: l(() => [
                                    (V(!0),
                                    F(
                                      E,
                                      null,
                                      z(
                                        $.value,
                                        (n) => (
                                          V(),
                                          x(
                                            R,
                                            { key: n.id, cols: "12", md: "4", sm: "6", class: "pa-1" },
                                            {
                                              default: l(() => [
                                                e(
                                                  O,
                                                  { border: "", class: "bg-grey-lighten-4" },
                                                  {
                                                    prepend: l(() => [
                                                      e(
                                                        Re,
                                                        { "site-id": n.id, class: "mr-2", "flush-on-click": "" },
                                                        null,
                                                        8,
                                                        ["site-id"],
                                                      ),
                                                    ]),
                                                    title: l(() => [
                                                      e(
                                                        He,
                                                        null,
                                                        { default: l(() => [P("b", null, v(n.name), 1)]), _: 2 },
                                                        1024,
                                                      ),
                                                    ]),
                                                    subtitle: l(() => [
                                                      e(
                                                        X,
                                                        { label: "", size: "x-small", class: "mt-1" },
                                                        { default: l(() => [S(v(n.id), 1)]), _: 2 },
                                                        1024,
                                                      ),
                                                    ]),
                                                    append: l(() => [
                                                      e(
                                                        fl,
                                                        null,
                                                        {
                                                          default: l(() => [
                                                            e(
                                                              pe,
                                                              {
                                                                modelValue: f.value,
                                                                "onUpdate:modelValue":
                                                                  r[2] || (r[2] = (w) => (f.value = w)),
                                                                value: n.id,
                                                                color: f.value.includes(n.id) ? "error" : "",
                                                                "hide-details": "",
                                                                "base-color": "green",
                                                                multiple: "",
                                                                "true-icon": "mdi-eye-off",
                                                                "false-icon": "mdi-eye",
                                                              },
                                                              null,
                                                              8,
                                                              ["modelValue", "value", "color"],
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
                                }),
                              ]),
                              _: 1,
                            },
                          )),
                    ]),
                    _: 1,
                  }),
                  e(h),
                  e(oe, null, {
                    default: l(() => [
                      e(M),
                      e(
                        D,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: r[3] || (r[3] = (n) => (i.value = !1)),
                        },
                        { default: l(() => [S(v(t(a)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      e(
                        D,
                        { color: "success", "prepend-icon": "mdi-check-circle-outline", variant: "text", onClick: m },
                        { default: l(() => [S(v(t(a)("common.dialog.ok")), 1)]), _: 1 },
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
  kl = q({
    __name: "DefaultDownloaderEditDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(A) {
      const i = Q(A, "modelValue"),
        { t: a } = Y(),
        o = W(),
        { ref: g, reset: s } = Ae(() => ({ id: "", folder: "", tags: "" })),
        { ref: f, reset: $ } = Ae(() => ({ folder: [], tags: [] }), { shallow: !0 });
      function y(u, r = !0) {
        (r && ((g.value.folder = ""), (g.value.tags = "")),
          (f.value = {
            folder: o.downloaders?.[u]?.suggestFolders ?? [],
            tags: o.downloaders?.[u]?.suggestTags ?? [],
          }));
      }
      function k() {
        ((o.defaultDownloader = g.value), o.$save(), (i.value = !1));
      }
      function m() {
        (s(), $(), o.defaultDownloader?.id && ((g.value = { ...o.defaultDownloader }), y(g.value.id, !1)));
      }
      return (u, r) => (
        V(),
        x(
          le,
          {
            modelValue: i.value,
            "onUpdate:modelValue": r[5] || (r[5] = (n) => (i.value = n)),
            "max-width": "600",
            scrollable: "",
            onAfterEnter: m,
          },
          {
            default: l(() => [
              e(j, null, {
                default: l(() => [
                  e(
                    G,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        e(
                          te,
                          { title: t(a)("SetDownloader.index.editDefaultDownloaderBtn"), color: "blue-grey-darken-2" },
                          {
                            append: l(() => [
                              e(D, { icon: "mdi-close", onClick: r[0] || (r[0] = (n) => (i.value = !1)) }),
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
                  e(h),
                  e(ae, null, {
                    default: l(() => [
                      e(_e, null, {
                        default: l(() => [
                          e(
                            We,
                            { class: "ml-1 mb-1" },
                            { default: l(() => [S(v(t(a)("SetDownloader.index.editDefaultDownloaderBtn")), 1)]), _: 1 },
                          ),
                          e(
                            Fe,
                            {
                              modelValue: t(g).id,
                              "onUpdate:modelValue": [
                                r[1] || (r[1] = (n) => (t(g).id = n)),
                                r[2] || (r[2] = (n) => y(n)),
                              ],
                              items: t(o).getEnabledDownloaders,
                              multiple: !1,
                              "item-value": "id",
                            },
                            {
                              selection: l(({ item: { raw: n } }) => [
                                e(O, { "prepend-avatar": t(Z)(n.type), subtitle: n.address, title: n.name }, null, 8, [
                                  "prepend-avatar",
                                  "subtitle",
                                  "title",
                                ]),
                              ]),
                              item: l(({ props: n, item: { raw: w } }) => [
                                e(
                                  O,
                                  ge(n, { "prepend-avatar": t(Z)(w.type), subtitle: w.address, title: w.name }),
                                  null,
                                  16,
                                  ["prepend-avatar", "subtitle", "title"],
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue", "items"],
                          ),
                          e(
                            Se,
                            {
                              modelValue: t(g).folder,
                              "onUpdate:modelValue": r[3] || (r[3] = (n) => (t(g).folder = n)),
                              items: t(f).folder,
                              label: t(a)("SetDownloader.PathAndTag.downloadPath.title"),
                            },
                            null,
                            8,
                            ["modelValue", "items", "label"],
                          ),
                          e(
                            Se,
                            {
                              modelValue: t(g).tags,
                              "onUpdate:modelValue": r[4] || (r[4] = (n) => (t(g).tags = n)),
                              items: t(f).tags,
                              label: t(a)("SetDownloader.PathAndTag.tags.title"),
                            },
                            null,
                            8,
                            ["modelValue", "items", "label"],
                          ),
                        ]),
                        _: 1,
                      }),
                    ]),
                    _: 1,
                  }),
                  e(h),
                  e(oe, null, {
                    default: l(() => [
                      e(M),
                      e(
                        D,
                        { color: "success", "prepend-icon": "mdi-check-circle-outline", variant: "text", onClick: k },
                        { default: l(() => [S(v(t(a)("common.dialog.ok")), 1)]), _: 1 },
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
  Cl = ["href"],
  it = q({
    __name: "Index",
    setup(A) {
      const { t: i } = Y(),
        a = W(),
        o = Ue(),
        g = C(!1),
        s = C(!1),
        f = C(!1),
        $ = C(!1),
        y = C(!1),
        k = C(!1),
        m = K(() => al(a.getDownloaders, (U) => U.type)),
        u = ve(async () => {
          const U = {};
          for (const c of new Set(a.getDownloaders.map((d) => d.type))) U[c] = await se(c);
          return U;
        }, {}),
        r = [
          { title: "№", key: "sortIndex", align: "end", width: "100" },
          { title: i("common.type"), key: "type", align: "center" },
          { title: i("SetDownloader.common.name"), key: "name", align: "start" },
          { title: i("SetDownloader.common.address"), key: "address", align: "start" },
          { title: i("common.username"), key: "username", align: "start" },
          { title: i("SetDownloader.index.table.enabled"), key: "enabled", align: "center" },
          { title: i("SetDownloader.index.table.autodl"), key: "feature.DefaultAutoStart", align: "center" },
          { title: i("common.action"), key: "action", sortable: !1 },
        ],
        n = C([]),
        w = {
          "feature.DefaultAutoStart": "SetDownloader.index.table.autodl",
          enabled: "SetDownloader.index.table.enabled",
        },
        {
          tableWaitFilterRef: L,
          tableFilterRef: I,
          tableFilterFn: b,
          advanceFilterDictRef: p,
          updateTableFilterValueFn: Ve,
          buildFilterDictFn: Me,
          toggleKeywordStateFn: we,
        } = dl({
          parseOptions: { keywords: ["type", ...Object.keys(w)] },
          titleFields: ["name", "address"],
          format: { enabled: "boolean", "feature.DefaultAutoStart": "boolean" },
          initialItems: a.getDownloaders,
          watchItems: !0,
        }),
        H = C(null);
      function Ee(U) {
        ((H.value = U), (s.value = !0));
      }
      function Le(U) {
        ((H.value = U), (y.value = !0));
      }
      function Ne(U) {
        ((H.value = U), ($.value = !0));
      }
      const be = C([]);
      function De(U) {
        ((be.value = U.filter((c) => c !== a.defaultDownloader?.id)), (k.value = !0));
      }
      async function ze(U) {
        return await a.removeDownloader(U);
      }
      return (U, c) => (
        V(),
        F(
          E,
          null,
          [
            e(ee, { title: t(i)("route.Settings.SetDownloader"), type: "info" }, null, 8, ["title"]),
            e(
              j,
              { class: "set-downloader" },
              {
                default: l(() => [
                  e(G, null, {
                    default: l(() => [
                      e(
                        B,
                        { class: "ma-0" },
                        {
                          default: l(() => [
                            e(
                              ce,
                              {
                                text: t(i)("common.btn.add"),
                                color: "success",
                                icon: "mdi-plus",
                                onClick: c[0] || (c[0] = (d) => (g.value = !0)),
                              },
                              null,
                              8,
                              ["text"],
                            ),
                            e(
                              ce,
                              {
                                disabled: n.value.length === 0,
                                text: t(i)("common.remove"),
                                color: "error",
                                icon: "mdi-minus",
                                onClick: c[1] || (c[1] = (d) => De(n.value)),
                              },
                              null,
                              8,
                              ["disabled", "text"],
                            ),
                            e(h, { class: "mx-2", inset: "", vertical: "" }),
                            e(
                              ce,
                              {
                                disabled: t(a).getDownloaders.length == 0,
                                text: t(i)("SetDownloader.index.editDefaultDownloaderBtn"),
                                color: "indigo",
                                icon: "mdi-auto-download",
                                onClick: c[2] || (c[2] = (d) => (f.value = !0)),
                              },
                              null,
                              8,
                              ["disabled", "text"],
                            ),
                            e(M),
                            e(
                              N,
                              {
                                modelValue: t(L),
                                "onUpdate:modelValue": c[5] || (c[5] = (d) => (ll(L) ? (L.value = d) : null)),
                                "append-icon": "mdi-magnify",
                                clearable: "",
                                density: "compact",
                                "hide-details": "",
                                label: "Search",
                                "max-width": "500",
                                "single-line": "",
                                "onClick:clear": c[6] || (c[6] = (d) => t(Me)("")),
                              },
                              {
                                "prepend-inner": l(() => [
                                  e(
                                    Ge,
                                    { "min-width": "100" },
                                    {
                                      activator: l(({ props: d }) => [
                                        e(ne, ge({ icon: "mdi-filter" }, d, { variant: "plain" }), null, 16),
                                      ]),
                                      default: l(() => [
                                        e(
                                          Ie,
                                          { class: "pa-0" },
                                          {
                                            default: l(() => [
                                              (V(),
                                              F(
                                                E,
                                                null,
                                                z(w, (d, T) =>
                                                  e(
                                                    O,
                                                    null,
                                                    {
                                                      default: l(() => [
                                                        e(
                                                          pe,
                                                          {
                                                            modelValue: t(p)[T].required,
                                                            "onUpdate:modelValue": [
                                                              (J) => (t(p)[T].required = J),
                                                              c[3] || (c[3] = () => t(Ve)()),
                                                            ],
                                                            label: t(i)(d),
                                                            density: "compact",
                                                            "hide-details": "",
                                                            indeterminate: "",
                                                            "true-value": "1",
                                                            onClick: ke((J) => t(we)(T, "1"), ["stop"]),
                                                          },
                                                          null,
                                                          8,
                                                          ["modelValue", "onUpdate:modelValue", "label", "onClick"],
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1024,
                                                  ),
                                                ),
                                                64,
                                              )),
                                              e(h),
                                              e(
                                                Qe,
                                                { class: "ma-2" },
                                                {
                                                  default: l(() => [
                                                    S(v(t(i)("SetDownloader.index.table.downloaderCategory")), 1),
                                                  ]),
                                                  _: 1,
                                                },
                                              ),
                                              (V(!0),
                                              F(
                                                E,
                                                null,
                                                z(
                                                  m.value,
                                                  (d, T) => (
                                                    V(),
                                                    x(
                                                      O,
                                                      { key: T, value: T },
                                                      {
                                                        default: l(() => [
                                                          e(
                                                            pe,
                                                            {
                                                              modelValue: t(p).type.required,
                                                              "onUpdate:modelValue": [
                                                                (J) => (t(p).type.required = J),
                                                                c[4] || (c[4] = () => t(Ve)()),
                                                              ],
                                                              label: `${T} (${d})`,
                                                              value: T,
                                                              density: "compact",
                                                              "hide-details": "",
                                                              indeterminate: "",
                                                              onClick: ke((J) => t(we)("type", T), ["stop"]),
                                                            },
                                                            null,
                                                            8,
                                                            [
                                                              "modelValue",
                                                              "onUpdate:modelValue",
                                                              "label",
                                                              "value",
                                                              "onClick",
                                                            ],
                                                          ),
                                                        ]),
                                                        _: 2,
                                                      },
                                                      1032,
                                                      ["value"],
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
                        },
                      ),
                    ]),
                    _: 1,
                  }),
                  e(
                    vl,
                    {
                      modelValue: n.value,
                      "onUpdate:modelValue": c[7] || (c[7] = (d) => (n.value = d)),
                      "custom-filter": t(b),
                      "filter-keys": ["id"],
                      headers: r,
                      items: t(a).getDownloaders,
                      "items-per-page": t(o).tableBehavior.SetDownloader.itemsPerPage,
                      search: t(I),
                      "sort-by": t(o).tableBehavior.SetDownloader.sortBy,
                      class: "table-stripe table-header-no-wrap",
                      hover: "",
                      "item-value": "id",
                      "multi-sort": t(o).enableTableMultiSort,
                      "show-select": "",
                      "onUpdate:itemsPerPage":
                        c[8] || (c[8] = (d) => t(o).updateTableBehavior("SetDownloader", "itemsPerPage", d)),
                      "onUpdate:sortBy": c[9] || (c[9] = (d) => t(o).updateTableBehavior("SetDownloader", "sortBy", d)),
                    },
                    {
                      "item.type": l(({ item: d }) => [
                        e(Xe, { image: t(Z)(d.type), alt: d.type }, null, 8, ["image", "alt"]),
                      ]),
                      "item.name": l(({ item: d }) => [
                        d.id == t(a).defaultDownloader?.id
                          ? (V(), x(ne, { key: 0, icon: "mdi-pin mdi-rotate-45", color: "indigo", class: "mr-1" }))
                          : _("", !0),
                        P(
                          "span",
                          { class: tl(["font-weight-bold", { "text-indigo": d.id == t(a).defaultDownloader?.id }]) },
                          v(d.name),
                          3,
                        ),
                      ]),
                      "item.address": l(({ item: d }) => [
                        P(
                          "a",
                          {
                            href: d.address,
                            class: "text-primary font-weight-medium text-decoration-underline",
                            rel: "noopener noreferrer nofollow",
                            target: "_blank",
                          },
                          [S(v(d.address) + " ", 1), e(ne, { icon: "mdi-open-in-new", size: "x-small" })],
                          8,
                          Cl,
                        ),
                      ]),
                      "item.enabled": l(({ item: d }) => [
                        e(
                          ie,
                          {
                            modelValue: d.enabled,
                            "onUpdate:modelValue": [
                              (T) => (d.enabled = T),
                              (T) => t(a).simplePatch("downloaders", d.id, "enabled", T),
                            ],
                            readonly: d.id == t(a).defaultDownloader?.id,
                            class: "table-switch-btn",
                            color: "success",
                            "hide-details": "",
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue", "readonly"],
                        ),
                      ]),
                      "item.feature.DefaultAutoStart": l(({ item: d }) => [
                        e(
                          ie,
                          {
                            modelValue: d.feature.DefaultAutoStart,
                            "onUpdate:modelValue": [
                              (T) => (d.feature.DefaultAutoStart = T),
                              (T) => t(a).simplePatch("downloaders", d.id, "feature.DefaultAutoStart", T),
                            ],
                            disabled: !d.enabled || t(u)?.[d.type]?.feature?.DefaultAutoStart.allowed === !1,
                            class: "table-switch-btn",
                            color: "success",
                            "hide-details": "",
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue", "disabled"],
                        ),
                      ]),
                      "item.action": l(({ item: d }) => [
                        e(
                          Je,
                          { class: "table-action", density: "compact", variant: "plain" },
                          {
                            default: l(() => [
                              e(
                                D,
                                {
                                  disabled: !0,
                                  title: t(i)("SetDownloader.index.table.action.status"),
                                  icon: "mdi-information-outline",
                                  size: "small",
                                },
                                null,
                                8,
                                ["title"],
                              ),
                              e(
                                D,
                                {
                                  title: t(i)("common.edit"),
                                  color: "info",
                                  icon: "mdi-pencil",
                                  size: "small",
                                  onClick: (T) => Ee(d.id),
                                },
                                null,
                                8,
                                ["title", "onClick"],
                              ),
                              e(
                                D,
                                {
                                  title: t(i)("SetDownloader.index.table.action.setPathAndTag"),
                                  color: "amber",
                                  icon: "mdi-folder-settings",
                                  size: "small",
                                  onClick: (T) => Le(d.id),
                                },
                                null,
                                8,
                                ["title", "onClick"],
                              ),
                              t(o).download.allowDownloaderFilterForSite
                                ? (V(),
                                  x(
                                    D,
                                    {
                                      key: 0,
                                      disabled: !d.enabled,
                                      title: t(i)("SetDownloader.index.table.action.setSiteFilter"),
                                      color: "cyan",
                                      icon: "mdi-filter-variant",
                                      size: "small",
                                      onClick: (T) => Ne(d.id),
                                    },
                                    null,
                                    8,
                                    ["disabled", "title", "onClick"],
                                  ))
                                : _("", !0),
                              e(
                                D,
                                {
                                  title: t(i)("common.remove"),
                                  disabled: d.id == t(a).defaultDownloader?.id,
                                  color: "error",
                                  icon: "mdi-delete",
                                  size: "small",
                                  onClick: (T) => De([d.id]),
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
                    ["modelValue", "custom-filter", "items", "items-per-page", "search", "sort-by", "multi-sort"],
                  ),
                ]),
                _: 1,
              },
            ),
            e(Vl, { modelValue: g.value, "onUpdate:modelValue": c[10] || (c[10] = (d) => (g.value = d)) }, null, 8, [
              "modelValue",
            ]),
            e(
              wl,
              {
                modelValue: s.value,
                "onUpdate:modelValue": c[11] || (c[11] = (d) => (s.value = d)),
                "client-id": H.value,
              },
              null,
              8,
              ["modelValue", "client-id"],
            ),
            e(kl, { modelValue: f.value, "onUpdate:modelValue": c[12] || (c[12] = (d) => (f.value = d)) }, null, 8, [
              "modelValue",
            ]),
            e(
              Sl,
              {
                modelValue: $.value,
                "onUpdate:modelValue": c[13] || (c[13] = (d) => ($.value = d)),
                "client-id": H.value,
              },
              null,
              8,
              ["modelValue", "client-id"],
            ),
            e(
              yl,
              {
                modelValue: y.value,
                "onUpdate:modelValue": c[14] || (c[14] = (d) => (y.value = d)),
                "client-id": H.value,
              },
              null,
              8,
              ["modelValue", "client-id"],
            ),
            e(
              pl,
              {
                modelValue: k.value,
                "onUpdate:modelValue": c[15] || (c[15] = (d) => (k.value = d)),
                "to-delete-ids": be.value,
                "confirm-delete": ze,
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
export { it as default };
