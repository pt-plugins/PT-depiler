import {
  bN as X,
  s as fe,
  j as Y,
  a4 as ve,
  a5 as he,
  c as C,
  t as F,
  i as Se,
  T as K,
  n as j,
  y as Z,
  A as L,
  m as q,
  l as V,
  x as z,
  a2 as ee,
  f as P,
  H,
  a7 as ae,
  c2 as te,
  bz as le,
  bV as re,
  b$ as pe,
  a3 as ye,
  ce as be,
  B as ge,
  C as Q,
  cf as A,
  V as W,
  h as Ve,
  p as ke,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as oe,
  cb as Ie,
  I as b,
  ck as a,
  a$ as Me,
  U as e,
  Q as m,
  bS as c,
  c4 as o,
  H as k,
  L as S,
  F as I,
  bu as $,
  J as y,
  bj as i,
  b0 as N,
  P as xe,
  bC as ne,
  a_ as _e,
  br as T,
  bf as we,
  cl as Ee,
  aQ as Ce,
  D as ze,
  aE as $e,
} from "../vendor/packages/site/index-COeZNva1.js";
import { b as G } from "../vendor/packages/mediaServer/index-Cmj48V-l.js";
import { e as ie } from "./utils-DF6YUpNn.js";
import { o as De } from "../vendor/es-toolkit/omit-BqXgNNTz.js";
import { E as Re } from "../vendor/packages/site/types/base-Dy_28wGT.js";
import { V as Le } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as J } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
const Ke = ["href", "title"],
  Te = { class: "text-caption" },
  je = { key: 0, class: "info-label" },
  Pe = { key: 1, class: "info-label" },
  Ue = { key: 2, class: "info-label" },
  Be = { key: 3, class: "info-label" },
  qe = { class: "d-flex w-100 align-center" },
  Fe = oe({
    __name: "ItemInformationDialog",
    props: Me({ item: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(t) {
      const { t: r } = X(),
        p = Ie(t, "modelValue"),
        v = [
          { name: "Audio", icon: "mdi-expansion-card" },
          { name: "Subtitle", icon: "mdi-closed-caption" },
        ];
      function u(d) {
        d = Math.abs(d);
        let n = Math.floor(d / 3600);
        d %= 3600;
        let s = Math.floor(d / 60);
        d = Math.floor(d % 60);
        let h = "P";
        if (n >= 24) {
          let M = Math.floor(n / 24);
          ((h += `${M}D`), (n %= 24));
        }
        return (
          (n > 0 || s > 0 || d > 0) &&
            ((h += "T"), n > 0 && (h += `${n}H`), s > 0 && (h += `${s}M`), d > 0 && (h += `${d}S`)),
          h
        );
      }
      return (d, n) => (
        i(),
        b(
          fe,
          {
            modelValue: p.value,
            "onUpdate:modelValue": n[1] || (n[1] = (s) => (p.value = s)),
            "max-width": "800",
            scrollable: "",
          },
          {
            default: a(() => [
              e(P, null, {
                default: a(() => [
                  e(
                    Y,
                    { class: "pa-0" },
                    {
                      default: a(() => [
                        e(
                          ve,
                          { color: "blue-grey-darken-2" },
                          {
                            append: a(() => [
                              e(
                                C,
                                {
                                  icon: "mdi-close",
                                  title: o(r)("common.dialog.close"),
                                  onClick: n[0] || (n[0] = (s) => (p.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: a(() => [
                              e(he, null, {
                                default: a(() => [m(c(o(r)("MediaServerEntity.ItemInformationDialog.title")), 1)]),
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
                  e(Se, null, {
                    default: a(() => [
                      e(
                        K,
                        { align: "center" },
                        {
                          default: a(() => [
                            e(
                              j,
                              { cols: "8", offset: "2", "offset-sm": "0", sm: "4" },
                              {
                                default: a(() => [
                                  e(Z, { src: t.item.poster, title: t.item.name }, null, 8, ["src", "title"]),
                                ]),
                                _: 1,
                              },
                            ),
                            e(
                              j,
                              { cols: "12", sm: "8" },
                              {
                                default: a(() => [
                                  k(
                                    "a",
                                    {
                                      href: t.item.url,
                                      title: t.item.name,
                                      class: "w-100 text-h6 d-inline-block",
                                      rel: "noopener noreferrer nofollow",
                                      target: "_blank",
                                    },
                                    c(t.item.name),
                                    9,
                                    Ke,
                                  ),
                                  k("p", Te, c(t.item.description ?? ""), 1),
                                  t.item.tags && t.item.tags.length > 0
                                    ? (i(),
                                      S("div", je, [
                                        e(
                                          L,
                                          { class: "pr-3" },
                                          {
                                            default: a(() => [
                                              m(c(o(r)("MediaServerEntity.ItemInformationDialog.type")), 1),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                        e(
                                          q,
                                          { "show-arrows": "" },
                                          {
                                            default: a(() => [
                                              (i(!0),
                                              S(
                                                I,
                                                null,
                                                $(
                                                  t.item.tags ?? [],
                                                  (s) => (
                                                    i(),
                                                    b(
                                                      V,
                                                      {
                                                        key: s.name,
                                                        href: s.url ?? !1,
                                                        target: s.url ? "_blank" : void 0,
                                                        "base-color": "orange",
                                                        class: "mr-1",
                                                        label: "",
                                                        "prepend-icon": "mdi-tag",
                                                        rel: "noopener noreferrer nofollow",
                                                        size: "small",
                                                      },
                                                      { default: a(() => [m(c(s.name), 1)]), _: 2 },
                                                      1032,
                                                      ["href", "target"],
                                                    )
                                                  ),
                                                ),
                                                128,
                                              )),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                      ]))
                                    : y("", !0),
                                  t.item.duration
                                    ? (i(),
                                      S("div", Pe, [
                                        e(
                                          L,
                                          { class: "pr-3" },
                                          {
                                            default: a(() => [
                                              m(c(o(r)("MediaServerEntity.ItemInformationDialog.duration")), 1),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                        e(
                                          V,
                                          {
                                            "base-color": "green",
                                            class: "mr-1",
                                            label: "",
                                            "prepend-icon": "mdi-clock-time-four",
                                            size: "small",
                                          },
                                          { default: a(() => [m(c(u(t.item.duration ?? 0)), 1)]), _: 1 },
                                        ),
                                      ]))
                                    : y("", !0),
                                  t.item.size
                                    ? (i(),
                                      S("div", Ue, [
                                        e(
                                          L,
                                          { class: "pr-3" },
                                          {
                                            default: a(() => [
                                              m(c(o(r)("MediaServerEntity.ItemInformationDialog.size")), 1),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                        e(
                                          V,
                                          {
                                            "base-color": "deep-purple",
                                            class: "mr-1",
                                            label: "",
                                            "prepend-icon": "mdi-harddisk",
                                            size: "small",
                                          },
                                          { default: a(() => [m(c(o(ie)(t.item.size ?? 0)), 1)]), _: 1 },
                                        ),
                                      ]))
                                    : y("", !0),
                                  t.item.streams && t.item.streams.length > 0
                                    ? (i(),
                                      S("div", Be, [
                                        e(
                                          L,
                                          { class: "pr-3" },
                                          {
                                            default: a(() => [
                                              m(c(o(r)("MediaServerEntity.ItemInformationDialog.mediaInfo")), 1),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                        e(
                                          q,
                                          { "show-arrows": "" },
                                          {
                                            default: a(() => [
                                              t.item.format
                                                ? (i(),
                                                  b(
                                                    V,
                                                    {
                                                      key: 0,
                                                      "base-color": "blue",
                                                      label: "",
                                                      "prepend-icon": "mdi-aspect-ratio",
                                                      size: "small",
                                                    },
                                                    { default: a(() => [m(c(t.item.format?.toUpperCase()), 1)]), _: 1 },
                                                  ))
                                                : y("", !0),
                                              t.item.streams.filter((s) => s.type === "Video").length > 0
                                                ? (i(),
                                                  b(
                                                    V,
                                                    {
                                                      key: 1,
                                                      "base-color": "blue",
                                                      label: "",
                                                      "prepend-icon": "mdi-movie",
                                                      size: "small",
                                                    },
                                                    {
                                                      default: a(() => [
                                                        m(
                                                          c(t.item.streams.filter((s) => s.type === "Video")[0].title),
                                                          1,
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ))
                                                : y("", !0),
                                              (i(),
                                              S(
                                                I,
                                                null,
                                                $(
                                                  v,
                                                  (s) => (
                                                    i(),
                                                    S(
                                                      I,
                                                      { key: s.name },
                                                      [
                                                        t.item.streams.filter((h) => h.type === s.name).length > 0
                                                          ? (i(),
                                                            b(
                                                              H,
                                                              { key: 0, "open-on-hover": "" },
                                                              {
                                                                activator: a(({ props: h }) => [
                                                                  e(
                                                                    V,
                                                                    N({ ref_for: !0 }, h, {
                                                                      "prepend-icon": s.icon,
                                                                      "base-color": "blue",
                                                                      label: "",
                                                                      size: "small",
                                                                    }),
                                                                    {
                                                                      default: a(() => [
                                                                        m(
                                                                          c(
                                                                            t.item.streams.filter(
                                                                              (M) => M.type === s.name,
                                                                            ).length,
                                                                          ),
                                                                          1,
                                                                        ),
                                                                      ]),
                                                                      _: 2,
                                                                    },
                                                                    1040,
                                                                    ["prepend-icon"],
                                                                  ),
                                                                ]),
                                                                default: a(() => [
                                                                  e(
                                                                    P,
                                                                    { class: "pl-2" },
                                                                    {
                                                                      default: a(() => [
                                                                        e(
                                                                          q,
                                                                          { direction: "vertical" },
                                                                          {
                                                                            default: a(() => [
                                                                              (i(!0),
                                                                              S(
                                                                                I,
                                                                                null,
                                                                                $(
                                                                                  t.item.streams.filter(
                                                                                    (h) => h.type === s.name,
                                                                                  ),
                                                                                  (h) => (
                                                                                    i(),
                                                                                    b(
                                                                                      V,
                                                                                      {
                                                                                        "prepend-icon": s.icon,
                                                                                        label: "",
                                                                                        size: "small",
                                                                                      },
                                                                                      {
                                                                                        default: a(() => [
                                                                                          m(c(h.title), 1),
                                                                                        ]),
                                                                                        _: 2,
                                                                                      },
                                                                                      1032,
                                                                                      ["prepend-icon"],
                                                                                    )
                                                                                  ),
                                                                                ),
                                                                                256,
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
                                                            ))
                                                          : y("", !0),
                                                      ],
                                                      64,
                                                    )
                                                  ),
                                                ),
                                                64,
                                              )),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                      ]))
                                    : y("", !0),
                                  e(F, { class: "my-2" }),
                                  k("div", qe, [
                                    e(
                                      z,
                                      {
                                        icon: t.item.user?.IsPlayed ? "mdi-check-bold" : "mdi-radiobox-blank",
                                        color: "green",
                                        size: "36",
                                      },
                                      null,
                                      8,
                                      ["icon"],
                                    ),
                                    e(
                                      z,
                                      {
                                        icon: t.item.user?.IsFavorite ? "mdi-heart" : "mdi-heart-outline",
                                        color: "red",
                                        size: "36",
                                      },
                                      null,
                                      8,
                                      ["icon"],
                                    ),
                                    e(ee),
                                    e(
                                      C,
                                      {
                                        href: t.item.url,
                                        "append-icon": "mdi-arrow-top-right-bold-box-outline",
                                        class: "visit-btn",
                                        rel: "noopener noreferrer nofollow",
                                        target: "_blank",
                                      },
                                      { default: a(() => [m(c(o(r)("common.visit")), 1)]), _: 1 },
                                      8,
                                      ["href"],
                                    ),
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
  He = ae(Fe, [["__scopeId", "data-v-1dddcf7d"]]),
  g = te(),
  O = le(),
  se = re(),
  x = T(se.getEnabledMediaServers.map((t) => t.id) ?? []),
  _ = new xe({ concurrency: 1 }),
  D = new Set();
_.on("active", () => {
  ((g.mediaServerSearch.isSearching = !0),
    _.concurrency != O.mediaServerEntity.queueConcurrency &&
      ((_.concurrency = O.mediaServerEntity.queueConcurrency),
      ne("logger", { msg: `Search queue concurrency changed to: ${_.concurrency}` }).catch()),
    D.clear(),
    g.mediaServerSearch.searchResult.forEach((t) => D.add(t.url)));
});
_.on("idle", () => {
  ((g.mediaServerSearch.isSearching = !1), D.clear());
});
async function E(t = {}) {
  const { searchKey: r = "", loadMore: p = !1 } = t;
  (r != g.mediaServerSearch.searchKey && g.resetMediaServerSearchData(), (g.mediaServerSearch.searchKey = r));
  for (const v of x.value)
    _.add(async () => {
      let u = { limit: O.mediaServerEntity.searchLimit ?? 50 };
      p &&
        ((u = g.mediaServerSearch.searchStatus[v]?.options ?? {}),
        (u.startIndex = (u.startIndex ?? 0) + (u.limit ?? 0)));
      const d = await ne("getMediaServerSearchResult", { mediaServerId: v, keywords: r, options: u });
      if (((g.mediaServerSearch.searchStatus[v] = { ...De(d, ["items"]), canLoadMore: !1 }), d.status !== Re.success)) {
        const n = se.mediaServers[v];
        g.showSnakebar(`媒体服务器 ${n.name} [${n.address}] 更新失败，请检查认证信息`, { color: "error" });
        return;
      }
      for (const n of d.items)
        D.has(n.url) ||
          (g.mediaServerSearch.searchResult.push(_e(n)),
          D.add(n.url),
          (g.mediaServerSearch.searchStatus[v].canLoadMore = !0));
    });
}
function de(t, r) {
  const { self: p = !1 } = r.modifiers ?? {},
    v = r.value,
    u = (typeof v == "object" && v.options) || { passive: !0 },
    d = typeof v == "function" || "handleEvent" in v ? v : v.handler,
    n = p ? t : r.arg ? document.querySelector(r.arg) : window;
  n &&
    (n.addEventListener("scroll", d, u),
    (t._onScroll = Object(t._onScroll)),
    (t._onScroll[r.instance.$.uid] = { handler: d, options: u, target: p ? void 0 : n }));
}
function ce(t, r) {
  if (!t._onScroll?.[r.instance.$.uid]) return;
  const { handler: p, options: v, target: u = t } = t._onScroll[r.instance.$.uid];
  (u.removeEventListener("scroll", p, v), delete t._onScroll[r.instance.$.uid]);
}
function Ne(t, r) {
  r.value !== r.oldValue && (ce(t, r), de(t, r));
}
const Oe = { mounted: de, unmounted: ce, updated: Ne },
  Qe = { key: 0, class: "masonry-grid" },
  Ae = { class: "position-relative mb-1" },
  We = { class: "masonry-right-label" },
  Ge = { class: "masonry-left-label" },
  Je = ["href", "title"],
  Xe = { key: 0, class: "d-flex justify-center align-center mt-1" },
  Ye = oe({
    __name: "Index",
    setup(t) {
      const { t: r } = X(),
        p = pe(),
        v = le(),
        u = te(),
        d = re(),
        n = T(p.query.search || ""),
        s = T(null),
        h = T(!1),
        M = ze(() =>
          $e(u.mediaServerSearch.searchStatus)
            ? !0
            : Object.values(u.mediaServerSearch.searchStatus).some((R) => R?.canLoadMore ?? !0),
        );
      function ue(R) {
        ((s.value = R), (h.value = !0));
      }
      function me() {
        v.mediaServerEntity.autoSearchMoreWhenScroll &&
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 &&
          !u.mediaServerSearch.isSearching &&
          M.value &&
          E({ searchKey: n.value, loadMore: !0 });
      }
      return (
        we(async () => {
          v.mediaServerEntity.autoSearchWhenMount &&
            u.mediaServerSearch.searchResult.length === 0 &&
            E({ searchKey: n.value });
        }),
        (R, f) => (
          i(),
          S(
            I,
            null,
            [
              e(Le, { title: o(r)("route.Overview.MediaServerEntity"), type: "info" }, null, 8, ["title"]),
              Ee(
                (i(),
                b(P, null, {
                  default: a(() => [
                    e(Y, null, {
                      default: a(() => [
                        e(
                          K,
                          { class: "ma-0" },
                          {
                            default: a(() => [
                              e(ee),
                              e(
                                ye,
                                {
                                  modelValue: n.value,
                                  "onUpdate:modelValue": f[4] || (f[4] = (l) => (n.value = l)),
                                  loading: o(u).mediaServerSearch.isSearching,
                                  "append-icon": "mdi-magnify",
                                  clearable: "",
                                  density: "compact",
                                  "hide-details": "",
                                  "max-width": "500",
                                  placeholder: o(r)("MediaServerEntity.searchPlaceholder"),
                                  onKeyup: f[5] || (f[5] = be(() => o(E)({ searchKey: n.value }), ["enter"])),
                                  "onClick:append": f[6] || (f[6] = () => o(E)({ searchKey: n.value })),
                                },
                                {
                                  "prepend-inner": a(() => [
                                    e(
                                      H,
                                      { "close-on-content-clicks": !1 },
                                      {
                                        activator: a(({ props: l }) => [
                                          e(z, N(l, { icon: "mdi-server", variant: "plain" }), null, 16),
                                        ]),
                                        default: a(() => [
                                          e(
                                            ge,
                                            { class: "pa-0" },
                                            {
                                              default: a(() => [
                                                e(Q, null, {
                                                  default: a(() => [
                                                    e(
                                                      J,
                                                      {
                                                        "hide-details": "",
                                                        indeterminate: "",
                                                        label: o(r)("common.checkbox.all"),
                                                        onClick: f[0] || (f[0] = A(() => {}, ["stop"])),
                                                        "onUpdate:modelValue":
                                                          f[1] ||
                                                          (f[1] = (l) => {
                                                            l
                                                              ? (x.value = o(d).getEnabledMediaServers.map((w) => w.id))
                                                              : (x.value = []);
                                                          }),
                                                      },
                                                      null,
                                                      8,
                                                      ["label"],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                }),
                                                e(F),
                                                (i(!0),
                                                S(
                                                  I,
                                                  null,
                                                  $(
                                                    o(d).getMediaServers,
                                                    (l) => (
                                                      i(),
                                                      b(
                                                        Q,
                                                        { key: l.id },
                                                        {
                                                          default: a(() => [
                                                            e(
                                                              J,
                                                              {
                                                                modelValue: o(x),
                                                                "onUpdate:modelValue":
                                                                  f[2] ||
                                                                  (f[2] = (w) => (Ce(x) ? (x.value = w) : null)),
                                                                disabled: l.enabled === !1,
                                                                indeterminate: l.enabled === !1,
                                                                label: l.name,
                                                                value: l.id,
                                                                "hide-details": "",
                                                                "indeterminate-icon": "mdi-close",
                                                                multiple: "",
                                                                onClick: f[3] || (f[3] = A(() => {}, ["stop"])),
                                                              },
                                                              {
                                                                append: a(() => [
                                                                  e(
                                                                    W,
                                                                    {
                                                                      alt: l.type,
                                                                      image: o(G)(l.type),
                                                                      size: "x-small",
                                                                    },
                                                                    null,
                                                                    8,
                                                                    ["alt", "image"],
                                                                  ),
                                                                ]),
                                                                _: 2,
                                                              },
                                                              1032,
                                                              [
                                                                "modelValue",
                                                                "disabled",
                                                                "indeterminate",
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
                                ["modelValue", "loading", "placeholder"],
                              ),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    }),
                    o(u).mediaServerSearch.searchResult.length > 0
                      ? (i(),
                        S("div", Qe, [
                          (i(!0),
                          S(
                            I,
                            null,
                            $(
                              o(u).mediaServerSearch.searchResult,
                              (l) => (
                                i(),
                                S("div", { key: l.url, class: "masonry-item" }, [
                                  e(
                                    P,
                                    null,
                                    {
                                      default: a(() => [
                                        k("div", Ae, [
                                          e(
                                            H,
                                            {
                                              "close-on-content-clicks": !1,
                                              contained: "",
                                              "content-class": "masonry-img-overlay",
                                              location: "start center",
                                              "open-on-hover": "",
                                              origin: "start center",
                                              scrim: "",
                                            },
                                            {
                                              activator: a(({ props: w, isActive: U }) => [
                                                k("div", We, [
                                                  l.user
                                                    ? (i(),
                                                      b(
                                                        V,
                                                        {
                                                          key: 0,
                                                          variant: U ? "tonal" : "elevated",
                                                          "base-color": "grey-lighten-2",
                                                          label: "",
                                                          size: "x-small",
                                                        },
                                                        {
                                                          default: a(() => [
                                                            e(
                                                              z,
                                                              {
                                                                icon: l.user?.IsPlayed
                                                                  ? "mdi-check-bold"
                                                                  : "mdi-radiobox-blank",
                                                                color: "green",
                                                              },
                                                              null,
                                                              8,
                                                              ["icon"],
                                                            ),
                                                            e(
                                                              z,
                                                              {
                                                                icon: l.user?.IsFavorite
                                                                  ? "mdi-heart"
                                                                  : "mdi-heart-outline",
                                                                color: "red",
                                                              },
                                                              null,
                                                              8,
                                                              ["icon"],
                                                            ),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1032,
                                                        ["variant"],
                                                      ))
                                                    : y("", !0),
                                                ]),
                                                k("div", Ge, [
                                                  l.format
                                                    ? (i(),
                                                      b(
                                                        V,
                                                        {
                                                          key: 0,
                                                          variant: U ? "tonal" : "elevated",
                                                          "base-color": "light-blue",
                                                          label: "",
                                                          "prepend-icon": "mdi-aspect-ratio",
                                                          size: "x-small",
                                                        },
                                                        {
                                                          default: a(() => [
                                                            m(c(l.format?.toUpperCase()) + " ", 1),
                                                            l.streams &&
                                                            l.streams.filter((B) => B.type === "Video").length > 0
                                                              ? (i(),
                                                                S(
                                                                  I,
                                                                  { key: 0 },
                                                                  [
                                                                    m(
                                                                      " / " +
                                                                        c(
                                                                          l.streams.filter((B) => B.type === "Video")[0]
                                                                            .title,
                                                                        ),
                                                                      1,
                                                                    ),
                                                                  ],
                                                                  64,
                                                                ))
                                                              : y("", !0),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1032,
                                                        ["variant"],
                                                      ))
                                                    : y("", !0),
                                                  f[9] || (f[9] = k("br", null, null, -1)),
                                                  l.size
                                                    ? (i(),
                                                      b(
                                                        V,
                                                        {
                                                          key: 1,
                                                          variant: U ? "tonal" : "elevated",
                                                          label: "",
                                                          "prepend-icon": "mdi-movie",
                                                          size: "x-small",
                                                        },
                                                        { default: a(() => [m(c(o(ie)(l.size ?? 0)), 1)]), _: 2 },
                                                        1032,
                                                        ["variant"],
                                                      ))
                                                    : y("", !0),
                                                ]),
                                                e(
                                                  Z,
                                                  N({ ref_for: !0 }, w, { src: l.poster, title: l.name }),
                                                  null,
                                                  16,
                                                  ["src", "title"],
                                                ),
                                              ]),
                                              default: a(() => [
                                                e(
                                                  C,
                                                  {
                                                    "append-icon": "mdi-information-outline",
                                                    block: "",
                                                    onClick: () => ue(l),
                                                  },
                                                  {
                                                    default: a(() => [m(c(o(r)("MediaServerEntity.detail")), 1)]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["onClick"],
                                                ),
                                                e(
                                                  C,
                                                  {
                                                    href: l.url,
                                                    "append-icon": "mdi-arrow-top-right-bold-box-outline",
                                                    block: "",
                                                    rel: "noopener noreferrer nofollow",
                                                    target: "_blank",
                                                  },
                                                  { default: a(() => [m(c(o(r)("common.visit")), 1)]), _: 1 },
                                                  8,
                                                  ["href"],
                                                ),
                                              ]),
                                              _: 2,
                                            },
                                            1024,
                                          ),
                                        ]),
                                        e(
                                          Ve,
                                          { class: "text-center my-1", style: { "white-space": "normal" } },
                                          {
                                            default: a(() => [
                                              k(
                                                "a",
                                                {
                                                  href: l.url,
                                                  title: l.name,
                                                  class: "font-weight-bold my-2",
                                                  target: "_blank",
                                                },
                                                c(l.name),
                                                9,
                                                Je,
                                              ),
                                              o(d).mediaServers[l.server]
                                                ? (i(),
                                                  S("div", Xe, [
                                                    e(
                                                      W,
                                                      {
                                                        alt: o(d).mediaServers[l.server].name,
                                                        image: o(G)(o(d).mediaServers[l.server].type),
                                                        size: "x-small",
                                                      },
                                                      null,
                                                      8,
                                                      ["alt", "image"],
                                                    ),
                                                    m("   " + c(o(d).mediaServers[l.server].name), 1),
                                                  ]))
                                                : y("", !0),
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
                                ])
                              ),
                            ),
                            128,
                          )),
                        ]))
                      : (i(),
                        b(
                          K,
                          { key: 1 },
                          {
                            default: a(() => [
                              e(
                                j,
                                { class: "d-flex justify-center text-body-1" },
                                { default: a(() => [m(c(o(r)("MediaServerEntity.noItems")), 1)]), _: 1 },
                              ),
                            ]),
                            _: 1,
                          },
                        )),
                    e(ke, null, {
                      default: a(() => [
                        e(K, null, {
                          default: a(() => [
                            e(
                              j,
                              { class: "d-flex justify-center" },
                              {
                                default: a(() => [
                                  e(
                                    C,
                                    {
                                      disabled: !M.value,
                                      loading: o(u).mediaServerSearch.isSearching,
                                      onClick: f[7] || (f[7] = () => o(E)({ searchKey: n.value, loadMore: !0 })),
                                    },
                                    { default: a(() => [m(c(o(r)("MediaServerEntity.loadMore")), 1)]), _: 1 },
                                    8,
                                    ["disabled", "loading"],
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
                    }),
                  ]),
                  _: 1,
                })),
                [[Oe, me]],
              ),
              e(
                He,
                { modelValue: h.value, "onUpdate:modelValue": f[8] || (f[8] = (l) => (h.value = l)), item: s.value },
                null,
                8,
                ["modelValue", "item"],
              ),
            ],
            64,
          )
        )
      );
    },
  }),
  ua = ae(Ye, [["__scopeId", "data-v-97104f43"]]);
export { ua as default };
