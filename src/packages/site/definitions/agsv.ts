/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/www.agsvpt.com/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "agsv",
  name: "AGSV",
  description: "The Ultimate File Sharing Experience",
  tags: ["综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["Exception"],

  urls: ["https://www.agsvpt.com/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P0W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingPoints: 40000,
      privilege: "可以在银行贷款",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingPoints: 80000,
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P12W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingPoints: 150000,
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P20W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingPoints: 400000,
      privilege: "查看普通日志",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P28W",
      downloaded: "750GB",
      ratio: 4.05,
      seedingPoints: 800000,
      privilege: "永远保留账号；查看其它用户的评论、帖子历史",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P40W",
      downloaded: "1TB",
      ratio: 5.05,
      seedingPoints: 1200000,
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P52W",
      downloaded: "1.5TB",
      ratio: 6.05,
      seedingPoints: 2000000,
      privilege: "首次升级至此等级的用户将获得2个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P70W",
      downloaded: "3TB",
      ratio: 7.05,
      seedingPoints: 3000000,
      privilege: "首次升级至此等级的用户将获得2个邀请名额。",
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
          name: "动画",
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
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
};
