import type { AxiosRequestConfig } from "axios";
import {
  EResultParseStatus,
  ISearchInput,
  ISiteMetadata,
  ITorrent,
  ITorrentTag,
  IUserInfo,
  TPreDefinedTorrentTagName,
} from "@ptd/site";
import PrivateSite from "@ptd/site/schemas/AbstractPrivateSite.ts";
import { sendMessage } from "@/messages.ts";

const torrentIdRegex = /\/torrents?\/([0-9a-z-]+)\/?/;

/**
 * 读取浏览器中 rousi.pro 的会话 cookie, 拼接成 Cookie 请求头。
 * PT-depiler 的用户信息/下载请求从 offscreen 跨域发出, 默认不带站点 cookie,
 * 而 rousi.pro 的 /api/v1/session 与 /api/v1/torrents/:id/download 均需要 cookie 会话。
 * 这里显式读取 cookie 交给 replaceUnsafeHeader 的 DNR 机制注入请求头。
 */
async function getRousiCookieHeader(siteUrl: string): Promise<string> {
  try {
    const cookies = (await sendMessage("getAllCookies", { url: siteUrl })) as chrome.cookies.Cookie[];
    if (Array.isArray(cookies) && cookies.length > 0) {
      return cookies.map((c) => `${c.name}=${c.value}`).join("; ");
    }
  } catch (e) {
    console?.debug("[RousiPro] read cookie failed", e);
  }
  return "";
}

// Rousi Pro: 会话认证(浏览器 cookie), 无需 passkey
// 已实测(2026-08): /api/v1/torrents?keyword= 搜索(无需认证)、/api/v1/session 用户信息、/api/v1/torrents/:id/download 下载(均需 cookie)
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
        // (await (await fetch('/api/v1/categories')).json()).data.map(x => ({name: x.label, value: x.name}))
        { name: "电影", value: "movies" },
        { name: "电视剧", value: "tv" },
        { name: "纪录片", value: "documentary" },
        { name: "动漫", value: "anime" },
        { name: "音乐", value: "music" },
        { name: "综艺", value: "variety" },
        { name: "9KG", value: "9kg" },
        { name: "体育", value: "sports" },
        { name: "软件", value: "software" },
        { name: "电子书", value: "ebook" },
        { name: "其它", value: "other" },
      ],
    },
  ],

  search: {
    requestConfig: { url: "/api/v1/torrents", params: { limit: 100, offset: 0 }, responseType: "json" },
    keywordPath: "params.keyword",
    advanceKeywordParams: { imdb: false, douban: false },
    selectors: {
      rows: { selector: "data.items" },
      id: { selector: "id" }, // 数字 id
      title: { selector: "name" },
      subTitle: { selector: "subtitle" },
      url: { selector: "id", filters: [{ name: "prepend", args: ["/torrents/"] }] }, // 构造详情链接
      time: { selector: "uploaded_at" }, // ISO 时间串, 原样展示
      size: { selector: "size_bytes", filters: [{ name: "parseNumber" }] }, // 原始字节数
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "completed" },
      category: { selector: "category.name" },
    },
  },

  list: [
    {
      urlPattern: ["/torrents"],
      // 关键: content-script 先判断 list 再判断 detail, /torrents 会误匹配详情页 /torrents/8448,
      // 必须排除详情页路径, 否则详情页被当作列表页解析 → "未解析到当前页面种子"
      excludeUrlPattern: ["/torrents/[0-9a-z-]+", "/torrents/\\d+"],
      mergeSearchSelectors: false,
      selectors: {
        keywords: { selector: "input[placeholder*='搜索']" },
        rows: { selector: 'a[href^="/torrents/"]' },
        id: { selector: ":self", attr: "href", filters: [{ name: "replace", args: ["/torrents/", ""] }] },
        title: { selector: "h3" },
        url: { selector: ":self", attr: "href" },
        size: { selector: "span.font-medium.tabular-nums" },
        seeders: { selector: "span.text-success-foreground" },
        leechers: { selector: "span.text-destructive" },
        time: { selector: "time.ml-auto" },
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
      link: { text: "" },
    },
  },

  userInfo: {
    process: [
      {
        // 会话认证用户信息: /api/v1/session 需携带 cookie 才返回数据
        requestConfig: { url: "/api/v1/session", responseType: "json" },
        requestConfigTransformer: (config, _userInfo, siteInstance) => {
          const cookieStr = (siteInstance as RousiPro).rousiproCookie;
          if (cookieStr) {
            config.headers = { ...(config.headers ?? {}), Cookie: cookieStr };
          }
          return config;
        },
        selectors: {
          id: { selector: ["data.user.id", "data.id"] },
          name: { selector: ["data.user.username", "data.username"] },
          uploaded: {
            selector: ["data.user.uploaded", "data.uploaded"],
            filters: [{ name: "parseNumber" }],
          },
          downloaded: {
            selector: ["data.user.downloaded", "data.downloaded"],
            filters: [{ name: "parseNumber" }],
          },
          ratio: { selector: ["data.user.ratio", "data.ratio"] },
          bonus: { selector: ["data.user.karma", "data.karma"] },
          seeding: {
            selector: ["data.user.seeding_leeching_data.seeding_count", "data.seeding_leeching_data.seeding_count"],
            filters: [{ name: "parseNumber" }],
          },
          seedingSize: {
            selector: ["data.user.seeding_leeching_data.seeding_size", "data.seeding_leeching_data.seeding_size"],
            filters: [{ name: "parseNumber" }],
          },
          leeching: {
            selector: ["data.user.seeding_leeching_data.leeching_count", "data.seeding_leeching_data.leeching_count"],
            filters: [{ name: "parseNumber" }],
          },
          leechingSize: {
            selector: ["data.user.seeding_leeching_data.leeching_size", "data.seeding_leeching_data.leeching_size"],
            filters: [{ name: "parseNumber" }],
          },
          levelName: { selector: ["data.user.level_text", "data.level_text"] },
          joinTime: {
            selector: ["data.user.registered_at", "data.registered_at"],
            elementProcess: (value: string) => (value ? new Date(value).getTime() : value),
          },
        },
      },
    ],
  },
};

