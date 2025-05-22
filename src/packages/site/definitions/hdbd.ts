/**
 * FIXME 无号，未进行测试
 * 由 resource/sites/pt.hdbd.us/config.json 自动转换而来
 */
import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "hdbd",
  name: "伊甸园",
  description: "这里是伊甸园 让我们赤裸坦诚相见",
  tags: ["综合", "XXX"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.hdbd.us/"],

  levelRequirements: [],
  category: [CategoryIncldead, CategorySpstate, CategoryInclbookmarked],
};
