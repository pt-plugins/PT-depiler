import { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import urlJoin from "url-join";
import Sizzle from "sizzle";
import { axios, isCloudflareBlocked } from "../utils/adapter";

import PrivateSite from "./AbstractPrivateSite";

import {
  EResultParseStatus,
  ETorrentStatus,
  TSchemaMetadataListSelectors,
  type ISiteMetadata,
  type IUserInfo,
  type ITorrent,
  type ITorrentTag,
  type ISearchInput,
  CFBlockedError,
  NoTorrentsError,
} from "../types";
import { parseSizeString } from "../utils";

const enableAvistazUserInfoFetching = import.meta.env.VITE_ENABLE_AVISTAZ_USER_INFO_FETCHING === "true";

interface AuthSuccessResp {
  token: string;
  expiry: number;
}

interface AuthFailResp {
  message: string;
}

type AvzNetAuthResp = AuthSuccessResp | AuthFailResp;

function isAuthSuccessResp(data: unknown): data is AuthSuccessResp {
  return (
    !!data &&
    typeof data === "object" &&
    "token" in data &&
    typeof data.token === "string" &&
    data.token.trim().length > 0 &&
    "expiry" in data &&
    typeof data.expiry === "number" &&
    Number.isFinite(data.expiry) &&
    data.expiry > 0
  );
}

function isAuthFailResp(data: unknown): data is AuthFailResp {
  return !!data && typeof data === "object" && "message" in data && typeof data.message === "string";
}

const commonListSelectors: TSchemaMetadataListSelectors = {
  subTitle: { text: "" },
  comments: { text: "N/A" },
  category: { selector: "i[data-original-title]", attr: "data-original-title" },
};

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function getText(element?: Element | null): string {
  return element ? normalizeText((element as HTMLElement).innerText ?? element.textContent ?? "") : "";
}

function getOwnText(element?: Element | null): string {
  if (!element) return "";
  return normalizeText(
    Array.from(element.childNodes)
      .filter((node) => node.nodeType === 3)
      .map((node) => node.textContent ?? "")
      .join(" "),
  );
}

function getProfileTableValue(document: Document, label: string): string {
  const labelPattern = new RegExp(`^${label}$`, "i");
  for (const row of Sizzle("table tr", document)) {
    const cells = Array.from(row.children);
    if (cells.length < 2) continue;

    const rowLabel = getText(cells[0]).replace(/^[^A-Za-z]+/, "");
    if (labelPattern.test(rowLabel)) {
      const ownText = getOwnText(cells[1]);
      if (ownText) return ownText;

      const semanticValue = Sizzle(".user-group, .badge-user, .badge, strong, span", cells[1])[0];
      return getText(semanticValue) || getText(cells[1]);
    }
  }
  return "";
}

function getTorrentRowSize(row: Element): number {
  const selectors = [
    "span.badge-extra.fa-database",
    "div.d-block span.text-yellow",
    "td[data-label='Size']",
    ".torrent-size",
    ".text-yellow",
  ];

  for (const selector of selectors) {
    const element = Sizzle(selector, row)[0];
    if (!element) continue;

    const size = parseSizeString(getText(element));
    if (size > 0) return size;
  }

  const sizeMatch = getText(row).match(/\d[\d,]*(?:\.\d+)?\s*[ZEPTGMK]i?B\b/i);
  if (sizeMatch) return parseSizeString(sizeMatch[0]);

  return 0;
}

function isSeedingTorrentRow(row: Element): boolean {
  const cells = Array.from(row.children);
  return cells.some((cell) => /^(?:seed|seeding)$/i.test(getText(cell)));
}

function getActivePageCount(document: Document): number {
  return Sizzle("a[href*='page=']", document).reduce((maxPage, link) => {
    const pageMatch = link.getAttribute("href")?.match(/[?&]page=(\d+)/);
    return pageMatch ? Math.max(maxPage, Number(pageMatch[1])) : maxPage;
  }, 1);
}

function getSeedingSize(document: Document): number {
  return Sizzle("table tr", document).reduce((total, row) => {
    if (!isSeedingTorrentRow(row)) return total;
    return total + getTorrentRowSize(row);
  }, 0);
}

function getBonusPerHour(document: Document): string {
  for (const row of Sizzle("table tr", document)) {
    const cells = Array.from(row.children);
    if (cells.length < 2) continue;

    const label = getText(cells[0]);
    if (/^(?:Total Earnings|Projected Hourly Rate)\b/i.test(label)) {
      return getText(cells[cells.length - 1]);
    }
  }

  for (const heading of Sizzle("h1, h2, h3, h4, h5, h6", document)) {
    const text = getText(heading);
    if (/\d[\d,.]*\s*(?:points per hour|BP\/hr)/i.test(text)) return text;
  }

  return "";
}

function getProfileCounterValue(document: Document, labels: string[]): string {
  const escapedLabels = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const labelPattern = new RegExp(`(?:${escapedLabels.join("|")})`, "i");
  for (const item of Sizzle(".card .tag, .well li", document)) {
    const text = getText(item);
    if (labelPattern.test(text)) {
      return text;
    }
  }
  return "";
}

function getRatioBarValue(document: Document, label: string): string {
  const titledElement = Sizzle(`.ratio-bar [title='${label}']`, document)[0];
  if (titledElement) {
    return getText(titledElement);
  }

  const labelPattern = new RegExp(`\\b${label}\\s*:`, "i");
  for (const item of Sizzle(".ratio-bar li, .ratio-bar .d-inline-block", document)) {
    const text = getText(item);
    if (labelPattern.test(text)) {
      return text;
    }
  }
  return "";
}

async function mergeUserInfo<T extends Partial<IUserInfo>>(
  userInfo: IUserInfo,
  parseAction: () => Promise<T>,
): Promise<IUserInfo> {
  try {
    return { ...userInfo, ...(await parseAction()) };
  } catch (error) {
    return userInfo;
  }
}

export const avzNetDiscountMap: Record<number, string> = {
  1: "Free-Download",
  2: "Half-Download",
  3: "Double Upload",
};

export interface IAvzNetRawTorrent {
  id: number;
  file_name: string;
  file_size: number;
  file_count: number;
  info_hash: string;
  url: string;
  download: string;
  category?: {
    [key: string]: string;
  };
  type?: string;
  resolution: {
    [key: string]: string;
  };
  created_at: string;
  seed: number;
  leech: number;
  completed: number;
  downloaded: number;
  upload_multiply: number;
  download_multiply: number;
  audio?: Array<{
    language: string;
  }>;
  subtitle?: Array<{
    language: string;
  }>;
  movie_tv?: {
    imdb: string;
    tmdb: string;
    tvdb: string;
    [key: string]: any;
  };
  images: string[];
  description: string;
  [key: string]: any;
}

// 种子列表页
export const listTorrentPageMetadata = {
  urlPattern: ["/torrents"],
  mergeSearchSelectors: false,
  selectors: {
    ...commonListSelectors,
    rows: { selector: "#content-area > div.block > div > table:nth-child(3) > tbody > tr" },

    id: {
      selector: "div.torrent-file a[href*='/torrent/']",
      attr: "href",
      filters: [
        (href: string) => {
          const torrentIdMatch = href.match(/\/torrent\/(\d)/);
          if (torrentIdMatch && torrentIdMatch[1]) {
            return torrentIdMatch[1];
          }
          return undefined;
        },
      ],
    },
    title: { selector: "div.torrent-file a[href*='/torrent/']" },
    url: { selector: "div.torrent-file a[href*='/torrent/']", attr: "href" },
    link: { selector: "td:nth-child(3) a[href*='/download/torrent/']", attr: "href" },
    // time显示为1 minute/1 hour，放弃获取
    size: { selector: "td:nth-child(6)", filters: [{ name: "parseSize" }] },

    seeders: { selector: "td:nth-child(7)" },
    leechers: { selector: "td:nth-child(8)" },
    completed: { selector: "td:nth-child(9)" },
  },
};

// 下载历史页和HR页
export const listHistoryPageMetadata = {
  urlPattern: ["/profile/(.+)/history"],
  mergeSearchSelectors: false,
  selectors: {
    ...commonListSelectors,
    rows: { selector: "div.block > div.table-responsive > table > tbody > tr" },

    id: {
      selector: "a.torrent-filename",
      attr: "href",
      filters: [
        (href: string) => {
          const match = href.match(/\/torrent\/(\d+)/);
          return match ? match[1] : undefined;
        },
      ],
    },
    // Bootstrap tooltip 初始化后将 title 移至 data-original-title
    title: { selector: "a.torrent-filename", attr: "data-original-title" },
    category: { selector: "td:first-child i", attr: "data-original-title" },
    url: { selector: "a.torrent-filename", attr: "href" },
    link: { selector: "a.torrent-download-icon", attr: "href" },
    // 行内存在同色的 span.badge-extra（上传量/下载量/Credited Download），用 FA 图标类唯一区分
    size: { selector: "span.badge-extra.fa-database", filters: [{ name: "parseSize" }] },
    seeders: { selector: "span.badge-extra.fa-arrow-up" },
    leechers: { selector: "span.badge-extra.fa-arrow-down" },
    completed: { selector: "span.badge-extra.fa-check" },
  },
};

export const SchemaMetadata: Pick<
  ISiteMetadata,
  "version" | "schema" | "type" | "timezoneOffset" | "search" | "userInfo" | "userInputSettingMeta" | "list" | "detail"
> = {
  version: 0,
  schema: "AvistazNetwork",
  type: "private",
  // tzOffset@refs: https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Indexers/Definitions/Abstract/AvistazTracker.cs#L28C9-L28C122
  timezoneOffset: "-0400",

  search: {
    keywordPath: "params.search",
    requestConfig: {
      url: "/api/v1/jackett/torrents",
      responseType: "json",
      params: { in: 1, limit: 50 }, // 最大50个结果
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.search) {
            config.params.imdb = config.params.search;
            delete config.params.search;
          }
          return config!;
        },
      },
      tvdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.search) {
            config.params.tvdb = config.params.search;
            delete config.params.search;
          }
          return config!;
        },
      },
      tmdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.search) {
            config.params.tmdb = config.params.search;
            delete config.params.search;
          }
          return config!;
        },
      },
    },
    selectors: {
      rows: { selector: "data" },
      id: { selector: "id" },
      title: { selector: "file_name" },
      subTitle: { text: "" }, // AvzNet不提供subTitle
      url: { selector: "url" },
      link: { selector: "download" },
      category: {
        selector: "category",
        filters: [
          (category: Record<string, string> | undefined) => {
            if (!category) return "";
            const values = Object.values(category);
            return values.length > 0 ? values[0] : "";
          },
        ],
      },
      time: { selector: "created_at", filters: [{ name: "parseTime" }] },
      size: { selector: "file_size" },
      author: { text: "" },
      seeders: { selector: "seed" },
      leechers: { selector: "leech" },
      completed: { selector: "completed" },
      comments: { text: "N/A" },
      // tags 交由 parseTorrentRowForTags 处理
      // AvzNet不提供progress, status
      progress: { text: 0 },
      status: { text: ETorrentStatus.unknown },

      ext_imdb: { selector: "movie_tv.imdb", filters: [{ name: "extImdbId" }] },
    },
  },

  list: [listTorrentPageMetadata, listHistoryPageMetadata],

  detail: {
    urlPattern: ["/torrent/"],
    selectors: {
      id: {
        selector: ":self",
        elementProcess: (t) => {
          const e = t.URL,
            r = e.match(/\/detail\/(\d+)/);
          return r ? r[1] : e;
        },
      },
      title: { selector: "table.table tr:contains('Title') td:nth-child(2)" },
      link: { selector: "a.btn-primary[href$='.torrent']", attr: "href" },
    },
  },

  userInfo: {
    pickLast: ["name"],
    selectors: {
      name: {
        selector: ":self",
        elementProcess: (document: Document) =>
          getProfileTableValue(document, "Username") ||
          getText(
            Sizzle(
              ".ratio-bar a[href*='/profile/'] .user-group, .ratio-bar a[href*='/profile/'] .badge-user",
              document,
            )[0],
          ),
      },
      levelName: {
        selector: ":self",
        elementProcess: (document: Document) =>
          getProfileTableValue(document, "Rank") ||
          getText(
            Sizzle(
              ".ratio-bar .container > div:nth-child(2) .user-group, .ratio-bar li:nth-child(2) .badge-user",
              document,
            )[0],
          ),
      },
      uploaded: {
        selector: ":self",
        elementProcess: (document: Document) =>
          getProfileTableValue(document, "Uploaded") || getRatioBarValue(document, "Upload"),
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: ":self",
        elementProcess: (document: Document) =>
          getProfileTableValue(document, "Downloaded") || getRatioBarValue(document, "Download"),
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: ":self",
        elementProcess: (document: Document) =>
          getProfileTableValue(document, "Ratio") || getRatioBarValue(document, "Ratio"),
        filters: [{ name: "parseNumber" }],
      },
      bonus: {
        selector: ":self",
        elementProcess: (document: Document) =>
          getProfileTableValue(document, "Bonus Points") || getRatioBarValue(document, "Bonus"),
        filters: [{ name: "parseNumber" }],
      },
      bonusPerHour: {
        selector: ":self",
        elementProcess: getBonusPerHour,
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        selector: ":self",
        elementProcess: (document: Document) => getProfileTableValue(document, "Joined"),
        filters: [(value: string) => value.split("(")[0].trim(), { name: "parseTime", args: ["dd MMM yyyy hh:mm a"] }],
      },
      lastAccessAt: {
        selector: ":self",
        elementProcess: (document: Document) => getProfileTableValue(document, "Last Access"),
        filters: [(value: string) => value.split("(")[0].trim(), { name: "parseTime", args: ["dd MMM yyyy hh:mm a"] }],
      },
      uploads: {
        selector: ":self",
        elementProcess: (document: Document) => getProfileCounterValue(document, ["Uploads", "Total Uploads"]),
        filters: [{ name: "parseNumber" }],
      },
      snatches: {
        selector: ":self",
        elementProcess: (document: Document) => getProfileCounterValue(document, ["Downloads"]),
        filters: [{ name: "parseNumber" }],
      },
      seeding: {
        selector: ":self",
        elementProcess: (document: Document) => getProfileCounterValue(document, ["Seeds", "Seeding"]),
        filters: [{ name: "parseNumber" }],
      },
      leeching: {
        selector: ":self",
        elementProcess: (document: Document) => getProfileCounterValue(document, ["Leeching", "Peers"]),
        filters: [{ name: "parseNumber" }],
      },
      hnrUnsatisfied: {
        selector: ":self",
        elementProcess: (document: Document) => getProfileCounterValue(document, ["Hit & Run"]),
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  userInputSettingMeta: [
    {
      name: "username",
      label: "Username",
      hint: "Fill with your username." + "Please Make Sure your RANK >= Member",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      hint: "Fill with your password" + "Please confirm enable ‘Enable RSS Feed’ in account settings",
      required: true,
    },
    {
      name: "pid",
      label: "PID",
      hint:
        "Find in Profile Site, reset in Account Setting Site if you want to reset." +
        "PID is like your password, you must keep it safe!",
      required: true,
    },
  ],
};

export default class AvistazNetwork extends PrivateSite {
  /*
    应站点要求，默认不启用用户数据获取。仅供非上游构建显式开启。
    > User information will never be available in any form or API, as we respect the privacy and confidentiality of user information.
    @refs: https://github.com/pt-plugins/PT-Plugin-Plus/issues/996#issuecomment-1057856310
  */
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo: IUserInfo = {
      status: EResultParseStatus.unknownError,
      updateAt: +new Date(),
      site: this.metadata.id,
    };

    if (!enableAvistazUserInfoFetching) {
      return {
        ...flushUserInfo,
        status: EResultParseStatus.passParse,
        name: this.userConfig.inputSetting?.username,
        levelName: "应站点要求，不启用用户数据获取",
      };
    }

    if (!this.allowQueryUserInfo) {
      flushUserInfo.status = EResultParseStatus.passParse;
      return flushUserInfo;
    }

    // 对 AvistazNetwork，如果定义了 process，则按照 AbstractPrivateSite 的方式处理
    if (Array.isArray(this.metadata.userInfo?.process)) {
      return await super.getUserInfoResult(lastUserInfo);
    }

    const userName = (lastUserInfo.name as string | undefined) || this.userConfig.inputSetting?.username;
    if (!userName) {
      flushUserInfo.status = EResultParseStatus.parseError;
      return flushUserInfo;
    }

    flushUserInfo = await mergeUserInfo(flushUserInfo, () => this.getBaseInfoFromSite(userName));
    flushUserInfo.name ||= userName;

    if (flushUserInfo.name) {
      flushUserInfo = await mergeUserInfo(flushUserInfo, () =>
        this.getExtendInfoFromProfile(flushUserInfo.name as string),
      );
    }

    const hasProfileInfo = [
      "levelName",
      "uploaded",
      "downloaded",
      "ratio",
      "bonus",
      "joinTime",
      "lastAccessAt",
      "uploads",
      "snatches",
      "seeding",
      "leeching",
      "hnrUnsatisfied",
    ].some((key) => typeof flushUserInfo[key] !== "undefined" && flushUserInfo[key] !== "");

    if (hasProfileInfo) {
      flushUserInfo = await mergeUserInfo(flushUserInfo, () =>
        this.getUserSeedingTorrents(flushUserInfo.name as string),
      );
      flushUserInfo = await mergeUserInfo(flushUserInfo, () => this.getUserBonusPerHour(flushUserInfo.name as string));
    }

    if (this.metadata.levelRequirements && flushUserInfo.levelName && typeof flushUserInfo.levelId === "undefined") {
      flushUserInfo.levelId = this.guessUserLevelId(flushUserInfo as IUserInfo);
    }

    flushUserInfo.status =
      flushUserInfo.name && hasProfileInfo ? EResultParseStatus.success : EResultParseStatus.parseError;

    return flushUserInfo;
  }

  protected async getBaseInfoFromSite(
    userName: string = this.userConfig.inputSetting?.username ?? "",
  ): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: pageDocument } = await this.request<Document>({
      url: urlJoin("/profile", userName),
      responseType: "document",
    });

    return this.getFieldsData(pageDocument, this.metadata.userInfo?.selectors!, [
      "name",
      "levelName",
      "uploaded",
      "downloaded",
      "ratio",
      "bonus",
    ]) as Partial<IUserInfo>;
  }

  protected async getExtendInfoFromProfile(userName: string): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);
    const { data: pageDocument } = await this.request<Document>({
      url: urlJoin("/profile", userName),
      responseType: "document",
    });

    return this.getFieldsData(pageDocument, this.metadata.userInfo?.selectors!, [
      "joinTime",
      "lastAccessAt",
      "uploads",
      "snatches",
      "seeding",
      "leeching",
      "hnrUnsatisfied",
    ]) as Partial<IUserInfo>;
  }

  protected async getUserSeedingTorrents(userName: string): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    try {
      const activePageUrl = urlJoin("/profile", userName, "active");
      const { data: firstPage } = await this.request<Document>({
        url: activePageUrl,
        responseType: "document",
      });

      let seedingSize = getSeedingSize(firstPage);
      const pageCount = Math.min(getActivePageCount(firstPage), 100);

      for (let page = 2; page <= pageCount; page++) {
        await this.sleepAction(this.metadata.userInfo?.requestDelay);
        const { data: pageDocument } = await this.request<Document>({
          url: activePageUrl,
          params: { page },
          responseType: "document",
        });
        seedingSize += getSeedingSize(pageDocument);
      }

      return seedingSize > 0 ? { seedingSize } : {};
    } catch (error) {
      return {};
    }
  }

  protected async getUserBonusPerHour(userName: string): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    try {
      const { data: bonusPage } = await this.request<Document>({
        url: urlJoin("/profile", userName, "bonus"),
        responseType: "document",
      });
      const bonusPerHour = this.getFieldData(bonusPage, this.metadata.userInfo?.selectors?.bonusPerHour!);
      return typeof bonusPerHour === "number" && Number.isFinite(bonusPerHour) && bonusPerHour >= 0
        ? { bonusPerHour }
        : {};
    } catch (error) {
      return {};
    }
  }

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    const isAuthApi = axiosConfig.url === "/api/v1/jackett/auth";
    const isTorrentSearchApi = axiosConfig.url?.startsWith("/api/v1/jackett/torrents");

    if (isAuthApi) {
      axiosConfig.method = "POST";
      axiosConfig.data = {
        ...axiosConfig.data,
        username: this.userConfig.inputSetting?.username ?? "",
        password: this.userConfig.inputSetting?.password ?? "",
        pid: this.userConfig.inputSetting?.pid ?? "",
      };
      axiosConfig.headers = {
        ...(axiosConfig.headers ?? {}),
        "Content-Type": "application/x-www-form-urlencoded",
      };
    }
    if (isTorrentSearchApi) {
      axiosConfig.method = "GET";
      const token = await this.getAuthToken();
      axiosConfig.headers = {
        ...(axiosConfig.headers ?? {}),
        Authorization: `Bearer ${token}`,
      };
    }

    if (!isAuthApi && !isTorrentSearchApi) {
      return super.request<T>(axiosConfig, checkLogin);
    }

    axiosConfig.baseURL ??= this.url;
    axiosConfig.timeout ??= this.userConfig.timeout ?? 30e3;
    await this.sleepAction(this.metadata.requestDelay ?? 0);

    const requestApi = async (): Promise<AxiosResponse<T>> => {
      try {
        return await axios.request<T>(axiosConfig);
      } catch (error) {
        const response = (error as AxiosError<T>).response;
        if (!response) {
          throw error;
        }

        return response;
      }
    };

    let req = await requestApi();

    if (isCloudflareBlocked(req)) {
      throw new CFBlockedError();
    }

    // Jackett API auth is token based; do not reuse webpage login assertions here.
    if (isTorrentSearchApi && [401, 403].includes(req.status)) {
      await this.storeRuntimeSettings("authToken", "");
      await this.storeRuntimeSettings("authExpiry", 0);
      axiosConfig.headers = {
        ...(axiosConfig.headers ?? {}),
        Authorization: `Bearer ${await this.getAuthToken()}`,
      };

      req = await requestApi();

      if (isCloudflareBlocked(req)) {
        throw new CFBlockedError();
      }
    }

    if (req.status >= 400) {
      if (isTorrentSearchApi && [400, 404, 422].includes(req.status)) {
        throw new NoTorrentsError();
      }

      throw Error(`Network Error: ${req.status} ${req.statusText || ""}`.trim());
    }

    return req;
  }

  // 使用 retrieveRuntimeSettings 作为中间存储，存储 `token` 以及 `expiry` 降低授权频率
  public async getAuthToken(lastUserInfo: Partial<IUserInfo> = {}): Promise<string> {
    const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳，单位为秒

    // 1. 判断 runtimeSettings 获取存储的 token 和 expiry
    const storedAuthToken = await this.retrieveRuntimeSettings<string>("authToken");
    const storedAuthExpiry = await this.retrieveRuntimeSettings<number>("authExpiry");

    if (
      typeof storedAuthToken === "string" &&
      storedAuthToken.trim().length > 0 &&
      typeof storedAuthExpiry === "number" &&
      Number.isFinite(storedAuthExpiry) &&
      storedAuthExpiry > currentTime
    ) {
      console.log("Found valid token in runtimeSettings. Returning existing token.");
      return storedAuthToken.trim();
    }

    // 2. 如果过期或不存在，发起新的授权请求
    console.log("Token expired or not found. Requesting new token...");
    try {
      const { data: apiAuth } = await this.request<AvzNetAuthResp>({
        url: "/api/v1/jackett/auth",
        responseType: "json",
      });

      // 使用类型守卫判断响应类型
      if (isAuthSuccessResp(apiAuth)) {
        // 检查 token 属性是否存在且为字符串

        // 3. 计算新的过期时间并存储
        const newAuthExpiry = currentTime + apiAuth.expiry; // expiry 已经是 number 类型，直接相加
        const authToken = apiAuth.token.trim();
        await this.storeRuntimeSettings("authToken", authToken);
        await this.storeRuntimeSettings("authExpiry", newAuthExpiry);

        console.log("Successfully obtained and stored new token.");
        return authToken;
      } else if (isAuthFailResp(apiAuth)) {
        // 检查 message 属性是否存在且为字符串
        const message = apiAuth.message.trim() || "Authorization failed";
        console.error(`Failed to get new token: ${message}`);
        throw new Error(`AvistaZ authorization failed: ${message}`);
      } else {
        console.error("Failed to get new token: Unexpected response format or missing required properties.");
        throw new Error("AvistaZ authorization failed: Unexpected response format or missing required properties.");
      }
    } catch (error) {
      throw new Error(`Error during authorization request: ${(error as Error).message}`);
    }
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IAvzNetRawTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const tags: ITorrentTag[] = [];

    const { upload_multiply, download_multiply } = row as { upload_multiply?: number; download_multiply?: number };
    if (upload_multiply === 2) {
      tags.push({ name: `${upload_multiply}xUp`, color: "lime" });
    }
    switch (download_multiply) {
      case 0:
        tags.push({ name: "Free", color: "blue" });
        break;
      case 0.5:
        tags.push({ name: "50%", color: "deep-orange-darken-1" });
        break;
    }

    torrent.tags = tags;
    return torrent;
  }
}
