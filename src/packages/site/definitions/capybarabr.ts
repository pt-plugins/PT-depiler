import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

// 葡萄牙语标签映射
const ptBrTrans = {
  seedingSize: ["Tamanho em seeding", "Seeding Size", "Seeding size"],
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "capybarabr",
  name: "CapybaraBR",
  tags: ["巴西"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://pnclonenoe.pbz/"],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      seedingSize: {
        ...SchemaMetadata.userInfo!.selectors!.seedingSize,
        selector: [
          ...ptBrTrans.seedingSize.map((x) => `dt:contains('${x}') + dd`),
          ...ptBrTrans.seedingSize.map((x) => `td:contains('${x}') + td`),
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Lesma",
      privilege: "0下载槽 上传种子",
    },
    {
      id: 2,
      name: "Capivarinha",
      ratio: 1.0,
      privilege: "5下载槽 上传种子",
    },
    {
      id: 3,
      name: "Arara",
      uploaded: "1TiB",
      ratio: 1.0,
      interval: "P1M",
      averageSeedingTime: "P3D",
      privilege: "25下载槽 上传种子 发送邀请",
    },
    {
      id: 4,
      name: "Mico-Leao",
      uploaded: "5TiB",
      ratio: 1.0,
      interval: "P3M",
      averageSeedingTime: "P1W",
      privilege: "25下载槽 上传种子 发送邀请",
    },
    {
      id: 5,
      name: "Onça",
      uploaded: "25TiB",
      ratio: 1.0,
      interval: "P6M",
      averageSeedingTime: "P2W6D",
      privilege: "25下载槽 上传种子 发送邀请",
    },
    {
      id: 6,
      name: "Tatu",
      uploaded: "50TiB",
      ratio: 1.0,
      interval: "P9M",
      averageSeedingTime: "P1M",
      privilege: "25下载槽 上传种子 发送邀请",
    },
    {
      id: 7,
      name: "Caramelo",
      uploaded: "70TiB",
      ratio: 1.0,
      interval: "P12M",
      averageSeedingTime: "P2M",
      privilege: "30下载槽 上传种子 发送邀请",
    },
    {
      id: 8,
      name: "Lobo-Guara",
      uploaded: "100TiB",
      ratio: 1.0,
      interval: "P1Y5M",
      averageSeedingTime: "P3M",
      privilege: "30下载槽 上传种子 发送邀请 双倍计算上传量",
    },
    {
      id: 9,
      name: "Capivara-Master",
      uploaded: "200TiB",
      ratio: 1.0,
      interval: "P1Y11M",
      averageSeedingTime: "P6M",
      privilege: "50下载槽 上传种子 发送邀请 双倍计算上传量",
    },
    {
      id: 10,
      name: "Tartaruga",
      groupType: "user",
      ratio: 1.0,
      interval: "P3M",
      seedingSize: "20TiB",
      privilege: "不限下载槽 上传种子 发送邀请 不计算下载量 双倍计算上传量",
    },
  ],
};
