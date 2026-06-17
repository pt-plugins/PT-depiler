import "../index-COeZNva1.js";
import { p as s } from "../utils/filesize-D_1hx4u8.js";
import o from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const i = {
  id: "pussytorrents",
  version: 1,
  name: "Pussytorrents",
  aka: ["PT"],
  description: "PussyTorrents is a Semi-Private Torrent Tracker for 3X",
  tags: ["XXX"],
  timezoneOffset: "+0000",
  type: "private",
  schema: "AbstractPrivateSite",
  urls: ["https://pussytorrents.org/"],
  search: {
    requestConfig: { url: "/torrents/browse" },
    requestConfigTransformer: ({ keywords: e, searchEntry: r, requestConfig: t }) => {
      const a = t.url || "";
      return (e && (delete t.params?.keywords, (e = e.replace(/(^|\s)-/, "")), (t.url = a + "?query=" + e)), t);
    },
    selectors: {
      rows: { selector: 'table#torrenttable > tbody > tr:has(a[href^="/download/"])' },
      id: { selector: 'a[href^="/torrent/"]', attr: "href", filters: [{ name: "parseNumber" }] },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: "href" },
      link: { selector: 'a[href^="/download/"]', attr: "href" },
      time: { selector: "span.subnote", filters: [(e) => e.replace("Added on ", "")] },
      size: { selector: "td:nth-last-child(5)" },
      author: { selector: "td:nth-last-child(1)" },
      category: { text: "ALL" },
      seeders: { selector: "td:nth-last-child(3)" },
      leechers: { selector: "td:nth-last-child(2)" },
      completed: { selector: "td:nth-last-child(4)", filters: [{ name: "parseNumber" }] },
      comments: { selector: 'a[href*="#comments"]' },
    },
  },
  userInfo: {
    pickLast: ["id", "name", "numericId"],
    process: [
      { requestConfig: { url: "/", responseType: "document" }, fields: ["id", "name", "messageCount"] },
      {
        requestConfig: { url: "/profile/$name$", responseType: "document" },
        assertion: { name: "url" },
        fields: ["uploaded", "downloaded", "levelName", "joinTime", "numericId"],
      },
      {
        requestConfig: { url: "/user/account/snatchlist", responseType: "document", params: { userID: "PLACEHOLDER" } },
        requestConfigTransformer: (e, r) => (r && r.numericId && (e.params.userID = r.numericId), e),
        assertion: { id: "userID" },
        fields: [],
      },
      {
        requestConfig: {
          url: "/user/account/snatchlist",
          method: "POST",
          responseType: "json",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json, text/javascript, */*; q=0.01",
            Origin: "https://pussytorrents.org",
            Referer: "https://pussytorrents.org/user/account/snatchlist",
          },
          data: {
            sEcho: 2,
            iColumns: 9,
            sColumns: "",
            iDisplayStart: 0,
            iDisplayLength: -1,
            sNames: ",,,,,,,,",
            sSearch: "",
            bRegex: !1,
            sSearch_0: "",
            bRegex_0: !1,
            bSearchable_0: !0,
            sSearch_1: "",
            bRegex_1: !1,
            bSearchable_1: !0,
            sSearch_2: "",
            bRegex_2: !1,
            bSearchable_2: !0,
            sSearch_3: "",
            bRegex_3: !1,
            bSearchable_3: !0,
            sSearch_4: "",
            bRegex_4: !1,
            bSearchable_4: !0,
            sSearch_5: "",
            bRegex_5: !1,
            bSearchable_5: !0,
            sSearch_6: "",
            bRegex_6: !1,
            bSearchable_6: !0,
            sSearch_7: "",
            bRegex_7: !1,
            bSearchable_7: !0,
            sSearch_8: "",
            bRegex_8: !1,
            bSearchable_8: !0,
            iSortingCols: 1,
            iSortCol_0: 0,
            sSortDir_0: "desc",
            bSortable_0: !0,
            bSortable_1: !0,
            bSortable_2: !0,
            bSortable_3: !0,
            bSortable_4: !0,
            bSortable_5: !0,
            bSortable_6: !0,
            bSortable_7: !0,
            bSortable_8: !0,
            userID: "PLACEHOLDER",
          },
        },
        requestConfigTransformer: (e, r) => (r && r.numericId && (e.data.userID = r.numericId), e),
        assertion: { id: "userID" },
        fields: ["seeding", "seedingSize"],
      },
      {
        requestConfig: {
          url: "/user/account/uploadedtorrents",
          responseType: "document",
          params: { userID: "PLACEHOLDER" },
        },
        requestConfigTransformer: (e, r) => (r && r.numericId && (e.params.userID = r.numericId), e),
        assertion: { id: "userID" },
        fields: [],
      },
      {
        requestConfig: {
          url: "/user/account/uploadedtorrents",
          method: "POST",
          responseType: "json",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json, text/javascript, */*; q=0.01",
            Origin: "https://pussytorrents.org",
            Referer: "https://pussytorrents.org/user/account/uploadedtorrents",
          },
          data: {
            sEcho: 1,
            iColumns: 5,
            sColumns: "name,size,completed,seeders,leechers",
            iDisplayStart: 0,
            iDisplayLength: 50,
            sNames: "name,size,completed,seeders,leechers",
            sSearch: "",
            bRegex: !1,
            sSearch_0: "",
            bRegex_0: !1,
            bSearchable_0: !0,
            sSearch_1: "",
            bRegex_1: !1,
            bSearchable_1: !0,
            sSearch_2: "",
            bRegex_2: !1,
            bSearchable_2: !0,
            sSearch_3: "",
            bRegex_3: !1,
            bSearchable_3: !0,
            sSearch_4: "",
            bRegex_4: !1,
            bSearchable_4: !0,
            iSortingCols: 1,
            iSortCol_0: 0,
            sSortDir_0: "asc",
            bSortable_0: !1,
            bSortable_1: !0,
            bSortable_2: !0,
            bSortable_3: !0,
            bSortable_4: !0,
            userID: "PLACEHOLDER",
          },
        },
        requestConfigTransformer: (e, r) => (r && r.numericId && (e.data.userID = r.numericId), e),
        assertion: { id: "userID" },
        fields: ["uploads"],
      },
    ],
    selectors: {
      id: {
        selector: "#memberBar .span8 a[href*='/profile/']",
        attr: "href",
        filters: [
          (e) => {
            const r = e.match(/\/profile\/([^\/]+)/);
            return r ? r[1] : "";
          },
        ],
      },
      name: { selector: "#memberBar .span8 a[href*='/profile/']" },
      messageCount: { selector: "a[href='/users/messages'] i.news-notify", filters: [(e) => parseInt(e) || 0] },
      uploaded: { selector: "#profile button:has(.icon-arrow-up)", filters: [(e) => s(e)] },
      downloaded: { selector: "#profile button:has(.icon-arrow-down)", filters: [(e) => s(e)] },
      levelName: { selector: "#profileTable td:contains('Class') + td" },
      joinTime: {
        selector: "#profileTable td:contains('Join Date') + td",
        filters: [
          (e) => {
            const r = e.replace(/(\d+)(st|nd|rd|th)/, "$1");
            return new Date(r).getTime();
          },
        ],
      },
      numericId: { selector: 'a[href="#snatchlist"][data-ajax="/user/account/snatchlist"]', attr: "data-userid" },
      seeding: {
        selector: "aaData",
        filters: [(e) => (Array.isArray(e) ? e.filter((r) => r[7] === 1 && r[8] === "Yes").length : 0)],
      },
      seedingSize: {
        selector: "aaData",
        filters: [
          (e) =>
            Array.isArray(e) ? e.reduce((r, t) => (t[7] === 1 && t[8] === "Yes" && t[1] ? r + s(t[1]) : r), 0) : 0,
        ],
      },
      uploads: { selector: "iTotalRecords", filters: [(e) => e] },
    },
  },
  noLoginAssert: { matchSelectors: ["div#loginContainer"] },
};
class L extends o {
  siteMetadata = i;
}
export { L as default, i as siteMetadata };
