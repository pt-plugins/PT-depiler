<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { BackupFields, TBackupFields } from "@/shared/types.ts";
import { sendMessage } from "@/messages.ts";

const showDialog = defineModel<boolean>();
const { t } = useI18n();

const backupFields = ref<TBackupFields[]>([]);

async function doLocalExport() {
  await sendMessage("exportBackupData", { backupFields: backupFields.value, backupServerId: "local" });
}

function dialogEnter() {
  backupFields.value = [...BackupFields];
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="600" @after-enter="dialogEnter">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 请选择本地需要导出的内容 </v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row no-gutters>
          <v-col v-for="backupField in BackupFields" :key="backupField" cols="12" md="6">
            <v-switch v-model="backupFields" :label="backupField" :value="backupField" color="success" hide-details />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn color="success" prepend-icon="mdi-export" variant="text" @click="() => doLocalExport()">导出</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
