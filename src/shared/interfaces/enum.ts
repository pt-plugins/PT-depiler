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
  inactive, // 未活动（曾经下载过，但未完成）
  completed, // 已完成，未做种， 旧版值 255
}

export enum ETorrentBaseTagColor {
  'Free' = 'blue', // 免费下载
  '2xFree' = 'green', // 免费下载 + 2x 上传
  '2xUp' = 'lime', // 2x 上传
  '2x50%' = 'light-green', // 2x 上传 + 50% 下载
  '25%' = 'purple', // 25% 下载
  '30%' = 'indigo', // 30% 下载
  '35%' = 'indigo darken-3', // 35% 下载
  '50%' = 'orange', // 50% 下载
  '70%' = 'blue-grey', // 70% 下载
  '75%' = 'lime darken-3', // 75% 下载
  'VIP' = 'orange darken-2', // 仅 VIP 可下载
  'Excl.' = 'deep-orange darken-1', // 禁止转载
}
