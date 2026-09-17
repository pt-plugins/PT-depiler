/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/keepfriends.yml
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/pt.keepfrds.com/config.json
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/keepfrds.json
 * @PTMDefinitions https://github.com/JustLookAtNow/pt_mate/blob/master/assets/sites/frds.json
 */
import { get } from "es-toolkit/compat";

import { type ISiteMetadata, type IUserInfo } from "../types";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  SchemaMetadata,
  subTitleRemoveExtraElement,
} from "../schemas/NexusPHP.ts";

/**
 * /api/userdetails.php 返回的 `user.class` 为 NexusPHP 的 UC_* 数字常量，
 * 这里将其映射为站点 levelRequirements 中对应的等级 id 与等级名称。
 */
const userClassMap: Record<number, { id: number; name: string }> = {
  0: { id: 0, name: "Peasant" }, // UC_PEASANT 待定/降级用户
  1: { id: 1, name: "User" }, // UC_USER
  2: { id: 2, name: "Power User" }, // UC_POWER_USER
  3: { id: 3, name: "Elite User" }, // UC_ELITE_USER
  4: { id: 4, name: "Crazy User" }, // UC_CRAZY_USER
  5: { id: 5, name: "Insane User" }, // UC_INSANE_USER
  6: { id: 6, name: "Veteran User" }, // UC_VETERAN_USER
  7: { id: 7, name: "Extreme User" }, // UC_EXTREME_USER
  8: { id: 8, name: "Ultimate User" }, // UC_ULTIMATE_USER
  9: { id: 9, name: "Nexus Master" }, // UC_NEXUS_MASTER
  10: { id: 100, name: "贵宾" }, // UC_VIP
  11: { id: 200, name: "养老族" }, // UC_RETIREE
  12: { id: 201, name: "发布员" }, // UC_UPLOADER
  13: { id: 202, name: "总版主" }, // UC_MODERATOR
  14: { id: 203, name: "管理员" }, // UC_ADMINISTRATOR
  15: { id: 204, name: "维护开发员" }, // UC_SYSOP
  16: { id: 205, name: "主管" }, // UC_STAFFLEADER
};

const getLevelIdFromClass = (userClass: number): number => userClassMap[userClass]?.id ?? userClass;

