/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/piggo.me/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "pig",
  name: "Pig",
  description: "Pig",
  tags: ["综合", "3D原盘", "儿童区"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["koal"],

  urls: ["https://piggo.me/"],

  levelRequirements: [
    {
      id: 1,
      name: "猪仔(Power User)",
      interval: "P4W",
      downloaded: "100GB",
      ratio: 2.0,
      seedingPoints: 40000,
      privilege:
        '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以删除自己上传的字幕',
    },
    {
      id: 2,
      name: "香猪(Elite User)",
      interval: "P8W",
      downloaded: "300GB",
      ratio: 2.5,
      seedingPoints: 80000,
      privilege: "香猪(Elite User)及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "野猪(Crazy User)",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 3.0,
      seedingPoints: 150000,
      privilege: "得到一个永久邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "猪王(Insane User)",
      interval: "P25W",
      downloaded: "1TB",
      ratio: 3.5,
      seedingPoints: 250000,
      privilege: "可以查看普通日志",
    },
    {
      id: 5,
      name: "猪妖(Veteran User)",
      interval: "P40W",
      downloaded: "2TB",
      ratio: 4,
      seedingPoints: 400000,
      privilege: "得到两个永久邀请名额；可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 6,
      name: "二师兄(Extreme User)",
      interval: "P60W",
      downloaded: "3TB",
      ratio: 4.5,
      seedingPoints: 600000,
      privilege: "可以更新过期的外部信息；可以查看二师兄(Extreme User)论坛。",
    },
    {
      id: 7,
      name: "净坛使者(Ultimate User)",
      interval: "P80W",
      downloaded: "4TB",
      ratio: 5.0,
      seedingPoints: 800000,
      privilege: "得到三个邀请名额。",
    },
    {
      id: 8,
      name: "天蓬元帅(Nexus Master)",
      interval: "P100W",
      downloaded: "6TB",
      ratio: 6.0,
      seedingPoints: 1000000,
      privilege: "得到五个邀请名额。天蓬元帅(Nexus Master)及以上用户会永远保留账号",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
