import { ETorrentStatus, ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategorySpstate, SchemaMetadata } from "@ptd/site/schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "nanyangpt",
  name: "南洋PT",
  description: "网站由西安交通大学学生自主创建与管理，汇集学习资料、纪录片、电影、剧集等各类优质资源",
  tags: ["教育网", "影视", "综合"],

  collaborator: ["Rhilip", "Yincircle"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://nanyangpt.com/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 401, name: "电影" },
        { value: 402, name: "剧集" },
        { value: 403, name: "动漫" },
        { value: 404, name: "综艺" },
        { value: 405, name: "体育" },
        { value: 406, name: "纪录" },
        { value: 407, name: "音乐" },
        { value: 408, name: "学习" },
        { value: 409, name: "软件" },
        { value: 410, name: "游戏" },
        { value: 411, name: "其他" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "显示断种/活种？",
      key: "incldead",
      options: [
        { name: "全部", value: 0 },
        { name: "仅活种", value: 1 },
        { name: "仅断种", value: 2 },
        { name: "待救种", value: 3 },
      ],
      cross: false,
    },
    CategorySpstate,
    CategoryInclbookmarked,
  ],
  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      progress: {
        selector: [
          ".rowfollow[title='Downloading'], .rowfollow[title='Seeding'], .rowfollow[title='Stopped'], .rowfollow[title='Completed']",
        ],
        filters: [(query: string) => (query === "--" ? 0 : parseFloat(query))],
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: [
          ".rowfollow[title='Downloading']",
          ".rowfollow[title='Seeding']",
          ".rowfollow[title='Stopped']",
          ".rowfollow[title='Completed']",
        ],
        case: {
          ".rowfollow[title='Downloading']": ETorrentStatus.downloading,
          ".rowfollow[title='Seeding']": ETorrentStatus.seeding,
          ".rowfollow[title='Stopped']": ETorrentStatus.inactive,
          ".rowfollow[title='Completed']": ETorrentStatus.completed,
        },
      },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { name: "Excl.", selector: "td.embedded > a[title] > b > font[color='red']" },
      ],
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "本科新生",
      privilege: "新用户的默认级别。",
    },
    {
      id: 1,
      name: "小小学士",
      interval: "P2W",
      downloaded: "30GB",
      ratio: 1.5,
      privilege:
        "可以直接发布种子；可以查看NFO文档；可以查看用户列表；" +
        '可以请求续种；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "优秀硕士",
      interval: "P5W",
      downloaded: "50GB",
      ratio: 2.5,
      privilege: "优秀硕士及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "初为博士",
      interval: "P10W",
      downloaded: "100GB",
      ratio: 3.5,
      privilege: "可以在做种/下载/发布的时候选择匿名模式，可以在邀请传送门版块发帖。",
    },
    {
      id: 4,
      name: "海归博后",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 4.5,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "大学讲师",
      interval: "P20W",
      downloaded: "500GB",
      ratio: 5.5,
      privilege: "可以查看排行榜；可以查看其它用户的评论、帖子历史。大学讲师及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "晋升副教",
      interval: "P30W",
      downloaded: "700GB",
      ratio: 6.5,
      privilege: "可以更新过期的外部信息；可以查看晋升副教论坛。",
    },
    {
      id: 7,
      name: "终身教授",
      interval: "P80W",
      downloaded: "900GB",
      ratio: 7.5,
      privilege: "更加高级。",
    },
    {
      id: 8,
      name: "荣誉院士",
      interval: "P100W",
      downloaded: "1TB",
      ratio: 8.5,
      privilege: "更加高级。",
    },
    {
      id: 9,
      name: "贵宾",
      groupType: "vip",
      privilege: "和荣誉院士拥有相同权限并被认为是精英成员。免除自动降级。",
    },
    {
      id: 10,
      name: "养老族",
      groupType: "manager",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 11,
      name: "论坛版主",
      groupType: "manager",
      privilege: "论坛版块的版主，拥有管理版块的权限，免除自动降级。",
    },
    {
      id: 12,
      name: "保种分流员",
      groupType: "manager",
      privilege: "保种分流员，免除自动降级。",
    },
    {
      id: 13,
      name: "发布员",
      groupType: "manager",
      privilege: "专注的发布者，免除自动降级；可以查看匿名用户的真实身份。",
    },
    {
      id: 14,
      name: "种子管理员",
      groupType: "manager",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；" +
        "可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；" +
        "可以查看用户的邀请记录；可以管理用户帐号的一般信息。不能管理友情链接、最近消息、论坛版块；" +
        "不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 15,
      name: "高级管理员",
      groupType: "manager",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 16,
      name: "维护开发员",
      groupType: "manager",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 17,
      name: "主管",
      groupType: "manager",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};
