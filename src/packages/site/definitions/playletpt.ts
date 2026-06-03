/**
 * FIXME 由 resource/sites/playletpt.xyz/config.json 自动转换而来
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "playletpt",
  name: "PlayLet",
  description: "微而精，短而美",
  tags: ["短剧"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["端端"],

  urls: ["https://playletpt.xyz/"],

  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      seedingBonus: 40000,
      ratio: 1.05,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      seedingBonus: 80000,
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P16W",
      downloaded: "300GB",
      seedingBonus: 150000,
      ratio: 2.05,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P28W",
      downloaded: "500GB",
      seedingBonus: 250000,
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      seedingBonus: 400000,
      ratio: 3.05,
      isKept: true,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      seedingBonus: 600000,
      ratio: 3.55,
      isKept: true,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      seedingBonus: 800000,
      ratio: 4.05,
      isKept: true,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      seedingBonus: 1000000,
      ratio: 4.55,
      isKept: true,
      privilege: "得到十个邀请名额。",
    },
  ],
};
