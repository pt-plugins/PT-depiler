import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

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
        meta: { icon: "mdi-magnify", keepAlive: true },
        component: () => import("../views/Overview/SearchEntity/Index.vue"),
      },
    ],
  },
  {
    path: "/settings",
    name: "Settings",
    meta: { isMainMenu: true },
    children: [
      {
        path: "/set-site",
        name: "setSite",
        meta: { icon: "mdi-earth" },
        component: () => import("../views/Settings/SetSite/Index.vue"),
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
