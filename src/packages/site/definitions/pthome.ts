/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/pthome.net/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "pthome",
  name: "PTHome",
  description: "只为成为您的家，快乐下载，分享至美！",
  tags: ["综合", "影视", "游戏"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["waldens", "cnsunyour"],

  urls: ["https://pthome.net/"],

  levelRequirements: [
    {
      id: 1,
      name: "钢铁(Power User)",
      interval: "P4W",
      downloaded: "200GB",
      ratio: 1.0,
      seedingPoints: 20000,
      privilege:
        '可以查看NFO文档；可以查看用户列表；可以请求续种； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。可以浏览论坛邀请专版。',
    },
    {
      id: 2,
      name: "铝锭(Elite User)",
      interval: "P8W",
      downloaded: "350GB",
      ratio: 1.1,
      seedingPoints: 50000,
      privilege: "Elite User及以上用户封存账号后不会被删除",
    },
    {
      id: 3,
      name: "锌锭(Crazy User)",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 1.2,
      seedingPoints: 200000,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "紫铜(Insane User)",
      interval: "P25W",
      downloaded: "1TB",
      ratio: 1.3,
      seedingPoints: 400000,
      privilege: "可以查看普通日志",
    },
    {
      id: 5,
      name: "白锡(Veteran User)",
      interval: "P40W",
      downloaded: "2TB",
      ratio: 1.5,
      seedingPoints: 600000,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "白银(Extreme User)",
      interval: "P60W",
      downloaded: "3TB",
      ratio: 1.5,
      seedingPoints: 800000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "黄金(Ultimate User)",
      interval: "P80W",
      downloaded: "4TB",
      ratio: 1.7,
      seedingPoints: 1000000,
      privilege: "同白银用户等级权限",
    },
    {
      id: 8,
      name: "铂金(Nexus Master)",
      interval: "P100W",
      downloaded: "6TB",
      ratio: 1.8,
      seedingPoints: 1200000,
      privilege: "同白银用户等级权限",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
