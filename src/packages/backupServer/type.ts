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

/**
 * 备份保留策略（用于自动清理远端的历史备份文件）
 *
 * - `time`  : 按时间期限保留，超过 `maxAge` 天的备份会被清理
 * - `count` : 按数量保留，仅保留最近的 `maxCount` 份备份
 * - `sample`: 类似 Borg 的时间窗口采样（简化版），按 天 / 周 / 月 / 年 的时间窗口各保留若干份备份
 */
export enum EBackupRetentionType {
  time = "time",
  count = "count",
  sample = "sample",
}

/** 时间窗口采样规则，按 interval*horizon 从大到小排序，越靠前的规则优先级越高 */
export interface IBackupRetentionSampleRule {
  interval: number; // 采样窗口宽度，1 表示每个窗口保留一份备份
  horizon: number; // 保留的窗口数量（即保留 interval*horizon 时间范围内的备份）
}

export interface IBackupRetention {
  /** 按时间期限保留 */
  time?: {
    enabled?: boolean;
    maxAge?: number; // 保留天数，超过该期限的备份会被清理（需大于 0 才会生效）
  };
  count?: {
    enabled?: boolean;
    maxCount?: number; // 保留份数，按备份时间从新到旧保留（需大于 0 才会生效）
  };
  sample?: {
    enabled?: boolean;
    /**
     * 采样规则列表，可使用的 interval 单位为 天，即 1（天）/ 7（周）/ 30（月）/ 365（年）
     */
    rules?: Partial<Record<"day" | "week" | "month" | "year", IBackupRetentionSampleRule>>;
  };
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
