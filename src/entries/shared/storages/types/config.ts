import type { TLangCode } from "@/options/plugins/i18n.ts";
import { ITimelineUserInfoField } from "@/options/views/Overview/MyData/UserDataTimeline/utils.ts";

export const supportTheme = ["auto", "light", "dark"] as const;
export type supportThemeType = (typeof supportTheme)[number];
type UiTableBehaviorKey = "SetSite" | "SearchEntity" | "MyData" | string;
interface UiTableBehaviorItem<T = string> {
  itemsPerPage?: number;
  columns?: T[];
  sortBy?: { key: T; order: "asc" | "desc" }[];
}

export const LocalDownloadMethod = [
  "web", // 和PTPP一样打开对应种子下载的链接页面，然后由浏览器自动拉起下载过程，只有 method='get' 的种子才能支持，其他情况会回落到 extension
  "browser", // （默认）由插件直接调用 chrome.downloads.download() 方法，支持 post, data, headers 参数（够用了），此时 filename 由浏览器自动猜测
  "extension", // （回落）插件调用 axios.requests() 方法，获取并解析种子，生成 Blob 后交由 chrome.downloads.download ，此时 filename 由插件直接控制，可能会出现错误，同时支持 axios 的高级参数
] as const;

export type TLocalDownloadMethod = (typeof LocalDownloadMethod)[number];

export interface IConfigPiniaStorageSchema {
  lang: TLangCode;
  theme: supportThemeType;
  isNavBarOpen: boolean;
  ignoreWrongPixelRatio: boolean;

  saveTableBehavior: boolean;
  tableBehavior: Record<UiTableBehaviorKey, UiTableBehaviorItem>;

  userName: string; // 用 timeline 和 statistic 展示的用户名，如果为 "" 则由使用最多的站点决定

  userDataTimelineControl: {
    title: string; // 时间线标题
    showTop: boolean;
    showTimeline: boolean;
    showField: Record<ITimelineUserInfoField["name"] | "ratio", boolean>; // 需要展示的数据，注意 ratio, siteCount, totalYear 不作为设置项
    showPerSiteField: Record<"siteName" | "name" | "level" | "uid", boolean>; // 需要展示的站点数据
    dateFormat: "time_added" /* 发生时间  yyyy-MM-dd */ | "time_alive" /* 过去时间 xxx ago */;
    faviconBlue: number;
  };

  userStatisticControl: {
    showChart: Record<
      | "totalSiteBase"
      | "totalSiteSeeding"
      | `perSiteK${"uploaded" | "downloaded" | "seeding" | "seedingSize" | "bonus"}`,
      boolean
    >;
    dateRange: number | "custom" | "all";
  };

  userInfo: {
    queueConcurrency: number;
  };

  download: {
    // 当使用本地方法下载时，如何下载种子
    saveLastDownloader: boolean;
    localDownloadMethod: TLocalDownloadMethod;
  };

  searchEntity: {
    saveLastFilter: boolean;
    queueConcurrency: number;
  };
}
