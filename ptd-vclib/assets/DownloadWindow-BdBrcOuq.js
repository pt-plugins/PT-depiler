import { bN as p, bz as b, bV as c, T as i, n as r, A as u, W as f } from "./src/entries/options/index-DmNe5UVo.js";
import { V as s } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { V as T } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import {
  X as B,
  L as g,
  U as e,
  ck as t,
  F as v,
  bj as C,
  c4 as l,
  Q as w,
  bS as m,
} from "../vendor/packages/site/index-COeZNva1.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
const L = ["web", "browser", "extension"],
  x = B({
    __name: "DownloadWindow",
    setup(M) {
      const { t: n } = p(),
        d = b(),
        V = c();
      async function D(S) {
        S || (await V.setLastDownloader({}));
      }
      return (S, a) => (
        C(),
        g(
          v,
          null,
          [
            e(i, null, {
              default: t(() => [
                e(
                  r,
                  { md: "10", lg: "8" },
                  {
                    default: t(() => [
                      e(
                        s,
                        {
                          modelValue: l(d).download.saveDownloadHistory,
                          "onUpdate:modelValue": a[0] || (a[0] = (o) => (l(d).download.saveDownloadHistory = o)),
                          label: l(n)("SetBase.download.saveDownloadHistory"),
                          color: "success",
                          "false-icon": "mdi-alert-octagon",
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
            e(i, null, {
              default: t(() => [
                e(
                  r,
                  { md: "10", lg: "8" },
                  {
                    default: t(() => [
                      e(u, null, { default: t(() => [w(m(l(n)("SetBase.download.myClientTitle")), 1)]), _: 1 }),
                      e(
                        s,
                        {
                          modelValue: l(d).download.initDownloaderTorrentOnEnter,
                          "onUpdate:modelValue":
                            a[1] || (a[1] = (o) => (l(d).download.initDownloaderTorrentOnEnter = o)),
                          label: l(n)("SetBase.download.initDownloaderTorrentOnEnter"),
                          color: "success",
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
            e(i, null, {
              default: t(() => [
                e(
                  r,
                  { md: "10", lg: "8" },
                  {
                    default: t(() => [
                      e(u, null, { default: t(() => [w(m(l(n)("SetBase.download.localDownloadTitle")), 1)]), _: 1 }),
                      e(
                        f,
                        {
                          modelValue: l(d).download.localDownloadMethod,
                          "onUpdate:modelValue": a[2] || (a[2] = (o) => (l(d).download.localDownloadMethod = o)),
                          label: l(n)("SetBase.download.localDownloadMethod"),
                          items: l(L).map((o) => ({
                            title: l(n)(`SetBase.download.localDownloadMethodOptions.${o}`),
                            value: o,
                          })),
                          hint: l(n)(
                            `SetBase.download.localDownloadMethodOptions.${l(d).download.localDownloadMethod}Tip`,
                          ),
                          "persistent-hint": "",
                        },
                        null,
                        8,
                        ["modelValue", "label", "items", "hint"],
                      ),
                      e(
                        s,
                        {
                          modelValue: l(d).download.ignoreSiteDownloadIntervalWhenLocalDownload,
                          "onUpdate:modelValue":
                            a[3] || (a[3] = (o) => (l(d).download.ignoreSiteDownloadIntervalWhenLocalDownload = o)),
                          color: "success",
                          "hide-details": "",
                          label: l(n)("SetBase.download.localDownloadIgnoreInterval"),
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
            e(i, null, {
              default: t(() => [
                e(
                  r,
                  { md: "10", lg: "8" },
                  {
                    default: t(() => [
                      e(u, null, {
                        default: t(() => [w(m(l(n)("SetBase.download.pushDownloadServerTitle")), 1)]),
                        _: 1,
                      }),
                      e(
                        s,
                        {
                          modelValue: l(d).download.useQuickSendToClient,
                          "onUpdate:modelValue": a[4] || (a[4] = (o) => (l(d).download.useQuickSendToClient = o)),
                          color: "success",
                          "hide-details": "",
                          label: l(n)("SetBase.download.useQuickSendToClient"),
                        },
                        null,
                        8,
                        ["modelValue", "label"],
                      ),
                      e(
                        T,
                        { type: "info", variant: "tonal", innerHTML: l(n)("SetBase.download.quickSendToClientNote") },
                        null,
                        8,
                        ["innerHTML"],
                      ),
                      e(
                        s,
                        {
                          modelValue: l(d).download.allowDownloaderFilterForSite,
                          "onUpdate:modelValue":
                            a[5] || (a[5] = (o) => (l(d).download.allowDownloaderFilterForSite = o)),
                          color: "success",
                          "hide-details": "",
                          label: l(n)("SetBase.download.enableSiteFilter"),
                        },
                        null,
                        8,
                        ["modelValue", "label"],
                      ),
                      e(
                        s,
                        {
                          modelValue: l(d).download.saveLastDownloader,
                          "onUpdate:modelValue": [
                            a[6] || (a[6] = (o) => (l(d).download.saveLastDownloader = o)),
                            a[7] || (a[7] = (o) => D(o)),
                          ],
                          label: l(n)("SetBase.download.saveLastDownloader"),
                          color: "success",
                          "hide-details": "",
                        },
                        null,
                        8,
                        ["modelValue", "label"],
                      ),
                      e(
                        s,
                        {
                          modelValue: l(d).download.allowDirectSendToClient,
                          "onUpdate:modelValue": a[8] || (a[8] = (o) => (l(d).download.allowDirectSendToClient = o)),
                          label: l(n)("SetBase.download.allowDirectSendToClient"),
                          color: "warning",
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
          ],
          64,
        )
      );
    },
  });
export { x as default };
