<script setup lang="ts">
import { ISearchSolution } from "@/shared/storages/site.ts";
import SiteName from "@/options/components/SiteName.vue";
import { computedAsync } from "@vueuse/core";
import { useSiteStore } from "@/options/stores/site.ts";
import { ISearchCategories, TSiteID } from "@ptd/site";

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

const siteStore = useSiteStore();

function removeSolution(solution: ISearchSolution) {
  emit("remove:solution", solution);
}

const siteMetaCategories = computedAsync(async () => {
  const retSiteMetaCategories: Record<TSiteID, ISearchCategories[]> = {};
  const siteIds = new Set(props.solutions.map((x) => x.siteId));
  for (const siteId of siteIds) {
    retSiteMetaCategories[siteId] = (await siteStore.getSiteMergedMetadata(siteId, "category")) as ISearchCategories[];
  }
  return retSiteMetaCategories;
}, {});

function getCategoryName(siteId: TSiteID, key: string) {
  return siteMetaCategories.value[siteId]?.find((x) => x.key === key)?.name ?? key;
}

function getCategoryOptionName(siteId: TSiteID, key: string, value: string | number | string[] | number[]) {
  const options = siteMetaCategories.value[siteId]?.find((x) => x.key === key)?.options ?? [];
  if (Array.isArray(value)) {
    return value.map((v) => options.find((o) => o.value === v)?.name ?? v).join(", ");
  } else {
    return options.find((o) => o.value === value)?.name ?? value;
  }
}
</script>

<template>
  <v-chip
    v-for="solution in props.solutions"
    @click:close="() => removeSolution(solution)"
    :closable="props.closable"
    :key="solution.id"
    class="mb-1 mr-1"
    label
    size="small"
  >
    <SiteName :site-id="solution.siteId" :class="['text-black']" />&nbsp;->&nbsp;
    <span v-for="(value, category) in solution.selectedCategories" :key="category">
      {{ getCategoryName(solution.siteId, category) }}:
      {{ getCategoryOptionName(solution.siteId, category, value) }};&nbsp;
    </span>
  </v-chip>
</template>

<style scoped lang="scss"></style>
