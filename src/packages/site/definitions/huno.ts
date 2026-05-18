import {
  ETorrentStatus,
  type IAdvancedSearchRequestConfig,
  type ISearchInput,
  type ISiteMetadata,
  type ITorrent,
  type ITorrentTag,
} from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";
import { get, set } from "es-toolkit/compat";
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

function getHunoApiValue(row: object, paths: string[], fallback: unknown = ""): unknown {
  for (const path of paths) {
    const value = get(row, path);
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

function getHunoApiSubTitle(row: object): string {
  const values = [
    getHunoApiValue(row, ["release_year", "attributes.release_year"]),
    getHunoApiValue(row, ["resolution.name", "resolution", "attributes.resolution.name", "attributes.resolution"]),
    getHunoApiValue(row, ["type.name", "type", "attributes.type.name", "attributes.type"]),
    getHunoApiValue(row, ["video_codec.name", "video_codec", "attributes.video_codec.name", "attributes.video_codec"]),
    getHunoApiValue(row, ["source_type.name", "source_type", "attributes.source_type.name", "attributes.source_type"]),
  ];

  return values
    .filter((value) => typeof value === "string" || typeof value === "number")
    .map(String)
    .join(" / ");
}

function getHunoApiTagText(row: object, paths: string[]): string {
  const values = paths.map((path) => get(row, path)).filter((value) => value !== undefined && value !== null);

  return values
    .flatMap((value) => {
      if (Array.isArray(value)) {
        return value.map((item) => (typeof item === "object" ? JSON.stringify(item) : String(item)));
      }

      return typeof value === "object" ? JSON.stringify(value) : String(value);
    })
    .join(" ");
}

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
      key: "types",
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
      url: "/api/torrents/filter",
      responseType: "json",
      params: {
        perPage: 100,
      },
    },
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
    },
    skipNonLatinCharacters: true,
    selectors: {
      rows: { selector: ["data.data", "data", "torrents.data", "torrents"] },
      id: {
        selector: ["id", "attributes.id"],
      },
      title: {
        selector: ["name", "attributes.name"],
      },
      subTitle: {
        selector: ":self",
        filters: [getHunoApiSubTitle],
      },
      url: {
        selector: ":self",
        filters: [(row: object) => `/torrents/${getHunoApiValue(row, ["id", "attributes.id"])}`],
      },
      link: {
        selector: ["download_link", "attributes.download_link"],
      },
      category: {
        selector: ":self",
        filters: [
          (row: object) =>
            getHunoApiValue(row, ["category.name", "attributes.category.name"], "All"),
        ],
      },
      size: { selector: ["size", "attributes.size"] },
      time: { selector: ["created_at", "attributes.created_at", "bumped_at", "attributes.bumped_at"] },
      author: {
        selector: ["uploader.username", "uploader.name", "attributes.uploader.username", "attributes.uploader.name"],
      },
      seeders: {
        selector: ["seeders", "attributes.seeders"],
      },
      leechers: {
        selector: ["leechers", "attributes.leechers"],
      },
      completed: { selector: ["times_completed", "attributes.times_completed", "completed", "attributes.completed"] },
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
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: object,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const extendTorrent = super.parseTorrentRowForTags(torrent, row, searchConfig);
    const tags: ITorrentTag[] = extendTorrent.tags || [];

    const addTag = (tag: ITorrentTag) => {
      if (!tags.some((existsTag) => existsTag.name === tag.name)) {
        tags.push(tag);
      }
    };

    const titleText = getHunoApiTagText(row, ["name", "attributes.name"]);
    const releaseTagText = getHunoApiTagText(row, [
      "release_tag",
      "release_tag.name",
      "release_tag.abbreviation",
      "attributes.release_tag",
      "attributes.release_tag.name",
      "attributes.release_tag.abbreviation",
    ]);
    const mediaLanguageText = getHunoApiTagText(row, [
      "media_language",
      "media_language.name",
      "media_language.abbreviation",
      "attributes.media_language",
      "attributes.media_language.name",
      "attributes.media_language.abbreviation",
    ]);
    const audioText = getHunoApiTagText(row, [
      "audio",
      "audios",
      "audio_language",
      "audio_languages",
      "attributes.audio",
      "attributes.audios",
      "attributes.audio_language",
      "attributes.audio_languages",
    ]);
    const subtitleText = getHunoApiTagText(row, [
      "subtitle",
      "subtitles",
      "subtitle_language",
      "subtitle_languages",
      "attributes.subtitle",
      "attributes.subtitles",
      "attributes.subtitle_language",
      "attributes.subtitle_languages",
    ]);

    const combinedText = [titleText, releaseTagText, mediaLanguageText, audioText, subtitleText].join(" ");
    const chineseLanguageRegex = /Chinese|Mandarin|Cantonese|中文|中字|简体|繁体|国语|国配|粤语|粤配/i;

    if (
      chineseLanguageRegex.test(subtitleText) ||
      /中字|中文|简体|繁体|CHS|CHT|CHN|Chinese\s*Sub/i.test(titleText) ||
      (/SUBBED/i.test(releaseTagText) && chineseLanguageRegex.test(combinedText))
    ) {
      addTag({ name: "中字" });
    }

    if (/Mandarin|Chinese|国语|国配|普通话|中配/i.test([mediaLanguageText, audioText, titleText].join(" "))) {
      addTag({ name: "国语" });
    }

    if (/Cantonese|粤语|粤配/i.test([mediaLanguageText, audioText, titleText].join(" "))) {
      addTag({ name: "粤语" });
    }

    extendTorrent.tags = tags;
    return extendTorrent;
  }

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
