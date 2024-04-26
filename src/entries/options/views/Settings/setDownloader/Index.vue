<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDownloaderStore } from "@/shared/store/downloader.ts";
import { type DownloaderBaseConfig, getDownloaderIcon } from "@ptd/downloader";
import AddDialog from "./AddDialog.vue";
import EditDialog from "./EditDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";

const { t } = useI18n();
const downloaderStore = useDownloaderStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const clientTableSearch = ref("");
const clientTableSelected = ref<string[]>([]);
const clientTableHeader = [
  {
    title: t("setDownloader.common.type"),
    key: "type",
    align: "center",
    filterable: false,
    width: 80,
  },
  {
    title: t("setDownloader.common.name"),
    key: "name",
    align: "start",
  },
  {
    title: t("setDownloader.common.uid"),
    key: "id",
    align: "start",
    filterable: false,
    sortable: false,
  },
  {
    title: t("setDownloader.common.address"),
    key: "address",
    align: "start",
  },
  {
    title: t("setDownloader.common.username"),
    key: "username",
    align: "start",
  },
  {
    title: t("common.action"),
    key: "action",
    filterable: false,
    sortable: false,
  },
];

const clientConfig = ref<DownloaderBaseConfig>();
function editDownloader(perEditClientConfig: any) {
  clientConfig.value = perEditClientConfig;
  showEditDialog.value = true;
}

const showSetDefaultDownloaderSnackbar = ref<boolean>(false);
function setDefaultDownloader(clientId: string) {
  downloaderStore.defaultDownloaderId = clientId;
  showSetDefaultDownloaderSnackbar.value = true;
}

const toDeleteIds = ref<string[]>([]);
function deleteDownloader(clientId: string | string[]) {
  if (typeof clientId === "string") {
    clientId = [clientId];
  }
  toDeleteIds.value = clientId;
  showDeleteDialog.value = true;
}
</script>

<template>
  <v-alert type="info" :title="$t('route.Settings.setDownloader')" />
  <v-card class="set-downloader">
    <v-card-title>
      <v-row class="ma-0">
        <v-btn
          color="success"
          prepend-icon="mdi-plus"
          class="mr-2"
          @click="showAddDialog = true"
        >
          {{ $t("common.btn.add") }}
        </v-btn>
        <v-btn
          color="error"
          prepend-icon="mdi-minus"
          :disabled="clientTableSelected.length === 0"
          @click="deleteDownloader(clientTableSelected)"
        >
          {{ $t("common.remove") }}
        </v-btn>
        <v-spacer />
        <v-text-field
          v-model="clientTableSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          density="compact"
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="clientTableSelected"
      :headers="clientTableHeader"
      :items="downloaderStore.clients"
      :items-per-page="-1"
      :search="clientTableSearch"
      item-value="id"
      show-select
      must-sort
    >
      <template #item.type="{ item }">
        <v-avatar :image="getDownloaderIcon(item.type)" :alt="item.type" />
      </template>
      <template #item.id="{ item }">
        <v-row class="ma-0" align="center">
          <code>{{ item.id }}</code>
          <template v-if="downloaderStore.isDefaultDownloader(item.id)">
            <v-spacer />
            <v-chip label small color="blue">
              {{ $t("common.default") }}
            </v-chip>
          </template>
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
          icon="mdi-home"
          variant="plain"
          class="mr-2"
          :disabled="downloaderStore.isDefaultDownloader(item.id)"
          :title="$t('setDownloader.index.table.action.setDefault')"
          @click="setDefaultDownloader(item.id)"
        />
        <v-btn
          size="small"
          icon="mdi-pencil"
          variant="plain"
          :title="$t('common.edit')"
          @click="editDownloader(item)"
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

    <!-- 应该放入data-table的 no-data slot -->
    <v-alert v-if="downloaderStore.clients.length === 0">
      {{ $t("setDownloader.index.emptyNotice") }}
    </v-alert>
  </v-card>

  <!-- Components -->
  <AddDialog v-model="showAddDialog" />
  <EditDialog v-model="showEditDialog" :client-config="clientConfig" />
  <DeleteDialog v-model="showDeleteDialog" v-model:to-delete-ids="toDeleteIds" />

  <!-- Snackbar - 设置默认下载器 -->
  <v-snackbar v-model="showSetDefaultDownloaderSnackbar">
    {{ $t("setDownloader.index.changeDefaultDownloader") }}
  </v-snackbar>
</template>

<style scoped></style>
