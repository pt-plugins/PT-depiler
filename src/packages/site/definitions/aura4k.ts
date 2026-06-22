import type { ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  1: "Movies",
  2: "TV",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "aura4k",
  version: 1,
  name: "Aura4k",
  aka: ["A4K"],
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["https://aura4k.net/"],
  favicon: "https://aura4k.net/favicon.ico",

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: buildCategoryOptionsFromDict(categoryMap),
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
        filters: [(query: string) => categoryMap[Number(query)]],
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      levelName: {
        selector: [
          ".wow-badges .wow-badge:first-child",
          ...(SchemaMetadata.userInfo!.selectors!.levelName?.selector ?? []),
        ],
        elementProcess: (el: Element) => el.getAttribute("title") || el.textContent?.replace(/\s+/g, " ").trim(),
      },
      bonusPerHour: {
        selector: [
          "main aside section > div:nth-child(2) > div:nth-child(4) > div",
          ...(SchemaMetadata.userInfo!.selectors!.bonusPerHour?.selector ?? []),
        ],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "Leech",
      ratio: 0.4,
      privilege: "1下载槽 上传种子",
    },
    {
      id: 1,
      name: "User",
      ratio: 0.4,
      privilege: "3下载槽 上传种子",
    },
    {
      id: 2,
      name: "Bright Light",
      uploaded: "1TiB",
      ratio: 0.5,
      interval: "P1M",
      privilege: "5下载槽 上传种子",
    },
    {
      id: 3,
      name: "Radiant",
      uploaded: "5TiB",
      ratio: 0.6,
      interval: "P2M",
      uploads: 10,
      privilege: "8下载槽 上传种子 发送邀请",
    },
    {
      id: 4,
      name: "Luminous",
      uploaded: "20TiB",
      ratio: 0.75,
      interval: "P3M",
      uploads: 25,
      privilege: "10下载槽 上传种子 发送邀请 访问邀请区",
    },
    {
      id: 5,
      name: "Ethereal",
      uploaded: "50TiB",
      ratio: 1,
      interval: "P6M",
      uploads: 50,
      privilege: "25下载槽 上传种子 发送邀请 免疫自动 HnR 警告 访问邀请区",
    },
    {
      id: 6,
      name: "Eternal",
      uploaded: "100TiB",
      ratio: 1,
      interval: "P1Y",
      uploads: 100,
      privilege: "无限下载槽 上传种子 发送邀请 全站免费 免疫自动 HnR 警告 访问邀请区",
    },
    {
      id: 7,
      name: "Beacon",
      ratio: 1,
      interval: "P6M",
      averageSeedingTime: "P3M",
      seedingSize: "50TiB",
      privilege: "50下载槽 上传种子 发送邀请 免疫自动 HnR 警告 访问邀请区",
    },
    {
      id: 8,
      name: "Resonator",
      ratio: 1,
      interval: "P3M",
      averageSeedingTime: "P2M",
      seedingSize: "100TiB",
      privilege: "无限下载槽 上传种子 发送邀请 全站免费 免疫自动 HnR 警告 访问邀请区",
    },
  ],
};
