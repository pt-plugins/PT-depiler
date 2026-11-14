/**
 * FluxTorrent 引擎
 *
 * FluxTorrent（通用 PT 建站系统）把 NexusPHP 字段口径的只读 JSON 暴露在
 * `/api/v1/compat/nexusphp/*` 下，第三方工具不需要解析 HTML 就能对接：
 *
 *   - `GET /api/v1/compat/nexusphp/torrents.json`     种子列表（keyword / page / pagesize / promo / …）
 *   - `GET /api/v1/compat/nexusphp/torrent/{id}.json` 种子详情
 *   - `GET /api/v1/compat/nexusphp/user.json`         账号信息（NP userdetails 口径）
 *   - `GET /api/v1/compat/nexusphp/download.php?id=`   NP 形状下载
 *
 * 鉴权用开放 API Token（`fxo_` 前缀），走 `Authorization: Token <token>` 头；
 * 也接受 `?apikey=` 查询参数（Torznab / Prowlarr 的惯用传法）。
 *
 * 所有响应统一是 `{ code, message, data }` 信封：`code === 0` 才是成功，
 * 业务失败时 HTTP 状态码同时带上（401 / 403 / 404 / 429）。
 *
 * 与 GazelleJSONAPI 的区别：Gazelle 系返回的是 `{ status, response }`，
 * 且结果数组在 `response.results`；本引擎的信封是 `data`，结果数组在 `data.items`。
 *
 * 本引擎不解析 HTML，因此没有 `list` / `detail` 选择器 —— 站点页面是前端渲染的
 * 单页应用，content-script 抓不到稳定的 DOM 结构；搜索与下载都走上面的 JSON 端点。
 *
 * 适用面：FluxTorrent 是开源、可自部署的建站系统，凡是它建出来的站都提供同一套
 * 兼容层，因此本引擎对所有 FluxTorrent 站通用；站点条目只需给出自己的站点地址，
 * 并让使用者填自己的开放 API Token。
 */
import type { AxiosRequestConfig, AxiosResponse } from "axios";

import PrivateSite from "./AbstractPrivateSite";
import {
  type TSchemaMetadata,
  NeedLoginError,
  NoUserInputError,
  type ISearchInput,
  type IUserInfo,
  type ITorrent,
  type ITorrentTag,
} from "../types";

/** FluxTorrent 开放 API 的统一响应信封 */
export interface IFluxEnvelope<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 兼容层的字段口径（NP torrents.php / userdetails.php） */
export interface IFluxTorrentListItem {
  id: number;
  name: string;
  small_descr?: string;
  seeders?: number;
  leechers?: number;
  completed?: number;
  size?: number;
  /** unix 秒级时间戳 */
  added?: number;
  category?: number;
  category_name?: string;
  medium?: number | null;
  medium_name?: string | null;
  /** 促销档位：free / x2free / half / x2half / x2 / p30 */
  promotion?: string | null;
  /** 促销的可读标签：Free / 2xFree / 50% / 2x50% / 2x / 30% */
  promotion_name?: string | null;
  info_hash?: string;
  pieces_hash?: string;
  official?: boolean;
  sticky?: boolean;
}

export interface IFluxTorrentList {
  page?: number;
  page_size?: number;
  total_estimate?: number;
  has_more?: boolean;
  items?: IFluxTorrentListItem[];
}

export interface IFluxTorrentUser {
  id: number;
  username: string;
  uploaded: number;
  downloaded: number;
  seedbonus: number;
  /** 站内用户组 id */
  class: number;
  /** 用户组名 */
  class_name: string;
  ratio: number;
  /** 只上传未下载时分享率为无穷大 */
  ratio_infinite?: boolean;
  ratio_display?: string;
  /** 做种体积（字节）；老版本兼容层没有该字段 */
  seeding_size?: number;
  /** 注册时间（RFC3339）；老版本兼容层没有该字段 */
  join_at?: string;
}

