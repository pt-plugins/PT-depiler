<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { isEmpty } from "es-toolkit/compat";
import { formatBitrate, getMediaServerIcon, type IMediaServerItem } from "@ptd/mediaServer";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { formatSize } from "@/options/utils.ts";

import ItemInformationDialog from "./ItemInformationDialog.vue";

import FilterChips from "@/options/components/FilterChips.vue";

import { doSearch, searchMediaServerIds } from "./utils.ts";

const { t } = useI18n();
const route = useRoute();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const search = ref<string>((route.query.search as string) || "");

const showItem = ref<IMediaServerItem | null>(null);
const showItemInformationDialog = ref<boolean>(false);

const hasMore = computed<boolean>(() =>
  isEmpty(runtimeStore.mediaServerSearch.searchStatus)
    ? true
    : Object.values(runtimeStore.mediaServerSearch.searchStatus).some((x) => x?.canLoadMore ?? true),
);

const mediaServerItems = computed<string[]>(() =>
  metadataStore.getEnabledMediaServers.map((mediaServer) => mediaServer.id),
);

// 已加载的结果保留在 store 中不丢弃，仅按当前筛选出的服务器决定显示哪些卡片
const filteredSearchResult = computed(() =>
  runtimeStore.mediaServerSearch.searchResult.filter((item) => searchMediaServerIds.value.includes(item.server)),
);

function showItemInformation(item: IMediaServerItem) {
  showItem.value = item;
  showItemInformationDialog.value = true;
}

/** 卡片上的画质摘要（调研 A2）：分辨率 · 码率；没有结构化信息时回退到首个视频流标题 */
function videoSummary(item: IMediaServerItem): string | undefined {
  const video = item.mediaInfo?.video;
  const parts = [video?.resolution, formatBitrate(video?.bitrate)].filter(Boolean) as string[];
  if (parts.length > 0) return parts.join(" · ");
  return item.streams?.filter((s) => s.type === "Video")[0]?.title;
}

/** 卡片上的观看状态（调研 A6）：未看 / 百分比 / 已看 */
function watchState(item: IMediaServerItem): string {
  const percent = item.user?.playedPercentage;
  if (item.user?.IsPlayed || percent === 100) return t("MediaServerEntity.watched");
  if (percent && percent > 0) return t("MediaServerEntity.watchedPercent", { percent });
  return t("MediaServerEntity.unwatched");
}

/** 色域角标（调研 A2）：SDR 不显示，其余（HDR10 / DolbyVision…）透出原始值 */
function videoRangeBadge(item: IMediaServerItem): string | undefined {
  const range = item.mediaInfo?.video?.videoRange;
  if (!range || /^sdr$/i.test(range)) return undefined;
  return range.toUpperCase();
}

/** 剧集编号（调研 B10）：S01E05（季号缺失时只给 E05） */
function seriesText(item: IMediaServerItem): string | undefined {
  if (typeof item.indexNumber !== "number") return undefined;
  const season =
    typeof item.parentIndexNumber === "number" ? `S${String(item.parentIndexNumber).padStart(2, "0")}` : "";
  return `${season}E${String(item.indexNumber).padStart(2, "0")}`;
}

function onScroll() {
  // 当滚动到页面底部时加载更多
  if (
    configStore.mediaServerEntity.autoSearchMoreWhenScroll &&
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 &&
    !runtimeStore.mediaServerSearch.isSearching &&
    hasMore.value
  ) {
    doSearch({ searchKey: search.value, loadMore: true });
  }
}

onMounted(async () => {
  if (configStore.mediaServerEntity.autoSearchWhenMount && runtimeStore.mediaServerSearch.searchResult.length === 0) {
    // noinspection ES6MissingAwait
    doSearch({ searchKey: search.value });
  }
});
</script>

