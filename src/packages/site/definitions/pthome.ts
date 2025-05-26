import type { ISiteMetadata } from "@ptd/site";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "pthome",
  name: "PTHome",
  description: "PT之家",
  tags: ["影视", "综合"],
  collaborator: ["zxb0303"],

  type: "private",
  schema: "NexusPHP",

  urls: ["aHR0cHM6Ly9wdGhvbWUubmV0Lw=="],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { value: 401, name: "Movies电影" },
        { value: 402, name: "TV Series电视剧" },
        { value: 404, name: "Documentaries纪录片" },
        { value: 405, name: "Animations动漫" },
        { value: 403, name: "TV Shows综艺" },
        { value: 406, name: "Music Videos" },
        { value: 407, name: "Sports体育" },
        { value: 408, name: "HQ Audio音乐" },
        { value: 410, name: "Games游戏" },
        { value: 411, name: "Study学习" },
        { value: 409, name: "Others其他" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { value: 12, name: "UHD Blu-ray" },
        { value: 13, name: "UHD Blu-ray/DIY" },
        { value: 1, name: "Blu-ray(原盘)" },
        { value: 14, name: "Blu-ray/DIY" },
        { value: 3, name: "REMUX" },
        { value: 5, name: "HDTV" },
        { value: 15, name: "encode" },
        { value: 10, name: "WEB-DL" },
        { value: 2, name: "DVD(原盘)" },
        { value: 8, name: "CD" },
        { value: 9, name: "Track" },
        { value: 11, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 6, name: "H.265(HEVC)" },
        { value: 1, name: "H.264(AVC)" },
        { value: 2, name: "VC-1" },
        { value: 4, name: "MPEG-2" },
        { value: 5, name: "Other" }
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 19, name: "DTS-HD MA" },
        { value: 20, name: "TrueHD" },
        { value: 21, name: "LPCM" },
        { value: 3, name: "DTS" },
        { value: 18, name: "DD/AC3" },
        { value: 6, name: "AAC" },
        { value: 1, name: "FLAC" },
        { value: 2, name: "APE" },
        { value: 22, name: "WAV" },
        { value: 23, name: "MP3" },
        { value: 24, name: "M4A" },
        { value: 7, name: "Other" }
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 10, name: "8K" },
        { value: 5, name: "4K" },
        { value: 1, name: "1080p" },
        { value: 2, name: "1080i" },
        { value: 3, name: "720p" },
        { value: 4, name: "SD" },
        { value: 11, name: "None" }
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 19, name: "PTHome" },
        { value: 21, name: "PTH" },
        { value: 20, name: "PTHweb" },
        { value: 22, name: "PTHtv" },
        { value: 23, name: "PTHAudio" },
        { value: 24, name: "PTHeBook" },
        { value: 25, name: "PTHmusic" },
        { value: 5, name: "Other" }
      ],
    },
  ],

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户的默认级别。"
    },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      downloaded: "200GB",
      ratio: 1.0,
      seedingBonus: 20000,
      privilege: "可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如未设置隐私“强”)；可以删除自己上传的字幕；可以浏览论坛邀请专版。"
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: "350GB",
      ratio: 1.1,
      seedingBonus: 50000,
      privilege: "Elite User及以上用户封存账号后不会被删除。"
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 1.2,
      seedingBonus: 200000,
      privilege: "可以在做种/下载/发布时选择匿名模式。"
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P25W",
      downloaded: "1TB",
      ratio: 1.3,
      seedingBonus: 400000,
      privilege: "可以查看普通日志。"
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "2TB",
      ratio: 1.5,
      seedingBonus: 600000,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上等级账号永久保留。"
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "3TB",
      ratio: 1.5,
      seedingBonus: 800000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。"
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "4TB",
      ratio: 1.7,
      seedingBonus: 1000000,
      privilege: "同白银用户等级权限。"
    },
  ],
};
