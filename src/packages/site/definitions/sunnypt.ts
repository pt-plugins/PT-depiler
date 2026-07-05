import { type ISiteMetadata } from "../types";
import {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
  xiaomloveDefaultUserLevelRequirements,
} from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "sunnypt",
  name: "Sunny",
  aka: ["SunnyPT", "阳光"],
  description: "The Ultimate File Sharing Experience",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",
  favicon: "./sunnypt.ico",

  collaborator: ["yanleichang"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://fhaalcg.gbc/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影", value: 401 },
        { name: "电视剧", value: 402 },
        { name: "综艺", value: 403 },
        { name: "动漫", value: 404 },
        { name: "纪录片", value: 405 },
        { name: "体育", value: 406 },
        { name: "MV", value: 407 },
        { name: "音轨", value: 408 },
        { name: "其他", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "视频类",
      key: "medium",
      options: [
        { name: "UHD Blu-ray", value: 11 },
        { name: "Blu-ray", value: 1 },
        { name: "Remux", value: 3 },
        { name: "WEB-DL", value: 10 },
        { name: "Encode", value: 6 },
        { name: "HDTV", value: 5 },
        { name: "MiniBD", value: 4 },
        { name: "HD DVD", value: 7 },
        { name: "DVD", value: 8 },
        { name: "Other", value: 12 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "4320P/8K/FUHD", value: 7 },
        { name: "2160P/4K/UHD", value: 8 },
        { name: "1080p/1080i/FHD", value: 1 },
        { name: "720p/720i/HD", value: 6 },
        { name: "360p/360i/SD", value: 5 },
        { name: "Other", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频类",
      key: "audiocodec",
      options: [
        { name: "2160p", value: 5 },
        { name: "1080p", value: 1 },
        { name: "1080i", value: 2 },
        { name: "720p", value: 3 },
        { name: "SD", value: 4 },
        { name: "Other", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "Sunny", value: 6 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
