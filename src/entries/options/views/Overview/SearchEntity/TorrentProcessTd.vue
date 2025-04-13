<script setup lang="ts">
import { computed } from "vue";
import { ETorrentStatus } from "@ptd/site";
import { ISearchResultTorrent } from "@/shared/storages/types/runtime.ts";

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
  <v-row class="pt-1">
    <v-col class="pa-0" cols="2">
      <v-icon :color="color" :icon="icon" size="x-small"></v-icon>
    </v-col>
    <v-col class="pl-1">
      <v-progress-linear v-model="torrent.progress!" :color="color" :title="`${torrent.progress}%`"></v-progress-linear>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
