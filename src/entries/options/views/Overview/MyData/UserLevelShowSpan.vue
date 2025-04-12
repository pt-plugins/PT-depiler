<script setup lang="ts">
import { IImplicitUserInfo, isoDuration } from "@ptd/site";
import { formatNumber, formatSize } from "@/options/utils.ts";

const { levelRequirement } = defineProps<{
  levelRequirement: IImplicitUserInfo;
}>();

function formatDuration(duration: number | isoDuration) {
  if (typeof duration === "number") {
    return `${duration / 86400}D`;
  } else {
    return duration.substring(1);
  }
}
</script>

<template>
  <slot name="perpend"></slot>
  <!-- TODO i18n -->
  <template v-if="levelRequirement.uploaded">
    <v-icon size="small" color="green-darken-4" icon="mdi-chevron-up" />
    {{ formatSize(levelRequirement.uploaded) }};
  </template>
  <template v-if="levelRequirement.trueUploaded">
    <v-icon size="small" color="green-darken-4" icon="mdi-chevron-double-up" />
    {{ formatSize(levelRequirement.trueUploaded) }};
  </template>
  <template v-if="levelRequirement.downloaded">
    <v-icon size="small" color="red-darken-4" icon="mdi-chevron-down" />
    {{ formatSize(levelRequirement.downloaded) }};
  </template>
  <template v-if="levelRequirement.trueDownloaded">
    <v-icon size="small" color="red-darken-4" icon="mdi-chevron-double-down" />
    {{ formatSize(levelRequirement.trueDownloaded) }};
  </template>

  <template v-if="levelRequirement.totalTraffic">
    <v-icon size="small" color="orange-darken-4" icon="mdi-swap-vertical" />
    {{ formatSize(levelRequirement.totalTraffic) }};
  </template>

  <template v-if="levelRequirement.ratio">
    <v-icon size="small" color="orange-darken-4" icon="mdi-scale-balance" />
    {{ levelRequirement.ratio }};
  </template>

  <template v-if="levelRequirement.trueRatio">
    <v-icon size="small" color="orange-darken-4" icon="mdi-scale" />
    {{ levelRequirement.trueRatio }};
  </template>

  <template v-if="levelRequirement.seeding">
    <v-icon size="small" color="green-darken-4" icon="mdi-sprout" />
    {{ formatNumber(levelRequirement.seeding) }};
  </template>

  <template v-if="levelRequirement.seedingSize">
    <v-icon size="small" color="blue-darken-4" icon="mdi-dns" />
    {{ formatSize(levelRequirement.seedingSize) }};
  </template>

  <template v-if="levelRequirement.seedingTime">
    <v-icon size="small" color="green-darken-4" icon="mdi-timer" />
    {{ formatDuration(levelRequirement.seedingTime) }};
  </template>

  <template v-if="levelRequirement.averageSeedtime">
    <v-icon size="small" color="blue-darken-4" icon="mdi-timer" />
    {{ formatDuration(levelRequirement.averageSeedtime) }};
  </template>

  <template v-if="levelRequirement.bonus">
    <v-icon size="small" color="green-darken-4" icon="mdi-currency-usd" />
    {{ formatNumber(levelRequirement.bonus) }};
  </template>

  <template v-if="levelRequirement.seedingBonus">
    <v-icon size="small" color="green-darken-4" icon="mdi-lightning-bolt-circle" />
    {{ formatNumber(levelRequirement.seedingBonus) }};
  </template>

  <template v-if="levelRequirement.bonusPerHour">
    <v-icon size="small" color="green-darken-4" icon="mdi-leaf" />
    {{ formatNumber(levelRequirement.bonusPerHour) }};
  </template>

  <template v-if="levelRequirement.uploads">
    <v-icon size="small" color="green-darken-4" icon="mdi-file-upload" />
    {{ formatNumber(levelRequirement.uploads) }};
  </template>

  <template v-if="levelRequirement.leeching">
    <v-icon size="small" color="red-darken-4" icon="mdi-file-download" />
    {{ formatNumber(levelRequirement.leeching) }};
  </template>

  <template v-if="levelRequirement.snatches">
    <v-icon size="small" color="orange-darken-4" icon="mdi-file-check" />
    {{ formatNumber(levelRequirement.snatches) }};
  </template>

  <template v-if="levelRequirement.posts">
    <v-icon small color="green darken-4" icon="mdi-note-plus" />
    {{ formatNumber(levelRequirement.posts) }};
  </template>
</template>

<style scoped lang="scss"></style>
