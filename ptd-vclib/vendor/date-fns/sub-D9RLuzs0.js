import { a as I, s as K } from "./subDays-DlPNbvmn.js";
import {
  W as D,
  c as y,
  j as C,
  w as $,
  x as V,
  y as j,
  o as U,
  T as H,
  R as A,
  n as J,
  k as S,
  m as B,
  f as ee,
  u as R,
  r as te,
  X as W,
  q as re,
} from "./format-b1gG6cM7.js";
function F(s, e, r) {
  const t = D(s, r?.in);
  if (isNaN(e)) return y(r?.in || s, NaN);
  if (!e) return t;
  const n = t.getDate(),
    o = y(r?.in || s, t.getTime());
  o.setMonth(t.getMonth() + e + 1, 0);
  const c = o.getDate();
  return n >= c ? o : (t.setFullYear(o.getFullYear(), o.getMonth(), n), t);
}
function st(s, e, r) {
  const { years: t = 0, months: n = 0, weeks: o = 0, days: c = 0, hours: h = 0, minutes: g = 0, seconds: b = 0 } = e,
    x = D(s, r?.in),
    M = n || t ? F(x, n + t * 12) : x,
    P = c || o ? I(M, c + o * 7) : M,
    _ = g + h * 60,
    Y = (b + _ * 60) * 1e3;
  return y(r?.in || s, +P + Y);
}
function se() {
  return Object.assign({}, C());
}
function ne(s, e) {
  const r = D(s, e?.in).getDay();
  return r === 0 ? 7 : r;
}
function oe(s, e) {
  const r = ae(e) ? new e(0) : y(e, 0);
  return (
    r.setFullYear(s.getFullYear(), s.getMonth(), s.getDate()),
    r.setHours(s.getHours(), s.getMinutes(), s.getSeconds(), s.getMilliseconds()),
    r
  );
}
function ae(s) {
  return typeof s == "function" && s.prototype?.constructor === s;
}
const ie = 10;
class G {
  subPriority = 0;
  validate(e, r) {
    return !0;
  }
}
class ce extends G {
  constructor(e, r, t, n, o) {
    (super(),
      (this.value = e),
      (this.validateValue = r),
      (this.setValue = t),
      (this.priority = n),
      o && (this.subPriority = o));
  }
  validate(e, r) {
    return this.validateValue(e, this.value, r);
  }
  set(e, r, t) {
    return this.setValue(e, r, this.value, t);
  }
}
class ue extends G {
  priority = ie;
  subPriority = -1;
  constructor(e, r) {
    (super(), (this.context = e || ((t) => y(r, t))));
  }
  set(e, r) {
    return r.timestampIsSet ? e : y(e, oe(e, this.context));
  }
}
class i {
  run(e, r, t, n) {
    const o = this.parse(e, r, t, n);
    return o
      ? { setter: new ce(o.value, this.validate, this.set, this.priority, this.subPriority), rest: o.rest }
      : null;
  }
  validate(e, r, t) {
    return !0;
  }
}
class le extends i {
  priority = 140;
  parse(e, r, t) {
    switch (r) {
      case "G":
      case "GG":
      case "GGG":
        return t.era(e, { width: "abbreviated" }) || t.era(e, { width: "narrow" });
      case "GGGGG":
        return t.era(e, { width: "narrow" });
      case "GGGG":
      default:
        return t.era(e, { width: "wide" }) || t.era(e, { width: "abbreviated" }) || t.era(e, { width: "narrow" });
    }
  }
  set(e, r, t) {
    return ((r.era = t), e.setFullYear(t, 0, 1), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["R", "u", "t", "T"];
}
const w = {
    month: /^(1[0-2]|0?\d)/,
    date: /^(3[0-1]|[0-2]?\d)/,
    dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
    week: /^(5[0-3]|[0-4]?\d)/,
    hour23h: /^(2[0-3]|[0-1]?\d)/,
    hour24h: /^(2[0-4]|[0-1]?\d)/,
    hour11h: /^(1[0-1]|0?\d)/,
    hour12h: /^(1[0-2]|0?\d)/,
    minute: /^[0-5]?\d/,
    second: /^[0-5]?\d/,
    singleDigit: /^\d/,
    twoDigits: /^\d{1,2}/,
    threeDigits: /^\d{1,3}/,
    fourDigits: /^\d{1,4}/,
    anyDigitsSigned: /^-?\d+/,
    singleDigitSigned: /^-?\d/,
    twoDigitsSigned: /^-?\d{1,2}/,
    threeDigitsSigned: /^-?\d{1,3}/,
    fourDigitsSigned: /^-?\d{1,4}/,
  },
  m = {
    basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
    basic: /^([+-])(\d{2})(\d{2})|Z/,
    basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
    extended: /^([+-])(\d{2}):(\d{2})|Z/,
    extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/,
  };
function f(s, e) {
  return s && { value: e(s.value), rest: s.rest };
}
function u(s, e) {
  const r = e.match(s);
  return r ? { value: parseInt(r[0], 10), rest: e.slice(r[0].length) } : null;
}
function T(s, e) {
  const r = e.match(s);
  if (!r) return null;
  if (r[0] === "Z") return { value: 0, rest: e.slice(1) };
  const t = r[1] === "+" ? 1 : -1,
    n = r[2] ? parseInt(r[2], 10) : 0,
    o = r[3] ? parseInt(r[3], 10) : 0,
    c = r[5] ? parseInt(r[5], 10) : 0;
  return { value: t * (n * $ + o * V + c * j), rest: e.slice(r[0].length) };
}
function X(s) {
  return u(w.anyDigitsSigned, s);
}
function d(s, e) {
  switch (s) {
    case 1:
      return u(w.singleDigit, e);
    case 2:
      return u(w.twoDigits, e);
    case 3:
      return u(w.threeDigits, e);
    case 4:
      return u(w.fourDigits, e);
    default:
      return u(new RegExp("^\\d{1," + s + "}"), e);
  }
}
function O(s, e) {
  switch (s) {
    case 1:
      return u(w.singleDigitSigned, e);
    case 2:
      return u(w.twoDigitsSigned, e);
    case 3:
      return u(w.threeDigitsSigned, e);
    case 4:
      return u(w.fourDigitsSigned, e);
    default:
      return u(new RegExp("^-?\\d{1," + s + "}"), e);
  }
}
function q(s) {
  switch (s) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function z(s, e) {
  const r = e > 0,
    t = r ? e : 1 - e;
  let n;
  if (t <= 50) n = s || 100;
  else {
    const o = t + 50,
      c = Math.trunc(o / 100) * 100,
      h = s >= o % 100;
    n = s + c - (h ? 100 : 0);
  }
  return r ? n : 1 - n;
}
function Z(s) {
  return s % 400 === 0 || (s % 4 === 0 && s % 100 !== 0);
}
class de extends i {
  priority = 130;
  incompatibleTokens = ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"];
  parse(e, r, t) {
    const n = (o) => ({ year: o, isTwoDigitYear: r === "yy" });
    switch (r) {
      case "y":
        return f(d(4, e), n);
      case "yo":
        return f(t.ordinalNumber(e, { unit: "year" }), n);
      default:
        return f(d(r.length, e), n);
    }
  }
  validate(e, r) {
    return r.isTwoDigitYear || r.year > 0;
  }
  set(e, r, t) {
    const n = e.getFullYear();
    if (t.isTwoDigitYear) {
      const c = z(t.year, n);
      return (e.setFullYear(c, 0, 1), e.setHours(0, 0, 0, 0), e);
    }
    const o = !("era" in r) || r.era === 1 ? t.year : 1 - t.year;
    return (e.setFullYear(o, 0, 1), e.setHours(0, 0, 0, 0), e);
  }
}
class we extends i {
  priority = 130;
  parse(e, r, t) {
    const n = (o) => ({ year: o, isTwoDigitYear: r === "YY" });
    switch (r) {
      case "Y":
        return f(d(4, e), n);
      case "Yo":
        return f(t.ordinalNumber(e, { unit: "year" }), n);
      default:
        return f(d(r.length, e), n);
    }
  }
  validate(e, r) {
    return r.isTwoDigitYear || r.year > 0;
  }
  set(e, r, t, n) {
    const o = U(e, n);
    if (t.isTwoDigitYear) {
      const h = z(t.year, o);
      return (e.setFullYear(h, 0, n.firstWeekContainsDate), e.setHours(0, 0, 0, 0), H(e, n));
    }
    const c = !("era" in r) || r.era === 1 ? t.year : 1 - t.year;
    return (e.setFullYear(c, 0, n.firstWeekContainsDate), e.setHours(0, 0, 0, 0), H(e, n));
  }
  incompatibleTokens = ["y", "R", "u", "Q", "q", "M", "L", "I", "d", "D", "i", "t", "T"];
}
class fe extends i {
  priority = 130;
  parse(e, r) {
    return O(r === "R" ? 4 : r.length, e);
  }
  set(e, r, t) {
    const n = y(e, 0);
    return (n.setFullYear(t, 0, 4), n.setHours(0, 0, 0, 0), A(n));
  }
  incompatibleTokens = ["G", "y", "Y", "u", "Q", "q", "M", "L", "w", "d", "D", "e", "c", "t", "T"];
}
class he extends i {
  priority = 130;
  parse(e, r) {
    return O(r === "u" ? 4 : r.length, e);
  }
  set(e, r, t) {
    return (e.setFullYear(t, 0, 1), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"];
}
class ye extends i {
  priority = 120;
  parse(e, r, t) {
    switch (r) {
      case "Q":
      case "QQ":
        return d(r.length, e);
      case "Qo":
        return t.ordinalNumber(e, { unit: "quarter" });
      case "QQQ":
        return (
          t.quarter(e, { width: "abbreviated", context: "formatting" }) ||
          t.quarter(e, { width: "narrow", context: "formatting" })
        );
      case "QQQQQ":
        return t.quarter(e, { width: "narrow", context: "formatting" });
      case "QQQQ":
      default:
        return (
          t.quarter(e, { width: "wide", context: "formatting" }) ||
          t.quarter(e, { width: "abbreviated", context: "formatting" }) ||
          t.quarter(e, { width: "narrow", context: "formatting" })
        );
    }
  }
  validate(e, r) {
    return r >= 1 && r <= 4;
  }
  set(e, r, t) {
    return (e.setMonth((t - 1) * 3, 1), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["Y", "R", "q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"];
}
class be extends i {
  priority = 120;
  parse(e, r, t) {
    switch (r) {
      case "q":
      case "qq":
        return d(r.length, e);
      case "qo":
        return t.ordinalNumber(e, { unit: "quarter" });
      case "qqq":
        return (
          t.quarter(e, { width: "abbreviated", context: "standalone" }) ||
          t.quarter(e, { width: "narrow", context: "standalone" })
        );
      case "qqqqq":
        return t.quarter(e, { width: "narrow", context: "standalone" });
      case "qqqq":
      default:
        return (
          t.quarter(e, { width: "wide", context: "standalone" }) ||
          t.quarter(e, { width: "abbreviated", context: "standalone" }) ||
          t.quarter(e, { width: "narrow", context: "standalone" })
        );
    }
  }
  validate(e, r) {
    return r >= 1 && r <= 4;
  }
  set(e, r, t) {
    return (e.setMonth((t - 1) * 3, 1), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["Y", "R", "Q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"];
}
class xe extends i {
  incompatibleTokens = ["Y", "R", "q", "Q", "L", "w", "I", "D", "i", "e", "c", "t", "T"];
  priority = 110;
  parse(e, r, t) {
    const n = (o) => o - 1;
    switch (r) {
      case "M":
        return f(u(w.month, e), n);
      case "MM":
        return f(d(2, e), n);
      case "Mo":
        return f(t.ordinalNumber(e, { unit: "month" }), n);
      case "MMM":
        return (
          t.month(e, { width: "abbreviated", context: "formatting" }) ||
          t.month(e, { width: "narrow", context: "formatting" })
        );
      case "MMMMM":
        return t.month(e, { width: "narrow", context: "formatting" });
      case "MMMM":
      default:
        return (
          t.month(e, { width: "wide", context: "formatting" }) ||
          t.month(e, { width: "abbreviated", context: "formatting" }) ||
          t.month(e, { width: "narrow", context: "formatting" })
        );
    }
  }
  validate(e, r) {
    return r >= 0 && r <= 11;
  }
  set(e, r, t) {
    return (e.setMonth(t, 1), e.setHours(0, 0, 0, 0), e);
  }
}
class pe extends i {
  priority = 110;
  parse(e, r, t) {
    const n = (o) => o - 1;
    switch (r) {
      case "L":
        return f(u(w.month, e), n);
      case "LL":
        return f(d(2, e), n);
      case "Lo":
        return f(t.ordinalNumber(e, { unit: "month" }), n);
      case "LLL":
        return (
          t.month(e, { width: "abbreviated", context: "standalone" }) ||
          t.month(e, { width: "narrow", context: "standalone" })
        );
      case "LLLLL":
        return t.month(e, { width: "narrow", context: "standalone" });
      case "LLLL":
      default:
        return (
          t.month(e, { width: "wide", context: "standalone" }) ||
          t.month(e, { width: "abbreviated", context: "standalone" }) ||
          t.month(e, { width: "narrow", context: "standalone" })
        );
    }
  }
  validate(e, r) {
    return r >= 0 && r <= 11;
  }
  set(e, r, t) {
    return (e.setMonth(t, 1), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["Y", "R", "q", "Q", "M", "w", "I", "D", "i", "e", "c", "t", "T"];
}
function me(s, e, r) {
  const t = D(s, r?.in),
    n = J(t, r) - e;
  return (t.setDate(t.getDate() - n * 7), D(t, r?.in));
}
class Te extends i {
  priority = 100;
  parse(e, r, t) {
    switch (r) {
      case "w":
        return u(w.week, e);
      case "wo":
        return t.ordinalNumber(e, { unit: "week" });
      default:
        return d(r.length, e);
    }
  }
  validate(e, r) {
    return r >= 1 && r <= 53;
  }
  set(e, r, t, n) {
    return H(me(e, t, n), n);
  }
  incompatibleTokens = ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "i", "t", "T"];
}
function De(s, e, r) {
  const t = D(s, r?.in),
    n = S(t, r) - e;
  return (t.setDate(t.getDate() - n * 7), t);
}
class ke extends i {
  priority = 100;
  parse(e, r, t) {
    switch (r) {
      case "I":
        return u(w.week, e);
      case "Io":
        return t.ordinalNumber(e, { unit: "week" });
      default:
        return d(r.length, e);
    }
  }
  validate(e, r) {
    return r >= 1 && r <= 53;
  }
  set(e, r, t) {
    return A(De(e, t));
  }
  incompatibleTokens = ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "e", "c", "t", "T"];
}
const ge = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  Pe = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
class Me extends i {
  priority = 90;
  subPriority = 1;
  parse(e, r, t) {
    switch (r) {
      case "d":
        return u(w.date, e);
      case "do":
        return t.ordinalNumber(e, { unit: "date" });
      default:
        return d(r.length, e);
    }
  }
  validate(e, r) {
    const t = e.getFullYear(),
      n = Z(t),
      o = e.getMonth();
    return n ? r >= 1 && r <= Pe[o] : r >= 1 && r <= ge[o];
  }
  set(e, r, t) {
    return (e.setDate(t), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["Y", "R", "q", "Q", "w", "I", "D", "i", "e", "c", "t", "T"];
}
class _e extends i {
  priority = 90;
  subpriority = 1;
  parse(e, r, t) {
    switch (r) {
      case "D":
      case "DD":
        return u(w.dayOfYear, e);
      case "Do":
        return t.ordinalNumber(e, { unit: "date" });
      default:
        return d(r.length, e);
    }
  }
  validate(e, r) {
    const t = e.getFullYear();
    return Z(t) ? r >= 1 && r <= 366 : r >= 1 && r <= 365;
  }
  set(e, r, t) {
    return (e.setMonth(0, t), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["Y", "R", "q", "Q", "M", "L", "w", "I", "d", "E", "i", "e", "c", "t", "T"];
}
function L(s, e, r) {
  const t = C(),
    n = r?.weekStartsOn ?? r?.locale?.options?.weekStartsOn ?? t.weekStartsOn ?? t.locale?.options?.weekStartsOn ?? 0,
    o = D(s, r?.in),
    c = o.getDay(),
    g = ((e % 7) + 7) % 7,
    b = 7 - n,
    x = e < 0 || e > 6 ? e - ((c + b) % 7) : ((g + b) % 7) - ((c + b) % 7);
  return I(o, x, r);
}
class Ye extends i {
  priority = 90;
  parse(e, r, t) {
    switch (r) {
      case "E":
      case "EE":
      case "EEE":
        return (
          t.day(e, { width: "abbreviated", context: "formatting" }) ||
          t.day(e, { width: "short", context: "formatting" }) ||
          t.day(e, { width: "narrow", context: "formatting" })
        );
      case "EEEEE":
        return t.day(e, { width: "narrow", context: "formatting" });
      case "EEEEEE":
        return (
          t.day(e, { width: "short", context: "formatting" }) || t.day(e, { width: "narrow", context: "formatting" })
        );
      case "EEEE":
      default:
        return (
          t.day(e, { width: "wide", context: "formatting" }) ||
          t.day(e, { width: "abbreviated", context: "formatting" }) ||
          t.day(e, { width: "short", context: "formatting" }) ||
          t.day(e, { width: "narrow", context: "formatting" })
        );
    }
  }
  validate(e, r) {
    return r >= 0 && r <= 6;
  }
  set(e, r, t, n) {
    return ((e = L(e, t, n)), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["D", "i", "e", "c", "t", "T"];
}
class Oe extends i {
  priority = 90;
  parse(e, r, t, n) {
    const o = (c) => {
      const h = Math.floor((c - 1) / 7) * 7;
      return ((c + n.weekStartsOn + 6) % 7) + h;
    };
    switch (r) {
      case "e":
      case "ee":
        return f(d(r.length, e), o);
      case "eo":
        return f(t.ordinalNumber(e, { unit: "day" }), o);
      case "eee":
        return (
          t.day(e, { width: "abbreviated", context: "formatting" }) ||
          t.day(e, { width: "short", context: "formatting" }) ||
          t.day(e, { width: "narrow", context: "formatting" })
        );
      case "eeeee":
        return t.day(e, { width: "narrow", context: "formatting" });
      case "eeeeee":
        return (
          t.day(e, { width: "short", context: "formatting" }) || t.day(e, { width: "narrow", context: "formatting" })
        );
      case "eeee":
      default:
        return (
          t.day(e, { width: "wide", context: "formatting" }) ||
          t.day(e, { width: "abbreviated", context: "formatting" }) ||
          t.day(e, { width: "short", context: "formatting" }) ||
          t.day(e, { width: "narrow", context: "formatting" })
        );
    }
  }
  validate(e, r) {
    return r >= 0 && r <= 6;
  }
  set(e, r, t, n) {
    return ((e = L(e, t, n)), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "c", "t", "T"];
}
class Ee extends i {
  priority = 90;
  parse(e, r, t, n) {
    const o = (c) => {
      const h = Math.floor((c - 1) / 7) * 7;
      return ((c + n.weekStartsOn + 6) % 7) + h;
    };
    switch (r) {
      case "c":
      case "cc":
        return f(d(r.length, e), o);
      case "co":
        return f(t.ordinalNumber(e, { unit: "day" }), o);
      case "ccc":
        return (
          t.day(e, { width: "abbreviated", context: "standalone" }) ||
          t.day(e, { width: "short", context: "standalone" }) ||
          t.day(e, { width: "narrow", context: "standalone" })
        );
      case "ccccc":
        return t.day(e, { width: "narrow", context: "standalone" });
      case "cccccc":
        return (
          t.day(e, { width: "short", context: "standalone" }) || t.day(e, { width: "narrow", context: "standalone" })
        );
      case "cccc":
      default:
        return (
          t.day(e, { width: "wide", context: "standalone" }) ||
          t.day(e, { width: "abbreviated", context: "standalone" }) ||
          t.day(e, { width: "short", context: "standalone" }) ||
          t.day(e, { width: "narrow", context: "standalone" })
        );
    }
  }
  validate(e, r) {
    return r >= 0 && r <= 6;
  }
  set(e, r, t, n) {
    return ((e = L(e, t, n)), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "e", "t", "T"];
}
function He(s, e, r) {
  const t = D(s, r?.in),
    n = ne(t, r),
    o = e - n;
  return I(t, o, r);
}
class Ie extends i {
  priority = 90;
  parse(e, r, t) {
    const n = (o) => (o === 0 ? 7 : o);
    switch (r) {
      case "i":
      case "ii":
        return d(r.length, e);
      case "io":
        return t.ordinalNumber(e, { unit: "day" });
      case "iii":
        return f(
          t.day(e, { width: "abbreviated", context: "formatting" }) ||
            t.day(e, { width: "short", context: "formatting" }) ||
            t.day(e, { width: "narrow", context: "formatting" }),
          n,
        );
      case "iiiii":
        return f(t.day(e, { width: "narrow", context: "formatting" }), n);
      case "iiiiii":
        return f(
          t.day(e, { width: "short", context: "formatting" }) || t.day(e, { width: "narrow", context: "formatting" }),
          n,
        );
      case "iiii":
      default:
        return f(
          t.day(e, { width: "wide", context: "formatting" }) ||
            t.day(e, { width: "abbreviated", context: "formatting" }) ||
            t.day(e, { width: "short", context: "formatting" }) ||
            t.day(e, { width: "narrow", context: "formatting" }),
          n,
        );
    }
  }
  validate(e, r) {
    return r >= 1 && r <= 7;
  }
  set(e, r, t) {
    return ((e = He(e, t)), e.setHours(0, 0, 0, 0), e);
  }
  incompatibleTokens = ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "E", "e", "c", "t", "T"];
}
class qe extends i {
  priority = 80;
  parse(e, r, t) {
    switch (r) {
      case "a":
      case "aa":
      case "aaa":
        return (
          t.dayPeriod(e, { width: "abbreviated", context: "formatting" }) ||
          t.dayPeriod(e, { width: "narrow", context: "formatting" })
        );
      case "aaaaa":
        return t.dayPeriod(e, { width: "narrow", context: "formatting" });
      case "aaaa":
      default:
        return (
          t.dayPeriod(e, { width: "wide", context: "formatting" }) ||
          t.dayPeriod(e, { width: "abbreviated", context: "formatting" }) ||
          t.dayPeriod(e, { width: "narrow", context: "formatting" })
        );
    }
  }
  set(e, r, t) {
    return (e.setHours(q(t), 0, 0, 0), e);
  }
  incompatibleTokens = ["b", "B", "H", "k", "t", "T"];
}
class Le extends i {
  priority = 80;
  parse(e, r, t) {
    switch (r) {
      case "b":
      case "bb":
      case "bbb":
        return (
          t.dayPeriod(e, { width: "abbreviated", context: "formatting" }) ||
          t.dayPeriod(e, { width: "narrow", context: "formatting" })
        );
      case "bbbbb":
        return t.dayPeriod(e, { width: "narrow", context: "formatting" });
      case "bbbb":
      default:
        return (
          t.dayPeriod(e, { width: "wide", context: "formatting" }) ||
          t.dayPeriod(e, { width: "abbreviated", context: "formatting" }) ||
          t.dayPeriod(e, { width: "narrow", context: "formatting" })
        );
    }
  }
  set(e, r, t) {
    return (e.setHours(q(t), 0, 0, 0), e);
  }
  incompatibleTokens = ["a", "B", "H", "k", "t", "T"];
}
class Ne extends i {
  priority = 80;
  parse(e, r, t) {
    switch (r) {
      case "B":
      case "BB":
      case "BBB":
        return (
          t.dayPeriod(e, { width: "abbreviated", context: "formatting" }) ||
          t.dayPeriod(e, { width: "narrow", context: "formatting" })
        );
      case "BBBBB":
        return t.dayPeriod(e, { width: "narrow", context: "formatting" });
      case "BBBB":
      default:
        return (
          t.dayPeriod(e, { width: "wide", context: "formatting" }) ||
          t.dayPeriod(e, { width: "abbreviated", context: "formatting" }) ||
          t.dayPeriod(e, { width: "narrow", context: "formatting" })
        );
    }
  }
  set(e, r, t) {
    return (e.setHours(q(t), 0, 0, 0), e);
  }
  incompatibleTokens = ["a", "b", "t", "T"];
}
class Qe extends i {
  priority = 70;
  parse(e, r, t) {
    switch (r) {
      case "h":
        return u(w.hour12h, e);
      case "ho":
        return t.ordinalNumber(e, { unit: "hour" });
      default:
        return d(r.length, e);
    }
  }
  validate(e, r) {
    return r >= 1 && r <= 12;
  }
  set(e, r, t) {
    const n = e.getHours() >= 12;
    return (
      n && t < 12 ? e.setHours(t + 12, 0, 0, 0) : !n && t === 12 ? e.setHours(0, 0, 0, 0) : e.setHours(t, 0, 0, 0),
      e
    );
  }
  incompatibleTokens = ["H", "K", "k", "t", "T"];
}
class ve extends i {
  priority = 70;
  parse(e, r, t) {
    switch (r) {
      case "H":
        return u(w.hour23h, e);
      case "Ho":
        return t.ordinalNumber(e, { unit: "hour" });
      default:
        return d(r.length, e);
    }
  }
  validate(e, r) {
    return r >= 0 && r <= 23;
  }
  set(e, r, t) {
    return (e.setHours(t, 0, 0, 0), e);
  }
  incompatibleTokens = ["a", "b", "h", "K", "k", "t", "T"];
}
class Re extends i {
  priority = 70;
  parse(e, r, t) {
    switch (r) {
      case "K":
        return u(w.hour11h, e);
      case "Ko":
        return t.ordinalNumber(e, { unit: "hour" });
      default:
        return d(r.length, e);
    }
  }
  validate(e, r) {
    return r >= 0 && r <= 11;
  }
  set(e, r, t) {
    return (e.getHours() >= 12 && t < 12 ? e.setHours(t + 12, 0, 0, 0) : e.setHours(t, 0, 0, 0), e);
  }
  incompatibleTokens = ["h", "H", "k", "t", "T"];
}
class We extends i {
  priority = 70;
  parse(e, r, t) {
    switch (r) {
      case "k":
        return u(w.hour24h, e);
      case "ko":
        return t.ordinalNumber(e, { unit: "hour" });
      default:
        return d(r.length, e);
    }
  }
  validate(e, r) {
    return r >= 1 && r <= 24;
  }
  set(e, r, t) {
    const n = t <= 24 ? t % 24 : t;
    return (e.setHours(n, 0, 0, 0), e);
  }
  incompatibleTokens = ["a", "b", "h", "H", "K", "t", "T"];
}
class Ce extends i {
  priority = 60;
  parse(e, r, t) {
    switch (r) {
      case "m":
        return u(w.minute, e);
      case "mo":
        return t.ordinalNumber(e, { unit: "minute" });
      default:
        return d(r.length, e);
    }
  }
  validate(e, r) {
    return r >= 0 && r <= 59;
  }
  set(e, r, t) {
    return (e.setMinutes(t, 0, 0), e);
  }
  incompatibleTokens = ["t", "T"];
}
class Ae extends i {
  priority = 50;
  parse(e, r, t) {
    switch (r) {
      case "s":
        return u(w.second, e);
      case "so":
        return t.ordinalNumber(e, { unit: "second" });
      default:
        return d(r.length, e);
    }
  }
  validate(e, r) {
    return r >= 0 && r <= 59;
  }
  set(e, r, t) {
    return (e.setSeconds(t, 0), e);
  }
  incompatibleTokens = ["t", "T"];
}
class Be extends i {
  priority = 30;
  parse(e, r) {
    const t = (n) => Math.trunc(n * Math.pow(10, -r.length + 3));
    return f(d(r.length, e), t);
  }
  set(e, r, t) {
    return (e.setMilliseconds(t), e);
  }
  incompatibleTokens = ["t", "T"];
}
class Fe extends i {
  priority = 10;
  parse(e, r) {
    switch (r) {
      case "X":
        return T(m.basicOptionalMinutes, e);
      case "XX":
        return T(m.basic, e);
      case "XXXX":
        return T(m.basicOptionalSeconds, e);
      case "XXXXX":
        return T(m.extendedOptionalSeconds, e);
      case "XXX":
      default:
        return T(m.extended, e);
    }
  }
  set(e, r, t) {
    return r.timestampIsSet ? e : y(e, e.getTime() - B(e) - t);
  }
  incompatibleTokens = ["t", "T", "x"];
}
class Ge extends i {
  priority = 10;
  parse(e, r) {
    switch (r) {
      case "x":
        return T(m.basicOptionalMinutes, e);
      case "xx":
        return T(m.basic, e);
      case "xxxx":
        return T(m.basicOptionalSeconds, e);
      case "xxxxx":
        return T(m.extendedOptionalSeconds, e);
      case "xxx":
      default:
        return T(m.extended, e);
    }
  }
  set(e, r, t) {
    return r.timestampIsSet ? e : y(e, e.getTime() - B(e) - t);
  }
  incompatibleTokens = ["t", "T", "X"];
}
class Xe extends i {
  priority = 40;
  parse(e) {
    return X(e);
  }
  set(e, r, t) {
    return [y(e, t * 1e3), { timestampIsSet: !0 }];
  }
  incompatibleTokens = "*";
}
class ze extends i {
  priority = 20;
  parse(e) {
    return X(e);
  }
  set(e, r, t) {
    return [y(e, t), { timestampIsSet: !0 }];
  }
  incompatibleTokens = "*";
}
const Ze = {
    G: new le(),
    y: new de(),
    Y: new we(),
    R: new fe(),
    u: new he(),
    Q: new ye(),
    q: new be(),
    M: new xe(),
    L: new pe(),
    w: new Te(),
    I: new ke(),
    d: new Me(),
    D: new _e(),
    E: new Ye(),
    e: new Oe(),
    c: new Ee(),
    i: new Ie(),
    a: new qe(),
    b: new Le(),
    B: new Ne(),
    h: new Qe(),
    H: new ve(),
    K: new Re(),
    k: new We(),
    m: new Ce(),
    s: new Ae(),
    S: new Be(),
    X: new Fe(),
    x: new Ge(),
    t: new Xe(),
    T: new ze(),
  },
  Ke = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
  $e = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
  Ve = /^'([^]*?)'?$/,
  je = /''/g,
  Ue = /\S/,
  Je = /[a-zA-Z]/;
function nt(s, e, r, t) {
  const n = () => y(t?.in || r, NaN),
    o = se(),
    c = t?.locale ?? o.locale ?? ee,
    h =
      t?.firstWeekContainsDate ??
      t?.locale?.options?.firstWeekContainsDate ??
      o.firstWeekContainsDate ??
      o.locale?.options?.firstWeekContainsDate ??
      1,
    g = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? o.weekStartsOn ?? o.locale?.options?.weekStartsOn ?? 0;
  if (!e) return s ? n() : D(r, t?.in);
  const b = { firstWeekContainsDate: h, weekStartsOn: g, locale: c },
    x = [new ue(t?.in, r)],
    M = e
      .match($e)
      .map((a) => {
        const l = a[0];
        if (l in R) {
          const p = R[l];
          return p(a, c.formatLong);
        }
        return a;
      })
      .join("")
      .match(Ke),
    P = [];
  for (let a of M) {
    (!t?.useAdditionalWeekYearTokens && te(a) && W(a, e, s), !t?.useAdditionalDayOfYearTokens && re(a) && W(a, e, s));
    const l = a[0],
      p = Ze[l];
    if (p) {
      const { incompatibleTokens: N } = p;
      if (Array.isArray(N)) {
        const Q = P.find((v) => N.includes(v.token) || v.token === l);
        if (Q)
          throw new RangeError(`The format string mustn't contain \`${Q.fullToken}\` and \`${a}\` at the same time`);
      } else if (p.incompatibleTokens === "*" && P.length > 0)
        throw new RangeError(`The format string mustn't contain \`${a}\` and any other token at the same time`);
      P.push({ token: l, fullToken: a });
      const E = p.run(s, a, c.match, b);
      if (!E) return n();
      (x.push(E.setter), (s = E.rest));
    } else {
      if (l.match(Je)) throw new RangeError("Format string contains an unescaped latin alphabet character `" + l + "`");
      if ((a === "''" ? (a = "'") : l === "'" && (a = Se(a)), s.indexOf(a) === 0)) s = s.slice(a.length);
      else return n();
    }
  }
  if (s.length > 0 && Ue.test(s)) return n();
  const _ = x
    .map((a) => a.priority)
    .sort((a, l) => l - a)
    .filter((a, l, p) => p.indexOf(a) === l)
    .map((a) => x.filter((l) => l.priority === a).sort((l, p) => p.subPriority - l.subPriority))
    .map((a) => a[0]);
  let k = D(r, t?.in);
  if (isNaN(+k)) return n();
  const Y = {};
  for (const a of _) {
    if (!a.validate(k, b)) return n();
    const l = a.set(k, Y, b);
    Array.isArray(l) ? ((k = l[0]), Object.assign(Y, l[1])) : (k = l);
  }
  return k;
}
function Se(s) {
  return s.match(Ve)[1].replace(je, "'");
}
function et(s, e, r) {
  return F(s, -e, r);
}
function ot(s, e, r) {
  const { years: t = 0, months: n = 0, weeks: o = 0, days: c = 0, hours: h = 0, minutes: g = 0, seconds: b = 0 } = e,
    x = et(s, n + t * 12, r),
    M = K(x, c + o * 7, r),
    P = g + h * 60,
    k = (b + P * 60) * 1e3;
  return y(r?.in || s, +M - k);
}
export {
  st as a,
  F as b,
  ne as c,
  Ze as d,
  He as e,
  De as f,
  se as g,
  me as h,
  ot as i,
  et as j,
  nt as p,
  L as s,
  oe as t,
};
