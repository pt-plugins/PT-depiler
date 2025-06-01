import { createI18n } from "vue-i18n";

import en from "~/locales/en.json";
import zh_CN from "~/locales/zh_CN.json";

export type TLangCode = "en" | "zh_CN";

interface ILangMetaData {
  title: string;
  value: TLangCode;
  authors: readonly string[];
}

/**
 * 由于 Vue-i18n v11 在 CSP 环境中无法进行编译操作，所以所有语言文件需要在此处预注册，
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
    value: "zh_CN",
    authors: ["栽培者", "Rhilip"],
  },
] as const;

export const i18nInstance = createI18n({
  locale: "zh_CN",
  fallbackLocale: "en",
  messages: {
    en,
    zh_CN,
  },
});

export const i18n = i18nInstance.global;
