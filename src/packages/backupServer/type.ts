export interface IBackupConfig {
  id?: string;
  type: string;
  name: string;

  config: Record<string, string | boolean | number>;
}

export interface IBackupMetadata<T extends IBackupConfig> {
  description?: string; // 客户端介绍
  requiredField: {
    name?: `i18n.${string}` | string; // 显示名称，可以是一个 vue-i18n 键值，如果缺失，则直接显示为 key 的值
    key: keyof T["config"];
    type: "strings" /* textarea */ | "string" /* input */ | "boolean" /* switch */;
    description?: string;
  }[];
}

export interface IBackupFileInfo {
  filename: string;
  path: string;
  time: number;
  size: number | "N/A"; // 文件大小   N/A 表示后端在 list 时不支持
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

export interface IBackupFileManifest {
  time: number;
  version: string;
  encryption: boolean;
  files: Record<string, { hash: string; name: string }>;

  [key: string]: any;
}

export interface IBackupData {
  manifest?: Partial<IBackupFileManifest>;

  cookies?: Record<string, chrome.cookies.Cookie[]>;

  [key: string]: any;
}
