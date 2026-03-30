<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useResetableRef } from "@/options/directives/useResetableRef.ts";

const showDialog = defineModel<boolean>();

const { t } = useI18n();

const { ref: reBuildControlRef, reset: resetReBuildControlRef } = useResetableRef(() => ({
  rebuildSiteHostMap: true,
  rebuildSiteNameMap: false,
}));

async function doReBuild() {
  const metadataStore = useMetadataStore();

  if (reBuildControlRef.value.rebuildSiteHostMap) {
    await metadataStore.buildSiteHostMap();
  }

  if (reBuildControlRef.value.rebuildSiteNameMap) {
    await metadataStore.buildSiteNameMap();
  }

  await metadataStore.$save();
  showDialog.value = false;
}

const canReBuild = computed<boolean>(() => Object.values(reBuildControlRef.value).some(Boolean));

function dialogEnter() {
  resetReBuildControlRef();
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable @after-enter="dialogEnter">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("SetSite.ReBuildMapDialog.title") }}</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-switch
          v-model="reBuildControlRef.rebuildSiteHostMap"
          :label="t('SetSite.ReBuildMapDialog.rebuildSiteHostMap')"
          color="success"
          hide-details
        />

        <v-switch
          v-model="reBuildControlRef.rebuildSiteNameMap"
          :label="t('SetSite.ReBuildMapDialog.rebuildSiteNameMap')"
          color="success"
          hide-details
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>

        <v-btn :disabled="!canReBuild" color="success" prepend-icon="mdi-import" variant="text" @click="doReBuild">
          {{ t("SetSite.ReBuildMapDialog.doRebuildBtn") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
