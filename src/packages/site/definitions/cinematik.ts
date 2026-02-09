import { type ISiteMetadata } from "../types";
import { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "cinematik",
  name: "Cinematik",
  aka: ["tik"],
  tags: ["影视,原盘"],
  timezoneOffset: "+0000",
  collaborator: ["akina"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://pvarzngvx.arg/"],

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "2下载槽",
    },
    {
      id: 2,
      name: "CineNovice",
      ratio: 0.95,
      interval: "P30D",
      uploaded: "1TiB",
      privilege: "10下载槽",
    },
    {
      id: 3,
      name: "FilmEnthusiast",
      ratio: 1.05,
      interval: "P60D",
      uploaded: "5TiB",
      privilege: "15下载槽 访问邀请区",
    },
    {
      id: 4,
      name: "FilmScholar",
      ratio: 1.2,
      interval: "P90D",
      uploaded: "10TiB",
      privilege: "20下载槽 访问邀请区",
    },
    {
      id: 5,
      name: "CineExpert",
      ratio: 1.5,
      interval: "P180D",
      uploaded: "50TiB",
      privilege: "25下载槽 访问邀请区 发送邀请",
    },
    {
      id: 6,
      name: "CinemaSage",
      ratio: 2,
      interval: "P365D",
      uploaded: "100TiB",
      privilege: "30下载槽 访问邀请区 发送邀请",
    },
    {
      id: 7,
      name: "CineSeeder",
      ratio: 1,
      interval: "P60D",
      averageSeedingTime: "P60D",
      seedingSize: "10TiB",
      privilege: "50下载槽 访问邀请区 发送邀请 Personalised HnR management by staff",
    },
    {
      id: 8,
      name: "FilmArchivist",
      ratio: 1,
      interval: "P90D",
      averageSeedingTime: "P90D",
      seedingSize: "20TiB",
      privilege: "1000下载槽 访问邀请区 发送邀请 免疫HR 双倍上传 可以访问FilmArchivist论坛",
    },
  ],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Film", value: 1 },
        { name: "TV", value: 2 },
        { name: "Foreign Film", value: 3 },
        { name: "Foreign TV", value: 4 },
        { name: "Opera &amp; Musical", value: 5 },
        { name: "Asian Film", value: 6 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "规格",
      key: "typeIds",
      options: [
        { name: "UHD BD100", value: 3 },
        { name: "UHD BD66", value: 4 },
        { name: "BD50", value: 5 },
        { name: "BD25", value: 6 },
        { name: "NTSC DVD9", value: 7 },
        { name: "NTSC DVD5", value: 8 },
        { name: "PAL DVD9", value: 9 },
        { name: "PAL DVD5", value: 10 },
        { name: "Custom", value: 1 },
        { name: "3D", value: 11 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutionIds",
      options: [
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
