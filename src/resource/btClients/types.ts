/**
 * 对于 Bittorrent 软件的定义
 */
import { AxiosRequestConfig } from 'axios';

export type TorrentClientFeature = 'CustomPath'

// 最通用的自定义目录提示词
export const CustomPathDescription = '当前目录列表配置是指定硬盘上的绝对路径，如 /volume1/music/ 或 D:\\download\\music\\。请确保对应路径软件有写入权限。';

/**
 * 客户端配置信息
 */
export interface BittorrentClientBaseConfig {
  /**
   * UUIDv4
   * 系统使用这个信息判断并生成唯一的客户端
   */
  uuid: string;

  /**
   * 客户端类型，与文件名相同
   */
  type: string;

  /**
   * 客户端名称
   * The name of client which can help users recognise it quickly
   */
  name: string;

  /**
   * The full url of torrent client webapi, like:
   *    - transmission:  http://ip:port/transmission/rpc
   *    - qbittorrent:   http://ip:port/
   */
  address: string;

  username?: string;
  password?: string;

  /**
   * request timeout
   */
  timeout?: number;

  feature?: {
    [feature in TorrentClientFeature]?: boolean;
  }
}

// 强制要求填写用户名和密码
export interface TorrentClientConfig extends BittorrentClientBaseConfig {
  username: string;
  password: string;
}

export interface TorrentClientFeatureMetaData {
  allowed: boolean, // 该客户端是否允许该特征
  description?: string, // 该特征的相关说明
}

/**
 * 客户端介绍信息
 */
export interface TorrentClientMetaData {
  description?: string; // 客户端介绍
  warning?: string[]; // 用于配置时显示的警告信息，要用于一些特殊提示

  feature: {
    [feature in TorrentClientFeature]: TorrentClientFeatureMetaData
  }
}

export enum CTorrentState {
  downloading = 'downloading',
  seeding = 'seeding',
  paused = 'paused',
  queued = 'queued',
  checking = 'checking',
  error = 'error',
  unknown = 'unknown',
}

// 获得到的种子实例
export interface CTorrent {
  id: string | number;
  infoHash: string;

  name: string;

  /**
   * progress percent out of 100
   */
  progress: number;
  isCompleted: boolean;

  /**
   * 1:1 is 1, half seeded is 0.5
   */
  ratio: number;

  /**
   * date as timestamp (s)
   */
  dateAdded: number;

  savePath: string;
  label?: string;
  state: CTorrentState;

  /**
   * total size of the torrent, in bytes
   */
  totalSize: number;

  /**
   * bytes per second
   */
  uploadSpeed: number;
  /**
   * bytes per second
   */
  downloadSpeed: number;

  /**
   * total upload in bytes
   */
  totalUploaded: number;
  /**
   * total download in bytes
   */
  totalDownloaded: number;
}

// 种子筛选方法
export interface CTorrentFilterRules {
  ids?: any;
  complete?: boolean;
}

// 添加种子
export interface CAddTorrentOptions {
  /**
   * 是否本地下载
   */
  localDownload: boolean;
  localDownloadOption?: AxiosRequestConfig;

  /**
   * 是否将种子置于暂停状态
   */
  addAtPaused: boolean;

  /**
   * 种子下载地址
   */
  savePath: string;

  /**
   * called a label in some clients and a category in others
   * Notice: Some clients didn't support it
   */
  label?: string;
}
