import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

export const setBaseChildren: RouteRecordRaw[] = [
  {
    path: "",
    alias: "ui",
    name: "SetBaseUi",
    meta: { icon: "mdi-palette" },
    component: () => import("../views/Settings/SetBase/UiWindow.vue"),
  },
  {
    path: "search-entity",
    name: "SetBaseSearchEntity",
    meta: { icon: "mdi-magnify" },
    component: () => import("../views/Settings/SetBase/SearchEntityWindow.vue"),
  },
  {
    path: "user-info",
    name: "SetBaseUserInfo",
    meta: { icon: "mdi-account" },
    component: () => import("../views/Settings/SetBase/UserInfoWindow.vue"),
  },
  {
    path: "reset",
    name: "SetBaseReset",
    meta: { icon: "mdi-refresh" },
    component: () => import("../views/Settings/SetBase/ResetWindow.vue"),
  },
] as const;

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
        component: () => import("../views/Overview/MyData/Index.vue"),
      },
      {
        path: "/search-entity",
        name: "SearchEntity",
        meta: { icon: "mdi-magnify" },
        component: () => import("../views/Overview/SearchEntity/Index.vue"),
      },
      {
        path: "/search-result-snapshot",
        name: "SearchResultSnapshot",
        meta: { icon: "mdi-camera-plus" },
        component: () => import("../views/Overview/SearchResultSnapshot/Index.vue"),
      },
      {
        path: "/download-history",
        name: "DownloadHistory",
        meta: { icon: "mdi-history" },
        component: () => import("../views/Overview/DownloadHistory/Index.vue"),
      },
    ],
  },
  {
    path: "/settings",
    name: "Settings",
    meta: { isMainMenu: true },
    children: [
      {
        path: "/set-base",
        name: "SetBase",
        meta: { icon: "mdi-cog" },
        component: () => import("../views/Settings/SetBase/Index.vue"),
        children: setBaseChildren,
      },
      {
        path: "/set-site",
        name: "SetSite",
        meta: { icon: "mdi-earth" },
        component: () => import("../views/Settings/SetSite/Index.vue"),
      },
      {
        path: "/set-downloader",
        name: "SetDownloader",
        meta: { icon: "mdi-cloud-download" },
        component: () => import("../views/Settings/SetDownloader/Index.vue"),
      },
      {
        path: "/set-search-solution",
        name: "SetSearchSolution",
        meta: { icon: "mdi-widgets" },
        component: () => import("../views/Settings/SetSearchSolution/Index.vue"),
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
        component: () => import("../views/About/TechnologyStack.vue"),
      },
      {
        path: "/special-thank",
        name: "SpecialThank",
        meta: { icon: "mdi-account-multiple" },
        component: () => import("../views/About/SpecialThank.vue"),
      },
    ],
  },

  { path: "/:pathMatch(.*)*", name: "NotFound", redirect: "/" },
];

if (localStorage.getItem("enable_debugger") !== null) {
  const devRouteIndex = routes.findIndex((x) => x.name == "Devtools");
  /**
   * routes[devRouteIndex].children?.push({
   *     path: "/debugger",
   *     name: "Debugger",
   *     meta: { icon: "mdi-bug" },
   *     component: () => import("./views/Devtools/Debugger.vue"),
   *   });
   */
}

export const routerInstance = createRouter({
  history: createWebHashHistory(),
  routes,
});
