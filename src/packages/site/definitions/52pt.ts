import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "52pt",
  name: "52PT",
  aka: ["我爱PT"],
  description: "低调地在这个PT校园快乐成长 快乐分享",
  tags: ["高清", "电影", "电视剧"],
  timezoneOffset: "+0800",

  collaborator: ["zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://52cg.fvgr/"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "Movies/电影", value: 401 },
        { name: "Documentaries/纪录片", value: 404 },
        { name: "Animations/动漫(画)", value: 405 },
        { name: "TV Series/剧集", value: 402 },
        { name: "TV Shows/综艺", value: 403 },
        { name: "Music Videos/音乐MV(演唱会)", value: 406 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Blu-ray DIY", value: 2 },
        { name: "Blu-ray Remux", value: 4 },
        { name: "Blu-ray原盘无中文", value: 11 },
        { name: "4K UHD无中文", value: 1 },
        { name: "2K原盘中字（国粤语）", value: 14 },
        { name: "4K原盘中字（国粤语）", value: 15 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264/AVC", value: 13 },
        { name: "H.265(HEVC)", value: 1 },
        { name: "MPEG-2", value: 4 },
        { name: "Other", value: 5 },
        { name: "X264", value: 11 },
        { name: "H.265", value: 14 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "DTS.HDMA", value: 4 },
        { name: "True.HD", value: 12 },
        { name: "TRUE.HD Atoms", value: 10 },
        { name: "DTS:X", value: 3 },
        { name: "AC3/DD", value: 6 },
        { name: "LPCM", value: 14 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "2K/1080p", value: 1 },
        { name: "4K/2160P", value: 5 },
        { name: "1080i", value: 2 },
        { name: "1080P-3D", value: 4 },
        { name: "720p", value: 3 },
        { name: "others", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "52PT DIY/原盘小组", value: 6 },
        { name: "52PT REMUX/重编码小组", value: 7 },
        { name: "BeyondHD", value: 1 },
        { name: "HDSKY", value: 2 },
        { name: "TTG", value: 3 },
        { name: "MTeam", value: 8 },
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
      privilege: "新用户的默认级别",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        '得到一个邀请名额；可以查看NFO文档；可以请求续种； 可以发送邀请；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 允许发布新的趣味盒内容及编辑自己发布的趣味盒内容;可以删除自己上传的字幕。',
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
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "1536GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "2560GB",
      ratio: 3.05,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "3072GB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "4608GB",
      ratio: 4.05,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "5632GB",
      ratio: 4.55,
      privilege: "得到十个邀请名额。",
    },
  ],
};
