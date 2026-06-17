import { F as Be } from "../vendor/file-saver/FileSaver.min-BKZqLcYj.js";
import {
  bV as De,
  bN as Ee,
  bz as Pe,
  f as Re,
  b$ as Ae,
  c0 as Me,
  T as N,
  n as w,
  a2 as He,
  A as E,
  o as Ke,
  x as L,
  a3 as Le,
  ao as Oe,
  $ as We,
  a8 as Xe,
  a9 as Ye,
  K as ye,
  c2 as Je,
} from "./src/entries/options/index-DmNe5UVo.js";
import {
  bJ as Ue,
  bC as Qe,
  br as me,
  D as I,
  X as qe,
  c8 as Ge,
  bf as Ze,
  I as v,
  ck as a,
  ce as se,
  bw as j,
  bj as m,
  U as t,
  b5 as et,
  J as k,
  c4 as e,
  L as $,
  F as z,
  bu as B,
  Q as P,
  bS as R,
  aQ as Se,
  H as tt,
  bp as lt,
} from "../vendor/packages/site/index-COeZNva1.js";
import { e as ue, s as Ve, b as Q, g as at } from "./utils-DF6YUpNn.js";
import { N as re } from "./NavButton-jVIhOejA.js";
import { _ as ot } from "./CheckSwitchButton.vue_vue_type_script_setup_true_lang-B5aVIv06.js";
import { u as it } from "./useResetableRef-DOEDeOaU.js";
import { f as xe, r as nt } from "./format-BjF3R_9h.js";
import { a as _, l as st } from "./siteMetadata-DqOuo-u_.js";
import { b as ut } from "../vendor/date-fns/differenceInYears-C2HS2Spv.js";
import { E as rt } from "../vendor/packages/site/types/base-Dy_28wGT.js";
import { V as mt } from "../vendor/vuetify/VSkeletonLoader-YwNzPI56.js";
import { V as we } from "../vendor/vuetify/VAlert-Bz6E3Qui.js";
import { V as q } from "../vendor/vuetify/VSwitch-CFTblx63.js";
import { a as ft, V as Te } from "../vendor/vuetify/VRadioGroup-jSvmgi9c.js";
import { V as dt } from "../vendor/vuetify/VCheckbox-Br_3Vrzn.js";
import "../vendor/es-toolkit/has-CpNzJTaW.js";
import "../vendor/date-fns/format-b1gG6cM7.js";
import "../vendor/date-fns/differenceInWeeks-C069ouL9.js";
import "../vendor/packages/site/utils/level-ChrMpKO_.js";
import "../vendor/es-toolkit/intersection-CiePrUGh.js";
import "../vendor/date-fns/intervalToDuration-DvSvSXE3.js";
import "../vendor/date-fns/normalizeInterval-DC3nt56b.js";
import "../vendor/date-fns/sub-D9RLuzs0.js";
import "../vendor/date-fns/subDays-DlPNbvmn.js";
import "../vendor/packages/site/utils/filesize-D_1hx4u8.js";
import "../vendor/packages/site/utils/datetime-DQxMK7bP.js";
const fe = De(),
  ct = [
    { iconFill: "#C9B037", siteKey: "site", valueKey: "maxValue" },
    { iconFill: "#B4B4B4", siteKey: "subSite", valueKey: "subValue" },
  ],
  ke = [
    { name: "uploads", format: (n) => n },
    { name: "uploaded", format: (n) => ue(n) },
    { name: "downloaded", format: (n) => ue(n) },
    { name: "seeding", format: (n) => n },
    { name: "seedingSize", format: (n) => ue(n) },
    { name: "bonus", format: (n) => Ve(n, " ") },
    { name: "bonusPerHour", format: (n) => Ve(n, " ") },
    { name: "ratio", format: (n) => nt(n) },
  ],
  H = Ue({}),
  gt = I(() => Object.values(H.value));
