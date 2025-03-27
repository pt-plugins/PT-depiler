<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useSiteStore } from "@/options/stores/site.ts";
import EditDialog from "./EditDialog.vue";
import { TSolutionID } from "@/shared/storages/site.ts";
import SolutionLabel from "@/options/views/Settings/SetSearchSolution/SolutionLabel.vue";
import DeleteDialog from "@/options/views/Settings/SetSearchSolution/DeleteDialog.vue";

const { t } = useI18n();
const siteStore = useSiteStore();

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const solutionId = ref<TSolutionID>("");

const tableSelected = ref<TSolutionID[]>([]);
const tableHeader = [
  { title: t("common.name"), key: "name", align: "start", width: 150 },
  { title: "范围", key: "solution", align: "start", filterable: false, sortable: false },
  { title: "启用？", key: "enabled", align: "center", filterable: false, width: 100 },
  { title: "排序", key: "sort", align: "center", width: 100, filterable: false },
  { title: t("common.action"), key: "action", filterable: false, sortable: false, width: 200 },
];
const tableFilter = ref("");

function addSearchSolution() {
  showEditDialog.value = true;
}

function editSearchSolution(toEditSolutionId: TSolutionID) {
  solutionId.value = toEditSolutionId;
  showEditDialog.value = true;
}

watchEffect(() => {
  if (showEditDialog.value === false) {
    solutionId.value = "";
  }
});

const toDeleteIds = ref<TSolutionID[]>([]);
function deleteSearchSolution(solutionId: TSolutionID | TSolutionID[]) {
  toDeleteIds.value = Array.isArray(solutionId) ? solutionId : [solutionId];
  showDeleteDialog.value = true;
}

function simplePatchSearchSolution(solutionId: TSolutionID, value: boolean) {
  siteStore.solutions[solutionId].enabled = value;
  siteStore.save();
}
</script>

<template>
  <v-alert type="info">
    <v-alert-title> 搜索方案定义 </v-alert-title>
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

        <v-btn color="light-blue" prepend-icon="mdi-help-circle">如何使用</v-btn>

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
      :items="siteStore.getSearchSolutions"
      :items-per-page="10"
      item-value="id"
      :search="tableFilter"
      show-select
    >
      <template #item.solution="{ item }">
        <SolutionLabel :solutions="item.solutions" :closable="false" />
      </template>

      <template #item.enabled="{ item }">
        <v-switch
          v-model="item.enabled"
          color="success"
          hide-details
          @update:model-value="(v) => simplePatchSearchSolution(item.id, v as boolean)"
        />
      </template>

      <template #item.action="{ item }">
        <v-btn-group variant="plain">
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
  <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" />
</template>

<style scoped lang="scss"></style>
