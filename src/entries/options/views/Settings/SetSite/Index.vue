<script setup lang="ts">
import { type TSiteID } from "@ptd/site";

import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import { useUIStore } from "@/options/stores/ui.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import AddDialog from "./AddDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";
import EditDialog from "./EditDialog.vue";
import EditSearchEntryList from "./EditSearchEntryList.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import { getSiteFavicon } from "@/shared/adapters/site.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const { t } = useI18n();
const uiStore = useUIStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const tableHeader = [
  // site favicon
  { title: "", key: "userConfig.sortIndex", align: "center", width: 48, alwaysShow: true, filterable: false },
  { title: t("SetSite.common.name"), key: "name", align: "left", width: 120, alwaysShow: true, sortable: false },
  { title: t("SetSite.common.url"), key: "url", align: "start", sortable: false },
  { title: t("SetSite.common.isOffline"), key: "userConfig.isOffline", align: "center", width: 180, filterable: false },
  {
    title: t("SetSite.common.allowSearch"),
    key: "userConfig.allowSearch",
    align: "center",
    width: 180,
    filterable: false,
  },
  {
    title: t("SetSite.common.allowQueryUserInfo"),
    key: "userConfig.allowQueryUserInfo",
    align: "center",
    width: 180,
    filterable: false,
  },
  {
    title: t("common.action"),
    key: "action",
    sortable: false,
    filterable: false,
    alwaysShow: true,
  },
];

const tableFilter = ref("");
const tableSelected = ref<TSiteID[]>([]);

const sites = computedAsync(async () => {
  const sitesReturn = [];
  for (const [siteId, siteUserConfig] of Object.entries(metadataStore.sites)) {
    sitesReturn.push({
      id: siteId,
      metadata: await metadataStore.getSiteMetadata(siteId),
      userConfig: siteUserConfig,
    });
  }

  return sitesReturn;
});

const toEditId = ref<TSiteID | null>("");
function editSite(siteId: TSiteID) {
  toEditId.value = siteId;
  showEditDialog.value = true;
}

const toDeleteIds = ref<TSiteID[]>([]);
function deleteSite(siteId: TSiteID | TSiteID[]) {
  toDeleteIds.value = Array.isArray(siteId) ? siteId : [siteId];
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

const isFaviconFlushing = ref(false);
async function flushSiteFavicon(siteId: TSiteID | TSiteID[]) {
  const siteIds = Array.isArray(siteId) ? siteId : [siteId];
  for (const id of siteIds) {
    await getSiteFavicon(id, true);
  }
  runtimeStore.showSnakebar(t("SetSite.index.flushFaviconFinish"), { color: "success" });
}
</script>

<template>
  <v-alert :title="t('route.Settings.SetSite')" type="info" />
  <v-card class="set-site">
    <v-card-title>
      <v-row class="ma-0">
        <v-btn class="mr-2" color="success" prepend-icon="mdi-plus" @click="showAddDialog = true">
          {{ t("common.btn.add") }}
        </v-btn>
        <v-btn
          :disabled="tableSelected.length === 0"
          color="error"
          prepend-icon="mdi-minus"
          @click="deleteSite(tableSelected)"
        >
          {{ t("common.remove") }}
        </v-btn>
        <v-divider class="mx-3" inset vertical />
        <v-btn-group density="compact" size="small">
          <v-btn
            :disabled="tableSelected.length === 0"
            :loading="isFaviconFlushing"
            color="indigo"
            prepend-icon="mdi-face-recognition"
            @click="() => flushSiteFavicon(tableSelected)"
            >{{ t("SetSite.index.table.flushFavicon") }}</v-btn
          >
        </v-btn-group>

        <!-- TODO 一键导入站点 -->
        <v-spacer />
        <v-text-field
          v-model="tableFilter"
          append-icon="mdi-magnify"
          density="compact"
          hide-details
          label="Search"
          single-line
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :headers="tableHeader"
      :items="sites"
      :items-per-page="uiStore.tableBehavior.SetSite.itemsPerPage"
      :search="tableFilter"
      :sort-by="uiStore.tableBehavior.SetSite.sortBy"
      class="table-stripe"
      item-value="id"
      multi-sort
      show-select
      @update:itemsPerPage="(v) => uiStore.updateTableBehavior('SetSite', 'itemsPerPage', v)"
      @update:sortBy="(v) => uiStore.updateTableBehavior('SetSite', 'sortBy', v)"
    >
      <template #item.userConfig.sortIndex="{ item }">
        <SiteFavicon :site-id="item.id" />
      </template>
      <template #item.name="{ item }">
        {{ item.userConfig?.merge?.name ?? item.metadata?.name }}
      </template>
      <template #item.url="{ item }">
        <a :href="item.userConfig?.url ?? item.metadata?.urls?.[0]" target="_blank">
          {{ item.userConfig?.url ?? item.metadata?.urls?.[0] }}
        </a>
      </template>
      <template #item.userConfig.isOffline="{ item }">
        <v-switch
          v-model="item.userConfig.isOffline"
          class="site-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatchSite(item.id, 'isOffline', v as boolean)"
        />
      </template>
      <template #item.userConfig.allowSearch="{ item }">
        <v-switch
          v-model="item.userConfig.allowSearch"
          :disabled="item.userConfig.isOffline || !Object.hasOwn(item.metadata, 'search')"
          class="site-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatchSite(item.id, 'allowSearch', v as boolean)"
        />
      </template>
      <template #item.userConfig.allowQueryUserInfo="{ item }">
        <v-switch
          v-model="item.userConfig.allowQueryUserInfo"
          :disabled="item.userConfig.isOffline || !Object.hasOwn(item.metadata, 'userInfo')"
          class="site-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatchSite(item.id, 'allowQueryUserInfo', v as boolean)"
        />
      </template>
      <template #item.action="{ item }">
        <v-btn-group class="table-action" density="compact" variant="plain">
          <!-- 站点信息编辑 -->
          <v-btn
            :title="t('common.edit')"
            color="info"
            icon="mdi-pencil"
            size="small"
            @click="() => editSite(item.id)"
          />

          <!-- 默认站点搜索入口编辑（只有配置了 siteMetadata.searchEntry 的站点才支持该设置） -->
          <v-btn :disabled="!item.metadata.searchEntry" class="v-btn--icon" size="small">
            <v-icon icon="mdi-magnify"></v-icon>
            <v-menu :close-on-content-click="false" activator="parent">
              <EditSearchEntryList :item="item" />
            </v-menu>
          </v-btn>

          <v-btn
            :loading="isFaviconFlushing"
            :title="t('SetSite.index.table.flushFavicon')"
            color="indigo"
            icon="mdi-face-recognition"
            size="small"
            @click="() => flushSiteFavicon(item.id)"
          ></v-btn>

          <v-btn
            :title="t('common.remove')"
            color="error"
            icon="mdi-delete"
            size="small"
            @click="() => deleteSite(item.id)"
          >
          </v-btn>
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <AddDialog v-model="showAddDialog" />
  <DeleteDialog v-model="showDeleteDialog" v-model:to-delete-ids="toDeleteIds" />
  <EditDialog v-model="showEditDialog" :site-id="toEditId!" />
</template>

<style scoped lang="scss">
.site-switch-btn {
  :deep(.v-selection-control) {
    justify-content: center;
  }
}
</style>
