<script setup lang="ts">
import { type ISearchTorrent } from "@/shared/store/site.ts";
import { ETorrentStatus } from "@ptd/site";

const prop = defineProps<{
  torrent: ISearchTorrent;
}>();

function progressIcon(status: ETorrentStatus = ETorrentStatus.unknown) {
  let result = "mdi-arrow-up-bold";

  switch (status) {
    case ETorrentStatus.downloading:
      result = "mdi-arrow-down-bold";
      break;

    case ETorrentStatus.completed:
      result = "mdi-check-bold";
      break;

    case ETorrentStatus.inactive:
      result = "mdi-wifi-off";
      break;
  }

  return result;
}

function progressColor(status: ETorrentStatus = ETorrentStatus.unknown) {
  let result = "success";
  switch (status) {
    case ETorrentStatus.downloading:
      result = "info";
      break;

    case ETorrentStatus.completed:
    case ETorrentStatus.inactive:
      result = "grey";
      break;
  }

  return result;
}
</script>

<template>
  <v-row no-gutters class="align-center" style="line-height: 8px">
    <v-col :cols="3">
      <v-icon
        size="x-small"
        :icon="progressIcon(prop.torrent.status)"
        :color="progressColor(prop.torrent.status)"
      ></v-icon>
    </v-col>
    <v-col :cols="9">
      <v-progress-linear
        v-model="prop.torrent.progress"
        :color="progressColor(prop.torrent.status)"
        :title="`${prop.torrent.progress}%`"
      ></v-progress-linear>
    </v-col>
  </v-row>
</template>

<style scoped></style>
