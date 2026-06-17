import {
  aI as ht,
  ab as pt,
  ax as U,
  bX as K,
  bS as le,
  c1 as xt,
  br as St,
  bE as ce,
  bq as xe,
  bZ as Pt,
  bY as J,
  aK as Te,
  bp as A,
  a as E,
  bi as wt,
  b7 as kt,
  b6 as It,
  b4 as Vt,
  b1 as Dt,
  aT as Tt,
  aQ as fe,
  aO as Ct,
  aN as _t,
  c as W,
  aj as ne,
  ay as Re,
  ad as he,
  W as Ne,
  bm as ke,
  ap as Ft,
  ag as G,
  af as Bt,
  cg as te,
  aJ as Ot,
  an as $e,
  aH as Et,
  az as ue,
  aG as re,
  a_ as At,
  aS as Ie,
  bR as Lt,
  by as Rt,
  L as Nt,
  k as de,
  x as Ce,
  l as $t,
  E as pe,
  cf as se,
  bn as Se,
  aB as oe,
  bG as Gt,
  aU as Ht,
  t as Mt,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import {
  bc as jt,
  br as z,
  U as w,
  b5 as Ge,
  b3 as Q,
  bJ as He,
  b2 as Pe,
  D as k,
  bY as F,
  H as S,
  b0 as O,
  b_ as M,
  as as Y,
  ch as Ve,
  bo as Z,
  cj as Wt,
  t as zt,
  F as X,
  Q as _e,
  bX as ie,
  bS as Kt,
  bZ as Ut,
} from "../packages/site/index-COeZNva1.js";
import { m as qt, V as Fe } from "./VTable-7Q8JlSj6.js";
function Be(e, t, l) {
  return Object.keys(e)
    .filter((a) => ht(a) && a.endsWith(t))
    .reduce((a, n) => ((a[n.slice(0, -t.length)] = (r) => pt(e[n], r, l(r))), a), {});
}
function Qt() {
  const e = z([]);
  jt(() => (e.value = []));
  function t(l, a) {
    e.value[a] = l;
  }
  return { refs: e, updateRef: t };
}
const Xt = A(
    {
      activeColor: String,
      start: { type: [Number, String], default: 1 },
      modelValue: { type: Number, default: (e) => e.start },
      disabled: Boolean,
      length: { type: [Number, String], default: 1, validator: (e) => e % 1 === 0 },
      totalVisible: [Number, String],
      firstIcon: { type: E, default: "$first" },
      prevIcon: { type: E, default: "$prev" },
      nextIcon: { type: E, default: "$next" },
      lastIcon: { type: E, default: "$last" },
      ariaLabel: { type: String, default: "$vuetify.pagination.ariaLabel.root" },
      pageAriaLabel: { type: String, default: "$vuetify.pagination.ariaLabel.page" },
      currentPageAriaLabel: { type: String, default: "$vuetify.pagination.ariaLabel.currentPage" },
      firstAriaLabel: { type: String, default: "$vuetify.pagination.ariaLabel.first" },
      previousAriaLabel: { type: String, default: "$vuetify.pagination.ariaLabel.previous" },
      nextAriaLabel: { type: String, default: "$vuetify.pagination.ariaLabel.next" },
      lastAriaLabel: { type: String, default: "$vuetify.pagination.ariaLabel.last" },
      ellipsis: { type: String, default: "..." },
      showFirstLastPage: Boolean,
      ..._t(),
      ...Ct(),
      ...fe(),
      ...Tt(),
      ...Dt(),
      ...Vt(),
      ...It({ tag: "nav" }),
      ...kt(),
      ...wt({ variant: "text" }),
    },
    "VPagination",
  ),
  Oe = U()({
    name: "VPagination",
    props: Xt(),
    emits: { "update:modelValue": (e) => !0, first: (e) => !0, prev: (e) => !0, next: (e) => !0, last: (e) => !0 },
    setup(e, t) {
      let { slots: l, emit: a } = t;
      const n = K(e, "modelValue"),
        { t: r, n: s } = le(),
        { isRtl: d } = xt(),
        { themeClasses: o } = St(e),
        { width: c } = ce(),
        v = He(-1);
      xe(void 0, { scoped: !0 });
      const { resizeRef: y } = Pt((x) => {
          if (!x.length) return;
          const { target: h, contentRect: f } = x[0],
            T = h.querySelector(".v-pagination__list > *");
          if (!T) return;
          const V = f.width,
            _ = T.offsetWidth + parseFloat(getComputedStyle(T).marginRight) * 2;
          v.value = m(V, _);
        }),
        i = k(() => parseInt(e.length, 10)),
        g = k(() => parseInt(e.start, 10)),
        p = k(() => (e.totalVisible != null ? parseInt(e.totalVisible, 10) : v.value >= 0 ? v.value : m(c.value, 58)));
      function m(x, h) {
        const f = e.showFirstLastPage ? 5 : 3;
        return Math.max(0, Math.floor(Number(((x - h * f) / h).toFixed(2))));
      }
      const u = k(() => {
        if (i.value <= 0 || isNaN(i.value) || i.value > Number.MAX_SAFE_INTEGER) return [];
        if (p.value <= 0) return [];
        if (p.value === 1) return [n.value];
        if (i.value <= p.value) return ne(i.value, g.value);
        const x = p.value % 2 === 0,
          h = x ? p.value / 2 : Math.floor(p.value / 2),
          f = x ? h : h + 1,
          T = i.value - h;
        if (f - n.value >= 0) return [...ne(Math.max(1, p.value - 1), g.value), e.ellipsis, i.value];
        if (n.value - T >= (x ? 1 : 0)) {
          const V = p.value - 1,
            _ = i.value - V + g.value;
          return [g.value, e.ellipsis, ...ne(V, _)];
        } else {
          const V = Math.max(1, p.value - 2),
            _ = V === 1 ? n.value : n.value - Math.ceil(V / 2) + g.value;
          return [g.value, e.ellipsis, ...ne(V, _), e.ellipsis, i.value];
        }
      });
      function D(x, h, f) {
        (x.preventDefault(), (n.value = h), f && a(f, h));
      }
      const { refs: b, updateRef: I } = Qt();
      xe({
        VPaginationBtn: {
          color: F(() => e.color),
          border: F(() => e.border),
          density: F(() => e.density),
          size: F(() => e.size),
          variant: F(() => e.variant),
          rounded: F(() => e.rounded),
          elevation: F(() => e.elevation),
        },
      });
      const C = k(() =>
          u.value.map((x, h) => {
            const f = (T) => I(T, h);
            if (typeof x == "string")
              return {
                isActive: !1,
                key: `ellipsis-${h}`,
                page: x,
                props: { ref: f, ellipsis: !0, icon: !0, disabled: !0 },
              };
            {
              const T = x === n.value;
              return {
                isActive: T,
                key: x,
                page: s(x),
                props: {
                  ref: f,
                  ellipsis: !1,
                  icon: !0,
                  disabled: !!e.disabled || Number(e.length) < 2,
                  color: T ? e.activeColor : e.color,
                  "aria-current": T,
                  "aria-label": r(T ? e.currentPageAriaLabel : e.pageAriaLabel, x),
                  onClick: (V) => D(V, x),
                },
              };
            }
          }),
        ),
        P = k(() => {
          const x = !!e.disabled || n.value <= g.value,
            h = !!e.disabled || n.value >= g.value + i.value - 1;
          return {
            first: e.showFirstLastPage
              ? {
                  icon: d.value ? e.lastIcon : e.firstIcon,
                  onClick: (f) => D(f, g.value, "first"),
                  disabled: x,
                  "aria-label": r(e.firstAriaLabel),
                  "aria-disabled": x,
                }
              : void 0,
            prev: {
              icon: d.value ? e.nextIcon : e.prevIcon,
              onClick: (f) => D(f, n.value - 1, "prev"),
              disabled: x,
              "aria-label": r(e.previousAriaLabel),
              "aria-disabled": x,
            },
            next: {
              icon: d.value ? e.prevIcon : e.nextIcon,
              onClick: (f) => D(f, n.value + 1, "next"),
              disabled: h,
              "aria-label": r(e.nextAriaLabel),
              "aria-disabled": h,
            },
            last: e.showFirstLastPage
              ? {
                  icon: d.value ? e.firstIcon : e.lastIcon,
                  onClick: (f) => D(f, g.value + i.value - 1, "last"),
                  disabled: h,
                  "aria-label": r(e.lastAriaLabel),
                  "aria-disabled": h,
                }
              : void 0,
          };
        });
      function N() {
        const x = n.value - g.value;
        b.value[x]?.$el.focus();
      }
      function $(x) {
        x.key === Te.left && !e.disabled && n.value > Number(e.start)
          ? ((n.value = n.value - 1), Pe(N))
          : x.key === Te.right && !e.disabled && n.value < g.value + i.value - 1 && ((n.value = n.value + 1), Pe(N));
      }
      return (
        J(() =>
          w(
            e.tag,
            {
              ref: y,
              class: Q(["v-pagination", o.value, e.class]),
              style: Ge(e.style),
              role: "navigation",
              "aria-label": r(e.ariaLabel),
              onKeydown: $,
              "data-test": "v-pagination-root",
            },
            {
              default: () => [
                S("ul", { class: "v-pagination__list" }, [
                  e.showFirstLastPage &&
                    S("li", { key: "first", class: "v-pagination__first", "data-test": "v-pagination-first" }, [
                      l.first ? l.first(P.value.first) : w(W, O({ _as: "VPaginationBtn" }, P.value.first), null),
                    ]),
                  S("li", { key: "prev", class: "v-pagination__prev", "data-test": "v-pagination-prev" }, [
                    l.prev ? l.prev(P.value.prev) : w(W, O({ _as: "VPaginationBtn" }, P.value.prev), null),
                  ]),
                  C.value.map((x, h) =>
                    S(
                      "li",
                      {
                        key: x.key,
                        class: Q(["v-pagination__item", { "v-pagination__item--is-active": x.isActive }]),
                        "data-test": "v-pagination-item",
                      },
                      [l.item ? l.item(x) : w(W, O({ _as: "VPaginationBtn" }, x.props), { default: () => [x.page] })],
                    ),
                  ),
                  S("li", { key: "next", class: "v-pagination__next", "data-test": "v-pagination-next" }, [
                    l.next ? l.next(P.value.next) : w(W, O({ _as: "VPaginationBtn" }, P.value.next), null),
                  ]),
                  e.showFirstLastPage &&
                    S("li", { key: "last", class: "v-pagination__last", "data-test": "v-pagination-last" }, [
                      l.last ? l.last(P.value.last) : w(W, O({ _as: "VPaginationBtn" }, P.value.last), null),
                    ]),
                ]),
              ],
            },
          ),
        ),
        {}
      );
    },
  }),
  Jt = A(
    {
      page: { type: [Number, String], default: 1 },
      itemsPerPage: { type: [Number, String], default: 10 },
      pageBy: { type: String, default: "any" },
    },
    "DataTable-paginate",
  ),
  Me = Symbol.for("vuetify:data-table-pagination");
function Yt(e) {
  const t = K(e, "page", void 0, (a) => Number(a ?? 1)),
    l = K(e, "itemsPerPage", void 0, (a) => Number(a ?? 10));
  return { page: t, itemsPerPage: l };
}
function Zt(e) {
  const { page: t, itemsPerPage: l, itemsLength: a } = e,
    n = k(() => (l.value === -1 ? 0 : l.value * (t.value - 1))),
    r = k(() => (l.value === -1 ? a.value : Math.min(a.value, n.value + l.value))),
    s = k(() => (l.value === -1 || a.value === 0 ? 1 : Math.ceil(a.value / l.value)));
  Ve([t, s], () => {
    t.value > s.value && (t.value = s.value);
  });
  function d(i) {
    ((l.value = i), (t.value = 1));
  }
  function o() {
    t.value = he(t.value + 1, 1, s.value);
  }
  function c() {
    t.value = he(t.value - 1, 1, s.value);
  }
  function v(i) {
    t.value = he(i, 1, s.value);
  }
  const y = {
    page: t,
    itemsPerPage: l,
    startIndex: n,
    stopIndex: r,
    pageCount: s,
    itemsLength: a,
    nextPage: o,
    prevPage: c,
    setPage: v,
    setItemsPerPage: d,
  };
  return (Z(Me, y), y);
}
function ea() {
  const e = Y(Me);
  if (!e) throw new Error("Missing pagination!");
  return e;
}
function ta(e) {
  const t = Re("usePaginatedItems"),
    { items: l, startIndex: a, stopIndex: n, itemsPerPage: r } = e,
    s = k(() => (r.value <= 0 ? M(l) : M(l).slice(a.value, n.value)));
  return (
    Ve(
      s,
      (d) => {
        t.emit("update:currentItems", d);
      },
      { immediate: !0 },
    ),
    { paginatedItems: s }
  );
}
function aa(e) {
  const { sortedItems: t, paginate: l, group: a } = e,
    n = M(e.pageBy);
  if (n === "item") {
    const { paginatedItems: r, pageCount: s, setItemsPerPage: d } = l(t),
      { flatItems: o } = a(r);
    return { pageCount: s, setItemsPerPage: d, paginatedItems: o };
  }
  if (n === "group") {
    const { flatItems: r, groups: s } = a(t),
      { paginatedItems: d, pageCount: o, setItemsPerPage: c } = l(s),
      v = k(() => {
        if (!d.value.length) return [];
        const y = d.value.at(0).id,
          i = d.value.at(-1).id,
          g = r.value.findIndex((u) => u.type === "group" && u.id === y),
          p = r.value.findIndex((u) => u.type === "group" && u.id === i),
          m = r.value.findIndex((u, D) => D > p && u.type === "group" && u.depth === 0);
        return r.value.slice(g, m === -1 ? void 0 : m);
      });
    return { pageCount: o, setItemsPerPage: c, paginatedItems: v };
  }
  if (n === "any") {
    const { flatItems: r } = a(t),
      { paginatedItems: s, pageCount: d, setItemsPerPage: o } = l(r);
    return { pageCount: d, setItemsPerPage: o, paginatedItems: s };
  }
  throw new Error(`Unrecognized pagination target ${n}`);
}
const je = A(
    {
      color: String,
      prevIcon: { type: E, default: "$prev" },
      nextIcon: { type: E, default: "$next" },
      firstIcon: { type: E, default: "$first" },
      lastIcon: { type: E, default: "$last" },
      itemsPerPageText: { type: String, default: "$vuetify.dataFooter.itemsPerPageText" },
      pageText: { type: String, default: "$vuetify.dataFooter.pageText" },
      firstPageLabel: { type: String, default: "$vuetify.dataFooter.firstPage" },
      prevPageLabel: { type: String, default: "$vuetify.dataFooter.prevPage" },
      nextPageLabel: { type: String, default: "$vuetify.dataFooter.nextPage" },
      lastPageLabel: { type: String, default: "$vuetify.dataFooter.lastPage" },
      itemsPerPageOptions: {
        type: Array,
        default: () => [
          { value: 10, title: "10" },
          { value: 25, title: "25" },
          { value: 50, title: "50" },
          { value: 100, title: "100" },
          { value: -1, title: "$vuetify.dataFooter.itemsPerPageAll" },
        ],
      },
      showCurrentPage: Boolean,
    },
    "VDataTableFooter",
  ),
  Ee = U()({
    name: "VDataTableFooter",
    props: je(),
    setup(e, t) {
      let { slots: l } = t;
      const { t: a } = le(),
        {
          page: n,
          pageCount: r,
          startIndex: s,
          stopIndex: d,
          itemsLength: o,
          itemsPerPage: c,
          setItemsPerPage: v,
        } = ea(),
        y = k(() =>
          e.itemsPerPageOptions.map((i) =>
            typeof i == "number"
              ? { value: i, title: i === -1 ? a("$vuetify.dataFooter.itemsPerPageAll") : String(i) }
              : { ...i, title: isNaN(Number(i.title)) ? a(i.title) : i.title },
          ),
        );
      return (
        J(() => {
          const i = Oe.filterProps(e);
          return S("div", { class: "v-data-table-footer" }, [
            l.prepend?.(),
            S("div", { class: "v-data-table-footer__items-per-page" }, [
              S("span", null, [a(e.itemsPerPageText)]),
              w(
                Ne,
                {
                  items: y.value,
                  itemColor: e.color,
                  modelValue: c.value,
                  "onUpdate:modelValue": (g) => v(Number(g)),
                  density: "compact",
                  variant: "outlined",
                  "aria-label": a(e.itemsPerPageText),
                  hideDetails: !0,
                },
                null,
              ),
            ]),
            S("div", { class: "v-data-table-footer__info" }, [
              S("div", null, [a(e.pageText, o.value ? s.value + 1 : 0, d.value, o.value)]),
            ]),
            S("div", { class: "v-data-table-footer__pagination" }, [
              w(
                Oe,
                O(
                  {
                    modelValue: n.value,
                    "onUpdate:modelValue": (g) => (n.value = g),
                    density: "comfortable",
                    firstAriaLabel: e.firstPageLabel,
                    lastAriaLabel: e.lastPageLabel,
                    length: r.value,
                    nextAriaLabel: e.nextPageLabel,
                    previousAriaLabel: e.prevPageLabel,
                    rounded: !0,
                    showFirstLastPage: !0,
                    totalVisible: e.showCurrentPage ? 1 : 0,
                    variant: "plain",
                  },
                  ke(i, ["color"]),
                ),
                null,
              ),
            ]),
          ]);
        }),
        {}
      );
    },
  }),
  ae = Ft(
    {
      align: { type: String, default: "start" },
      fixed: { type: [Boolean, String], default: !1 },
      fixedOffset: [Number, String],
      fixedEndOffset: [Number, String],
      height: [Number, String],
      lastFixed: Boolean,
      firstFixedEnd: Boolean,
      noPadding: Boolean,
      indent: [Number, String],
      empty: Boolean,
      tag: String,
      width: [Number, String],
      maxWidth: [Number, String],
      nowrap: Boolean,
    },
    (e, t) => {
      let { slots: l } = t;
      const a = e.tag ?? "td",
        n = typeof e.fixed == "string" ? e.fixed : e.fixed ? "start" : "none";
      return w(
        a,
        {
          class: Q([
            "v-data-table__td",
            {
              "v-data-table-column--fixed": n === "start",
              "v-data-table-column--fixed-end": n === "end",
              "v-data-table-column--last-fixed": e.lastFixed,
              "v-data-table-column--first-fixed-end": e.firstFixedEnd,
              "v-data-table-column--no-padding": e.noPadding,
              "v-data-table-column--nowrap": e.nowrap,
              "v-data-table-column--empty": e.empty,
            },
            `v-data-table-column--align-${e.align}`,
          ]),
          style: {
            height: G(e.height),
            width: G(e.width),
            maxWidth: G(e.maxWidth),
            left: n === "start" ? G(e.fixedOffset || null) : void 0,
            right: n === "end" ? G(e.fixedEndOffset || null) : void 0,
            paddingInlineStart: e.indent ? G(e.indent) : void 0,
          },
        },
        { default: () => [l.default?.()] },
      );
    },
  ),
  la = A({ headers: Array }, "DataTable-header"),
  We = Symbol.for("vuetify:data-table-headers"),
  ze = { title: "", sortable: !1 },
  na = { ...ze, width: 48 };
function ra() {
  const t = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []).map((l) => ({
    element: l,
    priority: 0,
  }));
  return {
    enqueue: (l, a) => {
      let n = !1;
      for (let r = 0; r < t.length; r++)
        if (t[r].priority > a) {
          (t.splice(r, 0, { element: l, priority: a }), (n = !0));
          break;
        }
      n || t.push({ element: l, priority: a });
    },
    size: () => t.length,
    count: () => {
      let l = 0;
      if (!t.length) return 0;
      const a = Math.floor(t[0].priority);
      for (let n = 0; n < t.length; n++) Math.floor(t[n].priority) === a && (l += 1);
      return l;
    },
    dequeue: () => t.shift(),
  };
}
function we(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (!e.children) t.push(e);
  else for (const l of e.children) we(l, t);
  return t;
}
function Ke(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : new Set();
  for (const l of e) (l.key && t.add(l.key), l.children && Ke(l.children, t));
  return t;
}
function sa(e) {
  if (e.key) {
    if (e.key === "data-table-group") return ze;
    if (["data-table-expand", "data-table-select"].includes(e.key)) return na;
  }
}
function De(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  return e.children ? Math.max(t, ...e.children.map((l) => De(l, t + 1))) : t;
}
function oa(e) {
  let t = !1;
  function l(r, s) {
    let d = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "none";
    if (r)
      if ((d !== "none" && (r.fixed = d), r.fixed === !0 && (r.fixed = "start"), r.fixed === s))
        if (r.children)
          if (s === "start") for (let o = r.children.length - 1; o >= 0; o--) l(r.children[o], s, s);
          else for (let o = 0; o < r.children.length; o++) l(r.children[o], s, s);
        else
          (!t && s === "start"
            ? (r.lastFixed = !0)
            : !t && s === "end"
              ? (r.firstFixedEnd = !0)
              : isNaN(Number(r.width))
                ? Bt(`Multiple fixed columns should have a static width (key: ${r.key})`)
                : (r.minWidth = Math.max(Number(r.width) || 0, Number(r.minWidth) || 0)),
            (t = !0));
      else if (r.children)
        if (s === "start") for (let o = r.children.length - 1; o >= 0; o--) l(r.children[o], s);
        else for (let o = 0; o < r.children.length; o++) l(r.children[o], s);
      else t = !1;
  }
  for (let r = e.length - 1; r >= 0; r--) l(e[r], "start");
  for (let r = 0; r < e.length; r++) l(e[r], "end");
  let a = 0;
  for (let r = 0; r < e.length; r++) a = Ue(e[r], a);
  let n = 0;
  for (let r = e.length - 1; r >= 0; r--) n = qe(e[r], n);
}
function Ue(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  if (!e) return t;
  if (e.children) {
    e.fixedOffset = t;
    for (const l of e.children) t = Ue(l, t);
  } else e.fixed && e.fixed !== "end" && ((e.fixedOffset = t), (t += parseFloat(e.width || "0") || 0));
  return t;
}
function qe(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  if (!e) return t;
  if (e.children) {
    e.fixedEndOffset = t;
    for (const l of e.children) t = qe(l, t);
  } else e.fixed === "end" && ((e.fixedEndOffset = t), (t += parseFloat(e.width || "0") || 0));
  return t;
}
function ia(e, t) {
  const l = [];
  let a = 0;
  const n = ra(e);
  for (; n.size() > 0; ) {
    let s = n.count();
    const d = [];
    let o = 1;
    for (; s > 0; ) {
      const { element: c, priority: v } = n.dequeue(),
        y = t - a - De(c);
      if ((d.push({ ...c, rowspan: y ?? 1, colspan: c.children ? we(c).length : 1 }), c.children))
        for (const i of c.children) {
          const g = (v % 1) + o / Math.pow(10, a + 2);
          n.enqueue(i, a + y + g);
        }
      ((o += 1), (s -= 1));
    }
    ((a += 1), l.push(d));
  }
  return { columns: e.map((s) => we(s)).flat(), headers: l };
}
function Qe(e) {
  const t = [];
  for (const l of e) {
    const a = { ...sa(l), ...l },
      n = a.key ?? (typeof a.value == "string" ? a.value : null),
      r = a.value ?? n ?? null,
      s = {
        ...a,
        key: n,
        value: r,
        sortable: a.sortable ?? (a.key != null || !!a.sort),
        children: a.children ? Qe(a.children) : void 0,
      };
    t.push(s);
  }
  return t;
}
function ua(e, t) {
  const l = z([]),
    a = z([]),
    n = z({}),
    r = z({}),
    s = z({});
  Wt(() => {
    const c = (e.headers || Object.keys(e.items[0] ?? {}).map((m) => ({ key: m, title: zt(m) }))).slice(),
      v = Ke(c);
    (t?.groupBy?.value.length && !v.has("data-table-group") && c.unshift({ key: "data-table-group", title: "Group" }),
      t?.showSelect?.value && !v.has("data-table-select") && c.unshift({ key: "data-table-select" }),
      t?.showExpand?.value && !v.has("data-table-expand") && c.push({ key: "data-table-expand" }));
    const y = Qe(c);
    oa(y);
    const i = Math.max(...y.map((m) => De(m))) + 1,
      g = ia(y, i);
    ((l.value = g.headers), (a.value = g.columns));
    const p = g.headers.flat(1);
    for (const m of p)
      m.key &&
        (m.sortable && (m.sort && (n.value[m.key] = m.sort), m.sortRaw && (r.value[m.key] = m.sortRaw)),
        m.filter && (s.value[m.key] = m.filter));
  });
  const d = { headers: l, columns: a, sortFunctions: n, sortRawFunctions: r, filterFunctions: s };
  return (Z(We, d), d);
}
function ge() {
  const e = Y(We);
  if (!e) throw new Error("Missing headers!");
  return e;
}
const da = {
    showSelectAll: !1,
    allSelected: () => [],
    select: (e) => {
      let { items: t, value: l } = e;
      return new Set(l ? [t[0]?.value] : []);
    },
    selectAll: (e) => {
      let { selected: t } = e;
      return t;
    },
  },
  Xe = {
    showSelectAll: !0,
    allSelected: (e) => {
      let { currentPage: t } = e;
      return t;
    },
    select: (e) => {
      let { items: t, value: l, selected: a } = e;
      for (const n of t) l ? a.add(n.value) : a.delete(n.value);
      return a;
    },
    selectAll: (e) => {
      let { value: t, currentPage: l, selected: a } = e;
      return Xe.select({ items: l, value: t, selected: a });
    },
  },
  ca = {
    showSelectAll: !0,
    allSelected: (e) => {
      let { allItems: t } = e;
      return t;
    },
    select: (e) => {
      let { items: t, value: l, selected: a } = e;
      for (const n of t) l ? a.add(n.value) : a.delete(n.value);
      return a;
    },
    selectAll: (e) => {
      let { value: t, allItems: l } = e;
      return new Set(t ? l.map((a) => a.value) : []);
    },
  },
  fa = A(
    {
      showSelect: Boolean,
      selectStrategy: { type: [String, Object], default: "page" },
      modelValue: { type: Array, default: () => [] },
      valueComparator: Function,
    },
    "DataTable-select",
  ),
  Je = Symbol.for("vuetify:data-table-selection");
