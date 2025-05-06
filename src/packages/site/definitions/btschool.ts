import { ETorrentStatus, type ISiteMetadata, parseSizeString } from "@ptd/site";
import {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "@ptd/site/schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "btschool",
  name: "BTSCHOOL",
  description: "汇聚每一个人的影响力",
  tags: ["影视", "综合", "学习"],
  timezoneOffset: "+0800",
  aka: ["学校"],
  collaborator: ["hui-shao"],

  type: "private",
  schema: "NexusPHP",

  urls: ["aHR0cHM6Ly9wdC5idHNjaG9vbC5jbHViLw=="],
  formerHosts: [atob("cHQuYnRzY2hvb2wubmV0")],
  favicon: "./btschool.ico",

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 405, name: "电影" },
        { value: 406, name: "剧集" },
        { value: 407, name: "动漫" },
        { value: 408, name: "纪录" },
        { value: 412, name: "综艺" },
        { value: 404, name: "软件" },
        { value: 402, name: "资料" },
        { value: 411, name: "游戏" },
        { value: 409, name: "音乐" },
        { value: 410, name: "体育" },
        { value: 415, name: "其他" },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      progress: {
        selector: [".progress:eq(0) > div"],
        elementProcess: (element: HTMLElement) => {
          const elementStyle = element.getAttribute("style") || "";
          const widthMatch = elementStyle.match(/width:([\s*\d.]+)%/);
          return widthMatch && widthMatch.length >= 2 ? parseFloat(widthMatch[1]) : 0;
        },
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: [".progress_seeding", ".progress_downloading", ".progress_completed", ".progress_no_downloading"],
        case: {
          ".progress_seeding": ETorrentStatus.seeding,
          ".progress_downloading": ETorrentStatus.downloading,
          ".progress_completed": ETorrentStatus.completed,
          ".progress_no_downloading": ETorrentStatus.inactive,
        },
      },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { name: "官方", selector: "span.label.label-primary", color: "#337ab7" },
        { name: "自制", selector: "span.label.label-default", color: "#777" },
        { name: "国语", selector: "span.label.label-warning", color: "#f0ad4e" },
        { name: "中字", selector: "span.label.label-info", color: "#5bc0de" },
        { name: "禁转", selector: "span.label.label-danger", color: "#d9534f" },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      seeding: {
        selector: [
          "td.rowhead:contains('当前做种') + td, td.rowhead:contains('Current Seeding') + td, td.rowhead:contains('目前做種') + td",
        ],
        elementProcess: (element: HTMLElement) => {
          const text = element.textContent?.trim() || "";
          const match = text.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        },
      },
      seedingSize: {
        selector: [
          "td.rowhead:contains('当前做种') + td, td.rowhead:contains('Current Seeding') + td, td.rowhead:contains('目前做種') + td",
        ],
        elementProcess: (element: HTMLElement) => {
          const text = element.textContent?.trim() || "";
          const match = text.match(/[\d.]+\s*[A-Za-z]+/);
          return match ? parseSizeString(match[0]) : 0;
        },
      },
    },
    process: [
      {
        requestConfig: { url: "/index.php", params: { _: Date.now() }, responseType: "document" }, // 有助于通过 CF
        fields: ["id", "name"],
      },
      {
        requestConfig: { url: "/userdetails.php", params: { _: Date.now() }, responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "messageCount",
          "uploaded",
          "trueUploaded",
          "downloaded",
          "trueDownloaded",
          "levelName",
          "bonus",
          "seedingBonus",
          "joinTime",
          "seeding",
          "seedingSize",
        ],
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户的默认级别",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 2.0,
      seedingBonus: 40000,
      privilege: "一个邀请名额；查看NFO文档；查看用户列表；请求续种；查看其它用户的种子历史； 删除自己上传的字幕。",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: "100GB",
      ratio: 2.5,
      seedingBonus: 80000,
      privilege: "直接发布种子； 查看排行榜",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 3.0,
      seedingBonus: 150000,
      privilege: "两个邀请名额；在做种/下载/发布的时候选择匿名模式",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 3.5,
      seedingBonus: 250000,
      privilege: "查看普通日志",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "1TB",
      ratio: 4.0,
      seedingBonus: 400000,
      privilege: "三个邀请名额；查看其它用户的评论、帖子历史；封存账号后不会被删除",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "2TB",
      ratio: 4.5,
      seedingBonus: 600000,
      privilege: "更新过期的外部信息；查看Extreme User论坛；永远保留账号",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "5TB",
      ratio: 5.0,
      seedingBonus: 800000,
      privilege: "五个邀请名额",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "10TB",
      ratio: 5.5,
      seedingBonus: 1000000,
      privilege: "十个邀请名额；发送邀请",
    },
    {
      id: 100,
      name: "贵宾(VIP)",
      groupType: "vip",
      privilege: "和 Nexus Master 拥有相同权限并被认为是精英成员。免除自动降级。",
    },
    {
      id: 101,
      name: "其他",
      groupType: "vip",
      privilege: "自定义等级",
    },
    {
      id: 200,
      name: "养老族(Retiree)",
      groupType: "manager",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 201,
      name: "发布员(Uploader)",
      groupType: "manager",
      privilege: "专注的发布者。免除自动降级；可以查看匿名用户的真实身份。",
    },
    {
      id: 202,
      name: "总版主(Moderator)",
      groupType: "manager",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；" +
        "可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；" +
        "可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息。" +
        "不能管理友情链接、最近消息、论坛版块；不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 203,
      name: "管理员(Administrator)",
      groupType: "manager",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 204,
      name: "维护开发员(Sysop)",
      groupType: "manager",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 205,
      name: "主管(Staff Leader)",
      groupType: "manager",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};
