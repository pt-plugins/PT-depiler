<script setup lang="ts">
import { useMetadataStore } from "@/options/stores/metadata.ts";

const showDialog = defineModel<boolean>();
const toDeleteIds = defineModel<string[]>("toDeleteIds");

async function removeSearchResultSnapshots() {
  const metadataStore = useMetadataStore();

  for (const toDeleteId of toDeleteIds.value!) {
    await metadataStore.removeSearchSnapshotData(toDeleteId);
  }
  showDialog.value = false;
  toDeleteIds.value = [];
}
</script>

<template>
  <v-dialog v-model="showDialog" width="300">
    <v-card>
      <v-card-title class="bg-red-lighten-2">
        {{ $t("common.dialog.title.confirmAction") }}
      </v-card-title>

      <v-card-text>
        {{ $t("searchResultSnapshot.delete.text", [toDeleteIds!.length]) }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="info" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          <span class="ml-1">{{ $t("common.dialog.cancel") }}</span>
        </v-btn>
        <v-btn variant="text" color="error" @click="removeSearchResultSnapshots">
          <v-icon icon="mdi-check-circle-outline" />
          <span class="ml-1">{{ $t("common.dialog.ok") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
