import {
  EResultParseStatus,
  type ISearchInput,
  type ISiteMetadata,
  type IUserInfo,
  type ITorrent,
  type ITorrentTag,
  NeedLoginError,
} from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import { omit, toMerged } from "es-toolkit";
import { convertIsoDurationToSeconds } from "../utils";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "beyondhd",
  name: "BeyondHD",
  aka: ["BHD"],
  description:
    "Beyond Your Imagination, BeyondHD is a community-built Movie/TV database." +
    "Every piece of data has been added by our amazing community since 2012.",
  tags: ["电影", "电视剧"],
  timezoneOffset: "+0000",

  collaborator: ["lengmianxia"],

  type: "private",
  schema: "F3NIX",

  urls: ["uggcf://orlbaq-uq.zr/"],

  category: [
    {
      name: "Category",
      key: "categories",
      keyPath: "data",
      options: [
        { name: "Movies", value: "1" },
        { name: "TV", value: "2" },
      ],
      cross: false,
    },
    {
      name: "Type",
      key: "types",
      keyPath: "data",
      options: [
        { name: "UHD 100", value: "UHD 100" },
        { name: "UHD 66", value: "UHD 66" },
        { name: "UHD 50", value: "UHD 50" },
        { name: "UHD Remux", value: "UHD Remux" },
        { name: "BD 50", value: "BD 50" },
        { name: "BD 25", value: "BD 25" },
        { name: "BD Remux", value: "BD Remux" },
        { name: "2160p", value: "2160p" },
        { name: "1080p", value: "1080p" },
        { name: "1080i", value: "1080i" },
        { name: "720p", value: "720p" },
        { name: "576p", value: "576p" },
        { name: "540p", value: "540p" },
        { name: "DVD 9", value: "DVD 9" },
        { name: "DVD 5", value: "DVD 5" },
        { name: "DVD Remux", value: "DVD Remux" },
        { name: "480p", value: "480p" },
        { name: "Other", value: "Other" },
      ],
      cross: { mode: "comma" },
    },
    {
      name: "Source",
      key: "sources",
      keyPath: "data",
      options: [
        { name: "Blu-ray", value: "Blu-ray" },
        { name: "HD-DVD", value: "HD-DVD" },
        { name: "WEB", value: "WEB" },
        { name: "HDTV", value: "HDTV" },
        { name: "DVD", value: "DVD" },
      ],
      cross: { mode: "comma" },
    },
    {
      name: "ReleaseGroup",
      key: "groups",
      keyPath: "data",
      options: [
        { name: "FraMeSToR", value: "FraMeSToR" },
        { name: "BHDStudio", value: "BHDStudio" },
        { name: "BeyondHD", value: "BeyondHD" },
        { name: "RPG", value: "RPG" },
        { name: "iROBOT", value: "iROBOT" },
        { name: "iFT", value: "iFT" },
        { name: "ZR", value: "ZR" },
        { name: "MKVULTRA", value: "MKVULTRA" },
      ],
      cross: { mode: "comma" },
    },
    {
      name: "Internal",
      key: "types",
      keyPath: "data",
      options: [{ name: "Yes", value: "1" }],
    },
    {
      name: "Discount",
      key: "discount",
      keyPath: "data",
      options: [
        { name: "Freeleech", value: "freeleech" },
        { name: "Freeleech (Limited)", value: "limited" },
        { name: "25% Promo", value: "promo25" },
        { name: "50% Promo", value: "promo50" },
        { name: "75% Promo", value: "promo75" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "SpecialDiscount",
      key: "specialDiscount",
      keyPath: "data",
      options: [
        { name: "Refund", value: "refund" },
        { name: "Rescue", value: "rescue" },
        { name: "Rewind", value: "rewind" },
        { name: "Reboot", value: "reboot" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "Special",
      key: "special",
      keyPath: "data",
      options: [
        { name: "SD", value: "sd" },
        { name: "TV Pack", value: "pack" },
        { name: "Stream Optimized", value: "stream" },
        { name: "h264 codec", value: "h264" },
        { name: "h265 codec", value: "h265" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "Health",
      key: "health",
      keyPath: "data",
      options: [
        { name: "Alive", value: "alive" },
        { name: "Dying", value: "dying" },
        { name: "Dead", value: "dead" },
        { name: "Reseed", value: "reseed" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "种子状态",
      key: "seedStatus",
      options: [
        { name: "seeding", value: "seeding" },
        { name: "leeching", value: "leeching" },
        { name: "completed", value: "completed" },
        { name: "incomplete", value: "incomplete" },
        { name: "notdownload", value: "notdownload" },
      ],
      cross: { mode: "append", key: "" },
    },
    // 该站点提供的搜索参数过多，仅列举常用部分
  ],

  search: {
    skipNonLatinCharacters: true,
    keywordPath: "data.search",
    requestConfig: {
      url: "/api/torrents",
      method: "POST",
      data: {
        action: "search",
      },
      responseType: "json",
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.data?.search) {
            config.data.imdb_id = config.data.search;
            delete config!.data.search;
          }
          return config!;
        },
      },
      tmdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.data?.search) {
            config.data.tmdb_id = config.data.search;
            delete config!.data.search;
          }
          return config!;
        },
      },
    },
    selectors: {
      rows: { selector: "results" },
      id: { selector: "id" },
      title: { selector: "name" },
      // 该站点类似于Unit3D，不提供或者说没有subTitle
      url: { selector: "url" },
      // 不设置 RSSKEY时，该站点不提供下载链接，以url替代
      link: { selector: ["download_url", "url"] },
      time: { selector: "created_at", filters: [{ name: "parseTime" }] },
      size: { selector: "size" },
      author: { text: "N/A", selector: "uploaded_by" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "times_completed" },
      comments: { text: "N/A" },
      category: { selector: "category" },
      // tags 交由 parseTorrentRowForTags 处理
      ext_imdb: { selector: "imdb_id" },
    },
  },

  // 该站种子列表页并不提供种子下载直链，且无法拼接获得
  list: [],

  detail: {
    urlPattern: ["/torrents/(.+)\\.(\\d+)"],
    selectors: {
      id: {
        selector: ":self",
        elementProcess: (element: Document) => {
          // 尝试从页面 URL 中获取 ID，例如 /torrent/158672
          const url = element.URL;
          const urlIdMatch = url.match(/\/torrents\/(.+)\.(\d+)/);
          if (urlIdMatch && urlIdMatch[2]) {
            return urlIdMatch[2];
          }

          // 如果两种方式都找不到 ID，则返回 undefined
          return undefined;
        },
      },
      title: {
        selector: ["tr:has(td:first-child:contains('Name')) > td:last-child"],
        switchFilters: {
          "tr:has(td:first-child:contains('Name')) > td:last-child": [
            (element: string) => {
              if (!element) {
                return undefined;
              }

              return element;
            },
          ],
        },
      },
      link: {
        selector: ["a[href*='/download/']"],
        attr: "href",
      },
    },
  },

  userInfo: {
    pickLast: ["name", "id"],
    selectors: {
      // '/'
      name: { selector: ["img.beta-image-avatar"], attr: "title" },
      id: { selector: ["meta[name='secret-id']"], attr: "content" },
      uploaded: { selector: ["ul#beta-stats li a:has(> i.fas.fa-arrow-up)"], filters: [{ name: "parseSize" }] },
      downloaded: { selector: ["ul#beta-stats li a:has(> i.fas.fa-arrow-down)"], filters: [{ name: "parseSize" }] },
      ratio: { selector: ["ul#beta-stats li a:has(> span > i.fas.fa-sync-alt)"], filters: [{ name: "parseNumber" }] },
      bonus: { selector: ["ul#beta-stats li a:has(> i.fas.fa-star)"], filters: [{ name: "parseNumber" }] },
      seeding: { selector: ["ul#beta-stats li a:has(> i.fas.fa-seedling)"], filters: [{ name: "parseNumber" }] },
      hnrUnsatisfied: {
        selector: ["ul#beta-stats li a:has(> i.fas.fa-skull-crossbones)"],
        filters: [{ name: "parseNumber" }],
      },
      // '/users/$user.name$.$user.id$'
      levelName: {
        selector: ["div[style*='margin-left'] a.beta-alert"],
        attr: "title",
      },
      uploads: {
        selector: [".button-right .bhd-block:nth-child(1) .class-highlight"],
        filters: [(text) => text.match(/\d+/)?.[0] ?? ""],
      },
      leeching: {
        selector: [".button-right .bhd-block:nth-child(2) .bhd-tidbit-icon"],
      },
      snatches: {
        selector: [".button-right .bhd-block:nth-child(4) .bhd-tidbit-icon"],
      },
      trueRatio: {
        selector: ["td.bhd-user-left:contains('Real Ratio') + td span.badge-user"],
      },
      joinTime: {
        selector: ["div.button-holder h5:contains('Member Since: ')"],
        filters: [
          (text: string) => {
            const match = text.match(/Member Since:\s*(\d{4}-\d{2}-\d{2})/);
            return match ? match[1] : text;
          },
          { name: "parseTime", args: ["yyyy-MM-dd"] },
        ],
      },
      seedingSize: {
        selector: ["td.bhd-user-left:contains('Active Seed Size') + td span.badge-user"],
        filters: [{ name: "parseSize" }],
      },
      seedingTime: {
        selector: ["td.bhd-user-left:contains('Total Seedtime') + td span.badge-user"],
        // 该站点提供 "1Y 2M 3D 1h 7m 1s"，需转换至秒存储
        elementProcess: (element: HTMLElement) => {
          const raw = element.textContent?.trim() || "";
          const isoDuration =
            "P" +
            raw
              .replace(/\s+/g, "") // 去除空格: "1Y2M3D1h7m1s"
              .replace(/(\d+[YMD])(\d+[hms])/i, "$1T$2"); // 在时间部分前加T: "P1Y2M3DT1h7m1s"

          return convertIsoDurationToSeconds(isoDuration);
        },
      },
      averageSeedingTime: {
        selector: ["td.bhd-user-left:contains('Average Seedtime') + td span.badge-user"],
        elementProcess: (element: HTMLElement) => {
          const raw = element.textContent?.trim() || "";
          const isoDuration = "P" + raw.replace(/\s+/g, "").replace(/(\d+[YMD])(\d+[hms])/i, "$1T$2");

          return convertIsoDurationToSeconds(isoDuration);
        },
      },
      specialSeedsize: {
        selector: ["td.bhd-user-left:contains('Special Seed Size') + td span.badge-user"],
        filters: [{ name: "parseSize" }],
      },
      messageCount: {
        text: 0,
        selector: [".beta-alert[title='Private Messages'] .notify"],
        elementProcess: () => 11, // 该站点不提供未读计数，所以有信置11，无信为0
      },
      // '/bp'
      bonusPerHour: {
        selector: [".panel-body.no-padding .hd-table > div:first-child .class-bold"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Recruit",
      ratio: 0.25,
      privilege:
        "Can Download; Can rescue 5 torrents per day until 25 pending completion; Members in this class are capped at receiving 1,000 BP in gifts/tips per member.",
    },
    {
      id: 2,
      name: "User",
      ratio: 0.25,
      uploaded: "50GiB",
      interval: "P14D",
      seedingTime: "P25D",
      snatches: 5,
      privilege:
        "Can Request Reseeds; Can Request Torrents; Can Remove HNRs (with BP); Bypass Upload Moderation; Change Avatar;Can rescue 6 torrents per day until 30 pending completion.",
    },
    {
      id: 3,
      name: "Member",
      ratio: 0.4,
      uploaded: "400GiB",
      interval: "P1M",
      averageSeedingTime: "P10D",
      seedingTime: "P8M10D",
      snatches: 25,
      privilege:
        "View Workhouse; View Internals; View Staff; View Site Stats; Change Title; Change About; Change Signature; Can rescue 10 torrents per day until 30 pending completion.",
    },
    {
      id: 4,
      name: "Expert",
      ratio: 0.55,
      uploaded: "800GiB",
      interval: "P3M",
      averageSeedingTime: "P15D",
      seedingTime: "P2Y20D",
      snatches: 50,
      privilege:
        "Send Invites; View Torrent Peers; View Torrent History; Change Profile Cover; Can rescue 11 torrents per day until 33 pending completion.",
    },
    {
      id: 5,
      name: "Pro",
      ratio: 0.7,
      uploaded: "1.25TiB",
      interval: "P6M",
      averageSeedingTime: "P30D",
      seedingTime: "P4Y11M",
      specialSeedsize: "500GiB",
      snatches: 60,
      privilege: "View Invite Forum; View Chat History; Can rescue 12 torrents per day until 36 pending completion.",
    },
    {
      id: 6,
      name: "Elite",
      ratio: 0.85,
      uploaded: "2.5TiB",
      interval: "P9M",
      averageSeedingTime: "P45D",
      seedingTime: "P9Y3M",
      specialSeedsize: "2TiB",
      snatches: 75,
      privilege:
        "Can rescue 15 torrents per day until 45 pending completion. Receive 2 FL token(s) for every 30 days this class is retained.",
    },
    {
      id: 7,
      name: "Master",
      ratio: 1.0,
      uploaded: "8TiB",
      interval: "P1Y",
      averageSeedingTime: "P60D",
      seedingTime: "P41Y1M5D",
      specialSeedsize: "4TiB",
      snatches: 250,
      privilege:
        "View Torrent Changes; View Movie / TV Edits; Can rescue 16 torrents per day until 48 pending completion. Receive 2 FL token(s) for every 30 days this class is retained. Receive 25% discount on all downloads.",
    },
    {
      id: 8,
      name: "King",
      ratio: 1.25,
      uploaded: "24TiB",
      interval: "P2Y",
      averageSeedingTime: "P90D",
      seedingTime: "P123Y3M15D",
      specialSeedsize: "8TiB",
      snatches: 500,
      privilege:
        "Edit Movie / TV Details; Can rescue 20 torrents per day until 60 pending completion. Receive 2 FL token(s) for every 30 days this class is retained. Receive 50% discount on all downloads.",
    },
    {
      id: 9,
      name: "Emperor",
      ratio: 4,
      uploaded: "96TiB",
      download: "24TiB",
      interval: "P5Y",
      averageSeedingTime: "P180D",
      seedingTime: "P123Y3M15D",
      specialSeedsize: "48TiB",
      snatches: 10000,
      privilege:
        "Can rescue 40 torrents per day until 120 pending completion. Receive 5 FL token(s) for every 30 days this class is retained. Receive 1 invite(s) for every 30 days this class is retained. Receive 100% discount on all downloads.",
    },
    // Special Classes Overview
    { id: 100, name: "Pirater", groupType: "vip" },
    { id: 101, name: "Celebrity", groupType: "vip" },
    { id: 102, name: "Legend", groupType: "vip" },
    { id: 103, name: "Uploader", groupType: "vip" },
    { id: 104, name: "Internal", groupType: "vip" },
    // Staff Classes
    { id: 200, name: "Moderator", groupType: "manager" },
    { id: 201, name: "Bot", groupType: "manager" },
    { id: 202, name: "SysOp", groupType: "manager" },
  ],

  userInputSettingMeta: [
    {
      name: "apikey",
      label: "API Key",
      hint: "Find the API keys under your security settings (your profile picture -> my security)",
      required: true,
    },
    {
      name: "rsskey",
      label: "RSS Key",
      hint: "Your personal RSS key (RID) if you wish for results to include the uploaded_by and download_url fields",
      required: false,
    },
  ],
};

interface IBhdRawTorrent {
  id: number;
  name: string;
  folder_name: string;
  info_hash: string;
  size: number;
  uploaded_by: string | null;
  category: string;
  type: string;
  dv: number;
  hdr10: number;
  "hdr10+": number;
  hlg: number;
  audios: string;
  subtitles: string;
  commentary: number;
  description: string;
  mediainfo: number;
  nfo: number;
  seeders: number;
  leechers: number;
  times_completed: number;
  imdb_id: string | null;
  tmdb_id: string | null;
  bhd_rating: number | null;
  tmdb_rating: number | null;
  imdb_rating: number | null;
  year: number;
  exclusive: number;
  internal: number;
  tv_pack: number;
  promo25: number;
  promo50: number;
  promo75: number;
  freeleech: number;
  rewind: number;
  refund: number;
  reboot: number;
  limited: number;
  rescue: number;
  bumped_at: string;
  created_at: string;
  url: string;
  download_url: string | null;
}

interface IBhdSearchRawResp<T> {
  status_code: number;
  page: number;
  results: T;
  total_pages: number;
  total_results: number;
  success: boolean;
}

export default class BeyondHD extends PrivateSite {
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo: IUserInfo = {
      status: EResultParseStatus.unknownError,
      updateAt: +new Date(),
      site: this.metadata.id,
    };

    if (!this.allowQueryUserInfo) {
      flushUserInfo.status = EResultParseStatus.passParse;
      return flushUserInfo;
    }

    try {
      // 获取基础信息
      flushUserInfo = toMerged(flushUserInfo, await this.getUserBaseInfoFromSite());

      // 获取扩展信息
      if (lastUserInfo !== null && lastUserInfo.name && lastUserInfo.id) {
        flushUserInfo = toMerged(
          flushUserInfo,
          await this.getUserExtendInfoFromDetails(lastUserInfo.name, lastUserInfo.id as string),
        );
      } else {
        flushUserInfo = toMerged(
          flushUserInfo,
          await this.getUserExtendInfoFromDetails(flushUserInfo.name as string, flushUserInfo.id as string),
        );
      }

      // 获取时魔
      flushUserInfo = toMerged(flushUserInfo, await this.getBonusPerHourFromBonus());

      if (this.metadata.levelRequirements && flushUserInfo.levelName && typeof flushUserInfo.levelId === "undefined") {
        flushUserInfo.levelId = this.guessUserLevelId(flushUserInfo as IUserInfo);
      }

      flushUserInfo.status = EResultParseStatus.success;
    } catch (e) {
      flushUserInfo.status = EResultParseStatus.parseError;

      if (e instanceof NeedLoginError) {
        flushUserInfo.status = EResultParseStatus.needLogin;
      }
    }

    return flushUserInfo;
  }

  protected async getUserBaseInfoFromSite(): Promise<Partial<IUserInfo>> {
    const { data: dataDocument } = await this.request<Document>({ url: "/", responseType: "document" }, true);

    return this.getFieldsData(dataDocument, this.metadata.userInfo?.selectors!, ["id", "name"]) as Partial<IUserInfo>;
  }

  protected async getUserExtendInfoFromDetails(userName: string, userId: string): Promise<Partial<IUserInfo>> {
    const { data: dataDocument } = await this.request<Document>({
      url: `/users/${userName}.${userId}`,
      responseType: "document",
    });

    return this.getFieldsData(
      dataDocument,
      this.metadata.userInfo?.selectors!,
      Object.keys(omit(this.metadata.userInfo?.selectors!, ["id", "name"])),
    ) as Partial<IUserInfo>;
  }

  protected async getBonusPerHourFromBonus(): Promise<Partial<IUserInfo>> {
    const { data: dataDocument } = await this.request<Document>({ url: "/bp", responseType: "document" });

    return this.getFieldsData(dataDocument, this.metadata.userInfo?.selectors!, ["bonusPerHour"]) as Partial<IUserInfo>;
  }

  public override async request<T>(axiosConfig: AxiosRequestConfig, checkLogin = true): Promise<AxiosResponse<T>> {
    if (axiosConfig.url === "/api/torrents") {
      const apikey = this.userConfig.inputSetting?.apikey ?? "";
      const rsskey = this.userConfig.inputSetting?.rsskey ?? "";
      axiosConfig.url = `/api/torrents/${apikey}`;
      axiosConfig.data = { ...axiosConfig.data, rsskey: `${rsskey}` };
    }
    return await super.request<T>(axiosConfig, checkLogin);
  }

  protected override loggedCheck(raw: AxiosResponse<IBhdSearchRawResp<any>>): boolean {
    const isApiResp = raw.config.url?.startsWith("/api") ?? false;
    if (isApiResp) {
      return raw.data?.success === true && raw.data?.status_code === 1;
    }
    return super.loggedCheck(raw);
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IBhdRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const tags: ITorrentTag[] = [];

    const statusTags: Record<string, { name: string; color?: string }> = {
      exclusive: { name: "Excl.", color: "deep-orange-darken-1" },
      promo25: { name: "75%", color: "lime-darken-3" },
      promo50: { name: "50%", color: "orange" },
      promo75: { name: "25%", color: "purple" },
      freeleech: { name: "Freeleech", color: "blue" },
      limited: { name: "Freeleech(UL)", color: "blue-lighten-3" },
      rewind: { name: "Rewind" },
      refund: { name: "Refund" },
      rescue: { name: "Rescue" },
      reboot: { name: "Reboot" },
      tv_pack: { name: "完结" },
    };

    for (const key of Object.keys(statusTags)) {
      if (key in row && (row as Record<string, any>)[key] === 1) {
        tags.push(statusTags[key as keyof typeof statusTags]);
      }
    }

    // TODO: 增加更多中文化tag，与NPHP体验一致
    const languageRegex = /(Chinese|Cantonese)(\s*\(.*\))?/i;

    const audioArray = row.audios.split(", ").filter((item) => item.trim() !== "");
    if (audioArray.some((audio) => languageRegex.test(audio))) {
      tags.push({ name: "中配" });
    }
    const subtitleArray = row.subtitles.split(", ").filter((item) => item.trim() !== "");
    if (subtitleArray.some((subtitle) => languageRegex.test(subtitle))) {
      tags.push({ name: "中字" });
    }

    torrent.tags = tags;
    return torrent;
  }
}
