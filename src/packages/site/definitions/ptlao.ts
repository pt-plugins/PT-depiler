import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "ptlao",
  name: "PTLAO",
  tags: ["成人", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["haowenwu"],

  urls: ["uggcf://cgynb.gbc/"],

  levelRequirements: [
    {
      id: 1,
      name: "幼儿园",
      privilege: "只能在每周六中午12点至每周日晚上11点59分发布种子",
    },
    {
      id: 2,
      name: "小学",
      interval: "P4D",
      downloaded: "5GB",
      ratio: 0.1,
      seedingBonus: 300,
      privilege:
        "得到一个邀请名额 可以直接发布种子 可以查看NFO文档 可以查看用户列表 可以请求续种  可以发送邀请  可以查看排行榜 可以查看其它用户的种子历史(如果用户隐私等级未设置为强) 可以删除自己上传的字幕",
    },
    {
      id: 3,
      name: "初中",
      interval: "P4W",
      downloaded: "120GB",
      ratio: 1.25,
      seedingBonus: 80000,
      privilege: "封存账号后不会被删除",
    },
    {
      id: 4,
      name: "高中",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到两个邀请名额 可以在做种/下载/发布的时候选择匿名模式",
    },
    {
      id: 5,
      name: "大专",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "可以查看普通日志",
    },
    {
      id: 6,
      name: "本科",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "得到三个邀请名额 可以查看其它用户的评论、帖子历史 永远保留账号",
    },
    {
      id: 7,
      name: "研究生",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息",
    },
    {
      id: 8,
      name: "博士",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      privilege: "得到五个邀请名额",
    },
    {
      id: 9,
      name: "博士后",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "得到十个邀请名额",
    },
  ],
};
