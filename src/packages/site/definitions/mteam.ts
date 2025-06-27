import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { set } from "es-toolkit/compat";
import { build as buildDouban } from "@ptd/social/entity/douban.ts";
import { build as buildImdb } from "@ptd/social/entity/imdb.ts";

import {
  type ILevelRequirement,
  ISearchInput,
  ISiteMetadata,
  ITorrent,
  ITorrentTag,
  TSchemaMetadataListSelectors,
} from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";

const siteCategory: { value: string; name: string; type: "normal" | "adult" }[] = [
  { value: "401", name: "電影/SD", type: "normal" },
  { value: "419", name: "電影/HD", type: "normal" },
  { value: "420", name: "電影/DVDiSo", type: "normal" },
  { value: "421", name: "電影/Blu-Ray", type: "normal" },
  { value: "439", name: "電影/Remux", type: "normal" },
  { value: "403", name: "影劇/綜藝/SD", type: "normal" },
  { value: "402", name: "影劇/綜藝/HD", type: "normal" },
  { value: "438", name: "影劇/綜藝/BD", type: "normal" },
  { value: "435", name: "影劇/綜藝/DVDiSo", type: "normal" },
  { value: "404", name: "紀錄", type: "normal" },
  { value: "434", name: "Music(無損)", type: "normal" },
  { value: "406", name: "演唱", type: "normal" },
  { value: "423", name: "PC遊戲", type: "normal" },
  { value: "448", name: "TV遊戲", type: "normal" },
  { value: "405", name: "動畫", type: "normal" },
  { value: "407", name: "運動", type: "normal" },
  { value: "427", name: "電子書", type: "normal" },
  { value: "422", name: "軟體", type: "normal" },
  { value: "442", name: "有聲書", type: "normal" },
  { value: "451", name: "教育影片", type: "normal" },
  { value: "409", name: "Misc(其他)", type: "normal" },
  { value: "410", name: "AV(有碼)/HD Censored", type: "adult" },
  { value: "424", name: "AV(有碼)/SD Censored", type: "adult" },
  { value: "437", name: "AV(有碼)/DVDiSo Censored", type: "adult" },
  { value: "431", name: "AV(有碼)/Blu-Ray Censored", type: "adult" },
  { value: "429", name: "AV(無碼)/HD Uncensored", type: "adult" },
  { value: "430", name: "AV(無碼)/SD Uncensored", type: "adult" },
  { value: "426", name: "AV(無碼)/DVDiSo Uncensored", type: "adult" },
  { value: "432", name: "AV(無碼)/Blu-Ray Uncensored", type: "adult" },
  { value: "436", name: "AV(網站)/0Day", type: "adult" },
  { value: "440", name: "AV(Gay)/HD", type: "adult" },
  { value: "425", name: "IV(寫真影集)", type: "adult" },
  { value: "433", name: "IV(寫真圖集)", type: "adult" },
  { value: "411", name: "H-遊戲", type: "adult" },
  { value: "412", name: "H-動畫", type: "adult" },
  { value: "413", name: "H-漫畫", type: "adult" },
];

const commonListSelectors: TSchemaMetadataListSelectors = {
  id: { selector: "a[href*='/detail/']", attr: "href", filters: [{ name: "parseNumber" }] },
  title: { selector: "a[href*='/detail/'] strong > span:nth-last-child(1)" },
  url: { selector: "a[href*='/detail/']", attr: "href" },
  // link: 不返回，在 class 中单独构造
  completed: { text: "-" }, // 页面中不返回 completed

  // 其实并没有必要特别声明这个
  keywords: { selector: "input#keyword", elementProcess: (el: HTMLInputElement) => el.value },
};

