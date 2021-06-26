import { createApp } from 'vue';
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n';
import router from './router';
import store from './store';
import App from './App.vue';

createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(vuetify)
  .mount('#app');
