import type { ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "ptneko",
  name: "超科学PT喵",
  description: "这里什么也没有",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://ptneko.com/"],

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
      ratio: 1.05,
      privilege:
        "查看、搜索用户列表,查看一般日志，不能查看机密日志,查看其他用户的种子历史记录,在发布种子、上传字幕时选择匿名[仅限里番分类]",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "查看其他用户的评论和帖子历史记录",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "网站一般用户最高等级",
    },
  ],
};
