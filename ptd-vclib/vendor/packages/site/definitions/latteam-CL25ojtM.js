import { SchemaMetadata as e, CategoryFree as o, userInfoTrans as i } from "../schemas/Unit3D-ChxolkI5.js";
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
const r = {
    1: "Peliculas",
    2: "TV Series",
    5: "Anime",
    20: "Asiáticas & Turcas",
    8: "Telenovelas",
    3: "Musica",
    9: "Conciertos",
    16: "Eventos Deportivos",
    22: "Playlist_Collection",
    12: "XXX",
    18: "E-Books",
    11: "Audiolibros",
    4: "Juegos",
    24: "Cursos",
    29: "Revistas & Periódicos",
    30: "Comics & Manga",
  },
  D = {
    ...e,
    version: 1,
    id: "latteam",
    name: "LAT-Team",
    description: "LAT-Team is a UNIT3D Private Torrent Tracker for Latin content.",
    tags: ["西班牙语"],
    timezoneOffset: "+0800",
    type: "private",
    schema: "Unit3D",
    urls: ["uggcf://yng-grnz.pbz/"],
    category: [
      { name: "类别", key: "categoryIds", options: t(r), cross: { mode: "brackets" } },
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
          { name: "FLAC", value: 7 },
          { name: "ALAC", value: 8 },
          { name: "AC3", value: 9 },
          { name: "AAC", value: 10 },
          { name: "M4A", value: 18 },
          { name: "M4B", value: 17 },
          { name: "MP3", value: 11 },
          { name: "EPUB", value: 14 },
          { name: "Windows", value: 13 },
          { name: "Mac", value: 12 },
          { name: "Consolas", value: 16 },
          { name: "Otro", value: 21 },
          { name: "Android", value: 22 },
          { name: "PDF", value: 23 },
          { name: "CBZ / CBR", value: 25 },
          { name: "AZW3 / MOBI / KFX", value: 26 },
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
          { name: "540p", value: 7 },
          { name: "480p", value: 8 },
          { name: "480i", value: 9 },
          { name: "Other", value: 10 },
          { name: "No Res", value: 11 },
        ],
        cross: { mode: "brackets" },
      },
      o,
    ],
    search: {
      ...e.search,
      selectors: {
        ...e.search.selectors,
        category: { selector: ":self", data: "categoryId", filters: [(a) => r[Number(a)] || ""] },
      },
    },
    userInfo: {
      ...e.userInfo,
      selectors: {
        ...e.userInfo.selectors,
        seedingSize: {
          ...e.userInfo.selectors.seedingSize,
          selector: [
            ...["Tamaño total compartiendo", ...i.seedingSize].map((a) => `dt:contains('${a}') + dd`),
            ...["Tamaño total compartiendo", ...i.seedingSize].map((a) => `td:contains('${a}') + td`),
          ],
        },
      },
    },
    levelRequirements: [
      { id: 1, name: "User", ratio: 0.25, privilege: "5下载槽 上传种子 发送邀请" },
      {
        id: 2,
        name: "PowerUser",
        uploaded: "1TiB",
        ratio: 0.4,
        interval: "P1M",
        privilege: "10下载槽 上传种子 发送邀请",
      },
      {
        id: 3,
        name: "SuperUser",
        uploaded: "5TiB",
        ratio: 0.4,
        interval: "P2M",
        privilege: "15下载槽 上传种子 发送邀请",
      },
      {
        id: 4,
        name: "ExtremeUser",
        uploaded: "20TiB",
        ratio: 0.4,
        interval: "P3M",
        privilege: "20下载槽 上传种子 发送邀请",
      },
      {
        id: 5,
        name: "InsaneUser",
        uploaded: "50TiB",
        ratio: 0.4,
        interval: "P6M",
        privilege: "25下载槽 上传种子 发送邀请",
      },
      {
        id: 6,
        name: "Veteran",
        uploaded: "100TiB",
        ratio: 0.4,
        interval: "P1Y",
        privilege: "30下载槽 上传种子 发送邀请 免疫HR",
      },
      {
        id: 7,
        name: "Seeder",
        groupType: "user",
        ratio: 0.4,
        interval: "P1M",
        averageSeedingTime: "P1M",
        seedingSize: "5TiB",
        privilege: "35下载槽 上传种子 发送邀请 免疫HR",
      },
      {
        id: 8,
        name: "Archivist",
        groupType: "user",
        ratio: 0.4,
        interval: "P3M",
        averageSeedingTime: "P2M",
        seedingSize: "10TiB",
        privilege: "无限下载槽 上传种子 发送邀请 站免 免疫HR",
      },
    ],
  };
export { D as siteMetadata };
