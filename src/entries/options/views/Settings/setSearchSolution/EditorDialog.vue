<script setup lang="ts">
import {ref} from "vue";
import {computedAsync, useVModels} from "@vueuse/core";

import SolutionLabels from "./SolutionLabels.vue";
import SiteSPExpansionPanel from "./siteSPExpansionPanel.vue";
import TypeAndSchemaChip from "../setSite/TypeAndSchemaChip.vue";

import {siteFavicons, type storedSearchSolution, useSiteStore} from "@/shared/store/site.ts";
import type {VForm} from "vuetify/components/VForm";
import {formValidateRules} from "@/options/utils.ts";
import {nanoid} from "nanoid";

const componentProps = defineProps<{
  modelValue: boolean,
  solution: storedSearchSolution
}>();

const {
  modelValue: showDialog,
  solution
} = useVModels(componentProps);

const siteStore = useSiteStore();
const siteSearchRef = ref("");
const formRef = ref<VForm>();

const sites = computedAsync(async () => {
  siteSearchRef.value;  // Important: make siteSearchRef as a computed dep before any await!
  let sites = await siteStore.getSites();
  if (siteSearchRef.value !== "") {
    sites = sites.filter((site) => {
      const siteIdentity = [site.id, site.url, site.host];
      if (site.aka && site.aka.length > 0) {
        siteIdentity.push(...site.aka);
      }

      return siteIdentity.join("|").includes(siteSearchRef.value);
    });
  }
  return sites;
}, []);

function saveSearchSolution() {
  solution.value.id ||= nanoid();
  const saveSolution = {...solution.value} as Required<storedSearchSolution>;
  siteStore.searchSolutions[saveSolution.id] = saveSolution;
  siteStore.$save();
  showDialog.value = false;
}
</script>


<template>
  <v-form ref="formRef" fast-fail>
    <v-dialog v-model="showDialog" fullscreen>
      <v-card>
        <v-card-title class="pa-0">
          <v-toolbar color="blue-grey darken-2"
                     title="自定义搜索模式"
          >
            <template #append>
              <v-btn
                icon="mdi-close"
                @click="showDialog = false"
              >
              </v-btn>
            </template>
          </v-toolbar>

        </v-card-title>
        <v-divider/>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="solution.name"
                :label="$t('common.name')"
                autofocus
                :rules="[formValidateRules.require()]"
                required
              />
            </v-col>
            <v-col>
              <v-text-field v-model="solution.id" label="ID" disabled/>
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
              <v-text-field v-model="siteSearchRef" append-inner-icon="mdi-magnify" prepend-icon="mdi-sitemap"/>
              <v-expansion-panels>
                <v-expansion-panel
                  v-for="site in sites"
                  :key="site.id"
                  :value="site.id"
                >
                  <v-expansion-panel-title>
                    <v-avatar size="x-small" :image="siteFavicons[site.id] || ''" class="mr-3"/>
                    {{ site.name }}
                    <TypeAndSchemaChip
                      :site="site" direction="row"
                      class="ml-3"
                      :full-width="false"
                    />
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <SiteSPExpansionPanel :site="site" :solution="solution"/>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
            <v-col cols="4">
              <p class="text-h4 pa-2">已添加方案{{ solution.plan.length }}个</p>
              <SolutionLabels :solution="solution" :enableClose="true" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="success"
            :disabled="solution.plan.length <= 0"
            @click="saveSearchSolution"
          >
            <v-icon icon="mdi-check-circle-outline" />
            {{ $t('common.dialog.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </v-form>
</template>

<style scoped>

</style>
