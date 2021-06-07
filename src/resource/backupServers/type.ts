
export interface IBackupConfig {
  id: string;
  type: string;
  address: string;
  name: string;
  lastBackupTime?: number;

  config: Record<string, string | boolean | number>;
}

export interface IBackupMetadata {
  // TODO
}

export interface IBackupFileInfo {
  filename: string,
  time: number,
  size: number
}

export interface IBackupServer<T extends IBackupConfig> {
  config: T;

  /**
   * 验证服务器可用性
   */
  ping: () => Promise<boolean>;

  /**
   * 获取资源列表
   * @param options
   */
  list: (options: any) => Promise<IBackupFileInfo[]>;

  addFile: (fileName: string, file: Blob) => Promise<boolean>;

  /**
   * 获取（下载）一个文件
   * @param path
   * @returns 返回一个 binary 数据
   */
  getFile: (path: string) => Promise<Blob>;

  deleteFile: (path: string) => Promise<boolean>;
}
