import o from "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import { bB as i } from "../index-COeZNva1.js";
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
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
const r = i("uggcf://alnn.fv/"),
  n = i("uggcf://fhxrorv.alnn.fv/"),
  y = {
    id: "nyaa",
    version: 1,
    name: "Nyaa",
    tags: ["综合"],
    collaborator: ["hyuan280"],
    type: "public",
    urls: ["uggcf://alnn.fv/", "uggcf://fhxrorv.alnn.fv/"],
    category: [
      {
        name: "搜索站点",
        key: "url",
        options: [
          { name: "表站", value: r },
          { name: "里站", value: n },
        ],
        generateRequestConfig: (e) => ({ requestConfig: { baseURL: e.toString() } }),
      },
      {
        name: "过滤",
        key: "f",
        options: [
          { name: "No filter", value: "0" },
          { name: "No remakes", value: "1" },
          { name: "Trusted only", value: "2" },
        ],
      },
      {
        name: "类别（表站）",
        key: "c_safe",
        options: [
          { name: "All categories", value: "0_0" },
          { name: "Anime", value: "1_0" },
          { name: "Anime - AMV", value: "1_1" },
          { name: "Anime - English", value: "1_2" },
          { name: "Anime - Non-English", value: "1_3" },
          { name: "Anime - Raw", value: "1_4" },
          { name: "Audio", value: "2_0" },
          { name: "Audio - Lossless", value: "2_1" },
          { name: "Audio - Lossy", value: "2_2" },
          { name: "Literature", value: "3_0" },
          { name: "Literature - English", value: "3_1" },
          { name: "Literature - Non-English", value: "3_2" },
          { name: "Literature - Raw", value: "3_3" },
          { name: "Live Action", value: "4_0" },
          { name: "Live Action - English", value: "4_1" },
          { name: "Live Action - Idol/PV", value: "4_2" },
          { name: "Live Action - Non-English", value: "4_3" },
          { name: "Live Action - Raw", value: "4_4" },
          { name: "Pictures", value: "5_0" },
          { name: "Pictures - Graphics", value: "5_1" },
          { name: "Pictures - Photos", value: "5_2" },
          { name: "Software", value: "6_0" },
          { name: "Software - Apps", value: "6_1" },
          { name: "Software - Games", value: "6_2" },
        ],
        generateRequestConfig: (e) => ({ requestConfig: { params: { c: e.toString() } } }),
      },
      {
        name: "类别（里站）",
        key: "c_unsafe",
        options: [
          { name: "All categories", value: "0_0" },
          { name: "Art", value: "1_0" },
          { name: "Art - Anime", value: "1_1" },
          { name: "Art - Doujinshi", value: "1_2" },
          { name: "Art - Games", value: "1_3" },
          { name: "Art - Manga", value: "1_4" },
          { name: "Art - Pictures", value: "1_5" },
          { name: "Real Life", value: "2_0" },
          { name: "Real Life - Pictures", value: "2_1" },
          { name: "Real Life - Videos", value: "2_2" },
        ],
        generateRequestConfig: (e) => ({ requestConfig: { params: { c: e.toString() } } }),
      },
    ],
    search: {
      requestConfig: { url: "/" },
      keywordPath: "params.q",
      advanceKeywordParams: { imdb: !1 },
      selectors: {
        rows: { selector: "table.torrent-list > tbody > tr" },
        id: {
          selector: ["a[href*='/view/']:not([href*='#'])"],
          attr: "href",
          filters: [(e) => e.match(/\/view\/(\d+)/)[1]],
        },
        title: { selector: ["a[href*='/view/']:not([href*='#'])"] },
        subTitle: { selector: ["img.category-icon"], attr: "alt" },
        url: { selector: ["a[href*='/view/']:not([href*='#'])"], attr: "href" },
        link: { selector: ["a[href*='/download/']"], attr: "href" },
        time: { selector: ["td[data-timestamp]"], attr: "data-timestamp", filters: [{ name: "parseNumber" }] },
        size: { selector: ["td:nth-child(4)"], filters: [{ name: "parseSize" }] },
        seeders: { selector: ["td:nth-child(6)"], filters: [{ name: "parseNumber" }] },
        leechers: { selector: ["td:nth-child(7)"], filters: [{ name: "parseNumber" }] },
        completed: { selector: ["td:nth-child(8)"], filters: [{ name: "parseNumber" }] },
        comments: {
          selector: ["a[href*='/view/'][href*='#comments']", "a[href*='/view/'][href*='#com-']"],
          filters: [{ name: "parseNumber" }],
        },
        category: { selector: ["img.category-icon"], attr: "alt", filters: [(e) => e.split("-")[0].trim()] },
      },
    },
    searchEntry: {
      area_work_safe: { name: "表站", requestConfig: { baseURL: r } },
      area_non_work_safe: { name: "里站", requestConfig: { baseURL: n }, enabled: !1 },
    },
    list: [{ urlPattern: ["si/?(\\?.*)?$"] }],
    detail: {
      urlPattern: ["si/view/\\d+"],
      selectors: {
        title: { selector: ["div.container div.panel-heading > h3.panel-title"] },
        id: {
          selector: ":self",
          elementProcess: (e) => {
            const a = e.URL,
              t = a.match(/\/view\/(\d+)/);
            return t ? t[1] : a;
          },
        },
        link: { selector: ["a[href*='/download/']"], attr: "href" },
      },
    },
  };
class R extends o {
  async getTorrentDownloadLink(a) {
    const t = await super.getTorrentDownloadLink(a);
    if (t && !t.includes("/download/")) {
      const l = a.url?.startsWith("http") ? { url: a.url } : { baseURL: this.url };
      return this.fixLink(`/download/${a.id}.torrent`, l);
    }
    return t;
  }
}
export { R as default, y as siteMetadata };
