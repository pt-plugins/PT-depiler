import type { TLangCode } from "@/options/plugins/i18n.ts";

export const supportTheme = ["auto", "light", "dark"] as const;
export type supportThemeType = (typeof supportTheme)[number];
type UiTableBehaviorKey = "SetSite" | "SearchEntity" | "MyData" | string;
interface UiTableBehaviorItem<T = string> {
  itemsPerPage?: number;
  columns?: T[];
  sortBy?: { key: T; order: "asc" | "desc" }[];
}

export interface IConfigPiniaStorageSchema {
  lang: TLangCode;
  theme: supportThemeType;
  isNavBarOpen: boolean;
  ignoreWrongPixelRatio: boolean;

  tableBehavior: Record<UiTableBehaviorKey, UiTableBehaviorItem>;

  userInfo: {
    queueConcurrency: number;
  };

  searchEntity: {
    queueConcurrency: number;
  };
}
