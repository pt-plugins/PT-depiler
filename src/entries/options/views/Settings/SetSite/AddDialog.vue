<script setup lang="ts">
import { provide, ref, shallowRef, computed } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import { ISiteMetadata, type ISiteUserConfig, type TSiteID } from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { getCanAddedSiteMetadata } from "./utils.ts";

import SiteFavicon from "@/options/components/SiteFavicon.vue";
import Editor from "./Editor.vue";

import { REPO_URL } from "~/helper.ts";

const showDialog = defineModel<boolean>();

const { t } = useI18n();
const metadataStore = useMetadataStore();

const currentStep = ref<0 | 1>(0);
const selectedSiteId = ref<TSiteID | null>(null);
const storedSiteUserConfig = ref<ISiteUserConfig>({});
const isFormValid = ref<boolean>(false);

provide("storedSiteUserConfig", storedSiteUserConfig);

function resetDialog() {
  currentStep.value = 0;
  selectedSiteId.value = null;
  storedSiteUserConfig.value = {};
}

const showDeadSite = ref<boolean>(false);
const allUnAddedSites = shallowRef<ISiteMetadata[]>([]);
const canAddSites = computed(() =>
  allUnAddedSites.value.filter((site) => (showDeadSite.value && site.isDead) || !site.isDead),
);

async function loadCanAddSites() {
  // Load the sites that can be added
  const sites = await getCanAddedSiteMetadata();
  allUnAddedSites.value = Object.values(sites);
}

async function saveSite() {
  await metadataStore.addSite(selectedSiteId.value!, storedSiteUserConfig.value!);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable @after-enter="loadCanAddSites" @after-leave="resetDialog">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("SetSite.add.title") }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            :href="`${REPO_URL}/wiki/config-site`"
            color="success"
            icon="mdi-help-circle"
            rel="noopener noreferrer nofollow"
            target="_blank"
          />
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-window v-model="currentStep">
          <!-- 选取可添加的站点 -->
          <v-window-item :value="0">
            <v-autocomplete
              v-model="selectedSiteId"
              :filter-keys="['raw.name', 'raw.urls', 'raw.aka']"
              :items="canAddSites"
              :messages="canAddSites.find((i) => i.id === selectedSiteId)?.description ?? ''"
              :multiple="false"
              :placeholder="selectedSiteId ? '' : t('SetSite.add.selectSitePlaceholder')"
              autofocus
              item-title="name"
              item-value="id"
              persistent-hint
            >
              <template #selection="{ item: { raw: site } }">
                <v-list-item>
                  <template #prepend>
                    <SiteFavicon :site-id="site.id" class="mr-2" />
                  </template>
                  <v-list-item-title :class="{ 'text-decoration-line-through': site.isDead }">
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
                      <b :class="{ 'text-decoration-line-through': site.isDead }">{{ site.name ?? "" }}</b>
                      <!-- 站点类型 -->
                      <v-chip
                        :color="site.type === 'private' ? 'primary' : 'secondary'"
                        class="ml-2"
                        label
                        size="x-small"
                      >
                        {{
                          site.schema ?? (site.type === "private" ? "AbstractPrivateSite" : "AbstractBittorrentSite")
                        }}
                      </v-chip>
                      <v-chip class="ml-2" color="green" label size="x-small">
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
          <v-window-item :value="1">
            <Editor v-model="selectedSiteId!" @update:form-valid="(v) => (isFormValid = v)" />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-switch
          v-if="currentStep === 0"
          v-model="showDeadSite"
          class="ml-5"
          color="success"
          density="compact"
          hide-details
          label="展示已死亡站点"
        />
        <v-spacer />
        <v-btn color="error" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
          color="blue-darken-1"
          prepend-icon="mdi-chevron-left"
          variant="text"
          @click="currentStep--"
        >
          {{ t("common.dialog.prev") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 0"
          :disabled="selectedSiteId == null"
          append-icon="mdi-chevron-right"
          color="blue-darken-1"
          variant="text"
          @click="currentStep++"
        >
          {{ t("common.dialog.next") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
          :disabled="!isFormValid"
          color="success"
          prepend-icon="mdi-check-circle-outline"
          variant="text"
          @click="saveSite"
        >
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
