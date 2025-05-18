/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/t.tosky.club/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "tosky",
  name: "ToSky",
  description: "ToSky",
  tags: ["综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://t.tosky.club/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1,
      seedingPoints: 40000,
      privilege: "直接发布种子；查看NFO文档；删除自己上传的字幕。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "150GB",
      ratio: 1.5,
      seedingPoints: 80000,
      privilege: "首次升级至此等级的用户将获得1个邀请名额。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P13W",
      downloaded: "500GB",
      ratio: 2,
      seedingPoints: 150000,
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P23W",
      downloaded: "800GB",
      ratio: 2.5,
      seedingPoints: 250000,
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P35W",
      downloaded: "1.5TB",
      ratio: 3,
      seedingPoints: 400000,
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P50W",
      downloaded: "2.5TB",
      ratio: 3.5,
      seedingPoints: 600000,
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P65W",
      downloaded: "3.5TB",
      ratio: 4,
      seedingPoints: 800000,
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P80W",
      downloaded: "4.5TB",
      ratio: 5,
      seedingPoints: 1000000,
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
