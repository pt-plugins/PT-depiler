import {createApp} from 'vue'
import App from './App.vue'

import {piniaInstance as pinia} from "@/shared/plugins/pinia.ts";
import {i18nInstance as i18n} from "@/shared/plugins/i18n.ts";
import {vuetifyInstance as vuetify} from "@/shared/plugins/vuetify.ts";
import {routerInstance as router} from "./router.ts";

createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .use(vuetify)
  .mount('#app')
