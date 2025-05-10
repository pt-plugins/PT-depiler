<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { getMediaServer } from "@ptd/mediaServer";
import { formatSize } from "@/options/utils.ts";

const { t } = useI18n();
const route = useRoute();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const search = ref<string>((route.query.search as string) || "");

async function doSearch() {
  runtimeStore.resetMediaServerSearchData();
  runtimeStore.mediaServerSearch.isSearching = true;

  // TODO move to offscreen
  const enabledMediaServers = metadataStore.getEnabledMediaServers;
  for (const enabledMediaServer of enabledMediaServers) {
    const mediaServer = await getMediaServer(enabledMediaServer);
    const searchResult = await mediaServer.getSearchResult(search.value);
    runtimeStore.mediaServerSearch.searchStatus[enabledMediaServer.id] = searchResult.status;
    runtimeStore.mediaServerSearch.searchResult.push(...searchResult.items); // TODO uniq
  }

  runtimeStore.mediaServerSearch.isSearching = false;
}

function secondsToISO8601(seconds: number) {
  seconds = Math.abs(seconds);

  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;

  let minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60); // 取整秒数

  let duration = "P";

  // 仅在有天数时添加
  if (hours >= 24) {
    let days = Math.floor(hours / 24);
    duration += `${days}D`;
    hours %= 24;
  }

  // 如果有小时、分钟或秒，添加T分隔符
  if (hours > 0 || minutes > 0 || seconds > 0) {
    duration += "T";

    if (hours > 0) duration += `${hours}H`;
    if (minutes > 0) duration += `${minutes}M`;
    if (seconds > 0) duration += `${seconds}S`;
  }

  return duration;
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
          placeholder="在启用的媒体服务器中批量搜索"
          @keyup.enter="doSearch"
        />
      </v-row>
    </v-card-title>

    <!-- FIXME 改成瀑布流形式 -->
    <v-row>
      <v-col v-for="(item, index) in runtimeStore.mediaServerSearch.searchResult" :key="item.url" cols="2" class="pa-2">
        <v-card>
          <v-img :src="item.poster" :alt="item.name" />
          <v-card-title class="text-center">
            <a class="text-no-wrap text-ellipsis text-truncate" :href="item.url" target="_blank" :title="item.name">
              {{ item.name }}
            </a>
          </v-card-title>
          <v-card-subtitle>
            <v-chip-group>
              <!-- 封装格式 -->
              <v-chip v-if="item.format" label base-color="light-blue" size="x-small" prepend-icon="mdi-aspect-ratio">
                {{ item.format?.toUpperCase() }}
              </v-chip>

              <!-- 时长 -->
              <v-chip v-if="item.duration" label base-color="indigo" size="x-small" prepend-icon="mdi-clock-time-four">
                {{ secondsToISO8601(item.duration) }}
              </v-chip>

              <!-- 大小 -->
              <v-chip v-if="item.size" label size="x-small">{{ formatSize(item.size ?? 0) }}</v-chip>

              <v-chip
                v-if="item.streams && item.streams.filter((s) => s.type === 'Video')!.length > 0"
                base-color="blue"
                label
                prepend-icon="mdi-movie"
                size="x-small"
              >
                {{ item.streams.filter((s) => s.type === "Video")[0].title }}
              </v-chip>

              <v-chip
                v-if="item.streams && item.streams.filter((s) => s.type === 'Audio')!.length > 0"
                base-color="blue"
                label
                prepend-icon="mdi-expansion-card"
                size="x-small"
              >
                {{ item.streams.filter((s) => s.type === "Audio").length }}
              </v-chip>

              <v-chip
                v-if="item.streams && item.streams.filter((s) => s.type === 'Subtitle')!.length > 0"
                base-color="blue"
                label
                prepend-icon="mdi-closed-caption"
                size="x-small"
              >
                {{ item.streams.filter((s) => s.type === "Subtitle").length }}
              </v-chip>
            </v-chip-group>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss"></style>
