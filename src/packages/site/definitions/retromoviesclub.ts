/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/retromoviesclub-api.yml
 * @ProwlarrDefinitions https://github.com/Prowlarr/Indexers/blob/master/definitions/v11/retromoviesclub-api.yml
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
import { NoUserInputError, type ISearchInput, type ISiteMetadata, type ITorrent, type ITorrentTag } from "../types";
import { buildCategoryOptionsFromDict } from "../utils.ts";

/**
 * RetroMoviesClub（RMC）—— 经典电影私有站，收录 2000 年及以前上映的电影，运行 UNIT3D v9.2.0。
 *
 * 引擎判定依据（2026-10 实测 https://retro-movies.club/login）：
 *  - 登录页出现 `Powered By UNIT3D v9.2.0` 标识，资源路径 `/build/assets/_auth-*.css`；
 *  - Prowlarr / Jackett 的 `retromoviesclub-api.yml` 末尾标注 `# json UNIT3D 9.2.0`。
 *
 * 该站为 API-only 站：未登录访问 `/torrents/`、`/stats/groups/requirements`、`/pages/1` 均 302 到 `/login`，
 * 检索走 UNIT3D 的 `/api/torrents/filter` 并需 `Authorization: Bearer <APIKey>`（与 dreadvault / generationfree 同形态）。
 * 因此本定义改写 search 与选择器，把 API Key 注入请求头；用户信息走 `/api/user`（Bearer），
 * 不依赖浏览器登录态 —— dreadvault 的实测表明扩展请求拿不到站点会话时会整站报「需要登录」。
 *
 * 字段映射取自 Prowlarr / Jackett（rows=`data[]`，字段在 `attributes` 下）：
 * category_id / name / num_file / files[] / details_link / download_link / meta.poster /
 * meta.genres / imdb_id / tmdb_id / tvdb_id / internal / seeders / leechers /
 * times_completed / created_at / size / freeleech / double_upload / featured。
 * 分类 ID 来自 Prowlarr 的 categorymappings：仅 1 Movie（站点规则亦限定只收经典电影）。
 * 最低分享率 0.4 与 48 小时保种（minimumseedtime=172800）同样取自该 yml。
 *
 * 用户等级与站规来自 issue #1655 的登录态页面截图（2026-10）：
 *  - 等级：Actor / Film Buff / Supporting Actor / Leading Actor / Movie Star / Screen Legend（上传路线）、
 *    Superstar / Preservationist（做种路线）；
 *  - 站规：不分等级均需保种 48 小时，下载后 7 天内达标；站规页明确「不会因不活跃封禁或删除账号」。
 */
const categoryMap: Record<number, string> = {
  1: "Movie",
};

/**
 * UNIT3D 的 `freeleech` 字段是「免费比例」（0~100，100 = 全免），下载计费比例 = 1 - free%。
 * 换算表与种子行的公共字段定义见 `schemas/Unit3D.ts`（freeleechFactorMap / IUnit3DRawTorrent）。
 */

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "retromoviesclub",
  name: "RetroMoviesClub",
  aka: ["RMC"],
  description: "RetroMoviesClub（RMC）是一个专注 2000 年及以前经典电影的私有 PT 站，仅接受 2000 年前上映的电影资源",
  tags: ["影视", "电影"],

  type: "private",
  schema: "Unit3D",

  urls: ["https://retro-movies.club/"],

  // 图标取自 public/icons/site/retromoviesclub.ico（本地图标优先级最高，无需再写 favicon 字段）

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
      cross: { mode: "brackets" }, // 站点构造为 &categories[]=1
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

  // 用户信息走 Unit3D 的 /api/user（Bearer Token），不依赖站点登录态 Cookie。
  // 该接口（v9.2.0 `App\Http\Resources\UserResource`）只返回 username / group / uploaded /
  // downloaded / ratio / buffer / seeding / leeching / seedbonus / hit_and_runs，
  // 不含注册时间、做种体积、平均做种时间与发布数，故这些列会留空。
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
      name: "Actor",
      privilege: "无限下载槽；发布种子；发送邀请",
    },
    {
      id: 2,
      name: "Film Buff",
      uploaded: "1TiB",
      ratio: 0.4,
      interval: "P1M",
      privilege: "无限下载槽；发布种子；发送邀请",
    },
    {
      id: 3,
      name: "Supporting Actor",
      uploaded: "5TiB",
      ratio: 0.4,
      interval: "P2M",
      privilege: "无限下载槽；发布种子；发送邀请",
    },
    {
      id: 4,
      name: "Leading Actor",
      uploaded: "20TiB",
      ratio: 0.4,
      interval: "P3M",
      privilege: "无限下载槽；发布种子；发送邀请；种子免审核",
    },
    {
      id: 5,
      name: "Movie Star",
      uploaded: "50TiB",
      ratio: 0.4,
      interval: "P6M",
      privilege: "无限下载槽；发布种子；发送邀请；种子免审核",
    },
    {
      id: 6,
      name: "Screen Legend",
      uploaded: "100TiB",
      ratio: 0.4,
      interval: "P1Y",
      privilege: "无限下载槽；发布种子；发送邀请；免费下载（Freeleech）；种子免审核",
    },
    {
      id: 7,
      name: "Superstar",
      ratio: 0.4,
      interval: "P1M",
      averageSeedingTime: "P1M",
      seedingSize: "5TiB",
      privilege: "无限下载槽；发布种子；发送邀请；免疫自动 H&R 警告；种子免审核",
    },
    {
      id: 8,
      name: "Preservationist",
      ratio: 0.4,
      interval: "P3M",
      averageSeedingTime: "P2M",
      seedingSize: "10TiB",
      privilege: "无限下载槽；发布种子；发送邀请；免费下载（Freeleech）；免疫自动 H&R 警告；种子免审核",
    },
  ],
};

export default class RetroMoviesClub extends Unit3D {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 只给 API 请求附带 Bearer Token（含用户信息 /api/user），
    // 避免把凭据带到 HTML 页面或下载跳转等第三方域名上
    if ((axiosConfig.url ?? "").includes("/api/")) {
      const token = this.userConfig.inputSetting?.token;
      if (!token) {
        throw new NoUserInputError("API Key");
      }

      axiosConfig.headers = {
        ...(axiosConfig.headers ?? {}),
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };
    }

    return super.request<T>(axiosConfig, checkLogin);
  }

  /** API 的促销信息是结构化字段，Unit3D 默认的 DOM 选择器在 JSON 下取不到 */
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    searchInput: ISearchInput,
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

    // 站规：下载量达到 10% 及以上的种子需在 7 天内完成 48 小时保种，否则记 H&R
    tags.push({ name: "H&R", color: "red" });

    torrent.tags = tags;
    return torrent;
  }
}
