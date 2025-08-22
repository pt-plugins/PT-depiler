/**
 * FIXME 由 resource/sites/raingfh.top/config.json 自动转换而来
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "raingfh",
  name: "雨",
  description: "与你相逢，就是奇迹",
  tags: ["综合", "影视"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["https://raingfh.top/"],

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

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        selector: ["td.rowhead:contains('雨滴') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户的默认等级",
    },
    {
      id: 2,
      name: "Power User（灯火通明）",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege:
        '得到一个邀请名额；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 3,
      name: "Elite User（月华如水）",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "User及以上用户封存账号后不会被删除。",
    },
    {
      id: 4,
      name: "Crazy User（流光溢彩）",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 15000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 5,
      name: "Insane User（光芒万丈）",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 25000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 6,
      name: "Veteran User（星火燎原）",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 400000,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Extreme User（光耀四方）",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 8,
      name: "Ultimate User（烈日当空）",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingBonus: 800000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 9,
      name: "Nexus Master（星河璀璨）",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingBonus: 1000000,
      privilege: "得到十个邀请名额。",
    },
  ],
};
