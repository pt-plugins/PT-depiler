/**
 * 所有和 ui 相关的选项均在本 store 管理
 * 其中： lang     由 useBrowserStore 直接管理，避免 i18n 创建无 app 问题
 *       其余选项  由 pinia           管理，使用前因确保 app.use(pinia)
 *
 */
import { defineStore } from "pinia";
import { usePreferredDark } from "@vueuse/core";
import { useBrowserStore } from "@/shared/browser/storage.ts";

interface ILangMetaData {
  title: string;
  value: string;
  authors: readonly string[];
}

/**
 * 由于 Vue-i18n v9 在 CSP 环境中无法进行编译操作，所以所有语言文件需要在此处预注册，
 * 不然不会在插件页面显示，也不能实现像 v1.x 中的”临时添加新语言功能“
 */
export const definedLangMetaData: readonly ILangMetaData[] = [
  {
    title: "English (Beta)",
    value: "en",
    authors: ["ronggang", "Rhilip", "ylxb2016", "xiongqiwei", "jackson008"],
  },
  {
    title: "简体中文 Chinese (Simplified)",
    value: "zhHans",
    authors: ["栽培者", "Rhilip"],
  },
] as const;

export const lang = useBrowserStore<(typeof definedLangMetaData)[number]["value"]>(
  "ui_language",
  "en",
);

export const supportTheme = ["auto", "light", "dark"] as const;
type supportThemeType = (typeof supportTheme)[number];

const preferDark = usePreferredDark();

export const useUIStore = defineStore("ui", {
  persist: true,
  state: () => ({
    theme: "light" as supportThemeType,
    isNavBarOpen: true,
    ignoreWrongPixelRatio: false,
    tableBehavior: {
      setSite: {
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
        return preferDark.value ? "dark" : "light";
      }
      return this.theme;
    },

    isLightUiTheme(): boolean {
      return this.uiTheme === "light";
    },
  },
  actions: {},
});
