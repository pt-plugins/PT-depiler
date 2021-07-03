import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './views/Home.vue';

function dynamicImportView (view: string) {
  return import(/* webpackChunkName: "views/[request]" */ `./views/${view}.vue`);
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => dynamicImportView('About')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
