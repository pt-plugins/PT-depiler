import { SchemaMetadata as e, userInfoTrans as a } from "../schemas/Unit3D-ChxolkI5.js";
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
const C = {
  ...e,
  version: 1,
  id: "capybarabr",
  name: "CapybaraBR",
  tags: ["巴西"],
  timezoneOffset: "+0000",
  type: "private",
  schema: "Unit3D",
  urls: ["uggcf://pnclonenoe.pbz/"],
  userInfo: {
    ...e.userInfo,
    selectors: {
      ...e.userInfo.selectors,
      seedingSize: {
        ...e.userInfo.selectors.seedingSize,
        selector: [
          ...["Tamanho em seeding", ...a.seedingSize].map((i) => `dt:contains('${i}') + dd`),
          ...["Tamanho em seeding", ...a.seedingSize].map((i) => `td:contains('${i}') + td`),
        ],
      },
    },
  },
  levelRequirements: [
    { id: 1, name: "Lesma", privilege: "0下载槽 上传种子" },
    { id: 2, name: "Capivarinha", ratio: 1, privilege: "5下载槽 上传种子" },
    {
      id: 3,
      name: "Arara",
      uploaded: "1TiB",
      ratio: 1,
      interval: "P1M",
      averageSeedingTime: "P3D",
      privilege: "25下载槽 上传种子 发送邀请",
    },
    {
      id: 4,
      name: "Mico-Leao",
      uploaded: "5TiB",
      ratio: 1,
      interval: "P3M",
      averageSeedingTime: "P1W",
      privilege: "25下载槽 上传种子 发送邀请",
    },
    {
      id: 5,
      name: "Onça",
      uploaded: "25TiB",
      ratio: 1,
      interval: "P6M",
      averageSeedingTime: "P2W6D",
      privilege: "25下载槽 上传种子 发送邀请",
    },
    {
      id: 6,
      name: "Tatu",
      uploaded: "50TiB",
      ratio: 1,
      interval: "P9M",
      averageSeedingTime: "P1M",
      privilege: "25下载槽 上传种子 发送邀请",
    },
    {
      id: 7,
      name: "Caramelo",
      uploaded: "70TiB",
      ratio: 1,
      interval: "P12M",
      averageSeedingTime: "P2M",
      privilege: "30下载槽 上传种子 发送邀请",
    },
    {
      id: 8,
      name: "Lobo-Guara",
      uploaded: "100TiB",
      ratio: 1,
      interval: "P1Y5M",
      averageSeedingTime: "P3M",
      privilege: "30下载槽 上传种子 发送邀请 双倍计算上传量",
    },
    {
      id: 9,
      name: "Capivara-Master",
      uploaded: "200TiB",
      ratio: 1,
      interval: "P1Y11M",
      averageSeedingTime: "P6M",
      privilege: "50下载槽 上传种子 发送邀请 双倍计算上传量",
    },
    {
      id: 10,
      name: "Tartaruga",
      groupType: "user",
      ratio: 1,
      interval: "P3M",
      seedingSize: "20TiB",
      privilege: "不限下载槽 上传种子 发送邀请 不计算下载量 双倍计算上传量",
    },
  ],
};
export { C as siteMetadata };
