import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "xingyunge",
  name: "星陨阁",
  description: "三十年河东，三十年河西！莫欺少年穷！",
  tags: ["综合", "影视", "国漫"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.xingyungept.org/", "https://xingyunge.top/"],

  levelRequirements: [
    {
      id: 1,
      name: "大斗师(Power User)",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "斗灵(Elite User)",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "斗王(Crazy User)",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 150000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "斗皇(Insane User)",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "斗宗(Veteran User)",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 400000,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "斗尊(Extreme User)",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "斗圣(Ultimate User)",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingBonus: 800000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "斗帝(Nexus Master)",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingBonus: 1000000,
      privilege: "得到十个邀请名额。",
    },
  ],
};
