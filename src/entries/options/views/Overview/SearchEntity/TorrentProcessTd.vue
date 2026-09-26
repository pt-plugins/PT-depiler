<script setup lang="ts">
import { computed } from "vue";
import { ETorrentStatus } from "@ptd/site";

import { ISearchResultTorrent } from "@/shared/types.ts";

const { torrent } = defineProps<{
  torrent: ISearchResultTorrent;
}>();

const icon = computed(() => {
  switch (torrent.status) {
    case ETorrentStatus.downloading:
      return "mdi-arrow-down";

    case ETorrentStatus.completed:
      return "mdi-check";

    case ETorrentStatus.inactive:
      return "mdi-wifi-strength-off";

    case ETorrentStatus.seeding:
    default:
      return "mdi-arrow-up";
  }
});

const color = computed(() => {
  switch (torrent.status) {
    case ETorrentStatus.downloading:
      return "info";

    case ETorrentStatus.completed:
    case ETorrentStatus.inactive:
      return "grey";

    case ETorrentStatus.seeding:
    default:
      return "success";
  }
});
</script>

<template>
  <!--
    Vuetify 4 的 v-row 改用 flex gap（默认 24px）、v-col 不再带 padding：
    - gap="0" 让 cols="2" 的图标列恢复宽度、图标与进度条保持紧凑；
    - align-center 让 4px 高的进度条与图标垂直居中（v3 是靠 v-col 的 12px padding 达到同样效果），
      否则进度条会贴在行首、完成对勾看起来偏低（#1554）。
  -->
  <v-row gap="0" class="align-center pt-1">
    <v-col class="pa-0" cols="2">
      <v-icon :color="color" :icon="icon" size="x-small"></v-icon>
    </v-col>
    <v-col class="pl-1">
      <v-progress-linear v-model="torrent.progress!" :color="color" :title="`${torrent.progress}%`"></v-progress-linear>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
