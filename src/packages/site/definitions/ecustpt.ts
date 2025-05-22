/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/ecustpt.eu.org/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "ecustpt",
  name: "ECUSTPT",
  description: "华东理工大学PT站，逢考必过",
  tags: ["教育网", "影视", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["EasonWong", "hui-shao"],

  urls: ["https://pt.ecust.pp.ua/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "5GB",
      ratio: 1.05,
      seedingPoints: 40000,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "12GB",
      ratio: 1.55,
      seedingPoints: 160000,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "30GB",
      ratio: 2.05,
      seedingPoints: 300000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "100GB",
      ratio: 2.55,
      seedingPoints: 500000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "512GB",
      ratio: 3.05,
      seedingPoints: 800000,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingPoints: 2000000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingPoints: 6000000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingPoints: 10000000,
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
          name: "电视剧",
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
          name: "音轨",
          value: 408,
        },

        {
          name: "其他",
          value: 409,
        },

        {
          name: "学习",
          value: 410,
        },

        {
          name: "游戏",
          value: 411,
        },

        {
          name: "软件",
          value: 416,
        },

        {
          name: "MAC",
          value: 417,
        },

        {
          name: "校园",
          value: 419,
        },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
};
