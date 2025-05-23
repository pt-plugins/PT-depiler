import { ETorrentStatus, type ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,

  id: "u2",
  name: "U2",
  schema: "NexusPHP",
  type: "private",
  urls: ["https://u2.dmhy.org/"],
  description: "动漫花园分享园",
  tags: ["影视", "动漫"],
  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { value: 9, name: "U2-Rip" },
        { value: 411, name: "U2-RBD" },
        { value: 10, name: "R3TRAW" },
        { value: 11, name: "R2JRAW" },
        { value: 12, name: "BDRip" },
        { value: 13, name: "DVDRip" },
        { value: 14, name: "HDTVRip" },
        { value: 15, name: "DVDISO" },
        { value: 16, name: "BDMV" },
        { value: 17, name: "LQRip" },
        { value: 410, name: "外挂结构" },
        { value: 412, name: "加流重灌" },
        { value: 21, name: "Raw Books" },
        { value: 22, name: "港译漫画" },
        { value: 23, name: "台译漫画" },
        { value: 30, name: "Lossless Music" },
        { value: 40, name: "Others" },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    {
      name: "显示促销种子？",
      key: "spstate",
      options: [
        { name: "全部", value: 0 },
        { name: "普通", value: 1 },
        { name: "免费", value: 2 },
        { name: "2X", value: 3 },
        { name: "2X免费", value: 4 },
        { name: "50%", value: 5 },
        { name: "2X 50%", value: 6 },
        { name: "30%", value: 7 },
        { name: "其他", value: 8 },
      ],
    },
    CategoryInclbookmarked,
  ],
  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      title: {
        selector: ["a.tooltip[href*='hit']"],
      },
      subTitle: {
        selector: ["span.tooltip"],
      },
      progress: {
        selector: ["td[class*='seedhlc_'], td[class*='leechhlc_']"],
        elementProcess: (element: HTMLElement) => {
          switch (true) {
            case /seedhlc_/.test(element.className):
              return 100;
            case /leechhlc_/.test(element.className):
              return parseFloat((element.innerText.match(/[\d.]+%/)! || ["0"])[0]);
            default:
              return 0;
          }
        },
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: ":self",
        case: {
          "td[class*='seedhlc_ever']": ETorrentStatus.completed,
          ".seedhlc_current": ETorrentStatus.seeding,
          ".leechhlc_inactive": ETorrentStatus.inactive,
          ".leechhlc_current": ETorrentStatus.downloading,
        },
      },
      leechers: {
        elementProcess: (element: HTMLElement) => {
          return parseInt(element.firstChild!.textContent!);
        },
      },
      ext_anidb: {
        selector: ["a[href*='http://anidb.net/']"],
        attr: "href",
        filters: [{ name: "extAnidbId" }],
      },
    },
  },
  userInfo: {
    ...SchemaMetadata.userInfo,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      bonus: {
        selector: ["td.rowhead:contains('UCoin') + td > span"],
        attr: "title",
        filters: [(query: string) => parseFloat(query.replace(/,/gi, ""))],
      },
      bonusPerHour: {
        selector: ["table.main td.text"],
        filters: [
          (query: string | number) => {
            const queryMatch = String(query || "").match(/UCoin(\d+(?:\.\d+)?)/);
            const bonusPerDay = queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
            return bonusPerDay / 24;
          },
        ],
      },
      seeding: {
        selector: [":self"],
        filters: [(query: string) => query.match(/<b>(\d+)<\/b>条记录/)?.[1] ?? "0", { name: "parseNumber" }],
      },
      seedingSize: {
        selector: [":self"],
        filters: [
          (query: string) => query.match(/大小.+?([\d.]+ [ZEPTGMK]?i?B)</)?.[1] ?? "0 B",
          { name: "parseSize" },
        ],
      },
    },
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        fields: ["id"],
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: ["name", "levelName", "uploaded", "downloaded", "bonus", "messageCount", "joinTime"],
      },
      {
        requestConfig: { url: "/mprecent.php", responseType: "document" },
        assertion: { id: "params.user" },
        fields: ["bonusPerHour"],
      },
      {
        requestConfig: {
          url: "/getusertorrentlistajax.php",
          params: {
            type: "seeding",
          },
          responseType: "text",
        },
        assertion: { id: "params.userid" },
        fields: ["seeding", "seedingSize"],
      },
    ],
  },

  levelRequirements: [
    {
      id: 0,
      name: "异教徒",
      privilege: "查看会员列表; 请求补种; 查看普通日志; 使用流量信息条",
    },
    {
      id: 1,
      name: "路人",
      privilege:
        "新用户的默认等级; 查看种子结构; 查看其它用户的评论、帖子历史; 查看排行榜; 查看其它用户的历史种子列表; 上传字幕; 删除自己上传的字幕; 提交候选.",
    },
    {
      id: 2,
      name: "御宅族",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege: "查看会员列表; 请求补种; 查看普通日志; 使用流量信息条",
    },
    {
      id: 3,
      name: "宅修士",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "无",
    },
    {
      id: 4,
      name: "宅教士",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.55,
      privilege: "无",
    },
    {
      id: 5,
      name: "宅传教士",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "无",
    },
    {
      id: 6,
      name: "宅护法",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "使用邀请名额; 无可用邀请时，购买邀请",
    },
    {
      id: 7,
      name: "宅贤者",
      interval: "P60W",
      downloaded: "1024GB",
      ratio: 3.55,
      privilege: "无",
    },
    {
      id: 8,
      name: "宅圣",
      interval: "P80W",
      downloaded: "1536GB",
      ratio: 4.05,
      privilege: "账号封存后永久保留.",
    },
    {
      id: 9,
      name: "宅神",
      interval: "P100W",
      downloaded: "3072GB",
      ratio: 4.55,
      privilege: "账号永久保留",
    },
    {
      id: 200,
      name: "福音组",
      groupType: "manager",
      privilege: "热心会员自发参与组成。如果他们的种子存在问题，请勇敢指正; 不经候选直接上传种子; 查看已屏蔽的种子.",
    },
    {
      id: 201,
      name: "现充",
      groupType: "manager",
      privilege: "授予曾经做出贡献的管理成员、发布员、压制组等的荣誉头衔.",
    },
    {
      id: 202,
      name: "FFF团",
      groupType: "manager",
      privilege:
        "帮助通过和拒绝候选的热心用户。如果他们的操作存在问题，请联系管理组; 属于管理组成员，可查看受理咨询、建议、投诉等; " +
        "管理论坛主题和帖子; 屏蔽种子评论; 编辑/屏蔽种子; 设置/清除种子置顶; 设置种子人工优惠; 查看机密日志; 管理字幕区;" +
        "查看匿名用户身份; 编辑/屏蔽/决定候选; 查看邀请记录.",
    },
    {
      id: 203,
      name: "执事",
      groupType: "manager",
      privilege: "维护群聊区风纪; 发起站内投票; 对会员进行警告、停用/启用账号; 管理史册.",
    },
    {
      id: 204,
      name: "司铎",
      groupType: "manager",
      privilege: "统筹执事工作，主导规则制定、管理策划和争议调解; 发布、管理站点公告; 管理论坛版块; 彻底删除种子.",
    },
    {
      id: 205,
      name: "枢机",
      groupType: "manager",
      privilege: "负责程序开发和服务器维护，管理站点设定; 修改会员资料，变更用户名、邮箱地址、重设密码.",
    },
    {
      id: 206,
      name: "站宗",
      groupType: "manager",
      privilege: "网站创始人，可以做任何事.",
    },
  ],
};
