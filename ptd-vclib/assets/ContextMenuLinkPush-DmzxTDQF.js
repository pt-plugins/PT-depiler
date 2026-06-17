import { bV as f, c2 as d, bN as k, b$ as h, c0 as _ } from "./src/entries/options/index-DmNe5UVo.js";
import { X as b, bf as w, ae as M, I as v, br as m, bj as S } from "../vendor/packages/site/index-COeZNva1.js";
import { _ as g } from "./Index.vue_vue_type_script_setup_true_lang-BRuNpdRn.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/es-toolkit/toMerged-Be-qf92q.js";
import "../vendor/es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../vendor/packages/downloader/index-BATa0ddy.js";
import "./___vite-browser-external_commonjs-proxy-DYDjyS4M.js";
import "./utils-DF6YUpNn.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import "../vendor/vuetify/VForm-CJoKT4R8.js";
import "../vendor/vuetify/VAutocomplete-DUqyo09O.js";
import "../vendor/vuetify/VSwitch-CFTblx63.js";
import "../vendor/vuetify/VExpansionPanels-Bs-8zb91.js";
const X = b({
  __name: "ContextMenuLinkPush",
  setup(x) {
    const p = h(),
      l = _(),
      n = f(),
      s = d(),
      { t: a } = k(),
      r = m(!1),
      i = m([]);
    w(() => {
      const t = p?.query?.link;
      if (!t || typeof t != "string") {
        (s.showSnakebar(a("ContextMenuLinkPush.invalidLink"), { color: "error" }), u());
        return;
      }
      const o = { link: t };
      if (t.match(/https?:\/\/([^/]+)/)) {
        const e = M(t);
        n.siteHostMap[e] && (o.site = n.siteHostMap[e]);
      }
      ((i.value = [o]), s.showSnakebar(a("ContextMenuLinkPush.keywordWarning"), { color: "warning" }), (r.value = !0));
    });
    function c() {
      l.push({ name: "DownloadHistory" });
    }
    function u() {
      window.close();
    }
    return (t, o) => (
      S(),
      v(
        g,
        {
          modelValue: r.value,
          "onUpdate:modelValue": o[0] || (o[0] = (e) => (r.value = e)),
          "torrent-items": i.value,
          onDone: c,
          onCancel: u,
        },
        null,
        8,
        ["modelValue", "torrent-items"],
      )
    );
  },
});
export { X as default };
