<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { isEmpty } from "es-toolkit/compat";
import type { ISearchCategories } from "@ptd/site";
import type { ISearchSolution } from "@/storage.ts";

import { useMetadataStore } from "@/options/stores/metadata.ts";

const props = defineProps<{
  solution: ISearchSolution;
}>();

const metadataStore = useMetadataStore();

const siteMetaCategory = computedAsync(async () => {
  return (await metadataStore.getSiteMergedMetadata(props.solution.siteId, "category")) as ISearchCategories[];
}, []);

function getCategory(key: string) {
  return siteMetaCategory.value.find((x) => x.key === key) ?? { key, name: key, options: [] };
}

function getCategoryName(key: string) {
  return getCategory(key)?.name ?? key;
}

function getCategoryOptionName(key: string, value: string | number | (string | number)[]) {
  const options = getCategory(key)?.options ?? [];
  if (Array.isArray(value)) {
    return value.map((v) => options.find((o) => o.value === v)?.name ?? v).join(", ");
  } else {
    return options.find((o) => o.value === value)?.name ?? value;
  }
}
</script>

<template>
  <template v-if="solution">
    <template v-if="isEmpty(solution.selectedCategories)">默认</template>
    <template v-else>
      <span v-for="(value, category) in solution.selectedCategories" :key="category">
        {{ getCategoryName(category) }}: {{ getCategoryOptionName(category, value) }};&nbsp;
      </span>
    </template>
  </template>
  <template v-else>Unknown</template>
</template>

<style scoped lang="scss"></style>
