import { c as R, j as V, d as E } from "../site/index-COeZNva1.js";
import {
  n as $,
  c as l,
  k as S,
  t as x,
  d as T,
  e as U,
  a as p,
  m as y,
  b as c,
  l as v,
  p as b,
} from "./index-BATa0ddy.js";
function C(n) {
  return n ? ((n = n.toLowerCase()), n === "utf8" || n === "utf-8") : !0;
}
function k(n, e) {
  if (!e || C(e)) return encodeURIComponent(n);
  const t = $.encode(n, e);
  let f = "",
    i = "";
  for (let s = 0; s < t.length; s++) ((i = t[s].toString(16)), i.length === 1 && (i = "0" + i), (f += "%" + i));
  return ((f = f.toUpperCase()), f);
}
function w(n, e) {
  if (!e || C(e)) return decodeURIComponent(n);
  const t = [];
  for (let i = 0; i < n.length; )
    n[i] === "%" ? (i++, t.push(parseInt(n.substring(i, i + 2), 16)), (i += 2)) : (t.push(n.charCodeAt(i)), i++);
  const f = R.from(t);
  return $.decode(f, e);
}
function F(n) {
  return /^[\x00-\x7F]*$/.test(n);
}
function d(n, e) {
  return ((n = String(n)), F(n) ? (n = encodeURIComponent(n)) : (n = k(n, e)), n);
}
function j(n, e, t) {
  const f = [];
  for (const [i, s] of n.entries()) f.push(H(s, `${e}[${i}]`, t));
  return f.join("&");
}
function M(n, e, t) {
  const f = [],
    i = t.charset;
  for (const s in n) {
    if (s === "") continue;
    const r = n[s];
    if (r == null) f.push(k(s, i) + "=");
    else {
      const a = e ? e + "[" + d(s, i) + "]" : d(s, i);
      f.push(H(r, a, t));
    }
  }
  return f.join("&");
}
function H(n, e, t) {
  let f;
  if ((typeof e != "string" ? (t = e || {}) : (f = e), (t = t ?? {}), Array.isArray(n))) {
    if (!f) throw new TypeError("stringify expects an object");
    return j(n, f, t);
  }
  const i = String(n);
  if (n && typeof n == "object" && i === "[object Object]") return M(n, f ?? "", t);
  if (!f) throw new TypeError("stringify expects an object");
  const s = t?.charset ?? "utf-8";
  return `${f}=${d(i, s)}`;
}
function P(n) {
  let e = 2;
  for (const t of n) e += h(t);
  return e;
}
function D(n) {
  let e = 2;
  for (const [t, f] of n) {
    const i = x(t).byteLength;
    ((e += l(i) + 1 + i), (e += h(f)));
  }
  return e;
}
function z(n) {
  let e = 2;
  const t = Object.keys(n);
  for (let f = 0; f < t.length; f++) {
    const i = x(t[f]).byteLength;
    ((e += l(i) + 1 + i), (e += h(n[t[f]])));
  }
  return e;
}
function K(n) {
  const e = x(n).byteLength;
  return l(e) + 1 + e;
}
function N(n) {
  const e = n.byteLength - n.byteOffset;
  return l(e) + 1 + e;
}
function h(n) {
  if (n == null) return 0;
  const t = S(n);
  switch (t) {
    case "arraybufferview":
      return N(n);
    case "string":
      return K(n);
    case "array":
    case "set":
      return P(n);
    case "number":
      return 1 + l(Math.floor(n)) + 1;
    case "bigint":
      return 1 + n.toString().length + 1;
    case "object":
      return z(n);
    case "map":
      return D(n);
    default:
      throw new TypeError(`Unsupported value of type "${t}"`);
  }
}
const q = h,
  A = { encode: U, decode: T, byteLength: h, encodingLength: q },
  L = [
    255, 255, 26, 27, 28, 29, 30, 31, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255,
  ],
  O = function (n) {
    if (!ArrayBuffer.isView(n) && typeof n != "string")
      throw new TypeError("base32.decode only takes Buffer or string as parameter");
    let e = 0,
      t = 0,
      f,
      i = 0;
    ArrayBuffer.isView(n) || (n = x(n));
    const s = new Uint8Array(Math.ceil((n.length * 5) / 8));
    for (let r = 0; r < n.length && n[r] !== 61; r++) {
      const a = n[r] - 48;
      if (a < L.length)
        ((t = L[a]),
          e <= 3
            ? ((e = (e + 5) % 8), e === 0 ? ((f |= t), (s[i] = f), i++, (f = 0)) : (f |= 255 & (t << (8 - e))))
            : ((e = (e + 5) % 8), (f |= 255 & (t >>> e)), (s[i] = f), i++, (f = 255 & (t << (8 - e)))));
      else throw new Error("Invalid input - it is not base32 encoded string");
    }
    return s.subarray(0, i);
  };
