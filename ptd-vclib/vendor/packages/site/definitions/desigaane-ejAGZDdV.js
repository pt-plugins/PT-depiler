import { SchemaMetadata as e } from "../schemas/GazelleJSONAPI-1mDVuO-b.js";
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
  ...e,
  version: 1,
  id: "desigaane",
  name: "DesiGaane",
  aka: ["DG"],
  description: "DesiGaane is a private tracker focused on Indian music",
  tags: ["音楽", "印度音乐"],
  timezoneOffset: "+0000",
  collaborator: [],
  type: "private",
  schema: "GazelleJSONAPI",
  urls: ["https://desigaane.rocks/"],
  search: { ...e.search, advanceKeywordParams: { imdb: !1 } },
  levelRequirements: [
    { id: 1, name: "User", privilege: "None" },
    { id: 2, name: "Member", interval: "P1W", uploaded: "10B", ratio: 0.6, privilege: "Invites" },
    { id: 3, name: "Power User", interval: "P2W", uploads: 5, uploaded: "25GB", ratio: 0.65, privilege: "" },
    { id: 4, name: "Elite", interval: "P4W", uploads: 50, uploaded: "100GB", ratio: 0.65, privilege: "" },
    { id: 5, name: "Torrent Master", interval: "P8W", uploads: 500, uploaded: "500GB", ratio: 0.65, privilege: "" },
    { id: 6, name: "Power TM", interval: "P8W", uploads: 500, uploaded: "500GB", ratio: 0.65, privilege: "" },
    { id: 7, name: "Elite TM", interval: "P8W", uploads: 500, uploaded: "500GB", ratio: 0.65, privilege: "" },
  ],
};
export { k as siteMetadata };
