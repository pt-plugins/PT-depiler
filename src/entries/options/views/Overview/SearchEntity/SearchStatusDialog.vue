<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { EResultParseStatus } from "@ptd/site";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import SiteName from "@/options/components/SiteName.vue";
import SolutionDetail from "@/options/components/SolutionDetail.vue";
import ResultParseStatus from "@/options/components/ResultParseStatus.vue";

import { doSearchEntity, raiseSearchPriority } from "./utils/search.ts";

const showDialog = defineModel<boolean>();

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

function getSearchSolution(planKey: string, entryName: string) {
  return metadataStore.solutions[planKey]?.solutions.find((x) => x.id === entryName)!;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>
            {{
              t("SearchEntity.SearchStatusDialog.title", [
                metadataStore.getSearchSolutionName(runtimeStore.search.searchPlanKey),
              ])
            }}
            <br />
            <p class="text-caption"><{{ runtimeStore.search.searchPlanKey }}></p>
          </v-toolbar-title>

          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-list>
          <v-list-item v-for="(searchPlan, solutionKey) in runtimeStore.search.searchPlan">
            <template #prepend>
              <SiteFavicon :site-id="searchPlan.siteId" class="mr-2" />
            </template>
            <v-list-item-title>
              <div class="d-inline-flex">
                <SiteName
                  :class="['text-decoration-none', 'font-weight-bold', 'text-black']"
                  :site-id="searchPlan.siteId"
                  tag="span"
                />
                ->
                <span v-if="searchPlan.searchEntry.name">
                  {{ searchPlan.searchEntry.name }}
                </span>
                <span
                  v-else-if="
                    runtimeStore.search.searchPlanKey === 'all' || runtimeStore.search.searchPlanKey.startsWith('site:')
                  "
                >
                  {{ searchPlan.searchEntry.name ?? searchPlan.searchEntryName }}
                </span>
                <span v-else>
                  <SolutionDetail
                    :solution="getSearchSolution(runtimeStore.search.searchPlanKey, searchPlan.searchEntryName)"
                  />
                </span>
              </div>
              <br />
              <span class="text-subtitle-2 text-grey"> <{{ searchPlan.searchEntryName }}> </span>
            </v-list-item-title>
            <template #append>
              <span class="text-subtitle-2 text-end">
                <ResultParseStatus :status="searchPlan.status" />
                <template v-if="searchPlan.status === EResultParseStatus.success">
                  <br />
                  <span class="text-end">
                    {{
                      t("SearchEntity.SearchStatusDialog.successMsg", [
                        searchPlan.count,
                        (searchPlan.costTime ?? 0) / 1000,
                      ])
                    }}
                  </span>
                </template>
                <template v-else-if="searchPlan.statusMsg">
                  <br />
                  <span class="text-end">
                    {{
                      searchPlan.statusMsg.startsWith("i18n.")
                        ? t("SearchEntity.SearchStatusDialog.statusMsg" + searchPlan.statusMsg.replace("i18n.", "."))
                        : searchPlan.statusMsg
                    }}
                  </span>
                </template>
              </span>
              <v-divider class="mx-2" vertical />
              <v-btn-group size="small" variant="text">
                <!-- 上移队列 -->
                <v-btn
                  v-if="searchPlan.status === EResultParseStatus.waiting"
                  :title="t('SearchEntity.SearchStatusDialog.moveUp')"
                  color="warning"
                  icon="mdi-arrow-collapse-up"
                  @click="() => raiseSearchPriority(solutionKey)"
                >
                </v-btn>
                <!-- 重新搜索 -->
                <v-btn
                  v-else
                  :title="t('SearchEntity.SearchStatusDialog.searchAgain')"
                  :loading="searchPlan.status === EResultParseStatus.working"
                  color="red"
                  icon="mdi-cached"
                  @click="
                    () => doSearchEntity(searchPlan.siteId, searchPlan.searchEntryName, searchPlan.searchEntry, true)
                  "
                ></v-btn>
              </v-btn-group>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
