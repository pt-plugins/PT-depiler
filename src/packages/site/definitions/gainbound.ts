import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "gainbound",
  name: "丐帮",
  description: "降龙掌青竹杖 美酒佳肴来作伴",
  tags: ["高清", "电影", "纪录片"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://gainbound.net/"],

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/43a47b75a1a24523e9788a7ffca83a5407dfa5d6
  isDead: true,

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P5W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege:
        '得到3个邀请名额；可以查看邀请区；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P10W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "得到1个邀请名额，三袋弟子及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 150000,
      privilege: "得到2个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 250000,
      privilege: "得到1个邀请名额，可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 400000,
      privilege: "得到3个邀请名额；可以查看其它用户的评论、帖子历史。六袋长老及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingBonus: 600000,
      privilege: "得到1个邀请名额，可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingBonus: 800000,
      privilege: "得到3个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingBonus: 1000000,
      privilege: "得到5个邀请名额。",
    },
  ],
};
