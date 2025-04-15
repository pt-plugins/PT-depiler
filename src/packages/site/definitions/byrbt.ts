import { ETorrentStatus, type ISiteMetadata } from "@ptd/site";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
  subTitleRemoveExtraElement,
} from "@ptd/site/schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "byrbt",
  name: "北邮人-BYRBT",
  description: "著名教育网PT站点（仅支持ipv6访问与下载），有10大类资源，资源更新快，保种好。",
  tags: ["教育网", "影视", "综合"],

  collaborator: ["Rhilip", "yuanyiwei", "hui-shao"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://byr.pt/"],
  formerHosts: ["bt.byr.cn"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 408, name: "电影" },
        { value: 401, name: "剧集" },
        { value: 404, name: "动漫" },
        { value: 402, name: "音乐" },
        { value: 405, name: "综艺" },
        { value: 403, name: "游戏" },
        { value: 406, name: "软件" },
        { value: 407, name: "资料" },
        { value: 409, name: "体育" },
        { value: 410, name: "纪录" },
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
      rows: { selector: "table.torrents:last > tbody > tr:gt(0)" },
      id: {
        selector: "a[title][href*='details.php?id=']",
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      subTitle: {
        text: "",
        selector: ["a[href*='hit'][title]", "a[href*='hit']:has(b)"],
        elementProcess: subTitleRemoveExtraElement(["span"]),
      },
      url: {
        selector: "a[title][href*='details.php?id=']",
        attr: "href",
        filters: [
          { name: "querystring", args: ["id"] },
          { name: "perpend", args: ["/details.php?id="] },
        ],
      },
      link: {
        selector: "a[href*='download.php?id=']",
        attr: "href",
      },

      category: {
        selector: "div.cat-icon-merge > span.cat-icon",
      },

      status: {
        // 似乎只有一个 已完成 能够了解，下载进度等不能明确
        selector: ['img[src="pic/finished.png"]'],
        attr: "src",
        filters: [
          (query: string) => {
            if (query === "pic/finished.png") {
              return ETorrentStatus.completed;
            }
            return ETorrentStatus.unknown;
          },
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户的默认级别：上传字幕；发布趣味盒；查看用户列表；查看NFO文档；",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P14D",
      uploaded: "32GB",
      ratio: 1.05,
      privilege: "请求续种；查看排行榜；查看普通日志；删除自己上传的字幕；使用流量条；更新外部信息；新增求种",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P56D",
      uploaded: "512GB",
      ratio: 1.55,
      privilege: "查看其它用户的种子历史（如果用户隐私等级未设置为“强”）；直接发布种子",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P84D",
      uploaded: "1024GB",
      ratio: 2.05,
      privilege: "购买邀请；发送邀请；在做种/下载/发布的时候选择匿名模式",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P168D",
      uploaded: "2048GB",
      ratio: 2.55,
      privilege: "申请发布徽章；更新外部信息；购买用户名特效",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P168D",
      uploaded: "4096GB",
      ratio: 3.05,
      privilege: "查看其他用户的评论和帖子历史记录（如果用户隐私等级未设置为“强”）；查看种子结构",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P168D",
      uploaded: "8192GB",
      ratio: 3.55,
      privilege: "可以购买用户名特效（动态）",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P336D",
      uploaded: "32768GB",
      ratio: 4.05,
      privilege: "更加高级",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P48W",
      uploaded: "131072GB",
      ratio: 4.55,
      privilege: "最高晋级用户等级：使用魔力值修改用户名（支持中文）；可以领取专属荣誉徽章",
    },
    {
      id: 100,
      name: "贵宾",
      groupType: "vip",
      privilege: "免除分享率考核",
    },
    {
      id: 200,
      name: "养老族",
      groupType: "manager",
      privilege: "免除上传速度监测",
    },
    {
      id: 201,
      name: "发布员",
      groupType: "manager",
      privilege: "查看匿名用户的真实身份；查看被禁止的种子；访问论坛工作组专区",
    },
    {
      id: 202,
      name: "总版主",
      groupType: "manager",
      privilege:
        "管理种子，包括编辑/删除/设优惠/置顶；管理种子评论；管理论坛帖子；管理群聊区；" +
        "管理趣味盒；管理字幕区；查看机密日志；查看管理组信箱",
    },
    {
      id: 203,
      name: "维护开发员",
      groupType: "manager",
      privilege: "查看网站运行状态；管理站点设定；管理网站代码",
    },
    {
      id: 204,
      name: "主管",
      groupType: "manager",
      privilege: "管理组成员的任免；发放特殊用户组和管理组的工资（魔力值）；管理站点任务系统；其他未被提及的权限",
    },
  ],
};

export default class Byrbt extends NexusPHP {
  protected override guessSearchFieldIndexConfig(): Record<string, string[]> {
    return {
      author: ['a[href*="sort=9"]'], // 发布者
      comments: ["div.icons.comments"], // 评论数
      completed: ["div.icons.snatched"], // 完成数
      leechers: ["div.icons.leechers"], // 下载数
      seeders: ["div.icons.seeders"], // 种子数
      size: ["div.icons.size"], // 大小
      time: ["div.icons.time"], // 发布时间 （仅生成 selector， 后面会覆盖）
    };
  }
}
