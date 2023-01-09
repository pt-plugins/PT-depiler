<script lang="ts" setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import { REPO_URL } from "@/shared/constants";
import { definitionList, getSite, getFavicon, ISiteMetadata } from "@ptpp/site";
import { useSiteStore } from "@/shared/store/site";
import { difference } from "lodash-es";
import { useVModel } from "@vueuse/core";

const siteStore = useSiteStore();

const componentProps = defineProps<{
  modelValue: boolean
}>();

const showDialog = useVModel(componentProps);

const currentStep = ref<0 | 1>(0);
const selectedSiteName = ref<string | null>(null);

const canAddDefinitionList = computed(() => difference(definitionList, siteStore.addedSiteIds));

const definitionListMeta = reactive<Record<string, {config: ISiteMetadata, favicon: string}>>({});

function saveSite() {
  showDialog.value = false;
}

// 当model的可见性发生变化时，清空 step 以及 selectedClientType
watch(showDialog, () => {
  currentStep.value = 0;
  selectedSiteName.value = null;
});

onMounted(() => {
  canAddDefinitionList.value.forEach(async (def) => {
    const siteInstance = await getSite(def);
    const favicon = await getFavicon(siteInstance);
    definitionListMeta[def] = {
      config: siteInstance.config,
      favicon
    };
  });
});
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
              v-model="selectedSiteName"
              :items="definitionList"
              :multiple="false"
              :placeholder="selectedSiteName ? '' : $t('setSite.add.selectSitePlaceholder')"
              :hint="definitionListMeta[selectedSiteName]?.config ? (definitionListMeta[selectedSiteName]?.config?.url + ': ' + definitionListMeta[selectedSiteName]?.config?.description) : ''"
              persistent-hint
            >
              <template #selection="{props, item}">
                <div class="v-list-item__prepend">
                  <v-avatar v-bind="props" size="x-small" :image="definitionListMeta[item.raw]?.favicon" />
                </div>
                <v-list-item-title v-bind="props">
                  {{ definitionListMeta[item.raw]?.config.name ?? item.raw }}
                </v-list-item-title>
              </template>
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="definitionListMeta[item.raw]?.favicon"
                  :subtitle="definitionListMeta[item.raw]?.config.url ?? ''"
                >
                  <template #append>
                    <v-list-item-action>
                      {{ definitionListMeta[item.raw]?.config.tags?.join(', ') ?? '' }}
                    </v-list-item-action>
                  </template>
                  <template #title>
                    <v-list-item-title>
                      <v-chip label size="x-small" :color="definitionListMeta[item.raw]?.config.type === 'public' ? 'green': 'amber'">
                        {{ definitionListMeta[item.raw]?.config.type.toUpperCase() }}
                      </v-chip>
                      {{ definitionListMeta[item.raw]?.config.name ?? item.raw }}
                    </v-list-item-title>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-window-item>
          <v-window-item :key="1" />  <!-- TODO -->
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
          :disabled="selectedSiteName == null"
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
