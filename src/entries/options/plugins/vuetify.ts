import { createVuetify } from "vuetify";
import { en, zhHans } from "vuetify/locale";

import { type TLangCode } from "./i18n.ts";

export const vuetifyLangMap: Record<TLangCode, string> = {
  en: "en",
  zh_CN: "zhHans",
};

export const vuetifyInstance = createVuetify({
  locale: {
    locale: "zhHans",
    fallback: "en",
    messages: { zhHans, en },
  },
});
