import { createApp } from "vue";
import App from "./App.vue";

// Vue Plugins
import { vuetifyInstance as vuetify } from "./plugins/vuetify";
import { piniaInstance as pinia } from "./plugins/pinia";
import { routerInstance as router } from "./plugins/router";
import { i18nInstance as i18n } from "./plugins/i18n";

// vue-konva 不在此处全局注册：那会把整个 konva（约 187KB）打进 options 入口 chunk。
// 目前只有 UserDataTimeline 用到，改为在该组件内按需注册，让 konva 随它的路由 chunk 懒加载。
createApp(App).use(pinia).use(i18n).use(router).use(vuetify).mount("#app");
