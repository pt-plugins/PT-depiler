import { type ISiteMetadata, type IUserInfo } from "../types";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "../schemas/NexusPHP.ts";
import { createDocument, definedFilters, rot13 } from "@ptd/site";
import Sizzle from "sizzle";
import { mergeWith } from "es-toolkit";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "azusa",
  name: "梓喵",
  aka: ["梓喵"],
  tags: ["漫画", "轻小说", "Galgame", "画集"],
  timezoneOffset: "+0800",

  collaborator: ["zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://nmhfn.jvxv/"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "游戏", value: 404 },
        { name: "漫画", value: 402 },
        { name: "轻小说", value: 403 },
        { name: "CG", value: 407 },
        { name: "音乐", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "地区",
      key: "source",
      options: [
        { name: "欧美", value: 1 },
        { name: "韩国", value: 2 },
        { name: "大陆", value: 3 },
        { name: "香港", value: 4 },
        { name: "台湾", value: 5 },
        { name: "日本", value: 6 },
        { name: "其他", value: 7 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "来源",
      key: "medium",
      options: [
        { name: "东立电子", value: 16 },
        { name: "BW", value: 17 },
        { name: "TX", value: 18 },
        { name: "bili境外", value: 19 },
        { name: "bili", value: 20 },
        { name: "扫图", value: 21 },
        { name: "汉化", value: 22 },
        { name: "kobo", value: 23 },
        { name: "pubu", value: 24 },
        { name: "steam", value: 26 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分类",
      key: "codec",
      options: [
        { name: "杂志", value: 1 },
        { name: "耽美", value: 2 },
        { name: "百合", value: 3 },
        { name: "少女", value: 4 },
        { name: "少年", value: 5 },
        { name: "青年", value: 6 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "状态",
      key: "standard",
      options: [
        { name: "未完", value: 3 },
        { name: "完结", value: 4 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      seeders: { selector: "a[href*='seeders']" },
      leechers: { selector: "a[href*='leechers']" },
      completed: { selector: "a[href*='viewsnatches']" },
      comments: { selector: "a[href*='comments']" },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { name: "条漫", selector: "span:contains('条漫')", color: "#1892EC" },
        { name: "自购", selector: "span:contains('自购')", color: "#9400D3" },
        { name: "电子版", selector: "span:contains('电子版')", color: "#732E67" },
        { name: "官方中字", selector: "span:contains('官方中字')", color: "#22DDE3" },
        { name: "画集", selector: "span:contains('画集')", color: "#16EA19" },
        { name: "生肉", selector: "span:contains('生肉')", color: "#051535" },
        { name: "禁转", selector: "span:contains('禁转')", color: "#ff0000" },
        { name: "VOCALOID", selector: "span:contains('VOCALOID')", color: "#09E8F0" },
        { name: "全存档", selector: "span:contains('全存档')", color: "#0000ff" },
        { name: "日常", selector: "span:contains('日常')", color: "#46d5ff" },
        { name: "杂志", selector: "span:contains('杂志')", color: "#ECEC18" },
        { name: "应求", selector: "span:contains('应求')", color: "#E716EA" },
        { name: "校园", selector: "span:contains('校园')", color: "#38b03f" },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      name: {
        selector: ["a[href*='userdetails.php'][class*='Name']:first"],
        elementProcess: (element: HTMLElement) => {
          const iconRank = element.querySelector("i.icon-rank");
          if (iconRank) {
            return iconRank?.previousSibling?.textContent?.trim() || element?.textContent.trim();
          } else {
            return element?.textContent.trim();
          }
        },
      },
      bonusPerHour: {
        selector: ["#outer td[rowspan]"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      uploads: 1,
      downloaded: "50GB",
      ratio: 1.0,
      privilege:
        '可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")。',
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      uploads: 10,
      downloaded: "100GB",
      ratio: 2.0,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      uploads: 20,
      downloaded: "150GB",
      ratio: 3.0,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      uploads: 40,
      downloaded: "200GB",
      ratio: 4.0,
      privilege: "可以查看普通日志。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      uploads: 80,
      downloaded: "250GB",
      ratio: 5.0,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      uploads: 150,
      downloaded: "300GB",
      ratio: 6.0,
      privilege: "可以更新过期的外部信息。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      uploads: 150,
      downloaded: "350GB",
      ratio: 7.0,
      privilege: "",
    },
    { id: 8, name: "Nexus Master", interval: "P100W", uploads: 300, downloaded: "400GB", ratio: 8.0, privilege: "" },
  ],
};

export default class Azusa extends NexusPHP {
  // 获取做种、发种页面
  protected override async requestUserSeedingPage(userId: number, type: string = "seeding"): Promise<string | null> {
    const { data } = await this.request<string>({
      url: "/getusertorrentlist_ajax.php",
      params: { userid: userId, type },
      headers: {
        Referer: rot13("uggcf://nmhfn.jvxv/hfreqrgnvyf.cuc"), // 不提供 Referer，无法获取到数据
      },
    });
    return data || null;
  }

  // 获取做种信息
  protected override async parseUserInfoForSeedingStatus(
    flushUserInfo: Partial<IUserInfo>,
  ): Promise<Partial<IUserInfo>> {
    let seedStatus = { seeding: 0, seedingSize: 0 };

    const userId = flushUserInfo.id as number;
    const data = await this.requestUserSeedingPage(userId, "seeding");

    if (data && data?.includes("<b")) {
      const userSeedingPage = createDocument(`<div>${data}</div>`);
      const divSeeding = Sizzle("div:contains(' | ')", userSeedingPage);
      if (divSeeding.length > 0 && divSeeding[0].textContent) {
        const seedingText = divSeeding[0].textContent.split("|");
        seedStatus.seeding = definedFilters.parseNumber(seedingText[0]);
        seedStatus.seedingSize = definedFilters.parseSize(seedingText[1]);
      }
    }

    flushUserInfo = mergeWith(flushUserInfo, seedStatus, (objValue, srcValue) => {
      return typeof srcValue === "undefined" ? objValue : srcValue;
    });

    return flushUserInfo;
  }

  // 获取发种信息
  protected override async parseUserInfoForUploads(flushUserInfo: Partial<IUserInfo>): Promise<Partial<IUserInfo>> {
    flushUserInfo.uploads = 0;

    const userId = flushUserInfo.id as number;
    const data = await this.requestUserSeedingPage(userId, "uploaded");

    if (data && data?.includes("<b")) {
      const userSeedingPage = createDocument(`<div>${data}</div>`);
      const divSeeding = Sizzle("div:contains(' | ')", userSeedingPage);
      if (divSeeding.length > 0 && divSeeding[0].textContent) {
        const seedingText = divSeeding[0].textContent.split("|");
        flushUserInfo.uploads = definedFilters.parseNumber(seedingText[0]);
      }
    }
    return flushUserInfo;
  }
}