function ga(e, t) {
  let { allItems: l, currentPage: a } = t;
  const n = K(
      e,
      "modelValue",
      e.modelValue,
      (b) => {
        const I = e.valueComparator;
        return I
          ? new Set(te(b).map((C) => l.value.find((P) => I(C, P.value))?.value ?? C))
          : new Set(
              te(b).map((C) =>
                Ot(C)
                  ? (l.value.find((P) => C === P.value)?.value ?? C)
                  : (l.value.find((P) => $e(C, P.value))?.value ?? C),
              ),
            );
      },
      (b) => [...b.values()],
    ),
    r = k(() => l.value.filter((b) => b.selectable)),
    s = k(() => M(a).filter((b) => b.selectable)),
    d = k(() => {
      if (typeof e.selectStrategy == "object") return e.selectStrategy;
      switch (e.selectStrategy) {
        case "single":
          return da;
        case "all":
          return ca;
        case "page":
        default:
          return Xe;
      }
    }),
    o = He(null);
  function c(b) {
    return te(b).every((I) => n.value.has(I.value));
  }
  function v(b) {
    return te(b).some((I) => n.value.has(I.value));
  }
  function y(b, I) {
    const C = d.value.select({ items: b, value: I, selected: new Set(n.value) });
    n.value = C;
  }
  function i(b, I, C) {
    const P = [],
      N = M(a);
    if (
      ((I = I ?? N.findIndex(($) => $.value === b.value)),
      e.selectStrategy !== "single" && C?.shiftKey && o.value !== null)
    ) {
      const [$, x] = [o.value, I].sort((h, f) => h - f);
      P.push(...N.slice($, x + 1).filter((h) => h.selectable));
    } else (P.push(b), (o.value = I));
    y(P, !c([b]));
  }
  function g(b) {
    const I = d.value.selectAll({ value: b, allItems: r.value, currentPage: s.value, selected: new Set(n.value) });
    n.value = I;
  }
  const p = k(() => n.value.size > 0),
    m = k(() => {
      const b = d.value.allSelected({ allItems: r.value, currentPage: s.value });
      return !!b.length && c(b);
    }),
    u = F(() => d.value.showSelectAll),
    D = {
      toggleSelect: i,
      select: y,
      selectAll: g,
      isSelected: c,
      isSomeSelected: v,
      someSelected: p,
      allSelected: m,
      showSelectAll: u,
      lastSelectedIndex: o,
      selectStrategy: d,
    };
  return (Z(Je, D), D);
}
function ve() {
  const e = Y(Je);
  if (!e) throw new Error("Missing selection!");
  return e;
}
const va = A(
    {
      initialSortOrder: { type: String, default: "asc", validator: (e) => !e || ["asc", "desc"].includes(e) },
      sortBy: { type: Array, default: () => [] },
      customKeySort: Object,
      multiSort: { type: [Boolean, Object], default: !1 },
      mustSort: Boolean,
    },
    "DataTable-sort",
  ),
  Ye = Symbol.for("vuetify:data-table-sort");
