<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { getMediaServer, getMediaServerIcon, IMediaServerItem } from "@ptd/mediaServer";
import { formatSize } from "@/options/utils.ts";
import { TMediaServerKey } from "@/shared/storages/types/metadata.ts";
import ItemInformationDialog from "@/options/views/Overview/MediaServerEntity/ItemInformationDialog.vue";

const { t } = useI18n();
const route = useRoute();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const search = ref<string>((route.query.search as string) || "");
const searchMediaServerIds = ref<TMediaServerKey[]>(
  metadataStore.getEnabledMediaServers.map((mediaServer) => mediaServer.id) ?? [],
);

const showItem = ref<IMediaServerItem | null>(null);
const showItemInformationDialog = ref<boolean>(false);

function showItemInformation(item: IMediaServerItem) {
  showItem.value = item;
  showItemInformationDialog.value = true;
}

async function doSearch() {
  runtimeStore.resetMediaServerSearchData();
  runtimeStore.mediaServerSearch.isSearching = true;

  // TODO move to offscreen
  for (const enabledMediaServerId of searchMediaServerIds.value) {
    const enabledMediaServer = metadataStore.mediaServers[enabledMediaServerId];
    const mediaServer = await getMediaServer(enabledMediaServer);
    const searchResult = await mediaServer.getSearchResult(search.value ?? "");
    runtimeStore.mediaServerSearch.searchStatus[enabledMediaServer.id] = searchResult.status;

    for (const item of searchResult.items) {
      // 根据 url 去重
      const isDuplicate = runtimeStore.mediaServerSearch.searchResult.some((result) => result.url == item.url);
      if (!isDuplicate) {
        runtimeStore.mediaServerSearch.searchResult.push(item);
      }
    }
  }

  runtimeStore.mediaServerSearch.isSearching = false;
}

onMounted(async () => {
  // noinspection ES6MissingAwait
  doSearch();
});
</script>

<template>
  <v-alert :title="t('route.Overview.MediaServerEntity')" type="info" />
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          max-width="500"
          single-line
          placeholder="在媒体服务器中搜索"
          @keyup.enter="doSearch"
          @click:append="doSearch"
        />
      </v-row>
    </v-card-title>

    <!--  瀑布流形式展示媒体服务器搜索结果 -->
    <div class="masonry-grid">
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

    <!-- TODO 点击加载更多 -->
    <v-container>
      <v-row>
        <v-col class="d-flex justify-center">
          <v-btn>Load More</v-btn>
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
