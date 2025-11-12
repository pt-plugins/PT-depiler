<script setup lang="ts">
import { ref, useTemplateRef, computed } from "vue";
import { useI18n } from "vue-i18n";
import { cloneDeep, omit } from "es-toolkit";
import { saveAs } from "file-saver";
import { nanoid } from "nanoid";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { formatDate } from "@/options/utils.ts";
import type { ISearchSolutionMetadata, TSolutionKey } from "@/shared/types.ts";

import EditDialog from "./EditDialog.vue";
import SolutionLabel from "./SolutionLabel.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";
import NavButton from "@/options/components/NavButton.vue";

const { t } = useI18n();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const solutionId = ref<TSolutionKey>("");

const tableSelected = ref<TSolutionKey[]>([]);
const tableHeader = [
  { title: "№", key: "sort", align: "center", width: 150 },
  { title: t("common.name"), key: "name", align: "start", width: 150 },
  { title: t("SetSearchSolution.solution"), key: "solution", align: "start", minWidth: 400, sortable: false },
  { title: t("SetSearchSolution.table.enable"), key: "enabled", align: "center", width: 120 },
  { title: t("SetSearchSolution.table.default"), key: "isDefault", align: "center", width: 120, sortable: false },
  { title: t("common.action"), key: "action", sortable: false, width: 200 },
] as DataTableHeader[];
const tableFilter = ref("");

function addSearchSolution() {
  editSearchSolution("");
}

function editSearchSolution(toEditSolutionId: TSolutionKey) {
  solutionId.value = toEditSolutionId;
  showEditDialog.value = true;
}

type IExportedSearchSolution = Omit<ISearchSolutionMetadata, "id" | "enabled" | "createdAt" | "isDefault" | "sort">;

const importFileInputRef = useTemplateRef<HTMLInputElement>("importFile");
function importSearchSolution(e: Event) {
  if (e.target instanceof HTMLInputElement && e.target.files && e.target.files.length > 0) {
    for (const file of e.target.files) {
      const r = new FileReader();
      r.onload = (e: any) => {
        try {
          const result = JSON.parse(e.target.result) as IExportedSearchSolution[];
          for (const solution of result) {
            let importSolution = solution as ISearchSolutionMetadata;

            if (importSolution.solutions && importSolution.solutions.length > 0) {
              // 补全导出时移除的字段
              importSolution.id = nanoid();
              importSolution.enabled = false;
              importSolution.createdAt = +new Date();
              importSolution.isDefault = false;
              importSolution.sort = 1;

              metadataStore.addSearchSolution(importSolution);
            }
          }
        } catch (error) {
          runtimeStore.showSnakebar("Invalid JSON format when import search solution", { color: "error" });
        }
      };
      r.onerror = () => {
        runtimeStore.showSnakebar("Invalid JSON format when load import file", { color: "error" });
      };
      r.readAsText(file);
    }
  }
}

function exportSearchSolutions(solutionIds: TSolutionKey[]) {
  const exportedSolutions: IExportedSearchSolution[] = [];
  for (const solutionId of solutionIds) {
    exportedSolutions.push(
      omit(metadataStore.solutions[solutionId], ["id", "enabled", "createdAt", "isDefault", "sort"]),
    );
  }

  if (exportedSolutions.length > 0) {
    const exportedSolutionBlob = new Blob([JSON.stringify(exportedSolutions)], { type: "application/json" });
    saveAs(exportedSolutionBlob, `search-solutions-export-${formatDate(new Date(), "yyyyMMdd'T'HHmm")}.json`); // FIXME filename
  } else {
    runtimeStore.showSnakebar("No solutions to export", { color: "error" });
  }
}

const toDeleteIds = ref<TSolutionKey[]>([]);
function deleteSearchSolutions(solutionIds: TSolutionKey[]) {
  toDeleteIds.value = solutionIds;
  showDeleteDialog.value = true;
}

async function confirmDeleteSearchSolution(solutionId: TSolutionKey) {
  return await metadataStore.removeSearchSolution(solutionId);
}

function simplePatchSearchSolution(solutionId: TSolutionKey, value: boolean) {
  metadataStore.solutions[solutionId].enabled = value;
  metadataStore.$save();
}

function setDefaultSearchSolution(toDefault: boolean, solutionId: TSolutionKey) {
  console.log(toDefault, solutionId);
  if (toDefault) {
    metadataStore.defaultSolutionId = solutionId;
    for (const solutionKey of Object.keys(metadataStore.solutions)) {
      metadataStore.solutions[solutionKey].isDefault = solutionKey === solutionId;
    }
  } else {
    metadataStore.defaultSolutionId = "default";
    metadataStore.solutions[solutionId].isDefault = false;
  }

  metadataStore.$save();
}

const isAllSolutionDefault = computed(() => metadataStore.defaultSolutionId === "default");

