<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import PQueue from "p-queue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import type { ISocialRecommendationItem, TSocialRecommendationCategory } from "@ptd/social";

import { sendMessage } from "@/messages.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import { REPO_URL } from "~/helper";
import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import SiteName from "@/options/components/SiteName.vue";

const route = useRoute();
const router = useRouter();
const display = useDisplay();
const { t } = useI18n();

const configStore = useConfigStore();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

const appendMenu = computed<Array<{ title: string; icon: string; [str: string]: any }>>(() => [
  { title: t("layout.header.home"), icon: "mdi-home", href: REPO_URL },
  { title: t("layout.header.wiki"), icon: "mdi-help-circle", href: `${REPO_URL}/wiki` },
  { title: "Ask AI", icon: "mdi-chat-question", href: `https://deepwiki.com/pt-plugins/PT-depiler` },
]);

const searchKey = ref<string>("");
const searchPlanKey = ref<string>("default");
const isRecommendationMenuOpen = ref(false);
const isLoadingRecommendations = ref(false);
const recommendationError = ref("");
const recommendationItems = ref<ISocialRecommendationItem[]>([]);
let recommendationRequestId = 0;

const recommendationCategories: TSocialRecommendationCategory[] = ["movie", "tv", "variety", "anime"];
const recommendationCategoryLimit = 10;
const visibleRecommendationCategoryLimit = 5;
const recommendationItemEnrichmentConcurrency = 10;

const groupedRecommendationItems = computed(() =>
  recommendationCategories.map((category) => ({
    category,
    items: recommendationItems.value.filter((item) => item.category === category).slice(0, recommendationCategoryLimit),
  })),
);

const searchPlans = computed(() =>
  metadataStore.getSearchSolutions
    .filter((x) => !!x.enabled) // 过滤掉未启用的搜索方案
    .sort((a, b) => b.sort - a.sort) // 按照 sort 降序排序
    .map((x) => ({
      id: x.id,
      name: x.name,
    })),
);

function startSearchEntity() {
  router.push({
    name: "SearchEntity",
    query: {
      search: searchKey.value,
      plan: searchPlanKey.value,
      flush: 1,
    },
  });
}

async function loadRecommendations(flush = false) {
  if (isLoadingRecommendations.value) {
    return;
  }

  if (!flush && recommendationItems.value.length > 0 && !recommendationError.value) {
    const requestId = ++recommendationRequestId;
    if (hasIncompleteRecommendations()) {
      void enrichRecommendations(requestId);
    }
    return;
  }

  isLoadingRecommendations.value = true;
  recommendationError.value = "";
  const requestId = ++recommendationRequestId;

  try {
    const result = await sendMessage("getSocialRecommendations", { flush, enrichment: "none" });
    if (requestId !== recommendationRequestId) {
      return;
    }
    if (result.performanceDiagnostics) {
      console.info("[PTD] hot recommendation performance", result.performanceDiagnostics);
    }

    if (!result.hasFailedSources || recommendationItems.value.length === 0) {
      recommendationItems.value = result.items;
    }
    if (result.hasFailedSources && recommendationItems.value.length === 0) {
      recommendationError.value = t("layout.header.hotRecommendations.loadFailed");
    }
    void enrichRecommendations(requestId);
  } catch (error) {
    console.error("Failed to load social recommendations", error);
    if (recommendationItems.value.length === 0) {
      recommendationError.value = t("layout.header.hotRecommendations.loadFailed");
    }
  } finally {
    if (requestId === recommendationRequestId) {
      isLoadingRecommendations.value = false;
    }
  }
}

function hasIncompleteRecommendations() {
  return recommendationItems.value.some(
    (item) =>
      !item.summary || !item.releaseYear || !item.region || !item.genres?.length || !item.poster?.startsWith("data:"),
  );
}

function getRecommendationItemKey(item: ISocialRecommendationItem) {
  return `${item.category}:${item.site}:${item.id}`;
}

function getVisibleRecommendationItems() {
  const categoryCounts = new Map<ISocialRecommendationItem["category"], number>();
  const visibleItems: ISocialRecommendationItem[] = [];

  for (const item of recommendationItems.value) {
    const categoryCount = categoryCounts.get(item.category) ?? 0;
    categoryCounts.set(item.category, categoryCount + 1);

    if (categoryCount < visibleRecommendationCategoryLimit) {
      visibleItems.push(item);
    }
  }

  return visibleItems;
}

