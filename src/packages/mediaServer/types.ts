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
  auth_field: string[];
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
