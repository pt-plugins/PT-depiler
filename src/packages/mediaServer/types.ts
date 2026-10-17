import { AxiosRequestConfig } from "axios";
import { EResultParseStatus } from "@ptd/site";

export type IMediaServerId = string;
export type TAuthType = "user" | "apikey";

export interface IMediaServerBaseConfig {
  // 系统使用这个信息判断并生成唯一的客户端
  id?: IMediaServerId;
  // 客户端类型，与文件名相同
  type: string;
  // 客户端名称，用于用户辨识
  name: string;

  // 媒体服务器地址
  address: string;
  // 媒体服务器认证方式
  auth: Record<string, string>;
  // 媒体服务器请求超时
  timeout?: number;

  defaultSearchExtraRequestConfig?: AxiosRequestConfig; // 默认的搜索请求配置

  [key: string]: any;
}

export interface IMediaServerMetadata {
  // 客户端介绍
  description?: string;
  // 用于配置时显示的警告信息，要用于一些特殊提示
  warning?: string[];
  /**
   * 该客户端的认证的字段，对应字段会被放入 config.auth 中
   */
  auth_field: Array<
    | string //  等同于 { name: string; required: true }
    // name: 字段名称  required: 是否必填  message: 提示信息
    | { name: string; required: boolean; message?: string }
  >;
}

export interface IMediaServerItem<RAW = any> {
  // 所在的媒体服务器id
  server: IMediaServerId;
  /** 服务器侧的条目 id（调研 B12：详情弹窗按需二次拉取时要用） */
  id?: string;
  // 名称
  name: string;
  // 对应服务器浏览地址
  url: string;

  // 媒体信息
  type: "Movie" | string; // 影片类型
  description?: string; // 影片描述
  format?: string; // 容器格式 如 MP4, MKV
  size?: number; // 文件大小
  duration?: number; // 时长
  poster?: string; // 封面图
  tags?: Array<{ name: string; url?: string }>; // 标签
  rating?: number | "-"; // 评分

  streams?: {
    title: string;
    type: "Video" | "Audio" | "Subtitle" | string; // 流类型
    format: string; // 流格式
  }[];

  /**
   * 媒体详情：分辨率 / 码率 / 音轨 / 字幕 的**结构化**汇总（调研 A2）。
   *
   * 之所以单独成字段而不是让页面去读 `raw`：各服务器的原始结构不同（Emby/Jellyfin 的
   * `MediaSources[0].MediaStreams`、Plex 的 `Media[0].Part[0]`…），差异应当止步于实体映射层。
   * 只有 Emby / Jellyfin 会填（其余服务器可以为空，UI 必须容忍缺省）。
   */
  mediaInfo?: {
    video?: {
      width?: number;
      height?: number;
      /** 规范化标签：480p / 720p / 1080p / 1440p / 4K / 8K */
      resolution?: string;
      codec?: string;
      profile?: string;
      /** 色域：SDR / HDR10 / HDR10+ / DolbyVision（HLG 等按原始值透出） */
      videoRange?: string;
      /** 总码率（bps） */
      bitrate?: number;
      /** 帧率 */
      frameRate?: number;
    };
    audio?: Array<{
      title?: string;
      codec?: string;
      /** ISO 639-2/3 语言码，如 chi / eng / jpn */
      language?: string;
      channels?: number;
      channelLayout?: string;
      isDefault?: boolean;
    }>;
    subtitle?: Array<{
      title?: string;
      codec?: string;
      language?: string;
      /** true = 外挂字幕，false/undefined = 内封 */
      isExternal?: boolean;
      isDefault?: boolean;
    }>;
  };

  /** 文件路径（调研 A3，用于按磁盘/目录聚合） */
  path?: string;
  /** 入库时间（调研 A4，ISO 字符串） */
  dateCreated?: string;
  /** 外部链接（调研 A5：IMDb / TMDB 等） */
  externalUrls?: Array<{ name: string; url: string }>;

  // —— 以下为调研 B8–B12：轻量字段随列表一起请求；People 这类重字段只在详情弹窗按需拉取 ——

  /** 发行/首播年份（B8） */
  productionYear?: number;
  /** 首播日期 ISO（B8） */
  premiereDate?: string;
  /** 官方分级，如 PG-13 / R（B8） */
  officialRating?: string;
  /** 影评人评分（B8） */
  criticRating?: number;
  /** 制片公司（B8） */
  studios?: string[];
  /** 库内媒体源数量，> 1 表示同片多版本（B9） */
  mediaSourceCount?: number;
  /** 剧集：直接子项数（B10） */
  childCount?: number;
  /** 剧集：递归子项数，即总集数（B10） */
  recursiveItemCount?: number;
  /** 剧集名（B10） */
  seriesName?: string;
  /** 集号 / 季号（B10） */
  indexNumber?: number;
  parentIndexNumber?: number;
  /** 是否高清（B11，`mediaInfo.video.resolution` 缺失时的回退） */
  isHd?: boolean;
  width?: number;
  height?: number;
  /** 外部标识（B7）：`{ imdb: "tt1234567", tmdb: "…", tvdb: "…" }`，用于跳站点搜索 */
  providerIds?: Record<string, string>;
  /** 自定义标签（B12，区别于 genres 的 `tags`） */
  labels?: string[];
  /** 宣传语（B12） */
  taglines?: string[];
  /** 演职人员（B12，**只在详情弹窗二次拉取**，列表里为空） */
  people?: Array<{ name: string; role?: string; type?: string }>;

