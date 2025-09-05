import { computed, shallowRef, ref, toValue } from "vue";
import { uniq } from "es-toolkit";
import type { TSupportSocialSite } from "@ptd/social";
import { getSite as createSiteInstance } from "@ptd/site";
import type BittorrentSite from "@ptd/site/schemas/AbstractBittorrentSite.ts";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import SocialSitePage from "./pages/SocialSitePage.vue";
import SiteListPage from "./pages/SiteListPage.vue";
import SiteDetailPage from "./pages/SiteDetailPage.vue";

export const siteInstance = shallowRef<BittorrentSite>();

type TPageType = "unknown" | "social" | "list" | "detail";

export interface IPtdData {
  siteId?: string;
  socialSite?: TSupportSocialSite;
  [key: string]: any;
}

export const pageType = ref<TPageType>("unknown");

export async function updatePageType(ptdData: IPtdData = {}) {
  const metadataStore = useMetadataStore();

  pageType.value = "unknown"; // 重置为 unknown
  const url = location.href;

  if (ptdData.socialSite) {
    pageType.value = "social";
  } else if (ptdData.siteId) {
    const siteConfig = await metadataStore.getSiteUserConfig(ptdData.siteId);
    siteInstance.value = await createSiteInstance(ptdData.siteId, siteConfig);

    if (siteInstance.value) {
      const metadata = siteInstance.value.metadata;

      // 首先判断是否为 list 页面
      let listUrlPatterns = [];
      if (metadata.list && metadata.list.length > 0) {
        listUrlPatterns = metadata.list.flatMap((item) => item.urlPattern ?? []).filter(Boolean);
      } else {
        listUrlPatterns = uniq([
          ...(metadata.search?.requestConfig?.url ? [metadata.search.requestConfig.url] : []),
          ...(Object.values(metadata.searchEntry ?? {}).map((entry) => entry.requestConfig?.url) ?? []),
        ]).filter(Boolean);
      }

      if (
        listUrlPatterns.some((pattern) => {
          if (pattern instanceof RegExp) {
            return pattern.test(url);
          } else if ((pattern as string).startsWith("!")) {
            return !new RegExp((pattern as string)!.slice(1), "i").test(url);
          } else {
            return new RegExp(pattern as string, "i").test(url);
          }
        })
      ) {
        pageType.value = "list";
      } else {
        // 如果不是 list 页面，再判断是否为 detail 页面
        let detailUrlPatterns = metadata.detail?.urlPattern ?? [];

        if (detailUrlPatterns.some((pattern) => new RegExp(pattern, "i").test(url))) {
          pageType.value = "detail";
        }
      }
    }
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
  social: SocialSitePage,
  list: SiteListPage,
  detail: SiteDetailPage,
};

export const currentView = computed(() => {
  return routes[pageType.value ?? "unknown"];
});
