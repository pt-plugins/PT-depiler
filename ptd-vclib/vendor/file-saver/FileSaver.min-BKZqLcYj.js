import { z as u } from "../packages/site/index-COeZNva1.js";
var f = { exports: {} },
  j = f.exports,
  E;
function x() {
  return (
    E ||
      ((E = 1),
      (function (R, L) {
        (function (v, i) {
          i();
        })(j, function () {
          function v(e, t) {
            return (
              typeof t > "u"
                ? (t = { autoBom: !1 })
                : typeof t != "object" &&
                  (console.warn("Deprecated: Expected third argument to be a object"), (t = { autoBom: !t })),
              t.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)
                ? new Blob(["\uFEFF", e], { type: e.type })
                : e
            );
          }
          function i(e, t, r) {
            var n = new XMLHttpRequest();
            (n.open("GET", e),
              (n.responseType = "blob"),
              (n.onload = function () {
                l(n.response, t, r);
              }),
              (n.onerror = function () {
                console.error("could not download file");
              }),
              n.send());
          }
          function m(e) {
            var t = new XMLHttpRequest();
            t.open("HEAD", e, !1);
            try {
              t.send();
            } catch {}
            return 200 <= t.status && 299 >= t.status;
          }
          function c(e) {
            try {
              e.dispatchEvent(new MouseEvent("click"));
            } catch {
              var t = document.createEvent("MouseEvents");
              (t.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), e.dispatchEvent(t));
            }
          }
          var a =
              typeof window == "object" && window.window === window
                ? window
                : typeof self == "object" && self.self === self
                  ? self
                  : typeof u == "object" && u.global === u
                    ? u
                    : void 0,
            w =
              a.navigator &&
              /Macintosh/.test(navigator.userAgent) &&
              /AppleWebKit/.test(navigator.userAgent) &&
              !/Safari/.test(navigator.userAgent),
            l =
              a.saveAs ||
              (typeof window != "object" || window !== a
                ? function () {}
                : "download" in HTMLAnchorElement.prototype && !w
                  ? function (e, t, r) {
                      var n = a.URL || a.webkitURL,
                        o = document.createElement("a");
                      ((t = t || e.name || "download"),
                        (o.download = t),
                        (o.rel = "noopener"),
                        typeof e == "string"
                          ? ((o.href = e),
                            o.origin === location.origin ? c(o) : m(o.href) ? i(e, t, r) : c(o, (o.target = "_blank")))
                          : ((o.href = n.createObjectURL(e)),
                            setTimeout(function () {
                              n.revokeObjectURL(o.href);
                            }, 4e4),
                            setTimeout(function () {
                              c(o);
                            }, 0)));
                    }
                  : "msSaveOrOpenBlob" in navigator
                    ? function (e, t, r) {
                        if (((t = t || e.name || "download"), typeof e != "string"))
                          navigator.msSaveOrOpenBlob(v(e, r), t);
                        else if (m(e)) i(e, t, r);
                        else {
                          var n = document.createElement("a");
                          ((n.href = e),
                            (n.target = "_blank"),
                            setTimeout(function () {
                              c(n);
                            }));
                        }
                      }
                    : function (e, t, r, n) {
                        if (
                          ((n = n || open("", "_blank")),
                          n && (n.document.title = n.document.body.innerText = "downloading..."),
                          typeof e == "string")
                        )
                          return i(e, t, r);
                        var o = e.type === "application/octet-stream",
                          b = /constructor/i.test(a.HTMLElement) || a.safari,
                          y = /CriOS\/[\d]+/.test(navigator.userAgent);
                        if ((y || (o && b) || w) && typeof FileReader < "u") {
                          var d = new FileReader();
                          ((d.onloadend = function () {
                            var s = d.result;
                            ((s = y ? s : s.replace(/^data:[^;]*;/, "data:attachment/file;")),
                              n ? (n.location.href = s) : (location = s),
                              (n = null));
                          }),
                            d.readAsDataURL(e));
                        } else {
                          var h = a.URL || a.webkitURL,
                            p = h.createObjectURL(e);
                          (n ? (n.location = p) : (location.href = p),
                            (n = null),
                            setTimeout(function () {
                              h.revokeObjectURL(p);
                            }, 4e4));
                        }
                      });
          ((a.saveAs = l.saveAs = l), (R.exports = l));
        });
      })(f)),
    f.exports
  );
}
var A = x();
export { A as F };
