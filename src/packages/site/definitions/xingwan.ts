import type { ISiteMetadata } from "../types";
import {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
  xiaomloveDefaultUserLevelRequirements,
} from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "xingwan",
  name: "星湾",
  description: "XingWan - 星湾 是一个专注优先中文字幕资源的站点，",
  tags: ["综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  favicon: "./_default_nexusphp.png",

  urls: ["https://xingwan.cc/"],

  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
