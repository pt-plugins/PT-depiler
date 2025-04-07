<script setup lang="ts">
import { provide, ref, watch } from "vue";
import { computedAsync } from "@vueuse/core";
import { REPO_URL } from "~/helper.ts";
import { definitionList, type ISiteUserConfig, type TSiteID } from "@ptd/site";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import SiteFavicon from "@/options/components/SiteFavicon.vue";
import Editor from "./Editor.vue";

const showDialog = defineModel<boolean>();
const metadataStore = useMetadataStore();

const currentStep = ref<0 | 1>(0);
const selectedSiteId = ref<TSiteID | null>(null);
const storedSiteUserConfig = ref<ISiteUserConfig & { valid?: boolean }>({ valid: false });

provide("storedSiteUserConfig", storedSiteUserConfig);

watch(showDialog, () => {
  currentStep.value = 0;
  selectedSiteId.value = null;
  storedSiteUserConfig.value = { valid: false };
});

const canAddSites = computedAsync(async () => {
  const canAddedSiteMetadata = [];
  const canAddedSiteList = definitionList.filter((x) => !metadataStore.getAddedSiteIds.includes(x));

  for (const string of canAddedSiteList) {
    canAddedSiteMetadata.push(await metadataStore.getSiteMetadata(string));
  }
  return canAddedSiteMetadata;
}, []);

async function saveSite() {
  await metadataStore.addSite(selectedSiteId.value!, storedSiteUserConfig.value);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey darken-2">
          <v-toolbar-title>{{ $t("setSite.add.title") }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon="mdi-help-circle"
            color="success"
            :href="`${REPO_URL}/wiki/config-site`"
            target="_blank"
            rel="noopener noreferrer nofollow"
          />
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-window v-model="currentStep">
          <!-- 选取可添加的站点 -->
          <v-window-item :key="0">
            <v-autocomplete
              v-model="selectedSiteId"
              :items="canAddSites"
              item-title="name"
              item-value="id"
              :multiple="false"
              :placeholder="selectedSiteId ? '' : $t('setSite.add.selectSitePlaceholder')"
              :filter-keys="['raw.name', 'raw.urls']"
              persistent-hint
            >
              <template #selection="{ item: { raw: site } }">
                <v-list-item>
                  <template #prepend>
                    <SiteFavicon :site-id="site.id" class="mr-2" />
                  </template>
                  <v-list-item-title>
                    {{ site.name ?? "" }}
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template #item="{ props, item: { raw: site } }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <SiteFavicon :site-id="site.id" class="mr-2" />
                  </template>

                  <template #title>
                    <v-list-item-title class="mb-1">
                      <b>{{ site.name ?? "" }}</b>
                      <!-- 站点类型 -->
                      <v-chip
                        label
                        size="x-small"
                        :color="site.type === 'private' ? 'primary' : 'secondary'"
                        class="ml-2"
                      >
                        {{
                          site.schema ?? (site.type === "private" ? "AbstractPrivateSite" : "AbstractBittorrentSite")
                        }}
                      </v-chip>
                      <v-chip label size="x-small" color="green" class="ml-2">
                        {{ site.version ? "v" + site.version : "" }}
                      </v-chip>
                    </v-list-item-title>
                  </template>

                  <template #subtitle>
                    <v-list-item-subtitle
                      :title="site.description ?? ''"
                      class="text-decoration-none text-ellipsis"
                      style="max-width: 500px"
                    >
                      {{ site.description ?? "" }}
                    </v-list-item-subtitle>
                  </template>

                  <template #append>
                    <v-list-item-action>
                      {{ site.tags?.join(", ") ?? "" }}
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-window-item>
          <!-- 具体配置站点 -->
          <v-window-item :key="1">
            <Editor v-model="selectedSiteId!" />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          {{ $t("common.dialog.cancel") }}
        </v-btn>
        <v-btn v-if="currentStep === 1" color="blue-darken-1" variant="text" @click="currentStep--">
          <v-icon icon="mdi-chevron-left" />
          {{ $t("common.dialog.prev") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 0"
          :disabled="selectedSiteId == null"
          color="blue-darken-1"
          variant="text"
          @click="currentStep++"
        >
          {{ $t("common.dialog.next") }}
          <v-icon icon="mdi-chevron-right" />
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
          :disabled="!storedSiteUserConfig.valid"
          variant="text"
          color="success"
          @click="saveSite"
        >
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
