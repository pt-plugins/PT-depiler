<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { formatDate, formatSize } from "@/options/utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import {
  DEFAULT_COLLECTION_ID,
  type ICollectionFolder,
  type TCollectionId,
  type TTorrentCollectionKey,
  buildTorrentCollectionKey,
} from "@/shared/types.ts";
import type { ITorrent } from "@ptd/site";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import SiteName from "@/options/components/SiteName.vue";
import TorrentTitleTd from "@/options/components/TorrentTitleTd.vue";
import NavButton from "@/options/components/NavButton.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";

import EditCollectionDialog from "./EditCollectionDialog.vue";

const { t } = useI18n();
const metadataStore = useMetadataStore();
const configStore = useConfigStore();

// ===================== 收藏夹面板 =====================
const selectedCollectionId = ref<TCollectionId>(DEFAULT_COLLECTION_ID);

const sortedCollections = computed(() => metadataStore.getSortedCollections());

// ===================== 种子列表 =====================
const torrentList = shallowRef<ITorrent[]>([]);

async function loadTorrents(collectionId: TCollectionId) {
  torrentList.value = await metadataStore.getCollectionTorrents(collectionId);
}

onMounted(() => {
  loadTorrents(selectedCollectionId.value);
});

function selectCollection(id: TCollectionId) {
  selectedCollectionId.value = id;
  loadTorrents(id);
}

const tableFilter = ref("");

const torrentTableHeader = computed(
  () =>
    [
      { title: t("MyCollection.table.site"), key: "site", align: "center", width: 80 },
      {
        title: t("MyCollection.table.title"),
        key: "title",
        align: "start",
        minWidth: "20rem",
      },
      { title: t("MyCollection.table.size"), key: "size", align: "end", width: 120 },
      { title: t("MyCollection.table.time"), key: "time", align: "center", width: 150 },
      { title: t("common.action"), key: "action", align: "center", width: 120, sortable: false, alwaysShow: true },
    ] as DataTableHeader[],
);

const tableSelected = ref<ITorrent[]>([]);

function getTorrentKey(torrent: ITorrent): TTorrentCollectionKey {
  return buildTorrentCollectionKey(torrent);
}

// ===================== 收藏夹管理 =====================
const showEditDialog = ref(false);
const editingCollection = ref<ICollectionFolder | null>(null);

function openAddCollectionDialog() {
  editingCollection.value = null;
  showEditDialog.value = true;
}

function openEditCollectionDialog(collection: ICollectionFolder) {
  editingCollection.value = collection;
  showEditDialog.value = true;
}

async function onEditDialogSave(data: { id?: TCollectionId; name: string; color?: string; sortIndex?: number }) {
  if (data.id) {
    await metadataStore.editCollection(data.id, { name: data.name, color: data.color, sortIndex: data.sortIndex });
  } else {
    await metadataStore.addCollection({ name: data.name, color: data.color, sortIndex: data.sortIndex });
  }
}

// 删除收藏夹
const showDeleteCollectionDialog = ref(false);
const toDeleteCollectionIds = ref<TCollectionId[]>([]);

function tryDeleteCollection(id: TCollectionId) {
  toDeleteCollectionIds.value = [id];
  showDeleteCollectionDialog.value = true;
}

async function confirmDeleteCollection(id: TCollectionId) {
  if (id === selectedCollectionId.value) {
    selectedCollectionId.value = DEFAULT_COLLECTION_ID;
    await loadTorrents(DEFAULT_COLLECTION_ID);
  }
  await metadataStore.removeCollection(id);
}

// 删除种子收藏（从所有收藏夹中删除）
const showDeleteTorrentDialog = ref(false);
const toDeleteTorrentKeys = ref<TTorrentCollectionKey[]>([]);

function tryDeleteTorrents(torrents: ITorrent[]) {
  toDeleteTorrentKeys.value = torrents.map(getTorrentKey);
  showDeleteTorrentDialog.value = true;
}

async function confirmDeleteTorrent(key: TTorrentCollectionKey) {
  await metadataStore.removeTorrentFromAllCollections(key);
}

async function onAllTorrentsDeleted() {
  tableSelected.value = [];
  await loadTorrents(selectedCollectionId.value);
}
</script>

