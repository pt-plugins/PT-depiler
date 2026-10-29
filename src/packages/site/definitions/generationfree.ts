/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/generationfree-api.yml
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";

import Unit3D, {
  CategoryFree,
  freeleechFactorMap,
  type IUnit3DRawTorrent,
  pick,
  pickAttr,
  SchemaMetadata,
} from "../schemas/Unit3D.ts";
import type { ISearchInput, ISiteMetadata, ITorrent, ITorrentTag } from "../types";
import { buildCategoryOptionsFromDict } from "../utils.ts";

/**
 * Generation-Free（GF-FREE）—— 法语综合站，运行 UNIT3D v9.2.0
 *
 * 引擎判定依据（2026-09 实测 https://generation-free.org/login）：
 *  - 页面直接出现 `UNIT3D v9.2.0` 标识，资源路径 `/build/assets/_auth-*.css`、`name="csrf-token"`；
 *  - Jackett `generationfree-api.yml` 末尾引擎标注为 `# json UNIT3D 9.2.0 (custom)`。
 *
 * 该站**仅提供 API 检索**（Jackett 无 HTML 抓取变体），走 UNIT3D 的 `/api/torrents/filter`
 * 并需 `Authorization: Bearer <APIKey>`；未携带凭据时返回 401 `{"message":"Unauthenticated."}`
 * （与 huno 同形态，已实测两者响应一致）。因此本定义按 huno 的方式改写 search 与 userInfo 选择器，
 * 并把 token 注入请求头。API Key 在站点「My Settings → API Key」页获取。
 *
 * 字段映射取自 Jackett 定义（rows=`data[].attributes`）：category_id / name / num_file / files[] /
 * details_link / download_link / meta.poster / meta.genres / imdb_id / tmdb_id / tvdb_id /
 * internal / seeders / leechers / times_completed / created_at / size / freeleech / double_upload / featured。
 *
 * 来源：https://savept.icu/ 站点目录（status: online, year 2025, type: external）
 */
const categoryMap: Record<number, string> = {
  1: "电影",
  2: "剧集",
  3: "电子书",
  4: "主机游戏",
  5: "软件",
  6: "音乐",
  8: "体育",
};

/**
 * UNIT3D 的 `freeleech` 字段是「免费比例」（0~100，100 = 全免），下载计费比例 = 1 - free%。
 * 换算表与种子行的公共字段定义见 `schemas/Unit3D.ts`（freeleechFactorMap / IUnit3DRawTorrent）。
 */

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "generationfree",
  name: "Generation-Free",
  aka: ["GF-FREE", "GF"],
  description: "Generation-Free (GF-Free) 是一个法语综合类私有 PT 站点，资源涵盖影视、音乐、书籍、游戏与软件",
  tags: ["综合", "影视"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://generation-free.org/"],
  legacyUrls: ["https://generation-free.biz/"],

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
      imdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            config.params.imdbId = config.params.name;
            delete config.params.name;
          }
          return config!;
        },
      },
      tmdb: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.name) {
            config.params.tmdbId = config.params.name;
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
      subTitle: {
        selector: ":self",
        filters: [
          (row: object) => {
            const values = [pickAttr(row, "release_year"), pickAttr(row, "resolution"), pickAttr(row, "type")];
            return values.filter(Boolean).map(String).join(" / ");
          },
        ],
      },
      url: {
        selector: ":self",
        filters: [(row: object) => `/torrents/${pickAttr(row, "id")}`],
      },
      link: { selector: ["download_link", "attributes.download_link"] },
      category: {
        selector: ":self",
        filters: [(row: object) => categoryMap[Number(pick(row, "category_id"))] ?? "Other"],
      },
      size: { selector: ["size", "attributes.size"] },
      time: { selector: ["created_at", "attributes.created_at"] },
      author: {
        selector: ["uploader.username", "uploader.name", "attributes.uploader.username", "attributes.uploader.name"],
      },
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
};

export default class GenerationFree extends Unit3D {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      Authorization: `Bearer ${this.userConfig.inputSetting!.token ?? ""}`,
      Accept: "application/json",
    };

    return super.request<T>(axiosConfig, checkLogin);
  }

  /** API 的促销信息是结构化字段，单元数据默认的 DOM 选择器在 JSON 下取不到 */
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const raw = row as IUnit3DRawTorrent;
    const tags: ITorrentTag[] = [];

    const featured = pick(raw, "featured", false);
    const freeleech = String(pick(raw, "freeleech", ""));
    const doubleUpload = pick(raw, "double_upload", false);
    const internal = pick(raw, "internal", false);

    if (featured) {
      // featured（精选）在 Unit3D 中等价于 100% 免费 + 双倍上传
      torrent.downloadVolumeFactor = 0;
      torrent.uploadVolumeFactor = 2;
      tags.push({ name: "精选", color: "deep-purple" });
    } else {
      const downloadVolumeFactor = freeleechFactorMap[freeleech];
      if (downloadVolumeFactor !== undefined) {
        torrent.downloadVolumeFactor = downloadVolumeFactor;
      }

      // 与 Jackett 一致：double_upload 是布尔值，false 表示已知的「正常」（1），不是未知
      torrent.uploadVolumeFactor = doubleUpload ? 2 : 1;
    }

    if (internal) {
      tags.push({ name: "官组", color: "teal" });
    }

    torrent.tags = tags;
    return torrent;
  }
}
