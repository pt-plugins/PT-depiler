import { createApp } from "vue";
import App from "./App.vue";

// Vue Plugins
import { vuetifyInstance as vuetify } from "./plugins/vuetify";
import { piniaInstance as pinia } from "./plugins/pinia";
import { routerInstance as router } from "./plugins/router";
import { i18nInstance as i18n } from "./plugins/i18n";
import VueKonva from "vue-konva";

createApp(App).use(pinia).use(i18n).use(router).use(vuetify).use(VueKonva, { prefix: "Vk" }).mount("#app");
