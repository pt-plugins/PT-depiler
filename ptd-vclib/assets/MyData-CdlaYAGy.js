import {
  bN as ee,
  bz as X,
  x as v,
  bE as He,
  bV as ue,
  f as Z,
  i as oe,
  B as se,
  C as P,
  G as Oe,
  t as K,
  a7 as Re,
  j as Te,
  a4 as Ee,
  a5 as Je,
  a9 as qe,
  c as W,
  a2 as Se,
  d as Ce,
  p as J,
  T as z,
  s as fe,
  c2 as de,
  c0 as We,
  H as ve,
  e as Ge,
  cf as E,
  o as Ke,
  l as ye,
  a3 as Qe,
  D as pe,
  a8 as Xe,
} from "./src/entries/options/index-DmNe5UVo.js";
import { i as Ye } from "../vendor/es-toolkit/isUndefined-Dgw4-efh.js";
import {
  X as O,
  bj as r,
  L as m,
  F as y,
  bv as Ze,
  U as t,
  c4 as e,
  H as f,
  bS as s,
  Q as g,
  J as p,
  bu as Q,
  b3 as Ie,
  E as ge,
  I as q,
  ck as a,
  aE as le,
  b4 as _e,
  an as et,
  D as N,
  cb as tt,
  a$ as lt,
  br as H,
  bJ as nt,
  bC as _,
  b5 as at,
  bp as it,
  bf as ot,
  ci as st,
  b0 as be,
  aQ as rt,
} from "../vendor/packages/site/index-COeZNva1.js";
import { u as ut } from "./useAdvanceFilter-CaHJJm2I.js";
import { e as V, c as M, b as j, s as Me, g as ne } from "./utils-DF6YUpNn.js";
import { _ as dt } from "./ResultParseStatus.vue_vue_type_script_setup_true_lang-DnjusWpw.js";
import { N as L } from "./NavButton-jVIhOejA.js";
import { b as mt, c as ct } from "../vendor/packages/site/utils/datetime-DQxMK7bP.js";
import { V as ft } from "../vendor/vuetify/VTooltip-BF7r8Igl.js";
import { g as vt, a as yt } from "../vendor/packages/site/utils/level-ChrMpKO_.js";
import { F as pt } from "../vendor/file-saver/FileSaver.min-BKZqLcYj.js";
import { a as re, f as Ve } from "./format-BjF3R_9h.js";
import { V as Ue } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import { E as G } from "../vendor/packages/site/types/base-Dy_28wGT.js";
import { l as Ae } from "./siteMetadata-DqOuo-u_.js";
import { b as gt } from "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import { V as bt } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as ke } from "../vendor/vuetify/VListItemAction-CeTFHb3m.js";
import { V as kt } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { V as Dt } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import { V as ht } from "../vendor/vuetify/VBadge-MSR38gir.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/es-toolkit/isEqual-xRaZZh9v.js";
import "../vendor/es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../vendor/es-toolkit/flatten-CRv0zNMl.js";
import "../vendor/date-fns/startOfMonth-CSVGuOFh.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/es-toolkit/uniqBy-DEckz2wg.js";
import "../vendor/packages/site/utils/filesize-D_1hx4u8.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/sub-D9RLuzs0.js";
import "../vendor/date-fns/subDays-DlPNbvmn.js";
import "../vendor/es-toolkit/intersection-CiePrUGh.js";
import "../vendor/date-fns/intervalToDuration-DvSvSXE3.js";
import "../vendor/date-fns/normalizeInterval-DC3nt56b.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
function wt(n) {
  return Ye(n);
}
const xt = ["title"],
  Rt = ["title"],
  Tt = ["title"],
  De = O({
    __name: "UserLevelShowSpan",
    props: {
      userInfo: {},
      levelRequirement: {},
      hideRatioInTable: { type: Boolean, default: !1 },
      useJoinTimeAsRef: { type: Boolean, default: !1 },
    },
    setup(n) {
      const { t: i } = ee(),
        u = X(),
        o = +new Date();
      function h() {
        u.myDataTableControl.showIntervalAsDate = !u.myDataTableControl.showIntervalAsDate;
      }
      function w() {
        u.myDataTableControl.simplifyBonusNumbers = !u.myDataTableControl.simplifyBonusNumbers;
      }
      function S(b) {
        const D = u.myDataTableControl.showIntervalAsDate,
          I = R(b),
          B = U(b);
        return { text: D ? B : I, title: D ? I : B };
      }
      function R(b) {
        try {
          return typeof b == "number" ? mt(b).substring(1) : b === "P" ? "0D" : b.substring(1);
        } catch (D) {
          return (console.error("Error formatting duration:", b, D), "");
        }
      }
      function U(b) {
        try {
          const D = n.useJoinTimeAsRef ? (n.userInfo.joinTime ?? o) : o;
          if (typeof b == "number") {
            const I = new Date(D + b * 1e3),
              B = j(I, "yyyy-MM-dd");
            return typeof B == "string" ? B : "";
          } else {
            const I = j(ct(b, D), "yyyy-MM-dd");
            return typeof I == "string" ? I : "";
          }
        } catch (D) {
          return (console.error("Error formatting interval date:", b, D), "");
        }
      }
      function A(b) {
        return (
          (u.myDataTableControl.simplifyBonusNumbers ? Me(n.levelRequirement[b]) : M(n.levelRequirement[b])) +
          (u.myDataTableControl.showBonusNeededInterval && n.levelRequirement[`${b}NeededInterval`]
            ? ` (~${n.levelRequirement[`${b}NeededInterval`]})`
            : "")
        );
      }
      return (b, D) => (
        r(),
        m(
          y,
          null,
          [
            Ze(b.$slots, "prepend"),
            n.levelRequirement.interval
              ? (r(),
                m(
                  y,
                  { key: 0 },
                  [
                    t(
                      v,
                      { title: e(i)("levelRequirement.interval"), icon: "mdi-calendar-clock", size: "small" },
                      null,
                      8,
                      ["title"],
                    ),
                    f(
                      "span",
                      {
                        title: S(n.levelRequirement.interval).title,
                        onDblclick: h,
                        style: { cursor: "pointer", "user-select": "none" },
                      },
                      s(S(n.levelRequirement.interval).text),
                      41,
                      xt,
                    ),
                    D[0] || (D[0] = g("; ", -1)),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.uploaded
              ? (r(),
                m(
                  y,
                  { key: 1 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.uploaded"),
                        color: "green-darken-4",
                        icon: "mdi-chevron-up",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(V)(n.levelRequirement.uploaded)) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.trueUploaded
              ? (r(),
                m(
                  y,
                  { key: 2 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.trueUploaded"),
                        color: "green-darken-4",
                        icon: "mdi-chevron-double-up",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(V)(n.levelRequirement.trueUploaded)) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.downloaded
              ? (r(),
                m(
                  y,
                  { key: 3 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.downloaded"),
                        color: "red-darken-4",
                        icon: "mdi-chevron-down",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(V)(n.levelRequirement.downloaded)) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.trueDownloaded
              ? (r(),
                m(
                  y,
                  { key: 4 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.trueDownloaded"),
                        color: "red-darken-4",
                        icon: "mdi-chevron-double-down",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(V)(n.levelRequirement.trueDownloaded)) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.totalTraffic
              ? (r(),
                m(
                  y,
                  { key: 5 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.totalTraffic"),
                        color: "orange-darken-4",
                        icon: "mdi-swap-vertical",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(V)(n.levelRequirement.totalTraffic)) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.ratio && !n.hideRatioInTable
              ? (r(),
                m(
                  y,
                  { key: 6 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.ratio"),
                        color: "orange-darken-4",
                        icon: "mdi-scale-balance",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(n.levelRequirement.ratio) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.trueRatio && !n.hideRatioInTable
              ? (r(),
                m(
                  y,
                  { key: 7 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.trueRatio"),
                        color: "orange-darken-4",
                        icon: "mdi-scale",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(n.levelRequirement.trueRatio) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.seeding
              ? (r(),
                m(
                  y,
                  { key: 8 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.seeding"),
                        color: "green-darken-4",
                        icon: "mdi-sprout",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(M)(n.levelRequirement.seeding, { minimumFractionDigits: 0 })) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.seedingSize
              ? (r(),
                m(
                  y,
                  { key: 9 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.seedingSize"),
                        color: "blue-darken-4",
                        icon: "mdi-dns",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(V)(n.levelRequirement.seedingSize)) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.seedingTime
              ? (r(),
                m(
                  y,
                  { key: 10 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.seedingTime"),
                        color: "green-darken-4",
                        icon: "mdi-timer",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(R(n.levelRequirement.seedingTime)) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.averageSeedingTime
              ? (r(),
                m(
                  y,
                  { key: 11 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.averageSeedingTime"),
                        color: "blue-darken-4",
                        icon: "mdi-timer",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(R(n.levelRequirement.averageSeedingTime)) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.bonus
              ? (r(),
                m(
                  y,
                  { key: 12 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.bonus"),
                        color: "green-darken-4",
                        icon: "mdi-currency-usd",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    f(
                      "span",
                      {
                        title: e(M)(n.levelRequirement.bonus),
                        onDblclick: w,
                        style: { cursor: "pointer", "user-select": "none" },
                      },
                      s(A("bonus")),
                      41,
                      Rt,
                    ),
                    D[1] || (D[1] = g("; ", -1)),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.seedingBonus
              ? (r(),
                m(
                  y,
                  { key: 13 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.seedingBonus"),
                        color: "green-darken-4",
                        icon: "mdi-lightning-bolt-circle",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    f(
                      "span",
                      {
                        title: e(M)(n.levelRequirement.seedingBonus),
                        onDblclick: w,
                        style: { cursor: "pointer", "user-select": "none" },
                      },
                      s(A("seedingBonus")),
                      41,
                      Tt,
                    ),
                    D[2] || (D[2] = g("; ", -1)),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.bonusPerHour
              ? (r(),
                m(
                  y,
                  { key: 14 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.bonusPerHour"),
                        color: "green-darken-4",
                        icon: "mdi-leaf",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(M)(n.levelRequirement.bonusPerHour)) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.uploads
              ? (r(),
                m(
                  y,
                  { key: 15 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.uploads"),
                        color: "green-darken-4",
                        icon: "mdi-file-upload",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(M)(n.levelRequirement.uploads, { minimumFractionDigits: 0 })) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.leeching
              ? (r(),
                m(
                  y,
                  { key: 16 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.leeching"),
                        color: "red-darken-4",
                        icon: "mdi-file-download",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(M)(n.levelRequirement.leeching, { minimumFractionDigits: 0 })) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.snatches
              ? (r(),
                m(
                  y,
                  { key: 17 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.snatches"),
                        color: "orange-darken-4",
                        icon: "mdi-file-check",
                        size: "small",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(M)(n.levelRequirement.snatches, { minimumFractionDigits: 0 })) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.posts
              ? (r(),
                m(
                  y,
                  { key: 18 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.posts"),
                        color: "green darken-4",
                        icon: "mdi-note-plus",
                        small: "",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(M)(n.levelRequirement.posts, { minimumFractionDigits: 0 })) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
            n.levelRequirement.adoptions
              ? (r(),
                m(
                  y,
                  { key: 19 },
                  [
                    t(
                      v,
                      {
                        title: e(i)("levelRequirement.adoptions"),
                        color: "green-darken-4",
                        icon: "mdi-hand-extended",
                        small: "",
                      },
                      null,
                      8,
                      ["title"],
                    ),
                    g(" " + s(e(M)(n.levelRequirement.adoptions, { minimumFractionDigits: 0 })) + "; ", 1),
                  ],
                  64,
                ))
              : p("", !0),
          ],
          64,
        )
      );
    },
  }),
  ze = O({
    __name: "UserLevelsComponent",
    props: {
      userInfo: {},
      levelRequirement: {},
      hideRatioInTable: { type: Boolean, default: !1 },
      useJoinTimeAsRef: { type: Boolean, default: !1 },
    },
    setup(n) {
      return (i, u) => (
        r(),
        m(
          y,
          null,
          [
            t(
              De,
              {
                "user-info": n.userInfo,
                "level-requirement": n.levelRequirement,
                "hide-ratio-in-table": n.hideRatioInTable,
                useJoinTimeAsRef: n.useJoinTimeAsRef,
              },
              null,
              8,
              ["user-info", "level-requirement", "hide-ratio-in-table", "useJoinTimeAsRef"],
            ),
            n.levelRequirement.alternative
              ? (r(),
                m(
                  y,
                  { key: 0 },
                  [
                    t(v, { icon: "mdi-file-table-box-multiple-outline", size: "small" }),
                    u[2] || (u[2] = g(" ( ", -1)),
                    (r(!0),
                    m(
                      y,
                      null,
                      Q(
                        n.levelRequirement.alternative,
                        (o, h) => (
                          r(),
                          m(
                            y,
                            { key: h },
                            [
                              u[0] || (u[0] = g(" [ ", -1)),
                              t(
                                De,
                                {
                                  "user-info": n.userInfo,
                                  "level-requirement": o,
                                  "hide-ratio-in-table": n.hideRatioInTable,
                                  useJoinTimeAsRef: n.useJoinTimeAsRef,
                                },
                                null,
                                8,
                                ["user-info", "level-requirement", "hide-ratio-in-table", "useJoinTimeAsRef"],
                              ),
                              u[1] || (u[1] = g(" ] ", -1)),
                            ],
                            64,
                          )
                        ),
                      ),
                      128,
                    )),
                    u[3] || (u[3] = g(" ) ", -1)),
                  ],
                  64,
                ))
              : p("", !0),
          ],
          64,
        )
      );
    },
  }),
  qt = { key: 0 },
  he = O({
    __name: "UserNextLevelUnMet",
    props: {
      nextLevelUnMet: {},
      userInfo: {},
      showNextLevelName: { type: Boolean, default: !0 },
      iconClass: { default: "mr-3" },
    },
    setup(n) {
      return (i, u) => (
        r(),
        m(
          y,
          null,
          [
            t(v, { icon: "mdi-keyboard-tab", color: "orange", size: "small", class: Ie(n.iconClass) }, null, 8, [
              "class",
            ]),
            n.showNextLevelName && n.nextLevelUnMet.level
              ? (r(), m("span", qt, s(n.nextLevelUnMet.level.name) + ": ", 1))
              : p("", !0),
            t(
              ze,
              { "user-info": n.userInfo, "level-requirement": n.nextLevelUnMet, "hide-ratio-in-table": !0 },
              null,
              8,
              ["user-info", "level-requirement"],
            ),
          ],
          64,
        )
      );
    },
  }),
  St = { key: 0, class: "text-no-wrap" },
  Ct = ["title"],
  It = { key: 1 },
  Mt = O({
    __name: "UserLevelRequirementsTd",
    props: { userInfo: {} },
    setup(n) {
      const i = He(),
        { t: u } = ee(),
        o = X(),
        h = ue(),
        w = ge(() => h.getSiteMergedMetadata(n.userInfo.site, "levelRequirements", []), []),
        S = ge(() => h.getSiteMergedMetadata(n.userInfo.site, "userInfo"), void 0),
        R = N(() => w.value?.find((k) => k.id === n.userInfo.levelId)),
        U = N(() =>
          o.myDataTableControl.normalizeLevelName ? (R.value?.name ?? n.userInfo.levelName) : n.userInfo.levelName,
        ),
        A = N(() => vt(n.userInfo, w.value)),
        b = N(() => (R.value?.groupType ? R.value.groupType : yt(n.userInfo.levelName ?? "user"))),
        D = N(() => n.userInfo.isDonor === !0 && S.value?.donorConfig?.isAccountKept === !0),
        I = N(() => {
          switch (b.value) {
            case "vip":
              return "green";
            case "manager":
              return "indigo";
            case "user":
              return R.value?.isKept || D.value ? "light-blue" : "";
            default:
              return "";
          }
        }),
        B = { user: "mdi-account-hard-hat", vip: "mdi-check-decagram", manager: "mdi-account-cog" },
        x = N(() => B[b.value] || B.user);
      return (k, d) =>
        n.userInfo.levelName
          ? (r(),
            m("span", St, [
              e(o).myDataTableControl.showLevelRequirement && e(w) && e(w).length > 0
                ? (r(),
                  q(
                    ft,
                    {
                      key: 0,
                      "content-class": "bg-white pa-0",
                      interactive: "",
                      location: "end bottom",
                      "open-on-click": e(i).mobile.value,
                    },
                    {
                      activator: a(({ props: C }) => [
                        f(
                          "span",
                          _e(et(C)),
                          [
                            t(v, { icon: x.value, size: "small", color: I.value, class: "mr-1" }, null, 8, [
                              "icon",
                              "color",
                            ]),
                            f("span", { class: Ie(`text-${I.value}`) }, s(U.value), 3),
                            e(o).myDataTableControl.showNextLevelInTable && b.value === "user" && e(le)(A.value)
                              ? (r(), q(v, { key: 0, icon: "mdi-check", color: "green", size: "small", class: "ml-1" }))
                              : p("", !0),
                            d[0] || (d[0] = f("br", null, null, -1)),
                            e(o).myDataTableControl.showNextLevelInTable && b.value === "user" && !e(le)(A.value)
                              ? (r(),
                                q(
                                  he,
                                  {
                                    key: 1,
                                    "next-level-un-met": A.value,
                                    "show-next-level-name": !1,
                                    "user-info": n.userInfo,
                                    "icon-class": "mr-1",
                                  },
                                  null,
                                  8,
                                  ["next-level-un-met", "user-info"],
                                ))
                              : p("", !0),
                          ],
                          16,
                        ),
                      ]),
                      default: a(() => [
                        t(
                          Z,
                          { class: "border-sm overflow-y-auto", "max-height": "500", "max-width": "800" },
                          {
                            default: a(() => [
                              t(
                                oe,
                                { class: "pa-2" },
                                {
                                  default: a(() => [
                                    t(
                                      se,
                                      { class: "pa-0 level_requirement_list", density: "compact" },
                                      {
                                        default: a(() => [
                                          e(o).myDataTableControl.showNextLevelInDialog &&
                                          b.value === "user" &&
                                          !e(le)(A.value)
                                            ? (r(),
                                              q(
                                                P,
                                                { key: 0, border: "", class: "list-item-half-spacer px-1 py-0" },
                                                {
                                                  default: a(() => [
                                                    t(
                                                      he,
                                                      { "next-level-un-met": A.value, "user-info": n.userInfo },
                                                      null,
                                                      8,
                                                      ["next-level-un-met", "user-info"],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                              ))
                                            : p("", !0),
                                          e(w).length > 0
                                            ? (r(),
                                              q(
                                                Oe,
                                                { key: 1 },
                                                {
                                                  default: a(() => [
                                                    g(s(e(u)("MyData.UserLevelRequirementsTd.levelList")), 1),
                                                  ]),
                                                  _: 1,
                                                },
                                              ))
                                            : p("", !0),
                                          (r(!0),
                                          m(
                                            y,
                                            null,
                                            Q(
                                              e(w),
                                              (C) => (
                                                r(),
                                                m(
                                                  y,
                                                  { key: C.id },
                                                  [
                                                    !e(o).myDataTableControl.onlyShowUserLevelRequirement ||
                                                    (C.groupType !== "vip" && C.groupType !== "manager") ||
                                                    b.value !== "user"
                                                      ? (r(),
                                                        m(
                                                          y,
                                                          { key: 0 },
                                                          [
                                                            t(
                                                              P,
                                                              { class: "list-item-half-spacer px-1 py-0" },
                                                              {
                                                                prepend: a(() => [
                                                                  t(
                                                                    v,
                                                                    {
                                                                      color:
                                                                        C.id <= (n.userInfo.levelId ?? -1)
                                                                          ? "green"
                                                                          : "red",
                                                                      icon:
                                                                        C.id <= (n.userInfo.levelId ?? -1)
                                                                          ? "mdi-check"
                                                                          : "mdi-block-helper",
                                                                      size: "small",
                                                                    },
                                                                    null,
                                                                    8,
                                                                    ["color", "icon"],
                                                                  ),
                                                                ]),
                                                                default: a(() => [
                                                                  f("div", null, [
                                                                    f("span", null, s(C.name) + ": ", 1),
                                                                    t(
                                                                      ze,
                                                                      {
                                                                        "user-info": n.userInfo,
                                                                        "level-requirement": C,
                                                                        useJoinTimeAsRef: !0,
                                                                      },
                                                                      null,
                                                                      8,
                                                                      ["user-info", "level-requirement"],
                                                                    ),
                                                                  ]),
                                                                  f(
                                                                    "div",
                                                                    {
                                                                      class: "text-ellipsis text-truncate",
                                                                      title: C.privilege,
                                                                    },
                                                                    s(C.privilege),
                                                                    9,
                                                                    Ct,
                                                                  ),
                                                                ]),
                                                                _: 2,
                                                              },
                                                              1024,
                                                            ),
                                                            t(K, { class: "ma-1" }),
                                                          ],
                                                          64,
                                                        ))
                                                      : p("", !0),
                                                  ],
                                                  64,
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
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["open-on-click"],
                  ))
                : (r(),
                  m("span", It, [t(v, { icon: x.value, size: "small" }, null, 8, ["icon"]), g(" " + s(U.value), 1)])),
            ]))
          : (r(), m(y, { key: 1 }, [g("-")], 64));
    },
  }),
  Vt = Re(Mt, [["__scopeId", "data-v-e8b7a9f0"]]),
  Ut = { class: "text-no-wrap" },
  At = ["title"],
  zt = { class: "text-no-wrap" },
  Nt = { class: "text-no-wrap" },
  Bt = { class: "text-no-wrap" },
  $t = { class: "text-no-wrap" },
  jt = { class: "text-no-wrap" },
  Ft = { class: "text-no-wrap" },
  Pt = { class: "text-no-wrap" },
  Lt = { class: "text-no-wrap" },
  Ht = { class: "text-no-wrap" },
  Ot = O({
    __name: "HistoryDataViewDialog",
    props: lt({ siteId: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(n) {
      const i = tt(n, "modelValue"),
        u = n,
        { t: o } = ee(),
        h = j(+new Date(), "yyyy-MM-dd"),
        w = H({}),
        S = nt([]),
        R = [
          { title: o("common.date"), key: "date", align: "center" },
          { title: o("common.username"), key: "name", align: "center", sortable: !1 },
          { title: o("MyData.table.levelName"), key: "levelName", align: "start", sortable: !1 },
          { title: o("MyData.table.userData"), key: "uploaded", align: "end", sortable: !1 },
          { title: o("levelRequirement.ratio"), key: "ratio", align: "end", sortable: !1 },
          { title: o("levelRequirement.seeding"), key: "seeding", align: "end", sortable: !1 },
          { title: o("levelRequirement.seedingSize"), key: "seedingSize", align: "end", sortable: !1 },
          { title: o("levelRequirement.bonus"), key: "bonus", align: "end", sortable: !1 },
          { title: o("common.action"), key: "action", align: "center", width: 90, sortable: !1 },
        ],
        U = H([]);
      function A(x) {
        _("getSiteUserInfo", x).then((k) => {
          const d = [];
          for (const [C, F] of Object.entries(k)) d.push({ ...Ve(F), date: C });
          S.value = d;
        });
      }
      function b(x) {
        confirm(o("MyData.HistoryDataView.deleteConfirm")) &&
          _("removeSiteUserInfo", { siteId: u.siteId, date: x.filter((k) => k != h) }).then(() => {
            A(u.siteId);
          });
      }
      const D = H(!1);
      function I(x) {
        ((w.value = x), (D.value = !0));
      }
      function B() {
        let x = S.value;
        U.value.length > 0 && (x = S.value.filter((d) => U.value.includes(d.date)));
        const k = new Blob([JSON.stringify(x, null, 2)], { type: "application/json" });
        pt.saveAs(k, `site-history-data-${u.siteId}.json`);
      }
      return (x, k) => (
        r(),
        q(
          fe,
          {
            modelValue: i.value,
            "onUpdate:modelValue": k[4] || (k[4] = (d) => (i.value = d)),
            width: "1200",
            onAfterEnter: k[5] || (k[5] = () => u.siteId && A(u.siteId)),
            onAfterLeave: k[6] || (k[6] = () => (S.value = [])),
          },
          {
            default: a(() => [
              t(Z, null, {
                default: a(() => [
                  t(
                    Te,
                    { class: "pa-0" },
                    {
                      default: a(() => [
                        t(
                          Ee,
                          { color: "blue-grey-darken-2" },
                          {
                            append: a(() => [
                              t(
                                W,
                                {
                                  icon: "mdi-close",
                                  title: e(o)("common.dialog.close"),
                                  onClick: k[0] || (k[0] = (d) => (i.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: a(() => [
                              t(Je, null, {
                                default: a(() => [
                                  g(s(e(o)("MyData.HistoryDataView.title")) + " @ ", 1),
                                  t(qe, { "site-id": u.siteId, class: "", tag: "span" }, null, 8, ["site-id"]),
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
                  t(K),
                  t(oe, null, {
                    default: a(() => [
                      t(
                        Ue,
                        {
                          modelValue: U.value,
                          "onUpdate:modelValue": k[2] || (k[2] = (d) => (U.value = d)),
                          headers: R,
                          items: S.value,
                          "sort-by": [{ key: "date", order: "desc" }],
                          class: "table-stripe",
                          hover: "",
                          "item-selectable": "_selectable",
                          "item-value": "date",
                          "items-per-page": "10",
                          "show-select": "",
                        },
                        {
                          "item.date": a(({ item: d }) => [f("span", Ut, s(d.date), 1)]),
                          "item.name": a(({ item: d }) => [
                            f("span", { title: d.id, class: "text-no-wrap" }, s(d.name ?? "-"), 9, At),
                          ]),
                          "item.levelName": a(({ item: d }) => [f("span", zt, s(d.levelName ?? "-"), 1)]),
                          "item.uploaded": a(({ item: d }) => [
                            t(
                              J,
                              null,
                              {
                                default: a(() => [
                                  t(
                                    z,
                                    { class: "flex-nowrap", justify: "end" },
                                    {
                                      default: a(() => [
                                        f("span", Nt, s(typeof d.uploaded < "u" ? e(V)(d.uploaded) : "-"), 1),
                                        t(v, { color: "green-darken-4", icon: "mdi-chevron-up", small: "" }),
                                      ]),
                                      _: 2,
                                    },
                                    1024,
                                  ),
                                  t(
                                    z,
                                    { class: "flex-nowrap", justify: "end" },
                                    {
                                      default: a(() => [
                                        f("span", Bt, s(typeof d.downloaded < "u" ? e(V)(d.downloaded) : "-"), 1),
                                        t(v, { color: "red-darken-4", icon: "mdi-chevron-down", small: "" }),
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
                          "item.ratio": a(({ item: d }) => [f("span", $t, s(e(re)(d)), 1)]),
                          "item.uploads": a(({ item: d }) => [f("span", jt, s(d.uploads ?? "-"), 1)]),
                          "item.seeding": a(({ item: d }) => [f("span", Ft, s(d.seeding ?? "-"), 1)]),
                          "item.seedingSize": a(({ item: d }) => [
                            f("span", Pt, s(typeof d.seedingSize < "u" ? e(V)(d.seedingSize) : "-"), 1),
                          ]),
                          "item.bonus": a(({ item: d }) => [
                            t(
                              J,
                              null,
                              {
                                default: a(() => [
                                  t(
                                    z,
                                    { justify: "end", align: "center" },
                                    { default: a(() => [f("span", Lt, s(d.bonus ? e(M)(d.bonus) : "-"), 1)]), _: 2 },
                                    1024,
                                  ),
                                  t(
                                    z,
                                    { justify: "end", align: "center" },
                                    {
                                      default: a(() => [
                                        f("span", Ht, s(d.seedingBonus ? e(M)(d.seedingBonus) : "-"), 1),
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
                          "item.action": a(({ item: d }) => [
                            t(
                              Ce,
                              { variant: "text" },
                              {
                                default: a(() => [
                                  t(
                                    W,
                                    {
                                      title: e(o)("MyData.HistoryDataView.action.viewRaw"),
                                      icon: "mdi-eye",
                                      size: "small",
                                      onClick: () => I(d),
                                    },
                                    null,
                                    8,
                                    ["title", "onClick"],
                                  ),
                                  t(
                                    W,
                                    {
                                      disabled: d.status == e(G).success && d.date == e(h),
                                      title: e(o)("common.remove"),
                                      color: "error",
                                      icon: "mdi-delete",
                                      size: "small",
                                      onClick: () => b([d.date]),
                                    },
                                    null,
                                    8,
                                    ["disabled", "title", "onClick"],
                                  ),
                                ]),
                                _: 2,
                              },
                              1024,
                            ),
                          ]),
                          "footer.prepend": a(() => [
                            t(
                              L,
                              {
                                disabled: U.value.length <= 0,
                                color: "error",
                                icon: "mdi-delete",
                                text: e(o)("common.remove"),
                                onClick: k[1] || (k[1] = (d) => b(U.value)),
                              },
                              null,
                              8,
                              ["disabled", "text"],
                            ),
                            t(
                              L,
                              { color: "info", icon: "mdi-export", text: e(o)("common.export"), onClick: B },
                              null,
                              8,
                              ["text"],
                            ),
                            t(Se),
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
              t(
                fe,
                { modelValue: D.value, "onUpdate:modelValue": k[3] || (k[3] = (d) => (D.value = d)), width: "800" },
                {
                  default: a(() => [
                    t(Z, null, {
                      default: a(() => [
                        t(oe, null, {
                          default: a(() => [f("pre", null, " " + s(JSON.stringify(w.value, null, 2)), 1)]),
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
            ]),
            _: 1,
          },
          8,
          ["modelValue"],
        )
      );
    },
  }),
  Et = ["title"],
  ae = O({
    __name: "BonusFormatSpan",
    props: { num: {} },
    setup(n) {
      const i = X(),
        u = N(() =>
          typeof n.num == "number" && Number.isFinite(n.num)
            ? { type: "number", value: n.num }
            : { type: "text", value: typeof n.num == "string" ? n.num : typeof n.num > "u" ? "-" : "N/A" },
        ),
        o = N(() => (u.value.type === "number" ? M(u.value.value) : u.value.value)),
        h = N(() =>
          u.value.type === "number"
            ? i.myDataTableControl.simplifyBonusNumbers
              ? Me(u.value.value)
              : M(u.value.value)
            : u.value.value,
        );
      function w() {
        u.value.type === "number" &&
          (i.myDataTableControl.simplifyBonusNumbers = !i.myDataTableControl.simplifyBonusNumbers);
      }
      return (S, R) => (
        r(),
        m(
          "span",
          {
            class: "text-no-wrap",
            title: o.value,
            onDblclick: w,
            style: at({ cursor: u.value.type === "number" ? "pointer" : "default", userSelect: "none" }),
          },
          s(h.value),
          45,
          Et,
        )
      );
    },
  }),
  Y = ue(),
  Ne = H({}),
  we = N(() => Object.values(Ne.value));
async function Be(n, i) {
  const u = new Date(),
    h = (await Ae([n]))[n];
  Ne.value[n] = {
    ...Ve(i),
    site: n,
    siteUserConfig: Y.sites[n],
    siteName: h.combinedSiteName,
    selectable: !(h.isDead || h.isOffline),
    lastAccessDuration: typeof i.lastAccessAt == "number" ? gt(u, i.lastAccessAt) : 0,
  };
}
async function xe() {
  const n = X(),
    i = await Ae(Object.keys(Y.sites)),
    u = [];
  for (const [o, h] of Object.entries(Y.sites)) {
    const w = i[o];
    if (
      w.type === "public" ||
      (!n.userInfo.showDeadSiteInOverview && w.isDead) ||
      (!w.isDead && !n.userInfo.showPassedSiteInOverview && (h.isOffline || h.allowQueryUserInfo === !1))
    )
      continue;
    const S = Y.lastUserInfo[o] ?? {};
    u.push(
      Be(o, S).catch((R) => {
        console.error(`initTableData: updatePerSiteData failed for ${o}`, R);
      }),
    );
  }
  await Promise.allSettled(u);
}
function ie(n) {
  const i = de();
  for (const u of n)
    ((i.userInfo.flushPlan[u] = !0),
      _("getSiteUserInfoResult", u)
        .then((o) => Be(u, o))
        .catch((o) => {
          i.userInfo.flushPlan[u] ||
            (i.showSnakebar(`获取站点 [${u}] 用户信息失败`, { color: "error" }), console.error(o));
        })
        .finally(() => {
          i.userInfo.flushPlan[u] = !1;
        }));
}
async function Jt() {
  const n = de();
  for (const i in n.userInfo.flushPlan) n.userInfo.flushPlan[i] = !1;
  (await _("cancelUserInfoQueue", void 0), n.showSnakebar("用户信息刷新队列已取消", { color: "error" }));
}
const Wt = { class: "text-subtitle-2" },
  Gt = { key: 1, class: "text-grey caption" },
  Kt = { class: "d-flex flex-column align-center" },
  Qt = { class: "favicon-hover-wrapper favicon-hover-bg" },
  Xt = ["title"],
  Yt = { class: "text-no-wrap" },
  Zt = { class: "text-no-wrap" },
  _t = { class: "text-no-wrap" },
  el = { class: "text-no-wrap" },
  tl = { class: "text-no-wrap" },
  ll = { class: "text-no-wrap" },
  nl = { class: "text-no-wrap" },
  al = { class: "text-no-wrap" },
  il = { key: 0, class: "d-inline-flex align-center ml-2" },
  ol = { class: "text-no-wrap" },
  sl = { key: 1, class: "d-inline-flex align-center ml-1" },
  rl = { class: "text-no-wrap" },
  ul = { class: "text-no-wrap" },
  dl = { class: "text-no-wrap" },
  ml = ["title"],
  cl = ["title"],
  fl = ["title"],
  vl = O({
    __name: "Index",
    setup(n) {
      const { t: i } = ee(),
        u = We(),
        o = X(),
        h = de(),
        w = ue(),
        S = new Date(),
        R = it([
          { title: i("common.site"), key: "siteUserConfig.sortIndex", align: "center", props: { disabled: !0 } },
          { title: i("common.username"), key: "name", align: "center" },
          { title: i("MyData.table.levelName"), key: "levelName", align: "start", width: "15%" },
          { title: i("MyData.table.userData"), key: "uploaded", align: "end" },
          { title: i("MyData.table.trueUserData"), key: "trueUploaded", align: "end" },
          { title: i("levelRequirement.ratio"), key: "ratio", align: "end" },
          { title: i("levelRequirement.trueRatio"), key: "trueRatio", align: "end" },
          { title: i("levelRequirement.uploads"), key: "uploads", align: "end" },
          { title: i("levelRequirement.seeding"), key: "seeding", align: "end" },
          { title: i("levelRequirement.seedingSize"), key: "seedingSize", align: "end" },
          { title: i("levelRequirement.bonus"), key: "bonus", align: "end" },
          { title: i("levelRequirement.bonusPerHour"), key: "bonusPerHour", align: "end" },
          { title: i("MyData.table.invites"), key: "invites", align: "end" },
          { title: i("MyData.table.joinTime"), key: "joinTime", align: "center" },
          { title: i("MyData.table.lastAccessAt"), key: "lastAccessAt", align: "center" },
          { title: i("MyData.table.updateAt"), key: "updateAt", align: "center" },
          { title: i("common.action"), key: "action", align: "center", sortable: !1, props: { disabled: !0 } },
        ]),
        U = N(() => R.filter((T) => T?.props?.disabled || o.tableBehavior.MyData.columns.includes(T.key))),
        A = ["joinTimeFormat", "joinTimeWeekOnly"],
        b = N(() => Object.keys(o.myDataTableControl).filter((T) => A.indexOf(T) === -1)),
        {
          tableWaitFilterRef: D,
          tableFilterRef: I,
          tableFilterFn: B,
          advanceFilterDictRef: x,
          updateTableFilterValueFn: k,
          buildFilterDictFn: d,
          toggleKeywordStateFn: C,
        } = ut({
          parseOptions: { keywords: ["site", "status", "siteUserConfig.groups"], ranges: ["updateAt", "messageCount"] },
          titleFields: ["site", "siteName", "name"],
          format: { status: "number" },
        }),
        F = H([]);
      (ot(() => xe()),
        st(
          () => w.lastUserInfo,
          () => {
            Object.values(h.userInfo.flushPlan).some((T) => T) || xe();
          },
          { debounce: 5e3, deep: !0 },
        ));
      const te = H(!1),
        me = H(null);
      function $e(T) {
        ((te.value = !0), (me.value = T));
      }
      async function je() {
        for (const T of F.value) {
          const c = await w.getSiteUrl(T);
          c && window.open(c, "_blank", "noopener noreferrer");
        }
      }
      async function Fe() {
        let T = F.value;
        (T.length === 0 &&
          ((T = we.value.map((c) => c.site)),
          h.showSnakebar(i("MyData.index.noSiteSelectedRefreshAll"), { color: "info" })),
          T.length > 0 ? ie(T) : h.showSnakebar(i("MyData.index.noSiteSelectedCancelRefresh"), { color: "warning" }));
      }
      function Pe() {
        u.push({ name: "UserDataTimeline", query: { sites: F.value } });
      }
      function Le() {
        u.push({ name: "UserDataStatistic", query: { sites: F.value } });
      }
      return (T, c) => (
        r(),
        m(
          y,
          null,
          [
            t(bt, { title: e(i)("route.Overview.MyData"), type: "info" }, null, 8, ["title"]),
            t(Z, null, {
              default: a(() => [
                t(Te, null, {
                  default: a(() => [
                    t(
                      z,
                      { class: "ma-0" },
                      {
                        default: a(() => [
                          e(h).isUserInfoFlush
                            ? (r(),
                              q(
                                L,
                                {
                                  key: 0,
                                  text: e(i)("MyData.index.flushCancel"),
                                  color: "red",
                                  icon: "mdi-cancel",
                                  onClick: e(Jt),
                                },
                                null,
                                8,
                                ["text", "onClick"],
                              ))
                            : (r(),
                              q(
                                L,
                                {
                                  key: 1,
                                  text: e(i)("MyData.index.flushSelectSite"),
                                  color: "green",
                                  icon: "mdi-cached",
                                  onClick: Fe,
                                },
                                null,
                                8,
                                ["text"],
                              )),
                          t(
                            L,
                            {
                              disabled: F.value.length === 0,
                              color: "indigo",
                              icon: "mdi-open-in-new",
                              text: e(i)("MyData.index.multiOpen"),
                              onClick: je,
                            },
                            null,
                            8,
                            ["disabled", "text"],
                          ),
                          t(K, { class: "mx-2", vertical: "" }),
                          t(
                            L,
                            {
                              color: "green",
                              icon: "mdi-chart-timeline-variant",
                              text: e(i)("MyData.index.viewTimeline"),
                              onClick: Pe,
                            },
                            null,
                            8,
                            ["text"],
                          ),
                          t(
                            L,
                            {
                              color: "green",
                              icon: "mdi-equalizer",
                              text: e(i)("MyData.index.viewStatistic"),
                              onClick: Le,
                            },
                            null,
                            8,
                            ["text"],
                          ),
                          t(K, { class: "mx-2", vertical: "" }),
                          t(
                            ve,
                            { "close-on-content-clicks": !1 },
                            {
                              activator: a(({ props: l }) => [
                                t(
                                  L,
                                  be(
                                    {
                                      color: "blue",
                                      icon: "mdi-cog",
                                      text: e(i)("MyData.index.setting"),
                                      class: "mr-1",
                                    },
                                    l,
                                  ),
                                  null,
                                  16,
                                  ["text"],
                                ),
                              ]),
                              default: a(() => [
                                t(se, null, {
                                  default: a(() => [
                                    t(P, null, {
                                      prepend: a(() => [
                                        t(
                                          ke,
                                          { start: "", class: "ml-2" },
                                          {
                                            default: a(() => [
                                              t(v, { icon: "mdi-calendar-account", class: "mr-2" }),
                                              f("span", Wt, s(e(i)("MyData.index.joinTimeFormat")), 1),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                      ]),
                                      default: a(() => [
                                        t(
                                          Ge,
                                          {
                                            modelValue: e(o).myDataTableControl.joinTimeFormat,
                                            "onUpdate:modelValue": [
                                              c[0] || (c[0] = (l) => (e(o).myDataTableControl.joinTimeFormat = l)),
                                              c[2] || (c[2] = () => e(o).$save()),
                                            ],
                                            density: "compact",
                                            "hide-details": "",
                                            class: "ml-2",
                                            onClick: c[1] || (c[1] = E(() => {}, ["stop"])),
                                          },
                                          {
                                            default: a(() => [
                                              (r(),
                                              m(
                                                y,
                                                null,
                                                Q(["alive", "aliveWeek", "added"], (l) =>
                                                  t(
                                                    W,
                                                    {
                                                      key: l,
                                                      value: l,
                                                      title: e(i)(`MyData.index.joinTimeFormatOptions.${l}`),
                                                      density: "compact",
                                                      "hide-details": "",
                                                    },
                                                    {
                                                      default: a(() => [
                                                        g(s(e(i)(`MyData.index.joinTimeFormatOptions.${l}`)), 1),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1032,
                                                    ["value", "title"],
                                                  ),
                                                ),
                                                64,
                                              )),
                                            ]),
                                            _: 1,
                                          },
                                          8,
                                          ["modelValue"],
                                        ),
                                      ]),
                                      _: 1,
                                    }),
                                    t(K),
                                    (r(!0),
                                    m(
                                      y,
                                      null,
                                      Q(
                                        b.value,
                                        (l) => (
                                          r(),
                                          q(
                                            P,
                                            { key: l, value: l },
                                            {
                                              prepend: a(() => [
                                                t(
                                                  ke,
                                                  { start: "", class: "ml-2" },
                                                  {
                                                    default: a(() => [
                                                      t(
                                                        kt,
                                                        {
                                                          modelValue: e(o).myDataTableControl[l],
                                                          "onUpdate:modelValue": [
                                                            ($) => (e(o).myDataTableControl[l] = $),
                                                            c[4] || (c[4] = () => e(o).$save()),
                                                          ],
                                                          label: ` ${e(i)("MyData.index." + l)}`,
                                                          color: "success",
                                                          density: "compact",
                                                          "hide-details": "",
                                                          onClick: c[3] || (c[3] = E(() => {}, ["stop"])),
                                                        },
                                                        null,
                                                        8,
                                                        ["modelValue", "onUpdate:modelValue", "label"],
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
                                            ["value"],
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
                          t(
                            Ke,
                            {
                              modelValue: e(o).tableBehavior.MyData.columns,
                              "onUpdate:modelValue": [
                                c[5] || (c[5] = (l) => (e(o).tableBehavior.MyData.columns = l)),
                                c[6] || (c[6] = (l) => e(o).updateTableBehavior("MyData", "columns", l)),
                              ],
                              items: R,
                              "return-object": !1,
                              chips: "",
                              class: "table-header-filter-clear",
                              density: "compact",
                              "hide-details": "",
                              "item-value": "key",
                              "max-width": "200",
                              multiple: "",
                              "prepend-inner-icon": "mdi-filter-cog",
                            },
                            {
                              chip: a(({ item: l, index: $ }) => [
                                $ === 0
                                  ? (r(),
                                    q(
                                      ye,
                                      { key: 0 },
                                      { default: a(() => [f("span", null, s(l.title), 1)]), _: 2 },
                                      1024,
                                    ))
                                  : p("", !0),
                                $ === 1
                                  ? (r(),
                                    m("span", Gt, " (+" + s(e(o).tableBehavior.MyData.columns.length - 1) + ") ", 1))
                                  : p("", !0),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue", "items"],
                          ),
                          t(Se),
                          t(
                            Qe,
                            {
                              modelValue: e(D),
                              "onUpdate:modelValue": c[12] || (c[12] = (l) => (rt(D) ? (D.value = l) : null)),
                              "append-icon": "mdi-magnify",
                              clearable: "",
                              density: "compact",
                              "hide-details": "",
                              label: e(i)("common.search"),
                              "max-width": "500",
                              "single-line": "",
                              "onClick:clear": c[13] || (c[13] = (l) => e(d)("")),
                            },
                            {
                              "prepend-inner": a(() => [
                                t(
                                  ve,
                                  { "min-width": "100" },
                                  {
                                    activator: a(({ props: l }) => [
                                      t(v, be(l, { icon: "mdi-filter", variant: "plain" }), null, 16),
                                    ]),
                                    default: a(() => [
                                      t(
                                        se,
                                        { class: "pa-0" },
                                        {
                                          default: a(() => [
                                            t(
                                              pe,
                                              { class: "ma-2" },
                                              { default: a(() => [g(s(e(i)("MyData.index.siteStatus")), 1)]), _: 1 },
                                            ),
                                            t(
                                              P,
                                              {
                                                title: e(i)("MyData.index.filter.todayNotUpdated"),
                                                onClick:
                                                  c[7] ||
                                                  (c[7] = E(() => {
                                                    ((e(x).updateAt = ["", e(j)(e(S), "yyyyMMdd")]), e(k)());
                                                  }, ["stop"])),
                                              },
                                              null,
                                              8,
                                              ["title"],
                                            ),
                                            t(
                                              P,
                                              {
                                                title: e(i)("MyData.index.filter.lastUpdateError"),
                                                onClick:
                                                  c[8] ||
                                                  (c[8] = E(() => {
                                                    ((e(x).status.required = [
                                                      e(G).parseError,
                                                      e(G).unknownError,
                                                      e(G).needLogin,
                                                    ].map((l) => l.toString())),
                                                      e(k)());
                                                  }, ["stop"])),
                                              },
                                              null,
                                              8,
                                              ["title"],
                                            ),
                                            t(
                                              P,
                                              {
                                                title: e(i)("MyData.index.filter.unreadMessage"),
                                                onClick:
                                                  c[9] ||
                                                  (c[9] = E(() => {
                                                    ((e(x).messageCount = [1, " "]), e(k)());
                                                  }, ["stop"])),
                                              },
                                              null,
                                              8,
                                              ["title"],
                                            ),
                                            t(
                                              pe,
                                              { class: "ma-2" },
                                              { default: a(() => [g(s(e(i)("MyData.index.siteCategory")), 1)]), _: 1 },
                                            ),
                                            (r(!0),
                                            m(
                                              y,
                                              null,
                                              Q(
                                                e(w).getSitesGroupData,
                                                (l, $) => (
                                                  r(),
                                                  q(
                                                    P,
                                                    { key: $, value: $, class: "pr-6" },
                                                    {
                                                      default: a(() => [
                                                        t(
                                                          Dt,
                                                          {
                                                            modelValue: e(x)["siteUserConfig.groups"].required,
                                                            "onUpdate:modelValue": [
                                                              c[10] ||
                                                                (c[10] = (ce) =>
                                                                  (e(x)["siteUserConfig.groups"].required = ce)),
                                                              c[11] || (c[11] = () => e(k)()),
                                                            ],
                                                            label: `${$} (${l.length})`,
                                                            value: $,
                                                            density: "compact",
                                                            "hide-details": "",
                                                            indeterminate: "",
                                                            onClick: E(
                                                              (ce) => e(C)("siteUserConfig.groups", $),
                                                              ["stop"],
                                                            ),
                                                          },
                                                          null,
                                                          8,
                                                          ["modelValue", "label", "value", "onClick"],
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
                            ["modelValue", "label"],
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                  ]),
                  _: 1,
                }),
                t(
                  Ue,
                  {
                    modelValue: F.value,
                    "onUpdate:modelValue": c[14] || (c[14] = (l) => (F.value = l)),
                    "custom-filter": e(B),
                    "filter-keys": ["site"],
                    headers: U.value,
                    items: e(we),
                    "items-per-page": e(o).tableBehavior.MyData.itemsPerPage,
                    "multi-sort": e(o).enableTableMultiSort,
                    search: e(I),
                    "sort-by": e(o).tableBehavior.MyData.sortBy,
                    class: "table-stripe table-header-no-wrap table-no-ext-padding",
                    hover: "",
                    "item-selectable": "selectable",
                    "item-value": "site",
                    "show-select": "",
                    "onUpdate:itemsPerPage":
                      c[15] || (c[15] = (l) => e(o).updateTableBehavior("MyData", "itemsPerPage", l)),
                    "onUpdate:sortBy": c[16] || (c[16] = (l) => e(o).updateTableBehavior("MyData", "sortBy", l)),
                  },
                  {
                    "item.siteUserConfig.sortIndex": a(({ item: l }) => [
                      f("div", Kt, [
                        t(
                          ht,
                          {
                            "model-value": e(o).myDataTableControl.showUnreadMessage && (l.messageCount ?? 0) > 0,
                            content: (l.messageCount ?? 0) > 10 ? void 0 : l.messageCount,
                            color: "error",
                          },
                          {
                            default: a(() => [
                              f("div", Qt, [
                                t(
                                  Xe,
                                  {
                                    "site-id": l.site,
                                    size: e(o).myDataTableControl.showSiteName ? 18 : 24,
                                    onClick: () => e(ie)([l.site]),
                                  },
                                  null,
                                  8,
                                  ["site-id", "size", "onClick"],
                                ),
                              ]),
                            ]),
                            _: 2,
                          },
                          1032,
                          ["model-value", "content"],
                        ),
                        e(o).myDataTableControl.showSiteName
                          ? (r(), q(qe, { key: 0, "site-id": l.site }, null, 8, ["site-id"]))
                          : p("", !0),
                      ]),
                    ]),
                    "item.name": a(({ item: l }) => [
                      f(
                        "span",
                        { title: l.id, class: "text-no-wrap" },
                        s(e(o).myDataTableControl.showUserName ? (l.name ?? "-") : "******"),
                        9,
                        Xt,
                      ),
                    ]),
                    "item.levelName": a(({ item: l }) => [t(Vt, { "user-info": l }, null, 8, ["user-info"])]),
                    "item.uploaded": a(({ item: l }) => [
                      t(
                        J,
                        null,
                        {
                          default: a(() => [
                            t(
                              z,
                              { class: "flex-nowrap", justify: "end" },
                              {
                                default: a(() => [
                                  f("span", Yt, s(typeof l.uploaded < "u" ? e(V)(l.uploaded) : "-"), 1),
                                  t(v, { color: "green-darken-4", icon: "mdi-chevron-up", size: "small" }),
                                ]),
                                _: 2,
                              },
                              1024,
                            ),
                            t(
                              z,
                              { class: "flex-nowrap", justify: "end" },
                              {
                                default: a(() => [
                                  f("span", Zt, s(typeof l.downloaded < "u" ? e(V)(l.downloaded) : "-"), 1),
                                  t(v, { color: "red-darken-4", icon: "mdi-chevron-down", size: "small" }),
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
                    "item.trueUploaded": a(({ item: l }) => [
                      t(
                        J,
                        null,
                        {
                          default: a(() => [
                            t(
                              z,
                              { class: "flex-nowrap", justify: "end" },
                              {
                                default: a(() => [
                                  f("span", _t, s(typeof l.trueUploaded < "u" ? e(V)(l.trueUploaded) : "-"), 1),
                                  t(v, { color: "green-darken-4", icon: "mdi-chevron-up", size: "small" }),
                                ]),
                                _: 2,
                              },
                              1024,
                            ),
                            t(
                              z,
                              { class: "flex-nowrap", justify: "end" },
                              {
                                default: a(() => [
                                  f("span", el, s(typeof l.trueDownloaded < "u" ? e(V)(l.trueDownloaded) : "-"), 1),
                                  t(v, { color: "red-darken-4", icon: "mdi-chevron-down", size: "small" }),
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
                    "item.ratio": a(({ item: l }) => [f("span", tl, s(e(re)(l)), 1)]),
                    "item.trueRatio": a(({ item: l }) => [f("span", ll, s(e(re)(l, "trueRatio")), 1)]),
                    "item.uploads": a(({ item: l }) => [f("span", nl, s(l.uploads ?? "-"), 1)]),
                    "item.seeding": a(({ item: l }) => [
                      t(
                        J,
                        { class: "py-0" },
                        {
                          default: a(() => [
                            t(
                              z,
                              { align: "center", class: "flex-nowrap my-0", justify: "end" },
                              { default: a(() => [f("span", al, s(l.seeding ?? "-"), 1)]), _: 2 },
                              1024,
                            ),
                            e(o).myDataTableControl.showHnR
                              ? (r(),
                                q(
                                  z,
                                  { key: 0, align: "center", class: "flex-nowrap my-0", justify: "end" },
                                  {
                                    default: a(() => [
                                      typeof l.hnrPreWarning < "u" && l.hnrPreWarning > 0
                                        ? (r(),
                                          m("span", il, [
                                            t(
                                              v,
                                              {
                                                title: e(i)("levelRequirement.hnrPreWarning"),
                                                color: "yellow-darken-4",
                                                icon: "mdi-alert",
                                                size: "small",
                                              },
                                              null,
                                              8,
                                              ["title"],
                                            ),
                                            f("span", ol, s(l.hnrPreWarning), 1),
                                          ]))
                                        : p("", !0),
                                      typeof l.hnrUnsatisfied < "u" && l.hnrUnsatisfied > 0
                                        ? (r(),
                                          m("span", sl, [
                                            t(
                                              v,
                                              {
                                                title: e(i)("levelRequirement.hnrUnsatisfied"),
                                                color: "red-darken-4",
                                                icon: "mdi-alert-circle",
                                                size: "small",
                                              },
                                              null,
                                              8,
                                              ["title"],
                                            ),
                                            f("span", rl, s(l.hnrUnsatisfied), 1),
                                          ]))
                                        : p("", !0),
                                    ]),
                                    _: 2,
                                  },
                                  1024,
                                ))
                              : p("", !0),
                          ]),
                          _: 2,
                        },
                        1024,
                      ),
                    ]),
                    "item.seedingSize": a(({ item: l }) => [
                      f("span", ul, s(typeof l.seedingSize < "u" ? e(V)(l.seedingSize) : "-"), 1),
                    ]),
                    "item.bonus": a(({ item: l }) => [
                      t(
                        J,
                        null,
                        {
                          default: a(() => [
                            t(
                              z,
                              { align: "center", class: "flex-nowrap", justify: "end" },
                              {
                                default: a(() => [
                                  t(
                                    v,
                                    {
                                      title: e(i)("levelRequirement.bonus"),
                                      color: "green-darken-4",
                                      icon: "mdi-currency-usd",
                                      size: "small",
                                    },
                                    null,
                                    8,
                                    ["title"],
                                  ),
                                  t(ae, { num: l.bonus }, null, 8, ["num"]),
                                ]),
                                _: 2,
                              },
                              1024,
                            ),
                            e(o).myDataTableControl.showSeedingBonus && l.seedingBonus !== "" && !e(wt)(l.seedingBonus)
                              ? (r(),
                                q(
                                  z,
                                  { key: 0, align: "center", class: "flex-nowrap", justify: "end" },
                                  {
                                    default: a(() => [
                                      t(
                                        v,
                                        {
                                          title: e(i)("levelRequirement.seedingBonus"),
                                          color: "green-darken-4",
                                          icon: "mdi-lightning-bolt-circle",
                                          size: "small",
                                        },
                                        null,
                                        8,
                                        ["title"],
                                      ),
                                      t(ae, { num: l.seedingBonus }, null, 8, ["num"]),
                                    ]),
                                    _: 2,
                                  },
                                  1024,
                                ))
                              : p("", !0),
                          ]),
                          _: 2,
                        },
                        1024,
                      ),
                    ]),
                    "item.bonusPerHour": a(({ item: l }) => [t(ae, { num: l.bonusPerHour }, null, 8, ["num"])]),
                    "item.invites": a(({ item: l }) => [f("span", dl, s(typeof l.invites < "u" ? l.invites : "-"), 1)]),
                    "item.joinTime": a(({ item: l }) => [
                      f(
                        "span",
                        { class: "text-no-wrap", title: l.joinTime ? e(j)(l.joinTime) : "-" },
                        s(
                          typeof l.joinTime < "u"
                            ? e(o).myDataTableControl.joinTimeFormat === "aliveWeek"
                              ? e(ne)(l.joinTime, { weekOnly: !0 })
                              : e(o).myDataTableControl.joinTimeFormat === "alive"
                                ? e(ne)(l.joinTime)
                                : e(j)(l.joinTime, "yyyy-MM-dd")
                            : "-",
                        ),
                        9,
                        ml,
                      ),
                    ]),
                    "item.lastAccessAt": a(({ item: l }) => [
                      f(
                        "span",
                        { class: "text-no-wrap", title: l.lastAccessAt ? e(j)(l.lastAccessAt) : "-" },
                        [
                          typeof l.lastAccessAt < "u"
                            ? (r(),
                              m(
                                y,
                                { key: 0 },
                                [
                                  g(s(e(j)(l.lastAccessAt)) + " ", 1),
                                  l.lastAccessDuration >= 5
                                    ? (r(),
                                      q(
                                        v,
                                        {
                                          key: 0,
                                          icon: "mdi-alert",
                                          color: l.lastAccessDuration >= 15 ? "red" : "amber",
                                          title: e(i)("MyData.table.lastAccessDurationNote", [l.lastAccessDuration]),
                                        },
                                        null,
                                        8,
                                        ["color", "title"],
                                      ))
                                    : p("", !0),
                                ],
                                64,
                              ))
                            : (r(), m(y, { key: 1 }, [g("-")], 64)),
                        ],
                        8,
                        cl,
                      ),
                    ]),
                    "item.updateAt": a(({ item: l }) => [
                      l.status === e(G).success
                        ? (r(),
                          m(
                            "span",
                            { key: 0, class: "text-wrap", title: l.updateAt ? e(j)(l.updateAt) : "-" },
                            s(
                              l.updateAt
                                ? e(o).myDataTableControl.updateAtFormatAsAlive
                                  ? e(ne)(l.updateAt)
                                  : e(j)(l.updateAt)
                                : "-",
                            ),
                            9,
                            fl,
                          ))
                        : (r(),
                          q(
                            ye,
                            { key: 1, label: "" },
                            { default: a(() => [t(dt, { status: l.status }, null, 8, ["status"])]), _: 2 },
                            1024,
                          )),
                    ]),
                    "item.action": a(({ item: l }) => [
                      t(
                        Ce,
                        { class: "table-action", density: "compact", variant: "plain" },
                        {
                          default: a(() => [
                            t(
                              W,
                              {
                                title: e(i)("MyData.table.action.viewHistoryData"),
                                color: "blue",
                                icon: "mdi-view-list",
                                size: "small",
                                onClick: () => $e(l.site),
                              },
                              null,
                              8,
                              ["title", "onClick"],
                            ),
                            t(
                              W,
                              {
                                disabled: e(h).userInfo.flushPlan[l.site],
                                loading: e(h).userInfo.flushPlan[l.site],
                                title: e(i)("MyData.table.action.flushData"),
                                color: "green",
                                icon: "mdi-cached",
                                size: "small",
                                onClick: () => e(ie)([l.site]),
                              },
                              null,
                              8,
                              ["disabled", "loading", "title", "onClick"],
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
            t(
              Ot,
              {
                modelValue: te.value,
                "onUpdate:modelValue": c[17] || (c[17] = (l) => (te.value = l)),
                "site-id": me.value,
              },
              null,
              8,
              ["modelValue", "site-id"],
            ),
          ],
          64,
        )
      );
    },
  }),
  Yl = Re(vl, [["__scopeId", "data-v-c7ef5dcf"]]);
export { Yl as default };
