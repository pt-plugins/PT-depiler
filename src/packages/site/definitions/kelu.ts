import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "kelu",
  name: "Kelu",
  tags: ["成人"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["haowenwu"],

  urls: ["uggcf://bhe.xryh.bar/"],

  levelRequirements: [
    {
      id: 1,
      name: "魔法助手",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingPoints: 10000,
      privilege: "首次升级至此等级的用户将获得1个邀请名额",
    },
    {
      id: 2,
      name: "准魔法师",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingPoints: 80000,
    },
    {
      id: 3,
      name: "魔法师",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 1.95,
      seedingPoints: 150000,
      privilege: "首次升级至此等级的用户将获得2个邀请名额",
    },
    {
      id: 4,
      name: "大魔法师",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingPoints: 250000,
    },
    {
      id: 5,
      name: "圣域魔导师",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingPoints: 800000,
      privilege: "首次升级至此等级的用户将获得5个邀请名额",
    },
    {
      id: 6,
      name: "神域魔导师",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingPoints: 1000000,
      privilege: "首次升级至此等级的用户将获得10个邀请名额",
    },
  ],
};
