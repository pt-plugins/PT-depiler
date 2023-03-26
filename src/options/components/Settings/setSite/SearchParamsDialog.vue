<script lang="ts" setup>
import { useVModels } from "@vueuse/core";
import { ISiteRuntimeConfig } from "@/shared/adapters/site";
import { watch, ref } from "vue";
import { ISearchCategories, ISearchParams } from "@ptpp/site";
import { useSiteStore } from "@/shared/store/site";

const componentProps = defineProps<{
  modelValue: boolean,
  siteConfig: ISiteRuntimeConfig
}>();

const {
  modelValue: showDialog,
  siteConfig
} = useVModels(componentProps);

const siteSearchParams = ref<Record<ISearchCategories["name"], ISearchParams[]>>({});
const showPanel = ref<number[]>([]);

watch([showDialog, siteConfig], () => {
  siteSearchParams.value = {};
  showPanel.value = [];

  siteConfig.value.search?.categories?.forEach((category, index) => {
    const sp = siteConfig.value.defaultSearchParams
      ?.filter(searchParams => searchParams.key === category.key)
      .map(searchParams => ({key: category.key, value: searchParams.value})) ?? [];
    siteSearchParams.value[category.key] = sp;
    if (sp.length > 0) showPanel.value.push(index);

  });
});

function checkBtnIndeterminate (category: ISearchCategories): boolean {
  return siteSearchParams.value[category.key].length !== category.options.length;
}

function clickAllBtn (field: ISearchCategories["name"], toggle: boolean) {
  let fieldSp: ISearchParams[] = [];
  if (toggle) {
    const cat = siteConfig.value.search?.categories?.find(cat => cat.key === field);
    if (cat) {
      fieldSp = cat.options.map(sp => ({key: cat.key, value: sp.value}));
    }
  }

  siteSearchParams.value[field] = fieldSp;
}

function saveSiteSearchParams () {
  const siteStore = useSiteStore();
  const defaultSearchParams: ISearchParams[] = [];
  Object.values(siteSearchParams.value).forEach(params => {
    if (params.length > 0) {
      defaultSearchParams.push(...params);
    }
  });

  siteConfig.value.defaultSearchParams = defaultSearchParams;
  siteStore.patchSite(siteConfig.value);

  showDialog.value = false;
}
</script>


<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey darken-2">
          <v-toolbar-title>{{ $t('setSite.spDialog.title', {name: siteConfig.name}) }}</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-alert color="warning" class="mb-2">
          {{ $t('setSite.spDialog.notice') }}
        </v-alert>
        <v-expansion-panels v-if="siteConfig.search?.categories?.length > 0" v-model="showPanel" multiple>
          <v-expansion-panel v-for="category in siteConfig.search.categories" :key="category.key">
            <v-expansion-panel-title>
              {{ category.name }}
              <v-spacer />
              <v-chip label>
                Key: {{ category.key }}
              </v-chip>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-container class="pa-0">
                <v-row v-if="category.cross?.mode" no-gutters>
                  <v-col cols="12">
                    <v-checkbox
                      :indeterminate="siteSearchParams[category.key].length > 0 && checkBtnIndeterminate(category)"
                      :model-value="!checkBtnIndeterminate(category)"
                      hide-details
                      @update:model-value="(e) => clickAllBtn(category.key, e)"
                    >
                      <template #label>
                        <p class="font-weight-bold">
                          {{ $t('common.checkbox.all') }}
                        </p>
                        <p v-if="!checkBtnIndeterminate(category)" class="text-red-lighten-1">
                          &nbsp;{{ $t('setSite.spDialog.selectAllNotice') }}
                        </p>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col v-for="options in category.options" :key="options.value" cols="4">
                    <component
                      :is="category.cross?.mode ? 'v-checkbox' : 'v-radio'"
                      v-model="siteSearchParams[category.key]"
                      :value="{key: category.key, value: options.value}"
                      :label="options.name"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <div v-else>
          {{ $t('setSite.spDialog.noDefNotice') }}
        </div>
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
          variant="text"
          color="success"
          @click="saveSiteSearchParams"
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
