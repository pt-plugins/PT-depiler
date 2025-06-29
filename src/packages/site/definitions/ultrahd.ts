/**
 * FIXME 由 resource/sites/ultrahd.net/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "ultrahd",
  name: "UltraHD",
  description: "韩剧",
  tags: ["电影", "电视剧", "综艺", "纪录片", "动漫"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://ultrahd.net/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "Movies", value: 401 },
        { name: "TV Series", value: 402 },
        { name: "TV Shows", value: 403 },
        { name: "Documentaries", value: 404 },
        { name: "Animations", value: 405 },
        { name: "Music Video", value: 416 },
        { name: "Other", value: 417 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  levelRequirements: [
    {
      id: 1,
      name: " Power User",
      interval: "P5W",
      downloaded: "100GB",
      ratio: 3.0,
      seedingPoints: 100000,
      privilege:
        '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P10W",
      downloaded: "300GB",
      ratio: 3.5,
      seedingPoints: 200000,
      privilege: "Elite User及以上用户封存账号后不会被删除",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 4.0,
      seedingPoints: 400000,
      privilege: "可以在做种/下载/发布的时候选择匿名模式",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P20W",
      downloaded: "1TB",
      ratio: 4.5,
      seedingPoints: 600000,
      privilege: "可以查看普通日志",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P25W",
      downloaded: "2TB",
      ratio: 5.0,
      seedingPoints: 800000,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P30W",
      downloaded: "4TB",
      ratio: 5.5,
      seedingPoints: 1000000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。【可以开启特别区和查看特别区资源】。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P35W",
      downloaded: "6TB",
      ratio: 6.0,
      seedingPoints: 1200000,
      privilege: "得到一个邀请名额",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P40W",
      downloaded: "8TB",
      ratio: 6.5,
      seedingPoints: 1500000,
      privilege: "得到两个邀请名额",
    },
  ],
};
