<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ISearchCategories, ISearchParamsMap } from "@ptd/site";
import { useVModel } from "@vueuse/core";


const componentProps = defineProps<{
  modelValue: ISearchParamsMap,
  categories?: ISearchCategories[],
  show?: boolean
}>();

const siteSearchParamsRef = useVModel(componentProps, "modelValue");
const showPanel = ref<any[]>([]);

onMounted(() => {
  componentProps.categories?.forEach((category, index) => {
    const definedSp = (siteSearchParamsRef.value[category.key] ??= (category.cross ? [] : category.options[0].value));
    if (Array.isArray(definedSp) && definedSp.length > 0) {
      showPanel.value.push(index);
    }
  });
});

function checkBtnIndeterminate (category: ISearchCategories): boolean {
  const field = siteSearchParamsRef.value[category.key];
  if (Array.isArray(field)) {
    return field.length !== category.options.length;
  }
  return false;
}

function clickAllBtn (field: ISearchCategories, toggle: boolean) {
  let fieldSp: any = [];
  if (toggle) {
    fieldSp = toggle ? field.options.map(sp => sp.value) : [];
  }

  siteSearchParamsRef.value[field.key] = fieldSp;
}
</script>

<template>
  <v-expansion-panels v-if="componentProps.categories?.length > 0" v-model="showPanel" multiple>
    {{ siteSearchParamsRef }}
    {{ showPanel }}
    <v-expansion-panel v-for="category in componentProps.categories" :key="category.key">
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
                :indeterminate="siteSearchParamsRef[category.key]?.length > 0 && checkBtnIndeterminate(category)"
                :model-value="!checkBtnIndeterminate(category)"
                hide-details
                @update:model-value="(e) => clickAllBtn(category, e)"
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
            <template v-if="category.cross?.mode">
              <v-col v-for="options in category.options" :key="options.value" cols="4">
                <v-checkbox
                  v-model="siteSearchParamsRef[category.key]"
                  :value="options.value"
                  :label="options.name"
                  hide-details
                />
              </v-col>
            </template>
            <v-radio-group
              v-else v-model="siteSearchParamsRef[category.key]"
              class="justify-space-between"
              hide-details
              inline
            >
              <v-radio
                v-for="options in category.options" :key="options.value"
                :value="options.value"
                :label="options.name"
              />
            </v-radio-group>
          </v-row>
        </v-container>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <div v-else>
    {{ $t('setSite.spDialog.noDefNotice') }}
  </div>
</template>

<style scoped>

</style>
