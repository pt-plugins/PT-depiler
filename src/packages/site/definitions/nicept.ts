import type { ISiteMetadata } from "@ptd/site";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "nicept",
  name: "NicePT",
  description: "老师",
  tags: ["成人"],
  collaborator: ["zxb0303"],

  type: "private",
  schema: "NexusPHP",

  urls: ["aHR0cHM6Ly93d3cubmljZXB0Lm5ldC8="],

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

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。"
    },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege: "可以直接发布种子；可以查看NFO文件；可以查看用户列表；可以请求续种；可以发送邀请；可以查看排行榜；可以查看其他用户的种子历史（如用户隐私等级未设置为“强”）；可以删除自己上传的字幕。"
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "Elite User及以上用户封存账号后不会被删除。"
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 150000,
      privilege: "获得两个邀请名额；可以在做种/下载/发布时选择匿名模式。"
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。"
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 400000,
      privilege: "获得三个邀请名额；可以查看其他用户的评论、帖子历史。Veteran User及以上用户账号永久保留。"
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。"
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingBonus: 800000,
      privilege: "获得五个邀请名额。"
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingBonus: 1000000,
      privilege: "获得十个邀请名额。"
    }

  ],
};
