import { createVuetify } from "vuetify";
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
