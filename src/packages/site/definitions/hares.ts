import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "hares",
  name: "HaresClub",
  aka: ["白兔", "白兔俱乐部"],
  description: "2160p/4k 及以上的高清资源站点",
  tags: ["影视", "纪录片", "综合"],
  collaborator: ["kevgao", "枕头啊枕头", "bright", "yuanyiwei"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://pyho.unerf.gbc/"],

  // refs: https://github.com/pt-plugins/PT-Plugin-Plus/commit/4371f6ebecf2743acb3817303fdcc36cf5b0118e
  isDead: true,

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "100GB",
      ratio: 2,
      seedingBonus: 20000,
      privilege: "可以在邀请区回复；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以查看排行榜",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "350GB",
      ratio: 2.5,
      seedingBonus: 50000,
      privilege: '可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕',
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P16W",
      downloaded: "500GB",
      ratio: 3,
      seedingBonus: 200000,
      privilege: "可以直接发布种子；可以发送邀请；可以在做种/下载/发布的时候选择匿名模式",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P20W",
      downloaded: "1TB",
      ratio: 3.5,
      seedingBonus: 400000,
      privilege: "得到两个邀请名额；可以查看普通日志",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P25W",
      downloaded: "2TB",
      ratio: 4,
      seedingBonus: 600000,
      privilege: "得到四个邀请名额；可以查看其它用户的评论、帖子历史",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P30W",
      downloaded: "4TB",
      ratio: 4.5,
      seedingBonus: 800000,
      privilege:
        "得到六个邀请名额；可以更新过期的外部信息；可以查看Extreme User论坛。Extreme User用户封存后将永远保留账号",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P40W",
      downloaded: "6TB",
      ratio: 5,
      seedingBonus: 1000000,
      privilege: "得到八个邀请名额",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P52W",
      downloaded: "8TB",
      ratio: 5.5,
      seedingBonus: 1200000,
      privilege: "得到十个邀请名额。Nexus Master用户会永远保留账号",
    },
  ],
};
