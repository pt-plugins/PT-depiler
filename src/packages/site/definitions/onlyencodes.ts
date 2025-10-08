import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D.ts";

const categoryOptions = [
  { name: "Movie", value: 1 },
  { name: "TV Show", value: 2 },
];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
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
    {
      name: "类别",
      key: "categoryIds",
      options: categoryOptions,
      cross: { mode: "brackets" },
    },
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
    {
      name: "Buff",
      key: "free",
      options: [
        { name: "0% Freeleech", value: 0 },
        { name: "25% Free", value: 25 },
        { name: "50% Free", value: 50 },
        { name: "75% Free", value: 75 },
        { name: "100% Free", value: 100 },
        { name: "双倍上传", value: "doubleup" },
        { name: "精选", value: "featured" },
        { name: "Refundable", value: "refundable" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params: Record<string, any> = { free: [] };
        (selectedOptions as Array<number | string>).forEach((value) => {
          if (value === "doubleup" || value === "featured" || value === "refundable") {
            params[value] = 1;
          } else {
            params.free.push(value);
          }
        });
        return { requestConfig: { params } };
      },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    skipNonLatinCharacters: true,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      category: {
        selector: ":self",
        data: "categoryId",
        filters: [(catID: number) => categoryOptions.find((cat) => cat.value == catID)?.name ?? ""],
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

  levelRequirements: [
    {
      id: 0,
      name: "Leech",
      privilege: "无限下载槽 上传种子",
    },
    {
      id: 1,
      name: "User",
      ratio: 0.4,
      privilege: "无限下载槽 上传种子",
    },
    {
      id: 2,
      name: "Explorer",
      interval: "P1M",
      ratio: 0.4,
      uploaded: "1TiB",
      privilege: "无限下载槽 上传种子",
    },
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