const getLevelNameFromClass = (userClass: number): string => userClassMap[userClass]?.name ?? String(userClass);

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "keepfrds",
  name: "PT@KEEPFRDS",
  aka: ["FRDS", "朋友"],
  description: "KEEP FRIENDS 专注于小而美的分享，给大家带来更多更优的视听体验。 Let us keep friends forever!",
  tags: ["影视", "综合"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.keepfrds.com/"],
  favicon: "https://pt.keepfrds.com/static/favicon-64x64.png",

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { name: "电影", value: 401 },
        { name: "纪录片-传记", value: 404 },
        { name: "动画", value: 405 },
        { name: "剧集", value: 402 },
        { name: "综艺", value: 403 },
        { name: "舞台", value: 421 },
        { name: "演唱会-音乐剧", value: 420 },
        { name: "音乐短片(MV)", value: 406 },
        { name: "偶像", value: 424 },
        { name: "音乐", value: 408 },
        { name: "体育", value: 407 },
        { name: "有声读物", value: 415 },
        { name: "电子书", value: 414 },
        { name: "游戏", value: 423 },
        { name: "软件", value: 422 },
        { name: "🍆", value: 419 },
        { name: "其他", value: 409 },
        { name: "鲨鱼", value: 425 },
        { name: "回收站", value: 300 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "来源",
      key: "source",
      options: [
        { name: "UHD Blu-ray", value: 10 },
        { name: "Blu-ray", value: 1 },
        { name: "HD DVD", value: 2 },
        { name: "HDTV", value: 4 },
        { name: "Web-DL", value: 7 },
        { name: "Web-Rip", value: 8 },
        { name: "DVD", value: 3 },
        { name: "TV", value: 5 },
        { name: "OST-Soundtrack", value: 11 },
        { name: "M(Album-EP)", value: 13 },
        { name: "M(Single)", value: 14 },
        { name: "Other", value: 6 },
        { name: "UNK1", value: 0 },
        { name: "UNK2", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "HEVC Dolby Vision", value: 14 },
        { name: "HEVC HDR10+", value: 13 },
        { name: "HEVC HDR10", value: 12 },
        { name: "HEVC 10bit", value: 11 },
        { name: "HEVC", value: 10 },
        { name: "AV1", value: 15 },
        { name: "VP9", value: 16 },
        { name: "VC-1", value: 2 },
        { name: "AVC", value: 3 },
        { name: "MPEG-2", value: 4 },
        { name: "AVS", value: 17 },
        { name: "Other", value: 5 },
        { name: "M(FLAC)", value: 19 },
        { name: "M(DDPJOC)", value: 20 },
        { name: "UNK0", value: 0 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "2160p(4k)", value: 7 },
        { name: "1080p", value: 1 },
        { name: "1080i", value: 2 },
        { name: "720p", value: 3 },
        { name: "480p", value: 5 },
        { name: "8K", value: 8 },
        { name: "UNK0", value: 0 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "FRDS", value: 6 },
        { name: "cXcY@FRDS", value: 3 },
        { name: "Yumi@FRDS", value: 10 },
        { name: "Lonely@FRDS", value: 14 },
        { name: "AJ@FRDS", value: 12 },
        { name: "DalekW@FRDS", value: 8 },
        { name: "greenotea@FRDS", value: 9 },
        { name: "FRDSBypassCD", value: 17 },
        { name: "cfandora", value: 15 },
        { name: "搬运", value: 11 },
        { name: "UNK0", value: 0 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    {
      name: "促销种子？",
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
        { name: "中性种子(NL)", value: 8 },
      ],
      cross: false,
    },
    CategoryInclbookmarked,
    {
      name: "下载状态",
      key: "option-torrents",
      options: [
        { name: "全部", value: 0 },
        { name: "我下载过的", value: 1 },
        { name: "正在做种的", value: 3 },
        { name: "正在下载的", value: 5 },
        { name: "未下载过的", value: 6 },
        { name: "未完成的", value: 7 },
        { name: "已完成的", value: 9 },
        { name: "我发布的", value: 10 },
      ],
      cross: false,
    },
  ],

  officialGroupPattern: [/-FRDS|@FRDS/i],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      subTitle: {
        selector: ["a[href*='hit'][title]", "a[href*='hit']:has(b)"],
        // 处理类似以下 尾部中括号的情况
        // The Invisible Man 2020 Bluray 1080p x265 10bit 2Audios DDP 7.1 MNHD-FRDS[ ] [限时禁转]
        elementProcess: subTitleRemoveExtraElement(["b"], true),
      },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { selector: "td.embedded b > font.recommended:contains('禁转')", name: "Excl.", color: "red" },
      ],
    },
  },

  detail: {
    ...SchemaMetadata.detail,
    selectors: {
      ...SchemaMetadata.detail!.selectors,
      link: {
        selector: "input#download_link",
        attr: "value",
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      messageCount: {
        text: 0,
        selector: ["a[href*='messages.php'] b span[style*='color: red']"],
      },
      bonusPerHour: {
        selector: ["#info_block #perBonus", "#perBonus"],
        filters: [{ name: "parseNumber" }],
      },
    },
    process: [
      {
        /**
         * 新版站点提供 /api/userdetails.php 接口（JSON），返回核心用户数据：
         * {
         *   version: number,
         *   user: { id, username, class, joinedAt, uploadedBytes, downloadedBytes, bonus },
         *   torrentStats: { seeding, seedingBytes, leeching, uploaded, updatedAt }
         * }
         */
        requestConfig: { url: "/api/userdetails.php", responseType: "json" },
        // uploads 会命中基类 `parseUserInfoFor${PascalCase(key)}` 的动态分发，故用 fields 触发该字段
        fields: ["uploads"],
        selectors: {
          id: { selector: "user.id" },
          name: { selector: "user.username" },
          levelId: { selector: "user.class", filters: [getLevelIdFromClass] },
          levelName: { selector: "user.class", filters: [getLevelNameFromClass] },
          joinTime: { selector: "user.joinedAt", filters: [{ name: "parseTime" }] },
          uploaded: { selector: "user.uploadedBytes" },
          downloaded: { selector: "user.downloadedBytes" },
          bonus: { selector: "user.bonus" },
          seeding: { selector: "torrentStats.seeding" },
          seedingSize: { selector: "torrentStats.seedingBytes" },
          leeching: { selector: "torrentStats.leeching" },
        },
      },
      {
        // API 未提供的字段，仍从网页获取
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "messageCount",
          "trueUploaded",
          "trueDownloaded",
          "bonusPerHour", // 使用我们自定义的 selector 和 filter
          "lastAccessAt",
        ],
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: `新用户的默认级别。可以查看NFO文档；`,
    },
    {
      id: 2,
      name: "Power User",
      interval: "P5W",
      downloaded: "50GB",
      ratio: 1.0,
      bonus: 3200,
      privilege: "请求续种；查看排行榜；查看其它用户的种子历史；查看IMDB/Douban信息；使用魔力值",
    },
    {
      id: 3,
      name: "Elite User",
      interval: "P10W",
      downloaded: "150GB",
      ratio: 1.5,
      bonus: 19200,
      privilege: "封存账号后不会被删除；查看排行榜，IMDB/Douban Top榜单和论坛的邀请区",
    },
    {
      id: 4,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.0,
      bonus: 76800,
      privilege: "在做种/下载的时候选择匿名模式；使用自动合集功能",
    },
    {
      id: 5,
      name: "Insane User",
      interval: "P30W",
      downloaded: "500GB",
      ratio: 2.5,
      bonus: 256000,
      privilege: "查看普通日志",
    },
    {
      id: 6,
      name: "Veteran User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.5,
      bonus: 640000,
      isKept: true,
      privilege: "查看其它用户的评论、帖子历史；永远保留账号",
    },
    {
      id: 7,
      name: "Extreme User",
      interval: "P90W",
      downloaded: "2TB",
      ratio: 4.0,
      bonus: 1280000,
      isKept: true,
      privilege: "上传量按照等级对应的限速计算",
    },
    {
      id: 8,
      name: "Ultimate User",
      interval: "P120W",
      downloaded: "3TB",
      ratio: 4.5,
      bonus: 1920000,
      isKept: true,
      privilege: "上传速度限制提升为普通用户的二倍",
    },
    {
      id: 9,
      name: "Nexus Master",
      interval: "P150W",
      downloaded: "4TB",
      ratio: 5,
      bonus: 2560000,
      isKept: true,
      privilege: "除了数据考核要求，其他权利等同于VIP，包括没有上传速度的限制",
    },
    {
      id: 100,
      name: "贵宾",
      groupType: "vip",
      privilege: "为 FRDS 做出过卓越贡献的精英成员。免除自动降级。",
    },
    {
      id: 200,
      name: "养老族",
      groupType: "manager",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 201,
      name: "发布员",
      groupType: "manager",
      privilege: "专注的发布者。可以查看匿名用户的真实身份。",
    },
    {
      id: 202,
      name: "总版主",
      groupType: "manager",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；" +
        "可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；" +
        "可以查看用户的邀请记录；可以管理用户帐号的一般信息。不能管理友情链接、最近消息、论坛版块；" +
        "不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 203,
      name: "管理员",
      groupType: "manager",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 204,
      name: "维护开发员",
      groupType: "manager",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 205,
      name: "主管",
      groupType: "manager",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};

export default class Keepfrds extends NexusPHP {
  protected override guessSearchFieldIndexConfig(): Record<string, string[]> {
    return {
      author: ['a[href*="sort=9"]'], // 发布者
      comments: ["div.famfamfam-silk.comments"], // 评论数
      completed: ["div.famfamfam-silk.tick"], // 完成数
      leechers: ["div.famfamfam-silk.arrow_down"], // 下载数
      seeders: ["div.famfamfam-silk.arrow_up"], // 种子数
      size: ["div.famfamfam-silk.cd"], // 大小
      time: ["div.famfamfam-silk.date"], // 发布时间 （仅生成 selector， 后面会覆盖）
    };
  }

  /**
   * 新版站点已移除 getusertorrentlistajax.php 接口，做种数据改由 /api/userdetails.php 提供。
   * 覆写基类的回退逻辑，避免请求已失效的接口导致用户信息更新失败。
   */
  protected override async parseUserInfoForSeedingStatus(
    flushUserInfo: Partial<IUserInfo>,
  ): Promise<Partial<IUserInfo>> {
    return flushUserInfo; // seeding / seedingSize 由 API 提供
  }

  /**
   * 字段 uploads 会命中 AbstractPrivateSite 中 `parseUserInfoFor${PascalCase(key)}` 的动态分发
   * （第二个参数即为该步骤的响应体），因此这里直接从 /api/userdetails.php 的 JSON 中读取发布数，
   * 而不是走选择器；同时对于基类的回退调用（无响应体）保持空操作，避免请求已失效的接口。
   */
  protected override async parseUserInfoForUploads(
    flushUserInfo: Partial<IUserInfo>,
    dataDocument?: object,
  ): Promise<Partial<IUserInfo>> {
    const uploads = get(dataDocument, "torrentStats.uploaded");
    if (typeof uploads !== "undefined") {
      flushUserInfo.uploads = Number(uploads);
    }
    return flushUserInfo;
  }
}
