import { defineExtensionStorage } from "@webext-core/storage";
import type { IAdvancedSearchRequestConfig, ISiteUserConfig, TSiteID } from "@ptd/site";
import type { TLangCode } from "@/options/plugins/i18n.ts";

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

export const supportTheme = ["auto", "light", "dark"] as const;
export type supportThemeType = (typeof supportTheme)[number];
type UiTableBehaviorKey = "setSite" | "searchEntity";
interface UiTableBehaviorItem<T = string> {
  itemsPerPage?: number;
  columns?: T[];
  sortBy?: { key: T; order: "asc" | "desc" }[];
}

export interface UiSchema {
  lang: TLangCode;
  theme: supportThemeType;
  isNavBarOpen: boolean;
  ignoreWrongPixelRatio: boolean;
  tableBehavior: Record<UiTableBehaviorKey, UiTableBehaviorItem>;
}

export interface ExtensionStorageSchema {
  site: SiteSchema;
  ui: UiSchema;
}

export type ExtensionStorageKey = keyof ExtensionStorageSchema;

export const extStorage = defineExtensionStorage<ExtensionStorageSchema>(chrome.storage.local);
