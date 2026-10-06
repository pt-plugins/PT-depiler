/**
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/sunny.json
 */
import { type AxiosRequestConfig, type AxiosResponse } from "axios";

import { ISearchInput, type ISiteMetadata, type ITorrent } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";

interface ISunnyPtResponse<T> {
  code: number;
  data: T;
  msg?: string;
}

interface ISunnyPtTorrent {
  id: number;
  title: string;
  subtitle: string;
  media_type: "movie" | "tv";
  category: { id: number; name: string };
  size: number;
  created_at: string;
  seeders: number;
  leechers: number;
  completed: number;
  imdb_id?: string;
  tmdb_id?: string;
  tags: string[];
  hit_and_run: boolean;
  promotion: { is_active: boolean; up_multiplier: number; down_multiplier: number; until: string };
  details_url: string;
}

export const siteMetadata: ISiteMetadata = {
  version: 2,
  id: "sunnypt",
  name: "Sunny",
  aka: ["SunnyPT", "阳光"],
  description: "The Ultimate File Sharing Experience",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",
  favicon: "./sunnypt.ico",

  collaborator: ["yanleichang"],

  type: "private",
  schema: "SunnyPT",

  urls: ["uggcf://fhaalcg.gbc/"],

  userInputSettingMeta: [
    {
      name: "apiKey",
      label: "API Key",
      hint: "从站点设置页面获取 API Key",
      required: true,
    },
  ],

  // -----------------------------------------------------------------------
  // Torrent search — GET /api/v1/mp/torrents
  // -----------------------------------------------------------------------
  search: {
    keywordPath: "params.keyword",
    requestConfig: {
      method: "GET",
      url: "/torrents",
      responseType: "json",
      params: { page: 1, page_size: 100, sort: "created_at", order: "desc" },
    },
    selectors: {
      rows: { selector: "data.items" },
      id: { selector: "id" },
      title: { selector: "title" },
      subTitle: { selector: "subtitle" },
      category: { selector: "category.name" },
      url: { selector: "details_url" },
      time: { selector: "created_at", filters: [{ name: "parseTime" }] },
      size: { selector: "size" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      completed: { selector: "completed" },
      ext_imdb: { selector: "imdb_id" },
      ext_tmdb: {
        selector: ":self",
        filters: [(raw: ISunnyPtTorrent) => (raw.tmdb_id ? `${raw.media_type}/${raw.tmdb_id}` : "")],
      },
    },
  },

  download: {
    requestConfig: {
      headers: {
        Accept: "application/x-bittorrent",
      },
    },
  },

  // -----------------------------------------------------------------------
  // User info — GET /api/v1/mp/profile
  // -----------------------------------------------------------------------
  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    process: [
      {
        requestConfig: {
          method: "GET",
          url: "/profile",
          responseType: "json",
        },
        selectors: {
          id: { selector: "data.id" },
          name: { selector: "data.username" },
          joinTime: { selector: "data.registered_at" },
          uploaded: { selector: "data.uploaded" },
          downloaded: { selector: "data.downloaded" },
          ratio: { selector: "data.ratio" },
          bonus: { selector: "data.bonus" },
          seeding: { selector: "data.seeding_count" },
          seedingSize: { selector: "data.seeding_size" },
          leeching: { selector: "data.leeching_count" },
          messageCount: { selector: "data.unread_messages" },
          levelName: { selector: "data.level" },
          levelId: { selector: "data.class" },
        },
      },
    ],
  },

  /**
   * 站点用户等级列表，等级名称与要求来自 #1557 中用户提供的站点规则页内容。
   *
   * 注意：`GET /profile` 返回的 `data.class` 是 NexusPHP 的原始 class 常量
   * （0 = Peasant、1 = User … 9 = Nexus Master、10 = VIP … 16 = Staff Leader），
   * 而 schemas/NexusPHP.ts 中 xiaomloveDefaultUserLevelRequirements 的 id 从 1 起、
   * VIP/管理组使用 100/200+，两者并不一致：若直接复用该默认列表，等级会整体错判一级
   * （#1557：站点上的 Insane User 被显示为 Crazy User，且下一级要求错位为 250000 做种积分）。
   * 因此这里直接以站点 class 值作为 id，使其与 `data.class` 一一对应。
   *
   * 其中 User（海贼新人）、Administrator（海军大将）、Sysop（五老星）、Staff Leader（海军元帅）
   * 四级未出现在 #1557 的列表中，名称按其命名规则补全，仍需与站点核对。
   */
  levelRequirements: [
    {
      id: 0, // Peasant
      name: "Peasant（漂泊之人）",
      privilege:
        "被降级的用户，他们有30天时间来提升分享率，否则他们会被踢。不能发表趣味盒内容;不能申请友情链接;不能上传字幕。",
    },
    {
      id: 1, // User
      name: "User（海贼新人）",
      privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。",
    },
    {
      id: 2, // Power User
      name: "Power User（船团精英）",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 40000,
      privilege:
        "得到一个邀请名额;可以直接发布种子;可以查看NFO文档;可以查看用户列表;可以请求续种;可以发送邀请;" +
        "可以查看排行榜;可以查看其它用户的种子历史(如果用户隐私等级未设置为”强”);可以删除自己上传的字幕。",
    },
    {
      id: 3, // Elite User
      name: "Elite User（海贼船长）",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 80000,
      privilege: "Elite User及以上用户封存账号后不会被删除。",
    },
    {
      id: 4, // Crazy User
      name: "Crazy User（过亿海贼）",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 150000,
      privilege: "得到两个邀请名额;可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 5, // Insane User
      name: "Insane User（超新星）",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 250000,
      privilege: "可以查看普通日志。",
    },
    {
      id: 6, // Veteran User
      name: "Veteran User（王下七武海）",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      seedingBonus: 400000,
      isKept: true,
      privilege: "得到三个邀请名额；可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 7, // Extreme User
      name: "Extreme User（海上皇帝）",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      seedingBonus: 600000,
      isKept: true,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 8, // Ultimate User
      name: "Ultimate User（海贼王）",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      seedingBonus: 800000,
      isKept: true,
      privilege: "得到五个邀请名额。",
    },
    {
      id: 9, // Nexus Master
      name: "Nexus Master（传说海贼）",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      seedingBonus: 1000000,
      isKept: true,
      privilege: "得到十个邀请名额。",
    },
    {
      id: 10, // VIP
      groupType: "vip",
      name: "VIP（天龙人）",
      privilege: "和Nexus Master拥有相同权限并被认为是精英成员。免除自动降级。",
    },
    {
      id: 11, // Retiree
      groupType: "manager",
      name: "Retiree（隐世豪杰）",
      privilege: "退休后的管理组成员。",
    },
    {
      id: 12, // Uploader
      groupType: "manager",
      name: "Uploader（CP0）",
      privilege: "专注的发布者。免除自动降级；可以查看匿名用户的真实身份。",
    },
    {
      id: 13, // Moderator
      groupType: "manager",
      name: "Moderator（本部中将）",
      privilege:
        "可以查看管理组信箱、举报信箱；管理趣味盒内容、投票内容；可以编辑或删除任何发布的种子；可以管理候选；" +
        "可以管理论坛帖子、用户评论；可以查看机密日志；可以删除任何字幕；可以管理日志中的代码、史册；" +
        "可以查看用户的邀请记录；可以管理用户帐号的一般信息。不能管理友情链接、最近消息、论坛版块；" +
        "不能将种子设为置顶或促销；不能查看用户IP或Email等机密信息；不能删除账号。",
    },
    {
      id: 14, // Administrator
      groupType: "manager",
      name: "Administrator（海军大将）",
      privilege: "除了不能改变站点设定、管理捐赠外，可以做任何事。",
    },
    {
      id: 15, // Sysop
      groupType: "manager",
      name: "Sysop（五老星）",
      privilege: "网站开发/维护人员，可以改变站点设定，不能管理捐赠。",
    },
    {
      id: 16, // Staff Leader
      groupType: "manager",
      name: "Staff Leader（海军元帅）",
      privilege: "网站主管，可以做任何事。",
    },
  ],
};

