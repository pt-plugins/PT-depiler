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
        { name: "人像摄影", value: 401 },
        { name: "风景摄影", value: 402 },
        { name: "街拍摄影", value: 403 },
        { name: "微距摄影", value: 404 },
        { name: "建筑摄影", value: 405 },
        { name: "动物摄影", value: 406 },
        { name: "纪实摄影", value: 407 },
        { name: "艺术摄影", value: 408 },
        { name: "摄影教程", value: 409 },
        { name: "摄影器材", value: 410 },
        { name: "其他", value: 411 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "RAW格式", value: 1 },
        { name: "JPEG", value: 2 },
        { name: "TIFF", value: 3 },
        { name: "PNG", value: 4 },
        { name: "PSD", value: 5 },
        { name: "PDF电子书", value: 6 },
        { name: "视频教程", value: 7 },
        { name: "音频教程", value: 8 },
        { name: "其他", value: 9 },
      ],
      cross: { mode: "append", key: "medium" },
    },
    {
      name: "相机品牌",
      key: "codec",
      options: [
        { name: "Canon", value: 1 },
        { name: "Nikon", value: 2 },
        { name: "Sony", value: 3 },
        { name: "Fujifilm", value: 4 },
        { name: "Leica", value: 5 },
        { name: "Olympus", value: 6 },
        { name: "Panasonic", value: 7 },
        { name: "其他", value: 8 },
      ],
      cross: { mode: "append", key: "codec" },
    },
    {
      name: "镜头类型",
      key: "audiocodec",
      options: [
        { name: "定焦镜头", value: 1 },
        { name: "变焦镜头", value: 2 },
        { name: "广角镜头", value: 3 },
        { name: "长焦镜头", value: 4 },
        { name: "微距镜头", value: 5 },
        { name: "鱼眼镜头", value: 6 },
        { name: "移轴镜头", value: 7 },
        { name: "其他", value: 8 },
      ],
      cross: { mode: "append", key: "audiocodec" },
    },
    {
      name: "图片尺寸",
      key: "standard",
      options: [
        { name: "8K+", value: 1 },
        { name: "4K", value: 2 },
        { name: "2K", value: 3 },
        { name: "1080p", value: 4 },
        { name: "720p", value: 5 },
        { name: "其他", value: 6 },
      ],
      cross: { mode: "append", key: "standard" },
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
