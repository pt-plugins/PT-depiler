<script setup lang="ts">
import { ref, watch } from "vue";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { formatDate } from "@/options/utils.ts";

const showDialog = defineModel<boolean>();

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

const snapshotName = ref("");

watch(showDialog, () => {
  snapshotName.value =
    "[" +
    metadataStore.getSearchSolutionName(runtimeStore.search.searchPlanKey) +
    "] " +
    runtimeStore.search.searchKey +
    " (" +
    formatDate(runtimeStore.search.startAt) +
    ")";
});

function saveSearchSnapshotData() {
  metadataStore.saveSearchSnapshotData(snapshotName.value);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" width="500">
    <v-card>
      <v-card-title class="bg-cyan-darken-2">
        <span>保存搜索快照</span>
        <v-spacer />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-text-field v-model="snapshotName" label="快照名称" outlined dense hide-details></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="saveSearchSnapshotData" color="primary">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