  // 用户对该媒体的情况
  user: {
    IsFavorite?: boolean; // 是否喜欢
    IsPlayed?: boolean; // 是否已播放过

    /** 播放次数（调研 A6） */
    playCount?: number;
    /** 已观看秒数（调研 A6，由 PlaybackPositionTicks 换算） */
    playbackPosition?: number;
    /** 播放进度百分比 0-100（调研 A6；已看完为 100） */
    playedPercentage?: number;
    /** 最近观看时间 ISO（调研 A6） */
    lastPlayedDate?: string;
  };

  // 服务器的原始返回
  raw: RAW;
}

export interface IMediaServerSearchOptions {
  startIndex?: number; // 起始索引
  limit?: number; // 限制数量
}

/** 媒体库概览里的一个聚合分组（key 用服务器原始值，UI 直接展示，不做本地化） */
export interface IMediaServerOverviewEntry {
  key: string;
  count: number;
  /** 该组条目的体积合计（字节） */
  size: number;
}

/** 媒体库概览的可选参数（调研 C14 / C20） */
export interface IMediaServerOverviewOptions {
  /** 最多扫描多少条目（默认 20000），防止超大库把 offscreen 拖死 */
  maxItems?: number;
  /** 每页条数（默认 200） */
  pageSize?: number;
}

/**
 * 媒体库概览（调研 C14 库存与空间分析 + C20 媒体库概览）。
 *
 * **整库遍历后必须就地聚合**，只回传这个小对象 —— 不要把几千条条目跨消息边界搬给 UI。
 * 由设置页的按钮**按需触发**（默认不获取）。
 */
export interface IMediaServerOverview {
  mediaServerId: IMediaServerId;
  /** 生成时间（毫秒） */
  generatedAt: number;
  /** 是否因达到条目上限提前结束（结果仍可用，但只覆盖部分库） */
  truncated: boolean;
  totalItems: number;
  totalSize: number;
  /** 平均码率（bps）：只统计有码率的条目 */
  averageBitrate?: number;
  byResolution: IMediaServerOverviewEntry[];
  byCodec: IMediaServerOverviewEntry[];
  byContainer: IMediaServerOverviewEntry[];
  /** 按库根/磁盘聚合（C14） */
  byRootPath: IMediaServerOverviewEntry[];
  watch: {
    /** 看完 */
    watched: number;
    /** 看了一部分 */
    partial: number;
    /** 从未观看 */
    unwatched: number;
    totalPlays: number;
  };
  /** 每 GB 观看次数（C14）：衡量占用的空间「值不值」 */
  playsPerGb?: number;
  /** 占空间但从未观看，按体积降序（C14，最多 10 条） */
  neverWatched: Array<{ name: string; size: number; productionYear?: number }>;
  /** 最近 7 天入库，按时间降序（C20，最多 10 条） */
  recentlyAdded: Array<{ name: string; dateCreated?: string }>;
}

export interface IMediaServerSearchResult<RAW = any> {
  status: EResultParseStatus; // 状态码

  // 搜索结果
  items: IMediaServerItem<RAW>[];
  options?: IMediaServerSearchOptions;

  // 非 success 时附带的真实错误信息（如 timeout of 5000ms exceeded），用于 UI 展示失败原因
  errorMessage?: string;
}

export abstract class AbstractMediaServer<T extends IMediaServerBaseConfig = IMediaServerBaseConfig> {
  readonly config: T;

  protected constructor(options: T) {
    this.config = options as T;
  }

  // 检查客户端是否可以连接
  public abstract ping(): Promise<boolean>;

  /**
   * 获取搜索数据
   * 注意：我们对 keywords 同样约定了 ${advanceField}|${keywords} 的高级搜索方式，但不同的服务器进行实现不一致
   */
  public abstract getSearchResult(
    keywords?: string,
    options?: IMediaServerSearchOptions,
  ): Promise<IMediaServerSearchResult>;

  /**
   * 按 id 拉取**单条目**的完整信息（调研 B12）。
   *
   * 列表接口只请求轻量字段（`/Items` 的响应本来就带 `MediaSources`，再加 `People` 会明显变大），
   * 重量级字段（演职人员等）在详情弹窗打开时再调一次这里。默认不实现 —— 不支持的服务器返回 `undefined`，
   * 调用方据此不渲染额外区块。
   */
  public async getItemDetail(_itemId: string): Promise<IMediaServerItem | undefined> {
    return undefined;
  }

  /**
   * 调研 C14 / C20：**按需**生成媒体库概览（库存与空间分析 + 概览数字）。
   *
   * 需要遍历整库，所以默认不实现；调用方（设置页的按钮）显式触发。实现方必须就地聚合，
   * 只返回 {@link IMediaServerOverview} 这个小对象。
   */
  public async getLibraryOverview(
    _options: IMediaServerOverviewOptions = {},
  ): Promise<IMediaServerOverview | undefined> {
    return undefined;
  }
}