<template>
  <v-alert :title="t('route.Overview.MediaServerEntity')" type="info" />
  <v-card v-scroll="onScroll">
    <v-card-title>
      <v-row class="ma-0 align-center">
        <!-- 媒体服务器筛选器 -->
        <FilterChips
          v-model="searchMediaServerIds"
          :all-label="t('MediaServerEntity.serverFilter.all')"
          all-icon="mdi-server"
          :items="mediaServerItems"
          class="mr-2"
          multiple
        >
          <template #chip="{ item }">
            <v-avatar :image="getMediaServerIcon(metadataStore.mediaServers[item].type)" class="mr-1" size="18" />
            {{ metadataStore.mediaServers[item].name }}
          </template>
        </FilterChips>

        <v-spacer />

        <v-text-field
          v-model="search"
          :loading="runtimeStore.mediaServerSearch.isSearching"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          max-width="500"
          :placeholder="t('MediaServerEntity.searchPlaceholder')"
          @keyup.enter="() => doSearch({ searchKey: search })"
          @click:append="() => doSearch({ searchKey: search })"
        />
      </v-row>
    </v-card-title>

    <!--  瀑布流形式展示媒体服务器搜索结果 -->
    <div v-if="filteredSearchResult.length > 0" class="masonry-grid">
      <div v-for="item in filteredSearchResult" :key="item.url" class="masonry-item">
        <v-card>
          <div class="position-relative mb-1">
            <v-menu
              :close-on-content-click="false"
              contained
              content-class="masonry-img-overlay"
              location="start center"
              open-on-hover
              origin="start center"
              scrim
            >
              <template v-slot:activator="{ props, isActive }">
                <div class="masonry-right-label">
                  <!-- 用户状态（观看、喜欢、观看深度，调研 A6） -->
                  <v-chip
                    v-if="item.user"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    base-color="grey-lighten-2"
                    label
                    size="x-small"
                  >
                    <v-icon :icon="item.user?.IsPlayed ? 'mdi-check-bold' : 'mdi-radiobox-blank'" color="green" />
                    <v-icon :icon="item.user?.IsFavorite ? 'mdi-heart' : 'mdi-heart-outline'" color="red" />
                    <span class="ml-1">{{ watchState(item) }}</span>
                  </v-chip>
                </div>
                <div class="masonry-left-label">
                  <!-- 封装格式 + 画质/码率（调研 A2） -->
                  <v-chip
                    v-if="item.format"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    base-color="light-blue"
                    label
                    prepend-icon="mdi-aspect-ratio"
                    size="x-small"
                  >
                    {{ item.format?.toUpperCase() }}
                    <template v-if="videoSummary(item)"> / {{ videoSummary(item) }}</template>
                  </v-chip>
                  <br />
                  <!-- 大小 -->
                  <v-chip
                    v-if="item.size"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    label
                    prepend-icon="mdi-movie"
                    size="x-small"
                  >
                    {{ formatSize(item.size ?? 0) }}
                  </v-chip>
                  <!-- 评分（调研 A1） -->
                  <v-chip
                    v-if="typeof item.rating === 'number'"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    base-color="amber"
                    label
                    prepend-icon="mdi-star"
                    size="x-small"
                  >
                    {{ item.rating.toFixed(1) }}
                  </v-chip>
                  <!-- 色域（调研 A2） -->
                  <v-chip
                    v-if="videoRangeBadge(item)"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    base-color="deep-orange"
                    label
                    size="x-small"
                  >
                    {{ videoRangeBadge(item) }}
                  </v-chip>
                  <!-- 年份（调研 B8） -->
                  <v-chip
                    v-if="item.productionYear"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    base-color="blue-grey"
                    label
                    size="x-small"
                  >
                    {{ item.productionYear }}
                  </v-chip>
                  <!-- 同片多版本（调研 B9） -->
                  <v-chip
                    v-if="(item.mediaSourceCount ?? 0) > 1"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    base-color="purple"
                    label
                    size="x-small"
                  >
                    {{ t("MediaServerEntity.versions", { count: item.mediaSourceCount }) }}
                  </v-chip>
                  <!-- 剧集编号（调研 B10） -->
                  <v-chip
                    v-if="seriesText(item)"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    base-color="indigo"
                    label
                    size="x-small"
                  >
                    {{ seriesText(item) }}
                  </v-chip>
                </div>
                <v-img v-bind="props" :src="item.poster" :title="item.name" />
              </template>

              <v-btn append-icon="mdi-information-outline" block @click="() => showItemInformation(item)">
                {{ t("MediaServerEntity.detail") }}
              </v-btn>
              <!-- 外部链接（调研 A5：IMDb / TMDb …） -->
              <v-btn
                v-for="externalUrl in item.externalUrls ?? []"
                :key="externalUrl.url"
                :href="externalUrl.url"
                append-icon="mdi-open-in-new"
                block
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                {{ externalUrl.name }}
              </v-btn>
              <v-btn
                :href="item.url"
                append-icon="mdi-arrow-top-right-bold-box-outline"
                block
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                {{ t("common.visit") }}
              </v-btn>
            </v-menu>
          </div>

          <v-card-subtitle class="text-center my-1" style="white-space: normal">
            <a :href="item.url" :title="item.name" class="font-weight-bold my-2" target="_blank">
              {{ item.name }}
            </a>

            <div v-if="metadataStore.mediaServers[item.server]" class="d-flex justify-center align-center mt-1">
              <v-avatar
                :alt="metadataStore.mediaServers[item.server].name"
                :image="getMediaServerIcon(metadataStore.mediaServers[item.server].type)"
                size="x-small"
              />
              &nbsp; {{ metadataStore.mediaServers[item.server].name }}
            </div>
          </v-card-subtitle>
        </v-card>
      </div>
    </div>
    <v-row v-else>
      <v-col class="d-flex justify-center text-body-large">{{ t("MediaServerEntity.noItems") }}</v-col>
    </v-row>

    <!-- TODO 点击加载更多 -->
    <v-container>
      <v-row>
        <v-col class="d-flex justify-center">
          <v-btn
            :disabled="!hasMore"
            :loading="runtimeStore.mediaServerSearch.isSearching"
            @click="() => doSearch({ searchKey: search, loadMore: true })"
          >
            {{ t("MediaServerEntity.loadMore") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <ItemInformationDialog v-model="showItemInformationDialog" :item="showItem as IMediaServerItem" />
</template>

<style scoped lang="scss">
.masonry-grid {
  padding: 10px 1% 10px 1%;
  width: 100%;
  height: 100%;

  column-gap: 1rem;

  @media (max-width: 599.98px) {
    column-count: 2;
  }

  @media (min-width: 600px) and (max-width: 959.98px) {
    column-count: 4;
  }

  @media (min-width: 960px) and (max-width: 1279.98px) {
    column-count: 5;
  }

  @media (min-width: 1280px) {
    column-count: 7;
  }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;

  .masonry-left-label {
    z-index: 998;
    position: absolute;
    max-width: calc(100% - 50px);
    padding-left: 4px;
    padding-top: 4px;

    :deep(.v-chip__content) {
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
  }

  .masonry-right-label {
    z-index: 999;
    position: absolute;
    padding-right: 4px;
    padding-top: 4px;
    right: 0;
  }
}

:deep(.masonry-img-overlay) {
  width: 80%;

  .v-btn + .v-btn {
    margin-top: 8px;
  }
}
</style>
