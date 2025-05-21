import { ETorrentStatus, type IElementQuery, type ISiteMetadata } from "@ptd/site";
import { CategoryInclbookmarked, CategoryIncldead, SchemaMetadata } from "../schemas/NexusPHP";
import { set } from "es-toolkit/compat";

// TJUPT 中的 selector.search.progress 以及 selector.search.status 被其他站公用
export const selectorSearchProgress: IElementQuery = {
  selector: ["div.probar_b1, div.probar_b2, div.probar_b3"],
  attr: "style",
  filters: [
    (query: string) => {
      query = query || "";
      const queryMatch = query.match(/width:([ \d.]+)%/);
      return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
    },
  ],
};

export const selectorSearchStatus: IElementQuery = {
  selector: ['div[class*="probar_a"]'],
  attr: "class",
  filters: [
    (query: string) => {
      const queryMatch = query.match(/probar_[ab]([123])/);
      if (queryMatch && queryMatch.length >= 2) {
        switch (parseInt(queryMatch[1])) {
          case 1: // "正在下载，进度至"
            return ETorrentStatus.downloading;
          case 2: // "已下载，正在做种";
            return ETorrentStatus.seeding;
          case 3: // "下载过，已完成" or "下载过，未完成，进度至"
            return ETorrentStatus.inactive;
        }
      }
      return ETorrentStatus.unknown;
    },
  ],
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "tjupt",
  name: "北洋园PT",
  schema: "NexusPHP",
  type: "private",
  urls: ["aHR0cHM6Ly90anVwdC5vcmcv"],
  description:
    "TJUPT是天津市首个、全国前列的校园Private Tracker，建立于2010年，" +
    "由天津大学信网协会和天外天共同开发的，旨在为大家建立一个更好的资源共享环境，提高资源水准。",
  tags: ["教育网", "影视", "综合"],
  collaborator: ["tongyifan", "echo094", "Rhilip"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "电影", value: 401 },
        { name: "剧集", value: 402 },
        { name: "综艺", value: 403 },
        { name: "资料", value: 404 },
        { name: "动漫", value: 405 },
        { name: "音乐", value: 406 },
        { name: "体育", value: 407 },
        { name: "软件", value: 408 },
        { name: "游戏", value: 409 },
        { name: "纪录片", value: 411 },
        { name: "移动视频", value: 412 },
        { name: "其他", value: 410 },
      ],
      cross: { mode: "brackets" },
    },
    CategoryIncldead,
    {
      name: "显示促销种子？",
      key: "spstate",
      options: [
        { name: "全部", value: 0 },
        { name: "普通", value: 1 },
        { name: "2倍上传", value: 3 },
      ],
      cross: false,
    },
    {
      name: "显示推荐？",
      key: "picktype",
      options: [
        { name: "全部", value: 0 },
        { name: "普通", value: 1 },
        { name: "热门", value: 2 },
        { name: "经典", value: 3 },
        { name: "推荐", value: 4 },
        { name: "0day", value: 5 },
        { name: "IMDB TOP 250", value: 6 },
      ],
      cross: false,
    },
    CategoryInclbookmarked,
    {
      name: "显示保种？",
      key: "keepseed",
      options: [
        { name: "全部", value: 0 },
        { name: "仅保种", value: 1 },
        { name: "非保种", value: 2 },
      ],
      cross: false,
    },
  ],

  search: {
    ...SchemaMetadata.search,
    advanceKeywordParams: {
      ...SchemaMetadata.search!.advanceKeywordParams,
      douban: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          set(config!, "params.search_area", 5); // params "&search_area=5"
          return config!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      ext_imdb: { selector: "a[href*='imdb.com/title/tt']", attr: "href", filters: [{ name: "extImdbId" }] },
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
      tags: [
        { name: "禁转", selector: ".tag.tag-exclusive", color: "red" },
        { name: "官方", selector: ".tag.tag-tjupt", color: "light-blue" },
        { name: "驻站", selector: ".tag.tag-internal-team", color: "green" },
        { name: "中字", selector: ".tag.tag-chinese", color: "light-green" },
        { name: "应求", selector: ".tag.tag-response", color: "indigo" },
        { name: "竞价置顶", selector: ".tag.tag-sticky", color: "yellow" },
        { name: "加速中", selector: ".tag.tag-speedup", color: "pink" },
        { name: "救活", selector: ".tag.tag-reseed", color: "indigo" },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      uploaded: {
        selector: ["td.rowhead:contains('上传量') + td"],
        filters: [{ name: "parseSize" }],
      },
    },
    process: [
      ...SchemaMetadata.userInfo!.process!.filter((item) => item.requestConfig.url !== "/mybonus.php"),
      {
        requestConfig: { url: "/bonus.php", params: { show: "description" }, responseType: "document" },
        fields: ["bonusPerHour"],
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "无名小辈(User)",
      privilege: `新用户的默认级别。`,
    },
    {
      id: 2,
      name: "拜师学艺(Power User)",
      interval: "P4W",
      snatches: 20,
      seedingTime: "P30D",
      uploaded: "50GB",
      hnrUnsatisfied: 0, // tjupt 的 H&R 机制为100分满分制，100分即 hnrUnsatisfied = 0
      bonus: 10000, // 实际是升级花费的魔力值
      privilege: "查看用户列表；请求续种；查看其他用户种子历史（隐私等级不为高时）；删除自己上传的字幕。",
    },
    {
      id: 3,
      name: "持剑下山(Elite User)",
      interval: "P8W",
      snatches: 60,
      seedingTime: "P120D",
      uploaded: "200GB",
      hnrUnsatisfied: 0,
      bonus: 30000,
      privilege: "封存账号后不会被删除。",
    },
    {
      id: 4,
      name: "初入江湖(Crazy User)",
      interval: "P16W",
      snatches: 150,
      seedingTime: "P450D",
      uploaded: "800GB",
      uploads: 1,
      hnrUnsatisfied: 0,
      bonus: 80000,
      privilege: "首次升级至此等级时将获得1个永久邀请；发送邀请；做种/下载/发布时可以选择匿名。",
    },
    {
      id: 5,
      name: "小有名气(Insane User)",
      interval: "P28W",
      downloads: "300",
      seedingTime: "P1500D",
      uploaded: "2000GB",
      uploads: 5,
      hnrUnsatisfied: 0,
      bonus: 150000,
      privilege: "首次升级至此等级时将获得1个永久邀请；查看普通日志。",
    },
    {
      id: 6,
      name: "威震一方(Veteran User)",
      interval: "P48W",
      downloads: "600",
      seedingTime: "P4200D",
      uploaded: "5000GB",
      uploads: 10,
      hnrUnsatisfied: 0,
      bonus: 300000,
      privilege: "首次升级至此等级时将获得1个永久邀请；查看其它用户的评论、帖子历史；永久保留账号。",
    },
    {
      id: 7,
      name: "横扫群雄(Extreme User)",
      interval: "P72W",
      downloads: "1000",
      seedingTime: "P28000D",
      uploaded: "10000GB",
      uploads: 15,
      hnrUnsatisfied: 0,
      bonus: 400000,
      privilege: "首次升级至此等级时将获得1个永久邀请。",
    },
    {
      id: 8,
      name: "开宗立派(Ultimate User)",
      interval: "P100W",
      downloads: "1800",
      seedingTime: "P90000D",
      uploaded: "20000GB",
      uploads: 30,
      hnrUnsatisfied: 0,
      bonus: 600000,
      privilege: "首次升级至此等级时将获得2个永久邀请。",
    },
    {
      id: 9,
      name: "天下无敌(Nexus Master)",
      interval: "P132W",
      downloads: "3000",
      seedingTime: "P300000D",
      uploads: 50,
      uploaded: "50000GB",
      hnrUnsatisfied: 0,
      bonus: 1000000,
      privilege: "首次升级至此等级时将获得3个永久邀请。",
    },
    {
      id: 100,
      name: "西域来客",
      groupType: "vip",
      privilege: "免除自动降级，不记录下载量，免除HnR考核。",
    },
    {
      id: 200,
      name: "扫地僧",
      groupType: "manager",
      privilege: "退休的管理组成员。",
    },
    {
      id: 201,
      name: "龙门镖局",
      groupType: "manager",
      privilege: "查看匿名用户的真实身份；每月魔力值奖励和邀请码奖励（根据发种情况浮动）",
    },
    {
      id: 202,
      name: "六扇门",
      groupType: "manager",
      privilege:
        "查看管理组信箱、举报信箱；编辑种子信息，删除种子，设置置顶和种子优惠，管理候选和字幕区；" +
        "编辑、删除论坛帖子/种子评论；查看用户基础信息；拥有无限量邀请权限；每周魔力值奖励",
    },
    {
      id: 203,
      name: "中枢六部",
      groupType: "manager",
      privilege:
        "管理用户账号信息；发送全员消息、设置全局优惠、设置IP地址封禁及其它敏感操作；" +
        "修改站点友链、论坛板块、种子板块、规则、常见问题、公告等站点信息；发放魔力值、批量邀请用户",
    },
    {
      id: 204,
      name: "锦衣卫",
      groupType: "manager",
      privilege: "修改站点设定；管理站点代码、服务器等",
    },
    {
      id: 205,
      name: "九五之尊",
      groupType: "manager",
      privilege: "管理捐赠；管理管理组任命；其他未被提及的权限...",
    },
  ],
};
