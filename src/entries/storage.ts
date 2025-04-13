import { defineExtensionStorage } from "@webext-core/storage";
import type {
  IMetadataPiniaStorageSchema,
  IStoredUserInfo,
  TSearchSnapshotKey,
} from "@/shared/storages/types/metadata.ts";
import type { IUiPiniaStorageSchema } from "@/shared/storages/types/ui.ts";
import type { ISearchData } from "@/shared/storages/types/runtime.ts";
import type { TSiteID } from "@ptd/site";

// 代理转发所有导出
export * from "@/shared/storages/types/ui.ts";
export * from "@/shared/storages/types/runtime.ts";
export * from "@/shared/storages/types/metadata.ts";

export interface IExtensionStorageSchema {
  // 既可以被 pinia 使用，也可以被其他地方使用
  ui: IUiPiniaStorageSchema;
  metadata: IMetadataPiniaStorageSchema;

  userInfo: Record<TSiteID, Record<string, IStoredUserInfo>>; // 用于存储用户信息
  searchResultSnapshot: Record<TSearchSnapshotKey, ISearchData>; // 用于存储搜索结果快照
}

export type TExtensionStorageKey = keyof IExtensionStorageSchema;

export const extStorage = defineExtensionStorage<IExtensionStorageSchema>(chrome.storage.local);
