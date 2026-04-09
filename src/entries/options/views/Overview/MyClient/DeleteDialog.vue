<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import BaseDeleteDialog from "@/options/components/DeleteDialog.vue";

const showDialog = defineModel<boolean>();
const props = defineProps<{
  toDeleteIds: string[];
  confirmDelete: (toDeleteId: string, removeData: boolean) => Promise<void> | void;
}>();
const emits = defineEmits<{
  (e: "allDelete"): void;
}>();

const { t } = useI18n();

const removeData = ref(false);

watch(showDialog, (val) => {
  if (val) removeData.value = false;
});

function wrappedConfirmDelete(id: string) {
  return props.confirmDelete(id, removeData.value);
}
</script>

<template>
  <BaseDeleteDialog
    v-model="showDialog"
    :to-delete-ids="toDeleteIds"
    :confirm-delete="wrappedConfirmDelete"
    @all-delete="emits('allDelete')"
  >
    <template #extra>
      <v-card-text class="pt-0">
        <v-checkbox
          v-model="removeData"
          :label="t('MyClient.dialog.removeData')"
          color="error"
          density="compact"
          hide-details
        />
      </v-card-text>
    </template>
  </BaseDeleteDialog>
</template>

<style scoped lang="scss"></style>
