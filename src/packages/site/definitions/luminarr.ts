import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D";
import { buildCategoryOptionsFromDict } from "../utils";

const categoryMap: Record<number, string> = {
  1: "Movies",
  2: "TV",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "luminarr",
  name: "Luminarr",
  aka: ["LUME"],
  description: "Luminarr is a Private Torrent Tracker for MOVIES / TV",
  tags: ["影视"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://yhzvanee.zr/"],

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
        { name: "SDTV", value: 7 },
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
      subTitle: {
        selector: "span.torrent-quality-score__value",
        filters: [{ name: "prepend", args: ["Quality Score: "] }],
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
      privilege: "上传种子 0下载槽",
    },
    {
      id: 1,
      name: "User",
      privilege: "上传种子 3下载槽",
    },
    {
      id: 2,
      name: "Member",
      interval: "P2W",
      ratio: 0.6,
      uploaded: "500GiB",
      privilege: "上传种子 5下载槽 发送邀请",
    },
    {
      id: 3,
      name: "Seeder",
      interval: "P1M",
      averageSeedingTime: "P1M",
      ratio: 0.8,
      uploaded: "5TiB",
      seedingSize: "5TiB",
      privilege: "上传种子 10下载槽 发送邀请 自动通过候选",
    },
    {
      id: 4,
      name: "Power User",
      interval: "P1M",
      ratio: 0.8,
      uploaded: "5TiB",
      uploads: 10,
      privilege: "上传种子 10下载槽 发送邀请 自动通过候选",
    },
    {
      id: 5,
      name: "Archivist",
      interval: "P3M",
      averageSeedingTime: "P2M",
      ratio: 1,
      uploaded: "10TiB",
      seedingSize: "10TiB",
      privilege: "上传种子 25下载槽 发送邀请 自动通过候选 访问邀请区 站免 免疫HR",
    },
    {
      id: 6,
      name: "Elite",
      interval: "P3M",
      ratio: 1,
      uploaded: "10TiB",
      uploads: 50,
      privilege: "上传种子 25下载槽 发送邀请 自动通过候选 访问邀请区 站免 免疫HR",
    },
    {
      id: 7,
      name: "DataHoarder",
      interval: "P6M",
      averageSeedingTime: "P3M",
      ratio: 1,
      uploaded: "25TiB",
      seedingSize: "20TiB",
      privilege: "上传种子 50下载槽 发送邀请 自动通过候选 访问邀请区 站免 免疫HR 双倍上传",
    },
    {
      id: 8,
      name: "Torrent Master",
      interval: "P6M",
      ratio: 1,
      uploaded: "25TiB",
      uploads: 100,
      privilege: "上传种子 50下载槽 发送邀请 自动通过候选 访问邀请区 站免 免疫HR 双倍上传",
    },
    {
      id: 9,
      name: "Elite Torrent Master",
      interval: "P1Y",
      averageSeedingTime: "P3M",
      ratio: 1,
      uploaded: "50TiB",
      seedingSize: "20TiB",
      uploads: 100,
      privilege: "上传种子 100下载槽 发送邀请 自动通过候选 访问邀请区 站免 免疫HR 双倍上传",
    },
    {
      id: 10,
      name: "Luminal",
      groupType: "vip",
      privilege: "上传种子 100下载槽 发送邀请 自动通过候选 访问邀请区 站免 免疫HR 双倍上传",
    },
  ],
};
