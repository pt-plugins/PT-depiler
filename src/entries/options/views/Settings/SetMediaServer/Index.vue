<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { DataTableHeader } from "vuetify";
import { getMediaServer, getMediaServerIcon } from "@ptd/mediaServer";
import type { IMediaServerBaseConfig } from "@ptd/mediaServer";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useTableActionColumn } from "@/options/directives/useTableActionColumn.ts";
import type { TDownloaderKey, TMediaServerKey } from "@/shared/types.ts";

import AddDialog from "./AddDialog.vue";
import EditDialog from "./EditDialog.vue";
import OverviewDialog from "./OverviewDialog.vue";
import NavButton from "@/options/components/NavButton.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";

const { t } = useI18n();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const fullTableHeader = computed(() =>
  useTableActionColumn([
    { title: t("common.type"), key: "type", align: "center" },
    { title: t("SetDownloader.common.name"), key: "name", align: "start" },
    { title: t("SetDownloader.common.address"), key: "address", align: "start" },
    { title: t("SetMediaServer.Index.status"), key: "status", align: "center", sortable: false },
    { title: t("SetDownloader.index.table.enabled"), key: "enabled", align: "center" },
    { title: t("common.action"), key: "action", sortable: false },
  ] as DataTableHeader[]),
);

/** 服务器状态列：逐台 ping 一次，记录是否可达与耗时 */
interface IMediaServerStatus {
  checking: boolean;
  tested: boolean;
  ok: boolean;
  ms?: number;
}

const statuses = ref<Record<string, IMediaServerStatus>>({});
function statusOf(id: string): IMediaServerStatus {
  return (statuses.value[id] ??= { checking: false, tested: false, ok: false });
}

async function checkStatus(mediaServer: IMediaServerBaseConfig) {
  const state = statusOf(mediaServer.id!);
  state.checking = true;
  const startedAt = Date.now();
  try {
    const client = await getMediaServer(mediaServer);
    state.ok = await client.ping();
  } catch (e) {
    state.ok = false;
  } finally {
    state.ms = Date.now() - startedAt;
    state.checking = false;
    state.tested = true;
  }
}

async function checkAllStatus() {
  await Promise.all(metadataStore.getMediaServers.map((mediaServer) => checkStatus(mediaServer)));
}

const tableSelected = ref<TMediaServerKey[]>([]);

const toEditMediaServerId = ref<TMediaServerKey | null>(null);
function editMediaServer(mediaServerId: TMediaServerKey) {
  toEditMediaServerId.value = mediaServerId;
  showEditDialog.value = true;
}

const toDeleteIds = ref<TMediaServerKey[]>([]);
function deleteMediaServer(mediaServerId: TMediaServerKey[]) {
  toDeleteIds.value = mediaServerId;
  showDeleteDialog.value = true;
}

// 调研 C14 / C20：概览**按需生成** —— 只有点开弹窗时才去遍历整库并聚合
const showOverviewDialog = ref<boolean>(false);
const toOverviewMediaServerId = ref<TMediaServerKey | null>(null);
function overviewMediaServer(mediaServerId: TMediaServerKey) {
  toOverviewMediaServerId.value = mediaServerId;
  showOverviewDialog.value = true;
}

async function confirmDeleteMediaServer(mediaServerId: TMediaServerKey) {
  return await metadataStore.removeMediaServer(mediaServerId);
}
</script>

<template>
  <v-alert :title="t('route.Settings.SetMediaServer')" type="info" />
  <v-card class="set-media-server">
    <v-card-title>
      <v-row gap="0" class="ma-0">
        <NavButton :text="t('common.btn.add')" color="success" icon="mdi-plus" @click="showAddDialog = true" />
        <NavButton
          :disabled="tableSelected.length === 0"
          :text="t('common.remove')"
          color="error"
          icon="mdi-minus"
          @click="deleteMediaServer(tableSelected)"
        />
        <NavButton
          :text="t('SetMediaServer.Index.refreshStatus')"
          color="info"
          icon="mdi-access-point-check"
          @click="checkAllStatus"
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

      <template #item.status="{ item }">
        <div class="d-flex align-center justify-center">
          <v-progress-circular v-if="statusOf(item.id).checking" indeterminate size="16" width="2" />
          <template v-else>
            <v-icon
              :color="statusOf(item.id).tested ? (statusOf(item.id).ok ? 'success' : 'error') : 'grey'"
              :icon="
                !statusOf(item.id).tested
                  ? 'mdi-access-point'
                  : statusOf(item.id).ok
                    ? 'mdi-access-point-check'
                    : 'mdi-access-point-remove'
              "
            />
            <span class="ml-1 text-caption">
              {{
                !statusOf(item.id).tested
                  ? t("SetMediaServer.Index.statusUntested")
                  : statusOf(item.id).ok
                    ? `${statusOf(item.id).ms} ms`
                    : t("SetMediaServer.Index.statusOffline")
              }}
            </span>
          </template>
          <v-btn
            class="ml-1"
            density="compact"
            icon="mdi-refresh"
            size="x-small"
            :title="t('SetMediaServer.Index.refreshStatus')"
            variant="text"
            @click="() => checkStatus(item)"
          />
        </div>
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
            :title="t('SetMediaServer.Overview.title')"
            color="info"
            icon="mdi-chart-box-outline"
            size="small"
            @click="overviewMediaServer(item.id)"
          />
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
    <OverviewDialog
      v-model="showOverviewDialog"
      :media-server-id="toOverviewMediaServerId!"
      :media-server-name="metadataStore.mediaServers[toOverviewMediaServerId!]?.name"
    />

    <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" :confirm-delete="confirmDeleteMediaServer" />
  </v-card>
</template>

<style scoped lang="scss"></style>
