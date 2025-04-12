<script setup lang="ts">
import { ref, watch } from "vue";
import { computedAsync } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { TDownloaderKey } from "@/shared/storages/metadata.ts";
import { getDownloaderIcon, getDownloaderMetaData, type TorrentClientMetaData } from "@ptd/downloader";

import AddDialog from "./AddDialog.vue";
import EditDialog from "./EditDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";
import PathAndTagSuggestDialog from "@/options/views/Settings/SetDownloader/PathAndTagSuggestDialog.vue";

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
function deleteDownloader(downloaderId: TDownloaderKey | TDownloaderKey[]) {
  toDeleteIds.value = Array.isArray(downloaderId) ? downloaderId : [downloaderId];
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
  <v-alert type="info" :title="t('route.Settings.SetDownloader')" />
  <v-card class="set-downloader">
    <v-card-title>
      <v-row class="ma-0">
        <v-btn color="success" prepend-icon="mdi-plus" class="mr-2" @click="showAddDialog = true">
          {{ t("common.btn.add") }}
        </v-btn>
        <v-btn
          color="error"
          prepend-icon="mdi-minus"
          :disabled="tableSelected.length === 0"
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
            color="success"
            hide-details
            class="downloader-switch-btn"
            @update:model-value="(v) => metadataStore.simplePatchDownloader(item.id, 'enabled', v as boolean)"
          />
        </div>
      </template>

      <template #item.feature.DefaultAutoStart="{ item }">
        <div class="d-flex justify-center">
          <v-switch
            v-model="item.feature!.DefaultAutoStart"
            color="success"
            hide-details
            class="downloader-switch-btn"
            :disabled="!item.enabled || downloaderMetadata?.[item.type]?.feature?.DefaultAutoStart.allowed === false"
            @update:model-value="
              (v) => metadataStore.simplePatchDownloader(item.id, 'feature.DefaultAutoStart', v as boolean)
            "
          />
        </div>
      </template>

      <template #item.action="{ item }">
        <v-btn-group variant="plain" density="compact" class="table-action">
          <!-- TODO 查看该下载服务器现状 -->
          <v-btn size="small" icon="mdi-information-outline" :disabled="true"></v-btn>

          <v-btn
            size="small"
            icon="mdi-pencil"
            color="info"
            :title="t('common.edit')"
            @click="editDownloader(item.id)"
          />
          <!-- 该下载服务器下载路径和标签选择 -->
          <v-btn
            size="small"
            icon="mdi-tag-multiple"
            color="amber"
            :title="t('SetDownloader.index.table.setPathAndTag')"
            @click="editDownloaderPathAndTag(item.id)"
          ></v-btn>

          <v-btn
            size="small"
            icon="mdi-delete"
            color="error"
            :title="t('common.remove')"
            @click="deleteDownloader(item.id)"
          />
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <AddDialog v-model="showAddDialog" />
  <EditDialog v-model="showEditDialog" :client-id="toEditDownloaderId" />
  <PathAndTagSuggestDialog v-model="showPathAndTagSuggestDialog" :client-id="toEditDownloaderId" />
  <DeleteDialog v-model="showDeleteDialog" v-model:to-delete-ids="toDeleteIds" />
</template>

<style scoped lang="scss">
.downloader-switch-btn {
  :deep(.v-selection-control) {
    justify-content: center;
  }
}
</style>
