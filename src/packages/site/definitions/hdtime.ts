import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hdtime",
  name: "HDTime",
  description: "HDTime, time to forever!",
  tags: ["影视", "综合"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://hdtime.org/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 401, name: "电影" },
        { value: 424, name: "Blu-Ray原盘" },
        { value: 402, name: "剧集" },
        { value: 403, name: "综艺" },
        { value: 405, name: "动漫" },
        { value: 414, name: "软件" },
        { value: 407, name: "体育" },
        { value: 404, name: "纪录片" },
        { value: 406, name: "MV" },
        { value: 408, name: "音乐" },
        { value: 410, name: "游戏" },
        { value: 411, name: "文档" },
        { value: 409, name: "其他" },
      ],
      cross: { mode: "append" },
    },
  ],

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: `新用户的默认级别。`,
    },
    {
      id: 2,
      name: "感冒(Power User)",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请；" +
        ' 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 3,
      name: "发热(Elite User)",
      interval: "P8W",
      downloaded: "150GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 4,
      name: "低烧(Crazy User)",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 2.05,
      seedingBonus: 150000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 5,
      name: "中烧(Insane User)",
      interval: "P25W",
      downloaded: "750GB",
      ratio: 2.55,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 6,
      name: "高烧(Veteran User)",
      interval: "P40W",
      downloaded: "1.5TB",
      ratio: 3.05,
      seedingBonus: 400000,
      privilege:
        "免除增量考核；得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "烧糊涂(Extreme User)",
      interval: "P60W",
      downloaded: "3TB",
      ratio: 3.55,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 8,
      name: "走火入魔(Ultimate User)",
      interval: "P80W",
      downloaded: "5TB",
      ratio: 4.05,
      seedingBonus: 800000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 9,
      name: "骨灰(HDtime Master)",
      interval: "P100W",
      downloaded: "10TB",
      ratio: 4.55,
      seedingBonus: 1000000,
      privilege: "得到十个邀请名额。",
    },
  ],
};
