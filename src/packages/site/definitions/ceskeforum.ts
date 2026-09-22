/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/ceskeforum.yml
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/ceskeforum.json
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "ceskeforum",
  name: "CeskeForum",
  description: "CeskeForum 是一个捷克私有站点，提供电影/剧集/音乐/软件/游戏/书籍资源。",
  tags: ["影视", "音乐", "综合"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://t.ceskeforum.com/"],

  // 注：以 Jackett ceskeforum.yml 的分类为准；PDS 提供的 1-10 分类与本站实际（401 起的 NexusPHP 标准）不符
  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { name: "Filmy (Movies)", value: 401 },
        { name: "TV pořady (TV Shows)", value: 403 },
        { name: "TV dokumenty (Documentaries)", value: 404 },
        { name: "TV seriály - kompletní série", value: 408 },
        { name: "TV seriály - jednotlivé díly", value: 402 },
        { name: "Sport", value: 407 },
        { name: "Knihy (Books)", value: 411 },
        { name: "Knihy ve zvukové podobě (AudioBooks)", value: 413 },
        { name: "Hudba (Music)", value: 406 },
        { name: "Software", value: 410 },
        { name: "Software - Hry (Games)", value: 412 },
        { name: "Nezařazené (Misc)", value: 409 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      rows: { selector: "table.torrents > tbody > tr:has(table.torrentname)" },
    },
  },
};
