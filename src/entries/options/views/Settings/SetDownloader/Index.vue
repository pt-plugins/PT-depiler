<script setup lang="ts">
import { ref } from "vue";
import { computedAsync } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { TDownloaderKey } from "@/shared/storages/types/metadata.ts";
import { getDownloaderIcon, getDownloaderMetaData, type TorrentClientMetaData } from "@ptd/downloader";

import AddDialog from "./AddDialog.vue";
import EditDialog from "./EditDialog.vue";
import PathAndTagSuggestDialog from "./PathAndTagSuggestDialog.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";

const { t } = useI18n();
const metadataStore = useMetadataStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showPathAndTagSuggestDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const downloaderMetadata = computedAsync(async () => {
  const downloaderMetaData: Record<string, TorrentClientMetaData> = {};
  for (const type of new Set(metadataStore.getDownloaders.map((x) => x.type))) {
    downloaderMetaData[type] = await getDownloaderMetaData(type);
  }
  return downloaderMetaData;
}, {});

const fullTableHeader = [
  { title: t("SetDownloader.common.type"), key: "type", align: "center", filterable: false },
  { title: t("SetDownloader.common.name"), key: "name", align: "start" },
  { title: t("SetDownloader.common.uid"), key: "id", align: "start", filterable: false, sortable: false },
  { title: t("SetDownloader.common.address"), key: "address", align: "start" },
  { title: t("SetDownloader.common.username"), key: "username", align: "start" },
  { title: t("SetDownloader.index.table.enabled"), key: "enabled", align: "center", filterable: false },
  { title: t("SetDownloader.index.table.autodl"), key: "feature.DefaultAutoStart", align: "center", filterable: false },
  { title: t("common.action"), key: "action", filterable: false, sortable: false },
];
const tableSelected = ref<TDownloaderKey[]>([]);

const toEditDownloaderId = ref<TDownloaderKey | null>(null);
function editDownloader(downloaderId: TDownloaderKey) {
  toEditDownloaderId.value = downloaderId;
  showEditDialog.value = true;
}

function editDownloaderPathAndTag(downloaderId: TDownloaderKey) {
  toEditDownloaderId.value = downloaderId;
  showPathAndTagSuggestDialog.value = true;
}

const toDeleteIds = ref<TDownloaderKey[]>([]);
function deleteDownloader(downloaderId: TDownloaderKey[]) {
  toDeleteIds.value = downloaderId;
  showDeleteDialog.value = true;
}

async function confirmDeleteDownloader(downloaderId: TDownloaderKey) {
  await metadataStore.removeDownloader(toDeleteId);
  const index = tableSelected.value.indexOf(downloaderId);
  if (index !== -1) {
    tableSelected.value.splice(index, 1);
  }
}
</script>

<template>
  <v-alert :title="t('route.Settings.SetDownloader')" type="info" />
  <v-card class="set-downloader">
    <v-card-title>
      <v-row class="ma-0">
        <v-btn class="mr-2" color="success" prepend-icon="mdi-plus" @click="showAddDialog = true">
          {{ t("common.btn.add") }}
        </v-btn>
        <v-btn
          :disabled="tableSelected.length === 0"
          color="error"
          prepend-icon="mdi-minus"
          @click="deleteDownloader(tableSelected)"
        >
          {{ t("common.remove") }}
        </v-btn>
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :headers="fullTableHeader"
      :items="metadataStore.getDownloaders"
      class="table-stripe"
      item-value="id"
      show-select
    >
      <template #item.type="{ item }">
        <v-avatar :image="getDownloaderIcon(item.type)" :alt="item.type" />
      </template>

      <template #item.id="{ item }">
        <v-row class="ma-0" align="center">
          <code>{{ item.id }}</code>
        </v-row>
      </template>

      <template #item.address="{ item }">
        <a :href="item.address" target="_blank" rel="noopener noreferrer nofollow">
          {{ item.address }}
        </a>
      </template>

      <template #item.enabled="{ item }">
        <div class="d-flex justify-center">
          <v-switch
            v-model="item.enabled"
            class="downloader-switch-btn"
            color="success"
            hide-details
            @update:model-value="(v) => metadataStore.simplePatchDownloader(item.id, 'enabled', v as boolean)"
          />
        </div>
      </template>

      <template #item.feature.DefaultAutoStart="{ item }">
        <div class="d-flex justify-center">
          <v-switch
            v-model="item.feature!.DefaultAutoStart"
            :disabled="!item.enabled || downloaderMetadata?.[item.type]?.feature?.DefaultAutoStart.allowed === false"
            class="downloader-switch-btn"
            color="success"
            hide-details
            @update:model-value="
              (v) => metadataStore.simplePatchDownloader(item.id, 'feature.DefaultAutoStart', v as boolean)
            "
          />
        </div>
      </template>

      <template #item.action="{ item }">
        <v-btn-group class="table-action" density="compact" variant="plain">
          <!-- TODO 查看该下载服务器现状 -->
          <v-btn :disabled="true" icon="mdi-information-outline" size="small"></v-btn>

          <v-btn
            :title="t('common.edit')"
            color="info"
            icon="mdi-pencil"
            size="small"
            @click="editDownloader(item.id)"
          />
          <!-- 该下载服务器下载路径和标签选择 -->
          <v-btn
            :title="t('SetDownloader.index.table.setPathAndTag')"
            color="amber"
            icon="mdi-tag-multiple"
            size="small"
            @click="editDownloaderPathAndTag(item.id)"
          ></v-btn>

          <v-btn
            :title="t('common.remove')"
            color="error"
            icon="mdi-delete"
            size="small"
            @click="deleteDownloader([item.id])"
          />
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <AddDialog v-model="showAddDialog" />
  <EditDialog v-model="showEditDialog" :client-id="toEditDownloaderId!" />
  <PathAndTagSuggestDialog v-model="showPathAndTagSuggestDialog" :client-id="toEditDownloaderId!" />
  <DeleteDialog
    v-model="showDeleteDialog"
    :to-delete-ids="toDeleteIds"
    @confirm-delete="confirmDeleteDownloader"
  ></DeleteDialog>
</template>

<style scoped lang="scss">
.downloader-switch-btn {
  :deep(.v-selection-control) {
    justify-content: center;
  }
}
</style>
