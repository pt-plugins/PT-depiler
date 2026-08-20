<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const showDialog = defineModel<boolean>();
const { torrentCount, confirmFn } = defineProps<{
  torrentCount: number;
  confirmFn: () => Promise<void> | void;
}>();

const { t } = useI18n();

const isRechecking = ref(false);

async function confirmRecheck() {
  isRechecking.value = true;
  try {
    await confirmFn();
  } finally {
    isRechecking.value = false;
    showDialog.value = false;
  }
}

function dialogEnter() {
  isRechecking.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" :persistent="isRechecking" width="420" @after-enter="dialogEnter">
    <v-card>
      <v-card-title class="bg-cyan-lighten-2">
        {{ t("MyClient.recheckDialog.title") }}
      </v-card-title>

      <v-card-text class="text-body-1">
        {{ t("MyClient.recheckDialog.text", { count: torrentCount }) }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="info" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          <span class="ml-1">{{ t("common.dialog.cancel") }}</span>
        </v-btn>
        <v-btn :loading="isRechecking" color="cyan" prepend-icon="mdi-refresh" variant="text" @click="confirmRecheck">
          <span class="ml-1">{{ t("common.dialog.ok") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
