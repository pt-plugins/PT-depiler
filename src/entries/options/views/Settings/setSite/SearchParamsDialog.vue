<script lang="ts" setup>
import { useVModels } from "@vueuse/core";
import { ISiteRuntimeConfig } from "@/shared/adapters/site.ts";
import { useSiteStore } from "@/shared/store/site.ts";
import SiteSPExpansionPanel from "@/options/views/Settings/setSearchSolution/siteSPExpansionPanel.vue";

const componentProps = defineProps<{
  modelValue: boolean;
  siteConfig: ISiteRuntimeConfig;
}>();

const { modelValue: showDialog, siteConfig } = useVModels(componentProps);

function saveSiteSearchParams() {
  const siteStore = useSiteStore();
  siteStore.patchSite(siteConfig.value);

  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey darken-2">
          <v-toolbar-title>{{
            $t("setSite.spDialog.title", { name: siteConfig.name })
          }}</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-alert color="warning" class="mb-2">
          {{ $t("setSite.spDialog.notice") }}
        </v-alert>
        <SiteSPExpansionPanel
          v-model="siteConfig.defaultSearchParams"
          :categories="siteConfig.search?.categories"
          show
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          {{ $t("common.dialog.cancel") }}
        </v-btn>
        <v-btn variant="text" color="success" @click="saveSiteSearchParams">
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
