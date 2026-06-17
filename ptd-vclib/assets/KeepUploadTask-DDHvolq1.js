import {
  bN as F,
  c2 as j,
  bV as M,
  f as H,
  j as Q,
  c as f,
  x as m,
  B as R,
  C as X,
  F as q,
  D as G,
  a8 as S,
  a7 as J,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as W,
  bf as Y,
  L as C,
  U as s,
  ck as a,
  F as x,
  bC as T,
  br as v,
  bj as w,
  Q as d,
  bS as n,
  c4 as r,
  I as V,
  H as p,
  bu as Z,
} from "../vendor/packages/site/index-COeZNva1.js";
import { e as B, b as ee } from "./utils-DF6YUpNn.js";
import { V as b } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as te } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
const ae = { class: "d-flex flex-column align-center" },
  le = ["href"],
  oe = { class: "text-caption text-grey" },
  se = { class: "text-caption" },
  ne = ["colspan"],
  re = ["href"],
  ie = W({
    __name: "Index",
    setup(de) {
      const { t: e } = F(),
        c = j(),
        z = M(),
        u = v([]),
        k = v([]),
        g = v([]),
        U = v(!1),
        h = v(0),
        y = [
          { title: e("KeepUploadTask.table.site"), key: "site", align: "center", sortable: !1 },
          { title: e("KeepUploadTask.table.title"), key: "title", align: "start" },
          { title: e("KeepUploadTask.table.size"), key: "size", align: "end" },
          { title: e("KeepUploadTask.table.count"), key: "count", align: "center" },
          { title: e("KeepUploadTask.table.time"), key: "time", align: "center" },
          { title: e("common.action"), key: "action", align: "center", sortable: !1 },
        ];
      async function O() {
        U.value = !0;
        try {
          u.value = await T("getKeepUploadTasks", void 0);
        } catch (l) {
          (console.error("Failed to load keep upload tasks:", l), (u.value = []));
        } finally {
          U.value = !1;
        }
      }
      Y(() => {
        O();
      });
      async function P(l) {
        if (confirm(e("KeepUploadTask.deleteConfirm")))
          try {
            (await T("deleteKeepUploadTask", l.id),
              (u.value = u.value.filter((t) => t.id !== l.id)),
              c.showSnakebar(e("KeepUploadTask.deleteSuccess"), { color: "success" }));
          } catch {
            c.showSnakebar(e("KeepUploadTask.deleteError"), { color: "error" });
          }
      }
      async function A() {
        if (k.value.length !== 0 && confirm(e("KeepUploadTask.deleteSelectedConfirm", { count: k.value.length })))
          try {
            for (const l of k.value) await T("deleteKeepUploadTask", l.id);
            ((u.value = u.value.filter((l) => !k.value.includes(l))),
              (k.value = []),
              c.showSnakebar(e("KeepUploadTask.deleteSuccess"), { color: "success" }));
          } catch {
            c.showSnakebar(e("KeepUploadTask.deleteError"), { color: "error" });
          }
      }
      async function L() {
        if (confirm(e("KeepUploadTask.clearConfirm")))
          try {
            (await T("clearKeepUploadTasks", void 0),
              (u.value = []),
              c.showSnakebar(e("KeepUploadTask.clearSuccess"), { color: "success" }));
          } catch {
            c.showSnakebar(e("KeepUploadTask.clearError"), { color: "error" });
          }
      }
      async function K(l, t) {
        if (t.length === 0) return;
        if (!z.downloaders[l.downloadOptions.downloaderId]) {
          c.showSnakebar("下载器不存在", { color: "error" });
          return;
        }
        try {
          for (const i of t)
            await T("downloadTorrent", {
              torrent: { site: i.site, title: i.title, subTitle: i.subTitle, link: i.url, url: i.url, size: i.size },
              downloaderId: l.downloadOptions.downloaderId,
              addTorrentOptions: {
                localDownload: !0,
                addAtPaused: !0,
                savePath: l.downloadOptions.savePath || "",
                ...l.downloadOptions.addTorrentOptions,
              },
            });
          c.showSnakebar(e("KeepUploadTask.sendSingleSuccess"), { color: "success" });
        } catch {
          c.showSnakebar(e("KeepUploadTask.sendSingleError"), { color: "error" });
        }
      }
      async function E(l, t) {
        if (t === 0) return;
        const o = l.items.splice(t, 1)[0];
        l.items.unshift(o);
        try {
          (await T("updateKeepUploadTask", l),
            h.value++,
            c.showSnakebar(e("KeepUploadTask.setBaseSuccess"), { color: "success" }));
        } catch {
          c.showSnakebar(e("KeepUploadTask.setBaseError"), { color: "error" });
        }
      }
      function $(l) {
        const t = l.items.slice(0, 1);
        K(l, t);
      }
      function D(l) {
        if (l.items.length <= 1 || !confirm(e("KeepUploadTask.sendConfirm", { count: l.items.length - 1 }))) return;
        const t = l.items.slice(1);
        K(l, t);
      }
      function I(l) {
        if (!confirm(e("KeepUploadTask.sendConfirm", { count: l.items.length }))) return;
        const t = l.items.slice(0);
        K(l, t);
      }
      async function N(l) {
        const t = l.items.map((o) => o.url).join(`
`);
        try {
          (await navigator.clipboard.writeText(t),
            c.showSnakebar(e("KeepUploadTask.copySuccess", { count: l.items.length }), { color: "success" }));
        } catch {
          c.showSnakebar(e("KeepUploadTask.copyError"), { color: "error" });
        }
      }
      return (l, t) => (
        w(),
        C(
          x,
          null,
          [
            s(b, { type: "info" }, { default: a(() => [d(n(r(e)("KeepUploadTask.title")), 1)]), _: 1 }),
            s(H, null, {
              default: a(() => [
                s(Q, null, {
                  default: a(() => [
                    s(
                      f,
                      { color: "error", disabled: k.value.length === 0, class: "mr-2", onClick: A },
                      {
                        default: a(() => [
                          s(
                            m,
                            { class: "mr-2" },
                            { default: a(() => [...(t[2] || (t[2] = [d("mdi-delete", -1)]))]), _: 1 },
                          ),
                          d(" " + n(r(e)("common.remove")), 1),
                        ]),
                        _: 1,
                      },
                      8,
                      ["disabled"],
                    ),
                    s(
                      f,
                      { color: "error", disabled: u.value.length === 0, onClick: L },
                      {
                        default: a(() => [
                          s(
                            m,
                            { class: "mr-2" },
                            { default: a(() => [...(t[3] || (t[3] = [d("mdi-delete-sweep", -1)]))]), _: 1 },
                          ),
                          d(" " + n(r(e)("KeepUploadTask.clearAll")), 1),
                        ]),
                        _: 1,
                      },
                      8,
                      ["disabled"],
                    ),
                    s(
                      f,
                      {
                        color: "info",
                        href: "https://github.com/pt-plugins/PT-Plugin-Plus/wiki/keep-upload-task",
                        target: "_blank",
                        rel: "noopener noreferrer nofollow",
                        class: "ml-2",
                      },
                      {
                        default: a(() => [
                          s(
                            m,
                            { class: "mr-2" },
                            { default: a(() => [...(t[4] || (t[4] = [d("mdi-help", -1)]))]), _: 1 },
                          ),
                          d(" " + n(r(e)("common.howToUse")), 1),
                        ]),
                        _: 1,
                      },
                    ),
                  ]),
                  _: 1,
                }),
                (w(),
                V(
                  te,
                  {
                    key: h.value,
                    modelValue: k.value,
                    "onUpdate:modelValue": t[0] || (t[0] = (o) => (k.value = o)),
                    expanded: g.value,
                    "onUpdate:expanded": t[1] || (t[1] = (o) => (g.value = o)),
                    headers: y,
                    items: u.value,
                    loading: U.value,
                    "item-value": "id",
                    "show-select": "",
                    "show-expand": "",
                    class: "elevation-1",
                  },
                  {
                    "item.site": a(({ item: o }) => [
                      p("div", ae, [s(S, { "site-id": o.items[0]?.site, size: 18 }, null, 8, ["site-id"])]),
                    ]),
                    "item.title": a(({ item: o }) => [
                      p("div", null, [
                        p(
                          "a",
                          { href: o.items[0]?.link, target: "_blank", rel: "noopener noreferrer nofollow" },
                          n(o.title),
                          9,
                          le,
                        ),
                        p(
                          "div",
                          oe,
                          n(r(e)("KeepUploadTask.savePath")) +
                            n(o.downloadOptions?.clientName) +
                            " -> " +
                            n(o.downloadOptions?.savePath || r(e)("KeepUploadTask.defaultPath")),
                          1,
                        ),
                        p("div", se, n(r(e)("KeepUploadTask.torrentCount")) + n(o.items.length), 1),
                      ]),
                    ]),
                    "item.size": a(({ item: o }) => [d(n(r(B)(o.size)), 1)]),
                    "item.count": a(({ item: o }) => [d(n(o.items.length), 1)]),
                    "item.time": a(({ item: o }) => [d(n(r(ee)(o.time)), 1)]),
                    "item.action": a(({ item: o }) => [
                      s(
                        f,
                        {
                          icon: "",
                          variant: "text",
                          color: "primary",
                          title: r(e)("KeepUploadTask.sendBaseTorrent"),
                          onClick: (i) => $(o),
                        },
                        {
                          default: a(() => [
                            s(m, null, {
                              default: a(() => [...(t[5] || (t[5] = [d("mdi-numeric-1-circle", -1)]))]),
                              _: 1,
                            }),
                          ]),
                          _: 1,
                        },
                        8,
                        ["title", "onClick"],
                      ),
                      s(
                        f,
                        {
                          icon: "",
                          variant: "text",
                          color: "info",
                          title: r(e)("KeepUploadTask.sendOtherTorrents"),
                          onClick: (i) => D(o),
                        },
                        {
                          default: a(() => [
                            s(m, null, {
                              default: a(() => [...(t[6] || (t[6] = [d("mdi-numeric-2-circle", -1)]))]),
                              _: 1,
                            }),
                          ]),
                          _: 1,
                        },
                        8,
                        ["title", "onClick"],
                      ),
                      s(
                        f,
                        {
                          icon: "",
                          variant: "text",
                          color: "success",
                          title: r(e)("KeepUploadTask.sendAllTorrents"),
                          onClick: (i) => I(o),
                        },
                        {
                          default: a(() => [
                            s(m, null, { default: a(() => [...(t[7] || (t[7] = [d("mdi-download", -1)]))]), _: 1 }),
                          ]),
                          _: 1,
                        },
                        8,
                        ["title", "onClick"],
                      ),
                      s(
                        f,
                        {
                          icon: "",
                          variant: "text",
                          color: "info",
                          title: r(e)("KeepUploadTask.copyLinks"),
                          onClick: (i) => N(o),
                        },
                        {
                          default: a(() => [
                            s(m, null, { default: a(() => [...(t[8] || (t[8] = [d("mdi-content-copy", -1)]))]), _: 1 }),
                          ]),
                          _: 1,
                        },
                        8,
                        ["title", "onClick"],
                      ),
                      s(
                        f,
                        {
                          icon: "",
                          variant: "text",
                          color: "error",
                          title: r(e)("common.remove"),
                          onClick: (i) => P(o),
                        },
                        {
                          default: a(() => [
                            s(m, null, { default: a(() => [...(t[9] || (t[9] = [d("mdi-delete", -1)]))]), _: 1 }),
                          ]),
                          _: 1,
                        },
                        8,
                        ["title", "onClick"],
                      ),
                    ]),
                    "expanded-row": a(({ item: o }) => [
                      p("tr", null, [
                        p(
                          "td",
                          { colspan: y.length + 1, class: "pa-0" },
                          [
                            s(
                              R,
                              { density: "compact", class: "ml-10" },
                              {
                                default: a(() => [
                                  (w(!0),
                                  C(
                                    x,
                                    null,
                                    Z(
                                      o.items,
                                      (i, _) => (
                                        w(),
                                        V(
                                          X,
                                          { key: _ },
                                          {
                                            prepend: a(() => [
                                              s(S, { "site-id": i.site, size: 16 }, null, 8, ["site-id"]),
                                            ]),
                                            append: a(() => [
                                              s(
                                                f,
                                                {
                                                  icon: "",
                                                  variant: "text",
                                                  color: "primary",
                                                  size: "small",
                                                  title: r(e)("KeepUploadTask.setAsBaseTorrent"),
                                                  onClick: (ce) => E(o, _),
                                                },
                                                {
                                                  default: a(() => [
                                                    s(m, null, {
                                                      default: a(() => [
                                                        ...(t[10] || (t[10] = [d("mdi-arrow-up-bold", -1)])),
                                                      ]),
                                                      _: 1,
                                                    }),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["title", "onClick"],
                                              ),
                                            ]),
                                            default: a(() => [
                                              s(
                                                q,
                                                null,
                                                {
                                                  default: a(() => [
                                                    p(
                                                      "a",
                                                      {
                                                        href: i.link,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer nofollow",
                                                      },
                                                      n(i.title),
                                                      9,
                                                      re,
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1024,
                                              ),
                                              s(
                                                G,
                                                null,
                                                {
                                                  default: a(() => [
                                                    d(
                                                      n(r(B)(i.size)) +
                                                        ", " +
                                                        n(r(e)("KeepUploadTask.seeders")) +
                                                        n(i.seeders ?? "-") +
                                                        ", " +
                                                        n(r(e)("KeepUploadTask.leechers")) +
                                                        n(i.leechers ?? "-"),
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
                          ],
                          8,
                          ne,
                        ),
                      ]),
                    ]),
                    "no-data": a(() => [
                      s(
                        b,
                        { type: "info", variant: "tonal" },
                        { default: a(() => [d(n(r(e)("KeepUploadTask.emptyNotice")), 1)]), _: 1 },
                      ),
                    ]),
                    _: 1,
                  },
                  8,
                  ["modelValue", "expanded", "items", "loading"],
                )),
              ]),
              _: 1,
            }),
            s(
              b,
              { type: "warning", class: "mt-4" },
              {
                default: a(() => [
                  p("div", null, [
                    d(n(r(e)("KeepUploadTask.warning.title")) + " ", 1),
                    p("ul", null, [
                      p("li", null, n(r(e)("KeepUploadTask.warning.item1")), 1),
                      p("li", null, n(r(e)("KeepUploadTask.warning.item2")), 1),
                      p("li", null, n(r(e)("KeepUploadTask.warning.item3")), 1),
                    ]),
                  ]),
                ]),
                _: 1,
              },
            ),
          ],
          64,
        )
      );
    },
  }),
  be = J(ie, [["__scopeId", "data-v-df6a14ab"]]);
export { be as default };
