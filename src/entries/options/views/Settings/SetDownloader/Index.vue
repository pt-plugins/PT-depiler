<script setup lang="ts">
import { computed, ref } from "vue";
import { computedAsync } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { countBy } from "es-toolkit";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import type { TDownloaderKey } from "@/shared/storages/types/metadata.ts";
import { getDownloaderIcon, getDownloaderMetaData, type TorrentClientMetaData } from "@ptd/downloader";
import { useTableCustomFilter } from "@/options/directives/useAdvanceFilter.ts";

import AddDialog from "./AddDialog.vue";
import EditDialog from "./EditDialog.vue";
import PathAndTagSuggestDialog from "./PathAndTagSuggestDialog.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";
import NavButton from "@/options/components/NavButton.vue";

const { t } = useI18n();
const metadataStore = useMetadataStore();
const configStore = useConfigStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showPathAndTagSuggestDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const downloaderTypeCount = computed(() => countBy(metadataStore.getDownloaders, (x) => x.type));

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
  { title: t("SetDownloader.common.uid"), key: "id", align: "start", sortable: false },
  { title: t("SetDownloader.common.address"), key: "address", align: "start" },
  { title: t("SetDownloader.common.username"), key: "username", align: "start" },
  { title: t("SetDownloader.index.table.enabled"), key: "enabled", align: "center", filterable: false },
  { title: t("SetDownloader.index.table.autodl"), key: "feature.DefaultAutoStart", align: "center", filterable: false },
  { title: t("common.action"), key: "action", filterable: false, sortable: false },
];
const tableSelected = ref<TDownloaderKey[]>([]);

const booleanField = {
  "feature.DefaultAutoStart": "SetDownloader.index.table.autodl",
  enabled: "SetDownloader.index.table.enabled",
};

const {
  tableWaitFilterRef,
  tableFilterRef,
  tableFilterFn,
  advanceFilterDictRef,
  updateTableFilterValueFn,
  resetAdvanceFilterDictFn,
  toggleKeywordStateFn,
} = useTableCustomFilter({
  parseOptions: {
    keywords: ["type", ...Object.keys(booleanField)],
  },
  titleFields: ["name", "address"],
  format: {
    enabled: "boolean",
    "feature.DefaultAutoStart": "boolean",
  },
  initialItems: metadataStore.getDownloaders,
});

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
  await metadataStore.removeDownloader(downloaderId);
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
        <NavButton
          :text="t('common.btn.add')"
          class="mr-2"
          color="success"
          icon="mdi-plus"
          @click="showAddDialog = true"
        />

        <NavButton
          :disabled="tableSelected.length === 0"
          :text="t('common.remove')"
          color="error"
          icon="mdi-minus"
          @click="deleteDownloader(tableSelected)"
        />

        <v-spacer />

        <v-text-field
          v-model="tableWaitFilterRef"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          label="Search"
          max-width="500"
          single-line
          @click:clear="resetAdvanceFilterDictFn"
        >
          <template #prepend-inner>
            <v-menu min-width="100">
              <template v-slot:activator="{ props }">
                <v-icon icon="mdi-filter" v-bind="props" variant="plain" @click:clear="resetAdvanceFilterDictFn" />
              </template>
              <v-list class="pa-0">
                <v-list-item v-for="(transKey, filterKey) in booleanField">
                  <v-checkbox
                    v-model="advanceFilterDictRef[filterKey].required"
                    :label="t(transKey)"
                    density="compact"
                    hide-details
                    indeterminate
                    true-value="1"
                    @click.stop="(v: any) => toggleKeywordStateFn(filterKey, '1')"
                    @update:model-value="() => updateTableFilterValueFn()"
                  ></v-checkbox>
                </v-list-item>

                <v-divider />

                <v-list-item-subtitle class="ma-2">下载器分类</v-list-item-subtitle>
                <v-list-item v-for="(count, type) in downloaderTypeCount" :key="type" :value="type">
                  <v-checkbox
                    v-model="advanceFilterDictRef.type.required"
                    :label="`${type} (${count})`"
                    :value="type"
                    density="compact"
                    hide-details
                    indeterminate
                    @click.stop="(v: any) => toggleKeywordStateFn('type', type)"
                    @update:model-value="() => updateTableFilterValueFn()"
                  ></v-checkbox>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :custom-filter="tableFilterFn"
      :filter-keys="['id']"
      :headers="fullTableHeader"
      :items="metadataStore.getDownloaders"
      :items-per-page="configStore.tableBehavior.SetDownloader.itemsPerPage"
      :search="tableFilterRef"
      :sort-by="configStore.tableBehavior.SetDownloader.sortBy"
      class="table-stripe"
      hover
      item-value="id"
      multi-sort
      show-select
      @update:itemsPerPage="(v) => configStore.updateTableBehavior('SetDownloader', 'itemsPerPage', v)"
      @update:sortBy="(v) => configStore.updateTableBehavior('SetDownloader', 'sortBy', v)"
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
