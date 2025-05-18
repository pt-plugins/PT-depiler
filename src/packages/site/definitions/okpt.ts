/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/www.okpt.net/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "okpt",
  name: "OKPT",
  description: "okpt.net",
  tags: ["综合", "音乐", "写真"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["yiyule"],

  urls: ["https://www.okpt.net/"],

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
      privilege: "可以更新过期的外部信息。六级烧伤(Extreme User)及以上用户会永远保留账号。",
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
          name: "体育",
          value: 407,
        },

        {
          name: "漫画书",
          value: 436,
        },

        {
          name: "动漫",
          value: 405,
        },

        {
          name: "书刊",
          value: 434,
        },

        {
          name: "有声书",
          value: 432,
        },

        {
          name: "MV",
          value: 406,
        },

        {
          name: "游戏",
          value: 413,
        },

        {
          name: "软件",
          value: 431,
        },

        {
          name: "其他",
          value: 409,
        },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "分类",
      key: "cat",
      options: [
        {
          name: "写真图影",
          value: 412,
        },

        {
          name: "写真影片",
          value: 411,
        },

        {
          name: "写真图片",
          value: 410,
        },

        {
          name: "音乐",
          value: 415,
        },

        {
          name: "其他",
          value: 416,
        },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
};
