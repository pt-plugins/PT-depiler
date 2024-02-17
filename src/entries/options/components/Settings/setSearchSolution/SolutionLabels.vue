<script setup lang="ts">
import { storedSearchSolution } from "@/shared/store/site";
import { getSiteConfig, ISiteRuntimeConfig } from "@/shared/adapters/site";
import { ISearchCategories, ISearchCategoryOptions } from "@ptd/site";
import { ref, watch } from "vue";

const props = defineProps<{
  solution: Pick<storedSearchSolution, "plan">,
}>();

type IExpandSolution =
  storedSearchSolution &
  {
    site: ISiteRuntimeConfig,
    namedFilter: Array<{cat: ISearchCategories, transFilter: ISearchCategoryOptions[]}>,
    $raw: storedSearchSolution
  }

const expandPlans = ref<IExpandSolution[]>([]);

watch(props.solution.plan, async () => {
  const retSolutions = [];
  for (const solution of props.solution.plan) {
    const site = await getSiteConfig(solution.site);
    const namedFilter = Object.entries(solution.filters).map(([key, value]) => {
      const cat: ISearchCategories = site.search?.categories?.find(x => x.key == key);

      const transFilter: ISearchCategoryOptions[] = cat.options.filter(opt => {
        if (Array.isArray(value)) {
          return (value as Array<string | number>).includes(opt.value);
        } else {
          return opt.value === value;
        }
      });

      return {cat, transFilter};
    });

    retSolutions.push({...solution, site, namedFilter});
  }

  expandPlans.value = retSolutions;
});
console.log(expandPlans);
</script>

<template>
  {{ solution }}
  <v-chip-group column>
    <v-chip
      v-for="(expandPlan, index) in expandPlans" :key="index"
      label
      closable
    >
      {{ expandPlan.site.name }} ->
      <template v-if="expandPlan.namedFilter.length === 0">
        {{ $t('common.default') }}
      </template>
      <template v-else>
        <template v-for="filter in expandPlan.namedFilter">
          {{ filter.cat.name }}: {{ filter.transFilter.map(x => x.name) }};&nbsp;
        </template>
      </template>
    </v-chip>
  </v-chip-group>
</template>

<style scoped>

</style>
