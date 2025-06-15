<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { refDebounced } from "@vueuse/core";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { formatDate } from "@/options/utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { type TSearchSnapshotKey } from "@/shared/types.ts";

import DeleteDialog from "@/options/components/DeleteDialog.vue";
import NavButton from "@/options/components/NavButton.vue";
import EditNameDialog from "./EditNameDialog.vue";

const { t } = useI18n();
const router = useRouter();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

const showEditNameDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const tableHeader = [
  { title: t("SearchResultSnapshot.table.header.name"), key: "name", align: "start" },
  { title: t("SearchResultSnapshot.table.header.recordCount"), key: "recordCount", align: "end", width: 100 },
  {
    title: t("SearchResultSnapshot.table.header.createdAt"),
    key: "createdAt",
    align: "center",
    width: 150,
    minWidth: 150,
  },
  {
    title: t("common.action"),
    key: "action",
    align: "center",
    width: 125,
    minWidth: 125,
    sortable: false,
    alwaysShow: true,
  },
] as DataTableHeader[];
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
function tryToDeleteSearchSnapshot(searchSnapshotId: TSearchSnapshotKey[]) {
  toDeleteIds.value = searchSnapshotId;
  showDeleteDialog.value = true;
}

async function confirmDeleteSearchSnapshot(searchSnapshotId: TSearchSnapshotKey) {
  return await metadataStore.removeSearchSnapshotData(searchSnapshotId);
}
</script>

<template>
  <v-alert type="info" :title="t('route.Overview.SearchResultSnapshot')" />
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <NavButton
          :disabled="tableSelected.length === 0"
          color="error"
          icon="mdi-minus"
          :text="t('common.remove')"
          @click="tryToDeleteSearchSnapshot(tableSelected)"
        />

        <v-spacer />
        <v-text-field
          v-model="tableWaitFilter"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          :label="t('SearchResultSnapshot.table.filterLabel')"
          max-width="500"
          single-line
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :headers="tableHeader"
      :items="metadataStore.getSearchSnapshotList"
      :items-per-page="configStore.tableBehavior.SearchResultSnapshot.itemsPerPage"
      :search="tableFilter"
      :sort-by="configStore.tableBehavior.SearchResultSnapshot.sortBy"
      class="table-stripe table-header-no-wrap"
      hover
      item-value="id"
      multi-sort
      show-select
      @update:itemsPerPage="(v) => configStore.updateTableBehavior('SearchResultSnapshot', 'itemsPerPage', v)"
      @update:sortBy="(v) => configStore.updateTableBehavior('SearchResultSnapshot', 'sortBy', v)"
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
            :title="t('SearchResultSnapshot.table.action.view')"
            @click="() => viewSnapshot(item.id)"
          ></v-btn>
          <v-btn
            color="blue"
            icon="mdi-archive-edit"
            size="small"
            :title="t('SearchResultSnapshot.table.action.editTitle')"
            @click="() => editSnapshotName(item.id)"
          ></v-btn>
          <v-btn
            :title="t('common.remove')"
            color="error"
            icon="mdi-delete"
            size="small"
            @click="tryToDeleteSearchSnapshot([item.id])"
          >
          </v-btn>
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <EditNameDialog v-model="showEditNameDialog" :edit-id="toEditId!" />
  <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" :confirm-delete="confirmDeleteSearchSnapshot" />
</template>

<style scoped lang="scss"></style>
