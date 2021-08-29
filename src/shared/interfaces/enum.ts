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

/**
 * 插件安装方式
 */
export enum EInstallType {
  development = 'development', // 相当于 zip 解压方式安装
  normal = 'normal', // 从 官方市场 安装
  packed = 'packed' // 从 自打包CRX/XPI 安装（相当于原 EInstallType.crx ）
}
