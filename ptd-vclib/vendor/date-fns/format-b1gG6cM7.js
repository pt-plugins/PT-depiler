const _t = 7,
  Lt = 365.2425,
  jt = 6048e5,
  Gt = 864e5,
  Bt = 6e4,
  At = 36e5,
  Rt = 1e3,
  Vt = 525600,
  Jt = 43200,
  $t = 1440,
  zt = 60,
  Ut = 3,
  Kt = 12,
  Zt = 4,
  te = 3600,
  ee = 60,
  ne = 86400,
  ae = 604800,
  re = 31556952,
  oe = 2629746,
  se = 7889238,
  W = Symbol.for("constructDateFrom");
function g(t, e) {
  return typeof t == "function"
    ? t(e)
    : t && typeof t == "object" && W in t
      ? t[W](e)
      : t instanceof Date
        ? new t.constructor(e)
        : new Date(e);
}
function h(t, e) {
  return g(e || t, t);
}
let E = {};
function O() {
  return E;
}
function ie(t) {
  E = t;
}
function p(t, e) {
  const n = O(),
    a = e?.weekStartsOn ?? e?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0,
    r = h(t, e?.in),
    o = r.getDay(),
    s = (o < a ? 7 : 0) + o - a;
  return (r.setDate(r.getDate() - s), r.setHours(0, 0, 0, 0), r);
}
function P(t, e) {
  return p(t, { ...e, weekStartsOn: 1 });
}
function I(t, e) {
  const n = h(t, e?.in),
    a = n.getFullYear(),
    r = g(n, 0);
  (r.setFullYear(a + 1, 0, 4), r.setHours(0, 0, 0, 0));
  const o = P(r),
    s = g(n, 0);
  (s.setFullYear(a, 0, 4), s.setHours(0, 0, 0, 0));
  const c = P(s);
  return n.getTime() >= o.getTime() ? a + 1 : n.getTime() >= c.getTime() ? a : a - 1;
}
function x(t) {
  const e = h(t),
    n = new Date(
      Date.UTC(
        e.getFullYear(),
        e.getMonth(),
        e.getDate(),
        e.getHours(),
        e.getMinutes(),
        e.getSeconds(),
        e.getMilliseconds(),
      ),
    );
  return (n.setUTCFullYear(e.getFullYear()), +t - +n);
}
function N(t, ...e) {
  const n = g.bind(null, t || e.find((a) => typeof a == "object"));
  return e.map(n);
}
function v(t, e) {
  const n = h(t, e?.in);
  return (n.setHours(0, 0, 0, 0), n);
}
function H(t, e, n) {
  const [a, r] = N(n?.in, t, e),
    o = v(a),
    s = v(r),
    c = +o - x(o),
    f = +s - x(s);
  return Math.round((c - f) / 864e5);
}
function Q(t, e) {
  const n = I(t, e),
    a = g(e?.in || t, 0);
  return (a.setFullYear(n, 0, 4), a.setHours(0, 0, 0, 0), P(a));
}
function X(t) {
  return t instanceof Date || (typeof t == "object" && Object.prototype.toString.call(t) === "[object Date]");
}
function _(t) {
  return !((!X(t) && typeof t != "number") || isNaN(+h(t)));
}
function L(t, e) {
  const n = h(t, e?.in);
  return (n.setFullYear(n.getFullYear(), 0, 1), n.setHours(0, 0, 0, 0), n);
}
const j = {
    lessThanXSeconds: { one: "less than a second", other: "less than {{count}} seconds" },
    xSeconds: { one: "1 second", other: "{{count}} seconds" },
    halfAMinute: "half a minute",
    lessThanXMinutes: { one: "less than a minute", other: "less than {{count}} minutes" },
    xMinutes: { one: "1 minute", other: "{{count}} minutes" },
    aboutXHours: { one: "about 1 hour", other: "about {{count}} hours" },
    xHours: { one: "1 hour", other: "{{count}} hours" },
    xDays: { one: "1 day", other: "{{count}} days" },
    aboutXWeeks: { one: "about 1 week", other: "about {{count}} weeks" },
    xWeeks: { one: "1 week", other: "{{count}} weeks" },
    aboutXMonths: { one: "about 1 month", other: "about {{count}} months" },
    xMonths: { one: "1 month", other: "{{count}} months" },
    aboutXYears: { one: "about 1 year", other: "about {{count}} years" },
    xYears: { one: "1 year", other: "{{count}} years" },
    overXYears: { one: "over 1 year", other: "over {{count}} years" },
    almostXYears: { one: "almost 1 year", other: "almost {{count}} years" },
  },
  G = (t, e, n) => {
    let a;
    const r = j[t];
    return (
      typeof r == "string" ? (a = r) : e === 1 ? (a = r.one) : (a = r.other.replace("{{count}}", e.toString())),
      n?.addSuffix ? (n.comparison && n.comparison > 0 ? "in " + a : a + " ago") : a
    );
  };
