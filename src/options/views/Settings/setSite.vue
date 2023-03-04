<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";

import { useSiteStore, siteFavicons } from "@/shared/store/site";
import { type SiteID } from "@ptpp/site";
import { getSiteFavicon, ISiteRuntimeConfig } from "@/shared/adapters/site";

import AddDialog from "@/options/components/Settings/setSite/AddDialog.vue";
import DeleteDialog from "@/options/components/Settings/setSite/DeleteDialog.vue";
import ExpandInfo from "@/options/components/Settings/setSite/ExpandInfo.vue";
import TypeAndSchemaChip from "@/options/components/Settings/setSite/TypeAndSchemaChip.vue";
import EditDialog from "@/options/components/Settings/setSite/EditDialog.vue";

const { t } = useI18n();
const siteStore = useSiteStore();

console.log(siteStore);

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);  // TODO
const showDeleteDialog = ref<boolean>(false);

const sites = computedAsync(async () => await siteStore.getSites(), []);

const siteTableSearch = ref("");
const siteTableSelected = ref<string[]>([]);
const siteTableSort = reactive([
  { key: "sortIndex", order: "desc" },
  { key: "isOffline", order: "asc" },
  { key: "allowSearch", order: "desc" },
  { key: "allowQueryUserInfo", order: "desc" }
]);  // FIXME move to ui store
const siteTableHeader = [
  {
    title: "",  // site favicon
    key: "sortIndex",
    align: "center",
    filterable: false,
    width: 48
  },
  {
    title: t("setSite.common.name"),
    key: "name",
    align: "center",
    width: 120
  },
  {
    title: t("setSite.common.type"),
    key: "type",
    filterable: false,
    align: "center",
    width: 100
  },
  {
    title: t("setSite.common.url"),
    key: "url",
    align: "start"
  },
  {
    title: t("setSite.common.tags"),
    key: "tags",
    align: "start",
    sortable: false,
    width: 150
  },
  {
    title: t("setSite.common.isOffline"),
    key: "isOffline",
    align: "start",
    filterable: false,
    width: 110,
  },
  {
    title: t("setSite.common.allowSearch"),
    key: "allowSearch",
    align: "center",
    filterable: false,
    width: 100,
  },
  {
    title: t("setSite.common.allowQueryUserInfo"),
    key: "allowQueryUserInfo",
    align: "center",
    filterable: false,
    width: 110,
  },
  {
    title: t("setSite.common.showMessageCount"),
    key: "showMessageCount",
    align: "center",
    filterable: false,
    width: 110
  },
  {
    title: t("common.action"),
    key: "action",
    filterable: false,
    sortable: false
  }
];

const siteConfig = ref<ISiteRuntimeConfig>();
function editSite (site: ISiteRuntimeConfig) {
  siteConfig.value = site;
  showEditDialog.value = true;
}

const toDeleteIds = ref<string[]>([]);
function deleteSite (siteId: SiteID | SiteID[]) {
  if (typeof siteId === "string") {
    siteId = [siteId];
  }
  toDeleteIds.value = siteId;
  showDeleteDialog.value = true;
}

const log = console.log;
</script>

