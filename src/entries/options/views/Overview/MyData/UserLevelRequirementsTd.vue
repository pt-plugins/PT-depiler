<script setup lang="ts">
import {
  convertIsoDurationToDate,
  getNextLevelUnMet,
  guessUserLevelGroupType,
  IUserInfo,
  TLevelGroupType,
} from "@ptd/site";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { computedAsync } from "@vueuse/core";

import { computed } from "vue";
import { formatDate } from "../../../utils.ts";
import UserLevelShowSpan from "@/options/views/Overview/MyData/UserLevelShowSpan.vue";
import { isEmpty } from "es-toolkit/compat";

const { userInfo } = defineProps<{
  userInfo: IUserInfo;
}>();

const currentTime = +new Date();

const metadataStore = useMetadataStore();

const userLevelRequirements = computedAsync(() => {
  return metadataStore.getSiteMergedMetadata(userInfo.site, "levelRequirements");
}, []);

const matchedLevelRequirements = computed(() => {
  return userLevelRequirements.value?.find((r) => r.id === userInfo.levelId);
});

const nextLevelUnMet = computed(() => getNextLevelUnMet(userInfo, userLevelRequirements.value!));

const userLevelGroupType = computedAsync(() => {
  // 首先尝试从 matchedLevelRequirements 中找到对应的等级组
  if (matchedLevelRequirements.value?.groupType) {
    return matchedLevelRequirements.value.groupType;
  }

  // 如果还是没有，则考虑从用户等级名中猜测
  return guessUserLevelGroupType(userInfo.levelName ?? "user");
}, "user");

const userLevelGroupIconMap: Record<TLevelGroupType, string> = {
  user: "mdi-account-hard-hat",
  vip: "mdi-check-decagram",
  manager: "mdi-account-cog",
};

const userLevelGroupIcon = computed(() => {
  return userLevelGroupIconMap[userLevelGroupType.value] || userLevelGroupIconMap.user;
});
</script>

<template>
  <span v-if="userInfo.levelName" class="text-no-wrap">
    <v-tooltip
      v-if="userLevelRequirements && userLevelRequirements.length > 0"
      location="bottom left"
      content-class="bg-white pa-0"
      interactive
    >
      <template v-slot:activator="{ props }">
        <span v-bind="props" class="ml-1">
          <v-icon :icon="userLevelGroupIcon" size="16"></v-icon>
          {{ matchedLevelRequirements?.name ?? userInfo.levelName }}
        </span>
      </template>

      <template v-slot>
        <v-card class="border-sm">
          <v-card-text class="pa-2">
            <template v-if="!isEmpty(nextLevelUnMet)">
              <!-- 计算剩余升级情况 -->
            </template>
            <ul>
              <li v-for="userLevel in userLevelRequirements" :key="userLevel.id">
                <v-icon
                  :icon="userLevel.id <= (userInfo.levelId ?? -1) ? 'mdi-check' : 'mdi-block-helper'"
                  :color="userLevel.id <= (userInfo.levelId ?? -1) ? 'green' : 'red'"
                  size="small"
                />
                <span v-if="userLevel.interval">
                  {{
                    formatDate(
                      convertIsoDurationToDate(userLevel.interval, userInfo.joinTime ?? currentTime),
                      "yyyy-MM-dd",
                    )
                  }}
                </span>
                <span>&nbsp;({{ userLevel.name }}):</span>
                <UserLevelShowSpan :level-requirement="userLevel" />
                <template v-if="userLevel.alternative">
                  <v-icon size="small" icon="mdi-file-table-box-multiple-outline" />
                  (
                  <template v-for="(alternative, key) in userLevel.alternative" :key="key">
                    [ <UserLevelShowSpan :level-requirement="alternative" /> ]
                  </template>
                  )
                </template>
                {{ userLevel.privilege ?? "" }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </template>
    </v-tooltip>
    <span v-else>
      <v-icon :icon="userLevelGroupIcon" size="16"></v-icon>
      {{ matchedLevelRequirements?.name ?? userInfo.levelName }}
    </span>
  </span>

  <!-- 信息还没获取 -->
  <template v-else>-</template>
</template>

<style scoped lang="scss"></style>