function ma(e) {
  const t = F(() => e.initialSortOrder),
    l = K(e, "sortBy"),
    a = F(() => e.mustSort),
    n = F(() => e.multiSort);
  return { initialSortOrder: t, sortBy: l, multiSort: n, mustSort: a };
}
function ba(e, t) {
  if (!Et(e)) return { active: !!e };
  const { key: l, mode: a, modifier: n } = e,
    r = (n === "alt" && t?.altKey) || (n === "shift" && t?.shiftKey);
  return { active: !l || t?.ctrlKey || t?.metaKey || !1, mode: r ? (a === "append" ? "prepend" : "append") : a };
}
function ya(e) {
  const { initialSortOrder: t, sortBy: l, mustSort: a, multiSort: n, page: r } = e,
    s = function (c, v) {
      let y = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
      if (c.key == null) return;
      let i = l.value.map((u) => ({ ...u })) ?? [];
      const g = i.find((u) => u.key === c.key),
        p = t.value,
        m = t.value === "desc" ? "asc" : "desc";
      if (g)
        g.order === m
          ? y || (a.value && i.length === 1)
            ? (g.order = t.value)
            : (i = i.filter((u) => u.key !== c.key))
          : (g.order = m);
      else {
        const { active: u, mode: D } = ba(n.value, v);
        u
          ? D === "prepend"
            ? i.unshift({ key: c.key, order: p })
            : i.push({ key: c.key, order: p })
          : (i = [{ key: c.key, order: p }]);
      }
      ((l.value = i), r && (r.value = 1));
    };
  function d(c) {
    return !!l.value.find((v) => v.key === c.key);
  }
  const o = { sortBy: l, toggleSort: s, isSorted: d };
  return (Z(Ye, o), o);
}
function Ze() {
  const e = Y(Ye);
  if (!e) throw new Error("Missing sort!");
  return e;
}
function ha(e, t, l, a) {
  const n = le();
  return {
    sortedItems: k(() =>
      l.value.length
        ? pa(t.value, l.value, n.current.value, {
            transform: a?.transform,
            sortFunctions: { ...e.customKeySort, ...a?.sortFunctions?.value },
            sortRawFunctions: a?.sortRawFunctions?.value,
          })
        : t.value,
    ),
  };
}
function pa(e, t, l, a) {
  const n = new Intl.Collator(l, { sensitivity: "accent", usage: "sort" });
  return e
    .map((s) => [s, a?.transform ? a.transform(s) : s])
    .sort((s, d) => {
      for (let o = 0; o < t.length; o++) {
        let c = !1;
        const v = t[o].key,
          y = t[o].order ?? "asc";
        if (y === !1) continue;
        let i = ue(s[1], v),
          g = ue(d[1], v),
          p = s[0].raw,
          m = d[0].raw;
        if ((y === "desc" && (([i, g] = [g, i]), ([p, m] = [m, p])), a?.sortRawFunctions?.[v])) {
          const u = a.sortRawFunctions[v](p, m);
          if (u == null) continue;
          if (((c = !0), u)) return u;
        }
        if (a?.sortFunctions?.[v]) {
          const u = a.sortFunctions[v](i, g);
          if (u == null) continue;
          if (((c = !0), u)) return u;
        }
        if (
          !c &&
          (i instanceof Date && g instanceof Date && ((i = i.getTime()), (g = g.getTime())),
          ([i, g] = [i, g].map((u) => (u != null ? u.toString().toLocaleLowerCase() : u))),
          i !== g)
        )
          return re(i) && re(g)
            ? 0
            : re(i)
              ? -1
              : re(g)
                ? 1
                : !isNaN(i) && !isNaN(g)
                  ? Number(i) - Number(g)
                  : n.compare(i, g);
      }
      return 0;
    })
    .map((s) => {
      let [d] = s;
      return d;
    });
}
const et = A(
    {
      color: String,
      disableSort: Boolean,
      fixedHeader: Boolean,
      multiSort: Boolean,
      initialSortOrder: String,
      sortIcon: { type: E },
      sortAscIcon: { type: E, default: "$sortAsc" },
      sortDescIcon: { type: E, default: "$sortDesc" },
      headerProps: { type: Object },
      sticky: Boolean,
      ...fe(),
      ...Ie(),
      ...At(),
    },
    "VDataTableHeaders",
  ),
  Ae = U()({
    name: "VDataTableHeaders",
    props: et(),
    setup(e, t) {
      let { slots: l } = t;
      const { t: a } = le(),
        { toggleSort: n, sortBy: r, isSorted: s } = Ze(),
        { someSelected: d, allSelected: o, selectAll: c, showSelectAll: v } = ve(),
        { columns: y, headers: i } = ge(),
        { loaderClasses: g } = Lt(e);
      function p(h, f) {
        if (!(e.sticky || e.fixedHeader) && !h.fixed) return;
        const T = typeof h.fixed == "string" ? h.fixed : h.fixed ? "start" : "none";
        return {
          position: "sticky",
          left: T === "start" ? G(h.fixedOffset) : void 0,
          right: T === "end" ? G(h.fixedEndOffset) : void 0,
          top: e.sticky || e.fixedHeader ? `calc(var(--v-table-header-height) * ${f})` : void 0,
        };
      }
      function m(h, f) {
        h.key === "Enter" && !e.disableSort && n(f, h);
      }
      function u(h) {
        switch (r.value.find((T) => T.key === h.key)?.order) {
          case "asc":
            return e.sortAscIcon;
          case "desc":
            return e.sortDescIcon;
          default:
            return e.sortIcon || (e.initialSortOrder === "asc" ? e.sortAscIcon : e.sortDescIcon);
        }
      }
      const { backgroundColorClasses: D, backgroundColorStyles: b } = Rt(() => e.color),
        { displayClasses: I, mobile: C } = ce(e),
        P = k(() => ({
          headers: i.value,
          columns: y.value,
          toggleSort: n,
          isSorted: s,
          sortBy: r.value,
          someSelected: d.value,
          allSelected: o.value,
          selectAll: c,
          getSortIcon: u,
        })),
        N = k(() => ["v-data-table__th", { "v-data-table__th--sticky": e.sticky || e.fixedHeader }, I.value, g.value]),
        $ = (h) => {
          let { column: f, x: T, y: V } = h;
          const _ = f.key === "data-table-select" || f.key === "data-table-expand",
            L = f.key === "data-table-group" && f.width === 0 && !f.title,
            q = O(e.headerProps ?? {}, f.headerProps ?? {});
          return w(
            ae,
            O(
              {
                tag: "th",
                align: f.align,
                class: [
                  {
                    "v-data-table__th--sortable": f.sortable && !e.disableSort,
                    "v-data-table__th--sorted": s(f),
                    "v-data-table__th--fixed": f.fixed,
                  },
                  ...N.value,
                ],
                style: { width: G(f.width), minWidth: G(f.minWidth), maxWidth: G(f.maxWidth), ...p(f, V) },
                colspan: f.colspan,
                rowspan: f.rowspan,
                fixed: f.fixed,
                nowrap: f.nowrap,
                lastFixed: f.lastFixed,
                firstFixedEnd: f.firstFixedEnd,
                noPadding: _,
                empty: L,
                tabindex: f.sortable ? 0 : void 0,
                onClick: f.sortable ? (B) => n(f, B) : void 0,
                onKeydown: f.sortable ? (B) => m(B, f) : void 0,
              },
              q,
            ),
            {
              default: () => {
                const B = `header.${f.key}`,
                  j = {
                    column: f,
                    selectAll: c,
                    isSorted: s,
                    toggleSort: n,
                    sortBy: r.value,
                    someSelected: d.value,
                    allSelected: o.value,
                    getSortIcon: u,
                  };
                return l[B]
                  ? l[B](j)
                  : L
                    ? ""
                    : f.key === "data-table-select"
                      ? (l["header.data-table-select"]?.(j) ??
                        (v.value &&
                          w(
                            de,
                            {
                              color: e.color,
                              density: e.density,
                              modelValue: o.value,
                              indeterminate: d.value && !o.value,
                              "onUpdate:modelValue": c,
                            },
                            null,
                          )))
                      : S("div", { class: "v-data-table-header__content" }, [
                          S("span", null, [f.title]),
                          f.sortable &&
                            !e.disableSort &&
                            w(Ce, { key: "icon", class: "v-data-table-header__sort-icon", icon: u(f) }, null),
                          e.multiSort &&
                            s(f) &&
                            S(
                              "div",
                              {
                                key: "badge",
                                class: Q(["v-data-table-header__sort-badge", ...D.value]),
                                style: Ge(b.value),
                              },
                              [r.value.findIndex((ee) => ee.key === f.key) + 1],
                            ),
                        ]);
              },
            },
          );
        },
        x = () => {
          const h = k(() => y.value.filter((V) => V?.sortable && !e.disableSort)),
            f = y.value.find((V) => V.key === "data-table-select"),
            T = k({
              get: () =>
                h.value.filter((V) => {
                  let { key: _ } = V;
                  return r.value.some((L) => L.key === _);
                }),
              set: (V) => {
                const _ = te(V),
                  L = r.value.map((B) => B.key);
                (_.filter((B) => {
                  let { key: j } = B;
                  return !L.includes(j);
                }).forEach((B) => n(B)),
                  Pe(
                    () =>
                      (r.value = r.value.filter((B) => {
                        let { key: j } = B;
                        return _.some((ee) => ee.key === j);
                      })),
                  ));
              },
            });
          return w(ae, O({ tag: "th", class: [...N.value], colspan: i.value.length + 1 }, e.headerProps), {
            default: () => [
              S("div", { class: "v-data-table-header__content" }, [
                w(
                  Ne,
                  {
                    modelValue: T.value,
                    "onUpdate:modelValue": (V) => (T.value = V),
                    chips: !0,
                    color: e.color,
                    class: "v-data-table__td-sort-select",
                    clearable: !0,
                    density: "default",
                    items: h.value,
                    label: a("$vuetify.dataTable.sortBy"),
                    multiple: e.multiSort,
                    variant: "underlined",
                    returnObject: !0,
                    "onClick:clear": () => (r.value = []),
                  },
                  {
                    append: f
                      ? () =>
                          w(
                            de,
                            {
                              color: e.color,
                              density: "compact",
                              modelValue: o.value,
                              indeterminate: d.value && !o.value,
                              "onUpdate:modelValue": () => c(!o.value),
                            },
                            null,
                          )
                      : void 0,
                    chip: (V) => {
                      let { item: _ } = V;
                      return w(
                        $t,
                        {
                          onClick: _.raw.sortable ? () => n(_.raw, void 0, !0) : void 0,
                          onMousedown: (L) => {
                            (L.preventDefault(), L.stopPropagation());
                          },
                        },
                        {
                          default: () => [
                            _.title,
                            w(
                              Ce,
                              {
                                class: Q([
                                  "v-data-table__td-sort-icon",
                                  s(_.raw) && "v-data-table__td-sort-icon-active",
                                ]),
                                icon: u(_.raw),
                                size: "small",
                              },
                              null,
                            ),
                          ],
                        },
                      );
                    },
                  },
                ),
              ]),
            ],
          });
        };
      J(() =>
        C.value
          ? S("tr", null, [w(x, null, null)])
          : S(X, null, [
              l.headers
                ? l.headers(P.value)
                : i.value.map((h, f) => S("tr", null, [h.map((T, V) => w($, { column: T, x: V, y: f }, null))])),
              e.loading &&
                S("tr", { class: "v-data-table-progress" }, [
                  S("th", { colspan: y.value.length }, [
                    w(
                      Nt,
                      {
                        name: "v-data-table-progress",
                        absolute: !0,
                        active: !0,
                        color: typeof e.loading == "boolean" || e.loading === "true" ? e.color : e.loading,
                        indeterminate: !0,
                      },
                      { default: l.loader },
                    ),
                  ]),
                ]),
            ]),
      );
    },
  }),
  xa = A({ groupBy: { type: Array, default: () => [] } }, "DataTable-group"),
  tt = Symbol.for("vuetify:data-table-group");
