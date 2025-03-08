import { defineExtensionStorage } from "@webext-core/storage";
import { ISiteUserConfig, TSiteID } from "@ptd/site";

export interface ExtensionStorageSchema {
  siteUserConfig: Record<TSiteID, ISiteUserConfig>;
}

export type ExtensionStorageKey = keyof ExtensionStorageSchema;

export const extStorage = defineExtensionStorage<ExtensionStorageSchema>(chrome.storage.local);