function D(t) {
  return (e = {}) => {
    const n = e.width ? String(e.width) : t.defaultWidth;
    return t.formats[n] || t.formats[t.defaultWidth];
  };
}
const B = { full: "EEEE, MMMM do, y", long: "MMMM do, y", medium: "MMM d, y", short: "MM/dd/yyyy" },
  A = { full: "h:mm:ss a zzzz", long: "h:mm:ss a z", medium: "h:mm:ss a", short: "h:mm a" },
  R = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}",
  },
  V = {
    date: D({ formats: B, defaultWidth: "full" }),
    time: D({ formats: A, defaultWidth: "full" }),
    dateTime: D({ formats: R, defaultWidth: "full" }),
  },
  J = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P",
  },
  $ = (t, e, n, a) => J[t];
function b(t) {
  return (e, n) => {
    const a = n?.context ? String(n.context) : "standalone";
    let r;
    if (a === "formatting" && t.formattingValues) {
      const s = t.defaultFormattingWidth || t.defaultWidth,
        c = n?.width ? String(n.width) : s;
      r = t.formattingValues[c] || t.formattingValues[s];
    } else {
      const s = t.defaultWidth,
        c = n?.width ? String(n.width) : t.defaultWidth;
      r = t.values[c] || t.values[s];
    }
    const o = t.argumentCallback ? t.argumentCallback(e) : e;
    return r[o];
  };
}
const z = { narrow: ["B", "A"], abbreviated: ["BC", "AD"], wide: ["Before Christ", "Anno Domini"] },
  U = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
  },
  K = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    wide: [
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
  },
  Z = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  tt = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
  },
  et = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
  },
  nt = (t, e) => {
    const n = Number(t),
      a = n % 100;
    if (a > 20 || a < 10)
      switch (a % 10) {
        case 1:
          return n + "st";
        case 2:
          return n + "nd";
        case 3:
          return n + "rd";
      }
    return n + "th";
  },
  at = {
    ordinalNumber: nt,
    era: b({ values: z, defaultWidth: "wide" }),
    quarter: b({ values: U, defaultWidth: "wide", argumentCallback: (t) => t - 1 }),
    month: b({ values: K, defaultWidth: "wide" }),
    day: b({ values: Z, defaultWidth: "wide" }),
    dayPeriod: b({ values: tt, defaultWidth: "wide", formattingValues: et, defaultFormattingWidth: "wide" }),
  };
