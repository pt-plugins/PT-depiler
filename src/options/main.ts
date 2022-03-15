import { createApp } from "vue";
import i18n from "@/shared/plugins/i18n";
import router from "./router";
import naive from "naive-ui";
import { createPinia } from "pinia";
import App from "./App.vue";

import "@/shared/debug";

createApp(App).use(i18n).use(router).use(naive).use(createPinia()).mount("#app");
