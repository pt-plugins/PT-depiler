import { SchemaMetadata as e, CategoryFree as r } from "../schemas/Unit3D-ChxolkI5.js";
import "../index-COeZNva1.js";
import { b as t } from "../utils/helper-OCngMtkv.js";
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
const i = { 1: "Movies", 2: "TV" },
  D = {
    ...e,
    version: 1,
    id: "uploadcx",
    name: "ULCX",
    description: "upload.cx",
    tags: ["影视"],
    timezoneOffset: "+0000",
    type: "private",
    schema: "Unit3D",
    urls: ["uggcf://hcybnq.pk/"],
    category: [
      { name: "类别", key: "categoryIds", options: t(i), cross: { mode: "brackets" } },
      {
        name: "规格",
        key: "typeIds",
        options: [
          { name: "Full Disc", value: 1 },
          { name: "Remux", value: 2 },
          { name: "Encode", value: 3 },
          { name: "WEB-DL", value: 4 },
          { name: "WEBRip", value: 5 },
          { name: "HDTV", value: 6 },
        ],
        cross: { mode: "brackets" },
      },
      {
        name: "分辨率",
        key: "resolutionIds",
        options: [
          { name: "4320p", value: 1 },
          { name: "2160p", value: 2 },
          { name: "1080p", value: 3 },
          { name: "1080i", value: 4 },
          { name: "720p", value: 5 },
          { name: "576p", value: 6 },
          { name: "576i", value: 7 },
          { name: "480p", value: 8 },
          { name: "480i", value: 9 },
          { name: "Other", value: 10 },
        ],
        cross: { mode: "brackets" },
      },
      r,
    ],
    search: {
      ...e.search,
      skipNonLatinCharacters: !0,
      selectors: {
        ...e.search.selectors,
        category: { selector: ":self", data: "categoryId", filters: [(a) => i[Number(a)]] },
        tags: [...e.search.selectors.tags, { name: "H&R", selector: "*", color: "red" }],
      },
    },
    levelRequirements: [
      { id: 0, name: "Leech" },
      { id: 1, name: "User", ratio: 0.6, privilege: "10下载槽 发送邀请" },
      { id: 2, name: "Member", interval: "P2W", ratio: 0.6, uploaded: "1TiB", privilege: "15下载槽 发送邀请" },
      { id: 3, name: "Power User", interval: "P1M", ratio: 1, uploaded: "3TiB", privilege: "20下载槽 发送邀请" },
      {
        id: 4,
        name: "Elite",
        interval: "P1M",
        ratio: 1.05,
        uploaded: "10TiB",
        privilege: "25下载槽 发送邀请 自动通过候选",
      },
      {
        id: 5,
        name: "Seeder",
        interval: "P2M",
        ratio: 1,
        seedingSize: "5TiB",
        averageSeedingTime: "P1M",
        privilege: "25下载槽 发送邀请 免疫HR 自动通过候选",
      },
      {
        id: 6,
        name: "Archivist",
        interval: "P3M",
        ratio: 1,
        seedingSize: "10TiB",
        averageSeedingTime: "P1M",
        privilege: "无限下载槽 发送邀请 站免 免疫HR 自动通过候选",
      },
      {
        id: 7,
        name: "Master",
        interval: "P4M",
        ratio: 1.1,
        uploaded: "50TiB",
        seedingSize: "20TiB",
        averageSeedingTime: "P3M",
        privilege: "无限下载槽 发送邀请 站免 免疫HR 自动通过候选",
      },
      {
        id: 8,
        name: "Veteran",
        interval: "P5M",
        ratio: 1.1,
        uploaded: "100TiB",
        seedingSize: "30TiB",
        averageSeedingTime: "P4M",
        privilege: "无限下载槽 发送邀请 站免 免疫HR 自动通过候选",
      },
    ],
  };
export { D as siteMetadata };
