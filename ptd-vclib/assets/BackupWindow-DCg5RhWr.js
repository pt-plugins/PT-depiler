import { J as Z } from "../vendor/jszip/jszip.min-DP3ssR4z.js";
import {
  X as J,
  cb as q,
  I as M,
  ck as l,
  a$ as ee,
  br as T,
  U as a,
  Q as f,
  bS as g,
  c4 as s,
  L as B,
  bu as te,
  F as L,
  D as z,
  aE as ae,
  bC as K,
  Y as le,
  ae as F,
  bJ as E,
  bj as U,
  b0 as se,
  J as oe,
  cf as ne,
  ch as ie,
  H as V,
  R as $,
  b1 as re,
} from "../vendor/packages/site/index-COeZNva1.js";
import {
  bN as W,
  bz as G,
  bV as pe,
  c2 as ue,
  s as de,
  j as fe,
  a4 as me,
  a5 as ce,
  c as R,
  t as A,
  i as ge,
  B as ve,
  p as be,
  T as _,
  g as ye,
  a2 as Se,
  f as Ve,
  n as j,
  C as we,
  l as De,
  F as Ue,
  a8 as ke,
  a9 as Ce,
  A as H,
  a3 as Ie,
  x as O,
} from "./src/entries/options/index-DmNe5UVo.js";
import { o as Pe } from "../vendor/es-toolkit/omit-BqXgNNTz.js";
import { _ as Te } from "./CheckSwitchButton.vue_vue_type_script_setup_true_lang-B5aVIv06.js";
import { V as N } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as Re } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { f as xe } from "../vendor/packages/site/utils/datetime-DQxMK7bP.js";
import { p as Ee } from "../vendor/packages/site/utils/filesize-D_1hx4u8.js";
import { V as Me } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import { E as h } from "../vendor/packages/site/types/base-Dy_28wGT.js";
import { V as Fe } from "../vendor/vuetify/VBadge-MSR38gir.js";
import { V as $e } from "../vendor/vuetify/VFileInput-rB5Lk1yB.js";
import "./_commonjs-dynamic-modules-TDtrdbi3.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "./NavButton-jVIhOejA.js";
import "../vendor/date-fns/sub-D9RLuzs0.js";
import "../vendor/date-fns/subDays-DlPNbvmn.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
const Be = J({
    __name: "RestorePtppUserDataDialog",
    props: ee({ ptppUserData: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(C) {
      const r = q(C, "modelValue"),
        { t: u } = W(),
        b = G(),
        m = pe(),
        w = ue(),
        x = (t) => (typeof t == "string" ? Ee(t) : t),
        k = {
          trueDownloaded: { key: "trueDownloaded", format: x },
          totalTraffic: { key: "totalTraffic", format: x },
          seedingPoints: "seedingBonus",
          averageSeedtime: "averageSeedingTime",
          bonusPage: !1,
          unsatisfiedsPage: !1,
          unsatisfieds: { key: "hnrUnsatisfied", format: (t) => Number(t) },
          prewarn: "hnrPreWarning",
          lastUpdateTime: "updateAt",
          lastUpdateStatus: { key: "status", format: (t) => (t === "success" ? h.success : h.unknownError) },
          isLogged: !1,
          isLoading: !1,
          lastErrorMsg: !1,
          joinTime: {
            key: "joinTime",
            format: (t) => {
              if (typeof t == "number") {
                if (t > 1e12) return t;
                if (t > 1e9) return t * 1e3;
              }
              return typeof t == "string" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(t) ? xe(t) : t;
            },
          },
        },
        d = T(!1),
        v = T([]),
        D = E({}),
        S = z(() =>
          Object.keys(C.ptppUserData)
            .map((t) => ({ site: D.value[t], host: t }))
            .filter((t) => !!t.site)
            .map((t) => t.host),
        ),
        c = T(!1),
        o = (t) =>
          z(() => {
            let e = "progress-helper",
              i = "grey",
              n = "";
            return (
              S.value.includes(t)
                ? v.value.includes(t) &&
                  ((e = "progress-pencil"), (i = ""), (n = u("ptppSettings.RestorePtppUserDataDialog.selected")))
                : ((e = "progress-close"),
                  (i = "purple"),
                  (n = u("ptppSettings.RestorePtppUserDataDialog.notSupported"))),
              { "prepend-icon": `mdi-${e}`, color: i, title: n }
            );
          });
      function y(t) {
        const e = {};
        for (const [i, n] of Object.entries(t))
          if (k[i]) {
            const p = k[i];
            if (p === !1) continue;
            if (p === void 0) e[i] = n;
            else if (typeof p == "string") e[p] = n;
            else {
              const { key: I, format: P = void 0 } = p;
              e[I] = P ? P(n) : n;
            }
          } else e[i] = n;
        return e;
      }
      async function Q() {
        if (ae(m.sites) && !confirm(u("ptppSettings.RestorePtppUserDataDialog.noSiteWarning"))) {
          w.showSnakebar(u("ptppSettings.RestorePtppUserDataDialog.importCancelled"), { color: "warning" });
          return;
        }
        d.value = !0;
        const t = b.userInfo.autoReflush.enabled;
        try {
          t && ((b.userInfo.autoReflush.enabled = !1), await b.$save());
          const e = (await K("getExtStorage", "userInfo")) ?? {};
          for (const [i, n] of Object.entries(C.ptppUserData))
            if (v.value.includes(i)) {
              const p = D.value[i];
              e[p] ??= {};
              const I = n.latest ?? {};
              c.value &&
                I?.lastUpdateStatus === "success" &&
                (I?.lastUpdateTime ?? -1) > (m.lastUserInfo[p]?.updateAt ?? 0) &&
                (m.lastUserInfo[p] = { ...y(I), site: p });
              for (const [P, Y] of Object.entries(Pe(n, ["latest"])))
                (typeof e[p][P] > "u" || c.value) && (e[p][P] = { ...y(Y), site: p });
            }
          (await K("setExtStorage", { key: "userInfo", value: e }),
            await m.$save(),
            w.showSnakebar(u("ptppSettings.RestorePtppUserDataDialog.importSuccess")),
            setTimeout(() => (r.value = !1), 5e3));
        } catch (e) {
          (console.error("导入失败", e),
            w.showSnakebar(u("ptppSettings.RestorePtppUserDataDialog.importFailure"), { color: "error" }));
        } finally {
          ((b.userInfo.autoReflush.enabled = t), await b.$save(), (d.value = !1));
        }
      }
      async function X() {
        const t = {};
        for (const e of le) {
          m.sites[e]?.url && (t[F(m.sites[e].url)] = e);
          const i = await m.getSiteMergedMetadata(e, "urls", []);
          if (i.length > 0) for (const p of i) t[F(p)] = e;
          const n = await m.getSiteMergedMetadata(e, "legacyUrls", []);
          if (n.length > 0) for (const p of n) t[F(p)] = e;
        }
        ((D.value = t), (v.value = S.value));
      }
      return (t, e) => (
        U(),
        M(
          de,
          {
            modelValue: r.value,
            "onUpdate:modelValue": e[5] || (e[5] = (i) => (r.value = i)),
            persistent: d.value,
            "max-width": "800",
            scrollable: "",
            onAfterEnter: X,
          },
          {
            default: l(() => [
              a(Ve, null, {
                default: l(() => [
                  a(
                    fe,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        a(
                          me,
                          { color: "blue-grey-darken-2" },
                          {
                            append: l(() => [
                              a(
                                R,
                                {
                                  icon: "mdi-close",
                                  title: s(u)("common.dialog.close"),
                                  onClick: e[0] || (e[0] = (i) => (r.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: l(() => [
                              a(ce, null, {
                                default: l(() => [f(g(s(u)("ptppSettings.RestorePtppUserDataDialog.title")), 1)]),
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
                  a(A),
                  a(ge, null, {
                    default: l(() => [
                      a(
                        N,
                        { class: "mb-1 py-2", title: s(u)("ptppSettings.RestorePtppUserDataDialog.pendingImportData") },
                        {
                          append: l(() => [
                            a(
                              Te,
                              {
                                modelValue: v.value,
                                "onUpdate:modelValue": e[1] || (e[1] = (i) => (v.value = i)),
                                all: S.value,
                                size: void 0,
                                disabled: d.value,
                              },
                              null,
                              8,
                              ["modelValue", "all", "disabled"],
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["title"],
                      ),
                      a(ve, null, {
                        default: l(() => [
                          a(
                            be,
                            { class: "pa-0" },
                            {
                              default: l(() => [
                                a(
                                  _,
                                  { "no-gutters": "" },
                                  {
                                    default: l(() => [
                                      (U(!0),
                                      B(
                                        L,
                                        null,
                                        te(
                                          C.ptppUserData,
                                          (i, n) => (
                                            U(),
                                            M(
                                              j,
                                              { key: n, class: "pa-1", cols: "12", md: "6" },
                                              {
                                                default: l(() => [
                                                  a(
                                                    we,
                                                    { border: "", class: "bg-grey-lighten-4" },
                                                    {
                                                      prepend: l(() => [
                                                        a(
                                                          Me,
                                                          {
                                                            modelValue: v.value,
                                                            "onUpdate:modelValue":
                                                              e[2] || (e[2] = (p) => (v.value = p)),
                                                            disabled: !S.value.includes(n),
                                                            indeterminate: !S.value.includes(n),
                                                            value: n,
                                                            "hide-details": "",
                                                            "indeterminate-icon": "mdi-close",
                                                          },
                                                          null,
                                                          8,
                                                          ["modelValue", "disabled", "indeterminate", "value"],
                                                        ),
                                                      ]),
                                                      title: l(() => [
                                                        a(
                                                          Ue,
                                                          { class: "d-inline-flex align-center" },
                                                          {
                                                            default: l(() => [
                                                              f(g(n) + " ", 1),
                                                              S.value.includes(n)
                                                                ? (U(),
                                                                  B(
                                                                    L,
                                                                    { key: 0 },
                                                                    [
                                                                      e[6] || (e[6] = f(" -> ", -1)),
                                                                      a(
                                                                        ke,
                                                                        { "site-id": D.value[n], class: "mx-1" },
                                                                        null,
                                                                        8,
                                                                        ["site-id"],
                                                                      ),
                                                                      a(
                                                                        Ce,
                                                                        {
                                                                          "site-id": D.value[n],
                                                                          class: "text-no-wrap font-weight-bold",
                                                                          tag: "span",
                                                                        },
                                                                        null,
                                                                        8,
                                                                        ["site-id"],
                                                                      ),
                                                                    ],
                                                                    64,
                                                                  ))
                                                                : oe("", !0),
                                                            ]),
                                                            _: 2,
                                                          },
                                                          1024,
                                                        ),
                                                      ]),
                                                      append: l(() => [
                                                        a(
                                                          De,
                                                          se({ label: "" }, { ref_for: !0 }, o(n).value),
                                                          {
                                                            default: l(() => [
                                                              f(
                                                                g(
                                                                  s(u)(
                                                                    "ptppSettings.RestorePtppUserDataDialog.recordCount",
                                                                    [Object.keys(i).length - 1],
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 2,
                                                          },
                                                          1040,
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
                  a(A),
                  a(ye, null, {
                    default: l(() => [
                      a(
                        Re,
                        {
                          color: "success",
                          modelValue: c.value,
                          "onUpdate:modelValue": e[3] || (e[3] = (i) => (c.value = i)),
                          label: s(u)("ptppSettings.RestorePtppUserDataDialog.overwriteExisting"),
                          disabled: d.value,
                          "hide-details": "",
                          density: "compact",
                          class: "ml-5",
                        },
                        null,
                        8,
                        ["modelValue", "label", "disabled"],
                      ),
                      a(Se),
                      a(
                        R,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          disabled: d.value,
                          onClick: e[4] || (e[4] = (i) => (r.value = !1)),
                        },
                        { default: l(() => [f(g(s(u)("common.dialog.cancel")), 1)]), _: 1 },
                        8,
                        ["disabled"],
                      ),
                      a(
                        R,
                        {
                          color: "green",
                          "prepend-icon": "mdi-import",
                          variant: "text",
                          disabled: d.value,
                          onClick: Q,
                        },
                        { default: l(() => [f(g(s(u)("common.import")), 1)]), _: 1 },
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
          ["modelValue", "persistent"],
        )
      );
    },
  }),
  Le = { class: "font-weight-bold" },
  _e = ["innerHTML"],
  lt = J({
    __name: "BackupWindow",
    setup(C) {
      const { t: r } = W(),
        u = G(),
        b = T(!1),
        m = E(u.backup.encryptionKey),
        { history: w, undo: x } = ne(m, { throttle: 50 });
      ie(m, (c) => {
        u.backup.encryptionKey = c;
      });
      const k = T(!1),
        d = E(),
        v = E();
      async function D() {
        if (d.value instanceof File) {
          let c;
          d.value.name.match(/^PT-Plugin-Plus-Backup-.+\.zip$/)
            ? (c = await (await new Z().loadAsync(d.value)).file("userdatas.json")?.async("string"))
            : d.value.name == "userdatas.json" && (c = await d.value.text());
          try {
            if (!c || !c.startsWith("{")) throw new Error("Invalid file format");
            ((v.value = JSON.parse(c)), console.log(v.value), (k.value = !0));
          } catch {
            alert(r("ptppSettings.invalidFileFormat"));
          } finally {
            d.value = void 0;
          }
        }
      }
      function S() {
        m.value = re();
      }
      return (c, o) => (
        U(),
        B(
          L,
          null,
          [
            a(_, null, {
              default: l(() => [
                a(
                  j,
                  { md: "10", lg: "8" },
                  {
                    default: l(() => [
                      a(H, { class: "my-2" }, { default: l(() => [f(g(s(r)("ptppSettings.basicConfig")), 1)]), _: 1 }),
                      a(
                        N,
                        { class: "mb-2", type: "info", variant: "tonal" },
                        { default: l(() => [f(g(s(r)("ptppSettings.saveKeyNotice")), 1)]), _: 1 },
                      ),
                      a(
                        Ie,
                        {
                          modelValue: m.value,
                          "onUpdate:modelValue": o[0] || (o[0] = (y) => (m.value = y)),
                          "append-inner-icon": b.value ? "mdi-eye" : "mdi-eye-off",
                          label: s(r)("ptppSettings.encryptionKeyLabel"),
                          type: b.value ? "text" : "password",
                          "hide-details": "",
                          "onClick:appendInner": o[1] || (o[1] = (y) => (b.value = !b.value)),
                        },
                        {
                          append: l(() => [
                            a(
                              R,
                              {
                                disabled: s(w).length <= 1,
                                color: "green",
                                variant: "text",
                                icon: "",
                                title: s(r)("ptppSettings.undoKeyTitle"),
                                onClick: s(x),
                              },
                              {
                                default: l(() => [
                                  s(w).length > 1
                                    ? (U(),
                                      M(
                                        Fe,
                                        { key: 0, content: s(w).length - 1, max: 9, floating: "" },
                                        { default: l(() => [a(O, { color: "green", icon: "mdi-arrow-left" })]), _: 1 },
                                        8,
                                        ["content"],
                                      ))
                                    : (U(), M(O, { key: 1, icon: "mdi-arrow-left" })),
                                ]),
                                _: 1,
                              },
                              8,
                              ["disabled", "title", "onClick"],
                            ),
                            a(
                              R,
                              {
                                color: "warning",
                                icon: "mdi-key",
                                variant: "text",
                                title: s(r)("ptppSettings.randomGenTitle"),
                                onClick: S,
                              },
                              null,
                              8,
                              ["title"],
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["modelValue", "append-inner-icon", "label", "type"],
                      ),
                    ]),
                    _: 1,
                  },
                ),
              ]),
              _: 1,
            }),
            a(_, null, {
              default: l(() => [
                a(
                  j,
                  { md: "10", lg: "8" },
                  {
                    default: l(() => [
                      a(
                        H,
                        { class: "my-2" },
                        { default: l(() => [f(g(s(r)("ptppSettings.importConfigTitle")), 1)]), _: 1 },
                      ),
                      a(
                        N,
                        { class: "mb-2", type: "warning", variant: "tonal" },
                        {
                          default: l(() => [
                            V("span", Le, [
                              f(g(s(r)("ptppSettings.importConfigInfoLine1", { repoName: s($) })), 1),
                              o[4] || (o[4] = V("br", null, null, -1)),
                              f(" " + g(s(r)("ptppSettings.importConfigInfoPrep")), 1),
                              o[5] || (o[5] = V("br", null, null, -1)),
                            ]),
                            f(" 1. " + g(s(r)("ptppSettings.importStep1", { repoName: s($) })), 1),
                            o[6] || (o[6] = V("br", null, null, -1)),
                            f(" 2. " + g(s(r)("ptppSettings.importStep2", { repoName: s($) })), 1),
                            o[7] || (o[7] = V("br", null, null, -1)),
                            o[8] || (o[8] = f(" 3. ", -1)),
                            V(
                              "span",
                              { class: "font-weight-bold", innerHTML: s(r)("ptppSettings.importStep3") },
                              null,
                              8,
                              _e,
                            ),
                            o[9] || (o[9] = V("br", null, null, -1)),
                            f(" 4. " + g(s(r)("ptppSettings.importStep4")), 1),
                            o[10] || (o[10] = V("br", null, null, -1)),
                          ]),
                          _: 1,
                        },
                      ),
                      a(
                        $e,
                        {
                          modelValue: d.value,
                          "onUpdate:modelValue": [o[2] || (o[2] = (y) => (d.value = y)), D],
                          accept: "application/zip, application/json",
                          "show-size": "",
                          label: s(r)("ptppSettings.selectBackupFile"),
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
            a(
              Be,
              {
                modelValue: k.value,
                "onUpdate:modelValue": o[3] || (o[3] = (y) => (k.value = y)),
                "ptpp-user-data": v.value,
              },
              null,
              8,
              ["modelValue", "ptpp-user-data"],
            ),
          ],
          64,
        )
      );
    },
  });
export { lt as default };
