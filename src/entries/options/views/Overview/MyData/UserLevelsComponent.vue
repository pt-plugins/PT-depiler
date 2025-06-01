<script setup lang="ts">
import { type ILevelRequirement } from "@ptd/site";

import UserLevelShowSpan from "./UserLevelShowSpan.vue";

const { levelRequirement } = defineProps<{
  levelRequirement: Omit<ILevelRequirement, "id" | "name">;
}>();
</script>

<template>
  <UserLevelShowSpan :level-requirement="levelRequirement" />
  <template v-if="levelRequirement.alternative">
    <v-icon icon="mdi-file-table-box-multiple-outline" size="small" />
    (
    <template v-for="(alternative, key) in levelRequirement.alternative" :key="key">
      [ <UserLevelShowSpan :level-requirement="alternative" /> ]
    </template>
    )
  </template>
</template>

<style scoped lang="scss"></style>
