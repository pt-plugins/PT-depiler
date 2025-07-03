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

  urls: ["uggcf://frjrecg.pbz/"],

  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],

  levelRequirements: [
    {
      id: 1,
      name: "大工",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingPoints: 40000,
      privilege: "无",
    },
    {
      id: 2,
      name: "技工",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingPoints: 80000,
      privilege: "无",
    },
    {
      id: 3,
      name: "安全员",
      interval: "P16W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingPoints: 150000,
      privilege: "无",
    },
    {
      id: 4,
      name: "技术员",
      interval: "P28W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingPoints: 250000,
      privilege: "无",
    },
    {
      id: 5,
      name: "工长",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 2.95,
      seedingPoints: 400000,
      privilege: "无",
    },
    {
      id: 6,
      name: "包工头",
      interval: "P60W",
      downloaded: "1024GB",
      ratio: 3.55,
      seedingPoints: 600000,
      privilege: "无",
    },
    {
      id: 7,
      name: "工程师",
      interval: "P80W",
      downloaded: "1536GB",
      ratio: 4.05,
      seedingPoints: 900000,
      privilege: "无",
    },
    {
      id: 8,
      name: "老板",
      interval: "P100W",
      downloaded: "3072GB",
      ratio: 4.55,
      seedingPoints: 1500000,
      privilege: "无",
    },
  ],
};
