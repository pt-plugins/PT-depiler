import type { IAdvancedSearchRequestConfig, ISiteMetadata } from "../types";
import { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "redleaves",
  name: "红叶",
  aka: ["RedLeaves"],
  description:
    "红叶成立于2022年10月，主打有声小说，有综合区。目前站内设立有声官组,资源产出稳定。喜欢有声内容的朋友，欢迎你的加入！",
  tags: ["有声书", "综合", "影视", "游戏"],

  type: "private",
  schema: "NexusPHP",

  urls: ["aHR0cHM6Ly9sZWF2ZXMucmVkLw=="],

  collaborator: ["CosmoGao", "tedzhu", "hui-shao"],

  category: [
    {
      name: "搜索入口",
      key: "url",
      options: [
        { name: "影视区", value: "/torrents.php" },
        { name: "有声区", value: "/special.php" },
        { name: "游戏区", value: "/games.php" },
      ],
      cross: false,
      generateRequestConfig: (selectedCategories) => {
        const ret = { requestConfig: { url: selectedCategories, params: {} } };
        return ret as IAdvancedSearchRequestConfig;
      },
    },
    {
      name: "类别（影视区）",
      key: "cat_torrents", // 不能重复，仅作为标识
      notes: "请先设置搜索入口为“影视区”！请勿与其它区同时选择！",
      options: [
        { name: "电影 (Movie)", value: 401 },
        { name: "TV Series (剧集)", value: 402 },
        { name: "TV Shows (电视节目)", value: 403 },
        { name: "Documentaries (纪实)", value: 404 },
        { name: "Animations (动画)", value: 405 },
        { name: "Music Videos (音乐录影带)", value: 406 },
        { name: "Sports (竞技体育)", value: 407 },
        { name: "HQ Audio (高清音频/音乐)", value: 408 },
        { name: "Misc (杂项/软件/其他)", value: 409 },
        { name: "Playlet (短剧)", value: 439 },
      ],
      cross: { mode: "append", key: "cat" }, // 覆盖掉已定义的 key
    },
    {
      name: "分辨率（影视区）",
      key: "standard",
      notes: "请先设置搜索入口为“影视区”！请勿与其它区同时选择！",
      options: [
        { name: "8K", value: 6 },
        { name: "4K", value: 5 },
        { name: "1080p", value: 1 },
        { name: "1080i", value: 2 },
        { name: "720p", value: 3 },
        { name: "SD", value: 4 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "类别（有声区）",
      key: "cat_special",
      notes: "请先设置搜索入口为“有声区”！请勿与其它区同时选择！",
      options: [
        { name: "传统戏曲 (Traditional Opera)", value: 427 },
        { name: "学习考试 (Edu/Exam)", value: 426 },
        { name: "耽美百合 (LGBT-related)", value: 425 },
        { name: "外语读物 (Non-Chinese)", value: 424 },
        { name: "相声评书 (Crosstalk)", value: 410 },
        { name: "电台节目 (Radio Shows)", value: 411 },
        { name: "言情小说 (Romance)", value: 421 },
        { name: "文学出版 (Literature/Published)", value: 422 },
        { name: "历史军事 (History/Military)", value: 413 },
        { name: "灵异悬疑 (Mystery/Supernatural)", value: 417 },
        { name: "游戏竞技 (Game/Sports)", value: 418 },
        { name: "轻小说 (Light Novel)", value: 419 },
        { name: "二次元 (ACGN)", value: 420 },
        { name: "都市娱乐 (Urban/Metropolis)", value: 415 },
        { name: "武侠仙侠 (Wuxia/Xianxia)", value: 414 },
        { name: "科幻末日 (SciFi)", value: 416 },
        { name: "合集大包(Package)", value: 423 },
        { name: "奇幻玄幻 (Xuanhuan/Fantasy)", value: 412 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "类别（游戏区）",
      key: "cat_games",
      notes: "请先设置搜索入口为“游戏区”！请勿与其它区同时选择！",
      options: [
        { name: "动作 (Action)", value: 428 },
        { name: "格斗 (Fighting)", value: 429 },
        { name: "音乐 (Music)", value: 430 },
        { name: "平台 (Platform)", value: 431 },
        { name: "射击 (Shooting)", value: 432 },
        { name: "体育 (Sports)", value: 433 },
        { name: "策略 (Strategy)", value: 434 },
        { name: "角色扮演 (RPG)", value: 436 },
        { name: "冒险 (AVG)", value: 437 },
        { name: "模拟 (Simulation)", value: 438 },
        { name: "其他 (Others)", value: 435 },
      ],
      cross: { mode: "append", key: "cat" },
    },
    {
      name: "标签",
      key: "tag",
      options: [
        { name: "官方", value: 3 },
        { name: "自购", value: 8 },
        { name: "首发", value: 2 },
        { name: "DIY", value: 4 },
        { name: "国语", value: 5 },
        { name: "中字", value: 6 },
        { name: "驻站", value: 28 },
        { name: "已刮削", value: 12 },
        { name: "粤语", value: 18 },
        { name: "原创", value: 16 },
        { name: "儿童", value: 13 },
        { name: "ASMR", value: 11 },
        { name: "多播", value: 10 },
        { name: "AI演讲", value: 9 },
      ],
      cross: false, // 不允许多选
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  searchEntry: {
    area_all: { name: "全部", requestConfig: { url: "/search.php" } },
    area_torrents: { name: "影视", requestConfig: { url: "/torrents.php" }, enabled: false },
    area_special: { name: "有声", requestConfig: { url: "/special.php" }, enabled: false },
    area_games: { name: "游戏", requestConfig: { url: "/games.php" }, enabled: false },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      name: {
        selector: "a[href*='userdetails.php'][class*='Name']:first > b",
        elementProcess: (element) => {
          return (element.firstChild.textContent || "").trim();
        },
      },
    },
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
      downloaded: "100GB",
      ratio: 1.05,
      seedingBonus: 60000,
      privilege: "首次升级PU将获得1个邀请",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P8W",
      downloaded: "200GB",
      ratio: 1.55,
      seedingBonus: 120000,
      privilege: "Elite User及以上等级用户封存账号（在控制面板）后不会被禁用账号",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "400GB",
      ratio: 2.05,
      seedingBonus: 200000,
      privilege: "首次升级CU将获得2个邀请",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P25W",
      downloaded: "800GB",
      ratio: 2.55,
      seedingBonus: 400000,
      privilege: "",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "1600GB",
      ratio: 3.05,
      seedingBonus: 600000,
      privilege: "Veteran User及以上等级的用户可免除不活跃封禁；首次升级VU将获得3个邀请",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "2400GB",
      ratio: 3.55,
      seedingBonus: 800000,
      privilege: "",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "3200GB",
      ratio: 4.05,
      seedingBonus: 1000000,
      privilege: "首次升级UU将获得5邀请",
    },
    {
      id: 9,
      name: "四川简州猫 NEXUS MASTER",
      interval: "P100W",
      downloaded: "4000GB",
      ratio: 4.55,
      seedingBonus: 2000000,
      privilege: "首次升级NM将获得10个邀请",
    },
  ],
};
