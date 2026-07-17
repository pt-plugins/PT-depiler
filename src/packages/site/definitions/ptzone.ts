import type { ISiteMetadata } from "../types";
import { SchemaMetadata, xiaomloveDefaultUserLevelRequirements } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "ptzone",
  name: "PTzone",
  description: "分享地带！",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",

  collaborator: ["xusky0328"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://cgmbar.klm/"],
  favicon: "./_default_nexusphp.png",

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 401, name: "Movies(电影)" },
        { value: 402, name: "TV Series(电视剧)" },
        { value: 403, name: "TV Shows(综艺)" },
        { value: 404, name: "Documentaries(纪录片)" },
        { value: 405, name: "Animations(动漫)" },
        { value: 406, name: "Music(音乐)" },
        { value: 407, name: "Sports(体育)" },
        { value: 408, name: "HQ Audio(音乐)" },
        { value: 410, name: "Software(软件)" },
        { value: 411, name: "Games(游戏)" },
        { value: 409, name: "Others(其它)" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { value: 1, name: "Blu-ray" },
        { value: 2, name: "HD DVD" },
        { value: 3, name: "Remux" },
        { value: 4, name: "WEB-DL" },
        { value: 5, name: "HDTV" },
        { value: 6, name: "DVDR" },
        { value: 7, name: "Encode" },
        { value: 8, name: "CD" },
        { value: 9, name: "Track" },
        { value: 10, name: "UHD" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 1, name: "H.264" },
        { value: 2, name: "VC-1" },
        { value: 3, name: "MPEG-2" },
        { value: 4, name: "MPEG-4" },
        { value: 5, name: "Other" },
        { value: 6, name: "H.265" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 1, name: "FLAC" },
        { value: 2, name: "APE" },
        { value: 3, name: "DTS" },
        { value: 4, name: "MP3" },
        { value: 5, name: "OGG" },
        { value: 6, name: "AAC" },
        { value: 7, name: "Other" },
        { value: 8, name: "AC3" },
        { value: 10, name: "DTS-HD MA" },
        { value: 11, name: "DD/AC3" },
        { value: 12, name: "DDP/EAC3" },
        { value: 13, name: "DTS-HD" },
        { value: 14, name: "TrueHD" },
        { value: 15, name: "WAV" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 1, name: "1080p" },
        { value: 2, name: "1080i" },
        { value: 3, name: "720p" },
        { value: 4, name: "SD" },
        { value: 5, name: "8K" },
        { value: 6, name: "4K" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 1, name: "HDS" },
        { value: 2, name: "CHD" },
        { value: 3, name: "MySiLU" },
        { value: 4, name: "WiKi" },
        { value: 5, name: "Other" },
        { value: 6, name: "PTZWeb" },
      ],
    },
  ],

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
