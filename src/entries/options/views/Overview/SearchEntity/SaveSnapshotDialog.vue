<script setup lang="ts">
import { computed } from "vue";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { formatDate } from "@/options/utils.ts";

const showDialog = defineModel<boolean>();

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

const snapshotName = computed(
  () =>
    "[" +
    metadataStore.getSearchSolutionName(runtimeStore.search.searchPlanKey) +
    "] " +
    runtimeStore.search.searchKey +
    " (" +
    formatDate(runtimeStore.search.startAt) +
    ")",
);

function saveSearchSnapshotData() {
  metadataStore.saveSearchSnapshotData(snapshotName.value);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" width="500">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="cyan-darken-2">
          <v-toolbar-title>保存搜索快照</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
        <v-spacer />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-text-field v-model="snapshotName" dense hide-details label="快照名称" outlined></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="saveSearchSnapshotData">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