function updateRecommendationItem(enrichedItem: ISocialRecommendationItem) {
  const enrichedItemKey = getRecommendationItemKey(enrichedItem);
  const itemIndex = recommendationItems.value.findIndex((item) => getRecommendationItemKey(item) === enrichedItemKey);

  if (itemIndex === -1) {
    return;
  }

  recommendationItems.value = recommendationItems.value.map((item, index) =>
    index === itemIndex ? enrichedItem : item,
  );
}

function logRecommendationDiagnostics(
  result: {
    posterDiagnostics?: Array<Record<string, any>>;
    performanceDiagnostics?: Record<string, any>;
  },
  enrichment: "visible" | "all",
) {
  if (result.posterDiagnostics?.length) {
    console.info("[PTD] hot recommendation poster diagnostics", result.posterDiagnostics);
  }
  if (result.performanceDiagnostics) {
    console.info("[PTD] hot recommendation item performance", { enrichment, ...result.performanceDiagnostics });
  }
}

async function enrichRecommendationItems(
  requestId: number,
  items: ISocialRecommendationItem[],
  enrichment: "visible" | "all",
) {
  if (!isRecommendationMenuOpen.value) {
    return;
  }

  const enrichmentQueue = new PQueue({ concurrency: recommendationItemEnrichmentConcurrency });
  await Promise.all(
    items.map((item) =>
      enrichmentQueue.add(async () => {
        try {
          const result = await sendMessage("getSocialRecommendationItem", { item, enrichment });
          if (requestId !== recommendationRequestId || !isRecommendationMenuOpen.value) {
            return;
          }
          logRecommendationDiagnostics(result, enrichment);
          updateRecommendationItem(result.item);
        } catch (error) {
          console.error("Failed to enrich social recommendation item", item, error);
        }
      }),
    ),
  );
}

async function enrichRecommendations(requestId: number) {
  await enrichRecommendationItems(requestId, getVisibleRecommendationItems(), "visible");
  if (requestId !== recommendationRequestId || !isRecommendationMenuOpen.value) {
    return;
  }
  await enrichRecommendationItems(requestId, [...recommendationItems.value], "all");
}

function searchRecommendation(item: ISocialRecommendationItem) {
  searchKey.value = item.title;
  isRecommendationMenuOpen.value = false;
  startSearchEntity();
}

function getRecommendationRegionClass(region?: string) {
  return region && /(中国|华语|香港|台湾|澳门)/.test(region)
    ? "hot-recommendation-chip-region-domestic"
    : "hot-recommendation-chip-region-foreign";
}

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery?.search && (newQuery.search as string) !== searchKey.value) {
      searchKey.value = newQuery.search as string;
    }
    if (newQuery?.plan && (newQuery.plan as string) !== searchPlanKey.value) {
      searchPlanKey.value = newQuery.plan as string;
    }
  },
);

watch(isRecommendationMenuOpen, (isOpen) => {
  if (isOpen) {
    loadRecommendations();
  }
});
</script>

