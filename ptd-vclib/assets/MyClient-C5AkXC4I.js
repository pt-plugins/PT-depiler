import {
  bN as Q,
  bV as ne,
  s as se,
  f as W,
  j as te,
  a4 as ie,
  a5 as re,
  c as w,
  i as le,
  e as Ue,
  t as q,
  g as we,
  a2 as ge,
  l as be,
  c2 as Ce,
  B as $e,
  C as ze,
  F as Be,
  x as j,
  D as Pe,
  cf as Z,
  O as he,
  V as Ve,
  bz as Ae,
  T as Le,
  H as Fe,
  h as He,
  o as je,
  a3 as Ne,
  d as Oe,
  a7 as Ee,
} from "./src/entries/options/index-DmNe5UVo.js";
import { i as ke } from "../vendor/packages/downloader/index-BATa0ddy.js";
import {
  X as Y,
  cb as de,
  ch as qe,
  I as z,
  ck as a,
  a$ as ye,
  br as g,
  U as t,
  c4 as l,
  bj as v,
  L as P,
  F as ue,
  Q as R,
  bS as r,
  H as C,
  ae as Je,
  bC as J,
  D as F,
  bu as Qe,
  J as E,
  bf as Ge,
  bh as Ke,
  aQ as We,
  b0 as Xe,
  b3 as Ye,
} from "../vendor/packages/site/index-COeZNva1.js";
import { e as L, b as Ze } from "./utils-DF6YUpNn.js";
import { _ as et } from "./DeleteDialog.vue_vue_type_script_setup_true_lang-CkaHuNvW.js";
import { V as tt } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import { _ as lt } from "./Index.vue_vue_type_script_setup_true_lang-BRuNpdRn.js";
import { V as at } from "../vendor/vuetify/VTextarea-hZu3Ftop.js";
import { V as ot } from "../vendor/vuetify/VFileInput-rB5Lk1yB.js";
import { C as A } from "../vendor/packages/downloader/types-bvm8eB57.js";
import { V as nt } from "../vendor/vuetify/VTooltip-BF7r8Igl.js";
import { V as st } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as it } from "../vendor/vuetify/VNumberInput-ZpDwJV6p.js";
import { V as rt } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "./___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/es-toolkit/toMerged-Be-qf92q.js";
import "../vendor/es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../vendor/vuetify/VForm-CJoKT4R8.js";
import "../vendor/vuetify/VAutocomplete-DUqyo09O.js";
import "../vendor/vuetify/VSwitch-CFTblx63.js";
import "../vendor/vuetify/VExpansionPanels-Bs-8zb91.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
const dt = Y({
    __name: "DeleteDialog",
    props: ye(
      { toDeleteIds: {}, confirmDelete: { type: Function } },
      { modelValue: { type: Boolean }, modelModifiers: {} },
    ),
    emits: ye(["allDelete"], ["update:modelValue"]),
    setup(T, { emit: o }) {
      const f = de(T, "modelValue"),
        b = T,
        m = o,
        { t: k } = Q(),
        y = g(!1);
      qe(f, (D) => {
        D && (y.value = !1);
      });
      function x(D) {
        return b.confirmDelete(D, y.value);
      }
      return (D, M) => (
        v(),
        z(
          et,
          {
            modelValue: f.value,
            "onUpdate:modelValue": M[1] || (M[1] = (B) => (f.value = B)),
            "to-delete-ids": T.toDeleteIds,
            "confirm-delete": x,
            onAllDelete: M[2] || (M[2] = (B) => m("allDelete")),
          },
          {
            "append-text": a(() => [
              t(
                tt,
                {
                  modelValue: y.value,
                  "onUpdate:modelValue": M[0] || (M[0] = (B) => (y.value = B)),
                  label: l(k)("MyClient.dialog.removeData"),
                  color: "error",
                  density: "compact",
                  "hide-details": "",
                },
                null,
                8,
                ["modelValue", "label"],
              ),
            ]),
            _: 1,
          },
          8,
          ["modelValue", "to-delete-ids"],
        )
      );
    },
  }),
  ut = { class: "ml-1" },
  ct = { class: "ml-1" },
  mt = Y({
    __name: "PushToDownloaderDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(T) {
      const o = de(T, "modelValue"),
        f = ne(),
        { t: b } = Q(),
        m = g("url"),
        k = g(""),
        y = g([]),
        x = g(!1),
        D = g([]);
      function M() {
        ((m.value = "url"), (k.value = ""), (y.value = []));
      }
      async function B() {
        const I = [];
        if (m.value === "url") {
          const s = k.value
            .split(
              `
`,
            )
            .map((u) => u.trim())
            .filter(Boolean);
          for (const u of s) {
            const i = { link: u, title: u };
            if (u.match(/^https?:\/\//)) {
              const V = Je(u);
              f.siteHostMap[V] && (i.site = f.siteHostMap[V]);
            }
            I.push(i);
          }
        } else
          for (const s of y.value) {
            const u = await new Promise((i, V) => {
              const U = new FileReader();
              ((U.onload = () => i(U.result)), (U.onerror = V), U.readAsDataURL(s));
            });
            I.push({ link: u, title: s.name.replace(/\.torrent$/i, ""), site: "", id: s.name });
          }
        I.length !== 0 && ((D.value = I), (o.value = !1), (x.value = !0));
      }
      return (I, s) => (
        v(),
        P(
          ue,
          null,
          [
            t(
              se,
              {
                modelValue: o.value,
                "onUpdate:modelValue": s[5] || (s[5] = (u) => (o.value = u)),
                "max-width": "560",
                scrollable: "",
                onAfterEnter: M,
              },
              {
                default: a(() => [
                  t(W, null, {
                    default: a(() => [
                      t(
                        te,
                        { class: "pa-0" },
                        {
                          default: a(() => [
                            t(
                              ie,
                              { color: "blue-grey-darken-2" },
                              {
                                append: a(() => [
                                  t(
                                    w,
                                    {
                                      icon: "mdi-close",
                                      title: l(b)("common.dialog.close"),
                                      onClick: s[0] || (s[0] = (u) => (o.value = !1)),
                                    },
                                    null,
                                    8,
                                    ["title"],
                                  ),
                                ]),
                                default: a(() => [
                                  t(re, null, {
                                    default: a(() => [R(r(l(b)("MyClient.pushToDownloader.title")), 1)]),
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
                      t(le, null, {
                        default: a(() => [
                          t(
                            Ue,
                            {
                              modelValue: m.value,
                              "onUpdate:modelValue": s[1] || (s[1] = (u) => (m.value = u)),
                              class: "mb-4",
                              mandatory: "",
                              density: "compact",
                              variant: "outlined",
                            },
                            {
                              default: a(() => [
                                t(
                                  w,
                                  { value: "url", "prepend-icon": "mdi-link-variant" },
                                  { default: a(() => [R(r(l(b)("MyClient.pushToDownloader.modeUrl")), 1)]), _: 1 },
                                ),
                                t(
                                  w,
                                  { value: "file", "prepend-icon": "mdi-file-upload" },
                                  { default: a(() => [R(r(l(b)("MyClient.pushToDownloader.modeFile")), 1)]), _: 1 },
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue"],
                          ),
                          m.value === "url"
                            ? (v(),
                              z(
                                at,
                                {
                                  key: 0,
                                  modelValue: k.value,
                                  "onUpdate:modelValue": s[2] || (s[2] = (u) => (k.value = u)),
                                  label: l(b)("MyClient.pushToDownloader.urlInputLabel"),
                                  hint: l(b)("MyClient.pushToDownloader.urlInputHint"),
                                  "persistent-hint": "",
                                  "auto-grow": "",
                                  rows: "3",
                                  clearable: "",
                                },
                                null,
                                8,
                                ["modelValue", "label", "hint"],
                              ))
                            : (v(),
                              z(
                                ot,
                                {
                                  key: 1,
                                  modelValue: y.value,
                                  "onUpdate:modelValue": s[3] || (s[3] = (u) => (y.value = u)),
                                  accept: ".torrent",
                                  label: l(b)("MyClient.pushToDownloader.fileInputLabel"),
                                  hint: l(b)("MyClient.pushToDownloader.fileInputHint"),
                                  "persistent-hint": "",
                                  multiple: "",
                                  "show-size": "",
                                  "prepend-icon": "mdi-file-document",
                                },
                                null,
                                8,
                                ["modelValue", "label", "hint"],
                              )),
                        ]),
                        _: 1,
                      }),
                      t(q),
                      t(we, null, {
                        default: a(() => [
                          t(ge),
                          t(
                            w,
                            {
                              color: "info",
                              "prepend-icon": "mdi-close-circle",
                              variant: "text",
                              onClick: s[4] || (s[4] = (u) => (o.value = !1)),
                            },
                            { default: a(() => [C("span", ut, r(l(b)("common.dialog.cancel")), 1)]), _: 1 },
                          ),
                          t(
                            w,
                            {
                              disabled: m.value === "url" ? !k.value.trim() : y.value.length === 0,
                              color: "success",
                              "prepend-icon": "mdi-cloud-upload",
                              variant: "text",
                              onClick: B,
                            },
                            { default: a(() => [C("span", ct, r(l(b)("common.dialog.ok")), 1)]), _: 1 },
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
            ),
            t(
              lt,
              {
                modelValue: x.value,
                "onUpdate:modelValue": s[6] || (s[6] = (u) => (x.value = u)),
                "torrent-items": D.value,
                onDone: s[7] || (s[7] = () => (o.value = !1)),
              },
              null,
              8,
              ["modelValue", "torrent-items"],
            ),
          ],
          64,
        )
      );
    },
  }),
  pt = Y({
    __name: "TorrentStateTd",
    props: { item: {} },
    setup(T) {
      const { t: o } = Q(),
        f = {
          [A.downloading]: { color: "blue", icon: "mdi-download", label: "MyClient.state.downloading" },
          [A.seeding]: { color: "green", icon: "mdi-upload", label: "MyClient.state.seeding" },
          [A.paused]: { color: "grey", icon: "mdi-pause", label: "MyClient.state.paused" },
          [A.queued]: { color: "orange", icon: "mdi-clock-outline", label: "MyClient.state.queued" },
          [A.checking]: { color: "cyan", icon: "mdi-refresh", label: "MyClient.state.checking" },
          [A.error]: { color: "red", icon: "mdi-alert-circle", label: "MyClient.state.error" },
          [A.unknown]: { color: "grey", icon: "mdi-help-circle", label: "MyClient.state.unknown" },
        };
      return (b, m) => (
        v(),
        z(
          be,
          { color: f[T.item.state]?.color ?? "grey", "prepend-icon": f[T.item.state]?.icon, size: "small", label: "" },
          { default: a(() => [R(r(l(o)(f[T.item.state]?.label ?? "MyClient.state.unknown")), 1)]), _: 1 },
          8,
          ["color", "prepend-icon"],
        )
      );
    },
  }),
  X = g({}),
  H = g([]),
  N = g(new Set()),
  O = g(0),
  $ = g(!1),
  K = new Map(),
  ee = new Map();
function xe() {
  const { t: T } = Q(),
    o = ne(),
    f = Ce(),
    b = F(() => o.getEnabledDownloaders),
    m = F(() => (H.value.length > 0 ? H.value : b.value.map((i) => i.id)));
  function k(i) {
    const V = ee.get(i);
    V !== void 0 && (clearTimeout(V), ee.delete(i));
  }
  async function y(i) {
    try {
      const V = await J("getClientTorrents", i);
      ((X.value = { ...X.value, [i]: V }), K.set(i, 0));
    } catch {
      const U = (K.get(i) ?? 0) + 1;
      (K.set(i, U),
        U >= 3 &&
          (N.value.add(i),
          k(i),
          f.showSnakebar(T("MyClient.autoRefresh.clientSuspended", { name: o.downloaders[i]?.name ?? i }), {
            color: "error",
            timeout: 8e3,
          })));
    }
  }
  function x(i) {
    if (!$.value || N.value.has(i) || O.value <= 0) return;
    k(i);
    const V = window.setTimeout(async () => {
      (await y(i), x(i));
    }, O.value * 1e3);
    ee.set(i, V);
  }
  function D() {
    for (const i of ee.keys()) k(i);
    $.value = !1;
  }
  function M() {
    ((N.value = new Set()), K.clear());
  }
  function B(i) {
    (N.value.delete(i), K.set(i, 0), $.value && x(i));
  }
  function I() {
    if (!(O.value <= 0)) {
      $.value = !0;
      for (const i of m.value) x(i);
    }
  }
  function s() {
    (D(), M());
  }
  function u() {
    $.value ? s() : I();
  }
  return {
    enabledDownloaders: b,
    activeDownloaderIds: m,
    loadSingleDownloader: y,
    clearDownloaderTimer: k,
    scheduleDownloaderRefresh: x,
    stopAllTimers: D,
    resetRefreshState: M,
    resumeDownloaderRefresh: B,
    startAutoRefresh: I,
    stopAutoRefresh: s,
    toggleAutoRefresh: u,
  };
}
const ft = { key: 0, class: "ml-2 text-caption text-grey" },
  vt = ["href"],
  yt = { key: 1, class: "text-end text-caption mr-2" },
  wt = { class: "d-flex align-center justify-end ga-1" },
  gt = { class: "text-no-wrap" },
  bt = { class: "d-flex align-center justify-end ga-1" },
  Ct = { class: "text-no-wrap" },
  ht = { class: "text-grey" },
  Vt = Y({
    __name: "ClientStatusDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(T) {
      const o = de(T, "modelValue"),
        { t: f } = Q(),
        { enabledDownloaders: b, resumeDownloaderRefresh: m, clearDownloaderTimer: k } = xe(),
        y = g({}),
        x = g({}),
        D = g({});
      function M(c) {
        return H.value.length === 0 || H.value.includes(c);
      }
      function B(c) {
        const h = H.value.indexOf(c);
        h >= 0 ? H.value.splice(h, 1) : H.value.push(c);
      }
      function I(c) {
        return (X.value[c] ?? []).length;
      }
      function s(c) {
        return typeof c < "u" ? L(c) : "-";
      }
      async function u(c) {
        D.value[c] = !0;
        try {
          typeof x.value[c] > "u" && (x.value[c] = (await J("getDownloaderVersion", c)) ?? "—");
          const h = await J("getDownloaderStatus", c);
          h && (y.value[c] = h);
        } finally {
          D.value[c] = !1;
        }
      }
      function i(c) {
        (N.value.add(c), k(c));
      }
      async function V() {
        await Promise.allSettled(b.value.map((c) => u(c.id)));
      }
      function U() {
        V();
      }
      return (c, h) => (
        v(),
        z(
          se,
          {
            modelValue: o.value,
            "onUpdate:modelValue": h[3] || (h[3] = (p) => (o.value = p)),
            "max-width": "800",
            scrollable: "",
            onAfterEnter: h[4] || (h[4] = (p) => U()),
          },
          {
            default: a(() => [
              t(W, null, {
                default: a(() => [
                  t(
                    te,
                    { class: "pa-0" },
                    {
                      default: a(() => [
                        t(
                          ie,
                          { color: "blue-grey-darken-2" },
                          {
                            append: a(() => [
                              t(w, { icon: "mdi-refresh", title: l(f)("MyClient.refresh"), onClick: V }, null, 8, [
                                "title",
                              ]),
                              t(
                                w,
                                {
                                  icon: "mdi-close",
                                  title: l(f)("common.dialog.close"),
                                  onClick: h[0] || (h[0] = (p) => (o.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: a(() => [
                              t(re, null, {
                                default: a(() => [R(r(l(f)("MyClient.clientStatusDialog.title")), 1)]),
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
                  t(q),
                  t(le, null, {
                    default: a(() => [
                      t($e, null, {
                        default: a(() => [
                          (v(!0),
                          P(
                            ue,
                            null,
                            Qe(
                              l(b),
                              (p) => (
                                v(),
                                z(
                                  ze,
                                  {
                                    key: p.id,
                                    active: M(p.id),
                                    color: "primary",
                                    rounded: "",
                                    onClick: (G) => B(p.id),
                                  },
                                  {
                                    prepend: a(() => [
                                      t(Ve, { image: l(ke)(p.type), size: "32", class: "mr-2" }, null, 8, ["image"]),
                                    ]),
                                    append: a(() => [
                                      D.value[p.id]
                                        ? (v(),
                                          z(he, { key: 0, indeterminate: "", size: "20", width: "2", class: "mr-4" }))
                                        : (v(),
                                          P("div", yt, [
                                            C("div", wt, [
                                              t(j, { color: "green-darken-4", icon: "mdi-chevron-up", size: "small" }),
                                              C(
                                                "span",
                                                gt,
                                                r(s(y.value[p.id]?.upSpeed)) +
                                                  "/s (" +
                                                  r(s(y.value[p.id]?.upData)) +
                                                  ") ",
                                                1,
                                              ),
                                            ]),
                                            C("div", bt, [
                                              t(j, { color: "red-darken-4", icon: "mdi-chevron-down", size: "small" }),
                                              C(
                                                "span",
                                                Ct,
                                                r(s(y.value[p.id]?.dlSpeed)) +
                                                  "/s (" +
                                                  r(s(y.value[p.id]?.dlData)) +
                                                  ") ",
                                                1,
                                              ),
                                            ]),
                                            C(
                                              "div",
                                              ht,
                                              r(l(f)("MyClient.clientStatusDialog.torrentCount", { count: I(p.id) })),
                                              1,
                                            ),
                                          ])),
                                      t(q, { vertical: "", class: "mx-2" }),
                                      l(N).has(p.id)
                                        ? (v(),
                                          z(
                                            w,
                                            {
                                              key: 2,
                                              title: l(f)("MyClient.autoRefresh.resumeDownloader"),
                                              icon: "mdi-refresh",
                                              color: "error",
                                              size: "small",
                                              variant: "text",
                                              onClick: Z((G) => l(m)(p.id), ["stop"]),
                                            },
                                            null,
                                            8,
                                            ["title", "onClick"],
                                          ))
                                        : (v(),
                                          z(
                                            w,
                                            {
                                              key: 3,
                                              title: l(f)("MyClient.autoRefresh.stopDownloader"),
                                              disabled: !l($),
                                              color: "amber",
                                              size: "small",
                                              icon: "mdi-stop",
                                              variant: "text",
                                              onClick: Z(() => i(p.id), ["stop"]),
                                            },
                                            null,
                                            8,
                                            ["title", "disabled", "onClick"],
                                          )),
                                      t(
                                        w,
                                        {
                                          href: p.address,
                                          title: l(f)("MyClient.clientStatusDialog.openClient"),
                                          icon: "mdi-open-in-new",
                                          rel: "noopener noreferrer nofollow",
                                          size: "small",
                                          target: "_blank",
                                          variant: "text",
                                          onClick: h[2] || (h[2] = Z(() => {}, ["stop"])),
                                        },
                                        null,
                                        8,
                                        ["href", "title"],
                                      ),
                                    ]),
                                    default: a(() => [
                                      t(
                                        Be,
                                        { class: "font-weight-bold" },
                                        {
                                          default: a(() => [
                                            R(r(p.name) + " ", 1),
                                            x.value[p.id] ? (v(), P("span", ft, r(x.value[p.id]), 1)) : E("", !0),
                                            l(N).has(p.id)
                                              ? (v(),
                                                z(
                                                  j,
                                                  {
                                                    key: 1,
                                                    icon: "mdi-alert-circle",
                                                    color: "error",
                                                    size: "x-small",
                                                    class: "ml-1",
                                                  },
                                                  {
                                                    default: a(() => [
                                                      t(
                                                        nt,
                                                        { activator: "parent", location: "bottom" },
                                                        {
                                                          default: a(() => [
                                                            R(r(l(f)("MyClient.autoRefresh.suspendedTip")), 1),
                                                          ]),
                                                          _: 1,
                                                        },
                                                      ),
                                                    ]),
                                                    _: 1,
                                                  },
                                                ))
                                              : E("", !0),
                                          ]),
                                          _: 2,
                                        },
                                        1024,
                                      ),
                                      t(
                                        Pe,
                                        null,
                                        {
                                          default: a(() => [
                                            C(
                                              "a",
                                              {
                                                href: p.address,
                                                class: "text-primary text-decoration-underline text-caption",
                                                rel: "noopener noreferrer nofollow",
                                                target: "_blank",
                                                onClick: h[1] || (h[1] = Z(() => {}, ["stop"])),
                                              },
                                              r(p.address),
                                              9,
                                              vt,
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
                                  ["active", "onClick"],
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
  kt = { key: 1, class: "grey--text caption" },
  xt = { class: "d-flex flex-column align-center" },
  Dt = { class: "text-caption text-no-wrap mt-1" },
  Mt = { class: "font-weight-medium" },
  St = { key: 0, class: "text-caption text-grey" },
  _t = { class: "text-no-wrap" },
  Tt = { class: "text-caption" },
  It = { key: 0, class: "text-no-wrap text-green-darken-2" },
  Rt = { key: 1, class: "text-grey" },
  Ut = { key: 0, class: "text-no-wrap text-blue-darken-2" },
  $t = { key: 1, class: "text-grey" },
  zt = { class: "text-no-wrap text-green-darken-2" },
  Bt = { class: "text-no-wrap text-blue-darken-2" },
  Pt = { class: "text-caption text-no-wrap" },
  At = { class: "text-no-wrap text-caption" },
  Lt = { class: "text-body-2" },
  Ft = Y({
    __name: "Index",
    setup(T) {
      const { t: o } = Q(),
        f = ne(),
        b = Ce(),
        m = Ae(),
        {
          activeDownloaderIds: k,
          loadSingleDownloader: y,
          scheduleDownloaderRefresh: x,
          stopAllTimers: D,
          resetRefreshState: M,
          toggleAutoRefresh: B,
        } = xe(),
        I = g(!1),
        s = g([]),
        u = g(""),
        i = g(!1),
        V = g([]),
        U = g(!1),
        c = g(!1),
        h = g(null);
      function p(d) {
        ((h.value = d), (c.value = !0));
      }
      const G = g(!1),
        De = F(() => ae.value.reduce((d, n) => d + (n.uploadSpeed ?? 0), 0)),
        Me = F(() => ae.value.reduce((d, n) => d + (n.downloadSpeed ?? 0), 0)),
        ae = F(() => Object.values(X.value).flat()),
        Se = F(() => {
          const n = k.value.flatMap((S) => X.value[S] ?? []);
          if (!u.value) return n;
          const e = u.value.toLowerCase();
          return n.filter(
            (S) =>
              S.name.toLowerCase().includes(e) ||
              S.infoHash.toLowerCase().includes(e) ||
              (S.label ?? "").toLowerCase().includes(e) ||
              S.savePath.toLowerCase().includes(e),
          );
        }),
        ce = F(() => [
          {
            title: o("MyClient.table.client"),
            key: "clientId",
            align: "center",
            width: "120",
            props: { disabled: !0 },
          },
          { title: o("MyClient.table.name"), key: "name", align: "start", minWidth: "20rem", props: { disabled: !0 } },
          { title: o("MyClient.table.size"), key: "totalSize", align: "end", width: "110" },
          { title: o("MyClient.table.progress"), key: "progress", align: "end", width: "90" },
          { title: o("MyClient.table.status"), key: "state", align: "center", width: "110" },
          { title: o("MyClient.table.upSpeed"), key: "uploadSpeed", align: "end", width: "100" },
          { title: o("MyClient.table.dlSpeed"), key: "downloadSpeed", align: "end", width: "100" },
          { title: o("MyClient.table.totalUploaded"), key: "totalUploaded", align: "end", width: "100" },
          { title: o("MyClient.table.totalDownloaded"), key: "totalDownloaded", align: "end", width: "100" },
          { title: o("MyClient.table.ratio"), key: "ratio", align: "end", width: "60" },
          { title: o("MyClient.table.savePath"), key: "savePath", align: "start" },
          { title: o("MyClient.table.addedAt"), key: "dateAdded", align: "center", width: "160" },
          {
            title: o("common.action"),
            key: "action",
            align: "center",
            sortable: !1,
            width: "120",
            props: { disabled: !0 },
          },
        ]),
        _e = F(() => ce.value.filter((d) => d?.props?.disabled || m.tableBehavior.MyClient?.columns?.includes(d.key)));
      async function oe() {
        ((I.value = !0), (s.value = []), M());
        try {
          await Promise.allSettled(k.value.map((d) => y(d)));
        } finally {
          if (((I.value = !1), $.value)) for (const d of k.value) x(d);
        }
      }
      (Ge(() => {
        m.download.initDownloaderTorrentOnEnter && oe();
      }),
        Ke(() => {
          D();
        }));
      async function me(d) {
        if (d.length === 0) return;
        const e = (
          await Promise.allSettled(d.map((_) => J("pauseClientTorrent", { downloaderId: _.clientId, id: _.id })))
        ).filter((_) => _.status === "fulfilled" && !!_.value).length;
        b.showSnakebar(o("MyClient.action.pauseSelectedSuccess", { count: e }), { color: "success" });
        const S = [...new Set(d.map((_) => _.clientId))];
        await Promise.allSettled(S.map(y));
      }
      async function pe(d) {
        if (d.length === 0) return;
        const e = (
          await Promise.allSettled(d.map((_) => J("resumeClientTorrent", { downloaderId: _.clientId, id: _.id })))
        ).filter((_) => _.status === "fulfilled" && !!_.value).length;
        b.showSnakebar(o("MyClient.action.resumeSelectedSuccess", { count: e }), { color: "success" });
        const S = [...new Set(d.map((_) => _.clientId))];
        await Promise.allSettled(S.map(y));
      }
      function fe(d) {
        ((V.value = d), (i.value = !0));
      }
      async function Te(d, n) {
        const e = V.value.find((S) => ve(S) === d);
        e && (await J("deleteClientTorrent", { downloaderId: e.clientId, id: e.id, removeData: n }));
      }
      function Ie(d) {
        return f.downloaders[d]?.name ?? d;
      }
      function Re(d) {
        const n = f.downloaders[d]?.type;
        return n ? ke(n) : void 0;
      }
      function ve(d) {
        return `${d.clientId}:${String(d.id)}`;
      }
      return (d, n) => (
        v(),
        P(
          ue,
          null,
          [
            t(
              st,
              { title: l(o)("route.Overview.MyClient"), type: "info" },
              {
                append: a(() => [
                  t(
                    w,
                    {
                      title: l(o)("MyClient.clientStatusDialog.openBtn"),
                      class: "mr-2 status-btn",
                      color: "primary",
                      size: "small",
                      onClick: n[0] || (n[0] = (e) => (G.value = !0)),
                    },
                    {
                      default: a(() => [
                        t(j, { class: "mr-1", icon: "mdi-database-outline", size: "x-small" }),
                        R(" " + r(ae.value.length) + " ", 1),
                        t(j, { class: "mr-1", color: "green-darken-4", icon: "mdi-chevron-up", size: "x-small" }),
                        R(" " + r(l(L)(De.value)) + "/s ", 1),
                        t(j, { class: "mr-1", color: "red-darken-4", icon: "mdi-chevron-down", size: "x-small" }),
                        R(" " + r(l(L)(Me.value)) + "/s ", 1),
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
              ["title"],
            ),
            t(W, null, {
              default: a(() => [
                t(te, null, {
                  default: a(() => [
                    t(
                      Le,
                      { class: "ma-0", align: "center" },
                      {
                        default: a(() => [
                          t(
                            w,
                            {
                              title: l(o)("MyClient.pushToDownloader.navBtn"),
                              color: "primary",
                              icon: "mdi-cloud-upload",
                              variant: "text",
                              onClick: n[1] || (n[1] = (e) => (U.value = !0)),
                            },
                            null,
                            8,
                            ["title"],
                          ),
                          t(q, { vertical: "", class: "mx-2" }),
                          t(
                            w,
                            {
                              disabled: s.value.length === 0,
                              title: l(o)("MyClient.resumeSelected"),
                              color: "success",
                              icon: "mdi-play",
                              variant: "text",
                              onClick: n[2] || (n[2] = () => pe(s.value)),
                            },
                            null,
                            8,
                            ["disabled", "title"],
                          ),
                          t(
                            w,
                            {
                              disabled: s.value.length === 0,
                              title: l(o)("MyClient.pauseSelected"),
                              color: "warning",
                              icon: "mdi-pause",
                              variant: "text",
                              onClick: n[3] || (n[3] = () => me(s.value)),
                            },
                            null,
                            8,
                            ["disabled", "title"],
                          ),
                          t(
                            w,
                            {
                              disabled: s.value.length === 0,
                              title: l(o)("MyClient.deleteSelected"),
                              color: "error",
                              icon: "mdi-delete",
                              variant: "text",
                              onClick: n[4] || (n[4] = () => fe(s.value)),
                            },
                            null,
                            8,
                            ["disabled", "title"],
                          ),
                          t(q, { vertical: "", class: "mx-2" }),
                          t(
                            w,
                            {
                              title: l(o)("MyClient.refresh"),
                              color: "green",
                              icon: "mdi-cached",
                              variant: "text",
                              onClick: oe,
                            },
                            null,
                            8,
                            ["title"],
                          ),
                          t(
                            Fe,
                            { "close-on-content-click": !1, location: "bottom" },
                            {
                              activator: a(({ props: e }) => [
                                t(
                                  w,
                                  Xe(e, {
                                    color: l($) ? "blue" : "grey",
                                    icon: l($) ? "mdi-timer" : "mdi-timer-off-outline",
                                    title: l(o)("MyClient.autoRefresh.btnTitle"),
                                    class: "ml-1",
                                    variant: "text",
                                  }),
                                  null,
                                  16,
                                  ["color", "icon", "title"],
                                ),
                              ]),
                              default: a(() => [
                                t(
                                  W,
                                  { "min-width": "240", class: "pa-2" },
                                  {
                                    default: a(() => [
                                      t(
                                        He,
                                        { class: "pa-1" },
                                        {
                                          default: a(() => [R(r(l(o)("MyClient.autoRefresh.intervalLabel")), 1)]),
                                          _: 1,
                                        },
                                      ),
                                      t(
                                        it,
                                        {
                                          modelValue: l(O),
                                          "onUpdate:modelValue": n[5] || (n[5] = (e) => (We(O) ? (O.value = e) : null)),
                                          label: l(o)("MyClient.autoRefresh.intervalUnit"),
                                          min: 0,
                                          max: 3600,
                                          "control-variant": "stacked",
                                          "hide-details": "",
                                          density: "compact",
                                          class: "ma-1",
                                        },
                                        null,
                                        8,
                                        ["modelValue", "label"],
                                      ),
                                      t(
                                        we,
                                        { class: "pa-1 pt-2" },
                                        {
                                          default: a(() => [
                                            t(
                                              w,
                                              {
                                                color: l($) ? "error" : "success",
                                                "prepend-icon": l($) ? "mdi-stop" : "mdi-play",
                                                disabled: !l($) && l(O) <= 0,
                                                block: "",
                                                variant: "tonal",
                                                onClick: l(B),
                                              },
                                              {
                                                default: a(() => [
                                                  R(
                                                    r(
                                                      l($)
                                                        ? l(o)("MyClient.autoRefresh.stop")
                                                        : l(o)("MyClient.autoRefresh.start"),
                                                    ),
                                                    1,
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["color", "prepend-icon", "disabled", "onClick"],
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
                          t(q, { vertical: "", class: "mx-2" }),
                          t(
                            je,
                            {
                              modelValue: l(m).tableBehavior.MyClient.columns,
                              "onUpdate:modelValue": [
                                n[6] || (n[6] = (e) => (l(m).tableBehavior.MyClient.columns = e)),
                                n[7] || (n[7] = (e) => l(m).updateTableBehavior("MyClient", "columns", e)),
                              ],
                              items: ce.value,
                              "return-object": !1,
                              chips: "",
                              class: "table-header-filter-clear ml-1",
                              density: "compact",
                              "hide-details": "",
                              "item-value": "key",
                              "max-width": "200",
                              multiple: "",
                              "prepend-inner-icon": "mdi-filter-cog",
                              title: l(o)("MyClient.columnSelector"),
                            },
                            {
                              chip: a(({ item: e, index: S }) => [
                                S === 0
                                  ? (v(),
                                    z(
                                      be,
                                      { key: 0 },
                                      { default: a(() => [C("span", null, r(e.title), 1)]), _: 2 },
                                      1024,
                                    ))
                                  : E("", !0),
                                S === 1
                                  ? (v(),
                                    P("span", kt, " (+" + r(l(m).tableBehavior.MyClient.columns.length - 1) + ") ", 1))
                                  : E("", !0),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue", "items", "title"],
                          ),
                          t(ge),
                          t(
                            Ne,
                            {
                              modelValue: u.value,
                              "onUpdate:modelValue": n[8] || (n[8] = (e) => (u.value = e)),
                              "append-icon": "mdi-magnify",
                              clearable: "",
                              density: "compact",
                              "hide-details": "",
                              label: l(o)("MyClient.searchPlaceholder"),
                              "max-width": "400",
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
                t(le, null, {
                  default: a(() => [
                    t(
                      rt,
                      {
                        modelValue: s.value,
                        "onUpdate:modelValue": n[9] || (n[9] = (e) => (s.value = e)),
                        headers: _e.value,
                        items: Se.value,
                        "items-per-page": l(m).tableBehavior.MyClient?.itemsPerPage ?? 25,
                        loading: I.value,
                        "multi-sort": l(m).enableTableMultiSort,
                        "sort-by": l(m).tableBehavior.MyClient?.sortBy,
                        class: "table-stripe table-header-no-wrap table-td-p4",
                        hover: "",
                        "return-object": "",
                        "show-select": "",
                        "onUpdate:itemsPerPage":
                          n[10] || (n[10] = (e) => l(m).updateTableBehavior("MyClient", "itemsPerPage", e)),
                        "onUpdate:sortBy": n[11] || (n[11] = (e) => l(m).updateTableBehavior("MyClient", "sortBy", e)),
                      },
                      {
                        "item.clientId": a(({ item: e }) => [
                          C("div", xt, [
                            t(Ve, { image: Re(e.clientId), size: "22" }, null, 8, ["image"]),
                            C("span", Dt, r(Ie(e.clientId)), 1),
                          ]),
                        ]),
                        "item.name": a(({ item: e }) => [
                          C("div", null, [
                            C("span", Mt, r(e.name), 1),
                            e.label
                              ? (v(),
                                P("div", St, [
                                  t(j, { size: "x-small", icon: "mdi-label-outline" }),
                                  R(" " + r(e.label), 1),
                                ]))
                              : E("", !0),
                          ]),
                        ]),
                        "item.totalSize": a(({ item: e }) => [C("span", _t, r(l(L)(e.totalSize)), 1)]),
                        "item.progress": a(({ item: e }) => [
                          t(
                            he,
                            { "model-value": e.progress, size: 36, width: 3, color: e.isCompleted ? "green" : "blue" },
                            { default: a(() => [C("span", Tt, r(e.progress.toFixed(0)) + "%", 1)]), _: 2 },
                            1032,
                            ["model-value", "color"],
                          ),
                        ]),
                        "item.state": a(({ item: e }) => [t(pt, { item: e }, null, 8, ["item"])]),
                        "item.uploadSpeed": a(({ item: e }) => [
                          e.uploadSpeed > 0
                            ? (v(), P("span", It, r(l(L)(e.uploadSpeed)) + "/s ", 1))
                            : (v(), P("span", Rt, "-")),
                        ]),
                        "item.downloadSpeed": a(({ item: e }) => [
                          e.downloadSpeed > 0
                            ? (v(), P("span", Ut, r(l(L)(e.downloadSpeed)) + "/s ", 1))
                            : (v(), P("span", $t, "-")),
                        ]),
                        "item.totalUploaded": a(({ item: e }) => [C("span", zt, r(l(L)(e.totalUploaded)), 1)]),
                        "item.totalDownloaded": a(({ item: e }) => [C("span", Bt, r(l(L)(e.totalDownloaded)), 1)]),
                        "item.ratio": a(({ item: e }) => [
                          C("span", { class: Ye(e.ratio >= 1 ? "text-green" : "text-red") }, r(e.ratio.toFixed(2)), 3),
                        ]),
                        "item.savePath": a(({ item: e }) => [C("span", Pt, r(e.savePath), 1)]),
                        "item.dateAdded": a(({ item: e }) => [C("span", At, r(l(Ze)(e.dateAdded * 1e3)), 1)]),
                        "item.action": a(({ item: e }) => [
                          t(
                            Oe,
                            { class: "table-action", density: "compact", variant: "plain" },
                            {
                              default: a(() => [
                                e.state === l(A).downloading || e.state === l(A).seeding
                                  ? (v(),
                                    z(
                                      w,
                                      {
                                        key: 0,
                                        title: l(o)("MyClient.action.pause"),
                                        color: "warning",
                                        icon: "mdi-pause",
                                        size: "small",
                                        onClick: () => me([e]),
                                      },
                                      null,
                                      8,
                                      ["title", "onClick"],
                                    ))
                                  : e.state === l(A).paused || e.state === l(A).error
                                    ? (v(),
                                      z(
                                        w,
                                        {
                                          key: 1,
                                          title: l(o)("MyClient.action.resume"),
                                          color: "success",
                                          icon: "mdi-play",
                                          size: "small",
                                          onClick: () => pe([e]),
                                        },
                                        null,
                                        8,
                                        ["title", "onClick"],
                                      ))
                                    : E("", !0),
                                t(
                                  w,
                                  {
                                    title: l(o)("MyClient.action.viewRaw"),
                                    color: "grey",
                                    icon: "mdi-code-json",
                                    size: "small",
                                    onClick: () => p(e),
                                  },
                                  null,
                                  8,
                                  ["title", "onClick"],
                                ),
                                t(
                                  w,
                                  {
                                    title: l(o)("MyClient.action.delete"),
                                    color: "error",
                                    icon: "mdi-delete",
                                    size: "small",
                                    onClick: () => fe([e]),
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
                      ["modelValue", "headers", "items", "items-per-page", "loading", "multi-sort", "sort-by"],
                    ),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            }),
            t(
              dt,
              {
                modelValue: i.value,
                "onUpdate:modelValue": n[12] || (n[12] = (e) => (i.value = e)),
                "to-delete-ids": V.value.map((e) => ve(e)),
                "confirm-delete": Te,
                onAllDelete: oe,
              },
              null,
              8,
              ["modelValue", "to-delete-ids"],
            ),
            t(mt, { modelValue: U.value, "onUpdate:modelValue": n[13] || (n[13] = (e) => (U.value = e)) }, null, 8, [
              "modelValue",
            ]),
            t(Vt, { modelValue: G.value, "onUpdate:modelValue": n[14] || (n[14] = (e) => (G.value = e)) }, null, 8, [
              "modelValue",
            ]),
            t(
              se,
              {
                modelValue: c.value,
                "onUpdate:modelValue": n[16] || (n[16] = (e) => (c.value = e)),
                "max-width": "800",
                scrollable: "",
              },
              {
                default: a(() => [
                  t(W, null, {
                    default: a(() => [
                      t(
                        te,
                        { class: "pa-0" },
                        {
                          default: a(() => [
                            t(
                              ie,
                              { color: "blue-grey-darken-2" },
                              {
                                append: a(() => [
                                  t(
                                    w,
                                    {
                                      icon: "mdi-close",
                                      title: l(o)("common.dialog.close"),
                                      onClick: n[15] || (n[15] = (e) => (c.value = !1)),
                                    },
                                    null,
                                    8,
                                    ["title"],
                                  ),
                                ]),
                                default: a(() => [
                                  t(re, null, { default: a(() => [R(r(l(o)("MyClient.action.viewRaw")), 1)]), _: 1 }),
                                ]),
                                _: 1,
                              },
                            ),
                          ]),
                          _: 1,
                        },
                      ),
                      t(
                        le,
                        { class: "pa-2" },
                        {
                          default: a(() => [C("pre", Lt, r(h.value ? JSON.stringify(h.value, null, 2) : ""), 1)]),
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
          ],
          64,
        )
      );
    },
  }),
  ml = Ee(Ft, [["__scopeId", "data-v-af1c06f2"]]);
export { ml as default };
