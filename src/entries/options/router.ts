import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Overview",
    meta: { isMainMenu: true },
    children: [
      {
        path: "/my-data",
        name: "MyData",
        alias: "",
        meta: { icon: "mdi-view-dashboard" },
        component: () => import("./views/Overview/MyData.vue"),
      },
      {
        path: "/search-entity",
        name: "SearchEntity",
        meta: { icon: "mdi-magnify", keepAlive: true },
        component: () => import("./views/Overview/SearchEntity/Index.vue"),
      },
      /**
       *
       *       {
       *         path: '/my-client',
       *         name: 'MyClient',
       *         meta: { icon: 'mdi-download-network' },
       *         component: () => dynamicImportView('Overview/MyClient')
       *       },
       *       {
       *         path: "/my-collection",
       *         name: "MyCollection",
       *         meta: { icon: "mdi-heart" },
       *         component: () => import("./views/Overview/MyCollection.vue")
       *       },
       *       {
       *         path: "/search-result-snapshot",
       *         name: "SearchResultSnapshot",
       *         meta: { icon: "mdi-camera-plus" },
       *         component: () => import("./views/Overview/SearchResultSnapshot.vue")
       *       },
       *       {
       *         path: "/download-history",
       *         name: "DownloadHistory",
       *         meta: { icon: "mdi-history" },
       *         component: () => import("./views/Overview/DownloadHistory.vue")
       *       },
       *       {
       *         path: "/keep-upload-task",
       *         name: "KeepUploadTask",
       *         meta: { icon: "mdi-call-merge" },
       *         component: () => import("./views/Overview/KeepUploadTask.vue")
       *       }
       */
    ],
  },

  {
    path: "/settings",
    name: "Settings",
    meta: { isMainMenu: true },
    children: [
      {
        path: "/set-base",
        name: "setBase",
        meta: { icon: "mdi-cog" },
        component: () => import("./views/Settings/setBase.vue"),
      },
      {
        path: "/set-site",
        name: "setSite",
        meta: { icon: "mdi-earth" },
        component: () => import("./views/Settings/setSite/Index.vue"),
      },
      {
        path: "/set-search-solution",
        name: "setSearchSolution",
        meta: { icon: "mdi-widgets" },
        component: () => import("./views/Settings/setSearchSolution/Index.vue"),
      },
      {
        path: "/set-downloader",
        name: "setDownloader",
        meta: { icon: "mdi-cloud-download" },
        component: () => import("./views/Settings/setDownloader/Index.vue"),
      },
      {
        path: "/set-download-paths",
        name: "setDownloadPaths",
        meta: { icon: "mdi-folder-open" },
        component: () => import("./views/Settings/setDownloadPaths.vue"),
      },
      {
        path: "/set-backup",
        name: "setBackup",
        meta: { icon: "mdi-backup-restore" },
        component: () => import("./views/Settings/setBackup.vue"),
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    meta: { isMainMenu: true, keepAlive: true },
    children: [
      {
        path: "/technology-stack",
        name: "TechnologyStack",
        meta: { icon: "mdi-developer-board" },
        component: () => import("./views/About/TechnologyStack.vue"),
      },
      {
        path: "/special-thank",
        name: "SpecialThank",
        meta: { icon: "mdi-account-multiple" },
        component: () => import("./views/About/SpecialThank.vue"),
      },
      {
        path: "/donate",
        name: "Donate",
        meta: { icon: "mdi-coffee" },
        component: () => import("./views/About/Donate.vue"),
      },
    ],
  },
  {
    path: "/devtools",
    name: "Devtools",
    meta: { isMainMenu: true },
    children: [
      {
        path: "/system-log",
        name: "SystemLog",
        meta: { icon: "mdi-clipboard-text" },
        component: () => import("./views/Devtools/SystemLog.vue"),
      },
    ],
  },

  { path: "/:pathMatch(.*)*", name: "NotFound", redirect: "/" },
];

if (localStorage.getItem("enable_debugger") !== null) {
  const devRouteIndex = routes.findIndex((x) => x.name == "Devtools");
  routes[devRouteIndex].children?.push({
    path: "/debugger",
    name: "Debugger",
    meta: { icon: "mdi-bug" },
    component: () => import("./views/Devtools/Debugger.vue"),
  });
}

export const routerInstance = createRouter({
  history: createWebHashHistory(),
  routes,
});
