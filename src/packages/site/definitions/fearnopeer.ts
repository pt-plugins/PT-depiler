import { ETorrentStatus, EResultParseStatus, type ISiteMetadata, type IUserInfo } from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";
import { parseSizeString, parseValidTimeString } from "../utils";

const idTrans: string[] = ["User ID", "用户 ID", "用ID", "用户ID"];
const seedingSizeTrans: string[] = ["Seeding Size", "做种体积", "做種體積"];
const RatioTrans: string[] = ["Ratio", "分享率", "比率"];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "fearnopeer",
  version: 1,
  name: "FearNoPeer",
  aka: ["FNP"],
  tags: ["综合"],
  timezoneOffset: "-0500",
  collaborator: ["hyuan280"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://srneabcrre.pbz/"],

  category: [
    {
      name: "类别",
      key: "categories",
      options: [
        { name: "Movie", value: 1 },
        { name: "TV", value: 2 },
        { name: "Music", value: 3 },
        { name: "Anime", value: 6 },
        { name: "Games", value: 4 },
        { name: "Apps", value: 5 },
        { name: "Sport", value: 9 },
        { name: "Assorted", value: 11 },
      ],
      cross: { mode: "brackets" },
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
        { name: "SDTV", value: 18 },
        { name: "FLAC", value: 7 },
        { name: "MP3", value: 11 },
        { name: "Mac", value: 12 },
        { name: "Windows", value: 13 },
        { name: "Console", value: 17 },
        { name: "Books", value: 15 },
        { name: "AudioBooks", value: 14 },
        { name: "Misc", value: 16 },
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
        { name: "1080i", value: 11 },
        { name: "720p", value: 5 },
        { name: "576p", value: 6 },
        { name: "576i", value: 15 },
        { name: "480p", value: 8 },
        { name: "480i", value: 14 },
        { name: "Other", value: 10 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "题材",
      key: "genres",
      options: [
        { name: "Action", value: 28 },
        { name: "Action & Adventure", value: 10759 },
        { name: "Adventure", value: 12 },
        { name: "Animation", value: 16 },
        { name: "Comedy", value: 35 },
        { name: "Crime", value: 80 },
        { name: "Documentary", value: 99 },
        { name: "Drama", value: 18 },
        { name: "Family", value: 10751 },
        { name: "Fantasy", value: 14 },
        { name: "History", value: 36 },
        { name: "Horror", value: 27 },
        { name: "Kids", value: 10762 },
        { name: "Music", value: 10402 },
        { name: "Musical", value: 22 },
        { name: "Mystery", value: 9648 },
        { name: "News", value: 10763 },
        { name: "Reality", value: 10764 },
        { name: "Romance", value: 10749 },
        { name: "Sci-Fi & Fantasy", value: 10765 },
        { name: "Science Fiction", value: 878 },
        { name: "Soap", value: 10766 },
        { name: "Talk", value: 10767 },
        { name: "Thriller", value: 53 },
        { name: "TV Movie", value: 10770 },
        { name: "War", value: 10752 },
        { name: "War & Politics", value: 10768 },
        { name: "Western", value: 37 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "优惠",
      key: "free",
      options: [
        { name: "0% Freeleech", value: 0 },
        { name: "25% Freeleech", value: 25 },
        { name: "50% Freeleech", value: 50 },
        { name: "75% Freeleech", value: 75 },
        { name: "100% Freeleech", value: 100 },
        { name: "Double Upload", value: "doubleup" }, // 双倍上传
        { name: "Featured", value: "featured" }, // 精选
        { name: "Refundable", value: "refundable" }, //可退还的
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params: Record<string, any> = { free: [] };
        (selectedOptions as Array<number | string>).forEach((value) => {
          if (value === "doubleup" || value === "featured" || value === "refundable") {
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
        { name: "内部组", value: "internal" },
        { name: "个人发布", value: "personalRelease" },
        { name: "Trumpable", value: "trumpable" },
        { name: "高速", value: "highspeed" },
        { name: "收藏", value: "bookmarked" },
        { name: "想要", value: "wished" },
      ],
      cross: { mode: "append", key: "" }, //  站点构造为  &exclusive=true ，但实际上与  &exclusive=1 相同
    },
    {
      name: "活跃度",
      key: "health",
      options: [
        { name: "存活", value: "alive" },
        { name: "Dying", value: "dying" },
        { name: "Dead", value: "dead" },
        { name: "坟场", value: "graveyard" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "记录",
      key: "record",
      options: [
        { name: "Not Downloaded", value: "notDownloaded" },
        { name: "Downloaded", value: "downloaded" },
        { name: "Seeding", value: "seeding" },
        { name: "Leeching", value: "leeching" },
        { name: "Incomplete", value: "incomplete" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "Primary Language",
      key: "primaryLanguageNames",
      options: [
        { name: "ab", value: "ab" },
        { name: "af", value: "af" },
        { name: "am", value: "am" },
        { name: "ar", value: "ar" },
        { name: "as", value: "as" },
        { name: "az", value: "az" },
        { name: "bg", value: "bg" },
        { name: "bn", value: "bn" },
        { name: "bo", value: "bo" },
        { name: "bs", value: "bs" },
        { name: "ca", value: "ca" },
        { name: "cn", value: "cn" },
        { name: "cr", value: "cr" },
        { name: "cs", value: "cs" },
        { name: "cy", value: "cy" },
        { name: "da", value: "da" },
        { name: "de", value: "de" },
        { name: "dz", value: "dz" },
        { name: "el", value: "el" },
        { name: "en", value: "en" },
        { name: "eo", value: "eo" },
        { name: "es", value: "es" },
        { name: "et", value: "et" },
        { name: "eu", value: "eu" },
        { name: "fa", value: "fa" },
        { name: "ff", value: "ff" },
        { name: "fi", value: "fi" },
        { name: "fr", value: "fr" },
        { name: "ga", value: "ga" },
        { name: "gl", value: "gl" },
        { name: "gu", value: "gu" },
        { name: "he", value: "he" },
        { name: "hi", value: "hi" },
        { name: "hr", value: "hr" },
        { name: "ht", value: "ht" },
        { name: "hu", value: "hu" },
        { name: "hy", value: "hy" },
        { name: "id", value: "id" },
        { name: "ig", value: "ig" },
        { name: "is", value: "is" },
        { name: "it", value: "it" },
        { name: "iu", value: "iu" },
        { name: "ja", value: "ja" },
        { name: "ka", value: "ka" },
        { name: "kk", value: "kk" },
        { name: "kl", value: "kl" },
        { name: "km", value: "km" },
        { name: "kn", value: "kn" },
        { name: "ko", value: "ko" },
        { name: "ku", value: "ku" },
        { name: "ky", value: "ky" },
        { name: "la", value: "la" },
        { name: "lt", value: "lt" },
        { name: "lv", value: "lv" },
        { name: "mi", value: "mi" },
        { name: "mk", value: "mk" },
        { name: "ml", value: "ml" },
        { name: "mn", value: "mn" },
        { name: "mo", value: "mo" },
        { name: "mr", value: "mr" },
        { name: "ms", value: "ms" },
        { name: "mt", value: "mt" },
        { name: "nb", value: "nb" },
        { name: "ne", value: "ne" },
        { name: "nl", value: "nl" },
        { name: "no", value: "no" },
        { name: "or", value: "or" },
        { name: "pa", value: "pa" },
        { name: "pl", value: "pl" },
        { name: "ps", value: "ps" },
        { name: "pt", value: "pt" },
        { name: "ro", value: "ro" },
        { name: "ru", value: "ru" },
        { name: "rw", value: "rw" },
        { name: "se", value: "se" },
        { name: "sh", value: "sh" },
        { name: "sk", value: "sk" },
        { name: "sl", value: "sl" },
        { name: "so", value: "so" },
        { name: "sq", value: "sq" },
        { name: "sr", value: "sr" },
        { name: "st", value: "st" },
        { name: "sv", value: "sv" },
        { name: "sw", value: "sw" },
        { name: "ta", value: "ta" },
        { name: "te", value: "te" },
        { name: "tg", value: "tg" },
        { name: "th", value: "th" },
        { name: "tl", value: "tl" },
        { name: "tn", value: "tn" },
        { name: "tr", value: "tr" },
        { name: "uk", value: "uk" },
        { name: "ur", value: "ur" },
        { name: "vi", value: "vi" },
        { name: "wo", value: "wo" },
        { name: "xh", value: "xh" },
        { name: "xx", value: "xx" },
        { name: "yo", value: "yo" },
        { name: "zh", value: "zh" },
        { name: "zu", value: "zu" },
      ],
      cross: { mode: "brackets" },
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
      tmdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            config.params.tmdbId = config.params.name;
            delete config.params.name;
          }
          return config!;
        },
      },
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            config.params.imdbId = config.params.name.replace("tt", "");
            delete config.params.name;
          }
          return config!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors,
      rows: { selector: "div.torrent-search--list__results > table:first > tbody > tr" },
      id: {
        selector: ["a.torrent-search--list__name"],
        attr: "href",
        filters: [(query: string) => query.match(/\/torrents\/(\d+)/)![1]],
      },
      title: { selector: ["a.torrent-search--list__name"] },
      url: { selector: ["a.torrent-search--list__name"], attr: "href" },
      time: { selector: ["td.torrent-search--list__age > time"], attr: "title", filters: [{ name: "parseTime" }] },
      size: { selector: ["td.torrent-search--list__size > span"], filters: [{ name: "parseSize" }] },
      author: { selector: ["span.torrent-search--list__uploader"] },
      category: { selector: ["td.torrent-search--list__format div.torrent-search--list__category img"], attr: "alt" },
      seeders: { selector: ["td.torrent-search--list__seeders > a > span"], filters: [{ name: "parseNumber" }] },
      leechers: { selector: ["td.torrent-search--list__leechers > a > span"], filters: [{ name: "parseNumber" }] },
      completed: { selector: ["td.torrent-search--list__completed > a > span"], filters: [{ name: "parseNumber" }] },
      comments: { selector: ["i.torrent-icons__comments"], filters: [{ name: "parseNumber" }] },
      status: {
        selector: ["span.torrent-icons > i.torrent-icons"],
        text: ETorrentStatus.unknown,
        case: {
          "i.fa-arrow-circle-up": ETorrentStatus.seeding, // 做种!
          "i.fa-arrow-circle-down": ETorrentStatus.downloading, // 吸血!
          "i.fa-do-not-enter": ETorrentStatus.inactive, // 未完成!
          "i.fa-thumbs-down": ETorrentStatus.completed, // 撤种!
        },
      },
      progress: {
        selector: ["span.torrent-icons > i.torrent-icons"],
        text: 0,
        case: {
          "i.fa-arrow-circle-up, i.fa-thumbs-down": 100,
        },
      },
      tags: [
        {
          name: "Free",
          selector: "i.torrent-icons__featured, i.torrent-icons__freeleech[title*='100%']",
          color: "blue",
        },
        {
          name: "2xUp",
          selector: "i.torrent-icons__featured, i.torrent-icons__double-upload",
          color: "lime",
        },
        {
          name: "75%",
          selector: "i.torrent-icons__freeleech[title*='75%']",
          color: "lime-darken-3",
        },
        {
          name: "50%",
          selector: "i.torrent-icons__freeleech[title*='50%']",
          color: "deep-orange-darken-1",
        },
        {
          name: "25%",
          selector: "i.torrent-icons__freeleech[title*='25%']",
          color: "blue",
        },
        {
          name: "可退款",
          selector: "i.fa-percentage",
          color: "gray",
        },
        {
          name: "内部组发布",
          selector: "i.torrent-icons__internal",
          color: "purple",
        },
        {
          name: "个人发布",
          selector: "i.torrent-icons__personal-release",
          color: "purple",
        },
        {
          name: "高速",
          selector: "i.torrent-icons__highspeed",
          color: "red",
        },
        {
          name: "可升级的",
          selector: "i.torrent-icons__torrent-trump",
          color: "red",
        },
      ],
    },
  },

  list: [
    {
      urlPattern: ["/torrents\[\^/\]"],
    },
  ],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,

      name: {
        selector: ["a[href*='/users/'][href*='/general-settings']:first"],
        attr: "href",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/users\/(.+)\/general-settings/);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : "";
          },
        ],
      },
      id: {
        selector: idTrans.map((x) => `dt:contains('${x}') + dd`),
        filters: [(query: string) => parseInt(query || "0")],
      },
      joinTime: {
        selector: ["time.profile__registration"],
        filters: [
          (query: string) => {
            query = query.split(":")[1].trim();
            return parseValidTimeString(query, ["yyyy-MM-dd"]);
          },
        ],
      },
      ratio: {
        selector: RatioTrans.map((x) => `dt:contains('${x}') + dd`),
        filters: [(query) => parseFloat(query.replace(/,/g, "") || "0")],
      },
      trueRatio: {
        selector: RatioTrans.map((x) => `dt:contains('Real ${x}') + dd`),
        filters: [(query) => parseFloat(query.replace(/,/g, "") || "0")],
      },
      uploads: {
        selector: ["h2:contains('Torrent Count') + dl"],
        elementProcess: (element: any) => {
          if (!element) return 0;

          // 查找所有包含总发布数信息的div元素
          const divs = element.querySelectorAll("div.key-value__group");

          // 提取所有div元素中的文本内容
          const allText = Array.from(divs)
            .map((div: any) => div.textContent || div.innerText || "")
            .join(" ");

          // 使用正则表达式匹配数字，并去除逗号
          const queryMatch = String(allText || "")
            .replace(/,/g, "")
            .match(/\d+/g);

          if (!queryMatch) return 0;

          // 根据匹配到的数字进行特定的加总处理
          const totalReleases = parseInt(queryMatch[0]) + parseInt(queryMatch[1]);

          return totalReleases;
        },
      },
      levelName: {
        selector: ["a.user-tag__link[title]"],
        attr: "title",
      },
      seedingSize: {
        // table.table-condensed:first
        selector: seedingSizeTrans.map((x) => `dt:contains('${x}') + dd`),
        filters: [(query: string) => parseSizeString(query.replace(/,/g, ""))],
      },
      // "/users/$user.name$/earnings
      bonusPerHour: {
        selector: ["aside .panelV2 dl.key-value div:nth-child(3) dd"],
        filters: [(query) => parseFloat(query.replace(/,/g, "") || "0")],
      },
      messageCount: {
        text: 0,
        selector: ['a[title*="收件箱"] svg', 'a[title*="Inbox"] svg'],
        elementProcess: () => 11,
      },
    },
  },

  // TODO userInfo 中的 averageSeedingTime, hnrUnsatisfied 等其他字段

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户默认等级；下载队列10个，可以发布种子",
    },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB",
      interval: "P1M",
      privilege: "下载队列20个，可以发布种子，可以寄出邀请",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "5TiB",
      interval: "P2M",
      privilege: "下载队列30个，直接发布种子，可以寄出邀请",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "20TiB",
      interval: "P3M",
      privilege: "下载队列40个，直接发布种子，可以寄出邀请",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "50TiB",
      interval: "P6M",
      privilege: "下载队列50个，直接发布种子，可以寄出邀请",
    },
    {
      id: 6,
      name: "Seeder",
      seedingSize: "5TiB",
      interval: "P1M",
      averageSeedingTime: "P30D",
      privilege: "下载队列60个，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 7,
      name: "Curator",
      seedingSize: "10TiB",
      interval: "P2M",
      averageSeedingTime: "P60D",
      privilege: "下载队列60个，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 8,
      name: "Veteran",
      uploaded: "100TiB",
      seedingSize: "5TiB",
      averageSeedingTime: "P30D",
      interval: "P12M",
      privilege: "下载队列60个，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 9,
      name: "Archivist",
      seedingSize: "20TiB",
      interval: "P3M",
      averageSeedingTime: "P90D",
      privilege: "下载队列60个，直接发布种子，可以寄出邀请，可以无视H&R，双倍上传",
    },
  ],
};

export default class Fearnopeer extends Unit3D {
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
        url: `/users/${userName}/earnings`,
        responseType: "document",
      },
      true,
    );
    return this.getFieldData(document, this.metadata.userInfo?.selectors?.bonusPerHour!);
  }
}
