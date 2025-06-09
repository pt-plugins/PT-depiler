/**
 * 所有和 ui 相关的选项均在本 store 管理
 */
import { defineStore } from "pinia";
import { usePreferredDark } from "@vueuse/core";

import type { IConfigPiniaStorageSchema, supportThemeType } from "@/shared/types.ts";

import { useMetadataStore } from "./metadata.ts";

export const useConfigStore = defineStore("config", {
  persistWebExt: true,
  state: (): IConfigPiniaStorageSchema => ({
    lang: "zh_CN",
    theme: "light",
    isNavBarOpen: true,
    ignoreWrongPixelRatio: false,
    saveTableBehavior: true,

    contextMenus: {
      allowSelectionTextSearch: true,
    },

    contentScript: {
      enabled: true,
      position: { x: 0, y: 0 },
      defaultOpenSpeedDial: false,
      stackedButtons: false,
      applyTheme: false,
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
      joinTimeWeekOnly: false,
      updateAtFormatAsAlive: false,
    },

    userDataTimelineControl: {
      title: "",
      showField: {
        uploads: true,
        uploaded: true,
        downloaded: true,
        seeding: true,
        seedingSize: true,
        bonusPerHour: true,
        ratio: true,
      },
      showPerSiteField: {
        siteName: true,
        name: true,
        level: true,
        uid: true,
      },
      showTop: true,
      showTimeline: true,
      dateFormat: "time_added",
      faviconBlue: 0,
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
    },

    searchEntifyControl: {
      showSiteName: true,
      showTorrentTag: true,
      showTorrentSubtitle: true,
      showSocialInformation: true,
      socialInformationSearchOnNewTab: true,
      uploadAtFormatAsAlive: false,
    },

    userInfo: {
      queueConcurrency: 1,
      autoReflush: {
        enabled: true,
        interval: 3, // hours
        retry: {
          max: 3,
          interval: 5, // minutes
        },
      },
      showDeadSiteInOverview: false,
    },

    download: {
      saveDownloadHistory: true,
      saveLastDownloader: false,
      allowDirectSendToClient: false,
      localDownloadMethod: "browser",
    },

    searchEntity: {
      saveLastFilter: false,
      queueConcurrency: 1,
    },

    mediaServerEntity: {
      queueConcurrency: 1,
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
