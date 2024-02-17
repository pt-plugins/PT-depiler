<script setup lang="ts">

import { computedAsync, useVModels } from "@vueuse/core";
import { type storedSearchSolution, useSiteStore } from "@/shared/store/site";
import SiteSPExpansionPanel from "@/options/components/Settings/setSearchSolution/siteSPExpansionPanel.vue";
import { reactive, ref } from "vue";
import TypeAndSchemaChip from "@/options/views/Settings/setSite/TypeAndSchemaChip.vue";
import SolutionLabels from "@/options/components/Settings/setSearchSolution/SolutionLabels.vue";
import { ISiteRuntimeConfig } from "@/shared/adapters/site";
import { ISearchParamsMap } from "@ptd/site";

const componentProps = defineProps<{
  modelValue: boolean,
  solution?: storedSearchSolution
}>();

const {
  modelValue: showDialog,
  solution
} = useVModels(componentProps);

const siteStore = useSiteStore();
const preAddMap = reactive({});
const siteSearchRef = ref("");

const sites = computedAsync(async () => {
  siteSearchRef.value;  // Important: make siteSearchRef as a computed dep before any await!
  let sites = await siteStore.getSites();
  if (siteSearchRef.value !== "") {
    sites = sites.filter((site) => {
      const siteIdentity = [site.id, site.url, site.host];
      if (site.aka?.length > 0) {
        siteIdentity.push(...site.aka);
      }

      return siteIdentity.join("|").includes(siteSearchRef.value);
    });
  }

  sites.forEach(site => preAddMap[site.id] = {});
  return sites;
}, []);

function perAddSiteSearchSolution(site: ISiteRuntimeConfig) {
  const planFilter: ISearchParamsMap = JSON.parse(JSON.stringify(preAddMap[site.id]));
  Object.entries(planFilter).forEach(([key, value]) => {
    if (Array.isArray(value) && (value as any[]).length === 0) {
      delete planFilter[key];
    }
  });

  solution?.value?.plan.push({
    site: site.id,
    filters: planFilter,
  });
}

</script>


<template>
  <v-dialog v-model="showDialog" fullscreen>
    <v-card>
      {{ solution }}
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey darken-2">
          <v-toolbar-title>自定义搜索模式</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field v-model="solution.name" :label="$t('common.name')" autofocus />
          </v-col>
          <v-col>
            <v-text-field v-model="solution.id" label="ID" disabled />
          </v-col>
          <v-col>
            <v-text-field
              v-model="solution.sort" :label="$t('common.sortIndex')"
              type="number"
              min="0" max="100"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-text-field v-model="siteSearchRef" append-inner-icon="mdi-magnify" />
            {{ preAddMap }}
            <v-expansion-panels>
              <v-expansion-panel
                v-for="site in sites"
                :key="site.id"
                :value="site.id"
              >
                <v-expansion-panel-title>
                  {{ site.name }}
                  <TypeAndSchemaChip
                    :site="site" direction="row"
                    class="ml-3"
                    :full-width="false"
                  />
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-col>
                    <SiteSPExpansionPanel v-model="preAddMap[site.id]" :categories="site.search.categories" />
                  </v-col>
                  <v-col>
                    <v-btn @click="() => perAddSiteSearchSolution(site)">
                      添加
                    </v-btn>
                  </v-col>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="4">
            <SolutionLabels :solution="solution" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        sadfasdf
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
