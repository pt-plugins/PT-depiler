import { ETorrentStatus, ISearchCategories, ISearchInput, ISiteMetadata, ITorrent } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite";
import { set } from "es-toolkit/compat";
import { AxiosRequestConfig, AxiosResponse } from "axios";

const category = {
  1: "Movies",
  2: "TV",
  3: "Documentaries",
  4: "Music",
  5: "Sport",
  6: "Audio Track",
  7: "XXX",
  8: "Misc/Demo",
} as const;

const codec = { 1: "H.264", 2: "MPEG-2", 3: "VC-1", 4: "XviD", 5: "HEVC" } as const;
const medium = { 1: "Blu-ray/HD DVD", 3: "Encode", 4: "Capture", 5: "Remux", 6: "WEB-DL" } as const;
const origin = { 0: "Undefined", 1: "Internal" } as const;
const exclusivity = { 0: "Non-exclusive", 1: "Exclusive" } as const;

function categoryFactory(key: string, category: Record<number, string>): ISearchCategories {
  return {
    name: key.charAt(0).toUpperCase() + key.slice(1),
    key,
    keyPath: "data",
    options: Object.entries(category).map(([value, name]) => ({ name, value: Number(value) })),
    cross: { mode: "brackets" },
  };
}

interface IHDBitsRawTorrent {
  id: number; // Torrent ID
  hash: string; // 40 character hex string representing the info hash of the torrent
  leechers: number; // Number of leechers on this torrent
  seeders: number; // Number of seeders on this torrent
  name: string; // Torrent name
  descr: string; // Description in BBCode format
  times_completed: number; // Number of times this torrent has been completed
  size: number; // Size of the files in the torrent in bytes
  utadded: number; // Unix timestamp of when the torrent was uploaded
  added: string; // Timestamp of when the torrent was uploaded (ISO 8601 format)
  comments: number; // Number of comments on this torrent
  numfiles: number; // Number of files in this torrent
  filename: string; // Original filename of the torrent file
  freeleech: "yes" | "no";
  type_category: number; // Category ID
  type_codec: number; // Codec ID
  type_medium: number; // Medium ID
  type_origin: number; // Origin ID
  type_exclusive: number; // Exclusivity ID
  torrent_status: "" | "seeding" | "leeching" | "completed";
  bookmarked: number; // 1 or 0
  wishlisted: number; // 1 or 0
  tags: string[]; // Array of tag names associated with this torrent

  //  An object representing the lMDb data for this film. Field only exists if imdb data exists
  imdb?: { id: number; englishtitle: string; originaltitle: string; year: number; genres: string[]; rating: number };

  // A tvdb object. Field only exists if tvdb data exists
  tvdb?: { id: number; season: number; year: number };
}

interface IHDBitsApiResponse<T = any> {
  status: number;
  message?: string;
  data: T;
}

