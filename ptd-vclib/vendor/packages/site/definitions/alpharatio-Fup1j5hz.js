import p, { SchemaMetadata as i } from "../schemas/GazelleJSONAPI-1mDVuO-b.js";
import { c5 as u, bD as d } from "../index-COeZNva1.js";
import { t as v } from "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../schemas/Gazelle-C72SbirH.js";
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
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const o = ({ keywords: n, requestConfig: e }) => (n && (u(e, i.search.keywordPath), d(e, "params.taglist", n)), e),
  C = {
    ...i,
    version: 1,
    id: "alpharatio",
    name: "AlphaRatio",
    aka: ["AR"],
    description: "AlphaRatio (AR) is a Private Torrent Tracker for 0DAY / GENERAL",
    tags: ["综合", "0day"],
    timezoneOffset: "+0000",
    collaborator: ["enigamz"],
    type: "private",
    schema: "GazelleJSONAPI",
    urls: ["https://alpharatio.cc/"],
    category: [
      {
        name: "Category",
        key: "filter_cat",
        options: [
          { value: 1, name: "Tv/SD" },
          { value: 2, name: "Tv/HD" },
          { value: 3, name: "Tv/UHD" },
          { value: 4, name: "Tv/DVDRip" },
          { value: 5, name: "Tv/PackSD" },
          { value: 6, name: "Tv/PackHD" },
          { value: 7, name: "Tv/PackUHD" },
          { value: 8, name: "Movie/SD" },
          { value: 9, name: "Movie/HD" },
          { value: 10, name: "Movie/UHD" },
          { value: 11, name: "Movie/PackSD" },
          { value: 12, name: "Movie/PackHD" },
          { value: 13, name: "Movie/PackUHD" },
          { value: 14, name: "Movie/XXX" },
          { value: 15, name: "Bluray" },
          { value: 16, name: "Anime/SD" },
          { value: 17, name: "Anime/HD" },
          { value: 18, name: "Games/PC" },
          { value: 19, name: "Games/xBox" },
          { value: 20, name: "Games/PS" },
          { value: 21, name: "Games/Nin" },
          { value: 22, name: "Apps/Windows" },
          { value: 23, name: "Apps/MAC" },
          { value: 24, name: "Apps/Linux" },
          { value: 25, name: "Apps/Mobile" },
          { value: 26, name: "0day/XXX" },
          { value: 27, name: "eBook" },
          { value: 28, name: "AudioBook" },
          { value: 29, name: "Music" },
          { value: 30, name: "Misc" },
        ],
        cross: { mode: "append" },
      },
    ],
    search: {
      ...i.search,
      advanceKeywordParams: { imdb: { requestConfigTransformer: o }, tvmaze: { requestConfigTransformer: o } },
    },
    userInfo: {
      ...i.userInfo,
      selectors: {
        ...i.userInfo.selectors,
        donation: { selector: "li:contains('Donated:')", filters: [{ name: "parseNumber" }] },
        seedingBonus: { selector: "li:contains('SeedBonus:')", filters: [{ name: "parseNumber" }] },
      },
    },
    levelRequirements: [
      { id: 1, name: "Mortal" },
      {
        id: 2,
        name: "Philosopher",
        interval: "P4W",
        uploaded: "80GB",
        seedingBonus: 6e4,
        privilege: "Mortal privileges plus can invite users, upload torrents, and submit requests.",
      },
      {
        id: 3,
        name: "Gladiator",
        interval: "P8W",
        uploaded: "260GB",
        seedingBonus: 12e4,
        privilege: "Philosopher privileges plus can use bookmarks and view top ten user/torrent stats.",
      },
      {
        id: 4,
        name: "Giant",
        interval: "P12W",
        uploaded: "600GB",
        seedingBonus: 36e4,
        privilege: "Gladiator privileges plus can create polls in the forum.",
      },
      {
        id: 5,
        name: "Centaur",
        interval: "P18W",
        uploaded: "1.6TB",
        seedingBonus: 72e4,
        privilege: "Giant privileges.",
      },
      {
        id: 6,
        name: "Sphinx",
        interval: "P26W",
        uploaded: "3.2TB",
        seedingBonus: 144e4,
        privilege: "Centaur privileges plus access to the Invite Forum.",
      },
      { id: 7, name: "Harpy", interval: "P38W", uploaded: "6TB", seedingBonus: 192e4, privilege: "Sphinx privileges." },
      {
        id: 8,
        name: "Satyr",
        interval: "P60W",
        uploaded: "12TB",
        seedingBonus: 24e5,
        privilege: "Harpy privileges plus exemption from hit and runs and can see other users' active torrents.",
      },
      {
        id: 9,
        name: "Adonis",
        interval: "P60W",
        uploaded: "12TB",
        seedingBonus: 2e6,
        donation: 50,
        privilege: "Harpy privileges plus exemption from hit and runs and can see other users' active torrents.",
      },
      {
        id: 10,
        name: "Cyclops",
        interval: "P90W",
        uploaded: "18TB",
        seedingBonus: 48e5,
        privilege: "Satyr privileges.",
      },
      {
        id: 11,
        name: "Chimera",
        interval: "P90W",
        uploaded: "18TB",
        seedingBonus: 4e6,
        donation: 200,
        privilege: "Satyr privileges.",
      },
      {
        id: 12,
        name: "Deity",
        groupType: "vip",
        privilege:
          "Given by Staff at their discretion. Same as Satyr privileges plus can send invites even when invites are closed.",
      },
      {
        id: 13,
        name: "Spartan",
        groupType: "vip",
        interval: "P120W",
        uploaded: "10TB",
        seedingBonus: 62e5,
        donation: 400,
        privilege: "Same as Deity privileges.",
      },
    ],
  },
  l = /tt\d+/,
  m = /^(?:tvmaze\.)?(\d+)$/;
class N extends p {
  async transformUnGroupTorrent(e) {
    const a = await super.transformUnGroupTorrent(e);
    a.tags?.push({ name: "H&R" });
    const t = e.tags.find((r) => l.test(r))?.match(l)?.[0];
    t && (a.ext_imdb = t);
    const s = e.tags.find((r) => m.test(r))?.match(m)?.[1];
    return (s && (a.ext_tvmaze = s), a);
  }
  async getUserExtendInfo(e) {
    const a = await super.getUserExtendInfo(e);
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: t } = await this.request({ url: "/user.php", params: { id: e }, responseType: "document" });
    return v(a, this.getFieldsData(t, this.metadata.userInfo.selectors, ["donation", "seedingBonus"]));
  }
}
export { N as default, C as siteMetadata };
