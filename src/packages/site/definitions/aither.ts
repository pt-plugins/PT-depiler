import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const categoryMap: Record<number, string> = {
  1: "Movie",
  9: "Sport",
  2: "TV",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "aither",
  name: "Aither",
  aka: ["ATH"],
  tags: ["影视"],
  timezoneOffset: "+0000",
  collaborator: ["akina"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://nvgure.pp/"],

  levelRequirements: [
    {
      id: 1,
      name: "Phobos",
      privilege: "4下载槽",
    },
    {
      id: 2,
      name: "Harmonia",
      ratio: 0.6,
      interval: "P1M",
      alternative: [{ uploaded: "500GiB" }, { seedingSize: "1TiB" }],
      privilege: "10下载槽",
    },
    {
      id: 3,
      name: "Zeus",
      ratio: 0.6,
      interval: "P3M",
      averageSeedingTime: "P10D",
      alternative: [{ uploaded: "2TiB" }, { seedingSize: "2TiB" }],
      privilege: "25下载槽",
    },
    {
      id: 4,
      name: "Helios",
      ratio: 0.8,
      interval: "P6M",
      averageSeedingTime: "P20D",
      uploads: 1,
      alternative: [{ uploaded: "5TiB" }, { seedingSize: "5TiB" }],
      privilege: "50下载槽 发送邀请",
    },
    {
      id: 5,
      name: "Prometheus",
      ratio: 1,
      interval: "P8M",
      averageSeedingTime: "P45D",
      uploads: 5,
      alternative: [{ uploaded: "10TiB" }, { seedingSize: "10TiB" }],
      privilege: "访问邀请区 50下载槽 发送邀请",
    },
    {
      id: 6,
      name: "Oceanus",
      ratio: 1.5,
      interval: "P12M",
      averageSeedingTime: "P2M",
      uploads: 10,
      alternative: [{ uploaded: "20TiB" }, { seedingSize: "20TiB" }],
      privilege: "自动通过候选 访问邀请区  50下载槽 发送邀请",
    },
    {
      id: 7,
      name: "Gigantes",
      ratio: 1.5,
      interval: "P15M",
      averageSeedingTime: "P3M",
      uploads: 15,
      alternative: [{ uploaded: "40TiB" }, { seedingSize: "40TiB" }],
      privilege: "自动通过候选 访问邀请区 不计算下载量 50下载槽 发送邀请",
    },
    {
      id: 8,
      name: "Titan",
      ratio: 2,
      interval: "P24M",
      averageSeedingTime: "P6M",
      uploads: 20,
      alternative: [{ uploaded: "100TiB" }, { seedingSize: "65TiB" }],
      privilege: "自动通过候选 访问邀请区 免疫HR 不计算下载量 50下载槽 发送邀请",
    },
  ],

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
        { name: "Other", value: 7 },
        { name: "Movie Pack", value: 10 },
        { name: "Music - General", value: 20 },
        { name: "Blues", value: 29 },
        { name: "Classical", value: 30 },
        { name: "Electronic", value: 31 },
        { name: "Hip-Hop / Rap", value: 32 },
        { name: "Jazz &amp; Funk", value: 33 },
        { name: "Latin", value: 34 },
        { name: "Pop", value: 35 },
        { name: "Rock", value: 36 },
        { name: "Test", value: 16 },
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
    CategoryFree,
  ],

  search: {
    ...SchemaMetadata.search,
    skipNonLatinCharacters: true,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      category: {
        selector: ":self",
        data: "categoryId",
        filters: [(query: string) => categoryMap[Number(query)]],
      },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        {
          name: "H&R",
          selector: "*",
          color: "red",
        },
      ],
    },
  },
};
