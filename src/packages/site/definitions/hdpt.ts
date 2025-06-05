/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/hdpt.xyz/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "hdpt",
  name: "明教",
  description: "综合性的PT论坛    欢迎您的加入！",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["koal", "zhuweitung"],

  urls: ["https://hdpt.xyz/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "200GB",
      ratio: 2,
      seedingPoints: 50000,
      privilege: "得到一个邀请名额；可以直接发布种子；可以请求续种； 可以发送邀请。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "400GB",
      ratio: 3,
      seedingPoints: 110000,
      privilege: "得到一个邀请名额。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "700GB",
      ratio: 4,
      seedingPoints: 200000,
      privilege: "得到二个邀请名额。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "1TB",
      ratio: 5,
      seedingPoints: 300000,
      privilege: "得到二个邀请名额；",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "2TB",
      ratio: 6,
      seedingPoints: 500000,
      privilege:
        "得到二个邀请名额。神蛇 (Veteran User)及以上等级的账号如果在封存后将保留，封存的账号如果连续400天不登录，将被封禁；未封存的账号如果连续90天不登录，将被封禁；没有流量的用户（即上传/下载数据都为0）如果连续90天不登录，将被封禁账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "3TB",
      ratio: 7,
      seedingPoints: 700000,
      privilege:
        "得到二个邀请名额；可以更新过期的外部信息；可以查看Extreme User论坛。紫微 (Extreme User)及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "4TB",
      ratio: 8,
      seedingPoints: 1000000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "8TB",
      ratio: 9,
      seedingPoints: 1500000,
      privilege: "得到七个邀请名额。",
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
          name: "纪录片",
          value: 404,
        },

        {
          name: "动漫",
          value: 405,
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
          name: "MV",
          value: 406,
        },

        {
          name: "体育",
          value: 407,
        },

        {
          name: "其他",
          value: 409,
        },

        {
          name: "音乐",
          value: 408,
        },

        {
          name: "软件",
          value: 410,
        },

        {
          name: "电子书",
          value: 411,
        },

        {
          name: "卡通",
          value: 412,
        },

        {
          name: "学习资料",
          value: 413,
        },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
};
