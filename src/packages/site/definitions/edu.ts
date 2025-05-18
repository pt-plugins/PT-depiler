/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/resource.xidian.edu.cn/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "edu",
  name: "睿思",
  description: "西电睿思PT",
  tags: ["教育网", "影视", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["luy"],

  urls: ["http://resource.xidian.edu.cn/"],

  levelRequirements: [],
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
          name: "音乐",
          value: 408,
        },

        {
          name: "游戏",
          value: 410,
        },

        {
          name: "学习",
          value: 411,
        },

        {
          name: "软件",
          value: 412,
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