const promotionTagMap: Record<string, TPreDefinedTorrentTagName> = {
  free: "Free",
  double_up: "2xUp",
  double_upload_free: "2xFree",
  half_download: "50%",
  double_up_half_download: "2x50%",
};

export default class RousiPro extends PrivateSite {
  /** 最近一次预读取的 rousi.pro 会话 cookie (供 getTorrentDownloadRequestConfig 复用) */
  rousiproCookie = "";

  /**
   * 用户信息: 直接实现多端点获取, 不再走 userInfo.process。
   * rousi.pro 的 /api/v1/session 只返回 id/username, 统计字段(上传/下载/分享率/积分/等级)
   * 分散在 /api/v1/me/traffic、/api/v1/me/economy、/api/v1/me/tracker-activity。
   * 所有端点都需要会话 cookie, 请求从 offscreen 跨域发出默认不带 cookie,
   * 故统一通过 getAllCookies 预读并注入 Cookie header (由 replaceUnsafeHeader 的 DNR 机制生效)。
   */
  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    if (!this.allowQueryUserInfo) {
      return {
        status: EResultParseStatus.passParse,
        updateAt: +new Date(),
        site: this.metadata.id,
      };
    }

    const cookieStr = await getRousiCookieHeader(this.url as string);
    this.rousiproCookie = cookieStr;
    const headers: Record<string, string> = cookieStr ? { Cookie: cookieStr } : {};

    const flushUserInfo: IUserInfo = {
      ...(lastUserInfo ?? {}),
      status: EResultParseStatus.unknownError,
      updateAt: +new Date(),
      site: this.metadata.id,
    };

