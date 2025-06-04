import { merge, mergeWith } from "es-toolkit";
import { set } from "es-toolkit/compat";

import type { IAdvancedSearchRequestConfig, TSelectSearchCategoryValue, ISiteMetadata, IUserInfo } from "../types";
import { GB, TB, createDocument } from "../utils";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "../schemas/NexusPHP";

const levelRequirements: ISiteMetadata["levelRequirements"] = [
  {
    id: 0,
    groupType: "user",
    name: "Peasant(青蛙卵)",
    privilege: `因为分享率过低而被降级的用户。如果不在一定时间内提升分享率，账号会被禁用。`,
  },
  {
    id: 1,
    groupType: "user",
    name: "User(蝌蚪)",
    privilege: `新用户的默认级别。`,
  },
  {
    id: 2,
    groupType: "user",
    name: "Power User(幼蛙)",
    interval: "P5W",
    privilege: `得到1个邀请名额；拥有网站基本权限，请自行探索。`,
    alternative: [
      { seedingBonus: 40000, ratio: 1.0, uploads: 50 },
      { seedingBonus: 40000, ratio: [1.0, 4.0], downloaded: 150 * GB },
    ],
  },
  {
    id: 3,
    groupType: "user",
    name: "Elite User(成蛙)",
    interval: "P16W",
    privilege: `得到2个邀请名额；封存账号后不会被删除。`,
    alternative: [
      { seedingBonus: 70000, ratio: 1.0, uploads: 120 },
      { seedingBonus: 80000, ratio: [1.0, 4.5], downloaded: 300 * GB },
    ],
  },
  {
    id: 4,
    groupType: "user",
    name: "Crazy User(妙蛙种子)",
    interval: "P25W",
    privilege: "得到3个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    alternative: [
      { seedingBonus: 90000, ratio: 1.0, uploads: 200 },
      { seedingBonus: 160000, ratio: [1.0, 5.0], downloaded: 1 * TB },
    ],
  },
  {
    id: 5,
    groupType: "user",
    name: "Insane User(妙蛙草)",
    interval: "P36W",
    privilege: "得到3个邀请名额；可以查看普通日志。",
    alternative: [
      { seedingBonus: 150000, ratio: 1.0, uploads: 300 },
      { seedingBonus: 320000, ratio: [1.0, 5.5], downloaded: 2 * TB },
    ],
  },
  {
    id: 6,
    groupType: "user",
    name: "Veteran User(妙蛙花)",
    interval: "P52W",
    privilege: "得到4个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    alternative: [
      { seedingBonus: 200000, ratio: 1.0, uploads: 500 },
      { seedingBonus: 640000, ratio: [1.0, 6.0], downloaded: 4 * TB },
    ],
  },
  {
    id: 7,
    groupType: "user",
    name: "Extreme User(mega妙蛙花)",
    interval: "P60W",
    privilege: "得到4个邀请名额；可以更新过期的外部信息。",
    alternative: [
      { seedingBonus: 280000, ratio: 1.0, uploads: 650 },
      { seedingBonus: 1280000, ratio: [1.0, 6.5], downloaded: 8 * TB },
    ],
  },
  {
    id: 8,
    groupType: "user",
    name: "Ultimate User(极巨化妙蛙花)",
    interval: "P100W",
    privilege: "得到5个邀请名额。",
    alternative: [
      { seedingBonus: 400000, ratio: 1.0, uploads: 800 },
      { seedingBonus: 2560000, ratio: [1.0, 7.0], downloaded: 16 * TB },
    ],
  },
  {
    id: 99,
    groupType: "user",
    name: "SVIP(闪光妙蛙花)",
    privilege: "网站元老用户，和VIP权限完全相同，免除自动降级，但计算下载量。",
  },
  {
    id: 100,
    groupType: "vip",
    name: "VIP(贵宾)",
    privilege: "和SVIP权限完全相同，免除自动降级，且不计算下载量。",
  },
];

