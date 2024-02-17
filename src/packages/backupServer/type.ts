export interface IBackupConfig {
  id?: string;
  type: string;
  address: string;
  name: string;
  lastBackupTime?: number;

  config: Record<string, string | boolean | number>;
}

export interface IBackupMetadata<T extends IBackupConfig> {
  requiredField: {
    name?: string; // 显示名称，可以是一个 vue-i18n 键值，如果缺失，则直接显示为 key 的值
    key: keyof T["config"];
    type: "string" | "boolean" | "number";
    description?: string;
  }[];
}

export interface IBackupFileInfo {
  filename: string;
  path: string;
  time: number;
  size: number;
}

export enum EListOrderBy {
  time = "time",
  name = "name",
  size = "size",
}

export enum EListOrderMode {
  desc = "desc",
  asc = "asc",
}

export interface IBackupFileListOption {
  orderBy?: EListOrderBy;
  orderMode?: EListOrderMode;
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
  list: (options: IBackupFileListOption) => Promise<IBackupFileInfo[]>;

  addFile: (fileName: string, file: Blob) => Promise<boolean>;

  /**
   * 获取（下载）一个文件
   * @param path
   * @returns 返回一个 binary 数据
   */
  getFile: (path: string) => Promise<Blob>;

  deleteFile: (path: string) => Promise<boolean>;
}
