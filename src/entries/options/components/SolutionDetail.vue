<script setup lang="ts">
import { onMounted, shallowRef } from "vue";
import { isEmpty } from "es-toolkit/compat";
import type { ISearchCategories } from "@ptd/site";

import type { ISearchSolution } from "@/shared/types.ts";

import {
  getCategoryName,
  getCategoryOptionName,
  getSiteMetaCategory,
} from "@/options/views/Settings/SetSearchSolution/utils.ts";

const props = defineProps<{
  solution: ISearchSolution;
}>();

const siteMetaCategory = shallowRef<ISearchCategories[]>([]);

onMounted(async () => {
  siteMetaCategory.value = await getSiteMetaCategory(props.solution.siteId);
});
</script>

<template>
  <div v-if="solution" class="text-wrap">
    <template v-if="solution.name">{{ solution.name }}</template>
    <template v-else-if="isEmpty(solution.selectedCategories)">默认</template>
    <template v-else>
      <span
        v-for="(value, category) in solution.selectedCategories"
        :key="category"
        :title="
          getCategoryName(siteMetaCategory, category) + ': ' + getCategoryOptionName(siteMetaCategory, category, value)
        "
      >
        <b>{{ getCategoryName(siteMetaCategory, category) }}</b> :
        {{ getCategoryOptionName(siteMetaCategory, category, value) }};&nbsp;
      </span>
    </template>
  </div>
  <template v-else>Unknown</template>
</template>

<style scoped lang="scss"></style>
