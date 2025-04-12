import type { TLangCode } from "@/options/plugins/i18n.ts";

export const supportTheme = ["auto", "light", "dark"] as const;
export type supportThemeType = (typeof supportTheme)[number];
type UiTableBehaviorKey = "SetSite" | "SearchEntity" | "MyData" | string;
interface UiTableBehaviorItem<T = string> {
  itemsPerPage?: number;
  columns?: T[];
  sortBy?: { key: T; order: "asc" | "desc" }[];
}

export interface IUiPiniaStorageSchema {
  lang: TLangCode;
  theme: supportThemeType;
  isNavBarOpen: boolean;
  ignoreWrongPixelRatio: boolean;

  lastDownloader: {
    id?: string;
    savePath?: string;
    label?: string;
  };

  tableBehavior: Record<UiTableBehaviorKey, UiTableBehaviorItem>;
}