function Sa(e) {
  return { groupBy: K(e, "groupBy") };
}
function Pa(e) {
  const { disableSort: t, groupBy: l, sortBy: a } = e,
    n = z(new Set()),
    r = k(() => l.value.map((v) => ({ ...v, order: v.order ?? !1 })).concat(t?.value ? [] : a.value));
  function s(v) {
    return n.value.has(v.id);
  }
  function d(v) {
    const y = new Set(n.value);
    (s(v) ? y.delete(v.id) : y.add(v.id), (n.value = y));
  }
  function o(v) {
    function y(i) {
      const g = [];
      for (const p of i.items) "type" in p && p.type === "group" ? g.push(...y(p)) : g.push(p);
      return [...new Set(g)];
    }
    return y({ items: v });
  }
  const c = { sortByWithGroups: r, toggleGroup: d, opened: n, groupBy: l, extractRows: o, isGroupOpen: s };
  return (Z(tt, c), c);
}
function at() {
  const e = Y(tt);
  if (!e) throw new Error("Missing group!");
  return e;
}
function wa(e, t) {
  if (!e.length) return [];
  const l = new Map();
  for (const a of e) {
    const n = ue(a.raw, t);
    (l.has(n) || l.set(n, []), l.get(n).push(a));
  }
  return l;
}
function lt(e, t) {
  let l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0,
    a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "root";
  if (!t.length) return [];
  const n = wa(e, t[0]),
    r = [],
    s = t.slice(1);
  return (
    n.forEach((d, o) => {
      const c = t[0],
        v = `${a}_${c}_${o}`;
      r.push({ depth: l, id: v, key: c, value: o, items: s.length ? lt(d, s, l + 1, v) : d, type: "group" });
    }),
    r
  );
}
function nt(e, t, l) {
  const a = [];
  for (const n of e)
    "type" in n && n.type === "group"
      ? (n.value != null && a.push(n),
        (t.has(n.id) || n.value == null) &&
          (a.push(...nt(n.items, t, l)), l && a.push({ ...n, type: "group-summary" })))
      : a.push(n);
  return a;
}
function ka(e, t, l, a) {
  const n = k(() =>
      t.value.length
        ? lt(
            M(e),
            t.value.map((s) => s.key),
          )
        : [],
    ),
    r = k(() => (t.value.length ? nt(n.value, l.value, M(a)) : M(e)));
  return { groups: n, flatItems: r };
}
const rt = A(
    {
      item: { type: Object, required: !0 },
      groupCollapseIcon: { type: E, default: "$tableGroupCollapse" },
      groupExpandIcon: { type: E, default: "$tableGroupExpand" },
      ...fe(),
    },
    "VDataTableGroupHeaderRow",
  ),
  Ia = U()({
    name: "VDataTableGroupHeaderRow",
    props: rt(),
    setup(e, t) {
      let { slots: l } = t;
      const { isGroupOpen: a, toggleGroup: n, extractRows: r } = at(),
        { isSelected: s, isSomeSelected: d, select: o } = ve(),
        { columns: c } = ge(),
        v = k(() => r([e.item])),
        y = F(() => c.value.length - (c.value.some((i) => i.key === "data-table-select") ? 1 : 0));
      return () =>
        S(
          "tr",
          { class: "v-data-table-group-header-row", style: { "--v-data-table-group-header-row-depth": e.item.depth } },
          [
            c.value.map((i) => {
              if (i.key === "data-table-group") {
                const g = a(e.item) ? e.groupCollapseIcon : e.groupExpandIcon,
                  p = () => n(e.item);
                return (
                  l["data-table-group"]?.({ item: e.item, count: v.value.length, props: { icon: g, onClick: p } }) ??
                  w(
                    ae,
                    { class: "v-data-table-group-header-row__column", colspan: y.value },
                    {
                      default: () => [
                        w(W, { size: "small", variant: "text", icon: g, onClick: p }, null),
                        S("span", null, [e.item.value]),
                        S("span", null, [_e("("), v.value.length, _e(")")]),
                      ],
                    },
                  )
                );
              } else if (i.key === "data-table-select") {
                const g = v.value.filter((D) => D.selectable),
                  p = g.length > 0 && s(g),
                  m = d(g) && !p,
                  u = (D) => o(g, D);
                return (
                  l["data-table-select"]?.({ props: { modelValue: p, indeterminate: m, "onUpdate:modelValue": u } }) ??
                  w(
                    ae,
                    { class: "v-data-table__td--select-row", noPadding: !0 },
                    {
                      default: () => [
                        w(
                          de,
                          {
                            density: e.density,
                            disabled: g.length === 0,
                            modelValue: p,
                            indeterminate: m,
                            "onUpdate:modelValue": u,
                          },
                          null,
                        ),
                      ],
                    },
                  )
                );
              }
              return "";
            }),
          ],
        );
    },
  }),
  Va = A(
    { expandOnClick: Boolean, showExpand: Boolean, expanded: { type: Array, default: () => [] } },
    "DataTable-expand",
  ),
  st = Symbol.for("vuetify:datatable:expanded");