// ---------------------------------------------------------------------------
// SunnyPT site class — API-based site using X-API-Key authentication
// ---------------------------------------------------------------------------

export default class SunnyPT extends PrivateSite {
  /** SunnyPT 公开集成 API 的地址 */
  get apiBaseUrl(): string {
    return "https://api.sunnypt.top/api/v1/mp/";
  }

  /**
   * 覆写 request 方法，将所有请求指向 SunnyPT API：
   *   - baseURL 设为 https://api.sunnypt.top/api/v1/mp/
   *   - 统一添加 X-API-Key 认证头
   *   - 默认 responseType 为 json
   */
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    axiosConfig.baseURL ??= this.apiBaseUrl;
    axiosConfig.responseType ??= "json";
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      "X-API-Key": this.userConfig.inputSetting?.apiKey ?? "",
    };
    return super.request<T>(axiosConfig, checkLogin);
  }

  /**
   * SunnyPT API 正常响应为 { code: 0, data: ... }。
   * HTTP 200 + code === 0 视为已登录 / 请求成功。
   */
  protected override loggedCheck(raw: AxiosResponse<ISunnyPtResponse<unknown>>): boolean {
    return raw.status >= 200 && raw.status < 300 && raw.data?.code === 0;
  }

  /**
   * fixLink 应使用站点主页 URL 作为基址，而非 API 地址。
   * 这样 API 返回的相对详情页路径会被正确拼接为 https://sunnypt.top/...。
   */
  protected override fixLink(uri: string, requestConfig: AxiosRequestConfig): string {
    return super.fixLink(uri, { ...requestConfig, baseURL: this.url });
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: ISunnyPtTorrent,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    let torrentTags = torrent.tags ?? [];

    // 解析 promotion
    if (row.promotion?.is_active) {
      const { up_multiplier, down_multiplier } = row.promotion;
      if (up_multiplier == 1 && down_multiplier == 0) {
        torrentTags.push({ name: "Free" });
      } else if (up_multiplier == 2 && down_multiplier == 1) {
        torrentTags.push({ name: "2x" });
      } else if (up_multiplier == 2 && down_multiplier == 0) {
        torrentTags.push({ name: "2xFree" });
      } else if (up_multiplier == 1 && down_multiplier == 0.5) {
        torrentTags.push({ name: "50%" });
      } else if (up_multiplier == 2 && down_multiplier == 0.5) {
        torrentTags.push({ name: "2x50%" });
      } else if (up_multiplier == 1 && down_multiplier == 0.3) {
        torrentTags.push({ name: "30%" });
      }
    }

    if (row.hit_and_run) {
      torrentTags.push({ name: "H&R" });
    }

    if (row.tags && row.tags.length > 0) {
      torrentTags.push(...row.tags.map((tagName) => ({ name: tagName })));
    }

    torrent.tags = torrentTags;
    return torrent;
  }

  /**
   * SunnyPT 下载需要先通过 POST /torrents/{id}/download-token
   * 获取临时下载链接。
   */
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    const response = await this.request<ISunnyPtResponse<{ download_url?: string }>>(
      {
        method: "POST",
        url: `/torrents/${encodeURIComponent(String(torrent.id))}/download-token`,
        responseType: "json",
      },
      false, // 不检查登录状态（token 端点即使未登录也有合理返回）
    );

    let downloadUrl = response.data?.data?.download_url ?? "";

    // 260729 api 返回的url并不能直接请求，需要做一层替换？是他们写的bug吗？先做一层兼容吧，也反馈给官方了。
    downloadUrl = downloadUrl.replace("https://sunnypt.top/", "https://api.sunnypt.top/");
    return downloadUrl;
  }
}
