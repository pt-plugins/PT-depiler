import type { ISearchInput, ISiteMetadata, ITorrent, ITorrentTag } from "../types";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

import { TPreDefinedTorrentTagName } from "../utils/tags";
import PrivateSite from "../schemas/AbstractPrivateSite";

/**
 * Rousi Pro 已迁移至 PeerGo 后端，公开 API 为 PeerGo API v1（见 API_V1.md）。
 *
 * 身份模型：
 * - 种子只有一套公开身份：正整数数字 ID。
 * - 列表/详情响应中的 `uuid` 只是数字 ID 的字符串形式，用于兼容旧工具。
 * - 下载必须使用详情接口返回的短时签名 `download_url`（约 5 分钟有效），
 *   旧的 `/api/torrent/{id}/download/{api_key}` 固定路由仅保留用于迁移。
 * - Web 端种子详情页路由为 `/torrents/{numeric_id}`。
 */
const torrentIdRegex = /\/torrents\/(\d+)\/?/;

/** PeerGo API v1 统一响应包装 */
interface IPeerGoResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 列表/搜索接口中的种子字段（/api/v1/torrents、/api/v1/search、/api/v1/bookmarks） */
interface IRousiSearchTorrent {
  id: number;
  uuid: string; // 数字 ID 的字符串形式，仅为兼容旧工具保留
  title: string;
  subtitle?: string;
  category: string;
  category_name?: string;
  size: number;
  seeders: number;
  leechers: number;
  downloads: number;
  uploader: string; // 匿名种子为“匿名”
  uploader_id: number; // 匿名种子为 0
  anonymous: boolean;
  created_at: string;
  promotion?: {
    type: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 促销类型（1=普通, 2=免费, 3=2X, 4=2X免费, 5=50%, 6=2X50%, 7=30%）
    time_type: number;
    is_active: boolean;
    is_global: boolean;
    until: string | null;
    up_multiplier: number;
    down_multiplier: number;
  };
}

/** 详情接口中的扩展字段（/api/v1/torrents/{numeric_id}） */
interface IRousiTorrentDetail extends IRousiSearchTorrent {
  description?: string;
  info_hash?: string;
  files?: { id: number; path: string; size: number }[];
  images?: { url: string; is_cover: boolean }[];
  media_info?: string;
  attributes?: Record<string, string | string[]>;
  download_url?: string; // 短时签名下载 URL，付费种子未购买或缺少 torrent:download scope 时为空字符串
  price?: number;
  is_purchased?: boolean;
  other_versions?: unknown[];
}

const promotionTypeMap: Record<Required<IRousiSearchTorrent>["promotion"]["type"], TPreDefinedTorrentTagName> = {
  1: "",
  2: "Free",
  3: "2xUp",
  4: "2xFree",
  5: "50%",
  6: "2x50%",
  7: "30%",
};

/** 列表页（DOM）优惠徽章文本 → 预定义标签映射 */
const promotionBadgeTextMap: Record<string, TPreDefinedTorrentTagName> = {
  免费: "Free",
  "2X免费": "2xFree",
  "2X": "2xUp",
  "2X50%": "2x50%",
  "50%": "50%",
  "30%": "30%",
};