const levelRequirements: (ILevelRequirement & { levelId?: string })[] = [
  {
    id: 1,
    name: "User",
  },
  {
    id: 2,
    name: "Power User",
    interval: "P4W",
    downloaded: "200GB",
    ratio: 2,
    privilege: "魔力值加成：+1%；可以使用匿名發表候選種子；可以上傳字幕",
  },
  {
    id: 3,
    name: "Elite User",
    interval: "P8W",
    downloaded: "400GB",
    ratio: 3,
    privilege:
      "魔力值加成：+2%；可以發送邀請；可以管理自己上傳的字幕；可以檢視別人的下載紀錄（當對方的隱私權設定不為強才會生效）；可以使用個性條",
  },
  {
    id: 4,
    name: "Crazy User",
    interval: "P12W",
    downloaded: "500GB",
    ratio: 4,
    privilege: "魔力值加成：+3%",
  },
  {
    id: 5,
    name: "Insane User",
    interval: "P16W",
    downloaded: "800GB",
    ratio: 5,
    privilege: "魔力值加成：+4%；可以檢視排行榜",
  },
  {
    id: 6,
    name: "Veteran User",
    interval: "P20W",
    downloaded: "1000GB",
    ratio: 6,
    privilege: "魔力值加成：+5%；封存帳號（在控制面板）後不會被刪除帳號",
  },
  {
    id: 7,
    name: "Extreme User",
    interval: "P24W",
    downloaded: "2000GB",
    ratio: 7,
    privilege: "魔力值加成：+6%；永遠保留",
  },
  {
    id: 8,
    name: "Ultimate User",
    interval: "P28W",
    downloaded: "2500GB",
    ratio: 8,
    privilege: "魔力值加成：+7%",
  },
  {
    id: 9,
    name: "mTorrent Master",
    interval: "P32W",
    downloaded: "3000GB",
    ratio: 9,
    privilege: "魔力值加成：+8%",
  },
  {
    id: 100,
    name: "VIP",
    levelId: "10",
    groupType: "vip",
  },
];

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "mteam",
  name: "M-Team - TP",
  aka: ["MTeam"],
  description: "综合性网站，有分享率要求",
  tags: ["影视", "综合", "成人"],
  timezoneOffset: "+0800",

  collaborator: ["Rhilip"],

  type: "private",
  schema: "mTorrent",

  urls: ["uggcf://xc.z-grnz.pp/", "uggcf://mc.z-grnz.vb/", "uggcf://kc.z-grnz.pp/", "uggcf://nc.z-grnz.pp/"],
  formerHosts: ["xp.m-team.io", "pt.m-team.cc", "tp.m-team.cc"],

  category: [
    {
      name: "分类入口",
      key: "mode",
      keyPath: "data",
      options: [
        { name: "综合", value: "normal" },
        { name: "成人", value: "adult" },
      ],
    },
    {
      name: "類別（综合）",
      key: "categories_normal",
      keyPath: "data",
      options: siteCategory.filter((item) => item.type === "normal"),
      cross: { mode: "brackets", key: "categories" },
    },
    {
      name: "類別（成人）",
      key: "categories_adult",
      keyPath: "data",
      options: siteCategory.filter((item) => item.type === "adult"),
      cross: { mode: "brackets", key: "categories" },
    },
    {
      name: "視頻編碼",
      key: "videoCodecs",
      keyPath: "data",
      options: [
        { name: "H.264(x264/AVC)", value: "1" },
        { name: "VC-1", value: "2" },
        { name: "Xvid", value: "3" },
        { name: "MPEG-2", value: "4" },
        { name: "H.265(x265/HEVC)", value: "16" },
        { name: "AV1", value: "19" },
        { name: "VP8/9", value: "21" },
        { name: "AVS", value: "22" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "音頻編碼",
      key: "audioCodecs",
      keyPath: "data",
      options: [
        { name: "FLAC", value: "1" },
        { name: "APE", value: "2" },
        { name: "DTS", value: "3" },
        { name: "MP2/3", value: "4" },
        { name: "OGG", value: "5" },
        { name: "AAC", value: "6" },
        { name: "Other", value: "7" },
        { name: "AC3(DD)", value: "8" },
        { name: "TrueHD", value: "9" },
        { name: "TrueHD Atmos", value: "10" },
        { name: "DTS-HD MA", value: "11" },
        { name: "E-AC3(DDP)", value: "12" },
        { name: "E-AC3 Atoms(DDP Atoms)", value: "13" },
        { name: "LPCM/PCM", value: "14" },
        { name: "WAV", value: "15" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "解析度",
      key: "standards",
      keyPath: "data",
      options: [
        { name: "1080p", value: "1" },
        { name: "1080i", value: "2" },
        { name: "720p", value: "3" },
        { name: "SD", value: "5" },
        { name: "4K", value: "6" },
        { name: "8K", value: "7" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "標記",
      key: "labelsNew",
      keyPath: "data",
      options: [
        { name: "4k", value: "4k" },
        { name: "8k", value: "8k" },
        { name: "hdr", value: "hdr" },
        { name: "hdr10", value: "hdr10" },
        { name: "hdr10+", value: "hdr10+" },
        { name: "hlg", value: "hlg" },
        { name: "DoVi", value: "DoVi" },
        { name: "HDRVi", value: "HDRVi" },
        { name: "中字", value: "中字" },
        { name: "中配", value: "中配" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "促銷",
      key: "discount",
      keyPath: "data",
      options: [
        { name: "普通", value: "NORMAL" },
        { name: "30%", value: "PERCENT_70" },
        { name: "50%", value: "PERCENT_50" },
        { name: "免費", value: "FREE" },
      ],
      cross: false,
    },
    {
      name: "活/死种",
      key: "visible",
      keyPath: "data",
      options: [
        { name: "僅活躍", value: 1 },
        { name: "僅死種", value: 2 },
      ],
    },
  ],

  search: {
    keywordPath: "data.keyword",
    requestConfig: {
      method: "POST",
      url: "/api/torrent/search",
      responseType: "json",
      data: {
        pageNumber: 1,
        pageSize: 100,
      },
    },

    advanceKeywordParams: {
      // 輸入框增加了 douban\imdb\dmm 搜索，但必須是完整鏈接
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig: config }) => {
          set(config!, "data.mode", "normal");
          set(config!, "data.keyword", buildImdb(keywords!));
          return config!;
        },
      },
      douban: {
        requestConfigTransformer: ({ keywords, requestConfig: config }) => {
          set(config!, "data.mode", "normal");
          set(config!, "data.keyword", buildDouban(keywords!));
          return config!;
        },
      },
    },

    selectors: {
      rows: { selector: "data.data" },
      id: { selector: "id" },
      title: { selector: "name" },
      subTitle: { selector: "smallDescr" },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/detail/"] }] },
      // link: 不返回，在 class 中单独构造
      time: { selector: "createdDate", filters: [{ name: "parseTime" }] },
      size: { selector: "size", filters: [{ name: "parseNumber" }] },
      /**
       * 对json返回，无法构造 elementProcess ，所以需要使用 filters 来处理
       * 对 author 字段，服务器返回 null 时，表示匿名用户， 或者返回 "${number}" 我们以 `u:${number}` 作为 author，不去获取实际用户名
       */
      author: {
        selector: "author",
        filters: [(query: string | null) => (typeof query === "string" ? `u:${query}` : "Anonymous")],
      },
      seeders: { selector: "status.seeders", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "status.leechers", filters: [{ name: "parseNumber" }] },
      completed: { selector: "status.timesCompleted", filters: [{ name: "parseNumber" }] },
      comments: { selector: "status.comments", filters: [{ name: "parseNumber" }] },
      category: {
        selector: "category",
        filters: [(query: string) => siteCategory.find((c) => c.value == query)?.name ?? "Unknown"],
      },
      // tags 交由 parseTorrentRowForTags 处理
      ext_douban: { selector: "douban", filters: [{ name: "extDoubanId" }] },
      ext_imdb: { selector: "imdb", filters: [{ name: "extImdbId" }] },
    },
  },

  searchEntry: {
    area_normal: { name: "综合", requestConfig: { data: { mode: "normal" } } },
    area_adult: { name: "成人", requestConfig: { data: { mode: "adult" } }, enabled: false },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/api/member/profile", method: "POST", responseType: "json" },
        selectors: {
          id: { selector: "data.id", filters: [{ name: "parseNumber" }] },
          name: { selector: "data.username" },
          joinTime: { selector: "data.createdDate", filters: [{ name: "parseTime" }] },
          uploaded: { selector: "data.memberCount.uploaded", filters: [{ name: "parseNumber" }] },
          downloaded: { selector: "data.memberCount.downloaded", filters: [{ name: "parseNumber" }] },
          levelName: {
            selector: "data.role",
            filters: [
              (levelId: string) =>
                levelRequirements.find((x) => levelId == (x.levelId ?? String(x.id)))?.name ?? levelId,
            ],
          },
          levelId: { selector: "data.role", filters: [{ name: "parseNumber" }] },
          bonus: { selector: "data.memberCount.bonus", filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/api/tracker/myPeerStatistics", method: "POST", responseType: "json" },
        selectors: {
          seeding: { selector: "data.seederCount", filters: [{ name: "parseNumber" }] },
          seedingSize: { selector: "data.seederSize", filters: [{ name: "parseNumber" }] },
          uploads: { selector: "data.uploadCount", filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/api/tracker/mybonus", method: "POST", responseType: "json" },
        selectors: {
          bonusPerHour: { selector: "data.formulaParams.finalBs", filters: [{ name: "parseNumber" }] },
        },
      },
      {
        requestConfig: { url: "/api/msg/notify/statistic", method: "POST", responseType: "json" },
        selectors: {
          messageCount: { selector: "data.unMake", filters: [{ name: "parseNumber" }] },
        },
      },
    ],
  },

  list: [
    // next 域名下
    {
      urlPattern: [/\/\/next\..+\/browse/],
      mergeSearchSelectors: false,
      selectors: {
        ...commonListSelectors,

        rows: { selector: "div.app-content__inner table.w-full > tbody > tr" },
        subTitle: { selector: "a[href*='/detail/'] + br + div > span:nth-last-child(1)" },

        time: {
          selector: "td:nth-last-child(5) > span[title]",
          elementProcess: (el: HTMLInputElement) => {
            return el.getAttribute("title") || el.textContent;
          },
          filters: [{ name: "parseTime" }],
        },
        size: { selector: "td:nth-last-child(4)", filters: [{ name: "parseSize" }] },

        seeders: { selector: "td:nth-last-child(3) span.align-middle:nth-last-child(1)" },
        leechers: { selector: "td:nth-last-child(2) span.align-middle:nth-last-child(1)" },
        comments: { selector: "td:nth-last-child(6)" },
        category: { selector: "a[href^='/browse?cat='] > span" },
        ext_douban: {
          selector: "a[href^='/mdb/title'][href*='douban=']",
          filters: [{ name: "querystring", args: ["douban"] }, { name: "extDoubanId" }],
        },
        ext_imdb: {
          selector: "a[href^='/mdb/title'][href*='imdb=']",
          filters: [{ name: "querystring", args: ["imdb"] }, { name: "extImdbId" }],
        },
      },
    },
    {
      urlPattern: ["/browse"],
      mergeSearchSelectors: false,
      selectors: {
        ...commonListSelectors,
        rows: { selector: "tbody.bg-\\[\\#bccad6\\] > tr" },
        subTitle: { selector: "a[href*='/detail/'] + br + div > span" },

        time: {
          selector: "td:nth-last-child(4) > span[title]",
          elementProcess: (el: HTMLInputElement) => {
            return el.getAttribute("title") || el.textContent;
          },
          filters: [{ name: "parseTime" }],
        },
        size: { selector: "td:nth-last-child(3)", filters: [{ name: "parseSize" }] },
        seeders: { selector: 'span[aria-label="arrow-up"] + span' },
        leechers: { selector: 'span[aria-label="arrow-down"] + span' },

        comments: { selector: "td:nth-last-child(5)" },
        category: { selector: "img[src*='/static/cate'][alt]", attr: "alt" },
        ext_douban: { selector: "a[href^='https://movie.douban.com/subject/']", filters: [{ name: "extDoubanId" }] },
        ext_imdb: { selector: "a[href^='https://www.imdb.com/title/']", filters: [{ name: "extImdbId" }] },
      },
    },
  ],

  detail: {
    urlPattern: ["/detail/"],
    selectors: {
      id: {
        selector: ":self",
        elementProcess: (element: Document) => {
          const url = element.URL;
          const match = url.match(/\/detail\/(\d+)/);
          return match ? match[1] : url;
        },
      },
      title: { selector: "h2.title > span.align-middle" },
      link: { text: "" },
    },
  },

  levelRequirements,

  userInputSettingMeta: [
    {
      name: "token",
      label: "Token",
      hint: "在控制台-实验室获取存取令牌并填入此处",
      required: true,
    },
  ],
} as const;

interface IMTeamRawTorrent {
  id: string;
  createdDate: string;
  lastModifiedDate: string;
  name: string;
  smallDescr: string;
  imdb: string;
  imdbRating: string | null;
  douban: string;
  doubanRating: string | null;
  dmmCode: string | null;
  author: string | null;
  category: string;
  source: string;
  medium: string | null;
  standard: string;
  videoCodec: string;
  audioCodec: string;
  team: string | null;
  processing: string | null;
  countries: string[];
  numfiles: string;
  size: string;
  labels: string;
  labelsNew: string[];
  msUp: string;
  anonymous: boolean;
  infoHash: null;
  status: {
    id: string;
    createdDate: string;
    lastModifiedDate: string;
    pickType: string;
    toppingLevel: string;
    toppingEndTime: string;
    discount: string;
    discountEndTime: string;
    timesCompleted: string;
    comments: string;
    lastAction: string;
    lastSeederAction: any;
    views: string;
    hits: string;
    support: string;
    oppose: string;
    status: string;
    seeders: string;
    leechers: string;
    banned: boolean;
    visible: boolean;
    promotionRule: any;
    mallSingleFree: any;
  };
  dmmInfo: any;
  editedBy: any;
  editDate: any;
  collection: boolean;
  inRss: boolean;
  canVote: boolean;
  imageList: string[];
  resetBox: any;
}

interface IMTeamRawResp<D> {
  code: string;
  data: D;
  message: string;
}

/**
 * M-Team 站点类，交互通过 API 进行
 */
export default class MTeam extends PrivateSite {
  // 2024-06-18 統一切換為 api.域名 (其他可用域名請自行查看接口)
  get apiBaseUrl(): string {
    return this.url.replace(/(.+?)\./, "https://api.");
  }

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 将请求的 baseUrl 设置为 api. 域名
    axiosConfig.baseURL = this.apiBaseUrl;

    // 设置默认的 method 和 responseType ， 这样其他配置不需要显式声明
    axiosConfig.method = "POST"; // 站点的请求方式为 POST
    axiosConfig.responseType = "json";

    // 在请求的 headers 中添加 存取令牌
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      "x-api-key": this.userConfig.inputSetting!.token ?? "", // FIXME 是否允许我们设置一个空字符？
    };

    return super.request<T>(axiosConfig, checkLogin);
  }

  protected override loggedCheck(raw: AxiosResponse<IMTeamRawResp<any>>): boolean {
    return raw.data?.message === "SUCCESS";
  }

  protected override fixLink(uri: string, requestConfig: AxiosRequestConfig): string {
    return super.fixLink(uri, { ...requestConfig, baseURL: this.url }); // 将 baseURL 重新指向回 web 页面
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IMTeamRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const tags: ITorrentTag[] = [];

    // 处理 成人区限时free
    if (row.status?.mallSingleFree) {
      tags.push({ name: "Free", color: "blue" });
    } else {
      // 其他促销状态 从 status.discount 中获取
      const discount = row.status?.discount ?? "NORMAL";
      if (discount == "FREE") {
        tags.push({ name: "Free", color: "blue" });
      } else if (discount == "PERCENT_70") {
        tags.push({ name: "30%", color: "indigo" });
      } else if (discount == "PERCENT_50") {
        tags.push({ name: "50%", color: "orange" });
      }
    }

    if (row.labelsNew && row.labelsNew.length > 0) {
      tags.push(...row.labelsNew.map((x) => ({ name: x })));
    }

    torrent.tags = tags;
    return torrent;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const { data } = await this.request<IMTeamRawResp<string>>({
      method: "POST",
      url: "/api/torrent/genDlToken",
      data: { id: torrent.id },
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  }
}
