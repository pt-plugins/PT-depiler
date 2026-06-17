import { SchemaMetadata as e, CategoryFree as r } from "../schemas/Unit3D-ChxolkI5.js";
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
const i = { 1: "Movie", 2: "TV Show" },
  x = {
    ...e,
    version: 1,
    id: "onlyencodes",
    name: "OnlyEncodes+",
    aka: ["OE"],
    description: "Encodes Live Here, Now with More!",
    tags: ["影视"],
    timezoneOffset: "+0000",
    type: "private",
    schema: "Unit3D",
    urls: ["uggcf://baylrapbqrf.pp/"],
    category: [
      { name: "类别", key: "categoryIds", options: o(i), cross: { mode: "brackets" } },
      {
        name: "规格",
        key: "typeIds",
        options: [
          { name: "x265 Encode", value: 10 },
          { name: "x264 Encode", value: 15 },
          { name: "AV1 Encode", value: 14 },
          { name: "Full Disks", value: 19 },
          { name: "Remux", value: 20 },
          { name: "WEB-DL", value: 21 },
          { name: "Other/Unknown", value: 16 },
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
      { id: 0, name: "Leech", privilege: "无限下载槽 上传种子" },
      { id: 1, name: "User", ratio: 0.4, privilege: "无限下载槽 上传种子" },
      { id: 2, name: "Explorer", interval: "P1M", ratio: 0.4, uploaded: "1TiB", privilege: "无限下载槽 上传种子" },
      {
        id: 3,
        name: "Trailblazer",
        interval: "P2M",
        ratio: 0.4,
        uploaded: "5TiB",
        seedingSize: "100GiB",
        privilege: "无限下载槽 上传种子 发送邀请",
      },
      {
        id: 4,
        name: "Adventurer",
        interval: "P3M",
        ratio: 0.4,
        uploaded: "20TiB",
        seedingSize: "100GiB",
        privilege: "无限下载槽 上传种子 发送邀请",
      },
      {
        id: 5,
        name: "Legendary",
        interval: "P6M",
        ratio: 0.4,
        uploaded: "50TiB",
        seedingSize: "100GiB",
        privilege: "无限下载槽 上传种子 发送邀请",
      },
      {
        id: 6,
        name: "Eternal",
        interval: "P1M",
        ratio: 0.4,
        uploaded: "1TiB",
        seedingSize: "5TiB",
        averageSeedingTime: "P1M",
        privilege: "无限下载槽 上传种子 发送邀请 免疫HR",
      },
      {
        id: 7,
        name: "Ascendan",
        interval: "P1Y",
        ratio: 0.4,
        uploaded: "100TiB",
        seedingSize: "100GiB",
        privilege: "无限下载槽 上传种子 发送邀请 免疫HR 站免",
      },
      {
        id: 8,
        name: "Video Virtuoso",
        interval: "P3M",
        ratio: 0.4,
        uploaded: "1TiB",
        seedingSize: "10TiB",
        averageSeedingTime: "P2M",
        privilege: "无限下载槽 上传种子 发送邀请 免疫HR 站免",
      },
      {
        id: 9,
        name: "Encode Lover",
        interval: "P6M",
        ratio: 0.4,
        uploaded: "1TiB",
        seedingSize: "20TiB",
        averageSeedingTime: "P3M",
        privilege: "无限下载槽 上传种子 发送邀请 免疫HR 站免 2x上传",
      },
      {
        id: 10,
        name: "BeachBum",
        interval: "P2M",
        ratio: 1,
        uploaded: "100TiB",
        seedingSize: "20TiB",
        averageSeedingTime: "P6D",
        privilege: "无限下载槽 上传种子 发送邀请 免疫HR 站免 2x上传",
      },
      {
        id: 11,
        name: "OnlyKings",
        interval: "P3M",
        ratio: 1,
        uploaded: "1TiB",
        seedingSize: "10TiB",
        averageSeedingTime: "P2M",
        uploads: 35,
        privilege: "无限下载槽 上传种子 发送邀请 免疫HR 站免 2x上传",
      },
      {
        id: 12,
        name: "OnlyCoinSpender",
        interval: "P1Y",
        ratio: 1,
        uploaded: "908.59TiB",
        seedingSize: "5TiB",
        averageSeedingTime: "P2D7H33M20S",
        privilege: "无限下载槽 上传种子 发送邀请 免疫HR 站免 2x上传",
      },
    ],
  };
export { x as siteMetadata };
