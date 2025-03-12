<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useSiteStore } from "@/options/stores/site.ts";
import { ESearchResultParseStatus } from "@ptd/site";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";
import { doSearchEntity, raiseSearchPriority } from "@/options/views/Overview/searchEntity/utils.ts";

const componentProps = defineProps<{
  modelValue: boolean;
}>();
const showDialog = useVModel(componentProps);

const runtimeStore = useRuntimeStore();
const siteStore = useSiteStore();

const StatusMap: Record<ESearchResultParseStatus, string> = {
  [ESearchResultParseStatus.unknownError]: "未知错误！",
  [ESearchResultParseStatus.waiting]: "队列等待中...",
  [ESearchResultParseStatus.working]: "正在搜索中...",
  [ESearchResultParseStatus.success]: "搜索成功！",
  [ESearchResultParseStatus.parseError]: "解析错误",
  [ESearchResultParseStatus.passSearch]: "未启用搜索！",
  [ESearchResultParseStatus.needLogin]: "需要登录！",
  [ESearchResultParseStatus.noResults]: "无结果！",
};
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey darken-2">
          <v-toolbar-title>
            方案 [{{ siteStore.getSearchSolutionName(runtimeStore.search.searchPlanKey) }}] 搜索状态
          </v-toolbar-title>
          <v-spacer />
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
              <SiteName :site-id="searchPlan.siteId" :class="['text-decoration-none', 'text-black']" />
              -
              <span><{{ searchPlan.searchEntryName }}></span>
            </v-list-item-title>
            <template #append>
              <span class="text-subtitle-2 text-end">
                {{ StatusMap[searchPlan.status] }}
                <template v-if="searchPlan.status === ESearchResultParseStatus.success">
                  <br />
                  <span class="text-end">
                    共找到 {{ searchPlan.count }} 条结果，用时 {{ (searchPlan.costTime ?? 0) / 1000 }}s
                  </span>
                </template>
              </span>
              <v-divider vertical class="mx-2" />
              <v-btn-group variant="text" size="small">
                <!-- TODO 上移队列 -->
                <v-btn
                  v-if="searchPlan.status === ESearchResultParseStatus.waiting"
                  color="warning"
                  icon="mdi-arrow-collapse-up"
                  @click="() => raiseSearchPriority(solutionKey)"
                >
                </v-btn>
                <!-- TODO 重新搜索 -->
                <v-btn
                  v-else
                  icon="mdi-cached"
                  color="red"
                  :loading="searchPlan.status === ESearchResultParseStatus.working"
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
