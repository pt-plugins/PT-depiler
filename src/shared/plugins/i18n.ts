import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n';
import { ILangMetaData } from '@/shared/interfaces/common';

/**
 * 由于 Vue-i18n v9 在 CSP 环境中无法进行编译操作，所以所有语言文件需要在此处预注册，
 * 不然不会在插件页面显示，也不能实现像 v1.x 中的”临时添加新语言功能“
 */
export const localeDefine : ILangMetaData[] = [
  {
    name: 'English (Beta)',
    code: 'en',
    authors: [
      'ronggang', 'ylxb2016', 'xiongqiwei', 'jackson008'
    ]
  },
  {
    name: '简体中文 Chinese (Simplified)',
    code: 'zh-CN',
    authors: [
      '栽培者'
    ]
  }
];

/**
 * 获取当前应该使用的语言
 */
function getDefaultLocale () {
  return localStorage.getItem('locale') ?? navigator.language;
}

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

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
  globalInjection: true
});

export function setI18nLanguage (locale: string) {
  i18n.global.locale.value = locale;

  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')?.setAttribute('lang', locale);
  localStorage.setItem('locale', locale);
}

export default i18n;