    try {
      // 1. session → id / name
      const session = await this.request<any>({ url: "/api/v1/session", responseType: "json", headers });
      const user = session.data?.user;
      if (user?.id) {
        flushUserInfo.id = user.id;
        flushUserInfo.name = user.username ?? user.display_name;
      }
      if (!flushUserInfo.id) {
        throw new Error("RousiPro session has no user (need login)");
      }

      // 2. me/traffic → 上传/下载/分享率
      const traffic = await this.request<any>({
        url: "/api/v1/me/traffic",
        params: { limit: 20 },
        responseType: "json",
        headers,
      });
      const totals = traffic.data?.totals;
      if (totals) {
        const up = parseInt(totals.raw_uploaded_bytes ?? totals.credited_uploaded_bytes ?? "0", 10);
        const down = parseInt(totals.raw_downloaded_bytes ?? totals.charged_downloaded_bytes ?? "0", 10);
        if (up > 0 || down > 0) {
          flushUserInfo.uploaded = up;
          flushUserInfo.downloaded = down;
          if (down > 0) {
            flushUserInfo.ratio = +(up / down).toFixed(3);
          }
        }
      }

      // 3. me/economy → 积分(magic) 与 等级
      const economy = await this.request<any>({
        url: "/api/v1/me/economy",
        params: { limit: 1 },
        responseType: "json",
        headers,
      });
      const eco = economy.data;
      if (eco) {
        const magic = parseFloat(eco.magic_balance ?? "0");
        if (magic > 0 || eco.magic_balance) {
          flushUserInfo.bonus = magic;
        }
        const level = eco.progress?.level;
        if (typeof level === "number") {
          flushUserInfo.levelId = level;
          flushUserInfo.levelName = `Lv.${level}`;
        }
      }

      // 4. me/tracker-activity → 做种/下载中/做种量
      try {
        const tracker = await this.request<any>({
          url: "/api/v1/me/tracker-activity",
          responseType: "json",
          headers,
        });
        const items = tracker.data?.items;
        if (Array.isArray(items)) {
          let seeding = 0;
          let seedingSize = 0;
          let leeching = 0;
          for (const it of items) {
            const act = String(it?.action ?? it?.state ?? it?.status ?? "").toLowerCase();
            const size = parseInt(it?.size_bytes ?? it?.size ?? it?.payload_size_bytes ?? "0", 10) || 0;
            if (act.includes("seed")) {
              seeding += 1;
              seedingSize += size;
            } else if (act.includes("leech") || act.includes("down")) {
              leeching += 1;
            } else if (size > 0) {
              seeding += 1; // 未知状态但有大小, 按做种计入
              seedingSize += size;
            }
          }
          flushUserInfo.seeding = seeding;
          flushUserInfo.seedingSize = seedingSize;
          flushUserInfo.leeching = leeching;
        }
      } catch (e) {
        // tracker-activity 获取失败不致命
        console?.debug("[RousiPro] tracker-activity failed", e);
      }

      // 5. users/:username → 注册时间/发种数
      try {
        const profile = await this.request<any>({
          url: `/api/v1/users/${flushUserInfo.name}`,
          responseType: "json",
          headers,
        });
        const p = profile.data;
        if (p?.joined_at) {
          flushUserInfo.joinTime = new Date(p.joined_at).getTime();
        }
        if (typeof p?.published_torrent_count === "number") {
          flushUserInfo.uploads = p.published_torrent_count;
        }
      } catch (e) {
        console?.debug("[RousiPro] users profile failed", e);
      }

      flushUserInfo.status = EResultParseStatus.success;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[RousiPro] getUserInfoResult", error);
      }
      flushUserInfo.status = EResultParseStatus.parseError;
    }

    return flushUserInfo;
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Record<string, any>,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    torrent = super.parseTorrentRowForTags(torrent, row, searchConfig);

    // 将种子的促销标签加入 tags 中 (promotion 为字符串, 如 double_upload_free)
    const promotion = row && (row as any).promotion;
    if (promotion && promotionTagMap[promotion]) {
      torrent.tags = torrent.tags || [];
      torrent.tags.push({ name: promotionTagMap[promotion] } as ITorrentTag);
    }

    return torrent;
  }

  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    // fix: 如果 torrent 对象没有 id ，则依次尝试从 url, link 中提取
    if (!torrent.id && (torrent.url || torrent.link)) {
      let match;
      if (torrent.url?.includes("/torrent")) {
        match = torrent.url.match(torrentIdRegex);
      } else if (torrent.link?.includes("/torrent")) {
        match = torrent.link.match(torrentIdRegex);
      }

      if (match) {
        torrent.id = match[1];
      }
    }

    // 会话认证下载端点(已实测返回 .torrent)
    return `${this.url}api/v1/torrents/${torrent.id}/download`;
  }

  /**
   * 下载种子需携带 rousi.pro 会话 cookie:
   * - 本地 extension 下载 / qBittorrent 中转(localDownloadOption) 都会使用这里的配置,
   *   显式注入 Cookie header 后即可通过 DNR 机制带上登录态。
   */
  public override async getTorrentDownloadRequestConfig(torrent: ITorrent): Promise<AxiosRequestConfig> {
    const config = await super.getTorrentDownloadRequestConfig(torrent);
    const cookieStr = await getRousiCookieHeader(this.url as string);
    if (cookieStr) {
      config.headers = { ...(config.headers ?? {}), Cookie: cookieStr };
    }
    return config;
  }
}
