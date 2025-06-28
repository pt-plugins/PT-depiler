import Sizzle from "sizzle";
import { mergeWith } from "es-toolkit";
import { ETorrentStatus, type ISiteMetadata, type IUserInfo } from "../types";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "../schemas/NexusPHP.ts";
import { createDocument, parseSizeString, rot13, tryToNumber } from "../utils";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "audiences",
  name: "Audiences",
  aka: ["观众", "人人人"],
  description: "观众",
  tags: ["综合", "影视", "音乐", "电子书", "有声书", "体育", "游戏"],
  timezoneOffset: "+0800",

  collaborator: ["hui-shao"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://nhqvraprf.zr/"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "电影 (Movie)", value: 401 },
        { name: "剧集 (TV Series)", value: 402 },
        { name: "综艺 (TV Show)", value: 403 },
        { name: "纪录片 (Documentary)", value: 406 },
        { name: "有声书 (Audiobook)", value: 404 },
        { name: "电子书 (E-Book)", value: 405 },
        { name: "音乐 (Music)", value: 408 },
        { name: "体育 (Sport)", value: 407 },
        { name: "游戏 (Game)", value: 410 },
        { name: "教学 (Study)", value: 412 },
        { name: "其它 (Other)", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "UHD Blu-ray 原盘", value: 12 },
        { name: "UHD Blu-ray DIY", value: 13 },
        { name: "Blu-ray 原盘", value: 1 },
        { name: "Blu-ray DIY", value: 14 },
        { name: "REMUX", value: 3 },
        { name: "Encode", value: 15 },
        { name: "HDTV", value: 5 },
        { name: "WEB-DL", value: 10 },
        { name: "DVD 原盘", value: 2 },
        { name: "CD", value: 8 },
        { name: "Track", value: 9 },
        { name: "Other", value: 11 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "Audies", value: 19 },
        { name: "ADE", value: 21 },
        { name: "ADWeb", value: 20 },
        { name: "ADAudio", value: 23 },
        { name: "ADeBook", value: 24 },
        { name: "ADMusic", value: 25 },
        { name: "Other", value: 5 },
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

      title: {
        selector: ["a[href*='details.php?id='][title]:first"],
      },
      subTitle: {
        selector: ["td.embedded > span:last"],
      },
      progress: {
        selector: ['div[class^="torrents-progress"][style*="width"]:first'],
        elementProcess: (element: HTMLElement) => {
          const elementStyle = element.getAttribute("style") || "";
          const widthMatch = elementStyle.match(/width:([ \d.]+)%/);
          return widthMatch && widthMatch.length >= 2 ? parseFloat(widthMatch[1]) : 0;
        },
      },
      status: {
        selector: ['div[class^="torrents-progress"][style*="width"]:first'],
        elementProcess: (element: HTMLElement) => {
          if (element.classList.contains("torrents-progress2")) {
            const widthMatch = (element.getAttribute("style") || "").match(/width:([ \d.]+)%/);
            const progress = widthMatch && widthMatch.length >= 2 ? parseFloat(widthMatch[1]) : 0;
            return progress >= 100 ? ETorrentStatus.completed : ETorrentStatus.inactive;
          } else if (element.classList.contains("torrents-progress")) {
            const widthMatch = (element.getAttribute("style") || "").match(/width:([ \d.]+)%/);
            const progress = widthMatch && widthMatch.length >= 2 ? parseFloat(widthMatch[1]) : 0;
            return progress >= 100 ? ETorrentStatus.seeding : ETorrentStatus.downloading;
          } else {
            return ETorrentStatus.unknown;
          }
        },
      },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { name: "官方", selector: "span.tags.tgf", color: "#06c" },
        { name: "原创", selector: "span.tags.tyc", color: "#085" },
        { name: "国语", selector: "span.tags.tgy", color: "#f96" },
        { name: "粤语", selector: "span.tags.tyc", color: "#f66" },
        { name: "中字", selector: "span.tags.tzz", color: "#9c0" },
        { name: "官字组", selector: "span.tags.tgz", color: "#530" },
        { name: "DIY", selector: "span.tags.tdiy", color: "#993" },
        { name: "动画", selector: "span.tags.tdh", color: "#f596aa" },
        { name: "完结", selector: "span.tags.twj", color: "#4382ff" },
        { name: "Dolby Vision", selector: "span.tags.tdb", color: "#358" },
        { name: "HDR10", selector: "span.tags.thdr10", color: "#9a3" },
        { name: "HDR10+", selector: "span.tags.thdrm", color: "#9b5" },
        { name: "禁转", selector: "span.tags.tjz", color: "#903" },
        { name: "限转", selector: "span.tags.txz", color: "#c03" },
        { name: "首发", selector: "span.tags.tsf", color: "#339" },
        { name: "应求", selector: "span.tags.tyq", color: "#f90" },
        { name: "零魔", selector: "span.tags.tm0", color: "#096" },
        { name: "MV", selector: "span.tags.tmv", color: "turquoise" },
        { name: "卡拉OK", selector: "span.tags.tok", color: "#ff3f33" },
        { name: "LIVE现场", selector: "span.tags.tlive", color: "#ff46ed" },
        { name: "演唱会", selector: "span.tags.tconcert", color: "#3b64ff" },
        { name: "音乐专辑", selector: "span.tags.tyzj", color: "#87007e" },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        selector: ["td.rowhead:contains('爆米花') + td, td.rowhead:contains('Karma Points') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "小鬼当家(User)",
      privilege: "新用户的默认级别；可以请求续种。",
    },
    {
      id: 1,
      name: "年轻气盛(Power User)",
      interval: "P5W",
      downloaded: "120GB",
      ratio: 2.0,
      seedingBonus: 100000,
      privilege:
        '可以查看NFO文档；可以查看用户列表； 可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕；发布10种通过候选后可直接发布种子。',
    },
    {
      id: 2,
      name: "江湖儿女(Elite User)",
      interval: "P15W",
      downloaded: "240GB",
      ratio: 2.5,
      seedingBonus: 200000,
      privilege: "同年轻气盛(Power User)",
    },
    {
      id: 3,
      name: "街头霸王(Crazy User)",
      interval: "P24W",
      downloaded: "400GB",
      ratio: 3.0,
      seedingBonus: 400000,
      privilege: "可以查看排行榜。",
    },
    {
      id: 4,
      name: "步履不停(Insane User)",
      interval: "P40W",
      downloaded: "600GB",
      ratio: 3.5,
      seedingBonus: 640000,
      privilege: "同街头霸王(Crazy User)",
    },
    {
      id: 5,
      name: "杰出公民(Veteran User)",
      interval: "P60W",
      downloaded: "1024GB",
      ratio: 4.0,
      seedingBonus: 880000,
      privilege: "可以查看其它用户的评论、帖子历史。",
    },
    {
      id: 6,
      name: "头号玩家(Extreme User)",
      interval: "P80W",
      downloaded: "2048GB",
      ratio: 4.5,
      seedingBonus: 1200000,
      privilege: "可以更新过期的外部信息。头号玩家(Extreme User)及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "一代宗师(Ultimate User)",
      interval: "P100W",
      downloaded: "4096GB",
      ratio: 5.0,
      seedingBonus: 1500000,
      privilege: "同头号玩家(Extreme User)",
    },
    {
      id: 8,
      name: "教父(Nexus Master)",
      interval: "P112W",
      downloaded: "8192GB",
      ratio: 6.0,
      seedingBonus: 1800000,
      privilege: "同一代宗师(Ultimate User)",
    },
    {
      id: 9,
      name: "彩虹照耀(Rainbow)",
      interval: "P128W",
      downloaded: "10240GB",
      ratio: 8.0,
      seedingBonus: 2400000,
      privilege:
        "保持等级期间会显示彩虹ID，做种积分要求逐年增加（具体数值以通知为准），彩虹照耀(Rainbow)用户未到更新后的要求会被降级",
    },
  ],
};

export default class Audiences extends NexusPHP {
  protected override async requestUserSeedingPage(userId: number, type: string = "seeding"): Promise<string | null> {
    const { data } = await this.request<string>({
      url: "/getusertorrentlistajax.php",
      params: { userid: userId, type },
      headers: {
        Referer: rot13("uggcf://nhqvraprf.zr/hfreqrgnvyf.cuc"), // 不提供 Referer，无法获取到数据
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

    if (data && data?.includes("<table")) {
      const userSeedingPage = createDocument(data);
      const trAnothers = Sizzle("table:first tr:contains('Total')", userSeedingPage as Document);
      if (trAnothers.length > 0) {
        const tds = trAnothers[0].getElementsByTagName("td");
        seedStatus.seeding = tryToNumber(tds[1].innerText.trim());
        seedStatus.seedingSize = parseSizeString(tds[2].innerText.trim());
      }
    }

    flushUserInfo = mergeWith(flushUserInfo, seedStatus, (objValue, srcValue) => {
      return typeof srcValue === "undefined" ? objValue : srcValue;
    });

    return flushUserInfo;
  }
}