export const siteMetadata: ISiteMetadata = {
  version: 4,
  id: "rousipro",
  name: "Rousi Pro",
  aka: ["Rousi", "肉丝"],

  type: "private",
  schema: "Rousi",

  urls: ["uggcf://ebhfv.ceb/"],
  favicon: "./rousipro.ico",

  category: [
    {
      name: "分类",
      key: "category",
      options: [
        // 与 GET /api/v1/categories 返回的名称（name）保持一致，category 查询参数接受该名称
        // (await (await fetch('/api/v1/categories')).json()).data.map(x => ({name: x.label, value: x.name}))
        { name: "电影", value: "movie" },
        { name: "电视剧", value: "tv" },
        { name: "纪录片", value: "documentary" },
        { name: "动漫", value: "anime" },
        { name: "音乐", value: "music" },
        { name: "综艺", value: "variety" },
        { name: "体育", value: "sports" },
        { name: "软件", value: "software" },
        { name: "电子书", value: "ebooks" },
        { name: "9KG", value: "9kg" },
        { name: "其它", value: "other" },
      ],
    },
  ],

  search: {
    // GET /api/v1/torrents 是 PeerGo API v1 的正式列表/搜索端点，/api/v1/search 仅为兼容别名
    requestConfig: { url: "/api/v1/torrents", params: { page: 1, page_size: 100 } },
    keywordPath: "params.keyword",
    advanceKeywordParams: { imdb: false, douban: false },
    selectors: {
      rows: { selector: "data.torrents" },
      id: { selector: "id" }, // 正整数数字 ID
      title: { selector: "title" },
      subTitle: { selector: "subtitle" },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/torrents/"] }] },
      // link 不构造：下载链接由 getTorrentDownloadLink 通过详情接口获取短时 download_url
      time: { selector: "created_at", filters: [{ name: "parseTime" }] },
      size: { selector: "size" },
      author: { selector: "uploader" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "downloads" },
      // comments: { text: "N/A" }, // 列表接口不返回评论数
      category: { selector: "category_name" },
    },
  },

  list: [
    {
      urlPattern: ["/torrents"],
      excludeUrlPattern: ["/torrents/\\d+"], // 排除种子详情页 /torrents/{id}
      mergeSearchSelectors: false,
      selectors: {
        keywords: { selector: "input[placeholder*='搜索种子']" },
        // thead 中的表头行同构，必须限定在 tbody 内
        rows: { selector: 'tbody tr[data-slot="table-row"]' },
        id: {
          selector: "a[href^='/torrents/']",
          attr: "href",
          filters: [(href: string) => href.match(/\/torrents\/(\d+)/)?.[1] ?? ""],
        },
        title: { selector: "a[href^='/torrents/']" },
        subTitle: { selector: "p.truncate.text-xs.text-muted-foreground" },
        url: { selector: "a[href^='/torrents/']", attr: "href" },
        // link 由 getTorrentDownloadLink 方法构造
        time: { selector: "time[datetime]", attr: "datetime", filters: [{ name: "parseTime" }] },
        size: { selector: "td:nth-child(4)", filters: [{ name: "parseSize" }] },
        seeders: { selector: "span[title='做种数']" },
        leechers: { selector: "span[title='下载数']" },
        completed: { selector: "span[title='完成数']" },
        category: { selector: "td:nth-child(3)" },
        // tags 由 parseTorrentRowForTags 解析优惠徽章
      },
    },
  ],

  detail: {
    urlPattern: ["/torrents/"],
    selectors: {
      id: {
        selector: ":self",
        elementProcess: (element: Document) => {
          const url = element.URL;
          const match = url.match(torrentIdRegex);
          return match ? match[1] : url;
        },
      },
      title: { selector: "h1" },
      subTitle: { selector: "p.text-sm.text-muted-foreground" },
      category: { selector: "dt:contains('分类') + dd" },
      size: { selector: "dt:contains('大小') + dd", filters: [{ name: "parseSize" }] },
      author: { selector: "dt:contains('上传者') + dd" },
      time: {
        selector: "dt:contains('发布时间') + dd",
        filters: [
          (text: string) => text.replace(/\s*\(.*\)\s*$/, "").trim(), // 去掉 “(14天前)” 相对时间
          { name: "parseTime", args: ["yyyy/MM/dd HH:mm"] },
        ],
      },
      seeders: { selector: "dt:contains('做种') + dd" },
      leechers: { selector: "dt:contains('下载') + dd" },
      completed: { selector: "dt:contains('完成') + dd" },
      // link 不在此处解析：下载使用详情接口返回的短时 download_url
      link: { text: "" },
    },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        // GET /api/v1/profile，seeding_leeching_data 已内联在响应中
        requestConfig: { url: "/api/v1/profile" },
        selectors: {
          id: { selector: "data.id" },
          name: { selector: "data.username" },
          levelId: { selector: "data.level" },
          levelName: { selector: "data.level_text" },
          joinTime: { selector: "data.registered_at", filters: [{ name: "parseTime" }] },
          lastAccessAt: { selector: "data.last_active_at", filters: [{ name: "parseTime" }] },
          messageCount: { text: 0 },
          downloaded: { selector: "data.downloaded" },
          uploaded: { selector: "data.uploaded" },
          ratio: { selector: "data.ratio" },

          seeding: { selector: "data.seeding_leeching_data.seeding_count" },
          seedingSize: { selector: "data.seeding_leeching_data.seeding_size" },
          leeching: { selector: "data.seeding_leeching_data.leeching_count" },

          bonus: { selector: "data.karma" },
        },
      },
      {
        // GET /api/v1/seeding-reward，返回最近一个已完成结算窗口的做种奖励
        requestConfig: { url: "/api/v1/seeding-reward" },
        selectors: {
          bonusPerHour: { selector: "data.total_reward" },
        },
      },
    ],
  },

  userInputSettingMeta: [
    {
      name: "passkey",
      label: "个人 API Key",
      hint: "在「账户设置 → API Key」创建的个人 API Key（pgk_...），需要至少授予 profile:read、torrent:read、torrent:download 权限",
      required: true,
    },
  ],
};

