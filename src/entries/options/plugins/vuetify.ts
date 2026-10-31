import { createRulesPlugin, createVuetify } from "vuetify";
import { en, zhHans } from "vuetify/locale";

import { type TLangCode } from "./i18n.ts";

export const vuetifyLangMap: Record<TLangCode, string> = {
  en: "en",
  zh_CN: "zhHans",
};

export const vuetifyInstance = createVuetify({
  // 保持与 v3 一致：默认浅色主题（不随操作系统跟随 system 主题）
  theme: {
    defaultTheme: "light",
  },
  locale: {
    locale: "zhHans",
    fallback: "en",
    messages: { zhHans, en },
  },
});

/** 站点 / 下载器 / 媒体服务器地址的校验正则；同时也作为 pattern 别名的参数直接在模板里用。 */
export const urlPattern = /^(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;[\]]+[-A-Za-z0-9+&@#/%=~_|]$/;

/**
 * Vuetify 4 的 rules 别名体系：`<v-text-field :rules="['required']">` 里的字符串要能被解析，
 * 必须在 app 上 provide RulesSymbol —— createVuetify 只 provide Defaults/Display/Theme/Icon/
 * Locale/Date/GoTo，并不含它（见 vuetify/lib/framework.js 的 install）。
 *
 * 漏装的结果不是报错：validate() 会把字符串本身当作校验结果塞进 errorMessages，
 * 表现为「永远校验失败，且提示文字就是 required 这串字」。
 *
 * 别名是柯里化的 `(err) => (v) => true | 错误文案`，与内置 required/pattern 同形；
 * 调用点写 `['url']`，要覆盖文案就写 `['url', t('...')]`。
 *
 * 注意 `url` 别名不做空值放行（空串也算不合法），这与其调用点上的 required 语义一致；
 * 需要「只在非空时校验」的场景用内置的 `['pattern', urlPattern]`。
 */
export const vuetifyRulesPlugin = createRulesPlugin(
  {
    aliases: {
      url: (err?: string) => (v: any) => urlPattern.test(v) || err || "Not url",
    },
  },
  vuetifyInstance.locale,
);