<template>
  <v-alert type="info">
    {{ $t("route.Settings.setSite") }}
  </v-alert>
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-btn
          color="success" prepend-icon="mdi-plus"
          class="mr-2"
          @click="showAddDialog = true"
        >
          {{ $t("common.btn.add") }}
        </v-btn>
        <v-btn
          :disabled="siteTableSelected.length === 0"
          color="error" prepend-icon="mdi-minus"
          @click="deleteSite(siteTableSelected)"
        >
          {{ $t("common.remove") }}
        </v-btn>
        <v-divider class="mx-3" inset vertical />
        <!-- TODO 一键导入站点 -->
        <v-spacer />
        <v-text-field
          v-model="siteTableSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          density="compact"
          hide-details
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="siteTableSelected"
      :headers="siteTableHeader"
      :items="sites"
      :items-per-page="50"
      item-value="id"
      :sort-by="siteTableSort"
      multi-sort
      :search="siteTableSearch"
      show-select
    >
      <template #item.sortIndex="{ item }">
        <v-btn
          icon flat
          :loading="siteFavicons[item.raw.id] === false"
          @click="getSiteFavicon(item.raw.id, true)"
        >
          <v-avatar :image="siteFavicons[item.raw.id] || ''" />
        </v-btn>
      </template>
      <template #item.name="{ item }">
        <ExpandInfo :main="item.raw.name" :expand="item.raw.aka">
          <template #default="{ data, field }">
            <span :title="field === 'main' ? (item.raw.description ?? '') : ''">{{ data }}</span>
          </template>
        </ExpandInfo>
      </template>
      <template #item.type="{ item }">
        <TypeAndSchemaChip :site="item.raw" />
      </template>
      <template #item.url="{ item }">
        <ExpandInfo
          :main="item.raw.url" :expand="item.raw.legacyUrls"
          :open="item.raw.legacyUrls?.includes(item.raw.activateUrl)"
        >
          <template #default="{ data, field }">
            <a
              v-if="data.startsWith('http')"
              :href="
                (field === 'main' || item.raw.activateUrl === data)
                  ? (item.raw.entryPoint ?? data)
                  : data /* 存在entryPoint时，替换和url或activateUrl相同的地址为entryPoint */"
              target="_blank" rel="noopener noreferrer nofollow"
              :class="[item.raw.activateUrl === data && 'font-weight-bold']"
            >{{ data }}</a>
            <template v-else>
              {{ data }}
            </template>
          </template>
        </ExpandInfo>
      </template>
      <template #item.tags="{ item }">
        <v-chip
          v-for="tag in item.raw.tags?.slice(0,4) /* 只显示前4个tag */" :key="tag"
          class="mr-1 mb-1"
          label
          size="x-small"
          :title="tag"
        >
          {{ tag }}
        </v-chip>
      </template>
      <template #item.isOffline="{ item }">
        <v-switch
          v-model="item.raw.isOffline"
          color="success"
          hide-details
          @update:model-value="(v) => siteStore.simplePatchSite(item.raw.id, 'isOffline', v)"
        />
      </template>
      <template #item.allowSearch="{ item }">
        <v-switch
          v-model="item.raw.allowSearch"
          color="success"
          hide-details
          :disabled="item.raw.isOffline || !Object.hasOwn(item.raw,'search')"
          @update:model-value="(v) => siteStore.simplePatchSite(item.raw.id, 'allowSearch', v)"
        />
      </template>
      <template #item.allowQueryUserInfo="{ item }">
        <v-switch
          v-model="item.raw.allowQueryUserInfo"
          color="success"
          hide-details
          :disabled="item.raw.isOffline || !Object.hasOwn(item.raw,'userInfo')"
          @update:model-value="(v) => siteStore.simplePatchSite(item.raw.id, 'allowQueryUserInfo', v)"
        />
      </template>
      <template #item.showMessageCount="{ item }">
        <v-switch
          v-model="item.raw.showMessageCount"
          color="success"
          hide-details
          :disabled="item.raw.isOffline || !Object.hasOwn(item.raw,'userInfo') || item.raw.allowQueryUserInfo === false"
          @update:model-value="(v) => siteStore.simplePatchSite(item.raw.id, 'showMessageCount', v)"
        />
      </template>
      <template #item.action="{ item }">
        <v-btn-group variant="plain">
          <v-btn
            size="small" icon="mdi-pencil"
            :title="$t('common.edit')"
            @click="editSite(item.raw)"
          />
          <!-- search entry -->
          <!-- userinfo -->
          <v-btn
            size="small" icon="mdi-delete"
            color="error"
            :title="$t('common.remove')"
            @click="deleteSite(item.raw.id)"
          />
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <AddDialog v-model="showAddDialog" />
  <EditDialog v-model="showEditDialog" v-model:site-config="siteConfig" />
  <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" />
</template>

<style scoped></style>
