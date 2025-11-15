import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "hdvideo",
  name: "HDVideo",

  collaborator: ["koal"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://hdvideo.top/"],

  formerHosts: ["hdvideo.one"],

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "128GB",
      ratio: 2.0,
      seedingBonus: 60480,
      privilege:
        '得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "256GB",
      ratio: 2.5,
      seedingBonus: 137088,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P12W",
      downloaded: "512GB",
      ratio: 3.0,
      seedingBonus: 262080,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P18W",
      downloaded: "1TB",
      ratio: 3.5,
      seedingBonus: 453600,
      privilege: "得到两个邀请名额；可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P24W",
      downloaded: "2TB",
      ratio: 4.0,
      seedingBonus: 604800,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P32W",
      downloaded: "4TB",
      ratio: 4.5,
      seedingBonus: 806400,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P40W",
      downloaded: "6TB",
      ratio: 5.0,
      seedingBonus: 1008000,
      privilege: "得到三个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P52W",
      downloaded: "8TB",
      ratio: 5.5,
      seedingBonus: 1310400,
      privilege: "得到五个邀请名额。",
    },
  ],
};
