import {
  c2 as W,
  bV as Z,
  bN as oe,
  bz as ne,
  s as se,
  j as re,
  a4 as de,
  a5 as ie,
  c as $,
  i as ue,
  p as Y,
  B as q,
  T as I,
  C as M,
  l as ce,
  n as k,
  o as Q,
  t as me,
  g as fe,
  a2 as ve,
  x as pe,
  f as ge,
  cf as z,
  H as De,
} from "./src/entries/options/index-DmNe5UVo.js";
import { t as we } from "../vendor/es-toolkit/toMerged-Be-qf92q.js";
import { j as be, i as Ve } from "../vendor/packages/downloader/index-BATa0ddy.js";
import { b as R } from "./utils-DF6YUpNn.js";
import {
  bC as Se,
  X as ye,
  cb as he,
  ch as Te,
  I as D,
  ck as l,
  a$ as J,
  br as _,
  bJ as ke,
  U as t,
  Q as O,
  bS as y,
  c4 as u,
  L as C,
  bu as B,
  F as A,
  b0 as Ce,
  H as X,
  D as P,
  bj as m,
} from "../vendor/packages/site/index-COeZNva1.js";
import { V as G } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as Ae } from "../vendor/vuetify/VForm-CJoKT4R8.js";
import { V as Pe } from "../vendor/vuetify/VAutocomplete-DUqyo09O.js";
import { V as j } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { c as xe, V as $e, a as Ie } from "../vendor/vuetify/VExpansionPanels-Bs-8zb91.js";
function Me(w, E, g) {
  const p = W(),
    d = Z();
  for (const i of ["savePath", "label"])
    if (g[i].includes("<...>")) {
      const v = prompt(`请输入替换 ${i} 中的 <...> 的内容：`);
      if (v !== null) g[i] = g[i].replace("<...>", v.trim());
      else return Promise.reject(`因取消输入 ${i} 中的 <...> 的内容而停止推送`);
    }
  const b = new Date(),
    h = { "date:YYYY": R(b, "yyyy"), "date:MM": R(b, "MM"), "date:DD": R(b, "dd") };
  return (
    p.search.searchKey !== "" && (h["search:keyword"] = p.search.searchKey),
    p.search.searchPlanKey !== "" && (h["search:plan"] = d.getSearchSolutionName(p.search.searchPlanKey)),
    new Promise(async (i) => {
      const v = [];
      for (const r of w) {
        const s = { ...g },
          f = {
            "torrent.title": r.title ?? "",
            "torrent.subTitle": r.subTitle ?? "",
            "torrent.category": r.category ?? "",
            ...h,
          };
        r.site && ((f["torrent.site"] = r.site), (f["torrent.siteName"] = await d.getSiteName(r.site)));
        for (const a of ["savePath", "label"])
          if (s[a])
            if (s[a] === "") delete s[a];
            else for (const [V, F] of Object.entries(f)) s[a] = s[a].replace(`$${V}$`, F);
        v.push(
          Se("downloadTorrent", { torrent: r, downloaderId: E, addTorrentOptions: s }).catch((a) => {
            p.showSnakebar(`[${r.title}] 发送到下载器失败！错误信息： ${a}`, { color: "error" });
          }),
        );
      }
      Promise.all(v)
        .then((r) => {
          if (r.length > 0) {
            const s = r.filter((V) => V?.downloadStatus === "pending").length,
              f = r.filter((V) => V?.downloadStatus === "failed").length,
              a = f > 0 ? "warning" : "success";
            p.showSnakebar(
              `成功发送 ${r.length - f} 个任务到下载器` +
                (s > 0 ? `（${s}在下载队列中）` : "") +
                (f > 0 ? `，有 ${f} 个任务发送失败` : ""),
              { color: a },
            );
          } else p.showSnakebar("似乎并没有任务发送到下载器", { color: "warning" });
        })
        .catch((r) => {
          p.showSnakebar("有任务发送到下载器失败，请在下载历史页面重试", { color: "error" });
        })
        .finally(() => {
          i();
        });
    })
  );
}
const _e = { class: "ml-1" },
  Oe = { class: "ml-1" },
  Ye = ye({
    __name: "Index",
    props: J(
      { torrentItems: {}, isDefaultSend: { type: Boolean } },
      { modelValue: { type: Boolean }, modelModifiers: {} },
    ),
    emits: J(["cancel", "done"], ["update:modelValue"]),
    setup(w, { emit: E }) {
      const g = he(w, "modelValue"),
        p = E,
        { t: d } = oe(),
        b = ne(),
        h = W(),
        i = Z(),
        v = _(!1),
        r = _(!1),
        s = _(null),
        f = ke(),
        a = _({
          localDownload: !0,
          addAtPaused: !1,
          savePath: "",
          label: "",
          uploadSpeedLimit: 0,
          advanceAddTorrentOptions: {},
        }),
        V = P(() => s.value?.suggestFolders ?? []),
        F = P(() => s.value?.suggestTags ?? []),
        K = P(() => [...new Set(w.torrentItems.map((o) => o.site).filter(Boolean))]),
        ee = P(() => {
          const o = K.value;
          if (o.length === 0) return i.getEnabledDownloaders;
          const e = o
            .map((c) => new Set(i.getEnabledDownloadersBySite(c).map((S) => S.id)))
            .reduce((c, S) => new Set([...c].filter((te) => S.has(te))));
          return i.getEnabledDownloaders.filter((c) => e.has(c.id));
        }),
        T = P(() => [...ee.value].sort((o, n) => (n.sortIndex ?? 0) - (o.sortIndex ?? 0))),
        L = (o) => `${o.name} [${o.address}]`,
        U = (o) => chrome.runtime.getURL(Ve(o));
      function x(o) {
        ((a.value.localDownload = !0),
          (a.value.addAtPaused = !(o?.feature?.DefaultAutoStart ?? !0)),
          (a.value.savePath = ""),
          (a.value.label = ""),
          (a.value.advanceAddTorrentOptions = o?.advanceAddTorrentOptions ?? {}));
      }
      Te(s, (o) => {
        o?.type ? be(o.type).then((n) => (f.value = n)) : (f.value = null);
      });
      async function N() {
        if (!s.value?.id) {
          h.showSnakebar(d("SentToDownloaderDialog.selectDownloaderFirst"), { color: "error" });
          return;
        }
        (!w.isDefaultSend && b.download.saveLastDownloader && i.setLastDownloader({ id: s.value.id, options: a.value }),
          (v.value = !0),
          Me(w.torrentItems, s.value.id, a.value).finally(() => {
            ((v.value = !1), (g.value = !1), p("done"));
          }));
      }
      function H(o, n = "", e) {
        return (
          (s.value = o),
          (a.value.localDownload = !0),
          (a.value.addAtPaused = !(o.feature?.DefaultAutoStart ?? !0)),
          (a.value.advanceAddTorrentOptions = o.advanceAddTorrentOptions ?? {}),
          n && (a.value.savePath = n),
          e && (a.value.label = e),
          N()
        );
      }
      function ae() {
        if (w.isDefaultSend) {
          const o = i.downloaders[i.defaultDownloader.id];
          (x(o),
            (r.value = !0),
            (s.value = o),
            (a.value.savePath = i.defaultDownloader.folder ?? ""),
            (a.value.label = i.defaultDownloader.tags ?? ""),
            N());
        } else if ((x(), (r.value = b.download.useQuickSendToClient), !r.value)) {
          const o = i.lastDownloader?.id;
          ((s.value = o ? i.downloaders[o] : T.value.length === 1 ? T.value[0] : null),
            (a.value = we(a.value, i.lastDownloader?.options ?? {})));
        }
      }
      function le() {
        (x(), p("cancel"));
      }
      return (o, n) => (
        m(),
        D(
          se,
          {
            modelValue: g.value,
            "onUpdate:modelValue": n[8] || (n[8] = (e) => (g.value = e)),
            persistent: v.value,
            "max-width": "800",
            scrollable: "",
            onAfterEnter: ae,
            onAfterLeave: le,
          },
          {
            default: l(() => [
              t(ge, null, {
                default: l(() => [
                  t(
                    re,
                    { class: "pa-0" },
                    {
                      default: l(() => [
                        t(
                          de,
                          { color: "blue-grey-darken-2" },
                          {
                            append: l(() => [
                              t(
                                $,
                                {
                                  icon: "mdi-close",
                                  title: u(d)("common.dialog.close"),
                                  onClick: n[0] || (n[0] = (e) => (g.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: l(() => [
                              t(ie, null, {
                                default: l(() => [
                                  O(y(u(d)("SentToDownloaderDialog.title", [w.torrentItems.length])), 1),
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
                  t(ue, null, {
                    default: l(() => [
                      v.value
                        ? (m(),
                          D(
                            G,
                            { key: 0, type: "info", variant: "tonal" },
                            {
                              default: l(() => [
                                O(
                                  y(
                                    u(d)("SentToDownloaderDialog.isSending", {
                                      name: s.value?.name,
                                      address: s.value?.address,
                                    }),
                                  ),
                                  1,
                                ),
                              ]),
                              _: 1,
                            },
                          ))
                        : (m(),
                          D(
                            Ae,
                            { key: 1 },
                            {
                              default: l(() => [
                                r.value
                                  ? (m(),
                                    D(
                                      Y,
                                      { key: 0, class: "pa-0" },
                                      {
                                        default: l(() => [
                                          T.value.length > 0
                                            ? (m(),
                                              D(
                                                q,
                                                { key: 0 },
                                                {
                                                  default: l(() => [
                                                    (m(!0),
                                                    C(
                                                      A,
                                                      null,
                                                      B(
                                                        T.value,
                                                        (e) => (
                                                          m(),
                                                          C(
                                                            A,
                                                            { key: e.id },
                                                            [
                                                              (m(!0),
                                                              C(
                                                                A,
                                                                null,
                                                                B(
                                                                  ["", ...(e.suggestFolders ?? [])],
                                                                  (c) => (
                                                                    m(),
                                                                    D(
                                                                      M,
                                                                      {
                                                                        key: c,
                                                                        "prepend-avatar": U(e.type),
                                                                        subtitle: c,
                                                                        title: L(e),
                                                                        onClick: z(() => H(e, c), ["stop"]),
                                                                      },
                                                                      {
                                                                        default: l(() => [
                                                                          t(
                                                                            De,
                                                                            {
                                                                              activator: "parent",
                                                                              "open-on-hover": "",
                                                                              location: "end",
                                                                            },
                                                                            {
                                                                              default: l(() => [
                                                                                t(
                                                                                  q,
                                                                                  { density: "compact" },
                                                                                  {
                                                                                    default: l(() => [
                                                                                      (m(!0),
                                                                                      C(
                                                                                        A,
                                                                                        null,
                                                                                        B(
                                                                                          e.suggestTags,
                                                                                          (S) => (
                                                                                            m(),
                                                                                            D(
                                                                                              M,
                                                                                              {
                                                                                                key: S,
                                                                                                title: S,
                                                                                                onClick: z(
                                                                                                  () => H(e, c, S),
                                                                                                  ["stop"],
                                                                                                ),
                                                                                              },
                                                                                              null,
                                                                                              8,
                                                                                              ["title", "onClick"],
                                                                                            )
                                                                                          ),
                                                                                        ),
                                                                                        128,
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
                                                                      1032,
                                                                      [
                                                                        "prepend-avatar",
                                                                        "subtitle",
                                                                        "title",
                                                                        "onClick",
                                                                      ],
                                                                    )
                                                                  ),
                                                                ),
                                                                128,
                                                              )),
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
                                              ))
                                            : (m(),
                                              D(
                                                G,
                                                { key: 1, type: "warning", variant: "tonal" },
                                                {
                                                  default: l(() => [
                                                    O(
                                                      y(
                                                        K.value.length > 0 && u(b).download.allowDownloaderFilterForSite
                                                          ? u(d)("SentToDownloaderDialog.noDownloaderForSite")
                                                          : u(d)("SentToDownloaderDialog.noDownloader"),
                                                      ),
                                                      1,
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                              )),
                                        ]),
                                        _: 1,
                                      },
                                    ))
                                  : (m(),
                                    D(
                                      Y,
                                      { key: 1, class: "pb-0" },
                                      {
                                        default: l(() => [
                                          t(I, null, {
                                            default: l(() => [
                                              t(
                                                Pe,
                                                {
                                                  modelValue: s.value,
                                                  "onUpdate:modelValue": [n[1] || (n[1] = (e) => (s.value = e)), x],
                                                  "filter-keys": ["raw.name", "raw.address", "raw.username"],
                                                  items: T.value,
                                                  clearable: "",
                                                  placeholder: u(d)("SentToDownloaderDialog.selectDownloader"),
                                                },
                                                {
                                                  selection: l(({ item: { raw: e } }) => [
                                                    t(M, { "prepend-avatar": U(e.type), title: L(e) }, null, 8, [
                                                      "prepend-avatar",
                                                      "title",
                                                    ]),
                                                  ]),
                                                  item: l(({ props: e, item: { raw: c } }) => [
                                                    t(
                                                      M,
                                                      Ce(e, { "prepend-avatar": U(c.type), title: L(c) }),
                                                      {
                                                        append: l(() => [
                                                          t(
                                                            ce,
                                                            { color: "indigo", label: "" },
                                                            { default: l(() => [O(y(c.type), 1)]), _: 2 },
                                                            1024,
                                                          ),
                                                        ]),
                                                        _: 2,
                                                      },
                                                      1040,
                                                      ["prepend-avatar", "title"],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["modelValue", "items", "placeholder"],
                                              ),
                                            ]),
                                            _: 1,
                                          }),
                                          t(I, null, {
                                            default: l(() => [
                                              t(
                                                k,
                                                { class: "py-0 pl-0", cols: "6" },
                                                {
                                                  default: l(() => [
                                                    t(
                                                      Q,
                                                      {
                                                        modelValue: a.value.savePath,
                                                        "onUpdate:modelValue":
                                                          n[2] || (n[2] = (e) => (a.value.savePath = e)),
                                                        items: V.value,
                                                        hint: u(d)("SentToDownloaderDialog.savePathHint"),
                                                        label: u(d)("SentToDownloaderDialog.savePath"),
                                                        "persistent-hint": "",
                                                      },
                                                      null,
                                                      8,
                                                      ["modelValue", "items", "hint", "label"],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                              ),
                                              t(
                                                k,
                                                { class: "py-0 pr-0", cols: "6" },
                                                {
                                                  default: l(() => [
                                                    t(
                                                      Q,
                                                      {
                                                        modelValue: a.value.label,
                                                        "onUpdate:modelValue":
                                                          n[3] || (n[3] = (e) => (a.value.label = e)),
                                                        items: F.value,
                                                        hint: u(d)("SentToDownloaderDialog.labelHint"),
                                                        label: u(d)("SentToDownloaderDialog.label"),
                                                        "persistent-hint": "",
                                                      },
                                                      null,
                                                      8,
                                                      ["modelValue", "items", "hint", "label"],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                              ),
                                            ]),
                                            _: 1,
                                          }),
                                          t(I, null, {
                                            default: l(() => [
                                              t(k, null, {
                                                default: l(() => [
                                                  t(
                                                    j,
                                                    {
                                                      modelValue: a.value.localDownload,
                                                      "onUpdate:modelValue":
                                                        n[4] || (n[4] = (e) => (a.value.localDownload = e)),
                                                      color: "success",
                                                      disabled: !u(b).download.allowDirectSendToClient,
                                                      "hide-details": "",
                                                      label: u(d)("SentToDownloaderDialog.localRelay"),
                                                    },
                                                    null,
                                                    8,
                                                    ["modelValue", "disabled", "label"],
                                                  ),
                                                ]),
                                                _: 1,
                                              }),
                                              t(k, null, {
                                                default: l(() => [
                                                  t(
                                                    j,
                                                    {
                                                      modelValue: a.value.addAtPaused,
                                                      "onUpdate:modelValue":
                                                        n[5] || (n[5] = (e) => (a.value.addAtPaused = e)),
                                                      color: "success",
                                                      "hide-details": "",
                                                      label: u(d)("SentToDownloaderDialog.pauseOnAdd"),
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
                                          t(I, null, {
                                            default: l(() => [
                                              t(
                                                k,
                                                { class: "pa-0" },
                                                {
                                                  default: l(() => [
                                                    t(
                                                      xe,
                                                      {
                                                        disabled: !(
                                                          (f.value?.advanceAddTorrentOptions ?? []).length > 0
                                                        ),
                                                      },
                                                      {
                                                        default: l(() => [
                                                          t(
                                                            $e,
                                                            { title: u(d)("common.advancedSettings") },
                                                            {
                                                              default: l(() => [
                                                                t(Ie, null, {
                                                                  default: l(() => [
                                                                    (m(!0),
                                                                    C(
                                                                      A,
                                                                      null,
                                                                      B(
                                                                        f.value.advanceAddTorrentOptions,
                                                                        (e) => (
                                                                          m(),
                                                                          D(
                                                                            j,
                                                                            {
                                                                              key: e.key,
                                                                              modelValue:
                                                                                a.value.advanceAddTorrentOptions[e.key],
                                                                              "onUpdate:modelValue": (c) =>
                                                                                (a.value.advanceAddTorrentOptions[
                                                                                  e.key
                                                                                ] = c),
                                                                              color: "success",
                                                                              label: e.name,
                                                                              messages: e.description,
                                                                              "hide-details": !e.description,
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
                                                      },
                                                      8,
                                                      ["disabled"],
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
                                    )),
                              ]),
                              _: 1,
                            },
                          )),
                    ]),
                    _: 1,
                  }),
                  t(me),
                  t(fe, null, {
                    default: l(() => [
                      t(
                        $,
                        {
                          title: u(d)("SentToDownloaderDialog.moreOptions"),
                          icon: "mdi-cards",
                          onClick: n[6] || (n[6] = (e) => (r.value = !r.value)),
                        },
                        null,
                        8,
                        ["title"],
                      ),
                      t(ve),
                      t(
                        $,
                        {
                          disabled: v.value,
                          color: "info",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: n[7] || (n[7] = (e) => (g.value = !1)),
                        },
                        { default: l(() => [X("span", _e, y(u(d)("common.dialog.cancel")), 1)]), _: 1 },
                        8,
                        ["disabled"],
                      ),
                      t(
                        $,
                        {
                          disabled: !s.value || r.value,
                          loading: v.value,
                          color: "error",
                          variant: "text",
                          onClick: N,
                        },
                        {
                          default: l(() => [
                            t(pe, { icon: "mdi-check-circle-outline" }),
                            X("span", Oe, y(u(d)("common.dialog.ok")), 1),
                          ]),
                          _: 1,
                        },
                        8,
                        ["disabled", "loading"],
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
  });
export { Ye as _ };
