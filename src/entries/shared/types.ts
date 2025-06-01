/**
 * 此处存放一些 共享的类型定义，但是又不好归类到其他模块的类型定义
 */

import type { TBackupFields } from "./types/storages/metadata.ts";

// 代理转发所有 types 导出
export * from "./types/storages/config.ts";
export * from "./types/storages/indexdb.ts";
export * from "./types/storages/metadata.ts";
export * from "./types/storages/runtime.ts";
export * from "./types/storages/other.ts";

// https://github.com/pt-plugins/PT-Plugin-Plus/blob/70761980a72351397e19e188bead3289d36b4f83/src/interface/common.ts#L648-L726
export interface IPtppUserInfo {
  id: number | string; // 用户ID
  name: string; // 用户名
  uploaded?: number; // 上传量
  uploads?: number; // 发布数
  downloaded?: number; // 下载量
  trueDownloaded?: string | number; // 真实下载量
  totalTraffic?: string | number; // 总流量
  snatches?: number; // 完成数
  ratio?: number; // 分享率
  seeding?: number; // 当前做种数量
  seedingSize?: number; // 做种体积
  seedingList?: string[]; // 做种列表
  leeching?: number; // 当前下载数量
  levelName?: string; // 等级名称
  bonus?: number; // 魔力值/积分
  seedingPoints?: number; // 保种积分
  seedingTime?: number; // 做种时间要求
  averageSeedtime?: number; // 平均保种时间
  totalSeedtime?: number; // 总保种时间
  bonusPerHour?: number; // 时魔
  bonusPage?: string; // 积分页面
  unsatisfiedsPage?: string; // H&R未达标页面
  joinTime?: number; // 入站时间
  classPoints?: number; // 等级积分
  unsatisfieds?: string | number; // H&R未达标
  prewarn?: number; // H&R预警
  lastUpdateTime?: number; // 最后更新时间
  lastUpdateStatus?: "needLogin" | "notSupported" | "unknown" | "success"; // 最后更新状态  EUserDataRequestStatus
  invites?: number; // 邀请数量
  avatar?: string; // 头像
  isLogged?: boolean; // 是否已登录
  isLoading?: boolean; // 正在加载
  lastErrorMsg?: string; // 最后错误信息
  messageCount?: number; // 消息数量
  uniqueGroups?: number; // 独特分组
  perfectFLAC?: number; // “完美”FLAC
  posts?: number; // 论坛发帖
}

export interface IPtppDumpUserInfo {
  [key: string]: {
    latest: IPtppUserInfo;
    [key: `${string}-${string}-${string}`]: IPtppUserInfo;
  };
}

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
