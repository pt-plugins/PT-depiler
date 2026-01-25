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
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege:
        '必须注册至少4周，并且下载至少50G，分享率大于1.05。得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以发送邀请；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "必须注册至少8周，并且下载至少120G，分享率大于1.55。Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 150000,
      privilege:
        "必须注册至少15周，并且下载至少300G，分享率大于2.05。得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 250000,
      privilege: "必须注册至少25周，并且下载至少500G，分享率大于2.55。可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 400000,
      privilege:
        "必须注册至少40周，并且下载至少750G，分享率大于3.05。得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingBonus: 600000,
      privilege:
        "必须注册至少60周，并且下载至少1TB，分享率大于3.55。可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingBonus: 800000,
      privilege: "必须注册至少80周，并且下载至少1.5TB，分享率大于4.05。得到五个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingBonus: 1000000,
      privilege: "必须注册至少100周，并且下载至少3TB，分享率大于4.55。",
    },
  ],
};
