<script setup lang="ts">
import { ref, watch } from "vue";

import { useMetadataStore } from "@/options/stores/metadata.ts";

import { type TSearchSnapshotKey } from "@/shared/storages/metadata.ts";

const showDialog = defineModel<boolean>();

const props = defineProps<{
  editId: TSearchSnapshotKey;
}>();

const metadataStore = useMetadataStore();
const snapshotName = ref("");

watch(showDialog, () => {
  if (props.editId === null) {
    return;
  }

  snapshotName.value = metadataStore.snapshots[props.editId].name;
});

function saveSearchSnapshotData() {
  metadataStore.editSearchSnapshotDataName(props.editId, snapshotName.value);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" width="500">
    <v-card>
      <v-card-title class="bg-cyan-darken-2">
        <span>搜索快照重命名</span>
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
