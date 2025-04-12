import {
  ETorrentStatus,
  IAdvancedSearchRequestConfig,
  ISiteMetadata,
  IUserInfo,
  TSelectSearchCategoryValue,
} from "@ptd/site";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "@ptd/site/schemas/NexusPHP.ts";
import { set } from "es-toolkit/compat";
import Sizzle from "sizzle";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "pter",
  name: "PTer",
  aka: ["PTerClub", "猫站"],
  description: "ＰＴ之友俱乐部",
  tags: ["影视", "综合"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pterclub.com/"],
  formerHosts: ["pter.club"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "电影 (Movie)", value: 401 },
        { name: "电视剧 (TV Series)", value: 404 },
        { name: "动画 (Animation)", value: 403 },
        { name: "综艺 (TV Show)", value: 405 },
        { name: "音乐短片 (MV)", value: 413 },
        { name: "音乐 (Music)", value: 406 },
        { name: "舞台演出 (Stage Performance)", value: 418 },
        { name: "纪录片 (Documentary)", value: 402 },
        { name: "体育 (Sport)", value: 407 },
        { name: "电子书 (E-Book)", value: 408 },
        { name: "游戏 (Game)", value: 409 },
        { name: "软件 (Software)", value: 410 },
        { name: "学习 (Study)", value: 411 },
        { name: "其它 (Other)", value: 412 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "质量",
      key: "source",
      options: [
        { name: "UHD Discs", value: 1 },
        { name: "BD Discs", value: 2 },
        { name: "Remux", value: 3 },
        { name: "HDTV", value: 4 },
        { name: "WEB-DL", value: 5 },
        { name: "Encode", value: 6 },
        { name: "DVD Discs", value: 7 },
        { name: "FLAC", value: 8 },
        { name: "WAV", value: 9 },
        { name: "ISO", value: 10 },
        { name: "PDF", value: 11 },
        { name: "PUB", value: 12 },
        { name: "AZW", value: 13 },
        { name: "MOBI", value: 14 },
        { name: "Other", value: 15 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "地区",
      key: "team",
      options: [
        { name: "大陆 (Mainland,CHN)", value: 1 },
        { name: "香港 (HKG,CHN)", value: 2 },
        { name: "台湾 (TWN,CHN)", value: 3 },
        { name: "欧美 (Western)", value: 4 },
        { name: "韩国 (KOR)", value: 5 },
        { name: "日本 (JPN)", value: 6 },
        { name: "印度 (IND)", value: 7 },
        { name: "其它 (Other)", value: 8 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "标签",
      key: "tag",
      options: [
        { name: "禁转", value: "exclusive" },
        { name: "官方", value: "internal" },
        { name: "国语", value: "mandarin" },
        { name: "粤语", value: "cantonese" },
        { name: "DIY原盘", value: "doityourself" },
        { name: "MV母盘", value: "master" },
        { name: "中字", value: "chinesesub" },
        { name: "英字", value: "englishsub" },
        { name: "应求", value: "fillrequest" },
        { name: "自购", value: "buyitmyself" },
        { name: "原创", value: "personalrip" },
        { name: "GAL", value: "gg" },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (value: TSelectSearchCategoryValue): IAdvancedSearchRequestConfig => {
        const ret = { requestConfig: { params: {} } };
        (value as string[]).forEach((v) => {
          set(ret, `requestConfig.params.tag_${v}`, "yes");
        });
        return ret as IAdvancedSearchRequestConfig;
      },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
    {
      name: "审核状态？",
      key: "check",
      options: [
        { name: "全部", value: "" },
        { name: "未处理", value: "unchecked" },
        { name: "已初审", value: "prechecked" },
        { name: "已审核", value: "checked" },
        { name: "待修改", value: "need_edit" },
      ],
      cross: false,
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors!,

      title: {
        selector: ["a[href*='details.php?id='][title]:first"],
      },
      subTitle: {
        selector: ["div > span:eq(0)"],
      },

      ext_imdb: { selector: ["a span[data-imdbid]:first"], data: "imdbid", filters: [{ name: "extImdbId" }] },
      ext_douban: { selector: ["a span[data-doubanid]:first"], data: "doubanid" },

      /**
       * <img class="progbargreen" src="pic/trans.gif" style="width: 98%;" alt="">  正在做种
       * <img class="progbarred" src="pic/trans.gif" style="width: 98%;" alt="">   已下载，未做种
       * <img class="progbarred" src="pic/trans.gif" style="width: 5.9407952394121%;" alt=""><img class="progbarrest" src="pic/trans.gif" style="width: 92.059204760588%;" alt="">   正在下载，需修正下载进度
       * <img class="progbarrest" src="pic/trans.gif" style="width: 98%;" alt="">  正在下载，但是无进度
       */
      progress: {
        selector: ['img[class^="progbar"][style*="width"]:first'],
        elementProcess: (element: HTMLElement) => {
          if (element.classList.contains("progbargreen")) {
            return 100;
          } else if (element.classList.contains("progbarred") || element.classList.contains("progbarred")) {
            const elementStyle = element.getAttribute("style") || "";
            const widthMatch = elementStyle.match(/width:([ \d.]+)%/);
            const progress =
              widthMatch && widthMatch.length >= 2 ? (parseFloat(widthMatch[1]) / 98) * 100 /* 修正下载进度 */ : 0;
            return element.classList.contains("progbarred") ? progress : 100 - progress; // 如果是 .progbarred 则代表已完成进度，而 .progbarred 则为未完成进度，取反
          } else {
            return 0;
          }
        },
      },
      status: {
        selector: ['img[class^="progbar"][style*="width"]:first'],
        elementProcess: (element: HTMLElement) => {
          if (element.classList.contains("progbargreen")) {
            return ETorrentStatus.seeding;
          } else if (element.classList.contains("progbarred") || element.classList.contains("progbarred")) {
            const widthMatch = (element.getAttribute("style") || "").match(/width:([ \d.]+)%/);
            const progress = widthMatch && widthMatch.length >= 2 ? (parseFloat(widthMatch[1]) / 98) * 100 : 0;
            const realProgress = element.classList.contains("progbarred") ? progress : 100 - progress;
            // FIXME 不能判断是否在下载状态，所以直接设成 inactive
            return realProgress >= 100 ? ETorrentStatus.completed : ETorrentStatus.inactive;
          } else {
            return ETorrentStatus.unknown;
          }
        },
      },

      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { name: "Excl.", selector: "a[href*='torrents.php?tag_exclusive=yes']", color: "red" },
        { name: "官方", selector: "a[href*='torrents.php?tag_internal=yes']", color: "blue" },
        { name: "国语", selector: "a[href*='torrents.php?tag_mandarin=yes']", color: "green" },
        { name: "粤语", selector: "a[href*='torrents.php?tag_cantonese=yes']", color: "purple" },
        { name: "中字", selector: "a[href*='torrents.php?tag_chinesesub=yes']", color: "orange" },
        { name: "英字", selector: "a[href*='torrents.php?tag_englishsub=yes']", color: "yellow" },
        { name: "应求", selector: "a[href*='torrents.php?tag_fillrequest=yes']", color: "pink" },
        { name: "DIY原盘", selector: "a[href*='torrents.php?tag_doityourself=yes']", color: "cyan" },
        { name: "原创", selector: "a[href*='torrents.php?tag_personalrip=yes']", color: "brown" },
        { name: "自购", selector: "a[href*='torrents.php?tag_buyitmyself=yes']", color: "teal" },
        { name: "MV母盘", selector: "a[href*='torrents.php?tag_master=yes']", color: "indigo" },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        selector: [
          "td.rowhead:contains('猫粮') + td, td.rowhead:contains('Karma Points') + td, td.rowhead:contains('貓糧') + td",
        ],
      },
      // 从顶端用户栏获取做种数量，这样就可以避免对 /getusertorrentlist.php 页面的请求
      seeding: {
        selector: ["#info_block a[href*='getusertorrentlist.php'][href*='type=seeding']"],
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        selector: [
          "td.rowhead:contains('做种大小') + td, td.rowhead:contains('Seeding Size') + td, td.rowhead:contains('做種大小') + td",
        ],
        filters: [{ name: "parseSize" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "加菲猫 POWER USER",
      interval: "P5W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 10000,
      uploads: 10,
      privilege: "可以直接发布种子；可以查看邀请区；可以上传字幕和删除自己上传的字幕",
    },
    {
      id: 2,
      name: "布偶猫 ELITE USER",
      interval: "P10W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 30000,
      uploads: 20,
      privilege: "可以请求续种",
    },
    {
      id: 3,
      name: "雪鞋猫 CRAZY USER",
      interval: "P24W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 80000,
      uploads: 30,
      privilege: "可以查看排行榜",
    },
    {
      id: 4,
      name: "暹罗猫 INSANE USER",
      interval: "P32W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 150000,
      uploads: 40,
      privilege: "可以查看普通日志",
    },
    {
      id: 5,
      name: "安哥拉猫 VETERAN USER",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      alternative: [
        { seedingBonus: 300000, uploads: 50 },
        { seedingBonus: 900000, uploads: 10 },
      ],
      privilege: "可以查看其它用户的评论、帖子历史；封存账号后，不会因不活跃原因被临时封禁",
    },
    {
      id: 6,
      name: "孟加拉猫 EXTREME USER",
      interval: "P48W",
      downloaded: "1024GB",
      ratio: 3.55,
      alternative: [
        { seedingBonus: 600000, uploads: 60 },
        { seedingBonus: 1800000, uploads: 10 },
      ],
      privilege: "可2次无条件不活跃解封，可以查看邀请树统计，初次升级赠送1枚永久邀请码",
    },
    {
      id: 7,
      name: "山东狮子猫 ULTIMATE USER",
      interval: "P56W",
      downloaded: "1536GB",
      ratio: 4.05,
      alternative: [
        { seedingBonus: 1200000, uploads: 70 },
        { seedingBonus: 3600000, uploads: 10 },
      ],
      privilege: "追加1次无条件不活跃解封，可以查看邀请树图，初次升级赠送2枚永久邀请码",
    },
    {
      id: 8,
      name: "四川简州猫 NEXUS MASTER",
      interval: "P112W",
      downloaded: "3072GB",
      ratio: 4.55,
      alternative: [
        { seedingBonus: 2400000, uploads: 100 },
        { seedingBonus: 9600000, uploads: 10 },
      ],
      privilege: "用户不会因不活跃原因被临时封禁，初次升级赠送3枚永久邀请码",
    },
  ],
};

export default class Pter extends NexusPHP {
  protected override async parseUserInfoForUploads(flushUserInfo: Partial<IUserInfo>): Promise<Partial<IUserInfo>> {
    const userName = flushUserInfo.name;
    const { data: userTorrentPage } = await this.request({
      url: "/torrents.php",
      params: { incldead: 0, spstate: 0, inclbookmarked: 0, search: userName, search_area: 3, search_mode: 3 },
      responseType: "document",
    });

    flushUserInfo.uploads = 0;
    if (userTorrentPage) {
      const trAnothers = Sizzle("table.torrents:last tr:not(:eq(0))", userTorrentPage as Document);
      flushUserInfo.uploads = trAnothers ? trAnothers.length : 0;
    }
    return flushUserInfo;
  }
}
