import { ETorrentStatus, type ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "tccf",
  name: "TorrentCCF",
  description: "兼有学习资源和软件资源的影视PT站点",
  tags: ["影视", "综合", "学习"],
  timezoneOffset: "+0800",
  aka: ["TCCF", "ET8"],
  collaborator: ["Rhilip", "cnsunyour", "hui-shao"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://rg8.bet/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 622, name: "Movies.电影" },
        { value: 623, name: "TV.电视剧" },
        { value: 624, name: "Documentaries.纪录片" },
        { value: 625, name: "Appz.软件" },
        { value: 626, name: "Music&MusicVideos.音乐及MV" },
        { value: 627, name: "Others.其他(非学习类)" },
        { value: 628, name: "Elearning.杂项学习" },
        { value: 629, name: "Elearning.电子书/小说" },
        { value: 630, name: "Elearning.电子书/非小说" },
        { value: 631, name: "Elearning.杂志" },
        { value: 632, name: "Elearning.漫画" },
        { value: 633, name: "Elearning.有声书" },
        { value: 634, name: "Elearning.公开课" },
        { value: 635, name: "Elearning.视频教程" },
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
      status: {
        text: ETorrentStatus.unknown,
        selector: ["td[bgcolor='#bce672']", "td[bgcolor='#44cef6']", "td[bgcolor='#d0d0d0']"],
        case: {
          "td[bgcolor='#bce672']": ETorrentStatus.seeding,
          "td[bgcolor='#44cef6']": ETorrentStatus.downloading,
          "td[bgcolor='#d0d0d0']": ETorrentStatus.completed,
        },
      },
      progress: {
        selector: ["td[bgcolor]"],
        filters: [
          (query: string) => {
            const progressText = query.split("%")[0];
            return progressText ? parseFloat(progressText) : 0;
          },
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "Peasant",
      nameAka: ["庶民"],
      privilege:
        "被降级的用户, 他们有30天时间来提升分享率, 否则他们会被踢. 不能发表趣味盒内容; 不能申请友情链接; 不能上传字幕.",
    },
    {
      id: 1,
      name: "User",
      nameAka: ["列兵"],
      privilege: "新用户的默认级别.",
    },
    {
      id: 2,
      name: "Power User",
      nameAka: ["士官"],
      interval: "P2W",
      downloaded: "64GB",
      ratio: 1.05,
      privilege: "可以上传种子; 可以删除自己上传的字幕; 可以在做种/下载/上传的时候选择匿名模式.",
    },
    {
      id: 3,
      name: "Elite User",
      nameAka: ["尉官"],
      interval: "P6W",
      downloaded: "128GB",
      ratio: 1.55,
      privilege: "购买邀请; 可以查看邀请论坛; 可以查看NFO文档; 可以更新外部信息; 可以请求续种; 可以使用个性条.",
    },
    {
      id: 4,
      name: "Crazy User",
      nameAka: ["少校"],
      interval: "P14W",
      downloaded: "256GB",
      ratio: 2.05,
      privilege: '可以查看排行榜;可以查看其它用户的种子历史(如果用户隐私等级未设置为"强").',
    },
    {
      id: 5,
      name: "Insane User",
      nameAka: ["中校"],
      interval: "P26W",
      downloaded: "512GB",
      ratio: 2.55,
      privilege: "中校及以上用户Park后不会被删除帐号.",
    },
    {
      id: 6,
      name: "Veteran User",
      nameAka: ["上校"],
      interval: "P38W",
      downloaded: "1TB",
      ratio: 3.05,
      privilege: "可以发送邀请; 上校及以上用户会永远保留账号.",
    },
    {
      id: 7,
      name: "Extreme User",
      nameAka: ["少将"],
      interval: "P54W",
      downloaded: "2TB",
      ratio: 3.55,
      privilege: "可以查看种子文件结构.",
    },
    {
      id: 8,
      name: "Ultimate User",
      nameAka: ["中将"],
      interval: "P70W",
      downloaded: "4TB",
      ratio: 4.05,
      privilege: "可以查看其它用户的评论、帖子历史;得到五个邀请名额.",
    },
    {
      id: 9,
      name: "Nexus Master",
      nameAka: ["上将"],
      interval: "P88W",
      downloaded: "8TB",
      ratio: 4.55,
      privilege: "得到十个邀请名额.",
    },
    {
      id: 100,
      name: "VIP",
      nameAka: ["贵宾"],
      groupType: "vip",
      privilege: "和 Nexus Master 拥有相同权限并被认为是精英成员。免除自动降级。可以查看用户列表",
    },
    {
      id: 101,
      name: "Other",
      nameAka: ["其他"],
      groupType: "vip",
      privilege: "自定义等级",
    },
    {
      id: 200,
      name: "Retiree",
      nameAka: ["养老族"],
      groupType: "manager",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 201,
      name: "Uploader",
      nameAka: ["发布员"],
      groupType: "manager",
      privilege: "专注的上传者, 免除自动降级; 可以编辑、删除和通过任何候选; 可以查看一般日志.",
    },
    {
      id: 202,
      name: "Moderator",
      nameAka: ["总版主"],
      groupType: "manager",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；" +
        "可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；" +
        "可以管理日志中的代码、史册；可以查看用户的邀请记录；可以管理用户帐号的一般信息。" +
        "不能管理友情链接、最近消息、论坛版块；不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 203,
      name: "Administrator",
      nameAka: ["管理员"],
      groupType: "manager",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 204,
      name: "Sysop",
      nameAka: ["维护开发员"],
      groupType: "manager",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 205,
      name: "Staff Leader",
      nameAka: ["主管"],
      groupType: "manager",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};
