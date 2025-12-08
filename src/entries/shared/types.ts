/**
 * 此处存放一些 共享的类型定义，但是又不好归类到其他模块的类型定义
 */

import type { TBackupFields } from "./types/storages/metadata.ts";

// 代理转发所有 types 导出
export * from "./types/extends.ts";
export * from "./types/common/download.ts";
export * from "./types/common/ptpp.ts";
export * from "./types/storages/config.ts";
export * from "./types/storages/indexdb.ts";
export * from "./types/storages/metadata.ts";
export * from "./types/storages/runtime.ts";
export * from "./types/storages/other.ts";

export interface IRestoreOptions {
  fields?: TBackupFields[]; // 需要恢复的字段
  expandCookieMinutes?: number; // 是否延长 cookie 过期时间（单位：分钟），（小于0）表示不延长
  keepExistUserInfo?: boolean; // 是否保留现有的用户信息
}

export interface ILoggerItem {
  id?: string; // 日志 ID（自动生成）
  time?: number; // 日志时间（自动生成）
  level?: "log" | "trace" | "debug" | "info" | "warn" | "error"; // 日志级别（不传入时默认为 log）
  module?: string; // 产生该日志的模块
  msg: string; // 日志内容
  data?: any;
}
