<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { ITorrent } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { getTorrentFavoriteKey, type ITorrentFavoriteItem } from "@/shared/types.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { formatSize } from "@/options/utils.ts";

const showDialog = defineModel<boolean>();

const { torrentItems, editFavorite = null } = defineProps<{
  torrentItems: ITorrent[];
  /** 传入待编辑的收藏项时进入编辑模式：只修改它的收藏分类与备注 */
  editFavorite?: ITorrentFavoriteItem | null;
}>();

const emits = defineEmits<{
  (e: "saved"): void;
}>();

const { t } = useI18n();
const runtimeStore = useRuntimeStore();

const favCategory = ref<string>(""); // 收藏分类（用户自设，类似文件夹）
const comment = ref<string>(""); // 备注
const favCategories = ref<string[]>([]); // 已有分类，作为输入建议
const favoriteKeys = ref<Set<string>>(new Set()); // 已收藏的种子 key，用于提示
const saving = ref(false);

const isEdit = computed(() => editFavorite !== null);
const totalSize = computed(() => torrentItems.reduce((acc, item) => acc + (item.size ?? 0), 0));
const alreadyFavoritedCount = computed(
  () => torrentItems.filter((item) => favoriteKeys.value.has(getTorrentFavoriteKey(item))).length,
);

function isFavorited(torrent: ITorrent) {
  return favoriteKeys.value.has(getTorrentFavoriteKey(torrent));
}

watch(showDialog, async (show) => {
  if (!show) {
    return;
  }

  favCategory.value = editFavorite?.favCategory ?? "";
  comment.value = editFavorite?.comment ?? "";
  favoriteKeys.value = new Set();

  try {
    const favorites = await sendMessage("getTorrentFavorites", undefined);
    favCategories.value = [...new Set(favorites.map((x) => x.favCategory ?? "").filter(Boolean))];
    favoriteKeys.value = new Set(favorites.map((x) => x.key));
  } catch (e) {
    console.error("[PTD] Failed to load torrent favorites:", e);
  }
});

async function save() {
  saving.value = true;
  try {
    // 传入空字符串表示清空该项，缺省才表示保持原值；此处始终以下拉框/输入框中的内容为准
    const count = await sendMessage("createTorrentFavorites", {
      torrents: torrentItems,
      favCategory: (favCategory.value ?? "").trim(),
      comment: (comment.value ?? "").trim(),
    });
    runtimeStore.showSnackbar(t("MyCollection.dialog.saveSuccess", [count]), { color: "success" });
    emits("saved");
    showDialog.value = false;
  } catch (e) {
    runtimeStore.showSnackbar(t("MyCollection.dialog.saveError"), { color: "error" });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="760" :persistent="saving" scrollable>
    <v-card>
      <v-card-title class="bg-amber-lighten-3">
        {{ isEdit ? t("MyCollection.dialog.editTitle") : t("MyCollection.dialog.title", [torrentItems.length]) }}
      </v-card-title>

      <v-card-text>
        <v-combobox
          v-model="favCategory"
          :items="favCategories"
          :label="t('MyCollection.dialog.favCategory')"
          :hint="t('MyCollection.dialog.favCategoryHint')"
          clearable
          density="comfortable"
          persistent-hint
        />
        <v-textarea
          v-model="comment"
          :label="t('MyCollection.dialog.comment')"
          auto-grow
          class="mt-4"
          clearable
          rows="2"
        />

        <template v-if="!isEdit">
          <v-alert v-if="alreadyFavoritedCount > 0" class="mt-4" density="compact" type="warning" variant="tonal">
            {{ t("MyCollection.dialog.alreadyFavoritedNotice", [alreadyFavoritedCount]) }}
          </v-alert>

          <v-list class="mt-2 overflow-y-auto" density="compact" max-height="240">
            <v-list-item
              v-for="torrent in torrentItems"
              :key="getTorrentFavoriteKey(torrent)"
              :subtitle="formatSize(torrent.size ?? 0)"
              :title="torrent.title"
            >
              <template #append>
                <v-chip v-if="isFavorited(torrent)" color="amber" size="small">
                  {{ t("MyCollection.dialog.alreadyFavorited") }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </template>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <span v-if="!isEdit" class="ml-2 text-body-small text-grey">
          {{ t("MyCollection.dialog.totalSize", [formatSize(totalSize)]) }}
        </span>
        <v-spacer />
        <v-btn color="info" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn :loading="saving" color="primary" prepend-icon="mdi-star" variant="text" @click="save">
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
