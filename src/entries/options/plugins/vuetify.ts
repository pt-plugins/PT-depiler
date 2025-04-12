import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";
import { en, zhHans } from "vuetify/locale";

import { type TLangCode } from "@/options/plugins/i18n.ts";

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
