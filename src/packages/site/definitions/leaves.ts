/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/leaves.red/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "leaves",
  name: "红叶",
  description:
    "红叶成立于2022年10月，主打有声小说，有综合区。目前站内设立有声官组,资源产出稳定。喜欢有声内容的朋友，欢迎你的加入",
  tags: ["有声书", "游戏", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["CosmoGao", "tedzhu"],

  urls: ["https://leaves.red/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "100GB",
      ratio: 1.05,
      seedingPoints: 60000,
      privilege: "首次升级PU将获得1个邀请 ",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "200GB",
      ratio: 1.55,
      seedingPoints: 120000,
      privilege: "Elite User及以上等级用户封存账号（在控制面板）后不会被禁用账号",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "400GB",
      ratio: 2.05,
      seedingPoints: 200000,
      privilege: "首次升级CU将分别2个邀请",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "800GB",
      ratio: 2.55,
      seedingPoints: 400000,
      privilege: " ",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "1600GB",
      ratio: 3.05,
      seedingPoints: 600000,
      privilege: "Veteran User及以上等级用户会永远保留；首次升级VU将获得3个邀请",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "2400GB",
      ratio: 3.55,
      seedingPoints: 800000,
      privilege: " ",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "3200GB",
      ratio: 4.05,
      seedingPoints: 1000000,
      privilege: "首次升级UU将获得5邀请",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "4000GB",
      ratio: 4.55,
      seedingPoints: 2000000,
      privilege: "首次升级NM将获得10个邀请",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
