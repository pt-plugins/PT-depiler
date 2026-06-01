<script lang="ts" setup>
import { computed, ref, watch } from "vue";
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

const recommendationCategories: TSocialRecommendationCategory[] = ["movie", "tv", "anime"];
const recommendationCategoryLimit = 10;

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
    return;
  }

  isLoadingRecommendations.value = true;
  recommendationError.value = "";

  try {
    const result = await sendMessage("getSocialRecommendations", { flush });
    if (result.posterDiagnostics?.length) {
      console.info("[PTD] hot recommendation poster diagnostics", result.posterDiagnostics);
    }
    if (!result.hasFailedSources || recommendationItems.value.length === 0) {
      recommendationItems.value = result.items;
    }
    if (result.hasFailedSources && recommendationItems.value.length === 0) {
      recommendationError.value = t("layout.header.hotRecommendations.loadFailed");
    }
  } catch (error) {
    console.error("Failed to load social recommendations", error);
    if (recommendationItems.value.length === 0) {
      recommendationError.value = t("layout.header.hotRecommendations.loadFailed");
    }
  } finally {
    isLoadingRecommendations.value = false;
  }
}

function searchRecommendation(item: ISocialRecommendationItem) {
  searchKey.value = item.title;
  isRecommendationMenuOpen.value = false;
  startSearchEntity();
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

          <v-card min-width="820" max-width="960">
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
                <v-col v-for="group in groupedRecommendationItems" :key="group.category" cols="4">
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
  min-height: 78px;
}

.hot-recommendation-list {
  max-height: 390px;
  overflow-y: auto;
}

.hot-recommendation-empty-item {
  min-height: 78px;
}

.hot-recommendation-poster {
  width: 42px;
  height: 56px;
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

.hot-recommendation-summary {
  display: -webkit-box;
  overflow: hidden;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.25;
}
</style>
