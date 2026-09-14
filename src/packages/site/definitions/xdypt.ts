import type { ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "xdypt",
  name: "修道院",
  description: "修身为始，修道为终。",
  tags: ["综合"],
  timezoneOffset: "+0800",

  collaborator: [],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://kqlcg.ivc/", "uggcf://cg.1pgey.pa/"],

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 401, name: "电影" },
        { value: 402, name: "电视剧" },
        { value: 403, name: "综艺" },
        { value: 404, name: "纪录片" },
        { value: 405, name: "动漫" },
        { value: 406, name: "MV" },
        { value: 407, name: "体育" },
        { value: 408, name: "音频" },
        { value: 409, name: "音乐" },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    paths: [
      {
        path: "torrents.php",
        method: "get",
      },
    ],
    params: {
      search: "{keyword}",
      search_area: 0,
    },
    batch: {
      delimiter: " ",
      space_replace: "_",
    },
  },

  torrents: {
    list: {
      selector: "table.torrents > tr:has(table.torrentname)",
    },
    fields: {
      id: {
        selector: 'a[href*="details.php?id="]',
        attribute: "href",
        filters: [{ name: "regexp", args: ["id=(\\d+)"] }],
      },
      title_default: {
        selector: 'a[href*="details.php?id="]',
      },
      title_optional: {
        optional: true,
        selector: 'a[title][href*="details.php?id="]',
        attribute: "title",
      },
      title: {
        text: "{% if fields.title_optional %}{{ fields.title_optional }}{% else %}{{ fields.title_default }}{% endif %}",
      },
      details: {
        selector: 'a[href*="details.php?id="]',
        attribute: "href",
      },
      download: {
        selector: 'a[href*="download.php?id="]',
        attribute: "href",
      },
      date_elapsed: {
        selector: "td:nth-child(4) > span",
        optional: true,
      },
      date_added: {
        selector: "td:nth-child(4) > span",
        attribute: "title",
        optional: true,
      },
      size: {
        selector: "td:nth-child(5)",
      },
      seeders: {
        selector: "td:nth-child(6)",
      },
      leechers: {
        selector: "td:nth-child(7)",
      },
      grabs: {
        selector: "td:nth-child(8)",
      },
      downloadvolumefactor: {
        case: {
          "img.pro_free": 0,
          "img.pro_free2up": 0,
          "img.pro_50pctdown": 0.5,
          "img.pro_50pctdown2up": 0.5,
          "img.pro_30pctdown": 0.3,
          "*": 1,
        },
      },
      uploadvolumefactor: {
        case: {
          "img.pro_50pctdown2up": 2,
          "img.pro_free2up": 2,
          "img.pro_2up": 2,
          "*": 1,
        },
      },
    },
  },

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
      bonusPerHourMultiplier: 1,
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "逆堕境",
      privilege:
        "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能发表趣味盒内容；不能申请友情链接；不能上传字幕。",
    },
    {
      id: 2,
      name: "凝气",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 3,
      name: "筑基",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以发送邀请；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为'强')；可以删除自己上传的字幕。",
    },
    {
      id: 4,
      name: "结丹",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 5,
      name: "元婴",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 6,
      name: "化神",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "可以查看普通日志。",
    },
    {
      id: 7,
      name: "婴变",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 8,
      name: "问鼎",
      interval: "P60W",
      downloaded: "1024GB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 9,
      name: "阴虚",
      interval: "P80W",
      downloaded: "1536GB",
      ratio: 4.05,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 10,
      name: "阳实",
      interval: "P100W",
      downloaded: "3072GB",
      ratio: 4.55,
      privilege: "得到十个邀请名额。",
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
