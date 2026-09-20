/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/dabaojian.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "dabaojian",
  name: "大宝剑",
  aka: ["大保健"],
  description: "大宝剑是一个中文私有站点，提供电影/剧集/综艺/动漫/纪录片/短剧资源。",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.525968.xyz/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "Movies/电影", value: 401 },
        { name: "Music Videos/音乐视频", value: 406 },
        { name: "Sports/体育", value: 407 },
        { name: "Documentaries/纪录片", value: 404 },
        { name: "Animations/动漫", value: 405 },
        { name: "TV Series/连续剧", value: 402 },
        { name: "TV Shows/综艺", value: 403 },
        { name: "Short Play/短剧", value: 412 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
};
