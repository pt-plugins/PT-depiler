import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n';
import browser from 'webextension-polyfill';
import type { App } from 'vue';

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages (): LocaleMessages<VueMessageType> {
  const locales = require.context('@/shared/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: LocaleMessages<VueMessageType> = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });
  return messages;
}

const vI18n = createI18n({
  legacy: false,
  locale: navigator.language,
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
  globalInjection: true
});

export function setI18nLanguage (locale: string) {
  vI18n.global.locale.value = locale;

  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')?.setAttribute('lang', locale);
}

/**
 * 使用 browser.i18n.getMessage 来获取 i18n 文本
 */
const bI18n = {
  install: (app: App, options: Record<any, any>) => {
    app.config.globalProperties.$translate = browser.i18n.getMessage;
  }
};

/**
 * 为直接在vue模板中使用 $translate 提供类型说明
 * 注意，这个说明不能写在 .d.ts 中，否则会导致 import {} from 'vue' 出错
 */
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $translate(messageName: string, substitutions?: any): string
  }
}

export { vI18n, bI18n };
