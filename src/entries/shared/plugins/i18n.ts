import { watch } from "vue";
import { createI18n } from "vue-i18n";
import { lang } from "@/shared/store/ui.ts";
import en from "~/locales/en.json";
import zhHans from "~/locales/zhHans.json";

export const i18nInstance = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    zhHans,
  },
});

export const i18n = i18nInstance.global;

watch(lang, (newLang) => {
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector("html")?.setAttribute("lang", newLang);

  // @ts-ignore
  i18n.locale.value = newLang;
});
