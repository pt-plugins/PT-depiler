<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {ISearchCategories, type ISearchParamsMap} from "@ptd/site";
import {useVModel} from "@vueuse/core";
import {ISiteRuntimeConfig} from "@/shared/adapters/site.ts";
import type {storedSearchSolution} from "@/shared/store/site.ts";
import {find} from "lodash-es";

const componentProps = defineProps<{
  solution: storedSearchSolution,
  site: ISiteRuntimeConfig
}>();

const solutionRef = useVModel(componentProps, "solution");
const showPanel = ref<any[]>([]);

const siteCategories = computed(() => componentProps.site.search?.categories || [])

const preAddMap = ref<ISearchParamsMap>({});

function initSitePreAddMap() {
  preAddMap.value = {};
  siteCategories.value.forEach((category, index) => {
    const definedSp = (preAddMap.value[category.key] ??= (category.cross ? [] : category.options[0].value));
    if (Array.isArray(definedSp) && definedSp.length > 0) {
      showPanel.value.push(index);
    }
  });
}

onMounted(() => {
  initSitePreAddMap();
});

function checkBtnIndeterminate(category: ISearchCategories): boolean {
  const field = preAddMap.value[category.key];
  if (Array.isArray(field)) {
    return field.length !== category.options.length;
  }
  return false;
}

function clickAllBtn(field: ISearchCategories, toggle: boolean) {
  let fieldSp: any = [];
  if (toggle) {
    fieldSp = toggle ? field.options.map(sp => sp.value) : [];
  }

  preAddMap.value[field.key] = fieldSp;
}

function perAddSiteSearchSolution(site: ISiteRuntimeConfig) {
  const planFilter = {...preAddMap.value} as ISearchParamsMap;
  Object.entries(planFilter).forEach(([key, value]) => {
    if (Array.isArray(value) && (value as any[]).length === 0) {
      delete planFilter[key];
    }
  });

  const addSearchSolution = {
    site: site.id,
    filters: planFilter,
  };

  if (!find(solutionRef.value.plan, addSearchSolution)) {
    solutionRef.value.plan.push({
      site: site.id,
      filters: planFilter,
    });
  }

  initSitePreAddMap();
}
</script>

<template>
  <v-col>
    <v-expansion-panels
      v-if="siteCategories.length > 0"
      v-model="showPanel"
      multiple
    >
      <v-expansion-panel v-for="category in siteCategories" :key="category.key">
        <v-expansion-panel-title>
          {{ category.name }}
          <v-spacer/>
          <v-chip label
                  :color="!category.cross?.mode || (Array.isArray(preAddMap[category.key]) && preAddMap[category.key].length > 0) ? 'info' : ''"
          >
            Key: {{ category.key }}
          </v-chip>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-container class="pa-0">
            <v-row v-if="category.cross?.mode" no-gutters>
              <v-col cols="12">
                <v-checkbox
                  :indeterminate="preAddMap[category.key]?.length > 0 && checkBtnIndeterminate(category)"
                  :model-value="!checkBtnIndeterminate(category)"
                  hide-details
                  @update:model-value="(e) => clickAllBtn(category, e as boolean)"
                >
                  <template #label>
                    <p class="font-weight-bold">
                      {{ $t('common.checkbox.all') }}
                    </p>
                    <p v-if="!checkBtnIndeterminate(category)" class="text-red-lighten-1">
                      &nbsp;{{ $t('setSite.spDialog.selectAllNotice') }}
                    </p>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <template v-if="category.cross?.mode">
                <v-col v-for="options in category.options" :key="options.value" cols="4">
                  <v-checkbox
                    v-model="preAddMap[category.key]"
                    :value="options.value"
                    :label="options.name"
                    hide-details
                  />
                </v-col>
              </template>
              <template v-else>
                <v-radio-group
                  v-model="preAddMap[category.key]"
                  class="justify-space-between"
                  hide-details
                  inline
                >
                  <v-radio
                    v-for="options in category.options" :key="options.value"
                    :value="options.value"
                    :label="options.name"
                  />
                </v-radio-group>
              </template>
            </v-row>
          </v-container>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-else>
      {{ $t('setSite.spDialog.noDefNotice') }}
    </div>
  </v-col>
  <v-col>
    <v-btn color="blue" @click="perAddSiteSearchSolution(site)">
      添加
    </v-btn>
  </v-col>


</template>

<style scoped>

</style>
