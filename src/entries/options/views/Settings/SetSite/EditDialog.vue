<script lang="ts" setup>
import { provide, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { type ISiteUserConfig, type TSiteID } from "@ptd/site";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import Editor from "./Editor.vue";

const showDialog = defineModel<boolean>();
const props = defineProps<{
  siteId: TSiteID;
}>();

const { t } = useI18n();
const metadataStore = useMetadataStore();

const storedSiteUserConfig = ref<ISiteUserConfig & { valid?: boolean }>({ valid: false });
provide("storedSiteUserConfig", storedSiteUserConfig);

watch(showDialog, async () => {
  storedSiteUserConfig.value = {
    valid: false,
    ...(metadataStore.sites[props.siteId] ?? {}),
  };
});

function patchSite() {
  metadataStore.addSite(props.siteId, storedSiteUserConfig.value);
  metadataStore.$save();
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("SetSite.edit.title") }}</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <Editor v-model="props.siteId" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          {{ t("common.dialog.cancel") }}
        </v-btn>

        <v-btn variant="text" color="success" @click="patchSite" :disabled="!storedSiteUserConfig.valid">
          <v-icon icon="mdi-check-circle-outline" />
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
