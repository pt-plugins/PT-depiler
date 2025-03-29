/**
 * 所有和 ui 相关的选项均在本 store 管理
 */
import { defineStore } from "pinia";
import { usePreferredDark } from "@vueuse/core";
import type { IUiPiniaStorageSchema, supportThemeType } from "@/storage.ts";

export const useUIStore = defineStore("ui", {
  persistWebExt: true,
  state: (): IUiPiniaStorageSchema => ({
    lang: "zh_CN",
    theme: "light",
    isNavBarOpen: true,
    ignoreWrongPixelRatio: false,
    tableBehavior: {
      MyData: {
        itemsPerPage: 20,
        columns: [
          "site",
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
      SetSite: {
        itemsPerPage: -1,
        columns: ["name", "url", "time", "isOffline", "allowSearch", "allowQueryUserInfo"],
        sortBy: [
          { key: "sortIndex", order: "desc" },
          { key: "isOffline", order: "asc" },
          { key: "allowSearch", order: "desc" },
          { key: "allowQueryUserInfo", order: "desc" },
        ],
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
  },
  actions: {
    updateTableBehavior(table: string, key: string, data: any) {
      // @ts-ignore
      this.tableBehavior[table][key] = data;
      this.$save();
    },
  },
});