function M(t) {
  return (e, n = {}) => {
    const a = n.width,
      r = (a && t.matchPatterns[a]) || t.matchPatterns[t.defaultMatchWidth],
      o = e.match(r);
    if (!o) return null;
    const s = o[0],
      c = (a && t.parsePatterns[a]) || t.parsePatterns[t.defaultParseWidth],
      f = Array.isArray(c) ? ot(c, (u) => u.test(s)) : rt(c, (u) => u.test(s));
    let m;
    ((m = t.valueCallback ? t.valueCallback(f) : f), (m = n.valueCallback ? n.valueCallback(m) : m));
    const d = e.slice(s.length);
    return { value: m, rest: d };
  };
}
function rt(t, e) {
  for (const n in t) if (Object.prototype.hasOwnProperty.call(t, n) && e(t[n])) return n;
}
function ot(t, e) {
  for (let n = 0; n < t.length; n++) if (e(t[n])) return n;
}
function st(t) {
  return (e, n = {}) => {
    const a = e.match(t.matchPattern);
    if (!a) return null;
    const r = a[0],
      o = e.match(t.parsePattern);
    if (!o) return null;
    let s = t.valueCallback ? t.valueCallback(o[0]) : o[0];
    s = n.valueCallback ? n.valueCallback(s) : s;
    const c = e.slice(r.length);
    return { value: s, rest: c };
  };
}
const it = /^(\d+)(th|st|nd|rd)?/i,
  ct = /\d+/i,
  ut = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i,
  },
  dt = { any: [/^b/i, /^(a|c)/i] },
  ft = { narrow: /^[1234]/i, abbreviated: /^q[1234]/i, wide: /^[1234](th|st|nd|rd)? quarter/i },
  ht = { any: [/1/i, /2/i, /3/i, /4/i] },
  mt = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
  },
  lt = {
    narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
    any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i],
  },
  gt = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
  },
  wt = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
  },
  yt = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
  },
  bt = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i,
    },
  },
  Mt = {
    ordinalNumber: st({ matchPattern: it, parsePattern: ct, valueCallback: (t) => parseInt(t, 10) }),
    era: M({ matchPatterns: ut, defaultMatchWidth: "wide", parsePatterns: dt, defaultParseWidth: "any" }),
    quarter: M({
      matchPatterns: ft,
      defaultMatchWidth: "wide",
      parsePatterns: ht,
      defaultParseWidth: "any",
      valueCallback: (t) => t + 1,
    }),
    month: M({ matchPatterns: mt, defaultMatchWidth: "wide", parsePatterns: lt, defaultParseWidth: "any" }),
    day: M({ matchPatterns: gt, defaultMatchWidth: "wide", parsePatterns: wt, defaultParseWidth: "any" }),
    dayPeriod: M({ matchPatterns: yt, defaultMatchWidth: "any", parsePatterns: bt, defaultParseWidth: "any" }),
  },
  pt = {
    code: "en-US",
    formatDistance: G,
    formatLong: V,
    formatRelative: $,
    localize: at,
    match: Mt,
    options: { weekStartsOn: 0, firstWeekContainsDate: 1 },
  };
