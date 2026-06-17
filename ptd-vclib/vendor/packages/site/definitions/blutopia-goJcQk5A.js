import { SchemaMetadata as e, CategoryFree as a } from "../schemas/Unit3D-ChxolkI5.js";
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
  id: "blutopia",
  name: "Blutopia",
  aka: ["BLU"],
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",
  collaborator: ["bimzcy", "lengmianxia", "haowenwu"],
  type: "private",
  schema: "Unit3D",
  urls: ["uggcf://oyhgbcvn.pp/"],
  legacyUrls: ["https://blutopia.xyz/"],
  levelRequirements: [
    { id: 1, name: "User", privilege: "2下载槽" },
    { id: 2, name: "BluUser", uploaded: "1TiB", interval: "P1M", privilege: "5下载槽" },
    { id: 3, name: "BluMaster", uploaded: "5TiB", interval: "P2M", privilege: "10下载槽 发送邀请" },
    {
      id: 4,
      name: "BluExtremist",
      uploaded: "20TiB",
      interval: "P3M",
      privilege: "自动通过候选 访问邀请区 15下载槽 发送邀请",
    },
    {
      id: 5,
      name: "BluLegend",
      uploaded: "50TiB",
      interval: "P6M",
      privilege: "自动通过候选 访问邀请区 20下载槽 发送邀请",
    },
    {
      id: 6,
      name: "Blutopian",
      uploaded: "100TiB",
      interval: "P12M",
      privilege: "自动通过候选 访问邀请区 免疫HR 不计算下载量 25下载槽 发送邀请",
    },
    {
      id: 7,
      name: "BluSeeder",
      groupType: "user",
      seedingSize: "5TiB",
      interval: "P1M",
      averageSeedingTime: "P30D",
      privilege: "自动通过候选 访问邀请区 免疫HR 15下载槽 发送邀请",
    },
    {
      id: 8,
      name: "BluCollector",
      seedingSize: "10TiB",
      interval: "P3M",
      averageSeedingTime: "P60D",
      privilege: "自动通过候选 访问邀请区 免疫HR 不计算下载量 20下载槽 发送邀请",
    },
    {
      id: 9,
      name: "BluArchivist",
      seedingSize: "20TiB",
      interval: "P3M",
      averageSeedingTime: "P90D",
      privilege: "自动通过候选 访问邀请区 免疫HR 不计算下载量 双倍计算上传量 25下载槽 发送邀请",
    },
  ],
  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Movie", value: 1 },
        { name: "Other", value: 8 },
        { name: "TV Show", value: 2 },
        { name: "FANRES", value: 3 },
        { name: "Trailer", value: 5 },
        { name: "Live Concert", value: 9 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "规格",
      key: "typeIds",
      options: [
        { name: "Full Disc", value: 1 },
        { name: "Remux", value: 3 },
        { name: "Encode", value: 12 },
        { name: "WEB-DL", value: 4 },
        { name: "WEBRip", value: 5 },
        { name: "HDTV", value: 6 },
        { name: "Other", value: 15 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutionIds",
      options: [
        { name: "4320p", value: 11 },
        { name: "2160p", value: 1 },
        { name: "1080p", value: 2 },
        { name: "1080i", value: 3 },
        { name: "720p", value: 5 },
        { name: "576p", value: 6 },
        { name: "576i", value: 7 },
        { name: "480p", value: 8 },
        { name: "480i", value: 9 },
        { name: "Other", value: 10 },
      ],
      cross: { mode: "brackets" },
    },
    a,
  ],
  search: {
    ...e.search,
    skipNonLatinCharacters: !0,
    selectors: {
      ...e.search.selectors,
      tags: [...e.search.selectors.tags, { name: "H&R", selector: "*", color: "red" }],
    },
  },
};
export { D as siteMetadata };
