/**
 * 辅种任务相关类型定义
 */

import type { TSiteID } from "@ptd/site";
import type { TDownloaderKey } from "./metadata.ts";
import type { CAddTorrentOptions } from "@ptd/downloader";

export type TKeepUploadTaskKey = string;

/**
 * 辅种任务中的种子项
 */
export interface IKeepUploadTaskItem {
  site: TSiteID; // 站点id
  title: string; // 标题
  subTitle?: string; // 副标题
  link: string; // 详情页链接
  url: string; // 种子下载链接
  size: number; // 大小
  seeders?: number; // 上传者数量
  leechers?: number; // 下载者数量
  [key: string]: any; // 其他属性
}

/**
 * 辅种任务下载选项
 */
export interface IKeepUploadTaskDownloadOptions {
  downloaderId: TDownloaderKey; // 下载器id
  savePath?: string; // 保存路径
  clientName?: string; // 下载器名称（用于显示）
  addTorrentOptions?: Partial<CAddTorrentOptions>; // 其他下载选项
}

/**
 * 辅种任务
 */
export interface IKeepUploadTask {
  id: TKeepUploadTaskKey; // 任务id
  time: number; // 创建时间
  title: string; // 任务标题（第一个种子的标题）
  size: number; // 种子大小
  downloadOptions: IKeepUploadTaskDownloadOptions; // 下载选项
  items: IKeepUploadTaskItem[]; // 种子列表
}

/**
 * 辅种任务存储结构
 */
export type TKeepUploadTaskStorageSchema = Record<TKeepUploadTaskKey, IKeepUploadTask>;
