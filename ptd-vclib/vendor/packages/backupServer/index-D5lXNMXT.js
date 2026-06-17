const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "vendor/packages/backupServer/entity/CookieCloud-BJKlafpb.js",
      "vendor/crypto-js/index-B0NDMIdm.js",
      "vendor/packages/site/index-COeZNva1.js",
      "assets/_commonjs-dynamic-modules-TDtrdbi3.js",
      "assets/___vite-browser-external_commonjs-proxy-DYDjyS4M.js",
      "vendor/packages/backupServer/AbstractBackupServer-0VMguH3S.js",
      "vendor/packages/backupServer/utils-BmKctBTI.js",
      "vendor/jszip/jszip.min-DP3ssR4z.js",
      "vendor/es-toolkit/omit-BqXgNNTz.js",
      "vendor/packages/backupServer/entity/DropBox-2PuCqVAr.js",
      "vendor/es-toolkit/merge-DO-l8DcJ.js",
      "vendor/es-toolkit/isPlainObject-3NY8ex7Q.js",
      "vendor/packages/backupServer/entity/Gist-DKkaQdjE.js",
      "vendor/packages/backupServer/entity/GoogleDrive-DpeBFRoJ.js",
      "vendor/url-join/url-join-Cu798wIg.js",
      "vendor/packages/backupServer/entity/OWSS-bEvFakyN.js",
      "vendor/packages/backupServer/entity/WebDAV-CmdHAQg_.js",
    ]),
) => i.map((i) => d[i]);
import { w as a, b1 as o, _ as e } from "../site/index-COeZNva1.js";
const i = Object.assign({
    "./entity/CookieCloud.ts": () =>
      e(() => import("./entity/CookieCloud-BJKlafpb.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8])),
    "./entity/DropBox.ts": () =>
      e(() => import("./entity/DropBox-2PuCqVAr.js"), __vite__mapDeps([9, 10, 11, 2, 5, 6, 7, 3, 1, 4, 8])),
    "./entity/Gist.ts": () =>
      e(() => import("./entity/Gist-DKkaQdjE.js"), __vite__mapDeps([12, 2, 1, 3, 4, 5, 6, 7, 8])),
    "./entity/GoogleDrive.ts": () =>
      e(() => import("./entity/GoogleDrive-DpeBFRoJ.js"), __vite__mapDeps([13, 14, 2, 5, 6, 7, 3, 1, 4, 8])),
    "./entity/OWSS.ts": () =>
      e(() => import("./entity/OWSS-bEvFakyN.js"), __vite__mapDeps([15, 14, 2, 5, 6, 7, 3, 1, 4, 8])),
    "./entity/WebDAV.ts": () =>
      e(() => import("./entity/WebDAV-CmdHAQg_.js"), __vite__mapDeps([16, 14, 2, 5, 6, 7, 3, 1, 4, 8])),
  }),
  _ = Object.keys(i).map((t) => t.replace(/^\.\/entity\//, "").replace(/\.ts$/, ""));
async function n(t) {
  return await i[`./entity/${t}.ts`]();
}
async function u(t) {
  return (await n(t)).serverMetaData;
}
async function c(t) {
  const r = a((await n(t)).serverConfig);
  return ((r.id = o()), r);
}
async function p(t) {
  const r = (await n(t.type)).default;
  return new r(t);
}
function v(t) {
  return `/icons/backupServer/${t}.png`;
}
export { c as a, v as b, u as c, _ as e, p as g };
