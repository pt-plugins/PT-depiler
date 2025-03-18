<script setup lang="ts">
import { type TSiteID } from "@ptd/site";

import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import { useUIStore } from "@/options/stores/ui.ts";
import { useSiteStore } from "@/options/stores/site.ts";

import AddDialog from "./AddDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";
import EditDialog from "./EditDialog.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";

const { t } = useI18n();
const uiStore = useUIStore();
const siteStore = useSiteStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const fullTableHeader = [
  // site favicon
  { title: "", key: "sortIndex", align: "center", width: 48, alwaysShow: true },
  { title: t("setSite.common.name"), key: "name", align: "left", width: 120, alwaysShow: true },
  { title: t("setSite.common.url"), key: "url", align: "start" },
  { title: t("setSite.common.isOffline"), key: "isOffline", align: "center", width: 180 },
  { title: t("setSite.common.allowSearch"), key: "allowSearch", align: "center", width: 180 },
  {
    title: t("setSite.common.allowQueryUserInfo"),
    key: "allowQueryUserInfo",
    align: "center",
    width: 180,
  },
  {
    title: t("common.action"),
    key: "action",
    sortable: false,
    alwaysShow: true,
  },
];

const tableHeader = computed(() => {
  return fullTableHeader.filter((item) => item.alwaysShow || uiStore.tableBehavior.SetSite.columns!.includes(item.key));
});

const tableFilter = ref("");
const tableSelected = ref<TSiteID[]>([]);

const sites = computedAsync(async () => {
  const sitesReturn = [];
  for (const [siteId, siteUserConfig] of Object.entries(siteStore.sites)) {
    sitesReturn.push({
      id: siteId,
      metadata: await siteStore.getSiteMetadata(siteId),
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
      <template #item.sortIndex="{ item }">
        <SiteFavicon :site-id="item.id" />
      </template>
      <template #item.name="{ item }">
        {{ item.userConfig?.merge?.name ?? item.metadata?.name }}
      </template>
      <template #item.url="{ item }">
        {{ item.userConfig?.url ?? item.metadata?.urls?.[0] }}
      </template>
      <template #item.isOffline="{ item }">
        <v-switch
          v-model="item.userConfig.isOffline"
          color="success"
          hide-details
          class="site-switch-btn"
          @update:model-value="(v) => siteStore.simplePatchSite(item.id, 'isOffline', v as boolean)"
        />
      </template>
      <template #item.allowSearch="{ item }">
        <v-switch
          v-model="item.userConfig.allowSearch"
          color="success"
          hide-details
          class="site-switch-btn"
          :disabled="item.userConfig.isOffline || !Object.hasOwn(item.metadata, 'search')"
          @update:model-value="(v) => siteStore.simplePatchSite(item.id, 'allowSearch', v as boolean)"
        />
      </template>
      <template #item.allowQueryUserInfo="{ item }">
        <v-switch
          v-model="item.userConfig.allowQueryUserInfo"
          color="success"
          hide-details
          class="site-switch-btn"
          :disabled="item.userConfig.isOffline || !Object.hasOwn(item.metadata, 'userInfo')"
          @update:model-value="(v) => siteStore.simplePatchSite(item.id, 'allowQueryUserInfo', v as boolean)"
        />
      </template>
      <template #item.action="{ item }">
        <v-btn-group variant="plain">
          <v-btn
            size="small"
            icon="mdi-pencil"
            :title="$t('common.edit')"
            color="info"
            @click="() => editSite(item.id)"
          />
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
  <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" />
  <EditDialog v-model="showEditDialog" :site-id="toEditId!" />
</template>

<style scoped lang="scss">
.site-switch-btn {
  :deep(.v-selection-control) {
    justify-content: center;
  }
}
</style>
