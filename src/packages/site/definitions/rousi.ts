/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/rousi.zip/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "rousi",
  name: "Rousi",
  description: "你也喜欢Rousi对吧？",
  tags: ["影视", "综合", "9KG"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["yum"],

  urls: ["https://rousi.zip/"],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingPoints: 40000,
      privilege: " 得到0个邀请名额。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingPoints: 80000,
      privilege: "首次升级至此等级的用户将获得1个邀请名额，封存后永久保留。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "1024GB",
      ratio: 2.05,
      seedingPoints: 1000000,
      privilege: "首次升级至此等级的用户将获得2个邀请名额。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "2045GB",
      ratio: 2.55,
      seedingPoints: 2000000,
      privilege: "首次升级至此等级的用户将获得5个邀请名额；免封存账号永久保留。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "5120GB",
      ratio: 3.05,
      seedingPoints: 3000000,
      privilege: "首次升级至此等级的用户将获得10个邀请名额。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "10TB",
      ratio: 3.55,
      seedingPoints: 5000000,
      privilege: "首次升级至此等级的用户将获得10个邀请名额。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "20TB",
      ratio: 4.05,
      seedingPoints: 8000000,
      privilege: "首次升级至此等级的用户将获得10个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "30TB",
      ratio: 4.55,
      seedingPoints: 10000000,
      privilege: "首次升级至此等级的用户将获得10个邀请名额。",
    },
  ],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
