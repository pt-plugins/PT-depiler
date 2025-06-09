// Error classes
export class NeedLoginError extends Error {}
export class NoTorrentsError extends Error {}

export type TSiteID = string; // should match regexp /[0-9a-z]+/
export type TSiteHost = string;

export type TSiteFullUrl = `${"http" | "https"}://${TSiteHost}/`;

/**
 * 使用 ROT13 加密的站点完整链接
 * 这种加密方式是为了防止站点链接被爬虫等工具直接抓取，增加了一定的安全性。
 * 注意：这种加密方式并不是真正的加密，而是一种简单的替换加密方式。
 *
 * 可以在 https://rot13.com/ 进行加密和解密操作。
 *
 * refs: https://en.wikipedia.org/wiki/ROT13
 */
export type TSiteFullUrlProtect = `${"uggc" | "uggcf"}://${TSiteHost}/`;
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