function te(n) {
  return !!(n && n.name && n.joinTime && n.status === rt.success);
}
function ee(n) {
  const u = H.value[n];
  return te(u) ? (fe.sites[n], (_[n] ?? {}).hasUserInfo || te(u)) : !1;
}
async function pt() {
  const n = {},
    u = await Qe("getExtStorage", "userInfo");
  for (const s in fe.sites) {
    const F = fe.lastUserInfo[s];
    if (te(F)) n[s] = xe(F);
    else {
      const f = u?.[s];
      if (f) {
        let d = null;
        for (const g in f) {
          const i = f[g];
          te(i) && (!d || new Date(g) > new Date(d)) && (d = g);
        }
        d && (n[s] = { ...xe(f[d]), site: s });
      }
    }
  }
  return n;
}
const V = me([]),
  vt = it(
    () => {
      const n = new Date(),
        u = {
          createAt: n,
          title: "这些年走过的路",
          joinTimeInfo: { site: {}, time: 1 / 0, years: "0" },
          siteInfo: [],
          topInfo: {
            uploads: { site: {}, maxValue: 0, subSite: {}, subValue: 0 },
            uploaded: { site: {}, maxValue: 0, subSite: {}, subValue: 0 },
            downloaded: { site: {}, maxValue: 0, subSite: {}, subValue: 0 },
            seeding: { site: {}, maxValue: 0, subSite: {}, subValue: 0 },
            seedingSize: { site: {}, maxValue: 0, subSite: {}, subValue: 0 },
            ratio: { site: {}, maxValue: 0, subSite: {}, subValue: 0 },
            bonus: { site: {}, maxValue: 0, subSite: {}, subValue: 0 },
            bonusPerHour: { site: {}, maxValue: 0, subSite: {}, subValue: 0 },
          },
          totalInfo: {
            sites: 0,
            deadSites: 0,
            offlineSites: 0,
            uploads: 0,
            uploaded: 0,
            downloaded: 0,
            seeding: 0,
            seedingSize: 0,
            bonus: 0,
            bonusPerHour: 0,
            ratio: -1,
          },
        },
        s = {},
        F = [];
      for (let f of gt.value)
        if (V.value.includes(f.site) && ee(f.site) && f.name && f.joinTime) {
          (u.totalInfo.sites++,
            F.push(f),
            _[f.site]?.isDead && u.totalInfo.deadSites++,
            _[f.site]?.isOffline && u.totalInfo.offlineSites++,
            s[f.name] || (s[f.name] = 0),
            s[f.name]++,
            f.joinTime < u.joinTimeInfo.time && ((u.joinTimeInfo.site = f), (u.joinTimeInfo.time = f.joinTime)));
          for (const d of ke) {
            const g = d.name;
            if (f[g] && f[g] > 0) {
              let i = 0;
              try {
                i = parseFloat(f[g]);
              } catch {}
              if (!isFinite(i)) continue;
              ((u.totalInfo[g] += i),
                i > u.topInfo[g].maxValue
                  ? ((u.topInfo[g].subValue = u.topInfo[g].maxValue),
                    (u.topInfo[g].subSite = u.topInfo[g].site),
                    (u.topInfo[g].maxValue = i),
                    (u.topInfo[g].site = f))
                  : i > u.topInfo[g].subValue && ((u.topInfo[g].subValue = i), (u.topInfo[g].subSite = f)));
            }
          }
        }
      return (
        u.totalInfo.downloaded > 0 && (u.totalInfo.ratio = u.totalInfo.uploaded / u.totalInfo.downloaded),
        u.joinTimeInfo.time !== 1 / 0 && (u.joinTimeInfo.years = (ut(n, u.joinTimeInfo.time) / 365).toFixed(2)),
        (u.siteInfo = F.toSorted((f, d) => f.joinTime - d.joinTime)),
        u
      );
    },
    { shallow: !0 },
  ),
  x = (n) => ({ x: 0, y: 0, fontSize: 24, fill: "#fff", ...n }),
  O = (n) => ({ x: 0, y: 0, stroke: "#0000001f", strokeWidth: 2, ...n }),
  ht = (n) => {
    const u = n.size ?? 24,
      s = n.image?.width ?? u,
      F = n.image?.height ?? u;
    return {
      x: 0,
      y: 0,
      scaleX: n.scaleX ?? u / s,
      scaleY: n.scaleY ?? u / F,
      width: n.canvas?.width ?? u,
      height: n.canvas?.height ?? u,
      ...n,
    };
  },
  _e = (n) => x({ fontSize: 32, fontFamily: "Material Design Icons For PTD", ...n }),
  bt = { class: "ml-1" },
  G = 650,
  Z = 70,
  Wt = qe({
    __name: "Index",
    setup(n) {
      const u = "v0.0.6.1740+c969e7b",
        { t: s } = Ee(),
        F = Ae(),
        f = Me(),
        d = Pe(),
        g = De(),
        i = d.userDataTimelineControl,
        W = me(!1),
        { ref: y, reset: Ie } = vt,
        D = lt({ name: !1, title: !1 });
      function X() {
        (Ie(), d.userName == "" && (d.userName = d.getUserNames.perfName), i.title !== "" && (y.value.title = i.title));
      }
      const { width: Fe } = Ge(se("canvasContainer")),
        de = se("canvasStage"),
        ce = se("canvasLayer"),
        le = Ue([]),
        Y = I(() => 10 + (U.value.length + 2) * 30),
        A = I(() => (i.showPerSiteField.siteName ? 24 : 20) + (U.value.length + 1) * 20 + 20),
        ge = I(() => (i.showTimeline ? 95 + A.value * V.value.length : 0)),
        pe = I(() => Z + Y.value + ge.value + 25),
        ae = I(() => Math.min(Fe.value, G) / G),
        S = I(() => ({ width: G, height: pe.value, scaleX: ae.value, scaleY: ae.value })),
        ve = (c) => {
          const o = c.size ?? 24,
            T = [`blur(${i.faviconBlue}px)`],
            h = _[c.site];
          let b = h.faviconElement;
          if ((h.isDead && T.push("grayscale(1)"), c.canvas)) {
            const { width: C = o, height: M = o } = c.canvas,
              J = new OffscreenCanvas(C, M),
              K = J.getContext("2d");
            ((K.fillStyle = c.canvas.fillStyle ?? "#fff"), K.fillRect(0, 0, C, M));
            const ie = (C - o) / 2,
              l = (M - o) / 2;
            (K.drawImage(b, ie, l, o, o), (c.scaleX = 1), (c.scaleY = 1), (b = J));
          }
          return ht({ image: b, filters: T, ...c });
        },
        Ce =
          (c = 24, o = [S.value.width / 2, 0]) =>
          (T) => {
            (T.beginPath(),
              T.arc(o[0], o[1], c, 0, 2 * Math.PI),
              (T.strokeStyle = "#fff"),
              (T.fillStyle = "#fff"),
              T.stroke(),
              T.fill());
          },
        he = I(() => y.value.siteInfo.filter((c) => V.value.includes(c.site))),
        U = I(() => {
          const c = [];
          for (const o of ke) i.showField[o.name] && c.push(o);
          return c;
        }),
        Ne = (c) => I(() => (i.dateFormat === "time_added" ? Q(c, "yyyy-MM-dd") : at(c))),
        oe = me([]);
      function $e() {
        ye.autoDrawEnabled = !1;
        for (const c of oe.value) c.getNode()?.cache();
        (ce.value?.getNode()?.batchDraw(), (ye.autoDrawEnabled = !0));
      }
      Ze(async () => {
        ((W.value = !0),
          await st(Object.keys(g.sites)),
          (H.value = await pt()),
          (le.value = Object.keys(H.value).filter((o) => ee(o))));
        const { sites: c = [] } = F.query ?? {};
        (c.length > 0
          ? (V.value = c)
          : (d.userDataTimelineControl.selectedSites ?? []).length > 0
            ? (V.value = d.userDataTimelineControl.selectedSites)
            : (V.value = le.value),
          X(),
          (W.value = !1),
          console.debug(H));
      });
      function ze() {
        de.value.getStage().toDataURL({
          mimeType: "image/png",
          pixelRatio: 3,
          callback: (o) => {
            Be.saveAs(
              o,
              s("UserDataTimeline.exportFilename", { name: d.userName, date: Q(y.value.createAt) }) + ".png",
            );
          },
        });
      }
      function je() {
        ((d.userDataTimelineControl.selectedSites = V.value),
          d.$save(),
          Je().showSnakebar(s("common.saveSuccess"), { color: "success" }));
      }
      return (c, o) => {
        const T = j("vk-rect"),
          h = j("vk-text"),
          b = j("vk-group"),
          C = j("vk-line"),
          M = j("vk-image"),
          J = j("vk-layer"),
          K = j("vk-stage"),
          ie = j("v-color-input");
        return (
          m(),
          v(Re, null, {
            default: a(() => [
              t(
                N,
                { class: "pa-2", justify: "start" },
                {
                  default: a(() => [
                    t(
                      w,
                      {
                        ref: "canvasContainer",
                        style: et({ "max-width": `${G}px`, height: `${S.value.height * ae.value}px` }),
                        class: "mb-3 pa-0 mr-3",
                        cols: "12",
                      },
                      {
                        default: a(() => [
                          W.value
                            ? (m(),
                              v(mt, { key: 0, "min-height": pe.value, type: "image@20" }, null, 8, ["min-height"]))
                            : k("", !0),
                          t(
                            K,
                            { ref_key: "canvasStage", ref: de, config: S.value },
                            {
                              default: a(() => [
                                t(
                                  J,
                                  { ref_key: "canvasLayer", ref: ce },
                                  {
                                    default: a(() => [
                                      t(
                                        T,
                                        {
                                          config: {
                                            fill: e(i).backgroundColor,
                                            x: 0,
                                            y: 0,
                                            width: S.value.width,
                                            height: S.value.height,
                                          },
                                        },
                                        null,
                                        8,
                                        ["config"],
                                      ),
                                      t(
                                        b,
                                        { config: { x: 0, y: 0 } },
                                        {
                                          default: a(() => [
                                            t(h, { config: e(_e)({ x: 20, y: 20, text: "󰀉" }) }, null, 8, ["config"]),
                                            t(
                                              h,
                                              { config: e(x)({ x: 65, y: 26, text: e(d).userName, fontSize: 26 }) },
                                              null,
                                              8,
                                              ["config"],
                                            ),
                                            t(
                                              h,
                                              {
                                                config: e(x)({
                                                  y: 20,
                                                  text: e(Q)(e(y).createAt),
                                                  fontSize: 12,
                                                  fill: "#9E9E9E",
                                                  width: S.value.width - 20,
                                                  align: "right",
                                                }),
                                              },
                                              null,
                                              8,
                                              ["config"],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                      ),
                                      t(
                                        b,
                                        { config: { x: 20, y: Z } },
                                        {
                                          default: a(() => [
                                            t(
                                              b,
                                              { config: { x: 0, y: 0 } },
                                              {
                                                default: a(() => [
                                                  t(
                                                    h,
                                                    {
                                                      config: e(x)({
                                                        y: 0,
                                                        text: `${e(s)("UserDataTimeline.total")}${e(s)("UserDataTimeline.field.site")}: ${e(y).totalInfo.sites}`,
                                                      }),
                                                    },
                                                    null,
                                                    8,
                                                    ["config"],
                                                  ),
                                                  e(y).totalInfo.deadSites > 0
                                                    ? (m(),
                                                      v(
                                                        h,
                                                        {
                                                          key: 0,
                                                          config: e(x)({
                                                            x: 160,
                                                            y: 0,
                                                            text: `󰖛: ${e(y).totalInfo.deadSites}`,
                                                            fontFamily: "Material Design Icons For PTD",
                                                            fill: "#9E9E9E",
                                                          }),
                                                        },
                                                        null,
                                                        8,
                                                        ["config"],
                                                      ))
                                                    : k("", !0),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                            (m(!0),
                                            $(
                                              z,
                                              null,
                                              B(
                                                U.value,
                                                (l, r) => (
                                                  m(),
                                                  v(
                                                    h,
                                                    {
                                                      key: l.name,
                                                      config: e(x)({
                                                        y: 30 * (r + 1),
                                                        text: `${e(s)("UserDataTimeline.total")}${e(s)("UserDataTimeline.field." + l.name)}: ${l.format(e(y).totalInfo[l.name])}`,
                                                      }),
                                                    },
                                                    null,
                                                    8,
                                                    ["config"],
                                                  )
                                                ),
                                              ),
                                              128,
                                            )),
                                            t(
                                              h,
                                              {
                                                config: e(x)({
                                                  y: 30 * (U.value.length + 1),
                                                  text: e(s)("UserDataTimeline.ptAge", {
                                                    years: e(y).joinTimeInfo.years,
                                                  }),
                                                }),
                                              },
                                              null,
                                              8,
                                              ["config"],
                                            ),
                                            e(i).showTop
                                              ? (m(),
                                                v(
                                                  b,
                                                  { key: 0, config: { x: 280, y: 0 } },
                                                  {
                                                    default: a(() => [
                                                      t(
                                                        C,
                                                        { config: e(O)({ points: [0, 5, 0, Y.value - 15] }) },
                                                        null,
                                                        8,
                                                        ["config"],
                                                      ),
                                                      (m(!0),
                                                      $(
                                                        z,
                                                        null,
                                                        B(
                                                          e(ct),
                                                          (l, r) => (
                                                            m(),
                                                            v(
                                                              b,
                                                              { key: l.iconFill, config: { x: 20 + r * 170, y: 0 } },
                                                              {
                                                                default: a(() => [
                                                                  t(
                                                                    h,
                                                                    {
                                                                      config: e(_e)({
                                                                        y: 0,
                                                                        fill: l.iconFill,
                                                                        fontSize: 24,
                                                                        text: "󰔸",
                                                                      }),
                                                                    },
                                                                    null,
                                                                    8,
                                                                    ["config"],
                                                                  ),
                                                                  (m(!0),
                                                                  $(
                                                                    z,
                                                                    null,
                                                                    B(
                                                                      U.value,
                                                                      (p, ne) => (
                                                                        m(),
                                                                        $(
                                                                          z,
                                                                          { key: p.name },
                                                                          [
                                                                            e(y).topInfo[p.name][l.valueKey] > 0
                                                                              ? (m(),
                                                                                v(
                                                                                  b,
                                                                                  {
                                                                                    key: 0,
                                                                                    config: { x: 0, y: 30 * (ne + 1) },
                                                                                  },
                                                                                  {
                                                                                    default: a(() => [
                                                                                      t(
                                                                                        M,
                                                                                        {
                                                                                          ref_for: !0,
                                                                                          ref: (be) => {
                                                                                            (oe.value.push(be),
                                                                                              be?.getNode().cache());
                                                                                          },
                                                                                          config: ve({
                                                                                            site: e(y).topInfo[p.name][
                                                                                              l.siteKey
                                                                                            ].site,
                                                                                            size: 20,
                                                                                            canvas: {
                                                                                              fillStyle:
                                                                                                e(i).backgroundColor,
                                                                                            },
                                                                                          }),
                                                                                        },
                                                                                        null,
                                                                                        8,
                                                                                        ["config"],
                                                                                      ),
                                                                                      e(y).topInfo[p.name][l.valueKey] >
                                                                                      0
                                                                                        ? (m(),
                                                                                          v(
                                                                                            h,
                                                                                            {
                                                                                              key: 0,
                                                                                              config: e(x)({
                                                                                                x: 30,
                                                                                                text: p.format(
                                                                                                  e(y).topInfo[p.name][
                                                                                                    l.valueKey
                                                                                                  ],
                                                                                                ),
                                                                                              }),
                                                                                            },
                                                                                            null,
                                                                                            8,
                                                                                            ["config"],
                                                                                          ))
                                                                                        : k("", !0),
                                                                                    ]),
                                                                                    _: 2,
                                                                                  },
                                                                                  1032,
                                                                                  ["config"],
                                                                                ))
                                                                              : k("", !0),
                                                                          ],
                                                                          64,
                                                                        )
                                                                      ),
                                                                    ),
                                                                    128,
                                                                  )),
                                                                ]),
                                                                _: 2,
                                                              },
                                                              1032,
                                                              ["config"],
                                                            )
                                                          ),
                                                        ),
                                                        128,
                                                      )),
                                                    ]),
                                                    _: 1,
                                                  },
                                                ))
                                              : k("", !0),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["config"],
                                      ),
                                      e(i).showTimeline
                                        ? (m(),
                                          v(
                                            b,
                                            { key: 0, config: { x: 0, y: Z + Y.value } },
                                            {
                                              default: a(() => [
                                                t(C, { config: e(O)({ points: [20, 0, 630, 0] }) }, null, 8, [
                                                  "config",
                                                ]),
                                                t(
                                                  h,
                                                  {
                                                    config: e(x)({
                                                      y: 15,
                                                      text: `... ${e(y).title} ...`,
                                                      align: "center",
                                                      fontStyle: "bold",
                                                      width: S.value.width,
                                                    }),
                                                  },
                                                  null,
                                                  8,
                                                  ["config"],
                                                ),
                                                t(
                                                  b,
                                                  { config: { x: 0, y: 40 } },
                                                  {
                                                    default: a(() => [
                                                      t(
                                                        C,
                                                        {
                                                          config: e(O)({
                                                            x: S.value.width / 2,
                                                            y: 0,
                                                            points: [0, 10, 0, e(V).length * A.value + 10],
                                                          }),
                                                        },
                                                        null,
                                                        8,
                                                        ["config"],
                                                      ),
                                                      (m(!0),
                                                      $(
                                                        z,
                                                        null,
                                                        B(
                                                          he.value,
                                                          (l, r) => (
                                                            m(),
                                                            v(
                                                              b,
                                                              { key: l.site, config: { x: 0, y: r * A.value } },
                                                              {
                                                                default: a(() => [
                                                                  t(
                                                                    b,
                                                                    { config: { y: A.value / 2, clipFunc: Ce(24) } },
                                                                    {
                                                                      default: a(() => [
                                                                        t(
                                                                          M,
                                                                          {
                                                                            ref_for: !0,
                                                                            ref: (p) => {
                                                                              (oe.value.push(p), p?.getNode().cache());
                                                                            },
                                                                            config: ve({
                                                                              site: l.site,
                                                                              size: 38,
                                                                              x: S.value.width / 2 - 24,
                                                                              y: -24,
                                                                              canvas: { width: 48, height: 48 },
                                                                            }),
                                                                          },
                                                                          null,
                                                                          8,
                                                                          ["config"],
                                                                        ),
                                                                      ]),
                                                                      _: 2,
                                                                    },
                                                                    1032,
                                                                    ["config"],
                                                                  ),
                                                                  t(
                                                                    b,
                                                                    {
                                                                      config: {
                                                                        x: r % 2 == 0 ? 30 : S.value.width / 2 + 60,
                                                                        y: A.value / 2 - 10 - U.value.length * 10,
                                                                      },
                                                                    },
                                                                    {
                                                                      default: a(() => [
                                                                        e(i).showPerSiteField.siteName
                                                                          ? (m(),
                                                                            v(
                                                                              h,
                                                                              {
                                                                                key: 0,
                                                                                config: e(x)({
                                                                                  y: 0,
                                                                                  text: `${e(_)[l.site]?.isDead ? "󰖛" : ""}${e(_)[l.site].siteName}`,
                                                                                  fill: e(_)[l.site]?.isDead
                                                                                    ? "#9E9E9E"
                                                                                    : "#fff",
                                                                                  fontFamily: e(_)[l.site]?.isDead
                                                                                    ? "Material Design Icons For PTD"
                                                                                    : void 0,
                                                                                  fontStyle: "bold",
                                                                                }),
                                                                              },
                                                                              null,
                                                                              8,
                                                                              ["config"],
                                                                            ))
                                                                          : k("", !0),
                                                                        t(
                                                                          b,
                                                                          {
                                                                            config: {
                                                                              x: 0,
                                                                              y: e(i).showPerSiteField.siteName
                                                                                ? 10
                                                                                : 0,
                                                                            },
                                                                          },
                                                                          {
                                                                            default: a(() => [
                                                                              (m(!0),
                                                                              $(
                                                                                z,
                                                                                null,
                                                                                B(
                                                                                  U.value,
                                                                                  (p, ne) => (
                                                                                    m(),
                                                                                    v(
                                                                                      h,
                                                                                      {
                                                                                        key: p.name,
                                                                                        config: e(x)({
                                                                                          y: 20 * (ne + 1),
                                                                                          text: `${e(s)("UserDataTimeline.field." + p.name)}: ${p.format(l[p.name] ?? 0)}`,
                                                                                          fontSize: 16,
                                                                                        }),
                                                                                      },
                                                                                      null,
                                                                                      8,
                                                                                      ["config"],
                                                                                    )
                                                                                  ),
                                                                                ),
                                                                                128,
                                                                              )),
                                                                              r != he.value.length - 1 &&
                                                                              (e(i).showPerSiteField.siteName ||
                                                                                U.value.length > 0)
                                                                                ? (m(),
                                                                                  v(
                                                                                    C,
                                                                                    {
                                                                                      key: 0,
                                                                                      config: e(O)({
                                                                                        points: [
                                                                                          0,
                                                                                          (U.value.length + 1.5) * 20,
                                                                                          S.value.width / 2 - 80,
                                                                                          (U.value.length + 1.5) * 20,
                                                                                        ],
                                                                                      }),
                                                                                    },
                                                                                    null,
                                                                                    8,
                                                                                    ["config"],
                                                                                  ))
                                                                                : k("", !0),
                                                                            ]),
                                                                            _: 2,
                                                                          },
                                                                          1032,
                                                                          ["config"],
                                                                        ),
                                                                      ]),
                                                                      _: 2,
                                                                    },
                                                                    1032,
                                                                    ["config"],
                                                                  ),
                                                                  t(
                                                                    b,
                                                                    {
                                                                      config: {
                                                                        x: r % 2 == 0 ? S.value.width / 2 + 60 : 30,
                                                                        y: A.value / 2 - 20,
                                                                      },
                                                                    },
                                                                    {
                                                                      default: a(() => [
                                                                        t(
                                                                          h,
                                                                          {
                                                                            config: e(x)({
                                                                              y: 0,
                                                                              text: `${Ne(l.joinTime).value}`,
                                                                              fontStyle: "bold",
                                                                            }),
                                                                          },
                                                                          null,
                                                                          8,
                                                                          ["config"],
                                                                        ),
                                                                        t(
                                                                          h,
                                                                          {
                                                                            config: e(x)({
                                                                              y: 28,
                                                                              width: S.value.width / 2 - 80,
                                                                              wrap: "char",
                                                                              lineHeight: 1.25,
                                                                              text: [
                                                                                e(i).showPerSiteField.name
                                                                                  ? l.name
                                                                                  : "",
                                                                                e(i).showPerSiteField.level
                                                                                  ? `<${l.levelName}>`
                                                                                  : "",
                                                                                e(i).showPerSiteField.uid &&
                                                                                l.id &&
                                                                                l.id !== "0" &&
                                                                                l.id !== 0
                                                                                  ? `<${l.id}>`
                                                                                  : "",
                                                                              ]
                                                                                .filter(Boolean)
                                                                                .join(" "),
                                                                              fontSize: 16,
                                                                            }),
                                                                          },
                                                                          null,
                                                                          8,
                                                                          ["config"],
                                                                        ),
                                                                      ]),
                                                                      _: 2,
                                                                    },
                                                                    1032,
                                                                    ["config"],
                                                                  ),
                                                                ]),
                                                                _: 2,
                                                              },
                                                              1032,
                                                              ["config"],
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
                                            8,
                                            ["config"],
                                          ))
                                        : k("", !0),
                                      t(
                                        b,
                                        { config: { x: 0, y: Z + Y.value + ge.value } },
                                        {
                                          default: a(() => [
                                            t(C, { config: e(O)({ points: [20, -10, 630, -10] }) }, null, 8, [
                                              "config",
                                            ]),
                                            t(
                                              h,
                                              {
                                                config: e(x)({
                                                  width: S.value.width - 20,
                                                  align: "right",
                                                  text:
                                                    "Created By PT-Depiler (" + e(u) + ") at " + e(Q)(e(y).createAt),
                                                  fontSize: 12,
                                                  fill: "#b5b5b5",
                                                }),
                                              },
                                              null,
                                              8,
                                              ["config"],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["config"],
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                  512,
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["config"],
                          ),
                        ]),
                        _: 1,
                      },
                      8,
                      ["style"],
                    ),
                    t(
                      w,
                      { cols: "12", sm: "" },
                      {
                        default: a(() => [
                          t(
                            N,
                            { class: "flex-nowrap mb-0" },
                            {
                              default: a(() => [
                                t(
                                  w,
                                  { class: "d-flex" },
                                  {
                                    default: a(() => [
                                      t(
                                        re,
                                        {
                                          color: "grey",
                                          icon: "mdi-arrow-left",
                                          text: e(s)("common.back"),
                                          onClick: o[0] || (o[0] = () => e(f).back()),
                                        },
                                        null,
                                        8,
                                        ["text"],
                                      ),
                                      t(He),
                                      t(
                                        re,
                                        {
                                          color: "info",
                                          icon: "mdi-file-export-outline",
                                          text: e(s)("common.exportImage"),
                                          onClick: ze,
                                        },
                                        null,
                                        8,
                                        ["text"],
                                      ),
                                      t(
                                        re,
                                        {
                                          color: "green",
                                          icon: "mdi-content-save",
                                          text: e(s)("common.saveSettings"),
                                          onClick: je,
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
                          t(
                            we,
                            { title: e(s)("UserDataTimeline.controls.styleSettings"), type: "info", class: "mb-2" },
                            null,
                            8,
                            ["title"],
                          ),
                          t(
                            E,
                            { class: "my-2" },
                            { default: a(() => [P(R(e(s)("UserDataTimeline.controls.usernameAndTitle")), 1)]), _: 1 },
                          ),
                          t(N, null, {
                            default: a(() => [
                              t(
                                w,
                                { cols: "12", sm: "" },
                                {
                                  default: a(() => [
                                    t(
                                      Ke,
                                      {
                                        modelValue: e(d).userName,
                                        "onUpdate:modelValue": o[2] || (o[2] = (l) => (e(d).userName = l)),
                                        readonly: !D.name,
                                        "append-inner-icon": "mdi-history",
                                        items: Object.keys(e(d).getUserNames.names),
                                        "hide-details": "",
                                        label: e(s)("common.username"),
                                        "onClick:appendInner":
                                          o[3] || (o[3] = () => (e(d).userName = e(d).getUserNames.perfName)),
                                      },
                                      {
                                        prepend: a(() => [
                                          t(
                                            L,
                                            {
                                              color: D.name ? "success" : "",
                                              icon: D.name ? "mdi-lock-open" : "mdi-lock",
                                              onClick: o[1] || (o[1] = (l) => (D.name = !D.name)),
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
                              t(
                                w,
                                { cols: "12", sm: "" },
                                {
                                  default: a(() => [
                                    t(
                                      Le,
                                      {
                                        modelValue: e(y).title,
                                        "onUpdate:modelValue": [
                                          o[5] || (o[5] = (l) => (e(y).title = l)),
                                          o[6] || (o[6] = (l) => (e(i).title = l)),
                                        ],
                                        disabled: !e(i).showTimeline,
                                        readonly: !D.title,
                                        "append-inner-icon": "mdi-history",
                                        "hide-details": "",
                                        label: e(s)("UserDataTimeline.controls.timelineTitle"),
                                        "onClick:appendInner":
                                          o[7] ||
                                          (o[7] = () => {
                                            ((e(i).title = ""), X());
                                          }),
                                      },
                                      {
                                        prepend: a(() => [
                                          t(
                                            L,
                                            {
                                              color: D.title ? "success" : "",
                                              icon: D.title ? "mdi-lock-open" : "mdi-lock",
                                              onClick: o[4] || (o[4] = (l) => (D.title = !D.title)),
                                            },
                                            null,
                                            8,
                                            ["color", "icon"],
                                          ),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["modelValue", "disabled", "readonly", "label"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          }),
                          t(
                            E,
                            { class: "my-2" },
                            { default: a(() => [P(R(e(s)("UserDataTimeline.controls.components")), 1)]), _: 1 },
                          ),
                          t(
                            q,
                            {
                              modelValue: e(i).showTop,
                              "onUpdate:modelValue": o[8] || (o[8] = (l) => (e(i).showTop = l)),
                              color: "success",
                              "hide-details": "",
                              label: e(s)("UserDataTimeline.controls.showTopSites"),
                            },
                            null,
                            8,
                            ["modelValue", "label"],
                          ),
                          t(
                            q,
                            {
                              modelValue: e(i).showTimeline,
                              "onUpdate:modelValue": o[9] || (o[9] = (l) => (e(i).showTimeline = l)),
                              color: "success",
                              "hide-details": "",
                              label: e(s)("UserDataTimeline.controls.showTimeline"),
                            },
                            null,
                            8,
                            ["modelValue", "label"],
                          ),
                          t(
                            ie,
                            {
                              modelValue: e(i).backgroundColor,
                              "onUpdate:modelValue": o[11] || (o[11] = (l) => (e(i).backgroundColor = l)),
                              mode: "hex",
                              "color-pip": "",
                              "hide-actions": "",
                              "hide-details": "",
                              label: e(s)("UserDataTimeline.controls.customBgColor"),
                            },
                            {
                              "append-inner": a(() => [
                                t(L, {
                                  icon: "mdi-backup-restore",
                                  onClick: o[10] || (o[10] = (l) => (e(i).backgroundColor = e(Oe))),
                                }),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue", "label"],
                          ),
                          t(
                            E,
                            { class: "my-2" },
                            { default: a(() => [P(R(e(s)("UserDataTimeline.controls.siteDisplay")), 1)]), _: 1 },
                          ),
                          t(N, null, {
                            default: a(() => [
                              t(
                                w,
                                { cols: "10" },
                                {
                                  default: a(() => [
                                    t(
                                      We,
                                      {
                                        modelValue: e(i).faviconBlue,
                                        "onUpdate:modelValue": [o[12] || (o[12] = (l) => (e(i).faviconBlue = l)), $e],
                                        max: 8,
                                        min: 0,
                                        step: 1,
                                        "thumb-color": e(i).faviconBlue > 4 ? "red" : "",
                                        class: "pr-5",
                                        "hide-details": "",
                                        label: e(s)("UserDataTimeline.controls.faviconBlur"),
                                        "thumb-label": "",
                                      },
                                      null,
                                      8,
                                      ["modelValue", "thumb-color", "label"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          }),
                          t(N, null, {
                            default: a(() => [
                              t(
                                w,
                                { class: "ml-2", "align-self": "center" },
                                {
                                  default: a(() => [
                                    t(E, null, {
                                      default: a(() => [P(R(e(s)("UserDataTimeline.controls.displayContent")), 1)]),
                                      _: 1,
                                    }),
                                  ]),
                                  _: 1,
                                },
                              ),
                              t(
                                w,
                                { cols: "12", sm: "10" },
                                {
                                  default: a(() => [
                                    t(
                                      E,
                                      { class: "my-2" },
                                      {
                                        default: a(() => [P(R(e(s)("UserDataTimeline.controls.statsSection")), 1)]),
                                        _: 1,
                                      },
                                    ),
                                    t(
                                      N,
                                      { class: "pl-5" },
                                      {
                                        default: a(() => [
                                          (m(!0),
                                          $(
                                            z,
                                            null,
                                            B(
                                              e(i).showField,
                                              (l, r) => (
                                                m(),
                                                v(
                                                  w,
                                                  { class: "pa-0", cols: "6", sm: "4", key: r },
                                                  {
                                                    default: a(() => [
                                                      t(
                                                        q,
                                                        {
                                                          modelValue: e(i).showField[r],
                                                          "onUpdate:modelValue": (p) => (e(i).showField[r] = p),
                                                          label: e(s)("UserDataTimeline.field." + r),
                                                          color: "success",
                                                          "hide-details": "",
                                                          density: "compact",
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
                                      },
                                    ),
                                    t(
                                      E,
                                      { class: "my-2" },
                                      {
                                        default: a(() => [P(R(e(s)("UserDataTimeline.controls.timelineSection")), 1)]),
                                        _: 1,
                                      },
                                    ),
                                    t(
                                      N,
                                      { class: "pl-5" },
                                      {
                                        default: a(() => [
                                          (m(!0),
                                          $(
                                            z,
                                            null,
                                            B(
                                              e(i).showPerSiteField,
                                              (l, r) => (
                                                m(),
                                                v(
                                                  w,
                                                  { key: r, class: "pa-0", cols: "6", sm: "4" },
                                                  {
                                                    default: a(() => [
                                                      (m(),
                                                      v(
                                                        q,
                                                        {
                                                          key: r,
                                                          modelValue: e(i).showPerSiteField[r],
                                                          "onUpdate:modelValue": (p) => (e(i).showPerSiteField[r] = p),
                                                          label: e(s)("UserDataTimeline.field." + r),
                                                          color: "success",
                                                          density: "compact",
                                                          "hide-details": "",
                                                        },
                                                        null,
                                                        8,
                                                        ["modelValue", "onUpdate:modelValue", "label"],
                                                      )),
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
                                },
                              ),
                            ]),
                            _: 1,
                          }),
                          t(N, null, {
                            default: a(() => [
                              t(
                                w,
                                { class: "ml-2", "align-self": "center" },
                                {
                                  default: a(() => [
                                    t(E, null, {
                                      default: a(() => [P(R(e(s)("UserDataTimeline.controls.timeDisplay")), 1)]),
                                      _: 1,
                                    }),
                                  ]),
                                  _: 1,
                                },
                              ),
                              t(
                                w,
                                { cols: "12", sm: "10" },
                                {
                                  default: a(() => [
                                    t(
                                      ft,
                                      {
                                        inline: "",
                                        "hide-details": "",
                                        modelValue: e(i).dateFormat,
                                        "onUpdate:modelValue": o[13] || (o[13] = (l) => (e(i).dateFormat = l)),
                                      },
                                      {
                                        default: a(() => [
                                          t(
                                            Te,
                                            { label: e(s)("UserDataTimeline.controls.timeAdded"), value: "time_added" },
                                            null,
                                            8,
                                            ["label"],
                                          ),
                                          t(
                                            Te,
                                            { label: e(s)("UserDataTimeline.controls.timeAlive"), value: "time_alive" },
                                            null,
                                            8,
                                            ["label"],
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
                          t(
                            we,
                            {
                              class: "mt-4 mb-2",
                              title: e(s)("UserDataTimeline.controls.displaySiteSettings"),
                              type: "info",
                            },
                            {
                              append: a(() => [
                                t(
                                  ot,
                                  {
                                    modelValue: e(V),
                                    "onUpdate:modelValue": [
                                      o[14] || (o[14] = (l) => (Se(V) ? (V.value = l) : null)),
                                      X,
                                    ],
                                    all: le.value,
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
                          t(
                            N,
                            { class: "my-2" },
                            {
                              default: a(() => [
                                (m(!0),
                                $(
                                  z,
                                  null,
                                  B(
                                    e(H),
                                    (l, r) => (
                                      m(),
                                      v(
                                        w,
                                        { key: r, class: "py-0", cols: "6", sm: "3" },
                                        {
                                          default: a(() => [
                                            t(
                                              dt,
                                              {
                                                modelValue: e(V),
                                                "onUpdate:modelValue": [
                                                  o[15] || (o[15] = (p) => (Se(V) ? (V.value = p) : null)),
                                                  X,
                                                ],
                                                disabled: !e(ee)(r),
                                                indeterminate: !e(ee)(r),
                                                value: r,
                                                density: "compact",
                                                "hide-details": "",
                                                "indeterminate-icon": "mdi-close",
                                                multiple: "",
                                              },
                                              {
                                                label: a(() => [
                                                  t(Xe, { "site-id": r, size: 16 }, null, 8, ["site-id"]),
                                                  tt("span", bt, [
                                                    t(Ye, { "site-id": r, class: "", tag: "span" }, null, 8, [
                                                      "site-id",
                                                    ]),
                                                    e(_)[r]?.isDead
                                                      ? (m(),
                                                        v(L, {
                                                          key: 0,
                                                          class: "ml-1",
                                                          color: "blue-grey-darken-1",
                                                          icon: "mdi-weather-sunset-down",
                                                          size: "small",
                                                        }))
                                                      : k("", !0),
                                                    e(_)[r]?.isOffline && !e(_)[r]?.isDead
                                                      ? (m(),
                                                        v(L, {
                                                          key: 1,
                                                          class: "ml-1",
                                                          color: "blue-grey-darken-1",
                                                          icon: "mdi-signal-off",
                                                          size: "small",
                                                        }))
                                                      : k("", !0),
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
                      },
                    ),
                  ]),
                  _: 1,
                },
              ),
            ]),
            _: 1,
          })
        );
      };
    },
  });
export { Wt as default };
