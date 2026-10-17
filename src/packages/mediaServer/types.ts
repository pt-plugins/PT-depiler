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
}
