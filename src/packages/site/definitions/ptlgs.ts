/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/ptlgs.org/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "ptlgs",
  name: "PTLGS",
  description: "ptlgs.org",
  tags: ["综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["yxlimo"],

  urls: ["https://ptlgs.org/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P0W",
      downloaded: "100GB",
      ratio: 1.1,
      seedingPoints: 20000,
      privilege:
        '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P0W",
      downloaded: "200GB",
      ratio: 1.2,
      seedingPoints: 50000,
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P0W",
      downloaded: "500GB",
      ratio: 1.2,
      seedingPoints: 100000,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane user",
      interval: "P0W",
      downloaded: "1TB",
      ratio: 1.2,
      seedingPoints: 200000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P0W",
      downloaded: "2TB",
      ratio: 1.2,
      seedingPoints: 500000,
      privilege: "得到1个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P0W",
      downloaded: "3TB",
      ratio: 1.5,
      seedingPoints: 800000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P0W",
      downloaded: "4TB",
      ratio: 1.5,
      seedingPoints: 1000000,
      privilege: "得到一个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus User",
      interval: "P0W",
      downloaded: "5TB",
      ratio: 1.5,
      seedingPoints: 2500000,
      privilege: "得到一个邀请名额。",
    },
  ],
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        {
          name: "其它",
          value: 409,
        },

        {
          name: "体育",
          value: 407,
        },

        {
          name: "音乐",
          value: 406,
        },

        {
          name: "综艺",
          value: 403,
        },

        {
          name: "电视剧",
          value: 402,
        },

        {
          name: "动漫",
          value: 405,
        },

        {
          name: "纪录片",
          value: 404,
        },

        {
          name: "电影",
          value: 401,
        },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
};
