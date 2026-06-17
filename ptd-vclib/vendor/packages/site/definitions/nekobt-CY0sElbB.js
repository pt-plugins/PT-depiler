import c from "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../index-COeZNva1.js";
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
const o = {
    0: { name: "L0 - Official", color: "purple" },
    1: { name: "L1 - Slight Modifications", color: "purple" },
    2: { name: "L2 - Small-scale Fansubs", color: "purple" },
    3: { name: "L3 - Full-scale Fansubs", color: "purple" },
    4: { name: "L4 - Full-scale Batch", color: "purple" },
  },
  l = [
    { name: "English", value: "en" },
    { name: "English (Weeb)", value: "enm" },
    { name: "Japanese", value: "ja" },
    { name: "Chinese (Simplified)", value: "zh-hans" },
    { name: "Chinese (Traditional)", value: "zh-hant" },
    { name: "Cantonese", value: "yue" },
  ],
  w = {
    id: "nekobt",
    version: 1,
    name: "nekoBT",
    description: "nekoBT is a Public Torrent Tracker for ANIME",
    tags: ["动漫"],
    type: "public",
    urls: ["https://nekobt.to/"],
    favicon: "./nekobt.webp",
    category: [
      {
        name: "字幕级别",
        key: "levels",
        options: Object.entries(o).map(([r, e]) => ({ name: e.name, value: r })),
        cross: { mode: "comma" },
      },
      {
        name: "原创翻译字幕",
        key: "otl",
        options: [
          { name: "是", value: "true" },
          { name: "否", value: "false" },
        ],
      },
      {
        name: "机翻字幕",
        key: "mtl",
        options: [
          { name: "是", value: "true" },
          { name: "否", value: "false" },
        ],
      },
      { name: "字幕语言（字幕组）", key: "fansub_lang", options: l, cross: { mode: "comma" } },
      { name: "字幕语言（官方字幕）", key: "sub_lang", options: l, cross: { mode: "comma" } },
    ],
    search: {
      keywordPath: "params.query",
      requestConfig: {
        responseType: "json",
        url: "/api/v1/torrents/search",
        params: { limit: 100, sort_by: "latest" },
      },
      advanceKeywordParams: { imdb: !1 },
      selectors: {
        rows: { selector: "data.results" },
        id: { selector: "id" },
        time: { selector: "uploaded_at" },
        title: { selector: "title" },
        size: { selector: "filesize" },
        category: { text: "Anime" },
        url: { selector: "id", filters: [{ name: "prepend", args: ["/torrents/"] }] },
        link: { selector: "magnet" },
        author: { selector: "uploader.username" },
        seeders: { selector: "seeders" },
        leechers: { selector: "leechers" },
        completed: { selector: "completed" },
        comments: { selector: "comment_count" },
        tags: [
          { name: "OTL", selector: "otl", color: "green" },
          { name: "MTL", selector: "mtl", color: "red" },
          { name: "Hardsub", selector: "hardsub", color: "red" },
          { name: "Imported", selector: "imported", color: "#0c4a6e" },
        ],
      },
    },
    list: [
      {
        urlPattern: [
          /\/$/,
          "/search",
          "/users/\\d+/peers",
          "/users/\\d+/torrents",
          "/users/\\d+$",
          "/groups/\\d+$",
          "/media/",
        ],
        mergeSearchSelectors: !1,
        selectors: {
          rows: { selector: "table.table tr:has(a[href^='/torrents/'])" },
          id: { selector: "a[href^='/torrents/']", attr: "href", filters: [{ name: "parseNumber" }] },
          time: { selector: "> td:nth-child(6)" },
          title: { selector: "span.wrap-anywhere" },
          size: { selector: "> td:nth-child(5)" },
          category: { text: "Anime" },
          url: { selector: "a[href^='/torrents/']", attr: "href" },
          link: { selector: "a[title~='Public'][href^='magnet:?xt=']", attr: "href" },
          author: { selector: "a[href^='/users/']" },
          seeders: { selector: "> td:nth-child(7)" },
          leechers: { selector: "> td:nth-child(8)" },
          completed: { selector: "> td:nth-child(9)" },
          comments: { selector: "span.wrap-anywhere ~ span.tag:has(svg) > span" },
          tags: [
            ...Object.values(o).map((r) => ({ ...r, selector: `span.tag:contains('${r.name}')` })),
            { name: "OTL", selector: "span.tag:contains('OTL')", color: "green" },
            { name: "MTL", selector: "span.tag:contains('MTL')", color: "red" },
            { name: "Hardsub", selector: "span.tag:contains('Hardsub')", color: "red" },
            { name: "Imported", selector: "span.tag:contains('Imported')", color: "#0c4a6e" },
          ],
        },
      },
    ],
    detail: {
      urlPattern: ["/torrents/\\d+"],
      selectors: {
        title: { selector: "h2.card-title span:not([class])" },
        link: { selector: "a[href^='magnet:?xt=']:last", attr: "href" },
      },
    },
  };
class x extends c {
  parseTorrentRowForTags(e, t, a) {
    const s = super.parseTorrentRowForTags(e, t, a);
    if (t instanceof Element) return s;
    const n = o[t.level];
    return ((s.tags = n ? [n, ...s.tags] : s.tags), s);
  }
  async getTorrentDownloadLink(e) {
    const t = await super.getTorrentDownloadLink(e);
    if (t && !(t.includes("/download/") || t.startsWith("magnet:?xt="))) {
      const a = e.url?.startsWith("http") ? { url: e.url } : { baseURL: this.url };
      return this.fixLink(`/api/v1/torrents/${e.id}/download`, a);
    }
    return t;
  }
}
export { x as default, w as siteMetadata };
