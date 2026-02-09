import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const seedingSizeTrans: string[] = ["Seedpool"];

const categoryMap: Record<number, string> = {
  2: "TV Show",
  1: "Movie",
  6: "Anime",
  8: "Sports",
  5: "Music",
  9: "Audiobook",
  7: "E-Book",
  12: "Hobby",
  16: "Software",
  3: "Game",
  21: "Music Production",
  11: "Other",
};

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
      bonus: { text: "N/A" },
      bonusPerHour: { text: "N/A" },
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
      privilege: "访问邀请区 无限下载槽 发起求种 应求求种 免疫HR 站免 发送邀请",
    },
    {
      id: 5,
      name: "UberPool",
      ratio: 3,
      seedingSize: "5TiB",
      interval: "P9M",
      privilege: "访问邀请区 无限下载槽 发起求种 应求求种 免疫HR 站免 发送邀请",
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
    {
      id: 8,
      name: "ProPool",
      groupType: "vip",
      privilege: "双倍计算上传量 无限下载槽 发起求种 应求求种 免疫HR 站免 发送邀请",
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
        { name: "WEB-DL", value: 4 },
        { name: "WEBRip", value: 5 },
        { name: "HDTV", value: 6 },
        { name: "Encode", value: 3 },
        { name: "FLAC", value: 11 },
        { name: "FLAC Pack", value: 30 },
        { name: "MP3", value: 13 },
        { name: "MP3 Pack", value: 31 },
        { name: "Karaoke", value: 43 },
        { name: "Music Videos", value: 55 },
        { name: "Samples &amp; SFX", value: 48 },
        { name: "3D Print", value: 38 },
        { name: "Book", value: 20 },
        { name: "Comic", value: 40 },
        { name: "Document", value: 49 },
        { name: "Magazine", value: 41 },
        { name: "Newspaper", value: 42 },
        { name: "Linux", value: 33 },
        { name: "macOS", value: 34 },
        { name: "Windows", value: 16 },
        { name: "NES", value: 45 },
        { name: "Nintendo Switch", value: 15 },
        { name: "PS1", value: 50 },
        { name: "PS2", value: 51 },
        { name: "PS3", value: 52 },
        { name: "PS4", value: 28 },
        { name: "Wii", value: 44 },
        { name: "Xbox", value: 35 },
        { name: "Xbox 360", value: 53 },
        { name: "Xbox One", value: 54 },
        { name: "Other", value: 17 },
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
        { name: "Upscale", value: 14 },
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
