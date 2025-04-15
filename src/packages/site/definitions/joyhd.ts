import { ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategorySpstate, SchemaMetadata } from "@ptd/site/schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "joyhd",
  name: "JoyHD",
  description: "JoyHD成立於2013年，發佈藍光原碟，藍光DIY和原抓音樂。",
  tags: ["影视", "综合"],

  collaborator: ["ylxb2016"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://www.joyhd.net/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { name: "Movie", value: 401 },
        { name: "TV Series", value: 402 },
        { name: "Entertainment", value: 403 },
        { name: "Anime", value: 405 },
        { name: "Music", value: 414 },
        { name: "Sport", value: 407 },
        { name: "Documentaries", value: 404 },
        { name: "MV", value: 406 },
        { name: "Software", value: 408 },
        { name: "Game", value: 410 },
        { name: "e-Learn", value: 411 },
        { name: "Other", value: 409 },
      ],
      cross: { mode: "append" },
    },
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        selector: ["td.rowhead:contains('银元') + td"],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: `新用户的默认级别。`,
    },
    {
      id: 2,
      name: "正兵/Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.2,
      privilege:
        "可以直接发布种子；可以查看NFO文档；可以查看用户列表；" +
        "可以查看其它用户的种子历史(如果用户隐私等级未设置为“强”)； 可以删除自己上传的字幕。",
    },
    {
      id: 3,
      name: "军士/Elite User",
      interval: "P8W",
      downloaded: "100GB",
      ratio: 1.5,
      privilege: "军士及以上用户封存账号后不会被删除; 可以发送邀请；可以请求续种。",
    },
    {
      id: 4,
      name: "副军校/Crazy User",
      interval: "P15W",
      downloaded: "200GB",
      ratio: 2.5,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 5,
      name: "正军校/Insane User",
      interval: "P25W",
      downloaded: "400GB",
      ratio: 3.5,
      privilege: "可以查看普通日志。得到一个邀请名额。",
    },
    {
      id: 6,
      name: "副参领/Veteran User",
      interval: "P25W",
      downloaded: "600GB",
      ratio: 4.5,
      privilege: "可以查看其它用户的评论、帖子历史。副参领及以上用户会永远保留账号。得到二个邀请名额。",
    },
    {
      id: 7,
      name: "正参领/Extreme User",
      interval: "P25W",
      downloaded: "1000GB",
      ratio: 5.5,
      privilege: "可以更新过期的外部信息；得到二个邀请名额。",
    },
    {
      id: 8,
      name: "副都统/Ultimate User",
      interval: "P30W",
      downloaded: "2000GB",
      ratio: 6.0,
      privilege: "得到三个邀请名额。",
    },
    {
      id: 9,
      name: "大将军/Nexus Master",
      interval: "P50W",
      downloaded: "5000GB",
      ratio: 6.0,
      privilege: "得到五个邀请名额。",
    },
  ],
};
