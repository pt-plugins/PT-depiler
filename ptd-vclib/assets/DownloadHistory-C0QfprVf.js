import {
  bN as N,
  bV as De,
  V as be,
  a7 as ye,
  s as X,
  f as G,
  j as Y,
  a4 as ie,
  a5 as re,
  c as S,
  i as q,
  B as Ve,
  C as ke,
  t as J,
  p as xe,
  T as V,
  A as M,
  n as R,
  o as te,
  a2 as Q,
  l as K,
  H as Ce,
  g as _e,
  cf as ae,
  a8 as se,
  a9 as ue,
  bz as Ae,
  bE as Ie,
  a3 as Fe,
  d as Se,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as O,
  bv as He,
  H as k,
  U as e,
  b4 as he,
  an as Te,
  bj as g,
  L as x,
  Q as v,
  bS as m,
  c4 as l,
  F as A,
  J as me,
  D as Z,
  cb as ce,
  ck as o,
  a$ as ne,
  br as _,
  bJ as ee,
  bu as P,
  bC as B,
  bp as Re,
  I as z,
  b3 as $e,
  bf as Be,
  aQ as Ue,
} from "../vendor/packages/site/index-COeZNva1.js";
import { b as fe } from "./utils-DF6YUpNn.js";
import { V as Me, _ as Le } from "../vendor/vuetify/VRangeSlider-BDy-mdmM.js";
import { _ as Pe } from "./DeleteDialog.vue_vue_type_script_setup_true_lang-CkaHuNvW.js";
import { i as ze } from "../vendor/packages/downloader/index-BATa0ddy.js";
import { N as E } from "./NavButton-jVIhOejA.js";
import { u as Ge } from "./useResetableRef-DOEDeOaU.js";
import { _ as qe } from "./Index.vue_vue_type_script_setup_true_lang-BRuNpdRn.js";
import { t as Ne } from "../vendor/es-toolkit/throttle-ZuuWXlmb.js";
import { u as Oe, s as je, g as Ee } from "./useAdvanceFilter-CaHJJm2I.js";
import { V as We } from "../vendor/vuetify/VDatePicker-CkT_t8C-.js";
import { Q as Je } from "../vendor/date-fns/format-b1gG6cM7.js";
import { a as Qe } from "../vendor/date-fns/subDays-DlPNbvmn.js";
import { V as de } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import { V as Ke } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as Xe } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/vuetify/VSkeletonLoader-YwNzPI56.js";
import "./___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../vendor/es-toolkit/toMerged-Be-qf92q.js";
import "../vendor/es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../vendor/vuetify/VForm-CJoKT4R8.js";
import "../vendor/vuetify/VAutocomplete-DUqyo09O.js";
import "../vendor/vuetify/VSwitch-CFTblx63.js";
import "../vendor/vuetify/VExpansionPanels-Bs-8zb91.js";
import "../vendor/es-toolkit/isEqual-xRaZZh9v.js";
import "../vendor/es-toolkit/flatten-CRv0zNMl.js";
import "../vendor/date-fns/startOfMonth-CSVGuOFh.js";
import "../vendor/es-toolkit/uniqBy-DEckz2wg.js";
import "../vendor/packages/site/utils/filesize-D_1hx4u8.js";
import "../vendor/packages/site/utils/datetime-DQxMK7bP.js";
import "../vendor/date-fns/sub-D9RLuzs0.js";
import "../vendor/vuetify/VBadge-MSR38gir.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
const Ye = { class: "downloader_label" },
  Ze = { class: "pa-0 downloader_icon" },
  el = { class: "downloader_info align-self-center" },
  ll = { class: "font-weight-bold" },
  ol = { key: 2, class: "text-decoration-line-through text-no-wrap" },
  tl = ["href"],
  al = O({
    __name: "DownloaderLabel",
    props: { downloader: {} },
    setup(s) {
      const { t: n } = N(),
        u = De().downloaders[s.downloader],
        c = Z(() =>
          s.downloader === "local"
            ? { color: "amber", icon: "mdi-folder-download", size: 40 }
            : u
              ? { image: ze(u.type) }
              : { icon: "mdi-cloud-remove", color: "grey", size: 40 },
        );
      return (D, C) =>
        He(
          D.$slots,
          "default",
          { config: l(u), icon: c.value },
          () => [
            k("div", Ye, [
              k("div", Ze, [e(be, he(Te(c.value)), null, 16)]),
              k("div", el, [
                k("span", ll, [
                  s.downloader === "local"
                    ? (g(), x(A, { key: 0 }, [v(m(l(n)("downloaderLabel.localDownload")), 1)], 64))
                    : l(u)
                      ? (g(), x(A, { key: 1 }, [v(m(l(u).name), 1)], 64))
                      : (g(), x("span", ol, "[" + m(s.downloader) + "]", 1)),
                ]),
                l(u)
                  ? (g(),
                    x(
                      A,
                      { key: 0 },
                      [
                        C[0] || (C[0] = k("br", null, null, -1)),
                        k(
                          "a",
                          { href: l(u).address, class: "text-caption", target: "_blank" },
                          " [" + m(l(u).address) + "] ",
                          9,
                          tl,
                        ),
                      ],
                      64,
                    ))
                  : me("", !0),
              ]),
            ]),
          ],
          !0,
        );
    },
  }),
  we = ye(al, [["__scopeId", "data-v-c21de985"]]),
  nl = O({
    __name: "ReDownloadSelectDialog",
    props: ne({ torrentItems: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ne(["reDownloadComplete"], ["update:modelValue"]),
    setup(s, { emit: n }) {
      const { t: r } = N(),
        u = ce(s, "modelValue"),
        c = n,
        { ref: D, reset: C } = Ge(() => ({ old: !1, local: !1, downloader: !1 })),
        h = _(!1),
        b = _(!1),
        I = ee([]),
        H = {
          old: { icon: "mdi-reload", color: "indigo", title: r("DownloadHistory.ReDownloadSelectDialog.oldMethod") },
          local: { icon: "mdi-content-save", color: "orange", title: r("downloaderLabel.localDownload") },
          downloader: {
            icon: "mdi-cloud-download",
            color: "cyan",
            title: r("DownloadHistory.ReDownloadSelectDialog.selectDownloader"),
          },
        };
      function T(w) {
        ((D.value[w] = !1), c("reDownloadComplete"), (u.value = !1));
      }
      function i(w) {
        if (((D.value[w] = !0), w === "downloader")) ((I.value = s.torrentItems.map((f) => f.torrent)), (b.value = !0));
        else {
          const f = [];
          for (const p of s.torrentItems)
            if (p) {
              const y = p.torrent;
              w === "local" || p.downloaderId === "local"
                ? f.push(B("downloadTorrent", { torrent: y, downloaderId: "local" }))
                : f.push(
                    B("downloadTorrent", {
                      torrent: y,
                      downloaderId: p.downloaderId,
                      addTorrentOptions: p.addTorrentOptions ?? {},
                    }),
                  );
            }
          Promise.all(f).finally(() => {
            T(w);
          });
        }
      }
      function a() {
        (C(), (h.value = s.torrentItems.some((w) => w?.torrent?.link?.startsWith("magnet:"))));
      }
      return (w, f) => (
        g(),
        x(
          A,
          null,
          [
            e(
              X,
              {
                modelValue: u.value,
                "onUpdate:modelValue": f[1] || (f[1] = (p) => (u.value = p)),
                "max-width": "600",
                onAfterEnter: a,
              },
              {
                default: o(() => [
                  e(G, null, {
                    default: o(() => [
                      e(
                        Y,
                        { class: "pa-0" },
                        {
                          default: o(() => [
                            e(
                              ie,
                              { color: "primary" },
                              {
                                append: o(() => [
                                  e(
                                    S,
                                    {
                                      icon: "mdi-close",
                                      title: l(r)("common.dialog.close"),
                                      onClick: f[0] || (f[0] = (p) => (u.value = !1)),
                                    },
                                    null,
                                    8,
                                    ["title"],
                                  ),
                                ]),
                                default: o(() => [
                                  e(re, null, {
                                    default: o(() => [
                                      v(
                                        m(
                                          l(r)("DownloadHistory.ReDownloadSelectDialog.title", [s.torrentItems.length]),
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
                      e(
                        q,
                        { class: "pa-1" },
                        {
                          default: o(() => [
                            e(Ve, null, {
                              default: o(() => [
                                (g(),
                                x(
                                  A,
                                  null,
                                  P(H, (p, y) =>
                                    e(
                                      ke,
                                      { key: y },
                                      {
                                        default: o(() => [
                                          e(
                                            S,
                                            {
                                              loading: l(D)[y],
                                              block: "",
                                              class: "justify-start",
                                              color: p.color,
                                              "prepend-icon": p.icon,
                                              size: "x-large",
                                              variant: "tonal",
                                              onClick: (j) => i(y),
                                            },
                                            { default: o(() => [v(m(p.title), 1)]), _: 2 },
                                            1032,
                                            ["loading", "color", "prepend-icon", "onClick"],
                                          ),
                                        ]),
                                        _: 2,
                                      },
                                      1024,
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
            e(
              qe,
              {
                modelValue: b.value,
                "onUpdate:modelValue": f[2] || (f[2] = (p) => (b.value = p)),
                "torrent-items": I.value,
                onCancel: f[3] || (f[3] = () => (l(D).downloader = !1)),
                onDone: f[4] || (f[4] = () => T("downloader")),
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
  U = ee({}),
  pe = Z(() => Object.values(U.value)),
  le = Oe({
    parseOptions: { keywords: ["siteId", "downloaderId", "downloadStatus"], ranges: ["downloadAt"] },
    titleFields: ["title", "subTitle"],
    initialItems: pe,
    format: { downloadAt: "date" },
  }),
  $ = Re({});
function ve(s) {
  $[s] = setTimeout(async () => {
    const n = await B("getDownloadHistoryById", s);
    ((U.value[s] = n), n.downloadStatus == "downloading" || n.downloadStatus == "pending" ? ve(s) : delete $[s]);
  }, 1e3);
}
function dl() {
  for (const s of Object.keys($)) (clearTimeout($[s]), delete $[s]);
  B("getDownloadHistory", void 0).then((s) => {
    ((U.value = {}),
      s.forEach((n) => {
        ((U.value[n.id] = n), (n.downloadStatus == "downloading" || n.downloadStatus == "pending") && ve(n.id));
      }),
      le.buildAdvanceItemPropsFn());
  });
}
const L = Ne(dl, 1e3),
  W = {
    downloading: { title: "下载中", icon: "mdi-download", color: "blue" },
    pending: { title: "等待中", icon: "mdi-clock", color: "orange" },
    completed: { title: "已完成", icon: "mdi-check", color: "green" },
    failed: { title: "错误", icon: "mdi-alert", color: "red" },
  },
  il = { class: "text-no-wrap" },
  rl = O({
    __name: "AdvanceFilterGenerateDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(s) {
      const n = ce(s, "modelValue"),
        { t: r } = N(),
        {
          advanceItemPropsRef: u,
          advanceFilterDictRef: c,
          reBuildFilterCountRef: D,
          toggleKeywordStateFn: C,
          reBuildAdvanceFilter: h,
          updateTableFilterValueFn: b,
        } = le;
      function I() {
        (b(), (n.value = !1));
      }
      function H() {
        h();
      }
      return (T, i) => (
        g(),
        z(
          X,
          {
            modelValue: n.value,
            "onUpdate:modelValue": i[9] || (i[9] = (a) => (n.value = a)),
            width: "800",
            onAfterEnter: H,
          },
          {
            default: o(() => [
              e(G, null, {
                default: o(() => [
                  e(
                    Y,
                    { class: "pa-0" },
                    {
                      default: o(() => [
                        e(
                          ie,
                          { color: "blue-grey-darken-2" },
                          {
                            append: o(() => [
                              e(
                                S,
                                {
                                  icon: "mdi-close",
                                  title: l(r)("common.dialog.close"),
                                  onClick: i[0] || (i[0] = (a) => (n.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: o(() => [
                              e(re, null, {
                                default: o(() => [v(m(l(r)("common.AdvanceFilterGenerateDialog.title")), 1)]),
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
                  e(J),
                  e(
                    q,
                    { class: "overflow-y-auto" },
                    {
                      default: o(() => [
                        e(xe, null, {
                          default: o(() => [
                            e(V, null, {
                              default: o(() => [
                                e(M, null, {
                                  default: o(() => [v(m(l(r)("common.AdvanceFilterGenerateDialog.keywords")), 1)]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            }),
                            e(V, null, {
                              default: o(() => [
                                e(R, null, {
                                  default: o(() => [
                                    e(
                                      te,
                                      {
                                        modelValue: l(c).text.required,
                                        "onUpdate:modelValue": i[1] || (i[1] = (a) => (l(c).text.required = a)),
                                        chips: "",
                                        "hide-details": "",
                                        label: l(r)("common.AdvanceFilterGenerateDialog.required"),
                                        multiple: "",
                                      },
                                      null,
                                      8,
                                      ["modelValue", "label"],
                                    ),
                                  ]),
                                  _: 1,
                                }),
                                e(R, null, {
                                  default: o(() => [
                                    e(
                                      te,
                                      {
                                        modelValue: l(c).text.exclude,
                                        "onUpdate:modelValue": i[2] || (i[2] = (a) => (l(c).text.exclude = a)),
                                        chips: "",
                                        "hide-details": "",
                                        label: l(r)("common.AdvanceFilterGenerateDialog.exclude"),
                                        multiple: "",
                                      },
                                      null,
                                      8,
                                      ["modelValue", "label"],
                                    ),
                                  ]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            }),
                            e(V, null, {
                              default: o(() => [
                                e(M, null, {
                                  default: o(() => [v(m(l(r)("common.AdvanceFilterGenerateDialog.site")), 1)]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            }),
                            e(V, null, {
                              default: o(() => [
                                (g(!0),
                                x(
                                  A,
                                  null,
                                  P(
                                    l(u).siteId,
                                    (a) => (
                                      g(),
                                      z(
                                        R,
                                        { key: `${l(D)}_${a}`, class: "pa-0", sm: "3", cols: 6 },
                                        {
                                          default: o(() => [
                                            e(
                                              de,
                                              {
                                                modelValue: l(c).siteId.required,
                                                "onUpdate:modelValue":
                                                  i[3] || (i[3] = (w) => (l(c).siteId.required = w)),
                                                label: a,
                                                value: a,
                                                density: "compact",
                                                "hide-details": "",
                                                indeterminate: "",
                                                onClick: ae(() => l(C)("siteId", a), ["stop"]),
                                              },
                                              {
                                                label: o(() => [
                                                  e(se, { "site-id": a, size: 16, class: "mr-2" }, null, 8, [
                                                    "site-id",
                                                  ]),
                                                  e(
                                                    ue,
                                                    { class: $e(["text-decoration-none"]), "site-id": a, tag: "span" },
                                                    null,
                                                    8,
                                                    ["site-id"],
                                                  ),
                                                ]),
                                                _: 2,
                                              },
                                              1032,
                                              ["modelValue", "label", "value", "onClick"],
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
                            e(V, null, {
                              default: o(() => [
                                e(M, null, {
                                  default: o(() => [
                                    v(m(l(r)("DownloadHistory.AdvanceFilterGenerateDialog.downloader")), 1),
                                  ]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            }),
                            e(V, null, {
                              default: o(() => [
                                (g(!0),
                                x(
                                  A,
                                  null,
                                  P(
                                    l(u).downloaderId,
                                    (a) => (
                                      g(),
                                      z(
                                        R,
                                        { key: `${l(D)}_${a}`, sm: "6", cols: 12, class: "pa-0" },
                                        {
                                          default: o(() => [
                                            e(
                                              de,
                                              {
                                                modelValue: l(c).downloaderId.required,
                                                "onUpdate:modelValue":
                                                  i[4] || (i[4] = (w) => (l(c).downloaderId.required = w)),
                                                value: a,
                                                density: "compact",
                                                "hide-details": "",
                                                indeterminate: "",
                                                onClick: ae(() => l(C)("downloaderId", a), ["stop"]),
                                              },
                                              {
                                                label: o(() => [e(we, { downloader: a }, null, 8, ["downloader"])]),
                                                _: 2,
                                              },
                                              1032,
                                              ["modelValue", "value", "onClick"],
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
                            e(V, null, {
                              default: o(() => [
                                e(
                                  R,
                                  { cols: "12" },
                                  {
                                    default: o(() => [
                                      e(
                                        V,
                                        { class: "pr-4" },
                                        {
                                          default: o(() => [
                                            e(M, null, {
                                              default: o(() => [
                                                v(m(l(r)("common.AdvanceFilterGenerateDialog.date")), 1),
                                              ]),
                                              _: 1,
                                            }),
                                            e(Q),
                                            (g(),
                                            x(
                                              A,
                                              null,
                                              P(["day", "week", "month", "quarter", "year"], (a) =>
                                                e(
                                                  K,
                                                  {
                                                    key: a,
                                                    size: "x-small",
                                                    class: "mr-1",
                                                    onClick: () => (l(c).downloadAt = l(Ee)(a, l(u).downloadAt.range)),
                                                  },
                                                  {
                                                    default: o(() => [
                                                      v(m(l(r)(`common.AdvanceFilterGenerateDialog.dateUnit.${a}`)), 1),
                                                    ]),
                                                    _: 2,
                                                  },
                                                  1032,
                                                  ["onClick"],
                                                ),
                                              ),
                                              64,
                                            )),
                                            e(
                                              K,
                                              { size: "x-small" },
                                              {
                                                default: o(() => [
                                                  v(
                                                    m(l(r)("common.AdvanceFilterGenerateDialog.dateUnit.custom")) + " ",
                                                    1,
                                                  ),
                                                  e(
                                                    Ce,
                                                    {
                                                      activator: "parent",
                                                      location: "top",
                                                      "close-on-content-click": !1,
                                                    },
                                                    {
                                                      default: o(() => [
                                                        e(
                                                          We,
                                                          {
                                                            max: l(Qe)(new Date(l(u).downloadAt.range[1]), 1),
                                                            min: l(Je)(new Date(l(u).downloadAt.range[0])),
                                                            "hide-header": "",
                                                            multiple: "range",
                                                            "show-adjacent-months": "",
                                                            "onUpdate:modelValue":
                                                              i[5] || (i[5] = (a) => (l(c).downloadAt = l(je)(a))),
                                                          },
                                                          null,
                                                          8,
                                                          ["max", "min"],
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
                                      e(V, null, {
                                        default: o(() => [
                                          e(
                                            Me,
                                            {
                                              modelValue: l(c).downloadAt,
                                              "onUpdate:modelValue": i[6] || (i[6] = (a) => (l(c).downloadAt = a)),
                                              max: l(u).downloadAt.range[1],
                                              min: l(u).downloadAt.range[0],
                                              step: 60 * 1e3,
                                              "thumb-label": !0,
                                              ticks: l(u).downloadAt.ticks,
                                              class: "px-6",
                                              "hide-details": "",
                                              "show-ticks": "always",
                                              "tick-size": "4",
                                            },
                                            {
                                              "tick-label": o(() => [...(i[10] || (i[10] = []))]),
                                              "thumb-label": o(({ modelValue: a }) => [
                                                k("span", il, m(l(fe)(a ?? 0, "yyyy-MM-dd HH:mm")), 1),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["modelValue", "max", "min", "ticks"],
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
                            }),
                          ]),
                          _: 1,
                        }),
                      ]),
                      _: 1,
                    },
                  ),
                  e(J),
                  e(_e, null, {
                    default: o(() => [
                      e(
                        S,
                        { variant: "text", onClick: i[7] || (i[7] = () => l(h)(!0)) },
                        { default: o(() => [v(m(l(r)("common.AdvanceFilterGenerateDialog.reset")), 1)]), _: 1 },
                      ),
                      e(Q),
                      e(
                        S,
                        { color: "error", variant: "text", onClick: i[8] || (i[8] = (a) => (n.value = !1)) },
                        { default: o(() => [v(m(l(r)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      e(
                        S,
                        { color: "primary", variant: "text", onClick: I },
                        { default: o(() => [v(m(l(r)("common.AdvanceFilterGenerateDialog.generate")), 1)]), _: 1 },
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
  sl = { class: "d-flex flex-column align-center" },
  ul = { class: "t_downloadAt text-no-wrap" },
  Jl = O({
    __name: "Index",
    setup(s) {
      const { t: n } = N(),
        r = Ae(),
        u = Ie(),
        { tableFilterRef: c, tableWaitFilterRef: D, tableFilterFn: C } = le,
        h = Z(() => [
          { title: n("common.site"), key: "siteId", align: "center" },
          {
            title: n("DownloadHistory.table.title"),
            key: "title",
            align: "start",
            minWidth: "30rem",
            ...(u.smAndDown.value ? { maxWidth: "32vw" } : {}),
          },
          { title: n("DownloadHistory.table.downloader"), key: "downloaderId", width: "11%", align: "start" },
          { title: n("DownloadHistory.table.downloadAt"), key: "downloadAt", align: "center" },
          { title: n("DownloadHistory.table.status"), key: "downloadStatus" },
          { title: n("common.action"), key: "action", align: "center", sortable: !1 },
        ]),
        b = _([]),
        I = _(!1),
        H = _(!1),
        T = ee([]);
      function i(F) {
        const d = [];
        for (const t of F) {
          const oe = U.value[t];
          oe && d.push(oe);
        }
        ((T.value = d), (H.value = !0));
      }
      const a = _(!1),
        w = _([]);
      async function f(F) {
        ((w.value = F), (a.value = !0));
      }
      async function p(F) {
        return await B("deleteDownloadHistoryById", F);
      }
      const y = _(!1),
        j = _({});
      function ge(F) {
        ((j.value = F), (y.value = !0));
      }
      return (
        Be(() => {
          L();
        }),
        (F, d) => (
          g(),
          x(
            A,
            null,
            [
              e(Ke, { title: l(n)("route.Overview.DownloadHistory"), type: "info" }, null, 8, ["title"]),
              e(G, null, {
                default: o(() => [
                  e(Y, null, {
                    default: o(() => [
                      e(
                        V,
                        { class: "ma-0" },
                        {
                          default: o(() => [
                            e(
                              E,
                              {
                                color: "green",
                                icon: "mdi-cached",
                                text: l(n)("DownloadHistory.refresh"),
                                onClick: d[0] || (d[0] = () => l(L)()),
                              },
                              null,
                              8,
                              ["text"],
                            ),
                            e(J, { vertical: "", class: "mx-2" }),
                            e(
                              E,
                              {
                                disabled: b.value.length === 0,
                                color: "primary",
                                icon: "mdi-tray-arrow-down",
                                text: l(n)("DownloadHistory.reDownload"),
                                onClick: d[1] || (d[1] = () => i(b.value)),
                              },
                              null,
                              8,
                              ["disabled", "text"],
                            ),
                            e(
                              E,
                              {
                                disabled: b.value.length === 0,
                                text: l(n)("common.remove"),
                                color: "error",
                                icon: "mdi-minus",
                                onClick: d[2] || (d[2] = (t) => f(b.value)),
                              },
                              null,
                              8,
                              ["disabled", "text"],
                            ),
                            e(Q),
                            e(
                              Fe,
                              {
                                modelValue: l(D),
                                "onUpdate:modelValue": d[3] || (d[3] = (t) => (Ue(D) ? (D.value = t) : null)),
                                "append-icon": "mdi-magnify",
                                clearable: "",
                                density: "compact",
                                "hide-details": "",
                                label: l(n)("DownloadHistory.filterPlaceholder"),
                                "max-width": "500",
                                "prepend-inner-icon": "mdi-filter",
                                "single-line": "",
                                "onClick:prependInner": d[4] || (d[4] = (t) => (I.value = !0)),
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
                  e(q, null, {
                    default: o(() => [
                      e(
                        Xe,
                        {
                          modelValue: b.value,
                          "onUpdate:modelValue": d[5] || (d[5] = (t) => (b.value = t)),
                          "custom-filter": l(C),
                          "filter-keys": ["id"],
                          headers: h.value,
                          items: l(pe),
                          "items-per-page": l(r).tableBehavior.DownloadHistory.itemsPerPage,
                          "multi-sort": l(r).enableTableMultiSort,
                          search: l(c),
                          "sort-by": l(r).tableBehavior.DownloadHistory.sortBy,
                          class: "table-stripe table-header-no-wrap",
                          hover: "",
                          "item-value": "id",
                          "show-select": "",
                          "onUpdate:itemsPerPage":
                            d[6] || (d[6] = (t) => l(r).updateTableBehavior("DownloadHistory", "itemsPerPage", t)),
                          "onUpdate:sortBy":
                            d[7] || (d[7] = (t) => l(r).updateTableBehavior("DownloadHistory", "sortBy", t)),
                        },
                        {
                          "item.siteId": o(({ item: t }) => [
                            k("div", sl, [
                              e(se, { "site-id": t.siteId, size: 18 }, null, 8, ["site-id"]),
                              e(ue, { "site-id": t.siteId }, null, 8, ["site-id"]),
                            ]),
                          ]),
                          "item.title": o(({ item: t }) => [
                            t.torrent ? (g(), z(Le, { key: 0, item: t.torrent }, null, 8, ["item"])) : me("", !0),
                          ]),
                          "item.downloaderId": o(({ item: t }) => [
                            e(we, { downloader: t.downloaderId }, null, 8, ["downloader"]),
                          ]),
                          "item.downloadAt": o(({ item: t }) => [k("span", ul, m(l(fe)(t.downloadAt ?? 0)), 1)]),
                          "item.downloadStatus": o(({ item: t }) => [
                            e(
                              K,
                              {
                                "prepend-icon": l(W)[t.downloadStatus].icon,
                                color: l(W)[t.downloadStatus].color,
                                onClick: () => ge(t),
                              },
                              { default: o(() => [v(m(l(W)[t.downloadStatus].title), 1)]), _: 2 },
                              1032,
                              ["prepend-icon", "color", "onClick"],
                            ),
                          ]),
                          "item.action": o(({ item: t }) => [
                            e(
                              Se,
                              { class: "table-action", density: "compact", variant: "plain" },
                              {
                                default: o(() => [
                                  e(
                                    S,
                                    {
                                      title: l(n)("DownloadHistory.reDownload"),
                                      color: "primary",
                                      icon: "mdi-tray-arrow-down",
                                      size: "small",
                                      onClick: () => i([t.id]),
                                    },
                                    null,
                                    8,
                                    ["title", "onClick"],
                                  ),
                                  e(
                                    S,
                                    {
                                      title: l(n)("common.remove"),
                                      color: "error",
                                      icon: "mdi-delete",
                                      size: "small",
                                      onClick: () => f([t.id]),
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
                        [
                          "modelValue",
                          "custom-filter",
                          "headers",
                          "items",
                          "items-per-page",
                          "multi-sort",
                          "search",
                          "sort-by",
                        ],
                      ),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 1,
              }),
              e(
                nl,
                {
                  modelValue: H.value,
                  "onUpdate:modelValue": d[8] || (d[8] = (t) => (H.value = t)),
                  "torrent-items": T.value,
                  onReDownloadComplete: d[9] || (d[9] = () => l(L)()),
                },
                null,
                8,
                ["modelValue", "torrent-items"],
              ),
              e(rl, { modelValue: I.value, "onUpdate:modelValue": d[10] || (d[10] = (t) => (I.value = t)) }, null, 8, [
                "modelValue",
              ]),
              e(
                Pe,
                {
                  modelValue: a.value,
                  "onUpdate:modelValue": d[11] || (d[11] = (t) => (a.value = t)),
                  "to-delete-ids": w.value,
                  "confirm-delete": p,
                  onAllDelete: d[12] || (d[12] = () => l(L)()),
                },
                null,
                8,
                ["modelValue", "to-delete-ids"],
              ),
              e(
                X,
                { modelValue: y.value, "onUpdate:modelValue": d[13] || (d[13] = (t) => (y.value = t)), width: "800" },
                {
                  default: o(() => [
                    e(G, null, {
                      default: o(() => [
                        e(q, null, {
                          default: o(() => [k("pre", null, " " + m(JSON.stringify(j.value, null, 2)), 1)]),
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
            ],
            64,
          )
        )
      );
    },
  });
export { Jl as default };
