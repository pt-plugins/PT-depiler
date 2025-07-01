/**
 * FIXME 由 resource/sites/www.ptlover.cc/config.json 自动转换而来
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "afun",
  name: "Afun",
  description: "希望都能找到各自的兴趣、爱好、欢喜",
  tags: ["综合", "电影", "电视剧", "纪录片", "成人"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["geni", "hyuan280"],

  urls: ["uggcf://jjj.cgybire.pp/"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "种子", value: "/torrents.php" },
        { name: "9KG", value: "/special.php" },
      ],
    },
    {
      name: "分类（种子）",
      key: "cat_normal",
      options: [
        { name: "综艺", value: 414 },
        { name: "HQ音频", value: 408 },
        { name: "其他", value: 409 },
        { name: "体育", value: 407 },
        { name: "MV", value: 406 },
        { name: "脱口秀", value: 403 },
        { name: "电视剧", value: 402 },
        { name: "动画", value: 405 },
        { name: "纪录片", value: 404 },
        { name: "电影", value: 401 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分类（9KG）",
      key: "cat_special",
      options: [
        { name: "游戏", value: 418 },
        { name: "音频", value: 413 },
        { name: "动画", value: 419 },
        { name: "直播秀", value: 411 },
        { name: "电视剧", value: 412 },
        { name: "电影", value: 421 },
        { name: "写真", value: 420 },
        { name: "绘本", value: 417 },
        { name: "国产", value: 416 },
        { name: "步兵", value: 415 },
        { name: "骑兵", value: 410 },
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
        { name: "WEB-DL(TV)", value: 10 },
        { name: "BDMV", value: 11 },
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
        { name: "H.265(HEVC)", value: 6 },
        { name: "AV1", value: 7 },
        { name: "AVC", value: 8 },
        { name: "MPEG-4", value: 9 },
        { name: "VP9", value: 10 },
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
        { name: "2160P", value: 5 },
        { name: "8K", value: 6 },
        { name: "480P", value: 7 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "TTG", value: 6 },
        { name: "sunny", value: 7 },
        { name: "HHWEB", value: 8 },
        { name: "52pt", value: 14 },
        { name: "OpenCD", value: 26 },
        { name: "MrHulk", value: 25 },
        { name: "JPTVclub", value: 24 },
        { name: "DUSKLiGHT", value: 23 },
        { name: "ADWeb", value: 22 },
        { name: "DBTV", value: 21 },
        { name: "PTerWEB", value: 20 },
        { name: "AilMWeb", value: 19 },
        { name: "HDH", value: 18 },
        { name: "NTb", value: 17 },
        { name: "Raws", value: 16 },
        { name: "doraemon", value: 15 },
        { name: "HDS", value: 1 },
        { name: "ZWEX", value: 13 },
        { name: "FRDS", value: 12 },
        { name: "HDHome", value: 11 },
        { name: "QHstudIo", value: 10 },
        { name: "UBWEB", value: 9 },
        { name: "Other", value: 5 },
        { name: "WiKi", value: 4 },
        { name: "MySiLU", value: 3 },
        { name: "CHD", value: 2 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "来源",
      key: "source",
      options: [
        { name: "大陆", value: 1 },
        { name: "香港", value: 2 },
        { name: "台湾", value: 3 },
        { name: "欧美", value: 4 },
        { name: "日本", value: 5 },
        { name: "韩国", value: 6 },
        { name: "印度", value: 7 },
        { name: "Other", value: 99 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked
  ],

  searchEntry: {
    area_normal: { name: "种子", requestConfig: { url: "/torrents.php" } },
    area_special: { name: "9KG", enabled: false, requestConfig: { url: "/special.php" } },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        selector: ["td.rowhead:contains('喵饼') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。"
    },
    {
      id: 1,
      name: "Power User",
      privilege: '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000
    },
    {
      id: 2,
      name: "Elite User",
      privilege: "Elite User及以上用户封存账号后不会被删除。",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 80000
    },
    {
      id: 3,
      name: "Crazy User",
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 150000
    },
    {
      id: 4,
      name: "Insane User",
      privilege: "可以查看普通日志。",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 250000
    },
    {
      id: 5,
      name: "Veteran User",
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 400000
    },
    {
      id: 6,
      name: "Extreme User",
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
      interval: "P60W",
      downloaded: "1024GB",
      ratio: 3.55,
      seedingBonus: 600000
    },
    {
      id: 7,
      name: "Ultimate User",
      privilege: "得到五个邀请名额。",
      interval: "P80W",
      downloaded: "1536GB",
      ratio: 4.05,
      seedingBonus: 800000
    },
    {
      id: 8,
      name: "Nexus Master",
      privilege: "得到十个邀请名额。",
      interval: "P100W",
      downloaded: "3072GB",
      ratio: 4.55,
      seedingBonus: 1000000
    },
  ],
};
