/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/lemonhd.club/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "lemonhd",
  name: "LemonHD",
  description: "柠檬不酸",
  tags: ["综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["haowenwu"],

  urls: ["https://lemonhd.club/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P5W",
      downloaded: "200GB",
      ratio: 2.0,
      privilege:
        '可以查看NFO文档；可以请求续种；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P10W",
      downloaded: "500GB",
      ratio: 2.5,
      privilege: "同Power User",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "1TB",
      ratio: 3.0,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P20W",
      downloaded: "2TB",
      ratio: 3.5,
      privilege: "同Crazy User。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P25W",
      downloaded: "4TB",
      ratio: 4.0,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户封存账号后不会被删除。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P30W",
      downloaded: "6TB",
      ratio: 4.5,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P45W",
      downloaded: "8TB",
      ratio: 5.0,
      privilege:
        "Ultimate User及以上用户会永远保留账号，但不等于不会被封禁。此等级以上（含）免除站点定期进行的数据增量考核。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P65W",
      downloaded: "10TB",
      ratio: 5.5,
      privilege:
        "被视为站点精英成员，免除站点数据增量考核，永久保留账号；可以直接发布种子；可以查看排行榜；可以在网站开放邀请期间发送邀请，管理员设置的特殊情况除外；",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
