/**
 * 新站点模板 - NP架构
 * 基于NexusPHP架构的通用站点配置
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";
import { userInfoWithInvitesInUserDetailsPage } from "./kunlun";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "momentpt",
  name: "MomentPT",
  aka: ["瞬间"],
  description: "Moment 是摄影爱好者的净土。只有影像与心灵的对话，故本站禁止发布影视资源，望谅解",
  tags: ["摄影", "图片", "艺术"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["用户"],

  urls: ["uggcf://jjj.zbzragcg.gbc/"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [{ name: "种子区", value: "/torrents.php" }],
    },
    {
      name: "分类",
      key: "cat",
      options: [
        { name: "写真", value: 401 },
        { name: "人像", value: 402 },
        { name: "风光", value: 403 },
        { name: "纪实", value: 404 },
        { name: "人文", value: 405 },
        { name: "动物", value: 411 },
        { name: "美食", value: 412 },
        { name: "超现实", value: 413 },
        { name: "儿童", value: 414 },
        { name: "静物", value: 415 },
        { name: "杂志", value: 416 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  searchEntry: {
    area_normal: { name: "种子区", requestConfig: { url: "/torrents.php" } },
  },

  userInfo: userInfoWithInvitesInUserDetailsPage,

  levelRequirements: [
    {
      id: 0,
      name: "User",
      nameAka: ["取景者"],
      privilege: "新用户的默认级别。注册7天内无数据零保将封禁账号。不零保的情况下，永久保留账号（违规除外）。",
    },
    {
      id: 1,
      name: "Power User",
      nameAka: ["快门手"],
      interval: "P2W",
      downloaded: "8GB",
      ratio: 1.2,
      privilege: "Power User及以上用户可以发送邀请，可以发布摄影作品到候选区。",
    },
    {
      id: 2,
      name: "Elite User",
      nameAka: ["暗房师"],
      interval: "P6W",
      downloaded: "20GB",
      ratio: 1.6,
      privilege: "Elite User及以上用户可以查看工具区。",
    },
    {
      id: 3,
      name: "Crazy User",
      nameAka: ["追光者"],
      interval: "P12W",
      downloaded: "50GB",
      ratio: 2.05,
      privilege: "Crazy User以上用户可以直接发布摄影作品，无需候选。",
    },
    {
      id: 4,
      name: "Insane User",
      nameAka: ["显示师"],
      interval: "P20W",
      downloaded: "100GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      nameAka: ["镜界者"],
      interval: "P40W",
      downloaded: "300GB",
      ratio: 3.05,
      isKept: true,
      privilege: "得到1个邀请名额；可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 6,
      name: "Extreme User",
      nameAka: ["光影师"],
      interval: "P60W",
      downloaded: "500GB",
      ratio: 3.55,
      isKept: true,
      privilege: "得到1个邀请名额；可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      nameAka: ["造影者"],
      interval: "P80W",
      downloaded: "800GB",
      ratio: 4.05,
      isKept: true,
      privilege: "得到1个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      nameAka: ["永恒之眼"],
      interval: "P100W",
      downloaded: "1TB",
      ratio: 4.55,
      isKept: true,
      privilege: "得到2个邀请名额。",
    },
  ],
};
