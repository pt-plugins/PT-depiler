import type { TLangCode } from "@/options/plugins/i18n.ts";
import type { CAddTorrentOptions } from "@ptd/downloader";

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
    options: Omit<CAddTorrentOptions, "localDownloadOption">;
  };

  tableBehavior: Record<UiTableBehaviorKey, UiTableBehaviorItem>;
}