/** 业务错误码：与站点开放 API 的错误码表一致 */
const FLUX_ERROR_UNAUTHORIZED = 2001;
const FLUX_ERROR_FORBIDDEN = 2003;

/** 本引擎一定会提供的键；列出来之后消费方读它们不必再写非空断言 */
type TMetadataKeys = "version" | "search" | "userInfo";

export const SchemaMetadata: TSchemaMetadata<TMetadataKeys> = {
  version: 0,
  search: {
    keywordPath: "params.keyword",
    requestConfig: {
      url: "/api/v1/compat/nexusphp/torrents.json",
      responseType: "json",
      params: {
        page: 1,
        pagesize: 50,
      },
    },
    selectors: {
      rows: { selector: "items" },
      id: { selector: "id" },
      title: { selector: "name" },
      subTitle: { selector: "small_descr" },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/torrent/"] }] },
      link: { selector: "id", filters: [{ name: "prepend", args: ["/api/v1/compat/nexusphp/download.php?id="] }] },
      // 站点给的是 unix 秒级时间戳，换算成毫秒
      time: { selector: "added", filters: [(value: number) => (typeof value === "number" ? value * 1000 : value)] },
      size: { selector: "size" },
      author: { text: "" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "completed" },
      comments: { text: 0 },
      category: { selector: "category_name" },
    },
  },
  userInfo: {
    process: [
      {
        requestConfig: {
          url: "/api/v1/compat/nexusphp/user.json",
          responseType: "json",
        },
        fields: [
          "id",
          "name",
          "levelId",
          "levelName",
          "uploaded",
          "downloaded",
          "ratio",
          "bonus",
          "seeding",
          "seedingSize",
          "joinTime",
        ],
      },
    ],
    selectors: {
      id: { selector: "id" },
      name: { selector: "username" },
      levelId: { selector: "class" },
      levelName: { selector: "class_name" },
      uploaded: { selector: "uploaded" },
      downloaded: { selector: "downloaded" },
      bonus: { selector: "seedbonus" },
      // 做种数：兼容层 user.json 直接给 seeding（2026-11-13 #1706 反馈的真实响应确认）
      seeding: { selector: "seeding" },
      // 做种体积站点直接给字节数，不用再换算；老版本兼容层的 user.json
      // 没有这两个字段，取不到时留空，不能让整条资料判成解析失败。
      seedingSize: { selector: ["seeding_size", "seedingSize"] },
      // 注册时间是 RFC3339（如 2025-07-15T20:45:13+00:00），换成毫秒时间戳
      joinTime: { selector: "join_at", filters: [{ name: "parseTime" }] },
    },
  },
  userInputSettingMeta: [
    {
      name: "token",
      label: "开放 API Token",
      hint: "在站点的「开放API」页面签签发 Token（形如 fxo_ 开头的字符串）并填入此处；令牌需要具备 read 权限",
      required: true,
    },
  ],
};

export default class FluxTorrent extends PrivateSite {
  /**
   * 开放 API Token（`fxo_` 前缀）。
   *
   * 兼容层只认 Token，不认网页会话 cookie —— 所以这个值是必填的，
   * 没填时抛 `NoUserInputError`，上层会显示成「未填写必填的用户输入」而不是「解析失败」。
   */
  private get apiToken(): string {
    const token = (this.userConfig.inputSetting?.token ?? "").trim();
    if (!token) {
      throw new NoUserInputError("未填写 FluxTorrent 开放 API Token，请在站点设置中补齐");
    }
    return token;
  }

