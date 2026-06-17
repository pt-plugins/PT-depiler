import { bN as b, bz as p, bV as g, T as m, n, A as c, x as B, t as V } from "./src/entries/options/index-DmNe5UVo.js";
import {
  X as T,
  L as C,
  U as a,
  ck as r,
  F as x,
  bj as v,
  Q as d,
  bS as u,
  c4 as e,
  aE as L,
  b0 as F,
  D as U,
} from "../vendor/packages/site/index-COeZNva1.js";
import { V as y } from "../vendor/vuetify/VNumberInput-ZpDwJV6p.js";
import { V as i } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { V as w } from "../vendor/vuetify/VTooltip-BF7r8Igl.js";
import { V as I } from "../vendor/vuetify/VTextarea-hZu3Ftop.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
const j = T({
  __name: "SearchEntityWindow",
  setup(M) {
    const { t: o } = b(),
      s = p(),
      f = g();
    async function E(S) {
      S || (await f.setLastSearchFilter(""));
    }
    const h = U({
      get: () =>
        s.searchEntifyControl.hiddenTagNames.join(`
`),
      set: (S) => {
        s.searchEntifyControl.hiddenTagNames = S.split(
          `
`,
        )
          .map((t) => t.trim())
          .filter(Boolean);
      },
    });
    return (S, t) => (
      v(),
      C(
        x,
        null,
        [
          a(m, null, {
            default: r(() => [
              a(
                n,
                { md: "10", lg: "8" },
                {
                  default: r(() => [
                    a(c, null, { default: r(() => [d(u(e(o)("SetBase.searchEntity.siteSearchConfig")), 1)]), _: 1 }),
                    a(
                      y,
                      {
                        modelValue: e(s).searchEntity.queueConcurrency,
                        "onUpdate:modelValue": t[0] || (t[0] = (l) => (e(s).searchEntity.queueConcurrency = l)),
                        label: e(o)("SetBase.searchEntity.siteQueueConcurrency"),
                        max: 25,
                        min: 1,
                        controlVariant: "default",
                        "hide-details": "",
                      },
                      null,
                      8,
                      ["modelValue", "label"],
                    ),
                    a(
                      m,
                      { dense: "" },
                      {
                        default: r(() => [
                          a(
                            n,
                            { cols: "12", md: "2", class: "d-flex align-center justify-center" },
                            {
                              default: r(() => [
                                a(c, null, {
                                  default: r(() => [d(u(e(o)("SetBase.searchEntity.searchPlanLabel")), 1)]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            },
                          ),
                          a(n, null, {
                            default: r(() => [
                              a(
                                i,
                                {
                                  modelValue: e(s).searchEntity.allowSingleSiteSearch,
                                  "onUpdate:modelValue":
                                    t[1] || (t[1] = (l) => (e(s).searchEntity.allowSingleSiteSearch = l)),
                                  disabled: e(L)(e(f).sites),
                                  label: e(o)("SetBase.searchEntity.allowSingleSiteSearch"),
                                  color: "success",
                                  "hide-details": "",
                                },
                                null,
                                8,
                                ["modelValue", "disabled", "label"],
                              ),
                              a(
                                i,
                                {
                                  modelValue: e(s).searchEntity.treatTTQueryAsImdbSearch,
                                  "onUpdate:modelValue":
                                    t[2] || (t[2] = (l) => (e(s).searchEntity.treatTTQueryAsImdbSearch = l)),
                                  label: e(o)("SetBase.searchEntity.treatTTQueryAsImdbSearch"),
                                  color: "success",
                                  "hide-details": "",
                                },
                                {
                                  append: r(() => [
                                    a(
                                      w,
                                      { location: "bottom", "max-width": "400" },
                                      {
                                        activator: r(({ props: l }) => [
                                          a(B, F({ color: "info", icon: "mdi-help-circle" }, l), null, 16),
                                        ]),
                                        default: r(() => [d(" " + u(e(o)("SetBase.searchEntity.imdbTip")), 1)]),
                                        _: 1,
                                      },
                                    ),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["modelValue", "label"],
                              ),
                              a(
                                i,
                                {
                                  modelValue: e(s).searchEntity.showHotRecommendations,
                                  "onUpdate:modelValue":
                                    t[3] || (t[3] = (l) => (e(s).searchEntity.showHotRecommendations = l)),
                                  label: e(o)("SetBase.searchEntity.showHotRecommendations"),
                                  color: "success",
                                  "hide-details": "",
                                },
                                null,
                                8,
                                ["modelValue", "label"],
                              ),
                              a(V),
                            ]),
                            _: 1,
                          }),
                        ]),
                        _: 1,
                      },
                    ),
                    a(
                      m,
                      { dense: "" },
                      {
                        default: r(() => [
                          a(
                            n,
                            { cols: "12", md: "2", class: "d-flex align-center justify-center" },
                            {
                              default: r(() => [
                                a(c, null, {
                                  default: r(() => [d(u(e(o)("SetBase.searchEntity.filterLabel")), 1)]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            },
                          ),
                          a(n, null, {
                            default: r(() => [
                              a(
                                i,
                                {
                                  modelValue: e(s).searchEntity.saveLastFilter,
                                  "onUpdate:modelValue": [
                                    t[4] || (t[4] = (l) => (e(s).searchEntity.saveLastFilter = l)),
                                    t[5] || (t[5] = (l) => E(l)),
                                  ],
                                  label: e(o)("SetBase.searchEntity.saveLastSearchFilter"),
                                  color: "success",
                                  "hide-details": "",
                                },
                                null,
                                8,
                                ["modelValue", "label"],
                              ),
                              a(
                                i,
                                {
                                  modelValue: e(s).searchEntity.forceImdbIdMatchFilter,
                                  "onUpdate:modelValue":
                                    t[6] || (t[6] = (l) => (e(s).searchEntity.forceImdbIdMatchFilter = l)),
                                  label: e(o)("SetBase.searchEntity.forceImdbIdMatchFilter"),
                                  color: "success",
                                  "hide-details": "",
                                },
                                null,
                                8,
                                ["modelValue", "label"],
                              ),
                              a(
                                i,
                                {
                                  modelValue: e(s).searchEntity.quickSiteFilter,
                                  "onUpdate:modelValue":
                                    t[7] || (t[7] = (l) => (e(s).searchEntity.quickSiteFilter = l)),
                                  label: e(o)("SetBase.searchEntity.quickSiteFilter"),
                                  color: "success",
                                  "hide-details": "",
                                },
                                null,
                                8,
                                ["modelValue", "label"],
                              ),
                              a(V),
                            ]),
                            _: 1,
                          }),
                        ]),
                        _: 1,
                      },
                    ),
                    a(
                      m,
                      { dense: "" },
                      {
                        default: r(() => [
                          a(
                            n,
                            { cols: "12", md: "2", class: "d-flex align-center justify-center" },
                            {
                              default: r(() => [
                                a(c, null, {
                                  default: r(() => [d(u(e(o)("SetBase.searchEntity.tagLabel")), 1)]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            },
                          ),
                          a(n, null, {
                            default: r(() => [
                              a(
                                i,
                                {
                                  modelValue: e(s).searchEntity.autoDetectOfficialGroupFromTitle,
                                  "onUpdate:modelValue":
                                    t[8] || (t[8] = (l) => (e(s).searchEntity.autoDetectOfficialGroupFromTitle = l)),
                                  label: e(o)("SetBase.searchEntity.autoDetectOfficialGroupFromTitle"),
                                  color: "success",
                                  "hide-details": "",
                                },
                                null,
                                8,
                                ["modelValue", "label"],
                              ),
                              a(
                                y,
                                {
                                  modelValue: e(s).searchEntifyControl.maxTagCountBeforeGroup,
                                  "onUpdate:modelValue":
                                    t[9] || (t[9] = (l) => (e(s).searchEntifyControl.maxTagCountBeforeGroup = l)),
                                  label: e(o)("SetBase.searchEntity.maxTagCountBeforeGroup"),
                                  min: 0,
                                  max: 50,
                                  controlVariant: "default",
                                  "hide-details": "",
                                },
                                null,
                                8,
                                ["modelValue", "label"],
                              ),
                              a(
                                I,
                                {
                                  modelValue: h.value,
                                  "onUpdate:modelValue": t[10] || (t[10] = (l) => (h.value = l)),
                                  label: e(o)("SetBase.searchEntity.hiddenTagNames"),
                                  messages: e(o)("SetBase.searchEntity.hiddenTagNamesMessage"),
                                  class: "mt-2",
                                  "auto-grow": "",
                                  clearable: "",
                                  rows: "5",
                                },
                                null,
                                8,
                                ["modelValue", "label", "messages"],
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
                },
              ),
            ]),
            _: 1,
          }),
          a(m, null, {
            default: r(() => [
              a(
                n,
                { md: "10", lg: "8" },
                {
                  default: r(() => [
                    a(c, null, {
                      default: r(() => [d(u(e(o)("SetBase.searchEntity.mediaServerSearchConfig")), 1)]),
                      _: 1,
                    }),
                    a(
                      y,
                      {
                        modelValue: e(s).mediaServerEntity.queueConcurrency,
                        "onUpdate:modelValue": t[11] || (t[11] = (l) => (e(s).mediaServerEntity.queueConcurrency = l)),
                        label: e(o)("SetBase.searchEntity.mediaQueueConcurrency"),
                        max: 25,
                        min: 1,
                        controlVariant: "default",
                      },
                      null,
                      8,
                      ["modelValue", "label"],
                    ),
                    a(
                      y,
                      {
                        modelValue: e(s).mediaServerEntity.searchLimit,
                        "onUpdate:modelValue": t[12] || (t[12] = (l) => (e(s).mediaServerEntity.searchLimit = l)),
                        label: e(o)("SetBase.searchEntity.mediaSearchLimit"),
                        max: 500,
                        messages: e(o)("SetBase.searchEntity.mediaSearchLimitMessage"),
                        min: 1,
                        step: e(s).mediaServerEntity.searchLimit >= 100 ? 10 : 1,
                        controlVariant: "default",
                      },
                      null,
                      8,
                      ["modelValue", "label", "messages", "step"],
                    ),
                    a(
                      i,
                      {
                        modelValue: e(s).mediaServerEntity.autoSearchWhenMount,
                        "onUpdate:modelValue":
                          t[13] || (t[13] = (l) => (e(s).mediaServerEntity.autoSearchWhenMount = l)),
                        label: e(o)("SetBase.searchEntity.autoLoadInitialMediaWall"),
                        color: "success",
                        "hide-details": "",
                      },
                      null,
                      8,
                      ["modelValue", "label"],
                    ),
                    a(
                      i,
                      {
                        modelValue: e(s).mediaServerEntity.autoSearchMoreWhenScroll,
                        "onUpdate:modelValue":
                          t[14] || (t[14] = (l) => (e(s).mediaServerEntity.autoSearchMoreWhenScroll = l)),
                        label: e(o)("SetBase.searchEntity.autoLoadMoreMediaOnScroll"),
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
          }),
        ],
        64,
      )
    );
  },
});
export { j as default };
