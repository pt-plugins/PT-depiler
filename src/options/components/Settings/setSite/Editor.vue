<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { computed } from "vue";
import { ISiteMetadata } from "@ptpp/site";

const componentProps = defineProps<{
  modelValue: ISiteMetadata
}>();

const siteConfig = useVModel(componentProps);

function creatComputedConfig<K = keyof ISiteMetadata, V = any> (key: K, options?: { default?: any }) {
  return computed<V>({
    get () {
      // @ts-ignore
      return siteConfig.value[key] ?? siteConfig.value[key] ?? options?.default;
    },

    set (newValue) {
      // @ts-ignore
      siteConfig.value[key] = newValue;
    }
  });
}

const siteTags = creatComputedConfig("tags", { default: [] });
const siteSortIndex = creatComputedConfig("sortIndex", { default: 100 });
</script>

<template>
  <v-card class="mb-5">
    <v-form ref="formRef">
      <v-text-field v-model="siteConfig.name" :label="$t('setSite.common.name')" disabled />
      <v-text-field v-model="siteConfig.schema" :label="$t('setSite.common.type')" disabled />
      <v-text-field v-model="siteConfig.url" :label="$t('setSite.common.url')" disabled />

      <v-combobox
        v-model="siteTags" chips
        multiple
        :label="$t('setSite.common.tags')"
        :hint="$t('setSite.editor.tagTip')"
        persistent-hint
      />

      <v-text-field
        v-model="siteSortIndex"
        :label="$t('setSite.editor.sortIndex')"
        :placeholder="$t('setSite.editor.sortIndexTip')"
        type="number"
      />
    </v-form>
  </v-card>
</template>

<style scoped>

</style>
