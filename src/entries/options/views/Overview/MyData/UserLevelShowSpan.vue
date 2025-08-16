<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  IImplicitUserInfo,
  isoDuration,
  convertIsoDurationToDate,
  convertSecondsToIsoDuration,
  type IUserInfo,
} from "@ptd/site";
import { formatNumber, formatSize, formatDate, simplifyNumber } from "@/options/utils";
import { useConfigStore } from "@/options/stores/config";

const {
  userInfo,
  levelRequirement,
  hideRatioInTable = false,
  useJoinTimeAsRef = false,
} = defineProps<{
  userInfo: IUserInfo;
  levelRequirement: IImplicitUserInfo;
  hideRatioInTable?: boolean;
  useJoinTimeAsRef?: boolean; // 在 formatIntervalDate 中是否使用 joinTime 作为参考时间，默认参考为 currentTime
}>();

const { t } = useI18n();
const configStore = useConfigStore();
const currentTime = +new Date();

// Toggle function for double-click
function toggleIntervalDisplay() {
  configStore.myDataTableControl.showIntervalAsDate = !configStore.myDataTableControl.showIntervalAsDate;
}

// Toggle function for double-click to switch number simplification
function toggleNumberSimplification() {
  configStore.myDataTableControl.simplifyBonusNumbers = !configStore.myDataTableControl.simplifyBonusNumbers;
}

// Get interval display text and title
function getIntervalDisplay(interval: number | isoDuration) {
  const showAsDate = configStore.myDataTableControl.showIntervalAsDate;
  const durationText = formatDuration(interval);
  const dateText = formatIntervalDate(interval);

  return {
    text: showAsDate ? dateText : durationText,
    title: showAsDate ? durationText : dateText,
  };
}

function formatDuration(duration: number | isoDuration) {
  try {
    if (typeof duration === "number") {
      // 如果是秒数，先转换为ISO duration格式再显示
      const isoDurationStr = convertSecondsToIsoDuration(duration);
      return isoDurationStr.substring(1);
    } else {
      if (duration === "P") return "0D"; // 修正：如果 duration 只有 P，返回 0D
      return duration.substring(1);
    }
  } catch (e) {
    console.error("Error formatting duration:", duration, e);
    return "";
  }
}

function formatIntervalDate(duration: number | isoDuration): string {
  try {
    // 展示剩余时间时，基于 current 计算；展现等级要求时，基于 joinTime 计算
    const refTime = useJoinTimeAsRef ? (userInfo.joinTime ?? currentTime) : currentTime;
    if (typeof duration === "number") {
      // 如果是数字（秒）
      const targetDate = new Date(refTime + duration * 1000);
      const result = formatDate(targetDate, "yyyy-MM-dd");
      return typeof result === "string" ? result : "";
    } else {
      // 如果是isoDuration字符串
      const result = formatDate(convertIsoDurationToDate(duration, refTime), "yyyy-MM-dd");
      return typeof result === "string" ? result : "";
    }
  } catch (e) {
    console.error("Error formatting interval date:", duration, e);
    return "";
  }
}
</script>

<template>
  <slot name="prepend"></slot>
  <template v-if="levelRequirement.interval">
    <v-icon :title="t('levelRequirement.interval')" icon="mdi-calendar-clock" size="small" />
    <span
      :title="getIntervalDisplay(levelRequirement.interval).title"
      @dblclick="toggleIntervalDisplay"
      style="cursor: pointer; user-select: none"
    >
      {{ getIntervalDisplay(levelRequirement.interval).text }} </span
    >;
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

  <template v-if="levelRequirement.ratio && !hideRatioInTable">
    <v-icon :title="t('levelRequirement.ratio')" color="orange-darken-4" icon="mdi-scale-balance" size="small" />
    {{ levelRequirement.ratio }};
  </template>

  <template v-if="levelRequirement.trueRatio && !hideRatioInTable">
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
    <span
      :title="formatNumber(levelRequirement.bonus)"
      @dblclick="toggleNumberSimplification"
      style="cursor: pointer; user-select: none"
      >{{
        (configStore.myDataTableControl.simplifyBonusNumbers
          ? simplifyNumber(levelRequirement.bonus)
          : formatNumber(levelRequirement.bonus)) +
        (levelRequirement.bonusNeededInterval ? ` (${levelRequirement.bonusNeededInterval})` : "")
      }}</span
    >;
  </template>

  <template v-if="levelRequirement.seedingBonus">
    <v-icon
      :title="t('levelRequirement.seedingBonus')"
      color="green-darken-4"
      icon="mdi-lightning-bolt-circle"
      size="small"
    />
    <span
      :title="formatNumber(levelRequirement.seedingBonus)"
      @dblclick="toggleNumberSimplification"
      style="cursor: pointer; user-select: none"
      >{{
        (configStore.myDataTableControl.simplifyBonusNumbers
          ? simplifyNumber(levelRequirement.seedingBonus)
          : formatNumber(levelRequirement.seedingBonus)) +
        (levelRequirement.seedingBonusNeededInterval ? ` (${levelRequirement.seedingBonusNeededInterval})` : "")
      }}</span
    >;
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
