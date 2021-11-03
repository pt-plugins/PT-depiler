import { createApp } from 'vue';
import { vI18n, bI18n } from '@/shared/plugins/i18n';
import router from './router';
import store from './store';
import App from './App.vue';
import naive from 'naive-ui';

import '@/shared/debug';

createApp(App)
  .use(store)
  .use(router)
  .use(vI18n)
  .use(bI18n)
  .use(naive)
  .mount('#app');
