/**
 * FIXME 由 resource/sites/www.gamegamept.com/config.json 自动转换而来
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "ggpt",
  name: "GGPT",
  description: "gamegamept.com",
  tags: ["游戏"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["IITII", "yiyule"],

  urls: ["uggcf://jjj.tnzrtnzrcg.pbz/"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "种子区", value: "/torrents.php" },
        { name: "9KG专区", value: "/special.php" },
      ],
    },
    {
      name: "分类(种子区)",
      key: "cat_normal",
      notes: "请先设置搜索入口为“种子区”！请勿与9KG专区类别同时选择！",
      options: [
        { name: "PC游戏", value: 401 },
        { name: "索尼主机游戏", value: 404 },
        { name: "微软主机游戏", value: 405 },
        { name: "任天堂主机游戏", value: 406 },
        { name: "苹果游戏", value: 407 },
        { name: "安卓游戏", value: 409 },
        { name: "游戏书藉", value: 410 },
        { name: "其他", value: 411 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "分类(9KG专区)",
      key: "cat_special",
      notes: "请先设置搜索入口为“9KG专区”！请勿与种子区类别同时选择！",
      options: [
        { name: "9PC游戏", value: 412 },
        { name: "9索尼主机游戏", value: 413 },
        { name: "9KG-游戏", value: 414 },
        { name: "9任天堂主机游戏", value: 415 },
        { name: "9苹果游戏", value: 416 },
        { name: "9安卓游戏", value: 417 },
        { name: "其他", value: 418 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  searchEntry: {
    area_normal: { name: "种子区", requestConfig: { url: "/torrents.php" } },
    area_special: { name: "9KG专区", enabled: false, requestConfig: { url: "/special.php" } },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 2,
      seedingPoints: 40000,
      privilege:
        '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "100GB",
      ratio: 2.5,
      seedingPoints: 80000,
      privilege: "没有新权限增加",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 3,
      seedingPoints: 150000,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 3.5,
      seedingPoints: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "1TB",
      ratio: 4,
      seedingPoints: 400000,
      privilege: "可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "2TB",
      ratio: 4.5,
      seedingPoints: 600000,
      privilege: "可以更新过期的外部信息。游戏大仙(Extreme User)及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "5TB",
      ratio: 5,
      seedingPoints: 800000,
      privilege: "这个等级会永远保留账号。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "10TB",
      ratio: 5.5,
      seedingPoints: 1000000,
      privilege: "这个等级会永远保留账号。",
    },
  ],
};
