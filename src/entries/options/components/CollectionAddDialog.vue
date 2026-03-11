<script setup lang="ts">
/**
 * 收藏夹选择对话框：
 * 如果只有一个默认收藏夹，则直接添加，不显示对话框。
 * 否则显示勾选框，让用户选择将种子加入哪些收藏夹。
 */
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import type { ITorrent } from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { DEFAULT_COLLECTION_ID, type TCollectionId, buildTorrentCollectionKey } from "@/shared/types.ts";

const { t } = useI18n();

const showDialog = defineModel<boolean>();

const props = defineProps<{
  torrent: ITorrent | null;
}>();

const emits = defineEmits<{
  (e: "saved"): void;
}>();

const metadataStore = useMetadataStore();

const sortedCollections = computed(() => metadataStore.getSortedCollections());
const hasCustomCollections = computed(() => metadataStore.getCustomCollections().length > 0);

// 当前种子已在哪些收藏夹中
const selectedIds = ref<TCollectionId[]>([]);

watch(showDialog, (val) => {
  if (val && props.torrent) {
    const key = buildTorrentCollectionKey(props.torrent);
    selectedIds.value = metadataStore.getTorrentCollectionIds(key);
  }
});

async function save() {
  if (!props.torrent) return;
  await metadataStore.updateTorrentCollections(props.torrent, selectedIds.value);
  showDialog.value = false;
  emits("saved");
}
</script>

<template>
  <v-dialog v-model="showDialog" width="400">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="primary">
          <v-toolbar-title>{{ t("MyCollection.selectDialog.title") }}</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-2">
        <p class="text-body-2 text-grey mb-2 text-truncate" :title="torrent?.title">{{ torrent?.title }}</p>
        <v-list density="compact">
          <v-list-item v-for="collection in sortedCollections" :key="collection.id" :value="collection.id" class="px-1">
            <template #prepend>
              <v-checkbox-btn v-model="selectedIds" :value="collection.id" density="compact" />
            </template>
            <template #default>
              <v-list-item-title class="d-flex align-center">
                <v-icon :color="collection.color ?? 'primary'" icon="mdi-bookmark" size="small" class="mr-1" />
                {{ collection.name }}
                <span class="text-caption text-grey ml-2">
                  ({{ t("MyCollection.folderPanel.torrentCount", [collection.torrentIds.length]) }})
                </span>
              </v-list-item-title>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="showDialog = false">{{ t("common.dialog.cancel") }}</v-btn>
        <v-btn color="primary" variant="tonal" @click="save">{{ t("common.dialog.ok") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
