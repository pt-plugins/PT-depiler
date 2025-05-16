import { type ISiteMetadata, ETorrentStatus, IAdvancedSearchRequestConfig, IElementQuery } from "../types";
import {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
  subTitleRemoveExtraElement,
} from "../schemas/NexusPHP";
import { GB, TB } from "@ptd/site";

const selectorSearchProgress: IElementQuery = {
  ...SchemaMetadata.search!.selectors!.title!,
  elementProcess: (element) => {
    const progressElement = element.parentElement.querySelector("div");
    if (!progressElement) return "";
    const progressTitle = progressElement.getAttribute("title");
    const split = progressTitle.split(" ");
    const progress = split[1];
    return progress;
  },
  filters: [(query: string) => parseFloat(query)],
};

const selectorSearchStatus: IElementQuery = {
  text: ETorrentStatus.unknown,
  ...SchemaMetadata.search!.selectors!.title!,
  elementProcess: (element) => {
    const progressElement = element.parentElement.querySelector("div");
    if (!progressElement) return "";
    const progressTitle = progressElement.getAttribute("title");
    const split = progressTitle.split(" ");
    const progress = split[1];
    const status = split[0];
    switch (status) {
      case "leeching":
        return ETorrentStatus.downloading;
      case "seeding":
        return ETorrentStatus.seeding;
      case "inactivity":
        return progress == "100%" ? ETorrentStatus.completed : ETorrentStatus.inactive;
    }
    return ETorrentStatus.unknown;
  },
};

