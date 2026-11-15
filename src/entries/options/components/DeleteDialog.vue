<script setup lang="ts" generic="T extends string | number">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const showDialog = defineModel<boolean>();
// 各调用方传入的 id 类型不同（站点 id / 下载器 key / 快照 key …），用泛型按调用点推断，避免 any 抹掉类型
const { toDeleteIds, confirmDelete: confirmDeleteFn } = defineProps<{
  toDeleteIds: T[];
  confirmDelete: (toDeleteId: T) => Promise<void> | void;
}>();
const emits = defineEmits<{
  (e: "allDelete"): void;
}>();

const { t } = useI18n();

const isDeleting = ref(false);

async function confirmDelete() {
  isDeleting.value = true;
  await Promise.allSettled(toDeleteIds.map((toDeleteId) => confirmDeleteFn(toDeleteId)));
  isDeleting.value = false;
  showDialog.value = false;
  emits("allDelete");
}

async function dialogEnter() {
  isDeleting.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" :persistent="isDeleting" width="300" @after-enter="dialogEnter">
    <v-card>
      <v-card-title class="bg-red-lighten-2">
        {{ t("common.dialog.title.confirmAction") }}
      </v-card-title>

      <v-card-text class="text-body-large">
        {{ t("common.dialog.deleteText", [toDeleteIds.length]) }}

        <slot name="append-text" />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="info" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          <span class="ml-1">{{ t("common.dialog.cancel") }}</span>
        </v-btn>
        <v-btn
          :loading="isDeleting"
          color="error"
          prepend-icon="mdi-check-circle-outline"
          variant="text"
          @click="confirmDelete"
        >
          <span class="ml-1">{{ t("common.dialog.ok") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
