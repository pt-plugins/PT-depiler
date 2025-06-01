import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "hdfans",
  name: "HDFans",
  aka: ["红豆饭"],
  description: "与志同道合之人前行 分享更多值得珍藏的资源",
  tags: ["综合", "影视"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["csi0n", "zhuweitung", "hui-shao"],

  urls: ["aHR0cHM6Ly9oZGZhbnMub3JnLw=="],

  levelRequirements: [
    {
      id: 1,
      name: "Peasant",
      privilege:
        "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能发表趣味盒内容；不能申请友情链接；不能上传字幕。",
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
      ratio: 1.0,
      seedingPoints: 50000,
      privilege: "得到一个邀请名额；可以直接发布种子； 可以删除自己上传的字幕。",
    },
    {
      id: 4,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.5,
      seedingPoints: 100000,
      privilege: "权限同 Power User。",
    },
    {
      id: 5,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "256GB",
      ratio: 2.0,
      seedingPoints: 250000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 6,
      name: "Insane User",
      interval: "P30W",
      downloaded: "512GB",
      ratio: 2.5,
      seedingPoints: 400000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 7,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "1TB",
      ratio: 3.0,
      seedingPoints: 600000,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 8,
      name: "Extreme User",
      interval: "P50W",
      downloaded: "2TB",
      ratio: 3.5,
      seedingPoints: 800000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。Extreme User及以上用户会永远保留账号。",
    },
    {
      id: 9,
      name: "Ultimate User",
      interval: "P60W",
      downloaded: "4TB",
      ratio: 4.0,
      seedingPoints: 1000000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 10,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "10TB",
      ratio: 5.0,
      seedingPoints: 1688888,
      privilege: "得到十个邀请名额。",
    },
    {
      id: 100,
      groupType: "vip",
      name: "贵宾(VIP)",
      privilege: "和Nexus Master拥有相同权限并被认为是精英成员。免除自动降级",
    },
    {
      id: 200,
      groupType: "manager",
      name: "养老族(Retiree)",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 201,
      groupType: "manager",
      name: "发布员(Uploader)",
      privilege: "专注的发布者。免除自动降级；可以查看匿名用户的真实身份。",
    },
    {
      id: 202,
      groupType: "manager",
      name: "总版主(Moderator)",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息。不能管理友情链接、最近消息、论坛版块；不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 203,
      groupType: "manager",
      name: "管理员(Administrator)",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 204,
      groupType: "manager",
      name: "维护开发员(Sysop)",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 205,
      groupType: "manager",
      name: "主管(Staff Leader)",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};
