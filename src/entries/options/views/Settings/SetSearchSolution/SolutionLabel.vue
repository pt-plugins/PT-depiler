<script setup lang="ts">
import type { ISearchSolution } from "@/storage.ts";

import SolutionDetail from "@/options/components/SolutionDetail.vue";
import SiteName from "@/options/components/SiteName.vue";

const {
  solutions,
  closable = true,
  groupProps = {},
} = defineProps<{
  solutions: ISearchSolution[];
  closable?: boolean;
  groupProps?: any;
}>();

const emit = defineEmits(["remove:solution"]);

function removeSolution(solution: ISearchSolution) {
  emit("remove:solution", solution);
}
</script>

<template>
  <div class="pt-1">
    <v-chip-group v-bind="groupProps">
      <v-chip v-for="solution in solutions" :key="solution.id" class="mb-1 mr-1 h-auto py-1" label size="small">
        <template #prepend>
          <v-icon v-if="closable" class="mr-1" icon="$delete" @click="() => removeSolution(solution)" />
        </template>

        <SiteName :class="['text-black']" :site-id="solution.siteId" tag="span" />&nbsp;->&nbsp;
        <SolutionDetail :solution="solution" />
      </v-chip>
    </v-chip-group>
  </div>
</template>

<style scoped lang="scss"></style>
