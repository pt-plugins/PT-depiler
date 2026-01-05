<script setup lang="ts">
import { ref } from "vue";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { type TSearchSnapshotKey } from "@/shared/types.ts";

const showDialog = defineModel<boolean>();

const props = defineProps<{
  editId: TSearchSnapshotKey;
}>();

const metadataStore = useMetadataStore();
const snapshotName = ref("");

function saveSearchSnapshotData() {
  metadataStore.editSearchSnapshotDataName(props.editId, snapshotName.value);
  showDialog.value = false;
}

function dialogEnter() {
  snapshotName.value = metadataStore.snapshots[props.editId].name;
}
</script>

<template>
  <v-dialog
    v-model="showDialog"
    width="500"
    @after-enter="() => props.editId && dialogEnter()"
    @after-leave="() => (snapshotName = '')"
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="cyan-darken-2">
          <v-toolbar-title>搜索快照重命名</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
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
