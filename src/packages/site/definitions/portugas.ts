import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata, userInfoTrans } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  1: "Filmes",
  2: "TV",
  3: "Músicas",
  4: "Jogos",
  5: "Appz",
  7: "XXX",
  9: "E-Books",
  10: "Animação Filmes",
  11: "Animação TV",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "portugas",
  name: "Portugas",
  description: "Portugas is a UNIT3D Private Torrent Tracker for Portuguese content.",
  tags: ["葡萄牙"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://cbeghtnf.bet/"],

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
        { name: "HDTV", value: 6 },
        { name: "FLAC", value: 7 },
        { name: "ALAC", value: 8 },
        { name: "AC3", value: 9 },
        { name: "AAC", value: 10 },
        { name: "MP3", value: 11 },
        { name: "MacOS", value: 12 },
        { name: "Windows", value: 13 },
        { name: "PDF", value: 14 },
        { name: "Revistas", value: 16 },
        { name: "PlayStation", value: 18 },
        { name: "Xbox", value: 19 },
        { name: "Mobile", value: 20 },
        { name: "Boxset", value: 21 },
        { name: "DVD", value: 22 },
        { name: "BRRip", value: 23 },
        { name: "Livros", value: 24 },
        { name: "MP4", value: 25 },
        { name: "HDRip", value: 26 },
        { name: "TVRip", value: 27 },
        { name: "Linux", value: 31 },
        { name: "Nintendo", value: 33 },
        { name: "BDRip", value: 36 },
        { name: "Audio", value: 37 },
        { name: "WEBRip", value: 39 },
        { name: "WEB", value: 40 },
        { name: "GPS", value: 41 },
        { name: "CAM/TS", value: 42 },
        { name: "HDR", value: 43 },
        { name: "DVDRip", value: 44 },
        { name: "Curso", value: 45 },
        { name: "WAV", value: 46 },
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
        { name: "Outras", value: 10 },
        { name: "540p", value: 11 },
        { name: "Other", value: 12 },
        { name: "1440p", value: 13 },
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
          // 追加葡萄牙语标签，同时继承 Unit3D 已有的英文/中文标签
          ...["Tamanho das Sementes", ...userInfoTrans.seedingSize].map((x) => `dt:contains('${x}') + dd`),
          ...["Tamanho das Sementes", ...userInfoTrans.seedingSize].map((x) => `td:contains('${x}') + td`),
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Mouro",
      ratio: 0.4,
      privilege: "3下载槽",
    },
    {
      id: 2,
      name: "Hispanus",
      uploaded: "250GiB",
      ratio: 1.25,
      interval: "P3M",
      privilege: "5下载槽 发送邀请",
    },
    {
      id: 3,
      name: "Lusitanus",
      uploaded: "1TiB",
      ratio: 1.25,
      interval: "P6M",
      privilege: "10下载槽 发送邀请",
    },
    {
      id: 4,
      name: "Portucale",
      uploaded: "5TiB",
      ratio: 1.25,
      interval: "P1Y",
      privilege: "15下载槽 上传种子 发送邀请",
    },
    {
      id: 5,
      name: "Portuga",
      uploaded: "15TiB",
      ratio: 1.25,
      interval: "P1Y",
      privilege: "20下载槽 上传种子 发送邀请",
    },
  ],
};
