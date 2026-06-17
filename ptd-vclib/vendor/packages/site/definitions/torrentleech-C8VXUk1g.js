import { u } from "../../../url-join/url-join-Cu798wIg.js";
import { K as p, S as f } from "../index-COeZNva1.js";
import { m as n } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import { E as l } from "../types/base-Dy_28wGT.js";
import { p as g } from "../utils/filesize-D_1hx4u8.js";
import S from "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
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
const c = [
    { value: 8, name: "Movies :: Cam" },
    { value: 9, name: "Movies :: TS/TC" },
    { value: 11, name: "Movies :: DVDRip/DVDScreener" },
    { value: 37, name: "Movies :: WEBRip" },
    { value: 43, name: "Movies :: HDRip" },
    { value: 14, name: "Movies :: BlurayRip" },
    { value: 12, name: "Movies :: DVD-R" },
    { value: 13, name: "Movies :: Bluray" },
    { value: 47, name: "Movies :: 4K" },
    { value: 15, name: "Movies :: Boxsets" },
    { value: 29, name: "Movies :: Documentaries" },
    { value: 26, name: "TV :: Episodes" },
    { value: 32, name: "TV :: Episodes HD" },
    { value: 27, name: "TV :: Boxsets" },
    { value: 17, name: "Games :: PC" },
    { value: 42, name: "Games :: Mac" },
    { value: 18, name: "Games :: XBOX" },
    { value: 19, name: "Games :: XBOX360" },
    { value: 40, name: "Games :: XBOXONE" },
    { value: 20, name: "Games :: PS2" },
    { value: 21, name: "Games :: PS3" },
    { value: 39, name: "Games :: PS4" },
    { value: 22, name: "Games :: PSP" },
    { value: 28, name: "Games :: Wii" },
    { value: 30, name: "Games :: Nintendo DS" },
    { value: 48, name: "Games :: Nintendo Switch" },
    { value: 23, name: "Apps :: PC-ISO" },
    { value: 24, name: "Apps :: Mac" },
    { value: 25, name: "Apps :: Mobile" },
    { value: 33, name: "Apps :: 0-day" },
    { value: 38, name: "Education" },
    { value: 34, name: "Animation :: Anime" },
    { value: 35, name: "Animation :: Cartoons" },
    { value: 45, name: "Books :: EBooks" },
    { value: 46, name: "Books :: Comics" },
    { value: 31, name: "Music :: Audio" },
    { value: 16, name: "Music :: Music videos" },
    { value: 36, name: "Foreign :: Movies" },
    { value: 44, name: "Foreign :: TV Series" },
  ],
  k = {
    id: "torrentleech",
    version: 1,
    name: "TorrentLeech",
    aka: ["TL"],
    description: "TorrentLeech (TL) is a Private Torrent Tracker for 0DAY / GENERAL. not here _ not scene",
    tags: ["综合"],
    timezoneOffset: "+0000",
    type: "private",
    schema: "AbstractPrivateSite",
    urls: [
      "https://www.torrentleech.org/",
      "https://www.torrentleech.cc/",
      "https://www.torrentleech.me/",
      "https://www.tleechreload.org/",
      "https://www.tlgetin.cc/",
    ],
    category: [
      {
        name: "Category",
        key: "category",
        options: c,
        cross: { mode: "custom" },
        generateRequestConfig(t) {
          return {
            requestConfig: { url: `/torrents/browse/list/categories/${Array.isArray(t) ? t.join(",") : t}/query` },
          };
        },
      },
    ],
    search: {
      requestConfig: { url: "/torrents/browse/list/query", responseType: "json" },
      advanceKeywordParams: { imdb: { enabled: !0 } },
      requestConfigTransformer: ({ keywords: t, searchEntry: a, requestConfig: e }) => {
        const s = e.url || "";
        return (t && (delete e.params?.keywords, (t = t.replace(/(^|\s)-/, "")), (e.url = u(s, `${t}`))), e);
      },
      selectors: {
        rows: { selector: "torrentList" },
        id: { selector: "fid" },
        title: { selector: "name" },
        url: { selector: "fid", filters: [{ name: "prepend", args: ["/torrent/"] }] },
        link: { selector: ":self", filters: [(t) => "/download/" + t.fid + "/" + t.filename] },
        time: { selector: "addedTimestamp", filters: [{ name: "parseTime" }] },
        size: { selector: "size" },
        author: { selector: "uploader" },
        seeders: { selector: "seeders" },
        leechers: { selector: "leechers" },
        completed: { selector: "numComments" },
        category: { selector: "categoryID", filters: [(t) => c.find((a) => a.value == t)?.name ?? "Unknown"] },
        ext_imdb: { selector: "imdbID" },
        ext_tvmaze: { selector: "tvmazeID", filters: [(t) => (t.charAt(0) === "e" ? null : t.slice(1))] },
      },
    },
    list: [
      {
        urlPattern: ["/torrents/browse"],
        mergeSearchSelectors: !1,
        selectors: {
          rows: { selector: "table.torrents tr.torrent" },
          id: { selector: ":self", data: "tid" },
          category: { selector: "a.category[data-ccid]", data: "ccid" },
          title: {
            selector: "div.name",
            elementProcess: (t) => (
              t?.querySelectorAll("span")?.forEach((a) => a?.remove()),
              t?.textContent?.trim() ?? ""
            ),
          },
          url: { selector: "div.name a", attr: "href" },
          link: { selector: "a.download", attr: "href" },
          seeders: { selector: "td.td-seeders" },
          leechers: { selector: "td.td-leechers" },
          completed: { selector: "td.td-snatched" },
          size: { selector: "td.td-size", filters: [{ name: "parseSize" }] },
          time: { selector: "td.td-uploaded-time", filters: [{ name: "parseTime", args: ["yyyy-MM-ddHH:mm:ss"] }] },
        },
      },
    ],
    detail: {
      urlPattern: ["/torrent/\\d+"],
      selectors: {
        id: { selector: 'input[name="torrentID"]', attr: "value" },
        title: { selector: ["#torrentnameid", "#torrentName"] },
        link: { selector: "#detailsDownloadButton", attr: "href" },
      },
    },
    userInfo: {
      pickLast: ["id", "name"],
      process: [
        {
          requestConfig: { url: "/", responseType: "document" },
          selectors: {
            name: { selector: "span.centerTopBar span[onclick*='/profile/'][onclick*='view']" },
            uploaded: { selector: "span.centerTopBar div[title^='Uploaded'] span", filters: [{ name: "parseSize" }] },
            downloaded: {
              selector: "span.centerTopBar div[title^='Downloaded'] span",
              filters: [{ name: "parseSize" }],
            },
            bonus: { selector: "span.centerTopBar span.total-TL-points", filters: [{ name: "parseNumber" }] },
            messageCount: {
              text: "0",
              selector: "span.div-menu-item[onclick*='/notifications'] div.notificatinTooltip span.tooltip-title",
              filters: [{ name: "parseNumber" }],
            },
          },
        },
        {
          requestConfig: { url: "/profile/$name$", responseType: "document" },
          assertion: { name: "url" },
          selectors: {
            id: {
              selector: "script:contains('userLogUserID')",
              filters: [(t) => t.match(/var userLogUserID = '(\d+)';/)?.[1] ?? ""],
            },
            levelName: { selector: "div.profile-details div.label-user-class" },
            joinTime: {
              selector: "table.profileViewTable td:contains('Registration date') + td",
              filters: [{ name: "parseTime", args: ["EEEE do MMMM yyyy"] }],
            },
            lastAccessAt: {
              selector: "table.profileViewTable td:contains('Last visit') + td",
              filters: [
                { name: "split", args: [" (", 0] },
                { name: "parseTime", args: ["EEEE do MMMM yyyy hh:mm:ss a"] },
              ],
            },
          },
        },
        {
          requestConfig: {
            url: "/user/account/uploadedtorrents",
            method: "POST",
            responseType: "json",
            data: {
              sEcho: "1",
              iColumns: "6",
              sColumns: "categoryID,name,size,completed,seeders,leechers",
              iDisplayStart: "0",
              iDisplayLength: "50",
              mDataProp_0: "0",
              sSearch_0: "",
              bRegex_0: "false",
              bSearchable_0: "true",
              bSortable_0: "false",
              mDataProp_1: "1",
              sSearch_1: "",
              bRegex_1: "false",
              bSearchable_1: "true",
              bSortable_1: "false",
              mDataProp_2: "2",
              sSearch_2: "",
              bRegex_2: "false",
              bSearchable_2: "true",
              bSortable_2: "true",
              mDataProp_3: "3",
              sSearch_3: "",
              bRegex_3: "false",
              bSearchable_3: "true",
              bSortable_3: "true",
              mDataProp_4: "4",
              sSearch_4: "",
              bRegex_4: "false",
              bSearchable_4: "true",
              bSortable_4: "true",
              mDataProp_5: "5",
              sSearch_5: "",
              bRegex_5: "false",
              bSearchable_5: "true",
              bSortable_5: "true",
              sSearch: "",
              bRegex: "false",
              iSortCol_0: "0",
              sSortDir_0: "asc",
              iSortingCols: "1",
              userID: "$id$",
            },
            headers: {
              Accept: "application/json, text/javascript, */*; q=0.01",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
          },
          assertion: { id: "valid" },
          selectors: { uploads: { selector: ":self", filters: [(t) => t.iTotalRecords || 0] } },
        },
      ],
    },
    noLoginAssert: { matchSelectors: ["div.login-container form[name='login-form']"] },
    levelRequirements: [
      { id: 0, name: "User", privilege: "" },
      {
        id: 1,
        name: "Power User",
        interval: "P2W",
        uploaded: "200GB",
        ratio: 1.1,
        privilege: "Increased Points: 3%, Minimum Seeding Time: 8 days",
      },
      {
        id: 2,
        name: "Super User",
        interval: "P12W",
        uploaded: "1TB",
        ratio: 2,
        privilege: "Increased Points: 5%, Minimum Seeding Time: 7 days",
      },
      {
        id: 3,
        name: "Extreme User",
        interval: "P24W",
        uploaded: "10TB",
        ratio: 5,
        privilege: "Increased Points: 6%, Minimum Seeding Time: 6 days",
      },
      {
        id: 4,
        name: "TL GOD",
        interval: "P52W",
        uploaded: "50TB",
        ratio: 8,
        privilege: "Increased Points: 8%, Minimum Seeding Time: 4 days",
      },
    ],
  };
class F extends S {
  async getUserInfoResult(a = {}) {
    let e = await super.getUserInfoResult(a);
    return (
      e.status === l.success &&
        (typeof e.seeding > "u" || typeof e.seedingSize > "u") &&
        (e = await this.parseUserInfoForSeedingStatus(e)),
      e.status === l.success &&
        e.id &&
        (typeof e.uploads > "u" || typeof e.uploads == "number") &&
        (e = await this.parseUserInfoForUploads(e)),
      e
    );
  }
  parseTorrentRowForTags(a, e, s) {
    return (
      (a.tags ??= []),
      e.tags?.includes("FREELEECH") && a.tags.push({ name: "Free", color: "blue" }),
      a.tags.push({ name: "H&R", color: "red" }),
      a
    );
  }
  async parseUserInfoForSeedingStatus(a) {
    let e = { seeding: 0, seedingSize: 0 };
    const s = a.name,
      { data: i } = await this.request({ url: `/profile/${s}/seeding` });
    if (i && i.includes("profile-seedingTable")) {
      const r = p(i),
        o = f("table#profile-seedingTable > tbody > tr > td:nth-child(2)", r);
      ((e.seeding = o.length),
        o.forEach((m) => {
          const d = m.textContent?.trim() || "0";
          e.seedingSize += g(d);
        }));
    }
    return n(a, e, (r, o) => (typeof o > "u" ? r : o));
  }
  async parseUserInfoForUploads(a) {
    const e = a.id;
    if (!e) return a;
    try {
      const { data: s } = await this.request({
        url: "/user/account/uploadedtorrents",
        method: "POST",
        data: {
          sEcho: "1",
          iColumns: "6",
          sColumns: "categoryID,name,size,completed,seeders,leechers",
          iDisplayStart: "0",
          iDisplayLength: "50",
          mDataProp_0: "0",
          sSearch_0: "",
          bRegex_0: "false",
          bSearchable_0: "true",
          bSortable_0: "false",
          mDataProp_1: "1",
          sSearch_1: "",
          bRegex_1: "false",
          bSearchable_1: "true",
          bSortable_1: "false",
          mDataProp_2: "2",
          sSearch_2: "",
          bRegex_2: "false",
          bSearchable_2: "true",
          bSortable_2: "true",
          mDataProp_3: "3",
          sSearch_3: "",
          bRegex_3: "false",
          bSearchable_3: "true",
          bSortable_3: "true",
          mDataProp_4: "4",
          sSearch_4: "",
          bRegex_4: "false",
          bSearchable_4: "true",
          bSortable_4: "true",
          mDataProp_5: "5",
          sSearch_5: "",
          bRegex_5: "false",
          bSearchable_5: "true",
          bSortable_5: "true",
          sSearch: "",
          bRegex: "false",
          iSortCol_0: "0",
          sSortDir_0: "asc",
          iSortingCols: "1",
          userID: e,
        },
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (s && s.aaData) {
        const i = {
          uploads: s.iTotalRecords || 0,
          uploadsList: s.aaData.map((r) => ({
            category: r[0] || "",
            name: r[1] || "",
            size: r[2] || "",
            completed: r[3] || "",
            seeders: r[4] || "",
            leechers: r[5] || "",
          })),
        };
        return n(a, i, (r, o) => (typeof o > "u" ? r : o));
      }
    } catch {}
    return a;
  }
}
export { F as default, k as siteMetadata };
