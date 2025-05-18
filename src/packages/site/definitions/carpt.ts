/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/carpt.net/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "carpt",
  name: "CarPT",
  description: "CarPT",
  tags: [],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["koal", "zhuweitung", "tedzhu"],

  urls: ["https://carpt.net/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "200GB",
      ratio: 2,
      seedingPoints: 40000,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "500GB",
      ratio: 3,
      seedingPoints: 80000,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "1TB",
      ratio: 4,
      seedingPoints: 150000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "2TB",
      ratio: 5,
      seedingPoints: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "4TB",
      ratio: 6,
      seedingPoints: 400000,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "6TB",
      ratio: 7,
      seedingPoints: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛；Extreme User及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "8TB",
      ratio: 8,
      seedingPoints: 800000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "10TB",
      ratio: 9,
      seedingPoints: 1000000,
      privilege: "得到十个邀请名额；可以发送邀请。",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
