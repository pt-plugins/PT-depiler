/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/concertos.live/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/concertos.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 站点为 UNIT3D 9.1.7：配置了 API Key 时搜索走 /api/torrents/filter，未配置时解析页面 HTML 搜索结果。
 * 首页列表与用户信息选择器按站点改版覆写。
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  NoUserInputError,
  type ISearchConfig,
  type ISearchEntryRequestConfig,
  type ISearchResult,
  type ISiteMetadata,
} from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";

// 未配置 API Key 时使用的 HTML 搜索结果解析
const htmlSearch: ISearchConfig = {
  ...SchemaMetadata.search,
  selectors: {
    ...SchemaMetadata.search.selectors,
    rows: { selector: "tr.c-torrent-row[data-torrent-id]" },
    id: { selector: ":self", attr: "data-torrent-id" },
    title: { selector: "a.c-torrent-row__name" },
    url: { selector: "a.c-torrent-row__name", attr: "href" },
    link: { selector: "a.c-torrent-row__action--download[href]", attr: "href" },
    category: { selector: ".c-format-cell__category" },
    size: { selector: "td.c-torrent-row__size" },
    author: { selector: "a.user-tag__link" },
    seeders: { selector: ".c-stat-triple__item--seeders .c-stat-triple__value" },
    leechers: { selector: ".c-stat-triple__item--leechers .c-stat-triple__value" },
    completed: { selector: ".c-stat-triple__item--completed .c-stat-triple__value" },
    comments: { text: 0 },
  },
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 2,
  id: "concertos",
  name: "Concertos",
  description: "Concertos is a Private Torrent Tracker for Live Concerts with Strict Quality Control",
  tags: ["音乐", "MV"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://concertos.live/"],

  userInputSettingMeta: [
    {
      name: "apikey",
      label: "API Key（不设置将使用网页搜索）",
      hint: "在 Concertos 的 My Settings → API Key 页面获取；填写后搜索以 Authorization: Bearer 调用 /api/torrents/filter",
      required: false,
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
      ...SchemaMetadata.search.advanceKeywordParams,
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            // UNIT3D 的 imdbId 参数会被强转为整数，不能带 tt 前缀
            config.params.imdbId = String(config.params.name).replace(/^tt/i, "");
            delete config.params.name;
          }
          return config!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search.selectors,
      // JSON 响应可能带 data 包装，沿用多候选路径
      rows: { selector: ["data.data", "data", "torrents.data", "torrents"] },
      id: { selector: ["id", "attributes.id"] },
      title: { selector: ["name", "attributes.name"] },
      url: {
        selector: ":self",
        filters: [
          (row: any) => {
            const id = row?.id ?? row?.attributes?.id;
            return id ? `/torrents/${id}` : "";
          },
        ],
      },
      link: { selector: ["download_link", "attributes.download_link"] },
      category: { selector: ["category.name", "attributes.category.name"] },
      size: { selector: ["size", "attributes.size"] },
      time: { selector: ["created_at", "attributes.created_at"], filters: [{ name: "parseTime" }] },
      author: {
        selector: ["uploader.username", "uploader.name", "attributes.uploader.username", "attributes.uploader.name"],
      },
      seeders: { selector: ["seeders", "attributes.seeders"] },
      leechers: { selector: ["leechers", "attributes.leechers"] },
      completed: { selector: ["times_completed", "attributes.times_completed", "completed", "attributes.completed"] },
      comments: { text: 0 }, // 列表接口不返回评论数
    },
  },

  list: [
    // 首页「New Torrents」列表是 HTML；搜索仍使用上面的 JSON API。
    {
      urlPattern: [/^https?:\/\/concertos\.live\/?(?:\?.*)?$/],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "#c-home-torrents-panel tr.c-torrent-row[data-torrent-id]" },
        id: { selector: ":self", attr: "data-torrent-id" },
        title: { selector: "a.c-torrent-row__name" },
        url: { selector: "a.c-torrent-row__name", attr: "href" },
        link: { selector: "a.c-torrent-row__action--download[href]", attr: "href" },
        category: { selector: ".c-format-cell__category" },
        size: { selector: "td.c-torrent-row__size" },
        time: SchemaMetadata.search.selectors!.time,
        author: { selector: ".c-torrent-row__uploader" },
        seeders: { selector: ".c-stat-triple__item--seeders .c-stat-triple__value" },
        leechers: { selector: ".c-stat-triple__item--leechers .c-stat-triple__value" },
        completed: { selector: ".c-stat-triple__item--completed .c-stat-triple__value" },
        comments: { text: 0 },
        tags: SchemaMetadata.search.selectors!.tags,
      },
    },
    ...SchemaMetadata.list,
  ],

  userInfo: {
    ...SchemaMetadata.userInfo,
    selectors: {
      ...SchemaMetadata.userInfo.selectors,
      uploaded: {
        ...SchemaMetadata.userInfo.selectors!.uploaded,
        selector: "dl.c-kv dt:contains('Account upload (total)') + dd",
      },
      downloaded: {
        ...SchemaMetadata.userInfo.selectors!.downloaded,
        selector: "dl.c-kv dt:contains('Account download (total)') + dd",
      },
      trueUploaded: {
        selector: "dl.c-kv dt:contains('Torrent upload'):not(:contains('credited')) + dd",
        filters: [{ name: "parseSize" }],
      },
      trueDownloaded: {
        selector: "dl.c-kv dt:contains('Torrent download'):not(:contains('credited')):not(:contains('refunded')) + dd",
        filters: [{ name: "parseSize" }],
      },
      trueRatio: {
        ...SchemaMetadata.userInfo.selectors!.trueRatio,
        selector: "dl.c-kv dt:contains('Real ratio') + dd",
      },
      seeding: {
        ...SchemaMetadata.userInfo.selectors!.seeding,
        selector: "dl.c-profile__strip dt:contains('Seeding') + dd",
      },
      bonus: {
        ...SchemaMetadata.userInfo.selectors!.bonus,
        selector: "dl.c-profile__strip dt:contains('Bonus points') + dd",
      },
      uploads: {
        ...SchemaMetadata.userInfo.selectors!.uploads,
        selector: "dl.c-kv:has(a[href*='/uploads'])",
      },
      levelName: {
        ...SchemaMetadata.userInfo.selectors!.levelName,
        selector: "p.c-profile__eyebrow a[href*='/stats/groups/requirements']",
      },
      joinTime: {
        ...SchemaMetadata.userInfo.selectors!.joinTime,
        selector: "p.c-profile__eyebrow span:contains('Registered')",
        filters: [(query: string) => query.replace(/^Registered\s*/i, ""), { name: "parseTime", args: ["yyyy-MM-dd"] }],
      },
    },
  },

  // 来源：https://concertos.live/stats/groups/requirements（页面「By upload」分级，2026-11 实测）
  levelRequirements: [
    {
      id: 0,
      name: "Leech",
      privilege: "无法下载新种子",
    },
    {
      id: 1,
      name: "User",
      ratio: 0.6,
    },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB",
      ratio: 0.4,
      interval: "P30D",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "5TiB",
      ratio: 0.4,
      interval: "P60D",
      privilege: "每月 1 个免费令牌（需 31 天内访问过站点，最多累积 10 个）",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "20TiB",
      ratio: 0.4,
      interval: "P90D",
      privilege: "发布免审核；每月 2 个免费令牌（需 31 天内访问过站点，最多累积 10 个）",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "50TiB",
      ratio: 0.4,
      interval: "P180D",
      privilege: "发布免审核；每月 3 个免费令牌（需 31 天内访问过站点，最多累积 10 个）",
    },
    {
      id: 6,
      name: "Veteran",
      uploaded: "100TiB",
      ratio: 0.4,
      interval: "P365D",
      privilege: "发布免审核；全站免费下载",
    },
  ],
};

export default class Concertos extends Unit3D {
  public override async getSearchResult(
    keywords?: string,
    searchEntry: ISearchEntryRequestConfig = {},
  ): Promise<ISearchResult> {
    // 未填写 API Key 时使用 HTML 搜索结果解析
    if (!this.userConfig.inputSetting?.apikey?.trim()) {
      searchEntry = { ...htmlSearch, ...searchEntry, merge: false };
    }

    return super.getSearchResult(keywords, searchEntry);
  }

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 只向站点 API 搜索请求发送 API Key，不将凭据附在用户页面或种子下载请求上。
    if (axiosConfig.url === "/api/torrents/filter") {
      const apiKey = this.userConfig.inputSetting?.apikey?.trim();
      if (!apiKey) {
        throw new NoUserInputError("API Key");
      }
      axiosConfig.headers = {
        ...(axiosConfig.headers ?? {}),
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      };
    }

    return super.request<T>(axiosConfig, checkLogin);
  }
}
