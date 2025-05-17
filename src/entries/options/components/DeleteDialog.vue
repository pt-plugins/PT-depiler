<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

type TDeleteId = any;

const showDialog = defineModel<boolean>();
const { toDeleteIds, confirmDelete: confirmDeleteFn } = defineProps<{
  toDeleteIds: TDeleteId[];
  confirmDelete: (toDeleteId: TDeleteId) => Promise<void> | void;
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

      <v-card-text>
        {{ t("common.dialog.deleteText", [toDeleteIds!.length]) }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="info" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          <span class="ml-1">{{ t("common.dialog.cancel") }}</span>
        </v-btn>
        <v-btn :loading="isDeleting" color="error" variant="text" @click="confirmDelete">
          <v-icon icon="mdi-check-circle-outline" />
          <span class="ml-1">{{ t("common.dialog.ok") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
