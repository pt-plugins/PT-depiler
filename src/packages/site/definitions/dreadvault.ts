/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/dreadvault-api.yml
 * @ProwlarrDefinitions https://github.com/Prowlarr/Indexers/blob/master/definitions/v11/dreadvault-api.yml
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { get } from "es-toolkit/compat";

import Unit3D, { CategoryFree, SchemaMetadata } from "../schemas/Unit3D.ts";
import type { ISearchInput, ISiteMetadata, ITorrent, ITorrentTag } from "../types";
import { buildCategoryOptionsFromDict } from "../utils.ts";

/**
 * DreadVault —— 恐怖题材私有站，运行 UNIT3D v9.2.0（2026-10 实测 https://dreadvault.org/login）。
 *
 * 引擎判定依据：
 *  - 登录/注册页出现 `Powered By UNIT3D v9.2.0` 标识，资源路径 `/build/assets/_auth-*.css`；
 *  - Prowlarr / Jackett 的 `dreadvault-api.yml` 末尾标注 `# json UNIT3D 9.2.0`。
 *
 * 该站与 Generation-Free 同形态：页面检索需登录，API 检索走 UNIT3D 的
 * `/api/torrents/filter`，并需 `Authorization: Bearer <APIKey>`。因此本定义按
 * generationfree / huno 的方式改写 search 与选择器，并把 API Key 注入请求头；
 * 用户信息仍沿用 Unit3D 默认的登录态 HTML 抓取。
 *
 * 字段映射取自 Prowlarr / Jackett（rows=`data[]`，字段在 `attributes` 下）：
 * category_id / name / num_file / files[] / details_link / download_link / meta.poster /
 * meta.genres / imdb_id / tmdb_id / tvdb_id / internal / seeders / leechers /
 * times_completed / created_at / size / freeleech / double_upload / featured。
 *
 * 分类 ID 来自 Prowlarr / Jackett 的 categorymappings：1 Movie / 2 TV / 3 eBook / 4 SoundTrack。
 * 用户等级页（/stats/groups/requirements）与规则页（/pages/1）需要登录，
 * 待站点方提供内容后再补充 levelRequirements 与必要的 H&R 规则。
 */
const categoryMap: Record<number, string> = {
  1: "Movie",
  2: "TV",
  3: "eBook",
  4: "SoundTrack",
};

interface IDreadVaultRawTorrent {
  attributes?: {
    freeleech?: string;
    double_upload?: boolean;
    featured?: boolean;
    internal?: boolean;
  };
  freeleech?: string;
  double_upload?: boolean;
  featured?: boolean;
  internal?: boolean;
  [key: string]: unknown;
}

/** 行内字段既可能挂在 attributes 下，也可能被拍平，两种都取 */
function pick<T>(row: IDreadVaultRawTorrent, key: string, fallback?: T): T {
  const value = get(row, `attributes.${key}`);
  if (value !== undefined && value !== null && value !== "") {
    return value as T;
  }

  const flat = get(row, key);
  if (flat !== undefined && flat !== null && flat !== "") {
    return flat as T;
  }

  return fallback as T;
}

/**
 * 仅从 attributes 取值。
 * 顶层还挂着 JSON:API 的 `type`（恒为 "torrents"）、`id` 等元字段，
 * 若像 pick 那样回落顶层，会把资源的 type 误当成种子的媒介类型。
 */
