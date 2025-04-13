<script setup lang="ts">
import { nanoid } from "nanoid";
import { watch, ref } from "vue";
import { useI18n } from "vue-i18n";
import { cloneDeep } from "es-toolkit";
import { find } from "es-toolkit/compat";
import { computedAsync, refDebounced } from "@vueuse/core";

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

const { t } = useI18n();

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

const siteWaitFilter = ref("");
const siteFilter = refDebounced(siteWaitFilter, 500); // 延迟搜索过滤词的生成

const addedSiteInfo = computedAsync(() => {
  const promises = metadataStore.getAddedSiteIds.map(async (siteId) => ({
    siteId,
    siteName: await metadataStore.getSiteName(siteId),
    siteUrl: await metadataStore.getSiteUrl(siteId),
  }));
  return Promise.all(promises);
}, []);

const filteredSite = computedAsync(() => {
  const filter = siteFilter.value.toLowerCase();

  return addedSiteInfo.value
    .filter((item) => {
      const siteKey = [item.siteId, item.siteName, item.siteUrl]
        .filter(Boolean)
        .map((x: string) => x.toLowerCase())
        .join("|");
      return siteKey.includes(filter);
    })
    .map((item) => item.siteId);
}, []);

watch(showDialog, (newVal) => {
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
    runtimeStore.showSnakebar(t("SetSearchSolution.edit.cantAddByDuplicateNote"), { color: "error" });
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
        <v-toolbar :title="t('SetSearchSolution.edit.title')" color="blue-grey darken-2">
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
                :label="t('common.name')"
                :rules="[formValidateRules.require()]"
                autofocus
                required
              />
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="solution.id" disabled label="ID" />
            </v-col>
            <v-col cols="2">
              <v-text-field v-model="solution.sort" :label="t('common.sortIndex')" max="100" min="0" type="number" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="siteWaitFilter"
                :placeholder="t('SetSearchSolution.edit.filterPlaceholder')"
                append-inner-icon="mdi-magnify"
                clearable
                prepend-icon="mdi-sitemap"
              />

              <v-expansion-panels>
                <v-expansion-panel
                  v-for="site in filteredSite"
                  :id="site"
                  :disabled="!!metadataStore.sites[site].isOffline || !metadataStore.sites[site].allowSearch"
                >
                  <v-expansion-panel-title>
                    <SiteFavicon :site-id="site" class="mr-2" inline />

                    <v-chip color="green" label>
                      <SiteName :class="['text-no-wrap']" :site-id="site" />
                    </v-chip>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <SiteCategoryPanel :site-id="site" @update:solution="addSolution" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
            <v-col cols="12" md="4">
              <v-alert class="mb-2" type="success">
                <v-alert-title>
                  {{ t("SetSearchSolution.edit.addCount", [solution.solutions.length]) }}
                </v-alert-title>
              </v-alert>

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
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn
          :disabled="!formValid || solution.solutions.length === 0"
          color="success"
          variant="text"
          @click="saveSolutionState"
        >
          <v-icon icon="mdi-check-circle-outline" />
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
