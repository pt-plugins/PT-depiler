import { SchemaMetadata as e } from "../schemas/Unit3D-ChxolkI5.js";
import "../../../url-join/url-join-Cu798wIg.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../index-COeZNva1.js";
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
const D = {
  ...e,
  version: 1,
  id: "shareisland",
  name: "ShareIsland",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",
  collaborator: ["haowenwu"],
  type: "private",
  schema: "Unit3D",
  urls: ["uggcf://funervfynaq.bet/"],
  levelRequirements: [
    { id: 1, name: "User", ratio: 0.4, privilege: "4下载槽" },
    { id: 2, name: "ShareUser", uploaded: "1TiB", interval: "P1M", privilege: "8下载槽" },
    { id: 3, name: "SuperUser", uploaded: "5TiB", interval: "P2M", privilege: "10下载槽" },
    { id: 4, name: "ExtremeUser", uploaded: "20TiB", interval: "P3M", privilege: "自动通过候选 无限下载槽" },
    { id: 5, name: "InsaneUser", uploaded: "50TiB", interval: "P6M" },
    { id: 6, name: "Veteran", uploaded: "100TiB", interval: "P12M" },
    { id: 7, name: "ShareArchivist", seedingSize: "5TiB", interval: "P1M", averageSeedingTime: "P30D" },
    { id: 8, name: "Seeder", seedingSize: "10TiB", interval: "P3M", averageSeedingTime: "P60D" },
  ],
};
export { D as siteMetadata };