function Da(e) {
  const t = F(() => e.expandOnClick),
    l = K(
      e,
      "expanded",
      e.expanded,
      (d) => new Set(d),
      (d) => [...d.values()],
    );
  function a(d, o) {
    const c = new Set(l.value),
      v = ie(d.value);
    if (o) c.add(v);
    else {
      const y = [...l.value].find((i) => ie(i) === v);
      c.delete(y);
    }
    l.value = c;
  }
  function n(d) {
    const o = ie(d.value);
    return [...l.value].some((c) => ie(c) === o);
  }
  function r(d) {
    a(d, !n(d));
  }
  const s = { expand: a, expanded: l, expandOnClick: t, isExpanded: n, toggleExpand: r };
  return (Z(st, s), s);
}
function ot() {
  const e = Y(st);
  if (!e) throw new Error("foo");
  return e;
}
const it = A(
    {
      color: String,
      index: Number,
      item: Object,
      cellProps: [Object, Function],
      collapseIcon: { type: E, default: "$collapse" },
      expandIcon: { type: E, default: "$expand" },
      onClick: pe(),
      onContextmenu: pe(),
      onDblclick: pe(),
      ...fe(),
      ...Ie(),
    },
    "VDataTableRow",
  ),
  Ta = U()({
    name: "VDataTableRow",
    props: it(),
    setup(e, t) {
      let { slots: l } = t;
      const { displayClasses: a, mobile: n } = ce(e, "v-data-table__tr"),
        { isSelected: r, toggleSelect: s, someSelected: d, allSelected: o, selectAll: c } = ve(),
        { isExpanded: v, toggleExpand: y } = ot(),
        { toggleSort: i, sortBy: g, isSorted: p } = Ze(),
        { columns: m } = ge();
      J(() =>
        S(
          "tr",
          {
            class: Q([
              "v-data-table__tr",
              { "v-data-table__tr--clickable": !!(e.onClick || e.onContextmenu || e.onDblclick) },
              a.value,
            ]),
            onClick: e.onClick,
            onContextmenu: e.onContextmenu,
            onDblclick: e.onDblclick,
          },
          [
            e.item &&
              m.value.map((u, D) => {
                const b = e.item,
                  I = `item.${u.key}`,
                  C = `header.${u.key}`,
                  P = {
                    index: e.index,
                    item: b.raw,
                    internalItem: b,
                    value: ue(b.columns, u.key),
                    column: u,
                    isSelected: r,
                    toggleSelect: s,
                    isExpanded: v,
                    toggleExpand: y,
                  },
                  N = {
                    column: u,
                    selectAll: c,
                    isSorted: p,
                    toggleSort: i,
                    sortBy: g.value,
                    someSelected: d.value,
                    allSelected: o.value,
                    getSortIcon: () => "",
                  },
                  $ =
                    typeof e.cellProps == "function"
                      ? e.cellProps({
                          index: P.index,
                          item: P.item,
                          internalItem: P.internalItem,
                          value: P.value,
                          column: u,
                        })
                      : e.cellProps,
                  x =
                    typeof u.cellProps == "function"
                      ? u.cellProps({ index: P.index, item: P.item, internalItem: P.internalItem, value: P.value })
                      : u.cellProps,
                  h = u.key === "data-table-select" || u.key === "data-table-expand",
                  f = u.key === "data-table-group" && u.width === 0 && !u.title;
                return w(
                  ae,
                  O(
                    {
                      align: u.align,
                      indent: u.indent,
                      class: {
                        "v-data-table__td--expanded-row": u.key === "data-table-expand",
                        "v-data-table__td--select-row": u.key === "data-table-select",
                      },
                      fixed: u.fixed,
                      fixedOffset: u.fixedOffset,
                      fixedEndOffset: u.fixedEndOffset,
                      lastFixed: u.lastFixed,
                      firstFixedEnd: u.firstFixedEnd,
                      maxWidth: n.value ? void 0 : u.maxWidth,
                      noPadding: h,
                      empty: f,
                      nowrap: u.nowrap,
                      width: n.value ? void 0 : u.width,
                    },
                    $,
                    x,
                  ),
                  {
                    default: () => {
                      if (u.key === "data-table-select")
                        return (
                          l["item.data-table-select"]?.({
                            ...P,
                            props: {
                              color: e.color,
                              disabled: !b.selectable,
                              modelValue: r([b]),
                              onClick: se(() => s(b), ["stop"]),
                            },
                          }) ??
                          w(
                            de,
                            {
                              color: e.color,
                              disabled: !b.selectable,
                              density: e.density,
                              modelValue: r([b]),
                              onClick: se((V) => s(b, e.index, V), ["stop"]),
                            },
                            null,
                          )
                        );
                      if (u.key === "data-table-expand")
                        return (
                          l["item.data-table-expand"]?.({
                            ...P,
                            props: {
                              icon: v(b) ? e.collapseIcon : e.expandIcon,
                              size: "small",
                              variant: "text",
                              onClick: se(() => y(b), ["stop"]),
                            },
                          }) ??
                          w(
                            W,
                            {
                              icon: v(b) ? e.collapseIcon : e.expandIcon,
                              size: "small",
                              variant: "text",
                              onClick: se(() => y(b), ["stop"]),
                            },
                            null,
                          )
                        );
                      if (l[I] && !n.value) return l[I](P);
                      const T = Kt(P.value);
                      return n.value
                        ? S(X, null, [
                            S("div", { class: "v-data-table__td-title" }, [l[C]?.(N) ?? u.title]),
                            S("div", { class: "v-data-table__td-value" }, [l[I]?.(P) ?? T]),
                          ])
                        : T;
                    },
                  },
                );
              }),
          ],
        ),
      );
    },
  }),
  ut = A(
    {
      color: String,
      loading: [Boolean, String],
      loadingText: { type: String, default: "$vuetify.dataIterator.loadingText" },
      hideNoData: Boolean,
      items: { type: Array, default: () => [] },
      noDataText: { type: String, default: "$vuetify.noDataText" },
      rowProps: [Object, Function],
      cellProps: [Object, Function],
      ...Se(it(), ["collapseIcon", "expandIcon", "density"]),
      ...Se(rt(), ["groupCollapseIcon", "groupExpandIcon", "density"]),
      ...Ie(),
    },
    "VDataTableRows",
  ),
  Le = U()({
    name: "VDataTableRows",
    inheritAttrs: !1,
    props: ut(),
    setup(e, t) {
      let { attrs: l, slots: a } = t;
      const { columns: n } = ge(),
        { expandOnClick: r, toggleExpand: s, isExpanded: d } = ot(),
        { isSelected: o, toggleSelect: c } = ve(),
        { toggleGroup: v, isGroupOpen: y } = at(),
        { t: i } = le(),
        { mobile: g } = ce(e);
      return (
        J(() => {
          const p = Se(e, ["groupCollapseIcon", "groupExpandIcon", "density"]);
          return e.loading && (!e.items.length || a.loading)
            ? S("tr", { class: "v-data-table-rows-loading", key: "loading" }, [
                S("td", { colspan: n.value.length }, [a.loading?.() ?? i(e.loadingText)]),
              ])
            : !e.loading && !e.items.length && !e.hideNoData
              ? S("tr", { class: "v-data-table-rows-no-data", key: "no-data" }, [
                  S("td", { colspan: n.value.length }, [a["no-data"]?.() ?? i(e.noDataText)]),
                ])
              : S(X, null, [
                  e.items.map((m, u) => {
                    if (m.type === "group") {
                      const I = {
                        index: u,
                        item: m,
                        columns: n.value,
                        isExpanded: d,
                        toggleExpand: s,
                        isSelected: o,
                        toggleSelect: c,
                        toggleGroup: v,
                        isGroupOpen: y,
                      };
                      return a["group-header"]
                        ? a["group-header"](I)
                        : w(
                            Ia,
                            O(
                              { key: `group-header_${m.id}`, item: m },
                              Be(l, ":groupHeader", () => I),
                              p,
                            ),
                            a,
                          );
                    }
                    if (m.type === "group-summary") {
                      const I = { index: u, item: m, columns: n.value, toggleGroup: v };
                      return a["group-summary"]?.(I) ?? "";
                    }
                    const D = {
                        index: m.virtualIndex ?? u,
                        item: m.raw,
                        internalItem: m,
                        columns: n.value,
                        isExpanded: d,
                        toggleExpand: s,
                        isSelected: o,
                        toggleSelect: c,
                      },
                      b = {
                        ...D,
                        props: O(
                          {
                            key: `item_${m.key ?? m.index}`,
                            onClick: r.value
                              ? () => {
                                  s(m);
                                }
                              : void 0,
                            index: u,
                            item: m,
                            color: e.color,
                            cellProps: e.cellProps,
                            collapseIcon: e.collapseIcon,
                            expandIcon: e.expandIcon,
                            density: e.density,
                            mobile: g.value,
                          },
                          Be(l, ":row", () => D),
                          typeof e.rowProps == "function"
                            ? e.rowProps({ item: D.item, index: D.index, internalItem: D.internalItem })
                            : e.rowProps,
                        ),
                      };
                    return S(X, { key: b.props.key }, [
                      a.item ? a.item(b) : w(Ta, b.props, a),
                      d(m) && a["expanded-row"]?.(D),
                    ]);
                  }),
                ]);
        }),
        {}
      );
    },
  }),
  Ca = A(
    {
      items: { type: Array, default: () => [] },
      itemValue: { type: [String, Array, Function], default: "id" },
      itemSelectable: { type: [String, Array, Function], default: null },
      rowProps: [Object, Function],
      cellProps: [Object, Function],
      returnObject: Boolean,
    },
    "DataTable-items",
  );
