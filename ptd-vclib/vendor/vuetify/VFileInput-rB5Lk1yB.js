import {
  bp as L,
  ax as ye,
  bS as he,
  bX as ge,
  bH as be,
  bY as Fe,
  au as ke,
  z as N,
  w as j,
  av as we,
  bb as Ce,
  cg as O,
  bm as De,
  bc as Ie,
  q as Se,
  l as Ve,
  ab as Ae,
  aE as M,
} from "../../assets/src/entries/options/index-DmNe5UVo.js";
import {
  D as p,
  ch as Be,
  U as g,
  b0 as D,
  br as I,
  bJ as Pe,
  H as m,
  F as S,
  b3 as Re,
  bY as Te,
  b2 as ze,
} from "../packages/site/index-COeZNva1.js";
function $e() {
  function e(i) {
    return (
      [...(i.dataTransfer?.items ?? [])]
        .filter((l) => l.kind === "file")
        .map((l) => l.webkitGetAsEntry())
        .filter(Boolean).length > 0 || [...(i.dataTransfer?.files ?? [])].length > 0
    );
  }
  async function a(i) {
    const o = [],
      l = [...(i.dataTransfer?.items ?? [])]
        .filter((n) => n.kind === "file")
        .map((n) => n.webkitGetAsEntry())
        .filter(Boolean);
    if (l.length)
      for (const n of l) {
        const c = await G(n, H(".", n));
        o.push(...c.map((r) => r.file));
      }
    else o.push(...(i.dataTransfer?.files ?? []));
    return o;
  }
  return { handleDrop: a, hasFilesOrFolders: e };
}
function G(e) {
  let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  return new Promise((i, o) => {
    e.isFile
      ? e.file((n) => i([{ file: n, path: a }]), o)
      : e.isDirectory &&
        e.createReader().readEntries(async (n) => {
          const c = [];
          for (const r of n) c.push(...(await G(r, H(a, r))));
          i(c);
        });
  });
}
function H(e, a) {
  return a.isDirectory ? `${e}/${a.name}` : e;
}
const Ee = L({ filterByType: String }, "file-accept");
function xe(e) {
  const a = p(() => (e.filterByType ? Ne(e.filterByType) : null));
  function i(o) {
    if (a.value) {
      const l = o.filter(a.value);
      return { accepted: l, rejected: o.filter((n) => !l.includes(n)) };
    }
    return { accepted: o, rejected: [] };
  }
  return { filterAccepted: i };
}
function Ne(e) {
  const a = e.split(",").map((n) => n.trim().toLowerCase()),
    i = a.filter((n) => n.startsWith(".")),
    o = a.filter((n) => n.endsWith("/*")),
    l = a.filter((n) => !i.includes(n) && !o.includes(n));
  return (n) => {
    const c = n.name.split(".").at(-1)?.toLowerCase() ?? "",
      r = n.type.split("/").at(0)?.toLowerCase() ?? "";
    return l.includes(n.type) || i.includes(`.${c}`) || o.includes(`${r}/*`);
  };
}
const je = L(
    {
      chips: Boolean,
      counter: Boolean,
      counterSizeString: { type: String, default: "$vuetify.fileInput.counterSize" },
      counterString: { type: String, default: "$vuetify.fileInput.counter" },
      hideInput: Boolean,
      multiple: Boolean,
      showSize: {
        type: [Boolean, Number, String],
        default: !1,
        validator: (e) => typeof e == "boolean" || [1e3, 1024].includes(Number(e)),
      },
      truncateLength: { type: [Number, String], default: 22 },
      ...De(Ie({ prependIcon: "$file" }), ["direction"]),
      modelValue: {
        type: [Array, Object],
        default: (e) => (e.multiple ? [] : null),
        validator: (e) => O(e).every((a) => a != null && typeof a == "object"),
      },
      ...Ee(),
      ...Ce({ clearable: !0 }),
    },
    "VFileInput",
  ),
  Oe = ye()({
    name: "VFileInput",
    inheritAttrs: !1,
    props: je(),
    emits: {
      "click:control": (e) => !0,
      "mousedown:control": (e) => !0,
      "update:focused": (e) => !0,
      "update:modelValue": (e) => !0,
      rejected: (e) => !0,
    },
    setup(e, a) {
      let { attrs: i, emit: o, slots: l } = a;
      const { t: n } = he(),
        { filterAccepted: c } = xe(e),
        r = ge(
          e,
          "modelValue",
          e.modelValue,
          (t) => O(t),
          (t) => (!e.multiple && Array.isArray(t) ? t[0] : t),
        ),
        { isFocused: y, focus: U, blur: W } = be(e),
        V = p(() => (typeof e.showSize != "boolean" ? e.showSize : void 0)),
        A = p(() =>
          (r.value ?? []).reduce((t, s) => {
            let { size: d = 0 } = s;
            return t + d;
          }, 0),
        ),
        B = p(() => M(A.value, V.value)),
        b = p(() =>
          (r.value ?? []).map((t) => {
            const { name: s = "", size: d = 0 } = t,
              f = ee(s);
            return e.showSize ? `${f} (${M(d, V.value)})` : f;
          }),
        ),
        Y = p(() => {
          const t = r.value?.length ?? 0;
          return e.showSize ? n(e.counterSizeString, t, B.value) : n(e.counterString, t);
        }),
        P = I(),
        R = I(),
        u = I(),
        q = Te(() => y.value || e.active),
        T = p(() => ["plain", "underlined"].includes(e.variant)),
        h = Pe(!1),
        { handleDrop: J, hasFilesOrFolders: K } = $e();
      function F() {
        (u.value !== document.activeElement && u.value?.focus(), y.value || U());
      }
      function X(t) {
        u.value?.click();
      }
      function _(t) {
        o("mousedown:control", t);
      }
      function Q(t) {
        (u.value?.click(), o("click:control", t));
      }
      function Z(t) {
        (t.stopPropagation(),
          F(),
          ze(() => {
            ((r.value = []), Ae(e["onClick:clear"], t));
          }));
      }
      function ee(t) {
        if (t.length < Number(e.truncateLength)) return t;
        const s = Math.floor((Number(e.truncateLength) - 1) / 2);
        return `${t.slice(0, s)}…${t.slice(t.length - s)}`;
      }
      function te(t) {
        (t.preventDefault(), t.stopImmediatePropagation(), (h.value = !0));
      }
      function ne(t) {
        (t.preventDefault(), (h.value = !1));
      }
      async function le(t) {
        if ((t.preventDefault(), t.stopImmediatePropagation(), (h.value = !1), !u.value || !K(t))) return;
        const s = await J(t);
        z(s);
      }
      function ae(t) {
        if (!(!t.target || t.repack))
          if (e.filterByType) z([...t.target.files]);
          else {
            const s = t.target;
            r.value = [...(s.files ?? [])];
          }
      }
      function z(t) {
        const s = new DataTransfer(),
          { accepted: d, rejected: f } = c(t);
        f.length && o("rejected", f);
        for (const w of d) s.items.add(w);
        ((u.value.files = s.files), (r.value = [...s.files]));
        const k = new Event("change", { bubbles: !0 });
        ((k.repack = !0), u.value.dispatchEvent(k));
      }
      return (
        Be(r, (t) => {
          (!Array.isArray(t) || !t.length) && u.value && (u.value.value = "");
        }),
        Fe(() => {
          const t = !!(l.counter || e.counter),
            s = !!(t || l.details),
            [d, f] = ke(i),
            { modelValue: k, ...w } = N.filterProps(e),
            ie = { ...j.filterProps(e), "onClick:clear": Z },
            re = i.webkitdirectory !== void 0 && i.webkitdirectory !== !1,
            oe = i.accept ? String(i.accept) : void 0,
            se = re ? void 0 : (e.filterByType ?? oe);
          return g(
            N,
            D(
              {
                ref: P,
                modelValue: e.multiple ? r.value : r.value[0],
                class: [
                  "v-file-input",
                  {
                    "v-file-input--chips": !!e.chips,
                    "v-file-input--dragging": h.value,
                    "v-file-input--hide": e.hideInput,
                    "v-input--plain-underlined": T.value,
                  },
                  e.class,
                ],
                style: e.style,
                "onClick:prepend": X,
              },
              d,
              w,
              { centerAffix: !T.value, focused: y.value },
            ),
            {
              ...l,
              default: (C) => {
                let { id: ue, isDisabled: $, isDirty: E, isReadonly: x, isValid: ce, hasDetails: de } = C;
                return g(
                  j,
                  D(
                    {
                      ref: R,
                      prependIcon: e.prependIcon,
                      onMousedown: _,
                      onClick: Q,
                      "onClick:prependInner": e["onClick:prependInner"],
                      "onClick:appendInner": e["onClick:appendInner"],
                    },
                    ie,
                    {
                      id: ue.value,
                      active: q.value || E.value,
                      dirty: E.value || e.dirty,
                      disabled: $.value,
                      focused: y.value,
                      details: de.value,
                      error: ce.value === !1,
                      onDragover: te,
                      onDrop: le,
                    },
                  ),
                  {
                    ...l,
                    default: (fe) => {
                      let {
                        props: { class: ve, ...pe },
                        controlRef: me,
                      } = fe;
                      return m(S, null, [
                        m(
                          "input",
                          D(
                            {
                              ref: (v) => (u.value = me.value = v),
                              type: "file",
                              accept: se,
                              readonly: x.value,
                              disabled: $.value,
                              multiple: e.multiple,
                              name: e.name,
                              onClick: (v) => {
                                (v.stopPropagation(), x.value && v.preventDefault(), F());
                              },
                              onChange: ae,
                              onDragleave: ne,
                              onFocus: F,
                              onBlur: W,
                            },
                            pe,
                            f,
                          ),
                          null,
                        ),
                        m("div", { class: Re(ve) }, [
                          !!r.value?.length &&
                            !e.hideInput &&
                            (l.selection
                              ? l.selection({ fileNames: b.value, totalBytes: A.value, totalBytesReadable: B.value })
                              : e.chips
                                ? b.value.map((v) => g(Ve, { key: v, size: "small", text: v }, null))
                                : b.value.join(", ")),
                        ]),
                      ]);
                    },
                  },
                );
              },
              details: s
                ? (C) =>
                    m(S, null, [
                      l.details?.(C),
                      t &&
                        m(S, null, [
                          m("span", null, null),
                          g(Se, { active: !!r.value?.length, value: Y.value, disabled: e.disabled }, l.counter),
                        ]),
                    ])
                : void 0,
            },
          );
        }),
        we({}, P, R, u)
      );
    },
  });
export { Oe as V };
