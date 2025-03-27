<script setup lang="ts">
import { useVModels } from "@vueuse/core";
import { ISearchSolution, ISearchSolutionState, TSolutionID } from "@/shared/storages/site.ts";
import { watch, ref } from "vue";
import { useSiteStore } from "@/options/stores/site";
import { cloneDeep } from "es-toolkit";
import { nanoid } from "nanoid";
import { formValidateRules } from "@/options/utils.ts";

import SiteCategoryPanel from "./SiteCategoryPanel.vue";
import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SolutionLabel from "@/options/views/Settings/SetSearchSolution/SolutionLabel.vue";

const props = defineProps<{
  modelValue: boolean;
  solutionId: TSolutionID;
}>();
const { modelValue: showDialog } = useVModels(props);

const initSolution = () =>
  ({
    id: nanoid(),
    name: "",
    sort: 1,
    createdAt: Date.now(),
    solutions: [],
  }) as ISearchSolutionState;

const siteStore = useSiteStore();
const solution = ref<ISearchSolutionState>(initSolution());

watch(props, (newVal, oldVal) => {
  if (newVal.modelValue) {
    let storedSolution = siteStore.solutions[newVal.solutionId];
    if (!storedSolution) {
      storedSolution = initSolution();
    }

    solution.value = cloneDeep(storedSolution);
  } else {
    solution.value = initSolution();
  }
});

function addSolution(addSolution: ISearchSolution) {
  // TODO 去重复
  solution.value.solutions.push(addSolution);
}

function removeSolution(removeSolution: ISearchSolution) {
  solution.value.solutions = solution.value.solutions.filter((x) => x.id !== removeSolution.id);
}

function saveSolutionState() {
  siteStore.addSearchSolution(solution.value);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" fullscreen>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey darken-2" title="自定义搜索模式">
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false"> </v-btn>
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              v-model="solution.name"
              :label="$t('common.name')"
              :rules="[formValidateRules.require()]"
              autofocus
              required
            />
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="solution.id" label="ID" disabled />
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="solution.sort" :label="$t('common.sortIndex')" type="number" min="0" max="100" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-text-field append-inner-icon="mdi-magnify" prepend-icon="mdi-sitemap" />

            <v-expansion-panels>
              <v-expansion-panel v-for="site in siteStore.getAddedSiteIds" :id="site">
                <v-expansion-panel-title>
                  <SiteFavicon :site-id="site" class="mr-2" inline />

                  <v-chip color="green" label>
                    <SiteName :site-id="site" :class="['text-no-wrap']" />
                  </v-chip>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <SiteCategoryPanel :site-id="site" @update:solution="addSolution" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="4">
            <p class="text-h4 pa-2">已添加方案{{ solution.solutions.length }}个</p>
            <SolutionLabel :solutions="solution.solutions" @remove:solution="removeSolution" closable />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          {{ $t("common.dialog.cancel") }}
        </v-btn>
        <v-btn variant="text" color="success" @click="saveSolutionState" :disabled="solution.solutions.length === 0">
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
