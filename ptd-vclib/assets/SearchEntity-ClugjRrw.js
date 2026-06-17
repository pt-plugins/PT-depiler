import {
  bN as le,
  bV as se,
  c2 as ne,
  f as de,
  a4 as we,
  a5 as Ve,
  a2 as O,
  c as _,
  x as Q,
  i as ce,
  B as Ie,
  G as Me,
  C as ve,
  F as je,
  D as Ze,
  cf as X,
  V as et,
  a8 as me,
  t as j,
  g as Ke,
  W as tt,
  a3 as Ae,
  s as xe,
  a7 as Pe,
  d as Se,
  n as N,
  Q as at,
  T as F,
  bz as fe,
  bE as Oe,
  l as ae,
  m as lt,
  a9 as Ee,
  j as De,
  p as He,
  A as W,
  o as ze,
  H as We,
  b$ as st,
  cd as ye,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as Y,
  cb as _e,
  ch as Re,
  bC as oe,
  bj as f,
  I as T,
  ck as a,
  U as t,
  Q as S,
  bS as i,
  c4 as e,
  L as x,
  F as D,
  bu as J,
  J as K,
  H as U,
  a$ as nt,
  br as R,
  D as L,
  b3 as Be,
  P as ot,
  a_ as it,
  bm as rt,
  bN as ut,
  bJ as dt,
  cl as ge,
  b0 as ct,
  aQ as mt,
} from "../vendor/packages/site/index-COeZNva1.js";
import { e as Te, b as be, g as ft } from "./utils-DF6YUpNn.js";
import { V as ue, _ as pt } from "../vendor/vuetify/VRangeSlider-BDy-mdmM.js";
import { _ as ht } from "./Index.vue_vue_type_script_setup_true_lang-BRuNpdRn.js";
import { E as q } from "../vendor/packages/site/types/torrent-BvvY2NbA.js";
import { u as yt, s as gt, g as vt } from "./useAdvanceFilter-CaHJJm2I.js";
import { V as Je, a as St } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { _ as bt } from "./SolutionDetail.vue_vue_type_script_setup_true_lang-PBS9W7DL.js";
import { _ as kt } from "./ResultParseStatus.vue_vue_type_script_setup_true_lang-DnjusWpw.js";
import { d as Le } from "../vendor/packages/site/utils/filter-Dko2hrfF.js";
import { E as A } from "../vendor/packages/site/types/base-Dy_28wGT.js";
import { V as wt } from "../vendor/vuetify/VDatePicker-CkT_t8C-.js";
import { Q as Vt } from "../vendor/date-fns/format-b1gG6cM7.js";
import { a as xt } from "../vendor/date-fns/subDays-DlPNbvmn.js";
import { V as $e } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import { V as Et } from "../vendor/vuetify/VListItemAction-CeTFHb3m.js";
import { V as Dt } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { V as _t } from "../vendor/vuetify/VTextarea-hZu3Ftop.js";
import { V as Tt } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/vuetify/VSkeletonLoader-YwNzPI56.js";
import "../vendor/es-toolkit/toMerged-Be-qf92q.js";
import "../vendor/es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../vendor/packages/downloader/index-BATa0ddy.js";
import "./___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../vendor/vuetify/VForm-CJoKT4R8.js";
import "../vendor/vuetify/VAutocomplete-DUqyo09O.js";
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
const Ct = ["href"],
  Ft = { class: "d-flex ga-1" },
  Ut = Y({
    __name: "KeepUploadDialog",
    props: nt({ torrentItems: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(h) {
      const o = _e(h, "modelValue"),
        { t: s } = le(),
        y = se(),
        r = ne(),
        l = R(new Map()),
        b = R([]),
        g = R(null),
        c = R(0),
        C = R(!1),
        $ = R(""),
        P = R(""),
        z = L(() => c.value > 1 && $.value),
        E = {
          downloading: s("SearchEntity.KeepUploadDialog.status.downloading"),
          waiting: s("SearchEntity.KeepUploadDialog.status.waiting"),
          downloaded: s("SearchEntity.KeepUploadDialog.status.downloaded"),
          success: s("SearchEntity.KeepUploadDialog.status.success"),
          failed: s("SearchEntity.KeepUploadDialog.status.failed"),
          downloadFailed: s("SearchEntity.KeepUploadDialog.status.downloadFailed"),
          missingFiles: s("SearchEntity.KeepUploadDialog.status.missingFiles"),
        };
      Re(o, (k) => {
        k && G();
      });
      function G() {
        ((l.value = new Map()),
          (b.value = []),
          (g.value = null),
          (c.value = 0),
          ($.value = y.defaultDownloader?.id || ""),
          (P.value = y.defaultDownloader?.folder || ""),
          h.torrentItems.forEach((k) => {
            if (k.link) {
              const v = crypto.randomUUID();
              (l.value.set(v, {
                id: v,
                data: k,
                torrent: null,
                loading: !0,
                verified: !1,
                status: E.downloading,
                error: !1,
              }),
                b.value.push(v),
                I(k, v)
                  .then((u) => {
                    w(u, v);
                  })
                  .catch(() => {
                    w(null, v);
                  }));
            }
          }));
      }
      async function I(k, v) {
        try {
          const u = await oe("getTorrentInfoForVerification", k),
            m = l.value.get(v);
          return m ? ((m.status = E.waiting), u) : null;
        } catch (u) {
          const m = l.value.get(v);
          throw (m && ((m.status = E.downloadFailed), (m.error = !0)), u);
        }
      }
      function w(k, v) {
        const u = l.value.get(v);
        if (!u) return;
        if (b.value[0] === v)
          g.value ||
            ((g.value = k),
            (u.loading = !1),
            k
              ? ((u.torrent = k), (u.verified = !0), (u.status = E.downloaded), c.value++)
              : ((u.verified = !1), (u.status = E.failed)));
        else {
          const n = l.value.get(b.value[0]);
          if (n?.loading) {
            setTimeout(() => w(k, v), 200);
            return;
          }
          const B = { loading: !1 };
          if ((n?.verified || (B.status = E.failed), !k || !n?.verified)) {
            Object.assign(u, B);
            return;
          }
          const Z = g.value,
            ee = k;
          (ee.infoHash && Z.infoHash && ee.infoHash === Z.infoHash
            ? (B.verified = !0)
            : ee.name === Z.name &&
              ee.length === Z.length &&
              (ee.files?.length === Z.files?.length
                ? (B.verified = ee.files.every((Ue) =>
                    Z.files.some((re) => Ue.path === re.path && Ue.length === re.length),
                  ))
                : ee.files.every((re) => Z.files.some((Ne) => re.path === Ne.path && re.length === Ne.length)) &&
                  (B.status = E.missingFiles)),
            (B.torrent = k),
            B.verified && c.value++,
            B.status || (B.status = B.verified ? E.success : E.failed),
            Object.assign(u, B));
        }
      }
      function d(k) {
        if (confirm(s("SearchEntity.KeepUploadDialog.addToKeepUploadConfirm"))) {
          const v = l.value.get(k);
          v && ((v.verified = !0), c.value++);
        }
      }
      function p(k) {
        const v = l.value.get(k);
        v && (v.verified && c.value--, l.value.delete(k), (b.value = b.value.filter((u) => u !== k)));
      }
      function H(k) {
        const v = l.value.get(k);
        v &&
          ((v.loading = !0),
          (v.status = E.downloading),
          I(v.data, k)
            .then((u) => {
              w(u, k);
            })
            .catch(() => {
              w(null, k);
            }));
      }
      function he() {
        o.value = !1;
      }
      function Ce(k) {
        return k.torrent?.files?.length ?? "N/A";
      }
      async function Fe() {
        if (!z.value || !$.value) return;
        const k = Array.from(l.value.values()).filter((v) => v.verified);
        if (k.length === 0) {
          r.showSnakebar(s("SearchEntity.KeepUploadDialog.noVerifiedItem"), { color: "error" });
          return;
        }
        C.value = !0;
        try {
          const v = y.downloaders[$.value],
            u = { downloaderId: $.value, savePath: P.value || void 0, clientName: v?.name || $.value },
            m = {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
              time: Date.now(),
              title: k[0].data.title || "Unknown",
              size: k[0].data.size || 0,
              downloadOptions: u,
              items: k.map((n) => ({
                site: n.data.site,
                title: n.data.title || "",
                subTitle: n.data.subTitle,
                link: n.data.url || "",
                url: n.data.link || "",
                size: n.data.size || 0,
                seeders: n.data.seeders,
                leechers: n.data.leechers,
              })),
            };
          (await oe("createKeepUploadTask", m),
            r.showSnakebar(s("SearchEntity.KeepUploadDialog.createSuccess"), { color: "success" }),
            he());
        } catch {
          r.showSnakebar(s("SearchEntity.KeepUploadDialog.createError"), { color: "error" });
        } finally {
          C.value = !1;
        }
      }
      return (k, v) => (
        f(),
        T(
          xe,
          {
            modelValue: o.value,
            "onUpdate:modelValue": v[2] || (v[2] = (u) => (o.value = u)),
            persistent: "",
            scrollable: "",
            "max-width": "1024",
          },
          {
            default: a(() => [
              t(de, null, {
                default: a(() => [
                  t(
                    we,
                    { dark: "", color: "blue-grey-darken-2" },
                    {
                      default: a(() => [
                        t(Ve, null, { default: a(() => [S(i(e(s)("SearchEntity.KeepUploadDialog.title")), 1)]), _: 1 }),
                        t(O),
                        t(
                          _,
                          {
                            icon: "",
                            variant: "text",
                            color: "success",
                            href: "https://github.com/pt-plugins/PT-Plugin-Plus/wiki/keep-upload-task",
                            target: "_blank",
                            rel: "noopener noreferrer nofollow",
                            title: e(s)("common.howToUse"),
                          },
                          {
                            default: a(() => [
                              t(Q, null, { default: a(() => [...(v[3] || (v[3] = [S("mdi-help", -1)]))]), _: 1 }),
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
                  t(
                    ce,
                    { style: { "max-height": "80vh" } },
                    {
                      default: a(() => [
                        t(
                          Ie,
                          { lines: "two", density: "compact" },
                          {
                            default: a(() => [
                              (f(!0),
                              x(
                                D,
                                null,
                                J(
                                  b.value,
                                  (u, m) => (
                                    f(),
                                    x(
                                      D,
                                      { key: u },
                                      [
                                        m === 0
                                          ? (f(),
                                            T(
                                              Me,
                                              { key: 0 },
                                              {
                                                default: a(() => [
                                                  S(i(e(s)("SearchEntity.KeepUploadDialog.baseTorrent")), 1),
                                                ]),
                                                _: 1,
                                              },
                                            ))
                                          : K("", !0),
                                        m === 1
                                          ? (f(),
                                            T(
                                              Me,
                                              { key: 1 },
                                              {
                                                default: a(() => [
                                                  S(i(e(s)("SearchEntity.KeepUploadDialog.otherTorrent")), 1),
                                                ]),
                                                _: 1,
                                              },
                                            ))
                                          : K("", !0),
                                        l.value.get(u)
                                          ? (f(),
                                            T(
                                              ve,
                                              { key: 2 },
                                              {
                                                prepend: a(() => [
                                                  t(
                                                    et,
                                                    { size: "18" },
                                                    {
                                                      default: a(() => [
                                                        t(
                                                          me,
                                                          { "site-id": l.value.get(u).data.site, size: 18 },
                                                          null,
                                                          8,
                                                          ["site-id"],
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1024,
                                                  ),
                                                ]),
                                                append: a(() => [
                                                  U("div", Ft, [
                                                    l.value.get(b.value[0])?.verified &&
                                                    !l.value.get(u).loading &&
                                                    !l.value.get(u).verified &&
                                                    m > 0
                                                      ? (f(),
                                                        T(
                                                          _,
                                                          {
                                                            key: 0,
                                                            icon: "",
                                                            variant: "text",
                                                            title: e(s)(
                                                              "SearchEntity.KeepUploadDialog.addToKeepUpload",
                                                            ),
                                                            onClick: X((n) => d(u), ["stop"]),
                                                          },
                                                          {
                                                            default: a(() => [
                                                              t(
                                                                Q,
                                                                { color: "info" },
                                                                {
                                                                  default: a(() => [
                                                                    ...(v[4] || (v[4] = [S("mdi-plus", -1)])),
                                                                  ]),
                                                                  _: 1,
                                                                },
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["title", "onClick"],
                                                        ))
                                                      : K("", !0),
                                                    l.value.get(b.value[0])?.verified &&
                                                    !l.value.get(u).loading &&
                                                    !l.value.get(u).torrent &&
                                                    m > 0
                                                      ? (f(),
                                                        T(
                                                          _,
                                                          {
                                                            key: 1,
                                                            icon: "",
                                                            variant: "text",
                                                            title: e(s)("SearchEntity.KeepUploadDialog.redownload"),
                                                            onClick: X((n) => H(u), ["stop"]),
                                                          },
                                                          {
                                                            default: a(() => [
                                                              t(
                                                                Q,
                                                                { color: "green" },
                                                                {
                                                                  default: a(() => [
                                                                    ...(v[5] || (v[5] = [S("mdi-sync", -1)])),
                                                                  ]),
                                                                  _: 1,
                                                                },
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["title", "onClick"],
                                                        ))
                                                      : K("", !0),
                                                    t(
                                                      _,
                                                      {
                                                        icon: "",
                                                        variant: "text",
                                                        loading: l.value.get(u).loading,
                                                        title: l.value.get(u).status,
                                                      },
                                                      {
                                                        default: a(() => [
                                                          l.value.get(u).verified
                                                            ? (f(),
                                                              T(
                                                                Q,
                                                                { key: 0, color: "success" },
                                                                {
                                                                  default: a(() => [
                                                                    ...(v[6] || (v[6] = [S("mdi-check-all", -1)])),
                                                                  ]),
                                                                  _: 1,
                                                                },
                                                              ))
                                                            : (f(),
                                                              T(
                                                                Q,
                                                                {
                                                                  key: 1,
                                                                  color: "error",
                                                                  title: e(s)(
                                                                    "SearchEntity.KeepUploadDialog.removeFromKeepUpload",
                                                                  ),
                                                                  onClick: X((n) => p(u), ["stop"]),
                                                                },
                                                                {
                                                                  default: a(() => [
                                                                    ...(v[7] || (v[7] = [S(" mdi-close ", -1)])),
                                                                  ]),
                                                                  _: 1,
                                                                },
                                                                8,
                                                                ["title", "onClick"],
                                                              )),
                                                        ]),
                                                        _: 2,
                                                      },
                                                      1032,
                                                      ["loading", "title"],
                                                    ),
                                                  ]),
                                                ]),
                                                default: a(() => [
                                                  t(
                                                    je,
                                                    { class: "list-item" },
                                                    {
                                                      default: a(() => [
                                                        U(
                                                          "a",
                                                          {
                                                            href: l.value.get(u).data.link,
                                                            target: "_blank",
                                                            rel: "noopener noreferrer nofollow",
                                                          },
                                                          i(l.value.get(u).data.title),
                                                          9,
                                                          Ct,
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1024,
                                                  ),
                                                  t(
                                                    Ze,
                                                    null,
                                                    {
                                                      default: a(() => [
                                                        S(
                                                          i(e(s)("SearchEntity.KeepUploadDialog.size")) +
                                                            i(e(Te)(l.value.get(u).data.size ?? 0)) +
                                                            ", " +
                                                            i(e(s)("SearchEntity.KeepUploadDialog.fileCount")) +
                                                            i(Ce(l.value.get(u))) +
                                                            ", " +
                                                            i(e(s)("SearchEntity.KeepUploadDialog.status.label")) +
                                                            i(l.value.get(u).status),
                                                          1,
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
                                          : K("", !0),
                                        m > 0 ? (f(), T(j, { key: 3, inset: "" })) : K("", !0),
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
                  t(j),
                  t(Ke, null, {
                    default: a(() => [
                      c.value > 1
                        ? (f(),
                          x(
                            D,
                            { key: 0 },
                            [
                              t(
                                tt,
                                {
                                  modelValue: $.value,
                                  "onUpdate:modelValue": v[0] || (v[0] = (u) => ($.value = u)),
                                  items: e(y).getSortedEnabledDownloaders,
                                  "item-title": "name",
                                  "item-value": "id",
                                  density: "compact",
                                  "hide-details": "",
                                  label: e(s)("SearchEntity.KeepUploadDialog.setSavePath"),
                                  style: { "max-width": "200px" },
                                },
                                null,
                                8,
                                ["modelValue", "items", "label"],
                              ),
                              t(
                                Ae,
                                {
                                  modelValue: P.value,
                                  "onUpdate:modelValue": v[1] || (v[1] = (u) => (P.value = u)),
                                  density: "compact",
                                  "hide-details": "",
                                  label: e(s)("KeepUploadTask.savePath"),
                                  style: { "max-width": "200px" },
                                },
                                null,
                                8,
                                ["modelValue", "label"],
                              ),
                              t(
                                _,
                                { variant: "text", color: "info", loading: C.value, disabled: !z.value, onClick: Fe },
                                {
                                  default: a(() => [
                                    t(
                                      Q,
                                      { class: "mr-1" },
                                      { default: a(() => [...(v[8] || (v[8] = [S("mdi-content-save", -1)]))]), _: 1 },
                                    ),
                                    S(" " + i(e(s)("SearchEntity.KeepUploadDialog.create")), 1),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["loading", "disabled"],
                              ),
                            ],
                            64,
                          ))
                        : K("", !0),
                      t(O),
                      t(
                        _,
                        { color: "error", variant: "text", onClick: he },
                        { default: a(() => [S(i(e(s)("common.dialog.close")), 1)]), _: 1 },
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
  $t = Pe(Ut, [["__scopeId", "data-v-768039a0"]]),
  Ge = Y({
    __name: "ActionTd",
    props: { torrentItems: {}, density: { default: "default" } },
    setup(h) {
      const o = L(() => (h.density === "compact" ? "small" : "default")),
        { t: s } = le(),
        y = se(),
        r = ne();
      async function l() {
        const I = [];
        for (const w of h.torrentItems) {
          const d = await oe("getTorrentDownloadLink", w);
          (oe("logger", { msg: `torrent ${w} download link: ${d}` }).catch(), I.push({ torrent: w, downloadUrl: d }));
        }
        return I;
      }
      const b = R(!1);
      async function g() {
        b.value = !0;
        const I = await l();
        try {
          (await navigator.clipboard.writeText(
            I.map((w) => w.downloadUrl)
              .join(
                `
`,
              )
              .trim(),
          ),
            r.showSnakebar(s("SearchEntity.ActionTd.copyLinkSuccess"), { color: "success" }));
        } catch {
          r.showSnakebar(s("SearchEntity.ActionTd.copyLinkFailed"), { color: "error" });
        }
        b.value = !1;
      }
      const c = R(!1);
      async function C() {
        ((c.value = !0),
          await Promise.allSettled(
            h.torrentItems.map((I) => oe("downloadTorrent", { torrent: I, downloaderId: "local" })),
          ),
          (c.value = !1));
      }
      const $ = R(!1),
        P = R(!1);
      function z(I = !1) {
        ((P.value = I), ($.value = !0));
      }
      const E = R(!1);
      function G() {
        E.value = !0;
      }
      return (I, w) => (
        f(),
        x(
          D,
          null,
          [
            t(
              Se,
              { density: h.density, class: "table-action", color: "grey", variant: "text" },
              {
                default: a(() => [
                  e(y).defaultDownloader?.id
                    ? (f(),
                      T(
                        _,
                        {
                          key: 0,
                          disabled: h.torrentItems.length == 0,
                          size: o.value,
                          icon: "mdi-download",
                          title: e(s)("SearchEntity.ActionTd.sendToDefault"),
                          onClick: w[0] || (w[0] = () => z(!0)),
                        },
                        null,
                        8,
                        ["disabled", "size", "title"],
                      ))
                    : K("", !0),
                  t(
                    _,
                    {
                      disabled: h.torrentItems.length == 0,
                      size: o.value,
                      icon: "mdi-cloud-download",
                      title: e(s)("SearchEntity.ActionTd.sendToDownloader"),
                      onClick: w[1] || (w[1] = () => z()),
                    },
                    null,
                    8,
                    ["disabled", "size", "title"],
                  ),
                  t(
                    _,
                    {
                      disabled: h.torrentItems.length == 0,
                      loading: b.value,
                      size: o.value,
                      icon: "mdi-content-copy",
                      title: e(s)("SearchEntity.ActionTd.copyLink"),
                      onClick: w[2] || (w[2] = () => g()),
                    },
                    null,
                    8,
                    ["disabled", "loading", "size", "title"],
                  ),
                  t(
                    _,
                    {
                      disabled: h.torrentItems.length == 0,
                      loading: c.value,
                      size: o.value,
                      icon: "mdi-content-save",
                      title: e(s)("SearchEntity.ActionTd.localDownload"),
                      onClick: w[3] || (w[3] = () => C()),
                    },
                    null,
                    8,
                    ["disabled", "loading", "size", "title"],
                  ),
                  t(
                    _,
                    {
                      disabled: h.torrentItems.length < 2,
                      size: o.value,
                      icon: "mdi-merge",
                      title: e(s)("SearchEntity.KeepUploadDialog.keepUpload"),
                      onClick: G,
                    },
                    null,
                    8,
                    ["disabled", "size", "title"],
                  ),
                ]),
                _: 1,
              },
              8,
              ["density"],
            ),
            t(
              ht,
              {
                modelValue: $.value,
                "onUpdate:modelValue": w[4] || (w[4] = (d) => ($.value = d)),
                "torrent-items": h.torrentItems,
                "is-default-send": P.value,
              },
              null,
              8,
              ["modelValue", "torrent-items", "is-default-send"],
            ),
            t(
              $t,
              {
                modelValue: E.value,
                "onUpdate:modelValue": w[5] || (w[5] = (d) => (E.value = d)),
                "torrent-items": h.torrentItems,
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
  zt = Y({
    __name: "TorrentProcessTd",
    props: { torrent: {} },
    setup(h) {
      const o = L(() => {
          switch (h.torrent.status) {
            case q.downloading:
              return "mdi-arrow-down";
            case q.completed:
              return "mdi-check";
            case q.inactive:
              return "mdi-wifi-strength-off";
            case q.seeding:
            default:
              return "mdi-arrow-up";
          }
        }),
        s = L(() => {
          switch (h.torrent.status) {
            case q.downloading:
              return "info";
            case q.completed:
            case q.inactive:
              return "grey";
            case q.seeding:
            default:
              return "success";
          }
        });
      return (y, r) => (
        f(),
        T(
          F,
          { class: "pt-1" },
          {
            default: a(() => [
              t(
                N,
                { class: "pa-0", cols: "2" },
                {
                  default: a(() => [
                    t(Q, { color: s.value, icon: o.value, size: "x-small" }, null, 8, ["color", "icon"]),
                  ]),
                  _: 1,
                },
              ),
              t(
                N,
                { class: "pl-1" },
                {
                  default: a(() => [
                    t(
                      at,
                      {
                        modelValue: h.torrent.progress,
                        "onUpdate:modelValue": r[0] || (r[0] = (l) => (h.torrent.progress = l)),
                        color: s.value,
                        title: `${h.torrent.progress}%`,
                      },
                      null,
                      8,
                      ["modelValue", "color", "title"],
                    ),
                  ]),
                  _: 1,
                },
              ),
            ]),
            _: 1,
          },
        )
      );
    },
  }),
  It = ne(),
  Kt = fe(),
  Xe = se(),
  pe = yt({
    parseOptions: {
      keywords: ["site", "tags", "status"],
      ranges: ["time", "size", "seeders", "leechers", "completed"],
    },
    titleFields: ["title", "subTitle"],
    initialSearchValue: Xe.lastSearchFilter,
    initialItems: L(() => It.search.searchResult),
    format: { tags: { parse: (h) => (h ?? {}).name ?? h }, time: "date", size: "size" },
  });
Re(pe.tableFilterRef, (h) => {
  Kt.searchEntity.saveLastFilter && Xe.setLastSearchFilter(h);
});
const At = { class: "d-flex align-center" },
  Pt = Y({
    __name: "QuickFilterNotice",
    props: { selectedTorrents: {} },
    setup(h) {
      const { t: o } = le(),
        s = fe(),
        y = Oe(),
        { advanceFilterDictRef: r, advanceItemPropsRef: l, updateTableFilterValueFn: b } = pe,
        g = R(""),
        c = L(() => {
          const P = h.selectedTorrents,
            z = P.length;
          if (z === 0) return { count: 0, totalSize: 0 };
          const E = P.reduce((G, I) => G + (I.size || 0), 0);
          return { count: z, totalSize: E };
        });
      function C() {
        ((g.value = ""), (r.value.site.required = []), (r.value.site.exclude = []), b());
      }
      function $() {
        ((r.value.site.required = [g.value]), (r.value.site.exclude = []), b());
      }
      return (P, z) => (
        f(),
        T(
          Je,
          { class: "px-2 py-1 mb-0", color: "info", density: "compact", variant: "tonal" },
          {
            default: a(() => [
              U("div", At, [
                e(s).searchEntity.quickSiteFilter
                  ? (f(),
                    x(
                      D,
                      { key: 0 },
                      [
                        t(
                          ae,
                          {
                            class: Be(["chip_limit_width", { chip_content_hidden_fix: e(y).smAndDown.value }]),
                            size: "small",
                            onClick: X(C, ["stop"]),
                            variant: "outlined",
                            "prepend-icon": "mdi-web",
                          },
                          {
                            default: a(() => [
                              S(i(e(y).smAndDown.value ? "" : e(o)("SearchEntity.siteFilter.all")), 1),
                            ]),
                            _: 1,
                          },
                          8,
                          ["class"],
                        ),
                        t(
                          lt,
                          {
                            id: "site-filter-chips",
                            modelValue: g.value,
                            "onUpdate:modelValue": [z[0] || (z[0] = (E) => (g.value = E)), $],
                            mobile: !1,
                            color: "primary",
                            filter: "",
                            mandatory: "",
                            "scroll-to-active": "",
                            "show-arrows": "always",
                            variant: "outlined",
                          },
                          {
                            default: a(() => [
                              (f(!0),
                              x(
                                D,
                                null,
                                J(
                                  e(l).site,
                                  (E) => (
                                    f(),
                                    T(
                                      ae,
                                      { key: E, value: E, size: "small", class: "mr-1 mb-1" },
                                      {
                                        default: a(() => [
                                          t(me, { "site-id": E, size: 14, class: "mr-1" }, null, 8, ["site-id"]),
                                          t(Ee, { "site-id": E, tag: "span" }, null, 8, ["site-id"]),
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
                          8,
                          ["modelValue"],
                        ),
                      ],
                      64,
                    ))
                  : K("", !0),
                t(O),
                t(j, { vertical: "", inset: "", class: "mx-2" }),
                t(
                  ae,
                  { class: "my-2 chip_limit_width", color: "primary", size: "small", variant: "outlined" },
                  {
                    default: a(() => [
                      t(Q, { icon: "mdi-checkbox-marked-circle", start: "" }),
                      S(
                        " " +
                          i(
                            e(y).smAndDown.value
                              ? c.value.count
                              : e(o)("SearchEntity.index.selectedTorrents", [c.value.count]),
                          ) +
                          " ",
                        1,
                      ),
                      t(j, { class: "mx-2", vertical: "" }),
                      t(Q, { icon: "mdi-harddisk", start: "" }),
                      S(" " + i(e(Te)(c.value.totalSize)), 1),
                    ]),
                    _: 1,
                  },
                ),
              ]),
            ]),
            _: 1,
          },
        )
      );
    },
  }),
  Rt = Pe(Pt, [["__scopeId", "data-v-1682271a"]]),
  V = ne(),
  ke = fe(),
  Bt = se(),
  { advanceFilterDictRef: qt, buildAdvanceItemPropsFn: Nt, updateTableFilterValueFn: Mt, advanceItemPropsRef: Ye } = pe,
  ie = new Set(),
  M = new ot({ concurrency: 1 });
M.on("active", () => {
  ((V.search.isSearching = !0),
    M.concurrency != ke.searchEntity.queueConcurrency &&
      ((M.concurrency = ke.searchEntity.queueConcurrency),
      console.debug("Search queue concurrency changed to: ", M.concurrency)),
    ie.clear(),
    V.search.searchResult.forEach((h) => ie.add(h.uniqueId)));
});
M.on("idle", () => {
  ((V.search.isSearching = !1), (V.search.endAt = Date.now()), ie.clear(), Nt());
});
const Lt = [A.parseError, A.unknownError, A.CFBlocked, A.needLogin],
  te = L(() => {
    const h = { success: 0, error: 0, queued: 0 };
    return (
      Object.values(V.search.searchPlan ?? {}).forEach((o) => {
        switch (o.status) {
          case A.success:
          case A.noResults:
            h.success++;
            break;
          case A.unknownError:
          case A.parseError:
          case A.CFBlocked:
          case A.needLogin:
            h.error++;
            break;
          case A.waiting:
          case A.working:
            h.queued++;
            break;
        }
      }),
      h
    );
  });
async function Gt(h) {
  const o = V.search.searchPlan[h].queuePriority ?? 1;
  M.setPriority(h, o + 1);
}
async function qe(h, o, s, y = !1) {
  const r = `${h}|$|${o}`;
  let l = V.search.searchPlan[r]?.queuePriority ?? 1;
  if (y) {
    const b = V.search.searchResult.filter((g) => g.solutionKey === r);
    ((V.search.searchResult = V.search.searchResult.filter((g) => g.solutionKey != r)),
      b.forEach((g) => ie.delete(g.uniqueId)),
      (l -= 1));
  }
  ((V.search.searchPlan[r] = {
    siteId: h,
    searchEntryName: o,
    searchEntry: s,
    status: A.waiting,
    statusMsg: void 0,
    queuePriority: l,
    count: 0,
  }),
    console.log(`Add search ${r} to queue.`),
    (V.search.searchPlan[r].queueAt = Date.now()),
    M.add(
      async () => {
        const b = (V.search.searchPlan[r].startAt = Date.now());
        (console.log(`search ${r} start at ${b}`), (V.search.searchPlan[r].status = A.working));
        let g = V.search.searchKey ?? "";
        ke.searchEntity.treatTTQueryAsImdbSearch && g.match(/^tt\d{7,8}/) && (g = "imdb|" + g);
        let c;
        g.startsWith("imdb|") && (c = Le.extImdbId(g.replace("imdb|", "")));
        const {
          status: C,
          statusMsg: $,
          data: P,
        } = await oe("getSiteSearchResult", { keyword: g, siteId: h, searchEntry: s });
        (console.log(`success get search ${r} result, with code ${C}: ${$ ?? ""}`, P),
          (V.search.searchPlan[r].status = C),
          $ && (V.search.searchPlan[r].statusMsg = $));
        const z = [];
        for (const I of P) {
          const w = `${I.site}-${I.id}`;
          if (!ie.has(w)) {
            const d = I;
            if (
              ((d.uniqueId = w),
              (d.solutionId = o),
              (d.solutionKey = r),
              (d.status ??= q.unknown),
              c && ke.searchEntity.forceImdbIdMatchFilter && d.ext_imdb && Le.extImdbId(d.ext_imdb) !== c)
            )
              continue;
            (z.push(it(d)), ie.add(w));
          }
        }
        z.length > 0 && V.search.searchResult.push(...z);
        const E = Date.now();
        ((V.search.searchPlan[r].count = z.length),
          (V.search.searchPlan[r].endAt = E),
          (V.search.searchPlan[r].costTime = E - b));
        const G = Ye.value.site;
        Array.isArray(G) && !G.includes(h) && G.push(h);
      },
      { priority: l, id: r },
    ));
}
async function Qe(h, o, s = !0) {
  const y = h ?? V.search.searchKey ?? "",
    r = o ?? V.search.searchPlanKey ?? "default";
  if (s) {
    V.resetSearchData();
    try {
      ((Ye.value.site = []), (qt.value.site = { required: [], exclude: [] }), Mt());
    } catch (b) {
      console.error("Failed to reset table filter site field: ", b);
    }
  }
  (console.log("Start search with: ", y, r, s), (V.search.searchKey = y), (V.search.searchPlanKey = r));
  const l = await Bt.getSearchSolution(V.search.searchPlanKey);
  if (!l) {
    V.showSnakebar(`搜索方案 [${r}] 不存在`, { color: "error" });
    return;
  }
  if (((V.search.searchPlanKey = l.id), console.log(`Expanded Search Plan for ${r}: `, l), l.solutions.length === 0)) {
    V.showSnakebar("请至少添加一个站点进行搜索", { color: "error" });
    return;
  }
  ((V.search.startAt = Date.now()), (V.search.isSearching = !0));
  for (const { siteId: b, searchEntries: g } of l.solutions) for (const [c, C] of Object.entries(g)) await qe(b, c, C);
}
async function Qt(h = Lt) {
  const o = Object.values(V.search.searchPlan).filter((s) => h.includes(s.status));
  if (o.length === 0) {
    V.showSnakebar("没有需要重试的搜索计划", { color: "info" });
    return;
  }
  console.log("Retrying search plans: ", o);
  for (const s of o) await qe(s.siteId, s.searchEntryName, s.searchEntry, !0);
}
const jt = { class: "text-caption" },
  Ot = { class: "d-inline-flex" },
  Ht = { key: 0 },
  Wt = { key: 1 },
  Jt = { key: 2 },
  Xt = { class: "text-subtitle-2 text-grey" },
  Yt = { class: "text-subtitle-2 text-end" },
  Zt = { class: "text-end" },
  ea = { class: "text-end" },
  ta = Y({
    __name: "SearchStatusDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(h) {
      const o = _e(h, "modelValue"),
        { t: s } = le(),
        y = ne(),
        r = se();
      function l(b, g) {
        return r.solutions[b]?.solutions.find((c) => c.id === g);
      }
      return (b, g) => (
        f(),
        T(
          xe,
          {
            modelValue: o.value,
            "onUpdate:modelValue": g[1] || (g[1] = (c) => (o.value = c)),
            "max-width": "800",
            scrollable: "",
          },
          {
            default: a(() => [
              t(de, null, {
                default: a(() => [
                  t(
                    De,
                    { class: "pa-0" },
                    {
                      default: a(() => [
                        t(
                          we,
                          { color: "blue-grey-darken-2" },
                          {
                            append: a(() => [
                              t(
                                _,
                                {
                                  icon: "mdi-close",
                                  title: e(s)("common.dialog.close"),
                                  onClick: g[0] || (g[0] = (c) => (o.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: a(() => [
                              t(Ve, null, {
                                default: a(() => [
                                  S(
                                    i(
                                      e(s)("SearchEntity.SearchStatusDialog.title", [
                                        e(r).getSearchSolutionName(e(y).search.searchPlanKey),
                                      ]),
                                    ) + " ",
                                    1,
                                  ),
                                  g[2] || (g[2] = U("br", null, null, -1)),
                                  U("p", jt, "<" + i(e(y).search.searchPlanKey) + ">", 1),
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
                  t(j),
                  t(ce, null, {
                    default: a(() => [
                      t(Ie, null, {
                        default: a(() => [
                          (f(!0),
                          x(
                            D,
                            null,
                            J(
                              e(y).search.searchPlan,
                              (c, C) => (
                                f(),
                                T(
                                  ve,
                                  null,
                                  {
                                    prepend: a(() => [
                                      t(me, { "site-id": c.siteId, class: "mr-2" }, null, 8, ["site-id"]),
                                    ]),
                                    append: a(() => [
                                      U("span", Yt, [
                                        t(kt, { status: c.status }, null, 8, ["status"]),
                                        c.status === e(A).success
                                          ? (f(),
                                            x(
                                              D,
                                              { key: 0 },
                                              [
                                                g[5] || (g[5] = U("br", null, null, -1)),
                                                U(
                                                  "span",
                                                  Zt,
                                                  i(
                                                    e(s)("SearchEntity.SearchStatusDialog.successMsg", [
                                                      c.count,
                                                      (c.costTime ?? 0) / 1e3,
                                                    ]),
                                                  ),
                                                  1,
                                                ),
                                              ],
                                              64,
                                            ))
                                          : c.statusMsg
                                            ? (f(),
                                              x(
                                                D,
                                                { key: 1 },
                                                [
                                                  g[6] || (g[6] = U("br", null, null, -1)),
                                                  U(
                                                    "span",
                                                    ea,
                                                    i(
                                                      c.statusMsg.startsWith("i18n.")
                                                        ? e(s)(
                                                            "SearchEntity.SearchStatusDialog.statusMsg" +
                                                              c.statusMsg.replace("i18n.", "."),
                                                          )
                                                        : c.statusMsg,
                                                    ),
                                                    1,
                                                  ),
                                                ],
                                                64,
                                              ))
                                            : K("", !0),
                                      ]),
                                      t(j, { class: "mx-2", vertical: "" }),
                                      t(
                                        Se,
                                        { size: "small", variant: "text" },
                                        {
                                          default: a(() => [
                                            c.status === e(A).waiting
                                              ? (f(),
                                                T(
                                                  _,
                                                  {
                                                    key: 0,
                                                    title: e(s)("SearchEntity.SearchStatusDialog.moveUp"),
                                                    color: "warning",
                                                    icon: "mdi-arrow-collapse-up",
                                                    onClick: () => e(Gt)(C),
                                                  },
                                                  null,
                                                  8,
                                                  ["title", "onClick"],
                                                ))
                                              : (f(),
                                                T(
                                                  _,
                                                  {
                                                    key: 1,
                                                    title: e(s)("SearchEntity.SearchStatusDialog.searchAgain"),
                                                    loading: c.status === e(A).working,
                                                    color: "red",
                                                    icon: "mdi-cached",
                                                    onClick: () =>
                                                      e(qe)(c.siteId, c.searchEntryName, c.searchEntry, !0),
                                                  },
                                                  null,
                                                  8,
                                                  ["title", "loading", "onClick"],
                                                )),
                                          ]),
                                          _: 2,
                                        },
                                        1024,
                                      ),
                                    ]),
                                    default: a(() => [
                                      t(
                                        je,
                                        null,
                                        {
                                          default: a(() => [
                                            U("div", Ot, [
                                              t(
                                                Ee,
                                                {
                                                  class: Be(["text-decoration-none", "font-weight-bold", "text-black"]),
                                                  "site-id": c.siteId,
                                                  tag: "span",
                                                },
                                                null,
                                                8,
                                                ["site-id"],
                                              ),
                                              g[3] || (g[3] = S(" -> ", -1)),
                                              c.searchEntry.name
                                                ? (f(), x("span", Ht, i(c.searchEntry.name), 1))
                                                : e(y).search.searchPlanKey === "all" ||
                                                    e(y).search.searchPlanKey.startsWith("site:")
                                                  ? (f(), x("span", Wt, i(c.searchEntry.name ?? c.searchEntryName), 1))
                                                  : (f(),
                                                    x("span", Jt, [
                                                      t(
                                                        bt,
                                                        { solution: l(e(y).search.searchPlanKey, c.searchEntryName) },
                                                        null,
                                                        8,
                                                        ["solution"],
                                                      ),
                                                    ])),
                                            ]),
                                            g[4] || (g[4] = U("br", null, null, -1)),
                                            U("span", Xt, " <" + i(c.searchEntryName) + "> ", 1),
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
                            256,
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
  aa = Y({
    __name: "SaveSnapshotDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(h) {
      const { t: o } = le(),
        s = _e(h, "modelValue"),
        y = se(),
        r = ne(),
        l = L(
          () =>
            "[" +
            y.getSearchSolutionName(r.search.searchPlanKey) +
            "] " +
            r.search.searchKey +
            " (" +
            be(r.search.startAt) +
            ")",
        );
      function b() {
        (y.saveSearchSnapshotData(l.value), (s.value = !1));
      }
      return (g, c) => (
        f(),
        T(
          xe,
          { modelValue: s.value, "onUpdate:modelValue": c[2] || (c[2] = (C) => (s.value = C)), width: "500" },
          {
            default: a(() => [
              t(de, null, {
                default: a(() => [
                  t(
                    De,
                    { class: "pa-0" },
                    {
                      default: a(() => [
                        t(
                          we,
                          { color: "cyan-darken-2" },
                          {
                            append: a(() => [
                              t(
                                _,
                                {
                                  icon: "mdi-close",
                                  title: e(o)("common.dialog.close"),
                                  onClick: c[0] || (c[0] = (C) => (s.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: a(() => [
                              t(Ve, null, {
                                default: a(() => [S(i(e(o)("SearchEntity.index.action.saveSnapshot")), 1)]),
                                _: 1,
                              }),
                            ]),
                            _: 1,
                          },
                        ),
                        t(O),
                      ]),
                      _: 1,
                    },
                  ),
                  t(j),
                  t(ce, null, {
                    default: a(() => [
                      t(
                        Ae,
                        {
                          modelValue: l.value,
                          "onUpdate:modelValue": c[1] || (c[1] = (C) => (l.value = C)),
                          dense: "",
                          "hide-details": "",
                          label: e(o)("SearchEntity.SaveSnapshotDialog.snapshotName"),
                          outlined: "",
                        },
                        null,
                        8,
                        ["modelValue", "label"],
                      ),
                    ]),
                    _: 1,
                  }),
                  t(Ke, null, {
                    default: a(() => [
                      t(O),
                      t(
                        _,
                        { color: "primary", onClick: b },
                        { default: a(() => [S(i(e(o)("common.save")), 1)]), _: 1 },
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
  la = { class: "text-no-wrap" },
  sa = { class: "text-no-wrap" },
  na = Y({
    __name: "AdvanceFilterGenerateDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(h) {
      const o = _e(h, "modelValue"),
        { t: s } = le(),
        y = fe(),
        {
          advanceItemPropsRef: r,
          advanceFilterDictRef: l,
          reBuildFilterCountRef: b,
          toggleKeywordStateFn: g,
          reBuildAdvanceFilter: c,
          updateTableFilterValueFn: C,
        } = pe,
        $ = [
          { value: q.unknown, label: s("torrent.status.unknown"), icon: "mdi-help-circle", color: "grey" },
          { value: q.downloading, label: s("torrent.status.downloading"), icon: "mdi-arrow-down", color: "info" },
          { value: q.seeding, label: s("torrent.status.seeding"), icon: "mdi-arrow-up", color: "success" },
          { value: q.inactive, label: s("torrent.status.inactive"), icon: "mdi-wifi-strength-off", color: "grey" },
          { value: q.completed, label: s("torrent.status.completed"), icon: "mdi-check", color: "grey" },
        ],
        P = L(() => ut(r.value.tags)),
        z = R(!1),
        E = L(() => {
          const w = y.searchEntifyControl.hiddenTagNames || [];
          return P.value.filter((d) => z.value || !w.includes(d.name));
        });
      function G() {
        (C(), (o.value = !1));
      }
      function I() {
        c();
      }
      return (w, d) => (
        f(),
        T(
          xe,
          {
            modelValue: o.value,
            "onUpdate:modelValue": d[13] || (d[13] = (p) => (o.value = p)),
            "max-width": "800",
            scrollable: "",
            onAfterEnter: I,
          },
          {
            default: a(() => [
              t(de, null, {
                default: a(() => [
                  t(
                    De,
                    { class: "pa-0" },
                    {
                      default: a(() => [
                        t(
                          we,
                          { color: "blue-grey-darken-2" },
                          {
                            append: a(() => [
                              t(
                                _,
                                {
                                  icon: "mdi-close",
                                  title: e(s)("common.dialog.close"),
                                  onClick: d[0] || (d[0] = (p) => (o.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: a(() => [
                              t(Ve, null, {
                                default: a(() => [S(i(e(s)("common.AdvanceFilterGenerateDialog.title")), 1)]),
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
                  t(j),
                  t(ce, null, {
                    default: a(() => [
                      t(He, null, {
                        default: a(() => [
                          t(F, null, {
                            default: a(() => [
                              t(W, null, {
                                default: a(() => [S(i(e(s)("common.AdvanceFilterGenerateDialog.keywords")), 1)]),
                                _: 1,
                              }),
                            ]),
                            _: 1,
                          }),
                          t(F, null, {
                            default: a(() => [
                              t(
                                N,
                                { cols: "12", md: "6" },
                                {
                                  default: a(() => [
                                    t(
                                      ze,
                                      {
                                        modelValue: e(l).text.required,
                                        "onUpdate:modelValue": d[1] || (d[1] = (p) => (e(l).text.required = p)),
                                        chips: "",
                                        "hide-details": "",
                                        label: e(s)("common.AdvanceFilterGenerateDialog.required"),
                                        multiple: "",
                                      },
                                      null,
                                      8,
                                      ["modelValue", "label"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                              ),
                              t(
                                N,
                                { cols: "12", md: "6" },
                                {
                                  default: a(() => [
                                    t(
                                      ze,
                                      {
                                        modelValue: e(l).text.exclude,
                                        "onUpdate:modelValue": d[2] || (d[2] = (p) => (e(l).text.exclude = p)),
                                        chips: "",
                                        "hide-details": "",
                                        label: e(s)("common.AdvanceFilterGenerateDialog.exclude"),
                                        multiple: "",
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
                          t(F, null, {
                            default: a(() => [
                              t(W, null, {
                                default: a(() => [S(i(e(s)("common.AdvanceFilterGenerateDialog.site")), 1)]),
                                _: 1,
                              }),
                            ]),
                            _: 1,
                          }),
                          t(F, null, {
                            default: a(() => [
                              (f(!0),
                              x(
                                D,
                                null,
                                J(
                                  e(r).site,
                                  (p) => (
                                    f(),
                                    T(
                                      N,
                                      { key: `${e(b)}_${p}`, class: "pa-0", cols: "6", md: "3", sm: "4" },
                                      {
                                        default: a(() => [
                                          t(
                                            $e,
                                            {
                                              modelValue: e(l).site.required,
                                              "onUpdate:modelValue": (H) => (e(l).site.required = H),
                                              label: p,
                                              value: p,
                                              density: "compact",
                                              "hide-details": "",
                                              indeterminate: "",
                                              onClick: X(() => e(g)("site", p), ["stop"]),
                                            },
                                            {
                                              label: a(() => [
                                                t(me, { "site-id": p, size: 16, class: "mr-2" }, null, 8, ["site-id"]),
                                                t(
                                                  Ee,
                                                  { class: Be(["text-decoration-none"]), "site-id": p, tag: "span" },
                                                  null,
                                                  8,
                                                  ["site-id"],
                                                ),
                                              ]),
                                              _: 2,
                                            },
                                            1032,
                                            ["modelValue", "onUpdate:modelValue", "label", "value", "onClick"],
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
                          e(y).searchEntifyControl.showTorrentTag
                            ? (f(),
                              x(
                                D,
                                { key: 0 },
                                [
                                  t(F, null, {
                                    default: a(() => [
                                      t(W, null, {
                                        default: a(() => [
                                          S(i(e(s)("SearchEntity.AdvanceFilterGenerateDialog.tags")), 1),
                                        ]),
                                        _: 1,
                                      }),
                                      t(O),
                                      e(y).searchEntifyControl.hiddenTagNames?.length
                                        ? (f(),
                                          T(
                                            _,
                                            {
                                              key: 0,
                                              variant: "text",
                                              size: "x-small",
                                              color: "info",
                                              onClick: d[3] || (d[3] = (p) => (z.value = !z.value)),
                                            },
                                            {
                                              default: a(() => [
                                                S(
                                                  i(
                                                    z.value
                                                      ? e(s)("SearchEntity.AdvanceFilterGenerateDialog.hideHiddenTags")
                                                      : e(s)("SearchEntity.AdvanceFilterGenerateDialog.showHiddenTags"),
                                                  ),
                                                  1,
                                                ),
                                              ]),
                                              _: 1,
                                            },
                                          ))
                                        : K("", !0),
                                    ]),
                                    _: 1,
                                  }),
                                  t(F, null, {
                                    default: a(() => [
                                      (f(!0),
                                      x(
                                        D,
                                        null,
                                        J(
                                          E.value,
                                          (p) => (
                                            f(),
                                            T(
                                              N,
                                              { key: `${e(b)}_${p.name}`, class: "pa-0", cols: "4", md: "2", sm: "3" },
                                              {
                                                default: a(() => [
                                                  t(
                                                    $e,
                                                    {
                                                      modelValue: e(l).tags.required,
                                                      "onUpdate:modelValue":
                                                        d[4] || (d[4] = (H) => (e(l).tags.required = H)),
                                                      value: p.name,
                                                      density: "compact",
                                                      "hide-details": "",
                                                      indeterminate: "",
                                                      onClick: X(() => e(g)("tags", p.name), ["stop"]),
                                                    },
                                                    {
                                                      label: a(() => [
                                                        t(
                                                          ae,
                                                          {
                                                            color: p.color,
                                                            "prepend-icon": e(rt).includes(p.name)
                                                              ? "mdi-pin mdi-rotate-45"
                                                              : "",
                                                            class: "mr-1",
                                                            label: "",
                                                            size: "small",
                                                            variant: "tonal",
                                                          },
                                                          { default: a(() => [S(i(p.name), 1)]), _: 2 },
                                                          1032,
                                                          ["color", "prepend-icon"],
                                                        ),
                                                      ]),
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
                                ],
                                64,
                              ))
                            : K("", !0),
                          t(F, null, {
                            default: a(() => [
                              t(W, null, {
                                default: a(() => [S(i(e(s)("SearchEntity.AdvanceFilterGenerateDialog.status")), 1)]),
                                _: 1,
                              }),
                            ]),
                            _: 1,
                          }),
                          t(F, null, {
                            default: a(() => [
                              (f(),
                              x(
                                D,
                                null,
                                J($, (p) =>
                                  t(
                                    N,
                                    { key: `${e(b)}_${p.value}`, class: "pa-0", cols: "6", md: "3", sm: "4" },
                                    {
                                      default: a(() => [
                                        t(
                                          $e,
                                          {
                                            modelValue: e(l).status.required,
                                            "onUpdate:modelValue": (H) => (e(l).status.required = H),
                                            value: p.value,
                                            density: "compact",
                                            "hide-details": "",
                                            indeterminate: "",
                                            onClick: X(() => e(g)("status", p.value), ["stop"]),
                                          },
                                          {
                                            label: a(() => [
                                              t(
                                                Q,
                                                { color: p.color, icon: p.icon, size: "small", class: "mr-2" },
                                                null,
                                                8,
                                                ["color", "icon"],
                                              ),
                                              U("span", null, i(p.label), 1),
                                            ]),
                                            _: 2,
                                          },
                                          1032,
                                          ["modelValue", "onUpdate:modelValue", "value", "onClick"],
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
                          t(F, null, {
                            default: a(() => [
                              t(
                                N,
                                { cols: "6" },
                                {
                                  default: a(() => [
                                    t(
                                      F,
                                      { class: "pr-4" },
                                      {
                                        default: a(() => [
                                          t(W, null, {
                                            default: a(() => [
                                              S(i(e(s)("common.AdvanceFilterGenerateDialog.date")), 1),
                                            ]),
                                            _: 1,
                                          }),
                                          t(O),
                                          (f(),
                                          x(
                                            D,
                                            null,
                                            J(["day", "week", "month", "quarter", "year"], (p) =>
                                              t(
                                                ae,
                                                {
                                                  key: p,
                                                  size: "x-small",
                                                  class: "mr-1",
                                                  onClick: () => (e(l).time = e(vt)(p, e(r).time.range)),
                                                },
                                                {
                                                  default: a(() => [
                                                    S(i(e(s)(`common.AdvanceFilterGenerateDialog.dateUnit.${p}`)), 1),
                                                  ]),
                                                  _: 2,
                                                },
                                                1032,
                                                ["onClick"],
                                              ),
                                            ),
                                            64,
                                          )),
                                          t(
                                            ae,
                                            { size: "x-small" },
                                            {
                                              default: a(() => [
                                                S(
                                                  i(e(s)("common.AdvanceFilterGenerateDialog.dateUnit.custom")) + " ",
                                                  1,
                                                ),
                                                t(
                                                  We,
                                                  {
                                                    activator: "parent",
                                                    location: "top",
                                                    "close-on-content-click": !1,
                                                  },
                                                  {
                                                    default: a(() => [
                                                      t(
                                                        wt,
                                                        {
                                                          max: e(xt)(new Date(e(r).time.range[1]), 1),
                                                          min: e(Vt)(new Date(e(r).time.range[0])),
                                                          "hide-header": "",
                                                          multiple: "range",
                                                          "show-adjacent-months": "",
                                                          "onUpdate:modelValue":
                                                            d[5] || (d[5] = (p) => (e(l).time = e(gt)(p))),
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
                                    t(F, null, {
                                      default: a(() => [
                                        t(
                                          ue,
                                          {
                                            modelValue: e(l).time,
                                            "onUpdate:modelValue": d[6] || (d[6] = (p) => (e(l).time = p)),
                                            max: e(r).time.range[1],
                                            min: e(r).time.range[0],
                                            step: 60 * 1e3,
                                            "thumb-label": !0,
                                            ticks: e(r).time.ticks,
                                            class: "px-6",
                                            "hide-details": "",
                                            "show-ticks": "always",
                                            "tick-size": "4",
                                          },
                                          {
                                            "tick-label": a(() => [...(d[14] || (d[14] = []))]),
                                            "thumb-label": a(({ modelValue: p }) => [
                                              U("span", la, i(e(be)(p ?? 0, "yyyy-MM-dd HH:mm")), 1),
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
                              t(
                                N,
                                { cols: "6" },
                                {
                                  default: a(() => [
                                    t(F, null, {
                                      default: a(() => [
                                        t(W, null, {
                                          default: a(() => [
                                            S(i(e(s)("SearchEntity.AdvanceFilterGenerateDialog.size")), 1),
                                          ]),
                                          _: 1,
                                        }),
                                      ]),
                                      _: 1,
                                    }),
                                    t(F, null, {
                                      default: a(() => [
                                        t(
                                          ue,
                                          {
                                            modelValue: e(l).size,
                                            "onUpdate:modelValue": d[7] || (d[7] = (p) => (e(l).size = p)),
                                            max: e(r).size.range[1],
                                            min: e(r).size.range[0],
                                            step: 1024 ** 3,
                                            "thumb-label": !0,
                                            ticks: e(r).size.ticks,
                                            class: "px-6",
                                            "hide-details": "",
                                            "show-ticks": "always",
                                            "tick-size": "4",
                                          },
                                          {
                                            "tick-label": a(() => [...(d[15] || (d[15] = []))]),
                                            "thumb-label": a(({ modelValue: p }) => [
                                              U("span", sa, i(e(Te)(p ?? 0)), 1),
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
                          t(F, null, {
                            default: a(() => [
                              t(
                                N,
                                { cols: "4" },
                                {
                                  default: a(() => [
                                    t(F, null, {
                                      default: a(() => [
                                        t(W, null, {
                                          default: a(() => [
                                            S(i(e(s)("SearchEntity.AdvanceFilterGenerateDialog.seeders")), 1),
                                          ]),
                                          _: 1,
                                        }),
                                      ]),
                                      _: 1,
                                    }),
                                    t(F, null, {
                                      default: a(() => [
                                        t(
                                          ue,
                                          {
                                            modelValue: e(l).seeders,
                                            "onUpdate:modelValue": d[8] || (d[8] = (p) => (e(l).seeders = p)),
                                            max: e(r).seeders.range[1],
                                            min: e(r).seeders.range[0],
                                            "thumb-label": !0,
                                            ticks: e(r).seeders.ticks,
                                            class: "px-6",
                                            "hide-details": "",
                                            "show-ticks": "always",
                                            step: "1",
                                            "tick-size": "4",
                                          },
                                          { "tick-label": a(() => [...(d[16] || (d[16] = []))]), _: 1 },
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
                              t(
                                N,
                                { cols: "4" },
                                {
                                  default: a(() => [
                                    t(F, null, {
                                      default: a(() => [
                                        t(W, null, {
                                          default: a(() => [
                                            S(i(e(s)("SearchEntity.AdvanceFilterGenerateDialog.leechers")), 1),
                                          ]),
                                          _: 1,
                                        }),
                                      ]),
                                      _: 1,
                                    }),
                                    t(F, null, {
                                      default: a(() => [
                                        t(
                                          ue,
                                          {
                                            modelValue: e(l).leechers,
                                            "onUpdate:modelValue": d[9] || (d[9] = (p) => (e(l).leechers = p)),
                                            max: e(r).leechers.range[1],
                                            min: e(r).leechers.range[0],
                                            "thumb-label": !0,
                                            ticks: e(r).leechers.ticks,
                                            class: "px-6",
                                            "hide-details": "",
                                            "show-ticks": "always",
                                            step: "1",
                                            "tick-size": "4",
                                          },
                                          { "tick-label": a(() => [...(d[17] || (d[17] = []))]), _: 1 },
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
                              t(
                                N,
                                { cols: "4" },
                                {
                                  default: a(() => [
                                    t(F, null, {
                                      default: a(() => [
                                        t(W, null, {
                                          default: a(() => [
                                            S(i(e(s)("SearchEntity.AdvanceFilterGenerateDialog.completed")), 1),
                                          ]),
                                          _: 1,
                                        }),
                                      ]),
                                      _: 1,
                                    }),
                                    t(F, null, {
                                      default: a(() => [
                                        t(
                                          ue,
                                          {
                                            modelValue: e(l).completed,
                                            "onUpdate:modelValue": d[10] || (d[10] = (p) => (e(l).completed = p)),
                                            max: e(r).completed.range[1],
                                            min: e(r).completed.range[0],
                                            "thumb-label": !0,
                                            ticks: e(r).completed.ticks,
                                            class: "px-6",
                                            "hide-details": "",
                                            "show-ticks": "always",
                                            step: "1",
                                            "tick-size": "4",
                                          },
                                          { "tick-label": a(() => [...(d[18] || (d[18] = []))]), _: 1 },
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
                  }),
                  t(j),
                  t(Ke, null, {
                    default: a(() => [
                      t(
                        _,
                        { variant: "text", onClick: d[11] || (d[11] = () => e(c)(!0)) },
                        { default: a(() => [S(i(e(s)("common.AdvanceFilterGenerateDialog.reset")), 1)]), _: 1 },
                      ),
                      t(O),
                      t(
                        _,
                        { color: "error", variant: "text", onClick: d[12] || (d[12] = (p) => (o.value = !1)) },
                        { default: a(() => [S(i(e(s)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      t(
                        _,
                        { color: "primary", variant: "text", onClick: G },
                        { default: a(() => [S(i(e(s)("common.AdvanceFilterGenerateDialog.generate")), 1)]), _: 1 },
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
  oa = { key: 1, class: "grey--text caption" },
  ia = { class: "d-flex flex-column align-center" },
  ra = { class: "t_size text-no-wrap" },
  ua = { class: "t_seeders text-no-wrap" },
  da = { class: "t_leechers text-no-wrap" },
  ca = { class: "t_completed text-no-wrap" },
  ma = { class: "t_comments text-no-wrap" },
  fa = ["title"],
  pa = Y({
    __name: "Index",
    setup(h) {
      const { t: o } = le(),
        s = st(),
        y = fe(),
        r = se(),
        l = ne(),
        b = Oe(),
        g = R(!1),
        c = R(!1),
        C = R(!1),
        $ = L(() => [
          { title: o("common.site"), key: "site", align: "center", props: { disabled: !0 } },
          {
            title: o("SearchEntity.index.table.title"),
            key: "title",
            align: "start",
            minWidth: "30rem",
            ...(y.searchEntifyControl.limitTorrentTitleTdWidth || b.smAndDown.value ? { maxWidth: "32vw" } : {}),
            props: { disabled: !0 },
          },
          { title: o("SearchEntity.index.table.category"), key: "category", align: "center" },
          { title: o("SearchEntity.index.table.size"), key: "size", align: "end" },
          { title: o("SearchEntity.index.table.seeders"), key: "seeders", align: "end" },
          { title: o("SearchEntity.index.table.leechers"), key: "leechers", align: "end" },
          { title: o("SearchEntity.index.table.completed"), key: "completed", align: "end" },
          { title: o("SearchEntity.index.table.comments"), key: "comments", align: "end" },
          { title: o("SearchEntity.index.table.time"), key: "time", align: "center" },
          { title: o("common.action"), key: "action", align: "center", sortable: !1, props: { disabled: !0 } },
        ]),
        P = L(() => $.value.filter((u) => u?.props?.disabled || y.tableBehavior.SearchEntity.columns.includes(u.key))),
        {
          tableFilterRef: z,
          tableWaitFilterRef: E,
          tableFilterFn: G,
          buildAdvanceItemPropsFn: I,
          buildFilterDictFn: w,
        } = pe,
        d = dt([]);
      Re(
        () => s.query,
        (u, m) => {
          u.snapshot
            ? r.getSearchSnapshotData(u.snapshot).then((n) => {
                (n && (l.search = { ...n, snapshot: u.snapshot }), y.searchEntity.quickSiteFilter && I());
              })
            : (u.flush || (u.search && u.search != m?.search) || (u.plan && u.plan != m?.plan)) &&
              ((d.value = []), Qe(u.search ?? "", u.plan ?? "default", !0));
        },
        { immediate: !0, deep: !0 },
      );
      const p = R(M.isPaused);
      function H() {
        (console.log("pauseSearchQueue", M), M.pause(), (p.value = !0));
      }
      function he() {
        (console.log("startSearchQueue", M), M.start(), (p.value = !1));
      }
      function Ce() {
        (console.log("cancelSearchQueue", M), M.clear());
        for (const u of Object.keys(l.search.searchPlan))
          l.search.searchPlan[u].status === A.waiting &&
            ((l.search.searchPlan[u].status = A.passParse), (l.search.searchPlan[u].statusMsg = "i18n.userCancel"));
        l.search.isSearching = !1;
      }
      const Fe = ["maxTagCountBeforeGroup", "hiddenTagNames"],
        k = L(() => Object.keys(y.searchEntifyControl).filter((u) => Fe.indexOf(u) === -1)),
        v = L({
          get: () =>
            y.searchEntifyControl.hiddenTagNames.join(`
`),
          set: (u) => {
            y.searchEntifyControl.hiddenTagNames = u
              .split(
                `
`,
              )
              .map((m) => m.trim())
              .filter(Boolean);
          },
        });
      return (u, m) => (
        f(),
        x(
          D,
          null,
          [
            t(
              Je,
              { type: "info" },
              {
                default: a(() => [
                  t(St, null, {
                    default: a(() => [
                      e(l).search.startAt === 0
                        ? (f(), x(D, { key: 0 }, [S(i(e(o)("SearchEntity.index.alert.enterKeyword")), 1)], 64))
                        : (f(),
                          x(
                            D,
                            { key: 1 },
                            [
                              e(l).search.isSearching
                                ? (f(),
                                  x(
                                    D,
                                    { key: 0 },
                                    [
                                      p.value
                                        ? (f(),
                                          x(D, { key: 0 }, [S(i(e(o)("SearchEntity.index.alert.paused")), 1)], 64))
                                        : (f(),
                                          x(
                                            D,
                                            { key: 1 },
                                            [
                                              e(l).search.searchResult.length > 0
                                                ? (f(),
                                                  x(
                                                    D,
                                                    { key: 0 },
                                                    [
                                                      S(
                                                        i(e(o)("SearchEntity.index.alert.plan")) +
                                                          " [" +
                                                          i(e(r).getSearchSolutionName(e(l).search.searchPlanKey)) +
                                                          "]， " +
                                                          i(e(o)("SearchEntity.index.alert.keyword")) +
                                                          " [" +
                                                          i(e(l).search.searchKey) +
                                                          "]， " +
                                                          i(
                                                            e(o)("SearchEntity.index.alert.searchProgress", [
                                                              e(l).search.searchResult.length,
                                                            ]),
                                                          ),
                                                        1,
                                                      ),
                                                    ],
                                                    64,
                                                  ))
                                                : (f(),
                                                  x(
                                                    D,
                                                    { key: 1 },
                                                    [S(i(e(o)("SearchEntity.index.alert.searching")), 1)],
                                                    64,
                                                  )),
                                            ],
                                            64,
                                          )),
                                    ],
                                    64,
                                  ))
                                : (f(),
                                  x(
                                    D,
                                    { key: 1 },
                                    [
                                      e(l).search.snapshot
                                        ? (f(),
                                          x(
                                            D,
                                            { key: 0 },
                                            [
                                              S(
                                                i(e(o)("SearchEntity.index.alert.snapshot")) +
                                                  " [" +
                                                  i(e(r).snapshots[e(l).search.snapshot].name) +
                                                  "]， ",
                                                1,
                                              ),
                                            ],
                                            64,
                                          ))
                                        : (f(),
                                          x(
                                            D,
                                            { key: 1 },
                                            [
                                              S(
                                                i(e(o)("SearchEntity.index.alert.plan")) +
                                                  " [" +
                                                  i(e(r).getSearchSolutionName(e(l).search.searchPlanKey)) +
                                                  "]， ",
                                                1,
                                              ),
                                            ],
                                            64,
                                          )),
                                      S(
                                        " " +
                                          i(e(o)("SearchEntity.index.alert.keyword")) +
                                          " [" +
                                          i(e(l).search.searchKey) +
                                          "]， " +
                                          i(
                                            e(o)("SearchEntity.index.alert.results", [e(l).search.searchResult.length]),
                                          ) +
                                          " " +
                                          i(
                                            e(o)("SearchEntity.index.alert.duration", [
                                              (e(l).searchCostTime / 1e3).toFixed(1),
                                            ]),
                                          ),
                                        1,
                                      ),
                                    ],
                                    64,
                                  )),
                              t(O),
                              t(
                                _,
                                {
                                  title: e(o)("SearchEntity.index.alert.searchStatus"),
                                  class: "mr-2 status-btn",
                                  color: "primary",
                                  size: "small",
                                  onClick: m[0] || (m[0] = (n) => (c.value = !0)),
                                },
                                {
                                  default: a(() => [
                                    e(te).success > 0
                                      ? (f(),
                                        x(
                                          D,
                                          { key: 0 },
                                          [
                                            t(Q, { class: "mr-1", icon: "mdi-check", size: "x-small" }),
                                            S(i(e(te).success), 1),
                                          ],
                                          64,
                                        ))
                                      : K("", !0),
                                    e(te).error > 0
                                      ? (f(),
                                        x(
                                          D,
                                          { key: 1 },
                                          [
                                            t(Q, { class: "mr-1", color: "amber", icon: "mdi-alert", size: "x-small" }),
                                            S(i(e(te).error), 1),
                                          ],
                                          64,
                                        ))
                                      : K("", !0),
                                    e(te).queued > 0
                                      ? (f(),
                                        x(
                                          D,
                                          { key: 2 },
                                          [
                                            t(Q, {
                                              class: "mr-1",
                                              color: "blue-grey",
                                              icon: "mdi-clock",
                                              size: "x-small",
                                            }),
                                            S(i(e(te).queued), 1),
                                          ],
                                          64,
                                        ))
                                      : K("", !0),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["title"],
                              ),
                            ],
                            64,
                          )),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 1,
              },
            ),
            t(de, null, {
              default: a(() => [
                t(De, null, {
                  default: a(() => [
                    t(
                      F,
                      { class: "ma-0" },
                      {
                        default: a(() => [
                          t(
                            Se,
                            { size: "small", variant: "text" },
                            {
                              default: a(() => [
                                ge(
                                  t(
                                    _,
                                    {
                                      title: e(o)("SearchEntity.index.action.start"),
                                      color: "success",
                                      icon: "mdi-play",
                                      onClick: m[1] || (m[1] = () => he()),
                                    },
                                    null,
                                    8,
                                    ["title"],
                                  ),
                                  [[ye, p.value]],
                                ),
                                ge(
                                  t(
                                    _,
                                    {
                                      title: e(o)("SearchEntity.index.action.pause"),
                                      color: "success",
                                      icon: "mdi-pause",
                                      onClick: m[2] || (m[2] = () => H()),
                                    },
                                    null,
                                    8,
                                    ["title"],
                                  ),
                                  [[ye, !p.value]],
                                ),
                                ge(
                                  t(
                                    _,
                                    {
                                      title: e(o)("SearchEntity.index.action.cancel"),
                                      color: "red",
                                      icon: "mdi-cancel",
                                      onClick: Ce,
                                    },
                                    null,
                                    8,
                                    ["title"],
                                  ),
                                  [[ye, e(l).search.isSearching]],
                                ),
                                ge(
                                  t(
                                    _,
                                    {
                                      disabled: p.value,
                                      title: e(o)("SearchEntity.index.action.retry"),
                                      color: "red",
                                      icon: "mdi-sync",
                                      onClick: m[3] || (m[3] = () => e(Qe)(null, null, !0)),
                                    },
                                    null,
                                    8,
                                    ["disabled", "title"],
                                  ),
                                  [[ye, !e(l).search.isSearching]],
                                ),
                                t(
                                  _,
                                  {
                                    disabled: e(te).error === 0,
                                    title: e(o)("SearchEntity.index.action.retryFailed"),
                                    color: "amber",
                                    icon: "mdi-sync-alert",
                                    onClick: m[4] || (m[4] = () => e(Qt)()),
                                  },
                                  null,
                                  8,
                                  ["disabled", "title"],
                                ),
                                t(j, { vertical: "", class: "mx-2" }),
                                t(
                                  _,
                                  {
                                    disabled: e(l).search.isSearching || e(l).search.searchResult.length === 0,
                                    title: e(o)("SearchEntity.index.action.saveSnapshot"),
                                    color: "cyan",
                                    icon: "mdi-camera-plus",
                                    onClick: m[5] || (m[5] = (n) => (C.value = !0)),
                                  },
                                  null,
                                  8,
                                  ["disabled", "title"],
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                          t(j, { vertical: "", class: "mx-2" }),
                          t(Ge, { "torrent-items": d.value }, null, 8, ["torrent-items"]),
                          t(j, { vertical: "", class: "mx-2" }),
                          t(
                            We,
                            { "close-on-content-click": !1 },
                            {
                              activator: a(({ props: n }) => [
                                t(
                                  Se,
                                  { size: "small", variant: "text" },
                                  {
                                    default: a(() => [
                                      t(
                                        _,
                                        ct(
                                          {
                                            title: e(o)("SearchEntity.index.action.displayPreferences"),
                                            color: "blue",
                                            icon: "mdi-cog",
                                          },
                                          n,
                                        ),
                                        null,
                                        16,
                                        ["title"],
                                      ),
                                    ]),
                                    _: 2,
                                  },
                                  1024,
                                ),
                              ]),
                              default: a(() => [
                                t(Ie, null, {
                                  default: a(() => [
                                    (f(!0),
                                    x(
                                      D,
                                      null,
                                      J(
                                        k.value,
                                        (n) => (
                                          f(),
                                          T(
                                            ve,
                                            { key: n, value: n },
                                            {
                                              prepend: a(() => [
                                                t(
                                                  Et,
                                                  { start: "", class: "ml-2" },
                                                  {
                                                    default: a(() => [
                                                      t(
                                                        Dt,
                                                        {
                                                          modelValue: e(y).searchEntifyControl[n],
                                                          "onUpdate:modelValue": [
                                                            (B) => (e(y).searchEntifyControl[n] = B),
                                                            m[7] || (m[7] = () => e(y).$save()),
                                                          ],
                                                          label: ` ${e(o)("SearchEntity.index." + n)}`,
                                                          color: "success",
                                                          density: "compact",
                                                          "hide-details": "",
                                                          onClick: m[6] || (m[6] = X(() => {}, ["stop"])),
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
                                    e(y).searchEntifyControl.showTorrentTag
                                      ? (f(),
                                        T(
                                          ve,
                                          { key: 0, class: "mt-2" },
                                          {
                                            default: a(() => [
                                              t(
                                                _t,
                                                {
                                                  modelValue: v.value,
                                                  "onUpdate:modelValue": m[8] || (m[8] = (n) => (v.value = n)),
                                                  label: e(o)("SetBase.searchEntity.hiddenTagNames"),
                                                  "hide-details": "",
                                                  clearable: "",
                                                  rows: "5",
                                                },
                                                null,
                                                8,
                                                ["modelValue", "label"],
                                              ),
                                            ]),
                                            _: 1,
                                          },
                                        ))
                                      : K("", !0),
                                  ]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            },
                          ),
                          t(
                            ze,
                            {
                              modelValue: e(y).tableBehavior.SearchEntity.columns,
                              "onUpdate:modelValue": [
                                m[9] || (m[9] = (n) => (e(y).tableBehavior.SearchEntity.columns = n)),
                                m[10] || (m[10] = (n) => e(y).updateTableBehavior("SearchEntity", "columns", n)),
                              ],
                              items: $.value,
                              "return-object": !1,
                              chips: "",
                              class: "table-header-filter-clear ml-1",
                              density: "compact",
                              "hide-details": "",
                              "item-value": "key",
                              "max-width": "180",
                              multiple: "",
                              "prepend-inner-icon": "mdi-filter-cog",
                            },
                            {
                              chip: a(({ item: n, index: B }) => [
                                B === 0
                                  ? (f(),
                                    T(
                                      ae,
                                      { key: 0 },
                                      { default: a(() => [U("span", null, i(n.title), 1)]), _: 2 },
                                      1024,
                                    ))
                                  : K("", !0),
                                B === 1
                                  ? (f(),
                                    x(
                                      "span",
                                      oa,
                                      " (+" + i(e(y).tableBehavior.SearchEntity.columns.length - 1) + ") ",
                                      1,
                                    ))
                                  : K("", !0),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue", "items"],
                          ),
                          t(O),
                          t(
                            Ae,
                            {
                              modelValue: e(E),
                              "onUpdate:modelValue": [
                                m[11] || (m[11] = (n) => (mt(E) ? (E.value = n) : null)),
                                m[13] || (m[13] = (n) => e(w)(n)),
                              ],
                              "append-icon": "mdi-magnify",
                              clearable: "",
                              density: "compact",
                              "hide-details": "",
                              label: e(o)("SearchEntity.index.filterLabel"),
                              "max-width": "500",
                              "prepend-inner-icon": "mdi-filter",
                              "single-line": "",
                              "onClick:prependInner": m[12] || (m[12] = (n) => (g.value = !0)),
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
                t(
                  ce,
                  { class: "pt-2 pb-0" },
                  {
                    default: a(() => [
                      t(Rt, { "selected-torrents": d.value }, null, 8, ["selected-torrents"]),
                      t(
                        Tt,
                        {
                          id: "ptd-search-entity-table",
                          modelValue: d.value,
                          "onUpdate:modelValue": m[14] || (m[14] = (n) => (d.value = n)),
                          "custom-filter": e(G),
                          "filter-keys": ["uniqueId"],
                          headers: P.value,
                          items: e(l).search.searchResult,
                          "items-per-page": e(y).tableBehavior.SearchEntity.itemsPerPage,
                          search: e(z),
                          "sort-by": e(y).tableBehavior.SearchEntity.sortBy,
                          class: "search-entity-table table-stripe table-header-no-wrap",
                          hover: "",
                          "item-value": "uniqueId",
                          "multi-sort": e(y).enableTableMultiSort,
                          "show-select": "",
                          "return-object": "",
                          "onUpdate:itemsPerPage":
                            m[15] || (m[15] = (n) => e(y).updateTableBehavior("SearchEntity", "itemsPerPage", n)),
                          "onUpdate:sortBy":
                            m[16] || (m[16] = (n) => e(y).updateTableBehavior("SearchEntity", "sortBy", n)),
                        },
                        {
                          "item.site": a(({ item: n }) => [
                            U("div", ia, [
                              t(
                                me,
                                { "site-id": n.site, size: e(y).searchEntifyControl.showSiteName ? 18 : 24 },
                                null,
                                8,
                                ["site-id", "size"],
                              ),
                              e(y).searchEntifyControl.showSiteName
                                ? (f(), T(Ee, { key: 0, "site-id": n.site }, null, 8, ["site-id"]))
                                : K("", !0),
                            ]),
                          ]),
                          "item.title": a(({ item: n }) => [t(pt, { item: n }, null, 8, ["item"])]),
                          "item.size": a(({ item: n }) => [
                            t(
                              He,
                              { "no-gutters": "" },
                              {
                                default: a(() => [
                                  t(
                                    F,
                                    null,
                                    {
                                      default: a(() => [
                                        t(
                                          N,
                                          { class: "pa-0" },
                                          { default: a(() => [U("span", ra, i(e(Te)(n.size ?? 0)), 1)]), _: 2 },
                                          1024,
                                        ),
                                      ]),
                                      _: 2,
                                    },
                                    1024,
                                  ),
                                  n.status && n.status !== e(q).unknown
                                    ? (f(),
                                      T(
                                        F,
                                        { key: 0 },
                                        {
                                          default: a(() => [
                                            t(
                                              N,
                                              { class: "pa-0" },
                                              { default: a(() => [t(zt, { torrent: n }, null, 8, ["torrent"])]), _: 2 },
                                              1024,
                                            ),
                                          ]),
                                          _: 2,
                                        },
                                        1024,
                                      ))
                                    : K("", !0),
                                ]),
                                _: 2,
                              },
                              1024,
                            ),
                          ]),
                          "item.seeders": a(({ item: n }) => [U("span", ua, i(n.seeders), 1)]),
                          "item.leechers": a(({ item: n }) => [U("span", da, i(n.leechers), 1)]),
                          "item.completed": a(({ item: n }) => [U("span", ca, i(n.completed), 1)]),
                          "item.comments": a(({ item: n }) => [U("span", ma, i(n.comments), 1)]),
                          "item.time": a(({ item: n }) => [
                            U(
                              "span",
                              { class: "t_time text-no-wrap", title: n.time ? e(be)(n.time) : "-" },
                              i(
                                n.time
                                  ? e(y).searchEntifyControl.uploadAtFormatAsAlive
                                    ? e(ft)(n.time)
                                    : e(be)(n.time)
                                  : "-",
                              ),
                              9,
                              fa,
                            ),
                          ]),
                          "item.action": a(({ item: n }) => [
                            t(Ge, { "torrent-items": [n], density: "compact" }, null, 8, ["torrent-items"]),
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
                          "search",
                          "sort-by",
                          "multi-sort",
                        ],
                      ),
                    ]),
                    _: 1,
                  },
                ),
              ]),
              _: 1,
            }),
            t(na, { modelValue: g.value, "onUpdate:modelValue": m[17] || (m[17] = (n) => (g.value = n)) }, null, 8, [
              "modelValue",
            ]),
            t(ta, { modelValue: c.value, "onUpdate:modelValue": m[18] || (m[18] = (n) => (c.value = n)) }, null, 8, [
              "modelValue",
            ]),
            t(aa, { modelValue: C.value, "onUpdate:modelValue": m[19] || (m[19] = (n) => (C.value = n)) }, null, 8, [
              "modelValue",
            ]),
          ],
          64,
        )
      );
    },
  }),
  tl = Pe(pa, [["__scopeId", "data-v-c8b4c803"]]);
export { tl as default };
