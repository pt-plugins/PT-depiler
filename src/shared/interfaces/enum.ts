/**
 * 参数配置键值
 */
export enum EConfigKey {
  default = 'PT-Plugin-Plus-Config',
  downloadHistory = 'PT-Plugin-Plus-downloadHistory',
  systemLogs = 'PT-Plugin-Plus-systemLogs',
  uiOptions = 'PT-Plugin-Plus-uiOptions',
  cache = 'PT-Plugin-Plus-Cache-Contents',
  userDatas = 'PT-Plugin-Plus-User-Datas',
  collection = 'PT-Plugin-Plus-Collection',
  searchResultSnapshot = 'PT-Plugin-Plus-SearchResultSnapshot',
  keepUploadTask = 'PT-Plugin-Plus-KeepUploadTask'
}

/**
 * 用户数据范围
 */
export enum EUserDataRange {
  latest = 'latest',
  today = 'today',
  all = 'all'
}

// 种子当前状态
export enum ETorrentStatus {
  unknown, // 状态不明
  downloading, // 正在下载
  seeding, // 正在做种
  completed, // 已完成，未做种
  inactive // 未活动（曾经下载过，但未完成）
}
