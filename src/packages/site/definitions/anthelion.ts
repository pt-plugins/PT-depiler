/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/anthelion-api.yml
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/anthelion.me/config.json
 */
import Gazelle, { SchemaMetadata, GazelleUtils, commonPagesList, detailPageList } from "../schemas/Gazelle.ts";
import {
  ETorrentStatus,
  EResultParseStatus,
  type ISearchInput,
  type ISiteMetadata,
  type ITorrent,
  type IUserInfo,
  NeedLoginError,
  CFBlockedError,
} from "../types.ts";
import {
  buildCategoryOptionsFromList,
  parseSizeString,
  parseTimeToLiveToDate,
  parseTimeWithZone,
  parseValidTimeString,
} from "../utils.ts";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

interface IAnthelionApiResponse {
  status?: string;
  error?: string;
  response?: Record<string, unknown>;
}

const parseAnthelionApiNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || !value.trim()) return undefined;

  const parsed = Number(value.replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseAnthelionApiBytes = (value: unknown): number | undefined => {
  const numericValue = parseAnthelionApiNumber(value);
  if (typeof numericValue === "number") return numericValue;
  if (typeof value !== "string") return undefined;

  const parsed = parseSizeString(value.trim());
  return parsed > 0 || value.trim() === "0 B" ? parsed : undefined;
};

const parseAnthelionApiTime = (value: unknown): number | undefined => {
  if (typeof value !== "number" && typeof value !== "string") return undefined;

  const parsed = parseTimeWithZone(value, "+0000");
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseAnthelionApiBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value !== "" && value !== "0" && value.toLowerCase() !== "false";
  return false;
};

// ANT 当前用户页的时间 span 不再带 title，回退解析相对时间；保留 title 以兼容旧页面。
const parseAnthelionUserTime = (element: Element): number | string => {
  const title = element.getAttribute("title");
  if (title) {
    return parseValidTimeString(title, ["MMM d yyyy, HH:mm 'UTC'"]);
  }

  return parseTimeToLiveToDate(element.textContent?.trim() ?? "");
};

const tagKeywords = ["Internal", "Pollen"];
const extractTags = (tags: string) => GazelleUtils.extractTags(tags, tagKeywords);

const antCategories = [
  { name: "Feature Film", class: "featurefilm", value: 1 },
  { name: "Short Film", class: "shortfilm", value: 2 },
  { name: "Miniseries", class: "miniseries", value: 3 },
  { name: "Other", class: "other", value: 4 },
];

const catClassMap = antCategories.reduce<Record<string, string>>((map, item) => {
  map[item.class] = item.name;
  return map;
}, {});

const categoryOptions = antCategories.map(({ name, value }) => ({ name, value }));

const detailPageSelectors = {
  ...detailPageList.selectors,
  category: { text: "N/A" }, // 没有相关信息
  time: {
    ...detailPageList!.selectors!.time!,
    selector: ["+ tr span.time[title]", "+ tr span.time"],
    switchFilters: {
      "+ tr span.time": [
        (ts?: number) => {
          const offsetMinutes = new Date().getTimezoneOffset();
          const offsetMs = offsetMinutes * 60 * 1000;
          return (ts ?? 0) + offsetMs;
        },
      ],
    },
  },
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 5,
  id: "anthelion",
  name: "Anthelion",
  aka: ["ANT"],
  description: "Anthelion (ANT) is a Private site for MOVIES",
  tags: ["电影"],
  timezoneOffset: "+0000",
  type: "private",
  schema: "Gazelle",
  urls: ["uggcf://naguryvba.zr/"],

  userInputSettingMeta: [
    {
      name: "apiKey",
      label: "API Key",
      hint: "可选；在 Anthelion Settings → API Keys 中生成，至少勾选 User 权限。填写后用户统计改用 API 获取",
      required: false,
    },
  ],

  category: [
    {
      name: "Category",
      key: "filter_cat",
      options: categoryOptions,
      cross: { mode: "appendQuote" },
    },
    {
      name: "Container",
      key: "container",
      options: buildCategoryOptionsFromList(["AVI", "MPG", "MKV", "MP4", "VOB IFO", "ISO", "m2ts", "Other"]),
    },
    {
      name: "Codec",
      key: "codec",
      options: buildCategoryOptionsFromList(["MPEG1", "MPEG2", "Xvid", "DivX", "H264", "H265", "VC-1"]),
    },
    {
      name: "Source",
      key: "media",
      options: buildCategoryOptionsFromList([
        "Blu-ray",
        "DVD",
        "WEB",
        "LaserDisc",
        "HD-DVD",
        "HDTV",
        "TV",
        "VHS",
        "Unknown",
      ]),
    },
    {
      name: "Resolution",
      key: "resolution",
      options: buildCategoryOptionsFromList(["SD", "720p", "1080i", "1080p", "2160p"]),
    },
    {
      name: "Leech Status",
      key: "freetorrent",
      options: [
        { value: "0", name: "Normal" },
        { value: "1", name: "Free" },
        { value: "2", name: "Neutral" },
        { value: "3", name: "Either" },
      ],
    },
  ],

  search: {
    ...SchemaMetadata.search,
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: {
        group_results: 0,
        order_way: "desc",
        searchsubmit: 1,
      },
    },
    advanceKeywordParams: {
      imdb: { enabled: true },
      tmdb: { enabled: true },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      title: {
        ...SchemaMetadata.search!.selectors!.title!,
        elementProcess: GazelleUtils.genTitleElementProcess({ extractTagsFunc: extractTags }),
      },
      subTitle: {
        selector: [".tags", "> td:has(a[href*='torrents.php']) a:not(span a):last"],
        switchFilters: {
          // 对应单种行，直接返回 tags
          ".tags": [],
          // 对应组内种子，提取并返回种子属性
          "> td:has(a[href*='torrents.php']) a:not(span a):last": [extractTags],
        },
      },
      category: {
        text: "Other",
        selector: "div[class^='tooltip cats_']",
        attr: "class",
        filters: [
          (cat: string) => {
            const match = cat.match(/cats_(\w+)/);
            if (!match) return "";
            return catClassMap[match[1]];
          },
        ],
      },
      tags: [
        {
          name: "Free",
          selector: "strong:contains('Freeleech')",
        },
        {
          name: "Internal",
          selector: "strong:contains('Internal')",
        },
      ],
      progress: {
        selector: ["div.torrent_info:first", "a[data-toggle-target*='torrent']"],
        filters: [(query: string) => (query.includes("Seeding") ? 100 : 0)],
      },
      status: {
        selector: ["div.torrent_info:first", "a[data-toggle-target*='torrent']"],
        filters: [
          (query: string) => {
            if (query.includes("Seeding")) {
              return ETorrentStatus.seeding;
            } else if (query.includes("Snatched")) {
              return ETorrentStatus.inactive;
            }
            return ETorrentStatus.unknown;
          },
        ],
      },

      ext_imdb: { selector: "a[href*='imdb.com/title/tt']", attr: "href", filters: [{ name: "extImdbId" }] },
    },
  },

  list: [
    {
      ...commonPagesList,
      urlPattern: [...commonPagesList.urlPattern!, "/artist\\.php\\?tmdb=\\d+"],
      selectors: {
        time: {
          text: 0,
          selector: "span.time",
          filters: [
            { name: "parseTTL" },
            (ts: number) => {
              const offsetMinutes = new Date().getTimezoneOffset();
              const offsetMs = offsetMinutes * 60 * 1000;
              return ts + offsetMs;
            },
          ],
        },
      },
    },
    {
      ...detailPageList,
      selectors: detailPageSelectors,
    },
    // Top 10 不显示种子
  ],

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: { url: "/store.php", responseType: "document" },
        fields: ["id", "name", "messageCount", "bonusPerHour"],
      },
      {
        requestConfig: { url: "/user.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "uploaded",
          "uploads",
          "downloaded",
          "adoptions",
          "ratio",
          "joinTime",
          "lastAccessAt",
          "seedingSize",
          "bonus",
          "levelName",
        ],
      },
      {
        requestConfig: { url: "/ajax.php", params: { action: "community_stats" }, responseType: "json" },
        assertion: { id: "params.userid" },
        fields: ["seeding"],
      },
    ],
    selectors: {
      ...SchemaMetadata!.userInfo!.selectors!,
      bonusPerHour: {
        selector: "h3.float_right",
        filters: [
          (query: string) => {
            const match = query.replace(",", "").match(/making ([\d]+) Orbs/);
            return match && match.length > 1 ? parseFloat(match[1]) : 0;
          },
        ],
      },
      adoptions: { selector: "li:contains('Adopted: ') span" },
      joinTime: {
        selector: "ul.stats li:contains('Joined:') span",
        elementProcess: parseAnthelionUserTime,
      },
      lastAccessAt: {
        selector: ["ul.stats li:contains('Last seen') span", "ul.stats li:contains('Last Seen') span"],
        elementProcess: parseAnthelionUserTime,
      },
      seedingSize: { selector: "li:contains('Seeding Size: ') span", filters: [{ name: "parseSize" }] },
      bonus: { selector: "a[href*='store.php']", filters: [{ name: "replace", args: [/,/g, ""] }] },
      seeding: { selector: "response.seeding", filters: [{ name: "parseNumber" }] },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "Can download, upload, vote on requests, use advanced search, access top 10, and bookmark content.",
    },
    {
      id: 2,
      name: "Member",
      interval: "P2W",
      uploaded: "0.5TiB",
      ratio: 0.8,
      bonus: 5000,
      privilege: "Create & manage collections; Send invites",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P1M",
      uploaded: "1TiB",
      ratio: 1.0,
      alternative: [{ uploads: 5 }, { adoptions: 10 }],
      bonus: 25000,
      privilege: "Upload images; Access Top 10; Purchase Invites; Invite forums",
    },
    {
      id: 4,
      name: "Fanatic",
      interval: "P3M",
      uploaded: "1TiB",
      ratio: 1.0,
      uploads: 5,
      alternative: [{ uploads: 25 }, { adoptions: 50 }],
      bonus: 25000,
      privilege: "Can have 1 personal collage; Receives periodic invites (max 1)",
    },
    {
      id: 5,
      name: "Elite",
      interval: "P6M",
      uploaded: "5TiB",
      ratio: 2.5,
      uploads: 10,
      alternative: [{ uploads: 100 }, { adoptions: 200 }],
      bonus: 250000,
      privilege:
        "Can have a up to 2 personal collages; Can edit film descriptions/trailers; Receives periodic invites (max 2)",
    },
    {
      id: 6,
      name: "Guru",
      interval: "P1Y",
      uploaded: "5TiB",
      ratio: 3.0,
      uploads: 25,
      alternative: [{ uploads: 250 }, { adoptions: 500 }],
      bonus: 500000,
      privilege: "Immune from being put on ratio watch; Receives periodic invites (max 4)",
    },
    {
      id: 7,
      name: "Torrent Master",
      interval: "P2Y",
      uploaded: "10TiB",
      ratio: 3.5,
      uploads: 50,
      alternative: [{ uploads: 500 }, { adoptions: 1000 }],
      bonus: 1000000,
      privilege: "Can have a up to 3 personal collages; Can edit torrents",
    },
  ],
};

