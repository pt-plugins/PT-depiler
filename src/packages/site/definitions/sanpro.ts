import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "sanpro",
  name: "伞",
  description: "欢迎来到伞",
  tags: ["综合", "影视"],

  type: "private",
  schema: "Gazelle",

  urls: ["uggcf://fnaceb.cj/"],

  isDead: true,

  levelRequirements: [
    {
      id: 1,
      name: "伞之流韵",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "伞之华章",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "伞之天工",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 150000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "伞之永恒",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "伞之幻境",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 400000,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "伞之星辰",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "伞之诗心",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingBonus: 800000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "伞之创世",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingBonus: 1000000,
      privilege: "得到十个邀请名额。",
    },
  ],
};
