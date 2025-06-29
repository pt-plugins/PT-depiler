/**
 * FIXME 由 resource/sites/www.ptlover.cc/config.json 自动转换而来
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "afun",
  name: "Afun",
  description: "希望都能找到各自的兴趣、爱好、欢喜",
  tags: ["综合", "电影", "电视剧", "纪录片"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["geni"],

  urls: ["uggcf://jjj.cgybire.pp/"],

  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingPoints: 40000,
      privilege: "无",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingPoints: 80000,
      privilege: "无",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingPoints: 150000,
      privilege: "无",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingPoints: 250000,
      privilege: "无",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingPoints: 400000,
      privilege: "无",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1024GB",
      ratio: 3.55,
      seedingPoints: 600000,
      privilege: "无",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1536GB",
      ratio: 4.05,
      seedingPoints: 1800000,
      privilege: "无",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3072GB",
      ratio: 4.55,
      seedingPoints: 1000000,
      privilege: "无",
    },
  ],
};