<template>
  <v-app-bar id="ptd-topbar" app color="amber">
    <template #prepend>
      <v-app-bar-nav-icon
        :title="t('layout.header.navBarTip')"
        variant="text"
        @click="configStore.isNavBarOpen = !configStore.isNavBarOpen"
      >
        <template v-if="display.smAndUp.value">
          <v-icon icon="$menu"></v-icon>
        </template>
        <template v-else>
          <v-img inline src="/icons/logo/64.png" width="24"></v-img>
        </template>
      </v-app-bar-nav-icon>
    </template>

    <v-app-bar-title v-show="display.smAndUp.value" ref="titleTarget" style="min-width: 120px; max-width: 160px">
      <v-img inline src="/icons/logo/64.png" width="24"></v-img>
      {{ t("manifest.extName") }}
    </v-app-bar-title>

    <!-- 搜索输入框 -->
    <v-combobox
      v-model="searchKey"
      :placeholder="t('layout.header.searchTip')"
      class="ptd-search-input pl-2"
      clearable
      enterkeyhint="search"
      hide-details
      style="width: 300px"
      type="search"
      @keyup.enter="startSearchEntity"
    >
      <template #append>
        <v-menu v-model="isRecommendationMenuOpen" :close-on-content-click="false" location="bottom end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              :disabled="runtimeStore.search.isSearching"
              icon="mdi-fire"
              :title="t('layout.header.hotRecommendations.title')"
            />
          </template>

          <v-card min-width="1120" max-width="1280">
            <v-card-title class="d-flex align-center py-2">
              <v-icon icon="mdi-fire" class="mr-2" />
              <span class="text-subtitle-1">{{ t("layout.header.hotRecommendations.title") }}</span>
              <v-spacer />
              <v-btn
                :loading="isLoadingRecommendations"
                icon="mdi-refresh"
                size="small"
                variant="text"
                :title="t('layout.header.hotRecommendations.refresh')"
                @click="() => loadRecommendations(true)"
              />
            </v-card-title>

            <v-divider />

            <v-card-text v-if="isLoadingRecommendations && recommendationItems.length === 0" class="py-4">
              <div class="d-flex align-center text-medium-emphasis">
                <v-progress-circular indeterminate size="18" width="2" class="mr-2" />
                {{ t("layout.header.hotRecommendations.loading") }}
              </div>
            </v-card-text>

            <v-card-text v-else-if="recommendationError && recommendationItems.length === 0" class="py-4">
              <div class="text-error">{{ recommendationError }}</div>
            </v-card-text>

            <v-card-text v-else-if="recommendationItems.length === 0" class="py-4 text-medium-emphasis">
              {{ t("layout.header.hotRecommendations.empty") }}
            </v-card-text>

            <v-card-text v-else class="pa-3">
              <v-row dense>
                <v-col v-for="group in groupedRecommendationItems" :key="group.category" cols="12" sm="6" lg="3">
                  <div class="text-subtitle-2 mb-2">
                    {{ t(`layout.header.hotRecommendations.category.${group.category}`) }}
                  </div>

                  <v-list density="compact" class="hot-recommendation-list pa-0 rounded border">
                    <v-list-item v-if="group.items.length === 0" class="hot-recommendation-empty-item px-2">
                      <v-list-item-title class="text-body-2 text-medium-emphasis">
                        {{ t("layout.header.hotRecommendations.empty") }}
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      v-for="item in group.items"
                      :key="`${item.category}:${item.site}:${item.id}`"
                      class="hot-recommendation-item px-2"
                      @click="() => searchRecommendation(item)"
                    >
                      <template #prepend>
                        <v-img
                          :src="item.poster || '/icons/movie_placeholder.png'"
                          class="hot-recommendation-poster mr-2"
                          cover
                          referrerpolicy="no-referrer"
                        >
                          <template #error>
                            <v-img src="/icons/movie_placeholder.png" class="hot-recommendation-poster" cover />
                          </template>
                        </v-img>
                      </template>

                      <v-list-item-title class="hot-recommendation-title-row text-body-2">
                        <span class="hot-recommendation-title text-truncate">{{ item.title }}</span>
                        <span class="hot-recommendation-rating">
                          <v-icon icon="mdi-star" color="amber-darken-2" size="x-small" class="mr-1" />
                          {{
                            item.ratingScore
                              ? item.ratingScore.toFixed(1)
                              : t("layout.header.hotRecommendations.noRating")
                          }}
                        </span>
                      </v-list-item-title>

                      <div class="hot-recommendation-meta">
                        <span v-if="item.releaseYear" class="hot-recommendation-chip hot-recommendation-chip-year">
                          {{ item.releaseYear }}
                        </span>
                        <span
                          v-if="item.region"
                          :class="['hot-recommendation-chip', getRecommendationRegionClass(item.region)]"
                        >
                          {{ item.region }}
                        </span>
                        <span
                          v-for="genre in item.genres?.slice(0, 3)"
                          :key="genre"
                          class="hot-recommendation-chip hot-recommendation-chip-genre"
                        >
                          {{ genre }}
                        </span>
                      </div>

                      <v-list-item-subtitle class="hot-recommendation-summary">
                        {{ item.summary || t("layout.header.hotRecommendations.noSummary") }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>

        <!-- 搜索按键 -->
        <v-btn
          :disabled="runtimeStore.search.isSearching"
          icon="mdi-magnify"
          :title="t('common.search')"
          @click="startSearchEntity"
        />
      </template>

      <template #prepend-inner>
        <!-- 搜索方案选择框 -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="primary">
              {{
                searchPlanKey == "default"
                  ? t("layout.header.searchPlan.default")
                  : metadataStore.getSearchSolutionName(searchPlanKey)
              }}
            </v-btn>
          </template>
          <v-list>
            <!-- 默认搜索方案 -->
            <v-list-item
              :subtitle="
                '<' +
                (metadataStore.defaultSolutionId !== 'default'
                  ? metadataStore.getSearchSolutionName(metadataStore.defaultSolutionId)
                  : t('layout.header.searchPlan.all')) +
                '>'
              "
              :title="t('layout.header.searchPlan.default')"
              @click="() => (searchPlanKey = 'default')"
            />

            <!-- 全部站点搜索方案（仅当默认搜索不是全部站点时出现） -->
            <template v-if="metadataStore.defaultSolutionId !== 'default'">
              <v-list-item
                :title="t('layout.header.searchPlan.all')"
                @click="() => (searchPlanKey = 'all')"
              ></v-list-item>
            </template>

            <!-- 单个站点搜索方案 -->
            <v-list-item
              v-if="configStore.searchEntity.allowSingleSiteSearch"
              :title="t('layout.header.searchPlan.singleSite')"
            >
              <template v-slot:append>
                <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
              </template>

              <v-menu
                :open-on-focus="false"
                open-on-hover
                :open-on-click="display.mobile.value"
                activator="parent"
                submenu
              >
                <v-list>
                  <template v-for="siteMetadata in metadataStore.getSortedAddedSites" :key="siteMetadata.id">
                    <v-list-item
                      v-if="siteMetadata.allowSearch ?? false"
                      @click="() => (searchPlanKey = `site:${siteMetadata.id}`)"
                    >
                      <template #prepend>
                        <SiteFavicon :site-id="siteMetadata.id" />
                      </template>
                      <SiteName :class="['v-list-item-title', 'ml-2']" :site-id="siteMetadata.id" tag="span" />
                    </v-list-item>
                  </template>
                </v-list>
              </v-menu>
            </v-list-item>

            <v-divider />

            <!-- 用户自定义的搜索方案列表 -->
            <v-list-item
              v-for="(item, index) in searchPlans"
              :key="index"
              :value="index"
              @click="() => (searchPlanKey = item.id)"
            >
              <v-list-item-title>{{ metadataStore.getSearchSolutionName(item.id) }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-combobox>

    <v-spacer v-if="display.smAndUp.value" />

    <template #append>
      <template v-if="!display.mdAndDown.value">
        <!-- 处于大屏幕，完整显示所有btn -->
        <v-btn
          v-for="(append, index) in appendMenu"
          :key="index"
          v-bind.prop="append.prop"
          :append-icon="append.icon"
          :href="append.href"
          :title="append.title"
          rel="noopener noreferrer nofollow"
          size="large"
          target="_blank"
          variant="text"
        >
          <span class="ml-1">{{ append.title }}</span>
        </v-btn>
      </template>

      <template v-else>
        <!-- 处于小屏幕，只显示点，btn以menu列表形式展示 -->
        <v-menu bottom left offset-y>
          <template #activator="{ props }">
            <v-btn :title="t('layout.header.expand')" v-bind="props" icon="mdi-dots-vertical" variant="text" />
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in appendMenu"
              :key="index"
              :href="item.href"
              :prepend-icon="item.icon"
              :title="item.title"
              variant="text"
              rel="noopener noreferrer nofollow"
              size="large"
              class="menu-item list-item-none-spacer"
              target="_blank"
            />
          </v-list>
        </v-menu>
      </template>
    </template>
  </v-app-bar>
</template>

<style scoped lang="scss">
.menu-item:deep(.v-list-item__prepend > .v-icon) {
  margin-inline-end: 16px;
}

.ptd-search-input:deep(.v-input__append) {
  padding-top: 4px;
}

.hot-recommendation-item {
  min-height: 96px;
}

.hot-recommendation-list {
  max-height: 480px;
  overflow-y: auto;
}

.hot-recommendation-empty-item {
  min-height: 78px;
}

.hot-recommendation-poster {
  width: 46px;
  height: 62px;
  border-radius: 4px;
}

.hot-recommendation-title-row {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

.hot-recommendation-title {
  min-width: 0;
  flex: 1;
}

.hot-recommendation-rating {
  display: inline-flex;
  flex: none;
  align-items: center;
  color: rgba(var(--v-theme-on-surface), 0.64);
  font-size: 0.75rem;
}

.hot-recommendation-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 3px;
  margin-bottom: 3px;
  min-height: 20px;
}

.hot-recommendation-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  height: 18px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 0.68rem;
  line-height: 18px;
}

.hot-recommendation-chip-year {
  color: #6750a4;
  background: #eee8ff;
}

.hot-recommendation-chip-region-domestic {
  color: #8a3b12;
  background: #fff0d5;
}

.hot-recommendation-chip-region-foreign {
  color: #0f5c68;
  background: #dff6f8;
}

.hot-recommendation-chip-genre {
  color: #2f5d37;
  background: #e6f4ea;
}

.hot-recommendation-summary {
  display: -webkit-box;
  overflow: hidden;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: rgba(var(--v-theme-on-surface), 0.58);
  font-size: 0.72rem;
  line-height: 1.25;
}
</style>
