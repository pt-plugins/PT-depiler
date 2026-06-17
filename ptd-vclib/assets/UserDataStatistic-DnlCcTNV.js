import { F as s1 } from "../vendor/file-saver/FileSaver.min-BKZqLcYj.js";
import {
  bV as l1,
  bN as u1,
  bz as f1,
  f as h1,
  b$ as c1,
  c0 as v1,
  T as yr,
  n as se,
  a2 as d1,
  A as to,
  o as p1,
  x as g1,
  e as m1,
  c as zl,
  H as y1,
  a8 as _1,
  a9 as S1,
  c2 as b1,
  a7 as w1,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  c as Hl,
  X as Em,
  as as Jo,
  bZ as T1,
  ch as ts,
  cj as Rm,
  bf as Wh,
  bb as x1,
  ao as _f,
  bJ as Da,
  D as $t,
  b2 as C1,
  bi as D1,
  bh as A1,
  bI as Vl,
  T as M1,
  b_ as es,
  bC as I1,
  c8 as L1,
  I as Yr,
  ck as lt,
  br as Gl,
  ce as P1,
  bj as ve,
  U as rt,
  c4 as it,
  b5 as eo,
  J as ro,
  L as Fi,
  F as zi,
  bu as no,
  Q as Xr,
  bS as $r,
  b3 as E1,
  c3 as R1,
  N as O1,
  bl as _v,
  bo as k1,
} from "../vendor/packages/site/index-COeZNva1.js";
import { f as B1 } from "../vendor/es-toolkit/flatten-CRv0zNMl.js";
import { e as Sf, m as Sv } from "../vendor/date-fns/eachDayOfInterval-C54jljtB.js";
import { b as bv, e as Fn } from "./utils-DF6YUpNn.js";
import { N as Ul } from "./NavButton-jVIhOejA.js";
import { _ as N1 } from "./CheckSwitchButton.vue_vue_type_script_setup_true_lang-B5aVIv06.js";
import { g as bf } from "../vendor/date-fns/format-b1gG6cM7.js";
import { s as F1 } from "../vendor/date-fns/subDays-DlPNbvmn.js";
import { E as z1 } from "../vendor/packages/site/types/base-Dy_28wGT.js";
import { l as H1, a as Wl } from "./siteMetadata-DqOuo-u_.js";
import { V as wv } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as Tv } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import { V as V1 } from "../vendor/vuetify/VDatePicker-CkT_t8C-.js";
import { V as G1 } from "../vendor/vuetify/VNumberInput-ZpDwJV6p.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/normalizeInterval-DC3nt56b.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/vuetify/VBadge-MSR38gir.js";
function Yl(e) {
  return typeof e == "number" || e instanceof Number;
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var wf = function (e, t) {
  return (
    (wf =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (r, n) {
          r.__proto__ = n;
        }) ||
      function (r, n) {
        for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (r[i] = n[i]);
      }),
    wf(e, t)
  );
};
function V(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  wf(e, t);
  function r() {
    this.constructor = e;
  }
  e.prototype = t === null ? Object.create(t) : ((r.prototype = t.prototype), new r());
}
var U1 = (function () {
    function e() {
      ((this.firefox = !1), (this.ie = !1), (this.edge = !1), (this.newEdge = !1), (this.weChat = !1));
    }
    return e;
  })(),
  W1 = (function () {
    function e() {
      ((this.browser = new U1()),
        (this.node = !1),
        (this.wxa = !1),
        (this.worker = !1),
        (this.svgSupported = !1),
        (this.touchEventsSupported = !1),
        (this.pointerEventsSupported = !1),
        (this.domSupported = !1),
        (this.transformSupported = !1),
        (this.transform3dSupported = !1),
        (this.hasGlobalWindow = typeof window < "u"));
    }
    return e;
  })(),
  nt = new W1();
typeof wx == "object" && typeof wx.getSystemInfoSync == "function"
  ? ((nt.wxa = !0), (nt.touchEventsSupported = !0))
  : typeof document > "u" && typeof self < "u"
    ? (nt.worker = !0)
    : !nt.hasGlobalWindow ||
        "Deno" in window ||
        (typeof navigator < "u" &&
          typeof navigator.userAgent == "string" &&
          navigator.userAgent.indexOf("Node.js") > -1)
      ? ((nt.node = !0), (nt.svgSupported = !0))
      : Y1(navigator.userAgent, nt);
function Y1(e, t) {
  var r = t.browser,
    n = e.match(/Firefox\/([\d.]+)/),
    i = e.match(/MSIE\s([\d.]+)/) || e.match(/Trident\/.+?rv:(([\d.]+))/),
    a = e.match(/Edge?\/([\d.]+)/),
    o = /micromessenger/i.test(e);
  (n && ((r.firefox = !0), (r.version = n[1])),
    i && ((r.ie = !0), (r.version = i[1])),
    a && ((r.edge = !0), (r.version = a[1]), (r.newEdge = +a[1].split(".")[0] > 18)),
    o && (r.weChat = !0),
    (t.svgSupported = typeof SVGRect < "u"),
    (t.touchEventsSupported = "ontouchstart" in window && !r.ie && !r.edge),
    (t.pointerEventsSupported = "onpointerdown" in window && (r.edge || (r.ie && +r.version >= 11))));
  var s = (t.domSupported = typeof document < "u");
  if (s) {
    var l = document.documentElement.style;
    ((t.transform3dSupported =
      ((r.ie && "transition" in l) ||
        r.edge ||
        ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()) ||
        "MozPerspective" in l) &&
      !("OTransition" in l)),
      (t.transformSupported = t.transform3dSupported || (r.ie && +r.version >= 9)));
  }
}
var Yh = 12,
  X1 = "sans-serif",
  Nr = Yh + "px " + X1,
  $1 = 20,
  Z1 = 100,
  q1 = "007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";
function K1(e) {
  var t = {};
  if (typeof JSON > "u") return t;
  for (var r = 0; r < e.length; r++) {
    var n = String.fromCharCode(r + 32),
      i = (e.charCodeAt(r) - $1) / Z1;
    t[n] = i;
  }
  return t;
}
var Q1 = K1(q1),
  fe = {
    createCanvas: function () {
      return typeof document < "u" && document.createElement("canvas");
    },
    measureText: (function () {
      var e, t;
      return function (r, n) {
        if (!e) {
          var i = fe.createCanvas();
          e = i && i.getContext("2d");
        }
        if (e) return (t !== n && (t = e.font = n || Nr), e.measureText(r));
        ((r = r || ""), (n = n || Nr));
        var a = /((?:\d+)?\.?\d*)px/.exec(n),
          o = (a && +a[1]) || Yh,
          s = 0;
        if (n.indexOf("mono") >= 0) s = o * r.length;
        else
          for (var l = 0; l < r.length; l++) {
            var u = Q1[r[l]];
            s += u == null ? o : u * o;
          }
        return { width: s };
      };
    })(),
    loadImage: function (e, t, r) {
      var n = new Image();
      return ((n.onload = t), (n.onerror = r), (n.src = e), n);
    },
    getTime: function () {
      return Date.now ? Date.now() : +new Date();
    },
  },
  Om = Mi(
    ["Function", "RegExp", "Date", "Error", "CanvasGradient", "CanvasPattern", "Image", "Canvas"],
    function (e, t) {
      return ((e["[object " + t + "]"] = !0), e);
    },
    {},
  ),
  km = Mi(
    ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64"],
    function (e, t) {
      return ((e["[object " + t + "Array]"] = !0), e);
    },
    {},
  ),
  Ua = Object.prototype.toString,
  sl = Array.prototype,
  j1 = sl.forEach,
  J1 = sl.filter,
  Xh = sl.slice,
  tb = sl.map,
  xv = function () {}.constructor,
  io = xv ? xv.prototype : null,
  $h = "__proto__",
  Xl = 2311,
  eb = Math.pow(2, 53) - 1;
function Bm() {
  return (Xl >= eb && (Xl = 0), Xl++);
}
function Zh() {
  for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
  typeof console < "u" && console.error.apply(console, e);
}
function ot(e) {
  if (e == null || typeof e != "object") return e;
  var t = e,
    r = Ua.call(e);
  if (r === "[object Array]") {
    if (!ca(e)) {
      t = [];
      for (var n = 0, i = e.length; n < i; n++) t[n] = ot(e[n]);
    }
  } else if (km[r]) {
    if (!ca(e)) {
      var a = e.constructor;
      if (a.from) t = a.from(e);
      else {
        t = new a(e.length);
        for (var n = 0, i = e.length; n < i; n++) t[n] = e[n];
      }
    }
  } else if (!Om[r] && !ca(e) && !Aa(e)) {
    t = {};
    for (var o in e) e.hasOwnProperty(o) && o !== $h && (t[o] = ot(e[o]));
  }
  return t;
}
function pt(e, t, r) {
  if (!Z(t) || !Z(e)) return r ? ot(t) : e;
  for (var n in t)
    if (t.hasOwnProperty(n) && n !== $h) {
      var i = e[n],
        a = t[n];
      Z(a) && Z(i) && !U(a) && !U(i) && !Aa(a) && !Aa(i) && !Cv(a) && !Cv(i) && !ca(a) && !ca(i)
        ? pt(i, a, r)
        : (r || !(n in e)) && (e[n] = ot(t[n]));
    }
  return e;
}
function N(e, t) {
  if (Object.assign) Object.assign(e, t);
  else for (var r in t) t.hasOwnProperty(r) && r !== $h && (e[r] = t[r]);
  return e;
}
function rb(e, t, r) {
  e = e || {};
  for (var n = 0; n < r.length; n++) {
    var i = r[n];
    e[i] = t[i];
  }
  return e;
}
function mt(e, t, r) {
  for (var n = xt(t), i = 0, a = n.length; i < a; i++) {
    var o = n[i];
    e[o] == null && (e[o] = t[o]);
  }
  return e;
}
function vt(e, t) {
  if (e) {
    if (e.indexOf) return e.indexOf(t);
    for (var r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
  }
  return -1;
}
function nb(e, t) {
  var r = e.prototype;
  function n() {}
  ((n.prototype = t.prototype), (e.prototype = new n()));
  for (var i in r) r.hasOwnProperty(i) && (e.prototype[i] = r[i]);
  ((e.prototype.constructor = e), (e.superClass = t));
}
function rr(e, t, r) {
  if (((e = "prototype" in e ? e.prototype : e), (t = "prototype" in t ? t.prototype : t), Object.getOwnPropertyNames))
    for (var n = Object.getOwnPropertyNames(t), i = 0; i < n.length; i++) {
      var a = n[i];
      a !== "constructor" && e[a] == null && (e[a] = t[a]);
    }
  else mt(e, t);
}
function ae(e) {
  return !e || typeof e == "string" ? !1 : typeof e.length == "number";
}
function I(e, t, r) {
  if (e && t)
    if (e.forEach && e.forEach === j1) e.forEach(t, r);
    else if (e.length === +e.length) for (var n = 0, i = e.length; n < i; n++) t.call(r, e[n], n, e);
    else for (var a in e) e.hasOwnProperty(a) && t.call(r, e[a], a, e);
}
function j(e, t, r) {
  if (!e) return [];
  if (!t) return qh(e);
  if (e.map && e.map === tb) return e.map(t, r);
  for (var n = [], i = 0, a = e.length; i < a; i++) n.push(t.call(r, e[i], i, e));
  return n;
}
function Mi(e, t, r, n) {
  if (e && t) {
    for (var i = 0, a = e.length; i < a; i++) r = t.call(n, r, e[i], i, e);
    return r;
  }
}
function Vt(e, t, r) {
  if (!e) return [];
  if (!t) return qh(e);
  if (e.filter && e.filter === J1) return e.filter(t, r);
  for (var n = [], i = 0, a = e.length; i < a; i++) t.call(r, e[i], i, e) && n.push(e[i]);
  return n;
}
function ib(e, t, r) {
  if (e && t) {
    for (var n = 0, i = e.length; n < i; n++) if (t.call(r, e[n], n, e)) return e[n];
  }
}
function xt(e) {
  if (!e) return [];
  if (Object.keys) return Object.keys(e);
  var t = [];
  for (var r in e) e.hasOwnProperty(r) && t.push(r);
  return t;
}
function ab(e, t) {
  for (var r = [], n = 2; n < arguments.length; n++) r[n - 2] = arguments[n];
  return function () {
    return e.apply(t, r.concat(Xh.call(arguments)));
  };
}
var Tt = io && et(io.bind) ? io.call.bind(io.bind) : ab;
function Rt(e) {
  for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
  return function () {
    return e.apply(this, t.concat(Xh.call(arguments)));
  };
}
function U(e) {
  return Array.isArray ? Array.isArray(e) : Ua.call(e) === "[object Array]";
}
function et(e) {
  return typeof e == "function";
}
function Y(e) {
  return typeof e == "string";
}
function Tf(e) {
  return Ua.call(e) === "[object String]";
}
function wt(e) {
  return typeof e == "number";
}
function Z(e) {
  var t = typeof e;
  return t === "function" || (!!e && t === "object");
}
function Cv(e) {
  return !!Om[Ua.call(e)];
}
function oe(e) {
  return !!km[Ua.call(e)];
}
function Aa(e) {
  return typeof e == "object" && typeof e.nodeType == "number" && typeof e.ownerDocument == "object";
}
function ll(e) {
  return e.colorStops != null;
}
function ob(e) {
  return e.image != null;
}
function Ma(e) {
  return e !== e;
}
function ws() {
  for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
  for (var r = 0, n = e.length; r < n; r++) if (e[r] != null) return e[r];
}
function q(e, t) {
  return e ?? t;
}
function ui(e, t, r) {
  return e ?? t ?? r;
}
function qh(e) {
  for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
  return Xh.apply(e, t);
}
function Kh(e) {
  if (typeof e == "number") return [e, e, e, e];
  var t = e.length;
  return t === 2 ? [e[0], e[1], e[0], e[1]] : t === 3 ? [e[0], e[1], e[2], e[1]] : e;
}
function vr(e, t) {
  if (!e) throw new Error(t);
}
function Xe(e) {
  return e == null
    ? null
    : typeof e.trim == "function"
      ? e.trim()
      : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
var Nm = "__ec_primitive__";
function xf(e) {
  e[Nm] = !0;
}
function ca(e) {
  return e[Nm];
}
var sb = (function () {
    function e() {
      this.data = {};
    }
    return (
      (e.prototype.delete = function (t) {
        var r = this.has(t);
        return (r && delete this.data[t], r);
      }),
      (e.prototype.has = function (t) {
        return this.data.hasOwnProperty(t);
      }),
      (e.prototype.get = function (t) {
        return this.data[t];
      }),
      (e.prototype.set = function (t, r) {
        return ((this.data[t] = r), this);
      }),
      (e.prototype.keys = function () {
        return xt(this.data);
      }),
      (e.prototype.forEach = function (t) {
        var r = this.data;
        for (var n in r) r.hasOwnProperty(n) && t(r[n], n);
      }),
      e
    );
  })(),
  Fm = typeof Map == "function";
function lb() {
  return Fm ? new Map() : new sb();
}
var ub = (function () {
  function e(t) {
    var r = U(t);
    this.data = lb();
    var n = this;
    t instanceof e ? t.each(i) : t && I(t, i);
    function i(a, o) {
      r ? n.set(a, o) : n.set(o, a);
    }
  }
  return (
    (e.prototype.hasKey = function (t) {
      return this.data.has(t);
    }),
    (e.prototype.get = function (t) {
      return this.data.get(t);
    }),
    (e.prototype.set = function (t, r) {
      return (this.data.set(t, r), r);
    }),
    (e.prototype.each = function (t, r) {
      this.data.forEach(function (n, i) {
        t.call(r, n, i);
      });
    }),
    (e.prototype.keys = function () {
      var t = this.data.keys();
      return Fm ? Array.from(t) : t;
    }),
    (e.prototype.removeKey = function (t) {
      this.data.delete(t);
    }),
    e
  );
})();
function Q(e) {
  return new ub(e);
}
function fb(e, t) {
  for (var r = new e.constructor(e.length + t.length), n = 0; n < e.length; n++) r[n] = e[n];
  for (var i = e.length, n = 0; n < t.length; n++) r[n + i] = t[n];
  return r;
}
function ul(e, t) {
  var r;
  if (Object.create) r = Object.create(e);
  else {
    var n = function () {};
    ((n.prototype = e), (r = new n()));
  }
  return (t && N(r, t), r);
}
function zm(e) {
  var t = e.style;
  ((t.webkitUserSelect = "none"),
    (t.userSelect = "none"),
    (t.webkitTapHighlightColor = "rgba(0,0,0,0)"),
    (t["-webkit-touch-callout"] = "none"));
}
function Qt(e, t) {
  return e.hasOwnProperty(t);
}
function Gt() {}
var hb = 180 / Math.PI;
function Ii(e, t) {
  return (e == null && (e = 0), t == null && (t = 0), [e, t]);
}
function cb(e) {
  return [e[0], e[1]];
}
function $l(e, t, r) {
  return ((e[0] = t), (e[1] = r), e);
}
function Dv(e, t, r) {
  return ((e[0] = t[0] + r[0]), (e[1] = t[1] + r[1]), e);
}
function vb(e, t, r) {
  return ((e[0] = t[0] - r[0]), (e[1] = t[1] - r[1]), e);
}
function db(e) {
  return Math.sqrt(pb(e));
}
function pb(e) {
  return e[0] * e[0] + e[1] * e[1];
}
function Zl(e, t, r) {
  return ((e[0] = t[0] * r), (e[1] = t[1] * r), e);
}
function gb(e, t) {
  var r = db(t);
  return (r === 0 ? ((e[0] = 0), (e[1] = 0)) : ((e[0] = t[0] / r), (e[1] = t[1] / r)), e);
}
function Cf(e, t) {
  return Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]));
}
var mb = Cf;
function yb(e, t) {
  return (e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]);
}
var fi = yb;
function Ae(e, t, r) {
  var n = t[0],
    i = t[1];
  return ((e[0] = r[0] * n + r[2] * i + r[4]), (e[1] = r[1] * n + r[3] * i + r[5]), e);
}
function ni(e, t, r) {
  return ((e[0] = Math.min(t[0], r[0])), (e[1] = Math.min(t[1], r[1])), e);
}
function ii(e, t, r) {
  return ((e[0] = Math.max(t[0], r[0])), (e[1] = Math.max(t[1], r[1])), e);
}
var zn = (function () {
    function e(t, r) {
      ((this.target = t), (this.topTarget = r && r.topTarget));
    }
    return e;
  })(),
  _b = (function () {
    function e(t) {
      ((this.handler = t),
        t.on("mousedown", this._dragStart, this),
        t.on("mousemove", this._drag, this),
        t.on("mouseup", this._dragEnd, this));
    }
    return (
      (e.prototype._dragStart = function (t) {
        for (var r = t.target; r && !r.draggable; ) r = r.parent || r.__hostTarget;
        r &&
          ((this._draggingTarget = r),
          (r.dragging = !0),
          (this._x = t.offsetX),
          (this._y = t.offsetY),
          this.handler.dispatchToElement(new zn(r, t), "dragstart", t.event));
      }),
      (e.prototype._drag = function (t) {
        var r = this._draggingTarget;
        if (r) {
          var n = t.offsetX,
            i = t.offsetY,
            a = n - this._x,
            o = i - this._y;
          ((this._x = n),
            (this._y = i),
            r.drift(a, o, t),
            this.handler.dispatchToElement(new zn(r, t), "drag", t.event));
          var s = this.handler.findHover(n, i, r).target,
            l = this._dropTarget;
          ((this._dropTarget = s),
            r !== s &&
              (l && s !== l && this.handler.dispatchToElement(new zn(l, t), "dragleave", t.event),
              s && s !== l && this.handler.dispatchToElement(new zn(s, t), "dragenter", t.event)));
        }
      }),
      (e.prototype._dragEnd = function (t) {
        var r = this._draggingTarget;
        (r && (r.dragging = !1),
          this.handler.dispatchToElement(new zn(r, t), "dragend", t.event),
          this._dropTarget && this.handler.dispatchToElement(new zn(this._dropTarget, t), "drop", t.event),
          (this._draggingTarget = null),
          (this._dropTarget = null));
      }),
      e
    );
  })(),
  nr = (function () {
    function e(t) {
      t && (this._$eventProcessor = t);
    }
    return (
      (e.prototype.on = function (t, r, n, i) {
        this._$handlers || (this._$handlers = {});
        var a = this._$handlers;
        if ((typeof r == "function" && ((i = n), (n = r), (r = null)), !n || !t)) return this;
        var o = this._$eventProcessor;
        (r != null && o && o.normalizeQuery && (r = o.normalizeQuery(r)), a[t] || (a[t] = []));
        for (var s = 0; s < a[t].length; s++) if (a[t][s].h === n) return this;
        var l = { h: n, query: r, ctx: i || this, callAtLast: n.zrEventfulCallAtLast },
          u = a[t].length - 1,
          f = a[t][u];
        return (f && f.callAtLast ? a[t].splice(u, 0, l) : a[t].push(l), this);
      }),
      (e.prototype.isSilent = function (t) {
        var r = this._$handlers;
        return !r || !r[t] || !r[t].length;
      }),
      (e.prototype.off = function (t, r) {
        var n = this._$handlers;
        if (!n) return this;
        if (!t) return ((this._$handlers = {}), this);
        if (r) {
          if (n[t]) {
            for (var i = [], a = 0, o = n[t].length; a < o; a++) n[t][a].h !== r && i.push(n[t][a]);
            n[t] = i;
          }
          n[t] && n[t].length === 0 && delete n[t];
        } else delete n[t];
        return this;
      }),
      (e.prototype.trigger = function (t) {
        for (var r = [], n = 1; n < arguments.length; n++) r[n - 1] = arguments[n];
        if (!this._$handlers) return this;
        var i = this._$handlers[t],
          a = this._$eventProcessor;
        if (i)
          for (var o = r.length, s = i.length, l = 0; l < s; l++) {
            var u = i[l];
            if (!(a && a.filter && u.query != null && !a.filter(t, u.query)))
              switch (o) {
                case 0:
                  u.h.call(u.ctx);
                  break;
                case 1:
                  u.h.call(u.ctx, r[0]);
                  break;
                case 2:
                  u.h.call(u.ctx, r[0], r[1]);
                  break;
                default:
                  u.h.apply(u.ctx, r);
                  break;
              }
          }
        return (a && a.afterTrigger && a.afterTrigger(t), this);
      }),
      (e.prototype.triggerWithContext = function (t) {
        for (var r = [], n = 1; n < arguments.length; n++) r[n - 1] = arguments[n];
        if (!this._$handlers) return this;
        var i = this._$handlers[t],
          a = this._$eventProcessor;
        if (i)
          for (var o = r.length, s = r[o - 1], l = i.length, u = 0; u < l; u++) {
            var f = i[u];
            if (!(a && a.filter && f.query != null && !a.filter(t, f.query)))
              switch (o) {
                case 0:
                  f.h.call(s);
                  break;
                case 1:
                  f.h.call(s, r[0]);
                  break;
                case 2:
                  f.h.call(s, r[0], r[1]);
                  break;
                default:
                  f.h.apply(s, r.slice(1, o - 1));
                  break;
              }
          }
        return (a && a.afterTrigger && a.afterTrigger(t), this);
      }),
      e
    );
  })(),
  Sb = Math.log(2);
function Df(e, t, r, n, i, a) {
  var o = n + "-" + i,
    s = e.length;
  if (a.hasOwnProperty(o)) return a[o];
  if (t === 1) {
    var l = Math.round(Math.log(((1 << s) - 1) & ~i) / Sb);
    return e[r][l];
  }
  for (var u = n | (1 << r), f = r + 1; n & (1 << f); ) f++;
  for (var h = 0, c = 0, v = 0; c < s; c++) {
    var d = 1 << c;
    d & i || ((h += (v % 2 ? -1 : 1) * e[r][c] * Df(e, t - 1, f, u, i | d, a)), v++);
  }
  return ((a[o] = h), h);
}
function Av(e, t) {
  var r = [
      [e[0], e[1], 1, 0, 0, 0, -t[0] * e[0], -t[0] * e[1]],
      [0, 0, 0, e[0], e[1], 1, -t[1] * e[0], -t[1] * e[1]],
      [e[2], e[3], 1, 0, 0, 0, -t[2] * e[2], -t[2] * e[3]],
      [0, 0, 0, e[2], e[3], 1, -t[3] * e[2], -t[3] * e[3]],
      [e[4], e[5], 1, 0, 0, 0, -t[4] * e[4], -t[4] * e[5]],
      [0, 0, 0, e[4], e[5], 1, -t[5] * e[4], -t[5] * e[5]],
      [e[6], e[7], 1, 0, 0, 0, -t[6] * e[6], -t[6] * e[7]],
      [0, 0, 0, e[6], e[7], 1, -t[7] * e[6], -t[7] * e[7]],
    ],
    n = {},
    i = Df(r, 8, 0, 0, 0, n);
  if (i !== 0) {
    for (var a = [], o = 0; o < 8; o++)
      for (var s = 0; s < 8; s++)
        (a[s] == null && (a[s] = 0),
          (a[s] += ((((o + s) % 2 ? -1 : 1) * Df(r, 7, o === 0 ? 1 : 0, 1 << o, 1 << s, n)) / i) * t[o]));
    return function (l, u, f) {
      var h = u * a[6] + f * a[7] + 1;
      ((l[0] = (u * a[0] + f * a[1] + a[2]) / h), (l[1] = (u * a[3] + f * a[4] + a[5]) / h));
    };
  }
}
var Ts = "___zrEVENTSAVED",
  ql = [];
function bb(e, t, r, n, i) {
  return Af(ql, t, n, i, !0) && Af(e, r, ql[0], ql[1]);
}
function wb(e, t) {
  (e && r(e), t && r(t));
  function r(n) {
    var i = n[Ts];
    i && (i.clearMarkers && i.clearMarkers(), delete n[Ts]);
  }
}
function Af(e, t, r, n, i) {
  if (t.getBoundingClientRect && nt.domSupported && !Hm(t)) {
    var a = t[Ts] || (t[Ts] = {}),
      o = Tb(t, a),
      s = xb(o, a, i);
    if (s) return (s(e, r, n), !0);
  }
  return !1;
}
function Tb(e, t) {
  var r = t.markers;
  if (r) return r;
  r = t.markers = [];
  for (var n = ["left", "right"], i = ["top", "bottom"], a = 0; a < 4; a++) {
    var o = document.createElement("div"),
      s = o.style,
      l = a % 2,
      u = (a >> 1) % 2;
    ((s.cssText = [
      "position: absolute",
      "visibility: hidden",
      "padding: 0",
      "margin: 0",
      "border-width: 0",
      "user-select: none",
      "width:0",
      "height:0",
      n[l] + ":0",
      i[u] + ":0",
      n[1 - l] + ":auto",
      i[1 - u] + ":auto",
      "",
    ].join("!important;")),
      e.appendChild(o),
      r.push(o));
  }
  return (
    (t.clearMarkers = function () {
      I(r, function (f) {
        f.parentNode && f.parentNode.removeChild(f);
      });
    }),
    r
  );
}
function xb(e, t, r) {
  for (var n = r ? "invTrans" : "trans", i = t[n], a = t.srcCoords, o = [], s = [], l = !0, u = 0; u < 4; u++) {
    var f = e[u].getBoundingClientRect(),
      h = 2 * u,
      c = f.left,
      v = f.top;
    (o.push(c, v), (l = l && a && c === a[h] && v === a[h + 1]), s.push(e[u].offsetLeft, e[u].offsetTop));
  }
  return l && i ? i : ((t.srcCoords = o), (t[n] = r ? Av(s, o) : Av(o, s)));
}
function Hm(e) {
  return e.nodeName.toUpperCase() === "CANVAS";
}
var Cb = /([&<>"'])/g,
  Db = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
function ee(e) {
  return e == null
    ? ""
    : (e + "").replace(Cb, function (t, r) {
        return Db[r];
      });
}
var Ab = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
  Kl = [],
  Mb = nt.browser.firefox && +nt.browser.version.split(".")[0] < 39;
function Mf(e, t, r, n) {
  return (
    (r = r || {}),
    n
      ? Mv(e, t, r)
      : Mb && t.layerX != null && t.layerX !== t.offsetX
        ? ((r.zrX = t.layerX), (r.zrY = t.layerY))
        : t.offsetX != null
          ? ((r.zrX = t.offsetX), (r.zrY = t.offsetY))
          : Mv(e, t, r),
    r
  );
}
function Mv(e, t, r) {
  if (nt.domSupported && e.getBoundingClientRect) {
    var n = t.clientX,
      i = t.clientY;
    if (Hm(e)) {
      var a = e.getBoundingClientRect();
      ((r.zrX = n - a.left), (r.zrY = i - a.top));
      return;
    } else if (Af(Kl, e, n, i)) {
      ((r.zrX = Kl[0]), (r.zrY = Kl[1]));
      return;
    }
  }
  r.zrX = r.zrY = 0;
}
function Qh(e) {
  return e || window.event;
}
function me(e, t, r) {
  if (((t = Qh(t)), t.zrX != null)) return t;
  var n = t.type,
    i = n && n.indexOf("touch") >= 0;
  if (i) {
    var o = n !== "touchend" ? t.targetTouches[0] : t.changedTouches[0];
    o && Mf(e, o, t, r);
  } else {
    Mf(e, t, t, r);
    var a = Ib(t);
    t.zrDelta = a ? a / 120 : -(t.detail || 0) / 3;
  }
  var s = t.button;
  return (t.which == null && s !== void 0 && Ab.test(t.type) && (t.which = s & 1 ? 1 : s & 2 ? 3 : s & 4 ? 2 : 0), t);
}
function Ib(e) {
  var t = e.wheelDelta;
  if (t) return t;
  var r = e.deltaX,
    n = e.deltaY;
  if (r == null || n == null) return t;
  var i = Math.abs(n !== 0 ? n : r),
    a = n > 0 ? -1 : n < 0 ? 1 : r > 0 ? -1 : 1;
  return 3 * i * a;
}
function Lb(e, t, r, n) {
  e.addEventListener(t, r, n);
}
function Pb(e, t, r, n) {
  e.removeEventListener(t, r, n);
}
var Vm = function (e) {
    (e.preventDefault(), e.stopPropagation(), (e.cancelBubble = !0));
  },
  Eb = (function () {
    function e() {
      this._track = [];
    }
    return (
      (e.prototype.recognize = function (t, r, n) {
        return (this._doTrack(t, r, n), this._recognize(t));
      }),
      (e.prototype.clear = function () {
        return ((this._track.length = 0), this);
      }),
      (e.prototype._doTrack = function (t, r, n) {
        var i = t.touches;
        if (i) {
          for (var a = { points: [], touches: [], target: r, event: t }, o = 0, s = i.length; o < s; o++) {
            var l = i[o],
              u = Mf(n, l, {});
            (a.points.push([u.zrX, u.zrY]), a.touches.push(l));
          }
          this._track.push(a);
        }
      }),
      (e.prototype._recognize = function (t) {
        for (var r in Ql)
          if (Ql.hasOwnProperty(r)) {
            var n = Ql[r](this._track, t);
            if (n) return n;
          }
      }),
      e
    );
  })();
function Iv(e) {
  var t = e[1][0] - e[0][0],
    r = e[1][1] - e[0][1];
  return Math.sqrt(t * t + r * r);
}
function Rb(e) {
  return [(e[0][0] + e[1][0]) / 2, (e[0][1] + e[1][1]) / 2];
}
var Ql = {
  pinch: function (e, t) {
    var r = e.length;
    if (r) {
      var n = (e[r - 1] || {}).points,
        i = (e[r - 2] || {}).points || n;
      if (i && i.length > 1 && n && n.length > 1) {
        var a = Iv(n) / Iv(i);
        (!isFinite(a) && (a = 1), (t.pinchScale = a));
        var o = Rb(n);
        return ((t.pinchX = o[0]), (t.pinchY = o[1]), { type: "pinch", target: e[0].target, event: t });
      }
    }
  },
};
function Ze() {
  return [1, 0, 0, 1, 0, 0];
}
function Wa(e) {
  return ((e[0] = 1), (e[1] = 0), (e[2] = 0), (e[3] = 1), (e[4] = 0), (e[5] = 0), e);
}
function jh(e, t) {
  return ((e[0] = t[0]), (e[1] = t[1]), (e[2] = t[2]), (e[3] = t[3]), (e[4] = t[4]), (e[5] = t[5]), e);
}
function va(e, t, r) {
  var n = t[0] * r[0] + t[2] * r[1],
    i = t[1] * r[0] + t[3] * r[1],
    a = t[0] * r[2] + t[2] * r[3],
    o = t[1] * r[2] + t[3] * r[3],
    s = t[0] * r[4] + t[2] * r[5] + t[4],
    l = t[1] * r[4] + t[3] * r[5] + t[5];
  return ((e[0] = n), (e[1] = i), (e[2] = a), (e[3] = o), (e[4] = s), (e[5] = l), e);
}
function If(e, t, r) {
  return ((e[0] = t[0]), (e[1] = t[1]), (e[2] = t[2]), (e[3] = t[3]), (e[4] = t[4] + r[0]), (e[5] = t[5] + r[1]), e);
}
function Jh(e, t, r, n) {
  n === void 0 && (n = [0, 0]);
  var i = t[0],
    a = t[2],
    o = t[4],
    s = t[1],
    l = t[3],
    u = t[5],
    f = Math.sin(r),
    h = Math.cos(r);
  return (
    (e[0] = i * h + s * f),
    (e[1] = -i * f + s * h),
    (e[2] = a * h + l * f),
    (e[3] = -a * f + h * l),
    (e[4] = h * (o - n[0]) + f * (u - n[1]) + n[0]),
    (e[5] = h * (u - n[1]) - f * (o - n[0]) + n[1]),
    e
  );
}
function Ob(e, t, r) {
  var n = r[0],
    i = r[1];
  return (
    (e[0] = t[0] * n),
    (e[1] = t[1] * i),
    (e[2] = t[2] * n),
    (e[3] = t[3] * i),
    (e[4] = t[4] * n),
    (e[5] = t[5] * i),
    e
  );
}
function Ya(e, t) {
  var r = t[0],
    n = t[2],
    i = t[4],
    a = t[1],
    o = t[3],
    s = t[5],
    l = r * o - a * n;
  return l
    ? ((l = 1 / l),
      (e[0] = o * l),
      (e[1] = -a * l),
      (e[2] = -n * l),
      (e[3] = r * l),
      (e[4] = (n * s - o * i) * l),
      (e[5] = (a * i - r * s) * l),
      e)
    : null;
}
var _t = (function () {
    function e(t, r) {
      ((this.x = t || 0), (this.y = r || 0));
    }
    return (
      (e.prototype.copy = function (t) {
        return ((this.x = t.x), (this.y = t.y), this);
      }),
      (e.prototype.clone = function () {
        return new e(this.x, this.y);
      }),
      (e.prototype.set = function (t, r) {
        return ((this.x = t), (this.y = r), this);
      }),
      (e.prototype.equal = function (t) {
        return t.x === this.x && t.y === this.y;
      }),
      (e.prototype.add = function (t) {
        return ((this.x += t.x), (this.y += t.y), this);
      }),
      (e.prototype.scale = function (t) {
        ((this.x *= t), (this.y *= t));
      }),
      (e.prototype.scaleAndAdd = function (t, r) {
        ((this.x += t.x * r), (this.y += t.y * r));
      }),
      (e.prototype.sub = function (t) {
        return ((this.x -= t.x), (this.y -= t.y), this);
      }),
      (e.prototype.dot = function (t) {
        return this.x * t.x + this.y * t.y;
      }),
      (e.prototype.len = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }),
      (e.prototype.lenSquare = function () {
        return this.x * this.x + this.y * this.y;
      }),
      (e.prototype.normalize = function () {
        var t = this.len();
        return ((this.x /= t), (this.y /= t), this);
      }),
      (e.prototype.distance = function (t) {
        var r = this.x - t.x,
          n = this.y - t.y;
        return Math.sqrt(r * r + n * n);
      }),
      (e.prototype.distanceSquare = function (t) {
        var r = this.x - t.x,
          n = this.y - t.y;
        return r * r + n * n;
      }),
      (e.prototype.negate = function () {
        return ((this.x = -this.x), (this.y = -this.y), this);
      }),
      (e.prototype.transform = function (t) {
        if (t) {
          var r = this.x,
            n = this.y;
          return ((this.x = t[0] * r + t[2] * n + t[4]), (this.y = t[1] * r + t[3] * n + t[5]), this);
        }
      }),
      (e.prototype.toArray = function (t) {
        return ((t[0] = this.x), (t[1] = this.y), t);
      }),
      (e.prototype.fromArray = function (t) {
        ((this.x = t[0]), (this.y = t[1]));
      }),
      (e.set = function (t, r, n) {
        ((t.x = r), (t.y = n));
      }),
      (e.copy = function (t, r) {
        ((t.x = r.x), (t.y = r.y));
      }),
      (e.len = function (t) {
        return Math.sqrt(t.x * t.x + t.y * t.y);
      }),
      (e.lenSquare = function (t) {
        return t.x * t.x + t.y * t.y;
      }),
      (e.dot = function (t, r) {
        return t.x * r.x + t.y * r.y;
      }),
      (e.add = function (t, r, n) {
        ((t.x = r.x + n.x), (t.y = r.y + n.y));
      }),
      (e.sub = function (t, r, n) {
        ((t.x = r.x - n.x), (t.y = r.y - n.y));
      }),
      (e.scale = function (t, r, n) {
        ((t.x = r.x * n), (t.y = r.y * n));
      }),
      (e.scaleAndAdd = function (t, r, n, i) {
        ((t.x = r.x + n.x * i), (t.y = r.y + n.y * i));
      }),
      (e.lerp = function (t, r, n, i) {
        var a = 1 - i;
        ((t.x = a * r.x + i * n.x), (t.y = a * r.y + i * n.y));
      }),
      e
    );
  })(),
  wn = Math.min,
  ai = Math.max,
  Lf = Math.abs,
  Lv = ["x", "y"],
  kb = ["width", "height"],
  Zr = new _t(),
  qr = new _t(),
  Kr = new _t(),
  Qr = new _t(),
  ue = Gm(),
  aa = ue.minTv,
  Pf = ue.maxTv,
  da = [0, 0],
  J = (function () {
    function e(t, r, n, i) {
      jl(this, t, r, n, i);
    }
    return (
      (e.set = function (t, r, n, i, a) {
        return (
          i < 0 && ((r = r + i), (i = -i)),
          a < 0 && ((n = n + a), (a = -a)),
          (t.x = r),
          (t.y = n),
          (t.width = i),
          (t.height = a),
          t
        );
      }),
      (e.prototype.union = function (t) {
        var r = wn(t.x, this.x),
          n = wn(t.y, this.y);
        (isFinite(this.x) && isFinite(this.width)
          ? (this.width = ai(t.x + t.width, this.x + this.width) - r)
          : (this.width = t.width),
          isFinite(this.y) && isFinite(this.height)
            ? (this.height = ai(t.y + t.height, this.y + this.height) - n)
            : (this.height = t.height),
          (this.x = r),
          (this.y = n));
      }),
      (e.prototype.applyTransform = function (t) {
        e.applyTransform(this, this, t);
      }),
      (e.prototype.calculateTransform = function (t) {
        return Bb(Ze(), this, t);
      }),
      (e.prototype.intersect = function (t, r, n) {
        return e.intersect(this, t, r, n);
      }),
      (e.intersect = function (t, r, n, i) {
        n && _t.set(n, 0, 0);
        var a = (i && i.outIntersectRect) || null,
          o = i && i.clamp;
        if ((a && (a.x = a.y = a.width = a.height = NaN), !t || !r)) return !1;
        (t instanceof e || (t = jl(Nb, t.x, t.y, t.width, t.height)),
          r instanceof e || (r = jl(Fb, r.x, r.y, r.width, r.height)));
        var s = !!n;
        ue.reset(i, s);
        var l = ue.touchThreshold,
          u = t.x + l,
          f = t.x + t.width - l,
          h = t.y + l,
          c = t.y + t.height - l,
          v = r.x + l,
          d = r.x + r.width - l,
          p = r.y + l,
          m = r.y + r.height - l;
        if (u > f || h > c || v > d || p > m) return !1;
        var g = !(f < v || d < u || c < p || m < h);
        return (
          (s || a) &&
            ((da[0] = 1 / 0),
            (da[1] = 0),
            Ev(u, f, v, d, 0, s, a, o),
            Ev(h, c, p, m, 1, s, a, o),
            s && _t.copy(n, g ? (ue.useDir ? ue.dirMinTv : aa) : Pf)),
          g
        );
      }),
      (e.contain = function (t, r, n) {
        return r >= t.x && r <= t.x + t.width && n >= t.y && n <= t.y + t.height;
      }),
      (e.prototype.contain = function (t, r) {
        return e.contain(this, t, r);
      }),
      (e.prototype.clone = function () {
        return new e(this.x, this.y, this.width, this.height);
      }),
      (e.prototype.copy = function (t) {
        Pv(this, t);
      }),
      (e.prototype.plain = function () {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
      }),
      (e.prototype.isFinite = function () {
        return isFinite(this.x) && isFinite(this.y) && isFinite(this.width) && isFinite(this.height);
      }),
      (e.prototype.isZero = function () {
        return this.width === 0 || this.height === 0;
      }),
      (e.create = function (t) {
        return new e(t ? t.x : 0, t ? t.y : 0, t ? t.width : 0, t ? t.height : 0);
      }),
      (e.copy = function (t, r) {
        return ((t.x = r.x), (t.y = r.y), (t.width = r.width), (t.height = r.height), t);
      }),
      (e.applyTransform = function (t, r, n) {
        if (!n) {
          t !== r && Pv(t, r);
          return;
        }
        if (n[1] < 1e-5 && n[1] > -1e-5 && n[2] < 1e-5 && n[2] > -1e-5) {
          var i = n[0],
            a = n[3],
            o = n[4],
            s = n[5];
          ((t.x = r.x * i + o),
            (t.y = r.y * a + s),
            (t.width = r.width * i),
            (t.height = r.height * a),
            t.width < 0 && ((t.x += t.width), (t.width = -t.width)),
            t.height < 0 && ((t.y += t.height), (t.height = -t.height)));
          return;
        }
        ((Zr.x = Kr.x = r.x),
          (Zr.y = Qr.y = r.y),
          (qr.x = Qr.x = r.x + r.width),
          (qr.y = Kr.y = r.y + r.height),
          Zr.transform(n),
          Qr.transform(n),
          qr.transform(n),
          Kr.transform(n),
          (t.x = wn(Zr.x, qr.x, Kr.x, Qr.x)),
          (t.y = wn(Zr.y, qr.y, Kr.y, Qr.y)));
        var l = ai(Zr.x, qr.x, Kr.x, Qr.x),
          u = ai(Zr.y, qr.y, Kr.y, Qr.y);
        ((t.width = l - t.x), (t.height = u - t.y));
      }),
      (e.calculateTransform = function (t, r, n) {
        var i = n.width / r.width,
          a = n.height / r.height;
        return ((t = Wa(t || [])), If(t, t, $l(Jl, -r.x, -r.y)), Ob(t, t, $l(Jl, i, a)), If(t, t, $l(Jl, n.x, n.y)), t);
      }),
      e
    );
  })();
J.create;
var jl = J.set,
  Pv = J.copy,
  Bb = J.calculateTransform;
J.applyTransform;
J.contain;
var Nb = new J(0, 0, 0, 0),
  Fb = new J(0, 0, 0, 0),
  Jl = [];
function Ev(e, t, r, n, i, a, o, s) {
  var l = Lf(t - r),
    u = Lf(n - e),
    f = wn(l, u),
    h = Lv[i],
    c = Lv[1 - i],
    v = kb[i];
  t < r || n < e
    ? l < u
      ? (a && (Pf[h] = -l), s && ((o[h] = t), (o[v] = 0)))
      : (a && (Pf[h] = u), s && ((o[h] = e), (o[v] = 0)))
    : (o && ((o[h] = ai(e, r)), (o[v] = wn(t, n) - o[h])),
      a &&
        (f < da[0] || ue.useDir) &&
        ((da[0] = wn(f, da[0])),
        (l < u || !ue.bidirectional) && ((aa[h] = l), (aa[c] = 0), ue.useDir && ue.calcDirMTV()),
        (l >= u || !ue.bidirectional) && ((aa[h] = -u), (aa[c] = 0), ue.useDir && ue.calcDirMTV())));
}
function Gm() {
  var e = 0,
    t = new _t(),
    r = new _t(),
    n = {
      minTv: new _t(),
      maxTv: new _t(),
      useDir: !1,
      dirMinTv: new _t(),
      touchThreshold: 0,
      bidirectional: !0,
      negativeSize: !1,
      reset: function (a, o) {
        ((n.touchThreshold = 0),
          a && a.touchThreshold != null && (n.touchThreshold = ai(0, a.touchThreshold)),
          (n.negativeSize = !1),
          o &&
            (n.minTv.set(1 / 0, 1 / 0),
            n.maxTv.set(0, 0),
            (n.useDir = !1),
            a &&
              a.direction != null &&
              ((n.useDir = !0),
              n.dirMinTv.copy(n.minTv),
              r.copy(n.minTv),
              (e = a.direction),
              (n.bidirectional = a.bidirectional == null || !!a.bidirectional),
              n.bidirectional || t.set(Math.cos(e), Math.sin(e)))));
      },
      calcDirMTV: function () {
        var a = n.minTv,
          o = n.dirMinTv,
          s = a.y * a.y + a.x * a.x,
          l = Math.sin(e),
          u = Math.cos(e),
          f = l * a.y + u * a.x;
        if (i(f)) {
          i(a.x) && i(a.y) && o.set(0, 0);
          return;
        }
        if (((r.x = (s * u) / f), (r.y = (s * l) / f), i(r.x) && i(r.y))) {
          o.set(0, 0);
          return;
        }
        (n.bidirectional || t.dot(r) > 0) && r.len() < o.len() && o.copy(r);
      },
    };
  function i(a) {
    return Lf(a) < 1e-10;
  }
  return n;
}
var Um = "silent";
function zb(e, t, r) {
  return {
    type: e,
    event: r,
    target: t.target,
    topTarget: t.topTarget,
    cancelBubble: !1,
    offsetX: r.zrX,
    offsetY: r.zrY,
    gestureEvent: r.gestureEvent,
    pinchX: r.pinchX,
    pinchY: r.pinchY,
    pinchScale: r.pinchScale,
    wheelDelta: r.zrDelta,
    zrByTouch: r.zrByTouch,
    which: r.which,
    stop: Hb,
  };
}
function Hb() {
  Vm(this.event);
}
var Vb = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.handler = null), r);
    }
    return ((t.prototype.dispose = function () {}), (t.prototype.setCursor = function () {}), t);
  })(nr),
  Hi = (function () {
    function e(t, r) {
      ((this.x = t), (this.y = r));
    }
    return e;
  })(),
  Gb = ["click", "dblclick", "mousewheel", "mouseout", "mouseup", "mousedown", "mousemove", "contextmenu"],
  tu = new J(0, 0, 0, 0),
  Wm = (function (e) {
    V(t, e);
    function t(r, n, i, a, o) {
      var s = e.call(this) || this;
      return (
        (s._hovered = new Hi(0, 0)),
        (s.storage = r),
        (s.painter = n),
        (s.painterRoot = a),
        (s._pointerSize = o),
        (i = i || new Vb()),
        (s.proxy = null),
        s.setHandlerProxy(i),
        (s._draggingMgr = new _b(s)),
        s
      );
    }
    return (
      (t.prototype.setHandlerProxy = function (r) {
        (this.proxy && this.proxy.dispose(),
          r &&
            (I(
              Gb,
              function (n) {
                r.on && r.on(n, this[n], this);
              },
              this,
            ),
            (r.handler = this)),
          (this.proxy = r));
      }),
      (t.prototype.mousemove = function (r) {
        var n = r.zrX,
          i = r.zrY,
          a = Ym(this, n, i),
          o = this._hovered,
          s = o.target;
        s && !s.__zr && ((o = this.findHover(o.x, o.y)), (s = o.target));
        var l = (this._hovered = a ? new Hi(n, i) : this.findHover(n, i)),
          u = l.target,
          f = this.proxy;
        (f.setCursor && f.setCursor(u ? u.cursor : "default"),
          s && u !== s && this.dispatchToElement(o, "mouseout", r),
          this.dispatchToElement(l, "mousemove", r),
          u && u !== s && this.dispatchToElement(l, "mouseover", r));
      }),
      (t.prototype.mouseout = function (r) {
        var n = r.zrEventControl;
        (n !== "only_globalout" && this.dispatchToElement(this._hovered, "mouseout", r),
          n !== "no_globalout" && this.trigger("globalout", { type: "globalout", event: r }));
      }),
      (t.prototype.resize = function () {
        this._hovered = new Hi(0, 0);
      }),
      (t.prototype.dispatch = function (r, n) {
        var i = this[r];
        i && i.call(this, n);
      }),
      (t.prototype.dispose = function () {
        (this.proxy.dispose(), (this.storage = null), (this.proxy = null), (this.painter = null));
      }),
      (t.prototype.setCursorStyle = function (r) {
        var n = this.proxy;
        n.setCursor && n.setCursor(r);
      }),
      (t.prototype.dispatchToElement = function (r, n, i) {
        r = r || {};
        var a = r.target;
        if (!(a && a.silent)) {
          for (
            var o = "on" + n, s = zb(n, r, i);
            a &&
            (a[o] && (s.cancelBubble = !!a[o].call(a, s)),
            a.trigger(n, s),
            (a = a.__hostTarget ? a.__hostTarget : a.parent),
            !s.cancelBubble);
          );
          s.cancelBubble ||
            (this.trigger(n, s),
            this.painter &&
              this.painter.eachOtherLayer &&
              this.painter.eachOtherLayer(function (l) {
                (typeof l[o] == "function" && l[o].call(l, s), l.trigger && l.trigger(n, s));
              }));
        }
      }),
      (t.prototype.findHover = function (r, n, i) {
        var a = this.storage.getDisplayList(),
          o = new Hi(r, n);
        if ((Rv(a, o, r, n, i), this._pointerSize && !o.target)) {
          for (
            var s = [], l = this._pointerSize, u = l / 2, f = new J(r - u, n - u, l, l), h = a.length - 1;
            h >= 0;
            h--
          ) {
            var c = a[h];
            c !== i &&
              !c.ignore &&
              !c.ignoreCoarsePointer &&
              (!c.parent || !c.parent.ignoreCoarsePointer) &&
              (tu.copy(c.getBoundingRect()),
              c.transform && tu.applyTransform(c.transform),
              tu.intersect(f) && s.push(c));
          }
          if (s.length)
            for (var v = 4, d = Math.PI / 12, p = Math.PI * 2, m = 0; m < u; m += v)
              for (var g = 0; g < p; g += d) {
                var y = r + m * Math.cos(g),
                  _ = n + m * Math.sin(g);
                if ((Rv(s, o, y, _, i), o.target)) return o;
              }
        }
        return o;
      }),
      (t.prototype.processGesture = function (r, n) {
        this._gestureMgr || (this._gestureMgr = new Eb());
        var i = this._gestureMgr;
        n === "start" && i.clear();
        var a = i.recognize(r, this.findHover(r.zrX, r.zrY, null).target, this.proxy.dom);
        if ((n === "end" && i.clear(), a)) {
          var o = a.type;
          r.gestureEvent = o;
          var s = new Hi();
          ((s.target = a.target), this.dispatchToElement(s, o, a.event));
        }
      }),
      t
    );
  })(nr);
I(["click", "mousedown", "mouseup", "mousewheel", "dblclick", "contextmenu"], function (e) {
  Wm.prototype[e] = function (t) {
    var r = t.zrX,
      n = t.zrY,
      i = Ym(this, r, n),
      a,
      o;
    if (((e !== "mouseup" || !i) && ((a = this.findHover(r, n)), (o = a.target)), e === "mousedown"))
      ((this._downEl = o), (this._downPoint = [t.zrX, t.zrY]), (this._upEl = o));
    else if (e === "mouseup") this._upEl = o;
    else if (e === "click") {
      if (this._downEl !== this._upEl || !this._downPoint || mb(this._downPoint, [t.zrX, t.zrY]) > 4) return;
      this._downPoint = null;
    }
    this.dispatchToElement(a, e, t);
  };
});
function Ub(e, t, r) {
  if (e[e.rectHover ? "rectContain" : "contain"](t, r)) {
    for (var n = e, i = void 0, a = !1; n; ) {
      if ((n.ignoreClip && (a = !0), !a)) {
        var o = n.getClipPath();
        if (o && !o.contain(t, r)) return !1;
      }
      n.silent && (i = !0);
      var s = n.__hostTarget;
      n = s ? (n.ignoreHostSilent ? null : s) : n.parent;
    }
    return i ? Um : !0;
  }
  return !1;
}
function Rv(e, t, r, n, i) {
  for (var a = e.length - 1; a >= 0; a--) {
    var o = e[a],
      s = void 0;
    if (o !== i && !o.ignore && (s = Ub(o, r, n)) && (!t.topTarget && (t.topTarget = o), s !== Um)) {
      t.target = o;
      break;
    }
  }
}
function Ym(e, t, r) {
  var n = e.painter;
  return t < 0 || t > n.getWidth() || r < 0 || r > n.getHeight();
}
var Xm = 32,
  Vi = 7;
function Wb(e) {
  for (var t = 0; e >= Xm; ) ((t |= e & 1), (e >>= 1));
  return e + t;
}
function Ov(e, t, r, n) {
  var i = t + 1;
  if (i === r) return 1;
  if (n(e[i++], e[t]) < 0) {
    for (; i < r && n(e[i], e[i - 1]) < 0; ) i++;
    Yb(e, t, i);
  } else for (; i < r && n(e[i], e[i - 1]) >= 0; ) i++;
  return i - t;
}
function Yb(e, t, r) {
  for (r--; t < r; ) {
    var n = e[t];
    ((e[t++] = e[r]), (e[r--] = n));
  }
}
function kv(e, t, r, n, i) {
  for (n === t && n++; n < r; n++) {
    for (var a = e[n], o = t, s = n, l; o < s; ) ((l = (o + s) >>> 1), i(a, e[l]) < 0 ? (s = l) : (o = l + 1));
    var u = n - o;
    switch (u) {
      case 3:
        e[o + 3] = e[o + 2];
      case 2:
        e[o + 2] = e[o + 1];
      case 1:
        e[o + 1] = e[o];
        break;
      default:
        for (; u > 0; ) ((e[o + u] = e[o + u - 1]), u--);
    }
    e[o] = a;
  }
}
function eu(e, t, r, n, i, a) {
  var o = 0,
    s = 0,
    l = 1;
  if (a(e, t[r + i]) > 0) {
    for (s = n - i; l < s && a(e, t[r + i + l]) > 0; ) ((o = l), (l = (l << 1) + 1), l <= 0 && (l = s));
    (l > s && (l = s), (o += i), (l += i));
  } else {
    for (s = i + 1; l < s && a(e, t[r + i - l]) <= 0; ) ((o = l), (l = (l << 1) + 1), l <= 0 && (l = s));
    l > s && (l = s);
    var u = o;
    ((o = i - l), (l = i - u));
  }
  for (o++; o < l; ) {
    var f = o + ((l - o) >>> 1);
    a(e, t[r + f]) > 0 ? (o = f + 1) : (l = f);
  }
  return l;
}
function ru(e, t, r, n, i, a) {
  var o = 0,
    s = 0,
    l = 1;
  if (a(e, t[r + i]) < 0) {
    for (s = i + 1; l < s && a(e, t[r + i - l]) < 0; ) ((o = l), (l = (l << 1) + 1), l <= 0 && (l = s));
    l > s && (l = s);
    var u = o;
    ((o = i - l), (l = i - u));
  } else {
    for (s = n - i; l < s && a(e, t[r + i + l]) >= 0; ) ((o = l), (l = (l << 1) + 1), l <= 0 && (l = s));
    (l > s && (l = s), (o += i), (l += i));
  }
  for (o++; o < l; ) {
    var f = o + ((l - o) >>> 1);
    a(e, t[r + f]) < 0 ? (l = f) : (o = f + 1);
  }
  return l;
}
function Xb(e, t) {
  var r = Vi,
    n,
    i,
    a = 0,
    o = [];
  ((n = []), (i = []));
  function s(v, d) {
    ((n[a] = v), (i[a] = d), (a += 1));
  }
  function l() {
    for (; a > 1; ) {
      var v = a - 2;
      if ((v >= 1 && i[v - 1] <= i[v] + i[v + 1]) || (v >= 2 && i[v - 2] <= i[v] + i[v - 1]))
        i[v - 1] < i[v + 1] && v--;
      else if (i[v] > i[v + 1]) break;
      f(v);
    }
  }
  function u() {
    for (; a > 1; ) {
      var v = a - 2;
      (v > 0 && i[v - 1] < i[v + 1] && v--, f(v));
    }
  }
  function f(v) {
    var d = n[v],
      p = i[v],
      m = n[v + 1],
      g = i[v + 1];
    ((i[v] = p + g), v === a - 3 && ((n[v + 1] = n[v + 2]), (i[v + 1] = i[v + 2])), a--);
    var y = ru(e[m], e, d, p, 0, t);
    ((d += y),
      (p -= y),
      p !== 0 && ((g = eu(e[d + p - 1], e, m, g, g - 1, t)), g !== 0 && (p <= g ? h(d, p, m, g) : c(d, p, m, g))));
  }
  function h(v, d, p, m) {
    var g = 0;
    for (g = 0; g < d; g++) o[g] = e[v + g];
    var y = 0,
      _ = p,
      S = v;
    if (((e[S++] = e[_++]), --m === 0)) {
      for (g = 0; g < d; g++) e[S + g] = o[y + g];
      return;
    }
    if (d === 1) {
      for (g = 0; g < m; g++) e[S + g] = e[_ + g];
      e[S + m] = o[y];
      return;
    }
    for (var b = r, w, T, C; ; ) {
      ((w = 0), (T = 0), (C = !1));
      do
        if (t(e[_], o[y]) < 0) {
          if (((e[S++] = e[_++]), T++, (w = 0), --m === 0)) {
            C = !0;
            break;
          }
        } else if (((e[S++] = o[y++]), w++, (T = 0), --d === 1)) {
          C = !0;
          break;
        }
      while ((w | T) < b);
      if (C) break;
      do {
        if (((w = ru(e[_], o, y, d, 0, t)), w !== 0)) {
          for (g = 0; g < w; g++) e[S + g] = o[y + g];
          if (((S += w), (y += w), (d -= w), d <= 1)) {
            C = !0;
            break;
          }
        }
        if (((e[S++] = e[_++]), --m === 0)) {
          C = !0;
          break;
        }
        if (((T = eu(o[y], e, _, m, 0, t)), T !== 0)) {
          for (g = 0; g < T; g++) e[S + g] = e[_ + g];
          if (((S += T), (_ += T), (m -= T), m === 0)) {
            C = !0;
            break;
          }
        }
        if (((e[S++] = o[y++]), --d === 1)) {
          C = !0;
          break;
        }
        b--;
      } while (w >= Vi || T >= Vi);
      if (C) break;
      (b < 0 && (b = 0), (b += 2));
    }
    if (((r = b), r < 1 && (r = 1), d === 1)) {
      for (g = 0; g < m; g++) e[S + g] = e[_ + g];
      e[S + m] = o[y];
    } else {
      if (d === 0) throw new Error();
      for (g = 0; g < d; g++) e[S + g] = o[y + g];
    }
  }
  function c(v, d, p, m) {
    var g = 0;
    for (g = 0; g < m; g++) o[g] = e[p + g];
    var y = v + d - 1,
      _ = m - 1,
      S = p + m - 1,
      b = 0,
      w = 0;
    if (((e[S--] = e[y--]), --d === 0)) {
      for (b = S - (m - 1), g = 0; g < m; g++) e[b + g] = o[g];
      return;
    }
    if (m === 1) {
      for (S -= d, y -= d, w = S + 1, b = y + 1, g = d - 1; g >= 0; g--) e[w + g] = e[b + g];
      e[S] = o[_];
      return;
    }
    for (var T = r; ; ) {
      var C = 0,
        A = 0,
        M = !1;
      do
        if (t(o[_], e[y]) < 0) {
          if (((e[S--] = e[y--]), C++, (A = 0), --d === 0)) {
            M = !0;
            break;
          }
        } else if (((e[S--] = o[_--]), A++, (C = 0), --m === 1)) {
          M = !0;
          break;
        }
      while ((C | A) < T);
      if (M) break;
      do {
        if (((C = d - ru(o[_], e, v, d, d - 1, t)), C !== 0)) {
          for (S -= C, y -= C, d -= C, w = S + 1, b = y + 1, g = C - 1; g >= 0; g--) e[w + g] = e[b + g];
          if (d === 0) {
            M = !0;
            break;
          }
        }
        if (((e[S--] = o[_--]), --m === 1)) {
          M = !0;
          break;
        }
        if (((A = m - eu(e[y], o, 0, m, m - 1, t)), A !== 0)) {
          for (S -= A, _ -= A, m -= A, w = S + 1, b = _ + 1, g = 0; g < A; g++) e[w + g] = o[b + g];
          if (m <= 1) {
            M = !0;
            break;
          }
        }
        if (((e[S--] = e[y--]), --d === 0)) {
          M = !0;
          break;
        }
        T--;
      } while (C >= Vi || A >= Vi);
      if (M) break;
      (T < 0 && (T = 0), (T += 2));
    }
    if (((r = T), r < 1 && (r = 1), m === 1)) {
      for (S -= d, y -= d, w = S + 1, b = y + 1, g = d - 1; g >= 0; g--) e[w + g] = e[b + g];
      e[S] = o[_];
    } else {
      if (m === 0) throw new Error();
      for (b = S - (m - 1), g = 0; g < m; g++) e[b + g] = o[g];
    }
  }
  return { mergeRuns: l, forceMergeRuns: u, pushRun: s };
}
function rs(e, t, r, n) {
  (r || (r = 0), n || (n = e.length));
  var i = n - r;
  if (!(i < 2)) {
    var a = 0;
    if (i < Xm) {
      ((a = Ov(e, r, n, t)), kv(e, r, n, r + a, t));
      return;
    }
    var o = Xb(e, t),
      s = Wb(i);
    do {
      if (((a = Ov(e, r, n, t)), a < s)) {
        var l = i;
        (l > s && (l = s), kv(e, r, r + l, r + a, t), (a = l));
      }
      (o.pushRun(r, a), o.mergeRuns(), (i -= a), (r += a));
    } while (i !== 0);
    o.forceMergeRuns();
  }
}
var ie = 1,
  oa = 2,
  ei = 4,
  Bv = !1;
function nu() {
  Bv || ((Bv = !0), console.warn("z / z2 / zlevel of displayable is invalid, which may cause unexpected errors"));
}
function Nv(e, t) {
  return e.zlevel === t.zlevel ? (e.z === t.z ? e.z2 - t.z2 : e.z - t.z) : e.zlevel - t.zlevel;
}
var $b = (function () {
    function e() {
      ((this._roots = []), (this._displayList = []), (this._displayListLen = 0), (this.displayableSortFunc = Nv));
    }
    return (
      (e.prototype.traverse = function (t, r) {
        for (var n = 0; n < this._roots.length; n++) this._roots[n].traverse(t, r);
      }),
      (e.prototype.getDisplayList = function (t, r) {
        r = r || !1;
        var n = this._displayList;
        return ((t || !n.length) && this.updateDisplayList(r), n);
      }),
      (e.prototype.updateDisplayList = function (t) {
        this._displayListLen = 0;
        for (var r = this._roots, n = this._displayList, i = 0, a = r.length; i < a; i++)
          this._updateAndAddDisplayable(r[i], null, t);
        ((n.length = this._displayListLen), rs(n, Nv));
      }),
      (e.prototype._updateAndAddDisplayable = function (t, r, n) {
        if (!(t.ignore && !n)) {
          (t.beforeUpdate(), t.update(), t.afterUpdate());
          var i = t.getClipPath(),
            a = r && r.length,
            o = 0,
            s = t.__clipPaths;
          if (!t.ignoreClip && (a || i)) {
            if ((s || (s = t.__clipPaths = []), a)) for (var l = 0; l < r.length; l++) s[o++] = r[l];
            for (var u = i, f = t; u; )
              ((u.parent = f), u.updateTransform(), (s[o++] = u), (f = u), (u = u.getClipPath()));
          }
          if ((s && (s.length = o), t.childrenRef)) {
            for (var h = t.childrenRef(), c = 0; c < h.length; c++) {
              var v = h[c];
              (t.__dirty && (v.__dirty |= ie), this._updateAndAddDisplayable(v, s, n));
            }
            t.__dirty = 0;
          } else {
            var d = t;
            (isNaN(d.z) && (nu(), (d.z = 0)),
              isNaN(d.z2) && (nu(), (d.z2 = 0)),
              isNaN(d.zlevel) && (nu(), (d.zlevel = 0)),
              (this._displayList[this._displayListLen++] = d));
          }
          var p = t.getDecalElement && t.getDecalElement();
          p && this._updateAndAddDisplayable(p, s, n);
          var m = t.getTextGuideLine();
          m && this._updateAndAddDisplayable(m, s, n);
          var g = t.getTextContent();
          g && this._updateAndAddDisplayable(g, s, n);
        }
      }),
      (e.prototype.addRoot = function (t) {
        (t.__zr && t.__zr.storage === this) || this._roots.push(t);
      }),
      (e.prototype.delRoot = function (t) {
        if (t instanceof Array) {
          for (var r = 0, n = t.length; r < n; r++) this.delRoot(t[r]);
          return;
        }
        var i = vt(this._roots, t);
        i >= 0 && this._roots.splice(i, 1);
      }),
      (e.prototype.delAllRoots = function () {
        ((this._roots = []), (this._displayList = []), (this._displayListLen = 0));
      }),
      (e.prototype.getRoots = function () {
        return this._roots;
      }),
      (e.prototype.dispose = function () {
        ((this._displayList = null), (this._roots = null));
      }),
      e
    );
  })(),
  xs;
xs =
  (nt.hasGlobalWindow &&
    ((window.requestAnimationFrame && window.requestAnimationFrame.bind(window)) ||
      (window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window)) ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame)) ||
  function (e) {
    return setTimeout(e, 16);
  };
var pa = {
    linear: function (e) {
      return e;
    },
    quadraticIn: function (e) {
      return e * e;
    },
    quadraticOut: function (e) {
      return e * (2 - e);
    },
    quadraticInOut: function (e) {
      return (e *= 2) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1);
    },
    cubicIn: function (e) {
      return e * e * e;
    },
    cubicOut: function (e) {
      return --e * e * e + 1;
    },
    cubicInOut: function (e) {
      return (e *= 2) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2);
    },
    quarticIn: function (e) {
      return e * e * e * e;
    },
    quarticOut: function (e) {
      return 1 - --e * e * e * e;
    },
    quarticInOut: function (e) {
      return (e *= 2) < 1 ? 0.5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2);
    },
    quinticIn: function (e) {
      return e * e * e * e * e;
    },
    quinticOut: function (e) {
      return --e * e * e * e * e + 1;
    },
    quinticInOut: function (e) {
      return (e *= 2) < 1 ? 0.5 * e * e * e * e * e : 0.5 * ((e -= 2) * e * e * e * e + 2);
    },
    sinusoidalIn: function (e) {
      return 1 - Math.cos((e * Math.PI) / 2);
    },
    sinusoidalOut: function (e) {
      return Math.sin((e * Math.PI) / 2);
    },
    sinusoidalInOut: function (e) {
      return 0.5 * (1 - Math.cos(Math.PI * e));
    },
    exponentialIn: function (e) {
      return e === 0 ? 0 : Math.pow(1024, e - 1);
    },
    exponentialOut: function (e) {
      return e === 1 ? 1 : 1 - Math.pow(2, -10 * e);
    },
    exponentialInOut: function (e) {
      return e === 0
        ? 0
        : e === 1
          ? 1
          : (e *= 2) < 1
            ? 0.5 * Math.pow(1024, e - 1)
            : 0.5 * (-Math.pow(2, -10 * (e - 1)) + 2);
    },
    circularIn: function (e) {
      return 1 - Math.sqrt(1 - e * e);
    },
    circularOut: function (e) {
      return Math.sqrt(1 - --e * e);
    },
    circularInOut: function (e) {
      return (e *= 2) < 1 ? -0.5 * (Math.sqrt(1 - e * e) - 1) : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1);
    },
    elasticIn: function (e) {
      var t,
        r = 0.1,
        n = 0.4;
      return e === 0
        ? 0
        : e === 1
          ? 1
          : (!r || r < 1 ? ((r = 1), (t = n / 4)) : (t = (n * Math.asin(1 / r)) / (2 * Math.PI)),
            -(r * Math.pow(2, 10 * (e -= 1)) * Math.sin(((e - t) * (2 * Math.PI)) / n)));
    },
    elasticOut: function (e) {
      var t,
        r = 0.1,
        n = 0.4;
      return e === 0
        ? 0
        : e === 1
          ? 1
          : (!r || r < 1 ? ((r = 1), (t = n / 4)) : (t = (n * Math.asin(1 / r)) / (2 * Math.PI)),
            r * Math.pow(2, -10 * e) * Math.sin(((e - t) * (2 * Math.PI)) / n) + 1);
    },
    elasticInOut: function (e) {
      var t,
        r = 0.1,
        n = 0.4;
      return e === 0
        ? 0
        : e === 1
          ? 1
          : (!r || r < 1 ? ((r = 1), (t = n / 4)) : (t = (n * Math.asin(1 / r)) / (2 * Math.PI)),
            (e *= 2) < 1
              ? -0.5 * (r * Math.pow(2, 10 * (e -= 1)) * Math.sin(((e - t) * (2 * Math.PI)) / n))
              : r * Math.pow(2, -10 * (e -= 1)) * Math.sin(((e - t) * (2 * Math.PI)) / n) * 0.5 + 1);
    },
    backIn: function (e) {
      var t = 1.70158;
      return e * e * ((t + 1) * e - t);
    },
    backOut: function (e) {
      var t = 1.70158;
      return --e * e * ((t + 1) * e + t) + 1;
    },
    backInOut: function (e) {
      var t = 2.5949095;
      return (e *= 2) < 1 ? 0.5 * (e * e * ((t + 1) * e - t)) : 0.5 * ((e -= 2) * e * ((t + 1) * e + t) + 2);
    },
    bounceIn: function (e) {
      return 1 - pa.bounceOut(1 - e);
    },
    bounceOut: function (e) {
      return e < 1 / 2.75
        ? 7.5625 * e * e
        : e < 2 / 2.75
          ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75
          : e < 2.5 / 2.75
            ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375
            : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
    },
    bounceInOut: function (e) {
      return e < 0.5 ? pa.bounceIn(e * 2) * 0.5 : pa.bounceOut(e * 2 - 1) * 0.5 + 0.5;
    },
  },
  ao = Math.pow,
  Rr = Math.sqrt,
  Cs = 1e-8,
  $m = 1e-4,
  Fv = Rr(3),
  oo = 1 / 3,
  Ye = Ii(),
  Se = Ii(),
  hi = Ii();
function Lr(e) {
  return e > -Cs && e < Cs;
}
function Zm(e) {
  return e > Cs || e < -Cs;
}
function Nt(e, t, r, n, i) {
  var a = 1 - i;
  return a * a * (a * e + 3 * i * t) + i * i * (i * n + 3 * a * r);
}
function zv(e, t, r, n, i) {
  var a = 1 - i;
  return 3 * (((t - e) * a + 2 * (r - t) * i) * a + (n - r) * i * i);
}
function Ds(e, t, r, n, i, a) {
  var o = n + 3 * (t - r) - e,
    s = 3 * (r - t * 2 + e),
    l = 3 * (t - e),
    u = e - i,
    f = s * s - 3 * o * l,
    h = s * l - 9 * o * u,
    c = l * l - 3 * s * u,
    v = 0;
  if (Lr(f) && Lr(h))
    if (Lr(s)) a[0] = 0;
    else {
      var d = -l / s;
      d >= 0 && d <= 1 && (a[v++] = d);
    }
  else {
    var p = h * h - 4 * f * c;
    if (Lr(p)) {
      var m = h / f,
        d = -s / o + m,
        g = -m / 2;
      (d >= 0 && d <= 1 && (a[v++] = d), g >= 0 && g <= 1 && (a[v++] = g));
    } else if (p > 0) {
      var y = Rr(p),
        _ = f * s + 1.5 * o * (-h + y),
        S = f * s + 1.5 * o * (-h - y);
      (_ < 0 ? (_ = -ao(-_, oo)) : (_ = ao(_, oo)), S < 0 ? (S = -ao(-S, oo)) : (S = ao(S, oo)));
      var d = (-s - (_ + S)) / (3 * o);
      d >= 0 && d <= 1 && (a[v++] = d);
    } else {
      var b = (2 * f * s - 3 * o * h) / (2 * Rr(f * f * f)),
        w = Math.acos(b) / 3,
        T = Rr(f),
        C = Math.cos(w),
        d = (-s - 2 * T * C) / (3 * o),
        g = (-s + T * (C + Fv * Math.sin(w))) / (3 * o),
        A = (-s + T * (C - Fv * Math.sin(w))) / (3 * o);
      (d >= 0 && d <= 1 && (a[v++] = d), g >= 0 && g <= 1 && (a[v++] = g), A >= 0 && A <= 1 && (a[v++] = A));
    }
  }
  return v;
}
function qm(e, t, r, n, i) {
  var a = 6 * r - 12 * t + 6 * e,
    o = 9 * t + 3 * n - 3 * e - 9 * r,
    s = 3 * t - 3 * e,
    l = 0;
  if (Lr(o)) {
    if (Zm(a)) {
      var u = -s / a;
      u >= 0 && u <= 1 && (i[l++] = u);
    }
  } else {
    var f = a * a - 4 * o * s;
    if (Lr(f)) i[0] = -a / (2 * o);
    else if (f > 0) {
      var h = Rr(f),
        u = (-a + h) / (2 * o),
        c = (-a - h) / (2 * o);
      (u >= 0 && u <= 1 && (i[l++] = u), c >= 0 && c <= 1 && (i[l++] = c));
    }
  }
  return l;
}
function As(e, t, r, n, i, a) {
  var o = (t - e) * i + e,
    s = (r - t) * i + t,
    l = (n - r) * i + r,
    u = (s - o) * i + o,
    f = (l - s) * i + s,
    h = (f - u) * i + u;
  ((a[0] = e), (a[1] = o), (a[2] = u), (a[3] = h), (a[4] = h), (a[5] = f), (a[6] = l), (a[7] = n));
}
function Zb(e, t, r, n, i, a, o, s, l, u, f) {
  var h,
    c = 0.005,
    v = 1 / 0,
    d,
    p,
    m,
    g;
  ((Ye[0] = l), (Ye[1] = u));
  for (var y = 0; y < 1; y += 0.05)
    ((Se[0] = Nt(e, r, i, o, y)), (Se[1] = Nt(t, n, a, s, y)), (m = fi(Ye, Se)), m < v && ((h = y), (v = m)));
  v = 1 / 0;
  for (var _ = 0; _ < 32 && !(c < $m); _++)
    ((d = h - c),
      (p = h + c),
      (Se[0] = Nt(e, r, i, o, d)),
      (Se[1] = Nt(t, n, a, s, d)),
      (m = fi(Se, Ye)),
      d >= 0 && m < v
        ? ((h = d), (v = m))
        : ((hi[0] = Nt(e, r, i, o, p)),
          (hi[1] = Nt(t, n, a, s, p)),
          (g = fi(hi, Ye)),
          p <= 1 && g < v ? ((h = p), (v = g)) : (c *= 0.5)));
  return Rr(v);
}
function qb(e, t, r, n, i, a, o, s, l) {
  for (var u = e, f = t, h = 0, c = 1 / l, v = 1; v <= l; v++) {
    var d = v * c,
      p = Nt(e, r, i, o, d),
      m = Nt(t, n, a, s, d),
      g = p - u,
      y = m - f;
    ((h += Math.sqrt(g * g + y * y)), (u = p), (f = m));
  }
  return h;
}
function re(e, t, r, n) {
  var i = 1 - n;
  return i * (i * e + 2 * n * t) + n * n * r;
}
function Hv(e, t, r, n) {
  return 2 * ((1 - n) * (t - e) + n * (r - t));
}
function Kb(e, t, r, n, i) {
  var a = e - 2 * t + r,
    o = 2 * (t - e),
    s = e - n,
    l = 0;
  if (Lr(a)) {
    if (Zm(o)) {
      var u = -s / o;
      u >= 0 && u <= 1 && (i[l++] = u);
    }
  } else {
    var f = o * o - 4 * a * s;
    if (Lr(f)) {
      var u = -o / (2 * a);
      u >= 0 && u <= 1 && (i[l++] = u);
    } else if (f > 0) {
      var h = Rr(f),
        u = (-o + h) / (2 * a),
        c = (-o - h) / (2 * a);
      (u >= 0 && u <= 1 && (i[l++] = u), c >= 0 && c <= 1 && (i[l++] = c));
    }
  }
  return l;
}
function Km(e, t, r) {
  var n = e + r - 2 * t;
  return n === 0 ? 0.5 : (e - t) / n;
}
function Ms(e, t, r, n, i) {
  var a = (t - e) * n + e,
    o = (r - t) * n + t,
    s = (o - a) * n + a;
  ((i[0] = e), (i[1] = a), (i[2] = s), (i[3] = s), (i[4] = o), (i[5] = r));
}
function Qb(e, t, r, n, i, a, o, s, l) {
  var u,
    f = 0.005,
    h = 1 / 0;
  ((Ye[0] = o), (Ye[1] = s));
  for (var c = 0; c < 1; c += 0.05) {
    ((Se[0] = re(e, r, i, c)), (Se[1] = re(t, n, a, c)));
    var v = fi(Ye, Se);
    v < h && ((u = c), (h = v));
  }
  h = 1 / 0;
  for (var d = 0; d < 32 && !(f < $m); d++) {
    var p = u - f,
      m = u + f;
    ((Se[0] = re(e, r, i, p)), (Se[1] = re(t, n, a, p)));
    var v = fi(Se, Ye);
    if (p >= 0 && v < h) ((u = p), (h = v));
    else {
      ((hi[0] = re(e, r, i, m)), (hi[1] = re(t, n, a, m)));
      var g = fi(hi, Ye);
      m <= 1 && g < h ? ((u = m), (h = g)) : (f *= 0.5);
    }
  }
  return Rr(h);
}
function jb(e, t, r, n, i, a, o) {
  for (var s = e, l = t, u = 0, f = 1 / o, h = 1; h <= o; h++) {
    var c = h * f,
      v = re(e, r, i, c),
      d = re(t, n, a, c),
      p = v - s,
      m = d - l;
    ((u += Math.sqrt(p * p + m * m)), (s = v), (l = d));
  }
  return u;
}
var Jb = /cubic-bezier\(([0-9,\.e ]+)\)/;
function Qm(e) {
  var t = e && Jb.exec(e);
  if (t) {
    var r = t[1].split(","),
      n = +Xe(r[0]),
      i = +Xe(r[1]),
      a = +Xe(r[2]),
      o = +Xe(r[3]);
    if (isNaN(n + i + a + o)) return;
    var s = [];
    return function (l) {
      return l <= 0 ? 0 : l >= 1 ? 1 : Ds(0, n, a, 1, l, s) && Nt(0, i, o, 1, s[0]);
    };
  }
}
var tw = (function () {
    function e(t) {
      ((this._inited = !1),
        (this._startTime = 0),
        (this._pausedTime = 0),
        (this._paused = !1),
        (this._life = t.life || 1e3),
        (this._delay = t.delay || 0),
        (this.loop = t.loop || !1),
        (this.onframe = t.onframe || Gt),
        (this.ondestroy = t.ondestroy || Gt),
        (this.onrestart = t.onrestart || Gt),
        t.easing && this.setEasing(t.easing));
    }
    return (
      (e.prototype.step = function (t, r) {
        if ((this._inited || ((this._startTime = t + this._delay), (this._inited = !0)), this._paused)) {
          this._pausedTime += r;
          return;
        }
        var n = this._life,
          i = t - this._startTime - this._pausedTime,
          a = i / n;
        (a < 0 && (a = 0), (a = Math.min(a, 1)));
        var o = this.easingFunc,
          s = o ? o(a) : a;
        if ((this.onframe(s), a === 1))
          if (this.loop) {
            var l = i % n;
            ((this._startTime = t - l), (this._pausedTime = 0), this.onrestart());
          } else return !0;
        return !1;
      }),
      (e.prototype.pause = function () {
        this._paused = !0;
      }),
      (e.prototype.resume = function () {
        this._paused = !1;
      }),
      (e.prototype.setEasing = function (t) {
        ((this.easing = t), (this.easingFunc = et(t) ? t : pa[t] || Qm(t)));
      }),
      e
    );
  })(),
  jm = (function () {
    function e(t) {
      this.value = t;
    }
    return e;
  })(),
  ew = (function () {
    function e() {
      this._len = 0;
    }
    return (
      (e.prototype.insert = function (t) {
        var r = new jm(t);
        return (this.insertEntry(r), r);
      }),
      (e.prototype.insertEntry = function (t) {
        (this.head
          ? ((this.tail.next = t), (t.prev = this.tail), (t.next = null), (this.tail = t))
          : (this.head = this.tail = t),
          this._len++);
      }),
      (e.prototype.remove = function (t) {
        var r = t.prev,
          n = t.next;
        (r ? (r.next = n) : (this.head = n), n ? (n.prev = r) : (this.tail = r), (t.next = t.prev = null), this._len--);
      }),
      (e.prototype.len = function () {
        return this._len;
      }),
      (e.prototype.clear = function () {
        ((this.head = this.tail = null), (this._len = 0));
      }),
      e
    );
  })(),
  mi = (function () {
    function e(t) {
      ((this._list = new ew()), (this._maxSize = 10), (this._map = {}), (this._maxSize = t));
    }
    return (
      (e.prototype.put = function (t, r) {
        var n = this._list,
          i = this._map,
          a = null;
        if (i[t] == null) {
          var o = n.len(),
            s = this._lastRemovedEntry;
          if (o >= this._maxSize && o > 0) {
            var l = n.head;
            (n.remove(l), delete i[l.key], (a = l.value), (this._lastRemovedEntry = l));
          }
          (s ? (s.value = r) : (s = new jm(r)), (s.key = t), n.insertEntry(s), (i[t] = s));
        }
        return a;
      }),
      (e.prototype.get = function (t) {
        var r = this._map[t],
          n = this._list;
        if (r != null) return (r !== n.tail && (n.remove(r), n.insertEntry(r)), r.value);
      }),
      (e.prototype.clear = function () {
        (this._list.clear(), (this._map = {}));
      }),
      (e.prototype.len = function () {
        return this._list.len();
      }),
      e
    );
  })(),
  Vv = {
    transparent: [0, 0, 0, 0],
    aliceblue: [240, 248, 255, 1],
    antiquewhite: [250, 235, 215, 1],
    aqua: [0, 255, 255, 1],
    aquamarine: [127, 255, 212, 1],
    azure: [240, 255, 255, 1],
    beige: [245, 245, 220, 1],
    bisque: [255, 228, 196, 1],
    black: [0, 0, 0, 1],
    blanchedalmond: [255, 235, 205, 1],
    blue: [0, 0, 255, 1],
    blueviolet: [138, 43, 226, 1],
    brown: [165, 42, 42, 1],
    burlywood: [222, 184, 135, 1],
    cadetblue: [95, 158, 160, 1],
    chartreuse: [127, 255, 0, 1],
    chocolate: [210, 105, 30, 1],
    coral: [255, 127, 80, 1],
    cornflowerblue: [100, 149, 237, 1],
    cornsilk: [255, 248, 220, 1],
    crimson: [220, 20, 60, 1],
    cyan: [0, 255, 255, 1],
    darkblue: [0, 0, 139, 1],
    darkcyan: [0, 139, 139, 1],
    darkgoldenrod: [184, 134, 11, 1],
    darkgray: [169, 169, 169, 1],
    darkgreen: [0, 100, 0, 1],
    darkgrey: [169, 169, 169, 1],
    darkkhaki: [189, 183, 107, 1],
    darkmagenta: [139, 0, 139, 1],
    darkolivegreen: [85, 107, 47, 1],
    darkorange: [255, 140, 0, 1],
    darkorchid: [153, 50, 204, 1],
    darkred: [139, 0, 0, 1],
    darksalmon: [233, 150, 122, 1],
    darkseagreen: [143, 188, 143, 1],
    darkslateblue: [72, 61, 139, 1],
    darkslategray: [47, 79, 79, 1],
    darkslategrey: [47, 79, 79, 1],
    darkturquoise: [0, 206, 209, 1],
    darkviolet: [148, 0, 211, 1],
    deeppink: [255, 20, 147, 1],
    deepskyblue: [0, 191, 255, 1],
    dimgray: [105, 105, 105, 1],
    dimgrey: [105, 105, 105, 1],
    dodgerblue: [30, 144, 255, 1],
    firebrick: [178, 34, 34, 1],
    floralwhite: [255, 250, 240, 1],
    forestgreen: [34, 139, 34, 1],
    fuchsia: [255, 0, 255, 1],
    gainsboro: [220, 220, 220, 1],
    ghostwhite: [248, 248, 255, 1],
    gold: [255, 215, 0, 1],
    goldenrod: [218, 165, 32, 1],
    gray: [128, 128, 128, 1],
    green: [0, 128, 0, 1],
    greenyellow: [173, 255, 47, 1],
    grey: [128, 128, 128, 1],
    honeydew: [240, 255, 240, 1],
    hotpink: [255, 105, 180, 1],
    indianred: [205, 92, 92, 1],
    indigo: [75, 0, 130, 1],
    ivory: [255, 255, 240, 1],
    khaki: [240, 230, 140, 1],
    lavender: [230, 230, 250, 1],
    lavenderblush: [255, 240, 245, 1],
    lawngreen: [124, 252, 0, 1],
    lemonchiffon: [255, 250, 205, 1],
    lightblue: [173, 216, 230, 1],
    lightcoral: [240, 128, 128, 1],
    lightcyan: [224, 255, 255, 1],
    lightgoldenrodyellow: [250, 250, 210, 1],
    lightgray: [211, 211, 211, 1],
    lightgreen: [144, 238, 144, 1],
    lightgrey: [211, 211, 211, 1],
    lightpink: [255, 182, 193, 1],
    lightsalmon: [255, 160, 122, 1],
    lightseagreen: [32, 178, 170, 1],
    lightskyblue: [135, 206, 250, 1],
    lightslategray: [119, 136, 153, 1],
    lightslategrey: [119, 136, 153, 1],
    lightsteelblue: [176, 196, 222, 1],
    lightyellow: [255, 255, 224, 1],
    lime: [0, 255, 0, 1],
    limegreen: [50, 205, 50, 1],
    linen: [250, 240, 230, 1],
    magenta: [255, 0, 255, 1],
    maroon: [128, 0, 0, 1],
    mediumaquamarine: [102, 205, 170, 1],
    mediumblue: [0, 0, 205, 1],
    mediumorchid: [186, 85, 211, 1],
    mediumpurple: [147, 112, 219, 1],
    mediumseagreen: [60, 179, 113, 1],
    mediumslateblue: [123, 104, 238, 1],
    mediumspringgreen: [0, 250, 154, 1],
    mediumturquoise: [72, 209, 204, 1],
    mediumvioletred: [199, 21, 133, 1],
    midnightblue: [25, 25, 112, 1],
    mintcream: [245, 255, 250, 1],
    mistyrose: [255, 228, 225, 1],
    moccasin: [255, 228, 181, 1],
    navajowhite: [255, 222, 173, 1],
    navy: [0, 0, 128, 1],
    oldlace: [253, 245, 230, 1],
    olive: [128, 128, 0, 1],
    olivedrab: [107, 142, 35, 1],
    orange: [255, 165, 0, 1],
    orangered: [255, 69, 0, 1],
    orchid: [218, 112, 214, 1],
    palegoldenrod: [238, 232, 170, 1],
    palegreen: [152, 251, 152, 1],
    paleturquoise: [175, 238, 238, 1],
    palevioletred: [219, 112, 147, 1],
    papayawhip: [255, 239, 213, 1],
    peachpuff: [255, 218, 185, 1],
    peru: [205, 133, 63, 1],
    pink: [255, 192, 203, 1],
    plum: [221, 160, 221, 1],
    powderblue: [176, 224, 230, 1],
    purple: [128, 0, 128, 1],
    red: [255, 0, 0, 1],
    rosybrown: [188, 143, 143, 1],
    royalblue: [65, 105, 225, 1],
    saddlebrown: [139, 69, 19, 1],
    salmon: [250, 128, 114, 1],
    sandybrown: [244, 164, 96, 1],
    seagreen: [46, 139, 87, 1],
    seashell: [255, 245, 238, 1],
    sienna: [160, 82, 45, 1],
    silver: [192, 192, 192, 1],
    skyblue: [135, 206, 235, 1],
    slateblue: [106, 90, 205, 1],
    slategray: [112, 128, 144, 1],
    slategrey: [112, 128, 144, 1],
    snow: [255, 250, 250, 1],
    springgreen: [0, 255, 127, 1],
    steelblue: [70, 130, 180, 1],
    tan: [210, 180, 140, 1],
    teal: [0, 128, 128, 1],
    thistle: [216, 191, 216, 1],
    tomato: [255, 99, 71, 1],
    turquoise: [64, 224, 208, 1],
    violet: [238, 130, 238, 1],
    wheat: [245, 222, 179, 1],
    white: [255, 255, 255, 1],
    whitesmoke: [245, 245, 245, 1],
    yellow: [255, 255, 0, 1],
    yellowgreen: [154, 205, 50, 1],
  };
function Or(e) {
  return ((e = Math.round(e)), e < 0 ? 0 : e > 255 ? 255 : e);
}
function Ef(e) {
  return e < 0 ? 0 : e > 1 ? 1 : e;
}
function iu(e) {
  var t = e;
  return t.length && t.charAt(t.length - 1) === "%" ? Or((parseFloat(t) / 100) * 255) : Or(parseInt(t, 10));
}
function Dn(e) {
  var t = e;
  return t.length && t.charAt(t.length - 1) === "%" ? Ef(parseFloat(t) / 100) : Ef(parseFloat(t));
}
function au(e, t, r) {
  return (
    r < 0 ? (r += 1) : r > 1 && (r -= 1),
    r * 6 < 1 ? e + (t - e) * r * 6 : r * 2 < 1 ? t : r * 3 < 2 ? e + (t - e) * (2 / 3 - r) * 6 : e
  );
}
function so(e, t, r) {
  return e + (t - e) * r;
}
function pe(e, t, r, n, i) {
  return ((e[0] = t), (e[1] = r), (e[2] = n), (e[3] = i), e);
}
function Rf(e, t) {
  return ((e[0] = t[0]), (e[1] = t[1]), (e[2] = t[2]), (e[3] = t[3]), e);
}
var Jm = new mi(20),
  lo = null;
function Hn(e, t) {
  (lo && Rf(lo, t), (lo = Jm.put(e, lo || t.slice())));
}
function qe(e, t) {
  if (e) {
    t = t || [];
    var r = Jm.get(e);
    if (r) return Rf(t, r);
    e = e + "";
    var n = e.replace(/ /g, "").toLowerCase();
    if (n in Vv) return (Rf(t, Vv[n]), Hn(e, t), t);
    var i = n.length;
    if (n.charAt(0) === "#") {
      if (i === 4 || i === 5) {
        var a = parseInt(n.slice(1, 4), 16);
        if (!(a >= 0 && a <= 4095)) {
          pe(t, 0, 0, 0, 1);
          return;
        }
        return (
          pe(
            t,
            ((a & 3840) >> 4) | ((a & 3840) >> 8),
            (a & 240) | ((a & 240) >> 4),
            (a & 15) | ((a & 15) << 4),
            i === 5 ? parseInt(n.slice(4), 16) / 15 : 1,
          ),
          Hn(e, t),
          t
        );
      } else if (i === 7 || i === 9) {
        var a = parseInt(n.slice(1, 7), 16);
        if (!(a >= 0 && a <= 16777215)) {
          pe(t, 0, 0, 0, 1);
          return;
        }
        return (
          pe(t, (a & 16711680) >> 16, (a & 65280) >> 8, a & 255, i === 9 ? parseInt(n.slice(7), 16) / 255 : 1),
          Hn(e, t),
          t
        );
      }
      return;
    }
    var o = n.indexOf("("),
      s = n.indexOf(")");
    if (o !== -1 && s + 1 === i) {
      var l = n.substr(0, o),
        u = n.substr(o + 1, s - (o + 1)).split(","),
        f = 1;
      switch (l) {
        case "rgba":
          if (u.length !== 4) return u.length === 3 ? pe(t, +u[0], +u[1], +u[2], 1) : pe(t, 0, 0, 0, 1);
          f = Dn(u.pop());
        case "rgb":
          if (u.length >= 3) return (pe(t, iu(u[0]), iu(u[1]), iu(u[2]), u.length === 3 ? f : Dn(u[3])), Hn(e, t), t);
          pe(t, 0, 0, 0, 1);
          return;
        case "hsla":
          if (u.length !== 4) {
            pe(t, 0, 0, 0, 1);
            return;
          }
          return ((u[3] = Dn(u[3])), Of(u, t), Hn(e, t), t);
        case "hsl":
          if (u.length !== 3) {
            pe(t, 0, 0, 0, 1);
            return;
          }
          return (Of(u, t), Hn(e, t), t);
        default:
          return;
      }
    }
    pe(t, 0, 0, 0, 1);
  }
}
function Of(e, t) {
  var r = (((parseFloat(e[0]) % 360) + 360) % 360) / 360,
    n = Dn(e[1]),
    i = Dn(e[2]),
    a = i <= 0.5 ? i * (n + 1) : i + n - i * n,
    o = i * 2 - a;
  return (
    (t = t || []),
    pe(t, Or(au(o, a, r + 1 / 3) * 255), Or(au(o, a, r) * 255), Or(au(o, a, r - 1 / 3) * 255), 1),
    e.length === 4 && (t[3] = e[3]),
    t
  );
}
function rw(e) {
  if (e) {
    var t = e[0] / 255,
      r = e[1] / 255,
      n = e[2] / 255,
      i = Math.min(t, r, n),
      a = Math.max(t, r, n),
      o = a - i,
      s = (a + i) / 2,
      l,
      u;
    if (o === 0) ((l = 0), (u = 0));
    else {
      s < 0.5 ? (u = o / (a + i)) : (u = o / (2 - a - i));
      var f = ((a - t) / 6 + o / 2) / o,
        h = ((a - r) / 6 + o / 2) / o,
        c = ((a - n) / 6 + o / 2) / o;
      (t === a ? (l = c - h) : r === a ? (l = 1 / 3 + f - c) : n === a && (l = 2 / 3 + h - f),
        l < 0 && (l += 1),
        l > 1 && (l -= 1));
    }
    var v = [l * 360, u, s];
    return (e[3] != null && v.push(e[3]), v);
  }
}
function Gv(e, t) {
  var r = qe(e);
  if (r) {
    for (var n = 0; n < 3; n++) ((r[n] = (r[n] * (1 - t)) | 0), r[n] > 255 ? (r[n] = 255) : r[n] < 0 && (r[n] = 0));
    return Xa(r, r.length === 4 ? "rgba" : "rgb");
  }
}
function nw(e, t, r) {
  if (!(!(t && t.length) || !(e >= 0 && e <= 1))) {
    var n = e * (t.length - 1),
      i = Math.floor(n),
      a = Math.ceil(n),
      o = qe(t[i]),
      s = qe(t[a]),
      l = n - i,
      u = Xa([Or(so(o[0], s[0], l)), Or(so(o[1], s[1], l)), Or(so(o[2], s[2], l)), Ef(so(o[3], s[3], l))], "rgba");
    return r ? { color: u, leftIndex: i, rightIndex: a, value: n } : u;
  }
}
function kf(e, t, r, n) {
  var i = qe(e);
  if (e)
    return (
      (i = rw(i)),
      r != null && (i[1] = Dn(et(r) ? r(i[1]) : r)),
      n != null && (i[2] = Dn(et(n) ? n(i[2]) : n)),
      Xa(Of(i), "rgba")
    );
}
function Xa(e, t) {
  if (!(!e || !e.length)) {
    var r = e[0] + "," + e[1] + "," + e[2];
    return ((t === "rgba" || t === "hsva" || t === "hsla") && (r += "," + e[3]), t + "(" + r + ")");
  }
}
function Is(e, t) {
  var r = qe(e);
  return r ? ((0.299 * r[0] + 0.587 * r[1] + 0.114 * r[2]) * r[3]) / 255 + (1 - r[3]) * t : 0;
}
var Uv = new mi(100);
function Wv(e) {
  if (Y(e)) {
    var t = Uv.get(e);
    return (t || ((t = Gv(e, -0.1)), Uv.put(e, t)), t);
  } else if (ll(e)) {
    var r = N({}, e);
    return (
      (r.colorStops = j(e.colorStops, function (n) {
        return { offset: n.offset, color: Gv(n.color, -0.1) };
      })),
      r
    );
  }
  return e;
}
function iw(e) {
  return e.type === "linear";
}
function aw(e) {
  return e.type === "radial";
}
(function () {
  return typeof Hl < "u" && typeof Hl.from == "function"
    ? function (e) {
        return Hl.from(e).toString("base64");
      }
    : typeof btoa == "function" && typeof unescape == "function" && typeof encodeURIComponent == "function"
      ? function (e) {
          return btoa(unescape(encodeURIComponent(e)));
        }
      : function (e) {
          return null;
        };
})();
var Bf = Array.prototype.slice;
function ur(e, t, r) {
  return (t - e) * r + e;
}
function ou(e, t, r, n) {
  for (var i = t.length, a = 0; a < i; a++) e[a] = ur(t[a], r[a], n);
  return e;
}
function ow(e, t, r, n) {
  for (var i = t.length, a = i && t[0].length, o = 0; o < i; o++) {
    e[o] || (e[o] = []);
    for (var s = 0; s < a; s++) e[o][s] = ur(t[o][s], r[o][s], n);
  }
  return e;
}
function uo(e, t, r, n) {
  for (var i = t.length, a = 0; a < i; a++) e[a] = t[a] + r[a] * n;
  return e;
}
function Yv(e, t, r, n) {
  for (var i = t.length, a = i && t[0].length, o = 0; o < i; o++) {
    e[o] || (e[o] = []);
    for (var s = 0; s < a; s++) e[o][s] = t[o][s] + r[o][s] * n;
  }
  return e;
}
function sw(e, t) {
  for (
    var r = e.length,
      n = t.length,
      i = r > n ? t : e,
      a = Math.min(r, n),
      o = i[a - 1] || { color: [0, 0, 0, 0], offset: 0 },
      s = a;
    s < Math.max(r, n);
    s++
  )
    i.push({ offset: o.offset, color: o.color.slice() });
}
function lw(e, t, r) {
  var n = e,
    i = t;
  if (!(!n.push || !i.push)) {
    var a = n.length,
      o = i.length;
    if (a !== o) {
      var s = a > o;
      if (s) n.length = o;
      else for (var l = a; l < o; l++) n.push(r === 1 ? i[l] : Bf.call(i[l]));
    }
    for (var u = n[0] && n[0].length, l = 0; l < n.length; l++)
      if (r === 1) isNaN(n[l]) && (n[l] = i[l]);
      else for (var f = 0; f < u; f++) isNaN(n[l][f]) && (n[l][f] = i[l][f]);
  }
}
function ns(e) {
  if (ae(e)) {
    var t = e.length;
    if (ae(e[0])) {
      for (var r = [], n = 0; n < t; n++) r.push(Bf.call(e[n]));
      return r;
    }
    return Bf.call(e);
  }
  return e;
}
function is(e) {
  return (
    (e[0] = Math.floor(e[0]) || 0),
    (e[1] = Math.floor(e[1]) || 0),
    (e[2] = Math.floor(e[2]) || 0),
    (e[3] = e[3] == null ? 1 : e[3]),
    "rgba(" + e.join(",") + ")"
  );
}
function uw(e) {
  return ae(e && e[0]) ? 2 : 1;
}
var fo = 0,
  as = 1,
  ty = 2,
  sa = 3,
  Nf = 4,
  Ff = 5,
  Xv = 6;
function $v(e) {
  return e === Nf || e === Ff;
}
function ho(e) {
  return e === as || e === ty;
}
var Gi = [0, 0, 0, 0],
  fw = (function () {
    function e(t) {
      ((this.keyframes = []),
        (this.discrete = !1),
        (this._invalid = !1),
        (this._needsSort = !1),
        (this._lastFr = 0),
        (this._lastFrP = 0),
        (this.propName = t));
    }
    return (
      (e.prototype.isFinished = function () {
        return this._finished;
      }),
      (e.prototype.setFinished = function () {
        ((this._finished = !0), this._additiveTrack && this._additiveTrack.setFinished());
      }),
      (e.prototype.needsAnimate = function () {
        return this.keyframes.length >= 1;
      }),
      (e.prototype.getAdditiveTrack = function () {
        return this._additiveTrack;
      }),
      (e.prototype.addKeyframe = function (t, r, n) {
        this._needsSort = !0;
        var i = this.keyframes,
          a = i.length,
          o = !1,
          s = Xv,
          l = r;
        if (ae(r)) {
          var u = uw(r);
          ((s = u), ((u === 1 && !wt(r[0])) || (u === 2 && !wt(r[0][0]))) && (o = !0));
        } else if (wt(r) && !Ma(r)) s = fo;
        else if (Y(r))
          if (!isNaN(+r)) s = fo;
          else {
            var f = qe(r);
            f && ((l = f), (s = sa));
          }
        else if (ll(r)) {
          var h = N({}, l);
          ((h.colorStops = j(r.colorStops, function (v) {
            return { offset: v.offset, color: qe(v.color) };
          })),
            iw(r) ? (s = Nf) : aw(r) && (s = Ff),
            (l = h));
        }
        (a === 0 ? (this.valType = s) : (s !== this.valType || s === Xv) && (o = !0),
          (this.discrete = this.discrete || o));
        var c = { time: t, value: l, rawValue: r, percent: 0 };
        return (n && ((c.easing = n), (c.easingFunc = et(n) ? n : pa[n] || Qm(n))), i.push(c), c);
      }),
      (e.prototype.prepare = function (t, r) {
        var n = this.keyframes;
        this._needsSort &&
          n.sort(function (p, m) {
            return p.time - m.time;
          });
        for (
          var i = this.valType, a = n.length, o = n[a - 1], s = this.discrete, l = ho(i), u = $v(i), f = 0;
          f < a;
          f++
        ) {
          var h = n[f],
            c = h.value,
            v = o.value;
          ((h.percent = h.time / t), s || (l && f !== a - 1 ? lw(c, v, i) : u && sw(c.colorStops, v.colorStops)));
        }
        if (!s && i !== Ff && r && this.needsAnimate() && r.needsAnimate() && i === r.valType && !r._finished) {
          this._additiveTrack = r;
          for (var d = n[0].value, f = 0; f < a; f++)
            i === fo
              ? (n[f].additiveValue = n[f].value - d)
              : i === sa
                ? (n[f].additiveValue = uo([], n[f].value, d, -1))
                : ho(i) && (n[f].additiveValue = i === as ? uo([], n[f].value, d, -1) : Yv([], n[f].value, d, -1));
        }
      }),
      (e.prototype.step = function (t, r) {
        if (!this._finished) {
          this._additiveTrack && this._additiveTrack._finished && (this._additiveTrack = null);
          var n = this._additiveTrack != null,
            i = n ? "additiveValue" : "value",
            a = this.valType,
            o = this.keyframes,
            s = o.length,
            l = this.propName,
            u = a === sa,
            f,
            h = this._lastFr,
            c = Math.min,
            v,
            d;
          if (s === 1) v = d = o[0];
          else {
            if (r < 0) f = 0;
            else if (r < this._lastFrP) {
              var p = c(h + 1, s - 1);
              for (f = p; f >= 0 && !(o[f].percent <= r); f--);
              f = c(f, s - 2);
            } else {
              for (f = h; f < s && !(o[f].percent > r); f++);
              f = c(f - 1, s - 2);
            }
            ((d = o[f + 1]), (v = o[f]));
          }
          if (v && d) {
            ((this._lastFr = f), (this._lastFrP = r));
            var m = d.percent - v.percent,
              g = m === 0 ? 1 : c((r - v.percent) / m, 1);
            d.easingFunc && (g = d.easingFunc(g));
            var y = n ? this._additiveValue : u ? Gi : t[l];
            if (((ho(a) || u) && !y && (y = this._additiveValue = []), this.discrete))
              t[l] = g < 1 ? v.rawValue : d.rawValue;
            else if (ho(a)) a === as ? ou(y, v[i], d[i], g) : ow(y, v[i], d[i], g);
            else if ($v(a)) {
              var _ = v[i],
                S = d[i],
                b = a === Nf;
              ((t[l] = {
                type: b ? "linear" : "radial",
                x: ur(_.x, S.x, g),
                y: ur(_.y, S.y, g),
                colorStops: j(_.colorStops, function (T, C) {
                  var A = S.colorStops[C];
                  return { offset: ur(T.offset, A.offset, g), color: is(ou([], T.color, A.color, g)) };
                }),
                global: S.global,
              }),
                b ? ((t[l].x2 = ur(_.x2, S.x2, g)), (t[l].y2 = ur(_.y2, S.y2, g))) : (t[l].r = ur(_.r, S.r, g)));
            } else if (u) (ou(y, v[i], d[i], g), n || (t[l] = is(y)));
            else {
              var w = ur(v[i], d[i], g);
              n ? (this._additiveValue = w) : (t[l] = w);
            }
            n && this._addToTarget(t);
          }
        }
      }),
      (e.prototype._addToTarget = function (t) {
        var r = this.valType,
          n = this.propName,
          i = this._additiveValue;
        r === fo
          ? (t[n] = t[n] + i)
          : r === sa
            ? (qe(t[n], Gi), uo(Gi, Gi, i, 1), (t[n] = is(Gi)))
            : r === as
              ? uo(t[n], t[n], i, 1)
              : r === ty && Yv(t[n], t[n], i, 1);
      }),
      e
    );
  })(),
  tc = (function () {
    function e(t, r, n, i) {
      if (
        ((this._tracks = {}),
        (this._trackKeys = []),
        (this._maxTime = 0),
        (this._started = 0),
        (this._clip = null),
        (this._target = t),
        (this._loop = r),
        r && i)
      ) {
        Zh("Can' use additive animation on looped animation.");
        return;
      }
      ((this._additiveAnimators = i), (this._allowDiscrete = n));
    }
    return (
      (e.prototype.getMaxTime = function () {
        return this._maxTime;
      }),
      (e.prototype.getDelay = function () {
        return this._delay;
      }),
      (e.prototype.getLoop = function () {
        return this._loop;
      }),
      (e.prototype.getTarget = function () {
        return this._target;
      }),
      (e.prototype.changeTarget = function (t) {
        this._target = t;
      }),
      (e.prototype.when = function (t, r, n) {
        return this.whenWithKeys(t, r, xt(r), n);
      }),
      (e.prototype.whenWithKeys = function (t, r, n, i) {
        for (var a = this._tracks, o = 0; o < n.length; o++) {
          var s = n[o],
            l = a[s];
          if (!l) {
            l = a[s] = new fw(s);
            var u = void 0,
              f = this._getAdditiveTrack(s);
            if (f) {
              var h = f.keyframes,
                c = h[h.length - 1];
              ((u = c && c.value), f.valType === sa && u && (u = is(u)));
            } else u = this._target[s];
            if (u == null) continue;
            (t > 0 && l.addKeyframe(0, ns(u), i), this._trackKeys.push(s));
          }
          l.addKeyframe(t, ns(r[s]), i);
        }
        return ((this._maxTime = Math.max(this._maxTime, t)), this);
      }),
      (e.prototype.pause = function () {
        (this._clip.pause(), (this._paused = !0));
      }),
      (e.prototype.resume = function () {
        (this._clip.resume(), (this._paused = !1));
      }),
      (e.prototype.isPaused = function () {
        return !!this._paused;
      }),
      (e.prototype.duration = function (t) {
        return ((this._maxTime = t), (this._force = !0), this);
      }),
      (e.prototype._doneCallback = function () {
        (this._setTracksFinished(), (this._clip = null));
        var t = this._doneCbs;
        if (t) for (var r = t.length, n = 0; n < r; n++) t[n].call(this);
      }),
      (e.prototype._abortedCallback = function () {
        this._setTracksFinished();
        var t = this.animation,
          r = this._abortedCbs;
        if ((t && t.removeClip(this._clip), (this._clip = null), r)) for (var n = 0; n < r.length; n++) r[n].call(this);
      }),
      (e.prototype._setTracksFinished = function () {
        for (var t = this._tracks, r = this._trackKeys, n = 0; n < r.length; n++) t[r[n]].setFinished();
      }),
      (e.prototype._getAdditiveTrack = function (t) {
        var r,
          n = this._additiveAnimators;
        if (n)
          for (var i = 0; i < n.length; i++) {
            var a = n[i].getTrack(t);
            a && (r = a);
          }
        return r;
      }),
      (e.prototype.start = function (t) {
        if (!(this._started > 0)) {
          this._started = 1;
          for (var r = this, n = [], i = this._maxTime || 0, a = 0; a < this._trackKeys.length; a++) {
            var o = this._trackKeys[a],
              s = this._tracks[o],
              l = this._getAdditiveTrack(o),
              u = s.keyframes,
              f = u.length;
            if ((s.prepare(i, l), s.needsAnimate()))
              if (!this._allowDiscrete && s.discrete) {
                var h = u[f - 1];
                (h && (r._target[s.propName] = h.rawValue), s.setFinished());
              } else n.push(s);
          }
          if (n.length || this._force) {
            var c = new tw({
              life: i,
              loop: this._loop,
              delay: this._delay || 0,
              onframe: function (v) {
                r._started = 2;
                var d = r._additiveAnimators;
                if (d) {
                  for (var p = !1, m = 0; m < d.length; m++)
                    if (d[m]._clip) {
                      p = !0;
                      break;
                    }
                  p || (r._additiveAnimators = null);
                }
                for (var m = 0; m < n.length; m++) n[m].step(r._target, v);
                var g = r._onframeCbs;
                if (g) for (var m = 0; m < g.length; m++) g[m](r._target, v);
              },
              ondestroy: function () {
                r._doneCallback();
              },
            });
            ((this._clip = c), this.animation && this.animation.addClip(c), t && c.setEasing(t));
          } else this._doneCallback();
          return this;
        }
      }),
      (e.prototype.stop = function (t) {
        if (this._clip) {
          var r = this._clip;
          (t && r.onframe(1), this._abortedCallback());
        }
      }),
      (e.prototype.delay = function (t) {
        return ((this._delay = t), this);
      }),
      (e.prototype.during = function (t) {
        return (t && (this._onframeCbs || (this._onframeCbs = []), this._onframeCbs.push(t)), this);
      }),
      (e.prototype.done = function (t) {
        return (t && (this._doneCbs || (this._doneCbs = []), this._doneCbs.push(t)), this);
      }),
      (e.prototype.aborted = function (t) {
        return (t && (this._abortedCbs || (this._abortedCbs = []), this._abortedCbs.push(t)), this);
      }),
      (e.prototype.getClip = function () {
        return this._clip;
      }),
      (e.prototype.getTrack = function (t) {
        return this._tracks[t];
      }),
      (e.prototype.getTracks = function () {
        var t = this;
        return j(this._trackKeys, function (r) {
          return t._tracks[r];
        });
      }),
      (e.prototype.stopTracks = function (t, r) {
        if (!t.length || !this._clip) return !0;
        for (var n = this._tracks, i = this._trackKeys, a = 0; a < t.length; a++) {
          var o = n[t[a]];
          o &&
            !o.isFinished() &&
            (r ? o.step(this._target, 1) : this._started === 1 && o.step(this._target, 0), o.setFinished());
        }
        for (var s = !0, a = 0; a < i.length; a++)
          if (!n[i[a]].isFinished()) {
            s = !1;
            break;
          }
        return (s && this._abortedCallback(), s);
      }),
      (e.prototype.saveTo = function (t, r, n) {
        if (t) {
          r = r || this._trackKeys;
          for (var i = 0; i < r.length; i++) {
            var a = r[i],
              o = this._tracks[a];
            if (!(!o || o.isFinished())) {
              var s = o.keyframes,
                l = s[n ? 0 : s.length - 1];
              l && (t[a] = ns(l.rawValue));
            }
          }
        }
      }),
      (e.prototype.__changeFinalValue = function (t, r) {
        r = r || xt(t);
        for (var n = 0; n < r.length; n++) {
          var i = r[n],
            a = this._tracks[i];
          if (a) {
            var o = a.keyframes;
            if (o.length > 1) {
              var s = o.pop();
              (a.addKeyframe(s.time, t[i]), a.prepare(this._maxTime, a.getAdditiveTrack()));
            }
          }
        }
      }),
      e
    );
  })();
function oi() {
  return new Date().getTime();
}
var hw = (function (e) {
    V(t, e);
    function t(r) {
      var n = e.call(this) || this;
      return (
        (n._running = !1),
        (n._time = 0),
        (n._pausedTime = 0),
        (n._pauseStart = 0),
        (n._paused = !1),
        (r = r || {}),
        (n.stage = r.stage || {}),
        n
      );
    }
    return (
      (t.prototype.addClip = function (r) {
        (r.animation && this.removeClip(r),
          this._head
            ? ((this._tail.next = r), (r.prev = this._tail), (r.next = null), (this._tail = r))
            : (this._head = this._tail = r),
          (r.animation = this));
      }),
      (t.prototype.addAnimator = function (r) {
        r.animation = this;
        var n = r.getClip();
        n && this.addClip(n);
      }),
      (t.prototype.removeClip = function (r) {
        if (r.animation) {
          var n = r.prev,
            i = r.next;
          (n ? (n.next = i) : (this._head = i),
            i ? (i.prev = n) : (this._tail = n),
            (r.next = r.prev = r.animation = null));
        }
      }),
      (t.prototype.removeAnimator = function (r) {
        var n = r.getClip();
        (n && this.removeClip(n), (r.animation = null));
      }),
      (t.prototype.update = function (r) {
        for (var n = oi() - this._pausedTime, i = n - this._time, a = this._head; a; ) {
          var o = a.next,
            s = a.step(n, i);
          (s && (a.ondestroy(), this.removeClip(a)), (a = o));
        }
        ((this._time = n), r || (this.trigger("frame", i), this.stage.update && this.stage.update()));
      }),
      (t.prototype._startLoop = function () {
        var r = this;
        this._running = !0;
        function n() {
          r._running && (xs(n), !r._paused && r.update());
        }
        xs(n);
      }),
      (t.prototype.start = function () {
        this._running || ((this._time = oi()), (this._pausedTime = 0), this._startLoop());
      }),
      (t.prototype.stop = function () {
        this._running = !1;
      }),
      (t.prototype.pause = function () {
        this._paused || ((this._pauseStart = oi()), (this._paused = !0));
      }),
      (t.prototype.resume = function () {
        this._paused && ((this._pausedTime += oi() - this._pauseStart), (this._paused = !1));
      }),
      (t.prototype.clear = function () {
        for (var r = this._head; r; ) {
          var n = r.next;
          ((r.prev = r.next = r.animation = null), (r = n));
        }
        this._head = this._tail = null;
      }),
      (t.prototype.isFinished = function () {
        return this._head == null;
      }),
      (t.prototype.animate = function (r, n) {
        ((n = n || {}), this.start());
        var i = new tc(r, n.loop);
        return (this.addAnimator(i), i);
      }),
      t
    );
  })(nr),
  cw = 300,
  su = nt.domSupported,
  lu = (function () {
    var e = [
        "click",
        "dblclick",
        "mousewheel",
        "wheel",
        "mouseout",
        "mouseup",
        "mousedown",
        "mousemove",
        "contextmenu",
      ],
      t = ["touchstart", "touchend", "touchmove"],
      r = { pointerdown: 1, pointerup: 1, pointermove: 1, pointerout: 1 },
      n = j(e, function (i) {
        var a = i.replace("mouse", "pointer");
        return r.hasOwnProperty(a) ? a : i;
      });
    return { mouse: e, touch: t, pointer: n };
  })(),
  Zv = { mouse: ["mousemove", "mouseup"], pointer: ["pointermove", "pointerup"] },
  qv = !1;
function zf(e) {
  var t = e.pointerType;
  return t === "pen" || t === "touch";
}
function vw(e) {
  ((e.touching = !0),
    e.touchTimer != null && (clearTimeout(e.touchTimer), (e.touchTimer = null)),
    (e.touchTimer = setTimeout(function () {
      ((e.touching = !1), (e.touchTimer = null));
    }, 700)));
}
function uu(e) {
  e && (e.zrByTouch = !0);
}
function dw(e, t) {
  return me(e.dom, new pw(e, t), !0);
}
function ey(e, t) {
  for (var r = t, n = !1; r && r.nodeType !== 9 && !(n = r.domBelongToZr || (r !== t && r === e.painterRoot)); )
    r = r.parentNode;
  return n;
}
var pw = (function () {
    function e(t, r) {
      ((this.stopPropagation = Gt),
        (this.stopImmediatePropagation = Gt),
        (this.preventDefault = Gt),
        (this.type = r.type),
        (this.target = this.currentTarget = t.dom),
        (this.pointerType = r.pointerType),
        (this.clientX = r.clientX),
        (this.clientY = r.clientY));
    }
    return e;
  })(),
  Ee = {
    mousedown: function (e) {
      ((e = me(this.dom, e)), (this.__mayPointerCapture = [e.zrX, e.zrY]), this.trigger("mousedown", e));
    },
    mousemove: function (e) {
      e = me(this.dom, e);
      var t = this.__mayPointerCapture;
      (t && (e.zrX !== t[0] || e.zrY !== t[1]) && this.__togglePointerCapture(!0), this.trigger("mousemove", e));
    },
    mouseup: function (e) {
      ((e = me(this.dom, e)), this.__togglePointerCapture(!1), this.trigger("mouseup", e));
    },
    mouseout: function (e) {
      e = me(this.dom, e);
      var t = e.toElement || e.relatedTarget;
      ey(this, t) || (this.__pointerCapturing && (e.zrEventControl = "no_globalout"), this.trigger("mouseout", e));
    },
    wheel: function (e) {
      ((qv = !0), (e = me(this.dom, e)), this.trigger("mousewheel", e));
    },
    mousewheel: function (e) {
      qv || ((e = me(this.dom, e)), this.trigger("mousewheel", e));
    },
    touchstart: function (e) {
      ((e = me(this.dom, e)),
        uu(e),
        (this.__lastTouchMoment = new Date()),
        this.handler.processGesture(e, "start"),
        Ee.mousemove.call(this, e),
        Ee.mousedown.call(this, e));
    },
    touchmove: function (e) {
      ((e = me(this.dom, e)), uu(e), this.handler.processGesture(e, "change"), Ee.mousemove.call(this, e));
    },
    touchend: function (e) {
      ((e = me(this.dom, e)),
        uu(e),
        this.handler.processGesture(e, "end"),
        Ee.mouseup.call(this, e),
        +new Date() - +this.__lastTouchMoment < cw && Ee.click.call(this, e));
    },
    pointerdown: function (e) {
      Ee.mousedown.call(this, e);
    },
    pointermove: function (e) {
      zf(e) || Ee.mousemove.call(this, e);
    },
    pointerup: function (e) {
      Ee.mouseup.call(this, e);
    },
    pointerout: function (e) {
      zf(e) || Ee.mouseout.call(this, e);
    },
  };
I(["click", "dblclick", "contextmenu"], function (e) {
  Ee[e] = function (t) {
    ((t = me(this.dom, t)), this.trigger(e, t));
  };
});
var Hf = {
  pointermove: function (e) {
    zf(e) || Hf.mousemove.call(this, e);
  },
  pointerup: function (e) {
    Hf.mouseup.call(this, e);
  },
  mousemove: function (e) {
    this.trigger("mousemove", e);
  },
  mouseup: function (e) {
    var t = this.__pointerCapturing;
    (this.__togglePointerCapture(!1),
      this.trigger("mouseup", e),
      t && ((e.zrEventControl = "only_globalout"), this.trigger("mouseout", e)));
  },
};
function gw(e, t) {
  var r = t.domHandlers;
  nt.pointerEventsSupported
    ? I(lu.pointer, function (n) {
        os(t, n, function (i) {
          r[n].call(e, i);
        });
      })
    : (nt.touchEventsSupported &&
        I(lu.touch, function (n) {
          os(t, n, function (i) {
            (r[n].call(e, i), vw(t));
          });
        }),
      I(lu.mouse, function (n) {
        os(t, n, function (i) {
          ((i = Qh(i)), t.touching || r[n].call(e, i));
        });
      }));
}
function mw(e, t) {
  nt.pointerEventsSupported ? I(Zv.pointer, r) : nt.touchEventsSupported || I(Zv.mouse, r);
  function r(n) {
    function i(a) {
      ((a = Qh(a)), ey(e, a.target) || ((a = dw(e, a)), t.domHandlers[n].call(e, a)));
    }
    os(t, n, i, { capture: !0 });
  }
}
function os(e, t, r, n) {
  ((e.mounted[t] = r), (e.listenerOpts[t] = n), Lb(e.domTarget, t, r, n));
}
function fu(e) {
  var t = e.mounted;
  for (var r in t) t.hasOwnProperty(r) && Pb(e.domTarget, r, t[r], e.listenerOpts[r]);
  e.mounted = {};
}
var Kv = (function () {
    function e(t, r) {
      ((this.mounted = {}),
        (this.listenerOpts = {}),
        (this.touching = !1),
        (this.domTarget = t),
        (this.domHandlers = r));
    }
    return e;
  })(),
  yw = (function (e) {
    V(t, e);
    function t(r, n) {
      var i = e.call(this) || this;
      return (
        (i.__pointerCapturing = !1),
        (i.dom = r),
        (i.painterRoot = n),
        (i._localHandlerScope = new Kv(r, Ee)),
        su && (i._globalHandlerScope = new Kv(document, Hf)),
        gw(i, i._localHandlerScope),
        i
      );
    }
    return (
      (t.prototype.dispose = function () {
        (fu(this._localHandlerScope), su && fu(this._globalHandlerScope));
      }),
      (t.prototype.setCursor = function (r) {
        this.dom.style && (this.dom.style.cursor = r || "default");
      }),
      (t.prototype.__togglePointerCapture = function (r) {
        if (((this.__mayPointerCapture = null), su && +this.__pointerCapturing ^ +r)) {
          this.__pointerCapturing = r;
          var n = this._globalHandlerScope;
          r ? mw(this, n) : fu(n);
        }
      }),
      t
    );
  })(nr),
  ry = 1;
nt.hasGlobalWindow &&
  (ry = Math.max(
    window.devicePixelRatio || (window.screen && window.screen.deviceXDPI / window.screen.logicalXDPI) || 1,
    1,
  ));
var Ls = ry,
  Vf = 0.4,
  Gf = "#333",
  Uf = "#ccc",
  _w = "#eee",
  Qv = Wa,
  jv = 5e-5;
function jr(e) {
  return e > jv || e < -jv;
}
var Jr = [],
  Vn = [],
  hu = Ze(),
  cu = Math.abs,
  $a = (function () {
    function e() {}
    return (
      (e.prototype.getLocalTransform = function (t) {
        return Sw(this, t);
      }),
      (e.prototype.setPosition = function (t) {
        ((this.x = t[0]), (this.y = t[1]));
      }),
      (e.prototype.setScale = function (t) {
        ((this.scaleX = t[0]), (this.scaleY = t[1]));
      }),
      (e.prototype.setSkew = function (t) {
        ((this.skewX = t[0]), (this.skewY = t[1]));
      }),
      (e.prototype.setOrigin = function (t) {
        ((this.originX = t[0]), (this.originY = t[1]));
      }),
      (e.prototype.needLocalTransform = function () {
        return (
          jr(this.rotation) ||
          jr(this.x) ||
          jr(this.y) ||
          jr(this.scaleX - 1) ||
          jr(this.scaleY - 1) ||
          jr(this.skewX) ||
          jr(this.skewY)
        );
      }),
      (e.prototype.updateTransform = function () {
        var t = this.parent && this.parent.transform,
          r = this.needLocalTransform(),
          n = this.transform;
        if (!(r || t)) {
          n && (Qv(n), (this.invTransform = null));
          return;
        }
        ((n = n || Ze()),
          r ? this.getLocalTransform(n) : Qv(n),
          t && (r ? va(n, t, n) : jh(n, t)),
          (this.transform = n),
          this._resolveGlobalScaleRatio(n),
          (this.invTransform = this.invTransform || Ze()),
          Ya(this.invTransform, n));
      }),
      (e.prototype._resolveGlobalScaleRatio = function (t) {
        var r = this.globalScaleRatio;
        if (r != null && r !== 1) {
          this.getGlobalScale(Jr);
          var n = Jr[0] < 0 ? -1 : 1,
            i = Jr[1] < 0 ? -1 : 1,
            a = ((Jr[0] - n) * r + n) / Jr[0] || 0,
            o = ((Jr[1] - i) * r + i) / Jr[1] || 0;
          ((t[0] *= a), (t[1] *= a), (t[2] *= o), (t[3] *= o));
        }
      }),
      (e.prototype.getComputedTransform = function () {
        for (var t = this, r = []; t; ) (r.push(t), (t = t.parent));
        for (; (t = r.pop()); ) t.updateTransform();
        return this.transform;
      }),
      (e.prototype.setLocalTransform = function (t) {
        if (t) {
          var r = t[0] * t[0] + t[1] * t[1],
            n = t[2] * t[2] + t[3] * t[3],
            i = Math.atan2(t[1], t[0]),
            a = Math.PI / 2 + i - Math.atan2(t[3], t[2]);
          ((n = Math.sqrt(n) * Math.cos(a)),
            (r = Math.sqrt(r)),
            (this.skewX = a),
            (this.skewY = 0),
            (this.rotation = -i),
            (this.x = +t[4]),
            (this.y = +t[5]),
            (this.scaleX = r),
            (this.scaleY = n),
            (this.originX = 0),
            (this.originY = 0));
        }
      }),
      (e.prototype.decomposeTransform = function () {
        if (this.transform) {
          var t = this.parent,
            r = this.transform;
          t && t.transform && ((t.invTransform = t.invTransform || Ze()), va(Vn, t.invTransform, r), (r = Vn));
          var n = this.originX,
            i = this.originY;
          ((n || i) && ((hu[4] = n), (hu[5] = i), va(Vn, r, hu), (Vn[4] -= n), (Vn[5] -= i), (r = Vn)),
            this.setLocalTransform(r));
        }
      }),
      (e.prototype.getGlobalScale = function (t) {
        var r = this.transform;
        return (
          (t = t || []),
          r
            ? ((t[0] = Math.sqrt(r[0] * r[0] + r[1] * r[1])),
              (t[1] = Math.sqrt(r[2] * r[2] + r[3] * r[3])),
              r[0] < 0 && (t[0] = -t[0]),
              r[3] < 0 && (t[1] = -t[1]),
              t)
            : ((t[0] = 1), (t[1] = 1), t)
        );
      }),
      (e.prototype.transformCoordToLocal = function (t, r) {
        var n = [t, r],
          i = this.invTransform;
        return (i && Ae(n, n, i), n);
      }),
      (e.prototype.transformCoordToGlobal = function (t, r) {
        var n = [t, r],
          i = this.transform;
        return (i && Ae(n, n, i), n);
      }),
      (e.prototype.getLineScale = function () {
        var t = this.transform;
        return t && cu(t[0] - 1) > 1e-10 && cu(t[3] - 1) > 1e-10 ? Math.sqrt(cu(t[0] * t[3] - t[2] * t[1])) : 1;
      }),
      (e.prototype.copyTransform = function (t) {
        Ps(this, t);
      }),
      (e.getLocalTransform = function (t, r) {
        r = r || [];
        var n = t.originX || 0,
          i = t.originY || 0,
          a = t.scaleX,
          o = t.scaleY,
          s = t.anchorX,
          l = t.anchorY,
          u = t.rotation || 0,
          f = t.x,
          h = t.y,
          c = t.skewX ? Math.tan(t.skewX) : 0,
          v = t.skewY ? Math.tan(-t.skewY) : 0;
        if (n || i || s || l) {
          var d = n + s,
            p = i + l;
          ((r[4] = -d * a - c * p * o), (r[5] = -p * o - v * d * a));
        } else r[4] = r[5] = 0;
        return (
          (r[0] = a),
          (r[3] = o),
          (r[1] = v * a),
          (r[2] = c * o),
          u && Jh(r, r, u),
          (r[4] += n + f),
          (r[5] += i + h),
          r
        );
      }),
      (e.initDefaultProps = (function () {
        var t = e.prototype;
        ((t.scaleX = t.scaleY = t.globalScaleRatio = 1),
          (t.x = t.y = t.originX = t.originY = t.skewX = t.skewY = t.rotation = t.anchorX = t.anchorY = 0));
      })()),
      e
    );
  })(),
  Sw = $a.getLocalTransform,
  fl = ["x", "y", "originX", "originY", "anchorX", "anchorY", "rotation", "scaleX", "scaleY", "skewX", "skewY"];
function Ps(e, t) {
  return rb(e, t, fl);
}
function Ke(e) {
  (co || (co = new mi(100)), (e = e || Nr));
  var t = co.get(e);
  return (
    t ||
      ((t = {
        font: e,
        strWidthCache: new mi(500),
        asciiWidthMap: null,
        asciiWidthMapTried: !1,
        stWideCharWidth: fe.measureText("国", e).width,
        asciiCharWidth: fe.measureText("a", e).width,
      }),
      co.put(e, t)),
    t
  );
}
var co;
function bw(e) {
  if (!(vu >= Jv)) {
    e = e || Nr;
    for (var t = [], r = +new Date(), n = 0; n <= 127; n++) t[n] = fe.measureText(String.fromCharCode(n), e).width;
    var i = +new Date() - r;
    return (i > 16 ? (vu = Jv) : i > 2 && vu++, t);
  }
}
var vu = 0,
  Jv = 5;
function ny(e, t) {
  return (
    e.asciiWidthMapTried || ((e.asciiWidthMap = bw(e.font)), (e.asciiWidthMapTried = !0)),
    0 <= t && t <= 127 ? (e.asciiWidthMap != null ? e.asciiWidthMap[t] : e.asciiCharWidth) : e.stWideCharWidth
  );
}
function Qe(e, t) {
  var r = e.strWidthCache,
    n = r.get(t);
  return (n == null && ((n = fe.measureText(t, e.font).width), r.put(t, n)), n);
}
function td(e, t, r, n) {
  var i = Qe(Ke(t), e),
    a = hl(t),
    o = yi(0, i, r),
    s = An(0, a, n),
    l = new J(o, s, i, a);
  return l;
}
function iy(e, t, r, n) {
  var i = ((e || "") + "").split(`
`),
    a = i.length;
  if (a === 1) return td(i[0], t, r, n);
  for (var o = new J(0, 0, 0, 0), s = 0; s < i.length; s++) {
    var l = td(i[s], t, r, n);
    s === 0 ? o.copy(l) : o.union(l);
  }
  return o;
}
function yi(e, t, r, n) {
  return (r === "right" ? (n ? (e += t) : (e -= t)) : r === "center" && (n ? (e += t / 2) : (e -= t / 2)), e);
}
function An(e, t, r, n) {
  return (r === "middle" ? (n ? (e += t / 2) : (e -= t / 2)) : r === "bottom" && (n ? (e += t) : (e -= t)), e);
}
function hl(e) {
  return Ke(e).stWideCharWidth;
}
function Pn(e, t) {
  return typeof e == "string" ? (e.lastIndexOf("%") >= 0 ? (parseFloat(e) / 100) * t : parseFloat(e)) : e;
}
function Es(e, t, r) {
  var n = t.position || "inside",
    i = t.distance != null ? t.distance : 5,
    a = r.height,
    o = r.width,
    s = a / 2,
    l = r.x,
    u = r.y,
    f = "left",
    h = "top";
  if (n instanceof Array) ((l += Pn(n[0], r.width)), (u += Pn(n[1], r.height)), (f = null), (h = null));
  else
    switch (n) {
      case "left":
        ((l -= i), (u += s), (f = "right"), (h = "middle"));
        break;
      case "right":
        ((l += i + o), (u += s), (h = "middle"));
        break;
      case "top":
        ((l += o / 2), (u -= i), (f = "center"), (h = "bottom"));
        break;
      case "bottom":
        ((l += o / 2), (u += a + i), (f = "center"));
        break;
      case "inside":
        ((l += o / 2), (u += s), (f = "center"), (h = "middle"));
        break;
      case "insideLeft":
        ((l += i), (u += s), (h = "middle"));
        break;
      case "insideRight":
        ((l += o - i), (u += s), (f = "right"), (h = "middle"));
        break;
      case "insideTop":
        ((l += o / 2), (u += i), (f = "center"));
        break;
      case "insideBottom":
        ((l += o / 2), (u += a - i), (f = "center"), (h = "bottom"));
        break;
      case "insideTopLeft":
        ((l += i), (u += i));
        break;
      case "insideTopRight":
        ((l += o - i), (u += i), (f = "right"));
        break;
      case "insideBottomLeft":
        ((l += i), (u += a - i), (h = "bottom"));
        break;
      case "insideBottomRight":
        ((l += o - i), (u += a - i), (f = "right"), (h = "bottom"));
        break;
    }
  return ((e = e || {}), (e.x = l), (e.y = u), (e.align = f), (e.verticalAlign = h), e);
}
var du = "__zr_normal__",
  pu = fl.concat(["ignore"]),
  ww = Mi(
    fl,
    function (e, t) {
      return ((e[t] = !0), e);
    },
    { ignore: !1 },
  ),
  Gn = {},
  Tw = new J(0, 0, 0, 0),
  vo = [],
  ss = 0,
  cl = 1,
  vl = (function () {
    function e(t) {
      ((this.id = Bm()), (this.animators = []), (this.currentStates = []), (this.states = {}), this._init(t));
    }
    return (
      (e.prototype._init = function (t) {
        this.attr(t);
      }),
      (e.prototype.drift = function (t, r, n) {
        switch (this.draggable) {
          case "horizontal":
            r = 0;
            break;
          case "vertical":
            t = 0;
            break;
        }
        var i = this.transform;
        (i || (i = this.transform = [1, 0, 0, 1, 0, 0]),
          (i[4] += t),
          (i[5] += r),
          this.decomposeTransform(),
          this.markRedraw());
      }),
      (e.prototype.beforeUpdate = function () {}),
      (e.prototype.afterUpdate = function () {}),
      (e.prototype.update = function () {
        (this.updateTransform(), this.__dirty && this.updateInnerText());
      }),
      (e.prototype.updateInnerText = function (t) {
        var r = this._textContent;
        if (r && (!r.ignore || t)) {
          this.textConfig || (this.textConfig = {});
          var n = this.textConfig,
            i = n.local,
            a = r.innerTransformable,
            o = void 0,
            s = void 0,
            l = !1;
          a.parent = i ? this : null;
          var u = !1;
          a.copyTransform(r);
          var f = n.position != null,
            h = n.autoOverflowArea,
            c = void 0;
          if (
            ((h || f) &&
              ((c = Tw),
              n.layoutRect ? c.copy(n.layoutRect) : c.copy(this.getBoundingRect()),
              i || c.applyTransform(this.transform)),
            f)
          ) {
            (this.calculateTextPosition ? this.calculateTextPosition(Gn, n, c) : Es(Gn, n, c),
              (a.x = Gn.x),
              (a.y = Gn.y),
              (o = Gn.align),
              (s = Gn.verticalAlign));
            var v = n.origin;
            if (v && n.rotation != null) {
              var d = void 0,
                p = void 0;
              (v === "center"
                ? ((d = c.width * 0.5), (p = c.height * 0.5))
                : ((d = Pn(v[0], c.width)), (p = Pn(v[1], c.height))),
                (u = !0),
                (a.originX = -a.x + d + (i ? 0 : c.x)),
                (a.originY = -a.y + p + (i ? 0 : c.y)));
            }
          }
          n.rotation != null && (a.rotation = n.rotation);
          var m = n.offset;
          m && ((a.x += m[0]), (a.y += m[1]), u || ((a.originX = -m[0]), (a.originY = -m[1])));
          var g = this._innerTextDefaultStyle || (this._innerTextDefaultStyle = {});
          if (h) {
            var y = (g.overflowRect = g.overflowRect || new J(0, 0, 0, 0));
            (a.getLocalTransform(vo), Ya(vo, vo), J.copy(y, c), y.applyTransform(vo));
          } else g.overflowRect = null;
          var _ = n.inside == null ? typeof n.position == "string" && n.position.indexOf("inside") >= 0 : n.inside,
            S = void 0,
            b = void 0,
            w = void 0;
          (_ && this.canBeInsideText()
            ? ((S = n.insideFill),
              (b = n.insideStroke),
              (S == null || S === "auto") && (S = this.getInsideTextFill()),
              (b == null || b === "auto") && ((b = this.getInsideTextStroke(S)), (w = !0)))
            : ((S = n.outsideFill),
              (b = n.outsideStroke),
              (S == null || S === "auto") && (S = this.getOutsideFill()),
              (b == null || b === "auto") && ((b = this.getOutsideStroke(S)), (w = !0))),
            (S = S || "#000"),
            (S !== g.fill || b !== g.stroke || w !== g.autoStroke || o !== g.align || s !== g.verticalAlign) &&
              ((l = !0),
              (g.fill = S),
              (g.stroke = b),
              (g.autoStroke = w),
              (g.align = o),
              (g.verticalAlign = s),
              r.setDefaultTextStyle(g)),
            (r.__dirty |= ie),
            l && r.dirtyStyle(!0));
        }
      }),
      (e.prototype.canBeInsideText = function () {
        return !0;
      }),
      (e.prototype.getInsideTextFill = function () {
        return "#fff";
      }),
      (e.prototype.getInsideTextStroke = function (t) {
        return "#000";
      }),
      (e.prototype.getOutsideFill = function () {
        return this.__zr && this.__zr.isDarkMode() ? Uf : Gf;
      }),
      (e.prototype.getOutsideStroke = function (t) {
        var r = this.__zr && this.__zr.getBackgroundColor(),
          n = typeof r == "string" && qe(r);
        n || (n = [255, 255, 255, 1]);
        for (var i = n[3], a = this.__zr.isDarkMode(), o = 0; o < 3; o++) n[o] = n[o] * i + (a ? 0 : 255) * (1 - i);
        return ((n[3] = 1), Xa(n, "rgba"));
      }),
      (e.prototype.traverse = function (t, r) {}),
      (e.prototype.attrKV = function (t, r) {
        t === "textConfig"
          ? this.setTextConfig(r)
          : t === "textContent"
            ? this.setTextContent(r)
            : t === "clipPath"
              ? this.setClipPath(r)
              : t === "extra"
                ? ((this.extra = this.extra || {}), N(this.extra, r))
                : (this[t] = r);
      }),
      (e.prototype.hide = function () {
        ((this.ignore = !0), this.markRedraw());
      }),
      (e.prototype.show = function () {
        ((this.ignore = !1), this.markRedraw());
      }),
      (e.prototype.attr = function (t, r) {
        if (typeof t == "string") this.attrKV(t, r);
        else if (Z(t))
          for (var n = t, i = xt(n), a = 0; a < i.length; a++) {
            var o = i[a];
            this.attrKV(o, t[o]);
          }
        return (this.markRedraw(), this);
      }),
      (e.prototype.saveCurrentToNormalState = function (t) {
        this._innerSaveToNormal(t);
        for (var r = this._normalState, n = 0; n < this.animators.length; n++) {
          var i = this.animators[n],
            a = i.__fromStateTransition;
          if (!(i.getLoop() || (a && a !== du))) {
            var o = i.targetName,
              s = o ? r[o] : r;
            i.saveTo(s);
          }
        }
      }),
      (e.prototype._innerSaveToNormal = function (t) {
        var r = this._normalState;
        (r || (r = this._normalState = {}),
          t.textConfig && !r.textConfig && (r.textConfig = this.textConfig),
          this._savePrimaryToNormal(t, r, pu));
      }),
      (e.prototype._savePrimaryToNormal = function (t, r, n) {
        for (var i = 0; i < n.length; i++) {
          var a = n[i];
          t[a] != null && !(a in r) && (r[a] = this[a]);
        }
      }),
      (e.prototype.hasState = function () {
        return this.currentStates.length > 0;
      }),
      (e.prototype.getState = function (t) {
        return this.states[t];
      }),
      (e.prototype.ensureState = function (t) {
        var r = this.states;
        return (r[t] || (r[t] = {}), r[t]);
      }),
      (e.prototype.clearStates = function (t) {
        this.useState(du, !1, t);
      }),
      (e.prototype.useState = function (t, r, n, i) {
        var a = t === du,
          o = this.hasState();
        if (!(!o && a)) {
          var s = this.currentStates,
            l = this.stateTransition;
          if (!(vt(s, t) >= 0 && (r || s.length === 1))) {
            var u;
            if (
              (this.stateProxy && !a && (u = this.stateProxy(t)), u || (u = this.states && this.states[t]), !u && !a)
            ) {
              Zh("State " + t + " not exists.");
              return;
            }
            a || this.saveCurrentToNormalState(u);
            var f = this._textContent,
              h = ed(this, f, u, i);
            (h && !this.__inHover && (this.__inHover = h),
              this._applyStateObj(t, u, this._normalState, r, nd(this, n, l), l));
            var c = this._textGuide;
            return (
              f && f.useState(t, r, n, !!h),
              c && c.useState(t, r, n, !!h),
              a
                ? ((this.currentStates = []), (this._normalState = {}))
                : r
                  ? this.currentStates.push(t)
                  : (this.currentStates = [t]),
              this._updateAnimationTargets(),
              this.markRedraw(),
              !h && this.__inHover && ((this.__inHover = ss), (this.__dirty &= ~ie)),
              u
            );
          }
        }
      }),
      (e.prototype.useStates = function (t, r, n) {
        if (!t.length) this.clearStates();
        else {
          var i = [],
            a = this.currentStates,
            o = t.length,
            s = o === a.length;
          if (s) {
            for (var l = 0; l < o; l++)
              if (t[l] !== a[l]) {
                s = !1;
                break;
              }
          }
          if (s) return;
          for (var l = 0; l < o; l++) {
            var u = t[l],
              f = void 0;
            (this.stateProxy && (f = this.stateProxy(u, t)), f || (f = this.states[u]), f && i.push(f));
          }
          var h = i[o - 1],
            c = this._textContent,
            v = ed(this, c, h, n);
          v && !this.__inHover && (this.__inHover = v);
          var d = this._mergeStates(i),
            p = this.stateTransition;
          (this.saveCurrentToNormalState(d),
            this._applyStateObj(t.join(","), d, this._normalState, !1, nd(this, r, p), p));
          var m = this._textGuide;
          (c && c.useStates(t, r, !!v),
            m && m.useStates(t, r, !!v),
            this._updateAnimationTargets(),
            (this.currentStates = t.slice()),
            this.markRedraw(),
            !v && this.__inHover && ((this.__inHover = ss), (this.__dirty &= ~ie)));
        }
      }),
      (e.prototype.isSilent = function () {
        for (var t = this; t; ) {
          if (t.silent) return !0;
          var r = t.__hostTarget;
          t = r ? (t.ignoreHostSilent ? null : r) : t.parent;
        }
        return !1;
      }),
      (e.prototype._updateAnimationTargets = function () {
        for (var t = 0; t < this.animators.length; t++) {
          var r = this.animators[t];
          r.targetName && r.changeTarget(this[r.targetName]);
        }
      }),
      (e.prototype.removeState = function (t) {
        var r = vt(this.currentStates, t);
        if (r >= 0) {
          var n = this.currentStates.slice();
          (n.splice(r, 1), this.useStates(n));
        }
      }),
      (e.prototype.replaceState = function (t, r, n) {
        var i = this.currentStates.slice(),
          a = vt(i, t),
          o = vt(i, r) >= 0;
        (a >= 0 ? (o ? i.splice(a, 1) : (i[a] = r)) : n && !o && i.push(r), this.useStates(i));
      }),
      (e.prototype.toggleState = function (t, r) {
        r ? this.useState(t, !0) : this.removeState(t);
      }),
      (e.prototype._mergeStates = function (t) {
        for (var r = {}, n, i = 0; i < t.length; i++) {
          var a = t[i];
          (N(r, a), a.textConfig && ((n = n || {}), N(n, a.textConfig)));
        }
        return (n && (r.textConfig = n), r);
      }),
      (e.prototype._applyStateObj = function (t, r, n, i, a, o) {
        if (this.__inHover !== cl) {
          var s = !(r && i);
          r && r.textConfig
            ? ((this.textConfig = N({}, i ? this.textConfig : n.textConfig)), N(this.textConfig, r.textConfig))
            : s && n.textConfig && (this.textConfig = n.textConfig);
          for (var l = {}, u = !1, f = 0; f < pu.length; f++) {
            var h = pu[f],
              c = a && ww[h];
            r && r[h] != null
              ? c
                ? ((u = !0), (l[h] = r[h]))
                : (this[h] = r[h])
              : s && n[h] != null && (c ? ((u = !0), (l[h] = n[h])) : (this[h] = n[h]));
          }
          if (!a)
            for (var f = 0; f < this.animators.length; f++) {
              var v = this.animators[f],
                d = v.targetName;
              v.getLoop() || v.__changeFinalValue(d ? (r || n)[d] : r || n);
            }
          u && this._transitionState(t, l, o);
        }
      }),
      (e.prototype._attachComponent = function (t) {
        if (!(t.__zr && !t.__hostTarget) && t !== this) {
          var r = this.__zr;
          (r && t.addSelfToZr(r), (t.__zr = r), (t.__hostTarget = this));
        }
      }),
      (e.prototype._detachComponent = function (t) {
        (t.__zr && t.removeSelfFromZr(t.__zr), (t.__zr = null), (t.__hostTarget = null));
      }),
      (e.prototype.getClipPath = function () {
        return this._clipPath;
      }),
      (e.prototype.setClipPath = function (t) {
        (this._clipPath && this._clipPath !== t && this.removeClipPath(),
          this._attachComponent(t),
          (this._clipPath = t),
          this.markRedraw());
      }),
      (e.prototype.removeClipPath = function () {
        var t = this._clipPath;
        t && (this._detachComponent(t), (this._clipPath = null), this.markRedraw());
      }),
      (e.prototype.getTextContent = function () {
        return this._textContent;
      }),
      (e.prototype.setTextContent = function (t) {
        var r = this._textContent;
        r !== t &&
          (r && r !== t && this.removeTextContent(),
          (t.innerTransformable = new $a()),
          this._attachComponent(t),
          (this._textContent = t),
          this.markRedraw());
      }),
      (e.prototype.setTextConfig = function (t) {
        (this.textConfig || (this.textConfig = {}), N(this.textConfig, t), this.markRedraw());
      }),
      (e.prototype.removeTextConfig = function () {
        ((this.textConfig = null), this.markRedraw());
      }),
      (e.prototype.removeTextContent = function () {
        var t = this._textContent;
        t &&
          ((t.innerTransformable = null),
          this._detachComponent(t),
          (this._textContent = null),
          (this._innerTextDefaultStyle = null),
          this.markRedraw());
      }),
      (e.prototype.getTextGuideLine = function () {
        return this._textGuide;
      }),
      (e.prototype.setTextGuideLine = function (t) {
        (this._textGuide && this._textGuide !== t && this.removeTextGuideLine(),
          this._attachComponent(t),
          (this._textGuide = t),
          this.markRedraw());
      }),
      (e.prototype.removeTextGuideLine = function () {
        var t = this._textGuide;
        t && (this._detachComponent(t), (this._textGuide = null), this.markRedraw());
      }),
      (e.prototype.markRedraw = function () {
        this.__dirty |= ie;
        var t = this.__zr;
        (t && (this.__inHover ? t.refreshHover() : t.refresh()), this.__hostTarget && this.__hostTarget.markRedraw());
      }),
      (e.prototype.dirty = function () {
        this.markRedraw();
      }),
      (e.prototype.addSelfToZr = function (t) {
        if (this.__zr !== t) {
          this.__zr = t;
          var r = this.animators;
          if (r) for (var n = 0; n < r.length; n++) t.animation.addAnimator(r[n]);
          (this._clipPath && this._clipPath.addSelfToZr(t),
            this._textContent && this._textContent.addSelfToZr(t),
            this._textGuide && this._textGuide.addSelfToZr(t));
        }
      }),
      (e.prototype.removeSelfFromZr = function (t) {
        if (this.__zr) {
          this.__zr = null;
          var r = this.animators;
          if (r) for (var n = 0; n < r.length; n++) t.animation.removeAnimator(r[n]);
          (this._clipPath && this._clipPath.removeSelfFromZr(t),
            this._textContent && this._textContent.removeSelfFromZr(t),
            this._textGuide && this._textGuide.removeSelfFromZr(t));
        }
      }),
      (e.prototype.animate = function (t, r, n) {
        var i = t ? this[t] : this,
          a = new tc(i, r, n);
        return (t && (a.targetName = t), this.addAnimator(a, t), a);
      }),
      (e.prototype.addAnimator = function (t, r) {
        var n = this.__zr,
          i = this;
        (t
          .during(function () {
            i.updateDuringAnimation(r);
          })
          .done(function () {
            var a = i.animators,
              o = vt(a, t);
            o >= 0 && a.splice(o, 1);
          }),
          this.animators.push(t),
          n && n.animation.addAnimator(t),
          n && n.wakeUp());
      }),
      (e.prototype.updateDuringAnimation = function (t) {
        this.markRedraw();
      }),
      (e.prototype.stopAnimation = function (t, r) {
        for (var n = this.animators, i = n.length, a = [], o = 0; o < i; o++) {
          var s = n[o];
          !t || t === s.scope ? s.stop(r) : a.push(s);
        }
        return ((this.animators = a), this);
      }),
      (e.prototype.animateTo = function (t, r, n) {
        gu(this, t, r, n);
      }),
      (e.prototype.animateFrom = function (t, r, n) {
        gu(this, t, r, n, !0);
      }),
      (e.prototype._transitionState = function (t, r, n, i) {
        for (var a = gu(this, r, n, i), o = 0; o < a.length; o++) a[o].__fromStateTransition = t;
      }),
      (e.prototype.getBoundingRect = function () {
        return null;
      }),
      (e.prototype.getPaintRect = function () {
        return null;
      }),
      (e.initDefaultProps = (function () {
        var t = e.prototype;
        ((t.type = "element"),
          (t.name = ""),
          (t.ignore = t.silent = t.ignoreHostSilent = t.isGroup = t.draggable = t.dragging = t.ignoreClip = !1),
          (t.__inHover = ss),
          (t.__dirty = ie));
        function r(n, i, a, o) {
          Object.defineProperty(t, n, {
            get: function () {
              if (!this[i]) {
                var l = (this[i] = []);
                s(this, l);
              }
              return this[i];
            },
            set: function (l) {
              ((this[a] = l[0]), (this[o] = l[1]), (this[i] = l), s(this, l));
            },
          });
          function s(l, u) {
            (Object.defineProperty(u, 0, {
              get: function () {
                return l[a];
              },
              set: function (f) {
                l[a] = f;
              },
            }),
              Object.defineProperty(u, 1, {
                get: function () {
                  return l[o];
                },
                set: function (f) {
                  l[o] = f;
                },
              }));
          }
        }
        Object.defineProperty &&
          (r("position", "_legacyPos", "x", "y"),
          r("scale", "_legacyScale", "scaleX", "scaleY"),
          r("origin", "_legacyOrigin", "originX", "originY"));
      })()),
      e
    );
  })();
rr(vl, nr);
rr(vl, $a);
function gu(e, t, r, n, i) {
  r = r || {};
  var a = [];
  ay(e, "", e, t, r, n, a, i);
  var o = a.length,
    s = !1,
    l = r.done,
    u = r.aborted,
    f = function () {
      ((s = !0), o--, o <= 0 && (s ? l && l() : u && u()));
    },
    h = function () {
      (o--, o <= 0 && (s ? l && l() : u && u()));
    };
  (o || (l && l()),
    a.length > 0 &&
      r.during &&
      a[0].during(function (d, p) {
        r.during(p);
      }));
  for (var c = 0; c < a.length; c++) {
    var v = a[c];
    (f && v.done(f), h && v.aborted(h), r.force && v.duration(r.duration), v.start(r.easing));
  }
  return a;
}
function mu(e, t, r) {
  for (var n = 0; n < r; n++) e[n] = t[n];
}
function xw(e) {
  return ae(e[0]);
}
function Cw(e, t, r) {
  if (ae(t[r]))
    if ((ae(e[r]) || (e[r] = []), oe(t[r]))) {
      var n = t[r].length;
      e[r].length !== n && ((e[r] = new t[r].constructor(n)), mu(e[r], t[r], n));
    } else {
      var i = t[r],
        a = e[r],
        o = i.length;
      if (xw(i))
        for (var s = i[0].length, l = 0; l < o; l++)
          a[l] ? mu(a[l], i[l], s) : (a[l] = Array.prototype.slice.call(i[l]));
      else mu(a, i, o);
      a.length = i.length;
    }
  else e[r] = t[r];
}
function Dw(e, t) {
  return e === t || (ae(e) && ae(t) && Aw(e, t));
}
function Aw(e, t) {
  var r = e.length;
  if (r !== t.length) return !1;
  for (var n = 0; n < r; n++) if (e[n] !== t[n]) return !1;
  return !0;
}
function ay(e, t, r, n, i, a, o, s) {
  for (
    var l = xt(n),
      u = i.duration,
      f = i.delay,
      h = i.additive,
      c = i.setToFinal,
      v = !Z(a),
      d = e.animators,
      p = [],
      m = 0;
    m < l.length;
    m++
  ) {
    var g = l[m],
      y = n[g];
    if (y != null && r[g] != null && (v || a[g]))
      if (Z(y) && !ae(y) && !ll(y)) {
        if (t) {
          s || ((r[g] = y), e.updateDuringAnimation(t));
          continue;
        }
        ay(e, g, r[g], y, i, a && a[g], o, s);
      } else p.push(g);
    else s || ((r[g] = y), e.updateDuringAnimation(t), p.push(g));
  }
  var _ = p.length;
  if (!h && _)
    for (var S = 0; S < d.length; S++) {
      var b = d[S];
      if (b.targetName === t) {
        var w = b.stopTracks(p);
        if (w) {
          var T = vt(d, b);
          d.splice(T, 1);
        }
      }
    }
  if (
    (i.force ||
      ((p = Vt(p, function (D) {
        return !Dw(n[D], r[D]);
      })),
      (_ = p.length)),
    _ > 0 || (i.force && !o.length))
  ) {
    var C = void 0,
      A = void 0,
      M = void 0;
    if (s) {
      ((A = {}), c && (C = {}));
      for (var S = 0; S < _; S++) {
        var g = p[S];
        ((A[g] = r[g]), c ? (C[g] = n[g]) : (r[g] = n[g]));
      }
    } else if (c) {
      M = {};
      for (var S = 0; S < _; S++) {
        var g = p[S];
        ((M[g] = ns(r[g])), Cw(r, n, g));
      }
    }
    var b = new tc(
      r,
      !1,
      !1,
      h
        ? Vt(d, function (P) {
            return P.targetName === t;
          })
        : null,
    );
    ((b.targetName = t),
      i.scope && (b.scope = i.scope),
      c && C && b.whenWithKeys(0, C, p),
      M && b.whenWithKeys(0, M, p),
      b.whenWithKeys(u ?? 500, s ? A : n, p).delay(f || 0),
      e.addAnimator(b, t),
      o.push(b));
  }
}
function ed(e, t, r, n) {
  return !((r && r.hoverLayer) || n) || rd(e) || (t && rd(t)) ? ss : cl;
}
function rd(e) {
  return e.type === "text" || e.type === "tspan";
}
function nd(e, t, r) {
  return !t && !e.__inHover && r && r.duration > 0;
}
var Bt = (function (e) {
  V(t, e);
  function t(r) {
    var n = e.call(this) || this;
    return ((n.isGroup = !0), (n._children = []), n.attr(r), n);
  }
  return (
    (t.prototype.childrenRef = function () {
      return this._children;
    }),
    (t.prototype.children = function () {
      return this._children.slice();
    }),
    (t.prototype.childAt = function (r) {
      return this._children[r];
    }),
    (t.prototype.childOfName = function (r) {
      for (var n = this._children, i = 0; i < n.length; i++) if (n[i].name === r) return n[i];
    }),
    (t.prototype.childCount = function () {
      return this._children.length;
    }),
    (t.prototype.add = function (r) {
      return (r && r !== this && r.parent !== this && (this._children.push(r), this._doAdd(r)), this);
    }),
    (t.prototype.addBefore = function (r, n) {
      if (r && r !== this && r.parent !== this && n && n.parent === this) {
        var i = this._children,
          a = i.indexOf(n);
        a >= 0 && (i.splice(a, 0, r), this._doAdd(r));
      }
      return this;
    }),
    (t.prototype.replace = function (r, n) {
      var i = vt(this._children, r);
      return (i >= 0 && this.replaceAt(n, i), this);
    }),
    (t.prototype.replaceAt = function (r, n) {
      var i = this._children,
        a = i[n];
      if (r && r !== this && r.parent !== this && r !== a) {
        ((i[n] = r), (a.parent = null));
        var o = this.__zr;
        (o && a.removeSelfFromZr(o), this._doAdd(r));
      }
      return this;
    }),
    (t.prototype._doAdd = function (r) {
      (r.parent && r.parent.remove(r), (r.parent = this));
      var n = this.__zr;
      (n && n !== r.__zr && r.addSelfToZr(n), n && n.refresh());
    }),
    (t.prototype.remove = function (r) {
      var n = this.__zr,
        i = this._children,
        a = vt(i, r);
      return a < 0 ? this : (i.splice(a, 1), (r.parent = null), n && r.removeSelfFromZr(n), n && n.refresh(), this);
    }),
    (t.prototype.removeAll = function () {
      for (var r = this._children, n = this.__zr, i = 0; i < r.length; i++) {
        var a = r[i];
        (n && a.removeSelfFromZr(n), (a.parent = null));
      }
      return ((r.length = 0), this);
    }),
    (t.prototype.eachChild = function (r, n) {
      for (var i = this._children, a = 0; a < i.length; a++) {
        var o = i[a];
        r.call(n, o, a);
      }
      return this;
    }),
    (t.prototype.traverse = function (r, n) {
      for (var i = 0; i < this._children.length; i++) {
        var a = this._children[i],
          o = r.call(n, a);
        a.isGroup && !o && a.traverse(r, n);
      }
      return this;
    }),
    (t.prototype.addSelfToZr = function (r) {
      e.prototype.addSelfToZr.call(this, r);
      for (var n = 0; n < this._children.length; n++) {
        var i = this._children[n];
        i.addSelfToZr(r);
      }
    }),
    (t.prototype.removeSelfFromZr = function (r) {
      e.prototype.removeSelfFromZr.call(this, r);
      for (var n = 0; n < this._children.length; n++) {
        var i = this._children[n];
        i.removeSelfFromZr(r);
      }
    }),
    (t.prototype.getBoundingRect = function (r) {
      for (var n = new J(0, 0, 0, 0), i = r || this._children, a = [], o = null, s = 0; s < i.length; s++) {
        var l = i[s];
        if (!(l.ignore || l.invisible)) {
          var u = l.getBoundingRect(),
            f = l.getLocalTransform(a);
          f ? (J.applyTransform(n, u, f), (o = o || n.clone()), o.union(n)) : ((o = o || u.clone()), o.union(u));
        }
      }
      return o || n;
    }),
    t
  );
})(vl);
Bt.prototype.type = "group";
/*!
 * ZRender, a high performance 2d drawing library.
 *
 * Copyright (c) 2013, Baidu Inc.
 * All rights reserved.
 *
 * LICENSE
 * https://github.com/ecomfe/zrender/blob/master/LICENSE
 */ var ls = {},
  oy = {};
function Mw(e) {
  delete oy[e];
}
function Iw(e) {
  if (!e) return !1;
  if (typeof e == "string") return Is(e, 1) < Vf;
  if (e.colorStops) {
    for (var t = e.colorStops, r = 0, n = t.length, i = 0; i < n; i++) r += Is(t[i].color, 1);
    return ((r /= n), r < Vf);
  }
  return !1;
}
var Lw = (function () {
  function e(t, r, n) {
    var i = this;
    ((this._sleepAfterStill = 10),
      (this._stillFrameAccum = 0),
      (this._needsRefresh = !0),
      (this._needsRefreshHover = !1),
      (this._darkMode = !1),
      (n = n || {}),
      (this.dom = r),
      (this.id = t));
    var a = new $b(),
      o = n.renderer || "canvas";
    (ls[o] || (o = xt(ls)[0]), (n.useDirtyRect = n.useDirtyRect == null ? !1 : n.useDirtyRect));
    var s = new ls[o](r, a, n, t),
      l = n.ssr || s.ssrOnly;
    ((this.storage = a), (this.painter = s));
    var u = !nt.node && !nt.worker && !l ? new yw(s.getViewportRoot(), s.root) : null,
      f = n.useCoarsePointer,
      h = f == null || f === "auto" ? nt.touchEventsSupported : !!f,
      c = 44,
      v;
    (h && (v = q(n.pointerSize, c)),
      (this.handler = new Wm(a, s, u, s.root, v)),
      (this.animation = new hw({
        stage: {
          update: l
            ? null
            : function () {
                return i._flush(!1);
              },
        },
      })),
      l || this.animation.start());
  }
  return (
    (e.prototype.add = function (t) {
      this._disposed || !t || (this.storage.addRoot(t), t.addSelfToZr(this), this.refresh());
    }),
    (e.prototype.remove = function (t) {
      this._disposed || !t || (this.storage.delRoot(t), t.removeSelfFromZr(this), this.refresh());
    }),
    (e.prototype.configLayer = function (t, r) {
      this._disposed || (this.painter.configLayer && this.painter.configLayer(t, r), this.refresh());
    }),
    (e.prototype.setBackgroundColor = function (t) {
      this._disposed ||
        (this.painter.setBackgroundColor && this.painter.setBackgroundColor(t),
        this.refresh(),
        (this._backgroundColor = t),
        (this._darkMode = Iw(t)));
    }),
    (e.prototype.getBackgroundColor = function () {
      return this._backgroundColor;
    }),
    (e.prototype.setDarkMode = function (t) {
      this._darkMode = t;
    }),
    (e.prototype.isDarkMode = function () {
      return this._darkMode;
    }),
    (e.prototype.refreshImmediately = function (t) {
      this._disposed || this._refresh({ animUpdate: !t, refresh: !0, refreshHover: !1 });
    }),
    (e.prototype._refresh = function (t) {
      (t.animUpdate && this.animation.update(!0),
        (this._needsRefresh = this._needsRefreshHover = !1),
        this.painter.refresh({ refresh: t.refresh, refreshHover: t.refreshHover }),
        (this._needsRefresh = this._needsRefreshHover = !1));
    }),
    (e.prototype.refresh = function () {
      this._disposed || ((this._needsRefresh = !0), this.animation.start());
    }),
    (e.prototype.flush = function () {
      this._disposed || this._flush(!0);
    }),
    (e.prototype._flush = function (t) {
      var r,
        n = oi(),
        i = this._needsRefresh,
        a = this._needsRefreshHover;
      (i || a) && ((r = !0), this._refresh({ animUpdate: t, refresh: i, refreshHover: a }));
      var o = oi();
      r
        ? ((this._stillFrameAccum = 0), this.trigger("rendered", { elapsedTime: o - n }))
        : this._sleepAfterStill > 0 &&
          (this._stillFrameAccum++, this._stillFrameAccum > this._sleepAfterStill && this.animation.stop());
    }),
    (e.prototype.setSleepAfterStill = function (t) {
      this._sleepAfterStill = t;
    }),
    (e.prototype.wakeUp = function () {
      this._disposed || (this.animation.start(), (this._stillFrameAccum = 0));
    }),
    (e.prototype.refreshHover = function () {
      this._needsRefreshHover = !0;
    }),
    (e.prototype.refreshHoverImmediately = function () {
      this._disposed || this._refresh({ animUpdate: !1, refresh: !1, refreshHover: !0 });
    }),
    (e.prototype.resize = function (t) {
      this._disposed || ((t = t || {}), this.painter.resize(t.width, t.height), this.handler.resize());
    }),
    (e.prototype.clearAnimation = function () {
      this._disposed || this.animation.clear();
    }),
    (e.prototype.getWidth = function () {
      if (!this._disposed) return this.painter.getWidth();
    }),
    (e.prototype.getHeight = function () {
      if (!this._disposed) return this.painter.getHeight();
    }),
    (e.prototype.setCursorStyle = function (t) {
      this._disposed || this.handler.setCursorStyle(t);
    }),
    (e.prototype.findHover = function (t, r) {
      if (!this._disposed) return this.handler.findHover(t, r);
    }),
    (e.prototype.on = function (t, r, n) {
      return (this._disposed || this.handler.on(t, r, n), this);
    }),
    (e.prototype.off = function (t, r) {
      this._disposed || this.handler.off(t, r);
    }),
    (e.prototype.trigger = function (t, r) {
      this._disposed || this.handler.trigger(t, r);
    }),
    (e.prototype.clear = function () {
      if (!this._disposed) {
        for (var t = this.storage.getRoots(), r = 0; r < t.length; r++)
          t[r] instanceof Bt && t[r].removeSelfFromZr(this);
        (this.storage.delAllRoots(), this.painter.clear());
      }
    }),
    (e.prototype.dispose = function () {
      this._disposed ||
        (this.animation.stop(),
        this.clear(),
        this.storage.dispose(),
        this.painter.dispose(),
        this.handler.dispose(),
        (this.animation = this.storage = this.painter = this.handler = null),
        (this._disposed = !0),
        Mw(this.id));
    }),
    e
  );
})();
function id(e, t) {
  var r = new Lw(Bm(), e, t);
  return ((oy[r.id] = r), r);
}
function Pw(e, t) {
  ls[e] = t;
}
var ad = 1e-4,
  sy = 20;
function Ew(e) {
  return e.replace(/^\s+|\s+$/g, "");
}
var Ut = Math.min,
  ht = Math.max,
  Pt = Math.abs,
  dr = Math.round,
  _i = Math.floor,
  Za = Math.ceil,
  Li = Math.pow,
  Ia = Math.log,
  Wf = Math.LN10,
  Rw = Math.PI,
  Ow = Math.random;
function od(e, t, r, n) {
  var i = t[0],
    a = t[1],
    o = r[0],
    s = r[1],
    l = a - i,
    u = s - o;
  if (l === 0) return u === 0 ? o : (o + s) / 2;
  if (n)
    if (l > 0) {
      if (e <= i) return o;
      if (e >= a) return s;
    } else {
      if (e >= i) return o;
      if (e <= a) return s;
    }
  else {
    if (e === i) return o;
    if (e === a) return s;
  }
  return ((e - i) / l) * u + o;
}
var qt = kw;
function kw(e, t, r) {
  switch (e) {
    case "center":
    case "middle":
      e = "50%";
      break;
    case "left":
    case "top":
      e = "0%";
      break;
    case "right":
    case "bottom":
      e = "100%";
      break;
  }
  return Yf(e, t, r);
}
function Yf(e, t, r) {
  return Y(e) ? (Bw(e) ? (parseFloat(e) / 100) * t + (r || 0) : parseFloat(e)) : e == null ? NaN : +e;
}
function Bw(e) {
  return !!Ew(e).match(/%$/);
}
function ft(e, t, r) {
  return isNaN(t) ? (r ? "" + e : +e) : ((t = Ut(ht(0, t), sy)), (e = (+e).toFixed(t)), r ? e : +e);
}
function ec(e) {
  return (
    e.sort(function (t, r) {
      return t - r;
    }),
    e
  );
}
function Pr(e) {
  if (((e = +e), isNaN(e))) return 0;
  if (e > 1e-14) {
    for (var t = 1, r = 0; r < 15; r++, t *= 10) if (dr(e * t) / t === e) return r;
  }
  return Nw(e);
}
function Nw(e) {
  var t = e.toString().toLowerCase(),
    r = t.indexOf("e"),
    n = r > 0 ? +t.slice(r + 1) : 0,
    i = r > 0 ? r : t.length,
    a = t.indexOf("."),
    o = a < 0 ? 0 : i - 1 - a;
  return ht(0, o - n);
}
function Fw(e, t, r) {
  var n = Pt(e[1] - e[0]);
  if (!isFinite(n) || n === 0) return NaN;
  var i = Ia(2 * Pt(r || 1) * Pt(n)) / Wf,
    a = Ia(Pt(t)) / Wf,
    o = ht(0, Za(-i + a));
  return (isFinite(o) || (o = NaN), o);
}
function zw(e, t) {
  var r = ht(Pr(e), Pr(t)),
    n = e + t;
  return r > sy ? n : ft(n, r);
}
var sd = Li(2, 53) - 1;
function ly(e) {
  var t = Rw * 2;
  return ((e % t) + t) % t;
}
function Rs(e) {
  return e > -ad && e < ad;
}
var Hw =
  /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;
function Pi(e) {
  if (e instanceof Date) return e;
  if (Y(e)) {
    var t = Hw.exec(e);
    if (!t) return new Date(NaN);
    if (t[8]) {
      var r = +t[4] || 0;
      return (
        t[8].toUpperCase() !== "Z" && (r -= +t[8].slice(0, 3)),
        new Date(
          Date.UTC(+t[1], +(t[2] || 1) - 1, +t[3] || 1, r, +(t[5] || 0), +t[6] || 0, t[7] ? +t[7].substring(0, 3) : 0),
        )
      );
    } else
      return new Date(
        +t[1],
        +(t[2] || 1) - 1,
        +t[3] || 1,
        +t[4] || 0,
        +(t[5] || 0),
        +t[6] || 0,
        t[7] ? +t[7].substring(0, 3) : 0,
      );
  } else if (e == null) return new Date(NaN);
  return new Date(dr(e));
}
function uy(e) {
  return Li(10, rc(e));
}
function rc(e) {
  if (e === 0) return 0;
  var t = _i(Ia(e) / Wf);
  return (e / Li(10, t) >= 10 && t++, t);
}
var fy = 2;
function nc(e, t) {
  var r = rc(e),
    n = Li(10, r),
    i = e / n,
    a;
  return (
    t === fy
      ? (a = 1)
      : t
        ? i < 1.5
          ? (a = 1)
          : i < 2.5
            ? (a = 2)
            : i < 4
              ? (a = 3)
              : i < 7
                ? (a = 5)
                : (a = 10)
        : i < 1
          ? (a = 1)
          : i < 2
            ? (a = 2)
            : i < 3
              ? (a = 3)
              : i < 5
                ? (a = 5)
                : (a = 10),
    (e = a * n),
    ft(e, -r)
  );
}
function Os(e) {
  var t = parseFloat(e);
  return t == e && (t !== 0 || !Y(e) || e.indexOf("x") <= 0) ? t : NaN;
}
function Vw(e) {
  return !isNaN(Os(e));
}
function ic() {
  return dr(Ow() * 9);
}
function hy(e, t) {
  return t === 0 ? e : hy(t, e % t);
}
function ld(e, t) {
  return e == null ? t : t == null ? e : (e * t) / hy(e, t);
}
function Ie(e) {
  return e != null && isFinite(e);
}
var Gw = "[ECharts] ",
  Uw = typeof console < "u" && console.warn && console.log;
function Ww(e, t, r) {
  Uw && console[e](Gw + t);
}
function cy(e, t) {
  Ww("error", e);
}
function ne(e) {
  throw new Error(e);
}
function ud(e, t, r) {
  return (t - e) * r + e;
}
var vy = "series\0",
  Yw = "\0_ec_\0";
function jt(e) {
  return e instanceof Array ? e : e == null ? [] : [e];
}
function fd(e, t, r) {
  if (e) {
    ((e[t] = e[t] || {}), (e.emphasis = e.emphasis || {}), (e.emphasis[t] = e.emphasis[t] || {}));
    for (var n = 0, i = r.length; n < i; n++) {
      var a = r[n];
      !e.emphasis[t].hasOwnProperty(a) && e[t].hasOwnProperty(a) && (e.emphasis[t][a] = e[t][a]);
    }
  }
}
var hd = [
  "fontStyle",
  "fontWeight",
  "fontSize",
  "fontFamily",
  "rich",
  "tag",
  "color",
  "textBorderColor",
  "textBorderWidth",
  "width",
  "height",
  "lineHeight",
  "align",
  "verticalAlign",
  "baseline",
  "shadowColor",
  "shadowBlur",
  "shadowOffsetX",
  "shadowOffsetY",
  "textShadowColor",
  "textShadowBlur",
  "textShadowOffsetX",
  "textShadowOffsetY",
  "backgroundColor",
  "borderColor",
  "borderWidth",
  "borderRadius",
  "padding",
];
function qa(e) {
  return Z(e) && !U(e) && !(e instanceof Date) ? e.value : e;
}
function Xw(e) {
  return Z(e) && !(e instanceof Array);
}
function $w(e, t, r) {
  var n = r === "normalMerge",
    i = r === "replaceMerge",
    a = r === "replaceAll";
  ((e = e || []), (t = (t || []).slice()));
  var o = Q();
  I(t, function (l, u) {
    if (!Z(l)) {
      t[u] = null;
      return;
    }
  });
  var s = Zw(e, o, r);
  return ((n || i) && qw(s, e, o, t), n && Kw(s, t), n || i ? Qw(s, t, i) : a && jw(s, t), Jw(s), s);
}
function Zw(e, t, r) {
  var n = [];
  if (r === "replaceAll") return n;
  for (var i = 0; i < e.length; i++) {
    var a = e[i];
    (a && a.id != null && t.set(a.id, i),
      n.push({ existing: r === "replaceMerge" || La(a) ? null : a, newOption: null, keyInfo: null, brandNew: null }));
  }
  return n;
}
function qw(e, t, r, n) {
  I(n, function (i, a) {
    if (!(!i || i.id == null)) {
      var o = ga(i.id),
        s = r.get(o);
      if (s != null) {
        var l = e[s];
        (vr(!l.newOption, 'Duplicated option on id "' + o + '".'),
          (l.newOption = i),
          (l.existing = t[s]),
          (n[a] = null));
      }
    }
  });
}
function Kw(e, t) {
  I(t, function (r, n) {
    if (!(!r || r.name == null))
      for (var i = 0; i < e.length; i++) {
        var a = e[i].existing;
        if (!e[i].newOption && a && (a.id == null || r.id == null) && !La(r) && !La(a) && dy("name", a, r)) {
          ((e[i].newOption = r), (t[n] = null));
          return;
        }
      }
  });
}
function Qw(e, t, r) {
  I(t, function (n) {
    if (n) {
      for (
        var i, a = 0;
        (i = e[a]) && (i.newOption || La(i.existing) || (i.existing && n.id != null && !dy("id", n, i.existing)));
      )
        a++;
      (i ? ((i.newOption = n), (i.brandNew = r)) : e.push({ newOption: n, brandNew: r, existing: null, keyInfo: null }),
        a++);
    }
  });
}
function jw(e, t) {
  I(t, function (r) {
    e.push({ newOption: r, brandNew: !0, existing: null, keyInfo: null });
  });
}
function Jw(e) {
  var t = Q();
  (I(e, function (r) {
    var n = r.existing;
    n && t.set(n.id, r);
  }),
    I(e, function (r) {
      var n = r.newOption;
      (vr(!n || n.id == null || !t.get(n.id) || t.get(n.id) === r, "id duplicates: " + (n && n.id)),
        n && n.id != null && t.set(n.id, r),
        !r.keyInfo && (r.keyInfo = {}));
    }),
    I(e, function (r, n) {
      var i = r.existing,
        a = r.newOption,
        o = r.keyInfo;
      if (Z(a)) {
        if (((o.name = a.name != null ? ga(a.name) : i ? i.name : vy + n), i)) o.id = ga(i.id);
        else if (a.id != null) o.id = ga(a.id);
        else {
          var s = 0;
          do o.id = "\0" + o.name + "\0" + s++;
          while (t.get(o.id));
        }
        t.set(o.id, r);
      }
    }));
}
function dy(e, t, r) {
  var n = je(t[e], null),
    i = je(r[e], null);
  return n != null && i != null && n === i;
}
function ga(e) {
  return je(e, "");
}
function je(e, t) {
  return e == null ? t : Y(e) ? e : wt(e) || Tf(e) ? e + "" : t;
}
function ac(e) {
  var t = e.name;
  return !!(t && t.indexOf(vy));
}
function La(e) {
  return e && e.id != null && ga(e.id).indexOf(Yw) === 0;
}
function tT(e, t, r) {
  I(e, function (n) {
    var i = n.newOption;
    Z(i) && ((n.keyInfo.mainType = t), (n.keyInfo.subType = eT(t, i, n.existing, r)));
  });
}
function eT(e, t, r, n) {
  var i = t.type ? t.type : r ? r.subType : n.determineSubType(e, t);
  return i;
}
function En(e, t) {
  if (t.dataIndexInside != null) return t.dataIndexInside;
  if (t.dataIndex != null)
    return U(t.dataIndex)
      ? j(t.dataIndex, function (r) {
          return e.indexOfRawIndex(r);
        })
      : e.indexOfRawIndex(t.dataIndex);
  if (t.name != null)
    return U(t.name)
      ? j(t.name, function (r) {
          return e.indexOfName(r);
        })
      : e.indexOfName(t.name);
}
function St() {
  var e = "__ec_inner_" + rT++;
  return function (t) {
    return t[e] || (t[e] = {});
  };
}
var rT = ic();
function yu(e, t, r) {
  var n = oc(t, r),
    i = n.mainTypeSpecified,
    a = n.queryOptionMap,
    o = n.others,
    s = o,
    l = r ? r.defaultMainType : null;
  return (
    !i && l && a.set(l, {}),
    a.each(function (u, f) {
      var h = Ka(e, f, u, {
        useDefault: l === f,
        enableAll: r && r.enableAll != null ? r.enableAll : !0,
        enableNone: r && r.enableNone != null ? r.enableNone : !0,
      });
      ((s[f + "Models"] = h.models), (s[f + "Model"] = h.models[0]));
    }),
    s
  );
}
function oc(e, t) {
  var r;
  if (Y(e)) {
    var n = {};
    ((n[e + "Index"] = 0), (r = n));
  } else r = e;
  var i = Q(),
    a = {},
    o = !1;
  return (
    I(r, function (s, l) {
      if (l === "dataIndex" || l === "dataIndexInside") {
        a[l] = s;
        return;
      }
      var u = l.match(/^(\w+)(Index|Id|Name)$/) || [],
        f = u[1],
        h = (u[2] || "").toLowerCase();
      if (!(!f || !h || (t && t.includeMainTypes && vt(t.includeMainTypes, f) < 0))) {
        o = o || !!f;
        var c = i.get(f) || i.set(f, {});
        c[h] = s;
      }
    }),
    { mainTypeSpecified: o, queryOptionMap: i, others: a }
  );
}
var xe = { useDefault: !0, enableAll: !1, enableNone: !1 };
function Ka(e, t, r, n) {
  n = n || xe;
  var i = r.index,
    a = r.id,
    o = r.name,
    s = { models: null, specified: i != null || a != null || o != null };
  if (!s.specified) {
    var l = void 0;
    return ((s.models = n.useDefault && (l = e.getComponent(t)) ? [l] : []), s);
  }
  if (i === "none" || i === !1) {
    if (n.enableNone) return ((s.models = []), s);
    i = -1;
  }
  return (
    i === "all" && (n.enableAll ? (i = a = o = null) : (i = -1)),
    (s.models = e.queryComponents({ mainType: t, index: i, id: a, name: o })),
    s
  );
}
function nT(e, t, r) {
  var n = {};
  ((n[t + "Id"] = e[t + "Id"]), (n[t + "Index"] = e[t + "Index"]), (n[t + "Name"] = e[t + "Name"]));
  var i = { mainType: t, query: n };
  return (r && (i.subType = r), i);
}
function py(e, t, r) {
  e.setAttribute ? e.setAttribute(t, r) : (e[t] = r);
}
function iT(e, t) {
  return e.getAttribute ? e.getAttribute(t) : e[t];
}
function aT(e) {
  return e === "auto" ? (nt.domSupported ? "html" : "richText") : e || "html";
}
function oT(e, t, r, n, i) {
  var a = t == null || t === "auto";
  if (n == null) return n;
  if (wt(n)) {
    var o = ud(r || 0, n, i);
    return ft(o, a ? Math.max(Pr(r || 0), Pr(n)) : t);
  } else {
    if (Y(n)) return i < 1 ? r : n;
    for (var s = [], l = r, u = n, f = Math.max(l ? l.length : 0, u.length), h = 0; h < f; ++h) {
      var c = e.getDimensionInfo(h);
      if (c && c.type === "ordinal") s[h] = (i < 1 && l ? l : u)[h];
      else {
        var v = l && l[h] ? l[h] : 0,
          d = u[h],
          o = ud(v, d, i);
        s[h] = ft(o, a ? Math.max(Pr(v), Pr(d)) : t);
      }
    }
    return s;
  }
}
function be() {
  return [1 / 0, -1 / 0];
}
function Xf(e, t) {
  pr(t) && (t < e[0] && (e[0] = t), t > e[1] && (e[1] = t));
}
function gy(e, t) {
  pr(t) && t < e[0] && (e[0] = t);
}
function my(e, t) {
  pr(t) && t > e[1] && (e[1] = t);
}
function sT(e, t) {
  Si(t[0], t[1]) && (t[0] < e[0] && (e[0] = t[0]), t[1] > e[1] && (e[1] = t[1]));
}
function pr(e) {
  return e != null && isFinite(e);
}
function Si(e, t) {
  return pr(e) && pr(t) && e <= t;
}
function lT(e) {
  var t = e[1] - e[0];
  return isFinite(t) && t >= 0;
}
function uT(e) {
  Si(e[0], e[1]) && e[0] > e[1] && (e[0] = e[1]);
}
function yy() {
  var e = "__ec_once_" + fT++;
  return function (t, r) {
    Qt(t, e) || ((t[e] = 1), r());
  };
}
var fT = ic();
function sc(e, t, r) {
  var n = Q(),
    i = 0;
  (I(e, function (a) {
    var o = t(a),
      s = n.get(o) || 0;
    (r && r(a, s), !s && !r && (e[i++] = a), n.set(o, s + 1));
  }),
    r || (e.length = i));
}
function hT(e) {
  return e.value + "";
}
function cT(e) {
  return e + "";
}
function vT(e, t) {
  return q(t, !0) ? e.seriesIndex + 2 : 0;
}
function _y(e, t, r) {
  var n = e.getData().count();
  return {
    progressiveRender: r.progressiveEnabled && t.incrementalPrepareRender && n >= r.threshold,
    large: e.get("large") && n >= e.get("largeThreshold"),
    modDataCount: e.get("progressiveChunkMode") === "mod" ? e.getData().count() : null,
  };
}
function lc(e) {
  return { overallReset: e };
}
var dT = ".",
  tn = "___EC__COMPONENT__CONTAINER___",
  Sy = "___EC__EXTENDED_CLASS___";
function $e(e) {
  var t = { main: "", sub: "" };
  if (e) {
    var r = e.split(dT);
    ((t.main = r[0] || ""), (t.sub = r[1] || ""));
  }
  return t;
}
function pT(e) {
  vr(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(e), 'componentType "' + e + '" illegal');
}
function gT(e) {
  return !!(e && e[Sy]);
}
function uc(e, t) {
  ((e.$constructor = e),
    (e.extend = function (r) {
      var n = this,
        i;
      return (
        mT(n)
          ? (i = (function (a) {
              V(o, a);
              function o() {
                return a.apply(this, arguments) || this;
              }
              return o;
            })(n))
          : ((i = function () {
              (r.$constructor || n).apply(this, arguments);
            }),
            nb(i, this)),
        N(i.prototype, r),
        (i[Sy] = !0),
        (i.extend = this.extend),
        (i.superCall = ST),
        (i.superApply = bT),
        (i.superClass = n),
        i
      );
    }));
}
function mT(e) {
  return et(e) && /^class\s/.test(Function.prototype.toString.call(e));
}
function by(e, t) {
  e.extend = t.extend;
}
var yT = Math.round(Math.random() * 10);
function _T(e) {
  var t = ["__\0is_clz", yT++].join("_");
  ((e.prototype[t] = !0),
    (e.isInstance = function (r) {
      return !!(r && r[t]);
    }));
}
function ST(e, t) {
  for (var r = [], n = 2; n < arguments.length; n++) r[n - 2] = arguments[n];
  return this.superClass.prototype[t].apply(e, r);
}
function bT(e, t, r) {
  return this.superClass.prototype[t].apply(e, r);
}
function dl(e) {
  var t = {};
  ((e.registerClass = function (n) {
    var i = n.type || n.prototype.type;
    if (i) {
      (pT(i), (n.prototype.type = i));
      var a = $e(i);
      if (!a.sub) t[a.main] = n;
      else if (a.sub !== tn) {
        var o = r(a);
        o[a.sub] = n;
      }
    }
    return n;
  }),
    (e.getClass = function (n, i, a) {
      var o = t[n];
      if ((o && o[tn] && (o = i ? o[i] : null), a && !o))
        throw new Error(
          i ? "Component " + n + "." + (i || "") + " is used but not imported." : n + ".type should be specified.",
        );
      return o;
    }),
    (e.getClassesByMainType = function (n) {
      var i = $e(n),
        a = [],
        o = t[i.main];
      return (
        o && o[tn]
          ? I(o, function (s, l) {
              l !== tn && a.push(s);
            })
          : a.push(o),
        a
      );
    }),
    (e.hasClass = function (n) {
      var i = $e(n);
      return !!t[i.main];
    }),
    (e.getAllClassMainTypes = function () {
      var n = [];
      return (
        I(t, function (i, a) {
          n.push(a);
        }),
        n
      );
    }),
    (e.hasSubTypes = function (n) {
      var i = $e(n),
        a = t[i.main];
      return a && a[tn];
    }));
  function r(n) {
    var i = t[n.main];
    return ((!i || !i[tn]) && ((i = t[n.main] = {}), (i[tn] = !0)), i);
  }
}
function Pa(e, t) {
  for (var r = 0; r < e.length; r++) e[r][1] || (e[r][1] = e[r][0]);
  return (
    (t = t || !1),
    function (n, i, a) {
      for (var o = {}, s = 0; s < e.length; s++) {
        var l = e[s][1];
        if (!((i && vt(i, l) >= 0) || (a && vt(a, l) < 0))) {
          var u = n.getShallow(l, t);
          u != null && (o[e[s][0]] = u);
        }
      }
      return o;
    }
  );
}
var wT = [["fill", "color"], ["shadowBlur"], ["shadowOffsetX"], ["shadowOffsetY"], ["opacity"], ["shadowColor"]],
  TT = Pa(wT),
  xT = (function () {
    function e() {}
    return (
      (e.prototype.getAreaStyle = function (t, r) {
        return TT(this, t, r);
      }),
      e
    );
  })(),
  $f = new mi(50);
function CT(e) {
  if (typeof e == "string") {
    var t = $f.get(e);
    return t && t.image;
  } else return e;
}
function wy(e, t, r, n, i) {
  if (e)
    if (typeof e == "string") {
      if ((t && t.__zrImageSrc === e) || !r) return t;
      var a = $f.get(e),
        o = { hostEl: r, cb: n, cbPayload: i };
      return (
        a
          ? ((t = a.image), !pl(t) && a.pending.push(o))
          : ((t = fe.loadImage(e, cd, cd)),
            (t.__zrImageSrc = e),
            $f.put(e, (t.__cachedImgObj = { image: t, pending: [o] }))),
        t
      );
    } else return e;
  else return t;
}
function cd() {
  var e = this.__cachedImgObj;
  this.onload = this.onerror = this.__cachedImgObj = null;
  for (var t = 0; t < e.pending.length; t++) {
    var r = e.pending[t],
      n = r.cb;
    (n && n(this, r.cbPayload), r.hostEl.dirty());
  }
  e.pending.length = 0;
}
function pl(e) {
  return e && e.width && e.height;
}
var _u = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;
function DT(e, t, r, n, i, a) {
  if (!r) {
    ((e.text = ""), (e.isTruncated = !1));
    return;
  }
  var o = (t + "").split(`
`);
  a = Ty(r, n, i, a);
  for (var s = !1, l = {}, u = 0, f = o.length; u < f; u++)
    (xy(l, o[u], a), (o[u] = l.textLine), (s = s || l.isTruncated));
  ((e.text = o.join(`
`)),
    (e.isTruncated = s));
}
function Ty(e, t, r, n) {
  n = n || {};
  var i = N({}, n);
  ((r = q(r, "...")), (i.maxIterations = q(n.maxIterations, 2)));
  var a = (i.minChar = q(n.minChar, 0)),
    o = (i.fontMeasureInfo = Ke(t)),
    s = o.asciiCharWidth;
  i.placeholder = q(n.placeholder, "");
  for (var l = (e = Math.max(0, e - 1)), u = 0; u < a && l >= s; u++) l -= s;
  var f = Qe(o, r);
  return (
    f > l && ((r = ""), (f = 0)),
    (l = e - f),
    (i.ellipsis = r),
    (i.ellipsisWidth = f),
    (i.contentWidth = l),
    (i.containerWidth = e),
    i
  );
}
function xy(e, t, r) {
  var n = r.containerWidth,
    i = r.contentWidth,
    a = r.fontMeasureInfo;
  if (!n) {
    ((e.textLine = ""), (e.isTruncated = !1));
    return;
  }
  var o = Qe(a, t);
  if (o <= n) {
    ((e.textLine = t), (e.isTruncated = !1));
    return;
  }
  for (var s = 0; ; s++) {
    if (o <= i || s >= r.maxIterations) {
      t += r.ellipsis;
      break;
    }
    var l = s === 0 ? AT(t, i, a) : o > 0 ? Math.floor((t.length * i) / o) : 0;
    ((t = t.substr(0, l)), (o = Qe(a, t)));
  }
  (t === "" && (t = r.placeholder), (e.textLine = t), (e.isTruncated = !0));
}
function AT(e, t, r) {
  for (var n = 0, i = 0, a = e.length; i < a && n < t; i++) n += ny(r, e.charCodeAt(i));
  return i;
}
function MT(e, t, r, n) {
  var i = fc(e),
    a = t.overflow,
    o = t.padding,
    s = o ? o[1] + o[3] : 0,
    l = o ? o[0] + o[2] : 0,
    u = t.font,
    f = a === "truncate",
    h = hl(u),
    c = q(t.lineHeight, h),
    v = t.lineOverflow === "truncate",
    d = !1,
    p = t.width;
  p == null && r != null && (p = r - s);
  var m = t.height;
  m == null && n != null && (m = n - l);
  var g;
  p != null && (a === "break" || a === "breakAll")
    ? (g = i ? Cy(i, t.font, p, a === "breakAll", 0).lines : [])
    : (g = i
        ? i.split(`
`)
        : []);
  var y = g.length * c;
  if ((m == null && (m = y), y > m && v)) {
    var _ = Math.floor(m / c);
    ((d = d || g.length > _), (g = g.slice(0, _)), (y = g.length * c));
  }
  if (i && f && p != null)
    for (
      var S = Ty(p, u, t.ellipsis, { minChar: t.truncateMinChar, placeholder: t.placeholder }), b = {}, w = 0;
      w < g.length;
      w++
    )
      (xy(b, g[w], S), (g[w] = b.textLine), (d = d || b.isTruncated));
  for (var T = m, C = 0, A = Ke(u), w = 0; w < g.length; w++) C = Math.max(Qe(A, g[w]), C);
  p == null && (p = C);
  var M = p;
  return (
    (T += l),
    (M += s),
    {
      lines: g,
      height: m,
      outerWidth: M,
      outerHeight: T,
      lineHeight: c,
      calculatedLineHeight: h,
      contentWidth: C,
      contentHeight: y,
      width: p,
      isTruncated: d,
    }
  );
}
var IT = (function () {
    function e() {}
    return e;
  })(),
  vd = (function () {
    function e(t) {
      ((this.tokens = []), t && (this.tokens = t));
    }
    return e;
  })(),
  LT = (function () {
    function e() {
      ((this.width = 0),
        (this.height = 0),
        (this.contentWidth = 0),
        (this.contentHeight = 0),
        (this.outerWidth = 0),
        (this.outerHeight = 0),
        (this.lines = []),
        (this.isTruncated = !1));
    }
    return e;
  })();
function PT(e, t, r, n, i) {
  var a = new LT(),
    o = fc(e);
  if (!o) return a;
  var s = t.padding,
    l = s ? s[1] + s[3] : 0,
    u = s ? s[0] + s[2] : 0,
    f = t.width;
  f == null && r != null && (f = r - l);
  var h = t.height;
  h == null && n != null && (h = n - u);
  for (
    var c = t.overflow,
      v =
        (c === "break" || c === "breakAll") && f != null
          ? { width: f, accumWidth: 0, breakAll: c === "breakAll" }
          : null,
      d = (_u.lastIndex = 0),
      p;
    (p = _u.exec(o)) != null;
  ) {
    var m = p.index;
    (m > d && Su(a, o.substring(d, m), t, v), Su(a, p[2], t, v, p[1]), (d = _u.lastIndex));
  }
  d < o.length && Su(a, o.substring(d, o.length), t, v);
  var g = [],
    y = 0,
    _ = 0,
    S = c === "truncate",
    b = t.lineOverflow === "truncate",
    w = {};
  function T(at, Et, Jt) {
    ((at.width = Et), (at.lineHeight = Jt), (y += Jt), (_ = Math.max(_, Et)));
  }
  t: for (var C = 0; C < a.lines.length; C++) {
    for (var A = a.lines[C], M = 0, D = 0, P = 0; P < A.tokens.length; P++) {
      var x = A.tokens[P],
        L = (x.styleName && t.rich[x.styleName]) || {},
        E = (x.textPadding = L.padding),
        R = E ? E[1] + E[3] : 0,
        B = (x.font = L.font || t.font);
      x.contentHeight = hl(B);
      var O = q(L.height, x.contentHeight);
      if (
        ((x.innerHeight = O),
        E && (O += E[0] + E[2]),
        (x.height = O),
        (x.lineHeight = ui(L.lineHeight, t.lineHeight, O)),
        (x.align = (L && L.align) || i),
        (x.verticalAlign = (L && L.verticalAlign) || "middle"),
        b && h != null && y + x.lineHeight > h)
      ) {
        var k = a.lines.length;
        (P > 0
          ? ((A.tokens = A.tokens.slice(0, P)), T(A, D, M), (a.lines = a.lines.slice(0, C + 1)))
          : (a.lines = a.lines.slice(0, C)),
          (a.isTruncated = a.isTruncated || a.lines.length < k));
        break t;
      }
      var z = L.width,
        H = z == null || z === "auto";
      if (typeof z == "string" && z.charAt(z.length - 1) === "%")
        ((x.percentWidth = z), g.push(x), (x.contentWidth = Qe(Ke(B), x.text)));
      else {
        if (H) {
          var W = L.backgroundColor,
            $ = W && W.image;
          $ && (($ = CT($)), pl($) && (x.width = Math.max(x.width, ($.width * O) / $.height)));
        }
        var G = S && f != null ? f - D : null;
        G != null && G < x.width
          ? !H || G < R
            ? ((x.text = ""), (x.width = x.contentWidth = 0))
            : (DT(w, x.text, G - R, B, t.ellipsis, { minChar: t.truncateMinChar }),
              (x.text = w.text),
              (a.isTruncated = a.isTruncated || w.isTruncated),
              (x.width = x.contentWidth = Qe(Ke(B), x.text)))
          : (x.contentWidth = Qe(Ke(B), x.text));
      }
      ((x.width += R), (D += x.width), L && (M = Math.max(M, x.lineHeight)));
    }
    T(A, D, M);
  }
  ((a.outerWidth = a.width = q(f, _)),
    (a.outerHeight = a.height = q(h, y)),
    (a.contentHeight = y),
    (a.contentWidth = _),
    (a.outerWidth += l),
    (a.outerHeight += u));
  for (var C = 0; C < g.length; C++) {
    var x = g[C],
      K = x.percentWidth;
    x.width = (parseInt(K, 10) / 100) * a.width;
  }
  return a;
}
function Su(e, t, r, n, i) {
  var a = t === "",
    o = (i && r.rich[i]) || {},
    s = e.lines,
    l = o.font || r.font,
    u = !1,
    f,
    h;
  if (n) {
    var c = o.padding,
      v = c ? c[1] + c[3] : 0;
    if (o.width != null && o.width !== "auto") {
      var d = Pn(o.width, n.width) + v;
      (s.length > 0 &&
        d + n.accumWidth > n.width &&
        ((f = t.split(`
`)),
        (u = !0)),
        (n.accumWidth = d));
    } else {
      var p = Cy(t, l, n.width, n.breakAll, n.accumWidth);
      ((n.accumWidth = p.accumWidth + v), (h = p.linesWidths), (f = p.lines));
    }
  }
  f ||
    (f = t.split(`
`));
  for (var m = Ke(l), g = 0; g < f.length; g++) {
    var y = f[g],
      _ = new IT();
    if (
      ((_.styleName = i),
      (_.text = y),
      (_.isLineHolder = !y && !a),
      typeof o.width == "number" ? (_.width = o.width) : (_.width = h ? h[g] : Qe(m, y)),
      !g && !u)
    ) {
      var S = (s[s.length - 1] || (s[0] = new vd())).tokens,
        b = S.length;
      b === 1 && S[0].isLineHolder ? (S[0] = _) : (y || !b || a) && S.push(_);
    } else s.push(new vd([_]));
  }
}
function ET(e) {
  var t = e.charCodeAt(0);
  return (t >= 32 && t <= 591) || (t >= 880 && t <= 4351) || (t >= 4608 && t <= 5119) || (t >= 7680 && t <= 8303);
}
var RT = Mi(
  ",&?/;] ".split(""),
  function (e, t) {
    return ((e[t] = !0), e);
  },
  {},
);
function OT(e) {
  return ET(e) ? !!RT[e] : !0;
}
function Cy(e, t, r, n, i) {
  for (var a = [], o = [], s = "", l = "", u = 0, f = 0, h = Ke(t), c = 0; c < e.length; c++) {
    var v = e.charAt(c);
    if (
      v ===
      `
`
    ) {
      (l && ((s += l), (f += u)), a.push(s), o.push(f), (s = ""), (l = ""), (u = 0), (f = 0));
      continue;
    }
    var d = ny(h, v.charCodeAt(0)),
      p = n ? !1 : !OT(v);
    if (a.length ? f + d > r : i + f + d > r) {
      f
        ? (s || l) &&
          (p
            ? (s || ((s = l), (l = ""), (u = 0), (f = u)),
              a.push(s),
              o.push(f - u),
              (l += v),
              (u += d),
              (s = ""),
              (f = u))
            : (l && ((s += l), (l = ""), (u = 0)), a.push(s), o.push(f), (s = v), (f = d)))
        : p
          ? (a.push(l), o.push(u), (l = v), (u = d))
          : (a.push(v), o.push(d));
      continue;
    }
    ((f += d), p ? ((l += v), (u += d)) : (l && ((s += l), (l = ""), (u = 0)), (s += v)));
  }
  return (
    l && (s += l),
    s && (a.push(s), o.push(f)),
    a.length === 1 && (f += i),
    { accumWidth: f, lines: a, linesWidths: o }
  );
}
function dd(e, t, r, n, i, a) {
  if (((e.baseX = r), (e.baseY = n), (e.outerWidth = e.outerHeight = null), !!t)) {
    var o = t.width * 2,
      s = t.height * 2;
    (J.set(pd, yi(r, o, i), An(n, s, a), o, s), J.intersect(t, pd, null, gd));
    var l = gd.outIntersectRect;
    ((e.outerWidth = l.width),
      (e.outerHeight = l.height),
      (e.baseX = yi(l.x, l.width, i, !0)),
      (e.baseY = An(l.y, l.height, a, !0)));
  }
}
var pd = new J(0, 0, 0, 0),
  gd = { outIntersectRect: {}, clamp: !0 };
function fc(e) {
  return e != null ? (e += "") : (e = "");
}
function kT(e) {
  var t = fc(e.text),
    r = e.font,
    n = Qe(Ke(r), t),
    i = hl(r);
  return Zf(e, n, i, null);
}
function Zf(e, t, r, n) {
  var i = new J(yi(e.x || 0, t, e.textAlign), An(e.y || 0, r, e.textBaseline), t, r),
    a = n ?? (Dy(e) ? e.lineWidth : 0);
  return (a > 0 && ((i.x -= a / 2), (i.y -= a / 2), (i.width += a), (i.height += a)), i);
}
function Dy(e) {
  var t = e.stroke;
  return t != null && t !== "none" && e.lineWidth > 0;
}
var qf = "__zr_style_" + Math.round(Math.random() * 10),
  Mn = { shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0, shadowColor: "#000", opacity: 1, blend: "source-over" },
  gl = { style: { shadowBlur: !0, shadowOffsetX: !0, shadowOffsetY: !0, shadowColor: !0, opacity: !0 } };
Mn[qf] = !0;
var md = ["z", "z2", "invisible"],
  BT = ["invisible"],
  Qa = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype._init = function (r) {
        for (var n = xt(r), i = 0; i < n.length; i++) {
          var a = n[i];
          a === "style" ? this.useStyle(r[a]) : e.prototype.attrKV.call(this, a, r[a]);
        }
        this.style || this.useStyle({});
      }),
      (t.prototype.beforeBrush = function (r) {}),
      (t.prototype.afterBrush = function () {}),
      (t.prototype.innerBeforeBrush = function () {}),
      (t.prototype.innerAfterBrush = function () {}),
      (t.prototype.shouldBePainted = function (r, n, i, a) {
        var o = this.transform;
        if (
          this.ignore ||
          this.invisible ||
          this.style.opacity === 0 ||
          (this.culling && NT(this, r, n)) ||
          (o && !o[0] && !o[3])
        )
          return !1;
        if (i && this.__clipPaths && this.__clipPaths.length) {
          for (var s = 0; s < this.__clipPaths.length; ++s) if (this.__clipPaths[s].isZeroArea()) return !1;
        }
        if (a && this.parent)
          for (var l = this.parent; l; ) {
            if (l.ignore) return !1;
            l = l.parent;
          }
        return !0;
      }),
      (t.prototype.contain = function (r, n) {
        return this.rectContain(r, n);
      }),
      (t.prototype.traverse = function (r, n) {
        r.call(n, this);
      }),
      (t.prototype.rectContain = function (r, n) {
        var i = this.transformCoordToLocal(r, n),
          a = this.getBoundingRect();
        return a.contain(i[0], i[1]);
      }),
      (t.prototype.getPaintRect = function () {
        var r = this._paintRect;
        if (!this._paintRect || this.__dirty) {
          var n = this.transform,
            i = this.getBoundingRect(),
            a = this.style,
            o = a.shadowBlur || 0,
            s = a.shadowOffsetX || 0,
            l = a.shadowOffsetY || 0;
          ((r = this._paintRect || (this._paintRect = new J(0, 0, 0, 0))),
            n ? J.applyTransform(r, i, n) : r.copy(i),
            (o || s || l) &&
              ((r.width += o * 2 + Math.abs(s)),
              (r.height += o * 2 + Math.abs(l)),
              (r.x = Math.min(r.x, r.x + s - o)),
              (r.y = Math.min(r.y, r.y + l - o))));
          var u = this.dirtyRectTolerance;
          r.isZero() ||
            ((r.x = Math.floor(r.x - u)),
            (r.y = Math.floor(r.y - u)),
            (r.width = Math.ceil(r.width + 1 + u * 2)),
            (r.height = Math.ceil(r.height + 1 + u * 2)));
        }
        return r;
      }),
      (t.prototype.setPrevPaintRect = function (r) {
        r
          ? ((this._prevPaintRect = this._prevPaintRect || new J(0, 0, 0, 0)), this._prevPaintRect.copy(r))
          : (this._prevPaintRect = null);
      }),
      (t.prototype.getPrevPaintRect = function () {
        return this._prevPaintRect;
      }),
      (t.prototype.animateStyle = function (r) {
        return this.animate("style", r);
      }),
      (t.prototype.updateDuringAnimation = function (r) {
        r === "style" ? this.dirtyStyle() : this.markRedraw();
      }),
      (t.prototype.attrKV = function (r, n) {
        r !== "style" ? e.prototype.attrKV.call(this, r, n) : this.style ? this.setStyle(n) : this.useStyle(n);
      }),
      (t.prototype.setStyle = function (r, n) {
        return (typeof r == "string" ? (this.style[r] = n) : N(this.style, r), this.dirtyStyle(), this);
      }),
      (t.prototype.dirtyStyle = function (r) {
        (r || this.markRedraw(), (this.__dirty |= oa), this._rect && (this._rect = null));
      }),
      (t.prototype.dirty = function () {
        this.dirtyStyle();
      }),
      (t.prototype.styleChanged = function () {
        return !!(this.__dirty & oa);
      }),
      (t.prototype.styleUpdated = function () {
        this.__dirty &= ~oa;
      }),
      (t.prototype.createStyle = function (r) {
        return ul(Mn, r);
      }),
      (t.prototype.useStyle = function (r) {
        (r[qf] || (r = this.createStyle(r)), (this.style = r), this.dirtyStyle());
      }),
      (t.prototype._useHoverStyle = function (r) {
        this.__hoverStyle = r;
      }),
      (t.prototype.isStyleObject = function (r) {
        return r[qf];
      }),
      (t.prototype._innerSaveToNormal = function (r) {
        e.prototype._innerSaveToNormal.call(this, r);
        var n = this._normalState;
        (r.style && !n.style && (n.style = this._mergeStyle(this.createStyle(), this.style)),
          this._savePrimaryToNormal(r, n, md));
      }),
      (t.prototype._applyStateObj = function (r, n, i, a, o, s) {
        e.prototype._applyStateObj.call(this, r, n, i, a, o, s);
        var l = !(n && a),
          u = this.__inHover === cl,
          f;
        if (
          (n && n.style
            ? o
              ? a
                ? (f = n.style)
                : ((f = this._mergeStyle(this.createStyle(), i.style)), this._mergeStyle(f, n.style))
              : ((f = this._mergeStyle(this.createStyle(), a ? this.style : i.style)), this._mergeStyle(f, n.style))
            : l && (f = i.style),
          f)
        )
          if (o) {
            var h = this.style;
            if (((this.style = this.createStyle(l ? {} : h)), l))
              for (var c = xt(h), v = 0; v < c.length; v++) {
                var d = c[v];
                d in f && ((f[d] = f[d]), (this.style[d] = h[d]));
              }
            for (var p = xt(f), v = 0; v < p.length; v++) {
              var d = p[v];
              this.style[d] = this.style[d];
            }
            this._transitionState(r, { style: f }, s, this.getAnimationStyleProps());
          } else u ? this._useHoverStyle(f) : this.useStyle(f);
        if (!u)
          for (var m = this.__inHover ? BT : md, v = 0; v < m.length; v++) {
            var d = m[v];
            n && n[d] != null ? (this[d] = n[d]) : l && i[d] != null && (this[d] = i[d]);
          }
      }),
      (t.prototype._mergeStates = function (r) {
        for (var n = e.prototype._mergeStates.call(this, r), i, a = 0; a < r.length; a++) {
          var o = r[a];
          o.style && ((i = i || {}), this._mergeStyle(i, o.style));
        }
        return (i && (n.style = i), n);
      }),
      (t.prototype._mergeStyle = function (r, n) {
        return (N(r, n), r);
      }),
      (t.prototype.getAnimationStyleProps = function () {
        return gl;
      }),
      (t.initDefaultProps = (function () {
        var r = t.prototype;
        ((r.type = "displayable"),
          (r.invisible = !1),
          (r.z = 0),
          (r.z2 = 0),
          (r.zlevel = 0),
          (r.culling = !1),
          (r.cursor = "pointer"),
          (r.rectHover = !1),
          (r.incremental = 0),
          (r._rect = null),
          (r.dirtyRectTolerance = 0),
          (r.__dirty = ie | oa));
      })()),
      t
    );
  })(vl),
  bu = new J(0, 0, 0, 0),
  wu = new J(0, 0, 0, 0);
function NT(e, t, r) {
  return (
    bu.copy(e.getBoundingRect()),
    e.transform && bu.applyTransform(e.transform),
    (wu.width = t),
    (wu.height = r),
    !bu.intersect(wu)
  );
}
var we = Math.min,
  Te = Math.max,
  Tu = Math.sin,
  xu = Math.cos,
  en = Math.PI * 2,
  po = Ii(),
  go = Ii(),
  mo = Ii();
function yd(e, t, r, n, i, a) {
  ((i[0] = we(e, r)), (i[1] = we(t, n)), (a[0] = Te(e, r)), (a[1] = Te(t, n)));
}
var _d = [],
  Sd = [];
function FT(e, t, r, n, i, a, o, s, l, u) {
  var f = qm,
    h = Nt,
    c = f(e, r, i, o, _d);
  ((l[0] = 1 / 0), (l[1] = 1 / 0), (u[0] = -1 / 0), (u[1] = -1 / 0));
  for (var v = 0; v < c; v++) {
    var d = h(e, r, i, o, _d[v]);
    ((l[0] = we(d, l[0])), (u[0] = Te(d, u[0])));
  }
  c = f(t, n, a, s, Sd);
  for (var v = 0; v < c; v++) {
    var p = h(t, n, a, s, Sd[v]);
    ((l[1] = we(p, l[1])), (u[1] = Te(p, u[1])));
  }
  ((l[0] = we(e, l[0])),
    (u[0] = Te(e, u[0])),
    (l[0] = we(o, l[0])),
    (u[0] = Te(o, u[0])),
    (l[1] = we(t, l[1])),
    (u[1] = Te(t, u[1])),
    (l[1] = we(s, l[1])),
    (u[1] = Te(s, u[1])));
}
function zT(e, t, r, n, i, a, o, s) {
  var l = Km,
    u = re,
    f = Te(we(l(e, r, i), 1), 0),
    h = Te(we(l(t, n, a), 1), 0),
    c = u(e, r, i, f),
    v = u(t, n, a, h);
  ((o[0] = we(e, i, c)), (o[1] = we(t, a, v)), (s[0] = Te(e, i, c)), (s[1] = Te(t, a, v)));
}
function HT(e, t, r, n, i, a, o, s, l) {
  var u = ni,
    f = ii,
    h = Math.abs(i - a);
  if (h % en < 1e-4 && h > 1e-4) {
    ((s[0] = e - r), (s[1] = t - n), (l[0] = e + r), (l[1] = t + n));
    return;
  }
  if (
    ((po[0] = xu(i) * r + e),
    (po[1] = Tu(i) * n + t),
    (go[0] = xu(a) * r + e),
    (go[1] = Tu(a) * n + t),
    u(s, po, go),
    f(l, po, go),
    (i = i % en),
    i < 0 && (i = i + en),
    (a = a % en),
    a < 0 && (a = a + en),
    i > a && !o ? (a += en) : i < a && o && (i += en),
    o)
  ) {
    var c = a;
    ((a = i), (i = c));
  }
  for (var v = 0; v < a; v += Math.PI / 2)
    v > i && ((mo[0] = xu(v) * r + e), (mo[1] = Tu(v) * n + t), u(s, mo, s), f(l, mo, l));
}
var ct = { M: 1, L: 2, C: 3, Q: 4, A: 5, Z: 6, R: 7 },
  rn = [],
  nn = [],
  He = [],
  _r = [],
  Ve = [],
  Ge = [],
  Cu = Math.min,
  Du = Math.max,
  an = Math.cos,
  on = Math.sin,
  ar = Math.abs,
  Kf = Math.PI,
  Mr = Kf * 2,
  Au = typeof Float32Array < "u",
  Ui = [];
function Mu(e) {
  var t = Math.round((e / Kf) * 1e8) / 1e8;
  return (t % 2) * Kf;
}
function VT(e, t) {
  var r = Mu(e[0]);
  r < 0 && (r += Mr);
  var n = r - e[0],
    i = e[1];
  ((i += n),
    !t && i - r >= Mr
      ? (i = r + Mr)
      : t && r - i >= Mr
        ? (i = r - Mr)
        : !t && r > i
          ? (i = r + (Mr - Mu(r - i)))
          : t && r < i && (i = r - (Mr - Mu(i - r))),
    (e[0] = r),
    (e[1] = i));
}
var Rn = (function () {
  function e(t) {
    ((this.dpr = 1),
      (this._xi = 0),
      (this._yi = 0),
      (this._x0 = 0),
      (this._y0 = 0),
      (this._len = 0),
      t && (this._saveData = !1),
      this._saveData && (this.data = []));
  }
  return (
    (e.prototype.increaseVersion = function () {
      this._version++;
    }),
    (e.prototype.getVersion = function () {
      return this._version;
    }),
    (e.prototype.setScale = function (t, r, n) {
      ((n = n || 0), n > 0 && ((this._ux = ar(n / Ls / t) || 0), (this._uy = ar(n / Ls / r) || 0)));
    }),
    (e.prototype.setDPR = function (t) {
      this.dpr = t;
    }),
    (e.prototype.setContext = function (t) {
      this._ctx = t;
    }),
    (e.prototype.getContext = function () {
      return this._ctx;
    }),
    (e.prototype.beginPath = function () {
      return (this._ctx && this._ctx.beginPath(), this.reset(), this);
    }),
    (e.prototype.reset = function () {
      (this._saveData && (this._len = 0),
        this._pathSegLen && ((this._pathSegLen = null), (this._pathLen = 0)),
        this._version++);
    }),
    (e.prototype.moveTo = function (t, r) {
      return (
        this._drawPendingPt(),
        this.addData(ct.M, t, r),
        this._ctx && this._ctx.moveTo(t, r),
        (this._x0 = t),
        (this._y0 = r),
        (this._xi = t),
        (this._yi = r),
        this
      );
    }),
    (e.prototype.lineTo = function (t, r) {
      var n = ar(t - this._xi),
        i = ar(r - this._yi),
        a = n > this._ux || i > this._uy;
      if ((this.addData(ct.L, t, r), this._ctx && a && this._ctx.lineTo(t, r), a))
        ((this._xi = t), (this._yi = r), (this._pendingPtDist = 0));
      else {
        var o = n * n + i * i;
        o > this._pendingPtDist && ((this._pendingPtX = t), (this._pendingPtY = r), (this._pendingPtDist = o));
      }
      return this;
    }),
    (e.prototype.bezierCurveTo = function (t, r, n, i, a, o) {
      return (
        this._drawPendingPt(),
        this.addData(ct.C, t, r, n, i, a, o),
        this._ctx && this._ctx.bezierCurveTo(t, r, n, i, a, o),
        (this._xi = a),
        (this._yi = o),
        this
      );
    }),
    (e.prototype.quadraticCurveTo = function (t, r, n, i) {
      return (
        this._drawPendingPt(),
        this.addData(ct.Q, t, r, n, i),
        this._ctx && this._ctx.quadraticCurveTo(t, r, n, i),
        (this._xi = n),
        (this._yi = i),
        this
      );
    }),
    (e.prototype.arc = function (t, r, n, i, a, o) {
      (this._drawPendingPt(), (Ui[0] = i), (Ui[1] = a), VT(Ui, o), (i = Ui[0]), (a = Ui[1]));
      var s = a - i;
      return (
        this.addData(ct.A, t, r, n, n, i, s, 0, o ? 0 : 1),
        this._ctx && this._ctx.arc(t, r, n, i, a, o),
        (this._xi = an(a) * n + t),
        (this._yi = on(a) * n + r),
        this
      );
    }),
    (e.prototype.arcTo = function (t, r, n, i, a) {
      return (this._drawPendingPt(), this._ctx && this._ctx.arcTo(t, r, n, i, a), this);
    }),
    (e.prototype.rect = function (t, r, n, i) {
      return (this._drawPendingPt(), this._ctx && this._ctx.rect(t, r, n, i), this.addData(ct.R, t, r, n, i), this);
    }),
    (e.prototype.closePath = function () {
      (this._drawPendingPt(), this.addData(ct.Z));
      var t = this._ctx,
        r = this._x0,
        n = this._y0;
      return (t && t.closePath(), (this._xi = r), (this._yi = n), this);
    }),
    (e.prototype.fill = function (t) {
      (t && t.fill(), this.toStatic());
    }),
    (e.prototype.stroke = function (t) {
      (t && t.stroke(), this.toStatic());
    }),
    (e.prototype.len = function () {
      return this._len;
    }),
    (e.prototype.setData = function (t) {
      if (this._saveData) {
        var r = t.length;
        !(this.data && this.data.length === r) && Au && (this.data = new Float32Array(r));
        for (var n = 0; n < r; n++) this.data[n] = t[n];
        this._len = r;
      }
    }),
    (e.prototype.appendPath = function (t) {
      if (this._saveData) {
        t instanceof Array || (t = [t]);
        for (var r = t.length, n = 0, i = this._len, a = 0; a < r; a++) n += t[a].len();
        var o = this.data;
        if (Au && (o instanceof Float32Array || !o) && ((this.data = new Float32Array(i + n)), i > 0 && o))
          for (var s = 0; s < i; s++) this.data[s] = o[s];
        for (var a = 0; a < r; a++) for (var l = t[a].data, s = 0; s < l.length; s++) this.data[i++] = l[s];
        this._len = i;
      }
    }),
    (e.prototype.addData = function (t, r, n, i, a, o, s, l, u) {
      if (this._saveData) {
        var f = this.data;
        this._len + arguments.length > f.length && (this._expandData(), (f = this.data));
        for (var h = 0; h < arguments.length; h++) f[this._len++] = arguments[h];
      }
    }),
    (e.prototype._drawPendingPt = function () {
      this._pendingPtDist > 0 &&
        (this._ctx && this._ctx.lineTo(this._pendingPtX, this._pendingPtY), (this._pendingPtDist = 0));
    }),
    (e.prototype._expandData = function () {
      if (!(this.data instanceof Array)) {
        for (var t = [], r = 0; r < this._len; r++) t[r] = this.data[r];
        this.data = t;
      }
    }),
    (e.prototype.toStatic = function () {
      if (this._saveData) {
        this._drawPendingPt();
        var t = this.data;
        t instanceof Array && ((t.length = this._len), Au && this._len > 11 && (this.data = new Float32Array(t)));
      }
    }),
    (e.prototype.getBoundingRect = function () {
      ((He[0] = He[1] = Ve[0] = Ve[1] = Number.MAX_VALUE), (_r[0] = _r[1] = Ge[0] = Ge[1] = -Number.MAX_VALUE));
      var t = this.data,
        r = 0,
        n = 0,
        i = 0,
        a = 0,
        o;
      for (o = 0; o < this._len; ) {
        var s = t[o++],
          l = o === 1;
        switch ((l && ((r = t[o]), (n = t[o + 1]), (i = r), (a = n)), s)) {
          case ct.M:
            ((r = i = t[o++]), (n = a = t[o++]), (Ve[0] = i), (Ve[1] = a), (Ge[0] = i), (Ge[1] = a));
            break;
          case ct.L:
            (yd(r, n, t[o], t[o + 1], Ve, Ge), (r = t[o++]), (n = t[o++]));
            break;
          case ct.C:
            (FT(r, n, t[o++], t[o++], t[o++], t[o++], t[o], t[o + 1], Ve, Ge), (r = t[o++]), (n = t[o++]));
            break;
          case ct.Q:
            (zT(r, n, t[o++], t[o++], t[o], t[o + 1], Ve, Ge), (r = t[o++]), (n = t[o++]));
            break;
          case ct.A:
            var u = t[o++],
              f = t[o++],
              h = t[o++],
              c = t[o++],
              v = t[o++],
              d = t[o++] + v;
            o += 1;
            var p = !t[o++];
            (l && ((i = an(v) * h + u), (a = on(v) * c + f)),
              HT(u, f, h, c, v, d, p, Ve, Ge),
              (r = an(d) * h + u),
              (n = on(d) * c + f));
            break;
          case ct.R:
            ((i = r = t[o++]), (a = n = t[o++]));
            var m = t[o++],
              g = t[o++];
            yd(i, a, i + m, a + g, Ve, Ge);
            break;
          case ct.Z:
            ((r = i), (n = a));
            break;
        }
        (ni(He, He, Ve), ii(_r, _r, Ge));
      }
      return (o === 0 && (He[0] = He[1] = _r[0] = _r[1] = 0), new J(He[0], He[1], _r[0] - He[0], _r[1] - He[1]));
    }),
    (e.prototype._calculateLength = function () {
      var t = this.data,
        r = this._len,
        n = this._ux,
        i = this._uy,
        a = 0,
        o = 0,
        s = 0,
        l = 0;
      this._pathSegLen || (this._pathSegLen = []);
      for (var u = this._pathSegLen, f = 0, h = 0, c = 0; c < r; ) {
        var v = t[c++],
          d = c === 1;
        d && ((a = t[c]), (o = t[c + 1]), (s = a), (l = o));
        var p = -1;
        switch (v) {
          case ct.M:
            ((a = s = t[c++]), (o = l = t[c++]));
            break;
          case ct.L: {
            var m = t[c++],
              g = t[c++],
              y = m - a,
              _ = g - o;
            (ar(y) > n || ar(_) > i || c === r - 1) && ((p = Math.sqrt(y * y + _ * _)), (a = m), (o = g));
            break;
          }
          case ct.C: {
            var S = t[c++],
              b = t[c++],
              m = t[c++],
              g = t[c++],
              w = t[c++],
              T = t[c++];
            ((p = qb(a, o, S, b, m, g, w, T, 10)), (a = w), (o = T));
            break;
          }
          case ct.Q: {
            var S = t[c++],
              b = t[c++],
              m = t[c++],
              g = t[c++];
            ((p = jb(a, o, S, b, m, g, 10)), (a = m), (o = g));
            break;
          }
          case ct.A:
            var C = t[c++],
              A = t[c++],
              M = t[c++],
              D = t[c++],
              P = t[c++],
              x = t[c++],
              L = x + P;
            ((c += 1),
              d && ((s = an(P) * M + C), (l = on(P) * D + A)),
              (p = Du(M, D) * Cu(Mr, Math.abs(x))),
              (a = an(L) * M + C),
              (o = on(L) * D + A));
            break;
          case ct.R: {
            ((s = a = t[c++]), (l = o = t[c++]));
            var E = t[c++],
              R = t[c++];
            p = E * 2 + R * 2;
            break;
          }
          case ct.Z: {
            var y = s - a,
              _ = l - o;
            ((p = Math.sqrt(y * y + _ * _)), (a = s), (o = l));
            break;
          }
        }
        p >= 0 && ((u[h++] = p), (f += p));
      }
      return ((this._pathLen = f), f);
    }),
    (e.prototype.rebuildPath = function (t, r) {
      var n = this.data,
        i = this._ux,
        a = this._uy,
        o = this._len,
        s,
        l,
        u,
        f,
        h,
        c,
        v = r < 1,
        d,
        p,
        m = 0,
        g = 0,
        y,
        _ = 0,
        S,
        b;
      if (
        !(
          v &&
          (this._pathSegLen || this._calculateLength(), (d = this._pathSegLen), (p = this._pathLen), (y = r * p), !y)
        )
      )
        t: for (var w = 0; w < o; ) {
          var T = n[w++],
            C = w === 1;
          switch (
            (C && ((u = n[w]), (f = n[w + 1]), (s = u), (l = f)), T !== ct.L && _ > 0 && (t.lineTo(S, b), (_ = 0)), T)
          ) {
            case ct.M:
              ((s = u = n[w++]), (l = f = n[w++]), t.moveTo(u, f));
              break;
            case ct.L: {
              ((h = n[w++]), (c = n[w++]));
              var A = ar(h - u),
                M = ar(c - f);
              if (A > i || M > a) {
                if (v) {
                  var D = d[g++];
                  if (m + D > y) {
                    var P = (y - m) / D;
                    t.lineTo(u * (1 - P) + h * P, f * (1 - P) + c * P);
                    break t;
                  }
                  m += D;
                }
                (t.lineTo(h, c), (u = h), (f = c), (_ = 0));
              } else {
                var x = A * A + M * M;
                x > _ && ((S = h), (b = c), (_ = x));
              }
              break;
            }
            case ct.C: {
              var L = n[w++],
                E = n[w++],
                R = n[w++],
                B = n[w++],
                O = n[w++],
                k = n[w++];
              if (v) {
                var D = d[g++];
                if (m + D > y) {
                  var P = (y - m) / D;
                  (As(u, L, R, O, P, rn),
                    As(f, E, B, k, P, nn),
                    t.bezierCurveTo(rn[1], nn[1], rn[2], nn[2], rn[3], nn[3]));
                  break t;
                }
                m += D;
              }
              (t.bezierCurveTo(L, E, R, B, O, k), (u = O), (f = k));
              break;
            }
            case ct.Q: {
              var L = n[w++],
                E = n[w++],
                R = n[w++],
                B = n[w++];
              if (v) {
                var D = d[g++];
                if (m + D > y) {
                  var P = (y - m) / D;
                  (Ms(u, L, R, P, rn), Ms(f, E, B, P, nn), t.quadraticCurveTo(rn[1], nn[1], rn[2], nn[2]));
                  break t;
                }
                m += D;
              }
              (t.quadraticCurveTo(L, E, R, B), (u = R), (f = B));
              break;
            }
            case ct.A:
              var z = n[w++],
                H = n[w++],
                W = n[w++],
                $ = n[w++],
                G = n[w++],
                K = n[w++],
                at = n[w++],
                Et = !n[w++],
                Jt = W > $ ? W : $,
                yt = ar(W - $) > 0.001,
                Dt = G + K,
                tt = !1;
              if (v) {
                var D = d[g++];
                (m + D > y && ((Dt = G + (K * (y - m)) / D), (tt = !0)), (m += D));
              }
              if ((yt && t.ellipse ? t.ellipse(z, H, W, $, at, G, Dt, Et) : t.arc(z, H, Jt, G, Dt, Et), tt)) break t;
              (C && ((s = an(G) * W + z), (l = on(G) * $ + H)), (u = an(Dt) * W + z), (f = on(Dt) * $ + H));
              break;
            case ct.R:
              ((s = u = n[w]), (l = f = n[w + 1]), (h = n[w++]), (c = n[w++]));
              var st = n[w++],
                Wr = n[w++];
              if (v) {
                var D = d[g++];
                if (m + D > y) {
                  var Xt = y - m;
                  (t.moveTo(h, c),
                    t.lineTo(h + Cu(Xt, st), c),
                    (Xt -= st),
                    Xt > 0 && t.lineTo(h + st, c + Cu(Xt, Wr)),
                    (Xt -= Wr),
                    Xt > 0 && t.lineTo(h + Du(st - Xt, 0), c + Wr),
                    (Xt -= st),
                    Xt > 0 && t.lineTo(h, c + Du(Wr - Xt, 0)));
                  break t;
                }
                m += D;
              }
              t.rect(h, c, st, Wr);
              break;
            case ct.Z:
              if (v) {
                var D = d[g++];
                if (m + D > y) {
                  var P = (y - m) / D;
                  t.lineTo(u * (1 - P) + s * P, f * (1 - P) + l * P);
                  break t;
                }
                m += D;
              }
              (t.closePath(), (u = s), (f = l));
          }
        }
    }),
    (e.prototype.clone = function () {
      var t = new e(),
        r = this.data;
      return ((t.data = r.slice ? r.slice() : Array.prototype.slice.call(r)), (t._len = this._len), t);
    }),
    (e.prototype.canSave = function () {
      return !!this._saveData;
    }),
    (e.CMD = ct),
    (e.initDefaultProps = (function () {
      var t = e.prototype;
      ((t._saveData = !0), (t._ux = 0), (t._uy = 0), (t._pendingPtDist = 0), (t._version = 0));
    })()),
    e
  );
})();
function Un(e, t, r, n, i, a, o) {
  if (i === 0) return !1;
  var s = i,
    l = 0,
    u = e;
  if ((o > t + s && o > n + s) || (o < t - s && o < n - s) || (a > e + s && a > r + s) || (a < e - s && a < r - s))
    return !1;
  if (e !== r) ((l = (t - n) / (e - r)), (u = (e * n - r * t) / (e - r)));
  else return Math.abs(a - e) <= s / 2;
  var f = l * a - o + u,
    h = (f * f) / (l * l + 1);
  return h <= ((s / 2) * s) / 2;
}
function GT(e, t, r, n, i, a, o, s, l, u, f) {
  if (l === 0) return !1;
  var h = l;
  if (
    (f > t + h && f > n + h && f > a + h && f > s + h) ||
    (f < t - h && f < n - h && f < a - h && f < s - h) ||
    (u > e + h && u > r + h && u > i + h && u > o + h) ||
    (u < e - h && u < r - h && u < i - h && u < o - h)
  )
    return !1;
  var c = Zb(e, t, r, n, i, a, o, s, u, f);
  return c <= h / 2;
}
function UT(e, t, r, n, i, a, o, s, l) {
  if (o === 0) return !1;
  var u = o;
  if (
    (l > t + u && l > n + u && l > a + u) ||
    (l < t - u && l < n - u && l < a - u) ||
    (s > e + u && s > r + u && s > i + u) ||
    (s < e - u && s < r - u && s < i - u)
  )
    return !1;
  var f = Qb(e, t, r, n, i, a, s, l);
  return f <= u / 2;
}
var bd = Math.PI * 2;
function yo(e) {
  return ((e %= bd), e < 0 && (e += bd), e);
}
var Wi = Math.PI * 2;
function WT(e, t, r, n, i, a, o, s, l) {
  if (o === 0) return !1;
  var u = o;
  ((s -= e), (l -= t));
  var f = Math.sqrt(s * s + l * l);
  if (f - u > r || f + u < r) return !1;
  if (Math.abs(n - i) % Wi < 1e-4) return !0;
  if (a) {
    var h = n;
    ((n = yo(i)), (i = yo(h)));
  } else ((n = yo(n)), (i = yo(i)));
  n > i && (i += Wi);
  var c = Math.atan2(l, s);
  return (c < 0 && (c += Wi), (c >= n && c <= i) || (c + Wi >= n && c + Wi <= i));
}
function sn(e, t, r, n, i, a) {
  if ((a > t && a > n) || (a < t && a < n) || n === t) return 0;
  var o = (a - t) / (n - t),
    s = n < t ? 1 : -1;
  (o === 1 || o === 0) && (s = n < t ? 0.5 : -0.5);
  var l = o * (r - e) + e;
  return l === i ? 1 / 0 : l > i ? s : 0;
}
var Sr = Rn.CMD,
  ln = Math.PI * 2,
  YT = 1e-4;
function XT(e, t) {
  return Math.abs(e - t) < YT;
}
var Zt = [-1, -1, -1],
  _e = [-1, -1];
function $T() {
  var e = _e[0];
  ((_e[0] = _e[1]), (_e[1] = e));
}
function ZT(e, t, r, n, i, a, o, s, l, u) {
  if ((u > t && u > n && u > a && u > s) || (u < t && u < n && u < a && u < s)) return 0;
  var f = Ds(t, n, a, s, u, Zt);
  if (f === 0) return 0;
  for (var h = 0, c = -1, v = void 0, d = void 0, p = 0; p < f; p++) {
    var m = Zt[p],
      g = m === 0 || m === 1 ? 0.5 : 1,
      y = Nt(e, r, i, o, m);
    y < l ||
      (c < 0 &&
        ((c = qm(t, n, a, s, _e)),
        _e[1] < _e[0] && c > 1 && $T(),
        (v = Nt(t, n, a, s, _e[0])),
        c > 1 && (d = Nt(t, n, a, s, _e[1]))),
      c === 2
        ? m < _e[0]
          ? (h += v < t ? g : -g)
          : m < _e[1]
            ? (h += d < v ? g : -g)
            : (h += s < d ? g : -g)
        : m < _e[0]
          ? (h += v < t ? g : -g)
          : (h += s < v ? g : -g));
  }
  return h;
}
function qT(e, t, r, n, i, a, o, s) {
  if ((s > t && s > n && s > a) || (s < t && s < n && s < a)) return 0;
  var l = Kb(t, n, a, s, Zt);
  if (l === 0) return 0;
  var u = Km(t, n, a);
  if (u >= 0 && u <= 1) {
    for (var f = 0, h = re(t, n, a, u), c = 0; c < l; c++) {
      var v = Zt[c] === 0 || Zt[c] === 1 ? 0.5 : 1,
        d = re(e, r, i, Zt[c]);
      d < o || (Zt[c] < u ? (f += h < t ? v : -v) : (f += a < h ? v : -v));
    }
    return f;
  } else {
    var v = Zt[0] === 0 || Zt[0] === 1 ? 0.5 : 1,
      d = re(e, r, i, Zt[0]);
    return d < o ? 0 : a < t ? v : -v;
  }
}
function KT(e, t, r, n, i, a, o, s) {
  if (((s -= t), s > r || s < -r)) return 0;
  var l = Math.sqrt(r * r - s * s);
  ((Zt[0] = -l), (Zt[1] = l));
  var u = Math.abs(n - i);
  if (u < 1e-4) return 0;
  if (u >= ln - 1e-4) {
    ((n = 0), (i = ln));
    var f = a ? 1 : -1;
    return o >= Zt[0] + e && o <= Zt[1] + e ? f : 0;
  }
  if (n > i) {
    var h = n;
    ((n = i), (i = h));
  }
  n < 0 && ((n += ln), (i += ln));
  for (var c = 0, v = 0; v < 2; v++) {
    var d = Zt[v];
    if (d + e > o) {
      var p = Math.atan2(s, d),
        f = a ? 1 : -1;
      (p < 0 && (p = ln + p),
        ((p >= n && p <= i) || (p + ln >= n && p + ln <= i)) &&
          (p > Math.PI / 2 && p < Math.PI * 1.5 && (f = -f), (c += f)));
    }
  }
  return c;
}
function Ay(e, t, r, n, i) {
  for (var a = e.data, o = e.len(), s = 0, l = 0, u = 0, f = 0, h = 0, c, v, d = 0; d < o; ) {
    var p = a[d++],
      m = d === 1;
    switch (
      (p === Sr.M && d > 1 && (r || (s += sn(l, u, f, h, n, i))),
      m && ((l = a[d]), (u = a[d + 1]), (f = l), (h = u)),
      p)
    ) {
      case Sr.M:
        ((f = a[d++]), (h = a[d++]), (l = f), (u = h));
        break;
      case Sr.L:
        if (r) {
          if (Un(l, u, a[d], a[d + 1], t, n, i)) return !0;
        } else s += sn(l, u, a[d], a[d + 1], n, i) || 0;
        ((l = a[d++]), (u = a[d++]));
        break;
      case Sr.C:
        if (r) {
          if (GT(l, u, a[d++], a[d++], a[d++], a[d++], a[d], a[d + 1], t, n, i)) return !0;
        } else s += ZT(l, u, a[d++], a[d++], a[d++], a[d++], a[d], a[d + 1], n, i) || 0;
        ((l = a[d++]), (u = a[d++]));
        break;
      case Sr.Q:
        if (r) {
          if (UT(l, u, a[d++], a[d++], a[d], a[d + 1], t, n, i)) return !0;
        } else s += qT(l, u, a[d++], a[d++], a[d], a[d + 1], n, i) || 0;
        ((l = a[d++]), (u = a[d++]));
        break;
      case Sr.A:
        var g = a[d++],
          y = a[d++],
          _ = a[d++],
          S = a[d++],
          b = a[d++],
          w = a[d++];
        d += 1;
        var T = !!(1 - a[d++]);
        ((c = Math.cos(b) * _ + g), (v = Math.sin(b) * S + y), m ? ((f = c), (h = v)) : (s += sn(l, u, c, v, n, i)));
        var C = ((n - g) * S) / _ + g;
        if (r) {
          if (WT(g, y, S, b, b + w, T, t, C, i)) return !0;
        } else s += KT(g, y, S, b, b + w, T, C, i);
        ((l = Math.cos(b + w) * _ + g), (u = Math.sin(b + w) * S + y));
        break;
      case Sr.R:
        ((f = l = a[d++]), (h = u = a[d++]));
        var A = a[d++],
          M = a[d++];
        if (((c = f + A), (v = h + M), r)) {
          if (Un(f, h, c, h, t, n, i) || Un(c, h, c, v, t, n, i) || Un(c, v, f, v, t, n, i) || Un(f, v, f, h, t, n, i))
            return !0;
        } else ((s += sn(c, h, c, v, n, i)), (s += sn(f, v, f, h, n, i)));
        break;
      case Sr.Z:
        if (r) {
          if (Un(l, u, f, h, t, n, i)) return !0;
        } else s += sn(l, u, f, h, n, i);
        ((l = f), (u = h));
        break;
    }
  }
  return (!r && !XT(u, h) && (s += sn(l, u, f, h, n, i) || 0), s !== 0);
}
function QT(e, t, r) {
  return Ay(e, 0, !1, t, r);
}
function jT(e, t, r, n) {
  return Ay(e, t, !0, r, n);
}
var My = mt(
    {
      fill: "#000",
      stroke: null,
      strokePercent: 1,
      fillOpacity: 1,
      strokeOpacity: 1,
      lineDashOffset: 0,
      lineWidth: 1,
      lineCap: "butt",
      miterLimit: 10,
      strokeNoScale: !1,
      strokeFirst: !1,
    },
    Mn,
  ),
  JT = {
    style: mt(
      {
        fill: !0,
        stroke: !0,
        strokePercent: !0,
        fillOpacity: !0,
        strokeOpacity: !0,
        lineDashOffset: !0,
        lineWidth: !0,
        miterLimit: !0,
      },
      gl.style,
    ),
  },
  Iu = fl.concat(["invisible", "culling", "z", "z2", "zlevel", "parent"]),
  gt = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype.update = function () {
        var r = this;
        e.prototype.update.call(this);
        var n = this.style;
        if (n.decal) {
          var i = (this._decalEl = this._decalEl || new t());
          (i.buildPath === t.prototype.buildPath &&
            (i.buildPath = function (l) {
              r.buildPath(l, r.shape);
            }),
            (i.silent = !0));
          var a = i.style;
          for (var o in n) a[o] !== n[o] && (a[o] = n[o]);
          ((a.fill = n.fill ? n.decal : null),
            (a.decal = null),
            (a.shadowColor = null),
            n.strokeFirst && (a.stroke = null));
          for (var s = 0; s < Iu.length; ++s) i[Iu[s]] = this[Iu[s]];
          i.__dirty |= ie;
        } else this._decalEl && (this._decalEl = null);
      }),
      (t.prototype.getDecalElement = function () {
        return this._decalEl;
      }),
      (t.prototype._init = function (r) {
        var n = xt(r);
        this.shape = this.getDefaultShape();
        var i = this.getDefaultStyle();
        i && this.useStyle(i);
        for (var a = 0; a < n.length; a++) {
          var o = n[a],
            s = r[o];
          o === "style"
            ? this.style
              ? N(this.style, s)
              : this.useStyle(s)
            : o === "shape"
              ? N(this.shape, s)
              : e.prototype.attrKV.call(this, o, s);
        }
        this.style || this.useStyle({});
      }),
      (t.prototype.getDefaultStyle = function () {
        return null;
      }),
      (t.prototype.getDefaultShape = function () {
        return {};
      }),
      (t.prototype.canBeInsideText = function () {
        return this.hasFill();
      }),
      (t.prototype.getInsideTextFill = function () {
        var r = this.style.fill;
        if (r !== "none") {
          if (Y(r)) {
            var n = Is(r, 0);
            return n > 0.5 ? Gf : n > 0.2 ? _w : Uf;
          } else if (r) return Uf;
        }
        return Gf;
      }),
      (t.prototype.getInsideTextStroke = function (r) {
        var n = this.style.fill;
        if (Y(n)) {
          var i = this.__zr,
            a = !!(i && i.isDarkMode()),
            o = Is(r, 0) < Vf;
          if (a === o) return n;
        }
      }),
      (t.prototype.buildPath = function (r, n, i) {}),
      (t.prototype.pathUpdated = function () {
        this.__dirty &= ~ei;
      }),
      (t.prototype.getUpdatedPathProxy = function (r) {
        return (
          !this.path && this.createPathProxy(),
          this.path.beginPath(),
          this.buildPath(this.path, this.shape, r),
          this.path
        );
      }),
      (t.prototype.createPathProxy = function () {
        this.path = new Rn(!1);
      }),
      (t.prototype.hasStroke = function () {
        var r = this.style,
          n = r.stroke;
        return !(n == null || n === "none" || !(r.lineWidth > 0));
      }),
      (t.prototype.hasFill = function () {
        var r = this.style,
          n = r.fill;
        return n != null && n !== "none";
      }),
      (t.prototype.getBoundingRect = function () {
        var r = this._rect,
          n = this.style,
          i = !r;
        if (i) {
          var a = !1;
          this.path || ((a = !0), this.createPathProxy());
          var o = this.path;
          ((a || this.__dirty & ei) && (o.beginPath(), this.buildPath(o, this.shape, !1), this.pathUpdated()),
            (r = o.getBoundingRect()));
        }
        if (((this._rect = r), this.hasStroke() && this.path && this.path.len() > 0)) {
          var s = this._rectStroke || (this._rectStroke = r.clone());
          if (this.__dirty || i) {
            s.copy(r);
            var l = n.strokeNoScale ? this.getLineScale() : 1,
              u = n.lineWidth;
            if (!this.hasFill()) {
              var f = this.strokeContainThreshold;
              u = Math.max(u, f ?? 4);
            }
            l > 1e-10 && ((s.width += u / l), (s.height += u / l), (s.x -= u / l / 2), (s.y -= u / l / 2));
          }
          return s;
        }
        return r;
      }),
      (t.prototype.contain = function (r, n) {
        var i = this.transformCoordToLocal(r, n),
          a = this.getBoundingRect(),
          o = this.style;
        if (((r = i[0]), (n = i[1]), a.contain(r, n))) {
          var s = this.path;
          if (this.hasStroke()) {
            var l = o.lineWidth,
              u = o.strokeNoScale ? this.getLineScale() : 1;
            if (u > 1e-10 && (this.hasFill() || (l = Math.max(l, this.strokeContainThreshold)), jT(s, l / u, r, n)))
              return !0;
          }
          if (this.hasFill()) return QT(s, r, n);
        }
        return !1;
      }),
      (t.prototype.dirtyShape = function () {
        ((this.__dirty |= ei),
          this._rect && (this._rect = null),
          this._decalEl && this._decalEl.dirtyShape(),
          this.markRedraw());
      }),
      (t.prototype.dirty = function () {
        (this.dirtyStyle(), this.dirtyShape());
      }),
      (t.prototype.animateShape = function (r) {
        return this.animate("shape", r);
      }),
      (t.prototype.updateDuringAnimation = function (r) {
        r === "style" ? this.dirtyStyle() : r === "shape" ? this.dirtyShape() : this.markRedraw();
      }),
      (t.prototype.attrKV = function (r, n) {
        r === "shape" ? this.setShape(n) : e.prototype.attrKV.call(this, r, n);
      }),
      (t.prototype.setShape = function (r, n) {
        var i = this.shape;
        return (i || (i = this.shape = {}), typeof r == "string" ? (i[r] = n) : N(i, r), this.dirtyShape(), this);
      }),
      (t.prototype.shapeChanged = function () {
        return !!(this.__dirty & ei);
      }),
      (t.prototype.createStyle = function (r) {
        return ul(My, r);
      }),
      (t.prototype._innerSaveToNormal = function (r) {
        e.prototype._innerSaveToNormal.call(this, r);
        var n = this._normalState;
        r.shape && !n.shape && (n.shape = N({}, this.shape));
      }),
      (t.prototype._applyStateObj = function (r, n, i, a, o, s) {
        if ((e.prototype._applyStateObj.call(this, r, n, i, a, o, s), this.__inHover !== cl)) {
          var l = !(n && a),
            u;
          if (
            (n && n.shape
              ? o
                ? a
                  ? (u = n.shape)
                  : ((u = N({}, i.shape)), N(u, n.shape))
                : ((u = N({}, a ? this.shape : i.shape)), N(u, n.shape))
              : l && (u = i.shape),
            u)
          )
            if (o) {
              this.shape = N({}, this.shape);
              for (var f = {}, h = xt(u), c = 0; c < h.length; c++) {
                var v = h[c];
                typeof u[v] == "object" ? (this.shape[v] = u[v]) : (f[v] = u[v]);
              }
              this._transitionState(r, { shape: f }, s);
            } else ((this.shape = u), this.dirtyShape());
        }
      }),
      (t.prototype._mergeStates = function (r) {
        for (var n = e.prototype._mergeStates.call(this, r), i, a = 0; a < r.length; a++) {
          var o = r[a];
          o.shape && ((i = i || {}), this._mergeStyle(i, o.shape));
        }
        return (i && (n.shape = i), n);
      }),
      (t.prototype.getAnimationStyleProps = function () {
        return JT;
      }),
      (t.prototype.isZeroArea = function () {
        return !1;
      }),
      (t.extend = function (r) {
        var n = (function (a) {
          V(o, a);
          function o(s) {
            var l = a.call(this, s) || this;
            return (r.init && r.init.call(l, s), l);
          }
          return (
            (o.prototype.getDefaultStyle = function () {
              return ot(r.style);
            }),
            (o.prototype.getDefaultShape = function () {
              return ot(r.shape);
            }),
            o
          );
        })(t);
        for (var i in r) typeof r[i] == "function" && (n.prototype[i] = r[i]);
        return n;
      }),
      (t.initDefaultProps = (function () {
        var r = t.prototype;
        ((r.type = "path"),
          (r.strokeContainThreshold = 5),
          (r.segmentIgnoreThreshold = 0),
          (r.subPixelOptimize = !1),
          (r.autoBatch = !1),
          (r.__dirty = ie | oa | ei));
      })()),
      t
    );
  })(Qa),
  tx = mt({ strokeFirst: !0, font: Nr, x: 0, y: 0, textAlign: "left", textBaseline: "top", miterLimit: 2 }, My),
  ks = (function (e) {
    V(t, e);
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    return (
      (t.prototype.hasStroke = function () {
        return Dy(this.style);
      }),
      (t.prototype.hasFill = function () {
        var r = this.style,
          n = r.fill;
        return n != null && n !== "none";
      }),
      (t.prototype.createStyle = function (r) {
        return ul(tx, r);
      }),
      (t.prototype.setBoundingRect = function (r) {
        this._rect = r;
      }),
      (t.prototype.getBoundingRect = function () {
        return (this._rect || (this._rect = kT(this.style)), this._rect);
      }),
      (t.initDefaultProps = (function () {
        var r = t.prototype;
        r.dirtyRectTolerance = 10;
      })()),
      t
    );
  })(Qa);
ks.prototype.type = "tspan";
var ex = mt({ x: 0, y: 0 }, Mn),
  rx = { style: mt({ x: !0, y: !0, width: !0, height: !0, sx: !0, sy: !0, sWidth: !0, sHeight: !0 }, gl.style) };
function nx(e) {
  return !!(e && typeof e != "string" && e.width && e.height);
}
var Ur = (function (e) {
  V(t, e);
  function t() {
    return (e !== null && e.apply(this, arguments)) || this;
  }
  return (
    (t.prototype.createStyle = function (r) {
      return ul(ex, r);
    }),
    (t.prototype._getSize = function (r) {
      var n = this.style,
        i = n[r];
      if (i != null) return i;
      var a = nx(n.image) ? n.image : this.__image;
      if (!a) return 0;
      var o = r === "width" ? "height" : "width",
        s = n[o];
      return s == null ? a[r] : (a[r] / a[o]) * s;
    }),
    (t.prototype.getWidth = function () {
      return this._getSize("width");
    }),
    (t.prototype.getHeight = function () {
      return this._getSize("height");
    }),
    (t.prototype.getAnimationStyleProps = function () {
      return rx;
    }),
    (t.prototype.getBoundingRect = function () {
      var r = this.style;
      return (this._rect || (this._rect = new J(r.x || 0, r.y || 0, this.getWidth(), this.getHeight())), this._rect);
    }),
    t
  );
})(Qa);
Ur.prototype.type = "image";
function ix(e, t) {
  var r = t.x,
    n = t.y,
    i = t.width,
    a = t.height,
    o = t.r,
    s,
    l,
    u,
    f;
  (i < 0 && ((r = r + i), (i = -i)),
    a < 0 && ((n = n + a), (a = -a)),
    typeof o == "number"
      ? (s = l = u = f = o)
      : o instanceof Array
        ? o.length === 1
          ? (s = l = u = f = o[0])
          : o.length === 2
            ? ((s = u = o[0]), (l = f = o[1]))
            : o.length === 3
              ? ((s = o[0]), (l = f = o[1]), (u = o[2]))
              : ((s = o[0]), (l = o[1]), (u = o[2]), (f = o[3]))
        : (s = l = u = f = 0));
  var h;
  (s + l > i && ((h = s + l), (s *= i / h), (l *= i / h)),
    u + f > i && ((h = u + f), (u *= i / h), (f *= i / h)),
    l + u > a && ((h = l + u), (l *= a / h), (u *= a / h)),
    s + f > a && ((h = s + f), (s *= a / h), (f *= a / h)),
    e.moveTo(r + s, n),
    e.lineTo(r + i - l, n),
    l !== 0 && e.arc(r + i - l, n + l, l, -Math.PI / 2, 0),
    e.lineTo(r + i, n + a - u),
    u !== 0 && e.arc(r + i - u, n + a - u, u, 0, Math.PI / 2),
    e.lineTo(r + f, n + a),
    f !== 0 && e.arc(r + f, n + a - f, f, Math.PI / 2, Math.PI),
    e.lineTo(r, n + s),
    s !== 0 && e.arc(r + s, n + s, s, Math.PI, Math.PI * 1.5),
    e.closePath());
}
var si = Math.round;
function Iy(e, t, r) {
  if (t) {
    var n = t.x1,
      i = t.x2,
      a = t.y1,
      o = t.y2;
    ((e.x1 = n), (e.x2 = i), (e.y1 = a), (e.y2 = o));
    var s = r && r.lineWidth;
    return (
      s &&
        (si(n * 2) === si(i * 2) && (e.x1 = e.x2 = Tn(n, s, !0)),
        si(a * 2) === si(o * 2) && (e.y1 = e.y2 = Tn(a, s, !0))),
      e
    );
  }
}
function Ly(e, t, r) {
  if (t) {
    var n = t.x,
      i = t.y,
      a = t.width,
      o = t.height;
    ((e.x = n), (e.y = i), (e.width = a), (e.height = o));
    var s = r && r.lineWidth;
    return (
      s &&
        ((e.x = Tn(n, s, !0)),
        (e.y = Tn(i, s, !0)),
        (e.width = Math.max(Tn(n + a, s, !1) - e.x, a === 0 ? 0 : 1)),
        (e.height = Math.max(Tn(i + o, s, !1) - e.y, o === 0 ? 0 : 1))),
      e
    );
  }
}
function Tn(e, t, r) {
  if (!t) return e;
  var n = si(e * 2);
  return (n + si(t)) % 2 === 0 ? n / 2 : (n + (r ? 1 : -1)) / 2;
}
var ax = (function () {
    function e() {
      ((this.x = 0), (this.y = 0), (this.width = 0), (this.height = 0));
    }
    return e;
  })(),
  ox = {},
  Mt = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype.getDefaultShape = function () {
        return new ax();
      }),
      (t.prototype.buildPath = function (r, n) {
        var i, a, o, s;
        if (this.subPixelOptimize) {
          var l = Ly(ox, n, this.style);
          ((i = l.x), (a = l.y), (o = l.width), (s = l.height), (l.r = n.r), (n = l));
        } else ((i = n.x), (a = n.y), (o = n.width), (s = n.height));
        n.r ? ix(r, n) : r.rect(i, a, o, s);
      }),
      (t.prototype.isZeroArea = function () {
        return !this.shape.width || !this.shape.height;
      }),
      t
    );
  })(gt);
Mt.prototype.type = "rect";
var wd = { fill: "#000" },
  Td = 2,
  Ue = {},
  sx = {
    style: mt(
      {
        fill: !0,
        stroke: !0,
        fillOpacity: !0,
        strokeOpacity: !0,
        lineWidth: !0,
        fontSize: !0,
        lineHeight: !0,
        width: !0,
        height: !0,
        textShadowColor: !0,
        textShadowBlur: !0,
        textShadowOffsetX: !0,
        textShadowOffsetY: !0,
        backgroundColor: !0,
        padding: !0,
        borderColor: !0,
        borderWidth: !0,
        borderRadius: !0,
      },
      gl.style,
    ),
  },
  Wt = (function (e) {
    V(t, e);
    function t(r) {
      var n = e.call(this) || this;
      return ((n.type = "text"), (n._children = []), (n._defaultStyle = wd), n.attr(r), n);
    }
    return (
      (t.prototype.childrenRef = function () {
        return this._children;
      }),
      (t.prototype.update = function () {
        (e.prototype.update.call(this), this.styleChanged() && this._updateSubTexts());
        for (var r = 0; r < this._children.length; r++) {
          var n = this._children[r];
          ((n.zlevel = this.zlevel),
            (n.z = this.z),
            (n.z2 = this.z2),
            (n.culling = this.culling),
            (n.cursor = this.cursor),
            (n.invisible = this.invisible));
        }
      }),
      (t.prototype.updateTransform = function () {
        var r = this.innerTransformable;
        r
          ? (r.updateTransform(), r.transform && (this.transform = r.transform))
          : e.prototype.updateTransform.call(this);
      }),
      (t.prototype.getLocalTransform = function (r) {
        var n = this.innerTransformable;
        return n ? n.getLocalTransform(r) : e.prototype.getLocalTransform.call(this, r);
      }),
      (t.prototype.getComputedTransform = function () {
        return (
          this.__hostTarget && (this.__hostTarget.getComputedTransform(), this.__hostTarget.updateInnerText(!0)),
          e.prototype.getComputedTransform.call(this)
        );
      }),
      (t.prototype._updateSubTexts = function () {
        ((this._childCursor = 0),
          cx(this.style),
          this.style.rich ? this._updateRichTexts() : this._updatePlainTexts(),
          (this._children.length = this._childCursor),
          this.styleUpdated());
      }),
      (t.prototype.addSelfToZr = function (r) {
        e.prototype.addSelfToZr.call(this, r);
        for (var n = 0; n < this._children.length; n++) this._children[n].__zr = r;
      }),
      (t.prototype.removeSelfFromZr = function (r) {
        e.prototype.removeSelfFromZr.call(this, r);
        for (var n = 0; n < this._children.length; n++) this._children[n].__zr = null;
      }),
      (t.prototype.getBoundingRect = function () {
        if ((this.styleChanged() && this._updateSubTexts(), !this._rect)) {
          for (var r = new J(0, 0, 0, 0), n = this._children, i = [], a = null, o = 0; o < n.length; o++) {
            var s = n[o],
              l = s.getBoundingRect(),
              u = s.getLocalTransform(i);
            u ? (r.copy(l), r.applyTransform(u), (a = a || r.clone()), a.union(r)) : ((a = a || l.clone()), a.union(l));
          }
          this._rect = a || r;
        }
        return this._rect;
      }),
      (t.prototype.setDefaultTextStyle = function (r) {
        this._defaultStyle = r || wd;
      }),
      (t.prototype.setTextContent = function (r) {}),
      (t.prototype._mergeStyle = function (r, n) {
        if (!n) return r;
        var i = n.rich,
          a = r.rich || (i && {});
        return (N(r, n), i && a ? (this._mergeRich(a, i), (r.rich = a)) : a && (r.rich = a), r);
      }),
      (t.prototype._mergeRich = function (r, n) {
        for (var i = xt(n), a = 0; a < i.length; a++) {
          var o = i[a];
          ((r[o] = r[o] || {}), N(r[o], n[o]));
        }
      }),
      (t.prototype.getAnimationStyleProps = function () {
        return sx;
      }),
      (t.prototype._getOrCreateChild = function (r) {
        var n = this._children[this._childCursor];
        return (
          (!n || !(n instanceof r)) && (n = new r()),
          (this._children[this._childCursor++] = n),
          (n.__zr = this.__zr),
          (n.parent = this),
          n
        );
      }),
      (t.prototype._updatePlainTexts = function () {
        var r = this.style,
          n = r.font || Nr,
          i = r.padding,
          a = this._defaultStyle,
          o = r.x || 0,
          s = r.y || 0,
          l = r.align || a.align || "left",
          u = r.verticalAlign || a.verticalAlign || "top";
        (dd(Ue, a.overflowRect, o, s, l, u), (o = Ue.baseX), (s = Ue.baseY));
        var f = Ld(r),
          h = MT(f, r, Ue.outerWidth, Ue.outerHeight),
          c = Lu(r),
          v = !!r.backgroundColor,
          d = h.outerHeight,
          p = h.outerWidth,
          m = h.lines,
          g = h.lineHeight;
        this.isTruncated = !!h.isTruncated;
        var y = o,
          _ = An(s, h.contentHeight, u);
        if (c || i) {
          var S = yi(o, p, l),
            b = An(s, d, u);
          c && this._renderBackground(r, r, S, b, p, d);
        }
        ((_ += g / 2), i && ((y = Id(o, l, i)), u === "top" ? (_ += i[0]) : u === "bottom" && (_ -= i[2])));
        for (
          var w = 0,
            T = !1,
            C = !1,
            A = Md(("fill" in r) ? r.fill : ((C = !0), a.fill)),
            M = Ad(("stroke" in r) ? r.stroke : !v && (!a.autoStroke || C) ? ((w = Td), (T = !0), a.stroke) : null),
            D = r.textShadowBlur > 0,
            P = 0;
          P < m.length;
          P++
        ) {
          var x = this._getOrCreateChild(ks),
            L = x.createStyle();
          (x.useStyle(L),
            (L.text = m[P]),
            (L.x = y),
            (L.y = _),
            (L.textAlign = l),
            (L.textBaseline = "middle"),
            (L.opacity = r.opacity),
            (L.strokeFirst = !0),
            D &&
              ((L.shadowBlur = r.textShadowBlur || 0),
              (L.shadowColor = r.textShadowColor || "transparent"),
              (L.shadowOffsetX = r.textShadowOffsetX || 0),
              (L.shadowOffsetY = r.textShadowOffsetY || 0)),
            (L.stroke = M),
            (L.fill = A),
            M &&
              ((L.lineWidth = r.lineWidth || w), (L.lineDash = r.lineDash), (L.lineDashOffset = r.lineDashOffset || 0)),
            (L.font = n),
            Cd(L, r),
            (_ += g),
            x.setBoundingRect(Zf(L, h.contentWidth, h.calculatedLineHeight, T ? 0 : null)));
        }
      }),
      (t.prototype._updateRichTexts = function () {
        var r = this.style,
          n = this._defaultStyle,
          i = r.align || n.align,
          a = r.verticalAlign || n.verticalAlign,
          o = r.x || 0,
          s = r.y || 0;
        (dd(Ue, n.overflowRect, o, s, i, a), (o = Ue.baseX), (s = Ue.baseY));
        var l = Ld(r),
          u = PT(l, r, Ue.outerWidth, Ue.outerHeight, i),
          f = u.width,
          h = u.outerWidth,
          c = u.outerHeight,
          v = r.padding;
        this.isTruncated = !!u.isTruncated;
        var d = yi(o, h, i),
          p = An(s, c, a),
          m = d,
          g = p;
        v && ((m += v[3]), (g += v[0]));
        var y = m + f;
        Lu(r) && this._renderBackground(r, r, d, p, h, c);
        for (var _ = !!r.backgroundColor, S = 0; S < u.lines.length; S++) {
          for (
            var b = u.lines[S],
              w = b.tokens,
              T = w.length,
              C = b.lineHeight,
              A = b.width,
              M = 0,
              D = m,
              P = y,
              x = T - 1,
              L = void 0;
            M < T && ((L = w[M]), !L.align || L.align === "left");
          )
            (this._placeToken(L, r, C, g, D, "left", _), (A -= L.width), (D += L.width), M++);
          for (; x >= 0 && ((L = w[x]), L.align === "right"); )
            (this._placeToken(L, r, C, g, P, "right", _), (A -= L.width), (P -= L.width), x--);
          for (D += (f - (D - m) - (y - P) - A) / 2; M <= x; )
            ((L = w[M]), this._placeToken(L, r, C, g, D + L.width / 2, "center", _), (D += L.width), M++);
          g += C;
        }
      }),
      (t.prototype._placeToken = function (r, n, i, a, o, s, l) {
        var u = n.rich[r.styleName] || {};
        u.text = r.text;
        var f = r.verticalAlign,
          h = a + i / 2;
        f === "top" ? (h = a + r.height / 2) : f === "bottom" && (h = a + i - r.height / 2);
        var c = !r.isLineHolder && Lu(u);
        c &&
          this._renderBackground(
            u,
            n,
            s === "right" ? o - r.width : s === "center" ? o - r.width / 2 : o,
            h - r.height / 2,
            r.width,
            r.height,
          );
        var v = !!u.backgroundColor,
          d = r.textPadding;
        d && ((o = Id(o, s, d)), (h -= r.height / 2 - d[0] - r.innerHeight / 2));
        var p = this._getOrCreateChild(ks),
          m = p.createStyle();
        p.useStyle(m);
        var g = this._defaultStyle,
          y = !1,
          _ = 0,
          S = !1,
          b = Md("fill" in u ? u.fill : "fill" in n ? n.fill : ((y = !0), g.fill)),
          w = Ad(
            "stroke" in u
              ? u.stroke
              : "stroke" in n
                ? n.stroke
                : !v && !l && (!g.autoStroke || y)
                  ? ((_ = Td), (S = !0), g.stroke)
                  : null,
          ),
          T = u.textShadowBlur > 0 || n.textShadowBlur > 0;
        ((m.text = r.text),
          (m.x = o),
          (m.y = h),
          T &&
            ((m.shadowBlur = u.textShadowBlur || n.textShadowBlur || 0),
            (m.shadowColor = u.textShadowColor || n.textShadowColor || "transparent"),
            (m.shadowOffsetX = u.textShadowOffsetX || n.textShadowOffsetX || 0),
            (m.shadowOffsetY = u.textShadowOffsetY || n.textShadowOffsetY || 0)),
          (m.textAlign = s),
          (m.textBaseline = "middle"),
          (m.font = r.font || Nr),
          (m.opacity = ui(u.opacity, n.opacity, 1)),
          Cd(m, u),
          w &&
            ((m.lineWidth = ui(u.lineWidth, n.lineWidth, _)),
            (m.lineDash = q(u.lineDash, n.lineDash)),
            (m.lineDashOffset = n.lineDashOffset || 0),
            (m.stroke = w)),
          b && (m.fill = b),
          p.setBoundingRect(Zf(m, r.contentWidth, r.contentHeight, S ? 0 : null)));
      }),
      (t.prototype._renderBackground = function (r, n, i, a, o, s) {
        var l = r.backgroundColor,
          u = r.borderWidth,
          f = r.borderColor,
          h = l && l.image,
          c = l && !h,
          v = r.borderRadius,
          d = this,
          p,
          m;
        if (c || r.lineHeight || (u && f)) {
          ((p = this._getOrCreateChild(Mt)), p.useStyle(p.createStyle()), (p.style.fill = null));
          var g = p.shape;
          ((g.x = i), (g.y = a), (g.width = o), (g.height = s), (g.r = v), p.dirtyShape());
        }
        if (c) {
          var y = p.style;
          ((y.fill = l || null), (y.fillOpacity = q(r.fillOpacity, 1)));
        } else if (h) {
          ((m = this._getOrCreateChild(Ur)),
            (m.onload = function () {
              d.dirtyStyle();
            }));
          var _ = m.style;
          ((_.image = l.image), (_.x = i), (_.y = a), (_.width = o), (_.height = s));
        }
        if (u && f) {
          var y = p.style;
          ((y.lineWidth = u),
            (y.stroke = f),
            (y.strokeOpacity = q(r.strokeOpacity, 1)),
            (y.lineDash = r.borderDash),
            (y.lineDashOffset = r.borderDashOffset || 0),
            (p.strokeContainThreshold = 0),
            p.hasFill() && p.hasStroke() && ((y.strokeFirst = !0), (y.lineWidth *= 2)));
        }
        var S = (p || m).style;
        ((S.shadowBlur = r.shadowBlur || 0),
          (S.shadowColor = r.shadowColor || "transparent"),
          (S.shadowOffsetX = r.shadowOffsetX || 0),
          (S.shadowOffsetY = r.shadowOffsetY || 0),
          (S.opacity = ui(r.opacity, n.opacity, 1)));
      }),
      (t.makeFont = function (r) {
        var n = "";
        return (
          hx(r) && (n = [r.fontStyle, r.fontWeight, fx(r.fontSize), r.fontFamily || "sans-serif"].join(" ")),
          (n && Xe(n)) || r.textFont || r.font
        );
      }),
      t
    );
  })(Qa),
  lx = { left: !0, right: 1, center: 1 },
  ux = { top: 1, bottom: 1, middle: 1 },
  xd = ["fontStyle", "fontWeight", "fontSize", "fontFamily"];
function fx(e) {
  return typeof e == "string" && (e.indexOf("px") !== -1 || e.indexOf("rem") !== -1 || e.indexOf("em") !== -1)
    ? e
    : isNaN(+e)
      ? Yh + "px"
      : e + "px";
}
function Cd(e, t) {
  for (var r = 0; r < xd.length; r++) {
    var n = xd[r],
      i = t[n];
    i != null && (e[n] = i);
  }
}
function hx(e) {
  return e.fontSize != null || e.fontFamily || e.fontWeight;
}
function cx(e) {
  return (Dd(e), I(e.rich, Dd), e);
}
function Dd(e) {
  if (e) {
    e.font = Wt.makeFont(e);
    var t = e.align;
    (t === "middle" && (t = "center"), (e.align = t == null || lx[t] ? t : "left"));
    var r = e.verticalAlign;
    (r === "center" && (r = "middle"), (e.verticalAlign = r == null || ux[r] ? r : "top"));
    var n = e.padding;
    n && (e.padding = Kh(e.padding));
  }
}
function Ad(e, t) {
  return e == null || t <= 0 || e === "transparent" || e === "none" ? null : e.image || e.colorStops ? "#000" : e;
}
function Md(e) {
  return e == null || e === "none" ? null : e.image || e.colorStops ? "#000" : e;
}
function Id(e, t, r) {
  return t === "right" ? e - r[1] : t === "center" ? e + r[3] / 2 - r[1] / 2 : e + r[3];
}
function Ld(e) {
  var t = e.text;
  return (t != null && (t += ""), t);
}
function Lu(e) {
  return !!(e.backgroundColor || e.lineHeight || (e.borderWidth && e.borderColor));
}
var ut = St(),
  vx = function (e, t, r, n) {
    if (n) {
      var i = ut(n);
      ((i.dataIndex = r),
        (i.dataType = t),
        (i.seriesIndex = e),
        (i.ssrType = "chart"),
        n.type === "group" &&
          n.traverse(function (a) {
            var o = ut(a);
            ((o.seriesIndex = e), (o.dataIndex = r), (o.dataType = t), (o.ssrType = "chart"));
          }));
    }
  },
  Ei = "undefined",
  Py = "series",
  Ey = Q(["tooltip", "label", "itemName", "itemId", "itemGroupId", "itemChildGroupId", "seriesName"]),
  ce = "original",
  Yt = "arrayRows",
  Be = "objectRows",
  ir = "keyedColumns",
  kr = "typedArray",
  Ry = "unknown",
  Je = "column",
  Bn = "row",
  dx = [
    "getDom",
    "getZr",
    "getWidth",
    "getHeight",
    "getDevicePixelRatio",
    "dispatchAction",
    "isSSR",
    "isDisposed",
    "on",
    "off",
    "getDataURL",
    "getConnectedDataURL",
    "getOption",
    "getId",
    "updateLabelLayout",
  ],
  Oy = (function () {
    function e(t) {
      I(
        dx,
        function (r) {
          this[r] = Tt(t[r], t);
        },
        this,
      );
    }
    return e;
  })();
function px(e, t) {
  return t.mainType === Py ? e.getViewOfSeriesModel(t) : e.getViewOfComponentModel(t);
}
var Pd = 1,
  Ed = {},
  ky = St(),
  hc = St(),
  cc = 0,
  ml = 1,
  yl = 2,
  tr = ["emphasis", "blur", "select"],
  Rd = ["normal", "emphasis", "blur", "select"],
  gx = 10,
  mx = 9,
  In = "highlight",
  us = "downplay",
  Bs = "select",
  Qf = "unselect",
  Ns = "toggleSelect",
  vc = "selectchanged";
function Wn(e) {
  return e != null && e !== "none";
}
function _l(e, t, r) {
  (e.onHoverStateChange && (e.hoverState || 0) !== r && e.onHoverStateChange(t), (e.hoverState = r));
}
function By(e) {
  _l(e, "emphasis", yl);
}
function Ny(e) {
  e.hoverState === yl && _l(e, "normal", cc);
}
function dc(e) {
  _l(e, "blur", ml);
}
function Fy(e) {
  e.hoverState === ml && _l(e, "normal", cc);
}
function yx(e) {
  e.selected = !0;
}
function _x(e) {
  e.selected = !1;
}
function Od(e, t, r) {
  t(e, r);
}
function mr(e, t, r) {
  (Od(e, t, r),
    e.isGroup &&
      e.traverse(function (n) {
        Od(n, t, r);
      }));
}
function kd(e, t) {
  switch (t) {
    case "emphasis":
      e.hoverState = yl;
      break;
    case "normal":
      e.hoverState = cc;
      break;
    case "blur":
      e.hoverState = ml;
      break;
    case "select":
      e.selected = !0;
  }
}
function Sx(e, t, r, n) {
  for (var i = e.style, a = {}, o = 0; o < t.length; o++) {
    var s = t[o],
      l = i[s];
    a[s] = l ?? (n && n[s]);
  }
  for (var o = 0; o < e.animators.length; o++) {
    var u = e.animators[o];
    u.__fromStateTransition && u.__fromStateTransition.indexOf(r) < 0 && u.targetName === "style" && u.saveTo(a, t);
  }
  return a;
}
function bx(e, t, r, n) {
  var i = r && vt(r, "select") >= 0,
    a = !1;
  if (e instanceof gt) {
    var o = ky(e),
      s = (i && o.selectFill) || o.normalFill,
      l = (i && o.selectStroke) || o.normalStroke;
    if (Wn(s) || Wn(l)) {
      n = n || {};
      var u = n.style || {};
      (u.fill === "inherit"
        ? ((a = !0), (n = N({}, n)), (u = N({}, u)), (u.fill = s))
        : !Wn(u.fill) && Wn(s)
          ? ((a = !0), (n = N({}, n)), (u = N({}, u)), (u.fill = Wv(s)))
          : !Wn(u.stroke) && Wn(l) && (a || ((n = N({}, n)), (u = N({}, u))), (u.stroke = Wv(l))),
        (n.style = u));
    }
  }
  if (n && n.z2 == null) {
    a || (n = N({}, n));
    var f = e.z2EmphasisLift;
    n.z2 = e.z2 + (f ?? gx);
  }
  return n;
}
function Tx(e, t, r) {
  if (r && r.z2 == null) {
    r = N({}, r);
    var n = e.z2SelectLift;
    r.z2 = e.z2 + (n ?? mx);
  }
  return r;
}
function xx(e, t, r) {
  var n = vt(e.currentStates, t) >= 0,
    i = e.style.opacity,
    a = n ? null : Sx(e, ["opacity"], t, { opacity: 1 });
  r = r || {};
  var o = r.style || {};
  return (o.opacity == null && ((r = N({}, r)), (o = N({ opacity: n ? i : a.opacity * 0.1 }, o)), (r.style = o)), r);
}
function Pu(e, t) {
  var r = this.states[e];
  if (this.style) {
    if (e === "emphasis") return bx(this, e, t, r);
    if (e === "blur") return xx(this, e, r);
    if (e === "select") return Tx(this, e, r);
  }
  return r;
}
function Cx(e) {
  e.stateProxy = Pu;
  var t = e.getTextContent(),
    r = e.getTextGuideLine();
  (t && (t.stateProxy = Pu), r && (r.stateProxy = Pu));
}
function Bd(e, t) {
  !Gy(e, t) && !e.__highByOuter && mr(e, By);
}
function Nd(e, t) {
  !Gy(e, t) && !e.__highByOuter && mr(e, Ny);
}
function Fs(e, t) {
  ((e.__highByOuter |= 1 << (t || 0)), mr(e, By));
}
function zs(e, t) {
  !(e.__highByOuter &= ~(1 << (t || 0))) && mr(e, Ny);
}
function Dx(e) {
  mr(e, dc);
}
function zy(e) {
  mr(e, Fy);
}
function Hy(e) {
  mr(e, yx);
}
function Vy(e) {
  mr(e, _x);
}
function Gy(e, t) {
  return e.__highDownSilentOnTouch && t.zrByTouch;
}
function Uy(e) {
  var t = e.getModel(),
    r = [],
    n = [];
  (t.eachComponent(function (i, a) {
    var o = hc(a),
      s = px(e, a),
      l = i === "series";
    (!l && n.push(s),
      o.isBlured &&
        (s.group.traverse(function (u) {
          Fy(u);
        }),
        l && r.push(a)),
      (o.isBlured = !1));
  }),
    I(n, function (i) {
      i && i.toggleBlurSeries && i.toggleBlurSeries(r, !1, t);
    }));
}
function jf(e, t, r, n) {
  var i = n.getModel();
  r = r || "coordinateSystem";
  function a(u, f) {
    for (var h = 0; h < f.length; h++) {
      var c = u.getItemGraphicEl(f[h]);
      c && zy(c);
    }
  }
  if (e != null && !(!t || t === "none")) {
    var o = i.getSeriesByIndex(e),
      s = o.coordinateSystem;
    s && s.master && (s = s.master);
    var l = [];
    (i.eachSeries(function (u) {
      var f = o === u,
        h = u.coordinateSystem;
      h && h.master && (h = h.master);
      var c = h && s ? h === s : f;
      if (!((r === "series" && !f) || (r === "coordinateSystem" && !c) || (t === "series" && f))) {
        var v = n.getViewOfSeriesModel(u);
        if (
          (v.group.traverse(function (m) {
            (m.__highByOuter && f && t === "self") || dc(m);
          }),
          ae(t))
        )
          a(u.getData(), t);
        else if (Z(t)) for (var d = xt(t), p = 0; p < d.length; p++) a(u.getData(d[p]), t[d[p]]);
        (l.push(u), (hc(u).isBlured = !0));
      }
    }),
      i.eachComponent(function (u, f) {
        if (u !== "series") {
          var h = n.getViewOfComponentModel(f);
          h && h.toggleBlurSeries && h.toggleBlurSeries(l, !0, i);
        }
      }));
  }
}
function Jf(e, t, r) {
  if (!(e == null || t == null)) {
    var n = r.getModel().getComponent(e, t);
    if (n) {
      hc(n).isBlured = !0;
      var i = r.getViewOfComponentModel(n);
      !i ||
        !i.focusBlurEnabled ||
        i.group.traverse(function (a) {
          dc(a);
        });
    }
  }
}
function Ax(e, t, r) {
  var n = e.seriesIndex,
    i = e.getData(t.dataType);
  if (i) {
    var a = En(i, t);
    a = (U(a) ? a[0] : a) || 0;
    var o = i.getItemGraphicEl(a);
    if (!o) for (var s = i.count(), l = 0; !o && l < s; ) o = i.getItemGraphicEl(l++);
    if (o) {
      var u = ut(o);
      jf(n, u.focus, u.blurScope, r);
    } else {
      var f = e.get(["emphasis", "focus"]),
        h = e.get(["emphasis", "blurScope"]);
      f != null && jf(n, f, h, r);
    }
  }
}
function pc(e, t, r, n) {
  var i = { focusSelf: !1, dispatchers: null };
  if (e == null || e === "series" || t == null || r == null) return i;
  var a = n.getModel().getComponent(e, t);
  if (!a) return i;
  var o = n.getViewOfComponentModel(a);
  if (!o || !o.findHighDownDispatchers) return i;
  for (var s = o.findHighDownDispatchers(r), l, u = 0; u < s.length; u++)
    if (ut(s[u]).focus === "self") {
      l = !0;
      break;
    }
  return { focusSelf: l, dispatchers: s };
}
function Mx(e, t, r) {
  var n = ut(e),
    i = pc(n.componentMainType, n.componentIndex, n.componentHighDownName, r),
    a = i.dispatchers,
    o = i.focusSelf;
  a
    ? (o && Jf(n.componentMainType, n.componentIndex, r),
      I(a, function (s) {
        return Bd(s, t);
      }))
    : (jf(n.seriesIndex, n.focus, n.blurScope, r),
      n.focus === "self" && Jf(n.componentMainType, n.componentIndex, r),
      Bd(e, t));
}
function Ix(e, t, r) {
  Uy(r);
  var n = ut(e),
    i = pc(n.componentMainType, n.componentIndex, n.componentHighDownName, r).dispatchers;
  i
    ? I(i, function (a) {
        return Nd(a, t);
      })
    : Nd(e, t);
}
function Lx(e, t, r) {
  if (nh(t)) {
    var n = t.dataType,
      i = e.getData(n),
      a = En(i, t);
    (U(a) || (a = [a]), e[t.type === Ns ? "toggleSelect" : t.type === Bs ? "select" : "unselect"](a, n));
  }
}
function Fd(e) {
  var t = e.getAllData();
  I(t, function (r) {
    var n = r.data,
      i = r.type;
    n.eachItemGraphicEl(function (a, o) {
      e.isSelected(o, i) ? Hy(a) : Vy(a);
    });
  });
}
function Px(e) {
  var t = [];
  return (
    e.eachSeries(function (r) {
      var n = r.getAllData();
      I(n, function (i) {
        i.data;
        var a = i.type,
          o = r.getSelectedDataIndices();
        if (o.length > 0) {
          var s = { dataIndex: o, seriesIndex: r.seriesIndex };
          (a != null && (s.dataType = a), t.push(s));
        }
      });
    }),
    t
  );
}
function th(e, t, r) {
  (Wy(e, !0), mr(e, Cx), Rx(e, t, r));
}
function Ex(e) {
  Wy(e, !1);
}
function Hs(e, t, r, n) {
  n ? Ex(e) : th(e, t, r);
}
function Rx(e, t, r) {
  var n = ut(e);
  t != null ? ((n.focus = t), (n.blurScope = r)) : n.focus && (n.focus = null);
}
var zd = ["emphasis", "blur", "select"],
  Ox = { itemStyle: "getItemStyle", lineStyle: "getLineStyle", areaStyle: "getAreaStyle" };
function eh(e, t, r, n) {
  r = r || "itemStyle";
  for (var i = 0; i < zd.length; i++) {
    var a = zd[i],
      o = t.getModel([a, r]),
      s = e.ensureState(a);
    s.style = o[Ox[r]]();
  }
}
function Wy(e, t) {
  var r = t === !1,
    n = e;
  (e.highDownSilentOnTouch && (n.__highDownSilentOnTouch = e.highDownSilentOnTouch),
    (!r || n.__highDownDispatcher) && ((n.__highByOuter = n.__highByOuter || 0), (n.__highDownDispatcher = !r)));
}
function rh(e) {
  return !!(e && e.__highDownDispatcher);
}
function kx(e) {
  var t = Ed[e];
  return (t == null && Pd <= 32 && (t = Ed[e] = Pd++), t);
}
function nh(e) {
  var t = e.type;
  return t === Bs || t === Qf || t === Ns;
}
function Hd(e) {
  var t = e.type;
  return t === In || t === us;
}
function Bx(e) {
  var t = ky(e);
  ((t.normalFill = e.style.fill), (t.normalStroke = e.style.stroke));
  var r = e.states.select || {};
  ((t.selectFill = (r.style && r.style.fill) || null), (t.selectStroke = (r.style && r.style.stroke) || null));
}
var Yn = Rn.CMD,
  Nx = [[], [], []],
  Vd = Math.sqrt,
  Fx = Math.atan2;
function zx(e, t) {
  if (t) {
    var r = e.data,
      n = e.len(),
      i,
      a,
      o,
      s,
      l,
      u,
      f = Yn.M,
      h = Yn.C,
      c = Yn.L,
      v = Yn.R,
      d = Yn.A,
      p = Yn.Q;
    for (o = 0, s = 0; o < n; ) {
      switch (((i = r[o++]), (s = o), (a = 0), i)) {
        case f:
          a = 1;
          break;
        case c:
          a = 1;
          break;
        case h:
          a = 3;
          break;
        case p:
          a = 2;
          break;
        case d:
          var m = t[4],
            g = t[5],
            y = Vd(t[0] * t[0] + t[1] * t[1]),
            _ = Vd(t[2] * t[2] + t[3] * t[3]),
            S = Fx(-t[1] / _, t[0] / y);
          ((r[o] *= y),
            (r[o++] += m),
            (r[o] *= _),
            (r[o++] += g),
            (r[o++] *= y),
            (r[o++] *= _),
            (r[o++] += S),
            (r[o++] += S),
            (o += 2),
            (s = o));
          break;
        case v:
          ((u[0] = r[o++]),
            (u[1] = r[o++]),
            Ae(u, u, t),
            (r[s++] = u[0]),
            (r[s++] = u[1]),
            (u[0] += r[o++]),
            (u[1] += r[o++]),
            Ae(u, u, t),
            (r[s++] = u[0]),
            (r[s++] = u[1]));
      }
      for (l = 0; l < a; l++) {
        var b = Nx[l];
        ((b[0] = r[o++]), (b[1] = r[o++]), Ae(b, b, t), (r[s++] = b[0]), (r[s++] = b[1]));
      }
    }
    e.increaseVersion();
  }
}
var Eu = Math.sqrt,
  _o = Math.sin,
  So = Math.cos,
  Yi = Math.PI;
function Gd(e) {
  return Math.sqrt(e[0] * e[0] + e[1] * e[1]);
}
function ih(e, t) {
  return (e[0] * t[0] + e[1] * t[1]) / (Gd(e) * Gd(t));
}
function Ud(e, t) {
  return (e[0] * t[1] < e[1] * t[0] ? -1 : 1) * Math.acos(ih(e, t));
}
function Wd(e, t, r, n, i, a, o, s, l, u, f) {
  var h = l * (Yi / 180),
    c = (So(h) * (e - r)) / 2 + (_o(h) * (t - n)) / 2,
    v = (-1 * _o(h) * (e - r)) / 2 + (So(h) * (t - n)) / 2,
    d = (c * c) / (o * o) + (v * v) / (s * s);
  d > 1 && ((o *= Eu(d)), (s *= Eu(d)));
  var p =
      (i === a ? -1 : 1) *
        Eu((o * o * (s * s) - o * o * (v * v) - s * s * (c * c)) / (o * o * (v * v) + s * s * (c * c))) || 0,
    m = (p * o * v) / s,
    g = (p * -s * c) / o,
    y = (e + r) / 2 + So(h) * m - _o(h) * g,
    _ = (t + n) / 2 + _o(h) * m + So(h) * g,
    S = Ud([1, 0], [(c - m) / o, (v - g) / s]),
    b = [(c - m) / o, (v - g) / s],
    w = [(-1 * c - m) / o, (-1 * v - g) / s],
    T = Ud(b, w);
  if ((ih(b, w) <= -1 && (T = Yi), ih(b, w) >= 1 && (T = 0), T < 0)) {
    var C = Math.round((T / Yi) * 1e6) / 1e6;
    T = Yi * 2 + (C % 2) * Yi;
  }
  f.addData(u, y, _, o, s, S, T, h, a);
}
var Hx = /([mlvhzcqtsa])([^mlvhzcqtsa]*)/gi,
  Vx = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
function Gx(e) {
  var t = new Rn();
  if (!e) return t;
  var r = 0,
    n = 0,
    i = r,
    a = n,
    o,
    s = Rn.CMD,
    l = e.match(Hx);
  if (!l) return t;
  for (var u = 0; u < l.length; u++) {
    for (var f = l[u], h = f.charAt(0), c = void 0, v = f.match(Vx) || [], d = v.length, p = 0; p < d; p++)
      v[p] = parseFloat(v[p]);
    for (var m = 0; m < d; ) {
      var g = void 0,
        y = void 0,
        _ = void 0,
        S = void 0,
        b = void 0,
        w = void 0,
        T = void 0,
        C = r,
        A = n,
        M = void 0,
        D = void 0;
      switch (h) {
        case "l":
          ((r += v[m++]), (n += v[m++]), (c = s.L), t.addData(c, r, n));
          break;
        case "L":
          ((r = v[m++]), (n = v[m++]), (c = s.L), t.addData(c, r, n));
          break;
        case "m":
          ((r += v[m++]), (n += v[m++]), (c = s.M), t.addData(c, r, n), (i = r), (a = n), (h = "l"));
          break;
        case "M":
          ((r = v[m++]), (n = v[m++]), (c = s.M), t.addData(c, r, n), (i = r), (a = n), (h = "L"));
          break;
        case "h":
          ((r += v[m++]), (c = s.L), t.addData(c, r, n));
          break;
        case "H":
          ((r = v[m++]), (c = s.L), t.addData(c, r, n));
          break;
        case "v":
          ((n += v[m++]), (c = s.L), t.addData(c, r, n));
          break;
        case "V":
          ((n = v[m++]), (c = s.L), t.addData(c, r, n));
          break;
        case "C":
          ((c = s.C), t.addData(c, v[m++], v[m++], v[m++], v[m++], v[m++], v[m++]), (r = v[m - 2]), (n = v[m - 1]));
          break;
        case "c":
          ((c = s.C),
            t.addData(c, v[m++] + r, v[m++] + n, v[m++] + r, v[m++] + n, v[m++] + r, v[m++] + n),
            (r += v[m - 2]),
            (n += v[m - 1]));
          break;
        case "S":
          ((g = r),
            (y = n),
            (M = t.len()),
            (D = t.data),
            o === s.C && ((g += r - D[M - 4]), (y += n - D[M - 3])),
            (c = s.C),
            (C = v[m++]),
            (A = v[m++]),
            (r = v[m++]),
            (n = v[m++]),
            t.addData(c, g, y, C, A, r, n));
          break;
        case "s":
          ((g = r),
            (y = n),
            (M = t.len()),
            (D = t.data),
            o === s.C && ((g += r - D[M - 4]), (y += n - D[M - 3])),
            (c = s.C),
            (C = r + v[m++]),
            (A = n + v[m++]),
            (r += v[m++]),
            (n += v[m++]),
            t.addData(c, g, y, C, A, r, n));
          break;
        case "Q":
          ((C = v[m++]), (A = v[m++]), (r = v[m++]), (n = v[m++]), (c = s.Q), t.addData(c, C, A, r, n));
          break;
        case "q":
          ((C = v[m++] + r), (A = v[m++] + n), (r += v[m++]), (n += v[m++]), (c = s.Q), t.addData(c, C, A, r, n));
          break;
        case "T":
          ((g = r),
            (y = n),
            (M = t.len()),
            (D = t.data),
            o === s.Q && ((g += r - D[M - 4]), (y += n - D[M - 3])),
            (r = v[m++]),
            (n = v[m++]),
            (c = s.Q),
            t.addData(c, g, y, r, n));
          break;
        case "t":
          ((g = r),
            (y = n),
            (M = t.len()),
            (D = t.data),
            o === s.Q && ((g += r - D[M - 4]), (y += n - D[M - 3])),
            (r += v[m++]),
            (n += v[m++]),
            (c = s.Q),
            t.addData(c, g, y, r, n));
          break;
        case "A":
          ((_ = v[m++]),
            (S = v[m++]),
            (b = v[m++]),
            (w = v[m++]),
            (T = v[m++]),
            (C = r),
            (A = n),
            (r = v[m++]),
            (n = v[m++]),
            (c = s.A),
            Wd(C, A, r, n, w, T, _, S, b, c, t));
          break;
        case "a":
          ((_ = v[m++]),
            (S = v[m++]),
            (b = v[m++]),
            (w = v[m++]),
            (T = v[m++]),
            (C = r),
            (A = n),
            (r += v[m++]),
            (n += v[m++]),
            (c = s.A),
            Wd(C, A, r, n, w, T, _, S, b, c, t));
          break;
      }
    }
    ((h === "z" || h === "Z") && ((c = s.Z), t.addData(c), (r = i), (n = a)), (o = c));
  }
  return (t.toStatic(), t);
}
var Yy = (function (e) {
  V(t, e);
  function t() {
    return (e !== null && e.apply(this, arguments)) || this;
  }
  return ((t.prototype.applyTransform = function (r) {}), t);
})(gt);
function Xy(e) {
  return e.setData != null;
}
function $y(e, t) {
  var r = Gx(e),
    n = N({}, t);
  return (
    (n.buildPath = function (i) {
      var a = Xy(i);
      if (a && i.canSave()) {
        i.appendPath(r);
        var o = i.getContext();
        o && i.rebuildPath(o, 1);
      } else {
        var o = a ? i.getContext() : i;
        o && r.rebuildPath(o, 1);
      }
    }),
    (n.applyTransform = function (i) {
      (zx(r, i), this.dirtyShape());
    }),
    n
  );
}
function Ux(e, t) {
  return new Yy($y(e, t));
}
function Wx(e, t) {
  var r = $y(e, t),
    n = (function (i) {
      V(a, i);
      function a(o) {
        var s = i.call(this, o) || this;
        return ((s.applyTransform = r.applyTransform), (s.buildPath = r.buildPath), s);
      }
      return a;
    })(Yy);
  return n;
}
function Yx(e, t) {
  for (var r = [], n = e.length, i = 0; i < n; i++) {
    var a = e[i];
    r.push(a.getUpdatedPathProxy(!0));
  }
  var o = new gt(t);
  return (
    o.createPathProxy(),
    (o.buildPath = function (s) {
      if (Xy(s)) {
        s.appendPath(r);
        var l = s.getContext();
        l && s.rebuildPath(l, 1);
      }
    }),
    o
  );
}
var Xx = (function () {
    function e() {
      ((this.cx = 0), (this.cy = 0), (this.r = 0));
    }
    return e;
  })(),
  Sl = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype.getDefaultShape = function () {
        return new Xx();
      }),
      (t.prototype.buildPath = function (r, n) {
        (r.moveTo(n.cx + n.r, n.cy), r.arc(n.cx, n.cy, n.r, 0, Math.PI * 2));
      }),
      t
    );
  })(gt);
Sl.prototype.type = "circle";
var $x = (function () {
    function e() {
      ((this.cx = 0), (this.cy = 0), (this.rx = 0), (this.ry = 0));
    }
    return e;
  })(),
  gc = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype.getDefaultShape = function () {
        return new $x();
      }),
      (t.prototype.buildPath = function (r, n) {
        var i = 0.5522848,
          a = n.cx,
          o = n.cy,
          s = n.rx,
          l = n.ry,
          u = s * i,
          f = l * i;
        (r.moveTo(a - s, o),
          r.bezierCurveTo(a - s, o - f, a - u, o - l, a, o - l),
          r.bezierCurveTo(a + u, o - l, a + s, o - f, a + s, o),
          r.bezierCurveTo(a + s, o + f, a + u, o + l, a, o + l),
          r.bezierCurveTo(a - u, o + l, a - s, o + f, a - s, o),
          r.closePath());
      }),
      t
    );
  })(gt);
gc.prototype.type = "ellipse";
var Zy = Math.PI,
  Ru = Zy * 2,
  un = Math.sin,
  Xn = Math.cos,
  Zx = Math.acos,
  Ft = Math.atan2,
  Yd = Math.abs,
  ma = Math.sqrt,
  la = Math.max,
  We = Math.min,
  Pe = 1e-4;
function qx(e, t, r, n, i, a, o, s) {
  var l = r - e,
    u = n - t,
    f = o - i,
    h = s - a,
    c = h * l - f * u;
  if (!(c * c < Pe)) return ((c = (f * (t - a) - h * (e - i)) / c), [e + c * l, t + c * u]);
}
function bo(e, t, r, n, i, a, o) {
  var s = e - r,
    l = t - n,
    u = (o ? a : -a) / ma(s * s + l * l),
    f = u * l,
    h = -u * s,
    c = e + f,
    v = t + h,
    d = r + f,
    p = n + h,
    m = (c + d) / 2,
    g = (v + p) / 2,
    y = d - c,
    _ = p - v,
    S = y * y + _ * _,
    b = i - a,
    w = c * p - d * v,
    T = (_ < 0 ? -1 : 1) * ma(la(0, b * b * S - w * w)),
    C = (w * _ - y * T) / S,
    A = (-w * y - _ * T) / S,
    M = (w * _ + y * T) / S,
    D = (-w * y + _ * T) / S,
    P = C - m,
    x = A - g,
    L = M - m,
    E = D - g;
  return (
    P * P + x * x > L * L + E * E && ((C = M), (A = D)),
    { cx: C, cy: A, x0: -f, y0: -h, x1: C * (i / b - 1), y1: A * (i / b - 1) }
  );
}
function Kx(e) {
  var t;
  if (U(e)) {
    var r = e.length;
    if (!r) return e;
    r === 1
      ? (t = [e[0], e[0], 0, 0])
      : r === 2
        ? (t = [e[0], e[0], e[1], e[1]])
        : r === 3
          ? (t = e.concat(e[2]))
          : (t = e);
  } else t = [e, e, e, e];
  return t;
}
function Qx(e, t) {
  var r,
    n = la(t.r, 0),
    i = la(t.r0 || 0, 0),
    a = n > 0,
    o = i > 0;
  if (!(!a && !o)) {
    if ((a || ((n = i), (i = 0)), i > n)) {
      var s = n;
      ((n = i), (i = s));
    }
    var l = t.startAngle,
      u = t.endAngle;
    if (!(isNaN(l) || isNaN(u))) {
      var f = t.cx,
        h = t.cy,
        c = !!t.clockwise,
        v = Yd(u - l),
        d = v > Ru && v % Ru;
      if ((d > Pe && (v = d), !(n > Pe))) e.moveTo(f, h);
      else if (v > Ru - Pe)
        (e.moveTo(f + n * Xn(l), h + n * un(l)),
          e.arc(f, h, n, l, u, !c),
          i > Pe && (e.moveTo(f + i * Xn(u), h + i * un(u)), e.arc(f, h, i, u, l, c)));
      else {
        var p = void 0,
          m = void 0,
          g = void 0,
          y = void 0,
          _ = void 0,
          S = void 0,
          b = void 0,
          w = void 0,
          T = void 0,
          C = void 0,
          A = void 0,
          M = void 0,
          D = void 0,
          P = void 0,
          x = void 0,
          L = void 0,
          E = n * Xn(l),
          R = n * un(l),
          B = i * Xn(u),
          O = i * un(u),
          k = v > Pe;
        if (k) {
          var z = t.cornerRadius;
          z && ((r = Kx(z)), (p = r[0]), (m = r[1]), (g = r[2]), (y = r[3]));
          var H = Yd(n - i) / 2;
          if (
            ((_ = We(H, g)),
            (S = We(H, y)),
            (b = We(H, p)),
            (w = We(H, m)),
            (A = T = la(_, S)),
            (M = C = la(b, w)),
            (T > Pe || C > Pe) && ((D = n * Xn(u)), (P = n * un(u)), (x = i * Xn(l)), (L = i * un(l)), v < Zy))
          ) {
            var W = qx(E, R, x, L, D, P, B, O);
            if (W) {
              var $ = E - W[0],
                G = R - W[1],
                K = D - W[0],
                at = P - W[1],
                Et = 1 / un(Zx(($ * K + G * at) / (ma($ * $ + G * G) * ma(K * K + at * at))) / 2),
                Jt = ma(W[0] * W[0] + W[1] * W[1]);
              ((A = We(T, (n - Jt) / (Et + 1))), (M = We(C, (i - Jt) / (Et - 1))));
            }
          }
        }
        if (!k) e.moveTo(f + E, h + R);
        else if (A > Pe) {
          var yt = We(g, A),
            Dt = We(y, A),
            tt = bo(x, L, E, R, n, yt, c),
            st = bo(D, P, B, O, n, Dt, c);
          (e.moveTo(f + tt.cx + tt.x0, h + tt.cy + tt.y0),
            A < T && yt === Dt
              ? e.arc(f + tt.cx, h + tt.cy, A, Ft(tt.y0, tt.x0), Ft(st.y0, st.x0), !c)
              : (yt > 0 && e.arc(f + tt.cx, h + tt.cy, yt, Ft(tt.y0, tt.x0), Ft(tt.y1, tt.x1), !c),
                e.arc(f, h, n, Ft(tt.cy + tt.y1, tt.cx + tt.x1), Ft(st.cy + st.y1, st.cx + st.x1), !c),
                Dt > 0 && e.arc(f + st.cx, h + st.cy, Dt, Ft(st.y1, st.x1), Ft(st.y0, st.x0), !c)));
        } else (e.moveTo(f + E, h + R), e.arc(f, h, n, l, u, !c));
        if (!(i > Pe) || !k) e.lineTo(f + B, h + O);
        else if (M > Pe) {
          var yt = We(p, M),
            Dt = We(m, M),
            tt = bo(B, O, D, P, i, -Dt, c),
            st = bo(E, R, x, L, i, -yt, c);
          (e.lineTo(f + tt.cx + tt.x0, h + tt.cy + tt.y0),
            M < C && yt === Dt
              ? e.arc(f + tt.cx, h + tt.cy, M, Ft(tt.y0, tt.x0), Ft(st.y0, st.x0), !c)
              : (Dt > 0 && e.arc(f + tt.cx, h + tt.cy, Dt, Ft(tt.y0, tt.x0), Ft(tt.y1, tt.x1), !c),
                e.arc(f, h, i, Ft(tt.cy + tt.y1, tt.cx + tt.x1), Ft(st.cy + st.y1, st.cx + st.x1), c),
                yt > 0 && e.arc(f + st.cx, h + st.cy, yt, Ft(st.y1, st.x1), Ft(st.y0, st.x0), !c)));
        } else (e.lineTo(f + B, h + O), e.arc(f, h, i, u, l, c));
      }
      e.closePath();
    }
  }
}
var jx = (function () {
    function e() {
      ((this.cx = 0),
        (this.cy = 0),
        (this.r0 = 0),
        (this.r = 0),
        (this.startAngle = 0),
        (this.endAngle = Math.PI * 2),
        (this.clockwise = !0),
        (this.cornerRadius = 0));
    }
    return e;
  })(),
  Ri = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype.getDefaultShape = function () {
        return new jx();
      }),
      (t.prototype.buildPath = function (r, n) {
        Qx(r, n);
      }),
      (t.prototype.isZeroArea = function () {
        return this.shape.startAngle === this.shape.endAngle || this.shape.r === this.shape.r0;
      }),
      t
    );
  })(gt);
Ri.prototype.type = "sector";
var Jx = (function () {
    function e() {
      ((this.cx = 0), (this.cy = 0), (this.r = 0), (this.r0 = 0));
    }
    return e;
  })(),
  mc = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype.getDefaultShape = function () {
        return new Jx();
      }),
      (t.prototype.buildPath = function (r, n) {
        var i = n.cx,
          a = n.cy,
          o = Math.PI * 2;
        (r.moveTo(i + n.r, a), r.arc(i, a, n.r, 0, o, !1), r.moveTo(i + n.r0, a), r.arc(i, a, n.r0, 0, o, !0));
      }),
      t
    );
  })(gt);
mc.prototype.type = "ring";
function tC(e, t, r, n) {
  var i = [],
    a = [],
    o = [],
    s = [],
    l,
    u,
    f,
    h;
  if (n) {
    ((f = [1 / 0, 1 / 0]), (h = [-1 / 0, -1 / 0]));
    for (var c = 0, v = e.length; c < v; c++) (ni(f, f, e[c]), ii(h, h, e[c]));
    (ni(f, f, n[0]), ii(h, h, n[1]));
  }
  for (var c = 0, v = e.length; c < v; c++) {
    var d = e[c];
    if (r) ((l = e[c ? c - 1 : v - 1]), (u = e[(c + 1) % v]));
    else if (c === 0 || c === v - 1) {
      i.push(cb(e[c]));
      continue;
    } else ((l = e[c - 1]), (u = e[c + 1]));
    (vb(a, u, l), Zl(a, a, t));
    var p = Cf(d, l),
      m = Cf(d, u),
      g = p + m;
    (g !== 0 && ((p /= g), (m /= g)), Zl(o, a, -p), Zl(s, a, m));
    var y = Dv([], d, o),
      _ = Dv([], d, s);
    (n && (ii(y, y, f), ni(y, y, h), ii(_, _, f), ni(_, _, h)), i.push(y), i.push(_));
  }
  return (r && i.push(i.shift()), i);
}
function qy(e, t, r) {
  var n = t.smooth,
    i = t.points;
  if (i && i.length >= 2) {
    if (n) {
      var a = tC(i, n, r, t.smoothConstraint);
      e.moveTo(i[0][0], i[0][1]);
      for (var o = i.length, s = 0; s < (r ? o : o - 1); s++) {
        var l = a[s * 2],
          u = a[s * 2 + 1],
          f = i[(s + 1) % o];
        e.bezierCurveTo(l[0], l[1], u[0], u[1], f[0], f[1]);
      }
    } else {
      e.moveTo(i[0][0], i[0][1]);
      for (var s = 1, h = i.length; s < h; s++) e.lineTo(i[s][0], i[s][1]);
    }
    r && e.closePath();
  }
}
var eC = (function () {
    function e() {
      ((this.points = null), (this.smooth = 0), (this.smoothConstraint = null));
    }
    return e;
  })(),
  yc = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype.getDefaultShape = function () {
        return new eC();
      }),
      (t.prototype.buildPath = function (r, n) {
        qy(r, n, !0);
      }),
      t
    );
  })(gt);
yc.prototype.type = "polygon";
var rC = (function () {
    function e() {
      ((this.points = null), (this.percent = 1), (this.smooth = 0), (this.smoothConstraint = null));
    }
    return e;
  })(),
  _c = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype.getDefaultStyle = function () {
        return { stroke: "#000", fill: null };
      }),
      (t.prototype.getDefaultShape = function () {
        return new rC();
      }),
      (t.prototype.buildPath = function (r, n) {
        qy(r, n, !1);
      }),
      t
    );
  })(gt);
_c.prototype.type = "polyline";
var nC = {},
  iC = (function () {
    function e() {
      ((this.x1 = 0), (this.y1 = 0), (this.x2 = 0), (this.y2 = 0), (this.percent = 1));
    }
    return e;
  })(),
  Fr = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype.getDefaultStyle = function () {
        return { stroke: "#000", fill: null };
      }),
      (t.prototype.getDefaultShape = function () {
        return new iC();
      }),
      (t.prototype.buildPath = function (r, n) {
        var i, a, o, s;
        if (this.subPixelOptimize) {
          var l = Iy(nC, n, this.style);
          ((i = l.x1), (a = l.y1), (o = l.x2), (s = l.y2));
        } else ((i = n.x1), (a = n.y1), (o = n.x2), (s = n.y2));
        var u = n.percent;
        u !== 0 && (r.moveTo(i, a), u < 1 && ((o = i * (1 - u) + o * u), (s = a * (1 - u) + s * u)), r.lineTo(o, s));
      }),
      (t.prototype.pointAt = function (r) {
        var n = this.shape;
        return [n.x1 * (1 - r) + n.x2 * r, n.y1 * (1 - r) + n.y2 * r];
      }),
      t
    );
  })(gt);
Fr.prototype.type = "line";
var te = [],
  aC = (function () {
    function e() {
      ((this.x1 = 0),
        (this.y1 = 0),
        (this.x2 = 0),
        (this.y2 = 0),
        (this.cpx1 = 0),
        (this.cpy1 = 0),
        (this.percent = 1));
    }
    return e;
  })();
function Xd(e, t, r) {
  var n = e.cpx2,
    i = e.cpy2;
  return n != null || i != null
    ? [(r ? zv : Nt)(e.x1, e.cpx1, e.cpx2, e.x2, t), (r ? zv : Nt)(e.y1, e.cpy1, e.cpy2, e.y2, t)]
    : [(r ? Hv : re)(e.x1, e.cpx1, e.x2, t), (r ? Hv : re)(e.y1, e.cpy1, e.y2, t)];
}
var Sc = (function (e) {
  V(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return (
    (t.prototype.getDefaultStyle = function () {
      return { stroke: "#000", fill: null };
    }),
    (t.prototype.getDefaultShape = function () {
      return new aC();
    }),
    (t.prototype.buildPath = function (r, n) {
      var i = n.x1,
        a = n.y1,
        o = n.x2,
        s = n.y2,
        l = n.cpx1,
        u = n.cpy1,
        f = n.cpx2,
        h = n.cpy2,
        c = n.percent;
      c !== 0 &&
        (r.moveTo(i, a),
        f == null || h == null
          ? (c < 1 && (Ms(i, l, o, c, te), (l = te[1]), (o = te[2]), Ms(a, u, s, c, te), (u = te[1]), (s = te[2])),
            r.quadraticCurveTo(l, u, o, s))
          : (c < 1 &&
              (As(i, l, f, o, c, te),
              (l = te[1]),
              (f = te[2]),
              (o = te[3]),
              As(a, u, h, s, c, te),
              (u = te[1]),
              (h = te[2]),
              (s = te[3])),
            r.bezierCurveTo(l, u, f, h, o, s)));
    }),
    (t.prototype.pointAt = function (r) {
      return Xd(this.shape, r, !1);
    }),
    (t.prototype.tangentAt = function (r) {
      var n = Xd(this.shape, r, !0);
      return gb(n, n);
    }),
    t
  );
})(gt);
Sc.prototype.type = "bezier-curve";
var oC = (function () {
    function e() {
      ((this.cx = 0),
        (this.cy = 0),
        (this.r = 0),
        (this.startAngle = 0),
        (this.endAngle = Math.PI * 2),
        (this.clockwise = !0));
    }
    return e;
  })(),
  bl = (function (e) {
    V(t, e);
    function t(r) {
      return e.call(this, r) || this;
    }
    return (
      (t.prototype.getDefaultStyle = function () {
        return { stroke: "#000", fill: null };
      }),
      (t.prototype.getDefaultShape = function () {
        return new oC();
      }),
      (t.prototype.buildPath = function (r, n) {
        var i = n.cx,
          a = n.cy,
          o = Math.max(n.r, 0),
          s = n.startAngle,
          l = n.endAngle,
          u = n.clockwise,
          f = Math.cos(s),
          h = Math.sin(s);
        (r.moveTo(f * o + i, h * o + a), r.arc(i, a, o, s, l, !u));
      }),
      t
    );
  })(gt);
bl.prototype.type = "arc";
var sC = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = "compound"), r);
    }
    return (
      (t.prototype._updatePathDirty = function () {
        for (var r = this.shape.paths, n = this.shapeChanged(), i = 0; i < r.length; i++) n = n || r[i].shapeChanged();
        n && this.dirtyShape();
      }),
      (t.prototype.beforeBrush = function () {
        this._updatePathDirty();
        for (var r = this.shape.paths || [], n = this.getGlobalScale(), i = 0; i < r.length; i++)
          (r[i].path || r[i].createPathProxy(), r[i].path.setScale(n[0], n[1], r[i].segmentIgnoreThreshold));
      }),
      (t.prototype.buildPath = function (r, n) {
        for (var i = n.paths || [], a = 0; a < i.length; a++) i[a].buildPath(r, i[a].shape, !0);
      }),
      (t.prototype.afterBrush = function () {
        for (var r = this.shape.paths || [], n = 0; n < r.length; n++) r[n].pathUpdated();
      }),
      (t.prototype.getBoundingRect = function () {
        return (this._updatePathDirty.call(this), gt.prototype.getBoundingRect.call(this));
      }),
      t
    );
  })(gt),
  Ky = (function () {
    function e(t) {
      this.colorStops = t || [];
    }
    return (
      (e.prototype.addColorStop = function (t, r) {
        this.colorStops.push({ offset: t, color: r });
      }),
      e
    );
  })(),
  Qy = (function (e) {
    V(t, e);
    function t(r, n, i, a, o, s) {
      var l = e.call(this, o) || this;
      return (
        (l.x = r ?? 0),
        (l.y = n ?? 0),
        (l.x2 = i ?? 1),
        (l.y2 = a ?? 0),
        (l.type = "linear"),
        (l.global = s || !1),
        l
      );
    }
    return t;
  })(Ky),
  lC = (function (e) {
    V(t, e);
    function t(r, n, i, a, o) {
      var s = e.call(this, a) || this;
      return ((s.x = r ?? 0.5), (s.y = n ?? 0.5), (s.r = i ?? 0.5), (s.type = "radial"), (s.global = o || !1), s);
    }
    return t;
  })(Ky),
  Ou = Math.min,
  uC = Math.max,
  wo = Math.abs,
  fn = [0, 0],
  hn = [0, 0],
  kt = Gm(),
  To = kt.minTv,
  xo = kt.maxTv,
  jy = (function () {
    function e(t, r) {
      ((this._corners = []), (this._axes = []), (this._origin = [0, 0]));
      for (var n = 0; n < 4; n++) this._corners[n] = new _t();
      for (var n = 0; n < 2; n++) this._axes[n] = new _t();
      t && this.fromBoundingRect(t, r);
    }
    return (
      (e.prototype.fromBoundingRect = function (t, r) {
        var n = this._corners,
          i = this._axes,
          a = t.x,
          o = t.y,
          s = a + t.width,
          l = o + t.height;
        if ((n[0].set(a, o), n[1].set(s, o), n[2].set(s, l), n[3].set(a, l), r))
          for (var u = 0; u < 4; u++) n[u].transform(r);
        (_t.sub(i[0], n[1], n[0]), _t.sub(i[1], n[3], n[0]), i[0].normalize(), i[1].normalize());
        for (var u = 0; u < 2; u++) this._origin[u] = i[u].dot(n[0]);
      }),
      (e.prototype.intersect = function (t, r, n) {
        var i = !0,
          a = !r;
        return (
          r && _t.set(r, 0, 0),
          kt.reset(n, !a),
          (!this._intersectCheckOneSide(this, t, a, 1) && ((i = !1), a)) ||
            (!this._intersectCheckOneSide(t, this, a, -1) && ((i = !1), a)) ||
            (!a && !kt.negativeSize && _t.copy(r, i ? (kt.useDir ? kt.dirMinTv : To) : xo)),
          i
        );
      }),
      (e.prototype._intersectCheckOneSide = function (t, r, n, i) {
        for (var a = !0, o = 0; o < 2; o++) {
          var s = t._axes[o];
          if (
            (t._getProjMinMaxOnAxis(o, t._corners, fn),
            t._getProjMinMaxOnAxis(o, r._corners, hn),
            kt.negativeSize || fn[1] < hn[0] || fn[0] > hn[1])
          ) {
            if (((a = !1), kt.negativeSize || n)) return a;
            var l = wo(hn[0] - fn[1]),
              u = wo(fn[0] - hn[1]);
            Ou(l, u) > xo.len() && (l < u ? _t.scale(xo, s, -l * i) : _t.scale(xo, s, u * i));
          } else if (!n) {
            var l = wo(hn[0] - fn[1]),
              u = wo(fn[0] - hn[1]);
            (kt.useDir || Ou(l, u) < To.len()) &&
              ((l < u || !kt.bidirectional) && (_t.scale(To, s, l * i), kt.useDir && kt.calcDirMTV()),
              (l >= u || !kt.bidirectional) && (_t.scale(To, s, -u * i), kt.useDir && kt.calcDirMTV()));
          }
        }
        return a;
      }),
      (e.prototype._getProjMinMaxOnAxis = function (t, r, n) {
        for (var i = this._axes[t], a = this._origin, o = r[0].dot(i) + a[t], s = o, l = o, u = 1; u < r.length; u++) {
          var f = r[u].dot(i) + a[t];
          ((s = Ou(f, s)), (l = uC(f, l)));
        }
        ((n[0] = s + kt.touchThreshold), (n[1] = l - kt.touchThreshold), (kt.negativeSize = n[1] < n[0]));
      }),
      e
    );
  })(),
  Jy = 0,
  fC = 1,
  hC = 2,
  cC = 1,
  fs = 0,
  vC = [],
  dC = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return (
        (r.notClear = !0),
        (r.incremental = fC),
        (r._displayables = []),
        (r._temporaryDisplayables = []),
        (r._cursor = 0),
        r
      );
    }
    return (
      (t.prototype.traverse = function (r, n) {
        r.call(n, this);
      }),
      (t.prototype.useStyle = function () {
        this.style = {};
      }),
      (t.prototype._useHoverStyle = function () {
        this.__hoverStyle = null;
      }),
      (t.prototype.getCursor = function () {
        return this._cursor;
      }),
      (t.prototype.innerAfterBrush = function () {
        this._cursor = this._displayables.length;
      }),
      (t.prototype.clearDisplaybles = function () {
        ((this._displayables = []),
          (this._temporaryDisplayables = []),
          (this._cursor = 0),
          this.markRedraw(),
          (this.notClear = !1));
      }),
      (t.prototype.clearTemporalDisplayables = function () {
        this._temporaryDisplayables = [];
      }),
      (t.prototype.addDisplayable = function (r, n) {
        (n ? this._temporaryDisplayables.push(r) : this._displayables.push(r), this.markRedraw());
      }),
      (t.prototype.addDisplayables = function (r, n) {
        n = n || !1;
        for (var i = 0; i < r.length; i++) this.addDisplayable(r[i], n);
      }),
      (t.prototype.getDisplayables = function () {
        return this._displayables;
      }),
      (t.prototype.getTemporalDisplayables = function () {
        return this._temporaryDisplayables;
      }),
      (t.prototype.eachPendingDisplayable = function (r) {
        for (var n = this._cursor; n < this._displayables.length; n++) r && r(this._displayables[n]);
        for (var n = 0; n < this._temporaryDisplayables.length; n++) r && r(this._temporaryDisplayables[n]);
      }),
      (t.prototype.update = function () {
        this.updateTransform();
        for (var r = this._cursor; r < this._displayables.length; r++) {
          var n = this._displayables[r];
          ((n.parent = this), n.update(), (n.parent = null));
        }
        for (var r = 0; r < this._temporaryDisplayables.length; r++) {
          var n = this._temporaryDisplayables[r];
          ((n.parent = this), n.update(), (n.parent = null));
        }
      }),
      (t.prototype.getBoundingRect = function () {
        if (!this._rect) {
          for (var r = new J(1 / 0, 1 / 0, -1 / 0, -1 / 0), n = 0; n < this._displayables.length; n++) {
            var i = this._displayables[n],
              a = i.getBoundingRect().clone();
            (i.needLocalTransform() && a.applyTransform(i.getLocalTransform(vC)), r.union(a));
          }
          this._rect = r;
        }
        return this._rect;
      }),
      (t.prototype.contain = function (r, n) {
        var i = this.transformCoordToLocal(r, n),
          a = this.getBoundingRect();
        if (a.contain(i[0], i[1]))
          for (var o = 0; o < this._displayables.length; o++) {
            var s = this._displayables[o];
            if (s.contain(r, n)) return !0;
          }
        return !1;
      }),
      t
    );
  })(Qa),
  pC = St();
function gC(e, t, r, n, i) {
  var a;
  if (t && t.ecModel) {
    var o = t.ecModel.getUpdatePayload();
    a = o && o.animation;
  }
  var s = t && t.isAnimationEnabled(),
    l = e === "update";
  if (s) {
    var u = void 0,
      f = void 0,
      h = void 0;
    (n
      ? ((u = q(n.duration, 200)), (f = q(n.easing, "cubicOut")), (h = 0))
      : ((u = t.getShallow(l ? "animationDurationUpdate" : "animationDuration")),
        (f = t.getShallow(l ? "animationEasingUpdate" : "animationEasing")),
        (h = t.getShallow(l ? "animationDelayUpdate" : "animationDelay"))),
      a &&
        (a.duration != null && (u = a.duration), a.easing != null && (f = a.easing), a.delay != null && (h = a.delay)),
      et(h) && (h = h(r, i)),
      et(u) && (u = u(r)));
    var c = { duration: u || 0, delay: h, easing: f };
    return c;
  } else return null;
}
function bc(e, t, r, n, i, a, o) {
  var s = !1,
    l;
  et(i)
    ? ((o = a), (a = i), (i = null))
    : Z(i) && ((a = i.cb), (o = i.during), (s = i.isFrom), (l = i.removeOpt), (i = i.dataIndex));
  var u = e === "leave";
  u || t.stopAnimation("leave");
  var f = gC(e, n, i, u ? l || {} : null, n && n.getAnimationDelayParams ? n.getAnimationDelayParams(t, i) : null);
  if (f && f.duration > 0) {
    var h = f.duration,
      c = f.delay,
      v = f.easing,
      d = { duration: h, delay: c || 0, easing: v, done: a, force: !!a || !!o, setToFinal: !u, scope: e, during: o };
    s ? t.animateFrom(r, d) : t.animateTo(r, d);
  } else (t.stopAnimation(), !s && t.attr(r), o && o(1), a && a());
}
function he(e, t, r, n, i, a) {
  bc("update", e, t, r, n, i, a);
}
function gr(e, t, r, n, i, a) {
  bc("enter", e, t, r, n, i, a);
}
function ya(e) {
  if (!e.__zr) return !0;
  for (var t = 0; t < e.animators.length; t++) {
    var r = e.animators[t];
    if (r.scope === "leave") return !0;
  }
  return !1;
}
function Vs(e, t, r, n, i, a) {
  ya(e) || bc("leave", e, t, r, n, i, a);
}
function $d(e, t, r, n) {
  (e.removeTextContent(), e.removeTextGuideLine(), Vs(e, { style: { opacity: 0 } }, t, r, n));
}
function hs(e, t, r) {
  function n() {
    e.parent && e.parent.remove(e);
  }
  e.isGroup
    ? e.traverse(function (i) {
        i.isGroup || $d(i, t, r, n);
      })
    : $d(e, t, r, n);
}
function t0(e) {
  pC(e).oldStyle = e.style;
}
var ah = {},
  Sn = ["x", "y"],
  Ea = ["width", "height"],
  e0 = 0,
  r0 = 1,
  wc = 2;
function mC(e) {
  return gt.extend(e);
}
var yC = Wx;
function _C(e, t) {
  return yC(e, t);
}
function Ne(e, t) {
  ah[e] = t;
}
function SC(e) {
  if (ah.hasOwnProperty(e)) return ah[e];
}
function Tc(e, t, r, n) {
  var i = Ux(e, t);
  return (r && (n === "center" && (r = i0(r, i.getBoundingRect())), a0(i, r)), i);
}
function n0(e, t, r) {
  var n = new Ur({
    style: { image: e, x: t.x, y: t.y, width: t.width, height: t.height },
    onload: function (i) {
      if (r === "center") {
        var a = { width: i.width, height: i.height };
        n.setStyle(i0(t, a));
      }
    },
  });
  return n;
}
function i0(e, t) {
  var r = t.width / t.height,
    n = e.height * r,
    i;
  n <= e.width ? (i = e.height) : ((n = e.width), (i = n / r));
  var a = e.x + e.width / 2,
    o = e.y + e.height / 2;
  return { x: a - n / 2, y: o - i / 2, width: n, height: i };
}
var bC = Yx;
function a0(e, t) {
  if (e.applyTransform) {
    var r = e.getBoundingRect(),
      n = r.calculateTransform(t);
    e.applyTransform(n);
  }
}
function Ra(e, t) {
  return (Iy(e, e, { lineWidth: t }), e);
}
function wC(e, t) {
  return (Ly(e, e, t), e);
}
var TC = Tn;
function xC(e, t) {
  for (var r = Wa([]); e && e !== t; ) (va(r, e.getLocalTransform(), r), (e = e.parent));
  return r;
}
function xc(e, t, r) {
  return (t && !ae(t) && (t = $a.getLocalTransform(t)), r && (t = Ya([], t)), Ae([], e, t));
}
function CC(e, t, r) {
  var n = t[4] === 0 || t[5] === 0 || t[0] === 0 ? 1 : Pt((2 * t[4]) / t[0]),
    i = t[4] === 0 || t[5] === 0 || t[2] === 0 ? 1 : Pt((2 * t[4]) / t[2]),
    a = [e === "left" ? -n : e === "right" ? n : 0, e === "top" ? -i : e === "bottom" ? i : 0];
  return ((a = xc(a, t, r)), Pt(a[0]) > Pt(a[1]) ? (a[0] > 0 ? "right" : "left") : a[1] > 0 ? "bottom" : "top");
}
function Zd(e) {
  return !e.isGroup;
}
function DC(e) {
  return e.shape != null;
}
function o0(e, t, r) {
  if (!e || !t) return;
  function n(o) {
    var s = {};
    return (
      o.traverse(function (l) {
        Zd(l) && l.anid && (s[l.anid] = l);
      }),
      s
    );
  }
  function i(o) {
    var s = { x: o.x, y: o.y, rotation: o.rotation };
    return (DC(o) && (s.shape = ot(o.shape)), s);
  }
  var a = n(e);
  t.traverse(function (o) {
    if (Zd(o) && o.anid) {
      var s = a[o.anid];
      if (s) {
        var l = i(o);
        (o.attr(i(s)), he(o, l, r, ut(o).dataIndex));
      }
    }
  });
}
function AC(e, t) {
  return j(e, function (r) {
    var n = r[0];
    ((n = ht(n, t.x)), (n = Ut(n, t.x + t.width)));
    var i = r[1];
    return ((i = ht(i, t.y)), (i = Ut(i, t.y + t.height)), [n, i]);
  });
}
function MC(e, t) {
  var r = ht(e.x, t.x),
    n = Ut(e.x + e.width, t.x + t.width),
    i = ht(e.y, t.y),
    a = Ut(e.y + e.height, t.y + t.height);
  if (n >= r && a >= i) return { x: r, y: i, width: n - r, height: a - i };
}
function Cc(e, t, r) {
  var n = N({ rectHover: !0 }, t),
    i = (n.style = { strokeNoScale: !0 });
  if (((r = r || { x: -1, y: -1, width: 2, height: 2 }), e))
    return e.indexOf("image://") === 0
      ? ((i.image = e.slice(8)), mt(i, r), new Ur(n))
      : Tc(e.replace("path://", ""), n, r, "center");
}
function IC(e, t, r, n, i) {
  for (var a = 0, o = i[i.length - 1]; a < i.length; a++) {
    var s = i[a];
    if (s0(e, t, r, n, s[0], s[1], o[0], o[1])) return !0;
    o = s;
  }
}
function s0(e, t, r, n, i, a, o, s) {
  var l = r - e,
    u = n - t,
    f = o - i,
    h = s - a,
    c = ku(f, h, l, u);
  if (LC(c)) return !1;
  var v = e - i,
    d = t - a,
    p = ku(v, d, l, u) / c;
  if (p < 0 || p > 1) return !1;
  var m = ku(v, d, f, h) / c;
  return !(m < 0 || m > 1);
}
function ku(e, t, r, n) {
  return e * n - r * t;
}
function LC(e) {
  return e <= 1e-6 && e >= -1e-6;
}
function Gs(e, t, r, n, i) {
  return (
    t == null ||
      (wt(t) ? (bt[0] = bt[1] = bt[2] = bt[3] = t) : ((bt[0] = t[0]), (bt[1] = t[1]), (bt[2] = t[2]), (bt[3] = t[3])),
      n && ((bt[0] = ht(0, bt[0])), (bt[1] = ht(0, bt[1])), (bt[2] = ht(0, bt[2])), (bt[3] = ht(0, bt[3]))),
      r && ((bt[0] = -bt[0]), (bt[1] = -bt[1]), (bt[2] = -bt[2]), (bt[3] = -bt[3])),
      qd(e, bt, "x", "width", 3, 1, (i && i[0]) || 0),
      qd(e, bt, "y", "height", 0, 2, (i && i[1]) || 0)),
    e
  );
}
var bt = [0, 0, 0, 0];
function qd(e, t, r, n, i, a, o) {
  var s = t[a] + t[i],
    l = e[n];
  ((e[n] += s),
    (o = ht(0, Ut(o, l))),
    e[n] < o
      ? ((e[n] = o), (e[r] += t[i] >= 0 ? -t[i] : t[a] >= 0 ? l + t[a] : Pt(s) > 1e-8 ? ((l - o) * t[i]) / s : 0))
      : (e[r] -= t[i]));
}
function wl(e) {
  var t = e.itemTooltipOption,
    r = e.componentModel,
    n = e.itemName,
    i = Y(t) ? { formatter: t } : t,
    a = r.mainType,
    o = r.componentIndex,
    s = { componentType: a, name: n, $vars: ["name"] };
  s[a + "Index"] = o;
  var l = e.formatterParamsExtra;
  l &&
    I(xt(l), function (f) {
      Qt(s, f) || ((s[f] = l[f]), s.$vars.push(f));
    });
  var u = ut(e.el);
  ((u.componentMainType = a),
    (u.componentIndex = o),
    (u.tooltipConfig = { name: n, option: mt({ content: n, encodeHTMLContent: !0, formatterParams: s }, i) }));
}
function oh(e, t) {
  var r;
  (e.isGroup && (r = t(e)), r || e.traverse(t));
}
function Tl(e, t) {
  if (e)
    if (U(e)) for (var r = 0; r < e.length; r++) oh(e[r], t);
    else oh(e, t);
}
function Dc(e) {
  return !e || (Pt(e[1]) < Co && Pt(e[2]) < Co) || (Pt(e[0]) < Co && Pt(e[3]) < Co);
}
var Co = 1e-5;
function Oa(e, t) {
  return e ? J.copy(e, t) : t.clone();
}
function Ac(e, t) {
  return t ? jh(e || Ze(), t) : void 0;
}
function l0(e) {
  return { z: e.get("z") || 0, zlevel: e.get("zlevel") || 0 };
}
function PC(e) {
  var t = -1 / 0,
    r = 1 / 0;
  oh(e, function (a) {
    (n(a), n(a.getTextContent()), n(a.getTextGuideLine()));
  });
  function n(a) {
    if (!(!a || a.isGroup)) {
      var o = a.currentStates;
      if (o.length) for (var s = 0; s < o.length; s++) i(a.states[o[s]]);
      i(a);
    }
  }
  function i(a) {
    if (a) {
      var o = a.z2;
      (o > t && (t = o), o < r && (r = o));
    }
  }
  return (r > t && (r = t = 0), { min: r, max: t });
}
function u0(e, t, r) {
  f0(e, t, r, -1 / 0);
}
function f0(e, t, r, n) {
  if (e.ignoreModelZ) return n;
  var i = e.getTextContent(),
    a = e.getTextGuideLine(),
    o = e.isGroup;
  if (o) for (var s = e.childrenRef(), l = 0; l < s.length; l++) n = ht(f0(s[l], t, r, n), n);
  else ((e.z = t), (e.zlevel = r), (n = ht(e.z2 || 0, n)));
  if ((i && ((i.z = t), (i.zlevel = r), isFinite(n) && (i.z2 = n + 2)), a)) {
    var u = e.textGuideLineConfig;
    ((a.z = t), (a.zlevel = r), isFinite(n) && (a.z2 = n + (u && u.showAbove ? 1 : -1)));
  }
  return n;
}
function EC(e) {
  return ((e.animation = { duration: 0 }), e);
}
function RC(e, t) {
  return (t ? jh(ua.transform, t) : Wa(ua.transform), ua.decomposeTransform(), Ps(e, ua), e);
}
var ua = new $a();
ua.transform = Ze();
function OC(e) {
  var t = e.getZr().painter;
  return t.getType() === "canvas" ? t : null;
}
Ne("circle", Sl);
Ne("ellipse", gc);
Ne("sector", Ri);
Ne("ring", mc);
Ne("polygon", yc);
Ne("polyline", _c);
Ne("rect", Mt);
Ne("line", Fr);
Ne("bezierCurve", Sc);
Ne("arc", bl);
const kC = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      Arc: bl,
      BezierCurve: Sc,
      BoundingRect: J,
      Circle: Sl,
      CompoundPath: sC,
      Ellipse: gc,
      Group: Bt,
      HOVER_LAYER_FOR_INCREMENTAL: wc,
      HOVER_LAYER_FROM_THRESHOLD: r0,
      HOVER_LAYER_NO: e0,
      Image: Ur,
      IncrementalDisplayable: dC,
      Line: Fr,
      LinearGradient: Qy,
      OrientedBoundingRect: jy,
      Path: gt,
      Point: _t,
      Polygon: yc,
      Polyline: _c,
      RadialGradient: lC,
      Rect: Mt,
      Ring: mc,
      Sector: Ri,
      Text: Wt,
      WH: Ea,
      XY: Sn,
      applyTransform: xc,
      calcZ2Range: PC,
      clipPointsByRect: AC,
      clipRectByRect: MC,
      createIcon: Cc,
      decomposeTransform: RC,
      ensureCopyRect: Oa,
      ensureCopyTransform: Ac,
      expandOrShrinkRect: Gs,
      extendPath: _C,
      extendShape: mC,
      getCurrentCanvasPainter: OC,
      getShapeClass: SC,
      getTransform: xC,
      groupTransition: o0,
      initProps: gr,
      isBoundingRectAxisAligned: Dc,
      isElementRemoved: ya,
      lineLineIntersect: s0,
      linePolygonIntersect: IC,
      makeImage: n0,
      makePath: Tc,
      mergePath: bC,
      payloadDisableAnimation: EC,
      registerShape: Ne,
      removeElement: Vs,
      removeElementWithFadeOut: hs,
      resizePath: a0,
      retrieveZInfo: l0,
      setTooltipConfig: wl,
      subPixelOptimize: TC,
      subPixelOptimizeLine: Ra,
      subPixelOptimizeRect: wC,
      transformDirection: CC,
      traverseElements: Tl,
      traverseUpdateZ: u0,
      updateProps: he,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
var xl = {};
function BC(e, t) {
  for (var r = 0; r < tr.length; r++) {
    var n = tr[r],
      i = t[n],
      a = e.ensureState(n);
    ((a.style = a.style || {}), (a.style.text = i));
  }
  var o = e.currentStates.slice();
  (e.clearStates(!0), e.setStyle({ text: t.normal }), e.useStates(o, !0));
}
function Kd(e, t, r) {
  var n = e.labelFetcher,
    i = e.labelDataIndex,
    a = e.labelDimIndex,
    o = t.normal,
    s;
  (n &&
    (s = n.getFormattedLabel(
      i,
      "normal",
      null,
      a,
      o && o.get("formatter"),
      r != null ? { interpolatedValue: r } : null,
    )),
    s == null && (s = et(e.defaultText) ? e.defaultText(i, e, r) : e.defaultText));
  for (var l = { normal: s }, u = 0; u < tr.length; u++) {
    var f = tr[u],
      h = t[f];
    l[f] = q(n ? n.getFormattedLabel(i, f, null, a, h && h.get("formatter")) : null, s);
  }
  return l;
}
function Cl(e, t, r, n) {
  r = r || xl;
  for (var i = e instanceof Wt, a = !1, o = 0; o < Rd.length; o++) {
    var s = t[Rd[o]];
    if (s && s.getShallow("show")) {
      a = !0;
      break;
    }
  }
  var l = i ? e : e.getTextContent();
  if (a) {
    i || (l || ((l = new Wt()), e.setTextContent(l)), e.stateProxy && (l.stateProxy = e.stateProxy));
    var u = Kd(r, t),
      f = t.normal,
      h = !!f.getShallow("show"),
      c = zr(f, n && n.normal, r, !1, !i);
    ((c.text = u.normal), i || e.setTextConfig(Qd(f, r, !1)));
    for (var o = 0; o < tr.length; o++) {
      var v = tr[o],
        s = t[v];
      if (s) {
        var d = l.ensureState(v),
          p = !!q(s.getShallow("show"), h);
        if ((p !== h && (d.ignore = !p), (d.style = zr(s, n && n[v], r, !0, !i)), (d.style.text = u[v]), !i)) {
          var m = e.ensureState(v);
          m.textConfig = Qd(s, r, !0);
        }
      }
    }
    ((l.silent = !!f.getShallow("silent")),
      l.style.x != null && (c.x = l.style.x),
      l.style.y != null && (c.y = l.style.y),
      (l.ignore = !h),
      l.useStyle(c),
      l.dirty(),
      r.enableTextSetter &&
        (Al(l).setLabelText = function (g) {
          var y = Kd(r, t, g);
          BC(l, y);
        }));
  } else l && (l.ignore = !0);
  e.dirty();
}
function Dl(e, t) {
  t = t || "label";
  for (var r = { normal: e.getModel(t) }, n = 0; n < tr.length; n++) {
    var i = tr[n];
    r[i] = e.getModel([i, t]);
  }
  return r;
}
function zr(e, t, r, n, i) {
  var a = {};
  return (NC(a, e, r, n, i), t && N(a, t), a);
}
function Qd(e, t, r) {
  t = t || {};
  var n = {},
    i,
    a = e.getShallow("rotate"),
    o = q(e.getShallow("distance"), r ? null : 5),
    s = e.getShallow("offset");
  return (
    (i = e.getShallow("position") || (r ? null : "inside")),
    i === "outside" && (i = t.defaultOutsidePosition || "top"),
    i != null && (n.position = i),
    s != null && (n.offset = s),
    a != null && ((a *= Math.PI / 180), (n.rotation = a)),
    o != null && (n.distance = o),
    (n.outsideFill = e.get("color") === "inherit" ? t.inheritColor || null : "auto"),
    t.autoOverflowArea != null && (n.autoOverflowArea = t.autoOverflowArea),
    t.layoutRect != null && (n.layoutRect = t.layoutRect),
    n
  );
}
function NC(e, t, r, n, i) {
  r = r || xl;
  var a = t.ecModel,
    o = a && a.option.textStyle,
    s = FC(t),
    l;
  if (s) {
    l = {};
    var u = "richInheritPlainLabel",
      f = q(t.get(u), a ? a.get(u) : void 0);
    for (var h in s)
      if (s.hasOwnProperty(h)) {
        var c = t.getModel(["rich", h]);
        ep((l[h] = {}), c, o, t, f, r, n, i, !1, !0);
      }
  }
  l && (e.rich = l);
  var v = t.get("overflow");
  v && (e.overflow = v);
  var d = t.get("lineOverflow");
  d && (e.lineOverflow = d);
  var p = e,
    m = t.get("minMargin");
  if (m != null) ((m = wt(m) ? m / 2 : 0), (p.margin = [m, m, m, m]), (p.__marginType = li.minMargin));
  else {
    var g = t.get("textMargin");
    g != null && ((p.margin = Kh(g)), (p.__marginType = li.textMargin));
  }
  ep(e, t, o, null, null, r, n, i, !0, !1);
}
function FC(e) {
  for (var t; e && e !== e.ecModel; ) {
    var r = (e.option || xl).rich;
    if (r) {
      t = t || {};
      for (var n = xt(r), i = 0; i < n.length; i++) {
        var a = n[i];
        t[a] = 1;
      }
    }
    e = e.parentModel;
  }
  return t;
}
var jd = [
    "fontStyle",
    "fontWeight",
    "fontSize",
    "fontFamily",
    "textShadowColor",
    "textShadowBlur",
    "textShadowOffsetX",
    "textShadowOffsetY",
  ],
  Jd = ["align", "lineHeight", "width", "height", "tag", "verticalAlign", "ellipsis"],
  tp = [
    "padding",
    "borderWidth",
    "borderRadius",
    "borderDashOffset",
    "backgroundColor",
    "borderColor",
    "shadowColor",
    "shadowBlur",
    "shadowOffsetX",
    "shadowOffsetY",
  ];
function ep(e, t, r, n, i, a, o, s, l, u) {
  r = (!o && r) || xl;
  var f = a && a.inheritColor,
    h = t.getShallow("color"),
    c = t.getShallow("textBorderColor"),
    v = q(t.getShallow("opacity"), r.opacity);
  ((h === "inherit" || h === "auto") && (f ? (h = f) : (h = null)),
    (c === "inherit" || c === "auto") && (f ? (c = f) : (c = null)),
    s || ((h = h || r.color), (c = c || r.textBorderColor)),
    h != null && (e.fill = h),
    c != null && (e.stroke = c));
  var d = q(t.getShallow("textBorderWidth"), r.textBorderWidth);
  d != null && (e.lineWidth = d);
  var p = q(t.getShallow("textBorderType"), r.textBorderType);
  p != null && (e.lineDash = p);
  var m = q(t.getShallow("textBorderDashOffset"), r.textBorderDashOffset);
  (m != null && (e.lineDashOffset = m),
    !o && v == null && !u && (v = a && a.defaultOpacity),
    v != null && (e.opacity = v),
    !o && !s && e.fill == null && a.inheritColor && (e.fill = a.inheritColor));
  for (var g = 0; g < jd.length; g++) {
    var y = jd[g],
      _ = i !== !1 && n ? ui(t.getShallow(y), n.getShallow(y), r[y]) : q(t.getShallow(y), r[y]);
    _ != null && (e[y] = _);
  }
  for (var g = 0; g < Jd.length; g++) {
    var y = Jd[g],
      _ = t.getShallow(y);
    _ != null && (e[y] = _);
  }
  if (e.verticalAlign == null) {
    var S = t.getShallow("baseline");
    S != null && (e.verticalAlign = S);
  }
  if (!l || !a.disableBox) {
    for (var g = 0; g < tp.length; g++) {
      var y = tp[g],
        _ = t.getShallow(y);
      _ != null && (e[y] = _);
    }
    var b = t.getShallow("borderType");
    (b != null && (e.borderDash = b),
      (e.backgroundColor === "auto" || e.backgroundColor === "inherit") && f && (e.backgroundColor = f),
      (e.borderColor === "auto" || e.borderColor === "inherit") && f && (e.borderColor = f));
  }
}
function zC(e, t) {
  var r = t && t.getModel("textStyle");
  return Xe(
    [
      e.fontStyle || (r && r.getShallow("fontStyle")) || "",
      e.fontWeight || (r && r.getShallow("fontWeight")) || "",
      (e.fontSize || (r && r.getShallow("fontSize")) || 12) + "px",
      e.fontFamily || (r && r.getShallow("fontFamily")) || "sans-serif",
    ].join(" "),
  );
}
var Al = St();
function HC(e, t, r, n) {
  if (e) {
    var i = Al(e);
    ((i.prevValue = i.value), (i.value = r));
    var a = t.normal;
    ((i.valueAnimation = a.get("valueAnimation")),
      i.valueAnimation && ((i.precision = a.get("precision")), (i.defaultInterpolatedText = n), (i.statesModels = t)));
  }
}
var li = { minMargin: 1, textMargin: 2 },
  VC = ["textStyle", "color"],
  Bu = [
    "fontStyle",
    "fontWeight",
    "fontSize",
    "fontFamily",
    "padding",
    "lineHeight",
    "rich",
    "width",
    "height",
    "overflow",
  ],
  Nu = new Wt(),
  GC = (function () {
    function e() {}
    return (
      (e.prototype.getTextColor = function (t) {
        var r = this.ecModel;
        return this.getShallow("color") || (!t && r ? r.get(VC) : null);
      }),
      (e.prototype.getFont = function () {
        return zC(
          {
            fontStyle: this.getShallow("fontStyle"),
            fontWeight: this.getShallow("fontWeight"),
            fontSize: this.getShallow("fontSize"),
            fontFamily: this.getShallow("fontFamily"),
          },
          this.ecModel,
        );
      }),
      (e.prototype.getTextRect = function (t) {
        for (
          var r = { text: t, verticalAlign: this.getShallow("verticalAlign") || this.getShallow("baseline") }, n = 0;
          n < Bu.length;
          n++
        )
          r[Bu[n]] = this.getShallow(Bu[n]);
        return (Nu.useStyle(r), Nu.update(), Nu.getBoundingRect());
      }),
      e
    );
  })(),
  h0 = [
    ["lineWidth", "width"],
    ["stroke", "color"],
    ["opacity"],
    ["shadowBlur"],
    ["shadowOffsetX"],
    ["shadowOffsetY"],
    ["shadowColor"],
    ["lineDash", "type"],
    ["lineDashOffset", "dashOffset"],
    ["lineCap", "cap"],
    ["lineJoin", "join"],
    ["miterLimit"],
  ],
  UC = Pa(h0),
  WC = (function () {
    function e() {}
    return (
      (e.prototype.getLineStyle = function (t) {
        return UC(this, t);
      }),
      e
    );
  })(),
  c0 = [
    ["fill", "color"],
    ["stroke", "borderColor"],
    ["lineWidth", "borderWidth"],
    ["opacity"],
    ["shadowBlur"],
    ["shadowOffsetX"],
    ["shadowOffsetY"],
    ["shadowColor"],
    ["lineDash", "borderType"],
    ["lineDashOffset", "borderDashOffset"],
    ["lineCap", "borderCap"],
    ["lineJoin", "borderJoin"],
    ["miterLimit", "borderMiterLimit"],
  ],
  YC = Pa(c0),
  XC = (function () {
    function e() {}
    return (
      (e.prototype.getItemStyle = function (t, r) {
        return YC(this, t, r);
      }),
      e
    );
  })(),
  Ct = (function () {
    function e(t, r, n) {
      ((this.parentModel = r), (this.ecModel = n), (this.option = t));
    }
    return (
      (e.prototype.init = function (t, r, n) {}),
      (e.prototype.mergeOption = function (t, r) {
        pt(this.option, t, !0);
      }),
      (e.prototype.get = function (t, r) {
        return t == null ? this.option : this._doGet(this.parsePath(t), !r && this.parentModel);
      }),
      (e.prototype.getShallow = function (t, r) {
        var n = this.option,
          i = n == null ? n : n[t];
        if (i == null && !r) {
          var a = this.parentModel;
          a && (i = a.getShallow(t));
        }
        return i;
      }),
      (e.prototype.getModel = function (t, r) {
        var n = t != null,
          i = n ? this.parsePath(t) : null,
          a = n ? this._doGet(i) : this.option;
        return (
          (r = r || (this.parentModel && this.parentModel.getModel(this.resolveParentPath(i)))),
          new e(a, r, this.ecModel)
        );
      }),
      (e.prototype.isEmpty = function () {
        return this.option == null;
      }),
      (e.prototype.restoreData = function () {}),
      (e.prototype.clone = function () {
        var t = this.constructor;
        return new t(ot(this.option));
      }),
      (e.prototype.parsePath = function (t) {
        return typeof t == "string" ? t.split(".") : t;
      }),
      (e.prototype.resolveParentPath = function (t) {
        return t;
      }),
      (e.prototype.isAnimationEnabled = function () {
        if (!nt.node && this.option) {
          if (this.option.animation != null) return !!this.option.animation;
          if (this.parentModel) return this.parentModel.isAnimationEnabled();
        }
      }),
      (e.prototype._doGet = function (t, r) {
        var n = this.option;
        if (!t) return n;
        for (var i = 0; i < t.length && !(t[i] && ((n = n && typeof n == "object" ? n[t[i]] : null), n == null)); i++);
        return (n == null && r && (n = r._doGet(this.resolveParentPath(t), r.parentModel)), n);
      }),
      e
    );
  })();
uc(Ct);
_T(Ct);
rr(Ct, WC);
rr(Ct, XC);
rr(Ct, xT);
rr(Ct, GC);
var $C = Math.round(Math.random() * 10);
function Ml(e) {
  return [e || "", $C++].join("_");
}
function ZC(e) {
  var t = {};
  ((e.registerSubTypeDefaulter = function (r, n) {
    var i = $e(r);
    t[i.main] = n;
  }),
    (e.determineSubType = function (r, n) {
      var i = n.type;
      if (!i) {
        var a = $e(r).main;
        e.hasSubTypes(r) && t[a] && (i = t[a](n));
      }
      return i;
    }));
}
function qC(e, t) {
  e.topologicalTravel = function (a, o, s, l) {
    if (!a.length) return;
    var u = r(o),
      f = u.graph,
      h = u.noEntryList,
      c = {};
    for (
      I(a, function (y) {
        c[y] = !0;
      });
      h.length;
    ) {
      var v = h.pop(),
        d = f[v],
        p = !!c[v];
      (p && (s.call(l, v, d.originalDeps.slice()), delete c[v]), I(d.successor, p ? g : m));
    }
    I(c, function () {
      var y = "";
      throw new Error(y);
    });
    function m(y) {
      (f[y].entryCount--, f[y].entryCount === 0 && h.push(y));
    }
    function g(y) {
      ((c[y] = !0), m(y));
    }
  };
  function r(a) {
    var o = {},
      s = [];
    return (
      I(a, function (l) {
        var u = n(o, l),
          f = (u.originalDeps = t(l)),
          h = i(f, a);
        ((u.entryCount = h.length),
          u.entryCount === 0 && s.push(l),
          I(h, function (c) {
            vt(u.predecessor, c) < 0 && u.predecessor.push(c);
            var v = n(o, c);
            vt(v.successor, c) < 0 && v.successor.push(l);
          }));
      }),
      { graph: o, noEntryList: s }
    );
  }
  function n(a, o) {
    return (a[o] || (a[o] = { predecessor: [], successor: [] }), a[o]);
  }
  function i(a, o) {
    var s = [];
    return (
      I(a, function (l) {
        vt(o, l) >= 0 && s.push(l);
      }),
      s
    );
  }
}
function v0(e, t) {
  return pt(pt({}, e, !0), t, !0);
}
const KC = {
    time: {
      month: [
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
      monthAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayOfWeekAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    legend: { selector: { all: "All", inverse: "Inv" } },
    toolbox: {
      brush: {
        title: {
          rect: "Box Select",
          polygon: "Lasso Select",
          lineX: "Horizontally Select",
          lineY: "Vertically Select",
          keep: "Keep Selections",
          clear: "Clear Selections",
        },
      },
      dataView: { title: "Data View", lang: ["Data View", "Close", "Refresh"] },
      dataZoom: { title: { zoom: "Zoom", back: "Zoom Reset" } },
      magicType: { title: { line: "Switch to Line Chart", bar: "Switch to Bar Chart", stack: "Stack", tiled: "Tile" } },
      restore: { title: "Restore" },
      saveAsImage: { title: "Save as Image", lang: ["Right Click to Save Image"] },
    },
    series: {
      typeNames: {
        pie: "Pie chart",
        bar: "Bar chart",
        line: "Line chart",
        scatter: "Scatter plot",
        effectScatter: "Ripple scatter plot",
        radar: "Radar chart",
        tree: "Tree",
        treemap: "Treemap",
        boxplot: "Boxplot",
        candlestick: "Candlestick",
        k: "K line chart",
        heatmap: "Heat map",
        map: "Map",
        parallel: "Parallel coordinate map",
        lines: "Line graph",
        graph: "Relationship graph",
        sankey: "Sankey diagram",
        funnel: "Funnel chart",
        gauge: "Gauge",
        pictorialBar: "Pictorial bar",
        themeRiver: "Theme River Map",
        sunburst: "Sunburst",
        custom: "Custom chart",
        chart: "Chart",
      },
    },
    aria: {
      general: { withTitle: 'This is a chart about "{title}"', withoutTitle: "This is a chart" },
      series: {
        single: {
          prefix: "",
          withName: " with type {seriesType} named {seriesName}.",
          withoutName: " with type {seriesType}.",
        },
        multiple: {
          prefix: ". It consists of {seriesCount} series count.",
          withName: " The {seriesId} series is a {seriesType} representing {seriesName}.",
          withoutName: " The {seriesId} series is a {seriesType}.",
          separator: { middle: "", end: "" },
        },
      },
      data: {
        allData: "The data is as follows: ",
        partialData: "The first {displayCnt} items are: ",
        withName: "the data for {name} is {value}",
        withoutName: "{value}",
        separator: { middle: ", ", end: ". " },
      },
    },
  },
  QC = {
    time: {
      month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      monthAbbr: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      dayOfWeek: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      dayOfWeekAbbr: ["日", "一", "二", "三", "四", "五", "六"],
    },
    legend: { selector: { all: "全选", inverse: "反选" } },
    toolbox: {
      brush: {
        title: {
          rect: "矩形选择",
          polygon: "圈选",
          lineX: "横向选择",
          lineY: "纵向选择",
          keep: "保持选择",
          clear: "清除选择",
        },
      },
      dataView: { title: "数据视图", lang: ["数据视图", "关闭", "刷新"] },
      dataZoom: { title: { zoom: "区域缩放", back: "区域缩放还原" } },
      magicType: { title: { line: "切换为折线图", bar: "切换为柱状图", stack: "切换为堆叠", tiled: "切换为平铺" } },
      restore: { title: "还原" },
      saveAsImage: { title: "保存为图片", lang: ["右键另存为图片"] },
    },
    series: {
      typeNames: {
        pie: "饼图",
        bar: "柱状图",
        line: "折线图",
        scatter: "散点图",
        effectScatter: "涟漪散点图",
        radar: "雷达图",
        tree: "树图",
        treemap: "矩形树图",
        boxplot: "箱型图",
        candlestick: "K线图",
        k: "K线图",
        heatmap: "热力图",
        map: "地图",
        parallel: "平行坐标图",
        lines: "线图",
        graph: "关系图",
        sankey: "桑基图",
        funnel: "漏斗图",
        gauge: "仪表盘图",
        pictorialBar: "象形柱图",
        themeRiver: "主题河流图",
        sunburst: "旭日图",
        custom: "自定义图表",
        chart: "图表",
      },
    },
    aria: {
      general: { withTitle: "这是一个关于“{title}”的图表。", withoutTitle: "这是一个图表，" },
      series: {
        single: {
          prefix: "",
          withName: "图表类型是{seriesType}，表示{seriesName}。",
          withoutName: "图表类型是{seriesType}。",
        },
        multiple: {
          prefix: "它由{seriesCount}个图表系列组成。",
          withName: "第{seriesId}个系列是一个表示{seriesName}的{seriesType}，",
          withoutName: "第{seriesId}个系列是一个{seriesType}，",
          separator: { middle: "；", end: "。" },
        },
      },
      data: {
        allData: "其数据是——",
        partialData: "其中，前{displayCnt}项是——",
        withName: "{name}的数据是{value}",
        withoutName: "{value}",
        separator: { middle: "，", end: "" },
      },
    },
  };
var Us = "ZH",
  Mc = "EN",
  ci = Mc,
  cs = {},
  Ic = {},
  d0 = nt.domSupported
    ? (function () {
        var e = (document.documentElement.lang || navigator.language || navigator.browserLanguage || ci).toUpperCase();
        return e.indexOf(Us) > -1 ? Us : ci;
      })()
    : ci;
function p0(e, t) {
  ((e = e.toUpperCase()), (Ic[e] = new Ct(t)), (cs[e] = t));
}
function jC(e) {
  if (Y(e)) {
    var t = cs[e.toUpperCase()] || {};
    return e === Us || e === Mc ? ot(t) : pt(ot(t), ot(cs[ci]), !1);
  } else return pt(ot(e), ot(cs[ci]), !1);
}
function JC(e) {
  return Ic[e];
}
function tD() {
  return Ic[ci];
}
p0(Mc, KC);
p0(Us, QC);
var eD = null;
function Il() {
  return eD;
}
function g0(e, t) {
  t.breakOption;
  var r = t.breakParsed;
  return r;
}
function Lc(e) {
  var t = e.brk;
  return t ? t.breaks : [];
}
function Ws(e) {
  var t = e.brk;
  return t ? t.hasBreaks() : !1;
}
var Pc = 1e3,
  Ec = Pc * 60,
  _a = Ec * 60,
  Ce = _a * 24,
  rp = Ce * 365,
  rD = {
    year: /({yyyy}|{yy})/,
    month: /({MMMM}|{MMM}|{MM}|{M})/,
    day: /({dd}|{d})/,
    hour: /({HH}|{H}|{hh}|{h})/,
    minute: /({mm}|{m})/,
    second: /({ss}|{s})/,
    millisecond: /({SSS}|{S})/,
  },
  vs = {
    year: "{yyyy}",
    month: "{MMM}",
    day: "{d}",
    hour: "{HH}:{mm}",
    minute: "{HH}:{mm}",
    second: "{HH}:{mm}:{ss}",
    millisecond: "{HH}:{mm}:{ss} {SSS}",
  },
  nD = "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss} {SSS}",
  Do = "{yyyy}-{MM}-{dd}",
  np = {
    year: "{yyyy}",
    month: "{yyyy}-{MM}",
    day: Do,
    hour: Do + " " + vs.hour,
    minute: Do + " " + vs.minute,
    second: Do + " " + vs.second,
    millisecond: nD,
  },
  Ln = ["year", "month", "day", "hour", "minute", "second", "millisecond"],
  iD = [
    "year",
    "half-year",
    "quarter",
    "month",
    "week",
    "half-week",
    "day",
    "half-day",
    "quarter-day",
    "hour",
    "minute",
    "second",
    "millisecond",
  ];
function aD(e) {
  return !Y(e) && !et(e) ? oD(e) : e;
}
function oD(e) {
  e = e || {};
  var t = {},
    r = !0;
  return (
    I(Ln, function (n) {
      r && (r = e[n] == null);
    }),
    I(Ln, function (n, i) {
      var a = e[n];
      t[n] = {};
      for (var o = null, s = i; s >= 0; s--) {
        var l = Ln[s],
          u = Z(a) && !U(a) ? a[l] : a,
          f = void 0;
        (U(u)
          ? ((f = u.slice()), (o = f[0] || ""))
          : Y(u)
            ? ((o = u), (f = [o]))
            : (o == null ? (o = vs[n]) : rD[l].test(o) || (o = t[l][l][0] + " " + o),
              (f = [o]),
              r && (f[1] = "{primary|" + o + "}")),
          (t[n][l] = f));
      }
    }),
    t
  );
}
function br(e, t) {
  return ((e += ""), "0000".substr(0, t - e.length) + e);
}
function Sa(e) {
  switch (e) {
    case "half-year":
    case "quarter":
      return "month";
    case "week":
    case "half-week":
      return "day";
    case "half-day":
    case "quarter-day":
      return "hour";
    default:
      return e;
  }
}
function sD(e) {
  return e === Sa(e);
}
function lD(e) {
  switch (e) {
    case "year":
    case "month":
      return "day";
    case "millisecond":
      return "millisecond";
    default:
      return "second";
  }
}
function Ll(e, t, r, n) {
  var i = Pi(e),
    a = i[m0(r)](),
    o = i[Rc(r)]() + 1,
    s = Math.floor((o - 1) / 3) + 1,
    l = i[Oc(r)](),
    u = i["get" + (r ? "UTC" : "") + "Day"](),
    f = i[kc(r)](),
    h = ((f - 1) % 12) + 1,
    c = i[Bc(r)](),
    v = i[Nc(r)](),
    d = i[Fc(r)](),
    p = f >= 12 ? "pm" : "am",
    m = p.toUpperCase(),
    g = n instanceof Ct ? n : JC(n || d0) || tD(),
    y = g.getModel("time"),
    _ = y.get("month"),
    S = y.get("monthAbbr"),
    b = y.get("dayOfWeek"),
    w = y.get("dayOfWeekAbbr");
  return (t || "")
    .replace(/{a}/g, p + "")
    .replace(/{A}/g, m + "")
    .replace(/{yyyy}/g, a + "")
    .replace(/{yy}/g, br((a % 100) + "", 2))
    .replace(/{Q}/g, s + "")
    .replace(/{MMMM}/g, _[o - 1])
    .replace(/{MMM}/g, S[o - 1])
    .replace(/{MM}/g, br(o, 2))
    .replace(/{M}/g, o + "")
    .replace(/{dd}/g, br(l, 2))
    .replace(/{d}/g, l + "")
    .replace(/{eeee}/g, b[u])
    .replace(/{ee}/g, w[u])
    .replace(/{e}/g, u + "")
    .replace(/{HH}/g, br(f, 2))
    .replace(/{H}/g, f + "")
    .replace(/{hh}/g, br(h + "", 2))
    .replace(/{h}/g, h + "")
    .replace(/{mm}/g, br(c, 2))
    .replace(/{m}/g, c + "")
    .replace(/{ss}/g, br(v, 2))
    .replace(/{s}/g, v + "")
    .replace(/{SSS}/g, br(d, 3))
    .replace(/{S}/g, d + "");
}
function uD(e, t, r, n, i) {
  var a = null;
  if (Y(r)) a = r;
  else if (et(r)) {
    var o = { time: e.time, level: e.time ? e.time.level : 0 },
      s = Il();
    (s && s.makeAxisLabelFormatterParamBreak(o, e.break), (a = r(e.value, t, o)));
  } else {
    var l = e.time;
    if (l) {
      var u = r[l.lowerTimeUnit][l.upperTimeUnit];
      a = u[Math.min(l.level, u.length - 1)] || "";
    } else {
      var f = ds(e.value, i);
      a = r[f][f][0];
    }
  }
  return Ll(new Date(e.value), a, i, n);
}
function ds(e, t) {
  var r = Pi(e),
    n = r[Rc(t)]() + 1,
    i = r[Oc(t)](),
    a = r[kc(t)](),
    o = r[Bc(t)](),
    s = r[Nc(t)](),
    l = r[Fc(t)](),
    u = l === 0,
    f = u && s === 0,
    h = f && o === 0,
    c = h && a === 0,
    v = c && i === 1,
    d = v && n === 1;
  return d ? "year" : v ? "month" : c ? "day" : h ? "hour" : f ? "minute" : u ? "second" : "millisecond";
}
function sh(e, t, r) {
  switch (t) {
    case "year":
      e[y0(r)](0);
    case "month":
      e[_0(r)](1);
    case "day":
      e[S0(r)](0);
    case "hour":
      e[b0(r)](0);
    case "minute":
      e[w0(r)](0);
    case "second":
      e[T0(r)](0);
  }
  return e;
}
function m0(e) {
  return e ? "getUTCFullYear" : "getFullYear";
}
function Rc(e) {
  return e ? "getUTCMonth" : "getMonth";
}
function Oc(e) {
  return e ? "getUTCDate" : "getDate";
}
function kc(e) {
  return e ? "getUTCHours" : "getHours";
}
function Bc(e) {
  return e ? "getUTCMinutes" : "getMinutes";
}
function Nc(e) {
  return e ? "getUTCSeconds" : "getSeconds";
}
function Fc(e) {
  return e ? "getUTCMilliseconds" : "getMilliseconds";
}
function fD(e) {
  return e ? "setUTCFullYear" : "setFullYear";
}
function y0(e) {
  return e ? "setUTCMonth" : "setMonth";
}
function _0(e) {
  return e ? "setUTCDate" : "setDate";
}
function S0(e) {
  return e ? "setUTCHours" : "setHours";
}
function b0(e) {
  return e ? "setUTCMinutes" : "setMinutes";
}
function w0(e) {
  return e ? "setUTCSeconds" : "setSeconds";
}
function T0(e) {
  return e ? "setUTCMilliseconds" : "setMilliseconds";
}
function x0(e) {
  if (!Vw(e)) return Y(e) ? e : "-";
  var t = (e + "").split(".");
  return t[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") + (t.length > 1 ? "." + t[1] : "");
}
function C0(e, t) {
  return (
    (e = (e || "").toLowerCase().replace(/-(.)/g, function (r, n) {
      return n.toUpperCase();
    })),
    t && e && (e = e.charAt(0).toUpperCase() + e.slice(1)),
    e
  );
}
var Pl = Kh;
function lh(e, t, r) {
  var n = "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}";
  function i(f) {
    return f && Xe(f) ? f : "-";
  }
  function a(f) {
    return Ie(f);
  }
  var o = t === "time",
    s = e instanceof Date;
  if (o || s) {
    var l = o ? Pi(e) : e;
    if (isNaN(+l)) {
      if (s) return "-";
    } else return Ll(l, n, r);
  }
  if (t === "ordinal") return Tf(e) ? i(e) : wt(e) && a(e) ? e + "" : "-";
  var u = Os(e);
  return a(u) ? x0(u) : Tf(e) ? i(e) : typeof e == "boolean" ? e + "" : "-";
}
var ip = ["a", "b", "c", "d", "e", "f", "g"],
  Fu = function (e, t) {
    return "{" + e + (t ?? "") + "}";
  };
function D0(e, t, r) {
  U(t) || (t = [t]);
  var n = t.length;
  if (!n) return "";
  for (var i = t[0].$vars || [], a = 0; a < i.length; a++) {
    var o = ip[a];
    e = e.replace(Fu(o), Fu(o, 0));
  }
  for (var s = 0; s < n; s++)
    for (var l = 0; l < i.length; l++) {
      var u = t[s][i[l]];
      e = e.replace(Fu(ip[l], s), r ? ee(u) : u);
    }
  return e;
}
function hD(e, t) {
  var r = Y(e) ? { color: e, extraCssText: t } : e || {},
    n = r.color,
    i = r.type;
  t = r.extraCssText;
  var a = r.renderMode || "html";
  if (!n) return "";
  if (a === "html")
    return i === "subItem"
      ? '<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:' +
          ee(n) +
          ";" +
          (t || "") +
          '"></span>'
      : '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' +
          ee(n) +
          ";" +
          (t || "") +
          '"></span>';
  var o = r.markerId || "markerX";
  return {
    renderMode: a,
    content: "{" + o + "|}  ",
    style:
      i === "subItem"
        ? { width: 4, height: 4, borderRadius: 2, backgroundColor: n }
        : { width: 10, height: 10, borderRadius: 5, backgroundColor: n },
  };
}
function On(e, t) {
  return ((t = t || "transparent"), Y(e) ? e : (Z(e) && e.colorStops && (e.colorStops[0] || {}).color) || t);
}
function ap(e, t) {
  if (t === "_blank" || t === "blank") {
    var r = window.open();
    ((r.opener = null), (r.location.href = e));
  } else window.open(e, t);
}
var ps = {},
  zu = {},
  zc = (function () {
    function e() {
      ((this._normalMasterList = []), (this._nonSeriesBoxMasterList = []));
    }
    return (
      (e.prototype.create = function (t, r) {
        ((this._nonSeriesBoxMasterList = n(ps)), (this._normalMasterList = n(zu)));
        function n(i, a) {
          var o = [];
          return (
            I(i, function (s, l) {
              var u = s.create(t, r);
              o = o.concat(u || []);
            }),
            o
          );
        }
      }),
      (e.prototype.update = function (t, r) {
        I(this._normalMasterList, function (n) {
          n.update && n.update(t, r);
        });
      }),
      (e.prototype.getCoordinateSystems = function () {
        return this._normalMasterList.concat(this._nonSeriesBoxMasterList);
      }),
      (e.register = function (t, r) {
        if (t === "matrix" || t === "calendar") {
          ps[t] = r;
          return;
        }
        zu[t] = r;
      }),
      (e.get = function (t) {
        return zu[t] || ps[t];
      }),
      e
    );
  })();
function cD(e) {
  return !!ps[e];
}
var vD = 1,
  dD = 2,
  pD = Q();
function A0(e) {
  var t = e.getShallow("coord", !0),
    r = vD;
  if (t == null) {
    var n = pD.get(e.type);
    n && n.getCoord2 && ((r = dD), (t = n.getCoord2(e)));
  }
  return { coord: t, from: r };
}
var vi = 0,
  gs = 1,
  gD = 2;
function mD(e, t) {
  var r = e.getShallow("coordinateSystem"),
    n = e.getShallow("coordinateSystemUsage", !0),
    i = vi;
  if (r) {
    var a = e.mainType === "series";
    (n == null && (n = a ? "data" : "box"),
      n === "data" ? ((i = gs), a || (i = vi)) : n === "box" && ((i = gD), !a && !cD(r) && (i = vi)));
  }
  return { coordSysType: r, kind: i };
}
function yD(e) {
  var t = e.targetModel,
    r = e.coordSysType,
    n = e.coordSysProvider,
    i = e.isDefaultDataCoordSys,
    a = mD(t),
    o = a.kind,
    s = a.coordSysType;
  if ((i && o !== gs && ((o = gs), (s = r)), o === vi || s !== r)) return vi;
  var l = n(r, t);
  return l ? (o === gs ? (t.coordinateSystem = l) : (t.boxCoordinateSystem = l), o) : vi;
}
var ms = I,
  _D = ["left", "right", "top", "bottom", "width", "height"],
  Ao = [
    ["width", "left", "right"],
    ["height", "top", "bottom"],
  ];
function Hc(e, t, r, n, i) {
  var a = 0,
    o = 0;
  (n == null && (n = 1 / 0), i == null && (i = 1 / 0));
  var s = 0;
  t.eachChild(function (l, u) {
    var f = l.getBoundingRect(),
      h = t.childAt(u + 1),
      c = h && h.getBoundingRect(),
      v,
      d;
    if (e === "horizontal") {
      var p = f.width + (c ? -c.x + f.x : 0);
      ((v = a + p),
        v > n || l.newline ? ((a = 0), (v = p), (o += s + r), (s = f.height)) : (s = Math.max(s, f.height)));
    } else {
      var m = f.height + (c ? -c.y + f.y : 0);
      ((d = o + m), d > i || l.newline ? ((a += s + r), (o = 0), (d = m), (s = f.width)) : (s = Math.max(s, f.width)));
    }
    l.newline || ((l.x = a), (l.y = o), l.markRedraw(), e === "horizontal" ? (a = v + r) : (o = d + r));
  });
}
var ba = Hc;
Rt(Hc, "vertical");
Rt(Hc, "horizontal");
function SD(e, t) {
  return {
    left: e.getShallow("left", t),
    top: e.getShallow("top", t),
    right: e.getShallow("right", t),
    bottom: e.getShallow("bottom", t),
    width: e.getShallow("width", t),
    height: e.getShallow("height", t),
  };
}
function bi(e, t, r) {
  r = Pl(r || 0);
  var n = t.width,
    i = t.height,
    a = qt(e.left, n),
    o = qt(e.top, i),
    s = qt(e.right, n),
    l = qt(e.bottom, i),
    u = qt(e.width, n),
    f = qt(e.height, i),
    h = r[2] + r[0],
    c = r[1] + r[3],
    v = e.aspect;
  switch (
    (isNaN(u) && (u = n - s - c - a),
    isNaN(f) && (f = i - l - h - o),
    v != null &&
      (isNaN(u) && isNaN(f) && (v > n / i ? (u = n * 0.8) : (f = i * 0.8)),
      isNaN(u) && (u = v * f),
      isNaN(f) && (f = u / v)),
    isNaN(a) && (a = n - s - u - c),
    isNaN(o) && (o = i - l - f - h),
    e.left || e.right)
  ) {
    case "center":
      a = n / 2 - u / 2 - r[3];
      break;
    case "right":
      a = n - u - c;
      break;
  }
  switch (e.top || e.bottom) {
    case "middle":
    case "center":
      o = i / 2 - f / 2 - r[0];
      break;
    case "bottom":
      o = i - f - h;
      break;
  }
  ((a = a || 0), (o = o || 0), isNaN(u) && (u = n - c - a - (s || 0)), isNaN(f) && (f = i - h - o - (l || 0)));
  var d = new J((t.x || 0) + a + r[3], (t.y || 0) + o + r[0], u, f);
  return ((d.margin = r), d);
}
var Hu = { rect: 1 };
function Vc(e, t, r) {
  var n,
    i,
    a,
    o = e.boxCoordinateSystem,
    s;
  if (o) {
    var l = A0(e),
      u = l.coord,
      f = l.from;
    if (o.dataToLayout) {
      ((a = Hu.rect), (s = f));
      var h = o.dataToLayout(u);
      n = h.contentRect || h.rect;
    }
  }
  return (
    a == null && (a = Hu.rect),
    a === Hu.rect &&
      (n || (n = { x: 0, y: 0, width: t.getWidth(), height: t.getHeight() }),
      (i = [n.x + n.width / 2, n.y + n.height / 2])),
    { type: a, refContainer: n, refPoint: i, boxCoordFrom: s }
  );
}
function ka(e) {
  var t = e.layoutMode || e.constructor.layoutMode;
  return Z(t) ? t : t ? { type: t } : null;
}
function Hr(e, t, r) {
  var n = r && r.ignoreSize;
  !U(n) && (n = [n, n]);
  var i = o(Ao[0], 0),
    a = o(Ao[1], 1);
  (l(Ao[0], e, i), l(Ao[1], e, a));
  function o(u, f) {
    var h = {},
      c = 0,
      v = {},
      d = 0,
      p = 2;
    if (
      (ms(u, function (y) {
        v[y] = e[y];
      }),
      ms(u, function (y) {
        (Qt(t, y) && (h[y] = v[y] = t[y]), s(h, y) && c++, s(v, y) && d++);
      }),
      n[f])
    )
      return (s(t, u[1]) ? (v[u[2]] = null) : s(t, u[2]) && (v[u[1]] = null), v);
    if (d === p || !c) return v;
    if (c >= p) return h;
    for (var m = 0; m < u.length; m++) {
      var g = u[m];
      if (!Qt(h, g) && Qt(e, g)) {
        h[g] = e[g];
        break;
      }
    }
    return h;
  }
  function s(u, f) {
    return u[f] != null && u[f] !== "auto";
  }
  function l(u, f, h) {
    ms(u, function (c) {
      f[c] = h[c];
    });
  }
}
function ja(e) {
  return bD({}, e);
}
function bD(e, t) {
  return (
    t &&
      e &&
      ms(_D, function (r) {
        Qt(t, r) && (e[r] = t[r]);
      }),
    e
  );
}
var wD = St(),
  dt = (function (e) {
    V(t, e);
    function t(r, n, i) {
      var a = e.call(this, r, n, i) || this;
      return ((a.uid = Ml("ec_cpt_model")), a);
    }
    return (
      (t.prototype.init = function (r, n, i) {
        this.mergeDefaultAndTheme(r, i);
      }),
      (t.prototype.mergeDefaultAndTheme = function (r, n) {
        var i = ka(this),
          a = i ? ja(r) : {},
          o = n.getTheme();
        (pt(r, o.get(this.mainType)), pt(r, this.getDefaultOption()), i && Hr(r, a, i));
      }),
      (t.prototype.mergeOption = function (r, n) {
        pt(this.option, r, !0);
        var i = ka(this);
        i && Hr(this.option, r, i);
      }),
      (t.prototype.optionUpdated = function (r, n) {}),
      (t.prototype.getDefaultOption = function () {
        var r = this.constructor;
        if (!gT(r)) return r.defaultOption;
        var n = wD(this);
        if (!n.defaultOption) {
          for (var i = [], a = r; a; ) {
            var o = a.prototype.defaultOption;
            (o && i.push(o), (a = a.superClass));
          }
          for (var s = {}, l = i.length - 1; l >= 0; l--) s = pt(s, i[l], !0);
          n.defaultOption = s;
        }
        return n.defaultOption;
      }),
      (t.prototype.getReferringComponents = function (r, n) {
        var i = r + "Index",
          a = r + "Id";
        return Ka(this.ecModel, r, { index: this.get(i, !0), id: this.get(a, !0) }, n);
      }),
      (t.prototype.getBoxLayoutParams = function () {
        return SD(this, !1);
      }),
      (t.prototype.getZLevelKey = function () {
        return "";
      }),
      (t.prototype.setZLevel = function (r) {
        this.option.zlevel = r;
      }),
      (t.protoInitialize = (function () {
        var r = t.prototype;
        ((r.type = "component"),
          (r.id = ""),
          (r.name = ""),
          (r.mainType = ""),
          (r.subType = ""),
          (r.componentIndex = 0));
      })()),
      t
    );
  })(Ct);
by(dt, Ct);
dl(dt);
ZC(dt);
qC(dt, TD);
function TD(e) {
  var t = [];
  return (
    I(dt.getClassesByMainType(e), function (r) {
      t = t.concat(r.dependencies || r.prototype.dependencies || []);
    }),
    (t = j(t, function (r) {
      return $e(r).main;
    })),
    e !== "dataset" && vt(t, "dataset") <= 0 && t.unshift("dataset"),
    t
  );
}
var X = { color: {}, darkColor: {}, size: {} },
  At = (X.color = {
    theme: ["#5070dd", "#b6d634", "#505372", "#ff994d", "#0ca8df", "#ffd10a", "#fb628b", "#785db0", "#3fbe95"],
    neutral00: "#fff",
    neutral05: "#f4f7fd",
    neutral10: "#e8ebf0",
    neutral15: "#dbdee4",
    neutral20: "#cfd2d7",
    neutral25: "#c3c5cb",
    neutral30: "#b7b9be",
    neutral35: "#aaacb2",
    neutral40: "#9ea0a5",
    neutral45: "#929399",
    neutral50: "#86878c",
    neutral55: "#797b7f",
    neutral60: "#6d6e73",
    neutral65: "#616266",
    neutral70: "#54555a",
    neutral75: "#48494d",
    neutral80: "#3c3c41",
    neutral85: "#303034",
    neutral90: "#232328",
    neutral95: "#17171b",
    neutral99: "#000",
    accent05: "#eff1f9",
    accent10: "#e0e4f2",
    accent15: "#d0d6ec",
    accent20: "#c0c9e6",
    accent25: "#b1bbdf",
    accent30: "#a1aed9",
    accent35: "#91a0d3",
    accent40: "#8292cc",
    accent45: "#7285c6",
    accent50: "#6578ba",
    accent55: "#5c6da9",
    accent60: "#536298",
    accent65: "#4a5787",
    accent70: "#404c76",
    accent75: "#374165",
    accent80: "#2e3654",
    accent85: "#252b43",
    accent90: "#1b2032",
    accent95: "#121521",
    transparent: "rgba(0,0,0,0)",
    highlight: "rgba(255,231,130,0.8)",
  });
N(At, {
  primary: At.neutral80,
  secondary: At.neutral70,
  tertiary: At.neutral60,
  quaternary: At.neutral50,
  disabled: At.neutral20,
  border: At.neutral30,
  borderTint: At.neutral20,
  borderShade: At.neutral40,
  background: At.neutral05,
  backgroundTint: "rgba(234,237,245,0.5)",
  backgroundTransparent: "rgba(255,255,255,0)",
  backgroundShade: At.neutral10,
  shadow: "rgba(0,0,0,0.2)",
  shadowTint: "rgba(129,130,136,0.2)",
  axisLine: At.neutral70,
  axisLineTint: At.neutral40,
  axisTick: At.neutral70,
  axisTickMinor: At.neutral60,
  axisLabel: At.neutral70,
  axisSplitLine: At.neutral15,
  axisMinorSplitLine: At.neutral05,
});
for (var cn in At)
  if (At.hasOwnProperty(cn)) {
    var op = At[cn];
    cn === "theme"
      ? (X.darkColor.theme = At.theme.slice())
      : cn === "highlight"
        ? (X.darkColor.highlight = "rgba(255,231,130,0.4)")
        : cn.indexOf("accent") === 0
          ? (X.darkColor[cn] = kf(
              op,
              null,
              function (e) {
                return e * 0.5;
              },
              function (e) {
                return Math.min(1, 1.3 - e);
              },
            ))
          : (X.darkColor[cn] = kf(
              op,
              null,
              function (e) {
                return e * 0.9;
              },
              function (e) {
                return 1 - Math.pow(e, 1.5);
              },
            ));
  }
X.size = { xxs: 2, xs: 5, s: 10, m: 15, l: 20, xl: 30, xxl: 40, xxxl: 50 };
var M0 = "";
typeof navigator < "u" && (M0 = navigator.platform || "");
var $n = "rgba(0, 0, 0, 0.2)",
  I0 = X.color.theme[0],
  xD = kf(I0, null, null, 0.9);
const L0 = {
  darkMode: "auto",
  colorBy: "series",
  color: X.color.theme,
  gradientColor: [xD, I0],
  aria: {
    decal: {
      decals: [
        { color: $n, dashArrayX: [1, 0], dashArrayY: [2, 5], symbolSize: 1, rotation: Math.PI / 6 },
        {
          color: $n,
          symbol: "circle",
          dashArrayX: [
            [8, 8],
            [0, 8, 8, 0],
          ],
          dashArrayY: [6, 0],
          symbolSize: 0.8,
        },
        { color: $n, dashArrayX: [1, 0], dashArrayY: [4, 3], rotation: -Math.PI / 4 },
        {
          color: $n,
          dashArrayX: [
            [6, 6],
            [0, 6, 6, 0],
          ],
          dashArrayY: [6, 0],
        },
        {
          color: $n,
          dashArrayX: [
            [1, 0],
            [1, 6],
          ],
          dashArrayY: [1, 0, 6, 0],
          rotation: Math.PI / 4,
        },
        {
          color: $n,
          symbol: "triangle",
          dashArrayX: [
            [9, 9],
            [0, 9, 9, 0],
          ],
          dashArrayY: [7, 2],
          symbolSize: 0.75,
        },
      ],
    },
  },
  textStyle: {
    fontFamily: M0.match(/^Win/) ? "Microsoft YaHei" : "sans-serif",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
  },
  blendMode: null,
  stateAnimation: { duration: 300, easing: "cubicOut" },
  animation: "auto",
  animationDuration: 1e3,
  animationDurationUpdate: 500,
  animationEasing: "cubicInOut",
  animationEasingUpdate: "cubicInOut",
  animationThreshold: 2e3,
  progressiveThreshold: 3e3,
  progressive: 400,
  hoverLayerThreshold: 3e3,
  useUTC: !1,
};
var le = { Must: 1, Might: 2, Not: 3 },
  P0 = St();
function CD(e) {
  P0(e).datasetMap = Q();
}
function DD(e, t, r) {
  var n = {},
    i = E0(t);
  if (!i || !e) return n;
  var a = [],
    o = [],
    s = t.ecModel,
    l = P0(s).datasetMap,
    u = i.uid + "_" + r.seriesLayoutBy,
    f,
    h;
  ((e = e.slice()),
    I(e, function (p, m) {
      var g = Z(p) ? p : (e[m] = { name: p });
      (g.type === "ordinal" && f == null && ((f = m), (h = d(g))), (n[g.name] = []));
    }));
  var c = l.get(u) || l.set(u, { categoryWayDim: h, valueWayDim: 0 });
  I(e, function (p, m) {
    var g = p.name,
      y = d(p);
    if (f == null) {
      var _ = c.valueWayDim;
      (v(n[g], _, y), v(o, _, y), (c.valueWayDim += y));
    } else if (f === m) (v(n[g], 0, y), v(a, 0, y));
    else {
      var _ = c.categoryWayDim;
      (v(n[g], _, y), v(o, _, y), (c.categoryWayDim += y));
    }
  });
  function v(p, m, g) {
    for (var y = 0; y < g; y++) p.push(m + y);
  }
  function d(p) {
    var m = p.dimsDef;
    return m ? m.length : 1;
  }
  return (a.length && (n.itemName = a), o.length && (n.seriesName = o), n);
}
function E0(e) {
  var t = e.get("data", !0);
  if (!t)
    return Ka(e.ecModel, "dataset", { index: e.get("datasetIndex", !0), id: e.get("datasetId", !0) }, xe).models[0];
}
function AD(e) {
  return !e.get("transform", !0) && !e.get("fromTransformResult", !0)
    ? []
    : Ka(e.ecModel, "dataset", { index: e.get("fromDatasetIndex", !0), id: e.get("fromDatasetId", !0) }, xe).models;
}
function R0(e, t) {
  return MD(e.data, e.sourceFormat, e.seriesLayoutBy, e.dimensionsDefine, e.startIndex, t);
}
function MD(e, t, r, n, i, a) {
  var o,
    s = 5;
  if (oe(e)) return le.Not;
  var l, u;
  if (n) {
    var f = n[a];
    Z(f) ? ((l = f.name), (u = f.type)) : Y(f) && (l = f);
  }
  if (u != null) return u === "ordinal" ? le.Must : le.Not;
  if (t === Yt) {
    var h = e;
    if (r === Bn) {
      for (var c = h[a], v = 0; v < (c || []).length && v < s; v++) if ((o = S(c[i + v])) != null) return o;
    } else
      for (var v = 0; v < h.length && v < s; v++) {
        var d = h[i + v];
        if (d && (o = S(d[a])) != null) return o;
      }
  } else if (t === Be) {
    var p = e;
    if (!l) return le.Not;
    for (var v = 0; v < p.length && v < s; v++) {
      var m = p[v];
      if (m && (o = S(m[l])) != null) return o;
    }
  } else if (t === ir) {
    var g = e;
    if (!l) return le.Not;
    var c = g[l];
    if (!c || oe(c)) return le.Not;
    for (var v = 0; v < c.length && v < s; v++) if ((o = S(c[v])) != null) return o;
  } else if (t === ce)
    for (var y = e, v = 0; v < y.length && v < s; v++) {
      var m = y[v],
        _ = qa(m);
      if (!U(_)) return le.Not;
      if ((o = S(_[a])) != null) return o;
    }
  function S(b) {
    var w = Y(b);
    if (b != null && isFinite(Number(b)) && b !== "") return w ? le.Might : le.Not;
    if (w && b !== "-") return le.Must;
  }
  return le.Not;
}
var ID = Q();
function LD(e, t, r) {
  var n = ID.get(t);
  if (!n) return r;
  var i = n(e);
  return i ? r.concat(i) : r;
}
var sp = St();
St();
var Gc = (function () {
  function e() {}
  return (
    (e.prototype.getColorFromPalette = function (t, r, n) {
      var i = jt(this.get("color", !0)),
        a = this.get("colorLayer", !0);
      return ED(this, sp, i, a, t, r, n);
    }),
    (e.prototype.clearColorPalette = function () {
      RD(this, sp);
    }),
    e
  );
})();
function PD(e, t) {
  for (var r = e.length, n = 0; n < r; n++) if (e[n].length > t) return e[n];
  return e[r - 1];
}
function ED(e, t, r, n, i, a, o) {
  a = a || e;
  var s = t(a),
    l = s.paletteIdx || 0,
    u = (s.paletteNameMap = s.paletteNameMap || {});
  if (u.hasOwnProperty(i)) return u[i];
  var f = o == null || !n ? r : PD(n, o);
  if (((f = f || r), !(!f || !f.length))) {
    var h = f[l];
    return (i && (u[i] = h), (s.paletteIdx = (l + 1) % f.length), h);
  }
}
function RD(e, t) {
  ((t(e).paletteIdx = 0), (t(e).paletteNameMap = {}));
}
var Mo,
  Xi,
  lp,
  up = "\0_ec_inner",
  OD = 1,
  Uc = (function (e) {
    V(t, e);
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    return (
      (t.prototype.init = function (r, n, i, a, o, s) {
        ((a = a || {}),
          (this.option = null),
          (this._theme = new Ct(a)),
          (this._locale = new Ct(o)),
          (this._optionManager = s));
      }),
      (t.prototype.setOption = function (r, n, i) {
        var a = cp(n);
        (this._optionManager.setOption(r, i, a), this._resetOption(null, a));
      }),
      (t.prototype.resetOption = function (r, n) {
        return this._resetOption(r, cp(n));
      }),
      (t.prototype._resetOption = function (r, n) {
        var i = !1,
          a = this._optionManager;
        if (!r || r === "recreate") {
          var o = a.mountOption(r === "recreate");
          (!this.option || r === "recreate" ? lp(this, o) : (this.restoreData(), this._mergeOption(o, n)), (i = !0));
        }
        if (((r === "timeline" || r === "media") && this.restoreData(), !r || r === "recreate" || r === "timeline")) {
          var s = a.getTimelineOption(this);
          s && ((i = !0), this._mergeOption(s, n));
        }
        if (!r || r === "recreate" || r === "media") {
          var l = a.getMediaOption(this);
          l.length &&
            I(
              l,
              function (u) {
                ((i = !0), this._mergeOption(u, n));
              },
              this,
            );
        }
        return i;
      }),
      (t.prototype.mergeOption = function (r) {
        this._mergeOption(r, null);
      }),
      (t.prototype._mergeOption = function (r, n) {
        var i = this.option,
          a = this._componentsMap,
          o = this._componentsCount,
          s = [],
          l = Q(),
          u = n && n.replaceMergeMainTypeMap;
        (CD(this),
          I(r, function (h, c) {
            h != null &&
              (dt.hasClass(c) ? c && (s.push(c), l.set(c, !0)) : (i[c] = i[c] == null ? ot(h) : pt(i[c], h, !0)));
          }),
          u &&
            u.each(function (h, c) {
              dt.hasClass(c) && !l.get(c) && (s.push(c), l.set(c, !0));
            }),
          dt.topologicalTravel(s, dt.getAllClassMainTypes(), f, this));
        function f(h) {
          var c = LD(this, h, jt(r[h])),
            v = a.get(h),
            d = v ? (u && u.get(h) ? "replaceMerge" : "normalMerge") : "replaceAll",
            p = $w(v, c, d);
          (tT(p, h, dt), (i[h] = null), a.set(h, null), o.set(h, 0));
          var m = [],
            g = [],
            y = 0,
            _;
          (I(
            p,
            function (S, b) {
              var w = S.existing,
                T = S.newOption;
              if (!T) w && (w.mergeOption({}, this), w.optionUpdated({}, !1));
              else {
                var C = h === "series",
                  A = dt.getClass(h, S.keyInfo.subType, !C);
                if (!A) return;
                if (h === "tooltip") {
                  if (_) return;
                  _ = !0;
                }
                if (w && w.constructor === A)
                  ((w.name = S.keyInfo.name), w.mergeOption(T, this), w.optionUpdated(T, !1));
                else {
                  var M = N({ componentIndex: b }, S.keyInfo);
                  ((w = new A(T, this, this, M)),
                    N(w, M),
                    S.brandNew && (w.__requireNewView = !0),
                    w.init(T, this, this),
                    w.optionUpdated(null, !0));
                }
              }
              w ? (m.push(w.option), g.push(w), y++) : (m.push(void 0), g.push(void 0));
            },
            this,
          ),
            (i[h] = m),
            a.set(h, g),
            o.set(h, y),
            h === "series" && Mo(this));
        }
        this._seriesIndices || Mo(this);
      }),
      (t.prototype.getOption = function () {
        var r = ot(this.option);
        return (
          I(r, function (n, i) {
            if (dt.hasClass(i)) {
              for (var a = jt(n), o = a.length, s = !1, l = o - 1; l >= 0; l--)
                a[l] && !La(a[l]) ? (s = !0) : ((a[l] = null), !s && o--);
              ((a.length = o), (r[i] = a));
            }
          }),
          delete r[up],
          r
        );
      }),
      (t.prototype.setTheme = function (r) {
        ((this._theme = new Ct(r)), this._resetOption("recreate", null));
      }),
      (t.prototype.getTheme = function () {
        return this._theme;
      }),
      (t.prototype.getLocaleModel = function () {
        return this._locale;
      }),
      (t.prototype.setUpdatePayload = function (r) {
        this._payload = r;
      }),
      (t.prototype.getUpdatePayload = function () {
        return this._payload;
      }),
      (t.prototype.getComponent = function (r, n) {
        var i = this._componentsMap.get(r);
        if (i) {
          var a = i[n || 0];
          if (a) return a;
          if (n == null) {
            for (var o = 0; o < i.length; o++) if (i[o]) return i[o];
          }
        }
      }),
      (t.prototype.queryComponents = function (r) {
        var n = r.mainType;
        if (!n) return [];
        var i = r.index,
          a = r.id,
          o = r.name,
          s = this._componentsMap.get(n);
        if (!s || !s.length) return [];
        var l;
        return (
          i != null
            ? ((l = []),
              I(jt(i), function (u) {
                s[u] && l.push(s[u]);
              }))
            : a != null
              ? (l = fp("id", a, s))
              : o != null
                ? (l = fp("name", o, s))
                : (l = Vt(s, function (u) {
                    return !!u;
                  })),
          hp(l, r)
        );
      }),
      (t.prototype.findComponents = function (r) {
        var n = r.query,
          i = r.mainType,
          a = s(n),
          o = a
            ? this.queryComponents(a)
            : Vt(this._componentsMap.get(i), function (u) {
                return !!u;
              });
        return l(hp(o, r));
        function s(u) {
          var f = i + "Index",
            h = i + "Id",
            c = i + "Name";
          return u && (u[f] != null || u[h] != null || u[c] != null)
            ? { mainType: i, index: u[f], id: u[h], name: u[c] }
            : null;
        }
        function l(u) {
          return r.filter ? Vt(u, r.filter) : u;
        }
      }),
      (t.prototype.eachComponent = function (r, n, i) {
        var a = this._componentsMap;
        if (et(r)) {
          var o = n,
            s = r;
          a.each(function (h, c) {
            for (var v = 0; h && v < h.length; v++) {
              var d = h[v];
              d && s.call(o, c, d, d.componentIndex);
            }
          });
        } else
          for (var l = Y(r) ? a.get(r) : Z(r) ? this.findComponents(r) : null, u = 0; l && u < l.length; u++) {
            var f = l[u];
            f && n.call(i, f, f.componentIndex);
          }
      }),
      (t.prototype.getSeriesByName = function (r) {
        var n = je(r, null);
        return Vt(this._componentsMap.get("series"), function (i) {
          return !!i && n != null && i.name === n;
        });
      }),
      (t.prototype.getSeriesByIndex = function (r) {
        return this._componentsMap.get("series")[r];
      }),
      (t.prototype.getSeriesByType = function (r) {
        return Vt(this._componentsMap.get("series"), function (n) {
          return !!n && n.subType === r;
        });
      }),
      (t.prototype.getSeries = function () {
        return Vt(this._componentsMap.get("series"), function (r) {
          return !!r;
        });
      }),
      (t.prototype.getSeriesCount = function () {
        return this._componentsCount.get("series");
      }),
      (t.prototype.eachSeries = function (r, n) {
        (Xi(this),
          I(
            this._seriesIndices,
            function (i) {
              var a = this._componentsMap.get("series")[i];
              r.call(n, a, i);
            },
            this,
          ));
      }),
      (t.prototype.eachRawSeries = function (r, n) {
        I(this._componentsMap.get("series"), function (i) {
          i && r.call(n, i, i.componentIndex);
        });
      }),
      (t.prototype.eachSeriesByType = function (r, n, i) {
        (Xi(this),
          I(
            this._seriesIndices,
            function (a) {
              var o = this._componentsMap.get("series")[a];
              o.subType === r && n.call(i, o, a);
            },
            this,
          ));
      }),
      (t.prototype.eachRawSeriesByType = function (r, n, i) {
        return I(this.getSeriesByType(r), n, i);
      }),
      (t.prototype.isSeriesFiltered = function (r) {
        return (Xi(this), this._seriesIndicesMap.get(r.componentIndex) == null);
      }),
      (t.prototype.getCurrentSeriesIndices = function () {
        return (this._seriesIndices || []).slice();
      }),
      (t.prototype.filterSeries = function (r, n) {
        Xi(this);
        var i = [];
        (I(
          this._seriesIndices,
          function (a) {
            var o = this._componentsMap.get("series")[a];
            r.call(n, o, a) && i.push(a);
          },
          this,
        ),
          (this._seriesIndices = i),
          (this._seriesIndicesMap = Q(i)));
      }),
      (t.prototype.restoreData = function (r) {
        Mo(this);
        var n = this._componentsMap,
          i = [];
        (n.each(function (a, o) {
          dt.hasClass(o) && i.push(o);
        }),
          dt.topologicalTravel(i, dt.getAllClassMainTypes(), function (a) {
            I(n.get(a), function (o) {
              o && (a !== "series" || !kD(o, r)) && o.restoreData();
            });
          }));
      }),
      (t.internalField = (function () {
        ((Mo = function (r) {
          var n = (r._seriesIndices = []);
          (I(r._componentsMap.get("series"), function (i) {
            i && n.push(i.componentIndex);
          }),
            (r._seriesIndicesMap = Q(n)));
        }),
          (Xi = function (r) {}),
          (lp = function (r, n) {
            ((r.option = {}), (r.option[up] = OD), (r._componentsMap = Q({ series: [] })), (r._componentsCount = Q()));
            var i = n.aria;
            (Z(i) && i.enabled == null && (i.enabled = !0),
              BD(n, r._theme.option),
              pt(n, L0, !1),
              r._mergeOption(n, null));
          }));
      })()),
      t
    );
  })(Ct);
function kD(e, t) {
  if (t) {
    var r = t.seriesIndex,
      n = t.seriesId,
      i = t.seriesName;
    return (r != null && e.componentIndex !== r) || (n != null && e.id !== n) || (i != null && e.name !== i);
  }
}
function BD(e, t) {
  var r = e.color && !e.colorLayer;
  I(t, function (n, i) {
    (i === "colorLayer" && r) ||
      (i === "color" && e.color) ||
      dt.hasClass(i) ||
      (typeof n == "object" ? (e[i] = e[i] ? pt(e[i], n, !1) : ot(n)) : e[i] == null && (e[i] = n));
  });
}
function fp(e, t, r) {
  if (U(t)) {
    var n = Q();
    return (
      I(t, function (a) {
        if (a != null) {
          var o = je(a, null);
          o != null && n.set(a, !0);
        }
      }),
      Vt(r, function (a) {
        return a && n.get(a[e]);
      })
    );
  } else {
    var i = je(t, null);
    return Vt(r, function (a) {
      return a && i != null && a[e] === i;
    });
  }
}
function hp(e, t) {
  return t.hasOwnProperty("subType")
    ? Vt(e, function (r) {
        return r && r.subType === t.subType;
      })
    : e;
}
function cp(e) {
  var t = Q();
  return (
    e &&
      I(jt(e.replaceMerge), function (r) {
        t.set(r, !0);
      }),
    { replaceMergeMainTypeMap: t }
  );
}
rr(Uc, Gc);
var ND = /^(min|max)?(.+)$/,
  FD = (function () {
    function e(t) {
      ((this._timelineOptions = []), (this._mediaList = []), (this._currentMediaIndices = []), (this._api = t));
    }
    return (
      (e.prototype.setOption = function (t, r, n) {
        (t &&
          (I(jt(t.series), function (o) {
            o && o.data && oe(o.data) && xf(o.data);
          }),
          I(jt(t.dataset), function (o) {
            o && o.source && oe(o.source) && xf(o.source);
          })),
          (t = ot(t)));
        var i = this._optionBackup,
          a = zD(t, r, !i);
        ((this._newBaseOption = a.baseOption),
          i
            ? (a.timelineOptions.length && (i.timelineOptions = a.timelineOptions),
              a.mediaList.length && (i.mediaList = a.mediaList),
              a.mediaDefault && (i.mediaDefault = a.mediaDefault))
            : (this._optionBackup = a));
      }),
      (e.prototype.mountOption = function (t) {
        var r = this._optionBackup;
        return (
          (this._timelineOptions = r.timelineOptions),
          (this._mediaList = r.mediaList),
          (this._mediaDefault = r.mediaDefault),
          (this._currentMediaIndices = []),
          ot(t ? r.baseOption : this._newBaseOption)
        );
      }),
      (e.prototype.getTimelineOption = function (t) {
        var r,
          n = this._timelineOptions;
        if (n.length) {
          var i = t.getComponent("timeline");
          i && (r = ot(n[i.getCurrentIndex()]));
        }
        return r;
      }),
      (e.prototype.getMediaOption = function (t) {
        var r = this._api.getWidth(),
          n = this._api.getHeight(),
          i = this._mediaList,
          a = this._mediaDefault,
          o = [],
          s = [];
        if (!i.length && !a) return s;
        for (var l = 0, u = i.length; l < u; l++) HD(i[l].query, r, n) && o.push(l);
        return (
          !o.length && a && (o = [-1]),
          o.length &&
            !GD(o, this._currentMediaIndices) &&
            (s = j(o, function (f) {
              return ot(f === -1 ? a.option : i[f].option);
            })),
          (this._currentMediaIndices = o),
          s
        );
      }),
      e
    );
  })();
function zD(e, t, r) {
  var n = [],
    i,
    a,
    o = e.baseOption,
    s = e.timeline,
    l = e.options,
    u = e.media,
    f = !!e.media,
    h = !!(l || s || (o && o.timeline));
  (o ? ((a = o), a.timeline || (a.timeline = s)) : ((h || f) && (e.options = e.media = null), (a = e)),
    f &&
      U(u) &&
      I(u, function (v) {
        v && v.option && (v.query ? n.push(v) : i || (i = v));
      }),
    c(a),
    I(l, function (v) {
      return c(v);
    }),
    I(n, function (v) {
      return c(v.option);
    }));
  function c(v) {
    I(t, function (d) {
      d(v, r);
    });
  }
  return { baseOption: a, timelineOptions: l || [], mediaDefault: i, mediaList: n };
}
function HD(e, t, r) {
  var n = { width: t, height: r, aspectratio: t / r },
    i = !0;
  return (
    I(e, function (a, o) {
      var s = o.match(ND);
      if (!(!s || !s[1] || !s[2])) {
        var l = s[1],
          u = s[2].toLowerCase();
        VD(n[u], a, l) || (i = !1);
      }
    }),
    i
  );
}
function VD(e, t, r) {
  return r === "min" ? e >= t : r === "max" ? e <= t : e === t;
}
function GD(e, t) {
  return e.join(",") === t.join(",");
}
var Le = I,
  Ba = Z,
  vp = ["areaStyle", "lineStyle", "nodeStyle", "linkStyle", "chordStyle", "label", "labelLine"];
function Vu(e) {
  var t = e && e.itemStyle;
  if (t)
    for (var r = 0, n = vp.length; r < n; r++) {
      var i = vp[r],
        a = t.normal,
        o = t.emphasis;
      (a && a[i] && ((e[i] = e[i] || {}), e[i].normal ? pt(e[i].normal, a[i]) : (e[i].normal = a[i]), (a[i] = null)),
        o &&
          o[i] &&
          ((e[i] = e[i] || {}), e[i].emphasis ? pt(e[i].emphasis, o[i]) : (e[i].emphasis = o[i]), (o[i] = null)));
    }
}
function Ht(e, t, r) {
  if (e && e[t] && (e[t].normal || e[t].emphasis)) {
    var n = e[t].normal,
      i = e[t].emphasis;
    (n && (r ? ((e[t].normal = e[t].emphasis = null), mt(e[t], n)) : (e[t] = n)),
      i &&
        ((e.emphasis = e.emphasis || {}),
        (e.emphasis[t] = i),
        i.focus && (e.emphasis.focus = i.focus),
        i.blurScope && (e.emphasis.blurScope = i.blurScope)));
  }
}
function fa(e) {
  (Ht(e, "itemStyle"),
    Ht(e, "lineStyle"),
    Ht(e, "areaStyle"),
    Ht(e, "label"),
    Ht(e, "labelLine"),
    Ht(e, "upperLabel"),
    Ht(e, "edgeLabel"));
}
function It(e, t) {
  var r = Ba(e) && e[t],
    n = Ba(r) && r.textStyle;
  if (n)
    for (var i = 0, a = hd.length; i < a; i++) {
      var o = hd[i];
      n.hasOwnProperty(o) && (r[o] = n[o]);
    }
}
function ye(e) {
  e && (fa(e), It(e, "label"), e.emphasis && It(e.emphasis, "label"));
}
function UD(e) {
  if (Ba(e)) {
    (Vu(e),
      fa(e),
      It(e, "label"),
      It(e, "upperLabel"),
      It(e, "edgeLabel"),
      e.emphasis && (It(e.emphasis, "label"), It(e.emphasis, "upperLabel"), It(e.emphasis, "edgeLabel")));
    var t = e.markPoint;
    t && (Vu(t), ye(t));
    var r = e.markLine;
    r && (Vu(r), ye(r));
    var n = e.markArea;
    n && ye(n);
    var i = e.data;
    if (e.type === "graph") {
      i = i || e.nodes;
      var a = e.links || e.edges;
      if (a && !oe(a)) for (var o = 0; o < a.length; o++) ye(a[o]);
      I(e.categories, function (u) {
        fa(u);
      });
    }
    if (i && !oe(i)) for (var o = 0; o < i.length; o++) ye(i[o]);
    if (((t = e.markPoint), t && t.data)) for (var s = t.data, o = 0; o < s.length; o++) ye(s[o]);
    if (((r = e.markLine), r && r.data))
      for (var l = r.data, o = 0; o < l.length; o++) U(l[o]) ? (ye(l[o][0]), ye(l[o][1])) : ye(l[o]);
    e.type === "gauge"
      ? (It(e, "axisLabel"), It(e, "title"), It(e, "detail"))
      : e.type === "treemap"
        ? (Ht(e.breadcrumb, "itemStyle"),
          I(e.levels, function (u) {
            fa(u);
          }))
        : e.type === "tree" && fa(e.leaves);
  }
}
function or(e) {
  return U(e) ? e : e ? [e] : [];
}
function dp(e) {
  return (U(e) ? e[0] : e) || {};
}
function WD(e, t) {
  Le(or(e.series), function (n) {
    Ba(n) && UD(n);
  });
  var r = ["xAxis", "yAxis", "radiusAxis", "angleAxis", "singleAxis", "parallelAxis", "radar"];
  (t && r.push("valueAxis", "categoryAxis", "logAxis", "timeAxis"),
    Le(r, function (n) {
      Le(or(e[n]), function (i) {
        i && (It(i, "axisLabel"), It(i.axisPointer, "label"));
      });
    }),
    Le(or(e.parallel), function (n) {
      var i = n && n.parallelAxisDefault;
      (It(i, "axisLabel"), It(i && i.axisPointer, "label"));
    }),
    Le(or(e.calendar), function (n) {
      (Ht(n, "itemStyle"), It(n, "dayLabel"), It(n, "monthLabel"), It(n, "yearLabel"));
    }),
    Le(or(e.radar), function (n) {
      (It(n, "name"),
        n.name && n.axisName == null && ((n.axisName = n.name), delete n.name),
        n.nameGap != null && n.axisNameGap == null && ((n.axisNameGap = n.nameGap), delete n.nameGap));
    }),
    Le(or(e.geo), function (n) {
      Ba(n) &&
        (ye(n),
        Le(or(n.regions), function (i) {
          ye(i);
        }));
    }),
    Le(or(e.timeline), function (n) {
      (ye(n), Ht(n, "label"), Ht(n, "itemStyle"), Ht(n, "controlStyle", !0));
      var i = n.data;
      U(i) &&
        I(i, function (a) {
          Z(a) && (Ht(a, "label"), Ht(a, "itemStyle"));
        });
    }),
    Le(or(e.toolbox), function (n) {
      (Ht(n, "iconStyle"),
        Le(n.feature, function (i) {
          Ht(i, "iconStyle");
        }));
    }),
    It(dp(e.axisPointer), "label"),
    It(dp(e.tooltip).axisPointer, "label"));
}
function YD(e, t) {
  for (var r = t.split(","), n = e, i = 0; i < r.length && ((n = n && n[r[i]]), n != null); i++);
  return n;
}
function XD(e, t, r, n) {
  for (var i = t.split(","), a = e, o, s = 0; s < i.length - 1; s++)
    ((o = i[s]), a[o] == null && (a[o] = {}), (a = a[o]));
  a[i[s]] == null && (a[i[s]] = r);
}
function pp(e) {
  e &&
    I($D, function (t) {
      t[0] in e && !(t[1] in e) && (e[t[1]] = e[t[0]]);
    });
}
var $D = [
    ["x", "left"],
    ["y", "top"],
    ["x2", "right"],
    ["y2", "bottom"],
  ],
  ZD = ["grid", "geo", "parallel", "legend", "toolbox", "title", "visualMap", "dataZoom", "timeline"],
  Gu = [
    ["borderRadius", "barBorderRadius"],
    ["borderColor", "barBorderColor"],
    ["borderWidth", "barBorderWidth"],
  ];
function $i(e) {
  var t = e && e.itemStyle;
  if (t)
    for (var r = 0; r < Gu.length; r++) {
      var n = Gu[r][1],
        i = Gu[r][0];
      t[n] != null && (t[i] = t[n]);
    }
}
function gp(e) {
  e && e.alignTo === "edge" && e.margin != null && e.edgeDistance == null && (e.edgeDistance = e.margin);
}
function mp(e) {
  e && e.downplay && !e.blur && (e.blur = e.downplay);
}
function qD(e) {
  e &&
    e.focusNodeAdjacency != null &&
    ((e.emphasis = e.emphasis || {}), e.emphasis.focus == null && (e.emphasis.focus = "adjacency"));
}
function O0(e, t) {
  if (e) for (var r = 0; r < e.length; r++) (t(e[r]), e[r] && O0(e[r].children, t));
}
function k0(e, t) {
  (WD(e, t),
    (e.series = jt(e.series)),
    I(e.series, function (r) {
      if (Z(r)) {
        var n = r.type;
        if (n === "line") r.clipOverflow != null && (r.clip = r.clipOverflow);
        else if (n === "pie" || n === "gauge") {
          (r.clockWise != null && (r.clockwise = r.clockWise), gp(r.label));
          var i = r.data;
          if (i && !oe(i)) for (var a = 0; a < i.length; a++) gp(i[a]);
          r.hoverOffset != null &&
            ((r.emphasis = r.emphasis || {}), (r.emphasis.scaleSize = null) && (r.emphasis.scaleSize = r.hoverOffset));
        } else if (n === "gauge") {
          var o = YD(r, "pointer.color");
          o != null && XD(r, "itemStyle.color", o);
        } else if (n === "bar") {
          ($i(r), $i(r.backgroundStyle), $i(r.emphasis));
          var i = r.data;
          if (i && !oe(i))
            for (var a = 0; a < i.length; a++) typeof i[a] == "object" && ($i(i[a]), $i(i[a] && i[a].emphasis));
        } else if (n === "sunburst") {
          var s = r.highlightPolicy;
          (s && ((r.emphasis = r.emphasis || {}), r.emphasis.focus || (r.emphasis.focus = s)), mp(r), O0(r.data, mp));
        } else
          n === "graph" || n === "sankey"
            ? qD(r)
            : n === "map" && (r.mapType && !r.map && (r.map = r.mapType), r.mapLocation && mt(r, r.mapLocation));
        (r.hoverAnimation != null &&
          ((r.emphasis = r.emphasis || {}),
          r.emphasis && r.emphasis.scale == null && (r.emphasis.scale = r.hoverAnimation)),
          pp(r));
      }
    }),
    e.dataRange && (e.visualMap = e.dataRange),
    I(ZD, function (r) {
      var n = e[r];
      n &&
        (U(n) || (n = [n]),
        I(n, function (i) {
          pp(i);
        }));
    }));
}
var KD = lc(QD);
function QD(e) {
  var t = Q();
  (e.eachSeries(function (r) {
    var n = r.get("stack");
    if (n) {
      var i = t.get(n) || t.set(n, []),
        a = r.getData(),
        o = {
          stackResultDimension: a.getCalculationInfo("stackResultDimension"),
          stackedOverDimension: a.getCalculationInfo("stackedOverDimension"),
          stackedDimension: a.getCalculationInfo("stackedDimension"),
          stackedByDimension: a.getCalculationInfo("stackedByDimension"),
          isStackedByIndex: a.getCalculationInfo("isStackedByIndex"),
          data: a,
          seriesModel: r,
        };
      if (!o.stackedDimension || !(o.isStackedByIndex || o.stackedByDimension)) return;
      i.push(o);
    }
  }),
    t.each(function (r) {
      if (r.length !== 0) {
        var n = r[0].seriesModel,
          i = n.get("stackOrder") || "seriesAsc";
        (i === "seriesDesc" && r.reverse(),
          I(r, function (a, o) {
            a.data.setCalculationInfo("stackedOnSeries", o > 0 ? r[o - 1].seriesModel : null);
          }),
          jD(r));
      }
    }));
}
function jD(e) {
  I(e, function (t, r) {
    var n = [],
      i = [NaN, NaN],
      a = [t.stackResultDimension, t.stackedOverDimension],
      o = t.data,
      s = t.isStackedByIndex,
      l = t.seriesModel.get("stackStrategy") || "samesign";
    o.modify(a, function (u, f, h) {
      var c = o.get(t.stackedDimension, h);
      if (isNaN(c)) return i;
      var v, d;
      s ? (d = o.getRawIndex(h)) : (v = o.get(t.stackedByDimension, h));
      for (var p = NaN, m = r - 1; m >= 0; m--) {
        var g = e[m];
        if ((s || (d = g.data.rawIndexOf(g.stackedByDimension, v)), d >= 0)) {
          var y = g.data.getByRawIndex(g.stackResultDimension, d);
          if (
            l === "all" ||
            (l === "positive" && y > 0) ||
            (l === "negative" && y < 0) ||
            (l === "samesign" && c >= 0 && y > 0) ||
            (l === "samesign" && c <= 0 && y < 0)
          ) {
            ((c = zw(c, y)), (p = y));
            break;
          }
        }
      }
      return ((n[0] = c), (n[1] = p), n);
    });
  });
}
var El = (function () {
  function e(t) {
    ((this.data = t.data || (t.sourceFormat === ir ? {} : [])),
      (this.sourceFormat = t.sourceFormat || Ry),
      (this.seriesLayoutBy = t.seriesLayoutBy || Je),
      (this.startIndex = t.startIndex || 0),
      (this.dimensionsDetectedCount = t.dimensionsDetectedCount),
      (this.metaRawOption = t.metaRawOption));
    var r = (this.dimensionsDefine = t.dimensionsDefine);
    if (r)
      for (var n = 0; n < r.length; n++) {
        var i = r[n];
        i.type == null && R0(this, n) === le.Must && (i.type = "ordinal");
      }
  }
  return e;
})();
function Wc(e) {
  return e instanceof El;
}
function uh(e, t, r) {
  r = r || N0(e);
  var n = t.seriesLayoutBy,
    i = tA(e, r, n, t.sourceHeader, t.dimensions),
    a = new El({
      data: e,
      sourceFormat: r,
      seriesLayoutBy: n,
      dimensionsDefine: i.dimensionsDefine,
      startIndex: i.startIndex,
      dimensionsDetectedCount: i.dimensionsDetectedCount,
      metaRawOption: ot(t),
    });
  return a;
}
function B0(e) {
  return new El({ data: e, sourceFormat: oe(e) ? kr : ce });
}
function JD(e) {
  return new El({
    data: e.data,
    sourceFormat: e.sourceFormat,
    seriesLayoutBy: e.seriesLayoutBy,
    dimensionsDefine: ot(e.dimensionsDefine),
    startIndex: e.startIndex,
    dimensionsDetectedCount: e.dimensionsDetectedCount,
  });
}
function N0(e) {
  var t = Ry;
  if (oe(e)) t = kr;
  else if (U(e)) {
    e.length === 0 && (t = Yt);
    for (var r = 0, n = e.length; r < n; r++) {
      var i = e[r];
      if (i != null) {
        if (U(i) || oe(i)) {
          t = Yt;
          break;
        } else if (Z(i)) {
          t = Be;
          break;
        }
      }
    }
  } else if (Z(e)) {
    for (var a in e)
      if (Qt(e, a) && ae(e[a])) {
        t = ir;
        break;
      }
  }
  return t;
}
function tA(e, t, r, n, i) {
  var a, o;
  if (!e) return { dimensionsDefine: yp(i), startIndex: o, dimensionsDetectedCount: a };
  if (t === Yt) {
    var s = e;
    (n === "auto" || n == null
      ? _p(
          function (u) {
            u != null && u !== "-" && (Y(u) ? o == null && (o = 1) : (o = 0));
          },
          r,
          s,
          10,
        )
      : (o = wt(n) ? n : n ? 1 : 0),
      !i &&
        o === 1 &&
        ((i = []),
        _p(
          function (u, f) {
            i[f] = u != null ? u + "" : "";
          },
          r,
          s,
          1 / 0,
        )),
      (a = i ? i.length : r === Bn ? s.length : s[0] ? s[0].length : null));
  } else if (t === Be) i || (i = eA(e));
  else if (t === ir)
    i ||
      ((i = []),
      I(e, function (u, f) {
        i.push(f);
      }));
  else if (t === ce) {
    var l = qa(e[0]);
    a = (U(l) && l.length) || 1;
  }
  return { startIndex: o, dimensionsDefine: yp(i), dimensionsDetectedCount: a };
}
function eA(e) {
  for (var t = 0, r; t < e.length && !(r = e[t++]); );
  if (r) return xt(r);
}
function yp(e) {
  if (e) {
    var t = Q();
    return j(e, function (r, n) {
      r = Z(r) ? r : { name: r };
      var i = { name: r.name, displayName: r.displayName, type: r.type };
      if (i.name == null) return i;
      ((i.name += ""), i.displayName == null && (i.displayName = i.name));
      var a = t.get(i.name);
      return (a ? (i.name += "-" + a.count++) : t.set(i.name, { count: 1 }), i);
    });
  }
}
function _p(e, t, r, n) {
  if (t === Bn) for (var i = 0; i < r.length && i < n; i++) e(r[i] ? r[i][0] : null, i);
  else for (var a = r[0] || [], i = 0; i < a.length && i < n; i++) e(a[i], i);
}
function F0(e) {
  var t = e.sourceFormat;
  return t === Be || t === ir;
}
var vn,
  dn,
  pn,
  gn,
  Sp,
  bp,
  z0 = (function () {
    function e(t, r) {
      var n = Wc(t) ? t : B0(t);
      this._source = n;
      var i = (this._data = n.data),
        a = n.sourceFormat;
      (n.seriesLayoutBy, a === kr && ((this._offset = 0), (this._dimSize = r), (this._data = i)), bp(this, i, n));
    }
    return (
      (e.prototype.getSource = function () {
        return this._source;
      }),
      (e.prototype.count = function () {
        return 0;
      }),
      (e.prototype.getItem = function (t, r) {}),
      (e.prototype.appendData = function (t) {}),
      (e.prototype.clean = function () {}),
      (e.protoInitialize = (function () {
        var t = e.prototype;
        ((t.pure = !1), (t.persistent = !0));
      })()),
      (e.internalField = (function () {
        var t;
        bp = function (o, s, l) {
          var u = l.sourceFormat,
            f = l.seriesLayoutBy,
            h = l.startIndex,
            c = l.dimensionsDefine,
            v = Sp[Yc(u, f)];
          if ((N(o, v), u === kr)) ((o.getItem = r), (o.count = i), (o.fillStorage = n));
          else {
            var d = H0(u, f);
            o.getItem = Tt(d, null, s, h, c);
            var p = V0(u, f);
            o.count = Tt(p, null, s, h, c);
          }
        };
        var r = function (o, s) {
            ((o = o - this._offset), (s = s || []));
            for (var l = this._data, u = this._dimSize, f = u * o, h = 0; h < u; h++) s[h] = l[f + h];
            return s;
          },
          n = function (o, s, l, u) {
            for (var f = this._data, h = this._dimSize, c = 0; c < h; c++) {
              for (
                var v = u[c],
                  d = v[0] == null ? 1 / 0 : v[0],
                  p = v[1] == null ? -1 / 0 : v[1],
                  m = s - o,
                  g = l[c],
                  y = 0;
                y < m;
                y++
              ) {
                var _ = f[y * h + c];
                ((g[o + y] = _), _ < d && (d = _), _ > p && (p = _));
              }
              ((v[0] = d), (v[1] = p));
            }
          },
          i = function () {
            return this._data ? this._data.length / this._dimSize : 0;
          };
        Sp =
          ((t = {}),
          (t[Yt + "_" + Je] = { pure: !0, appendData: a }),
          (t[Yt + "_" + Bn] = {
            pure: !0,
            appendData: function () {
              throw new Error('Do not support appendData when set seriesLayoutBy: "row".');
            },
          }),
          (t[Be] = { pure: !0, appendData: a }),
          (t[ir] = {
            pure: !0,
            appendData: function (o) {
              var s = this._data;
              I(o, function (l, u) {
                for (var f = s[u] || (s[u] = []), h = 0; h < (l || []).length; h++) f.push(l[h]);
              });
            },
          }),
          (t[ce] = { appendData: a }),
          (t[kr] = {
            persistent: !1,
            pure: !0,
            appendData: function (o) {
              this._data = o;
            },
            clean: function () {
              ((this._offset += this.count()), (this._data = null));
            },
          }),
          t);
        function a(o) {
          for (var s = 0; s < o.length; s++) this._data.push(o[s]);
        }
      })()),
      e
    );
  })(),
  Io = function (e) {
    U(e) || cy("series.data or dataset.source must be an array.");
  };
((vn = {}),
  (vn[Yt + "_" + Je] = Io),
  (vn[Yt + "_" + Bn] = Io),
  (vn[Be] = Io),
  (vn[ir] = function (e, t) {
    for (var r = 0; r < t.length; r++) {
      var n = t[r].name;
      n == null && cy("dimension name must not be null/undefined.");
    }
  }),
  (vn[ce] = Io));
var wp = function (e, t, r, n) {
    return e[n];
  },
  rA =
    ((dn = {}),
    (dn[Yt + "_" + Je] = function (e, t, r, n) {
      return e[n + t];
    }),
    (dn[Yt + "_" + Bn] = function (e, t, r, n, i) {
      n += t;
      for (var a = i || [], o = e, s = 0; s < o.length; s++) {
        var l = o[s];
        a[s] = l ? l[n] : null;
      }
      return a;
    }),
    (dn[Be] = wp),
    (dn[ir] = function (e, t, r, n, i) {
      for (var a = i || [], o = 0; o < r.length; o++) {
        var s = r[o].name,
          l = s != null ? e[s] : null;
        a[o] = l ? l[n] : null;
      }
      return a;
    }),
    (dn[ce] = wp),
    dn);
function H0(e, t) {
  var r = rA[Yc(e, t)];
  return r;
}
var Tp = function (e, t, r) {
    return e.length;
  },
  nA =
    ((pn = {}),
    (pn[Yt + "_" + Je] = function (e, t, r) {
      return Math.max(0, e.length - t);
    }),
    (pn[Yt + "_" + Bn] = function (e, t, r) {
      var n = e[0];
      return n ? Math.max(0, n.length - t) : 0;
    }),
    (pn[Be] = Tp),
    (pn[ir] = function (e, t, r) {
      var n = r[0].name,
        i = n != null ? e[n] : null;
      return i ? i.length : 0;
    }),
    (pn[ce] = Tp),
    pn);
function V0(e, t) {
  var r = nA[Yc(e, t)];
  return r;
}
var Uu = function (e, t, r) {
    return e[t];
  },
  iA =
    ((gn = {}),
    (gn[Yt] = Uu),
    (gn[Be] = function (e, t, r) {
      return e[r];
    }),
    (gn[ir] = Uu),
    (gn[ce] = function (e, t, r) {
      var n = qa(e);
      return n instanceof Array ? n[t] : n;
    }),
    (gn[kr] = Uu),
    gn);
function G0(e) {
  var t = iA[e];
  return t;
}
function Yc(e, t) {
  return e === Yt ? e + "_" + t : e;
}
function wi(e, t, r) {
  if (e) {
    var n = e.getRawDataItem(t);
    if (n != null) {
      var i = e.getStore(),
        a = i.getSource().sourceFormat;
      if (r != null) {
        var o = e.getDimensionIndex(r),
          s = i.getDimensionProperty(o);
        return G0(a)(n, o, s);
      } else {
        var l = n;
        return (a === ce && (l = qa(n)), l);
      }
    }
  }
}
var aA = /\{@(.+?)\}/g,
  oA = (function () {
    function e() {}
    return (
      (e.prototype.getDataParams = function (t, r) {
        var n = this.getData(r),
          i = this.getRawValue(t, r),
          a = n.getRawIndex(t),
          o = n.getName(t),
          s = n.getRawDataItem(t),
          l = n.getItemVisual(t, "style"),
          u = l && l[n.getItemVisual(t, "drawType") || "fill"],
          f = l && l.stroke,
          h = this.mainType,
          c = h === "series",
          v = n.userOutput && n.userOutput.get();
        return {
          componentType: h,
          componentSubType: this.subType,
          componentIndex: this.componentIndex,
          seriesType: c ? this.subType : null,
          seriesIndex: this.seriesIndex,
          seriesId: c ? this.id : null,
          seriesName: c ? this.name : null,
          name: o,
          dataIndex: a,
          data: s,
          dataType: r,
          value: i,
          color: u,
          borderColor: f,
          dimensionNames: v ? v.fullDimensions : null,
          encode: v ? v.encode : null,
          $vars: ["seriesName", "name", "value"],
        };
      }),
      (e.prototype.getFormattedLabel = function (t, r, n, i, a, o) {
        r = r || "normal";
        var s = this.getData(n),
          l = this.getDataParams(t, n);
        if ((o && (l.value = o.interpolatedValue), i != null && U(l.value) && (l.value = l.value[i]), !a)) {
          var u = s.getItemModel(t);
          a = u.get(r === "normal" ? ["label", "formatter"] : [r, "label", "formatter"]);
        }
        if (et(a)) return ((l.status = r), (l.dimensionIndex = i), a(l));
        if (Y(a)) {
          var f = D0(a, l);
          return f.replace(aA, function (h, c) {
            var v = c.length,
              d = c;
            d.charAt(0) === "[" && d.charAt(v - 1) === "]" && (d = +d.slice(1, v - 1));
            var p = wi(s, t, d);
            if (o && U(o.interpolatedValue)) {
              var m = s.getDimensionIndex(d);
              m >= 0 && (p = o.interpolatedValue[m]);
            }
            return p != null ? p + "" : "";
          });
        }
      }),
      (e.prototype.getRawValue = function (t, r) {
        return wi(this.getData(r), t);
      }),
      (e.prototype.formatTooltip = function (t, r, n) {}),
      e
    );
  })();
function xp(e) {
  var t, r;
  return (Z(e) ? e.type && (r = e) : (t = e), { text: t, frag: r });
}
function wa(e) {
  return new sA(e);
}
var sA = (function () {
    function e(t) {
      ((t = t || {}),
        (this._reset = t.reset),
        (this._plan = t.plan),
        (this._count = t.count),
        (this._onDirty = t.onDirty),
        (this._dirty = !0));
    }
    return (
      (e.prototype.perform = function (t) {
        var r = this._upstream,
          n = t && t.skip;
        if (this._dirty && r) {
          var i = this.context;
          i.data = i.outputData = r.context.outputData;
        }
        this.__pipeline && (this.__pipeline.currentTask = this);
        var a;
        this._plan && !n && (a = this._plan(this.context));
        var o = f(this._modBy),
          s = this._modDataCount || 0,
          l = f(t && t.modBy),
          u = (t && t.modDataCount) || 0;
        (o !== l || s !== u) && (a = "reset");
        function f(y) {
          return (!(y >= 1) && (y = 1), y);
        }
        var h;
        ((this._dirty || a === "reset") && ((this._dirty = !1), (h = this._doReset(n))),
          (this._modBy = l),
          (this._modDataCount = u));
        var c = t && t.step;
        if (
          (r ? (this._dueEnd = r._outputDueEnd) : (this._dueEnd = this._count ? this._count(this.context) : 1 / 0),
          this._progress)
        ) {
          var v = this._dueIndex,
            d = Math.min(c != null ? this._dueIndex + c : 1 / 0, this._dueEnd);
          if (!n && (h || v < d)) {
            var p = this._progress;
            if (U(p)) for (var m = 0; m < p.length; m++) this._doProgress(p[m], v, d, l, u);
            else this._doProgress(p, v, d, l, u);
          }
          this._dueIndex = d;
          var g = this._settedOutputEnd != null ? this._settedOutputEnd : d;
          this._outputDueEnd = g;
        } else
          this._dueIndex = this._outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : this._dueEnd;
        return this.unfinished();
      }),
      (e.prototype.dirty = function () {
        ((this._dirty = !0), this._onDirty && this._onDirty(this.context));
      }),
      (e.prototype._doProgress = function (t, r, n, i, a) {
        (Cp.reset(r, n, i, a),
          (this._callingProgress = t),
          this._callingProgress({ start: r, end: n, count: n - r, next: Cp.next }, this.context));
      }),
      (e.prototype._doReset = function (t) {
        ((this._dueIndex = this._outputDueEnd = this._dueEnd = 0), (this._settedOutputEnd = null));
        var r, n;
        (!t &&
          this._reset &&
          ((r = this._reset(this.context)),
          r && r.progress && ((n = r.forceFirstProgress), (r = r.progress)),
          U(r) && !r.length && (r = null)),
          (this._progress = r),
          (this._modBy = this._modDataCount = null));
        var i = this._downstream;
        return (i && i.dirty(), n);
      }),
      (e.prototype.unfinished = function () {
        return this._progress && this._dueIndex < this._dueEnd;
      }),
      (e.prototype.pipe = function (t) {
        (this._downstream !== t || this._dirty) && ((this._downstream = t), (t._upstream = this), t.dirty());
      }),
      (e.prototype.dispose = function () {
        this._disposed ||
          (this._upstream && (this._upstream._downstream = null),
          this._downstream && (this._downstream._upstream = null),
          (this._dirty = !1),
          (this._disposed = !0));
      }),
      (e.prototype.getUpstream = function () {
        return this._upstream;
      }),
      (e.prototype.getDownstream = function () {
        return this._downstream;
      }),
      (e.prototype.setOutputEnd = function (t) {
        this._outputDueEnd = this._settedOutputEnd = t;
      }),
      e
    );
  })(),
  Cp = (function () {
    var e,
      t,
      r,
      n,
      i,
      a = {
        reset: function (l, u, f, h) {
          ((t = l), (e = u), (r = f), (n = h), (i = Math.ceil(n / r)), (a.next = r > 1 && n > 0 ? s : o));
        },
      };
    return a;
    function o() {
      return t < e ? t++ : null;
    }
    function s() {
      var l = (t % i) * r + Math.ceil(t / i),
        u = t >= e ? null : l < n ? l : t;
      return (t++, u);
    }
  })();
function ys(e, t) {
  var r = t && t.type;
  return r === "ordinal"
    ? e
    : (r === "time" && !wt(e) && e != null && e !== "-" && (e = +Pi(e)), e == null || e === "" ? NaN : Number(e));
}
Q({
  number: function (e) {
    return parseFloat(e);
  },
  time: function (e) {
    return +Pi(e);
  },
  trim: function (e) {
    return Y(e) ? Xe(e) : e;
  },
});
var lA = (function () {
  function e(t, r) {
    var n = t === "desc";
    ((this._resultLT = n ? 1 : -1),
      r == null && (r = n ? "min" : "max"),
      (this._incomparable = r === "min" ? -1 / 0 : 1 / 0));
  }
  return (
    (e.prototype.evaluate = function (t, r) {
      var n = wt(t) ? t : Os(t),
        i = wt(r) ? r : Os(r),
        a = isNaN(n),
        o = isNaN(i);
      if ((a && (n = this._incomparable), o && (i = this._incomparable), a && o)) {
        var s = Y(t),
          l = Y(r);
        (s && (n = l ? t : 0), l && (i = s ? r : 0));
      }
      return n < i ? this._resultLT : n > i ? -this._resultLT : 0;
    }),
    e
  );
})();
function U0(e) {
  var t = "",
    r = -1 / 0,
    n = -1 / 0,
    i = 1 / 0,
    a = 1 / 0;
  return (
    e &&
      (e.g != null && ((t += "G" + e.g), (r = e.g)),
      e.ge != null && ((t += "GE" + e.ge), (n = e.ge)),
      e.l != null && ((t += "L" + e.l), (i = e.l)),
      e.le != null && ((t += "LE" + e.le), (a = e.le))),
    { key: t, g: r, ge: n, l: i, le: a }
  );
}
function W0(e, t) {
  return t > e.g && t >= e.ge && t < e.l && t <= e.le;
}
var uA = (function () {
  function e() {}
  return (
    (e.prototype.getRawData = function () {
      throw new Error("not supported");
    }),
    (e.prototype.getRawDataItem = function (t) {
      throw new Error("not supported");
    }),
    (e.prototype.cloneRawData = function () {}),
    (e.prototype.getDimensionInfo = function (t) {}),
    (e.prototype.cloneAllDimensionInfo = function () {}),
    (e.prototype.count = function () {}),
    (e.prototype.retrieveValue = function (t, r) {}),
    (e.prototype.retrieveValueFromItem = function (t, r) {}),
    (e.prototype.convertValue = function (t, r) {
      return ys(t, r);
    }),
    e
  );
})();
function fA(e, t) {
  var r = new uA(),
    n = e.data,
    i = (r.sourceFormat = e.sourceFormat),
    a = e.startIndex,
    o = "";
  e.seriesLayoutBy !== Je && ne(o);
  var s = [],
    l = {},
    u = e.dimensionsDefine;
  if (u)
    I(u, function (p, m) {
      var g = p.name,
        y = { index: m, name: g, displayName: p.displayName };
      if ((s.push(y), g != null)) {
        var _ = "";
        (Qt(l, g) && ne(_), (l[g] = y));
      }
    });
  else for (var f = 0; f < e.dimensionsDetectedCount; f++) s.push({ index: f });
  var h = H0(i, Je);
  (t.__isBuiltIn &&
    ((r.getRawDataItem = function (p) {
      return h(n, a, s, p);
    }),
    (r.getRawData = Tt(hA, null, e))),
    (r.cloneRawData = Tt(cA, null, e)));
  var c = V0(i, Je);
  r.count = Tt(c, null, n, a, s);
  var v = G0(i);
  r.retrieveValue = function (p, m) {
    var g = h(n, a, s, p);
    return d(g, m);
  };
  var d = (r.retrieveValueFromItem = function (p, m) {
    if (p != null) {
      var g = s[m];
      if (g) return v(p, m, g.name);
    }
  });
  return ((r.getDimensionInfo = Tt(vA, null, s, l)), (r.cloneAllDimensionInfo = Tt(dA, null, s)), r);
}
function hA(e) {
  var t = e.sourceFormat;
  if (!Xc(t)) {
    var r = "";
    ne(r);
  }
  return e.data;
}
function cA(e) {
  var t = e.sourceFormat,
    r = e.data;
  if (!Xc(t)) {
    var n = "";
    ne(n);
  }
  if (t === Yt) {
    for (var i = [], a = 0, o = r.length; a < o; a++) i.push(r[a].slice());
    return i;
  } else if (t === Be) {
    for (var i = [], a = 0, o = r.length; a < o; a++) i.push(N({}, r[a]));
    return i;
  }
}
function vA(e, t, r) {
  if (r != null) {
    if (wt(r) || (!isNaN(r) && !Qt(t, r))) return e[r];
    if (Qt(t, r)) return t[r];
  }
}
function dA(e) {
  return ot(e);
}
var Y0 = Q();
function pA(e) {
  e = ot(e);
  var t = e.type,
    r = "";
  t || ne(r);
  var n = t.split(":");
  n.length !== 2 && ne(r);
  var i = !1;
  (n[0] === "echarts" && ((t = n[1]), (i = !0)), (e.__isBuiltIn = i), Y0.set(t, e));
}
function gA(e, t, r) {
  var n = jt(e),
    i = n.length,
    a = "";
  i || ne(a);
  for (var o = 0, s = i; o < s; o++) {
    var l = n[o];
    ((t = mA(l, t)), o !== s - 1 && (t.length = Math.max(t.length, 1)));
  }
  return t;
}
function mA(e, t, r, n) {
  var i = "";
  (t.length || ne(i), Z(e) || ne(i));
  var a = e.type,
    o = Y0.get(a);
  o || ne(i);
  var s = j(t, function (u) {
      return fA(u, o);
    }),
    l = jt(o.transform({ upstream: s[0], upstreamList: s, config: ot(e.config) }));
  return j(l, function (u, f) {
    var h = "";
    (Z(u) || ne(h), u.data || ne(h));
    var c = N0(u.data);
    Xc(c) || ne(h);
    var v,
      d = t[0];
    if (d && f === 0 && !u.dimensions) {
      var p = d.startIndex;
      (p && (u.data = d.data.slice(0, p).concat(u.data)),
        (v = { seriesLayoutBy: Je, sourceHeader: p, dimensions: d.metaRawOption.dimensions }));
    } else v = { seriesLayoutBy: Je, sourceHeader: 0, dimensions: u.dimensions };
    return uh(u.data, v, null);
  });
}
function Xc(e) {
  return e === Yt || e === Be;
}
var yA = typeof Uint32Array === Ei ? Array : Uint32Array,
  _A = typeof Uint16Array === Ei ? Array : Uint16Array,
  X0 = typeof Int32Array === Ei ? Array : Int32Array,
  Dp = typeof Float64Array === Ei ? Array : Float64Array,
  $0 = { float: Dp, int: X0, ordinal: Array, number: Array, time: Dp },
  Wu;
function Zn(e) {
  return e > 65535 ? yA : _A;
}
function SA(e) {
  var t = e.constructor;
  return t === Array ? e.slice() : new t(e);
}
function Ap(e, t, r, n, i) {
  var a = $0[r || "float"];
  if (i) {
    var o = e[t],
      s = o && o.length;
    if (s !== n) {
      for (var l = new a(n), u = 0; u < s; u++) l[u] = o[u];
      e[t] = l;
    }
  } else e[t] = new a(n);
}
var fh = (function () {
    function e() {
      ((this._chunks = []),
        (this._rawExtent = []),
        (this._extent = []),
        (this._count = 0),
        (this._rawCount = 0),
        (this._calcDimNameToIdx = Q()));
    }
    return (
      (e.prototype.initData = function (t, r, n) {
        ((this._provider = t),
          (this._chunks = []),
          (this._indices = null),
          (this.getRawIndex = this._getRawIdxIdentity));
        var i = t.getSource(),
          a = (this.defaultDimValueGetter = Wu[i.sourceFormat]);
        ((this._dimValueGetter = n || a),
          (this._rawExtent = []),
          F0(i),
          (this._dimensions = j(r, function (o) {
            return { type: o.type, property: o.property };
          })),
          this._initDataFromProvider(0, t.count()));
      }),
      (e.prototype.getProvider = function () {
        return this._provider;
      }),
      (e.prototype.getSource = function () {
        return this._provider.getSource();
      }),
      (e.prototype.ensureCalculationDimension = function (t, r) {
        var n = this._calcDimNameToIdx,
          i = this._dimensions,
          a = n.get(t);
        if (a != null) {
          if (i[a].type === r) return a;
        } else a = i.length;
        return (
          (i[a] = { type: r }),
          n.set(t, a),
          (this._chunks[a] = new $0[r || "float"](this._rawCount)),
          (this._rawExtent[a] = be()),
          a
        );
      }),
      (e.prototype.collectOrdinalMeta = function (t, r) {
        var n = this._chunks[t],
          i = this._dimensions[t],
          a = this._rawExtent,
          o = i.ordinalOffset || 0,
          s = n.length;
        o === 0 && (a[t] = be());
        for (var l = a[t], u = o; u < s; u++) {
          var f = (n[u] = r.parseAndCollect(n[u]));
          isNaN(f) || ((l[0] = Math.min(f, l[0])), (l[1] = Math.max(f, l[1])));
        }
        ((i.ordinalMeta = r), (i.ordinalOffset = s), (i.type = "ordinal"));
      }),
      (e.prototype.getOrdinalMeta = function (t) {
        var r = this._dimensions[t],
          n = r.ordinalMeta;
        return n;
      }),
      (e.prototype.getDimensionProperty = function (t) {
        var r = this._dimensions[t];
        return r && r.property;
      }),
      (e.prototype.appendData = function (t) {
        var r = this._provider,
          n = this.count();
        r.appendData(t);
        var i = r.count();
        return (r.persistent || (i += n), n < i && this._initDataFromProvider(n, i, !0), [n, i]);
      }),
      (e.prototype.appendValues = function (t, r) {
        for (
          var n = this._chunks,
            i = this._dimensions,
            a = i.length,
            o = this._rawExtent,
            s = this.count(),
            l = s + Math.max(t.length, r || 0),
            u = 0;
          u < a;
          u++
        ) {
          var f = i[u];
          Ap(n, u, f.type, l, !0);
        }
        for (var h = [], c = s; c < l; c++)
          for (var v = c - s, d = 0; d < a; d++) {
            var f = i[d],
              p = Wu.arrayRows.call(this, t[v] || h, f.property, v, d);
            n[d][c] = p;
            var m = o[d];
            (p < m[0] && (m[0] = p), p > m[1] && (m[1] = p));
          }
        return ((this._rawCount = this._count = l), { start: s, end: l });
      }),
      (e.prototype._initDataFromProvider = function (t, r, n) {
        for (
          var i = this._provider,
            a = this._chunks,
            o = this._dimensions,
            s = o.length,
            l = this._rawExtent,
            u = j(o, function (y) {
              return y.property;
            }),
            f = 0;
          f < s;
          f++
        ) {
          var h = o[f];
          (l[f] || (l[f] = be()), Ap(a, f, h.type, r, n));
        }
        if (i.fillStorage) i.fillStorage(t, r, a, l);
        else
          for (var c = [], v = t; v < r; v++) {
            c = i.getItem(v, c);
            for (var d = 0; d < s; d++) {
              var p = a[d],
                m = this._dimValueGetter(c, u[d], v, d);
              p[v] = m;
              var g = l[d];
              (m < g[0] && (g[0] = m), m > g[1] && (g[1] = m));
            }
          }
        (!i.persistent && i.clean && i.clean(), (this._rawCount = this._count = r), (this._extent = []));
      }),
      (e.prototype.count = function () {
        return this._count;
      }),
      (e.prototype.get = function (t, r) {
        if (!(r >= 0 && r < this._count)) return NaN;
        var n = this._chunks[t];
        return n ? n[this.getRawIndex(r)] : NaN;
      }),
      (e.prototype.getValues = function (t, r) {
        var n = [],
          i = [];
        if (r == null) {
          ((r = t), (t = []));
          for (var a = 0; a < this._dimensions.length; a++) i.push(a);
        } else i = t;
        for (var a = 0, o = i.length; a < o; a++) n.push(this.get(i[a], r));
        return n;
      }),
      (e.prototype.getByRawIndex = function (t, r) {
        if (!(r >= 0 && r < this._rawCount)) return NaN;
        var n = this._chunks[t];
        return n ? n[r] : NaN;
      }),
      (e.prototype.getSum = function (t) {
        var r = this._chunks[t],
          n = 0;
        if (r)
          for (var i = 0, a = this.count(); i < a; i++) {
            var o = this.get(t, i);
            isNaN(o) || (n += o);
          }
        return n;
      }),
      (e.prototype.getMedian = function (t) {
        var r = [];
        (this.each([t], function (i) {
          isNaN(i) || r.push(i);
        }),
          ec(r));
        var n = this.count();
        return n === 0 ? 0 : n % 2 === 1 ? r[(n - 1) / 2] : (r[n / 2] + r[n / 2 - 1]) / 2;
      }),
      (e.prototype.indexOfRawIndex = function (t) {
        if (t >= this._rawCount || t < 0) return -1;
        if (!this._indices) return t;
        var r = this._indices,
          n = r[t];
        if (n != null && n < this._count && n === t) return t;
        for (var i = 0, a = this._count - 1; i <= a; ) {
          var o = ((i + a) / 2) | 0;
          if (r[o] < t) i = o + 1;
          else if (r[o] > t) a = o - 1;
          else return o;
        }
        return -1;
      }),
      (e.prototype.getIndices = function () {
        var t,
          r = this._indices;
        if (r) {
          var n = r.constructor,
            i = this._count;
          if (n === Array) {
            t = new n(i);
            for (var a = 0; a < i; a++) t[a] = r[a];
          } else t = new n(r.buffer, 0, i);
        } else {
          var n = Zn(this._rawCount);
          t = new n(this.count());
          for (var a = 0; a < t.length; a++) t[a] = a;
        }
        return t;
      }),
      (e.prototype.filter = function (t, r) {
        if (!this._count) return this;
        for (
          var n = this.clone(),
            i = n.count(),
            a = Zn(n._rawCount),
            o = new a(i),
            s = [],
            l = t.length,
            u = 0,
            f = t[0],
            h = n._chunks,
            c = 0;
          c < i;
          c++
        ) {
          var v = void 0,
            d = n.getRawIndex(c);
          if (l === 0) v = r(c);
          else if (l === 1) {
            var p = h[f][d];
            v = r(p, c);
          } else {
            for (var m = 0; m < l; m++) s[m] = h[t[m]][d];
            ((s[m] = c), (v = r.apply(null, s)));
          }
          v && (o[u++] = d);
        }
        return (u < i && (n._indices = o), (n._count = u), (n._extent = []), n._updateGetRawIdx(), n);
      }),
      (e.prototype.selectRange = function (t) {
        var r = this.clone(),
          n = r._count;
        if (!n) return this;
        var i = xt(t),
          a = i.length;
        if (!a) return this;
        var o = r.count(),
          s = Zn(r._rawCount),
          l = new s(o),
          u = 0,
          f = i[0],
          h = t[f][0],
          c = t[f][1],
          v = r._chunks,
          d = !1;
        if (!r._indices) {
          var p = 0;
          if (a === 1) {
            for (var m = v[i[0]], g = 0; g < n; g++) {
              var y = m[g];
              (((y >= h && y <= c) || isNaN(y)) && (l[u++] = p), p++);
            }
            d = !0;
          } else if (a === 2) {
            for (var m = v[i[0]], _ = v[i[1]], S = t[i[1]][0], b = t[i[1]][1], g = 0; g < n; g++) {
              var y = m[g],
                w = _[g];
              (((y >= h && y <= c) || isNaN(y)) && ((w >= S && w <= b) || isNaN(w)) && (l[u++] = p), p++);
            }
            d = !0;
          }
        }
        if (!d)
          if (a === 1)
            for (var g = 0; g < o; g++) {
              var T = r.getRawIndex(g),
                y = v[i[0]][T];
              ((y >= h && y <= c) || isNaN(y)) && (l[u++] = T);
            }
          else
            for (var g = 0; g < o; g++) {
              for (var C = !0, T = r.getRawIndex(g), A = 0; A < a; A++) {
                var M = i[A],
                  y = v[M][T];
                (y < t[M][0] || y > t[M][1]) && (C = !1);
              }
              C && (l[u++] = r.getRawIndex(g));
            }
        return (u < o && (r._indices = l), (r._count = u), (r._extent = []), r._updateGetRawIdx(), r);
      }),
      (e.prototype.map = function (t, r) {
        var n = this.clone(t);
        return (this._updateDims(n, t, r), n);
      }),
      (e.prototype.modify = function (t, r) {
        this._updateDims(this, t, r);
      }),
      (e.prototype._updateDims = function (t, r, n) {
        for (var i = t._chunks, a = [], o = r.length, s = t.count(), l = [], u = t._rawExtent, f = 0; f < r.length; f++)
          u[r[f]] = be();
        for (var h = 0; h < s; h++) {
          for (var c = t.getRawIndex(h), v = 0; v < o; v++) l[v] = i[r[v]][c];
          l[o] = h;
          var d = n && n.apply(null, l);
          if (d != null) {
            typeof d != "object" && ((a[0] = d), (d = a));
            for (var f = 0; f < d.length; f++) {
              var p = r[f],
                m = d[f],
                g = u[p],
                y = i[p];
              (y && (y[c] = m), m < g[0] && (g[0] = m), m > g[1] && (g[1] = m));
            }
          }
        }
      }),
      (e.prototype.lttbDownSample = function (t, r) {
        var n = this.clone([t], !0),
          i = n._chunks,
          a = i[t],
          o = this.count(),
          s = 0,
          l = Math.floor(1 / r),
          u = this.getRawIndex(0),
          f,
          h,
          c,
          v = new (Zn(this._rawCount))(Math.min((Math.ceil(o / l) + 2) * 2, o));
        v[s++] = u;
        for (var d = 1; d < o - 1; d += l) {
          for (var p = Math.min(d + l, o - 1), m = Math.min(d + l * 2, o), g = (m + p) / 2, y = 0, _ = p; _ < m; _++) {
            var S = this.getRawIndex(_),
              b = a[S];
            isNaN(b) || (y += b);
          }
          y /= m - p;
          var w = d,
            T = Math.min(d + l, o),
            C = d - 1,
            A = a[u];
          ((f = -1), (c = w));
          for (var M = -1, D = 0, _ = w; _ < T; _++) {
            var S = this.getRawIndex(_),
              b = a[S];
            if (isNaN(b)) {
              (D++, M < 0 && (M = S));
              continue;
            }
            ((h = Math.abs((C - g) * (b - A) - (C - _) * (y - A))), h > f && ((f = h), (c = S)));
          }
          (D > 0 && D < T - w && ((v[s++] = Math.min(M, c)), (c = Math.max(M, c))), (v[s++] = c), (u = c));
        }
        return (
          (v[s++] = this.getRawIndex(o - 1)),
          (n._count = s),
          (n._indices = v),
          (n.getRawIndex = this._getRawIdx),
          n
        );
      }),
      (e.prototype.minmaxDownSample = function (t, r) {
        for (
          var n = this.clone([t], !0),
            i = n._chunks,
            a = Math.floor(1 / r),
            o = i[t],
            s = this.count(),
            l = new (Zn(this._rawCount))(Math.ceil(s / a) * 2),
            u = 0,
            f = 0;
          f < s;
          f += a
        ) {
          var h = f,
            c = o[this.getRawIndex(h)],
            v = f,
            d = o[this.getRawIndex(v)],
            p = a;
          f + a > s && (p = s - f);
          for (var m = 0; m < p; m++) {
            var g = this.getRawIndex(f + m),
              y = o[g];
            (y < c && ((c = y), (h = f + m)), y > d && ((d = y), (v = f + m)));
          }
          var _ = this.getRawIndex(h),
            S = this.getRawIndex(v);
          h < v ? ((l[u++] = _), (l[u++] = S)) : ((l[u++] = S), (l[u++] = _));
        }
        return ((n._count = u), (n._indices = l), n._updateGetRawIdx(), n);
      }),
      (e.prototype.downSample = function (t, r, n, i) {
        for (
          var a = this.clone([t], !0),
            o = a._chunks,
            s = [],
            l = Math.floor(1 / r),
            u = o[t],
            f = this.count(),
            h = (a._rawExtent[t] = be()),
            c = new (Zn(this._rawCount))(Math.ceil(f / l)),
            v = 0,
            d = 0;
          d < f;
          d += l
        ) {
          l > f - d && ((l = f - d), (s.length = l));
          for (var p = 0; p < l; p++) {
            var m = this.getRawIndex(d + p);
            s[p] = u[m];
          }
          var g = n(s),
            y = this.getRawIndex(Math.min(d + i(s, g) || 0, f - 1));
          ((u[y] = g), g < h[0] && (h[0] = g), g > h[1] && (h[1] = g), (c[v++] = y));
        }
        return ((a._count = v), (a._indices = c), a._updateGetRawIdx(), a);
      }),
      (e.prototype.each = function (t, r) {
        if (this._count)
          for (var n = t.length, i = this._chunks, a = 0, o = this.count(); a < o; a++) {
            var s = this.getRawIndex(a);
            switch (n) {
              case 0:
                r(a);
                break;
              case 1:
                r(i[t[0]][s], a);
                break;
              case 2:
                r(i[t[0]][s], i[t[1]][s], a);
                break;
              default:
                for (var l = 0, u = []; l < n; l++) u[l] = i[t[l]][s];
                ((u[l] = a), r.apply(null, u));
            }
          }
      }),
      (e.prototype.getDataExtent = function (t, r) {
        var n = this._chunks[t],
          i = be();
        if (!n) return i;
        var a = this.count(),
          o = !this._indices && !r;
        if (o) return this._rawExtent[t].slice();
        var s = this._extent,
          l = s[t] || (s[t] = {}),
          u = U0(r),
          f = u.key,
          h = l[f];
        if (h) return h.slice();
        for (var c = i[0], v = i[1], d = 0; d < a; d++) {
          var p = this.getRawIndex(d),
            m = n[p];
          (!r || W0(u, m)) && (m < c && (c = m), m > v && (v = m));
        }
        return (l[f] = [c, v]);
      }),
      (e.prototype.getRawDataItem = function (t) {
        var r = this.getRawIndex(t);
        if (this._provider.persistent) return this._provider.getItem(r);
        for (var n = [], i = this._chunks, a = 0; a < i.length; a++) n.push(i[a][r]);
        return n;
      }),
      (e.prototype.clone = function (t, r) {
        var n = new e(),
          i = this._chunks,
          a =
            t &&
            Mi(
              t,
              function (s, l) {
                return ((s[l] = !0), s);
              },
              {},
            );
        if (a) for (var o = 0; o < i.length; o++) n._chunks[o] = a[o] ? SA(i[o]) : i[o];
        else n._chunks = i;
        return (this._copyCommonProps(n), r || (n._indices = this._cloneIndices()), n._updateGetRawIdx(), n);
      }),
      (e.prototype._copyCommonProps = function (t) {
        ((t._count = this._count),
          (t._rawCount = this._rawCount),
          (t._provider = this._provider),
          (t._dimensions = this._dimensions),
          (t._extent = ot(this._extent)),
          (t._rawExtent = ot(this._rawExtent)));
      }),
      (e.prototype._cloneIndices = function () {
        if (this._indices) {
          var t = this._indices.constructor,
            r = void 0;
          if (t === Array) {
            var n = this._indices.length;
            r = new t(n);
            for (var i = 0; i < n; i++) r[i] = this._indices[i];
          } else r = new t(this._indices);
          return r;
        }
        return null;
      }),
      (e.prototype._getRawIdxIdentity = function (t) {
        return t;
      }),
      (e.prototype._getRawIdx = function (t) {
        return t < this._count && t >= 0 ? this._indices[t] : -1;
      }),
      (e.prototype._updateGetRawIdx = function () {
        this.getRawIndex = this._indices ? this._getRawIdx : this._getRawIdxIdentity;
      }),
      (e.internalField = (function () {
        function t(r, n, i, a) {
          return ys(r[a], this._dimensions[a]);
        }
        Wu = {
          arrayRows: t,
          objectRows: function (r, n, i, a) {
            return ys(r[n], this._dimensions[a]);
          },
          keyedColumns: t,
          original: function (r, n, i, a) {
            var o = r && (r.value == null ? r : r.value);
            return ys(o instanceof Array ? o[a] : o, this._dimensions[a]);
          },
          typedArray: function (r, n, i, a) {
            return r[a];
          },
        };
      })()),
      e
    );
  })(),
  bA = (function () {
    function e(t) {
      ((this._sourceList = []),
        (this._storeList = []),
        (this._upstreamSignList = []),
        (this._versionSignBase = 0),
        (this._dirty = !0),
        (this._sourceHost = t));
    }
    return (
      (e.prototype.dirty = function () {
        (this._setLocalSource([], []), (this._storeList = []), (this._dirty = !0));
      }),
      (e.prototype._setLocalSource = function (t, r) {
        ((this._sourceList = t),
          (this._upstreamSignList = r),
          this._versionSignBase++,
          this._versionSignBase > 9e10 && (this._versionSignBase = 0));
      }),
      (e.prototype._getVersionSign = function () {
        return this._sourceHost.uid + "_" + this._versionSignBase;
      }),
      (e.prototype.prepareSource = function () {
        this._isDirty() && (this._createSource(), (this._dirty = !1));
      }),
      (e.prototype._createSource = function () {
        this._setLocalSource([], []);
        var t = this._sourceHost,
          r = this._getUpstreamSourceManagers(),
          n = !!r.length,
          i,
          a;
        if (Lo(t)) {
          var o = t,
            s = void 0,
            l = void 0,
            u = void 0;
          if (n) {
            var f = r[0];
            (f.prepareSource(), (u = f.getSource()), (s = u.data), (l = u.sourceFormat), (a = [f._getVersionSign()]));
          } else ((s = o.get("data", !0)), (l = oe(s) ? kr : ce), (a = []));
          var h = this._getSourceMetaRawOption() || {},
            c = (u && u.metaRawOption) || {},
            v = q(h.seriesLayoutBy, c.seriesLayoutBy) || null,
            d = q(h.sourceHeader, c.sourceHeader),
            p = q(h.dimensions, c.dimensions),
            m = v !== c.seriesLayoutBy || !!d != !!c.sourceHeader || p;
          i = m ? [uh(s, { seriesLayoutBy: v, sourceHeader: d, dimensions: p }, l)] : [];
        } else {
          var g = t;
          if (n) {
            var y = this._applyTransform(r);
            ((i = y.sourceList), (a = y.upstreamSignList));
          } else {
            var _ = g.get("source", !0);
            ((i = [uh(_, this._getSourceMetaRawOption(), null)]), (a = []));
          }
        }
        this._setLocalSource(i, a);
      }),
      (e.prototype._applyTransform = function (t) {
        var r = this._sourceHost,
          n = r.get("transform", !0),
          i = r.get("fromTransformResult", !0);
        if (i != null) {
          var a = "";
          t.length !== 1 && Mp(a);
        }
        var o,
          s = [],
          l = [];
        return (
          I(t, function (u) {
            u.prepareSource();
            var f = u.getSource(i || 0),
              h = "";
            (i != null && !f && Mp(h), s.push(f), l.push(u._getVersionSign()));
          }),
          n ? (o = gA(n, s, { datasetIndex: r.componentIndex })) : i != null && (o = [JD(s[0])]),
          { sourceList: o, upstreamSignList: l }
        );
      }),
      (e.prototype._isDirty = function () {
        if (this._dirty) return !0;
        for (var t = this._getUpstreamSourceManagers(), r = 0; r < t.length; r++) {
          var n = t[r];
          if (n._isDirty() || this._upstreamSignList[r] !== n._getVersionSign()) return !0;
        }
      }),
      (e.prototype.getSource = function (t) {
        t = t || 0;
        var r = this._sourceList[t];
        if (!r) {
          var n = this._getUpstreamSourceManagers();
          return n[0] && n[0].getSource(t);
        }
        return r;
      }),
      (e.prototype.getSharedDataStore = function (t) {
        var r = t.makeStoreSchema();
        return this._innerGetDataStore(r.dimensions, t.source, r.hash);
      }),
      (e.prototype._innerGetDataStore = function (t, r, n) {
        var i = 0,
          a = this._storeList,
          o = a[i];
        o || (o = a[i] = {});
        var s = o[n];
        if (!s) {
          var l = this._getUpstreamSourceManagers()[0];
          (Lo(this._sourceHost) && l
            ? (s = l._innerGetDataStore(t, r, n))
            : ((s = new fh()), s.initData(new z0(r, t.length), t)),
            (o[n] = s));
        }
        return s;
      }),
      (e.prototype._getUpstreamSourceManagers = function () {
        var t = this._sourceHost;
        if (Lo(t)) {
          var r = E0(t);
          return r ? [r.getSourceManager()] : [];
        } else
          return j(AD(t), function (n) {
            return n.getSourceManager();
          });
      }),
      (e.prototype._getSourceMetaRawOption = function () {
        var t = this._sourceHost,
          r,
          n,
          i;
        if (Lo(t)) ((r = t.get("seriesLayoutBy", !0)), (n = t.get("sourceHeader", !0)), (i = t.get("dimensions", !0)));
        else if (!this._getUpstreamSourceManagers().length) {
          var a = t;
          ((r = a.get("seriesLayoutBy", !0)), (n = a.get("sourceHeader", !0)), (i = a.get("dimensions", !0)));
        }
        return { seriesLayoutBy: r, sourceHeader: n, dimensions: i };
      }),
      e
    );
  })();
function Lo(e) {
  return e.mainType === "series";
}
function Mp(e) {
  throw new Error(e);
}
var wA = "line-height:1";
function Z0(e) {
  var t = e.lineHeight;
  return t == null ? wA : "line-height:" + ee(t + "") + "px";
}
function q0(e, t) {
  var r = e.color || X.color.tertiary,
    n = e.fontSize || 12,
    i = e.fontWeight || "400",
    a = e.color || X.color.secondary,
    o = e.fontSize || 14,
    s = e.fontWeight || "900";
  return t === "html"
    ? {
        nameStyle: "font-size:" + ee(n + "") + "px;color:" + ee(r) + ";font-weight:" + ee(i + ""),
        valueStyle: "font-size:" + ee(o + "") + "px;color:" + ee(a) + ";font-weight:" + ee(s + ""),
      }
    : { nameStyle: { fontSize: n, fill: r, fontWeight: i }, valueStyle: { fontSize: o, fill: a, fontWeight: s } };
}
var TA = [0, 10, 20, 30],
  xA = [
    "",
    `
`,
    `

`,
    `


`,
  ];
function Na(e, t) {
  return ((t.type = e), t);
}
function hh(e) {
  return e.type === "section";
}
function K0(e) {
  return hh(e) ? CA : DA;
}
function Q0(e) {
  if (hh(e)) {
    var t = 0,
      r = e.blocks.length,
      n = r > 1 || (r > 0 && !e.noHeader);
    return (
      I(e.blocks, function (i) {
        var a = Q0(i);
        a >= t && (t = a + +(n && (!a || (hh(i) && !i.noHeader))));
      }),
      t
    );
  }
  return 0;
}
function CA(e, t, r, n) {
  var i = t.noHeader,
    a = AA(Q0(t)),
    o = [],
    s = t.blocks || [];
  (vr(!s || U(s)), (s = s || []));
  var l = e.orderMode;
  if (t.sortBlocks && l) {
    s = s.slice();
    var u = { valueAsc: "asc", valueDesc: "desc" };
    if (Qt(u, l)) {
      var f = new lA(u[l], null);
      s.sort(function (p, m) {
        return f.evaluate(p.sortParam, m.sortParam);
      });
    } else l === "seriesDesc" && s.reverse();
  }
  I(s, function (p, m) {
    var g = t.valueFormatter,
      y = K0(p)(g ? N(N({}, e), { valueFormatter: g }) : e, p, m > 0 ? a.html : 0, n);
    y != null && o.push(y);
  });
  var h = e.renderMode === "richText" ? o.join(a.richText) : ch(n, o.join(""), i ? r : a.html);
  if (i) return h;
  var c = lh(t.header, "ordinal", e.useUTC),
    v = q0(n, e.renderMode).nameStyle,
    d = Z0(n);
  return e.renderMode === "richText"
    ? j0(e, c, v) + a.richText + h
    : ch(n, '<div style="' + v + ";" + d + ';">' + ee(c) + "</div>" + h, r);
}
function DA(e, t, r, n) {
  var i = e.renderMode,
    a = t.noName,
    o = t.noValue,
    s = !t.markerType,
    l = t.name,
    u = e.useUTC,
    f =
      t.valueFormatter ||
      e.valueFormatter ||
      function (S) {
        return (
          (S = U(S) ? S : [S]),
          j(S, function (b, w) {
            return lh(b, U(v) ? v[w] : v, u);
          })
        );
      };
  if (!(a && o)) {
    var h = s ? "" : e.markupStyleCreator.makeTooltipMarker(t.markerType, t.markerColor || X.color.secondary, i),
      c = a ? "" : lh(l, "ordinal", u),
      v = t.valueType,
      d = o ? [] : f(t.value, t.rawDataIndex),
      p = !s || !a,
      m = !s && a,
      g = q0(n, i),
      y = g.nameStyle,
      _ = g.valueStyle;
    return i === "richText"
      ? (s ? "" : h) + (a ? "" : j0(e, c, y)) + (o ? "" : LA(e, d, p, m, _))
      : ch(n, (s ? "" : h) + (a ? "" : MA(c, !s, y)) + (o ? "" : IA(d, p, m, _)), r);
  }
}
function Ip(e, t, r, n, i, a) {
  if (e) {
    var o = K0(e),
      s = { useUTC: i, renderMode: r, orderMode: n, markupStyleCreator: t, valueFormatter: e.valueFormatter };
    return o(s, e, 0, a);
  }
}
function AA(e) {
  return { html: TA[e], richText: xA[e] };
}
function ch(e, t, r) {
  var n = '<div style="clear:both"></div>',
    i = "margin: " + r + "px 0 0",
    a = Z0(e);
  return '<div style="' + i + ";" + a + ';">' + t + n + "</div>";
}
function MA(e, t, r) {
  var n = t ? "margin-left:2px" : "";
  return '<span style="' + r + ";" + n + '">' + ee(e) + "</span>";
}
function IA(e, t, r, n) {
  var i = r ? "10px" : "20px",
    a = t ? "float:right;margin-left:" + i : "";
  return (
    (e = U(e) ? e : [e]),
    '<span style="' +
      a +
      ";" +
      n +
      '">' +
      j(e, function (o) {
        return ee(o);
      }).join("&nbsp;&nbsp;") +
      "</span>"
  );
}
function j0(e, t, r) {
  return e.markupStyleCreator.wrapRichTextStyle(t, r);
}
function LA(e, t, r, n, i) {
  var a = [i],
    o = n ? 10 : 20;
  return (
    r && a.push({ padding: [0, 0, 0, o], align: "right" }),
    e.markupStyleCreator.wrapRichTextStyle(U(t) ? t.join("  ") : t, a)
  );
}
function PA(e, t) {
  var r = e.getData().getItemVisual(t, "style"),
    n = r[e.visualDrawType];
  return On(n);
}
function J0(e, t) {
  var r = e.get("padding");
  return r ?? (t === "richText" ? [8, 10] : 10);
}
var Yu = (function () {
  function e() {
    ((this.richTextStyles = {}), (this._nextStyleNameId = ic()));
  }
  return (
    (e.prototype._generateStyleName = function () {
      return "__EC_aUTo_" + this._nextStyleNameId++;
    }),
    (e.prototype.makeTooltipMarker = function (t, r, n) {
      var i = n === "richText" ? this._generateStyleName() : null,
        a = hD({ color: r, type: t, renderMode: n, markerId: i });
      return Y(a) ? a : ((this.richTextStyles[i] = a.style), a.content);
    }),
    (e.prototype.wrapRichTextStyle = function (t, r) {
      var n = {};
      U(r)
        ? I(r, function (a) {
            return N(n, a);
          })
        : N(n, r);
      var i = this._generateStyleName();
      return ((this.richTextStyles[i] = n), "{" + i + "|" + t + "}");
    }),
    e
  );
})();
function EA(e) {
  var t = e.series,
    r = e.dataIndex,
    n = e.multipleSeries,
    i = t.getData(),
    a = i.mapDimensionsAll("defaultedTooltip"),
    o = a.length,
    s = t.getRawValue(r),
    l = U(s),
    u = PA(t, r),
    f,
    h,
    c,
    v;
  if (o > 1 || (l && !o)) {
    var d = RA(s, t, r, a, u);
    ((f = d.inlineValues), (h = d.inlineValueTypes), (c = d.blocks), (v = d.inlineValues[0]));
  } else if (o) {
    var p = i.getDimensionInfo(a[0]);
    ((v = f = wi(i, r, a[0])), (h = p.type));
  } else v = f = l ? s[0] : s;
  var m = ac(t),
    g = (m && t.name) || "",
    y = i.getName(r),
    _ = n ? g : y;
  return Na("section", {
    header: g,
    noHeader: n || !m,
    sortParam: v,
    blocks: [
      Na("nameValue", {
        markerType: "item",
        markerColor: u,
        name: _,
        noName: !Xe(_),
        value: f,
        valueType: h,
        rawDataIndex: i.getRawIndex(r),
      }),
    ].concat(c || []),
  });
}
function RA(e, t, r, n, i) {
  var a = t.getData(),
    o = Mi(
      e,
      function (h, c, v) {
        var d = a.getDimensionInfo(v);
        return (h = h || (d && d.tooltip !== !1 && d.displayName != null));
      },
      !1,
    ),
    s = [],
    l = [],
    u = [];
  n.length
    ? I(n, function (h) {
        f(wi(a, r, h), h);
      })
    : I(e, f);
  function f(h, c) {
    var v = a.getDimensionInfo(c);
    !v ||
      v.otherDims.tooltip === !1 ||
      (o
        ? u.push(
            Na("nameValue", {
              markerType: "subItem",
              markerColor: i,
              name: v.displayName,
              value: h,
              valueType: v.type,
            }),
          )
        : (s.push(h), l.push(v.type)));
  }
  return { inlineValues: s, inlineValueTypes: l, blocks: u };
}
var wr = St();
function Po(e, t) {
  return e.getName(t) || e.getId(t);
}
var OA = "__universalTransitionEnabled",
  er = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r._selectedDataIndicesMap = {}), r);
    }
    return (
      (t.prototype.init = function (r, n, i) {
        ((this.seriesIndex = this.componentIndex),
          (this.dataTask = wa({ count: BA, reset: NA })),
          (this.dataTask.context = { model: this }),
          this.mergeDefaultAndTheme(r, i));
        var a = (wr(this).sourceManager = new bA(this));
        a.prepareSource();
        var o = this.getInitialData(r, i);
        (Pp(o, this),
          (this.dataTask.context.data = o),
          (wr(this).dataBeforeProcessed = o),
          Lp(this),
          this._initSelectedMapFromData(o));
      }),
      (t.prototype.mergeDefaultAndTheme = function (r, n) {
        var i = ka(this),
          a = i ? ja(r) : {},
          o = this.subType;
        (dt.hasClass(o) && (o += "Series"),
          pt(r, n.getTheme().get(this.subType)),
          pt(r, this.getDefaultOption()),
          fd(r, "label", ["show"]),
          this.fillDataTextStyle(r.data),
          i && Hr(r, a, i));
      }),
      (t.prototype.mergeOption = function (r, n) {
        ((r = pt(this.option, r, !0)), this.fillDataTextStyle(r.data));
        var i = ka(this);
        i && Hr(this.option, r, i);
        var a = wr(this).sourceManager;
        (a.dirty(), a.prepareSource());
        var o = this.getInitialData(r, n);
        (Pp(o, this),
          this.dataTask.dirty(),
          (this.dataTask.context.data = o),
          (wr(this).dataBeforeProcessed = o),
          Lp(this),
          this._initSelectedMapFromData(o));
      }),
      (t.prototype.fillDataTextStyle = function (r) {
        if (r && !oe(r)) for (var n = ["show"], i = 0; i < r.length; i++) r[i] && r[i].label && fd(r[i], "label", n);
      }),
      (t.prototype.getInitialData = function (r, n) {}),
      (t.prototype.appendData = function (r) {
        var n = this.getRawData();
        n.appendData(r.data);
      }),
      (t.prototype.getData = function (r) {
        var n = vh(this);
        if (n) {
          var i = n.context.data;
          return r == null || !i.getLinkedData ? i : i.getLinkedData(r);
        } else return wr(this).data;
      }),
      (t.prototype.getAllData = function () {
        var r = this.getData();
        return r && r.getLinkedDataAll ? r.getLinkedDataAll() : [{ data: r }];
      }),
      (t.prototype.setData = function (r) {
        var n = vh(this);
        if (n) {
          var i = n.context;
          ((i.outputData = r), n !== this.dataTask && (i.data = r));
        }
        wr(this).data = r;
      }),
      (t.prototype.getEncode = function () {
        var r = this.get("encode", !0);
        if (r) return Q(r);
      }),
      (t.prototype.getSourceManager = function () {
        return wr(this).sourceManager;
      }),
      (t.prototype.getSource = function () {
        return this.getSourceManager().getSource();
      }),
      (t.prototype.getRawData = function () {
        return wr(this).dataBeforeProcessed;
      }),
      (t.prototype.getColorBy = function () {
        var r = this.get("colorBy");
        return r || "series";
      }),
      (t.prototype.isColorBySeries = function () {
        return this.getColorBy() === "series";
      }),
      (t.prototype.getBaseAxis = function () {
        var r = this.coordinateSystem;
        return r && r.getBaseAxis && r.getBaseAxis();
      }),
      (t.prototype.indicesOfNearest = function (r, n, i, a) {
        var o = this.getData(),
          s = this.coordinateSystem,
          l = s && s.getAxis(r);
        if (!s || !l) return [];
        var u = l.dataToCoord(i);
        a == null && (a = 1 / 0);
        for (
          var f = [], h = 1 / 0, c = -1, v = 0, d = o.getDimensionIndex(n), p = o.getStore(), m = 0, g = p.count();
          m < g;
          m++
        ) {
          var y = p.get(d, m),
            _ = l.dataToCoord(y),
            S = u - _,
            b = Math.abs(S);
          b <= a && ((b < h || (b === h && S >= 0 && c < 0)) && ((h = b), (c = S), (v = 0)), S === c && (f[v++] = m));
        }
        return ((f.length = v), f);
      }),
      (t.prototype.formatTooltip = function (r, n, i) {
        return EA({ series: this, dataIndex: r, multipleSeries: n });
      }),
      (t.prototype.isAnimationEnabled = function () {
        var r = this.ecModel;
        if (nt.node && !(r && r.ssr)) return !1;
        var n = this.getShallow("animation");
        return (n && this.getData().count() > this.getShallow("animationThreshold") && (n = !1), !!n);
      }),
      (t.prototype.restoreData = function () {
        this.dataTask.dirty();
      }),
      (t.prototype.getColorFromPalette = function (r, n, i) {
        var a = this.ecModel,
          o = Gc.prototype.getColorFromPalette.call(this, r, n, i);
        return (o || (o = a.getColorFromPalette(r, n, i)), o);
      }),
      (t.prototype.coordDimToDataDim = function (r) {
        return this.getRawData().mapDimensionsAll(r);
      }),
      (t.prototype.getProgressive = function () {
        return this.get("progressive");
      }),
      (t.prototype.getProgressiveThreshold = function () {
        return this.get("progressiveThreshold");
      }),
      (t.prototype.select = function (r, n) {
        this._innerSelect(this.getData(n), r);
      }),
      (t.prototype.unselect = function (r, n) {
        var i = this.option.selectedMap;
        if (i) {
          var a = this.option.selectedMode,
            o = this.getData(n);
          if (a === "series" || i === "all") {
            ((this.option.selectedMap = {}), (this._selectedDataIndicesMap = {}));
            return;
          }
          for (var s = 0; s < r.length; s++) {
            var l = r[s],
              u = Po(o, l);
            ((i[u] = !1), (this._selectedDataIndicesMap[u] = -1));
          }
        }
      }),
      (t.prototype.toggleSelect = function (r, n) {
        for (var i = [], a = 0; a < r.length; a++)
          ((i[0] = r[a]), this.isSelected(r[a], n) ? this.unselect(i, n) : this.select(i, n));
      }),
      (t.prototype.getSelectedDataIndices = function () {
        if (this.option.selectedMap === "all") return [].slice.call(this.getData().getIndices());
        for (var r = this._selectedDataIndicesMap, n = xt(r), i = [], a = 0; a < n.length; a++) {
          var o = r[n[a]];
          o >= 0 && i.push(o);
        }
        return i;
      }),
      (t.prototype.isSelected = function (r, n) {
        var i = this.option.selectedMap;
        if (!i) return !1;
        var a = this.getData(n);
        return (i === "all" || i[Po(a, r)]) && !a.getItemModel(r).get(["select", "disabled"]);
      }),
      (t.prototype.isUniversalTransitionEnabled = function () {
        if (this[OA]) return !0;
        var r = this.option.universalTransition;
        return r ? (r === !0 ? !0 : r && r.enabled) : !1;
      }),
      (t.prototype._innerSelect = function (r, n) {
        var i,
          a,
          o = this.option,
          s = o.selectedMode,
          l = n.length;
        if (!(!s || !l)) {
          if (s === "series") o.selectedMap = "all";
          else if (s === "multiple") {
            Z(o.selectedMap) || (o.selectedMap = {});
            for (var u = o.selectedMap, f = 0; f < l; f++) {
              var h = n[f],
                c = Po(r, h);
              ((u[c] = !0), (this._selectedDataIndicesMap[c] = r.getRawIndex(h)));
            }
          } else if (s === "single" || s === !0) {
            var v = n[l - 1],
              c = Po(r, v);
            ((o.selectedMap = ((i = {}), (i[c] = !0), i)),
              (this._selectedDataIndicesMap = ((a = {}), (a[c] = r.getRawIndex(v)), a)));
          }
        }
      }),
      (t.prototype._initSelectedMapFromData = function (r) {
        if (!this.option.selectedMap) {
          var n = [];
          (r.hasItemOption &&
            r.each(function (i) {
              var a = r.getRawDataItem(i);
              a && a.selected && n.push(i);
            }),
            n.length > 0 && this._innerSelect(r, n));
        }
      }),
      (t.registerClass = function (r) {
        return dt.registerClass(r);
      }),
      (t.protoInitialize = (function () {
        var r = t.prototype;
        ((r.type = "series.__base__"),
          (r.seriesIndex = 0),
          (r.ignoreStyleOnData = !1),
          (r.hasSymbolVisual = !1),
          (r.defaultSymbol = "circle"),
          (r.visualStyleAccessPath = "itemStyle"),
          (r.visualDrawType = "fill"));
      })()),
      t
    );
  })(dt);
rr(er, oA);
rr(er, Gc);
by(er, dt);
function Lp(e) {
  var t = e.name;
  ac(e) || (e.name = kA(e) || t);
}
function kA(e) {
  var t = e.getRawData(),
    r = t.mapDimensionsAll("seriesName"),
    n = [];
  return (
    I(r, function (i) {
      var a = t.getDimensionInfo(i);
      a.displayName && n.push(a.displayName);
    }),
    n.join(" ")
  );
}
function BA(e) {
  return e.model.getRawData().count();
}
function NA(e) {
  var t = e.model;
  return (t.setData(t.getRawData().cloneShallow()), FA);
}
function FA(e, t) {
  t.outputData && e.end > t.outputData.count() && t.model.getRawData().cloneShallow(t.outputData);
}
function Pp(e, t) {
  I(fb(e.CHANGABLE_METHODS, e.DOWNSAMPLE_METHODS), function (r) {
    e.wrapMethod(r, Rt(zA, t));
  });
}
function zA(e, t) {
  var r = vh(e);
  return (r && r.setOutputEnd((t || this).count()), t);
}
function vh(e) {
  var t = (e.ecModel || {}).scheduler,
    r = t && t.getPipeline(e.uid);
  if (r) {
    var n = r.currentTask;
    if (n) {
      var i = n.agentStubMap;
      i && (n = i.get(e.uid));
    }
    return n;
  }
}
var Oe = (function () {
  function e() {
    ((this.group = new Bt()), (this.uid = Ml("viewComponent")));
  }
  return (
    (e.prototype.init = function (t, r) {}),
    (e.prototype.render = function (t, r, n, i) {}),
    (e.prototype.dispose = function (t, r) {}),
    (e.prototype.updateView = function (t, r, n, i) {}),
    (e.prototype.updateLayout = function (t, r, n, i) {}),
    (e.prototype.updateVisual = function (t, r, n, i) {}),
    (e.prototype.toggleBlurSeries = function (t, r, n) {}),
    (e.prototype.eachRendered = function (t) {
      var r = this.group;
      r && r.traverse(t);
    }),
    e
  );
})();
uc(Oe);
dl(Oe);
function $c() {
  var e = St();
  return function (t) {
    var r = e(t),
      n = t.pipelineContext,
      i = !!r.large,
      a = !!r.progressiveRender,
      o = (r.large = !!(n && n.large)),
      s = (r.progressiveRender = !!(n && n.progressiveRender));
    return (i !== o || a !== s) && "reset";
  };
}
var t_ = St(),
  HA = $c(),
  Re = (function () {
    function e() {
      ((this.group = new Bt()),
        (this.uid = Ml("viewChart")),
        (this.renderTask = wa({ plan: VA, reset: GA })),
        (this.renderTask.context = { view: this }));
    }
    return (
      (e.prototype.init = function (t, r) {}),
      (e.prototype.render = function (t, r, n, i) {}),
      (e.prototype.highlight = function (t, r, n, i) {
        var a = t.getData(i && i.dataType);
        a && Rp(a, i, "emphasis");
      }),
      (e.prototype.downplay = function (t, r, n, i) {
        var a = t.getData(i && i.dataType);
        a && Rp(a, i, "normal");
      }),
      (e.prototype.remove = function (t, r) {
        this.group.removeAll();
      }),
      (e.prototype.dispose = function (t, r) {}),
      (e.prototype.updateView = function (t, r, n, i) {
        this.render(t, r, n, i);
      }),
      (e.prototype.updateVisual = function (t, r, n, i) {
        this.render(t, r, n, i);
      }),
      (e.prototype.eachRendered = function (t) {
        Tl(this.group, t);
      }),
      (e.markUpdateMethod = function (t, r) {
        t_(t).updateMethod = r;
      }),
      (e.protoInitialize = (function () {
        var t = e.prototype;
        t.type = "chart";
      })()),
      e
    );
  })();
function Ep(e, t, r) {
  e && rh(e) && (t === "emphasis" ? Fs : zs)(e, r);
}
function Rp(e, t, r) {
  var n = En(e, t),
    i = t && t.highlightKey != null ? kx(t.highlightKey) : null;
  n != null
    ? I(jt(n), function (a) {
        Ep(e.getItemGraphicEl(a), r, i);
      })
    : e.eachItemGraphicEl(function (a) {
        Ep(a, r, i);
      });
}
uc(Re);
dl(Re);
function VA(e) {
  return HA(e.model);
}
function GA(e) {
  var t = e.model,
    r = e.ecModel,
    n = e.api,
    i = e.payload,
    a = t.pipelineContext.progressiveRender,
    o = e.view,
    s = i && t_(i).updateMethod,
    l = a ? "incrementalPrepareRender" : s && o[s] ? s : "render";
  return (l !== "render" && o[l](t, r, n, i), UA[l]);
}
var UA = {
    incrementalPrepareRender: {
      progress: function (e, t) {
        t.view.incrementalRender(e, t.model, t.ecModel, t.api, t.payload);
      },
    },
    render: {
      forceFirstProgress: !0,
      progress: function (e, t) {
        t.view.render(t.model, t.ecModel, t.api, t.payload);
      },
    },
  },
  Ys = "\0__throttleOriginMethod",
  Op = "\0__throttleRate",
  kp = "\0__throttleType";
function Rl(e, t, r) {
  var n,
    i = 0,
    a = 0,
    o = null,
    s,
    l,
    u,
    f;
  t = t || 0;
  function h() {
    ((a = new Date().getTime()), (o = null), e.apply(l, u || []));
  }
  var c = function () {
    for (var v = [], d = 0; d < arguments.length; d++) v[d] = arguments[d];
    ((n = new Date().getTime()), (l = this), (u = v));
    var p = f || t,
      m = f || r;
    ((f = null),
      (s = n - (m ? i : a) - p),
      clearTimeout(o),
      m ? (o = setTimeout(h, p)) : s >= 0 ? h() : (o = setTimeout(h, -s)),
      (i = n));
  };
  return (
    (c.clear = function () {
      o && (clearTimeout(o), (o = null));
    }),
    (c.debounceNextCall = function (v) {
      f = v;
    }),
    c
  );
}
function e_(e, t, r, n) {
  var i = e[t];
  if (i) {
    var a = i[Ys] || i,
      o = i[kp],
      s = i[Op];
    if (s !== r || o !== n) {
      if (r == null || !n) return (e[t] = a);
      ((i = e[t] = Rl(a, r, n === "debounce")), (i[Ys] = a), (i[kp] = n), (i[Op] = r));
    }
    return i;
  }
}
function dh(e, t) {
  var r = e[t];
  r && r[Ys] && (r.clear && r.clear(), (e[t] = r[Ys]));
}
var Bp = St(),
  Np = { itemStyle: Pa(c0, !0), lineStyle: Pa(h0, !0) },
  WA = { lineStyle: "stroke", itemStyle: "fill" };
function r_(e, t) {
  var r = e.visualStyleMapper || Np[t];
  return r || (console.warn("Unknown style type '" + t + "'."), Np.itemStyle);
}
function n_(e, t) {
  var r = e.visualDrawType || WA[t];
  return r || (console.warn("Unknown style type '" + t + "'."), "fill");
}
var YA = {
    createOnAllSeries: !0,
    performRawSeries: !0,
    reset: function (e, t) {
      var r = e.getData(),
        n = e.visualStyleAccessPath || "itemStyle",
        i = e.getModel(n),
        a = r_(e, n),
        o = a(i),
        s = i.getShallow("decal");
      s && (r.setVisual("decal", s), (s.dirty = !0));
      var l = n_(e, n),
        u = o[l],
        f = et(u) ? u : null,
        h = o.fill === "auto" || o.stroke === "auto";
      if (!o[l] || f || h) {
        var c = e.getColorFromPalette(e.name, null, t.getSeriesCount());
        (o[l] || ((o[l] = c), r.setVisual("colorFromPalette", !0)),
          (o.fill = o.fill === "auto" || et(o.fill) ? c : o.fill),
          (o.stroke = o.stroke === "auto" || et(o.stroke) ? c : o.stroke));
      }
      if ((r.setVisual("style", o), r.setVisual("drawType", l), !t.isSeriesFiltered(e) && f))
        return (
          r.setVisual("colorFromPalette", !1),
          {
            dataEach: function (v, d) {
              var p = e.getDataParams(d),
                m = N({}, o);
              ((m[l] = f(p)), v.setItemVisual(d, "style", m));
            },
          }
        );
    },
  },
  Zi = new Ct(),
  XA = {
    createOnAllSeries: !0,
    reset: function (e, t) {
      if (!e.ignoreStyleOnData) {
        var r = e.getData(),
          n = e.visualStyleAccessPath || "itemStyle",
          i = r_(e, n),
          a = r.getVisual("drawType");
        return {
          dataEach: r.hasItemOption
            ? function (o, s) {
                var l = o.getRawDataItem(s);
                if (l && l[n]) {
                  Zi.option = l[n];
                  var u = i(Zi),
                    f = o.ensureUniqueItemVisual(s, "style");
                  (N(f, u),
                    Zi.option.decal && (o.setItemVisual(s, "decal", Zi.option.decal), (Zi.option.decal.dirty = !0)),
                    a in u && o.setItemVisual(s, "colorFromPalette", !1));
                }
              }
            : null,
        };
      }
    },
  },
  $A = {
    performRawSeries: !0,
    overallReset: function (e) {
      var t = Q();
      (e.eachSeries(function (r) {
        if (!r.isColorBySeries()) {
          var n = r.type + "-" + r.getColorBy();
          Bp(r).scope = t.get(n) || t.set(n, {});
        }
      }),
        e.eachSeries(function (r) {
          if (!r.isColorBySeries()) {
            var n = r.getRawData(),
              i = {},
              a = r.getData(),
              o = Bp(r).scope,
              s = r.visualStyleAccessPath || "itemStyle",
              l = n_(r, s);
            (a.each(function (u) {
              var f = a.getRawIndex(u);
              i[f] = u;
            }),
              n.each(function (u) {
                var f = i[u],
                  h = a.getItemVisual(f, "colorFromPalette");
                if (h) {
                  var c = a.ensureUniqueItemVisual(f, "style"),
                    v = n.getName(u) || u + "",
                    d = n.count();
                  c[l] = r.getColorFromPalette(v, o, d);
                }
              }));
          }
        }));
    },
  },
  Eo = Math.PI;
function ZA(e, t) {
  ((t = t || {}),
    mt(t, {
      text: "loading",
      textColor: X.color.primary,
      fontSize: 12,
      fontWeight: "normal",
      fontStyle: "normal",
      fontFamily: "sans-serif",
      maskColor: "rgba(255,255,255,0.8)",
      showSpinner: !0,
      color: X.color.theme[0],
      spinnerRadius: 10,
      lineWidth: 5,
      zlevel: 0,
    }));
  var r = new Bt(),
    n = new Mt({ style: { fill: t.maskColor }, zlevel: t.zlevel, z: 1e4 });
  r.add(n);
  var i = new Wt({
      style: {
        text: t.text,
        fill: t.textColor,
        fontSize: t.fontSize,
        fontWeight: t.fontWeight,
        fontStyle: t.fontStyle,
        fontFamily: t.fontFamily,
      },
      zlevel: t.zlevel,
      z: 10001,
    }),
    a = new Mt({
      style: { fill: "none" },
      textContent: i,
      textConfig: { position: "right", distance: 10 },
      zlevel: t.zlevel,
      z: 10001,
    });
  r.add(a);
  var o;
  return (
    t.showSpinner &&
      ((o = new bl({
        shape: { startAngle: -Eo / 2, endAngle: -Eo / 2 + 0.1, r: t.spinnerRadius },
        style: { stroke: t.color, lineCap: "round", lineWidth: t.lineWidth },
        zlevel: t.zlevel,
        z: 10001,
      })),
      o
        .animateShape(!0)
        .when(1e3, { endAngle: (Eo * 3) / 2 })
        .start("circularInOut"),
      o
        .animateShape(!0)
        .when(1e3, { startAngle: (Eo * 3) / 2 })
        .delay(300)
        .start("circularInOut"),
      r.add(o)),
    (r.resize = function () {
      var s = i.getBoundingRect().width,
        l = t.showSpinner ? t.spinnerRadius : 0,
        u =
          (e.getWidth() - l * 2 - (t.showSpinner && s ? 10 : 0) - s) / 2 -
          (t.showSpinner && s ? 0 : 5 + s / 2) +
          (t.showSpinner ? 0 : s / 2) +
          (s ? 0 : l),
        f = e.getHeight() / 2;
      (t.showSpinner && o.setShape({ cx: u, cy: f }),
        a.setShape({ x: u - l, y: f - l, width: l * 2, height: l * 2 }),
        n.setShape({ x: 0, y: 0, width: e.getWidth(), height: e.getHeight() }));
    }),
    r.resize(),
    r
  );
}
var i_ = (function () {
  function e(t, r, n, i) {
    ((this._stageTaskMap = Q()),
      (this.ecInstance = t),
      (this.api = r),
      (n = this._dataProcessorHandlers = n.slice()),
      (i = this._visualHandlers = i.slice()),
      (this._allHandlers = n.concat(i)));
  }
  return (
    (e.prototype.restoreData = function (t, r) {
      (t.restoreData(r),
        this._stageTaskMap.each(function (n) {
          var i = n.overallTask;
          i && i.dirty();
        }));
    }),
    (e.prototype.getPerformArgs = function (t, r) {
      if (t.__pipeline) {
        var n = this._pipelineMap.get(t.__pipeline.id),
          i = n.context,
          a = !r && n.progressiveEnabled && (!i || i.progressiveRender) && t.__idxInPipeline > n.blockIndex,
          o = a ? n.step : null,
          s = i && i.modDataCount,
          l = s != null ? Math.ceil(s / o) : null;
        return { step: o, modBy: l, modDataCount: s };
      }
    }),
    (e.prototype.getPipeline = function (t) {
      return this._pipelineMap.get(t);
    }),
    (e.prototype.updateStreamModes = function (t, r) {
      var n = this._pipelineMap.get(t.uid),
        i = t.__preparePipelineContext ? t.__preparePipelineContext(r, n) : _y(t, r, n);
      t.pipelineContext = n.context = i;
    }),
    (e.prototype.restorePipelines = function (t, r) {
      var n = this,
        i = (n._pipelineMap = Q());
      r.eachSeries(function (a) {
        var o = t.painter.type === "canvas" && a.getProgressive(),
          s = a.uid;
        (i.set(s, {
          id: s,
          head: null,
          tail: null,
          threshold: a.getProgressiveThreshold(),
          progressiveEnabled: o && !(a.preventIncremental && a.preventIncremental()),
          blockIndex: -1,
          step: Math.round(o || 700),
          count: 0,
        }),
          n._pipe(a, a.dataTask));
      });
    }),
    (e.prototype.prepareStageTasks = function () {
      var t = this._stageTaskMap,
        r = this.api.getModel(),
        n = this.api;
      I(
        this._allHandlers,
        function (i) {
          var a = t.get(i.uid) || t.set(i.uid, {}),
            o = "";
          (vr(!(i.reset && i.overallReset), o),
            i.reset && this._createSeriesStageTask(i, a, r, n),
            i.overallReset && this._createOverallStageTask(i, a, r, n));
        },
        this,
      );
    }),
    (e.prototype.prepareView = function (t, r, n, i) {
      var a = t.renderTask,
        o = a.context;
      ((o.model = r), (o.ecModel = n), (o.api = i), (a.__block = !t.incrementalPrepareRender), this._pipe(r, a));
    }),
    (e.prototype.performDataProcessorTasks = function (t, r) {
      this._performStageTasks(this._dataProcessorHandlers, t, r, { block: !0 });
    }),
    (e.prototype.performVisualTasks = function (t, r, n) {
      this._performStageTasks(this._visualHandlers, t, r, n);
    }),
    (e.prototype._performStageTasks = function (t, r, n, i) {
      i = i || {};
      var a = !1,
        o = this;
      I(t, function (l, u) {
        if (!(i.visualType && i.visualType !== l.visualType)) {
          var f = o._stageTaskMap.get(l.uid),
            h = f.seriesTaskMap,
            c = f.overallTask;
          if (c) {
            var v,
              d = c.agentStubMap;
            (d.each(function (m) {
              s(i, m) && (m.dirty(), (v = !0));
            }),
              v && c.dirty(),
              o.updatePayload(c, n));
            var p = o.getPerformArgs(c, i.block);
            (d.each(function (m) {
              m.perform(p);
            }),
              c.perform(p) && (a = !0));
          } else
            h &&
              h.each(function (m, g) {
                s(i, m) && m.dirty();
                var y = o.getPerformArgs(m, i.block);
                ((y.skip = !l.performRawSeries && r.isSeriesFiltered(m.context.model)),
                  o.updatePayload(m, n),
                  m.perform(y) && (a = !0));
              });
        }
      });
      function s(l, u) {
        return l.setDirty && (!l.dirtyMap || l.dirtyMap.get(u.__pipeline.id));
      }
      this.unfinished = a || this.unfinished;
    }),
    (e.prototype.performSeriesTasks = function (t) {
      var r;
      (t.eachSeries(function (n) {
        r = n.dataTask.perform() || r;
      }),
        (this.unfinished = r || this.unfinished));
    }),
    (e.prototype.plan = function () {
      this._pipelineMap.each(function (t) {
        var r = t.tail;
        do {
          if (r.__block) {
            t.blockIndex = r.__idxInPipeline;
            break;
          }
          r = r.getUpstream();
        } while (r);
      });
    }),
    (e.prototype.updatePayload = function (t, r) {
      r !== "remain" && (t.context.payload = r);
    }),
    (e.prototype._createSeriesStageTask = function (t, r, n, i) {
      var a = this,
        o = r.seriesTaskMap,
        s = (r.seriesTaskMap = Q()),
        l = t.seriesType,
        u = t.getTargetSeries;
      t.createOnAllSeries ? n.eachRawSeries(f) : l ? n.eachRawSeriesByType(l, f) : u && u(n, i).each(f);
      function f(h) {
        var c = h.uid,
          v = s.set(c, (o && o.get(c)) || wa({ plan: JA, reset: tM, count: rM }));
        ((v.context = {
          model: h,
          ecModel: n,
          api: i,
          useClearVisual: t.isVisual && !t.isLayout,
          plan: t.plan,
          reset: t.reset,
          scheduler: a,
        }),
          a._pipe(h, v));
      }
    }),
    (e.prototype._createOverallStageTask = function (t, r, n, i) {
      var a = this,
        o = (r.overallTask = r.overallTask || wa({ reset: qA }));
      o.context = { ecModel: n, api: i, overallReset: t.overallReset, scheduler: a };
      var s = o.agentStubMap,
        l = (o.agentStubMap = Q()),
        u = t.seriesType,
        f = t.getTargetSeries,
        h = t.dirtyOnOverallProgress,
        c = !1,
        v = "";
      (vr(!t.createOnAllSeries, v), u ? n.eachRawSeriesByType(u, d) : f ? f(n, i).each(d) : I(n.getSeries(), d));
      function d(p) {
        var m = p.uid,
          g = l.set(m, (s && s.get(m)) || ((c = !0), wa({ reset: KA, onDirty: jA })));
        ((g.context = { model: p, dirtyOnOverallProgress: h }), (g.agent = o), (g.__block = h), a._pipe(p, g));
      }
      c && o.dirty();
    }),
    (e.prototype._pipe = function (t, r) {
      var n = t.uid,
        i = this._pipelineMap.get(n);
      (!i.head && (i.head = r),
        i.tail && i.tail.pipe(r),
        (i.tail = r),
        (r.__idxInPipeline = i.count++),
        (r.__pipeline = i));
    }),
    (e.wrapStageHandler = function (t, r) {
      return (
        et(t) && (t = { overallReset: t, seriesType: nM(t) }),
        (t.uid = Ml("stageHandler")),
        r && (t.visualType = r),
        t
      );
    }),
    e
  );
})();
function qA(e) {
  e.overallReset(e.ecModel, e.api, e.payload);
}
function KA(e) {
  return e.dirtyOnOverallProgress && QA;
}
function QA() {
  (this.agent.dirty(), this.getDownstream().dirty());
}
function jA() {
  this.agent && this.agent.dirty();
}
function JA(e) {
  return e.plan ? e.plan(e.model, e.ecModel, e.api, e.payload) : null;
}
function tM(e) {
  e.useClearVisual && e.data.clearAllVisual();
  var t = (e.resetDefines = jt(e.reset(e.model, e.ecModel, e.api, e.payload)));
  return t.length > 1
    ? j(t, function (r, n) {
        return a_(n);
      })
    : eM;
}
var eM = a_(0);
function a_(e) {
  return function (t, r) {
    var n = r.data,
      i = r.resetDefines[e];
    if (i && i.dataEach) for (var a = t.start; a < t.end; a++) i.dataEach(n, a);
    else i && i.progress && i.progress(t, n);
  };
}
function rM(e) {
  return e.data.count();
}
function nM(e) {
  Xs = null;
  try {
    e(Fa, o_);
  } catch {}
  return Xs;
}
var Fa = {},
  o_ = {},
  Xs;
s_(Fa, Uc);
s_(o_, Oy);
Fa.eachSeriesByType = Fa.eachRawSeriesByType = function (e) {
  Xs = e;
};
Fa.eachComponent = function (e) {
  e.mainType === "series" && e.subType && (Xs = e.subType);
};
function s_(e, t) {
  for (var r in t.prototype) e[r] = Gt;
}
var F = X.darkColor,
  Fp = F.background,
  qi = function () {
    return {
      axisLine: { lineStyle: { color: F.axisLine } },
      splitLine: { lineStyle: { color: F.axisSplitLine } },
      splitArea: { areaStyle: { color: [F.backgroundTint, F.backgroundTransparent] } },
      minorSplitLine: { lineStyle: { color: F.axisMinorSplitLine } },
      axisLabel: { color: F.axisLabel },
      axisName: {},
    };
  },
  zp = {
    label: { color: F.secondary },
    itemStyle: { borderColor: F.borderTint },
    dividerLineStyle: { color: F.border },
  },
  l_ = {
    darkMode: !0,
    color: F.theme,
    backgroundColor: Fp,
    axisPointer: { lineStyle: { color: F.border }, crossStyle: { color: F.borderShade }, label: { color: F.tertiary } },
    legend: { textStyle: { color: F.secondary }, pageTextStyle: { color: F.tertiary } },
    textStyle: { color: F.secondary },
    title: { textStyle: { color: F.primary }, subtextStyle: { color: F.quaternary } },
    toolbox: {
      iconStyle: { borderColor: F.accent50 },
      feature: {
        dataView: {
          backgroundColor: Fp,
          textColor: F.primary,
          textareaColor: F.background,
          textareaBorderColor: F.border,
          buttonColor: F.accent50,
          buttonTextColor: F.neutral00,
        },
      },
    },
    tooltip: { backgroundColor: F.neutral20, defaultBorderColor: F.border, textStyle: { color: F.tertiary } },
    dataZoom: {
      borderColor: F.accent10,
      textStyle: { color: F.tertiary },
      brushStyle: { color: F.backgroundTint },
      handleStyle: { color: F.neutral00, borderColor: F.accent20 },
      moveHandleStyle: { color: F.accent40 },
      emphasis: { handleStyle: { borderColor: F.accent50 } },
      dataBackground: { lineStyle: { color: F.accent30 }, areaStyle: { color: F.accent20 } },
      selectedDataBackground: { lineStyle: { color: F.accent50 }, areaStyle: { color: F.accent30 } },
    },
    visualMap: { textStyle: { color: F.secondary }, handleStyle: { borderColor: F.neutral30 } },
    timeline: {
      lineStyle: { color: F.accent10 },
      label: { color: F.tertiary },
      controlStyle: { color: F.accent30, borderColor: F.accent30 },
    },
    calendar: {
      itemStyle: { color: F.neutral00, borderColor: F.neutral20 },
      dayLabel: { color: F.tertiary },
      monthLabel: { color: F.secondary },
      yearLabel: { color: F.secondary },
    },
    matrix: {
      x: zp,
      y: zp,
      backgroundColor: { borderColor: F.axisLine },
      body: { itemStyle: { borderColor: F.borderTint } },
    },
    timeAxis: qi(),
    logAxis: qi(),
    valueAxis: qi(),
    categoryAxis: qi(),
    line: { symbol: "circle" },
    graph: { color: F.theme },
    gauge: {
      title: { color: F.secondary },
      axisLine: { lineStyle: { color: [[1, F.neutral05]] } },
      axisLabel: { color: F.axisLabel },
      detail: { color: F.primary },
    },
    candlestick: {
      itemStyle: { color: "#f64e56", color0: "#54ea92", borderColor: "#f64e56", borderColor0: "#54ea92" },
    },
    funnel: { itemStyle: { borderColor: F.background } },
    radar: (function () {
      var e = qi();
      return ((e.axisName = { color: F.axisLabel }), (e.axisLine.lineStyle.color = F.neutral20), e);
    })(),
    treemap: {
      breadcrumb: {
        itemStyle: { color: F.neutral20, textStyle: { color: F.secondary } },
        emphasis: { itemStyle: { color: F.neutral30 } },
      },
    },
    sunburst: { itemStyle: { borderColor: F.background } },
    map: {
      itemStyle: { borderColor: F.border, areaColor: F.neutral10 },
      label: { color: F.tertiary },
      emphasis: { label: { color: F.primary }, itemStyle: { areaColor: F.highlight } },
      select: { label: { color: F.primary }, itemStyle: { areaColor: F.highlight } },
    },
    geo: {
      itemStyle: { borderColor: F.border, areaColor: F.neutral10 },
      emphasis: { label: { color: F.primary }, itemStyle: { areaColor: F.highlight } },
      select: { label: { color: F.primary }, itemStyle: { color: F.highlight } },
    },
  };
l_.categoryAxis.splitLine.show = !1;
var iM = (function () {
    function e() {}
    return (
      (e.prototype.normalizeQuery = function (t) {
        var r = {},
          n = {},
          i = {};
        if (Y(t)) {
          var a = $e(t);
          ((r.mainType = a.main || null), (r.subType = a.sub || null));
        } else {
          var o = ["Index", "Name", "Id"],
            s = { name: 1, dataIndex: 1, dataType: 1 };
          I(t, function (l, u) {
            for (var f = !1, h = 0; h < o.length; h++) {
              var c = o[h],
                v = u.lastIndexOf(c);
              if (v > 0 && v === u.length - c.length) {
                var d = u.slice(0, v);
                d !== "data" && ((r.mainType = d), (r[c.toLowerCase()] = l), (f = !0));
              }
            }
            (s.hasOwnProperty(u) && ((n[u] = l), (f = !0)), f || (i[u] = l));
          });
        }
        return { cptQuery: r, dataQuery: n, otherQuery: i };
      }),
      (e.prototype.filter = function (t, r) {
        var n = this.eventInfo;
        if (!n) return !0;
        var i = n.targetEl,
          a = n.packedEvent,
          o = n.model,
          s = n.view;
        if (!o || !s) return !0;
        var l = r.cptQuery,
          u = r.dataQuery;
        return (
          f(l, o, "mainType") &&
          f(l, o, "subType") &&
          f(l, o, "index", "componentIndex") &&
          f(l, o, "name") &&
          f(l, o, "id") &&
          f(u, a, "name") &&
          f(u, a, "dataIndex") &&
          f(u, a, "dataType") &&
          (!s.filterForExposedEvent || s.filterForExposedEvent(t, r.otherQuery, i, a))
        );
        function f(h, c, v, d) {
          return h[v] == null || c[d || v] === h[v];
        }
      }),
      (e.prototype.afterTrigger = function () {
        this.eventInfo = null;
      }),
      e
    );
  })(),
  ph = ["symbol", "symbolSize", "symbolRotate", "symbolOffset"],
  Hp = ph.concat(["symbolKeepAspect"]),
  aM = {
    createOnAllSeries: !0,
    performRawSeries: !0,
    reset: function (e, t) {
      var r = e.getData();
      if ((e.legendIcon && r.setVisual("legendIcon", e.legendIcon), !e.hasSymbolVisual)) return;
      for (var n = {}, i = {}, a = !1, o = 0; o < ph.length; o++) {
        var s = ph[o],
          l = e.get(s);
        et(l) ? ((a = !0), (i[s] = l)) : (n[s] = l);
      }
      if (
        ((n.symbol = n.symbol || e.defaultSymbol),
        r.setVisual(N({ legendIcon: e.legendIcon || n.symbol, symbolKeepAspect: e.get("symbolKeepAspect") }, n)),
        t.isSeriesFiltered(e))
      )
        return;
      var u = xt(i);
      function f(h, c) {
        for (var v = e.getRawValue(c), d = e.getDataParams(c), p = 0; p < u.length; p++) {
          var m = u[p];
          h.setItemVisual(c, m, i[m](v, d));
        }
      }
      return { dataEach: a ? f : null };
    },
  },
  oM = {
    createOnAllSeries: !0,
    performRawSeries: !0,
    reset: function (e, t) {
      if (!e.hasSymbolVisual || t.isSeriesFiltered(e)) return;
      var r = e.getData();
      function n(i, a) {
        for (var o = i.getItemModel(a), s = 0; s < Hp.length; s++) {
          var l = Hp[s],
            u = o.getShallow(l, !0);
          u != null && i.setItemVisual(a, l, u);
        }
      }
      return { dataEach: r.hasItemOption ? n : null };
    },
  };
function sM(e, t, r) {
  switch (r) {
    case "color":
      var n = e.getItemVisual(t, "style");
      return n[e.getVisual("drawType")];
    case "opacity":
      return e.getItemVisual(t, "style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return e.getItemVisual(t, r);
  }
}
function lM(e, t) {
  switch (t) {
    case "color":
      var r = e.getVisual("style");
      return r[e.getVisual("drawType")];
    case "opacity":
      return e.getVisual("style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return e.getVisual(t);
  }
}
function qn(e, t, r, n, i) {
  var a = e + t;
  r.isSilent(a) ||
    n.eachComponent({ mainType: "series", subType: "pie" }, function (o) {
      for (var s = o.seriesIndex, l = o.option.selectedMap, u = i.selected, f = 0; f < u.length; f++)
        if (u[f].seriesIndex === s) {
          var h = o.getData(),
            c = En(h, i.fromActionPayload);
          r.trigger(a, {
            type: a,
            seriesId: o.id,
            name: U(c) ? h.getName(c[0]) : h.getName(c),
            selected: Y(l) ? l : N({}, l),
          });
        }
    });
}
function uM(e, t, r) {
  e.on("selectchanged", function (n) {
    var i = r.getModel();
    n.isFromClick
      ? (qn("map", "selectchanged", t, i, n), qn("pie", "selectchanged", t, i, n))
      : n.fromAction === "select"
        ? (qn("map", "selected", t, i, n), qn("pie", "selected", t, i, n))
        : n.fromAction === "unselect" && (qn("map", "unselected", t, i, n), qn("pie", "unselected", t, i, n));
  });
}
function ha(e, t, r) {
  for (var n; e && !(t(e) && ((n = e), r)); ) e = e.__hostTarget || e.parent;
  return n;
}
var ge = new nr(),
  u_ = {};
function fM(e, t) {
  u_[e] = t;
}
function hM(e) {
  return u_[e];
}
var Ol = St();
function cM(e) {
  Ol(e).prepare = {};
}
function vM(e) {
  Ol(e).fullUpdate = {};
}
function dM(e) {
  return Ol(e).prepare;
}
function Oi(e) {
  return Ol(e).fullUpdate;
}
var pM = Math.round(Math.random() * 9),
  gM = typeof Object.defineProperty == "function",
  mM = (function () {
    function e() {
      this._id = "__ec_inner_" + pM++;
    }
    return (
      (e.prototype.get = function (t) {
        return this._guard(t)[this._id];
      }),
      (e.prototype.set = function (t, r) {
        var n = this._guard(t);
        return (
          gM ? Object.defineProperty(n, this._id, { value: r, enumerable: !1, configurable: !0 }) : (n[this._id] = r),
          this
        );
      }),
      (e.prototype.delete = function (t) {
        return this.has(t) ? (delete this._guard(t)[this._id], !0) : !1;
      }),
      (e.prototype.has = function (t) {
        return !!this._guard(t)[this._id];
      }),
      (e.prototype._guard = function (t) {
        if (t !== Object(t)) throw TypeError("Value of WeakMap is not a non-null object.");
        return t;
      }),
      e
    );
  })(),
  yM = gt.extend({
    type: "triangle",
    shape: { cx: 0, cy: 0, width: 0, height: 0 },
    buildPath: function (e, t) {
      var r = t.cx,
        n = t.cy,
        i = t.width / 2,
        a = t.height / 2;
      (e.moveTo(r, n - a), e.lineTo(r + i, n + a), e.lineTo(r - i, n + a), e.closePath());
    },
  }),
  _M = gt.extend({
    type: "diamond",
    shape: { cx: 0, cy: 0, width: 0, height: 0 },
    buildPath: function (e, t) {
      var r = t.cx,
        n = t.cy,
        i = t.width / 2,
        a = t.height / 2;
      (e.moveTo(r, n - a), e.lineTo(r + i, n), e.lineTo(r, n + a), e.lineTo(r - i, n), e.closePath());
    },
  }),
  SM = gt.extend({
    type: "pin",
    shape: { x: 0, y: 0, width: 0, height: 0 },
    buildPath: function (e, t) {
      var r = t.x,
        n = t.y,
        i = (t.width / 5) * 3,
        a = Math.max(i, t.height),
        o = i / 2,
        s = (o * o) / (a - o),
        l = n - a + o + s,
        u = Math.asin(s / o),
        f = Math.cos(u) * o,
        h = Math.sin(u),
        c = Math.cos(u),
        v = o * 0.6,
        d = o * 0.7;
      (e.moveTo(r - f, l + s),
        e.arc(r, l, o, Math.PI - u, Math.PI * 2 + u),
        e.bezierCurveTo(r + f - h * v, l + s + c * v, r, n - d, r, n),
        e.bezierCurveTo(r, n - d, r - f + h * v, l + s + c * v, r - f, l + s),
        e.closePath());
    },
  }),
  bM = gt.extend({
    type: "arrow",
    shape: { x: 0, y: 0, width: 0, height: 0 },
    buildPath: function (e, t) {
      var r = t.height,
        n = t.width,
        i = t.x,
        a = t.y,
        o = (n / 3) * 2;
      (e.moveTo(i, a),
        e.lineTo(i + o, a + r),
        e.lineTo(i, a + (r / 4) * 3),
        e.lineTo(i - o, a + r),
        e.lineTo(i, a),
        e.closePath());
    },
  }),
  wM = { line: Fr, rect: Mt, roundRect: Mt, square: Mt, circle: Sl, diamond: _M, pin: SM, arrow: bM, triangle: yM },
  TM = {
    line: function (e, t, r, n, i) {
      ((i.x1 = e), (i.y1 = t + n / 2), (i.x2 = e + r), (i.y2 = t + n / 2));
    },
    rect: function (e, t, r, n, i) {
      ((i.x = e), (i.y = t), (i.width = r), (i.height = n));
    },
    roundRect: function (e, t, r, n, i) {
      ((i.x = e), (i.y = t), (i.width = r), (i.height = n), (i.r = Math.min(r, n) / 4));
    },
    square: function (e, t, r, n, i) {
      var a = Math.min(r, n);
      ((i.x = e), (i.y = t), (i.width = a), (i.height = a));
    },
    circle: function (e, t, r, n, i) {
      ((i.cx = e + r / 2), (i.cy = t + n / 2), (i.r = Math.min(r, n) / 2));
    },
    diamond: function (e, t, r, n, i) {
      ((i.cx = e + r / 2), (i.cy = t + n / 2), (i.width = r), (i.height = n));
    },
    pin: function (e, t, r, n, i) {
      ((i.x = e + r / 2), (i.y = t + n / 2), (i.width = r), (i.height = n));
    },
    arrow: function (e, t, r, n, i) {
      ((i.x = e + r / 2), (i.y = t + n / 2), (i.width = r), (i.height = n));
    },
    triangle: function (e, t, r, n, i) {
      ((i.cx = e + r / 2), (i.cy = t + n / 2), (i.width = r), (i.height = n));
    },
  },
  gh = {};
I(wM, function (e, t) {
  gh[t] = new e();
});
var xM = gt.extend({
  type: "symbol",
  shape: { symbolType: "", x: 0, y: 0, width: 0, height: 0 },
  calculateTextPosition: function (e, t, r) {
    var n = Es(e, t, r),
      i = this.shape;
    return (i && i.symbolType === "pin" && t.position === "inside" && (n.y = r.y + r.height * 0.4), n);
  },
  buildPath: function (e, t, r) {
    var n = t.symbolType;
    if (n !== "none") {
      var i = gh[n];
      (i || ((n = "rect"), (i = gh[n])), TM[n](t.x, t.y, t.width, t.height, i.shape), i.buildPath(e, i.shape, r));
    }
  },
});
function CM(e, t) {
  if (this.type !== "image") {
    var r = this.style;
    (this.__isEmptyBrush
      ? ((r.stroke = e), (r.fill = t || X.color.neutral00), (r.lineWidth = 2))
      : this.shape.symbolType === "line"
        ? (r.stroke = e)
        : (r.fill = e),
      this.markRedraw());
  }
}
function Ti(e, t, r, n, i, a, o) {
  var s = e.indexOf("empty") === 0;
  s && (e = e.substr(5, 1).toLowerCase() + e.substr(6));
  var l;
  return (
    e.indexOf("image://") === 0
      ? (l = n0(e.slice(8), new J(t, r, n, i), o ? "center" : "cover"))
      : e.indexOf("path://") === 0
        ? (l = Tc(e.slice(7), {}, new J(t, r, n, i), o ? "center" : "cover"))
        : (l = new xM({ shape: { symbolType: e, x: t, y: r, width: n, height: i } })),
    (l.__isEmptyBrush = s),
    (l.setColor = CM),
    a && l.setColor(a),
    l
  );
}
function DM(e) {
  return (U(e) || (e = [+e, +e]), [e[0] || 0, e[1] || 0]);
}
function f_(e, t) {
  if (e != null) return (U(e) || (e = [e, e]), [qt(e[0], t[0]) || 0, qt(q(e[1], e[0]), t[1]) || 0]);
}
function xn(e) {
  return isFinite(e);
}
function AM(e, t, r) {
  var n = t.x == null ? 0 : t.x,
    i = t.x2 == null ? 1 : t.x2,
    a = t.y == null ? 0 : t.y,
    o = t.y2 == null ? 0 : t.y2;
  (t.global || ((n = n * r.width + r.x), (i = i * r.width + r.x), (a = a * r.height + r.y), (o = o * r.height + r.y)),
    (n = xn(n) ? n : 0),
    (i = xn(i) ? i : 1),
    (a = xn(a) ? a : 0),
    (o = xn(o) ? o : 0));
  var s = e.createLinearGradient(n, a, i, o);
  return s;
}
function MM(e, t, r) {
  var n = r.width,
    i = r.height,
    a = Math.min(n, i),
    o = t.x == null ? 0.5 : t.x,
    s = t.y == null ? 0.5 : t.y,
    l = t.r == null ? 0.5 : t.r;
  (t.global || ((o = o * n + r.x), (s = s * i + r.y), (l = l * a)),
    (o = xn(o) ? o : 0.5),
    (s = xn(s) ? s : 0.5),
    (l = l >= 0 && xn(l) ? l : 0.5));
  var u = e.createRadialGradient(o, s, 0, o, s, l);
  return u;
}
function mh(e, t, r) {
  for (var n = t.type === "radial" ? MM(e, t, r) : AM(e, t, r), i = t.colorStops, a = 0; a < i.length; a++)
    n.addColorStop(i[a].offset, i[a].color);
  return n;
}
function IM(e, t) {
  if (e === t || (!e && !t)) return !1;
  if (!e || !t || e.length !== t.length) return !0;
  for (var r = 0; r < e.length; r++) if (e[r] !== t[r]) return !0;
  return !1;
}
function Ro(e) {
  return parseInt(e, 10);
}
function Oo(e, t, r) {
  var n = ["width", "height"][t],
    i = ["clientWidth", "clientHeight"][t],
    a = ["paddingLeft", "paddingTop"][t],
    o = ["paddingRight", "paddingBottom"][t];
  if (r[n] != null && r[n] !== "auto") return parseFloat(r[n]);
  var s = document.defaultView.getComputedStyle(e);
  return (e[i] || Ro(s[n]) || Ro(e.style[n])) - (Ro(s[a]) || 0) - (Ro(s[o]) || 0) || 0;
}
function LM(e, t) {
  return !e || e === "solid" || !(t > 0)
    ? null
    : e === "dashed"
      ? [4 * t, 2 * t]
      : e === "dotted"
        ? [t]
        : wt(e)
          ? [e]
          : U(e)
            ? e
            : null;
}
function h_(e) {
  var t = e.style,
    r = t.lineDash && t.lineWidth > 0 && LM(t.lineDash, t.lineWidth),
    n = t.lineDashOffset;
  if (r) {
    var i = t.strokeNoScale && e.getLineScale ? e.getLineScale() : 1;
    i &&
      i !== 1 &&
      ((r = j(r, function (a) {
        return a / i;
      })),
      (n /= i));
  }
  return [r, n];
}
var PM = new Rn(!0);
function $s(e) {
  var t = e.stroke;
  return !(t == null || t === "none" || !(e.lineWidth > 0));
}
function Vp(e) {
  return typeof e == "string" && e !== "none";
}
function Zs(e) {
  var t = e.fill;
  return t != null && t !== "none";
}
function Gp(e, t) {
  if (t.fillOpacity != null && t.fillOpacity !== 1) {
    var r = e.globalAlpha;
    ((e.globalAlpha = t.fillOpacity * t.opacity), e.fill(), (e.globalAlpha = r));
  } else e.fill();
}
function Up(e, t) {
  if (t.strokeOpacity != null && t.strokeOpacity !== 1) {
    var r = e.globalAlpha;
    ((e.globalAlpha = t.strokeOpacity * t.opacity), e.stroke(), (e.globalAlpha = r));
  } else e.stroke();
}
function yh(e, t, r) {
  var n = wy(t.image, t.__image, r);
  if (pl(n)) {
    var i = e.createPattern(n, t.repeat || "repeat");
    if (typeof DOMMatrix == "function" && i && i.setTransform) {
      var a = new DOMMatrix();
      (a.translateSelf(t.x || 0, t.y || 0),
        a.rotateSelf(0, 0, (t.rotation || 0) * hb),
        a.scaleSelf(t.scaleX || 1, t.scaleY || 1),
        i.setTransform(a));
    }
    return i;
  }
}
function EM(e, t, r, n, i) {
  var a,
    o = $s(r),
    s = Zs(r),
    l = r.strokePercent,
    u = l < 1,
    f = !t.path;
  (!t.silent || u) && f && t.createPathProxy();
  var h = t.path || PM,
    c = t.__dirty;
  if (!n) {
    var v = r.fill,
      d = r.stroke,
      p = s && !!v.colorStops,
      m = o && !!d.colorStops,
      g = s && !!v.image,
      y = o && !!d.image,
      _ = void 0,
      S = void 0,
      b = void 0,
      w = void 0,
      T = void 0;
    ((p || m) && (T = t.getBoundingRect()),
      p && ((_ = c ? mh(e, v, T) : t.__canvasFillGradient), (t.__canvasFillGradient = _)),
      m && ((S = c ? mh(e, d, T) : t.__canvasStrokeGradient), (t.__canvasStrokeGradient = S)),
      g && ((b = c || !t.__canvasFillPattern ? yh(e, v, t) : t.__canvasFillPattern), (t.__canvasFillPattern = b)),
      y && ((w = c || !t.__canvasStrokePattern ? yh(e, d, t) : t.__canvasStrokePattern), (t.__canvasStrokePattern = w)),
      p ? (e.fillStyle = _) : g && (b ? (e.fillStyle = b) : (s = !1)),
      m ? (e.strokeStyle = S) : y && (w ? (e.strokeStyle = w) : (o = !1)));
  }
  var C = t.getGlobalScale();
  h.setScale(C[0], C[1], t.segmentIgnoreThreshold);
  var A, M;
  e.setLineDash && r.lineDash && ((a = h_(t)), (A = a[0]), (M = a[1]));
  var D = !0;
  ((f || c & ei) &&
    (h.setDPR(e.dpr),
    u ? h.setContext(null) : (h.setContext(e), (D = !1)),
    h.reset(),
    t.buildPath(h, t.shape, n),
    h.toStatic(),
    t.pathUpdated()),
    D && h.rebuildPath(e, u ? l : 1),
    A && (e.setLineDash(A), (e.lineDashOffset = M)),
    n
      ? ((i.batchFill = s), (i.batchStroke = o))
      : r.strokeFirst
        ? (o && Up(e, r), s && Gp(e, r))
        : (s && Gp(e, r), o && Up(e, r)),
    A && e.setLineDash([]));
}
function RM(e, t, r) {
  var n = (t.__image = wy(r.image, t.__image, t, t.onload));
  if (!(!n || !pl(n))) {
    var i = r.x || 0,
      a = r.y || 0,
      o = t.getWidth(),
      s = t.getHeight(),
      l = n.width / n.height;
    if (
      (o == null && s != null
        ? (o = s * l)
        : s == null && o != null
          ? (s = o / l)
          : o == null && s == null && ((o = n.width), (s = n.height)),
      r.sWidth && r.sHeight)
    ) {
      var u = r.sx || 0,
        f = r.sy || 0;
      e.drawImage(n, u, f, r.sWidth, r.sHeight, i, a, o, s);
    } else if (r.sx && r.sy) {
      var u = r.sx,
        f = r.sy,
        h = o - u,
        c = s - f;
      e.drawImage(n, u, f, h, c, i, a, o, s);
    } else e.drawImage(n, i, a, o, s);
  }
}
function OM(e, t, r) {
  var n,
    i = r.text;
  if ((i != null && (i += ""), i)) {
    ((e.font = r.font || Nr), (e.textAlign = r.textAlign), (e.textBaseline = r.textBaseline));
    var a = void 0,
      o = void 0;
    (e.setLineDash && r.lineDash && ((n = h_(t)), (a = n[0]), (o = n[1])),
      a && (e.setLineDash(a), (e.lineDashOffset = o)),
      r.strokeFirst
        ? ($s(r) && e.strokeText(i, r.x, r.y), Zs(r) && e.fillText(i, r.x, r.y))
        : (Zs(r) && e.fillText(i, r.x, r.y), $s(r) && e.strokeText(i, r.x, r.y)),
      a && e.setLineDash([]));
  }
}
var Wp = ["shadowBlur", "shadowOffsetX", "shadowOffsetY"],
  Yp = [
    ["lineCap", "butt"],
    ["lineJoin", "miter"],
    ["miterLimit", 10],
  ];
function c_(e, t, r, n, i) {
  var a = !1;
  if (!n && ((r = r || {}), t === r)) return !1;
  if (n || t.opacity !== r.opacity) {
    (Kt(e, i), (a = !0));
    var o = Math.max(Math.min(t.opacity, 1), 0);
    e.globalAlpha = isNaN(o) ? Mn.opacity : o;
  }
  (n || t.blend !== r.blend) && (a || (Kt(e, i), (a = !0)), (e.globalCompositeOperation = t.blend || Mn.blend));
  for (var s = 0; s < Wp.length; s++) {
    var l = Wp[s];
    (n || t[l] !== r[l]) && (a || (Kt(e, i), (a = !0)), (e[l] = e.dpr * (t[l] || 0)));
  }
  return (
    (n || t.shadowColor !== r.shadowColor) &&
      (a || (Kt(e, i), (a = !0)), (e.shadowColor = t.shadowColor || Mn.shadowColor)),
    a
  );
}
function Xp(e, t, r, n, i) {
  var a = t.style,
    o = n ? null : (r && r.style) || {};
  if (a === o) return !1;
  var s = c_(e, a, o, n, i);
  if (
    ((n || a.fill !== o.fill) && (s || (Kt(e, i), (s = !0)), Vp(a.fill) && (e.fillStyle = a.fill)),
    (n || a.stroke !== o.stroke) && (s || (Kt(e, i), (s = !0)), Vp(a.stroke) && (e.strokeStyle = a.stroke)),
    (n || a.opacity !== o.opacity) && (s || (Kt(e, i), (s = !0)), (e.globalAlpha = a.opacity == null ? 1 : a.opacity)),
    t.hasStroke())
  ) {
    var l = a.lineWidth,
      u = l / (a.strokeNoScale && t.getLineScale ? t.getLineScale() : 1);
    e.lineWidth !== u && (s || (Kt(e, i), (s = !0)), (e.lineWidth = u));
  }
  for (var f = 0; f < Yp.length; f++) {
    var h = Yp[f],
      c = h[0];
    (n || a[c] !== o[c]) && (s || (Kt(e, i), (s = !0)), (e[c] = a[c] || h[1]));
  }
  return s;
}
function kM(e, t, r, n, i) {
  return c_(e, t.style, r && r.style, n, i);
}
function v_(e, t) {
  var r = t.transform,
    n = e.dpr || 1;
  r ? e.setTransform(n * r[0], n * r[1], n * r[2], n * r[3], n * r[4], n * r[5]) : e.setTransform(n, 0, 0, n, 0, 0);
}
function BM(e, t, r) {
  for (var n = !1, i = 0; i < e.length; i++) {
    var a = e[i];
    ((n = n || a.isZeroArea()), v_(t, a), t.beginPath(), a.buildPath(t, a.shape), t.clip());
  }
  r.allClipped = n;
}
function NM(e, t) {
  return e && t
    ? e[0] !== t[0] || e[1] !== t[1] || e[2] !== t[2] || e[3] !== t[3] || e[4] !== t[4] || e[5] !== t[5]
    : !(!e && !t);
}
var $p = 1,
  Zp = 2,
  qp = 3,
  Kp = 4;
function FM(e) {
  var t = Zs(e),
    r = $s(e);
  return !(
    e.lineDash ||
    !(+t ^ +r) ||
    (t && typeof e.fill != "string") ||
    (r && typeof e.stroke != "string") ||
    e.strokePercent < 1 ||
    e.strokeOpacity < 1 ||
    e.fillOpacity < 1
  );
}
function Kt(e, t) {
  (t.batchFill && ((t.batchFill = !1), e.fill()), t.batchStroke && ((t.batchStroke = !1), e.stroke()));
}
function d_(e, t) {
  var r = { inHover: !1, viewWidth: 0, viewHeight: 0, beforeBrushParam: {} };
  (Cn(e, t, r), di(e, r));
}
function Cn(e, t, r) {
  var n = t.transform;
  if (!t.shouldBePainted(r.viewWidth, r.viewHeight, !1, !1)) {
    ((t.__dirty &= ~ie), (t.__isRendered = !1));
    return;
  }
  var i = t.__clipPaths,
    a = r.prevElClipPaths,
    o = t.style,
    s = !1,
    l = !1;
  if (
    ((!a || IM(i, a)) &&
      (a && (Kt(e, r), e.restore(), (l = s = !0), (r.prevElClipPaths = null), (r.allClipped = !1), (r.prevEl = null)),
      i && i.length && (Kt(e, r), e.save(), BM(i, e, r), (s = !0), (r.prevElClipPaths = i))),
    r.allClipped)
  ) {
    ((t.__dirty &= ~ie), (t.__isRendered = !1));
    return;
  }
  (t.beforeBrush && t.beforeBrush(r.beforeBrushParam), t.innerBeforeBrush());
  var u = r.prevEl;
  u || (l = s = !0);
  var f = t instanceof gt && t.autoBatch && FM(o);
  (s || NM(n, u.transform) ? (Kt(e, r), v_(e, t)) : f || Kt(e, r),
    t instanceof gt
      ? (r.lastDrawType !== $p && ((l = !0), (r.lastDrawType = $p)),
        Xp(e, t, u, l, r),
        (!f || (!r.batchFill && !r.batchStroke)) && e.beginPath(),
        EM(e, t, o, f, r))
      : t instanceof ks
        ? (r.lastDrawType !== qp && ((l = !0), (r.lastDrawType = qp)), Xp(e, t, u, l, r), OM(e, t, o))
        : t instanceof Ur
          ? (r.lastDrawType !== Zp && ((l = !0), (r.lastDrawType = Zp)), kM(e, t, u, l, r), RM(e, t, o))
          : t.getTemporalDisplayables && (r.lastDrawType !== Kp && ((l = !0), (r.lastDrawType = Kp)), zM(e, t, r)),
    t.innerAfterBrush(),
    t.afterBrush && (f && Kt(e, r), t.afterBrush()),
    (r.prevEl = t),
    (t.__dirty = 0),
    (t.__isRendered = !0));
}
function di(e, t) {
  (Kt(e, t), t.prevElClipPaths && e.restore());
}
function zM(e, t, r) {
  var n = t.getDisplayables(),
    i = t.getTemporalDisplayables();
  e.save();
  var a = {
      prevElClipPaths: null,
      prevEl: null,
      allClipped: !1,
      viewWidth: r.viewWidth,
      viewHeight: r.viewHeight,
      inHover: r.inHover,
      beforeBrushParam: {},
    },
    o,
    s;
  for (o = t.getCursor(), s = n.length; o < s; o++) {
    var l = n[o];
    (l.beforeBrush && l.beforeBrush(r.beforeBrushParam),
      l.innerBeforeBrush(),
      Cn(e, l, a),
      l.innerAfterBrush(),
      l.afterBrush && l.afterBrush(),
      (a.prevEl = l));
  }
  di(e, a);
  for (var u = 0, f = i.length; u < f; u++) {
    var l = i[u];
    (l.beforeBrush && l.beforeBrush(r.beforeBrushParam),
      l.innerBeforeBrush(),
      Cn(e, l, a),
      l.innerAfterBrush(),
      l.afterBrush && l.afterBrush(),
      (a.prevEl = l));
  }
  (di(e, a), t.clearTemporalDisplayables(), (t.notClear = !0), e.restore());
}
var Xu = new mM(),
  Qp = new mi(100),
  jp = [
    "symbol",
    "symbolSize",
    "symbolKeepAspect",
    "color",
    "backgroundColor",
    "dashArrayX",
    "dashArrayY",
    "maxTileWidth",
    "maxTileHeight",
  ];
function _h(e, t) {
  if (e === "none") return null;
  var r = t.getDevicePixelRatio(),
    n = t.getZr(),
    i = n.painter.type === "svg";
  e.dirty && Xu.delete(e);
  var a = Xu.get(e);
  if (a) return a;
  var o = mt(e, {
    symbol: "rect",
    symbolSize: 1,
    symbolKeepAspect: !0,
    color: "rgba(0, 0, 0, 0.2)",
    backgroundColor: null,
    dashArrayX: 5,
    dashArrayY: 5,
    rotation: 0,
    maxTileWidth: 512,
    maxTileHeight: 512,
  });
  o.backgroundColor === "none" && (o.backgroundColor = null);
  var s = { repeat: "repeat" };
  return (l(s), (s.rotation = o.rotation), (s.scaleX = s.scaleY = i ? 1 : 1 / r), Xu.set(e, s), (e.dirty = !1), s);
  function l(u) {
    for (var f = [r], h = !0, c = 0; c < jp.length; ++c) {
      var v = o[jp[c]];
      if (v != null && !U(v) && !Y(v) && !wt(v) && typeof v != "boolean") {
        h = !1;
        break;
      }
      f.push(v);
    }
    var d;
    if (h) {
      d = f.join(",") + (i ? "-svg" : "");
      var p = Qp.get(d);
      p && (i ? (u.svgElement = p) : (u.image = p));
    }
    var m = g_(o.dashArrayX),
      g = HM(o.dashArrayY),
      y = p_(o.symbol),
      _ = VM(m),
      S = m_(g),
      b = !i && fe.createCanvas(),
      w = i && { tag: "g", attrs: {}, key: "dcl", children: [] },
      T = A(),
      C;
    (b && ((b.width = T.width * r), (b.height = T.height * r), (C = b.getContext("2d"))),
      M(),
      h && Qp.put(d, b || w),
      (u.image = b),
      (u.svgElement = w),
      (u.svgWidth = T.width),
      (u.svgHeight = T.height));
    function A() {
      for (var D = 1, P = 0, x = _.length; P < x; ++P) D = ld(D, _[P]);
      for (var L = 1, P = 0, x = y.length; P < x; ++P) L = ld(L, y[P].length);
      D *= L;
      var E = S * _.length * y.length;
      return { width: Math.max(1, Math.min(D, o.maxTileWidth)), height: Math.max(1, Math.min(E, o.maxTileHeight)) };
    }
    function M() {
      C &&
        (C.clearRect(0, 0, b.width, b.height),
        o.backgroundColor && ((C.fillStyle = o.backgroundColor), C.fillRect(0, 0, b.width, b.height)));
      for (var D = 0, P = 0; P < g.length; ++P) D += g[P];
      if (D <= 0) return;
      for (var x = -S, L = 0, E = 0, R = 0; x < T.height; ) {
        if (L % 2 === 0) {
          for (var B = (E / 2) % y.length, O = 0, k = 0, z = 0; O < T.width * 2; ) {
            for (var H = 0, P = 0; P < m[R].length; ++P) H += m[R][P];
            if (H <= 0) break;
            if (k % 2 === 0) {
              var W = (1 - o.symbolSize) * 0.5,
                $ = O + m[R][k] * W,
                G = x + g[L] * W,
                K = m[R][k] * o.symbolSize,
                at = g[L] * o.symbolSize,
                Et = (z / 2) % y[B].length;
              Jt($, G, K, at, y[B][Et]);
            }
            ((O += m[R][k]), ++z, ++k, k === m[R].length && (k = 0));
          }
          (++R, R === m.length && (R = 0));
        }
        ((x += g[L]), ++E, ++L, L === g.length && (L = 0));
      }
      function Jt(yt, Dt, tt, st, Wr) {
        var Xt = i ? 1 : r,
          mv = Ti(Wr, yt * Xt, Dt * Xt, tt * Xt, st * Xt, o.color, o.symbolKeepAspect);
        if (i) {
          var yv = n.painter.renderOneToVNode(mv);
          yv && w.children.push(yv);
        } else d_(C, mv);
      }
    }
  }
}
function p_(e) {
  if (!e || e.length === 0) return [["rect"]];
  if (Y(e)) return [[e]];
  for (var t = !0, r = 0; r < e.length; ++r)
    if (!Y(e[r])) {
      t = !1;
      break;
    }
  if (t) return p_([e]);
  for (var n = [], r = 0; r < e.length; ++r) Y(e[r]) ? n.push([e[r]]) : n.push(e[r]);
  return n;
}
function g_(e) {
  if (!e || e.length === 0) return [[0, 0]];
  if (wt(e)) {
    var t = Math.ceil(e);
    return [[t, t]];
  }
  for (var r = !0, n = 0; n < e.length; ++n)
    if (!wt(e[n])) {
      r = !1;
      break;
    }
  if (r) return g_([e]);
  for (var i = [], n = 0; n < e.length; ++n)
    if (wt(e[n])) {
      var t = Math.ceil(e[n]);
      i.push([t, t]);
    } else {
      var t = j(e[n], function (s) {
        return Math.ceil(s);
      });
      t.length % 2 === 1 ? i.push(t.concat(t)) : i.push(t);
    }
  return i;
}
function HM(e) {
  if (!e || (typeof e == "object" && e.length === 0)) return [0, 0];
  if (wt(e)) {
    var t = Math.ceil(e);
    return [t, t];
  }
  var r = j(e, function (n) {
    return Math.ceil(n);
  });
  return e.length % 2 ? r.concat(r) : r;
}
function VM(e) {
  return j(e, function (t) {
    return m_(t);
  });
}
function m_(e) {
  for (var t = 0, r = 0; r < e.length; ++r) t += e[r];
  return e.length % 2 === 1 ? t * 2 : t;
}
var GM = lc(UM);
function UM(e, t) {
  e.eachRawSeries(function (r) {
    if (!e.isSeriesFiltered(r)) {
      var n = r.getData();
      n.hasItemVisual() &&
        n.each(function (o) {
          var s = n.getItemVisual(o, "decal");
          if (s) {
            var l = n.ensureUniqueItemVisual(o, "style");
            l.decal = _h(s, t);
          }
        });
      var i = n.getVisual("decal");
      if (i) {
        var a = n.getVisual("style");
        a.decal = _h(i, t);
      }
    }
  });
}
var WM = 1,
  YM = 800,
  XM = 900,
  $M = 920,
  ZM = 1e3,
  qM = 2e3,
  Jp = 5e3,
  y_ = 1e3,
  KM = 1100,
  Zc = 2e3,
  __ = 3e3,
  QM = 4e3,
  kl = 4500,
  jM = 4600,
  JM = 5e3,
  tI = 6e3,
  S_ = 7e3,
  eI = {
    PROCESSOR: { SERIES_FILTER: YM, AXIS_STATISTICS: $M, FILTER: ZM, STATISTIC: Jp, STATISTICS: Jp },
    VISUAL: {
      LAYOUT: y_,
      PROGRESSIVE_LAYOUT: KM,
      GLOBAL: Zc,
      CHART: __,
      POST_CHART_LAYOUT: jM,
      COMPONENT: QM,
      BRUSH: JM,
      CHART_ITEM: kl,
      ARIA: tI,
      DECAL: S_,
    },
  },
  Lt = "__flagInMainProcess",
  ko = "__mainProcessVersion",
  Ot = "__pendingUpdate",
  $u = "__needsUpdateStatus",
  tg = /^[a-zA-Z0-9_]+$/,
  Zu = "__connectUpdateStatus",
  eg = 0,
  rI = 1,
  nI = 2;
function b_(e) {
  return function () {
    for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
    if (this.isDisposed()) {
      this.id;
      return;
    }
    return T_(this, e, t);
  };
}
function w_(e) {
  return function () {
    for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
    return T_(this, e, t);
  };
}
function T_(e, t, r) {
  return ((r[0] = r[0] && r[0].toLowerCase()), nr.prototype[t].apply(e, r));
}
var x_ = (function (e) {
    V(t, e);
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    return t;
  })(nr),
  C_ = x_.prototype;
C_.on = w_("on");
C_.off = w_("off");
var mn,
  qu,
  Bo,
  sr,
  No,
  Ku,
  Qu,
  Kn,
  Qn,
  rg,
  ng,
  ju,
  ig,
  Fo,
  ag,
  D_,
  de,
  og,
  jn,
  A_ = (function (e) {
    V(t, e);
    function t(r, n, i) {
      var a = e.call(this, new iM()) || this;
      ((a._chartsViews = []),
        (a._chartsMap = {}),
        (a._componentsViews = []),
        (a._componentsMap = {}),
        (a._pendingActions = []),
        (i = i || {}),
        (a.__v_skip = !0),
        (a._dom = r));
      var o = "canvas",
        s = "auto",
        l = !1;
      ((a[ko] = 1), i.ssr);
      var u = (a._zr = id(r, {
        renderer: i.renderer || o,
        devicePixelRatio: i.devicePixelRatio,
        width: i.width,
        height: i.height,
        ssr: i.ssr,
        useDirtyRect: q(i.useDirtyRect, l),
        useCoarsePointer: q(i.useCoarsePointer, s),
        pointerSize: i.pointerSize,
      }));
      ((a._ssr = i.ssr),
        (a._throttledZrFlush = Rl(Tt(u.flush, u), 17)),
        a._updateTheme(n),
        (a._locale = jC(i.locale || d0)),
        (a._coordSysMgr = new zc()));
      var f = (a._api = ag(a));
      function h(c, v) {
        return c.__prio - v.__prio;
      }
      return (
        rs(Ks, h),
        rs(wh, h),
        (a._scheduler = new i_(a, f, wh, Ks)),
        (a._messageCenter = new x_()),
        a._initEvents(),
        (a.resize = Tt(a.resize, a)),
        u.animation.on("frame", a._onframe, a),
        rg(u, a),
        ng(u, a),
        xf(a),
        a
      );
    }
    return (
      (t.prototype._onframe = function () {
        if (!this._disposed) {
          var r = this._scheduler,
            n = this._model,
            i = this._api;
          if ((og(this), this[Ot])) {
            var a = this[Ot].silent;
            ((this[Lt] = !0), jn(this));
            try {
              (mn(this), sr.update.call(this, null, this[Ot].updateParams));
            } catch (l) {
              throw ((this[Lt] = !1), (this[Ot] = null), l);
            }
            (this._zr.flush(), (this[Lt] = !1), (this[Ot] = null), Kn.call(this, a), Qn.call(this, a));
          } else if (r.unfinished) {
            var o = WM;
            do {
              r.unfinished = !1;
              var s = fe.getTime();
              (r.performSeriesTasks(n),
                r.performDataProcessorTasks(n),
                Ku(this, n),
                r.performVisualTasks(n),
                Fo(this, this._model, i, "remain", {}),
                (o -= fe.getTime() - s));
            } while (o > 0 && r.unfinished);
            r.unfinished || this._zr.flush();
          }
        }
      }),
      (t.prototype.getDom = function () {
        return this._dom;
      }),
      (t.prototype.getId = function () {
        return this.id;
      }),
      (t.prototype.getZr = function () {
        return this._zr;
      }),
      (t.prototype.isSSR = function () {
        return this._ssr;
      }),
      (t.prototype.setOption = function (r, n, i) {
        if (!this[Lt]) {
          if (this._disposed) {
            this.id;
            return;
          }
          var a, o, s;
          if (
            (Z(n) && ((i = n.lazyUpdate), (a = n.silent), (o = n.replaceMerge), (s = n.transition), (n = n.notMerge)),
            (this[Lt] = !0),
            jn(this),
            !this._model || n)
          ) {
            var l = new FD(this._api),
              u = this._theme,
              f = (this._model = new Uc());
            ((f.scheduler = this._scheduler), (f.ssr = this._ssr), f.init(null, null, null, u, this._locale, l));
          }
          this._model.setOption(r, { replaceMerge: o }, Th);
          var h = { seriesTransition: s, optionChanged: !0 };
          if (i) ((this[Ot] = { silent: a, updateParams: h }), (this[Lt] = !1), this.getZr().wakeUp());
          else {
            try {
              (mn(this), sr.update.call(this, null, h));
            } catch (c) {
              throw ((this[Ot] = null), (this[Lt] = !1), c);
            }
            (this._ssr || this._zr.flush(), (this[Ot] = null), (this[Lt] = !1), Kn.call(this, a), Qn.call(this, a));
          }
        }
      }),
      (t.prototype.setTheme = function (r, n) {
        if (!this[Lt]) {
          if (this._disposed) {
            this.id;
            return;
          }
          var i = this._model;
          if (i) {
            var a = n && n.silent,
              o = null;
            (this[Ot] && (a == null && (a = this[Ot].silent), (o = this[Ot].updateParams), (this[Ot] = null)),
              (this[Lt] = !0),
              jn(this));
            try {
              (this._updateTheme(r), i.setTheme(this._theme), mn(this), sr.update.call(this, { type: "setTheme" }, o));
            } catch (s) {
              throw ((this[Lt] = !1), s);
            }
            ((this[Lt] = !1), Kn.call(this, a), Qn.call(this, a));
          }
        }
      }),
      (t.prototype._updateTheme = function (r) {
        (Y(r) && (r = M_[r]), r && ((r = ot(r)), r && k0(r, !0), (this._theme = r)));
      }),
      (t.prototype.getModel = function () {
        return this._model;
      }),
      (t.prototype.getOption = function () {
        return this._model && this._model.getOption();
      }),
      (t.prototype.getWidth = function () {
        return this._zr.getWidth();
      }),
      (t.prototype.getHeight = function () {
        return this._zr.getHeight();
      }),
      (t.prototype.getDevicePixelRatio = function () {
        return this._zr.painter.dpr || (nt.hasGlobalWindow && window.devicePixelRatio) || 1;
      }),
      (t.prototype.getRenderedCanvas = function (r) {
        return this.renderToCanvas(r);
      }),
      (t.prototype.renderToCanvas = function (r) {
        r = r || {};
        var n = this._zr.painter;
        return n.getRenderedCanvas({
          backgroundColor: r.backgroundColor || this._model.get("backgroundColor"),
          pixelRatio: r.pixelRatio || this.getDevicePixelRatio(),
        });
      }),
      (t.prototype.renderToSVGString = function (r) {
        r = r || {};
        var n = this._zr.painter;
        return n.renderToString({ useViewBox: r.useViewBox });
      }),
      (t.prototype.getSvgDataURL = function () {
        var r = this._zr,
          n = r.storage.getDisplayList();
        return (
          I(n, function (i) {
            i.stopAnimation(null, !0);
          }),
          r.painter.toDataURL()
        );
      }),
      (t.prototype.getDataURL = function (r) {
        if (this._disposed) {
          this.id;
          return;
        }
        r = r || {};
        var n = r.excludeComponents,
          i = this._model,
          a = [],
          o = this;
        I(n, function (l) {
          i.eachComponent({ mainType: l }, function (u) {
            var f = o._componentsMap[u.__viewId];
            f.group.ignore || (a.push(f), (f.group.ignore = !0));
          });
        });
        var s =
          this._zr.painter.getType() === "svg"
            ? this.getSvgDataURL()
            : this.renderToCanvas(r).toDataURL("image/" + ((r && r.type) || "png"));
        return (
          I(a, function (l) {
            l.group.ignore = !1;
          }),
          s
        );
      }),
      (t.prototype.getConnectedDataURL = function (r) {
        if (this._disposed) {
          this.id;
          return;
        }
        var n = r.type === "svg",
          i = this.group,
          a = Math.min,
          o = Math.max,
          s = 1 / 0;
        if (sg[i]) {
          var l = s,
            u = s,
            f = -s,
            h = -s,
            c = [],
            v = (r && r.pixelRatio) || this.getDevicePixelRatio();
          (I(Ta, function (_, S) {
            if (_.group === i) {
              var b = n ? _.getZr().painter.getSvgDom().innerHTML : _.renderToCanvas(ot(r)),
                w = _.getDom().getBoundingClientRect();
              ((l = a(w.left, l)),
                (u = a(w.top, u)),
                (f = o(w.right, f)),
                (h = o(w.bottom, h)),
                c.push({ dom: b, left: w.left, top: w.top }));
            }
          }),
            (l *= v),
            (u *= v),
            (f *= v),
            (h *= v));
          var d = f - l,
            p = h - u,
            m = fe.createCanvas(),
            g = id(m, { renderer: n ? "svg" : "canvas" });
          if ((g.resize({ width: d, height: p }), n)) {
            var y = "";
            return (
              I(c, function (_) {
                var S = _.left - l,
                  b = _.top - u;
                y += '<g transform="translate(' + S + "," + b + ')">' + _.dom + "</g>";
              }),
              (g.painter.getSvgRoot().innerHTML = y),
              r.connectedBackgroundColor && g.painter.setBackgroundColor(r.connectedBackgroundColor),
              g.refreshImmediately(),
              g.painter.toDataURL()
            );
          } else
            return (
              r.connectedBackgroundColor &&
                g.add(
                  new Mt({ shape: { x: 0, y: 0, width: d, height: p }, style: { fill: r.connectedBackgroundColor } }),
                ),
              I(c, function (_) {
                var S = new Ur({ style: { x: _.left * v - l, y: _.top * v - u, image: _.dom } });
                g.add(S);
              }),
              g.refreshImmediately(),
              m.toDataURL("image/" + ((r && r.type) || "png"))
            );
        } else return this.getDataURL(r);
      }),
      (t.prototype.convertToPixel = function (r, n, i) {
        return No(this, "convertToPixel", r, n, i);
      }),
      (t.prototype.convertToLayout = function (r, n, i) {
        return No(this, "convertToLayout", r, n, i);
      }),
      (t.prototype.convertFromPixel = function (r, n, i) {
        return No(this, "convertFromPixel", r, n, i);
      }),
      (t.prototype.containPixel = function (r, n) {
        if (this._disposed) {
          this.id;
          return;
        }
        var i = this._model,
          a,
          o = yu(i, r);
        return (
          I(
            o,
            function (s, l) {
              l.indexOf("Models") >= 0 &&
                I(
                  s,
                  function (u) {
                    var f = u.coordinateSystem;
                    if (f && f.containPoint) a = a || !!f.containPoint(n);
                    else if (l === "seriesModels") {
                      var h = this._chartsMap[u.__viewId];
                      h && h.containPoint && (a = a || h.containPoint(n, u));
                    }
                  },
                  this,
                );
            },
            this,
          ),
          !!a
        );
      }),
      (t.prototype.getVisual = function (r, n) {
        var i = this._model,
          a = yu(i, r, { defaultMainType: "series" }),
          o = a.seriesModel,
          s = o.getData(),
          l = a.hasOwnProperty("dataIndexInside")
            ? a.dataIndexInside
            : a.hasOwnProperty("dataIndex")
              ? s.indexOfRawIndex(a.dataIndex)
              : null;
        return l != null ? sM(s, l, n) : lM(s, n);
      }),
      (t.prototype.getViewOfComponentModel = function (r) {
        return this._componentsMap[r.__viewId];
      }),
      (t.prototype.getViewOfSeriesModel = function (r) {
        return this._chartsMap[r.__viewId];
      }),
      (t.prototype._initEvents = function () {
        var r = this;
        I(iI, function (i) {
          var a = function (o) {
            var s = r.getModel(),
              l = o.target,
              u,
              f = i === "globalout";
            if (
              (f
                ? (u = {})
                : l &&
                  ha(
                    l,
                    function (p) {
                      var m = ut(p);
                      if (m && m.dataIndex != null) {
                        var g = m.dataModel || s.getSeriesByIndex(m.seriesIndex);
                        return ((u = (g && g.getDataParams(m.dataIndex, m.dataType, l)) || {}), !0);
                      } else if (m.eventData) return ((u = N({}, m.eventData)), !0);
                    },
                    !0,
                  ),
              u)
            ) {
              var h = u.componentType,
                c = u.componentIndex;
              (h === "markLine" || h === "markPoint" || h === "markArea") && ((h = "series"), (c = u.seriesIndex));
              var v = h && c != null && s.getComponent(h, c),
                d = v && r[v.mainType === "series" ? "_chartsMap" : "_componentsMap"][v.__viewId];
              ((u.event = o),
                (u.type = i),
                (r._$eventProcessor.eventInfo = { targetEl: l, packedEvent: u, model: v, view: d }),
                r.trigger(i, u));
            }
          };
          ((a.zrEventfulCallAtLast = !0), r._zr.on(i, a, r));
        });
        var n = this._messageCenter;
        (I(bh, function (i, a) {
          n.on(a, function (o) {
            r.trigger(a, o);
          });
        }),
          uM(n, this, this._api));
      }),
      (t.prototype.isDisposed = function () {
        return this._disposed;
      }),
      (t.prototype.clear = function () {
        if (this._disposed) {
          this.id;
          return;
        }
        this.setOption({ series: [] }, !0);
      }),
      (t.prototype.dispose = function () {
        if (this._disposed) {
          this.id;
          return;
        }
        this._disposed = !0;
        var r = this.getDom();
        r && py(this.getDom(), Kc, "");
        var n = this,
          i = n._api,
          a = n._model;
        (I(n._componentsViews, function (o) {
          o.dispose(a, i);
        }),
          I(n._chartsViews, function (o) {
            o.dispose(a, i);
          }),
          n._zr.dispose(),
          (n._dom =
            n._model =
            n._chartsMap =
            n._componentsMap =
            n._chartsViews =
            n._componentsViews =
            n._scheduler =
            n._api =
            n._zr =
            n._throttledZrFlush =
            n._theme =
            n._coordSysMgr =
            n._messageCenter =
              null),
          delete Ta[n.id]);
      }),
      (t.prototype.resize = function (r) {
        if (!this[Lt]) {
          if (this._disposed) {
            this.id;
            return;
          }
          this._zr.resize(r);
          var n = this._model;
          if ((this._loadingFX && this._loadingFX.resize(), !!n)) {
            var i = n.resetOption("media"),
              a = r && r.silent;
            (this[Ot] && (a == null && (a = this[Ot].silent), (i = !0), (this[Ot] = null)), (this[Lt] = !0), jn(this));
            try {
              (i && mn(this),
                sr.update.call(this, { type: "resize", animation: N({ duration: 0 }, r && r.animation) }));
            } catch (o) {
              throw ((this[Lt] = !1), o);
            }
            ((this[Lt] = !1), Kn.call(this, a), Qn.call(this, a));
          }
        }
      }),
      (t.prototype.showLoading = function (r, n) {
        if (this._disposed) {
          this.id;
          return;
        }
        if ((Z(r) && ((n = r), (r = "")), (r = r || "default"), this.hideLoading(), !!xh[r])) {
          var i = xh[r](this._api, n),
            a = this._zr;
          ((this._loadingFX = i), a.add(i));
        }
      }),
      (t.prototype.hideLoading = function () {
        if (this._disposed) {
          this.id;
          return;
        }
        (this._loadingFX && this._zr.remove(this._loadingFX), (this._loadingFX = null));
      }),
      (t.prototype.makeActionFromEvent = function (r) {
        var n = N({}, r);
        return ((n.type = Sh[r.type]), n);
      }),
      (t.prototype.dispatchAction = function (r, n) {
        if (this._disposed) {
          this.id;
          return;
        }
        if ((Z(n) || (n = { silent: !!n }), !!qs[r.type] && this._model)) {
          if (this[Lt]) {
            this._pendingActions.push(r);
            return;
          }
          var i = n.silent;
          Qu.call(this, r, i);
          var a = n.flush;
          (a ? this._zr.flush() : a !== !1 && nt.browser.weChat && this._throttledZrFlush(),
            Kn.call(this, i),
            Qn.call(this, i));
        }
      }),
      (t.prototype.updateLabelLayout = function () {
        ge.trigger("series:layoutlabels", this._model, this._api, { updatedSeries: [] });
      }),
      (t.prototype.appendData = function (r) {
        if (this._disposed) {
          this.id;
          return;
        }
        var n = r.seriesIndex,
          i = this.getModel(),
          a = i.getSeriesByIndex(n);
        (a.appendData(r), (this._scheduler.unfinished = !0), this.getZr().wakeUp());
      }),
      (t.internalField = (function () {
        ((mn = function (h) {
          cM(h._model);
          var c = h._scheduler;
          (c.restorePipelines(h._zr, h._model), c.prepareStageTasks(), qu(h, !0), qu(h, !1), c.plan());
        }),
          (qu = function (h, c) {
            for (
              var v = h._model,
                d = h._scheduler,
                p = c ? h._componentsViews : h._chartsViews,
                m = c ? h._componentsMap : h._chartsMap,
                g = h._zr,
                y = h._api,
                _ = 0;
              _ < p.length;
              _++
            )
              p[_].__alive = !1;
            c
              ? v.eachComponent(function (w, T) {
                  w !== "series" && S(T);
                })
              : v.eachSeries(S);
            function S(w) {
              var T = w.__requireNewView;
              w.__requireNewView = !1;
              var C = "_ec_" + w.id + "_" + w.type,
                A = !T && m[C];
              if (!A) {
                var M = $e(w.type),
                  D = c ? Oe.getClass(M.main, M.sub) : Re.getClass(M.sub);
                ((A = new D()), A.init(v, y), (m[C] = A), p.push(A), g.add(A.group));
              }
              ((w.__viewId = A.__id = C),
                (A.__alive = !0),
                (A.__model = w),
                (A.group.__ecComponentInfo = { mainType: w.mainType, index: w.componentIndex }),
                !c && d.prepareView(A, w, v, y));
            }
            for (var _ = 0; _ < p.length; ) {
              var b = p[_];
              b.__alive
                ? _++
                : (!c && b.renderTask.dispose(),
                  g.remove(b.group),
                  b.dispose(v, y),
                  p.splice(_, 1),
                  m[b.__id] === b && delete m[b.__id],
                  (b.__id = b.group.__ecComponentInfo = null));
            }
          }),
          (Bo = function (h, c, v, d, p) {
            var m = h._model;
            if ((m.setUpdatePayload(v), !d)) {
              I([].concat(h._componentsViews).concat(h._chartsViews), S);
              return;
            }
            var g = nT(v, d, p),
              y = v.excludeSeriesId,
              _;
            (y != null &&
              ((_ = Q()),
              I(jt(y), function (b) {
                var w = je(b, null);
                w != null && _.set(w, !0);
              })),
              m &&
                m.eachComponent(
                  g,
                  function (b) {
                    var w = _ && _.get(b.id) != null;
                    if (!w)
                      if (Hd(v))
                        if (b instanceof er)
                          v.type === In && !v.notBlur && !b.get(["emphasis", "disabled"]) && Ax(b, v, h._api);
                        else {
                          var T = pc(b.mainType, b.componentIndex, v.name, h._api),
                            C = T.focusSelf,
                            A = T.dispatchers;
                          (v.type === In && C && !v.notBlur && Jf(b.mainType, b.componentIndex, h._api),
                            A &&
                              I(A, function (M) {
                                v.type === In ? Fs(M) : zs(M);
                              }));
                        }
                      else nh(v) && b instanceof er && (Lx(b, v, h._api), Fd(b), de(h));
                  },
                  h,
                ),
              m &&
                m.eachComponent(
                  g,
                  function (b) {
                    var w = _ && _.get(b.id) != null;
                    w || S(h[d === "series" ? "_chartsMap" : "_componentsMap"][b.__viewId]);
                  },
                  h,
                ));
            function S(b) {
              b && b.__alive && b[c] && b[c](b.__model, m, h._api, v);
            }
          }),
          (sr = {
            prepareAndUpdate: function (h) {
              (mn(this), sr.update.call(this, h, h && { optionChanged: h.newOption != null }));
            },
            update: function (h, c) {
              var v = this._model,
                d = this._api,
                p = this._zr,
                m = this._coordSysMgr,
                g = this._scheduler;
              if (v) {
                (vM(v),
                  v.setUpdatePayload(h),
                  g.restoreData(v, h),
                  g.performSeriesTasks(v),
                  m.create(v, d),
                  ge.trigger("coordsys:aftercreate", v, d),
                  g.performDataProcessorTasks(v, h),
                  Ku(this, v),
                  m.update(v, d),
                  n(v),
                  g.performVisualTasks(v, h));
                var y = v.get("backgroundColor") || "transparent";
                p.setBackgroundColor(y);
                var _ = v.get("darkMode");
                (_ != null && _ !== "auto" && p.setDarkMode(_), ju(this, v, d, h, c), ge.trigger("afterupdate", v, d));
              }
            },
            updateTransform: function (h) {
              var c = this,
                v = c._model,
                d = c._api;
              if (v) {
                v.setUpdatePayload(h);
                var p = [];
                v.eachComponent(function (g, y) {
                  if (g !== Py) {
                    var _ = c.getViewOfComponentModel(y);
                    if (_ && _.__alive)
                      if (_.updateTransform) {
                        var S = _.updateTransform(y, v, d, h);
                        S && S.update && p.push(_);
                      } else p.push(_);
                  }
                });
                var m = Q();
                (v.eachSeries(function (g) {
                  var y = c._chartsMap[g.__viewId],
                    _ = g.pipelineContext;
                  if (y.updateTransform && !_.progressiveRender) {
                    var S = y.updateTransform(g, v, d, h);
                    S && S.update && m.set(g.uid, 1);
                  } else m.set(g.uid, 1);
                }),
                  c._scheduler.performVisualTasks(v, h, { setDirty: !0, dirtyMap: m }),
                  Fo(c, v, d, h, {}, m),
                  ge.trigger("afterupdate", v, d));
              }
            },
            updateView: function (h) {
              var c = this._model;
              c &&
                (c.setUpdatePayload(h),
                Re.markUpdateMethod(h, "updateView"),
                n(c),
                this._scheduler.performVisualTasks(c, h, { setDirty: !0 }),
                ju(this, c, this._api, h, {}),
                ge.trigger("afterupdate", c, this._api));
            },
            updateVisual: function (h) {
              var c = this,
                v = this._model;
              v &&
                (v.setUpdatePayload(h),
                v.eachSeries(function (d) {
                  d.getData().clearAllVisual();
                }),
                Re.markUpdateMethod(h, "updateVisual"),
                n(v),
                this._scheduler.performVisualTasks(v, h, { visualType: "visual", setDirty: !0 }),
                v.eachComponent(function (d, p) {
                  if (d !== "series") {
                    var m = c.getViewOfComponentModel(p);
                    m && m.__alive && m.updateVisual(p, v, c._api, h);
                  }
                }),
                v.eachSeries(function (d) {
                  var p = c._chartsMap[d.__viewId];
                  p.updateVisual(d, v, c._api, h);
                }),
                ge.trigger("afterupdate", v, this._api));
            },
            updateLayout: function (h) {
              sr.update.call(this, h);
            },
          }));
        function r(h, c, v, d, p) {
          if (h._disposed) {
            h.id;
            return;
          }
          for (var m = h._model, g = h._coordSysMgr.getCoordinateSystems(), y, _ = yu(m, v), S = 0; S < g.length; S++) {
            var b = g[S];
            if (b[c] && (y = b[c](m, _, d, p)) != null) return y;
          }
        }
        ((No = r),
          (Ku = function (h, c) {
            var v = h._chartsMap,
              d = h._scheduler;
            c.eachSeries(function (p) {
              d.updateStreamModes(p, v[p.__viewId]);
            });
          }),
          (Qu = function (h, c) {
            var v = this,
              d = this.getModel(),
              p = h.type,
              m = h.escapeConnect,
              g = qs[p],
              y = (g.update || "update").split(":"),
              _ = y.pop(),
              S = y[0] != null && $e(y[0]);
            ((this[Lt] = !0), jn(this));
            var b = [h],
              w = !1;
            h.batch &&
              ((w = !0),
              (b = j(h.batch, function (R) {
                return ((R = mt(N({}, R), h)), (R.batch = null), R);
              })));
            var T = [],
              C,
              A = [],
              M = g.nonRefinedEventType,
              D = nh(h),
              P = Hd(h);
            if (
              (P && Uy(this._api),
              I(b, function (R) {
                var B = g.action(R, d, v._api);
                if ((g.refineEvent ? A.push(B) : (C = B), (C = C || N({}, R)), (C.type = M), T.push(C), P)) {
                  var O = oc(h),
                    k = O.queryOptionMap,
                    z = O.mainTypeSpecified,
                    H = z ? k.keys()[0] : "series";
                  (Bo(v, _, R, H), de(v));
                } else D ? (Bo(v, _, R, "series"), de(v)) : S && Bo(v, _, R, S.main, S.sub);
              }),
              _ !== "none" && !P && !D && !S)
            )
              try {
                this[Ot] ? (mn(this), sr.update.call(this, h), (this[Ot] = null)) : sr[_].call(this, h);
              } catch (R) {
                throw ((this[Lt] = !1), R);
              }
            if ((w ? (C = { type: M, escapeConnect: m, batch: T }) : (C = T[0]), (this[Lt] = !1), !c)) {
              var x = void 0;
              if (g.refineEvent) {
                var L = g.refineEvent(A, h, d, this._api).eventContent;
                (vr(Z(L)),
                  (x = mt({ type: g.refinedEventType }, L)),
                  (x.fromAction = h.type),
                  (x.fromActionPayload = h),
                  (x.escapeConnect = !0));
              }
              var E = this._messageCenter;
              (E.trigger(C.type, C), x && E.trigger(x.type, x));
            }
          }),
          (Kn = function (h) {
            for (var c = this._pendingActions; c.length; ) {
              var v = c.shift();
              Qu.call(this, v, h);
            }
          }),
          (Qn = function (h) {
            !h && this.trigger("updated");
          }),
          (rg = function (h, c) {
            h.on("rendered", function (v) {
              (c.trigger("rendered", v),
                h.animation.isFinished() && !c[Ot] && !c._scheduler.unfinished && !c._pendingActions.length
                  ? c.trigger("finished")
                  : h.refresh());
            });
          }),
          (ng = function (h, c) {
            h.on("mouseover", function (v) {
              var d = v.target,
                p = ha(d, rh);
              p && (Mx(p, v, c._api), de(c));
            })
              .on("mouseout", function (v) {
                var d = v.target,
                  p = ha(d, rh);
                p && (Ix(p, v, c._api), de(c));
              })
              .on("click", function (v) {
                var d = v.target,
                  p = ha(
                    d,
                    function (y) {
                      return ut(y).dataIndex != null;
                    },
                    !0,
                  );
                if (p) {
                  var m = p.selected ? "unselect" : "select",
                    g = ut(p);
                  c._api.dispatchAction({
                    type: m,
                    dataType: g.dataType,
                    dataIndexInside: g.dataIndex,
                    seriesIndex: g.seriesIndex,
                    isFromClick: !0,
                  });
                }
              });
          }));
        function n(h) {
          (h.clearColorPalette(),
            h.eachSeries(function (c) {
              c.clearColorPalette();
            }));
        }
        function i(h) {
          var c = [],
            v = [],
            d = !1;
          if (
            (h.eachComponent(function (y, _) {
              var S = _.get("zlevel") || 0,
                b = _.get("z") || 0,
                w = _.getZLevelKey();
              ((d = d || !!w),
                (y === "series" ? v : c).push({ zlevel: S, z: b, idx: _.componentIndex, type: y, key: w }));
            }),
            d)
          ) {
            var p = c.concat(v),
              m,
              g;
            (rs(p, function (y, _) {
              return y.zlevel === _.zlevel ? y.z - _.z : y.zlevel - _.zlevel;
            }),
              I(p, function (y) {
                var _ = h.getComponent(y.type, y.idx),
                  S = y.zlevel,
                  b = y.key;
                (m != null && (S = Math.max(m, S)),
                  b ? (S === m && b !== g && S++, (g = b)) : g && (S === m && S++, (g = "")),
                  (m = S),
                  _.setZLevel(S));
              }));
          }
        }
        ((ju = function (h, c, v, d, p) {
          (i(c),
            ig(h, c, v, d, p),
            I(h._chartsViews, function (m) {
              m.__alive = !1;
            }),
            Fo(h, c, v, d, p),
            I(h._chartsViews, function (m) {
              m.__alive || m.remove(c, v);
            }));
        }),
          (ig = function (h, c, v, d, p, m) {
            I(m || h._componentsViews, function (g) {
              var y = g.__model;
              (u(y, g), g.render(y, c, v, d), l(y, g), f(y, g));
            });
          }),
          (Fo = function (h, c, v, d, p, m) {
            var g = h._scheduler;
            ((p = N(p || {}, { updatedSeries: c.getSeries() })), ge.trigger("series:beforeupdate", c, v, p));
            var y = !1;
            (c.eachSeries(function (_) {
              var S = h._chartsMap[_.__viewId];
              S.__alive = !0;
              var b = S.renderTask;
              (g.updatePayload(b, d),
                u(_, S),
                m && m.get(_.uid) && b.dirty(),
                b.perform(g.getPerformArgs(b)) && (y = !0),
                (S.group.silent = !!_.get("silent")),
                s(_, S),
                Fd(_));
            }),
              (g.unfinished = y || g.unfinished),
              ge.trigger("series:layoutlabels", c, v, p),
              ge.trigger("series:transition", c, v, p),
              c.eachSeries(function (_) {
                var S = h._chartsMap[_.__viewId];
                (l(_, S), f(_, S));
              }),
              o(h, c),
              ge.trigger("series:afterupdate", c, v, p));
          }),
          (de = function (h) {
            ((h[$u] = !0), h.getZr().wakeUp());
          }),
          (jn = function (h) {
            h[ko] = (h[ko] + 1) % 1e6;
          }),
          (og = function (h) {
            h[$u] &&
              (h.getZr().storage.traverse(function (c) {
                ya(c) || a(c);
              }),
              (h[$u] = !1));
          }));
        function a(h) {
          for (var c = [], v = h.currentStates, d = 0; d < v.length; d++) {
            var p = v[d];
            p === "emphasis" || p === "blur" || p === "select" || c.push(p);
          }
          (h.selected && h.states.select && c.push("select"),
            h.hoverState === yl && h.states.emphasis
              ? c.push("emphasis")
              : h.hoverState === ml && h.states.blur && c.push("blur"),
            h.useStates(c));
        }
        function o(h, c) {
          var v = h._zr;
          if (v.painter.type === "canvas") {
            var d = v.storage,
              p = 0;
            d.traverse(function (g) {
              g.isGroup || p++;
            });
            var m = p > q(c.get("hoverLayerThreshold"), L0.hoverLayerThreshold) && !nt.node && !nt.worker;
            (h._usingTHL || m) &&
              (c.eachSeries(function (g) {
                if (!g.preventUsingHoverLayer) {
                  var y = h._chartsMap[g.__viewId];
                  y.__alive &&
                    y.eachRendered(function (_) {
                      var S = _.states.emphasis;
                      S && S.hoverLayer !== wc && (S.hoverLayer = m ? r0 : e0);
                    });
                }
              }),
              (h._usingTHL = m));
          }
        }
        function s(h, c) {
          var v = h.get("blendMode") || null;
          c.eachRendered(function (d) {
            d.isGroup || (d.style.blend = v);
          });
        }
        function l(h, c) {
          if (!h.preventAutoZ) {
            var v = l0(h);
            c.eachRendered(function (d) {
              return (u0(d, v.z, v.zlevel), !0);
            });
          }
        }
        function u(h, c) {
          c.eachRendered(function (v) {
            if (!ya(v)) {
              var d = v.getTextContent(),
                p = v.getTextGuideLine();
              (v.stateTransition && (v.stateTransition = null),
                d && d.stateTransition && (d.stateTransition = null),
                p && p.stateTransition && (p.stateTransition = null),
                v.hasState()
                  ? ((v.prevStates = v.currentStates), v.clearStates())
                  : v.prevStates && (v.prevStates = null));
            }
          });
        }
        function f(h, c) {
          var v = h.getModel("stateAnimation"),
            d = h.isAnimationEnabled(),
            p = v.get("duration"),
            m = p > 0 ? { duration: p, delay: v.get("delay"), easing: v.get("easing") } : null;
          c.eachRendered(function (g) {
            if (g.states && g.states.emphasis) {
              if (ya(g)) return;
              if ((g instanceof gt && Bx(g), g.__dirty)) {
                var y = g.prevStates;
                y && g.useStates(y);
              }
              if (d) {
                g.stateTransition = m;
                var _ = g.getTextContent(),
                  S = g.getTextGuideLine();
                (_ && (_.stateTransition = m), S && (S.stateTransition = m));
              }
              g.__dirty && a(g);
            }
          });
        }
        ((ag = function (h) {
          return new ((function (c) {
            V(v, c);
            function v() {
              return (c !== null && c.apply(this, arguments)) || this;
            }
            return (
              (v.prototype.getCoordinateSystems = function () {
                return h._coordSysMgr.getCoordinateSystems();
              }),
              (v.prototype.getComponentByElement = function (d) {
                for (; d; ) {
                  var p = d.__ecComponentInfo;
                  if (p != null) return h._model.getComponent(p.mainType, p.index);
                  d = d.parent;
                }
              }),
              (v.prototype.enterEmphasis = function (d, p) {
                (Fs(d, p), de(h));
              }),
              (v.prototype.leaveEmphasis = function (d, p) {
                (zs(d, p), de(h));
              }),
              (v.prototype.enterBlur = function (d) {
                (Dx(d), de(h));
              }),
              (v.prototype.leaveBlur = function (d) {
                (zy(d), de(h));
              }),
              (v.prototype.enterSelect = function (d) {
                (Hy(d), de(h));
              }),
              (v.prototype.leaveSelect = function (d) {
                (Vy(d), de(h));
              }),
              (v.prototype.getModel = function () {
                return h.getModel();
              }),
              (v.prototype.getViewOfComponentModel = function (d) {
                return h.getViewOfComponentModel(d);
              }),
              (v.prototype.getViewOfSeriesModel = function (d) {
                return h.getViewOfSeriesModel(d);
              }),
              (v.prototype.getECUpdateCycleVersion = function () {
                return h[ko];
              }),
              (v.prototype.usingTHL = function () {
                return h._usingTHL;
              }),
              v
            );
          })(Oy))(h);
        }),
          (D_ = function (h) {
            function c(v, d) {
              for (var p = 0; p < v.length; p++) {
                var m = v[p];
                m[Zu] = d;
              }
            }
            I(Sh, function (v, d) {
              h._messageCenter.on(d, function (p) {
                if (sg[h.group] && h[Zu] !== eg) {
                  if (p && p.escapeConnect) return;
                  var m = h.makeActionFromEvent(p),
                    g = [];
                  (I(Ta, function (y) {
                    y !== h && y.group === h.group && g.push(y);
                  }),
                    c(g, eg),
                    I(g, function (y) {
                      y[Zu] !== rI && y.dispatchAction(m);
                    }),
                    c(g, nI));
                }
              });
            });
          }));
      })()),
      t
    );
  })(nr),
  qc = A_.prototype;
qc.on = b_("on");
qc.off = b_("off");
qc.one = function (e, t, r) {
  var n = this;
  function i() {
    for (var a = [], o = 0; o < arguments.length; o++) a[o] = arguments[o];
    (t && t.apply && t.apply(this, a), n.off(e, i));
  }
  this.on.call(this, e, i, r);
};
var iI = [
  "click",
  "dblclick",
  "mouseover",
  "mouseout",
  "mousemove",
  "mousedown",
  "mouseup",
  "globalout",
  "contextmenu",
];
var qs = {},
  Sh = {},
  bh = {},
  wh = [],
  Th = [],
  Ks = [],
  M_ = {},
  xh = {},
  Ta = {},
  sg = {},
  aI = +new Date() - 0,
  Kc = "_echarts_instance_";
function oI(e, t, r) {
  var n = !(r && r.ssr);
  if (n) {
    var i = sI(e);
    if (i) return i;
  }
  var a = new A_(e, t, r);
  return ((a.id = "ec_" + aI++), (Ta[a.id] = a), n && py(e, Kc, a.id), D_(a), ge.trigger("afterinit", a), a);
}
function sI(e) {
  return Ta[iT(e, Kc)];
}
function I_(e, t) {
  M_[e] = t;
}
function L_(e) {
  vt(Th, e) < 0 && Th.push(e);
}
function P_(e, t) {
  jc(wh, e, t, qM);
}
function lI(e) {
  Qc("afterinit", e);
}
function uI(e) {
  Qc("afterupdate", e);
}
function Qc(e, t) {
  ge.on(e, t);
}
function ki(e, t, r) {
  var n, i, a, o, s;
  (et(t) && ((r = t), (t = "")),
    Z(e)
      ? ((n = e.type),
        (i = e.event),
        (o = e.update),
        (s = e.publishNonRefinedEvent),
        r || (r = e.action),
        (a = e.refineEvent))
      : ((n = e), (i = t)));
  function l(f) {
    return f.toLowerCase();
  }
  i = l(i || n);
  var u = a ? l(n) : i;
  qs[n] ||
    (vr(tg.test(n) && tg.test(i)),
    a && vr(i !== n),
    (qs[n] = { actionType: n, refinedEventType: i, nonRefinedEventType: u, update: o, action: r, refineEvent: a }),
    (bh[i] = 1),
    a && s && (bh[u] = 1),
    (Sh[u] = n));
}
function fI(e, t) {
  zc.register(e, t);
}
function hI(e, t) {
  jc(Ks, e, t, y_, "layout");
}
function Nn(e, t) {
  jc(Ks, e, t, __, "visual");
}
var lg = [];
function jc(e, t, r, n, i, a) {
  if (((et(t) || Z(t)) && ((r = t), (t = n)), !(vt(lg, r) >= 0))) {
    lg.push(r);
    var o = i_.wrapStageHandler(r, i);
    ((o.__prio = t), (o.__raw = r), e.push(o));
  }
}
function E_(e, t) {
  xh[e] = t;
}
function cI(e, t, r) {
  var n = hM("registerMap");
  n && n(e, t, r);
}
var vI = pA;
Nn(Zc, YA);
Nn(kl, XA);
Nn(kl, $A);
Nn(Zc, aM);
Nn(kl, oM);
Nn(S_, GM);
L_(k0);
P_(XM, KD);
E_("default", ZA);
ki({ type: In, event: In, update: In }, Gt);
ki({ type: us, event: us, update: us }, Gt);
ki({ type: Bs, event: vc, update: Bs, action: Gt, refineEvent: Jc, publishNonRefinedEvent: !0 });
ki({ type: Qf, event: vc, update: Qf, action: Gt, refineEvent: Jc, publishNonRefinedEvent: !0 });
ki({ type: Ns, event: vc, update: Ns, action: Gt, refineEvent: Jc, publishNonRefinedEvent: !0 });
function Jc(e, t, r, n) {
  return { eventContent: { selected: Px(r), isFromClick: t.isFromClick || !1 } };
}
I_("default", {});
I_("dark", l_);
function Ki(e) {
  return e == null ? 0 : e.length || 1;
}
function ug(e) {
  return e;
}
var dI = (function () {
    function e(t, r, n, i, a, o) {
      ((this._old = t),
        (this._new = r),
        (this._oldKeyGetter = n || ug),
        (this._newKeyGetter = i || ug),
        (this.context = a),
        (this._diffModeMultiple = o === "multiple"));
    }
    return (
      (e.prototype.add = function (t) {
        return ((this._add = t), this);
      }),
      (e.prototype.update = function (t) {
        return ((this._update = t), this);
      }),
      (e.prototype.updateManyToOne = function (t) {
        return ((this._updateManyToOne = t), this);
      }),
      (e.prototype.updateOneToMany = function (t) {
        return ((this._updateOneToMany = t), this);
      }),
      (e.prototype.updateManyToMany = function (t) {
        return ((this._updateManyToMany = t), this);
      }),
      (e.prototype.remove = function (t) {
        return ((this._remove = t), this);
      }),
      (e.prototype.execute = function () {
        this[this._diffModeMultiple ? "_executeMultiple" : "_executeOneToOne"]();
      }),
      (e.prototype._executeOneToOne = function () {
        var t = this._old,
          r = this._new,
          n = {},
          i = new Array(t.length),
          a = new Array(r.length);
        (this._initIndexMap(t, null, i, "_oldKeyGetter"), this._initIndexMap(r, n, a, "_newKeyGetter"));
        for (var o = 0; o < t.length; o++) {
          var s = i[o],
            l = n[s],
            u = Ki(l);
          if (u > 1) {
            var f = l.shift();
            (l.length === 1 && (n[s] = l[0]), this._update && this._update(f, o));
          } else u === 1 ? ((n[s] = null), this._update && this._update(l, o)) : this._remove && this._remove(o);
        }
        this._performRestAdd(a, n);
      }),
      (e.prototype._executeMultiple = function () {
        var t = this._old,
          r = this._new,
          n = {},
          i = {},
          a = [],
          o = [];
        (this._initIndexMap(t, n, a, "_oldKeyGetter"), this._initIndexMap(r, i, o, "_newKeyGetter"));
        for (var s = 0; s < a.length; s++) {
          var l = a[s],
            u = n[l],
            f = i[l],
            h = Ki(u),
            c = Ki(f);
          if (h > 1 && c === 1) (this._updateManyToOne && this._updateManyToOne(f, u), (i[l] = null));
          else if (h === 1 && c > 1) (this._updateOneToMany && this._updateOneToMany(f, u), (i[l] = null));
          else if (h === 1 && c === 1) (this._update && this._update(f, u), (i[l] = null));
          else if (h > 1 && c > 1) (this._updateManyToMany && this._updateManyToMany(f, u), (i[l] = null));
          else if (h > 1) for (var v = 0; v < h; v++) this._remove && this._remove(u[v]);
          else this._remove && this._remove(u);
        }
        this._performRestAdd(o, i);
      }),
      (e.prototype._performRestAdd = function (t, r) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n],
            a = r[i],
            o = Ki(a);
          if (o > 1) for (var s = 0; s < o; s++) this._add && this._add(a[s]);
          else o === 1 && this._add && this._add(a);
          r[i] = null;
        }
      }),
      (e.prototype._initIndexMap = function (t, r, n, i) {
        for (var a = this._diffModeMultiple, o = 0; o < t.length; o++) {
          var s = "_ec_" + this[i](t[o], o);
          if ((a || (n[o] = s), !!r)) {
            var l = r[s],
              u = Ki(l);
            u === 0 ? ((r[s] = o), a && n.push(s)) : u === 1 ? (r[s] = [l, o]) : l.push(o);
          }
        }
      }),
      e
    );
  })(),
  pI = (function () {
    function e(t, r) {
      ((this._encode = t), (this._schema = r));
    }
    return (
      (e.prototype.get = function () {
        return { fullDimensions: this._getFullDimensionNames(), encode: this._encode };
      }),
      (e.prototype._getFullDimensionNames = function () {
        return (
          this._cachedDimNames || (this._cachedDimNames = this._schema ? this._schema.makeOutputDimensionNames() : []),
          this._cachedDimNames
        );
      }),
      e
    );
  })();
function gI(e, t) {
  var r = {},
    n = (r.encode = {}),
    i = Q(),
    a = [],
    o = [],
    s = {};
  I(e.dimensions, function (c) {
    var v = e.getDimensionInfo(c),
      d = v.coordDim;
    if (d) {
      var p = v.coordDimIndex;
      ((Ju(n, d)[p] = c),
        v.isExtraCoord || (i.set(d, 1), yI(v.type) && (a[0] = c), (Ju(s, d)[p] = e.getDimensionIndex(v.name))),
        v.defaultTooltip && o.push(c));
    }
    Ey.each(function (m, g) {
      var y = Ju(n, g),
        _ = v.otherDims[g];
      _ != null && _ !== !1 && (y[_] = v.name);
    });
  });
  var l = [],
    u = {};
  (i.each(function (c, v) {
    var d = n[v];
    ((u[v] = d[0]), (l = l.concat(d)));
  }),
    (r.dataDimsOnCoord = l),
    (r.dataDimIndicesOnCoord = j(l, function (c) {
      return e.getDimensionInfo(c).storeDimIndex;
    })),
    (r.encodeFirstDimNotExtra = u));
  var f = n.label;
  f && f.length && (a = f.slice());
  var h = n.tooltip;
  return (
    h && h.length ? (o = h.slice()) : o.length || (o = a.slice()),
    (n.defaultedLabel = a),
    (n.defaultedTooltip = o),
    (r.userOutput = new pI(s, t)),
    r
  );
}
function Ju(e, t) {
  return (e.hasOwnProperty(t) || (e[t] = []), e[t]);
}
function mI(e) {
  return e === "category" ? "ordinal" : e === "time" ? "time" : "float";
}
function yI(e) {
  return !(e === "ordinal" || e === "time");
}
var _s = (function () {
    function e(t) {
      ((this.otherDims = {}), t != null && N(this, t));
    }
    return e;
  })(),
  _I = St(),
  SI = { float: "f", int: "i", ordinal: "o", number: "n", time: "t" },
  R_ = (function () {
    function e(t) {
      ((this.dimensions = t.dimensions),
        (this._dimOmitted = t.dimensionOmitted),
        (this.source = t.source),
        (this._fullDimCount = t.fullDimensionCount),
        this._updateDimOmitted(t.dimensionOmitted));
    }
    return (
      (e.prototype.isDimensionOmitted = function () {
        return this._dimOmitted;
      }),
      (e.prototype._updateDimOmitted = function (t) {
        ((this._dimOmitted = t), t && (this._dimNameMap || (this._dimNameMap = k_(this.source))));
      }),
      (e.prototype.getSourceDimensionIndex = function (t) {
        return q(this._dimNameMap.get(t), -1);
      }),
      (e.prototype.getSourceDimension = function (t) {
        var r = this.source.dimensionsDefine;
        if (r) return r[t];
      }),
      (e.prototype.makeStoreSchema = function () {
        for (var t = this._fullDimCount, r = F0(this.source), n = !B_(t), i = "", a = [], o = 0, s = 0; o < t; o++) {
          var l = void 0,
            u = void 0,
            f = void 0,
            h = this.dimensions[s];
          if (h && h.storeDimIndex === o) ((l = r ? h.name : null), (u = h.type), (f = h.ordinalMeta), s++);
          else {
            var c = this.getSourceDimension(o);
            c && ((l = r ? c.name : null), (u = c.type));
          }
          (a.push({ property: l, type: u, ordinalMeta: f }),
            r &&
              l != null &&
              (!h || !h.isCalculationCoord) &&
              (i += n ? l.replace(/\`/g, "`1").replace(/\$/g, "`2") : l),
            (i += "$"),
            (i += SI[u] || "f"),
            f && (i += f.uid),
            (i += "$"));
        }
        var v = this.source,
          d = [v.seriesLayoutBy, v.startIndex, i].join("$$");
        return { dimensions: a, hash: d };
      }),
      (e.prototype.makeOutputDimensionNames = function () {
        for (var t = [], r = 0, n = 0; r < this._fullDimCount; r++) {
          var i = void 0,
            a = this.dimensions[n];
          if (a && a.storeDimIndex === r) (a.isCalculationCoord || (i = a.name), n++);
          else {
            var o = this.getSourceDimension(r);
            o && (i = o.name);
          }
          t.push(i);
        }
        return t;
      }),
      (e.prototype.appendCalculationDimension = function (t) {
        (this.dimensions.push(t), (t.isCalculationCoord = !0), this._fullDimCount++, this._updateDimOmitted(!0));
      }),
      e
    );
  })();
function O_(e) {
  return e instanceof R_;
}
function tv(e) {
  for (var t = Q(), r = 0; r < (e || []).length; r++) {
    var n = e[r],
      i = Z(n) ? n.name : n;
    i != null && t.get(i) == null && t.set(i, r);
  }
  return t;
}
function k_(e) {
  var t = _I(e);
  return t.dimNameMap || (t.dimNameMap = tv(e.dimensionsDefine));
}
function B_(e) {
  return e > 30;
}
var Qi = Z,
  Tr = j,
  bI = typeof Int32Array > "u" ? Array : Int32Array,
  wI = "e\0\0",
  fg = -1,
  TI = [
    "hasItemOption",
    "_nameList",
    "_idList",
    "_invertedIndicesMap",
    "_dimSummary",
    "userOutput",
    "_rawData",
    "_dimValueGetter",
    "_nameDimIdx",
    "_idDimIdx",
    "_nameRepeatCount",
  ],
  xI = ["_approximateExtent"],
  hg,
  zo,
  ji,
  Ji,
  tf,
  ta,
  ef,
  CI = (function () {
    function e(t, r) {
      ((this.type = "list"),
        (this._dimOmitted = !1),
        (this._nameList = []),
        (this._idList = []),
        (this._visual = {}),
        (this._layout = {}),
        (this._itemVisuals = []),
        (this._itemLayouts = []),
        (this._graphicEls = []),
        (this._approximateExtent = {}),
        (this._calculationInfo = {}),
        (this.hasItemOption = !1),
        (this.TRANSFERABLE_METHODS = ["cloneShallow", "downSample", "minmaxDownSample", "lttbDownSample", "map"]),
        (this.CHANGABLE_METHODS = ["filterSelf", "selectRange"]),
        (this.DOWNSAMPLE_METHODS = ["downSample", "minmaxDownSample", "lttbDownSample"]));
      var n,
        i = !1;
      (O_(t)
        ? ((n = t.dimensions), (this._dimOmitted = t.isDimensionOmitted()), (this._schema = t))
        : ((i = !0), (n = t)),
        (n = n || ["x", "y"]));
      for (var a = {}, o = [], s = {}, l = !1, u = {}, f = 0; f < n.length; f++) {
        var h = n[f],
          c = Y(h) ? new _s({ name: h }) : h instanceof _s ? h : new _s(h),
          v = c.name;
        ((c.type = c.type || "float"), c.coordDim || ((c.coordDim = v), (c.coordDimIndex = 0)));
        var d = (c.otherDims = c.otherDims || {});
        (o.push(v),
          (a[v] = c),
          u[v] != null && (l = !0),
          c.createInvertedIndices && (s[v] = []),
          i && (c.storeDimIndex = f),
          d.itemName === 0 && (this._nameDimIdx = c.storeDimIndex),
          d.itemId === 0 && (this._idDimIdx = c.storeDimIndex));
      }
      if (
        ((this.dimensions = o),
        (this._dimInfos = a),
        this._initGetDimensionInfo(l),
        (this.hostModel = r),
        (this._invertedIndicesMap = s),
        this._dimOmitted)
      ) {
        var p = (this._dimIdxToName = Q());
        I(o, function (m) {
          p.set(a[m].storeDimIndex, m);
        });
      }
    }
    return (
      (e.prototype.getDimension = function (t) {
        var r = this._recognizeDimIndex(t);
        if (r == null) return t;
        if (((r = t), !this._dimOmitted)) return this.dimensions[r];
        var n = this._dimIdxToName.get(r);
        if (n != null) return n;
        var i = this._schema.getSourceDimension(r);
        if (i) return i.name;
      }),
      (e.prototype.getDimensionIndex = function (t) {
        var r = this._recognizeDimIndex(t);
        if (r != null) return r;
        if (t == null) return -1;
        var n = this._getDimInfo(t);
        return n ? n.storeDimIndex : this._dimOmitted ? this._schema.getSourceDimensionIndex(t) : -1;
      }),
      (e.prototype._recognizeDimIndex = function (t) {
        if (
          wt(t) ||
          (t != null &&
            !isNaN(t) &&
            !this._getDimInfo(t) &&
            (!this._dimOmitted || this._schema.getSourceDimensionIndex(t) < 0))
        )
          return +t;
      }),
      (e.prototype._getStoreDimIndex = function (t) {
        var r = this.getDimensionIndex(t);
        return r;
      }),
      (e.prototype.getDimensionInfo = function (t) {
        return this._getDimInfo(this.getDimension(t));
      }),
      (e.prototype._initGetDimensionInfo = function (t) {
        var r = this._dimInfos;
        this._getDimInfo = t
          ? function (n) {
              return r.hasOwnProperty(n) ? r[n] : void 0;
            }
          : function (n) {
              return r[n];
            };
      }),
      (e.prototype.getDimensionsOnCoord = function () {
        return this._dimSummary.dataDimsOnCoord.slice();
      }),
      (e.prototype.mapDimension = function (t, r) {
        var n = this._dimSummary;
        if (r == null) return n.encodeFirstDimNotExtra[t];
        var i = n.encode[t];
        return i ? i[r] : null;
      }),
      (e.prototype.mapDimensionsAll = function (t) {
        var r = this._dimSummary,
          n = r.encode[t];
        return (n || []).slice();
      }),
      (e.prototype.getStore = function () {
        return this._store;
      }),
      (e.prototype.initData = function (t, r, n) {
        var i = this,
          a;
        if ((t instanceof fh && (a = t), !a)) {
          var o = this.dimensions,
            s = Wc(t) || ae(t) ? new z0(t, o.length) : t;
          a = new fh();
          var l = Tr(o, function (u) {
            return { type: i._dimInfos[u].type, property: u };
          });
          a.initData(s, l, n);
        }
        ((this._store = a),
          (this._nameList = (r || []).slice()),
          (this._idList = []),
          (this._nameRepeatCount = {}),
          this._doInit(0, a.count()),
          (this._dimSummary = gI(this, this._schema)),
          (this.userOutput = this._dimSummary.userOutput));
      }),
      (e.prototype.appendData = function (t) {
        var r = this._store.appendData(t);
        this._doInit(r[0], r[1]);
      }),
      (e.prototype.appendValues = function (t, r) {
        var n = this._store.appendValues(t, r && r.length),
          i = n.start,
          a = n.end,
          o = this._shouldMakeIdFromName();
        if ((this._updateOrdinalMeta(), r))
          for (var s = i; s < a; s++) {
            var l = s - i;
            ((this._nameList[s] = r[l]), o && ef(this, s));
          }
      }),
      (e.prototype._updateOrdinalMeta = function () {
        for (var t = this._store, r = this.dimensions, n = 0; n < r.length; n++) {
          var i = this._dimInfos[r[n]];
          i.ordinalMeta && t.collectOrdinalMeta(i.storeDimIndex, i.ordinalMeta);
        }
      }),
      (e.prototype._shouldMakeIdFromName = function () {
        var t = this._store.getProvider();
        return this._idDimIdx == null && t.getSource().sourceFormat !== kr && !t.fillStorage;
      }),
      (e.prototype._doInit = function (t, r) {
        if (!(t >= r)) {
          var n = this._store,
            i = n.getProvider();
          this._updateOrdinalMeta();
          var a = this._nameList,
            o = this._idList,
            s = i.getSource().sourceFormat,
            l = s === ce;
          if (l && !i.pure)
            for (var u = [], f = t; f < r; f++) {
              var h = i.getItem(f, u);
              if ((!this.hasItemOption && Xw(h) && (this.hasItemOption = !0), h)) {
                var c = h.name;
                a[f] == null && c != null && (a[f] = je(c, null));
                var v = h.id;
                o[f] == null && v != null && (o[f] = je(v, null));
              }
            }
          if (this._shouldMakeIdFromName()) for (var f = t; f < r; f++) ef(this, f);
          hg(this);
        }
      }),
      (e.prototype.getApproximateExtent = function (t, r) {
        return this._approximateExtent[t] || this._store.getDataExtent(this._getStoreDimIndex(t), r);
      }),
      (e.prototype.setApproximateExtent = function (t, r) {
        ((r = this.getDimension(r)), (this._approximateExtent[r] = t.slice()));
      }),
      (e.prototype.getCalculationInfo = function (t) {
        return this._calculationInfo[t];
      }),
      (e.prototype.setCalculationInfo = function (t, r) {
        Qi(t) ? N(this._calculationInfo, t) : (this._calculationInfo[t] = r);
      }),
      (e.prototype.getName = function (t) {
        var r = this.getRawIndex(t),
          n = this._nameList[r];
        return (n == null && this._nameDimIdx != null && (n = ji(this, this._nameDimIdx, r)), n == null && (n = ""), n);
      }),
      (e.prototype._getCategory = function (t, r) {
        var n = this._store.get(t, r),
          i = this._store.getOrdinalMeta(t);
        return i ? i.categories[n] : n;
      }),
      (e.prototype.getId = function (t) {
        return zo(this, this.getRawIndex(t));
      }),
      (e.prototype.count = function () {
        return this._store.count();
      }),
      (e.prototype.get = function (t, r) {
        var n = this._store,
          i = this._dimInfos[t];
        if (i) return n.get(i.storeDimIndex, r);
      }),
      (e.prototype.getByRawIndex = function (t, r) {
        var n = this._store,
          i = this._dimInfos[t];
        if (i) return n.getByRawIndex(i.storeDimIndex, r);
      }),
      (e.prototype.getIndices = function () {
        return this._store.getIndices();
      }),
      (e.prototype.getDataExtent = function (t) {
        return this._store.getDataExtent(this._getStoreDimIndex(t), null);
      }),
      (e.prototype.getSum = function (t) {
        return this._store.getSum(this._getStoreDimIndex(t));
      }),
      (e.prototype.getMedian = function (t) {
        return this._store.getMedian(this._getStoreDimIndex(t));
      }),
      (e.prototype.getValues = function (t, r) {
        var n = this,
          i = this._store;
        return U(t)
          ? i.getValues(
              Tr(t, function (a) {
                return n._getStoreDimIndex(a);
              }),
              r,
            )
          : i.getValues(t);
      }),
      (e.prototype.hasValue = function (t) {
        for (var r = this._dimSummary.dataDimIndicesOnCoord, n = 0, i = r.length; n < i; n++)
          if (isNaN(this._store.get(r[n], t))) return !1;
        return !0;
      }),
      (e.prototype.indexOfName = function (t) {
        for (var r = 0, n = this._store.count(); r < n; r++) if (this.getName(r) === t) return r;
        return -1;
      }),
      (e.prototype.getRawIndex = function (t) {
        return this._store.getRawIndex(t);
      }),
      (e.prototype.indexOfRawIndex = function (t) {
        return this._store.indexOfRawIndex(t);
      }),
      (e.prototype.rawIndexOf = function (t, r) {
        var n = t && this._invertedIndicesMap[t],
          i = n && n[r];
        return i == null || isNaN(i) ? fg : i;
      }),
      (e.prototype.each = function (t, r, n) {
        et(t) && ((n = r), (r = t), (t = []));
        var i = n || this,
          a = Tr(Ji(t), this._getStoreDimIndex, this);
        this._store.each(a, i ? Tt(r, i) : r);
      }),
      (e.prototype.filterSelf = function (t, r, n) {
        et(t) && ((n = r), (r = t), (t = []));
        var i = n || this,
          a = Tr(Ji(t), this._getStoreDimIndex, this);
        return ((this._store = this._store.filter(a, i ? Tt(r, i) : r)), this);
      }),
      (e.prototype.selectRange = function (t) {
        var r = this,
          n = {},
          i = xt(t);
        return (
          I(i, function (a) {
            var o = r._getStoreDimIndex(a);
            n[o] = t[a];
          }),
          (this._store = this._store.selectRange(n)),
          this
        );
      }),
      (e.prototype.mapArray = function (t, r, n) {
        (et(t) && ((n = r), (r = t), (t = [])), (n = n || this));
        var i = [];
        return (
          this.each(
            t,
            function () {
              i.push(r && r.apply(this, arguments));
            },
            n,
          ),
          i
        );
      }),
      (e.prototype.map = function (t, r, n, i) {
        var a = n || i || this,
          o = Tr(Ji(t), this._getStoreDimIndex, this),
          s = ta(this);
        return ((s._store = this._store.map(o, a ? Tt(r, a) : r)), s);
      }),
      (e.prototype.modify = function (t, r, n, i) {
        var a = n || i || this,
          o = Tr(Ji(t), this._getStoreDimIndex, this);
        this._store.modify(o, a ? Tt(r, a) : r);
      }),
      (e.prototype.downSample = function (t, r, n, i) {
        var a = ta(this);
        return ((a._store = this._store.downSample(this._getStoreDimIndex(t), r, n, i)), a);
      }),
      (e.prototype.minmaxDownSample = function (t, r) {
        var n = ta(this);
        return ((n._store = this._store.minmaxDownSample(this._getStoreDimIndex(t), r)), n);
      }),
      (e.prototype.lttbDownSample = function (t, r) {
        var n = ta(this);
        return ((n._store = this._store.lttbDownSample(this._getStoreDimIndex(t), r)), n);
      }),
      (e.prototype.getRawDataItem = function (t) {
        return this._store.getRawDataItem(t);
      }),
      (e.prototype.getItemModel = function (t) {
        var r = this.hostModel,
          n = this.getRawDataItem(t);
        return new Ct(n, r, r && r.ecModel);
      }),
      (e.prototype.diff = function (t) {
        var r = this;
        return new dI(
          t ? t.getStore().getIndices() : [],
          this.getStore().getIndices(),
          function (n) {
            return zo(t, n);
          },
          function (n) {
            return zo(r, n);
          },
        );
      }),
      (e.prototype.getVisual = function (t) {
        var r = this._visual;
        return r && r[t];
      }),
      (e.prototype.setVisual = function (t, r) {
        ((this._visual = this._visual || {}), Qi(t) ? N(this._visual, t) : (this._visual[t] = r));
      }),
      (e.prototype.getItemVisual = function (t, r) {
        var n = this._itemVisuals[t],
          i = n && n[r];
        return i ?? this.getVisual(r);
      }),
      (e.prototype.hasItemVisual = function () {
        return this._itemVisuals.length > 0;
      }),
      (e.prototype.ensureUniqueItemVisual = function (t, r) {
        var n = this._itemVisuals,
          i = n[t];
        i || (i = n[t] = {});
        var a = i[r];
        return (
          a == null && ((a = this.getVisual(r)), U(a) ? (a = a.slice()) : Qi(a) && (a = N({}, a)), (i[r] = a)),
          a
        );
      }),
      (e.prototype.setItemVisual = function (t, r, n) {
        var i = this._itemVisuals[t] || {};
        ((this._itemVisuals[t] = i), Qi(r) ? N(i, r) : (i[r] = n));
      }),
      (e.prototype.clearAllVisual = function () {
        ((this._visual = {}), (this._itemVisuals = []));
      }),
      (e.prototype.setLayout = function (t, r) {
        Qi(t) ? N(this._layout, t) : (this._layout[t] = r);
      }),
      (e.prototype.getLayout = function (t) {
        return this._layout[t];
      }),
      (e.prototype.getItemLayout = function (t) {
        return this._itemLayouts[t];
      }),
      (e.prototype.setItemLayout = function (t, r, n) {
        this._itemLayouts[t] = n ? N(this._itemLayouts[t] || {}, r) : r;
      }),
      (e.prototype.clearItemLayouts = function () {
        this._itemLayouts.length = 0;
      }),
      (e.prototype.setItemGraphicEl = function (t, r) {
        var n = this.hostModel && this.hostModel.seriesIndex;
        (vx(n, this.dataType, t, r), (this._graphicEls[t] = r));
      }),
      (e.prototype.getItemGraphicEl = function (t) {
        return this._graphicEls[t];
      }),
      (e.prototype.eachItemGraphicEl = function (t, r) {
        I(this._graphicEls, function (n, i) {
          n && t && t.call(r, n, i);
        });
      }),
      (e.prototype.cloneShallow = function (t) {
        return (
          t || (t = new e(this._schema ? this._schema : Tr(this.dimensions, this._getDimInfo, this), this.hostModel)),
          tf(t, this),
          (t._store = this._store),
          t
        );
      }),
      (e.prototype.wrapMethod = function (t, r) {
        var n = this[t];
        et(n) &&
          ((this.__wrappedMethods = this.__wrappedMethods || []),
          this.__wrappedMethods.push(t),
          (this[t] = function () {
            var i = n.apply(this, arguments);
            return r.apply(this, [i].concat(qh(arguments)));
          }));
      }),
      (e.internalField = (function () {
        ((hg = function (t) {
          var r = t._invertedIndicesMap;
          I(r, function (n, i) {
            var a = t._dimInfos[i],
              o = a.ordinalMeta,
              s = t._store;
            if (o) {
              n = r[i] = new bI(o.categories.length);
              for (var l = 0; l < n.length; l++) n[l] = fg;
              for (var l = 0; l < s.count(); l++) n[s.get(a.storeDimIndex, l)] = l;
            }
          });
        }),
          (ji = function (t, r, n) {
            return je(t._getCategory(r, n), null);
          }),
          (zo = function (t, r) {
            var n = t._idList[r];
            return (n == null && t._idDimIdx != null && (n = ji(t, t._idDimIdx, r)), n == null && (n = wI + r), n);
          }),
          (Ji = function (t) {
            return (U(t) || (t = t != null ? [t] : []), t);
          }),
          (ta = function (t) {
            var r = new e(t._schema ? t._schema : Tr(t.dimensions, t._getDimInfo, t), t.hostModel);
            return (tf(r, t), r);
          }),
          (tf = function (t, r) {
            (I(TI.concat(r.__wrappedMethods || []), function (n) {
              r.hasOwnProperty(n) && (t[n] = r[n]);
            }),
              (t.__wrappedMethods = r.__wrappedMethods),
              I(xI, function (n) {
                t[n] = ot(r[n]);
              }),
              (t._calculationInfo = N({}, r._calculationInfo)));
          }),
          (ef = function (t, r) {
            var n = t._nameList,
              i = t._idList,
              a = t._nameDimIdx,
              o = t._idDimIdx,
              s = n[r],
              l = i[r];
            if (
              (s == null && a != null && (n[r] = s = ji(t, a, r)),
              l == null && o != null && (i[r] = l = ji(t, o, r)),
              l == null && s != null)
            ) {
              var u = t._nameRepeatCount,
                f = (u[s] = (u[s] || 0) + 1);
              ((l = s), f > 1 && (l += "__ec__" + f), (i[r] = l));
            }
          }));
      })()),
      e
    );
  })();
function DI(e, t) {
  (Wc(e) || (e = B0(e)), (t = t || {}));
  var r = t.coordDimensions || [],
    n = t.dimensionsDefine || e.dimensionsDefine || [],
    i = Q(),
    a = [],
    o = AI(e, r, n, t.dimensionsCount),
    s = t.canOmitUnusedDimensions && B_(o),
    l = n === e.dimensionsDefine,
    u = l ? k_(e) : tv(n),
    f = t.encodeDefine;
  !f && t.encodeDefaulter && (f = t.encodeDefaulter(e, o));
  for (var h = Q(f), c = new X0(o), v = 0; v < c.length; v++) c[v] = -1;
  function d(A) {
    var M = c[A];
    if (M < 0) {
      var D = n[A],
        P = Z(D) ? D : { name: D },
        x = new _s(),
        L = P.name;
      (L != null && u.get(L) != null && (x.name = x.displayName = L),
        P.type != null && (x.type = P.type),
        P.displayName != null && (x.displayName = P.displayName));
      var E = a.length;
      return ((c[A] = E), (x.storeDimIndex = A), a.push(x), x);
    }
    return a[M];
  }
  if (!s) for (var v = 0; v < o; v++) d(v);
  h.each(function (A, M) {
    var D = jt(A).slice();
    if (D.length === 1 && !Y(D[0]) && D[0] < 0) {
      h.set(M, !1);
      return;
    }
    var P = h.set(M, []);
    I(D, function (x, L) {
      var E = Y(x) ? u.get(x) : x;
      E != null && E < o && ((P[L] = E), m(d(E), M, L));
    });
  });
  var p = 0;
  I(r, function (A) {
    var M, D, P, x;
    if (Y(A)) ((M = A), (x = {}));
    else {
      ((x = A), (M = x.name));
      var L = x.ordinalMeta;
      ((x.ordinalMeta = null),
        (x = N({}, x)),
        (x.ordinalMeta = L),
        (D = x.dimsDef),
        (P = x.otherDims),
        (x.name = x.coordDim = x.coordDimIndex = x.dimsDef = x.otherDims = null));
    }
    var E = h.get(M);
    if (E !== !1) {
      if (((E = jt(E)), !E.length))
        for (var R = 0; R < ((D && D.length) || 1); R++) {
          for (; p < o && d(p).coordDim != null; ) p++;
          p < o && E.push(p++);
        }
      I(E, function (B, O) {
        var k = d(B);
        if ((l && x.type != null && (k.type = x.type), m(mt(k, x), M, O), k.name == null && D)) {
          var z = D[O];
          (!Z(z) && (z = { name: z }), (k.name = k.displayName = z.name), (k.defaultTooltip = z.defaultTooltip));
        }
        P && mt(k.otherDims, P);
      });
    }
  });
  function m(A, M, D) {
    Ey.get(M) != null ? (A.otherDims[M] = D) : ((A.coordDim = M), (A.coordDimIndex = D), i.set(M, !0));
  }
  var g = t.generateCoord,
    y = t.generateCoordCount,
    _ = y != null;
  y = g ? y || 1 : 0;
  var S = g || "value";
  function b(A) {
    A.name == null && (A.name = A.coordDim);
  }
  if (s)
    (I(a, function (A) {
      b(A);
    }),
      a.sort(function (A, M) {
        return A.storeDimIndex - M.storeDimIndex;
      }));
  else
    for (var w = 0; w < o; w++) {
      var T = d(w),
        C = T.coordDim;
      (C == null && ((T.coordDim = MI(S, i, _)), (T.coordDimIndex = 0), (!g || y <= 0) && (T.isExtraCoord = !0), y--),
        b(T),
        T.type == null &&
          (R0(e, w) === le.Must ||
            (T.isExtraCoord && (T.otherDims.itemName != null || T.otherDims.seriesName != null))) &&
          (T.type = "ordinal"));
    }
  return (
    sc(
      a,
      function (A) {
        return A.name;
      },
      function (A, M) {
        M > 0 && (A.name = A.name + (M - 1));
      },
    ),
    new R_({ source: e, dimensions: a, fullDimensionCount: o, dimensionOmitted: s })
  );
}
function AI(e, t, r, n) {
  var i = Math.max(e.dimensionsDetectedCount || 1, t.length, r.length, n || 0);
  return (
    I(t, function (a) {
      var o;
      Z(a) && (o = a.dimsDef) && (i = Math.max(i, o.length));
    }),
    i
  );
}
function MI(e, t, r) {
  if (r || t.hasKey(e)) {
    for (var n = 0; t.hasKey(e + n); ) n++;
    e += n;
  }
  return (t.set(e, !0), e);
}
var II = (function () {
  function e(t) {
    ((this.coordSysDims = []), (this.axisMap = Q()), (this.categoryAxisMap = Q()), (this.coordSysName = t));
  }
  return e;
})();
function LI(e) {
  var t = e.get("coordinateSystem"),
    r = new II(t),
    n = PI[t];
  if (n) return (n(e, r, r.axisMap, r.categoryAxisMap), r);
}
var PI = {
  cartesian2d: function (e, t, r, n) {
    var i = e.getReferringComponents("xAxis", xe).models[0],
      a = e.getReferringComponents("yAxis", xe).models[0];
    ((t.coordSysDims = ["x", "y"]),
      r.set("x", i),
      r.set("y", a),
      Jn(i) && (n.set("x", i), (t.firstCategoryDimIndex = 0)),
      Jn(a) && (n.set("y", a), t.firstCategoryDimIndex == null && (t.firstCategoryDimIndex = 1)));
  },
  singleAxis: function (e, t, r, n) {
    var i = e.getReferringComponents("singleAxis", xe).models[0];
    ((t.coordSysDims = ["single"]), r.set("single", i), Jn(i) && (n.set("single", i), (t.firstCategoryDimIndex = 0)));
  },
  polar: function (e, t, r, n) {
    var i = e.getReferringComponents("polar", xe).models[0],
      a = i.findAxisModel("radiusAxis"),
      o = i.findAxisModel("angleAxis");
    ((t.coordSysDims = ["radius", "angle"]),
      r.set("radius", a),
      r.set("angle", o),
      Jn(a) && (n.set("radius", a), (t.firstCategoryDimIndex = 0)),
      Jn(o) && (n.set("angle", o), t.firstCategoryDimIndex == null && (t.firstCategoryDimIndex = 1)));
  },
  geo: function (e, t, r, n) {
    t.coordSysDims = ["lng", "lat"];
  },
  parallel: function (e, t, r, n) {
    var i = e.ecModel,
      a = i.getComponent("parallel", e.get("parallelIndex")),
      o = (t.coordSysDims = a.dimensions.slice());
    I(a.parallelAxisIndex, function (s, l) {
      var u = i.getComponent("parallelAxis", s),
        f = o[l];
      (r.set(f, u), Jn(u) && (n.set(f, u), t.firstCategoryDimIndex == null && (t.firstCategoryDimIndex = l)));
    });
  },
  matrix: function (e, t, r, n) {
    var i = e.getReferringComponents("matrix", xe).models[0];
    t.coordSysDims = ["x", "y"];
    var a = i.getDimensionModel("x"),
      o = i.getDimensionModel("y");
    (r.set("x", a), r.set("y", o), n.set("x", a), n.set("y", o));
  },
};
function Jn(e) {
  return e.get("type") === "category";
}
function EI(e, t, r) {
  r = r || {};
  var n = r.byIndex,
    i = r.stackedCoordDimension,
    a,
    o,
    s;
  RI(t) ? (a = t) : ((o = t.schema), (a = o.dimensions), (s = t.store));
  var l = !!(e && e.get("stack")),
    u,
    f,
    h,
    c,
    v = !0;
  function d(S) {
    return S.type !== "ordinal" && S.type !== "time";
  }
  if (
    (I(a, function (S, b) {
      (Y(S) && (a[b] = S = { name: S }), d(S) || (v = !1));
    }),
    I(a, function (S, b) {
      l &&
        !S.isExtraCoord &&
        (!n && !u && S.ordinalMeta && (u = S),
        !f && d(S) && (!v || (S.coordDim !== "x" && S.coordDim !== "angle")) && (!i || i === S.coordDim) && (f = S));
    }),
    f && !n && !u && (n = !0),
    f)
  ) {
    ((h = "__\0ecstackresult_" + e.id), (c = "__\0ecstackedover_" + e.id), u && (u.createInvertedIndices = !0));
    var p = f.coordDim,
      m = f.type,
      g = 0;
    I(a, function (S) {
      S.coordDim === p && g++;
    });
    var y = {
        name: h,
        coordDim: p,
        coordDimIndex: g,
        type: m,
        isExtraCoord: !0,
        isCalculationCoord: !0,
        storeDimIndex: a.length,
      },
      _ = {
        name: c,
        coordDim: c,
        coordDimIndex: g + 1,
        type: m,
        isExtraCoord: !0,
        isCalculationCoord: !0,
        storeDimIndex: a.length + 1,
      };
    o
      ? (s &&
          ((y.storeDimIndex = s.ensureCalculationDimension(c, m)),
          (_.storeDimIndex = s.ensureCalculationDimension(h, m))),
        o.appendCalculationDimension(y),
        o.appendCalculationDimension(_))
      : (a.push(y), a.push(_));
  }
  return {
    stackedDimension: f && f.name,
    stackedByDimension: u && u.name,
    isStackedByIndex: n,
    stackedOverDimension: c,
    stackResultDimension: h,
  };
}
function RI(e) {
  return !O_(e.schema);
}
function xi(e, t) {
  return !!t && t === e.getCalculationInfo("stackedDimension");
}
function OI(e, t) {
  return xi(e, t) ? e.getCalculationInfo("stackResultDimension") : t;
}
function kI(e, t) {
  var r = e.get("coordinateSystem"),
    n = zc.get(r),
    i;
  return (
    t &&
      t.coordSysDims &&
      (i = j(t.coordSysDims, function (a) {
        var o = { name: a },
          s = t.axisMap.get(a);
        if (s) {
          var l = s.get("type");
          o.type = mI(l);
        }
        return o;
      })),
    i || (i = (n && (n.getDimensionsInfo ? n.getDimensionsInfo() : n.dimensions.slice())) || ["x", "y"]),
    i
  );
}
function BI(e, t, r) {
  var n, i;
  return (
    r &&
      I(e, function (a, o) {
        var s = a.coordDim,
          l = r.categoryAxisMap.get(s);
        (l && (n == null && (n = o), (a.ordinalMeta = l.getOrdinalMeta()), t && (a.createInvertedIndices = !0)),
          a.otherDims.itemName != null && (i = !0));
      }),
    !i && n != null && (e[n].otherDims.itemName = 0),
    n
  );
}
function ev(e, t, r) {
  r = r || {};
  var n = t.getSourceManager(),
    i,
    a = !1;
  ((i = n.getSource()), (a = i.sourceFormat === ce));
  var o = LI(t),
    s = kI(t, o),
    l = r.useEncodeDefaulter,
    u = et(l) ? l : l ? Rt(DD, s, t) : null,
    f = {
      coordDimensions: s,
      generateCoord: r.generateCoord,
      encodeDefine: t.getEncode(),
      encodeDefaulter: u,
      canOmitUnusedDimensions: !a,
    },
    h = DI(i, f),
    c = BI(h.dimensions, r.createInvertedIndices, o),
    v = a ? null : n.getSharedDataStore(h),
    d = EI(t, { schema: h, store: v }),
    p = new CI(h, t);
  p.setCalculationInfo(d);
  var m =
    c != null && NI(i)
      ? function (g, y, _, S) {
          return S === c ? _ : this.defaultDimValueGetter(g, y, _, S);
        }
      : null;
  return ((p.hasItemOption = !1), p.initData(a ? i : v, null, m), p);
}
function NI(e) {
  if (e.sourceFormat === ce) {
    var t = FI(e.data || []);
    return !U(qa(t));
  }
}
function FI(e) {
  for (var t = 0; t < e.length && e[t] == null; ) t++;
  return e[t];
}
var Fe = (function () {
  function e() {}
  return (
    (e.prototype.isBlank = function () {
      return this._isBlank;
    }),
    (e.prototype.setBlank = function (t) {
      this._isBlank = t;
    }),
    e
  );
})();
dl(Fe);
var zI = 0,
  Ch = (function () {
    function e(t) {
      ((this.categories = t.categories || []),
        (this._needCollect = t.needCollect),
        (this._deduplication = t.deduplication),
        (this.uid = ++zI),
        (this._onCollect = t.onCollect));
    }
    return (
      (e.createByAxisModel = function (t) {
        var r = t.option,
          n = r.data,
          i = n && j(n, HI);
        return new e({ categories: i, needCollect: !i, deduplication: r.dedplication !== !1 });
      }),
      (e.prototype.getOrdinal = function (t) {
        return this._getOrCreateMap().get(t);
      }),
      (e.prototype.parseAndCollect = function (t) {
        var r,
          n = this._needCollect;
        if (!Y(t) && !n) return t;
        if (n && !this._deduplication)
          return ((r = this.categories.length), (this.categories[r] = t), this._onCollect && this._onCollect(t, r), r);
        var i = this._getOrCreateMap();
        return (
          (r = i.get(t)),
          r == null &&
            (n
              ? ((r = this.categories.length),
                (this.categories[r] = t),
                i.set(t, r),
                this._onCollect && this._onCollect(t, r))
              : (r = NaN)),
          r
        );
      }),
      (e.prototype._getOrCreateMap = function () {
        return this._map || (this._map = Q(this.categories));
      }),
      e
    );
  })();
function HI(e) {
  return Z(e) && e.value != null ? e.value : e + "";
}
var De = 0,
  za = 1,
  VI = {
    needTransform: 1,
    normalize: 1,
    scale: 1,
    transformIn: 1,
    transformOut: 1,
    contain: 1,
    getExtent: 1,
    getExtentUnsafe: 1,
    setExtent: 1,
    setExtent2: 1,
    getFilter: 1,
    sanitize: 1,
    getDefaultStartValue: 1,
    freeze: 1,
  },
  GI = xt(VI),
  Qs = 2,
  N_ = 3;
function rv(e, t, r) {
  var n;
  return ((e = e || {}), WI(e, r), { brk: n, mapper: e });
}
function F_(e, t) {
  I(GI, function (r) {
    e[r] = t[r];
  });
}
function z_(e, t) {
  e.freeze = Gt;
}
function Ha(e) {
  return e.getExtentUnsafe(De, Qs);
}
function js(e, t) {
  return e.getExtentUnsafe(za, t) || e.getExtentUnsafe(De, t);
}
function UI(e) {
  var t = js(e, N_);
  return t[1] - t[0];
}
function Bl(e) {
  var t = e.getExtentUnsafe(De, N_);
  return t[1] - t[0];
}
function WI(e, t) {
  var r = e || {},
    n = [];
  return ((r._extents = n), (n[De] = t ? t.slice() : be()), N(r, YI), r);
}
var YI = {
  needTransform: function () {
    return !1;
  },
  normalize: function (e) {
    var t = this._extents[za] || this._extents[De];
    return t[1] === t[0] ? 0.5 : (e - t[0]) / (t[1] - t[0]);
  },
  scale: function (e) {
    var t = this._extents[za] || this._extents[De];
    return e * (t[1] - t[0]) + t[0];
  },
  transformIn: function (e) {
    return e;
  },
  transformOut: function (e) {
    return e;
  },
  contain: function (e) {
    var t = js(this, null);
    return e >= t[0] && e <= t[1];
  },
  getExtent: function () {
    return this._extents[De].slice();
  },
  getExtentUnsafe: function (e) {
    return this._extents[e];
  },
  setExtent: function (e, t) {
    cg(this._extents, De, e, t);
  },
  setExtent2: function (e, t, r) {
    var n = this._extents;
    (n[e] || (n[e] = n[De].slice()), cg(n, e, t, r));
  },
  freeze: function () {},
};
function cg(e, t, r, n) {
  Si(r, n) && ((e[t][0] = r), (e[t][1] = n));
}
function H_(e) {
  return Js(e) || Ci(e);
}
function Js(e) {
  return e.type === "interval";
}
function nv(e) {
  return e.type === "time";
}
function Ci(e) {
  return e.type === "log";
}
function ze(e) {
  return e.type === "ordinal";
}
function XI(e) {
  var t = rc(e),
    r = Li(10, t),
    n = dr(e / r);
  return (n ? (n === 2 ? (n = 3) : n === 3 ? (n = 5) : (n *= 2)) : (n = 1), ft(n * r, -t));
}
function kn(e) {
  return Pr(e) + 2;
}
function Ho(e, t) {
  return Ia(e) / Ia(t);
}
function rf(e, t, r) {
  var n = r && r.lookup;
  if (n) {
    for (var i = 0; i < n.from.length; i++) if (e === n.from[i]) return n.to[i];
  }
  return Li(t, e);
}
function V_(e, t, r) {
  var n = e.slice();
  if (n[0] === n[1]) {
    var i = r && r.ctnShp;
    if (n[0] !== 0) {
      var a = Pt(n[0]);
      (t[1] || (n[1] += a / 2), (n[0] -= a / 2));
    } else (i && (n[0] = -1), (n[1] = 1));
  }
  return ((!pr(n[0]) || !pr(n[1])) && ((n[0] = 0), (n[1] = 1)), n[1] < n[0] && n.reverse(), n);
}
function $I(e, t) {
  return [e[0] !== t[0], e[1] !== t[1]];
}
function iv(e, t) {
  return ((e = e || t), dr(ht(e, 1)));
}
function G_(e, t, r) {
  var n = Ha(e),
    i = n[0],
    a = e.count(),
    o = Math.max((t || 0) + 1, 1);
  (i !== 0 && o > 1 && a / o > 2 && (i = Math.round(Math.ceil(i / o) * o)), i !== n[0] && l(n[0], !0, !0));
  for (var s = i; s <= n[1]; s += o) l(s, !1, s === n[0] || s === n[1]);
  s - o !== n[1] && l(n[1], !0, !0);
  function l(u, f, h) {
    r({ value: u, offInterval: f }, h);
  }
}
var U_ = (function (e) {
  V(t, e);
  function t(r) {
    var n = e.call(this) || this;
    ((n.type = "ordinal"), (n.parse = t.parse), F_(n, t.decoratedMethods));
    var i = r.ordinalMeta;
    (i || (i = new Ch({})),
      U(i) &&
        (i = new Ch({
          categories: j(i, function (o) {
            return Z(o) ? o.value : o;
          }),
        })),
      (n._ordinalMeta = i));
    var a = rv(null, null, r.extent || [0, i.categories.length - 1]);
    return ((n._mapper = a.mapper), z_(n), n);
  }
  return (
    (t.parse = function (r) {
      return (
        r == null ? (r = NaN) : Y(r) ? ((r = this._ordinalMeta.getOrdinal(r)), r == null && (r = NaN)) : (r = dr(r)),
        r
      );
    }),
    (t.prototype.getTicks = function () {
      var r = [];
      return (
        G_(this, 0, function (n) {
          r.push(n);
        }),
        r
      );
    }),
    (t.prototype.getMinorTicks = function (r) {}),
    (t.prototype.setSortInfo = function (r) {
      if (r == null) {
        this._ordinalNumbersByTick = this._ticksByOrdinalNumber = null;
        return;
      }
      for (
        var n = r.ordinalNumbers,
          i = (this._ordinalNumbersByTick = []),
          a = (this._ticksByOrdinalNumber = []),
          o = 0,
          s = this._ordinalMeta.categories.length,
          l = Ut(s, n.length);
        o < l;
        ++o
      ) {
        var u = (i[o] = n[o]);
        a[u] = o;
      }
      for (var f = 0; o < s; ++o) {
        for (; a[f] != null; ) f++;
        ((i[o] = f), (a[f] = o));
      }
    }),
    (t.prototype._getTickNumber = function (r) {
      var n = this._ticksByOrdinalNumber;
      return n && r >= 0 && r < n.length ? n[r] : r;
    }),
    (t.prototype.getRawOrdinalNumber = function (r) {
      var n = this._ordinalNumbersByTick;
      return n && r >= 0 && r < n.length ? n[r] : r;
    }),
    (t.prototype.getLabel = function (r) {
      if (!this.isBlank()) {
        var n = this.getRawOrdinalNumber(r.value),
          i = this._ordinalMeta.categories[n];
        return i == null ? "" : i + "";
      }
    }),
    (t.prototype.count = function () {
      var r = Ha(this._mapper);
      return r[1] - r[0] + 1;
    }),
    (t.prototype.getOrdinalMeta = function () {
      return this._ordinalMeta;
    }),
    (t.type = "ordinal"),
    (t.decoratedMethods = {
      needTransform: function () {
        return this._mapper.needTransform();
      },
      contain: function (r) {
        return this._mapper.contain(this._getTickNumber(r)) && r >= 0 && r < this._ordinalMeta.categories.length;
      },
      normalize: function (r) {
        return this._mapper.normalize(this._getTickNumber(r));
      },
      scale: function (r) {
        return this.getRawOrdinalNumber(dr(this._mapper.scale(r)));
      },
      transformIn: function (r, n) {
        return this._mapper.transformIn(this._getTickNumber(r), n);
      },
      transformOut: function (r, n) {
        return this.getRawOrdinalNumber(this._mapper.transformOut(r, n));
      },
      getExtent: function () {
        return this._mapper.getExtent();
      },
      getExtentUnsafe: function (r, n) {
        return this._mapper.getExtentUnsafe(r, n);
      },
      setExtent: function (r, n) {
        return this._mapper.setExtent(r, n);
      },
      setExtent2: function (r, n, i) {
        return this._mapper.setExtent2(r, n, i);
      },
    }),
    t
  );
})(Fe);
Fe.registerClass(U_);
function av(e, t, r, n) {
  for (var i = e.getTicks({ expandToNicedExtent: !0 }), a = [], o = e.getExtent(), s = 1; s < i.length; s++) {
    var l = i[s],
      u = i[s - 1];
    if (!(u.break || l.break)) {
      for (var f = 0, h = [], c = l.value - u.value, v = c / t, d = kn(v); f < t - 1; ) {
        var p = ft(u.value + (f + 1) * v, d);
        (p > o[0] && p < o[1] && h.push(p), f++);
      }
      var m = Il();
      (m &&
        m.pruneTicksByBreak(
          "auto",
          h,
          r,
          function (g) {
            return g;
          },
          n,
          o,
        ),
        a.push(h));
    }
  }
  return a;
}
var pi = (function (e) {
  V(t, e);
  function t(r) {
    var n = e.call(this) || this;
    ((n.type = "interval"), (n.parse = t.parse), (r = r || {}));
    var i = g0(n, r),
      a = rv(n, i, null);
    return (
      (n.brk = a.brk),
      (n._cfg = { interval: 0, intervalPrecision: 2, intervalCount: void 0, niceExtent: void 0 }),
      n
    );
  }
  return (
    (t.parse = function (r) {
      return r == null || r === "" ? NaN : Number(r);
    }),
    (t.prototype.getConfig = function () {
      return ot(this._cfg);
    }),
    (t.prototype.setConfig = function (r) {
      var n = Ha(this);
      ((this._cfg = r = ot(r)),
        r.niceExtent == null && (r.niceExtent = n.slice()),
        r.intervalPrecision == null && (r.intervalPrecision = kn(r.interval)));
    }),
    (t.prototype.getTicks = function (r) {
      r = r || {};
      var n = this._cfg,
        i = n.interval,
        a = Ha(this),
        o = n.niceExtent,
        s = n.intervalPrecision,
        l = Il(),
        u = this.brk,
        f = l,
        h = [];
      if (!i) return h;
      r.breakTicks;
      var c = 3e3;
      a[0] < o[0] && h.push({ value: r.expandToNicedExtent ? ft(o[0] - i, s) : a[0] });
      for (
        var v = function (_, S) {
            return dr((S - _) / i);
          },
          d = n.intervalCount,
          p = o[0],
          m = 0;
        ;
        m++
      ) {
        if (d == null) {
          if (p > o[1] || !isFinite(p) || !isFinite(o[1])) break;
        } else {
          if (m > d) break;
          ((p = Ut(p, o[1])), m === d && (p = o[1]));
        }
        if ((h.push({ value: p }), (p = ft(p + i, s)), u)) {
          var g = u.calcNiceTickMultiple(p, v);
          g >= 0 && (p = ft(p + g * i, s));
        }
        if (h.length > 0 && p === h[h.length - 1].value) break;
        if (h.length > c) return [];
      }
      var y = h.length ? h[h.length - 1].value : o[1];
      return (a[1] > y && h.push({ value: r.expandToNicedExtent ? ft(y + i, s) : a[1] }), h);
    }),
    (t.prototype.getMinorTicks = function (r) {
      return av(this, r, Lc(this), this._cfg.interval);
    }),
    (t.prototype.getLabel = function (r, n) {
      if (r == null) return "";
      var i = n && n.precision;
      i == null ? (i = Pr(r.value) || 0) : i === "auto" && (i = this._cfg.intervalPrecision);
      var a = ft(r.value, i, !0);
      return x0(a);
    }),
    (t.type = "interval"),
    t
  );
})(Fe);
Fe.registerClass(pi);
var ZI = function (e, t, r, n) {
    for (; r < n; ) {
      var i = (r + n) >>> 1;
      e[i][1] < t ? (r = i + 1) : (n = i);
    }
    return r;
  },
  W_ = (function (e) {
    V(t, e);
    function t(r) {
      var n = e.call(this) || this;
      ((n.type = "time"), (n.parse = t.parse), (n._locale = r.locale), (n._useUTC = r.useUTC), (n._interval = 0));
      var i = g0(n, r),
        a = rv(n, i, null);
      return ((n.brk = a.brk), n);
    }
    return (
      (t.prototype.getLabel = function (r) {
        return Ll(r.value, np[lD(Sa(this._minLevelUnit))] || np.second, this._useUTC, this._locale);
      }),
      (t.prototype.getFormattedLabel = function (r, n, i) {
        return uD(r, n, i, this._locale, this._useUTC);
      }),
      (t.prototype.getTicks = function (r) {
        var n = this._interval,
          i = Ha(this),
          a = this.brk,
          o = [];
        if (!n) return o;
        var s = this._useUTC;
        o = rL(this._minLevelUnit, this._approxInterval, s, i, Bl(this), a);
        var l = Ln.length - 1,
          u = 0;
        return (
          I(o, function (f) {
            f.time && ((l = Math.min(l, vt(Ln, f.time.upperTimeUnit))), (u = Math.max(u, f.time.level)));
          }),
          o
        );
      }),
      (t.prototype.getMinorTicks = function (r) {
        return av(this, r, Lc(this), this._interval);
      }),
      (t.prototype.setTimeInterval = function (r) {
        ((this._interval = r.interval),
          (this._approxInterval = r.approxInterval),
          (this._minLevelUnit = r.minLevelUnit));
      }),
      (t.parse = function (r) {
        return wt(r) ? Math.round(r) : +Pi(r);
      }),
      (t.type = "time"),
      t
    );
  })(Fe),
  Vo = [
    ["second", Pc],
    ["minute", Ec],
    ["hour", _a],
    ["quarter-day", _a * 6],
    ["half-day", _a * 12],
    ["day", Ce * 1.2],
    ["half-week", Ce * 3.5],
    ["week", Ce * 7],
    ["month", Ce * 31],
    ["quarter", Ce * 95],
    ["half-year", rp / 2],
    ["year", rp],
  ];
function qI(e, t, r, n) {
  return sh(new Date(t), e, n).getTime() === sh(new Date(r), e, n).getTime();
}
function KI(e, t) {
  return ((e /= Ce), e > 16 ? 16 : e > 7.5 ? 7 : e > 3.5 ? 4 : e > 1.5 ? 2 : 1);
}
function QI(e) {
  var t = 30 * Ce;
  return ((e /= t), e > 6 ? 6 : e > 3 ? 3 : e > 2 ? 2 : 1);
}
function jI(e) {
  return ((e /= _a), e > 12 ? 12 : e > 6 ? 6 : e > 3.5 ? 4 : e > 2 ? 2 : 1);
}
function vg(e, t) {
  return ((e /= t ? Ec : Pc), e > 30 ? 30 : e > 20 ? 20 : e > 15 ? 15 : e > 10 ? 10 : e > 5 ? 5 : e > 2 ? 2 : 1);
}
function JI(e) {
  return ht(nc(e, !0), 1);
}
function tL(e, t, r) {
  var n = Math.max(0, vt(Ln, t) - 1);
  return sh(new Date(e), Ln[n], r).getTime();
}
function eL(e, t) {
  var r = new Date(0);
  r[e](1);
  var n = r.getTime();
  r[e](1 + t);
  var i = r.getTime() - n;
  return function (a, o) {
    return Math.max(0, Math.round((o - a) / i));
  };
}
function rL(e, t, r, n, i, a) {
  var o = 3e3,
    s = iD,
    l = 0;
  function u(R, B, O, k, z, H, W) {
    for (var $ = eL(z, R), G = B, K = new Date(G); G < O && G <= n[1] && (W.push({ value: G }), !(l++ > o)); )
      if ((K[z](K[k]() + R), (G = K.getTime()), a)) {
        var at = a.calcNiceTickMultiple(G, $);
        at > 0 && (K[z](K[k]() + at * R), (G = K.getTime()));
      }
    W.push({ value: G, notAdd: G > n[1] });
  }
  function f(R, B, O) {
    var k = [],
      z = !B.length;
    if (!qI(Sa(R), n[0], n[1], r)) {
      z && (B = [{ value: tL(n[0], R, r) }, { value: n[1] }]);
      for (var H = 0; H < B.length - 1; H++) {
        var W = B[H].value,
          $ = B[H + 1].value;
        if (W !== $) {
          var G = void 0,
            K = void 0,
            at = void 0,
            Et = !1;
          switch (R) {
            case "year":
              ((G = Math.max(1, Math.round(t / Ce / 365))), (K = m0(r)), (at = fD(r)));
              break;
            case "half-year":
            case "quarter":
            case "month":
              ((G = QI(t)), (K = Rc(r)), (at = y0(r)));
              break;
            case "week":
            case "half-week":
            case "day":
              ((G = KI(t)), (K = Oc(r)), (at = _0(r)), (Et = !0));
              break;
            case "half-day":
            case "quarter-day":
            case "hour":
              ((G = jI(t)), (K = kc(r)), (at = S0(r)));
              break;
            case "minute":
              ((G = vg(t, !0)), (K = Bc(r)), (at = b0(r)));
              break;
            case "second":
              ((G = vg(t, !1)), (K = Nc(r)), (at = w0(r)));
              break;
            case "millisecond":
              ((G = JI(t)), (K = Fc(r)), (at = T0(r)));
              break;
          }
          ($ >= n[0] && W <= n[1] && u(G, W, $, K, at, Et, k),
            R === "year" && O.length > 1 && H === 0 && O.unshift({ value: O[0].value - G }));
        }
      }
      for (var H = 0; H < k.length; H++) O.push(k[H]);
    }
  }
  for (var h = [], c = [], v = 0, d = 0, p = 0; p < s.length; ++p) {
    var m = Sa(s[p]);
    if (sD(s[p])) {
      f(s[p], h[h.length - 1] || [], c);
      var g = s[p + 1] ? Sa(s[p + 1]) : null;
      if (m !== g) {
        if (c.length) {
          ((d = v),
            c.sort(function (R, B) {
              return R.value - B.value;
            }));
          for (var y = [], _ = 0; _ < c.length; ++_) {
            var S = c[_].value;
            (_ === 0 || c[_ - 1].value !== S) && (y.push(c[_]), S >= n[0] && S <= n[1] && v++);
          }
          var b = i / t;
          if ((v > b * 1.5 && d > b / 1.5) || (h.push(y), v > b || e === s[p])) break;
        }
        c = [];
      }
    }
  }
  for (
    var w = Vt(
        j(h, function (R) {
          return Vt(R, function (B) {
            return B.value >= n[0] && B.value <= n[1] && !B.notAdd;
          });
        }),
        function (R) {
          return R.length > 0;
        },
      ),
      T = w.length - 1,
      C = [],
      p = 0;
    p < w.length;
    ++p
  )
    for (var A = w[p], M = 0; M < A.length; ++M) {
      var D = ds(A[M].value, r);
      C.push({ value: A[M].value, time: { level: T - p, upperTimeUnit: D, lowerTimeUnit: D } });
    }
  (sc(C, hT, null),
    C.sort(function (R, B) {
      return R.value - B.value;
    }));
  var P = C[0],
    x = C[C.length - 1],
    L = ds(n[0], r),
    E = ds(n[1], r);
  return (
    (!P || P.value > n[0]) &&
      C.unshift({ value: n[0], time: { level: 0, upperTimeUnit: L, lowerTimeUnit: L }, notNice: !0 }),
    (!x || x.value < n[1]) &&
      C.push({ value: n[1], time: { level: 0, upperTimeUnit: E, lowerTimeUnit: E }, notNice: !0 }),
    C
  );
}
var nL = function (e, t) {
  var r = e.getExtent();
  if ((r[0] === r[1] && ((r[0] -= Ce), (r[1] += Ce)), r[1] === -1 / 0 && r[0] === 1 / 0)) {
    var n = new Date();
    ((r[1] = +new Date(n.getFullYear(), n.getMonth(), n.getDate())), (r[0] = r[1] - Ce));
  }
  e.setExtent(r[0], r[1]);
  var i = iv(t.splitNumber, 10),
    a = Bl(e) / i,
    o = t.minInterval,
    s = t.maxInterval;
  (o != null && a < o && (a = o), s != null && a > s && (a = s));
  var l = Vo.length,
    u = Math.min(ZI(Vo, a, 0, l), l - 1),
    f = Vo[u][1],
    h = Vo[Math.max(u - 1, 0)][0];
  e.setTimeInterval({ approxInterval: a, interval: f, minLevelUnit: h });
};
Fe.registerClass(W_);
var Go = 0,
  Uo = 1,
  Y_ = (function (e) {
    V(t, e);
    function t(r) {
      var n = e.call(this) || this;
      ((n.type = "log"), (n.parse = pi.parse), (n.base = r.logBase || 10));
      var i = [],
        a = [];
      ((n._lookup = { from: i, to: a }), (i[Go] = i[Uo] = a[Go] = a[Uo] = NaN), F_(n, t.mapperMethods), r.breakOption);
      var o = {};
      return (
        (n.powStub = new pi({ breakParsed: o.original })),
        (n.intervalStub = new pi({ breakParsed: o.transformed })),
        z_(n, n.intervalStub),
        n
      );
    }
    return (
      (t.prototype.getTicks = function (r) {
        var n = this.base,
          i = this.powStub,
          a = this.intervalStub,
          o = a.getExtent(),
          s = i.getExtent(),
          l = { lookup: { from: o, to: s } };
        return j(
          a.getTicks(r || {}),
          function (u) {
            var f = u.value,
              h = rf(f, n, l),
              c;
            return { value: h, break: c };
          },
          this,
        );
      }),
      (t.prototype.getMinorTicks = function (r) {
        return av(this, r, Lc(this.powStub), this.intervalStub.getConfig().interval);
      }),
      (t.prototype.getLabel = function (r, n) {
        return this.intervalStub.getLabel(r, n);
      }),
      (t.type = "log"),
      (t.mapperMethods = {
        needTransform: function () {
          return !0;
        },
        normalize: function (r) {
          return this.intervalStub.normalize(Ho(r, this.base));
        },
        scale: function (r) {
          return rf(this.intervalStub.scale(r), this.base, null);
        },
        transformIn: function (r, n) {
          return ((r = Ho(r, this.base)), n && n.depth === Qs ? r : this.intervalStub.transformIn(r, n));
        },
        transformOut: function (r, n) {
          var i = n ? n.depth : null;
          return (
            (dg.depth = i),
            (pg.lookup = this._lookup),
            rf(i === Qs ? r : this.intervalStub.transformOut(r, dg), this.base, pg)
          );
        },
        contain: function (r) {
          return this.powStub.contain(r);
        },
        setExtent: function (r, n) {
          this.setExtent2(De, r, n);
        },
        setExtent2: function (r, n, i) {
          if (!(!Si(n, i) || n <= 0 || i <= 0)) {
            var a = gg,
              o = gg;
            if (r === De) {
              var s = this._lookup;
              ((a = s.to), (o = s.from));
            }
            this.powStub.setExtent2(r, (a[Go] = n), (a[Uo] = i));
            var l = this.base;
            this.intervalStub.setExtent2(r, (o[Go] = Ho(n, l)), (o[Uo] = Ho(i, l)));
          }
        },
        getFilter: function () {
          return { g: 0 };
        },
        sanitize: function (r, n) {
          return (Si(n[0], n[1]) && Ie(r) && r <= 0 && (r = n[0]), r);
        },
        getDefaultStartValue: function () {
          return 1;
        },
        getExtent: function () {
          return this.powStub.getExtent();
        },
        getExtentUnsafe: function (r, n) {
          return n === null ? this.powStub.getExtentUnsafe(r, null) : this.intervalStub.getExtentUnsafe(r, n);
        },
      }),
      t
    );
  })(Fe);
Fe.registerClass(Y_);
var dg = {},
  pg = {},
  gg = [],
  X_ = { value: 1, category: 1, time: 1, log: 1 },
  $_ = St();
function iL(e) {
  var t = e.get("type");
  return ((t == null || (!Qt(X_, t) && !Fe.getClass(t))) && (t = "value"), t);
}
function aL(e, t, r) {
  var n;
  switch (t) {
    case "category":
      return new U_({ ordinalMeta: e.getOrdinalMeta ? e.getOrdinalMeta() : e.getCategories(), extent: be() });
    case "time":
      return new W_({ locale: e.ecModel.getLocaleModel(), useUTC: e.ecModel.get("useUTC"), breakOption: n });
    case "log":
      return new Y_({ logBase: e.get("logBase"), breakOption: n });
    case "value":
      return new pi({ breakOption: n });
    default:
      return new (Fe.getClass(t) || pi)({});
  }
}
function oL(e, t, r) {
  var n = e.getExtentUnsafe(De, null),
    i = n[0],
    a = n[1];
  return Si(i, a) ? (i === t || a === t ? lL : i < t && a > t ? sL : Dh) : Dh;
}
var sL = 1,
  lL = 2,
  Dh = 3;
function uL(e) {
  $_(e).noOnMyZero = !0;
}
function fL(e) {
  return $_(e).noOnMyZero;
}
function Nl(e) {
  var t = e.getLabelModel().get("formatter");
  if (e.type === "time") {
    var r = aD(t);
    return function (i, a) {
      return e.scale.getFormattedLabel(i, a, r);
    };
  } else {
    if (Y(t))
      return function (i) {
        var a = e.scale.getLabel(i),
          o = t.replace("{value}", a ?? "");
        return o;
      };
    if (et(t)) {
      if (e.type === "category")
        return function (i, a) {
          return t(tl(e, i), i.value - e.scale.getExtent()[0], null);
        };
      var n = Il();
      return function (i, a) {
        var o = null;
        return (n && (o = n.makeAxisLabelFormatterParamBreak(o, i.break)), t(tl(e, i), a, o));
      };
    } else
      return function (i) {
        return e.scale.getLabel(i);
      };
  }
}
function tl(e, t) {
  var r = e.scale;
  return ze(r) ? r.getLabel(t) : t.value;
}
function ov(e) {
  var t = e.get("interval");
  return t ?? "auto";
}
function hL(e) {
  return e.type === "category" && ov(e.getLabelModel()) === 0;
}
function cL(e, t) {
  var r = {};
  return (
    I(e.mapDimensionsAll(t), function (n) {
      r[OI(e, n)] = !0;
    }),
    xt(r)
  );
}
function Di(e) {
  return e === "middle" || e === "center";
}
function Va(e) {
  return e.getShallow("show");
}
function vL(e, t, r) {
  var n = e.get("breaks", !0);
  n == null;
}
function Z_(e, t, r, n, i, a) {
  var o = Ci(e),
    s = o ? e.intervalStub : e;
  if ((s.setExtent(n[0], n[1]), o)) {
    var l = e.powStub,
      u = { depth: Qs },
      f = e.transformOut(n[0], u),
      h = e.transformOut(n[1], u),
      c = $I(r, n);
    (t[0] && !c[0] && (f = i[0]), t[1] && !c[1] && (h = i[1]), l.setExtent(f, h));
  }
  s.setConfig(a);
}
function Ja(e, t) {
  return ze(e) ? e.getRawOrdinalNumber(t.value) : t.value;
}
function q_(e, t) {
  return ze(e) && !!t.get("boundaryGap");
}
var dL = (function () {
    function e() {}
    return (
      (e.prototype.needIncludeZero = function () {
        return !this.option.scale;
      }),
      (e.prototype.getCoordSysModel = function () {}),
      e
    );
  })(),
  pL = yy(),
  Ah = "|&",
  Bi = St(),
  K_ = -2,
  gL = -1,
  mL = St();
function Q_(e, t) {
  var r = e.model,
    n = Bi(Oi(r.ecModel)).keyed,
    i = n && n.get(t);
  return i && i.get(r.uid);
}
function yL(e, t) {
  return J_(Q_(e, t));
}
function _L(e, t) {
  var r = [];
  return (
    j_(e.model.ecModel, function (n) {
      for (var i = 0; i < t.length; i++) t[i] && n.serByIdx[t[i].seriesIndex] && r.push(J_(n));
    }),
    r
  );
}
function j_(e, t) {
  var r = Bi(Oi(e)).keyed;
  r &&
    r.each(function (n, i) {
      n.each(function (a, o) {
        t(a, i, o);
      });
    });
}
function J_(e) {
  return { liPosMinGap: e ? e.liPosMinGap : void 0 };
}
function SL(e, t) {
  var r = e.model.ecModel,
    n = Bi(Oi(r)).axSer;
  n && sv(r, n.get(e.model.uid), t);
}
function tS(e, t, r) {
  var n = Q_(e, t);
  n && sv(e.model.ecModel, n.sers, r);
}
function sv(e, t, r) {
  if (t)
    for (var n = 0; n < t.length; n++) {
      var i = t[n];
      e.isSeriesFiltered(i) || r(i);
    }
}
function bL(e, t, r) {
  var n = Bi(Oi(e)).keyed,
    i = n && n.get(t);
  i &&
    i.each(function (a) {
      r(a.axis);
    });
}
function eS(e, t) {
  var r = e.model,
    n = Bi(Oi(r.ecModel)).keys;
  n &&
    I(n.get(r.uid), function (i) {
      t(i);
    });
}
function wL(e) {
  var t = mL(dM(e)),
    r = t.keyed || (t.keyed = Q());
  j_(e, function (n, i, a) {
    var o = r.get(i) || r.set(i, Q()),
      s = o.get(a) || o.set(a, {});
    n.metrics.liPosMinGap && rS.liPosMinGap(e, n, s);
  });
}
function TL(e, t) {
  rS[e] = t;
}
var rS = {};
function mg(e, t, r) {
  if (e) {
    var n = t.ecModel,
      i = Bi(Oi(n)),
      a = e.model.uid,
      o = i.axSer || (i.axSer = Q()),
      s = o.get(a) || o.set(a, []);
    s.push(t);
    var l = t.subType,
      u = t.getBaseAxis() === e,
      f = Ih.get(Mh(l, u, r)) || Ih.get(Mh(l, u, null));
    if (f) {
      var h = i.keyed || (i.keyed = Q()),
        c = i.keys || (i.keys = Q()),
        v = f.key,
        d = h.get(v) || h.set(v, Q()),
        p = d.get(a);
      (p ||
        ((p = d.set(a, { axis: e, sers: [], serByIdx: [] })),
        (p.metrics = f.getMetrics(e)),
        (c.get(a) || c.set(a, [])).push(v)),
        p.sers.push(t),
        (p.serByIdx[t.seriesIndex] = t));
    }
  }
}
function Mh(e, t, r) {
  return e + Ah + q(t, !0) + Ah + (r || "");
}
function xL(e, t) {
  var r = Mh(t.seriesType, t.baseAxis, t.coordSysType);
  (Ih.set(r, t),
    pL(e, function () {
      e.registerProcessor(e.PRIORITY.PROCESSOR.AXIS_STATISTICS, { overallReset: wL });
    }));
}
var Ih = Q(),
  CL = St(),
  DL = 1,
  AL = 3,
  nS = (function () {
    function e(t, r, n, i, a) {
      var o = ze(t),
        s = o ? r.getCategories().length : null,
        l;
      if (o) {
        var u = r.getCategories(!0);
        l = u && !u.length;
      }
      var f = n.slice();
      ((Js(t) || Ci(t) || nv(t)) && (gy(f, ea(t, r.get("dataMin", !0))), my(f, ea(t, r.get("dataMax", !0)))),
        lT(f) || (f[0] = f[1] = NaN));
      var h = [],
        c = [!1, !1],
        v = r.get("min", !0);
      v === "dataMin"
        ? ((h[0] = f[0]), (c[0] = !0))
        : ((h[0] = ea(t, et(v) ? v({ min: f[0], max: f[1] }) : v)), (c[0] = h[0] != null));
      var d = r.get("max", !0);
      d === "dataMax"
        ? ((h[1] = f[1]), (c[1] = !0))
        : ((h[1] = ea(t, et(d) ? d({ min: f[0], max: f[1] }) : d)), (c[1] = h[1] != null));
      var p = ML(t, r),
        m = o ? null : f[1] - f[0] || Math.abs(f[0]);
      (h[0] == null && (h[0] = o ? (l ? f[0] : s ? 0 : NaN) : f[0] - p[0] * m),
        h[1] == null && (h[1] = o ? (l ? f[1] : s ? s - 1 : NaN) : f[1] + p[1] * m),
        !pr(h[0]) && (h[0] = NaN),
        !pr(h[1]) && (h[1] = NaN));
      var g = l || Ma(h[0]) || Ma(h[1]) || (o && !s),
        y = Js(t),
        _ = y && r.needIncludeZero && r.needIncludeZero();
      _ && (h[0] > 0 && h[1] > 0 && !c[0] && (h[0] = 0), h[0] < 0 && h[1] < 0 && !c[1] && (h[1] = 0));
      var S = !1;
      h[0] > h[1] && (h.reverse(), (S = !0));
      var b = ea(t, r.get("startValue", !0)),
        w = b != null;
      (!Ie(b) && i && (b = t.getDefaultStartValue ? t.getDefaultStartValue() : 0),
        Ie(b) &&
          (w || !y || _) &&
          (b < h[0] && !c[0] ? ((h[0] = b), (c[0] = !0)) : b > h[1] && !c[1] && ((h[1] = b), (c[1] = !0))));
      var T = (this._i = {
        scale: t,
        dataMM: f,
        noZoomEffMM: h,
        zoomMM: [],
        fixMM: c,
        zoomFixMM: [!1, !1],
        startValue: b,
        isBlank: g,
        incl0: _,
        tggAxInv: S,
        ctnShp: a,
      });
      yg(T, h);
    }
    return (
      (e.prototype.makeNoZoom = function () {
        return this._i.noZoomEffMM.slice();
      }),
      (e.prototype.makeFinal = function () {
        var t = this._i,
          r = t.zoomMM,
          n = t.noZoomEffMM,
          i = t.zoomFixMM,
          a = t.fixMM,
          o = {
            fixMM: a,
            zoomFixMM: i,
            isBlank: t.isBlank,
            incl0: t.incl0,
            tggAxInv: t.tggAxInv,
            ctnShp: t.ctnShp,
            effMM: n.slice(),
          },
          s = o.effMM;
        return (
          r[0] != null && ((s[0] = r[0]), (a[0] = i[0] = !0)),
          r[1] != null && ((s[1] = r[1]), (a[1] = i[1] = !0)),
          yg(t, s),
          o
        );
      }),
      (e.prototype.makeRenderInfo = function () {
        return { startValue: this._i.startValue };
      }),
      (e.prototype.setZoomMM = function (t, r) {
        this._i.zoomMM[t] = r;
      }),
      e
    );
  })();
function yg(e, t) {
  var r = e.scale,
    n = e.dataMM;
  r.sanitize && ((t[0] = r.sanitize(t[0], n)), (t[1] = r.sanitize(t[1], n)), uT(t));
}
function ea(e, t) {
  return t == null ? null : Ma(t) ? NaN : e.parse(t);
}
function ML(e, t) {
  var r;
  if (ze(e)) r = [0, 0];
  else {
    var n = t.get("boundaryGap");
    (typeof n == "boolean" && (n = null), (r = U(n) ? n : [n, n]));
  }
  return [_g(r[0]), _g(r[1])];
}
function _g(e) {
  return Pn(typeof e == "boolean" ? 0 : e, 1) || 0;
}
function iS(e) {
  var t = CL(e.scale);
  return (t.extent || (t.extent = be()), t);
}
function IL(e, t) {
  iS(e).dimIdxInCoord = t.get(e.dim);
}
function LL(e, t) {
  var r = e.scale,
    n = e.model,
    i = e.dim;
  r.rawExtentInfo || PL(r, e, i, n, t);
}
function PL(e, t, r, n, i) {
  var a = iS(t),
    o = a.extent,
    s = !1;
  SL(t, function (f) {
    if (f.boxCoordinateSystem) {
      var h = A0(f).coord,
        c = a.dimIdxInCoord;
      if (c >= 0) {
        if (U(h)) {
          var v = h[c];
          v != null && !U(v) && Xf(o, e.parse(v));
        }
      }
    } else if (f.coordinateSystem) {
      var d = f.getData();
      if (d) {
        var p = e.getFilter ? e.getFilter() : null;
        I(cL(d, r), function (m) {
          sT(o, d.getApproximateExtent(m, p));
        });
      }
      f.__requireStartValue && f.__requireStartValue(t) && (s = !0);
    }
  });
  var l = OL(e, t, n),
    u = new nS(e, n, o, s, l);
  (aS(e, u, i), (a.extent = null));
}
function EL(e, t) {
  var r = e.scale;
  aS(r, new nS(r, e.model, t, !1, !1), AL);
}
function aS(e, t, r) {
  ((e.rawExtentInfo = t), (t.from = r));
}
function RL(e, t) {
  lv.set(e, t);
}
var lv = Q();
function oS(e, t, r, n, i) {
  e.rawExtentInfo || EL({ scale: e, model: t }, be());
  var a = e.rawExtentInfo.makeFinal(),
    o = a.effMM;
  return (
    e.setExtent(o[0], o[1]),
    e.setBlank(a.isBlank),
    n && a.tggAxInv && r && !r.get("legacyMinMaxDontInverseAxis") && (n.inverse = !n.inverse),
    a
  );
}
function OL(e, t, r) {
  var n = q_(e, r),
    i = r.get("containShape", !0);
  if ((i == null && !n && (i = !0), !i)) return !1;
  var a = !1;
  return (
    eS(t, function (o) {
      a = !!lv.get(o) || a;
    }),
    a
  );
}
function kL(e, t, r, n) {
  if (r.ctnShp) {
    var i;
    if (
      (eS(e, function (s) {
        var l = lv.get(s);
        if (l) {
          var u = l(e, n);
          u && ((i = i || [0, 0]), gy(i, u[0]), my(i, u[1]), uL(e));
        }
      }),
      !!i)
    ) {
      var a = t.getExtent();
      if (ze(t)) e.onBand || t.setExtent2(za, Ut(a[0], a[0] + i[0]), ht(a[1], a[1] + i[1]));
      else {
        var o = a.slice();
        (r.zoomFixMM[0] || (o[0] = Ut(o[0], t.transformOut(t.transformIn(o[0], null) + i[0], null))),
          r.zoomFixMM[1] || (o[1] = ht(o[1], t.transformOut(t.transformIn(o[1], null) + i[1], null))),
          (o[0] < a[0] || o[1] > a[1]) && t.setExtent2(za, o[0], o[1]));
      }
    }
  }
}
function Sg(e, t) {
  var r = Ci(e),
    n = r ? e.intervalStub : e,
    i = t.fixMinMax || [],
    a = r ? e.getExtent() : null,
    o = n.getExtent(),
    s = V_(o, i, t.rawExtentResult);
  (n.setExtent(s[0], s[1]), (s = n.getExtent()));
  var l = r ? NL(n, t) : BL(n, t),
    u = l.intervalPrecision,
    f = l.interval,
    h = t.userInterval;
  (h != null && ((l.interval = h), (l.intervalPrecision = kn(h))),
    i[0] || (s[0] = ft(_i(s[0] / f) * f, u)),
    i[1] || (s[1] = ft(Za(s[1] / f) * f, u)),
    h != null && (l.niceExtent = s.slice()),
    Z_(e, i, o, s, a, l));
}
function BL(e, t) {
  var r = iv(t.splitNumber, 5),
    n = Bl(e),
    i = t.minInterval,
    a = t.maxInterval,
    o = nc(n / r, !0);
  (i != null && o < i && (o = i), a != null && o > a && (o = a));
  var s = kn(o),
    l = e.getExtent(),
    u = [ft(Za(l[0] / o) * o, s), ft(_i(l[1] / o) * o, s)];
  return { interval: o, intervalPrecision: s, niceExtent: u };
}
function NL(e, t) {
  var r = iv(t.splitNumber, 10),
    n = e.getExtent(),
    i = Bl(e),
    a = ht(uy(i), 1),
    o = (r / i) * a;
  o <= 0.5 && (a *= 10);
  var s = kn(a),
    l = [ft(Za(n[0] / a) * a, s), ft(_i(n[1] / a) * a, s)];
  return { intervalPrecision: s, interval: a, niceExtent: l };
}
function bg(e) {
  var t = e.scale,
    r = e.model,
    n = r.axis,
    i = r.ecModel;
  FL(t, r, n, i);
}
function FL(e, t, r, n, i) {
  var a = oS(e, t, n, r),
    o = Js(e) || nv(e);
  (zL(e, {
    splitNumber: t.get("splitNumber"),
    fixMinMax: a.fixMM,
    userInterval: t.get("interval"),
    minInterval: o ? t.get("minInterval") : null,
    maxInterval: o ? t.get("maxInterval") : null,
    rawExtentResult: a,
  }),
    r && n && kL(r, e, a, n));
}
function zL(e, t) {
  HL[e.type](e, t);
}
var HL = { interval: Sg, log: Sg, time: nL, ordinal: Gt },
  wg = [],
  VL = {
    registerPreprocessor: L_,
    registerProcessor: P_,
    registerPostInit: lI,
    registerPostUpdate: uI,
    registerUpdateLifecycle: Qc,
    registerAction: ki,
    registerCoordinateSystem: fI,
    registerLayout: hI,
    registerVisual: Nn,
    registerTransform: vI,
    registerLoading: E_,
    registerMap: cI,
    registerImpl: fM,
    PRIORITY: eI,
    ComponentModel: dt,
    ComponentView: Oe,
    SeriesModel: er,
    ChartView: Re,
    registerComponentModel: function (e) {
      dt.registerClass(e);
    },
    registerComponentView: function (e) {
      Oe.registerClass(e);
    },
    registerSeriesModel: function (e) {
      er.registerClass(e);
    },
    registerChartView: function (e) {
      Re.registerClass(e);
    },
    registerCustomSeries: function (e, t) {},
    registerSubTypeDefaulter: function (e, t) {
      dt.registerSubTypeDefaulter(e, t);
    },
    registerPainter: function (e, t) {
      Pw(e, t);
    },
  };
function Vr(e) {
  if (U(e)) {
    I(e, function (t) {
      Vr(t);
    });
    return;
  }
  vt(wg, e) >= 0 || (wg.push(e), et(e) && (e = { install: e }), e.install(VL));
}
var GL = St(),
  xa = St(),
  ke = { estimate: 1, determine: 2 };
function el(e) {
  return { out: { noPxChangeTryDetermine: [] }, kind: e };
}
function UL(e, t) {
  var r = e.getLabelModel().get("customValues");
  if (r) {
    var n = e.scale;
    return {
      labels: j(sS(r, n), function (i, a) {
        return { formattedLabel: Nl(e)(i, a), rawLabel: n.getLabel(i), tick: i };
      }),
    };
  }
  return e.type === "category" ? YL(e, t) : $L(e);
}
function WL(e, t, r) {
  var n = e.scale,
    i = e.getTickModel().get("customValues");
  return i ? { ticks: sS(i, n) } : e.type === "category" ? XL(e, t) : { ticks: n.getTicks(r) };
}
function sS(e, t) {
  var r = t.getExtent(),
    n = [];
  return (
    I(e, function (i) {
      ((i = t.parse(i)), i >= r[0] && i <= r[1] && n.push(i));
    }),
    sc(n, cT, null),
    ec(n),
    j(n, function (i) {
      return { value: i };
    })
  );
}
function YL(e, t) {
  var r = e.getLabelModel(),
    n = lS(e, r, t);
  return !r.get("show") || e.scale.isBlank() ? { labels: [] } : n;
}
function lS(e, t, r) {
  var n = qL(e),
    i = ov(t),
    a = r.kind === ke.estimate;
  if (!a) {
    var o = fS(n, i);
    if (o) return o;
  }
  var s, l;
  et(i) ? (s = rl(e, i, !1)) : ((l = i === "auto" ? KL(e, r) : i), (s = rl(e, l, !1)));
  var u = { labels: s, labelCategoryInterval: l };
  return (
    a
      ? r.out.noPxChangeTryDetermine.push(function () {
          return (Lh(n, i, u), !0);
        })
      : Lh(n, i, u),
    u
  );
}
function XL(e, t) {
  var r = ZL(e),
    n = ov(t),
    i = fS(r, n);
  if (i) return i;
  var a, o;
  if (((!t.get("show") || e.scale.isBlank()) && (a = []), et(n))) a = rl(e, n, !0);
  else if (n === "auto") {
    var s = lS(e, e.getLabelModel(), el(ke.determine));
    ((o = s.labelCategoryInterval),
      (a = j(s.labels, function (l) {
        return l.tick;
      })));
  } else ((o = n), (a = rl(e, o, !0)));
  return Lh(r, n, { ticks: a, tickCategoryInterval: o });
}
function $L(e) {
  var t = e.scale.getTicks(),
    r = Nl(e);
  return {
    labels: j(t, function (n, i) {
      return { formattedLabel: r(n, i), rawLabel: e.scale.getLabel(n), tick: n };
    }),
  };
}
var ZL = uS("axisTick"),
  qL = uS("axisLabel");
function uS(e) {
  return function (r) {
    return xa(r)[e] || (xa(r)[e] = { list: [] });
  };
}
function fS(e, t) {
  for (var r = 0; r < e.list.length; r++) if (e.list[r].key === t) return e.list[r].value;
}
function Lh(e, t, r) {
  return (e.list.push({ key: t, value: r }), r);
}
function KL(e, t) {
  if (t.kind === ke.estimate) {
    var r = e.calculateCategoryInterval(t);
    return (
      t.out.noPxChangeTryDetermine.push(function () {
        return ((xa(e).autoInterval = r), !0);
      }),
      r
    );
  }
  var n = xa(e).autoInterval;
  return n ?? (xa(e).autoInterval = e.calculateCategoryInterval(t));
}
function QL(e, t) {
  var r = t.kind,
    n = JL(e),
    i = Nl(e),
    a = ((n.axisRotate - n.labelRotate) / 180) * Math.PI,
    o = e.scale,
    s = o.getExtent(),
    l = o.count();
  if (s[1] - s[0] < 1) return 0;
  var u = 1,
    f = 40;
  l > f && (u = Math.max(1, Math.floor(l / f)));
  for (
    var h = s[0],
      c = e.dataToCoord(h + 1) - e.dataToCoord(h),
      v = Math.abs(c * Math.cos(a)),
      d = Math.abs(c * Math.sin(a)),
      p = 0,
      m = 0;
    h <= s[1];
    h += u
  ) {
    var g = 0,
      y = 0,
      _ = iy(i({ value: h }), n.font, "center", "top");
    ((g = _.width * 1.3), (y = _.height * 1.3), (p = Math.max(p, g, 7)), (m = Math.max(m, y, 7)));
  }
  var S = p / v,
    b = m / d;
  (isNaN(S) && (S = 1 / 0), isNaN(b) && (b = 1 / 0));
  var w = Math.max(0, Math.floor(Math.min(S, b)));
  if (r === ke.estimate) return (t.out.noPxChangeTryDetermine.push(Tt(jL, null, e, w, l)), w);
  var T = hS(e, w, l);
  return T ?? w;
}
function jL(e, t, r) {
  return hS(e, t, r) == null;
}
function hS(e, t, r) {
  var n = GL(e.model),
    i = e.getExtent(),
    a = n.lastAutoInterval,
    o = n.lastTickCount;
  if (
    a != null &&
    o != null &&
    Math.abs(a - t) <= 1 &&
    Math.abs(o - r) <= 1 &&
    a > t &&
    n.axisExtent0 === i[0] &&
    n.axisExtent1 === i[1]
  )
    return a;
  ((n.lastTickCount = r), (n.lastAutoInterval = t), (n.axisExtent0 = i[0]), (n.axisExtent1 = i[1]));
}
function JL(e) {
  var t = e.getLabelModel();
  return {
    axisRotate: e.getRotate ? e.getRotate() : e.isHorizontal && !e.isHorizontal() ? 90 : 0,
    labelRotate: t.get("rotate") || 0,
    font: t.getFont(),
  };
}
function rl(e, t, r) {
  var n = Nl(e),
    i = e.scale,
    a = [],
    o = et(t);
  return (
    G_(i, o ? 0 : t, function (s, l) {
      var u = i.getLabel(s);
      if (o) {
        var f = !!t(s.value, u);
        if (((s.offInterval = !f), !f && !l)) return;
      }
      a.push(r ? s : { formattedLabel: n(s), rawLabel: u, tick: s });
    }),
    a
  );
}
var tP = 0.8;
function Ni(e, t) {
  t = t || {};
  var r = { w: NaN, w2: NaN },
    n = e.scale,
    i = t.fromStat,
    a = t.min,
    o = UI(n);
  Ie(o) || (o = NaN);
  var s = e.getExtent(),
    l = Pt(s[1] - s[0]);
  return (ze(n) ? eP(r, e, o, l) : i && rP(r, e, o, l, i), a != null && (r.w = Ie(r.w) ? ht(a, r.w) : a), r);
}
function eP(e, t, r, n) {
  var i = t.onBand,
    a = r + (i ? 1 : 0);
  (a === 0 && (a = 1), (e.w = n / a), !i && r && n && (e.w2 = (e.w * r) / n));
}
function rP(e, t, r, n, i) {
  var a = !1,
    o = -1 / 0;
  (I(i.key ? [yL(t, i.key)] : _L(t, i.sers || []), function (s) {
    var l = s.liPosMinGap;
    l != null && (l > 0 ? (l > o && (o = l), (a = !1)) : l === K_ && (a = !0));
  }),
    Ie(r) && r > 0 && Ie(o) ? ((e.w = (n / r) * o), (e.w2 = o)) : a && ((e.w = n * tP), (e.w2 = (e.w * r) / n)));
}
var Tg = [0, 1],
  nP = (function () {
    function e(t, r, n) {
      ((this.onBand = !1), (this.inverse = !1), (this.dim = t), (this.scale = r), (this._extent = n || [0, 0]));
    }
    return (
      (e.prototype.contain = function (t) {
        var r = this._extent,
          n = Math.min(r[0], r[1]),
          i = Math.max(r[0], r[1]);
        return t >= n && t <= i;
      }),
      (e.prototype.containData = function (t) {
        return this.scale.contain(this.scale.parse(t));
      }),
      (e.prototype.getExtent = function () {
        return this._extent.slice();
      }),
      (e.prototype.setExtent = function (t, r) {
        var n = this._extent;
        ((n[0] = t), (n[1] = r));
      }),
      (e.prototype.dataToCoord = function (t, r) {
        var n = this.scale;
        return ((t = n.normalize(n.parse(t))), od(t, Tg, xg(this), r));
      }),
      (e.prototype.coordToData = function (t, r) {
        var n = od(t, xg(this), Tg, r);
        return this.scale.scale(n);
      }),
      (e.prototype.pointToData = function (t, r) {}),
      (e.prototype.getTicksCoords = function (t) {
        t = t || {};
        var r = t.tickModel || this.getTickModel(),
          n = WL(this, r, { breakTicks: t.breakTicks, pruneByBreak: t.pruneByBreak }),
          i = j(
            n.ticks,
            function (s) {
              return { coord: this.dataToCoord(Ja(this.scale, s)), tick: s };
            },
            this,
          ),
          a = r.get("alignWithLabel"),
          o = iP(this, i, a);
        return j(i, function (s) {
          return { coord: s.coord, tickValue: s.tick.value, onBand: o };
        });
      }),
      (e.prototype.getMinorTicksCoords = function () {
        if (ze(this.scale)) return [];
        var t = this.model.getModel("minorTick"),
          r = t.get("splitNumber");
        (r > 0 && r < 100) || (r = 5);
        var n = this.scale.getMinorTicks(r),
          i = j(
            n,
            function (a) {
              return j(
                a,
                function (o) {
                  return { coord: this.dataToCoord(o), tickValue: o };
                },
                this,
              );
            },
            this,
          );
        return i;
      }),
      (e.prototype.getViewLabels = function (t) {
        return ((t = t || el(ke.determine)), UL(this, t).labels);
      }),
      (e.prototype.getLabelModel = function () {
        return this.model.getModel("axisLabel");
      }),
      (e.prototype.getTickModel = function () {
        return this.model.getModel("axisTick");
      }),
      (e.prototype.getBandWidth = function () {
        return Ni(this, { min: 1 }).w;
      }),
      (e.prototype.calculateCategoryInterval = function (t) {
        return ((t = t || el(ke.determine)), QL(this, t));
      }),
      e
    );
  })();
function xg(e) {
  var t = e.getExtent();
  if (e.onBand) {
    var r = t[1] - t[0],
      n = r / e.scale.count() / 2;
    ((t[0] += n), (t[1] -= n));
  }
  return t;
}
function iP(e, t, r) {
  var n = t.length;
  if (!e.onBand || r || !n) return !1;
  var i = Ni(e).w;
  if (!i) return !1;
  I(t, function (s) {
    s.coord -= i / 2;
  });
  var a = e.scale.getExtent(),
    o = t[n - 1];
  return (o.tick.offInterval && t.pop(), t.push({ coord: o.coord + i, tick: { value: a[1] + 1 } }), !0);
}
var Cg = [
    "label",
    "labelLine",
    "layoutOption",
    "priority",
    "defaultAttr",
    "marginForce",
    "minMarginForce",
    "marginDefault",
    "suggestIgnore",
  ],
  aP = 1,
  nl = 2,
  cS = aP | nl;
function il(e, t, r) {
  ((r = r || cS), t ? (e.dirty |= r) : (e.dirty &= ~r));
}
function vS(e, t) {
  return ((t = t || cS), e.dirty == null || !!(e.dirty & t));
}
function Gr(e) {
  if (e) return (vS(e) && oP(e, e.label, e), e);
}
function oP(e, t, r) {
  var n = t.getComputedTransform();
  e.transform = Ac(e.transform, n);
  var i = (e.localRect = Oa(e.localRect, t.getBoundingRect())),
    a = t.style,
    o = a.margin,
    s = r && r.marginForce,
    l = r && r.minMarginForce,
    u = r && r.marginDefault,
    f = a.__marginType;
  f == null && u && ((o = u), (f = li.textMargin));
  for (var h = 0; h < 4; h++)
    nf[h] = f === li.minMargin && l && l[h] != null ? l[h] : s && s[h] != null ? s[h] : o ? o[h] : 0;
  f === li.textMargin && Gs(i, nf, !1, !1);
  var c = (e.rect = Oa(e.rect, i));
  return (
    n && c.applyTransform(n),
    f === li.minMargin && Gs(c, nf, !1, !1),
    (e.axisAligned = Dc(n)),
    ((e.label = e.label || {}).ignore = t.ignore),
    il(e, !1),
    il(e, !0, nl),
    e
  );
}
var nf = [0, 0, 0, 0];
function sP(e, t, r) {
  return (
    (e.transform = Ac(e.transform, r)),
    (e.localRect = Oa(e.localRect, t)),
    (e.rect = Oa(e.rect, t)),
    r && e.rect.applyTransform(r),
    (e.axisAligned = Dc(r)),
    (e.obb = void 0),
    ((e.label = e.label || {}).ignore = !1),
    e
  );
}
function lP(e, t) {
  if (e) {
    ((e.label.x += t.x), (e.label.y += t.y), e.label.markRedraw());
    var r = e.transform;
    r && ((r[4] += t.x), (r[5] += t.y));
    var n = e.rect;
    n && ((n.x += t.x), (n.y += t.y));
    var i = e.obb;
    i && i.fromBoundingRect(e.localRect, r);
  }
}
function Dg(e, t) {
  for (var r = 0; r < Cg.length; r++) {
    var n = Cg[r];
    e[n] == null && (e[n] = t[n]);
  }
  return Gr(e);
}
function Ag(e) {
  var t = e.obb;
  return (
    (!t || vS(e, nl)) && ((e.obb = t = t || new jy()), t.fromBoundingRect(e.localRect, e.transform), il(e, !1, nl)),
    t
  );
}
function uP(e) {
  var t = [];
  e.sort(function (u, f) {
    return (f.suggestIgnore ? 1 : 0) - (u.suggestIgnore ? 1 : 0) || f.priority - u.priority;
  });
  function r(u) {
    if (!u.ignore) {
      var f = u.ensureState("emphasis");
      f.ignore == null && (f.ignore = !1);
    }
    u.ignore = !0;
  }
  for (var n = 0; n < e.length; n++) {
    var i = Gr(e[n]);
    if (!i.label.ignore) {
      for (var a = i.label, o = i.labelLine, s = !1, l = 0; l < t.length; l++)
        if (uv(i, t[l], null, { touchThreshold: 0.05 })) {
          s = !0;
          break;
        }
      s ? (r(a), o && r(o)) : t.push(i);
    }
  }
}
function uv(e, t, r, n) {
  return !e || !t || (e.label && e.label.ignore) || (t.label && t.label.ignore) || !e.rect.intersect(t.rect, r, n)
    ? !1
    : e.axisAligned && t.axisAligned
      ? !0
      : Ag(e).intersect(Ag(t), r, n);
}
const fP = [
  "getWidth",
  "getHeight",
  "getDom",
  "getOption",
  "resize",
  "dispatchAction",
  "convertToPixel",
  "convertFromPixel",
  "containPixel",
  "getDataURL",
  "getConnectedDataURL",
  "appendData",
  "clear",
  "isDisposed",
  "dispose",
];
function hP(e) {
  function t(r) {
    return function (...i) {
      if (!e.value) throw new Error("ECharts is not initialized yet.");
      return Reflect.apply(e.value[r], e.value, i);
    };
  }
  return fP.reduce((r, n) => ((r[n] = t(n)), r), {});
}
function cP(e, t, r) {
  ts([r, e, t], ([n, i, a], o, s) => {
    let l = null;
    if (n && i && a) {
      const { offsetWidth: u, offsetHeight: f } = n,
        { throttle: h = 100, onResize: c } = a === !0 ? {} : a;
      let v = !1;
      const d = () => {
          (i.resize(), c?.());
        },
        p = h ? Rl(d, h) : d;
      ((l = new ResizeObserver(() => {
        (!v && ((v = !0), n.offsetWidth === u && n.offsetHeight === f)) ||
          n.offsetWidth === 0 ||
          n.offsetHeight === 0 ||
          p();
      })),
        l.observe(n));
    }
    s(() => {
      l && (l.disconnect(), (l = null));
    });
  });
}
const vP = { autoresize: [Boolean, Object] },
  dP = Symbol();
function pP(e, t, r) {
  const n = Jo(dP, {}),
    i = $t(() => ({ ...es(n), ...r?.value }));
  Rm(() => {
    const a = e.value;
    a && (t.value ? a.showLoading(i.value) : a.hideLoading());
  });
}
const gP = { loading: Boolean, loadingOptions: Object };
function dS() {
  return typeof window < "u" && typeof document < "u";
}
const mP = /^on[^a-z]/,
  pS = (e) => mP.test(e);
function yP(e) {
  const t = {};
  for (const r in e) pS(r) || (t[r] = e[r]);
  return t;
}
function _P(e) {
  const t = Number(e);
  return Number.isInteger(t) && t >= 0 && t < Math.pow(2, 32) - 1 && String(t) === e;
}
function SP(e, t) {
  const r = new Set(e),
    n = new Set(t);
  if (r.size !== n.size) return !1;
  for (const i of r) if (!n.has(i)) return !1;
  return !0;
}
function gS(e) {
  return e != null && typeof e == "object" && !Array.isArray(e);
}
const mS = { tooltip: ["tooltip", "formatter"], dataView: ["toolbox", "feature", "dataView", "optionToContent"] },
  bP = Object.keys(mS);
function af(e) {
  return bP.some((t) => e === t || e.startsWith(t + "-"));
}
function wP(e, t) {
  const r = dS() ? document.createElement("div") : void 0,
    n = Vl({}),
    i = Vl({}),
    a = Vl({}),
    o = Da(!1),
    s = () =>
      o.value && r
        ? _f(
            M1,
            { to: r },
            Object.entries(e)
              .filter(([h]) => af(h))
              .map(([h, c]) => {
                const v = h;
                return _f(
                  "div",
                  {
                    ref: (d) => {
                      d instanceof HTMLElement && (n[v] = d);
                    },
                    style: { display: "contents" },
                  },
                  i[v] ? c?.(a[v]) : void 0,
                );
              }),
          )
        : void 0;
  function l(h) {
    return h !== null && typeof h == "object" && !Array.isArray(h);
  }
  function u(h) {
    const c = { ...h },
      v = (d, p) => {
        const m = d[p];
        if (Array.isArray(m)) return ((d[p] = [...m]), d[p]);
        if (l(m)) return ((d[p] = { ...m }), d[p]);
        if (m === void 0) return ((d[p] = _P(p) ? [] : {}), d[p]);
      };
    return (
      Object.keys(e)
        .filter((d) => af(d))
        .forEach((d) => {
          const [p, ...m] = d.split("-"),
            g = mS[p];
          if (!g) return;
          const y = [...m, ...g];
          if (y.length === 0) return;
          let _ = c;
          for (let S = 0; S < y.length - 1; S++) if (((_ = v(_, y[S])), !_)) return;
          _[y[y.length - 1]] = (S) => ((i[d] = !0), (a[d] = S), n[d]);
        }),
      c
    );
  }
  let f = [];
  return (
    D1(() => {
      const h = Object.keys(e).filter(af);
      SP(h, f) ||
        (f.forEach((c) => {
          h.includes(c) || (delete a[c], delete i[c], delete n[c]);
        }),
        (f = h),
        t());
    }),
    Wh(() => {
      o.value = !0;
    }),
    A1(() => {
      r?.remove();
    }),
    { teleportedSlots: s, patchOption: u }
  );
}
let xr = null;
const Ph = "x-vue-echarts";
function TP() {
  if (xr != null) return xr;
  const e = globalThis.customElements;
  if (!dS() || !e?.get) return ((xr = !1), xr);
  if (!e.get(Ph))
    try {
      class t extends HTMLElement {
        __dispose = null;
        disconnectedCallback() {
          this.__dispose && (this.__dispose(), (this.__dispose = null));
        }
      }
      e.define(Ph, t);
    } catch {
      return ((xr = !1), xr);
    }
  return ((xr = !0), xr);
}
function xP(e) {
  if (!gS(e)) return;
  const t = e.id;
  if (typeof t == "string") return t;
  if (typeof t == "number" && Number.isFinite(t)) return String(t);
}
function Mg(e) {
  const t = e,
    r = Array.isArray(t.options) ? t.options.length : 0,
    n = Array.isArray(t.media) ? t.media.length : 0,
    i = Object.create(null),
    a = [],
    o = [];
  for (const s of Object.keys(t)) {
    if (s === "options" || s === "media") continue;
    const l = t[s];
    if (Array.isArray(l)) {
      const u = l,
        f = new Set();
      let h = 0;
      for (let c = 0; c < u.length; c++) {
        const v = xP(u[c]);
        v !== void 0 ? f.add(v) : h++;
      }
      i[s] = { idsSorted: f.size > 0 ? Array.from(f).sort() : [], noIdCount: h };
    } else gS(l) ? a.push(s) : l !== void 0 && o.push(s);
  }
  return (
    a.length > 1 && a.sort(),
    o.length > 1 && o.sort(),
    { optionsLength: r, mediaLength: n, arrays: i, objects: a, scalars: o }
  );
}
function Ig(e, t) {
  if (e.length === 0) return [];
  if (t.length === 0) return e.slice();
  const r = new Set(t),
    n = [];
  for (let i = 0; i < e.length; i++) {
    const a = e[i];
    r.has(a) || n.push(a);
  }
  return n;
}
function CP(e, t) {
  if (e.length === 0) return !1;
  if (t.length === 0) return !0;
  const r = new Set(t);
  for (let n = 0; n < e.length; n++) if (!r.has(e[n])) return !0;
  return !1;
}
function DP(e, t) {
  const r = Mg(t);
  if (!e) return { option: t, signature: r, plan: { notMerge: !1 } };
  if (r.optionsLength < e.optionsLength) return { option: t, signature: r, plan: { notMerge: !0 } };
  if (r.mediaLength < e.mediaLength) return { option: t, signature: r, plan: { notMerge: !0 } };
  if (Ig(e.scalars, r.scalars).length > 0) return { option: t, signature: r, plan: { notMerge: !0 } };
  const n = new Set(),
    i = new Map(),
    a = Ig(e.objects, r.objects);
  for (let u = 0; u < a.length; u++) i.set(a[u], null);
  for (const u of Object.keys(e.arrays)) {
    const f = e.arrays[u];
    if (!f) continue;
    const h = r.arrays[u];
    if (!h) {
      (f.idsSorted.length > 0 || f.noIdCount > 0) && (i.set(u, []), n.add(u));
      continue;
    }
    if (CP(f.idsSorted, h.idsSorted)) {
      n.add(u);
      continue;
    }
    h.noIdCount < f.noIdCount && n.add(u);
  }
  let o = t,
    s = r;
  if (i.size > 0) {
    const u = { ...t };
    (i.forEach((f, h) => {
      u[h] = f;
    }),
      (o = u),
      (s = Mg(o)));
  }
  const l = n.size > 0 ? Array.from(n).sort() : void 0;
  return { option: o, signature: s, plan: l ? { notMerge: !1, replaceMerge: l } : { notMerge: !1 } };
}
var Lg = `x-vue-echarts{display:block;width:100%;height:100%;min-width:0;}
x-vue-echarts>:first-child,x-vue-echarts>:first-child>canvas{border-radius:inherit;}
`;
if (typeof document < "u")
  if (Array.isArray(document.adoptedStyleSheets) && "replaceSync" in CSSStyleSheet.prototype) {
    const e = new CSSStyleSheet();
    (e.replaceSync(Lg), (document.adoptedStyleSheets = [...document.adoptedStyleSheets, e]));
  } else {
    const e = document.createElement("style");
    ((e.textContent = Lg), document.head.appendChild(e));
  }
const AP = TP(),
  yS = Symbol(),
  MP = Symbol(),
  IP = Symbol();
var LP = Em({
    name: "Echarts",
    inheritAttrs: !1,
    props: {
      option: Object,
      theme: { type: [Object, String] },
      initOptions: Object,
      updateOptions: Object,
      group: String,
      manualUpdate: Boolean,
      ...vP,
      ...gP,
    },
    emits: {},
    slots: Object,
    setup(e, { attrs: t, expose: r, slots: n }) {
      const i = Da(),
        a = Da(),
        o = Jo(yS, null),
        s = Jo(MP, null),
        l = Jo(IP, null),
        { autoresize: u, manualUpdate: f, loading: h, loadingOptions: c } = T1(e),
        v = $t(() => e.theme || es(o)),
        d = $t(() => e.initOptions || es(s) || void 0),
        p = $t(() => e.updateOptions || es(l)),
        m = $t(() => yP(t)),
        g = {},
        y = new Map(),
        { teleportedSlots: _, patchOption: S } = wP(n, () => {
          !f.value && e.option && a.value && T(a.value, e.option);
        });
      let b;
      function w(P) {
        const x = {},
          L = (P?.replaceMerge ?? []).filter((E) => E != null);
        return (
          L.length > 0 && (x.replaceMerge = [...new Set(L)]),
          P?.notMerge !== void 0 && (x.notMerge = P.notMerge),
          x
        );
      }
      function T(P, x, L, E = !1) {
        const R = S(x);
        if (E) {
          (P.setOption(R, L ?? {}), (b = void 0));
          return;
        }
        if (p.value) {
          const k = L ?? p.value;
          (P.setOption(R, k), (b = void 0));
          return;
        }
        const B = DP(b, R),
          O = w(B.plan);
        (P.setOption(B.option, O), (b = B.signature));
      }
      Object.keys(t)
        .filter((P) => pS(P))
        .forEach((P) => {
          if (P.indexOf("Native:") === 2) {
            const R = `on${P.charAt(9).toUpperCase()}${P.slice(10)}`;
            g[R] = t[P];
            return;
          }
          let x = P.charAt(2).toLowerCase() + P.slice(3),
            L;
          x.indexOf("zr:") === 0 && ((L = !0), (x = x.substring(3)));
          let E;
          (x.substring(x.length - 4) === "Once" && ((E = !0), (x = x.substring(0, x.length - 4))),
            y.set({ event: x, zr: L, once: E }, t[P]));
        });
      function C() {
        if (!i.value) return;
        const P = (a.value = oI(i.value, v.value, d.value));
        (e.group && (P.group = e.group),
          y.forEach((E, { zr: R, once: B, event: O }) => {
            if (!E) return;
            const k = R ? P.getZr() : P;
            if (B) {
              const z = E;
              let H = !1;
              E = (...W) => {
                H || ((H = !0), z(...W), k.off(O, E));
              };
            }
            k.on(O, E);
          }));
        function x() {
          P && !P.isDisposed() && P.resize();
        }
        function L() {
          const { option: E } = e;
          if (f.value) {
            E && T(P, E, void 0, !0);
            return;
          }
          E && T(P, E);
        }
        u.value
          ? C1(() => {
              (x(), L());
            })
          : L();
      }
      const A = (P, x, L) => {
        if (!e.manualUpdate) return;
        const E = typeof x == "boolean" ? { notMerge: x, lazyUpdate: L } : x;
        a.value && T(a.value, P, E ?? void 0, !0);
      };
      function M() {
        (a.value && (a.value.dispose(), (a.value = void 0)), (b = void 0));
      }
      (ts(
        () => e.option,
        (P) => {
          if (!P) {
            b = void 0;
            return;
          }
          f.value || (a.value && T(a.value, P));
        },
        { deep: !0 },
      ),
        ts(
          [f, d],
          () => {
            (M(), C());
          },
          { deep: !0 },
        ),
        ts(
          v,
          (P) => {
            a.value?.setTheme(P || {});
          },
          { deep: !0 },
        ),
        Rm(() => {
          e.group && a.value && (a.value.group = e.group);
        }));
      const D = hP(a);
      return (
        pP(a, h, c),
        cP(a, u, i),
        Wh(() => {
          C();
        }),
        x1(() => {
          AP && i.value ? (i.value.__dispose = M) : M();
        }),
        r({ setOption: A, root: i, chart: a, ...D }),
        () => _f(Ph, { ...m.value, ...g, ref: i, class: ["echarts", m.value.class] }, _())
      );
    },
  }),
  Wo = LP,
  PP = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), (r.hasSymbolVisual = !0), r);
    }
    return (
      (t.prototype.getInitialData = function (r) {
        return ev(null, this, { useEncodeDefaulter: !0 });
      }),
      (t.prototype.getLegendIcon = function (r) {
        var n = new Bt(),
          i = Ti("line", 0, r.itemHeight / 2, r.itemWidth, 0, r.lineStyle.stroke, !1);
        (n.add(i), i.setStyle(r.lineStyle));
        var a = this.getData().getVisual("symbol"),
          o = this.getData().getVisual("symbolRotate"),
          s = a === "none" ? "circle" : a,
          l = r.itemHeight * 0.8,
          u = Ti(s, (r.itemWidth - l) / 2, (r.itemHeight - l) / 2, l, l, r.itemStyle.fill);
        (n.add(u), u.setStyle(r.itemStyle));
        var f = r.iconRotate === "inherit" ? o : r.iconRotate || 0;
        return (
          (u.rotation = (f * Math.PI) / 180),
          u.setOrigin([r.itemWidth / 2, r.itemHeight / 2]),
          s.indexOf("empty") > -1 &&
            ((u.style.stroke = u.style.fill), (u.style.fill = X.color.neutral00), (u.style.lineWidth = 2)),
          n
        );
      }),
      (t.type = "series.line"),
      (t.dependencies = ["grid", "polar"]),
      (t.defaultOption = {
        z: 3,
        coordinateSystem: "cartesian2d",
        legendHoverLink: !0,
        clip: !0,
        label: { position: "top" },
        endLabel: { show: !1, valueAnimation: !0, distance: 8 },
        lineStyle: { width: 2, type: "solid" },
        emphasis: { scale: !0 },
        step: !1,
        smooth: !1,
        smoothMonotone: null,
        symbol: "emptyCircle",
        symbolSize: 6,
        symbolRotate: null,
        showSymbol: !0,
        showAllSymbol: "auto",
        connectNulls: !1,
        sampling: "none",
        animationEasing: "linear",
        progressive: 0,
        hoverLayerThreshold: 1 / 0,
        universalTransition: { divideShape: "clone" },
        triggerLineEvent: !1,
        triggerEvent: !1,
      }),
      t
    );
  })(er);
function fv(e, t) {
  var r = e.mapDimensionsAll("defaultedLabel"),
    n = r.length;
  if (n === 1) {
    var i = wi(e, t, r[0]);
    return i != null ? i + "" : null;
  } else if (n) {
    for (var a = [], o = 0; o < r.length; o++) a.push(wi(e, t, r[o]));
    return a.join(" ");
  }
}
function _S(e, t) {
  var r = e.mapDimensionsAll("defaultedLabel");
  if (!U(t)) return t + "";
  for (var n = [], i = 0; i < r.length; i++) {
    var a = e.getDimensionIndex(r[i]);
    a >= 0 && n.push(t[a]);
  }
  return n.join(" ");
}
var hv = (function (e) {
  V(t, e);
  function t(r, n, i, a) {
    var o = e.call(this) || this;
    return (o.updateData(r, n, i, a), o);
  }
  return (
    (t.prototype._createSymbol = function (r, n, i, a, o, s) {
      this.removeAll();
      var l = Ti(r, -1, -1, 2, 2, null, s);
      (l.attr({ z2: q(o, 100), culling: !0, scaleX: a[0] / 2, scaleY: a[1] / 2 }),
        (l.drift = EP),
        (this._symbolType = r),
        this.add(l));
    }),
    (t.prototype.stopSymbolAnimation = function (r) {
      this.childAt(0).stopAnimation(null, r);
    }),
    (t.prototype.getSymbolType = function () {
      return this._symbolType;
    }),
    (t.prototype.getSymbolPath = function () {
      return this.childAt(0);
    }),
    (t.prototype.highlight = function () {
      Fs(this.childAt(0));
    }),
    (t.prototype.downplay = function () {
      zs(this.childAt(0));
    }),
    (t.prototype.setZ = function (r, n) {
      var i = this.childAt(0);
      ((i.zlevel = r), (i.z = n));
    }),
    (t.prototype.setDraggable = function (r, n) {
      var i = this.childAt(0);
      ((i.draggable = r), (i.cursor = !n && r ? "move" : i.cursor));
    }),
    (t.prototype.updateData = function (r, n, i, a) {
      this.silent = !1;
      var o = r.getItemVisual(n, "symbol") || "circle",
        s = r.hostModel,
        l = t.getSymbolSize(r, n),
        u = t.getSymbolZ2(r, n),
        f = o !== this._symbolType,
        h = a && a.disableAnimation;
      if (f) {
        var c = r.getItemVisual(n, "symbolKeepAspect");
        this._createSymbol(o, r, n, l, u, c);
      } else {
        var v = this.childAt(0);
        v.silent = !1;
        var d = { scaleX: l[0] / 2, scaleY: l[1] / 2 };
        (h ? v.attr(d) : he(v, d, s, n), t0(v));
      }
      if ((this._updateCommon(r, n, l, i, a), f)) {
        var v = this.childAt(0);
        if (!h) {
          var d = { scaleX: this._sizeX, scaleY: this._sizeY, style: { opacity: v.style.opacity } };
          ((v.scaleX = v.scaleY = 0), (v.style.opacity = 0), gr(v, d, s, n));
        }
      }
      h && this.childAt(0).stopAnimation("leave");
    }),
    (t.prototype._updateCommon = function (r, n, i, a, o) {
      var s = this.childAt(0),
        l = r.hostModel,
        u,
        f,
        h,
        c,
        v,
        d,
        p,
        m,
        g;
      if (
        (a &&
          ((u = a.emphasisItemStyle),
          (f = a.blurItemStyle),
          (h = a.selectItemStyle),
          (c = a.focus),
          (v = a.blurScope),
          (p = a.labelStatesModels),
          (m = a.hoverScale),
          (g = a.cursorStyle),
          (d = a.emphasisDisabled)),
        !a || r.hasItemOption)
      ) {
        var y = a && a.itemModel ? a.itemModel : r.getItemModel(n),
          _ = y.getModel("emphasis");
        ((u = _.getModel("itemStyle").getItemStyle()),
          (h = y.getModel(["select", "itemStyle"]).getItemStyle()),
          (f = y.getModel(["blur", "itemStyle"]).getItemStyle()),
          (c = _.get("focus")),
          (v = _.get("blurScope")),
          (d = _.get("disabled")),
          (p = Dl(y)),
          (m = _.getShallow("scale")),
          (g = y.getShallow("cursor")));
      }
      var S = r.getItemVisual(n, "symbolRotate");
      s.attr("rotation", ((S || 0) * Math.PI) / 180 || 0);
      var b = f_(r.getItemVisual(n, "symbolOffset"), i);
      (b && ((s.x = b[0]), (s.y = b[1])), g && s.attr("cursor", g));
      var w = r.getItemVisual(n, "style"),
        T = w.fill;
      if (s instanceof Ur) {
        var C = s.style;
        s.useStyle(N({ image: C.image, x: C.x, y: C.y, width: C.width, height: C.height }, w));
      } else
        (s.__isEmptyBrush ? s.useStyle(N({}, w)) : s.useStyle(w),
          (s.style.decal = null),
          s.setColor(T, o && o.symbolInnerColor),
          (s.style.strokeNoScale = !0));
      var A = r.getItemVisual(n, "liftZ"),
        M = this._z2;
      A != null ? M == null && ((this._z2 = s.z2), (s.z2 += A)) : M != null && ((s.z2 = M), (this._z2 = null));
      var D = o && o.useNameLabel;
      Cl(s, p, { labelFetcher: l, labelDataIndex: n, defaultText: P, inheritColor: T, defaultOpacity: w.opacity });
      function P(E) {
        return D ? r.getName(E) : fv(r, E);
      }
      ((this._sizeX = i[0] / 2), (this._sizeY = i[1] / 2));
      var x = s.ensureState("emphasis");
      ((x.style = u), (s.ensureState("select").style = h), (s.ensureState("blur").style = f));
      var L = m == null || m === !0 ? Math.max(1.1, 3 / this._sizeY) : isFinite(m) && m > 0 ? +m : 1;
      ((x.scaleX = this._sizeX * L), (x.scaleY = this._sizeY * L), this.setSymbolScale(1), Hs(this, c, v, d));
    }),
    (t.prototype.setSymbolScale = function (r) {
      this.scaleX = this.scaleY = r;
    }),
    (t.prototype.fadeOut = function (r, n, i) {
      var a = this.childAt(0),
        o = ut(this).dataIndex,
        s = i && i.animation;
      if (((this.silent = a.silent = !0), i && i.fadeLabel)) {
        var l = a.getTextContent();
        l &&
          Vs(l, { style: { opacity: 0 } }, n, {
            dataIndex: o,
            removeOpt: s,
            cb: function () {
              a.removeTextContent();
            },
          });
      } else a.removeTextContent();
      Vs(a, { style: { opacity: 0 }, scaleX: 0, scaleY: 0 }, n, { dataIndex: o, cb: r, removeOpt: s });
    }),
    (t.getSymbolSize = function (r, n) {
      return DM(r.getItemVisual(n, "symbolSize"));
    }),
    (t.getSymbolZ2 = function (r, n) {
      return r.getItemVisual(n, "z2");
    }),
    t
  );
})(Bt);
function EP(e, t) {
  this.parent.drift(e, t);
}
function Yo(e, t, r, n) {
  return (
    t &&
    !isNaN(t[0]) &&
    !isNaN(t[1]) &&
    !(n && n.isIgnore && n.isIgnore(r)) &&
    !(n && n.clipShape && !n.clipShape.contain(t[0], t[1])) &&
    e.getItemVisual(r, "symbol") !== "none"
  );
}
function Pg(e) {
  return (e != null && !Z(e) && (e = { isIgnore: e }), e || {});
}
function Eg(e) {
  var t = e.hostModel,
    r = t.getModel("emphasis");
  return {
    emphasisItemStyle: r.getModel("itemStyle").getItemStyle(),
    blurItemStyle: t.getModel(["blur", "itemStyle"]).getItemStyle(),
    selectItemStyle: t.getModel(["select", "itemStyle"]).getItemStyle(),
    focus: r.get("focus"),
    blurScope: r.get("blurScope"),
    emphasisDisabled: r.get("disabled"),
    hoverScale: r.get("scale"),
    labelStatesModels: Dl(t),
    cursorStyle: t.get("cursor"),
  };
}
function Rg(e, t, r, n, i, a, o) {
  var s = new e(t, r, n, i);
  return (s.setPosition(a), t.setItemGraphicEl(r, s), o.add(s), s);
}
var RP = (function () {
  function e(t) {
    ((this.group = new Bt()), (this._SymbolCtor = t || hv));
  }
  return (
    (e.prototype.updateData = function (t, r) {
      ((this._progressiveEls = null), (r = Pg(r)));
      var n = this.group,
        i = t.hostModel,
        a = this._data,
        o = this._SymbolCtor,
        s = r.disableAnimation,
        l = (this._seriesScope = Eg(t)),
        u = { disableAnimation: s },
        f =
          r.getSymbolPoint ||
          function (h) {
            return t.getItemLayout(h);
          };
      (a || n.removeAll(),
        t
          .diff(a)
          .add(function (h) {
            var c = f(h);
            Yo(t, c, h, r) && Rg(o, t, h, l, u, c, n);
          })
          .update(function (h, c) {
            var v = a.getItemGraphicEl(c),
              d = f(h);
            if (!Yo(t, d, h, r)) {
              n.remove(v);
              return;
            }
            var p = t.getItemVisual(h, "symbol") || "circle",
              m = v && v.getSymbolType && v.getSymbolType();
            if (!v || (m && m !== p)) (n.remove(v), (v = new o(t, h, l, u)), v.setPosition(d));
            else {
              v.updateData(t, h, l, u);
              var g = { x: d[0], y: d[1] };
              s ? v.attr(g) : he(v, g, i);
            }
            (n.add(v), t.setItemGraphicEl(h, v));
          })
          .remove(function (h) {
            var c = a.getItemGraphicEl(h);
            c &&
              c.fadeOut(function () {
                n.remove(c);
              }, i);
          })
          .execute(),
        (this._getSymbolPoint = f),
        (this._data = t));
    }),
    (e.prototype.updateLayout = function (t) {
      var r = this._data;
      if (r)
        for (var n = this, i = r.getStore(), a = 0, o = i.count(); a < o; a++) {
          var s = r.getItemGraphicEl(a),
            l = n._getSymbolPoint(a);
          Yo(r, l, a, t)
            ? ((s = s || Rg(n._SymbolCtor, r, a, n._seriesScope, { disableAnimation: !0 }, l, n.group)),
              s.stopAnimation(),
              s.setPosition(l),
              s.markRedraw())
            : s && (n.group.remove(s), r.setItemGraphicEl(a, null));
        }
    }),
    (e.prototype.incrementalPrepareUpdate = function (t) {
      ((this._seriesScope = Eg(t)), (this._data = null), this.group.removeAll());
    }),
    (e.prototype.incrementalUpdate = function (t, r, n, i) {
      ((this._progressiveEls = []), (i = Pg(i)));
      function a(u) {
        u.isGroup || ((u.incremental = n), (u.ensureState("emphasis").hoverLayer = wc));
      }
      for (var o = t.start; o < t.end; o++) {
        var s = r.getItemLayout(o);
        if (Yo(r, s, o, i)) {
          var l = new this._SymbolCtor(r, o, this._seriesScope);
          (l.traverse(a), l.setPosition(s), this.group.add(l), r.setItemGraphicEl(o, l), this._progressiveEls.push(l));
        }
      }
    }),
    (e.prototype.eachRendered = function (t) {
      Tl(this._progressiveEls || this.group, t);
    }),
    (e.prototype.remove = function (t) {
      var r = this.group,
        n = this._data;
      n && t
        ? n.eachItemGraphicEl(function (i) {
            i.fadeOut(function () {
              r.remove(i);
            }, n.hostModel);
          })
        : r.removeAll();
    }),
    e
  );
})();
function SS(e, t, r) {
  var n = e.getBaseAxis(),
    i = e.getOtherAxis(n),
    a = OP(i, r),
    o = n.dim,
    s = i.dim,
    l = t.mapDimension(s),
    u = t.mapDimension(o),
    f = s === "x" || s === "radius" ? 1 : 0,
    h = j(e.dimensions, function (d) {
      return t.mapDimension(d);
    }),
    c = !1,
    v = t.getCalculationInfo("stackResultDimension");
  return (
    xi(t, h[0]) && ((c = !0), (h[0] = v)),
    xi(t, h[1]) && ((c = !0), (h[1] = v)),
    {
      dataDimsForPoint: h,
      valueStart: a,
      valueAxisDim: s,
      baseAxisDim: o,
      stacked: !!c,
      valueDim: l,
      baseDim: u,
      baseDataOffset: f,
      stackedOverDimension: t.getCalculationInfo("stackedOverDimension"),
    }
  );
}
function OP(e, t) {
  var r = 0,
    n = e.scale.getExtent();
  return (
    t === "start"
      ? (r = n[0])
      : t === "end"
        ? (r = n[1])
        : wt(t) && !isNaN(t)
          ? (r = t)
          : n[0] > 0
            ? (r = n[0])
            : n[1] < 0 && (r = n[1]),
    r
  );
}
function bS(e, t, r, n) {
  var i = NaN;
  (e.stacked && (i = r.get(r.getCalculationInfo("stackedOverDimension"), n)), isNaN(i) && (i = e.valueStart));
  var a = e.baseDataOffset,
    o = [];
  return ((o[a] = r.get(e.baseDim, n)), (o[1 - a] = i), t.dataToPoint(o));
}
function Me(e, t) {
  return !isFinite(e) || !isFinite(t);
}
var kP = typeof Float32Array !== Ei ? Float32Array : void 0,
  BP = typeof Float64Array !== Ei ? Float64Array : void 0;
function fr(e) {
  return cv({ ctor: kP }, e).arr;
}
function cv(e, t) {
  var r = e.arr,
    n = e.ctor;
  if ((t > sd && (t = sd), !r || (e.typed && r.length < t))) {
    var i = void 0;
    if (n)
      try {
        ((i = new n(t)), (e.typed = !0), r && i.set(r));
      } catch {}
    if (!i && ((i = []), (e.typed = !1), r)) for (var a = 0, o = r.length; a < o; a++) i[a] = r[a];
    e.arr = i;
  }
  return e;
}
function NP(e, t) {
  var r = [];
  return (
    t
      .diff(e)
      .add(function (n) {
        r.push({ cmd: "+", idx: n });
      })
      .update(function (n, i) {
        r.push({ cmd: "=", idx: i, idx1: n });
      })
      .remove(function (n) {
        r.push({ cmd: "-", idx: n });
      })
      .execute(),
    r
  );
}
function FP(e, t, r, n, i, a, o, s) {
  for (
    var l = NP(e, t),
      u = [],
      f = [],
      h = [],
      c = [],
      v = [],
      d = [],
      p = [],
      m = SS(i, t, o),
      g = e.getLayout("points") || [],
      y = t.getLayout("points") || [],
      _ = 0;
    _ < l.length;
    _++
  ) {
    var S = l[_],
      b = !0,
      w = void 0,
      T = void 0;
    switch (S.cmd) {
      case "=":
        ((w = S.idx * 2), (T = S.idx1 * 2));
        var C = g[w],
          A = g[w + 1],
          M = y[T],
          D = y[T + 1];
        ((isNaN(C) || isNaN(A)) && ((C = M), (A = D)),
          u.push(C, A),
          f.push(M, D),
          h.push(r[w], r[w + 1]),
          c.push(n[T], n[T + 1]),
          p.push(t.getRawIndex(S.idx1)));
        break;
      case "+":
        var P = S.idx,
          x = m.dataDimsForPoint,
          L = i.dataToPoint([t.get(x[0], P), t.get(x[1], P)]);
        ((T = P * 2), u.push(L[0], L[1]), f.push(y[T], y[T + 1]));
        var E = bS(m, i, t, P);
        (h.push(E[0], E[1]), c.push(n[T], n[T + 1]), p.push(t.getRawIndex(P)));
        break;
      case "-":
        b = !1;
    }
    b && (v.push(S), d.push(d.length));
  }
  d.sort(function (K, at) {
    return p[K] - p[at];
  });
  for (var R = u.length, B = fr(R), O = fr(R), k = fr(R), z = fr(R), H = [], _ = 0; _ < d.length; _++) {
    var W = d[_],
      $ = _ * 2,
      G = W * 2;
    ((B[$] = u[G]),
      (B[$ + 1] = u[G + 1]),
      (O[$] = f[G]),
      (O[$ + 1] = f[G + 1]),
      (k[$] = h[G]),
      (k[$ + 1] = h[G + 1]),
      (z[$] = c[G]),
      (z[$ + 1] = c[G + 1]),
      (H[_] = v[W]));
  }
  return { current: B, next: O, stackedOnCurrent: k, stackedOnNext: z, status: H };
}
var Cr = Math.min,
  Dr = Math.max;
function Eh(e, t, r, n, i, a, o, s, l) {
  for (var u, f, h, c, v, d, p = r, m = 0; m < n; m++) {
    var g = t[p * 2],
      y = t[p * 2 + 1];
    if (p >= i || p < 0) break;
    if (Me(g, y)) {
      if (l) {
        p += a;
        continue;
      }
      break;
    }
    if (p === r) (e[a > 0 ? "moveTo" : "lineTo"](g, y), (h = g), (c = y));
    else {
      var _ = g - u,
        S = y - f;
      if (_ * _ + S * S < 0.5) {
        p += a;
        continue;
      }
      if (o > 0) {
        for (var b = p + a, w = t[b * 2], T = t[b * 2 + 1]; w === g && T === y && m < n; )
          (m++,
            (b += a),
            (p += a),
            (w = t[b * 2]),
            (T = t[b * 2 + 1]),
            (g = t[p * 2]),
            (y = t[p * 2 + 1]),
            (_ = g - u),
            (S = y - f));
        var C = m + 1;
        if (l) for (; Me(w, T) && C < n; ) (C++, (b += a), (w = t[b * 2]), (T = t[b * 2 + 1]));
        var A = 0.5,
          M = 0,
          D = 0,
          P = void 0,
          x = void 0;
        if (C >= n || Me(w, T)) ((v = g), (d = y));
        else {
          ((M = w - u), (D = T - f));
          var L = g - u,
            E = w - g,
            R = y - f,
            B = T - y,
            O = void 0,
            k = void 0;
          if (s === "x") {
            ((O = Math.abs(L)), (k = Math.abs(E)));
            var z = M > 0 ? 1 : -1;
            ((v = g - z * O * o), (d = y), (P = g + z * k * o), (x = y));
          } else if (s === "y") {
            ((O = Math.abs(R)), (k = Math.abs(B)));
            var H = D > 0 ? 1 : -1;
            ((v = g), (d = y - H * O * o), (P = g), (x = y + H * k * o));
          } else
            ((O = Math.sqrt(L * L + R * R)),
              (k = Math.sqrt(E * E + B * B)),
              (A = k / (k + O)),
              (v = g - M * o * (1 - A)),
              (d = y - D * o * (1 - A)),
              (P = g + M * o * A),
              (x = y + D * o * A),
              (P = Cr(P, Dr(w, g))),
              (x = Cr(x, Dr(T, y))),
              (P = Dr(P, Cr(w, g))),
              (x = Dr(x, Cr(T, y))),
              (M = P - g),
              (D = x - y),
              (v = g - (M * O) / k),
              (d = y - (D * O) / k),
              (v = Cr(v, Dr(u, g))),
              (d = Cr(d, Dr(f, y))),
              (v = Dr(v, Cr(u, g))),
              (d = Dr(d, Cr(f, y))),
              (M = g - v),
              (D = y - d),
              (P = g + (M * k) / O),
              (x = y + (D * k) / O));
        }
        (e.bezierCurveTo(h, c, v, d, g, y), (h = P), (c = x));
      } else e.lineTo(g, y);
    }
    ((u = g), (f = y), (p += a));
  }
  return m;
}
var wS = (function () {
    function e() {
      ((this.smooth = 0), (this.smoothConstraint = !0));
    }
    return e;
  })(),
  zP = (function (e) {
    V(t, e);
    function t(r) {
      var n = e.call(this, r) || this;
      return ((n.type = "ec-polyline"), n);
    }
    return (
      (t.prototype.getDefaultStyle = function () {
        return { stroke: X.color.neutral99, fill: null };
      }),
      (t.prototype.getDefaultShape = function () {
        return new wS();
      }),
      (t.prototype.buildPath = function (r, n) {
        var i = n.points,
          a = 0,
          o = i.length / 2;
        if (n.connectNulls) {
          for (; o > 0 && Me(i[o * 2 - 2], i[o * 2 - 1]); o--);
          for (; a < o && Me(i[a * 2], i[a * 2 + 1]); a++);
        }
        for (; a < o; ) a += Eh(r, i, a, o, o, 1, n.smooth, n.smoothMonotone, n.connectNulls) + 1;
      }),
      (t.prototype.getPointOn = function (r, n) {
        this.path || (this.createPathProxy(), this.buildPath(this.path, this.shape));
        for (var i = this.path, a = i.data, o = Rn.CMD, s, l, u = n === "x", f = [], h = 0; h < a.length; ) {
          var c = a[h++],
            v = void 0,
            d = void 0,
            p = void 0,
            m = void 0,
            g = void 0,
            y = void 0,
            _ = void 0;
          switch (c) {
            case o.M:
              ((s = a[h++]), (l = a[h++]));
              break;
            case o.L:
              if (((v = a[h++]), (d = a[h++]), (_ = u ? (r - s) / (v - s) : (r - l) / (d - l)), _ <= 1 && _ >= 0)) {
                var S = u ? (d - l) * _ + l : (v - s) * _ + s;
                return u ? [r, S] : [S, r];
              }
              ((s = v), (l = d));
              break;
            case o.C:
              ((v = a[h++]), (d = a[h++]), (p = a[h++]), (m = a[h++]), (g = a[h++]), (y = a[h++]));
              var b = u ? Ds(s, v, p, g, r, f) : Ds(l, d, m, y, r, f);
              if (b > 0)
                for (var w = 0; w < b; w++) {
                  var T = f[w];
                  if (T <= 1 && T >= 0) {
                    var S = u ? Nt(l, d, m, y, T) : Nt(s, v, p, g, T);
                    return u ? [r, S] : [S, r];
                  }
                }
              ((s = g), (l = y));
              break;
          }
        }
      }),
      t
    );
  })(gt),
  HP = (function (e) {
    V(t, e);
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    return t;
  })(wS),
  VP = (function (e) {
    V(t, e);
    function t(r) {
      var n = e.call(this, r) || this;
      return ((n.type = "ec-polygon"), n);
    }
    return (
      (t.prototype.getDefaultShape = function () {
        return new HP();
      }),
      (t.prototype.buildPath = function (r, n) {
        var i = n.points,
          a = n.stackedOnPoints,
          o = 0,
          s = i.length / 2,
          l = n.smoothMonotone;
        if (n.connectNulls) {
          for (; s > 0 && Me(i[s * 2 - 2], i[s * 2 - 1]); s--);
          for (; o < s && Me(i[o * 2], i[o * 2 + 1]); o++);
        }
        for (; o < s; ) {
          var u = Eh(r, i, o, s, s, 1, n.smooth, l, n.connectNulls);
          (Eh(r, a, o + u - 1, u, s, -1, n.stackedOnSmooth, l, n.connectNulls), (o += u + 1), r.closePath());
        }
      }),
      t
    );
  })(gt);
function TS(e, t, r, n, i) {
  var a = e.getArea(),
    o = a.x,
    s = a.y,
    l = a.width,
    u = a.height,
    f = r.get(["lineStyle", "width"]) || 0;
  ((o -= f / 2),
    (s -= f / 2),
    (l += f),
    (u += f),
    (l = Math.ceil(l)),
    o !== Math.floor(o) && ((o = Math.floor(o)), l++));
  var h = new Mt({ shape: { x: o, y: s, width: l, height: u } });
  if (t) {
    var c = e.getBaseAxis(),
      v = c.isHorizontal(),
      d = c.inverse;
    v ? (d && (h.shape.x += l), (h.shape.width = 0)) : (d || (h.shape.y += u), (h.shape.height = 0));
    var p = et(i)
      ? function (m) {
          i(m, h);
        }
      : null;
    gr(h, { shape: { width: l, height: u, x: o, y: s } }, r, null, n, p);
  }
  return h;
}
function xS(e, t, r) {
  var n = e.getArea(),
    i = ft(n.r0, 1),
    a = ft(n.r, 1),
    o = new Ri({
      shape: {
        cx: ft(e.cx, 1),
        cy: ft(e.cy, 1),
        r0: i,
        r: a,
        startAngle: n.startAngle,
        endAngle: n.endAngle,
        clockwise: n.clockwise,
      },
    });
  if (t) {
    var s = e.getBaseAxis().dim === "angle";
    (s ? (o.shape.endAngle = n.startAngle) : (o.shape.r = i), gr(o, { shape: { endAngle: n.endAngle, r: a } }, r));
  }
  return o;
}
function GP(e, t, r, n, i) {
  if (e) {
    if (e.type === "polar") return xS(e, t, r);
    if (e.type === "cartesian2d") return TS(e, t, r, n, i);
  } else return null;
  return null;
}
function CS(e, t) {
  return e.type === t;
}
function Og(e, t) {
  if (e.length === t.length) {
    for (var r = 0; r < e.length; r++) if (e[r] !== t[r]) return;
    return !0;
  }
}
function kg(e) {
  for (var t = be(), r = be(), n = 0; n < e.length; ) {
    var i = e[n++],
      a = e[n++];
    Me(i, a) || (Xf(t, i), Xf(r, a));
  }
  return [t, r];
}
function Bg(e, t) {
  var r = kg(e),
    n = r[0],
    i = r[1],
    a = kg(t),
    o = a[0],
    s = a[1];
  return Math.max(Math.abs(n[0] - o[0]), Math.abs(i[0] - s[0]), Math.abs(n[1] - o[1]), Math.abs(i[1] - s[1]));
}
function Ng(e) {
  return wt(e) ? e : e ? 0.5 : 0;
}
function UP(e, t, r) {
  if (r.valueDim == null) return [];
  for (var n = t.count(), i = fr(n * 2), a = 0; a < n; a++) {
    var o = bS(r, e, t, a);
    ((i[a * 2] = o[0]), (i[a * 2 + 1] = o[1]));
  }
  return i;
}
function Ar(e, t, r, n, i) {
  var a = r.getBaseAxis(),
    o = a.dim === "x" || a.dim === "radius" ? 0 : 1,
    s = [],
    l = 0,
    u = [],
    f = [],
    h = [],
    c = [];
  if (i) {
    for (l = 0; l < e.length; l += 2) {
      var v = t || e;
      Me(v[l], v[l + 1]) || c.push(e[l], e[l + 1]);
    }
    e = c;
  }
  for (l = 0; l < e.length - 2; l += 2)
    switch (((h[0] = e[l + 2]), (h[1] = e[l + 3]), (f[0] = e[l]), (f[1] = e[l + 1]), s.push(f[0], f[1]), n)) {
      case "end":
        ((u[o] = h[o]), (u[1 - o] = f[1 - o]), s.push(u[0], u[1]));
        break;
      case "middle":
        var d = (f[o] + h[o]) / 2,
          p = [];
        ((u[o] = p[o] = d), (u[1 - o] = f[1 - o]), (p[1 - o] = h[1 - o]), s.push(u[0], u[1]), s.push(p[0], p[1]));
        break;
      default:
        ((u[o] = f[o]), (u[1 - o] = h[1 - o]), s.push(u[0], u[1]));
    }
  return (s.push(e[l++], e[l++]), s);
}
function WP(e, t) {
  var r = [],
    n = e.length,
    i,
    a;
  function o(f, h, c) {
    var v = f.coord,
      d = (c - v) / (h.coord - v),
      p = nw(d, [f.color, h.color]);
    return { coord: c, color: p };
  }
  for (var s = 0; s < n; s++) {
    var l = e[s],
      u = l.coord;
    if (u < 0) i = l;
    else if (u > t) {
      a ? r.push(o(a, l, t)) : i && r.push(o(i, l, 0), o(i, l, t));
      break;
    } else (i && (r.push(o(i, l, 0)), (i = null)), r.push(l), (a = l));
  }
  return r;
}
function YP(e, t, r) {
  var n = e.getVisual("visualMeta");
  if (!(!n || !n.length || !e.count()) && t.type === "cartesian2d") {
    for (var i, a, o = n.length - 1; o >= 0; o--) {
      var s = e.getDimensionInfo(n[o].dimension);
      if (((i = s && s.coordDim), i === "x" || i === "y")) {
        a = n[o];
        break;
      }
    }
    if (a) {
      var l = t.getAxis(i),
        u = j(a.stops, function (_) {
          return { coord: l.toGlobalCoord(l.dataToCoord(_.value)), color: _.color };
        }),
        f = u.length,
        h = a.outerColors.slice();
      f && u[0].coord > u[f - 1].coord && (u.reverse(), h.reverse());
      var c = WP(u, i === "x" ? r.getWidth() : r.getHeight()),
        v = c.length;
      if (!v && f) return u[0].coord < 0 ? (h[1] ? h[1] : u[f - 1].color) : h[0] ? h[0] : u[0].color;
      var d = 10,
        p = c[0].coord - d,
        m = c[v - 1].coord + d,
        g = m - p;
      if (g < 0.001) return "transparent";
      (I(c, function (_) {
        _.offset = (_.coord - p) / g;
      }),
        c.push({ offset: v ? c[v - 1].offset : 0.5, color: h[1] || "transparent" }),
        c.unshift({ offset: v ? c[0].offset : 0.5, color: h[0] || "transparent" }));
      var y = new Qy(0, 0, 0, 0, c, !0);
      return ((y[i] = p), (y[i + "2"] = m), y);
    }
  }
}
function XP(e, t, r) {
  var n = e.get("showAllSymbol"),
    i = n === "auto";
  if (!(n && !i)) {
    var a = r.getAxesByScale("ordinal")[0];
    if (a && !(i && $P(a, t))) {
      var o = t.mapDimension(a.dim),
        s = {};
      return (
        I(a.getViewLabels(), function (l) {
          l.tick.offInterval || (s[Ja(a.scale, l.tick)] = 1);
        }),
        function (l) {
          return !s.hasOwnProperty(t.get(o, l));
        }
      );
    }
  }
}
function $P(e, t) {
  var r = e.getExtent(),
    n = Math.abs(r[1] - r[0]) / e.scale.count();
  isNaN(n) && (n = 0);
  for (var i = t.count(), a = Math.max(1, Math.round(i / 5)), o = 0; o < i; o += a)
    if (hv.getSymbolSize(t, o)[e.isHorizontal() ? 1 : 0] * 1.5 > n) return !1;
  return !0;
}
function ZP(e) {
  for (var t = e.length / 2; t > 0 && Me(e[t * 2 - 2], e[t * 2 - 1]); t--);
  return t - 1;
}
function Fg(e, t) {
  return [e[t * 2], e[t * 2 + 1]];
}
function qP(e, t, r) {
  for (var n = e.length / 2, i = r === "x" ? 0 : 1, a, o, s = 0, l = -1, u = 0; u < n; u++)
    if (((o = e[u * 2 + i]), !Me(o, e[u * 2 + 1 - i]))) {
      if (u === 0) {
        a = o;
        continue;
      }
      if ((a <= t && o >= t) || (a >= t && o <= t)) {
        l = u;
        break;
      }
      ((s = u), (a = o));
    }
  return { range: [s, l], t: (t - a) / (o - a) };
}
function DS(e) {
  if (e.get(["endLabel", "show"])) return !0;
  for (var t = 0; t < tr.length; t++) if (e.get([tr[t], "endLabel", "show"])) return !0;
  return !1;
}
function of(e, t, r, n) {
  if (CS(t, "cartesian2d")) {
    var i = n.getModel("endLabel"),
      a = i.get("valueAnimation"),
      o = n.getData(),
      s = { lastFrameIndex: 0 },
      l = DS(n)
        ? function (v, d) {
            e._endLabelOnDuring(v, d, o, s, a, i, t);
          }
        : null,
      u = t.getBaseAxis().isHorizontal(),
      f = TS(
        t,
        r,
        n,
        function () {
          var v = e._endLabel;
          v && r && s.originalX != null && v.attr({ x: s.originalX, y: s.originalY });
        },
        l,
      );
    if (!n.get("clip", !0)) {
      var h = f.shape,
        c = Math.max(h.width, h.height);
      u ? ((h.y -= c), (h.height += c * 2)) : ((h.x -= c), (h.width += c * 2));
    }
    return (l && l(1, f), f);
  } else return xS(t, r, n);
}
function KP(e, t) {
  var r = t.getBaseAxis(),
    n = r.isHorizontal(),
    i = r.inverse,
    a = n ? (i ? "right" : "left") : "center",
    o = n ? "middle" : i ? "top" : "bottom";
  return { normal: { align: e.get("align") || a, verticalAlign: e.get("verticalAlign") || o } };
}
var QP = (function (e) {
  V(t, e);
  function t() {
    return (e !== null && e.apply(this, arguments)) || this;
  }
  return (
    (t.prototype.init = function () {
      var r = new Bt(),
        n = new RP();
      (this.group.add(n.group),
        (this._symbolDraw = n),
        (this._lineGroup = r),
        (this._changePolyState = Tt(this._changePolyState, this)));
    }),
    (t.prototype.render = function (r, n, i) {
      var a = r.coordinateSystem,
        o = this.group,
        s = r.getData(),
        l = r.getModel("lineStyle"),
        u = r.getModel("areaStyle"),
        f = s.getLayout("points") || [],
        h = a.type === "polar",
        c = this._coordSys,
        v = this._symbolDraw,
        d = this._polyline,
        p = this._polygon,
        m = this._lineGroup,
        g = !n.ssr && r.get("animation"),
        y = !u.isEmpty(),
        _ = u.get("origin"),
        S = SS(a, s, _),
        b = y && UP(a, s, S),
        w = r.get("showSymbol"),
        T = r.get("connectNulls"),
        C = w && !h && XP(r, s, a),
        A = this._data;
      (A &&
        A.eachItemGraphicEl(function (yt, Dt) {
          yt.__temp && (o.remove(yt), A.setItemGraphicEl(Dt, null));
        }),
        w || v.remove(),
        o.add(m));
      var M = h ? !1 : r.get("step"),
        D;
      (a &&
        a.getArea &&
        r.get("clip", !0) &&
        ((D = a.getArea()),
        D.width != null
          ? ((D.x -= 0.1), (D.y -= 0.1), (D.width += 0.2), (D.height += 0.2))
          : D.r0 && ((D.r0 -= 0.5), (D.r += 0.5))),
        (this._clipShapeForSymbol = D));
      var P = YP(s, a, i) || s.getVisual("style")[s.getVisual("drawType")];
      if (!(d && c.type === a.type && M === this._step))
        (w &&
          v.updateData(s, {
            isIgnore: C,
            clipShape: D,
            disableAnimation: !0,
            getSymbolPoint: function (yt) {
              return [f[yt * 2], f[yt * 2 + 1]];
            },
          }),
          g && this._initSymbolLabelAnimation(s, a, D),
          M && (b && (b = Ar(b, f, a, M, T)), (f = Ar(f, null, a, M, T))),
          (d = this._newPolyline(f)),
          y ? (p = this._newPolygon(f, b)) : p && (m.remove(p), (p = this._polygon = null)),
          h || this._initOrUpdateEndLabel(r, a, On(P)),
          m.setClipPath(of(this, a, !0, r)));
      else {
        (y && !p ? (p = this._newPolygon(f, b)) : p && !y && (m.remove(p), (p = this._polygon = null)),
          h || this._initOrUpdateEndLabel(r, a, On(P)));
        var x = m.getClipPath();
        if (x) {
          var L = of(this, a, !1, r);
          gr(x, { shape: L.shape }, r);
        } else m.setClipPath(of(this, a, !0, r));
        (w &&
          v.updateData(s, {
            isIgnore: C,
            clipShape: D,
            disableAnimation: !0,
            getSymbolPoint: function (yt) {
              return [f[yt * 2], f[yt * 2 + 1]];
            },
          }),
          (!Og(this._stackedOnPoints, b) || !Og(this._points, f)) &&
            (g
              ? this._doUpdateAnimation(s, b, a, i, M, _, T)
              : (M && (b && (b = Ar(b, f, a, M, T)), (f = Ar(f, null, a, M, T))),
                d.setShape({ points: f }),
                p && p.setShape({ points: f, stackedOnPoints: b }))));
      }
      var E = r.getModel("emphasis"),
        R = E.get("focus"),
        B = E.get("blurScope"),
        O = E.get("disabled");
      if (
        (d.useStyle(mt(l.getLineStyle(), { fill: "none", stroke: P, lineJoin: "bevel" })),
        eh(d, r, "lineStyle"),
        d.style.lineWidth > 0 && r.get(["emphasis", "lineStyle", "width"]) === "bolder")
      ) {
        var k = d.getState("emphasis").style;
        k.lineWidth = +d.style.lineWidth + 1;
      }
      ((ut(d).seriesIndex = r.seriesIndex), Hs(d, R, B, O));
      var z = Ng(r.get("smooth")),
        H = r.get("smoothMonotone");
      if ((d.setShape({ smooth: z, smoothMonotone: H, connectNulls: T }), p)) {
        var W = s.getCalculationInfo("stackedOnSeries"),
          $ = 0;
        (p.useStyle(
          mt(u.getAreaStyle(), { fill: P, opacity: 0.7, lineJoin: "bevel", decal: s.getVisual("style").decal }),
        ),
          W && ($ = Ng(W.get("smooth"))),
          p.setShape({ smooth: z, stackedOnSmooth: $, smoothMonotone: H, connectNulls: T }),
          eh(p, r, "areaStyle"),
          (ut(p).seriesIndex = r.seriesIndex),
          Hs(p, R, B, O));
      }
      var G = this._changePolyState;
      (s.eachItemGraphicEl(function (yt) {
        yt && (yt.onHoverStateChange = G);
      }),
        (this._polyline.onHoverStateChange = G),
        (this._data = s),
        (this._coordSys = a),
        (this._stackedOnPoints = b),
        (this._points = f),
        (this._step = M),
        (this._valueOrigin = _));
      var K = r.get("triggerEvent"),
        at = r.get("triggerLineEvent"),
        Et = at === !0 || K === !0 || K === "line",
        Jt = at === !0 || K === !0 || K === "area";
      (this.packEventData(r, d, Et), p && this.packEventData(r, p, Jt));
    }),
    (t.prototype.packEventData = function (r, n, i) {
      ut(n).eventData = i
        ? {
            componentType: "series",
            componentSubType: "line",
            componentIndex: r.componentIndex,
            seriesIndex: r.seriesIndex,
            seriesName: r.name,
            seriesType: "line",
            selfType: n === this._polygon ? "area" : "line",
          }
        : null;
    }),
    (t.prototype.highlight = function (r, n, i, a) {
      var o = r.getData(),
        s = En(o, a);
      if ((this._changePolyState("emphasis"), !(s instanceof Array) && s != null && s >= 0)) {
        var l = o.getLayout("points"),
          u = o.getItemGraphicEl(s);
        if (!u) {
          var f = l[s * 2],
            h = l[s * 2 + 1];
          if (Me(f, h) || (this._clipShapeForSymbol && !this._clipShapeForSymbol.contain(f, h))) return;
          var c = r.get("zlevel") || 0,
            v = r.get("z") || 0;
          ((u = new hv(o, s)), (u.x = f), (u.y = h), u.setZ(c, v));
          var d = u.getSymbolPath().getTextContent();
          (d && ((d.zlevel = c), (d.z = v), (d.z2 = this._polyline.z2 + 1)),
            (u.__temp = !0),
            o.setItemGraphicEl(s, u),
            u.stopSymbolAnimation(!0),
            this.group.add(u));
        }
        u.highlight();
      } else Re.prototype.highlight.call(this, r, n, i, a);
    }),
    (t.prototype.downplay = function (r, n, i, a) {
      var o = r.getData(),
        s = En(o, a);
      if ((this._changePolyState("normal"), s != null && s >= 0)) {
        var l = o.getItemGraphicEl(s);
        l && (l.__temp ? (o.setItemGraphicEl(s, null), this.group.remove(l)) : l.downplay());
      } else Re.prototype.downplay.call(this, r, n, i, a);
    }),
    (t.prototype._changePolyState = function (r) {
      var n = this._polygon;
      (kd(this._polyline, r), n && kd(n, r));
    }),
    (t.prototype._newPolyline = function (r) {
      var n = this._polyline;
      return (
        n && this._lineGroup.remove(n),
        (n = new zP({ shape: { points: r }, segmentIgnoreThreshold: 2, z2: 10 })),
        this._lineGroup.add(n),
        (this._polyline = n),
        n
      );
    }),
    (t.prototype._newPolygon = function (r, n) {
      var i = this._polygon;
      return (
        i && this._lineGroup.remove(i),
        (i = new VP({ shape: { points: r, stackedOnPoints: n }, segmentIgnoreThreshold: 2 })),
        this._lineGroup.add(i),
        (this._polygon = i),
        i
      );
    }),
    (t.prototype._initSymbolLabelAnimation = function (r, n, i) {
      var a,
        o,
        s = n.getBaseAxis(),
        l = s.inverse;
      n.type === "cartesian2d"
        ? ((a = s.isHorizontal()), (o = !1))
        : n.type === "polar" && ((a = s.dim === "angle"), (o = !0));
      var u = r.hostModel,
        f = u.get("animationDuration");
      et(f) && (f = f(null));
      var h = u.get("animationDelay") || 0,
        c = et(h) ? h(null) : h;
      r.eachItemGraphicEl(function (v, d) {
        var p = v;
        if (p) {
          var m = [v.x, v.y],
            g = void 0,
            y = void 0,
            _ = void 0;
          if (i)
            if (o) {
              var S = i,
                b = n.pointToCoord(m);
              a
                ? ((g = S.startAngle), (y = S.endAngle), (_ = (-b[1] / 180) * Math.PI))
                : ((g = S.r0), (y = S.r), (_ = b[0]));
            } else {
              var w = i;
              a ? ((g = w.x), (y = w.x + w.width), (_ = v.x)) : ((g = w.y + w.height), (y = w.y), (_ = v.y));
            }
          var T = y === g ? 0 : (_ - g) / (y - g);
          l && (T = 1 - T);
          var C = et(h) ? h(d) : f * T + c,
            A = p.getSymbolPath(),
            M = A.getTextContent();
          (p.attr({ scaleX: 0, scaleY: 0 }),
            p.animateTo({ scaleX: 1, scaleY: 1 }, { duration: 200, setToFinal: !0, delay: C }),
            M && M.animateFrom({ style: { opacity: 0 } }, { duration: 300, delay: C }),
            (A.disableLabelAnimation = !0));
        }
      });
    }),
    (t.prototype._initOrUpdateEndLabel = function (r, n, i) {
      var a = r.getModel("endLabel");
      if (DS(r)) {
        var o = r.getData(),
          s = this._polyline,
          l = o.getLayout("points");
        if (!l) {
          (s.removeTextContent(), (this._endLabel = null));
          return;
        }
        var u = this._endLabel;
        u ||
          ((u = this._endLabel = new Wt({ z2: 200 })),
          (u.ignoreClip = !0),
          s.setTextContent(this._endLabel),
          (s.disableLabelAnimation = !0));
        var f = ZP(l);
        f >= 0 &&
          (Cl(
            s,
            Dl(r, "endLabel"),
            {
              inheritColor: i,
              labelFetcher: r,
              labelDataIndex: f,
              defaultText: function (h, c, v) {
                return v != null ? _S(o, v) : fv(o, h);
              },
              enableTextSetter: !0,
            },
            KP(a, n),
          ),
          (s.textConfig.position = null));
      } else this._endLabel && (this._polyline.removeTextContent(), (this._endLabel = null));
    }),
    (t.prototype._endLabelOnDuring = function (r, n, i, a, o, s, l) {
      var u = this._endLabel,
        f = this._polyline;
      if (u) {
        r < 1 && a.originalX == null && ((a.originalX = u.x), (a.originalY = u.y));
        var h = i.getLayout("points"),
          c = i.hostModel,
          v = c.get("connectNulls"),
          d = s.get("precision"),
          p = s.get("distance") || 0,
          m = l.getBaseAxis(),
          g = m.isHorizontal(),
          y = m.inverse,
          _ = n.shape,
          S = y ? (g ? _.x : _.y + _.height) : g ? _.x + _.width : _.y,
          b = (g ? p : 0) * (y ? -1 : 1),
          w = (g ? 0 : -p) * (y ? -1 : 1),
          T = g ? "x" : "y",
          C = qP(h, S, T),
          A = C.range,
          M = A[1] - A[0],
          D = void 0;
        if (M >= 1) {
          if (M > 1 && !v) {
            var P = Fg(h, A[0]);
            (u.attr({ x: P[0] + b, y: P[1] + w }), o && (D = c.getRawValue(A[0])));
          } else {
            var P = f.getPointOn(S, T);
            P && u.attr({ x: P[0] + b, y: P[1] + w });
            var x = c.getRawValue(A[0]),
              L = c.getRawValue(A[1]);
            o && (D = oT(i, d, x, L, C.t));
          }
          a.lastFrameIndex = A[0];
        } else {
          var E = r === 1 || a.lastFrameIndex > 0 ? A[0] : 0,
            P = Fg(h, E);
          (o && (D = c.getRawValue(E)), u.attr({ x: P[0] + b, y: P[1] + w }));
        }
        if (o) {
          var R = Al(u);
          typeof R.setLabelText == "function" && R.setLabelText(D);
        }
      }
    }),
    (t.prototype._doUpdateAnimation = function (r, n, i, a, o, s, l) {
      var u = this._polyline,
        f = this._polygon,
        h = r.hostModel,
        c = FP(this._data, r, this._stackedOnPoints, n, this._coordSys, i, this._valueOrigin),
        v = c.current,
        d = c.stackedOnCurrent,
        p = c.next,
        m = c.stackedOnNext;
      if (
        (o &&
          ((d = Ar(c.stackedOnCurrent, c.current, i, o, l)),
          (v = Ar(c.current, null, i, o, l)),
          (m = Ar(c.stackedOnNext, c.next, i, o, l)),
          (p = Ar(c.next, null, i, o, l))),
        Bg(v, p) > 3e3 || (f && Bg(d, m) > 3e3))
      ) {
        (u.stopAnimation(),
          u.setShape({ points: p }),
          f && (f.stopAnimation(), f.setShape({ points: p, stackedOnPoints: m })));
        return;
      }
      ((u.shape.__points = c.current), (u.shape.points = v));
      var g = { shape: { points: p } };
      (c.current !== v && (g.shape.__points = c.next),
        u.stopAnimation(),
        he(u, g, h),
        f &&
          (f.setShape({ points: v, stackedOnPoints: d }),
          f.stopAnimation(),
          he(f, { shape: { stackedOnPoints: m } }, h),
          u.shape.points !== f.shape.points && (f.shape.points = u.shape.points)));
      for (var y = [], _ = c.status, S = 0; S < _.length; S++) {
        var b = _[S].cmd;
        if (b === "=") {
          var w = r.getItemGraphicEl(_[S].idx1);
          w && y.push({ el: w, ptIdx: S });
        }
      }
      u.animators &&
        u.animators.length &&
        u.animators[0].during(function () {
          f && f.dirtyShape();
          for (var T = u.shape.__points, C = 0; C < y.length; C++) {
            var A = y[C].el,
              M = y[C].ptIdx * 2;
            ((A.x = T[M]), (A.y = T[M + 1]), A.markRedraw());
          }
        });
    }),
    (t.prototype.remove = function (r) {
      var n = this.group,
        i = this._data;
      (this._lineGroup.removeAll(),
        this._symbolDraw.remove(!0),
        i &&
          i.eachItemGraphicEl(function (a, o) {
            a.__temp && (n.remove(a), i.setItemGraphicEl(o, null));
          }),
        (this._polyline =
          this._polygon =
          this._coordSys =
          this._points =
          this._stackedOnPoints =
          this._endLabel =
          this._data =
            null));
    }),
    (t.type = "line"),
    t
  );
})(Re);
function jP(e, t) {
  return {
    seriesType: e,
    plan: $c(),
    reset: function (r) {
      var n = r.getData(),
        i = r.coordinateSystem;
      if ((r.pipelineContext, !!i)) {
        var a = j(i.dimensions, function (h) {
            return n.mapDimension(h);
          }).slice(0, 2),
          o = a.length,
          s = n.getCalculationInfo("stackResultDimension");
        (xi(n, a[0]) && (a[0] = s), xi(n, a[1]) && (a[1] = s));
        var l = n.getStore(),
          u = n.getDimensionIndex(a[0]),
          f = n.getDimensionIndex(a[1]);
        return (
          o && {
            progress: function (h, c) {
              for (var v = h.end - h.start, d = fr(v * o), p = [], m = [], g = h.start, y = 0; g < h.end; g++) {
                var _ = void 0;
                if (o === 1) {
                  var S = l.get(u, g);
                  _ = i.dataToPoint(S, null, m);
                } else ((p[0] = l.get(u, g)), (p[1] = l.get(f, g)), (_ = i.dataToPoint(p, null, m)));
                ((d[y++] = _[0]), (d[y++] = _[1]));
              }
              (c.setLayout("points", d), c.setLayout("pointsRange", { start: h.start, end: h.end }));
            },
          }
        );
      }
    },
  };
}
var JP = {
    average: function (e) {
      for (var t = 0, r = 0, n = 0; n < e.length; n++) isNaN(e[n]) || ((t += e[n]), r++);
      return r === 0 ? NaN : t / r;
    },
    sum: function (e) {
      for (var t = 0, r = 0; r < e.length; r++) t += e[r] || 0;
      return t;
    },
    max: function (e) {
      for (var t = -1 / 0, r = 0; r < e.length; r++) e[r] > t && (t = e[r]);
      return isFinite(t) ? t : NaN;
    },
    min: function (e) {
      for (var t = 1 / 0, r = 0; r < e.length; r++) e[r] < t && (t = e[r]);
      return isFinite(t) ? t : NaN;
    },
    nearest: function (e) {
      return e[0];
    },
  },
  t2 = function (e) {
    return Math.round(e.length / 2);
  };
function AS(e) {
  return {
    seriesType: e,
    reset: function (t, r, n) {
      var i = t.getData(),
        a = t.get("sampling"),
        o = t.coordinateSystem,
        s = i.count();
      if (s > 10 && o.type === "cartesian2d" && a) {
        var l = o.getBaseAxis(),
          u = o.getOtherAxis(l),
          f = l.getExtent(),
          h = n.getDevicePixelRatio(),
          c = Math.abs(f[1] - f[0]) * (h || 1),
          v = Math.round(s / c);
        if (isFinite(v) && v > 1) {
          a === "lttb"
            ? t.setData(i.lttbDownSample(i.mapDimension(u.dim), 1 / v))
            : a === "minmax" && t.setData(i.minmaxDownSample(i.mapDimension(u.dim), 1 / v));
          var d = void 0;
          (Y(a) ? (d = JP[a]) : et(a) && (d = a), d && t.setData(i.downSample(i.mapDimension(u.dim), 1 / v, d, t2)));
        }
      }
    },
  };
}
function e2(e) {
  (e.registerChartView(QP),
    e.registerSeriesModel(PP),
    e.registerLayout(jP("line")),
    e.registerVisual({
      seriesType: "line",
      reset: function (t) {
        var r = t.getData(),
          n = t.getModel("lineStyle").getLineStyle();
        (n && !n.stroke && (n.stroke = r.getVisual("style").fill), r.setVisual("legendLineStyle", n));
      },
    }),
    e.registerProcessor(e.PRIORITY.PROCESSOR.STATISTIC, AS("line")));
}
var r2 = (function (e) {
    V(t, e);
    function t(r, n, i, a, o) {
      var s = e.call(this, r, n, i) || this;
      return ((s.index = 0), (s.type = a || "value"), (s.position = o || "bottom"), s);
    }
    return (
      (t.prototype.isHorizontal = function () {
        var r = this.position;
        return r === "top" || r === "bottom";
      }),
      (t.prototype.getGlobalExtent = function (r) {
        var n = this.getExtent();
        return (
          (n[0] = this.toGlobalCoord(n[0])),
          (n[1] = this.toGlobalCoord(n[1])),
          r && n[0] > n[1] && n.reverse(),
          n
        );
      }),
      (t.prototype.pointToData = function (r, n) {
        return this.coordToData(this.toLocalCoord(r[this.dim === "x" ? 0 : 1]), n);
      }),
      (t.prototype.setCategorySortInfo = function (r) {
        if (this.type !== "category") return !1;
        ((this.model.option.categorySortInfo = r), this.scale.setSortInfo(r));
      }),
      t
    );
  })(nP),
  n2 = null;
function i2() {
  return n2;
}
var a2 = "expandAxisBreak",
  Er = Math.PI,
  o2 = [
    [1, 2, 1, 2],
    [5, 3, 5, 3],
    [8, 3, 8, 3],
  ],
  s2 = [
    [0, 1, 0, 1],
    [0, 3, 0, 3],
    [0, 3, 0, 3],
  ],
  Ai = St(),
  MS = St(),
  IS = (function () {
    function e(t) {
      ((this.recordMap = {}), (this.resolveAxisNameOverlap = t));
    }
    return (
      (e.prototype.ensureRecord = function (t) {
        var r = t.axis.dim,
          n = t.componentIndex,
          i = this.recordMap,
          a = i[r] || (i[r] = []);
        return a[n] || (a[n] = { ready: {} });
      }),
      e
    );
  })();
function l2(e, t, r, n) {
  var i = r.axis,
    a = t.ensureRecord(r),
    o = [],
    s,
    l = vv(e.axisName) && Di(e.nameLocation);
  I(n, function (d) {
    var p = Gr(d);
    if (!(!p || p.label.ignore)) {
      o.push(p);
      var m = a.transGroup;
      l &&
        (m.transform ? Ya(ra, m.transform) : Wa(ra),
        p.transform && va(ra, ra, p.transform),
        J.copy(Xo, p.localRect),
        Xo.applyTransform(ra),
        s ? s.union(Xo) : J.copy((s = new J(0, 0, 0, 0)), Xo));
    }
  });
  var u = Math.abs(a.dirVec.x) > 0.1 ? "x" : "y",
    f = a.transGroup[u];
  if (
    (o.sort(function (d, p) {
      return Math.abs(d.label[u] - f) - Math.abs(p.label[u] - f);
    }),
    l && s)
  ) {
    var h = i.getExtent(),
      c = Math.min(h[0], h[1]),
      v = Math.max(h[0], h[1]) - c;
    s.union(new J(c, 0, v, 1));
  }
  ((a.stOccupiedRect = s), (a.labelInfoList = o));
}
var ra = Ze(),
  Xo = new J(0, 0, 0, 0),
  LS = function (e, t, r, n, i, a) {
    if (Di(e.nameLocation)) {
      var o = a.stOccupiedRect;
      o && PS(sP({}, o, a.transGroup.transform), n, i);
    } else ES(a.labelInfoList, a.dirVec, n, i);
  };
function PS(e, t, r) {
  var n = new _t();
  uv(e, t, n, { direction: Math.atan2(r.y, r.x), bidirectional: !1, touchThreshold: 0.05 }) && lP(t, n);
}
function ES(e, t, r, n) {
  for (var i = _t.dot(n, t) >= 0, a = 0, o = e.length; a < o; a++) {
    var s = e[i ? a : o - 1 - a];
    s.label.ignore || PS(s, r, n);
  }
}
var Br = (function () {
    function e(t, r, n, i) {
      ((this.group = new Bt()),
        (this._axisModel = t),
        (this._api = r),
        (this._local = {}),
        (this._shared = i || new IS(LS)),
        this._resetCfgDetermined(n));
    }
    return (
      (e.prototype.updateCfg = function (t) {
        var r = this._cfg.raw;
        ((r.position = t.position), (r.labelOffset = t.labelOffset), this._resetCfgDetermined(r));
      }),
      (e.prototype.__getRawCfg = function () {
        return this._cfg.raw;
      }),
      (e.prototype._resetCfgDetermined = function (t) {
        var r = this._axisModel,
          n = r.getDefaultOption ? r.getDefaultOption() : {},
          i = q(t.axisName, r.get("name")),
          a = r.get("nameMoveOverlap");
        (a == null || a === "auto") && (a = q(t.defaultNameMoveOverlap, !0));
        var o = {
          raw: t,
          position: t.position,
          rotation: t.rotation,
          nameDirection: q(t.nameDirection, 1),
          tickDirection: q(t.tickDirection, 1),
          labelDirection: q(t.labelDirection, 1),
          labelOffset: q(t.labelOffset, 0),
          silent: q(t.silent, !0),
          axisName: i,
          nameLocation: ui(r.get("nameLocation"), n.nameLocation, "end"),
          shouldNameMoveOverlap: vv(i) && a,
          optionHideOverlap: r.get(["axisLabel", "hideOverlap"]),
          showMinorTicks: r.get(["minorTick", "show"]),
        };
        this._cfg = o;
        var s = new Bt({ x: o.position[0], y: o.position[1], rotation: o.rotation });
        (s.updateTransform(), (this._transformGroup = s));
        var l = this._shared.ensureRecord(r);
        ((l.transGroup = this._transformGroup), (l.dirVec = new _t(Math.cos(-o.rotation), Math.sin(-o.rotation))));
      }),
      (e.prototype.build = function (t, r) {
        var n = this;
        return (
          t || (t = { axisLine: !0, axisTickLabelEstimate: !1, axisTickLabelDetermine: !0, axisName: !0 }),
          I(u2, function (i) {
            t[i] && f2[i](n._cfg, n._local, n._shared, n._axisModel, n.group, n._transformGroup, n._api, r || {});
          }),
          this
        );
      }),
      (e.innerTextLayout = function (t, r, n) {
        var i = ly(r - t),
          a,
          o;
        return (
          Rs(i)
            ? ((o = n > 0 ? "top" : "bottom"), (a = "center"))
            : Rs(i - Er)
              ? ((o = n > 0 ? "bottom" : "top"), (a = "center"))
              : ((o = "middle"), i > 0 && i < Er ? (a = n > 0 ? "right" : "left") : (a = n > 0 ? "left" : "right")),
          { rotation: i, textAlign: a, textVerticalAlign: o }
        );
      }),
      (e.makeAxisEventDataBase = function (t) {
        var r = { componentType: t.mainType, componentIndex: t.componentIndex };
        return ((r[t.mainType + "Index"] = t.componentIndex), r);
      }),
      (e.isLabelSilent = function (t) {
        var r = t.get("tooltip");
        return t.get("silent") || !(t.get("triggerEvent") || (r && r.show));
      }),
      e
    );
  })(),
  u2 = ["axisLine", "axisTickLabelEstimate", "axisTickLabelDetermine", "axisName"],
  f2 = {
    axisLine: function (e, t, r, n, i, a, o) {
      var s = n.get(["axisLine", "show"]);
      if ((s === "auto" && ((s = !0), e.raw.axisLineAutoShow != null && (s = !!e.raw.axisLineAutoShow)), !!s)) {
        var l = n.axis.getExtent(),
          u = a.transform,
          f = [l[0], 0],
          h = [l[1], 0],
          c = f[0] > h[0];
        u && (Ae(f, f, u), Ae(h, h, u));
        var v = N({ lineCap: "round" }, n.getModel(["axisLine", "lineStyle"]).getLineStyle()),
          d = { strokeContainThreshold: e.raw.strokeContainThreshold || 5, silent: !0, z2: 1, style: v };
        if (n.get(["axisLine", "breakLine"]) && Ws(n.axis.scale)) i2().buildAxisBreakLine(n, i, a, d);
        else {
          var p = new Fr(N({ shape: { x1: f[0], y1: f[1], x2: h[0], y2: h[1] } }, d));
          (Ra(p.shape, p.style.lineWidth), (p.anid = "line"), i.add(p));
        }
        var m = n.get(["axisLine", "symbol"]);
        if (m != null) {
          var g = n.get(["axisLine", "symbolSize"]);
          (Y(m) && (m = [m, m]), (Y(g) || wt(g)) && (g = [g, g]));
          var y = f_(n.get(["axisLine", "symbolOffset"]) || 0, g),
            _ = g[0],
            S = g[1];
          I(
            [
              { rotate: e.rotation + Math.PI / 2, offset: y[0], r: 0 },
              {
                rotate: e.rotation - Math.PI / 2,
                offset: y[1],
                r: Math.sqrt((f[0] - h[0]) * (f[0] - h[0]) + (f[1] - h[1]) * (f[1] - h[1])),
              },
            ],
            function (b, w) {
              if (m[w] !== "none" && m[w] != null) {
                var T = Ti(m[w], -_ / 2, -S / 2, _, S, v.stroke, !0),
                  C = b.r + b.offset,
                  A = c ? h : f;
                (T.attr({
                  rotation: b.rotate,
                  x: A[0] + C * Math.cos(e.rotation),
                  y: A[1] - C * Math.sin(e.rotation),
                  silent: !0,
                  z2: 11,
                }),
                  i.add(T));
              }
            },
          );
        }
      }
    },
    axisTickLabelEstimate: function (e, t, r, n, i, a, o, s) {
      var l = Hg(t, i, s);
      l && zg(e, t, r, n, i, a, o, ke.estimate);
    },
    axisTickLabelDetermine: function (e, t, r, n, i, a, o, s) {
      var l = Hg(t, i, s);
      l && zg(e, t, r, n, i, a, o, ke.determine);
      var u = d2(e, i, a, n);
      (v2(e, t.labelLayoutList, u), p2(e, i, a, n, e.tickDirection));
    },
    axisName: function (e, t, r, n, i, a, o, s) {
      var l = r.ensureRecord(n);
      t.nameEl && (i.remove(t.nameEl), (t.nameEl = l.nameLayout = l.nameLocation = null));
      var u = e.axisName;
      if (vv(u)) {
        var f = e.nameLocation,
          h = e.nameDirection,
          c = n.getModel("nameTextStyle"),
          v = n.get("nameGap") || 0,
          d = n.axis.getExtent(),
          p = n.axis.inverse ? -1 : 1,
          m = new _t(0, 0),
          g = new _t(0, 0);
        f === "start"
          ? ((m.x = d[0] - p * v), (g.x = -p))
          : f === "end"
            ? ((m.x = d[1] + p * v), (g.x = p))
            : ((m.x = (d[0] + d[1]) / 2), (m.y = e.labelOffset + h * v), (g.y = h));
        var y = Ze();
        g.transform(Jh(y, y, e.rotation));
        var _ = n.get("nameRotate");
        _ != null && (_ = (_ * Er) / 180);
        var S, b;
        Di(f)
          ? (S = Br.innerTextLayout(e.rotation, _ ?? e.rotation, h))
          : ((S = h2(e.rotation, f, _ || 0, d)),
            (b = e.raw.axisNameAvailableWidth),
            b != null && ((b = Math.abs(b / Math.sin(S.rotation))), !isFinite(b) && (b = null)));
        var w = c.getFont(),
          T = n.get("nameTruncate", !0) || {},
          C = T.ellipsis,
          A = ws(e.raw.nameTruncateMaxWidth, T.maxWidth, b),
          M = s.nameMarginLevel || 0,
          D = new Wt({
            x: m.x,
            y: m.y,
            rotation: S.rotation,
            silent: Br.isLabelSilent(n),
            style: zr(c, {
              text: u,
              font: w,
              overflow: "truncate",
              width: A,
              ellipsis: C,
              fill: c.getTextColor() || n.get(["axisLine", "lineStyle", "color"]),
              align: c.get("align") || S.textAlign,
              verticalAlign: c.get("verticalAlign") || S.textVerticalAlign,
            }),
            z2: 1,
          });
        if (
          (wl({ el: D, componentModel: n, itemName: u }), (D.__fullText = u), (D.anid = "name"), n.get("triggerEvent"))
        ) {
          var P = Br.makeAxisEventDataBase(n);
          ((P.targetType = "axisName"), (P.name = u), (ut(D).eventData = P));
        }
        (a.add(D), D.updateTransform(), (t.nameEl = D));
        var x = (l.nameLayout = Gr({
          label: D,
          priority: D.z2,
          defaultAttr: { ignore: D.ignore },
          marginDefault: Di(f) ? o2[M] : s2[M],
        }));
        if (((l.nameLocation = f), i.add(D), D.decomposeTransform(), e.shouldNameMoveOverlap && x)) {
          var L = r.ensureRecord(n);
          r.resolveAxisNameOverlap(e, r, n, x, g, L);
        }
      }
    },
  };
function zg(e, t, r, n, i, a, o, s) {
  OS(t) || g2(e, t, i, s, n, o);
  var l = t.labelLayoutList;
  (m2(e, n, l, a), e.rotation);
  var u = e.optionHideOverlap;
  (c2(n, l, u),
    u &&
      uP(
        Vt(l, function (f) {
          return f && !f.label.ignore;
        }),
      ),
    l2(e, r, n, l));
}
function h2(e, t, r, n) {
  var i = ly(r - e),
    a,
    o,
    s = n[0] > n[1],
    l = (t === "start" && !s) || (t !== "start" && s);
  return (
    Rs(i - Er / 2)
      ? ((o = l ? "bottom" : "top"), (a = "center"))
      : Rs(i - Er * 1.5)
        ? ((o = l ? "top" : "bottom"), (a = "center"))
        : ((o = "middle"), i < Er * 1.5 && i > Er / 2 ? (a = l ? "left" : "right") : (a = l ? "right" : "left")),
    { rotation: i, textAlign: a, textVerticalAlign: o }
  );
}
function c2(e, t, r) {
  var n = e.axis,
    i = e.get(["axisLabel", "customValues"]);
  if (hL(n)) return;
  function a(u, f, h) {
    var c = Gr(t[f]),
      v = Gr(t[h]),
      d = n.scale;
    if (!(!c || !v)) {
      if (u == null) {
        if (!r && i) return;
        var p = Ai(c.label).labelInfo.tick;
        if ((nv(d) && p.notNice) || (ze(d) && p.offInterval)) {
          ri(c.label);
          return;
        }
      }
      if (u === !1 || c.suggestIgnore) {
        ri(c.label);
        return;
      }
      if (v.suggestIgnore) {
        ri(v.label);
        return;
      }
      var m = 0.1;
      if (!r) {
        var g = [0, 0, 0, 0];
        ((c = Dg({ marginForce: g }, c)), (v = Dg({ marginForce: g }, v)));
      }
      uv(c, v, null, { touchThreshold: m }) && ri(u ? v.label : c.label);
    }
  }
  var o = e.get(["axisLabel", "showMinLabel"]),
    s = e.get(["axisLabel", "showMaxLabel"]),
    l = t.length;
  (a(o, 0, 1), a(s, l - 1, l - 2));
}
function v2(e, t, r) {
  e.showMinorTicks ||
    I(t, function (n) {
      if (n && n.label.ignore)
        for (var i = 0; i < r.length; i++) {
          var a = r[i],
            o = MS(a),
            s = Ai(n.label);
          if (o.tickValue != null && !o.onBand && o.tickValue === s.labelInfo.tick.value) {
            ri(a);
            return;
          }
        }
    });
}
function ri(e) {
  e && (e.ignore = !0);
}
function RS(e, t, r, n, i) {
  for (var a = [], o = [], s = [], l = 0; l < e.length; l++) {
    var u = e[l].coord;
    ((o[0] = u), (o[1] = 0), (s[0] = u), (s[1] = r), t && (Ae(o, o, t), Ae(s, s, t)));
    var f = new Fr({ shape: { x1: o[0], y1: o[1], x2: s[0], y2: s[1] }, style: n, z2: 2, autoBatch: !0, silent: !0 });
    (Ra(f.shape, f.style.lineWidth), (f.anid = i + "_" + e[l].tickValue), a.push(f));
    var h = MS(f);
    ((h.onBand = !!e[l].onBand), (h.tickValue = e[l].tickValue));
  }
  return a;
}
function d2(e, t, r, n) {
  var i = n.axis,
    a = n.getModel("axisTick"),
    o = a.get("show");
  if (
    (o === "auto" && ((o = !0), e.raw.axisTickAutoShow != null && (o = !!e.raw.axisTickAutoShow)),
    !o || i.scale.isBlank())
  )
    return [];
  for (
    var s = a.getModel("lineStyle"),
      l = e.tickDirection * a.get("length"),
      u = i.getTicksCoords(),
      f = RS(u, r.transform, l, mt(s.getLineStyle(), { stroke: n.get(["axisLine", "lineStyle", "color"]) }), "ticks"),
      h = 0;
    h < f.length;
    h++
  )
    t.add(f[h]);
  return f;
}
function p2(e, t, r, n, i) {
  var a = n.axis,
    o = n.getModel("minorTick");
  if (!(!e.showMinorTicks || a.scale.isBlank())) {
    var s = a.getMinorTicksCoords();
    if (s.length)
      for (
        var l = o.getModel("lineStyle"),
          u = i * o.get("length"),
          f = mt(
            l.getLineStyle(),
            mt(n.getModel("axisTick").getLineStyle(), { stroke: n.get(["axisLine", "lineStyle", "color"]) }),
          ),
          h = 0;
        h < s.length;
        h++
      )
        for (var c = RS(s[h], r.transform, u, f, "minorticks_" + h), v = 0; v < c.length; v++) t.add(c[v]);
  }
}
function Hg(e, t, r) {
  if (OS(e)) {
    var n = e.axisLabelsCreationContext,
      i = n.out.noPxChangeTryDetermine;
    if (r.noPxChange) {
      for (var a = !0, o = 0; o < i.length; o++) a = a && i[o]();
      if (a) return !1;
    }
    i.length && (t.remove(e.labelGroup), Rh(e, null, null, null));
  }
  return !0;
}
function g2(e, t, r, n, i, a) {
  var o = i.axis,
    s = ws(e.raw.axisLabelShow, i.get(["axisLabel", "show"])),
    l = new Bt();
  r.add(l);
  var u = el(n);
  if (!s || o.scale.isBlank()) {
    Rh(t, [], l, u);
    return;
  }
  var f = i.getModel("axisLabel"),
    h = o.getViewLabels(u),
    c = ((ws(e.raw.labelRotate, f.get("rotate")) || 0) * Er) / 180,
    v = Br.innerTextLayout(e.rotation, c, e.labelDirection),
    d = i.getCategories && i.getCategories(!0),
    p = [],
    m = i.get("triggerEvent"),
    g = 1 / 0,
    y = -1 / 0;
  I(h, function (S, b) {
    var w,
      T = S.tick,
      C = S.formattedLabel,
      A = S.rawLabel,
      M = f,
      D = Ja(o.scale, T);
    if (d && d[D]) {
      var P = d[D];
      Z(P) && P.textStyle && (M = new Ct(P.textStyle, f, i.ecModel));
    }
    var x = M.getTextColor() || i.get(["axisLine", "lineStyle", "color"]),
      L = M.getShallow("align", !0) || v.textAlign,
      E = q(M.getShallow("alignMinLabel", !0), L),
      R = q(M.getShallow("alignMaxLabel", !0), L),
      B = M.getShallow("verticalAlign", !0) || M.getShallow("baseline", !0) || v.textVerticalAlign,
      O = q(M.getShallow("verticalAlignMinLabel", !0), B),
      k = q(M.getShallow("verticalAlignMaxLabel", !0), B),
      z = 10 + (((w = T.time) === null || w === void 0 ? void 0 : w.level) || 0);
    ((g = Math.min(g, z)), (y = Math.max(y, z)));
    var H = new Wt({
      x: 0,
      y: 0,
      rotation: 0,
      silent: Br.isLabelSilent(i),
      z2: z,
      style: zr(M, {
        text: C,
        align: b === 0 ? E : b === h.length - 1 ? R : L,
        verticalAlign: b === 0 ? O : b === h.length - 1 ? k : B,
        fill: et(x) ? x(o.type === "category" ? A : o.type === "value" ? D + "" : D, b) : x,
      }),
    });
    H.anid = "label_" + D;
    var W = Ai(H);
    if (
      ((W.labelInfo = S),
      (W.layoutRotation = v.rotation),
      wl({
        el: H,
        componentModel: i,
        itemName: C,
        formatterParamsExtra: {
          isTruncated: function () {
            return H.isTruncated;
          },
          value: A,
          tickIndex: b,
        },
      }),
      m)
    ) {
      var $ = Br.makeAxisEventDataBase(i);
      (($.targetType = "axisLabel"), ($.value = A), ($.tickIndex = b));
      var G = S.tick.break;
      if (G) {
        var K = G.parsedBreak;
        $.break = { start: K.vmin, end: K.vmax };
      }
      (o.type === "category" && ($.dataIndex = D), (ut(H).eventData = $), G && _2(i, a, H, G));
    }
    (p.push(H), l.add(H));
  });
  var _ = j(p, function (S) {
    return {
      label: S,
      priority: Ai(S).labelInfo.tick.break ? S.z2 + (y - g + 1) : S.z2,
      defaultAttr: { ignore: S.ignore },
    };
  });
  Rh(t, _, l, u);
}
function OS(e) {
  return !!e.labelLayoutList;
}
function Rh(e, t, r, n) {
  ((e.labelLayoutList = t), (e.labelGroup = r), (e.axisLabelsCreationContext = n));
}
function m2(e, t, r, n) {
  var i = t.get(["axisLabel", "margin"]);
  I(r, function (a, o) {
    var s = Gr(a);
    if (s) {
      var l = s.label,
        u = Ai(l);
      ((s.suggestIgnore = l.ignore), (l.ignore = !1), Ps(lr, y2));
      var f = t.axis;
      ((lr.x = f.dataToCoord(Ja(f.scale, u.labelInfo.tick))),
        (lr.y = e.labelOffset + e.labelDirection * i),
        (lr.rotation = u.layoutRotation),
        n.add(lr),
        lr.updateTransform(),
        n.remove(lr),
        lr.decomposeTransform(),
        Ps(l, lr),
        l.markRedraw(),
        il(s, !0),
        Gr(s));
    }
  });
}
var lr = new Mt(),
  y2 = new Mt();
function vv(e) {
  return !!e;
}
function _2(e, t, r, n) {
  r.on("click", function (i) {
    var a = { type: a2, breaks: [{ start: n.parsedBreak.breakOption.start, end: n.parsedBreak.breakOption.end }] };
    ((a[e.axis.dim + "AxisIndex"] = e.componentIndex), t.dispatchAction(a));
  });
}
function al(e, t, r) {
  r = r || {};
  var n = t.axis,
    i = {},
    a = n.getAxesOnZeroOf()[0],
    o = n.position,
    s = a ? "onZero" : o,
    l = n.dim,
    u = [e.x, e.x + e.width, e.y, e.y + e.height],
    f = { left: 0, right: 1, top: 0, bottom: 1, onZero: 2 },
    h = t.get("offset") || 0,
    c = l === "x" ? [u[2] - h, u[3] + h] : [u[0] - h, u[1] + h];
  if (a) {
    var v = a.toGlobalCoord(a.dataToCoord(0));
    c[f.onZero] = Math.max(Math.min(v, c[1]), c[0]);
  }
  ((i.position = [l === "y" ? c[f[s]] : u[0], l === "x" ? c[f[s]] : u[3]]),
    (i.rotation = (Math.PI / 2) * (l === "x" ? 0 : 1)));
  var d = { top: -1, bottom: 1, left: -1, right: 1 };
  ((i.labelDirection = i.tickDirection = i.nameDirection = d[o]),
    (i.labelOffset = a ? c[f[o]] - c[f.onZero] : 0),
    t.get(["axisTick", "inside"]) && (i.tickDirection = -i.tickDirection),
    ws(r.labelInside, t.get(["axisLabel", "inside"])) && (i.labelDirection = -i.labelDirection));
  var p = t.get(["axisLabel", "rotate"]);
  return ((i.labelRotate = s === "top" ? -p : p), (i.z2 = 1), i);
}
function S2(e) {
  return e.coordinateSystem && e.coordinateSystem.type === "cartesian2d";
}
function b2(e) {
  var t = { xAxisModel: null, yAxisModel: null };
  return (
    I(t, function (r, n) {
      var i = n.replace(/Model$/, ""),
        a = e.getReferringComponents(i, xe).models[0];
      t[n] = a;
    }),
    t
  );
}
function w2(e, t, r, n, i, a) {
  for (var o = al(e, r), s = !1, l = !1, u = 0; u < t.length; u++)
    H_(t[u].getOtherAxis(r.axis).scale) && ((s = l = !0), r.axis.type === "category" && r.axis.onBand && (l = !1));
  return ((o.axisLineAutoShow = s), (o.axisTickAutoShow = l), (o.defaultNameMoveOverlap = a), new Br(r, n, o, i));
}
function T2(e, t, r) {
  var n = al(t, r);
  e.updateCfg(n);
}
function x2() {
  TL("liPosMinGap", C2);
}
function C2(e, t, r) {
  var n = Q(),
    i = r.serUids,
    a = r.liPosMinGap,
    o,
    s = t.axis,
    l = s.scale,
    u = l.needTransform(),
    f = l.getFilter ? l.getFilter() : null,
    h = U0(f);
  function c(_) {
    sv(e, t.sers, function (S) {
      var b = S.getRawData(),
        w = b.getDimensionIndex(b.mapDimension(s.dim));
      w >= 0 && _(w, S, b.getStore());
    });
  }
  var v = 0;
  if (
    (c(function (_, S, b) {
      (n.set(S.uid, 1), (!i || !i.hasKey(S.uid)) && (o = !0), (v += b.count()));
    }),
    (!i || i.keys().length !== n.keys().length) && (o = !0),
    !o && a != null)
  ) {
    t.liPosMinGap = a;
    return;
  }
  cv(yn, v);
  var d = 0;
  c(function (_, S, b) {
    for (var w = 0, T = b.count(); w < T; ++w) {
      var C = b.get(_, w);
      isFinite(C) && (!f || W0(h, C)) && (u && (C = l.transformIn(C, null)), (yn.arr[d++] = C));
    }
  });
  var p = yn.typed ? yn.arr.subarray(0, d) : ((yn.arr.length = d), yn.arr);
  yn.typed ? p.sort() : ec(p);
  for (var m = 1 / 0, g = 1; g < d; ++g) {
    var y = p[g] - p[g - 1];
    y > 0 && y < m && (m = y);
  }
  ((r.liPosMinGap = t.liPosMinGap = Ie(m) ? m : d > 0 ? K_ : gL), (r.serUids = n));
}
var yn = cv({ ctor: BP }, 50);
function D2(e) {
  return function (t, r) {
    var n = Ni(t, { fromStat: { key: e } });
    if (Ie(n.w2)) return [-n.w2 / 2, n.w2 / 2];
  };
}
function Fl(e, t) {
  return e + Ah + t;
}
function A2(e) {
  return (x2(), { liPosMinGap: !ze(e.scale) });
}
var gi = "bar";
function M2(e, t, r, n) {
  xL(e, { key: t, seriesType: r, coordSysType: n, getMetrics: A2 });
}
function I2(e) {
  var t = e.scale.rawExtentInfo.makeRenderInfo().startValue;
  return t;
}
var kS = { left: 0, right: 0, top: 0, bottom: 0 },
  ol = ["25%", "25%"],
  cr = "cartesian2d",
  L2 = (function (e) {
    V(t, e);
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    return (
      (t.prototype.mergeDefaultAndTheme = function (r, n) {
        var i = ja(r.outerBounds);
        (e.prototype.mergeDefaultAndTheme.apply(this, arguments), i && r.outerBounds && Hr(r.outerBounds, i));
      }),
      (t.prototype.mergeOption = function (r, n) {
        (e.prototype.mergeOption.apply(this, arguments),
          this.option.outerBounds && r.outerBounds && Hr(this.option.outerBounds, r.outerBounds));
      }),
      (t.type = "grid"),
      (t.dependencies = ["xAxis", "yAxis"]),
      (t.layoutMode = "box"),
      (t.defaultOption = {
        show: !1,
        z: 0,
        left: "15%",
        top: 65,
        right: "10%",
        bottom: 80,
        containLabel: !1,
        outerBoundsMode: "auto",
        outerBounds: kS,
        outerBoundsContain: "all",
        outerBoundsClampWidth: ol[0],
        outerBoundsClampHeight: ol[1],
        backgroundColor: X.color.transparent,
        borderWidth: 1,
        borderColor: X.color.neutral30,
      }),
      t
    );
  })(dt),
  P2 = yy(),
  E2 = "__ec_stack_";
function BS(e) {
  return e.get("stack") || E2 + e.seriesIndex;
}
function R2(e, t) {
  var r = O2(e, t);
  return ((r.columnMap = k2(r)), r);
}
function O2(e, t) {
  var r = Fl(t, cr),
    n = [],
    i = Ni(e, { fromStat: { key: r }, min: 1 });
  return (
    tS(e, r, function (a) {
      n.push({
        barWidth: qt(a.get("barWidth"), i.w),
        barMaxWidth: qt(a.get("barMaxWidth"), i.w),
        barMinWidth: qt(a.get("barMinWidth") || (NS(a) ? 0.5 : 1), i.w),
        barGap: a.get("barGap"),
        barCategoryGap: a.get("barCategoryGap"),
        defaultBarGap: a.get("defaultBarGap"),
        stackId: BS(a),
      });
    }),
    { bandWidthResult: i, seriesInfo: n }
  );
}
function k2(e) {
  var t = e.bandWidthResult.w,
    r = t,
    n = 0,
    i,
    a,
    o = [],
    s = {};
  (I(e.seriesInfo, function (p, m) {
    m || (a = p.defaultBarGap || 0);
    var g = p.stackId;
    Qt(s, g) || n++;
    var y = s[g];
    y || ((y = s[g] = { width: 0, maxWidth: 0 }), o.push(g));
    var _ = p.barWidth;
    _ && !y.width && ((y.width = _), (_ = Ut(r, _)), (r -= _));
    var S = p.barMaxWidth;
    S && (y.maxWidth = S);
    var b = p.barMinWidth;
    b && (y.minWidth = b);
    var w = p.barGap;
    w != null && (a = w);
    var T = p.barCategoryGap;
    T != null && (i = T);
  }),
    i == null && (i = ht(35 - o.length * 4, 15) + "%"));
  var l = qt(i, t),
    u = qt(a, 1),
    f = (r - l) / (n + (n - 1) * u);
  ((f = ht(f, 0)),
    I(o, function (p) {
      var m = s[p],
        g = m.maxWidth,
        y = m.minWidth;
      if (m.width) {
        var _ = m.width;
        (g && (_ = Ut(_, g)), y && (_ = ht(_, y)), (m.width = _), (r -= _ + u * _), n--);
      } else {
        var _ = f;
        (g && g < _ && (_ = Ut(g, r)), y && y > _ && (_ = y), _ !== f && ((m.width = _), (r -= _ + u * _), n--));
      }
    }),
    (f = (r - l) / (n + (n - 1) * u)),
    (f = ht(f, 0)));
  var h = 0,
    c;
  (I(o, function (p) {
    var m = s[p];
    (m.width || (m.width = f), (c = m), (h += m.width * (1 + u)));
  }),
    c && (h -= c.width * u));
  var v = {},
    d = -h / 2;
  return (
    I(o, function (p) {
      var m = s[p];
      ((v[p] = v[p] || { bandWidth: t, offset: d, width: m.width }), (d += m.width * (1 + u)));
    }),
    v
  );
}
function B2(e) {
  return {
    seriesType: e,
    overallReset: function (t) {
      var r = Fl(e, cr);
      bL(t, r, function (n) {
        var i = R2(n, e);
        tS(n, r, function (a) {
          var o = i.columnMap[BS(a)];
          a.getData().setLayout({ bandWidth: o.bandWidth, offset: o.offset, size: o.width });
        });
      });
    },
  };
}
function N2(e) {
  return {
    seriesType: e,
    plan: $c(),
    reset: function (t) {
      if (S2(t)) {
        var r = t.getData(),
          n = t.coordinateSystem,
          i = n.getBaseAxis(),
          a = n.getOtherAxis(i),
          o = r.getDimensionIndex(r.mapDimension(a.dim)),
          s = r.getDimensionIndex(r.mapDimension(i.dim)),
          l = t.get("showBackground", !0),
          u = r.mapDimension(a.dim),
          f = r.getCalculationInfo("stackResultDimension"),
          h = xi(r, u) && !!r.getCalculationInfo("stackedOnSeries"),
          c = a.isHorizontal(),
          v = a.toGlobalCoord(a.dataToCoord(I2(a))),
          d = NS(t),
          p = t.get("barMinHeight") || 0,
          m = f && r.getDimensionIndex(f),
          g = r.getLayout("size"),
          y = r.getLayout("offset");
        return {
          progress: function (_, S) {
            for (
              var b = _.count,
                w = d && fr(b * 3),
                T = d && l && fr(b * 3),
                C = d && fr(b),
                A = n.master.getRect(),
                M = c ? A.width : A.height,
                D,
                P = S.getStore(),
                x = 0;
              (D = _.next()) != null;
            ) {
              var L = P.get(h ? m : o, D),
                E = P.get(s, D),
                R = v,
                B = void 0;
              h && (B = +L - P.get(o, D));
              var O = void 0,
                k = void 0,
                z = void 0,
                H = void 0;
              if (c) {
                var W = n.dataToPoint([L, E]);
                (h && (R = n.dataToPoint([B, E])[0]),
                  (O = R),
                  (k = W[1] + y),
                  (z = W[0] - R),
                  (H = g),
                  Pt(z) < p && (z = (z < 0 ? -1 : 1) * p));
              } else {
                var W = n.dataToPoint([E, L]);
                (h && (R = n.dataToPoint([E, B])[1]),
                  (O = W[0] + y),
                  (k = R),
                  (z = g),
                  (H = W[1] - R),
                  Pt(H) < p && (H = (H <= 0 ? -1 : 1) * p));
              }
              (d
                ? ((w[x] = O),
                  (w[x + 1] = k),
                  (w[x + 2] = c ? z : H),
                  T && ((T[x] = c ? A.x : O), (T[x + 1] = c ? k : A.y), (T[x + 2] = M)),
                  (C[D] = D))
                : S.setItemLayout(D, { x: O, y: k, width: z, height: H }),
                (x += 3));
            }
            d && S.setLayout({ largePoints: w, largeDataIndices: C, largeBackgroundPoints: T, valueAxisHorizontal: c });
          },
        };
      }
    },
  };
}
function NS(e) {
  return e.pipelineContext && e.pipelineContext.large;
}
function F2(e) {
  return D2(Fl(e, cr));
}
function z2(e) {
  P2(e, function () {
    function t(r) {
      var n = Fl(r, cr);
      (M2(e, n, r, cr), RL(n, F2(r)));
    }
    (t("bar"), t("pictorialBar"));
  });
}
var Oh = (function (e) {
  V(t, e);
  function t() {
    var r = (e !== null && e.apply(this, arguments)) || this;
    return ((r.type = t.type), r);
  }
  return (
    (t.prototype.getInitialData = function (r, n) {
      return ev(null, this, { useEncodeDefaulter: !0 });
    }),
    (t.prototype.getMarkerPosition = function (r, n, i) {
      var a = this.coordinateSystem;
      if (a && a.clampData) {
        var o = a.clampData(r),
          s = a.dataToPoint(o);
        if (i)
          I(a.getAxes(), function (c, v) {
            if (c.type === "category" && n != null) {
              var d = c.getTicksCoords(),
                p = c.getTickModel().get("alignWithLabel"),
                m = o[v],
                g = n[v] === "x1" || n[v] === "y1";
              if ((g && !p && (m += 1), d.length < 2)) return;
              if (d.length === 2) {
                s[v] = c.toGlobalCoord(c.getExtent()[g ? 1 : 0]);
                return;
              }
              for (var y = void 0, _ = void 0, S = 1, b = 0; b < d.length; b++) {
                var w = d[b].coord,
                  T = b === d.length - 1 ? d[b - 1].tickValue + S : d[b].tickValue;
                if (T === m) {
                  _ = w;
                  break;
                } else if (T < m) y = w;
                else if (y != null && T > m) {
                  _ = (w + y) / 2;
                  break;
                }
                b === 1 && (S = T - d[0].tickValue);
              }
              (_ == null && (y ? y && (_ = d[d.length - 1].coord) : (_ = d[0].coord)), (s[v] = c.toGlobalCoord(_)));
            }
          });
        else {
          var l = this.getData(),
            u = l.getLayout("offset"),
            f = l.getLayout("size"),
            h = a.getBaseAxis().isHorizontal() ? 0 : 1;
          s[h] += u + f / 2;
        }
        return s;
      }
      return [NaN, NaN];
    }),
    (t.prototype.__requireStartValue = function (r) {
      return this.getBaseAxis() !== r;
    }),
    (t.type = "series.__base_bar__"),
    (t.defaultOption = {
      z: 2,
      coordinateSystem: "cartesian2d",
      legendHoverLink: !0,
      barMinHeight: 0,
      barMinAngle: 0,
      large: !1,
      largeThreshold: 400,
      progressive: 3e3,
      progressiveChunkMode: "mod",
      defaultBarGap: "10%",
    }),
    t
  );
})(er);
er.registerClass(Oh);
var H2 = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), r);
    }
    return (
      (t.prototype.getInitialData = function () {
        return ev(null, this, {
          useEncodeDefaulter: !0,
          createInvertedIndices: !!this.get("realtimeSort", !0) || null,
        });
      }),
      (t.prototype.getProgressive = function () {
        return this.get("large") ? this.get("progressive") : !1;
      }),
      (t.prototype.__preparePipelineContext = function (r, n) {
        var i = _y(this, r, n);
        return (i.progressiveRender && (i.large = !0), i);
      }),
      (t.prototype.brushSelector = function (r, n, i) {
        return i.rect(n.getItemLayout(r));
      }),
      (t.type = "series." + gi),
      (t.dependencies = ["grid", "polar"]),
      (t.defaultOption = v0(Oh.defaultOption, {
        clip: !0,
        roundCap: !1,
        showBackground: !1,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
          borderColor: null,
          borderWidth: 0,
          borderType: "solid",
          borderRadius: 0,
          shadowBlur: 0,
          shadowColor: null,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          opacity: 1,
        },
        select: { itemStyle: { borderColor: X.color.primary, borderWidth: 2 } },
        realtimeSort: !1,
      })),
      t
    );
  })(Oh),
  V2 = (function () {
    function e() {
      ((this.cx = 0),
        (this.cy = 0),
        (this.r0 = 0),
        (this.r = 0),
        (this.startAngle = 0),
        (this.endAngle = Math.PI * 2),
        (this.clockwise = !0));
    }
    return e;
  })(),
  Vg = (function (e) {
    V(t, e);
    function t(r) {
      var n = e.call(this, r) || this;
      return ((n.type = "sausage"), n);
    }
    return (
      (t.prototype.getDefaultShape = function () {
        return new V2();
      }),
      (t.prototype.buildPath = function (r, n) {
        var i = n.cx,
          a = n.cy,
          o = Math.max(n.r0 || 0, 0),
          s = Math.max(n.r, 0),
          l = (s - o) * 0.5,
          u = o + l,
          f = n.startAngle,
          h = n.endAngle,
          c = n.clockwise,
          v = Math.PI * 2,
          d = c ? h - f < v : f - h < v;
        d || (f = h - (c ? v : -v));
        var p = Math.cos(f),
          m = Math.sin(f),
          g = Math.cos(h),
          y = Math.sin(h);
        (d
          ? (r.moveTo(p * o + i, m * o + a), r.arc(p * u + i, m * u + a, l, -Math.PI + f, f, !c))
          : r.moveTo(p * s + i, m * s + a),
          r.arc(i, a, s, f, h, !c),
          r.arc(g * u + i, y * u + a, l, h - Math.PI * 2, h - Math.PI, !c),
          o !== 0 && r.arc(i, a, o, h, f, c));
      }),
      t
    );
  })(gt);
function G2(e, t) {
  t = t || {};
  var r = t.isRoundCap;
  return function (n, i, a) {
    var o = i.position;
    if (!o || o instanceof Array) return Es(n, i, a);
    var s = e(o),
      l = i.distance != null ? i.distance : 5,
      u = this.shape,
      f = u.cx,
      h = u.cy,
      c = u.r,
      v = u.r0,
      d = (c + v) / 2,
      p = u.startAngle,
      m = u.endAngle,
      g = (p + m) / 2,
      y = r ? Math.abs(c - v) / 2 : 0,
      _ = Math.cos,
      S = Math.sin,
      b = f + c * _(p),
      w = h + c * S(p),
      T = "left",
      C = "top";
    switch (s) {
      case "startArc":
        ((b = f + (v - l) * _(g)), (w = h + (v - l) * S(g)), (T = "center"), (C = "top"));
        break;
      case "insideStartArc":
        ((b = f + (v + l) * _(g)), (w = h + (v + l) * S(g)), (T = "center"), (C = "bottom"));
        break;
      case "startAngle":
        ((b = f + d * _(p) + $o(p, l + y, !1)), (w = h + d * S(p) + Zo(p, l + y, !1)), (T = "right"), (C = "middle"));
        break;
      case "insideStartAngle":
        ((b = f + d * _(p) + $o(p, -l + y, !1)), (w = h + d * S(p) + Zo(p, -l + y, !1)), (T = "left"), (C = "middle"));
        break;
      case "middle":
        ((b = f + d * _(g)), (w = h + d * S(g)), (T = "center"), (C = "middle"));
        break;
      case "endArc":
        ((b = f + (c + l) * _(g)), (w = h + (c + l) * S(g)), (T = "center"), (C = "bottom"));
        break;
      case "insideEndArc":
        ((b = f + (c - l) * _(g)), (w = h + (c - l) * S(g)), (T = "center"), (C = "top"));
        break;
      case "endAngle":
        ((b = f + d * _(m) + $o(m, l + y, !0)), (w = h + d * S(m) + Zo(m, l + y, !0)), (T = "left"), (C = "middle"));
        break;
      case "insideEndAngle":
        ((b = f + d * _(m) + $o(m, -l + y, !0)), (w = h + d * S(m) + Zo(m, -l + y, !0)), (T = "right"), (C = "middle"));
        break;
      default:
        return Es(n, i, a);
    }
    return ((n = n || {}), (n.x = b), (n.y = w), (n.align = T), (n.verticalAlign = C), n);
  };
}
function U2(e, t, r, n) {
  if (wt(n)) {
    e.setTextConfig({ rotation: n });
    return;
  } else if (U(t)) {
    e.setTextConfig({ rotation: 0 });
    return;
  }
  var i = e.shape,
    a = i.clockwise ? i.startAngle : i.endAngle,
    o = i.clockwise ? i.endAngle : i.startAngle,
    s = (a + o) / 2,
    l,
    u = r(t);
  switch (u) {
    case "startArc":
    case "insideStartArc":
    case "middle":
    case "insideEndArc":
    case "endArc":
      l = s;
      break;
    case "startAngle":
    case "insideStartAngle":
      l = a;
      break;
    case "endAngle":
    case "insideEndAngle":
      l = o;
      break;
    default:
      e.setTextConfig({ rotation: 0 });
      return;
  }
  var f = Math.PI * 1.5 - l;
  (u === "middle" && f > Math.PI / 2 && f < Math.PI * 1.5 && (f -= Math.PI), e.setTextConfig({ rotation: f }));
}
function $o(e, t, r) {
  return t * Math.sin(e) * (r ? -1 : 1);
}
function Zo(e, t, r) {
  return t * Math.cos(e) * (r ? 1 : -1);
}
function W2(e, t, r) {
  var n = e.get("borderRadius");
  if (n == null) return { cornerRadius: 0 };
  U(n) || (n = [n, n, n, n]);
  var i = Math.abs(t.r || 0 - t.r0 || 0);
  return {
    cornerRadius: j(n, function (a) {
      return Pn(a, i);
    }),
  };
}
var sf = Math.max,
  lf = Math.min,
  Y2 = (function (e) {
    V(t, e);
    function t() {
      var r = e.call(this) || this;
      return ((r.type = gi), (r._isFirstFrame = !0), r);
    }
    return (
      (t.prototype.render = function (r, n, i, a) {
        ((this._model = r), this._removeOnRenderedListener(i), this._updateDrawMode(r));
        var o = r.get("coordinateSystem");
        (o === "cartesian2d" || o === "polar") &&
          ((this._progressiveEls = null),
          this._isLargeDraw ? this._renderLarge(r, n, i) : this._renderNormal(r, n, i, a));
      }),
      (t.prototype.incrementalPrepareRender = function (r) {
        (this._clear(), this._updateDrawMode(r), this._updateLargeClip(r));
      }),
      (t.prototype.incrementalRender = function (r, n) {
        ((this._progressiveEls = []), this._incrementalRenderLarge(r, n));
      }),
      (t.prototype.eachRendered = function (r) {
        Tl(this._progressiveEls || this.group, r);
      }),
      (t.prototype._updateDrawMode = function (r) {
        var n = r.pipelineContext.large;
        (this._isLargeDraw == null || n !== this._isLargeDraw) && ((this._isLargeDraw = n), this._clear());
      }),
      (t.prototype._renderNormal = function (r, n, i, a) {
        var o = this.group,
          s = r.getData(),
          l = this._data,
          u = r.coordinateSystem,
          f = u.getBaseAxis(),
          h;
        u.type === "cartesian2d" ? (h = f.isHorizontal()) : u.type === "polar" && (h = f.dim === "angle");
        var c = r.isAnimationEnabled() ? r : null,
          v = X2(r, u);
        v && this._enableRealtimeSort(v, s, i);
        var d = r.get("clip", !0) || v,
          p = u.getArea();
        o.removeClipPath();
        var m = r.get("roundCap", !0),
          g = r.get("showBackground", !0),
          y = r.getModel("backgroundStyle"),
          _ = y.get("borderRadius") || 0,
          S = [],
          b = this._backgroundEls,
          w = a && a.isInitSort,
          T = a && a.type === "changeAxisOrder";
        function C(D) {
          var P = qo[u.type](s, D);
          if (!P) return null;
          var x = J2(u, h, P);
          return (
            x.useStyle(y.getItemStyle()),
            u.type === "cartesian2d" ? x.setShape("r", _) : x.setShape("cornerRadius", _),
            (S[D] = x),
            x
          );
        }
        s.diff(l)
          .add(function (D) {
            var P = s.getItemModel(D),
              x = qo[u.type](s, D, P);
            if (x && (g && C(D), !(!s.hasValue(D) || !Xg[u.type](x)))) {
              var L = !1;
              d && (L = Gg[u.type](p, x));
              var E = Ug[u.type](r, s, D, x, h, c, f.model, !1, m);
              (v && (E.forceLabelAnimation = !0),
                $g(E, s, D, P, x, r, h, u.type === "polar"),
                w ? E.attr({ shape: x }) : v ? Wg(v, c, E, x, D, h, !1, !1) : gr(E, { shape: x }, r, D),
                s.setItemGraphicEl(D, E),
                o.add(E),
                (E.ignore = L));
            }
          })
          .update(function (D, P) {
            var x = s.getItemModel(D),
              L = qo[u.type](s, D, x);
            if (L) {
              if (g) {
                var E = void 0;
                b.length === 0
                  ? (E = C(P))
                  : ((E = b[P]),
                    E.useStyle(y.getItemStyle()),
                    u.type === "cartesian2d" ? E.setShape("r", _) : E.setShape("cornerRadius", _),
                    (S[D] = E));
                var R = qo[u.type](s, D),
                  B = zS(h, R, u);
                he(E, { shape: B }, c, D);
              }
              var O = l.getItemGraphicEl(P);
              if (!s.hasValue(D) || !Xg[u.type](L)) {
                o.remove(O);
                return;
              }
              var k = !1;
              d && ((k = Gg[u.type](p, L)), k && o.remove(O));
              var z = O && ((O.type === "sector" && m) || (O.type === "sausage" && !m));
              if (
                (z && (O && hs(O, r, P), (O = null)),
                O ? t0(O) : (O = Ug[u.type](r, s, D, L, h, c, f.model, !0, m)),
                v && (O.forceLabelAnimation = !0),
                T)
              ) {
                var H = O.getTextContent();
                if (H) {
                  var W = Al(H);
                  W.prevValue != null && (W.prevValue = W.value);
                }
              } else $g(O, s, D, x, L, r, h, u.type === "polar");
              (w ? O.attr({ shape: L }) : v ? Wg(v, c, O, L, D, h, !0, T) : he(O, { shape: L }, r, D, null),
                s.setItemGraphicEl(D, O),
                (O.ignore = k),
                o.add(O));
            }
          })
          .remove(function (D) {
            var P = l.getItemGraphicEl(D);
            P && hs(P, r, D);
          })
          .execute();
        var A = this._backgroundGroup || (this._backgroundGroup = new Bt());
        A.removeAll();
        for (var M = 0; M < S.length; ++M) A.add(S[M]);
        (o.add(A), (this._backgroundEls = S), (this._data = s));
      }),
      (t.prototype._renderLarge = function (r, n, i) {
        (this._clear(), qg(r, this.group), this._updateLargeClip(r));
      }),
      (t.prototype._incrementalRenderLarge = function (r, n) {
        (this._removeBackground(), qg(n, this.group, this._progressiveEls, !0));
      }),
      (t.prototype._updateLargeClip = function (r) {
        var n = r.get("clip", !0) && GP(r.coordinateSystem, !1, r),
          i = this.group;
        n ? i.setClipPath(n) : i.removeClipPath();
      }),
      (t.prototype._enableRealtimeSort = function (r, n, i) {
        var a = this;
        if (n.count()) {
          var o = r.baseAxis;
          if (this._isFirstFrame) (this._dispatchInitSort(n, r, i), (this._isFirstFrame = !1));
          else {
            var s = function (l) {
              var u = n.getItemGraphicEl(l),
                f = u && u.shape;
              return (f && Math.abs(o.isHorizontal() ? f.height : f.width)) || 0;
            };
            ((this._onRendered = function () {
              a._updateSortWithinSameData(n, s, o, i);
            }),
              i.getZr().on("rendered", this._onRendered));
          }
        }
      }),
      (t.prototype._dataSort = function (r, n, i) {
        var a = [];
        return (
          r.each(r.mapDimension(n.dim), function (o, s) {
            var l = i(s);
            ((l = l ?? NaN), a.push({ dataIndex: s, mappedValue: l, ordinalNumber: o }));
          }),
          a.sort(function (o, s) {
            return s.mappedValue - o.mappedValue;
          }),
          {
            ordinalNumbers: j(a, function (o) {
              return o.ordinalNumber;
            }),
          }
        );
      }),
      (t.prototype._isOrderChangedWithinSameData = function (r, n, i) {
        for (
          var a = i.scale,
            o = r.mapDimension(i.dim),
            s = Number.MAX_VALUE,
            l = 0,
            u = a.getOrdinalMeta().categories.length;
          l < u;
          ++l
        ) {
          var f = r.rawIndexOf(o, a.getRawOrdinalNumber(l)),
            h = f < 0 ? Number.MIN_VALUE : n(r.indexOfRawIndex(f));
          if (h > s) return !0;
          s = h;
        }
        return !1;
      }),
      (t.prototype._isOrderDifferentInView = function (r, n) {
        for (
          var i = n.scale,
            a = i.getExtent(),
            o = Math.max(0, a[0]),
            s = Math.min(a[1], i.getOrdinalMeta().categories.length - 1);
          o <= s;
          ++o
        )
          if (r.ordinalNumbers[o] !== i.getRawOrdinalNumber(o)) return !0;
      }),
      (t.prototype._updateSortWithinSameData = function (r, n, i, a) {
        if (this._isOrderChangedWithinSameData(r, n, i)) {
          var o = this._dataSort(r, i, n);
          this._isOrderDifferentInView(o, i) &&
            (this._removeOnRenderedListener(a),
            a.dispatchAction({ type: "changeAxisOrder", componentType: i.dim + "Axis", axisId: i.index, sortInfo: o }));
        }
      }),
      (t.prototype._dispatchInitSort = function (r, n, i) {
        var a = n.baseAxis,
          o = this._dataSort(r, a, function (s) {
            return r.get(r.mapDimension(n.otherAxis.dim), s);
          });
        i.dispatchAction({
          type: "changeAxisOrder",
          componentType: a.dim + "Axis",
          isInitSort: !0,
          axisId: a.index,
          sortInfo: o,
        });
      }),
      (t.prototype.remove = function (r, n) {
        (this._clear(this._model), this._removeOnRenderedListener(n));
      }),
      (t.prototype.dispose = function (r, n) {
        this._removeOnRenderedListener(n);
      }),
      (t.prototype._removeOnRenderedListener = function (r) {
        this._onRendered && (r.getZr().off("rendered", this._onRendered), (this._onRendered = null));
      }),
      (t.prototype._clear = function (r) {
        var n = this.group,
          i = this._data;
        (r && r.isAnimationEnabled() && i && !this._isLargeDraw
          ? (this._removeBackground(),
            (this._backgroundEls = []),
            i.eachItemGraphicEl(function (a) {
              hs(a, r, ut(a).dataIndex);
            }))
          : n.removeAll(),
          (this._data = null),
          (this._isFirstFrame = !0));
      }),
      (t.prototype._removeBackground = function () {
        (this.group.remove(this._backgroundGroup), (this._backgroundGroup = null));
      }),
      (t.type = gi),
      t
    );
  })(Re),
  Gg = {
    cartesian2d: function (e, t) {
      var r = t.width < 0 ? -1 : 1,
        n = t.height < 0 ? -1 : 1;
      (r < 0 && ((t.x += t.width), (t.width = -t.width)), n < 0 && ((t.y += t.height), (t.height = -t.height)));
      var i = e.x + e.width,
        a = e.y + e.height,
        o = sf(t.x, e.x),
        s = lf(t.x + t.width, i),
        l = sf(t.y, e.y),
        u = lf(t.y + t.height, a),
        f = s < o,
        h = u < l;
      return (
        (t.x = f && o > i ? s : o),
        (t.y = h && l > a ? u : l),
        (t.width = f ? 0 : s - o),
        (t.height = h ? 0 : u - l),
        r < 0 && ((t.x += t.width), (t.width = -t.width)),
        n < 0 && ((t.y += t.height), (t.height = -t.height)),
        f || h
      );
    },
    polar: function (e, t) {
      var r = t.r0 <= t.r ? 1 : -1;
      if (r < 0) {
        var n = t.r;
        ((t.r = t.r0), (t.r0 = n));
      }
      var i = lf(t.r, e.r),
        a = sf(t.r0, e.r0);
      ((t.r = i), (t.r0 = a));
      var o = i - a < 0;
      if (r < 0) {
        var n = t.r;
        ((t.r = t.r0), (t.r0 = n));
      }
      return o;
    },
  },
  Ug = {
    cartesian2d: function (e, t, r, n, i, a, o, s, l) {
      var u = new Mt({ shape: N({}, n), z2: 1 });
      if (((u.__dataIndex = r), (u.name = "item"), a)) {
        var f = u.shape,
          h = i ? "height" : "width";
        f[h] = 0;
      }
      return u;
    },
    polar: function (e, t, r, n, i, a, o, s, l) {
      var u = !i && l ? Vg : Ri,
        f = new u({ shape: n, z2: 1 });
      f.name = "item";
      var h = FS(i);
      if (((f.calculateTextPosition = G2(h, { isRoundCap: u === Vg })), a)) {
        var c = f.shape,
          v = i ? "r" : "endAngle",
          d = {};
        ((c[v] = i ? n.r0 : n.startAngle), (d[v] = n[v]), (s ? he : gr)(f, { shape: d }, a));
      }
      return f;
    },
  };
function X2(e, t) {
  var r = e.get("realtimeSort", !0),
    n = t.getBaseAxis();
  if (r && n.type === "category" && t.type === "cartesian2d") return { baseAxis: n, otherAxis: t.getOtherAxis(n) };
}
function Wg(e, t, r, n, i, a, o, s) {
  var l, u;
  (a
    ? ((u = { x: n.x, width: n.width }), (l = { y: n.y, height: n.height }))
    : ((u = { y: n.y, height: n.height }), (l = { x: n.x, width: n.width })),
    s || (o ? he : gr)(r, { shape: l }, t, i, null));
  var f = t ? e.baseAxis.model : null;
  (o ? he : gr)(r, { shape: u }, f, i);
}
function Yg(e, t) {
  for (var r = 0; r < t.length; r++) if (!isFinite(e[t[r]])) return !0;
  return !1;
}
var $2 = ["x", "y", "width", "height"],
  Z2 = ["cx", "cy", "r", "startAngle", "endAngle"],
  Xg = {
    cartesian2d: function (e) {
      return !Yg(e, $2);
    },
    polar: function (e) {
      return !Yg(e, Z2);
    },
  },
  qo = {
    cartesian2d: function (e, t, r) {
      var n = e.getItemLayout(t);
      if (!n) return null;
      var i = r ? K2(r, n) : 0,
        a = n.width > 0 ? 1 : -1,
        o = n.height > 0 ? 1 : -1;
      return { x: n.x + (a * i) / 2, y: n.y + (o * i) / 2, width: n.width - a * i, height: n.height - o * i };
    },
    polar: function (e, t, r) {
      var n = e.getItemLayout(t);
      return {
        cx: n.cx,
        cy: n.cy,
        r0: n.r0,
        r: n.r,
        startAngle: n.startAngle,
        endAngle: n.endAngle,
        clockwise: n.clockwise,
      };
    },
  };
function q2(e) {
  return e.startAngle != null && e.endAngle != null && e.startAngle === e.endAngle;
}
function FS(e) {
  return (function (t) {
    var r = t ? "Arc" : "Angle";
    return function (n) {
      switch (n) {
        case "start":
        case "insideStart":
        case "end":
        case "insideEnd":
          return n + r;
        default:
          return n;
      }
    };
  })(e);
}
function $g(e, t, r, n, i, a, o, s) {
  var l = t.getItemVisual(r, "style");
  if (s) {
    if (!a.get("roundCap")) {
      var f = e.shape,
        h = W2(n.getModel("itemStyle"), f);
      (N(f, h), e.setShape(f));
    }
  } else {
    var u = n.get(["itemStyle", "borderRadius"]) || 0;
    e.setShape("r", u);
  }
  e.useStyle(l);
  var c = n.getShallow("cursor");
  c && e.attr("cursor", c);
  var v = s
      ? o
        ? i.r >= i.r0
          ? "endArc"
          : "startArc"
        : i.endAngle >= i.startAngle
          ? "endAngle"
          : "startAngle"
      : o
        ? tE(i, a.coordinateSystem)
        : eE(i, a.coordinateSystem),
    d = Dl(n);
  Cl(e, d, {
    labelFetcher: a,
    labelDataIndex: r,
    defaultText: fv(a.getData(), r),
    inheritColor: l.fill,
    defaultOpacity: l.opacity,
    defaultOutsidePosition: v,
  });
  var p = e.getTextContent();
  if (s && p) {
    var m = n.get(["label", "position"]);
    ((e.textConfig.inside = m === "middle" ? !0 : null),
      U2(e, m === "outside" ? v : m, FS(o), n.get(["label", "rotate"])));
  }
  HC(p, d, a.getRawValue(r), function (y) {
    return _S(t, y);
  });
  var g = n.getModel(["emphasis"]);
  (Hs(e, g.get("focus"), g.get("blurScope"), g.get("disabled")),
    eh(e, n),
    q2(i) &&
      ((e.style.fill = "none"),
      (e.style.stroke = "none"),
      I(e.states, function (y) {
        y.style && (y.style.fill = y.style.stroke = "none");
      })));
}
function K2(e, t) {
  var r = e.get(["itemStyle", "borderColor"]);
  if (!r || r === "none") return 0;
  var n = e.get(["itemStyle", "borderWidth"]) || 0,
    i = isNaN(t.width) ? Number.MAX_VALUE : Math.abs(t.width),
    a = isNaN(t.height) ? Number.MAX_VALUE : Math.abs(t.height);
  return Math.min(n, i, a);
}
var Q2 = (function () {
    function e() {}
    return e;
  })(),
  Zg = (function (e) {
    V(t, e);
    function t(r) {
      var n = e.call(this, r) || this;
      return ((n.type = "largeBar"), n);
    }
    return (
      (t.prototype.getDefaultShape = function () {
        return new Q2();
      }),
      (t.prototype.buildPath = function (r, n) {
        for (
          var i = n.points, a = this.baseDimIdx, o = 1 - this.baseDimIdx, s = [], l = [], u = this.barWidth, f = 0;
          f < i.length;
          f += 3
        )
          ((l[a] = u), (l[o] = i[f + 2]), (s[a] = i[f + a]), (s[o] = i[f + o]), r.rect(s[0], s[1], l[0], l[1]));
      }),
      t
    );
  })(gt);
function qg(e, t, r, n) {
  var i = e.getData(),
    a = i.getLayout("valueAxisHorizontal") ? 1 : 0,
    o = i.getLayout("largeDataIndices"),
    s = i.getLayout("size"),
    l = e.getModel("backgroundStyle"),
    u = i.getLayout("largeBackgroundPoints"),
    f = n ? vT(e) : 0;
  if (u) {
    var h = new Zg({ shape: { points: u }, incremental: f, silent: !0, z2: 0 });
    ((h.baseDimIdx = a),
      (h.largeDataIndices = o),
      (h.barWidth = s),
      h.useStyle(l.getItemStyle()),
      t.add(h),
      r && r.push(h));
  }
  var c = new Zg({ shape: { points: i.getLayout("largePoints") }, incremental: f, ignoreCoarsePointer: !0, z2: 1 });
  ((c.baseDimIdx = a),
    (c.largeDataIndices = o),
    (c.barWidth = s),
    t.add(c),
    c.useStyle(i.getVisual("style")),
    (c.style.stroke = null),
    (ut(c).seriesIndex = e.seriesIndex),
    e.get("silent") || (c.on("mousedown", Kg), c.on("mousemove", Kg)),
    r && r.push(c));
}
var Kg = Rl(
  function (e) {
    var t = this,
      r = j2(t, e.offsetX, e.offsetY);
    ut(t).dataIndex = r >= 0 ? r : null;
  },
  30,
  !1,
);
function j2(e, t, r) {
  for (
    var n = e.baseDimIdx,
      i = 1 - n,
      a = e.shape.points,
      o = e.largeDataIndices,
      s = [],
      l = [],
      u = e.barWidth,
      f = 0,
      h = a.length / 3;
    f < h;
    f++
  ) {
    var c = f * 3;
    if (
      ((l[n] = u),
      (l[i] = a[c + 2]),
      (s[n] = a[c + n]),
      (s[i] = a[c + i]),
      l[i] < 0 && ((s[i] += l[i]), (l[i] = -l[i])),
      t >= s[0] && t <= s[0] + l[0] && r >= s[1] && r <= s[1] + l[1])
    )
      return o[f];
  }
  return -1;
}
function zS(e, t, r) {
  if (CS(r, "cartesian2d")) {
    var n = t,
      i = r.getArea();
    return { x: e ? n.x : i.x, y: e ? i.y : n.y, width: e ? n.width : i.width, height: e ? i.height : n.height };
  } else {
    var i = r.getArea(),
      a = t;
    return {
      cx: i.cx,
      cy: i.cy,
      r0: e ? i.r0 : a.r0,
      r: e ? i.r : a.r,
      startAngle: e ? a.startAngle : 0,
      endAngle: e ? a.endAngle : Math.PI * 2,
    };
  }
}
function J2(e, t, r) {
  var n = e.type === "polar" ? Ri : Mt;
  return new n({ shape: zS(t, r, e), silent: !0, z2: 0 });
}
function tE(e, t) {
  if (e.height === 0) {
    var r = t.getOtherAxis(t.getBaseAxis());
    return r.inverse ? "bottom" : "top";
  }
  return e.height > 0 ? "bottom" : "top";
}
function eE(e, t) {
  if (e.width === 0) {
    var r = t.getOtherAxis(t.getBaseAxis());
    return r.inverse ? "left" : "right";
  }
  return e.width >= 0 ? "right" : "left";
}
function rE(e) {
  (e.registerChartView(Y2),
    e.registerSeriesModel(H2),
    e.registerLayout(e.PRIORITY.VISUAL.LAYOUT, B2(gi)),
    e.registerLayout(e.PRIORITY.VISUAL.PROGRESSIVE_LAYOUT, N2(gi)),
    e.registerProcessor(e.PRIORITY.PROCESSOR.STATISTIC, AS(gi)),
    e.registerAction({ type: "changeAxisOrder", event: "changeAxisOrder", update: "update" }, function (t, r) {
      var n = t.componentType || "series";
      r.eachComponent({ mainType: n, query: t }, function (i) {
        t.sortInfo && i.axis.setCategorySortInfo(t.sortInfo);
      });
    }),
    z2(e));
}
var kh = (function (e) {
  V(t, e);
  function t() {
    return (e !== null && e.apply(this, arguments)) || this;
  }
  return (
    (t.prototype.getCoordSysModel = function () {
      return this.getReferringComponents("grid", xe).models[0];
    }),
    (t.type = "cartesian2dAxis"),
    t
  );
})(dt);
rr(kh, dL);
var HS = {
    show: !0,
    z: 0,
    inverse: !1,
    name: "",
    nameLocation: "end",
    nameRotate: null,
    nameTruncate: { maxWidth: null, ellipsis: "...", placeholder: "." },
    nameTextStyle: {},
    nameGap: 15,
    silent: !1,
    triggerEvent: !1,
    tooltip: { show: !1 },
    axisPointer: {},
    axisLine: {
      show: !0,
      onZero: "auto",
      onZeroAxisIndex: null,
      lineStyle: { color: X.color.axisLine, width: 1, type: "solid" },
      symbol: ["none", "none"],
      symbolSize: [10, 15],
      breakLine: !0,
    },
    axisTick: { show: !0, inside: !1, length: 5, lineStyle: { width: 1 } },
    axisLabel: {
      show: !0,
      inside: !1,
      rotate: 0,
      showMinLabel: null,
      showMaxLabel: null,
      margin: 8,
      fontSize: 12,
      color: X.color.axisLabel,
      textMargin: [0, 3],
    },
    splitLine: {
      show: !0,
      showMinLine: !0,
      showMaxLine: !0,
      lineStyle: { color: X.color.axisSplitLine, width: 1, type: "solid" },
    },
    splitArea: { show: !1, areaStyle: { color: [X.color.backgroundTint, X.color.backgroundTransparent] } },
    breakArea: {
      show: !0,
      itemStyle: {
        color: X.color.neutral00,
        borderColor: X.color.border,
        borderWidth: 1,
        borderType: [3, 3],
        opacity: 0.6,
      },
      zigzagAmplitude: 4,
      zigzagMinSpan: 4,
      zigzagMaxSpan: 20,
      zigzagZ: 100,
      expandOnClick: !0,
    },
    breakLabelLayout: { moveOverlap: "auto" },
  },
  nE = pt(
    {
      boundaryGap: !0,
      deduplication: null,
      jitter: 0,
      jitterOverlap: !0,
      jitterMargin: 2,
      splitLine: { show: !1 },
      axisTick: { alignWithLabel: !1, interval: "auto", show: "auto" },
      axisLabel: { interval: "auto" },
    },
    HS,
  ),
  dv = pt(
    {
      boundaryGap: [0, 0],
      axisLine: { show: "auto" },
      axisTick: { show: "auto" },
      splitNumber: 5,
      minorTick: { show: !1, splitNumber: 5, length: 3, lineStyle: {} },
      minorSplitLine: { show: !1, lineStyle: { color: X.color.axisMinorSplitLine, width: 1 } },
    },
    HS,
  ),
  iE = pt({ splitNumber: 6, axisLabel: { rich: { primary: { fontWeight: "bold" } } }, splitLine: { show: !1 } }, dv),
  aE = mt({ logBase: 10 }, dv);
const oE = { category: nE, value: dv, time: iE, log: aE };
function Qg(e, t, r, n) {
  (I(X_, function (i, a) {
    var o = pt(pt({}, oE[a], !0), n, !0),
      s = (function (l) {
        V(u, l);
        function u() {
          var f = (l !== null && l.apply(this, arguments)) || this;
          return ((f.type = t + "Axis." + a), f);
        }
        return (
          (u.prototype.mergeDefaultAndTheme = function (f, h) {
            var c = ka(this),
              v = c ? ja(f) : {},
              d = h.getTheme();
            (pt(f, d.get(a + "Axis")), pt(f, this.getDefaultOption()), (f.type = jg(f)), c && Hr(f, v, c));
          }),
          (u.prototype.optionUpdated = function () {
            var f = this.option;
            f.type === "category" && (this.__ordinalMeta = Ch.createByAxisModel(this));
          }),
          (u.prototype.getCategories = function (f) {
            var h = this.option;
            if (h.type === "category") return f ? h.data : this.__ordinalMeta.categories;
          }),
          (u.prototype.getOrdinalMeta = function () {
            return this.__ordinalMeta;
          }),
          (u.prototype.updateAxisBreaks = function (f) {
            return { breaks: [] };
          }),
          (u.type = t + "Axis." + a),
          (u.defaultOption = o),
          u
        );
      })(r);
    e.registerComponentModel(s);
  }),
    e.registerSubTypeDefaulter(t + "Axis", jg));
}
function jg(e) {
  return e.type || (e.data ? "category" : "value");
}
var sE = (function () {
    function e(t) {
      ((this.type = "cartesian"), (this._dimList = []), (this._axes = {}), (this.name = t || ""));
    }
    return (
      (e.prototype.getAxis = function (t) {
        return this._axes[t];
      }),
      (e.prototype.getAxes = function () {
        return j(
          this._dimList,
          function (t) {
            return this._axes[t];
          },
          this,
        );
      }),
      (e.prototype.getAxesByScale = function (t) {
        return (
          (t = t.toLowerCase()),
          Vt(this.getAxes(), function (r) {
            return r.scale.type === t;
          })
        );
      }),
      (e.prototype.addAxis = function (t) {
        var r = t.dim;
        ((this._axes[r] = t), this._dimList.push(r));
      }),
      e
    );
  })(),
  Ss = ["x", "y"];
function Jg(e) {
  return (e.type === "interval" || e.type === "time") && !Ws(e);
}
var lE = (function (e) {
  V(t, e);
  function t() {
    var r = (e !== null && e.apply(this, arguments)) || this;
    return ((r.type = cr), (r.dimensions = Ss), r);
  }
  return (
    (t.prototype.calcAffineTransform = function () {
      this._transform = this._invTransform = null;
      var r = this.getAxis("x").scale,
        n = this.getAxis("y").scale;
      if (!(!Jg(r) || !Jg(n))) {
        var i = js(r, null),
          a = js(n, null),
          o = this.dataToPoint([i[0], a[0]]),
          s = this.dataToPoint([i[1], a[1]]),
          l = i[1] - i[0],
          u = a[1] - a[0];
        if (!(!l || !u)) {
          var f = (s[0] - o[0]) / l,
            h = (s[1] - o[1]) / u,
            c = o[0] - i[0] * f,
            v = o[1] - a[0] * h,
            d = (this._transform = [f, 0, 0, h, c, v]);
          this._invTransform = Ya([], d);
        }
      }
    }),
    (t.prototype.getBaseAxis = function () {
      return this.getAxesByScale("ordinal")[0] || this.getAxesByScale("time")[0] || this.getAxis("x");
    }),
    (t.prototype.containPoint = function (r) {
      var n = this.getAxis("x"),
        i = this.getAxis("y");
      return n.contain(n.toLocalCoord(r[0])) && i.contain(i.toLocalCoord(r[1]));
    }),
    (t.prototype.containData = function (r) {
      return this.getAxis("x").containData(r[0]) && this.getAxis("y").containData(r[1]);
    }),
    (t.prototype.containZone = function (r, n) {
      var i = this.dataToPoint(r),
        a = this.dataToPoint(n),
        o = this.getArea(),
        s = new J(i[0], i[1], a[0] - i[0], a[1] - i[1]);
      return o.intersect(s);
    }),
    (t.prototype.dataToPoint = function (r, n, i) {
      i = i || [];
      var a = r[0],
        o = r[1];
      if (this._transform && a != null && isFinite(a) && o != null && isFinite(o)) return Ae(i, r, this._transform);
      var s = this.getAxis("x"),
        l = this.getAxis("y");
      return ((i[0] = s.toGlobalCoord(s.dataToCoord(a, n))), (i[1] = l.toGlobalCoord(l.dataToCoord(o, n))), i);
    }),
    (t.prototype.clampData = function (r, n) {
      var i = this.getAxis("x").scale,
        a = this.getAxis("y").scale,
        o = i.getExtent(),
        s = a.getExtent(),
        l = i.parse(r[0]),
        u = a.parse(r[1]);
      return (
        (n = n || []),
        (n[0] = Math.min(Math.max(Math.min(o[0], o[1]), l), Math.max(o[0], o[1]))),
        (n[1] = Math.min(Math.max(Math.min(s[0], s[1]), u), Math.max(s[0], s[1]))),
        n
      );
    }),
    (t.prototype.pointToData = function (r, n, i) {
      if (((i = i || []), this._invTransform)) return Ae(i, r, this._invTransform);
      var a = this.getAxis("x"),
        o = this.getAxis("y");
      return ((i[0] = a.coordToData(a.toLocalCoord(r[0]), n)), (i[1] = o.coordToData(o.toLocalCoord(r[1]), n)), i);
    }),
    (t.prototype.getOtherAxis = function (r) {
      return this.getAxis(r.dim === "x" ? "y" : "x");
    }),
    (t.prototype.getArea = function (r) {
      r = r || 0;
      var n = this.getAxis("x").getGlobalExtent(),
        i = this.getAxis("y").getGlobalExtent(),
        a = Math.min(n[0], n[1]) - r,
        o = Math.min(i[0], i[1]) - r,
        s = Math.max(n[0], n[1]) - a + r,
        l = Math.max(i[0], i[1]) - o + r;
      return new J(a, o, s, l);
    }),
    t
  );
})(sE);
function uE(e, t) {
  var r = e.scale,
    n = e.model,
    i = oS(r, n, n.ecModel, e),
    a = Ci(r),
    o = Ci(t) ? t.intervalStub : t,
    s = a ? r.intervalStub : r,
    l = r.base,
    u = o.getTicks(),
    f = o.getTicks({ expandToNicedExtent: !0 }),
    h = u.length - 1,
    c,
    v,
    d;
  if (h === 1) ((c = v = 0), (d = 1));
  else if (h === 2) {
    var p = Pt(u[0].value - u[1].value),
      m = Pt(u[1].value - u[2].value);
    ((c = v = 0), p === m ? (d = 2) : ((d = 1), p < m ? (c = p / m) : (v = m / p)));
  } else {
    var g = o.getConfig().interval;
    ((c = (1 - (u[0].value - f[0].value) / g) % 1),
      (v = (1 - (f[h].value - u[h].value) / g) % 1),
      (d = h - (c ? 1 : 0) - (v ? 1 : 0)));
  }
  var y = i.zoomFixMM,
    _ = y[0] || y[1],
    S = [i.fixMM[0] || _, i.fixMM[1] || _],
    b = r.getExtent(),
    w = s.getExtent(),
    T = V_(w, S),
    C,
    A,
    M,
    D,
    P,
    x;
  function L(W) {
    for (var $ = 50, G = 0; G < $ && !W(); G++) ((M = a ? M * ht(l, 2) : XI(M)), (D = kn(M)));
  }
  function E() {
    C = ft(x - M * c, D);
  }
  function R() {
    A = ft(P + M * v, D);
  }
  function B() {
    x = c ? ft(C + M * c, D) : C;
  }
  function O() {
    P = v ? ft(A - M * v, D) : A;
  }
  if (S[0] && S[1]) {
    ((C = T[0]), (A = T[1]), (M = (A - C) / (d + c + v)));
    var k = e.getExtent(),
      z = Pt(k[1] - k[0]);
    ((D = Fw([A, C], z, 0.5 / d)), B(), O(), Ie(D) && (M = ft(M, D)));
  } else {
    var H = T[1] - T[0];
    ((M = a ? ht(uy(H), 1) : nc(H / d, fy)),
      (D = kn(M)),
      S[0]
        ? ((C = T[0]),
          L(function () {
            if ((B(), (P = ft(x + M * d, D)), R(), A >= T[1])) return !0;
          }))
        : S[1]
          ? ((A = T[1]),
            L(function () {
              if ((O(), (x = ft(P - M * d, D)), E(), C <= T[0])) return !0;
            }))
          : L(function () {
              ((x = ft(Za(T[0] / M) * M, D)), (P = ft(_i(T[1] / M) * M, D)));
              var W = dr((P - x) / M);
              if (W <= d) {
                var $ = d - W,
                  G = void 0,
                  K = i.incl0 || a;
                if (K && T[0] === 0) G = [0, $];
                else if (K && T[1] === 0) G = [$, 0];
                else {
                  var at = _i($ / 2);
                  G = $ % 2 === 0 ? [at, at] : C + A < T[0] + T[1] ? [at, at + 1] : [at + 1, at];
                }
                if (((x = ft(x - M * G[0], D)), (P = ft(P + M * G[1], D)), E(), R(), C <= T[0] && A >= T[1])) return !0;
              }
            }));
  }
  Z_(r, S, w, [C, A], b, { interval: M, intervalCount: d, intervalPrecision: D, niceExtent: [x, P] });
}
var tm = [
    [3, 1],
    [0, 2],
  ],
  fE = (function () {
    function e(t, r, n) {
      ((this.type = "grid"),
        (this._coordsMap = {}),
        (this._coordsList = []),
        (this._axesMap = {}),
        (this._axesList = []),
        (this.axisPointerEnabled = !0),
        (this.dimensions = Ss),
        this._initCartesian(t, r, n),
        (this.model = t));
    }
    return (
      (e.prototype.getRect = function () {
        return this._rect;
      }),
      (e.prototype.update = function (t, r) {
        var n = this._axesMap;
        I(this._axesList, function (o) {
          LL(o, DL);
          var s = o.scale;
          ze(s) && s.setSortInfo(o.model.get("categorySortInfo"));
        });
        function i(o) {
          for (var s = xt(o), l = [], u = s.length - 1; u >= 0; u--) {
            var f = o[+s[u]];
            f.__alignTo ? l.push(f) : bg(f);
          }
          I(l, function (h) {
            cE(h, h.__alignTo) ? bg(h) : uE(h, h.__alignTo.scale);
          });
        }
        (i(n.x), i(n.y));
        var a = {};
        (I(n.x, function (o) {
          em(n, "y", o, a);
        }),
          I(n.y, function (o) {
            em(n, "x", o, a);
          }),
          this.resize(this.model, r));
      }),
      (e.prototype.resize = function (t, r, n) {
        var i = Vc(t, r),
          a = (this._rect = bi(t.getBoxLayoutParams(), i.refContainer)),
          o = this._axesMap,
          s = this._coordsList,
          l = t.get("containLabel");
        if ((VS(o, a), !n)) {
          var u = dE(a, s, o, l, r),
            f = void 0;
          if (l) f = am(a.clone(), "axisLabel", null, a, o, u, i);
          else {
            var h = pE(t, a, i),
              c = h.outerBoundsRect,
              v = h.parsedOuterBoundsContain,
              d = h.outerBoundsClamp;
            c && (f = am(c, v, d, a, o, u, i));
          }
          (GS(a, o, ke.determine, null, f, i),
            I(this._coordsList, function (p) {
              p.calcAffineTransform();
            }));
        }
      }),
      (e.prototype.getAxis = function (t, r) {
        var n = this._axesMap[t];
        if (n != null) return n[r || 0];
      }),
      (e.prototype.getAxes = function () {
        return this._axesList.slice();
      }),
      (e.prototype.getCartesian = function (t, r) {
        if (t != null && r != null) {
          var n = "x" + t + "y" + r;
          return this._coordsMap[n];
        }
        Z(t) && ((r = t.yAxisIndex), (t = t.xAxisIndex));
        for (var i = 0, a = this._coordsList; i < a.length; i++)
          if (a[i].getAxis("x").index === t || a[i].getAxis("y").index === r) return a[i];
      }),
      (e.prototype.getCartesians = function () {
        return this._coordsList.slice();
      }),
      (e.prototype.convertToPixel = function (t, r, n) {
        var i = this._findConvertTarget(r);
        return i.cartesian ? i.cartesian.dataToPoint(n) : i.axis ? i.axis.toGlobalCoord(i.axis.dataToCoord(n)) : null;
      }),
      (e.prototype.convertFromPixel = function (t, r, n) {
        var i = this._findConvertTarget(r);
        return i.cartesian ? i.cartesian.pointToData(n) : i.axis ? i.axis.coordToData(i.axis.toLocalCoord(n)) : null;
      }),
      (e.prototype._findConvertTarget = function (t) {
        var r = t.seriesModel,
          n = t.xAxisModel || (r && r.getReferringComponents("xAxis", xe).models[0]),
          i = t.yAxisModel || (r && r.getReferringComponents("yAxis", xe).models[0]),
          a = t.gridModel,
          o = this._coordsList,
          s,
          l;
        if (r) ((s = r.coordinateSystem), vt(o, s) < 0 && (s = null));
        else if (n && i) s = this.getCartesian(n.componentIndex, i.componentIndex);
        else if (n) l = this.getAxis("x", n.componentIndex);
        else if (i) l = this.getAxis("y", i.componentIndex);
        else if (a) {
          var u = a.coordinateSystem;
          u === this && (s = this._coordsList[0]);
        }
        return { cartesian: s, axis: l };
      }),
      (e.prototype.containPoint = function (t) {
        var r = this._coordsList[0];
        if (r) return r.containPoint(t);
      }),
      (e.prototype._initCartesian = function (t, r, n) {
        var i = this,
          a = this,
          o = { left: !1, right: !1, top: !1, bottom: !1 },
          s = { x: {}, y: {} },
          l = { x: 0, y: 0 };
        if ((r.eachComponent("xAxis", u("x"), this), r.eachComponent("yAxis", u("y"), this), !l.x || !l.y)) {
          ((this._axesMap = {}), (this._axesList = []));
          return;
        }
        ((this._axesMap = s),
          I(s.x, function (f, h) {
            I(s.y, function (c, v) {
              var d = "x" + h + "y" + v,
                p = new lE(d);
              ((p.master = i), (p.model = t), (i._coordsMap[d] = p), i._coordsList.push(p), p.addAxis(f), p.addAxis(c));
            });
          }),
          nm(s.x),
          nm(s.y));
        function u(f) {
          return function (h, c) {
            if (hE(h, t)) {
              var v = h.get("position");
              (f === "x"
                ? v !== "top" && v !== "bottom" && (v = o.bottom ? "top" : "bottom")
                : v !== "left" && v !== "right" && (v = o.left ? "right" : "left"),
                (o[v] = !0));
              var d = iL(h),
                p = new r2(f, aL(h, d), [0, 0], d, v);
              ((p.onBand = q_(p.scale, h)),
                (p.inverse = h.get("inverse")),
                (h.axis = p),
                (p.model = h),
                (p.grid = a),
                (p.index = c),
                a._axesList.push(p),
                (s[f][c] = p),
                l[f]++);
            }
          };
        }
      }),
      (e.prototype.getTooltipAxes = function (t) {
        var r = [],
          n = [];
        return (
          I(this.getCartesians(), function (i) {
            var a = t != null && t !== "auto" ? i.getAxis(t) : i.getBaseAxis(),
              o = i.getOtherAxis(a);
            (vt(r, a) < 0 && r.push(a), vt(n, o) < 0 && n.push(o));
          }),
          { baseAxes: r, otherAxes: n }
        );
      }),
      (e.create = function (t, r) {
        var n = [];
        return (
          t.eachComponent("grid", function (i, a) {
            var o = new e(i, t, r);
            ((o.name = "grid_" + a),
              o.resize(i, r, !0),
              (i.coordinateSystem = o),
              n.push(o),
              I(o._axesList, function (s) {
                IL(s, e.dimIdxMap);
              }));
          }),
          t.eachSeries(function (i) {
            var a, o;
            yD({ targetModel: i, coordSysType: cr, coordSysProvider: s });
            function s() {
              var l = b2(i),
                u = l.xAxisModel,
                f = l.yAxisModel;
              ((a = u.axis), (o = f.axis));
              var h = u.getCoordSysModel(),
                c = h.coordinateSystem;
              return c.getCartesian(u.componentIndex, f.componentIndex);
            }
            a && o && (mg(a, i, cr), mg(o, i, cr));
          }, this),
          n
        );
      }),
      (e.dimensions = Ss),
      (e.dimIdxMap = tv(Ss)),
      e
    );
  })();
function hE(e, t) {
  return e.getCoordSysModel() === t;
}
function em(e, t, r, n) {
  r.getAxesOnZeroOf = function () {
    return a ? [a] : [];
  };
  var i = e[t],
    a,
    o = r.model,
    s = o.get(["axisLine", "onZero"]),
    l = o.get(["axisLine", "onZeroAxisIndex"]);
  if (!s) return;
  if (l != null) rm(s, i[l]) && (a = i[l]);
  else
    for (var u in i)
      if (Qt(i, u) && rm(s, i[u]) && !n[f(i[u])]) {
        a = i[u];
        break;
      }
  a && (n[f(a)] = !0);
  function f(h) {
    return h.dim + "_" + h.index;
  }
}
function rm(e, t) {
  if (!t) return !1;
  var r = t.scale,
    n = oL(r, 0),
    i = t && t.type !== "category" && t.type !== "time" && n !== Dh;
  return (i && e === "auto" && fL(t) && (i = !1), i);
}
function nm(e) {
  for (var t = xt(e), r, n = [], i = t.length - 1; i >= 0; i--) {
    var a = e[+t[i]];
    H_(a.scale) &&
      vL(a.model, a.type) == null &&
      (a.model.get("alignTicks") && a.model.get("interval") == null ? n.push(a) : (r = a));
  }
  (r || (r = n.pop()),
    r &&
      I(n, function (o) {
        o.__alignTo = r;
      }));
}
function cE(e, t) {
  return Ws(e.scale) || Ws(t.scale) || t.scale.getTicks().length < 2;
}
function vE(e, t) {
  var r = e.getExtent(),
    n = r[0] + r[1];
  ((e.toGlobalCoord =
    e.dim === "x"
      ? function (i) {
          return i + t;
        }
      : function (i) {
          return n - i + t;
        }),
    (e.toLocalCoord =
      e.dim === "x"
        ? function (i) {
            return i - t;
          }
        : function (i) {
            return n - i + t;
          }));
}
function VS(e, t) {
  (I(e.x, function (r) {
    return im(r, t.x, t.width);
  }),
    I(e.y, function (r) {
      return im(r, t.y, t.height);
    }));
}
function im(e, t, r) {
  var n = [0, r],
    i = e.inverse ? 1 : 0;
  (e.setExtent(n[i], n[1 - i]), vE(e, t));
}
function am(e, t, r, n, i, a, o) {
  GS(n, i, ke.estimate, t, !1, o);
  var s = [0, 0, 0, 0];
  (u(0), u(1), f(n, 0, NaN), f(n, 1, NaN));
  var l =
    ib(s, function (c) {
      return c > 0;
    }) == null;
  return (Gs(n, s, !0, !0, r), VS(i, n), l);
  function u(c) {
    I(i[Sn[c]], function (v) {
      if (Va(v.model)) {
        var d = a.ensureRecord(v.model),
          p = d.labelInfoList;
        if (p)
          for (var m = 0; m < p.length; m++) {
            var g = p[m],
              y = v.scale.normalize(Ja(v.scale, Ai(g.label).labelInfo.tick));
            ((y = c === 1 ? 1 - y : y), f(g.rect, c, y), f(g.rect, 1 - c, NaN));
          }
        var _ = d.nameLayout;
        if (_) {
          var y = Di(d.nameLocation) ? 0.5 : NaN;
          (f(_.rect, c, y), f(_.rect, 1 - c, NaN));
        }
      }
    });
  }
  function f(c, v, d) {
    var p = e[Sn[v]] - c[Sn[v]],
      m = c[Ea[v]] + c[Sn[v]] - (e[Ea[v]] + e[Sn[v]]);
    ((p = h(p, 1 - d)), (m = h(m, d)));
    var g = tm[v][0],
      y = tm[v][1];
    ((s[g] = ht(s[g], p)), (s[y] = ht(s[y], m)));
  }
  function h(c, v) {
    return (c > 0 && !Ma(v) && v > 1e-4 && (c /= v), c);
  }
}
function dE(e, t, r, n, i) {
  var a = new IS(gE);
  return (
    I(r, function (o) {
      return I(o, function (s) {
        if (Va(s.model)) {
          var l = !n;
          s.axisBuilder = w2(e, t, s.model, i, a, l);
        }
      });
    }),
    a
  );
}
function GS(e, t, r, n, i, a) {
  var o = r === ke.determine;
  I(t, function (u) {
    return I(u, function (f) {
      Va(f.model) &&
        (T2(f.axisBuilder, e, f.model),
        f.axisBuilder.build(o ? { axisTickLabelDetermine: !0 } : { axisTickLabelEstimate: !0 }, { noPxChange: i }));
    });
  });
  var s = { x: 0, y: 0 };
  (l(0), l(1));
  function l(u) {
    s[Sn[1 - u]] = e[Ea[u]] <= a.refContainer[Ea[u]] * 0.5 ? 0 : 1 - u === 1 ? 2 : 1;
  }
  I(t, function (u, f) {
    return I(u, function (h) {
      Va(h.model) &&
        ((n === "all" || o) && h.axisBuilder.build({ axisName: !0 }, { nameMarginLevel: s[f] }),
        o && h.axisBuilder.build({ axisLine: !0 }));
    });
  });
}
function pE(e, t, r) {
  var n,
    i = e.get("outerBoundsMode", !0);
  i === "same"
    ? (n = t.clone())
    : (i == null || i === "auto") && (n = bi(e.get("outerBounds", !0) || kS, r.refContainer));
  var a = e.get("outerBoundsContain", !0),
    o;
  a == null || a === "auto" || vt(["all", "axisLabel"], a) < 0 ? (o = "all") : (o = a);
  var s = [
    Yf(q(e.get("outerBoundsClampWidth", !0), ol[0]), t.width),
    Yf(q(e.get("outerBoundsClampHeight", !0), ol[1]), t.height),
  ];
  return { outerBoundsRect: n, parsedOuterBoundsContain: o, outerBoundsClamp: s };
}
var gE = function (e, t, r, n, i, a) {
  var o = r.axis.dim === "x" ? "y" : "x";
  (LS(e, t, r, n, i, a),
    Di(e.nameLocation) ||
      I(t.recordMap[o], function (s) {
        s && s.labelInfoList && s.dirVec && ES(s.labelInfoList, s.dirVec, n, i);
      }));
};
function mE(e, t) {
  var r = { axesInfo: {}, seriesInvolved: !1, coordSysAxesInfo: {}, coordSysMap: {} };
  return (yE(r, e, t), r.seriesInvolved && SE(r, e), r);
}
function yE(e, t, r) {
  var n = t.getComponent("tooltip"),
    i = t.getComponent("axisPointer"),
    a = i.get("link", !0) || [],
    o = [];
  I(r.getCoordinateSystems(), function (s) {
    if (!s.axisPointerEnabled) return;
    var l = Ga(s.model),
      u = (e.coordSysAxesInfo[l] = {});
    e.coordSysMap[l] = s;
    var f = s.model,
      h = f.getModel("tooltip", n);
    if ((I(s.getAxes(), Rt(p, !1, null)), s.getTooltipAxes && n && h.get("show"))) {
      var c = h.get("trigger") === "axis",
        v = h.get(["axisPointer", "type"]) === "cross",
        d = s.getTooltipAxes(h.get(["axisPointer", "axis"]));
      ((c || v) && I(d.baseAxes, Rt(p, v ? "cross" : !0, c)), v && I(d.otherAxes, Rt(p, "cross", !1)));
    }
    function p(m, g, y) {
      var _ = y.model.getModel("axisPointer", i),
        S = _.get("show");
      if (!(!S || (S === "auto" && !m && !Bh(_)))) {
        (g == null && (g = _.get("triggerTooltip")), (_ = m ? _E(y, h, i, t, m, g) : _));
        var b = _.get("snap"),
          w = _.get("triggerEmphasis"),
          T = Ga(y.model),
          C = g || b || y.type === "category",
          A = (e.axesInfo[T] = {
            key: T,
            axis: y,
            coordSys: s,
            axisPointerModel: _,
            triggerTooltip: g,
            triggerEmphasis: w,
            involveSeries: C,
            snap: b,
            useHandle: Bh(_),
            seriesModels: [],
            linkGroup: null,
          });
        ((u[T] = A), (e.seriesInvolved = e.seriesInvolved || C));
        var M = bE(a, y);
        if (M != null) {
          var D = o[M] || (o[M] = { axesInfo: {} });
          ((D.axesInfo[T] = A), (D.mapper = a[M].mapper), (A.linkGroup = D));
        }
      }
    }
  });
}
function _E(e, t, r, n, i, a) {
  var o = t.getModel("axisPointer"),
    s = [
      "type",
      "snap",
      "lineStyle",
      "shadowStyle",
      "label",
      "animation",
      "animationDurationUpdate",
      "animationEasingUpdate",
      "z",
    ],
    l = {};
  (I(s, function (c) {
    l[c] = ot(o.get(c));
  }),
    (l.snap = e.type !== "category" && !!a),
    o.get("type") === "cross" && (l.type = "line"));
  var u = l.label || (l.label = {});
  if ((u.show == null && (u.show = !1), i === "cross")) {
    var f = o.get(["label", "show"]);
    if (((u.show = f ?? !0), !a)) {
      var h = (l.lineStyle = o.get("crossStyle"));
      h && mt(u, h.textStyle);
    }
  }
  return e.model.getModel("axisPointer", new Ct(l, r, n));
}
function SE(e, t) {
  t.eachSeries(function (r) {
    var n = r.coordinateSystem,
      i = r.get(["tooltip", "trigger"], !0),
      a = r.get(["tooltip", "show"], !0);
    !n ||
      !n.model ||
      i === "none" ||
      i === !1 ||
      i === "item" ||
      a === !1 ||
      r.get(["axisPointer", "show"], !0) === !1 ||
      I(e.coordSysAxesInfo[Ga(n.model)], function (o) {
        var s = o.axis;
        n.getAxis(s.dim) === s &&
          (o.seriesModels.push(r),
          o.seriesDataCount == null && (o.seriesDataCount = 0),
          (o.seriesDataCount += r.getData().count()));
      });
  });
}
function bE(e, t) {
  for (var r = t.model, n = t.dim, i = 0; i < e.length; i++) {
    var a = e[i] || {};
    if (uf(a[n + "AxisId"], r.id) || uf(a[n + "AxisIndex"], r.componentIndex) || uf(a[n + "AxisName"], r.name))
      return i;
  }
}
function uf(e, t) {
  return e === "all" || (U(e) && vt(e, t) >= 0) || e === t;
}
function wE(e) {
  var t = pv(e);
  if (t) {
    var r = t.axisPointerModel,
      n = t.axis.scale,
      i = r.option,
      a = r.get("status"),
      o = r.get("value");
    o != null && (o = n.parse(o));
    var s = Bh(r);
    a == null && (i.status = s ? "show" : "hide");
    var l = n.getExtent();
    ((o == null || o > l[1]) && (o = l[1]),
      o < l[0] && (o = l[0]),
      (i.value = o),
      s && (i.status = t.axis.scale.isBlank() ? "hide" : "show"));
  }
}
function pv(e) {
  var t = (e.ecModel.getComponent("axisPointer") || {}).coordSysAxesInfo;
  return t && t.axesInfo[Ga(e)];
}
function TE(e) {
  var t = pv(e);
  return t && t.axisPointerModel;
}
function Bh(e) {
  return !!e.get(["handle", "show"]);
}
function Ga(e) {
  return e.type + "||" + e.id;
}
var om = {},
  US = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), r);
    }
    return (
      (t.prototype.render = function (r, n, i, a) {
        (this.axisPointerClass && wE(r),
          e.prototype.render.apply(this, arguments),
          this._doUpdateAxisPointerClass(r, i, !0));
      }),
      (t.prototype.updateAxisPointer = function (r, n, i, a) {
        this._doUpdateAxisPointerClass(r, i, !1);
      }),
      (t.prototype.remove = function (r, n) {
        var i = this._axisPointer;
        i && i.remove(n);
      }),
      (t.prototype.dispose = function (r, n) {
        (this._disposeAxisPointer(n), e.prototype.dispose.apply(this, arguments));
      }),
      (t.prototype._doUpdateAxisPointerClass = function (r, n, i) {
        var a = t.getAxisPointerClass(this.axisPointerClass);
        if (a) {
          var o = TE(r);
          o ? (this._axisPointer || (this._axisPointer = new a())).render(r, o, n, i) : this._disposeAxisPointer(n);
        }
      }),
      (t.prototype._disposeAxisPointer = function (r) {
        (this._axisPointer && this._axisPointer.dispose(r), (this._axisPointer = null));
      }),
      (t.registerAxisPointerClass = function (r, n) {
        om[r] = n;
      }),
      (t.getAxisPointerClass = function (r) {
        return r && om[r];
      }),
      (t.type = "axis"),
      t
    );
  })(Oe),
  Nh = St();
function xE(e, t, r, n) {
  var i = r.axis;
  if (!i.scale.isBlank()) {
    var a = r.getModel("splitArea"),
      o = a.getModel("areaStyle"),
      s = o.get("color"),
      l = n.coordinateSystem.getRect(),
      u = i.getTicksCoords({ tickModel: a, breakTicks: "none", pruneByBreak: "preserve_extent_bound" });
    if (u.length) {
      var f = s.length,
        h = Nh(e).splitAreaColors,
        c = Q(),
        v = 0;
      if (h)
        for (var d = 0; d < u.length; d++) {
          var p = h.get(u[d].tickValue);
          if (p != null) {
            v = (p + (f - 1) * d) % f;
            break;
          }
        }
      var m = i.toGlobalCoord(u[0].coord),
        g = o.getAreaStyle();
      s = U(s) ? s : [s];
      for (var d = 1; d < u.length; d++) {
        var y = i.toGlobalCoord(u[d].coord),
          _ = void 0,
          S = void 0,
          b = void 0,
          w = void 0;
        i.isHorizontal()
          ? ((_ = m), (S = l.y), (b = y - _), (w = l.height), (m = _ + b))
          : ((_ = l.x), (S = m), (b = l.width), (w = y - S), (m = S + w));
        var T = u[d - 1].tickValue;
        (T != null && c.set(T, v),
          t.add(
            new Mt({
              anid: T != null ? "area_" + T : null,
              shape: { x: _, y: S, width: b, height: w },
              style: mt({ fill: s[v] }, g),
              autoBatch: !0,
              silent: !0,
            }),
          ),
          (v = (v + 1) % f));
      }
      Nh(e).splitAreaColors = c;
    }
  }
}
function CE(e) {
  Nh(e).splitAreaColors = null;
}
var DE = ["splitArea", "splitLine", "minorSplitLine", "breakArea"],
  WS = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), (r.axisPointerClass = "CartesianAxisPointer"), r);
    }
    return (
      (t.prototype.render = function (r, n, i, a) {
        this.group.removeAll();
        var o = this._axisGroup;
        if (((this._axisGroup = new Bt()), this.group.add(this._axisGroup), !!Va(r))) {
          (this._axisGroup.add(r.axis.axisBuilder.group),
            I(
              DE,
              function (l) {
                r.get([l, "show"]) && AE[l](this, this._axisGroup, r, r.getCoordSysModel(), i);
              },
              this,
            ));
          var s = a && a.type === "changeAxisOrder" && a.isInitSort;
          (s || o0(o, this._axisGroup, r), e.prototype.render.call(this, r, n, i, a));
        }
      }),
      (t.prototype.remove = function () {
        CE(this);
      }),
      (t.type = "cartesianAxis"),
      t
    );
  })(US),
  AE = {
    splitLine: function (e, t, r, n, i) {
      var a = r.axis;
      if (!a.scale.isBlank()) {
        var o = r.getModel("splitLine"),
          s = o.getModel("lineStyle"),
          l = s.get("color"),
          u = o.get("showMinLine") !== !1,
          f = o.get("showMaxLine") !== !1;
        l = U(l) ? l : [l];
        for (
          var h = n.coordinateSystem.getRect(),
            c = a.isHorizontal(),
            v = 0,
            d = a.getTicksCoords({ tickModel: o, breakTicks: "none", pruneByBreak: "preserve_extent_bound" }),
            p = [],
            m = [],
            g = s.getLineStyle(),
            y = 0;
          y < d.length;
          y++
        ) {
          var _ = a.toGlobalCoord(d[y].coord);
          if (!((y === 0 && !u) || (y === d.length - 1 && !f))) {
            var S = d[y].tickValue;
            c
              ? ((p[0] = _), (p[1] = h.y), (m[0] = _), (m[1] = h.y + h.height))
              : ((p[0] = h.x), (p[1] = _), (m[0] = h.x + h.width), (m[1] = _));
            var b = v++ % l.length,
              w = new Fr({
                anid: S != null ? "line_" + S : null,
                autoBatch: !0,
                shape: { x1: p[0], y1: p[1], x2: m[0], y2: m[1] },
                style: mt({ stroke: l[b] }, g),
                silent: !0,
              });
            (Ra(w.shape, g.lineWidth), t.add(w));
          }
        }
      }
    },
    minorSplitLine: function (e, t, r, n, i) {
      var a = r.axis,
        o = r.getModel("minorSplitLine"),
        s = o.getModel("lineStyle"),
        l = n.coordinateSystem.getRect(),
        u = a.isHorizontal(),
        f = a.getMinorTicksCoords();
      if (f.length)
        for (var h = [], c = [], v = s.getLineStyle(), d = 0; d < f.length; d++)
          for (var p = 0; p < f[d].length; p++) {
            var m = a.toGlobalCoord(f[d][p].coord);
            u
              ? ((h[0] = m), (h[1] = l.y), (c[0] = m), (c[1] = l.y + l.height))
              : ((h[0] = l.x), (h[1] = m), (c[0] = l.x + l.width), (c[1] = m));
            var g = new Fr({
              anid: "minor_line_" + f[d][p].tickValue,
              autoBatch: !0,
              shape: { x1: h[0], y1: h[1], x2: c[0], y2: c[1] },
              style: v,
              silent: !0,
            });
            (Ra(g.shape, v.lineWidth), t.add(g));
          }
    },
    splitArea: function (e, t, r, n, i) {
      xE(e, t, r, n);
    },
    breakArea: function (e, t, r, n, i) {
      r.axis.scale;
    },
  },
  YS = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), r);
    }
    return ((t.type = "xAxis"), t);
  })(WS),
  ME = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = YS.type), r);
    }
    return ((t.type = "yAxis"), t);
  })(WS),
  IE = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = "grid"), r);
    }
    return (
      (t.prototype.render = function (r, n) {
        (this.group.removeAll(),
          r.get("show") &&
            this.group.add(
              new Mt({
                shape: r.coordinateSystem.getRect(),
                style: mt({ fill: r.get("backgroundColor") }, r.getItemStyle()),
                silent: !0,
                z2: -1,
              }),
            ));
      }),
      (t.type = "grid"),
      t
    );
  })(Oe),
  sm = { offset: 0 };
function LE(e) {
  (e.registerComponentView(IE),
    e.registerComponentModel(L2),
    e.registerCoordinateSystem("cartesian2d", fE),
    Qg(e, "x", kh, sm),
    Qg(e, "y", kh, sm),
    e.registerComponentView(YS),
    e.registerComponentView(ME),
    e.registerPreprocessor(function (t) {
      t.xAxis && t.yAxis && !t.grid && (t.grid = {});
    }));
}
function lm(e, t, r) {
  var n = fe.createCanvas(),
    i = t.getWidth(),
    a = t.getHeight(),
    o = n.style;
  return (
    o &&
      ((o.position = "absolute"),
      (o.left = "0"),
      (o.top = "0"),
      (o.width = i + "px"),
      (o.height = a + "px"),
      n.setAttribute("data-zr-dom-id", e)),
    (n.width = i * r),
    (n.height = a * r),
    n
  );
}
function ff(e) {
  return !e.__cursors.get(Jy);
}
function um(e) {
  var t = e.__cursors.get(Jy);
  return { startIdx: t ? t.startIdx : 0, endIdx: t ? t.endIdx : 0 };
}
var XS = (function (e) {
    V(t, e);
    function t(r, n, i) {
      var a = e.call(this) || this;
      ((a.motionBlur = !1),
        (a.lastFrameAlpha = 0.7),
        (a.dpr = 1),
        (a.virtual = !1),
        (a.config = {}),
        (a.zlevel = 0),
        (a.zlevel2 = fs),
        (a.maxRepaintRectCount = 5),
        (a.__dirty = !0),
        (a.__firstTimePaint = !0),
        (a.__prevIdx = { startIdx: 0, endIdx: 0 }));
      var o;
      ((i = i || Ls),
        typeof r == "string" ? (o = lm(r, n, i)) : Z(r) && ((o = r), (r = o.id)),
        (a.id = r),
        (a.dom = o));
      var s = o.style;
      return (
        s &&
          (zm(o),
          (o.onselectstart = function () {
            return !1;
          }),
          (s.padding = "0"),
          (s.margin = "0"),
          (s.borderWidth = "0")),
        (a.painter = n),
        (a.dpr = i),
        a
      );
    }
    return (
      (t.prototype.afterBrush = function () {
        this.__prevIdx = um(this);
      }),
      (t.prototype.initContext = function () {
        ((this.ctx = this.dom.getContext("2d")), (this.ctx.dpr = this.dpr));
      }),
      (t.prototype.setUnpainted = function () {
        this.__firstTimePaint = !0;
      }),
      (t.prototype.createBackBuffer = function () {
        var r = this.dpr;
        ((this.domBack = lm("back-" + this.id, this.painter, r)),
          (this.ctxBack = this.domBack.getContext("2d")),
          r !== 1 && this.ctxBack.scale(r, r));
      }),
      (t.prototype.createRepaintRects = function (r, n, i, a) {
        if (this.__firstTimePaint) return ((this.__firstTimePaint = !1), null);
        var o = [],
          s = this.maxRepaintRectCount,
          l = !1,
          u = new J(0, 0, 0, 0);
        function f(S) {
          if (!(!S.isFinite() || S.isZero()))
            if (o.length === 0) {
              var b = new J(0, 0, 0, 0);
              (b.copy(S), o.push(b));
            } else {
              for (var w = !1, T = 1 / 0, C = 0, A = 0; A < o.length; ++A) {
                var M = o[A];
                if (M.intersect(S)) {
                  var D = new J(0, 0, 0, 0);
                  (D.copy(M), D.union(S), (o[A] = D), (w = !0));
                  break;
                } else if (l) {
                  (u.copy(S), u.union(M));
                  var P = S.width * S.height,
                    x = M.width * M.height,
                    L = u.width * u.height,
                    E = L - P - x;
                  E < T && ((T = E), (C = A));
                }
              }
              if ((l && (o[C].union(S), (w = !0)), !w)) {
                var b = new J(0, 0, 0, 0);
                (b.copy(S), o.push(b));
              }
              l || (l = o.length >= s);
            }
        }
        for (var h = um(this), c = h.startIdx; c < h.endIdx; ++c) {
          var v = r[c];
          if (v) {
            var d = v.shouldBePainted(i, a, !0, !0),
              p = v.__isRendered && (v.__dirty & ie || !d) ? v.getPrevPaintRect() : null;
            p && f(p);
            var m = d && (v.__dirty & ie || !v.__isRendered) ? v.getPaintRect() : null;
            m && f(m);
          }
        }
        for (var g = this.__prevIdx, c = g.startIdx; c < g.endIdx; ++c) {
          var v = n[c],
            d = v && v.shouldBePainted(i, a, !0, !0);
          if (v && (!d || !v.__zr) && v.__isRendered) {
            var p = v.getPrevPaintRect();
            p && f(p);
          }
        }
        var y;
        do {
          y = !1;
          for (var c = 0; c < o.length; ) {
            if (o[c].isZero()) {
              o.splice(c, 1);
              continue;
            }
            for (var _ = c + 1; _ < o.length; )
              o[c].intersect(o[_]) ? ((y = !0), o[c].union(o[_]), o.splice(_, 1)) : _++;
            c++;
          }
        } while (y);
        return ((this._paintRects = o), o);
      }),
      (t.prototype.debugGetPaintRects = function () {
        return (this._paintRects || []).slice();
      }),
      (t.prototype.resize = function (r, n) {
        var i = this.dpr,
          a = this.dom,
          o = a.style,
          s = this.domBack;
        (o && ((o.width = r + "px"), (o.height = n + "px")),
          (a.width = r * i),
          (a.height = n * i),
          s && ((s.width = r * i), (s.height = n * i), i !== 1 && this.ctxBack.scale(i, i)));
      }),
      (t.prototype.clear = function (r, n, i) {
        var a = this.dom,
          o = this.ctx,
          s = a.width,
          l = a.height;
        n = n || this.clearColor;
        var u = this.motionBlur && !r,
          f = this.lastFrameAlpha,
          h = this.dpr,
          c = this;
        u &&
          (this.domBack || this.createBackBuffer(),
          (this.ctxBack.globalCompositeOperation = "copy"),
          this.ctxBack.drawImage(a, 0, 0, s / h, l / h));
        var v = this.domBack;
        function d(p, m, g, y) {
          if ((o.clearRect(p, m, g, y), n && n !== "transparent")) {
            var _ = void 0;
            if (ll(n)) {
              var S = n.global || (n.__width === g && n.__height === y);
              ((_ = (S && n.__canvasGradient) || mh(o, n, { x: 0, y: 0, width: g, height: y })),
                (n.__canvasGradient = _),
                (n.__width = g),
                (n.__height = y));
            } else
              ob(n) &&
                ((n.scaleX = n.scaleX || h),
                (n.scaleY = n.scaleY || h),
                (_ = yh(o, n, {
                  dirty: function () {
                    (c.setUnpainted(), c.painter.refresh());
                  },
                })));
            (o.save(), (o.fillStyle = _ || n), o.fillRect(p, m, g, y), o.restore());
          }
          u && (o.save(), (o.globalAlpha = f), o.drawImage(v, p, m, g, y), o.restore());
        }
        !i || u
          ? d(0, 0, s, l)
          : i.length &&
            I(i, function (p) {
              d(p.x * h, p.y * h, p.width * h, p.height * h);
            });
      }),
      t
    );
  })(nr),
  fm = 1e5,
  _n = 314159,
  hf = void 0,
  PE = 1,
  cf = 2;
function EE(e) {
  return e ? (e.__builtin__ ? !0 : !(typeof e.resize != "function" || typeof e.refresh != "function")) : !1;
}
function RE(e, t) {
  var r = document.createElement("div");
  return (
    (r.style.cssText =
      ["position:relative", "width:" + e + "px", "height:" + t + "px", "padding:0", "margin:0", "border-width:0"].join(
        ";",
      ) + ";"),
    r
  );
}
function hm(e, t, r, n) {
  var i = new XS(e, t, t.dpr);
  return ((i.zlevel = r), (i.zlevel2 = n), (i.__builtin__ = !0), $S(i), i);
}
function $S(e) {
  ((e.__cursorStack = []), (e.__cursors = Q()));
}
function OE(e) {
  return (
    (e.startIdx = e.drawIdx = e.endIdx = e.endIdxNew = 0),
    (e.used = !1),
    (e.first = e.last = NaN),
    (e.notClearIdx = -1),
    e
  );
}
function kE(e, t) {
  var r = e.__cursors,
    n = +t;
  return r.get(n) || (e.__cursorStack.push(n), r.set(n, OE({ key: n })));
}
function Ko(e, t) {
  for (var r = e.__cursorStack, n = 0; n < r.length; n++) t(e.__cursors.get(r[n]));
}
function vf(e, t) {
  var r = e.layers;
  return r[t] || (r[t] = new Array(3));
}
function zt(e, t, r) {
  for (var n = e.layerStack, i = 0; i < n.length; i++) {
    var a = n[i].zl,
      o = n[i].zl2,
      s = e.layers[a][o];
    (!r || ((!(r & Ca) || s.__builtin__) && (!(r & Fh) || !s.__builtin__) && (!(r & ZS) || s !== e.hoverlayer))) &&
      t(s, a, o, i);
  }
}
var Ca = 1,
  Fh = 2,
  ZS = 4,
  Qo = Ca | ZS,
  BE = (function () {
    function e(t, r, n, i) {
      ((this.type = "canvas"),
        (this._prevDisplayList = []),
        (this._layerConfig = {}),
        (this._needsManuallyCompositing = !1),
        (this.type = "canvas"),
        (this._i = { layerStack: [], layers: [] }));
      var a = !t.nodeName || t.nodeName.toUpperCase() === "CANVAS";
      ((this._opts = n = N({}, n || {})),
        (this.dpr = n.devicePixelRatio || Ls),
        (this._singleCanvas = a),
        (this.root = t));
      var o = t.style;
      if ((o && (zm(t), (t.innerHTML = "")), (this.storage = r), (this._prevDisplayList = []), a)) {
        var l = t,
          u = l.width,
          f = l.height;
        (n.width != null && (u = n.width),
          n.height != null && (f = n.height),
          (this.dpr = n.devicePixelRatio || 1),
          (l.width = u * this.dpr),
          (l.height = f * this.dpr),
          (this._width = u),
          (this._height = f));
        var h = hm(l, this, _n, fs);
        (h.initContext(), this._insertLayer(h, _n, fs, !0), (this._domRoot = t));
      } else {
        ((this._width = Oo(t, 0, n)), (this._height = Oo(t, 1, n)));
        var s = (this._domRoot = RE(this._width, this._height));
        t.appendChild(s);
      }
    }
    return (
      (e.prototype.getType = function () {
        return "canvas";
      }),
      (e.prototype.isSingleCanvas = function () {
        return this._singleCanvas;
      }),
      (e.prototype.getViewportRoot = function () {
        return this._domRoot;
      }),
      (e.prototype.getViewportRootOffset = function () {
        var t = this.getViewportRoot();
        if (t) return { offsetLeft: t.offsetLeft || 0, offsetTop: t.offsetTop || 0 };
      }),
      (e.prototype.refresh = function (t) {
        var r;
        t && !Z(t) ? (r = { paintAll: !!t }) : (r = t || {});
        var n = q(r.refresh, !0),
          i = q(r.refreshHover, !1);
        if ((i && (this._hoverLayerDirty = cf), !n))
          return (i && this._paintHoverList(this.storage.getDisplayList(!1)), this);
        var a = this.storage.getDisplayList(!0);
        (this._updateLayerStatus(a, r.paintAll), (this._redrawId = Math.random()));
        var o = this._prevDisplayList;
        this._paintList(a, o, this._redrawId);
        var s = this._backgroundColor;
        return (
          zt(
            this._i,
            function (l, u, f, h) {
              l.refresh && l.refresh(h === 0 ? s : null);
            },
            Fh,
          ),
          this._opts.useDirtyRect && (this._prevDisplayList = a.slice()),
          this
        );
      }),
      (e.prototype._paintHoverList = function (t) {
        var r = this._i.hoverlayer,
          n = this._hoverLayerDirty;
        if (
          ((this._hoverLayerDirty = hf),
          n !== hf && (!r && n === cf && (r = this._i.hoverlayer = this._ensureLayer(fm)), !!r))
        ) {
          r.clear();
          for (
            var i = { inHover: !0, viewWidth: this._width, viewHeight: this._height, beforeBrushParam: {} },
              a,
              o = 0,
              s = t.length;
            o < s;
            o++
          ) {
            var l = t[o];
            if (l.__inHover) {
              a || ((a = r.ctx), a.save());
              var u = l.__hoverStyle,
                f = void 0;
              (u && ((f = l.style), (l.style = u)), Cn(a, l, i), u && (l.style = f));
            }
          }
          a && (di(a, i), a.restore());
        }
      }),
      (e.prototype.getHoverLayer = function () {
        return this._ensureLayer(fm);
      }),
      (e.prototype.paintOne = function (t, r) {
        d_(t, r);
      }),
      (e.prototype._paintList = function (t, r, n) {
        if (this._redrawId === n) {
          var i = this._doPaintList(t, r);
          if ((this._needsManuallyCompositing && this._compositeManually(), i))
            (zt(
              this._i,
              function (o) {
                o.afterBrush && o.afterBrush();
              },
              Qo,
            ),
              this._paintHoverList(t));
          else {
            var a = this;
            xs(function () {
              a._paintList(t, r, n);
            });
          }
        }
      }),
      (e.prototype._compositeManually = function () {
        var t = this._ensureLayer(_n).ctx,
          r = this._domRoot.width,
          n = this._domRoot.height;
        (t.clearRect(0, 0, r, n),
          zt(
            this._i,
            function (i) {
              i.virtual && t.drawImage(i.dom, 0, 0, r, n);
            },
            Ca,
          ));
      }),
      (e.prototype._doPaintList = function (t, r) {
        var n = this,
          i = !0;
        return (
          zt(
            this._i,
            function (a) {
              var o = !1;
              if (
                (Ko(a, function (h) {
                  (h.drawIdx < h.endIdx || h.notClearIdx >= 0) && (o = !0);
                }),
                !(!o && !a.__dirty))
              ) {
                var s = n._opts.useDirtyRect && !ff(a) ? a.createRepaintRects(t, r, n._width, n._height) : null,
                  l = n._i.layerStack[0],
                  u = !0;
                if (a.__dirty) {
                  ((u = !1), (a.__dirty = !1));
                  var f = a.zlevel === l.zl && a.zlevel2 === l.zl2 ? n._backgroundColor : null;
                  a.clear(!1, f, s);
                }
                Ko(a, function (h) {
                  var c = n._paintPerCursor(a, h, t, s, u);
                  i = i && c;
                });
              }
            },
            Qo,
          ),
          nt.wxa &&
            zt(this._i, function (a) {
              a && a.ctx && a.ctx.draw && a.ctx.draw();
            }),
          i
        );
      }),
      (e.prototype._paintPerCursor = function (t, r, n, i, a) {
        var o = t.ctx;
        if (i)
          if (!i.length) r.drawIdx = r.endIdx;
          else
            for (var s = this.dpr, l = 0; l < i.length; ++l) {
              var u = i[l];
              (o.save(),
                o.beginPath(),
                o.rect(u.x * s, u.y * s, u.width * s, u.height * s),
                o.clip(),
                this._paintPerCursorInRect(t, r, n, u, a),
                o.restore());
            }
        else (o.save(), this._paintPerCursorInRect(t, r, n, null, a), o.restore());
        return r.drawIdx >= r.endIdx;
      }),
      (e.prototype._paintPerCursorInRect = function (t, r, n, i, a) {
        for (
          var o = {
              inHover: !1,
              allClipped: !1,
              prevEl: null,
              viewWidth: this._width,
              viewHeight: this._height,
              beforeBrushParam: { contentRetained: a },
            },
            s = t.ctx,
            l = ff(t),
            u = l && fe.getTime(),
            f = r.drawIdx,
            h = r.notClearIdx,
            c = h >= 0 ? Math.min(h, f) : f;
          c < r.endIdx;
          c++
        ) {
          var v = n[c];
          if (!(c < f && !v.notClear)) {
            if ((v.__inHover && (this._hoverLayerDirty = cf), i != null)) {
              var d = v.getPaintRect();
              d && d.intersect(i) && (Cn(s, v, o), v.setPrevPaintRect(d));
            } else Cn(s, v, o);
            if (l) {
              var p = fe.getTime() - u;
              if (p > 15) {
                c++;
                break;
              }
            }
          }
        }
        (di(s, o), (r.drawIdx = Math.max(c, f)));
      }),
      (e.prototype.getLayer = function (t, r) {
        return this._ensureLayer(t, 0, r);
      }),
      (e.prototype._ensureLayer = function (t, r, n) {
        r = r || 0;
        var i = this._singleCanvas;
        i && !this._needsManuallyCompositing && ((t = _n), (r = 0));
        var a = vf(this._i, t)[r];
        return (
          a ||
            ((a = hm("zr_" + t + "." + r, this, t, r)),
            this._layerConfig[t] && pt(a, this._layerConfig[t], !0),
            (n || (i && t !== _n)) && (a.virtual = !0),
            this._insertLayer(a, t, r, !1),
            a.initContext()),
          a
        );
      }),
      (e.prototype.insertLayer = function (t, r) {
        this._insertLayer(r, t, 0, !1);
      }),
      (e.prototype._insertLayer = function (t, r, n, i) {
        var a = this._i,
          o = a.layers,
          s = a.layerStack,
          l = this._domRoot,
          u = null;
        if (!(o[r] && o[r][n]) && EE(t)) {
          for (var f = s.length, h = 0; h < f && (s[h].zl < r || (s[h].zl === r && s[h].zl2 < n)); ) h++;
          if (
            (h > 0 && (u = vf(a, s[h - 1].zl)[s[h - 1].zl2]),
            s.splice(h, 0, { zl: r, zl2: n }),
            (vf(a, r)[n] = t),
            !i && !t.virtual)
          )
            if (u) {
              var c = u.dom;
              c.nextSibling ? l.insertBefore(t.dom, c.nextSibling) : l.appendChild(t.dom);
            } else l.firstChild ? l.insertBefore(t.dom, l.firstChild) : l.appendChild(t.dom);
          t.painter || (t.painter = this);
        }
      }),
      (e.prototype.eachLayer = function (t, r) {
        return zt(this._i, function (n, i) {
          t.call(r, n, i);
        });
      }),
      (e.prototype.eachBuiltinLayer = function (t, r) {
        return zt(
          this._i,
          function (n, i) {
            t.call(r, n, i);
          },
          Ca,
        );
      }),
      (e.prototype.eachOtherLayer = function (t, r) {
        return zt(
          this._i,
          function (n, i) {
            t.call(r, n, i);
          },
          Fh,
        );
      }),
      (e.prototype.getLayers = function () {
        var t = {};
        return (
          zt(this._i, function (r, n, i) {
            t[r.id] = r;
          }),
          t
        );
      }),
      (e.prototype._updateLayerStatus = function (t, r) {
        var n = this;
        if (n._singleCanvas)
          for (var i = 1; i < t.length; i++) {
            var a = t[i];
            if (a.zlevel !== t[i - 1].zlevel || a.incremental) {
              n._needsManuallyCompositing = !0;
              break;
            }
          }
        zt(
          n._i,
          function (m) {
            ((m.__dirty = !1),
              Ko(m, function (g) {
                ((g.used = !1), (g.endIdxNew = 0), (g.notClearIdx = -1));
              }));
          },
          Qo,
        );
        for (var o, s = null, l = null, u = !1, f = 0, h = t.length; f < h; f++) {
          var a = t[f],
            c = a.zlevel,
            v = a.incremental,
            d = void 0;
          if (
            (o !== c && ((o = c), (u = !1)),
            v ? ((u = !0), (d = cC)) : (d = u ? hC : fs),
            (!s || c !== s.zlevel || d !== s.zlevel2) && ((s = n._ensureLayer(c, d)), (l = null), !s.__builtin__))
          ) {
            Zh("ZLevel " + c + " has been used by unknown layer " + s.id);
            continue;
          }
          if ((!l || v !== l.key) && ((l = kE(s, v)), !l.used))
            if (((l.used = !0), !r && l.first === a.id)) {
              var p = f - l.startIdx;
              ((l.startIdx = f), (l.drawIdx += p), (l.endIdx += p));
            } else ((s.__dirty = !0), (l.first = a.id), (l.startIdx = l.drawIdx = f), (l.endIdx = f + 1));
          ((l.endIdxNew = f + 1),
            a.__dirty & ie &&
              !a.__inHover &&
              ((!v || (!a.notClear && f < l.drawIdx)) && (s.__dirty = !0),
              v && a.notClear && l.notClearIdx < 0 && (l.notClearIdx = f)));
        }
        zt(
          n._i,
          function (m) {
            for (var g = m.__cursorStack, y = m.__cursors, _ = g.length - 1; _ >= 0; _--) {
              var S = y.get(g[_]);
              if (!S.used) ((m.__dirty = !0), y.removeKey(g[_]), g.splice(_, 1));
              else {
                var b = S.endIdxNew;
                ((ff(m) ? b < S.drawIdx : b !== S.endIdx || !b || t[b - 1].id !== S.last) && (m.__dirty = !0),
                  (S.endIdx = S.endIdxNew),
                  (S.last = b ? t[b - 1].id : NaN));
              }
            }
            m.__dirty &&
              (Ko(m, function (w) {
                w.drawIdx = w.startIdx;
              }),
              n._hoverLayerDirty === hf && (n._hoverLayerDirty = PE));
          },
          Qo,
        );
      }),
      (e.prototype.clear = function () {
        return (
          zt(
            this._i,
            function (t) {
              (t.clear(), $S(t));
            },
            Ca,
          ),
          this
        );
      }),
      (e.prototype.setBackgroundColor = function (t) {
        ((this._backgroundColor = t),
          zt(this._i, function (r) {
            r.setUnpainted();
          }));
      }),
      (e.prototype.configLayer = function (t, r) {
        if (r) {
          var n = this._layerConfig;
          (n[t] ? pt(n[t], r, !0) : (n[t] = r),
            zt(this._i, function (i, a) {
              pt(i, n[a], !0);
            }));
        }
      }),
      (e.prototype.delLayer = function (t) {
        for (var r = this._i.layerStack, n = this._i.layers, i = r.length - 1; i >= 0; i--) {
          var a = r[i];
          if (a.zl === t) {
            var o = n[t][a.zl2];
            if (o.__builtin__) continue;
            if ((r.splice(i, 1), (n[t][a.zl2] = void 0), !o.virtual)) {
              var s = o.dom.parentNode;
              s && s.removeChild(o.dom);
            }
          }
        }
      }),
      (e.prototype.resize = function (t, r) {
        if (this._domRoot.style) {
          var n = this._domRoot;
          n.style.display = "none";
          var i = this._opts,
            a = this.root;
          (t != null && (i.width = t),
            r != null && (i.height = r),
            (t = Oo(a, 0, i)),
            (r = Oo(a, 1, i)),
            (n.style.display = ""),
            (this._width !== t || r !== this._height) &&
              ((n.style.width = t + "px"),
              (n.style.height = r + "px"),
              zt(this._i, function (o) {
                o.resize(t, r);
              }),
              this.refresh({ paintAll: !0 })),
            (this._width = t),
            (this._height = r));
        } else {
          if (t == null || r == null) return;
          ((this._width = t), (this._height = r), this._ensureLayer(_n).resize(t, r));
        }
        return this;
      }),
      (e.prototype.clearLayer = function (t) {
        I(this._i.layers[t], function (r) {
          r && !r.__builtin__ && r.clear();
        });
      }),
      (e.prototype.dispose = function () {
        ((this.root.innerHTML = ""), (this.root = this.storage = this._domRoot = this._i = null));
      }),
      (e.prototype.getRenderedCanvas = function (t) {
        if (((t = t || {}), this._singleCanvas && !this._compositeManually)) return this._i.layers[_n][0].dom;
        var r = new XS("image", this, t.pixelRatio || this.dpr);
        (r.initContext(), r.clear(!1, t.backgroundColor || this._backgroundColor));
        var n = r.ctx;
        if (t.pixelRatio <= this.dpr) {
          this.refresh();
          var i = r.dom.width,
            a = r.dom.height;
          zt(this._i, function (h) {
            h.__builtin__
              ? n.drawImage(h.dom, 0, 0, i, a)
              : h.renderToCanvas && (n.save(), h.renderToCanvas(n), n.restore());
          });
        } else {
          for (
            var o = { inHover: !1, viewWidth: this._width, viewHeight: this._height, beforeBrushParam: {} },
              s = this.storage.getDisplayList(!0),
              l = 0,
              u = s.length;
            l < u;
            l++
          ) {
            var f = s[l];
            Cn(n, f, o);
          }
          di(n, o);
        }
        return r.dom;
      }),
      (e.prototype.getWidth = function () {
        return this._width;
      }),
      (e.prototype.getHeight = function () {
        return this._height;
      }),
      e
    );
  })();
function NE(e) {
  e.registerPainter("canvas", BE);
}
var bn = St(),
  cm = ot,
  df = Tt,
  FE = (function () {
    function e() {
      ((this._dragging = !1), (this.animationThreshold = 15));
    }
    return (
      (e.prototype.render = function (t, r, n, i) {
        var a = r.get("value"),
          o = r.get("status");
        if (
          ((this._axisModel = t),
          (this._axisPointerModel = r),
          (this._api = n),
          !(!i && this._lastValue === a && this._lastStatus === o))
        ) {
          ((this._lastValue = a), (this._lastStatus = o));
          var s = this._group,
            l = this._handle;
          if (!o || o === "hide") {
            (s && s.hide(), l && l.hide());
            return;
          }
          (s && s.show(), l && l.show());
          var u = {};
          this.makeElOption(u, a, t, r, n);
          var f = u.graphicKey;
          (f !== this._lastGraphicKey && this.clear(n), (this._lastGraphicKey = f));
          var h = (this._moveAnimation = this.determineAnimation(t, r));
          if (!s)
            ((s = this._group = new Bt()),
              this.createPointerEl(s, u, t, r),
              this.createLabelEl(s, u, t, r),
              n.getZr().add(s));
          else {
            var c = Rt(vm, r, h);
            (this.updatePointerEl(s, u, c), this.updateLabelEl(s, u, c, r));
          }
          (pm(s, r, !0), this._renderHandle(a));
        }
      }),
      (e.prototype.remove = function (t) {
        this.clear(t);
      }),
      (e.prototype.dispose = function (t) {
        this.clear(t);
      }),
      (e.prototype.determineAnimation = function (t, r) {
        var n = r.get("animation"),
          i = t.axis,
          a = i.type === "category",
          o = r.get("snap");
        if (!o && !a) return !1;
        if (n === "auto" || n == null) {
          var s = this.animationThreshold;
          if (a && Ni(i).w > s) return !0;
          if (o) {
            var l = pv(t).seriesDataCount,
              u = i.getExtent();
            return Math.abs(u[0] - u[1]) / l > s;
          }
          return !1;
        }
        return n === !0;
      }),
      (e.prototype.makeElOption = function (t, r, n, i, a) {}),
      (e.prototype.createPointerEl = function (t, r, n, i) {
        var a = r.pointer;
        if (a) {
          var o = (bn(t).pointerEl = new kC[a.type](cm(r.pointer)));
          t.add(o);
        }
      }),
      (e.prototype.createLabelEl = function (t, r, n, i) {
        if (r.label) {
          var a = (bn(t).labelEl = new Wt(cm(r.label)));
          (t.add(a), dm(a, i));
        }
      }),
      (e.prototype.updatePointerEl = function (t, r, n) {
        var i = bn(t).pointerEl;
        i && r.pointer && (i.setStyle(r.pointer.style), n(i, { shape: r.pointer.shape }));
      }),
      (e.prototype.updateLabelEl = function (t, r, n, i) {
        var a = bn(t).labelEl;
        a && (a.setStyle(r.label.style), n(a, { x: r.label.x, y: r.label.y }), dm(a, i));
      }),
      (e.prototype._renderHandle = function (t) {
        if (!(this._dragging || !this.updateHandleTransform)) {
          var r = this._axisPointerModel,
            n = this._api.getZr(),
            i = this._handle,
            a = r.getModel("handle"),
            o = r.get("status");
          if (!a.get("show") || !o || o === "hide") {
            (i && n.remove(i), (this._handle = null));
            return;
          }
          var s;
          (this._handle ||
            ((s = !0),
            (i = this._handle =
              Cc(a.get("icon"), {
                cursor: "move",
                draggable: !0,
                onmousemove: function (u) {
                  Vm(u.event);
                },
                onmousedown: df(this._onHandleDragMove, this, 0, 0),
                drift: df(this._onHandleDragMove, this),
                ondragend: df(this._onHandleDragEnd, this),
              })),
            n.add(i)),
            pm(i, r, !1),
            i.setStyle(
              a.getItemStyle(null, [
                "color",
                "borderColor",
                "borderWidth",
                "opacity",
                "shadowColor",
                "shadowBlur",
                "shadowOffsetX",
                "shadowOffsetY",
              ]),
            ));
          var l = a.get("size");
          (U(l) || (l = [l, l]),
            (i.scaleX = l[0] / 2),
            (i.scaleY = l[1] / 2),
            e_(this, "_doDispatchAxisPointer", a.get("throttle") || 0, "fixRate"),
            this._moveHandleToValue(t, s));
        }
      }),
      (e.prototype._moveHandleToValue = function (t, r) {
        vm(
          this._axisPointerModel,
          !r && this._moveAnimation,
          this._handle,
          pf(this.getHandleTransform(t, this._axisModel, this._axisPointerModel)),
        );
      }),
      (e.prototype._onHandleDragMove = function (t, r) {
        var n = this._handle;
        if (n) {
          this._dragging = !0;
          var i = this.updateHandleTransform(pf(n), [t, r], this._axisModel, this._axisPointerModel);
          ((this._payloadInfo = i),
            n.stopAnimation(),
            n.attr(pf(i)),
            (bn(n).lastProp = null),
            this._doDispatchAxisPointer());
        }
      }),
      (e.prototype._doDispatchAxisPointer = function () {
        var t = this._handle;
        if (t) {
          var r = this._payloadInfo,
            n = this._axisModel;
          this._api.dispatchAction({
            type: "updateAxisPointer",
            x: r.cursorPoint[0],
            y: r.cursorPoint[1],
            tooltipOption: r.tooltipOption,
            axesInfo: [{ axisDim: n.axis.dim, axisIndex: n.componentIndex }],
          });
        }
      }),
      (e.prototype._onHandleDragEnd = function () {
        this._dragging = !1;
        var t = this._handle;
        if (t) {
          var r = this._axisPointerModel.get("value");
          (this._moveHandleToValue(r), this._api.dispatchAction({ type: "hideTip" }));
        }
      }),
      (e.prototype.clear = function (t) {
        ((this._lastValue = null), (this._lastStatus = null));
        var r = t.getZr(),
          n = this._group,
          i = this._handle;
        (r &&
          n &&
          ((this._lastGraphicKey = null),
          n && r.remove(n),
          i && r.remove(i),
          (this._group = null),
          (this._handle = null),
          (this._payloadInfo = null)),
          dh(this, "_doDispatchAxisPointer"));
      }),
      (e.prototype.doClear = function () {}),
      (e.prototype.buildLabel = function (t, r, n) {
        return ((n = n || 0), { x: t[n], y: t[1 - n], width: r[n], height: r[1 - n] });
      }),
      e
    );
  })();
function vm(e, t, r, n) {
  qS(bn(r).lastProp, n) || ((bn(r).lastProp = n), t ? he(r, n, e) : (r.stopAnimation(), r.attr(n)));
}
function qS(e, t) {
  if (Z(e) && Z(t)) {
    var r = !0;
    return (
      I(t, function (n, i) {
        r = r && qS(e[i], n);
      }),
      !!r
    );
  } else return e === t;
}
function dm(e, t) {
  e[t.get(["label", "show"]) ? "show" : "hide"]();
}
function pf(e) {
  return { x: e.x || 0, y: e.y || 0, rotation: e.rotation || 0 };
}
function pm(e, t, r) {
  var n = t.get("z"),
    i = t.get("zlevel");
  e &&
    e.traverse(function (a) {
      a.type !== "group" && (n != null && (a.z = n), i != null && (a.zlevel = i), (a.silent = r));
    });
}
function zE(e) {
  var t = e.get("type"),
    r = e.getModel(t + "Style"),
    n;
  return (
    t === "line"
      ? ((n = r.getLineStyle()), (n.fill = null))
      : t === "shadow" && ((n = r.getAreaStyle()), (n.stroke = null)),
    n
  );
}
function HE(e, t, r, n, i) {
  var a = r.get("value"),
    o = KS(a, t.axis, t.ecModel, r.get("seriesDataIndices"), {
      precision: r.get(["label", "precision"]),
      formatter: r.get(["label", "formatter"]),
    }),
    s = r.getModel("label"),
    l = Pl(s.get("padding") || 0),
    u = s.getFont(),
    f = iy(o, u),
    h = i.position,
    c = f.width + l[1] + l[3],
    v = f.height + l[0] + l[2],
    d = i.align;
  (d === "right" && (h[0] -= c), d === "center" && (h[0] -= c / 2));
  var p = i.verticalAlign;
  (p === "bottom" && (h[1] -= v), p === "middle" && (h[1] -= v / 2), VE(h, c, v, n));
  var m = s.get("backgroundColor");
  ((!m || m === "auto") && (m = t.get(["axisLine", "lineStyle", "color"])),
    (e.label = {
      x: h[0],
      y: h[1],
      style: zr(s, { text: o, font: u, fill: s.getTextColor(), padding: l, backgroundColor: m }),
      z2: 10,
    }));
}
function VE(e, t, r, n) {
  var i = n.getWidth(),
    a = n.getHeight();
  ((e[0] = Math.min(e[0] + t, i) - t),
    (e[1] = Math.min(e[1] + r, a) - r),
    (e[0] = Math.max(e[0], 0)),
    (e[1] = Math.max(e[1], 0)));
}
function KS(e, t, r, n, i) {
  e = t.scale.parse(e);
  var a = t.scale.getLabel({ value: e }, { precision: i.precision }),
    o = i.formatter;
  if (o) {
    var s = { value: tl(t, { value: e }), axisDimension: t.dim, axisIndex: t.index, seriesData: [] };
    (I(n, function (l) {
      var u = r.getSeriesByIndex(l.seriesIndex),
        f = l.dataIndexInside,
        h = u && u.getDataParams(f);
      h && s.seriesData.push(h);
    }),
      Y(o) ? (a = o.replace("{value}", a)) : et(o) && (a = o(s)));
  }
  return a;
}
function QS(e, t, r) {
  var n = Ze();
  return (
    Jh(n, n, r.rotation),
    If(n, n, r.position),
    xc([e.dataToCoord(t), (r.labelOffset || 0) + (r.labelDirection || 1) * (r.labelMargin || 0)], n)
  );
}
function GE(e, t, r, n, i, a) {
  var o = Br.innerTextLayout(r.rotation, 0, r.labelDirection);
  ((r.labelMargin = i.get(["label", "margin"])),
    HE(t, n, i, a, { position: QS(n.axis, e, r), align: o.textAlign, verticalAlign: o.textVerticalAlign }));
}
function UE(e, t, r) {
  return ((r = r || 0), { x1: e[r], y1: e[1 - r], x2: t[r], y2: t[1 - r] });
}
function WE(e, t, r) {
  return ((r = r || 0), { x: e[r], y: e[1 - r], width: t[r], height: t[1 - r] });
}
function YE(e, t, r) {
  return Ni(e, {
    fromStat: {
      sers: j(t, function (n) {
        return r.getSeriesByIndex(n.seriesIndex);
      }),
    },
    min: 1,
  }).w;
}
function XE(e, t, r) {
  return [ht(Ut(t[0], t[1]), e - r / 2), Ut(e + r / 2, ht(t[0], t[1]))];
}
var $E = (function (e) {
  V(t, e);
  function t() {
    return (e !== null && e.apply(this, arguments)) || this;
  }
  return (
    (t.prototype.makeElOption = function (r, n, i, a, o) {
      var s = i.axis,
        l = s.grid,
        u = a.get("type"),
        f = s.getGlobalExtent(),
        h = gm(l, s).getOtherAxis(s).getGlobalExtent(),
        c = s.toGlobalCoord(s.dataToCoord(n, !0));
      if (u && u !== "none") {
        var v = zE(a),
          d = ZE[u](s, c, f, h, a.get("seriesDataIndices"), a.ecModel);
        ((d.style = v), (r.graphicKey = d.type), (r.pointer = d));
      }
      var p = al(l.getRect(), i);
      GE(n, r, p, i, a, o);
    }),
    (t.prototype.getHandleTransform = function (r, n, i) {
      var a = al(n.axis.grid.getRect(), n, { labelInside: !1 });
      a.labelMargin = i.get(["handle", "margin"]);
      var o = QS(n.axis, r, a);
      return { x: o[0], y: o[1], rotation: a.rotation + (a.labelDirection < 0 ? Math.PI : 0) };
    }),
    (t.prototype.updateHandleTransform = function (r, n, i, a) {
      var o = i.axis,
        s = o.grid,
        l = o.getGlobalExtent(!0),
        u = gm(s, o).getOtherAxis(o).getGlobalExtent(),
        f = o.dim === "x" ? 0 : 1,
        h = [r.x, r.y];
      ((h[f] += n[f]), (h[f] = Ut(l[1], h[f])), (h[f] = ht(l[0], h[f])));
      var c = (u[1] + u[0]) / 2,
        v = [c, c];
      v[f] = h[f];
      var d = [{ verticalAlign: "middle" }, { align: "center" }];
      return { x: h[0], y: h[1], rotation: r.rotation, cursorPoint: v, tooltipOption: d[f] };
    }),
    t
  );
})(FE);
function gm(e, t) {
  var r = {};
  return ((r[t.dim + "AxisIndex"] = t.index), e.getCartesian(r));
}
var ZE = {
  line: function (e, t, r, n) {
    var i = UE([t, n[0]], [t, n[1]], mm(e));
    return { type: "Line", subPixelOptimize: !0, shape: i };
  },
  shadow: function (e, t, r, n, i, a) {
    var o = YE(e, i, a),
      s = n[1] - n[0],
      l = XE(t, r, o),
      u = l[0],
      f = l[1];
    return { type: "Rect", shape: WE([u, n[0]], [f - u, s], mm(e)) };
  },
};
function mm(e) {
  return e.dim === "x" ? 0 : 1;
}
var qE = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), r);
    }
    return (
      (t.type = "axisPointer"),
      (t.defaultOption = {
        show: "auto",
        z: 50,
        type: "line",
        snap: !1,
        triggerTooltip: !0,
        triggerEmphasis: !0,
        value: null,
        status: null,
        link: [],
        animation: null,
        animationDurationUpdate: 200,
        lineStyle: { color: X.color.border, width: 1, type: "dashed" },
        shadowStyle: { color: X.color.shadowTint },
        label: {
          show: !0,
          formatter: null,
          precision: "auto",
          margin: 3,
          color: X.color.neutral00,
          padding: [5, 7, 5, 7],
          backgroundColor: X.color.accent60,
          borderColor: null,
          borderWidth: 0,
          borderRadius: 3,
        },
        handle: {
          show: !1,
          icon: "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z",
          size: 45,
          margin: 50,
          color: X.color.accent40,
          throttle: 40,
        },
      }),
      t
    );
  })(dt),
  hr = St(),
  KE = I;
function jS(e, t, r) {
  if (!nt.node) {
    var n = t.getZr();
    (hr(n).records || (hr(n).records = {}), QE(n, t));
    var i = hr(n).records[e] || (hr(n).records[e] = {});
    i.handler = r;
  }
}
function QE(e, t) {
  if (hr(e).initialized) return;
  ((hr(e).initialized = !0),
    r("click", Rt(gf, "click")),
    r("mousemove", Rt(gf, "mousemove")),
    r("mousewheel", Rt(gf, "mousewheel")),
    r("globalout", JE));
  function r(n, i) {
    e.on(n, function (a) {
      var o = tR(t);
      (KE(hr(e).records, function (s) {
        s && i(s, a, o.dispatchAction);
      }),
        jE(o.pendings, t));
    });
  }
}
function jE(e, t) {
  var r = e.showTip.length,
    n = e.hideTip.length,
    i;
  (r ? (i = e.showTip[r - 1]) : n && (i = e.hideTip[n - 1]), i && ((i.dispatchAction = null), t.dispatchAction(i)));
}
function JE(e, t, r) {
  e.handler("leave", null, r);
}
function gf(e, t, r, n) {
  t.handler(e, r, n);
}
function tR(e) {
  var t = { showTip: [], hideTip: [] },
    r = function (n) {
      var i = t[n.type];
      i ? i.push(n) : ((n.dispatchAction = r), e.dispatchAction(n));
    };
  return { dispatchAction: r, pendings: t };
}
function zh(e, t) {
  if (!nt.node) {
    var r = t.getZr(),
      n = (hr(r).records || {})[e];
    n && (hr(r).records[e] = null);
  }
}
var eR = (function (e) {
  V(t, e);
  function t() {
    var r = (e !== null && e.apply(this, arguments)) || this;
    return ((r.type = t.type), r);
  }
  return (
    (t.prototype.render = function (r, n, i) {
      var a = n.getComponent("tooltip"),
        o = r.get("triggerOn") || (a && a.get("triggerOn")) || "mousemove|click|mousewheel";
      jS("axisPointer", i, function (s, l, u) {
        o !== "none" &&
          (s === "leave" || o.indexOf(s) >= 0) &&
          u({ type: "updateAxisPointer", currTrigger: s, x: l && l.offsetX, y: l && l.offsetY });
      });
    }),
    (t.prototype.remove = function (r, n) {
      zh("axisPointer", n);
    }),
    (t.prototype.dispose = function (r, n) {
      zh("axisPointer", n);
    }),
    (t.type = "axisPointer"),
    t
  );
})(Oe);
function JS(e, t) {
  var r = [],
    n = e.seriesIndex,
    i;
  if (n == null || !(i = t.getSeriesByIndex(n))) return { point: [] };
  var a = i.getData(),
    o = En(a, e);
  if (o == null || o < 0 || U(o)) return { point: [] };
  var s = a.getItemGraphicEl(o),
    l = i.coordinateSystem;
  if (i.getTooltipPosition) r = i.getTooltipPosition(o) || [];
  else if (l && l.dataToPoint)
    if (e.isStacked) {
      var u = l.getBaseAxis(),
        f = l.getOtherAxis(u),
        h = f.dim,
        c = u.dim,
        v = h === "x" || h === "radius" ? 1 : 0,
        d = a.mapDimension(c),
        p = [];
      ((p[v] = a.get(d, o)),
        (p[1 - v] = a.get(a.getCalculationInfo("stackResultDimension"), o)),
        (r = l.dataToPoint(p) || []));
    } else
      r =
        l.dataToPoint(
          a.getValues(
            j(l.dimensions, function (g) {
              return a.mapDimension(g);
            }),
            o,
          ),
        ) || [];
  else if (s) {
    var m = s.getBoundingRect().clone();
    (m.applyTransform(s.transform), (r = [m.x + m.width / 2, m.y + m.height / 2]));
  }
  return { point: r, el: s };
}
var ym = St();
function rR(e, t, r) {
  var n = e.currTrigger,
    i = [e.x, e.y],
    a = e,
    o = e.dispatchAction || Tt(r.dispatchAction, r),
    s = t.getComponent("axisPointer").coordSysAxesInfo;
  if (s) {
    bs(i) && (i = JS({ seriesIndex: a.seriesIndex, dataIndex: a.dataIndex }, t).point);
    var l = bs(i),
      u = a.axesInfo,
      f = s.axesInfo,
      h = n === "leave" || bs(i),
      c = {},
      v = {},
      d = { list: [], map: {} },
      p = { showPointer: Rt(iR, v), showTooltip: Rt(aR, d) };
    I(s.coordSysMap, function (g, y) {
      var _ = l || g.containPoint(i);
      I(s.coordSysAxesInfo[y], function (S, b) {
        var w = S.axis,
          T = uR(u, S);
        if (!h && _ && (!u || T)) {
          var C = T && T.value;
          (C == null && !l && (C = w.pointToData(i)), C != null && _m(S, C, p, !1, c));
        }
      });
    });
    var m = {};
    return (
      I(f, function (g, y) {
        var _ = g.linkGroup;
        _ &&
          !v[y] &&
          I(_.axesInfo, function (S, b) {
            var w = v[b];
            if (S !== g && w) {
              var T = w.value;
              (_.mapper && (T = g.axis.scale.parse(_.mapper(T, Sm(S), Sm(g)))), (m[g.key] = T));
            }
          });
      }),
      I(m, function (g, y) {
        _m(f[y], g, p, !0, c);
      }),
      oR(v, f, c),
      sR(d, i, e, o),
      lR(f, o, r),
      c
    );
  }
}
function _m(e, t, r, n, i) {
  var a = e.axis;
  if (!(a.scale.isBlank() || !a.containData(t))) {
    if (!e.involveSeries) {
      r.showPointer(e, t);
      return;
    }
    var o = nR(t, e),
      s = o.payloadBatch,
      l = o.snapToValue;
    (s[0] && i.seriesIndex == null && N(i, s[0]),
      !n && e.snap && a.containData(l) && l != null && (t = l),
      r.showPointer(e, t, s),
      r.showTooltip(e, o, l));
  }
}
function nR(e, t) {
  var r = t.axis,
    n = r.dim,
    i = e,
    a = [],
    o = Number.MAX_VALUE,
    s = -1;
  return (
    I(t.seriesModels, function (l, u) {
      var f = l.getData().mapDimensionsAll(n),
        h,
        c;
      if (l.getAxisTooltipData) {
        var v = l.getAxisTooltipData(f, e, r);
        ((c = v.dataIndices), (h = v.nestestValue));
      } else {
        if (((c = l.indicesOfNearest(n, f[0], e, r.type === "category" ? 0.5 : null)), !c.length)) return;
        h = l.getData().get(f[0], c[0]);
      }
      if (Ie(h)) {
        var d = e - h,
          p = Math.abs(d);
        p <= o &&
          ((p < o || (d >= 0 && s < 0)) && ((o = p), (s = d), (i = h), (a.length = 0)),
          I(c, function (m) {
            a.push({ seriesIndex: l.seriesIndex, dataIndexInside: m, dataIndex: l.getData().getRawIndex(m) });
          }));
      }
    }),
    { payloadBatch: a, snapToValue: i }
  );
}
function iR(e, t, r, n) {
  e[t.key] = { value: r, payloadBatch: n };
}
function aR(e, t, r, n) {
  var i = r.payloadBatch,
    a = t.axis,
    o = a.model,
    s = t.axisPointerModel;
  if (!(!t.triggerTooltip || !i.length)) {
    var l = t.coordSys.model,
      u = Ga(l),
      f = e.map[u];
    (f ||
      ((f = e.map[u] =
        {
          coordSysId: l.id,
          coordSysIndex: l.componentIndex,
          coordSysType: l.type,
          coordSysMainType: l.mainType,
          dataByAxis: [],
        }),
      e.list.push(f)),
      f.dataByAxis.push({
        axisDim: a.dim,
        axisIndex: o.componentIndex,
        axisType: o.type,
        axisId: o.id,
        value: n,
        valueLabelOpt: { precision: s.get(["label", "precision"]), formatter: s.get(["label", "formatter"]) },
        seriesDataIndices: i.slice(),
      }));
  }
}
function oR(e, t, r) {
  var n = (r.axesInfo = []);
  I(t, function (i, a) {
    var o = i.axisPointerModel.option,
      s = e[a];
    (s
      ? (!i.useHandle && (o.status = "show"),
        (o.value = s.value),
        (o.seriesDataIndices = (s.payloadBatch || []).slice()))
      : !i.useHandle && (o.status = "hide"),
      o.status === "show" && n.push({ axisDim: i.axis.dim, axisIndex: i.axis.model.componentIndex, value: o.value }));
  });
}
function sR(e, t, r, n) {
  if (bs(t) || !e.list.length) {
    n({ type: "hideTip" });
    return;
  }
  var i = ((e.list[0].dataByAxis[0] || {}).seriesDataIndices || [])[0] || {};
  n({
    type: "showTip",
    escapeConnect: !0,
    x: t[0],
    y: t[1],
    tooltipOption: r.tooltipOption,
    position: r.position,
    dataIndexInside: i.dataIndexInside,
    dataIndex: i.dataIndex,
    seriesIndex: i.seriesIndex,
    dataByCoordSys: e.list,
  });
}
function lR(e, t, r) {
  var n = r.getZr(),
    i = "axisPointerLastHighlights",
    a = ym(n)[i] || {},
    o = (ym(n)[i] = {});
  I(e, function (f, h) {
    var c = f.axisPointerModel.option;
    c.status === "show" &&
      f.triggerEmphasis &&
      I(c.seriesDataIndices, function (v) {
        o[v.seriesIndex + "|" + v.dataIndex] = v;
      });
  });
  var s = [],
    l = [];
  function u(f) {
    return { seriesIndex: f.seriesIndex, dataIndex: f.dataIndex };
  }
  (I(a, function (f, h) {
    !o[h] && l.push(u(f));
  }),
    I(o, function (f, h) {
      !a[h] && s.push(u(f));
    }),
    l.length && r.dispatchAction({ type: "downplay", escapeConnect: !0, notBlur: !0, batch: l }),
    s.length && r.dispatchAction({ type: "highlight", escapeConnect: !0, notBlur: !0, batch: s }));
}
function uR(e, t) {
  for (var r = 0; r < (e || []).length; r++) {
    var n = e[r];
    if (t.axis.dim === n.axisDim && t.axis.model.componentIndex === n.axisIndex) return n;
  }
}
function Sm(e) {
  var t = e.axis.model,
    r = {},
    n = (r.axisDim = e.axis.dim);
  return (
    (r.axisIndex = r[n + "AxisIndex"] = t.componentIndex),
    (r.axisName = r[n + "AxisName"] = t.name),
    (r.axisId = r[n + "AxisId"] = t.id),
    r
  );
}
function bs(e) {
  return !e || e[0] == null || isNaN(e[0]) || e[1] == null || isNaN(e[1]);
}
function t1(e) {
  (US.registerAxisPointerClass("CartesianAxisPointer", $E),
    e.registerComponentModel(qE),
    e.registerComponentView(eR),
    e.registerPreprocessor(function (t) {
      if (t) {
        (!t.axisPointer || t.axisPointer.length === 0) && (t.axisPointer = {});
        var r = t.axisPointer.link;
        r && !U(r) && (t.axisPointer.link = [r]);
      }
    }),
    e.registerProcessor(e.PRIORITY.PROCESSOR.STATISTIC, {
      overallReset: function (t, r) {
        t.getComponent("axisPointer").coordSysAxesInfo = mE(t, r);
      },
    }),
    e.registerAction({ type: "updateAxisPointer", event: "updateAxisPointer", update: ":updateAxisPointer" }, rR));
}
function fR(e) {
  (Vr(LE), Vr(t1));
}
function hR(e, t) {
  var r = Pl(t.get("padding")),
    n = t.getItemStyle(["color", "opacity"]);
  n.fill = t.get("backgroundColor");
  var i = new Mt({
    shape: {
      x: e.x - r[3],
      y: e.y - r[0],
      width: e.width + r[1] + r[3],
      height: e.height + r[0] + r[2],
      r: t.get("borderRadius"),
    },
    style: n,
    silent: !0,
    z2: -1,
  });
  return i;
}
var cR = (function (e) {
  V(t, e);
  function t() {
    var r = (e !== null && e.apply(this, arguments)) || this;
    return ((r.type = t.type), r);
  }
  return (
    (t.type = "tooltip"),
    (t.dependencies = ["axisPointer"]),
    (t.defaultOption = {
      z: 60,
      show: !0,
      showContent: !0,
      trigger: "item",
      triggerOn: "mousemove|click|mousewheel",
      alwaysShowContent: !1,
      renderMode: "auto",
      confine: null,
      showDelay: 0,
      hideDelay: 100,
      transitionDuration: 0.4,
      displayTransition: !0,
      enterable: !1,
      backgroundColor: X.color.neutral00,
      shadowBlur: 10,
      shadowColor: "rgba(0, 0, 0, .2)",
      shadowOffsetX: 1,
      shadowOffsetY: 2,
      borderRadius: 4,
      borderWidth: 1,
      defaultBorderColor: X.color.border,
      padding: null,
      extraCssText: "",
      axisPointer: {
        type: "line",
        axis: "auto",
        animation: "auto",
        animationDurationUpdate: 200,
        animationEasingUpdate: "exponentialOut",
        crossStyle: { color: X.color.borderShade, width: 1, type: "dashed", textStyle: {} },
      },
      textStyle: { color: X.color.tertiary, fontSize: 14 },
    }),
    t
  );
})(dt);
function e1(e) {
  var t = e.get("confine");
  return t != null ? !!t : e.get("renderMode") === "richText";
}
function r1(e) {
  if (nt.domSupported) {
    for (var t = document.documentElement.style, r = 0, n = e.length; r < n; r++) if (e[r] in t) return e[r];
  }
}
var n1 = r1(["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]),
  vR = r1(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]);
function i1(e, t) {
  if (!e) return t;
  t = C0(t, !0);
  var r = e.indexOf(t);
  return ((e = r === -1 ? t : "-" + e.slice(0, r) + "-" + t), e.toLowerCase());
}
function dR(e, t) {
  var r = e.currentStyle || (document.defaultView && document.defaultView.getComputedStyle(e));
  return r ? r[t] : null;
}
var pR = i1(vR, "transition"),
  gv = i1(n1, "transform"),
  gR =
    "position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;" +
    (nt.transform3dSupported ? "will-change:transform;" : "");
function mR(e) {
  return ((e = e === "left" ? "right" : e === "right" ? "left" : e === "top" ? "bottom" : "top"), e);
}
function yR(e, t, r) {
  if (!Y(r) || r === "inside") return "";
  var n = e.get("backgroundColor"),
    i = e.get("borderWidth");
  t = On(t);
  var a = mR(r),
    o = Math.max(Math.round(i) * 1.5, 6),
    s = "",
    l = gv + ":",
    u;
  vt(["left", "right"], a) > -1
    ? ((s += "top:50%"), (l += "translateY(-50%) rotate(" + (u = a === "left" ? -225 : -45) + "deg)"))
    : ((s += "left:50%"), (l += "translateX(-50%) rotate(" + (u = a === "top" ? 225 : 45) + "deg)"));
  var f = (u * Math.PI) / 180,
    h = o + i,
    c = h * Math.abs(Math.cos(f)) + h * Math.abs(Math.sin(f)),
    v = Math.round(((c - Math.SQRT2 * i) / 2 + Math.SQRT2 * i - (c - h) / 2) * 100) / 100;
  s += ";" + a + ":-" + v + "px";
  var d = t + " solid " + i + "px;",
    p = [
      "position:absolute;width:" + o + "px;height:" + o + "px;z-index:-1;",
      s + ";" + l + ";",
      "border-bottom:" + d,
      "border-right:" + d,
      "background-color:" + n + ";",
    ];
  return '<div style="' + p.join("") + '"></div>';
}
function _R(e, t, r) {
  var n = "cubic-bezier(0.23,1,0.32,1)",
    i = "",
    a = "";
  return (
    r && ((i = " " + e / 2 + "s " + n), (a = "opacity" + i + ",visibility" + i)),
    t ||
      ((i = " " + e + "s " + n),
      (a += (a.length ? "," : "") + (nt.transformSupported ? "" + gv + i : ",left" + i + ",top" + i))),
    pR + ":" + a
  );
}
function bm(e, t, r) {
  var n = e.toFixed(0) + "px",
    i = t.toFixed(0) + "px";
  if (!nt.transformSupported)
    return r
      ? "top:" + i + ";left:" + n + ";"
      : [
          ["top", i],
          ["left", n],
        ];
  var a = nt.transform3dSupported,
    o = "translate" + (a ? "3d" : "") + "(" + n + "," + i + (a ? ",0" : "") + ")";
  return r
    ? "top:0;left:0;" + gv + ":" + o + ";"
    : [
        ["top", 0],
        ["left", 0],
        [n1, o],
      ];
}
function SR(e) {
  var t = [],
    r = e.get("fontSize"),
    n = e.getTextColor();
  (n && t.push("color:" + n), t.push("font:" + e.getFont()));
  var i = q(e.get("lineHeight"), Math.round((r * 3) / 2));
  r && t.push("line-height:" + i + "px");
  var a = e.get("textShadowColor"),
    o = e.get("textShadowBlur") || 0,
    s = e.get("textShadowOffsetX") || 0,
    l = e.get("textShadowOffsetY") || 0;
  return (
    a && o && t.push("text-shadow:" + s + "px " + l + "px " + o + "px " + a),
    I(["decoration", "align"], function (u) {
      var f = e.get(u);
      f && t.push("text-" + u + ":" + f);
    }),
    t.join(";")
  );
}
function bR(e, t, r, n) {
  var i = [],
    a = e.get("transitionDuration"),
    o = e.get("backgroundColor"),
    s = e.get("shadowBlur"),
    l = e.get("shadowColor"),
    u = e.get("shadowOffsetX"),
    f = e.get("shadowOffsetY"),
    h = e.getModel("textStyle"),
    c = J0(e, "html"),
    v = u + "px " + f + "px " + s + "px " + l;
  return (
    i.push("box-shadow:" + v),
    t && a > 0 && i.push(_R(a, r, n)),
    o && i.push("background-color:" + o),
    I(["width", "color", "radius"], function (d) {
      var p = "border-" + d,
        m = C0(p),
        g = e.get(m);
      g != null && i.push(p + ":" + g + (d === "color" ? "" : "px"));
    }),
    i.push(SR(h)),
    c != null && i.push("padding:" + Pl(c).join("px ") + "px"),
    i.join(";") + ";"
  );
}
function wm(e, t, r, n, i) {
  var a = t && t.painter;
  if (r) {
    var o = a && a.getViewportRoot();
    o && bb(e, o, r, n, i);
  } else {
    ((e[0] = n), (e[1] = i));
    var s = a && a.getViewportRootOffset();
    s && ((e[0] += s.offsetLeft), (e[1] += s.offsetTop));
  }
  ((e[2] = e[0] / t.getWidth()), (e[3] = e[1] / t.getHeight()));
}
var wR = (function () {
    function e(t, r) {
      if (
        ((this._show = !1),
        (this._styleCoord = [0, 0, 0, 0]),
        (this._enterable = !0),
        (this._alwaysShowContent = !1),
        (this._firstShow = !0),
        (this._longHide = !0),
        nt.wxa)
      )
        return null;
      var n = document.createElement("div");
      ((n.domBelongToZr = !0), (this.el = n));
      var i = (this._zr = t.getZr()),
        a = r.appendTo,
        o = a && (Y(a) ? document.querySelector(a) : Aa(a) ? a : et(a) && a(t.getDom()));
      (wm(this._styleCoord, i, o, t.getWidth() / 2, t.getHeight() / 2),
        (o || t.getDom()).appendChild(n),
        (this._api = t),
        (this._container = o));
      var s = this;
      ((n.onmouseenter = function () {
        (s._enterable && (clearTimeout(s._hideTimeout), (s._show = !0)), (s._inContent = !0));
      }),
        (n.onmousemove = function (l) {
          if (((l = l || window.event), !s._enterable)) {
            var u = i.handler,
              f = i.painter.getViewportRoot();
            (me(f, l, !0), u.dispatch("mousemove", l));
          }
        }),
        (n.onmouseleave = function () {
          ((s._inContent = !1), s._enterable && s._show && s.hideLater(s._hideDelay));
        }));
    }
    return (
      (e.prototype.update = function (t) {
        if (!this._container) {
          var r = this._api.getDom(),
            n = dR(r, "position"),
            i = r.style;
          i.position !== "absolute" && n !== "absolute" && (i.position = "relative");
        }
        var a = t.get("alwaysShowContent");
        (a && this._moveIfResized(),
          (this._alwaysShowContent = a),
          (this._enableDisplayTransition = t.get("displayTransition") && t.get("transitionDuration") > 0),
          (this.el.className = t.get("className") || ""));
      }),
      (e.prototype.show = function (t, r) {
        (clearTimeout(this._hideTimeout), clearTimeout(this._longHideTimeout));
        var n = this.el,
          i = n.style,
          a = this._styleCoord;
        (n.innerHTML
          ? (i.cssText =
              gR +
              bR(t, !this._firstShow, this._longHide, this._enableDisplayTransition) +
              bm(a[0], a[1], !0) +
              ("border-color:" + On(r) + ";") +
              (t.get("extraCssText") || "") +
              (";pointer-events:" + (this._enterable ? "auto" : "none")))
          : (i.display = "none"),
          (this._show = !0),
          (this._firstShow = !1),
          (this._longHide = !1));
      }),
      (e.prototype.setContent = function (t, r, n, i, a) {
        var o = this.el;
        if (t == null) {
          o.innerHTML = "";
          return;
        }
        var s = "";
        if ((Y(a) && n.get("trigger") === "item" && !e1(n) && (s = yR(n, i, a)), Y(t))) o.innerHTML = t + s;
        else if (t) {
          ((o.innerHTML = ""), U(t) || (t = [t]));
          for (var l = 0; l < t.length; l++) Aa(t[l]) && t[l].parentNode !== o && o.appendChild(t[l]);
          if (s && o.childNodes.length) {
            var u = document.createElement("div");
            ((u.innerHTML = s), o.appendChild(u));
          }
        }
      }),
      (e.prototype.setEnterable = function (t) {
        this._enterable = t;
      }),
      (e.prototype.getSize = function () {
        var t = this.el;
        return t ? [t.offsetWidth, t.offsetHeight] : [0, 0];
      }),
      (e.prototype.moveTo = function (t, r) {
        if (this.el) {
          var n = this._styleCoord;
          if ((wm(n, this._zr, this._container, t, r), n[0] != null && n[1] != null)) {
            var i = this.el.style,
              a = bm(n[0], n[1]);
            I(a, function (o) {
              i[o[0]] = o[1];
            });
          }
        }
      }),
      (e.prototype._moveIfResized = function () {
        var t = this._styleCoord[2],
          r = this._styleCoord[3];
        this.moveTo(t * this._zr.getWidth(), r * this._zr.getHeight());
      }),
      (e.prototype.hide = function () {
        var t = this,
          r = this.el.style;
        (this._enableDisplayTransition ? ((r.visibility = "hidden"), (r.opacity = "0")) : (r.display = "none"),
          nt.transform3dSupported && (r.willChange = ""),
          (this._show = !1),
          (this._longHideTimeout = setTimeout(function () {
            return (t._longHide = !0);
          }, 500)));
      }),
      (e.prototype.hideLater = function (t) {
        this._show &&
          !(this._inContent && this._enterable) &&
          !this._alwaysShowContent &&
          (t
            ? ((this._hideDelay = t), (this._show = !1), (this._hideTimeout = setTimeout(Tt(this.hide, this), t)))
            : this.hide());
      }),
      (e.prototype.isShow = function () {
        return this._show;
      }),
      (e.prototype.dispose = function () {
        (clearTimeout(this._hideTimeout), clearTimeout(this._longHideTimeout));
        var t = this._zr;
        wb(t && t.painter && t.painter.getViewportRoot(), this._container);
        var r = this.el;
        if (r) {
          r.onmouseenter = r.onmousemove = r.onmouseleave = null;
          var n = r.parentNode;
          n && n.removeChild(r);
        }
        this.el = this._container = null;
      }),
      e
    );
  })(),
  TR = (function () {
    function e(t) {
      ((this._show = !1),
        (this._styleCoord = [0, 0, 0, 0]),
        (this._alwaysShowContent = !1),
        (this._enterable = !0),
        (this._zr = t.getZr()),
        xm(this._styleCoord, this._zr, t.getWidth() / 2, t.getHeight() / 2));
    }
    return (
      (e.prototype.update = function (t) {
        var r = t.get("alwaysShowContent");
        (r && this._moveIfResized(), (this._alwaysShowContent = r));
      }),
      (e.prototype.show = function () {
        (this._hideTimeout && clearTimeout(this._hideTimeout), this.el.show(), (this._show = !0));
      }),
      (e.prototype.setContent = function (t, r, n, i, a) {
        var o = this;
        (Z(t) && ne(""), this.el && this._zr.remove(this.el));
        var s = n.getModel("textStyle");
        ((this.el = new Wt({
          style: {
            rich: r.richTextStyles,
            text: t,
            lineHeight: 22,
            borderWidth: 1,
            borderColor: i,
            textShadowColor: s.get("textShadowColor"),
            fill: n.get(["textStyle", "color"]),
            padding: J0(n, "richText"),
            verticalAlign: "top",
            align: "left",
          },
          z: n.get("z"),
        })),
          I(
            ["backgroundColor", "borderRadius", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"],
            function (u) {
              o.el.style[u] = n.get(u);
            },
          ),
          I(["textShadowBlur", "textShadowOffsetX", "textShadowOffsetY"], function (u) {
            o.el.style[u] = s.get(u) || 0;
          }),
          this._zr.add(this.el));
        var l = this;
        (this.el.on("mouseover", function () {
          (l._enterable && (clearTimeout(l._hideTimeout), (l._show = !0)), (l._inContent = !0));
        }),
          this.el.on("mouseout", function () {
            (l._enterable && l._show && l.hideLater(l._hideDelay), (l._inContent = !1));
          }));
      }),
      (e.prototype.setEnterable = function (t) {
        this._enterable = t;
      }),
      (e.prototype.getSize = function () {
        var t = this.el,
          r = this.el.getBoundingRect(),
          n = Tm(t.style);
        return [r.width + n.left + n.right, r.height + n.top + n.bottom];
      }),
      (e.prototype.moveTo = function (t, r) {
        var n = this.el;
        if (n) {
          var i = this._styleCoord;
          (xm(i, this._zr, t, r), (t = i[0]), (r = i[1]));
          var a = n.style,
            o = Ir(a.borderWidth || 0),
            s = Tm(a);
          ((n.x = t + o + s.left), (n.y = r + o + s.top), n.markRedraw());
        }
      }),
      (e.prototype._moveIfResized = function () {
        var t = this._styleCoord[2],
          r = this._styleCoord[3];
        this.moveTo(t * this._zr.getWidth(), r * this._zr.getHeight());
      }),
      (e.prototype.hide = function () {
        (this.el && this.el.hide(), (this._show = !1));
      }),
      (e.prototype.hideLater = function (t) {
        this._show &&
          !(this._inContent && this._enterable) &&
          !this._alwaysShowContent &&
          (t
            ? ((this._hideDelay = t), (this._show = !1), (this._hideTimeout = setTimeout(Tt(this.hide, this), t)))
            : this.hide());
      }),
      (e.prototype.isShow = function () {
        return this._show;
      }),
      (e.prototype.dispose = function () {
        this._zr.remove(this.el);
      }),
      e
    );
  })();
function Ir(e) {
  return Math.max(0, e);
}
function Tm(e) {
  var t = Ir(e.shadowBlur || 0),
    r = Ir(e.shadowOffsetX || 0),
    n = Ir(e.shadowOffsetY || 0);
  return { left: Ir(t - r), right: Ir(t + r), top: Ir(t - n), bottom: Ir(t + n) };
}
function xm(e, t, r, n) {
  ((e[0] = r), (e[1] = n), (e[2] = e[0] / t.getWidth()), (e[3] = e[1] / t.getHeight()));
}
var xR = new Mt({ shape: { x: -1, y: -1, width: 2, height: 2 } }),
  CR = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), r);
    }
    return (
      (t.prototype.init = function (r, n) {
        if (!(nt.node || !n.getDom())) {
          var i = r.getComponent("tooltip"),
            a = (this._renderMode = aT(i.get("renderMode")));
          this._tooltipContent =
            a === "richText"
              ? new TR(n)
              : new wR(n, { appendTo: i.get("appendToBody", !0) ? "body" : i.get("appendTo", !0) });
        }
      }),
      (t.prototype.render = function (r, n, i) {
        if (!(nt.node || !i.getDom())) {
          (this.group.removeAll(), (this._tooltipModel = r), (this._ecModel = n), (this._api = i));
          var a = this._tooltipContent;
          (a.update(r),
            a.setEnterable(r.get("enterable")),
            this._initGlobalListener(),
            this._keepShow(),
            this._renderMode !== "richText" && r.get("transitionDuration")
              ? e_(this, "_updatePosition", 50, "fixRate")
              : dh(this, "_updatePosition"));
        }
      }),
      (t.prototype._initGlobalListener = function () {
        var r = this._tooltipModel,
          n = r.get("triggerOn");
        jS(
          "itemTooltip",
          this._api,
          Tt(function (i, a, o) {
            n !== "none" && (n.indexOf(i) >= 0 ? this._tryShow(a, o) : i === "leave" && this._hide(o));
          }, this),
        );
      }),
      (t.prototype._keepShow = function () {
        var r = this._tooltipModel,
          n = this._ecModel,
          i = this._api,
          a = r.get("triggerOn");
        if (
          (r.get("trigger") !== "axis" && ((this._lastDataByCoordSys = null), (this._cbParamsList = null)),
          this._lastX != null && this._lastY != null && a !== "none" && a !== "click")
        ) {
          var o = this;
          (clearTimeout(this._refreshUpdateTimeout),
            (this._refreshUpdateTimeout = setTimeout(function () {
              !i.isDisposed() &&
                o.manuallyShowTip(r, n, i, { x: o._lastX, y: o._lastY, dataByCoordSys: o._lastDataByCoordSys });
            })));
        }
      }),
      (t.prototype.manuallyShowTip = function (r, n, i, a) {
        if (!(a.from === this.uid || nt.node || !i.getDom())) {
          var o = Cm(a, i);
          this._ticket = "";
          var s = a.dataByCoordSys,
            l = IR(a, n, i);
          if (l) {
            var u = l.el.getBoundingRect().clone();
            (u.applyTransform(l.el.transform),
              this._tryShow(
                {
                  offsetX: u.x + u.width / 2,
                  offsetY: u.y + u.height / 2,
                  target: l.el,
                  position: a.position,
                  positionDefault: "bottom",
                },
                o,
              ));
          } else if (a.tooltip && a.x != null && a.y != null) {
            var f = xR;
            ((f.x = a.x),
              (f.y = a.y),
              f.update(),
              (ut(f).tooltipConfig = { name: null, option: a.tooltip }),
              this._tryShow({ offsetX: a.x, offsetY: a.y, target: f }, o));
          } else if (s)
            this._tryShow(
              { offsetX: a.x, offsetY: a.y, position: a.position, dataByCoordSys: s, tooltipOption: a.tooltipOption },
              o,
            );
          else if (a.seriesIndex != null) {
            if (this._manuallyAxisShowTip(r, n, i, a)) return;
            var h = JS(a, n),
              c = h.point[0],
              v = h.point[1];
            c != null &&
              v != null &&
              this._tryShow(
                { offsetX: c, offsetY: v, target: h.el, position: a.position, positionDefault: "bottom" },
                o,
              );
          } else
            a.x != null &&
              a.y != null &&
              (i.dispatchAction({ type: "updateAxisPointer", x: a.x, y: a.y }),
              this._tryShow(
                { offsetX: a.x, offsetY: a.y, position: a.position, target: i.getZr().findHover(a.x, a.y).target },
                o,
              ));
        }
      }),
      (t.prototype.manuallyHideTip = function (r, n, i, a) {
        var o = this._tooltipContent;
        (this._tooltipModel && o.hideLater(this._tooltipModel.get("hideDelay")),
          (this._lastX = this._lastY = this._lastDataByCoordSys = null),
          (this._cbParamsList = null),
          a.from !== this.uid && this._hide(Cm(a, i)));
      }),
      (t.prototype._manuallyAxisShowTip = function (r, n, i, a) {
        var o = a.seriesIndex,
          s = a.dataIndex,
          l = n.getComponent("axisPointer").coordSysAxesInfo;
        if (!(o == null || s == null || l == null)) {
          var u = n.getSeriesByIndex(o);
          if (u) {
            var f = u.getData(),
              h = na([f.getItemModel(s), u, (u.coordinateSystem || {}).model], this._tooltipModel);
            if (h.get("trigger") === "axis")
              return (
                i.dispatchAction({ type: "updateAxisPointer", seriesIndex: o, dataIndex: s, position: a.position }),
                !0
              );
          }
        }
      }),
      (t.prototype._tryShow = function (r, n) {
        var i = r.target,
          a = this._tooltipModel;
        if (a) {
          ((this._lastX = r.offsetX), (this._lastY = r.offsetY));
          var o = r.dataByCoordSys;
          if (o && o.length) this._showAxisTooltip(o, r);
          else if (i) {
            var s = ut(i);
            if (s.ssrType === "legend") return;
            ((this._lastDataByCoordSys = null), (this._cbParamsList = null));
            var l, u;
            (ha(
              i,
              function (f) {
                if (f.tooltipDisabled) return ((l = u = null), !0);
                l || u || (ut(f).dataIndex != null ? (l = f) : ut(f).tooltipConfig != null && (u = f));
              },
              !0,
            ),
              l ? this._showSeriesItemTooltip(r, l, n) : u ? this._showComponentItemTooltip(r, u, n) : this._hide(n));
          } else ((this._lastDataByCoordSys = null), (this._cbParamsList = null), this._hide(n));
        }
      }),
      (t.prototype._showOrMove = function (r, n) {
        var i = r.get("showDelay");
        ((n = Tt(n, this)), clearTimeout(this._showTimout), i > 0 ? (this._showTimout = setTimeout(n, i)) : n());
      }),
      (t.prototype._showAxisTooltip = function (r, n) {
        var i = this._ecModel,
          a = this._tooltipModel,
          o = [n.offsetX, n.offsetY],
          s = na([n.tooltipOption], a),
          l = this._renderMode,
          u = [],
          f = Na("section", { blocks: [], noHeader: !0 }),
          h = [],
          c = new Yu();
        (I(r, function (y) {
          I(y.dataByAxis, function (_) {
            var S = i.getComponent(_.axisDim + "Axis", _.axisIndex),
              b = _.value,
              w = S.axis,
              T = w.scale.parse(b);
            if (!(!S || b == null)) {
              var C = KS(b, w, i, _.seriesDataIndices, _.valueLabelOpt),
                A = Na("section", { header: C, noHeader: !Xe(C), sortBlocks: !0, blocks: [] });
              (f.blocks.push(A),
                I(_.seriesDataIndices, function (M) {
                  var D = i.getSeriesByIndex(M.seriesIndex),
                    P = M.dataIndexInside,
                    x = D.getDataParams(P);
                  if (!(x.dataIndex < 0)) {
                    ((x.axisDim = _.axisDim),
                      (x.axisIndex = _.axisIndex),
                      (x.axisType = _.axisType),
                      (x.axisId = _.axisId),
                      (x.axisValue = tl(S.axis, { value: T })),
                      (x.axisValueLabel = C),
                      (x.marker = c.makeTooltipMarker("item", On(x.color), l)));
                    var L = xp(D.formatTooltip(P, !0, null)),
                      E = L.frag;
                    if (E) {
                      var R = na([D], a).get("valueFormatter");
                      A.blocks.push(R ? N({ valueFormatter: R }, E) : E);
                    }
                    (L.text && h.push(L.text), u.push(x));
                  }
                }));
            }
          });
        }),
          f.blocks.reverse(),
          h.reverse());
        var v = n.position,
          d = s.get("order"),
          p = Ip(f, c, l, d, i.get("useUTC"), s.get("textStyle"));
        p && h.unshift(p);
        var m =
            l === "richText"
              ? `

`
              : "<br/>",
          g = h.join(m);
        this._showOrMove(s, function () {
          this._updateContentNotChangedOnAxis(r, u)
            ? this._updatePosition(s, v, o[0], o[1], this._tooltipContent, u)
            : this._showTooltipContent(s, g, u, Math.random() + "", o[0], o[1], v, null, c);
        });
      }),
      (t.prototype._showSeriesItemTooltip = function (r, n, i) {
        var a = this._ecModel,
          o = ut(n),
          s = o.seriesIndex,
          l = a.getSeriesByIndex(s),
          u = o.dataModel || l,
          f = o.dataIndex,
          h = o.dataType,
          c = u.getData(h),
          v = this._renderMode,
          d = r.positionDefault,
          p = na(
            [c.getItemModel(f), u, l && (l.coordinateSystem || {}).model],
            this._tooltipModel,
            d ? { position: d } : null,
          ),
          m = p.get("trigger");
        if (!(m != null && m !== "item")) {
          var g = u.getDataParams(f, h),
            y = new Yu();
          g.marker = y.makeTooltipMarker("item", On(g.color), v);
          var _ = xp(u.formatTooltip(f, !1, h)),
            S = p.get("order"),
            b = p.get("valueFormatter"),
            w = _.frag,
            T = w ? Ip(b ? N({ valueFormatter: b }, w) : w, y, v, S, a.get("useUTC"), p.get("textStyle")) : _.text,
            C = "item_" + u.name + "_" + f;
          (this._showOrMove(p, function () {
            this._showTooltipContent(p, T, g, C, r.offsetX, r.offsetY, r.position, r.target, y);
          }),
            i({ type: "showTip", dataIndexInside: f, dataIndex: c.getRawIndex(f), seriesIndex: s, from: this.uid }));
        }
      }),
      (t.prototype._showComponentItemTooltip = function (r, n, i) {
        var a = this._renderMode === "html",
          o = ut(n),
          s = o.tooltipConfig,
          l = s.option || {},
          u = l.encodeHTMLContent;
        if (Y(l)) {
          var f = l;
          ((l = { content: f, formatter: f }), (u = !0));
        }
        u && a && l.content && ((l = ot(l)), (l.content = ee(l.content)));
        var h = [l],
          c = this._ecModel.getComponent(o.componentMainType, o.componentIndex);
        (c && h.push(c), h.push({ formatter: l.content }));
        var v = r.positionDefault,
          d = na(h, this._tooltipModel, v ? { position: v } : null),
          p = d.get("content"),
          m = Math.random() + "",
          g = new Yu();
        (this._showOrMove(d, function () {
          var y = ot(d.get("formatterParams") || {});
          this._showTooltipContent(d, p, y, m, r.offsetX, r.offsetY, r.position, n, g);
        }),
          i({ type: "showTip", from: this.uid }));
      }),
      (t.prototype._showTooltipContent = function (r, n, i, a, o, s, l, u, f) {
        if (((this._ticket = ""), !(!r.get("showContent") || !r.get("show")))) {
          var h = this._tooltipContent;
          h.setEnterable(r.get("enterable"));
          var c = r.get("formatter");
          l = l || r.get("position");
          var v = n,
            d = this._getNearestPoint(
              [o, s],
              i,
              r.get("trigger"),
              r.get("borderColor"),
              r.get("defaultBorderColor", !0),
            ),
            p = d.color;
          if (c)
            if (Y(c)) {
              var m = r.ecModel.get("useUTC"),
                g = U(i) ? i[0] : i,
                y = g && g.axisType && g.axisType.indexOf("time") >= 0;
              ((v = c), y && (v = Ll(g.axisValue, v, m)), (v = D0(v, i, !0)));
            } else if (et(c)) {
              var _ = Tt(function (S, b) {
                S === this._ticket && (h.setContent(b, f, r, p, l), this._updatePosition(r, l, o, s, h, i, u));
              }, this);
              ((this._ticket = a), (v = c(i, a, _)));
            } else v = c;
          (h.setContent(v, f, r, p, l), h.show(r, p), this._updatePosition(r, l, o, s, h, i, u));
        }
      }),
      (t.prototype._getNearestPoint = function (r, n, i, a, o) {
        if (i === "axis" || U(n)) return { color: a || o };
        if (!U(n)) return { color: a || n.color || n.borderColor };
      }),
      (t.prototype._updatePosition = function (r, n, i, a, o, s, l) {
        var u = this._api.getWidth(),
          f = this._api.getHeight();
        n = n || r.get("position");
        var h = o.getSize(),
          c = r.get("align"),
          v = r.get("verticalAlign"),
          d = l && l.getBoundingRect().clone();
        if (
          (l && d.applyTransform(l.transform),
          et(n) && (n = n([i, a], s, o.el, d, { viewSize: [u, f], contentSize: h.slice() })),
          U(n))
        )
          ((i = qt(n[0], u)), (a = qt(n[1], f)));
        else if (Z(n)) {
          var p = n;
          ((p.width = h[0]), (p.height = h[1]));
          var m = bi(p, { width: u, height: f });
          ((i = m.x), (a = m.y), (c = null), (v = null));
        } else if (Y(n) && l) {
          var g = MR(n, d, h, r.get("borderWidth"));
          ((i = g[0]), (a = g[1]));
        } else {
          var g = DR(i, a, o, u, f, c ? null : 20, v ? null : 20);
          ((i = g[0]), (a = g[1]));
        }
        if (
          (c && (i -= Dm(c) ? h[0] / 2 : c === "right" ? h[0] : 0),
          v && (a -= Dm(v) ? h[1] / 2 : v === "bottom" ? h[1] : 0),
          e1(r))
        ) {
          var g = AR(i, a, o, u, f);
          ((i = g[0]), (a = g[1]));
        }
        o.moveTo(i, a);
      }),
      (t.prototype._updateContentNotChangedOnAxis = function (r, n) {
        var i = this._lastDataByCoordSys,
          a = this._cbParamsList,
          o = !!i && i.length === r.length;
        return (
          o &&
            I(i, function (s, l) {
              var u = s.dataByAxis || [],
                f = r[l] || {},
                h = f.dataByAxis || [];
              ((o = o && u.length === h.length),
                o &&
                  I(u, function (c, v) {
                    var d = h[v] || {},
                      p = c.seriesDataIndices || [],
                      m = d.seriesDataIndices || [];
                    ((o =
                      o &&
                      c.value === d.value &&
                      c.axisType === d.axisType &&
                      c.axisId === d.axisId &&
                      p.length === m.length),
                      o &&
                        I(p, function (g, y) {
                          var _ = m[y];
                          o = o && g.seriesIndex === _.seriesIndex && g.dataIndex === _.dataIndex;
                        }),
                      a &&
                        I(c.seriesDataIndices, function (g) {
                          var y = g.seriesIndex,
                            _ = n[y],
                            S = a[y];
                          _ && S && S.data !== _.data && (o = !1);
                        }));
                  }));
            }),
          (this._lastDataByCoordSys = r),
          (this._cbParamsList = n),
          !!o
        );
      }),
      (t.prototype._hide = function (r) {
        ((this._lastDataByCoordSys = null), (this._cbParamsList = null), r({ type: "hideTip", from: this.uid }));
      }),
      (t.prototype.dispose = function (r, n) {
        nt.node ||
          !n.getDom() ||
          (dh(this, "_updatePosition"),
          this._tooltipContent.dispose(),
          zh("itemTooltip", n),
          (this._tooltipContent = null),
          (this._tooltipModel = null),
          (this._lastDataByCoordSys = null),
          (this._cbParamsList = null));
      }),
      (t.type = "tooltip"),
      t
    );
  })(Oe);
function na(e, t, r) {
  var n = t.ecModel,
    i;
  r ? ((i = new Ct(r, n, n)), (i = new Ct(t.option, i, n))) : (i = t);
  for (var a = e.length - 1; a >= 0; a--) {
    var o = e[a];
    o && (o instanceof Ct && (o = o.get("tooltip", !0)), Y(o) && (o = { formatter: o }), o && (i = new Ct(o, i, n)));
  }
  return i;
}
function Cm(e, t) {
  return e.dispatchAction || Tt(t.dispatchAction, t);
}
function DR(e, t, r, n, i, a, o) {
  var s = r.getSize(),
    l = s[0],
    u = s[1];
  return (
    a != null && (e + l + a + 2 > n ? (e -= l + a) : (e += a)),
    o != null && (t + u + o > i ? (t -= u + o) : (t += o)),
    [e, t]
  );
}
function AR(e, t, r, n, i) {
  var a = r.getSize(),
    o = a[0],
    s = a[1];
  return (
    (e = Math.min(e + o, n) - o),
    (t = Math.min(t + s, i) - s),
    (e = Math.max(e, 0)),
    (t = Math.max(t, 0)),
    [e, t]
  );
}
function MR(e, t, r, n) {
  var i = r[0],
    a = r[1],
    o = Math.ceil(Math.SQRT2 * n) + 8,
    s = 0,
    l = 0,
    u = t.width,
    f = t.height;
  switch (e) {
    case "inside":
      ((s = t.x + u / 2 - i / 2), (l = t.y + f / 2 - a / 2));
      break;
    case "top":
      ((s = t.x + u / 2 - i / 2), (l = t.y - a - o));
      break;
    case "bottom":
      ((s = t.x + u / 2 - i / 2), (l = t.y + f + o));
      break;
    case "left":
      ((s = t.x - i - o), (l = t.y + f / 2 - a / 2));
      break;
    case "right":
      ((s = t.x + u + o), (l = t.y + f / 2 - a / 2));
  }
  return [s, l];
}
function Dm(e) {
  return e === "center" || e === "middle";
}
function IR(e, t, r) {
  var n = oc(e).queryOptionMap,
    i = n.keys()[0];
  if (!(!i || i === "series")) {
    var a = Ka(t, i, n.get(i), { useDefault: !1, enableAll: !1, enableNone: !1 }),
      o = a.models[0];
    if (o) {
      var s = r.getViewOfComponentModel(o),
        l;
      if (
        (s.group.traverse(function (u) {
          var f = ut(u).tooltipConfig;
          if (f && f.name === e.name) return ((l = u), !0);
        }),
        l)
      )
        return { componentMainType: i, componentIndex: o.componentIndex, el: l };
    }
  }
}
function LR(e) {
  (Vr(t1),
    e.registerComponentModel(cR),
    e.registerComponentView(CR),
    e.registerAction({ type: "showTip", event: "showTip", update: "tooltip:manuallyShowTip" }, Gt),
    e.registerAction({ type: "hideTip", event: "hideTip", update: "tooltip:manuallyHideTip" }, Gt));
}
var PR = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), (r.layoutMode = { type: "box", ignoreSize: !0 }), r);
    }
    return (
      (t.type = "title"),
      (t.defaultOption = {
        z: 6,
        show: !0,
        text: "",
        target: "blank",
        subtext: "",
        subtarget: "blank",
        left: "center",
        top: X.size.m,
        backgroundColor: X.color.transparent,
        borderColor: X.color.primary,
        borderWidth: 0,
        padding: 5,
        itemGap: 10,
        textStyle: { fontSize: 18, fontWeight: "bold", color: X.color.primary },
        subtextStyle: { fontSize: 12, color: X.color.quaternary },
      }),
      t
    );
  })(dt),
  ER = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), r);
    }
    return (
      (t.prototype.render = function (r, n, i) {
        if ((this.group.removeAll(), !!r.get("show"))) {
          var a = this.group,
            o = r.getModel("textStyle"),
            s = r.getModel("subtextStyle"),
            l = r.get("textAlign"),
            u = q(r.get("textBaseline"), r.get("textVerticalAlign")),
            f = new Wt({ style: zr(o, { text: r.get("text"), fill: o.getTextColor() }, { disableBox: !0 }), z2: 10 }),
            h = f.getBoundingRect(),
            c = r.get("subtext"),
            v = new Wt({
              style: zr(
                s,
                { text: c, fill: s.getTextColor(), y: h.height + r.get("itemGap"), verticalAlign: "top" },
                { disableBox: !0 },
              ),
              z2: 10,
            }),
            d = r.get("link"),
            p = r.get("sublink"),
            m = r.get("triggerEvent", !0);
          ((f.silent = !d && !m),
            (v.silent = !p && !m),
            d &&
              f.on("click", function () {
                ap(d, "_" + r.get("target"));
              }),
            p &&
              v.on("click", function () {
                ap(p, "_" + r.get("subtarget"));
              }),
            (ut(f).eventData = ut(v).eventData =
              m ? { componentType: "title", componentIndex: r.componentIndex } : null),
            a.add(f),
            c && a.add(v));
          var g = a.getBoundingRect(),
            y = r.getBoxLayoutParams();
          ((y.width = g.width), (y.height = g.height));
          var _ = Vc(r, i),
            S = bi(y, _.refContainer, r.get("padding"));
          (l ||
            ((l = r.get("left") || r.get("right")),
            l === "middle" && (l = "center"),
            l === "right" ? (S.x += S.width) : l === "center" && (S.x += S.width / 2)),
            u ||
              ((u = r.get("top") || r.get("bottom")),
              u === "center" && (u = "middle"),
              u === "bottom" ? (S.y += S.height) : u === "middle" && (S.y += S.height / 2),
              (u = u || "top")),
            (a.x = S.x),
            (a.y = S.y),
            a.markRedraw());
          var b = { align: l, verticalAlign: u };
          (f.setStyle(b), v.setStyle(b), (g = a.getBoundingRect()));
          var w = S.margin,
            T = r.getItemStyle(["color", "opacity"]);
          T.fill = r.get("backgroundColor");
          var C = new Mt({
            shape: {
              x: g.x - w[3],
              y: g.y - w[0],
              width: g.width + w[1] + w[3],
              height: g.height + w[0] + w[2],
              r: r.get("borderRadius"),
            },
            style: T,
            subPixelOptimize: !0,
            silent: !0,
          });
          a.add(C);
        }
      }),
      (t.type = "title"),
      t
    );
  })(Oe);
function RR(e) {
  (e.registerComponentModel(PR), e.registerComponentView(ER));
}
var OR = function (e, t) {
    if (t === "all") return { type: "all", title: e.getLocaleModel().get(["legend", "selector", "all"]) };
    if (t === "inverse") return { type: "inverse", title: e.getLocaleModel().get(["legend", "selector", "inverse"]) };
  },
  Hh = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), (r.layoutMode = { type: "box", ignoreSize: !0 }), r);
    }
    return (
      (t.prototype.init = function (r, n, i) {
        (this.mergeDefaultAndTheme(r, i), (r.selected = r.selected || {}), this._updateSelector(r));
      }),
      (t.prototype.mergeOption = function (r, n) {
        (e.prototype.mergeOption.call(this, r, n), this._updateSelector(r));
      }),
      (t.prototype._updateSelector = function (r) {
        var n = r.selector,
          i = this.ecModel;
        (n === !0 && (n = r.selector = ["all", "inverse"]),
          U(n) &&
            I(n, function (a, o) {
              (Y(a) && (a = { type: a }), (n[o] = pt(a, OR(i, a.type))));
            }));
      }),
      (t.prototype.optionUpdated = function () {
        this._updateData(this.ecModel);
        var r = this._data;
        if (r[0] && this.get("selectedMode") === "single") {
          for (var n = !1, i = 0; i < r.length; i++) {
            var a = r[i].get("name");
            if (this.isSelected(a)) {
              (this.select(a), (n = !0));
              break;
            }
          }
          !n && this.select(r[0].get("name"));
        }
      }),
      (t.prototype._updateData = function (r) {
        var n = [],
          i = [];
        (r.eachRawSeries(function (l) {
          var u = l.name;
          i.push(u);
          var f;
          if (l.legendVisualProvider) {
            var h = l.legendVisualProvider,
              c = h.getAllNames();
            (r.isSeriesFiltered(l) || (i = i.concat(c)), c.length ? (n = n.concat(c)) : (f = !0));
          } else f = !0;
          f && ac(l) && n.push(l.name);
        }),
          (this._availableNames = i));
        var a = this.get("data") || n,
          o = Q(),
          s = j(
            a,
            function (l) {
              return (
                (Y(l) || wt(l)) && (l = { name: l }),
                o.get(l.name) ? null : (o.set(l.name, !0), new Ct(l, this, this.ecModel))
              );
            },
            this,
          );
        this._data = Vt(s, function (l) {
          return !!l;
        });
      }),
      (t.prototype.getData = function () {
        return this._data;
      }),
      (t.prototype.select = function (r) {
        var n = this.option.selected,
          i = this.get("selectedMode");
        if (i === "single") {
          var a = this._data;
          I(a, function (o) {
            n[o.get("name")] = !1;
          });
        }
        n[r] = !0;
      }),
      (t.prototype.unSelect = function (r) {
        this.get("selectedMode") !== "single" && (this.option.selected[r] = !1);
      }),
      (t.prototype.toggleSelected = function (r) {
        var n = this.option.selected;
        (n.hasOwnProperty(r) || (n[r] = !0), this[n[r] ? "unSelect" : "select"](r));
      }),
      (t.prototype.allSelect = function () {
        var r = this._data,
          n = this.option.selected;
        I(r, function (i) {
          n[i.get("name", !0)] = !0;
        });
      }),
      (t.prototype.inverseSelect = function () {
        var r = this._data,
          n = this.option.selected;
        I(r, function (i) {
          var a = i.get("name", !0);
          (n.hasOwnProperty(a) || (n[a] = !0), (n[a] = !n[a]));
        });
      }),
      (t.prototype.isSelected = function (r) {
        var n = this.option.selected;
        return !(n.hasOwnProperty(r) && !n[r]) && vt(this._availableNames, r) >= 0;
      }),
      (t.prototype.getOrient = function () {
        return this.get("orient") === "vertical" ? { index: 1, name: "vertical" } : { index: 0, name: "horizontal" };
      }),
      (t.type = "legend.plain"),
      (t.dependencies = ["series"]),
      (t.defaultOption = {
        z: 4,
        show: !0,
        orient: "horizontal",
        left: "center",
        bottom: X.size.m,
        align: "auto",
        backgroundColor: X.color.transparent,
        borderColor: X.color.border,
        borderRadius: 0,
        borderWidth: 0,
        padding: 5,
        itemGap: 8,
        itemWidth: 25,
        itemHeight: 14,
        symbolRotate: "inherit",
        symbolKeepAspect: !0,
        inactiveColor: X.color.disabled,
        inactiveBorderColor: X.color.disabled,
        inactiveBorderWidth: "auto",
        itemStyle: {
          color: "inherit",
          opacity: "inherit",
          borderColor: "inherit",
          borderWidth: "auto",
          borderCap: "inherit",
          borderJoin: "inherit",
          borderDashOffset: "inherit",
          borderMiterLimit: "inherit",
        },
        lineStyle: {
          width: "auto",
          color: "inherit",
          inactiveColor: X.color.disabled,
          inactiveWidth: 2,
          opacity: "inherit",
          type: "inherit",
          cap: "inherit",
          join: "inherit",
          dashOffset: "inherit",
          miterLimit: "inherit",
        },
        textStyle: { color: X.color.secondary },
        selectedMode: !0,
        selector: !1,
        selectorLabel: {
          show: !0,
          borderRadius: 10,
          padding: [3, 5, 3, 5],
          fontSize: 12,
          fontFamily: "sans-serif",
          color: X.color.tertiary,
          borderWidth: 1,
          borderColor: X.color.border,
        },
        emphasis: { selectorLabel: { show: !0, color: X.color.quaternary } },
        selectorPosition: "auto",
        selectorItemGap: 7,
        selectorButtonGap: 10,
        tooltip: { show: !1 },
        triggerEvent: !1,
      }),
      t
    );
  })(dt),
  ti = Rt,
  Vh = I,
  jo = Bt,
  a1 = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), (r.newlineDisabled = !1), r);
    }
    return (
      (t.prototype.init = function () {
        (this.group.add((this._contentGroup = new jo())),
          this.group.add((this._selectorGroup = new jo())),
          (this._isFirstRender = !0));
      }),
      (t.prototype.getContentGroup = function () {
        return this._contentGroup;
      }),
      (t.prototype.getSelectorGroup = function () {
        return this._selectorGroup;
      }),
      (t.prototype.render = function (r, n, i) {
        var a = this._isFirstRender;
        if (((this._isFirstRender = !1), this.resetInner(), !!r.get("show", !0))) {
          var o = r.get("align"),
            s = r.get("orient");
          (!o || o === "auto") && (o = r.get("left") === "right" && s === "vertical" ? "right" : "left");
          var l = r.get("selector", !0),
            u = r.get("selectorPosition", !0);
          (l && (!u || u === "auto") && (u = s === "horizontal" ? "end" : "start"),
            this.renderInner(o, r, n, i, l, s, u));
          var f = Vc(r, i).refContainer,
            h = r.getBoxLayoutParams(),
            c = r.get("padding"),
            v = bi(h, f, c),
            d = this.layoutInner(r, o, v, a, l, u),
            p = bi(mt({ width: d.width, height: d.height }, h), f, c);
          ((this.group.x = p.x - d.x),
            (this.group.y = p.y - d.y),
            this.group.markRedraw(),
            this.group.add((this._backgroundEl = hR(d, r))));
        }
      }),
      (t.prototype.resetInner = function () {
        (this.getContentGroup().removeAll(),
          this._backgroundEl && this.group.remove(this._backgroundEl),
          this.getSelectorGroup().removeAll());
      }),
      (t.prototype.renderInner = function (r, n, i, a, o, s, l) {
        var u = this.getContentGroup(),
          f = Q(),
          h = n.get("selectedMode"),
          c = n.get("triggerEvent"),
          v = [];
        (i.eachRawSeries(function (d) {
          !d.get("legendHoverLink") && v.push(d.id);
        }),
          Vh(
            n.getData(),
            function (d, p) {
              var m = this,
                g = d.get("name");
              if (
                !this.newlineDisabled &&
                (g === "" ||
                  g ===
                    `
`)
              ) {
                var y = new jo();
                ((y.newline = !0), u.add(y));
                return;
              }
              var _ = i.getSeriesByName(g)[0];
              if (!f.get(g))
                if (_) {
                  var S = _.getData(),
                    b = S.getVisual("legendLineStyle") || {},
                    w = S.getVisual("legendIcon"),
                    T = S.getVisual("style"),
                    C = this._createItem(_, g, p, d, n, r, b, T, w, h, a);
                  (C.on("click", ti(Am, g, null, a, v))
                    .on("mouseover", ti(Gh, _.name, null, a, v))
                    .on("mouseout", ti(Uh, _.name, null, a, v)),
                    i.ssr &&
                      C.eachChild(function (A) {
                        var M = ut(A);
                        ((M.seriesIndex = _.seriesIndex), (M.dataIndex = p), (M.ssrType = "legend"));
                      }),
                    c &&
                      C.eachChild(function (A) {
                        m.packEventData(A, n, _, p, g);
                      }),
                    f.set(g, !0));
                } else
                  i.eachRawSeries(function (A) {
                    var M = this;
                    if (!f.get(g) && A.legendVisualProvider) {
                      var D = A.legendVisualProvider;
                      if (!D.containName(g)) return;
                      var P = D.indexOfName(g),
                        x = D.getItemVisual(P, "style"),
                        L = D.getItemVisual(P, "legendIcon"),
                        E = qe(x.fill);
                      E && E[3] === 0 && ((E[3] = 0.2), (x = N(N({}, x), { fill: Xa(E, "rgba") })));
                      var R = this._createItem(A, g, p, d, n, r, {}, x, L, h, a);
                      (R.on("click", ti(Am, null, g, a, v))
                        .on("mouseover", ti(Gh, null, g, a, v))
                        .on("mouseout", ti(Uh, null, g, a, v)),
                        i.ssr &&
                          R.eachChild(function (B) {
                            var O = ut(B);
                            ((O.seriesIndex = A.seriesIndex), (O.dataIndex = p), (O.ssrType = "legend"));
                          }),
                        c &&
                          R.eachChild(function (B) {
                            M.packEventData(B, n, A, p, g);
                          }),
                        f.set(g, !0));
                    }
                  }, this);
            },
            this,
          ),
          o && this._createSelector(o, n, a, s, l));
      }),
      (t.prototype.packEventData = function (r, n, i, a, o) {
        var s = {
          componentType: "legend",
          componentIndex: n.componentIndex,
          dataIndex: a,
          value: o,
          seriesIndex: i.seriesIndex,
        };
        ut(r).eventData = s;
      }),
      (t.prototype._createSelector = function (r, n, i, a, o) {
        var s = this.getSelectorGroup();
        Vh(r, function (u) {
          var f = u.type,
            h = new Wt({
              style: { x: 0, y: 0, align: "center", verticalAlign: "middle" },
              onclick: function () {
                i.dispatchAction({ type: f === "all" ? "legendAllSelect" : "legendInverseSelect", legendId: n.id });
              },
            });
          s.add(h);
          var c = n.getModel("selectorLabel"),
            v = n.getModel(["emphasis", "selectorLabel"]);
          (Cl(h, { normal: c, emphasis: v }, { defaultText: u.title }), th(h));
        });
      }),
      (t.prototype._createItem = function (r, n, i, a, o, s, l, u, f, h, c) {
        var v = r.visualDrawType,
          d = o.get("itemWidth"),
          p = o.get("itemHeight"),
          m = o.isSelected(n),
          g = a.get("symbolRotate"),
          y = a.get("symbolKeepAspect"),
          _ = a.get("icon");
        f = _ || f || "roundRect";
        var S = kR(f, a, l, u, v, m, c),
          b = new jo(),
          w = a.getModel("textStyle");
        if (et(r.getLegendIcon) && (!_ || _ === "inherit"))
          b.add(
            r.getLegendIcon({
              itemWidth: d,
              itemHeight: p,
              icon: f,
              iconRotate: g,
              itemStyle: S.itemStyle,
              lineStyle: S.lineStyle,
              symbolKeepAspect: y,
            }),
          );
        else {
          var T =
            _ === "inherit" && r.getData().getVisual("symbol")
              ? g === "inherit"
                ? r.getData().getVisual("symbolRotate")
                : g
              : 0;
          b.add(
            BR({ itemWidth: d, itemHeight: p, icon: f, iconRotate: T, itemStyle: S.itemStyle, symbolKeepAspect: y }),
          );
        }
        var C = s === "left" ? d + 5 : -5,
          A = s,
          M = o.get("formatter"),
          D = n;
        Y(M) && M ? (D = M.replace("{name}", n ?? "")) : et(M) && (D = M(n));
        var P = m ? w.getTextColor() : a.get("inactiveColor");
        b.add(
          new Wt({
            style: zr(w, { text: D, x: C, y: p / 2, fill: P, align: A, verticalAlign: "middle" }, { inheritColor: P }),
          }),
        );
        var x = new Mt({ shape: b.getBoundingRect(), style: { fill: "transparent" } }),
          L = a.getModel("tooltip");
        return (
          L.get("show") && wl({ el: x, componentModel: o, itemName: n, itemTooltipOption: L.option }),
          b.add(x),
          b.eachChild(function (E) {
            E.silent = !0;
          }),
          (x.silent = !h),
          this.getContentGroup().add(b),
          th(b),
          (b.__legendDataIndex = i),
          b
        );
      }),
      (t.prototype.layoutInner = function (r, n, i, a, o, s) {
        var l = this.getContentGroup(),
          u = this.getSelectorGroup();
        ba(r.get("orient"), l, r.get("itemGap"), i.width, i.height);
        var f = l.getBoundingRect(),
          h = [-f.x, -f.y];
        if ((u.markRedraw(), l.markRedraw(), o)) {
          ba("horizontal", u, r.get("selectorItemGap", !0));
          var c = u.getBoundingRect(),
            v = [-c.x, -c.y],
            d = r.get("selectorButtonGap", !0),
            p = r.getOrient().index,
            m = p === 0 ? "width" : "height",
            g = p === 0 ? "height" : "width",
            y = p === 0 ? "y" : "x";
          (s === "end" ? (v[p] += f[m] + d) : (h[p] += c[m] + d),
            (v[1 - p] += f[g] / 2 - c[g] / 2),
            (u.x = v[0]),
            (u.y = v[1]),
            (l.x = h[0]),
            (l.y = h[1]));
          var _ = { x: 0, y: 0 };
          return ((_[m] = f[m] + d + c[m]), (_[g] = Math.max(f[g], c[g])), (_[y] = Math.min(0, c[y] + v[1 - p])), _);
        } else return ((l.x = h[0]), (l.y = h[1]), this.group.getBoundingRect());
      }),
      (t.prototype.remove = function () {
        (this.getContentGroup().removeAll(), (this._isFirstRender = !0));
      }),
      (t.type = "legend.plain"),
      t
    );
  })(Oe);
function kR(e, t, r, n, i, a, o) {
  function s(m, g) {
    (m.lineWidth === "auto" && (m.lineWidth = g.lineWidth > 0 ? 2 : 0),
      Vh(m, function (y, _) {
        m[_] === "inherit" && (m[_] = g[_]);
      }));
  }
  var l = t.getModel("itemStyle"),
    u = l.getItemStyle(),
    f = e.lastIndexOf("empty", 0) === 0 ? "fill" : "stroke",
    h = l.getShallow("decal");
  ((u.decal = !h || h === "inherit" ? n.decal : _h(h, o)),
    u.fill === "inherit" && (u.fill = n[i]),
    u.stroke === "inherit" && (u.stroke = n[f]),
    u.opacity === "inherit" && (u.opacity = (i === "fill" ? n : r).opacity),
    s(u, n));
  var c = t.getModel("lineStyle"),
    v = c.getLineStyle();
  if (
    (s(v, r),
    u.fill === "auto" && (u.fill = n.fill),
    u.stroke === "auto" && (u.stroke = n.fill),
    v.stroke === "auto" && (v.stroke = n.fill),
    !a)
  ) {
    var d = t.get("inactiveBorderWidth"),
      p = u[f];
    ((u.lineWidth = d === "auto" ? (n.lineWidth > 0 && p ? 2 : 0) : u.lineWidth),
      (u.fill = t.get("inactiveColor")),
      (u.stroke = t.get("inactiveBorderColor")),
      (v.stroke = c.get("inactiveColor")),
      (v.lineWidth = c.get("inactiveWidth")));
  }
  return { itemStyle: u, lineStyle: v };
}
function BR(e) {
  var t = e.icon || "roundRect",
    r = Ti(t, 0, 0, e.itemWidth, e.itemHeight, e.itemStyle.fill, e.symbolKeepAspect);
  return (
    r.setStyle(e.itemStyle),
    (r.rotation = ((e.iconRotate || 0) * Math.PI) / 180),
    r.setOrigin([e.itemWidth / 2, e.itemHeight / 2]),
    t.indexOf("empty") > -1 &&
      ((r.style.stroke = r.style.fill), (r.style.fill = X.color.neutral00), (r.style.lineWidth = 2)),
    r
  );
}
function Am(e, t, r, n) {
  (Uh(e, t, r, n), r.dispatchAction({ type: "legendToggleSelect", name: e ?? t }), Gh(e, t, r, n));
}
function Gh(e, t, r, n) {
  r.usingTHL() || r.dispatchAction({ type: "highlight", seriesName: e, name: t, excludeSeriesId: n });
}
function Uh(e, t, r, n) {
  r.usingTHL() || r.dispatchAction({ type: "downplay", seriesName: e, name: t, excludeSeriesId: n });
}
function ia(e, t, r) {
  var n = e === "allSelect" || e === "inverseSelect",
    i = {},
    a = [];
  r.eachComponent({ mainType: "legend", query: t }, function (s) {
    (n ? s[e]() : s[e](t.name), Mm(s, i), a.push(s.componentIndex));
  });
  var o = {};
  return (
    r.eachComponent("legend", function (s) {
      (I(i, function (l, u) {
        s[l ? "select" : "unSelect"](u);
      }),
        Mm(s, o));
    }),
    n ? { selected: o, legendIndex: a } : { name: t.name, selected: o }
  );
}
function Mm(e, t) {
  var r = t || {};
  return (
    I(e.getData(), function (n) {
      var i = n.get("name");
      if (
        !(
          i ===
            `
` || i === ""
        )
      ) {
        var a = e.isSelected(i);
        Qt(r, i) ? (r[i] = r[i] && a) : (r[i] = a);
      }
    }),
    r
  );
}
function NR(e) {
  (e.registerAction("legendToggleSelect", "legendselectchanged", Rt(ia, "toggleSelected")),
    e.registerAction("legendAllSelect", "legendselectall", Rt(ia, "allSelect")),
    e.registerAction("legendInverseSelect", "legendinverseselect", Rt(ia, "inverseSelect")),
    e.registerAction("legendSelect", "legendselected", Rt(ia, "select")),
    e.registerAction("legendUnSelect", "legendunselected", Rt(ia, "unSelect")));
}
var FR = lc(zR);
function zR(e) {
  var t = e.findComponents({ mainType: "legend" });
  t &&
    t.length &&
    e.filterSeries(function (r) {
      for (var n = 0; n < t.length; n++) if (!t[n].isSelected(r.name)) return !1;
      return !0;
    });
}
function o1(e) {
  (e.registerComponentModel(Hh),
    e.registerComponentView(a1),
    e.registerProcessor(e.PRIORITY.PROCESSOR.SERIES_FILTER, FR),
    e.registerSubTypeDefaulter("legend", function () {
      return "plain";
    }),
    NR(e));
}
var HR = (function (e) {
  V(t, e);
  function t() {
    var r = (e !== null && e.apply(this, arguments)) || this;
    return ((r.type = t.type), r);
  }
  return (
    (t.prototype.setScrollDataIndex = function (r) {
      this.option.scrollDataIndex = r;
    }),
    (t.prototype.init = function (r, n, i) {
      var a = ja(r);
      (e.prototype.init.call(this, r, n, i), Im(this, r, a));
    }),
    (t.prototype.mergeOption = function (r, n) {
      (e.prototype.mergeOption.call(this, r, n), Im(this, this.option, r));
    }),
    (t.type = "legend.scroll"),
    (t.defaultOption = v0(Hh.defaultOption, {
      scrollDataIndex: 0,
      pageButtonItemGap: 5,
      pageButtonGap: null,
      pageButtonPosition: "end",
      pageFormatter: "{current}/{total}",
      pageIcons: {
        horizontal: ["M0,0L12,-10L12,10z", "M0,0L-12,-10L-12,10z"],
        vertical: ["M0,0L20,0L10,-20z", "M0,0L20,0L10,20z"],
      },
      pageIconColor: X.color.accent50,
      pageIconInactiveColor: X.color.accent10,
      pageIconSize: 15,
      pageTextStyle: { color: X.color.tertiary },
      animationDurationUpdate: 800,
    })),
    t
  );
})(Hh);
function Im(e, t, r) {
  var n = e.getOrient(),
    i = [1, 1];
  ((i[n.index] = 0), Hr(t, r, { type: "box", ignoreSize: !!i }));
}
var Lm = Bt,
  mf = ["width", "height"],
  yf = ["x", "y"],
  VR = (function (e) {
    V(t, e);
    function t() {
      var r = (e !== null && e.apply(this, arguments)) || this;
      return ((r.type = t.type), (r.newlineDisabled = !0), (r._currentIndex = 0), r);
    }
    return (
      (t.prototype.init = function () {
        (e.prototype.init.call(this),
          this.group.add((this._containerGroup = new Lm())),
          this._containerGroup.add(this.getContentGroup()),
          this.group.add((this._controllerGroup = new Lm())));
      }),
      (t.prototype.resetInner = function () {
        (e.prototype.resetInner.call(this),
          this._controllerGroup.removeAll(),
          this._containerGroup.removeClipPath(),
          (this._containerGroup.__rectSize = null));
      }),
      (t.prototype.renderInner = function (r, n, i, a, o, s, l) {
        var u = this;
        e.prototype.renderInner.call(this, r, n, i, a, o, s, l);
        var f = this._controllerGroup,
          h = n.get("pageIconSize", !0),
          c = U(h) ? h : [h, h];
        d("pagePrev", 0);
        var v = n.getModel("pageTextStyle");
        (f.add(
          new Wt({
            name: "pageText",
            style: {
              text: "xx/xx",
              fill: v.getTextColor(),
              font: v.getFont(),
              verticalAlign: "middle",
              align: "center",
            },
            silent: !0,
          }),
        ),
          d("pageNext", 1));
        function d(p, m) {
          var g = p + "DataIndex",
            y = Cc(
              n.get("pageIcons", !0)[n.getOrient().name][m],
              { onclick: Tt(u._pageGo, u, g, n, a) },
              { x: -c[0] / 2, y: -c[1] / 2, width: c[0], height: c[1] },
            );
          ((y.name = p), f.add(y));
        }
      }),
      (t.prototype.layoutInner = function (r, n, i, a, o, s) {
        var l = this.getSelectorGroup(),
          u = r.getOrient().index,
          f = mf[u],
          h = yf[u],
          c = mf[1 - u],
          v = yf[1 - u];
        o && ba("horizontal", l, r.get("selectorItemGap", !0));
        var d = r.get("selectorButtonGap", !0),
          p = l.getBoundingRect(),
          m = [-p.x, -p.y],
          g = ot(i);
        o && (g[f] = i[f] - p[f] - d);
        var y = this._layoutContentAndController(r, a, g, u, f, c, v, h);
        if (o) {
          if (s === "end") m[u] += y[f] + d;
          else {
            var _ = p[f] + d;
            ((m[u] -= _), (y[h] -= _));
          }
          ((y[f] += p[f] + d),
            (m[1 - u] += y[v] + y[c] / 2 - p[c] / 2),
            (y[c] = Math.max(y[c], p[c])),
            (y[v] = Math.min(y[v], p[v] + m[1 - u])),
            (l.x = m[0]),
            (l.y = m[1]),
            l.markRedraw());
        }
        return y;
      }),
      (t.prototype._layoutContentAndController = function (r, n, i, a, o, s, l, u) {
        var f = this.getContentGroup(),
          h = this._containerGroup,
          c = this._controllerGroup;
        (ba(r.get("orient"), f, r.get("itemGap"), a ? i.width : null, a ? null : i.height),
          ba("horizontal", c, r.get("pageButtonItemGap", !0)));
        var v = f.getBoundingRect(),
          d = c.getBoundingRect(),
          p = (this._showController = v[o] > i[o]),
          m = [-v.x, -v.y];
        n || (m[a] = f[u]);
        var g = [0, 0],
          y = [-d.x, -d.y],
          _ = q(r.get("pageButtonGap", !0), r.get("itemGap", !0));
        if (p) {
          var S = r.get("pageButtonPosition", !0);
          S === "end" ? (y[a] += i[o] - d[o]) : (g[a] += d[o] + _);
        }
        ((y[1 - a] += v[s] / 2 - d[s] / 2), f.setPosition(m), h.setPosition(g), c.setPosition(y));
        var b = { x: 0, y: 0 };
        if (
          ((b[o] = p ? i[o] : v[o]),
          (b[s] = Math.max(v[s], d[s])),
          (b[l] = Math.min(0, d[l] + y[1 - a])),
          (h.__rectSize = i[o]),
          p)
        ) {
          var w = { x: 0, y: 0 };
          ((w[o] = Math.max(i[o] - d[o] - _, 0)),
            (w[s] = b[s]),
            h.setClipPath(new Mt({ shape: w })),
            (h.__rectSize = w[o]));
        } else
          c.eachChild(function (C) {
            C.attr({ invisible: !0, silent: !0 });
          });
        var T = this._getPageInfo(r);
        return (
          T.pageIndex != null && he(f, { x: T.contentPosition[0], y: T.contentPosition[1] }, p ? r : null),
          this._updatePageInfoView(r, T),
          b
        );
      }),
      (t.prototype._pageGo = function (r, n, i) {
        var a = this._getPageInfo(n)[r];
        a != null && i.dispatchAction({ type: "legendScroll", scrollDataIndex: a, legendId: n.id });
      }),
      (t.prototype._updatePageInfoView = function (r, n) {
        var i = this._controllerGroup;
        I(["pagePrev", "pageNext"], function (f) {
          var h = f + "DataIndex",
            c = n[h] != null,
            v = i.childOfName(f);
          v &&
            (v.setStyle("fill", c ? r.get("pageIconColor", !0) : r.get("pageIconInactiveColor", !0)),
            (v.cursor = c ? "pointer" : "default"));
        });
        var a = i.childOfName("pageText"),
          o = r.get("pageFormatter"),
          s = n.pageIndex,
          l = s != null ? s + 1 : 0,
          u = n.pageCount;
        a &&
          o &&
          a.setStyle(
            "text",
            Y(o)
              ? o.replace("{current}", l == null ? "" : l + "").replace("{total}", u == null ? "" : u + "")
              : o({ current: l, total: u }),
          );
      }),
      (t.prototype._getPageInfo = function (r) {
        var n = r.get("scrollDataIndex", !0),
          i = this.getContentGroup(),
          a = this._containerGroup.__rectSize,
          o = r.getOrient().index,
          s = mf[o],
          l = yf[o],
          u = this._findTargetItemIndex(n),
          f = i.children(),
          h = f[u],
          c = f.length,
          v = c ? 1 : 0,
          d = {
            contentPosition: [i.x, i.y],
            pageCount: v,
            pageIndex: v - 1,
            pagePrevDataIndex: null,
            pageNextDataIndex: null,
          };
        if (!h) return d;
        var p = S(h);
        d.contentPosition[o] = -p.s;
        for (var m = u + 1, g = p, y = p, _ = null; m <= c; ++m)
          ((_ = S(f[m])),
            ((!_ && y.e > g.s + a) || (_ && !b(_, g.s))) &&
              (y.i > g.i ? (g = y) : (g = _),
              g && (d.pageNextDataIndex == null && (d.pageNextDataIndex = g.i), ++d.pageCount)),
            (y = _));
        for (var m = u - 1, g = p, y = p, _ = null; m >= -1; --m)
          ((_ = S(f[m])),
            (!_ || !b(y, _.s)) &&
              g.i < y.i &&
              ((y = g), d.pagePrevDataIndex == null && (d.pagePrevDataIndex = g.i), ++d.pageCount, ++d.pageIndex),
            (g = _));
        return d;
        function S(w) {
          if (w) {
            var T = w.getBoundingRect(),
              C = T[l] + w[l];
            return { s: C, e: C + T[s], i: w.__legendDataIndex };
          }
        }
        function b(w, T) {
          return w.e >= T && w.s <= T + a;
        }
      }),
      (t.prototype._findTargetItemIndex = function (r) {
        if (!this._showController) return 0;
        var n,
          i = this.getContentGroup(),
          a;
        return (
          i.eachChild(function (o, s) {
            var l = o.__legendDataIndex;
            (a == null && l != null && (a = s), l === r && (n = s));
          }),
          n ?? a
        );
      }),
      (t.type = "legend.scroll"),
      t
    );
  })(a1);
function GR(e) {
  e.registerAction("legendScroll", "legendscroll", function (t, r) {
    var n = t.scrollDataIndex;
    n != null &&
      r.eachComponent({ mainType: "legend", subType: "scroll", query: t }, function (i) {
        i.setScrollDataIndex(n);
      });
  });
}
function UR(e) {
  (Vr(o1), e.registerComponentModel(HR), e.registerComponentView(VR), GR(e));
}
function WR(e) {
  (Vr(o1), Vr(UR));
}
const YR = ["uploaded", "downloaded", "seeding", "seedingSize", "bonus", "seedingBonus"];
function XR(e, t, r) {
  const n = {};
  for (const i of YR) {
    const a = t[i];
    if (typeof a == "number" && !isNaN(a))
      if (r) n[i] = 0;
      else if (e) {
        const o = e[i];
        typeof o == "number" && !isNaN(o) ? (n[i] = a - o) : (n[i] = 0);
      } else n[i] = 0;
  }
  return { incremental: n, updatedPrevData: t };
}
async function $R() {
  const e = await I1("getExtStorage", "userInfo"),
    r = l1().getAddedSiteIds,
    n = Object.fromEntries(Object.entries(e).filter(([v]) => r.includes(v))),
    i = new Set();
  for (const v of Object.values(n)) for (const d in v) i.add(d);
  const a = Array.from(i);
  if (a.length === 0)
    return (
      console.debug("[PTD] No valid site data found after filtering"),
      { dailyUserInfo: {}, siteDateRange: {}, incrementalData: {} }
    );
  const o = a.sort(),
    s = o[0],
    l = o[o.length - 1],
    u = Sf({ start: new Date(s + "T00:00:00"), end: new Date(l + "T00:00:00") }).map((v) => bf(v, "yyyy-MM-dd")),
    f = {},
    h = Object.fromEntries(u.map((v) => [v, {}])),
    c = {};
  (console.debug(`[PTD] Filtered out ${Object.keys(e).length - Object.keys(n).length} deleted sites`),
    console.debug("[PTD] Found UserDataStatistic used date ranges:", u));
  for (const [v, d] of Object.entries(n)) {
    const m = Object.keys(d).sort(),
      g = m[0],
      y = m[m.length - 1],
      _ = Sf({ start: new Date(g + "T00:00:00"), end: new Date(y + "T00:00:00") }).map((T) => bf(T, "yyyy-MM-dd"));
    ((f[v] = [_.at(0), _.at(-1)]), (c[v] = {}));
    let S,
      b = null,
      w = !1;
    for (const T of _) {
      if (d[T]) {
        const C = d[T];
        C.status === z1.success && (S = C);
      }
      if (S) {
        h[T][v] = S;
        const C = !w,
          { incremental: A, updatedPrevData: M } = XR(b, S, C);
        ((c[v][T] = A), (b = M), (w = !0));
      }
    }
    console.debug(`[PTD] UserDataStatistic for ${v} loaded, date range: ${_}`);
  }
  return (
    console.debug("[PTD] Incremental data calculated during data loading"),
    { dailyUserInfo: h, siteDateRange: f, incrementalData: c }
  );
}
function Pm(e) {
  const t = new Date(),
    r = F1(t, e - 1);
  return Sf({ start: r, end: t }).map((n) => bf(n, "yyyy-MM-dd"));
}
const ZR = Em({
    __name: "Index",
    setup(e) {
      Vr([RR, LR, WR, fR, e2, rE, NE]);
      const { t } = u1(),
        r = c1(),
        n = v1(),
        i = f1(),
        a = P1("chartContainer"),
        { width: o } = L1(a),
        s = $t(() => 400),
        l = Gl(!1),
        u = Da({ siteDateRange: {}, dailyUserInfo: {}, incrementalData: {} }),
        f = $t(() => Object.keys(u.value.dailyUserInfo)),
        h = $t(() => Object.keys(u.value.siteDateRange)),
        c = Da([]),
        v = $t(() => _v(u.value.dailyUserInfo, c.value)),
        d = $t(() => R1(B1(Object.values(Sv(v.value, (x) => Object.keys(x)))))),
        p = Gl([]),
        m = $t(() => Sv(v.value, (x) => _v(x, p.value)));
      function g(x) {
        return c.value.map((L) =>
          Object.values(m.value[L] ?? {})
            .map((E) => E[x])
            .filter(Yl)
            .reduce((E, R) => (E ?? 0) + (R ?? 0), 0),
        );
      }
      const y = { int: (x) => x.toFixed(0), number: (x) => x.toFixed(2), size: (x) => Fn(x) };
      function _(x) {
        return function (L) {
          let E = "<div>" + L[0].name + "</div>";
          return (
            L.forEach(function (R) {
              const B = y[x[R.seriesIndex] ?? "number"];
              E += `<div style='color: ${R.color}'>` + R.marker + R.seriesName + ": " + B(R.value) + "</div>";
            }),
            E
          );
        };
      }
      const S = $t(() => {
          const x = g("uploaded"),
            L = g("downloaded"),
            E = g("bonus");
          return {
            title: {
              text: `[${i.userName}] ${t("UserDataStatistic.chart.totalSiteBase")}`,
              subtext: `${t("UserDataStatistic.chart.uploadLabel")}: ${Fn(x.at(-1))}, ${t("UserDataStatistic.chart.downloadLabel")}: ${Fn(L.at(-1))}, ${t("levelRequirement.bonus")}: ${(E.at(-1) ?? 0).toFixed(2)}`,
              left: "center",
            },
            tooltip: { trigger: "axis", formatter: _(["size", "size", "number"]) },
            legend: {
              data: [
                t("UserDataStatistic.chart.uploadLabel"),
                t("UserDataStatistic.chart.downloadLabel"),
                t("levelRequirement.bonus"),
              ],
              bottom: 10,
              orient: "horizontal",
            },
            grid: { left: "3%", right: "4%", bottom: "10%", containLabel: !0 },
            xAxis: { type: "category", boundaryGap: !1, data: c.value },
            yAxis: [
              {
                type: "value",
                name: t("UserDataStatistic.chart.dataLabel"),
                position: "left",
                axisLabel: { formatter: Fn },
              },
              {
                type: "value",
                name: t("levelRequirement.bonus"),
                position: "right",
                axisLabel: { formatter: (R) => R.toFixed(0) },
              },
            ],
            series: [
              { name: t("UserDataStatistic.chart.uploadLabel"), type: "line", smooth: !0, data: x, yAxisIndex: 0 },
              { name: t("UserDataStatistic.chart.downloadLabel"), type: "line", smooth: !0, data: L, yAxisIndex: 0 },
              { name: t("levelRequirement.bonus"), type: "line", smooth: !0, data: E, yAxisIndex: 1 },
            ],
          };
        }),
        b = $t(() => {
          const x = g("seeding"),
            L = g("seedingSize");
          return {
            title: {
              text: `[${i.userName}] ${t("UserDataStatistic.chart.totalSiteSeeding")}`,
              subtext: `${t("UserDataStatistic.chart.seedingSizeLabel")}: ${Fn(L.at(-1))}, ${t("common.count")}: ${(x.at(-1) ?? 0).toFixed(2)}`,
              left: "center",
            },
            tooltip: { trigger: "axis", formatter: _(["size", "int"]) },
            legend: {
              data: [t("UserDataStatistic.chart.seedingSizeLabel"), t("UserDataStatistic.chart.seedingLabel")],
              bottom: 10,
              orient: "horizontal",
            },
            grid: { left: "3%", right: "4%", bottom: "10%", outerBoundsMode: "same", outerBoundsContain: "axisLabel" },
            xAxis: { type: "category", boundaryGap: !1, data: c.value },
            yAxis: [
              {
                type: "value",
                name: t("UserDataStatistic.chart.seedingSizeLabel"),
                position: "left",
                axisLabel: { formatter: Fn },
              },
              {
                type: "value",
                name: t("UserDataStatistic.chart.seedingLabel"),
                position: "right",
                axisLabel: { formatter: (E) => E.toFixed(0) },
              },
            ],
            series: [
              { name: t("UserDataStatistic.chart.seedingSizeLabel"), type: "line", smooth: !0, data: L, yAxisIndex: 0 },
              { name: t("UserDataStatistic.chart.seedingLabel"), type: "line", smooth: !0, data: x, yAxisIndex: 1 },
            ],
          };
        }),
        w = Gl(-1);
      function T(x) {
        w.value = x?.seriesIndex ?? -1;
      }
      const C = (x, L, E = !1) =>
          $t(() => {
            const R = p.value.map((O) => {
                let k;
                return (
                  E
                    ? (k = c.value.map((z) => {
                        const H = u.value.incrementalData[O]?.[z]?.[x];
                        return Yl(H) ? H : Number(H) || 0;
                      }))
                    : (k = c.value.map((z) => {
                        const H = m.value[z]?.[O]?.[x];
                        return Yl(H) ? H : Number(H) || 0;
                      })),
                  { name: O, type: "bar", emphasis: { focus: "series" }, stack: "site", data: k }
                );
              }),
              B = R.map((O) => ({ name: O.name, value: O.data.reduce((k, z) => k + z, 0) }));
            return {
              title: {
                text: `[${i.userName}] ${t("UserDataStatistic.chart.perSiteK" + x + (E ? "Incr" : ""))}`,
                left: "center",
              },
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                formatter: (O) => {
                  let k = "";
                  const z = O?.[0]?.name ?? "No Date";
                  k += `<span class="font-weight-bold">${z}</span><br>`;
                  const H = O.some((G) => Number(G.data)),
                    W = O.reduce((G, K) => G + (Number(K.data) || 0), 0);
                  let $ = 0;
                  if (H) {
                    ((k += '<table style="width: 100%;">'),
                      (k += `<tr class="font-weight-bold" style="border-bottom: 1pt solid black;"><td class="pr-3">${t("UserDataStatistic.chart.totalLabel")}</td><td class="pr-3 text-right">${y[L](W)}</td><td class="text-right">100%</td></tr>`));
                    const G = O.sort((K, at) => at.data - K.data);
                    for (const K of G) {
                      const at = Number(K.data) || 0;
                      if (at === 0) continue;
                      const Et = K.seriesName,
                        Jt = Wl[Et]?.siteName ?? Et,
                        yt = Wl[Et]?.faviconSrc ?? O1,
                        Dt = (at / W) * 100,
                        tt = w.value === K.seriesIndex;
                      if (!tt && Math.abs(Dt) < (i.userStatisticControl.hidePerSitePrecentThreshold ?? 0)) {
                        $++;
                        continue;
                      }
                      k += `<tr style='${tt ? `color: ${K.color};` : ""}'>
<td class="pr-3"><div class="d-inline-flex align-center"><img src="${yt}" class="mr-1" style="width:16px; height: 16px; " alt="${Jt}">${Jt}</div></td>
<td class="pr-3 text-right">${y[L](K.value)}</td>
<td class="text-right">${Dt.toFixed(2)}%</td>
</tr>`;
                    }
                    ($ > 0 &&
                      (k += `<tr><td colspan="3" class="text-right">${t("UserDataStatistic.chart.hiddenSites", { count: $ })}</td></tr>`),
                      (k += "</table>"));
                  } else k += `${t("UserDataStatistic.chart.noData")}`;
                  return k;
                },
              },
              legend: {
                data: B.sort((O, k) => k.value - O.value).map((O) => O.name),
                bottom: 10,
                orient: "horizontal",
                type: "scroll",
                formatter: (O) => Wl[O].siteName ?? O,
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "10%",
                outerBoundsMode: "same",
                outerBoundsContain: "axisLabel",
              },
              xAxis: { type: "category", boundaryGap: !0, data: c.value },
              yAxis: [{ type: "value", name: t("UserDataStatistic.chart.dataLabel"), axisLabel: { formatter: y[L] } }],
              series: R,
            };
          }),
        A = [
          ["uploaded", "size"],
          ["downloaded", "size"],
          ["seeding", "int"],
          ["seedingSize", "size"],
          ["bonus", "number"],
          ["seedingBonus", "number"],
        ],
        M = $t(() => (i.uiTheme === "dark" ? "dark" : null));
      (k1(yS, M),
        Wh(async () => {
          ((u.value = await $R()), await H1(Object.keys(u.value.siteDateRange)));
          const { days: x = -1, sites: L = [] } = r.query ?? {},
            E = x > 0 ? x : i.userStatisticControl.dateRange;
          (typeof E == "number"
            ? (c.value = Pm(E))
            : (E === "custom" && (i.userStatisticControl.dateRange = "all"), (c.value = f.value)),
            L.length > 0
              ? (p.value = L)
              : (i.userStatisticControl.selectedSites ?? []).length > 0
                ? (p.value = i.userStatisticControl.selectedSites)
                : (p.value = h.value),
            i.userName === "" && (i.userName = i.getUserNames.perfName));
        }));
      async function D() {
        const x = bv(new Date()),
          L = document.createElement("canvas"),
          E = document.querySelectorAll("#chartContainer canvas");
        ((L.width = o.value), (L.height = (s.value + 10) * E.length + 10));
        const R = L.getContext("2d");
        ((R.fillStyle = "white"), R.fillRect(0, 0, L.width, L.height));
        let B = 0;
        for (const z of E) (R.drawImage(z, 0, B, z.clientWidth, z.clientHeight), (B += s.value + 10));
        ((R.font = "12px Arial"), (R.fillStyle = "#b5b5b5"), (R.textAlign = "right"));
        const O = o.value - 10,
          k = B;
        (R.fillText("Created By PT-Depiler (v0.0.6.1740+c969e7b) at " + x, O, k),
          L.toBlob((z) => {
            s1.saveAs(z, t("UserDataStatistic.chart.exportFilename", { name: i.userName, date: x }) + ".png");
          }));
      }
      function P() {
        ((i.userStatisticControl.selectedSites = p.value),
          i.$save(),
          b1().showSnakebar(t("common.saveSuccess"), { color: "success" }));
      }
      return (x, L) => (
        ve(),
        Yr(h1, null, {
          default: lt(() => [
            rt(
              yr,
              { class: "pa-2", justify: "start" },
              {
                default: lt(() => [
                  rt(
                    se,
                    { ref: "chartContainer", id: "chartContainer", style: { "max-width": "800px" } },
                    {
                      default: lt(() => [
                        it(i).userStatisticControl.showChart.totalSiteBase
                          ? (ve(),
                            Yr(
                              it(Wo),
                              {
                                key: 0,
                                option: S.value,
                                style: eo({ height: `${s.value}px` }),
                                autoresize: "",
                                class: "chart",
                                group: "totalSiteBase",
                              },
                              null,
                              8,
                              ["option", "style"],
                            ))
                          : ro("", !0),
                        it(i).userStatisticControl.showChart.totalSiteSeeding
                          ? (ve(),
                            Yr(
                              it(Wo),
                              {
                                key: 1,
                                option: b.value,
                                style: eo({ height: `${s.value}px` }),
                                autoresize: "",
                                class: "chart",
                                group: "totalSiteSeeding",
                              },
                              null,
                              8,
                              ["option", "style"],
                            ))
                          : ro("", !0),
                        (ve(),
                        Fi(
                          zi,
                          null,
                          no(
                            A,
                            ([E, R]) => (
                              ve(),
                              Fi(
                                zi,
                                { key: E },
                                [
                                  it(i).userStatisticControl.showChart[`perSiteK${E}`]
                                    ? (ve(),
                                      Yr(
                                        it(Wo),
                                        {
                                          key: 0,
                                          group: `perSiteK${E}`,
                                          option: C(E, R).value,
                                          style: eo({ height: `${s.value}px` }),
                                          autoresize: "",
                                          class: "chart",
                                          onMousemove: T,
                                        },
                                        null,
                                        8,
                                        ["group", "option", "style"],
                                      ))
                                    : ro("", !0),
                                  it(i).userStatisticControl.showChart[`perSiteK${E}Incr`]
                                    ? (ve(),
                                      Yr(
                                        it(Wo),
                                        {
                                          key: 1,
                                          group: `perSiteK${E}Incr`,
                                          option: C(E, R, !0).value,
                                          style: eo({ height: `${s.value}px` }),
                                          autoresize: "",
                                          class: "chart",
                                          onMousemove: T,
                                        },
                                        null,
                                        8,
                                        ["group", "option", "style"],
                                      ))
                                    : ro("", !0),
                                ],
                                64,
                              )
                            ),
                          ),
                          64,
                        )),
                      ]),
                      _: 1,
                    },
                    512,
                  ),
                  rt(se, null, {
                    default: lt(() => [
                      rt(
                        yr,
                        { class: "flex-nowrap mb-0" },
                        {
                          default: lt(() => [
                            rt(
                              se,
                              { class: "d-flex" },
                              {
                                default: lt(() => [
                                  rt(
                                    Ul,
                                    {
                                      color: "grey",
                                      icon: "mdi-arrow-left",
                                      text: it(t)("common.back"),
                                      onClick: L[0] || (L[0] = () => it(n).back()),
                                    },
                                    null,
                                    8,
                                    ["text"],
                                  ),
                                  rt(d1),
                                  rt(
                                    Ul,
                                    {
                                      color: "info",
                                      icon: "mdi-file-export-outline",
                                      text: it(t)("common.exportImage"),
                                      onClick: D,
                                    },
                                    null,
                                    8,
                                    ["text"],
                                  ),
                                  rt(
                                    Ul,
                                    {
                                      color: "green",
                                      icon: "mdi-content-save",
                                      text: it(t)("common.saveSettings"),
                                      onClick: P,
                                    },
                                    null,
                                    8,
                                    ["text"],
                                  ),
                                ]),
                                _: 1,
                              },
                            ),
                          ]),
                          _: 1,
                        },
                      ),
                      rt(
                        wv,
                        { title: it(t)("UserDataStatistic.chart.chartStyleSettings"), type: "info", class: "mb-2" },
                        null,
                        8,
                        ["title"],
                      ),
                      rt(yr, null, {
                        default: lt(() => [
                          rt(
                            se,
                            { "align-self": "center" },
                            {
                              default: lt(() => [
                                rt(to, null, { default: lt(() => [Xr($r(it(t)("common.username")), 1)]), _: 1 }),
                              ]),
                              _: 1,
                            },
                          ),
                          rt(
                            se,
                            { cols: "12", sm: "10" },
                            {
                              default: lt(() => [
                                rt(
                                  p1,
                                  {
                                    modelValue: it(i).userName,
                                    "onUpdate:modelValue": L[2] || (L[2] = (E) => (it(i).userName = E)),
                                    readonly: !l.value,
                                    "append-inner-icon": "mdi-history",
                                    items: Object.keys(it(i).getUserNames.names),
                                    "hide-details": "",
                                    label: it(t)("common.username"),
                                    "onClick:appendInner":
                                      L[3] || (L[3] = () => (it(i).userName = it(i).getUserNames.perfName)),
                                  },
                                  {
                                    prepend: lt(() => [
                                      rt(
                                        g1,
                                        {
                                          color: l.value ? "success" : "",
                                          icon: l.value ? "mdi-lock-open" : "mdi-lock",
                                          onClick: L[1] || (L[1] = (E) => (l.value = !l.value)),
                                        },
                                        null,
                                        8,
                                        ["color", "icon"],
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["modelValue", "readonly", "items", "label"],
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      }),
                      rt(yr, null, {
                        default: lt(() => [
                          rt(
                            se,
                            { "align-self": "center" },
                            {
                              default: lt(() => [
                                rt(to, null, {
                                  default: lt(() => [Xr($r(it(t)("UserDataStatistic.chart.displayChart")), 1)]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            },
                          ),
                          rt(
                            se,
                            { cols: "12", sm: "10" },
                            {
                              default: lt(() => [
                                rt(yr, null, {
                                  default: lt(() => [
                                    (ve(!0),
                                    Fi(
                                      zi,
                                      null,
                                      no(
                                        it(i).userStatisticControl.showChart,
                                        (E, R) => (
                                          ve(),
                                          Yr(
                                            se,
                                            { class: "py-0", key: R, cols: "6" },
                                            {
                                              default: lt(() => [
                                                rt(
                                                  Tv,
                                                  {
                                                    modelValue: it(i).userStatisticControl.showChart[R],
                                                    "onUpdate:modelValue": (B) =>
                                                      (it(i).userStatisticControl.showChart[R] = B),
                                                    label: it(t)("UserDataStatistic.chart." + R),
                                                    density: "compact",
                                                    "hide-details": "",
                                                  },
                                                  null,
                                                  8,
                                                  ["modelValue", "onUpdate:modelValue", "label"],
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
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      }),
                      rt(yr, null, {
                        default: lt(() => [
                          rt(
                            se,
                            { "align-self": "center" },
                            {
                              default: lt(() => [
                                rt(to, null, {
                                  default: lt(() => [Xr($r(it(t)("UserDataStatistic.chart.dateRange")), 1)]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            },
                          ),
                          rt(
                            se,
                            { cols: "12", sm: "10" },
                            {
                              default: lt(() => [
                                rt(
                                  m1,
                                  {
                                    modelValue: it(i).userStatisticControl.dateRange,
                                    "onUpdate:modelValue":
                                      L[6] || (L[6] = (E) => (it(i).userStatisticControl.dateRange = E)),
                                    density: "comfortable",
                                    mandatory: "",
                                    variant: "tonal",
                                    class: "overflow-x-auto",
                                    color: "blue",
                                  },
                                  {
                                    default: lt(() => [
                                      (ve(),
                                      Fi(
                                        zi,
                                        null,
                                        no([7, 30, 60, 90, 180], (E) =>
                                          rt(
                                            zl,
                                            { key: E, value: E, onClick: () => (c.value = it(Pm)(E)) },
                                            {
                                              default: lt(() => [
                                                Xr($r(it(t)("UserDataStatistic.dateRange.day", [E])), 1),
                                              ]),
                                              _: 2,
                                            },
                                            1032,
                                            ["value", "onClick"],
                                          ),
                                        ),
                                        64,
                                      )),
                                      rt(
                                        zl,
                                        { value: "custom" },
                                        {
                                          default: lt(() => [
                                            Xr($r(it(t)("UserDataStatistic.dateRange.custom")) + " ", 1),
                                            rt(
                                              y1,
                                              { "close-on-content-click": !1, activator: "parent" },
                                              {
                                                default: lt(() => [
                                                  rt(
                                                    V1,
                                                    {
                                                      max: f.value.at(-1),
                                                      min: f.value.at(0),
                                                      "hide-header": "",
                                                      multiple: "range",
                                                      "show-adjacent-months": "",
                                                      "onUpdate:modelValue":
                                                        L[4] ||
                                                        (L[4] = (E) => {
                                                          ((c.value = E.map((R) => it(bv)(R, "yyyy-MM-dd"))),
                                                            (it(i).userStatisticControl.dateRange = "custom"));
                                                        }),
                                                    },
                                                    null,
                                                    8,
                                                    ["max", "min"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                      ),
                                      rt(
                                        zl,
                                        { value: "all", onClick: L[5] || (L[5] = (E) => (c.value = f.value)) },
                                        {
                                          default: lt(() => [Xr($r(it(t)("UserDataStatistic.dateRange.all")), 1)]),
                                          _: 1,
                                        },
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["modelValue"],
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      }),
                      rt(yr, null, {
                        default: lt(() => [
                          rt(
                            se,
                            { "align-self": "center" },
                            {
                              default: lt(() => [
                                rt(to, null, {
                                  default: lt(() => [Xr($r(it(t)("UserDataStatistic.chart.chartSettings")), 1)]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            },
                          ),
                          rt(
                            se,
                            { cols: "12", sm: "10" },
                            {
                              default: lt(() => [
                                rt(
                                  G1,
                                  {
                                    modelValue: it(i).userStatisticControl.hidePerSitePrecentThreshold,
                                    "onUpdate:modelValue":
                                      L[7] ||
                                      (L[7] = (E) => (it(i).userStatisticControl.hidePerSitePrecentThreshold = E)),
                                    max: 100,
                                    min: 0,
                                    precision: 2,
                                    step: 1,
                                    controlVariant: "default",
                                    hint: it(t)("UserDataStatistic.chart.hideLowPercentHint"),
                                    label: it(t)("UserDataStatistic.chart.hideLowPercentLabel"),
                                    "persistent-hint": "",
                                    suffix: "%",
                                  },
                                  null,
                                  8,
                                  ["modelValue", "hint", "label"],
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      }),
                      rt(
                        wv,
                        {
                          class: "mt-4 mb-2",
                          title: it(t)("UserDataStatistic.chart.displaySiteSettings"),
                          type: "info",
                        },
                        {
                          append: lt(() => [
                            rt(
                              N1,
                              {
                                modelValue: p.value,
                                "onUpdate:modelValue": L[8] || (L[8] = (E) => (p.value = E)),
                                all: h.value,
                                color: "grey",
                              },
                              null,
                              8,
                              ["modelValue", "all"],
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["title"],
                      ),
                      rt(
                        yr,
                        { class: "my-2" },
                        {
                          default: lt(() => [
                            (ve(!0),
                            Fi(
                              zi,
                              null,
                              no(
                                h.value,
                                (E) => (
                                  ve(),
                                  Yr(
                                    se,
                                    { key: E, class: "py-0", cols: "6", sm: "3" },
                                    {
                                      default: lt(() => [
                                        rt(
                                          Tv,
                                          {
                                            modelValue: p.value,
                                            "onUpdate:modelValue": L[9] || (L[9] = (R) => (p.value = R)),
                                            disabled: !d.value.includes(E),
                                            indeterminate: !d.value.includes(E),
                                            value: E,
                                            density: "compact",
                                            "hide-details": "",
                                            "indeterminate-icon": "mdi-close",
                                            multiple: "",
                                          },
                                          {
                                            label: lt(() => [
                                              rt(_1, { "site-id": E, size: 16 }, null, 8, ["site-id"]),
                                              rt(S1, { "site-id": E, tag: "p", class: E1(["ml-1"]) }, null, 8, [
                                                "site-id",
                                              ]),
                                            ]),
                                            _: 2,
                                          },
                                          1032,
                                          ["modelValue", "disabled", "indeterminate", "value"],
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
          ]),
          _: 1,
        })
      );
    },
  }),
  gO = w1(ZR, [["__scopeId", "data-v-d9c1e782"]]);
export { gO as default };
