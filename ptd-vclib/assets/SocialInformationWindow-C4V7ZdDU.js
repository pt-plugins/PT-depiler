import {
  X as b,
  L as V,
  U as a,
  ck as t,
  F as C,
  bj as f,
  Q as s,
  bS as m,
  c4 as e,
  I as S,
  q as I,
  J as y,
} from "../vendor/packages/site/index-COeZNva1.js";
import {
  bN as A,
  bz as k,
  T as r,
  n as d,
  A as u,
  o as U,
  a3 as g,
  V as c,
} from "./src/entries/options/index-DmNe5UVo.js";
import { V as p } from "../vendor/vuetify/VNumberInput-ZpDwJV6p.js";
import { V as _ } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
const T = b({
  __name: "SocialInformationWindow",
  setup(x) {
    const { t: l } = A(),
      o = k();
    return (G, i) => (
      f(),
      V(
        C,
        null,
        [
          a(r, null, {
            default: t(() => [
              a(
                d,
                { md: "10", lg: "8" },
                {
                  default: t(() => [
                    a(u, null, { default: t(() => [s(m(e(l)("socialConfig.basicConfig")), 1)]), _: 1 }),
                    a(
                      p,
                      {
                        modelValue: e(o).socialSiteInformation.cacheDay,
                        "onUpdate:modelValue": i[0] || (i[0] = (n) => (e(o).socialSiteInformation.cacheDay = n)),
                        label: e(l)("socialConfig.cacheValidityDays"),
                        min: 3,
                        messages: e(l)("socialConfig.cacheShortWarning"),
                      },
                      null,
                      8,
                      ["modelValue", "label", "messages"],
                    ),
                    a(
                      p,
                      {
                        modelValue: e(o).socialSiteInformation.timeout,
                        "onUpdate:modelValue": i[1] || (i[1] = (n) => (e(o).socialSiteInformation.timeout = n)),
                        label: e(l)("socialConfig.requestTimeoutMs"),
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
          a(r, null, {
            default: t(() => [
              a(
                d,
                { md: "10", lg: "8" },
                {
                  default: t(() => [
                    a(u, null, { default: t(() => [s(m(e(l)("socialConfig.ptgenConfig")), 1)]), _: 1 }),
                    a(
                      _,
                      {
                        modelValue: e(o).socialSiteInformation.preferPtGen,
                        "onUpdate:modelValue": i[2] || (i[2] = (n) => (e(o).socialSiteInformation.preferPtGen = n)),
                        label: e(l)("socialConfig.preferPtgenLabel"),
                        color: "success",
                        "hide-details": "",
                      },
                      null,
                      8,
                      ["modelValue", "label"],
                    ),
                    e(o).socialSiteInformation.preferPtGen
                      ? (f(),
                        S(
                          U,
                          {
                            key: 0,
                            modelValue: e(o).socialSiteInformation.ptGenEndpoint,
                            "onUpdate:modelValue":
                              i[3] || (i[3] = (n) => (e(o).socialSiteInformation.ptGenEndpoint = n)),
                            items: e(I),
                            "return-object": !1,
                            "item-title": "provider",
                            "item-value": "url",
                            label: e(l)("socialConfig.ptgenApiAddress"),
                            messages: e(l)("socialConfig.ptgenApiMessages"),
                          },
                          null,
                          8,
                          ["modelValue", "items", "label", "messages"],
                        ))
                      : y("", !0),
                  ]),
                  _: 1,
                },
              ),
            ]),
            _: 1,
          }),
          a(r, null, {
            default: t(() => [
              a(
                d,
                { md: "10", lg: "8" },
                {
                  default: t(() => [
                    a(u, null, { default: t(() => [s(m(e(l)("socialConfig.mediaRatingConfig")), 1)]), _: 1 }),
                    a(
                      g,
                      {
                        modelValue: e(o).socialSiteInformation.socialSite.anidb.client,
                        "onUpdate:modelValue":
                          i[4] || (i[4] = (n) => (e(o).socialSiteInformation.socialSite.anidb.client = n)),
                        label: e(l)("socialConfig.anidbClientId"),
                        clearable: "",
                        messages: e(l)("socialConfig.anidbClientMessages"),
                      },
                      { prepend: t(() => [a(c, { image: "/icons/social/anidb.png" })]), _: 1 },
                      8,
                      ["modelValue", "label", "messages"],
                    ),
                    a(
                      g,
                      {
                        modelValue: e(o).socialSiteInformation.socialSite.bangumi.apikey,
                        "onUpdate:modelValue":
                          i[5] || (i[5] = (n) => (e(o).socialSiteInformation.socialSite.bangumi.apikey = n)),
                        label: e(l)("socialConfig.bangumiApiKey"),
                        clearable: "",
                        messages: e(l)("socialConfig.bangumiApiMessages"),
                      },
                      { prepend: t(() => [a(c, { image: "/icons/social/bangumi.png" })]), _: 1 },
                      8,
                      ["modelValue", "label", "messages"],
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
export { T as default };
