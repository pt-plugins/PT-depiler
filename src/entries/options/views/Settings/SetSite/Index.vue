<script setup lang="ts">
import { type TSiteID } from "@ptd/site";

import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import { useUIStore } from "@/options/stores/ui.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import AddDialog from "./AddDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";
import EditDialog from "./EditDialog.vue";
import EditSearchEntryList from "./EditSearchEntryList.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";

const { t } = useI18n();
const uiStore = useUIStore();
const metadataStore = useMetadataStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const tableHeader = [
  // site favicon
  { title: "", key: "userConfig.sortIndex", align: "center", width: 48, alwaysShow: true, filterable: false },
  { title: t("setSite.common.name"), key: "name", align: "left", width: 120, alwaysShow: true, sortable: false },
  { title: t("setSite.common.url"), key: "url", align: "start", sortable: false },
  { title: t("setSite.common.isOffline"), key: "userConfig.isOffline", align: "center", width: 180, filterable: false },
  {
    title: t("setSite.common.allowSearch"),
    key: "userConfig.allowSearch",
    align: "center",
    width: 180,
    filterable: false,
  },
  {
    title: t("setSite.common.allowQueryUserInfo"),
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
</script>

<template>
  <v-alert type="info" :title="$t('route.Settings.SetSite')" />
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-btn color="success" prepend-icon="mdi-plus" class="mr-2" @click="showAddDialog = true">
          {{ $t("common.btn.add") }}
        </v-btn>
        <v-btn
          :disabled="tableSelected.length === 0"
          color="error"
          prepend-icon="mdi-minus"
          @click="deleteSite(tableSelected)"
        >
          {{ $t("common.remove") }}
        </v-btn>
        <v-divider class="mx-3" inset vertical />
        <!-- TODO 一键导入站点 -->
        <v-spacer />
        <v-text-field
          v-model="tableFilter"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          density="compact"
          hide-details
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :headers="tableHeader"
      :items="sites"
      :items-per-page="uiStore.tableBehavior.SetSite.itemsPerPage"
      item-value="id"
      :sort-by="uiStore.tableBehavior.SetSite.sortBy"
      multi-sort
      :search="tableFilter"
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
          color="success"
          hide-details
          class="site-switch-btn"
          @update:model-value="(v) => metadataStore.simplePatchSite(item.id, 'isOffline', v as boolean)"
        />
      </template>
      <template #item.userConfig.allowSearch="{ item }">
        <v-switch
          v-model="item.userConfig.allowSearch"
          color="success"
          hide-details
          class="site-switch-btn"
          :disabled="item.userConfig.isOffline || !Object.hasOwn(item.metadata, 'search')"
          @update:model-value="(v) => metadataStore.simplePatchSite(item.id, 'allowSearch', v as boolean)"
        />
      </template>
      <template #item.userConfig.allowQueryUserInfo="{ item }">
        <v-switch
          v-model="item.userConfig.allowQueryUserInfo"
          color="success"
          hide-details
          class="site-switch-btn"
          :disabled="item.userConfig.isOffline || !Object.hasOwn(item.metadata, 'userInfo')"
          @update:model-value="(v) => metadataStore.simplePatchSite(item.id, 'allowQueryUserInfo', v as boolean)"
        />
      </template>
      <template #item.action="{ item }">
        <v-btn-group variant="plain">
          <!-- 站点信息编辑 -->
          <v-btn
            size="small"
            icon="mdi-pencil"
            :title="$t('common.edit')"
            color="info"
            @click="() => editSite(item.id)"
          />

          <!-- 默认站点搜索入口编辑（只有配置了 siteMetadata.searchEntry 的站点才支持该设置） -->
          <v-btn size="small" :disabled="!item.metadata.searchEntry">
            <v-icon icon="mdi-magnify"></v-icon>
            <v-menu activator="parent" :close-on-content-click="false">
              <EditSearchEntryList :item="item" />
            </v-menu>
          </v-btn>

          <v-btn
            size="small"
            icon="mdi-delete"
            :title="$t('common.remove')"
            color="error"
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
