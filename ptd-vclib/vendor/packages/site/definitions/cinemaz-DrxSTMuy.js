import p, { SchemaMetadata as i, avzNetDiscountMap as m } from "../schemas/AvistazNetwork-DRR5w4bb.js";
import "../../../url-join/url-join-Cu798wIg.js";
import "../index-COeZNva1.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
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
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const u = { 0: "All", 1: "Movies", 2: "TV", 3: "Music" },
  c = { 1: "SD", 2: "720p", 3: "1080p", 6: "2160p", 7: "1080i", 8: "4320p" },
  l = { 1: "Single Episode", 2: "Full Season", 3: "Complete" },
  F = {
    ...i,
    version: 1,
    id: "cinemaz",
    name: "CinemaZ",
    description: "CinemaZ is a Private Torrent Tracker for FOREIGN NON-ENGLISH MOVIES / TV / GENERAL",
    tags: ["电影", "电视剧", "外语"],
    timezoneOffset: "+0100",
    type: "private",
    schema: "AvistazNetwork",
    urls: ["uggcf://pvarznm.gb/"],
    category: [
      {
        name: "分类",
        key: "category",
        keyPath: "params",
        options: Object.entries(u).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "分辨率",
        key: "res",
        keyPath: "params",
        options: Object.entries(c).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "剧集包",
        key: "tv_type",
        keyPath: "params",
        options: Object.entries(l).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "促销",
        key: "discount",
        keyPath: "params",
        options: Object.entries(m).map(([t, e]) => ({ name: e, value: Number(t) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "特殊",
        key: "special",
        options: [
          { name: "Adult Torrents", value: "adult" },
          { name: "Newbie Downloadable", value: "newbie" },
          { name: "Dying Torrents", value: "dying" },
          { name: "Dead Torrents", value: "dead" },
          { name: "Big Torrents (10GB+)", value: "big" },
          { name: "Huge Torrents (99GB+)", value: "huge" },
        ],
      },
    ],
    userInputSettingMeta: [...i.userInputSettingMeta],
  };
class Q extends p {
  parseTorrentRowForTags(e, a, n) {
    const r = super.parseTorrentRowForTags(e, a, n),
      o = r.tags || [];
    return (
      a.movie_tv?.tv_complete && o.push({ name: "完结" }),
      a.audio?.some((s) => /Chinese|Cantonese/i.test(s.language)) && o.push({ name: "中配" }),
      a.subtitle?.some((s) => /Chinese/i.test(s.language)) && o.push({ name: "中字" }),
      (r.tags = o),
      r
    );
  }
}
export { Q as default, F as siteMetadata };
