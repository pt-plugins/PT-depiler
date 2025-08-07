<script setup lang="ts">
import { type ILevelRequirement } from "@ptd/site";

import UserLevelShowSpan from "./UserLevelShowSpan.vue";

const { levelRequirement, hideRatioInTable = false } = defineProps<{
  levelRequirement: Omit<ILevelRequirement, "id" | "name">;
  hideRatioInTable?: boolean;
}>();
</script>

<template>
  <UserLevelShowSpan :level-requirement="levelRequirement" :hide-ratio-in-table="hideRatioInTable" />
  <template v-if="levelRequirement.alternative">
    <v-icon icon="mdi-file-table-box-multiple-outline" size="small" />
    (
    <template v-for="(alternative, key) in levelRequirement.alternative" :key="key">
      [ <UserLevelShowSpan :level-requirement="alternative" :hide-ratio-in-table="hideRatioInTable" /> ]
    </template>
    )
  </template>
</template>

<style scoped lang="scss"></style>
