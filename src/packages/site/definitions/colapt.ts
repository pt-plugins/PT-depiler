import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { ISearchInput, ISiteMetadata, ITorrent, IUserInfo } from "../types";
import { NeedLoginError } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite";

const categoryMap: Record<string, string> = {
  movie: "电影",
  tv: "电视剧",
  anime: "动漫",
  variety: "综艺",
  other: "其他",
};

interface IReelCoreGroup {
  versions: {
    promotion: {
      upload: { num: number; den: number };
      download: { num: number; den: number };
    } | null;
  }[];
}

export const siteMetadata: ISiteMetadata = {
  id: "colapt",
  version: 1,
  name: "可乐",
  aka: ["Cola", "ColaPT"],
  description: "使用 ReelCore 的影视站点；积分表示瓶盖，“发布帖子数”表示核子可乐余额。晋级需达标并消耗两种积分。",
  tags: ["影视"],
  timezoneOffset: "+0800",
  type: "private",
  schema: "ReelCore",
  urls: ["https://www.colapt.com/"],
  favicon: "https://www.colapt.com/brand/cola/favicon-black-red.ico",

  category: [
    {
      name: "分类",
      key: "category",
      options: Object.entries(categoryMap).map(([value, name]) => ({ name, value })),
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/api/v1/media",
      responseType: "json",
      // 按种子分页，避免影片分组的 version_limit 截掉匹配版本。
      params: { view: "torrents", page: 1, page_size: 100, sort: "latest", direction: "desc" },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          delete requestConfig!.params.q;
          requestConfig!.params.imdb_id = keywords;
          return requestConfig!;
        },
      },
      douban: {
        requestConfigTransformer: ({ keywords, requestConfig }) => {
          delete requestConfig!.params.q;
          requestConfig!.params.douban_id = keywords;
          return requestConfig!;
        },
      },
    },
    selectors: {
      rows: { selector: "items" },
      id: { selector: "versions.0.id" },
      title: { selector: "versions.0.release_name" },
      subTitle: { selector: "versions.0.subtitle" },
      url: { selector: "versions.0.id", filters: [{ name: "prepend", args: ["/torrents/"] }] },
      time: { selector: "versions.0.published_at", filters: [{ name: "parseTime" }] },
      size: { selector: "versions.0.size_bytes" },
      seeders: { selector: "versions.0.seeders" },
      leechers: { selector: "versions.0.leechers" },
      completed: { selector: "versions.0.completions" },
      category: { selector: "media.category", filters: [(value: string) => categoryMap[value] ?? "其他"] },
      ext_imdb: { selector: "media.imdb_id" },
      ext_douban: { selector: "media.douban_id" },
    },
  },

  list: [
    {
      urlPattern: [/\/browse(?:[?#]|$)/, /\/media\/rc\d+(?:[?#]|$)/],
      mergeSearchSelectors: false,
      selectors: {
        rows: { selector: "tr[data-torrent-id]" },
        id: { selector: ":self", attr: "data-torrent-id" },
        title: {
          selector: [".name-line a[title]", ".full-release-name"],
          elementProcess: (element: HTMLAnchorElement) => element.title || element.textContent,
        },
        subTitle: { selector: ".release-subtitle" },
        url: { selector: ".name-line a[href^='/torrents/']", attr: "href" },
        time: { selector: "td:nth-child(2) time", attr: "datetime", filters: [{ name: "parseTime" }] },
        size: { selector: "td.size-column" },
        seeders: { selector: "td.seeded .tip-anchor > span:first-child", filters: [{ name: "parseNumber" }] },
        leechers: { selector: "td:nth-child(5)", filters: [{ name: "parseNumber" }] },
        completed: { selector: "td:nth-child(6):not(.actions)", filters: [{ name: "parseNumber" }] },
        tags: [{ name: "Free", selector: ".promotion-free", color: "blue" }],
      },
    },
  ],

  detail: {
    urlPattern: [/\/torrents\/\d+(?:[?#]|$)/],
    selectors: {
      id: {
        selector: "button[aria-label='下载'][aria-describedby]",
        attr: "aria-describedby",
        filters: [(value: string) => value.match(/(?:^|\s)download-reason-(\d+)(?:\s|$)/)?.[1]],
      },
      title: { selector: "h1.page-title" },
      link: { text: "" },
    },
  },

  userInfo: {
    process: [
      {
        requestConfig: { url: "/api/v1/me" },
        selectors: {
          id: { selector: "id" },
          name: { selector: "username" },
          avatar: { selector: "avatar_url" },
        },
      },
      {
        requestConfig: { url: "/api/v1/users/$id$/profile" },
        assertion: { id: "url" },
        selectors: {
          joinTime: { selector: "joined_at", filters: [{ name: "parseTime" }] },
          lastAccessAt: {
            selector: "last_login_at",
            filters: [(value: string | null) => value ?? "", { name: "parseTime" }],
          },
          uploads: { selector: "contributions.torrents" },
          bonus: { selector: "stats.points", filters: [Number] },
        },
      },
      {
        requestConfig: { url: "/api/v1/me/points/ledger", params: { page: 1, page_size: 1, kind: "seed_reward" } },
        selectors: {
          bonusPerHour: {
            selector: "items",
            filters: [
              (items: { amount: string; created_at: string }[]) => {
                const latest = items[0];
                // 与站点瓶盖速度一致：最近两小时没有做种入账时显示 0。
                return latest && Date.now() - Date.parse(latest.created_at) <= 2 * 60 * 60 * 1000
                  ? Number(latest.amount)
                  : 0;
              },
            ],
          },
        },
      },
      {
        requestConfig: { url: "/api/v1/me/stats" },
        fields: ["seedingSize"],
        selectors: {
          uploaded: { selector: "billed_uploaded" },
          downloaded: { selector: "billed_downloaded" },
          trueUploaded: { selector: "raw_uploaded" },
          trueDownloaded: { selector: "raw_downloaded" },
          seeding: { selector: "seeding" },
          leeching: { selector: "leeching" },
          snatches: { selector: "completions" },
        },
      },
      {
        requestConfig: { url: "/api/v1/me/rank" },
        selectors: {
          levelId: { selector: "level.rank" },
          levelName: { selector: "level.title" },
          trueRatio: { selector: "stats.ratio", filters: [Number] },
        },
      },
      {
        requestConfig: { url: "/api/v1/me/cola" },
        // shortcut: 核子可乐余额借用 posts，框架支持通用论坛积分后再迁移。
        selectors: { posts: { selector: "balance" } },
      },
      {
        requestConfig: { url: "/api/v1/me/invitations/quotas" },
        selectors: { invites: { selector: "available_total" } },
      },
      {
        requestConfig: { url: "/api/v1/me/messages/summary" },
        selectors: { messageCount: { selector: "unread" } },
      },
    ],
  },

  // https://www.colapt.com/account/rank · ReelCore API 17.7.0
  levelRequirements: [
    { id: 1, name: "迷你罐", nameAka: ["Mini Can", "mini_can"] },
    {
      id: 2,
      name: "经典罐",
      nameAka: ["Classic Can", "classic_can"],
      interval: "P7D",
      trueUploaded: "50 GiB",
      trueRatio: 1,
      snatches: 5,
      bonus: 22000,
      posts: 35,
      privilege: "达标后手动晋级，消耗 22,000 瓶盖和 35 核子可乐。",
    },
    {
      id: 3,
      name: "玻璃瓶",
      nameAka: ["Glass Bottle", "glass_bottle"],
      interval: "P30D",
      trueUploaded: "200 GiB",
      trueRatio: 1.2,
      snatches: 20,
      bonus: 93000,
      posts: 115,
      privilege: "达标后手动晋级，消耗 93,000 瓶盖和 115 核子可乐。",
    },
    {
      id: 4,
      name: "分享装",
      nameAka: ["Sharing Pack", "sharing_pack"],
      interval: "P90D",
      trueUploaded: "1 TiB",
      trueRatio: 1.5,
      snatches: 50,
      bonus: 272000,
      posts: 300,
      privilege: "达标后手动晋级，消耗 272,000 瓶盖和 300 核子可乐。",
    },
    {
      id: 5,
      name: "家庭装",
      nameAka: ["Family Pack", "family_pack"],
      interval: "P180D",
      trueUploaded: "5 TiB",
      trueRatio: 2,
      snatches: 100,
      bonus: 433000,
      posts: 450,
      privilege: "达标后手动晋级，消耗 433,000 瓶盖和 450 核子可乐。",
    },
    {
      id: 6,
      name: "可乐收藏家",
      nameAka: ["Cola Collector", "cola_collector"],
      interval: "P365D",
      trueUploaded: "20 TiB",
      trueRatio: 2.5,
      snatches: 300,
      bonus: 923000,
      posts: 925,
      privilege: "达标后手动晋级，消耗 923,000 瓶盖和 925 核子可乐。",
    },
    {
      id: 7,
      name: "可乐大亨",
      nameAka: ["Cola Tycoon", "cola_tycoon"],
      interval: "P730D",
      trueUploaded: "50 TiB",
      trueRatio: 3,
      snatches: 1000,
      bonus: 1865000,
      posts: 1825,
      privilege: "达标后手动晋级，消耗 1,865,000 瓶盖和 1,825 核子可乐。",
    },
  ],
};

export default class ColaPT extends PrivateSite {
  public override async request<T>(config: AxiosRequestConfig, checkLogin: boolean = true): Promise<AxiosResponse<T>> {
    config.responseType = "json";
    config.withCredentials = true;
    return super.request<T>(config, checkLogin);
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    if (row instanceof Element) return super.parseTorrentRowForTags(torrent, row, searchConfig);

    torrent.tags = [];
    const promotion = (row as IReelCoreGroup).versions[0].promotion;
    if (promotion) {
      const download = promotion.download.num / promotion.download.den;
      const upload = promotion.upload.num / promotion.upload.den;
      if (download < 1) {
        torrent.tags.push({ name: download === 0 ? "Free" : `${download * 100}%`, color: "blue" });
      }
      if (upload > 1) torrent.tags.push({ name: `${upload}xUp`, color: "green" });
    }
    return torrent;
  }

  protected async parseUserInfoForSeedingSize(userInfo: IUserInfo, stats: { seeding: number }): Promise<IUserInfo> {
    let seedingSize = 0;
    if (stats.seeding > 0) {
      let totalPages = 1;
      for (let page = 1; page <= totalPages; page++) {
        const { data } = await this.request<{
          items: { size_bytes: string | null }[];
          total_pages: number;
          projection_status: string;
        }>({ url: "/api/v1/me/activity", params: { state: "seeding", page, page_size: 100 } });
        // 统计不可用时保留未知，不能把缺失的做种量记成零。
        if (data.projection_status !== "current" || data.items.some((item) => item.size_bytes === null))
          return userInfo;
        totalPages = data.total_pages;
        seedingSize += data.items.reduce((sum, item) => sum + Number(item.size_bytes), 0);
      }
    }
    userInfo.seedingSize = seedingSize;
    return userInfo;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const id = /^[1-9]\d*$/.test(String(torrent.id))
      ? String(torrent.id)
      : new URL(torrent.url || String(torrent.id), this.url).pathname.match(/^\/torrents\/([1-9]\d*)\/?$/)?.[1];
    if (!id) throw new Error("Unable to resolve ColaPT torrent ID");

    // 直链仅有效 30 分钟，每次下载时生成；会话验证值不写入用户统计或持久化缓存。
    const { data: user } = await this.request<{ session: { csrf_token: string } }>({ url: "/api/v1/me" });
    if (!user.session?.csrf_token) throw new NeedLoginError();
    const { data } = await this.request<{ download_url: string }>({
      url: `/api/v1/torrents/${id}/download-links`,
      method: "POST",
      headers: { "X-CSRF-Token": user.session.csrf_token, Origin: new URL(this.url).origin },
    });
    if (!data.download_url) throw new Error("ColaPT did not return a download link");
    const link = new URL(data.download_url, this.url);
    if (link.origin !== new URL(this.url).origin) throw new Error("Invalid ColaPT download link origin");
    return link.href;
  }
}
