import { u as ge } from "../../../url-join/url-join-Cu798wIg.js";
import { bn as Pt, al as Nt } from "../../site/index-COeZNva1.js";
import { A as Nr } from "../AbstractBackupServer-0VMguH3S.js";
import { l as Er } from "../utils-BmKctBTI.js";
import "../../../jszip/jszip.min-DP3ssR4z.js";
import "../../../../assets/_commonjs-dynamic-modules-TDtrdbi3.js";
import "../../../crypto-js/index-B0NDMIdm.js";
import "../../../../assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
var kt = {};
/*! For license information please see index.js.LICENSE.txt */ var Ar = {
    2(r) {
      function t(s, i, a) {
        (s instanceof RegExp && (s = e(s, a)), i instanceof RegExp && (i = e(i, a)));
        var o = n(s, i, a);
        return (
          o && {
            start: o[0],
            end: o[1],
            pre: a.slice(0, o[0]),
            body: a.slice(o[0] + s.length, o[1]),
            post: a.slice(o[1] + i.length),
          }
        );
      }
      function e(s, i) {
        var a = i.match(s);
        return a ? a[0] : null;
      }
      function n(s, i, a) {
        var o,
          p,
          l,
          u,
          c,
          h = a.indexOf(s),
          d = a.indexOf(i, h + 1),
          g = h;
        if (h >= 0 && d > 0) {
          for (o = [], l = a.length; g >= 0 && !c; )
            (g == h
              ? (o.push(g), (h = a.indexOf(s, g + 1)))
              : o.length == 1
                ? (c = [o.pop(), d])
                : ((p = o.pop()) < l && ((l = p), (u = d)), (d = a.indexOf(i, g + 1))),
              (g = h < d && h >= 0 ? h : d));
          o.length && (c = [l, u]);
        }
        return c;
      }
      ((r.exports = t), (t.range = n));
    },
    101(r, t, e) {
      var n;
      ((r = e.nmd(r)),
        (function () {
          var s = (r && r.exports, typeof Nt == "object" && Nt);
          s.global !== s && s.window;
          var i = function (u) {
            this.message = u;
          };
          (i.prototype = new Error()).name = "InvalidCharacterError";
          var a = function (u) {
              throw new i(u);
            },
            o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            p = /[\t\n\f\r ]/g,
            l = {
              encode: function (u) {
                ((u = String(u)),
                  /[^\0-\xFF]/.test(u) &&
                    a("The string to be encoded contains characters outside of the Latin1 range."));
                for (var c, h, d, g, f = u.length % 3, m = "", y = -1, v = u.length - f; ++y < v; )
                  ((c = u.charCodeAt(y) << 16),
                    (h = u.charCodeAt(++y) << 8),
                    (d = u.charCodeAt(++y)),
                    (m +=
                      o.charAt(((g = c + h + d) >> 18) & 63) +
                      o.charAt((g >> 12) & 63) +
                      o.charAt((g >> 6) & 63) +
                      o.charAt(63 & g)));
                return (
                  f == 2
                    ? ((c = u.charCodeAt(y) << 8),
                      (h = u.charCodeAt(++y)),
                      (m += o.charAt((g = c + h) >> 10) + o.charAt((g >> 4) & 63) + o.charAt((g << 2) & 63) + "="))
                    : f == 1 && ((g = u.charCodeAt(y)), (m += o.charAt(g >> 2) + o.charAt((g << 4) & 63) + "==")),
                  m
                );
              },
              decode: function (u) {
                var c = (u = String(u).replace(p, "")).length;
                (c % 4 == 0 && (c = (u = u.replace(/==?$/, "")).length),
                  (c % 4 == 1 || /[^+a-zA-Z0-9/]/.test(u)) &&
                    a("Invalid character: the string to be decoded is not correctly encoded."));
                for (var h, d, g = 0, f = "", m = -1; ++m < c; )
                  ((d = o.indexOf(u.charAt(m))),
                    (h = g % 4 ? 64 * h + d : d),
                    g++ % 4 && (f += String.fromCharCode(255 & (h >> ((-2 * g) & 6)))));
                return f;
              },
              version: "1.0.0",
            };
          (n = function () {
            return l;
          }.call(t, e, t, r)) === void 0 || (r.exports = n);
        })());
    },
    172(r, t) {
      t.d = function (e) {
        if (!e) return 0;
        for (var n = (e = e.toString()).length, s = e.length; s--; ) {
          var i = e.charCodeAt(s);
          (56320 <= i && i <= 57343 && s--, 127 < i && i <= 2047 ? n++ : 2047 < i && i <= 65535 && (n += 2));
        }
        return n;
      };
    },
    526(r) {
      var t = {
        utf8: {
          stringToBytes: function (e) {
            return t.bin.stringToBytes(unescape(encodeURIComponent(e)));
          },
          bytesToString: function (e) {
            return decodeURIComponent(escape(t.bin.bytesToString(e)));
          },
        },
        bin: {
          stringToBytes: function (e) {
            for (var n = [], s = 0; s < e.length; s++) n.push(255 & e.charCodeAt(s));
            return n;
          },
          bytesToString: function (e) {
            for (var n = [], s = 0; s < e.length; s++) n.push(String.fromCharCode(e[s]));
            return n.join("");
          },
        },
      };
      r.exports = t;
    },
    298(r) {
      var t, e;
      ((t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),
        (e = {
          rotl: function (n, s) {
            return (n << s) | (n >>> (32 - s));
          },
          rotr: function (n, s) {
            return (n << (32 - s)) | (n >>> s);
          },
          endian: function (n) {
            if (n.constructor == Number) return (16711935 & e.rotl(n, 8)) | (4278255360 & e.rotl(n, 24));
            for (var s = 0; s < n.length; s++) n[s] = e.endian(n[s]);
            return n;
          },
          randomBytes: function (n) {
            for (var s = []; n > 0; n--) s.push(Math.floor(256 * Math.random()));
            return s;
          },
          bytesToWords: function (n) {
            for (var s = [], i = 0, a = 0; i < n.length; i++, a += 8) s[a >>> 5] |= n[i] << (24 - (a % 32));
            return s;
          },
          wordsToBytes: function (n) {
            for (var s = [], i = 0; i < 32 * n.length; i += 8) s.push((n[i >>> 5] >>> (24 - (i % 32))) & 255);
            return s;
          },
          bytesToHex: function (n) {
            for (var s = [], i = 0; i < n.length; i++)
              (s.push((n[i] >>> 4).toString(16)), s.push((15 & n[i]).toString(16)));
            return s.join("");
          },
          hexToBytes: function (n) {
            for (var s = [], i = 0; i < n.length; i += 2) s.push(parseInt(n.substr(i, 2), 16));
            return s;
          },
          bytesToBase64: function (n) {
            for (var s = [], i = 0; i < n.length; i += 3)
              for (var a = (n[i] << 16) | (n[i + 1] << 8) | n[i + 2], o = 0; o < 4; o++)
                8 * i + 6 * o <= 8 * n.length ? s.push(t.charAt((a >>> (6 * (3 - o))) & 63)) : s.push("=");
            return s.join("");
          },
          base64ToBytes: function (n) {
            n = n.replace(/[^A-Z0-9+\/]/gi, "");
            for (var s = [], i = 0, a = 0; i < n.length; a = ++i % 4)
              a != 0 &&
                s.push(
                  ((t.indexOf(n.charAt(i - 1)) & (Math.pow(2, -2 * a + 8) - 1)) << (2 * a)) |
                    (t.indexOf(n.charAt(i)) >>> (6 - 2 * a)),
                );
            return s;
          },
        }),
        (r.exports = e));
    },
    135(r) {
      function t(e) {
        return !!e.constructor && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e);
      }
      r.exports = function (e) {
        return (
          e != null &&
          (t(e) ||
            (function (n) {
              return typeof n.readFloatLE == "function" && typeof n.slice == "function" && t(n.slice(0, 0));
            })(e) ||
            !!e._isBuffer)
        );
      };
    },
    542(r, t, e) {
      (function () {
        var n = e(298),
          s = e(526).utf8,
          i = e(135),
          a = e(526).bin,
          o = function (p, l) {
            p.constructor == String
              ? (p = l && l.encoding === "binary" ? a.stringToBytes(p) : s.stringToBytes(p))
              : i(p)
                ? (p = Array.prototype.slice.call(p, 0))
                : Array.isArray(p) || p.constructor === Uint8Array || (p = p.toString());
            for (
              var u = n.bytesToWords(p),
                c = 8 * p.length,
                h = 1732584193,
                d = -271733879,
                g = -1732584194,
                f = 271733878,
                m = 0;
              m < u.length;
              m++
            )
              u[m] = (16711935 & ((u[m] << 8) | (u[m] >>> 24))) | (4278255360 & ((u[m] << 24) | (u[m] >>> 8)));
            ((u[c >>> 5] |= 128 << (c % 32)), (u[14 + (((c + 64) >>> 9) << 4)] = c));
            var y = o._ff,
              v = o._gg,
              b = o._hh,
              x = o._ii;
            for (m = 0; m < u.length; m += 16) {
              var w = h,
                N = d,
                A = g,
                P = f;
              ((h = y(h, d, g, f, u[m + 0], 7, -680876936)),
                (f = y(f, h, d, g, u[m + 1], 12, -389564586)),
                (g = y(g, f, h, d, u[m + 2], 17, 606105819)),
                (d = y(d, g, f, h, u[m + 3], 22, -1044525330)),
                (h = y(h, d, g, f, u[m + 4], 7, -176418897)),
                (f = y(f, h, d, g, u[m + 5], 12, 1200080426)),
                (g = y(g, f, h, d, u[m + 6], 17, -1473231341)),
                (d = y(d, g, f, h, u[m + 7], 22, -45705983)),
                (h = y(h, d, g, f, u[m + 8], 7, 1770035416)),
                (f = y(f, h, d, g, u[m + 9], 12, -1958414417)),
                (g = y(g, f, h, d, u[m + 10], 17, -42063)),
                (d = y(d, g, f, h, u[m + 11], 22, -1990404162)),
                (h = y(h, d, g, f, u[m + 12], 7, 1804603682)),
                (f = y(f, h, d, g, u[m + 13], 12, -40341101)),
                (g = y(g, f, h, d, u[m + 14], 17, -1502002290)),
                (h = v(h, (d = y(d, g, f, h, u[m + 15], 22, 1236535329)), g, f, u[m + 1], 5, -165796510)),
                (f = v(f, h, d, g, u[m + 6], 9, -1069501632)),
                (g = v(g, f, h, d, u[m + 11], 14, 643717713)),
                (d = v(d, g, f, h, u[m + 0], 20, -373897302)),
                (h = v(h, d, g, f, u[m + 5], 5, -701558691)),
                (f = v(f, h, d, g, u[m + 10], 9, 38016083)),
                (g = v(g, f, h, d, u[m + 15], 14, -660478335)),
                (d = v(d, g, f, h, u[m + 4], 20, -405537848)),
                (h = v(h, d, g, f, u[m + 9], 5, 568446438)),
                (f = v(f, h, d, g, u[m + 14], 9, -1019803690)),
                (g = v(g, f, h, d, u[m + 3], 14, -187363961)),
                (d = v(d, g, f, h, u[m + 8], 20, 1163531501)),
                (h = v(h, d, g, f, u[m + 13], 5, -1444681467)),
                (f = v(f, h, d, g, u[m + 2], 9, -51403784)),
                (g = v(g, f, h, d, u[m + 7], 14, 1735328473)),
                (h = b(h, (d = v(d, g, f, h, u[m + 12], 20, -1926607734)), g, f, u[m + 5], 4, -378558)),
                (f = b(f, h, d, g, u[m + 8], 11, -2022574463)),
                (g = b(g, f, h, d, u[m + 11], 16, 1839030562)),
                (d = b(d, g, f, h, u[m + 14], 23, -35309556)),
                (h = b(h, d, g, f, u[m + 1], 4, -1530992060)),
                (f = b(f, h, d, g, u[m + 4], 11, 1272893353)),
                (g = b(g, f, h, d, u[m + 7], 16, -155497632)),
                (d = b(d, g, f, h, u[m + 10], 23, -1094730640)),
                (h = b(h, d, g, f, u[m + 13], 4, 681279174)),
                (f = b(f, h, d, g, u[m + 0], 11, -358537222)),
                (g = b(g, f, h, d, u[m + 3], 16, -722521979)),
                (d = b(d, g, f, h, u[m + 6], 23, 76029189)),
                (h = b(h, d, g, f, u[m + 9], 4, -640364487)),
                (f = b(f, h, d, g, u[m + 12], 11, -421815835)),
                (g = b(g, f, h, d, u[m + 15], 16, 530742520)),
                (h = x(h, (d = b(d, g, f, h, u[m + 2], 23, -995338651)), g, f, u[m + 0], 6, -198630844)),
                (f = x(f, h, d, g, u[m + 7], 10, 1126891415)),
                (g = x(g, f, h, d, u[m + 14], 15, -1416354905)),
                (d = x(d, g, f, h, u[m + 5], 21, -57434055)),
                (h = x(h, d, g, f, u[m + 12], 6, 1700485571)),
                (f = x(f, h, d, g, u[m + 3], 10, -1894986606)),
                (g = x(g, f, h, d, u[m + 10], 15, -1051523)),
                (d = x(d, g, f, h, u[m + 1], 21, -2054922799)),
                (h = x(h, d, g, f, u[m + 8], 6, 1873313359)),
                (f = x(f, h, d, g, u[m + 15], 10, -30611744)),
                (g = x(g, f, h, d, u[m + 6], 15, -1560198380)),
                (d = x(d, g, f, h, u[m + 13], 21, 1309151649)),
                (h = x(h, d, g, f, u[m + 4], 6, -145523070)),
                (f = x(f, h, d, g, u[m + 11], 10, -1120210379)),
                (g = x(g, f, h, d, u[m + 2], 15, 718787259)),
                (d = x(d, g, f, h, u[m + 9], 21, -343485551)),
                (h = (h + w) >>> 0),
                (d = (d + N) >>> 0),
                (g = (g + A) >>> 0),
                (f = (f + P) >>> 0));
            }
            return n.endian([h, d, g, f]);
          };
        ((o._ff = function (p, l, u, c, h, d, g) {
          var f = p + ((l & u) | (~l & c)) + (h >>> 0) + g;
          return ((f << d) | (f >>> (32 - d))) + l;
        }),
          (o._gg = function (p, l, u, c, h, d, g) {
            var f = p + ((l & c) | (u & ~c)) + (h >>> 0) + g;
            return ((f << d) | (f >>> (32 - d))) + l;
          }),
          (o._hh = function (p, l, u, c, h, d, g) {
            var f = p + (l ^ u ^ c) + (h >>> 0) + g;
            return ((f << d) | (f >>> (32 - d))) + l;
          }),
          (o._ii = function (p, l, u, c, h, d, g) {
            var f = p + (u ^ (l | ~c)) + (h >>> 0) + g;
            return ((f << d) | (f >>> (32 - d))) + l;
          }),
          (o._blocksize = 16),
          (o._digestsize = 16),
          (r.exports = function (p, l) {
            if (p == null) throw new Error("Illegal argument " + p);
            var u = n.wordsToBytes(o(p, l));
            return l && l.asBytes ? u : l && l.asString ? a.bytesToString(u) : n.bytesToHex(u);
          }));
      })();
    },
    285(r, t, e) {
      var n = e(2);
      r.exports = function (y, v) {
        if (!y) return [];
        var b = (v = v || {}).max == null ? 1 / 0 : v.max;
        return (
          y.substr(0, 2) === "{}" && (y = "\\{\\}" + y.substr(2)),
          m(
            (function (x) {
              return x
                .split("\\\\")
                .join(s)
                .split("\\{")
                .join(i)
                .split("\\}")
                .join(a)
                .split("\\,")
                .join(o)
                .split("\\.")
                .join(p);
            })(y),
            b,
            !0,
          ).map(u)
        );
      };
      var s = "\0SLASH" + Math.random() + "\0",
        i = "\0OPEN" + Math.random() + "\0",
        a = "\0CLOSE" + Math.random() + "\0",
        o = "\0COMMA" + Math.random() + "\0",
        p = "\0PERIOD" + Math.random() + "\0";
      function l(y) {
        return parseInt(y, 10) == y ? parseInt(y, 10) : y.charCodeAt(0);
      }
      function u(y) {
        return y.split(s).join("\\").split(i).join("{").split(a).join("}").split(o).join(",").split(p).join(".");
      }
      function c(y) {
        if (!y) return [""];
        var v = [],
          b = n("{", "}", y);
        if (!b) return y.split(",");
        var x = b.pre,
          w = b.body,
          N = b.post,
          A = x.split(",");
        A[A.length - 1] += "{" + w + "}";
        var P = c(N);
        return (N.length && ((A[A.length - 1] += P.shift()), A.push.apply(A, P)), v.push.apply(v, A), v);
      }
      function h(y) {
        return "{" + y + "}";
      }
      function d(y) {
        return /^-?0\d/.test(y);
      }
      function g(y, v) {
        return y <= v;
      }
      function f(y, v) {
        return y >= v;
      }
      function m(y, v, b) {
        var x = [],
          w = n("{", "}", y);
        if (!w) return [y];
        var N = w.pre,
          A = w.post.length ? m(w.post, v, !1) : [""];
        if (/\$$/.test(w.pre))
          for (var P = 0; P < A.length && P < v; P++) {
            var T = N + "{" + w.body + "}" + A[P];
            x.push(T);
          }
        else {
          var S,
            H,
            wt = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(w.body),
            E = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(w.body),
            X = wt || E,
            xt = w.body.indexOf(",") >= 0;
          if (!X && !xt) return w.post.match(/,(?!,).*\}/) ? m((y = w.pre + "{" + w.body + a + w.post), v, !0) : [y];
          if (X) S = w.body.split(/\.\./);
          else if ((S = c(w.body)).length === 1 && (S = m(S[0], v, !1).map(h)).length === 1)
            return A.map(function (xr) {
              return w.pre + S[0] + xr;
            });
          if (X) {
            var ut = l(S[0]),
              B = l(S[1]),
              Y = Math.max(S[0].length, S[1].length),
              lt = S.length == 3 ? Math.max(Math.abs(l(S[2])), 1) : 1,
              ht = g;
            B < ut && ((lt *= -1), (ht = f));
            var ct = S.some(d);
            H = [];
            for (var pt = ut; ht(pt, B); pt += lt) {
              var J;
              if (E) (J = String.fromCharCode(pt)) === "\\" && (J = "");
              else if (((J = String(pt)), ct)) {
                var pe = Y - J.length;
                if (pe > 0) {
                  var fe = new Array(pe + 1).join("0");
                  J = pt < 0 ? "-" + fe + J.slice(1) : fe + J;
                }
              }
              H.push(J);
            }
          } else {
            H = [];
            for (var tt = 0; tt < S.length; tt++) H.push.apply(H, m(S[tt], v, !1));
          }
          for (tt = 0; tt < H.length; tt++)
            for (P = 0; P < A.length && x.length < v; P++) ((T = N + H[tt] + A[P]), (!b || X || T) && x.push(T));
        }
        return x;
      }
    },
    829(r) {
      function t(l) {
        return (
          (t =
            typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
              ? function (u) {
                  return typeof u;
                }
              : function (u) {
                  return u && typeof Symbol == "function" && u.constructor === Symbol && u !== Symbol.prototype
                    ? "symbol"
                    : typeof u;
                }),
          t(l)
        );
      }
      function e(l) {
        var u = typeof Map == "function" ? new Map() : void 0;
        return (
          (e = function (c) {
            if (c === null || ((h = c), Function.toString.call(h).indexOf("[native code]") === -1)) return c;
            var h;
            if (typeof c != "function") throw new TypeError("Super expression must either be null or a function");
            if (u !== void 0) {
              if (u.has(c)) return u.get(c);
              u.set(c, d);
            }
            function d() {
              return n(c, arguments, i(this).constructor);
            }
            return (
              (d.prototype = Object.create(c.prototype, {
                constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 },
              })),
              s(d, c)
            );
          }),
          e(l)
        );
      }
      function n(l, u, c) {
        return (
          (n = (function () {
            if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
            if (typeof Proxy == "function") return !0;
            try {
              return (Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0);
            } catch {
              return !1;
            }
          })()
            ? Reflect.construct
            : function (h, d, g) {
                var f = [null];
                f.push.apply(f, d);
                var m = new (Function.bind.apply(h, f))();
                return (g && s(m, g.prototype), m);
              }),
          n.apply(null, arguments)
        );
      }
      function s(l, u) {
        return (
          (s =
            Object.setPrototypeOf ||
            function (c, h) {
              return ((c.__proto__ = h), c);
            }),
          s(l, u)
        );
      }
      function i(l) {
        return (
          (i = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (u) {
                return u.__proto__ || Object.getPrototypeOf(u);
              }),
          i(l)
        );
      }
      var a = (function (l) {
        function u(c) {
          var h;
          return (
            (function (d, g) {
              if (!(d instanceof g)) throw new TypeError("Cannot call a class as a function");
            })(this, u),
            ((h = (function (d, g) {
              return !g || (t(g) !== "object" && typeof g != "function")
                ? (function (f) {
                    if (f === void 0)
                      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return f;
                  })(d)
                : g;
            })(this, i(u).call(this, c))).name = "ObjectPrototypeMutationError"),
            h
          );
        }
        return (
          (function (c, h) {
            if (typeof h != "function" && h !== null)
              throw new TypeError("Super expression must either be null or a function");
            ((c.prototype = Object.create(h && h.prototype, {
              constructor: { value: c, writable: !0, configurable: !0 },
            })),
              h && s(c, h));
          })(u, l),
          u
        );
      })(e(Error));
      function o(l, u) {
        for (
          var c = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function () {},
            h = u.split("."),
            d = h.length,
            g = function (y) {
              var v = h[y];
              if (!l) return { v: void 0 };
              if (v === "+") {
                if (Array.isArray(l))
                  return {
                    v: l.map(function (x, w) {
                      var N = h.slice(y + 1);
                      return N.length > 0 ? o(x, N.join("."), c) : c(l, w, h, y);
                    }),
                  };
                var b = h.slice(0, y).join(".");
                throw new Error("Object at wildcard (".concat(b, ") is not an array"));
              }
              l = c(l, v, h, y);
            },
            f = 0;
          f < d;
          f++
        ) {
          var m = g(f);
          if (t(m) === "object") return m.v;
        }
        return l;
      }
      function p(l, u) {
        return l.length === u + 1;
      }
      r.exports = {
        set: function (l, u, c) {
          if (t(l) != "object" || l === null || u === void 0) return l;
          if (typeof u == "number") return ((l[u] = c), l[u]);
          try {
            return o(l, u, function (h, d, g, f) {
              if (h === Reflect.getPrototypeOf({})) throw new a("Attempting to mutate Object.prototype");
              if (!h[d]) {
                var m = Number.isInteger(Number(g[f + 1])),
                  y = g[f + 1] === "+";
                h[d] = m || y ? [] : {};
              }
              return (p(g, f) && (h[d] = c), h[d]);
            });
          } catch (h) {
            if (h instanceof a) throw h;
            return l;
          }
        },
        get: function (l, u) {
          if (t(l) != "object" || l === null || u === void 0) return l;
          if (typeof u == "number") return l[u];
          try {
            return o(l, u, function (c, h) {
              return c[h];
            });
          } catch {
            return l;
          }
        },
        has: function (l, u) {
          var c = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          if (t(l) != "object" || l === null || u === void 0) return !1;
          if (typeof u == "number") return u in l;
          try {
            var h = !1;
            return (
              o(l, u, function (d, g, f, m) {
                if (!p(f, m)) return d && d[g];
                h = c.own ? d.hasOwnProperty(g) : g in d;
              }),
              h
            );
          } catch {
            return !1;
          }
        },
        hasOwn: function (l, u, c) {
          return this.has(l, u, c || { own: !0 });
        },
        isIn: function (l, u, c) {
          var h = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
          if (t(l) != "object" || l === null || u === void 0) return !1;
          try {
            var d = !1,
              g = !1;
            return (
              o(l, u, function (f, m, y, v) {
                return (
                  (d = d || f === c || (!!f && f[m] === c)),
                  (g = p(y, v) && t(f) === "object" && m in f),
                  f && f[m]
                );
              }),
              h.validPath ? d && g : d
            );
          } catch {
            return !1;
          }
        },
        ObjectPrototypeMutationError: a,
      };
    },
    47(r, t, e) {
      var n = e(410),
        s = function (l) {
          return typeof l == "string";
        };
      function i(l, u) {
        for (var c = [], h = 0; h < l.length; h++) {
          var d = l[h];
          d &&
            d !== "." &&
            (d === ".." ? (c.length && c[c.length - 1] !== ".." ? c.pop() : u && c.push("..")) : c.push(d));
        }
        return c;
      }
      var a = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
        o = {};
      function p(l) {
        return a.exec(l).slice(1);
      }
      ((o.resolve = function () {
        for (var l = "", u = !1, c = arguments.length - 1; c >= -1 && !u; c--) {
          var h = c >= 0 ? arguments[c] : Pt.cwd();
          if (!s(h)) throw new TypeError("Arguments to path.resolve must be strings");
          h && ((l = h + "/" + l), (u = h.charAt(0) === "/"));
        }
        return (u ? "/" : "") + (l = i(l.split("/"), !u).join("/")) || ".";
      }),
        (o.normalize = function (l) {
          var u = o.isAbsolute(l),
            c = l.substr(-1) === "/";
          return ((l = i(l.split("/"), !u).join("/")) || u || (l = "."), l && c && (l += "/"), (u ? "/" : "") + l);
        }),
        (o.isAbsolute = function (l) {
          return l.charAt(0) === "/";
        }),
        (o.join = function () {
          for (var l = "", u = 0; u < arguments.length; u++) {
            var c = arguments[u];
            if (!s(c)) throw new TypeError("Arguments to path.join must be strings");
            c && (l += l ? "/" + c : c);
          }
          return o.normalize(l);
        }),
        (o.relative = function (l, u) {
          function c(v) {
            for (var b = 0; b < v.length && v[b] === ""; b++);
            for (var x = v.length - 1; x >= 0 && v[x] === ""; x--);
            return b > x ? [] : v.slice(b, x + 1);
          }
          ((l = o.resolve(l).substr(1)), (u = o.resolve(u).substr(1)));
          for (var h = c(l.split("/")), d = c(u.split("/")), g = Math.min(h.length, d.length), f = g, m = 0; m < g; m++)
            if (h[m] !== d[m]) {
              f = m;
              break;
            }
          var y = [];
          for (m = f; m < h.length; m++) y.push("..");
          return (y = y.concat(d.slice(f))).join("/");
        }),
        (o._makeLong = function (l) {
          return l;
        }),
        (o.dirname = function (l) {
          var u = p(l),
            c = u[0],
            h = u[1];
          return c || h ? (h && (h = h.substr(0, h.length - 1)), c + h) : ".";
        }),
        (o.basename = function (l, u) {
          var c = p(l)[2];
          return (u && c.substr(-1 * u.length) === u && (c = c.substr(0, c.length - u.length)), c);
        }),
        (o.extname = function (l) {
          return p(l)[3];
        }),
        (o.format = function (l) {
          if (!n.isObject(l)) throw new TypeError("Parameter 'pathObject' must be an object, not " + typeof l);
          var u = l.root || "";
          if (!s(u)) throw new TypeError("'pathObject.root' must be a string or undefined, not " + typeof l.root);
          return (l.dir ? l.dir + o.sep : "") + (l.base || "");
        }),
        (o.parse = function (l) {
          if (!s(l)) throw new TypeError("Parameter 'pathString' must be a string, not " + typeof l);
          var u = p(l);
          if (!u || u.length !== 4) throw new TypeError("Invalid path '" + l + "'");
          return (
            (u[1] = u[1] || ""),
            (u[2] = u[2] || ""),
            (u[3] = u[3] || ""),
            {
              root: u[0],
              dir: u[0] + u[1].slice(0, u[1].length - 1),
              base: u[2],
              ext: u[3],
              name: u[2].slice(0, u[2].length - u[3].length),
            }
          );
        }),
        (o.sep = "/"),
        (o.delimiter = ":"),
        (r.exports = o));
    },
    647(r, t) {
      var e = Object.prototype.hasOwnProperty;
      function n(i) {
        try {
          return decodeURIComponent(i.replace(/\+/g, " "));
        } catch {
          return null;
        }
      }
      function s(i) {
        try {
          return encodeURIComponent(i);
        } catch {
          return null;
        }
      }
      ((t.stringify = function (i, a) {
        a = a || "";
        var o,
          p,
          l = [];
        for (p in (typeof a != "string" && (a = "?"), i))
          if (e.call(i, p)) {
            if (((o = i[p]) || (o != null && !isNaN(o)) || (o = ""), (p = s(p)), (o = s(o)), p === null || o === null))
              continue;
            l.push(p + "=" + o);
          }
        return l.length ? a + l.join("&") : "";
      }),
        (t.parse = function (i) {
          for (var a, o = /([^=?#&]+)=?([^&]*)/g, p = {}; (a = o.exec(i)); ) {
            var l = n(a[1]),
              u = n(a[2]);
            l === null || u === null || l in p || (p[l] = u);
          }
          return p;
        }));
    },
    670(r) {
      r.exports = function (t, e) {
        if (((e = e.split(":")[0]), !(t = +t))) return !1;
        switch (e) {
          case "http":
          case "ws":
            return t !== 80;
          case "https":
          case "wss":
            return t !== 443;
          case "ftp":
            return t !== 21;
          case "gopher":
            return t !== 70;
          case "file":
            return !1;
        }
        return t !== 0;
      };
    },
    737(r, t, e) {
      var n = e(670),
        s = e(647),
        i = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/,
        a = /[\n\r\t]/g,
        o = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//,
        p = /:\d+$/,
        l = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i,
        u = /^[a-zA-Z]:/;
      function c(v) {
        return (v || "").toString().replace(i, "");
      }
      var h = [
          ["#", "hash"],
          ["?", "query"],
          function (v, b) {
            return f(b.protocol) ? v.replace(/\\/g, "/") : v;
          },
          ["/", "pathname"],
          ["@", "auth", 1],
          [NaN, "host", void 0, 1, 1],
          [/:(\d*)$/, "port", void 0, 1],
          [NaN, "hostname", void 0, 1, 1],
        ],
        d = { hash: 1, query: 1 };
      function g(v) {
        var b,
          x = (typeof window < "u" ? window : typeof Nt < "u" ? Nt : typeof self < "u" ? self : {}).location || {},
          w = {},
          N = typeof (v = v || x);
        if (v.protocol === "blob:") w = new y(unescape(v.pathname), {});
        else if (N === "string") for (b in ((w = new y(v, {})), d)) delete w[b];
        else if (N === "object") {
          for (b in v) b in d || (w[b] = v[b]);
          w.slashes === void 0 && (w.slashes = o.test(v.href));
        }
        return w;
      }
      function f(v) {
        return v === "file:" || v === "ftp:" || v === "http:" || v === "https:" || v === "ws:" || v === "wss:";
      }
      function m(v, b) {
        ((v = (v = c(v)).replace(a, "")), (b = b || {}));
        var x,
          w = l.exec(v),
          N = w[1] ? w[1].toLowerCase() : "",
          A = !!w[2],
          P = !!w[3],
          T = 0;
        return (
          A
            ? P
              ? ((x = w[2] + w[3] + w[4]), (T = w[2].length + w[3].length))
              : ((x = w[2] + w[4]), (T = w[2].length))
            : P
              ? ((x = w[3] + w[4]), (T = w[3].length))
              : (x = w[4]),
          N === "file:"
            ? T >= 2 && (x = x.slice(2))
            : f(N)
              ? (x = w[4])
              : N
                ? A && (x = x.slice(2))
                : T >= 2 && f(b.protocol) && (x = w[4]),
          { protocol: N, slashes: A || f(N), slashesCount: T, rest: x }
        );
      }
      function y(v, b, x) {
        if (((v = (v = c(v)).replace(a, "")), !(this instanceof y))) return new y(v, b, x);
        var w,
          N,
          A,
          P,
          T,
          S,
          H = h.slice(),
          wt = typeof b,
          E = this,
          X = 0;
        for (
          wt !== "object" && wt !== "string" && ((x = b), (b = null)),
            x && typeof x != "function" && (x = s.parse),
            w = !(N = m(v || "", (b = g(b)))).protocol && !N.slashes,
            E.slashes = N.slashes || (w && b.slashes),
            E.protocol = N.protocol || b.protocol || "",
            v = N.rest,
            ((N.protocol === "file:" && (N.slashesCount !== 2 || u.test(v))) ||
              (!N.slashes && (N.protocol || N.slashesCount < 2 || !f(E.protocol)))) &&
              (H[3] = [/(.*)/, "pathname"]);
          X < H.length;
          X++
        )
          typeof (P = H[X]) != "function"
            ? ((A = P[0]),
              (S = P[1]),
              A != A
                ? (E[S] = v)
                : typeof A == "string"
                  ? ~(T = A === "@" ? v.lastIndexOf(A) : v.indexOf(A)) &&
                    (typeof P[2] == "number"
                      ? ((E[S] = v.slice(0, T)), (v = v.slice(T + P[2])))
                      : ((E[S] = v.slice(T)), (v = v.slice(0, T))))
                  : (T = A.exec(v)) && ((E[S] = T[1]), (v = v.slice(0, T.index))),
              (E[S] = E[S] || (w && P[3] && b[S]) || ""),
              P[4] && (E[S] = E[S].toLowerCase()))
            : (v = P(v, E));
        (x && (E.query = x(E.query)),
          w &&
            b.slashes &&
            E.pathname.charAt(0) !== "/" &&
            (E.pathname !== "" || b.pathname !== "") &&
            (E.pathname = (function (xt, ut) {
              if (xt === "") return ut;
              for (
                var B = (ut || "/").split("/").slice(0, -1).concat(xt.split("/")),
                  Y = B.length,
                  lt = B[Y - 1],
                  ht = !1,
                  ct = 0;
                Y--;
              )
                B[Y] === "."
                  ? B.splice(Y, 1)
                  : B[Y] === ".."
                    ? (B.splice(Y, 1), ct++)
                    : ct && (Y === 0 && (ht = !0), B.splice(Y, 1), ct--);
              return (ht && B.unshift(""), (lt !== "." && lt !== "..") || B.push(""), B.join("/"));
            })(E.pathname, b.pathname)),
          E.pathname.charAt(0) !== "/" && f(E.protocol) && (E.pathname = "/" + E.pathname),
          n(E.port, E.protocol) || ((E.host = E.hostname), (E.port = "")),
          (E.username = E.password = ""),
          E.auth &&
            (~(T = E.auth.indexOf(":"))
              ? ((E.username = E.auth.slice(0, T)),
                (E.username = encodeURIComponent(decodeURIComponent(E.username))),
                (E.password = E.auth.slice(T + 1)),
                (E.password = encodeURIComponent(decodeURIComponent(E.password))))
              : (E.username = encodeURIComponent(decodeURIComponent(E.auth))),
            (E.auth = E.password ? E.username + ":" + E.password : E.username)),
          (E.origin = E.protocol !== "file:" && f(E.protocol) && E.host ? E.protocol + "//" + E.host : "null"),
          (E.href = E.toString()));
      }
      ((y.prototype = {
        set: function (v, b, x) {
          var w = this;
          switch (v) {
            case "query":
              (typeof b == "string" && b.length && (b = (x || s.parse)(b)), (w[v] = b));
              break;
            case "port":
              ((w[v] = b),
                n(b, w.protocol) ? b && (w.host = w.hostname + ":" + b) : ((w.host = w.hostname), (w[v] = "")));
              break;
            case "hostname":
              ((w[v] = b), w.port && (b += ":" + w.port), (w.host = b));
              break;
            case "host":
              ((w[v] = b),
                p.test(b)
                  ? ((b = b.split(":")), (w.port = b.pop()), (w.hostname = b.join(":")))
                  : ((w.hostname = b), (w.port = "")));
              break;
            case "protocol":
              ((w.protocol = b.toLowerCase()), (w.slashes = !x));
              break;
            case "pathname":
            case "hash":
              if (b) {
                var N = v === "pathname" ? "/" : "#";
                w[v] = b.charAt(0) !== N ? N + b : b;
              } else w[v] = b;
              break;
            case "username":
            case "password":
              w[v] = encodeURIComponent(b);
              break;
            case "auth":
              var A = b.indexOf(":");
              ~A
                ? ((w.username = b.slice(0, A)),
                  (w.username = encodeURIComponent(decodeURIComponent(w.username))),
                  (w.password = b.slice(A + 1)),
                  (w.password = encodeURIComponent(decodeURIComponent(w.password))))
                : (w.username = encodeURIComponent(decodeURIComponent(b)));
          }
          for (var P = 0; P < h.length; P++) {
            var T = h[P];
            T[4] && (w[T[1]] = w[T[1]].toLowerCase());
          }
          return (
            (w.auth = w.password ? w.username + ":" + w.password : w.username),
            (w.origin = w.protocol !== "file:" && f(w.protocol) && w.host ? w.protocol + "//" + w.host : "null"),
            (w.href = w.toString()),
            w
          );
        },
        toString: function (v) {
          (v && typeof v == "function") || (v = s.stringify);
          var b,
            x = this,
            w = x.host,
            N = x.protocol;
          N && N.charAt(N.length - 1) !== ":" && (N += ":");
          var A = N + ((x.protocol && x.slashes) || f(x.protocol) ? "//" : "");
          return (
            x.username
              ? ((A += x.username), x.password && (A += ":" + x.password), (A += "@"))
              : x.password
                ? ((A += ":" + x.password), (A += "@"))
                : x.protocol !== "file:" && f(x.protocol) && !w && x.pathname !== "/" && (A += "@"),
            (w[w.length - 1] === ":" || (p.test(x.hostname) && !x.port)) && (w += ":"),
            (A += w + x.pathname),
            (b = typeof x.query == "object" ? v(x.query) : x.query) && (A += b.charAt(0) !== "?" ? "?" + b : b),
            x.hash && (A += x.hash),
            A
          );
        },
      }),
        (y.extractProtocol = m),
        (y.location = g),
        (y.trimLeft = c),
        (y.qs = s),
        (r.exports = y));
    },
    410() {},
    388() {},
    805() {},
    345() {},
    800() {},
  },
  de = {};
function C(r) {
  var t = de[r];
  if (t !== void 0) return t.exports;
  var e = (de[r] = { id: r, loaded: !1, exports: {} });
  return (Ar[r].call(e.exports, e, e.exports, C), (e.loaded = !0), e.exports);
}
((C.n = (r) => {
  var t = r && r.__esModule ? () => r.default : () => r;
  return (C.d(t, { a: t }), t);
}),
  (C.d = (r, t) => {
    for (var e in t) C.o(t, e) && !C.o(r, e) && Object.defineProperty(r, e, { enumerable: !0, get: t[e] });
  }),
  (C.o = (r, t) => Object.prototype.hasOwnProperty.call(r, t)),
  (C.nmd = (r) => ((r.paths = []), r.children || (r.children = []), r)));
var Pr = C(737),
  Sr = C.n(Pr);
function Lt(r) {
  if (!Ht(r)) throw new Error("Parameter was not an error");
}
function Ht(r) {
  return (
    (!!r && typeof r == "object" && ((t = r), Object.prototype.toString.call(t) === "[object Error]")) ||
    r instanceof Error
  );
  var t;
}
class F extends Error {
  constructor(t, e) {
    const n = [...arguments],
      { options: s, shortMessage: i } = (function (o) {
        let p,
          l = "";
        if (o.length === 0) p = {};
        else if (Ht(o[0])) ((p = { cause: o[0] }), (l = o.slice(1).join(" ") || ""));
        else if (o[0] && typeof o[0] == "object") ((p = Object.assign({}, o[0])), (l = o.slice(1).join(" ") || ""));
        else {
          if (typeof o[0] != "string") throw new Error("Invalid arguments passed to Layerr");
          ((p = {}), (l = l = o.join(" ") || ""));
        }
        return { options: p, shortMessage: l };
      })(n);
    let a = i;
    if (
      (s.cause && (a = `${a}: ${s.cause.message}`),
      super(a),
      (this.message = a),
      s.name && typeof s.name == "string" ? (this.name = s.name) : (this.name = "Layerr"),
      s.cause && Object.defineProperty(this, "_cause", { value: s.cause }),
      Object.defineProperty(this, "_info", { value: {} }),
      s.info && typeof s.info == "object" && Object.assign(this._info, s.info),
      Error.captureStackTrace)
    ) {
      const o = s.constructorOpt || this.constructor;
      Error.captureStackTrace(this, o);
    }
  }
  static cause(t) {
    return (Lt(t), t._cause && Ht(t._cause) ? t._cause : null);
  }
  static fullStack(t) {
    Lt(t);
    const e = F.cause(t);
    return e
      ? `${t.stack}
caused by: ${F.fullStack(e)}`
      : (t.stack ?? "");
  }
  static info(t) {
    Lt(t);
    const e = {},
      n = F.cause(t);
    return (n && Object.assign(e, F.info(n)), t._info && Object.assign(e, t._info), e);
  }
  toString() {
    let t = this.name || this.constructor.name || this.constructor.prototype.name;
    return (this.message && (t = `${t}: ${this.message}`), t);
  }
}
var Tr = C(47),
  St = C.n(Tr);
const me = "__PATH_SEPARATOR_POSIX__",
  ye = "__PATH_SEPARATOR_WINDOWS__";
function O(r) {
  try {
    const t = r.replace(/\//g, me).replace(/\\\\/g, ye);
    return encodeURIComponent(t).split(ye).join("\\\\").split(me).join("/");
  } catch (t) {
    throw new F(t, "Failed encoding path");
  }
}
function ve(r) {
  return r.startsWith("/") ? r : "/" + r;
}
function bt(r) {
  let t = r;
  return (t[0] !== "/" && (t = "/" + t), /^.+\/$/.test(t) && (t = t.substr(0, t.length - 1)), t);
}
function Cr(r) {
  let t = new (Sr())(r).pathname;
  return (t.length <= 0 && (t = "/"), bt(t));
}
function _() {
  for (var r = arguments.length, t = new Array(r), e = 0; e < r; e++) t[e] = arguments[e];
  return (function () {
    return (function (n) {
      var s = [];
      if (n.length === 0) return "";
      if (typeof n[0] != "string") throw new TypeError("Url must be a string. Received " + n[0]);
      if (n[0].match(/^[^/:]+:\/*$/) && n.length > 1) {
        var i = n.shift();
        n[0] = i + n[0];
      }
      n[0].match(/^file:\/\/\//)
        ? (n[0] = n[0].replace(/^([^/:]+):\/*/, "$1:///"))
        : (n[0] = n[0].replace(/^([^/:]+):\/*/, "$1://"));
      for (var a = 0; a < n.length; a++) {
        var o = n[a];
        if (typeof o != "string") throw new TypeError("Url must be a string. Received " + o);
        o !== "" &&
          (a > 0 && (o = o.replace(/^[\/]+/, "")),
          (o = a < n.length - 1 ? o.replace(/[\/]+$/, "") : o.replace(/[\/]+$/, "/")),
          s.push(o));
      }
      var p = s.join("/"),
        l = (p = p.replace(/\/(\?|&|#[^!])/g, "$1")).split("?");
      return l.shift() + (l.length > 0 ? "?" : "") + l.join("&");
    })(typeof arguments[0] == "object" ? arguments[0] : [].slice.call(arguments));
  })(t.reduce((n, s, i) => ((i === 0 || s !== "/" || (s === "/" && n[n.length - 1] !== "/")) && n.push(s), n), []));
}
var Or = C(542),
  ft = C.n(Or);
function be(r, t) {
  const e = r.url.replace("//", ""),
    n = e.indexOf("/") == -1 ? "/" : e.slice(e.indexOf("/")),
    s = r.method ? r.method.toUpperCase() : "GET",
    i = !!/(^|,)\s*auth\s*($|,)/.test(t.qop) && "auth",
    a = `00000000${t.nc}`.slice(-8),
    o = (function (h, d, g, f, m, y, v) {
      const b = v || ft()(`${d}:${g}:${f}`);
      return h && h.toLowerCase() === "md5-sess" ? ft()(`${b}:${m}:${y}`) : b;
    })(t.algorithm, t.username, t.realm, t.password, t.nonce, t.cnonce, t.ha1),
    p = ft()(`${s}:${n}`),
    l = i ? ft()(`${o}:${t.nonce}:${a}:${t.cnonce}:${i}:${p}`) : ft()(`${o}:${t.nonce}:${p}`),
    u = {
      username: t.username,
      realm: t.realm,
      nonce: t.nonce,
      uri: n,
      qop: i,
      response: l,
      nc: a,
      cnonce: t.cnonce,
      algorithm: t.algorithm,
      opaque: t.opaque,
    },
    c = [];
  for (const h in u)
    u[h] && (h === "qop" || h === "nc" || h === "algorithm" ? c.push(`${h}=${u[h]}`) : c.push(`${h}="${u[h]}"`));
  return `Digest ${c.join(", ")}`;
}
function Ge(r) {
  return ((r.headers && r.headers.get("www-authenticate")) || "").split(/\s/)[0].toLowerCase() === "digest";
}
var _r = C(101),
  qe = C.n(_r);
function we(r) {
  return qe().decode(r);
}
function xe(r, t) {
  var e;
  return `Basic ${((e = `${r}:${t}`), qe().encode(e))}`;
}
const Ne =
    typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope
      ? self
      : typeof window < "u"
        ? window
        : globalThis,
  $r = Ne.fetch.bind(Ne);
let D = (function (r) {
    return (
      (r.Auto = "auto"),
      (r.Digest = "digest"),
      (r.None = "none"),
      (r.Password = "password"),
      (r.Token = "token"),
      r
    );
  })({}),
  Q = (function (r) {
    return (
      (r.DataTypeNoLength = "data-type-no-length"),
      (r.InvalidAuthType = "invalid-auth-type"),
      (r.InvalidOutputFormat = "invalid-output-format"),
      (r.LinkUnsupportedAuthType = "link-unsupported-auth"),
      (r.InvalidUpdateRange = "invalid-update-range"),
      (r.NotSupported = "not-supported"),
      r
    );
  })({});
function He(r, t, e, n, s) {
  switch (r.authType) {
    case D.Auto:
      t && e && (r.headers.Authorization = xe(t, e));
      break;
    case D.Digest:
      r.digest = (function (a, o, p) {
        return { username: a, password: o, ha1: p, nc: 0, algorithm: "md5", hasDigestAuth: !1 };
      })(t, e, s);
      break;
    case D.None:
      break;
    case D.Password:
      r.headers.Authorization = xe(t, e);
      break;
    case D.Token:
      r.headers.Authorization = `${(i = n).token_type} ${i.access_token}`;
      break;
    default:
      throw new F({ info: { code: Q.InvalidAuthType } }, `Invalid auth type: ${r.authType}`);
  }
  var i;
}
(C(345), C(800));
const Ee = "@@HOTPATCHER",
  jr = () => {};
function Rt(r) {
  return { original: r, methods: [r], final: !1 };
}
class Ir {
  constructor() {
    ((this._configuration = { registry: {}, getEmptyAction: "null" }), (this.__type__ = Ee));
  }
  get configuration() {
    return this._configuration;
  }
  get getEmptyAction() {
    return this.configuration.getEmptyAction;
  }
  set getEmptyAction(t) {
    this.configuration.getEmptyAction = t;
  }
  control(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 && arguments[1];
    if (!t || t.__type__ !== Ee)
      throw new Error("Failed taking control of target HotPatcher instance: Invalid type or object");
    return (
      Object.keys(t.configuration.registry).forEach((n) => {
        this.configuration.registry.hasOwnProperty(n)
          ? e && (this.configuration.registry[n] = Object.assign({}, t.configuration.registry[n]))
          : (this.configuration.registry[n] = Object.assign({}, t.configuration.registry[n]));
      }),
      (t._configuration = this.configuration),
      this
    );
  }
  execute(t) {
    const e = this.get(t) || jr;
    for (var n = arguments.length, s = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) s[i - 1] = arguments[i];
    return e(...s);
  }
  get(t) {
    const e = this.configuration.registry[t];
    if (!e)
      switch (this.getEmptyAction) {
        case "null":
          return null;
        case "throw":
          throw new Error(`Failed handling method request: No method provided for override: ${t}`);
        default:
          throw new Error(
            `Failed handling request which resulted in an empty method: Invalid empty-action specified: ${this.getEmptyAction}`,
          );
      }
    return (function () {
      for (var n = arguments.length, s = new Array(n), i = 0; i < n; i++) s[i] = arguments[i];
      if (s.length === 0) throw new Error("Failed creating sequence: No functions provided");
      return function () {
        for (var a = arguments.length, o = new Array(a), p = 0; p < a; p++) o[p] = arguments[p];
        let l = o;
        const u = this;
        for (; s.length > 0; ) l = [s.shift().apply(u, l)];
        return l[0];
      };
    })(...e.methods);
  }
  isPatched(t) {
    return !!this.configuration.registry[t];
  }
  patch(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const { chain: s = !1 } = n;
    if (this.configuration.registry[t] && this.configuration.registry[t].final)
      throw new Error(`Failed patching '${t}': Method marked as being final`);
    if (typeof e != "function") throw new Error(`Failed patching '${t}': Provided method is not a function`);
    if (s)
      this.configuration.registry[t]
        ? this.configuration.registry[t].methods.push(e)
        : (this.configuration.registry[t] = Rt(e));
    else if (this.isPatched(t)) {
      const { original: i } = this.configuration.registry[t];
      this.configuration.registry[t] = Object.assign(Rt(e), { original: i });
    } else this.configuration.registry[t] = Rt(e);
    return this;
  }
  patchInline(t, e) {
    this.isPatched(t) || this.patch(t, e);
    for (var n = arguments.length, s = new Array(n > 2 ? n - 2 : 0), i = 2; i < n; i++) s[i - 2] = arguments[i];
    return this.execute(t, ...s);
  }
  plugin(t) {
    for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), s = 1; s < e; s++) n[s - 1] = arguments[s];
    return (
      n.forEach((i) => {
        this.patch(t, i, { chain: !0 });
      }),
      this
    );
  }
  restore(t) {
    if (!this.isPatched(t)) throw new Error(`Failed restoring method: No method present for key: ${t}`);
    if (typeof this.configuration.registry[t].original != "function")
      throw new Error(`Failed restoring method: Original method not found or of invalid type for key: ${t}`);
    return ((this.configuration.registry[t].methods = [this.configuration.registry[t].original]), this);
  }
  setFinal(t) {
    if (!this.configuration.registry.hasOwnProperty(t))
      throw new Error(`Failed marking '${t}' as final: No method found for key`);
    return ((this.configuration.registry[t].final = !0), this);
  }
}
let Mt = null;
function kr() {
  return (Mt || (Mt = new Ir()), Mt);
}
function Tt(r) {
  return (function (t) {
    if (typeof t != "object" || t === null || Object.prototype.toString.call(t) != "[object Object]") return !1;
    if (Object.getPrototypeOf(t) === null) return !0;
    let e = t;
    for (; Object.getPrototypeOf(e) !== null; ) e = Object.getPrototypeOf(e);
    return Object.getPrototypeOf(t) === e;
  })(r)
    ? Object.assign({}, r)
    : Object.setPrototypeOf(Object.assign({}, r), Object.getPrototypeOf(r));
}
function Ae() {
  for (var r = arguments.length, t = new Array(r), e = 0; e < r; e++) t[e] = arguments[e];
  let n = null,
    s = [...t];
  for (; s.length > 0; ) {
    const i = s.shift();
    n = n ? Ye(n, i) : Tt(i);
  }
  return n;
}
function Ye(r, t) {
  const e = Tt(r);
  return (
    Object.keys(t).forEach((n) => {
      e.hasOwnProperty(n)
        ? Array.isArray(t[n])
          ? (e[n] = Array.isArray(e[n]) ? [...e[n], ...t[n]] : [...t[n]])
          : typeof t[n] == "object" && t[n]
            ? (e[n] = typeof e[n] == "object" && e[n] ? Ye(e[n], t[n]) : Tt(t[n]))
            : (e[n] = t[n])
        : (e[n] = t[n]);
    }),
    e
  );
}
function Lr(r) {
  const t = {};
  for (const e of r.keys()) t[e] = r.get(e);
  return t;
}
function Yt() {
  for (var r = arguments.length, t = new Array(r), e = 0; e < r; e++) t[e] = arguments[e];
  if (t.length === 0) return {};
  const n = {};
  return t.reduce(
    (s, i) => (
      Object.keys(i).forEach((a) => {
        const o = a.toLowerCase();
        n.hasOwnProperty(o) ? (s[n[o]] = i[a]) : ((n[o] = a), (s[a] = i[a]));
      }),
      s
    ),
    {},
  );
}
C(805);
const Rr = typeof ArrayBuffer == "function",
  { toString: Mr } = Object.prototype;
function Ze(r) {
  return Rr && (r instanceof ArrayBuffer || Mr.call(r) === "[object ArrayBuffer]");
}
function Xe(r) {
  return r != null && r.constructor != null && typeof r.constructor.isBuffer == "function" && r.constructor.isBuffer(r);
}
function re(r) {
  return function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    try {
      return Promise.resolve(r.apply(this, t));
    } catch (n) {
      return Promise.reject(n);
    }
  };
}
function Zt(r, t, e) {
  return e ? (t ? t(r) : r) : ((r && r.then) || (r = Promise.resolve(r)), t ? r.then(t) : r);
}
const Je = re(function (r) {
    const t = r._digest;
    return (
      delete r._digest,
      t.hasDigestAuth && (r = Ae(r, { headers: { Authorization: be(r, t) } })),
      Zt(Ct(r), function (e) {
        let n = !1;
        return (
          (s = function (a) {
            return n ? a : e;
          }),
          (i = (function () {
            if (e.status == 401)
              return (
                (t.hasDigestAuth = (function (a, o) {
                  if (!Ge(a)) return !1;
                  const p = /([a-z0-9_-]+)=(?:"([^"]+)"|([a-z0-9_-]+))/gi;
                  for (;;) {
                    const l = (a.headers && a.headers.get("www-authenticate")) || "",
                      u = p.exec(l);
                    if (!u) break;
                    o[u[1]] = u[2] || u[3];
                  }
                  return (
                    (o.nc += 1),
                    (o.cnonce = (function () {
                      let l = "";
                      for (let u = 0; u < 32; ++u) l = `${l}${"abcdef0123456789"[Math.floor(16 * Math.random())]}`;
                      return l;
                    })()),
                    !0
                  );
                })(e, t)),
                (function () {
                  if (t.hasDigestAuth)
                    return Zt(Ct((r = Ae(r, { headers: { Authorization: be(r, t) } }))), function (a) {
                      return (a.status == 401 ? (t.hasDigestAuth = !1) : t.nc++, (n = !0), a);
                    });
                })()
              );
            t.nc++;
          })()) && i.then
            ? i.then(s)
            : s(i)
        );
        var s, i;
      })
    );
  }),
  Dr = re(function (r, t) {
    return Zt(Ct(r), function (e) {
      return e.ok
        ? ((t.authType = D.Password), e)
        : e.status == 401 && Ge(e)
          ? ((t.authType = D.Digest), He(t, t.username, t.password, void 0, void 0), (r._digest = t.digest), Je(r))
          : e;
    });
  }),
  j = re(function (r, t) {
    return t.authType === D.Auto ? Dr(r, t) : r._digest ? Je(r) : Ct(r);
  });
function I(r, t, e) {
  const n = Tt(r);
  return (
    (n.headers = Yt(t.headers, n.headers || {}, e.headers || {})),
    e.data !== void 0 && (n.data = e.data),
    e.signal && (n.signal = e.signal),
    t.httpAgent && (n.httpAgent = t.httpAgent),
    t.httpsAgent && (n.httpsAgent = t.httpsAgent),
    t.digest && (n._digest = t.digest),
    typeof t.withCredentials == "boolean" && (n.withCredentials = t.withCredentials),
    n
  );
}
function Ct(r) {
  const t = kr();
  return t.patchInline(
    "request",
    (e) =>
      t.patchInline(
        "fetch",
        $r,
        e.url,
        (function (n) {
          let s = {};
          const i = { method: n.method };
          if ((n.headers && (s = Yt(s, n.headers)), n.data !== void 0)) {
            const [a, o] = (function (p) {
              if (typeof p == "string") return [p, {}];
              if (Xe(p)) return [p, {}];
              if (Ze(p)) return [p, {}];
              if (p && typeof p == "object") return [JSON.stringify(p), { "content-type": "application/json" }];
              throw new Error("Unable to convert request body: Unexpected body type: " + typeof p);
            })(n.data);
            ((i.body = a), (s = Yt(s, o)));
          }
          return (
            n.signal && (i.signal = n.signal),
            n.withCredentials && (i.credentials = "include"),
            (i.headers = s),
            i
          );
        })(e),
      ),
    r,
  );
}
var Ur = C(285);
const Ot = (r) => {
    if (typeof r != "string") throw new TypeError("invalid pattern");
    if (r.length > 65536) throw new TypeError("pattern is too long");
  },
  Fr = {
    "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", !0],
    "[:alpha:]": ["\\p{L}\\p{Nl}", !0],
    "[:ascii:]": ["\\x00-\\x7f", !1],
    "[:blank:]": ["\\p{Zs}\\t", !0],
    "[:cntrl:]": ["\\p{Cc}", !0],
    "[:digit:]": ["\\p{Nd}", !0],
    "[:graph:]": ["\\p{Z}\\p{C}", !0, !0],
    "[:lower:]": ["\\p{Ll}", !0],
    "[:print:]": ["\\p{C}", !0],
    "[:punct:]": ["\\p{P}", !0],
    "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", !0],
    "[:upper:]": ["\\p{Lu}", !0],
    "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", !0],
    "[:xdigit:]": ["A-Fa-f0-9", !1],
  },
  gt = (r) => r.replace(/[[\]\\-]/g, "\\$&"),
  Pe = (r) => r.join(""),
  Vr = (r, t) => {
    const e = t;
    if (r.charAt(e) !== "[") throw new Error("not in a brace expression");
    const n = [],
      s = [];
    let i = e + 1,
      a = !1,
      o = !1,
      p = !1,
      l = !1,
      u = e,
      c = "";
    t: for (; i < r.length; ) {
      const f = r.charAt(i);
      if ((f !== "!" && f !== "^") || i !== e + 1) {
        if (f === "]" && a && !p) {
          u = i + 1;
          break;
        }
        if (((a = !0), f !== "\\" || p)) {
          if (f === "[" && !p) {
            for (const [m, [y, v, b]] of Object.entries(Fr))
              if (r.startsWith(m, i)) {
                if (c) return ["$.", !1, r.length - e, !0];
                ((i += m.length), b ? s.push(y) : n.push(y), (o = o || v));
                continue t;
              }
          }
          ((p = !1),
            c
              ? (f > c ? n.push(gt(c) + "-" + gt(f)) : f === c && n.push(gt(f)), (c = ""), i++)
              : r.startsWith("-]", i + 1)
                ? (n.push(gt(f + "-")), (i += 2))
                : r.startsWith("-", i + 1)
                  ? ((c = f), (i += 2))
                  : (n.push(gt(f)), i++));
        } else ((p = !0), i++);
      } else ((l = !0), i++);
    }
    if (u < i) return ["", !1, 0, !1];
    if (!n.length && !s.length) return ["$.", !1, r.length - e, !0];
    if (s.length === 0 && n.length === 1 && /^\\?.$/.test(n[0]) && !l)
      return [
        ((h = n[0].length === 2 ? n[0].slice(-1) : n[0]), h.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")),
        !1,
        u - e,
        !1,
      ];
    var h;
    const d = "[" + (l ? "^" : "") + Pe(n) + "]",
      g = "[" + (l ? "" : "^") + Pe(s) + "]";
    return [n.length && s.length ? "(" + d + "|" + g + ")" : n.length ? d : g, o, u - e, !0];
  },
  yt = function (r) {
    let { windowsPathsNoEscape: t = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return t
      ? r.replace(/\[([^\/\\])\]/g, "$1")
      : r.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(/\\([^\/])/g, "$1");
  };
var W;
const Wr = new Set(["!", "?", "+", "*", "@"]),
  Xt = (r) => Wr.has(r),
  Se = (r) => Xt(r.type),
  Br = new Map([
    ["!", ["@"]],
    ["?", ["?", "@"]],
    ["@", ["@"]],
    ["*", ["*", "+", "?", "@"]],
    ["+", ["+", "@"]],
  ]),
  zr = new Map([
    ["!", ["?"]],
    ["@", ["?"]],
    ["+", ["?", "*"]],
  ]),
  Gr = new Map([
    ["!", ["?", "@"]],
    ["?", ["?", "@"]],
    ["@", ["?", "@"]],
    ["*", ["*", "+", "?", "@"]],
    ["+", ["+", "@", "?", "*"]],
  ]),
  Te = new Map([
    ["!", new Map([["!", "@"]])],
    [
      "?",
      new Map([
        ["*", "*"],
        ["+", "*"],
      ]),
    ],
    [
      "@",
      new Map([
        ["!", "!"],
        ["?", "?"],
        ["@", "@"],
        ["*", "*"],
        ["+", "+"],
      ]),
    ],
    [
      "+",
      new Map([
        ["?", "*"],
        ["*", "*"],
      ]),
    ],
  ]),
  Dt = "(?!\\.)",
  qr = new Set(["[", "."]),
  Hr = new Set(["..", "."]),
  Yr = new Set("().*{}+?[]^$\\!"),
  ne = "[^/]",
  Ce = ne + "*?",
  Oe = ne + "+?";
class se {
  type;
  #r;
  #n;
  #s = !1;
  #t = [];
  #e;
  #a;
  #l;
  #u = !1;
  #i;
  #o;
  #h = !1;
  constructor(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    ((this.type = t),
      t && (this.#n = !0),
      (this.#e = e),
      (this.#r = this.#e ? this.#e.#r : this),
      (this.#i = this.#r === this ? n : this.#r.#i),
      (this.#l = this.#r === this ? [] : this.#r.#l),
      t !== "!" || this.#r.#u || this.#l.push(this),
      (this.#a = this.#e ? this.#e.#t.length : 0));
  }
  get hasMagic() {
    if (this.#n !== void 0) return this.#n;
    for (const t of this.#t) if (typeof t != "string" && (t.type || t.hasMagic)) return (this.#n = !0);
    return this.#n;
  }
  toString() {
    return this.#o !== void 0
      ? this.#o
      : this.type
        ? (this.#o = this.type + "(" + this.#t.map((t) => String(t)).join("|") + ")")
        : (this.#o = this.#t.map((t) => String(t)).join(""));
  }
  #y() {
    if (this !== this.#r) throw new Error("should only call on root");
    if (this.#u) return this;
    let t;
    for (this.toString(), this.#u = !0; (t = this.#l.pop()); ) {
      if (t.type !== "!") continue;
      let e = t,
        n = e.#e;
      for (; n; ) {
        for (let s = e.#a + 1; !n.type && s < n.#t.length; s++)
          for (const i of t.#t) {
            if (typeof i == "string") throw new Error("string part in extglob AST??");
            i.copyIn(n.#t[s]);
          }
        ((e = n), (n = e.#e));
      }
    }
    return this;
  }
  push() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
    for (const s of e)
      if (s !== "") {
        if (typeof s != "string" && !(s instanceof W && s.#e === this)) throw new Error("invalid part: " + s);
        this.#t.push(s);
      }
  }
  toJSON() {
    const t =
      this.type === null
        ? this.#t.slice().map((e) => (typeof e == "string" ? e : e.toJSON()))
        : [this.type, ...this.#t.map((e) => e.toJSON())];
    return (
      this.isStart() && !this.type && t.unshift([]),
      this.isEnd() && (this === this.#r || (this.#r.#u && this.#e?.type === "!")) && t.push({}),
      t
    );
  }
  isStart() {
    if (this.#r === this) return !0;
    if (!this.#e?.isStart()) return !1;
    if (this.#a === 0) return !0;
    const t = this.#e;
    for (let e = 0; e < this.#a; e++) {
      const n = t.#t[e];
      if (!(n instanceof W && n.type === "!")) return !1;
    }
    return !0;
  }
  isEnd() {
    if (this.#r === this || this.#e?.type === "!") return !0;
    if (!this.#e?.isEnd()) return !1;
    if (!this.type) return this.#e?.isEnd();
    const t = this.#e ? this.#e.#t.length : 0;
    return this.#a === t - 1;
  }
  copyIn(t) {
    typeof t == "string" ? this.push(t) : this.push(t.clone(this));
  }
  clone(t) {
    const e = new W(this.type, t);
    for (const n of this.#t) e.copyIn(n);
    return e;
  }
  static #c(t, e, n, s, i) {
    const a = s.maxExtglobRecursion ?? 2;
    let o = !1,
      p = !1,
      l = -1,
      u = !1;
    if (e.type === null) {
      let f = n,
        m = "";
      for (; f < t.length; ) {
        const y = t.charAt(f++);
        if (o || y === "\\") ((o = !o), (m += y));
        else if (p)
          (f === l + 1 ? (y !== "^" && y !== "!") || (u = !0) : y !== "]" || (f === l + 2 && u) || (p = !1), (m += y));
        else if (y !== "[")
          if (!s.noext && Xt(y) && t.charAt(f) === "(" && i <= a) {
            (e.push(m), (m = ""));
            const v = new W(y, e);
            ((f = W.#c(t, v, f, s, i + 1)), e.push(v));
          } else m += y;
        else ((p = !0), (l = f), (u = !1), (m += y));
      }
      return (e.push(m), f);
    }
    let c = n + 1,
      h = new W(null, e);
    const d = [];
    let g = "";
    for (; c < t.length; ) {
      const f = t.charAt(c++);
      if (o || f === "\\") ((o = !o), (g += f));
      else if (p)
        (c === l + 1 ? (f !== "^" && f !== "!") || (u = !0) : f !== "]" || (c === l + 2 && u) || (p = !1), (g += f));
      else if (f !== "[")
        if (Xt(f) && t.charAt(c) === "(" && (i <= a || (e && e.#p(f)))) {
          const m = e && e.#p(f) ? 0 : 1;
          (h.push(g), (g = ""));
          const y = new W(f, h);
          (h.push(y), (c = W.#c(t, y, c, s, i + m)));
        } else if (f !== "|") {
          if (f === ")") return (g === "" && e.#t.length === 0 && (e.#h = !0), h.push(g), (g = ""), e.push(...d, h), c);
          g += f;
        } else (h.push(g), (g = ""), d.push(h), (h = new W(null, e)));
      else ((p = !0), (l = c), (u = !1), (g += f));
    }
    return ((e.type = null), (e.#n = void 0), (e.#t = [t.substring(n - 1)]), c);
  }
  #v(t) {
    return this.#g(t, zr);
  }
  #g(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Br;
    if (!t || typeof t != "object" || t.type !== null || t.#t.length !== 1 || this.type === null) return !1;
    const n = t.#t[0];
    return !(!n || typeof n != "object" || n.type === null) && this.#p(n.type, e);
  }
  #p(t) {
    return !!(arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Gr).get(this.type)?.includes(t);
  }
  #b(t, e) {
    const n = t.#t[0],
      s = new W(null, n, this.options);
    (s.#t.push(""), n.push(s), this.#d(t, e));
  }
  #d(t, e) {
    const n = t.#t[0];
    this.#t.splice(e, 1, ...n.#t);
    for (const s of n.#t) typeof s == "object" && (s.#e = this);
    this.#o = void 0;
  }
  #w(t) {
    return !!Te.get(this.type)?.has(t);
  }
  #x(t) {
    if (
      !t ||
      typeof t != "object" ||
      t.type !== null ||
      t.#t.length !== 1 ||
      this.type === null ||
      this.#t.length !== 1
    )
      return !1;
    const e = t.#t[0];
    return !(!e || typeof e != "object" || e.type === null) && this.#w(e.type);
  }
  #N(t) {
    const e = Te.get(this.type),
      n = t.#t[0],
      s = e?.get(n.type);
    if (!s) return !1;
    this.#t = n.#t;
    for (const i of this.#t) typeof i == "object" && (i.#e = this);
    ((this.type = s), (this.#o = void 0), (this.#h = !1));
  }
  #f() {
    if (Se(this)) {
      let t = 0,
        e = !1;
      do {
        e = !0;
        for (let n = 0; n < this.#t.length; n++) {
          const s = this.#t[n];
          typeof s == "object" &&
            (s.#f(),
            this.#g(s)
              ? ((e = !1), this.#d(s, n))
              : this.#v(s)
                ? ((e = !1), this.#b(s, n))
                : this.#x(s) && ((e = !1), this.#N(s)));
        }
      } while (!e && ++t < 10);
    } else for (const t of this.#t) typeof t == "object" && t.#f();
    this.#o = void 0;
  }
  static fromGlob(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const n = new W(null, void 0, e);
    return (W.#c(t, n, 0, e, 0), n);
  }
  toMMPattern() {
    if (this !== this.#r) return this.#r.toMMPattern();
    const t = this.toString(),
      [e, n, s, i] = this.toRegExpSource();
    if (!(s || this.#n || (this.#i.nocase && !this.#i.nocaseMagicOnly && t.toUpperCase() !== t.toLowerCase())))
      return n;
    const a = (this.#i.nocase ? "i" : "") + (i ? "u" : "");
    return Object.assign(new RegExp(`^${e}$`, a), { _src: e, _glob: t });
  }
  get options() {
    return this.#i;
  }
  toRegExpSource(t) {
    const e = t ?? !!this.#i.dot;
    if ((this.#r === this && (this.#f(), this.#y()), !Se(this))) {
      const p = this.isStart() && this.isEnd(),
        l = this.#t
          .map((h) => {
            const [d, g, f, m] = typeof h == "string" ? W.#E(h, this.#n, p) : h.toRegExpSource(t);
            return ((this.#n = this.#n || f), (this.#s = this.#s || m), d);
          })
          .join("");
      let u = "";
      if (this.isStart() && typeof this.#t[0] == "string" && (this.#t.length !== 1 || !Hr.has(this.#t[0]))) {
        const h = qr,
          d =
            (e && h.has(l.charAt(0))) ||
            (l.startsWith("\\.") && h.has(l.charAt(2))) ||
            (l.startsWith("\\.\\.") && h.has(l.charAt(4))),
          g = !e && !t && h.has(l.charAt(0));
        u = d ? "(?!(?:^|/)\\.\\.?(?:$|/))" : g ? Dt : "";
      }
      let c = "";
      return (
        this.isEnd() && this.#r.#u && this.#e?.type === "!" && (c = "(?:$|\\/)"),
        [u + l + c, yt(l), (this.#n = !!this.#n), this.#s]
      );
    }
    const n = this.type === "*" || this.type === "+",
      s = this.type === "!" ? "(?:(?!(?:" : "(?:";
    let i = this.#m(e);
    if (this.isStart() && this.isEnd() && !i && this.type !== "!") {
      const p = this.toString(),
        l = this;
      return ((l.#t = [p]), (l.type = null), (l.#n = void 0), [p, yt(this.toString()), !1, !1]);
    }
    let a = !n || t || e ? "" : this.#m(!0);
    (a === i && (a = ""), a && (i = `(?:${i})(?:${a})*?`));
    let o = "";
    return (
      (o =
        this.type === "!" && this.#h
          ? (this.isStart() && !e ? Dt : "") + Oe
          : s +
            i +
            (this.type === "!"
              ? "))" + (!this.isStart() || e || t ? "" : Dt) + Ce + ")"
              : this.type === "@"
                ? ")"
                : this.type === "?"
                  ? ")?"
                  : this.type === "+" && a
                    ? ")"
                    : this.type === "*" && a
                      ? ")?"
                      : `)${this.type}`)),
      [o, yt(i), (this.#n = !!this.#n), this.#s]
    );
  }
  #m(t) {
    return this.#t
      .map((e) => {
        if (typeof e == "string") throw new Error("string type in extglob ast??");
        const [n, s, i, a] = e.toRegExpSource(t);
        return ((this.#s = this.#s || a), n);
      })
      .filter((e) => !(this.isStart() && this.isEnd() && !e))
      .join("|");
  }
  static #E(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2],
      s = !1,
      i = "",
      a = !1,
      o = !1;
    for (let p = 0; p < t.length; p++) {
      const l = t.charAt(p);
      if (s) ((s = !1), (i += (Yr.has(l) ? "\\" : "") + l), (o = !1));
      else if (l !== "\\") {
        if (l === "[") {
          const [u, c, h, d] = Vr(t, p);
          if (h) {
            ((i += u), (a = a || c), (p += h - 1), (e = e || d), (o = !1));
            continue;
          }
        }
        if (l !== "*")
          ((o = !1), l !== "?" ? (i += l.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")) : ((i += ne), (e = !0)));
        else {
          if (o) continue;
          ((o = !0), (i += n && /^[*]+$/.test(t) ? Oe : Ce), (e = !0));
        }
      } else p === t.length - 1 ? (i += "\\\\") : (s = !0);
    }
    return [i, yt(t), !!e, a];
  }
}
W = se;
const R = function (r, t) {
    let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return (Ot(t), !(!e.nocomment && t.charAt(0) === "#") && new _t(t, e).match(r));
  },
  Zr = /^\*+([^+@!?\*\[\(]*)$/,
  Xr = (r) => (t) => !t.startsWith(".") && t.endsWith(r),
  Jr = (r) => (t) => t.endsWith(r),
  Kr = (r) => ((r = r.toLowerCase()), (t) => !t.startsWith(".") && t.toLowerCase().endsWith(r)),
  Qr = (r) => ((r = r.toLowerCase()), (t) => t.toLowerCase().endsWith(r)),
  tn = /^\*+\.\*+$/,
  en = (r) => !r.startsWith(".") && r.includes("."),
  rn = (r) => r !== "." && r !== ".." && r.includes("."),
  nn = /^\.\*+$/,
  sn = (r) => r !== "." && r !== ".." && r.startsWith("."),
  on = /^\*+$/,
  an = (r) => r.length !== 0 && !r.startsWith("."),
  un = (r) => r.length !== 0 && r !== "." && r !== "..",
  ln = /^\?+([^+@!?\*\[\(]*)?$/,
  hn = (r) => {
    let [t, e = ""] = r;
    const n = Ke([t]);
    return e ? ((e = e.toLowerCase()), (s) => n(s) && s.toLowerCase().endsWith(e)) : n;
  },
  cn = (r) => {
    let [t, e = ""] = r;
    const n = Qe([t]);
    return e ? ((e = e.toLowerCase()), (s) => n(s) && s.toLowerCase().endsWith(e)) : n;
  },
  pn = (r) => {
    let [t, e = ""] = r;
    const n = Qe([t]);
    return e ? (s) => n(s) && s.endsWith(e) : n;
  },
  fn = (r) => {
    let [t, e = ""] = r;
    const n = Ke([t]);
    return e ? (s) => n(s) && s.endsWith(e) : n;
  },
  Ke = (r) => {
    let [t] = r;
    const e = t.length;
    return (n) => n.length === e && !n.startsWith(".");
  },
  Qe = (r) => {
    let [t] = r;
    const e = t.length;
    return (n) => n.length === e && n !== "." && n !== "..";
  },
  tr =
    typeof Pt == "object" && Pt
      ? (typeof kt == "object" && kt && kt.__MINIMATCH_TESTING_PLATFORM__) || Pt.platform
      : "posix";
R.sep = tr === "win32" ? "\\" : "/";
const L = Symbol("globstar **");
((R.GLOBSTAR = L),
  (R.filter = function (r) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return (e) => R(e, r, t);
  }));
const G = function (r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return Object.assign({}, r, t);
};
R.defaults = (r) => {
  if (!r || typeof r != "object" || !Object.keys(r).length) return R;
  const t = R;
  return Object.assign(
    function (e, n) {
      return t(e, n, G(r, arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}));
    },
    {
      Minimatch: class extends t.Minimatch {
        constructor(e) {
          super(e, G(r, arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}));
        }
        static defaults(e) {
          return t.defaults(G(r, e)).Minimatch;
        }
      },
      AST: class extends t.AST {
        constructor(e, n) {
          super(e, n, G(r, arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}));
        }
        static fromGlob(e) {
          let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return t.AST.fromGlob(e, G(r, n));
        }
      },
      unescape: function (e) {
        let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return t.unescape(e, G(r, n));
      },
      escape: function (e) {
        let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return t.escape(e, G(r, n));
      },
      filter: function (e) {
        let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return t.filter(e, G(r, n));
      },
      defaults: (e) => t.defaults(G(r, e)),
      makeRe: function (e) {
        let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return t.makeRe(e, G(r, n));
      },
      braceExpand: function (e) {
        let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return t.braceExpand(e, G(r, n));
      },
      match: function (e, n) {
        let s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        return t.match(e, n, G(r, s));
      },
      sep: t.sep,
      GLOBSTAR: L,
    },
  );
};
const er = function (r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return (Ot(r), t.nobrace || !/\{(?:(?!\{).)*\}/.test(r) ? [r] : Ur(r));
};
((R.braceExpand = er),
  (R.makeRe = function (r) {
    return new _t(r, arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}).makeRe();
  }),
  (R.match = function (r, t) {
    const e = new _t(t, arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {});
    return ((r = r.filter((n) => e.match(n))), e.options.nonull && !r.length && r.push(t), r);
  }));
const _e = /[?*]|[+@!]\(.*?\)|\[|\]/;
class _t {
  options;
  set;
  pattern;
  windowsPathsNoEscape;
  nonegate;
  negate;
  comment;
  empty;
  preserveMultipleSlashes;
  partial;
  globSet;
  globParts;
  nocase;
  isWindows;
  platform;
  windowsNoMagicRoot;
  maxGlobstarRecursion;
  regexp;
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    (Ot(t),
      (e = e || {}),
      (this.options = e),
      (this.maxGlobstarRecursion = e.maxGlobstarRecursion ?? 200),
      (this.pattern = t),
      (this.platform = e.platform || tr),
      (this.isWindows = this.platform === "win32"),
      (this.windowsPathsNoEscape = !!e.windowsPathsNoEscape || e.allowWindowsEscape === !1),
      this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, "/")),
      (this.preserveMultipleSlashes = !!e.preserveMultipleSlashes),
      (this.regexp = null),
      (this.negate = !1),
      (this.nonegate = !!e.nonegate),
      (this.comment = !1),
      (this.empty = !1),
      (this.partial = !!e.partial),
      (this.nocase = !!this.options.nocase),
      (this.windowsNoMagicRoot =
        e.windowsNoMagicRoot !== void 0 ? e.windowsNoMagicRoot : !(!this.isWindows || !this.nocase)),
      (this.globSet = []),
      (this.globParts = []),
      (this.set = []),
      this.make());
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1) return !0;
    for (const t of this.set) for (const e of t) if (typeof e != "string") return !0;
    return !1;
  }
  debug() {}
  make() {
    const t = this.pattern,
      e = this.options;
    if (!e.nocomment && t.charAt(0) === "#") return void (this.comment = !0);
    if (!t) return void (this.empty = !0);
    (this.parseNegate(),
      (this.globSet = [...new Set(this.braceExpand())]),
      e.debug &&
        (this.debug = function () {
          return console.error(...arguments);
        }),
      this.debug(this.pattern, this.globSet));
    const n = this.globSet.map((i) => this.slashSplit(i));
    ((this.globParts = this.preprocess(n)), this.debug(this.pattern, this.globParts));
    let s = this.globParts.map((i, a, o) => {
      if (this.isWindows && this.windowsNoMagicRoot) {
        const p = !(i[0] !== "" || i[1] !== "" || (i[2] !== "?" && _e.test(i[2])) || _e.test(i[3])),
          l = /^[a-z]:/i.test(i[0]);
        if (p) return [...i.slice(0, 4), ...i.slice(4).map((u) => this.parse(u))];
        if (l) return [i[0], ...i.slice(1).map((u) => this.parse(u))];
      }
      return i.map((p) => this.parse(p));
    });
    if ((this.debug(this.pattern, s), (this.set = s.filter((i) => i.indexOf(!1) === -1)), this.isWindows))
      for (let i = 0; i < this.set.length; i++) {
        const a = this.set[i];
        a[0] === "" &&
          a[1] === "" &&
          this.globParts[i][2] === "?" &&
          typeof a[3] == "string" &&
          /^[a-z]:$/i.test(a[3]) &&
          (a[2] = "?");
      }
    this.debug(this.pattern, this.set);
  }
  preprocess(t) {
    if (this.options.noglobstar)
      for (let n = 0; n < t.length; n++) for (let s = 0; s < t[n].length; s++) t[n][s] === "**" && (t[n][s] = "*");
    const { optimizationLevel: e = 1 } = this.options;
    return (
      e >= 2
        ? ((t = this.firstPhasePreProcess(t)), (t = this.secondPhasePreProcess(t)))
        : (t = e >= 1 ? this.levelOneOptimize(t) : this.adjascentGlobstarOptimize(t)),
      t
    );
  }
  adjascentGlobstarOptimize(t) {
    return t.map((e) => {
      let n = -1;
      for (; (n = e.indexOf("**", n + 1)) !== -1; ) {
        let s = n;
        for (; e[s + 1] === "**"; ) s++;
        s !== n && e.splice(n, s - n);
      }
      return e;
    });
  }
  levelOneOptimize(t) {
    return t.map((e) =>
      (e = e.reduce((n, s) => {
        const i = n[n.length - 1];
        return s === "**" && i === "**"
          ? n
          : s === ".." && i && i !== ".." && i !== "." && i !== "**"
            ? (n.pop(), n)
            : (n.push(s), n);
      }, [])).length === 0
        ? [""]
        : e,
    );
  }
  levelTwoFileOptimize(t) {
    Array.isArray(t) || (t = this.slashSplit(t));
    let e = !1;
    do {
      if (((e = !1), !this.preserveMultipleSlashes)) {
        for (let s = 1; s < t.length - 1; s++) {
          const i = t[s];
          (s === 1 && i === "" && t[0] === "") || (i !== "." && i !== "") || ((e = !0), t.splice(s, 1), s--);
        }
        t[0] !== "." || t.length !== 2 || (t[1] !== "." && t[1] !== "") || ((e = !0), t.pop());
      }
      let n = 0;
      for (; (n = t.indexOf("..", n + 1)) !== -1; ) {
        const s = t[n - 1];
        s && s !== "." && s !== ".." && s !== "**" && ((e = !0), t.splice(n - 1, 2), (n -= 2));
      }
    } while (e);
    return t.length === 0 ? [""] : t;
  }
  firstPhasePreProcess(t) {
    let e = !1;
    do {
      e = !1;
      for (let n of t) {
        let s = -1;
        for (; (s = n.indexOf("**", s + 1)) !== -1; ) {
          let a = s;
          for (; n[a + 1] === "**"; ) a++;
          a > s && n.splice(s + 1, a - s);
          let o = n[s + 1];
          const p = n[s + 2],
            l = n[s + 3];
          if (o !== ".." || !p || p === "." || p === ".." || !l || l === "." || l === "..") continue;
          ((e = !0), n.splice(s, 1));
          const u = n.slice(0);
          ((u[s] = "**"), t.push(u), s--);
        }
        if (!this.preserveMultipleSlashes) {
          for (let a = 1; a < n.length - 1; a++) {
            const o = n[a];
            (a === 1 && o === "" && n[0] === "") || (o !== "." && o !== "") || ((e = !0), n.splice(a, 1), a--);
          }
          n[0] !== "." || n.length !== 2 || (n[1] !== "." && n[1] !== "") || ((e = !0), n.pop());
        }
        let i = 0;
        for (; (i = n.indexOf("..", i + 1)) !== -1; ) {
          const a = n[i - 1];
          if (a && a !== "." && a !== ".." && a !== "**") {
            e = !0;
            const o = i === 1 && n[i + 1] === "**" ? ["."] : [];
            (n.splice(i - 1, 2, ...o), n.length === 0 && n.push(""), (i -= 2));
          }
        }
      }
    } while (e);
    return t;
  }
  secondPhasePreProcess(t) {
    for (let e = 0; e < t.length - 1; e++)
      for (let n = e + 1; n < t.length; n++) {
        const s = this.partsMatch(t[e], t[n], !this.preserveMultipleSlashes);
        if (s) {
          ((t[e] = []), (t[n] = s));
          break;
        }
      }
    return t.filter((e) => e.length);
  }
  partsMatch(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2],
      s = 0,
      i = 0,
      a = [],
      o = "";
    for (; s < t.length && i < e.length; )
      if (t[s] === e[i]) (a.push(o === "b" ? e[i] : t[s]), s++, i++);
      else if (n && t[s] === "**" && e[i] === t[s + 1]) (a.push(t[s]), s++);
      else if (n && e[i] === "**" && t[s] === e[i + 1]) (a.push(e[i]), i++);
      else if (t[s] !== "*" || !e[i] || (!this.options.dot && e[i].startsWith(".")) || e[i] === "**") {
        if (e[i] !== "*" || !t[s] || (!this.options.dot && t[s].startsWith(".")) || t[s] === "**" || o === "a")
          return !1;
        ((o = "b"), a.push(e[i]), s++, i++);
      } else {
        if (o === "b") return !1;
        ((o = "a"), a.push(t[s]), s++, i++);
      }
    return t.length === e.length && a;
  }
  parseNegate() {
    if (this.nonegate) return;
    const t = this.pattern;
    let e = !1,
      n = 0;
    for (let s = 0; s < t.length && t.charAt(s) === "!"; s++) ((e = !e), n++);
    (n && (this.pattern = t.slice(n)), (this.negate = e));
  }
  matchOne(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2],
      s = 0,
      i = 0;
    if (this.isWindows) {
      const o = typeof t[0] == "string" && /^[a-z]:$/i.test(t[0]),
        p = !o && t[0] === "" && t[1] === "" && t[2] === "?" && /^[a-z]:$/i.test(t[3]),
        l = typeof e[0] == "string" && /^[a-z]:$/i.test(e[0]),
        u = p ? 3 : o ? 0 : void 0,
        c =
          !l && e[0] === "" && e[1] === "" && e[2] === "?" && typeof e[3] == "string" && /^[a-z]:$/i.test(e[3])
            ? 3
            : l
              ? 0
              : void 0;
      if (typeof u == "number" && typeof c == "number") {
        const [h, d] = [t[u], e[c]];
        h.toLowerCase() === d.toLowerCase() && ((e[c] = h), (i = c), (s = u));
      }
    }
    const { optimizationLevel: a = 1 } = this.options;
    return (
      a >= 2 && (t = this.levelTwoFileOptimize(t)),
      e.includes(L) ? this.#r(t, e, n, s, i) : this.#s(t, e, n, s, i)
    );
  }
  #r(t, e, n, s, i) {
    const a = e.indexOf(L, i),
      o = e.lastIndexOf(L),
      [p, l, u] = n ? [e.slice(i, a), e.slice(a + 1), []] : [e.slice(i, a), e.slice(a + 1, o), e.slice(o + 1)];
    if (p.length) {
      const v = t.slice(s, s + p.length);
      if (!this.#s(v, p, n, 0, 0)) return !1;
      s += p.length;
    }
    let c = 0;
    if (u.length) {
      if (u.length + s > t.length) return !1;
      let v = t.length - u.length;
      if (this.#s(t, u, n, v, 0)) c = u.length;
      else {
        if (t[t.length - 1] !== "" || s + u.length === t.length || (v--, !this.#s(t, u, n, v, 0))) return !1;
        c = u.length + 1;
      }
    }
    if (!l.length) {
      let v = !!c;
      for (let b = s; b < t.length - c; b++) {
        const x = String(t[b]);
        if (((v = !0), x === "." || x === ".." || (!this.options.dot && x.startsWith(".")))) return !1;
      }
      return n || v;
    }
    const h = [[[], 0]];
    let d = h[0],
      g = 0;
    const f = [0];
    for (const v of l) v === L ? (f.push(g), (d = [[], 0]), h.push(d)) : (d[0].push(v), g++);
    let m = h.length - 1;
    const y = t.length - c;
    for (const v of h) v[1] = y - (f[m--] + v[0].length);
    return !!this.#n(t, h, s, 0, n, 0, !!c);
  }
  #n(t, e, n, s, i, a, o) {
    const p = e[s];
    if (!p) {
      for (let c = n; c < t.length; c++) {
        o = !0;
        const h = t[c];
        if (h === "." || h === ".." || (!this.options.dot && h.startsWith("."))) return !1;
      }
      return o;
    }
    const [l, u] = p;
    for (; n <= u; ) {
      if (this.#s(t.slice(0, n + l.length), l, i, n, 0) && a < this.maxGlobstarRecursion) {
        const h = this.#n(t, e, n + l.length, s + 1, i, a + 1, o);
        if (h !== !1) return h;
      }
      const c = t[n];
      if (c === "." || c === ".." || (!this.options.dot && c.startsWith("."))) return !1;
      n++;
    }
    return i || null;
  }
  #s(t, e, n, s, i) {
    let a, o, p, l;
    for (a = s, o = i, l = t.length, p = e.length; a < l && o < p; a++, o++) {
      this.debug("matchOne loop");
      let u,
        c = e[o],
        h = t[a];
      if (
        (this.debug(e, c, h),
        c === !1 ||
          c === L ||
          (typeof c == "string"
            ? ((u = h === c), this.debug("string match", c, h, u))
            : ((u = c.test(h)), this.debug("pattern match", c, h, u)),
          !u))
      )
        return !1;
    }
    if (a === l && o === p) return !0;
    if (a === l) return n;
    if (o === p) return a === l - 1 && t[a] === "";
    throw new Error("wtf?");
  }
  braceExpand() {
    return er(this.pattern, this.options);
  }
  parse(t) {
    Ot(t);
    const e = this.options;
    if (t === "**") return L;
    if (t === "") return "";
    let n,
      s = null;
    (n = t.match(on))
      ? (s = e.dot ? un : an)
      : (n = t.match(Zr))
        ? (s = (e.nocase ? (e.dot ? Qr : Kr) : e.dot ? Jr : Xr)(n[1]))
        : (n = t.match(ln))
          ? (s = (e.nocase ? (e.dot ? cn : hn) : e.dot ? pn : fn)(n))
          : (n = t.match(tn))
            ? (s = e.dot ? rn : en)
            : (n = t.match(nn)) && (s = sn);
    const i = se.fromGlob(t, this.options).toMMPattern();
    return (s && typeof i == "object" && Reflect.defineProperty(i, "test", { value: s }), i);
  }
  makeRe() {
    if (this.regexp || this.regexp === !1) return this.regexp;
    const t = this.set;
    if (!t.length) return ((this.regexp = !1), this.regexp);
    const e = this.options,
      n = e.noglobstar ? "[^/]*?" : e.dot ? "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?" : "(?:(?!(?:\\/|^)\\.).)*?",
      s = new Set(e.nocase ? ["i"] : []);
    let i = t
      .map((p) => {
        const l = p.map((u) => {
          if (u instanceof RegExp) for (const c of u.flags.split("")) s.add(c);
          return typeof u == "string" ? u.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : u === L ? L : u._src;
        });
        return (
          l.forEach((u, c) => {
            const h = l[c + 1],
              d = l[c - 1];
            u === L &&
              d !== L &&
              (d === void 0
                ? h !== void 0 && h !== L
                  ? (l[c + 1] = "(?:\\/|" + n + "\\/)?" + h)
                  : (l[c] = n)
                : h === void 0
                  ? (l[c - 1] = d + "(?:\\/|" + n + ")?")
                  : h !== L && ((l[c - 1] = d + "(?:\\/|\\/" + n + "\\/)" + h), (l[c + 1] = L)));
          }),
          l.filter((u) => u !== L).join("/")
        );
      })
      .join("|");
    const [a, o] = t.length > 1 ? ["(?:", ")"] : ["", ""];
    ((i = "^" + a + i + o + "$"), this.negate && (i = "^(?!" + i + ").+$"));
    try {
      this.regexp = new RegExp(i, [...s].join(""));
    } catch {
      this.regexp = !1;
    }
    return this.regexp;
  }
  slashSplit(t) {
    return this.preserveMultipleSlashes
      ? t.split("/")
      : this.isWindows && /^\/\/[^\/]+/.test(t)
        ? ["", ...t.split(/\/+/)]
        : t.split(/\/+/);
  }
  match(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.partial;
    if ((this.debug("match", t, this.pattern), this.comment)) return !1;
    if (this.empty) return t === "";
    if (t === "/" && e) return !0;
    const n = this.options;
    this.isWindows && (t = t.split("\\").join("/"));
    const s = this.slashSplit(t);
    this.debug(this.pattern, "split", s);
    const i = this.set;
    this.debug(this.pattern, "set", i);
    let a = s[s.length - 1];
    if (!a) for (let o = s.length - 2; !a && o >= 0; o--) a = s[o];
    for (let o = 0; o < i.length; o++) {
      const p = i[o];
      let l = s;
      if ((n.matchBase && p.length === 1 && (l = [a]), this.matchOne(l, p, e))) return !!n.flipNegate || !this.negate;
    }
    return !n.flipNegate && this.negate;
  }
  static defaults(t) {
    return R.defaults(t).Minimatch;
  }
}
function ie(r) {
  const t = new Error(
    `${arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ""}Invalid response: ${r.status} ${r.statusText}`,
  );
  return ((t.status = r.status), (t.response = r), t);
}
function k(r, t) {
  const { status: e } = t;
  if (e === 401 && r.digest) return t;
  if (e >= 400) throw ie(t);
  return t;
}
function at(r, t) {
  return arguments.length > 2 && arguments[2] !== void 0 && arguments[2]
    ? { data: t, headers: r.headers ? Lr(r.headers) : {}, status: r.status, statusText: r.statusText }
    : t;
}
((R.AST = se),
  (R.Minimatch = _t),
  (R.escape = function (r) {
    let { windowsPathsNoEscape: t = !1 } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return t ? r.replace(/[?*()[\]]/g, "[$&]") : r.replace(/[?*()[\]\\]/g, "\\$&");
  }),
  (R.unescape = yt));
const gn =
  (($e = function (r, t, e) {
    let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const s = I(
      {
        url: _(r.remoteURL, O(t)),
        method: "COPY",
        headers: {
          Destination: _(r.remoteURL, O(e)),
          Overwrite: n.overwrite === !1 ? "F" : "T",
          Depth: n.shallow ? "0" : "infinity",
        },
      },
      r,
      n,
    );
    return (
      (a = function (o) {
        k(r, o);
      }),
      ((i = j(s, r)) && i.then) || (i = Promise.resolve(i)),
      a ? i.then(a) : i
    );
    var i, a;
  }),
  function () {
    for (var r = [], t = 0; t < arguments.length; t++) r[t] = arguments[t];
    try {
      return Promise.resolve($e.apply(this, r));
    } catch (e) {
      return Promise.reject(e);
    }
  });
var $e;
const je =
    ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",
  dn = new RegExp("^[" + je + "][" + je + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
function rr(r, t) {
  const e = [];
  let n = t.exec(r);
  for (; n; ) {
    const s = [];
    s.startIndex = t.lastIndex - n[0].length;
    const i = n.length;
    for (let a = 0; a < i; a++) s.push(n[a]);
    (e.push(s), (n = t.exec(r)));
  }
  return e;
}
const jt = function (r) {
    return dn.exec(r) != null;
  },
  oe = [
    "hasOwnProperty",
    "toString",
    "valueOf",
    "__defineGetter__",
    "__defineSetter__",
    "__lookupGetter__",
    "__lookupSetter__",
  ],
  nr = ["__proto__", "constructor", "prototype"],
  sr = (r) => (oe.includes(r) ? "__" + r : r),
  mn = {
    preserveOrder: !1,
    attributeNamePrefix: "@_",
    attributesGroupName: !1,
    textNodeName: "#text",
    ignoreAttributes: !0,
    removeNSPrefix: !1,
    allowBooleanAttributes: !1,
    parseTagValue: !0,
    parseAttributeValue: !1,
    trimValues: !0,
    cdataPropName: !1,
    numberParseOptions: { hex: !0, leadingZeros: !0, eNotation: !0 },
    tagValueProcessor: function (r, t) {
      return t;
    },
    attributeValueProcessor: function (r, t) {
      return t;
    },
    stopNodes: [],
    alwaysCreateTextNode: !1,
    isArray: () => !1,
    commentPropName: !1,
    unpairedTags: [],
    processEntities: !0,
    htmlEntities: !1,
    entityDecoder: null,
    ignoreDeclaration: !1,
    ignorePiTags: !1,
    transformTagName: !1,
    transformAttributeName: !1,
    updateTag: function (r, t, e) {
      return r;
    },
    captureMetaData: !1,
    maxNestedTags: 100,
    strictReservedNames: !0,
    jPath: !0,
    onDangerousProperty: sr,
  };
function yn(r, t) {
  if (typeof r != "string") return;
  const e = r.toLowerCase();
  if (oe.some((n) => e === n.toLowerCase()))
    throw new Error(
      `[SECURITY] Invalid ${t}: "${r}" is a reserved JavaScript keyword that could cause prototype pollution`,
    );
  if (nr.some((n) => e === n.toLowerCase()))
    throw new Error(
      `[SECURITY] Invalid ${t}: "${r}" is a reserved JavaScript keyword that could cause prototype pollution`,
    );
}
function ir(r, t) {
  return typeof r == "boolean"
    ? {
        enabled: r,
        maxEntitySize: 1e4,
        maxExpansionDepth: 1e4,
        maxTotalExpansions: 1 / 0,
        maxExpandedLength: 1e5,
        maxEntityCount: 1e3,
        allowedTags: null,
        tagFilter: null,
        appliesTo: "all",
      }
    : typeof r == "object" && r !== null
      ? {
          enabled: r.enabled !== !1,
          maxEntitySize: Math.max(1, r.maxEntitySize ?? 1e4),
          maxExpansionDepth: Math.max(1, r.maxExpansionDepth ?? 1e4),
          maxTotalExpansions: Math.max(1, r.maxTotalExpansions ?? 1 / 0),
          maxExpandedLength: Math.max(1, r.maxExpandedLength ?? 1e5),
          maxEntityCount: Math.max(1, r.maxEntityCount ?? 1e3),
          allowedTags: r.allowedTags ?? null,
          tagFilter: r.tagFilter ?? null,
          appliesTo: r.appliesTo ?? "all",
        }
      : ir(!0);
}
const vn = function (r) {
  const t = Object.assign({}, mn, r),
    e = [
      { value: t.attributeNamePrefix, name: "attributeNamePrefix" },
      { value: t.attributesGroupName, name: "attributesGroupName" },
      { value: t.textNodeName, name: "textNodeName" },
      { value: t.cdataPropName, name: "cdataPropName" },
      { value: t.commentPropName, name: "commentPropName" },
    ];
  for (const { value: n, name: s } of e) n && yn(n, s);
  return (
    t.onDangerousProperty === null && (t.onDangerousProperty = sr),
    (t.processEntities = ir(t.processEntities, t.htmlEntities)),
    (t.unpairedTagsSet = new Set(t.unpairedTags)),
    t.stopNodes &&
      Array.isArray(t.stopNodes) &&
      (t.stopNodes = t.stopNodes.map((n) => (typeof n == "string" && n.startsWith("*.") ? ".." + n.substring(2) : n))),
    t
  );
};
let Jt;
Jt = typeof Symbol != "function" ? "@@xmlMetadata" : Symbol("XML Node Metadata");
class K {
  constructor(t) {
    ((this.tagname = t), (this.child = []), (this[":@"] = Object.create(null)));
  }
  add(t, e) {
    (t === "__proto__" && (t = "#__proto__"), this.child.push({ [t]: e }));
  }
  addChild(t, e) {
    (t.tagname === "__proto__" && (t.tagname = "#__proto__"),
      t[":@"] && Object.keys(t[":@"]).length > 0
        ? this.child.push({ [t.tagname]: t.child, ":@": t[":@"] })
        : this.child.push({ [t.tagname]: t.child }),
      e !== void 0 && (this.child[this.child.length - 1][Jt] = { startIndex: e }));
  }
  static getMetaDataSymbol() {
    return Jt;
  }
}
class bn {
  constructor(t) {
    ((this.suppressValidationErr = !t), (this.options = t));
  }
  readDocType(t, e) {
    const n = Object.create(null);
    let s = 0;
    if (
      t[e + 3] !== "O" ||
      t[e + 4] !== "C" ||
      t[e + 5] !== "T" ||
      t[e + 6] !== "Y" ||
      t[e + 7] !== "P" ||
      t[e + 8] !== "E"
    )
      throw new Error("Invalid Tag instead of DOCTYPE");
    {
      e += 9;
      let i = 1,
        a = !1,
        o = !1,
        p = "";
      for (; e < t.length; e++)
        if (t[e] !== "<" || o)
          if (t[e] === ">") {
            if ((o ? t[e - 1] === "-" && t[e - 2] === "-" && ((o = !1), i--) : i--, i === 0)) break;
          } else t[e] === "[" ? (a = !0) : (p += t[e]);
        else {
          if (a && et(t, "!ENTITY", e)) {
            let l, u;
            if (
              ((e += 7), ([l, u, e] = this.readEntityExp(t, e + 1, this.suppressValidationErr)), u.indexOf("&") === -1)
            ) {
              if (
                this.options.enabled !== !1 &&
                this.options.maxEntityCount != null &&
                s >= this.options.maxEntityCount
              )
                throw new Error(`Entity count (${s + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`);
              ((n[l] = u), s++);
            }
          } else if (a && et(t, "!ELEMENT", e)) {
            e += 8;
            const { index: l } = this.readElementExp(t, e + 1);
            e = l;
          } else if (a && et(t, "!ATTLIST", e)) e += 8;
          else if (a && et(t, "!NOTATION", e)) {
            e += 9;
            const { index: l } = this.readNotationExp(t, e + 1, this.suppressValidationErr);
            e = l;
          } else {
            if (!et(t, "!--", e)) throw new Error("Invalid DOCTYPE");
            o = !0;
          }
          (i++, (p = ""));
        }
      if (i !== 0) throw new Error("Unclosed DOCTYPE");
    }
    return { entities: n, i: e };
  }
  readEntityExp(t, e) {
    const n = (e = V(t, e));
    for (; e < t.length && !/\s/.test(t[e]) && t[e] !== '"' && t[e] !== "'"; ) e++;
    let s = t.substring(n, e);
    if ((dt(s), (e = V(t, e)), !this.suppressValidationErr)) {
      if (t.substring(e, e + 6).toUpperCase() === "SYSTEM") throw new Error("External entities are not supported");
      if (t[e] === "%") throw new Error("Parameter entities are not supported");
    }
    let i = "";
    if (
      (([e, i] = this.readIdentifierVal(t, e, "entity")),
      this.options.enabled !== !1 && this.options.maxEntitySize != null && i.length > this.options.maxEntitySize)
    )
      throw new Error(`Entity "${s}" size (${i.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);
    return [s, i, --e];
  }
  readNotationExp(t, e) {
    const n = (e = V(t, e));
    for (; e < t.length && !/\s/.test(t[e]); ) e++;
    let s = t.substring(n, e);
    (!this.suppressValidationErr && dt(s), (e = V(t, e)));
    const i = t.substring(e, e + 6).toUpperCase();
    if (!this.suppressValidationErr && i !== "SYSTEM" && i !== "PUBLIC")
      throw new Error(`Expected SYSTEM or PUBLIC, found "${i}"`);
    ((e += i.length), (e = V(t, e)));
    let a = null,
      o = null;
    if (i === "PUBLIC")
      (([e, a] = this.readIdentifierVal(t, e, "publicIdentifier")),
        (t[(e = V(t, e))] !== '"' && t[e] !== "'") || ([e, o] = this.readIdentifierVal(t, e, "systemIdentifier")));
    else if (
      i === "SYSTEM" &&
      (([e, o] = this.readIdentifierVal(t, e, "systemIdentifier")), !this.suppressValidationErr && !o)
    )
      throw new Error("Missing mandatory system identifier for SYSTEM notation");
    return { notationName: s, publicIdentifier: a, systemIdentifier: o, index: --e };
  }
  readIdentifierVal(t, e, n) {
    let s = "";
    const i = t[e];
    if (i !== '"' && i !== "'") throw new Error(`Expected quoted string, found "${i}"`);
    const a = ++e;
    for (; e < t.length && t[e] !== i; ) e++;
    if (((s = t.substring(a, e)), t[e] !== i)) throw new Error(`Unterminated ${n} value`);
    return [++e, s];
  }
  readElementExp(t, e) {
    const n = (e = V(t, e));
    for (; e < t.length && !/\s/.test(t[e]); ) e++;
    let s = t.substring(n, e);
    if (!this.suppressValidationErr && !jt(s)) throw new Error(`Invalid element name: "${s}"`);
    let i = "";
    if (t[(e = V(t, e))] === "E" && et(t, "MPTY", e)) e += 4;
    else if (t[e] === "A" && et(t, "NY", e)) e += 2;
    else if (t[e] === "(") {
      const a = ++e;
      for (; e < t.length && t[e] !== ")"; ) e++;
      if (((i = t.substring(a, e)), t[e] !== ")")) throw new Error("Unterminated content model");
    } else if (!this.suppressValidationErr) throw new Error(`Invalid Element Expression, found "${t[e]}"`);
    return { elementName: s, contentModel: i.trim(), index: e };
  }
  readAttlistExp(t, e) {
    let n = (e = V(t, e));
    for (; e < t.length && !/\s/.test(t[e]); ) e++;
    let s = t.substring(n, e);
    for (dt(s), n = e = V(t, e); e < t.length && !/\s/.test(t[e]); ) e++;
    let i = t.substring(n, e);
    if (!dt(i)) throw new Error(`Invalid attribute name: "${i}"`);
    e = V(t, e);
    let a = "";
    if (t.substring(e, e + 8).toUpperCase() === "NOTATION") {
      if (((a = "NOTATION"), t[(e = V(t, (e += 8)))] !== "(")) throw new Error(`Expected '(', found "${t[e]}"`);
      e++;
      let p = [];
      for (; e < t.length && t[e] !== ")"; ) {
        const l = e;
        for (; e < t.length && t[e] !== "|" && t[e] !== ")"; ) e++;
        let u = t.substring(l, e);
        if (((u = u.trim()), !dt(u))) throw new Error(`Invalid notation name: "${u}"`);
        (p.push(u), t[e] === "|" && (e++, (e = V(t, e))));
      }
      if (t[e] !== ")") throw new Error("Unterminated list of notations");
      (e++, (a += " (" + p.join("|") + ")"));
    } else {
      const p = e;
      for (; e < t.length && !/\s/.test(t[e]); ) e++;
      a += t.substring(p, e);
      const l = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
      if (!this.suppressValidationErr && !l.includes(a.toUpperCase()))
        throw new Error(`Invalid attribute type: "${a}"`);
    }
    e = V(t, e);
    let o = "";
    return (
      t.substring(e, e + 8).toUpperCase() === "#REQUIRED"
        ? ((o = "#REQUIRED"), (e += 8))
        : t.substring(e, e + 7).toUpperCase() === "#IMPLIED"
          ? ((o = "#IMPLIED"), (e += 7))
          : ([e, o] = this.readIdentifierVal(t, e, "ATTLIST")),
      { elementName: s, attributeName: i, attributeType: a, defaultValue: o, index: e }
    );
  }
}
const V = (r, t) => {
  for (; t < r.length && /\s/.test(r[t]); ) t++;
  return t;
};
function et(r, t, e) {
  for (let n = 0; n < t.length; n++) if (t[n] !== r[e + n + 1]) return !1;
  return !0;
}
function dt(r) {
  if (jt(r)) return r;
  throw new Error(`Invalid entity name ${r}`);
}
const wn = /^[-+]?0x[a-fA-F0-9]+$/,
  xn = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,
  Nn = { hex: !0, leadingZeros: !0, decimalPoint: ".", eNotation: !0, infinity: "original" },
  En = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
class An {
  constructor(t) {
    this._matcher = t;
  }
  get separator() {
    return this._matcher.separator;
  }
  getCurrentTag() {
    const t = this._matcher.path;
    return t.length > 0 ? t[t.length - 1].tag : void 0;
  }
  getCurrentNamespace() {
    const t = this._matcher.path;
    return t.length > 0 ? t[t.length - 1].namespace : void 0;
  }
  getAttrValue(t) {
    const e = this._matcher.path;
    if (e.length !== 0) return e[e.length - 1].values?.[t];
  }
  hasAttr(t) {
    const e = this._matcher.path;
    if (e.length === 0) return !1;
    const n = e[e.length - 1];
    return n.values !== void 0 && t in n.values;
  }
  getPosition() {
    const t = this._matcher.path;
    return t.length === 0 ? -1 : (t[t.length - 1].position ?? 0);
  }
  getCounter() {
    const t = this._matcher.path;
    return t.length === 0 ? -1 : (t[t.length - 1].counter ?? 0);
  }
  getIndex() {
    return this.getPosition();
  }
  getDepth() {
    return this._matcher.path.length;
  }
  toString(t) {
    let e = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
    return this._matcher.toString(t, e);
  }
  toArray() {
    return this._matcher.path.map((t) => t.tag);
  }
  matches(t) {
    return this._matcher.matches(t);
  }
  matchesAny(t) {
    return t.matchesAny(this._matcher);
  }
}
class ae {
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    ((this.separator = t.separator || "."),
      (this.path = []),
      (this.siblingStacks = []),
      (this._pathStringCache = null),
      (this._view = new An(this)));
  }
  push(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null,
      n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
    ((this._pathStringCache = null), this.path.length > 0 && (this.path[this.path.length - 1].values = void 0));
    const s = this.path.length;
    this.siblingStacks[s] || (this.siblingStacks[s] = new Map());
    const i = this.siblingStacks[s],
      a = n ? `${n}:${t}` : t,
      o = i.get(a) || 0;
    let p = 0;
    for (const u of i.values()) p += u;
    i.set(a, o + 1);
    const l = { tag: t, position: p, counter: o };
    (n != null && (l.namespace = n), e != null && (l.values = e), this.path.push(l));
  }
  pop() {
    if (this.path.length === 0) return;
    this._pathStringCache = null;
    const t = this.path.pop();
    return (this.siblingStacks.length > this.path.length + 1 && (this.siblingStacks.length = this.path.length + 1), t);
  }
  updateCurrent(t) {
    if (this.path.length > 0) {
      const e = this.path[this.path.length - 1];
      t != null && (e.values = t);
    }
  }
  getCurrentTag() {
    return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
  }
  getCurrentNamespace() {
    return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
  }
  getAttrValue(t) {
    if (this.path.length !== 0) return this.path[this.path.length - 1].values?.[t];
  }
  hasAttr(t) {
    if (this.path.length === 0) return !1;
    const e = this.path[this.path.length - 1];
    return e.values !== void 0 && t in e.values;
  }
  getPosition() {
    return this.path.length === 0 ? -1 : (this.path[this.path.length - 1].position ?? 0);
  }
  getCounter() {
    return this.path.length === 0 ? -1 : (this.path[this.path.length - 1].counter ?? 0);
  }
  getIndex() {
    return this.getPosition();
  }
  getDepth() {
    return this.path.length;
  }
  toString(t) {
    let e = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
    const n = t || this.separator;
    if (n === this.separator && e === !0) {
      if (this._pathStringCache !== null) return this._pathStringCache;
      const s = this.path.map((i) => (i.namespace ? `${i.namespace}:${i.tag}` : i.tag)).join(n);
      return ((this._pathStringCache = s), s);
    }
    return this.path.map((s) => (e && s.namespace ? `${s.namespace}:${s.tag}` : s.tag)).join(n);
  }
  toArray() {
    return this.path.map((t) => t.tag);
  }
  reset() {
    ((this._pathStringCache = null), (this.path = []), (this.siblingStacks = []));
  }
  matches(t) {
    const e = t.segments;
    return e.length !== 0 && (t.hasDeepWildcard() ? this._matchWithDeepWildcard(e) : this._matchSimple(e));
  }
  _matchSimple(t) {
    if (this.path.length !== t.length) return !1;
    for (let e = 0; e < t.length; e++)
      if (!this._matchSegment(t[e], this.path[e], e === this.path.length - 1)) return !1;
    return !0;
  }
  _matchWithDeepWildcard(t) {
    let e = this.path.length - 1,
      n = t.length - 1;
    for (; n >= 0 && e >= 0; ) {
      const s = t[n];
      if (s.type === "deep-wildcard") {
        if ((n--, n < 0)) return !0;
        const i = t[n];
        let a = !1;
        for (let o = e; o >= 0; o--)
          if (this._matchSegment(i, this.path[o], o === this.path.length - 1)) {
            ((e = o - 1), n--, (a = !0));
            break;
          }
        if (!a) return !1;
      } else {
        if (!this._matchSegment(s, this.path[e], e === this.path.length - 1)) return !1;
        (e--, n--);
      }
    }
    return n < 0;
  }
  _matchSegment(t, e, n) {
    if (
      (t.tag !== "*" && t.tag !== e.tag) ||
      (t.namespace !== void 0 && t.namespace !== "*" && t.namespace !== e.namespace) ||
      (t.attrName !== void 0 &&
        (!n ||
          !e.values ||
          !(t.attrName in e.values) ||
          (t.attrValue !== void 0 && String(e.values[t.attrName]) !== String(t.attrValue))))
    )
      return !1;
    if (t.position !== void 0) {
      if (!n) return !1;
      const s = e.counter ?? 0;
      if (
        (t.position === "first" && s !== 0) ||
        (t.position === "odd" && s % 2 != 1) ||
        (t.position === "even" && s % 2 != 0) ||
        (t.position === "nth" && s !== t.positionValue)
      )
        return !1;
    }
    return !0;
  }
  matchesAny(t) {
    return t.matchesAny(this);
  }
  snapshot() {
    return { path: this.path.map((t) => ({ ...t })), siblingStacks: this.siblingStacks.map((t) => new Map(t)) };
  }
  restore(t) {
    ((this._pathStringCache = null),
      (this.path = t.path.map((e) => ({ ...e }))),
      (this.siblingStacks = t.siblingStacks.map((e) => new Map(e))));
  }
  readOnly() {
    return this._view;
  }
}
class ot {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = arguments.length > 2 ? arguments[2] : void 0;
    ((this.pattern = t),
      (this.separator = e.separator || "."),
      (this.segments = this._parse(t)),
      (this.data = n),
      (this._hasDeepWildcard = this.segments.some((s) => s.type === "deep-wildcard")),
      (this._hasAttributeCondition = this.segments.some((s) => s.attrName !== void 0)),
      (this._hasPositionSelector = this.segments.some((s) => s.position !== void 0)));
  }
  _parse(t) {
    const e = [];
    let n = 0,
      s = "";
    for (; n < t.length; )
      t[n] === this.separator
        ? n + 1 < t.length && t[n + 1] === this.separator
          ? (s.trim() && (e.push(this._parseSegment(s.trim())), (s = "")), e.push({ type: "deep-wildcard" }), (n += 2))
          : (s.trim() && e.push(this._parseSegment(s.trim())), (s = ""), n++)
        : ((s += t[n]), n++);
    return (s.trim() && e.push(this._parseSegment(s.trim())), e);
  }
  _parseSegment(t) {
    const e = { type: "tag" };
    let n = null,
      s = t;
    const i = t.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
    if (i && ((s = i[1] + i[3]), i[2])) {
      const u = i[2].slice(1, -1);
      u && (n = u);
    }
    let a,
      o,
      p = s;
    if (s.includes("::")) {
      const u = s.indexOf("::");
      if (((a = s.substring(0, u).trim()), (p = s.substring(u + 2).trim()), !a))
        throw new Error(`Invalid namespace in pattern: ${t}`);
    }
    let l = null;
    if (p.includes(":")) {
      const u = p.lastIndexOf(":"),
        c = p.substring(0, u).trim(),
        h = p.substring(u + 1).trim();
      ["first", "last", "odd", "even"].includes(h) || /^nth\(\d+\)$/.test(h) ? ((o = c), (l = h)) : (o = p);
    } else o = p;
    if (!o) throw new Error(`Invalid segment pattern: ${t}`);
    if (((e.tag = o), a && (e.namespace = a), n))
      if (n.includes("=")) {
        const u = n.indexOf("=");
        ((e.attrName = n.substring(0, u).trim()), (e.attrValue = n.substring(u + 1).trim()));
      } else e.attrName = n.trim();
    if (l) {
      const u = l.match(/^nth\((\d+)\)$/);
      u ? ((e.position = "nth"), (e.positionValue = parseInt(u[1], 10))) : (e.position = l);
    }
    return e;
  }
  get length() {
    return this.segments.length;
  }
  hasDeepWildcard() {
    return this._hasDeepWildcard;
  }
  hasAttributeCondition() {
    return this._hasAttributeCondition;
  }
  hasPositionSelector() {
    return this._hasPositionSelector;
  }
  toString() {
    return this.pattern;
  }
}
class Pn {
  constructor() {
    ((this._byDepthAndTag = new Map()),
      (this._wildcardByDepth = new Map()),
      (this._deepWildcards = []),
      (this._patterns = new Set()),
      (this._sealed = !1));
  }
  add(t) {
    if (this._sealed)
      throw new TypeError("ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.");
    if (this._patterns.has(t.pattern)) return this;
    if ((this._patterns.add(t.pattern), t.hasDeepWildcard())) return (this._deepWildcards.push(t), this);
    const e = t.length,
      n = t.segments[t.segments.length - 1],
      s = n?.tag;
    if (s && s !== "*") {
      const i = `${e}:${s}`;
      (this._byDepthAndTag.has(i) || this._byDepthAndTag.set(i, []), this._byDepthAndTag.get(i).push(t));
    } else (this._wildcardByDepth.has(e) || this._wildcardByDepth.set(e, []), this._wildcardByDepth.get(e).push(t));
    return this;
  }
  addAll(t) {
    for (const e of t) this.add(e);
    return this;
  }
  has(t) {
    return this._patterns.has(t.pattern);
  }
  get size() {
    return this._patterns.size;
  }
  seal() {
    return ((this._sealed = !0), this);
  }
  get isSealed() {
    return this._sealed;
  }
  matchesAny(t) {
    return this.findMatch(t) !== null;
  }
  findMatch(t) {
    const e = t.getDepth(),
      n = `${e}:${t.getCurrentTag()}`,
      s = this._byDepthAndTag.get(n);
    if (s) {
      for (let a = 0; a < s.length; a++) if (t.matches(s[a])) return s[a];
    }
    const i = this._wildcardByDepth.get(e);
    if (i) {
      for (let a = 0; a < i.length; a++) if (t.matches(i[a])) return i[a];
    }
    for (let a = 0; a < this._deepWildcards.length; a++)
      if (t.matches(this._deepWildcards[a])) return this._deepWildcards[a];
    return null;
  }
}
const Sn = {
    cent: "¢",
    pound: "£",
    curren: "¤",
    yen: "¥",
    euro: "€",
    dollar: "$",
    euro: "€",
    fnof: "ƒ",
    inr: "₹",
    af: "؋",
    birr: "ብር",
    peso: "₱",
    rub: "₽",
    won: "₩",
    yuan: "¥",
    cedil: "¸",
  },
  or = { amp: "&", apos: "'", gt: ">", lt: "<", quot: '"' },
  Tn = {
    nbsp: " ",
    copy: "©",
    reg: "®",
    trade: "™",
    mdash: "—",
    ndash: "–",
    hellip: "…",
    laquo: "«",
    raquo: "»",
    lsquo: "‘",
    rsquo: "’",
    ldquo: "“",
    rdquo: "”",
    bull: "•",
    para: "¶",
    sect: "§",
    deg: "°",
    frac12: "½",
    frac14: "¼",
    frac34: "¾",
  },
  Cn = new Set("!?\\\\/[]$%{}^&*()<>|+");
function Ie(r) {
  if (r[0] === "#") throw new Error(`[EntityReplacer] Invalid character '#' in entity name: "${r}"`);
  for (const t of r) if (Cn.has(t)) throw new Error(`[EntityReplacer] Invalid character '${t}' in entity name: "${r}"`);
  return r;
}
function Ut() {
  const r = Object.create(null);
  for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
  for (const s of e)
    if (s)
      for (const i of Object.keys(s)) {
        const a = s[i];
        if (typeof a == "string") r[i] = a;
        else if (a && typeof a == "object" && a.val !== void 0) {
          const o = a.val;
          typeof o == "string" && (r[i] = o);
        }
      }
  return r;
}
const rt = "external",
  Et = "base",
  Ft = "all",
  z = Object.freeze({ allow: 0, leave: 1, remove: 2, throw: 3 }),
  On = new Set([9, 10, 13]);
class ar {
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var e;
    ((this._limit = t.limit || {}),
      (this._maxTotalExpansions = this._limit.maxTotalExpansions || 0),
      (this._maxExpandedLength = this._limit.maxExpandedLength || 0),
      (this._postCheck = typeof t.postCheck == "function" ? t.postCheck : (s) => s),
      (this._limitTiers =
        (e = this._limit.applyLimitsTo ?? rt) && e !== rt
          ? e === Ft
            ? new Set([Ft])
            : e === Et
              ? new Set([Et])
              : Array.isArray(e)
                ? new Set(e)
                : new Set([rt])
          : new Set([rt])),
      (this._numericAllowed = t.numericAllowed ?? !0),
      (this._baseMap = Ut(or, t.namedEntities || null)),
      (this._externalMap = Object.create(null)),
      (this._inputMap = Object.create(null)),
      (this._totalExpansions = 0),
      (this._expandedLength = 0),
      (this._removeSet = new Set(t.remove && Array.isArray(t.remove) ? t.remove : [])),
      (this._leaveSet = new Set(t.leave && Array.isArray(t.leave) ? t.leave : [])));
    const n = (function (s) {
      if (!s) return { xmlVersion: 1, onLevel: z.allow, nullLevel: z.remove };
      const i = s.xmlVersion === 1.1 ? 1.1 : 1,
        a = z[s.onNCR] ?? z.allow,
        o = z[s.nullNCR] ?? z.remove;
      return { xmlVersion: i, onLevel: a, nullLevel: Math.max(o, z.remove) };
    })(t.ncr);
    ((this._ncrXmlVersion = n.xmlVersion), (this._ncrOnLevel = n.onLevel), (this._ncrNullLevel = n.nullLevel));
  }
  setExternalEntities(t) {
    if (t) for (const e of Object.keys(t)) Ie(e);
    this._externalMap = Ut(t);
  }
  addExternalEntity(t, e) {
    (Ie(t), typeof e == "string" && e.indexOf("&") === -1 && (this._externalMap[t] = e));
  }
  addInputEntities(t) {
    ((this._totalExpansions = 0), (this._expandedLength = 0), (this._inputMap = Ut(t)));
  }
  reset() {
    return ((this._inputMap = Object.create(null)), (this._totalExpansions = 0), (this._expandedLength = 0), this);
  }
  setXmlVersion(t) {
    this._ncrXmlVersion = t === 1.1 ? 1.1 : 1;
  }
  decode(t) {
    if (typeof t != "string" || t.length === 0) return t;
    const e = t,
      n = [],
      s = t.length;
    let i = 0,
      a = 0;
    const o = this._maxTotalExpansions > 0,
      p = this._maxExpandedLength > 0,
      l = o || p;
    for (; a < s; ) {
      if (t.charCodeAt(a) !== 38) {
        a++;
        continue;
      }
      let c = a + 1;
      for (; c < s && t.charCodeAt(c) !== 59 && c - a <= 32; ) c++;
      if (c >= s || t.charCodeAt(c) !== 59) {
        a++;
        continue;
      }
      const h = t.slice(a + 1, c);
      if (h.length === 0) {
        a++;
        continue;
      }
      let d, g;
      if (this._removeSet.has(h)) ((d = ""), g === void 0 && (g = rt));
      else {
        if (this._leaveSet.has(h)) {
          a++;
          continue;
        }
        if (h.charCodeAt(0) === 35) {
          const f = this._resolveNCR(h);
          if (f === void 0) {
            a++;
            continue;
          }
          ((d = f), (g = Et));
        } else {
          const f = this._resolveName(h);
          ((d = f?.value), (g = f?.tier));
        }
      }
      if (d !== void 0) {
        if ((a > i && n.push(t.slice(i, a)), n.push(d), (i = c + 1), (a = i), l && this._tierCounts(g))) {
          if (o && (this._totalExpansions++, this._totalExpansions > this._maxTotalExpansions))
            throw new Error(
              `[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`,
            );
          if (p) {
            const f = d.length - (h.length + 2);
            if (f > 0 && ((this._expandedLength += f), this._expandedLength > this._maxExpandedLength))
              throw new Error(
                `[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`,
              );
          }
        }
      } else a++;
    }
    i < s && n.push(t.slice(i));
    const u = n.length === 0 ? t : n.join("");
    return this._postCheck(u, e);
  }
  _tierCounts(t) {
    return !!this._limitTiers.has(Ft) || this._limitTiers.has(t);
  }
  _resolveName(t) {
    return t in this._inputMap
      ? { value: this._inputMap[t], tier: rt }
      : t in this._externalMap
        ? { value: this._externalMap[t], tier: rt }
        : t in this._baseMap
          ? { value: this._baseMap[t], tier: Et }
          : void 0;
  }
  _classifyNCR(t) {
    return t === 0
      ? this._ncrNullLevel
      : (t >= 55296 && t <= 57343) || (this._ncrXmlVersion === 1 && t >= 1 && t <= 31 && !On.has(t))
        ? z.remove
        : -1;
  }
  _applyNCRAction(t, e, n) {
    switch (t) {
      case z.allow:
        return String.fromCodePoint(n);
      case z.remove:
        return "";
      case z.leave:
        return;
      case z.throw:
        throw new Error(
          `[EntityDecoder] Prohibited numeric character reference &${e}; (U+${n.toString(16).toUpperCase().padStart(4, "0")})`,
        );
      default:
        return String.fromCodePoint(n);
    }
  }
  _resolveNCR(t) {
    const e = t.charCodeAt(1);
    let n;
    if (
      ((n = e === 120 || e === 88 ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10)),
      Number.isNaN(n) || n < 0 || n > 1114111)
    )
      return;
    const s = this._classifyNCR(n);
    if (!this._numericAllowed && s < z.remove) return;
    const i = s === -1 ? this._ncrOnLevel : Math.max(this._ncrOnLevel, s);
    return this._applyNCRAction(i, t, n);
  }
}
function _n(r, t) {
  if (!r) return {};
  const e = t.attributesGroupName ? r[t.attributesGroupName] : r;
  if (!e) return {};
  const n = {};
  for (const s in e)
    s.startsWith(t.attributeNamePrefix) ? (n[s.substring(t.attributeNamePrefix.length)] = e[s]) : (n[s] = e[s]);
  return n;
}
function $n(r) {
  if (!r || typeof r != "string") return;
  const t = r.indexOf(":");
  if (t !== -1 && t > 0) {
    const e = r.substring(0, t);
    if (e !== "xmlns") return e;
  }
}
class jn {
  constructor(t, e) {
    var n;
    ((this.options = t),
      (this.currentNode = null),
      (this.tagsNodeStack = []),
      (this.parseXml = Mn),
      (this.parseTextData = In),
      (this.resolveNameSpace = kn),
      (this.buildAttributesMap = Rn),
      (this.isItStopNode = Vn),
      (this.replaceEntitiesValue = Un),
      (this.readStopNodeData = Bn),
      (this.saveTextToParentTag = Fn),
      (this.addChild = Dn),
      (this.ignoreAttributesFn =
        typeof (n = this.options.ignoreAttributes) == "function"
          ? n
          : Array.isArray(n)
            ? (a) => {
                for (const o of n)
                  if ((typeof o == "string" && a === o) || (o instanceof RegExp && o.test(a))) return !0;
              }
            : () => !1),
      (this.entityExpansionCount = 0),
      (this.currentExpandedLength = 0));
    let s = { ...or };
    (this.options.entityDecoder
      ? (this.entityDecoder = this.options.entityDecoder)
      : (typeof this.options.htmlEntities == "object"
          ? (s = this.options.htmlEntities)
          : this.options.htmlEntities === !0 && (s = { ...Tn, ...Sn }),
        (this.entityDecoder = new ar({
          namedEntities: { ...s, ...e },
          numericAllowed: this.options.htmlEntities,
          limit: {
            maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
            maxExpandedLength: this.options.processEntities.maxExpandedLength,
            applyLimitsTo: this.options.processEntities.appliesTo,
          },
        }))),
      (this.matcher = new ae()),
      (this.readonlyMatcher = this.matcher.readOnly()),
      (this.isCurrentNodeStopNode = !1),
      (this.stopNodeExpressionsSet = new Pn()));
    const i = this.options.stopNodes;
    if (i && i.length > 0) {
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        typeof o == "string"
          ? this.stopNodeExpressionsSet.add(new ot(o))
          : o instanceof ot && this.stopNodeExpressionsSet.add(o);
      }
      this.stopNodeExpressionsSet.seal();
    }
  }
}
function In(r, t, e, n, s, i, a) {
  const o = this.options;
  if (r !== void 0 && (o.trimValues && !n && (r = r.trim()), r.length > 0)) {
    a || (r = this.replaceEntitiesValue(r, t, e));
    const p = o.jPath ? e.toString() : e,
      l = o.tagValueProcessor(t, r, p, s, i);
    return l == null
      ? r
      : typeof l != typeof r || l !== r
        ? l
        : o.trimValues || r.trim() === r
          ? ur(r, o.parseTagValue, o.numberParseOptions)
          : r;
  }
}
function kn(r) {
  if (this.options.removeNSPrefix) {
    const t = r.split(":"),
      e = r.charAt(0) === "/" ? "/" : "";
    if (t[0] === "xmlns") return "";
    t.length === 2 && (r = e + t[1]);
  }
  return r;
}
const Ln = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
function Rn(r, t, e) {
  let n = arguments.length > 3 && arguments[3] !== void 0 && arguments[3];
  const s = this.options;
  if (n === !0 || (s.ignoreAttributes !== !0 && typeof r == "string")) {
    const i = rr(r, Ln),
      a = i.length,
      o = {},
      p = new Array(a);
    let l = !1;
    const u = {};
    for (let d = 0; d < a; d++) {
      const g = this.resolveNameSpace(i[d][1]),
        f = i[d][4];
      if (g.length && f !== void 0) {
        let m = f;
        (s.trimValues && (m = m.trim()),
          (m = this.replaceEntitiesValue(m, e, this.readonlyMatcher)),
          (p[d] = m),
          (u[g] = m),
          (l = !0));
      }
    }
    l && typeof t == "object" && t.updateCurrent && t.updateCurrent(u);
    const c = s.jPath ? t.toString() : this.readonlyMatcher;
    let h = !1;
    for (let d = 0; d < a; d++) {
      const g = this.resolveNameSpace(i[d][1]);
      if (this.ignoreAttributesFn(g, c)) continue;
      let f = s.attributeNamePrefix + g;
      if (g.length)
        if ((s.transformAttributeName && (f = s.transformAttributeName(f)), (f = lr(f, s)), i[d][4] !== void 0)) {
          const m = p[d],
            y = s.attributeValueProcessor(g, m, c);
          ((o[f] =
            y == null ? m : typeof y != typeof m || y !== m ? y : ur(m, s.parseAttributeValue, s.numberParseOptions)),
            (h = !0));
        } else s.allowBooleanAttributes && ((o[f] = !0), (h = !0));
    }
    if (!h) return;
    if (s.attributesGroupName && !s.preserveOrder) {
      const d = {};
      return ((d[s.attributesGroupName] = o), d);
    }
    return o;
  }
}
const Mn = function (r) {
  r = r.replace(
    /\r\n?/g,
    `
`,
  );
  const t = new K("!xml");
  let e = t,
    n = "";
  (this.matcher.reset(), this.entityDecoder.reset(), (this.entityExpansionCount = 0), (this.currentExpandedLength = 0));
  const s = this.options,
    i = new bn(s.processEntities),
    a = r.length;
  for (let o = 0; o < a; o++)
    if (r[o] === "<") {
      const p = r.charCodeAt(o + 1);
      if (p === 47) {
        const l = it(r, ">", o, "Closing Tag is not closed.");
        let u = r.substring(o + 2, l).trim();
        if (s.removeNSPrefix) {
          const h = u.indexOf(":");
          h !== -1 && (u = u.substr(h + 1));
        }
        ((u = Vt(s.transformTagName, u, "", s).tagName),
          e && (n = this.saveTextToParentTag(n, e, this.readonlyMatcher)));
        const c = this.matcher.getCurrentTag();
        if (u && s.unpairedTagsSet.has(u)) throw new Error(`Unpaired tag can not be used as closing tag: </${u}>`);
        (c && s.unpairedTagsSet.has(c) && (this.matcher.pop(), this.tagsNodeStack.pop()),
          this.matcher.pop(),
          (this.isCurrentNodeStopNode = !1),
          (e = this.tagsNodeStack.pop()),
          (n = ""),
          (o = l));
      } else if (p === 63) {
        let l = Kt(r, o, !1, "?>");
        if (!l) throw new Error("Pi Tag is not closed.");
        n = this.saveTextToParentTag(n, e, this.readonlyMatcher);
        const u = this.buildAttributesMap(l.tagExp, this.matcher, l.tagName, !0);
        if (u) {
          const c = u[this.options.attributeNamePrefix + "version"];
          this.entityDecoder.setXmlVersion(Number(c) || 1);
        }
        if (!((s.ignoreDeclaration && l.tagName === "?xml") || s.ignorePiTags)) {
          const c = new K(l.tagName);
          (c.add(s.textNodeName, ""),
            l.tagName !== l.tagExp && l.attrExpPresent && s.ignoreAttributes !== !0 && (c[":@"] = u),
            this.addChild(e, c, this.readonlyMatcher, o));
        }
        o = l.closeIndex + 1;
      } else if (p === 33 && r.charCodeAt(o + 2) === 45 && r.charCodeAt(o + 3) === 45) {
        const l = it(r, "-->", o + 4, "Comment is not closed.");
        if (s.commentPropName) {
          const u = r.substring(o + 4, l - 2);
          ((n = this.saveTextToParentTag(n, e, this.readonlyMatcher)),
            e.add(s.commentPropName, [{ [s.textNodeName]: u }]));
        }
        o = l;
      } else if (p === 33 && r.charCodeAt(o + 2) === 68) {
        const l = i.readDocType(r, o);
        (this.entityDecoder.addInputEntities(l.entities), (o = l.i));
      } else if (p === 33 && r.charCodeAt(o + 2) === 91) {
        const l = it(r, "]]>", o, "CDATA is not closed.") - 2,
          u = r.substring(o + 9, l);
        n = this.saveTextToParentTag(n, e, this.readonlyMatcher);
        let c = this.parseTextData(u, e.tagname, this.readonlyMatcher, !0, !1, !0, !0);
        (c == null && (c = ""),
          s.cdataPropName ? e.add(s.cdataPropName, [{ [s.textNodeName]: u }]) : e.add(s.textNodeName, c),
          (o = l + 2));
      } else {
        let l = Kt(r, o, s.removeNSPrefix);
        if (!l) {
          const x = r.substring(Math.max(0, o - 50), Math.min(a, o + 50));
          throw new Error(`readTagExp returned undefined at position ${o}. Context: "${x}"`);
        }
        let u = l.tagName;
        const c = l.rawTagName;
        let h = l.tagExp,
          d = l.attrExpPresent,
          g = l.closeIndex;
        if (
          (({ tagName: u, tagExp: h } = Vt(s.transformTagName, u, h, s)),
          s.strictReservedNames &&
            (u === s.commentPropName || u === s.cdataPropName || u === s.textNodeName || u === s.attributesGroupName))
        )
          throw new Error(`Invalid tag name: ${u}`);
        e && n && e.tagname !== "!xml" && (n = this.saveTextToParentTag(n, e, this.readonlyMatcher, !1));
        const f = e;
        f && s.unpairedTagsSet.has(f.tagname) && ((e = this.tagsNodeStack.pop()), this.matcher.pop());
        let m = !1;
        h.length > 0 &&
          h.lastIndexOf("/") === h.length - 1 &&
          ((m = !0),
          u[u.length - 1] === "/" ? ((u = u.substr(0, u.length - 1)), (h = u)) : (h = h.substr(0, h.length - 1)),
          (d = u !== h));
        let y,
          v = null;
        ((y = $n(c)),
          u !== t.tagname && this.matcher.push(u, {}, y),
          u !== h && d && ((v = this.buildAttributesMap(h, this.matcher, u)), v && _n(v, s)),
          u !== t.tagname && (this.isCurrentNodeStopNode = this.isItStopNode()));
        const b = o;
        if (this.isCurrentNodeStopNode) {
          let x = "";
          if (m) o = l.closeIndex;
          else if (s.unpairedTagsSet.has(u)) o = l.closeIndex;
          else {
            const N = this.readStopNodeData(r, c, g + 1);
            if (!N) throw new Error(`Unexpected end of ${c}`);
            ((o = N.i), (x = N.tagContent));
          }
          const w = new K(u);
          (v && (w[":@"] = v),
            w.add(s.textNodeName, x),
            this.matcher.pop(),
            (this.isCurrentNodeStopNode = !1),
            this.addChild(e, w, this.readonlyMatcher, b));
        } else {
          if (m) {
            ({ tagName: u, tagExp: h } = Vt(s.transformTagName, u, h, s));
            const x = new K(u);
            (v && (x[":@"] = v),
              this.addChild(e, x, this.readonlyMatcher, b),
              this.matcher.pop(),
              (this.isCurrentNodeStopNode = !1));
          } else {
            if (s.unpairedTagsSet.has(u)) {
              const x = new K(u);
              (v && (x[":@"] = v),
                this.addChild(e, x, this.readonlyMatcher, b),
                this.matcher.pop(),
                (this.isCurrentNodeStopNode = !1),
                (o = l.closeIndex));
              continue;
            }
            {
              const x = new K(u);
              if (this.tagsNodeStack.length > s.maxNestedTags) throw new Error("Maximum nested tags exceeded");
              (this.tagsNodeStack.push(e), v && (x[":@"] = v), this.addChild(e, x, this.readonlyMatcher, b), (e = x));
            }
          }
          ((n = ""), (o = g));
        }
      }
    } else n += r[o];
  return t.child;
};
function Dn(r, t, e, n) {
  this.options.captureMetaData || (n = void 0);
  const s = this.options.jPath ? e.toString() : e,
    i = this.options.updateTag(t.tagname, s, t[":@"]);
  i === !1 || (typeof i == "string" && (t.tagname = i), r.addChild(t, n));
}
function Un(r, t, e) {
  const n = this.options.processEntities;
  if (!n || !n.enabled) return r;
  if (n.allowedTags) {
    const s = this.options.jPath ? e.toString() : e;
    if (!(Array.isArray(n.allowedTags) ? n.allowedTags.includes(t) : n.allowedTags(t, s))) return r;
  }
  if (n.tagFilter) {
    const s = this.options.jPath ? e.toString() : e;
    if (!n.tagFilter(t, s)) return r;
  }
  return this.entityDecoder.decode(r);
}
function Fn(r, t, e, n) {
  return (
    r &&
      (n === void 0 && (n = t.child.length === 0),
      (r = this.parseTextData(r, t.tagname, e, !1, !!t[":@"] && Object.keys(t[":@"]).length !== 0, n)) !== void 0 &&
        r !== "" &&
        t.add(this.options.textNodeName, r),
      (r = "")),
    r
  );
}
function Vn() {
  return this.stopNodeExpressionsSet.size !== 0 && this.matcher.matchesAny(this.stopNodeExpressionsSet);
}
function it(r, t, e, n) {
  const s = r.indexOf(t, e);
  if (s === -1) throw new Error(n);
  return s + t.length - 1;
}
function Wn(r, t, e, n) {
  const s = r.indexOf(t, e);
  if (s === -1) throw new Error(n);
  return s;
}
function Kt(r, t, e) {
  const n = (function (u, c) {
    let h = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ">",
      d = 0;
    const g = u.length,
      f = h.charCodeAt(0),
      m = h.length > 1 ? h.charCodeAt(1) : -1;
    let y = "",
      v = c;
    for (let b = c; b < g; b++) {
      const x = u.charCodeAt(b);
      if (d) x === d && (d = 0);
      else if (x === 34 || x === 39) d = x;
      else if (x === f) {
        if (m === -1) return ((y += u.substring(v, b)), { data: y, index: b });
        if (u.charCodeAt(b + 1) === m) return ((y += u.substring(v, b)), { data: y, index: b });
      } else x !== 9 || d || ((y += u.substring(v, b) + " "), (v = b + 1));
    }
  })(r, t + 1, arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ">");
  if (!n) return;
  let s = n.data;
  const i = n.index,
    a = s.search(/\s/);
  let o = s,
    p = !0;
  a !== -1 && ((o = s.substring(0, a)), (s = s.substring(a + 1).trimStart()));
  const l = o;
  if (e) {
    const u = o.indexOf(":");
    u !== -1 && ((o = o.substr(u + 1)), (p = o !== n.data.substr(u + 1)));
  }
  return { tagName: o, tagExp: s, closeIndex: i, attrExpPresent: p, rawTagName: l };
}
function Bn(r, t, e) {
  const n = e;
  let s = 1;
  const i = r.length;
  for (; e < i; e++)
    if (r[e] === "<") {
      const a = r.charCodeAt(e + 1);
      if (a === 47) {
        const o = Wn(r, ">", e, `${t} is not closed`);
        if (r.substring(e + 2, o).trim() === t && (s--, s === 0)) return { tagContent: r.substring(n, e), i: o };
        e = o;
      } else if (a === 63) e = it(r, "?>", e + 1, "StopNode is not closed.");
      else if (a === 33 && r.charCodeAt(e + 2) === 45 && r.charCodeAt(e + 3) === 45)
        e = it(r, "-->", e + 3, "StopNode is not closed.");
      else if (a === 33 && r.charCodeAt(e + 2) === 91) e = it(r, "]]>", e, "StopNode is not closed.") - 2;
      else {
        const o = Kt(r, e, ">");
        o && ((o && o.tagName) === t && o.tagExp[o.tagExp.length - 1] !== "/" && s++, (e = o.closeIndex));
      }
    }
}
function ur(r, t, e) {
  if (t && typeof r == "string") {
    const n = r.trim();
    return (
      n === "true" ||
      (n !== "false" &&
        (function (s) {
          let i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          if (((i = Object.assign({}, Nn, i)), !s || typeof s != "string")) return s;
          let a = s.trim();
          if (a.length === 0 || (i.skipLike !== void 0 && i.skipLike.test(a))) return s;
          if (a === "0") return 0;
          if (i.hex && wn.test(a))
            return (function (p) {
              if (parseInt) return parseInt(p, 16);
              if (Number.parseInt) return Number.parseInt(p, 16);
              if (window && window.parseInt) return window.parseInt(p, 16);
              throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
            })(a);
          if (isFinite(a)) {
            if (a.includes("e") || a.includes("E"))
              return (function (p, l, u) {
                if (!u.eNotation) return p;
                const c = l.match(En);
                if (c) {
                  let h = c[1] || "";
                  const d = c[3].indexOf("e") === -1 ? "E" : "e",
                    g = c[2],
                    f = h ? p[g.length + 1] === d : p[g.length] === d;
                  return g.length > 1 && f
                    ? p
                    : (g.length !== 1 || (!c[3].startsWith(`.${d}`) && c[3][0] !== d)) && g.length > 0
                      ? u.leadingZeros && !f
                        ? ((l = (c[1] || "") + c[3]), Number(l))
                        : p
                      : Number(l);
                }
                return p;
              })(s, a, i);
            {
              const p = xn.exec(a);
              if (p) {
                const l = p[1] || "",
                  u = p[2];
                let c =
                  ((o = p[3]) &&
                    o.indexOf(".") !== -1 &&
                    ((o = o.replace(/0+$/, "")) === "."
                      ? (o = "0")
                      : o[0] === "."
                        ? (o = "0" + o)
                        : o[o.length - 1] === "." && (o = o.substring(0, o.length - 1))),
                  o);
                const h = l ? s[u.length + 1] === "." : s[u.length] === ".";
                if (!i.leadingZeros && (u.length > 1 || (u.length === 1 && !h))) return s;
                {
                  const d = Number(a),
                    g = String(d);
                  if (d === 0) return d;
                  if (g.search(/[eE]/) !== -1) return i.eNotation ? d : s;
                  if (a.indexOf(".") !== -1) return g === "0" || g === c || g === `${l}${c}` ? d : s;
                  let f = u ? c : a;
                  return u ? (f === g || l + f === g ? d : s) : f === g || f === l + g ? d : s;
                }
              }
              return s;
            }
          }
          var o;
          return (function (p, l, u) {
            const c = l === 1 / 0;
            switch (u.infinity.toLowerCase()) {
              case "null":
                return null;
              case "infinity":
                return l;
              case "string":
                return c ? "Infinity" : "-Infinity";
              default:
                return p;
            }
          })(s, Number(a), i);
        })(r, e))
    );
  }
  return r !== void 0 ? r : "";
}
function Vt(r, t, e, n) {
  if (r) {
    const s = r(t);
    (e === t && (e = s), (t = s));
  }
  return { tagName: (t = lr(t, n)), tagExp: e };
}
function lr(r, t) {
  if (nr.includes(r))
    throw new Error(
      `[SECURITY] Invalid name: "${r}" is a reserved JavaScript keyword that could cause prototype pollution`,
    );
  return oe.includes(r) ? t.onDangerousProperty(r) : r;
}
const Wt = K.getMetaDataSymbol();
function zn(r, t) {
  if (!r || typeof r != "object") return {};
  if (!t) return r;
  const e = {};
  for (const n in r) n.startsWith(t) ? (e[n.substring(t.length)] = r[n]) : (e[n] = r[n]);
  return e;
}
function Gn(r, t, e, n) {
  return hr(r, t, e, n);
}
function hr(r, t, e, n) {
  let s;
  const i = {};
  for (let a = 0; a < r.length; a++) {
    const o = r[a],
      p = qn(o);
    if (p !== void 0 && p !== t.textNodeName) {
      const l = zn(o[":@"] || {}, t.attributeNamePrefix);
      e.push(p, l);
    }
    if (p === t.textNodeName) s === void 0 ? (s = o[p]) : (s += "" + o[p]);
    else {
      if (p === void 0) continue;
      if (o[p]) {
        let l = hr(o[p], t, e, n);
        const u = Yn(l, t);
        if (
          (o[":@"]
            ? Hn(l, o[":@"], n, t)
            : Object.keys(l).length !== 1 || l[t.textNodeName] === void 0 || t.alwaysCreateTextNode
              ? Object.keys(l).length === 0 && (t.alwaysCreateTextNode ? (l[t.textNodeName] = "") : (l = ""))
              : (l = l[t.textNodeName]),
          o[Wt] !== void 0 && typeof l == "object" && l !== null && (l[Wt] = o[Wt]),
          i[p] !== void 0 && Object.prototype.hasOwnProperty.call(i, p))
        )
          (Array.isArray(i[p]) || (i[p] = [i[p]]), i[p].push(l));
        else {
          const c = t.jPath ? n.toString() : n;
          t.isArray(p, c, u) ? (i[p] = [l]) : (i[p] = l);
        }
        p !== void 0 && p !== t.textNodeName && e.pop();
      }
    }
  }
  return (typeof s == "string" ? s.length > 0 && (i[t.textNodeName] = s) : s !== void 0 && (i[t.textNodeName] = s), i);
}
function qn(r) {
  const t = Object.keys(r);
  for (let e = 0; e < t.length; e++) {
    const n = t[e];
    if (n !== ":@") return n;
  }
}
function Hn(r, t, e, n) {
  if (t) {
    const s = Object.keys(t),
      i = s.length;
    for (let a = 0; a < i; a++) {
      const o = s[a],
        p = o.startsWith(n.attributeNamePrefix) ? o.substring(n.attributeNamePrefix.length) : o,
        l = n.jPath ? e.toString() + "." + p : e;
      n.isArray(o, l, !0, !0) ? (r[o] = [t[o]]) : (r[o] = t[o]);
    }
  }
}
function Yn(r, t) {
  const { textNodeName: e } = t,
    n = Object.keys(r).length;
  return n === 0 || !(n !== 1 || (!r[e] && typeof r[e] != "boolean" && r[e] !== 0));
}
const Zn = { allowBooleanAttributes: !1, unpairedTags: [] };
function ke(r) {
  return (
    r === " " ||
    r === "	" ||
    r ===
      `
` ||
    r === "\r"
  );
}
function Le(r, t) {
  const e = t;
  for (; t < r.length; t++)
    if (!(r[t] != "?" && r[t] != " ")) {
      const n = r.substr(e, t - e);
      if (t > 5 && n === "xml")
        return $("InvalidXml", "XML declaration allowed only at the start of the document.", M(r, t));
      if (r[t] == "?" && r[t + 1] == ">") {
        t++;
        break;
      }
    }
  return t;
}
function Re(r, t) {
  if (r.length > t + 5 && r[t + 1] === "-" && r[t + 2] === "-") {
    for (t += 3; t < r.length; t++)
      if (r[t] === "-" && r[t + 1] === "-" && r[t + 2] === ">") {
        t += 2;
        break;
      }
  } else if (
    r.length > t + 8 &&
    r[t + 1] === "D" &&
    r[t + 2] === "O" &&
    r[t + 3] === "C" &&
    r[t + 4] === "T" &&
    r[t + 5] === "Y" &&
    r[t + 6] === "P" &&
    r[t + 7] === "E"
  ) {
    let e = 1;
    for (t += 8; t < r.length; t++)
      if (r[t] === "<") e++;
      else if (r[t] === ">" && (e--, e === 0)) break;
  } else if (
    r.length > t + 9 &&
    r[t + 1] === "[" &&
    r[t + 2] === "C" &&
    r[t + 3] === "D" &&
    r[t + 4] === "A" &&
    r[t + 5] === "T" &&
    r[t + 6] === "A" &&
    r[t + 7] === "["
  ) {
    for (t += 8; t < r.length; t++)
      if (r[t] === "]" && r[t + 1] === "]" && r[t + 2] === ">") {
        t += 2;
        break;
      }
  }
  return t;
}
function Xn(r, t) {
  let e = "",
    n = "",
    s = !1;
  for (; t < r.length; t++) {
    if (r[t] === '"' || r[t] === "'") n === "" ? (n = r[t]) : n !== r[t] || (n = "");
    else if (r[t] === ">" && n === "") {
      s = !0;
      break;
    }
    e += r[t];
  }
  return n === "" && { value: e, index: t, tagClosed: s };
}
const Jn = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
function Me(r, t) {
  const e = rr(r, Jn),
    n = {};
  for (let s = 0; s < e.length; s++) {
    if (e[s][1].length === 0)
      return $("InvalidAttr", "Attribute '" + e[s][2] + "' has no space in starting.", mt(e[s]));
    if (e[s][3] !== void 0 && e[s][4] === void 0)
      return $("InvalidAttr", "Attribute '" + e[s][2] + "' is without value.", mt(e[s]));
    if (e[s][3] === void 0 && !t.allowBooleanAttributes)
      return $("InvalidAttr", "boolean attribute '" + e[s][2] + "' is not allowed.", mt(e[s]));
    const i = e[s][2];
    if (!Qn(i)) return $("InvalidAttr", "Attribute '" + i + "' is an invalid name.", mt(e[s]));
    if (Object.prototype.hasOwnProperty.call(n, i))
      return $("InvalidAttr", "Attribute '" + i + "' is repeated.", mt(e[s]));
    n[i] = 1;
  }
  return !0;
}
function Kn(r, t) {
  if (r[++t] === ";") return -1;
  if (r[t] === "#")
    return (function (n, s) {
      let i = /\d/;
      for (n[s] === "x" && (s++, (i = /[\da-fA-F]/)); s < n.length; s++) {
        if (n[s] === ";") return s;
        if (!n[s].match(i)) break;
      }
      return -1;
    })(r, ++t);
  let e = 0;
  for (; t < r.length; t++, e++)
    if (!(r[t].match(/\w/) && e < 20)) {
      if (r[t] === ";") break;
      return -1;
    }
  return t;
}
function $(r, t, e) {
  return { err: { code: r, msg: t, line: e.line || e, col: e.col } };
}
function Qn(r) {
  return jt(r);
}
function M(r, t) {
  const e = r.substring(0, t).split(/\r?\n/);
  return { line: e.length, col: e[e.length - 1].length + 1 };
}
function mt(r) {
  return r.startIndex + r[1].length;
}
class cr {
  constructor(t) {
    ((this.externalEntities = {}), (this.options = vn(t)));
  }
  parse(t, e) {
    if (typeof t != "string" && t.toString) t = t.toString();
    else if (typeof t != "string") throw new Error("XML data is accepted in String or Bytes[] form.");
    if (e) {
      e === !0 && (e = {});
      const i = (function (a, o) {
        o = Object.assign({}, Zn, o);
        const p = [];
        let l = !1,
          u = !1;
        a[0] === "\uFEFF" && (a = a.substr(1));
        for (let c = 0; c < a.length; c++)
          if (a[c] === "<" && a[c + 1] === "?") {
            if (((c += 2), (c = Le(a, c)), c.err)) return c;
          } else {
            if (a[c] !== "<") {
              if (ke(a[c])) continue;
              return $("InvalidChar", "char '" + a[c] + "' is not expected.", M(a, c));
            }
            {
              let h = c;
              if ((c++, a[c] === "!")) {
                c = Re(a, c);
                continue;
              }
              {
                let d = !1;
                a[c] === "/" && ((d = !0), c++);
                let g = "";
                for (
                  ;
                  c < a.length &&
                  a[c] !== ">" &&
                  a[c] !== " " &&
                  a[c] !== "	" &&
                  a[c] !==
                    `
` &&
                  a[c] !== "\r";
                  c++
                )
                  g += a[c];
                if (((g = g.trim()), g[g.length - 1] === "/" && ((g = g.substring(0, g.length - 1)), c--), !jt(g))) {
                  let y;
                  return (
                    (y = g.trim().length === 0 ? "Invalid space after '<'." : "Tag '" + g + "' is an invalid name."),
                    $("InvalidTag", y, M(a, c))
                  );
                }
                const f = Xn(a, c);
                if (f === !1) return $("InvalidAttr", "Attributes for '" + g + "' have open quote.", M(a, c));
                let m = f.value;
                if (((c = f.index), m[m.length - 1] === "/")) {
                  const y = c - m.length;
                  m = m.substring(0, m.length - 1);
                  const v = Me(m, o);
                  if (v !== !0) return $(v.err.code, v.err.msg, M(a, y + v.err.line));
                  l = !0;
                } else if (d) {
                  if (!f.tagClosed)
                    return $("InvalidTag", "Closing tag '" + g + "' doesn't have proper closing.", M(a, c));
                  if (m.trim().length > 0)
                    return $(
                      "InvalidTag",
                      "Closing tag '" + g + "' can't have attributes or invalid starting.",
                      M(a, h),
                    );
                  if (p.length === 0) return $("InvalidTag", "Closing tag '" + g + "' has not been opened.", M(a, h));
                  {
                    const y = p.pop();
                    if (g !== y.tagName) {
                      let v = M(a, y.tagStartPos);
                      return $(
                        "InvalidTag",
                        "Expected closing tag '" +
                          y.tagName +
                          "' (opened in line " +
                          v.line +
                          ", col " +
                          v.col +
                          ") instead of closing tag '" +
                          g +
                          "'.",
                        M(a, h),
                      );
                    }
                    p.length == 0 && (u = !0);
                  }
                } else {
                  const y = Me(m, o);
                  if (y !== !0) return $(y.err.code, y.err.msg, M(a, c - m.length + y.err.line));
                  if (u === !0) return $("InvalidXml", "Multiple possible root nodes found.", M(a, c));
                  (o.unpairedTags.indexOf(g) !== -1 || p.push({ tagName: g, tagStartPos: h }), (l = !0));
                }
                for (c++; c < a.length; c++)
                  if (a[c] === "<") {
                    if (a[c + 1] === "!") {
                      (c++, (c = Re(a, c)));
                      continue;
                    }
                    if (a[c + 1] !== "?") break;
                    if (((c = Le(a, ++c)), c.err)) return c;
                  } else if (a[c] === "&") {
                    const y = Kn(a, c);
                    if (y == -1) return $("InvalidChar", "char '&' is not expected.", M(a, c));
                    c = y;
                  } else if (u === !0 && !ke(a[c])) return $("InvalidXml", "Extra text at the end", M(a, c));
                a[c] === "<" && c--;
              }
            }
          }
        return l
          ? p.length == 1
            ? $("InvalidTag", "Unclosed tag '" + p[0].tagName + "'.", M(a, p[0].tagStartPos))
            : !(p.length > 0) ||
              $(
                "InvalidXml",
                "Invalid '" +
                  JSON.stringify(
                    p.map((c) => c.tagName),
                    null,
                    4,
                  ).replace(/\r?\n/g, "") +
                  "' found.",
                { line: 1, col: 1 },
              )
          : $("InvalidXml", "Start tag expected.", 1);
      })(t, e);
      if (i !== !0) throw Error(`${i.err.msg}:${i.err.line}:${i.err.col}`);
    }
    const n = new jn(this.options, this.externalEntities),
      s = n.parseXml(t);
    return this.options.preserveOrder || s === void 0 ? s : Gn(s, this.options, n.matcher, n.readonlyMatcher);
  }
  addEntity(t, e) {
    if (e.indexOf("&") !== -1) throw new Error("Entity value can't have '&'");
    if (t.indexOf("&") !== -1 || t.indexOf(";") !== -1)
      throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    if (e === "&") throw new Error("An entity with value '&' is not permitted");
    this.externalEntities[t] = e;
  }
  static getMetaDataSymbol() {
    return K.getMetaDataSymbol();
  }
}
var ts = C(829),
  Z = C.n(ts),
  nt = (function (r) {
    return ((r.Array = "array"), (r.Object = "object"), (r.Original = "original"), r);
  })(nt || {});
function De(r) {
  return typeof r == "string" ? r : r.toString(".", !1);
}
function pr(r, t) {
  if (!r.endsWith("propstat.prop.displayname")) return t;
}
function At(r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : nt.Original;
  const n = Z().get(r, t);
  return e === "array" && Array.isArray(n) === !1 ? [n] : e === "object" && Array.isArray(n) ? n[0] : n;
}
function It(r, t) {
  return (
    (t = t ?? { attributeNamePrefix: "@", attributeParsers: [], tagParsers: [pr] }),
    new Promise((e) => {
      e(
        (function (n) {
          const { multistatus: s } = n;
          if (s === "") return { multistatus: { response: [] } };
          if (!s) throw new Error("Invalid response: No root multistatus found");
          const i = { multistatus: Array.isArray(s) ? s[0] : s };
          return (
            Z().set(i, "multistatus.response", At(i, "multistatus.response", nt.Array)),
            Z().set(
              i,
              "multistatus.response",
              Z()
                .get(i, "multistatus.response")
                .map((a) =>
                  (function (o) {
                    const p = Object.assign({}, o);
                    return (
                      p.status
                        ? Z().set(p, "status", At(p, "status", nt.Object))
                        : (Z().set(p, "propstat", At(p, "propstat", nt.Object)),
                          Z().set(p, "propstat.prop", At(p, "propstat.prop", nt.Object))),
                      p
                    );
                  })(a),
                ),
            ),
            i
          );
        })(
          (function (n) {
            let { attributeNamePrefix: s, attributeParsers: i, entityDecoder: a, tagParsers: o } = n;
            const p = {
              allowBooleanAttributes: !0,
              attributeNamePrefix: s,
              textNodeName: "text",
              ignoreAttributes: !1,
              removeNSPrefix: !0,
              jPath: !1,
              numberParseOptions: { hex: !0, leadingZeros: !1 },
              attributeValueProcessor(l, u, c) {
                const h = De(c);
                for (const d of i)
                  try {
                    const g = d(h, u);
                    if (g !== u) return g;
                  } catch {}
                return u;
              },
              tagValueProcessor(l, u, c) {
                const h = De(c);
                for (const d of o)
                  try {
                    const g = d(h, u);
                    if (g !== u) return g;
                  } catch {}
                return u;
              },
            };
            return (
              a &&
                (p.entityDecoder = new ar({
                  limit: {
                    maxTotalExpansions: a.limit?.maxTotalExpansions ?? 0,
                    maxExpandedLength: a.limit?.maxExpandedLength ?? 0,
                  },
                })),
              new cr(p)
            );
          })(t).parse(r),
        ),
      );
    })
  );
}
function ue(r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 && arguments[2];
  const {
      getlastmodified: n = null,
      getcontentlength: s = "0",
      resourcetype: i = null,
      getcontenttype: a = null,
      getetag: o = null,
    } = r,
    p = i && typeof i == "object" && i.collection !== void 0 ? "directory" : "file",
    l = {
      filename: t,
      basename: St().basename(t),
      lastmod: n,
      size: parseInt(s, 10),
      type: p,
      etag: typeof o == "string" ? o.replace(/"/g, "") : null,
    };
  return (
    p === "file" && (l.mime = a && typeof a == "string" ? a.split(";")[0] : ""),
    e && (r.displayname !== void 0 && (r.displayname = String(r.displayname)), (l.props = r)),
    l
  );
}
function es(r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 && arguments[2],
    n = null;
  try {
    r.multistatus.response[0].propstat && (n = r.multistatus.response[0]);
  } catch {}
  if (!n) throw new Error("Failed getting item stat: bad response");
  const {
      propstat: { prop: s, status: i },
    } = n,
    [a, o, p] = i.split(" ", 3),
    l = parseInt(o, 10);
  if (l >= 400) {
    const u = new Error(`Invalid response: ${l} ${p}`);
    throw ((u.status = l), u);
  }
  return ue(s, bt(t), e);
}
function rs(r) {
  switch (String(r)) {
    case "-3":
      return "unlimited";
    case "-2":
    case "-1":
      return "unknown";
    default:
      return parseInt(String(r), 10);
  }
}
function Bt(r, t, e) {
  return e ? (t ? t(r) : r) : ((r && r.then) || (r = Promise.resolve(r)), t ? r.then(t) : r);
}
const le = (function (r) {
  return function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    try {
      return Promise.resolve(r.apply(this, t));
    } catch (n) {
      return Promise.reject(n);
    }
  };
})(function (r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  const { details: n = !1 } = e,
    s = I(
      { url: _(r.remoteURL, O(t)), method: "PROPFIND", headers: { Accept: "text/plain,application/xml", Depth: "0" } },
      r,
      e,
    );
  return Bt(j(s, r), function (i) {
    return (
      k(r, i),
      Bt(i.text(), function (a) {
        return Bt(It(a, r.parsing), function (o) {
          const p = es(o, t, n);
          return at(i, p, n);
        });
      })
    );
  });
});
function fr(r, t, e) {
  return e ? (t ? t(r) : r) : ((r && r.then) || (r = Promise.resolve(r)), t ? r.then(t) : r);
}
const ns = gr(function (r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  const n = (function (i) {
    if (!i || i === "/") return [];
    let a = i;
    const o = [];
    do (o.push(a), (a = St().dirname(a)));
    while (a && a !== "/");
    return o;
  })(bt(t));
  n.sort((i, a) => (i.length > a.length ? 1 : a.length > i.length ? -1 : 0));
  let s = !1;
  return (function (i, a, o) {
    if (typeof i[Fe] == "function") {
      let f = function (m) {
        try {
          for (; !(p = c.next()).done; )
            if ((m = a(p.value)) && m.then) {
              if (!Ve(m)) return void m.then(f, u || (u = U.bind(null, (l = new st()), 2)));
              m = m.v;
            }
          l ? U(l, 1, m) : (l = m);
        } catch (y) {
          U(l || (l = new st()), 2, y);
        }
      };
      var p,
        l,
        u,
        c = i[Fe]();
      if ((f(), c.return)) {
        var h = function (m) {
          try {
            p.done || c.return();
          } catch {}
          return m;
        };
        if (l && l.then)
          return l.then(h, function (m) {
            throw h(m);
          });
        h();
      }
      return l;
    }
    if (!("length" in i)) throw new TypeError("Object is not iterable");
    for (var d = [], g = 0; g < i.length; g++) d.push(i[g]);
    return (function (f, m, y) {
      var v,
        b,
        x = -1;
      return (
        (function w(N) {
          try {
            for (; ++x < f.length && (!y || !y()); )
              if ((N = m(x)) && N.then) {
                if (!Ve(N)) return void N.then(w, b || (b = U.bind(null, (v = new st()), 2)));
                N = N.v;
              }
            v ? U(v, 1, N) : (v = N);
          } catch (A) {
            U(v || (v = new st()), 2, A);
          }
        })(),
        v
      );
    })(
      d,
      function (f) {
        return a(d[f]);
      },
      o,
    );
  })(
    n,
    function (i) {
      return (
        (a = function () {
          return (function (p, l) {
            try {
              var u = fr(le(r, i), function (c) {
                if (c.type !== "directory") throw new Error(`Path includes a file: ${t}`);
              });
            } catch (c) {
              return l(c);
            }
            return u && u.then ? u.then(void 0, l) : u;
          })(0, function (p) {
            const l = p;
            return (function () {
              if (l.status === 404) return ((s = !0), Ue(Qt(r, i, { ...e, recursive: !1 })));
              throw p;
            })();
          });
        }),
        (o = (function () {
          if (s) return Ue(Qt(r, i, { ...e, recursive: !1 }));
        })()) && o.then
          ? o.then(a)
          : a()
      );
      var a, o;
    },
    function () {
      return !1;
    },
  );
});
function gr(r) {
  return function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    try {
      return Promise.resolve(r.apply(this, t));
    } catch (n) {
      return Promise.reject(n);
    }
  };
}
function ss() {}
function Ue(r, t) {
  return r && r.then ? r.then(ss) : Promise.resolve();
}
const Fe = typeof Symbol < "u" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
function U(r, t, e) {
  if (!r.s) {
    if (e instanceof st) {
      if (!e.s) return void (e.o = U.bind(null, r, t));
      (1 & t && (t = e.s), (e = e.v));
    }
    if (e && e.then) return void e.then(U.bind(null, r, t), U.bind(null, r, 2));
    ((r.s = t), (r.v = e));
    const n = r.o;
    n && n(r);
  }
}
const st = (function () {
  function r() {}
  return (
    (r.prototype.then = function (t, e) {
      const n = new r(),
        s = this.s;
      if (s) {
        const i = 1 & s ? t : e;
        if (i) {
          try {
            U(n, 1, i(this.v));
          } catch (a) {
            U(n, 2, a);
          }
          return n;
        }
        return this;
      }
      return (
        (this.o = function (i) {
          try {
            const a = i.v;
            1 & i.s ? U(n, 1, t ? t(a) : a) : e ? U(n, 1, e(a)) : U(n, 2, a);
          } catch (a) {
            U(n, 2, a);
          }
        }),
        n
      );
    }),
    r
  );
})();
function Ve(r) {
  return r instanceof st && 1 & r.s;
}
const Qt = gr(function (r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  if (e.recursive === !0) return ns(r, t, e);
  const n = I({ url: _(r.remoteURL, ((s = O(t)), s.endsWith("/") ? s : s + "/")), method: "MKCOL" }, r, e);
  var s;
  return fr(j(n, r), function (i) {
    k(r, i);
  });
});
var is = C(388),
  We = C.n(is);
const os = (function (r) {
    return function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      try {
        return Promise.resolve(r.apply(this, t));
      } catch (n) {
        return Promise.reject(n);
      }
    };
  })(function (r, t) {
    let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const n = {};
    if (typeof e.range == "object" && typeof e.range.start == "number") {
      let o = `bytes=${e.range.start}-`;
      (typeof e.range.end == "number" && (o = `${o}${e.range.end}`), (n.Range = o));
    }
    const s = I({ url: _(r.remoteURL, O(t)), method: "GET", headers: n }, r, e);
    return (
      (a = function (o) {
        if ((k(r, o), n.Range && o.status !== 206)) {
          const p = new Error(`Invalid response code for partial request: ${o.status}`);
          throw ((p.status = o.status), p);
        }
        return (
          e.callback &&
            setTimeout(() => {
              e.callback(o);
            }, 0),
          o.body
        );
      }),
      ((i = j(s, r)) && i.then) || (i = Promise.resolve(i)),
      a ? i.then(a) : i
    );
    var i, a;
  }),
  as = () => {},
  us = (function (r) {
    return function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      try {
        return Promise.resolve(r.apply(this, t));
      } catch (n) {
        return Promise.reject(n);
      }
    };
  })(function (r, t, e) {
    e.url || (e.url = _(r.remoteURL, O(t)));
    const n = I(e, r, {});
    return (
      (i = function (a) {
        return (k(r, a), a);
      }),
      ((s = j(n, r)) && s.then) || (s = Promise.resolve(s)),
      i ? s.then(i) : s
    );
    var s, i;
  }),
  ls = (function (r) {
    return function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      try {
        return Promise.resolve(r.apply(this, t));
      } catch (n) {
        return Promise.reject(n);
      }
    };
  })(function (r, t) {
    let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const n = I({ url: _(r.remoteURL, O(t)), method: "DELETE" }, r, e);
    return (
      (i = function (a) {
        k(r, a);
      }),
      ((s = j(n, r)) && s.then) || (s = Promise.resolve(s)),
      i ? s.then(i) : s
    );
    var s, i;
  }),
  hs = (function (r) {
    return function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      try {
        return Promise.resolve(r.apply(this, t));
      } catch (n) {
        return Promise.reject(n);
      }
    };
  })(function (r, t) {
    let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return (function (n, s) {
      try {
        var i =
          ((a = le(r, t, e)),
          (o = function () {
            return !0;
          }),
          p ? (o ? o(a) : a) : ((a && a.then) || (a = Promise.resolve(a)), o ? a.then(o) : a));
      } catch (l) {
        return s(l);
      }
      var a, o, p;
      return i && i.then ? i.then(void 0, s) : i;
    })(0, function (n) {
      if (n.status === 404) return !1;
      throw n;
    });
  });
function zt(r, t, e) {
  return e ? (t ? t(r) : r) : ((r && r.then) || (r = Promise.resolve(r)), t ? r.then(t) : r);
}
const cs = (function (r) {
  return function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    try {
      return Promise.resolve(r.apply(this, t));
    } catch (n) {
      return Promise.reject(n);
    }
  };
})(function (r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  const n = I(
    {
      url: _(r.remoteURL, O(t), "/"),
      method: "PROPFIND",
      headers: { Accept: "text/plain,application/xml", Depth: e.deep ? "infinity" : "1" },
    },
    r,
    e,
  );
  return zt(j(n, r), function (s) {
    return (
      k(r, s),
      zt(s.text(), function (i) {
        if (!i) throw new Error("Failed parsing directory contents: Empty response");
        return zt(It(i, r.parsing), function (a) {
          const o = ve(t);
          let p = (function (l, u, c) {
            let h = arguments.length > 3 && arguments[3] !== void 0 && arguments[3],
              d = arguments.length > 4 && arguments[4] !== void 0 && arguments[4];
            const g = St().join(u, "/"),
              {
                multistatus: { response: f },
              } = l,
              m = f.map((y) => {
                const v = (function (x) {
                    try {
                      return x.replace(/^https?:\/\/[^\/]+/, "");
                    } catch (w) {
                      throw new F(w, "Failed normalising HREF");
                    }
                  })(y.href),
                  {
                    propstat: { prop: b },
                  } = y;
                return ue(
                  b,
                  g === "/"
                    ? decodeURIComponent(bt(v))
                    : bt(St().relative(decodeURIComponent(g), decodeURIComponent(v))),
                  h,
                );
              });
            return d ? m : m.filter((y) => y.basename && (y.type === "file" || y.filename !== c.replace(/\/$/, "")));
          })(a, ve(r.remoteBasePath || r.remotePath), o, e.details, e.includeSelf);
          return (
            e.glob &&
              (p = (function (l, u) {
                return l.filter((c) => R(c.filename, u, { matchBase: !0 }));
              })(p, e.glob)),
            at(s, p, e.details)
          );
        });
      })
    );
  });
});
function he(r) {
  return function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    try {
      return Promise.resolve(r.apply(this, t));
    } catch (n) {
      return Promise.reject(n);
    }
  };
}
const ps = he(function (r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  const n = I(
    { url: _(r.remoteURL, O(t)), method: "GET", headers: { Accept: "text/plain" }, transformResponse: [ds] },
    r,
    e,
  );
  return $t(j(n, r), function (s) {
    return (
      k(r, s),
      $t(s.text(), function (i) {
        return at(s, i, e.details);
      })
    );
  });
});
function $t(r, t, e) {
  return e ? (t ? t(r) : r) : ((r && r.then) || (r = Promise.resolve(r)), t ? r.then(t) : r);
}
const fs = he(function (r, t) {
    let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const n = I({ url: _(r.remoteURL, O(t)), method: "GET" }, r, e);
    return $t(j(n, r), function (s) {
      let i;
      return (
        k(r, s),
        (function (a, o) {
          var p = a();
          return p && p.then ? p.then(o) : o();
        })(
          function () {
            return $t(s.arrayBuffer(), function (a) {
              i = a;
            });
          },
          function () {
            return at(s, i, e.details);
          },
        )
      );
    });
  }),
  gs = he(function (r, t) {
    let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const { format: n = "binary" } = e;
    if (n !== "binary" && n !== "text")
      throw new F({ info: { code: Q.InvalidOutputFormat } }, `Invalid output format: ${n}`);
    return n === "text" ? ps(r, t, e) : fs(r, t, e);
  }),
  ds = (r) => r;
function ms(r, t) {
  let e = "";
  t.format &&
    t.indentBy.length > 0 &&
    (e = `
`);
  const n = [];
  if (t.stopNodes && Array.isArray(t.stopNodes))
    for (let s = 0; s < t.stopNodes.length; s++) {
      const i = t.stopNodes[s];
      typeof i == "string" ? n.push(new ot(i)) : i instanceof ot && n.push(i);
    }
  return dr(r, t, e, new ae(), n);
}
function dr(r, t, e, n, s) {
  let i = "",
    a = !1;
  if (t.maxNestedTags && n.getDepth() > t.maxNestedTags) throw new Error("Maximum nested tags exceeded");
  if (!Array.isArray(r)) {
    if (r != null) {
      let o = r.toString();
      return ((o = te(o, t)), o);
    }
    return "";
  }
  for (let o = 0; o < r.length; o++) {
    const p = r[o],
      l = yr(p);
    if (l === void 0) continue;
    const u = ys(p[":@"], t);
    n.push(l, u);
    const c = bs(n, s);
    if (l === t.textNodeName) {
      let f = p[l];
      (c || ((f = t.tagValueProcessor(l, f)), (f = te(f, t))), a && (i += e), (i += f), (a = !1), n.pop());
      continue;
    }
    if (l === t.cdataPropName) {
      a && (i += e);
      const f = p[l][0][t.textNodeName];
      ((i += `<![CDATA[${String(f).replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`), (a = !1), n.pop());
      continue;
    }
    if (l === t.commentPropName) {
      const f = p[l][0][t.textNodeName];
      ((i += e + `<!--${String(f).replace(/--/g, "- -").replace(/-$/, "- ")}-->`), (a = !0), n.pop());
      continue;
    }
    if (l[0] === "?") {
      const f = Be(p[":@"], t, c),
        m = l === "?xml" ? "" : e;
      let y = p[l][0][t.textNodeName];
      ((y = y.length !== 0 ? " " + y : ""), (i += m + `<${l}${y}${f}?>`), (a = !0), n.pop());
      continue;
    }
    let h = e;
    h !== "" && (h += t.indentBy);
    const d = e + `<${l}${Be(p[":@"], t, c)}`;
    let g;
    ((g = c ? mr(p[l], t) : dr(p[l], t, h, n, s)),
      t.unpairedTags.indexOf(l) !== -1
        ? t.suppressUnpairedNode
          ? (i += d + ">")
          : (i += d + "/>")
        : (g && g.length !== 0) || !t.suppressEmptyNode
          ? g && g.endsWith(">")
            ? (i += d + `>${g}${e}</${l}>`)
            : ((i += d + ">"),
              g && e !== "" && (g.includes("/>") || g.includes("</")) ? (i += e + t.indentBy + g + e) : (i += g),
              (i += `</${l}>`))
          : (i += d + "/>"),
      (a = !0),
      n.pop());
  }
  return i;
}
function ys(r, t) {
  if (!r || t.ignoreAttributes) return null;
  const e = {};
  let n = !1;
  for (let s in r)
    Object.prototype.hasOwnProperty.call(r, s) &&
      ((e[s.startsWith(t.attributeNamePrefix) ? s.substr(t.attributeNamePrefix.length) : s] = r[s]), (n = !0));
  return n ? e : null;
}
function mr(r, t) {
  if (!Array.isArray(r)) return r != null ? r.toString() : "";
  let e = "";
  for (let n = 0; n < r.length; n++) {
    const s = r[n],
      i = yr(s);
    if (i === t.textNodeName) e += s[i];
    else if (i === t.cdataPropName) e += s[i][0][t.textNodeName];
    else if (i === t.commentPropName) e += s[i][0][t.textNodeName];
    else {
      if (i && i[0] === "?") continue;
      if (i) {
        const a = vs(s[":@"], t),
          o = mr(s[i], t);
        o && o.length !== 0 ? (e += `<${i}${a}>${o}</${i}>`) : (e += `<${i}${a}/>`);
      }
    }
  }
  return e;
}
function vs(r, t) {
  let e = "";
  if (r && !t.ignoreAttributes)
    for (let n in r) {
      if (!Object.prototype.hasOwnProperty.call(r, n)) continue;
      let s = r[n];
      s === !0 && t.suppressBooleanAttributes
        ? (e += ` ${n.substr(t.attributeNamePrefix.length)}`)
        : (e += ` ${n.substr(t.attributeNamePrefix.length)}="${s}"`);
    }
  return e;
}
function yr(r) {
  const t = Object.keys(r);
  for (let e = 0; e < t.length; e++) {
    const n = t[e];
    if (Object.prototype.hasOwnProperty.call(r, n) && n !== ":@") return n;
  }
}
function Be(r, t, e) {
  let n = "";
  if (r && !t.ignoreAttributes)
    for (let s in r) {
      if (!Object.prototype.hasOwnProperty.call(r, s)) continue;
      let i;
      (e ? (i = r[s]) : ((i = t.attributeValueProcessor(s, r[s])), (i = te(i, t))),
        i === !0 && t.suppressBooleanAttributes
          ? (n += ` ${s.substr(t.attributeNamePrefix.length)}`)
          : (n += ` ${s.substr(t.attributeNamePrefix.length)}="${i}"`));
    }
  return n;
}
function bs(r, t) {
  if (!t || t.length === 0) return !1;
  for (let e = 0; e < t.length; e++) if (r.matches(t[e])) return !0;
  return !1;
}
function te(r, t) {
  if (r && r.length > 0 && t.processEntities)
    for (let e = 0; e < t.entities.length; e++) {
      const n = t.entities[e];
      r = r.replace(n.regex, n.val);
    }
  return r;
}
const ws = {
  attributeNamePrefix: "@_",
  attributesGroupName: !1,
  textNodeName: "#text",
  ignoreAttributes: !0,
  cdataPropName: !1,
  format: !1,
  indentBy: "  ",
  suppressEmptyNode: !1,
  suppressUnpairedNode: !0,
  suppressBooleanAttributes: !0,
  tagValueProcessor: function (r, t) {
    return t;
  },
  attributeValueProcessor: function (r, t) {
    return t;
  },
  preserveOrder: !1,
  commentPropName: !1,
  unpairedTags: [],
  entities: [
    { regex: new RegExp("&", "g"), val: "&amp;" },
    { regex: new RegExp(">", "g"), val: "&gt;" },
    { regex: new RegExp("<", "g"), val: "&lt;" },
    { regex: new RegExp("'", "g"), val: "&apos;" },
    { regex: new RegExp('"', "g"), val: "&quot;" },
  ],
  processEntities: !0,
  stopNodes: [],
  oneListGroup: !1,
  maxNestedTags: 100,
  jPath: !0,
};
function q(r) {
  if (
    ((this.options = Object.assign({}, ws, r)),
    this.options.stopNodes &&
      Array.isArray(this.options.stopNodes) &&
      (this.options.stopNodes = this.options.stopNodes.map((e) =>
        typeof e == "string" && e.startsWith("*.") ? ".." + e.substring(2) : e,
      )),
    (this.stopNodeExpressions = []),
    this.options.stopNodes && Array.isArray(this.options.stopNodes))
  )
    for (let e = 0; e < this.options.stopNodes.length; e++) {
      const n = this.options.stopNodes[e];
      typeof n == "string"
        ? this.stopNodeExpressions.push(new ot(n))
        : n instanceof ot && this.stopNodeExpressions.push(n);
    }
  var t;
  (this.options.ignoreAttributes === !0 || this.options.attributesGroupName
    ? (this.isAttribute = function () {
        return !1;
      })
    : ((this.ignoreAttributesFn =
        typeof (t = this.options.ignoreAttributes) == "function"
          ? t
          : Array.isArray(t)
            ? (e) => {
                for (const n of t)
                  if ((typeof n == "string" && e === n) || (n instanceof RegExp && n.test(e))) return !0;
              }
            : () => !1),
      (this.attrPrefixLen = this.options.attributeNamePrefix.length),
      (this.isAttribute = Es)),
    (this.processTextOrObjNode = xs),
    this.options.format
      ? ((this.indentate = Ns),
        (this.tagEndChar = `>
`),
        (this.newLine = `
`))
      : ((this.indentate = function () {
          return "";
        }),
        (this.tagEndChar = ">"),
        (this.newLine = "")));
}
function xs(r, t, e, n) {
  const s = this.extractAttributes(r);
  if ((n.push(t, s), this.checkStopNode(n))) {
    const a = this.buildRawContent(r),
      o = this.buildAttributesForStopNode(r);
    return (n.pop(), this.buildObjectNode(a, t, o, e));
  }
  const i = this.j2x(r, e + 1, n);
  return (
    n.pop(),
    r[this.options.textNodeName] !== void 0 && Object.keys(r).length === 1
      ? this.buildTextValNode(r[this.options.textNodeName], t, i.attrStr, e, n)
      : this.buildObjectNode(i.val, t, i.attrStr, e)
  );
}
function Ns(r) {
  return this.options.indentBy.repeat(r);
}
function Es(r) {
  return (
    !(!r.startsWith(this.options.attributeNamePrefix) || r === this.options.textNodeName) &&
    r.substr(this.attrPrefixLen)
  );
}
((q.prototype.build = function (r) {
  if (this.options.preserveOrder) return ms(r, this.options);
  {
    Array.isArray(r) &&
      this.options.arrayNodeName &&
      this.options.arrayNodeName.length > 1 &&
      (r = { [this.options.arrayNodeName]: r });
    const t = new ae();
    return this.j2x(r, 0, t).val;
  }
}),
  (q.prototype.j2x = function (r, t, e) {
    let n = "",
      s = "";
    if (this.options.maxNestedTags && e.getDepth() >= this.options.maxNestedTags)
      throw new Error("Maximum nested tags exceeded");
    const i = this.options.jPath ? e.toString() : e,
      a = this.checkStopNode(e);
    for (let o in r)
      if (Object.prototype.hasOwnProperty.call(r, o))
        if (r[o] === void 0) this.isAttribute(o) && (s += "");
        else if (r[o] === null)
          this.isAttribute(o) || o === this.options.cdataPropName
            ? (s += "")
            : o[0] === "?"
              ? (s += this.indentate(t) + "<" + o + "?" + this.tagEndChar)
              : (s += this.indentate(t) + "<" + o + "/" + this.tagEndChar);
        else if (r[o] instanceof Date) s += this.buildTextValNode(r[o], o, "", t, e);
        else if (typeof r[o] != "object") {
          const p = this.isAttribute(o);
          if (p && !this.ignoreAttributesFn(p, i)) n += this.buildAttrPairStr(p, "" + r[o], a);
          else if (!p)
            if (o === this.options.textNodeName) {
              let l = this.options.tagValueProcessor(o, "" + r[o]);
              s += this.replaceEntitiesValue(l);
            } else {
              e.push(o);
              const l = this.checkStopNode(e);
              if ((e.pop(), l)) {
                const u = "" + r[o];
                s +=
                  u === ""
                    ? this.indentate(t) + "<" + o + this.closeTag(o) + this.tagEndChar
                    : this.indentate(t) + "<" + o + ">" + u + "</" + o + this.tagEndChar;
              } else s += this.buildTextValNode(r[o], o, "", t, e);
            }
        } else if (Array.isArray(r[o])) {
          const p = r[o].length;
          let l = "",
            u = "";
          for (let c = 0; c < p; c++) {
            const h = r[o][c];
            if (h !== void 0)
              if (h === null)
                o[0] === "?"
                  ? (s += this.indentate(t) + "<" + o + "?" + this.tagEndChar)
                  : (s += this.indentate(t) + "<" + o + "/" + this.tagEndChar);
              else if (typeof h == "object")
                if (this.options.oneListGroup) {
                  e.push(o);
                  const d = this.j2x(h, t + 1, e);
                  (e.pop(),
                    (l += d.val),
                    this.options.attributesGroupName &&
                      h.hasOwnProperty(this.options.attributesGroupName) &&
                      (u += d.attrStr));
                } else l += this.processTextOrObjNode(h, o, t, e);
              else if (this.options.oneListGroup) {
                let d = this.options.tagValueProcessor(o, h);
                ((d = this.replaceEntitiesValue(d)), (l += d));
              } else {
                e.push(o);
                const d = this.checkStopNode(e);
                if ((e.pop(), d)) {
                  const g = "" + h;
                  l +=
                    g === ""
                      ? this.indentate(t) + "<" + o + this.closeTag(o) + this.tagEndChar
                      : this.indentate(t) + "<" + o + ">" + g + "</" + o + this.tagEndChar;
                } else l += this.buildTextValNode(h, o, "", t, e);
              }
          }
          (this.options.oneListGroup && (l = this.buildObjectNode(l, o, u, t)), (s += l));
        } else if (this.options.attributesGroupName && o === this.options.attributesGroupName) {
          const p = Object.keys(r[o]),
            l = p.length;
          for (let u = 0; u < l; u++) n += this.buildAttrPairStr(p[u], "" + r[o][p[u]], a);
        } else s += this.processTextOrObjNode(r[o], o, t, e);
    return { attrStr: n, val: s };
  }),
  (q.prototype.buildAttrPairStr = function (r, t, e) {
    return (
      e || ((t = this.options.attributeValueProcessor(r, "" + t)), (t = this.replaceEntitiesValue(t))),
      this.options.suppressBooleanAttributes && t === "true" ? " " + r : " " + r + '="' + t + '"'
    );
  }),
  (q.prototype.extractAttributes = function (r) {
    if (!r || typeof r != "object") return null;
    const t = {};
    let e = !1;
    if (this.options.attributesGroupName && r[this.options.attributesGroupName]) {
      const n = r[this.options.attributesGroupName];
      for (let s in n)
        Object.prototype.hasOwnProperty.call(n, s) &&
          ((t[
            s.startsWith(this.options.attributeNamePrefix) ? s.substring(this.options.attributeNamePrefix.length) : s
          ] = n[s]),
          (e = !0));
    } else
      for (let n in r) {
        if (!Object.prototype.hasOwnProperty.call(r, n)) continue;
        const s = this.isAttribute(n);
        s && ((t[s] = r[n]), (e = !0));
      }
    return e ? t : null;
  }),
  (q.prototype.buildRawContent = function (r) {
    if (typeof r == "string") return r;
    if (typeof r != "object" || r === null) return String(r);
    if (r[this.options.textNodeName] !== void 0) return r[this.options.textNodeName];
    let t = "";
    for (let e in r) {
      if (
        !Object.prototype.hasOwnProperty.call(r, e) ||
        this.isAttribute(e) ||
        (this.options.attributesGroupName && e === this.options.attributesGroupName)
      )
        continue;
      const n = r[e];
      if (e === this.options.textNodeName) t += n;
      else if (Array.isArray(n)) {
        for (let s of n)
          if (typeof s == "string" || typeof s == "number") t += `<${e}>${s}</${e}>`;
          else if (typeof s == "object" && s !== null) {
            const i = this.buildRawContent(s),
              a = this.buildAttributesForStopNode(s);
            t += i === "" ? `<${e}${a}/>` : `<${e}${a}>${i}</${e}>`;
          }
      } else if (typeof n == "object" && n !== null) {
        const s = this.buildRawContent(n),
          i = this.buildAttributesForStopNode(n);
        t += s === "" ? `<${e}${i}/>` : `<${e}${i}>${s}</${e}>`;
      } else t += `<${e}>${n}</${e}>`;
    }
    return t;
  }),
  (q.prototype.buildAttributesForStopNode = function (r) {
    if (!r || typeof r != "object") return "";
    let t = "";
    if (this.options.attributesGroupName && r[this.options.attributesGroupName]) {
      const e = r[this.options.attributesGroupName];
      for (let n in e) {
        if (!Object.prototype.hasOwnProperty.call(e, n)) continue;
        const s = n.startsWith(this.options.attributeNamePrefix)
            ? n.substring(this.options.attributeNamePrefix.length)
            : n,
          i = e[n];
        i === !0 && this.options.suppressBooleanAttributes ? (t += " " + s) : (t += " " + s + '="' + i + '"');
      }
    } else
      for (let e in r) {
        if (!Object.prototype.hasOwnProperty.call(r, e)) continue;
        const n = this.isAttribute(e);
        if (n) {
          const s = r[e];
          s === !0 && this.options.suppressBooleanAttributes ? (t += " " + n) : (t += " " + n + '="' + s + '"');
        }
      }
    return t;
  }),
  (q.prototype.buildObjectNode = function (r, t, e, n) {
    if (r === "")
      return t[0] === "?"
        ? this.indentate(n) + "<" + t + e + "?" + this.tagEndChar
        : this.indentate(n) + "<" + t + e + this.closeTag(t) + this.tagEndChar;
    {
      let s = "</" + t + this.tagEndChar,
        i = "";
      return (
        t[0] === "?" && ((i = "?"), (s = "")),
        (!e && e !== "") || r.indexOf("<") !== -1
          ? this.options.commentPropName !== !1 && t === this.options.commentPropName && i.length === 0
            ? this.indentate(n) + `<!--${r}-->` + this.newLine
            : this.indentate(n) + "<" + t + e + i + this.tagEndChar + r + this.indentate(n) + s
          : this.indentate(n) + "<" + t + e + i + ">" + r + s
      );
    }
  }),
  (q.prototype.closeTag = function (r) {
    let t = "";
    return (
      this.options.unpairedTags.indexOf(r) !== -1
        ? this.options.suppressUnpairedNode || (t = "/")
        : (t = this.options.suppressEmptyNode ? "/" : `></${r}`),
      t
    );
  }),
  (q.prototype.checkStopNode = function (r) {
    if (!this.stopNodeExpressions || this.stopNodeExpressions.length === 0) return !1;
    for (let t = 0; t < this.stopNodeExpressions.length; t++) if (r.matches(this.stopNodeExpressions[t])) return !0;
    return !1;
  }),
  (q.prototype.buildTextValNode = function (r, t, e, n, s) {
    if (this.options.cdataPropName !== !1 && t === this.options.cdataPropName) {
      const i = String(r).replace(/\]\]>/g, "]]]]><![CDATA[>");
      return this.indentate(n) + `<![CDATA[${i}]]>` + this.newLine;
    }
    if (this.options.commentPropName !== !1 && t === this.options.commentPropName) {
      const i = String(r).replace(/--/g, "- -").replace(/-$/, "- ");
      return this.indentate(n) + `<!--${i}-->` + this.newLine;
    }
    if (t[0] === "?") return this.indentate(n) + "<" + t + e + "?" + this.tagEndChar;
    {
      let i = this.options.tagValueProcessor(t, r);
      return (
        (i = this.replaceEntitiesValue(i)),
        i === ""
          ? this.indentate(n) + "<" + t + e + this.closeTag(t) + this.tagEndChar
          : this.indentate(n) + "<" + t + e + ">" + i + "</" + t + this.tagEndChar
      );
    }
  }),
  (q.prototype.replaceEntitiesValue = function (r) {
    if (r && r.length > 0 && this.options.processEntities)
      for (let t = 0; t < this.options.entities.length; t++) {
        const e = this.options.entities[t];
        r = r.replace(e.regex, e.val);
      }
    return r;
  }));
const As = q;
function Ps(r) {
  return new As({ attributeNamePrefix: "@_", format: !0, ignoreAttributes: !1, suppressEmptyNode: !0 }).build(
    vr(
      { lockinfo: { "@_xmlns:d": "DAV:", lockscope: { exclusive: {} }, locktype: { write: {} }, owner: { href: r } } },
      "d",
    ),
  );
}
function vr(r, t) {
  const e = { ...r };
  for (const n in e)
    e.hasOwnProperty(n) &&
      (e[n] && typeof e[n] == "object" && n.indexOf(":") === -1
        ? ((e[`${t}:${n}`] = vr(e[n], t)), delete e[n])
        : /^@_/.test(n) === !1 && ((e[`${t}:${n}`] = e[n]), delete e[n]));
  return e;
}
function ee(r, t, e) {
  return e ? (t ? t(r) : r) : ((r && r.then) || (r = Promise.resolve(r)), t ? r.then(t) : r);
}
function br(r) {
  return function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    try {
      return Promise.resolve(r.apply(this, t));
    } catch (n) {
      return Promise.reject(n);
    }
  };
}
const Ss = br(function (r, t, e) {
    let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const s = I({ url: _(r.remoteURL, O(t)), method: "UNLOCK", headers: { "Lock-Token": e } }, r, n);
    return ee(j(s, r), function (i) {
      if ((k(r, i), i.status !== 204 && i.status !== 200)) throw ie(i);
    });
  }),
  Ts = br(function (r, t) {
    let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const { refreshToken: n, timeout: s = Cs } = e,
      i = { Accept: "text/plain,application/xml", Timeout: s };
    n && (i.If = n);
    const a = I({ url: _(r.remoteURL, O(t)), method: "LOCK", headers: i, data: Ps(r.contactHref) }, r, e);
    return ee(j(a, r), function (o) {
      return (
        k(r, o),
        ee(o.text(), function (p) {
          const l = ((h = p), new cr({ removeNSPrefix: !0, parseAttributeValue: !0, parseTagValue: !0 }).parse(h)),
            u = Z().get(l, "prop.lockdiscovery.activelock.locktoken.href"),
            c = Z().get(l, "prop.lockdiscovery.activelock.timeout");
          var h;
          if (!u) throw ie(o, "No lock token received: ");
          return { token: u, serverTimeout: c };
        })
      );
    });
  }),
  Cs = "Infinite, Second-4100000000";
function Gt(r, t, e) {
  return e ? (t ? t(r) : r) : ((r && r.then) || (r = Promise.resolve(r)), t ? r.then(t) : r);
}
const Os = (function (r) {
  return function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    try {
      return Promise.resolve(r.apply(this, t));
    } catch (n) {
      return Promise.reject(n);
    }
  };
})(function (r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const e = t.path || "/",
    n = I(
      { url: _(r.remoteURL, e), method: "PROPFIND", headers: { Accept: "text/plain,application/xml", Depth: "0" } },
      r,
      t,
    );
  return Gt(j(n, r), function (s) {
    return (
      k(r, s),
      Gt(s.text(), function (i) {
        return Gt(It(i, r.parsing), function (a) {
          const o = (function (p) {
            try {
              const [l] = p.multistatus.response,
                {
                  propstat: {
                    prop: { "quota-used-bytes": u, "quota-available-bytes": c },
                  },
                } = l;
              return u !== void 0 && c !== void 0 ? { used: parseInt(String(u), 10), available: rs(c) } : null;
            } catch {}
            return null;
          })(a);
          return at(s, o, t.details);
        });
      })
    );
  });
});
function qt(r, t, e) {
  return e ? (t ? t(r) : r) : ((r && r.then) || (r = Promise.resolve(r)), t ? r.then(t) : r);
}
const _s = (function (r) {
    return function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      try {
        return Promise.resolve(r.apply(this, t));
      } catch (n) {
        return Promise.reject(n);
      }
    };
  })(function (r, t) {
    let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const { details: n = !1 } = e,
      s = I(
        {
          url: _(r.remoteURL, O(t)),
          method: "SEARCH",
          headers: {
            Accept: "text/plain,application/xml",
            "Content-Type": r.headers["Content-Type"] || "application/xml; charset=utf-8",
          },
        },
        r,
        e,
      );
    return qt(j(s, r), function (i) {
      return (
        k(r, i),
        qt(i.text(), function (a) {
          return qt(It(a, r.parsing), function (o) {
            const p = (function (l, u, c) {
              const h = { truncated: !1, results: [] };
              return (
                (h.truncated = l.multistatus.response.some(
                  (d) =>
                    (d.status || d.propstat?.status).split(" ", 3)?.[1] === "507" &&
                    d.href.replace(/\/$/, "").endsWith(O(u).replace(/\/$/, "")),
                )),
                l.multistatus.response.forEach((d) => {
                  if (d.propstat === void 0) return;
                  const g = d.href.split("/").map(decodeURIComponent).join("/");
                  h.results.push(ue(d.propstat.prop, g, c));
                }),
                h
              );
            })(o, t, n);
            return at(i, p, n);
          });
        })
      );
    });
  }),
  $s = (function (r) {
    return function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      try {
        return Promise.resolve(r.apply(this, t));
      } catch (n) {
        return Promise.reject(n);
      }
    };
  })(function (r, t, e) {
    let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const s = I(
      {
        url: _(r.remoteURL, O(t)),
        method: "MOVE",
        headers: { Destination: _(r.remoteURL, O(e)), Overwrite: n.overwrite === !1 ? "F" : "T" },
      },
      r,
      n,
    );
    return (
      (a = function (o) {
        k(r, o);
      }),
      ((i = j(s, r)) && i.then) || (i = Promise.resolve(i)),
      a ? i.then(a) : i
    );
    var i, a;
  });
var js = C(172);
function Is(r) {
  if (Ze(r)) return r.byteLength;
  if (Xe(r)) return r.length;
  if (typeof r == "string") return (0, js.d)(r);
  throw new F({ info: { code: Q.DataTypeNoLength } }, "Cannot calculate data length: Invalid type");
}
const ks = (function (r) {
    return function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      try {
        return Promise.resolve(r.apply(this, t));
      } catch (n) {
        return Promise.reject(n);
      }
    };
  })(function (r, t, e) {
    let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const { contentLength: s = !0, overwrite: i = !0 } = n,
      a = { "Content-Type": "application/octet-stream" };
    (s === !1 || (a["Content-Length"] = typeof s == "number" ? `${s}` : `${Is(e)}`), i || (a["If-None-Match"] = "*"));
    const o = I({ url: _(r.remoteURL, O(t)), method: "PUT", headers: a, data: e }, r, n);
    return (
      (l = function (u) {
        try {
          k(r, u);
        } catch (c) {
          const h = c;
          if (h.status !== 412 || i) throw h;
          return !1;
        }
        return !0;
      }),
      ((p = j(o, r)) && p.then) || (p = Promise.resolve(p)),
      l ? p.then(l) : p
    );
    var p, l;
  }),
  wr = (function (r) {
    return function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      try {
        return Promise.resolve(r.apply(this, t));
      } catch (n) {
        return Promise.reject(n);
      }
    };
  })(function (r, t) {
    let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const n = I({ url: _(r.remoteURL, O(t)), method: "OPTIONS" }, r, e);
    return (
      (i = function (a) {
        try {
          k(r, a);
        } catch (o) {
          throw o;
        }
        return {
          compliance: (a.headers.get("DAV") ?? "").split(",").map((o) => o.trim()),
          server: a.headers.get("Server") ?? "",
        };
      }),
      ((s = j(n, r)) && s.then) || (s = Promise.resolve(s)),
      i ? s.then(i) : s
    );
    var s, i;
  });
function vt(r, t, e) {
  return e ? (t ? t(r) : r) : ((r && r.then) || (r = Promise.resolve(r)), t ? r.then(t) : r);
}
const Ls = ce(function (r, t, e, n, s) {
  let i = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
  if (e > n || e < 0)
    throw new F({ info: { code: Q.InvalidUpdateRange } }, `Invalid update range ${e} for partial update`);
  const a = {
      "Content-Type": "application/octet-stream",
      "Content-Length": "" + (n - e + 1),
      "Content-Range": `bytes ${e}-${n}/*`,
    },
    o = I({ url: _(r.remoteURL, O(t)), method: "PUT", headers: a, data: s }, r, i);
  return vt(j(o, r), function (p) {
    k(r, p);
  });
});
function ze(r, t) {
  var e = r();
  return e && e.then ? e.then(t) : t(e);
}
const Rs = ce(function (r, t, e, n, s) {
  let i = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
  if (e > n || e < 0)
    throw new F({ info: { code: Q.InvalidUpdateRange } }, `Invalid update range ${e} for partial update`);
  const a = {
      "Content-Type": "application/x-sabredav-partialupdate",
      "Content-Length": "" + (n - e + 1),
      "X-Update-Range": `bytes=${e}-${n}`,
    },
    o = I({ url: _(r.remoteURL, O(t)), method: "PATCH", headers: a, data: s }, r, i);
  return vt(j(o, r), function (p) {
    k(r, p);
  });
});
function ce(r) {
  return function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    try {
      return Promise.resolve(r.apply(this, t));
    } catch (n) {
      return Promise.reject(n);
    }
  };
}
const Ms = ce(function (r, t, e, n, s) {
    let i = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
    return vt(wr(r, t, i), function (a) {
      let o = !1;
      return ze(
        function () {
          if (a.compliance.includes("sabredav-partialupdate"))
            return vt(Rs(r, t, e, n, s, i), function (p) {
              return ((o = !0), p);
            });
        },
        function (p) {
          let l = !1;
          return o
            ? p
            : ze(
                function () {
                  if (a.server.includes("Apache") && a.compliance.includes("<http://apache.org/dav/propset/fs/1>"))
                    return vt(Ls(r, t, e, n, s, i), function (u) {
                      return ((l = !0), u);
                    });
                },
                function (u) {
                  if (l) return u;
                  throw new F({ info: { code: Q.NotSupported } }, "Not supported");
                },
              );
        },
      );
    });
  }),
  Ds = "https://github.com/perry-mitchell/webdav-client/blob/master/LOCK_CONTACT.md";
function Us(r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    authType: e = null,
    remoteBasePath: n,
    contactHref: s = Ds,
    entityDecoder: i,
    ha1: a,
    headers: o = {},
    httpAgent: p,
    httpsAgent: l,
    password: u,
    token: c,
    username: h,
    withCredentials: d,
  } = t;
  let g = e;
  g || (g = h || u ? D.Password : D.None);
  const f = {
    authType: g,
    remoteBasePath: n,
    contactHref: s,
    ha1: a,
    headers: Object.assign({}, o),
    httpAgent: p,
    httpsAgent: l,
    password: u,
    parsing: {
      attributeNamePrefix: t.attributeNamePrefix ?? "@",
      attributeParsers: [],
      entityDecoder: i,
      tagParsers: [pr],
    },
    remotePath: Cr(r),
    remoteURL: r,
    token: c,
    username: h,
    withCredentials: d,
  };
  return (
    He(f, h, u, c, a),
    {
      copyFile: (m, y, v) => gn(f, m, y, v),
      createDirectory: (m, y) => Qt(f, m, y),
      createReadStream: (m, y) =>
        (function (v, b) {
          let x = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          const w = new (We().PassThrough)();
          return (
            os(v, b, x)
              .then((N) => {
                N.pipe(w);
              })
              .catch((N) => {
                w.emit("error", N);
              }),
            w
          );
        })(f, m, y),
      createWriteStream: (m, y, v) =>
        (function (b, x) {
          let w = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
            N = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : as;
          const A = new (We().PassThrough)(),
            P = {};
          w.overwrite === !1 && (P["If-None-Match"] = "*");
          const T = I({ url: _(b.remoteURL, O(x)), method: "PUT", headers: P, data: A, maxRedirects: 0 }, b, w);
          return (
            j(T, b)
              .then((S) => k(b, S))
              .then((S) => {
                setTimeout(() => {
                  N(S);
                }, 0);
              })
              .catch((S) => {
                A.emit("error", S);
              }),
            A
          );
        })(f, m, y, v),
      customRequest: (m, y) => us(f, m, y),
      deleteFile: (m, y) => ls(f, m, y),
      exists: (m, y) => hs(f, m, y),
      getDirectoryContents: (m, y) => cs(f, m, y),
      getFileContents: (m, y) => gs(f, m, y),
      getFileDownloadLink: (m) =>
        (function (y, v) {
          let b = _(y.remoteURL, O(v));
          const x = /^https:/i.test(b) ? "https" : "http";
          switch (y.authType) {
            case D.None:
              break;
            case D.Password: {
              const w = we(y.headers.Authorization.replace(/^Basic /i, "").trim());
              b = b.replace(/^https?:\/\//, `${x}://${w}@`);
              break;
            }
            default:
              throw new F(
                { info: { code: Q.LinkUnsupportedAuthType } },
                `Unsupported auth type for file link: ${y.authType}`,
              );
          }
          return b;
        })(f, m),
      getFileUploadLink: (m) =>
        (function (y, v) {
          let b = `${_(y.remoteURL, O(v))}?Content-Type=application/octet-stream`;
          const x = /^https:/i.test(b) ? "https" : "http";
          switch (y.authType) {
            case D.None:
              break;
            case D.Password: {
              const w = we(y.headers.Authorization.replace(/^Basic /i, "").trim());
              b = b.replace(/^https?:\/\//, `${x}://${w}@`);
              break;
            }
            default:
              throw new F(
                { info: { code: Q.LinkUnsupportedAuthType } },
                `Unsupported auth type for file link: ${y.authType}`,
              );
          }
          return b;
        })(f, m),
      getHeaders: () => Object.assign({}, f.headers),
      getQuota: (m) => Os(f, m),
      lock: (m, y) => Ts(f, m, y),
      moveFile: (m, y, v) => $s(f, m, y, v),
      putFileContents: (m, y, v) => ks(f, m, y, v),
      partialUpdateFileContents: (m, y, v, b, x) => Ms(f, m, y, v, b, x),
      getDAVCompliance: (m) => wr(f, m),
      search: (m, y) => _s(f, m, y),
      setHeaders: (m) => {
        f.headers = Object.assign({}, m);
      },
      stat: (m, y) => le(f, m, y),
      unlock: (m, y, v) => Ss(f, m, y, v),
      registerAttributeParser: (m) => {
        f.parsing.attributeParsers.push(m);
      },
      registerTagParser: (m) => {
        f.parsing.tagParsers.push(m);
      },
    }
  );
}
const Zs = {
    name: "WebDAV",
    type: "WebDAV",
    config: { address: "http://127.0.0.1/webdav", loginName: "", loginPwd: "", digest: !1 },
  },
  Xs = {
    description: "WebDAV 是一种基于 HTTP 协议的文件传输协议，支持文件存储和共享功能。",
    requiredField: [
      { name: "地址", key: "address", type: "string" },
      { name: "用户名", key: "loginName", type: "string" },
      { name: "密码", key: "loginPwd", type: "string" },
      { name: "Digest", key: "digest", type: "boolean" },
    ],
  };
class Js extends Nr {
  version = "1.0.0";
  server;
  getServer() {
    return (
      this.server ||
        (this.server = Us(this.userConfig.address, {
          username: this.userConfig.loginName,
          password: this.userConfig.loginPwd,
          authType: this.userConfig.digest ? D.Digest : void 0,
        })),
      this.server
    );
  }
  async ping() {
    try {
      return (await this.getServer().getDirectoryContents("/"), !0);
    } catch {}
    return !1;
  }
  async list(t = {}) {
    const e = [];
    return (
      (await this.getServer().getDirectoryContents("/", { glob: "*.zip" })).forEach((s) => {
        e.push({ filename: s.basename, path: s.filename, size: s.size, time: +new Date(s.lastmod) });
      }),
      Er(e, t)
    );
  }
  async addFile(t, e) {
    const s = await (await this.backupDataToJSZipBlob(e)).arrayBuffer();
    return await this.getServer().putFileContents(t, s);
  }
  async getFile(t) {
    const e = await this.getServer().getFileContents(ge("/", t)),
      n = new Blob([e]);
    return await this.jsZipBlobToBackupData(n);
  }
  async deleteFile(t) {
    return (await this.getServer().deleteFile(ge("/", t)), !0);
  }
}
export { Js as default, Zs as serverConfig, Xs as serverMetaData };
