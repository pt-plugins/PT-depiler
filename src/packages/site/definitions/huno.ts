import { ETorrentStatus, type IAdvancedSearchRequestConfig, ISiteMetadata } from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";
import { set } from "es-toolkit/compat";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const categoryMap: Record<number, string> = {
  1: "Movie",
  2: "TV",
};

const typeMap: Record<number, string> = {
  1: "DISC",
  2: "REMUX",
  3: "WEB",
  15: "ENCODE",
};

const resolutionMap: Record<number, string> = {
  1: "4320p",
  2: "2160p",
  3: "1080p",
  4: "1080i",
  5: "720p",
  6: "576p",
  7: "576i",
  11: "540p",
  8: "480p",
  9: "480i",
  10: "Other",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 2,
  id: "huno",
  name: "HUNO",
  description: "HAWKE-UNO IS A HAWKE-ONE SERVICE POWERED BY UNIT3D.",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://unjxr.hab/"],
  legacyUrls: ["uggcf://unjxr.habm/"],

  collaborator: ["fzlins", "hui-shao"],

  userInputSettingMeta: [
    {
      name: "token",
      label: "Token",
      hint: "在 /users/用户名/hub/settings/security 获取 API Token 并填入此处",
      required: true,
    },
  ],

  category: [
    {
      name: "分类",
      key: "categories",
      keyPath: "params",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "brackets" }, // 注：站点构造为 &categories[0]=1&categories[1]=2
    },
    {
      name: "编码",
      key: "type",
      keyPath: "params",
      options: Object.entries(typeMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutions",
      keyPath: "params",
      options: Object.entries(resolutionMap).map(([value, name]) => ({ name, value: Number(value) })),
      cross: { mode: "brackets" },
    },
    {
      name: "促销状态",
      key: "free", // 并不是真实的 key
      keyPath: "params",
      options: [
        { name: "免费", value: 1 }, // 不是真实 value，仅用于区分，在后续的 generateRequestConfig 处理
        { name: "非免费", value: 2 },
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const ret = { requestConfig: { params: {} } };
        (selectedOptions as number[]).forEach((value) => {
          if (value == 1) set(ret.requestConfig.params, "free", true);
          else if (value == 2) set(ret.requestConfig.params, "notFree", true);
        });
        return ret as IAdvancedSearchRequestConfig;
      },
    },
  ],

  search: {
    ...SchemaMetadata.search,
    skipNonLatinCharacters: true,
    selectors: {
      ...SchemaMetadata.search!.selectors,

      rows: { selector: "table.deep-space-similar-table > tbody > tr" },
      id: {
        selector: ["div.ds-macro-row__name-content > div.ds-macro-row__name-title > a[href*='torrents']"],
        attr: "href",
        filters: [(query: string) => query.match(/\/torrents\/(\d+)/)![1]],
      },
      title: {
        selector: ["div.ds-macro-row__name-content > div.ds-macro-row__name-title"],
      },
      subTitle: {
        selector: ["div.ds-macro-row__name-content > div.ds-macro-row__name-specs"],
      },
      url: {
        selector: ["div.ds-macro-row__name-content > div.ds-macro-row__name-title > a[href*='torrents']"],
        attr: "href",
      },
      category: { text: "All", selector: ["span[title='Release Type']"] },
      size: { selector: "a[title='Download']", filters: [{ name: "parseSize" }] },
      time: { selector: "div[class^='tw-text-white']", filters: [{ name: "parseTTL" }] },
      seeders: {
        selector: ["a[href*='peers'][title*='seeders']", "a[href*='peers'][title*='Seeding']"],
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: ["a[href*='peers'][title*='leechers']", "a[href*='peers'][title*='Leeching']"],
        filters: [{ name: "parseNumber" }],
      },
      completed: { selector: "a[href*='snatched'][title*='completed']", filters: [{ name: "parseNumber" }] },
      comments: { text: 0 }, // not provided

      status: {
        text: ETorrentStatus.unknown,
        selector: ["div.ds-macro-row__name-content[style*='font-variant-numeric']"],
        case: {
          // "span[data-original-title='Leeching']": ETorrentStatus.downloading, //todo
          "a[href*='peers'][title*='Seeding'][style*='--ds-success']": ETorrentStatus.seeding,
          // "span[data-original-title='Not Completed']": ETorrentStatus.inactive, // 未完成!
          // "span[data-original-title='Downloaded but Not Seeding']": ETorrentStatus.completed, // 完成!
        },
      },
      // 站点似乎不提供 progress
      progress: {
        text: 0,
        selector: ["div.ds-macro-row__name-content[style*='font-variant-numeric']"],
        case: {
          "a[href*='peers'][title*='Seeding'][style*='--ds-success']": 100,
          "a[href*='peers'][title*='seeders'][style*='inherit']": 0,
        },
      },

      // tags: [ // todo
      //   { name: "Free", selector: "i.far.fa-gift", color: "#c149ab" },
      //   { name: "Pack", selector: "i.far.fa-folder-heart", color: "#e3747a" },
      //   { name: "Plex", selector: "i.far.fa-play", color: "#f39c12" },
      //   { name: "Internal", selector: "i.far.fa-bolt", color: "#b793f0" },
      //   { name: "Worthy", selector: "i.far.fa-medal", color: "#00c07f" },
      //   { name: "Sticky", selector: "i.far.fa-thumbtack", color: "#d32f2f" },
      //   { name: "H&R", selector: "*", color: "red" },
      // ],
    },
  },

  noLoginAssert: {
    ...SchemaMetadata.noLoginAssert,
    urlPatterns: [/doLogin|login|verify|checkpoint|returnto|twofactor/gi],
  },

  userInfo: {
    pickLast: ["name", "id"],
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      // page '/api/profile'
      name: { selector: "data.username" },
      levelName: { selector: "data.group" },
      joinTime: {
        selector: "data.member_since",
        filters: [{ name: "parseTime" }],
      },
      uploaded: { selector: "data.uploaded" },
      downloaded: { selector: "data.downloaded" },
      bonus: { selector: "data.hunos" },
      seeding: { selector: "data.active_seeds" },
      leeching: { selector: "data.active_leeches" },
      hnrUnsatisfied: { selector: "data.hit_and_runs" },
      // hnrPreWarning: { // todo, not provided by site?
      //   // 考核中的 HR
      //   selector: ["div[view='unsatisfieds'] tbody"],
      //   elementProcess: (element: Element) => {
      //     const length = element.querySelectorAll("tr.userFiltered[hr='0'][immune='0']").length;
      //     return length > 0 ? length : 0;
      //   },
      // },

      // page '/'
      id: {
        selector: ["span.deep-space-user-card__user-id"],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/\d+/);
            return queryMatch ? parseInt(queryMatch[0], 10) : 0;
          },
        ],
      },
      uploads: {
        selector: ["div.ds-user-stats span[title*='Uploads']"],
        filters: [{ name: "split", args: ["/", 0] }, { name: "trim" }, { name: "parseNumber" }],
      },
      seedingSize: {
        selector: ["div.ds-user-stats span[title*='Seeding Size']"],
        filters: [{ name: "parseSize" }],
      },
      messageCount: {
        text: 0,
        selector: ["div.ds-user-stats a[href*='/hub/messages'] > span.ds-count"],
        elementProcess: (element: Element) => {
          const icon = element.querySelector("i");
          if (!icon) {
            return 0;
          }

          const squareClass = Array.from(icon.classList).find((cls) => /^fa-square-\d+$/.test(cls));
          if (!squareClass) {
            return 11;
          }

          return parseInt(squareClass.replace("fa-square-", ""), 10) || 11;
        },
      },

      // page '/users/$name$/hub/hunos'
      bonusPerHour: {
        selector: ["table.deep-space-similar-table > tfoot td.tw-font-bold[style*=color]"],
        filters: [{ name: "parseNumber" }],
      },
    },
    process: [
      {
        requestConfig: { url: "/api/profile", method: "GET", responseType: "json" },
        fields: [
          "name",
          "levelName",
          "joinTime",
          "uploaded",
          "downloaded",
          "bonus",
          "seeding",
          "leeching",
          "hnrUnsatisfied",
        ],
      },
      {
        requestConfig: { url: "/", method: "GET", responseType: "document" },
        fields: ["id", "uploads", "seedingSize", "messageCount"],
      },
      {
        requestConfig: { url: "/users/$name$/hub/hunos", responseType: "document" },
        assertion: { name: "url" },
        fields: ["bonusPerHour"],
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "Silent Sisters",
      privilege: "Can download",
    },
    {
      id: 2,
      name: "Iron Fleet",
      privilege: "Can upload; Can request",
    },
    {
      id: 3,
      name: "White Walkers",
      privilege: "RSS; IRC Server; IRC Announce; Upload API; Can apply for hawke-one Discord access",
    },
    {
      id: 4,
      name: "Dothraki",
      privilege: "Listed uploads; HnR immunity",
    },
    {
      id: 5,
      name: "Unsullied",
      privilege:
        "Can invite; Can see peers; Trusted uploader; Worthy; hawke-one Discord invite; Unsullied on hawke-one Discord with added perks",
    },
    {
      id: 6,
      name: "Targaryen",
      privilege: "Internal; Custom branding; Targaryen on hawke-one Discord with added perks",
    },
  ],
};

export default class Huno extends Unit3D {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // add token to headers
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      "X-Api-Token": this.userConfig.inputSetting!.token ?? "",
      origin: this.url,
    };

    return super.request<T>(axiosConfig, checkLogin);
  }
}
