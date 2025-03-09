import { defineExtensionStorage } from "@webext-core/storage";
import { type IAdvancedSearchRequestConfig, ISiteUserConfig, TSiteID } from "@ptd/site";

export type TSolutionID = string;
export interface ISearchSolution {
  siteId: TSiteID;
  searchEntries: Record<string, IAdvancedSearchRequestConfig>;
}

export interface ISearchSolutionState {
  name: string;
  solutions: ISearchSolution[];
}

export interface SiteSchema {
  sites: Record<TSiteID, ISiteUserConfig>;
  solutions: Record<TSolutionID, ISearchSolutionState>;
}

export interface ExtensionStorageSchema {
  site: SiteSchema;
}

export type ExtensionStorageKey = keyof ExtensionStorageSchema;

export const extStorage = defineExtensionStorage<ExtensionStorageSchema>(chrome.storage.local);
