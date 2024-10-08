<script lang="ts" setup>
import { useVModels } from "@vueuse/core";
import Editor from "@/options/views/Settings/setSite/Editor.vue";

import { type ISiteRuntimeConfig } from "@/shared/adapters/site.ts";
import { useSiteStore } from "@/shared/store/site.ts";
import { ref, watch } from "vue";

const componentProps = defineProps<{
  modelValue: boolean;
  siteConfig: ISiteRuntimeConfig;
}>();

const { modelValue: showDialog } = useVModels(componentProps);

const siteConfig = ref<ISiteRuntimeConfig>();
watch(
  () => componentProps.siteConfig,
  () => {
    if (componentProps.siteConfig.id) {
      siteConfig.value = { ...componentProps.siteConfig }; // 防止直接修改父组件的数据
    }
  },
);

function patchSite() {
  const store = useSiteStore();

  store.patchSite(siteConfig.value!);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey darken-2">
          <v-toolbar-title>{{ $t("setSite.edit.title") }}</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <Editor v-model="siteConfig" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          {{ $t("common.dialog.cancel") }}
        </v-btn>

        <v-btn variant="text" color="success" @click="patchSite">
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
