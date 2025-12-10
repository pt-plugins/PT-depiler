/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/carpt.yml
 * @JackettIssue https://github.com/Jackett/Jackett/issues/13388
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "carpt",
  name: "CarPT",
  aka: ["车PT"],
  description: "=链接@分享=",
  timezoneOffset: "+0800",

  collaborator: ["zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://pnecg.arg/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影/Movies", value: 401 },
        { name: "连续剧/TV-Series", value: 402 },
        { name: "动漫/Animation", value: 403 },
        { name: "纪录片/Documentary", value: 404 },
        { name: "综艺/TV-Show", value: 405 },
        { name: "音乐/Music", value: 406 },
        { name: "其他/Other", value: 407 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Encode", value: 1 },
        { name: "WEB", value: 2 },
        { name: "HDTV", value: 3 },
        { name: "DVDRip", value: 4 },
        { name: "CD", value: 5 },
        { name: "Other", value: 6 },
        { name: "Blu-ray", value: 7 },
        { name: "Blu-rayUHD", value: 8 },
        { name: "Remux", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264/AVC/x264", value: 1 },
        { name: "H.265/HEVC/x265", value: 2 },
        { name: "MPEG-2", value: 3 },
        { name: "VC-1", value: 4 },
        { name: "Xvid", value: 5 },
        { name: "Other", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "TrueHD", value: 1 },
        { name: "DTS-HD/DTS", value: 2 },
        { name: "AC3", value: 3 },
        { name: "LPCM", value: 4 },
        { name: "FLAC", value: 5 },
        { name: "mp3", value: 6 },
        { name: "AAC", value: 7 },
        { name: "APE", value: 8 },
        { name: "wav", value: 10 },
        { name: "Other", value: 9 },
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
        { name: "CarPT", value: 1 },
        { name: "WiKi", value: 2 },
        { name: "CMCT", value: 3 },
        { name: "M-team", value: 4 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  officialGroupPattern: [/CarPT/i],

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "200GB",
      ratio: 2.0,
      seedingBonus: 40000,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "500GB",
      ratio: 3.0,
      seedingBonus: 80000,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "1TB",
      ratio: 4.0,
      seedingBonus: 150000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "2TB",
      ratio: 5.0,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "4TB",
      ratio: 6.0,
      seedingBonus: 400000,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "6TB",
      ratio: 7.0,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。Extreme User及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "8TB",
      ratio: 8.0,
      seedingBonus: 800000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "10TB",
      ratio: 9.0,
      seedingBonus: 1000000,
      privilege: "得到十个邀请名额。可以发送邀请。",
    },
  ],
};
