<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { IImplicitUserInfo, isoDuration } from "@ptd/site";
import { formatNumber, formatSize } from "@/options/utils.ts";

const { levelRequirement } = defineProps<{
  levelRequirement: IImplicitUserInfo;
}>();

const { t } = useI18n();

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
  <template v-if="levelRequirement.interval">
    <v-icon size="small" icon="mdi-calendar-clock" :title="t('levelRequirement.interval')" />
    {{ formatDuration(levelRequirement.interval) }};
  </template>
  <template v-if="levelRequirement.uploaded">
    <v-icon size="small" color="green-darken-4" icon="mdi-chevron-up" :title="t('levelRequirement.uploaded')" />
    {{ formatSize(levelRequirement.uploaded) }};
  </template>
  <template v-if="levelRequirement.trueUploaded">
    <v-icon
      size="small"
      color="green-darken-4"
      icon="mdi-chevron-double-up"
      :title="t('levelRequirement.trueUploaded')"
    />
    {{ formatSize(levelRequirement.trueUploaded) }};
  </template>
  <template v-if="levelRequirement.downloaded">
    <v-icon size="small" color="red-darken-4" icon="mdi-chevron-down" :title="t('levelRequirement.downloaded')" />
    {{ formatSize(levelRequirement.downloaded) }};
  </template>
  <template v-if="levelRequirement.trueDownloaded">
    <v-icon
      size="small"
      color="red-darken-4"
      icon="mdi-chevron-double-down"
      :title="t('levelRequirement.trueDownloaded')"
    />
    {{ formatSize(levelRequirement.trueDownloaded) }};
  </template>

  <template v-if="levelRequirement.totalTraffic">
    <v-icon size="small" color="orange-darken-4" icon="mdi-swap-vertical" :title="t('levelRequirement.totalTraffic')" />
    {{ formatSize(levelRequirement.totalTraffic) }};
  </template>

  <template v-if="levelRequirement.ratio">
    <v-icon size="small" color="orange-darken-4" icon="mdi-scale-balance" :title="t('levelRequirement.ratio')" />
    {{ levelRequirement.ratio }};
  </template>

  <template v-if="levelRequirement.trueRatio">
    <v-icon size="small" color="orange-darken-4" icon="mdi-scale" :title="t('levelRequirement.trueRatio')" />
    {{ levelRequirement.trueRatio }};
  </template>

  <template v-if="levelRequirement.seeding">
    <v-icon size="small" color="green-darken-4" icon="mdi-sprout" :title="t('levelRequirement.seeding')" />
    {{ formatNumber(levelRequirement.seeding, { minimumFractionDigits: 0 }) }};
  </template>

  <template v-if="levelRequirement.seedingSize">
    <v-icon size="small" color="blue-darken-4" icon="mdi-dns" :title="t('levelRequirement.seedingSize')" />
    {{ formatSize(levelRequirement.seedingSize) }};
  </template>

  <template v-if="levelRequirement.seedingTime">
    <v-icon size="small" color="green-darken-4" icon="mdi-timer" :title="t('levelRequirement.seedingTime')" />
    {{ formatDuration(levelRequirement.seedingTime) }};
  </template>

  <template v-if="levelRequirement.averageSeedtime">
    <v-icon size="small" color="blue-darken-4" icon="mdi-timer" :title="t('levelRequirement.averageSeedtime')" />
    {{ formatDuration(levelRequirement.averageSeedtime) }};
  </template>

  <template v-if="levelRequirement.bonus">
    <v-icon size="small" color="green-darken-4" icon="mdi-currency-usd" :title="t('levelRequirement.bonus')" />
    {{ formatNumber(levelRequirement.bonus) }};
  </template>

  <template v-if="levelRequirement.seedingBonus">
    <v-icon
      size="small"
      color="green-darken-4"
      icon="mdi-lightning-bolt-circle"
      :title="t('levelRequirement.seedingBonus')"
    />
    {{ formatNumber(levelRequirement.seedingBonus) }};
  </template>

  <template v-if="levelRequirement.bonusPerHour">
    <v-icon size="small" color="green-darken-4" icon="mdi-leaf" :title="t('levelRequirement.bonusPerHour')" />
    {{ formatNumber(levelRequirement.bonusPerHour) }};
  </template>

  <template v-if="levelRequirement.uploads">
    <v-icon size="small" color="green-darken-4" icon="mdi-file-upload" :title="t('levelRequirement.uploads')" />
    {{ formatNumber(levelRequirement.uploads, { minimumFractionDigits: 0 }) }};
  </template>

  <template v-if="levelRequirement.leeching">
    <v-icon size="small" color="red-darken-4" icon="mdi-file-download" :title="t('levelRequirement.leeching')" />
    {{ formatNumber(levelRequirement.leeching, { minimumFractionDigits: 0 }) }};
  </template>

  <template v-if="levelRequirement.snatches">
    <v-icon size="small" color="orange-darken-4" icon="mdi-file-check" :title="t('levelRequirement.snatches')" />
    {{ formatNumber(levelRequirement.snatches, { minimumFractionDigits: 0 }) }};
  </template>

  <template v-if="levelRequirement.posts">
    <v-icon small color="green darken-4" icon="mdi-note-plus" :title="t('levelRequirement.posts')" />
    {{ formatNumber(levelRequirement.posts, { minimumFractionDigits: 0 }) }};
  </template>
</template>

<style scoped lang="scss"></style>
