import type { ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  1: "Movies",
  2: "TV",
  3: "Music",
  4: "Games",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "midnightscene",
  version: 1,
  name: "MidnightScene",
  aka: ["MS"],
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["https://midnightscene.cc/"],
  favicon: "https://midnightscene.cc/favicon.ico",

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
    { id: 0, name: "Leech", ratio: 0, privilege: "1下载槽" },
    { id: 1, name: "User", ratio: 0, privilege: "无限下载槽 上传种子" },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB",
      ratio: 0.4,
      interval: "P1M",
      privilege: "无限下载槽 上传种子",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "5TiB",
      ratio: 0.4,
      interval: "P2M",
      privilege: "无限下载槽 上传种子",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "20TiB",
      ratio: 0.4,
      interval: "P3M",
      privilege: "无限下载槽 上传种子 免审核发布",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "50TiB",
      ratio: 0.4,
      interval: "P6M",
      privilege: "无限下载槽 上传种子 免审核发布",
    },
    {
      id: 6,
      name: "Veteran",
      uploaded: "100TiB",
      ratio: 0.4,
      interval: "P1Y",
      privilege: "无限下载槽 上传种子 全站免费 免审核发布",
    },
    {
      id: 7,
      name: "Seeder",
      ratio: 0.4,
      interval: "P1M",
      seedingSize: "5TiB",
      privilege: "无限下载槽 上传种子 免疫自动 HnR 警告 免审核发布",
    },
    {
      id: 8,
      name: "Archivist",
      ratio: 0.4,
      interval: "P3M",
      averageSeedingTime: "P2M",
      seedingSize: "10TiB",
      privilege: "无限下载槽 上传种子 全站免费 免疫自动 HnR 警告 免审核发布",
    },
  ],
};
