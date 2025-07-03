import type { ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "nexushd",
  name: "NexusHD",
  description: "国内第一个创建并使用NexusPHP架构的PT站",
  tags: ["教育网"],

  favicon: "./_default_nexusphp.png",

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://i6.arkhfuq.bet/", "uggcf://jjj.arkhfuq.bet/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "Movies", value: 101 },
        { name: "TV Series", value: 102 },
        { name: "TV Shows", value: 103 },
        { name: "Documentaries", value: 104 },
        { name: "Anime", value: 105 },
        { name: "Sports", value: 106 },
        { name: "Music Videos", value: 107 },
        { name: "HQ Audio", value: 108 },
        { name: "Games", value: 110 },
        { name: "E-learning", value: 111 },
        { name: "Other", value: 109 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "来源",
      key: "source",
      options: [
        { name: "Blu-ray", value: 1 },
        { name: "HD DVD", value: 2 },
        { name: "DVD", value: 3 },
        { name: "HDTV", value: 4 },
        { name: "TV", value: 5 },
        { name: "WEB-DL", value: 7 },
        { name: "CD", value: 8 },
        { name: "Other", value: 6 },
        { name: "WEBRip", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264", value: 1 },
        { name: "H.265", value: 2 },
        { name: "VC-1", value: 3 },
        { name: "Xvid", value: 4 },
        { name: "MPEG-2", value: 5 },
        { name: "FLAC", value: 10 },
        { name: "APE", value: 11 },
        { name: "Other", value: 15 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "1080p", value: 1 },
        { name: "1080i", value: 2 },
        { name: "720p", value: 3 },
        { name: "SD", value: 4 },
        { name: "Lossless", value: 5 },
        { name: "2160p", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "处理",
      key: "processing",
      options: [
        { name: "Raw", value: 1 },
        { name: "Encode", value: 2 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看、搜索用户列表；" +
        "可以请求续种；可以查看排行榜；可以查看其它用户的种子历史（如果用户隐私等级未设置为“强”）； 可以删除自己上传的字幕。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到两个邀请名额；在发布种子、上传字幕时选择匿名。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史；Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      privilege: "得到五个邀请名额；查看种子文件的结构。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "得到十个邀请名额。",
    },
  ],
};