function Pt(t, e) {
  const n = h(t, e?.in);
  return H(n, L(n)) + 1;
}
function Ot(t, e) {
  const n = h(t, e?.in),
    a = +P(n) - +Q(n);
  return Math.round(a / 6048e5) + 1;
}
function C(t, e) {
  const n = h(t, e?.in),
    a = n.getFullYear(),
    r = O(),
    o =
      e?.firstWeekContainsDate ??
      e?.locale?.options?.firstWeekContainsDate ??
      r.firstWeekContainsDate ??
      r.locale?.options?.firstWeekContainsDate ??
      1,
    s = g(e?.in || t, 0);
  (s.setFullYear(a + 1, 0, o), s.setHours(0, 0, 0, 0));
  const c = p(s, e),
    f = g(e?.in || t, 0);
  (f.setFullYear(a, 0, o), f.setHours(0, 0, 0, 0));
  const m = p(f, e);
  return +n >= +c ? a + 1 : +n >= +m ? a : a - 1;
}
function kt(t, e) {
  const n = O(),
    a =
      e?.firstWeekContainsDate ??
      e?.locale?.options?.firstWeekContainsDate ??
      n.firstWeekContainsDate ??
      n.locale?.options?.firstWeekContainsDate ??
      1,
    r = C(t, e),
    o = g(e?.in || t, 0);
  return (o.setFullYear(r, 0, a), o.setHours(0, 0, 0, 0), p(o, e));
}
function Dt(t, e) {
  const n = h(t, e?.in),
    a = +p(n, e) - +kt(n, e);
  return Math.round(a / 6048e5) + 1;
}
function i(t, e) {
  const n = t < 0 ? "-" : "",
    a = Math.abs(t).toString().padStart(e, "0");
  return n + a;
}
const l = {
    y(t, e) {
      const n = t.getFullYear(),
        a = n > 0 ? n : 1 - n;
      return i(e === "yy" ? a % 100 : a, e.length);
    },
    M(t, e) {
      const n = t.getMonth();
      return e === "M" ? String(n + 1) : i(n + 1, 2);
    },
    d(t, e) {
      return i(t.getDate(), e.length);
    },
    a(t, e) {
      const n = t.getHours() / 12 >= 1 ? "pm" : "am";
      switch (e) {
        case "a":
        case "aa":
          return n.toUpperCase();
        case "aaa":
          return n;
        case "aaaaa":
          return n[0];
        case "aaaa":
        default:
          return n === "am" ? "a.m." : "p.m.";
      }
    },
    h(t, e) {
      return i(t.getHours() % 12 || 12, e.length);
    },
    H(t, e) {
      return i(t.getHours(), e.length);
    },
    m(t, e) {
      return i(t.getMinutes(), e.length);
    },
    s(t, e) {
      return i(t.getSeconds(), e.length);
    },
    S(t, e) {
      const n = e.length,
        a = t.getMilliseconds(),
        r = Math.trunc(a * Math.pow(10, n - 3));
      return i(r, e.length);
    },
  },
  y = {
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  Y = {
    G: function (t, e, n) {
      const a = t.getFullYear() > 0 ? 1 : 0;
      switch (e) {
        case "G":
        case "GG":
        case "GGG":
          return n.era(a, { width: "abbreviated" });
        case "GGGGG":
          return n.era(a, { width: "narrow" });
        case "GGGG":
        default:
          return n.era(a, { width: "wide" });
      }
    },
    y: function (t, e, n) {
      if (e === "yo") {
        const a = t.getFullYear(),
          r = a > 0 ? a : 1 - a;
        return n.ordinalNumber(r, { unit: "year" });
      }
      return l.y(t, e);
    },
    Y: function (t, e, n, a) {
      const r = C(t, a),
        o = r > 0 ? r : 1 - r;
      if (e === "YY") {
        const s = o % 100;
        return i(s, 2);
      }
      return e === "Yo" ? n.ordinalNumber(o, { unit: "year" }) : i(o, e.length);
    },
    R: function (t, e) {
      const n = I(t);
      return i(n, e.length);
    },
    u: function (t, e) {
      const n = t.getFullYear();
      return i(n, e.length);
    },
    Q: function (t, e, n) {
      const a = Math.ceil((t.getMonth() + 1) / 3);
      switch (e) {
        case "Q":
          return String(a);
        case "QQ":
          return i(a, 2);
        case "Qo":
          return n.ordinalNumber(a, { unit: "quarter" });
        case "QQQ":
          return n.quarter(a, { width: "abbreviated", context: "formatting" });
        case "QQQQQ":
          return n.quarter(a, { width: "narrow", context: "formatting" });
        case "QQQQ":
        default:
          return n.quarter(a, { width: "wide", context: "formatting" });
      }
    },
    q: function (t, e, n) {
      const a = Math.ceil((t.getMonth() + 1) / 3);
      switch (e) {
        case "q":
          return String(a);
        case "qq":
          return i(a, 2);
        case "qo":
          return n.ordinalNumber(a, { unit: "quarter" });
        case "qqq":
          return n.quarter(a, { width: "abbreviated", context: "standalone" });
        case "qqqqq":
          return n.quarter(a, { width: "narrow", context: "standalone" });
        case "qqqq":
        default:
          return n.quarter(a, { width: "wide", context: "standalone" });
      }
    },
    M: function (t, e, n) {
      const a = t.getMonth();
      switch (e) {
        case "M":
        case "MM":
          return l.M(t, e);
        case "Mo":
          return n.ordinalNumber(a + 1, { unit: "month" });
        case "MMM":
          return n.month(a, { width: "abbreviated", context: "formatting" });
        case "MMMMM":
          return n.month(a, { width: "narrow", context: "formatting" });
        case "MMMM":
        default:
          return n.month(a, { width: "wide", context: "formatting" });
      }
    },
    L: function (t, e, n) {
      const a = t.getMonth();
      switch (e) {
        case "L":
          return String(a + 1);
        case "LL":
          return i(a + 1, 2);
        case "Lo":
          return n.ordinalNumber(a + 1, { unit: "month" });
        case "LLL":
          return n.month(a, { width: "abbreviated", context: "standalone" });
        case "LLLLL":
          return n.month(a, { width: "narrow", context: "standalone" });
        case "LLLL":
        default:
          return n.month(a, { width: "wide", context: "standalone" });
      }
    },
    w: function (t, e, n, a) {
      const r = Dt(t, a);
      return e === "wo" ? n.ordinalNumber(r, { unit: "week" }) : i(r, e.length);
    },
    I: function (t, e, n) {
      const a = Ot(t);
      return e === "Io" ? n.ordinalNumber(a, { unit: "week" }) : i(a, e.length);
    },
    d: function (t, e, n) {
      return e === "do" ? n.ordinalNumber(t.getDate(), { unit: "date" }) : l.d(t, e);
    },
    D: function (t, e, n) {
      const a = Pt(t);
      return e === "Do" ? n.ordinalNumber(a, { unit: "dayOfYear" }) : i(a, e.length);
    },
    E: function (t, e, n) {
      const a = t.getDay();
      switch (e) {
        case "E":
        case "EE":
        case "EEE":
          return n.day(a, { width: "abbreviated", context: "formatting" });
        case "EEEEE":
          return n.day(a, { width: "narrow", context: "formatting" });
        case "EEEEEE":
          return n.day(a, { width: "short", context: "formatting" });
        case "EEEE":
        default:
          return n.day(a, { width: "wide", context: "formatting" });
      }
    },
    e: function (t, e, n, a) {
      const r = t.getDay(),
        o = (r - a.weekStartsOn + 8) % 7 || 7;
      switch (e) {
        case "e":
          return String(o);
        case "ee":
          return i(o, 2);
        case "eo":
          return n.ordinalNumber(o, { unit: "day" });
        case "eee":
          return n.day(r, { width: "abbreviated", context: "formatting" });
        case "eeeee":
          return n.day(r, { width: "narrow", context: "formatting" });
        case "eeeeee":
          return n.day(r, { width: "short", context: "formatting" });
        case "eeee":
        default:
          return n.day(r, { width: "wide", context: "formatting" });
      }
    },
    c: function (t, e, n, a) {
      const r = t.getDay(),
        o = (r - a.weekStartsOn + 8) % 7 || 7;
      switch (e) {
        case "c":
          return String(o);
        case "cc":
          return i(o, e.length);
        case "co":
          return n.ordinalNumber(o, { unit: "day" });
        case "ccc":
          return n.day(r, { width: "abbreviated", context: "standalone" });
        case "ccccc":
          return n.day(r, { width: "narrow", context: "standalone" });
        case "cccccc":
          return n.day(r, { width: "short", context: "standalone" });
        case "cccc":
        default:
          return n.day(r, { width: "wide", context: "standalone" });
      }
    },
    i: function (t, e, n) {
      const a = t.getDay(),
        r = a === 0 ? 7 : a;
      switch (e) {
        case "i":
          return String(r);
        case "ii":
          return i(r, e.length);
        case "io":
          return n.ordinalNumber(r, { unit: "day" });
        case "iii":
          return n.day(a, { width: "abbreviated", context: "formatting" });
        case "iiiii":
          return n.day(a, { width: "narrow", context: "formatting" });
        case "iiiiii":
          return n.day(a, { width: "short", context: "formatting" });
        case "iiii":
        default:
          return n.day(a, { width: "wide", context: "formatting" });
      }
    },
    a: function (t, e, n) {
      const r = t.getHours() / 12 >= 1 ? "pm" : "am";
      switch (e) {
        case "a":
        case "aa":
          return n.dayPeriod(r, { width: "abbreviated", context: "formatting" });
        case "aaa":
          return n.dayPeriod(r, { width: "abbreviated", context: "formatting" }).toLowerCase();
        case "aaaaa":
          return n.dayPeriod(r, { width: "narrow", context: "formatting" });
        case "aaaa":
        default:
          return n.dayPeriod(r, { width: "wide", context: "formatting" });
      }
    },
    b: function (t, e, n) {
      const a = t.getHours();
      let r;
      switch ((a === 12 ? (r = y.noon) : a === 0 ? (r = y.midnight) : (r = a / 12 >= 1 ? "pm" : "am"), e)) {
        case "b":
        case "bb":
          return n.dayPeriod(r, { width: "abbreviated", context: "formatting" });
        case "bbb":
          return n.dayPeriod(r, { width: "abbreviated", context: "formatting" }).toLowerCase();
        case "bbbbb":
          return n.dayPeriod(r, { width: "narrow", context: "formatting" });
        case "bbbb":
        default:
          return n.dayPeriod(r, { width: "wide", context: "formatting" });
      }
    },
    B: function (t, e, n) {
      const a = t.getHours();
      let r;
      switch ((a >= 17 ? (r = y.evening) : a >= 12 ? (r = y.afternoon) : a >= 4 ? (r = y.morning) : (r = y.night), e)) {
        case "B":
        case "BB":
        case "BBB":
          return n.dayPeriod(r, { width: "abbreviated", context: "formatting" });
        case "BBBBB":
          return n.dayPeriod(r, { width: "narrow", context: "formatting" });
        case "BBBB":
        default:
          return n.dayPeriod(r, { width: "wide", context: "formatting" });
      }
    },
    h: function (t, e, n) {
      if (e === "ho") {
        let a = t.getHours() % 12;
        return (a === 0 && (a = 12), n.ordinalNumber(a, { unit: "hour" }));
      }
      return l.h(t, e);
    },
    H: function (t, e, n) {
      return e === "Ho" ? n.ordinalNumber(t.getHours(), { unit: "hour" }) : l.H(t, e);
    },
    K: function (t, e, n) {
      const a = t.getHours() % 12;
      return e === "Ko" ? n.ordinalNumber(a, { unit: "hour" }) : i(a, e.length);
    },
    k: function (t, e, n) {
      let a = t.getHours();
      return (a === 0 && (a = 24), e === "ko" ? n.ordinalNumber(a, { unit: "hour" }) : i(a, e.length));
    },
    m: function (t, e, n) {
      return e === "mo" ? n.ordinalNumber(t.getMinutes(), { unit: "minute" }) : l.m(t, e);
    },
    s: function (t, e, n) {
      return e === "so" ? n.ordinalNumber(t.getSeconds(), { unit: "second" }) : l.s(t, e);
    },
    S: function (t, e) {
      return l.S(t, e);
    },
    X: function (t, e, n) {
      const a = t.getTimezoneOffset();
      if (a === 0) return "Z";
      switch (e) {
        case "X":
          return T(a);
        case "XXXX":
        case "XX":
          return w(a);
        case "XXXXX":
        case "XXX":
        default:
          return w(a, ":");
      }
    },
    x: function (t, e, n) {
      const a = t.getTimezoneOffset();
      switch (e) {
        case "x":
          return T(a);
        case "xxxx":
        case "xx":
          return w(a);
        case "xxxxx":
        case "xxx":
        default:
          return w(a, ":");
      }
    },
    O: function (t, e, n) {
      const a = t.getTimezoneOffset();
      switch (e) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + S(a, ":");
        case "OOOO":
        default:
          return "GMT" + w(a, ":");
      }
    },
    z: function (t, e, n) {
      const a = t.getTimezoneOffset();
      switch (e) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + S(a, ":");
        case "zzzz":
        default:
          return "GMT" + w(a, ":");
      }
    },
    t: function (t, e, n) {
      const a = Math.trunc(+t / 1e3);
      return i(a, e.length);
    },
    T: function (t, e, n) {
      return i(+t, e.length);
    },
  };
