import type { ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  1: "Movies",
  2: "TV",
  3: "Music",
  4: "Games",
  5: "Software",
  6: "XXX",
  7: "Assorted",
  8: "Books",
  9: "Anime",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "darkpeers",
  version: 1,
  name: "darkpeers",
  aka: ["DP"],
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["https://darkpeers.org/"],
  favicon: "https://darkpeers.org/favicon.ico",

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

  levelRequirements: [
    { id: 0, name: "Leech", ratio: 0, privilege: "0下载槽" },
    { id: 1, name: "User", ratio: 0.8, privilege: "10下载槽 上传种子" },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB",
      ratio: 0.8,
      interval: "P1M",
      seedingSize: "100GiB",
      privilege: "15下载槽 上传种子 发送邀请",
    },
    {
      id: 3,
      name: "Seeder",
      ratio: 0.8,
      interval: "P1M",
      averageSeedingTime: "P1M",
      seedingSize: "3TiB",
      privilege: "15下载槽 上传种子 发送邀请",
    },
    {
      id: 4,
      name: "SuperUser",
      uploaded: "5TiB",
      ratio: 0.8,
      interval: "P2M",
      seedingSize: "500GiB",
      uploads: 5,
      privilege: "20下载槽 上传种子 发送邀请",
    },
    {
      id: 5,
      name: "Collector",
      ratio: 0.8,
      interval: "P2M",
      averageSeedingTime: "P2M",
      seedingSize: "8TiB",
      privilege: "20下载槽 上传种子 发送邀请",
    },
    {
      id: 6,
      name: "ExtremeUser",
      uploaded: "20TiB",
      ratio: 0.8,
      interval: "P4M",
      averageSeedingTime: "P2M",
      seedingSize: "1TiB",
      uploads: 15,
      privilege: "40下载槽 上传种子 发送邀请 免审核发布 访问邀请区",
    },
    {
      id: 7,
      name: "Hoarder",
      ratio: 0.8,
      interval: "P4M",
      averageSeedingTime: "P3M",
      seedingSize: "16TiB",
      privilege: "40下载槽 上传种子 发送邀请 免审核发布 访问邀请区",
    },
    {
      id: 8,
      name: "InsaneUser",
      uploaded: "60TiB",
      ratio: 0.8,
      interval: "P8M",
      averageSeedingTime: "P3M",
      seedingSize: "25TiB",
      uploads: 50,
      privilege: "50下载槽 上传种子 发送邀请 免疫自动 HnR 警告 免审核发布 访问邀请区",
    },
    {
      id: 9,
      name: "Veteran",
      uploaded: "120TiB",
      ratio: 1,
      interval: "P1Y",
      averageSeedingTime: "P4M",
      seedingSize: "40TiB",
      uploads: 100,
      privilege: "无限下载槽 上传种子 发送邀请 全站免费 免疫自动 HnR 警告 免审核发布 访问邀请区",
    },
    {
      id: 10,
      name: "Legend",
      uploaded: "200TiB",
      ratio: 1.2,
      interval: "P2Y",
      averageSeedingTime: "P5M",
      seedingSize: "50TiB",
      uploads: 300,
      privilege: "无限下载槽 上传种子 发送邀请 全站免费 2x上传 免疫自动 HnR 警告 免审核发布 访问邀请区",
    },
  ],
};
