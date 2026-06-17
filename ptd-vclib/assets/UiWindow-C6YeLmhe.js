import {
  bN as C,
  bz as D,
  bV as E,
  T as m,
  n as d,
  W as V,
  aq as N,
  C as O,
  x as w,
  t as p,
  A as S,
  a2 as y,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as A,
  L as f,
  U as l,
  ck as i,
  F as B,
  aE as j,
  bj as x,
  c4 as e,
  b0 as g,
  Q as u,
  bS as c,
  H as M,
  J as U,
} from "../vendor/packages/site/index-COeZNva1.js";
import { V as s } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { V as h } from "../vendor/vuetify/VTooltip-BF7r8Igl.js";
import { V as F } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
const I = ["auto", "light", "dark"],
  P = { class: "d-flex align-center" },
  R = { class: "d-flex align-center" },
  X = A({
    __name: "UiWindow",
    setup(W, { expose: k }) {
      const { t: n } = C(),
        a = D(),
        r = E();
      function v() {
        (Object.keys(r.sites).forEach((b) => {
          typeof r.sites[b].allowContentScript > "u" && (r.sites[b].allowContentScript = !0);
        }),
          r.$save());
      }
      function T() {
        a.contentScript.enabled && a.contentScript.allowExceptionSites && !j(r.sites) && v();
      }
      return (
        k({ beforeSave: T }),
        (b, o) => (
          x(),
          f(
            B,
            null,
            [
              l(m, null, {
                default: i(() => [
                  l(
                    d,
                    { md: "10", lg: "8" },
                    {
                      default: i(() => [
                        l(
                          V,
                          {
                            modelValue: e(a).lang,
                            "onUpdate:modelValue": o[0] || (o[0] = (t) => (e(a).lang = t)),
                            label: e(n)("SetBase.ui.changeLanguage"),
                            items: e(N),
                          },
                          null,
                          8,
                          ["modelValue", "label", "items"],
                        ),
                        l(
                          V,
                          {
                            modelValue: e(a).theme,
                            "onUpdate:modelValue": o[1] || (o[1] = (t) => (e(a).theme = t)),
                            label: e(n)("SetBase.ui.displayMode.index"),
                            items: e(I),
                          },
                          {
                            selection: i(({ item: t }) => [u(c(e(n)("SetBase.ui.displayMode." + t.raw)), 1)]),
                            item: i(({ item: t, props: L }) => [
                              l(O, g(L, { title: e(n)("SetBase.ui.displayMode." + t.raw) }), null, 16, ["title"]),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modelValue", "label", "items"],
                        ),
                        l(
                          s,
                          {
                            modelValue: e(a).showReleaseNoteOnVersionChange,
                            "onUpdate:modelValue": o[2] || (o[2] = (t) => (e(a).showReleaseNoteOnVersionChange = t)),
                            color: "success",
                            "hide-details": "",
                            label: e(n)("SetBase.ui.showReleaseNote"),
                          },
                          null,
                          8,
                          ["modelValue", "label"],
                        ),
                        l(
                          s,
                          {
                            modelValue: e(a).saveTableBehavior,
                            "onUpdate:modelValue": o[3] || (o[3] = (t) => (e(a).saveTableBehavior = t)),
                            color: "success",
                            "hide-details": "",
                            label: e(n)("SetBase.ui.saveTableBehavior"),
                          },
                          null,
                          8,
                          ["modelValue", "label"],
                        ),
                        l(
                          s,
                          {
                            modelValue: e(a).enableTableMultiSort,
                            "onUpdate:modelValue": o[4] || (o[4] = (t) => (e(a).enableTableMultiSort = t)),
                            color: "success",
                            "hide-details": "",
                            label: e(n)("SetBase.ui.enableTableMultiSort"),
                          },
                          {
                            append: i(() => [
                              l(
                                h,
                                { "max-width": "400", location: "bottom" },
                                {
                                  activator: i(({ props: t }) => [
                                    l(w, g({ color: "info", icon: "mdi-help-circle" }, t), null, 16),
                                  ]),
                                  default: i(() => [u(" " + c(e(n)("SetBase.ui.tableMultiSortNote")), 1)]),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modelValue", "label"],
                        ),
                        l(p),
                      ]),
                      _: 1,
                    },
                  ),
                ]),
                _: 1,
              }),
              l(m, null, {
                default: i(() => [
                  l(
                    d,
                    { md: "10", lg: "8" },
                    {
                      default: i(() => [
                        M("div", P, [
                          l(S, null, { default: i(() => [u(c(e(n)("SetBase.ui.contentScript")), 1)]), _: 1 }),
                          l(y),
                          l(
                            s,
                            {
                              modelValue: e(a).contentScript.enabled,
                              "onUpdate:modelValue": o[5] || (o[5] = (t) => (e(a).contentScript.enabled = t)),
                              color: "success",
                              "hide-details": "",
                              label: e(n)("common.enable"),
                            },
                            null,
                            8,
                            ["modelValue", "label"],
                          ),
                        ]),
                        e(a).contentScript.enabled
                          ? (x(),
                            f(
                              B,
                              { key: 0 },
                              [
                                l(
                                  F,
                                  { type: "warning", variant: "tonal" },
                                  { default: i(() => [u(c(e(n)("SetBase.ui.contentScriptWarning")), 1)]), _: 1 },
                                ),
                                l(
                                  m,
                                  { dense: "" },
                                  {
                                    default: i(() => [
                                      l(
                                        d,
                                        { cols: "12", md: "2", class: "d-flex align-center justify-center" },
                                        {
                                          default: i(() => [
                                            l(S, null, {
                                              default: i(() => [u(c(e(n)("SetBase.ui.basicSettings")), 1)]),
                                              _: 1,
                                            }),
                                          ]),
                                          _: 1,
                                        },
                                      ),
                                      l(d, null, {
                                        default: i(() => [
                                          l(
                                            s,
                                            {
                                              modelValue: e(a).contentScript.allowExceptionSites,
                                              "onUpdate:modelValue":
                                                o[6] || (o[6] = (t) => (e(a).contentScript.allowExceptionSites = t)),
                                              color: "success",
                                              "hide-details": "",
                                              label: e(n)("SetBase.ui.allowExceptionSites"),
                                            },
                                            null,
                                            8,
                                            ["modelValue", "label"],
                                          ),
                                          l(
                                            s,
                                            {
                                              modelValue: e(a).contentScript.enabledAtSocialSite,
                                              "onUpdate:modelValue":
                                                o[7] || (o[7] = (t) => (e(a).contentScript.enabledAtSocialSite = t)),
                                              color: "success",
                                              "hide-details": "",
                                              label: e(n)("SetBase.ui.enableOnSocialSite"),
                                            },
                                            null,
                                            8,
                                            ["modelValue", "label"],
                                          ),
                                          l(p),
                                        ]),
                                        _: 1,
                                      }),
                                    ]),
                                    _: 1,
                                  },
                                ),
                                l(
                                  m,
                                  { dense: "" },
                                  {
                                    default: i(() => [
                                      l(
                                        d,
                                        { cols: "12", md: "2", class: "d-flex align-center justify-center" },
                                        {
                                          default: i(() => [
                                            l(S, null, {
                                              default: i(() => [u(c(e(n)("SetBase.ui.sidebarStyle")), 1)]),
                                              _: 1,
                                            }),
                                          ]),
                                          _: 1,
                                        },
                                      ),
                                      l(d, null, {
                                        default: i(() => [
                                          l(
                                            s,
                                            {
                                              modelValue: e(a).contentScript.applyTheme,
                                              "onUpdate:modelValue":
                                                o[8] || (o[8] = (t) => (e(a).contentScript.applyTheme = t)),
                                              color: "success",
                                              "hide-details": "",
                                              label:
                                                `${e(n)("SetBase.ui.respondDisplayMode")}` +
                                                e(n)("SetBase.ui.displayMode.index"),
                                            },
                                            null,
                                            8,
                                            ["modelValue", "label"],
                                          ),
                                          l(
                                            s,
                                            {
                                              modelValue: e(a).contentScript.defaultOpenSpeedDial,
                                              "onUpdate:modelValue":
                                                o[9] || (o[9] = (t) => (e(a).contentScript.defaultOpenSpeedDial = t)),
                                              color: "success",
                                              "hide-details": "",
                                              label: e(n)("SetBase.ui.expandByDefault"),
                                            },
                                            null,
                                            8,
                                            ["modelValue", "label"],
                                          ),
                                          l(
                                            s,
                                            {
                                              modelValue: e(a).contentScript.stackedButtons,
                                              "onUpdate:modelValue":
                                                o[10] || (o[10] = (t) => (e(a).contentScript.stackedButtons = t)),
                                              color: "success",
                                              "hide-details": "",
                                              label: e(n)("SetBase.ui.useLargeIcon"),
                                            },
                                            null,
                                            8,
                                            ["modelValue", "label"],
                                          ),
                                          l(
                                            s,
                                            {
                                              modelValue: e(a).contentScript.fadeEnterStyle,
                                              "onUpdate:modelValue":
                                                o[11] || (o[11] = (t) => (e(a).contentScript.fadeEnterStyle = t)),
                                              color: "success",
                                              "hide-details": "",
                                              label: e(n)("SetBase.ui.enableFadeEffect"),
                                            },
                                            null,
                                            8,
                                            ["modelValue", "label"],
                                          ),
                                          l(p),
                                        ]),
                                        _: 1,
                                      }),
                                    ]),
                                    _: 1,
                                  },
                                ),
                                l(
                                  m,
                                  { dense: "" },
                                  {
                                    default: i(() => [
                                      l(
                                        d,
                                        { cols: "12", md: "2", class: "d-flex align-center justify-center" },
                                        {
                                          default: i(() => [
                                            l(S, null, {
                                              default: i(() => [u(c(e(n)("SetBase.ui.sidebarFunctions")), 1)]),
                                              _: 1,
                                            }),
                                          ]),
                                          _: 1,
                                        },
                                      ),
                                      l(d, null, {
                                        default: i(() => [
                                          l(
                                            s,
                                            {
                                              modelValue: e(a).contentScript.doubleConfirmAction,
                                              "onUpdate:modelValue":
                                                o[12] || (o[12] = (t) => (e(a).contentScript.doubleConfirmAction = t)),
                                              color: "success",
                                              "hide-details": "",
                                              label: e(n)("SetBase.ui.confirmTwoStep"),
                                            },
                                            null,
                                            8,
                                            ["modelValue", "label"],
                                          ),
                                          l(
                                            s,
                                            {
                                              modelValue: e(a).contentScript.dragLinkOnSpeedDial,
                                              "onUpdate:modelValue":
                                                o[13] || (o[13] = (t) => (e(a).contentScript.dragLinkOnSpeedDial = t)),
                                              color: "success",
                                              "hide-details": "",
                                              label: e(n)("SetBase.ui.allowDragLink"),
                                            },
                                            {
                                              append: i(() => [
                                                l(
                                                  h,
                                                  { "max-width": "400", location: "bottom" },
                                                  {
                                                    activator: i(({ props: t }) => [
                                                      l(w, g({ color: "info", icon: "mdi-help-circle" }, t), null, 16),
                                                    ]),
                                                    default: i(() => [u(" " + c(e(n)("SetBase.ui.dragNote")), 1)]),
                                                    _: 1,
                                                  },
                                                ),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["modelValue", "label"],
                                          ),
                                          l(
                                            V,
                                            {
                                              modelValue: e(a).contentScript.socialSiteSearchBy,
                                              "onUpdate:modelValue":
                                                o[14] || (o[14] = (t) => (e(a).contentScript.socialSiteSearchBy = t)),
                                              disabled: !e(a).contentScript.enabledAtSocialSite,
                                              items: ["id", "title", "imdb", "chosen"],
                                              "item-title": (t) => e(n)("SetBase.ui.socialSiteSearchBy." + t),
                                              "item-value": (t) => t,
                                              label: e(n)("SetBase.ui.socialSiteSearchLabel"),
                                            },
                                            null,
                                            8,
                                            ["modelValue", "disabled", "item-title", "item-value", "label"],
                                          ),
                                        ]),
                                        _: 1,
                                      }),
                                    ]),
                                    _: 1,
                                  },
                                ),
                              ],
                              64,
                            ))
                          : U("", !0),
                        l(p),
                      ]),
                      _: 1,
                    },
                  ),
                ]),
                _: 1,
              }),
              l(m, null, {
                default: i(() => [
                  l(
                    d,
                    { md: "10", lg: "8" },
                    {
                      default: i(() => [
                        M("div", R, [
                          l(S, null, { default: i(() => [u(c(e(n)("SetBase.ui.contextMenu")), 1)]), _: 1 }),
                          l(y),
                          l(
                            s,
                            {
                              modelValue: e(a).contextMenus.enabled,
                              "onUpdate:modelValue": o[15] || (o[15] = (t) => (e(a).contextMenus.enabled = t)),
                              color: "success",
                              "hide-details": "",
                              label: e(n)("common.enable"),
                            },
                            null,
                            8,
                            ["modelValue", "label"],
                          ),
                        ]),
                        e(a).contextMenus.enabled
                          ? (x(),
                            f(
                              B,
                              { key: 0 },
                              [
                                l(
                                  s,
                                  {
                                    modelValue: e(a).contextMenus.allowSelectionTextSearch,
                                    "onUpdate:modelValue":
                                      o[16] || (o[16] = (t) => (e(a).contextMenus.allowSelectionTextSearch = t)),
                                    color: "success",
                                    "hide-details": "",
                                    label: e(n)("SetBase.ui.contextMenuTextSearch"),
                                  },
                                  null,
                                  8,
                                  ["modelValue", "label"],
                                ),
                                l(
                                  s,
                                  {
                                    modelValue: e(a).contextMenus.allowSocialLinkSearch,
                                    "onUpdate:modelValue":
                                      o[17] || (o[17] = (t) => (e(a).contextMenus.allowSocialLinkSearch = t)),
                                    color: "success",
                                    "hide-details": "",
                                    label: e(n)("SetBase.ui.contextMenuSocialSearch"),
                                  },
                                  null,
                                  8,
                                  ["modelValue", "label"],
                                ),
                                l(
                                  s,
                                  {
                                    modelValue: e(a).contextMenus.allowLinkDownloadPush,
                                    "onUpdate:modelValue":
                                      o[18] || (o[18] = (t) => (e(a).contextMenus.allowLinkDownloadPush = t)),
                                    disabled: e(r).getEnabledDownloaders.length === 0,
                                    color: "success",
                                    "hide-details": "",
                                    label: e(n)("SetBase.ui.contextMenuLinkPush"),
                                  },
                                  null,
                                  8,
                                  ["modelValue", "disabled", "label"],
                                ),
                              ],
                              64,
                            ))
                          : U("", !0),
                      ]),
                      _: 1,
                    },
                  ),
                ]),
                _: 1,
              }),
            ],
            64,
          )
        )
      );
    },
  });
export { X as default };
