import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "htpt",
  name: "海棠PT",
  aka: ["海棠曲艺园", "海棠"],
  description: "主打曲艺、戏曲、相声、评书、小品、广播剧、有声小说等中国传统有声资源",
  tags: ["曲艺", "小品", "有声小说"],
  timezoneOffset: "+0800",

  collaborator: ["zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://jjj.ugcg.pp/"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "相声", value: 1 },
        { name: "评书", value: 4091 },
        { name: "戏曲", value: 4097 },
        { name: "鼓/琴", value: 4098 },
        { name: "小曲", value: 4099 },
        { name: "小品", value: 4101 },
        { name: "二人转", value: 4104 },
        { name: "小剧种", value: 4105 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264/AVC/x264", value: 1 },
        { name: "H.265/HEVC/X.265", value: 10 },
        { name: "MP3/音频/M4A", value: 11 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "4K", value: 1 },
        { name: "1080p", value: 2 },
        { name: "720p", value: 3 },
        { name: "SD/标清", value: 5 },
      ],
      cross: { mode: "append" },
    },
    { name: "制作组", key: "team", options: [{ name: "HTPT", value: 1 }], cross: { mode: "append" } },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search!,
    advanceKeywordParams: {
      imdb: false,
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    process: [
      ...SchemaMetadata.userInfo!.process!.filter((item) => item.requestConfig.url !== "/mybonus.php"), // 继承、排除
      {
        requestConfig: { url: "/mybonus_new.php", responseType: "document" },
        fields: ["bonusPerHour"],
      },
    ],
  },

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege: "得到一个邀请名额。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "得到一个邀请名额，且Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到一个邀请名额。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "得到一个邀请名额。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "得到一个邀请名额，且Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "得到一个邀请名额，可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      privilege: "得到一个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "得到一个邀请名额。",
    },
  ],
};
