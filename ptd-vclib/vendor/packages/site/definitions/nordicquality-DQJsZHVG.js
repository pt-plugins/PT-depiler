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
const z = {
  ...e,
  version: 1,
  id: "nordicquality",
  name: "NordicQuality",
  tags: ["北欧"],
  timezoneOffset: "+0000",
  type: "private",
  schema: "Unit3D",
  urls: ["uggcf://abeqvpd.bet/"],
  levelRequirements: [
    { id: 1, name: "User", ratio: 0.4, privilege: "4下载槽 上传种子 发送邀请" },
    {
      id: 2,
      name: "Power User",
      uploaded: "250GiB",
      ratio: 1,
      interval: "P1M",
      privilege: "10下载槽 上传种子 发送邀请",
    },
    {
      id: 3,
      name: "Super User",
      uploaded: "750GiB",
      ratio: 1.2,
      interval: "P2M",
      privilege: "25下载槽 上传种子 发送邀请",
    },
    {
      id: 4,
      name: "Extreme User",
      uploaded: "4TiB",
      ratio: 1.4,
      interval: "P3M",
      privilege: "35下载槽 上传种子 发送邀请",
    },
    {
      id: 5,
      name: "Insane User",
      uploaded: "15TiB",
      ratio: 1.5,
      interval: "P6M",
      privilege: "50下载槽 上传种子 发送邀请",
    },
    {
      id: 6,
      name: "Super Seeder",
      groupType: "user",
      ratio: 1,
      averageSeedingTime: "P1W",
      seedingSize: "5TiB",
      privilege: "50下载槽 上传种子 发送邀请 免疫HR",
    },
    {
      id: 7,
      name: "Torrent King",
      groupType: "user",
      ratio: 1,
      averageSeedingTime: "P4W",
      seedingSize: "10TiB",
      privilege: "50下载槽 上传种子 发送邀请 不计算下载量 免疫HR",
    },
  ],
};
export { z as siteMetadata };
