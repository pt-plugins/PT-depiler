/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/xingwan.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/xingwan.json
 */
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
  description: "XingWan - 星湾 是一个专注中文字幕资源的站点。",
  tags: ["综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  favicon: "./_default_nexusphp.png",

  urls: ["https://xingwan.cc/"],

  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