function G(n) {
  const e = (t, f = t) => Array.from({ length: f - t + 1 }, (i, s) => s + t);
  return n.reduce((t, f, i, s) => {
    const r = f.split("-").map((a) => parseInt(a));
    return t.concat(e(...r));
  }, []);
}
/*! magnet-uri. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */ function m(n) {
  const e = {},
    t = n.split("magnet:?")[1];
  (t && t.length >= 0 ? t.split("&") : []).forEach((s) => {
    const r = s.split("=");
    if (r.length !== 2) return;
    const a = r[0];
    let o = r[1];
    (a === "dn" && (o = decodeURIComponent(o).replace(/\+/g, " ")),
      (a === "tr" || a === "xs" || a === "as" || a === "ws") && (o = decodeURIComponent(o)),
      a === "kt" && (o = decodeURIComponent(o).split("+")),
      a === "ix" && (o = Number(o)),
      a === "so" && (o = G(decodeURIComponent(o).split(","))),
      e[a] ? (Array.isArray(e[a]) || (e[a] = [e[a]]), e[a].push(o)) : (e[a] = o));
  });
  let i;
  return (
    e.xt &&
      (Array.isArray(e.xt) ? e.xt : [e.xt]).forEach((r) => {
        (i = r.match(/^urn:btih:(.{40})/))
          ? (e.infoHash = i[1].toLowerCase())
          : (i = r.match(/^urn:btih:(.{32})/))
            ? (e.infoHash = p(O(i[1])))
            : (i = r.match(/^urn:btmh:1220(.{64})/)) && (e.infoHashV2 = i[1].toLowerCase());
      }),
    e.xs &&
      (Array.isArray(e.xs) ? e.xs : [e.xs]).forEach((r) => {
        (i = r.match(/^urn:btpk:(.{64})/)) && (e.publicKey = i[1].toLowerCase());
      }),
    e.infoHash && (e.infoHashBuffer = y(e.infoHash)),
    e.infoHashV2 && (e.infoHashV2Buffer = y(e.infoHashV2)),
    e.publicKey && (e.publicKeyBuffer = y(e.publicKey)),
    e.dn && (e.name = e.dn),
    e.kt && (e.keywords = e.kt),
    (e.announce = []),
    (typeof e.tr == "string" || Array.isArray(e.tr)) && (e.announce = e.announce.concat(e.tr)),
    (e.urlList = []),
    (typeof e.as == "string" || Array.isArray(e.as)) && (e.urlList = e.urlList.concat(e.as)),
    (typeof e.ws == "string" || Array.isArray(e.ws)) && (e.urlList = e.urlList.concat(e.ws)),
    (e.peerAddresses = []),
    (typeof e["x.pe"] == "string" || Array.isArray(e["x.pe"])) && (e.peerAddresses = e.peerAddresses.concat(e["x.pe"])),
    (e.announce = Array.from(new Set(e.announce))),
    (e.urlList = Array.from(new Set(e.urlList))),
    (e.peerAddresses = Array.from(new Set(e.peerAddresses))),
    e
  );
}
/*! parse-torrent. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */ async function J(n) {
  if (typeof n == "string" && /^(stream-)?magnet:/.test(n)) {
    const e = m(n);
    if (!e.infoHash) throw new Error("Invalid torrent identifier");
    return e;
  } else {
    if (typeof n == "string" && (/^[a-f0-9]{40}$/i.test(n) || /^[a-z2-7]{32}$/i.test(n)))
      return m(`magnet:?xt=urn:btih:${n}`);
    if (ArrayBuffer.isView(n) && n.length === 20) return m(`magnet:?xt=urn:btih:${p(n)}`);
    if (ArrayBuffer.isView(n)) return await Q(n);
    if (n && n.infoHash)
      return (
        (n.infoHash = n.infoHash.toLowerCase()),
        n.announce || (n.announce = []),
        typeof n.announce == "string" && (n.announce = [n.announce]),
        n.urlList || (n.urlList = []),
        n
      );
    throw new Error("Invalid torrent identifier");
  }
}
async function Q(n) {
  (ArrayBuffer.isView(n) && (n = A.decode(n)),
    u(n.info, "info"),
    u(n.info["name.utf-8"] || n.info.name, "info.name"),
    u(n.info["piece length"], "info['piece length']"),
    u(n.info.pieces, "info.pieces"),
    n.info.files
      ? n.info.files.forEach((s) => {
          (u(typeof s.length == "number", "info.files[0].length"), u(s["path.utf-8"] || s.path, "info.files[0].path"));
        })
      : u(typeof n.info.length == "number", "info.length"));
  const e = { info: n.info, infoBuffer: A.encode(n.info), name: c(n.info["name.utf-8"] || n.info.name), announce: [] };
  ((e.infoHashBuffer = await v(e.infoBuffer)),
    (e.infoHash = p(e.infoHashBuffer)),
    n.info.private !== void 0 && (e.private = !!n.info.private),
    n["creation date"] && (e.created = new Date(n["creation date"] * 1e3)),
    n["created by"] && (e.createdBy = c(n["created by"])),
    ArrayBuffer.isView(n.comment) && (e.comment = c(n.comment)),
    Array.isArray(n["announce-list"]) && n["announce-list"].length > 0
      ? n["announce-list"].forEach((s) => {
          s.forEach((r) => {
            e.announce.push(c(r));
          });
        })
      : n.announce && e.announce.push(c(n.announce)),
    ArrayBuffer.isView(n["url-list"]) && (n["url-list"] = n["url-list"].length > 0 ? [n["url-list"]] : []),
    (e.urlList = (n["url-list"] || []).map((s) => c(s))),
    (e.announce = Array.from(new Set(e.announce))),
    (e.urlList = Array.from(new Set(e.urlList))));
  let t = 0;
  const f = n.info.files || [n.info];
  ((e.files = f.map((s, r) => {
    const a = [].concat(e.name, s["path.utf-8"] || s.path || []).map((o) => (ArrayBuffer.isView(o) ? c(o) : o));
    return (
      (t += s.length),
      {
        path: b.join.apply(null, [b.sep].concat(a)).slice(1),
        name: a[a.length - 1],
        length: s.length,
        offset: t - s.length,
      }
    );
  })),
    (e.length = t));
  const i = e.files[e.files.length - 1];
  return (
    (e.pieceLength = n.info["piece length"]),
    (e.lastPieceLength = (i.offset + i.length) % e.pieceLength || e.pieceLength),
    (e.pieces = W(n.info.pieces)),
    e
  );
}
function W(n) {
  const e = [];
  for (let t = 0; t < n.length; t += 20) e.push(p(n.slice(t, t + 20)));
  return e;
}
function u(n, e) {
  if (!n) throw new Error(`Torrent is missing required field: ${e}`);
}
function X() {
  return /[<>:"/\\|?*\u0000-\u001F]/g;
}
function Y() {
  return /^(con|prn|aux|nul|com\d|lpt\d)$/i;
}
function Z(n) {
  return !(!n || n.length > 255 || X().test(n) || Y().test(n) || n === "." || n === "..");
}
const B = /filename\*=UTF-8''([\w%\-\.]+)(?:; ?|$)/i,
  _ = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i,
  I = /xt(?:\.1)?=urn:btih:(?<hash>[a-z0-9]{32}(?:[a-z0-9]{8})?)/i,
  ee = /xt(?:\.1)?=urn:btmh:1220(?<hash>[a-z0-9]{64})/i;
function ie(n) {
  const e = n.match(I);
  return e ? e.groups?.hash || null : n.match(ee)?.groups?.hash || null;
}
async function fe(n = {}) {
  const e = await V.request({ ...n, responseType: "arraybuffer" });
  if (e.headers["content-type"] && !/octet-stream|x-bittorrent/gi.test(e.headers["content-type"]))
    throw new Error("Invalid Torrent From Server");
  const t = E.from(e.data, "binary"),
    f = await J(t);
  let i = f.name || "1.torrent";
  const s = e.headers["content-disposition"];
  if (s && s.includes("filename")) {
    let r = "";
    if (B.test(s)) r = w(B.exec(s)[1]);
    else {
      const a = s.toLowerCase().indexOf("filename=");
      if (a >= 0) {
        const o = s.slice(a),
          g = _.exec(o);
        g != null && g[2] && (r = w(g[2], "ascii"));
      }
    }
    ((r = r.replace(/^[ "']+/, "").replace(/[ "']+$/, "")), Z(r) && (i = r));
  }
  return (
    /\.torrent$/i.test(i) || (i = `${i}.torrent`),
    {
      name: i,
      metadata: {
        arraybuffer: e.data,
        buffer: t,
        base64: () => t.toString("base64"),
        blob: () => new Blob([e.data], { type: "application/x-bittorrent" }),
      },
      info: f,
    }
  );
}
export { ie as e, fe as g, H as s };
