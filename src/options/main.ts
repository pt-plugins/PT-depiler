import { createApp } from 'vue';
import i18n from '@/shared/plugins/i18n';
import router from './router';
import store from './store';
import App from './App.vue';
import naive from 'naive-ui';

import '@/shared/debug';

createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(naive)
  .mount('#app');
