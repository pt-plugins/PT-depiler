<script setup lang="ts">
import { useDownloaderStore } from "@/shared/store/downloader.ts";
import { useVModels } from "@vueuse/core";

const componentProps = defineProps<{
  modelValue: boolean,
  toDeleteIds: string[]
}>();

const {
  modelValue: showDialog,
  toDeleteIds
} = useVModels(componentProps);

function removeClients () {
  const downloaderStore = useDownloaderStore();

  for (const toDeleteId of toDeleteIds.value) {
    downloaderStore.removeClient(toDeleteId);
  }
  showDialog.value = false;
  toDeleteIds.value.splice(0);
}
</script>

<template>
  <v-dialog v-model="showDialog" width="300">
    <v-card>
      <v-card-title class="bg-red-lighten-2">
        {{ $t('common.dialog.title.confirmAction') }}
      </v-card-title>

      <v-card-text>
        {{ $t('setDownloader.delete.text', [toDeleteIds.length]) }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="info" @click="showDialog=false">
          <v-icon icon="mdi-close-circle" />
          <span class="ml-1">{{ $t('common.dialog.cancel') }}</span>
        </v-btn>
        <v-btn variant="text" color="error" @click="removeClients">
          <v-icon icon="mdi-check-circle-outline" />
          <span class="ml-1">{{ $t('common.dialog.ok') }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>

</style>
