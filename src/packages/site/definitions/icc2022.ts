/**
 * 由 resource/sites/www.icc2022.com/config.json 自动转换而来
 */
import { type ISiteMetadata } from "../types";
// import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";
import { xiaomloveDefaultUserLevelRequirements } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  // ...SchemaMetadata,
  version: 1,

  id: "icc2022",
  name: "ICC",
  description: "冰淇淋",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://www.icc2022.com/"],

  isDead: true,

  /*
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "音轨", value: 408 },
        { name: "其它", value: 409 },
        { name: "体育", value: 407 },
        { name: "MV", value: 406 },
        { name: "综艺", value: 403 },
        { name: "电视剧", value: 402 },
        { name: "动漫", value: 405 },
        { name: "纪录片", value: 404 },
        { name: "电影", value: 401 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
   */

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
