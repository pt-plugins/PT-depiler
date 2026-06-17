import { Y as d, bC as f, N as m, bI as S } from "../vendor/packages/site/index-COeZNva1.js";
import { bV as w } from "./src/entries/options/index-DmNe5UVo.js";
const i = S({});
async function v(c) {
  const r = c ?? d,
    s = w();
  return (
    await Promise.allSettled(
      r.map(
        (a) =>
          new Promise(async (l) => {
            if (!i[a]) {
              const e = await s.getSiteMetadata(a),
                o = await f("getSiteFavicon", { site: a }),
                n = await s.getSiteName(a),
                t = new Image();
              ((t.src = o),
                t.decode().catch(() => {
                  ((t.src = m), t.decode());
                }),
                (i[a] = {
                  id: a,
                  type: e.type,
                  siteName: n,
                  combinedSiteName: Array.from(new Set([n, e.name, ...(e.aka ?? [])].filter(Boolean))).join("|$|"),
                  hasUserInfo: Object.hasOwn(e, "userInfo"),
                  isDead: e.isDead ?? !1,
                  isOffline: s.sites[a]?.isOffline ?? !1,
                  faviconSrc: o,
                  faviconElement: t,
                }));
            }
            l();
          }),
      ),
    ),
    i
  );
}
export { i as a, v as l };
