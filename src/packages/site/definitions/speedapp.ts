import type { ISiteMetadata, ISearchEntryRequestConfig, ISearchResult, ITorrent } from "../types.ts";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";

const bonusTrans: string[] = ["Bonus points", "奖励积分"];
const seedingTrans: string[] = ["Currently seeding torrents", "目前正在播种种子"];
const joinTimeTrans: string[] = ["Signup date", "注册日期"];
const averageSeedingTimeTrans: string[] = ["Average seed time", "平均种子时间"];
const uploadedTrans: string[] = ["Uploaded", "已上传"];
const downloadedTrans: string[] = ["Downloaded", "已下载"];
const ratioTrans: string[] = ["Ratio", "分享率", "比率"];

const categoryMapXXX: Record<number, string> = {
  15: "XXX Movies",
  47: "XXX DVD",
  48: "XXX HD",
  49: "XXX Images",
  50: "XXX Packs",
  51: "XXX SD",
};

const categoryMapNormal: Record<number, string> = {
  38: "Movie Packs",
  10: "Movies: SD",
  35: "Movies: SD Ro",
  8: "Movies: HD",
  29: "Movies: HD Ro",
  7: "Movies: DVD",
  2: "Movies: DVD Ro",
  17: "Movies: BluRay",
  24: "Movies: BluRay Ro",
  59: "Movies: Ro",
  57: "Movies: 4K (2160p) Ro",
  61: "Movies: 4K (2160p)",
  41: "TV Packs",
  66: "TV Packs Ro",
  45: "TV Episodes",
  46: "TV Episodes Ro",
  43: "TV Episodes HD",
  44: "TV Episodes HD Ro",
  60: "TV Ro",
  11: "Games: PC-ISO",
  52: "Games: Console",
  1: "Applications",
  14: "Applications: Linux",
  37: "Applications: Mac",
  19: "Applications: Mobile",
  62: "TV Cartoons",
  3: "TV Anime / Hentai",
  6: "E-books",
  5: "Music",
  64: "Music Video",
  18: "Images",
  22: "TV Sports",
  58: "TV Sports Ro",
  9: "TV Documentary",
  63: "TV Documentary Ro",
  65: "Tutorial",
  67: "Miscellaneous",
};

const categoryMap = { ...categoryMapNormal, ...categoryMapXXX };

