import { ISiteMetadata } from "@ptd/site";
import NexusPHP, { CategoryInclbookmarked, CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,

  id: "ilolicon",
  name: "ilolicon",
  tags: ["成人", "综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "NexusPHP",

  collaborator: ["haowenwu"],

  urls: ["uggcf://funer.vybyvpba.pbz/"],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      id: {
        selector: ["a[href*='userdetails.php'][class*='Name']:first", "a[href*='userdetails.php']:first"],
        attr: "href",
        filters: [{ name: "querystring", args: ["uuid"] }],
      },
    },
    process: [
      {
        requestConfig: { url: "/index.php", responseType: "document" },
        fields: ["id", "name"],
      },
      {
        requestConfig: { url: "/userdetails.php", responseType: "document" },
        assertion: { id: "params.uuid" },
        fields: [
          "messageCount",
          "uploaded",
          "trueUploaded",
          "downloaded",
          "trueDownloaded",
          "levelName",
          "bonus",
          "seedingBonus",
          "joinTime",
          "seeding",
          "seedingSize",
          "hnrUnsatisfied",
          "hnrPreWarning",
        ],
      },
      {
        requestConfig: { url: "/mybonus.php", responseType: "document" },
        fields: ["bonusPerHour"],
      },
    ],
  },
  levelRequirements: [
    {
      id: 1,
      name: "初级魔法少女",
      privilege: '可以更新过期的外部信息 如IMDb信息 可以在特别区上传种子',
    },
    {
      id: 2,
      name: "有点经验的魔法少女",
      interval: "P5W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingPoints: 50000,
      privilege: '可以发布趣味盒内容 可以在综合区上传种子',
    },
    {
      id: 3,
      name: "高级魔法少女",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingPoints: 200000,
    },
    {
      id: 4,
      name: "疯狂魔法少女",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingPoints: 400000,
      privilege: "封存账号后不会被删除",
    },
    {
      id: 5,
      name: "超级疯狂的魔法少女",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingPoints: 688888,
    },
    {
      id: 6,
      name: "经验丰富的魔法少女",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingPoints: 1011000,
      privilege: "永远保留账号",
    },
    {
      id: 7,
      name: "极限魔法少女",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingPoints: 1500000,
      privilege: "允许使用个性条 可以查看NFO文档",
    },
    {
      id: 8,
      name: "终极魔法少女",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingPoints: 2000000,
      privilege: "可以请求续种 得到一个邀请名额",
    },
    {
      id: 9,
      name: "Lolicon",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingPoints: 3000000,
      privilege: "可以查看种子结构 得到两个邀请名额",
    },
  ],
};

export default class ilolicon extends NexusPHP {
  protected override async requestUserSeedingPage(userId: number, type: string = "seeding"): Promise<string | null> {
    const { data } = await this.request<string>({
      url: "/getusertorrentlistajax.php",
      params: { useruuid: userId, type },
    });
    return data || null;
  }
}
