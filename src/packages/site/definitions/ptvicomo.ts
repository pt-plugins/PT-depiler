/**
 * FIXME 由 resource/sites/ptvicomo.net/config.json 自动转换而来
 */
import { type ISiteMetadata } from "../types";
// import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  //...SchemaMetadata,
  version: 1,

  id: "ptvicomo",
  name: "象岛",
  description: "大象自中虚，中虚真不渝！",
  tags: ["综合"],
  timezoneOffset: "+0800",
  isDead: true,

  type: "private",
  schema: "NexusPHP",

  collaborator: ["AllenPu"],

  urls: ["https://ptvicomo.net/"],

  /*
  userInfo: {
    ...SchemaMetadata.userInfo,
    selectors: {
      ...SchemaMetadata.userInfo?.selectors,
      levelName: {
        selector: [
          "td.rowhead:contains('等级') + td > b",
          "td.rowhead:contains('Class') + td > b",
          "td.rowhead:contains('等級') + td > b",
        ],
      },
      bonus: {
        selector: [
          "td.rowhead:contains('象草') + td",
          "td.rowhead:contains('Karma Points') + td",
          "td.rowhead:contains('魔力值') + td",
        ],
        filters: [{ name: "parseNumber" }],
      },
    },
  },
   */

  /*
  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "电影", value: 401 },
        { name: "电视剧", value: 402 },
        { name: "综艺", value: 403 },
        { name: "纪录片", value: 404 },
        { name: "动画", value: 405 },
        { name: "MV", value: 406 },
        { name: "体育", value: 407 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],
    */

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；直接发布种子；查看NFO文档；查看用户列表；请求续种；发送邀请；查看排行榜；查看其它用户的种子历史；删除自己上传的字幕。",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "封存账号后不会被删除",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到两个邀请名额；在做种/下载/发布的时候选择匿名模式",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "发送邀请；查看普通日志",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "永远保留账号；得到三个邀请名额；查看其它用户的评论、帖子历史",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "更新过期的外部信息；查看Extreme User论坛",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      privilege: "得到五个邀请名额",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "得到十个邀请名额",
    },
  ],
};
