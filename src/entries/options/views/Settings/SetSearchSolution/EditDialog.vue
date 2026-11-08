<script setup lang="ts">
import { nanoid } from "nanoid";
import { ref, computed, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { cloneDeep, isEqual } from "es-toolkit";
import { find, isEmpty } from "es-toolkit/compat";
import { refDebounced } from "@vueuse/core";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { ISearchSolution, ISearchSolutionMetadata, TSolutionKey } from "@/shared/types.ts";

import SolutionLabel from "./SolutionLabel.vue";
import SiteCategoryPanel from "./SiteCategoryPanel.vue";
import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";

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

const addedSiteInfo = shallowRef<Array<{ siteId: string; isDead: boolean; siteName: string; siteUrl: string }>>([]);

// 每个站点在当前方案右侧已添加的方案数（同一站点允许以不同参数多次添加）
const addedCountBySite = computed<Record<string, number>>(() => {
  const counts: Record<string, number> = {};
  for (const s of solution.value.solutions) {
    counts[s.siteId] = (counts[s.siteId] ?? 0) + 1;
  }
  return counts;
});

// 已添加次数排序：asc（未添加在前）-> desc（添加多的在前）-> 无（保持默认次序）循环切换
type TAddedCountSort = "asc" | "desc" | null;
const addedCountSort = ref<TAddedCountSort>(null);

// 左侧站点面板的展开状态（受控）。以 siteId 为 value，避免 Vuetify 组默认的
// 「按索引取值」在列表重排 / 计数变化导致节点重建时错位——那会让别的站点的
// 展开状态被错误地落到相邻面板上（#1679 反馈的「添加后上一个站点自动展开」bug）。
const openSitePanels = ref<string[]>([]);

function cycleAddedCountSort() {
  addedCountSort.value = addedCountSort.value === null ? "asc" : addedCountSort.value === "asc" ? "desc" : null;
}

const filteredSite = computed(() => {
  const filter = (siteFilter.value ?? "").toLowerCase();

  const sites = addedSiteInfo.value
    .filter((item) => {
      const siteKey = [item.siteId, item.siteName, item.siteUrl]
        .filter(Boolean)
        .map((x: string) => x.toLowerCase())
        .join("|");
      return siteKey.includes(filter);
    })
    .map((item) => item.siteId);

  if (addedCountSort.value) {
    // 按已添加次数排序；次数相同时保持原有顺序（稳定排序）
    const dir = addedCountSort.value === "asc" ? 1 : -1;
    sites.sort((a, b) => ((addedCountBySite.value[a] ?? 0) - (addedCountBySite.value[b] ?? 0)) * dir);
  }
  return sites;
});

// 同一个筛选词也作用于右侧已添加方案列表：按站点 id / 名称 / URL 匹配（与左侧口径一致）
const filteredSolutions = computed(() => {
  const filter = (siteFilter.value ?? "").toLowerCase();
  if (!filter) return solution.value.solutions;
  return solution.value.solutions.filter((item) => {
    const meta = metadataStore.sites[item.siteId];
    const siteKey = [item.siteId, meta?.name, meta?.url]
      .filter(Boolean)
      .map((x: string) => x.toLowerCase())
      .join("|");
    return siteKey.includes(filter);
  });
});

function addSolution(addSolution: ISearchSolution) {
  // 基于 siteId 和 selectedCategories / name 判断是否已存在，如果存在则不添加
  if (
    find(solution.value.solutions, (item) => {
      return (
        item.siteId === addSolution.siteId &&
        ((!isEmpty(item.selectedCategories) && isEqual(item.selectedCategories, addSolution.selectedCategories)) ||
          (typeof item.name !== "undefined" && item.name === addSolution.name))
      );
    })
  ) {
    runtimeStore.showSnackbar(t("SetSearchSolution.edit.cantAddByDuplicateNote"), { color: "error" });
    return;
  }

  solution.value.solutions.push(addSolution);
}

function removeSolution(removeSolution: ISearchSolution) {
  solution.value.solutions = solution.value.solutions.filter(
    (x) => !(x.id == removeSolution.id && x.siteId == removeSolution.siteId),
  );
}

function saveSolutionState() {
  metadataStore.addSearchSolution(solution.value);
  showDialog.value = false;
}

function dialogEnter() {
  siteWaitFilter.value = ""; // 进入时清空筛选词，避免上次残留影响左右两侧显示
  // 生成站点列表
  Promise.all(
    metadataStore.getAddedSiteIds
      .sort((a, b) => Number(metadataStore.sites[b].allowSearch) - Number(metadataStore.sites[a].allowSearch))
      .map(async (siteId) => ({
        siteId,
        isDead: (await metadataStore.getSiteMergedMetadata(siteId, "isDead")) ?? false,
        siteName: await metadataStore.getSiteName(siteId),
        siteUrl: await metadataStore.getSiteUrl(siteId),
      })),
  ).then((siteInfos) => {
    addedSiteInfo.value = siteInfos.filter((site) => !site.isDead);
  });

  let storedSolution = metadataStore.solutions[solutionId.value!];
  if (!storedSolution) {
    storedSolution = initSolution();
  }

  solution.value = cloneDeep(storedSolution);
}

function dialogLeave() {
  solution.value = initSolution();
  openSitePanels.value = []; // 受控展开状态需在关闭时复位，避免下次打开残留
}
</script>

<template>
  <v-dialog v-model="showDialog" fullscreen @after-enter="dialogEnter" @after-leave="dialogLeave">
    <v-card class="overflow-y-auto">
      <v-card-title class="pa-0">
        <v-toolbar :title="t('SetSearchSolution.edit.title')" color="blue-grey-darken-2">
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
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
                :rules="['required']"
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
              >
                <template #append>
                  <v-btn
                    :color="addedCountSort ? 'info' : undefined"
                    :icon="
                      addedCountSort === 'asc'
                        ? 'mdi-sort-ascending'
                        : addedCountSort === 'desc'
                          ? 'mdi-sort-descending'
                          : 'mdi-sort'
                    "
                    size="small"
                    variant="text"
                    :title="t('SetSearchSolution.edit.sortByAddedCount')"
                    @click="cycleAddedCountSort"
                  />
                </template>
              </v-text-field>

              <v-card class="overflow-y-auto" height="calc(100vh - 340px)">
                <v-expansion-panels v-model="openSitePanels" multiple>
                  <v-expansion-panel
                    v-for="site in filteredSite"
                    :key="site"
                    :disabled="!!metadataStore.sites[site].isOffline"
                    :value="site"
                  >
                    <v-expansion-panel-title>
                      <SiteFavicon :site-id="site" class="mr-2" inline />

                      <v-chip :color="addedCountBySite[site] ? 'green' : 'grey-lighten-1'" label>
                        <SiteName :class="['text-no-wrap']" :site-id="site" />
                      </v-chip>

                      <template #actions>
                        <v-chip
                          v-if="addedCountBySite[site]"
                          :color="addedCountBySite[site] === 1 ? 'success' : 'warning'"
                          label
                          :title="t('SetSearchSolution.edit.siteAddedCount', [addedCountBySite[site]])"
                        >
                          ×{{ addedCountBySite[site] }}
                        </v-chip>
                      </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <SiteCategoryPanel :site-id="site" @update:solution="addSolution" />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-alert class="mb-2" type="success">
                <v-alert-title>
                  {{ t("SetSearchSolution.edit.addCount", [solution.solutions.length]) }}
                </v-alert-title>
              </v-alert>

              <v-card class="overflow-y-auto" height="calc(100vh - 330px)">
                <v-card-text class="pl-3 py-0 pr-1">
                  <div v-if="siteFilter && filteredSolutions.length === 0 && solution.solutions.length > 0">
                    {{ t("SetSearchSolution.edit.noMatchInFilteredSolutions") }}
                  </div>
                  <SolutionLabel
                    :group-props="{ column: true }"
                    :solutions="filteredSolutions"
                    closable
                    @remove:solution="removeSolution"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn
          :disabled="!formValid || solution.solutions.length === 0"
          color="success"
          prepend-icon="mdi-check-circle-outline"
          variant="text"
          @click="saveSolutionState"
        >
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
