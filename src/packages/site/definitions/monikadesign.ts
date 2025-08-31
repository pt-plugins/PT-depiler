import { EResultParseStatus, type ISiteMetadata, type ITorrent, type IUserInfo } from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "monikadesign",
  version: 1,
  name: "Monikadesign",
  aka: ["MDU", "莫妮卡"],
  tags: ["动漫"],
  timezoneOffset: "+0800",
  collaborator: ["Rhilip"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://zbavxnqrfvta.hx/"],

  category: [
    {
      name: "类别",
      key: "categories",
      options: [
        { name: "Anime TV", value: 8 },
        { name: "Anime Movie", value: 6 },
        { name: "TV", value: 2 },
        { name: "Movie", value: 1 },
        { name: "Music of TV", value: 9 },
        { name: "Music of Movie", value: 3 },
        { name: "Anime Live", value: 7 },
        { name: "Action Live", value: 5 },
        { name: "Game", value: 4 },
      ],
      cross: { mode: "brackets" }, // 站点构造为 &categories[0]=8&categories[1]=6，但实际上与 &categories[]= 相同
    },
    {
      name: "规格",
      key: "types",
      options: [
        { name: "Full Disc", value: 1 },
        { name: "Remux", value: 2 },
        { name: "Encode", value: 3 },
        { name: "WEB-DL", value: 4 },
        { name: "WEBRip", value: 5 },
        { name: "HDTV", value: 6 },
        { name: "ALBUM", value: 7 },
        { name: "SINGLE", value: 14 },
        { name: "OST", value: 15 },
        { name: "DRAMA", value: 16 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutions",
      options: [
        { name: "4320p", value: 1 },
        { name: "2160p", value: 2 },
        { name: "1080p", value: 3 },
        { name: "1080i", value: 4 },
        { name: "720p", value: 5 },
        { name: "576p", value: 6 },
        { name: "576i", value: 7 },
        { name: "480p", value: 8 },
        { name: "480i", value: 9 },
        { name: "Other", value: 10 },
        { name: "Lossless", value: 11 },
        { name: "Hi-Res", value: 12 },
        { name: "Lossy", value: 13 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "题材类型",
      key: "genres",
      options: [
        { name: "科幻 & 奇幻", value: 10765 },
        { name: "战争 & 政治", value: 10768 },
        { name: "儿童", value: 10762 },
        { name: "冒险", value: 12 },
        { name: "剧情", value: 18 },
        { name: "动作", value: 28 },
        { name: "动作冒险", value: 10759 },
        { name: "动画", value: 16 },
        { name: "历史", value: 36 },
        { name: "喜剧", value: 35 },
        { name: "奇幻", value: 14 },
        { name: "家庭", value: 10751 },
        { name: "恐怖", value: 27 },
        { name: "悬疑", value: 9648 },
        { name: "惊悚", value: 53 },
        { name: "战争", value: 10752 },
        { name: "新闻", value: 10763 },
        { name: "爱情", value: 10749 },
        { name: "犯罪", value: 80 },
        { name: "电视电影", value: 10770 },
        { name: "真人秀", value: 10764 },
        { name: "科幻", value: 878 },
        { name: "纪录片", value: 99 },
        { name: "肥皂剧", value: 10766 },
        { name: "脱口秀", value: 10767 },
        { name: "西部片", value: 37 },
        { name: "音乐", value: 10402 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "优惠",
      key: "free",
      options: [
        { name: "0% Free", value: 0 },
        { name: "25% Free", value: 25 },
        { name: "50% Free", value: 50 },
        { name: "75% Free", value: 75 },
        { name: "100% Free", value: 100 },
        { name: "双倍上传", value: "doubleup" }, // 双倍上传
        { name: "精选", value: "featured" }, // 精选
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params: Record<string, any> = { free: [] };
        (selectedOptions as Array<number | string>).forEach((value) => {
          if (value === "doubleup" || value === "featured") {
            params[value] = 1; // 双倍上传和精选使用 1 来表示
          } else {
            params.free.push(value); // 其他优惠使用 free 数组
          }
        });
        return { requestConfig: { params } };
      },
    },
    {
      name: "标签",
      key: "tags",
      options: [
        { name: "禁止转载", value: "exclusive" },
        { name: "附字幕", value: "subtitleIncluded" },
        { name: "附扫图", value: "scansIncluded" },
        { name: "附 CD", value: "cdsIncluded" },
      ],
      cross: { mode: "append", key: "" }, //  站点构造为  &exclusive=true ，但实际上与  &exclusive=1 相同
    },
    {
      name: "额外",
      key: "extra",
      options: [
        { name: "内部组", value: "internal" },
        { name: "个人原创", value: "personalRelease" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "其它",
      key: "misc",
      options: [{ name: "已收藏", value: "bookmarked" }],
      cross: { mode: "append", key: "" },
    },
    {
      name: "健康度",
      key: "health",
      options: [
        { name: "活种", value: "alive" },
        { name: "急需保种", value: "dying" },
        { name: "死种", value: "dead" },
      ],
      cross: { mode: "append", key: "" },
    },
  ],
  search: {
    ...SchemaMetadata.search,
    requestConfig: {
      url: "/torrents",
      params: {
        perPage: 100,
      },
    },
    keywordPath: "params.name",
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            config.params.imdbId = config.params.name;
            delete config.params.name;
          }
          return config!;
        },
      },
      bangumi: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            config.params.bgmId = config.params.name;
            delete config.params.name;
          }

          return config!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      subTitle: { selector: ["span.torrent-listings-subhead"] },
      time: { selector: ["td.torrent-listings-age > span"], data: "originalTitle", filters: [{ name: "parseTime" }] },
      size: { selector: ["td.torrent-listings-size > span"], filters: [{ name: "parseSize" }] },
      author: { selector: ["span.torrent-listings-uploader"] },
      category: {
        selector: ["td.torrent-listings-format"],
        filters: [{ name: "split", args: ["\t", 0] }],
      },
      completed: { selector: ['a[href*="/history"] > span.text-orange'] },
      comments: { text: "N/A" },
      ext_bangumi: { selector: ['a[href*="bangumi.tv/subject"]'], attr: "href", filters: [{ name: "extBangumiId" }] },
      tags: [
        { selector: "span.torrent-listings-subtitle_tag", name: "中字" },
        { selector: "span.torrent-listings-hot", name: "热门" },
        { selector: "span.torrent-listings-cd", name: "附 CD" },
        { selector: "span.torrent-listings-sd", name: "附扫图" },
        { selector: "span.torrent-listings-freeleech", name: "Free" },
      ],
    },
  },

  list: [
    {
      urlPattern: ["/torrents(?:/?$|\\?\[\^/\]*$)"],
    },
  ],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        selector: ["li.ratio-bar__points a:has( > i.fa-coins)"],
        filters: [{ name: "parseNumber" }],
      },
      uploads: {
        selector: ['div.container div.block div.text-center a[href*="/uploads"]'],
        filters: [{ name: "parseNumber" }],
      },
      // "/users/$user.name$/bonus/transactions/create
      bonusPerHour: {
        selector: ["aside .panelV2 dd:nth-child(6)"],
        filters: [(query: string) => parseFloat(query.replace(/,/g, "") || "0")],
      },
    },
  },

  // TODO userInfo 中的 averageSeedingTime, hnrUnsatisfied 等其他字段

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户默认等级;可以正常下载/上传，访问论坛",
    },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB",
      interval: "P1M",
      privilege: "访问邀请区",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "2TiB",
      interval: "P2M",
      privilege: "访问邀请区",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "5TiB",
      interval: "P3M",
      privilege: "自动通过候选 调整隐私设置 访问邀请区",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "10TiB",
      interval: "P6M",
      privilege: "自动通过候选 调整隐私设置 访问邀请区",
    },
    {
      id: 6,
      name: "Veteran",
      uploaded: "15TiB",
      interval: "P12M",
      privilege: "个人全局双倍上传 自动通过候选 调整隐私设置 访问邀请区",
    },
    {
      id: 7,
      name: "Seeder",
      groupType: "user",
      seedingSize: "3TiB",
      interval: "P1M",
      averageSeedingTime: "P30D",
      privilege: "自动通过候选 调整隐私设置 访问邀请区",
    },
    {
      id: 8,
      name: "Archivist",
      seedingSize: "10TiB",
      interval: "P3M",
      averageSeedingTime: "P60D",
      privilege: "个人全局双倍上传 自动通过候选 调整隐私设置 访问邀请区",
    },
  ],
};

export default class MonikaDesign extends Unit3D {
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo = await super.getUserInfoResult(lastUserInfo);
    let userName = flushUserInfo?.name;
    if (flushUserInfo?.status === EResultParseStatus.success && userName) {
      // 获取时魔
      flushUserInfo.bonusPerHour = await this.getBonusPerHourFromBonusTransactionsPage(userName);
    }
    return flushUserInfo;
  }

  protected async getBonusPerHourFromBonusTransactionsPage(userName: string): Promise<string> {
    const { data: document } = await this.request<Document>(
      {
        url: `/users/${userName}/bonus/transactions/create`,
        responseType: "document",
      },
      true,
    );
    return this.getFieldData(document, this.metadata.userInfo?.selectors?.bonusPerHour!);
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const downloadLink = await super.getTorrentDownloadLink(torrent);
    if (downloadLink && !downloadLink.includes("/download/")) {
      const { data: detailDocument } = await this.request<Document>({
        url: downloadLink,
        responseType: "document",
      });
      return this.getFieldData(detailDocument, this.metadata.search?.selectors?.link!);
    }

    return downloadLink;
  }
}
