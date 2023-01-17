<script lang="ts" setup>
import { ref, watch } from "vue";
import { REPO_URL } from "@/shared/constants";
import { asyncComputed, useVModel } from "@vueuse/core";
import { useSiteStore, siteFavicons } from "@/shared/store/site";
import Editor from "./Editor.vue";
import { type ISiteMetadata } from "@ptpp/site";

const siteStore = useSiteStore();

const componentProps = defineProps<{
  modelValue: boolean
}>();

const showDialog = useVModel(componentProps);

const currentStep = ref<0 | 1>(0);
const selectedSite = ref<ISiteMetadata | null>(null);

watch(showDialog, () => {
  currentStep.value = 0;
  selectedSite.value = null;
});

const canAddSites = asyncComputed(async () => await siteStore.getSites(siteStore.canAddedSiteIds));

function saveSite() {
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
        <!-- TODO want: v-stepper -->
        <v-window v-model="currentStep">
          <v-window-item :key="0">
            <v-autocomplete
              v-model="selectedSite"
              :items="canAddSites"
              :multiple="false"
              :placeholder="selectedSite ? '' : $t('setSite.add.selectSitePlaceholder')"
              :hint="selectedSite ? (selectedSite?.url + ': ' + (selectedSite?.description ?? '')) : ''"
              persistent-hint
            >
              <template #selection="{props, item}">
                <div class="v-list-item__prepend">
                  <v-avatar v-bind="props" size="x-small" :image="siteFavicons[item.raw.id] || ''" />
                </div>
                <v-list-item-title v-bind="props">
                  {{ item.raw.name ?? '' }}
                </v-list-item-title>
              </template>
              <template #item="{ props, item }">
                f
                <v-list-item
                  v-bind="props"
                  title=""
                  :prepend-avatar="siteFavicons[item.raw.id] || ''"
                  :subtitle="item.raw.url ?? ''"
                >
                  <template #append>
                    <v-list-item-action>
                      {{ item.raw.tags?.join(', ') ?? '' }}
                    </v-list-item-action>
                  </template>
                  <template #title>
                    <v-list-item-title>
                      <v-chip label size="x-small" :color="item.raw.type === 'public' ? 'green': 'amber'">
                        {{ item.raw.type.toUpperCase() }}
                      </v-chip>
                      {{ item.raw.name }}
                    </v-list-item-title>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-window-item>
          <v-window-item :key="1">
            <Editor v-model="selectedSite" />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          variant="text"
          @click="showDialog = false"
        >
          <v-icon icon="mdi-close-circle" />
          {{ $t("common.dialog.cancel") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
          color="blue-darken-1"
          variant="text"
          @click="currentStep--"
        >
          <v-icon icon="mdi-chevron-left" />
          {{ $t("common.dialog.prev") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 0"
          :disabled="selectedSite == null"
          color="blue-darken-1"
          variant="text"
          @click="currentStep++"
        >
          {{ $t("common.dialog.next") }}
          <v-icon icon="mdi-chevron-right" />
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
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

<style scoped>

</style>
