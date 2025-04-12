<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import type { TSolutionKey } from "@/storage.ts";

import EditDialog from "./EditDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";
import SolutionLabel from "./SolutionLabel.vue";

const { t } = useI18n();
const metadataStore = useMetadataStore();

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const solutionId = ref<TSolutionKey>("");

const tableSelected = ref<TSolutionKey[]>([]);
const tableHeader = [
  { title: t("common.sortIndex"), key: "sort", align: "center", width: 100, filterable: false },
  { title: t("common.name"), key: "name", align: "start", width: 150 },
  { title: t("SetSearchSolution.solution"), key: "solution", align: "start", filterable: false, sortable: false },
  { title: t("SetSearchSolution.table.enable"), key: "enabled", align: "center", filterable: false, width: 120 },
  {
    title: t("SetSearchSolution.table.default"),
    key: "isDefault",
    align: "center",
    filterable: false,
    width: 120,
    sortable: false,
  },
  { title: t("common.action"), key: "action", filterable: false, sortable: false, width: 200 },
];
const tableFilter = ref("");

function addSearchSolution() {
  showEditDialog.value = true;
}

function editSearchSolution(toEditSolutionId: TSolutionKey) {
  solutionId.value = toEditSolutionId;
  showEditDialog.value = true;
}

watch(showDeleteDialog, (value) => {
  if (value === false) {
    toDeleteIds.value = [];
  }
});

const toDeleteIds = ref<TSolutionKey[]>([]);
function deleteSearchSolution(solutionId: TSolutionKey | TSolutionKey[]) {
  toDeleteIds.value = Array.isArray(solutionId) ? solutionId : [solutionId];
  showDeleteDialog.value = true;
}

watch(toDeleteIds, (newVal, oldValue) => {
  if (newVal.length === 0 && oldValue.length > 0) {
    for (const id of oldValue) {
      const index = tableSelected.value.indexOf(id);
      if (index !== -1) {
        tableSelected.value.splice(index, 1);
      }
    }
  }
});

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
</script>

<template>
  <v-alert type="info">
    <v-alert-title> {{ t("route.Settings.SetSearchSolution") }} </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-btn color="success" prepend-icon="mdi-plus" class="mr-2" @click="addSearchSolution">
          {{ t("common.btn.add") }}
        </v-btn>
        <v-btn
          color="error"
          prepend-icon="mdi-minus"
          :disabled="tableSelected.length === 0"
          @click="deleteSearchSolution(tableSelected)"
        >
          {{ t("common.remove") }}
        </v-btn>

        <v-divider vertical inset class="mx-2" />

        <v-btn color="light-blue" prepend-icon="mdi-help-circle" disabled>
          {{ t("common.howToUse") }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-text-field
          v-model="tableFilter"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          density="compact"
          hide-details
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :headers="tableHeader"
      :items="metadataStore.getSearchSolutions"
      :items-per-page="10"
      item-value="id"
      :sort-by="[
        // 因为此处涉及到了搜索栏的显示，所以我们不接受用户 **保存** 自定义排序
        { key: 'enabled', order: 'desc' },
        { key: 'sort', order: 'desc' },
      ]"
      :search="tableFilter"
      show-select
    >
      <template #item.solution="{ item }">
        <SolutionLabel :solutions="item.solutions" :closable="false" />
      </template>

      <template #item.enabled="{ item }">
        <div class="d-flex justify-center">
          <v-switch
            v-model="item.enabled"
            color="success"
            hide-details
            @update:model-value="(v) => simplePatchSearchSolution(item.id, v as boolean)"
          />
        </div>
      </template>

      <template #item.isDefault="{ item }">
        <div class="d-flex justify-center">
          <v-switch
            v-model="item.isDefault"
            color="success"
            hide-details
            @update:model-value="(v) => setDefaultSearchSolution(v as boolean, item.id)"
          />
        </div>
      </template>

      <template #item.action="{ item }">
        <v-btn-group variant="plain" density="compact" class="table-action">
          <v-btn
            size="small"
            icon="mdi-pencil"
            :title="$t('common.edit')"
            color="info"
            @click="() => editSearchSolution(item.id)"
          />
          <v-btn
            size="small"
            icon="mdi-delete"
            :title="$t('common.remove')"
            color="error"
            @click="() => deleteSearchSolution(item.id)"
          >
          </v-btn>
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <EditDialog v-model="showEditDialog" :solution-id="solutionId" />
  <DeleteDialog v-model="showDeleteDialog" v-model:to-delete-ids="toDeleteIds" />
</template>

<style scoped lang="scss"></style>
