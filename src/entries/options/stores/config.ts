/**
 * 所有和 ui 相关的选项均在本 store 管理
 */
import { defineStore } from "pinia";
import { has, unset } from "es-toolkit/compat";
import { usePreferredDark } from "@vueuse/core";

import type { IConfigPiniaStorageSchema, supportThemeType } from "@/shared/types.ts";

import { useMetadataStore } from "./metadata.ts";

const deprecatedConfigKeys = [
  "myDataTableControl.tableFontSize", // v0.0.4.961 废弃
  "myDataTableControl.joinTimeWeekOnly", // 已废弃，使用 joinTimeFormat 替代
];

export const defaultTimelineBackgroundColor = "#455A64";

export const useConfigStore = defineStore("config", {
  persistWebExt: {
    afterRestore: (context) => {
      // 清理已废弃的配置项
      const state = context.store.$state as any;
      let needsSave = false;

      // 清理已废弃的配置项
      for (const key of deprecatedConfigKeys) {
        if (has(state, key)) {
          unset(state, key);
          needsSave = true;
        }
      }

      // 清理基于 id 字段的 DownloadHistory 排序配置
      if (state.tableBehavior?.DownloadHistory?.sortBy) {
        const sortBy = state.tableBehavior.DownloadHistory.sortBy;
        // 过滤掉基于 id 字段的排序项
        const filteredSortBy = sortBy.filter((sort: any) => sort.key !== "id");

        // 如果过滤后数组长度发生变化，说明移除了基于 id 的排序项
        if (filteredSortBy.length !== sortBy.length) {
          // 如果过滤后没有任何排序项，使用默认的 downloadAt 排序
          if (filteredSortBy.length === 0) {
            state.tableBehavior.DownloadHistory.sortBy = [{ key: "downloadAt", order: "desc" }];
          } else {
            // 否则保留其他有效的排序项
            state.tableBehavior.DownloadHistory.sortBy = filteredSortBy;
          }
          needsSave = true;
        }
      }

      if (needsSave) {
        context.store.$save();
      }
    },
  },
  state: (): IConfigPiniaStorageSchema => ({
    version: "",
    lang: "zh_CN",
    theme: "light",
    isNavBarOpen: true,

    ignoreWrongPixelRatio: false,
    showReleaseNoteOnVersionChange: true,

    saveTableBehavior: true,
    enableTableMultiSort: false,

    contextMenus: {
      enabled: true,
      allowSelectionTextSearch: true,
      allowLinkDownloadPush: true,
    },

    contentScript: {
      enabled: true,
      enabledAtSocialSite: true,
      allowExceptionSites: false,

      position: { x: 0, y: 0 },

      applyTheme: false,
      defaultOpenSpeedDial: false,
      stackedButtons: false,
      fadeEnterStyle: false,

      doubleConfirmAction: true,
      dragLinkOnSpeedDial: true,

      socialSiteSearchBy: "chosen",
    },

    tableBehavior: {
      MyData: {
        itemsPerPage: 20,
        columns: [
          "siteUserConfig.sortIndex",
          "name",
          "levelName",
          "uploaded",
          "ratio",
          "uploads",
          "seeding",
          "seedingSize",
          "bonus",
          "joinTime",
          "updateAt",
          "action",
        ],
        sortBy: [{ key: "siteUserConfig.sortIndex", order: "desc" }],
      },
      SearchEntity: {
        itemsPerPage: 50,
        columns: [
          "site",
          "title",
          "category",
          "size",
          "seeders",
          "leechers",
          "completed",
          "comments",
          "time",
          "action",
        ],
        sortBy: [{ key: "time", order: "desc" }],
      },
      DownloadHistory: {
        itemsPerPage: 10,
        sortBy: [{ key: "downloadAt", order: "desc" }],
      },
      SearchResultSnapshot: {
        itemsPerPage: 25,
        sortBy: [{ key: "createdAt", order: "desc" }],
      },
      SetDownloader: {
        itemsPerPage: 10,
        sortBy: [{ key: "enabled", order: "desc" }],
      },
      SetSearchSolution: {
        itemsPerPage: 10,
      },
      SetSite: {
        itemsPerPage: -1,
        sortBy: [{ key: "userConfig.sortIndex", order: "desc" }],
      },
    },

    userName: "",

    myDataTableControl: {
      showSiteName: true,
      showUnreadMessage: true,
      showUserName: true,
      normalizeLevelName: true,
      showLevelRequirement: true,
      onlyShowUserLevelRequirement: true,
      showNextLevelInTable: false,
      showNextLevelInDialog: true,
      showHnR: true,
      showSeedingBonus: true,
      //joinTimeWeekOnly: false,
      joinTimeFormat: "added",
      updateAtFormatAsAlive: false,
      showIntervalAsDate: false,
      simplifyBonusNumbers: false,
      showBonusNeededInterval: true,
    },

    userDataTimelineControl: {
      title: "",
      showField: {
        uploads: true,
        uploaded: true,
        downloaded: true,
        seeding: true,
        seedingSize: true,
        bonus: true,
        bonusPerHour: true,
        ratio: true,
      },
      showPerSiteField: {
        siteName: false,
        name: true,
        level: true,
        uid: true,
      },
      showTop: true,
      showTimeline: true,
      backgroundColor: defaultTimelineBackgroundColor,
      dateFormat: "time_added",
      faviconBlue: 3,
      selectedSites: [],
    },

    userStatisticControl: {
      showChart: {
        totalSiteBase: true,
        totalSiteSeeding: true,
        perSiteKuploaded: true,
        perSiteKuploadedIncr: true,
        perSiteKdownloaded: true,
        perSiteKdownloadedIncr: true,
        perSiteKseeding: true,
        perSiteKseedingIncr: true,
        perSiteKseedingSize: true,
        perSiteKseedingSizeIncr: true,
        perSiteKbonus: true,
        perSiteKbonusIncr: true,
      },
      dateRange: 30,
      hidePerSitePrecentThreshold: 1,
      selectedSites: [],
    },

    searchEntifyControl: {
      showSiteName: true,
      showTorrentTag: true,
      showTorrentSubtitle: true,
      showSocialInformation: true,
      socialInformationSearchOnNewTab: true,
      uploadAtFormatAsAlive: false,
      limitTorrentTitleTdWidth: false,
    },

    userInfo: {
      queueConcurrency: 5,
      autoReflush: {
        enabled: true,
        interval: 3, // hours
        afterTime: "00:00",
        retry: {
          max: 3,
          interval: 5, // minutes
        },
      },
      alwaysPickLastUserInfo: true,
      showDeadSiteInOverview: false,
      showPassedSiteInOverview: false,
    },

    download: {
      saveDownloadHistory: true,
      saveLastDownloader: false,
      allowDirectSendToClient: false,
      localDownloadMethod: "browser",
      ignoreSiteDownloadIntervalWhenLocalDownload: true,
      useQuickSendToClient: true,
    },

    searchEntity: {
      queueConcurrency: 8,

      allowSingleSiteSearch: false,
      treatTTQueryAsImdbSearch: true,

      saveLastFilter: true,
      forceImdbIdMatchFilter: true,
      autoDetectOfficialGroupFromTitle: false,

      quickSiteFilter: true,
    },

    mediaServerEntity: {
      queueConcurrency: 5,
      searchLimit: 50,
      autoSearchWhenMount: true,
      autoSearchMoreWhenScroll: true,
    },

    backup: {
      encryptionKey: "",
      enabledAutoBackup: false,
    },

    socialSiteInformation: {
      preferPtGen: true,
      timeout: 10e3,
      cacheDay: 7,
      socialSite: {
        anidb: {},
        bangumi: {},
        douban: {},
        imdb: {},
      },
    },

    autoExtendCookies: {
      enabled: false,
      triggerThreshold: 2,
      extensionDuration: 3,
    },
  }),
  getters: {
    uiTheme(): Exclude<supportThemeType, "auto"> {
      if (this.theme === "auto") {
        const preferDark = usePreferredDark();
        return preferDark.value ? "dark" : "light";
      }
      return this.theme;
    },

    isLightUiTheme(): boolean {
      return this.uiTheme === "light";
    },

    getUserName(): string {
      if (this.userName === "") {
        return this.getUserNames.perfName;
      } else {
        return this.userName;
      }
    },

    getUserNames(state) {
      const metadataStore = useMetadataStore();

      const userNames = {
        perfName: "",
        names: {} as Record<string, number>,
      };

      const allNames = Object.values(metadataStore.lastUserInfo)
        .map((userInfo) => userInfo.name)
        .filter(Boolean) as string[];

      for (const name of allNames) {
        if (!userNames.names[name]) {
          userNames.names[name] = 0;
        }
        userNames.names[name]++;

        if (name !== userNames.perfName && userNames.names[name] > (userNames.names[userNames.perfName] ?? 0)) {
          userNames.perfName = name;
        }
      }

      return userNames;
    },
  },
  actions: {
    updateTableBehavior(table: string, key: string, data: any) {
      // @ts-ignore
      this.tableBehavior[table][key] = data;
      if (this.saveTableBehavior) {
        this.$save();
      }
    },

    updateContentScriptPosition(x: number, y: number) {
      this.contentScript.position.x = x;
      this.contentScript.position.y = y;
      this.$save();
    },
  },
});
