import { createDocument, ETorrentStatus, ISiteMetadata, IUserInfo } from "@ptd/site";
import NexusPHP, { SchemaMetadata } from "@ptd/site/schemas/NexusPHP.ts";
import { mergeWith } from "es-toolkit";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hdtime",
  name: "HDTime",
  description: "HDTime, time to forever!",
  tags: ["影视", "综合"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://hdtime.org/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 401, name: "电影" },
        { value: 424, name: "Blu-Ray原盘" },
        { value: 402, name: "剧集" },
        { value: 403, name: "综艺" },
        { value: 405, name: "动漫" },
        { value: 414, name: "软件" },
        { value: 407, name: "体育" },
        { value: 404, name: "纪录片" },
        { value: 406, name: "MV" },
        { value: 408, name: "音乐" },
        { value: 410, name: "游戏" },
        { value: 411, name: "文档" },
        { value: 409, name: "其他" },
      ],
      cross: { mode: "append" },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      progress: {
        selector: ["div[title*='seeding']", "div[title*='inactivity']"],
        attr: "title",
        switchFilters: {
          "div[title*='seeding']": [() => 100],
          "div[title*='inactivity']": [{ name: "split", args: [" ", 1] }, { name: "parseNumber" }],
        },
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: ["table.torrentname"],
        case: {
          "div[title*='seeding']": ETorrentStatus.seeding,
          "div[title*='inactivity']": ETorrentStatus.inactive,
        },
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "感冒(Power User)",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege:
        "得到一个邀请名额；可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请；" +
        ' 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 2,
      name: "发热(Elite User)",
      interval: "P8W",
      downloaded: "150GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "低烧(Crazy User)",
      interval: "P15W",
      downloaded: "500GB",
      ratio: 2.05,
      seedingBonus: 150000,
      privilege: "得到两个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "中烧(Insane User)",
      interval: "P25W",
      downloaded: "750GB",
      ratio: 2.55,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "高烧(Veteran User)",
      interval: "P40W",
      downloaded: "1.5TB",
      ratio: 3.05,
      seedingBonus: 400000,
      privilege:
        "免除增量考核；得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "烧糊涂(Extreme User)",
      interval: "P60W",
      downloaded: "3TB",
      ratio: 3.55,
      seedingBonus: 600000,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "走火入魔(Ultimate User)",
      interval: "P80W",
      downloaded: "5TB",
      ratio: 4.05,
      seedingBonus: 800000,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 8,
      name: "骨灰(HDtime Master)",
      interval: "P100W",
      downloaded: "10TB",
      ratio: 4.55,
      seedingBonus: 1000000,
      privilege: "得到十个邀请名额。",
    },
  ],
};

export default class Hdtime extends NexusPHP {
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
        selector: ["div:has(b):contains('总大小')"],
        filters: [{ name: "parseSize" }],
      });
    }

    flushUserInfo = mergeWith(flushUserInfo, seedStatus, (objValue, srcValue) => {
      return typeof srcValue === "undefined" ? objValue : srcValue;
    });

    return flushUserInfo;
  }
}
