import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata, userInfoTrans } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
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
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
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
    {
      name: "类别",
      key: "categoryIds",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "brackets" },
    },
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
    CategoryFree,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      category: {
        selector: ":self",
        data: "categoryId",
        filters: [(query: string) => categoryMap[Number(query)] || ""],
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      seedingSize: {
        ...SchemaMetadata.userInfo!.selectors!.seedingSize,
        selector: [
          // 追加西班牙语标签，同时继承 Unit3D 已有的英文/中文标签
          ...["Tamaño total compartiendo", ...userInfoTrans.seedingSize].map((x) => `dt:contains('${x}') + dd`),
          ...["Tamaño total compartiendo", ...userInfoTrans.seedingSize].map((x) => `td:contains('${x}') + td`),
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      ratio: 0.25,
      privilege: "5下载槽 上传种子 发送邀请",
    },
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
