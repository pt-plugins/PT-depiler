<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { TDownloaderKey } from "@/shared/storages/metadata.ts";
import { getDownloaderIcon } from "@ptd/downloader";

import AddDialog from "./AddDialog.vue";
import EditDialog from "./EditDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";

const { t } = useI18n();
const metadataStore = useMetadataStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const fullTableHeader = [
  { title: "类型", key: "type", align: "center", filterable: false },
  { title: "名称", key: "name", align: "start" },
  { title: "UID", key: "id", align: "start", filterable: false, sortable: false },
  { title: "地址", key: "address", align: "start" },
  { title: "用户名", key: "username", align: "start" },
  { title: t("common.action"), key: "action", filterable: false, sortable: false },
];
const tableSelected = ref<TDownloaderKey[]>([]);

const toEditDownloaderConfig = ref({});
function editDownloader(downloaderId: TDownloaderKey) {
  toEditDownloaderConfig.value = metadataStore.downloaders[downloaderId];
  showEditDialog.value = true;
}

const toDeleteIds = ref<TDownloaderKey[]>([]);
function deleteDownloader(downloaderId: TDownloaderKey) {
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
          {{ $t("common.btn.add") }}
        </v-btn>
        <v-btn
          color="error"
          prepend-icon="mdi-minus"
          :disabled="tableSelected.length === 0"
          @click="deleteDownloader(tableSelected)"
        >
          {{ $t("common.remove") }}
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

      <template #item.action="{ item }">
        <v-btn
          size="small"
          icon="mdi-pencil"
          variant="plain"
          :title="$t('common.edit')"
          @click="editDownloader(item.id)"
        />
        <v-btn
          size="small"
          icon="mdi-delete"
          variant="plain"
          color="error"
          :title="$t('common.remove')"
          @click="deleteDownloader(item.id)"
        />
      </template>
    </v-data-table>
  </v-card>

  <AddDialog v-model="showAddDialog" />
  <EditDialog v-model="showEditDialog" :client-config="toEditDownloaderConfig" />
  <DeleteDialog v-model="showDeleteDialog" v-model:to-delete-ids="toDeleteIds" />
</template>

<style scoped lang="scss"></style>
