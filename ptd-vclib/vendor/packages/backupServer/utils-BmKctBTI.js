import { J as u } from "../../jszip/jszip.min-DP3ssR4z.js";
import { C as c } from "../../crypto-js/index-B0NDMIdm.js";
import { o as S } from "../../es-toolkit/omit-BqXgNNTz.js";
var m = ((e) => ((e.time = "time"), (e.name = "name"), (e.size = "size"), e))(m || {}),
  p = ((e) => ((e.desc = "desc"), (e.asc = "asc"), e))(p || {});
function d(e, t) {
  const s = JSON.stringify(e);
  if (!t) return s;
  const i = c.MD5(t).toString().substring(0, 16);
  return c.AES.encrypt(s, i).toString();
}
function w(e, t) {
  if (!t) return JSON.parse(e);
  const s = c.MD5(t).toString().substring(0, 16),
    i = c.AES.decrypt(e, s).toString(c.enc.Utf8);
  return JSON.parse(i);
}
async function k(e, t) {
  const s = new u(),
    i = { ...(e.manifest ?? {}), encryption: typeof t == "string" && t !== "", time: new Date().getTime(), files: {} };
  delete e.manifest;
  for (const [r, a] of Object.entries(e)) {
    const n = `${r}.json`,
      o = d(a, t);
    (s.file(n, o), (i.files[r] = { name: n, hash: c.MD5(o).toString() }));
  }
  return (
    s.file("manifest.json", JSON.stringify(i)),
    await s.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } })
  );
}
async function J(e, t) {
  const i = await new u().loadAsync(e),
    r = {},
    a = await i
      .file("manifest.json")
      ?.async("string")
      .then((n) => JSON.parse(n));
  if (a?.files) {
    !a.encryption && t && (t = "");
    for (const [n, o] of Object.entries(S(a.files ?? {}, ["manifest"]))) {
      const { name: f, hash: g } = o,
        l = await i.file(f)?.async("string");
      if (l) {
        const h = c.MD5(l).toString();
        if (n != "manifest" && h !== g) throw new Error(`File hash mismatch for ${f}.`);
        try {
          r[n] = w(l, t);
        } catch {
          throw new Error(`Failed to decrypt file: ${f}`);
        }
      }
    }
    r.manifest = a;
  } else throw new Error("Manifest not found in the zip file");
  return r;
}
function j(e, t) {
  if (e.length > 0 && Object.keys(t).length > 0) {
    const s = t.orderMode ?? p.desc,
      i = t.orderBy ?? m.time;
    e.sort((r, a) => {
      let n, o;
      switch (i) {
        case m.name:
          ((n = r.filename), (o = a.filename));
          break;
        case m.size:
          ((n = r.size), (o = a.size));
          break;
        case m.time:
        default:
          ((n = r.time), (o = a.time));
          break;
      }
      const f = n.toString().localeCompare(o.toString());
      return s === p.desc ? -f : f;
    });
  }
  return e;
}
export { m as E, p as a, k as b, w as d, d as e, J as j, j as l };
