import { type ISiteMetadata } from "../types";
import {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  defaultUserLevelRequirements,
  SchemaMetadata,
} from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "sbpt",
  name: "SBPT",
  description: "SBPT is a CHINESE Private Torrent Tracker for MOVIES / TV / GENERAL",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",
  favicon: "./_default_nexusphp.png",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://sbpt.link/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影(Movies)", value: 401 },
        { name: "音乐(HQ Audio)", value: 408 },
        { name: "其他(Misc)", value: 409 },
        { name: "体育(Sport)", value: 407 },
        { name: "音乐短片(MV)Music Video", value: 406 },
        { name: "综艺(TV Shows)", value: 403 },
        { name: "电视剧(TVSeries)", value: 402 },
        { name: "动画(Animation)", value: 405 },
        { name: "纪录片(Documentary)", value: 404 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  levelRequirements: [...defaultUserLevelRequirements],
};
