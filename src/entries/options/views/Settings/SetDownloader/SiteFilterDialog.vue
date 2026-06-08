<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { IDownloaderMetadata, TDownloaderKey } from "@/shared/types.ts";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import CheckSwitchButton from "@/options/components/CheckSwitchButton.vue";
import { useConfigStore } from "@/options/stores/config.ts";

const showDialog = defineModel<boolean>();
const { clientId } = defineProps<{
  clientId: TDownloaderKey;
}>();

const { t } = useI18n();
const metadataStore = useMetadataStore();
const configStore = useConfigStore();

const clientConfig = ref<IDownloaderMetadata>();
const excludedSites = ref<string[]>([]);

const addedSites = computed(() =>
  Object.entries(metadataStore.sites)
    .filter(([id, site]) => (configStore.contentScript.allowExceptionSites ? (site.allowContentScript ?? true) : true))
    .map(([id]) => ({ id, name: metadataStore.siteNameMap[id] ?? id }))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

const allSiteIds = computed(() => addedSites.value.map((s) => s.id));

function onEnter() {
  if (clientId) {
    clientConfig.value = { excludedSites: [], ...metadataStore.downloaders[clientId] };
    excludedSites.value = [...(clientConfig.value.excludedSites ?? [])];
  }
}

function save() {
  metadataStore.simplePatch("downloaders", clientId, "excludedSites", excludedSites.value);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" scrollable max-width="1000" @afterEnter="onEnter">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar
          :title="t('SetDownloader.siteFilter.title', [clientConfig?.name ?? clientId])"
          color="blue-grey-darken-2"
        >
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-alert class="mb-3 py-2" color="info" variant="tonal">
          <template #text>
            {{ t("SetDownloader.siteFilter.excludedSitesHint") }}
          </template>
          <template #append>
            <CheckSwitchButton v-model="excludedSites" :all="allSiteIds" color="blue-lighten-1" variant="tonal" />
          </template>
        </v-alert>

        <v-skeleton-loader v-if="addedSites.length === 0" type="image" />

        <v-list v-else class="overflow-x-hidden overflow-y-hidden px-3 pt-3">
          <v-row>
            <v-col v-for="site in addedSites" :key="site.id" cols="12" md="4" sm="6" class="pa-1">
              <v-list-item border class="bg-grey-lighten-4">
                <template #prepend>
                  <SiteFavicon :site-id="site.id" class="mr-2" flush-on-click />
                </template>

                <template #title>
                  <v-list-item-title>
                    <b>{{ site.name }}</b>
                  </v-list-item-title>
                </template>

                <template #subtitle>
                  <v-chip label size="x-small" class="mt-1">
                    {{ site.id }}
                  </v-chip>
                </template>

                <template #append>
                  <v-list-item-action>
                    <v-checkbox
                      v-model="excludedSites"
                      :value="site.id"
                      :color="excludedSites.includes(site.id) ? 'error' : ''"
                      hide-details
                      base-color="green"
                      multiple
                      true-icon="mdi-eye-off"
                      false-icon="mdi-eye"
                    />
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-col>
          </v-row>
        </v-list>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn color="success" prepend-icon="mdi-check-circle-outline" variant="text" @click="save">
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
