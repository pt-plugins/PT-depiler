/**
 * FIXME 由 resource/sites/sewerpt.com/config.json 自动转换而来
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "sewerpt",
  name: "下水道",
  aka: ["SewerPT"],
  description: "再小众的热爱，也值得被世界看见",
  tags: ["冷门", "低分", "粤语", "影视"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["sewerpt"],

  urls: ["https://sewerpt.com/"],

  // 官方发布组（官组种子标题以 -SewageWeb 结尾）
  officialGroupPattern: [/-SewageWeb/i],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影/Movies", value: 401 },
        { name: "电视剧/TV Series", value: 402 },
        { name: "综艺/TV Shows", value: 403 },
        { name: "纪录片/Documentaries", value: 404 },
        { name: "动漫/Animations", value: 405 },
        { name: "音乐/Music", value: 408 },
        { name: "其他/Others", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Blu-ray", value: 1 },
        { name: "HD DVD", value: 2 },
        { name: "Remux", value: 3 },
        { name: "MiniBD", value: 4 },
        { name: "HDTV", value: 5 },
        { name: "DVDR", value: 6 },
        { name: "Encode", value: 7 },
        { name: "CD", value: 8 },
        { name: "WEB-DL", value: 10 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "AVC/H.264", value: 1 },
        { name: "VC-1", value: 2 },
        { name: "Xvid", value: 3 },
        { name: "MPEG-2", value: 4 },
        { name: "Other", value: 5 },
        { name: "HEVC/H.265", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "FLAC", value: 1 },
        { name: "APE", value: 2 },
        { name: "DTS", value: 3 },
        { name: "MP3", value: 4 },
        { name: "OGG", value: 5 },
        { name: "AAC", value: 6 },
        { name: "Other", value: 7 },
        { name: "AC3", value: 8 },
        { name: "ALAC", value: 9 },
        { name: "WAV", value: 10 },
        { name: "E-AC3", value: 11 },
        { name: "TrueHD Atmos", value: 12 },
        { name: "TrueHD", value: 13 },
        { name: "DTS-HD MA", value: 14 },
        { name: "DTS:X", value: 15 },
        { name: "LPCM", value: 16 },
        { name: "AV3A", value: 17 },
        { name: "OPUS", value: 18 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "1080p/1080i", value: 1 },
        { name: "480p", value: 2 },
        { name: "720p", value: 3 },
        { name: "2K/1440p", value: 4 },
        { name: "4K/2160p", value: 5 },
        { name: "8K/4320p", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "团队",
      key: "team",
      options: [
        { name: "官组/SewageWeb", value: 1 },
        { name: "其他/Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "标签",
      key: "tag_id",
      options: [
        { name: "禁转", value: 1 },
        { name: "首发", value: 2 },
        { name: "DIY", value: 4 },
        { name: "国语", value: 5 },
        { name: "中字", value: 6 },
        { name: "HDR", value: 7 },
        { name: "分集", value: 8 },
        { name: "原创", value: 9 },
        { name: "原盘", value: 10 },
        { name: "冷门/低分", value: 11 },
        { name: "完结", value: 12 },
        { name: "短剧", value: 13 },
        { name: "杜比", value: 14 },
        { name: "粤语", value: 15 },
        { name: "高码率", value: 16 },
      ],
      cross: false, // tag_id 不支持多选（实测 tag_id[]=5&tag_id[]=15 返回空）
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  userInfo: {
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        // 本站魔力值称为「金币」
        selector: ["td.rowhead:contains('金币') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "User", // FIXME
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。 ",
    },
    {
      id: 1,
      name: "大工",
      nameAka: ["Power User"],
      interval: "P4W",
      downloaded: "50GB",
      seedingBonus: 40000,
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； " +
        '可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。' +
        "当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于0.95，你将自动降级。",
    },
    {
      id: 2,
      name: "技工",
      nameAka: ["Elite User"],
      interval: "P8W",
      downloaded: "120GB",
      seedingBonus: 80000,
      ratio: 1.55,
      privilege:
        "Elite User及以上用户封存账号后不会被删除。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于1.45，你将自动降级。",
    },
    {
      id: 3,
      name: "安全员",
      nameAka: ["Crazy User"],
      interval: "P15W",
      downloaded: "300GB",
      seedingBonus: 150000,
      ratio: 2.05,
      privilege:
        "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于1.95，你将自动降级。",
    },
    {
      id: 4,
      name: "技术员",
      nameAka: ["Insane User"],
      interval: "P25W",
      downloaded: "500GB",
      seedingBonus: 250000,
      ratio: 2.55,
      privilege: "可以查看普通日志。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于2.45，你将自动降级。",
    },
    {
      id: 5,
      name: "工长",
      nameAka: ["Veteran User"],
      interval: "P40W",
      downloaded: "750GB",
      seedingBonus: 400000,
      ratio: 3.05,
      isKept: true,
      privilege:
        "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于2.95，你将自动降级。",
    },
    {
      id: 6,
      name: "包工头",
      nameAka: ["Extreme User"],
      interval: "P60W",
      downloaded: "1TB",
      seedingBonus: 600000,
      ratio: 3.55,
      isKept: true,
      privilege:
        "可以更新过期的外部信息；可以查看Extreme User论坛。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于3.45，你将自动降级。",
    },
    {
      id: 7,
      name: "工程师",
      nameAka: ["Ultimate User"],
      interval: "P80W",
      downloaded: "1.5TB",
      seedingBonus: 900000,
      ratio: 4.05,
      isKept: true,
      privilege: "得到五个邀请名额。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于3.95，你将自动降级。",
    },
    {
      id: 8,
      name: "老板",
      nameAka: ["Nexus Master"],
      interval: "P100W",
      downloaded: "3TB",
      seedingBonus: 1500000,
      ratio: 4.55,
      isKept: true,
      privilege: "得到十个邀请名额。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于4.45，你将自动降级。",
    },
  ],
};
