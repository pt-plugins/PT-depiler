import { defineExtensionStorage } from "@webext-core/storage";
import type { ISitePiniaStorageSchema } from "@/shared/storages/site.ts";
import type { IUiPiniaStorageSchema } from "@/shared/storages/ui.ts";
import type { IUserInfoStorageSchema } from "@/shared/storages/userinfo.ts";
import type {
  ISearchResultSnapshotDataStorageSchema,
  ISearchResultSnapshotPiniaStorageSchema,
} from "@/shared/storages/searchResultSnapshot.ts";

// 代理转发所有导出
export * from "@/shared/storages/site.ts";
export * from "@/shared/storages/ui.ts";
export * from "@/shared/storages/userinfo.ts";
export * from "@/shared/storages/searchResultSnapshot.ts";

export interface ExtensionStorageSchema {
  // 既可以被 pinia 使用，也可以被其他地方使用
  site: ISitePiniaStorageSchema;
  ui: IUiPiniaStorageSchema;
  searchResultSnapshotMetaData: ISearchResultSnapshotPiniaStorageSchema;

  userInfo: IUserInfoStorageSchema;
  searchResultSnapshot: ISearchResultSnapshotDataStorageSchema;
}

export type ExtensionStorageKey = keyof ExtensionStorageSchema;

export const extStorage = defineExtensionStorage<ExtensionStorageSchema>(chrome.storage.local);
