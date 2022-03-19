import { createApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";
import i18n from "@/shared/plugins/i18n";
import vuetify from "@/shared/plugins/vuetify";

import App from "./App.vue";

import "@/shared/debug";

createApp(App)
  .use(i18n)
  .use(router)
  .use(vuetify)
  .use(createPinia())
  .mount("#app");