export default class RousiPro extends PrivateSite {
  get userPasskey(): string {
    return this.userConfig.inputSetting!.passkey ?? "";
  }

  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 设置默认的 responseType，这样其他配置不需要显式声明
    axiosConfig.responseType = "json";

    // 在请求的 headers 中添加 Bearer Token
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      Authorization: `Bearer ${this.userPasskey}`,
    };

    return super.request<T>(axiosConfig, checkLogin);
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    torrent = super.parseTorrentRowForTags(torrent, row, searchConfig);

    if (row instanceof Element) {
      // 列表页（DOM）：解析优惠徽章（置顶等 outline 变体徽章不在此列）
      const promotionBadges = Array.from(
        row.querySelectorAll<HTMLElement>('span[data-slot="badge"][data-variant="destructive"]'),
      );
      for (const badge of promotionBadges) {
        const tagName = promotionBadgeTextMap[badge.textContent?.trim() ?? ""];
        if (tagName) {
          torrent.tags = torrent.tags || [];
          torrent.tags.push({ name: tagName } as ITorrentTag);
        }
      }
    } else {
      // API 搜索（JSON）：根据 promotion 类型将种子优惠标签加入 tags 中
      const raw = row as IRousiSearchTorrent;
      if (raw.promotion?.is_active) {
        const tagName = promotionTypeMap[raw.promotion.type] ?? "";
        if (tagName) {
          torrent.tags = torrent.tags || [];
          torrent.tags.push({ name: tagName } as ITorrentTag);
        }
      }
    }

    return torrent;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    // fix: 如果 torrent 对象没有 id ，则依次尝试从 url, link 中提取
    if (!torrent.id && (torrent.url || torrent.link)) {
      let match;
      if (torrent.url?.includes("/torrents/")) {
        match = torrent.url.match(torrentIdRegex);
      } else if (torrent.link?.includes("/torrents/")) {
        match = torrent.link.match(torrentIdRegex);
      }

      if (match) {
        torrent.id = match[1];
      }
    }

    // 下载必须使用详情接口返回的短时签名 URL（约 5 分钟有效），
    // 不再构造旧的 /api/torrent/{id}/download/{api_key} 固定路由（密钥会进入日志/历史，仅保留用于迁移）
    // 付费种子未购买或缺少 torrent:download scope 时 download_url 为空字符串
    const { data: response } = await this.request<IPeerGoResponse<IRousiTorrentDetail>>({
      method: "GET",
      url: `/api/v1/torrents/${encodeURIComponent(String(torrent.id))}`,
      responseType: "json",
    });

    let downloadUrl = response.data?.download_url ?? "";

    if (this.userConfig.downloadLinkAppendix) {
      // 如果用户配置了下载链接后缀，则在链接后追加
      downloadUrl = `${downloadUrl}${this.userConfig.downloadLinkAppendix}`;
    }

    return downloadUrl;
  }
}
