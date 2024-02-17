import "@mdi/font/css/materialdesignicons.css";

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
// import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// import {i18nInstance as i18n} from "@/shared/plugins/i18n.ts";
// import { useI18n } from 'vue-i18n'

export const vuetifyInstance = createVuetify({
  components,
  directives,
  // locale: {
  //   adapter: createVueI18nAdapter({ i18n, useI18n }),
  // },
})
