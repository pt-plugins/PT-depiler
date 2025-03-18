// Error classes
export class NeedLoginError extends Error {}
export class NoTorrentsError extends Error {}

export type TSiteID = string; // should match regexp /[0-9a-z]+/
export type TSiteHost = string;

export type TSiteFullUrl = `${"http" | "https"}://${TSiteHost}/`;
export type TSiteFullUrlProtect = `aHR0c${string}`; // btoa('http') -> "aHR0cA=="
export type TSiteUrl = TSiteFullUrl | TSiteFullUrlProtect;

/**
 * 解析状态
 */
export enum EResultParseStatus {
  unknownError, // 未知错误
  waiting, // 队列等待中
  working, // 正在搜索中
  success, // 搜索成功
  parseError, // 解析错误
  passParse, // 跳过解析
  needLogin, // 需要登录
  noResults, // 等同于原先的 noTorrents 和 torrentTableIsEmpty ，这两个在结果上没有区别
}
