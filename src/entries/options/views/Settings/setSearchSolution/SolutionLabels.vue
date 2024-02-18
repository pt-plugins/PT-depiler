<script setup lang="ts">
import {searchPlan, storedSearchSolution} from "@/shared/store/site.ts";
import {getSiteConfig} from "@/shared/adapters/site.ts";
import {ISearchCategories, ISearchCategoryOptions} from "@ptd/site";
import {computedAsync, useVModel} from "@vueuse/core";
import {remove} from "lodash-es";

const props = defineProps<{
  solution: storedSearchSolution,
  enableClose?: boolean
}>();

type IExpandSearchPlan =
  searchPlan &
  {
    siteName: string,
    namedFilter: Array<{ cat: ISearchCategories, transFilter: ISearchCategoryOptions[] }>
  }

const solution = useVModel(props, "solution")

const expandPlans = computedAsync(async () => {
  const retSolutions = [];
  for (const plan of solution.value.plan) {
    const siteConfig = await getSiteConfig(plan.site);
    const namedFilter = Object.entries(plan.filters).map(([key, value]) => {
      const cat = siteConfig.search?.categories?.find(x => x.key == key)!;

      const transFilter: ISearchCategoryOptions[] = cat.options.filter(opt => {
        if (Array.isArray(value)) {
          return (value as Array<string | number>).includes(opt.value);
        } else {
          return opt.value === value;
        }
      });

      return {cat, transFilter};
    });

    retSolutions.push({...plan, siteName: siteConfig.name, namedFilter});
  }
  return retSolutions as unknown as IExpandSearchPlan[];
}, [])

function closeChip(expandPlan: searchPlan) {
  if (props.enableClose) {
    remove(solution.value.plan, {site: expandPlan.site, filters: {...expandPlan.filters}})
  }
}
</script>

<template>
  <v-chip-group column>
    <v-chip
      v-for="(expandPlan, index) in expandPlans" :key="index"
      label
      :closable="enableClose"
      @click:close="() => closeChip(expandPlan)"
    >
      {{ expandPlan.siteName }} ->
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