const category: ISiteMetadata["category"] = [
  {
    name: "类别",
    key: "cat",
    options: [
      { value: 401, name: "电影" },
      { value: 402, name: "剧集" },
      { value: 403, name: "综艺" },
      { value: 405, name: "动漫" },
      { value: 404, name: "纪录片" },
      { value: 406, name: "MV" },
      { value: 407, name: "体育" },
      { value: 408, name: "音乐" },
      { value: 412, name: "短剧" },
      { value: 409, name: "其他" },
    ],
    cross: { mode: "append" },
  },
  {
    name: "媒介",
    key: "source",
    options: [
      { value: 1, name: "UHD Blu-ray" },
      { value: 8, name: "Blu-ray" },
      { value: 9, name: "Remux" },
      { value: 10, name: "Encode" },
      { value: 7, name: "WEB-DL" },
      { value: 4, name: "HDTV" },
      { value: 2, name: "DVD" },
      { value: 3, name: "CD" },
      { value: 11, name: "MiniBD" },
      { value: 5, name: "Track" },
      { value: 6, name: "Other" },
    ],
    cross: { mode: "append" },
  },
  {
    name: "视频编码",
    key: "codec",
    options: [
      { value: 1, name: "H.264/AVC" },
      { value: 6, name: "H.265/HEVC" },
      { value: 2, name: "VC-1" },
      { value: 4, name: "MPEG-2" },
      { value: 7, name: "AV1" },
      { value: 3, name: "MPEG-4" },
      { value: 8, name: "VP9" },
      { value: 5, name: "Other" },
    ],
    cross: { mode: "append" },
  },
  {
    name: "音频编码",
    key: "audiocodec",
    options: [
      { value: 9, name: "DTS:X" },
      { value: 14, name: "DTS" },
      { value: 10, name: "DTS-HD MA" },
      { value: 21, name: "DTS-HD HRA" },
      { value: 11, name: "TrueHD Atmos" },
      { value: 12, name: "TrueHD" },
      { value: 13, name: "LPCM" },
      { value: 15, name: "DD/AC3" },
      { value: 1, name: "FLAC" },
      { value: 17, name: "AAC" },
      { value: 18, name: "APE" },
      { value: 19, name: "WAV" },
      { value: 4, name: "MP3" },
      { value: 8, name: "M4A" },
      { value: 20, name: "OPUS" },
      { value: 22, name: "AC3A" },
      { value: 7, name: "Other" },
    ],
    cross: { mode: "append" },
  },
  {
    name: "分辨率",
    key: "standard",
    options: [
      { value: 6, name: "8K/4320p" },
      { value: 7, name: "4K/2160p" },
      { value: 8, name: "2K/1440p" },
      { value: 1, name: "1080p" },
      { value: 2, name: "1080i" },
      { value: 3, name: "720p" },
      { value: 4, name: "SD" },
      { value: 5, name: "Other" },
    ],
    cross: { mode: "append" },
  },
  {
    name: "制作组",
    key: "team",
    options: [
      { value: 6, name: "FROG" },
      { value: 7, name: "FROGE" },
      { value: 8, name: "FROGWeb" },
      { value: 10, name: "CatEDU" },
      { value: 5, name: "Other" },
    ],
    cross: { mode: "append" },
  },
  {
    name: "标签",
    key: "tag",
    options: [
      { value: 3, name: "官方" },
      { value: 1, name: "禁转" },
      { value: 24, name: "零魔" },
      { value: 6, name: "中字" },
      { value: 20, name: "特效字幕" },
      { value: 5, name: "国语" },
      { value: 8, name: "粤语" },
      { value: 16, name: "分集" },
      { value: 14, name: "完结" },
      { value: 10, name: "跨季合集" },
      { value: 4, name: "DIY" },
      { value: 11, name: "原生原盘" },
      { value: 15, name: "Remux" },
      { value: 12, name: "杜比视界" },
      { value: 7, name: "HDR" },
      { value: 13, name: "HDR10+" },
      { value: 17, name: "儿童片" },
      { value: 2, name: "VCB-Studio" },
      { value: 9, name: "驻站" },
      { value: 23, name: "极危" },
      { value: 22, name: "濒危" },
      { value: 21, name: "易危" },
      { value: 18, name: "近危" },
    ],
    cross: { mode: "custom" },
    generateRequestConfig: (value: TSelectSearchCategoryValue): IAdvancedSearchRequestConfig => {
      const ret = { requestConfig: { params: {} } };
      (value as string[]).forEach((v) => {
        /**
         * Value Map
         * - 0: --
         * - 1: 有
         * - 2: 无
         */
        set(ret, `requestConfig.params.tagid_${v}`, 1);
      });
      return ret as IAdvancedSearchRequestConfig;
    },
  },
  CategoryIncldead,
  CategorySpstate,
  CategoryInclbookmarked,
  {
    name: "显示我的种子",
    key: "my",
    options: [
      { value: 0, name: "全部" },
      { value: 1, name: "未完成" },
      { value: 2, name: "已完成" },
      { value: 3, name: "下载过" },
      { value: 7, name: "未下载过" },
      { value: 4, name: "做种中" },
      { value: 5, name: "下载中" },
      { value: 8, name: "活动中" },
      { value: 9, name: "未活动" },
      { value: 6, name: "我发布的" },
    ],
    cross: false,
  },
  {
    name: "审核状态",
    key: "approval_status",
    options: [
      { value: "", name: "全部" },
      { value: 0, name: "未审" },
      { value: 1, name: "通过" },
      { value: 2, name: "拒绝" },
    ],
    cross: false,
  },
];

