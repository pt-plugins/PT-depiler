import { defineExtensionStorage } from "@webext-core/storage";
import { SitePiniaStorageSchema } from "@/shared/storages/site.ts";
import { UiPiniaStorageSchema } from "@/shared/storages/ui.ts";

export * from "@/shared/storages/site.ts";
export * from "@/shared/storages/ui.ts";

export interface ExtensionStorageSchema {
  site: SitePiniaStorageSchema;
  ui: UiPiniaStorageSchema;
}

export type ExtensionStorageKey = keyof ExtensionStorageSchema;

export const extStorage = defineExtensionStorage<ExtensionStorageSchema>(chrome.storage.local);
