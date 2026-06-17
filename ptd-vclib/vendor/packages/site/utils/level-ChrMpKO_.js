import { i as g } from "../../../es-toolkit/intersection-CiePrUGh.js";
import { t as E, i as N } from "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import { aF as k, aE as T, bD as m } from "../index-COeZNva1.js";
import { p as b } from "./filesize-D_1hx4u8.js";
import { c as v } from "./datetime-DQxMK7bP.js";
function z(a) {
  return typeof a == "string" || a instanceof String;
}
function A(a, n, t, s) {
  if (a == null) return !1;
  if ((t ? (t = E(t)) : (t = 0), z(a)))
    return t > a.length || n instanceof RegExp ? !1 : (t < 0 && (t = Math.max(0, a.length + t)), a.includes(n, t));
  if (Array.isArray(a)) return a.includes(n, t);
  const r = Object.keys(a);
  t < 0 && (t = Math.max(0, r.length + t));
  for (let e = t; e < r.length; e++) if (k(Reflect.get(a, r[e]), n)) return !0;
  return !1;
}
const $ = 100,
  H = 200;
function w(a) {
  return a.replace(/[\s _]+/g, "").toLowerCase();
}
const U = { ratio: ["uploaded", "downloaded"], trueRatio: ["trueUploaded", "trueDownloaded"] };
function K(a, n = "ratio") {
  let t = -1;
  if (typeof a[n] > "u") {
    const [s, r] = U[n],
      { [s]: e = 0, [r]: o = 0 } = a;
    if (o == 0 && e == 0) return -1 / 0;
    o == 0 && e > 0 ? (t = 1 / 0) : o > 0 && (t = e / o);
  } else t = a[n];
  return t;
}
function j(a) {
  let n = a.toLowerCase(),
    t = {
      manager: [
        ["retiree", "养老", "退休"],
        ["uploader", "发布", "发种", "上传", "种子"],
        ["helper", "assistant", "助手", "助理"],
        ["seeder", "保种"],
        ["transferrer", "转载"],
        ["forum", "版主"],
        ["moderator", "admin", "管理"],
        ["sys", "coder", "开发"],
        ["staff", "主管"],
      ].flat(),
      vip: ["vip", "贵宾", "honor", "荣誉"],
    },
    s = "user";
  for (const [r, e] of Object.entries(t))
    if (e.some((o) => A(n, o))) {
      s = r;
      break;
    }
  return s;
}
function h(a, n) {
  const t = {};
  if (!n) return t;
  const s = +new Date(),
    r = Object.keys(n);
  if (n.interval) {
    const e = a.joinTime ?? s,
      o = v(n.interval, e);
    if (o > s) {
      const i = N({ start: s, end: o });
      let f = "P";
      (i.years && (f += `${i.years}Y`),
        i.months && (f += `${i.months}M`),
        i.days && (f += `${i.days}D`),
        (t.interval = f));
    }
  }
  for (const e of g(
    ["totalTraffic", "downloaded", "trueDownloaded", "uploaded", "trueUploaded", "seedingSize", "specialSeedingSize"],
    r,
  )) {
    let o = n[e];
    typeof o == "string" && (o = b(o));
    const i = a[e] ?? 0;
    i < o && (t[e] = o - i);
  }
  for (const e of g(["ratio", "trueRatio"], r)) {
    a[e] = K(a, e);
    const o = n[e];
    let i, f;
    Array.isArray(o) && o.length === 2 && o.every((d) => typeof d == "number")
      ? ([i, f] = o.sort((d, u) => d - u))
      : typeof o == "number"
        ? (i = o)
        : (i = parseFloat(String(o)));
    const [l, c] = U[e],
      { [l]: y = 0, [c]: p = 0, [e]: L = -1 } = a,
      D = typeof n[c] == "string" ? b(n[c]) : (n[c] ?? 0),
      M = typeof n[l] == "string" ? b(n[l]) : (n[l] ?? 0);
    if (i)
      if ((L < i && (t[e] = i), M > 0 && D === 0)) {
        const d = M / i;
        if (p > d) {
          const u = p * i;
          m(t, l, Math.max(t[l] || 0, u - y));
        }
      } else {
        const u = Math.max(p, D) * i;
        y < u && m(t, l, Math.max(t[l] || 0, u - y));
      }
    if (f) {
      L > f && (t[e] = f);
      const d = y / f;
      p < d && m(t, c, Math.max(t[c] || 0, d - p));
    }
  }
  for (const e of g(["seedingTime", "averageSeedingTime"], r)) {
    let o = n[e];
    typeof o == "string" && (o = (v(o, s) - s) / 1e3);
    const i = a[e] ?? 0;
    i < o && (t[e] = o - i);
  }
  for (const e of g(
    ["bonus", "bonusPerHour", "seedingBonus", "uploads", "leeching", "snatches", "posts", "perfectFlacs", "groups"],
    r,
  )) {
    let o = n[e];
    const i = a[e] ?? 0;
    i < o && (t[e] = o - i);
  }
  for (const e of ["bonus", "seedingBonus"]) {
    const o = a[`${e}PerHour`] ?? a.bonusPerHour ?? 0;
    if (t[e] && n[e] && o > 0) {
      const i = a[e] ?? 0,
        f = n[e] - i;
      if (f > 0) {
        const l = f / parseFloat(o);
        t[`${e}NeededInterval`] = `${Math.floor(l)}H`;
      }
    }
  }
  for (const e of g(["hnrUnsatisfied"], r)) {
    let o = n[e];
    const i = a[e] ?? 0;
    i > o && (t[e] = i - o);
  }
  if (n.alternative) {
    let e = [];
    for (const o of n.alternative) e.push(h(a, o));
    ((e = e.filter((o) => !T(o))), e.length == n.alternative.length && (t.alternative = e));
  }
  return t;
}
function B(a, n) {
  return T(h(a, n));
}
function S(a) {
  return a
    .map((n) => ({ ...n, groupType: n.groupType ?? "user" }))
    .filter((n) => n.groupType === "user")
    .reduce((n, t) => (t.id > n ? t.id : n), 0);
}
function V(a, n) {
  let t = {};
  const s = a.levelId ?? -1;
  if (s < S(n)) {
    const r = n.find((e) => e.id > s);
    t = { ...h(a, r), level: r };
  }
  return t;
}
function x(a, n) {
  let t = n.find((e) => {
    const o = w(a.levelName);
    return [e.name, ...(e.nameAka ?? [])].map(w).some((i) => i.includes(o));
  });
  if (t) return t.id;
  let s = j(a.levelName);
  if (s !== "user") return ((t = n.find((e) => e.groupType === s)), t ? t.id : s == "vip" ? $ : H);
  let r = S(n);
  for (const e in n ?? []) {
    const o = n[e];
    if (!B(a, o)) {
      const i = parseInt(e) - 1;
      i >= 0 ? (r = n[i].id) : (r = -1);
      break;
    }
  }
  return r;
}
export { j as a, x as b, K as f, V as g };
