<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";
import { getMediaServerIcon } from "@ptd/mediaServer";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import type { TDownloaderKey, TMediaServerKey } from "@/shared/types.ts";

import AddDialog from "./AddDialog.vue";
import EditDialog from "./EditDialog.vue";
import NavButton from "@/options/components/NavButton.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";

const { t } = useI18n();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const fullTableHeader = [
  { title: t("SetDownloader.common.type"), key: "type", align: "center" },
  { title: t("SetDownloader.common.name"), key: "name", align: "start" },
  { title: t("SetDownloader.common.address"), key: "address", align: "start" },
  { title: t("SetDownloader.index.table.enabled"), key: "enabled", align: "center" },
  { title: t("common.action"), key: "action", sortable: false },
] as DataTableHeader[];
const tableSelected = ref<TMediaServerKey[]>([]);

const toEditMediaServerId = ref<TDownloaderKey | null>(null);
function editMediaServer(mediaServerId: TMediaServerKey) {
  toEditMediaServerId.value = mediaServerId;
  showEditDialog.value = true;
}

const toDeleteIds = ref<TMediaServerKey[]>([]);
function deleteMediaServer(mediaServerId: TMediaServerKey[]) {
  toDeleteIds.value = mediaServerId;
  showDeleteDialog.value = true;
}

async function confirmDeleteMediaServer(mediaServerId: TMediaServerKey) {
  return await metadataStore.removeMediaServer(mediaServerId);
}
</script>

<template>
  <v-alert :title="t('route.Settings.SetMediaServer')" type="info" />
  <v-card class="set-media-server">
    <v-card-title>
      <v-row class="ma-0">
        <NavButton :text="t('common.btn.add')" color="success" icon="mdi-plus" @click="showAddDialog = true" />
        <NavButton
          :disabled="tableSelected.length === 0"
          :text="t('common.remove')"
          color="error"
          icon="mdi-minus"
          @click="deleteMediaServer(tableSelected)"
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :headers="fullTableHeader"
      :items="metadataStore.getMediaServers"
      class="table-stripe table-header-no-wrap"
      hover
      item-value="id"
      :multi-sort="configStore.enableTableMultiSort"
      show-select
    >
      <template #item.type="{ item }">
        <v-avatar :image="getMediaServerIcon(item.type)" :alt="item.type" />
      </template>

      <template #item.address="{ item }">
        <a
          :href="item.address"
          class="text-primary font-weight-medium text-decoration-underline"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          {{ item.address }}
          <v-icon icon="mdi-open-in-new" size="x-small"></v-icon>
        </a>
      </template>

      <template #item.enabled="{ item }">
        <v-switch
          v-model="item.enabled"
          class="table-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatch('mediaServers', item.id, 'enabled', v as boolean)"
        />
      </template>

      <template #item.action="{ item }">
        <v-btn-group class="table-action" density="compact" variant="plain">
          <v-btn
            :title="t('common.edit')"
            color="info"
            icon="mdi-pencil"
            size="small"
            @click="editMediaServer(item.id)"
          />
          <v-btn
            :title="t('common.remove')"
            color="error"
            icon="mdi-delete"
            size="small"
            @click="deleteMediaServer([item.id])"
          />
        </v-btn-group>
      </template>
    </v-data-table>

    <AddDialog v-model="showAddDialog" />
    <EditDialog v-model="showEditDialog" :client-id="toEditMediaServerId!" />

    <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" :confirm-delete="confirmDeleteMediaServer" />
  </v-card>
</template>

<style scoped lang="scss"></style>