  /**
   * 统一注入鉴权头并拆开响应信封。
   *
   * - `Authorization: Token <token>`：兼容层与开放 API 的标准取法；
   * - 拆信封：站点所有响应都是 `{ code, message, data }`，成功时把 `data` 交给上层，
   *   这样选择器写的是 `items` 而不是 `data.items`。
   */
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      Authorization: `Token ${this.apiToken}`,
    };

    const response = (await super.request<any>(axiosConfig, checkLogin)) as AxiosResponse<T>;
    const body = response.data as IFluxEnvelope<T> | undefined;

    if (body && typeof body === "object" && typeof body.code === "number") {
      if (body.code !== 0) {
        // 2001 = Token 无效 / 未传，2003 = 缺少 scope：两者对用户都是「登录态不可用」
        if (body.code === FLUX_ERROR_UNAUTHORIZED || body.code === FLUX_ERROR_FORBIDDEN) {
          throw new NeedLoginError(body.message || `FluxTorrent API ${body.code}`);
        }
        throw new Error(`FluxTorrent API ${body.code}: ${body.message}`);
      }
      response.data = body.data;
    }

    return response;
  }

  /**
   * 下载链接。
   *
   * 兼容层的下载端点用 `apikey` 传开放 API Token（也可以用 `Authorization` 头，
   * 但复制链接场景没有请求头可用，所以走查询参数）。
   *
   * 搜索结果里的 `link` 只带种子 id —— Token 在下载时才拼上去，
   * 免得它被写进下载历史 / 导出的结果里。
   */
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const url = new URL("/api/v1/compat/nexusphp/download.php", this.url);
    url.searchParams.set("id", String(torrent.id));
    url.searchParams.set("apikey", this.apiToken);

    let link = url.toString();
    if (this.userConfig.downloadLinkAppendix) {
      link = `${link}${this.userConfig.downloadLinkAppendix}`;
    }

    return link;
  }

  public override async getTorrentDownloadRequestConfig(torrent: ITorrent): Promise<AxiosRequestConfig> {
    return {
      url: await this.getTorrentDownloadLink(torrent),
      method: "GET",
      timeout: this.userConfig.timeout ?? 30e3,
      responseType: "arraybuffer",
    };
  }

  /**
   * 分享率。
   *
   * 站点在「只上传过、从没下载过」时把分享率记成无穷大，接口给的是
   * `ratio_infinite: true` + `ratio_display: "∞"`；直接取 `ratio` 会得到 0，
   * 界面上就成了「分享率 0.00」。这里把原始展示值一并带出去。
   */
  protected async parseUserInfoForRatio(
    flushUserInfo: Partial<IUserInfo>,
    dataDocument: IFluxTorrentUser,
  ): Promise<Partial<IUserInfo>> {
    const ratio = Number(dataDocument?.ratio ?? 0);
    const infinite = dataDocument?.ratio_infinite === true;

    return {
      ...flushUserInfo,
      ratio: infinite ? 0 : Number.isFinite(ratio) ? ratio : 0,
      ratioInfinite: infinite,
      ratioDisplay: dataDocument?.ratio_display,
    };
  }

  /**
   * 标签。
   *
   * - 促销：站点给的 `promotion_name`（Free / 2xFree / 50% / 2x50% / 2x / 30%）
   *   与本仓库的优惠标签表逐字一致，`normalizeTorrentPromotion` 会据此补齐
   *   量系数，并把标签名归一成规范写法（如 `2x` → `2xUp`）。
   *   量系数按「只声明确定的那一维」处理：`Free` 只说明下载免费，**不据此断言
   *   上传倍数** —— 上传轴保持未知（undefined），由消费方按 1 回退；
   *   `2xFree` / `2x50%` 这类合成档才同时确定两维。
   * - 官种：站点用 `official` 布尔位标记，对应本仓库的「官方」标签。
   */
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: IFluxTorrentListItem,
    _searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const tags: ITorrentTag[] = [];

    const promotion = (row?.promotion_name ?? "").trim();
    if (promotion) {
      tags.push({ name: promotion });
    }

    if (row?.official === true) {
      tags.push({ name: "官方", color: "blue-darken-2" });
    }

    torrent.tags = tags;

    return torrent;
  }
}
