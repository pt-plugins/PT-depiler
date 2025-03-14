import { defineExtensionStorage } from "@webext-core/storage";
import { ISitePiniaStorageSchema } from "@/shared/storages/site.ts";
import { IUiPiniaStorageSchema } from "@/shared/storages/ui.ts";
import { IUserInfoStorageSchema } from "@/shared/storages/userinfo.ts";

// 代理转发所有导出
export * from "@/shared/storages/site.ts";
export * from "@/shared/storages/ui.ts";
export * from "@/shared/storages/userinfo.ts";

export interface ExtensionStorageSchema {
  site: ISitePiniaStorageSchema;
  ui: IUiPiniaStorageSchema;
  userInfo: IUserInfoStorageSchema;
}

export type ExtensionStorageKey = keyof ExtensionStorageSchema;

export const extStorage = defineExtensionStorage<ExtensionStorageSchema>(chrome.storage.local);