export default class Anthelion extends Gazelle {
  private async getAnthelionApiUsername(lastUserInfo: Partial<IUserInfo>): Promise<string> {
    const cachedName = typeof lastUserInfo.name === "string" ? lastUserInfo.name.trim() : "";
    if (cachedName) return cachedName;

    const { data: indexDocument } = await this.request<Document>({ url: "/index.php", responseType: "document" });
    const nameSelector = this.metadata.userInfo?.selectors?.name;
    const name = nameSelector ? this.getFieldData(indexDocument, nameSelector) : undefined;
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("Unable to determine the Anthelion username for the API request");
    }

    return name.trim();
  }

  private async getUserInfoFromAnthelionApi(lastUserInfo: Partial<IUserInfo>): Promise<IUserInfo> {
    const flushUserInfo = {
      id: lastUserInfo.id,
      name: lastUserInfo.name,
      joinTime: lastUserInfo.joinTime,
      status: EResultParseStatus.unknownError,
      updateAt: +new Date(),
      site: this.metadata.id,
    } as IUserInfo;

    try {
      const apiKey = this.userConfig.inputSetting?.apiKey?.trim();
      const userName = await this.getAnthelionApiUsername(lastUserInfo);
      // Anthelion's API authenticates with the api_key query parameter and
      // selects the account by username.
      const { data } = await this.request<IAnthelionApiResponse>({
        url: "/api.php",
        params: {
          action: "user",
          method: "getuserinfo",
          type: "username",
          user: userName,
          api_key: apiKey,
        },
        responseType: "json",
      });

      if (data.status !== "success" || !data.response) {
        throw new Error(data.error || "Anthelion API returned an unsuccessful response");
      }

      const response = data.response;
      const apiUserInfo: Partial<IUserInfo> = {};
      const id = response.ID;
      const name = response.Username;
      const levelName = response.Class;
      if (typeof id === "number" || typeof id === "string") apiUserInfo.id = id;
      if (typeof name === "string") apiUserInfo.name = name;
      if (typeof levelName === "string") apiUserInfo.levelName = levelName;

      const joinTime = parseAnthelionApiTime(response.JoinDate);
      const lastAccessAt = parseAnthelionApiTime(response.LastAccess);
      if (typeof joinTime === "number") apiUserInfo.joinTime = joinTime;
      if (typeof lastAccessAt === "number") apiUserInfo.lastAccessAt = lastAccessAt;

      const uploaded = parseAnthelionApiBytes(response.Uploaded);
      const downloaded = parseAnthelionApiBytes(response.Downloaded);
      const seedingSize = parseAnthelionApiBytes(response.SeedSize);
      if (typeof uploaded === "number") apiUserInfo.uploaded = uploaded;
      if (typeof downloaded === "number") apiUserInfo.downloaded = downloaded;
      if (typeof seedingSize === "number") apiUserInfo.seedingSize = seedingSize;

      if (typeof uploaded === "number" && typeof downloaded === "number") {
        apiUserInfo.ratio = downloaded > 0 ? uploaded / downloaded : uploaded > 0 ? Number.POSITIVE_INFINITY : 0;
      }

      const seeding = parseAnthelionApiNumber(response.SeedCount);
      const bonus = parseAnthelionApiNumber(response.Orbs);
      const uploads = parseAnthelionApiNumber(response.Uploads);
      const adoptions = parseAnthelionApiNumber(response.Adoptions);
      const invites = parseAnthelionApiNumber(response.Invites);
      const grabbed = parseAnthelionApiNumber(response.Grabbed);
      const snatched = parseAnthelionApiNumber(response.Snatched);
      const forumPosts = parseAnthelionApiNumber(response.ForumPosts);
      const hitAndRuns = parseAnthelionApiNumber(response.HnR);
      if (typeof seeding === "number") apiUserInfo.seeding = seeding;
      if (typeof bonus === "number") apiUserInfo.bonus = bonus;
      if (typeof uploads === "number") apiUserInfo.uploads = uploads;
      if (typeof adoptions === "number") apiUserInfo.adoptions = adoptions;
      if (typeof invites === "number") apiUserInfo.invites = invites;
      if (typeof grabbed === "number") apiUserInfo.grabbed = grabbed;
      if (typeof snatched === "number") apiUserInfo.snatched = snatched;
      if (typeof forumPosts === "number") apiUserInfo.forumPosts = forumPosts;
      if (typeof hitAndRuns === "number") apiUserInfo.hitAndRuns = hitAndRuns;
      if (typeof response.UnreadMail !== "undefined") {
        apiUserInfo.messageCount = parseAnthelionApiBoolean(response.UnreadMail) ? 1 : 0;
      }

      Object.assign(flushUserInfo, apiUserInfo);
      if (this.metadata.levelRequirements && flushUserInfo.levelName) {
        flushUserInfo.levelId = this.guessUserLevelId(flushUserInfo);
      }
      flushUserInfo.status = EResultParseStatus.success;
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);
      flushUserInfo.status = EResultParseStatus.parseError;

      if (error instanceof CFBlockedError) {
        flushUserInfo.status = EResultParseStatus.CFBlocked;
      } else if (error instanceof NeedLoginError) {
        flushUserInfo.status = EResultParseStatus.needLogin;
      }
    }

    return flushUserInfo;
  }

  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    if (!this.allowQueryUserInfo || !this.userConfig.inputSetting?.apiKey?.trim()) {
      return super.getUserInfoResult(lastUserInfo);
    }

    return this.getUserInfoFromAnthelionApi(lastUserInfo);
  }

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // ANT 会拒绝 XHR 默认的 Sec-Fetch-Dest: empty，请求需伪装成页面导航。
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      "Sec-Fetch-Dest": "document",
    };
    axiosConfig.withCredentials = true;

    return super.request<T>(axiosConfig, checkLogin);
  }

  /**
   * Anthelion 特性：直接搜索 IMDB 或 TMDB id 会直接跳转到详情（种子组）页面
   * 需要判断当前页面类型以选择对应的解析方式
   */
  public override transformSearchPage(doc: Document, searchConfig: ISearchInput): Promise<ITorrent[]> {
    if (!!doc.querySelector("div#covers")) {
      searchConfig = {
        ...searchConfig,
        searchEntry: {
          ...searchConfig.searchEntry!,
          selectors: { ...searchConfig.searchEntry!.selectors!, ...detailPageSelectors },
        },
      };
    }

    return super.transformSearchPage(doc, searchConfig);
  }

  protected override getTorrentGroupInfo(group: HTMLTableRowElement, searchConfig: ISearchInput): Partial<ITorrent> {
    return this.getFieldsData(group, searchConfig.searchEntry!.selectors!, ["title", "category", "ext_imdb"]);
  }
}
