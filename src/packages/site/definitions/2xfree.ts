/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/pt.2xfree.org/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "2xfree",
  name: "2xFree",
  description: "2xFree",
  tags: ["综合", "VR", "成人"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["ysmox", "IITII"],

  urls: ["https://pt.2xfree.org/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "100GB",
      ratio: 1.05,
      seedingPoints: 3000,
      privilege:
        '得到一个邀请名额；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "1TB",
      ratio: 1.55,
      seedingPoints: 80000,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "2TB",
      ratio: 2.05,
      seedingPoints: 150000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "4TB",
      ratio: 2.55,
      seedingPoints: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P52W",
      downloaded: "8TB",
      ratio: 3.05,
      seedingPoints: 400000,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P80W",
      downloaded: "16TB",
      ratio: 3.55,
      seedingPoints: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P104W",
      downloaded: "35000GB",
      ratio: 4.05,
      seedingPoints: 800000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P130W",
      downloaded: "70000GB",
      ratio: 4.55,
      seedingPoints: 1000000,
      privilege: "得到十个邀请名额。",
    },
  ],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        {
          name: "电影",
          value: 401,
        },

        {
          name: "剧集",
          value: 402,
        },

        {
          name: "综艺",
          value: 403,
        },

        {
          name: "纪录片",
          value: 404,
        },

        {
          name: "动漫",
          value: 405,
        },

        {
          name: "MV",
          value: 406,
        },

        {
          name: "体育",
          value: 407,
        },

        {
          name: "音乐",
          value: 408,
        },

        {
          name: "其他",
          value: 409,
        },

        {
          name: "电子书",
          value: 409,
        },

        {
          name: "游戏",
          value: 411,
        },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
};
