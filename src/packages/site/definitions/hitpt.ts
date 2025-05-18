/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/www.hitpt.com/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "hitpt",
  name: "百川PT",
  description: "校内10兆高速下载，优质高清资源共享！",
  tags: ["教育网", "影视", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["tongyifan", "zhuweitung"],

  urls: ["https://www.hitpt.com/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P1W",
      downloaded: "10GB",
      ratio: 1.5,
      seedingPoints: 20000,
      privilege:
        '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P1W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingPoints: 40000,
      privilege: "Elite User及以上用户封存账号后不会被删除，可以发送邀请。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P4W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingPoints: 120000,
      privilege: "得到一个邀请名额；可以用魔力值购买邀请；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P6W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingPoints: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P8W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingPoints: 400000,
      privilege: "得到二个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P10W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingPoints: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P20W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingPoints: 800000,
      privilege: "得到三个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P50W",
      downloaded: "2TB",
      ratio: 4.6,
      seedingPoints: 1000000,
      privilege: "得到五个邀请名额。",
    },
  ],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        {
          name: "高清电影",
          value: 401,
        },

        {
          name: "高清剧集",
          value: 402,
        },

        {
          name: "抢鲜或标清",
          value: 403,
        },

        {
          name: "动漫",
          value: 405,
        },

        {
          name: "体育",
          value: 407,
        },

        {
          name: "纪录片",
          value: 413,
        },

        {
          name: "综艺",
          value: 416,
        },

        {
          name: "MV",
          value: 415,
        },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "分类",
      key: "cat",
      options: [
        {
          name: "电子文档",
          value: 411,
        },

        {
          name: "音乐",
          value: 406,
        },

        {
          name: "工程软件",
          value: 408,
        },

        {
          name: "教学视频",
          value: 404,
        },

        {
          name: "游戏",
          value: 410,
        },

        {
          name: "其他",
          value: 409,
        },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
};
