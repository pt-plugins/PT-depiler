<script setup lang="ts">
import { IUserInfo, TLevelGroupType } from "@ptd/site";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { computedAsync } from "@vueuse/core";
import { guessUserLevelGroupType } from "./utils.ts";
import { computed } from "vue";

const props = defineProps<{
  userInfo: IUserInfo;
}>();

const metadataStore = useMetadataStore();

const userLevelRequirements = computedAsync(() => {
  return metadataStore.getSiteMergedMetadata(props.userInfo.site, "levelRequirements");
}, []);

const matchedLevelRequirements = computed(() => {
  return userLevelRequirements.value?.find((r) => r.name === props.userInfo.levelName);
});

const userLevelGroupType = computedAsync(() => {
  // 首先尝试从 matchedLevelRequirements 中找到对应的等级组
  if (matchedLevelRequirements.value?.groupType) {
    return matchedLevelRequirements.value.groupType;
  }

  // 如果还是没有，则考虑从用户等级名中猜测
  return guessUserLevelGroupType(props.userInfo.levelName ?? "user");
}, "user");

const userLevelGroupIconMap: Record<TLevelGroupType, string> = {
  user: "mdi-check",
  vip: "mdi-check-decagram",
  manager: "mdi-account-cog",
};

const userLevelGroupIcon = computed(() => {
  return userLevelGroupIconMap[userLevelGroupType.value] || userLevelGroupIconMap.user;
});
</script>

<template>
  <span class="text-no-wrap">
    <v-icon :icon="userLevelGroupIcon" size="16"></v-icon>
    {{ props.userInfo.levelName }}
  </span>

  <!-- TODO 展示升级相关信息（这块逻辑没看懂2333） -->
</template>

<style scoped lang="scss"></style>
