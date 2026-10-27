/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/infinityhd-api.yml
 *
 * 站点侧依据（2026-10-25 核实）：
 * - 存活：GET https://infinityhd.net/ → 302 到 /login（UNIT3D 登录页）。
 * - Jackett 走官方 JSON API：`api/torrents/filter` + `Authorization: Bearer <apikey>`；
 *   分类参数 `categories[]`，分类值取自 Jackett categorymappings（1=Movies 2=TV 3=Anime 4=Anime Movie 5=Music）。
 * - Yata-Dash（2026-10-10 更新）：该站 def 为 API-only，`/api/user`（2026-10）返回全部统计；
 *   扩展字段名（avg_seed_time / seed_size / uploads_approved / fl_tokens / warnings 等）取自其 api_field_map。
 */
import { NoUserInputError, type IAdvancedSearchRequestConfig, type ISiteMetadata } from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";
import { set } from "es-toolkit/compat";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const categoryMap: Record<number, string> = {
  1: "Movie",
  2: "TV",
  3: "Anime",
  4: "Anime Movie",
  5: "Music",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "infinityhd",
  name: "InfinityHD",
  aka: ["IHD"],
  description: "InfinityHD 是一个 UNIT3D 架构的影视站（电影 / 剧集 / 动画 / 音乐），搜索走官方 JSON API。",
  tags: ["影视", "动漫", "音乐"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["https://infinityhd.net/"],

  userInputSettingMeta: [
    {
      name: "token",
      label: "API Key",
      hint: "站点个人设置页获取 API Key；搜索接口以 Authorization: Bearer 方式使用",
      required: true,
    },
  ],

  category: [
    {
      name: "分类",
      key: "categories",
      keyPath: "params",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "brackets" }, // 站点构造为 &categories[0]=1&categories[1]=2（与 Jackett 的 categories[] 一致）
    },
    {
      name: "促销状态",
      key: "free", // 并不是真实的 key
      keyPath: "params",
      options: [{ name: "免费", value: 1 }], // 不是真实 value，仅用于区分，在 generateRequestConfig 里转成 free[]=100
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const ret = { requestConfig: { params: {} } };
        (selectedOptions as number[]).forEach((value) => {
          if (value == 1) set(ret.requestConfig.params, "free[]", 100); // Jackett: free[]=100 表示 100% 免费
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
    skipNonLatinCharacters: true,
    selectors: {
      rows: { selector: ["data.data", "data"] },
      id: {
        selector: ["id", "attributes.id"],
      },
      title: {
        selector: ["name", "attributes.name"],
      },
      url: {
        selector: ":self",
        filters: [(row: object) => `/torrents/${getApiValue(row, ["id", "attributes.id"])}`],
      },
      link: {
        selector: ["download_link", "attributes.download_link"],
      },
      category: {
        selector: ":self",
        filters: [(row: object) => getApiValue(row, ["category.name", "attributes.category.name"], "Other")],
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
      comments: { text: 0 }, // API 未提供
      status: { text: 0 }, // API 未提供个人做种/下载状态
      progress: { text: 0 },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Flicker",
      privilege: "分享率低于 0.40 时锁定新下载，回到 0.40 以上解锁",
    },
    {
      id: 2,
      name: "Stardust",
      ratio: 0.4,
      privilege: "基础用户组",
    },
    {
      id: 3,
      name: "Protostar",
      uploaded: "100GiB",
      ratio: 0.5,
      interval: "P2W",
      seedingTime: "P1W",
    },
    {
      id: 4,
      name: "Asteroid",
      seedingSize: "250GiB",
      ratio: 0.6,
      interval: "P2M",
      seedingTime: "P2W",
    },
    {
      id: 5,
      name: "Spark",
      uploads: 50,
      ratio: 0.75,
      interval: "P1M",
      alternative: [{ seedingSize: "100GiB" }, { uploaded: "250GiB" }],
      privilege: "或月上传 5 条",
    },
    {
      id: 6,
      name: "Moon",
      seedingSize: "500GiB",
      ratio: 0.75,
      interval: "P3M",
      seedingTime: "P1M",
    },
    {
      id: 7,
      name: "Beacon",
      uploads: 75,
      ratio: 1,
      interval: "P2M",
      seedingTime: "P2W",
      alternative: [{ seedingSize: "250GiB" }, { uploaded: "500GiB" }],
      privilege: "或月上传 10 条",
    },
    {
      id: 8,
      name: "Planet",
      seedingSize: "1TiB",
      ratio: 1,
      interval: "P4M",
      seedingTime: "P1M14D",
    },
    {
      id: 9,
      name: "Flare",
      uploads: 100,
      ratio: 1,
      interval: "P3M",
      seedingTime: "P3W",
      alternative: [{ seedingSize: "500GiB" }, { uploaded: "1TiB" }],
      privilege: "或月上传 20 条",
    },
    {
      id: 10,
      name: "Gas Giant",
      seedingSize: "2.5TiB",
      ratio: 1,
      interval: "P6M",
      seedingTime: "P2M",
    },
    {
      id: 11,
      name: "Nova",
      uploads: 250,
      ratio: 1.5,
      interval: "P4M",
      seedingTime: "P1M",
      alternative: [{ seedingSize: "1TiB" }, { uploaded: "2.5TiB" }],
      privilege: "或月上传 30 条",
    },
    {
      id: 12,
      name: "Black Hole",
      seedingSize: "16TiB",
      ratio: 1.5,
      interval: "P1Y",
      seedingTime: "P3M",
    },
    {
      id: 13,
      name: "Supernova",
      uploads: 500,
      ratio: 2,
      interval: "P9M",
      seedingTime: "P2M",
      alternative: [{ seedingSize: "10TiB" }, { uploaded: "25TiB" }],
      privilege: "或月上传 50 条",
    },
  ],
};

function getApiValue(row: object, paths: string[], fallback: unknown = ""): unknown {
  for (const p of paths) {
    const value = getRowValue(row, p);
    if (value !== undefined && value !== null && typeof value !== "object") {
      return value;
    }
  }
  return fallback;
}

function getRowValue(row: object, path: string): unknown {
  let current: unknown = row;
  for (const key of path.split(".")) {
    if (current === null || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

export default class InfinityHD extends Unit3D {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    const token = this.userConfig.inputSetting?.token;
    if (!token) {
      throw new NoUserInputError("API Key"); // 未填写 API Key 时直接拦截，避免请求被误判为需要登录
    }

    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      Authorization: `Bearer ${token}`, // Jackett 实证：Authorization: Bearer <apikey>
      origin: this.url,
    };

    return super.request<T>(axiosConfig, checkLogin);
  }
}
