import type { ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "musopia",
  name: "音乐乌托邦",
  description: "汇聚每一个人的影响力，让音乐流行起来吧！",
  tags: ["音乐"],
  timezoneOffset: "+0800",

  collaborator: ["bfjy"],

  type: "private",
  schema: "NexusPHP",

  favicon: "./_default_nexusphp.png",

  urls: ["uggcf://jjj.zhfbcvn.ivc/", "uggcf://cg.kmg.zr/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 401, name: "电影" },
        { value: 402, name: "电视剧" },
        { value: 403, name: "综艺" },
        { value: 404, name: "纪录片" },
        { value: 405, name: "动画" },
        { value: 406, name: "音乐视频" },
        { value: 407, name: "体育" },
        { value: 408, name: "音频" },
        { value: 409, name: "其他" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [{ value: 8, name: "CD" }],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 1, name: "H.264" },
        { value: 2, name: "VC-1" },
        { value: 3, name: "Xvid" },
        { value: 4, name: "MPEG-2" },
        { value: 5, name: "Other" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 1, name: "1080p" },
        { value: 2, name: "1080i" },
        { value: 3, name: "720p" },
        { value: 4, name: "SD" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 1, name: "HDS" },
        { value: 2, name: "CHD" },
        { value: 3, name: "MySiLU" },
        { value: 4, name: "WiKi" },
        { value: 5, name: "Other" },
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
        selector: ["td.rowhead:contains('魔力值') + td", "td.rowhead:contains('Karma'):contains('Points') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
    donorConfig: {
      ...SchemaMetadata.userInfo!.donorConfig,
      bonusPerHourMultiplier: 1, // selector 已能正确选中加倍后的时魔
    },
  },
  levelRequirements: [
    {
      id: 1,
      name: "Peasant",
      privilege: "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能申请友情链接；不能上传字幕。",
    },
    {
      id: 2,
      name: "User",
      privilege: "新用户的默认级别。可以发送邀请；可匿名发布; 可对候选投反对票; 可购买邀请。",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      seedingBonus: 40000,
      ratio: 1.05,
      privilege: "可以请求续种；可使用个性条。分享率低于0.95，你将自动降级。",
    },
    {
      id: 4,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      seedingBonus: 80000,
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。分享率低于1.45，你将自动降级。",
    },
    {
      id: 5,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      seedingBonus: 150000,
      ratio: 2.05,
      privilege:
        "可以查看用户列表；可以查看其它用户的种子历史(如果用户隐私等级未设置为强)。分享率低于1.95，你将自动降级。",
    },
    {
      id: 6,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      seedingBonus: 250000,
      ratio: 2.55,
      privilege: "可以查看普通日志。分享率低于2.45，你将自动降级。",
    },
    {
      id: 7,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      seedingBonus: 400000,
      ratio: 3.05,
      privilege:
        "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。分享率低于2.95，你将自动降级。",
    },
    {
      id: 8,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1024GB",
      seedingBonus: 600000,
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。分享率低于3.45，你将自动降级。",
    },
    {
      id: 9,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1536GB",
      seedingBonus: 800000,
      ratio: 4.05,
      privilege: "同上。分享率低于3.95，你将自动降级。",
    },
    {
      id: 10,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3072GB",
      seedingBonus: 1000000,
      ratio: 4.55,
      privilege: "同上。分享率低于4.45，你将自动降级。",
    },
    {
      id: 100,
      groupType: "vip",
      name: "贵宾(VIP)",
      privilege: "和Nexus Master拥有相同权限并被认为是精英成员。免除自动降级。",
    },
    {
      id: 200,
      groupType: "manager",
      name: "养老族(Retiree)",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 201,
      groupType: "manager",
      name: "发布员(Uploader)",
      privilege: "专注的发布者。免除自动降级；可以查看匿名用户的真实身份。",
    },
    {
      id: 202,
      groupType: "manager",
      name: "总版主(Moderator)",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息。不能管理友情链接、最近消息、论坛版块；不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 203,
      groupType: "manager",
      name: "管理员(Administrator)",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 204,
      groupType: "manager",
      name: "维护开发员(Sysop)",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 205,
      groupType: "manager",
      name: "主管(Staff Leader)",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};
