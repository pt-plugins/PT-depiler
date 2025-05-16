export interface IBackupConfig {
  id?: string;
  type: string;
  address: string;
  name: string;

  config: Record<string, string | boolean | number>;
}

export interface IBackupMetadata<T extends IBackupConfig> {
  requiredField: {
    name?: `i18n.${string}` | string; // 显示名称，可以是一个 vue-i18n 键值，如果缺失，则直接显示为 key 的值
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

export interface IBackupData {
  manifest: {};
  [key: string]: any;
}
