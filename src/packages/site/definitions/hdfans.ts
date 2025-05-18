/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/hdfans.org/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "hdfans",
  name: "HDFans",
  description: "与志同道合之人前行 分享更多值得珍藏的资源",
  tags: ["综合", "电影", "电视剧", "纪录片"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["csi0n", "zhuweitung"],

  urls: ["https://hdfans.org/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.0,
      seedingPoints: 50000,
      privilege: "得到一个邀请名额；可以直接发布种子； 可以删除自己上传的字幕。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.5,
      seedingPoints: 100000,
      privilege: "权限同上。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "256GB",
      ratio: 2.0,
      seedingPoints: 250000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P30W",
      downloaded: "512GB",
      ratio: 2.5,
      seedingPoints: 400000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "1024GB",
      ratio: 3.0,
      seedingPoints: 600000,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P50W",
      downloaded: "2048GB",
      ratio: 3.5,
      seedingPoints: 800000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。Extreme User及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P60W",
      downloaded: "4096GB",
      ratio: 4.0,
      seedingPoints: 1000000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "10240GB",
      ratio: 5,
      seedingPoints: 1688888,
      privilege: "得到十个邀请名额。",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
