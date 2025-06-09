import { computed, shallowRef, ref, toValue } from "vue";
import { uniq } from "es-toolkit";
import type BittorrentSite from "@ptd/site/schemas/AbstractBittorrentSite.ts";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import SiteListPage from "./pages/SiteListPage.vue";
import SiteDetailPage from "./pages/SiteDetailPage.vue";

export const siteInstance = shallowRef<BittorrentSite>();

type TPageType = "unknown" | "list" | "detail";

export const pageType = ref<TPageType>("unknown");

export function updatePageType() {
  pageType.value = "unknown"; // 重置为 unknown
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
      pageType.value = "list";
    } else {
      // 如果不是 list 页面，再判断是否为 detail 页面
      const detailUrlPatterns = uniq([
        ...(metadata.detail?.urlPattern ?? []),
        ...(metadata.detail?.requestConfig?.url ? [metadata.detail.requestConfig.url] : []),
      ]).filter(Boolean);

      if (detailUrlPatterns.some((pattern) => new RegExp(pattern, "i").test(url))) {
        pageType.value = "detail";
      }
    }
  } else {
    // TODO 判断是否为公共页面，如豆瓣、Imdb 等
  }
}

export function doKeywordSearch(keywords: string) {
  if (!keywords) {
    keywords = prompt("未解析到搜索关键词，请输入：", "")!;
  }

  if (keywords) {
    sendMessage("openOptionsPage", {
      path: "/search-entity",
      query: { search: toValue(keywords), flush: 1 },
    }).catch();
  } else {
    const runtimeStore = useRuntimeStore();
    runtimeStore.showSnakebar("搜索关键词不能为空", { color: "error" });
  }
}

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
