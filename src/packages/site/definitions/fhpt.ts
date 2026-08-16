import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "fhpt",
  name: "凤凰PT",
  aka: ["FengHuang PT", "521best"],
  description: "个人站，定位小体积压制、WEB-DL 电影资源，全站 Free",
  tags: ["影视", "电影", "压制"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.521.best/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影", value: 401 },
        { name: "电视剧集", value: 402 },
        { name: "书籍", value: 403 },
        { name: "动漫", value: 404 },
        { name: "游戏", value: 405 },
        { name: "音乐", value: 406 },
        { name: "本子", value: 407 },
        { name: "成人", value: 408 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Blu-ray", value: 1 },
        { name: "Remux", value: 3 },
        { name: "WEB-DL", value: 4 },
        { name: "HDTV", value: 5 },
        { name: "DVDR", value: 6 },
        { name: "Encode", value: 7 },
        { name: "CD", value: 8 },
        { name: "Other", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264", value: 1 },
        { name: "VC-1", value: 2 },
        { name: "Xvid", value: 3 },
        { name: "MPEG-2", value: 4 },
        { name: "Other", value: 5 },
        { name: "H.265", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "1080p", value: 1 },
        { name: "1080i", value: 2 },
        { name: "720p", value: 3 },
        { name: "SD", value: 4 },
        { name: "2160p", value: 5 },
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
      name: "Peasant",
      privilege:
        "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能发表趣味盒内容；不能申请友情链接；不能上传字幕。" +
        "当以下情况时将被自动降至本级：1.如果你已经下载了超过50GB，你应该有大于0.4的分享率。2.如果你已经下载了超过100GB，你应该有大于0.5的分享率。" +
        "3.如果你已经下载了超过200GB，你应该有大于0.6的分享率。4.如果你已经下载了超过400GB，你应该有大于0.7的分享率。5.如果你已经下载了超过800GB，你应该有大于0.8的分享率。",
    },
    {
      id: 2,
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；" +
        '可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。' +
        "当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于0.95，你将自动降级。",
    },
    {
      id: 4,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege:
        "Elite User及以上用户封存账号后不会被删除。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于1.45，你将自动降级。",
    },
    {
      id: 5,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege:
        "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于1.95，你将自动降级。",
    },
    {
      id: 6,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于2.45，你将自动降级。",
    },
    {
      id: 7,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      isKept: true,
      privilege:
        "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。" +
        "当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于2.95，你将自动降级。",
    },
    {
      id: 8,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      isKept: true,
      privilege:
        "可以更新过期的外部信息；可以查看Extreme User论坛。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于3.45，你将自动降级。",
    },
    {
      id: 9,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      isKept: true,
      privilege: "得到五个邀请名额。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于3.95，你将自动降级。",
    },
    {
      id: 10,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      isKept: true,
      privilege: "得到十个邀请名额。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于4.45，你将自动降级。",
    },
    {
      id: 100,
      groupType: "vip",
      name: "贵宾(VIP)",
      privilege: "和Nexus Master拥有相同权限并被认为是精英成员。免除自动降级。",
    },
  ],
};
