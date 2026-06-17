import {
  ax as Te,
  bS as Ee,
  bP as Be,
  c9 as Le,
  bO as _e,
  bX as q,
  bK as Ke,
  bG as Oe,
  bU as Ue,
  bI as Ne,
  I as ze,
  bY as $e,
  a3 as W,
  av as He,
  ac as X,
  bj as Z,
  an as Ge,
  bp as qe,
  bm as Je,
  bh as Ye,
  b2 as je,
  aU as Qe,
  cg as We,
  x as ee,
  bl as Xe,
  H as Ze,
  Z as el,
  B as ll,
  C as le,
  a6 as al,
  t as tl,
  G as ul,
  aD as nl,
  k as ol,
  V as sl,
  l as ae,
  ar as il,
  r as rl,
  c4 as cl,
  bJ as vl,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import {
  ch as O,
  b2 as te,
  U as f,
  b0 as V,
  bJ as w,
  D as k,
  br as F,
  H as C,
  F as J,
  b5 as dl,
  b3 as fl,
  Q as ml,
  bY as pl,
} from "../packages/site/index-COeZNva1.js";
const hl = qe(
    {
      autoSelectFirst: { type: [Boolean, String] },
      clearOnSelect: Boolean,
      search: String,
      ...Qe({ filterKeys: ["title"] }),
      ...je(),
      ...Je(Ye({ modelValue: null, role: "combobox" }), ["validationValue", "dirty"]),
    },
    "VAutocomplete",
  ),
  yl = Te()({
    name: "VAutocomplete",
    props: hl(),
    emits: {
      "update:focused": (l) => !0,
      "update:search": (l) => !0,
      "update:modelValue": (l) => !0,
      "update:menu": (l) => !0,
    },
    setup(l, ue) {
      let { slots: n } = ue;
      const { t: ne } = Ee(),
        m = F(),
        h = w(!1),
        g = w(!0),
        U = w(!1),
        E = F(),
        N = F(),
        o = w(-1),
        x = w(null),
        { items: z, transformIn: oe, transformOut: se } = Be(l),
        { textColorClasses: ie, textColorStyles: re } = Le(() => m.value?.color),
        { InputIcon: ce } = _e(l),
        i = q(l, "search", ""),
        a = q(
          l,
          "modelValue",
          [],
          (e) => oe(e === null ? [null] : We(e)),
          (e) => {
            const t = se(e);
            return l.multiple ? t : (t[0] ?? null);
          },
        ),
        ve = k(() =>
          typeof l.counterValue == "function"
            ? l.counterValue(a.value)
            : typeof l.counterValue == "number"
              ? l.counterValue
              : a.value.length,
        ),
        I = Ke(l),
        { filteredItems: B, getMatches: de } = Oe(l, z, () => x.value ?? (g.value ? "" : i.value)),
        b = k(() =>
          l.hideSelected && x.value === null
            ? B.value.filter((e) => !a.value.some((t) => t.value === e.value))
            : B.value,
        ),
        Y = pl(() => l.closableChips && !I.isReadonly.value && !I.isDisabled.value),
        L = k(() => !!(l.chips || n.chip)),
        R = k(() => L.value || !!n.selection),
        fe = k(() => a.value.map((e) => e.props.value)),
        D = k(() => b.value.find((e) => e.type === "item" && !e.props.disabled)),
        $ = k(
          () =>
            (l.autoSelectFirst === !0 || (l.autoSelectFirst === "exact" && i.value === D.value?.title)) &&
            b.value.length > 0 &&
            !g.value &&
            !U.value,
        ),
        _ = k(() => (l.hideNoData && !b.value.length) || I.isReadonly.value || I.isDisabled.value),
        H = q(l, "menu"),
        r = k({
          get: () => H.value,
          set: (e) => {
            (H.value && !e && E.value?.ΨopenChildren.size) || (e && _.value) || (H.value = e);
          },
        }),
        { menuId: me, ariaExpanded: pe, ariaControls: he } = Ue(l, r),
        P = F(),
        j = F(),
        Q = F(),
        ge = cl(P, m),
        be = vl(
          r,
          () => E.value?.contentEl,
          () => m.value?.controlRef,
        ),
        { onTabKeydown: ye } = Ne({
          groups: [
            { type: "element", contentRef: j },
            { type: "list", contentRef: P, displayItemsCount: () => b.value.length },
            { type: "element", contentRef: Q },
          ],
          onLeave: () => {
            ((r.value = !1), m.value?.focus());
          },
        });
      function Ve(e) {
        (l.openOnClear && (r.value = !0), (i.value = ""));
      }
      function ke() {
        _.value || (r.value = !0);
      }
      function Ce(e) {
        _.value || (h.value && (e.preventDefault(), e.stopPropagation()), (r.value = !r.value));
      }
      function Se(e) {
        (e.key === "Tab" && ye(e),
          P.value?.$el.contains(e.target) && (X(e) || e.key === "Backspace") && m.value?.focus());
      }
      function xe(e) {
        if (I.isReadonly.value) return;
        const t = m.value?.selectionStart,
          d = a.value.length;
        if (
          (["Enter", "ArrowDown", "ArrowUp"].includes(e.key) && e.preventDefault(),
          ["Enter", "ArrowDown"].includes(e.key) && (r.value = !0),
          ["Escape"].includes(e.key) && (r.value = !1),
          $.value &&
            ["Enter", "Tab"].includes(e.key) &&
            D.value &&
            !a.value.some((c) => {
              let { value: v } = c;
              return v === D.value.value;
            }) &&
            S(D.value),
          e.key === "ArrowDown" && $.value && P.value?.focus("next"),
          ["Backspace", "Delete"].includes(e.key))
        ) {
          if (!l.multiple && R.value && a.value.length > 0 && !i.value) return S(a.value[0], !1);
          if (~o.value) {
            e.preventDefault();
            const c = o.value;
            (S(a.value[o.value], !1), (o.value = c >= d - 1 ? d - 2 : c));
          } else e.key === "Backspace" && !i.value && (o.value = d - 1);
          return;
        }
        if (l.multiple)
          if (e.key === "ArrowLeft") {
            if (o.value < 0 && t && t > 0) return;
            const c = o.value > -1 ? o.value - 1 : d - 1;
            if (a.value[c]) o.value = c;
            else {
              const v = i.value?.length ?? null;
              ((o.value = -1), m.value?.setSelectionRange(v, v));
            }
          } else if (e.key === "ArrowRight") {
            if (o.value < 0) return;
            const c = o.value + 1;
            a.value[c] ? (o.value = c) : ((o.value = -1), m.value?.setSelectionRange(0, 0));
          } else ~o.value && X(e) && (o.value = -1);
      }
      function Ie(e) {
        if (Z(m.value, ":autofill") || Z(m.value, ":-webkit-autofill")) {
          const t = z.value.find((d) => d.title === e.target.value);
          t && S(t);
        }
      }
      function we() {
        l.eager && N.value?.calculateVisibleItems();
      }
      function Fe() {
        (h.value && ((g.value = !0), m.value?.focus()), (x.value = null));
      }
      function Re(e) {
        ((h.value = !0),
          setTimeout(() => {
            U.value = !0;
          }));
      }
      function De(e) {
        if (((U.value = !1), !m.value?.$el.contains(e.relatedTarget))) {
          if (be(e)) return;
          h.value = !1;
        }
      }
      function Pe(e) {
        (e == null || (e === "" && !l.multiple && !R.value)) && (a.value = []);
      }
      function Ae(e) {
        E.value?.contentEl?.contains(e.relatedTarget) && (h.value = !0);
      }
      const G = w(!1);
      function S(e) {
        let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
        if (!(!e || e.props.disabled))
          if (l.multiple) {
            const d = a.value.findIndex((v) => (l.valueComparator || Ge)(v.value, e.value)),
              c = t ?? !~d;
            if (~d) {
              const v = c ? [...a.value, e] : [...a.value];
              (v.splice(d, 1), (a.value = v));
            } else c && (a.value = [...a.value, e]);
            l.clearOnSelect && (i.value = "");
          } else {
            const d = t !== !1;
            ((a.value = d ? [e] : []),
              (x.value = g.value ? "" : (i.value ?? "")),
              (i.value = d && !R.value ? e.title : ""),
              te(() => {
                ((r.value = !1), (g.value = !0));
              }));
          }
      }
      return (
        O(h, (e, t) => {
          e !== t &&
            (e
              ? ((G.value = !0),
                (i.value = l.multiple || R.value ? "" : String(a.value.at(-1)?.props.title ?? "")),
                (g.value = !0),
                te(() => (G.value = !1)))
              : (!l.multiple && i.value == null && (a.value = []),
                (r.value = !1),
                !g.value && i.value && (x.value = i.value),
                (i.value = ""),
                (o.value = -1)));
        }),
        O(i, (e) => {
          !h.value || G.value || (e && (r.value = !0), (g.value = !e));
        }),
        O(r, (e) => {
          if (!l.hideSelected && e && a.value.length && g.value) {
            const t = b.value.findIndex((d) => a.value.some((c) => d.value === c.value));
            ze &&
              window.requestAnimationFrame(() => {
                t >= 0 && N.value?.scrollToIndex(t);
              });
          }
          e && (x.value = null);
        }),
        O(z, (e, t) => {
          r.value || (h.value && !t.length && e.length && (r.value = !0));
        }),
        $e(() => {
          const e = !!(!l.hideNoData || b.value.length || n["prepend-item"] || n["append-item"] || n["no-data"]),
            t = a.value.length > 0,
            d = W.filterProps(l),
            c = { search: i, filteredItems: B.value };
          return f(
            W,
            V({ ref: m }, d, {
              modelValue: i.value,
              "onUpdate:modelValue": [(v) => (i.value = v), Pe],
              focused: h.value,
              "onUpdate:focused": (v) => (h.value = v),
              validationValue: a.externalValue,
              counterValue: ve.value,
              dirty: t,
              onChange: Ie,
              class: [
                "v-autocomplete",
                `v-autocomplete--${l.multiple ? "multiple" : "single"}`,
                {
                  "v-autocomplete--active-menu": r.value,
                  "v-autocomplete--chips": !!l.chips,
                  "v-autocomplete--selection-slot": !!R.value,
                  "v-autocomplete--selecting-index": o.value > -1,
                },
                l.class,
              ],
              style: l.style,
              readonly: I.isReadonly.value,
              placeholder: t ? void 0 : l.placeholder,
              "onClick:clear": Ve,
              "onMousedown:control": ke,
              onKeydown: xe,
              onBlur: Ae,
              "aria-expanded": pe.value,
              "aria-controls": he.value,
            }),
            {
              ...n,
              default: (v) => {
                let { id: A } = v;
                return C(J, null, [
                  f(
                    Ze,
                    V(
                      {
                        id: me.value,
                        ref: E,
                        modelValue: r.value,
                        "onUpdate:modelValue": (s) => (r.value = s),
                        activator: "parent",
                        disabled: _.value,
                        eager: l.eager,
                        maxHeight: 310,
                        openOnClick: !1,
                        closeOnContentClick: !1,
                        onAfterEnter: we,
                        onAfterLeave: Fe,
                      },
                      l.menuProps,
                      { contentClass: ["v-autocomplete__content", l.menuProps?.contentClass] },
                    ),
                    {
                      default: () => [
                        f(
                          el,
                          { onFocusin: Re, onKeydown: Se },
                          {
                            default: () => [
                              n["menu-header"] && C("header", { ref: j }, [n["menu-header"](c)]),
                              e &&
                                f(
                                  ll,
                                  V(
                                    {
                                      key: "autocomplete-list",
                                      ref: P,
                                      filterable: !0,
                                      selected: fe.value,
                                      selectStrategy: l.multiple ? "independent" : "single-independent",
                                      onMousedown: (s) => s.preventDefault(),
                                      onFocusout: De,
                                      tabindex: "-1",
                                      selectable: !!b.value.length,
                                      "aria-live": "polite",
                                      "aria-labelledby": `${A.value}-label`,
                                      "aria-multiselectable": l.multiple,
                                      color: l.itemColor ?? l.color,
                                    },
                                    ge,
                                    l.listProps,
                                  ),
                                  {
                                    default: () => [
                                      n["prepend-item"]?.(),
                                      !b.value.length &&
                                        !l.hideNoData &&
                                        (n["no-data"]?.() ?? f(le, { key: "no-data", title: ne(l.noDataText) }, null)),
                                      f(
                                        al,
                                        { ref: N, renderless: !0, items: b.value, itemKey: "value" },
                                        {
                                          default: (s) => {
                                            let { item: u, index: y, itemRef: K } = s;
                                            const M = V(u.props, {
                                              ref: K,
                                              key: u.value,
                                              active: $.value && u === D.value ? !0 : void 0,
                                              onClick: () => S(u, null),
                                              "aria-posinset": y + 1,
                                              "aria-setsize": b.value.length,
                                            });
                                            return u.type === "divider"
                                              ? (n.divider?.({ props: u.raw, index: y }) ??
                                                  f(tl, V(u.props, { key: `divider-${y}` }), null))
                                              : u.type === "subheader"
                                                ? (n.subheader?.({ props: u.raw, index: y }) ??
                                                  f(ul, V(u.props, { key: `subheader-${y}` }), null))
                                                : (n.item?.({ item: u, index: y, props: M }) ??
                                                  f(le, V(M, { role: "option" }), {
                                                    prepend: (T) => {
                                                      let { isSelected: p } = T;
                                                      return C(J, null, [
                                                        l.multiple && !l.hideSelected
                                                          ? f(
                                                              ol,
                                                              {
                                                                key: u.value,
                                                                modelValue: p,
                                                                ripple: !1,
                                                                tabindex: "-1",
                                                                "aria-hidden": !0,
                                                                onClick: (Me) => Me.preventDefault(),
                                                              },
                                                              null,
                                                            )
                                                          : void 0,
                                                        u.props.prependAvatar &&
                                                          f(sl, { image: u.props.prependAvatar }, null),
                                                        u.props.prependIcon &&
                                                          f(ee, { icon: u.props.prependIcon }, null),
                                                      ]);
                                                    },
                                                    title: () =>
                                                      g.value ? u.title : nl("v-autocomplete", u.title, de(u)?.title),
                                                  }));
                                          },
                                        },
                                      ),
                                      n["append-item"]?.(),
                                    ],
                                  },
                                ),
                              n["menu-footer"] && C("footer", { ref: Q }, [n["menu-footer"](c)]),
                            ],
                          },
                        ),
                      ],
                    },
                  ),
                  a.value.map((s, u) => {
                    function y(p) {
                      (p.stopPropagation(), p.preventDefault(), S(s, !1));
                    }
                    const K = V(ae.filterProps(s.props), {
                        "onClick:close": y,
                        onKeydown(p) {
                          (p.key !== "Enter" && p.key !== " ") || (p.preventDefault(), p.stopPropagation(), y(p));
                        },
                        onMousedown(p) {
                          (p.preventDefault(), p.stopPropagation());
                        },
                        modelValue: !0,
                        "onUpdate:modelValue": void 0,
                      }),
                      M = L.value ? !!n.chip : !!n.selection,
                      T = M
                        ? il(L.value ? n.chip({ item: s, index: u, props: K }) : n.selection({ item: s, index: u }))
                        : void 0;
                    if (!(M && !T))
                      return C(
                        "div",
                        {
                          key: s.value,
                          class: fl([
                            "v-autocomplete__selection",
                            u === o.value && ["v-autocomplete__selection--selected", ie.value],
                          ]),
                          style: dl(u === o.value ? re.value : {}),
                        },
                        [
                          L.value
                            ? n.chip
                              ? f(
                                  rl,
                                  {
                                    key: "chip-defaults",
                                    defaults: { VChip: { closable: Y.value, size: "small", text: s.title } },
                                  },
                                  { default: () => [T] },
                                )
                              : f(
                                  ae,
                                  V(
                                    {
                                      key: "chip",
                                      closable: Y.value,
                                      size: "small",
                                      text: s.title,
                                      disabled: s.props.disabled,
                                    },
                                    K,
                                  ),
                                  null,
                                )
                            : (T ??
                              C("span", { class: "v-autocomplete__selection-text" }, [
                                s.title,
                                l.multiple &&
                                  u < a.value.length - 1 &&
                                  C("span", { class: "v-autocomplete__selection-comma" }, [ml(",")]),
                              ])),
                        ],
                      );
                  }),
                ]);
              },
              "append-inner": function () {
                for (var v = arguments.length, A = new Array(v), s = 0; s < v; s++) A[s] = arguments[s];
                return C(J, null, [
                  n["append-inner"]?.(...A),
                  l.menuIcon
                    ? f(
                        ee,
                        {
                          class: "v-autocomplete__menu-icon",
                          color: m.value?.fieldIconColor,
                          icon: l.menuIcon,
                          onMousedown: Ce,
                          onClick: Xe,
                          "aria-hidden": !0,
                          tabindex: "-1",
                        },
                        null,
                      )
                    : void 0,
                  l.appendInnerIcon &&
                    f(ce, { key: "append-icon", name: "appendInner", color: A[0].iconColor.value }, null),
                ]);
              },
            },
          );
        }),
        He({ isFocused: h, isPristine: g, menu: r, search: i, filteredItems: B, select: S }, m)
      );
    },
  });
export { yl as V };
