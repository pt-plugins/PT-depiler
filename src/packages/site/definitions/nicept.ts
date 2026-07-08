import type { ISiteMetadata } from "../types";
import { SchemaMetadata, xiaomloveDefaultUserLevelRequirements } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "nicept",
  name: "NicePT",
  aka: ["老师"],
  description: "老师",
  tags: ["成人"],
  collaborator: ["zxb0303"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://jjj.avprcg.arg/"],

  favicon: "./_default_nexusphp.png",

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 504, name: "SM调教（限制级）" },
        { value: 404, name: "写真、套图" },
        { value: 503, name: "真人秀，自拍（限制级）" },
        { value: 403, name: "动漫（限制级）" },
        { value: 501, name: "其他（限制级）" },
        { value: 402, name: "欧美" },
        { value: 401, name: "日本无码" },
        { value: 500, name: "日本有码" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "来源",
      key: "source",
      options: [
        { value: 1, name: "Blu-ray" },
        { value: 2, name: "HD DVD" },
        { value: 3, name: "DVD" },
        { value: 4, name: "HDTV" },
        { value: 5, name: "TV" },
        { value: 6, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 1, name: "H.264" },
        { value: 2, name: "VC-1" },
        { value: 3, name: "Xvid" },
        { value: 4, name: "MPEG-2" },
        { value: 5, name: "Other" },
        { value: 13, name: "HEVC" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 11, name: "720p以下" },
        { value: 3, name: "720p" },
        { value: 2, name: "1080i" },
        { value: 1, name: "1080p" },
        { value: 10, name: "4K 2160p" },
      ],
      cross: { mode: "append" },
    },
  ],

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
