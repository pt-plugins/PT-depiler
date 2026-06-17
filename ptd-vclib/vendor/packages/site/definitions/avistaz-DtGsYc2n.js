import s, { SchemaMetadata as i, avzNetDiscountMap as m } from "../schemas/AvistazNetwork-DRR5w4bb.js";
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
  d = { 1: "SD", 2: "720p", 3: "1080p", 6: "2160p", 7: "1080i", 8: "4320p" },
  l = { 1: "Single Episode", 2: "Full Season", 3: "Complete" },
  x = {
    ...i,
    version: 1,
    id: "avistaz",
    name: "AvistaZ",
    aka: ["Avz"],
    description: "AvistaZ (AsiaTorrents) is a Private Torrent Tracker for ASIAN MOVIES / TV / GENERAL",
    tags: ["电影", "电视剧", "综合"],
    timezoneOffset: "+0100",
    type: "private",
    schema: "AvistazNetwork",
    urls: ["uggcf://nivfgnm.gb/"],
    collaborator: ["zdm9981"],
    category: [
      {
        name: "分类",
        key: "category",
        keyPath: "params",
        options: Object.entries(u).map(([t, a]) => ({ name: a, value: Number(t) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "分辨率",
        key: "res",
        keyPath: "params",
        options: Object.entries(d).map(([t, a]) => ({ name: a, value: Number(t) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "剧集包",
        key: "tv_type",
        keyPath: "params",
        options: Object.entries(l).map(([t, a]) => ({ name: a, value: Number(t) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "促销",
        key: "discount",
        keyPath: "params",
        options: Object.entries(m).map(([t, a]) => ({ name: a, value: Number(t) })),
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
    levelRequirements: [
      {
        id: 1,
        name: "Leech",
        privilege: "Can download 1 torrent a day. Limited to download torrents uploaded 1 week ago. Cannot upload.",
      },
      { id: 2, name: "Newbie", privilege: "Can download 5 torrents a day. Cannot upload. Cannot use RSS." },
      {
        id: 3,
        name: "Member",
        alternative: [{ ratio: 1 }, { interval: "P1W" }],
        privilege: "Can download 100 torrents a day. Can upload. Can use RSS (must enable it in My Account settings).",
      },
      { id: 100, name: "V.I.P.", groupType: "vip", privilege: "Can download 200 torrents a day. Can upload." },
      { id: 200, name: "Uploader", groupType: "manager", privilege: "Can upload." },
      { id: 201, name: "Editor", groupType: "manager", privilege: "Can upload." },
      { id: 203, name: "Moderator", groupType: "manager" },
      { id: 204, name: "Admin", groupType: "manager" },
      { id: 205, name: "Super Admin", groupType: "manager" },
    ],
    userInputSettingMeta: [...i.userInputSettingMeta],
  };
class B extends s {
  parseTorrentRowForTags(a, o, p) {
    const n = super.parseTorrentRowForTags(a, o, p),
      r = n.tags || [];
    return (
      o.movie_tv?.tv_complete && r.push({ name: "完结" }),
      (o.audio?.map((e) => e.language).filter((e) => e.trim() !== "") || []).some((e) =>
        /Chinese|Cantonese/i.test(e),
      ) && r.push({ name: "中配" }),
      (o.subtitle?.map((e) => e.language).filter((e) => e.trim() !== "") || []).some((e) => /Chinese/i.test(e)) &&
        r.push({ name: "中字" }),
      (n.tags = r),
      n
    );
  }
}
export { B as default, x as siteMetadata };
