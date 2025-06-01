<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { isEmpty } from "es-toolkit/compat";
import type { ISearchCategories } from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { ISearchSolution } from "@/shared/types.ts";

const props = defineProps<{
  solution: ISearchSolution;
}>();

const metadataStore = useMetadataStore();

const siteMetaCategory = computedAsync(async () => {
  return (await metadataStore.getSiteMergedMetadata(props.solution.siteId, "category", [])) as ISearchCategories[];
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
  <div v-if="solution" class="text-wrap">
    <template v-if="isEmpty(solution.selectedCategories)">默认</template>
    <template v-else>
      <span
        v-for="(value, category) in solution.selectedCategories"
        :key="category"
        :title="getCategoryName(category) + ': ' + getCategoryOptionName(category, value)"
      >
        <b>{{ getCategoryName(category) }}</b> : {{ getCategoryOptionName(category, value) }};&nbsp;
      </span>
    </template>
  </div>
  <template v-else>Unknown</template>
</template>

<style scoped lang="scss"></style>
