import type { ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "hxpt",
  name: "好学",
  aka: ["HXPT"],
  description: "好学者如春苗，日有所长；心向学，梦有光！",
  tags: ["学习"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://jjj.ukcg.bet/"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "学前教育", value: 401 },
        { name: "小学部", value: 402 },
        { name: "初中部", value: 403 },
        { name: "高职部", value: 404 },
        { name: "高中部", value: 405 },
        { name: "教育影音", value: 406 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "标签",
      key: "tag_id",
      options: [
        { name: "禁转", value: 1 },
        { name: "首发", value: 2 },
        { name: "官方", value: 3 },
        { name: "DIY", value: 4 },
        { name: "国语", value: 5 },
        { name: "中字", value: 6 },
        { name: "HDR", value: 7 },
        { name: "语文", value: 8 },
        { name: "数学", value: 9 },
        { name: "外语", value: 10 },
        { name: "历史", value: 11 },
        { name: "地理", value: 12 },
        { name: "化学", value: 13 },
        { name: "生物", value: 14 },
        { name: "道法", value: 15 },
        { name: "音乐", value: 16 },
        { name: "美术", value: 17 },
        { name: "体育", value: 18 },
        { name: "自然科学", value: 19 },
        { name: "信息技术", value: 20 },
        { name: "兴趣爱好", value: 21 },
      ],
      cross: false, // 不支持多选
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "视频", value: 1 },
        { name: "音频", value: 2 },
        { name: "书籍", value: 3 },
        { name: "文档", value: 4 },
        { name: "笔记", value: 5 },
        { name: "课件", value: 6 },
        { name: "软件", value: 7 },
        { name: "会议", value: 8 },
        { name: "图片", value: 9 },
        { name: "其它", value: 10 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "HXPT", value: 9 },
        { name: "HXWEB", value: 8 },
        { name: "Other", value: 10 },
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
        selector: ["td.rowhead:contains('火花') + td", "td.rowhead:contains('Karma'):contains('Points') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； " +
        '可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "得到十个邀请名额。",
    },
  ],
};