export const siteMetadata: ISiteMetadata = {
  version: 2,
  id: "speedapp",
  name: "SpeedApp",
  description: "SpeedApp is a ROMANIAN Private Torrent Tracker for MOVIES / TV / GENERAL",
  tags: ["影视", "综合"],
  timezoneOffset: "+0300",

  type: "private",
  schema: "AbstractPrivateSite",

  urls: ["uggcf://fcrrqncc.vb/"],

  legacyUrls: ["https://icetorrent.org/", "https://scenefz.me/", "https://u-torrents.ro/", "https://myxz.eu/"],

  // 这里除了 categories 其它均为自定义 key，需要在自定义站点方法中统一处理
  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "综合", value: "/browse" },
        { name: "成人", value: "/adult" },
      ],
    },
    {
      name: "Categories",
      key: "categories_normal",
      notes: "请先设置分类入口为“综合”！请勿与 成人 区类别同时选择！",
      options: buildCategoryOptionsFromDict(categoryMapNormal),
      cross: { key: "categories", mode: "brackets" },
    },
    {
      name: "Categories (Adult)",
      key: "categories_xxx",
      notes: "请先设置分类入口为“成人”！请勿与 综合 区类别同时选择！",
      options: buildCategoryOptionsFromDict(categoryMapXXX),
      cross: { key: "categories", mode: "brackets" },
    },
    {
      name: "Resolution",
      key: "resolution",
      options: [
        { name: "SD", value: 1 },
        { name: "720p", value: 3 },
        { name: "1080p", value: 4 },
        { name: "2160p", value: 5 },
        { name: "4320p", value: 6 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "3D",
      key: "3d",
      options: [
        { name: "3D", value: 44 },
        { name: "SBS", value: 45 },
        { name: "Top-Down", value: 46 },
        { name: "Anaglyph", value: 47 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "OS",
      key: "os",
      options: [
        { name: "Windows", value: 48 },
        { name: "Linux", value: 49 },
        { name: "MacOS", value: 50 },
        { name: "Android", value: 51 },
        { name: "iOS", value: 52 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Internal",
      key: "internal",
      options: [
        { name: "Internal", value: 43 },
        { name: "EShare", value: 106 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Procedure",
      key: "procedure",
      options: [
        { name: "Encode", value: 40 },
        { name: "Remux", value: 41 },
        { name: "BRRip", value: 42 },
        { name: "CBR", value: 68 },
        { name: "VBR", value: 69 },
        { name: "BDRip", value: 79 },
        { name: "Torent status", value: 103 },
        { name: "Bumped", value: 104 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Audio codec",
      key: "audio",
      options: [
        { name: "MP3", value: 13 },
        { name: "AAC", value: 14 },
        { name: "FLAC", value: 15 },
        { name: "Vorbis", value: 16 },
        { name: "AC3", value: 17 },
        { name: "DTS", value: 18 },
        { name: "DTS-HD", value: 19 },
        { name: "DTS-X", value: 20 },
        { name: "Atmos", value: 21 },
        { name: "True-HD", value: 22 },
        { name: "LPCM", value: 23 },
        { name: "WAVE", value: 24 },
        { name: "ALAC", value: 67 },
        { name: "RealAudio", value: 73 },
        { name: "APE", value: 74 },
        { name: "WMA", value: 75 },
        { name: "EAC3", value: 80 },
        { name: "Opus", value: 101 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Image codec",
      key: "image",
      options: [
        { name: "JPEG", value: 53 },
        { name: "GIF", value: 54 },
        { name: "PNG", value: 55 },
        { name: "WEBP", value: 56 },
        { name: "TIFF", value: 57 },
        { name: "PSD", value: 58 },
        { name: "Vector", value: 59 },
        { name: "PNM", value: 70 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Subtitle",
      key: "subtitle",
      options: [
        { name: "English", value: 25 },
        { name: "Romanian", value: 26 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Console",
      key: "console",
      options: [
        { name: "PS2", value: 60 },
        { name: "PS3", value: 61 },
        { name: "Xbox 360", value: 62 },
        { name: "Wii", value: 63 },
        { name: "PS4", value: 64 },
        { name: "Xbox One", value: 65 },
        { name: "PS5", value: 105 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Dubbing",
      key: "dubbing",
      options: [
        { name: "English", value: 27 },
        { name: "Romanian", value: 28 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Video codec",
      key: "codec",
      options: [
        { name: "XviD", value: 7 },
        { name: "AVC", value: 93 },
        { name: "MPEG4", value: 8 },
        { name: "HEVC", value: 9 },
        { name: "VP8", value: 10 },
        { name: "VP9", value: 11 },
        { name: "VC1", value: 12 },
        { name: "AV1", value: 100 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Source format",
      key: "source",
      options: [
        { name: "CD", value: 29 },
        { name: "DVD", value: 30 },
        { name: "DVD-R", value: 31 },
        { name: "HD-DVD", value: 32 },
        { name: "BluRay", value: 33 },
        { name: "TV", value: 34 },
        { name: "HD", value: 35 },
        { name: "HD TV", value: 36 },
        { name: "CAM", value: 37 },
        { name: "TS", value: 38 },
        { name: "WEB DL", value: 39 },
        { name: "SACD", value: 66 },
        { name: "SCR", value: 71 },
        { name: "Bootleg", value: 72 },
        { name: "SDTV", value: 76 },
        { name: "WEBRip", value: 77 },
        { name: "TVRip", value: 81 },
        { name: "HDTVRip", value: 82 },
        { name: "DVB", value: 84 },
        { name: "SATRip", value: 85 },
        { name: "IPTVRip", value: 86 },
        { name: "VHSRip", value: 87 },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "Color space",
      key: "colorspace",
      options: [
        { name: "Dolby Vision", value: 94 },
        { name: "HDR", value: 95 },
        { name: "HDR10", value: 96 },
        { name: "HDR10+", value: 98 },
        { name: "SDR", value: 99 },
      ],
      cross: { mode: "brackets" },
    },
  ],

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/browse",
      responseType: "document",
    },
    selectors: {
      rows: { selector: "div.row.mr-0.ml-0.py-3" },
      title: { selector: "div:nth-child(2) > a[href^='/browse/']:first-child" },
      url: { selector: "div:nth-child(2) > a[href^='/browse/']:first-child", attr: "href" },
      link: { selector: "a.btn[href^='/torrents/']", attr: "href" },
      category: {
        selector: "a[href*='?categories']",
        attr: "href",
        filters: [{ name: "split", args: ["=", 1] }, (catID: number) => categoryMap[catID]],
      },
      size: { selector: "> div:nth-child(4)", filters: [{ name: "parseSize" }] },
      comments: { selector: "a[href$='#comments_content']", filters: [{ name: "parseNumber" }] },
      seeders: { selector: "span.text-success", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "span.text-danger", filters: [{ name: "parseNumber" }] },
      completed: { selector: "> div:nth-child(3)", filters: [{ name: "parseNumber" }] },
      time: {
        selector: "> div:nth-child(2)",
        attr: "title",
        filters: [
          { name: "replace", args: [/日/g, " "] },
          { name: "replace", args: [/[年月]/g, "-"] },
          { name: "parseTime" },
        ],
      },
      tags: [
        {
          name: "Free",
          selector: "span.label-success",
        },
        {
          name: "Internal",
          selector: "div[title='Internal']",
          color: "purple",
        },
        {
          name: "2xUp",
          selector: "span:contains('double up')",
        },
      ],
    },
  },

  searchEntry: {
    area_normal: { name: "综合", requestConfig: { url: "/browse" } },
    area_adult: { name: "成人", enabled: false, requestConfig: { url: "/adult" } },
  },

  list: [
    {
      urlPattern: [/\/(browse|internal|adult)(\?.*)?$/],
      mergeSearchSelectors: true,
      selectors: {
        time: {
          selector: "> div:nth-child(2)",
          data: "originalTitle",
          filters: [
            { name: "replace", args: [/日/g, " "] },
            { name: "replace", args: [/[年月]/g, "-"] },
            { name: "parseTime" },
          ],
        },
      },
    },
  ],

  detail: {
    urlPattern: [/\/browse\/\d+\/t\//],
    selectors: {
      title: { selector: "h5.text-emphasis" },
      link: { selector: "a[href^='/torrents/']:first", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["name", "joinTime"],
    process: [
      {
        requestConfig: {
          url: "/profile",
          responseType: "document",
        },
        selectors: {
          name: { selector: "#kt_quick_user_toggle > span.text-dark-50" },
          messageCount: { selector: "#notifications-oc-toggle > div.btn > .label-danger" },
          // 上传权限需要申请
          uploads: {
            text: 0,
          },
          uploaded: {
            selector: uploadedTrans.map((x) => `dt:contains('${x}') + dd`),
            filters: [{ name: "parseSize" }],
          },
          downloaded: {
            selector: downloadedTrans.map((x) => `dt:contains('${x}') + dd`),
            filters: [{ name: "parseSize" }],
          },
          ratio: {
            selector: ratioTrans.map((x) => `dt:contains('${x}') + dd`),
            filters: [{ name: "replace", args: [/[,|\s]/g, ""] }, { name: "parseNumber" }],
          },
          levelName: {
            selector: "div.card-body.pt-4 >div.align-items-center div.text-muted",
            filters: [{ name: "trim" }],
          },
          joinTime: {
            selector: joinTimeTrans.map((x) => `dt:contains('${x}') + dd`),
            filters: [
              { name: "replace", args: [/日/g, " "] },
              { name: "replace", args: [/[年月]/g, "-"] },
              { name: "parseTime" },
            ],
          },
          seedingSize: {
            selector: bonusTrans.map((x) => `dt:contains('${x}') + dd > b:nth-of-type(2)`),
            filters: [{ name: "replace", args: [/[,|\s]/g, ""] }, { name: "parseSize" }],
          },
          bonusPerHour: {
            selector: bonusTrans.map((x) => `dt:contains('${x}') + dd > b:eq(0)`),
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: {
          url: "/profile/menu-stats",
          responseType: "document",
        },
        selectors: {
          bonus: {
            selector: bonusTrans.map((x) => `a[href='/shop'][title='${x}']`),
            filters: [{ name: "replace", args: [/[,|\s]/g, ""] }, { name: "parseNumber" }],
          },
          seeding: {
            selector: seedingTrans.map((x) => `a[href='/snatch/seeding'][title='${x}']`),
            filters: [{ name: "parseNumber" }],
          },
          averageSeedingTime: {
            selector: averageSeedingTimeTrans.map((x) => `a[href='/snatch/seeding'][title='${x}']`),
            filters: [{ name: "parseTTL" }],
          },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Peasant",
    },
    {
      id: 2,
      name: "User",
      interval: "P30D",
      uploaded: "25GB",
      ratio: 1.05,
      privilege: "Can invite other people.",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P90D",
      uploaded: "200GB",
      ratio: 2,
      privilege: "Can make requests.",
    },
    {
      id: 4,
      name: "Elite User",
      interval: "P180D",
      uploaded: "1TB",
      ratio: 3,
      privilege: "Can be chosen as Hyperseeders (immune to HnR).",
    },
    {
      id: 5,
      name: "Xtreme User",
      interval: "P12M",
      uploaded: "5TB",
      ratio: 4,
      privilege: "Same privileges as Elite User.",
    },
    {
      id: 6,
      name: "Super User",
      interval: "P2Y",
      uploaded: "20TB",
      ratio: 5,
      privilege: "Same privileges as Elite User.",
    },
    {
      id: 7,
      name: "Legend User",
      interval: "P6Y",
      uploaded: "100TB",
      ratio: 6,
      privilege: "Same privileges as Elite User.",
    },
    {
      id: 8,
      name: "VIP",
      groupType: "vip",
      privilege: "Same privileges as Elite User, immune to automated HnR warnings.",
    },
  ],
};

export default class SpeedApp extends PrivateSite {
  /**
   * SpeedApp 搜索方法
   * 适配 SpeedApp 高级搜索多个分类共用 tags 参数的情况
   */
  public override async getSearchResult(
    keywords?: string,
    searchEntry: ISearchEntryRequestConfig = {},
  ): Promise<ISearchResult> {
    const params = searchEntry.requestConfig?.params;

    if (params) {
      // 整合自定义 key 的值到同一数组中
      const merged = Object.entries(params)
        .filter(([k, v]) => k !== "categories" && Array.isArray(v))
        .flatMap(([_, v]) => v);

      // 删除自定义 key
      Object.keys(params).forEach((k) => {
        if (k !== "categories") {
          delete params[k];
        }
      });

      // tags 为最终的 params key
      params.tags = merged;
    }

    return super.getSearchResult(keywords, searchEntry);
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const downloadLink = await super.getTorrentDownloadLink(torrent);
    if (downloadLink && !downloadLink.includes("/torrents/")) {
      const { data: detailDocument } = await this.request<Document>({
        url: downloadLink,
        responseType: "document",
      });
      return this.getFieldData(detailDocument, this.metadata.search?.selectors?.link!);
    }

    return downloadLink;
  }
}
