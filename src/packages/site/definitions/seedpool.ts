import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

const seedingSizeTrans: string[] = ["Seedpool"];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "seedpool",
  name: "seedpool",
  aka: ["SP"],
  tags: ["综合"],
  timezoneOffset: "+0000",
  collaborator: ["socketcat"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://frrqcbby.bet/"],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      seeding: {
        selector: ["li.ratio-bar__uploaded a:has( > i.fa-arrow-up) + a"],
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        selector: [
          ...seedingSizeTrans.map((x) => `td:contains('${x}') + td`),
          ...seedingSizeTrans.map((x) => `dt:contains('${x}') + dd`),
        ],
        filters: [{ name: "parseSize" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      ratio: 1.0,
      privilege: "无限下载槽",
    },
    {
      id: 2,
      name: "Pool",
      ratio: 1.0,
      seedingSize: "256GiB",
      interval: "P1M",
      privilege: "无限下载槽 发起求种 免疫HR 发送邀请",
    },
    {
      id: 3,
      name: "PowerPool",
      ratio: 1.25,
      seedingSize: "512GiB",
      interval: "P3M",
      privilege: "无限下载槽 发起求种 应求求种 免疫HR 发送邀请",
    },
    {
      id: 4,
      name: "SuperPool",
      ratio: 1.5,
      seedingSize: "1TiB",
      interval: "P6M",
      privilege: "无限下载槽 发起求种 应求求种 免疫HR 站免 发送邀请",
    },
    {
      id: 5,
      name: "UberPool",
      ratio: 3,
      seedingSize: "5TiB",
      interval: "P9M",
      privilege: "无限下载槽 发起求种 应求求种 免疫HR 站免 发送邀请",
    },
    {
      id: 6,
      name: "MegaPool",
      ratio: 3,
      seedingSize: "25TiB",
      interval: "P12M",
      privilege: "上传种子 访问邀请区 双倍计算上传量 无限下载槽 发起求种 应求求种 免疫HR 站免 发送邀请",
    },
    {
      id: 7,
      name: "GodPool",
      ratio: 5,
      seedingSize: "100TiB",
      interval: "P12M",
      privilege: "上传种子 访问邀请区 双倍计算上传量 无限下载槽 发起求种 应求求种 免疫HR 站免 发送邀请",
    },
  ],
};
