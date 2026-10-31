/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/dreadvault-api.yml
 * @ProwlarrDefinitions https://github.com/Prowlarr/Indexers/blob/master/definitions/v11/dreadvault-api.yml
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
 * 站点以恐怖题材为主，故 tags 额外标注「恐怖」。
 *
 * 用户等级与站规来自 issue #1642 的登录态页面反馈（2026-10）：
 *  - 等级：User / Wanderer / Survivor / Night Stalker / Grave Keeper / Dreadborn / Shadow Walker / Bloodbound；
 *  - 站规要点：最低分享率 0.70；每个下载种子需做种 5 天（120 小时），因此所有种子都带 H&R 标签；
 *    3 个活跃 HnR 会禁用下载；新账号需在 90 天内产生上传、下载或辅种活动。
 */
const categoryMap: Record<number, string> = {
  1: "Movie",
  2: "TV",
  3: "eBook",
  4: "SoundTrack",
};

/**
 * UNIT3D 的 `freeleech` 字段是「免费比例」（0~100，100 = 全免），下载计费比例 = 1 - free%。
 * 换算表与种子行的公共字段定义见 `schemas/Unit3D.ts`（freeleechFactorMap / IUnit3DRawTorrent）。
 */

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "dreadvault",
  name: "DreadVault",
  description: "DreadVault 是一个专注恐怖题材的私有 PT 站，资源涵盖恐怖电影、剧集、电子书与原声带",
  tags: ["恐怖", "影视", "电子书", "音乐"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://dreadvault.org/"],

  userInputSettingMeta: [
    {
      name: "token",
      label: "API Key",
      hint: "在站点 个人设置（My Settings）→ API Key 页面获取 API Key 并填入此处（搜索与用户信息均使用该 Key）",
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
        filters: [(row: object) => `/torrents/${pickAttr(row, "id")}`],
      },
      link: { selector: ["download_link", "attributes.download_link"] },
      category: {
        selector: ":self",
        filters: [(row: object) => categoryMap[Number(pick(row, "category_id"))] ?? "Other"],
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

  noLoginAssert: {
    ...SchemaMetadata.noLoginAssert,
    urlPatterns: [/doLogin|login|verify|checkpoint|returnto|twofactor/gi],
  },

  // 用户信息走 Unit3D 的 /api/user（Bearer Token），不依赖站点登录态 Cookie
  userInfo: {
    ...SchemaMetadata.userInfo,
    process: [
      {
        requestConfig: { url: "/api/user", method: "GET", responseType: "json" },
        selectors: {
          name: { selector: "username" },
          levelName: { selector: "group" },
          uploaded: { selector: "uploaded", filters: [{ name: "parseSize" }] },
          downloaded: { selector: "downloaded", filters: [{ name: "parseSize" }] },
          ratio: { selector: "ratio", filters: [{ name: "parseNumber" }] },
          bonus: { selector: "seedbonus", filters: [{ name: "parseNumber" }] },
          seeding: { selector: "seeding", filters: [{ name: "parseNumber" }] },
          leeching: { selector: "leeching", filters: [{ name: "parseNumber" }] },
          hnrUnsatisfied: { selector: "hit_and_runs", filters: [{ name: "parseNumber" }] },
        },
      },
    ],
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "DL slots: ∞; Upload Torrents",
    },
    {
      id: 2,
      name: "Wanderer",
      uploaded: "1 TiB",
      ratio: 0.4,
      interval: "P1M",
      privilege: "DL slots: ∞; Upload Torrents; Send invite",
    },
    {
      id: 3,
      name: "Survivor",
      uploaded: "5 TiB",
      ratio: 0.4,
      interval: "P2M",
      uploads: 5,
      privilege: "DL slots: ∞; Upload Torrents; Send invite; Torrent moderation bypass",
    },
    {
      id: 4,
      name: "Night Stalker",
      uploaded: "20 TiB",
      ratio: 0.4,
      interval: "P3M",
      uploads: 20,
      privilege: "DL slots: ∞; Upload Torrents; Send invite; Torrent moderation bypass",
    },
    {
      id: 5,
      name: "Grave Keeper",
      uploaded: "50 TiB",
      ratio: 0.4,
      interval: "P6M",
      uploads: 50,
      privilege: "DL slots: ∞; Upload Torrents; Send invite; Torrent moderation bypass",
    },
    {
      id: 6,
      name: "Dreadborn",
      uploaded: "100 TiB",
      ratio: 0.4,
      interval: "P1Y",
      uploads: 100,
      privilege: "DL slots: ∞; Upload Torrents; Send invite; Freeleech; Torrent moderation bypass",
    },
    {
      id: 7,
      name: "Shadow Walker",
      ratio: 0.4,
      interval: "P1M",
      averageSeedingTime: "P1M",
      seedingSize: "5 TiB",
      uploads: 5,
      privilege:
        "DL slots: ∞; Upload Torrents; Send invite; Immune to automated HnR warnings; Torrent moderation bypass",
    },
    {
      id: 8,
      name: "Bloodbound",
      ratio: 0.4,
      interval: "P3M",
      averageSeedingTime: "P2M",
      seedingSize: "10 TiB",
      uploads: 10,
      privilege:
        "DL slots: ∞; Upload Torrents; Send invite; Freeleech; Immune to automated HnR warnings; Torrent moderation bypass",
    },
  ],
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
      tags.push({ name: "官方", color: "blue-darken-2" });
    }

    // 站规：所有下载种子均需做种 5 天（120 小时），因此每个种子都带 H&R 标记
    tags.push({ name: "H&R", color: "red" });

    torrent.tags = tags;
    return torrent;
  }
}
