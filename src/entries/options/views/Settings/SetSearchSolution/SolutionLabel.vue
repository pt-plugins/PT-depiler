<script setup lang="ts">
import type { ISearchSolution } from "@/storage.ts";

import SolutionDetail from "@/options/components/SolutionDetail.vue";
import SiteName from "@/options/components/SiteName.vue";

const props = withDefaults(
  defineProps<{
    solutions: ISearchSolution[];
    closable?: boolean;
  }>(),
  {
    closable: true,
  },
);

const emit = defineEmits(["remove:solution"]);

function removeSolution(solution: ISearchSolution) {
  emit("remove:solution", solution);
}
</script>

<template>
  <div class="pt-1">
    <v-chip
      v-for="solution in props.solutions"
      :key="solution.id"
      :closable="props.closable"
      class="mb-1 mr-1"
      label
      size="small"
      @click:close="() => removeSolution(solution)"
    >
      <SiteName :site-id="solution.siteId" :class="['text-black']" />&nbsp;->&nbsp;
      <SolutionDetail :solution="solution" />
    </v-chip>
  </div>
</template>

<style scoped lang="scss"></style>
