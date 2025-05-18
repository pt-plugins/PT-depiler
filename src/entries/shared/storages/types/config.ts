import type { IFetchSocialSiteInformationConfig } from "@ptd/social";
import type { TLangCode } from "@/options/plugins/i18n.ts";
import type { ITimelineUserInfoField } from "@/options/views/Overview/MyData/UserDataTimeline/utils.ts";

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

  // 用于存储 v-data-table 表格的展示
  tableBehavior: Record<UiTableBehaviorKey, UiTableBehaviorItem>;

  // 用 timeline 和 statistic 等展示的用户名，如果为 "" 则由使用最多的站点决定（使用 configStore.getUserNames.perfName 获取）
  userName: string;

  // 对 MyData 页面 v-data-table 展示的额外控制项
  myDataTableControl: {
    // 是否展示站点名称
    showSiteName: boolean;
    // 是否展示未读信息情况
    showUnreadMessage: boolean;
    // 是否展示用户名，如果不展示，则显示为 ******
    showUserName: boolean;
    // 是否使用站点定义中的 levelRequirements 中的名称来统一显示等级名称，如果不使用，则直接显示为 getUserInfo 获取到的信息
    normalizeLevelName: boolean;
    // 是否展示升级情况及站点等级情况
    showLevelRequirement: boolean;
    // TODO 是否展示HnR
    showHnR: boolean;
    // 是否展示保种积分
    showSeedingBonus: boolean;
    // 加入时间显示为周数，默认不使用
    joinTimeWeekOnly: boolean;
    // 是否使用 time_alive(过去时间) 来展示，如果不使用，则使用 time_added(发生时间) 来展示，默认不使用
    updateAtFormatAsAlive: boolean;
  };

  userDataTimelineControl: {
    title: string; // 时间线标题
    showTop: boolean;
    showTimeline: boolean;
    showField: Record<ITimelineUserInfoField["name"] | "ratio", boolean>; // 需要展示的数据，注意 ratio, siteCount, totalYear 不作为设置项
    showPerSiteField: Record<"siteName" | "name" | "level" | "uid", boolean>; // 需要展示的站点数据
    dateFormat: "time_added" /*     yyyy-MM-dd */ | "time_alive" /* 过去时间 xxx ago */;
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

  /**
   * 注意：
   * showTorrentTag, showTorrentSubtitle, showSocialInformation, socialInformationSearchTargetBlank
   * 这四个选项同时影响下载历史中的展示
   */
  searchEntifyControl: {
    // 是否展示站点名称
    showSiteName: boolean;
    // 是否展示种子的Tags信息
    showTorrentTag: boolean;
    // 是否展示种子的副标题信息
    showTorrentSubtitle: boolean;
    // 是否展示种子额外的媒体评分信息（需要该种子提供 ext_{imdb, douban} 信息）
    showSocialInformation: boolean;
    // 对种子额外的媒体评分信息中 “搜索” 是另开窗口还是当前窗口 （需要 showSocialInformation 为 true 才有实际效果）
    socialInformationSearchOnNewTab: boolean;
    // 是否使用 time_alive(过去时间) 来展示，如果不使用，则使用 time_added(发生时间) 来展示，默认不使用
    uploadAtFormatAsAlive: boolean;
  };

  userInfo: {
    // 更新用户信息时的最大并发数
    queueConcurrency: number;
    autoReflush: {
      // 是否开启自动刷新
      enabled: boolean;
      // 自动刷新间隔（ 1-12 小时 ）
      interval: number;
      retry: {
        // 最大重试次数
        max: number;
        // 每次重试的间隔（ 1-5 分钟 ）
        interval: number;
      };
    };
  };

  download: {
    // 是否保存下载记录
    saveDownloadHistory: boolean;
    // 是否保存上一次使用的下载器
    saveLastDownloader: boolean;
    // 是否允许直接将链接（而不是种子文件）发送到客户端
    allowDirectSendToClient: boolean;
    // 当使用本地方法下载时，如何下载种子
    localDownloadMethod: TLocalDownloadMethod;
  };

  searchEntity: {
    // 是否保存上一次使用的筛选词
    saveLastFilter: boolean;
    // 搜索时的最大并发数
    queueConcurrency: number;
  };

  // 配置同样在 searchEntity 页面（偷懒下）
  mediaServerEntity: {
    // 搜索时的最大并发数
    queueConcurrency: number;
    // 单次搜索的最大数量
    searchLimit: number;
    // 是否在 onMount 时自动搜索
    autoSearchWhenMount: boolean;
    // 是否在搜索结果中自动加载更多
    autoSearchMoreWhenScroll: boolean;
  };

  backup: {
    // 用于备份文件加密、解密的密钥
    encryptionKey: string;

    // TODO 是否开启自动备份
    enabledAutoBackup: boolean;
  };

  socialSiteInformation: IFetchSocialSiteInformationConfig;
}
