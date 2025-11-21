import { ETorrentStatus, type ISiteMetadata, IUserInfo } from "../types";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "../schemas/NexusPHP.ts";
import { parseValidTimeString } from "../utils";
import Sizzle from "sizzle";

const hhLinkQuery = {
  selector: ['a[href*="download.php?id="]'],
  attr: "href",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hhanclub",
  name: "憨憨",
  aka: ["憨憨"],
  tags: ["电影", "电视剧"],
  timezoneOffset: "+0800",

  collaborator: ["zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://uunapyho.gbc/"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "其他", value: 409 },
        { name: "体育", value: 407 },
        { name: "综艺", value: 403 },
        { name: "电视剧", value: 402 },
        { name: "动漫", value: 405 },
        { name: "纪录片", value: 404 },
        { name: "电影", value: 401 },
        { name: "短剧", value: 412 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "来源",
      key: "source",
      options: [
        { name: "UHD Blu-ray", value: 7 },
        { name: "Blu-ray", value: 1 },
        { name: "WEB-DL", value: 2 },
        { name: "DVD", value: 3 },
        { name: "HDTV", value: 4 },
        { name: "TV", value: 5 },
        { name: "Other", value: 6 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "UHD Blu-ray", value: 11 },
        { name: "FHD Blu-ray", value: 1 },
        { name: "UHD REMUX", value: 2 },
        { name: "Remux", value: 3 },
        { name: "Encode", value: 7 },
        { name: "WEB-DL", value: 10 },
        { name: "HDTV", value: 5 },
        { name: "DVDR", value: 6 },
        { name: "CD", value: 8 },
        { name: "Track", value: 9 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "HEVC/H265/x265", value: 6 },
        { name: "AVC/H264/x264", value: 1 },
        { name: "VC-1", value: 2 },
        { name: "MPEG-2", value: 4 },
        { name: "VP8/9", value: 7 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "4320p/8K", value: 6 },
        { name: "2160p/4K", value: 1 },
        { name: "1080p", value: 2 },
        { name: "1080i", value: 4 },
        { name: "720p", value: 3 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "处理",
      key: "processing",
      options: [
        { name: "美剧", value: 3 },
        { name: "日剧", value: 4 },
        { name: "韩剧", value: 5 },
        { name: "港剧", value: 6 },
        { name: "台剧", value: 7 },
        { name: "大陆剧", value: 8 },
        { name: "英剧", value: 9 },
        { name: "其他", value: 10 },
      ],
      cross: { mode: "brackets" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      rows: { selector: ".torrent-table-sub-info" },
      link: hhLinkQuery,
      url: {
        ...hhLinkQuery,
        filters: [
          { name: "querystring", args: ["id"] },
          { name: "prepend", args: ["/details.php?id="] },
        ],
      },
      id: {
        ...hhLinkQuery,
        filters: [{ name: "querystring", args: ["id"] }],
      },
      title: {
        selector: [".torrent-title a[href^='details.php']"],
      },
      subTitle: {
        selector: [".torrent-title .torrent-info-text-small_name"],
      },
      time: { selector: ".torrent-info-text-added", ...SchemaMetadata.search!.selectors!.time! },
      size: { selector: ".torrent-info-text-size", filters: [{ name: "parseSize" }] },
      author: { selector: ".torrent-info-text-author" },
      seeders: { selector: ".torrent-info-text-seeders" },
      leechers: { selector: ".torrent-info-text-leechers" },
      completed: { selector: ".torrent-info-text-finished" },
      progress: {
        selector: [
          '.torrent-title div[title^="leeching"]',
          '.torrent-title [title^="seeding"]',
          '.torrent-title div[title^="inactivity"]',
        ],
        attr: "title",
        filters: [{ name: "parseNumber" }],
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: [
          '.torrent-title div[title^="leeching"]',
          '.torrent-title [title^="seeding"]',
          '.torrent-title div[title^="inactivity"]',
        ],
        attr: "title",
        filters: [
          (title: string) => {
            if (title.includes("leeching")) return ETorrentStatus.downloading;
            if (title.includes("seeding")) return ETorrentStatus.seeding;
            if (title.includes("inactivity")) {
              return title.includes("100%") ? ETorrentStatus.completed : ETorrentStatus.inactive;
            }
            return ETorrentStatus.unknown;
          },
        ],
      },
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { name: "Free", selector: "span.promotion-tag-free", color: "blue" },
        { name: "官方", selector: "a[href*='tag_id3=1']", color: "#0000ff" },
        { name: "完结", selector: "a[href*='tag_id17=1']", color: "#4682B4" },
        { name: "原创", selector: "a[href*='tag_id8=1']", color: "#ff3300" },
        { name: "禁转", selector: "a[href*='tag_id1=1']", color: "#990000" },
        { name: "首发", selector: "a[href*='tag_id2=1']", color: "#009900" },
        { name: "国语", selector: "a[href*='tag_id5=1']", color: "#FF6699" },
        { name: "粤语", selector: "a[href*='tag_id10=1']", color: "#FF9999" },
        { name: "中字", selector: "a[href*='tag_id6=1']", color: "#99CC00" },
        { name: "特效", selector: "a[href*='tag_id14=1']", color: "#FF0099" },
        { name: "DIY", selector: "a[href*='tag_id11=1']", color: "#6633CC" },
        { name: "杜比视界", selector: "a[href*='tag_id12=1']", color: "#0066FF" },
        { name: "应求", selector: "a[href*='tag_id15=1']", color: "#FF6633" },
        { name: "转载", selector: "a[href*='tag_id18=1']", color: "#FF6633" },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      uploaded: {
        selector: ["span:contains('上传量') + span"],
        filters: [{ name: "parseSize" }],
      },
      trueUploaded: {
        selector: ["span:contains('实际上传量') + span"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ["span:contains('下载量') + span"],
        filters: [{ name: "parseSize" }],
      },
      trueDownloaded: {
        selector: ["span:contains('实际下载量') + span"],
        filters: [{ name: "parseSize" }],
      },
      levelName: {
        selector: "a[href*='userdetails.php'][class*='_Name']:first",
        attr: "class",
        filters: [
          (query: string) => {
            return query.match(/(.*)_Name/)![1];
          },
        ],
      },
      bonus: {
        selector: ["span:contains('憨豆') + div"],
        filters: [{ name: "parseNumber" }],
      },
      seedingBonus: {
        selector: ["span:contains('做种积分') + span"],
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        selector: ["span:contains('加入日期') + span"],
        filters: [
          (query: string) => {
            query = query.split(" (")[0];
            return parseValidTimeString(query);
          },
        ],
      },
      bonusPerHour: {
        selector: [".grid .row-span-4"],
        filters: [{ name: "parseNumber" }],
      },
      seedingBonusPerHour: {
        selector: [
          "div:contains('你当前每小时能获取'):last",
          "div:contains('You are currently getting'):last",
          "div:contains('你當前每小時能獲取'):last",
        ],
        filters: [{ name: "parseNumber" }],
      },
      lastAccessAt: {
        selector: ["span:contains('最近动向') + span"],
        filters: [
          (query: string) => {
            query = query.split(" (")[0];
            return parseValidTimeString(query);
          },
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "憨头憨脑 User",
      privilege: "新用户的默认级别",
    },
    {
      id: 1,
      name: "憨声憨气 Power User",
      seedingBonus: 80000,
      downloaded: "50GB",
      ratio: 1.05,
      privilege: "访问音乐区、论坛邀请区",
    },
    {
      id: 2,
      name: "憨态可掬 Elite User",
      interval: "P8W",
      seedingBonus: 150000,
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "-",
    },
    {
      id: 3,
      name: "明姿憨憨 Crazy User",
      interval: "P15W",
      seedingBonus: 300000,
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "裝憨打呆 Insane User",
      interval: "P25W",
      seedingBonus: 500000,
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "-",
    },
    {
      id: 5,
      name: "憨状可掬 Veteran User",
      interval: "P40W",
      seedingBonus: 900000,
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户封存账号后不会被删除。",
    },
    {
      id: 6,
      name: "憨痴可人 Extreme User",
      interval: "P60W",
      seedingBonus: 1100000,
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "可以更新过期的外部信息。",
    },
    {
      id: 7,
      name: "憨笑如花 Ultimate User",
      interval: "P80W",
      seedingBonus: 1300000,
      downloaded: "1.5TB",
      ratio: 4.05,
      privilege: "得到一个邀请名额。Ultimate User及以上用户会永远保留账号。",
    },
    {
      id: 8,
      name: "满面娇憨 Nexus Master",
      interval: "P100W",
      seedingBonus: 1500000,
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "得到两个邀请名额。",
    },
  ],
};
export default class Hhanclub extends NexusPHP {
  // 使用基础憨豆+保种区额外做种积分作为seedingBonusPerHour
  protected async parseUserInfoForSeedingBonusPerHour(
    flushUserInfo: Partial<IUserInfo>,
    dataDocument: Document,
  ): Promise<Partial<IUserInfo>> {
    // 从mybonus.php 页面，解析出 用户每小时获得憨豆无加成的部分 数值
    const baseSeedingBonusPerHour = this.getFieldData(
      dataDocument,
      this.metadata.userInfo?.selectors?.seedingBonusPerHour!,
    );

    // 请求保重区结算日志页面，并解析出最近一次结算时获得的积分 数值
    let rescueDocument = await this.getRescueDocument(flushUserInfo.id as number);
    // 如果有分页，从最后一页获取
    const totalPages = Sizzle("table + div b", rescueDocument);
    if (totalPages.length > 0) {
      rescueDocument = await this.getRescueDocument(
        flushUserInfo.id as number,
        parseInt(totalPages[totalPages.length - 1].textContent || "1") - 1,
      );
    }
    const rescueSeedingBonusPerDay = this.getFieldData(rescueDocument, {
      selector: ["table tbody tr:last-child > td:nth-of-type(6)"],
      filters: [{ name: "parseNumber" }],
    });
    // 加和计算真实的 总做种积分 数值
    flushUserInfo.seedingBonusPerHour = baseSeedingBonusPerHour + rescueSeedingBonusPerDay / 24;
    return flushUserInfo;
  }

  private async getRescueDocument(userId: number, page: number = 0): Promise<Document> {
    const { data: rescueDocument } = await this.request<Document>({
      url: "/rescuesettleinfo.php",
      params: { id: userId, page },
      responseType: "document",
    });
    return rescueDocument;
  }
}
