import type { ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "lemonhdnet",
  name: "柠檬不甜",
  description: "柠檬不甜",
  tags: ["综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["hyuan280"],

  urls: ["uggcf://yrzbauq.arg/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "Movies", value: 401 },
        { name: "Misc", value: 402 },
        { name: "Animations", value: 403 },
        { name: "Music Videos", value: 404 },
        { name: "Documentaries", value: 405 },
        { name: "TV Series", value: 406 },
        { name: "TV Shows", value: 407 },
        { name: "3D", value: 408 },
        { name: "Other", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Blu-ray", value: 1 },
        { name: "Encode", value: 2 },
        { name: "Remux", value: 3 },
        { name: "WEB-DL", value: 4 },
        { name: "HDTV", value: 5 },
        { name: "4K-UltraHD", value: 6 },
        { name: "8K-UltraHD", value: 7 },
        { name: "DVD", value: 8 },
        { name: "CD", value: 9 },
        { name: "Other", value: 10 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264/AVC", value: 1 },
        { name: "H.265/HEVC", value: 2 },
        { name: "VC-1", value: 3 },
        { name: "MPEG-2", value: 4 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "4K_UHD", value: 1 },
        { name: "1080p/i", value: 2 },
        { name: "720p/i", value: 3 },
        { name: "SD", value: 4 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "HDS", value: 1 },
        { name: "CHD", value: 2 },
        { name: "MySiLU", value: 3 },
        { name: "WiKi", value: 4 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked
  ],

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别。"
    },
    {
      id: 1,
      name: "Power User",
      privilege: '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
      interval: "P2W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 80000
    },
    {
      id: 2,
      name: "Elite User",
      privilege: "Elite User",
      interval: "P3W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 150000
    },
    {
      id: 3,
      name: "Crazy User",
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
      interval: "P4W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 300000
    },
    {
      id: 4,
      name: "Insane User",
      privilege: "可以查看普通日志。",
      interval: "P5W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 500000
    },
    {
      id: 5,
      name: "Veteran User",
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户封存账号后不会被删除。",
      interval: "P6W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 1000000
    },
    {
      id: 6,
      name: "Extreme User",
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
      interval: "P7W",
      downloaded: "1024GB",
      ratio: 3.55,
      seedingBonus: 2000000
    },
    {
      id: 7,
      name: "Ultimate User",
      privilege: "得到五个邀请名额。Ultimate User及以上用户会永远保留账号。",
      interval: "P8W",
      downloaded: "1536GB",
      ratio: 4.05,
      seedingBonus: 5000000
    },
    {
      id: 8,
      name: "Nexus Master",
      privilege: "得到十个邀请名额。",
      interval: "P9W",
      downloaded: "3072GB",
      ratio: 4.55,
      seedingBonus: 10000000
    },
  ],
};
