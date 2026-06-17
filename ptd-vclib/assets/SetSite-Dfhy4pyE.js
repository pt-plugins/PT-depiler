import {
  bV as $,
  bN as Q,
  f as G,
  p as Ne,
  A as ue,
  T as le,
  n as H,
  o as ke,
  a3 as N,
  t as E,
  x as Y,
  $ as re,
  c as h,
  a2 as L,
  a7 as je,
  s as oe,
  j as X,
  a4 as ie,
  a5 as ne,
  i as se,
  C as q,
  D as Te,
  F as te,
  l as me,
  a8 as ae,
  g as de,
  B as fe,
  c2 as Me,
  bz as qe,
  H as we,
  cf as ye,
  d as Qe,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  Y as Ge,
  E as Je,
  X as z,
  cb as Z,
  bf as Ae,
  ch as Ke,
  I as M,
  ck as t,
  U as e,
  Q as g,
  bS as f,
  c4 as l,
  L as A,
  bu as O,
  F as B,
  J as _,
  b0 as ve,
  a$ as Ee,
  br as I,
  as as Ye,
  D as P,
  bj as C,
  bD as Ue,
  e as Xe,
  b4 as Ze,
  an as el,
  H as j,
  b3 as xe,
  bJ as Be,
  bo as $e,
  bp as ll,
  aE as tl,
  bC as _e,
  aQ as al,
} from "../vendor/packages/site/index-COeZNva1.js";
import { u as ol } from "./useAdvanceFilter-CaHJJm2I.js";
import { a as J, b as he } from "./utils-DF6YUpNn.js";
import { t as il } from "../vendor/es-toolkit/toMerged-Be-qf92q.js";
import { V as nl } from "../vendor/vuetify/VForm-CJoKT4R8.js";
import { V as Fe } from "../vendor/vuetify/VAutocomplete-DUqyo09O.js";
import { a as sl, V as Ie } from "../vendor/vuetify/VRadioGroup-jSvmgi9c.js";
import { V as Re } from "../vendor/vuetify/VTooltip-BF7r8Igl.js";
import { V as dl, a as De } from "../vendor/vuetify/VWindowItem-CGCDkWEG.js";
import { V as Oe } from "../vendor/vuetify/VListItemAction-CeTFHb3m.js";
import { V as F } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { p as ul } from "../vendor/es-toolkit/pickBy-FBk0z9fI.js";
import { u as Le } from "./useResetableRef-DOEDeOaU.js";
import { _ as rl } from "./CheckSwitchButton.vue_vue_type_script_setup_true_lang-B5aVIv06.js";
import { V as ce } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as ml } from "../vendor/vuetify/VSkeletonLoader-YwNzPI56.js";
import { V as pe } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import { E as cl } from "../vendor/packages/site/types/base-Dy_28wGT.js";
import { _ as pl } from "./DeleteDialog.vue_vue_type_script_setup_true_lang-CkaHuNvW.js";
import { N as K } from "./NavButton-jVIhOejA.js";
import { V as fl } from "../vendor/vuetify/VDataTable-CZ1PzVkY.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/es-toolkit/isEqual-xRaZZh9v.js";
import "../vendor/es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../vendor/es-toolkit/flatten-CRv0zNMl.js";
import "../vendor/date-fns/startOfMonth-CSVGuOFh.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/es-toolkit/uniqBy-DEckz2wg.js";
import "../vendor/packages/site/utils/filesize-D_1hx4u8.js";
import "../vendor/packages/site/utils/datetime-DQxMK7bP.js";
import "../vendor/date-fns/sub-D9RLuzs0.js";
import "../vendor/date-fns/subDays-DlPNbvmn.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import "../vendor/vuetify/VTable-7Q8JlSj6.js";
async function Pe() {
  const y = {},
    d = $(),
    a = Ge.filter((S) => !d.getAddedSiteIds.includes(S));
  for (const S of a) y[S] = await d.getSiteMetadata(S);
  return y;
}
const vl = Je(async () => {
    const y = $();
    Object.values(y.sites).map((a) => a);
    const d = [];
    for (const [a, S] of Object.entries(y.sites))
      d.push({ id: a, metadata: await y.getSiteMetadata(a), userConfig: S });
    return d;
  }),
  Sl = z({
    __name: "Editor",
    props: { modelValue: { default: "" }, modelModifiers: {} },
    emits: Ee(["update:formValid"], ["update:modelValue"]),
    setup(y, { emit: d }) {
      const { t: a } = Q(),
        S = $(),
        r = Z(y, "modelValue"),
        k = d,
        m = I({}),
        s = Ye("storedSiteUserConfig", {}),
        D = P({ get: () => s.value.merge?.name ?? m.value.name, set: (u) => Ue(s.value, "merge.name", u) }),
        U = P({
          get: () => s.value.merge?.timezoneOffset ?? m.value.timezoneOffset,
          set: (u) => Ue(s.value, "merge.timezoneOffset", u),
        }),
        b = I(""),
        x = I(!0);
      function v(u) {
        ((x.value = u), k("update:formValid", u));
      }
      async function V(u, i = !1) {
        (console.debug("initSiteData", u, i),
          (m.value = await S.getSiteMetadata(u)),
          (s.value = il({ inputSetting: {}, url: m.value.urls[0] }, await S.getSiteUserConfig(u, i))),
          m.value.urls.includes(s.value.url) || (b.value = s.value.url),
          v(m.value.isDead ? !0 : x.value));
      }
      (Ae(() => {
        V(r.value);
      }),
        Ke(r, (u) => {
          V(u);
        }));
      const c = [
        { value: "-1200", title: "(UTC -12:00) Enitwetok, Kwajalien" },
        { value: "-1100", title: "(UTC -11:00) Midway Island, Samoa" },
        { value: "-1000", title: "(UTC -10:00) Hawaii" },
        { value: "-0900", title: "(UTC -09:00) Alaska" },
        { value: "-0800", title: "(UTC -08:00) Pacific Time (US & Canada)" },
        { value: "-0700", title: "(UTC -07:00) Mountain Time (US & Canada)" },
        { value: "-0600", title: "(UTC -06:00) Central Time (US & Canada), Mexico City" },
        { value: "-0500", title: "(UTC -05:00) Eastern Time (US & Canada), Bogota, Lima" },
        { value: "-0400", title: "(UTC -04:00) Atlantic Time (Canada), Caracas, La Paz" },
        { value: "-0330", title: "(UTC -03:30) Newfoundland" },
        { value: "-0300", title: "(UTC -03:00) Brazil, Buenos Aires, Falkland Is." },
        { value: "-0200", title: "(UTC -02:00) Mid-Atlantic, Ascention Is., St Helena" },
        { value: "-0100", title: "(UTC -01:00) Azores, Cape Verde Islands" },
        { value: "+0000", title: "(UTC ±00:00) Casablanca, Dublin, London, Lisbon, Monrovia" },
        { value: "+0100", title: "(UTC +01:00) Brussels, Copenhagen, Madrid, Paris" },
        { value: "+0200", title: "(UTC +02:00) Sofia, Izrael, South Africa," },
        { value: "+0300", title: "(UTC +03:00) Baghdad, Riyadh, Moscow, Nairobi" },
        { value: "+0330", title: "(UTC +03:30) Tehran" },
        { value: "+0400", title: "(UTC +04:00) Abu Dhabi, Baku, Muscat, Tbilisi" },
        { value: "+0430", title: "(UTC +04:30) Kabul" },
        { value: "+0500", title: "(UTC +05:00) Ekaterinburg, Karachi, Tashkent" },
        { value: "+0530", title: "(UTC +05:30) Bombay, Calcutta, Madras, New Delhi" },
        { value: "+0600", title: "(UTC +06:00) Almaty, Colomba, Dhakra" },
        { value: "+0700", title: "(UTC +07:00) Bangkok, Hanoi, Jakarta" },
        { value: "+0800", title: "(UTC +08:00) ShangHai, HongKong, Perth, Singapore, Taipei" },
        { value: "+0900", title: "(UTC +09:00) Osaka, Sapporo, Seoul, Tokyo, Yakutsk" },
        { value: "+0930", title: "(UTC +09:30) Adelaide, Darwin" },
        { value: "+1000", title: "(UTC +10:00) Melbourne, Papua New Guinea, Sydney" },
        { value: "+1100", title: "(UTC +11:00) Magadan, New Caledonia, Solomon Is." },
        { value: "+1200", title: "(UTC +12:00) Auckland, Fiji, Marshall Island" },
      ];
      return (u, i) => (
        C(),
        M(
          G,
          { class: "mb-5 pa-1" },
          {
            default: t(() => [
              e(
                nl,
                {
                  modelValue: x.value,
                  "onUpdate:modelValue": [
                    i[18] || (i[18] = (n) => (x.value = n)),
                    i[19] || (i[19] = (n) => k("update:formValid", n)),
                  ],
                  "fast-fail": "",
                  disabled: m.value.isDead,
                  "validate-on": "input",
                },
                {
                  default: t(() => [
                    e(
                      Ne,
                      { class: "pa-0" },
                      {
                        default: t(() => [
                          e(ue, { class: "my-2" }, { default: t(() => [g(f(l(a)("common.basicInfo")), 1)]), _: 1 }),
                          e(le, null, {
                            default: t(() => [
                              e(
                                H,
                                { cols: "12", md: "4" },
                                {
                                  default: t(() => [
                                    e(
                                      ke,
                                      {
                                        modelValue: D.value,
                                        "onUpdate:modelValue": i[0] || (i[0] = (n) => (D.value = n)),
                                        items: [m.value.name, ...(m.value.aka ?? [])],
                                        label: l(a)("SetSite.common.name"),
                                        rules: [l(J).require()],
                                        "hide-details": "",
                                      },
                                      null,
                                      8,
                                      ["modelValue", "items", "label", "rules"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                              ),
                              e(
                                H,
                                { cols: "12", md: "4" },
                                {
                                  default: t(() => [
                                    e(
                                      N,
                                      {
                                        modelValue: m.value.schema,
                                        "onUpdate:modelValue": i[1] || (i[1] = (n) => (m.value.schema = n)),
                                        label: l(a)("common.type"),
                                        disabled: "",
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
                              e(
                                H,
                                { cols: "12", md: "4" },
                                {
                                  default: t(() => [
                                    e(
                                      N,
                                      {
                                        modelValue: l(s).sortIndex,
                                        "onUpdate:modelValue": i[2] || (i[2] = (n) => (l(s).sortIndex = n)),
                                        label: l(a)("common.sortIndex"),
                                        placeholder: l(a)("SetSite.editor.sortIndexTip"),
                                        rules: [l(J).require()],
                                        "hide-details": "",
                                        type: "number",
                                      },
                                      null,
                                      8,
                                      ["modelValue", "label", "placeholder", "rules"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                              ),
                              e(
                                H,
                                { cols: "12" },
                                {
                                  default: t(() => [
                                    e(
                                      ke,
                                      {
                                        modelValue: l(s).groups,
                                        "onUpdate:modelValue": i[3] || (i[3] = (n) => (l(s).groups = n)),
                                        items: m.value.tags,
                                        chips: "",
                                        label: l(a)("SetSite.common.groups"),
                                        multiple: "",
                                        "hide-details": "",
                                      },
                                      null,
                                      8,
                                      ["modelValue", "items", "label"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                              ),
                              e(
                                H,
                                { cols: "12" },
                                {
                                  default: t(() => [
                                    e(
                                      Fe,
                                      {
                                        modelValue: U.value,
                                        "onUpdate:modelValue": i[4] || (i[4] = (n) => (U.value = n)),
                                        items: c,
                                        label: l(a)("SetSite.editor.timezone"),
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
                          e(le, null, {
                            default: t(() => [
                              e(
                                sl,
                                {
                                  modelValue: l(s).url,
                                  "onUpdate:modelValue": i[10] || (i[10] = (n) => (l(s).url = n)),
                                  label: l(a)("SetSite.common.url"),
                                  class: "edit-select-url",
                                  "hide-details": "",
                                  rules: [l(J).require()],
                                },
                                {
                                  default: t(() => [
                                    (C(!0),
                                    A(
                                      B,
                                      null,
                                      O(
                                        m.value.urls,
                                        (n) => (
                                          C(),
                                          M(
                                            Ie,
                                            { key: n, value: n, onClick: i[5] || (i[5] = (R) => v(!0)) },
                                            {
                                              label: t(() => [
                                                g(f(n) + " ", 1),
                                                e(L),
                                                e(
                                                  h,
                                                  {
                                                    title: l(a)("SetSite.common.open"),
                                                    href: n,
                                                    color: "info",
                                                    icon: "mdi-arrow-top-right-bold-box-outline",
                                                    target: "_blank",
                                                    variant: "text",
                                                  },
                                                  null,
                                                  8,
                                                  ["title", "href"],
                                                ),
                                              ]),
                                              _: 2,
                                            },
                                            1032,
                                            ["value"],
                                          )
                                        ),
                                      ),
                                      128,
                                    )),
                                    e(
                                      Ie,
                                      {
                                        modelValue: b.value,
                                        "onUpdate:modelValue": i[8] || (i[8] = (n) => (b.value = n)),
                                        value: b.value,
                                        onClick: i[9] || (i[9] = (n) => v(!1)),
                                      },
                                      {
                                        label: t(() => [
                                          e(
                                            N,
                                            {
                                              modelValue: b.value,
                                              "onUpdate:modelValue": [
                                                i[6] || (i[6] = (n) => (b.value = n)),
                                                i[7] || (i[7] = (n) => (l(s).url = n)),
                                              ],
                                              placeholder: l(a)("SetSite.editor.customUrlPlaceholder"),
                                              rules: [(n) => (n ? l(J).url()(n) : !0)],
                                            },
                                            null,
                                            8,
                                            ["modelValue", "placeholder", "rules"],
                                          ),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["modelValue", "value"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["modelValue", "label", "rules"],
                              ),
                            ]),
                            _: 1,
                          }),
                          e(E),
                          m.value.userInputSettingMeta && l(s).inputSetting
                            ? (C(),
                              A(
                                B,
                                { key: 0 },
                                [
                                  e(
                                    ue,
                                    { class: "my-2" },
                                    { default: t(() => [g(f(l(a)("SetSite.Editor.siteSettings")), 1)]), _: 1 },
                                  ),
                                  (C(!0),
                                  A(
                                    B,
                                    null,
                                    O(
                                      m.value.userInputSettingMeta,
                                      (n) => (
                                        C(),
                                        M(
                                          N,
                                          {
                                            key: n.name,
                                            modelValue: l(s).inputSetting[n.name],
                                            "onUpdate:modelValue": (R) => (l(s).inputSetting[n.name] = R),
                                            hint: n.hint,
                                            label: n.label,
                                            rules: [(R) => (!m.value.isDead && n.required ? l(J).require()(R) : !0)],
                                            "validate-on": "input",
                                          },
                                          null,
                                          8,
                                          ["modelValue", "onUpdate:modelValue", "hint", "label", "rules"],
                                        )
                                      ),
                                    ),
                                    128,
                                  )),
                                  e(E),
                                ],
                                64,
                              ))
                            : _("", !0),
                          e(
                            ue,
                            { class: "my-2" },
                            { default: t(() => [g(f(l(a)("SetSite.Editor.otherSettings")), 1)]), _: 1 },
                          ),
                          e(
                            N,
                            {
                              modelValue: l(s).downloadLinkAppendix,
                              "onUpdate:modelValue": i[11] || (i[11] = (n) => (l(s).downloadLinkAppendix = n)),
                              label: l(a)("SetSite.Editor.downloadLinkSuffix"),
                              hint: l(a)("SetSite.Editor.downloadLinkSuffixHint"),
                            },
                            {
                              append: t(() => [
                                e(
                                  Re,
                                  { "max-width": "400", location: "top" },
                                  {
                                    activator: t(({ props: n }) => [
                                      e(Y, ve(n, { class: "mr-4", icon: "mdi-information", color: "info" }), null, 16),
                                    ]),
                                    default: t(() => [g(" " + f(l(a)("SetSite.Editor.downloadLinkSuffixExample")), 1)]),
                                    _: 1,
                                  },
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue", "label", "hint"],
                          ),
                          e(
                            re,
                            {
                              modelValue: l(s).timeout,
                              "onUpdate:modelValue": i[13] || (i[13] = (n) => (l(s).timeout = n)),
                              color: l(s).timeout > 8 * 6e4 ? "red" : l(s).timeout > 5 * 6e4 ? "amber" : "green",
                              max: 10 * 6e4,
                              min: 0,
                              step: 1e3,
                              hint: l(a)("SetSite.Editor.requestTimeoutHint"),
                              label: l(a)("SetSite.Editor.requestTimeout"),
                              "persistent-hint": "",
                            },
                            {
                              append: t(() => [
                                e(
                                  h,
                                  { variant: "flat", onClick: i[12] || (i[12] = (n) => (l(s).timeout = 3e4)) },
                                  { default: t(() => [g(f(l(he)(l(s).timeout, "mm:ss")), 1)]), _: 1 },
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue", "color", "hint", "label"],
                          ),
                          e(
                            re,
                            {
                              modelValue: l(s).downloadInterval,
                              "onUpdate:modelValue": i[15] || (i[15] = (n) => (l(s).downloadInterval = n)),
                              min: 0,
                              max: (l(s).downloadInterval ?? 0) < 600 ? 600 : 1200,
                              step: (l(s).downloadInterval ?? 0) <= 60 ? 1 : 10,
                              hint: l(a)("SetSite.Editor.downloadIntervalHint"),
                              label: l(a)("SetSite.Editor.downloadInterval"),
                              "persistent-hint": "",
                            },
                            {
                              append: t(() => [
                                e(
                                  h,
                                  { variant: "flat", onClick: i[14] || (i[14] = (n) => (l(s).downloadInterval = 0)) },
                                  {
                                    default: t(() => [g(f(l(he)((l(s).downloadInterval ?? 0) * 1e3, "mm:ss")), 1)]),
                                    _: 1,
                                  },
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue", "max", "step", "hint", "label"],
                          ),
                          e(
                            re,
                            {
                              modelValue: l(s).uploadSpeedLimit,
                              "onUpdate:modelValue": i[17] || (i[17] = (n) => (l(s).uploadSpeedLimit = n)),
                              min: 0,
                              max: 1024,
                              step: 1,
                              hint: l(a)("SetSite.editor.uploadSpeedLimitHint"),
                              label: l(a)("SetSite.editor.uploadSpeedLimit"),
                              "persistent-hint": "",
                            },
                            {
                              append: t(() => [
                                e(
                                  h,
                                  { variant: "flat", onClick: i[16] || (i[16] = (n) => (l(s).uploadSpeedLimit = 0)) },
                                  { default: t(() => [g(f(l(s).uploadSpeedLimit ?? 0) + " MiB/s ", 1)]), _: 1 },
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue", "hint", "label"],
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue", "disabled"],
              ),
            ]),
            _: 1,
          },
        )
      );
    },
  }),
  ze = je(Sl, [["__scopeId", "data-v-603f1f05"]]),
  gl = z({
    __name: "AddDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(y) {
      const d = Z(y, "modelValue"),
        { t: a } = Q(),
        S = $(),
        r = I(0),
        k = I(null),
        m = I({}),
        s = I(!1);
      $e("storedSiteUserConfig", m);
      function D() {
        ((r.value = 0), (k.value = null), (m.value = {}));
      }
      const U = I(!1),
        b = Be([]),
        x = P(() => b.value.filter((c) => (U.value && c.isDead) || !c.isDead));
      async function v() {
        const c = await Pe();
        b.value = Object.values(c);
      }
      async function V() {
        (await S.addSite(k.value, m.value), (d.value = !1));
      }
      return (c, u) => (
        C(),
        M(
          oe,
          {
            modelValue: d.value,
            "onUpdate:modelValue": u[8] || (u[8] = (i) => (d.value = i)),
            "max-width": "800",
            scrollable: "",
            onAfterEnter: v,
            onAfterLeave: D,
          },
          {
            default: t(() => [
              e(G, null, {
                default: t(() => [
                  e(
                    X,
                    { class: "pa-0" },
                    {
                      default: t(() => [
                        e(
                          ie,
                          { color: "blue-grey-darken-2" },
                          {
                            default: t(() => [
                              e(ne, null, { default: t(() => [g(f(l(a)("SetSite.add.title")), 1)]), _: 1 }),
                              e(L),
                              e(
                                h,
                                {
                                  title: l(a)("layout.header.wiki"),
                                  href: `${l(Xe)}/wiki/config-site`,
                                  color: "success",
                                  icon: "mdi-help-circle",
                                  rel: "noopener noreferrer nofollow",
                                  target: "_blank",
                                },
                                null,
                                8,
                                ["title", "href"],
                              ),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  e(E),
                  e(se, null, {
                    default: t(() => [
                      e(
                        dl,
                        { modelValue: r.value, "onUpdate:modelValue": u[3] || (u[3] = (i) => (r.value = i)) },
                        {
                          default: t(() => [
                            e(
                              De,
                              { value: 0 },
                              {
                                default: t(() => [
                                  e(
                                    Fe,
                                    {
                                      modelValue: k.value,
                                      "onUpdate:modelValue": u[0] || (u[0] = (i) => (k.value = i)),
                                      "filter-keys": ["raw.name", "raw.urls", "raw.aka"],
                                      items: x.value,
                                      messages: x.value.find((i) => i.id === k.value)?.description ?? "",
                                      multiple: !1,
                                      placeholder: k.value ? "" : l(a)("SetSite.add.selectSitePlaceholder"),
                                      autofocus: "",
                                      "item-title": "name",
                                      "item-value": "id",
                                      "persistent-hint": "",
                                    },
                                    {
                                      selection: t(({ item: { raw: i } }) => [
                                        e(
                                          q,
                                          null,
                                          {
                                            prepend: t(() => [
                                              e(
                                                ae,
                                                { "site-id": i.id, class: "mr-2", "flush-on-no-image": "" },
                                                null,
                                                8,
                                                ["site-id"],
                                              ),
                                            ]),
                                            default: t(() => [
                                              e(
                                                te,
                                                { class: xe({ "text-decoration-line-through": i.isDead }) },
                                                { default: t(() => [g(f(i.name ?? ""), 1)]), _: 2 },
                                                1032,
                                                ["class"],
                                              ),
                                            ]),
                                            _: 2,
                                          },
                                          1024,
                                        ),
                                      ]),
                                      item: t(({ props: i, item: { raw: n } }) => [
                                        e(
                                          q,
                                          Ze(el(i)),
                                          {
                                            prepend: t(() => [
                                              e(ae, { "site-id": n.id, class: "mr-2" }, null, 8, ["site-id"]),
                                            ]),
                                            title: t(() => [
                                              e(
                                                te,
                                                { class: "mb-1" },
                                                {
                                                  default: t(() => [
                                                    j(
                                                      "b",
                                                      { class: xe({ "text-decoration-line-through": n.isDead }) },
                                                      f(n.name ?? ""),
                                                      3,
                                                    ),
                                                    e(
                                                      me,
                                                      {
                                                        color: n.type === "private" ? "primary" : "secondary",
                                                        class: "ml-2",
                                                        label: "",
                                                        size: "x-small",
                                                      },
                                                      {
                                                        default: t(() => [
                                                          g(
                                                            f(
                                                              n.schema ??
                                                                (n.type === "private"
                                                                  ? "AbstractPrivateSite"
                                                                  : "AbstractBittorrentSite"),
                                                            ),
                                                            1,
                                                          ),
                                                        ]),
                                                        _: 2,
                                                      },
                                                      1032,
                                                      ["color"],
                                                    ),
                                                    e(
                                                      me,
                                                      { class: "ml-2", color: "green", label: "", size: "x-small" },
                                                      {
                                                        default: t(() => [g(f(n.version ? "v" + n.version : ""), 1)]),
                                                        _: 2,
                                                      },
                                                      1024,
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1024,
                                              ),
                                            ]),
                                            subtitle: t(() => [
                                              e(
                                                Te,
                                                {
                                                  title: n.description ?? "",
                                                  class: "text-decoration-none text-ellipsis",
                                                  style: { "max-width": "500px" },
                                                },
                                                { default: t(() => [g(f(n.description ?? ""), 1)]), _: 2 },
                                                1032,
                                                ["title"],
                                              ),
                                            ]),
                                            append: t(() => [
                                              e(
                                                Oe,
                                                null,
                                                { default: t(() => [g(f(n.tags?.join(", ") ?? ""), 1)]), _: 2 },
                                                1024,
                                              ),
                                            ]),
                                            _: 2,
                                          },
                                          1040,
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["modelValue", "items", "messages", "placeholder"],
                                  ),
                                ]),
                                _: 1,
                              },
                            ),
                            e(
                              De,
                              { value: 1 },
                              {
                                default: t(() => [
                                  e(
                                    ze,
                                    {
                                      ref: "editor",
                                      modelValue: k.value,
                                      "onUpdate:modelValue": u[1] || (u[1] = (i) => (k.value = i)),
                                      "onUpdate:formValid": u[2] || (u[2] = (i) => (s.value = i)),
                                    },
                                    null,
                                    8,
                                    ["modelValue"],
                                  ),
                                ]),
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
                  }),
                  e(E),
                  e(de, null, {
                    default: t(() => [
                      r.value === 0
                        ? (C(),
                          M(
                            F,
                            {
                              key: 0,
                              modelValue: U.value,
                              "onUpdate:modelValue": u[4] || (u[4] = (i) => (U.value = i)),
                              class: "ml-5",
                              color: "success",
                              density: "compact",
                              "hide-details": "",
                              label: l(a)("SetSite.AddDialog.showDeadSite"),
                            },
                            null,
                            8,
                            ["modelValue", "label"],
                          ))
                        : _("", !0),
                      e(L),
                      e(
                        h,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: u[5] || (u[5] = (i) => (d.value = !1)),
                        },
                        { default: t(() => [g(f(l(a)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      r.value === 1
                        ? (C(),
                          M(
                            h,
                            {
                              key: 1,
                              color: "blue-darken-1",
                              "prepend-icon": "mdi-chevron-left",
                              variant: "text",
                              onClick: u[6] || (u[6] = (i) => r.value--),
                            },
                            { default: t(() => [g(f(l(a)("common.dialog.prev")), 1)]), _: 1 },
                          ))
                        : _("", !0),
                      r.value === 0
                        ? (C(),
                          M(
                            h,
                            {
                              key: 2,
                              disabled: k.value == null,
                              "append-icon": "mdi-chevron-right",
                              color: "blue-darken-1",
                              variant: "text",
                              onClick: u[7] || (u[7] = (i) => r.value++),
                            },
                            { default: t(() => [g(f(l(a)("common.dialog.next")), 1)]), _: 1 },
                            8,
                            ["disabled"],
                          ))
                        : _("", !0),
                      r.value === 1
                        ? (C(),
                          M(
                            h,
                            {
                              key: 3,
                              disabled: !s.value,
                              color: "success",
                              "prepend-icon": "mdi-check-circle-outline",
                              variant: "text",
                              onClick: V,
                            },
                            { default: t(() => [g(f(l(a)("common.dialog.ok")), 1)]), _: 1 },
                            8,
                            ["disabled"],
                          ))
                        : _("", !0),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 1,
              }),
            ]),
            _: 1,
          },
          8,
          ["modelValue"],
        )
      );
    },
  }),
  bl = z({
    __name: "EditDialog",
    props: Ee({ siteId: {} }, { modelValue: { type: Boolean }, modelModifiers: {} }),
    emits: ["update:modelValue"],
    setup(y) {
      const d = Z(y, "modelValue"),
        a = y,
        { t: S } = Q(),
        r = $(),
        k = I(!1),
        m = I({ valid: !1 });
      $e("storedSiteUserConfig", m);
      async function s() {
        (await r.addSite(a.siteId, m.value), (d.value = !1));
      }
      function D() {
        m.value = { valid: !1, ...(r.sites[a.siteId] ?? {}) };
      }
      return (U, b) => (
        C(),
        M(
          oe,
          {
            modelValue: d.value,
            "onUpdate:modelValue": b[4] || (b[4] = (x) => (d.value = x)),
            "max-width": "800",
            scrollable: "",
            onAfterEnter: D,
          },
          {
            default: t(() => [
              e(G, null, {
                default: t(() => [
                  e(
                    X,
                    { class: "pa-0" },
                    {
                      default: t(() => [
                        e(
                          ie,
                          { color: "blue-grey-darken-2" },
                          {
                            append: t(() => [
                              e(
                                h,
                                {
                                  icon: "mdi-close",
                                  title: l(S)("common.dialog.close"),
                                  onClick: b[0] || (b[0] = (x) => (d.value = !1)),
                                },
                                null,
                                8,
                                ["title"],
                              ),
                            ]),
                            default: t(() => [
                              e(ne, null, { default: t(() => [g(f(l(S)("SetSite.edit.title")), 1)]), _: 1 }),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  e(E),
                  e(se, null, {
                    default: t(() => [
                      e(
                        ze,
                        {
                          modelValue: a.siteId,
                          "onUpdate:modelValue": b[1] || (b[1] = (x) => (a.siteId = x)),
                          "onUpdate:formValid": b[2] || (b[2] = (x) => (k.value = x)),
                        },
                        null,
                        8,
                        ["modelValue"],
                      ),
                    ]),
                    _: 1,
                  }),
                  e(E),
                  e(de, null, {
                    default: t(() => [
                      e(L),
                      e(
                        h,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: b[3] || (b[3] = (x) => (d.value = !1)),
                        },
                        { default: t(() => [g(f(l(S)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      e(
                        h,
                        {
                          disabled: !k.value,
                          color: "success",
                          "prepend-icon": "mdi-check-circle-outline",
                          variant: "text",
                          onClick: s,
                        },
                        { default: t(() => [g(f(l(S)("common.dialog.ok")), 1)]), _: 1 },
                        8,
                        ["disabled"],
                      ),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 1,
              }),
            ]),
            _: 1,
          },
          8,
          ["modelValue"],
        )
      );
    },
  }),
  Vl = z({
    __name: "EditSearchEntryList",
    props: { item: {} },
    setup(y) {
      const d = $(),
        a = ll({});
      return (
        Ae(() => {
          for (const [S, r] of Object.entries(y.item.metadata.searchEntry)) {
            let k = !1;
            (typeof y.item.userConfig.merge?.searchEntry?.[S]?.enabled == "boolean"
              ? (k = y.item.userConfig.merge.searchEntry[S].enabled)
              : (k = r.enabled ?? !0),
              (a[S] = k));
          }
        }),
        (S, r) => (
          C(),
          M(fe, null, {
            default: t(() => [
              (C(!0),
              A(
                B,
                null,
                O(
                  y.item.metadata.searchEntry,
                  (k, m) => (
                    C(),
                    M(
                      q,
                      { key: m, value: m },
                      {
                        default: t(() => [
                          e(
                            te,
                            null,
                            {
                              default: t(() => [
                                e(
                                  F,
                                  {
                                    modelValue: a[m],
                                    "onUpdate:modelValue": [
                                      (s) => (a[m] = s),
                                      (s) => l(d).simplePatch("sites", y.item.id, `merge.searchEntry.${m}.enabled`, s),
                                    ],
                                    label: k.name,
                                    class: "mx-3",
                                    color: "success",
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
                          ),
                        ]),
                        _: 2,
                      },
                      1032,
                      ["value"],
                    )
                  ),
                ),
                128,
              )),
            ]),
            _: 1,
          })
        )
      );
    },
  }),
  Cl = { key: 0 },
  kl = ["href"],
  wl = z({
    __name: "OneClickImportDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(y) {
      const d = Z(y, "modelValue"),
        { ref: a, reset: S } = Le(() => ({ isWorking: !1, toWork: [], working: "", success: [], failed: [] })),
        { t: r } = Q(),
        k = Me(),
        m = $(),
        s = Be({}),
        D = P(() =>
          Object.values(s.value)
            .filter((v) => !v.userInputSettingMeta && v.type === "private")
            .map((v) => v.id),
        ),
        U = (v) =>
          P(() => {
            let V = "progress-helper",
              c = "grey",
              u = "";
            return (
              s.value[v]?.userInputSettingMeta
                ? ((V = "progress-close"), (c = "purple"), (u = r("SetSite.oneClickImportDialog.status.manual")))
                : a.value.working === v
                  ? ((V = "progress-wrench"), (c = "blue"), (u = r("SetSite.oneClickImportDialog.status.trying")))
                  : a.value.success.includes(v)
                    ? ((V = "progress-check"), (c = "green"), (u = r("SetSite.oneClickImportDialog.status.success")))
                    : a.value.failed.includes(v)
                      ? ((V = "progress-alert"), (c = "red"), (u = r("SetSite.oneClickImportDialog.status.failed")))
                      : a.value.toWork.includes(v) &&
                        ((V = "progress-pencil"), (c = ""), (u = r("SetSite.oneClickImportDialog.status.selected"))),
              { icon: `mdi-${V}`, color: c, title: u }
            );
          });
      async function b() {
        ((a.value.isWorking = !0), (a.value.failed = []));
        for (const v of a.value.toWork)
          if (!a.value.success.includes(v)) {
            a.value.working = v;
            try {
              let V = !1;
              const c = s.value[v],
                u = await m.getSiteUserConfig(v, !0);
              if (c.type === "public") (await m.addSite(v, u, { reBuildMap: !1 }), (V = !0));
              else
                for (const i of c.urls) {
                  ((u.url = i), await m.addSite(v, u, { reBuildMap: !1 }));
                  const { status: n } = await _e("getSiteSearchResult", { siteId: v });
                  if (n === cl.success) {
                    V = !0;
                    break;
                  }
                }
              V ? a.value.success.push(v) : (a.value.failed.push(v), await m.removeSite(v, { reBuildMap: !1 }));
            } catch {
              a.value.failed.push(v);
            }
          }
        ((a.value.working = ""),
          (a.value.isWorking = !1),
          (a.value.toWork = []),
          await m.buildSiteMapCache(!0),
          k.showSnakebar(r("SetSite.oneClickImportDialog.importComplete", { count: a.value.success.length }), {
            color: "success",
          }));
      }
      async function x() {
        S();
        const v = await Pe();
        s.value = ul(v, (V) => V.isDead !== !0);
      }
      return (v, V) => (
        C(),
        M(
          oe,
          {
            modelValue: d.value,
            "onUpdate:modelValue": V[4] || (V[4] = (c) => (d.value = c)),
            "max-width": "1000",
            scrollable: "",
            onAfterEnter: x,
            persistent: l(a).isWorking,
          },
          {
            default: t(() => [
              e(G, null, {
                default: t(() => [
                  e(
                    X,
                    { class: "pa-0" },
                    {
                      default: t(() => [
                        e(
                          ie,
                          { color: "blue-grey-darken-2" },
                          {
                            append: t(() => [
                              e(
                                h,
                                {
                                  icon: "mdi-close",
                                  title: l(r)("common.dialog.close"),
                                  onClick: V[0] || (V[0] = (c) => (d.value = !1)),
                                  disabled: l(a).isWorking,
                                },
                                null,
                                8,
                                ["title", "disabled"],
                              ),
                            ]),
                            default: t(() => [
                              e(ne, null, {
                                default: t(() => [g(f(l(r)("SetSite.oneClickImportDialog.title")), 1)]),
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
                  e(E),
                  e(se, null, {
                    default: t(() => [
                      e(
                        ce,
                        {
                          class: "mb-2",
                          title: l(r)("SetSite.oneClickImportDialog.alert1"),
                          type: "warning",
                          variant: "tonal",
                        },
                        null,
                        8,
                        ["title"],
                      ),
                      e(
                        ce,
                        { class: "mb-1 py-2", title: l(r)("SetSite.oneClickImportDialog.alert2") },
                        {
                          text: t(() => [
                            g(
                              f(
                                l(r)("SetSite.oneClickImportDialog.stats", {
                                  count: l(a).toWork.length,
                                  success: l(a).success.length,
                                  failed: l(a).failed.length,
                                }),
                              ) + " ",
                              1,
                            ),
                            l(a).isWorking
                              ? (C(),
                                A(
                                  "span",
                                  Cl,
                                  f(l(r)("SetSite.oneClickImportDialog.trying", { name: s.value[l(a).working].name })),
                                  1,
                                ))
                              : _("", !0),
                          ]),
                          append: t(() => [
                            e(
                              rl,
                              {
                                modelValue: l(a).toWork,
                                "onUpdate:modelValue": V[1] || (V[1] = (c) => (l(a).toWork = c)),
                                all: D.value,
                                size: void 0,
                                color: "blue-lighten-1",
                                variant: "tonal",
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
                      l(tl)(s.value) ? (C(), M(ml, { key: 0, type: "image" })) : _("", !0),
                      e(
                        fe,
                        { else: "", class: "overflow-x-hidden overflow-y-hidden px-3 pt-3" },
                        {
                          default: t(() => [
                            e(le, null, {
                              default: t(() => [
                                (C(!0),
                                A(
                                  B,
                                  null,
                                  O(
                                    s.value,
                                    (c) => (
                                      C(),
                                      M(
                                        H,
                                        { key: c.id, cols: "12", md: "4", sm: "6", class: "pa-1" },
                                        {
                                          default: t(() => [
                                            e(
                                              q,
                                              { border: "", class: "bg-grey-lighten-4" },
                                              {
                                                prepend: t(() => [
                                                  e(
                                                    pe,
                                                    {
                                                      modelValue: l(a).toWork,
                                                      "onUpdate:modelValue": V[2] || (V[2] = (u) => (l(a).toWork = u)),
                                                      indeterminate:
                                                        !!c.userInputSettingMeta || l(a).success.includes(c.id),
                                                      "indeterminate-icon": l(a).success.includes(c.id)
                                                        ? "mdi-check"
                                                        : "mdi-close",
                                                      disabled:
                                                        !!c.userInputSettingMeta ||
                                                        l(a).isWorking ||
                                                        l(a).success.includes(c.id),
                                                      value: c.id,
                                                      "hide-details": "",
                                                      multiple: "",
                                                    },
                                                    null,
                                                    8,
                                                    [
                                                      "modelValue",
                                                      "indeterminate",
                                                      "indeterminate-icon",
                                                      "disabled",
                                                      "value",
                                                    ],
                                                  ),
                                                  e(
                                                    ae,
                                                    { "site-id": c.id, class: "mr-2", "flush-on-click": "" },
                                                    null,
                                                    8,
                                                    ["site-id"],
                                                  ),
                                                ]),
                                                title: t(() => [
                                                  e(
                                                    te,
                                                    null,
                                                    { default: t(() => [j("b", null, f(c.name ?? ""), 1)]), _: 2 },
                                                    1024,
                                                  ),
                                                ]),
                                                subtitle: t(() => [
                                                  e(
                                                    me,
                                                    {
                                                      color: c.type === "private" ? "primary" : "secondary",
                                                      label: "",
                                                      size: "x-small",
                                                    },
                                                    {
                                                      default: t(() => [
                                                        g(
                                                          f(
                                                            c.schema ??
                                                              (c.type === "private"
                                                                ? "AbstractPrivateSite"
                                                                : "AbstractBittorrentSite"),
                                                          ),
                                                          1,
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1032,
                                                    ["color"],
                                                  ),
                                                ]),
                                                append: t(() => [
                                                  e(
                                                    Oe,
                                                    null,
                                                    {
                                                      default: t(() => [
                                                        j(
                                                          "a",
                                                          {
                                                            href: c.urls[0],
                                                            target: "_blank",
                                                            rel: "noopener noreferrer nofollow",
                                                          },
                                                          [
                                                            e(
                                                              Y,
                                                              ve({ ref_for: !0 }, U(c.id).value, {
                                                                class: "mr-2",
                                                                size: "x-large",
                                                              }),
                                                              null,
                                                              16,
                                                            ),
                                                          ],
                                                          8,
                                                          kl,
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1024,
                                                  ),
                                                ]),
                                                _: 2,
                                              },
                                              1024,
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
                  e(E),
                  e(de, null, {
                    default: t(() => [
                      e(L),
                      e(
                        h,
                        {
                          disabled: l(a).isWorking,
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: V[3] || (V[3] = (c) => (d.value = !1)),
                        },
                        { default: t(() => [g(f(l(r)("common.dialog.cancel")), 1)]), _: 1 },
                        8,
                        ["disabled"],
                      ),
                      e(
                        h,
                        {
                          disabled: l(a).isWorking,
                          color: "success",
                          "prepend-icon": "mdi-import",
                          variant: "text",
                          onClick: b,
                        },
                        { default: t(() => [g(f(l(r)("common.import")), 1)]), _: 1 },
                        8,
                        ["disabled"],
                      ),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 1,
              }),
            ]),
            _: 1,
          },
          8,
          ["modelValue", "persistent"],
        )
      );
    },
  }),
  yl = z({
    __name: "RebuildMapDialog",
    props: { modelValue: { type: Boolean }, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(y) {
      const d = Z(y, "modelValue"),
        { t: a } = Q(),
        { ref: S, reset: r } = Le(() => ({ rebuildSiteHostMap: !0, rebuildSiteNameMap: !1 }));
      async function k() {
        const D = $();
        (S.value.rebuildSiteHostMap && (await D.buildSiteHostMap()),
          S.value.rebuildSiteNameMap && (await D.buildSiteNameMap()),
          await D.$save(),
          (d.value = !1));
      }
      const m = P(() => Object.values(S.value).some(Boolean));
      function s() {
        r();
      }
      return (D, U) => (
        C(),
        M(
          oe,
          {
            modelValue: d.value,
            "onUpdate:modelValue": U[3] || (U[3] = (b) => (d.value = b)),
            "max-width": "600",
            scrollable: "",
            onAfterEnter: s,
          },
          {
            default: t(() => [
              e(G, null, {
                default: t(() => [
                  e(
                    X,
                    { class: "pa-0" },
                    {
                      default: t(() => [
                        e(
                          ie,
                          { color: "blue-grey-darken-2" },
                          {
                            default: t(() => [
                              e(ne, null, {
                                default: t(() => [g(f(l(a)("SetSite.ReBuildMapDialog.title")), 1)]),
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
                  e(E),
                  e(se, null, {
                    default: t(() => [
                      e(
                        F,
                        {
                          modelValue: l(S).rebuildSiteHostMap,
                          "onUpdate:modelValue": U[0] || (U[0] = (b) => (l(S).rebuildSiteHostMap = b)),
                          label: l(a)("SetSite.ReBuildMapDialog.rebuildSiteHostMap"),
                          color: "success",
                          "hide-details": "",
                        },
                        null,
                        8,
                        ["modelValue", "label"],
                      ),
                      e(
                        F,
                        {
                          modelValue: l(S).rebuildSiteNameMap,
                          "onUpdate:modelValue": U[1] || (U[1] = (b) => (l(S).rebuildSiteNameMap = b)),
                          label: l(a)("SetSite.ReBuildMapDialog.rebuildSiteNameMap"),
                          color: "success",
                          "hide-details": "",
                        },
                        null,
                        8,
                        ["modelValue", "label"],
                      ),
                    ]),
                    _: 1,
                  }),
                  e(E),
                  e(de, null, {
                    default: t(() => [
                      e(L),
                      e(
                        h,
                        {
                          color: "error",
                          "prepend-icon": "mdi-close-circle",
                          variant: "text",
                          onClick: U[2] || (U[2] = (b) => (d.value = !1)),
                        },
                        { default: t(() => [g(f(l(a)("common.dialog.cancel")), 1)]), _: 1 },
                      ),
                      e(
                        h,
                        {
                          disabled: !m.value,
                          color: "success",
                          "prepend-icon": "mdi-import",
                          variant: "text",
                          onClick: k,
                        },
                        { default: t(() => [g(f(l(a)("SetSite.ReBuildMapDialog.doRebuildBtn")), 1)]), _: 1 },
                        8,
                        ["disabled"],
                      ),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 1,
              }),
            ]),
            _: 1,
          },
          8,
          ["modelValue"],
        )
      );
    },
  }),
  Ul = { class: "d-flex" },
  xl = { key: 0 },
  hl = { key: 1 },
  Il = ["href"],
  rt = z({
    __name: "Index",
    setup(y) {
      const { t: d } = Q(),
        a = qe(),
        S = Me(),
        r = $(),
        k = I(!1),
        m = I(!1),
        s = I(!1),
        D = I(!1),
        U = I(!1),
        b = P(() => {
          const T = [
            { title: "№", key: "userConfig.sortIndex", align: "center" },
            { title: d("SetSite.common.name"), key: "name", align: "left", sortable: !1 },
            { title: d("SetSite.common.groups"), key: "groups", align: "left", sortable: !1, minWidth: "8rem" },
            { title: d("SetSite.common.url"), key: "url", align: "start", sortable: !1 },
            { title: d("SetSite.common.isOffline"), key: "userConfig.isOffline", align: "center" },
            { title: d("SetSite.common.allowSearch"), key: "userConfig.allowSearch", align: "center" },
            { title: d("SetSite.common.allowQueryUserInfo"), key: "userConfig.allowQueryUserInfo", align: "center" },
          ];
          return (
            a.contentScript.enabled &&
              a.contentScript.allowExceptionSites &&
              T.push({
                title: d("SetSite.common.allowContentScript"),
                key: "userConfig.allowContentScript",
                align: "center",
              }),
            [...T, { title: d("common.action"), key: "action", sortable: !1 }]
          );
        }),
        x = ["isOffline", "allowSearch", "allowQueryUserInfo"],
        {
          tableWaitFilterRef: v,
          tableFilterRef: V,
          tableFilterFn: c,
          advanceFilterDictRef: u,
          toggleKeywordStateFn: i,
          buildFilterDictFn: n,
          updateTableFilterValueFn: R,
        } = ol({
          parseOptions: { keywords: ["id", ...x.map((T) => `userConfig.${T}`), "userConfig.groups"] },
          titleFields: ["metadata.name", "metadata.urls", "userConfig.merge.name", "userConfig.url"],
          format: { ...Object.fromEntries(x.map((T) => [`userConfig.${T}`, "boolean"])) },
        }),
        W = I([]),
        Se = I("");
      function We(T) {
        ((Se.value = T), (m.value = !0));
      }
      const ge = I([]);
      function be(T) {
        ((ge.value = T), (s.value = !0));
      }
      async function He(T) {
        return await r.removeSite(T);
      }
      const Ve = I(!1);
      async function Ce(T) {
        const p = Array.isArray(T) ? T : [T];
        for (const o of p) await _e("getSiteFavicon", { site: o, flush: !0 });
        S.showSnakebar(d("SetSite.index.flushFaviconFinish"), { color: "success" });
      }
      return (T, p) => (
        C(),
        A(
          B,
          null,
          [
            e(ce, { title: l(d)("route.Settings.SetSite"), type: "info" }, null, 8, ["title"]),
            e(
              G,
              { class: "set-site" },
              {
                default: t(() => [
                  e(X, null, {
                    default: t(() => [
                      e(
                        le,
                        { class: "ma-0" },
                        {
                          default: t(() => [
                            e(
                              K,
                              {
                                text: l(d)("common.btn.add"),
                                color: "success",
                                icon: "mdi-plus",
                                onClick: p[0] || (p[0] = (o) => (k.value = !0)),
                              },
                              null,
                              8,
                              ["text"],
                            ),
                            e(
                              K,
                              {
                                disabled: W.value.length === 0,
                                text: l(d)("common.remove"),
                                color: "error",
                                icon: "mdi-minus",
                                onClick: p[1] || (p[1] = (o) => be(W.value)),
                              },
                              null,
                              8,
                              ["disabled", "text"],
                            ),
                            e(E, { class: "mx-2", inset: "", vertical: "" }),
                            e(
                              K,
                              {
                                color: "info",
                                icon: "mdi-crosshairs-gps",
                                text: l(d)("SetSite.index.oneClickImport"),
                                onClick: p[2] || (p[2] = () => (D.value = !0)),
                              },
                              null,
                              8,
                              ["text"],
                            ),
                            e(E, { class: "mx-2", inset: "", vertical: "" }),
                            e(
                              K,
                              {
                                disabled: W.value.length === 0,
                                loading: Ve.value,
                                text: l(d)("SetSite.index.table.flushFavicon"),
                                color: "indigo",
                                icon: "mdi-face-recognition",
                                onClick: p[3] || (p[3] = () => Ce(W.value)),
                              },
                              null,
                              8,
                              ["disabled", "loading", "text"],
                            ),
                            e(
                              K,
                              {
                                text: l(d)("SetSite.index.reBuildMap"),
                                color: "indigo",
                                icon: "mdi-wrench",
                                onClick: p[4] || (p[4] = (o) => (U.value = !0)),
                              },
                              null,
                              8,
                              ["text"],
                            ),
                            e(L),
                            e(
                              N,
                              {
                                modelValue: l(v),
                                "onUpdate:modelValue": p[9] || (p[9] = (o) => (al(v) ? (v.value = o) : null)),
                                "append-icon": "mdi-magnify",
                                clearable: "",
                                density: "compact",
                                "hide-details": "",
                                label: "Search",
                                "max-width": "500",
                                "single-line": "",
                                "onClick:clear": p[10] || (p[10] = (o) => l(n)("")),
                              },
                              {
                                "prepend-inner": t(() => [
                                  e(
                                    we,
                                    { "min-width": "100" },
                                    {
                                      activator: t(({ props: o }) => [
                                        e(
                                          Y,
                                          ve({ icon: "mdi-filter" }, o, {
                                            variant: "plain",
                                            onClick: p[5] || (p[5] = (w) => l(n)("")),
                                          }),
                                          null,
                                          16,
                                        ),
                                      ]),
                                      default: t(() => [
                                        e(
                                          fe,
                                          { class: "pa-0" },
                                          {
                                            default: t(() => [
                                              (C(),
                                              A(
                                                B,
                                                null,
                                                O(x, (o) =>
                                                  e(
                                                    q,
                                                    { key: o },
                                                    {
                                                      default: t(() => [
                                                        e(
                                                          pe,
                                                          {
                                                            modelValue: l(u)[`userConfig.${o}`].required,
                                                            "onUpdate:modelValue": [
                                                              (w) => (l(u)[`userConfig.${o}`].required = w),
                                                              p[6] || (p[6] = () => l(R)()),
                                                            ],
                                                            label: l(d)(`SetSite.common.${o}`),
                                                            density: "compact",
                                                            "hide-details": "",
                                                            indeterminate: "",
                                                            "true-value": "1",
                                                            onClick: ye((w) => l(i)(`userConfig.${o}`, "1"), ["stop"]),
                                                          },
                                                          null,
                                                          8,
                                                          ["modelValue", "onUpdate:modelValue", "label", "onClick"],
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1024,
                                                  ),
                                                ),
                                                64,
                                              )),
                                              e(E),
                                              e(
                                                Te,
                                                { class: "ma-2" },
                                                { default: t(() => [g(f(l(d)("SetSite.common.groups")), 1)]), _: 1 },
                                              ),
                                              (C(!0),
                                              A(
                                                B,
                                                null,
                                                O(
                                                  l(r).getSitesGroupData,
                                                  (o, w) => (
                                                    C(),
                                                    M(
                                                      q,
                                                      { key: w, value: w, class: "pr-6" },
                                                      {
                                                        default: t(() => [
                                                          e(
                                                            pe,
                                                            {
                                                              modelValue: l(u)["userConfig.groups"].required,
                                                              "onUpdate:modelValue": [
                                                                p[7] ||
                                                                  (p[7] = (ee) =>
                                                                    (l(u)["userConfig.groups"].required = ee)),
                                                                p[8] || (p[8] = () => l(R)()),
                                                              ],
                                                              label: `${w} (${o.length})`,
                                                              value: w,
                                                              density: "compact",
                                                              "hide-details": "",
                                                              indeterminate: "",
                                                              onClick: ye(
                                                                (ee) => l(i)("userConfig.groups", w),
                                                                ["stop"],
                                                              ),
                                                            },
                                                            null,
                                                            8,
                                                            ["modelValue", "label", "value", "onClick"],
                                                          ),
                                                        ]),
                                                        _: 2,
                                                      },
                                                      1032,
                                                      ["value"],
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
                  e(
                    fl,
                    {
                      modelValue: W.value,
                      "onUpdate:modelValue": p[11] || (p[11] = (o) => (W.value = o)),
                      headers: b.value,
                      items: l(vl),
                      "items-per-page": l(a).tableBehavior.SetSite.itemsPerPage,
                      "custom-filter": l(c),
                      "filter-keys": ["id"],
                      search: l(V),
                      "sort-by": l(a).tableBehavior.SetSite.sortBy,
                      class: "table-stripe table-header-no-wrap",
                      "item-value": "id",
                      "multi-sort": l(a).enableTableMultiSort,
                      hover: "",
                      "show-select": "",
                      "onUpdate:itemsPerPage":
                        p[12] || (p[12] = (o) => l(a).updateTableBehavior("SetSite", "itemsPerPage", o)),
                      "onUpdate:sortBy": p[13] || (p[13] = (o) => l(a).updateTableBehavior("SetSite", "sortBy", o)),
                    },
                    {
                      "item.userConfig.sortIndex": t(({ item: o }) => [
                        j("div", Ul, [e(ae, { "site-id": o.id }, null, 8, ["site-id"])]),
                      ]),
                      "item.name": t(({ item: o }) => [
                        j("span", null, [
                          g(f(o.userConfig?.merge?.name ?? o.metadata?.name) + " ", 1),
                          o.metadata.description
                            ? (C(),
                              M(
                                Re,
                                { key: 0, "max-width": "400", activator: "parent" },
                                {
                                  default: t(() => [
                                    typeof o.metadata.description == "string"
                                      ? (C(), A("span", xl, f(o.metadata.description), 1))
                                      : (C(),
                                        A("ul", hl, [
                                          (C(!0),
                                          A(
                                            B,
                                            null,
                                            O(o.metadata.description, (w, ee) => (C(), A("li", { key: ee }, f(w), 1))),
                                            128,
                                          )),
                                        ])),
                                  ]),
                                  _: 2,
                                },
                                1024,
                              ))
                            : _("", !0),
                        ]),
                      ]),
                      "item.groups": t(({ item: o }) => [g(f((o.userConfig.groups ?? []).join(", ")), 1)]),
                      "item.url": t(({ item: o }) => [
                        j(
                          "a",
                          {
                            href: o.userConfig?.url ?? o.metadata?.urls?.[0],
                            class: "text-primary font-weight-medium text-decoration-underline",
                            rel: "noopener noreferrer nofollow",
                            target: "_blank",
                          },
                          [
                            g(f(o.userConfig?.url ?? o.metadata?.urls?.[0]) + " ", 1),
                            e(Y, { icon: "mdi-open-in-new", size: "x-small" }),
                          ],
                          8,
                          Il,
                        ),
                      ]),
                      "item.userConfig.isOffline": t(({ item: o }) => [
                        e(
                          F,
                          {
                            modelValue: o.userConfig.isOffline,
                            "onUpdate:modelValue": [
                              (w) => (o.userConfig.isOffline = w),
                              (w) => l(r).simplePatch("sites", o.id, "isOffline", w),
                            ],
                            disabled: o.metadata.isDead,
                            class: "table-switch-btn",
                            color: "success",
                            "hide-details": "",
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue", "disabled"],
                        ),
                      ]),
                      "item.userConfig.allowSearch": t(({ item: o }) => [
                        e(
                          F,
                          {
                            modelValue: o.userConfig.allowSearch,
                            "onUpdate:modelValue": [
                              (w) => (o.userConfig.allowSearch = w),
                              (w) => l(r).simplePatch("sites", o.id, "allowSearch", w),
                            ],
                            disabled:
                              o.metadata.isDead || o.userConfig.isOffline || !Object.hasOwn(o.metadata, "search"),
                            class: "table-switch-btn",
                            color: "success",
                            "hide-details": "",
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue", "disabled"],
                        ),
                      ]),
                      "item.userConfig.allowQueryUserInfo": t(({ item: o }) => [
                        e(
                          F,
                          {
                            modelValue: o.userConfig.allowQueryUserInfo,
                            "onUpdate:modelValue": [
                              (w) => (o.userConfig.allowQueryUserInfo = w),
                              (w) => l(r).simplePatch("sites", o.id, "allowQueryUserInfo", w),
                            ],
                            disabled:
                              o.metadata.isDead || o.userConfig.isOffline || !Object.hasOwn(o.metadata, "userInfo"),
                            class: "table-switch-btn",
                            color: "success",
                            "hide-details": "",
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue", "disabled"],
                        ),
                      ]),
                      "item.userConfig.allowContentScript": t(({ item: o }) => [
                        e(
                          F,
                          {
                            modelValue: o.userConfig.allowContentScript,
                            "onUpdate:modelValue": [
                              (w) => (o.userConfig.allowContentScript = w),
                              (w) => l(r).simplePatch("sites", o.id, "allowContentScript", w),
                            ],
                            disabled: o.metadata.isDead || o.userConfig.isOffline,
                            class: "table-switch-btn",
                            color: "success",
                            "hide-details": "",
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue", "disabled"],
                        ),
                      ]),
                      "item.action": t(({ item: o }) => [
                        e(
                          Qe,
                          { class: "table-action", density: "compact", variant: "plain" },
                          {
                            default: t(() => [
                              e(
                                h,
                                {
                                  disabled: o.metadata.isDead,
                                  title: l(d)("common.edit"),
                                  color: "info",
                                  icon: "mdi-pencil",
                                  size: "small",
                                  onClick: () => We(o.id),
                                },
                                null,
                                8,
                                ["disabled", "title", "onClick"],
                              ),
                              e(
                                h,
                                {
                                  title: l(d)("SetSite.index.table.searchEntries"),
                                  disabled: o.metadata.isDead || !o.metadata.searchEntry,
                                  class: "v-btn--icon",
                                  size: "small",
                                },
                                {
                                  default: t(() => [
                                    e(Y, { icon: "mdi-magnify" }),
                                    e(
                                      we,
                                      { "close-on-content-click": !1, activator: "parent" },
                                      { default: t(() => [e(Vl, { item: o }, null, 8, ["item"])]), _: 2 },
                                      1024,
                                    ),
                                  ]),
                                  _: 2,
                                },
                                1032,
                                ["title", "disabled"],
                              ),
                              e(
                                h,
                                {
                                  disabled: o.metadata.isDead,
                                  loading: Ve.value,
                                  title: l(d)("SetSite.index.table.flushFavicon"),
                                  color: "indigo",
                                  icon: "mdi-face-recognition",
                                  size: "small",
                                  onClick: () => Ce(o.id),
                                },
                                null,
                                8,
                                ["disabled", "loading", "title", "onClick"],
                              ),
                              e(
                                h,
                                {
                                  title: l(d)("common.remove"),
                                  color: "error",
                                  icon: "mdi-delete",
                                  size: "small",
                                  onClick: () => be([o.id]),
                                },
                                null,
                                8,
                                ["title", "onClick"],
                              ),
                            ]),
                            _: 2,
                          },
                          1024,
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    [
                      "modelValue",
                      "headers",
                      "items",
                      "items-per-page",
                      "custom-filter",
                      "search",
                      "sort-by",
                      "multi-sort",
                    ],
                  ),
                ]),
                _: 1,
              },
            ),
            e(gl, { modelValue: k.value, "onUpdate:modelValue": p[14] || (p[14] = (o) => (k.value = o)) }, null, 8, [
              "modelValue",
            ]),
            e(
              pl,
              {
                modelValue: s.value,
                "onUpdate:modelValue": p[15] || (p[15] = (o) => (s.value = o)),
                "to-delete-ids": ge.value,
                "confirm-delete": He,
              },
              null,
              8,
              ["modelValue", "to-delete-ids"],
            ),
            e(
              bl,
              {
                modelValue: m.value,
                "onUpdate:modelValue": p[16] || (p[16] = (o) => (m.value = o)),
                "site-id": Se.value,
              },
              null,
              8,
              ["modelValue", "site-id"],
            ),
            e(wl, { modelValue: D.value, "onUpdate:modelValue": p[17] || (p[17] = (o) => (D.value = o)) }, null, 8, [
              "modelValue",
            ]),
            e(yl, { modelValue: U.value, "onUpdate:modelValue": p[18] || (p[18] = (o) => (U.value = o)) }, null, 8, [
              "modelValue",
            ]),
          ],
          64,
        )
      );
    },
  });
export { rt as default };
