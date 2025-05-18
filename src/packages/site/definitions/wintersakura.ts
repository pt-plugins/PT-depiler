/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/wintersakura.net/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "wintersakura",
  name: "wintersakura",
  description: "wintersakura",
  tags: [],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://wintersakura.net/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "PundefinedW",
      downloaded: "50GB",
      ratio: 1,
      seedingPoints: 50000,
      privilege:
        "可以查看NFO文档；可以请求续种； 可以购买/发送邀请；可以删除自己上传的字幕。可以申请友情链接；可以使用个性条。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "PundefinedW",
      downloaded: "400GB",
      ratio: 1.5,
      seedingPoints: 120000,
      privilege: "可以查看种子结构；可以更新外部信息",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "PundefinedW",
      downloaded: "800GB",
      ratio: 2,
      seedingPoints: 200000,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "PundefinedW",
      downloaded: "1.5TB",
      ratio: 3,
      seedingPoints: 500000,
      privilege: "可以查看排行榜。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "PundefinedW",
      downloaded: "3TB",
      ratio: 4,
      seedingPoints: 800000,
      privilege: "可以查看其它用户种子历史。（只有用户的隐私等级没有设为’强‘时才生效）",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "PundefinedW",
      downloaded: "5TB",
      ratio: 6,
      seedingPoints: 1400000,
      privilege: "可以更新过期的外部信息。Extreme User 及以上用户封存账号后不会被删除",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "PundefinedW",
      downloaded: "6TB",
      ratio: 8,
      seedingPoints: 2000000,
      privilege: "首次到达此等级得到1个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "PundefinedW",
      downloaded: "10TB",
      ratio: 9.5,
      seedingPoints: 2800000,
      privilege: "首次到达此等级得到1个邀请名额Nexus Master及以上用户会永远保留账号。",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
