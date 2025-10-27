import { type ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "hdchina",

  name: "HDChina",
  aka: ["瓷器"],
  description: "高清影音人士分享乐园",
  tags: ["影视", "音乐", "纪录片", "综合"],
  timezoneOffset: "+0800",
  collaborator: ["IITII"],
  favicon: "./hdchina.jpg",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://hdchina.org/"],

  isDead: true,

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P5W",
      downloaded: "200GB",
      ratio: 1.5,
      privilege: "可以使用道具，可以打开签名和个性化称号",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P10W",
      downloaded: "500GB",
      ratio: 2.0,
      privilege: "可以在候选区投票，可以在论坛建议区发帖，可以上传字幕，可以删除自己上传的字幕。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "1TB",
      ratio: 2.5,
      privilege: "可以进入邀请区。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P20W",
      downloaded: "1.5TB",
      ratio: 3.0,
      privilege: "并可以直接发布种子，无需候选。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P25W",
      downloaded: "2TB",
      ratio: 4.0,
      privilege: "可以在个人资料内隐藏个人信息，可以匿名做种。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P30W",
      downloaded: "3TB",
      ratio: 5.0,
      privilege: "发送邀请，可以查看其它会员种子历史，可以更新IMDb信息。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P40W",
      downloaded: "4TB",
      ratio: 6.0,
      privilege: "账号挂起永久保留。取消一个月只能发送一个邀请的限制。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P50W",
      downloaded: "5TB",
      ratio: 8.0,
      privilege: "账号永久保存(无需挂起)",
    },
  ],
};
