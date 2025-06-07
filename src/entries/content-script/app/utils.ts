import { computed, shallowRef } from "vue";
import type BittorrentSite from "@ptd/site/schemas/AbstractBittorrentSite.ts";
import { uniq } from "es-toolkit";

import SiteListPage from "./pages/SiteListPage.vue";
import SiteDetailPage from "./pages/SiteDetailPage.vue";

export const siteInstance = shallowRef<BittorrentSite>();

type TPageType = "unknown" | "list" | "detail";

export const pageType = computed(() => {
  let pageType: TPageType = "unknown";
  const url = location.href;
  if (siteInstance.value) {
    const metadata = siteInstance.value.metadata;

    // 首先判断是否为 list 页面
    const listUrlPatterns = uniq([
      ...(metadata.list?.urlPattern ?? []),
      ...(metadata.search?.requestConfig?.url ? [metadata.search.requestConfig.url] : []),
      ...(Object.values(metadata.searchEntry ?? {}).map((entry) => entry.requestConfig?.url) ?? []),
    ]).filter(Boolean);

    if (listUrlPatterns.some((pattern) => new RegExp(pattern!, "i").test(url))) {
      pageType = "list";
    } else {
      // 如果不是 list 页面，再判断是否为 detail 页面
      const detailUrlPatterns = uniq([
        ...(metadata.detail?.urlPattern ?? []),
        ...(metadata.detail?.requestConfig?.url ? [metadata.detail.requestConfig.url] : []),
      ]).filter(Boolean);

      if (detailUrlPatterns.some((pattern) => new RegExp(pattern, "i").test(url))) {
        pageType = "detail";
      }
    }
  } else {
    // TODO 判断是否为公共页面，如豆瓣、Imdb 等
  }
  return pageType;
});

/**
 * 使用 动态组件 的方式来为 content-script 实现一个简单的路由系统
 *
 * refs: https://cn.vuejs.org/guide/scaling-up/routing.html#simple-routing-from-scratch
 */
const routes: Record<TPageType, any> = {
  unknown: "div",
  list: SiteListPage,
  detail: SiteDetailPage,
};

export const currentView = computed(() => {
  return routes[pageType.value ?? "unknown"];
});
