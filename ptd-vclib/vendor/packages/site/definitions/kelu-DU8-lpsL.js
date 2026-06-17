import { SchemaMetadata as e } from "../schemas/NexusPHP-BNC4SlPA.js";
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
  id: "kelu",
  name: "Kelu",
  tags: ["成人"],
  timezoneOffset: "+0800",
  type: "private",
  schema: "NexusPHP",
  collaborator: ["haowenwu"],
  urls: ["https://our.kelu.one/"],
  levelRequirements: [
    {
      id: 1,
      name: "魔法助手",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 1e4,
      privilege: "首次升级至此等级的用户将获得1个邀请名额",
    },
    { id: 2, name: "准魔法师", interval: "P8W", downloaded: "120GB", ratio: 1.55, seedingBonus: 8e4 },
    {
      id: 3,
      name: "魔法师",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 1.95,
      seedingBonus: 15e4,
      privilege: "首次升级至此等级的用户将获得2个邀请名额",
    },
    { id: 4, name: "大魔法师", interval: "P25W", downloaded: "500GB", ratio: 2.55, seedingBonus: 25e4 },
    {
      id: 5,
      name: "圣域魔导师",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingBonus: 8e5,
      privilege: "首次升级至此等级的用户将获得5个邀请名额",
    },
    {
      id: 6,
      name: "神域魔导师",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingBonus: 1e6,
      privilege: "首次升级至此等级的用户将获得10个邀请名额",
    },
  ],
};
export { k as siteMetadata };
