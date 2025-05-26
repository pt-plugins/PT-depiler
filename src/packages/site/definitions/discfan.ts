import type { ISiteMetadata } from "@ptd/site";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "discfan",
  name: "DiscFan",
  description: "碟粉",
  tags: ["影视", "综合"],
  collaborator: ["zxb0303"],

  type: "private",
  schema: "NexusPHP",

  urls: ["aHR0cHM6Ly9kaXNjZmFuLm5ldC8="],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 401, name: "电影 - 中国大陆" },
        { value: 404, name: "电影 - 中国香港特别行政区" },
        { value: 405, name: "电影 - 中国台湾省" },
        { value: 402, name: "电影 - 泰国" },
        { value: 403, name: "电影 - 日本" },
        { value: 406, name: "电影 - 韩国" },
        { value: 410, name: "电影 - 世界" },
        { value: 411, name: "剧集" },
        { value: 414, name: "音乐" },
        { value: 413, name: "纪录" },
        { value: 416, name: "综艺" },
        { value: 417, name: "体育" },
        { value: 419, name: "动漫" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "来源",
      key: "source",
      options: [
        { value: 1, name: "HDTV" },
        { value: 2, name: "4K UltraHD" },
        { value: 3, name: "Blu-ray Disc" },
        { value: 4, name: "DVD" },
        { value: 5, name: "SDTV" },
        { value: 6, name: "VCD" },
        { value: 7, name: "LD" },
        { value: 8, name: "VHS" },
        { value: 9, name: "Web-DL" },
        { value: 10, name: "Rip" },
        { value: 11, name: "Book" },
        { value: 131, name: "Remux" },
      ],
      cross: { mode: "append" },
    },
  ],

  levelRequirements: [
    {
      id: 1,
      name: "凡人",
      enName: "User",
      privilege: "新用户的默认级别，拥有下载权限。不能直接发布资源，但可添加候选区。可以上传字幕但不能删除自己上传的字幕。可在部分论坛板块发帖和留言。可以在求种区求种。可以更新外部信息如IMDb信息。"
    },
    {
      id: 2,
      name: "炼气",
      enName: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege: "首次升级获得1个永久邀请名额。可以直接发布种子资源。可以删除自己上传的字幕。允许使用个性条。可以请求续种。可以查看和搜索用户列表。可以查看NFO文件。可以查看排行榜。可以查看他人种子历史（未设为强隐私时）。"
    },
    {
      id: 3,
      name: "筑基",
      enName: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "首次升级获得2个永久邀请名额。允许在魔力值中心购买邀请。允许查看邀请。"
    },
    {
      id: 4,
      name: "结丹",
      enName: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 150000,
      privilege: "首次升级获得3个永久邀请名额。可以查看特别区种子。"
    },
    {
      id: 5,
      name: "元婴",
      enName: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 250000,
      privilege: "首次升级获得4个永久邀请名额。可以查看一般日志，不能查看机密日志。"
    },
    {
      id: 6,
      name: "化神",
      enName: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 400000,
      privilege: "首次升级获得6个永久邀请名额。可以查看他人的评论和帖子历史记录。"
    },
    {
      id: 7,
      name: "炼虚",
      enName: "Extreme User",
      interval: "P60W",
      downloaded: "1024GB",
      ratio: 3.55,
      seedingBonus: 600000,
      privilege: "首次升级获得8个永久邀请名额。"
    },
    {
      id: 8,
      name: "合体",
      enName: "Ultimate User",
      interval: "P80W",
      downloaded: "1536GB",
      ratio: 4.05,
      seedingBonus: 800000,
      privilege: "首次升级获得10个永久邀请名额。可以查看种子文件结构。"
    },
    {
      id: 9,
      name: "大乘",
      enName: "Nexus Master",
      interval: "P100W",
      downloaded: "3072GB",
      ratio: 4.55,
      seedingBonus: 1000000,
      privilege: "首次升级获得20个永久邀请名额。普通用户可以达到的最高级别。"
    },
  ],
};
