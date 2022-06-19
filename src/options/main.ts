import { createApp } from "vue";
import { routerInstance as router } from "./router";
import { i18nInstance as i18n } from "@/shared/plugins/i18n";
import {piniaInstance as pinia} from "@/shared/plugins/pinia";
import { vuetifyInstance as vuetify } from "@/shared/plugins/vuetify";

import App from "./App.vue";

import "@/shared/debug";

createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .use(vuetify)
  .mount("#app");
