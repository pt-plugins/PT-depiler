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
    <v-icon :title="t('levelRequirement.interval')" icon="mdi-calendar-clock" size="small" />
    {{ formatDuration(levelRequirement.interval) }};
  </template>
  <template v-if="levelRequirement.uploaded">
    <v-icon :title="t('levelRequirement.uploaded')" color="green-darken-4" icon="mdi-chevron-up" size="small" />
    {{ formatSize(levelRequirement.uploaded) }};
  </template>
  <template v-if="levelRequirement.trueUploaded">
    <v-icon
      :title="t('levelRequirement.trueUploaded')"
      color="green-darken-4"
      icon="mdi-chevron-double-up"
      size="small"
    />
    {{ formatSize(levelRequirement.trueUploaded) }};
  </template>
  <template v-if="levelRequirement.downloaded">
    <v-icon :title="t('levelRequirement.downloaded')" color="red-darken-4" icon="mdi-chevron-down" size="small" />
    {{ formatSize(levelRequirement.downloaded) }};
  </template>
  <template v-if="levelRequirement.trueDownloaded">
    <v-icon
      :title="t('levelRequirement.trueDownloaded')"
      color="red-darken-4"
      icon="mdi-chevron-double-down"
      size="small"
    />
    {{ formatSize(levelRequirement.trueDownloaded) }};
  </template>

  <template v-if="levelRequirement.totalTraffic">
    <v-icon :title="t('levelRequirement.totalTraffic')" color="orange-darken-4" icon="mdi-swap-vertical" size="small" />
    {{ formatSize(levelRequirement.totalTraffic) }};
  </template>

  <template v-if="levelRequirement.ratio">
    <v-icon :title="t('levelRequirement.ratio')" color="orange-darken-4" icon="mdi-scale-balance" size="small" />
    {{ levelRequirement.ratio }};
  </template>

  <template v-if="levelRequirement.trueRatio">
    <v-icon :title="t('levelRequirement.trueRatio')" color="orange-darken-4" icon="mdi-scale" size="small" />
    {{ levelRequirement.trueRatio }};
  </template>

  <template v-if="levelRequirement.seeding">
    <v-icon :title="t('levelRequirement.seeding')" color="green-darken-4" icon="mdi-sprout" size="small" />
    {{ formatNumber(levelRequirement.seeding, { minimumFractionDigits: 0 }) }};
  </template>

  <template v-if="levelRequirement.seedingSize">
    <v-icon :title="t('levelRequirement.seedingSize')" color="blue-darken-4" icon="mdi-dns" size="small" />
    {{ formatSize(levelRequirement.seedingSize) }};
  </template>

  <template v-if="levelRequirement.seedingTime">
    <v-icon :title="t('levelRequirement.seedingTime')" color="green-darken-4" icon="mdi-timer" size="small" />
    {{ formatDuration(levelRequirement.seedingTime) }};
  </template>

  <template v-if="levelRequirement.averageSeedtime">
    <v-icon :title="t('levelRequirement.averageSeedtime')" color="blue-darken-4" icon="mdi-timer" size="small" />
    {{ formatDuration(levelRequirement.averageSeedtime) }};
  </template>

  <template v-if="levelRequirement.bonus">
    <v-icon :title="t('levelRequirement.bonus')" color="green-darken-4" icon="mdi-currency-usd" size="small" />
    {{ formatNumber(levelRequirement.bonus) }};
  </template>

  <template v-if="levelRequirement.seedingBonus">
    <v-icon
      :title="t('levelRequirement.seedingBonus')"
      color="green-darken-4"
      icon="mdi-lightning-bolt-circle"
      size="small"
    />
    {{ formatNumber(levelRequirement.seedingBonus) }};
  </template>

  <template v-if="levelRequirement.bonusPerHour">
    <v-icon :title="t('levelRequirement.bonusPerHour')" color="green-darken-4" icon="mdi-leaf" size="small" />
    {{ formatNumber(levelRequirement.bonusPerHour) }};
  </template>

  <template v-if="levelRequirement.uploads">
    <v-icon :title="t('levelRequirement.uploads')" color="green-darken-4" icon="mdi-file-upload" size="small" />
    {{ formatNumber(levelRequirement.uploads, { minimumFractionDigits: 0 }) }};
  </template>

  <template v-if="levelRequirement.leeching">
    <v-icon :title="t('levelRequirement.leeching')" color="red-darken-4" icon="mdi-file-download" size="small" />
    {{ formatNumber(levelRequirement.leeching, { minimumFractionDigits: 0 }) }};
  </template>

  <template v-if="levelRequirement.snatches">
    <v-icon :title="t('levelRequirement.snatches')" color="orange-darken-4" icon="mdi-file-check" size="small" />
    {{ formatNumber(levelRequirement.snatches, { minimumFractionDigits: 0 }) }};
  </template>

  <template v-if="levelRequirement.posts">
    <v-icon :title="t('levelRequirement.posts')" color="green darken-4" icon="mdi-note-plus" small />
    {{ formatNumber(levelRequirement.posts, { minimumFractionDigits: 0 }) }};
  </template>
</template>

<style scoped lang="scss"></style>
