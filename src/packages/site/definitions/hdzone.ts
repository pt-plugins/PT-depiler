import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "hdzone",
  name: "HDZone",
  tags: ["电影"],
  collaborator: ["ian"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://hdfun.me/"],
  legacyUrls: ["https://hdzone.me/"],

  favicon: "./_default_nexusphp.png",

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/c6cab130b19ae5fe9e962115bd21bc1364d93c72
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
      downloaded: "120GB",
      ratio: 2.0,
      privilege: "新晋等级用户，只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P5W",
      downloaded: "220GB",
      ratio: 2.5,
      privilege: "Elite User权限同上。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P10W",
      downloaded: "400GB",
      ratio: 3.0,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P10W",
      downloaded: "600GB",
      ratio: 3.5,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P10W",
      downloaded: "900GB",
      ratio: 4.0,
      privilege: "可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P10W",
      downloaded: "2TB",
      ratio: 4.5,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P10W",
      downloaded: "4TB",
      ratio: 5.0,
      privilege: "得到2个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P10W",
      downloaded: "8TB",
      ratio: 5.5,
      privilege: "得到3个邀请名额。账号永久保留。",
    },
  ],
};
