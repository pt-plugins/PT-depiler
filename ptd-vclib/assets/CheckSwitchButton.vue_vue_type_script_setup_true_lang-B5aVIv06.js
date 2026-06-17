import { bN as f } from "./src/entries/options/index-DmNe5UVo.js";
import { N as a } from "./NavButton-jVIhOejA.js";
import {
  X as b,
  cb as x,
  L as p,
  U as m,
  b0 as s,
  c4 as i,
  F as C,
  a$ as c,
  bj as v,
} from "../vendor/packages/site/index-COeZNva1.js";
const $ = b({
  __name: "CheckSwitchButton",
  props: c({ all: {} }, { modelValue: { required: !0, default: [] }, modelModifiers: {} }),
  emits: c(["update:model"], ["update:modelValue"]),
  setup(o, { emit: u }) {
    const { t: l } = f(),
      r = x(o, "modelValue"),
      d = u;
    function n(e) {
      ((r.value = e), d("update:model", e));
    }
    return (e, t) => (
      v(),
      p(
        C,
        null,
        [
          m(
            a,
            s({ text: i(l)("common.checkbox.all"), icon: "mdi-checkbox-marked", size: "small" }, e.$attrs, {
              onClick: t[0] || (t[0] = () => n(o.all)),
            }),
            null,
            16,
            ["text"],
          ),
          m(
            a,
            s({ text: i(l)("common.checkbox.none"), icon: "mdi-checkbox-blank-off-outline", size: "small" }, e.$attrs, {
              onClick: t[1] || (t[1] = () => n([])),
            }),
            null,
            16,
            ["text"],
          ),
          m(
            a,
            s(
              { text: i(l)("common.checkbox.invert"), icon: "mdi-checkbox-intermediate-variant", size: "small" },
              e.$attrs,
              { onClick: t[2] || (t[2] = () => n(o.all.filter((k) => !r.value.includes(k)))) },
            ),
            null,
            16,
            ["text"],
          ),
        ],
        64,
      )
    );
  },
});
export { $ as _ };
