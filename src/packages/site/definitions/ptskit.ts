import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "ptskit",
  name: "PTSkit",
  aka: ["拾刻"],
  description: "短的是时间 长的是热爱",
  tags: ["短剧", "成人"],
  timezoneOffset: "+0800",

  collaborator: ["zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://jjj.cgfxvg.bet/"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "综合", value: "/torrents.php" },
        { name: "十八禁", value: "/special.php" },
      ],
    },
    {
      name: "分类（综合）",
      key: "cat",
      options: [
        { name: "动态漫", value: 402 },
        { name: "动漫", value: 405 },
        { name: "短剧", value: 404 },
        { name: "电影", value: 401 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分类（十八禁）",
      key: "cat",
      options: [
        { name: "欧美", value: 412 },
        { name: "日本", value: 411 },
        { name: "国产", value: 410 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Track", value: 9 },
        { name: "CD", value: 8 },
        { name: "DVDR", value: 6 },
        { name: "HDTV", value: 5 },
        { name: "MiniBD", value: 4 },
        { name: "Encode", value: 7 },
        { name: "Remux", value: 3 },
        { name: "HD DVD", value: 2 },
        { name: "Blu-ray", value: 1 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264", value: 1 },
        { name: "VC-1", value: 2 },
        { name: "Xvid", value: 3 },
        { name: "MPEG-2", value: 4 },
        { name: "Other", value: 5 },
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
        { name: "2160p", value: 5 },
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
    CategoryInclbookmarked,
  ],

  searchEntry: {
    area_normal: { name: "综合", requestConfig: { url: "/torrents.php" } },
    area_9kg: { name: "十八禁", enabled: false, requestConfig: { url: "/special.php" } },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      seedingBonus: 80000,
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      seedingBonus: 150000,
      ratio: 2.05,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      seedingBonus: 250000,
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      seedingBonus: 400000,
      ratio: 3.05,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      seedingBonus: 600000,
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      seedingBonus: 800000,
      ratio: 4.05,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      seedingBonus: 1000000,
      ratio: 4.55,
      privilege: "得到十个邀请名额。",
    },
  ],
};
