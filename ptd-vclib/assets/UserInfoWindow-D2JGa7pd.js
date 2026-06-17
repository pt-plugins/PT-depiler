import { r as kt } from "../vendor/es-toolkit/range-D3V44zw2.js";
import {
  ab as cs,
  b as be,
  be as da,
  bK as fa,
  bC as _e,
  ch as Ue,
  bg as ha,
  H as ue,
  b5 as bn,
  b3 as ze,
  br as se,
  D as de,
  U as Y,
  bJ as ma,
  Q as he,
  F as ya,
  b2 as ga,
  bf as ds,
  b0 as yn,
  bY as va,
  X as wa,
  I as gn,
  ck as Ne,
  bj as vn,
  bS as oe,
  c4 as D,
  J as Zr,
} from "../vendor/packages/site/index-COeZNva1.js";
import { r as pa } from "./___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import { E as ka } from "../vendor/packages/site/types/base-Dy_28wGT.js";
import { g as qr } from "../vendor/date-fns/format-b1gG6cM7.js";
import {
  ax as qt,
  c9 as fs,
  by as Sa,
  bY as Yt,
  bp as xt,
  am as Ta,
  a3 as hs,
  av as Oa,
  bS as ms,
  bX as bt,
  c as Dn,
  ad as Yr,
  bC as Ma,
  bm as xn,
  N as Br,
  aQ as Ia,
  be as ba,
  bN as Da,
  bz as xa,
  bV as Na,
  T as wn,
  n as _a,
  A as Jr,
  H as Ea,
  W as St,
} from "./src/entries/options/index-DmNe5UVo.js";
import { b as Gr } from "./utils-DF6YUpNn.js";
import { V as Va } from "../vendor/vuetify/VNumberInput-ZpDwJV6p.js";
import { V as Tt } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { V as jr } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
var pn, Kr;
function Ca() {
  if (Kr) return pn;
  Kr = 1;
  function i(v) {
    if (typeof v != "number") throw new TypeError("Expected a number");
    return {
      days: Math.trunc(v / 864e5),
      hours: Math.trunc(v / 36e5) % 24,
      minutes: Math.trunc(v / 6e4) % 60,
      seconds: Math.trunc(v / 1e3) % 60,
      ms: Math.trunc(v) % 1e3,
    };
  }
  function w(v, h) {
    h = h || 2;
    let l = v.toString(),
      g = 0;
    return ((g = h - l.length + 1), (l = new Array(g).join("0").concat(l)), l);
  }
  function m(v, h) {
    return h ? (v < 0 ? "-" : "") : v <= -1e3 ? "-" : "";
  }
  function f(v, h) {
    const l = h && h.leading,
      g = h && h.ms,
      o = v < 0 ? -v : v,
      p = m(v, g),
      y = i(o),
      k = w(y.seconds);
    let S = "";
    return (
      y.days && !S && (S = p + y.days + ":" + w(y.hours) + ":" + w(y.minutes) + ":" + k),
      y.hours && !S && (S = p + (l ? w(y.hours) : y.hours) + ":" + w(y.minutes) + ":" + k),
      S || (S = p + (l ? w(y.minutes) : y.minutes) + ":" + k),
      g && (S += "." + w(y.ms, 3)),
      S
    );
  }
  return ((pn = f), pn);
}
var Fa = Ca();
const Wa = cs(Fa);
var me = {},
  Qr;
