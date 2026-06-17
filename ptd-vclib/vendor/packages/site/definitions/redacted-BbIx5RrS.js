import i, { SchemaMetadata as t } from "../schemas/GazelleJSONAPI-1mDVuO-b.js";
import "../schemas/Gazelle-C72SbirH.js";
import "../index-COeZNva1.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
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
const k = {
  ...t,
  version: 1,
  id: "redacted",
  name: "Redacted",
  aka: ["RED", "红"],
  description: "Redacted is a music-focused private tracker",
  tags: ["音乐"],
  timezoneOffset: "+0000",
  collaborator: ["ylxb2016", "enigamz"],
  type: "private",
  schema: "GazelleJSONAPI",
  urls: ["uggcf://erqnpgrq.fu/"],
  legacyUrls: ["uggcf://erqnpgrq.pu/"],
  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "Music", value: 1 },
        { name: "Applications", value: 2 },
        { name: "E-Books", value: 3 },
        { name: "Audiobooks", value: 4 },
        { name: "E-Learning Videos", value: 5 },
        { name: "Comedy", value: 6 },
        { name: "Comics", value: 7 },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "发行类别",
      key: "releasetype",
      options: [
        { name: "Album", value: 1 },
        { name: "Soundtrack", value: 3 },
        { name: "EP", value: 5 },
        { name: "Anthology", value: 6 },
        { name: "Compilation", value: 7 },
        { name: "Single", value: 9 },
        { name: "Live album", value: 11 },
        { name: "Remix", value: 13 },
        { name: "Bootleg", value: 14 },
        { name: "Interview", value: 15 },
        { name: "Mixtape", value: 16 },
        { name: "Demo", value: 17 },
        { name: "Concert Recording", value: 18 },
        { name: "DJ Mix", value: 19 },
        { name: "Unknown", value: 21 },
      ],
    },
  ],
  search: { ...t.search, advanceKeywordParams: { imdb: !1 } },
  userInfo: {
    ...t.userInfo,
    selectors: {
      ...t.userInfo.selectors,
      bonus: { text: "N/A" },
      bonusPerHour: { text: "N/A" },
      seedingSize: { selector: ["response.seedingsize"], filters: [{ name: "parseSize" }] },
    },
  },
  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "Member", interval: "P1W", uploaded: "10GB", ratio: 0.65, privilege: "" },
    {
      id: 3,
      name: "Power User",
      interval: "P2W",
      uploads: 5,
      uploaded: "25GB",
      ratio: 0.65,
      isKept: !0,
      privilege: "Invites forums; Immunity from inactivity disabling",
    },
    { id: 4, name: "Elite", interval: "P4W", uploads: 50, uploaded: "100GB", ratio: 0.65, isKept: !0, privilege: "" },
    {
      id: 5,
      name: "Torrent Master",
      interval: "P8W",
      uploads: 500,
      uploaded: "500GB",
      ratio: 0.65,
      isKept: !0,
      privilege: "Unlimited invites",
    },
    {
      id: 6,
      name: "Power TM",
      interval: "P8W",
      uniqueGroups: 500,
      uploaded: "500GB",
      ratio: 0.65,
      isKept: !0,
      privilege: "",
    },
    {
      id: 7,
      name: "Elite TM",
      interval: "P8W",
      perfectFlacs: 500,
      uploaded: "500GB",
      ratio: 0.65,
      isKept: !0,
      privilege: "",
    },
  ],
};
class q extends i {
  async transformUnGroupTorrent(e) {
    const a = await super.transformUnGroupTorrent(e);
    return (e.isFreeload && a.tags?.push({ name: "Freeload", color: "red" }), a);
  }
  async transformGroupTorrent(e, a) {
    const r = await super.transformGroupTorrent(e, a);
    return (a.isFreeload && r.tags?.push({ name: "Freeload", color: "red" }), r);
  }
  async getSeedingSize(e, a = 0) {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: r } = await this.requestApi("community_stats", { userid: e });
    return this.getFieldsData(r, this.metadata.userInfo.selectors, ["seedingSize"]);
  }
}
export { q as default, k as siteMetadata };
