<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useSiteStore } from "@/shared/store/site";
import { asyncComputed } from "@vueuse/core";

import { type ISiteMetadata } from "@ptpp/site";

import AddDialog from "@/options/components/Settings/setSite/AddDialog.vue";
import DeleteDialog from "@/options/components/Settings/setSite/DeleteDialog.vue";
import ExpandInfo from "@/options/components/Settings/setSite/ExpandInfo.vue";
import SimplePatchSwitch from "@/options/components/Settings/setSite/simplePatchSwitch.vue";

const { t } = useI18n();
const siteStore = useSiteStore();

console.log(siteStore);

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);  // TODO
const showDeleteDialog = ref<boolean>(false);

const sites = asyncComputed(async () => {

  const siteDefinitions = [];
  for (const {id: siteId} of siteStore.sites) {
    siteDefinitions.push((await siteStore.getExpandSite(siteId)));
  }

  console.log(sites);
  return siteDefinitions;
});

const siteTableSearch = ref("");
const siteTableSelected = ref<string[]>([]);
const siteTableSort = reactive([
  { key: "rewriteConfig.sortIndex", order: "desc" },
  { key: "rewriteConfig.isOffline", order: "asc" },
  { key: "rewriteConfig.allowSearchTorrent", order: "desc" },
  { key: "rewriteConfig.allowQueryUserInfo", order: "desc" }
]);  // FIXME move to ui store
const siteTableHeader = [
  {
    title: "",  // site favicon
    key: "rewriteConfig.sortIndex",
    align: "center",
    filterable: false,
    width: 48
  },
  {
    title: t("setSite.common.name"),
    key: "metadata.name",
    align: "center",
    width: 120
  },
  {
    title: t("setSite.common.type"),
    key: "metadata.type",
    filterable: false,
    align: "center",
    width: 100
  },
  {
    title: t("setSite.common.url"),
    key: "metadata.url",
    align: "start",
    width: 180
  },
  {
    title: t("setSite.common.tags"),
    key: "metadata.tags",
    align: "start",
    width: 150
  },
  {
    title: t("setSite.common.isOffline"),
    key: "rewriteConfig.isOffline",
    align: "start",
    filterable: false,
    width: 110,
  },
  {
    title: t("setSite.common.allowSearch"),
    key: "rewriteConfig.allowSearchTorrent",
    align: "start",
    filterable: false,
    width: 100,
  },
  {
    title: t("setSite.common.allowQueryUserInfo"),
    key: "rewriteConfig.allowQueryUserInfo",
    align: "start",
    filterable: false,
    width: 110,
  },
  {
    title: t("common.action"),
    key: "action",
    filterable: false,
    sortable: false
  }
];

const shortSchema = (schema: string) => schema.includes("Abstract") ? schema.replace( /[a-z]/g, "" ) : schema;
const typeChipColorMap: Record<ISiteMetadata["type"], any>= {private: "primary", public: "secondary"};

const toDeleteIds = ref<string[]>([]);
function deleteSite (siteId: string | string[]) {
  if (typeof siteId === "string") {
    siteId = [siteId];
  }
  toDeleteIds.value = siteId;
  showDeleteDialog.value = true;
}

const loadingIconSites = reactive<string[]>([]);
function resetSiteFavicon(siteId: string) {
  const siteIndex = sites.value.findIndex(site => site.id === siteId);

  if (!loadingIconSites.includes(siteId)) {
    loadingIconSites.push(siteId);
  }

  siteStore.getSiteFavicon(siteId, true).then(favicon => {
    sites.value[siteIndex].favicon = favicon;
    let index = loadingIconSites.indexOf(siteId);
    if (index != -1) {
      loadingIconSites.splice(index, 1);
    }
  });
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
      :search="siteTableSearch"
      item-value="id"
      show-select
      multi-sort
      :sort-by="siteTableSort"
    >
      <template #item.rewriteConfig.sortIndex="{ item }">
        <v-btn
          icon flat
          :loading="loadingIconSites.includes(item.raw.id)"
          @click="resetSiteFavicon(item.raw.id)"
        >
          <v-avatar :image="item.raw.favicon" />
        </v-btn>
      </template>
      <template #item.metadata.name="{ item }">
        <ExpandInfo :main="item.raw.metadata.name" :expand="item.raw.metadata.aka">
          <template #default="{ data, field }">
            <span :title="field === 'main' ? (item.raw.metadata.description ?? '') : ''">{{ data }}</span>
          </template>
        </ExpandInfo>
      </template>
      <template #item.metadata.type="{ item }">
        <v-container>
          <v-row
            v-if="item.raw.metadata.type"
            justify="center"
            class="pt-1"
          >
            <v-chip
              label
              :color="typeChipColorMap[item.raw.metadata.type]"
              size="x-small"
              :title="item.raw.metadata.type"
            >
              {{ item.raw.metadata.type.toUpperCase() }}
            </v-chip>
          </v-row>
          <v-row
            v-if="item.raw.metadata.schema"
            justify="center"
            class="pt-1"
          >
            <v-chip
              label
              color="green"
              size="x-small"
              :title="item.raw.metadata.schema"
            >
              {{ shortSchema(item.raw.metadata.schema) }}
            </v-chip>
          </v-row>
        </v-container>
      </template>
      <template #item.metadata.url="{ item }">
        <ExpandInfo
          :main="item.raw.metadata.url" :expand="item.raw.metadata.legacyUrl"
          :open="item.raw.metadata.legacyUrl?.includes(item.raw.rewriteConfig?.activateUrl)"
        >
          <template #default="{ data, field }">
            <a
              v-if="data.startsWith('http')"
              :href="
                (field === 'main' || item.raw.rewriteConfig?.activateUrl === data)
                  ? (item.raw.rewriteConfig?.entryPoint ?? data)
                  : data /* 存在entryPoint时，替换和url或activateUrl相同的地址为entryPoint */"
              target="_blank" rel="noopener noreferrer nofollow"
              :class="[item.raw.rewriteConfig?.activateUrl === data && 'font-weight-bold']"
            >{{ data }}</a>
            <template v-else>
              {{ data }}
            </template>
          </template>
        </ExpandInfo>
      </template>
      <template #item.metadata.tags="{ item }">
        <v-chip
          v-for="tag in item.raw.metadata.tags" :key="tag"
          class="mr-1 mb-1"
          label
          size="x-small"
          :title="tag"
        >
          {{ tag }}
        </v-chip>
      </template>
      <template #item.rewriteConfig.isOffline="{ item }">
        <SimplePatchSwitch :config="item.raw" model-key="isOffline" disable-key="feature.isDead" />
      </template>
      <template #item.rewriteConfig.allowSearchTorrent="{ item }">
        <SimplePatchSwitch :config="item.raw" model-key="allowSearchTorrent" disable-key="feature.searchTorrent" />
      </template>
      <template #item.rewriteConfig.allowQueryUserInfo="{ item }">
        <SimplePatchSwitch :config="item.raw" model-key="allowQueryUserInfo" disable-key="feature.queryUserInfo" />
      </template>
      <template #item.action="{ item }">
        <v-btn
          size="small" icon="mdi-pencil"
          variant="plain"
          :title="$t('common.edit')"
          @click="log(item.raw)"
        />
        <v-btn
          size="small" icon="mdi-delete"
          variant="plain" color="error"
          :title="$t('common.remove')"
          @click="deleteSite(item.raw.id)"
        />
      </template>
    </v-data-table>
  </v-card>

  <AddDialog v-model="showAddDialog" />

  <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" />
</template>

<style scoped></style>
