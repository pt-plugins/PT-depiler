import {
  H as s,
  b5 as v,
  b3 as g,
  U as l,
  ch as F,
  bJ as H,
  br as U,
  D as S,
  bY as c,
  X as q,
  ca as A,
  $ as Q,
  Z as Y,
  j as W,
  L as k,
  c4 as C,
  ck as d,
  F as _,
  bj as h,
  Q as T,
  bS as f,
  bu as X,
  e as Z,
} from "../vendor/packages/site/index-COeZNva1.js";
import {
  ax as P,
  c5 as G,
  by as $,
  b_ as K,
  bY as V,
  x as M,
  r as p,
  bF as ee,
  bp as z,
  a as O,
  aT as w,
  b4 as N,
  b1 as L,
  aO as I,
  ag as b,
  bD as te,
  b6 as E,
  aR as ie,
  br as le,
  bC as ne,
  c1 as ae,
  bq as se,
  b7 as oe,
  aQ as re,
  bn as de,
  bN as ce,
  f as j,
  j as B,
  i as x,
} from "./src/entries/options/index-DmNe5UVo.js";
import { V as ue } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as me } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
const ve = z(
    {
      dotColor: String,
      fillDot: Boolean,
      hideDot: Boolean,
      icon: O,
      iconColor: String,
      lineColor: String,
      ...I(),
      ...L(),
      ...N(),
      ...w(),
    },
    "VTimelineDivider",
  ),
  fe = P()({
    name: "VTimelineDivider",
    props: ve(),
    setup(e, n) {
      let { slots: o } = n;
      const { sizeClasses: a, sizeStyles: u } = G(e, "v-timeline-divider__dot"),
        { backgroundColorStyles: m, backgroundColorClasses: r } = $(() => e.dotColor),
        { roundedClasses: i } = K(e, "v-timeline-divider__dot"),
        { elevationClasses: t } = ee(e),
        { backgroundColorClasses: y, backgroundColorStyles: R } = $(() => e.lineColor);
      return (
        V(() =>
          s(
            "div",
            {
              class: g(["v-timeline-divider", { "v-timeline-divider--fill-dot": e.fillDot }, e.class]),
              style: v(e.style),
            },
            [
              s("div", { class: g(["v-timeline-divider__before", y.value]), style: v(R.value) }, null),
              !e.hideDot &&
                s(
                  "div",
                  { key: "dot", class: g(["v-timeline-divider__dot", t.value, i.value, a.value]), style: v(u.value) },
                  [
                    s("div", { class: g(["v-timeline-divider__inner-dot", r.value, i.value]), style: v(m.value) }, [
                      o.default
                        ? l(
                            p,
                            {
                              key: "icon-defaults",
                              disabled: !e.icon,
                              defaults: { VIcon: { color: e.iconColor, icon: e.icon, size: e.size } },
                            },
                            o.default,
                          )
                        : l(M, { key: "icon", color: e.iconColor, icon: e.icon, size: e.size }, null),
                    ]),
                  ],
                ),
              s("div", { class: g(["v-timeline-divider__after", y.value]), style: v(R.value) }, null),
            ],
          ),
        ),
        {}
      );
    },
  }),
  J = z(
    {
      density: String,
      dotColor: String,
      fillDot: Boolean,
      hideDot: Boolean,
      hideOpposite: { type: Boolean, default: void 0 },
      icon: O,
      iconColor: String,
      lineInset: [Number, String],
      side: { type: String, validator: (e) => e == null || ["start", "end"].includes(e) },
      ...I(),
      ...ie(),
      ...w(),
      ...L(),
      ...N(),
      ...E(),
    },
    "VTimelineItem",
  ),
  ge = P()({
    name: "VTimelineItem",
    props: J(),
    setup(e, n) {
      let { slots: o } = n;
      const { dimensionStyles: a } = te(e),
        u = H(0),
        m = U();
      return (
        F(
          m,
          (r) => {
            r && (u.value = r.$el.querySelector(".v-timeline-divider__dot")?.getBoundingClientRect().width ?? 0);
          },
          { flush: "post" },
        ),
        V(() =>
          s(
            "div",
            {
              class: g([
                "v-timeline-item",
                {
                  "v-timeline-item--fill-dot": e.fillDot,
                  "v-timeline-item--side-start": e.side === "start",
                  "v-timeline-item--side-end": e.side === "end",
                },
                e.class,
              ]),
              style: v([
                {
                  "--v-timeline-dot-size": b(u.value),
                  "--v-timeline-line-inset": e.lineInset
                    ? `calc(var(--v-timeline-dot-size) / 2 + ${b(e.lineInset)})`
                    : b(0),
                },
                e.style,
              ]),
            },
            [
              s("div", { class: "v-timeline-item__body", style: v(a.value) }, [o.default?.()]),
              l(
                fe,
                {
                  ref: m,
                  hideDot: e.hideDot,
                  icon: e.icon,
                  iconColor: e.iconColor,
                  size: e.size,
                  elevation: e.elevation,
                  dotColor: e.dotColor,
                  fillDot: e.fillDot,
                  rounded: e.rounded,
                },
                { default: o.icon },
              ),
              e.density !== "compact" &&
                s("div", { class: "v-timeline-item__opposite" }, [!e.hideOpposite && o.opposite?.()]),
            ],
          ),
        ),
        {}
      );
    },
  }),
  ye = z(
    {
      align: { type: String, default: "center", validator: (e) => ["center", "start"].includes(e) },
      direction: { type: String, default: "vertical", validator: (e) => ["vertical", "horizontal"].includes(e) },
      justify: { type: String, default: "auto", validator: (e) => ["auto", "center"].includes(e) },
      side: { type: String, validator: (e) => e == null || ["start", "end"].includes(e) },
      lineThickness: { type: [String, Number], default: 2 },
      lineColor: String,
      truncateLine: { type: String, validator: (e) => ["start", "end", "both"].includes(e) },
      ...de(J({ lineInset: 0 }), ["dotColor", "fillDot", "hideOpposite", "iconColor", "lineInset", "size"]),
      ...I(),
      ...re(),
      ...E(),
      ...oe(),
    },
    "VTimeline",
  ),
  ke = P()({
    name: "VTimeline",
    props: ye(),
    setup(e, n) {
      let { slots: o } = n;
      const { themeClasses: a } = le(e),
        { densityClasses: u } = ne(e),
        { rtlClasses: m } = ae();
      se({
        VTimelineDivider: { lineColor: c(() => e.lineColor) },
        VTimelineItem: {
          density: c(() => e.density),
          dotColor: c(() => e.dotColor),
          fillDot: c(() => e.fillDot),
          hideOpposite: c(() => e.hideOpposite),
          iconColor: c(() => e.iconColor),
          lineColor: c(() => e.lineColor),
          lineInset: c(() => e.lineInset),
          size: c(() => e.size),
        },
      });
      const r = S(() => {
          const t = e.side ? e.side : e.density !== "default" ? "end" : null;
          return t && `v-timeline--side-${t}`;
        }),
        i = S(() => {
          const t = ["v-timeline--truncate-line-start", "v-timeline--truncate-line-end"];
          switch (e.truncateLine) {
            case "both":
              return t;
            case "start":
              return t[0];
            case "end":
              return t[1];
            default:
              return null;
          }
        });
      return (
        V(() =>
          l(
            e.tag,
            {
              class: g([
                "v-timeline",
                `v-timeline--${e.direction}`,
                `v-timeline--align-${e.align}`,
                `v-timeline--justify-${e.justify}`,
                i.value,
                { "v-timeline--inset-line": !!e.lineInset },
                a.value,
                u.value,
                r.value,
                m.value,
                e.class,
              ]),
              style: v([{ "--v-timeline-line-thickness": b(e.lineThickness) }, e.style]),
            },
            o,
          ),
        ),
        {}
      );
    },
  }),
  he = ["href"],
  be = ["href"],
  Ce = ["href"],
  D = "https://www.npmjs.com/package/",
  ze = q({
    __name: "TechnologyStack",
    setup(e) {
      const { t: n } = ce(),
        o = [
          { name: "PT Depiler", time: "2020-10-25", link: Z, color: "info" },
          { name: "PT Plugin Plus", time: "2018-12-16", link: "https://github.com/ronggang/PT-Plugin-Plus" },
          { name: "PT Plugin （Rhilip修改版）", time: "2018-04-18", link: "https://github.com/Rhilip/PT-Plugin" },
          { name: "PT Plugin", time: "2014-10-10", link: "https://github.com/ronggang/PT-Plugin" },
        ],
        a = A("PTD_TechnologyData", {
          Jackett: { name: "Jackett", version: "latest", url: "https://github.com/Jackett/Jackett" },
        });
      Object.entries({ ...Y, ...Q }).forEach((r) => {
        const [i, t] = r;
        ((a.value[i] ??= { name: i, version: "", url: `${D}${i}` }),
          a.value[i].version !== t &&
            (a.value[i].url ?? "").startsWith(D) &&
            W.get(`https://registry.npmjs.org/${i}`)
              .then(({ data: y }) => {
                a.value[i].url = y?.homepage ?? `${D}${i}`;
              })
              .finally(() => {
                a.value[i].version = t;
              }));
      });
      const u = [
          { title: n("common.name"), key: "name", align: "start" },
          { title: n("common.version"), key: "version", align: "center", sortable: !1 },
          { title: n("TechnologyStack.stackTableColumn.homepage"), key: "url", align: "start", sortable: !1 },
        ],
        m = S(() => Object.values(a.value));
      return (r, i) => (
        h(),
        k(
          _,
          null,
          [
            l(ue, { title: C(n)("TechnologyStack.thankNote"), class: "mb-2", type: "info" }, null, 8, ["title"]),
            l(
              j,
              { class: "mb-2" },
              {
                default: d(() => [
                  l(B, null, { default: d(() => [T(f(C(n)("TechnologyStack.ptppHistory")), 1)]), _: 1 }),
                  l(x, null, {
                    default: d(() => [
                      l(
                        ke,
                        { side: "end" },
                        {
                          default: d(() => [
                            (h(),
                            k(
                              _,
                              null,
                              X(o, (t) =>
                                l(
                                  ge,
                                  {
                                    key: t.name,
                                    "dot-color": t.color ?? "",
                                    size: t.color ? "default" : "x-small",
                                    rounded: "",
                                  },
                                  {
                                    opposite: d(() => [T(f(t.time), 1)]),
                                    default: d(() => [
                                      r.$vuetify.display.smAndUp
                                        ? (h(),
                                          k(
                                            _,
                                            { key: 0 },
                                            [
                                              s("strong", null, f(t.name), 1),
                                              i[0] || (i[0] = s("br", null, null, -1)),
                                              s("a", { href: t.link, target: "_blank" }, f(t.link), 9, he),
                                            ],
                                            64,
                                          ))
                                        : (h(), k("a", { key: 1, href: t.link, target: "_blank" }, f(t.name), 9, be)),
                                    ]),
                                    _: 2,
                                  },
                                  1032,
                                  ["dot-color", "size"],
                                ),
                              ),
                              64,
                            )),
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
            ),
            l(j, null, {
              default: d(() => [
                l(B, null, { default: d(() => [T(f(C(n)("TechnologyStack.dependency")), 1)]), _: 1 }),
                l(x, null, {
                  default: d(() => [
                    l(
                      me,
                      {
                        headers: u,
                        items: m.value,
                        "items-per-page": -1,
                        "sort-by": [{ key: "name", order: "asc" }],
                        hover: "",
                        "item-value": "id",
                        "must-sort": "",
                      },
                      {
                        "item.url": d(({ item: t }) => [
                          s(
                            "a",
                            { href: t.url, rel: "noopener noreferrer nofollow", target: "_blank" },
                            f(t.url),
                            9,
                            Ce,
                          ),
                        ]),
                        _: 1,
                      },
                      8,
                      ["items"],
                    ),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            }),
          ],
          64,
        )
      );
    },
  });
export { ze as default };
