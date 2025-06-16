<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { convertIsoDurationToDate, type IImplicitUserInfo, type ILevelRequirement, IUserInfo } from "@ptd/site";

import { formatDate } from "@/options/utils.ts";

import UserLevelsComponent from "./UserLevelsComponent.vue";

const {
  nextLevelUnMet,
  userInfo,
  showNextLevelName = true,
  iconClass = "mr-3",
} = defineProps<{
  nextLevelUnMet: Array<Partial<IImplicitUserInfo & { level?: ILevelRequirement }>>;
  userInfo: IUserInfo;
  showNextLevelName?: boolean;
  iconClass?: string;
}>();

const currentTime = +new Date();

const { t } = useI18n();
</script>

<template>
  <!-- 计算剩余升级情况，每个条件分行显示 -->
  <template v-for="(levelUnMet, index) in nextLevelUnMet" :key="index">
    <v-icon icon="mdi-keyboard-tab" color="orange" size="small" :class="iconClass" />

    <span v-if="showNextLevelName && levelUnMet.level">{{ levelUnMet.level.name }}:&nbsp;</span>

    <template v-if="levelUnMet.level && levelUnMet.interval">
      <v-icon :title="t('levelRequirement.interval')" icon="mdi-calendar-check-outline" size="small" />
      {{
        formatDate(convertIsoDurationToDate(levelUnMet.level.interval!, userInfo.joinTime ?? currentTime), "yyyy-MM-dd")
      }}
    </template>

    <UserLevelsComponent :level-requirement="levelUnMet" />

    <br v-if="index < nextLevelUnMet.length - 1" />
  </template>
</template>

<style scoped lang="scss"></style>
