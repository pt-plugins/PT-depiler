<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { IBackupFileInfo } from "@ptd/backupServer";
import { sendMessage } from "@/messages.ts";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";
import { formatDate, formatSize } from "@/options/utils.ts";
import { useI18n } from "vue-i18n";

import { useRuntimeStore } from "@/options/stores/runtime.ts";

import DeleteDialog from "@/options/components/DeleteDialog.vue";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import NavButton from "@/options/components/NavButton.vue";

const showDialog = defineModel<boolean>();
const { backupServerId } = defineProps<{
  backupServerId: string;
}>();

const { t } = useI18n();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

const isLoading = ref<boolean>(false);
const backupHistory = shallowRef<IBackupFileInfo[]>([]);

const tableHeaders = [
  { title: "备份文件名", key: "filename", align: "start" },
  { title: "备份大小", key: "size", align: "end" },
  { title: "备份时间", key: "time", align: "start" },
  { title: "操作", key: "action", sortable: false },
] as DataTableHeader[];
const tableSelected = ref<string[]>([]);

const showDeleteDialog = ref<boolean>(false);
const toDeleteBackupHistory = ref<string[]>([]);
async function deleteBackupHistory(paths: string[]) {
  showDeleteDialog.value = true;
  toDeleteBackupHistory.value = paths;
}

async function confirmDeleteBackupHistory(toDeleteId: string) {
  const toDeleteName = backupHistory.value.find((item) => item.path === toDeleteId)?.filename ?? toDeleteId;
  const deleteStatus = await sendMessage("deleteBackupHistory", { path: toDeleteId, backupServerId });
  if (!deleteStatus) {
    runtimeStore.showSnakebar(`删除备份历史 [${toDeleteName}] 失败`, { color: "error" });
  } else {
    runtimeStore.showSnakebar(`删除备份历史 [${toDeleteName}] 成功`, { color: "success" });
    backupHistory.value = backupHistory.value.filter((item) => item.path !== toDeleteId);
  }
}

async function loadBackupHistory() {
  isLoading.value = true;
  try {
    backupHistory.value = await sendMessage("getBackupHistory", backupServerId);
  } catch (e) {
    console.error("获取备份历史失败", e);
  } finally {
    isLoading.value = false;
  }
}

async function dialogEnter() {
  // noinspection ES6MissingAwait
  loadBackupHistory();
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="1000" @after-enter="dialogEnter">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>
            {{ metadataStore.backupServers[backupServerId].name ?? backupServerId }} 的历史备份
          </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <NavButton
          :disabled="tableSelected.length === 0"
          :text="t('common.remove')"
          color="error"
          icon="mdi-delete"
          @click="deleteBackupHistory(tableSelected)"
        />

        <v-data-table
          v-model="tableSelected"
          :headers="tableHeaders"
          :items="backupHistory"
          :sort-by="[{ key: 'time', order: 'desc' }]"
          class="table-header-no-wrap table-stripe"
          item-value="path"
          must-sort
          show-select
        >
          <template #item.size="{ item }">
            <span class="text-no-wrap">
              {{ item.size !== "N/A" ? formatSize(item.size) : item.size }}
            </span>
          </template>

          <template #item.time="{ item }">
            <span class="text-no-wrap">{{ formatDate(item.time) }}</span>
          </template>

          <template #item.action="{ item }">
            <v-btn-group class="table-action" density="compact" variant="plain">
              <v-btn color="blue" icon="mdi-cloud-download" size="small"></v-btn>

              <v-btn
                :title="t('common.remove')"
                color="error"
                icon="mdi-delete"
                size="small"
                @click="deleteBackupHistory([item.path])"
              />
            </v-btn-group>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>

  <DeleteDialog
    v-model="showDeleteDialog"
    :confirm-delete="confirmDeleteBackupHistory"
    :to-delete-ids="toDeleteBackupHistory"
    @all-delete="loadBackupHistory"
  />
</template>

<style scoped lang="scss"></style>
