<script setup lang="ts">
import { formatDate } from "@/options/utils.ts";
import { convertIsoDurationToDate, type IImplicitUserInfo, type ILevelRequirement, IUserInfo } from "@ptd/site";
import UserLevelsComponent from "./UserLevelsComponent.vue";
import { useI18n } from "vue-i18n";

const {
  nextLevelUnMet,
  userInfo,
  showNextLevelName = true,
  iconClass = "mr-3",
} = defineProps<{
  nextLevelUnMet: Partial<IImplicitUserInfo & { level?: ILevelRequirement }>;
  userInfo: IUserInfo;
  showNextLevelName?: boolean;
  iconClass?: string;
}>();

const currentTime = +new Date();

const { t } = useI18n();
</script>

<template>
  <!-- 计算剩余升级情况 -->
  <v-icon icon="mdi-keyboard-tab" color="orange" size="small" :class="iconClass" />

  <span v-if="showNextLevelName && nextLevelUnMet.level">{{ nextLevelUnMet.level.name }}:&nbsp;</span>

  <template v-if="nextLevelUnMet.level && nextLevelUnMet.interval">
    <v-icon :title="t('levelRequirement.interval')" icon="mdi-calendar-check-outline" size="small" />
    {{
      formatDate(
        convertIsoDurationToDate(nextLevelUnMet.level.interval!, userInfo.joinTime ?? currentTime),
        "yyyy-MM-dd",
      )
    }}
  </template>

  <UserLevelsComponent :level-requirement="nextLevelUnMet" />
</template>

<style scoped lang="scss"></style>
