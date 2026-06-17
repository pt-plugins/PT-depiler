import {
  aL as D,
  ax as M,
  br as q,
  c1 as J,
  bS as Q,
  bL as Z,
  I as H,
  aC as p,
  bY as $,
  P as ee,
  ag as I,
  bp as O,
  b7 as te,
  b6 as ne,
  aO as z,
  c as L,
  bM as oe,
  c7 as se,
  bQ as ae,
  M as ie,
  aZ as le,
  aX as re,
  cd as ue,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import {
  ch as ce,
  b2 as T,
  cl as F,
  U as E,
  b5 as j,
  b3 as x,
  br as W,
  bJ as A,
  D as h,
  H as g,
  bY as V,
  bo as ve,
  as as de,
} from "../packages/site/index-COeZNva1.js";
const fe = (e) => {
  const { touchstartX: n, touchendX: t, touchstartY: o, touchendY: i } = e,
    u = 0.5,
    s = 16;
  ((e.offsetX = t - n),
    (e.offsetY = i - o),
    Math.abs(e.offsetY) < u * Math.abs(e.offsetX) &&
      (e.left && t < n - s && e.left(e), e.right && t > n + s && e.right(e)),
    Math.abs(e.offsetX) < u * Math.abs(e.offsetY) && (e.up && i < o - s && e.up(e), e.down && i > o + s && e.down(e)));
};
function he(e, n) {
  const t = e.changedTouches[0];
  ((n.touchstartX = t.clientX), (n.touchstartY = t.clientY), n.start?.({ originalEvent: e, ...n }));
}
function me(e, n) {
  const t = e.changedTouches[0];
  ((n.touchendX = t.clientX), (n.touchendY = t.clientY), n.end?.({ originalEvent: e, ...n }), fe(n));
}
function we(e, n) {
  const t = e.changedTouches[0];
  ((n.touchmoveX = t.clientX), (n.touchmoveY = t.clientY), n.move?.({ originalEvent: e, ...n }));
}
function ge() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const n = {
    touchstartX: 0,
    touchstartY: 0,
    touchendX: 0,
    touchendY: 0,
    touchmoveX: 0,
    touchmoveY: 0,
    offsetX: 0,
    offsetY: 0,
    left: e.left,
    right: e.right,
    up: e.up,
    down: e.down,
    start: e.start,
    move: e.move,
    end: e.end,
  };
  return { touchstart: (t) => he(t, n), touchend: (t) => me(t, n), touchmove: (t) => we(t, n) };
}
function ye(e, n) {
  const t = n.value,
    o = t?.parent ? e.parentElement : e,
    i = t?.options ?? { passive: !0 },
    u = n.instance?.$.uid;
  if (!o || u === void 0) return;
  const s = ge(n.value);
  ((o._touchHandlers = o._touchHandlers ?? Object.create(null)),
    (o._touchHandlers[u] = s),
    D(s).forEach((v) => {
      o.addEventListener(v, s[v], i);
    }));
}
function be(e, n) {
  const t = n.value?.parent ? e.parentElement : e,
    o = n.instance?.$.uid;
  if (!t?._touchHandlers || o === void 0) return;
  const i = t._touchHandlers[o];
  (D(i).forEach((u) => {
    t.removeEventListener(u, i[u]);
  }),
    delete t._touchHandlers[o]);
}
const R = { mounted: ye, unmounted: be },
  G = Symbol.for("vuetify:v-window"),
  U = Symbol.for("vuetify:v-window-group"),
  Se = O(
    {
      continuous: Boolean,
      nextIcon: { type: [Boolean, String, Function, Object], default: "$next" },
      prevIcon: { type: [Boolean, String, Function, Object], default: "$prev" },
      reverse: Boolean,
      showArrows: { type: [Boolean, String], validator: (e) => typeof e == "boolean" || e === "hover" },
      verticalArrows: [Boolean, String],
      touch: { type: [Object, Boolean], default: void 0 },
      direction: { type: String, default: "horizontal" },
      modelValue: null,
      disabled: Boolean,
      selectedClass: { type: String, default: "v-window-item--active" },
      mandatory: { type: [Boolean, String], default: "force" },
      crossfade: Boolean,
      transitionDuration: Number,
      ...z(),
      ...ne(),
      ...te(),
    },
    "VWindow",
  ),
  Ce = M()({
    name: "VWindow",
    directives: { vTouch: R },
    props: Se(),
    emits: { "update:modelValue": (e) => !0 },
    setup(e, n) {
      let { slots: t } = n;
      const { themeClasses: o } = q(e),
        { isRtl: i } = J(),
        { t: u } = Q(),
        s = Z(e, U),
        v = W(),
        d = h(() => (i.value ? !e.reverse : e.reverse)),
        c = A(!1),
        y = h(() => {
          if (e.crossfade) return "v-window-crossfade-transition";
          const a = e.direction === "vertical" ? "y" : "x",
            l = (d.value ? !c.value : c.value) ? "-reverse" : "";
          return `v-window-${a}${l}-transition`;
        }),
        B = A(0),
        b = W(void 0),
        w = h(() => s.items.value.findIndex((a) => s.selected.value.includes(a.id)));
      (ce(
        w,
        (a, r) => {
          let l;
          const m = { left: 0, top: 0 };
          H && r >= 0 && ((l = p(v.value)), (m.left = l?.scrollLeft), (m.top = l?.scrollTop));
          const X = s.items.value.length,
            P = X - 1;
          (X <= 2
            ? (c.value = a < r)
            : a === P && r === 0
              ? (c.value = !1)
              : a === 0 && r === P
                ? (c.value = !0)
                : (c.value = a < r),
            T(() => {
              if (!H || !l) return;
              (l.scrollTop !== m.top && l.scrollTo({ ...m, behavior: "instant" }),
                requestAnimationFrame(() => {
                  if (!l) return;
                  l.scrollTop !== m.top && l.scrollTo({ ...m, behavior: "instant" });
                }));
            }));
        },
        { flush: "sync" },
      ),
        ve(G, { transition: y, isReversed: c, transitionCount: B, transitionHeight: b, rootRef: v }));
      const f = V(() => e.continuous || w.value !== 0),
        Y = V(() => e.continuous || w.value !== s.items.value.length - 1);
      function _() {
        f.value && s.prev();
      }
      function C() {
        Y.value && s.next();
      }
      const k = h(() => {
          const a = [],
            r = {
              icon: i.value ? e.nextIcon : e.prevIcon,
              class: `v-window__${d.value ? "right" : "left"}`,
              onClick: s.prev,
              "aria-label": u("$vuetify.carousel.prev"),
            };
          a.push(f.value ? (t.prev ? t.prev({ props: r }) : E(L, r, null)) : g("div", null, null));
          const l = {
            icon: i.value ? e.prevIcon : e.nextIcon,
            class: `v-window__${d.value ? "left" : "right"}`,
            onClick: s.next,
            "aria-label": u("$vuetify.carousel.next"),
          };
          return (a.push(Y.value ? (t.next ? t.next({ props: l }) : E(L, l, null)) : g("div", null, null)), a);
        }),
        N = h(() =>
          e.touch === !1
            ? e.touch
            : {
                ...{
                  left: () => {
                    d.value ? _() : C();
                  },
                  right: () => {
                    d.value ? C() : _();
                  },
                  start: (r) => {
                    let { originalEvent: l } = r;
                    l.stopPropagation();
                  },
                },
                ...(e.touch === !0 ? {} : e.touch),
              },
        );
      function K(a) {
        (((e.direction === "horizontal" && a.key === "ArrowLeft") ||
          (e.direction === "vertical" && a.key === "ArrowUp")) &&
          (a.preventDefault(),
          _(),
          T(() => {
            f.value ? S(0) : S(1);
          })),
          ((e.direction === "horizontal" && a.key === "ArrowRight") ||
            (e.direction === "vertical" && a.key === "ArrowDown")) &&
            (a.preventDefault(),
            C(),
            T(() => {
              Y.value ? S(1) : S(0);
            })));
      }
      function S(a) {
        const r = k.value[a];
        if (!r) return;
        (Array.isArray(r) ? r[0] : r).el?.focus();
      }
      return (
        $(() =>
          F(
            E(
              e.tag,
              {
                ref: v,
                class: x([
                  "v-window",
                  {
                    "v-window--show-arrows-on-hover": e.showArrows === "hover",
                    "v-window--vertical-arrows": !!e.verticalArrows,
                    "v-window--crossfade": !!e.crossfade,
                  },
                  o.value,
                  e.class,
                ]),
                style: j([e.style, { "--v-window-transition-duration": ee() ? null : I(e.transitionDuration, "ms") }]),
              },
              {
                default: () => [
                  g("div", { class: "v-window__container", style: { height: b.value } }, [
                    t.default?.({ group: s }),
                    e.showArrows !== !1 &&
                      g(
                        "div",
                        {
                          class: x([
                            "v-window__controls",
                            { "v-window__controls--left": e.verticalArrows === "left" || e.verticalArrows === !0 },
                            { "v-window__controls--right": e.verticalArrows === "right" },
                          ]),
                          onKeydown: K,
                        },
                        [k.value],
                      ),
                  ]),
                  t.additional?.({ group: s }),
                ],
              },
            ),
            [[R, N.value]],
          ),
        ),
        { group: s }
      );
    },
  }),
  Te = O(
    {
      reverseTransition: { type: [Boolean, String], default: void 0 },
      transition: { type: [Boolean, String], default: void 0 },
      ...z(),
      ...re(),
      ...le(),
    },
    "VWindowItem",
  ),
  Ie = M()({
    name: "VWindowItem",
    directives: { vTouch: R },
    props: Te(),
    emits: { "group:selected": (e) => !0 },
    setup(e, n) {
      let { slots: t } = n;
      const o = de(G),
        i = oe(e, U),
        { isBooted: u } = se();
      if (!o || !i) throw new Error("[Vuetify] VWindowItem must be used inside VWindow");
      const s = A(!1),
        v = h(() => u.value && (o.isReversed.value ? e.reverseTransition !== !1 : e.transition !== !1));
      function d() {
        !s.value ||
          !o ||
          ((s.value = !1),
          o.transitionCount.value > 0 &&
            ((o.transitionCount.value -= 1), o.transitionCount.value === 0 && (o.transitionHeight.value = void 0)));
      }
      function c() {
        s.value ||
          !o ||
          ((s.value = !0),
          o.transitionCount.value === 0 && (o.transitionHeight.value = I(o.rootRef.value?.clientHeight)),
          (o.transitionCount.value += 1));
      }
      function y() {
        d();
      }
      function B(f) {
        s.value &&
          T(() => {
            !v.value || !s.value || !o || (o.transitionHeight.value = I(f.clientHeight));
          });
      }
      const b = h(() => {
          const f = o.isReversed.value ? e.reverseTransition : e.transition;
          return v.value
            ? {
                name: typeof f != "string" ? o.transition.value : f,
                onBeforeEnter: c,
                onAfterEnter: d,
                onEnterCancelled: y,
                onBeforeLeave: c,
                onAfterLeave: d,
                onLeaveCancelled: y,
                onEnter: B,
              }
            : !1;
        }),
        { hasContent: w } = ae(e, i.isSelected);
      return (
        $(() =>
          E(
            ie,
            { transition: b.value, disabled: !u.value },
            {
              default: () => [
                F(
                  g("div", { class: x(["v-window-item", i.selectedClass.value, e.class]), style: j(e.style) }, [
                    w.value && t.default?.(),
                  ]),
                  [[ue, i.isSelected.value]],
                ),
              ],
            },
          ),
        ),
        { groupItem: i }
      );
    },
  });
export { Ce as V, Ie as a, Se as b, Te as m };
