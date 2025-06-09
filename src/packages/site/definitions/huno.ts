import { ETorrentStatus, type IAdvancedSearchRequestConfig, ISiteMetadata } from "../types";
import { SchemaMetadata } from "@ptd/site/schemas/Unit3D.ts";
import { rot13 } from "@ptd/site";
import { set } from "es-toolkit/compat";

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

  version: 1,
  id: "huno",
  name: "HUNO",
  description: "HAWKE-UNO IS A HAWKE-ONE SERVICE POWERED BY UNIT3D.",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://unjxr.hab/"],
  formerHosts: [rot13("unjxr.habm")],

  collaborator: ["fzlins", "hui-shao"],

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

    keywordPath: "params.name",
    requestConfig: {
      url: "/torrents",
      responseType: "document",
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          set(config!, "params.imdbId", config!.params.name.replace("tt", ""));
          delete config!.params.name;
          return config!;
        },
      },
    },

    selectors: {
      ...SchemaMetadata.search!.selectors,

      rows: { selector: "#torrent-list-table > tbody > tr" },
      category: { text: "All", selector: ["td.torrent-listings-format i[data-original-title]"], data: "originalTitle" },
      size: { selector: "td.torrent-listings-size", filters: [{ name: "parseSize" }] },
      time: { selector: "td.torrent-listings-age:first", filters: [{ name: "parseTTL" }] },
      seeders: { selector: "td.torrent-listings-seeders a", filters: [{ name: "parseNumber" }] },
      leechers: { selector: "td.torrent-listings-leechers a", filters: [{ name: "parseNumber" }] },
      completed: { selector: "td.torrent-listings-completed a", filters: [{ name: "parseNumber" }] },

      status: {
        text: ETorrentStatus.unknown,
        case: {
          "span[data-original-title='Leeching']": ETorrentStatus.downloading,
          "span[data-original-title='Seeding']": ETorrentStatus.seeding,
          "span[data-original-title='Not Completed']": ETorrentStatus.inactive, // 未完成!
          // ETorrentStatus.completed 未提供
        },
      },
      // 站点似乎不提供 progress
      progress: {
        text: 0,
        case: {
          "span[data-original-title='Seeding']": 100,
          "span[data-original-title='Leeching'], span[data-original-title='Not Completed']": 0,
        },
      },

      tags: [
        { name: "Free", selector: "i.far.fa-gift", color: "#c149ab" },
        { name: "Pack", selector: "i.far.fa-folder-heart", color: "#e3747a" },
        { name: "Plex", selector: "i.far.fa-play", color: "#f39c12" },
        { name: "Internal", selector: "i.far.fa-bolt", color: "#b793f0" },
        { name: "Worthy", selector: "i.far.fa-medal", color: "#00c07f" },
        { name: "Sticky", selector: "i.far.fa-thumbtack", color: "#d32f2f" },
      ],
    },
  },

  userInfo: {
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      // '/'
      name: {
        selector: ["ul.dropdown-menu a[href*='users']:first"],
        attr: "href",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/users\/(\S+?)\.(\d+?)$/);
            return queryMatch && queryMatch.length >= 3 ? queryMatch[1].trim() : "";
          },
        ],
      },
      id: {
        selector: ["ul.dropdown-menu a[href*='users']:first"],
        attr: "href",
        filters: [
          (query: string) => {
            const queryMatch = query.match(/users\/(\S+?)\.(\d+?)$/);
            return queryMatch && queryMatch.length >= 3 ? queryMatch[2].trim() : "";
          },
        ],
      },
      // "/users/$user.name$.$user.id$"
      levelName: {
        selector: "span[data-original-title='Tier'] span",
      },
      joinTime: {
        selector: [".user-info td:contains('Registration date') + td"],
        filters: [{ name: "parseTime", args: ["MMM dd yyyy"] }],
      },
      uploads: {
        selector: [".user-info td span[data-original-title='Total Uploads']"],
        filters: [{ name: "parseNumber" }],
      },
      uploaded: {
        selector: [".user-info td span[data-original-title='Upload Size']"],
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: [".user-info td span[data-original-title='Download Size']"],
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: [".user-info td:contains('Ratio') + td"],
        filters: [{ name: "parseNumber" }],
      },
      bonus: {
        selector: ["span.badge-extra > span"],
        filters: [{ name: "parseNumber" }],
      },
      bonusPerHour: {
        selector: ["tfoot strong"],
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: [".user-info td:contains('Active Seeds') + td"],
        filters: [{ name: "parseNumber" }],
      },
      leeching: {
        selector: [".user-info td:contains('Active Leeches') + td"],
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        selector: [".user-info td:contains('Seeding Size') + td"],
        filters: [{ name: "parseSize" }],
      },
      messageCount: {
        text: 0,
        selector: ['a[href*="/mail/inbox"] .point'],
        elementProcess: () => 11, // 并不能直接知道还有多少个消息未读，所以置为11，会直接出线红点而不是具体数字
      },
      hnrUnsatisfied: {
        selector: ["span[data-original-title='HnRs']"],
        elementProcess: (element: Element) => {
          const text = element.lastChild?.textContent?.trim() ?? "";
          const match = text.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        },
      },
    },
    process: [
      {
        requestConfig: { url: "/", responseType: "document" },
        fields: ["id", "name"],
      },
      {
        requestConfig: { url: "/users/$name$.$id$", responseType: "document" },
        assertion: { name: "url", id: "url" },
        fields: [
          "levelName",
          "joinTime",
          "uploads",
          "uploaded",
          "downloaded",
          "ratio",
          "bonus",
          "seeding",
          "leeching",
          "seedingSize",
          "messageCount",
          "hnrUnsatisfied",
        ],
      },
      {
        requestConfig: { url: "/bonus", responseType: "document" },
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
