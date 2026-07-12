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
  id: "daxiangjiao",
  name: "DaXiangJiao",
  aka: ["大象蕉"],
  description: "DaXiangJiao 私有资源分享站",
  tags: ["影视", "综合", "成人"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://cg.qnkvnatwvnb.bet/"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "普通区", value: "/torrents.php" },
        { name: "特色区", value: "/special.php" },
      ],
    },
    {
      name: "分类（普通区）",
      key: "cat_normal",
      notes: "请先选择普通区入口。",
      options: [
        { value: 401, name: "电影" },
        { value: 402, name: "电视剧" },
        { value: 403, name: "综艺" },
        { value: 404, name: "纪录片" },
        { value: 405, name: "动漫" },
        { value: 406, name: "MV" },
        { value: 407, name: "体育" },
        { value: 408, name: "音乐" },
        { value: 409, name: "其他" },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "分类（特色区）",
      key: "cat_special",
      notes: "请先选择特色区入口。",
      options: [
        { value: 410, name: "日韩" },
        { value: 411, name: "国产" },
        { value: 412, name: "欧美" },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  searchEntry: {
    area_normal: { name: "普通区", requestConfig: { url: "/torrents.php" } },
    area_special: { name: "特色区", requestConfig: { url: "/special.php" }, enabled: false },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      levelName: {
        selector: [
          "td.rowhead:contains('等级') + td > img[title]",
          "td.rowhead:contains('等級') + td > img[title]",
          "td.rowhead:contains('Class') + td > img[title]",
        ],
        attr: "title",
      },
      bonusPerHour: {
        selector: ["table:has(td:contains('奖励类型')):has(td:contains('合计')) td[rowspan]"],
        filters: [{ name: "parseNumber" }],
      },
    },
    donorConfig: {
      ...SchemaMetadata.userInfo!.donorConfig,
      bonusPerHourMultiplier: 1,
    },
  },

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],
};
