<script setup lang="ts">
import { EResultParseStatus } from "@ptd/site";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import { doSearchEntity, raiseSearchPriority } from "@/options/views/Overview/SearchEntity/utils.ts";

import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";
import SolutionDetail from "@/options/components/SolutionDetail.vue";
import ResultParseStatus from "@/options/components/ResultParseStatus.vue";

const showDialog = defineModel<boolean>();

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
            方案 [{{ metadataStore.getSearchSolutionName(runtimeStore.search.searchPlanKey) }}] 搜索状态 <br />
            <p class="text-caption"><{{ runtimeStore.search.searchPlanKey }}></p>
          </v-toolbar-title>

          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false"> </v-btn>
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
              <SiteName
                :class="['text-decoration-none', 'font-weight-bold', 'text-black']"
                :site-id="searchPlan.siteId"
                tag="span"
              />
              ->
              <span v-if="searchPlan.searchEntry.name">
                {{ searchPlan.searchEntry.name }}
              </span>
              <span v-else-if="runtimeStore.search.searchPlanKey === 'all'">
                {{ searchPlan.searchEntry.name ?? searchPlan.searchEntryName }}
              </span>
              <span v-else>
                <SolutionDetail
                  :solution="getSearchSolution(runtimeStore.search.searchPlanKey, searchPlan.searchEntryName)"
                />
              </span>
              <br />
              <span class="text-subtitle-2 text-grey"> <{{ searchPlan.searchEntryName }}> </span>
            </v-list-item-title>
            <template #append>
              <span class="text-subtitle-2 text-end">
                <ResultParseStatus :status="searchPlan.status" />
                <template v-if="searchPlan.status === EResultParseStatus.success">
                  <br />
                  <span class="text-end">
                    共找到 {{ searchPlan.count }} 条结果，用时 {{ (searchPlan.costTime ?? 0) / 1000 }}s
                  </span>
                </template>
              </span>
              <v-divider class="mx-2" vertical />
              <v-btn-group size="small" variant="text">
                <!-- 上移队列 -->
                <v-btn
                  v-if="searchPlan.status === EResultParseStatus.waiting"
                  color="warning"
                  icon="mdi-arrow-collapse-up"
                  @click="() => raiseSearchPriority(solutionKey)"
                >
                </v-btn>
                <!-- 重新搜索 -->
                <v-btn
                  v-else
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