export const siteMetadata: ISiteMetadata = {
  id: "hdbits",
  version: 1,
  name: "HDBits",
  aka: ["HDB"],
  description: "HDBits is a Private site for the HighDefinition Bittorrent Community",
  tags: ["影视", "综合"],
  timezoneOffset: "+0000",

  type: "private",

  urls: ["https://hdbits.org/"],

  category: [
    categoryFactory("category", category),
    categoryFactory("codec", codec),
    categoryFactory("medium", medium),
    categoryFactory("origin", origin),
    categoryFactory("exclusivity", exclusivity),
  ],

  search: {
    requestConfig: {
      url: "/api/torrents",
      method: "POST",
      data: {
        limit: 100,
      },
    },
    keywordPath: "data.search",
    requestDelay: 2e3, // 2 seconds
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config, keywords }) => {
          if (config?.data?.search) {
            delete config.data.search;
          }

          const imdbId = (keywords ?? "").replace(/^tt/, "");
          set(config!, "data.imdb", { id: Number(imdbId) });
          return config!;
        },
      },
    },

    selectors: {
      rows: { selector: "data" },
      id: { selector: "id" },
      title: {
        selector: ":self",
        filters: [
          (item: IHDBitsRawTorrent) => {
            const { filename, name, type_category, type_medium } = item;
            // Use release name for XXX content and full discs
            return type_category != 7 && type_medium != 1 && filename ? filename!.replace(".torrent", "") : name;
          },
        ],
      },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/details.php?id="] }] },
      // link 交由 parseTorrentRowForLink 处理
      time: { selector: "utadded", filters: [(query) => Number(query) * 1e3] },
      size: { selector: "size" },
      author: { text: "-" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "times_completed" },
      comments: { selector: "comments" },
      category: {
        selector: "type_category",
        filters: [(query) => category[Number(query) as keyof typeof category] ?? "Unknown"],
      },
      progress: {
        text: 0,
        selector: "torrent_status",
        filters: [
          (query: IHDBitsRawTorrent["torrent_status"]) => {
            if (query == "seeding" || query == "completed") {
              return 100; // 完成或正在做种
            }
            return 0; // 其他状态
          },
        ],
      },
      status: {
        selector: "torrent_status",
        filters: [
          (query: IHDBitsRawTorrent["torrent_status"]) => {
            if (query == "seeding") return ETorrentStatus.seeding;
            if (query == "leeching") return ETorrentStatus.downloading;
            if (query == "completed") return ETorrentStatus.completed;
            return ETorrentStatus.unknown;
          },
        ],
      },
      ext_imdb: { selector: "imdb.id", filters: [{ name: "extImdbId" }] },
    },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    // From https://github.com/pt-plugins/PT-Plugin-Plus/blob/e8559fbcbfac9d6149de0f5484807917355c9844/resource/sites/hdbits.org/config.json#L167-L225
    process: [
      {
        requestConfig: { url: "/index.php" },
        selectors: {
          id: {
            selector: "a[href*='userdetails.php']:first",
            attr: "href",
            filters: [{ name: "querystring", args: ["id"] }],
          },
          name: { selector: "a[href*='userdetails.php']:first" },
          messageCount: {
            selector: ["a.alert-box--pm, span.js-notifications-count"],
            filters: [{ name: "parseNumber" }],
          },
        },
      },
      {
        requestConfig: { url: "/userdetails.php" },
        assertion: { id: "params.id" },
        selectors: {
          uploaded: {
            selector: ["td.rowhead:contains('Uploaded') + td"],
            filters: [
              (query: string) => {
                return query.includes("(") ? query.split("(")[0] : query;
              },
              { name: "parseSize" },
            ],
          },
          downloaded: {
            selector: ["td.rowhead:contains('Downloaded') + td"],
            filters: [
              (query: string) => {
                return query.includes("(") ? query.split("(")[0] : query;
              },
              { name: "parseSize" },
            ],
          },
          ratio: { selector: "td.rowhead:contains('Share ratio') + td", filters: [{ name: "parseNumber" }] },
          levelName: { selector: ["td.rowhead:contains('Class') + td"] },
          bonus: { selector: ["td.rowhead:contains('Bonus') + td"], filters: [{ name: "parseNumber" }] },
          joinTime: {
            selector: ["td.rowhead:contains('JOIN'):contains('date') + td"],
            filters: [{ name: "split", args: [" (", 0] }, { name: "parseTime" }],
          },
          seeding: {
            selector: ["td.heading:contains('Currently'):contains('seeding') + td"],
            filters: [{ name: "replace", args: ["-", ""] }, { name: "parseNumber" }],
          },
          seedingSize: { selector: ["td.heading:contains('Seeding size') + td"], filters: [{ name: "parseSize" }] },
        },
      },
    ],
  },

  // From https://github.com/pt-plugins/PT-Plugin-Plus/blob/e8559fbcbfac9d6149de0f5484807917355c9844/resource/sites/hdbits.org/config.json#L19-L44
  levelRequirements: [
    {
      id: 1,
      name: "1080i",
      interval: "P4W",
      downloaded: "30GB",
      ratio: 0.95,
      privilege: "You can view NFOs and request reseeds on poorly seeded torrents.",
    },
    {
      id: 2,
      name: "1080p",
      interval: "P4W",
      downloaded: "500GB",
      ratio: 1.4,
      privilege: "As 1080i",
    },
    {
      id: 3,
      name: "UHD",
      interval: "P4W",
      downloaded: "500GB",
      ratio: 2.5,
      privilege: "As 1080i",
    },
  ],

  userInputSettingMeta: [
    { name: "username", label: "Username", hint: "Your HDBits username", required: true },
    { name: "passkey", label: "Passkey", hint: "Your HDBits passkey", required: true },
  ],
};

export default class HDBits extends PrivateSite {
  override async request<T>(axiosConfig: AxiosRequestConfig, checkLogin: boolean = true): Promise<AxiosResponse<T>> {
    // 为通过 api 方式请求的接口添加用户名和 passkey
    if (axiosConfig.url && axiosConfig.url.includes("/api/")) {
      axiosConfig.method = "POST";
      axiosConfig.responseType = "json";
      axiosConfig.data ??= {};
      axiosConfig.data.username = this.userConfig.inputSetting!.username;
      axiosConfig.data.passkey = this.userConfig.inputSetting!.passkey;
    }

    return super.request(axiosConfig, checkLogin);
  }

  protected override loggedCheck(res: AxiosResponse<IHDBitsApiResponse>): boolean {
    const baseCheck = super.loggedCheck(res);
    if (baseCheck) {
      const { config: requestConfig, data: resData = { status: -1 } } = res;
      if (requestConfig.url?.includes("/api/") && resData.status !== 0) {
        return false; // 如果状态码不是0，表示请求失败
      }
    }

    return baseCheck;
  }

  protected parseTorrentRowForLink(
    torrent: Partial<ITorrent>,
    row: IHDBitsRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    torrent.link = `/download.php/${row.filename}?id=${row.id}&passkey=${this.userConfig.inputSetting!.passkey}`;
    return torrent;
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IHDBitsRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const tags: ITorrent["tags"] = [];
    const { type_category = -1, type_medium = -1, type_origin = -1, freeleech = "no" } = row;

    // 100% Neutral Leech: all XXX content.
    if (type_category == 7) {
      tags.push({ name: "NL." });
    }

    // 100% Free Leech: all blue torrents.
    if (freeleech == "yes") {
      tags.push({ name: "Free" });
    }

    // 50% Free Leech: all full discs, remuxes, captures and all internal encodes, also all TV and Documentary content.
    if ([1, 5, 4].includes(type_medium) || type_origin == 1 || type_category == 2 || type_category == 3) {
      tags.push({ name: "50%" });
    }

    torrent.tags = tags;
    return torrent;
  }
}
