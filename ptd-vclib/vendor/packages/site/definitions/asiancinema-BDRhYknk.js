import { SchemaMetadata as e, CategoryFree as i } from "../schemas/Unit3D-ChxolkI5.js";
import "../index-COeZNva1.js";
import { b as o } from "../utils/helper-OCngMtkv.js";
import "../../../url-join/url-join-Cu798wIg.js";
import "../../../es-toolkit/omit-BqXgNNTz.js";
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
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const a = { 1: "Movies", 2: "TV", 3: "Music" },
  z = {
    ...e,
    version: 2,
    id: "asiancinema",
    name: "AsianCinema",
    aka: ["ACM"],
    description: "综合",
    tags: ["综合"],
    timezoneOffset: "+0000",
    type: "private",
    schema: "Unit3D",
    urls: ["uggcf://rvtn.zbv/"],
    legacyUrls: ["uggcf://nfvnapvarzn.zr/"],
    category: [
      { name: "类别", key: "categoryIds", options: o(a), cross: { mode: "brackets" } },
      {
        name: "规格",
        key: "typeIds",
        options: [
          { name: "Full Disc", value: 1 },
          { name: "Remux", value: 7 },
          { name: "WEB-DL", value: 9 },
          { name: "HDTV", value: 17 },
          { name: "UHDTV", value: 19 },
          { name: "SDTV", value: 13 },
          { name: "FLAC", value: 15 },
        ],
        cross: { mode: "brackets" },
      },
      {
        name: "分辨率",
        key: "resolutionIds",
        options: [
          { name: "2160p", value: 1 },
          { name: "1080i/p", value: 2 },
          { name: "720p", value: 3 },
          { name: "576i/p", value: 4 },
          { name: "480i/p", value: 5 },
          { name: "Other", value: 6 },
        ],
        cross: { mode: "brackets" },
      },
      i,
    ],
    search: {
      ...e.search,
      selectors: {
        ...e.search.selectors,
        category: { selector: ":self", data: "categoryId", filters: [(r) => a[Number(r)]] },
        tags: [...e.search.selectors.tags, { name: "H&R", selector: "*", color: "red" }],
      },
    },
    levelRequirements: [
      { id: 0, name: "Leech" },
      { id: 1, name: "User", ratio: 0.4, privilege: "4 download slots" },
      {
        id: 2,
        name: "Power User",
        uploaded: "1TB",
        interval: "P1M",
        ratio: 0.4,
        uploads: 1,
        privilege: "10 download slots",
      },
      {
        id: 3,
        name: "Super User",
        uploaded: "5TB",
        interval: "P2M",
        ratio: 0.4,
        uploads: 5,
        privilege: "25 download slots",
      },
      {
        id: 4,
        name: "Extreme User",
        uploaded: "20TB",
        interval: "P3M",
        ratio: 0.4,
        uploads: 10,
        privilege: "50 download slots; Trusted member",
      },
      {
        id: 5,
        name: "Insane User",
        uploaded: "50TB",
        interval: "P6M",
        ratio: 0.4,
        uploads: 15,
        privilege: "50 download slots; Trusted member",
      },
      {
        id: 6,
        name: "Veteran",
        uploaded: "100TB",
        interval: "P1Y",
        ratio: 0.4,
        uploads: 20,
        privilege: "Special freeleech",
      },
      {
        id: 7,
        name: "Seeder",
        uploaded: "200TB",
        seedingSize: "20TB",
        interval: "P1M",
        averageSeedingTime: "P1M",
        ratio: 1.5,
        uploads: 5,
        privilege: "Trusted member",
      },
      {
        id: 8,
        name: "Archivist",
        uploaded: "400TB",
        seedingSize: "40TB",
        interval: "P3M",
        averageSeedingTime: "P2M",
        ratio: 1.5,
        uploads: 10,
        privilege: "Immunity from H&Rs & Special freeleech",
      },
    ],
  };
export { z as siteMetadata };