function S(t, e = "") {
  const n = t > 0 ? "-" : "+",
    a = Math.abs(t),
    r = Math.trunc(a / 60),
    o = a % 60;
  return o === 0 ? n + String(r) : n + String(r) + e + i(o, 2);
}
function T(t, e) {
  return t % 60 === 0 ? (t > 0 ? "-" : "+") + i(Math.abs(t) / 60, 2) : w(t, e);
}
function w(t, e = "") {
  const n = t > 0 ? "-" : "+",
    a = Math.abs(t),
    r = i(Math.trunc(a / 60), 2),
    o = i(a % 60, 2);
  return n + r + e + o;
}
const F = (t, e) => {
    switch (t) {
      case "P":
        return e.date({ width: "short" });
      case "PP":
        return e.date({ width: "medium" });
      case "PPP":
        return e.date({ width: "long" });
      case "PPPP":
      default:
        return e.date({ width: "full" });
    }
  },
  q = (t, e) => {
    switch (t) {
      case "p":
        return e.time({ width: "short" });
      case "pp":
        return e.time({ width: "medium" });
      case "ppp":
        return e.time({ width: "long" });
      case "pppp":
      default:
        return e.time({ width: "full" });
    }
  },
  Wt = (t, e) => {
    const n = t.match(/(P+)(p+)?/) || [],
      a = n[1],
      r = n[2];
    if (!r) return F(t, e);
    let o;
    switch (a) {
      case "P":
        o = e.dateTime({ width: "short" });
        break;
      case "PP":
        o = e.dateTime({ width: "medium" });
        break;
      case "PPP":
        o = e.dateTime({ width: "long" });
        break;
      case "PPPP":
      default:
        o = e.dateTime({ width: "full" });
        break;
    }
    return o.replace("{{date}}", F(a, e)).replace("{{time}}", q(r, e));
  },
  xt = { p: q, P: Wt },
  vt = /^D+$/,
  Yt = /^Y+$/,
  St = ["D", "DD", "YY", "YYYY"];
