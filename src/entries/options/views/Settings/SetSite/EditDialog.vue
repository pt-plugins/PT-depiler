<script lang="ts" setup>
import { provide, ref } from "vue";
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

const isFormValid = ref<boolean>(false);

const storedSiteUserConfig = ref<ISiteUserConfig & { valid?: boolean }>({ valid: false });
provide("storedSiteUserConfig", storedSiteUserConfig);

function patchSite() {
  metadataStore.addSite(props.siteId, storedSiteUserConfig.value);
  metadataStore.$save();
  showDialog.value = false;
}

function dialogEnter() {
  storedSiteUserConfig.value = {
    valid: false,
    ...(metadataStore.sites[props.siteId] ?? {}),
  };
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable @after-enter="dialogEnter">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("SetSite.edit.title") }}</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <Editor v-model="props.siteId" @update:form-valid="(v) => (isFormValid = v)" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>

        <v-btn
          :disabled="!isFormValid"
          color="success"
          prepend-icon="mdi-check-circle-outline"
          variant="text"
          @click="patchSite"
        >
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