async function copySearchSolution(solutionId: TSolutionKey) {
  const toCopy = await metadataStore.getSearchSolution(solutionId);
  if (!toCopy) return;

  const copied = cloneDeep(toCopy);
  // 重置部分字段
  copied.id = nanoid();
  copied.createdAt = Date.now();
  copied.isDefault = false;
  for (const solution1 of copied.solutions) {
    const oldId = solution1.id;
    if (oldId !== "default") {
      const newId = nanoid();
      solution1.id = newId;
      solution1.searchEntries[newId] = solution1.searchEntries[oldId];
      delete solution1.searchEntries[oldId];
    }
  }

  const newSearchSolutionName = prompt("请输入新搜索方案名称", `Copy of ${copied.name ?? copied.id}`);
  if (newSearchSolutionName) {
    copied.name = newSearchSolutionName;
    await metadataStore.addSearchSolution(copied);
  }
}
</script>

<template>
  <v-alert type="info">
    <v-alert-title> {{ t("route.Settings.SetSearchSolution") }} </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <NavButton :text="t('common.btn.add')" color="success" icon="mdi-plus" @click="addSearchSolution" />

        <NavButton
          :disabled="tableSelected.length === 0"
          :text="t('common.remove')"
          color="error"
          icon="mdi-minus"
          @click="deleteSearchSolutions(tableSelected)"
        />

        <v-divider class="mx-2" inset vertical />

        <input
          ref="importFile"
          accept="application/json"
          multiple
          style="display: none"
          type="file"
          @change="importSearchSolution"
        />

        <NavButton
          color="info"
          icon="mdi-import"
          :text="t('SetSearchSolution.import')"
          @click="() => importFileInputRef?.click()"
        />
        <NavButton
          :disabled="tableSelected.length === 0"
          color="info"
          icon="mdi-export"
          :text="t('SetSearchSolution.export')"
          @click="() => exportSearchSolutions(tableSelected)"
        />

        <v-divider class="mx-2" inset vertical />

        <NavButton :text="t('common.howToUse')" color="light-blue" disabled icon="mdi-help-circle" />

        <v-spacer />

        <v-text-field
          v-model="tableFilter"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          :label="t('common.search')"
          max-width="500"
          single-line
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :filter-keys="['name']"
      :headers="tableHeader"
      :items="metadataStore.getSearchSolutions"
      :items-per-page="configStore.tableBehavior.SetSearchSolution.itemsPerPage"
      :search="tableFilter"
      :sort-by="[
        // 因为此处涉及到了搜索栏的显示，所以我们不接受用户 **保存** 自定义排序
        { key: 'enabled', order: 'desc' },
        { key: 'sort', order: 'desc' },
      ]"
      class="table-stripe table-header-no-wrap"
      hover
      item-value="id"
      :multi-sort="configStore.enableTableMultiSort"
      show-select
      @update:itemsPerPage="(v) => configStore.updateTableBehavior('SetSearchSolution', 'itemsPerPage', v)"
    >
      <template #body.prepend>
        <tr class="v-data-table__tr">
          <td class="v-data-table__td" colspan="2"></td>
          <td class="v-data-table__td">{{ t("layout.header.searchPlan.all") }}</td>
          <td class="v-data-table__td">
            <v-chip class="mb-1 mr-1 h-auto py-1" color="light-blue" label prepend-icon="mdi-refresh-auto" size="small">
              {{ t("SetSearchSolution.table.autoGenerate") }}
            </v-chip>
          </td>
          <td class="v-data-table__td v-data-table-column--align-center">
            <v-switch class="table-switch-btn" disabled hide-details />
          </td>
          <td class="v-data-table__td v-data-table-column--align-center">
            <v-switch
              :model-value="isAllSolutionDefault"
              class="table-switch-btn"
              color="success"
              hide-details
              readonly
            />
          </td>
          <td class="v-data-table__td">
            <v-btn-group class="table-action" density="compact" variant="plain">
              <v-btn
                :title="t('SetSearchSolution.copy')"
                color="success"
                icon="mdi-content-copy"
                size="small"
                @click="copySearchSolution('default')"
              />
            </v-btn-group>
          </td>
        </tr>
      </template>

      <template #item.solution="{ item }">
        <SolutionLabel :closable="false" :group-props="{ column: true }" :solutions="item.solutions" />
      </template>

      <template #item.enabled="{ item }">
        <v-switch
          v-model="item.enabled"
          class="table-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => simplePatchSearchSolution(item.id, v as boolean)"
        />
      </template>

      <template #item.isDefault="{ item }">
        <v-switch
          v-model="item.isDefault"
          class="table-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => setDefaultSearchSolution(v as boolean, item.id)"
        />
      </template>

      <template #item.action="{ item }">
        <v-btn-group class="table-action" density="compact" variant="plain">
          <v-btn
            :title="t('SetSearchSolution.copy')"
            size="small"
            color="success"
            icon="mdi-content-copy"
            @click="copySearchSolution(item.id)"
          />
          <v-btn
            :title="t('common.edit')"
            color="info"
            icon="mdi-pencil"
            size="small"
            @click="() => editSearchSolution(item.id)"
          />
          <v-btn
            :title="t('SetSearchSolution.export')"
            size="small"
            color="info"
            icon="mdi-export"
            @click="exportSearchSolutions([item.id])"
          />
          <v-btn
            :title="t('common.remove')"
            color="error"
            icon="mdi-delete"
            size="small"
            @click="() => deleteSearchSolutions([item.id])"
          >
          </v-btn>
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <EditDialog v-model="showEditDialog" :solution-id="solutionId" />
  <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" :confirm-delete="confirmDeleteSearchSolution" />
</template>

<style scoped lang="scss"></style>