<template>
  <v-alert :title="t('route.Overview.MyCollection')" type="info" />

  <v-row class="ma-0">
    <!-- 左侧：收藏夹列表 -->
    <v-col cols="12" md="3" class="pa-2">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between pa-3">
          <span>{{ t("MyCollection.folderPanel.title") }}</span>
          <v-btn
            color="primary"
            density="compact"
            icon="mdi-plus"
            :title="t('MyCollection.folderPanel.add')"
            @click="openAddCollectionDialog"
          />
        </v-card-title>

        <v-list density="compact" nav>
          <v-list-item
            v-for="collection in sortedCollections"
            :key="collection.id"
            :value="collection.id"
            :active="selectedCollectionId === collection.id"
            rounded="lg"
            @click="selectCollection(collection.id)"
          >
            <template #prepend>
              <v-icon :color="collection.color ?? 'primary'" icon="mdi-bookmark" class="mr-2" />
            </template>

            <v-list-item-title>{{ collection.name }}</v-list-item-title>

            <v-list-item-subtitle class="text-caption">
              {{ t("MyCollection.folderPanel.torrentCount", [collection.torrentIds.length]) }}
            </v-list-item-subtitle>

            <template #append>
              <v-btn
                icon="mdi-pencil"
                density="compact"
                size="small"
                variant="text"
                :title="t('common.edit')"
                @click.stop="openEditCollectionDialog(collection)"
              />
              <v-btn
                v-if="!collection.isDefault"
                icon="mdi-delete"
                density="compact"
                size="small"
                color="error"
                variant="text"
                :title="t('common.remove')"
                @click.stop="tryDeleteCollection(collection.id)"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <!-- 右侧：种子列表 -->
    <v-col cols="12" md="9" class="pa-2">
      <v-card>
        <v-card-title>
          <v-row class="ma-0">
            <NavButton
              :disabled="tableSelected.length === 0"
              color="error"
              icon="mdi-bookmark-remove"
              :text="t('MyCollection.action.removeSelected')"
              @click="tryDeleteTorrents(tableSelected)"
            />

            <v-spacer />

            <v-text-field
              v-model="tableFilter"
              append-icon="mdi-magnify"
              clearable
              density="compact"
              hide-details
              :label="t('MyCollection.filterPlaceholder')"
              max-width="400"
              single-line
            />
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-data-table
            v-model="tableSelected"
            :headers="torrentTableHeader"
            :items="torrentList"
            :items-per-page="configStore.tableBehavior.MyCollection?.itemsPerPage ?? 25"
            :multi-sort="configStore.enableTableMultiSort"
            :search="tableFilter"
            :sort-by="configStore.tableBehavior.MyCollection?.sortBy"
            class="table-stripe table-header-no-wrap"
            hover
            :item-value="getTorrentKey"
            return-object
            show-select
            @update:itemsPerPage="(v) => configStore.updateTableBehavior('MyCollection', 'itemsPerPage', v)"
            @update:sortBy="(v) => configStore.updateTableBehavior('MyCollection', 'sortBy', v)"
          >
            <template #item.site="{ item }">
              <div class="d-flex flex-column align-center">
                <SiteFavicon :site-id="item.site" :size="18" />
                <SiteName :site-id="item.site" />
              </div>
            </template>

            <template #item.title="{ item }">
              <TorrentTitleTd :item="item" />
            </template>

            <template #item.size="{ item }">
              <span class="text-no-wrap">{{ item.size ? formatSize(item.size) : "-" }}</span>
            </template>

            <template #item.time="{ item }">
              <span class="text-no-wrap">{{ item.time ? formatDate(item.time) : "-" }}</span>
            </template>

            <template #item.action="{ item }">
              <v-btn-group class="table-action" density="compact" variant="plain">
                <v-btn
                  color="error"
                  icon="mdi-bookmark-remove"
                  size="small"
                  :title="t('MyCollection.action.remove')"
                  @click="tryDeleteTorrents([item])"
                />
              </v-btn-group>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- 编辑收藏夹对话框 -->
  <EditCollectionDialog v-model="showEditDialog" :collection="editingCollection" @save="onEditDialogSave" />

  <!-- 删除收藏夹对话框 -->
  <DeleteDialog
    v-model="showDeleteCollectionDialog"
    :to-delete-ids="toDeleteCollectionIds"
    :confirm-delete="confirmDeleteCollection"
  />

  <!-- 删除种子收藏对话框 -->
  <DeleteDialog
    v-model="showDeleteTorrentDialog"
    :to-delete-ids="toDeleteTorrentKeys"
    :confirm-delete="confirmDeleteTorrent"
    @all-delete="onAllTorrentsDeleted"
  />
</template>

<style scoped lang="scss"></style>
