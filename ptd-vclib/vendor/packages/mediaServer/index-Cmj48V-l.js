const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "vendor/packages/mediaServer/entity/emby-C-5fT0FF.js",
      "vendor/packages/mediaServer/types-DXvgLac7.js",
      "vendor/packages/site/index-COeZNva1.js",
      "vendor/url-join/url-join-Cu798wIg.js",
      "vendor/es-toolkit/toMerged-Be-qf92q.js",
      "vendor/es-toolkit/isPlainObject-3NY8ex7Q.js",
      "vendor/packages/site/types/base-Dy_28wGT.js",
      "vendor/packages/mediaServer/entity/fnos-CPjeFLg7.js",
      "vendor/packages/mediaServer/entity/jellyfin-CAcAUa6C.js",
      "vendor/packages/mediaServer/entity/plex-CAGt4NJO.js",
    ]),
) => i.map((i) => d[i]);
import { _ as r, w as i } from "../site/index-COeZNva1.js";
const n = Object.assign({
    "./entity/emby.ts": () => r(() => import("./entity/emby-C-5fT0FF.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6])),
    "./entity/fnos.ts": () => r(() => import("./entity/fnos-CPjeFLg7.js"), __vite__mapDeps([7, 2, 4, 5, 3, 1, 6])),
    "./entity/jellyfin.ts": () =>
      r(() => import("./entity/jellyfin-CAcAUa6C.js"), __vite__mapDeps([8, 2, 4, 5, 3, 1, 6])),
    "./entity/plex.ts": () => r(() => import("./entity/plex-CAGt4NJO.js"), __vite__mapDeps([9, 3, 4, 2, 5, 1, 6])),
  }),
  o = Object.keys(n).map((e) => e.replace(/^\.\/entity\//, "").replace(/\.ts$/, ""));
async function a(e) {
  return await n[`./entity/${e}.ts`]();
}
async function _(e) {
  return i((await a(e)).mediaServerMetaData);
}
async function c(e) {
  const t = i((await a(e)).mediaServerConfig);
  return ((t.defaultSearchExtraRequestConfig ??= { params: {} }), t);
}
async function u(e) {
  const t = (await a(e.type)).default;
  return new t(e);
}
function d(e) {
  return `/icons/mediaServer/${e}.png`;
}
export { c as a, d as b, _ as c, o as e, u as g };
