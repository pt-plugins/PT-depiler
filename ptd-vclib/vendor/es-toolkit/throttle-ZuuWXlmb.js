function g(u, o, { signal: s, edges: e } = {}) {
  let l,
    n = null;
  const c = e != null && e.includes("leading"),
    i = e == null || e.includes("trailing"),
    d = () => {
      n !== null && (u.apply(l, n), (l = void 0), (n = null));
    },
    h = () => {
      (i && d(), r());
    };
  let t = null;
  const f = () => {
      (t != null && clearTimeout(t),
        (t = setTimeout(() => {
          ((t = null), h());
        }, o)));
    },
    p = () => {
      t !== null && (clearTimeout(t), (t = null));
    },
    r = () => {
      (p(), (l = void 0), (n = null));
    },
    m = () => {
      d();
    },
    a = function (...T) {
      if (s?.aborted) return;
      ((l = this), (n = T));
      const b = t == null;
      (f(), c && b && d());
    };
  return ((a.schedule = f), (a.cancel = r), (a.flush = m), s?.addEventListener("abort", r, { once: !0 }), a);
}
function v(u, o, { signal: s, edges: e = ["leading", "trailing"] } = {}) {
  let l = null;
  const n = g(
      function (...i) {
        ((l = Date.now()), u.apply(this, i));
      },
      o,
      { signal: s, edges: e },
    ),
    c = function (...i) {
      if ((l == null && (l = Date.now()), Date.now() - l >= o)) {
        ((l = Date.now()), u.apply(this, i), n.cancel(), n.schedule());
        return;
      }
      n.apply(this, i);
    };
  return ((c.cancel = n.cancel), (c.flush = n.flush), c);
}
export { g as d, v as t };
