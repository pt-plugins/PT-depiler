<script setup lang="ts">
import { nanoid } from "nanoid";
import { watch, ref } from "vue";
import { cloneDeep } from "es-toolkit";
import { find } from "es-toolkit/compat";

import type { ISearchSolution, ISearchSolutionMetadata, TSolutionKey } from "@/storage.ts";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import { formValidateRules } from "@/options/utils.ts";

import SolutionLabel from "./SolutionLabel.vue";
import SiteCategoryPanel from "./SiteCategoryPanel.vue";
import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";

const showDialog = defineModel<boolean>();
const solutionId = defineModel<TSolutionKey>("solutionId");

const initSolution = () =>
  ({
    id: nanoid(),
    name: "",
    sort: 1,
    enabled: true,
    isDefault: false,
    createdAt: Date.now(),
    solutions: [],
  }) as ISearchSolutionMetadata;

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

const solution = ref<ISearchSolutionMetadata>(initSolution());
const formValid = ref<boolean>(false);

watch(showDialog, (newVal, oldVal) => {
  if (newVal) {
    let storedSolution = metadataStore.solutions[solutionId.value!];
    if (!storedSolution) {
      storedSolution = initSolution();
    }

    solution.value = cloneDeep(storedSolution);
  } else {
    solution.value = initSolution();
  }
});

function addSolution(addSolution: ISearchSolution) {
  // 基于 siteId 和 selectedCategories 判断是否已存在，如果存在则不添加
  if (
    find(solution.value.solutions, { siteId: addSolution.siteId, selectedCategories: addSolution.selectedCategories })
  ) {
    runtimeStore.showSnakebar("已存在相同的搜索方案，无法重复添加", { color: "error" });
    return;
  }

  solution.value.solutions.push(addSolution);
}

function removeSolution(removeSolution: ISearchSolution) {
  solution.value.solutions = solution.value.solutions.filter((x) => x.id !== removeSolution.id);
}

function saveSolutionState() {
  metadataStore.addSearchSolution(solution.value);
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
        <v-form v-model="formValid">
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
                <v-expansion-panel
                  v-for="site in metadataStore.getAddedSiteIds"
                  :disabled="!!metadataStore.sites[site].isOffline || !metadataStore.sites[site].allowSearch"
                  :id="site"
                >
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
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          {{ $t("common.dialog.cancel") }}
        </v-btn>
        <v-btn
          variant="text"
          color="success"
          @click="saveSolutionState"
          :disabled="!formValid || solution.solutions.length === 0"
        >
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