function pickAttr<T>(row: IDreadVaultRawTorrent, key: string, fallback?: T): T {
  const value = get(row, `attributes.${key}`);
  if (value !== undefined && value !== null && value !== "") {
    return value as T;
  }

  return fallback as T;
}

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "dreadvault",
  name: "DreadVault",
  description: "DreadVault 是一个专注恐怖题材的私有 PT 站，资源涵盖恐怖电影、剧集、电子书与原声带",
  tags: ["影视", "电子书", "音乐"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://dreadvault.org/"],

  favicon: "./_default_unit3d.ico",

  userInputSettingMeta: [
    {
      name: "token",
      label: "API Key",
      hint: "在站点 个人设置（My Settings）→ API Key 页面获取 API Key 并填入此处",
      required: true,
    },
  ],

  category: [
    {
      name: "类别",
      key: "categories",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "brackets" }, // 站点构造为 &categories[]=1&categories[]=2
    },
    CategoryFree,
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
            // UNIT3D 的 imdbId 参数使用不带 tt 前缀的数字 ID
            config.params.imdbId = String(config.params.name).replace(/^tt/i, "");
            delete config.params.name;
          }
          return config!;
        },
      },
    },
    skipNonLatinCharacters: true,
    selectors: {
      rows: { selector: ["data.data", "data"] },
      id: { selector: ["id", "attributes.id"] },
      title: { selector: ["name", "attributes.name"] },
      url: {
        selector: ":self",
        filters: [(row: object) => `/torrents/${pickAttr(row as IDreadVaultRawTorrent, "id")}`],
      },
      link: { selector: ["download_link", "attributes.download_link"] },
      category: {
        selector: ":self",
        filters: [(row: object) => categoryMap[Number(pick(row as IDreadVaultRawTorrent, "category_id"))] ?? "Other"],
      },
      size: { selector: ["size", "attributes.size"] },
      time: {
        selector: ["created_at", "attributes.created_at"],
        // API 返回的是带 Z 的 ISO 8601 时间，先转成绝对时间戳，避免 parseTimeWithZone 再次套用站点偏移
        filters: [(value: string | number) => (typeof value === "number" ? value : new Date(value).getTime())],
      },
      author: { selector: ["uploader.username", "attributes.uploader.username"] },
      seeders: { selector: ["seeders", "attributes.seeders"] },
      leechers: { selector: ["leechers", "attributes.leechers"] },
      completed: { selector: ["times_completed", "attributes.times_completed"] },
      comments: { text: 0 }, // 列表 API 不返回评论数
      ext_imdb: { selector: ["imdb_id", "attributes.imdb_id"], filters: [{ name: "extImdbId" }] },
      ext_tmdb: { selector: ["tmdb_id", "attributes.tmdb_id"] },
      // tags 交由 parseTorrentRowForTags 处理
    },
  },

  // 站点页面的用户信息仍需登录态 HTML；此处仅保证 API 检索可用，userInfo 沿用 Unit3D 默认
  noLoginAssert: {
    ...SchemaMetadata.noLoginAssert,
    urlPatterns: [/doLogin|login|verify|checkpoint|returnto|twofactor/gi],
  },

  // TODO: /stats/groups/requirements 需要登录，待站点方提供等级要求后补充 levelRequirements
};

export default class DreadVault extends Unit3D {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 仅给 API 请求附带 Bearer Token，避免影响用户信息等 HTML 页面的正常抓取
    if ((axiosConfig.url ?? "").includes("/api/")) {
      axiosConfig.headers = {
        ...(axiosConfig.headers ?? {}),
        Authorization: `Bearer ${this.userConfig.inputSetting?.token ?? ""}`,
        Accept: "application/json",
      };
    }

    return super.request<T>(axiosConfig, checkLogin);
  }

  /** API 的促销信息是结构化字段，Unit3D 默认的 DOM 选择器在 JSON 下取不到 */
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const raw = row as IDreadVaultRawTorrent;
    const tags: ITorrentTag[] = [];

    const featured = pick(raw, "featured", false);
    const freeleech = String(pick(raw, "freeleech", ""));
    const doubleUpload = pick(raw, "double_upload", false);
    const internal = pick(raw, "internal", false);

    if (featured) {
      // featured（精选）在 Unit3D 中等价于 100% 免费 + 双倍上传
      tags.push({ name: "Free", color: "blue" });
      tags.push({ name: "2xUp", color: "lime" });
      tags.push({ name: "精选", color: "deep-purple" });
    } else {
      if (freeleech === "100%") {
        tags.push({ name: "Free", color: "blue" });
      } else if (freeleech === "75%") {
        tags.push({ name: "75%", color: "lime-darken-3" });
      } else if (freeleech === "50%") {
        tags.push({ name: "50%", color: "orange" });
      } else if (freeleech === "25%") {
        tags.push({ name: "25%", color: "purple" });
      }

      if (doubleUpload) {
        tags.push({ name: "2xUp", color: "lime" });
      }
    }

    if (internal) {
      tags.push({ name: "官方", color: "blue-darken-2" });
    }

    torrent.tags = tags;
    return torrent;
  }
}