function La() {
  if (Qr) return me;
  ((Qr = 1), Object.defineProperty(me, "__esModule", { value: !0 }));
  class i extends Error {}
  class w extends i {
    constructor(e) {
      super(`Invalid DateTime: ${e.toMessage()}`);
    }
  }
  class m extends i {
    constructor(e) {
      super(`Invalid Interval: ${e.toMessage()}`);
    }
  }
  class f extends i {
    constructor(e) {
      super(`Invalid Duration: ${e.toMessage()}`);
    }
  }
  class v extends i {}
  class h extends i {
    constructor(e) {
      super(`Invalid unit ${e}`);
    }
  }
  class l extends i {}
  class g extends i {
    constructor() {
      super("Zone is an abstract class");
    }
  }
  const o = "numeric",
    p = "short",
    y = "long",
    k = { year: o, month: o, day: o },
    S = { year: o, month: p, day: o },
    T = { year: o, month: p, day: o, weekday: p },
    M = { year: o, month: y, day: o },
    N = { year: o, month: y, day: o, weekday: y },
    x = { hour: o, minute: o },
    L = { hour: o, minute: o, second: o },
    A = { hour: o, minute: o, second: o, timeZoneName: p },
    H = { hour: o, minute: o, second: o, timeZoneName: y },
    X = { hour: o, minute: o, hourCycle: "h23" },
    V = { hour: o, minute: o, second: o, hourCycle: "h23" },
    $ = { hour: o, minute: o, second: o, hourCycle: "h23", timeZoneName: p },
    G = { hour: o, minute: o, second: o, hourCycle: "h23", timeZoneName: y },
    ee = { year: o, month: o, day: o, hour: o, minute: o },
    ie = { year: o, month: o, day: o, hour: o, minute: o, second: o },
    R = { year: o, month: p, day: o, hour: o, minute: o },
    ae = { year: o, month: p, day: o, hour: o, minute: o, second: o },
    De = { year: o, month: p, day: o, weekday: p, hour: o, minute: o },
    I = { year: o, month: y, day: o, hour: o, minute: o, timeZoneName: p },
    C = { year: o, month: y, day: o, hour: o, minute: o, second: o, timeZoneName: p },
    fe = { year: o, month: y, day: o, weekday: y, hour: o, minute: o, timeZoneName: y },
    B = { year: o, month: y, day: o, weekday: y, hour: o, minute: o, second: o, timeZoneName: y };
  class te {
    get type() {
      throw new g();
    }
    get name() {
      throw new g();
    }
    get ianaName() {
      return this.name;
    }
    get isUniversal() {
      throw new g();
    }
    offsetName(e, t) {
      throw new g();
    }
    formatOffset(e, t) {
      throw new g();
    }
    offset(e) {
      throw new g();
    }
    equals(e) {
      throw new g();
    }
    get isValid() {
      throw new g();
    }
  }
  let ye = null;
  class ge extends te {
    static get instance() {
      return (ye === null && (ye = new ge()), ye);
    }
    get type() {
      return "system";
    }
    get name() {
      return new Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    get isUniversal() {
      return !1;
    }
    offsetName(e, { format: t, locale: r }) {
      return nr(e, t, r);
    }
    formatOffset(e, t) {
      return ct(this.offset(e), t);
    }
    offset(e) {
      return -new Date(e).getTimezoneOffset();
    }
    equals(e) {
      return e.type === "system";
    }
    get isValid() {
      return !0;
    }
  }
  const b = new Map();
  function P(n) {
    let e = b.get(n);
    return (
      e === void 0 &&
        ((e = new Intl.DateTimeFormat("en-US", {
          hour12: !1,
          timeZone: n,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          era: "short",
        })),
        b.set(n, e)),
      e
    );
  }
  const j = { year: 0, month: 1, day: 2, era: 3, hour: 4, minute: 5, second: 6 };
  function Ve(n, e) {
    const t = n.format(e).replace(/\u200E/g, ""),
      r = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(t),
      [, s, a, u, c, d, O, _] = r;
    return [u, s, a, c, d, O, _];
  }
  function rt(n, e) {
    const t = n.formatToParts(e),
      r = [];
    for (let s = 0; s < t.length; s++) {
      const { type: a, value: u } = t[s],
        c = j[a];
      a === "era" ? (r[c] = u) : F(c) || (r[c] = parseInt(u, 10));
    }
    return r;
  }
  const st = new Map();
  class ve extends te {
    static create(e) {
      let t = st.get(e);
      return (t === void 0 && st.set(e, (t = new ve(e))), t);
    }
    static resetCache() {
      (st.clear(), b.clear());
    }
    static isValidSpecifier(e) {
      return this.isValidZone(e);
    }
    static isValidZone(e) {
      if (!e) return !1;
      try {
        return (new Intl.DateTimeFormat("en-US", { timeZone: e }).format(), !0);
      } catch {
        return !1;
      }
    }
    constructor(e) {
      (super(), (this.zoneName = e), (this.valid = ve.isValidZone(e)));
    }
    get type() {
      return "iana";
    }
    get name() {
      return this.zoneName;
    }
    get isUniversal() {
      return !1;
    }
    offsetName(e, { format: t, locale: r }) {
      return nr(e, t, r, this.name);
    }
    formatOffset(e, t) {
      return ct(this.offset(e), t);
    }
    offset(e) {
      if (!this.valid) return NaN;
      const t = new Date(e);
      if (isNaN(t)) return NaN;
      const r = P(this.name);
      let [s, a, u, c, d, O, _] = r.formatToParts ? rt(r, t) : Ve(r, t);
      c === "BC" && (s = -Math.abs(s) + 1);
      const J = Wt({ year: s, month: a, day: u, hour: d === 24 ? 0 : d, minute: O, second: _, millisecond: 0 });
      let E = +t;
      const re = E % 1e3;
      return ((E -= re >= 0 ? re : 1e3 + re), (J - E) / (60 * 1e3));
    }
    equals(e) {
      return e.type === "iana" && e.name === this.name;
    }
    get isValid() {
      return this.valid;
    }
  }
  let it = {};
  function _t(n, e = {}) {
    const t = JSON.stringify([n, e]);
    let r = it[t];
    return (r || ((r = new Intl.ListFormat(n, e)), (it[t] = r)), r);
  }
  const He = new Map();
  function Ze(n, e = {}) {
    const t = JSON.stringify([n, e]);
    let r = He.get(t);
    return (r === void 0 && ((r = new Intl.DateTimeFormat(n, e)), He.set(t, r)), r);
  }
  const at = new Map();
  function Ce(n, e = {}) {
    const t = JSON.stringify([n, e]);
    let r = at.get(t);
    return (r === void 0 && ((r = new Intl.NumberFormat(n, e)), at.set(t, r)), r);
  }
  const Fe = new Map();
  function ks(n, e = {}) {
    const { base: t, ...r } = e,
      s = JSON.stringify([n, r]);
    let a = Fe.get(s);
    return (a === void 0 && ((a = new Intl.RelativeTimeFormat(n, e)), Fe.set(s, a)), a);
  }
  let ot = null;
  function Ss() {
    return ot || ((ot = new Intl.DateTimeFormat().resolvedOptions().locale), ot);
  }
  const Bt = new Map();
  function En(n) {
    let e = Bt.get(n);
    return (e === void 0 && ((e = new Intl.DateTimeFormat(n).resolvedOptions()), Bt.set(n, e)), e);
  }
  const Jt = new Map();
  function Ts(n) {
    let e = Jt.get(n);
    if (!e) {
      const t = new Intl.Locale(n);
      ((e = "getWeekInfo" in t ? t.getWeekInfo() : t.weekInfo),
        "minimalDays" in e || (e = { ...Vn, ...e }),
        Jt.set(n, e));
    }
    return e;
  }
  function Os(n) {
    const e = n.indexOf("-x-");
    e !== -1 && (n = n.substring(0, e));
    const t = n.indexOf("-u-");
    if (t === -1) return [n];
    {
      let r, s;
      try {
        ((r = Ze(n).resolvedOptions()), (s = n));
      } catch {
        const d = n.substring(0, t);
        ((r = Ze(d).resolvedOptions()), (s = d));
      }
      const { numberingSystem: a, calendar: u } = r;
      return [s, a, u];
    }
  }
  function Ms(n, e, t) {
    return ((t || e) && (n.includes("-u-") || (n += "-u"), t && (n += `-ca-${t}`), e && (n += `-nu-${e}`)), n);
  }
  function Is(n) {
    const e = [];
    for (let t = 1; t <= 12; t++) {
      const r = W.utc(2009, t, 1);
      e.push(n(r));
    }
    return e;
  }
  function bs(n) {
    const e = [];
    for (let t = 1; t <= 7; t++) {
      const r = W.utc(2016, 11, 13 + t);
      e.push(n(r));
    }
    return e;
  }
  function Et(n, e, t, r) {
    const s = n.listingMode();
    return s === "error" ? null : s === "en" ? t(e) : r(e);
  }
  function Ds(n) {
    return n.numberingSystem && n.numberingSystem !== "latn"
      ? !1
      : n.numberingSystem === "latn" ||
          !n.locale ||
          n.locale.startsWith("en") ||
          En(n.locale).numberingSystem === "latn";
  }
  class xs {
    constructor(e, t, r) {
      ((this.padTo = r.padTo || 0), (this.floor = r.floor || !1));
      const { padTo: s, floor: a, ...u } = r;
      if (!t || Object.keys(u).length > 0) {
        const c = { useGrouping: !1, ...r };
        (r.padTo > 0 && (c.minimumIntegerDigits = r.padTo), (this.inf = Ce(e, c)));
      }
    }
    format(e) {
      if (this.inf) {
        const t = this.floor ? Math.floor(e) : e;
        return this.inf.format(t);
      } else {
        const t = this.floor ? Math.floor(e) : rn(e, 3);
        return ne(t, this.padTo);
      }
    }
  }
  class Ns {
    constructor(e, t, r) {
      ((this.opts = r), (this.originalZone = void 0));
      let s;
      if (this.opts.timeZone) this.dt = e;
      else if (e.zone.type === "fixed") {
        const u = -1 * (e.offset / 60),
          c = u >= 0 ? `Etc/GMT+${u}` : `Etc/GMT${u}`;
        e.offset !== 0 && ve.create(c).valid
          ? ((s = c), (this.dt = e))
          : ((s = "UTC"),
            (this.dt = e.offset === 0 ? e : e.setZone("UTC").plus({ minutes: e.offset })),
            (this.originalZone = e.zone));
      } else
        e.zone.type === "system"
          ? (this.dt = e)
          : e.zone.type === "iana"
            ? ((this.dt = e), (s = e.zone.name))
            : ((s = "UTC"), (this.dt = e.setZone("UTC").plus({ minutes: e.offset })), (this.originalZone = e.zone));
      const a = { ...this.opts };
      ((a.timeZone = a.timeZone || s), (this.dtf = Ze(t, a)));
    }
    format() {
      return this.originalZone
        ? this.formatToParts()
            .map(({ value: e }) => e)
            .join("")
        : this.dtf.format(this.dt.toJSDate());
    }
    formatToParts() {
      const e = this.dtf.formatToParts(this.dt.toJSDate());
      return this.originalZone
        ? e.map((t) => {
            if (t.type === "timeZoneName") {
              const r = this.originalZone.offsetName(this.dt.ts, {
                locale: this.dt.locale,
                format: this.opts.timeZoneName,
              });
              return { ...t, value: r };
            } else return t;
          })
        : e;
    }
    resolvedOptions() {
      return this.dtf.resolvedOptions();
    }
  }
  class _s {
    constructor(e, t, r) {
      ((this.opts = { style: "long", ...r }), !t && Qn() && (this.rtf = ks(e, r)));
    }
    format(e, t) {
      return this.rtf ? this.rtf.format(e, t) : Ks(t, e, this.opts.numeric, this.opts.style !== "long");
    }
    formatToParts(e, t) {
      return this.rtf ? this.rtf.formatToParts(e, t) : [];
    }
  }
  const Vn = { firstDay: 1, minimalDays: 4, weekend: [6, 7] };
  class q {
    static fromOpts(e) {
      return q.create(e.locale, e.numberingSystem, e.outputCalendar, e.weekSettings, e.defaultToEN);
    }
    static create(e, t, r, s, a = !1) {
      const u = e || K.defaultLocale,
        c = u || (a ? "en-US" : Ss()),
        d = t || K.defaultNumberingSystem,
        O = r || K.defaultOutputCalendar,
        _ = tn(s) || K.defaultWeekSettings;
      return new q(c, d, O, _, u);
    }
    static resetCache() {
      ((ot = null), He.clear(), at.clear(), Fe.clear(), Bt.clear(), Jt.clear());
    }
    static fromObject({ locale: e, numberingSystem: t, outputCalendar: r, weekSettings: s } = {}) {
      return q.create(e, t, r, s);
    }
    constructor(e, t, r, s, a) {
      const [u, c, d] = Os(e);
      ((this.locale = u),
        (this.numberingSystem = t || c || null),
        (this.outputCalendar = r || d || null),
        (this.weekSettings = s),
        (this.intl = Ms(this.locale, this.numberingSystem, this.outputCalendar)),
        (this.weekdaysCache = { format: {}, standalone: {} }),
        (this.monthsCache = { format: {}, standalone: {} }),
        (this.meridiemCache = null),
        (this.eraCache = {}),
        (this.specifiedLocale = a),
        (this.fastNumbersCached = null));
    }
    get fastNumbers() {
      return (this.fastNumbersCached == null && (this.fastNumbersCached = Ds(this)), this.fastNumbersCached);
    }
    listingMode() {
      const e = this.isEnglish(),
        t =
          (this.numberingSystem === null || this.numberingSystem === "latn") &&
          (this.outputCalendar === null || this.outputCalendar === "gregory");
      return e && t ? "en" : "intl";
    }
    clone(e) {
      return !e || Object.getOwnPropertyNames(e).length === 0
        ? this
        : q.create(
            e.locale || this.specifiedLocale,
            e.numberingSystem || this.numberingSystem,
            e.outputCalendar || this.outputCalendar,
            tn(e.weekSettings) || this.weekSettings,
            e.defaultToEN || !1,
          );
    }
    redefaultToEN(e = {}) {
      return this.clone({ ...e, defaultToEN: !0 });
    }
    redefaultToSystem(e = {}) {
      return this.clone({ ...e, defaultToEN: !1 });
    }
    months(e, t = !1) {
      return Et(this, e, ir, () => {
        const r = this.intl === "ja" || this.intl.startsWith("ja-");
        t &= !r;
        const s = t ? { month: e, day: "numeric" } : { month: e },
          a = t ? "format" : "standalone";
        if (!this.monthsCache[a][e]) {
          const u = r ? (c) => this.dtFormatter(c, s).format() : (c) => this.extract(c, s, "month");
          this.monthsCache[a][e] = Is(u);
        }
        return this.monthsCache[a][e];
      });
    }
    weekdays(e, t = !1) {
      return Et(this, e, ur, () => {
        const r = t ? { weekday: e, year: "numeric", month: "long", day: "numeric" } : { weekday: e },
          s = t ? "format" : "standalone";
        return (
          this.weekdaysCache[s][e] || (this.weekdaysCache[s][e] = bs((a) => this.extract(a, r, "weekday"))),
          this.weekdaysCache[s][e]
        );
      });
    }
    meridiems() {
      return Et(
        this,
        void 0,
        () => lr,
        () => {
          if (!this.meridiemCache) {
            const e = { hour: "numeric", hourCycle: "h12" };
            this.meridiemCache = [W.utc(2016, 11, 13, 9), W.utc(2016, 11, 13, 19)].map((t) =>
              this.extract(t, e, "dayperiod"),
            );
          }
          return this.meridiemCache;
        },
      );
    }
    eras(e) {
      return Et(this, e, cr, () => {
        const t = { era: e };
        return (
          this.eraCache[e] ||
            (this.eraCache[e] = [W.utc(-40, 1, 1), W.utc(2017, 1, 1)].map((r) => this.extract(r, t, "era"))),
          this.eraCache[e]
        );
      });
    }
    extract(e, t, r) {
      const s = this.dtFormatter(e, t),
        a = s.formatToParts(),
        u = a.find((c) => c.type.toLowerCase() === r);
      return u ? u.value : null;
    }
    numberFormatter(e = {}) {
      return new xs(this.intl, e.forceSimple || this.fastNumbers, e);
    }
    dtFormatter(e, t = {}) {
      return new Ns(e, this.intl, t);
    }
    relFormatter(e = {}) {
      return new _s(this.intl, this.isEnglish(), e);
    }
    listFormatter(e = {}) {
      return _t(this.intl, e);
    }
    isEnglish() {
      return this.locale === "en" || this.locale.toLowerCase() === "en-us" || En(this.intl).locale.startsWith("en-us");
    }
    getWeekSettings() {
      return this.weekSettings ? this.weekSettings : Xn() ? Ts(this.locale) : Vn;
    }
    getStartOfWeek() {
      return this.getWeekSettings().firstDay;
    }
    getMinDaysInFirstWeek() {
      return this.getWeekSettings().minimalDays;
    }
    getWeekendDays() {
      return this.getWeekSettings().weekend;
    }
    equals(e) {
      return (
        this.locale === e.locale &&
        this.numberingSystem === e.numberingSystem &&
        this.outputCalendar === e.outputCalendar
      );
    }
    toString() {
      return `Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`;
    }
  }
  let Gt = null;
  class le extends te {
    static get utcInstance() {
      return (Gt === null && (Gt = new le(0)), Gt);
    }
    static instance(e) {
      return e === 0 ? le.utcInstance : new le(e);
    }
    static parseSpecifier(e) {
      if (e) {
        const t = e.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
        if (t) return new le(Lt(t[1], t[2]));
      }
      return null;
    }
    constructor(e) {
      (super(), (this.fixed = e));
    }
    get type() {
      return "fixed";
    }
    get name() {
      return this.fixed === 0 ? "UTC" : `UTC${ct(this.fixed, "narrow")}`;
    }
    get ianaName() {
      return this.fixed === 0 ? "Etc/UTC" : `Etc/GMT${ct(-this.fixed, "narrow")}`;
    }
    offsetName() {
      return this.name;
    }
    formatOffset(e, t) {
      return ct(this.fixed, t);
    }
    get isUniversal() {
      return !0;
    }
    offset() {
      return this.fixed;
    }
    equals(e) {
      return e.type === "fixed" && e.fixed === this.fixed;
    }
    get isValid() {
      return !0;
    }
  }
  class Cn extends te {
    constructor(e) {
      (super(), (this.zoneName = e));
    }
    get type() {
      return "invalid";
    }
    get name() {
      return this.zoneName;
    }
    get isUniversal() {
      return !1;
    }
    offsetName() {
      return null;
    }
    formatOffset() {
      return "";
    }
    offset() {
      return NaN;
    }
    equals() {
      return !1;
    }
    get isValid() {
      return !1;
    }
  }
  function We(n, e) {
    if (F(n) || n === null) return e;
    if (n instanceof te) return n;
    if (Ls(n)) {
      const t = n.toLowerCase();
      return t === "default"
        ? e
        : t === "local" || t === "system"
          ? ge.instance
          : t === "utc" || t === "gmt"
            ? le.utcInstance
            : le.parseSpecifier(t) || ve.create(n);
    } else
      return Le(n)
        ? le.instance(n)
        : typeof n == "object" && "offset" in n && typeof n.offset == "function"
          ? n
          : new Cn(n);
  }
  const jt = {
      arab: "[٠-٩]",
      arabext: "[۰-۹]",
      bali: "[᭐-᭙]",
      beng: "[০-৯]",
      deva: "[०-९]",
      fullwide: "[０-９]",
      gujr: "[૦-૯]",
      hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
      khmr: "[០-៩]",
      knda: "[೦-೯]",
      laoo: "[໐-໙]",
      limb: "[᥆-᥏]",
      mlym: "[൦-൯]",
      mong: "[᠐-᠙]",
      mymr: "[၀-၉]",
      orya: "[୦-୯]",
      tamldec: "[௦-௯]",
      telu: "[౦-౯]",
      thai: "[๐-๙]",
      tibt: "[༠-༩]",
      latn: "\\d",
    },
    Fn = {
      arab: [1632, 1641],
      arabext: [1776, 1785],
      bali: [6992, 7001],
      beng: [2534, 2543],
      deva: [2406, 2415],
      fullwide: [65296, 65303],
      gujr: [2790, 2799],
      khmr: [6112, 6121],
      knda: [3302, 3311],
      laoo: [3792, 3801],
      limb: [6470, 6479],
      mlym: [3430, 3439],
      mong: [6160, 6169],
      mymr: [4160, 4169],
      orya: [2918, 2927],
      tamldec: [3046, 3055],
      telu: [3174, 3183],
      thai: [3664, 3673],
      tibt: [3872, 3881],
    },
    Es = jt.hanidec.replace(/[\[|\]]/g, "").split("");
  function Vs(n) {
    let e = parseInt(n, 10);
    if (isNaN(e)) {
      e = "";
      for (let t = 0; t < n.length; t++) {
        const r = n.charCodeAt(t);
        if (n[t].search(jt.hanidec) !== -1) e += Es.indexOf(n[t]);
        else
          for (const s in Fn) {
            const [a, u] = Fn[s];
            r >= a && r <= u && (e += r - a);
          }
      }
      return parseInt(e, 10);
    } else return e;
  }
  const Kt = new Map();
  function Cs() {
    Kt.clear();
  }
  function Te({ numberingSystem: n }, e = "") {
    const t = n || "latn";
    let r = Kt.get(t);
    r === void 0 && ((r = new Map()), Kt.set(t, r));
    let s = r.get(e);
    return (s === void 0 && ((s = new RegExp(`${jt[t]}${e}`)), r.set(e, s)), s);
  }
  let Wn = () => Date.now(),
    Ln = "system",
    An = null,
    Un = null,
    $n = null,
    Rn = 60,
    Pn,
    zn = null;
  class K {
    static get now() {
      return Wn;
    }
    static set now(e) {
      Wn = e;
    }
    static set defaultZone(e) {
      Ln = e;
    }
    static get defaultZone() {
      return We(Ln, ge.instance);
    }
    static get defaultLocale() {
      return An;
    }
    static set defaultLocale(e) {
      An = e;
    }
    static get defaultNumberingSystem() {
      return Un;
    }
    static set defaultNumberingSystem(e) {
      Un = e;
    }
    static get defaultOutputCalendar() {
      return $n;
    }
    static set defaultOutputCalendar(e) {
      $n = e;
    }
    static get defaultWeekSettings() {
      return zn;
    }
    static set defaultWeekSettings(e) {
      zn = tn(e);
    }
    static get twoDigitCutoffYear() {
      return Rn;
    }
    static set twoDigitCutoffYear(e) {
      Rn = e % 100;
    }
    static get throwOnInvalid() {
      return Pn;
    }
    static set throwOnInvalid(e) {
      Pn = e;
    }
    static resetCaches() {
      (q.resetCache(), ve.resetCache(), W.resetCache(), Cs());
    }
  }
  class Oe {
    constructor(e, t) {
      ((this.reason = e), (this.explanation = t));
    }
    toMessage() {
      return this.explanation ? `${this.reason}: ${this.explanation}` : this.reason;
    }
  }
  const Hn = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
    Zn = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
  function we(n, e) {
    return new Oe("unit out of range", `you specified ${e} (of type ${typeof e}) as a ${n}, which is invalid`);
  }
  function Qt(n, e, t) {
    const r = new Date(Date.UTC(n, e - 1, t));
    n < 100 && n >= 0 && r.setUTCFullYear(r.getUTCFullYear() - 1900);
    const s = r.getUTCDay();
    return s === 0 ? 7 : s;
  }
  function qn(n, e, t) {
    return t + (ut(n) ? Zn : Hn)[e - 1];
  }
  function Yn(n, e) {
    const t = ut(n) ? Zn : Hn,
      r = t.findIndex((a) => a < e),
      s = e - t[r];
    return { month: r + 1, day: s };
  }
  function Xt(n, e) {
    return ((n - e + 7) % 7) + 1;
  }
  function Vt(n, e = 4, t = 1) {
    const { year: r, month: s, day: a } = n,
      u = qn(r, s, a),
      c = Xt(Qt(r, s, a), t);
    let d = Math.floor((u - c + 14 - e) / 7),
      O;
    return (
      d < 1 ? ((O = r - 1), (d = lt(O, e, t))) : d > lt(r, e, t) ? ((O = r + 1), (d = 1)) : (O = r),
      { weekYear: O, weekNumber: d, weekday: c, ...Ut(n) }
    );
  }
  function Bn(n, e = 4, t = 1) {
    const { weekYear: r, weekNumber: s, weekday: a } = n,
      u = Xt(Qt(r, 1, e), t),
      c = Ye(r);
    let d = s * 7 + a - u - 7 + e,
      O;
    d < 1 ? ((O = r - 1), (d += Ye(O))) : d > c ? ((O = r + 1), (d -= Ye(r))) : (O = r);
    const { month: _, day: U } = Yn(O, d);
    return { year: O, month: _, day: U, ...Ut(n) };
  }
  function en(n) {
    const { year: e, month: t, day: r } = n,
      s = qn(e, t, r);
    return { year: e, ordinal: s, ...Ut(n) };
  }
  function Jn(n) {
    const { year: e, ordinal: t } = n,
      { month: r, day: s } = Yn(e, t);
    return { year: e, month: r, day: s, ...Ut(n) };
  }
  function Gn(n, e) {
    if (!F(n.localWeekday) || !F(n.localWeekNumber) || !F(n.localWeekYear)) {
      if (!F(n.weekday) || !F(n.weekNumber) || !F(n.weekYear))
        throw new v("Cannot mix locale-based week fields with ISO-based week fields");
      return (
        F(n.localWeekday) || (n.weekday = n.localWeekday),
        F(n.localWeekNumber) || (n.weekNumber = n.localWeekNumber),
        F(n.localWeekYear) || (n.weekYear = n.localWeekYear),
        delete n.localWeekday,
        delete n.localWeekNumber,
        delete n.localWeekYear,
        { minDaysInFirstWeek: e.getMinDaysInFirstWeek(), startOfWeek: e.getStartOfWeek() }
      );
    } else return { minDaysInFirstWeek: 4, startOfWeek: 1 };
  }
  function Fs(n, e = 4, t = 1) {
    const r = Ct(n.weekYear),
      s = pe(n.weekNumber, 1, lt(n.weekYear, e, t)),
      a = pe(n.weekday, 1, 7);
    return r ? (s ? (a ? !1 : we("weekday", n.weekday)) : we("week", n.weekNumber)) : we("weekYear", n.weekYear);
  }
  function Ws(n) {
    const e = Ct(n.year),
      t = pe(n.ordinal, 1, Ye(n.year));
    return e ? (t ? !1 : we("ordinal", n.ordinal)) : we("year", n.year);
  }
  function jn(n) {
    const e = Ct(n.year),
      t = pe(n.month, 1, 12),
      r = pe(n.day, 1, Ft(n.year, n.month));
    return e ? (t ? (r ? !1 : we("day", n.day)) : we("month", n.month)) : we("year", n.year);
  }
  function Kn(n) {
    const { hour: e, minute: t, second: r, millisecond: s } = n,
      a = pe(e, 0, 23) || (e === 24 && t === 0 && r === 0 && s === 0),
      u = pe(t, 0, 59),
      c = pe(r, 0, 59),
      d = pe(s, 0, 999);
    return a ? (u ? (c ? (d ? !1 : we("millisecond", s)) : we("second", r)) : we("minute", t)) : we("hour", e);
  }
  function F(n) {
    return typeof n > "u";
  }
  function Le(n) {
    return typeof n == "number";
  }
  function Ct(n) {
    return typeof n == "number" && n % 1 === 0;
  }
  function Ls(n) {
    return typeof n == "string";
  }
  function As(n) {
    return Object.prototype.toString.call(n) === "[object Date]";
  }
  function Qn() {
    try {
      return typeof Intl < "u" && !!Intl.RelativeTimeFormat;
    } catch {
      return !1;
    }
  }
  function Xn() {
    try {
      return (
        typeof Intl < "u" &&
        !!Intl.Locale &&
        ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype)
      );
    } catch {
      return !1;
    }
  }
  function Us(n) {
    return Array.isArray(n) ? n : [n];
  }
  function er(n, e, t) {
    if (n.length !== 0)
      return n.reduce((r, s) => {
        const a = [e(s), s];
        return r && t(r[0], a[0]) === r[0] ? r : a;
      }, null)[1];
  }
  function $s(n, e) {
    return e.reduce((t, r) => ((t[r] = n[r]), t), {});
  }
  function qe(n, e) {
    return Object.prototype.hasOwnProperty.call(n, e);
  }
  function tn(n) {
    if (n == null) return null;
    if (typeof n != "object") throw new l("Week settings must be an object");
    if (
      !pe(n.firstDay, 1, 7) ||
      !pe(n.minimalDays, 1, 7) ||
      !Array.isArray(n.weekend) ||
      n.weekend.some((e) => !pe(e, 1, 7))
    )
      throw new l("Invalid week settings");
    return { firstDay: n.firstDay, minimalDays: n.minimalDays, weekend: Array.from(n.weekend) };
  }
  function pe(n, e, t) {
    return Ct(n) && n >= e && n <= t;
  }
  function Rs(n, e) {
    return n - e * Math.floor(n / e);
  }
  function ne(n, e = 2) {
    const t = n < 0;
    let r;
    return (t ? (r = "-" + ("" + -n).padStart(e, "0")) : (r = ("" + n).padStart(e, "0")), r);
  }
  function Ae(n) {
    if (!(F(n) || n === null || n === "")) return parseInt(n, 10);
  }
  function $e(n) {
    if (!(F(n) || n === null || n === "")) return parseFloat(n);
  }
  function nn(n) {
    if (!(F(n) || n === null || n === "")) {
      const e = parseFloat("0." + n) * 1e3;
      return Math.floor(e);
    }
  }
  function rn(n, e, t = "round") {
    const r = 10 ** e;
    switch (t) {
      case "expand":
        return n > 0 ? Math.ceil(n * r) / r : Math.floor(n * r) / r;
      case "trunc":
        return Math.trunc(n * r) / r;
      case "round":
        return Math.round(n * r) / r;
      case "floor":
        return Math.floor(n * r) / r;
      case "ceil":
        return Math.ceil(n * r) / r;
      default:
        throw new RangeError(`Value rounding ${t} is out of range`);
    }
  }
  function ut(n) {
    return n % 4 === 0 && (n % 100 !== 0 || n % 400 === 0);
  }
  function Ye(n) {
    return ut(n) ? 366 : 365;
  }
  function Ft(n, e) {
    const t = Rs(e - 1, 12) + 1,
      r = n + (e - t) / 12;
    return t === 2 ? (ut(r) ? 29 : 28) : [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t - 1];
  }
  function Wt(n) {
    let e = Date.UTC(n.year, n.month - 1, n.day, n.hour, n.minute, n.second, n.millisecond);
    return (n.year < 100 && n.year >= 0 && ((e = new Date(e)), e.setUTCFullYear(n.year, n.month - 1, n.day)), +e);
  }
  function tr(n, e, t) {
    return -Xt(Qt(n, 1, e), t) + e - 1;
  }
  function lt(n, e = 4, t = 1) {
    const r = tr(n, e, t),
      s = tr(n + 1, e, t);
    return (Ye(n) - r + s) / 7;
  }
  function sn(n) {
    return n > 99 ? n : n > K.twoDigitCutoffYear ? 1900 + n : 2e3 + n;
  }
  function nr(n, e, t, r = null) {
    const s = new Date(n),
      a = { hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
    r && (a.timeZone = r);
    const u = { timeZoneName: e, ...a },
      c = new Intl.DateTimeFormat(t, u).formatToParts(s).find((d) => d.type.toLowerCase() === "timezonename");
    return c ? c.value : null;
  }
  function Lt(n, e) {
    let t = parseInt(n, 10);
    Number.isNaN(t) && (t = 0);
    const r = parseInt(e, 10) || 0,
      s = t < 0 || Object.is(t, -0) ? -r : r;
    return t * 60 + s;
  }
  function rr(n) {
    const e = Number(n);
    if (typeof n == "boolean" || n === "" || !Number.isFinite(e)) throw new l(`Invalid unit value ${n}`);
    return e;
  }
  function At(n, e) {
    const t = {};
    for (const r in n)
      if (qe(n, r)) {
        const s = n[r];
        if (s == null) continue;
        t[e(r)] = rr(s);
      }
    return t;
  }
  function ct(n, e) {
    const t = Math.trunc(Math.abs(n / 60)),
      r = Math.trunc(Math.abs(n % 60)),
      s = n >= 0 ? "+" : "-";
    switch (e) {
      case "short":
        return `${s}${ne(t, 2)}:${ne(r, 2)}`;
      case "narrow":
        return `${s}${t}${r > 0 ? `:${r}` : ""}`;
      case "techie":
        return `${s}${ne(t, 2)}${ne(r, 2)}`;
      default:
        throw new RangeError(`Value format ${e} is out of range for property format`);
    }
  }
  function Ut(n) {
    return $s(n, ["hour", "minute", "second", "millisecond"]);
  }
  const Ps = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    sr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    zs = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  function ir(n) {
    switch (n) {
      case "narrow":
        return [...zs];
      case "short":
        return [...sr];
      case "long":
        return [...Ps];
      case "numeric":
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
      case "2-digit":
        return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      default:
        return null;
    }
  }
  const ar = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    or = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    Hs = ["M", "T", "W", "T", "F", "S", "S"];
  function ur(n) {
    switch (n) {
      case "narrow":
        return [...Hs];
      case "short":
        return [...or];
      case "long":
        return [...ar];
      case "numeric":
        return ["1", "2", "3", "4", "5", "6", "7"];
      default:
        return null;
    }
  }
  const lr = ["AM", "PM"],
    Zs = ["Before Christ", "Anno Domini"],
    qs = ["BC", "AD"],
    Ys = ["B", "A"];
  function cr(n) {
    switch (n) {
      case "narrow":
        return [...Ys];
      case "short":
        return [...qs];
      case "long":
        return [...Zs];
      default:
        return null;
    }
  }
  function Bs(n) {
    return lr[n.hour < 12 ? 0 : 1];
  }
  function Js(n, e) {
    return ur(e)[n.weekday - 1];
  }
  function Gs(n, e) {
    return ir(e)[n.month - 1];
  }
  function js(n, e) {
    return cr(e)[n.year < 0 ? 0 : 1];
  }
  function Ks(n, e, t = "always", r = !1) {
    const s = {
        years: ["year", "yr."],
        quarters: ["quarter", "qtr."],
        months: ["month", "mo."],
        weeks: ["week", "wk."],
        days: ["day", "day", "days"],
        hours: ["hour", "hr."],
        minutes: ["minute", "min."],
        seconds: ["second", "sec."],
      },
      a = ["hours", "minutes", "seconds"].indexOf(n) === -1;
    if (t === "auto" && a) {
      const U = n === "days";
      switch (e) {
        case 1:
          return U ? "tomorrow" : `next ${s[n][0]}`;
        case -1:
          return U ? "yesterday" : `last ${s[n][0]}`;
        case 0:
          return U ? "today" : `this ${s[n][0]}`;
      }
    }
    const u = Object.is(e, -0) || e < 0,
      c = Math.abs(e),
      d = c === 1,
      O = s[n],
      _ = r ? (d ? O[1] : O[2] || O[1]) : d ? s[n][0] : n;
    return u ? `${c} ${_} ago` : `in ${c} ${_}`;
  }
  function dr(n, e) {
    let t = "";
    for (const r of n) r.literal ? (t += r.val) : (t += e(r.val));
    return t;
  }
  const Qs = {
    D: k,
    DD: S,
    DDD: M,
    DDDD: N,
    t: x,
    tt: L,
    ttt: A,
    tttt: H,
    T: X,
    TT: V,
    TTT: $,
    TTTT: G,
    f: ee,
    ff: R,
    fff: I,
    ffff: fe,
    F: ie,
    FF: ae,
    FFF: C,
    FFFF: B,
  };
  class ce {
    static create(e, t = {}) {
      return new ce(e, t);
    }
    static parseFormat(e) {
      let t = null,
        r = "",
        s = !1;
      const a = [];
      for (let u = 0; u < e.length; u++) {
        const c = e.charAt(u);
        c === "'"
          ? ((r.length > 0 || s) && a.push({ literal: s || /^\s+$/.test(r), val: r === "" ? "'" : r }),
            (t = null),
            (r = ""),
            (s = !s))
          : s || c === t
            ? (r += c)
            : (r.length > 0 && a.push({ literal: /^\s+$/.test(r), val: r }), (r = c), (t = c));
      }
      return (r.length > 0 && a.push({ literal: s || /^\s+$/.test(r), val: r }), a);
    }
    static macroTokenToFormatOpts(e) {
      return Qs[e];
    }
    constructor(e, t) {
      ((this.opts = t), (this.loc = e), (this.systemLoc = null));
    }
    formatWithSystemDefault(e, t) {
      return (
        this.systemLoc === null && (this.systemLoc = this.loc.redefaultToSystem()),
        this.systemLoc.dtFormatter(e, { ...this.opts, ...t }).format()
      );
    }
    dtFormatter(e, t = {}) {
      return this.loc.dtFormatter(e, { ...this.opts, ...t });
    }
    formatDateTime(e, t) {
      return this.dtFormatter(e, t).format();
    }
    formatDateTimeParts(e, t) {
      return this.dtFormatter(e, t).formatToParts();
    }
    formatInterval(e, t) {
      return this.dtFormatter(e.start, t).dtf.formatRange(e.start.toJSDate(), e.end.toJSDate());
    }
    resolvedOptions(e, t) {
      return this.dtFormatter(e, t).resolvedOptions();
    }
    num(e, t = 0, r = void 0) {
      if (this.opts.forceSimple) return ne(e, t);
      const s = { ...this.opts };
      return (t > 0 && (s.padTo = t), r && (s.signDisplay = r), this.loc.numberFormatter(s).format(e));
    }
    formatDateTimeFromString(e, t) {
      const r = this.loc.listingMode() === "en",
        s = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory",
        a = (E, re) => this.loc.extract(e, E, re),
        u = (E) =>
          e.isOffsetFixed && e.offset === 0 && E.allowZ ? "Z" : e.isValid ? e.zone.formatOffset(e.ts, E.format) : "",
        c = () => (r ? Bs(e) : a({ hour: "numeric", hourCycle: "h12" }, "dayperiod")),
        d = (E, re) => (r ? Gs(e, E) : a(re ? { month: E } : { month: E, day: "numeric" }, "month")),
        O = (E, re) =>
          r ? Js(e, E) : a(re ? { weekday: E } : { weekday: E, month: "long", day: "numeric" }, "weekday"),
        _ = (E) => {
          const re = ce.macroTokenToFormatOpts(E);
          return re ? this.formatWithSystemDefault(e, re) : E;
        },
        U = (E) => (r ? js(e, E) : a({ era: E }, "era")),
        J = (E) => {
          switch (E) {
            case "S":
              return this.num(e.millisecond);
            case "u":
            case "SSS":
              return this.num(e.millisecond, 3);
            case "s":
              return this.num(e.second);
            case "ss":
              return this.num(e.second, 2);
            case "uu":
              return this.num(Math.floor(e.millisecond / 10), 2);
            case "uuu":
              return this.num(Math.floor(e.millisecond / 100));
            case "m":
              return this.num(e.minute);
            case "mm":
              return this.num(e.minute, 2);
            case "h":
              return this.num(e.hour % 12 === 0 ? 12 : e.hour % 12);
            case "hh":
              return this.num(e.hour % 12 === 0 ? 12 : e.hour % 12, 2);
            case "H":
              return this.num(e.hour);
            case "HH":
              return this.num(e.hour, 2);
            case "Z":
              return u({ format: "narrow", allowZ: this.opts.allowZ });
            case "ZZ":
              return u({ format: "short", allowZ: this.opts.allowZ });
            case "ZZZ":
              return u({ format: "techie", allowZ: this.opts.allowZ });
            case "ZZZZ":
              return e.zone.offsetName(e.ts, { format: "short", locale: this.loc.locale });
            case "ZZZZZ":
              return e.zone.offsetName(e.ts, { format: "long", locale: this.loc.locale });
            case "z":
              return e.zoneName;
            case "a":
              return c();
            case "d":
              return s ? a({ day: "numeric" }, "day") : this.num(e.day);
            case "dd":
              return s ? a({ day: "2-digit" }, "day") : this.num(e.day, 2);
            case "c":
              return this.num(e.weekday);
            case "ccc":
              return O("short", !0);
            case "cccc":
              return O("long", !0);
            case "ccccc":
              return O("narrow", !0);
            case "E":
              return this.num(e.weekday);
            case "EEE":
              return O("short", !1);
            case "EEEE":
              return O("long", !1);
            case "EEEEE":
              return O("narrow", !1);
            case "L":
              return s ? a({ month: "numeric", day: "numeric" }, "month") : this.num(e.month);
            case "LL":
              return s ? a({ month: "2-digit", day: "numeric" }, "month") : this.num(e.month, 2);
            case "LLL":
              return d("short", !0);
            case "LLLL":
              return d("long", !0);
            case "LLLLL":
              return d("narrow", !0);
            case "M":
              return s ? a({ month: "numeric" }, "month") : this.num(e.month);
            case "MM":
              return s ? a({ month: "2-digit" }, "month") : this.num(e.month, 2);
            case "MMM":
              return d("short", !1);
            case "MMMM":
              return d("long", !1);
            case "MMMMM":
              return d("narrow", !1);
            case "y":
              return s ? a({ year: "numeric" }, "year") : this.num(e.year);
            case "yy":
              return s ? a({ year: "2-digit" }, "year") : this.num(e.year.toString().slice(-2), 2);
            case "yyyy":
              return s ? a({ year: "numeric" }, "year") : this.num(e.year, 4);
            case "yyyyyy":
              return s ? a({ year: "numeric" }, "year") : this.num(e.year, 6);
            case "G":
              return U("short");
            case "GG":
              return U("long");
            case "GGGGG":
              return U("narrow");
            case "kk":
              return this.num(e.weekYear.toString().slice(-2), 2);
            case "kkkk":
              return this.num(e.weekYear, 4);
            case "W":
              return this.num(e.weekNumber);
            case "WW":
              return this.num(e.weekNumber, 2);
            case "n":
              return this.num(e.localWeekNumber);
            case "nn":
              return this.num(e.localWeekNumber, 2);
            case "ii":
              return this.num(e.localWeekYear.toString().slice(-2), 2);
            case "iiii":
              return this.num(e.localWeekYear, 4);
            case "o":
              return this.num(e.ordinal);
            case "ooo":
              return this.num(e.ordinal, 3);
            case "q":
              return this.num(e.quarter);
            case "qq":
              return this.num(e.quarter, 2);
            case "X":
              return this.num(Math.floor(e.ts / 1e3));
            case "x":
              return this.num(e.ts);
            default:
              return _(E);
          }
        };
      return dr(ce.parseFormat(t), J);
    }
    formatDurationFromString(e, t) {
      const r = this.opts.signMode === "negativeLargestOnly" ? -1 : 1,
        s = (_) => {
          switch (_[0]) {
            case "S":
              return "milliseconds";
            case "s":
              return "seconds";
            case "m":
              return "minutes";
            case "h":
              return "hours";
            case "d":
              return "days";
            case "w":
              return "weeks";
            case "M":
              return "months";
            case "y":
              return "years";
            default:
              return null;
          }
        },
        a = (_, U) => (J) => {
          const E = s(J);
          if (E) {
            const re = U.isNegativeDuration && E !== U.largestUnit ? r : 1;
            let Ie;
            return (
              this.opts.signMode === "negativeLargestOnly" && E !== U.largestUnit
                ? (Ie = "never")
                : this.opts.signMode === "all"
                  ? (Ie = "always")
                  : (Ie = "auto"),
              this.num(_.get(E) * re, J.length, Ie)
            );
          } else return J;
        },
        u = ce.parseFormat(t),
        c = u.reduce((_, { literal: U, val: J }) => (U ? _ : _.concat(J)), []),
        d = e.shiftTo(...c.map(s).filter((_) => _)),
        O = { isNegativeDuration: d < 0, largestUnit: Object.keys(d.values)[0] };
      return dr(u, a(d, O));
    }
  }
  const fr = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
  function Be(...n) {
    const e = n.reduce((t, r) => t + r.source, "");
    return RegExp(`^${e}$`);
  }
  function Je(...n) {
    return (e) =>
      n
        .reduce(
          ([t, r, s], a) => {
            const [u, c, d] = a(e, s);
            return [{ ...t, ...u }, c || r, d];
          },
          [{}, null, 1],
        )
        .slice(0, 2);
  }
  function Ge(n, ...e) {
    if (n == null) return [null, null];
    for (const [t, r] of e) {
      const s = t.exec(n);
      if (s) return r(s);
    }
    return [null, null];
  }
  function hr(...n) {
    return (e, t) => {
      const r = {};
      let s;
      for (s = 0; s < n.length; s++) r[n[s]] = Ae(e[t + s]);
      return [r, null, t + s];
    };
  }
  const mr = /(?:([Zz])|([+-]\d\d)(?::?(\d\d))?)/,
    Xs = `(?:${mr.source}?(?:\\[(${fr.source})\\])?)?`,
    an = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/,
    yr = RegExp(`${an.source}${Xs}`),
    on = RegExp(`(?:[Tt]${yr.source})?`),
    ei = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/,
    ti = /(\d{4})-?W(\d\d)(?:-?(\d))?/,
    ni = /(\d{4})-?(\d{3})/,
    ri = hr("weekYear", "weekNumber", "weekDay"),
    si = hr("year", "ordinal"),
    ii = /(\d{4})-(\d\d)-(\d\d)/,
    gr = RegExp(`${an.source} ?(?:${mr.source}|(${fr.source}))?`),
    ai = RegExp(`(?: ${gr.source})?`);
  function je(n, e, t) {
    const r = n[e];
    return F(r) ? t : Ae(r);
  }
  function oi(n, e) {
    return [{ year: je(n, e), month: je(n, e + 1, 1), day: je(n, e + 2, 1) }, null, e + 3];
  }
  function Ke(n, e) {
    return [
      { hours: je(n, e, 0), minutes: je(n, e + 1, 0), seconds: je(n, e + 2, 0), milliseconds: nn(n[e + 3]) },
      null,
      e + 4,
    ];
  }
  function dt(n, e) {
    const t = !n[e] && !n[e + 1],
      r = Lt(n[e + 1], n[e + 2]),
      s = t ? null : le.instance(r);
    return [{}, s, e + 3];
  }
  function ft(n, e) {
    const t = n[e] ? ve.create(n[e]) : null;
    return [{}, t, e + 1];
  }
  const ui = RegExp(`^T?${an.source}$`),
    li =
      /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
  function ci(n) {
    const [e, t, r, s, a, u, c, d, O] = n,
      _ = e[0] === "-",
      U = d && d[0] === "-",
      J = (E, re = !1) => (E !== void 0 && (re || (E && _)) ? -E : E);
    return [
      {
        years: J($e(t)),
        months: J($e(r)),
        weeks: J($e(s)),
        days: J($e(a)),
        hours: J($e(u)),
        minutes: J($e(c)),
        seconds: J($e(d), d === "-0"),
        milliseconds: J(nn(O), U),
      },
    ];
  }
  const di = { GMT: 0, EDT: -240, EST: -300, CDT: -300, CST: -360, MDT: -360, MST: -420, PDT: -420, PST: -480 };
  function un(n, e, t, r, s, a, u) {
    const c = {
      year: e.length === 2 ? sn(Ae(e)) : Ae(e),
      month: sr.indexOf(t) + 1,
      day: Ae(r),
      hour: Ae(s),
      minute: Ae(a),
    };
    return (u && (c.second = Ae(u)), n && (c.weekday = n.length > 3 ? ar.indexOf(n) + 1 : or.indexOf(n) + 1), c);
  }
  const fi =
    /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
  function hi(n) {
    const [, e, t, r, s, a, u, c, d, O, _, U] = n,
      J = un(e, s, r, t, a, u, c);
    let E;
    return (d ? (E = di[d]) : O ? (E = 0) : (E = Lt(_, U)), [J, new le(E)]);
  }
  function mi(n) {
    return n
      .replace(/\([^()]*\)|[\n\t]/g, " ")
      .replace(/(\s\s+)/g, " ")
      .trim();
  }
  const yi =
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,
    gi =
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,
    vi =
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
  function vr(n) {
    const [, e, t, r, s, a, u, c] = n;
    return [un(e, s, r, t, a, u, c), le.utcInstance];
  }
  function wi(n) {
    const [, e, t, r, s, a, u, c] = n;
    return [un(e, c, t, r, s, a, u), le.utcInstance];
  }
  const pi = Be(ei, on),
    ki = Be(ti, on),
    Si = Be(ni, on),
    Ti = Be(yr),
    wr = Je(oi, Ke, dt, ft),
    Oi = Je(ri, Ke, dt, ft),
    Mi = Je(si, Ke, dt, ft),
    Ii = Je(Ke, dt, ft);
  function bi(n) {
    return Ge(n, [pi, wr], [ki, Oi], [Si, Mi], [Ti, Ii]);
  }
  function Di(n) {
    return Ge(mi(n), [fi, hi]);
  }
  function xi(n) {
    return Ge(n, [yi, vr], [gi, vr], [vi, wi]);
  }
  function Ni(n) {
    return Ge(n, [li, ci]);
  }
  const _i = Je(Ke);
  function Ei(n) {
    return Ge(n, [ui, _i]);
  }
  const Vi = Be(ii, ai),
    Ci = Be(gr),
    Fi = Je(Ke, dt, ft);
  function Wi(n) {
    return Ge(n, [Vi, wr], [Ci, Fi]);
  }
  const pr = "Invalid Duration",
    kr = {
      weeks: { days: 7, hours: 168, minutes: 10080, seconds: 10080 * 60, milliseconds: 10080 * 60 * 1e3 },
      days: { hours: 24, minutes: 1440, seconds: 1440 * 60, milliseconds: 1440 * 60 * 1e3 },
      hours: { minutes: 60, seconds: 3600, milliseconds: 3600 * 1e3 },
      minutes: { seconds: 60, milliseconds: 60 * 1e3 },
      seconds: { milliseconds: 1e3 },
    },
    Li = {
      years: {
        quarters: 4,
        months: 12,
        weeks: 52,
        days: 365,
        hours: 365 * 24,
        minutes: 365 * 24 * 60,
        seconds: 365 * 24 * 60 * 60,
        milliseconds: 365 * 24 * 60 * 60 * 1e3,
      },
      quarters: {
        months: 3,
        weeks: 13,
        days: 91,
        hours: 2184,
        minutes: 2184 * 60,
        seconds: 2184 * 60 * 60,
        milliseconds: 2184 * 60 * 60 * 1e3,
      },
      months: {
        weeks: 4,
        days: 30,
        hours: 720,
        minutes: 720 * 60,
        seconds: 720 * 60 * 60,
        milliseconds: 720 * 60 * 60 * 1e3,
      },
      ...kr,
    },
    ke = 146097 / 400,
    Qe = 146097 / 4800,
    Ai = {
      years: {
        quarters: 4,
        months: 12,
        weeks: ke / 7,
        days: ke,
        hours: ke * 24,
        minutes: ke * 24 * 60,
        seconds: ke * 24 * 60 * 60,
        milliseconds: ke * 24 * 60 * 60 * 1e3,
      },
      quarters: {
        months: 3,
        weeks: ke / 28,
        days: ke / 4,
        hours: (ke * 24) / 4,
        minutes: (ke * 24 * 60) / 4,
        seconds: (ke * 24 * 60 * 60) / 4,
        milliseconds: (ke * 24 * 60 * 60 * 1e3) / 4,
      },
      months: {
        weeks: Qe / 7,
        days: Qe,
        hours: Qe * 24,
        minutes: Qe * 24 * 60,
        seconds: Qe * 24 * 60 * 60,
        milliseconds: Qe * 24 * 60 * 60 * 1e3,
      },
      ...kr,
    },
    Re = ["years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"],
    Ui = Re.slice(0).reverse();
  function Ee(n, e, t = !1) {
    const r = {
      values: t ? e.values : { ...n.values, ...(e.values || {}) },
      loc: n.loc.clone(e.loc),
      conversionAccuracy: e.conversionAccuracy || n.conversionAccuracy,
      matrix: e.matrix || n.matrix,
    };
    return new z(r);
  }
  function Sr(n, e) {
    var t;
    let r = (t = e.milliseconds) != null ? t : 0;
    for (const s of Ui.slice(1)) e[s] && (r += e[s] * n[s].milliseconds);
    return r;
  }
  function Tr(n, e) {
    const t = Sr(n, e) < 0 ? -1 : 1;
    (Re.reduceRight((r, s) => {
      if (F(e[s])) return r;
      if (r) {
        const a = e[r] * t,
          u = n[s][r],
          c = Math.floor(a / u);
        ((e[s] += c * t), (e[r] -= c * u * t));
      }
      return s;
    }, null),
      Re.reduce((r, s) => {
        if (F(e[s])) return r;
        if (r) {
          const a = e[r] % 1;
          ((e[r] -= a), (e[s] += a * n[r][s]));
        }
        return s;
      }, null));
  }
  function Or(n) {
    const e = {};
    for (const [t, r] of Object.entries(n)) r !== 0 && (e[t] = r);
    return e;
  }
  class z {
    constructor(e) {
      const t = e.conversionAccuracy === "longterm" || !1;
      let r = t ? Ai : Li;
      (e.matrix && (r = e.matrix),
        (this.values = e.values),
        (this.loc = e.loc || q.create()),
        (this.conversionAccuracy = t ? "longterm" : "casual"),
        (this.invalid = e.invalid || null),
        (this.matrix = r),
        (this.isLuxonDuration = !0));
    }
    static fromMillis(e, t) {
      return z.fromObject({ milliseconds: e }, t);
    }
    static fromObject(e, t = {}) {
      if (e == null || typeof e != "object")
        throw new l(`Duration.fromObject: argument expected to be an object, got ${e === null ? "null" : typeof e}`);
      return new z({
        values: At(e, z.normalizeUnit),
        loc: q.fromObject(t),
        conversionAccuracy: t.conversionAccuracy,
        matrix: t.matrix,
      });
    }
    static fromDurationLike(e) {
      if (Le(e)) return z.fromMillis(e);
      if (z.isDuration(e)) return e;
      if (typeof e == "object") return z.fromObject(e);
      throw new l(`Unknown duration argument ${e} of type ${typeof e}`);
    }
    static fromISO(e, t) {
      const [r] = Ni(e);
      return r ? z.fromObject(r, t) : z.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
    }
    static fromISOTime(e, t) {
      const [r] = Ei(e);
      return r ? z.fromObject(r, t) : z.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
    }
    static invalid(e, t = null) {
      if (!e) throw new l("need to specify a reason the Duration is invalid");
      const r = e instanceof Oe ? e : new Oe(e, t);
      if (K.throwOnInvalid) throw new f(r);
      return new z({ invalid: r });
    }
    static normalizeUnit(e) {
      const t = {
        year: "years",
        years: "years",
        quarter: "quarters",
        quarters: "quarters",
        month: "months",
        months: "months",
        week: "weeks",
        weeks: "weeks",
        day: "days",
        days: "days",
        hour: "hours",
        hours: "hours",
        minute: "minutes",
        minutes: "minutes",
        second: "seconds",
        seconds: "seconds",
        millisecond: "milliseconds",
        milliseconds: "milliseconds",
      }[e && e.toLowerCase()];
      if (!t) throw new h(e);
      return t;
    }
    static isDuration(e) {
      return (e && e.isLuxonDuration) || !1;
    }
    get locale() {
      return this.isValid ? this.loc.locale : null;
    }
    get numberingSystem() {
      return this.isValid ? this.loc.numberingSystem : null;
    }
    toFormat(e, t = {}) {
      const r = { ...t, floor: t.round !== !1 && t.floor !== !1 };
      return this.isValid ? ce.create(this.loc, r).formatDurationFromString(this, e) : pr;
    }
    toHuman(e = {}) {
      if (!this.isValid) return pr;
      const t = e.showZeros !== !1,
        r = Re.map((s) => {
          const a = this.values[s];
          return F(a) || (a === 0 && !t)
            ? null
            : this.loc.numberFormatter({ style: "unit", unitDisplay: "long", ...e, unit: s.slice(0, -1) }).format(a);
        }).filter((s) => s);
      return this.loc.listFormatter({ type: "conjunction", style: e.listStyle || "narrow", ...e }).format(r);
    }
    toObject() {
      return this.isValid ? { ...this.values } : {};
    }
    toISO() {
      if (!this.isValid) return null;
      let e = "P";
      return (
        this.years !== 0 && (e += this.years + "Y"),
        (this.months !== 0 || this.quarters !== 0) && (e += this.months + this.quarters * 3 + "M"),
        this.weeks !== 0 && (e += this.weeks + "W"),
        this.days !== 0 && (e += this.days + "D"),
        (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) && (e += "T"),
        this.hours !== 0 && (e += this.hours + "H"),
        this.minutes !== 0 && (e += this.minutes + "M"),
        (this.seconds !== 0 || this.milliseconds !== 0) && (e += rn(this.seconds + this.milliseconds / 1e3, 3) + "S"),
        e === "P" && (e += "T0S"),
        e
      );
    }
    toISOTime(e = {}) {
      if (!this.isValid) return null;
      const t = this.toMillis();
      return t < 0 || t >= 864e5
        ? null
        : ((e = {
            suppressMilliseconds: !1,
            suppressSeconds: !1,
            includePrefix: !1,
            format: "extended",
            ...e,
            includeOffset: !1,
          }),
          W.fromMillis(t, { zone: "UTC" }).toISOTime(e));
    }
    toJSON() {
      return this.toISO();
    }
    toString() {
      return this.toISO();
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.isValid
        ? `Duration { values: ${JSON.stringify(this.values)} }`
        : `Duration { Invalid, reason: ${this.invalidReason} }`;
    }
    toMillis() {
      return this.isValid ? Sr(this.matrix, this.values) : NaN;
    }
    valueOf() {
      return this.toMillis();
    }
    plus(e) {
      if (!this.isValid) return this;
      const t = z.fromDurationLike(e),
        r = {};
      for (const s of Re) (qe(t.values, s) || qe(this.values, s)) && (r[s] = t.get(s) + this.get(s));
      return Ee(this, { values: r }, !0);
    }
    minus(e) {
      if (!this.isValid) return this;
      const t = z.fromDurationLike(e);
      return this.plus(t.negate());
    }
    mapUnits(e) {
      if (!this.isValid) return this;
      const t = {};
      for (const r of Object.keys(this.values)) t[r] = rr(e(this.values[r], r));
      return Ee(this, { values: t }, !0);
    }
    get(e) {
      return this[z.normalizeUnit(e)];
    }
    set(e) {
      if (!this.isValid) return this;
      const t = { ...this.values, ...At(e, z.normalizeUnit) };
      return Ee(this, { values: t });
    }
    reconfigure({ locale: e, numberingSystem: t, conversionAccuracy: r, matrix: s } = {}) {
      const u = { loc: this.loc.clone({ locale: e, numberingSystem: t }), matrix: s, conversionAccuracy: r };
      return Ee(this, u);
    }
    as(e) {
      return this.isValid ? this.shiftTo(e).get(e) : NaN;
    }
    normalize() {
      if (!this.isValid) return this;
      const e = this.toObject();
      return (Tr(this.matrix, e), Ee(this, { values: e }, !0));
    }
    rescale() {
      if (!this.isValid) return this;
      const e = Or(this.normalize().shiftToAll().toObject());
      return Ee(this, { values: e }, !0);
    }
    shiftTo(...e) {
      if (!this.isValid) return this;
      if (e.length === 0) return this;
      e = e.map((u) => z.normalizeUnit(u));
      const t = {},
        r = {},
        s = this.toObject();
      let a;
      for (const u of Re)
        if (e.indexOf(u) >= 0) {
          a = u;
          let c = 0;
          for (const O in r) ((c += this.matrix[O][u] * r[O]), (r[O] = 0));
          Le(s[u]) && (c += s[u]);
          const d = Math.trunc(c);
          ((t[u] = d), (r[u] = (c * 1e3 - d * 1e3) / 1e3));
        } else Le(s[u]) && (r[u] = s[u]);
      for (const u in r) r[u] !== 0 && (t[a] += u === a ? r[u] : r[u] / this.matrix[a][u]);
      return (Tr(this.matrix, t), Ee(this, { values: t }, !0));
    }
    shiftToAll() {
      return this.isValid
        ? this.shiftTo("years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds")
        : this;
    }
    negate() {
      if (!this.isValid) return this;
      const e = {};
      for (const t of Object.keys(this.values)) e[t] = this.values[t] === 0 ? 0 : -this.values[t];
      return Ee(this, { values: e }, !0);
    }
    removeZeros() {
      if (!this.isValid) return this;
      const e = Or(this.values);
      return Ee(this, { values: e }, !0);
    }
    get years() {
      return this.isValid ? this.values.years || 0 : NaN;
    }
    get quarters() {
      return this.isValid ? this.values.quarters || 0 : NaN;
    }
    get months() {
      return this.isValid ? this.values.months || 0 : NaN;
    }
    get weeks() {
      return this.isValid ? this.values.weeks || 0 : NaN;
    }
    get days() {
      return this.isValid ? this.values.days || 0 : NaN;
    }
    get hours() {
      return this.isValid ? this.values.hours || 0 : NaN;
    }
    get minutes() {
      return this.isValid ? this.values.minutes || 0 : NaN;
    }
    get seconds() {
      return this.isValid ? this.values.seconds || 0 : NaN;
    }
    get milliseconds() {
      return this.isValid ? this.values.milliseconds || 0 : NaN;
    }
    get isValid() {
      return this.invalid === null;
    }
    get invalidReason() {
      return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
      return this.invalid ? this.invalid.explanation : null;
    }
    equals(e) {
      if (!this.isValid || !e.isValid || !this.loc.equals(e.loc)) return !1;
      function t(r, s) {
        return r === void 0 || r === 0 ? s === void 0 || s === 0 : r === s;
      }
      for (const r of Re) if (!t(this.values[r], e.values[r])) return !1;
      return !0;
    }
  }
  const Xe = "Invalid Interval";
  function $i(n, e) {
    return !n || !n.isValid
      ? Q.invalid("missing or invalid start")
      : !e || !e.isValid
        ? Q.invalid("missing or invalid end")
        : e < n
          ? Q.invalid(
              "end before start",
              `The end of an interval must be after its start, but you had start=${n.toISO()} and end=${e.toISO()}`,
            )
          : null;
  }
  class Q {
    constructor(e) {
      ((this.s = e.start), (this.e = e.end), (this.invalid = e.invalid || null), (this.isLuxonInterval = !0));
    }
    static invalid(e, t = null) {
      if (!e) throw new l("need to specify a reason the Interval is invalid");
      const r = e instanceof Oe ? e : new Oe(e, t);
      if (K.throwOnInvalid) throw new m(r);
      return new Q({ invalid: r });
    }
    static fromDateTimes(e, t) {
      const r = gt(e),
        s = gt(t),
        a = $i(r, s);
      return a ?? new Q({ start: r, end: s });
    }
    static after(e, t) {
      const r = z.fromDurationLike(t),
        s = gt(e);
      return Q.fromDateTimes(s, s.plus(r));
    }
    static before(e, t) {
      const r = z.fromDurationLike(t),
        s = gt(e);
      return Q.fromDateTimes(s.minus(r), s);
    }
    static fromISO(e, t) {
      const [r, s] = (e || "").split("/", 2);
      if (r && s) {
        let a, u;
        try {
          ((a = W.fromISO(r, t)), (u = a.isValid));
        } catch {
          u = !1;
        }
        let c, d;
        try {
          ((c = W.fromISO(s, t)), (d = c.isValid));
        } catch {
          d = !1;
        }
        if (u && d) return Q.fromDateTimes(a, c);
        if (u) {
          const O = z.fromISO(s, t);
          if (O.isValid) return Q.after(a, O);
        } else if (d) {
          const O = z.fromISO(r, t);
          if (O.isValid) return Q.before(c, O);
        }
      }
      return Q.invalid("unparsable", `the input "${e}" can't be parsed as ISO 8601`);
    }
    static isInterval(e) {
      return (e && e.isLuxonInterval) || !1;
    }
    get start() {
      return this.isValid ? this.s : null;
    }
    get end() {
      return this.isValid ? this.e : null;
    }
    get lastDateTime() {
      return this.isValid && this.e ? this.e.minus(1) : null;
    }
    get isValid() {
      return this.invalidReason === null;
    }
    get invalidReason() {
      return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
      return this.invalid ? this.invalid.explanation : null;
    }
    length(e = "milliseconds") {
      return this.isValid ? this.toDuration(e).get(e) : NaN;
    }
    count(e = "milliseconds", t) {
      if (!this.isValid) return NaN;
      const r = this.start.startOf(e, t);
      let s;
      return (
        t != null && t.useLocaleWeeks ? (s = this.end.reconfigure({ locale: r.locale })) : (s = this.end),
        (s = s.startOf(e, t)),
        Math.floor(s.diff(r, e).get(e)) + (s.valueOf() !== this.end.valueOf())
      );
    }
    hasSame(e) {
      return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, e) : !1;
    }
    isEmpty() {
      return this.s.valueOf() === this.e.valueOf();
    }
    isAfter(e) {
      return this.isValid ? this.s > e : !1;
    }
    isBefore(e) {
      return this.isValid ? this.e <= e : !1;
    }
    contains(e) {
      return this.isValid ? this.s <= e && this.e > e : !1;
    }
    set({ start: e, end: t } = {}) {
      return this.isValid ? Q.fromDateTimes(e || this.s, t || this.e) : this;
    }
    splitAt(...e) {
      if (!this.isValid) return [];
      const t = e
          .map(gt)
          .filter((u) => this.contains(u))
          .sort((u, c) => u.toMillis() - c.toMillis()),
        r = [];
      let { s } = this,
        a = 0;
      for (; s < this.e; ) {
        const u = t[a] || this.e,
          c = +u > +this.e ? this.e : u;
        (r.push(Q.fromDateTimes(s, c)), (s = c), (a += 1));
      }
      return r;
    }
    splitBy(e) {
      const t = z.fromDurationLike(e);
      if (!this.isValid || !t.isValid || t.as("milliseconds") === 0) return [];
      let { s: r } = this,
        s = 1,
        a;
      const u = [];
      for (; r < this.e; ) {
        const c = this.start.plus(t.mapUnits((d) => d * s));
        ((a = +c > +this.e ? this.e : c), u.push(Q.fromDateTimes(r, a)), (r = a), (s += 1));
      }
      return u;
    }
    divideEqually(e) {
      return this.isValid ? this.splitBy(this.length() / e).slice(0, e) : [];
    }
    overlaps(e) {
      return this.e > e.s && this.s < e.e;
    }
    abutsStart(e) {
      return this.isValid ? +this.e == +e.s : !1;
    }
    abutsEnd(e) {
      return this.isValid ? +e.e == +this.s : !1;
    }
    engulfs(e) {
      return this.isValid ? this.s <= e.s && this.e >= e.e : !1;
    }
    equals(e) {
      return !this.isValid || !e.isValid ? !1 : this.s.equals(e.s) && this.e.equals(e.e);
    }
    intersection(e) {
      if (!this.isValid) return this;
      const t = this.s > e.s ? this.s : e.s,
        r = this.e < e.e ? this.e : e.e;
      return t >= r ? null : Q.fromDateTimes(t, r);
    }
    union(e) {
      if (!this.isValid) return this;
      const t = this.s < e.s ? this.s : e.s,
        r = this.e > e.e ? this.e : e.e;
      return Q.fromDateTimes(t, r);
    }
    static merge(e) {
      const [t, r] = e
        .sort((s, a) => s.s - a.s)
        .reduce(
          ([s, a], u) => (a ? (a.overlaps(u) || a.abutsStart(u) ? [s, a.union(u)] : [s.concat([a]), u]) : [s, u]),
          [[], null],
        );
      return (r && t.push(r), t);
    }
    static xor(e) {
      let t = null,
        r = 0;
      const s = [],
        a = e.map((d) => [
          { time: d.s, type: "s" },
          { time: d.e, type: "e" },
        ]),
        u = Array.prototype.concat(...a),
        c = u.sort((d, O) => d.time - O.time);
      for (const d of c)
        ((r += d.type === "s" ? 1 : -1),
          r === 1 ? (t = d.time) : (t && +t != +d.time && s.push(Q.fromDateTimes(t, d.time)), (t = null)));
      return Q.merge(s);
    }
    difference(...e) {
      return Q.xor([this].concat(e))
        .map((t) => this.intersection(t))
        .filter((t) => t && !t.isEmpty());
    }
    toString() {
      return this.isValid ? `[${this.s.toISO()} – ${this.e.toISO()})` : Xe;
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.isValid
        ? `Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`
        : `Interval { Invalid, reason: ${this.invalidReason} }`;
    }
    toLocaleString(e = k, t = {}) {
      return this.isValid ? ce.create(this.s.loc.clone(t), e).formatInterval(this) : Xe;
    }
    toISO(e) {
      return this.isValid ? `${this.s.toISO(e)}/${this.e.toISO(e)}` : Xe;
    }
    toISODate() {
      return this.isValid ? `${this.s.toISODate()}/${this.e.toISODate()}` : Xe;
    }
    toISOTime(e) {
      return this.isValid ? `${this.s.toISOTime(e)}/${this.e.toISOTime(e)}` : Xe;
    }
    toFormat(e, { separator: t = " – " } = {}) {
      return this.isValid ? `${this.s.toFormat(e)}${t}${this.e.toFormat(e)}` : Xe;
    }
    toDuration(e, t) {
      return this.isValid ? this.e.diff(this.s, e, t) : z.invalid(this.invalidReason);
    }
    mapEndpoints(e) {
      return Q.fromDateTimes(e(this.s), e(this.e));
    }
  }
  class ht {
    static hasDST(e = K.defaultZone) {
      const t = W.now().setZone(e).set({ month: 12 });
      return !e.isUniversal && t.offset !== t.set({ month: 6 }).offset;
    }
    static isValidIANAZone(e) {
      return ve.isValidZone(e);
    }
    static normalizeZone(e) {
      return We(e, K.defaultZone);
    }
    static getStartOfWeek({ locale: e = null, locObj: t = null } = {}) {
      return (t || q.create(e)).getStartOfWeek();
    }
    static getMinimumDaysInFirstWeek({ locale: e = null, locObj: t = null } = {}) {
      return (t || q.create(e)).getMinDaysInFirstWeek();
    }
    static getWeekendWeekdays({ locale: e = null, locObj: t = null } = {}) {
      return (t || q.create(e)).getWeekendDays().slice();
    }
    static months(
      e = "long",
      { locale: t = null, numberingSystem: r = null, locObj: s = null, outputCalendar: a = "gregory" } = {},
    ) {
      return (s || q.create(t, r, a)).months(e);
    }
    static monthsFormat(
      e = "long",
      { locale: t = null, numberingSystem: r = null, locObj: s = null, outputCalendar: a = "gregory" } = {},
    ) {
      return (s || q.create(t, r, a)).months(e, !0);
    }
    static weekdays(e = "long", { locale: t = null, numberingSystem: r = null, locObj: s = null } = {}) {
      return (s || q.create(t, r, null)).weekdays(e);
    }
    static weekdaysFormat(e = "long", { locale: t = null, numberingSystem: r = null, locObj: s = null } = {}) {
      return (s || q.create(t, r, null)).weekdays(e, !0);
    }
    static meridiems({ locale: e = null } = {}) {
      return q.create(e).meridiems();
    }
    static eras(e = "short", { locale: t = null } = {}) {
      return q.create(t, null, "gregory").eras(e);
    }
    static features() {
      return { relative: Qn(), localeWeek: Xn() };
    }
  }
  function Mr(n, e) {
    const t = (s) => s.toUTC(0, { keepLocalTime: !0 }).startOf("day").valueOf(),
      r = t(e) - t(n);
    return Math.floor(z.fromMillis(r).as("days"));
  }
  function Ri(n, e, t) {
    const r = [
        ["years", (d, O) => O.year - d.year],
        ["quarters", (d, O) => O.quarter - d.quarter + (O.year - d.year) * 4],
        ["months", (d, O) => O.month - d.month + (O.year - d.year) * 12],
        [
          "weeks",
          (d, O) => {
            const _ = Mr(d, O);
            return (_ - (_ % 7)) / 7;
          },
        ],
        ["days", Mr],
      ],
      s = {},
      a = n;
    let u, c;
    for (const [d, O] of r)
      t.indexOf(d) >= 0 &&
        ((u = d),
        (s[d] = O(n, e)),
        (c = a.plus(s)),
        c > e ? (s[d]--, (n = a.plus(s)), n > e && ((c = n), s[d]--, (n = a.plus(s)))) : (n = c));
    return [n, s, c, u];
  }
  function Pi(n, e, t, r) {
    let [s, a, u, c] = Ri(n, e, t);
    const d = e - s,
      O = t.filter((U) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(U) >= 0);
    O.length === 0 && (u < e && (u = s.plus({ [c]: 1 })), u !== s && (a[c] = (a[c] || 0) + d / (u - s)));
    const _ = z.fromObject(a, r);
    return O.length > 0
      ? z
          .fromMillis(d, r)
          .shiftTo(...O)
          .plus(_)
      : _;
  }
  const zi = "missing Intl.DateTimeFormat.formatToParts support";
  function Z(n, e = (t) => t) {
    return { regex: n, deser: ([t]) => e(Vs(t)) };
  }
  const Ir = "[  ]",
    br = new RegExp(Ir, "g");
  function Hi(n) {
    return n.replace(/\./g, "\\.?").replace(br, Ir);
  }
  function Dr(n) {
    return n.replace(/\./g, "").replace(br, " ").toLowerCase();
  }
  function Me(n, e) {
    return n === null
      ? null
      : { regex: RegExp(n.map(Hi).join("|")), deser: ([t]) => n.findIndex((r) => Dr(t) === Dr(r)) + e };
  }
  function xr(n, e) {
    return { regex: n, deser: ([, t, r]) => Lt(t, r), groups: e };
  }
  function $t(n) {
    return { regex: n, deser: ([e]) => e };
  }
  function Zi(n) {
    return n.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }
  function qi(n, e) {
    const t = Te(e),
      r = Te(e, "{2}"),
      s = Te(e, "{3}"),
      a = Te(e, "{4}"),
      u = Te(e, "{6}"),
      c = Te(e, "{1,2}"),
      d = Te(e, "{1,3}"),
      O = Te(e, "{1,6}"),
      _ = Te(e, "{1,9}"),
      U = Te(e, "{2,4}"),
      J = Te(e, "{4,6}"),
      E = (xe) => ({ regex: RegExp(Zi(xe.val)), deser: ([tt]) => tt, literal: !0 }),
      Ie = ((xe) => {
        if (n.literal) return E(xe);
        switch (xe.val) {
          case "G":
            return Me(e.eras("short"), 0);
          case "GG":
            return Me(e.eras("long"), 0);
          case "y":
            return Z(O);
          case "yy":
            return Z(U, sn);
          case "yyyy":
            return Z(a);
          case "yyyyy":
            return Z(J);
          case "yyyyyy":
            return Z(u);
          case "M":
            return Z(c);
          case "MM":
            return Z(r);
          case "MMM":
            return Me(e.months("short", !0), 1);
          case "MMMM":
            return Me(e.months("long", !0), 1);
          case "L":
            return Z(c);
          case "LL":
            return Z(r);
          case "LLL":
            return Me(e.months("short", !1), 1);
          case "LLLL":
            return Me(e.months("long", !1), 1);
          case "d":
            return Z(c);
          case "dd":
            return Z(r);
          case "o":
            return Z(d);
          case "ooo":
            return Z(s);
          case "HH":
            return Z(r);
          case "H":
            return Z(c);
          case "hh":
            return Z(r);
          case "h":
            return Z(c);
          case "mm":
            return Z(r);
          case "m":
            return Z(c);
          case "q":
            return Z(c);
          case "qq":
            return Z(r);
          case "s":
            return Z(c);
          case "ss":
            return Z(r);
          case "S":
            return Z(d);
          case "SSS":
            return Z(s);
          case "u":
            return $t(_);
          case "uu":
            return $t(c);
          case "uuu":
            return Z(t);
          case "a":
            return Me(e.meridiems(), 0);
          case "kkkk":
            return Z(a);
          case "kk":
            return Z(U, sn);
          case "W":
            return Z(c);
          case "WW":
            return Z(r);
          case "E":
          case "c":
            return Z(t);
          case "EEE":
            return Me(e.weekdays("short", !1), 1);
          case "EEEE":
            return Me(e.weekdays("long", !1), 1);
          case "ccc":
            return Me(e.weekdays("short", !0), 1);
          case "cccc":
            return Me(e.weekdays("long", !0), 1);
          case "Z":
          case "ZZ":
            return xr(new RegExp(`([+-]${c.source})(?::(${r.source}))?`), 2);
          case "ZZZ":
            return xr(new RegExp(`([+-]${c.source})(${r.source})?`), 2);
          case "z":
            return $t(/[a-z_+-/]{1,256}?/i);
          case " ":
            return $t(/[^\S\n\r]/);
          default:
            return E(xe);
        }
      })(n) || { invalidReason: zi };
    return ((Ie.token = n), Ie);
  }
  const Yi = {
    year: { "2-digit": "yy", numeric: "yyyyy" },
    month: { numeric: "M", "2-digit": "MM", short: "MMM", long: "MMMM" },
    day: { numeric: "d", "2-digit": "dd" },
    weekday: { short: "EEE", long: "EEEE" },
    dayperiod: "a",
    dayPeriod: "a",
    hour12: { numeric: "h", "2-digit": "hh" },
    hour24: { numeric: "H", "2-digit": "HH" },
    minute: { numeric: "m", "2-digit": "mm" },
    second: { numeric: "s", "2-digit": "ss" },
    timeZoneName: { long: "ZZZZZ", short: "ZZZ" },
  };
  function Bi(n, e, t) {
    const { type: r, value: s } = n;
    if (r === "literal") {
      const d = /^\s+$/.test(s);
      return { literal: !d, val: d ? " " : s };
    }
    const a = e[r];
    let u = r;
    r === "hour" &&
      (e.hour12 != null
        ? (u = e.hour12 ? "hour12" : "hour24")
        : e.hourCycle != null
          ? e.hourCycle === "h11" || e.hourCycle === "h12"
            ? (u = "hour12")
            : (u = "hour24")
          : (u = t.hour12 ? "hour12" : "hour24"));
    let c = Yi[u];
    if ((typeof c == "object" && (c = c[a]), c)) return { literal: !1, val: c };
  }
  function Ji(n) {
    return [`^${n.map((t) => t.regex).reduce((t, r) => `${t}(${r.source})`, "")}$`, n];
  }
  function Gi(n, e, t) {
    const r = n.match(e);
    if (r) {
      const s = {};
      let a = 1;
      for (const u in t)
        if (qe(t, u)) {
          const c = t[u],
            d = c.groups ? c.groups + 1 : 1;
          (!c.literal && c.token && (s[c.token.val[0]] = c.deser(r.slice(a, a + d))), (a += d));
        }
      return [r, s];
    } else return [r, {}];
  }
  function ji(n) {
    const e = (a) => {
      switch (a) {
        case "S":
          return "millisecond";
        case "s":
          return "second";
        case "m":
          return "minute";
        case "h":
        case "H":
          return "hour";
        case "d":
          return "day";
        case "o":
          return "ordinal";
        case "L":
        case "M":
          return "month";
        case "y":
          return "year";
        case "E":
        case "c":
          return "weekday";
        case "W":
          return "weekNumber";
        case "k":
          return "weekYear";
        case "q":
          return "quarter";
        default:
          return null;
      }
    };
    let t = null,
      r;
    return (
      F(n.z) || (t = ve.create(n.z)),
      F(n.Z) || (t || (t = new le(n.Z)), (r = n.Z)),
      F(n.q) || (n.M = (n.q - 1) * 3 + 1),
      F(n.h) || (n.h < 12 && n.a === 1 ? (n.h += 12) : n.h === 12 && n.a === 0 && (n.h = 0)),
      n.G === 0 && n.y && (n.y = -n.y),
      F(n.u) || (n.S = nn(n.u)),
      [
        Object.keys(n).reduce((a, u) => {
          const c = e(u);
          return (c && (a[c] = n[u]), a);
        }, {}),
        t,
        r,
      ]
    );
  }
  let ln = null;
  function Ki() {
    return (ln || (ln = W.fromMillis(1555555555555)), ln);
  }
  function Qi(n, e) {
    if (n.literal) return n;
    const t = ce.macroTokenToFormatOpts(n.val),
      r = Vr(t, e);
    return r == null || r.includes(void 0) ? n : r;
  }
  function Nr(n, e) {
    return Array.prototype.concat(...n.map((t) => Qi(t, e)));
  }
  class _r {
    constructor(e, t) {
      if (
        ((this.locale = e),
        (this.format = t),
        (this.tokens = Nr(ce.parseFormat(t), e)),
        (this.units = this.tokens.map((r) => qi(r, e))),
        (this.disqualifyingUnit = this.units.find((r) => r.invalidReason)),
        !this.disqualifyingUnit)
      ) {
        const [r, s] = Ji(this.units);
        ((this.regex = RegExp(r, "i")), (this.handlers = s));
      }
    }
    explainFromTokens(e) {
      if (this.isValid) {
        const [t, r] = Gi(e, this.regex, this.handlers),
          [s, a, u] = r ? ji(r) : [null, null, void 0];
        if (qe(r, "a") && qe(r, "H")) throw new v("Can't include meridiem when specifying 24-hour format");
        return {
          input: e,
          tokens: this.tokens,
          regex: this.regex,
          rawMatches: t,
          matches: r,
          result: s,
          zone: a,
          specificOffset: u,
        };
      } else return { input: e, tokens: this.tokens, invalidReason: this.invalidReason };
    }
    get isValid() {
      return !this.disqualifyingUnit;
    }
    get invalidReason() {
      return this.disqualifyingUnit ? this.disqualifyingUnit.invalidReason : null;
    }
  }
  function Er(n, e, t) {
    return new _r(n, t).explainFromTokens(e);
  }
  function Xi(n, e, t) {
    const { result: r, zone: s, specificOffset: a, invalidReason: u } = Er(n, e, t);
    return [r, s, a, u];
  }
  function Vr(n, e) {
    if (!n) return null;
    const r = ce.create(e, n).dtFormatter(Ki()),
      s = r.formatToParts(),
      a = r.resolvedOptions();
    return s.map((u) => Bi(u, n, a));
  }
  const cn = "Invalid DateTime",
    Cr = 864e13;
  function mt(n) {
    return new Oe("unsupported zone", `the zone "${n.name}" is not supported`);
  }
  function dn(n) {
    return (n.weekData === null && (n.weekData = Vt(n.c)), n.weekData);
  }
  function fn(n) {
    return (
      n.localWeekData === null && (n.localWeekData = Vt(n.c, n.loc.getMinDaysInFirstWeek(), n.loc.getStartOfWeek())),
      n.localWeekData
    );
  }
  function Pe(n, e) {
    const t = { ts: n.ts, zone: n.zone, c: n.c, o: n.o, loc: n.loc, invalid: n.invalid };
    return new W({ ...t, ...e, old: t });
  }
  function Fr(n, e, t) {
    let r = n - e * 60 * 1e3;
    const s = t.offset(r);
    if (e === s) return [r, e];
    r -= (s - e) * 60 * 1e3;
    const a = t.offset(r);
    return s === a ? [r, s] : [n - Math.min(s, a) * 60 * 1e3, Math.max(s, a)];
  }
  function Rt(n, e) {
    n += e * 60 * 1e3;
    const t = new Date(n);
    return {
      year: t.getUTCFullYear(),
      month: t.getUTCMonth() + 1,
      day: t.getUTCDate(),
      hour: t.getUTCHours(),
      minute: t.getUTCMinutes(),
      second: t.getUTCSeconds(),
      millisecond: t.getUTCMilliseconds(),
    };
  }
  function Pt(n, e, t) {
    return Fr(Wt(n), e, t);
  }
  function Wr(n, e) {
    const t = n.o,
      r = n.c.year + Math.trunc(e.years),
      s = n.c.month + Math.trunc(e.months) + Math.trunc(e.quarters) * 3,
      a = {
        ...n.c,
        year: r,
        month: s,
        day: Math.min(n.c.day, Ft(r, s)) + Math.trunc(e.days) + Math.trunc(e.weeks) * 7,
      },
      u = z
        .fromObject({
          years: e.years - Math.trunc(e.years),
          quarters: e.quarters - Math.trunc(e.quarters),
          months: e.months - Math.trunc(e.months),
          weeks: e.weeks - Math.trunc(e.weeks),
          days: e.days - Math.trunc(e.days),
          hours: e.hours,
          minutes: e.minutes,
          seconds: e.seconds,
          milliseconds: e.milliseconds,
        })
        .as("milliseconds"),
      c = Wt(a);
    let [d, O] = Fr(c, t, n.zone);
    return (u !== 0 && ((d += u), (O = n.zone.offset(d))), { ts: d, o: O });
  }
  function et(n, e, t, r, s, a) {
    const { setZone: u, zone: c } = t;
    if ((n && Object.keys(n).length !== 0) || e) {
      const d = e || c,
        O = W.fromObject(n, { ...t, zone: d, specificOffset: a });
      return u ? O : O.setZone(c);
    } else return W.invalid(new Oe("unparsable", `the input "${s}" can't be parsed as ${r}`));
  }
  function zt(n, e, t = !0) {
    return n.isValid
      ? ce.create(q.create("en-US"), { allowZ: t, forceSimple: !0 }).formatDateTimeFromString(n, e)
      : null;
  }
  function hn(n, e, t) {
    const r = n.c.year > 9999 || n.c.year < 0;
    let s = "";
    if ((r && n.c.year >= 0 && (s += "+"), (s += ne(n.c.year, r ? 6 : 4)), t === "year")) return s;
    if (e) {
      if (((s += "-"), (s += ne(n.c.month)), t === "month")) return s;
      s += "-";
    } else if (((s += ne(n.c.month)), t === "month")) return s;
    return ((s += ne(n.c.day)), s);
  }
  function Lr(n, e, t, r, s, a, u) {
    let c = !t || n.c.millisecond !== 0 || n.c.second !== 0,
      d = "";
    switch (u) {
      case "day":
      case "month":
      case "year":
        break;
      default:
        if (((d += ne(n.c.hour)), u === "hour")) break;
        if (e) {
          if (((d += ":"), (d += ne(n.c.minute)), u === "minute")) break;
          c && ((d += ":"), (d += ne(n.c.second)));
        } else {
          if (((d += ne(n.c.minute)), u === "minute")) break;
          c && (d += ne(n.c.second));
        }
        if (u === "second") break;
        c && (!r || n.c.millisecond !== 0) && ((d += "."), (d += ne(n.c.millisecond, 3)));
    }
    return (
      s &&
        (n.isOffsetFixed && n.offset === 0 && !a
          ? (d += "Z")
          : n.o < 0
            ? ((d += "-"), (d += ne(Math.trunc(-n.o / 60))), (d += ":"), (d += ne(Math.trunc(-n.o % 60))))
            : ((d += "+"), (d += ne(Math.trunc(n.o / 60))), (d += ":"), (d += ne(Math.trunc(n.o % 60))))),
      a && (d += "[" + n.zone.ianaName + "]"),
      d
    );
  }
  const Ar = { month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
    ea = { weekNumber: 1, weekday: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
    ta = { ordinal: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
    Ht = ["year", "month", "day", "hour", "minute", "second", "millisecond"],
    na = ["weekYear", "weekNumber", "weekday", "hour", "minute", "second", "millisecond"],
    ra = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
  function Zt(n) {
    const e = {
      year: "year",
      years: "year",
      month: "month",
      months: "month",
      day: "day",
      days: "day",
      hour: "hour",
      hours: "hour",
      minute: "minute",
      minutes: "minute",
      quarter: "quarter",
      quarters: "quarter",
      second: "second",
      seconds: "second",
      millisecond: "millisecond",
      milliseconds: "millisecond",
      weekday: "weekday",
      weekdays: "weekday",
      weeknumber: "weekNumber",
      weeksnumber: "weekNumber",
      weeknumbers: "weekNumber",
      weekyear: "weekYear",
      weekyears: "weekYear",
      ordinal: "ordinal",
    }[n.toLowerCase()];
    if (!e) throw new h(n);
    return e;
  }
  function Ur(n) {
    switch (n.toLowerCase()) {
      case "localweekday":
      case "localweekdays":
        return "localWeekday";
      case "localweeknumber":
      case "localweeknumbers":
        return "localWeekNumber";
      case "localweekyear":
      case "localweekyears":
        return "localWeekYear";
      default:
        return Zt(n);
    }
  }
  function sa(n) {
    if ((yt === void 0 && (yt = K.now()), n.type !== "iana")) return n.offset(yt);
    const e = n.name;
    let t = mn.get(e);
    return (t === void 0 && ((t = n.offset(yt)), mn.set(e, t)), t);
  }
  function $r(n, e) {
    const t = We(e.zone, K.defaultZone);
    if (!t.isValid) return W.invalid(mt(t));
    const r = q.fromObject(e);
    let s, a;
    if (F(n.year)) s = K.now();
    else {
      for (const d of Ht) F(n[d]) && (n[d] = Ar[d]);
      const u = jn(n) || Kn(n);
      if (u) return W.invalid(u);
      const c = sa(t);
      [s, a] = Pt(n, c, t);
    }
    return new W({ ts: s, zone: t, loc: r, o: a });
  }
  function Rr(n, e, t) {
    const r = F(t.round) ? !0 : t.round,
      s = F(t.rounding) ? "trunc" : t.rounding,
      a = (c, d) => (
        (c = rn(c, r || t.calendary ? 0 : 2, t.calendary ? "round" : s)),
        e.loc.clone(t).relFormatter(t).format(c, d)
      ),
      u = (c) =>
        t.calendary ? (e.hasSame(n, c) ? 0 : e.startOf(c).diff(n.startOf(c), c).get(c)) : e.diff(n, c).get(c);
    if (t.unit) return a(u(t.unit), t.unit);
    for (const c of t.units) {
      const d = u(c);
      if (Math.abs(d) >= 1) return a(d, c);
    }
    return a(n > e ? -0 : 0, t.units[t.units.length - 1]);
  }
  function Pr(n) {
    let e = {},
      t;
    return (
      n.length > 0 && typeof n[n.length - 1] == "object"
        ? ((e = n[n.length - 1]), (t = Array.from(n).slice(0, n.length - 1)))
        : (t = Array.from(n)),
      [e, t]
    );
  }
  let yt;
  const mn = new Map();
  class W {
    constructor(e) {
      const t = e.zone || K.defaultZone;
      let r = e.invalid || (Number.isNaN(e.ts) ? new Oe("invalid input") : null) || (t.isValid ? null : mt(t));
      this.ts = F(e.ts) ? K.now() : e.ts;
      let s = null,
        a = null;
      if (!r)
        if (e.old && e.old.ts === this.ts && e.old.zone.equals(t)) [s, a] = [e.old.c, e.old.o];
        else {
          const c = Le(e.o) && !e.old ? e.o : t.offset(this.ts);
          ((s = Rt(this.ts, c)),
            (r = Number.isNaN(s.year) ? new Oe("invalid input") : null),
            (s = r ? null : s),
            (a = r ? null : c));
        }
      ((this._zone = t),
        (this.loc = e.loc || q.create()),
        (this.invalid = r),
        (this.weekData = null),
        (this.localWeekData = null),
        (this.c = s),
        (this.o = a),
        (this.isLuxonDateTime = !0));
    }
    static now() {
      return new W({});
    }
    static local() {
      const [e, t] = Pr(arguments),
        [r, s, a, u, c, d, O] = t;
      return $r({ year: r, month: s, day: a, hour: u, minute: c, second: d, millisecond: O }, e);
    }
    static utc() {
      const [e, t] = Pr(arguments),
        [r, s, a, u, c, d, O] = t;
      return (
        (e.zone = le.utcInstance),
        $r({ year: r, month: s, day: a, hour: u, minute: c, second: d, millisecond: O }, e)
      );
    }
    static fromJSDate(e, t = {}) {
      const r = As(e) ? e.valueOf() : NaN;
      if (Number.isNaN(r)) return W.invalid("invalid input");
      const s = We(t.zone, K.defaultZone);
      return s.isValid ? new W({ ts: r, zone: s, loc: q.fromObject(t) }) : W.invalid(mt(s));
    }
    static fromMillis(e, t = {}) {
      if (Le(e))
        return e < -Cr || e > Cr
          ? W.invalid("Timestamp out of range")
          : new W({ ts: e, zone: We(t.zone, K.defaultZone), loc: q.fromObject(t) });
      throw new l(`fromMillis requires a numerical input, but received a ${typeof e} with value ${e}`);
    }
    static fromSeconds(e, t = {}) {
      if (Le(e)) return new W({ ts: e * 1e3, zone: We(t.zone, K.defaultZone), loc: q.fromObject(t) });
      throw new l("fromSeconds requires a numerical input");
    }
    static fromObject(e, t = {}) {
      e = e || {};
      const r = We(t.zone, K.defaultZone);
      if (!r.isValid) return W.invalid(mt(r));
      const s = q.fromObject(t),
        a = At(e, Ur),
        { minDaysInFirstWeek: u, startOfWeek: c } = Gn(a, s),
        d = K.now(),
        O = F(t.specificOffset) ? r.offset(d) : t.specificOffset,
        _ = !F(a.ordinal),
        U = !F(a.year),
        J = !F(a.month) || !F(a.day),
        E = U || J,
        re = a.weekYear || a.weekNumber;
      if ((E || _) && re) throw new v("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
      if (J && _) throw new v("Can't mix ordinal dates with month/day");
      const Ie = re || (a.weekday && !E);
      let xe,
        tt,
        vt = Rt(d, O);
      Ie
        ? ((xe = na), (tt = ea), (vt = Vt(vt, u, c)))
        : _
          ? ((xe = ra), (tt = ta), (vt = en(vt)))
          : ((xe = Ht), (tt = Ar));
      let zr = !1;
      for (const pt of xe) {
        const ca = a[pt];
        F(ca) ? (zr ? (a[pt] = tt[pt]) : (a[pt] = vt[pt])) : (zr = !0);
      }
      const aa = Ie ? Fs(a, u, c) : _ ? Ws(a) : jn(a),
        Hr = aa || Kn(a);
      if (Hr) return W.invalid(Hr);
      const oa = Ie ? Bn(a, u, c) : _ ? Jn(a) : a,
        [ua, la] = Pt(oa, O, r),
        wt = new W({ ts: ua, zone: r, o: la, loc: s });
      return a.weekday && E && e.weekday !== wt.weekday
        ? W.invalid(
            "mismatched weekday",
            `you can't specify both a weekday of ${a.weekday} and a date of ${wt.toISO()}`,
          )
        : wt.isValid
          ? wt
          : W.invalid(wt.invalid);
    }
    static fromISO(e, t = {}) {
      const [r, s] = bi(e);
      return et(r, s, t, "ISO 8601", e);
    }
    static fromRFC2822(e, t = {}) {
      const [r, s] = Di(e);
      return et(r, s, t, "RFC 2822", e);
    }
    static fromHTTP(e, t = {}) {
      const [r, s] = xi(e);
      return et(r, s, t, "HTTP", t);
    }
    static fromFormat(e, t, r = {}) {
      if (F(e) || F(t)) throw new l("fromFormat requires an input string and a format");
      const { locale: s = null, numberingSystem: a = null } = r,
        u = q.fromOpts({ locale: s, numberingSystem: a, defaultToEN: !0 }),
        [c, d, O, _] = Xi(u, e, t);
      return _ ? W.invalid(_) : et(c, d, r, `format ${t}`, e, O);
    }
    static fromString(e, t, r = {}) {
      return W.fromFormat(e, t, r);
    }
    static fromSQL(e, t = {}) {
      const [r, s] = Wi(e);
      return et(r, s, t, "SQL", e);
    }
    static invalid(e, t = null) {
      if (!e) throw new l("need to specify a reason the DateTime is invalid");
      const r = e instanceof Oe ? e : new Oe(e, t);
      if (K.throwOnInvalid) throw new w(r);
      return new W({ invalid: r });
    }
    static isDateTime(e) {
      return (e && e.isLuxonDateTime) || !1;
    }
    static parseFormatForOpts(e, t = {}) {
      const r = Vr(e, q.fromObject(t));
      return r ? r.map((s) => (s ? s.val : null)).join("") : null;
    }
    static expandFormat(e, t = {}) {
      return Nr(ce.parseFormat(e), q.fromObject(t))
        .map((s) => s.val)
        .join("");
    }
    static resetCache() {
      ((yt = void 0), mn.clear());
    }
    get(e) {
      return this[e];
    }
    get isValid() {
      return this.invalid === null;
    }
    get invalidReason() {
      return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
      return this.invalid ? this.invalid.explanation : null;
    }
    get locale() {
      return this.isValid ? this.loc.locale : null;
    }
    get numberingSystem() {
      return this.isValid ? this.loc.numberingSystem : null;
    }
    get outputCalendar() {
      return this.isValid ? this.loc.outputCalendar : null;
    }
    get zone() {
      return this._zone;
    }
    get zoneName() {
      return this.isValid ? this.zone.name : null;
    }
    get year() {
      return this.isValid ? this.c.year : NaN;
    }
    get quarter() {
      return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
    }
    get month() {
      return this.isValid ? this.c.month : NaN;
    }
    get day() {
      return this.isValid ? this.c.day : NaN;
    }
    get hour() {
      return this.isValid ? this.c.hour : NaN;
    }
    get minute() {
      return this.isValid ? this.c.minute : NaN;
    }
    get second() {
      return this.isValid ? this.c.second : NaN;
    }
    get millisecond() {
      return this.isValid ? this.c.millisecond : NaN;
    }
    get weekYear() {
      return this.isValid ? dn(this).weekYear : NaN;
    }
    get weekNumber() {
      return this.isValid ? dn(this).weekNumber : NaN;
    }
    get weekday() {
      return this.isValid ? dn(this).weekday : NaN;
    }
    get isWeekend() {
      return this.isValid && this.loc.getWeekendDays().includes(this.weekday);
    }
    get localWeekday() {
      return this.isValid ? fn(this).weekday : NaN;
    }
    get localWeekNumber() {
      return this.isValid ? fn(this).weekNumber : NaN;
    }
    get localWeekYear() {
      return this.isValid ? fn(this).weekYear : NaN;
    }
    get ordinal() {
      return this.isValid ? en(this.c).ordinal : NaN;
    }
    get monthShort() {
      return this.isValid ? ht.months("short", { locObj: this.loc })[this.month - 1] : null;
    }
    get monthLong() {
      return this.isValid ? ht.months("long", { locObj: this.loc })[this.month - 1] : null;
    }
    get weekdayShort() {
      return this.isValid ? ht.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
    }
    get weekdayLong() {
      return this.isValid ? ht.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
    }
    get offset() {
      return this.isValid ? +this.o : NaN;
    }
    get offsetNameShort() {
      return this.isValid ? this.zone.offsetName(this.ts, { format: "short", locale: this.locale }) : null;
    }
    get offsetNameLong() {
      return this.isValid ? this.zone.offsetName(this.ts, { format: "long", locale: this.locale }) : null;
    }
    get isOffsetFixed() {
      return this.isValid ? this.zone.isUniversal : null;
    }
    get isInDST() {
      return this.isOffsetFixed
        ? !1
        : this.offset > this.set({ month: 1, day: 1 }).offset || this.offset > this.set({ month: 5 }).offset;
    }
    getPossibleOffsets() {
      if (!this.isValid || this.isOffsetFixed) return [this];
      const e = 864e5,
        t = 6e4,
        r = Wt(this.c),
        s = this.zone.offset(r - e),
        a = this.zone.offset(r + e),
        u = this.zone.offset(r - s * t),
        c = this.zone.offset(r - a * t);
      if (u === c) return [this];
      const d = r - u * t,
        O = r - c * t,
        _ = Rt(d, u),
        U = Rt(O, c);
      return _.hour === U.hour && _.minute === U.minute && _.second === U.second && _.millisecond === U.millisecond
        ? [Pe(this, { ts: d }), Pe(this, { ts: O })]
        : [this];
    }
    get isInLeapYear() {
      return ut(this.year);
    }
    get daysInMonth() {
      return Ft(this.year, this.month);
    }
    get daysInYear() {
      return this.isValid ? Ye(this.year) : NaN;
    }
    get weeksInWeekYear() {
      return this.isValid ? lt(this.weekYear) : NaN;
    }
    get weeksInLocalWeekYear() {
      return this.isValid ? lt(this.localWeekYear, this.loc.getMinDaysInFirstWeek(), this.loc.getStartOfWeek()) : NaN;
    }
    resolvedLocaleOptions(e = {}) {
      const { locale: t, numberingSystem: r, calendar: s } = ce.create(this.loc.clone(e), e).resolvedOptions(this);
      return { locale: t, numberingSystem: r, outputCalendar: s };
    }
    toUTC(e = 0, t = {}) {
      return this.setZone(le.instance(e), t);
    }
    toLocal() {
      return this.setZone(K.defaultZone);
    }
    setZone(e, { keepLocalTime: t = !1, keepCalendarTime: r = !1 } = {}) {
      if (((e = We(e, K.defaultZone)), e.equals(this.zone))) return this;
      if (e.isValid) {
        let s = this.ts;
        if (t || r) {
          const a = e.offset(this.ts),
            u = this.toObject();
          [s] = Pt(u, a, e);
        }
        return Pe(this, { ts: s, zone: e });
      } else return W.invalid(mt(e));
    }
    reconfigure({ locale: e, numberingSystem: t, outputCalendar: r } = {}) {
      const s = this.loc.clone({ locale: e, numberingSystem: t, outputCalendar: r });
      return Pe(this, { loc: s });
    }
    setLocale(e) {
      return this.reconfigure({ locale: e });
    }
    set(e) {
      if (!this.isValid) return this;
      const t = At(e, Ur),
        { minDaysInFirstWeek: r, startOfWeek: s } = Gn(t, this.loc),
        a = !F(t.weekYear) || !F(t.weekNumber) || !F(t.weekday),
        u = !F(t.ordinal),
        c = !F(t.year),
        d = !F(t.month) || !F(t.day),
        O = c || d,
        _ = t.weekYear || t.weekNumber;
      if ((O || u) && _) throw new v("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
      if (d && u) throw new v("Can't mix ordinal dates with month/day");
      let U;
      a
        ? (U = Bn({ ...Vt(this.c, r, s), ...t }, r, s))
        : F(t.ordinal)
          ? ((U = { ...this.toObject(), ...t }), F(t.day) && (U.day = Math.min(Ft(U.year, U.month), U.day)))
          : (U = Jn({ ...en(this.c), ...t }));
      const [J, E] = Pt(U, this.o, this.zone);
      return Pe(this, { ts: J, o: E });
    }
    plus(e) {
      if (!this.isValid) return this;
      const t = z.fromDurationLike(e);
      return Pe(this, Wr(this, t));
    }
    minus(e) {
      if (!this.isValid) return this;
      const t = z.fromDurationLike(e).negate();
      return Pe(this, Wr(this, t));
    }
    startOf(e, { useLocaleWeeks: t = !1 } = {}) {
      if (!this.isValid) return this;
      const r = {},
        s = z.normalizeUnit(e);
      switch (s) {
        case "years":
          r.month = 1;
        case "quarters":
        case "months":
          r.day = 1;
        case "weeks":
        case "days":
          r.hour = 0;
        case "hours":
          r.minute = 0;
        case "minutes":
          r.second = 0;
        case "seconds":
          r.millisecond = 0;
          break;
      }
      if (s === "weeks")
        if (t) {
          const a = this.loc.getStartOfWeek(),
            { weekday: u } = this;
          (u < a && (r.weekNumber = this.weekNumber - 1), (r.weekday = a));
        } else r.weekday = 1;
      if (s === "quarters") {
        const a = Math.ceil(this.month / 3);
        r.month = (a - 1) * 3 + 1;
      }
      return this.set(r);
    }
    endOf(e, t) {
      return this.isValid
        ? this.plus({ [e]: 1 })
            .startOf(e, t)
            .minus(1)
        : this;
    }
    toFormat(e, t = {}) {
      return this.isValid ? ce.create(this.loc.redefaultToEN(t)).formatDateTimeFromString(this, e) : cn;
    }
    toLocaleString(e = k, t = {}) {
      return this.isValid ? ce.create(this.loc.clone(t), e).formatDateTime(this) : cn;
    }
    toLocaleParts(e = {}) {
      return this.isValid ? ce.create(this.loc.clone(e), e).formatDateTimeParts(this) : [];
    }
    toISO({
      format: e = "extended",
      suppressSeconds: t = !1,
      suppressMilliseconds: r = !1,
      includeOffset: s = !0,
      extendedZone: a = !1,
      precision: u = "milliseconds",
    } = {}) {
      if (!this.isValid) return null;
      u = Zt(u);
      const c = e === "extended";
      let d = hn(this, c, u);
      return (Ht.indexOf(u) >= 3 && (d += "T"), (d += Lr(this, c, t, r, s, a, u)), d);
    }
    toISODate({ format: e = "extended", precision: t = "day" } = {}) {
      return this.isValid ? hn(this, e === "extended", Zt(t)) : null;
    }
    toISOWeekDate() {
      return zt(this, "kkkk-'W'WW-c");
    }
    toISOTime({
      suppressMilliseconds: e = !1,
      suppressSeconds: t = !1,
      includeOffset: r = !0,
      includePrefix: s = !1,
      extendedZone: a = !1,
      format: u = "extended",
      precision: c = "milliseconds",
    } = {}) {
      return this.isValid
        ? ((c = Zt(c)), (s && Ht.indexOf(c) >= 3 ? "T" : "") + Lr(this, u === "extended", t, e, r, a, c))
        : null;
    }
    toRFC2822() {
      return zt(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", !1);
    }
    toHTTP() {
      return zt(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
    }
    toSQLDate() {
      return this.isValid ? hn(this, !0) : null;
    }
    toSQLTime({ includeOffset: e = !0, includeZone: t = !1, includeOffsetSpace: r = !0 } = {}) {
      let s = "HH:mm:ss.SSS";
      return ((t || e) && (r && (s += " "), t ? (s += "z") : e && (s += "ZZ")), zt(this, s, !0));
    }
    toSQL(e = {}) {
      return this.isValid ? `${this.toSQLDate()} ${this.toSQLTime(e)}` : null;
    }
    toString() {
      return this.isValid ? this.toISO() : cn;
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.isValid
        ? `DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`
        : `DateTime { Invalid, reason: ${this.invalidReason} }`;
    }
    valueOf() {
      return this.toMillis();
    }
    toMillis() {
      return this.isValid ? this.ts : NaN;
    }
    toSeconds() {
      return this.isValid ? this.ts / 1e3 : NaN;
    }
    toUnixInteger() {
      return this.isValid ? Math.floor(this.ts / 1e3) : NaN;
    }
    toJSON() {
      return this.toISO();
    }
    toBSON() {
      return this.toJSDate();
    }
    toObject(e = {}) {
      if (!this.isValid) return {};
      const t = { ...this.c };
      return (
        e.includeConfig &&
          ((t.outputCalendar = this.outputCalendar),
          (t.numberingSystem = this.loc.numberingSystem),
          (t.locale = this.loc.locale)),
        t
      );
    }
    toJSDate() {
      return new Date(this.isValid ? this.ts : NaN);
    }
    diff(e, t = "milliseconds", r = {}) {
      if (!this.isValid || !e.isValid) return z.invalid("created by diffing an invalid DateTime");
      const s = { locale: this.locale, numberingSystem: this.numberingSystem, ...r },
        a = Us(t).map(z.normalizeUnit),
        u = e.valueOf() > this.valueOf(),
        c = u ? this : e,
        d = u ? e : this,
        O = Pi(c, d, a, s);
      return u ? O.negate() : O;
    }
    diffNow(e = "milliseconds", t = {}) {
      return this.diff(W.now(), e, t);
    }
    until(e) {
      return this.isValid ? Q.fromDateTimes(this, e) : this;
    }
    hasSame(e, t, r) {
      if (!this.isValid) return !1;
      const s = e.valueOf(),
        a = this.setZone(e.zone, { keepLocalTime: !0 });
      return a.startOf(t, r) <= s && s <= a.endOf(t, r);
    }
    equals(e) {
      return (
        this.isValid &&
        e.isValid &&
        this.valueOf() === e.valueOf() &&
        this.zone.equals(e.zone) &&
        this.loc.equals(e.loc)
      );
    }
    toRelative(e = {}) {
      if (!this.isValid) return null;
      const t = e.base || W.fromObject({}, { zone: this.zone }),
        r = e.padding ? (this < t ? -e.padding : e.padding) : 0;
      let s = ["years", "months", "days", "hours", "minutes", "seconds"],
        a = e.unit;
      return (
        Array.isArray(e.unit) && ((s = e.unit), (a = void 0)),
        Rr(t, this.plus(r), { ...e, numeric: "always", units: s, unit: a })
      );
    }
    toRelativeCalendar(e = {}) {
      return this.isValid
        ? Rr(e.base || W.fromObject({}, { zone: this.zone }), this, {
            ...e,
            numeric: "auto",
            units: ["years", "months", "days"],
            calendary: !0,
          })
        : null;
    }
    static min(...e) {
      if (!e.every(W.isDateTime)) throw new l("min requires all arguments be DateTimes");
      return er(e, (t) => t.valueOf(), Math.min);
    }
    static max(...e) {
      if (!e.every(W.isDateTime)) throw new l("max requires all arguments be DateTimes");
      return er(e, (t) => t.valueOf(), Math.max);
    }
    static fromFormatExplain(e, t, r = {}) {
      const { locale: s = null, numberingSystem: a = null } = r,
        u = q.fromOpts({ locale: s, numberingSystem: a, defaultToEN: !0 });
      return Er(u, e, t);
    }
    static fromStringExplain(e, t, r = {}) {
      return W.fromFormatExplain(e, t, r);
    }
    static buildFormatParser(e, t = {}) {
      const { locale: r = null, numberingSystem: s = null } = t,
        a = q.fromOpts({ locale: r, numberingSystem: s, defaultToEN: !0 });
      return new _r(a, e);
    }
    static fromFormatParser(e, t, r = {}) {
      if (F(e) || F(t)) throw new l("fromFormatParser requires an input string and a format parser");
      const { locale: s = null, numberingSystem: a = null } = r,
        u = q.fromOpts({ locale: s, numberingSystem: a, defaultToEN: !0 });
      if (!u.equals(t.locale))
        throw new l(`fromFormatParser called with a locale of ${u}, but the format parser was created for ${t.locale}`);
      const { result: c, zone: d, specificOffset: O, invalidReason: _ } = t.explainFromTokens(e);
      return _ ? W.invalid(_) : et(c, d, r, `format ${t.format}`, e, O);
    }
    static get DATE_SHORT() {
      return k;
    }
    static get DATE_MED() {
      return S;
    }
    static get DATE_MED_WITH_WEEKDAY() {
      return T;
    }
    static get DATE_FULL() {
      return M;
    }
    static get DATE_HUGE() {
      return N;
    }
    static get TIME_SIMPLE() {
      return x;
    }
    static get TIME_WITH_SECONDS() {
      return L;
    }
    static get TIME_WITH_SHORT_OFFSET() {
      return A;
    }
    static get TIME_WITH_LONG_OFFSET() {
      return H;
    }
    static get TIME_24_SIMPLE() {
      return X;
    }
    static get TIME_24_WITH_SECONDS() {
      return V;
    }
    static get TIME_24_WITH_SHORT_OFFSET() {
      return $;
    }
    static get TIME_24_WITH_LONG_OFFSET() {
      return G;
    }
    static get DATETIME_SHORT() {
      return ee;
    }
    static get DATETIME_SHORT_WITH_SECONDS() {
      return ie;
    }
    static get DATETIME_MED() {
      return R;
    }
    static get DATETIME_MED_WITH_SECONDS() {
      return ae;
    }
    static get DATETIME_MED_WITH_WEEKDAY() {
      return De;
    }
    static get DATETIME_FULL() {
      return I;
    }
    static get DATETIME_FULL_WITH_SECONDS() {
      return C;
    }
    static get DATETIME_HUGE() {
      return fe;
    }
    static get DATETIME_HUGE_WITH_SECONDS() {
      return B;
    }
  }
  function gt(n) {
    if (W.isDateTime(n)) return n;
    if (n && n.valueOf && Le(n.valueOf())) return W.fromJSDate(n);
    if (n && typeof n == "object") return W.fromObject(n);
    throw new l(`Unknown datetime argument: ${n}, of type ${typeof n}`);
  }
  const ia = "3.7.2";
  return (
    (me.DateTime = W),
    (me.Duration = z),
    (me.FixedOffsetZone = le),
    (me.IANAZone = ve),
    (me.Info = ht),
    (me.Interval = Q),
    (me.InvalidZone = Cn),
    (me.Settings = K),
    (me.SystemZone = ge),
    (me.VERSION = ia),
    (me.Zone = te),
    me
  );
}
var kn, Xr;
function Aa() {
  if (Xr) return kn;
  Xr = 1;
  var i = La();
  ((w.prototype.addYear = function () {
    this._date = this._date.plus({ years: 1 });
  }),
    (w.prototype.addMonth = function () {
      this._date = this._date.plus({ months: 1 }).startOf("month");
    }),
    (w.prototype.addDay = function () {
      this._date = this._date.plus({ days: 1 }).startOf("day");
    }),
    (w.prototype.addHour = function () {
      var m = this._date;
      ((this._date = this._date.plus({ hours: 1 }).startOf("hour")),
        this._date <= m && (this._date = this._date.plus({ hours: 1 })));
    }),
    (w.prototype.addMinute = function () {
      var m = this._date;
      ((this._date = this._date.plus({ minutes: 1 }).startOf("minute")),
        this._date < m && (this._date = this._date.plus({ hours: 1 })));
    }),
    (w.prototype.addSecond = function () {
      var m = this._date;
      ((this._date = this._date.plus({ seconds: 1 }).startOf("second")),
        this._date < m && (this._date = this._date.plus({ hours: 1 })));
    }),
    (w.prototype.subtractYear = function () {
      this._date = this._date.minus({ years: 1 });
    }),
    (w.prototype.subtractMonth = function () {
      this._date = this._date.minus({ months: 1 }).endOf("month").startOf("second");
    }),
    (w.prototype.subtractDay = function () {
      this._date = this._date.minus({ days: 1 }).endOf("day").startOf("second");
    }),
    (w.prototype.subtractHour = function () {
      var m = this._date;
      ((this._date = this._date.minus({ hours: 1 }).endOf("hour").startOf("second")),
        this._date >= m && (this._date = this._date.minus({ hours: 1 })));
    }),
    (w.prototype.subtractMinute = function () {
      var m = this._date;
      ((this._date = this._date.minus({ minutes: 1 }).endOf("minute").startOf("second")),
        this._date > m && (this._date = this._date.minus({ hours: 1 })));
    }),
    (w.prototype.subtractSecond = function () {
      var m = this._date;
      ((this._date = this._date.minus({ seconds: 1 }).startOf("second")),
        this._date > m && (this._date = this._date.minus({ hours: 1 })));
    }),
    (w.prototype.getDate = function () {
      return this._date.day;
    }),
    (w.prototype.getFullYear = function () {
      return this._date.year;
    }),
    (w.prototype.getDay = function () {
      var m = this._date.weekday;
      return m == 7 ? 0 : m;
    }),
    (w.prototype.getMonth = function () {
      return this._date.month - 1;
    }),
    (w.prototype.getHours = function () {
      return this._date.hour;
    }),
    (w.prototype.getMinutes = function () {
      return this._date.minute;
    }),
    (w.prototype.getSeconds = function () {
      return this._date.second;
    }),
    (w.prototype.getMilliseconds = function () {
      return this._date.millisecond;
    }),
    (w.prototype.getTime = function () {
      return this._date.valueOf();
    }),
    (w.prototype.getUTCDate = function () {
      return this._getUTC().day;
    }),
    (w.prototype.getUTCFullYear = function () {
      return this._getUTC().year;
    }),
    (w.prototype.getUTCDay = function () {
      var m = this._getUTC().weekday;
      return m == 7 ? 0 : m;
    }),
    (w.prototype.getUTCMonth = function () {
      return this._getUTC().month - 1;
    }),
    (w.prototype.getUTCHours = function () {
      return this._getUTC().hour;
    }),
    (w.prototype.getUTCMinutes = function () {
      return this._getUTC().minute;
    }),
    (w.prototype.getUTCSeconds = function () {
      return this._getUTC().second;
    }),
    (w.prototype.toISOString = function () {
      return this._date.toUTC().toISO();
    }),
    (w.prototype.toJSON = function () {
      return this._date.toJSON();
    }),
    (w.prototype.setDate = function (m) {
      this._date = this._date.set({ day: m });
    }),
    (w.prototype.setFullYear = function (m) {
      this._date = this._date.set({ year: m });
    }),
    (w.prototype.setDay = function (m) {
      this._date = this._date.set({ weekday: m });
    }),
    (w.prototype.setMonth = function (m) {
      this._date = this._date.set({ month: m + 1 });
    }),
    (w.prototype.setHours = function (m) {
      this._date = this._date.set({ hour: m });
    }),
    (w.prototype.setMinutes = function (m) {
      this._date = this._date.set({ minute: m });
    }),
    (w.prototype.setSeconds = function (m) {
      this._date = this._date.set({ second: m });
    }),
    (w.prototype.setMilliseconds = function (m) {
      this._date = this._date.set({ millisecond: m });
    }),
    (w.prototype._getUTC = function () {
      return this._date.toUTC();
    }),
    (w.prototype.toString = function () {
      return this.toDate().toString();
    }),
    (w.prototype.toDate = function () {
      return this._date.toJSDate();
    }),
    (w.prototype.isLastDayOfMonth = function () {
      var m = this._date.plus({ days: 1 }).startOf("day");
      return this._date.month !== m.month;
    }),
    (w.prototype.isLastWeekdayOfMonth = function () {
      var m = this._date.plus({ days: 7 }).startOf("day");
      return this._date.month !== m.month;
    }));
  function w(m, f) {
    var v = { zone: f };
    if (
      (m
        ? m instanceof w
          ? (this._date = m._date)
          : m instanceof Date
            ? (this._date = i.DateTime.fromJSDate(m, v))
            : typeof m == "number"
              ? (this._date = i.DateTime.fromMillis(m, v))
              : typeof m == "string" &&
                ((this._date = i.DateTime.fromISO(m, v)),
                this._date.isValid || (this._date = i.DateTime.fromRFC2822(m, v)),
                this._date.isValid || (this._date = i.DateTime.fromSQL(m, v)),
                this._date.isValid || (this._date = i.DateTime.fromFormat(m, "EEE, d MMM yyyy HH:mm:ss", v)))
        : (this._date = i.DateTime.local()),
      !this._date || !this._date.isValid)
    )
      throw new Error("CronDate: unhandled timestamp: " + JSON.stringify(m));
    f && f !== this._date.zoneName && (this._date = this._date.setZone(f));
  }
  return ((kn = w), kn);
}
var Sn, es;
function Ua() {
  if (es) return Sn;
  es = 1;
  function i(v) {
    return { start: v, count: 1 };
  }
  function w(v, h) {
    ((v.end = h), (v.step = h - v.start), (v.count = 2));
  }
  function m(v, h, l) {
    (h && (h.count === 2 ? (v.push(i(h.start)), v.push(i(h.end))) : v.push(h)), l && v.push(l));
  }
  function f(v) {
    for (var h = [], l = void 0, g = 0; g < v.length; g++) {
      var o = v[g];
      typeof o != "number"
        ? (m(h, l, i(o)), (l = void 0))
        : l
          ? l.count === 1
            ? w(l, o)
            : l.step === o - l.end
              ? (l.count++, (l.end = o))
              : l.count === 2
                ? (h.push(i(l.start)), (l = i(l.end)), w(l, o))
                : (m(h, l), (l = i(o)))
          : (l = i(o));
    }
    return (m(h, l), h);
  }
  return ((Sn = f), Sn);
}
var Tn, ts;
function $a() {
  if (ts) return Tn;
  ts = 1;
  var i = Ua();
  function w(m, f, v) {
    var h = i(m);
    if (h.length === 1) {
      var l = h[0],
        g = l.step;
      if (g === 1 && l.start === f && l.end === v) return "*";
      if (g !== 1 && l.start === f && l.end === v - g + 1) return "*/" + g;
    }
    for (var o = [], p = 0, y = h.length; p < y; ++p) {
      var k = h[p];
      if (k.count === 1) {
        o.push(k.start);
        continue;
      }
      var g = k.step;
      if (k.step === 1) {
        o.push(k.start + "-" + k.end);
        continue;
      }
      var S = k.start == 0 ? k.count - 1 : k.count;
      k.step * S > k.end
        ? (o = o.concat(
            Array.from({ length: k.end - k.start + 1 })
              .map(function (M, N) {
                var x = k.start + N;
                return (x - k.start) % k.step === 0 ? x : null;
              })
              .filter(function (M) {
                return M != null;
              }),
          ))
        : k.end === v - k.step + 1
          ? o.push(k.start + "/" + k.step)
          : o.push(k.start + "-" + k.end + "/" + k.step);
    }
    return o.join(",");
  }
  return ((Tn = w), Tn);
}
var On, ns;
function Ra() {
  if (ns) return On;
  ns = 1;
  var i = Aa(),
    w = $a(),
    m = 1e4;
  function f(v, h) {
    ((this._options = h),
      (this._utc = h.utc || !1),
      (this._tz = this._utc ? "UTC" : h.tz),
      (this._currentDate = new i(h.currentDate, this._tz)),
      (this._startDate = h.startDate ? new i(h.startDate, this._tz) : null),
      (this._endDate = h.endDate ? new i(h.endDate, this._tz) : null),
      (this._isIterator = h.iterator || !1),
      (this._hasIterated = !1),
      (this._nthDayOfWeek = h.nthDayOfWeek || 0),
      (this.fields = f._freezeFields(v)));
  }
  return (
    (f.map = ["second", "minute", "hour", "dayOfMonth", "month", "dayOfWeek"]),
    (f.predefined = {
      "@yearly": "0 0 1 1 *",
      "@monthly": "0 0 1 * *",
      "@weekly": "0 0 * * 0",
      "@daily": "0 0 * * *",
      "@hourly": "0 * * * *",
    }),
    (f.constraints = [
      { min: 0, max: 59, chars: [] },
      { min: 0, max: 59, chars: [] },
      { min: 0, max: 23, chars: [] },
      { min: 1, max: 31, chars: ["L"] },
      { min: 1, max: 12, chars: [] },
      { min: 0, max: 7, chars: ["L"] },
    ]),
    (f.daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]),
    (f.aliases = {
      month: { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 },
      dayOfWeek: { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 },
    }),
    (f.parseDefaults = ["0", "*", "*", "*", "*", "*"]),
    (f.standardValidCharacters = /^[,*\d/-]+$/),
    (f.dayOfWeekValidCharacters = /^[?,*\dL#/-]+$/),
    (f.dayOfMonthValidCharacters = /^[?,*\dL/-]+$/),
    (f.validCharacters = {
      second: f.standardValidCharacters,
      minute: f.standardValidCharacters,
      hour: f.standardValidCharacters,
      dayOfMonth: f.dayOfMonthValidCharacters,
      month: f.standardValidCharacters,
      dayOfWeek: f.dayOfWeekValidCharacters,
    }),
    (f._isValidConstraintChar = function (h, l) {
      return typeof l != "string"
        ? !1
        : h.chars.some(function (g) {
            return l.indexOf(g) > -1;
          });
    }),
    (f._parseField = function (h, l, g) {
      switch (h) {
        case "month":
        case "dayOfWeek":
          var o = f.aliases[h];
          l = l.replace(/[a-z]{3}/gi, function (S) {
            if (((S = S.toLowerCase()), typeof o[S] < "u")) return o[S];
            throw new Error('Validation error, cannot resolve alias "' + S + '"');
          });
          break;
      }
      if (!f.validCharacters[h].test(l)) throw new Error("Invalid characters, got value: " + l);
      l.indexOf("*") !== -1
        ? (l = l.replace(/\*/g, g.min + "-" + g.max))
        : l.indexOf("?") !== -1 && (l = l.replace(/\?/g, g.min + "-" + g.max));
      function p(S) {
        var T = [];
        function M(A) {
          if (A instanceof Array)
            for (var H = 0, X = A.length; H < X; H++) {
              var V = A[H];
              if (f._isValidConstraintChar(g, V)) {
                T.push(V);
                continue;
              }
              if (typeof V != "number" || Number.isNaN(V) || V < g.min || V > g.max)
                throw new Error("Constraint error, got value " + V + " expected range " + g.min + "-" + g.max);
              T.push(V);
            }
          else {
            if (f._isValidConstraintChar(g, A)) {
              T.push(A);
              return;
            }
            var $ = +A;
            if (Number.isNaN($) || $ < g.min || $ > g.max)
              throw new Error("Constraint error, got value " + A + " expected range " + g.min + "-" + g.max);
            (h === "dayOfWeek" && ($ = $ % 7), T.push($));
          }
        }
        var N = S.split(",");
        if (
          !N.every(function (A) {
            return A.length > 0;
          })
        )
          throw new Error("Invalid list value format");
        if (N.length > 1) for (var x = 0, L = N.length; x < L; x++) M(y(N[x]));
        else M(y(S));
        return (T.sort(f._sortCompareFn), T);
      }
      function y(S) {
        var T = 1,
          M = S.split("/");
        if (M.length > 2) throw new Error("Invalid repeat: " + S);
        return M.length > 1 ? (M[0] == +M[0] && (M = [M[0] + "-" + g.max, M[1]]), k(M[0], M[M.length - 1])) : k(S, T);
      }
      function k(S, T) {
        var M = [],
          N = S.split("-");
        if (N.length > 1) {
          if (N.length < 2) return +S;
          if (!N[0].length) {
            if (!N[1].length) throw new Error("Invalid range: " + S);
            return +S;
          }
          var x = +N[0],
            L = +N[1];
          if (Number.isNaN(x) || Number.isNaN(L) || x < g.min || L > g.max)
            throw new Error("Constraint error, got range " + x + "-" + L + " expected range " + g.min + "-" + g.max);
          if (x > L) throw new Error("Invalid range: " + S);
          var A = +T;
          if (Number.isNaN(A) || A <= 0) throw new Error("Constraint error, cannot repeat at every " + A + " time.");
          h === "dayOfWeek" && L % 7 === 0 && M.push(0);
          for (var H = x, X = L; H <= X; H++) {
            var V = M.indexOf(H) !== -1;
            !V && A > 0 && A % T === 0 ? ((A = 1), M.push(H)) : A++;
          }
          return M;
        }
        return Number.isNaN(+S) ? S : +S;
      }
      return p(l);
    }),
    (f._sortCompareFn = function (v, h) {
      var l = typeof v == "number",
        g = typeof h == "number";
      return l && g ? v - h : !l && g ? 1 : l && !g ? -1 : v.localeCompare(h);
    }),
    (f._handleMaxDaysInMonth = function (v) {
      if (v.month.length === 1) {
        var h = f.daysInMonth[v.month[0] - 1];
        if (v.dayOfMonth[0] > h) throw new Error("Invalid explicit day of month definition");
        return v.dayOfMonth
          .filter(function (l) {
            return l === "L" ? !0 : l <= h;
          })
          .sort(f._sortCompareFn);
      }
    }),
    (f._freezeFields = function (v) {
      for (var h = 0, l = f.map.length; h < l; ++h) {
        var g = f.map[h],
          o = v[g];
        v[g] = Object.freeze(o);
      }
      return Object.freeze(v);
    }),
    (f.prototype._applyTimezoneShift = function (v, h, l) {
      if (l === "Month" || l === "Day") {
        var g = v.getTime();
        v[h + l]();
        var o = v.getTime();
        g === o &&
          (v.getMinutes() === 0 && v.getSeconds() === 0
            ? v.addHour()
            : v.getMinutes() === 59 && v.getSeconds() === 59 && v.subtractHour());
      } else {
        var p = v.getHours();
        v[h + l]();
        var y = v.getHours(),
          k = y - p;
        k === 2
          ? this.fields.hour.length !== 24 && (this._dstStart = y)
          : k === 0 &&
            v.getMinutes() === 0 &&
            v.getSeconds() === 0 &&
            this.fields.hour.length !== 24 &&
            (this._dstEnd = y);
      }
    }),
    (f.prototype._findSchedule = function (h) {
      function l(V, $) {
        for (var G = 0, ee = $.length; G < ee; G++) if ($[G] >= V) return $[G] === V;
        return $[0] === V;
      }
      function g(V, $) {
        if ($ < 6) {
          if (V.getDate() < 8 && $ === 1) return !0;
          var G = V.getDate() % 7 ? 1 : 0,
            ee = V.getDate() - (V.getDate() % 7),
            ie = Math.floor(ee / 7) + G;
          return ie === $;
        }
        return !1;
      }
      function o(V) {
        return (
          V.length > 0 &&
          V.some(function ($) {
            return typeof $ == "string" && $.indexOf("L") >= 0;
          })
        );
      }
      h = h || !1;
      var p = h ? "subtract" : "add",
        y = new i(this._currentDate, this._tz),
        k = this._startDate,
        S = this._endDate,
        T = y.getTime(),
        M = 0;
      function N(V) {
        return V.some(function ($) {
          if (!o([$])) return !1;
          var G = Number.parseInt($[0]) % 7;
          if (Number.isNaN(G)) throw new Error("Invalid last weekday of the month expression: " + $);
          return y.getDay() === G && y.isLastWeekdayOfMonth();
        });
      }
      for (; M < m; ) {
        if ((M++, h)) {
          if (k && y.getTime() - k.getTime() < 0) throw new Error("Out of the timespan range");
        } else if (S && S.getTime() - y.getTime() < 0) throw new Error("Out of the timespan range");
        var x = l(y.getDate(), this.fields.dayOfMonth);
        o(this.fields.dayOfMonth) && (x = x || y.isLastDayOfMonth());
        var L = l(y.getDay(), this.fields.dayOfWeek);
        o(this.fields.dayOfWeek) && (L = L || N(this.fields.dayOfWeek));
        var A = this.fields.dayOfMonth.length >= f.daysInMonth[y.getMonth()],
          H = this.fields.dayOfWeek.length === f.constraints[5].max - f.constraints[5].min + 1,
          X = y.getHours();
        if (!x && (!L || H)) {
          this._applyTimezoneShift(y, p, "Day");
          continue;
        }
        if (!A && H && !x) {
          this._applyTimezoneShift(y, p, "Day");
          continue;
        }
        if (A && !H && !L) {
          this._applyTimezoneShift(y, p, "Day");
          continue;
        }
        if (this._nthDayOfWeek > 0 && !g(y, this._nthDayOfWeek)) {
          this._applyTimezoneShift(y, p, "Day");
          continue;
        }
        if (!l(y.getMonth() + 1, this.fields.month)) {
          this._applyTimezoneShift(y, p, "Month");
          continue;
        }
        if (l(X, this.fields.hour)) {
          if (this._dstEnd === X && !h) {
            ((this._dstEnd = null), this._applyTimezoneShift(y, "add", "Hour"));
            continue;
          }
        } else if (this._dstStart !== X) {
          ((this._dstStart = null), this._applyTimezoneShift(y, p, "Hour"));
          continue;
        } else if (!l(X - 1, this.fields.hour)) {
          y[p + "Hour"]();
          continue;
        }
        if (!l(y.getMinutes(), this.fields.minute)) {
          this._applyTimezoneShift(y, p, "Minute");
          continue;
        }
        if (!l(y.getSeconds(), this.fields.second)) {
          this._applyTimezoneShift(y, p, "Second");
          continue;
        }
        if (T === y.getTime()) {
          p === "add" || y.getMilliseconds() === 0 ? this._applyTimezoneShift(y, p, "Second") : y.setMilliseconds(0);
          continue;
        }
        break;
      }
      if (M >= m) throw new Error("Invalid expression, loop limit exceeded");
      return ((this._currentDate = new i(y, this._tz)), (this._hasIterated = !0), y);
    }),
    (f.prototype.next = function () {
      var h = this._findSchedule();
      return this._isIterator ? { value: h, done: !this.hasNext() } : h;
    }),
    (f.prototype.prev = function () {
      var h = this._findSchedule(!0);
      return this._isIterator ? { value: h, done: !this.hasPrev() } : h;
    }),
    (f.prototype.hasNext = function () {
      var v = this._currentDate,
        h = this._hasIterated;
      try {
        return (this._findSchedule(), !0);
      } catch {
        return !1;
      } finally {
        ((this._currentDate = v), (this._hasIterated = h));
      }
    }),
    (f.prototype.hasPrev = function () {
      var v = this._currentDate,
        h = this._hasIterated;
      try {
        return (this._findSchedule(!0), !0);
      } catch {
        return !1;
      } finally {
        ((this._currentDate = v), (this._hasIterated = h));
      }
    }),
    (f.prototype.iterate = function (h, l) {
      var g = [];
      if (h >= 0)
        for (var o = 0, p = h; o < p; o++)
          try {
            var y = this.next();
            (g.push(y), l && l(y, o));
          } catch {
            break;
          }
      else
        for (var o = 0, p = h; o > p; o--)
          try {
            var y = this.prev();
            (g.push(y), l && l(y, o));
          } catch {
            break;
          }
      return g;
    }),
    (f.prototype.reset = function (h) {
      this._currentDate = new i(h || this._options.currentDate);
    }),
    (f.prototype.stringify = function (h) {
      for (var l = [], g = h ? 0 : 1, o = f.map.length; g < o; ++g) {
        var p = f.map[g],
          y = this.fields[p],
          k = f.constraints[g];
        (p === "dayOfMonth" && this.fields.month.length === 1
          ? (k = { min: 1, max: f.daysInMonth[this.fields.month[0] - 1] })
          : p === "dayOfWeek" && ((k = { min: 0, max: 6 }), (y = y[y.length - 1] === 7 ? y.slice(0, -1) : y)),
          l.push(w(y, k.min, k.max)));
      }
      return l.join(" ");
    }),
    (f.parse = function (h, l) {
      var g = this;
      typeof l == "function" && (l = {});
      function o(p, y) {
        (y || (y = {}),
          typeof y.currentDate > "u" && (y.currentDate = new i(void 0, g._tz)),
          f.predefined[p] && (p = f.predefined[p]));
        var k = [],
          S = (p + "").trim().split(/\s+/);
        if (S.length > 6) throw new Error("Invalid cron expression");
        for (var T = f.map.length - S.length, M = 0, N = f.map.length; M < N; ++M) {
          var x = f.map[M],
            L = S[S.length > N ? M : M - T];
          if (M < T || !L) k.push(f._parseField(x, f.parseDefaults[M], f.constraints[M]));
          else {
            var A = x === "dayOfWeek" ? $(L) : L;
            k.push(f._parseField(x, A, f.constraints[M]));
          }
        }
        for (var H = {}, M = 0, N = f.map.length; M < N; M++) {
          var X = f.map[M];
          H[X] = k[M];
        }
        var V = f._handleMaxDaysInMonth(H);
        return ((H.dayOfMonth = V || H.dayOfMonth), new f(H, y));
        function $(G) {
          var ee = G.split("#");
          if (ee.length > 1) {
            var ie = +ee[ee.length - 1];
            if (/,/.test(G))
              throw new Error("Constraint error, invalid dayOfWeek `#` and `,` special characters are incompatible");
            if (/\//.test(G))
              throw new Error("Constraint error, invalid dayOfWeek `#` and `/` special characters are incompatible");
            if (/-/.test(G))
              throw new Error("Constraint error, invalid dayOfWeek `#` and `-` special characters are incompatible");
            if (ee.length > 2 || Number.isNaN(ie) || ie < 1 || ie > 5)
              throw new Error("Constraint error, invalid dayOfWeek occurrence number (#)");
            return ((y.nthDayOfWeek = ie), ee[0]);
          }
          return G;
        }
      }
      return o(h, l);
    }),
    (f.fieldsToExpression = function (h, l) {
      function g(x, L, A) {
        if (!L) throw new Error("Validation error, Field " + x + " is missing");
        if (L.length === 0) throw new Error("Validation error, Field " + x + " contains no values");
        for (var H = 0, X = L.length; H < X; H++) {
          var V = L[H];
          if (!f._isValidConstraintChar(A, V) && (typeof V != "number" || Number.isNaN(V) || V < A.min || V > A.max))
            throw new Error("Constraint error, got value " + V + " expected range " + A.min + "-" + A.max);
        }
      }
      for (var o = {}, p = 0, y = f.map.length; p < y; ++p) {
        var k = f.map[p],
          S = h[k];
        g(k, S, f.constraints[p]);
        for (var T = [], M = -1; ++M < S.length; ) T[M] = S[M];
        if (
          ((S = T.sort(f._sortCompareFn).filter(function (x, L, A) {
            return !L || x !== A[L - 1];
          })),
          S.length !== T.length)
        )
          throw new Error("Validation error, Field " + k + " contains duplicate values");
        o[k] = S;
      }
      var N = f._handleMaxDaysInMonth(o);
      return ((o.dayOfMonth = N || o.dayOfMonth), new f(o, l || {}));
    }),
    (On = f),
    On
  );
}
var Mn, rs;
function Pa() {
  if (rs) return Mn;
  rs = 1;
  var i = Ra();
  function w() {}
  return (
    (w._parseEntry = function (f) {
      var v = f.split(" ");
      if (v.length === 6) return { interval: i.parse(f) };
      if (v.length > 6) return { interval: i.parse(v.slice(0, 6).join(" ")), command: v.slice(6, v.length) };
      throw new Error("Invalid entry: " + f);
    }),
    (w.parseExpression = function (f, v) {
      return i.parse(f, v);
    }),
    (w.fieldsToExpression = function (f, v) {
      return i.fieldsToExpression(f, v);
    }),
    (w.parseString = function (f) {
      for (
        var v = f.split(`
`),
          h = { variables: {}, expressions: [], errors: {} },
          l = 0,
          g = v.length;
        l < g;
        l++
      ) {
        var o = v[l],
          p = null,
          y = o.trim();
        if (y.length > 0) {
          if (y.match(/^#/)) continue;
          if ((p = y.match(/^(.*)=(.*)$/))) h.variables[p[1]] = p[2];
          else {
            var k = null;
            try {
              ((k = w._parseEntry("0 " + y)), h.expressions.push(k.interval));
            } catch (S) {
              h.errors[y] = S;
            }
          }
        }
      }
      return h;
    }),
    (w.parseFile = function (f, v) {
      pa.readFile(f, function (h, l) {
        if (h) {
          v(h);
          return;
        }
        return v(null, w.parseString(l.toString()));
      });
    }),
    (Mn = w),
    Mn
  );
}
var za = Pa();
const Ha = cs(za);
var Za = Object.defineProperty,
  qa = Object.defineProperties,
  Ya = Object.getOwnPropertyDescriptors,
  ss = Object.getOwnPropertySymbols,
  Ba = Object.prototype.hasOwnProperty,
  Ja = Object.prototype.propertyIsEnumerable,
  is = (i, w, m) => (w in i ? Za(i, w, { enumerable: !0, configurable: !0, writable: !0, value: m }) : (i[w] = m)),
  Ga = (i, w) => {
    for (var m in w || (w = {})) Ba.call(w, m) && is(i, m, w[m]);
    if (ss) for (var m of ss(w)) Ja.call(w, m) && is(i, m, w[m]);
    return i;
  },
  ja = (i, w) => qa(i, Ya(w)),
  Ot = (i, w, m) =>
    new Promise((f, v) => {
      var h = (o) => {
          try {
            g(m.next(o));
          } catch (p) {
            v(p);
          }
        },
        l = (o) => {
          try {
            g(m.throw(o));
          } catch (p) {
            v(p);
          }
        },
        g = (o) => (o.done ? f(o.value) : Promise.resolve(o.value).then(h, l));
      g((m = m.apply(i, w)).next());
    });
function Ka(i) {
  const w = console;
  be.alarms == null;
  const m = [];
  function f(k, S) {
    m.forEach((T) => T(k, S));
  }
  const v = [];
  function h(k, S) {
    v.forEach((T) => T(k, S));
  }
  const l = {};
  function g(k) {
    return Ot(this, null, function* () {
      const S = String(Math.floor(Math.random() * 1e3)).padStart(3, "0");
      w?.log(`[${S}] Executing job:`, k);
      const T = Date.now();
      let M = "success";
      try {
        yield y(k);
        const L = yield k.execute();
        f(k, L);
      } catch (L) {
        ((M = "failure"), h(k, L));
      }
      const N = Date.now(),
        x = N - T;
      w?.log(`[${S}] Job ran in ${Wa(x)}`, {
        startTime: new Date(T),
        endTime: new Date(N),
        durationInMs: x,
        status: M,
        job: k,
      });
    });
  }
  function o(k) {
    let S, T;
    switch (k.type) {
      case "once":
        if (((S = new Date(k.date).getTime()), S < Date.now())) return;
        break;
      case "interval":
        ((S = Date.now()), k.immediate || (S += k.duration), (T = k.duration / 6e4));
        break;
      case "cron":
        const M = Ha.parseExpression(k.expression, ja(Ga({}, k), { currentDate: Date.now(), startDate: Date.now() }));
        if (!M.hasNext()) return;
        S = M.next().getTime();
        break;
    }
    return { name: k.id, scheduledTime: S, periodInMinutes: T };
  }
  function p(k) {
    return Ot(this, null, function* () {
      w?.debug("Scheduling job: ", k);
      const S = o(k);
      if (S == null) {
        delete l[k.id];
        return;
      }
      l[k.id] = k;
      const T = yield be.alarms.get(k.id);
      switch (k.type) {
        case "cron":
        case "once":
          S.scheduledTime !== T?.scheduledTime && be.alarms.create(S.name, { when: S.scheduledTime });
          break;
        case "interval":
          (!T || S.periodInMinutes !== T.periodInMinutes) &&
            be.alarms.create(S.name, {
              delayInMinutes: k.immediate && !T ? 0 : S.periodInMinutes,
              periodInMinutes: S.periodInMinutes,
            });
          break;
      }
    });
  }
  function y(k) {
    return Ot(this, null, function* () {
      switch (k.type) {
        case "once":
        case "interval":
          break;
        case "cron":
          yield p(k);
          break;
      }
    });
  }
  return (
    be.alarms.onAlarm.addListener((k) =>
      Ot(this, null, function* () {
        const S = l[k.name];
        S && (yield g(S));
      }),
    ),
    {
      scheduleJob: p,
      removeJob(k) {
        return Ot(this, null, function* () {
          (delete l[k], yield be.alarms.clear(k));
        });
      },
      on(k, S) {
        const T = k === "success" ? m : v;
        return (
          T.push(S),
          () => {
            const M = T.indexOf(S);
            T.splice(M, 1);
          }
        );
      },
    }
  );
}
var Qa = (i, w, m) =>
  new Promise((f, v) => {
    var h = (o) => {
        try {
          g(m.next(o));
        } catch (p) {
          v(p);
        }
      },
      l = (o) => {
        try {
          g(m.throw(o));
        } catch (p) {
          v(p);
        }
      },
      g = (o) => (o.done ? f(o.value) : Promise.resolve(o.value).then(h, l));
    g((m = m.apply(i, w)).next());
  });
function Nt(i) {
  const w = (h) =>
    Qa(this, null, function* () {
      const l = m.map(({ key: g, cb: o }) => {
        if (!(g in h)) return;
        const { newValue: p, oldValue: y } = h[g];
        if (p !== y) return o(p, y);
      });
      yield Promise.all(l);
    });
  let m = [];
  function f(h) {
    (m.length === 0 && i.onChanged.addListener(w), m.push(h));
  }
  function v(h) {
    const l = m.indexOf(h);
    (l >= 0 && m.splice(l, 1), m.length === 0 && be.storage.onChanged.removeListener(w));
  }
  return {
    clear() {
      return i.clear();
    },
    getItem(h) {
      return i.get(h).then((l) => {
        var g;
        return (g = l[h]) != null ? g : null;
      });
    },
    setItem(h, l) {
      return i.set({ [h]: l ?? null });
    },
    removeItem(h) {
      return i.remove(h);
    },
    onChange(h, l) {
      const g = { key: h, cb: l };
      return (f(g), () => v(g));
    },
  };
}
Nt(be.storage.local);
Nt(be.storage.session);
Nt(be.storage.sync);
Nt(be.storage.managed);
const nt = Nt(chrome.storage.local);
let Mt;
const as = "src/entries/offscreen/offscreen.html";
async function Nn() {
  const i = chrome.runtime.getURL(as);
  (
    await chrome.runtime.getContexts({
      contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
      documentUrls: [i],
    })
  ).length > 0 ||
    (Mt
      ? await Mt
      : ((Mt = chrome.offscreen.createDocument({
          url: as,
          reasons: [chrome.offscreen.Reason.DOM_PARSER],
          justification: "Allow DOM_PARSER, CLIPBOARD, BLOBS in background.",
        })),
        await Mt,
        (Mt = null)));
}
Nn();
var ys = ((i) => ((i.FlushUserInfo = "flushUserInfo"), (i.ReDownloadTorrent = "reDownloadTorrent"), i))(ys || {});
const _n = Ka();
function gs(i = 0) {
  return async () => {
    await Nn();
    const w = await nt.getItem("config"),
      {
        enabled: m = !1,
        interval: f = 1,
        afterTime: v = "00:00",
        retry: { max: h = 0, interval: l = 5 } = {},
      } = w?.userInfo?.autoReflush ?? {};
    if (!m) return;
    const g = new Date(),
      o = qr(g, "yyyy-MM-dd");
    let p = await nt.getItem("metadata");
    if (i === 0) {
      const [S, T] = v.split(":").map((N) => parseInt(N));
      if (g.getHours() < S || (g.getHours() === S && g.getMinutes() < T)) {
        _e("logger", {
          msg: "Auto-refreshing user information paused since current time is before the allowed refresh time.",
        }).catch();
        return;
      }
      p = await nt.getItem("metadata");
      const M = qr(p.lastUserInfoAutoFlushAt, "yyyy-MM-dd");
      if (o === M) {
        const N = p.lastUserInfoAutoFlushAt + f * 60 * 60 * 1e3;
        if (g.getTime() < N) {
          _e("logger", { msg: "Auto-refreshing user information paused since refresh interval not reached." }).catch();
          return;
        }
      }
    }
    _e("logger", { msg: `Auto-refreshing user information at ${o}${i > 0 ? `(Retry #${i})` : ""}` }).catch();
    let y = 0;
    const k = [];
    p = await nt.getItem("metadata");
    for (const [S, T] of Object.entries(p.sites))
      if (!T.isOffline && T.allowQueryUserInfo)
        try {
          typeof ((await _e("getSiteUserInfo", S)) ?? {})[o] > "u" &&
            ((await _e("getSiteUserInfoResult", S)).status !== ka.success && k.push(S), (y += 1));
        } catch {
          k.push(S);
        }
    (_e("logger", {
      msg: `Auto-refreshing user information finished, ${y} sites processed, ${k.length} failed.`,
      data: { failFlushSites: k },
    }).catch(),
      (p = await nt.getItem("metadata")),
      (p.lastUserInfoAutoFlushAt = new Date().getTime()),
      await nt.setItem("metadata", p),
      k.length > 0 &&
        i < h &&
        (_e("logger", {
          msg: `Retrying auto-refresh for ${k.length} failed sites in ${l} minutes (Retry #${i + 1})`,
        }).catch(),
        await _n.scheduleJob({
          id: "flushUserInfo-Retry-" + i,
          type: "once",
          date: +g + l * 60 * 1e3,
          execute: gs(i + 1),
        })));
  };
}
_n.scheduleJob({ id: "flushUserInfo", type: "interval", duration: 1e3 * 60 * 10, immediate: !0, execute: gs() });
function os(i) {
  return async () => {
    (await Nn(), await _e("downloadTorrent", i));
  };
}
da("reDownloadTorrent", async ({ data: i }) => {
  i.leftInterval < 30 * 1e3
    ? (await fa(i.leftInterval),
      os(i)().catch(() => {
        _e("setDownloadHistoryStatus", { downloadId: i.downloadId, status: "failed" }).catch();
      }))
    : _n
        .scheduleJob({
          id: "reDownloadTorrent-" + i.downloadId,
          type: "once",
          date: Date.now() + 1e3 * 30,
          execute: os(i),
        })
        .catch(() => {
          _e("setDownloadHistoryStatus", { downloadId: i.downloadId, status: "failed" }).catch();
        });
});
const Xa = xt(
    {
      allowedValues: Function,
      ampm: Boolean,
      color: String,
      disabled: Boolean,
      displayedValue: null,
      double: Boolean,
      format: { type: Function, default: (i) => i },
      max: { type: Number, required: !0 },
      min: { type: Number, required: !0 },
      scrollable: Boolean,
      readonly: Boolean,
      rotate: { type: Number, default: 0 },
      step: { type: Number, default: 1 },
      modelValue: { type: Number },
    },
    "VTimePickerClock",
  ),
  us = qt()({
    name: "VTimePickerClock",
    props: Xa(),
    emits: { change: (i) => !0, input: (i) => !0 },
    setup(i, w) {
      let { emit: m } = w;
      const f = se(null),
        v = se(null),
        h = se(void 0),
        l = se(!1),
        g = se(null),
        o = se(null),
        p = Ta((b) => m("change", b), 750),
        { textColorClasses: y, textColorStyles: k } = fs(() => i.color),
        { backgroundColorClasses: S, backgroundColorStyles: T } = Sa(() => i.color),
        M = de(() => i.max - i.min + 1),
        N = de(() => (i.double ? M.value / 2 : M.value)),
        x = de(() => 360 / N.value),
        L = de(() => (x.value * Math.PI) / 180),
        A = de(() => (i.modelValue == null ? i.min : i.modelValue)),
        H = de(() => 0.62),
        X = de(() => {
          const b = [];
          for (let P = i.min; P <= i.max; P = P + i.step) b.push(P);
          return b;
        });
      Ue(
        () => i.modelValue,
        (b) => {
          h.value = b;
        },
      );
      function V(b) {
        (h.value !== b && (h.value = b), m("input", b));
      }
      function $(b) {
        return !i.allowedValues || i.allowedValues(b);
      }
      function G(b) {
        if (!i.scrollable || i.disabled) return;
        b.preventDefault();
        const P = Math.sign(-b.deltaY || 1);
        let j = A.value;
        do ((j = j + P), (j = ((j - i.min + M.value) % M.value) + i.min));
        while (!$(j) && j !== A.value);
        (j !== i.displayedValue && V(j), p(j));
      }
      function ee(b) {
        return i.double && b - i.min >= N.value;
      }
      function ie(b) {
        return ee(b) ? H.value : 1;
      }
      function R(b) {
        const P = (i.rotate * Math.PI) / 180;
        return { x: Math.sin((b - i.min) * L.value + P) * ie(b), y: -Math.cos((b - i.min) * L.value + P) * ie(b) };
      }
      function ae(b, P) {
        const j = ((Math.round(b / x.value) + (P ? N.value : 0)) % M.value) + i.min;
        return b < 360 - x.value / 2 ? j : P ? i.max - N.value + 1 : i.min;
      }
      function De(b) {
        const { x: P, y: j } = R(b);
        return { left: `${Math.round(50 + P * 50)}%`, top: `${Math.round(50 + j * 50)}%` };
      }
      function I(b, P) {
        const j = P.x - b.x,
          Ve = P.y - b.y;
        return Math.sqrt(j * j + Ve * Ve);
      }
      function C(b, P) {
        const j = 2 * Math.atan2(P.y - b.y - I(b, P), P.x - b.x);
        return Math.abs((j * 180) / Math.PI);
      }
      function fe(b) {
        (g.value === null && (g.value = b), (o.value = b), V(b));
      }
      function B(b) {
        if ((b.preventDefault(), (!l.value && b.type !== "click") || !f.value)) return;
        const { width: P, top: j, left: Ve } = f.value?.getBoundingClientRect(),
          { width: rt } = v.value?.getBoundingClientRect() ?? { width: 0 },
          { clientX: st, clientY: ve } = "touches" in b ? b.touches[0] : b,
          it = { x: P / 2, y: -P / 2 },
          _t = { x: st - Ve, y: j - ve },
          He = Math.round(C(it, _t) - i.rotate + 360) % 360,
          Ze = i.double && I(it, _t) < (rt + rt * H.value) / 4,
          at = Math.ceil(15 / x.value);
        let Ce;
        for (let Fe = 0; Fe < at; Fe++)
          if (((Ce = ae(He + Fe * x.value, Ze)), $(Ce) || ((Ce = ae(He - Fe * x.value, Ze)), $(Ce)))) return fe(Ce);
      }
      function te(b) {
        i.disabled ||
          (b.preventDefault(),
          window.addEventListener("mousemove", B),
          window.addEventListener("touchmove", B),
          window.addEventListener("mouseup", ye),
          window.addEventListener("touchend", ye),
          (g.value = null),
          (o.value = null),
          (l.value = !0),
          B(b));
      }
      function ye(b) {
        (b.stopPropagation(), ge(), (l.value = !1), o.value !== null && $(o.value) && m("change", o.value));
      }
      function ge() {
        (window.removeEventListener("mousemove", B),
          window.removeEventListener("touchmove", B),
          window.removeEventListener("mouseup", ye),
          window.removeEventListener("touchend", ye));
      }
      (ha(ge),
        Yt(() =>
          ue(
            "div",
            {
              class: ze([
                {
                  "v-time-picker-clock": !0,
                  "v-time-picker-clock--indeterminate": i.modelValue == null,
                  "v-time-picker-clock--readonly": i.readonly,
                },
              ]),
              onMousedown: te,
              onTouchstart: te,
              onWheel: G,
              ref: f,
            },
            [
              ue("div", { class: "v-time-picker-clock__inner", ref: v }, [
                ue(
                  "div",
                  {
                    class: ze([
                      { "v-time-picker-clock__hand": !0, "v-time-picker-clock__hand--inner": ee(i.modelValue) },
                      y.value,
                    ]),
                    style: bn([
                      { transform: `rotate(${i.rotate + x.value * (A.value - i.min)}deg) scaleY(${ie(A.value)})` },
                      k.value,
                    ]),
                  },
                  null,
                ),
                X.value.map((b) => {
                  const P = b === A.value;
                  return ue(
                    "div",
                    {
                      class: ze([
                        {
                          "v-time-picker-clock__item": !0,
                          "v-time-picker-clock__item--active": P,
                          "v-time-picker-clock__item--disabled": i.disabled || !$(b),
                        },
                        P && S.value,
                      ]),
                      style: bn([De(b), P && T.value]),
                    },
                    [ue("span", null, [i.format(b)])],
                  );
                }),
              ]),
            ],
          ),
        ));
    },
  }),
  eo = xt(
    {
      active: Boolean,
      color: String,
      disabled: Boolean,
      label: String,
      modelValue: String,
      error: String,
      showHint: Boolean,
      readonly: Boolean,
    },
    "VTimePickerField",
  ),
  In = qt()({
    name: "VTimePickerField",
    props: eo(),
    emits: { "update:modelValue": (i) => !0 },
    setup(i, w) {
      let { emit: m } = w;
      const { textColorClasses: f, textColorStyles: v } = fs(() => i.color),
        h = se(),
        l = ma(!1);
      function g(o) {
        if (["Backspace", "Delete"].includes(o.key)) {
          o.preventDefault();
          const p = o.target;
          ((p.value = ""), m("update:modelValue", null));
        }
      }
      return (
        Yt(() =>
          Y(
            hs,
            {
              ref: h,
              _as: "VTimePickerField",
              autocomplete: "off",
              class: ze([
                "v-time-picker-controls__time__field",
                { "v-time-picker-controls__time__field--active": i.active },
                i.active ? f.value : [],
              ]),
              style: bn(i.active ? v.value : []),
              disabled: i.disabled,
              variant: "solo-filled",
              inputmode: "numeric",
              hideDetails: "auto",
              "aria-label": i.label,
              "aria-invalid": !!i.error,
              "aria-errormessage": i.error,
              error: !!i.error,
              hint: i.showHint ? i.label : void 0,
              persistentHint: !0,
              flat: !0,
              modelValue: i.modelValue ?? (l.value ? "" : "--"),
              "onUpdate:modelValue": (o) => m("update:modelValue", o),
              onKeydown: g,
              onFocus: () => (l.value = !0),
              onBlur: () => (l.value = !1),
            },
            null,
          ),
        ),
        Oa({}, h)
      );
    },
  });
function Se(i) {
  let w = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
  return String(i).padStart(w, "0");
}
function vs(i) {
  return i ? ((i - 1) % 12) + 1 : 12;
}
function Dt(i, w) {
  return (i % 12) + (w === "pm" ? 12 : 0);
}
function It(i) {
  const w = i.replaceAll(/\D/g, "");
  return w.length > 0 ? Number(w) : null;
}
function to(i, w, m) {
  {
    if (i === 23 && w) return { value: 0 };
    if (i === 0 && !w) return { value: 23 };
  }
  return { value: i + (w ? 1 : -1) };
}
function no(i, w) {
  return i === 59 && w ? 0 : i === 0 && !w ? 59 : i + (w ? 1 : -1);
}
const ws = xt(
  {
    allowedHours: [Function, Array],
    allowedMinutes: [Function, Array],
    allowedSeconds: [Function, Array],
    max: String,
    min: String,
  },
  "time-validation",
);
function ps(i) {
  const w = de(() => {
      const h = i.min ? Number(i.min.split(":")[0]) : 0,
        l = i.max ? Number(i.max.split(":")[0]) : 23;
      return (g) =>
        g < h || g > l
          ? !1
          : Array.isArray(i.allowedHours)
            ? i.allowedHours.includes(g)
            : typeof i.allowedHours == "function"
              ? i.allowedHours(g)
              : !0;
    }),
    m = de(() => {
      const [h, l] = i.min ? i.min.split(":").map(Number) : [0, 0],
        [g, o] = i.max ? i.max.split(":").map(Number) : [23, 59],
        p = h * 60 + l,
        y = g * 60 + o;
      return (k, S) => {
        if (k !== null) {
          const T = 60 * k + S;
          if (T < p || T > y) return !1;
        }
        return Array.isArray(i.allowedMinutes)
          ? i.allowedMinutes.includes(S)
          : typeof i.allowedMinutes == "function"
            ? i.allowedMinutes(S)
            : !0;
      };
    }),
    f = de(() => {
      const [h, l, g] = i.min ? i.min.split(":").map(Number) : [0, 0, 0],
        [o, p, y] = i.max ? i.max.split(":").map(Number) : [23, 59, 59],
        k = h * 3600 + l * 60 + (g || 0),
        S = o * 3600 + p * 60 + (y || 0);
      return (T, M, N) => {
        if (T !== null && M !== null) {
          const x = 3600 * T + 60 * M + N;
          if (x < k || x > S) return !1;
        }
        return Array.isArray(i.allowedSeconds)
          ? i.allowedSeconds.includes(N)
          : typeof i.allowedSeconds == "function"
            ? i.allowedSeconds(N)
            : !0;
      };
    });
  function v(h, l, g) {
    let o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null,
      p = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : null;
    const y = h === "hour" ? w.value : h === "minute" ? (T) => m.value(o, T) : (T) => f.value(o, p, T),
      k = h === "hour" ? (T) => to(T, g).value : (T) => no(T, g),
      S = h === "hour" ? 24 : 60;
    for (let T = 1; T <= S && ((l = k(l)), !y(l)); T++);
    return l;
  }
  return { isAllowedHour: w, isAllowedMinute: m, isAllowedSecond: f, findNextAllowed: v };
}
const ro = xt(
    {
      ampm: Boolean,
      color: String,
      disabled: Boolean,
      inputHints: Boolean,
      hour: [Number, String],
      minute: [Number, String],
      second: [Number, String],
      period: String,
      readonly: Boolean,
      useSeconds: Boolean,
      value: Number,
      viewMode: String,
      ...ws(),
    },
    "VTimePickerControls",
  ),
  ls = qt()({
    name: "VTimePickerControls",
    props: ro(),
    emits: {
      "update:period": (i) => !0,
      "update:viewMode": (i) => !0,
      "update:hour": (i) => !0,
      "update:minute": (i) => !0,
      "update:second": (i) => !0,
    },
    setup(i, w) {
      let { emit: m } = w;
      const { t: f } = ms(),
        { isAllowedHour: v, isAllowedMinute: h, isAllowedSecond: l, findNextAllowed: g } = ps(i),
        o = de(() => (i.hour !== null ? (i.ampm ? Dt(Number(i.hour), i.period ?? "am") : Number(i.hour)) : null)),
        p = de(() => (i.minute !== null ? Number(i.minute) : null)),
        y = de(() => (i.hour === null ? !0 : (v.value?.(Number(o.value)) ?? !0))),
        k = de(() => (i.minute === null ? !0 : (h.value?.(o.value, Number(i.minute)) ?? !0))),
        S = de(() => (i.second === null ? !0 : (l.value?.(o.value, p.value, Number(i.second)) ?? !0))),
        T = {
          in: (I) => {
            if (I == null || isNaN(Number(I))) return null;
            const C = Number(I);
            return i.ampm ? Se(vs(C)) : Se(C);
          },
          out: (I) => {
            if (isNaN(Number(I)) || I == null || I === "") return null;
            const C = typeof I == "string" ? It(I) : Number(I);
            return C === null ? null : i.ampm ? Dt(C, i.period ?? "am") : Yr(C, 0, 23);
          },
        },
        M = bt(i, "hour", void 0, T.in, T.out),
        N = {
          in: (I) => (I != null && !isNaN(Number(I)) ? Se(`${I}`) : null),
          out: (I) => {
            if (isNaN(Number(I)) || I == null || I === "") return null;
            const C = typeof I == "string" ? It(I) : Number(I);
            return C !== null ? Yr(C, 0, 59) : null;
          },
        },
        x = bt(i, "minute", void 0, N.in, N.out),
        L = bt(i, "second", void 0, N.in, N.out);
      function A(I) {
        if (!["ArrowUp", "ArrowDown"].includes(I.key)) return;
        (I.preventDefault(), I.stopPropagation());
        const C = i.period === "am",
          fe = i.ampm ? Dt(Number(M.value ?? 0), C ? "am" : "pm") : Number(M.value ?? 0),
          B = g("hour", fe, I.key === "ArrowUp"),
          te = (C && B >= 12) || (!C && B < 12);
        i.ampm && te
          ? (m("update:period", i.period === "am" ? "pm" : "am"), ga(() => (M.value = Se(B))))
          : (M.value = Se(B));
      }
      function H(I) {
        if (!["ArrowUp", "ArrowDown"].includes(I.key)) return;
        (I.preventDefault(), I.stopPropagation());
        const C = Number(x.value ?? 0),
          fe = g("minute", C, I.key === "ArrowUp", o.value);
        x.value = Se(fe);
      }
      function X(I) {
        if (!["ArrowUp", "ArrowDown"].includes(I.key)) return;
        (I.preventDefault(), I.stopPropagation());
        const C = Number(L.value ?? 0),
          fe = g("second", C, I.key === "ArrowUp", o.value, p.value);
        L.value = Se(fe);
      }
      function V(I, C, fe) {
        return (B) => {
          if (!B.data) return;
          const te = B.target,
            { value: ye, selectionStart: ge, selectionEnd: b } = te ?? {};
          if (It(B.data) === null) {
            B.preventDefault();
            return;
          }
          const P = ye ? ye.slice(0, ge) + B.data + ye.slice(b) : B.data;
          if (P.length > 2) {
            if (ge === b && b === 0 && B.data.trim().startsWith("0")) {
              (B.preventDefault(),
                (te.value = P.trim().substring(0, 2)),
                fe(te.value),
                B.data.trim().length === 1 && te.setSelectionRange(1, 1));
              return;
            }
            if (ge === b && b === 1 && ye.startsWith("0")) {
              (B.preventDefault(), (te.value = P.trim().substring(0, 2)), fe(te.value));
              return;
            }
            const Ve = i.viewMode === "hour" ? (i.ampm ? 12 : 23) : 59;
            if (It(P) > Ve) {
              (B.preventDefault(), (te.value = Se(String(It(B.data)).substring(0, 2))), fe(te.value));
              return;
            }
          }
          const j = I(P);
          C(j) && B.preventDefault();
        };
      }
      function $(I) {
        m("update:period", I);
      }
      const G = se(),
        ee = se(),
        ie = se();
      Ue(
        () => i.viewMode,
        (I, C) => {
          switch (C) {
            case "hour":
              G.value.blur();
              break;
            case "minute":
              ee.value.blur();
              break;
            case "second":
              ie.value.blur();
              break;
          }
        },
      );
      const R = V(
          T.out,
          (I) => T.in(I) === M.value,
          (I) => (M.value = I),
        ),
        ae = V(
          N.out,
          (I) => N.in(I) === x.value,
          (I) => (x.value = I),
        ),
        De = V(
          N.out,
          (I) => N.in(I) === L.value,
          (I) => (L.value = I),
        );
      return (
        Yt(() =>
          ue("div", { class: "v-time-picker-controls" }, [
            ue(
              "div",
              {
                class: ze({
                  "v-time-picker-controls__time": !0,
                  "v-time-picker-controls__time--with-ampm": i.ampm,
                  "v-time-picker-controls__time--with-seconds": i.useSeconds,
                }),
              },
              [
                Y(
                  In,
                  {
                    ref: G,
                    active: i.viewMode === "hour",
                    color: i.color,
                    disabled: i.disabled,
                    label: f("$vuetify.timePicker.hour"),
                    showHint: i.inputHints,
                    error: y.value ? void 0 : f("$vuetify.timePicker.notAllowed"),
                    modelValue: M.value,
                    "onUpdate:modelValue": (I) => (M.value = I),
                    onKeydown: A,
                    onBeforeinput: R,
                    onFocus: () => m("update:viewMode", "hour"),
                  },
                  null,
                ),
                ue("span", { class: "v-time-picker-controls__time__separator" }, [he(":")]),
                Y(
                  In,
                  {
                    ref: ee,
                    active: i.viewMode === "minute",
                    color: i.color,
                    disabled: i.disabled,
                    label: f("$vuetify.timePicker.minute"),
                    showHint: i.inputHints,
                    error: k.value ? void 0 : f("$vuetify.timePicker.notAllowed"),
                    modelValue: x.value,
                    "onUpdate:modelValue": (I) => (x.value = I),
                    onKeydown: H,
                    onBeforeinput: ae,
                    onFocus: () => m("update:viewMode", "minute"),
                  },
                  null,
                ),
                i.useSeconds &&
                  ue("span", { key: "secondsDivider", class: "v-time-picker-controls__time__separator" }, [he(":")]),
                i.useSeconds &&
                  ue(ya, null, [
                    Y(
                      In,
                      {
                        key: "secondsVal",
                        ref: ie,
                        active: i.viewMode === "second",
                        color: i.color,
                        disabled: i.disabled,
                        label: f("$vuetify.timePicker.second"),
                        showHint: i.inputHints,
                        error: S.value ? void 0 : f("$vuetify.timePicker.notAllowed"),
                        modelValue: L.value,
                        "onUpdate:modelValue": (I) => (L.value = I),
                        onKeydown: X,
                        onBeforeinput: De,
                        onFocus: () => m("update:viewMode", "second"),
                      },
                      null,
                    ),
                  ]),
                i.ampm &&
                  ue("div", { class: "v-time-picker-controls__ampm" }, [
                    Y(
                      Dn,
                      {
                        active: i.period === "am",
                        color: i.period === "am" ? i.color : void 0,
                        class: ze({
                          "v-time-picker-controls__ampm__am": !0,
                          "v-time-picker-controls__ampm__btn": !0,
                          "v-time-picker-controls__ampm__btn__active": i.period === "am",
                        }),
                        disabled: i.disabled,
                        text: f("$vuetify.timePicker.am"),
                        variant: i.disabled && i.period === "am" ? "elevated" : "tonal",
                        onClick: () => (i.period !== "am" ? $("am") : null),
                      },
                      null,
                    ),
                    Y(
                      Dn,
                      {
                        active: i.period === "pm",
                        color: i.period === "pm" ? i.color : void 0,
                        class: ze({
                          "v-time-picker-controls__ampm__pm": !0,
                          "v-time-picker-controls__ampm__btn": !0,
                          "v-time-picker-controls__ampm__btn__active": i.period === "pm",
                        }),
                        disabled: i.disabled,
                        text: f("$vuetify.timePicker.pm"),
                        variant: i.disabled && i.period === "pm" ? "elevated" : "tonal",
                        onClick: () => (i.period !== "pm" ? $("pm") : null),
                      },
                      null,
                    ),
                  ]),
              ],
            ),
          ]),
        ),
        {}
      );
    },
  }),
  so = xt(
    {
      disabled: Boolean,
      format: { type: String, default: "ampm" },
      viewMode: { type: String, default: "hour" },
      period: { type: String, default: "am", validator: (i) => ["am", "pm"].includes(i) },
      modelValue: null,
      readonly: Boolean,
      scrollable: Boolean,
      useSeconds: Boolean,
      variant: { type: String, default: "dial" },
      ...ws(),
      ...xn(ba({ title: "$vuetify.timePicker.title" }), ["landscape"]),
      ...Ia(),
    },
    "VTimePicker",
  ),
  io = qt()({
    name: "VTimePicker",
    props: so(),
    emits: {
      "update:hour": (i) => !0,
      "update:minute": (i) => !0,
      "update:period": (i) => !0,
      "update:second": (i) => !0,
      "update:modelValue": (i) => !0,
      "update:viewMode": (i) => !0,
    },
    setup(i, w) {
      let { emit: m, slots: f } = w;
      const { t: v } = ms(),
        { densityClasses: h } = Ma(i),
        l = se(null),
        g = se(null),
        o = se(null),
        p = se(null),
        y = se(null),
        k = se(null),
        S = bt(i, "period", "am"),
        T = bt(i, "viewMode", "hour"),
        M = se(null),
        N = se(null),
        x = de(() => i.format === "ampm"),
        { isAllowedHour: L, isAllowedMinute: A, isAllowedSecond: H } = ps(i),
        X = va(
          () => i.modelValue !== null && l.value === null && g.value === null && (!i.useSeconds || o.value === null),
        );
      function V() {
        const R = $();
        (R !== null && R !== i.modelValue && m("update:modelValue", R), X.value && m("update:modelValue", null));
      }
      (Ue(l, V),
        Ue(g, V),
        Ue(o, V),
        Ue(S, (R, ae) => {
          l.value == null ||
            R === ae ||
            (R === "pm" && l.value < 12
              ? (l.value = l.value + 12)
              : R === "am" && l.value >= 12 && (l.value = l.value - 12));
        }),
        Ue(
          () => i.modelValue,
          (R) => G(R),
        ),
        Ue(
          () => i.useSeconds,
          (R, ae) => {
            (ae && !R && T.value === "second" && (T.value = "minute"), !R && o.value !== null && (o.value = null));
          },
        ),
        ds(() => {
          G(i.modelValue);
        }));
      function $() {
        return l.value != null && g.value != null && (!i.useSeconds || o.value != null)
          ? `${Se(l.value)}:${Se(g.value)}` + (i.useSeconds ? `:${Se(o.value)}` : "")
          : null;
      }
      function G(R) {
        if (R == null || R === "") ((l.value = null), (g.value = null), (o.value = null));
        else if (R instanceof Date) ((l.value = R.getHours()), (g.value = R.getMinutes()), (o.value = R.getSeconds()));
        else {
          const [ae, , De, , I, C] =
            R.trim()
              .toLowerCase()
              .match(/^(\d+):(\d+)(:(\d+))?([ap]m)?$/) || new Array(6);
          ((l.value = C ? Dt(parseInt(ae, 10), C) : parseInt(ae, 10)),
            (g.value = parseInt(De, 10)),
            (o.value = parseInt(I || 0, 10)));
        }
        S.value = l.value == null || l.value < 12 ? "am" : "pm";
      }
      function ee(R) {
        T.value === "hour"
          ? (l.value = x.value ? Dt(R, S.value) : R)
          : T.value === "minute"
            ? (g.value = R)
            : (o.value = R);
      }
      function ie(R) {
        switch (T.value || "hour") {
          case "hour":
            m("update:hour", R);
            break;
          case "minute":
            m("update:minute", R);
            break;
          case "second":
            m("update:second", R);
            break;
        }
        const ae = l.value !== null && g.value !== null && (i.useSeconds ? o.value !== null : !0);
        (T.value === "hour" ? (T.value = "minute") : i.useSeconds && T.value === "minute" && (T.value = "second"),
          !((l.value === p.value && g.value === y.value && (!i.useSeconds || o.value === k.value)) || $() === null) &&
            ((p.value = l.value), (y.value = g.value), i.useSeconds && (k.value = o.value), ae && V()));
      }
      Yt(() => {
        const R = xn(Br.filterProps(i), ["hideHeader"]),
          ae = ls.filterProps(i),
          De = us.filterProps(xn(i, ["format", "modelValue", "min", "max"])),
          I =
            T.value === "hour"
              ? L.value
              : T.value === "minute"
                ? (C) => A.value(l.value, C)
                : (C) => H.value(l.value, g.value, C);
        return Y(
          Br,
          yn(R, {
            color: void 0,
            class: ["v-time-picker", `v-time-picker--variant-${i.variant}`, i.class, h.value],
            hideHeader: i.hideHeader && i.variant !== "input",
            style: i.style,
          }),
          {
            title: () => f.title?.() ?? ue("div", { class: "v-time-picker__title" }, [v(i.title)]),
            header: () =>
              Y(
                ls,
                yn(ae, {
                  ampm: x.value,
                  hour: l.value,
                  minute: g.value,
                  period: S.value,
                  second: o.value,
                  viewMode: T.value,
                  inputHints: i.variant === "input",
                  "onUpdate:hour": (C) => (l.value = C),
                  "onUpdate:minute": (C) => (g.value = C),
                  "onUpdate:second": (C) => (o.value = C),
                  "onUpdate:period": (C) => (S.value = C),
                  "onUpdate:viewMode": (C) => (T.value = C),
                  ref: M,
                }),
                null,
              ),
            default: () =>
              Y(
                us,
                yn(De, {
                  allowedValues: I,
                  double: T.value === "hour" && !x.value,
                  format: T.value === "hour" ? (x.value ? vs : (C) => C) : (C) => Se(C, 2),
                  max: T.value === "hour" ? (x.value && S.value === "am" ? 11 : 23) : 59,
                  min: T.value === "hour" && x.value && S.value === "pm" ? 12 : 0,
                  size: 20,
                  step: T.value === "hour" ? 1 : 5,
                  modelValue: T.value === "hour" ? l.value : T.value === "minute" ? g.value : o.value,
                  onChange: ie,
                  onInput: ee,
                  ref: N,
                }),
                null,
              ),
            actions: f.actions,
          },
        );
      });
    },
  }),
  ao = { class: "d-inline-flex align-center text-no-wrap mb-1" },
  oo = { class: "font-weight-bold" },
  uo = { class: "d-inline-flex align-center text-no-wrap" },
  lo = { class: "d-flex align-center justify-end mt-1" },
  co = { class: "d-inline-flex align-center text-no-wrap" },
  bo = wa({
    __name: "UserInfoWindow",
    setup(i, { expose: w }) {
      const { t: m } = Da(),
        f = xa(),
        v = Na(),
        h = se(0);
      async function l() {
        const o = await chrome.alarms.get(ys.FlushUserInfo);
        o && (h.value = o.scheduledTime);
      }
      async function g() {
        f.userInfo.autoReflush.enabled ? l() : (h.value = 0);
      }
      return (
        w({ afterSave: g }),
        ds(async () => {
          l();
        }),
        (o, p) => (
          vn(),
          gn(wn, null, {
            default: Ne(() => [
              Y(
                _a,
                { md: "10", lg: "8" },
                {
                  default: Ne(() => [
                    Y(Jr, null, { default: Ne(() => [he(oe(D(m)("SetBase.userInfo.userDataRefresh")), 1)]), _: 1 }),
                    Y(
                      Va,
                      {
                        modelValue: D(f).userInfo.queueConcurrency,
                        "onUpdate:modelValue": p[0] || (p[0] = (y) => (D(f).userInfo.queueConcurrency = y)),
                        max: 25,
                        min: 1,
                        label: D(m)("userInfo.queueConcurrency"),
                      },
                      null,
                      8,
                      ["modelValue", "label"],
                    ),
                    Y(
                      Tt,
                      {
                        modelValue: D(f).userInfo.alwaysPickLastUserInfo,
                        "onUpdate:modelValue": p[1] || (p[1] = (y) => (D(f).userInfo.alwaysPickLastUserInfo = y)),
                        label: D(m)("userInfo.alwaysPickLastUserInfo"),
                        color: "success",
                        "hide-details": "",
                      },
                      null,
                      8,
                      ["modelValue", "label"],
                    ),
                    Y(
                      Tt,
                      {
                        modelValue: D(f).userInfo.autoReflush.enabled,
                        "onUpdate:modelValue": p[2] || (p[2] = (y) => (D(f).userInfo.autoReflush.enabled = y)),
                        label: D(m)("userInfo.enableAutoRefresh"),
                        color: "success",
                        "hide-details": "",
                      },
                      null,
                      8,
                      ["modelValue", "label"],
                    ),
                    D(f).userInfo.autoReflush.enabled
                      ? (vn(),
                        gn(
                          wn,
                          { key: 0, class: "mt-1 ml-2 mb-2" },
                          {
                            default: Ne(() => [
                              Y(
                                jr,
                                { type: "info", variant: "outlined" },
                                {
                                  default: Ne(() => [
                                    ue("div", ao, [
                                      he(" • " + oe(D(m)("SetBase.userInfo.afterTime")) + " ", 1),
                                      Y(
                                        hs,
                                        {
                                          "model-value": D(f).userInfo.autoReflush.afterTime,
                                          class: "mx-2",
                                          density: "compact",
                                          "hide-details": "",
                                          readonly: "",
                                        },
                                        {
                                          default: Ne(() => [
                                            Y(
                                              Ea,
                                              { "close-on-content-click": !1, activator: "parent", "min-width": "0" },
                                              {
                                                default: Ne(() => [
                                                  Y(
                                                    io,
                                                    {
                                                      modelValue: D(f).userInfo.autoReflush.afterTime,
                                                      "onUpdate:modelValue":
                                                        p[3] ||
                                                        (p[3] = (y) => (D(f).userInfo.autoReflush.afterTime = y)),
                                                      format: "24hr",
                                                    },
                                                    null,
                                                    8,
                                                    ["modelValue"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["model-value"],
                                      ),
                                      he(" 后，" + oe(D(m)("userInfo.autoRefresh.every")) + " ", 1),
                                      Y(
                                        St,
                                        {
                                          modelValue: D(f).userInfo.autoReflush.interval,
                                          "onUpdate:modelValue":
                                            p[4] || (p[4] = (y) => (D(f).userInfo.autoReflush.interval = y)),
                                          items: D(kt)(1, 24),
                                          max: 23,
                                          min: 1,
                                          class: "mx-2",
                                          density: "compact",
                                          "hide-details": "",
                                        },
                                        null,
                                        8,
                                        ["modelValue", "items"],
                                      ),
                                      he(" " + oe(D(m)("userInfo.autoRefresh.hoursLabel")) + " ", 1),
                                      ue("p", oo, oe(D(m)("userInfo.autoRefresh.unrefreshedSite")), 1),
                                      he(" " + oe(D(m)("userInfo.autoRefresh.ofSites")), 1),
                                    ]),
                                    p[12] || (p[12] = ue("br", null, null, -1)),
                                    ue("div", uo, [
                                      he(" • " + oe(D(m)("userInfo.autoRefresh.retryOnFail")) + " ", 1),
                                      Y(
                                        St,
                                        {
                                          modelValue: D(f).userInfo.autoReflush.retry.max,
                                          "onUpdate:modelValue":
                                            p[5] || (p[5] = (y) => (D(f).userInfo.autoReflush.retry.max = y)),
                                          items: D(kt)(0, 6),
                                          class: "mx-2",
                                          density: "compact",
                                          "hide-details": "",
                                        },
                                        null,
                                        8,
                                        ["modelValue", "items"],
                                      ),
                                      he(" " + oe(D(m)("userInfo.autoRefresh.times")) + " ", 1),
                                      Y(
                                        St,
                                        {
                                          modelValue: D(f).userInfo.autoReflush.retry.interval,
                                          "onUpdate:modelValue":
                                            p[6] || (p[6] = (y) => (D(f).userInfo.autoReflush.retry.interval = y)),
                                          items: D(kt)(1, 11),
                                          class: "mx-2",
                                          density: "compact",
                                          "hide-details": "",
                                        },
                                        null,
                                        8,
                                        ["modelValue", "items"],
                                      ),
                                      he(" " + oe(D(m)("userInfo.autoRefresh.minutes")), 1),
                                    ]),
                                    ue("div", lo, [
                                      he(
                                        oe(D(m)("userInfo.autoRefresh.lastFlushTime")) +
                                          " " +
                                          oe(D(Gr)(D(v).lastUserInfoAutoFlushAt)) +
                                          "   " +
                                          oe(D(m)("userInfo.autoRefresh.nextFlushTime")) +
                                          " " +
                                          oe(h.value != 0 ? D(Gr)(h.value) : "-") +
                                          " ",
                                        1,
                                      ),
                                      Y(
                                        Dn,
                                        {
                                          title: D(m)("userInfo.autoRefresh.getNextFlushTime"),
                                          class: "ml-1",
                                          density: "compact",
                                          icon: "mdi-refresh",
                                          size: "x-small",
                                          variant: "text",
                                          onClick: l,
                                        },
                                        null,
                                        8,
                                        ["title"],
                                      ),
                                    ]),
                                  ]),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          },
                        ))
                      : Zr("", !0),
                    Y(
                      Tt,
                      {
                        modelValue: D(f).autoExtendCookies.enabled,
                        "onUpdate:modelValue": p[7] || (p[7] = (y) => (D(f).autoExtendCookies.enabled = y)),
                        label: D(m)("userInfo.autoExtendCookies.enabled"),
                        color: "success",
                        "hide-details": "",
                      },
                      null,
                      8,
                      ["modelValue", "label"],
                    ),
                    D(f).autoExtendCookies.enabled
                      ? (vn(),
                        gn(
                          wn,
                          { key: 1, class: "mt-1 ml-2 mb-2" },
                          {
                            default: Ne(() => [
                              Y(
                                jr,
                                { type: "info", variant: "outlined" },
                                {
                                  default: Ne(() => [
                                    ue("div", co, [
                                      he(oe(D(m)("userInfo.autoExtendCookies.triggerThreshold")) + ": ", 1),
                                      Y(
                                        St,
                                        {
                                          modelValue: D(f).autoExtendCookies.triggerThreshold,
                                          "onUpdate:modelValue":
                                            p[8] || (p[8] = (y) => (D(f).autoExtendCookies.triggerThreshold = y)),
                                          items: D(kt)(1, 4),
                                          max: 3,
                                          min: 1,
                                          class: "mx-2",
                                          density: "compact",
                                          "hide-details": "",
                                        },
                                        null,
                                        8,
                                        ["modelValue", "items"],
                                      ),
                                      he(
                                        " " +
                                          oe(D(m)("userInfo.autoExtendCookies.weeks")) +
                                          " " +
                                          oe(D(m)("userInfo.autoExtendCookies.extensionDuration")) +
                                          ": ",
                                        1,
                                      ),
                                      Y(
                                        St,
                                        {
                                          modelValue: D(f).autoExtendCookies.extensionDuration,
                                          "onUpdate:modelValue":
                                            p[9] || (p[9] = (y) => (D(f).autoExtendCookies.extensionDuration = y)),
                                          items: D(kt)(1, 13),
                                          max: 12,
                                          min: 1,
                                          class: "mx-2",
                                          density: "compact",
                                          "hide-details": "",
                                        },
                                        null,
                                        8,
                                        ["modelValue", "items"],
                                      ),
                                      he(" " + oe(D(m)("userInfo.autoExtendCookies.months")), 1),
                                    ]),
                                  ]),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          },
                        ))
                      : Zr("", !0),
                    Y(Jr, null, { default: Ne(() => [he(oe(D(m)("SetBase.userInfo.userInfoDisplay")), 1)]), _: 1 }),
                    Y(
                      Tt,
                      {
                        modelValue: D(f).userInfo.showDeadSiteInOverview,
                        "onUpdate:modelValue": p[10] || (p[10] = (y) => (D(f).userInfo.showDeadSiteInOverview = y)),
                        label: D(m)("userInfo.showDeadSite"),
                        color: "success",
                        "hide-details": "",
                      },
                      null,
                      8,
                      ["modelValue", "label"],
                    ),
                    Y(
                      Tt,
                      {
                        modelValue: D(f).userInfo.showPassedSiteInOverview,
                        "onUpdate:modelValue": p[11] || (p[11] = (y) => (D(f).userInfo.showPassedSiteInOverview = y)),
                        label: D(m)("userInfo.showPassedSite"),
                        color: "success",
                        "hide-details": "",
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
          })
        )
      );
    },
  });
export { bo as default };
