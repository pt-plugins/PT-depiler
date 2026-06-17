import { S as n } from "../index-COeZNva1.js";
import m from "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import { d as i } from "../utils/filter-Dko2hrfF.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/helper-OCngMtkv.js";
const l = { selector: "div.postTitle" },
  u = [
    { name: "(Post)apocalyptic", value: 36021 },
    { name: "Action", value: 101 },
    { name: "Adults", value: 23195 },
    { name: "Adventure", value: 232 },
    { name: "Anthology", value: 151 },
    { name: "Art", value: 30 },
    { name: "Autobiography & Biographies", value: 24289 },
    { name: "Bestsellers", value: 16650 },
    { name: "Business", value: 104 },
    { name: "Children", value: 98 },
    { name: "Classic", value: 85 },
    { name: "Computer", value: 233 },
    { name: "Contemporary", value: 231 },
    { name: "Crime", value: 121 },
    { name: "Detective", value: 122 },
    { name: "Doctor Who", value: 15243 },
    { name: "Documentary", value: 107 },
    { name: "Education", value: 105 },
    { name: "Fantasy", value: 65 },
    { name: "Full Cast", value: 17502 },
    { name: "Gay", value: 17180 },
    { name: "General Fiction", value: 21110 },
    { name: "Historical Fiction", value: 2315 },
    { name: "History", value: 19 },
    { name: "Horror", value: 2551 },
    { name: "Humor", value: 234 },
    { name: "Lecture", value: 115 },
    { name: "Lesbian", value: 20962 },
    { name: "LGBT", value: 20404 },
    { name: "Libertarian", value: 23198 },
    { name: "Light Novel", value: 20738 },
    { name: "Literature", value: 76 },
    { name: "LitRPG", value: 30126 },
    { name: "Military", value: 790 },
    { name: "Misc. Non-fiction", value: 25881 },
    { name: "Mystery", value: 111 },
    { name: "Novel", value: 108 },
    { name: "Other", value: 1 },
    { name: "Paranormal", value: 235 },
    { name: "Plays & Theater", value: 26398 },
    { name: "Poetry", value: 1699 },
    { name: "Political", value: 2010 },
    { name: "Radio Productions", value: 26397 },
    { name: "Romance", value: 103 },
    { name: "Sci-Fi", value: 100 },
    { name: "Science", value: 99 },
    { name: "Self-help", value: 1663 },
    { name: "Sex Scenes", value: 23197 },
    { name: "Short Story", value: 16706 },
    { name: "Spiritual & Religious", value: 22 },
    { name: "Sport & Recreation", value: 432 },
    { name: "Suspense", value: 156 },
    { name: "Teen & Young Adult", value: 2986 },
    { name: "Thriller", value: 102 },
    { name: "True Crime", value: 11685 },
    { name: "Tutorial", value: 110 },
    { name: "Violence", value: 6322 },
    { name: "Westerns", value: 26010 },
    { name: "Zombies", value: 23196 },
  ],
  C = {
    version: 1,
    id: "audiobookbay",
    name: "AudioBook Bay",
    aka: ["ABB"],
    description: "AudioBook Bay (ABB) is a Public Torrent Tracker for AUDIOBOOKS",
    tags: ["有声书"],
    timezoneOffset: "+0100",
    type: "public",
    urls: [
      "https://audiobookbay.lu/",
      "http://audiobookbay.is/",
      "http://audiobookbay.se/",
      "http://audiobookbay.fi/",
      "http://audiobookbay.ws/",
      "http://theaudiobookbay.se/",
    ],
    category: [{ name: "Categories", key: "cat", options: u, cross: { mode: "comma" } }],
    search: {
      keywordPath: "params.s",
      requestConfig: { url: "/", responseType: "document", params: { tt: 1 } },
      advanceKeywordParams: { imdb: !1 },
      requestConfigTransformer: ({ requestConfig: e }) => ({
        ...e,
        params: { ...e?.params, s: e?.params.s?.replace(/[\W]+/g, " ").trim().toLowerCase() },
      }),
      selectors: {
        rows: { selector: "div.post:has(div[class='postTitle'])" },
        category: { text: "Audiobooks" },
        title: l,
        url: { selector: "div.postTitle h2 a", attr: "href" },
        size: {
          selector: "div.postContent",
          filters: [
            (e) => {
              const a = e.match(/File Size: (.+?)s/);
              return a ? i.parseSize(a[1]) : 0;
            },
          ],
        },
        time: {
          selector: "div.postContent",
          filters: [
            (e) => {
              const a = e.match(/Posted: (\d{1,2} \D{3} \d{4})/);
              return a ? i.parseTime(a[1]) : null;
            },
          ],
        },
        subTitle: {
          selector: "div.postInfo",
          filters: [
            (e) => {
              const a = e.match(/Category:\s+(.+?)(?=\s+(Language:|Keywords:))/s);
              return a ? a[1].trim().split("  ").join(" / ") : "";
            },
          ],
        },
        seeders: { text: "N/A" },
        leechers: { text: "N/A" },
        completed: { text: "N/A" },
      },
    },
    list: [{ excludeUrlPattern: ["/abss/"] }],
    detail: {
      urlPattern: ["/abss/"],
      selectors: {
        title: l,
        link: {
          selector: ":self",
          elementProcess: (e) => {
            const a = n(l.selector, e)[0].textContent,
              o = n("td:contains('Info Hash:') ~ td", e)[0].textContent,
              t = n("td:contains('Tracker:') ~ td", e).map((r) => r.textContent);
            return c(o, a, t) || "";
          },
        },
      },
    },
  };
class x extends m {
  async transformSearchPage(a, o) {
    const t = await super.transformSearchPage(a, o);
    if (n("a[href^='/page/2/']:first-of-type", a).length < 1) return t;
    try {
      const r = await this.request({ url: "/page/2/", params: o.requestConfig.params, responseType: "document" }),
        s = await super.transformSearchPage(r.data, o);
      t.push(...s);
    } catch (r) {
      console.debug(`[PTD] site '${this.name}' transformSearchPage Error:`, r, t);
    }
    return t;
  }
}
function c(e, a, o) {
  if (!e.trim() || !a.trim()) return null;
  const t = encodeURIComponent(a),
    r = new URLSearchParams();
  return (
    o.forEach((s) => {
      r.append("tr", s);
    }),
    `magnet:?xt=urn:btih:${e}&dn=${t}&${r.toString()}`
  );
}
export { x as default, C as siteMetadata };
