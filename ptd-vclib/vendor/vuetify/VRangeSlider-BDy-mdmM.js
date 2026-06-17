import {
  ax as ie,
  bX as re,
  bB as de,
  bp as ce,
  aP as ve,
  bN as me,
  c0 as fe,
  bz as he,
  T as Z,
  H as be,
  f as ge,
  i as xe,
  y as ee,
  t as X,
  c as ae,
  V as pe,
  l as te,
  p as Ve,
  c1 as Te,
  c6 as ye,
  bH as $e,
  bY as Ce,
  z as le,
  au as Se,
  av as we,
  b5 as ke,
  bc as _e,
  aV as Ee,
  aA as se,
  c8 as Me,
  a1 as Re,
  a0 as ne,
  A as Be,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import {
  X as Ie,
  c8 as j,
  ce as q,
  bj as i,
  I as H,
  ck as f,
  U as s,
  H as y,
  bS as p,
  b5 as oe,
  c4 as b,
  L as V,
  F as N,
  bu as ue,
  J as C,
  Q as F,
  b0 as z,
  bL as Pe,
  bp as Ne,
  br as O,
  D as R,
  bC as Ae,
} from "../packages/site/index-COeZNva1.js";
import { V as He } from "./VSkeletonLoader-YwNzPI56.js";
const Fe = ce({ disabled: Boolean, modelValue: { type: Boolean, default: null }, ...ve() }, "VHover"),
  ze = ie()({
    name: "VHover",
    props: Fe(),
    emits: { "update:modelValue": (e) => !0 },
    setup(e, B) {
      let { slots: d } = B;
      const n = re(e, "modelValue"),
        { runOpenDelay: I, runCloseDelay: o } = de(e, (v) => !e.disabled && (n.value = v));
      return () => d.default?.({ isHovering: n.value, props: { onMouseenter: I, onMouseleave: o } });
    },
  }),
  De = ["href", "title"],
  Le = { ref: "social", class: "ml-2" },
  Oe = { class: "text-center", style: { "max-width": "150px" } },
  Ue = { key: 0, class: "font-weight-bold my-2" },
  We = ["title"],
  Xe = { key: 1, class: "text-caption" },
  je = { key: 0 },
  qe = { key: 2, class: "font-weight-bold my-2" },
  Ge = { class: "text-caption mt-1" },
  Je = { ref: "tags" },
  Qe = ["title"],
  aa = Ie({
    __name: "TorrentTitleTd",
    props: { item: {}, showSocial: { type: Boolean, default: !0 } },
    setup(e) {
      const { t: B } = me(),
        d = fe(),
        n = he(),
        { width: I } = j(q("container")),
        { width: o } = j(q("tags")),
        { width: v } = j(q("social")),
        u = Ne({}),
        A = O(!1),
        _ = R(() => {
          const l = e.item.tags;
          if (!l || !l.length) return [];
          const T = n.searchEntifyControl.hiddenTagNames || [];
          return l.filter((c) => !T.includes(c.name));
        }),
        $ = R(() => n.searchEntifyControl.maxTagCountBeforeGroup || 0),
        a = R(() => (!$.value || $.value >= _.value.length || A.value ? _.value : _.value.slice(0, $.value))),
        r = R(() => $.value > 0 && _.value.length > $.value && !A.value),
        U = R(() => _.value.length - $.value);
      function P(l) {
        n.searchEntifyControl.hiddenTagNames.includes(l) ||
          (n.searchEntifyControl.hiddenTagNames = [...n.searchEntifyControl.hiddenTagNames, l]);
      }
      function S(l) {
        e.item[`ext_${l}`] &&
          !u[l] &&
          ((u[l] = { loading: !0 }),
          Ae("getSocialInformation", { site: l, sid: e.item[`ext_${l}`] }).then((T) => {
            u[l] = T;
          }));
      }
      function W(l, T) {
        const c = { name: "SearchEntity", query: { search: `${l}|${T}`, flush: 1 } };
        n.searchEntifyControl.socialInformationSearchOnNewTab ? window.open(d.resolve(c).href, "_blank") : d.push(c);
      }
      return (l, T) => (
        i(),
        H(
          Ve,
          { ref: "container", class: "t_main" },
          {
            default: f(() => [
              s(Z, null, {
                default: f(() => [
                  y(
                    "span",
                    { style: oe({ width: `${b(I) - b(v)}px` }), class: "text-truncate" },
                    [
                      y(
                        "a",
                        {
                          href: e.item.url,
                          title: e.item.title,
                          class: "t_title text-decoration-none text-high-emphasis text-subtitle-1 text-truncate",
                          rel: "noopener noreferrer nofollow",
                          target: "_blank",
                        },
                        p(e.item.title ?? e.item.url ?? e.item.link),
                        9,
                        De,
                      ),
                    ],
                    4,
                  ),
                  y(
                    "div",
                    Le,
                    [
                      e.showSocial && b(n).searchEntifyControl.showSocialInformation
                        ? (i(!0),
                          V(
                            N,
                            { key: 0 },
                            ue(
                              b(Pe),
                              (c, t) => (
                                i(),
                                V(
                                  N,
                                  { key: t },
                                  [
                                    e.item[`ext_${t}`]
                                      ? (i(),
                                        H(
                                          be,
                                          { key: 0, "open-on-hover": "" },
                                          {
                                            activator: f(({ props: g }) => [
                                              s(
                                                pe,
                                                z({ ref_for: !0 }, g, {
                                                  image: `/icons/social/${t}.png`,
                                                  rounded: "0",
                                                  size: "x-small",
                                                  class: "ml-1",
                                                  onClick: () => S(t),
                                                  onMouseenter: () => S(t),
                                                }),
                                                null,
                                                16,
                                                ["image", "onClick", "onMouseenter"],
                                              ),
                                            ]),
                                            default: f(() => [
                                              s(
                                                ge,
                                                null,
                                                {
                                                  default: f(() => [
                                                    s(
                                                      xe,
                                                      { class: "pa-0 py-1" },
                                                      {
                                                        default: f(() => [
                                                          y("div", Oe, [
                                                            u[t]?.loading === !0
                                                              ? (i(), V("h3", Ue, "Loading...."))
                                                              : u[t]?.id
                                                                ? (i(),
                                                                  V(
                                                                    N,
                                                                    { key: 1 },
                                                                    [
                                                                      s(
                                                                        ee,
                                                                        {
                                                                          src: u[t]?.poster,
                                                                          class: "mb-1",
                                                                          width: "150",
                                                                          "aspect-ratio": "2/3",
                                                                        },
                                                                        {
                                                                          placeholder: f(() => [
                                                                            s(He, { type: "image@2", height: "225" }),
                                                                          ]),
                                                                          error: f(() => [
                                                                            s(ee, {
                                                                              width: "150",
                                                                              src: "/icons/movie_placeholder.png",
                                                                              class: "mb-1",
                                                                            }),
                                                                          ]),
                                                                          _: 1,
                                                                        },
                                                                        8,
                                                                        ["src"],
                                                                      ),
                                                                      u[t]?.title
                                                                        ? (i(),
                                                                          V(
                                                                            "h3",
                                                                            {
                                                                              key: 0,
                                                                              class:
                                                                                "text-decoration-none text-ellipsis text-truncate font-weight-bold",
                                                                              title: u[t]?.title,
                                                                            },
                                                                            p(u[t]?.title.split(" / ")[0]),
                                                                            9,
                                                                            We,
                                                                          ))
                                                                        : C("", !0),
                                                                      u[t]?.ratingScore
                                                                        ? (i(),
                                                                          V("p", Xe, [
                                                                            F(p(u[t].ratingScore) + " ", 1),
                                                                            u[t]?.ratingCount
                                                                              ? (i(),
                                                                                V(
                                                                                  "span",
                                                                                  je,
                                                                                  " from " +
                                                                                    p(u[t].ratingCount) +
                                                                                    " votes ",
                                                                                  1,
                                                                                ))
                                                                              : C("", !0),
                                                                          ]))
                                                                        : C("", !0),
                                                                    ],
                                                                    64,
                                                                  ))
                                                                : (i(), V("h3", qe, "No Information")),
                                                            s(X, { class: "my-1" }),
                                                            s(
                                                              ae,
                                                              {
                                                                variant: "text",
                                                                block: "",
                                                                "append-icon": "mdi-magnify",
                                                                onClick: (g) => W(t, e.item[`ext_${t}`]),
                                                              },
                                                              {
                                                                default: f(() => [F(p(b(B)("common.search")), 1)]),
                                                                _: 1,
                                                              },
                                                              8,
                                                              ["onClick"],
                                                            ),
                                                            s(X, { class: "my-1" }),
                                                            s(
                                                              ae,
                                                              {
                                                                variant: "text",
                                                                href: c(e.item[`ext_${t}`]),
                                                                target: "_blank",
                                                                block: "",
                                                                rel: "noopener noreferrer nofollow",
                                                                title: `${t}: ${e.item[`ext_${t}`]}`,
                                                                "append-icon": "mdi-arrow-top-right-bold-box-outline",
                                                              },
                                                              {
                                                                default: f(() => [F(p(b(B)("common.visit")), 1)]),
                                                                _: 1,
                                                              },
                                                              8,
                                                              ["href", "title"],
                                                            ),
                                                            s(X, { class: "my-1" }),
                                                            y(
                                                              "p",
                                                              Ge,
                                                              "( " + p(t) + ": " + p(e.item[`ext_${t}`]) + " )",
                                                              1,
                                                            ),
                                                          ]),
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
                                      : C("", !0),
                                  ],
                                  64,
                                )
                              ),
                            ),
                            128,
                          ))
                        : C("", !0),
                    ],
                    512,
                  ),
                ]),
                _: 1,
              }),
              b(n).searchEntifyControl.showTorrentTag || b(n).searchEntifyControl.showTorrentSubtitle
                ? (i(),
                  H(
                    Z,
                    { key: 0 },
                    {
                      default: f(() => [
                        y(
                          "div",
                          Je,
                          [
                            b(n).searchEntifyControl.showTorrentTag && e.item.tags && e.item.tags.length > 0
                              ? (i(),
                                V(
                                  N,
                                  { key: 0 },
                                  [
                                    (i(!0),
                                    V(
                                      N,
                                      null,
                                      ue(
                                        a.value,
                                        (c) => (
                                          i(),
                                          H(
                                            ze,
                                            { key: c.name },
                                            {
                                              default: f(({ isHovering: t, props: g }) => [
                                                s(
                                                  te,
                                                  z({ ref_for: !0 }, g, {
                                                    color: c.color,
                                                    closable: t,
                                                    class: "mr-1",
                                                    label: "",
                                                    size: "x-small",
                                                    "onClick:close": (w) => P(c.name),
                                                  }),
                                                  { default: f(() => [F(p(c.name), 1)]), _: 2 },
                                                  1040,
                                                  ["color", "closable", "onClick:close"],
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
                                    r.value
                                      ? (i(),
                                        H(
                                          te,
                                          {
                                            key: 0,
                                            class: "mr-1",
                                            label: "",
                                            size: "x-small",
                                            color: "primary",
                                            variant: "tonal",
                                            "prepend-icon": "mdi-arrow-expand-right",
                                            onClick: T[0] || (T[0] = (c) => (A.value = !0)),
                                          },
                                          { default: f(() => [F(p(U.value), 1)]), _: 1 },
                                        ))
                                      : C("", !0),
                                  ],
                                  64,
                                ))
                              : C("", !0),
                          ],
                          512,
                        ),
                        b(n).searchEntifyControl.showTorrentSubtitle && e.item.subTitle
                          ? (i(),
                            V(
                              "span",
                              {
                                key: 0,
                                style: oe({ "max-width": e.item.tags ? `${b(I) - b(o)}px` : void 0 }),
                                title: e.item.subTitle,
                                class: "t_subTitle text-grey text-truncate",
                              },
                              p(e.item.subTitle),
                              13,
                              Qe,
                            ))
                          : C("", !0),
                      ]),
                      _: 1,
                    },
                  ))
                : C("", !0),
            ]),
            _: 1,
          },
          512,
        )
      );
    },
  }),
  Ye = ce(
    { ...Ee(), ..._e(), ...ke(), strict: Boolean, modelValue: { type: Array, default: () => [0, 0] } },
    "VRangeSlider",
  ),
  ta = ie()({
    name: "VRangeSlider",
    inheritAttrs: !1,
    props: Ye(),
    emits: { "update:focused": (e) => !0, "update:modelValue": (e) => !0, end: (e) => !0, start: (e) => !0 },
    setup(e, B) {
      let { slots: d, emit: n, attrs: I } = B;
      const o = O(),
        v = O(),
        u = O(),
        { rtlClasses: A } = Te();
      function _(x) {
        if (!o.value || !v.value) return;
        const h = se(x, o.value.$el, e.direction),
          m = se(x, v.value.$el, e.direction),
          k = Math.abs(h),
          E = Math.abs(m);
        return k < E || (k === E && h < 0) ? o.value.$el : v.value.$el;
      }
      const $ = Me(e),
        a = re(e, "modelValue", void 0, (x) => (x?.length ? x.map((h) => $.roundValue(h)) : [0, 0])),
        {
          activeThumbRef: r,
          hasLabels: U,
          max: P,
          min: S,
          mousePressed: W,
          onSliderMousedown: l,
          onSliderTouchstart: T,
          position: c,
          trackContainerRef: t,
          disabled: g,
          readonly: w,
        } = ye({
          props: e,
          steps: $,
          onSliderStart: () => {
            if (g.value || w.value) {
              r.value?.blur();
              return;
            }
            n("start", a.value);
          },
          onSliderEnd: (x) => {
            let { value: h } = x;
            if (g.value || w.value) r.value?.blur();
            else {
              const m = r.value === o.value?.$el ? [h, a.value[1]] : [a.value[0], h];
              !e.strict && m[0] < m[1] && (a.value = m);
            }
            n("end", a.value);
          },
          onSliderMove: (x) => {
            let { value: h } = x;
            const [m, k] = a.value;
            if (g.value || w.value) {
              r.value?.blur();
              return;
            }
            (!e.strict &&
              m === k &&
              m !== S.value &&
              ((r.value = h > m ? v.value?.$el : o.value?.$el), r.value?.focus()),
              r.value === o.value?.$el ? (a.value = [Math.min(h, k), k]) : (a.value = [m, Math.max(m, h)]));
          },
          getActiveThumb: _,
        }),
        { isFocused: D, focus: G, blur: J } = $e(e),
        Q = R(() => c(a.value[0])),
        Y = R(() => c(a.value[1]));
      return (
        Ce(() => {
          const x = le.filterProps(e),
            [h, m] = Se(I),
            k = !!(e.label || d.label || d.prepend);
          return s(
            le,
            z(
              {
                class: [
                  "v-slider",
                  "v-range-slider",
                  {
                    "v-slider--has-labels": !!d["tick-label"] || U.value,
                    "v-slider--focused": D.value,
                    "v-slider--pressed": W.value,
                    "v-slider--disabled": g.value,
                  },
                  A.value,
                  e.class,
                ],
                style: e.style,
                ref: u,
              },
              x,
              h,
              { focused: D.value },
            ),
            {
              ...d,
              prepend: k
                ? (E) =>
                    y(N, null, [
                      d.label?.(E) ?? (e.label ? s(Be, { class: "v-slider__label", text: e.label }, null) : void 0),
                      d.prepend?.(E),
                    ])
                : void 0,
              default: (E) => {
                let { id: L, messagesId: K } = E;
                return y(
                  "div",
                  {
                    class: "v-slider__container",
                    onMousedown: w.value ? void 0 : l,
                    onTouchstartPassive: w.value ? void 0 : T,
                  },
                  [
                    y(
                      "input",
                      {
                        id: `${L.value}_start`,
                        name: e.name || L.value,
                        disabled: g.value,
                        readonly: w.value,
                        tabindex: "-1",
                        value: a.value[0],
                      },
                      null,
                    ),
                    y(
                      "input",
                      {
                        id: `${L.value}_stop`,
                        name: e.name || L.value,
                        disabled: g.value,
                        readonly: w.value,
                        tabindex: "-1",
                        value: a.value[1],
                      },
                      null,
                    ),
                    s(Re, { ref: t, start: Q.value, stop: Y.value }, { "tick-label": d["tick-label"] }),
                    s(
                      ne,
                      z(
                        {
                          ref: o,
                          "aria-describedby": K.value,
                          focused: D && r.value === o.value?.$el,
                          modelValue: a.value[0],
                          "onUpdate:modelValue": (M) => (a.value = [M, a.value[1]]),
                          onFocus: (M) => {
                            (G(),
                              (r.value = o.value?.$el),
                              P.value !== S.value &&
                                a.value[0] === a.value[1] &&
                                a.value[1] === S.value &&
                                M.relatedTarget !== v.value?.$el &&
                                (o.value?.$el.blur(), v.value?.$el.focus()));
                          },
                          onBlur: () => {
                            (J(), (r.value = void 0));
                          },
                          min: S.value,
                          max: a.value[1],
                          position: Q.value,
                          ripple: e.ripple,
                        },
                        m,
                      ),
                      { "thumb-label": d["thumb-label"] },
                    ),
                    s(
                      ne,
                      z(
                        {
                          ref: v,
                          "aria-describedby": K.value,
                          focused: D && r.value === v.value?.$el,
                          modelValue: a.value[1],
                          "onUpdate:modelValue": (M) => (a.value = [a.value[0], M]),
                          onFocus: (M) => {
                            (G(),
                              (r.value = v.value?.$el),
                              P.value !== S.value &&
                                a.value[0] === a.value[1] &&
                                a.value[0] === P.value &&
                                M.relatedTarget !== o.value?.$el &&
                                (v.value?.$el.blur(), o.value?.$el.focus()));
                          },
                          onBlur: () => {
                            (J(), (r.value = void 0));
                          },
                          min: a.value[0],
                          max: P.value,
                          position: Y.value,
                          ripple: e.ripple,
                        },
                        m,
                      ),
                      { "thumb-label": d["thumb-label"] },
                    ),
                  ],
                );
              },
            },
          );
        }),
        we({ focus: () => o.value?.$el.focus() }, u)
      );
    },
  });
export { ta as V, aa as _ };