function _a(e, t, l, a) {
  const n = e.returnObject ? t : oe(t, e.itemValue),
    r = oe(t, e.itemSelectable, !0),
    s = a.reduce((d, o) => (o.key != null && (d[o.key] = oe(t, o.value)), d), {});
  return {
    type: "item",
    key: e.returnObject ? oe(t, e.itemValue) : n,
    index: l,
    value: n,
    selectable: r,
    columns: s,
    raw: t,
  };
}
function Fa(e, t, l) {
  return t.map((a, n) => _a(e, a, n, l));
}
function Ba(e, t) {
  return { items: k(() => Fa(e, e.items, t.value)) };
}
function Oa(e) {
  let { page: t, itemsPerPage: l, sortBy: a, groupBy: n, search: r } = e;
  const s = Re("VDataTable"),
    d = () => ({ page: t.value, itemsPerPage: l.value, sortBy: a.value, groupBy: n.value, search: r.value });
  let o = null;
  Ve(
    d,
    (c) => {
      $e(o, c) || (o && o.search !== c.search && (t.value = 1), s.emit("update:options", c), (o = c));
    },
    { deep: !0, immediate: !0 },
  );
}
const Ea = A(
    {
      ...ut(),
      hideDefaultBody: Boolean,
      hideDefaultFooter: Boolean,
      hideDefaultHeader: Boolean,
      width: [String, Number],
      search: String,
      ...Va(),
      ...xa(),
      ...la(),
      ...Ca(),
      ...fa(),
      ...va(),
      ...ke(et(), ["multiSort", "initialSortOrder"]),
      ...qt(),
    },
    "DataTable",
  ),
  Aa = A({ ...Jt(), ...Ea(), ...Ht(), ...je() }, "VDataTable"),
  $a = U()({
    name: "VDataTable",
    props: Aa(),
    emits: {
      "update:modelValue": (e) => !0,
      "update:page": (e) => !0,
      "update:itemsPerPage": (e) => !0,
      "update:sortBy": (e) => !0,
      "update:options": (e) => !0,
      "update:groupBy": (e) => !0,
      "update:expanded": (e) => !0,
      "update:currentItems": (e) => !0,
    },
    setup(e, t) {
      let { attrs: l, slots: a } = t;
      const { groupBy: n } = Sa(e),
        { initialSortOrder: r, sortBy: s, multiSort: d, mustSort: o } = ma(e),
        { page: c, itemsPerPage: v } = Yt(e),
        { disableSort: y } = Ut(e),
        {
          columns: i,
          headers: g,
          sortFunctions: p,
          sortRawFunctions: m,
          filterFunctions: u,
        } = ua(e, { groupBy: n, showSelect: F(() => e.showSelect), showExpand: F(() => e.showExpand) }),
        { items: D } = Ba(e, i),
        b = F(() => e.search),
        { filteredItems: I } = Gt(e, D, b, { transform: (R) => R.columns, customKeyFilter: u }),
        { toggleSort: C } = ya({ initialSortOrder: r, sortBy: s, multiSort: d, mustSort: o, page: c }),
        {
          sortByWithGroups: P,
          opened: N,
          extractRows: $,
          isGroupOpen: x,
          toggleGroup: h,
        } = Pa({ groupBy: n, sortBy: s, disableSort: y }),
        { sortedItems: f } = ha(e, I, P, {
          transform: (R) => ({ ...R.raw, ...R.columns }),
          sortFunctions: p,
          sortRawFunctions: m,
        }),
        T = k(() => (e.pageBy === "auto" ? (e.groupBy.length ? "group" : "item") : e.pageBy)),
        {
          pageCount: V,
          setItemsPerPage: _,
          paginatedItems: L,
        } = aa({
          pageBy: T,
          sortedItems: f,
          paginate: (R) => {
            const me = k(() => M(R).length),
              {
                startIndex: be,
                stopIndex: ye,
                pageCount: mt,
                setItemsPerPage: bt,
              } = Zt({ page: c, itemsPerPage: v, itemsLength: me }),
              { paginatedItems: yt } = ta({ items: R, startIndex: be, stopIndex: ye, itemsPerPage: v });
            return { paginatedItems: yt, pageCount: mt, setItemsPerPage: bt };
          },
          group: (R) => ka(R, n, N, () => !!a["group-summary"]),
        }),
        q = k(() => $(L.value)),
        {
          isSelected: B,
          select: j,
          selectAll: ee,
          toggleSelect: dt,
          someSelected: ct,
          allSelected: ft,
        } = ga(e, { allItems: D, currentPage: q }),
        { isExpanded: gt, toggleExpand: vt } = Da(e);
      (Oa({ page: c, itemsPerPage: v, sortBy: s, groupBy: n, search: b }),
        xe({
          VDataTableRows: {
            hideNoData: F(() => e.hideNoData),
            noDataText: F(() => e.noDataText),
            loading: F(() => e.loading),
            loadingText: F(() => e.loadingText),
          },
        }));
      const H = k(() => ({
        page: c.value,
        itemsPerPage: v.value,
        sortBy: s.value,
        pageCount: V.value,
        toggleSort: C,
        setItemsPerPage: _,
        someSelected: ct.value,
        allSelected: ft.value,
        isSelected: B,
        select: j,
        selectAll: ee,
        toggleSelect: dt,
        isExpanded: gt,
        toggleExpand: vt,
        isGroupOpen: x,
        toggleGroup: h,
        items: q.value.map((R) => R.raw),
        internalItems: q.value,
        groupedItems: L.value,
        columns: i.value,
        headers: g.value,
      }));
      return (
        J(() => {
          const R = Ee.filterProps(e),
            me = Ae.filterProps(ke(e, ["multiSort"])),
            be = Le.filterProps(e),
            ye = Fe.filterProps(e);
          return w(
            Fe,
            O(
              {
                class: [
                  "v-data-table",
                  { "v-data-table--show-select": e.showSelect, "v-data-table--loading": e.loading },
                  e.class,
                ],
                style: e.style,
              },
              ye,
              { fixedHeader: e.fixedHeader || e.sticky },
            ),
            {
              top: () => a.top?.(H.value),
              default: () =>
                a.default
                  ? a.default(H.value)
                  : S(X, null, [
                      a.colgroup?.(H.value),
                      !e.hideDefaultHeader &&
                        S("thead", { key: "thead" }, [w(Ae, O(me, { multiSort: !!e.multiSort }), a)]),
                      a.thead?.(H.value),
                      !e.hideDefaultBody &&
                        S("tbody", null, [
                          a["body.prepend"]?.(H.value),
                          a.body ? a.body(H.value) : w(Le, O(l, be, { items: L.value }), a),
                          a["body.append"]?.(H.value),
                        ]),
                      a.tbody?.(H.value),
                      a.tfoot?.(H.value),
                    ]),
              bottom: () =>
                a.bottom
                  ? a.bottom(H.value)
                  : !e.hideDefaultFooter && S(X, null, [w(Mt, null, null), w(Ee, R, { prepend: a["footer.prepend"] })]),
            },
          );
        }),
        {}
      );
    },
  });
export { $a as V };