function Tt(t) {
  return vt.test(t);
}
function Ft(t) {
  return Yt.test(t);
}
function Et(t, e, n) {
  const a = It(t, e, n);
  if ((console.warn(a), St.includes(t))) throw new RangeError(a);
}
function It(t, e, n) {
  const a = t[0] === "Y" ? "years" : "days of the month";
  return `Use \`${t.toLowerCase()}\` instead of \`${t}\` (in \`${e}\`) for formatting ${a} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Ct = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
  qt = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
  Nt = /^'([^]*?)'?$/,
  Ht = /''/g,
  Qt = /[a-zA-Z]/;
function ce(t, e, n) {
  const a = O(),
    r = n?.locale ?? a.locale ?? pt,
    o =
      n?.firstWeekContainsDate ??
      n?.locale?.options?.firstWeekContainsDate ??
      a.firstWeekContainsDate ??
      a.locale?.options?.firstWeekContainsDate ??
      1,
    s = n?.weekStartsOn ?? n?.locale?.options?.weekStartsOn ?? a.weekStartsOn ?? a.locale?.options?.weekStartsOn ?? 0,
    c = h(t, n?.in);
  if (!_(c)) throw new RangeError("Invalid time value");
  let f = e
    .match(qt)
    .map((d) => {
      const u = d[0];
      if (u === "p" || u === "P") {
        const k = xt[u];
        return k(d, r.formatLong);
      }
      return d;
    })
    .join("")
    .match(Ct)
    .map((d) => {
      if (d === "''") return { isToken: !1, value: "'" };
      const u = d[0];
      if (u === "'") return { isToken: !1, value: Xt(d) };
      if (Y[u]) return { isToken: !0, value: d };
      if (u.match(Qt)) throw new RangeError("Format string contains an unescaped latin alphabet character `" + u + "`");
      return { isToken: !1, value: d };
    });
  r.localize.preprocessor && (f = r.localize.preprocessor(c, f));
  const m = { firstWeekContainsDate: o, weekStartsOn: s, locale: r };
  return f
    .map((d) => {
      if (!d.isToken) return d.value;
      const u = d.value;
      ((!n?.useAdditionalWeekYearTokens && Ft(u)) || (!n?.useAdditionalDayOfYearTokens && Tt(u))) &&
        Et(u, e, String(t));
      const k = Y[u[0]];
      return k(c, u, r.localize, m);
    })
    .join("");
}
function Xt(t) {
  const e = t.match(Nt);
  return e ? e[1].replace(Ht, "'") : t;
}
export {
  $t as A,
  zt as B,
  Jt as C,
  Vt as D,
  Ut as E,
  Kt as F,
  N as G,
  Zt as H,
  ne as I,
  te as J,
  ee as K,
  oe as L,
  se as M,
  ae as N,
  re as O,
  ie as P,
  v as Q,
  P as R,
  Q as S,
  p as T,
  kt as U,
  L as V,
  h as W,
  Et as X,
  i as a,
  Lt as b,
  g as c,
  _t as d,
  H as e,
  pt as f,
  ce as g,
  Y as h,
  Pt as i,
  O as j,
  Ot as k,
  I as l,
  x as m,
  Dt as n,
  C as o,
  X as p,
  Tt as q,
  Ft as r,
  _ as s,
  l as t,
  xt as u,
  Gt as v,
  At as w,
  Bt as x,
  Rt as y,
  jt as z,
};
