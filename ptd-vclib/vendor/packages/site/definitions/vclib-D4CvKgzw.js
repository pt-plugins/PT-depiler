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
const c = {
  ...e,
  version: 1,
  id: "vclib",
  name: "VC-Lib",
  description: "专注于虚拟歌姬 （非虚拟偶像）相关内容的站点，禁R18",
  tags: ["虚拟歌姬", "音乐", "影视"],
  type: "private",
  schema: "NexusPHP",
  urls: ["https://pt.vclib.online/"],
  levelRequirements: [
    { id: 0, name: "一重加害", nameAka: ["User"], privilege: "新用户的默认级别" },
    {
      id: 1,
      name: "二重变革",
      nameAka: ["Power User"],
      interval: "P4W",
      seedingBonus: 4e4,
      downloaded: "50GB",
      ratio: 1,
      privilege: "可以开始邀请新用户",
    },
    {
      id: 2,
      name: "三重爱恋",
      nameAka: ["Elite User"],
      interval: "P8W",
      seedingBonus: 1e5,
      downloaded: "100GB",
      ratio: 2,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "四重罪孽",
      nameAka: ["Crazy User"],
      interval: "P15W",
      seedingBonus: 3e5,
      downloaded: "150GB",
      ratio: 3,
    },
    {
      id: 4,
      name: "五重空洞",
      nameAka: ["Insane User"],
      interval: "P25W",
      seedingBonus: 5e5,
      downloaded: "200GB",
      ratio: 4,
    },
    {
      id: 5,
      name: "六重不忠",
      nameAka: ["Veteran User"],
      interval: "P40W",
      seedingBonus: 1e6,
      downloaded: "250GB",
      ratio: 5,
      isKept: !0,
      privilege: "Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "七重痼病",
      nameAka: ["Extreme User"],
      interval: "P60W",
      seedingBonus: 15e5,
      downloaded: "300GB",
      ratio: 6,
      isKept: !0,
    },
    {
      id: 7,
      name: "八重回归",
      nameAka: ["Ultimate User"],
      interval: "P80W",
      seedingBonus: 2e6,
      downloaded: "350GB",
      ratio: 6,
      isKept: !0,
    },
    {
      id: 8,
      name: "九重现实",
      nameAka: ["Nexus Master"],
      interval: "P100W",
      seedingBonus: 5e6,
      downloaded: "400GB",
      ratio: 8,
      isKept: !0,
    },
  ],
};
export { c as siteMetadata };
