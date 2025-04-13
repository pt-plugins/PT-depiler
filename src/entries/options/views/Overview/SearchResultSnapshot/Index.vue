<script setup lang="ts">
import { ref, watch } from "vue";
import { refDebounced } from "@vueuse/core";
import { useRouter } from "vue-router";

import { formatDate } from "../../../utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import DeleteDialog from "./DeleteDialog.vue";
import EditNameDialog from "./EditNameDialog.vue";

import { type TSearchSnapshotKey } from "@/shared/storages/types/metadata.ts";

const router = useRouter();
const metadataStore = useMetadataStore();

const showEditNameDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const tableHeader = [
  { title: "快照名称", key: "name", align: "start" },
  { title: "种子数", key: "recordCount", align: "end", width: 100, filterable: false },
  { title: "创建时间", key: "createdAt", align: "center", width: 150, minWidth: 150, filterable: false },
  { title: "操作", key: "action", align: "center", width: 125, minWidth: 125, sortable: false, alwaysShow: true },
];
const tableSelected = ref<TSearchSnapshotKey[]>([]);
const tableWaitFilter = ref("");
const tableFilter = refDebounced(tableWaitFilter, 500); // 延迟搜索过滤词的生成

function viewSnapshot(searchSnapshotId: TSearchSnapshotKey) {
  router.push({
    name: "SearchEntity",
    query: {
      snapshot: searchSnapshotId,
    },
  });
}

const toEditId = ref<TSearchSnapshotKey | null>(null);
function editSnapshotName(searchSnapshotId: TSearchSnapshotKey) {
  toEditId.value = searchSnapshotId;
  showEditNameDialog.value = true;
}

const toDeleteIds = ref<TSearchSnapshotKey[]>([]);
function deleteSearchSnapshot(searchSnapshotId: TSearchSnapshotKey | TSearchSnapshotKey[]) {
  toDeleteIds.value = Array.isArray(searchSnapshotId) ? searchSnapshotId : [searchSnapshotId];
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
</script>

<template>
  <v-alert type="info">
    <v-alert-title> 搜索快照 </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-btn
          :disabled="tableSelected.length === 0"
          color="error"
          prepend-icon="mdi-minus"
          @click="deleteSearchSnapshot(tableSelected)"
        >
          {{ $t("common.remove") }}
        </v-btn>

        <v-spacer />
        <v-text-field
          v-model="tableWaitFilter"
          append-icon="mdi-magnify"
          density="compact"
          hide-details
          label="快照名称过滤"
          max-width="500"
          prepend-inner-icon="mdi-filter"
          single-line
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :headers="tableHeader"
      :items="metadataStore.getSearchSnapshotList"
      :search="tableFilter"
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
      class="table-stripe"
      item-value="id"
      show-select
    >
      <template #item.createdAt="{ item }">
        <span class="text-no-wrap"> {{ formatDate(item.createdAt) }}</span>
      </template>
      <template #item.action="{ item }">
        <v-btn-group class="table-action" density="compact" variant="plain">
          <v-btn
            color="green"
            icon="mdi-archive-search"
            size="small"
            title="查看"
            @click="() => viewSnapshot(item.id)"
          ></v-btn>
          <v-btn
            color="blue"
            icon="mdi-archive-edit"
            size="small"
            title="编辑标题"
            @click="() => editSnapshotName(item.id)"
          ></v-btn>
          <v-btn
            :title="$t('common.remove')"
            color="error"
            icon="mdi-delete"
            size="small"
            @click="deleteSearchSnapshot(item.id)"
          >
          </v-btn>
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <EditNameDialog v-model="showEditNameDialog" :edit-id="toEditId!" />
  <DeleteDialog v-model="showDeleteDialog" v-model:to-delete-ids="toDeleteIds"></DeleteDialog>
</template>

<style scoped lang="scss"></style>