const allCustomTags = [
  { name: "原盘", value: 14, selector: "span[style*='background-color:#483d8b']", color: "#483d8b" },
  { name: "中文字幕", value: 8, selector: "span[style*='background-color:#ff00ff']", color: "#ff00ff" },
  { name: "禁转", value: 1, selector: "span[style*='background-color:#ff0000']", color: "#ff0000" },
  { name: "自购", value: 2, selector: "span[style*='background-color:#8F77B5']", color: "#8F77B5" },
  { name: "合集", value: 6, selector: "span[style*='background-color:#006400']", color: "#006400" },
  { name: "新作", value: 7, selector: "span[style*='background-color:#38b03f']", color: "#38b03f" },
  { name: "非原档", value: 17, selector: "span[style*='background-color:#FF7575']", color: "#FF7575" },
  { name: "不漏点软色情", value: 16, selector: "span[style*='background-color:#7373B9']", color: "#7373B9" },
  { name: "有水印", value: 15, selector: "span[style*='background-color:#7E3D76']", color: "#7E3D76" },
  { name: "全身有码", value: 13, selector: "span[style*='background-color:#aa0aa0']", color: "#aa0aa0" },
  { name: "脸部无码", value: 12, selector: "span[style*='background-color:#ff8c00']", color: "#ff8c00" },
  { name: "下身无码", value: 11, selector: "span[style*='background-color:#0000ff']", color: "#0000ff" },
  { name: "全身无码", value: 10, selector: "span[style*='background-color:#46d5ff']", color: "#46d5ff" },
  { name: "口罩/面具等", value: 9, selector: "span[style*='background-color:#6a3906']", color: "#6a3906" },
];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "kamept",
  name: "KamePT",
  schema: "NexusPHP",
  type: "private",
  urls: ["https://kamept.com/"],
  description: "主打二次元同人AV的站点",
  tags: ["成人", "COS", "动漫", "音乐", "影视"],
  collaborator: ["NekoCH"],

  category: [
    {
      name: "搜索入口",
      key: "url",
      options: [
        { name: "种子区", value: "/torrents.php" },
        { name: "特别区", value: "/special.php" },
      ],
      cross: false,
      generateRequestConfig: (selectedCategories) => {
        const ret = { requestConfig: { url: selectedCategories, params: {} } };
        return ret as IAdvancedSearchRequestConfig;
      },
    },
    {
      name: "分类（种子区）",
      key: "cat_torrents",
      notes: "请先设置搜索入口为“种子区”！请勿与特别区类别同时选择！",
      options: [
        { name: "同人AV", value: 410 },
        { name: "男娘", value: 413 },
        { name: "VR同人", value: 414 },
        { name: "Cosplay套图", value: 417 },
        { name: "里番", value: 419 },
        { name: "2D动画", value: 411 },
        { name: "3D动画", value: 423 },
        { name: "画师CG", value: 433 },
        { name: "同人志", value: 435 },
        { name: "单行本", value: 424 },
        { name: "游戏", value: 415 },
        { name: "中文游戏", value: 418 },
        { name: "游戏CG", value: 434 },
        { name: "音乐", value: 437 },
        { name: "外语音声", value: 420 },
        { name: "中文音声", value: 421 },
        { name: "视频音声", value: 422 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "分类（特别区）",
      key: "cat_special",
      notes: "请先设置搜索入口为“特别区”！请勿与种子区类别同时选择！",
      options: [
        { name: "动画", value: 425 },
        { name: "电影", value: 426 },
        { name: "电视剧", value: 427 },
        { name: "视频", value: 429 },
        { name: "书籍", value: 430 },
        { name: "软件", value: 431 },
        { name: "卡组", value: 432 },
        { name: "模型", value: 436 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "马赛克",
      key: "source",
      options: [
        { name: "全身无码", value: 1 },
        { name: "下体无码", value: 2 },
        { name: "脸部无码", value: 3 },
        { name: "全身有码", value: 4 },
        { name: "不漏点软色情", value: 7 },
        { name: "Other", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "中文字幕",
      key: "team",
      options: [{ name: "中文字幕", value: 1 }],
      cross: { mode: "append" },
    },
    {
      name: "原始语言",
      key: "medium",
      options: [
        { name: "中文", value: 1 },
        { name: "粤语", value: 12 },
        { name: "日语（日本語）", value: 2 },
        { name: "俄语（Россия）", value: 3 },
        { name: "德语（Deutsch）", value: 7 },
        { name: "英语（English）", value: 4 },
        { name: "意大利语（Italiano）", value: 5 },
        { name: "西班牙语（Español）", value: 6 },
        { name: "韩语（한국어）", value: 11 },
        { name: "印尼语（Bahasa Indonesia）", value: 9 },
        { name: "印地语（हिन्दी）", value: 10 },
        { name: "法语（français）", value: 8 },
        { name: "其他（other）", value: 13 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "处理",
      key: "processing",
      options: [
        { name: "同人", value: 2 },
        { name: "官方", value: 1 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "标签",
      key: "tag_id",
      options: allCustomTags,
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      subTitle: {
        ...SchemaMetadata.search!.selectors!.subTitle!,
        elementProcess: subTitleRemoveExtraElement(["a, span, img"], true),
      },
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
      tags: [...SchemaMetadata.search!.selectors!.tags!, ...allCustomTags],
    },
  },

  searchEntry: {
    area_torrents: { name: "种子区", requestConfig: { url: "/torrents.php" } },
    area_special: { name: "特别区", requestConfig: { url: "/special.php" } },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: `新用户的默认级别；可以在做种/下载/发布的时候选择匿名模式； 可以发送邀请；User 及以上用户封存账号后不会被删除。`,
    },
    {
      id: 2,
      name: "Power User",
      interval: "P4W",
      downloaded: 50 * GB,
      ratio: 1.05,
      seedingPoints: 40000,
      privilege:
        '可以直接发布种子；可以查看用户列表；可以请求续种； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以进入论坛的“PT交流区”板块；可以删除自己上传的字幕。',
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: 120 * GB,
      ratio: 1.55,
      seedingPoints: 80000,
      privilege: "",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: 300 * GB,
      ratio: 2.05,
      seedingPoints: 150000,
      privilege: "可以在魔力商店购买永久邀请。",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P25W",
      downloaded: 500 * GB,
      ratio: 2.55,
      seedingPoints: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P40W",
      downloaded: 750 * GB,
      ratio: 3.05,
      seedingPoints: 400000,
      privilege: "得到两个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P60W",
      downloaded: 1 * TB,
      ratio: 3.55,
      seedingPoints: 600000,
      privilege: "得到两个邀请名额；可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: 1.5 * TB,
      ratio: 4.05,
      seedingPoints: 800000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: 3 * TB,
      ratio: 4.55,
      seedingPoints: 1000000,
      privilege: "得到十个邀请名额。",
    },
    {
      id: 100,
      name: "贵宾",
      groupType: "vip",
      privilege: "和Nexus Master拥有相同权限并被认为是精英成员。免除自动降级。",
    },
    {
      id: 101,
      name: "养老族",
      groupType: "vip",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 200,
      name: "发布员",
      groupType: "manager",
      privilege: "专注的发布者。免除自动降级；可以查看匿名用户的真实身份。",
    },
    {
      id: 201,
      name: "总版主",
      groupType: "manager",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；" +
        "可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；可以查看用户的邀请记录；" +
        "可以管理用户帐号的一般信息。不能管理友情链接、最近消息、论坛版块；不能将种子设为置顶或促销；不能删除账号。",
    },
    {
      id: 202,
      name: "管理员",
      groupType: "manager",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 203,
      name: "维护开发员",
      groupType: "manager",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 204,
      name: "主管",
      groupType: "manager",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};
