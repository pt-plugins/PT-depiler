/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/zenith.yml
 *
 * 站点侧依据（2026-10-25 核实）：
 * - 存活：GET https://znth.cx/ → 匿名请求被 Cloudflare 挑战页拦截（HTTP 403 "Just a moment..."）；
 *   扩展内请求携带浏览器 cookie，并有 Cloudflare 拦截提示兜底，正常登录后可用。
 * - Jackett 走官方 JSON API：`api/torrents/filter` + `Authorization: Bearer <apikey>`（login 段即按此验证）；
 *   分类参数 `categories[]`，分类值取自 Jackett categorymappings
 *   （1=Movies 2=TV 3=Console/Games 5=Music 6=Books 7=Audio/Audiobook 8=PC/Software 9=Other/Misc）。
 * - Yata-Dash（2026-09-05 更新，Zenith Staff 2026-07-07 批准）：站点为 Ratioless（晋级要求见下方
 *   levelRequirements，来自其 groups 的真实 requirements）；Staff 于 2026-07 扩容了 /api/user。
 */
import { NoUserInputError, type IAdvancedSearchRequestConfig, type ISiteMetadata } from "../types";
import Unit3D, { SchemaMetadata } from "../schemas/Unit3D.ts";
import { buildCategoryOptionsFromDict } from "../utils.ts";
import { set } from "es-toolkit/compat";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const categoryMap: Record<number, string> = {
  1: "Movie",
  2: "TV",
  3: "Games",
  5: "Music",
  6: "Books",
  7: "Audiobooks",
  8: "Software",
  9: "Misc",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "zenith",
  name: "Zenith",
  aka: ["ZNTH"],
  description:
    "Zenith 是一个 UNIT3D 架构的 Ratioless 影视站（影视 / 音乐 / 图书 / 游戏 / 软件等），搜索走官方 JSON API。",
  tags: ["综合"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Unit3D",

  urls: ["https://znth.cx/"],

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
      name: "User",
      privilege: "基础用户组（站点 Ratioless，但晋级仍按下方要求逐级考核）",
    },
    {
      id: 2,
      name: "Seeker",
      ratio: 0.69,
      interval: "P2W",
      alternative: [{ uploaded: "2TiB" }, { seedingSize: "2TiB" }],
    },
    {
      id: 3,
      name: "Bulker",
      ratio: 0.69,
      interval: "P3W",
      seedingTime: "P1W",
      alternative: [{ uploaded: "5TiB" }, { seedingSize: "4TiB" }],
    },
    {
      id: 4,
      name: "Climber",
      ratio: 0.69,
      interval: "P3W",
      seedingTime: "P1W",
      uploads: 2,
      alternative: [{ uploaded: "10TiB" }, { seedingSize: "8TiB" }],
    },
    {
      id: 5,
      name: "Force",
      ratio: 0.69,
      interval: "P1M",
      seedingTime: "P2W",
      uploads: 10,
      alternative: [{ uploaded: "15TiB" }, { seedingSize: "15TiB" }],
    },
    {
      id: 6,
      name: "Hoarder",
      ratio: 0.69,
      interval: "P1M",
      seedingTime: "P2W",
      alternative: [{ uploaded: "20TiB" }, { seedingSize: "15TiB" }],
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

export default class Zenith extends Unit3D {
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
