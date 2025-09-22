/**
 * FIXME 由 resource/sites/www.gamegamept.com/config.json 自动转换而来
 */
import { type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";
import { userInfoWithInvitesInUserDetailsPage } from "./kunlun.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "ggpt",
  name: "GGPT",
  description: "gamegamept.com",
  tags: ["游戏"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["IITII", "yiyule"],

  urls: ["uggcf://jjj.tnzrtnzrcg.pbz/"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "种子区", value: "/torrents.php" },
        { name: "9KG专区", value: "/special.php" },
      ],
    },
    {
      name: "分类(种子区)",
      key: "cat_normal",
      notes: "请先设置搜索入口为“种子区”！请勿与9KG专区类别同时选择！",
      options: [
        { name: "PC游戏", value: 401 },
        { name: "索尼主机游戏", value: 404 },
        { name: "微软主机游戏", value: 405 },
        { name: "任天堂主机游戏", value: 406 },
        { name: "苹果游戏", value: 407 },
        { name: "安卓游戏", value: 409 },
        { name: "游戏书藉", value: 410 },
        { name: "其他", value: 411 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "分类(9KG专区)",
      key: "cat_special",
      notes: "请先设置搜索入口为“9KG专区”！请勿与种子区类别同时选择！",
      options: [
        { name: "9PC游戏", value: 412 },
        { name: "9索尼主机游戏", value: 413 },
        { name: "9KG-游戏", value: 414 },
        { name: "9任天堂主机游戏", value: 415 },
        { name: "9苹果游戏", value: 416 },
        { name: "9安卓游戏", value: 417 },
        { name: "其他", value: 418 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  searchEntry: {
    area_normal: { name: "种子区", requestConfig: { url: "/torrents.php" } },
    area_special: { name: "9KG专区", enabled: false, requestConfig: { url: "/special.php" } },
  },

  userInfo: {
    ...userInfoWithInvitesInUserDetailsPage,
    selectors: {
      ...userInfoWithInvitesInUserDetailsPage.selectors!,
      levelId: {
        selector: [
          "td.rowhead:contains('等级') + td > img",
          "td.rowhead:contains('等級') + td > img",
          "td.rowhead:contains('Class') + td > img",
        ],
        attr: "src",
        filters: [
          (query: string) => {
            const match = query.match(/\/class\/(\d+)\.gif/);
            return match ? parseInt(match[1]) - 1 : 0;
          },
        ],
      },
    },
    process: [
      ...userInfoWithInvitesInUserDetailsPage.process!.map((item) => {
        if (item.requestConfig.url === "/userdetails.php") {
          return {
            ...item,
            fields: [...(item.fields || []), "levelId"],
          };
        }
        return item;
      }),
    ],
  },

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
      ratio: 2,
      seedingBonus: 40000,
      privilege:
        '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "100GB",
      ratio: 2.5,
      seedingBonus: 80000,
      privilege: "没有新权限增加",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 3,
      seedingBonus: 150000,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 3.5,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "1TB",
      ratio: 4,
      seedingBonus: 400000,
      privilege: "可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "2TB",
      ratio: 4.5,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息。游戏大仙(Extreme User)及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "5TB",
      ratio: 5,
      seedingBonus: 800000,
      privilege: "这个等级会永远保留账号。",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "10TB",
      ratio: 5.5,
      seedingBonus: 1000000,
      privilege: "这个等级会永远保留账号。",
    },
    // VIP/管理组等级
    {
      id: 100,
      name: "入尘散仙",
      nameAka: ["入尘散仙(VIP)", "VIP"],
      groupType: "vip",
      privilege: "和游戏帝(Nexus Master)拥有相同权限并被认为是精英成员。免除自动降级。",
    },
    {
      id: 101,
      name: "游戏帝",
      nameAka: ["游戏帝(Nexus Master)", "Nexus Master"],
      groupType: "vip",
      privilege: "和入尘散仙(VIP)拥有相同权限并被认为是精英成员。免除自动降级。",
    },
    {
      id: 102,
      name: "其它",
      nameAka: ["其它", "其它(Other)", "Other"],
      groupType: "manager",
      privilege: "自定义等级。",
    },
    {
      id: 103,
      name: "相忘于江湖",
      nameAka: ["相忘于江湖", "相忘于江湖(Retiree)", "Retiree"],
      groupType: "manager",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 104,
      name: "发布员",
      nameAka: ["发布员", "发布员(Uploader)", "Uploader"],
      groupType: "manager",
      privilege: "专注的发布者。免除自动降级；可以查看匿名用户的真实身份。",
    },
    {
      id: 105,
      name: "总版主",
      nameAka: ["总版主", "总版主(Moderator)", "Moderator"],
      groupType: "manager",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息。不能管理友情链接、最近消息、论坛版块；不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 106,
      name: "管理员",
      nameAka: ["管理员", "管理员(Administrator)", "Administrator"],
      groupType: "manager",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 107,
      name: "维护开发员",
      nameAka: ["维护开发员", "维护开发员(Sysop)", "Sysop"],
      groupType: "manager",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 108,
      name: "主管",
      nameAka: ["主管", "主管(Staff Leader)", "Staff Leader"],
      groupType: "manager",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};
