<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import type { TSolutionKey } from "@/storage.ts";

import EditDialog from "./EditDialog.vue";
import SolutionLabel from "./SolutionLabel.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";
import NavButton from "@/options/components/NavButton.vue";

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

const toDeleteIds = ref<TSolutionKey[]>([]);
function deleteSearchSolution(solutionId: TSolutionKey[]) {
  toDeleteIds.value = solutionId;
  showDeleteDialog.value = true;
}

function confirmDeleteSearchSolution(solutionId: TSolutionKey) {
  metadataStore.removeSearchSolution(solutionId);
  const index = tableSelected.value.indexOf(solutionId);
  if (index !== -1) {
    tableSelected.value.splice(index, 1);
  }
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
</script>

<template>
  <v-alert type="info">
    <v-alert-title> {{ t("route.Settings.SetSearchSolution") }} </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <NavButton
          :text="t('common.btn.add')"
          class="mr-2"
          color="success"
          icon="mdi-plus"
          @click="addSearchSolution"
        />

        <NavButton
          :disabled="tableSelected.length === 0"
          :text="t('common.remove')"
          color="error"
          icon="mdi-minus"
          @click="deleteSearchSolution(tableSelected)"
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
          label="Search"
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
      :items-per-page="10"
      :search="tableFilter"
      :sort-by="[
        // 因为此处涉及到了搜索栏的显示，所以我们不接受用户 **保存** 自定义排序
        { key: 'enabled', order: 'desc' },
        { key: 'sort', order: 'desc' },
      ]"
      class="table-stripe"
      hover
      item-value="id"
      show-select
    >
      <template #item.solution="{ item }">
        <SolutionLabel :closable="false" :solutions="item.solutions" />
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
        <v-btn-group class="table-action" density="compact" variant="plain">
          <v-btn
            :title="$t('common.edit')"
            color="info"
            icon="mdi-pencil"
            size="small"
            @click="() => editSearchSolution(item.id)"
          />
          <v-btn
            :title="$t('common.remove')"
            color="error"
            icon="mdi-delete"
            size="small"
            @click="() => deleteSearchSolution([item.id])"
          >
          </v-btn>
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <EditDialog v-model="showEditDialog" :solution-id="solutionId" />
  <DeleteDialog
    v-model="showDeleteDialog"
    :to-delete-ids="toDeleteIds"
    @confirm-delete="confirmDeleteSearchSolution"
  ></DeleteDialog>
</template>

<style scoped lang="scss"></style>
