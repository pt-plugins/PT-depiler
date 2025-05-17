<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { formatDate } from "@/options/utils.ts";
import type { TBackupServerKey } from "@/shared/storages/types/metadata.ts";

import NavButton from "@/options/components/NavButton.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";
import AddDialog from "@/options/views/Settings/SetBackup/AddDialog.vue";
import EditDialog from "@/options/views/Settings/SetBackup/EditDialog.vue";

const { t } = useI18n();
const metadataStore = useMetadataStore();
const importFileInputRef = useTemplateRef<HTMLInputElement>("importFile");

const showAddDialog = ref<boolean>(false);
const showHistoryDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const fullTableHeader = [
  { title: t("SetDownloader.common.type"), key: "type", align: "center" },
  { title: t("SetDownloader.common.name"), key: "name", align: "start" },
  { title: "备份内容", key: "backupFields", align: "start", sortable: false },
  { title: "最近一次备份时间", key: "lastBackupAt", align: "end" },
  { title: t("SetDownloader.index.table.enabled"), key: "enabled", align: "center" },
  { title: t("common.action"), key: "action", sortable: false },
] as DataTableHeader[];
const tableSelected = ref<TBackupServerKey[]>([]);

const localBackup = Symbol("localBackup");
const doBackupStatus = ref<Record<TBackupServerKey | symbol, boolean>>({});
async function doBackup(id: TBackupServerKey | symbol) {
  doBackupStatus.value[id] = true;

  // TODO backup

  doBackupStatus.value[id] = false;
}

const toEditBackupServerId = ref<TBackupServerKey | null>(null);
function editBackupServer(id: TBackupServerKey) {
  toEditBackupServerId.value = id;
  showEditDialog.value = true;
}

const toShowHistoryBackupServerId = ref<TBackupServerKey | null>(null);
function showHistory(id: TBackupServerKey) {
  toShowHistoryBackupServerId.value = id;
  showHistoryDialog.value = true;
}

const toDeleteIds = ref<TBackupServerKey[]>([]);
function deleteBackupServer(ids: TBackupServerKey[]) {
  toDeleteIds.value = ids;
  showDeleteDialog.value = true;
}

async function confirmDeleteBackupServer(id: TBackupServerKey) {
  return await metadataStore.removeBackupServer(id);
}
</script>

<template>
  <v-alert :title="t('route.Settings.SetBackup')" type="info" />
  <v-card class="set-backup">
    <v-card-title>
      <v-row class="ma-0">
        <NavButton :text="t('common.btn.add')" color="success" icon="mdi-plus" @click="showAddDialog = true" />
        <NavButton
          :disabled="tableSelected.length === 0"
          :text="t('common.remove')"
          color="error"
          icon="mdi-minus"
          @click="deleteBackupServer(tableSelected)"
        />

        <v-divider vertical class="mx-2" />

        <NavButton
          :loading="doBackupStatus[localBackup]"
          color="success"
          icon="mdi-database-export"
          text="本地导出"
          @click="doBackup(localBackup)"
        />
        <NavButton text="本地导入" color="blue" icon="mdi-database-import" @click="() => importFileInputRef?.click()" />

        <input ref="importFile" accept="application/zip" style="display: none" type="file" />

        <v-spacer />

        <v-text-field clearable density="compact" hide-details label="Search" max-width="500" single-line />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :headers="fullTableHeader"
      :filter-keys="['id']"
      :items="metadataStore.getBackupServers"
      item-value="id"
      class="table-stripe table-header-no-wrap"
      show-select
    >
      <template #item.backupFields="{ item }">
        <v-chip-group show-arrows>
          <v-chip v-for="backupField in item.backupFields" label :key="backupField">
            {{ backupField }}
          </v-chip>
        </v-chip-group>
      </template>

      <template #item.lastBackupAt="{ item }">
        {{ item.lastBackupAt ? formatDate(item.lastBackupAt) : "notBackup" }}
      </template>

      <template #item.enabled="{ item }">
        <v-switch
          v-model="item.enabled"
          class="table-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatch('backupServers', item.id, 'enabled', v as boolean)"
        />
      </template>
      <template #item.action="{ item }">
        <v-btn-group class="table-action" density="compact" variant="plain">
          <v-btn
            :loading="doBackupStatus[item.id]"
            color="green"
            icon="mdi-cloud-upload"
            size="small"
            @click="doBackup(item.id)"
          />

          <v-btn icon="mdi-view-list" size="small" @click="showHistory(item.id)" />

          <v-btn
            :title="t('common.edit')"
            color="info"
            icon="mdi-pencil"
            size="small"
            @click="editBackupServer(item.id)"
          />

          <v-btn
            :title="t('common.remove')"
            color="error"
            icon="mdi-delete"
            size="small"
            @click="deleteBackupServer([item.id])"
          />
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <AddDialog v-model="showAddDialog" />
  <EditDialog v-model="showEditDialog" :client-id="toEditBackupServerId!" />
  <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" :confirm-delete="confirmDeleteBackupServer" />
</template>

<style scoped lang="scss"></style>
