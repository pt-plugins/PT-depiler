/**
 * FIXME 由 resource/sites/sewerpt.com/config.json 自动转换而来
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "sewerpt",
  name: "下水道",
  description: "再小众的热爱，也值得被世界看见",
  tags: ["冷门", "低分", "粤语", "影视"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["sewerpt"],

  urls: ["https://sewerpt.com/"],

  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],

  levelRequirements: [
    {
      id: 0,
      name: "User", // FIXME
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。 ",
    },
    {
      id: 1,
      name: "大工",
      nameAka: ["Power User"],
      interval: "P4W",
      downloaded: "50GB",
      seedingBonus: 40000,
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； " +
        '可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。' +
        "当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于0.95，你将自动降级。",
    },
    {
      id: 2,
      name: "技工",
      nameAka: ["Elite User"],
      interval: "P8W",
      downloaded: "120GB",
      seedingBonus: 80000,
      ratio: 1.55,
      privilege:
        "Elite User及以上用户封存账号后不会被删除。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于1.45，你将自动降级。",
    },
    {
      id: 3,
      name: "安全员",
      nameAka: ["Crazy User"],
      interval: "P15W",
      downloaded: "300GB",
      seedingBonus: 150000,
      ratio: 2.05,
      privilege:
        "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于1.95，你将自动降级。",
    },
    {
      id: 4,
      name: "技术员",
      nameAka: ["Insane User"],
      interval: "P25W",
      downloaded: "500GB",
      seedingBonus: 250000,
      ratio: 2.55,
      privilege: "可以查看普通日志。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于2.45，你将自动降级。",
    },
    {
      id: 5,
      name: "工长",
      nameAka: ["Veteran User"],
      interval: "P40W",
      downloaded: "750GB",
      seedingBonus: 400000,
      ratio: 3.05,
      isKept: true,
      privilege:
        "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于2.95，你将自动降级。",
    },
    {
      id: 6,
      name: "包工头",
      nameAka: ["Extreme User"],
      interval: "P60W",
      downloaded: "1TB",
      seedingBonus: 600000,
      ratio: 3.55,
      isKept: true,
      privilege:
        "可以更新过期的外部信息；可以查看Extreme User论坛。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于3.45，你将自动降级。",
    },
    {
      id: 7,
      name: "工程师",
      nameAka: ["Ultimate User"],
      interval: "P80W",
      downloaded: "1.5TB",
      seedingBonus: 900000,
      ratio: 4.05,
      isKept: true,
      privilege: "得到五个邀请名额。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于3.95，你将自动降级。",
    },
    {
      id: 8,
      name: "老板",
      nameAka: ["Nexus Master"],
      interval: "P100W",
      downloaded: "3TB",
      seedingBonus: 1500000,
      ratio: 4.55,
      isKept: true,
      privilege: "得到十个邀请名额。当条件符合时将被自动提升。注意，无论何时，如果你的分享率低于4.45，你将自动降级。",
    },
  ],
};
