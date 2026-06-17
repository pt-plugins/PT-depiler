import s, { SchemaMetadata as i } from "../schemas/AvistazNetwork-DRR5w4bb.js";
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
const m = { 0: "All", 1: "Movie", 2: "TV-Show" },
  d = { 1: "720p", 2: "1080p", 3: "2160p", 4: "1080i", 5: "4320p" },
  u = { 1: "Single Episode", 2: "Full Season", 3: "Complete" },
  l = { 1: "Free-Download", 2: "Half-Download", 3: "Double Upload" },
  Q = {
    ...i,
    version: 1,
    id: "privatehd",
    name: "PrivateHD",
    aka: ["PHD"],
    description: "PrivateHD is a Private Torrent Tracker of AvistaZ Network",
    tags: ["电影", "高清"],
    timezoneOffset: "+0100",
    type: "private",
    schema: "AvistazNetwork",
    urls: ["uggcf://cevingruq.gb/"],
    favicon: "./privatehd.png",
    collaborator: ["zdm9981"],
    category: [
      {
        name: "分类",
        key: "category",
        keyPath: "params",
        options: Object.entries(m).map(([a, e]) => ({ name: e, value: Number(a) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "分辨率",
        key: "res",
        keyPath: "params",
        options: Object.entries(d).map(([a, e]) => ({ name: e, value: Number(a) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "剧集包",
        key: "tv_type",
        keyPath: "params",
        options: Object.entries(u).map(([a, e]) => ({ name: e, value: Number(a) })),
        cross: { mode: "appendQuote" },
      },
      {
        name: "促销",
        key: "discount",
        keyPath: "params",
        options: Object.entries(l).map(([a, e]) => ({ name: e, value: Number(a) })),
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
class x extends s {
  parseTorrentRowForTags(e, t, p) {
    const r = super.parseTorrentRowForTags(e, t, p),
      o = r.tags || [];
    return (
      t.movie_tv?.tv_complete && o.push({ name: "完结" }),
      t.audio?.some((n) => /Chinese|Cantonese/i.test(n.language)) && o.push({ name: "中配" }),
      t.subtitle?.some((n) => /Chinese/i.test(n.language)) && o.push({ name: "中字" }),
      (r.tags = o),
      r
    );
  }
}
export { x as default, Q as siteMetadata };
