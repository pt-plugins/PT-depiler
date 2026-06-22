<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import PQueue from "p-queue";
import { useI18n } from "vue-i18n";
import type { ISocialRecommendationItem, TSocialRecommendationCategory } from "@ptd/social";

import { sendMessage } from "@/messages.ts";

const { disabled } = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  search: [title: string];
}>();

const { t } = useI18n();

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
  isRecommendationMenuOpen.value = false;
  emit("search", item.title);
}

function getRecommendationRegionClass(region?: string) {
  return region && /(中国|华语|香港|台湾|澳门)/.test(region)
    ? "hot-recommendation-chip-region-domestic"
    : "hot-recommendation-chip-region-foreign";
}

function getRecommendationPosterSrc(item: ISocialRecommendationItem) {
  if (!item.poster || /doubanio\.com/.test(item.poster)) {
    return "/icons/movie_placeholder.png";
  }

  return item.poster;
}

watch(isRecommendationMenuOpen, (isOpen) => {
  if (isOpen) {
    loadRecommendations();
  }
});
</script>

<template>
  <v-menu
    v-model="isRecommendationMenuOpen"
    :close-on-content-click="false"
    location="bottom end"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :disabled="disabled"
        icon="mdi-fire"
        :title="t('layout.header.hotRecommendations.title')"
        variant="text"
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
                    :src="getRecommendationPosterSrc(item)"
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
                      item.ratingScore ? item.ratingScore.toFixed(1) : t("layout.header.hotRecommendations.noRating")
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
</template>

<style scoped lang="scss">
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