const { userInfo: schemaUserInfo = {} } = SchemaMetadata;
const userInfo: ISiteMetadata["userInfo"] = merge(schemaUserInfo, {
  selectors: {
    // "page": "/userdetails.php?id=$user.id$",
    bonus: {
      selector: ["td.rowhead:contains('蝌蚪') + td", "td.rowhead:contains('Karma'):contains('Points') + td"],
      filters: [
        (query: string) => {
          query = query.replace(/,/g, "");
          if (/(蝌蚪|Karma Points).+?([\d.]+)/.test(query)) {
            query = query.match(/(蝌蚪|Karma Points).+?([\d.]+)/)![2];
            return parseFloat(query);
          } else if (/[\d.]+/.test(query)) {
            return parseFloat(query.match(/[\d.]+/)![0]);
          }
          return query;
        },
      ],
    },
    // "page": "/mybonus.php",
    bonusPerHour: {
      selector: ["h1:contains('每小时获得的合计蝌蚪') + div > table tr:last td:last"],
      filters: [{ name: "parseNumber" }],
    },
  },
});

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "qingwa",
  name: "QingWa",
  aka: ["青蛙PT"],
  description: "慈善性质的非盈利的资源分享网站。",
  tags: ["综合", "影视", "动漫", "儿童区", "纪录片"],

  urls: [
    "ROT13:uggcf://jjj.dvatjncg.pbz/",
    "ROT13:uggcf://jjj.dvatjncg.bet/",
    "ROT13:uggcf://jjj.dvatjn.ceb/",
    "ROT13:uggcf://dvatjncg.pbz/", // 增加一个和ptpp中 host 一样的url （经过实测也能访问）
  ],
  collaborator: ["Eason Wong"],

  levelRequirements,
  category,
  userInfo,
};

export default class QingWa extends NexusPHP {
  protected override async parseUserInfoForSeedingStatus(
    flushUserInfo: Partial<IUserInfo>,
  ): Promise<Partial<IUserInfo>> {
    const userId = flushUserInfo.id as number;
    const userSeedingRequestString = await this.requestUserSeedingPage(userId);

    let seedStatus = { seeding: 0, seedingSize: 0 };
    if (userSeedingRequestString && userSeedingRequestString?.includes("<table")) {
      const userSeedingDocument = createDocument(userSeedingRequestString);
      seedStatus.seeding = this.getFieldData(userSeedingDocument, {
        selector: "b:first",
        filters: [{ name: "parseNumber" }],
      });

      seedStatus.seedingSize = this.getFieldData(userSeedingDocument, {
        selector: [
          "div:has(b):contains('总大小')",
          "div:has(b):contains('總大小')",
          "div:has(b):contains('Total size')",
        ],
        filters: [{ name: "parseSize" }],
      });
    }

    flushUserInfo = mergeWith(flushUserInfo, seedStatus, (objValue, srcValue) => {
      return typeof srcValue === "undefined" ? objValue : srcValue;
    });

    return flushUserInfo;
  }
}
