import { watch } from "vue";
import { createI18n, LocaleMessages } from "vue-i18n";
import { lang } from "@/shared/store/ui";

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages(): LocaleMessages<any> {
  const locales = import.meta.webpackContext!("../locales", {
    regExp: /[A-Za-z0-9-_,\s]+\.json$/i,
    mode: "sync"
  });

  const messages: LocaleMessages<any> = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });
  return messages;
}

export const i18nInstance = createI18n({
  legacy: false,
  locale: lang.value,
  fallbackLocale: "en",
  messages: loadLocaleMessages(),
  globalInjection: true,
});

watch(lang, (newLang) => {
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector("html")?.setAttribute("lang", newLang);

  i18nInstance.global.locale.value = newLang;
});
