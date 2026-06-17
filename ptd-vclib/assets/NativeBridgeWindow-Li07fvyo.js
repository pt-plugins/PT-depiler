import { bN as L, T as M, n as q, A as _, f as N, l as k, c as w } from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as A,
  bf as I,
  I as u,
  ck as a,
  bC as B,
  bJ as $,
  bw as H,
  bj as g,
  U as r,
  Q as o,
  bS as i,
  c4 as s,
  H as c,
  J as C,
  D as J,
  br as S,
} from "../vendor/packages/site/index-COeZNva1.js";
import { V as U } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { V as v } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
const j = { class: "d-flex align-center ga-3" },
  Q = { class: "d-flex align-center ga-3" },
  W = { class: "d-block my-2 pa-2 bg-surface rounded" },
  X = { href: "https://github.com/pt-plugins/ptd-cli", target: "_blank", rel: "noopener" },
  te = A({
    __name: "NativeBridgeWindow",
    setup(K) {
      const { t } = L(),
        V = chrome.runtime.id;
      function x() {
        const n = navigator.userAgent;
        return n.includes("Edg/") ? "edge" : n.includes("Chromium/") ? "chromium" : "chrome";
      }
      const h = x(),
        G = J(() =>
          h === "firefox" ? "ptd install --browser firefox" : `ptd install --browser ${h} --extension-id ${V}`,
        ),
        e = $({ permissionGranted: !1, enabled: !0, state: "no-permission", connected: !1 }),
        f = S(!1),
        p = S(!1),
        d = S(!1);
      async function m() {
        try {
          e.value = await B("nativeBridgeGetStatus", void 0);
        } catch (n) {
          console.debug("[PTD] Failed to get bridge status:", n);
        }
      }
      async function P() {
        d.value = !0;
        try {
          (await chrome.permissions.request({ permissions: ["nativeMessaging"] }))
            ? await m()
            : console.debug("[PTD]", t("SetNativeBridge.permission.grantFailed"));
        } catch (n) {
          console.debug("[PTD] Permission request error:", n);
        } finally {
          d.value = !1;
        }
      }
      async function D() {
        d.value = !0;
        try {
          (await chrome.permissions.remove({ permissions: ["nativeMessaging"] }), await m());
        } catch (n) {
          console.debug("[PTD] Permission revoke error:", n);
        } finally {
          d.value = !1;
        }
      }
      async function T(n) {
        f.value = !0;
        try {
          e.value = await B("nativeBridgeSetEnabled", n);
        } catch (l) {
          console.debug("[PTD] Failed to set enabled:", l);
        } finally {
          f.value = !1;
        }
      }
      async function F(n = 5e3, l = 500) {
        const b = ["connecting", "retrying"],
          y = Date.now();
        for (; Date.now() - y < n; )
          if ((await new Promise((R) => setTimeout(R, l)), await m(), !b.includes(e.value.state))) return;
      }
      async function z() {
        p.value = !0;
        try {
          ((e.value = await B("nativeBridgeReconnect", void 0)), e.value.state === "connecting" && (await F()));
        } catch (n) {
          console.debug("[PTD] Reconnect failed:", n);
        } finally {
          p.value = !1;
        }
      }
      const E = {
        "no-permission": "grey",
        disabled: "grey",
        connecting: "orange",
        connected: "green",
        retrying: "orange",
        error: "red",
      };
      return (
        I(() => {
          m();
        }),
        (n, l) => {
          const b = H("i18n-t");
          return (
            g(),
            u(M, null, {
              default: a(() => [
                r(
                  q,
                  { md: "10", lg: "8" },
                  {
                    default: a(() => [
                      r(
                        _,
                        { class: "my-2" },
                        { default: a(() => [o(i(s(t)("SetNativeBridge.permission.title")), 1)]), _: 1 },
                      ),
                      r(
                        N,
                        { variant: "tonal", class: "mb-4 pa-4" },
                        {
                          default: a(() => [
                            c("div", j, [
                              r(
                                k,
                                {
                                  color: e.value.permissionGranted ? "green" : "grey",
                                  "prepend-icon": e.value.permissionGranted ? "mdi-check-circle" : "mdi-close-circle",
                                  variant: "elevated",
                                  size: "small",
                                },
                                {
                                  default: a(() => [
                                    o(
                                      i(
                                        e.value.permissionGranted
                                          ? s(t)("SetNativeBridge.permission.granted")
                                          : s(t)("SetNativeBridge.permission.notGranted"),
                                      ),
                                      1,
                                    ),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["color", "prepend-icon"],
                              ),
                              e.value.permissionGranted
                                ? (g(),
                                  u(
                                    w,
                                    {
                                      key: 1,
                                      color: "warning",
                                      variant: "text",
                                      size: "small",
                                      loading: d.value,
                                      onClick: D,
                                    },
                                    { default: a(() => [o(i(s(t)("SetNativeBridge.permission.revoke")), 1)]), _: 1 },
                                    8,
                                    ["loading"],
                                  ))
                                : (g(),
                                  u(
                                    w,
                                    {
                                      key: 0,
                                      color: "primary",
                                      variant: "elevated",
                                      size: "small",
                                      loading: d.value,
                                      onClick: P,
                                    },
                                    { default: a(() => [o(i(s(t)("SetNativeBridge.permission.grant")), 1)]), _: 1 },
                                    8,
                                    ["loading"],
                                  )),
                            ]),
                          ]),
                          _: 1,
                        },
                      ),
                      r(
                        _,
                        { class: "my-2" },
                        { default: a(() => [o(i(s(t)("SetNativeBridge.bridge.title")), 1)]), _: 1 },
                      ),
                      r(
                        N,
                        { variant: "tonal", class: "mb-4 pa-4", disabled: !e.value.permissionGranted },
                        {
                          default: a(() => [
                            r(
                              U,
                              {
                                "model-value": e.value.enabled,
                                label: s(t)("SetNativeBridge.bridge.enabled"),
                                loading: f.value,
                                disabled: !e.value.permissionGranted,
                                color: "primary",
                                "hide-details": "",
                                class: "mb-3",
                                "onUpdate:modelValue": l[0] || (l[0] = (y) => T(y)),
                              },
                              null,
                              8,
                              ["model-value", "label", "loading", "disabled"],
                            ),
                            c("div", Q, [
                              r(
                                k,
                                { color: E[e.value.state], variant: "elevated", size: "small" },
                                {
                                  default: a(() => [o(i(s(t)(`SetNativeBridge.bridge.status.${e.value.state}`)), 1)]),
                                  _: 1,
                                },
                                8,
                                ["color"],
                              ),
                              r(
                                w,
                                {
                                  color: "primary",
                                  variant: "text",
                                  size: "small",
                                  "prepend-icon": "mdi-connection",
                                  loading: p.value,
                                  disabled: !e.value.permissionGranted || !e.value.enabled,
                                  onClick: z,
                                },
                                { default: a(() => [o(i(s(t)("SetNativeBridge.bridge.testConnection")), 1)]), _: 1 },
                                8,
                                ["loading", "disabled"],
                              ),
                            ]),
                            e.value.lastError
                              ? (g(),
                                u(
                                  v,
                                  { key: 0, type: "error", variant: "tonal", density: "compact", class: "mt-3" },
                                  { default: a(() => [o(i(e.value.lastError), 1)]), _: 1 },
                                ))
                              : C("", !0),
                            e.value.permissionGranted &&
                            e.value.enabled &&
                            e.value.state !== "connected" &&
                            e.value.state !== "connecting"
                              ? (g(),
                                u(
                                  v,
                                  { key: 1, type: "warning", variant: "tonal", density: "compact", class: "mt-3" },
                                  {
                                    default: a(() => [
                                      o(i(s(t)("SetNativeBridge.info.setupCommand")) + " ", 1),
                                      c("code", W, i(G.value), 1),
                                      o(" " + i(s(t)("SetNativeBridge.info.setupHint")), 1),
                                    ]),
                                    _: 1,
                                  },
                                ))
                              : C("", !0),
                          ]),
                          _: 1,
                        },
                        8,
                        ["disabled"],
                      ),
                      r(
                        _,
                        { class: "my-2" },
                        { default: a(() => [o(i(s(t)("SetNativeBridge.info.title")), 1)]), _: 1 },
                      ),
                      r(
                        v,
                        { type: "info", variant: "tonal" },
                        {
                          default: a(() => [
                            o(i(s(t)("SetNativeBridge.info.description")) + " ", 1),
                            l[1] || (l[1] = c("br", null, null, -1)),
                            l[2] || (l[2] = c("br", null, null, -1)),
                            r(
                              b,
                              { keypath: "SetNativeBridge.info.cliRequired", tag: "span", class: "font-weight-bold" },
                              { default: a(() => [c("a", X, i(s(t)("SetNativeBridge.info.cliLink")), 1)]), _: 1 },
                            ),
                          ]),
                          _: 1,
                        },
                      ),
                      r(
                        v,
                        { type: "warning", variant: "tonal", class: "mt-2" },
                        { default: a(() => [o(i(s(t)("SetNativeBridge.info.privacy")), 1)]), _: 1 },
                      ),
                    ]),
                    _: 1,
                  },
                ),
              ]),
              _: 1,
            })
          );
        }
      );
    },
  });
export { te as default };
