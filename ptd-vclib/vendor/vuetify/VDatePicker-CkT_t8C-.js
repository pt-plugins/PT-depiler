import {
  ax as p,
  bS as ne,
  bY as K,
  c as _,
  a2 as oe,
  r as le,
  bp as E,
  a as te,
  ag as ae,
  by as Ie,
  M as me,
  E as Te,
  bA as Q,
  bX as W,
  cg as j,
  bm as H,
  ah as Ne,
  aj as ke,
  b as de,
  bv as se,
  c1 as We,
  N as ue,
  be as Be,
  v as $e,
  al as Re,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import {
  U as g,
  H as x,
  F as q,
  D as w,
  b3 as G,
  b5 as Fe,
  ch as be,
  Q as Le,
  bJ as Z,
  bY as L,
  br as je,
  cj as ge,
  b0 as $,
  cl as He,
} from "../packages/site/index-COeZNva1.js";
import { V as Ee } from "./VBadge-MSR38gir.js";
const De = E(
    {
      active: { type: [String, Array], default: void 0 },
      controlHeight: [Number, String],
      controlVariant: { type: String, default: "docked" },
      noMonthPicker: Boolean,
      disabled: { type: [Boolean, String, Array], default: null },
      nextIcon: { type: te, default: "$next" },
      prevIcon: { type: te, default: "$prev" },
      modeIcon: { type: te, default: "$subgroup" },
      text: String,
      monthText: String,
      yearText: String,
      viewMode: { type: String, default: "month" },
    },
    "VDatePickerControls",
  ),
  ce = p()({
    name: "VDatePickerControls",
    props: De(),
    emits: {
      "click:year": () => !0,
      "click:month": () => !0,
      "click:prev": () => !0,
      "click:next": () => !0,
      "click:prev-year": () => !0,
      "click:next-year": () => !0,
    },
    setup(e, a) {
      let { emit: D, slots: u } = a;
      const { t } = ne(),
        c = w(() => (Array.isArray(e.disabled) ? e.disabled.includes("text") : !!e.disabled)),
        h = w(() => (Array.isArray(e.disabled) ? e.disabled.includes("mode") : !!e.disabled)),
        d = w(() => (Array.isArray(e.disabled) ? e.disabled.includes("prev-month") : !!e.disabled)),
        o = w(() => (Array.isArray(e.disabled) ? e.disabled.includes("next-month") : !!e.disabled)),
        k = w(() => (Array.isArray(e.disabled) ? e.disabled.includes("prev-year") : !!e.disabled)),
        m = w(() => (Array.isArray(e.disabled) ? e.disabled.includes("next-year") : !!e.disabled));
      function M() {
        D("click:prev");
      }
      function s() {
        D("click:next");
      }
      function P() {
        D("click:prev-year");
      }
      function Y() {
        D("click:next-year");
      }
      function n() {
        D("click:year");
      }
      function f() {
        D("click:month");
      }
      return (
        K(() => {
          const r = { VBtn: { density: "comfortable", variant: "text" } },
            S = g(
              _,
              {
                "data-testid": "prev-month",
                disabled: d.value,
                icon: e.prevIcon,
                "aria-label": t("$vuetify.datePicker.ariaLabel.previousMonth"),
                onClick: M,
              },
              null,
            ),
            O = g(
              _,
              {
                "data-testid": "next-month",
                disabled: o.value,
                icon: e.nextIcon,
                "aria-label": t("$vuetify.datePicker.ariaLabel.nextMonth"),
                onClick: s,
              },
              null,
            ),
            V = g(
              _,
              {
                "data-testid": "prev-year",
                disabled: k.value,
                icon: e.prevIcon,
                "aria-label": t("$vuetify.datePicker.ariaLabel.previousYear"),
                onClick: P,
              },
              null,
            ),
            R = g(
              _,
              {
                "data-testid": "next-year",
                disabled: m.value,
                icon: e.nextIcon,
                "aria-label": t("$vuetify.datePicker.ariaLabel.nextYear"),
                onClick: Y,
              },
              null,
            ),
            l = g(
              _,
              {
                class: "v-date-picker-controls__only-month-btn",
                "data-testid": "month-btn",
                density: "default",
                disabled: c.value,
                text: e.monthText,
                appendIcon: e.modeIcon,
                rounded: !0,
                "aria-label": t("$vuetify.datePicker.ariaLabel.selectMonth"),
                onClick: f,
              },
              null,
            ),
            y = g(
              _,
              {
                class: "v-date-picker-controls__only-year-btn",
                "data-testid": "year-btn",
                density: "default",
                disabled: h.value,
                text: e.yearText,
                appendIcon: e.modeIcon,
                rounded: !0,
                "aria-label": t("$vuetify.datePicker.ariaLabel.selectYear"),
                onClick: n,
              },
              null,
            ),
            b = g(
              _,
              {
                class: "v-date-picker-controls__year-btn",
                "data-testid": "year-btn",
                density: "default",
                disabled: h.value,
                text: e.text,
                appendIcon: e.modeIcon,
                rounded: !0,
                "aria-label": t("$vuetify.datePicker.ariaLabel.selectYear"),
                onClick: n,
              },
              null,
            ),
            C = x(q, null, [
              g(
                _,
                {
                  class: "v-date-picker-controls__month-btn",
                  "data-testid": "month-btn",
                  height: "36",
                  disabled: c.value,
                  text: e.text,
                  rounded: !0,
                  "aria-label": t("$vuetify.datePicker.ariaLabel.selectMonth"),
                  onClick: f,
                },
                null,
              ),
              g(
                _,
                {
                  class: "v-date-picker-controls__mode-btn",
                  "data-testid": "year-btn",
                  disabled: h.value,
                  icon: e.modeIcon,
                  "aria-label": t("$vuetify.datePicker.ariaLabel.selectYear"),
                  onClick: n,
                },
                null,
              ),
            ]),
            T = {
              viewMode: e.viewMode,
              disabled: Array.isArray(e.disabled) ? e.disabled : [],
              monthYearText: e.text ?? "",
              monthText: e.monthText ?? "",
              yearText: e.yearText ?? "",
              openMonths: f,
              openYears: n,
              prevMonth: M,
              nextMonth: s,
              prevYear: P,
              nextYear: Y,
            },
            U = x(q, null, [
              e.noMonthPicker ? b : C,
              g(oe, null, null),
              x("div", { class: "v-date-picker-controls__month" }, [S, O]),
            ]),
            ee = x(q, null, [
              x("div", { class: "v-date-picker-controls__month" }, [S, l, O]),
              g(oe, null, null),
              x("div", { class: "v-date-picker-controls__year" }, [V, y, R]),
            ]);
          return g(
            le,
            { defaults: r },
            {
              default: () => [
                x(
                  "div",
                  {
                    class: G(["v-date-picker-controls", `v-date-picker-controls--variant-${e.controlVariant}`]),
                    style: { "--v-date-picker-controls-height": ae(e.controlHeight) },
                  },
                  [
                    u.default?.(T) ??
                      x(q, null, [e.controlVariant === "modal" && U, e.controlVariant === "docked" && ee]),
                  ],
                ),
              ],
            },
          );
        }),
        {}
      );
    },
  }),
  Ue = E({ appendIcon: te, color: String, header: String, transition: String, onClick: Te() }, "VDatePickerHeader"),
  ve = p()({
    name: "VDatePickerHeader",
    props: Ue(),
    emits: { click: () => !0, "click:append": () => !0 },
    setup(e, a) {
      let { emit: D, slots: u } = a;
      const { backgroundColorClasses: t, backgroundColorStyles: c } = Ie(() => e.color);
      function h() {
        D("click");
      }
      function d() {
        D("click:append");
      }
      return (
        K(() => {
          const o = !!(u.default || e.header),
            k = !!(u.append || e.appendIcon);
          return x(
            "div",
            {
              class: G(["v-date-picker-header", { "v-date-picker-header--clickable": !!e.onClick }, t.value]),
              style: Fe(c.value),
              onClick: h,
            },
            [
              u.prepend && x("div", { key: "prepend", class: "v-date-picker-header__prepend" }, [u.prepend()]),
              o &&
                g(
                  me,
                  { key: "content", name: e.transition },
                  {
                    default: () => [
                      x("div", { key: e.header, class: "v-date-picker-header__content" }, [u.default?.() ?? e.header]),
                    ],
                  },
                ),
              k &&
                x("div", { class: "v-date-picker-header__append" }, [
                  u.append
                    ? g(
                        le,
                        {
                          key: "append-defaults",
                          disabled: !e.appendIcon,
                          defaults: { VBtn: { icon: e.appendIcon, variant: "text" } },
                        },
                        { default: () => [u.append?.()] },
                      )
                    : g(_, { key: "append-btn", icon: e.appendIcon, variant: "text", onClick: d }, null),
                ]),
            ],
          );
        }),
        {}
      );
    },
  }),
  ze = E(
    {
      allowedDates: [Array, Function],
      disabled: { type: Boolean, default: null },
      displayValue: null,
      modelValue: Array,
      month: [Number, String],
      max: null,
      min: null,
      showAdjacentMonths: Boolean,
      year: [Number, String],
      weekdays: { type: Array, default: () => [0, 1, 2, 3, 4, 5, 6] },
      weeksInMonth: { type: String, default: "dynamic" },
      firstDayOfWeek: { type: [Number, String], default: void 0 },
      firstDayOfYear: { type: [Number, String], default: void 0 },
      weekdayFormat: String,
    },
    "calendar",
  );
function Je(e) {
  const a = Q(),
    D = W(e, "modelValue", [], (n) => j(n).map((f) => a.date(f))),
    u = w(() =>
      e.displayValue
        ? a.date(e.displayValue)
        : D.value.length > 0
          ? a.date(D.value[0])
          : e.min
            ? a.date(e.min)
            : Array.isArray(e.allowedDates)
              ? a.date(e.allowedDates[0])
              : a.date(),
    ),
    t = W(
      e,
      "year",
      void 0,
      (n) => {
        const f = n != null ? Number(n) : a.getYear(u.value);
        return a.startOfYear(a.setYear(a.date(), f));
      },
      (n) => a.getYear(n),
    ),
    c = W(
      e,
      "month",
      void 0,
      (n) => {
        const f = n != null ? Number(n) : a.getMonth(u.value),
          r = a.setYear(a.startOfMonth(a.date()), a.getYear(t.value));
        return a.setMonth(r, f);
      },
      (n) => a.getMonth(n),
    ),
    h = w(() => {
      const n = a.toJsDate(a.startOfWeek(a.date(), e.firstDayOfWeek)).getDay();
      return a.getWeekdays(e.firstDayOfWeek, e.weekdayFormat).filter((f, r) => e.weekdays.includes((r + n) % 7));
    }),
    d = w(() => {
      const n = a.getWeekArray(c.value, e.firstDayOfWeek),
        f = n.flat(),
        r = 42;
      if (e.weeksInMonth === "static" && f.length < r) {
        const S = f[f.length - 1];
        let O = [];
        for (let V = 1; V <= r - f.length; V++) (O.push(a.addDays(S, V)), V % 7 === 0 && (n.push(O), (O = [])));
      }
      return n;
    });
  function o(n, f) {
    return n
      .filter((r) => e.weekdays.includes(a.toJsDate(r).getDay()))
      .map((r, S) => {
        const O = a.toISO(r),
          V = !a.isSameMonth(r, c.value),
          R = a.isSameDay(r, a.startOfMonth(c.value)),
          l = a.isSameDay(r, a.endOfMonth(c.value)),
          y = a.isSameDay(r, c.value),
          b = e.weekdays.length;
        return {
          date: r,
          formatted: a.format(r, "keyboardDate"),
          isAdjacent: V,
          isDisabled: Y(r),
          isEnd: l,
          isHidden: V && !e.showAdjacentMonths,
          isSame: y,
          isSelected: D.value.some((C) => a.isSameDay(r, C)),
          isStart: R,
          isToday: a.isSameDay(r, f),
          isWeekEnd: S % b === b - 1,
          isWeekStart: S % b === 0,
          isoDate: O,
          localized: a.format(r, "dayOfMonth"),
          month: a.getMonth(r),
          year: a.getYear(r),
        };
      });
  }
  const k = w(() => {
      const n = a.startOfWeek(u.value, e.firstDayOfWeek),
        f = [];
      for (let S = 0; S <= 6; S++) f.push(a.addDays(n, S));
      const r = a.date();
      return o(f, r);
    }),
    m = w(() => {
      const n = d.value.flat(),
        f = a.date();
      return o(n, f);
    }),
    M = w(() => d.value.map((n) => (n.length ? a.getWeek(n[0], e.firstDayOfWeek, e.firstDayOfYear) : null))),
    { minDate: s, maxDate: P } = Me(e);
  function Y(n) {
    if (e.disabled) return !0;
    const f = a.date(n);
    return (s.value && a.isBefore(a.endOfDay(f), s.value)) || (P.value && a.isAfter(f, P.value))
      ? !0
      : Array.isArray(e.allowedDates) && e.allowedDates.length > 0
        ? !e.allowedDates.some((r) => a.isSameDay(a.date(r), f))
        : typeof e.allowedDates == "function"
          ? !e.allowedDates(f)
          : !1;
  }
  return {
    displayValue: u,
    daysInMonth: m,
    daysInWeek: k,
    genDays: o,
    model: D,
    weeksInMonth: d,
    weekdayLabels: h,
    weekNumbers: M,
  };
}
function Me(e) {
  const a = Q(),
    D = w(() => {
      if (!e.min) return null;
      const h = a.date(e.min);
      return a.isValid(h) ? h : null;
    }),
    u = w(() => {
      if (!e.max) return null;
      const h = a.date(e.max);
      return a.isValid(h) ? h : null;
    });
  function t(h) {
    return D.value && a.isBefore(h, D.value) ? D.value : u.value && a.isAfter(h, u.value) ? u.value : h;
  }
  function c(h) {
    return (!D.value || a.isAfter(h, D.value)) && (!u.value || a.isBefore(h, u.value));
  }
  return { minDate: D, maxDate: u, clampDate: t, isInAllowedRange: c };
}
const xe = E(
    {
      color: String,
      hideWeekdays: Boolean,
      multiple: [Boolean, Number, String],
      showWeek: Boolean,
      readonly: Boolean,
      transition: { type: String, default: "picker-transition" },
      reverseTransition: { type: String, default: "picker-reverse-transition" },
      events: { type: [Array, Function, Object], default: () => null },
      eventColor: { type: [Array, Function, Object, String], default: () => null },
      ...H(ze(), ["displayValue"]),
    },
    "VDatePickerMonth",
  ),
  fe = p()({
    name: "VDatePickerMonth",
    props: xe(),
    emits: { "update:modelValue": (e) => !0, "update:month": (e) => !0, "update:year": (e) => !0 },
    setup(e, a) {
      let { emit: D, slots: u } = a;
      const t = je(),
        { t: c } = ne(),
        { daysInMonth: h, model: d, weekNumbers: o, weekdayLabels: k } = Je(e),
        m = Q(),
        M = Z(),
        s = Z(),
        P = Z(!1),
        Y = L(() => (P.value ? e.reverseTransition : e.transition));
      e.multiple === "range" &&
        d.value.length > 0 &&
        ((M.value = d.value[0]), d.value.length > 1 && (s.value = d.value[d.value.length - 1]));
      const n = w(() => {
        const l = ["number", "string"].includes(typeof e.multiple) ? Number(e.multiple) : 1 / 0;
        return d.value.length >= l;
      });
      be(h, (l, y) => {
        y && (P.value = m.isBefore(l[0].date, y[0].date));
      });
      function f(l) {
        const y = m.startOfDay(l);
        if (
          (d.value.length === 0
            ? (M.value = void 0)
            : d.value.length === 1 && ((M.value = d.value[0]), (s.value = void 0)),
          !M.value)
        )
          ((M.value = y), (d.value = [M.value]));
        else if (s.value) ((M.value = l), (s.value = void 0), (d.value = [M.value]));
        else {
          if (m.isSameDay(y, M.value)) {
            ((M.value = void 0), (d.value = []));
            return;
          } else m.isBefore(y, M.value) ? ((s.value = m.endOfDay(M.value)), (M.value = y)) : (s.value = m.endOfDay(y));
          d.value = Ne(m, M.value, s.value);
        }
      }
      function r(l) {
        const y = m.format(l.date, "fullDateWithWeekday"),
          b = l.isToday ? "currentDate" : "selectDate";
        return c(`$vuetify.datePicker.ariaLabel.${b}`, y);
      }
      function S(l) {
        const y = d.value.findIndex((b) => m.isSameDay(b, l));
        if (y === -1) d.value = [...d.value, l];
        else {
          const b = [...d.value];
          (b.splice(y, 1), (d.value = b));
        }
      }
      function O(l) {
        e.multiple === "range" ? f(l) : e.multiple ? S(l) : (d.value = [l]);
      }
      function V(l) {
        const { events: y, eventColor: b } = e;
        let C,
          T = [];
        if (
          (Array.isArray(y)
            ? (C = y.includes(l))
            : y instanceof Function
              ? (C = y(l) || !1)
              : y
                ? (C = y[l] || !1)
                : (C = !1),
          C)
        )
          C !== !0
            ? (T = j(C))
            : typeof b == "string"
              ? (T = [b])
              : typeof b == "function"
                ? (T = j(b(l)))
                : Array.isArray(b)
                  ? (T = b)
                  : typeof b == "object" && b !== null && (T = j(b[l]));
        else return [];
        return T.length
          ? T.filter(Boolean).map((U) => (typeof U == "string" ? U : "surface-variant"))
          : ["surface-variant"];
      }
      function R(l) {
        const y = V(l);
        return y.length
          ? x("div", { class: "v-date-picker-month__events" }, [y.map((b) => g(Ee, { dot: !0, color: b }, null))])
          : null;
      }
      K(() =>
        x("div", { class: "v-date-picker-month", style: { "--v-date-picker-days-in-week": e.weekdays.length } }, [
          e.showWeek &&
            x("div", { key: "weeks", class: "v-date-picker-month__weeks" }, [
              !e.hideWeekdays && x("div", { key: "hide-week-days", class: "v-date-picker-month__day" }, [Le(" ")]),
              o.value.map((l) =>
                x("div", { class: G(["v-date-picker-month__day", "v-date-picker-month__day--adjacent"]) }, [l]),
              ),
            ]),
          g(
            me,
            { name: Y.value },
            {
              default: () => [
                x("div", { ref: t, key: h.value[0].date?.toString(), class: "v-date-picker-month__days" }, [
                  !e.hideWeekdays &&
                    k.value.map((l) =>
                      x("div", { class: G(["v-date-picker-month__day", "v-date-picker-month__weekday"]) }, [l]),
                    ),
                  h.value.map((l, y) => {
                    const b = {
                      props: {
                        class: "v-date-picker-month__day-btn",
                        color: l.isSelected || l.isToday ? e.color : void 0,
                        disabled: l.isDisabled,
                        readonly: e.readonly,
                        icon: !0,
                        ripple: !1,
                        variant: l.isSelected ? "flat" : l.isToday ? "outlined" : "text",
                        "aria-label": r(l),
                        "aria-current": l.isToday ? "date" : void 0,
                        onClick: () => O(l.date),
                      },
                      item: l,
                      i: y,
                    };
                    return (
                      n.value && !l.isSelected && (l.isDisabled = !0),
                      x(
                        "div",
                        {
                          class: G([
                            "v-date-picker-month__day",
                            {
                              "v-date-picker-month__day--adjacent": l.isAdjacent,
                              "v-date-picker-month__day--hide-adjacent": l.isHidden,
                              "v-date-picker-month__day--selected": l.isSelected,
                              "v-date-picker-month__day--week-end": l.isWeekEnd,
                              "v-date-picker-month__day--week-start": l.isWeekStart,
                            },
                          ]),
                          "data-v-date": l.isDisabled ? void 0 : l.isoDate,
                        },
                        [
                          (e.showAdjacentMonths || !l.isAdjacent) &&
                            (u.day?.(b) ?? g(_, b.props, { default: () => [l.localized, R(l.isoDate)] })),
                        ],
                      )
                    );
                  }),
                ]),
              ],
            },
          ),
        ]),
      );
    },
  }),
  we = E(
    {
      color: String,
      height: [String, Number],
      min: null,
      max: null,
      modelValue: Number,
      year: Number,
      allowedMonths: [Array, Function],
    },
    "VDatePickerMonths",
  ),
  he = p()({
    name: "VDatePickerMonths",
    props: we(),
    emits: { "update:modelValue": (e) => !0 },
    setup(e, a) {
      let { emit: D, slots: u } = a;
      const t = Q(),
        c = W(e, "modelValue"),
        h = w(() => {
          let o = t.startOfYear(t.date());
          return (
            e.year && (o = t.setYear(o, e.year)),
            ke(12).map((k) => {
              const m = t.format(o, "monthShort"),
                M = t.format(o, "month"),
                s = !!(
                  !d(k) ||
                  (e.min && t.isAfter(t.startOfMonth(t.date(e.min)), o)) ||
                  (e.max && t.isAfter(o, t.startOfMonth(t.date(e.max))))
                );
              return ((o = t.getNextMonth(o)), { isDisabled: s, text: m, label: M, value: k });
            })
          );
        });
      ge(() => {
        c.value = c.value ?? t.getMonth(t.date());
      });
      function d(o) {
        return Array.isArray(e.allowedMonths) && e.allowedMonths.length
          ? e.allowedMonths.includes(o)
          : typeof e.allowedMonths == "function"
            ? e.allowedMonths(o)
            : !0;
      }
      return (
        K(() =>
          x("div", { class: "v-date-picker-months", style: { height: ae(e.height) } }, [
            x("div", { class: "v-date-picker-months__content" }, [
              h.value.map((o, k) => {
                const m = {
                  active: c.value === k,
                  ariaLabel: o.label,
                  color: c.value === k ? e.color : void 0,
                  disabled: o.isDisabled,
                  rounded: !0,
                  text: o.text,
                  variant: c.value === o.value ? "flat" : "text",
                  onClick: () => M(k),
                };
                function M(s) {
                  if (c.value === s) {
                    D("update:modelValue", c.value);
                    return;
                  }
                  c.value = s;
                }
                return u.month?.({ month: o, i: k, props: m }) ?? g(_, $({ key: "month" }, m), null);
              }),
            ]),
          ]),
        ),
        {}
      );
    },
  }),
  Pe = E(
    {
      color: String,
      height: [String, Number],
      min: null,
      max: null,
      modelValue: Number,
      allowedYears: [Array, Function],
    },
    "VDatePickerYears",
  ),
  ye = p()({
    name: "VDatePickerYears",
    props: Pe(),
    directives: { vIntersect: de },
    emits: { "update:modelValue": (e) => !0 },
    setup(e, a) {
      let { emit: D, slots: u } = a;
      const t = Q(),
        c = W(e, "modelValue"),
        h = Z(!1),
        d = w(() => {
          const s = t.getYear(t.date());
          let P = s - 100,
            Y = s + 52;
          (e.min && (P = t.getYear(t.date(e.min))), e.max && (Y = t.getYear(t.date(e.max))));
          let n = t.startOfYear(t.date());
          return (
            (n = t.setYear(n, P)),
            ke(Y - P + 1, P).map((f) => {
              const r = t.format(n, "year");
              return ((n = t.setYear(n, t.getYear(n) + 1)), { text: r, value: f, isDisabled: !M(f) });
            })
          );
        });
      ge(() => {
        c.value = c.value ?? t.getYear(t.date());
      });
      const o = se(),
        k = se();
      function m() {
        const s = o.el,
          P = k.el;
        if (!s || !P) return;
        const Y = s.getBoundingClientRect(),
          n = P.getBoundingClientRect();
        s.scrollTop += n.top - Y.top - s.clientHeight / 2 + n.height / 2;
      }
      function M(s) {
        return Array.isArray(e.allowedYears) && e.allowedYears.length
          ? e.allowedYears.includes(s)
          : typeof e.allowedYears == "function"
            ? e.allowedYears(s)
            : !0;
      }
      return (
        K(() =>
          He(
            x("div", { class: "v-date-picker-years", ref: o, style: { height: ae(e.height) } }, [
              x(
                "div",
                {
                  class: "v-date-picker-years__content",
                  onFocus: () => k.el?.focus(),
                  onFocusin: () => (h.value = !0),
                  onFocusout: () => (h.value = !1),
                  tabindex: h.value ? -1 : 0,
                },
                [
                  d.value.map((s, P) => {
                    const Y = {
                      ref: c.value === s.value ? k : void 0,
                      active: c.value === s.value,
                      color: c.value === s.value ? e.color : void 0,
                      rounded: !0,
                      text: s.text,
                      disabled: s.isDisabled,
                      variant: c.value === s.value ? "flat" : "text",
                      onClick: () => {
                        if (c.value === s.value) {
                          D("update:modelValue", c.value);
                          return;
                        }
                        c.value = s.value;
                      },
                    };
                    return u.year?.({ year: s, i: P, props: Y }) ?? g(_, $({ key: "month" }, Y), null);
                  }),
                ],
              ),
            ]),
            [[de, { handler: m }, null, { once: !0 }]],
          ),
        ),
        {}
      );
    },
  }),
  pe = E(
    {
      header: { type: String, default: "$vuetify.datePicker.header" },
      headerColor: String,
      headerDateFormat: { type: String, default: "normalDateWithWeekday" },
      landscapeHeaderWidth: [Number, String],
      ...H(De(), ["active", "monthText", "yearText"]),
      ...xe({ weeksInMonth: "static" }),
      ...H(we(), ["modelValue"]),
      ...H(Pe(), ["modelValue"]),
      ...Be({ title: "$vuetify.datePicker.title" }),
      modelValue: null,
    },
    "VDatePicker",
  ),
  qe = p()({
    name: "VDatePicker",
    props: pe(),
    emits: {
      "update:modelValue": (e) => !0,
      "update:month": (e) => !0,
      "update:year": (e) => !0,
      "update:viewMode": (e) => !0,
    },
    setup(e, a) {
      let { emit: D, slots: u } = a;
      const t = Q(),
        { t: c } = ne(),
        { rtlClasses: h } = We(),
        d = W(
          e,
          "modelValue",
          void 0,
          (i) => j(i).map((v) => t.date(v)),
          (i) => (e.multiple ? i : i[0]),
        ),
        o = W(e, "viewMode"),
        { minDate: k, maxDate: m, clampDate: M } = Me(e),
        s = w(() => {
          const i = t.date(),
            v = d.value?.[0] ? t.date(d.value[0]) : M(i);
          return v && t.isValid(v) ? v : i;
        }),
        P = L(() => e.headerColor ?? e.color),
        Y = W(e, "month"),
        n = w({ get: () => Number(Y.value ?? t.getMonth(t.startOfMonth(s.value))), set: (i) => (Y.value = i) }),
        f = W(e, "year"),
        r = w({
          get: () => Number(f.value ?? t.getYear(t.startOfYear(t.setMonth(s.value, n.value)))),
          set: (i) => (f.value = i),
        }),
        S = Z(!1),
        O = w(() => {
          if (e.multiple && d.value.length > 1) return c("$vuetify.datePicker.itemsSelected", d.value.length);
          const i =
            d.value[0] && t.isValid(d.value[0]) ? t.format(t.date(d.value[0]), e.headerDateFormat) : c(e.header);
          return e.landscape && i.split(" ").length === 3
            ? i.replace(
                " ",
                `
`,
              )
            : i;
        }),
        V = L(() => {
          let i = t.date();
          return ((i = t.setDate(i, 1)), (i = t.setMonth(i, n.value)), (i = t.setYear(i, r.value)), i);
        }),
        R = L(() => t.format(V.value, "monthAndYear")),
        l = L(() => t.format(V.value, "monthShort")),
        y = L(() => t.format(V.value, "year")),
        b = L(() => `date-picker-header${S.value ? "-reverse" : ""}-transition`),
        C = w(() => {
          if (e.disabled) return !0;
          const i = [];
          if (o.value !== "month") i.push("prev-month", "next-month", "prev-year", "next-year");
          else {
            let v = t.date();
            if (((v = t.startOfMonth(v)), (v = t.setMonth(v, n.value)), (v = t.setYear(v, r.value)), k.value)) {
              const A = t.addDays(t.startOfMonth(v), -1),
                N = t.addDays(t.startOfYear(v), -1);
              (t.isAfter(k.value, A) && i.push("prev-month"), t.isAfter(k.value, N) && i.push("prev-year"));
            }
            if (m.value) {
              const A = t.addDays(t.endOfMonth(v), 1),
                N = t.addDays(t.endOfYear(v), 1);
              (t.isAfter(A, m.value) && i.push("next-month"), t.isAfter(N, m.value) && i.push("next-year"));
            }
          }
          return i;
        }),
        T = w(() => e.allowedYears || Ye),
        U = w(() => e.allowedMonths || Se);
      function ee(i, v) {
        const A = e.allowedDates;
        if (typeof A != "function") return !0;
        const N = 1 + Re(t, i, v);
        for (let B = 0; B < N; B++) if (A(t.addDays(i, B))) return !0;
        return !1;
      }
      function Ye(i) {
        if (typeof e.allowedDates == "function") {
          const v = t.parseISO(`${i}-01-01`);
          return ee(v, t.endOfYear(v));
        }
        if (Array.isArray(e.allowedDates) && e.allowedDates.length) {
          for (const v of e.allowedDates) if (t.getYear(t.date(v)) === i) return !0;
          return !1;
        }
        return !0;
      }
      function Se(i) {
        if (typeof e.allowedDates == "function") {
          const v = String(i + 1).padStart(2, "0"),
            A = t.parseISO(`${r.value}-${v}-01`);
          return ee(A, t.endOfMonth(A));
        }
        if (Array.isArray(e.allowedDates) && e.allowedDates.length) {
          for (const v of e.allowedDates)
            if (t.getYear(t.date(v)) === r.value && t.getMonth(t.date(v)) === i) return !0;
          return !1;
        }
        return !0;
      }
      function Ve() {
        (n.value < 11 ? n.value++ : (r.value++, (n.value = 0), F()), X());
      }
      function Ae() {
        (n.value > 0 ? n.value-- : (r.value--, (n.value = 11), F()), X());
      }
      function Ce() {
        if ((r.value++, m.value)) {
          const i = String(n.value + 1).padStart(2, "0"),
            v = t.parseISO(`${r.value}-${i}-01`);
          t.isAfter(v, m.value) && (n.value = t.getMonth(m.value));
        }
        F();
      }
      function _e() {
        if ((r.value--, k.value)) {
          const i = String(n.value + 1).padStart(2, "0"),
            v = t.endOfMonth(t.parseISO(`${r.value}-${i}-01`));
          t.isAfter(k.value, v) && (n.value = t.getMonth(k.value));
        }
        F();
      }
      function Oe() {
        o.value = "month";
      }
      function re() {
        o.value = o.value === "months" ? "month" : "months";
      }
      function ie() {
        o.value = o.value === "year" ? "month" : "year";
      }
      function X() {
        o.value === "months" && re();
      }
      function F() {
        o.value === "year" && ie();
      }
      return (
        be(d, (i, v) => {
          const A = j(v),
            N = j(i);
          if (!N.length) return;
          const B = t.date(A[A.length - 1]),
            z = t.date(N[N.length - 1]);
          if (t.isSameDay(B, z)) return;
          const J = t.getMonth(z),
            I = t.getYear(z);
          (J !== n.value && ((n.value = J), X()), I !== r.value && ((r.value = I), F()), (S.value = t.isBefore(B, z)));
        }),
        K(() => {
          const i = ue.filterProps(e),
            v = H(ce.filterProps(e), ["viewMode"]),
            A = ve.filterProps(e),
            N = fe.filterProps(e),
            B = H(he.filterProps(e), ["modelValue"]),
            z = H(ye.filterProps(e), ["modelValue"]),
            J = { color: P.value, header: O.value, transition: b.value };
          return g(
            ue,
            $(i, {
              color: P.value,
              class: [
                "v-date-picker",
                `v-date-picker--${o.value}`,
                { "v-date-picker--show-week": e.showWeek },
                h.value,
                e.class,
              ],
              style: [{ "--v-date-picker-landscape-header-width": ae(e.landscapeHeaderWidth) }, e.style],
            }),
            {
              title: () => u.title?.() ?? x("div", { class: "v-date-picker__title" }, [c(e.title)]),
              header: () =>
                u.header
                  ? g(le, { defaults: { VDatePickerHeader: { ...J } } }, { default: () => [u.header?.(J)] })
                  : g(ve, $({ key: "header" }, A, J, { onClick: o.value !== "month" ? Oe : void 0 }), {
                      prepend: u.prepend,
                      append: u.append,
                    }),
              default: () =>
                x(q, null, [
                  g(
                    ce,
                    $(v, {
                      disabled: C.value,
                      viewMode: o.value,
                      text: R.value,
                      monthText: l.value,
                      yearText: y.value,
                      "onClick:next": Ve,
                      "onClick:prev": Ae,
                      "onClick:nextYear": Ce,
                      "onClick:prevYear": _e,
                      "onClick:month": re,
                      "onClick:year": ie,
                    }),
                    { default: u.controls },
                  ),
                  g(
                    $e,
                    { hideOnLeave: !0 },
                    {
                      default: () => [
                        o.value === "months"
                          ? g(
                              he,
                              $({ key: "date-picker-months" }, B, {
                                modelValue: n.value,
                                "onUpdate:modelValue": [(I) => (n.value = I), X],
                                min: k.value,
                                max: m.value,
                                year: r.value,
                                allowedMonths: U.value,
                              }),
                              { month: u.month },
                            )
                          : o.value === "year"
                            ? g(
                                ye,
                                $({ key: "date-picker-years" }, z, {
                                  modelValue: r.value,
                                  "onUpdate:modelValue": [(I) => (r.value = I), F],
                                  min: k.value,
                                  max: m.value,
                                  allowedYears: T.value,
                                }),
                                { year: u.year },
                              )
                            : g(
                                fe,
                                $({ key: "date-picker-month" }, N, {
                                  modelValue: d.value,
                                  "onUpdate:modelValue": (I) => (d.value = I),
                                  month: n.value,
                                  "onUpdate:month": [(I) => (n.value = I), X],
                                  year: r.value,
                                  "onUpdate:year": [(I) => (r.value = I), F],
                                  min: k.value,
                                  max: m.value,
                                }),
                                { day: u.day },
                              ),
                      ],
                    },
                  ),
                ]),
              actions: u.actions,
            },
          );
        }),
        {}
      );
    },
  });
export { qe as V };
