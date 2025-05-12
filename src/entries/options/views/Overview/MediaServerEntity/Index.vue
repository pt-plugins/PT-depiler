<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { isEmpty } from "es-toolkit/compat";
import { getMediaServerIcon, type IMediaServerItem } from "@ptd/mediaServer";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { formatSize } from "@/options/utils.ts";

import ItemInformationDialog from "./ItemInformationDialog.vue";
import { doSearch, searchMediaServerIds } from "@/options/views/Overview/MediaServerEntity/utils.ts";

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

function showItemInformation(item: IMediaServerItem) {
  showItem.value = item;
  showItemInformationDialog.value = true;
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
      <v-row class="ma-0">
        <v-spacer />
        <v-text-field
          v-model="search"
          :loading="runtimeStore.mediaServerSearch.isSearching"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          max-width="500"
          placeholder="搜索词"
          @keyup.enter="() => doSearch({ searchKey: search })"
          @click:append="() => doSearch({ searchKey: search })"
        >
          <template #prepend-inner>
            <v-menu :close-on-content-clicks="false">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-server" variant="plain" />
              </template>
              <v-list class="pa-0">
                <v-list-item>
                  <v-checkbox
                    hide-details
                    indeterminate
                    label="全选"
                    @click.stop
                    @update:model-value="
                      (v: unknown) => {
                        if (v) {
                          searchMediaServerIds = metadataStore.getEnabledMediaServers.map(
                            (mediaServer) => mediaServer.id,
                          );
                        } else {
                          searchMediaServerIds = [];
                        }
                      }
                    "
                  />
                </v-list-item>
                <v-divider />
                <v-list-item v-for="item in metadataStore.getMediaServers" :key="item.id">
                  <v-checkbox
                    v-model="searchMediaServerIds"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.enabled === false"
                    hide-details
                    multiple
                    @click.stop
                  >
                    <template #append>
                      <v-avatar :image="getMediaServerIcon(item.type)" :alt="item.type" size="x-small" />
                    </template>
                  </v-checkbox>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
      </v-row>
    </v-card-title>

    <!--  瀑布流形式展示媒体服务器搜索结果 -->
    <div v-if="runtimeStore.mediaServerSearch.searchResult.length > 0" class="masonry-grid">
      <div v-for="item in runtimeStore.mediaServerSearch.searchResult" :key="item.url" class="masonry-item">
        <v-card>
          <div class="position-relative mb-1">
            <v-menu
              :close-on-content-clicks="false"
              contained
              content-class="masonry-img-overlay"
              location="start center"
              open-on-hover
              origin="start center"
              scrim
            >
              <template v-slot:activator="{ props, isActive }">
                <div style="z-index: 999; position: absolute; padding-right: 4px; padding-top: 4px; right: 0">
                  <!-- 用户状态（观看、喜欢） -->
                  <v-chip
                    v-if="item.user"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    label
                    base-color="grey-lighten-2"
                    size="x-small"
                  >
                    <v-icon :icon="item.user?.IsPlayed ? 'mdi-check-bold' : 'mdi-radiobox-blank'" color="green" />
                    <v-icon :icon="item.user?.IsFavorite ? 'mdi-heart' : 'mdi-heart-outline'" color="red" />
                  </v-chip>
                </div>
                <div style="z-index: 999; position: absolute; padding-left: 4px; padding-top: 4px">
                  <!-- 封装格式 -->
                  <v-chip
                    v-if="item.format"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    base-color="light-blue"
                    label
                    prepend-icon="mdi-aspect-ratio"
                    size="x-small"
                  >
                    {{ item.format?.toUpperCase() }}
                    <template v-if="item.streams && item.streams.filter((s) => s.type === 'Video')!.length > 0">
                      / {{ item.streams.filter((s) => s.type === "Video")[0].title }}
                    </template>
                  </v-chip>
                  <br />
                  <!-- 大小 -->
                  <v-chip
                    v-if="item.size"
                    :variant="isActive ? 'tonal' : 'elevated'"
                    label
                    size="x-small"
                    prepend-icon="mdi-movie"
                  >
                    {{ formatSize(item.size ?? 0) }}
                  </v-chip>
                </div>
                <v-img v-bind="props" :src="item.poster" :title="item.name" />
              </template>

              <v-btn block append-icon="mdi-information-outline" @click="() => showItemInformation(item)">详情</v-btn>
              <v-btn
                :href="item.url"
                append-icon="mdi-arrow-top-right-bold-box-outline"
                block
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                访问
              </v-btn>
            </v-menu>
          </div>

          <v-card-subtitle class="text-center my-1" style="white-space: normal">
            <a class="font-weight-bold my-2" :href="item.url" target="_blank" :title="item.name">
              {{ item.name }}
            </a>

            <div v-if="metadataStore.mediaServers[item.server]" class="d-flex justify-center align-center mt-1">
              <v-avatar
                :image="getMediaServerIcon(metadataStore.mediaServers[item.server].type)"
                :alt="metadataStore.mediaServers[item.server].name"
                size="x-small"
              />
              &nbsp; {{ metadataStore.mediaServers[item.server].name }}
            </div>
          </v-card-subtitle>
        </v-card>
      </div>
    </div>
    <v-row v-else>
      <v-col class="d-flex justify-center text-body-1"> No Items, use Search Input or Load More Button to Load </v-col>
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
            Load More
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
}

:deep(.masonry-img-overlay) {
  width: 80%;

  .v-btn + .v-btn {
    margin-top: 8px;
  }
}
</style>
